import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import {
  Book,
  Author,
  Category,
  Review,
  BookmarkedBook,
  BookSearchFilters,
  BooksListResponse,
  BookResponse,
  DownloadStats,
  UserActivity
} from '../../models/book.model';

@Injectable({
  providedIn: 'root'
})
export class BookService {
  private books: Book[] = [];
  private authors: Author[] = [];
  private categories: Category[] = [];
  private bookmarks: Map<string, BookmarkedBook[]> = new Map();
  private downloadLogs: Array<{id: string; userId: string; bookId: string; downloadedAt: string}> = [];
  private userActivities: UserActivity[] = [];

  private booksSubject = new BehaviorSubject<Book[]>([]);
  public books$ = this.booksSubject.asObservable();

  constructor() {
    this.initializeMockData();
  }

  private initializeMockData(): void {
    this.authors = [
      {
        id: '1',
        name: 'Nguyễn Nhật Ánh',
        bio: 'Nhà văn Việt Nam nổi tiếng',
        image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=author1',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: '2',
        name: 'Dương Thu Hương',
        bio: 'Nhà văn, nhà thơ Việt Nam',
        image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=author2',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: '3',
        name: 'Stephen King',
        bio: 'American author of horror and suspense novels',
        image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=author3',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];

    this.categories = [
      { id: '1', name: 'Tiểu thuyết', description: 'Các tiểu thuyết hay', icon: '📖', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      { id: '2', name: 'Khoa học', description: 'Sách khoa học và công nghệ', icon: '🔬', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      { id: '3', name: 'Kỹ năng', description: 'Sách phát triển kỹ năng', icon: '💡', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      { id: '4', name: 'Lịch sử', description: 'Sách lịch sử', icon: '⏰', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
    ];

    this.books = [
      { id: '1', title: 'Chiếc thuyền ngoài xa', description: 'Một trong những tác phẩm hay nhất', author: this.authors[0], category: this.categories[0], cover: 'https://images.unsplash.com/photo-1507842217343-583f7270bfba?w=300', pages: 320, fileSize: 2400, publishDate: '2010-01-01', isbn: '978-604-67-0155-5', language: 'vi', rating: 4.8, reviewCount: 245, views: 5420, downloads: 1200, reviews: [], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      { id: '2', title: 'Khi đôi ta còn trẻ', description: 'Câu chuyện về tình yêu', author: this.authors[0], category: this.categories[0], cover: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=300', pages: 280, fileSize: 2100, publishDate: '2009-01-01', isbn: '978-604-67-0100-5', language: 'vi', rating: 4.6, reviewCount: 189, views: 4320, downloads: 980, reviews: [], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      { id: '3', title: 'Thương nhớ ở ai', description: 'Bộ truyện ngắn tuyển chọn', author: this.authors[1], category: this.categories[0], cover: 'https://images.unsplash.com/photo-1507842217343-583f7270bfba?w=300', pages: 256, fileSize: 1900, publishDate: '2008-06-01', isbn: '978-604-67-0050-3', language: 'vi', rating: 4.4, reviewCount: 156, views: 3890, downloads: 750, reviews: [], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      { id: '4', title: 'The Shining', description: 'Horror novel by Stephen King', author: this.authors[2], category: this.categories[0], cover: 'https://images.unsplash.com/photo-1495446815901-a7297e8b7d32?w=300', pages: 447, fileSize: 3200, publishDate: '1977-01-28', isbn: '0-385-12167-5', language: 'en', rating: 4.7, reviewCount: 512, views: 8900, downloads: 2100, reviews: [], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      { id: '5', title: 'Sapiens', description: 'History of humankind', author: { id: '4', name: 'Yuval Noah Harari', bio: 'Israeli historian', image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=author4', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }, category: this.categories[1], cover: 'https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?w=300', pages: 640, fileSize: 4500, publishDate: '2011-01-01', isbn: '978-0-06-231609-7', language: 'en', rating: 4.5, reviewCount: 798, views: 12340, downloads: 3200, reviews: [], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
    ];

    this.booksSubject.next(this.books);
  }

  getBooks(filters: BookSearchFilters = {}): Observable<BooksListResponse> {
    return of(null).pipe(
      delay(500),
      map(() => {
        let filtered = [...this.books];
        if (filters.keyword) {
          const keyword = filters.keyword.toLowerCase();
          filtered = filtered.filter((b) => b.title.toLowerCase().includes(keyword) || b.author.name.toLowerCase().includes(keyword));
        }
        if (filters.categoryId) {
          filtered = filtered.filter((b) => b.category.id === filters.categoryId);
        }
        const sortBy = filters.sortBy || 'newest';
        if (sortBy === 'popular') filtered.sort((a, b) => b.views - a.views);
        else if (sortBy === 'trending') filtered.sort((a, b) => b.downloads - a.downloads);
        else if (sortBy === 'rating') filtered.sort((a, b) => b.rating - a.rating);
        
        const page = filters.page || 1;
        const pageSize = filters.pageSize || 12;
        const total = filtered.length;
        const totalPages = Math.ceil(total / pageSize);
        const start = (page - 1) * pageSize;
        
        return {
          success: true,
          message: 'Books retrieved successfully',
          data: filtered.slice(start, start + pageSize),
          pagination: { page, pageSize, total, totalPages }
        };
      })
    );
  }

  getBook(id: string): Observable<BookResponse> {
    return of(null).pipe(
      delay(300),
      map(() => {
        const book = this.books.find((b) => b.id === id);
        if (!book) throw new Error('Book not found');
        book.views++;
        return { success: true, message: 'Book retrieved successfully', data: book };
      })
    );
  }

  searchBooks(keyword: string): Observable<BooksListResponse> {
    return this.getBooks({ keyword, pageSize: 20 });
  }

  getFeaturedBooks(): Observable<Book[]> {
    return of(this.books.slice(0, 6)).pipe(delay(300));
  }

  getPopularBooks(): Observable<Book[]> {
    const sorted = [...this.books].sort((a, b) => b.views - a.views).slice(0, 6);
    return of(sorted).pipe(delay(300));
  }

  getTrendingBooks(): Observable<Book[]> {
    const sorted = [...this.books].sort((a, b) => b.downloads - a.downloads).slice(0, 6);
    return of(sorted).pipe(delay(300));
  }

  getCategories(): Observable<Category[]> {
    return of(this.categories).pipe(delay(200));
  }

  getAuthors(): Observable<Author[]> {
    return of(this.authors).pipe(delay(200));
  }

  addToBookmarks(userId: string, book: Book): Observable<BookResponse> {
    return of(null).pipe(
      delay(300),
      map(() => {
        if (!this.bookmarks.has(userId)) this.bookmarks.set(userId, []);
        const bookmarked: BookmarkedBook = { id: `bookmark_${Date.now()}`, userId, bookId: book.id, book, createdAt: new Date().toISOString() };
        this.bookmarks.get(userId)!.push(bookmarked);
        return { success: true, message: 'Book added to bookmarks', data: book };
      })
    );
  }

  removeFromBookmarks(userId: string, bookId: string): Observable<{ success: boolean; message: string }> {
    return of(null).pipe(
      delay(300),
      map(() => {
        const bookmarks = this.bookmarks.get(userId) || [];
        const index = bookmarks.findIndex((b) => b.bookId === bookId);
        if (index > -1) bookmarks.splice(index, 1);
        return { success: true, message: 'Book removed from bookmarks' };
      })
    );
  }

  getUserBookmarks(userId: string): Observable<Book[]> {
    return of((this.bookmarks.get(userId) || []).map((b) => b.book)).pipe(delay(300));
  }

  isBookmarked(userId: string, bookId: string): boolean {
    const bookmarks = this.bookmarks.get(userId) || [];
    return bookmarks.some((b) => b.bookId === bookId);
  }

  downloadBook(userId: string, bookId: string, userRole: string): Observable<{ success: boolean; message: string; downloadUrl?: string }> {
    return of(null).pipe(
      delay(500),
      map(() => {
        const allowedRoles = ['admin', 'moderator', 'user', 'teacher'];
        if (!allowedRoles.includes(userRole)) throw new Error('No permission');
        const today = new Date().toISOString().split('T')[0];
        const todaysDownloads = this.downloadLogs.filter((log) => log.userId === userId && log.downloadedAt.split('T')[0] === today).length;
        const dailyLimit = userRole === 'admin' ? 100 : userRole === 'teacher' ? 20 : 5;
        if (todaysDownloads >= dailyLimit) throw new Error(`Daily limit exceeded`);
        const book = this.books.find((b) => b.id === bookId);
        if (book) {
          book.downloads++;
          this.downloadLogs.push({ id: `download_${Date.now()}`, userId, bookId, downloadedAt: new Date().toISOString() });
        }
        return { success: true, message: 'Downloaded', downloadUrl: `/api/books/download/${bookId}` };
      })
    );
  }

  addReview(userId: string, userName: string, bookId: string, rating: number, comment: string): Observable<BookResponse> {
    return of(null).pipe(
      delay(400),
      map(() => {
        const book = this.books.find((b) => b.id === bookId);
        if (!book) throw new Error('Book not found');
        const review: Review = { id: `review_${Date.now()}`, bookId, userId, userName, rating, comment, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
        book.reviews.push(review);
        book.reviewCount++;
        const avgRating = book.reviews.reduce((sum, r) => sum + r.rating, 0) / book.reviews.length;
        book.rating = Math.round(avgRating * 10) / 10;
        return { success: true, message: 'Review added', data: book };
      })
    );
  }

  getDownloadStats(userId: string): Observable<DownloadStats> {
    return of(null).pipe(
      delay(300),
      map(() => {
        const today = new Date().toISOString().split('T')[0];
        const todaysDownloads = this.downloadLogs.filter((log) => log.userId === userId && log.downloadedAt.split('T')[0] === today).length;
        const dailyLimit = 5;
        return { userId, date: today, downloadCount: todaysDownloads, downloadLimit: dailyLimit, remaining: dailyLimit - todaysDownloads };
      })
    );
  }

  private recordActivity(userId: string, action: 'view' | 'read' | 'download' | 'bookmark' | 'review', bookId: string): void {
    const activity: UserActivity = { id: `activity_${Date.now()}`, userId, action, bookId, timestamp: new Date().toISOString() };
    this.userActivities.push(activity);
  }
}
