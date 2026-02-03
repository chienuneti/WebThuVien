import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { SubmissionListDto } from '../../../models/book.model';

@Component({
  selector: 'app-submission-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './submission-dashboard.component.html',
  styleUrls: ['./submission-dashboard.component.css'] // Sử dụng style đồng nhất
})
export class SubmissionDashboardComponent implements OnInit {
  submissions: SubmissionListDto[] = [];
  isLoading = true;

  constructor(private router: Router, private http: HttpClient, private location: Location) { }

  ngOnInit(): void {
    this.loadMySubmissions();
  }



  totalDocuments: number = 0;
  pendingReviewCount: number = 0;
  approvedCount: number = 0;

  loadMySubmissions() {
    this.isLoading = true;
    this.http.get<any>(`${environment.apiUrl}/Submission/getsubmissionbyuser`).subscribe({
      next: (res) => {
        this.submissions = res.data || res;

        this.totalDocuments = this.submissions.length;

        this.approvedCount = this.submissions.filter(s =>
          s.status?.toLowerCase() === 'approved' || s.status?.toLowerCase() === 'approve'
        ).length;

        this.pendingReviewCount = this.totalDocuments - this.approvedCount;

        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  goToSubmit() {
    this.router.navigate(['/library/submit']);
  }

  viewDetail(id: string) {
    this.router.navigate(['/library/submission-detail', id]);
  }

  getStatusClass(status: string) {
    if (status === 'Approved') return 'status-approved';
    if (status === 'Rejected') return 'status-rejected';
    if (status === 'Needs Revision') return 'status-revision';
    return 'status-pending';
  }

  goBack() {
        if (window.history.length > 1) {
            this.location.back();
        } else {
            this.router.navigate(['/library']);
        }
    }
}