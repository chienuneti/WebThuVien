import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { SubmissionListDto } from '../../../../models/book.model';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-assign-approve',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: 'review-dashboard.component.html',
  styleUrls: ['./review-dashboard.component.css']
})
export class ReviewDashboardComponent implements OnInit {
  submissions: SubmissionListDto[] = [];
  isLoading = true;
  reviewerId = "6"; 

  constructor(
    private router: Router,
    private http: HttpClient,
  ) { }

  ngOnInit(): void {
    this.loadMySubmissions();
  }

  totalDocuments: number = 0;
  pendingReviewCount: number = 0;
  approvedCount: number = 0;

  loadMySubmissions() {
  this.isLoading = true;
  
  this.http.get<SubmissionListDto[]>(`${environment.apiUrl}/Submission/my-assignments`).subscribe({
    next: (res) => {
      this.submissions = res; 
      
      this.totalDocuments = this.submissions.length;
      
      this.approvedCount = this.submissions.filter(s => 
        s.status === 'Accept'
      ).length;

      this.pendingReviewCount = this.totalDocuments - this.approvedCount;
      this.isLoading = false;
    },
    error: (err) => {
      console.error("Lỗi lấy danh sách bài review:", err);
      this.isLoading = false;
    }
  });
}

  viewDetail(id: string) {
    this.router.navigate(['/library/review-workflow', id]);
  }

  getStatusClass(status: string) {
  switch (status) {
    case 'Accept': return 'approved';   
    case 'Reject': return 'rejected';  
    case 'Review': return 'pending';    
    case 'Submitt': return 'pending';
    default: return 'pending';
  }
}

  
}