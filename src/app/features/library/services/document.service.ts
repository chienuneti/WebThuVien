// src/app/features/library/services/document.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';

export interface DocumentInfo {
  id: string;
  title: string;
  description: string;
  documentType: string;
  pageNum: number;
  publicationDate: string;
  coverPath: string;
  introEndPage: number;
  collectionId: string;
  authors: Author[];
  keywords: Keyword[];
  identifiers: Identifier[];
  licenses: License[];
  avgRating: number;
  totalReviews: number;
  totalDownloads: number;
  totalViews: number;
  internalBook?: InternalBook;
  thesis?: Thesis;
  research?: Research;
  externalBook?: ExternalBook;
  researchPublication?: ResearchPublication;
}

export interface Author {
  name: string;
  email: string;
  description?: string;
  image?: string;
  expertise?: string;
  orcId?: string;
}

export interface Keyword {
  name: string;
}

export interface Identifier {
  type: string;
  value: string;
}

export interface License {
  id: string;
  name: string;
  content: string;
}

export interface InternalBook {
  faculty: string;
  documentType: string;
  version: number;
}

export interface Thesis {
  degreeType: string;
  supervisor: string;
  university: string;
}

export interface Research {
  researchType: string;
  fundingSource?: string;
}

export interface ExternalBook {
  publisher: string;
  isbn?: string;
}

export interface ResearchPublication {
  journalName: string;
  volume?: string;
  issue?: string;
  doi?: string;
}

export interface DocumentFile {
  id: string;
  documentId: string;
  document?: DocumentInfo;
  filePath: string;
  version: number;
  changeNote?: string;
}

export interface AccessInfo {
  documentId: string;
  title: string;
  totalPages: number;
  introEndPage: number;
  isAuthenticated: boolean;
  lastReadPage?: number;
  canDownload: boolean;
}

export interface PageAccessResponse {
  success: boolean;
  filePath: string;
  currentPage: number;
  totalPages: number;
  maxPageForGuest: number;
  isAuthenticated: boolean;
}

export interface UpdateProgressRequest {
  currentPage: number;
}

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  private apiUrl = environment.apiUrl || 'https://localhost:7212/api';
  private currentDocumentSubject = new BehaviorSubject<DocumentInfo | null>(null);
  public currentDocument$ = this.currentDocumentSubject.asObservable();

  constructor(private http: HttpClient) { }

  // Get document information
  getDocument(id: string): Observable<DocumentInfo> {
    return this.http.get<DocumentInfo>(`${this.apiUrl}/Documents/${id}`)
      .pipe(
        tap(doc => this.currentDocumentSubject.next(doc)),
        catchError(error => {
          console.error('Error fetching document:', error);
          throw error;
        })
      );
  }

  // Get document files
  getDocumentFiles(id: string): Observable<DocumentFile[]> {
    return this.http.get<DocumentFile[]>(`${this.apiUrl}/Documents/${id}/files`)
      .pipe(
        catchError(error => {
          console.error('Error fetching document files:', error);
          throw error;
        })
      );
  }

  // Get document file URL (for PDF viewer)
  getDocumentFileUrl(id: string): string {
    return `${this.apiUrl}/Documents/${id}/file`;
  }

  // Get access information for reader
  getAccessInfo(documentId: string): Observable<AccessInfo> {
    return this.http.get<AccessInfo>(`${this.apiUrl}/DocumentReader/${documentId}/access-info`)
      .pipe(
        catchError(error => {
          console.error('Error fetching access info:', error);
          throw error;
        })
      );
  }

  // Get specific page (with authentication check)
  getPage(documentId: string, pageNumber: number): Observable<PageAccessResponse> {
    return this.http.get<PageAccessResponse>(
      `${this.apiUrl}/DocumentReader/${documentId}/page/${pageNumber}`
    ).pipe(
      catchError(error => {
        console.error('Error fetching page:', error);
        throw error;
      })
    );
  }

  // Update reading progress (requires authentication)
  updateProgress(documentId: string, currentPage: number): Observable<any> {
    const request: UpdateProgressRequest = { currentPage };
    return this.http.post(
      `${this.apiUrl}/DocumentReader/${documentId}/update-progress`,
      request
    ).pipe(
      catchError(error => {
        console.error('Error updating progress:', error);
        throw error;
      })
    );
  }

  // Search documents
  searchDocuments(query: string, filters?: any): Observable<DocumentInfo[]> {
    let params: any = { query };
    if (filters) {
      params = { ...params, ...filters };
    }
    return this.http.get<DocumentInfo[]>(`${this.apiUrl}/Documents/search`, { params });
  }

  // Get user's reading history
  getReadingHistory(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/User/reading-history`);
  }

  // Clear current document
  clearCurrentDocument(): void {
    this.currentDocumentSubject.next(null);
  }
}

