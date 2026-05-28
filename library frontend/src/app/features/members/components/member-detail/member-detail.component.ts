import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { MemberService } from '../../../../core/services/member.service';
import { TransactionService } from '../../../../core/services/transaction.service';
import { Member } from '../../../../core/models/member.model';
import { Transaction } from '../../../../core/models/transaction.model';
import { AlertComponent } from '../../../../shared/components/alert/alert.component';
import { SpinnerComponent } from '../../../../shared/components/spinner.component';

@Component({
  selector: 'app-member-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, AlertComponent, SpinnerComponent],
  templateUrl: './member-detail.component.html'
})
export class MemberDetailComponent implements OnInit {
  member?: Member;
  transactions: Transaction[] = [];
  loading = true;
  errorMsg: string | null = null;

  get returnedCount(): number {
    return this.transactions.filter(t => t.status === 'RETURNED').length;
  }

  get overdueCount(): number {
    return this.transactions.filter(t => t.status === 'OVERDUE').length;
  }

  get activeCount(): number {
    return this.transactions.filter(t => t.status === 'ISSUED' || t.status === 'OVERDUE').length;
  }

  constructor(
    private route: ActivatedRoute,
    private memberSvc: MemberService,
    private txnSvc: TransactionService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    forkJoin({ member: this.memberSvc.getById(id), txns: this.txnSvc.getByMember(id) })
      .subscribe({
        next: ({ member, txns }) => {
          this.member = member;
          this.transactions = txns;
          this.loading = false;
        },
        error: (e) => { this.errorMsg = e.message; this.loading = false; }
      });
  }

  statusClass(status: string): string {
    const map: Record<string, string> = {
      ISSUED: 'bg-primary',
      RETURNED: 'bg-success',
      OVERDUE: 'bg-danger'
    };
    return map[status] ?? 'bg-secondary';
  }

  isOverdue(t: Transaction): boolean {
    return t.status === 'OVERDUE' || (t.status === 'ISSUED' && new Date(t.dueDate) < new Date());
  }
}
