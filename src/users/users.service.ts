import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcryptjs from 'bcryptjs';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { FirebaseService } from '../firebase/firebase.service';
import { PatchType } from '../common/enums/patch.enum';

import { UpdateEmailDto } from './dto/update-email.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ConfigService } from '@nestjs/config';
import { SearchGoogleMap } from './dto/api-google-map.dto';
import { VaccinationCenter } from 'src/vaccination-centers/entities/vaccination-center.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(VaccinationCenter)
    private readonly vaccinationCenterRepository: Repository<VaccinationCenter>,
    private readonly firebaseService: FirebaseService,
    private readonly configService: ConfigService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    let vaccinationCenter: VaccinationCenter = null;

    if (createUserDto.vaccinationCenterId) {
      vaccinationCenter = await this.vaccinationCenterRepository.findOne({
        where: { id: createUserDto.vaccinationCenterId },
      });
      if (!vaccinationCenter) {
        throw new BadRequestException('Vaccination center not found');
      }
    }

    createUserDto.password = await bcryptjs.hash(createUserDto.password, 10);

    const user = this.userRepository.create({
      ...createUserDto,
      vaccinationCenter,
      vaccinationCenterId: createUserDto.vaccinationCenterId,
    });
    const { password, ...createdUser } = await this.userRepository.save(user);

    return createdUser;
  }

  async findOneByEmail(email: string) {
    return await this.userRepository.findOneBy({ email });
  }

  async searchAddressGoogleMapByLatLng(searchGoogleMap: SearchGoogleMap) {
    const apiKey = this.configService.get<string>('keyGoogleMaps');
    const latlng = `${searchGoogleMap.lat},${searchGoogleMap.lng}`;
    const user = await this.findById(searchGoogleMap.id);
    if (!user) {
      throw new UnauthorizedException('id is wrong');
    }
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latlng}&key=${apiKey}`,
    );
    const data = await response.json();
    return data;
  }

  async findByEmailWithPassword(email: string) {
    return await this.userRepository.findOne({
      where: { email },
      select: [
        'id',
        'name',
        'email',
        'password',
        'role',
        'urlAvatar',
        'lastname',
      ],
    });
  }

  async findById(id: string) {
    const user = await this.userRepository.findOne({
      where: { id, isActive: true },
      select: [
        'id',
        'name',
        'email',
        'password',
        'role',
        'urlAvatar',
        'lastname',
      ],
    });

    if (!user) {
      throw new BadRequestException('user not found');
    }
    return user;
  }

  async findAll() {
    return await this.userRepository.find({ where: { isActive: true } });
  }

  async findOne(id: string) {
    const user = await this.userRepository.findOne({
      where: { id, isActive: true },
      relations: ['vaccinationCenter'],
    });

    if (!user) {
      throw new BadRequestException('user not found');
    }
    return user;
  }

  async updatePasswordEmail(id: string, updateEmailDto: UpdateEmailDto) {
    const user = await this.findById(id);
    if (!user) {
      throw new UnauthorizedException('id is wrong');
    }

    const responseUser = await this.findOneByEmail(updateEmailDto.email);

    if (responseUser) {
      throw new BadRequestException('Email already exists');
    }

    const isPasswordValid = await bcryptjs.compare(
      updateEmailDto.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('password is incorrect');
    }
    await this.userRepository.update(id, {
      email: updateEmailDto.email,
    });
    return { message: 'correct' };
  }

  async updatePassword(id: string, updatePasswordDto: UpdatePasswordDto) {
    const user = await this.findById(id);

    if (!user) {
      throw new UnauthorizedException('id is wrong');
    }

    const isPasswordValid = await bcryptjs.compare(
      updatePasswordDto.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('password is incorrect');
    }
    const newPassword = await bcryptjs.hash(updatePasswordDto.newPassword, 10);
    await this.userRepository.update(id, {
      password: newPassword,
    });
    return { message: 'correct' };
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.findOne(id);
    if (!user) {
      throw new UnauthorizedException('id is wrong');
    }

    let updateData: any = { ...updateUserDto };

    if ('vaccinationCenterId' in updateUserDto) {
      if (updateUserDto.vaccinationCenterId) {
        const vaccinationCenter =
          await this.vaccinationCenterRepository.findOne({
            where: { id: updateUserDto.vaccinationCenterId },
          });
        if (!vaccinationCenter) {
          throw new BadRequestException('Vaccination center not found');
        }
        updateData.vaccinationCenter = vaccinationCenter;
        updateData.vaccinationCenterId = updateUserDto.vaccinationCenterId;
      } else {
        updateData.vaccinationCenter = null;
        updateData.vaccinationCenterId = null;
      }
    }

    return await this.userRepository.update(id, updateData);
  }

  async updateProfile(id: string, updateProfileDto: UpdateProfileDto) {
    const user = await this.findOne(id);
    if (!user) {
      throw new UnauthorizedException('id is wrong');
    }
    await this.userRepository.update(id, { ...updateProfileDto });
    return {
      displayName: `${updateProfileDto.name} ${updateProfileDto.lastname}`,
    };
  }

  async uploadImageProfile(id: string, image: Express.Multer.File) {
    const user = await this.findOne(id);
    if (!user) {
      throw new UnauthorizedException('id is wrong');
    }
    if (user.urlAvatar) {
      await this.firebaseService.deleteImage(user.urlAvatar);
    }

    const url = await this.firebaseService.uploadImage(
      image,
      PatchType.PROFILES,
    );
    await this.userRepository.update(id, { urlAvatar: url });

    return { urlAvatar: url };
  }

  async remove(id: string) {
    const user = await this.userRepository.findOne({
      where: { id },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return await this.userRepository.update(id, { isActive: false });
  }

  async findByVaccinationCenter(centerId: string) {
    const center = await this.vaccinationCenterRepository.findOne({
      where: { id: centerId, isActive: true },
    });
    if (!center) {
      throw new NotFoundException('Center not found');
    }
    return await this.userRepository.find({
      where: { vaccinationCenterId: centerId },
      relations: ['vaccinationCenter'],
    });
  }
}
