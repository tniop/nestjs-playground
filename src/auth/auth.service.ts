import {
  Injectable,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, accessToken: string): Promise<any> {
    // 프로젝트에서는 accessToken 암호화
    const user = await this.usersService.findOne(email);
    if (user && user.accessToken === accessToken) {
      const { accessToken, ...result } = user; // exclude accessToken
      return result;
    }
    return null;
  }

  async login(user: any) {
    return {
      token: this.jwtService.sign(
        {
          email: user.email,
          sub: user.id,
        },
        {
          secret: process.env.JWT_SECRET,
          expiresIn: process.env.JWT_EXPIRE_TIME,
        },
      ),
    };
  }

  async signInWithGoogle(req: any) {
    if (!req.user) throw new BadRequestException();

    const existUser = await this.usersService.findOne(req.user.email);
    if (existUser) throw new ForbiddenException('User already exists');

    try {
      const newUser: CreateUserDto = {
        givenName: req.user.firstName,
        familyName: req.user.lastName,
        email: req.user.email,
        subId: req.user.subId,
        photo: req.user.photos[0].value,
        accessToken: req.user.accessToken,
      };

      await this.usersService.create(newUser);
      return this.login(newUser);
    } catch (e) {
      throw new Error(e);
    }
  }
}
