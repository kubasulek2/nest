import { User } from '../users/entities/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  AfterInsert,
  AfterUpdate,
  AfterRemove,
  ManyToOne,
} from 'typeorm';

@Entity()
export class Report {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: false })
  approval: boolean;

  @Column()
  price: number;

  @Column()
  make: string;

  @Column()
  model: string;

  @Column()
  year: number;

  @Column()
  lng: number;

  @Column()
  lat: number;

  @Column()
  mileage: number;

  @ManyToOne(() => User, (user) => user.reports)
  user: User;

  @AfterInsert()
  logInsert() {
    console.log('Inserted Report with id', this.id);
  }

  @AfterUpdate()
  logUpdate() {
    console.log('Updated Report with id', this.id);
  }

  @AfterRemove()
  logRemove() {
    console.log('Removed Report with id', this.id);
  }
}
