import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MemberService } from '../../../../core/services/member.service';
import { Member } from '../../../../core/models/member.model';
import { AlertComponent } from '../../../../shared/components/alert/alert.component';
import { SpinnerComponent } from '../../../../shared/components/spinner.component';
import { ConfirmModalComponent } from '../../../../shared/components/confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-member-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, AlertComponent, SpinnerComponent, ConfirmModalComponent],
  templateUrl: './member-list.component.html'
})
export class MemberListComponent implements OnInit {
  members: Member[] = [];
  filtered: Member[] = [];
  loading = true;
  searchQuery = '';
  successMsg: string | null = null;
  errorMsg: string | null = null;
  showConfirm = false;
  memberToDeactivate: Member | null = null;
  actionLoadingId: number | null = null;

  constructor(private memberSvc: MemberService) {}

  ngOnInit(): void { this.loadMembers(); }

  loadMembers(): void {
    this.loading = true;
    this.memberSvc.getAll().subscribe({
      next: m => { this.members = m; this.applyFilter(); this.loading = false; },
      error: (e) => { this.errorMsg = e.message; this.loading = false; }
    });
  }

  applyFilter(): void {
    const q = this.searchQuery.toLowerCase();
    this.filtered = q
      ? this.members.filter(m =>
          m.name.toLowerCase().includes(q) ||
          m.email.toLowerCase().includes(q) ||
          m.status.toLowerCase().includes(q))
      : [...this.members];
  }

  confirmDeactivate(member: Member): void {
    this.memberToDeactivate = member;
    this.showConfirm = true;
  }

  deactivate(): void {
    if (!this.memberToDeactivate) return;
    this.actionLoadingId = this.memberToDeactivate.id;
    this.memberSvc.deactivate(this.memberToDeactivate.id).subscribe({
      next: () => {
        this.successMsg = `${this.memberToDeactivate!.name} deactivated`;
        this.showConfirm = false;
        this.memberToDeactivate = null;
        this.actionLoadingId = null;
        this.loadMembers();
      },
      error: (e) => {
        this.errorMsg = e.message;
        this.showConfirm = false;
        this.actionLoadingId = null;
      }
    });
  }

  activate(member: Member): void {
    this.actionLoadingId = member.id;
    this.memberSvc.activate(member.id).subscribe({
      next: () => {
        this.successMsg = `${member.name} activated`;
        this.actionLoadingId = null;
        this.loadMembers();
      },
      error: (e) => {
        this.errorMsg = e.message;
        this.actionLoadingId = null;
      }
    });
  }
}
