import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  DocumentListDto,
  DocumentDetailDto,
  InternalBook,
  ExternalBook,
  Thesis,
  Research,
  ResearchPublication,
  DocFile
} from '../../models/book.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class SubmissionService {
  private apiUrl = `${environment.apiUrl}/submissions`;

  constructor(private http: HttpClient) {}

  create(documentId: string, collectionId: string): Observable<string> {
    return this.http.post<string>(this.apiUrl, {
      documentId,
      collectionId
    });
  }

  prereview(submissionId: string): Observable<string> {
    return this.http.get(`${this.apiUrl}/${submissionId}/prereview`, {
      responseType: 'text'
    });
  }

  review(submissionId: string, comment: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/review`, {
      submissionId,
      comment
    });
  }

  finalReview(submissionId: string): Observable<void> {
    return this.http.post<void>(
      `${this.apiUrl}/${submissionId}/final-review`,
      {}
    );
  }

  assignReviewer(submissionId: string, reviewerId: string): Observable<void> {
    return this.http.post<void>(
      `${this.apiUrl}/${submissionId}/assign-reviewer`,
      { reviewerId }
    );
  }

  updateCollection(
    submissionId: string,
    collectionId: string
  ): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${submissionId}`, {
      collectionId
    });
  }
}
