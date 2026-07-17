import { Controller, Get, HttpCode, HttpStatus, Query } from '@nestjs/common';

@Controller('sso/authorize')
export class AuthorizeController {
  @Get()
  @HttpCode(HttpStatus.NOT_IMPLEMENTED)
  authorize(@Query() query: Record<string, any>) {
    return {
      success: false,
      error: 'authorization_code_flow_not_enabled',
      message:
        'Interactive authorization endpoint is not yet implemented. Use the password + refresh_token grants for first-party clients or integrate a UI workflow.',
      received: query,
    };
  }
}


