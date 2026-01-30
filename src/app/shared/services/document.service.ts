import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import {
  DocumentListDto,
  DocumentDetailDto,
  DocFile,
  DocumentPopularDto,
  DocumentList2Dto,
  Review,
  PaginatedResult 
} from '../../models/book.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class DocumentService {
  private apiUrl = `${environment.apiUrl}/documents`;

  constructor(private http: HttpClient) { }

  /** 
   * Danh sách tài liệu (Có phân trang từ BE) 
   */
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

  getReviews(docId: string): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.apiUrl}/${docId}/reviews`);
  }

  addReview(docId: string, rating: number, content: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/${docId}/reviews`, { rating, content });
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
  
  // --- CẬP NHẬT CÁC HÀM NÀY ĐỂ HỖ TRỢ PHÂN TRANG ---

  // Thêm params?: any để nhận page, pageSize từ Component
  // Đổi kiểu trả về thành Observable<any> vì BE có thể trả về mảng [] hoặc PaginatedResult {}
  getAuthors(params?: any): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/authors`, { params });
  }

  getCollections(params?: any): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/collections`, { params });
  }

  getCommunities(params?: any): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/communities`, { params });
  }

  // Hàm này thường ít mục nên không cần phân trang, nhưng thêm params vào cho đồng bộ interface
  getDocumentTypes(params?: any): Observable<any[]> {
    const types = [
      { id: 'InternalBook', name: 'Sách nội bộ', description: 'Giáo trình, bài giảng lưu hành nội bộ' },
      { id: 'ExternalBook', name: 'Sách xuất bản', description: 'Sách có mã ISBN từ các nhà xuất bản' },
      { id: 'Thesis', name: 'Luận văn / Đồ án', description: 'Đồ án tốt nghiệp, luận văn thạc sĩ, tiến sĩ' },
      { id: 'Research', name: 'Đề tài nghiên cứu', description: 'Các đề tài nghiên cứu khoa học các cấp' },
      { id: 'ResearchPublication', name: 'Hội thảo/Tạp chí', description: 'Các bài báo khoa học đăng trên hội thảo/tạp chí' },
    ];
    // Dù có params hay không thì vẫn trả về list này (client tự phân trang nếu cần thiết)
    return of(types);
  }

  // --------------------------------------------------

  getDocuments(params: any): Observable<PaginatedResult<DocumentListDto>> {
    return this.http.get<PaginatedResult<DocumentListDto>>(this.apiUrl, { params });
  }
}