import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class SubmissionService {
  private apiUrl = `${environment.apiUrl}/Submission`;

  constructor(private http: HttpClient) {}

  create(documentId: string, collectionId: string) {
    return this.http.post(`${this.apiUrl}/create`, {
      documentId,
      collectionId
    });
  }

  prereview(submissionId: string, reviewerId: string) {
    return this.http.post(`${this.apiUrl}/prereview`, null, {
      params: { submissionId, reviewerId }
    });
  }

  review(submissionId: string, comment: string) {
    return this.http.post(`${this.apiUrl}/review`, {
      submissionId,
      comment
    });
  }

  finalReview(submissionId: string) {
    return this.http.post(`${this.apiUrl}/finalreview`, null, {
      params: { id: submissionId }
    });
  }

  assignReviewer(submissionId: string, reviewerId: string) {
    return this.http.post(`${this.apiUrl}/assign-reviewer`, null, {
      params: { submissionId, reviewerId }
    });
  }

  updateCollection(submissionId: string, collectionId: string) {
    return this.http.put(`${this.apiUrl}/update`, null, {
      params: { submissionId, collectionId }
    });
  }
}
