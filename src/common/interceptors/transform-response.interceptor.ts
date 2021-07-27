import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { classToPlain } from 'class-transformer';
import { map, Observable } from 'rxjs';

export class TransformResponseInterceptor implements NestInterceptor {
  intercept(_context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(map((data) => classToPlain(data)));
  }
}
