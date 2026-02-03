import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { DocumentService } from '../../../../shared/services/document.service';
import { AuthService } from '../../../../shared/services/auth.service';
import { DocumentDetailDto, DocFile, Review } from '../../../../models/book.model';

@Component({
  selector: 'app-document-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './document-detail.component.html',
  styleUrl: './document-detail.component.css'
})
export class DocumentDetailComponent implements OnInit {
  document: DocumentDetailDto | null = null;
  files: DocFile[] = [];
  loading = true;
  error: string | null = null;
  isLoggedIn = false;
  reviews: Review[] = [];
  userRating = 5;
  userComment = '';
  isSubmitting = false;
  isDownloading = false;

  constructor(
    private route: ActivatedRoute,
    private documentService: DocumentService,
    private authService: AuthService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.isLoggedIn = this.authService.isAuthenticated();
    this.route.params.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.loadDocument(id);
        this.loadFiles(id);
        this.loadReviews(id);
      }
    });
  }

  loadReviews(id: string): void {
    this.documentService.getReviews(id).subscribe({
      next: (res) => { this.reviews = res; },
      error: (err) => { console.error('Lỗi khi tải bình luận:', err); }
    });
  }

  submitReview(): void {
    if (!this.userComment.trim()) return;
    this.isSubmitting = true;
    
    this.documentService.addReview(this.document!.id, this.userRating, this.userComment).subscribe({
      next: () => {
        this.userComment = '';
        this.loadReviews(this.document!.id); 
        this.isSubmitting = false;
        alert('Cảm ơn bạn đã đánh giá!');
      },
      error: () => {
        alert('Lỗi khi gửi bình luận');
        this.isSubmitting = false;
      }
    });
  }

  onImgError(event: any) {
    event.target.src = '/assets/images/default-book.png';
  }

  loadDocument(id: string): void {
    this.loading = true;
    this.documentService.getById(id).subscribe({
      next: (res) => {
        this.document = res;
        this.loading = false;
      },
      error: () => {
        this.error = 'Không tìm thấy tài liệu hoặc lỗi kết nối';
        this.loading = false;
      }
    });
  }

  loadFiles(docId: string): void {
    this.documentService.getFiles(docId).subscribe({
      next: (res) => this.files = res,
      error: () => this.files = []
    });
  }

  backToList() {
    this.router.navigate(['/library/assign-approve']);
  }

  downloadDocument(): void {
    if (!this.document?.id || this.isDownloading) {
      return;
    }

    // Kiểm tra đăng nhập trước khi gọi API (đỡ tốn request nếu chưa login)
    if (!this.isLoggedIn) {
      alert('Vui lòng đăng nhập để tải tài liệu.');
      this.router.navigate(['/login']);
      return;
    }

    this.isDownloading = true;

    this.documentService.logDownload(this.document.id).subscribe({
      next: () => {
        // Ghi log thành công, tiếp tục tải file
      },
      error: (err) => {
        console.error('Lỗi ghi log tải xuống:', err);
      }
    });
    this.documentService.downloadDocument(this.document.id).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        
        const sanitizedTitle = this.document?.title.replace(/[^a-z0-9]/gi, '_') || 'document';
        const version = this.files[0]?.version || '1';
        const fileName = `${sanitizedTitle}_v${version}.pdf`;
        
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        
        this.isDownloading = false;
      },
      error: (err) => {
        console.error('Download error:', err);
        if (err.status === 401) {
            alert('Phiên đăng nhập hết hạn hoặc bạn không có quyền tải file này.');
        } else {
            alert('Lỗi tải xuống. Vui lòng thử lại sau.');
        }
        this.isDownloading = false;
      }
    });
  }
}
