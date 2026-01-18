import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BookService } from '../../../../shared/services/book.service';
import { AuthService } from '../../../../shared/services/auth.service';
import { Book } from '../../../../models/book.model';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="favorites-container">
      <h1>📚 Sách yêu thích của tôi</h1>
      
      <div *ngIf="books.length > 0; else noFavorites" class="books-grid">
        <div *ngFor="let book of books" class="book-card" [routerLink]="['/library/book', book.id]">
          <div class="book-cover">
            <img [src]="book.cover" [alt]="book.title" />
          </div>
          <div class="book-info">
            <h3 class="book-title">{{ book.title }}</h3>
            <p class="book-author">{{ book.author.name }}</p>
            <p class="book-category">{{ book.category.name }}</p>
            <div class="book-stats">
              <span>⭐ {{ book.rating }}/5</span>
              <span>👁️ {{ book.views }}</span>
            </div>
          </div>
        </div>
      </div>

      <ng-template #noFavorites>
        <div class="empty-state">
          <p>Bạn chưa lưu sách nào</p>
          <button [routerLink]="['/library']" class="btn-browse">
            Khám phá thư viện
          </button>
        </div>
      </ng-template>
    </div>
  `,
  styles: [`
    .favorites-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
    }

    h1 {
      margin-bottom: 30px;
      color: #333;
    }

    .books-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 20px;
    }

    .book-card {
      background: white;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      cursor: pointer;
      transition: transform 0.3s;
      text-decoration: none;
      color: inherit;
    }

    .book-card:hover {
      transform: translateY(-5px);
    }

    .book-cover {
      width: 100%;
      height: 250px;
      overflow: hidden;
      background: #f0f0f0;
    }

    .book-cover img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .book-info {
      padding: 15px;
    }

    .book-title {
      margin: 0 0 8px 0;
      font-size: 16px;
      font-weight: 600;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .book-author {
      margin: 0 0 4px 0;
      font-size: 13px;
      color: #666;
    }

    .book-category {
      margin: 0 0 8px 0;
      font-size: 12px;
      color: #999;
    }

    .book-stats {
      display: flex;
      gap: 10px;
      font-size: 12px;
      color: #666;
    }

    .empty-state {
      text-align: center;
      padding: 60px 20px;
      color: #999;
    }

    .empty-state p {
      font-size: 18px;
      margin-bottom: 20px;
    }

    .btn-browse {
      padding: 10px 20px;
      background: #007bff;
      color: white;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-weight: 600;
    }

    .btn-browse:hover {
      background: #0056b3;
    }

    @media (max-width: 768px) {
      .books-grid {
        grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
      }
    }
  `]
})
export class FavoritesComponent implements OnInit {
  books: Book[] = [];

  constructor(
    private bookService: BookService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.bookService.getUserBookmarks(user.id).subscribe((bookmarks) => {
        this.books = bookmarks;
      });
    }
  }
}
