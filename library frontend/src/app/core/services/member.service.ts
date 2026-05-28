import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Member, MemberRequest } from '../models/member.model';
import { ApiResponse } from '../models/api-response.model';

@Injectable({ providedIn: 'root' })
export class MemberService {
  private readonly base = `${environment.apiBaseUrl}/members`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Member[]> {
    return this.http.get<ApiResponse<Member[]>>(this.base).pipe(map(r => r.data));
  }

  getById(id: number): Observable<Member> {
    return this.http.get<ApiResponse<Member>>(`${this.base}/${id}`).pipe(map(r => r.data));
  }

  create(payload: MemberRequest): Observable<Member> {
    return this.http.post<ApiResponse<Member>>(this.base, payload).pipe(map(r => r.data));
  }

  update(id: number, payload: MemberRequest): Observable<Member> {
    return this.http.put<ApiResponse<Member>>(`${this.base}/${id}`, payload).pipe(map(r => r.data));
  }

  deactivate(id: number): Observable<Member> {
    return this.http.patch<ApiResponse<Member>>(`${this.base}/${id}/deactivate`, {}).pipe(map(r => r.data));
  }

  activate(id: number): Observable<Member> {
    return this.http.patch<ApiResponse<Member>>(`${this.base}/${id}/activate`, {}).pipe(map(r => r.data));
  }
}
