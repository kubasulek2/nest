import {
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { EntityNotFoundError } from 'typeorm';

export function WithError() {
  return function (
    target: unknown,
    key: string | symbol,
    descriptor: PropertyDescriptor,
  ) {
    const childFunction = descriptor.value;
    descriptor.value = async function (...args: any[]) {
      try {
        return await childFunction.apply(this, args);
      } catch (error) {
        const { message, code } = error;

        // Handle well known error first
        if (error instanceof EntityNotFoundError)
          throw new NotFoundException('Entity not found');
        // Than duck type the errors
        switch (code) {
          case 400:
            throw new BadRequestException(message);
          case 401:
            throw new UnauthorizedException(message);
          case 404:
            throw new NotFoundException(message);
          default:
            console.log(error.message);
            console.log(error.stack);
            throw new InternalServerErrorException('Something bad happended');
        }
      }
    };
    return descriptor;
  };
}
