import { Routes } from '@angular/router';
import { AuthGuard } from './core/guard/auth.guard';
import { Role } from './shared/models/role.enum';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () => import('./auth/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'admin-dashboard',
    loadComponent: () => import('./features/admin/admin-dashboard.component').then(m => m.AdminDashboardComponent),
    canActivate: [AuthGuard],
    data: { requiredRole: Role.ADMIN }
  },
  {
    path: 'librarian-dashboard',
    loadComponent: () => import('./features/librarian/librarian-dashboard.component').then(m => m.LibrarianDashboardComponent),
    canActivate: [AuthGuard],
    data: { requiredRole: Role.LIBRARIAN }
  },
  {
    path: 'user-dashboard',
    loadComponent: () => import('./features/user/user-dashboard.component').then(m => m.UserDashboardComponent),
    canActivate: [AuthGuard],
    data: { requiredRole: Role.USER }
  },
  {
    path: 'books',
    loadChildren: () => import('./features/books/books.routes').then(m => m.BOOK_ROUTES)
  },
  {
    path: 'members',
    loadChildren: () => import('./features/members/members.routes').then(m => m.MEMBER_ROUTES)
  },
  {
    path: 'transactions',
    loadChildren: () => import('./features/transactions/transactions.routes').then(m => m.TRANSACTION_ROUTES)
  },
  { path: '**', redirectTo: 'login' }
];
