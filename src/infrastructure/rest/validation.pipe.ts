import {
  ArgumentMetadata,
  Injectable,
  PipeTransform,
  UnprocessableEntityException,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate, ValidationError } from 'class-validator/types';

interface IValidationError {
  property: string;
  errors: string[];
  constraints: {
    [type: string]: string;
  };
}

/**
 * Validation Pipe.
 * Gets Validation errors and creates custom error messages
 */
@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !ValidationPipe.toValidate(metatype)) {
      return value;
    }
    const object = plainToClass(metatype, value);
    const errors = await validate(object);
    if (errors.length > 0) {
      throw new UnprocessableEntityException(this.formatErrors(errors));
    }
    return value;
  }

  private static toValidate(metaType: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metaType);
  }

  private formatErrors(errors: ValidationError[]): IValidationError[] {
    return errors.map(err => {
      return {
        property: err.property,
        errors: Object.keys(err.constraints),
        constraints: err.constraints,
      };
    });
  }
}
