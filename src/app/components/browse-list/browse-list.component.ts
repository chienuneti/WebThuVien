import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common'; 
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { DocumentService } from '../../shared/services/document.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-browse-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './browse-list.component.html',
  styleUrl: './browse-list.component.css'
})
export class BrowseListComponent implements OnInit {
  category: string = '';
  items: any[] = [];
  title: string = '';
  isLoading = true;

  currentPage = 1;
  totalPages = 1;
  pageSize = 12; 
  totalItems = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private documentService: DocumentService,
    private location: Location
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.category = params['category'];
      
      this.route.queryParams.subscribe(queries => {
        this.currentPage = queries['page'] ? +queries['page'] : 1;
        this.updateHeaderTitle();
        this.loadData();
      });
    });
  }

  goBack() {
    this.location.back();
  }

  updateHeaderTitle() {
    switch (this.category) {
      case 'authors': this.title = 'Duyệt theo Tác giả'; break;
      case 'collections': this.title = 'Duyệt theo Bộ sưu tập'; break;
      case 'communities': this.title = 'Duyệt theo Cộng đồng & Khoa'; break;
      default: this.title = 'Duyệt theo Loại tài liệu';
    }
  }

  loadData() {
    this.isLoading = true;
    
    const params = {
      page: this.currentPage,
      pageSize: this.pageSize
    };

    let request: Observable<any>;

    if (this.category === 'authors') {
      request = this.documentService.getAuthors(params);
    } else if (this.category === 'collections') {
      request = this.documentService.getCollections(params);
    } else if (this.category === 'communities') {
      request = this.documentService.getCommunities(params);
    } else {
      request = this.documentService.getDocumentTypes(params);
    }

    request.subscribe({
      next: (res: any) => {
        if (res.data) {
          this.items = res.data;
          this.totalPages = res.totalPages;
          this.totalItems = res.totalItems;
        } else {
          this.items = res;
          this.totalPages = 1; 
          this.totalItems = res.length;
        }
        
        this.isLoading = false;
        window.scrollTo(0, 0);
      },
      error: (err) => {
        console.error('Lỗi API:', err);
        this.isLoading = false;
      }
    });
  }

  changePage(newPage: number) {
    if (newPage >= 1 && newPage <= this.totalPages) {
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { page: newPage },
        queryParamsHandling: 'merge'
      });
    }
  }

  selectItem(item: any) {
    let queryParams = {};
    const id = item.id || item.Id;

    if (this.category === 'authors') queryParams = { authorId: id };
    else if (this.category === 'collections') queryParams = { collectionId: id };
    else if (this.category === 'communities') queryParams = { communityId: id };
    else queryParams = { type: item.id || item };

    this.router.navigate(['/library/list'], { queryParams });
  }
}