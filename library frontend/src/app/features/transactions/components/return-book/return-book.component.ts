import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TransactionService } from '../../../../core/services/transaction.service';
import { MemberService } from '../../../../core/services/member.service';
import { Member } from '../../../../core/models/member.model';
import { Transaction } from '../../../../core/models/transaction.model';
import { AlertComponent } from '../../../../shared/components/alert/alert.component';

@Component({
  selector: 'app-return-book',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, AlertComponent],
  templateUrl: './return-book.component.html'
})
export class ReturnBookComponent implements OnInit {
  form!: FormGroup;
  members: Member[] = [];
  activeTransactions: Transaction[] = [];
  loadingTxns = false;
  submitting = false;
  successMsg: string | null = null;
  errorMsg: string | null = null;
  lastReturned?: Transaction;

  constructor(
    private fb: FormBuilder,
    private txnSvc: TransactionService,
    private memberSvc: MemberService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      memberId:      [null, Validators.required],
      transactionId: [null, Validators.required]
    });

    this.memberSvc.getAll().subscribe(m => this.members = m.filter(x => x.status === 'ACTIVE'));

    this.form.get('memberId')!.valueChanges.subscribe(memberId => {
      this.form.get('transactionId')!.reset();
      this.activeTransactions = [];
      if (memberId) {
        this.loadingTxns = true;
        this.txnSvc.getByMember(+memberId).subscribe({
          next: txns => {
            this.activeTransactions = txns.filter(t => t.status === 'ISSUED' || t.status === 'OVERDUE');
            this.loadingTxns = false;
          },
          error: () => { this.loadingTxns = false; }
        });
      }
    });
  }

  get f() { return this.form.controls; }

  selectedTransaction(): Transaction | undefined {
    return this.activeTransactions.find(t => t.id == this.form.value.transactionId);
  }

  isOverdue(t: Transaction): boolean {
    return t.status === 'OVERDUE' || new Date(t.dueDate) < new Date();
  }

  submit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.submitting = true;
    this.successMsg = null;
    this.errorMsg = null;

    this.txnSvc.returnBook({ transactionId: +this.form.value.transactionId })
      .subscribe({
        next: (t) => {
          this.lastReturned = t;
          this.successMsg = `"${t.bookTitle}" returned successfully by ${t.memberName}.`;
          this.form.reset();
          this.activeTransactions = [];
          this.submitting = false;
        },
        error: (e) => { this.errorMsg = e.message; this.submitting = false; }
      });
  }
}
