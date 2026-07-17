import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConversionController } from './conversion.controller';
import { ConversionService } from './conversion.service';
import { ExchangeRate } from '../entities/exchange-rate.entity';
import { CurrencyConversionLog } from '../entities/currency-conversion-log.entity';
import { Currency } from '../entities/currency.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ExchangeRate, CurrencyConversionLog, Currency]),
  ],
  controllers: [ConversionController],
  providers: [ConversionService],
  exports: [ConversionService],
})
export class ConversionModule {}
