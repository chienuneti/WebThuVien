import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { BookService } from '../../../../shared/services/book.service';
import { AuthService } from '../../../../shared/services/auth.service';
import { Book, Review } from '../../../../models/book.model';

@Component({
  selector: 'app-book-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="book-detail-container" *ngIf="book">
      <div class="book-header">
        <div class="book-cover-section">
          <img [src]="book.cover" [alt]="book.title" class="book-cover-image" />
          <button (click)="toggleBookmark()" class="btn-bookmark" [class.bookmarked]="isBookmarked">
            {{ isBookmarked ? '❤️ Đã lưu' : '🤍 Lưu lại' }}
          </button>
        </div>

        <div class="book-meta">
          <h1 class="book-title">{{ book.title }}</h1>
          <p class="book-author">Tác giả: <strong>{{ book.author.name }}</strong></p>
          <p class="book-category">Thể loại: <strong>{{ book.category.name }}</strong></p>
          
          <div class="book-info-grid">
            <div class="info-item">
              <span class="label">Ngôn ngữ:</span>
              <span class="value">{{ book.language === 'vi' ? 'Tiếng Việt' : 'English' }}</span>
            </div>
            <div class="info-item">
              <span class="label">Trang:</span>
              <span class="value">{{ book.pages }}</span>
            </div>
            <div class="info-item">
              <span class="label">Kích thước:</span>
              <span class="value">{{ (book.fileSize / 1024).toFixed(2) }} MB</span>
            </div>
            <div class="info-item">
              <span class="label">Xuất bản:</span>
              <span class="value">{{ book.publishDate | date: 'dd/MM/yyyy' }}</span>
            </div>
          </div>

          <div class="book-stats">
            <div class="stat-item">
              <strong>⭐ {{ book.rating }}/5</strong>
              <span>({{ book.reviewCount }} đánh giá)</span>
            </div>
            <div class="stat-item">
              <strong>👁️ {{ book.views }}</strong>
              <span>lần xem</span>
            </div>
            <div class="stat-item">
              <strong>📥 {{ book.downloads }}</strong>
              <span>lần tải</span>
            </div>
          </div>

          <div class="book-actions">
            <button class="btn-read" [routerLink]="['/library/read', book.id]">
              📖 Đọc sách
            </button>
            <button class="btn-download" (click)="downloadBook()">
              📥 Tải xuống
            </button>
          </div>
        </div>
      </div>

      <!-- Description -->
      <div class="book-section">
        <h2>Mô tả sách</h2>
        <p class="book-description">{{ book.description }}</p>
      </div>

      <!-- Reviews -->
      <div class="book-section">
        <h2>Đánh giá & Bình luận ({{ book.reviewCount }})</h2>

        <!-- Add review form -->
        <div *ngIf="isLoggedIn" class="review-form">
          <h3>Viết đánh giá của bạn</h3>
          <div class="form-group">
            <label>Đánh giá:</label>
            <div class="rating-input">
              <button
                *ngFor="let i of [1,2,3,4,5]"
                (click)="myRating = i"
                class="star"
                [class.active]="i <= myRating"
              >
                ⭐
              </button>
            </div>
          </div>
          <div class="form-group">
            <label>Bình luận:</label>
            <textarea
              [(ngModel)]="myComment"
              placeholder="Viết nhận xét của bạn..."
              rows="4"
              class="form-control"
            ></textarea>
          </div>
          <button (click)="submitReview()" class="btn-submit" [disabled]="!myComment.trim()">
            Gửi đánh giá
          </button>
        </div>

        <!-- Reviews list -->
        <div class="reviews-list">
          <div *ngFor="let review of book.reviews" class="review-item">
            <div class="review-header">
              <strong>{{ review.userName }}</strong>
              <span class="rating">⭐ {{ review.rating }}/5</span>
              <span class="date">{{ review.createdAt | date: 'dd/MM/yyyy HH:mm' }}</span>
            </div>
            <p class="review-comment">{{ review.comment }}</p>
          </div>
        </div>

        <div *ngIf="book.reviews.length === 0" class="no-reviews">
          Chưa có đánh giá nào. Hãy là người đầu tiên đánh giá sách này!
        </div>
      </div>
    </div>

    <div *ngIf="!book" class="loading">
      Đang tải sách...
    </div>
  `,
  styles: [`
    .book-detail-container {
      max-width: 1000px;
      margin: 0 auto;
      padding: 20px;
    }

    .book-header {
      display: grid;
      grid-template-columns: 300px 1fr;
      gap: 30px;
      margin-bottom: 40px;
      padding-bottom: 30px;
      border-bottom: 1px solid #eee;
    }

    .book-cover-section {
      position: relative;
    }

    .book-cover-image {
      width: 100%;
      height: auto;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }

    .btn-bookmark {
      width: 100%;
      margin-top: 15px;
      padding: 12px;
      background: white;
      border: 2px solid #ddd;
      border-radius: 6px;
      cursor: pointer;
      font-size: 16px;
      font-weight: 600;
      transition: all 0.3s;
    }

    .btn-bookmark:hover {
      border-color: #e74c3c;
      background: #fff5f5;
    }

    .btn-bookmark.bookmarked {
      background: #ffe6e6;
      border-color: #e74c3c;
      color: #e74c3c;
    }

    .book-meta {
      padding: 0;
    }

    .book-title {
      margin: 0 0 15px 0;
      font-size: 32px;
      font-weight: 700;
      color: #333;
    }

    .book-author, .book-category {
      margin: 8px 0;
      font-size: 16px;
      color: #666;
    }

    .book-info-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 15px;
      margin: 20px 0;
      padding: 20px;
      background: #f9f9f9;
      border-radius: 8px;
    }

    .info-item {
      display: flex;
      flex-direction: column;
      gap: 5px;
    }

    .info-item .label {
      font-size: 12px;
      color: #999;
      font-weight: 600;
      text-transform: uppercase;
    }

    .info-item .value {
      font-size: 16px;
      color: #333;
      font-weight: 500;
    }

    .book-stats {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 15px;
      margin: 20px 0;
    }

    .stat-item {
      text-align: center;
      padding: 15px;
      background: #f0f0f0;
      border-radius: 6px;
    }

    .stat-item strong {
      display: block;
      font-size: 20px;
      margin-bottom: 5px;
    }

    .stat-item span {
      font-size: 12px;
      color: #666;
    }

    .book-actions {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 15px;
      margin-top: 20px;
    }

    .btn-read, .btn-download {
      padding: 15px;
      border: none;
      border-radius: 6px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s;
    }

    .btn-read {
      background: #007bff;
      color: white;
    }

    .btn-read:hover {
      background: #0056b3;
    }

    .btn-download {
      background: #28a745;
      color: white;
    }

    .btn-download:hover {
      background: #1e7e34;
    }

    .book-section {
      margin-bottom: 40px;
      padding-bottom: 30px;
      border-bottom: 1px solid #eee;
    }

    .book-section h2 {
      margin: 0 0 20px 0;
      font-size: 24px;
      color: #333;
    }

    .book-description {
      line-height: 1.8;
      color: #666;
      font-size: 16px;
    }

    .review-form {
      background: #f9f9f9;
      padding: 20px;
      border-radius: 8px;
      margin-bottom: 30px;
    }

    .review-form h3 {
      margin-top: 0;
      color: #333;
    }

    .form-group {
      margin-bottom: 15px;
    }

    .form-group label {
      display: block;
      margin-bottom: 8px;
      font-weight: 600;
      color: #333;
    }

    .rating-input {
      display: flex;
      gap: 10px;
    }

    .star {
      font-size: 28px;
      background: none;
      border: none;
      cursor: pointer;
      opacity: 0.3;
      transition: opacity 0.2s;
    }

    .star.active,
    .star:hover {
      opacity: 1;
    }

    .form-control {
      width: 100%;
      padding: 10px;
      border: 1px solid #ddd;
      border-radius: 6px;
      font-family: inherit;
      font-size: 14px;
      resize: vertical;
    }

    .btn-submit {
      padding: 10px 20px;
      background: #007bff;
      color: white;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-weight: 600;
    }

    .btn-submit:hover:not(:disabled) {
      background: #0056b3;
    }

    .btn-submit:disabled {
      background: #ccc;
      cursor: not-allowed;
    }

    .reviews-list {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .review-item {
      padding: 15px;
      border: 1px solid #eee;
      border-radius: 6px;
      background: white;
    }

    .review-header {
      display: flex;
      gap: 15px;
      align-items: center;
      margin-bottom: 10px;
      font-size: 14px;
    }

    .review-header strong {
      color: #333;
    }

    .review-header .rating {
      color: #f39c12;
      font-weight: 600;
    }

    .review-header .date {
      color: #999;
      margin-left: auto;
    }

    .review-comment {
      margin: 0;
      color: #666;
      line-height: 1.6;
    }

    .no-reviews {
      text-align: center;
      padding: 30px;
      color: #999;
      background: #f9f9f9;
      border-radius: 6px;
    }

    .loading {
      text-align: center;
      padding: 50px;
      color: #666;
    }

    @media (max-width: 768px) {
      .book-header {
        grid-template-columns: 1fr;
      }

      .book-title {
        font-size: 24px;
      }

      .book-info-grid {
        grid-template-columns: 1fr;
      }

      .book-stats {
        grid-template-columns: 1fr;
      }

      .book-actions {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class BookDetailComponent implements OnInit {
  book: Book | null = null;
  isLoggedIn = false;
  isBookmarked = false;
  myRating = 0;
  myComment = '';

  constructor(
    private route: ActivatedRoute,
    private bookService: BookService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.isLoggedIn = this.authService.isAuthenticated();
    this.route.params.subscribe((params) => {
      this.loadBook(params['id']);
    });
  }

  loadBook(id: string): void {
    this.bookService.getBook(id).subscribe({
      next: (response) => {
        this.book = response.data || null;
        if (this.isLoggedIn && this.book) {
          const user = this.authService.getCurrentUser();
          if (user) {
            this.isBookmarked = this.bookService.isBookmarked(user.id, this.book.id);
          }
        }
      },
      error: (error) => {
        console.error('Error loading book:', error);
      }
    });
  }

  toggleBookmark(): void {
    if (!this.isLoggedIn) {
      alert('Vui lòng đăng nhập để lưu sách');
      return;
    }

    const user = this.authService.getCurrentUser();
    if (!user || !this.book) return;

    if (this.isBookmarked) {
      this.bookService.removeFromBookmarks(user.id, this.book.id).subscribe(() => {
        this.isBookmarked = false;
      });
    } else {
      this.bookService.addToBookmarks(user.id, this.book).subscribe(() => {
        this.isBookmarked = true;
      });
    }
  }

  downloadBook(): void {
    if (!this.isLoggedIn) {
      alert('Vui lòng đăng nhập để tải sách');
      return;
    }

    const user = this.authService.getCurrentUser();
    if (!user || !this.book) return;

    const userRole = user.role || 'user';
    this.bookService.downloadBook(user.id, this.book.id, userRole).subscribe({
      next: (response) => {
        alert(response.message);
        if (this.book) {
          this.book.downloads++;
        }
      },
      error: (error) => {
        alert(error.message || 'Không thể tải sách');
      }
    });
  }

  submitReview(): void {
    if (!this.isLoggedIn) {
      alert('Vui lòng đăng nhập để đánh giá');
      return;
    }

    if (!this.book || this.myRating === 0) {
      alert('Vui lòng chọn đánh giá sao');
      return;
    }

    const user = this.authService.getCurrentUser();
    if (!user) return;

    this.bookService.addReview(user.id, user.fullName, this.book.id, this.myRating, this.myComment).subscribe({
      next: (response) => {
        alert('Cảm ơn bạn đã đánh giá!');
        this.myRating = 0;
        this.myComment = '';
        this.book = response.data || null;
      },
      error: (error) => {
        alert('Lỗi khi gửi đánh giá');
      }
    });
  }
}
