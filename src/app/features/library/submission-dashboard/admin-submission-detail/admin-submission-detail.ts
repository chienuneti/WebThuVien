import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../../../environments/environment';
import { DocumentService } from '../../../../shared/services/document.service';

@Component({
  selector: 'app-admin-submission-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: 'admin-submission-detail.html',
  styleUrl: 'admin-submission-detail.css'
})
export class AdminSubmissionDetailComponent implements OnInit {
  submissionId!: string;
  submission: any = null;
  histories: any[] = [];
  lecturers: any[] = [];
  selectedReviewerId: string = '';
  isLoading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private docService: DocumentService,
    private location: Location
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.submissionId = id;
      this.loadData();
    }
  }

  goBack() {
    // Nếu có lịch sử trang trước đó (trong cùng site) thì back, không thì về Home
    if (window.history.length > 1) {
      this.location.back();
    } else {
      this.router.navigate(['/']); 
    }
  }

  loadData() {
    this.isLoading = true;
    
    this.http.get<any[]>(`${environment.apiUrl}/Submission/${this.submissionId}/history`)
      .subscribe(res => this.histories = res ?? []);

    this.http.get<any>(`${environment.apiUrl}/Submission/info/${this.submissionId}`)
      .subscribe(res => this.submission = res);

    this.docService.getLecturers().subscribe({
      next: (res) => {
        this.lecturers = res;
        this.isLoading = false;
      },
      error: () => this.isLoading = false
    });
  }

  onAssign() {
  if (!this.selectedReviewerId) {
    alert("Vui lòng chọn một giảng viên!");
    return;
  }

  this.docService.assignReviewer(this.submissionId, this.selectedReviewerId).subscribe({
    next: (res) => {
      alert("Phân công thành công!");
      this.loadData();
    },
    error: (err) => {
      const errorMessage = err.error?.message || "Có lỗi xảy ra khi phân công.";
      alert("Thông báo từ hệ thống: " + errorMessage);
      console.error("Chi tiết lỗi:", err);
    }
  });
}


onApprove() {
  if (confirm("Xác nhận phê duyệt tài liệu này?")) {
    this.docService.approveSubmission(this.submissionId).subscribe({
      next: (res) => {
        alert("Thành công: " + res.message);
        this.router.navigate(['/library/assign-approve']);
      },
      error: (err) => {
        const msg = err.error?.message || "Lỗi khi phê duyệt";
        alert("Thông báo: " + msg);
      }
    });
  }
}
get reviewStatusText(): string {
  const assigned = this.histories.filter(h => h.action === 'AssignReviewer').length;
  const reviewed = this.histories.filter(h => h.action === 'Review').length;
  return `${reviewed} / ${assigned} Reviewer đã hoàn thành`;
}

get canApprove(): boolean {
    if (!this.submission) return false;
    return this.submission.status !== 'Accept' && this.submission.status !== 'Reject';
}

  backToList() {
    this.router.navigate(['/library/assign-approve']);
  }
}