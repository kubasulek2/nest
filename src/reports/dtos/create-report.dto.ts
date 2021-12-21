import {
  IsString,
  IsNumber,
  Min,
  Max,
  IsLongitude,
  IsLatitude,
} from 'class-validator';

export class CreateReportDto {
  @IsNumber()
  @Min(0)
  @Max(1000000)
  price: number;

  @IsString()
  make: string;

  @IsString()
  model: string;

  @IsNumber()
  @Min(1950)
  @Max(new Date().getFullYear())
  year: number;

  @IsLatitude()
  lng: number;

  @IsLongitude()
  lat: number;

  @IsNumber()
  @Min(0)
  @Max(700000)
  mileage: number;
}
