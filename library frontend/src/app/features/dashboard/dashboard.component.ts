import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { BookService } from '../../core/services/book.service';
import { MemberService } from '../../core/services/member.service';
import { SpinnerComponent } from '../../shared/components/spinner.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, SpinnerComponent],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {
  loading = true;
  totalBooks = 0;
  availableBooks = 0;
  totalMembers = 0;
  activeMembers = 0;

  constructor(private bookSvc: BookService, private memberSvc: MemberService) {}

  ngOnInit(): void {
    forkJoin({ books: this.bookSvc.getAll(), members: this.memberSvc.getAll() })
      .subscribe({
        next: ({ books, members }) => {
          this.totalBooks = books.length;
          this.availableBooks = books.filter(b => b.availableCopies > 0).length;
          this.totalMembers = members.length;
          this.activeMembers = members.filter(m => m.status === 'ACTIVE').length;
          this.loading = false;
        },
        error: () => { this.loading = false; }
      });
  }
}
