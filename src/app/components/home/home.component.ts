import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DocumentService } from '../../shared/services/document.service';
import { AuthService } from '../../shared/services/auth.service';
import { DocumentList2Dto, DocumentListDto, DocumentPopularDto } from '../../models/book.model';
import { forkJoin, of } from 'rxjs';
import { finalize, catchError, take } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  isAuthenticated = false;
  newDocs: DocumentListDto[] = [];
  trendingDocs: DocumentList2Dto[] = [];
  popularDocs: DocumentPopularDto[] = [];
  loading = false;

  constructor(
    private authService: AuthService,
    private documentService: DocumentService
  ) { }

  ngOnInit(): void {
    this.authService.authenticated$.pipe(take(1)).subscribe(auth => this.isAuthenticated = auth);
    this.loadHomeData();
  }

  loadHomeData(): void {
    this.loading = true;

    forkJoin({
      all: this.documentService.getAll().pipe(catchError(err => {
        console.error('Lỗi lấy All Docs:', err);
        return of([]); 
      })),
      trending: this.documentService.getTrending().pipe(catchError(err => {
        console.error('Lỗi lấy Trending:', err);
        return of([]);
      })),
      popular: this.documentService.getPopular().pipe(catchError(err => {
        console.error('Lỗi lấy Popular:', err);
        return of([]);
      }))
    }).pipe(
      finalize(() => {
        this.loading = false;
      })
    ).subscribe({
      next: (res) => {

        const allResult = res.all as any;

        if (allResult && allResult.data) {
          this.newDocs = allResult.data.slice(0, 5);
        } else {
          this.newDocs = [];
        }

        this.trendingDocs = Array.isArray(res.trending) ? res.trending.slice(0, 5) : [];
        this.popularDocs = Array.isArray(res.popular) ? res.popular.slice(0, 5) : [];
      }
    });
  }

  onImgError(event: any) {
    event.target.src = '/assets/images/default-book.png';
  }


}