import { Routes } from '@angular/router';

export const TRANSACTION_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'issue',
    pathMatch: 'full'
  },
  {
    path: 'issue',
    loadComponent: () =>
      import('./components/issue-book/issue-book.component').then(m => m.IssueBookComponent)
  },
  {
    path: 'return',
    loadComponent: () =>
      import('./components/return-book/return-book.component').then(m => m.ReturnBookComponent)
  },
  {
    path: 'history',
    loadComponent: () =>
      import('./components/transaction-history/transaction-history.component').then(m => m.TransactionHistoryComponent)
  }
];
