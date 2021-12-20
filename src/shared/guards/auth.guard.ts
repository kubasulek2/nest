import { CanActivate, ExecutionContext } from '@nestjs/common';

export class AuthGuard implements CanActivate {
  public canActivate(context: ExecutionContext): boolean {
    const { userId } = context.switchToHttp().getRequest().session || {};
    return Boolean(userId);
  }
}
