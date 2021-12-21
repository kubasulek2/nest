import {
  Body,
  Controller,
  Post,
  UseGuards,
  Patch,
  Param,
  Get,
  Query,
} from '@nestjs/common';
import { WithError } from '../shared/decorators/with-error.decorator';
import { AdminGuard } from '../shared/guards/admin.guard';
import { AuthGuard } from '../shared/guards/auth.guard';
import { Serialize } from '../shared/interceptors/serialize.interceptors';
import { CurrrentUser } from '../users/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { ApproveReportDto } from './dtos/approve-report.dto';
import { CreateReportDto } from './dtos/create-report.dto';
import { GetEstimateDto } from './dtos/get-estimate.dto';
import { ReportDto } from './dtos/report.dto';
import { ReportsService } from './reports.service';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Post()
  @UseGuards(AuthGuard)
  @Serialize(ReportDto)
  @WithError()
  createReport(@Body() body: CreateReportDto, @CurrrentUser() user: User) {
    return this.reportsService.create(body, user);
  }

  @Patch('/:id')
  @UseGuards(AdminGuard)
  @WithError()
  approveReport(@Param('id') id, @Body() body: ApproveReportDto) {
    return this.reportsService.changeApproval(id, body.approved);
  }

  @Get()
  @WithError()
  getEstimate(@Query() query: GetEstimateDto) {
    return this.reportsService.createEstimate(query);
  }
}
