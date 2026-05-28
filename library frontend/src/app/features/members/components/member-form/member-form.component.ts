import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { MemberService } from '../../../../core/services/member.service';
import { AlertComponent } from '../../../../shared/components/alert/alert.component';
import { SpinnerComponent } from '../../../../shared/components/spinner.component';

@Component({
  selector: 'app-member-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, AlertComponent, SpinnerComponent],
  templateUrl: './member-form.component.html'
})
export class MemberFormComponent implements OnInit {
  form!: FormGroup;
  isEdit = false;
  memberId?: number;
  loading = false;
  submitting = false;
  errorMsg: string | null = null;

  constructor(
    private fb: FormBuilder,
    private memberSvc: MemberService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      name:  ['', [Validators.required, Validators.maxLength(255)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(255)]]
    });

    this.memberId = Number(this.route.snapshot.paramMap.get('id'));
    this.isEdit = !!this.memberId && !isNaN(this.memberId);

    if (this.isEdit) {
      this.loading = true;
      this.memberSvc.getById(this.memberId!).subscribe({
        next: m => { this.form.patchValue(m); this.loading = false; },
        error: (e) => { this.errorMsg = e.message; this.loading = false; }
      });
    }
  }

  get f() { return this.form.controls; }

  submit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.submitting = true;
    this.errorMsg = null;
    const req$ = this.isEdit
      ? this.memberSvc.update(this.memberId!, this.form.value)
      : this.memberSvc.create(this.form.value);

    req$.subscribe({
      next: () => this.router.navigate(['/members']),
      error: (e) => { this.errorMsg = e.message; this.submitting = false; }
    });
  }
}
