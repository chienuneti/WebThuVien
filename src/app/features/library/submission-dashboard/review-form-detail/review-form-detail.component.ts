import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { DocumentService } from '../../../../shared/services/document.service';
import { environment } from '../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-review-form-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './review-form-detail.component.html',
  styleUrls: ['./review-form-detail.component.css']
})
export class ReviewFormDetailComponent implements OnInit {
  formData: any = {
    authors: [], identifiers: [], licenses: [],
    thesis: {}, internalBook: {}, externalBook: {}, research: {}, researchPublication: {}
  };

  reviewResult: string = ''; 
  reviewNote: string = '';   

  submissionId: string | null = null;
  documentId: string | null = null;
  isLoading = false;
  collections: any[] = [];
  availableLicenses: any[] = [];
  identifierTypes = ['ISBN', 'ISSN', 'DOI', 'URI', 'Other'];

  constructor(
    private documentService: DocumentService,
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.submissionId = this.route.snapshot.paramMap.get('id');
    this.loadMetadata(); 
    if (this.submissionId) {
      this.loadData();
    }
  }

  loadMetadata() {
    this.documentService.getCollections().subscribe(res => this.collections = res.data || res);
    this.documentService.getAllLicenses().subscribe(res => this.availableLicenses = res as any[]);
  }

  loadData() {
    this.isLoading = true;
    this.http.get<any>(`${environment.apiUrl}/Submission/info/${this.submissionId}`).subscribe({
      next: (info) => {
        this.documentId = info.documentId;
        this.documentService.getById(this.documentId!).subscribe({
          next: (res: any) => {
            this.mapDataToForm(res);
            this.isLoading = false;
          },
          error: () => this.isLoading = false
        });
      },
      error: () => this.isLoading = false
    });
  }

  mapDataToForm(res: any) {
    this.formData = {
      ...res,
      publicationDate: res.publicationDate?.split('T')[0],
      keywords: res.keywords?.join(', '),
      authors: res.authors ? res.authors.map((a: any) => ({
        ...a,
        orcid: a.orcId, 
        imagePreview: a.image ? `${environment.staticUrl}/${a.image}` : null
      })) : [],
      
      identifiers: res.identifiers || [],

      licenses: res.licenses ? res.licenses.map((l: any) => ({
        ...l,
        uiMode: 'SELECT', 
        selectedId: l.id,
        name: l.name
      })) : []
    };

    if (res.identifiers) {
      res.identifiers.forEach((id: any) => {
        if (id.type && !this.identifierTypes.includes(id.type)) {
          this.identifierTypes.push(id.type);
        }
      });
    }
  }

  openPdf() {
    if (!this.documentId) {
    alert("Dữ liệu tài liệu đang được tải, vui lòng đợi trong giây lát...");
    return;
  }
    const url = this.router.serializeUrl(
      this.router.createUrlTree(['/library/read', this.documentId])
    );
    window.open(url, '_blank');
  }

  onSubmitReview() {
    if (!this.reviewResult) {
      alert('Vui lòng chọn kết quả thẩm định!');
      return;
    }

    this.isLoading = true;
    
    const finalComment = this.reviewNote 
      ? `${this.reviewResult}: ${this.reviewNote}` 
      : this.reviewResult;

    const dto = {
      submissionId: this.submissionId,
      comment: this.reviewResult 
    };

    this.http.post(`${environment.apiUrl}/Submission/review`, dto).subscribe({
      next: () => {
        this.isLoading = false;
        alert('Gửi kết quả thẩm định thành công!');
        this.router.navigate(['/library/review-workflow', this.submissionId]);
      },
      error: (err) => {
        this.isLoading = false;
        alert(err.error?.message || 'Lỗi khi gửi review');
      }
    });
  }
}