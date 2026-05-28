import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean | UrlTree {
    if (!this.auth.isAuthenticated()) {
      return this.router.createUrlTree(['/login']);
    }

    const requiredRole = route.data['requiredRole'];
    if (requiredRole) {
      const userRole = this.auth.getRole();
      if (userRole !== requiredRole) {
        if (userRole === 'ADMIN') return this.router.createUrlTree(['/admin-dashboard']);
        if (userRole === 'LIBRARIAN') return this.router.createUrlTree(['/librarian-dashboard']);
        return this.router.createUrlTree(['/user-dashboard']);
      }
    }
    return true;
  }
}
