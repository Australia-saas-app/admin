import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ExchangeRate } from '../entities/exchange-rate.entity';
import { Currency } from '../entities/currency.entity';
import { CreateExchangeRateDto } from './dto/create-exchange-rate.dto';
import { UpdateExchangeRateDto } from './dto/update-exchange-rate.dto';
import { GetExchangeRatesDto } from './dto/get-exchange-rates.dto';

@Injectable()
export class ExchangeRatesService {
  constructor(
    @InjectRepository(ExchangeRate)
    private readonly exchangeRateRepository: Repository<ExchangeRate>,
    @InjectRepository(Currency)
    private readonly currencyRepository: Repository<Currency>,
  ) {}

  async create(createDto: CreateExchangeRateDto, updatedBy?: string): Promise<ExchangeRate> {
    const fromCurrency = await this.currencyRepository.findOne({
      where: { code: createDto.fromCurrencyCode.toUpperCase() },
    });
    if (!fromCurrency) {
      throw new NotFoundException(`Currency ${createDto.fromCurrencyCode} not found`);
    }

    const toCurrency = await this.currencyRepository.findOne({
      where: { code: createDto.toCurrencyCode.toUpperCase() },
    });
    if (!toCurrency) {
      throw new NotFoundException(`Currency ${createDto.toCurrencyCode} not found`);
    }

    // Check for existing active rate
    const existing = await this.exchangeRateRepository.findOne({
      where: {
        fromCurrencyId: fromCurrency.id,
        toCurrencyId: toCurrency.id,
        isActive: true,
      },
    });

    if (existing) {
      throw new ConflictException('An active exchange rate already exists for this currency pair');
    }

    const exchangeRate = this.exchangeRateRepository.create({
      fromCurrencyId: fromCurrency.id,
      toCurrencyId: toCurrency.id,
      rate: createDto.rate,
      effectiveDate: createDto.effectiveDate ? new Date(createDto.effectiveDate) : new Date(),
      expiresAt: createDto.expiresAt ? new Date(createDto.expiresAt) : undefined,
      source: createDto.source || 'manual',
      isManual: true,
      isActive: true,
      updatedBy,
    });

    return this.exchangeRateRepository.save(exchangeRate);
  }

  async findAll(query: GetExchangeRatesDto) {
    const { fromCurrencyCode, toCurrencyCode, isActive, page = 1, limit = 20 } = query;

    const queryBuilder = this.exchangeRateRepository
      .createQueryBuilder('rate')
      .leftJoinAndSelect('rate.fromCurrency', 'fromCurrency')
      .leftJoinAndSelect('rate.toCurrency', 'toCurrency');

    if (fromCurrencyCode) {
      queryBuilder.andWhere('fromCurrency.code = :fromCode', {
        fromCode: fromCurrencyCode.toUpperCase(),
      });
    }

    if (toCurrencyCode) {
      queryBuilder.andWhere('toCurrency.code = :toCode', {
        toCode: toCurrencyCode.toUpperCase(),
      });
    }

    if (isActive !== undefined) {
      queryBuilder.andWhere('rate.isActive = :isActive', { isActive });
    }

    queryBuilder.orderBy('rate.effectiveDate', 'DESC');

    const skip = (page - 1) * limit;
    queryBuilder.skip(skip).take(limit);

    const [rates, total] = await queryBuilder.getManyAndCount();

    // Transform to include currency codes
    const data = rates.map((rate) => ({
      id: rate.id,
      fromCurrencyCode: rate.fromCurrency?.code,
      toCurrencyCode: rate.toCurrency?.code,
      rate: rate.rate,
      effectiveDate: rate.effectiveDate,
      expiresAt: rate.expiresAt,
      isActive: rate.isActive,
      isManual: rate.isManual,
      source: rate.source,
      updatedBy: rate.updatedBy,
      createdAt: rate.createdAt,
      updatedAt: rate.updatedAt,
    }));

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string): Promise<ExchangeRate> {
    const rate = await this.exchangeRateRepository.findOne({
      where: { id },
      relations: ['fromCurrency', 'toCurrency'],
    });
    if (!rate) {
      throw new NotFoundException(`Exchange rate with ID ${id} not found`);
    }
    return rate;
  }

  async getRate(fromCurrencyCode: string, toCurrencyCode: string): Promise<ExchangeRate> {
    const fromCurrency = await this.currencyRepository.findOne({
      where: { code: fromCurrencyCode.toUpperCase() },
    });
    if (!fromCurrency) {
      throw new NotFoundException(`Currency ${fromCurrencyCode} not found`);
    }

    const toCurrency = await this.currencyRepository.findOne({
      where: { code: toCurrencyCode.toUpperCase() },
    });
    if (!toCurrency) {
      throw new NotFoundException(`Currency ${toCurrencyCode} not found`);
    }

    // Try direct rate
    let rate = await this.exchangeRateRepository.findOne({
      where: {
        fromCurrencyId: fromCurrency.id,
        toCurrencyId: toCurrency.id,
        isActive: true,
      },
      relations: ['fromCurrency', 'toCurrency'],
      order: { effectiveDate: 'DESC' },
    });

    // If no direct rate, try inverse
    if (!rate) {
      rate = await this.exchangeRateRepository.findOne({
        where: {
          fromCurrencyId: toCurrency.id,
          toCurrencyId: fromCurrency.id,
          isActive: true,
        },
        relations: ['fromCurrency', 'toCurrency'],
        order: { effectiveDate: 'DESC' },
      });

      if (rate) {
        // Create inverse rate on the fly
        rate = {
          ...rate,
          id: `inverse-${rate.id}`,
          rate: 1 / Number(rate.rate),
          fromCurrency: rate.toCurrency,
          toCurrency: rate.fromCurrency,
        } as ExchangeRate;
      }
    }

    // If still no rate, calculate via base currency
    if (!rate && fromCurrency.isBase) {
      const toBaseRate = await this.getRateThroughBase(toCurrencyCode, fromCurrencyCode);
      if (toBaseRate) return toBaseRate;
    }

    if (!rate) {
      throw new NotFoundException(
        `Exchange rate from ${fromCurrencyCode} to ${toCurrencyCode} not found`,
      );
    }

    return rate;
  }

  private async getRateThroughBase(
    fromCurrencyCode: string,
    toCurrencyCode: string,
  ): Promise<ExchangeRate | null> {
    const fromCurrency = await this.currencyRepository.findOne({
      where: { code: fromCurrencyCode.toUpperCase() },
    });
    const toCurrency = await this.currencyRepository.findOne({
      where: { code: toCurrencyCode.toUpperCase() },
    });

    if (!fromCurrency || !toCurrency) return null;

    // Get rates to base currency
    const fromToBase = await this.exchangeRateRepository.findOne({
      where: { fromCurrencyId: fromCurrency.id, toCurrencyId: toCurrency.id, isActive: true },
      relations: ['fromCurrency', 'toCurrency'],
      order: { effectiveDate: 'DESC' },
    });

    if (!fromToBase) return null;

    return fromToBase;
  }

  async update(id: string, updateDto: UpdateExchangeRateDto): Promise<ExchangeRate> {
    const rate = await this.findOne(id);
    Object.assign(rate, updateDto);
    return this.exchangeRateRepository.save(rate);
  }

  async remove(id: string): Promise<void> {
    const rate = await this.findOne(id);
    await this.exchangeRateRepository.remove(rate);
  }

  async getAllRatesForCurrency(currencyCode: string): Promise<ExchangeRate[]> {
    const currency = await this.currencyRepository.findOne({
      where: { code: currencyCode.toUpperCase() },
    });
    if (!currency) {
      throw new NotFoundException(`Currency ${currencyCode} not found`);
    }

    return this.exchangeRateRepository.find({
      where: [
        { fromCurrencyId: currency.id, isActive: true },
        { toCurrencyId: currency.id, isActive: true },
      ],
      relations: ['fromCurrency', 'toCurrency'],
      order: { effectiveDate: 'DESC' },
    });
  }
}
