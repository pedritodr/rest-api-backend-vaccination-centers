import {
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { Auth } from '../auth/decorators/auth.decorator';
import { Role } from '../common/enums/rol.enum';
import { ActiveUser } from '../common/decorators/active-user.decorator';
import { UpdateEmailDto } from './dto/update-email.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ParamsCenterUUID, ParamsUUID } from './dto/params-UUID.dto';

@ApiBearerAuth()
@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Auth(Role.ADMIN)
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Auth(Role.HEALTH)
  @Patch('uploadImage/:id')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        image: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('image'))
  uploadImage(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5242880 }),
          new FileTypeValidator({ fileType: /(jpg|jpeg|png)$/ }),
        ],
      }),
    )
    image: Express.Multer.File,
    @Param('id') id: string,
  ) {
    return this.usersService.uploadImageProfile(id, image);
  }
  @Auth(Role.HEALTH)
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Auth(Role.ADMIN)
  @Get(':id')
  findOne(@Param() { id }: ParamsUUID) {
    return this.usersService.findOne(id);
  }
  @Auth(Role.ADMIN)
  @Patch(':id')
  update(@Param() { id }: ParamsUUID, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Auth(Role.HEALTH)
  @Patch('updateProfile/:id')
  updateProfile(
    @Param() { id }: ParamsUUID,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    return this.usersService.updateProfile(id, updateProfileDto);
  }

  @Auth(Role.HEALTH)
  @Patch('updateEmail/:id')
  updatePasswordEmail(
    @Param() { id }: ParamsUUID,
    @Body() updateEmailDto: UpdateEmailDto,
  ) {
    return this.usersService.updatePasswordEmail(id, updateEmailDto);
  }

  @Auth(Role.HEALTH)
  @Patch('updatePassword/:id')
  updatePassword(
    @Param() { id }: ParamsUUID,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ) {
    return this.usersService.updatePassword(id, updatePasswordDto);
  }

  @Auth(Role.ADMIN)
  @Delete(':id')
  remove(@Param() { id }: ParamsUUID) {
    return this.usersService.remove(id);
  }

  @Auth(Role.ADMIN)
  @Get('/center/:centerId')
  findByVaccinationCenter(@Param() { centerId }: ParamsCenterUUID) {
    return this.usersService.findByVaccinationCenter(centerId);
  }
}
