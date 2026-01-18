import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { BookService } from '../../../../shared/services/book.service';
import { Book, Category, BookSearchFilters } from '../../../../models/book.model';

@Component({
  selector: 'app-library-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="library-container">
      <!-- Search & Filters -->
      <div class="search-section">
        <div class="search-box">
          <input
            type="text"
            placeholder="Tìm kiếm sách theo tên, tác giả..."
            [(ngModel)]="searchKeyword"
            (input)="onSearch()"
            class="search-input"
          />
          <button class="btn-search" (click)="onSearch()">🔍 Tìm kiếm</button>
        </div>

        <!-- Filters -->
        <div class="filters">
          <select [(ngModel)]="selectedCategory" (change)="onFilterChange()" class="filter-select">
            <option value="">Tất cả thể loại</option>
            <option *ngFor="let cat of categories" [value]="cat.id">
              {{ cat.icon }} {{ cat.name }}
            </option>
          </select>

          <select [(ngModel)]="sortBy" (change)="onFilterChange()" class="filter-select">
            <option value="newest">Mới nhất</option>
            <option value="popular">Phổ biến nhất</option>
            <option value="trending">Đang trending</option>
            <option value="rating">Đánh giá cao</option>
          </select>

          <select [(ngModel)]="selectedLanguage" (change)="onFilterChange()" class="filter-select">
            <option value="">Tất cả ngôn ngữ</option>
            <option value="vi">Tiếng Việt</option>
            <option value="en">English</option>
          </select>
        </div>
      </div>

      <!-- Books Grid -->
      <div class="books-grid">
        <div *ngFor="let book of books" class="book-card" [routerLink]="['/library/book', book.id]">
          <div class="book-cover">
            <img [src]="book.cover" [alt]="book.title" />
            <div class="book-overlay">
              <button class="btn-view">Xem chi tiết</button>
            </div>
          </div>
          <div class="book-info">
            <h3 class="book-title">{{ book.title }}</h3>
            <p class="book-author">{{ book.author.name }}</p>
            <p class="book-category">{{ book.category.name }}</p>
            <div class="book-stats">
              <span class="rating">
                ⭐ {{ book.rating }}/5 ({{ book.reviewCount }})
              </span>
              <span class="views">👁️ {{ book.views }}</span>
              <span class="downloads">📥 {{ book.downloads }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div *ngIf="totalPages > 1" class="pagination">
        <button
          [disabled]="currentPage === 1"
          (click)="previousPage()"
          class="btn-page"
        >
          ← Trang trước
        </button>
        <span class="page-info">
          Trang {{ currentPage }} / {{ totalPages }}
        </span>
        <button
          [disabled]="currentPage === totalPages"
          (click)="nextPage()"
          class="btn-page"
        >
          Trang sau →
        </button>
      </div>
    </div>
  `,
  styles: [`
    .library-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
    }

    .search-section {
      margin-bottom: 30px;
    }

    .search-box {
      display: flex;
      gap: 10px;
      margin-bottom: 20px;
    }

    .search-input {
      flex: 1;
      padding: 12px 16px;
      font-size: 14px;
      border: 2px solid #ddd;
      border-radius: 8px;
      transition: border-color 0.3s;
    }

    .search-input:focus {
      outline: none;
      border-color: #007bff;
    }

    .btn-search {
      padding: 12px 24px;
      background: #007bff;
      color: white;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 600;
      transition: background 0.3s;
    }

    .btn-search:hover {
      background: #0056b3;
    }

    .filters {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
    }

    .filter-select {
      padding: 10px 12px;
      border: 1px solid #ddd;
      border-radius: 6px;
      background: white;
      cursor: pointer;
      font-size: 14px;
    }

    .books-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 20px;
      margin-bottom: 30px;
    }

    .book-card {
      background: white;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      cursor: pointer;
      transition: transform 0.3s, box-shadow 0.3s;
      text-decoration: none;
      color: inherit;
    }

    .book-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }

    .book-cover {
      position: relative;
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

    .book-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0,0,0,0.7);
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      transition: opacity 0.3s;
    }

    .book-card:hover .book-overlay {
      opacity: 1;
    }

    .btn-view {
      padding: 10px 20px;
      background: #007bff;
      color: white;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-weight: 600;
    }

    .btn-view:hover {
      background: #0056b3;
    }

    .book-info {
      padding: 15px;
    }

    .book-title {
      margin: 0 0 8px 0;
      font-size: 16px;
      font-weight: 600;
      color: #333;
      line-height: 1.3;
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
      flex-direction: column;
      gap: 4px;
      font-size: 12px;
      color: #666;
    }

    .pagination {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 20px;
      margin-top: 30px;
    }

    .btn-page {
      padding: 10px 20px;
      background: #007bff;
      color: white;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-weight: 600;
    }

    .btn-page:hover:not(:disabled) {
      background: #0056b3;
    }

    .btn-page:disabled {
      background: #ccc;
      cursor: not-allowed;
    }

    .page-info {
      font-weight: 600;
      color: #333;
    }

    @media (max-width: 768px) {
      .search-box {
        flex-direction: column;
      }

      .filters {
        flex-direction: column;
      }

      .books-grid {
        grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
        gap: 15px;
      }
    }
  `]
})
export class LibraryListComponent implements OnInit {
  books: Book[] = [];
  categories: Category[] = [];
  searchKeyword = '';
  selectedCategory = '';
  sortBy: 'newest' | 'popular' | 'trending' | 'rating' = 'newest';
  selectedLanguage = '';
  currentPage = 1;
  pageSize = 12;
  totalPages = 1;

  constructor(private bookService: BookService) {}

  ngOnInit(): void {
    this.loadCategories();
    this.loadBooks();
  }

  loadCategories(): void {
    this.bookService.getCategories().subscribe((cats) => {
      this.categories = cats;
    });
  }

  loadBooks(): void {
    const filters: BookSearchFilters = {
      keyword: this.searchKeyword || undefined,
      categoryId: this.selectedCategory || undefined,
      language: this.selectedLanguage || undefined,
      sortBy: this.sortBy,
      page: this.currentPage,
      pageSize: this.pageSize
    };

    this.bookService.getBooks(filters).subscribe((response) => {
      this.books = response.data;
      if (response.pagination) {
        this.totalPages = response.pagination.totalPages;
      }
    });
  }

  onSearch(): void {
    this.currentPage = 1;
    this.loadBooks();
  }

  onFilterChange(): void {
    this.currentPage = 1;
    this.loadBooks();
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadBooks();
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadBooks();
    }
  }
}
