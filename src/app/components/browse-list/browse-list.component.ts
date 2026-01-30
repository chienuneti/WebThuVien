import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common'; // Import Location
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { DocumentService } from '../../shared/services/document.service';
// import { DocumentListDto } from '../../models/book.model'; // Nếu cần
import { Observable } from 'rxjs';

@Component({
  selector: 'app-browse-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './browse-list.component.html',
  styleUrl: './browse-list.component.css' // Chú ý: styleUrl (Angular 17+) hoặc styleUrls
})
export class BrowseListComponent implements OnInit {
  category: string = '';
  items: any[] = [];
  title: string = '';
  isLoading = true;

  // --- Biến Phân trang ---
  currentPage = 1;
  totalPages = 1;
  pageSize = 12; // Số lượng item trên 1 trang
  totalItems = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private documentService: DocumentService,
    private location: Location
  ) {}

  ngOnInit() {
    // Lắng nghe thay đổi trên URL (cả category và page)
    this.route.params.subscribe(params => {
      this.category = params['category'];
      
      // Sau khi có category, lắng nghe tiếp query params (page)
      this.route.queryParams.subscribe(queries => {
        this.currentPage = queries['page'] ? +queries['page'] : 1;
        this.updateHeaderTitle();
        this.loadData();
      });
    });
  }

  // Hàm quay lại
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
    
    // Tạo params phân trang
    const params = {
      page: this.currentPage,
      pageSize: this.pageSize
    };

    // Gọi API tương ứng (Giả sử các hàm này trong Service đã hỗ trợ nhận params)
    let request: Observable<any>;

    if (this.category === 'authors') {
      request = this.documentService.getAuthors(params);
    } else if (this.category === 'collections') {
      request = this.documentService.getCollections(params);
    } else if (this.category === 'communities') {
      request = this.documentService.getCommunities(params);
    } else {
      // Document Types thường ít, có thể không cần phân trang, nhưng cứ gọi thống nhất
      request = this.documentService.getDocumentTypes(params);
    }

    request.subscribe({
      next: (res: any) => {
        // Kiểm tra xem BE trả về dạng PaginatedResult hay Array thường
        if (res.data) {
          // Trường hợp trả về PaginatedResult
          this.items = res.data;
          this.totalPages = res.totalPages;
          this.totalItems = res.totalItems;
        } else {
          // Trường hợp BE trả về mảng (chưa phân trang server), ta hiển thị hết
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

  // Hàm chuyển trang
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