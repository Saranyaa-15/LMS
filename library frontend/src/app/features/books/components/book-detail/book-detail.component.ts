import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { BookService } from '../../../../core/services/book.service';
import { TransactionService } from '../../../../core/services/transaction.service';
import { Book } from '../../../../core/models/book.model';
import { Transaction } from '../../../../core/models/transaction.model';
import { AlertComponent } from '../../../../shared/components/alert/alert.component';
import { SpinnerComponent } from '../../../../shared/components/spinner.component';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-book-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, AlertComponent, SpinnerComponent],
  templateUrl: './book-detail.component.html'
})
export class BookDetailComponent implements OnInit {
  book?: Book;
  transactions: Transaction[] = [];
  loading = true;
  errorMsg: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private bookSvc: BookService,
    private txnSvc: TransactionService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    forkJoin({ book: this.bookSvc.getById(id), txns: this.txnSvc.getByBook(id) })
      .subscribe({
        next: ({ book, txns }) => {
          this.book = book;
          this.transactions = txns;
          this.loading = false;
        },
        error: (e) => { this.errorMsg = e.message; this.loading = false; }
      });
  }

  statusClass(status: string): string {
    return { ISSUED: 'bg-primary', RETURNED: 'bg-success', OVERDUE: 'bg-danger' }[status] ?? 'bg-secondary';
  }
}
