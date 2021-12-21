import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AppError } from '../shared/errors/app.error';
import { User } from '../users/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateReportDto } from './dtos/create-report.dto';
import { Report } from './report.entity';
import { GetEstimateDto } from './dtos/get-estimate.dto';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Report) private readonly repo: Repository<Report>,
  ) {}

  public create(reportDto: CreateReportDto, user: User) {
    const report = this.repo.create(reportDto);
    report.user = user;
    return this.repo.save(report);
  }

  public async changeApproval(id: string, approval: boolean) {
    const report = await this.repo.findOne(id);
    if (!report) throw new AppError('Report not found', 404);
    report.approval = approval;
    return this.repo.save(report);
  }

  public async createEstimate(params: GetEstimateDto) {
    const { make, model, year, mileage, lat, lng } = params;
    const query = this.repo
      .createQueryBuilder()
      .select('AVG(price) as price')
      .where('LOWER(make)=LOWER(:make)', { make });

    if (model) query.andWhere('LOWER(model)=LOWER(:model)', { model });
    if (year) query.andWhere('year - :year BETWEEN -3 AND 3', { year });
    if (mileage)
      query.andWhere('mileage - :mileage BETWEEN -20000 AND 20000', {
        mileage,
      });
    if (lat)
      query.andWhere('lat - :lat BETWEEN -5 AND 5', {
        lat,
      });
    if (lng)
      query.andWhere('lng - :lng BETWEEN -5 AND 5', {
        lng,
      });
    if (mileage) {
      query.orderBy('mileage - :mileage').setParameters({ mileage });
    }

    return query.getRawOne();
  }
}
