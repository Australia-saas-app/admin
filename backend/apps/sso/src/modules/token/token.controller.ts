import { Body, Controller, HttpCode, HttpStatus, Post, Req } from '@nestjs/common';
import { Request } from 'express';
import { TokenService } from './token.service';
import { TokenRequestDto } from './dto/token-request.dto';

@Controller('sso/token')
export class TokenController {
  constructor(private readonly tokenService: TokenService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  async token(@Body() body: TokenRequestDto, @Req() req: Request) {
    return this.tokenService.handleTokenRequest(body, req);
  }
}


