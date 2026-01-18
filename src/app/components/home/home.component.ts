import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';
import { BookService } from '../../shared/services/book.service';
import { Book } from '../../models/book.model';
import { User } from '../../models/auth.model';

@Component({
  selector: 'app-home',
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  standalone: true,
})
export class HomeComponent implements OnInit {
  user: User | null = null;
  isAuthenticated = false;
  featuredBooks: Book[] = [];
  popularBooks: Book[] = [];
  trendingBooks: Book[] = [];

  constructor(
    private authService: AuthService,
    private bookService: BookService
  ) {}

  ngOnInit(): void {
    this.authService.user$.subscribe((user) => {
      this.user = user;
    });
    this.authService.authenticated$.subscribe((auth) => {
      this.isAuthenticated = auth;
    });
    this.loadBooks();
  }

  loadBooks(): void {
    this.bookService.getFeaturedBooks().subscribe((books) => {
      this.featuredBooks = books;
    });

    this.bookService.getPopularBooks().subscribe((books) => {
      this.popularBooks = books;
    });

    this.bookService.getTrendingBooks().subscribe((books) => {
      this.trendingBooks = books;
    });
  }
}
