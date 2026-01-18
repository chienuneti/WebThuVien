import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';

@Component({
  selector: 'app-book-reader',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="reader-container">
      <div class="reader-header">
        <button [routerLink]="['/library/book', bookId]" class="btn-back">← Quay lại</button>
        <h1>Đang đọc sách</h1>
        <div class="reader-controls">
          <button (click)="toggleFullscreen()" class="btn-control">⛶ Fullscreen</button>
        </div>
      </div>

      <div class="reader-content">
        <div class="pdf-viewer">
          <p>🔖 Trình đọc PDF sẽ được tích hợp tại đây</p>
          <p>Sử dụng thư viện như: PDF.js, ngx-extended-pdf-viewer, hoặc pdfjs-dist</p>
          <p>BookId: {{ bookId }}</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .reader-container {
      display: flex;
      flex-direction: column;
      height: 100vh;
      background: #000;
    }

    .reader-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 15px 20px;
      background: #333;
      color: white;
    }

    .reader-header h1 {
      margin: 0;
      font-size: 20px;
    }

    .reader-controls {
      display: flex;
      gap: 10px;
    }

    .btn-back, .btn-control {
      padding: 8px 16px;
      background: #555;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
    }

    .btn-back:hover, .btn-control:hover {
      background: #777;
    }

    .reader-content {
      flex: 1;
      overflow: auto;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .pdf-viewer {
      background: white;
      padding: 20px;
      border-radius: 8px;
      text-align: center;
      color: #666;
    }
  `]
})
export class BookReaderComponent {
  bookId = '';

  constructor(private route: ActivatedRoute) {
    this.bookId = this.route.snapshot.params['id'] || '';
  }

  toggleFullscreen(): void {
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen();
    }
  }
}
