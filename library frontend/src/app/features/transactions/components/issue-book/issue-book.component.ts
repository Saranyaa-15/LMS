import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TransactionService } from '../../../../core/services/transaction.service';
import { BookService } from '../../../../core/services/book.service';
import { MemberService } from '../../../../core/services/member.service';
import { Book } from '../../../../core/models/book.model';
import { Member } from '../../../../core/models/member.model';
import { Transaction } from '../../../../core/models/transaction.model';
import { AlertComponent } from '../../../../shared/components/alert/alert.component';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-issue-book',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, AlertComponent],
  templateUrl: './issue-book.component.html'
})
export class IssueBookComponent implements OnInit {
  form!: FormGroup;
  books: Book[] = [];
  members: Member[] = [];
  submitting = false;
  loadingData = true;
  successMsg: string | null = null;
  errorMsg: string | null = null;
  lastTransaction?: Transaction;

  constructor(
    private fb: FormBuilder,
    private txnSvc: TransactionService,
    private bookSvc: BookService,
    private memberSvc: MemberService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      bookId:   [null, Validators.required],
      memberId: [null, Validators.required]
    });

    forkJoin({ books: this.bookSvc.getAll(), members: this.memberSvc.getAll() })
      .subscribe({
        next: ({ books, members }) => {
          this.books = books.filter(b => b.availableCopies > 0);
          this.members = members.filter(m => m.status === 'ACTIVE');
          this.loadingData = false;
        },
        error: (e) => { this.errorMsg = e.message; this.loadingData = false; }
      });
  }

  get f() { return this.form.controls; }

  selectedBook(): Book | undefined {
    return this.books.find(b => b.id == this.form.value.bookId);
  }

  selectedMember(): Member | undefined {
    return this.members.find(m => m.id == this.form.value.memberId);
  }

  submit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.submitting = true;
    this.successMsg = null;
    this.errorMsg = null;

    this.txnSvc.issue({ bookId: +this.form.value.bookId, memberId: +this.form.value.memberId })
      .subscribe({
        next: (t) => {
          this.lastTransaction = t;
          this.successMsg = `"${t.bookTitle}" issued to ${t.memberName}. Due: ${new Date(t.dueDate).toLocaleDateString()}`;
          this.form.reset();
          this.submitting = false;
          this.bookSvc.getAll().subscribe(books => this.books = books.filter(b => b.availableCopies > 0));
        },
        error: (e) => { this.errorMsg = e.message; this.submitting = false; }
      });
  }
}
