import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  UseGuards,
} from '@nestjs/common';
import { SessionService } from './session.service';
import { AccessTokenGuard, AuthContext } from '../../common/guards/access-token.guard';
import { CurrentAuth } from '../../common/decorators/current-user.decorator';

@Controller('sso/sessions')
@UseGuards(AccessTokenGuard)
export class SessionController {
  constructor(private readonly sessionService: SessionService) {}

  @Get()
  async listSessions(@CurrentAuth() auth: AuthContext) {
    return this.sessionService.listSessions(auth.user, auth.session.id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async revokeSession(
    @Param('id') id: string,
    @CurrentAuth() auth: AuthContext,
  ) {
    await this.sessionService.revokeSession(id, auth);
  }
}


