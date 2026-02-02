import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserProfileService, UserProfile, Book, HistoryItem } from '../../shared/services/user.service'
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../shared/services/auth.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule,FormsModule,RouterModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  userProfile: UserProfile | null = null;
  savedBooks: Book[] = [];
  uploadHistory: HistoryItem[] = [];
  downloadHistory: HistoryItem[] = [];
  currentlyReading: Book[] = [];
  isUpdating: boolean = false;
  editProfile: { name: string; phoneNumber: string } = {
    name: '',
    phoneNumber: ''
  };
  
  activeSection: string = 'info'; // info, saved, upload-history, download-history, reading
  loading: boolean = false;
  error: string = '';

  constructor(private userProfileService: UserProfileService
    ,private authService: AuthService,
   private router: Router) {}

  ngOnInit(): void {
    this.loadAllData();
  }

  /**
   * Load tất cả dữ liệu cần thiết
   */
  loadAllData(): void {
    this.loading = true;
    
    // Load thông tin profile
    this.userProfileService.getUserProfile().subscribe({
      next: (response) => {
        this.userProfile = response.data;
        this.loading = false;
        this.editProfile.name = this.userProfile.name;
        this.editProfile.phoneNumber = this.userProfile.phoneNumber;
      },
      error: (err) => {
        
        this.error = 'Không thể tải thông tin cá nhân';
        this.loading = false;
        console.error('Error loading profile:', err);
      }
    });

    // Load các dữ liệu khác song song
    this.loadSavedBooks();
    this.loadUploadHistory();
    this.loadDownloadHistory();
    this.loadCurrentlyReading();
  }

  loadSavedBooks(): void {
    this.userProfileService.getSavedBooks().subscribe({
      next: (res) => {
        this.savedBooks =res.data;
        console.log("saved:" +this.savedBooks[0].documentId);
      },
      error: (err) => {
        console.error('Error loading saved books:', err);
      }
    });
  }

  loadUploadHistory(): void {
    this.userProfileService.getUploadHistory().subscribe({
      next: (data) => {
        this.uploadHistory = data;
      },
      error: (err) => {
        console.error('Error loading upload history:', err);
      }
    });
  }

  loadDownloadHistory(): void {
    this.userProfileService.getDownloadHistory().subscribe({
      next: (data) => {
        this.downloadHistory = data;
      },
      error: (err) => {
        console.error('Error loading download history:', err);
      }
    });
  }

  loadCurrentlyReading(): void {
    this.userProfileService.getCurrentlyReading().subscribe({
      next: (res) => {
        this.currentlyReading =res.data;
      },
      error: (err) => {
        console.error('Error loading currently reading:', err);
      }
    });
  }

  // Chuyển đổi section
  setActiveSection(section: string): void {
    this.activeSection = section;
  }

  // Xóa sách đã lưu
  removeSavedBook(bookId: string): void {
    if (confirm('Bạn có chắc muốn xóa sách này khỏi danh sách đã lưu?')) {
      this.userProfileService.removeSavedBook(bookId).subscribe({
        next: () => {
          this.savedBooks = this.savedBooks.filter(book => book.documentId !== bookId);
          alert('Đã xóa sách thành công');
        },
        error: (err) => {
          alert('Không thể xóa sách. Vui lòng thử lại.');
          console.error('Error removing book:', err);
        }
      });
    }
  }

  // Tiếp tục đọc sách
  continueReading(bookId: string): void {
    // Chuyển hướng đến trang đọc sách
    // Có thể sử dụng Router để navigate
    window.location.href = `/book/read/${bookId}`;
  }

  // Format date
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
 updateProfile(): void {
    this.isUpdating = true;
    
    const updateData = {
      name: this.editProfile.name,
      phoneNumber: this.editProfile.phoneNumber
    };
    console.log(updateData.name);

    this.userProfileService.updateProfile(updateData).subscribe({
      next: (response) => {
        this.userProfile = response;
        alert('Cập nhật thông tin thành công!');
        this.isUpdating = false;
      },
      error: (err) => {
        alert('Không thể cập nhật thông tin. Vui lòng thử lại.');
        console.error('Error updating profile:', err);
        this.isUpdating = false;
      }
    });
  }
  /**
   * Refresh data sau khi có thay đổi
   */
  refreshData(): void {
    this.loadAllData();
  }
  
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}