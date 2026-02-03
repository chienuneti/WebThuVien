import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { catchError, of, Subject, takeUntil } from 'rxjs';
import { AuthService } from '../../shared/services/auth.service'; // Adjust path

interface DocumentInfo {
  id: string;
  title: string;
  description: string;
  documentType: string;
  pageNum: number;
  publicationDate: string;
  coverPath: string;
  introEndPage: number;
  authors: Author[];
  keywords: string[];
  avgRating: number;
  totalReviews: number;
  totalDownloads: number;
  totalViews: number;
}

interface Author {
  name: string;
  email: string;
  expertise: string;
}

interface DocumentFile {
  id: string;
  documentId: string;
  filePath: string;
  version: number;
  changeNote: string | null;
}

interface AccessInfo {
  documentId: string;
  title: string;
  totalPages: number;
  introEndPage: number;
  isAuthenticated: boolean;
  lastReadPage: number | null;
  canDownload: boolean;
}

declare var pdfjsLib: any;

@Component({
  selector: 'app-book-reader',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './book-reader.component.html',
  styleUrls: ['./book-reader.component.css']
})
export class BookReaderComponent implements OnInit, OnDestroy, AfterViewInit {
  private destroy$ = new Subject<void>();
  private apiUrl = 'https://localhost:7212/api';
  
  documentId: string = '';
  document: DocumentInfo | null = null;
  documentFile: DocumentFile | null = null;
  accessInfo: AccessInfo | null = null;
  
  currentPage: number = 0;
  totalPages: number = 0;
  maxPageForGuest: number = 0;
  isAuthenticated: boolean = false;
  pdfUrl: string = '';
  
  loading: boolean = true;
  error: string = '';
  showLoginPrompt: boolean = false;
  
  // PDF.js related
  pdfDoc: any = null;
  pageRendering: boolean = false;
  pageNumPending: number | null = null;
  scale: number = 1.5;
  canvas: HTMLCanvasElement | null = null;
  ctx: CanvasRenderingContext2D | null = null;
  
  // Debug flags
  pdfJsLoaded: boolean = false;
  canvasReady: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private authService: AuthService  // Inject AuthService
  ) {
    console.log('BookReaderComponent constructor');
  }

  async ngOnInit() {
    console.log('ngOnInit started');
    
    // Check authentication using AuthService
    this.isAuthenticated = this.authService.isAuthenticated();
    console.log('User authenticated:', this.isAuthenticated);
    
    // Check if PDF.js is loaded
    this.pdfJsLoaded = typeof pdfjsLib !== 'undefined';
    console.log('PDF.js loaded:', this.pdfJsLoaded);
    
    if (!this.pdfJsLoaded) {
      this.error = 'PDF.js library chưa được tải. Vui lòng kiểm tra index.html';
      this.loading = false;
      return;
    }
    
    this.documentId = this.route.snapshot.paramMap.get('id') || '';
    console.log('Document ID:', this.documentId);
    
    if (!this.documentId) {
      this.error = 'Không tìm thấy ID tài liệu';
      this.loading = false;
      return;
    }

    await this.loadDocumentData();
  }

  ngAfterViewInit() {
    console.log('ngAfterViewInit - checking canvas');
    setTimeout(() => {
      this.checkCanvasAndInitPdf();
    }, 100);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    
    if (this.pdfDoc) {
      this.pdfDoc.destroy();
    }
  }

  private async loadDocumentData() {
    console.log('Loading document data...');
    try {
      // Load document info
      const doc = await this.http.get<DocumentInfo>(`${this.apiUrl}/Documents/${this.documentId}`)
        .pipe(
          takeUntil(this.destroy$),
          catchError(err => {
            console.error('Error loading document:', err);
            return of(null);
          })
        ).toPromise();

      if (!doc) {
        this.error = 'Không tìm thấy tài liệu';
        this.loading = false;
        return;
      }

      console.log('Document loaded:', doc);
      this.document = doc;
      this.totalPages = doc.pageNum;
      
      // Set maxPageForGuest - QUAN TRỌNG: introEndPage = 5 nghĩa là đọc từ trang 1-5 (index 0-4)
      this.maxPageForGuest = doc.introEndPage - 1; // Trừ 1 vì index bắt đầu từ 0
      console.log('Max page for guest (0-indexed):', this.maxPageForGuest);
      console.log('Guest can read pages:', `1-${doc.introEndPage} (index 0-${this.maxPageForGuest})`);

      // Load document file
      const files = await this.http.get<DocumentFile[]>(`${this.apiUrl}/Documents/${this.documentId}/files`)
        .pipe(
          takeUntil(this.destroy$),
          catchError(err => {
            console.error('Error loading files:', err);
            return of([]);
          })
        ).toPromise();

      console.log('Files loaded:', files);
      
      if (files && files.length > 0) {
        this.documentFile = files[0];
        this.pdfUrl = `${this.apiUrl}/Documents/${this.documentId}/file`;
        console.log('PDF URL:', this.pdfUrl);
      } else {
        this.error = 'Không tìm thấy file PDF';
        this.loading = false;
        return;
      }

      // Load access info
      const accessInfo = await this.http.get<AccessInfo>(`${this.apiUrl}/DocumentReader/${this.documentId}/access-info`)
        .pipe(
          takeUntil(this.destroy$),
          catchError(err => {
            console.error('Error loading access info:', err);
            return of(null);
          })
        ).toPromise();

      console.log('Access info loaded:', accessInfo);
      
      if (accessInfo) {
        this.accessInfo = accessInfo;
        // Use AuthService for authentication check
        this.isAuthenticated = this.authService.isAuthenticated();
        
        // Set starting page
        if (this.isAuthenticated && accessInfo.lastReadPage !== null) {
          this.currentPage = accessInfo.lastReadPage;
        } else {
          this.currentPage = 0; // Start from first page
        }
      }

      this.loading = false;
      this.checkCanvasAndInitPdf();
      
    } catch (err) {
      console.error('Error in loadDocumentData:', err);
      this.error = 'Có lỗi xảy ra khi tải tài liệu';
      this.loading = false;
    }
  }

  private checkCanvasAndInitPdf() {
    console.log('Checking canvas and initializing PDF...');
    
    if (!this.pdfUrl) {
      console.log('PDF URL not ready yet');
      return;
    }
    
    this.canvas = document.getElementById('pdf-canvas') as HTMLCanvasElement;
    
    if (!this.canvas) {
      console.error('Canvas element not found!');
      setTimeout(() => this.checkCanvasAndInitPdf(), 200);
      return;
    }
    
    console.log('Canvas found:', this.canvas);
    this.canvasReady = true;
    this.initializePdfViewer();
  }

  private async initializePdfViewer() {
    console.log('Initializing PDF viewer...');
    
    if (!this.pdfUrl || !this.canvas) {
      console.error('Missing pdfUrl or canvas');
      return;
    }

    try {
      if (typeof pdfjsLib !== 'undefined' && !pdfjsLib.GlobalWorkerOptions.workerSrc) {
        pdfjsLib.GlobalWorkerOptions.workerSrc = 
          'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
      }
      
      console.log('PDF.js worker configured');
      
      this.ctx = this.canvas.getContext('2d');
      
      if (!this.ctx) {
        console.error('Could not get 2D context');
        this.error = 'Không thể khởi tạo canvas';
        return;
      }

      console.log('Loading PDF from:', this.pdfUrl);
      
      const loadingTask = pdfjsLib.getDocument({
        url: this.pdfUrl,
        withCredentials: true,
        httpHeaders: this.getAuthHeaders()
      });

      loadingTask.onProgress = (progress: any) => {
        console.log('Loading progress:', progress.loaded, '/', progress.total);
      };

      this.pdfDoc = await loadingTask.promise;
      console.log('PDF loaded successfully. Pages:', this.pdfDoc.numPages);
      
      if (this.pdfDoc.numPages !== this.totalPages) {
        console.warn('Page count mismatch. DB:', this.totalPages, 'PDF:', this.pdfDoc.numPages);
        this.totalPages = this.pdfDoc.numPages;
      }
      
      // Render first page or last read page
      await this.renderPage(this.currentPage + 1);
      
    } catch (err: any) {
      console.error('Error loading PDF:', err);
      this.error = `Không thể tải file PDF: ${err.message || 'Unknown error'}`;
      
      if (err.message && err.message.includes('CORS')) {
        this.error = 'Lỗi CORS: Vui lòng kiểm tra cấu hình CORS trên server';
      }
    }
  }

  private getAuthHeaders(): any {
    const token = this.authService.getToken();
    if (token) {
      return {
        'Authorization': `Bearer ${token}`
      };
    }
    return {};
  }

  private async renderPage(num: number) {
    if (!this.pdfDoc || !this.canvas || !this.ctx) {
      console.error('Missing pdfDoc, canvas, or ctx');
      return;
    }

    console.log('Rendering page:', num);
    this.pageRendering = true;

    try {
      const page = await this.pdfDoc.getPage(num);
      console.log('Page loaded:', num);
      
      const viewport = page.getViewport({ scale: this.scale });
      console.log('Viewport:', viewport.width, 'x', viewport.height);

      this.canvas.height = viewport.height;
      this.canvas.width = viewport.width;

      const renderContext = {
        canvasContext: this.ctx,
        viewport: viewport
      };

      const renderTask = page.render(renderContext);
      await renderTask.promise;
      
      console.log('Page rendered successfully');
      
      this.pageRendering = false;
      this.currentPage = num - 1;

      // Update reading progress if authenticated
      if (this.isAuthenticated) {
        this.updateProgress();
      }

      // Handle pending page render
      if (this.pageNumPending !== null) {
        this.renderPage(this.pageNumPending);
        this.pageNumPending = null;
      }
    } catch (err) {
      console.error('Error rendering page:', err);
      this.pageRendering = false;
      this.error = 'Không thể hiển thị trang PDF';
    }
  }

  private queueRenderPage(num: number) {
    if (this.pageRendering) {
      this.pageNumPending = num;
    } else {
      this.renderPage(num);
    }
  }

  previousPage() {
    if (this.currentPage <= 0) return;
    this.queueRenderPage(this.currentPage);
  }

  nextPage() {
    // FIXED: Kiểm tra quyền truy cập chính xác
    const nextPageIndex = this.currentPage + 1;
    
    if (!this.canAccessPage(nextPageIndex)) {
      console.log('Cannot access page:', nextPageIndex + 1, '(index:', nextPageIndex + ')');
      this.showLoginPrompt = true;
      return;
    }

    if (nextPageIndex >= this.totalPages) return;
    this.queueRenderPage(nextPageIndex + 1); // +1 for PDF.js 1-based indexing
  }

  goToPage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    
    const pageIndex = page - 1;
    
    if (!this.canAccessPage(pageIndex)) {
      console.log('Cannot access page:', page, '(index:', pageIndex + ')');
      this.showLoginPrompt = true;
      return;
    }

    this.queueRenderPage(page);
  }

  onPageInputChange(event: Event) {
    const input = event.target as HTMLInputElement;
    const pageNum = parseInt(input.value, 10);
    if (!isNaN(pageNum)) {
      this.goToPage(pageNum);
    }
  }

  /**
   * FIXED: Kiểm tra quyền truy cập trang chính xác
   * introEndPage = 5 → maxPageForGuest = 4 (index 0-4) → trang 1-5
   * pageIndex = 0,1,2,3,4 → OK
   * pageIndex = 5 → KHÔNG OK (trang 6)
   */
  canAccessPage(pageIndex: number): boolean {
    if (this.isAuthenticated) {
      console.log('User authenticated - can access all pages');
      return true;
    }
    
    const canAccess = pageIndex <= this.maxPageForGuest;
    console.log(`Guest access check - Page ${pageIndex + 1} (index ${pageIndex}): ${canAccess ? 'ALLOWED' : 'DENIED'} (max index: ${this.maxPageForGuest})`);
    return canAccess;
  }

  zoomIn() {
    this.scale += 0.25;
    if (this.scale > 3) this.scale = 3;
    this.queueRenderPage(this.currentPage + 1);
  }

  zoomOut() {
    this.scale -= 0.25;
    if (this.scale < 0.5) this.scale = 0.5;
    this.queueRenderPage(this.currentPage + 1);
  }

  resetZoom() {
    this.scale = 1.5;
    this.queueRenderPage(this.currentPage + 1);
  }

  private async updateProgress() {
    if (!this.isAuthenticated || !this.documentId) return;

    try {
      await this.http.post(
        `${this.apiUrl}/DocumentReader/${this.documentId}/update-progress`,
        { currentPage: this.currentPage }
      ).pipe(
        takeUntil(this.destroy$),
        catchError(err => {
          console.error('Error updating progress:', err);
          return of(null);
        })
      ).toPromise();
    } catch (err) {
      console.error('Error in updateProgress:', err);
    }
  }

  closeLoginPrompt() {
    this.showLoginPrompt = false;
  }

  goToLogin() {
    localStorage.setItem('returnUrl', this.router.url);
    this.router.navigate(['/login']);
  }

  goBack() {
    this.router.navigate(['/library/document-detail', this.documentId]);
  }

  get progressPercentage(): number {
    if (this.totalPages === 0) return 0;
    return Math.round(((this.currentPage + 1) / this.totalPages) * 100);
  }

  get canGoBack(): boolean {
    return this.currentPage > 0;
  }

  get canGoForward(): boolean {
    const nextPageIndex = this.currentPage + 1;
    
    if (!this.isAuthenticated) {
      // Guest can only go forward if next page is within allowed range
      return nextPageIndex <= this.maxPageForGuest;
    }
    
    // Authenticated user can go forward until last page
    return nextPageIndex < this.totalPages;
  }

  // Debug method
  debugInfo() {
    console.log('=== DEBUG INFO ===');
    console.log('Authenticated:', this.isAuthenticated);
    console.log('Current page (0-indexed):', this.currentPage);
    console.log('Current page (display):', this.currentPage + 1);
    console.log('Total pages:', this.totalPages);
    console.log('IntroEndPage from DB:', this.document?.introEndPage);
    console.log('Max page for guest (0-indexed):', this.maxPageForGuest);
    console.log('Guest can read pages:', `1-${this.maxPageForGuest + 1}`);
    console.log('Can go forward:', this.canGoForward);
    console.log('Can go back:', this.canGoBack);
    console.log('PDF.js loaded:', this.pdfJsLoaded);
    console.log('Canvas ready:', this.canvasReady);
    console.log('PDF URL:', this.pdfUrl);
    console.log('PDF Doc:', this.pdfDoc);
    console.log('Canvas:', this.canvas);
    console.log('Scale:', this.scale);
    console.log('==================');
  }
}