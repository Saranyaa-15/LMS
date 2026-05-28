import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(req).pipe(
      catchError((err: HttpErrorResponse) => {
        let msg = 'Unexpected error occurred';
        if (err.error?.message) {
          msg = err.error.message;
        } else if (err.error?.data && typeof err.error.data === 'object') {
          msg = Object.values(err.error.data as Record<string, string>).join(', ');
        } else if (err.message) {
          msg = err.message;
        }
        return throwError(() => new Error(msg));
      })
    );
  }
}
