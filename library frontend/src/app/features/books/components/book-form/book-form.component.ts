import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { BookService } from '../../../../core/services/book.service';
import { AlertComponent } from '../../../../shared/components/alert/alert.component';
import { SpinnerComponent } from '../../../../shared/components/spinner.component';

@Component({
  selector: 'app-book-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, AlertComponent, SpinnerComponent],
  templateUrl: './book-form.component.html'
})
export class BookFormComponent implements OnInit {
  form!: FormGroup;
  isEdit = false;
  bookId?: number;
  loading = false;
  submitting = false;
  errorMsg: string | null = null;

  constructor(
    private fb: FormBuilder,
    private bookSvc: BookService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.buildForm();
    this.bookId = Number(this.route.snapshot.paramMap.get('id'));
    this.isEdit = !!this.bookId && !isNaN(this.bookId);

    if (this.isEdit) {
      this.loading = true;
      this.bookSvc.getById(this.bookId!).subscribe({
        next: book => { this.form.patchValue(book); this.loading = false; },
        error: (e) => { this.errorMsg = e.message; this.loading = false; }
      });
    }
  }

  buildForm(): void {
    this.form = this.fb.group({
      title:           ['', [Validators.required, Validators.maxLength(255)]],
      author:          ['', [Validators.required, Validators.maxLength(255)]],
      isbn:            ['', [Validators.required]],
      category:        [''],
      totalCopies:     [1,  [Validators.required, Validators.min(0)]],
      availableCopies: [1,  [Validators.required, Validators.min(0)]],
      shelfLocation:   ['']
    });
  }

  get f() { return this.form.controls; }

  submit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.submitting = true;
    this.errorMsg = null;
    const payload = this.form.value;
    const req$ = this.isEdit
      ? this.bookSvc.update(this.bookId!, payload)
      : this.bookSvc.create(payload);

    req$.subscribe({
      next: () => this.router.navigate(['/books']),
      error: (e) => { this.errorMsg = e.message; this.submitting = false; }
    });
  }
}
