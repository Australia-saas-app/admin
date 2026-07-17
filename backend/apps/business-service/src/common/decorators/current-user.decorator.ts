import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthContext } from '../guards/access-token.guard';

export const CurrentAuth = createParamDecorator(
  (data: keyof AuthContext | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<{ auth?: AuthContext }>();
    if (!request.auth) {
      return null;
    }
    return data ? request.auth[data] : request.auth;
  },
);


