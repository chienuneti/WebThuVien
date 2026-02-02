import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { License, Submission } from '../../models/book.model';
import { DocumentService } from '../../shared/services/document.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-submit-document',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './submit-document.component.html',
  styleUrls: ['./submit-document.component.css']
})
export class SubmitDocumentComponent implements OnInit {
  formData: any = {
    title: '',
    description: '',
    documentType: 'Thesis',
    collectionId: '',
    keywords: '',
    file: null,
    coverFile: null,

    authors: [{ name: '', email: '', orcid: '', expertise: '', imageFile: null, imagePreview: null }],
    identifiers: [{ type: 'ISBN', value: '' }],
    licenses: [],

    thesis: { degreeLevel: '', discipline: '', advisorName: '', abstract: '' },
    internalBook: { faculty: '', documentType: '', version: '' },
    externalBook: { publisher: '', version: '' },
    research: { abstract: '', researchLevel: '' },
    researchPublication: { venueName: '', publicationType: '' },
    revisionComment: ''
  };

  submissionHistory: Submission[] = [];
  collections: any[] = [];
  isLoading = false;
  availableLicenses: License[] = [];
  identifierTypes = ['ISBN', 'ISSN', 'DOI', 'URI', 'Other'];

  isReviseMode = false;
  submissionId: string | null = null;
  documentId: string | null = null;

  MAX_PDF_SIZE: number = 50 * 1024 * 1024;
  MAX_IMAGE_SIZE: number = 5 * 1024 * 1024;

  constructor(
    private documentService: DocumentService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.loadCollections();
    this.loadLicenses();

    this.route.queryParams.subscribe(params => {

      if (params['id'] && params['mode'] === 'revise') {
        this.isReviseMode = true;
        this.submissionId = params['id'];
        this.documentId = params['documentId'];

        if (this.documentId) {
          this.loadDataForRevision();
        }
      }
    });
  }


  loadDataForRevision() {
    if (!this.documentId) return;
    this.isLoading = true;

    this.documentService.getById(this.documentId).subscribe({
      next: (res: any) => {
        console.log('Dữ liệu từ BE:', res);

        this.formData.title = res.title;
        this.formData.description = res.description;
        this.formData.documentType = res.documentType;
        this.formData.publicationDate = res.publicationDate?.split('T')[0];
        this.formData.pageNum = res.pageNum;
        this.formData.introEndPage = res.introEndPage;

        this.formData.collectionId = res.collectionId ? res.collectionId.toString().toLowerCase() : '';

        this.formData.keywords = res.keywords?.join(', ');

        if (res.internalBook) {
          this.formData.internalBook = {
            faculty: res.internalBook.faculty || '',
            documentType: res.internalBook.documentType || '',
            version: res.internalBook.version?.toString() || ''
          };
        }

        if (res.researchPublication) {
          this.formData.researchPublication = {
            venueName: res.researchPublication.venueName || '',
            publicationType: res.researchPublication.publicationType || ''
          };
        }

        if (res.thesis) this.formData.thesis = { ...res.thesis };

        this.formData.authors = res.authors ? res.authors.map((a: any) => ({
          name: a.name,
          email: a.email,
          expertise: a.expertise,
          orcid: a.orcId,
          imagePreview: a.image ? `${environment.staticUrl}/${a.image}` : null
        })) : [];

        this.formData.identifiers = res.identifiers || [];

        this.formData.licenses = res.licenses ? res.licenses.map((l: any) => ({
          uiMode: 'SELECT',
          selectedId: l.id,
          name: l.name,
          content: l.content
        })) : [];

        this.isLoading = false;
      }
    });
  }

  loadLicenses() {
    this.documentService.getAllLicenses().subscribe({
      next: (res: any) => {
        this.availableLicenses = Array.isArray(res) ? res : (res.data || []);
      }
    });
  }

  loadCollections() {
    this.documentService.getCollections().subscribe({
      next: (res: any) => {
        const list = Array.isArray(res) ? res : (res.data || []);
        this.collections = list;
        if (!this.isReviseMode && list.length > 0 && !this.formData.collectionId) {
          this.formData.collectionId = list[0].id;
        }
      }
    });
  }

  onMainFileSelected(event: any, type: 'pdf' | 'cover') {
    const file = event.target.files[0];
    if (!file) return;

    if (type === 'pdf') {
      if (file.type !== 'application/pdf') {
        alert('Chỉ nhận file PDF');
        event.target.value = '';
        return;
      }
      if (file.size > this.MAX_PDF_SIZE) {
        alert('File PDF không được vượt quá 50MB');
        event.target.value = '';
        return;
      }
      this.formData.file = file;
    } else {
      if (!file.type.startsWith('image/')) {
        alert('Chỉ nhận file ảnh');
        event.target.value = '';
        return;
      }
      if (file.size > this.MAX_IMAGE_SIZE) {
        alert('Ảnh bìa không được vượt quá 5MB');
        event.target.value = '';
        return;
      }
      this.formData.coverFile = file;
    }
  }

  onAuthorImageSelected(event: any, index: number) {
    const file = event.target.files[0];
    if (!file) return;

    if (file.size > this.MAX_IMAGE_SIZE) {
      alert('Ảnh tác giả không được vượt quá 5MB');
      event.target.value = '';
      return;
    }

    if (file.type.startsWith('image/')) {
      this.formData.authors[index].imageFile = file;
      const reader = new FileReader();
      reader.onload = (e) => this.formData.authors[index].imagePreview = e.target?.result;
      reader.readAsDataURL(file);
    }
  }

  addAuthor() { this.formData.authors.push({ name: '', email: '', orcid: '', expertise: '', imageFile: null, imagePreview: null }); }
  removeAuthor(i: number) { if (this.formData.authors.length > 1) this.formData.authors.splice(i, 1); }
  addIdentifier() { this.formData.identifiers.push({ type: 'ISBN', value: '' }); }
  removeIdentifier(i: number) { this.formData.identifiers.splice(i, 1); }
  addLicense() { this.formData.licenses.push({ uiMode: 'SELECT', selectedId: '', name: '', content: '' }); }
  removeLicense(i: number) { this.formData.licenses.splice(i, 1); }

  onLicenseChange(index: number, value: string) {
    const lic = this.formData.licenses[index];
    if (value === 'NEW_OPTION') {
      lic.uiMode = 'NEW';
      lic.selectedId = '';
    } else {
      lic.uiMode = 'SELECT';
      lic.selectedId = value;
    }
  }

  cancelNewLicense(index: number) {
    const lic = this.formData.licenses[index];
    lic.uiMode = 'SELECT';
    lic.selectedId = '';
  }

  onSubmit() {
    if (!this.formData.title) { alert('Nhập tiêu đề!'); return; }

    if (!this.isReviseMode && !this.formData.file) {
      alert('Chọn file PDF!');
      return;
    }

    if (this.isReviseMode && !this.formData.revisionComment) {
      alert('Vui lòng nhập nội dung thay đổi vào ô Ghi chú chỉnh sửa!');
      return;
    }

    this.isLoading = true;

    if (this.isReviseMode) {
      this.documentService.updateDocument(this.submissionId!, this.formData).subscribe({
        next: () => {
          this.isLoading = false;
          alert('Cập nhật bản chỉnh sửa thành công!');
          this.router.navigate(['/library/submission-detail', this.submissionId]);
        },
        error: (err) => {
          this.isLoading = false;
          alert('Lỗi cập nhật: ' + (err.error?.message || err.message));
        }
      });
    } else {
      this.documentService.createDocument(this.formData).subscribe({
        next: (res) => {
          this.isLoading = false;
          alert('Tải lên thành công!');
          this.router.navigate(['/library/submission-dashboard']);
        },
        error: (err) => {
          this.isLoading = false;
          alert('Lỗi tải lên: ' + (err.error?.message || err.message));
        }
      });
    }
  }

  loadHistory() { }
  resetForm() {
  }
}