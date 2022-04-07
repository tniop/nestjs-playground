import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async showAll() {
    return await this.usersRepository.find();
  }

  async create(data: CreateUserDto) {
    const user = this.usersRepository.create(data);
    await this.usersRepository.save(data);
    return user;
  }

  async findByEmail(email: string): Promise<CreateUserDto> {
    return await this.usersRepository.findOne({
      where: {
        email: email,
      },
    });
  }

  async read(id: number) {
    return await this.usersRepository.findOne({ where: { id: id } });
  }

  async update(id: number, data: Partial<UpdateUserDto>) {
    await this.usersRepository.update({ id }, data);
    return await this.usersRepository.findOne({ id });
  }

  async destroy(id: number) {
    await this.usersRepository.delete({ id });
    return { deleted: true };
  }
}
