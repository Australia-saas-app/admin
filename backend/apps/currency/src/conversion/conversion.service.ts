import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ExchangeRate } from '../entities/exchange-rate.entity';
import { CurrencyConversionLog } from '../entities/currency-conversion-log.entity';
import { Currency } from '../entities/currency.entity';
import { ConvertCurrencyDto } from './dto/convert-currency.dto';

@Injectable()
export class ConversionService {
  constructor(
    @InjectRepository(ExchangeRate)
    private readonly exchangeRateRepository: Repository<ExchangeRate>,
    @InjectRepository(CurrencyConversionLog)
    private readonly conversionLogRepository: Repository<CurrencyConversionLog>,
    @InjectRepository(Currency)
    private readonly currencyRepository: Repository<Currency>,
  ) {}

  async convert(
    dto: ConvertCurrencyDto,
    userId?: string,
  ): Promise<{
    fromCurrency: string;
    toCurrency: string;
    fromAmount: number;
    toAmount: number;
    exchangeRate: number;
    formatted: {
      from: string;
      to: string;
    };
  }> {
    const { fromCurrency: fromCode, toCurrency: toCode, amount } = dto;

    // Get currencies
    const fromCurrency = await this.currencyRepository.findOne({
      where: { code: fromCode.toUpperCase() },
    });
    if (!fromCurrency) {
      throw new NotFoundException(`Currency ${fromCode} not found`);
    }

    const toCurrency = await this.currencyRepository.findOne({
      where: { code: toCode.toUpperCase() },
    });
    if (!toCurrency) {
      throw new NotFoundException(`Currency ${toCode} not found`);
    }

    // Get exchange rate
    const rate = await this.getExchangeRate(fromCurrency.id, toCurrency.id);

    // Calculate converted amount
    const toAmount = Number(amount) * Number(rate.rate);

    // Log the conversion (use 'guest' if no userId)
    const logUserId = userId || 'guest';
    await this.conversionLogRepository.save({
      userId: logUserId,
      fromCurrencyCode: fromCurrency.code,
      toCurrencyCode: toCurrency.code,
      fromAmount: amount,
      toAmount,
      exchangeRate: rate.rate,
      serviceName: dto.serviceName,
      referenceId: dto.referenceId,
      referenceType: dto.referenceType,
    });

    return {
      fromCurrency: fromCurrency.code,
      toCurrency: toCurrency.code,
      fromAmount: amount,
      toAmount,
      exchangeRate: Number(rate.rate),
      formatted: {
        from: this.formatCurrency(amount, fromCurrency),
        to: this.formatCurrency(toAmount, toCurrency),
      },
    };
  }

  private async getExchangeRate(
    fromCurrencyId: string,
    toCurrencyId: string,
  ): Promise<ExchangeRate> {
    // Try direct rate
    let rate = await this.exchangeRateRepository.findOne({
      where: {
        fromCurrencyId,
        toCurrencyId,
        isActive: true,
      },
      order: { effectiveDate: 'DESC' },
    });

    // Try inverse rate
    if (!rate) {
      const inverseRate = await this.exchangeRateRepository.findOne({
        where: {
          fromCurrencyId: toCurrencyId,
          toCurrencyId: fromCurrencyId,
          isActive: true,
        },
        order: { effectiveDate: 'DESC' },
      });

      if (inverseRate) {
        rate = {
          ...inverseRate,
          rate: 1 / Number(inverseRate.rate),
        } as ExchangeRate;
      }
    }

    // Try via base currency
    if (!rate) {
      const fromCurrency = await this.currencyRepository.findOne({
        where: { id: fromCurrencyId },
      });
      const toCurrency = await this.currencyRepository.findOne({
        where: { id: toCurrencyId },
      });

      if (fromCurrency?.isBase) {
        const toBaseRate = await this.exchangeRateRepository.findOne({
          where: {
            fromCurrencyId: fromCurrencyId,
            toCurrencyId: toCurrencyId,
            isActive: true,
          },
          order: { effectiveDate: 'DESC' },
        });
        if (toBaseRate) rate = toBaseRate;
      } else if (toCurrency?.isBase) {
        const fromBaseRate = await this.exchangeRateRepository.findOne({
          where: {
            fromCurrencyId: toCurrencyId,
            toCurrencyId: fromCurrencyId,
            isActive: true,
          },
          order: { effectiveDate: 'DESC' },
        });
        if (fromBaseRate) {
          rate = {
            ...fromBaseRate,
            rate: 1 / Number(fromBaseRate.rate),
          } as ExchangeRate;
        }
      }
    }

    if (!rate) {
      throw new NotFoundException(
        `Exchange rate not found for conversion`,
      );
    }

    return rate;
  }

  formatCurrency(amount: number, currency: Currency): string {
    const formatter = new Intl.NumberFormat(currency.locale || 'en-US', {
      style: 'currency',
      currency: currency.code,
      minimumFractionDigits: currency.decimalPlaces,
      maximumFractionDigits: currency.decimalPlaces,
    });

    return formatter.format(amount);
  }

  async getConversionHistory(
    userId: string,
    page: number = 1,
    limit: number = 20,
  ) {
    const skip = (page - 1) * limit;

    const [logs, total] = await this.conversionLogRepository.findAndCount({
      where: { userId },
      order: { createdAt: 'DESC' },
      skip,
      take: limit,
    });

    return {
      data: logs,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async getConversionStats(userId: string) {
    const stats = await this.conversionLogRepository
      .createQueryBuilder('log')
      .select('log.fromCurrencyCode', 'fromCurrency')
      .addSelect('log.toCurrencyCode', 'toCurrency')
      .addSelect('COUNT(*)', 'count')
      .addSelect('SUM(log.fromAmount)', 'totalFromAmount')
      .addSelect('SUM(log.toAmount)', 'totalToAmount')
      .where('log.userId = :userId', { userId })
      .groupBy('log.fromCurrencyCode')
      .addGroupBy('log.toCurrencyCode')
      .getRawMany();

    return stats;
  }
}
