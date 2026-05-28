import { Routes } from '@angular/router';
import { RoleGuard } from '../../core/guard/role.guard';
import { Role } from '../../shared/models/role.enum';
import { BookListComponent } from './components/book-list/book-list.component';
import { BookDetailComponent } from './components/book-detail/book-detail.component';
import { BookFormComponent } from './components/book-form/book-form.component';

export const BOOK_ROUTES: Routes = [
  {
    path: '',
    component: BookListComponent,
    canActivate: [RoleGuard],
    data: { roles: [Role.ADMIN, Role.LIBRARIAN] }
  },
  {
    path: 'new',
    component: BookFormComponent,
    canActivate: [RoleGuard],
    data: { roles: [Role.ADMIN, Role.LIBRARIAN] }
  },
  {
    path: ':id/edit',
    component: BookFormComponent,
    canActivate: [RoleGuard],
    data: { roles: [Role.ADMIN, Role.LIBRARIAN] }
  },
  {
    path: ':id',
    component: BookDetailComponent,
    canActivate: [RoleGuard],
    data: { roles: [Role.ADMIN, Role.LIBRARIAN] }
  }
];
