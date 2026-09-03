import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { ToastService } from '../services/toast.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const toast = inject(ToastService);
  return next(req).pipe(
    catchError(err => {
      if (err.status === 401) {
        auth.logout();
        toast.error('Sesión expirada. Por favor inicia sesión nuevamente.');
      } else if (err.status === 403) {
        toast.error('No tienes permisos para realizar esta acción.');
      } else if (err.status >= 500) {
        toast.error('Error en el servidor. Intenta más tarde.');
      } else if (err.status === 404) {
        toast.error('Recurso no encontrado.');
      }
      return throwError(() => err);
    })
  );
};
