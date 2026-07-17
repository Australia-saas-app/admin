import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ConversionService } from './conversion.service';
import { ConvertCurrencyDto } from './dto/convert-currency.dto';
import { SimpleAuthGuard } from '../common/guards/simple-auth.guard';

@ApiTags('Conversion')
@Controller('conversion')
export class ConversionController {
  constructor(private readonly conversionService: ConversionService) {}

  @Post()
  @UseGuards(SimpleAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Convert amount from one currency to another' })
  @ApiResponse({ status: 200, description: 'Conversion successful' })
  async convert(
    @Body() dto: ConvertCurrencyDto,
    @Request() req: any,
  ): Promise<any> {
    const userId = req?.user?.userId;
    return this.conversionService.convert(dto, userId);
  }

  @Get('history')
  @UseGuards(SimpleAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get user conversion history' })
  @ApiResponse({ status: 200, description: 'History retrieved successfully' })
  async getHistory(
    @Request() req: any,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
  ) {
    return this.conversionService.getConversionHistory(
      req.user.userId,
      Number(page) || 1,
      Number(limit) || 20,
    );
  }

  @Get('stats')
  @UseGuards(SimpleAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get user conversion statistics' })
  @ApiResponse({ status: 200, description: 'Stats retrieved successfully' })
  async getStats(@Request() req: any) {
    return this.conversionService.getConversionStats(req.user.userId);
  }
}
