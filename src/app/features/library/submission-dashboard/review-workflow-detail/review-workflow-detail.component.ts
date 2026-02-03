import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-review-workflow-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: 'review-workflow-detail.component.html',
  styleUrls: ['./review-workflow-detail.component.css'] 
})
export class ReviewWorkflowDetailComponent implements OnInit {
  submissionId!: string;
  histories: any[] = [];
  isLoading = true;
  reviewerId = "10";

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private location: Location
    ) {}
    goBack() {
    // Nếu có lịch sử trang trước đó (trong cùng site) thì back, không thì về Home
    if (window.history.length > 1) {
      this.location.back();
    } else {
      this.router.navigate(['/']); 
    }
  }

  ngOnInit(): void {
    this.submissionId = this.route.snapshot.params['id'];
    this.loadHistory();
  }

  loadHistory() {
    this.http.get<any[]>(`${environment.apiUrl}/Submission/${this.submissionId}/history`)
      .subscribe(res => {
        this.histories = res;
        this.isLoading = false;
      });
  }


goToReviewForm() {
  const params = new HttpParams()
    .set('submissionId', this.submissionId)
    .set('reviewerId', this.reviewerId);

  this.http.post(`${environment.apiUrl}/Submission/prereview`, null, { params }).subscribe({
    next: () => {
      this.router.navigate(['/library/review-form', this.submissionId]);
    },
    error: (err) => {
      const errorMsg = err.error?.message || "Lỗi hệ thống";
      alert("Cảnh báo: " + errorMsg);
    }
  });
}
}