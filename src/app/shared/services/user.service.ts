import { Injectable, StreamingResourceOptions } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../models/auth.model';

export interface UserProfile {
  email: string;
  name: string;
  class: string;
  phoneNumber: string;
}

export interface Book {
  documentId: string;
  title: string;
//   author: string[];
  coverPath?: string;
  publicationDate?: string;
  progress?: number;
}

export interface HistoryItem {
  id: number;
  bookTitle: string;
  bookAuthor: string;
  date: string;
  type: 'upload' | 'download';
}

@Injectable({
  providedIn: 'root'
})
export class UserProfileService {
  private apiUrl = 'https://localhost:7212/api';

  constructor(private http: HttpClient) {}

  /**
   * Lấy headers với token authentication (nếu có)
   */
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('auth_token'); // Hoặc sessionStorage
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    
    return headers;
  }

  /**
   * Lấy thông tin cá nhân user
   */
  getUserProfile(): Observable<ApiResponse<UserProfile>> {   
    return this.http.get<ApiResponse<UserProfile>>(`${this.apiUrl}/Users/me`, {
        headers: this.getHeaders()
    });
  }

  /**
   * Lấy danh sách sách đã lưu
   */
  getSavedBooks(): Observable<ApiResponse<Book[]>> {
    return this.http.get<ApiResponse<Book[]>>(`${this.apiUrl}/SavedDocuments`, {
      headers: this.getHeaders()
    });
  }

  /**
   * Lấy danh sách sách đang đọc
   */
  getCurrentlyReading(): Observable<ApiResponse<Book[]>> {
    return this.http.get<ApiResponse<Book[]>>(`${this.apiUrl}/ReadingDocuments`, {
      headers: this.getHeaders()
    });
  }

  /**
   * Lấy lịch sử upload sách
   */
  getUploadHistory(): Observable<HistoryItem[]> {
    return this.http.get<HistoryItem[]>(`${this.apiUrl}/user/upload-history`, {
      headers: this.getHeaders()
    });
  }

  /**
   * Lấy lịch sử download sách
   */
  getDownloadHistory(): Observable<HistoryItem[]> {
    return this.http.get<HistoryItem[]>(`${this.apiUrl}/user/download-history`, {
      headers: this.getHeaders()
    });
  }

  /**
   * Xóa sách khỏi danh sách đã lưu
   */
  removeSavedBook(bookId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/user/saved-books/${bookId}`, {
      headers: this.getHeaders()
    });
  }

  /**
   * Thêm sách vào danh sách đã lưu
   */
//   addSavedBook(bookId: StreamingResourceOptions): Observable<any> {
//     return this.http.post(`${this.apiUrl}/user/saved-books`, 
//       { bookId },
//       { headers: this.getHeaders() }
//     );
//   }

  /**
   * Cập nhật tiến độ đọc sách
   */
  updateReadingProgress(bookId: number, progress: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/user/reading-progress/${bookId}`,
      { progress },
      { headers: this.getHeaders() }
    );
  }

  /**
   * Cập nhật thông tin cá nhân
   */
  updateProfile(profileData: Partial<UserProfile>): Observable<UserProfile> {
    return this.http.put<UserProfile>(`${this.apiUrl}/Users/me`,
      profileData,
      { headers: this.getHeaders() }
    );
  }
}