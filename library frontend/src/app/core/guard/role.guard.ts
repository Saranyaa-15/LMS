import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router, UrlTree } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { Role } from '../../shared/models/role.enum';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean | UrlTree {
    if (!this.auth.isAuthenticated()) {
      return this.router.createUrlTree(['/login']);
    }
    const requiredRoles: Role[] = route.data['roles'];
    const userRole = this.auth.getRole();
    if (userRole && requiredRoles.includes(userRole)) {
      return true;
    }
    if (userRole === 'ADMIN') return this.router.createUrlTree(['/admin-dashboard']);
    if (userRole === 'LIBRARIAN') return this.router.createUrlTree(['/librarian-dashboard']);
    return this.router.createUrlTree(['/user-dashboard']);
  }
}
