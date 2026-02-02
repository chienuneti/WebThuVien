import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { DocumentService } from '../../../../shared/services/document.service';
import { DocumentDetailDto, DocFile } from '../../../../models/book.model';
import { environment } from '../../../../../environments/environment';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-book-reader',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="reader-container">
      <div class="reader-header">
        <div class="left-section">
          <button (click)="goBack()" class="btn-back">
            {{ isNewTab ? '✕ Đóng trình đọc' : '← Quay lại' }}
          </button>
          <h1 class="doc-title">{{ document?.title || 'Đang tải tài liệu...' }}</h1>
        </div>
        
        <div class="reader-controls">
          <button (click)="toggleFullscreen()" class="btn-control">⛶ Toàn màn hình</button>
        </div>
      </div>

      <div class="reader-content">
        <div class="viewer-wrapper">
          <div *ngIf="isLoading" class="pdf-placeholder">
             <div class="spinner"></div>
             <p>Đang chuẩn bị tài liệu...</p>
          </div>

          <iframe *ngIf="safePdfUrl" 
                  [src]="safePdfUrl" 
                  width="100%" 
                  height="100%" 
                  frameborder="0">
          </iframe>

          <div *ngIf="!isLoading && !safePdfUrl" class="pdf-placeholder">
             <h2>Không tìm thấy tệp tin</h2>
             <p>Tài liệu này hiện chưa có tệp PDF đính kèm hoặc bạn không có quyền truy cập.</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .reader-container { display: flex; flex-direction: column; height: 100vh; background: #1a1a1a; color: white; }
    .reader-header { display: flex; justify-content: space-between; align-items: center; padding: 10px 20px; background: #2d2d2d; box-shadow: 0 2px 10px rgba(0,0,0,0.5); z-index: 10; }
    .left-section { display: flex; align-items: center; gap: 20px; }
    .doc-title { margin: 0; font-size: 16px; font-weight: 500; color: #e0e0e0; border-left: 1px solid #555; padding-left: 20px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 50vw; }
    .btn-back { padding: 8px 16px; background: transparent; color: #aaa; border: 1px solid #555; border-radius: 4px; cursor: pointer; transition: all 0.2s; }
    .btn-back:hover { color: white; border-color: #999; background: #3d3d3d; }
    .btn-control { padding: 8px 16px; background: #4f46e5; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: 600; }
    .reader-content { flex: 1; display: flex; justify-content: center; background: #121212; position: relative; }
    .viewer-wrapper { width: 100%; height: 100%; background: white; overflow: hidden; }
    .pdf-placeholder { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; color: #666; }
    .spinner { border: 4px solid rgba(0, 0, 0, 0.1); width: 36px; height: 36px; border-radius: 50%; border-left-color: #4f46e5; animation: spin 1s linear infinite; margin-bottom: 10px; }
    @keyframes spin { to { transform: rotate(360deg); } }
  `]
})
export class BookReaderComponent implements OnInit {
  docId = '';
  document: DocumentDetailDto | null = null;
  safePdfUrl: SafeResourceUrl | null = null;
  isLoading = true;
  isNewTab = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private documentService: DocumentService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.docId = this.route.snapshot.params['id'] || '';
    
    this.isNewTab = window.history.length === 1;

    if (this.docId) {
      this.loadData();
    }
  }

  loadData(): void {
    this.isLoading = true;

    this.documentService.getById(this.docId).subscribe({
      next: (res) => { this.document = res; },
      error: (err) => console.error('Lỗi tải metadata:', err)
    });


    this.documentService.getFiles(this.docId).subscribe({
      next: (files: DocFile[]) => {
        if (files && files.length > 0) {
          console.log('Danh sách file tải về:', files);
          const latestFile = files.sort((a, b) => b.version - a.version)[0];
          console.log('File mới nhất được chọn:', latestFile);
          console.log('Đường dẫn file:', latestFile.filePath);

          const fullUrl = `${environment.staticUrl}/${latestFile.filePath}`;
          
          this.safePdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(fullUrl);
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Lỗi tải file:', err);
        this.isLoading = false;
      }
    });
  }

  goBack(): void {
    if (this.isNewTab) {
      window.close();
    } else {
      this.router.navigate(['/library/document', this.docId]);
    }
  }

  toggleFullscreen(): void {
    const elem = document.documentElement;
    if (!document.fullscreenElement) {
      elem.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  }
}