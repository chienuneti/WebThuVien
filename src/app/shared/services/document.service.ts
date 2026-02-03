import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import {
  DocumentListDto,
  DocumentDetailDto,
  DocFile,
  DocumentPopularDto,
  DocumentList2Dto,
  Review,
  PaginatedResult,
  CreateDocumentForm
} from '../../models/book.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class DocumentService {
  private apiUrl = `${environment.apiUrl}/documents`;

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('auth_token');
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    
    return headers;
  }

  // ==================== REVIEW METHODS ====================
  
  getReviews(docId: string): Observable<Review[]> {
    return this.http.get<Review[]>(
      `${this.apiUrl}/${docId}/reviews`
    );
  }

  addReview(docId: string, rating: number, content: string): Observable<any> {
    const body = { rating, content };
    return this.http.post(
      `${this.apiUrl}/${docId}/reviews`,
      body,
      { headers: this.getHeaders() }
    );
  }

  updateReview(docId: string, reviewId: number, rating?: number, content?: string): Observable<any> {
    const body: any = {};
    if (rating !== undefined) body.rating = rating;
    if (content !== undefined) body.content = content;
    
    return this.http.put(
      `${this.apiUrl}/${docId}/reviews/${reviewId}`,
      body,
      { headers: this.getHeaders() }
    );
  }

  deleteReview(docId: string, reviewId: number): Observable<any> {
    return this.http.delete(
      `${this.apiUrl}/${docId}/reviews/${reviewId}`,
      { headers: this.getHeaders() }
    );
  }

  getReviewStats(docId: string): Observable<any> {
    return this.http.get(
      `${this.apiUrl}/${docId}/reviews/stats`
    );
  }

  // ==================== DOWNLOAD METHODS ====================

  logDownload(documentId: string): Observable<any> {
    const url = `${environment.apiUrl}/Downloads`;
    return this.http.post(url, { documentId }, { headers: this.getHeaders() });
  }

  downloadDocument(id: string): Observable<Blob> {
    return this.http.get(
      `${this.apiUrl}/${id}/download`,
      { 
        responseType: 'blob',
        headers: this.getHeaders()
      }
    );
  }

  // ==================== DOCUMENT METHODS ====================

  getAll(page: number = 1, pageSize: number = 10): Observable<PaginatedResult<DocumentListDto>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString())
      .set('sortBy', 'newest');

    return this.http.get<PaginatedResult<DocumentListDto>>(this.apiUrl, { params });
  }

  getById(id: string): Observable<DocumentDetailDto> {
    return this.http.get<DocumentDetailDto>(`${this.apiUrl}/${id}`);
  }

  search(keyword: string): Observable<DocumentListDto[]> {
    return this.http.get<DocumentListDto[]>(
      `${this.apiUrl}/search`,
      { params: { keyword } }
    );
  }

  getAllLicenses() {
    return this.http.get(`${environment.apiUrl}/Documents/licenses`);
  }

  create(dto: any): Observable<string> {
    return this.http.post(`${this.apiUrl}`, dto, { responseType: 'text' });
  }

  update(submissionId: string, dto: any): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${submissionId}`, dto);
  }

  uploadNewVersion(
    documentId: string,
    dto: { filePath: string; changeNote: string; submissionId: string }
  ): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${documentId}/files`, dto);
  }

  getFiles(docId: string): Observable<DocFile[]> {
    return this.http.get<DocFile[]>(`${this.apiUrl}/${docId}/files`);
  }

  downloadFile(fileId: string): Observable<Blob> {
    return this.http.get(
      `${this.apiUrl}/files/${fileId}/download`,
      { responseType: 'blob' }
    );
  }

  getPopular(): Observable<DocumentPopularDto[]> {
    return this.http.get<DocumentPopularDto[]>(`${this.apiUrl}/popular`);
  }

  getTrending(): Observable<DocumentList2Dto[]> {
    return this.http.get<DocumentList2Dto[]>(`${this.apiUrl}/trending`);
  }

  getAuthors(params?: any): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/authors`, { params });
  }

  getCollections(params?: any): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/collections`, { params });
  }

  getCommunities(params?: any): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/communities`, { params });
  }

  getDocumentTypes(params?: any): Observable<any[]> {
    const types = [
      { id: 'InternalBook', name: 'Sách nội bộ', description: 'Giáo trình, bài giảng lưu hành nội bộ' },
      { id: 'ExternalBook', name: 'Sách xuất bản', description: 'Sách có mã ISBN từ các nhà xuất bản' },
      { id: 'Thesis', name: 'Luận văn / Đồ án', description: 'Đồ án tốt nghiệp, luận văn thạc sĩ, tiến sĩ' },
      { id: 'Research', name: 'Đề tài nghiên cứu', description: 'Các đề tài nghiên cứu khoa học các cấp' },
      { id: 'ResearchPublication', name: 'Hội thảo/Tạp chí', description: 'Các bài báo khoa học đăng trên hội thảo/tạp chí' },
    ];
    return of(types);
  }

  getDocuments(params: any): Observable<PaginatedResult<DocumentListDto>> {
    return this.http.get<PaginatedResult<DocumentListDto>>(this.apiUrl, { params });
  }

  createDocument(data: CreateDocumentForm): Observable<any> {
    const formData = new FormData();

    formData.append('Title', data.title);
    formData.append('Description', data.description || '');
    formData.append('DocumentType', data.documentType);
    formData.append('CollectionId', data.collectionId);

    if (data.publicationDate) formData.append('PublicationDate', data.publicationDate);
    if (data.pageNum) formData.append('PageNum', data.pageNum.toString());
    if (data.introEndPage) formData.append('IntroEndPage', data.introEndPage.toString());

    if (data.file) formData.append('File', data.file);
    if (data.coverFile) formData.append('CoverFile', data.coverFile);

    if (data.keywords) {
      const keywordList = data.keywords.split(',').map(k => k.trim()).filter(k => k);
      keywordList.forEach((kw, index) => {
        formData.append(`Keywords[${index}]`, kw);
      });
    }

    data.authors.forEach((author, index) => {
      formData.append(`Authors[${index}].Name`, author.name);
      if (author.email) formData.append(`Authors[${index}].Email`, author.email);
      if (author.orcid) formData.append(`Authors[${index}].Orcid`, author.orcid);
      if (author.description) formData.append(`Authors[${index}].Description`, author.description);
      if (author.expertise) formData.append(`Authors[${index}].Expertise`, author.expertise);
      if (author.imageFile) {
        formData.append(`Authors[${index}].ImageFile`, author.imageFile);
      }
    });

    data.identifiers.forEach((id, index) => {
      formData.append(`Identifiers[${index}].Type`, id.type);
      formData.append(`Identifiers[${index}].Value`, id.value);
    });

    data.licenses.forEach((lic, index) => {
      if (lic.uiMode === 'SELECT' && lic.selectedId) {
        formData.append(`Licenses[${index}].Id`, lic.selectedId);
      } else {
        formData.append(`Licenses[${index}].Name`, lic.name || '');
        if (lic.content) {
          formData.append(`Licenses[${index}].Content`, lic.content);
        }
      }
    });

    switch (data.documentType) {
      case 'InternalBook':
        if (data.internalBook) {
          formData.append('InternalBook.Faculty', data.internalBook.faculty || '');
          formData.append('InternalBook.DocumentType', data.internalBook.documentType || '');
          formData.append('InternalBook.Version', data.internalBook.version || '');
        }
        break;
      case 'ExternalBook':
        if (data.externalBook) {
          formData.append('ExternalBook.Publisher', data.externalBook.publisher || '');
          formData.append('ExternalBook.Version', data.externalBook.version || '');
        }
        break;
      case 'Thesis':
        if (data.thesis) {
          formData.append('Thesis.DegreeLevel', data.thesis.degreeLevel || '');
          formData.append('Thesis.Discipline', data.thesis.discipline || '');
          formData.append('Thesis.AdvisorName', data.thesis.advisorName || '');
          formData.append('Thesis.Abstract', data.thesis.abstract || '');
        }
        break;
      case 'Research':
        if (data.research) {
          formData.append('Research.Abstract', data.research.abstract || '');
          formData.append('Research.ResearchLevel', data.research.researchLevel || '');
        }
        break;
      case 'ResearchPublication':
        if (data.researchPublication) {
          formData.append('ResearchPublication.VenueName', data.researchPublication.venueName || '');
          formData.append('ResearchPublication.PublicationType', data.researchPublication.publicationType || '');
        }
        break;
    }

    return this.http.post(`${this.apiUrl}/create`, formData);
  }

  updateDocument(submissionId: string, data: any) {
    const formData = new FormData();

    formData.append('Title', data.title);
    formData.append('Description', data.description || '');
    formData.append('DocumentType', data.documentType);
    formData.append('CollectionId', data.collectionId);

    if (data.publicationDate) formData.append('PublicationDate', data.publicationDate);
    if (data.pageNum) formData.append('PageNum', data.pageNum.toString());
    if (data.introEndPage) formData.append('IntroEndPage', data.introEndPage.toString());

    formData.append('RevisionComment', data.revisionComment);

    if (data.file) formData.append('File', data.file);
    if (data.coverFile) formData.append('CoverFile', data.coverFile);

    if (data.keywords) {
      data.keywords
        .split(',')
        .map((k: string) => k.trim())
        .filter((k: string) => k)
        .forEach((kw: string, i: number) => {
          formData.append(`Keywords[${i}]`, kw);
        });
    }

    data.authors.forEach((a: any, i: number) => {
      formData.append(`Authors[${i}].Name`, a.name);
      if (a.email) formData.append(`Authors[${i}].Email`, a.email);
      if (a.orcid) formData.append(`Authors[${i}].Orcid`, a.orcid);
      if (a.expertise) formData.append(`Authors[${i}].Expertise`, a.expertise);
      if (a.imageFile) {
        formData.append(`Authors[${i}].ImageFile`, a.imageFile);
      }
    });

    data.identifiers.forEach((id: any, i: number) => {
      formData.append(`Identifiers[${i}].Type`, id.type);
      formData.append(`Identifiers[${i}].Value`, id.value);
    });

    data.licenses.forEach((lic: any, i: number) => {
      if (lic.uiMode === 'SELECT' && lic.selectedId) {
        formData.append(`Licenses[${i}].Id`, lic.selectedId);
      } else {
        formData.append(`Licenses[${i}].Name`, lic.name || '');
        if (lic.content) {
          formData.append(`Licenses[${i}].Content`, lic.content);
        }
      }
    });

    switch (data.documentType) {
      case 'InternalBook':
        if (data.internalBook) {
          formData.append('InternalBook.Faculty', data.internalBook.faculty || '');
          formData.append('InternalBook.DocumentType', data.internalBook.documentType || '');
          formData.append('InternalBook.Version', data.internalBook.version || '');
        }
        break;

      case 'ExternalBook':
        if (data.externalBook) {
          formData.append('ExternalBook.Publisher', data.externalBook.publisher || '');
          formData.append('ExternalBook.Version', data.externalBook.version || '');
        }
        break;

      case 'Thesis':
        if (data.thesis) {
          formData.append('Thesis.DegreeLevel', data.thesis.degreeLevel || '');
          formData.append('Thesis.Discipline', data.thesis.discipline || '');
          formData.append('Thesis.AdvisorName', data.thesis.advisorName || '');
          formData.append('Thesis.Abstract', data.thesis.abstract || '');
        }
        break;

      case 'Research':
        if (data.research) {
          formData.append('Research.Abstract', data.research.abstract || '');
          formData.append('Research.ResearchLevel', data.research.researchLevel || '');
        }
        break;

      case 'ResearchPublication':
        if (data.researchPublication) {
          formData.append('ResearchPublication.VenueName', data.researchPublication.venueName || '');
          formData.append('ResearchPublication.PublicationType', data.researchPublication.publicationType || '');
        }
        break;
    }

    return this.http.put(
      `${environment.apiUrl}/Documents/update/${submissionId}`,
      formData
    );
  }

  getAllSubmissionsForLibrarian(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/Submission/all-submissions`);
  }

  getLecturers(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/Submission/lecturers`);
  }

  assignReviewer(submissionId: string, reviewerId: string): Observable<any> {
    const params = new HttpParams()
      .set('submissionId', submissionId)
      .set('reviewerId', reviewerId);

    return this.http.post(`${environment.apiUrl}/Submission/assign-reviewer`, null, { params });
  }

  approveSubmission(submissionId: string): Observable<any> {
    const params = new HttpParams().set('id', submissionId);

    return this.http.post(`${environment.apiUrl}/Submission/finalreview`, null, { params });
  }

  getSubmissionHistory(submissionId: string): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/Submission/${submissionId}/history`);
  }
}