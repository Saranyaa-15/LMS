import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export type AlertType = 'success' | 'danger' | 'warning' | 'info';

@Component({
  selector: 'app-alert',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="message" class="alert alert-{{ type }} alert-dismissible fade show d-flex align-items-center" role="alert">
      <i class="bi me-2" [ngClass]="{
        'bi-check-circle-fill': type === 'success',
        'bi-x-circle-fill': type === 'danger',
        'bi-exclamation-triangle-fill': type === 'warning',
        'bi-info-circle-fill': type === 'info'
      }"></i>
      <span>{{ message }}</span>
      <button type="button" class="btn-close ms-auto" (click)="dismiss.emit()"></button>
    </div>
  `
})
export class AlertComponent {
  @Input() message: string | null = null;
  @Input() type: AlertType = 'info';
  @Output() dismiss = new EventEmitter<void>();
}
