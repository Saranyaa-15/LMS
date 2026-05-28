import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Book, BookRequest } from '../models/book.model';
import { ApiResponse } from '../models/api-response.model';

@Injectable({ providedIn: 'root' })
export class BookService {
  private readonly base = `${environment.apiBaseUrl}/books`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Book[]> {
    return this.http.get<ApiResponse<Book[]>>(this.base).pipe(map(r => r.data));
  }

  getById(id: number): Observable<Book> {
    return this.http.get<ApiResponse<Book>>(`${this.base}/${id}`).pipe(map(r => r.data));
  }

  search(query: string): Observable<Book[]> {
    const params = new HttpParams().set('query', query);
    return this.http.get<ApiResponse<Book[]>>(`${this.base}/search`, { params }).pipe(map(r => r.data));
  }

  create(payload: BookRequest): Observable<Book> {
    return this.http.post<ApiResponse<Book>>(this.base, payload).pipe(map(r => r.data));
  }

  update(id: number, payload: BookRequest): Observable<Book> {
    return this.http.put<ApiResponse<Book>>(`${this.base}/${id}`, payload).pipe(map(r => r.data));
  }

  delete(id: number): Observable<void> {
    return this.http.delete<ApiResponse<void>>(`${this.base}/${id}`).pipe(map(() => void 0));
  }
}
