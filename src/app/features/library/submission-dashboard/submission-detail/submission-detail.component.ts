import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-submission-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './submission-detail.component.html',
  styleUrls: ['./submission-detail.component.css']
})
export class SubmissionDetailComponent implements OnInit {
  submissionId: string | null = null;
  submission: any = null; 
  histories: any[] = [];
  isLoading = true;
  canRevise = false;

  currentUserId = "6"; 

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.submissionId = this.route.snapshot.paramMap.get('id');
    if (this.submissionId) {
      this.loadSubmissionDetail();
    }
  }


loadSubmissionDetail() {
  this.isLoading = true;

  this.http.get<any[]>(`${environment.apiUrl}/Submission/${this.submissionId}/history`)
    .subscribe(res => this.histories = res ?? []);

  this.http.get<any>(`${environment.apiUrl}/Submission/info/${this.submissionId}`)
    .subscribe({
      next: (res) => {
        this.submission = res; 
        
        const isFinal = res.status === 'Accept' || res.status === 'Reject';
        this.canRevise = !isFinal && res.submitterId === this.currentUserId;
        
        this.isLoading = false;
      },
      error: () => this.isLoading = false
    });
}

goToRevise() {
  if (!this.submission || !this.submission.documentId) return;

  this.router.navigate(['/library/submit'], { 
    queryParams: { 
      id: this.submissionId,             
      documentId: this.submission.documentId, 
      mode: 'revise' 
    } 
  });
}

  checkRevisePermission() {
    if (!this.submission) return;

    const isFinalStatus = this.submission.status === 'Accept' || this.submission.status === 'Reject';
    const isOwner = this.submission.submitterId === this.currentUserId;

    this.canRevise = !isFinalStatus && isOwner;
  } 

  backToDashboard() {
    this.router.navigate(['/library/submission-dashboard']);
  }
}