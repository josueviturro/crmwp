import { createParamDecorator, type ExecutionContext } from '@nestjs/common';
import type { Role } from '../generated/prisma/client.js';

export type AuthenticatedUser = {
  userId: string;
  tenantId: string;
  role: Role;
};

export const CurrentUser = createParamDecorator((_: unknown, ctx: ExecutionContext): AuthenticatedUser => {
  const request = ctx.switchToHttp().getRequest();
  return request.user as AuthenticatedUser;
});
