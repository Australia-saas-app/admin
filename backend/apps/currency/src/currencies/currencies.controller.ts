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
import { CurrenciesService } from './currencies.service';
import { CreateCurrencyDto } from './dto/create-currency.dto';
import { UpdateCurrencyDto } from './dto/update-currency.dto';
import { GetCurrenciesDto } from './dto/get-currencies.dto';
import { Currency } from '../entities/currency.entity';
import { SimpleAuthGuard } from '../common/guards/simple-auth.guard';

@ApiTags('Currencies')
@Controller('currencies')
export class CurrenciesController {
  constructor(private readonly currenciesService: CurrenciesService) {}

  @Post()
  @UseGuards(SimpleAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create a new currency' })
  @ApiResponse({ status: 201, description: 'Currency created successfully' })
  async create(@Body() createCurrencyDto: CreateCurrencyDto): Promise<Currency> {
    return this.currenciesService.create(createCurrencyDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all currencies' })
  @ApiResponse({ status: 200, description: 'Currencies retrieved successfully' })
  async findAll(@Query() query: GetCurrenciesDto) {
    return this.currenciesService.findAll(query);
  }

  @Get('active')
  @ApiOperation({ summary: 'Get all active currencies' })
  @ApiResponse({ status: 200, description: 'Active currencies retrieved successfully' })
  async getActiveCurrencies(): Promise<Currency[]> {
    return this.currenciesService.getActiveCurrencies();
  }

  @Get('base')
  @ApiOperation({ summary: 'Get base currency' })
  @ApiResponse({ status: 200, description: 'Base currency retrieved successfully' })
  async getBaseCurrency(): Promise<Currency | null> {
    return this.currenciesService.getBaseCurrency();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get currency by ID' })
  @ApiResponse({ status: 200, description: 'Currency retrieved successfully' })
  async findOne(@Param('id') id: string): Promise<Currency> {
    return this.currenciesService.findOne(id);
  }

  @Get('code/:code')
  @ApiOperation({ summary: 'Get currency by code' })
  @ApiResponse({ status: 200, description: 'Currency retrieved successfully' })
  async findByCode(@Param('code') code: string): Promise<Currency> {
    return this.currenciesService.findByCode(code);
  }

  @Put(':id')
  @UseGuards(SimpleAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update currency' })
  @ApiResponse({ status: 200, description: 'Currency updated successfully' })
  async update(
    @Param('id') id: string,
    @Body() updateCurrencyDto: UpdateCurrencyDto,
  ): Promise<Currency> {
    return this.currenciesService.update(id, updateCurrencyDto);
  }

  @Delete(':id')
  @UseGuards(SimpleAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Delete currency' })
  @ApiResponse({ status: 200, description: 'Currency deleted successfully' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.currenciesService.remove(id);
  }
}
