import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Subject, switchMap } from 'rxjs';
import { BookService } from '../../../../core/services/book.service';
import { Book } from '../../../../core/models/book.model';
import { AlertComponent } from '../../../../shared/components/alert/alert.component';
import { SpinnerComponent } from '../../../../shared/components/spinner.component';
import { ConfirmModalComponent } from '../../../../shared/components/confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-book-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, AlertComponent, SpinnerComponent, ConfirmModalComponent],
  templateUrl: './book-list.component.html'
})
export class BookListComponent implements OnInit {
  books: Book[] = [];
  loading = true;
  searchQuery = '';
  successMsg: string | null = null;
  errorMsg: string | null = null;
  showConfirm = false;
  bookToDelete: Book | null = null;

  private search$ = new Subject<string>();

  constructor(private bookSvc: BookService) {}

  ngOnInit(): void {
    this.loadBooks();
    this.search$.pipe(
      debounceTime(350),
      distinctUntilChanged(),
      switchMap(q => q.trim() ? this.bookSvc.search(q) : this.bookSvc.getAll())
    ).subscribe({ next: books => this.books = books, error: () => {} });
  }

  loadBooks(): void {
    this.loading = true;
    this.bookSvc.getAll().subscribe({
      next: books => { this.books = books; this.loading = false; },
      error: (e) => { this.errorMsg = e.message; this.loading = false; }
    });
  }

  onSearch(): void {
    this.search$.next(this.searchQuery);
  }

  confirmDelete(book: Book): void {
    this.bookToDelete = book;
    this.showConfirm = true;
  }

  deleteBook(): void {
    if (!this.bookToDelete) return;
    this.bookSvc.delete(this.bookToDelete.id).subscribe({
      next: () => {
        this.successMsg = `"${this.bookToDelete!.title}" deleted successfully`;
        this.showConfirm = false;
        this.bookToDelete = null;
        this.loadBooks();
      },
      error: (e) => { this.errorMsg = e.message; this.showConfirm = false; }
    });
  }
}
