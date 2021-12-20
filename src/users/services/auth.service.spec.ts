import { Test } from '@nestjs/testing';
import { AppError } from '../../shared/errors/app.error';
import { User } from '../entities/user.entity';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';

describe('AuthService', () => {
  let service: AuthService;
  const findMock = jest.fn(() => Promise.resolve([]));
  const createMock = jest.fn((email: string, password: string) =>
    Promise.resolve({ id: 1, email, password } as User),
  );

  beforeEach(async () => {
    const fakeUserService: Partial<UsersService> = {
      find: findMock,
      create: createMock,
    };
    const authModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: fakeUserService },
      ],
    }).compile();
    service = authModule.get<AuthService>(AuthService);
  });

  describe('Create service', () => {
    it('Can crate an instance of auth service', async () => {
      expect(service).toBeDefined();
    });
  });

  describe('Signup', () => {
    it('Creates a new user with a salted and hashed password', async () => {
      const email = 'test@test.com';
      const password = 'test';
      const user = await service.signup(email, password);
      const [salt, hash] = user.password.split('.');
      expect(user.password).not.toEqual(password);
      expect(salt).toBeDefined();
      expect(hash).toBeDefined();
    });

    it('Throws an error if email in use', async () => {
      const email = 'test@test.com';
      const password = 'test';
      findMock.mockResolvedValueOnce([{ id: 1, email, password }]);
      await expect(
        async () => await service.signup(email, password),
      ).rejects.toThrowError();
    });
  });

  describe('Signin', () => {
    it('Throws an error if signin is called with an unused email', async () => {
      try {
        await service.signin('email@email', 'test');
      } catch (error) {
        expect(error.message).toMatch('User not found');
        expect(error.code).toBe(404);
        expect(error).toBeInstanceOf(AppError);
      }
    });
  });

  describe('Passwords comparison', () => {
    it('throws if an invalid password is provided', async () => {
      expect.assertions(2);
      findMock.mockResolvedValueOnce([
        { password: 'asjasjhf.sakjsw23', id: 1, email: 'test@test' } as User,
      ]);

      try {
        await service.signin('test@test', 'abcd');
      } catch (error) {
        expect(error.code).toBe(401);
        expect(error).toBeInstanceOf(AppError);
      }
    });
  });
});
