import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Transaction, IssueRequest, ReturnRequest } from '../models/transaction.model';
import { ApiResponse } from '../models/api-response.model';

@Injectable({ providedIn: 'root' })
export class TransactionService {
  private readonly base = `${environment.apiBaseUrl}/transactions`;

  constructor(private http: HttpClient) {}

  issue(payload: IssueRequest): Observable<Transaction> {
    return this.http.post<ApiResponse<Transaction>>(`${this.base}/issue`, payload).pipe(map(r => r.data));
  }

  returnBook(payload: ReturnRequest): Observable<Transaction> {
    return this.http.post<ApiResponse<Transaction>>(`${this.base}/return`, payload).pipe(map(r => r.data));
  }

  getByMember(memberId: number): Observable<Transaction[]> {
    return this.http.get<ApiResponse<Transaction[]>>(`${this.base}/member/${memberId}`).pipe(map(r => r.data));
  }

  getByBook(bookId: number): Observable<Transaction[]> {
    return this.http.get<ApiResponse<Transaction[]>>(`${this.base}/book/${bookId}`).pipe(map(r => r.data));
  }
}
