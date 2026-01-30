import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { DocumentService } from '../../../../shared/services/document.service';
import { DocumentDetailDto } from '../../../../models/book.model';

@Component({
  selector: 'app-book-reader',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="reader-container">
      <!-- Thanh công cụ trên cùng -->
      <div class="reader-header">
        <div class="left-section">
          <!-- Sửa lại link quay về đúng trang chi tiết của tài liệu đó -->
          <button [routerLink]="['/library/document', docId]" class="btn-back">
            ← Quay lại chi tiết
          </button>
          <h1 class="doc-title">{{ document?.title || 'Đang tải tài liệu...' }}</h1>
        </div>
        
        <div class="reader-controls">
          <button (click)="toggleFullscreen()" class="btn-control">⛶ Toàn màn hình</button>
        </div>
      </div>

      <!-- Nội dung hiển thị tài liệu -->
      <div class="reader-content">
        <!-- 
           Trong thực tế, bạn có thể dùng:
           <embed [src]="pdfUrl" type="application/pdf" width="100%" height="100%" />
           Ở đây chúng ta tạo khung placeholder chuyên nghiệp
        -->
        <div class="viewer-wrapper">
          <div class="pdf-placeholder">
            <h2>Chế độ đọc PDF trực tuyến</h2>
            <p>Tài liệu ID: {{ docId }}</p>
            
            <!-- Ví dụ nhúng thử một file PDF nếu có link trực tiếp -->
            <iframe src="/assets/files/1706.00374v1.pdf" width="100%" height="600px"></iframe>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .reader-container {
      display: flex;
      flex-direction: column;
      height: 100vh;
      background: #1a1a1a;
      color: white;
    }

    .reader-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px 20px;
      background: #2d2d2d;
      box-shadow: 0 2px 10px rgba(0,0,0,0.5);
      z-index: 10;
    }

    .left-section {
      display: flex;
      align-items: center;
      gap: 20px;
    }

    .doc-title {
      margin: 0;
      font-size: 16px;
      font-weight: 500;
      color: #e0e0e0;
      border-left: 1px solid #555;
      padding-left: 20px;
    }

    .reader-controls {
      display: flex;
      gap: 10px;
    }

    .btn-back {
      padding: 8px 16px;
      background: transparent;
      color: #aaa;
      border: 1px solid #555;
      border-radius: 4px;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-back:hover {
      color: white;
      border-color: #999;
      background: #3d3d3d;
    }

    .btn-control {
      padding: 8px 16px;
      background: #4f46e5;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-weight: 600;
    }

    .btn-control:hover {
      background: #6366f1;
    }

    .reader-content {
      flex: 1;
      overflow: hidden;
      display: flex;
      justify-content: center;
      padding: 20px;
      background: #121212;
    }

    .viewer-wrapper {
      width: 100%;
      height: 100%;
      background: white;
      border-radius: 4px;
      box-shadow: 0 0 30px rgba(0,0,0,0.5);
      overflow-y: auto;
    }

    .pdf-placeholder {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100%;
      padding: 40px;
      color: #666;
      text-align: center;
    }

    .pdf-placeholder .icon {
      font-size: 80px;
      margin-bottom: 20px;
    }

    .hint {
      font-style: italic;
      margin-top: 20px;
      color: #999;
    }
  `]
})
export class BookReaderComponent implements OnInit {
  docId = '';
  document: DocumentDetailDto | null = null;

  constructor(
    private route: ActivatedRoute,
    private documentService: DocumentService
  ) {}

  ngOnInit(): void {
    // Lấy ID từ URL
    this.docId = this.route.snapshot.params['id'] || '';
    
    if (this.docId) {
      this.loadDocumentInfo();
    }
  }

  loadDocumentInfo(): void {
    this.documentService.getById(this.docId).subscribe({
      next: (res) => {
        this.document = res;
      },
      error: () => console.error('Không thể tải thông tin tài liệu cho trình đọc')
    });
  }

  toggleFullscreen(): void {
    const elem = document.documentElement;
    if (!document.fullscreenElement) {
      elem.requestFullscreen().catch(err => {
        alert(`Lỗi khi mở toàn màn hình: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  }
}