import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateTokenDto {
  @IsString()
  @ApiProperty({ description: 'google OAuth Authorization id token' })
  readonly token: string;
}
