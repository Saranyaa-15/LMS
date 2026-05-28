import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { BookService } from '../../core/services/book.service';
import { MemberService } from '../../core/services/member.service';
import { Book } from '../../core/models/book.model';
import { SpinnerComponent } from '../../shared/components/spinner.component';

@Component({
  selector: 'app-librarian-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, SpinnerComponent],
  templateUrl: './librarian-dashboard.component.html',
  styles: [`
    .dash-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      flex-wrap: wrap;
      gap: 1rem;
      margin-bottom: 2rem;
    }
    .dash-greeting {
      font-size: 0.82rem;
      font-weight: 500;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      margin-bottom: 0.25rem;
    }
    .dash-title {
      font-size: 1.5rem;
      font-weight: 800;
      color: var(--text-heading);
      margin: 0 0 0.35rem;
      letter-spacing: -0.3px;
    }
    .dash-subtitle {
      font-size: 0.88rem;
      color: #64748b;
      margin: 0;
    }
    .dash-date {
      padding: 0.5rem 1rem;
      border-radius: 10px;
      background: rgba(99, 102, 241, 0.08);
      border: 1px solid rgba(99, 102, 241, 0.15);
      color: #a5b4fc;
      font-size: 0.82rem;
      font-weight: 500;
      white-space: nowrap;
    }
    .stat-icon {
      width: 48px; height: 48px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.25rem;
      flex-shrink: 0;
    }
    .stat-icon-primary, .stat-icon-success, .stat-icon-info, .stat-icon-warning {
      background: var(--bg-muted);
      color: var(--text-primary);
      border: 1px solid var(--border-color);
    }

    .action-link {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.85rem 1rem;
      border-radius: 12px;
      text-decoration: none;
      font-weight: 600;
      font-size: 0.88rem;
      transition: none;
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      color: var(--text-primary);
    }
    .action-link i { font-size: 1.2rem; color: var(--text-primary); }
    .action-link:hover { transform: none; }
    .action-primary, .action-success, .action-warning, .action-info {
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      color: var(--text-primary);
    }

    @media (max-width: 768px) {
      .dash-header { flex-direction: column; }
      .dash-title { font-size: 1.25rem; }
    }
  `]
})
export class LibrarianDashboardComponent implements OnInit {
  loading = true;
  totalBooks = 0;
  availableBooks = 0;
  totalMembers = 0;
  activeMembers = 0;
  recentBooks: Book[] = [];
  today = new Date();

  constructor(
    private bookSvc: BookService,
    private memberSvc: MemberService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading = true;
    forkJoin({
      books: this.bookSvc.getAll(),
      members: this.memberSvc.getAll()
    }).subscribe({
      next: ({ books, members }) => {
        this.totalBooks = books.length;
        this.availableBooks = books.filter(b => b.availableCopies > 0).length;
        this.totalMembers = members.length;
        this.activeMembers = members.filter(m => m.status === 'ACTIVE').length;
        this.recentBooks = books.slice(0, 5);
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading librarian stats:', err);
        this.loading = false;
      }
    });
  }
}
