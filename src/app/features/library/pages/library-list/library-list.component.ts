// library-list.component.ts đã tối ưu
import { Component } from '@angular/core'; // Bỏ OnInit nếu không gọi API lấy list
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router'; // Thêm Router

interface FeaturedItem {
  id: string; title: string; type: string; image: string; link: string;
}

@Component({
  selector: 'app-library-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './library-list.component.html',
  styleUrl: './library-list.component.css'
})
export class LibraryListComponent {
  searchKeyword = '';

  constructor(private router: Router, private location: Location) { } 

  onSearch(): void {
    if (this.searchKeyword.trim()) {
      this.router.navigate(['/library/list'], { 
        queryParams: { keyword: this.searchKeyword } 
      });
    }
  }

  featuredItems: FeaturedItem[] = [
    { id: '1', title: 'Dự án nghiên cứu', type: 'Collection', image: 'assets/images/2017-05-18-10-27-07-550x364.jpg', link: '/library/browse/collections' },
    { id: '2', title: 'Những cuốn sách kinh điển mọi thời đại', type: 'Collection', image: 'assets/images/book-pictures-qpdzbe0kvoimbbp6.jpg', link: '/library/browse/collections' },
    { id: '3', title: 'Nghiên cứu khoa học sinh viên', type: 'Collection', image: 'assets/images/BelterMain21200x628.jpg', link: '/library/browse/collections' },
    { id: '4', title: 'Khóa luận/Luận văn', type: 'Theses', image: 'assets/images/in-luan-van-gia-re.jpg', link: '/library/browse/document-types' },
    { id: '5', title: 'Khoa Công nghệ thông tin', type: 'Community', image: 'assets/images/R.jpeg', link: '/library/browse/communities' },
    { id: '6', title: 'Tác giả tiêu biểu', type: 'Author', image: 'assets/images/z945iRPoSgaDTbTJe798BY.jpg', link: '/library/browse/authors' },
  ];

  currentPage = 0;
  setPage(pageIndex: number) { this.currentPage = pageIndex; }
  get carouselTransform() { return `translateX(-${this.currentPage * 100}%)`; }
  
  onImgError(event: any) { event.target.src = '/assets/images/default-book.png'; }

  submitDocument() {
    this.router.navigate(['/library/submission-dashboard']); 
  }

  reviewSubmision() {
    this.router.navigate(['/library/review-dashboard']); 
  }
  assignapprove() {
    this.router.navigate(['/library/assign-approve']); 
  }

  goBack() {
    if (window.history.length > 1) {
      this.location.back();
    } else {
      this.router.navigate(['/']); 
    }
  }
}