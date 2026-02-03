import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  InternalBook
} from '../../models/book.model';
import { environment } from '../../../environments/environment'

@Injectable({ providedIn: 'root' })
export class InternalBookService {
  private apiUrl = `${environment.apiUrl}/internal-books`;

  constructor(private http: HttpClient) {}

  getByDocId(docId: string): Observable<InternalBook> {
    return this.http.get<InternalBook>(`${this.apiUrl}/${docId}`);
  }
}
