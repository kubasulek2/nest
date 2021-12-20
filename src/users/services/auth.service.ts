import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';
import { Injectable } from '@nestjs/common';
import { AppError } from '../../shared/errors/app.error';
import { UsersService } from './users.service';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  public async signup(email: string, password: string) {
    await this.verifySignupEmail(email);
    const hash = await this.generateHash(password);

    return await this.usersService.create(email, hash);
  }

  public async signin(email: string, password: string) {
    const user = await this.findUserByUniqueEmail(email);
    await this.verifyPassword(password, user.password);

    return user;
  }

  private async verifySignupEmail(email: string) {
    const users = await this.usersService.find(email);
    if (users.length) {
      throw new AppError('Email in use', 400);
    }
  }

  private async findUserByUniqueEmail(email: string) {
    const users = await this.usersService.find(email);
    if (!users || !users.length) {
      throw new AppError('User not found', 404);
    }
    if (users.length > 1) {
      throw new AppError('Email in use', 500);
    }

    return users[0];
  }

  private async generateHash(password: string, salt?: string): Promise<string> {
    if (!salt) {
      salt = this.generateSalt();
    }
    const hash = await this.generateSaltedHash(password, salt);
    const hashAndSalt = this.joinHashAndSalt(hash, salt);

    return hashAndSalt;
  }

  private async verifyPassword(
    password: string,
    storedPassword: string,
  ): Promise<void> {
    const [salt] = this.extractHashAndSalt(storedPassword);
    const hash = await this.generateHash(password, salt);
    if (hash !== storedPassword) {
      throw new AppError('Wrong email or password', 401);
    }
  }

  private generateSalt(): string {
    return randomBytes(16).toString('hex');
  }

  private async generateSaltedHash(
    password: string,
    salt: string,
  ): Promise<string> {
    return ((await scrypt(password, salt, 64)) as Buffer).toString('hex');
  }

  private joinHashAndSalt(hash: string, salt: string): string {
    return salt + '.' + hash;
  }

  private extractHashAndSalt(hash: string): [string, string] {
    const parts = hash.split('.');
    if (parts.length !== 2) {
      throw new Error('Bad hash');
    }
    return parts as [string, string];
  }
}
