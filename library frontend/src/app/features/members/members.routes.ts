import { Routes } from '@angular/router';

export const MEMBER_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/member-list/member-list.component').then(m => m.MemberListComponent)
  },
  {
    path: 'new',
    loadComponent: () =>
      import('./components/member-form/member-form.component').then(m => m.MemberFormComponent)
  },
  {
    path: ':id/edit',
    loadComponent: () =>
      import('./components/member-form/member-form.component').then(m => m.MemberFormComponent)
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./components/member-detail/member-detail.component').then(m => m.MemberDetailComponent)
  }
];
