import { Injectable, inject } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AuthService } from '../../auth/services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard {
  authService = inject(AuthService);
  router = inject(Router);

  constructor() {}

  canActivate(): Observable<boolean> {
    return this.authService.isAuthenticated().pipe(
      map((isAuthenticated) => {
        if (isAuthenticated) {
          return true;
        } else {
          this.router.navigate(['/login']); // Redirige al usuario a la página de inicio de sesión si no está autenticado
          return false;
        }
      }),
      catchError(() => {
        this.router.navigate(['/login']); // Manejo de errores de autenticación
        return of(false);
      })
    );
  }
}
