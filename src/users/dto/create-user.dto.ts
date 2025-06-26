import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  IsUrl,
  IsUUID,
  MinLength,
} from 'class-validator';
import { Role } from 'src/common/enums/rol.enum';

export class CreateUserDto {
  @IsOptional()
  @Transform(({ value }) => value.trim())
  @IsString()
  @MinLength(1)
  name?: string;

  @IsOptional()
  @Transform(({ value }) => value.trim())
  @IsString()
  @MinLength(1)
  lastname?: string;

  @IsEnum(Role, { message: 'role must be admin or health' })
  role: Role;

  @IsEmail()
  email: string;

  @Transform(({ value }) => value.trim())
  @IsString()
  @MinLength(6)
  password: string;

  @IsOptional()
  @IsString()
  @IsUrl()
  urlAvatar?: string;

  @IsOptional()
  @IsUUID()
  vaccinationCenterId?: string;
}
