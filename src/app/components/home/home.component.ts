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
      // Dùng pipe(catchError) cho từng request để nếu 1 cái lỗi, trang web vẫn hiện các phần còn lại
      all: this.documentService.getAll().pipe(catchError(err => {
        console.error('Lỗi lấy All Docs:', err);
        return of([]); // Trả về mảng rỗng nếu lỗi
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
      // finalize đảm bảo loading luôn tắt dù có lỗi code hay lỗi mạng
      finalize(() => {
        this.loading = false;
      })
    ).subscribe({
      next: (res) => {

        // Xử lý an toàn: Nếu res.all là null/undefined thì dùng mảng rỗng []
        // Tránh lỗi "is not iterable"
        const allResult = res.all as any;

        // 2. Kiểm tra và gán dữ liệu
        if (allResult && allResult.data) {
          this.newDocs = allResult.data.slice(0, 5);
        } else {
          this.newDocs = [];
        }

        this.trendingDocs = Array.isArray(res.trending) ? res.trending.slice(0, 5) : [];
        this.popularDocs = Array.isArray(res.popular) ? res.popular.slice(0, 5) : [];
      },
      error: (err) => {
        console.error('Lỗi nghiêm trọng trong forkJoin:', err);
        // finalize sẽ lo việc tắt loading, không cần set false ở đây nữa
      }
    });
  }

  onImgError(event: any) {
    event.target.src = '/assets/images/default-book.png';
  }


}