import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ExchangeRatesService } from './exchange-rates.service';
import { CreateExchangeRateDto } from './dto/create-exchange-rate.dto';
import { UpdateExchangeRateDto } from './dto/update-exchange-rate.dto';
import { GetExchangeRatesDto } from './dto/get-exchange-rates.dto';
import { ExchangeRate } from '../entities/exchange-rate.entity';
import { SimpleAuthGuard } from '../common/guards/simple-auth.guard';

@ApiTags('Exchange Rates')
@Controller('exchange-rates')
export class ExchangeRatesController {
  constructor(private readonly exchangeRatesService: ExchangeRatesService) {}

  @Post()
  @UseGuards(SimpleAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create a new exchange rate' })
  @ApiResponse({ status: 201, description: 'Exchange rate created successfully' })
  async create(
    @Body() createDto: CreateExchangeRateDto,
  ): Promise<ExchangeRate> {
    return this.exchangeRatesService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all exchange rates' })
  @ApiResponse({ status: 200, description: 'Exchange rates retrieved successfully' })
  async findAll(@Query() query: GetExchangeRatesDto) {
    return this.exchangeRatesService.findAll(query);
  }

  @Get('from/:fromCode/to/:toCode')
  @ApiOperation({ summary: 'Get exchange rate between two currencies' })
  @ApiResponse({ status: 200, description: 'Exchange rate retrieved successfully' })
  async getRate(
    @Param('fromCode') fromCode: string,
    @Param('toCode') toCode: string,
  ): Promise<ExchangeRate> {
    return this.exchangeRatesService.getRate(fromCode, toCode);
  }

  @Get('currency/:currencyCode')
  @ApiOperation({ summary: 'Get all exchange rates for a currency' })
  @ApiResponse({ status: 200, description: 'Exchange rates retrieved successfully' })
  async getRatesForCurrency(
    @Param('currencyCode') currencyCode: string,
  ): Promise<ExchangeRate[]> {
    return this.exchangeRatesService.getAllRatesForCurrency(currencyCode);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get exchange rate by ID' })
  @ApiResponse({ status: 200, description: 'Exchange rate retrieved successfully' })
  async findOne(@Param('id') id: string): Promise<ExchangeRate> {
    return this.exchangeRatesService.findOne(id);
  }

  @Put(':id')
  @UseGuards(SimpleAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update exchange rate' })
  @ApiResponse({ status: 200, description: 'Exchange rate updated successfully' })
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdateExchangeRateDto,
  ): Promise<ExchangeRate> {
    return this.exchangeRatesService.update(id, updateDto);
  }

  @Delete(':id')
  @UseGuards(SimpleAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Delete exchange rate' })
  @ApiResponse({ status: 200, description: 'Exchange rate deleted successfully' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.exchangeRatesService.remove(id);
  }
}
