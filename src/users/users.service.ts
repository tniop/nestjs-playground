import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { email, name } = createUserDto;
    const user = this.usersRepository.create({
      email,
      name,
    });
    await this.usersRepository.save(user);
    return user;
  }

  async findAll(): Promise<User[]> {
    return await this.usersRepository.find();
  }

  async findOne(id: number): Promise<User> {
    const user = await this.usersRepository.findOne(id);

    if (!user) {
      throw new NotFoundException(`User ID ${id} not found.`);
    }

    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.usersRepository.findOne(id);

    if (!user) {
      throw new NotFoundException(`User ID ${id} not found.`);
    }

    const { email, name } = updateUserDto;
    user.email = email;
    user.name = name;

    return await this.usersRepository.save(user);
  }

  async remove(id: number): Promise<void> {
    const user = await this.usersRepository.findOne({
      where: { id: id },
    });

    if (!user) {
      throw new NotFoundException(`User ID ${id} not found.`);
    }

    await this.usersRepository.delete(id);
  }
}
