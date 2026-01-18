/**
 * Book Models & Interfaces
 * For digital library system
 */

export interface Author {
  id: string;
  name: string;
  bio: string;
  image?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  icon?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id: string;
  bookId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number; // 1-5
  comment: string;
  createdAt: string;
  updatedAt: string;
}

export interface Book {
  id: string;
  title: string;
  description: string;
  author: Author;
  category: Category;
  cover: string; // URL to cover image
  pdfUrl?: string; // URL to PDF file
  fileSize: number; // in KB
  pages: number;
  publishDate: string;
  isbn?: string;
  language: string; // 'vi', 'en', etc.
  rating: number; // average rating 1-5
  reviewCount: number;
  views: number; // page views
  downloads: number; // download count
  reviews: Review[];
  createdAt: string;
  updatedAt: string;
}

export interface BookmarkedBook {
  id: string;
  userId: string;
  bookId: string;
  book: Book;
  createdAt: string;
}

export interface ReadBook {
  id: string;
  userId: string;
  bookId: string;
  book: Book;
  readCount: number; // number of times read
  lastReadAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserStats {
  userId: string;
  favoriteCount: number;
  readCount: number;
  ratedCount: number;
  downloadCount: number;
  totalReadTime: number; // in minutes
  lastActivityAt: string;
}

export interface BookDownloadLog {
  id: string;
  userId: string;
  bookId: string;
  downloadedAt: string;
}

export interface UserActivity {
  id: string;
  userId: string;
  action: 'view' | 'read' | 'download' | 'bookmark' | 'review'; // action type
  bookId: string;
  details?: any;
  timestamp: string;
}

// Request/Response types
export interface CreateBookRequest {
  title: string;
  description: string;
  authorId: string;
  categoryId: string;
  cover: string;
  pdfUrl?: string;
  fileSize: number;
  pages: number;
  publishDate: string;
  isbn?: string;
  language: string;
}

export interface UpdateBookRequest extends Partial<CreateBookRequest> {
  id: string;
}

export interface BookResponse {
  success: boolean;
  message: string;
  data?: Book;
  error?: string;
}

export interface BooksListResponse {
  success: boolean;
  message: string;
  data: Book[];
  pagination?: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
  error?: string;
}

export interface BookSearchFilters {
  keyword?: string;
  categoryId?: string;
  authorId?: string;
  language?: string;
  minRating?: number;
  sortBy?: 'newest' | 'popular' | 'trending' | 'rating' | 'title';
  page?: number;
  pageSize?: number;
}

export interface DownloadStats {
  userId: string;
  date: string;
  downloadCount: number;
  downloadLimit: number;
  remaining: number;
}
