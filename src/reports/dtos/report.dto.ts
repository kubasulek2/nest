import { Expose, Transform } from 'class-transformer';

export class ReportDto {
  @Expose()
  id: number;
  @Expose()
  price: number;
  @Expose()
  mileage: number;
  @Expose()
  lat: number;
  @Expose()
  lng: number;
  @Expose()
  make: string;
  @Expose()
  model: string;
  @Expose()
  approval: boolean;
  @Expose()
  @Transform(({ obj }) => obj.user.id)
  userId: number;
}
