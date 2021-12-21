import { CanActivate, ExecutionContext } from '@nestjs/common';

export class AdminGuard implements CanActivate {
  public canActivate(context: ExecutionContext): boolean {
    const { admin } = context.switchToHttp().getRequest().currentUser || {};
    return Boolean(admin);
  }
}
