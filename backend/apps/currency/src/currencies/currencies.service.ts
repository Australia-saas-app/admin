import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Currency } from '../entities/currency.entity';
import { CreateCurrencyDto } from './dto/create-currency.dto';
import { UpdateCurrencyDto } from './dto/update-currency.dto';
import { GetCurrenciesDto } from './dto/get-currencies.dto';

@Injectable()
export class CurrenciesService {
  constructor(
    @InjectRepository(Currency)
    private readonly currencyRepository: Repository<Currency>,
  ) {}

  async create(createCurrencyDto: CreateCurrencyDto): Promise<Currency> {
    const existing = await this.currencyRepository.findOne({
      where: { code: createCurrencyDto.code.toUpperCase() },
    });

    if (existing) {
      throw new ConflictException(`Currency with code ${createCurrencyDto.code} already exists`);
    }

    // If this is set as base, unset other bases
    if (createCurrencyDto.isBase) {
      await this.currencyRepository.update({ isBase: true }, { isBase: false });
    }

    const currency = this.currencyRepository.create({
      ...createCurrencyDto,
      code: createCurrencyDto.code.toUpperCase(),
    });

    return this.currencyRepository.save(currency);
  }

  async findAll(query: GetCurrenciesDto) {
    const { code, search, isActive, isCrypto, page = 1, limit = 20 } = query;

    const queryBuilder = this.currencyRepository.createQueryBuilder('currency');

    if (code) {
      queryBuilder.andWhere('currency.code = :code', { code: code.toUpperCase() });
    }

    if (search) {
      queryBuilder.andWhere(
        '(currency.name ILIKE :search OR currency.code ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    if (isActive !== undefined) {
      queryBuilder.andWhere('currency.isActive = :isActive', { isActive });
    }

    if (isCrypto !== undefined) {
      queryBuilder.andWhere('currency.isCrypto = :isCrypto', { isCrypto });
    }

    queryBuilder.orderBy('currency.code', 'ASC');

    const skip = (page - 1) * limit;
    queryBuilder.skip(skip).take(limit);

    const [currencies, total] = await queryBuilder.getManyAndCount();

    return {
      data: currencies,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string): Promise<Currency> {
    const currency = await this.currencyRepository.findOne({ where: { id } });
    if (!currency) {
      throw new NotFoundException(`Currency with ID ${id} not found`);
    }
    return currency;
  }

  async findByCode(code: string): Promise<Currency> {
    const currency = await this.currencyRepository.findOne({
      where: { code: code.toUpperCase() },
    });
    if (!currency) {
      throw new NotFoundException(`Currency with code ${code} not found`);
    }
    return currency;
  }

  async update(id: string, updateCurrencyDto: UpdateCurrencyDto): Promise<Currency> {
    const currency = await this.findOne(id);

    // If setting as base, unset other bases
    if (updateCurrencyDto.isBase && !currency.isBase) {
      await this.currencyRepository.update({ isBase: true }, { isBase: false });
    }

    Object.assign(currency, updateCurrencyDto);
    return this.currencyRepository.save(currency);
  }

  async remove(id: string): Promise<void> {
    const currency = await this.findOne(id);
    await this.currencyRepository.remove(currency);
  }

  async getActiveCurrencies(): Promise<Currency[]> {
    return this.currencyRepository.find({
      where: { isActive: true },
      order: { code: 'ASC' },
    });
  }

  async getBaseCurrency(): Promise<Currency | null> {
    return this.currencyRepository.findOne({ where: { isBase: true } });
  }
}
