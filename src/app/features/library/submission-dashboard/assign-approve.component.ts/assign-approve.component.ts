import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { SubmissionListDto } from '../../../../models/book.model';
import { environment } from '../../../../../environments/environment';
import { DocumentService } from '../../../../shared/services/document.service';

@Component({
  selector: 'app-assign-approve',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './assign-approve.component.html',
  styleUrls: ['./assign-approve.component.css']
})
export class AssignApproveComponent implements OnInit {
  submissions: SubmissionListDto[] = [];
  isLoading = true;

  constructor(
    private router: Router,
     private http: HttpClient,
     private documentService: DocumentService
  ) { }

  ngOnInit(): void {
    this.loadMySubmissions();
  }



  // Thêm các biến để lưu trữ số liệu
  totalDocuments: number = 0;
  pendingReviewCount: number = 0;
  approvedCount: number = 0;

  // assign-approve.component.ts
loadMySubmissions() {
  this.isLoading = true;
  this.documentService.getAllSubmissionsForLibrarian().subscribe({
    next: (res) => {
      this.submissions = res.data || res;
      this.totalDocuments = this.submissions.length;
      this.approvedCount = this.submissions.filter(s => s.status === 'Accept').length;
      this.pendingReviewCount = this.totalDocuments - this.approvedCount;
      this.isLoading = false;
    },
    error: () => this.isLoading = false
  });
}

  goToSubmit() {
    this.router.navigate(['/library/submit']);
  }

  viewDetail(id: string) {
    this.router.navigate(['/library/admin-submission-detail', id]);
  }

  getStatusClass(status: string) {
    if (status === 'Approved') return 'status-approved';
    if (status === 'Rejected') return 'status-rejected';
    if (status === 'Needs Revision') return 'status-revision';
    return 'status-pending';
  }

  
}