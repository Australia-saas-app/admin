import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

export interface CurrencyConversion {
  from: string;
  to: string;
  amount: number;
  convertedAmount: number;
  rate: number;
  timestamp: Date;
}

export interface ExchangeRate {
  base: string;
  rates: Record<string, number>;
  timestamp: Date;
}

@Injectable()
export class CurrencyService {
  private readonly logger = new Logger(CurrencyService.name);
  private readonly supportedCurrencies = ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'JPY', 'CHF', 'CNY', 'INR'];
  private exchangeRates: Map<string, ExchangeRate> = new Map();
  private readonly cacheTimeout = 60 * 60 * 1000; // 1 hour

  constructor(private readonly configService: ConfigService) {}

  /**
   * Convert amount from one currency to another
   */
  async convertCurrency(
    amount: number,
    fromCurrency: string,
    toCurrency: string
  ): Promise<CurrencyConversion> {
    if (amount < 0) {
      throw new BadRequestException('Amount must be positive');
    }

    if (!this.isSupportedCurrency(fromCurrency) || !this.isSupportedCurrency(toCurrency)) {
      throw new BadRequestException('Unsupported currency');
    }

    if (fromCurrency === toCurrency) {
      return {
        from: fromCurrency,
        to: toCurrency,
        amount,
        convertedAmount: amount,
        rate: 1,
        timestamp: new Date(),
      };
    }

    const rate = await this.getExchangeRate(fromCurrency, toCurrency);
    const convertedAmount = Math.round((amount * rate) * 100) / 100; // Round to 2 decimal places

    return {
      from: fromCurrency,
      to: toCurrency,
      amount,
      convertedAmount,
      rate,
      timestamp: new Date(),
    };
  }

  /**
   * Get exchange rate between two currencies
   */
  async getExchangeRate(fromCurrency: string, toCurrency: string): Promise<number> {
    if (fromCurrency === toCurrency) {
      return 1;
    }

    // Try to get from cache first
    const cachedRate = this.getCachedRate(fromCurrency, toCurrency);
    if (cachedRate) {
      return cachedRate;
    }

    // Fetch from external API
    const rates = await this.fetchExchangeRates(fromCurrency);
    const rate = rates[toCurrency];

    if (!rate) {
      throw new BadRequestException(`Exchange rate not available for ${fromCurrency} to ${toCurrency}`);
    }

    // Cache the rates
    this.cacheRates(fromCurrency, rates);

    return rate;
  }

  /**
   * Get all supported currencies
   */
  getSupportedCurrencies(): string[] {
    return [...this.supportedCurrencies];
  }

  /**
   * Check if currency is supported
   */
  isSupportedCurrency(currency: string): boolean {
    return this.supportedCurrencies.includes(currency.toUpperCase());
  }

  /**
   * Format amount with currency symbol
   */
  formatAmount(amount: number, currency: string): string {
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
    });
    return formatter.format(amount);
  }

  /**
   * Validate currency code
   */
  validateCurrency(currency: string): boolean {
    return /^[A-Z]{3}$/.test(currency) && this.isSupportedCurrency(currency);
  }

  private getCachedRate(fromCurrency: string, toCurrency: string): number | null {
    const cacheKey = fromCurrency.toUpperCase();
    const cached = this.exchangeRates.get(cacheKey);

    if (!cached || Date.now() - cached.timestamp.getTime() > this.cacheTimeout) {
      return null;
    }

    return cached.rates[toCurrency.toUpperCase()] || null;
  }

  private async fetchExchangeRates(baseCurrency: string): Promise<Record<string, number>> {
    const apiKey = this.configService.get<string>('EXCHANGE_RATE_API_KEY');
    const apiUrl = this.configService.get<string>('EXCHANGE_RATE_API_URL', 'https://api.exchangerate-api.com/v4/latest/');

    try {
      const response = await axios.get(`${apiUrl}${baseCurrency}`, {
        headers: apiKey ? { 'Authorization': `Bearer ${apiKey}` } : {},
        timeout: 5000,
      });

      return response.data.rates;
    } catch (error: any) {
      this.logger.error('Failed to fetch exchange rates', error);

      // Fallback to hardcoded rates if API fails
      return this.getFallbackRates(baseCurrency);
    }
  }

  private cacheRates(baseCurrency: string, rates: Record<string, number>): void {
    this.exchangeRates.set(baseCurrency.toUpperCase(), {
      base: baseCurrency.toUpperCase(),
      rates,
      timestamp: new Date(),
    });
  }

  private getFallbackRates(baseCurrency: string): Record<string, number> {
    // Fallback exchange rates (approximate, should be updated regularly)
    const fallbackRates: Record<string, Record<string, number>> = {
      'USD': {
        'EUR': 0.85,
        'GBP': 0.73,
        'CAD': 1.25,
        'AUD': 1.35,
        'JPY': 110.0,
        'CHF': 0.92,
        'CNY': 6.45,
        'INR': 74.0,
      },
      // Add more fallback rates as needed
    };

    return fallbackRates[baseCurrency.toUpperCase()] || {};
  }
}