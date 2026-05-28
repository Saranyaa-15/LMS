import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TransactionService } from '../../../../core/services/transaction.service';
import { MemberService } from '../../../../core/services/member.service';
import { BookService } from '../../../../core/services/book.service';
import { Transaction, TransactionStatus } from '../../../../core/models/transaction.model';
import { Member } from '../../../../core/models/member.model';
import { Book } from '../../../../core/models/book.model';
import { AlertComponent } from '../../../../shared/components/alert/alert.component';
import { SpinnerComponent } from '../../../../shared/components/spinner.component';

@Component({
  selector: 'app-transaction-history',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, AlertComponent, SpinnerComponent],
  templateUrl: './transaction-history.component.html'
})
export class TransactionHistoryComponent implements OnInit {
  transactions: Transaction[] = [];
  filtered: Transaction[] = [];
  members: Member[] = [];
  books: Book[] = [];
  loading = false;
  errorMsg: string | null = null;

  filterMemberId: number | null = null;
  filterBookId: number | null = null;
  filterStatus: TransactionStatus | '' = '';

  constructor(
    private txnSvc: TransactionService,
    private memberSvc: MemberService,
    private bookSvc: BookService
  ) {}

  ngOnInit(): void {
    this.memberSvc.getAll().subscribe(m => this.members = m);
    this.bookSvc.getAll().subscribe(b => this.books = b);
  }

  search(): void {
    if (!this.filterMemberId && !this.filterBookId) {
      this.errorMsg = 'Please select a member or a book to view transactions.';
      return;
    }
    this.loading = true;
    this.errorMsg = null;
    const req$ = this.filterMemberId
      ? this.txnSvc.getByMember(+this.filterMemberId)
      : this.txnSvc.getByBook(+this.filterBookId!);

    req$.subscribe({
      next: txns => {
        this.transactions = txns;
        this.applyStatusFilter();
        this.loading = false;
      },
      error: (e) => { this.errorMsg = e.message; this.loading = false; }
    });
  }

  applyStatusFilter(): void {
    this.filtered = this.filterStatus
      ? this.transactions.filter(t => t.status === this.filterStatus)
      : [...this.transactions];
  }

  statusClass(status: string): string {
    return { ISSUED: 'bg-primary', RETURNED: 'bg-success', OVERDUE: 'bg-danger' }[status] ?? 'bg-secondary';
  }

  isOverdue(t: Transaction): boolean {
    return t.status === 'OVERDUE' || (t.status === 'ISSUED' && new Date(t.dueDate) < new Date());
  }
}
