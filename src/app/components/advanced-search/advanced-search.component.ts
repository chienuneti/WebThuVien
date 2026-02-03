import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { DocumentService } from '../../shared/services/document.service';
import { Discipline, Faculty } from '../../models/book.model';

@Component({
  selector: 'app-advanced-search',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './advanced-search.component.html',
  styleUrl: './advanced-search.component.css'
})
export class AdvancedSearchComponent implements OnInit {
  // Đối tượng lưu trữ giá trị lọc
  searchForm: any = {
    title: '',
    collectionId: '',
    documentType: '', // Khởi đầu để trống để không hiện box động
    startDate: '',
    endDate: '',
    keywords: '',
    
    // Các trường đặc thù dựa trên documentType
    thesis: { degreeLevel: '', discipline: '', advisorName: '' },
    internalBook: { faculty: '', documentType: ''},
    externalBook: { publisher: ''},
    research: { researchLevel: '' },
    researchPublication: { venueName: '', publicationType: '' }
  };

  // Các danh sách dữ liệu đổ vào Dropdown
  collections: any[] = [];
  availableFaculties: Faculty[] = [];
  availableDiscipline: Discipline[] = [];

  constructor(
    private documentService: DocumentService,
    private router: Router,
    private location: Location
  ) { }

  ngOnInit(): void {
    this.loadCollections();
    this.loadDisciplines();
    this.loadFaculties();
  }

  // --- HÀM LOAD DỮ LIỆU TỪ SERVICE (GIỐNG TRANG SUBMIT) ---
  loadFaculties() {
    this.documentService.getFaculties().subscribe({
      next: (res: any) => this.availableFaculties = Array.isArray(res) ? res : (res.data || [])
    });
  }

  loadDisciplines() {
    this.documentService.getDisciplines().subscribe({
      next: (res: any) => this.availableDiscipline = Array.isArray(res) ? res : (res.data || [])
    });
  }

  loadCollections() {
    this.documentService.getCollections().subscribe({
      next: (res: any) => this.collections = Array.isArray(res) ? res : (res.data || [])
    });
  }

  // --- XỬ LÝ TÌM KIẾM ---
  onAdvancedSearch() {
    const params: any = {};

    // Gộp các trường chung
    if (this.searchForm.title) params.title = this.searchForm.title;
    if (this.searchForm.collectionId) params.collectionId = this.searchForm.collectionId;
    if (this.searchForm.documentType) params.type = this.searchForm.documentType;
    if (this.searchForm.startDate) params.fromDate = this.searchForm.startDate;
    if (this.searchForm.endDate) params.toDate = this.searchForm.endDate;
    if (this.searchForm.keywords) params.keywords = this.searchForm.keywords;

    // Gộp các trường đặc thù theo loại
    const type = this.searchForm.documentType;
    if (type === 'Thesis') {
      if (this.searchForm.thesis.degreeLevel) params.degreeLevel = this.searchForm.thesis.degreeLevel;
      if (this.searchForm.thesis.discipline) params.discipline = this.searchForm.thesis.discipline;
      if (this.searchForm.thesis.advisorName) params.advisor = this.searchForm.thesis.advisorName;
    } else if (type === 'InternalBook') {
      if (this.searchForm.internalBook.faculty) params.faculty = this.searchForm.internalBook.faculty;
      if (this.searchForm.internalBook.documentType) params.subType = this.searchForm.internalBook.documentType;
      if (this.searchForm.internalBook.version) params.version = this.searchForm.internalBook.version;
    } else if (type === 'ExternalBook') {
      if (this.searchForm.externalBook.publisher) params.publisher = this.searchForm.externalBook.publisher;
    } else if (type === 'Research') {
      if (this.searchForm.research.researchLevel) params.researchLevel = this.searchForm.research.researchLevel;
    } else if (type === 'ResearchPublication') {
      if (this.searchForm.researchPublication.venueName) params.venue = this.searchForm.researchPublication.venueName;
      if (this.searchForm.researchPublication.publicationType) params.pubType = this.searchForm.researchPublication.publicationType;
    }

    // Điều hướng sang trang list kèm params
    this.router.navigate(['/library/list'], { queryParams: params });
  }

  resetForm() {
    this.searchForm = {
      title: '', collectionId: '', documentType: '', startDate: '', endDate: '', keywords: '',
      thesis: { degreeLevel: '', discipline: '', advisorName: '' },
      internalBook: { faculty: '', documentType: '', version: '' },
      externalBook: { publisher: '', version: '' },
      research: { researchLevel: '' },
      researchPublication: { venueName: '', publicationType: '' }
    };
  }

  goBack() {
    this.location.back();
  }
}