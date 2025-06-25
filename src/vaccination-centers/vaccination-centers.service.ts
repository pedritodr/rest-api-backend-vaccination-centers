import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateVaccinationCenterDto } from './dto/create-vaccination-center.dto';
import { UpdateVaccinationCenterDto } from './dto/update-vaccination-center.dto';
import { VaccinationCenter } from './entities/vaccination-center.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class VaccinationCentersService {
  constructor(
    @InjectRepository(VaccinationCenter)
    private readonly vaccianationCenterRepository: Repository<VaccinationCenter>,
  ) {}
  create(createVaccinationCenterDto: CreateVaccinationCenterDto) {
    return this.vaccianationCenterRepository.save(createVaccinationCenterDto);
  }

  findAll() {
    return this.vaccianationCenterRepository.find({
      where: { isActive: true },
    });
  }

  findOne(id: string) {
    return this.vaccianationCenterRepository.findOne({
      where: { id, isActive: true },
    });
  }

  async update(
    id: string,
    updateVaccinationCenterDto: UpdateVaccinationCenterDto,
  ) {
    const vaccinationCenter = await this.findOne(id);
    if (!vaccinationCenter) {
      throw new UnauthorizedException('id is wrong');
    }
    return await this.vaccianationCenterRepository.update(id, {
      ...updateVaccinationCenterDto,
    });
  }

  async remove(id: string) {
    const vaccinationCenter = await this.findOne(id);
    if (!vaccinationCenter) {
      throw new UnauthorizedException('id is wrong');
    }
    return await this.vaccianationCenterRepository.update(id, {
      isActive: false,
    });
  }
}
