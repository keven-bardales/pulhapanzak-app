import { Injectable, inject } from '@angular/core';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard {
  private authService = inject(AuthService);
  private router = inject(Router);

  async canActivate(): Promise<boolean> {
    const isAuthenticated = await this.authService.isUserLoggedIn();
    if (!isAuthenticated) this.router.navigate(['/login']);
    return isAuthenticated;
  }
}
