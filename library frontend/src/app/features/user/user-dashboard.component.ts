import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subject, debounceTime, distinctUntilChanged, switchMap } from 'rxjs';
import { BookService } from '../../core/services/book.service';
import { Book } from '../../core/models/book.model';
import { SpinnerComponent } from '../../shared/components/spinner.component';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, SpinnerComponent],
  templateUrl: './user-dashboard.component.html'
})
export class UserDashboardComponent implements OnInit {
  loading = true;
  books: Book[] = [];
  searchQuery = '';
  private search$ = new Subject<string>();

  constructor(private bookSvc: BookService) {}

  ngOnInit(): void {
    this.loadBooks();
    this.search$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(q => q.trim() ? this.bookSvc.search(q) : this.bookSvc.getAll())
    ).subscribe({
      next: (data) => {
        this.books = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  loadBooks(): void {
    this.loading = true;
    this.bookSvc.getAll().subscribe({
      next: (data) => {
        this.books = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading books:', err);
        this.loading = false;
      }
    });
  }

  onSearch(): void {
    this.loading = true;
    this.search$.next(this.searchQuery);
  }
}
