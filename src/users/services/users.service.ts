import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly repo: Repository<User>,
  ) {}

  public async create(email: string, password: string) {
    const user = this.repo.create({ email, password });
    return this.repo.save(user);
  }

  public async findOne(id: number) {
    if (!id) {
      return null;
    }
    return this.repo.findOne(id);
  }

  public async find(email: string) {
    return this.repo.find({ email });
  }

  public async update(id: number, attrs: Partial<User>) {
    const user = await this.repo.findOneOrFail(id);
    Object.assign(user, attrs);
    return this.repo.save(user);
  }

  public async remove(id: number) {
    const user = await this.repo.findOneOrFail(id);
    return this.repo.remove(user);
  }
}
