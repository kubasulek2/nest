import { Transform } from 'class-transformer';
import {
  IsString,
  IsNumber,
  Min,
  Max,
  IsLongitude,
  IsLatitude,
  IsOptional,
} from 'class-validator';

export class GetEstimateDto {
  @IsString()
  make: string;

  @IsString()
  @IsOptional()
  model: string;

  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @Min(1950)
  @Max(new Date().getFullYear())
  @IsOptional()
  year: number;

  @Transform(({ value }) => parseFloat(value))
  @IsLatitude()
  @IsOptional()
  lng: number;

  @Transform(({ value }) => parseFloat(value))
  @IsLongitude()
  @IsOptional()
  lat: number;

  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @Min(0)
  @Max(700000)
  @IsOptional()
  mileage: number;
}
