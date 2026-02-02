import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-read-history',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="history-container">
      <h1>Lịch sử đọc sách của tôi</h1>
      
      <div class="empty-state">
        <p>Bạn chưa đọc sách nào</p>
        <p style="font-size: 14px; color: #999;">Lịch sử đọc sách sẽ được lưu khi bạn mở trình đọc</p>
        <button [routerLink]="['/library']" class="btn-browse">
          Khám phá thư viện
        </button>
      </div>
    </div>
  `,
  styles: [`
    .history-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
    }

    h1 {
      margin-bottom: 30px;
      color: #333;
    }

    .empty-state {
      text-align: center;
      padding: 60px 20px;
      color: #999;
    }

    .empty-state p {
      margin: 10px 0;
    }

    .btn-browse {
      margin-top: 20px;
      padding: 10px 20px;
      background: #007bff;
      color: white;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-weight: 600;
    }

    .btn-browse:hover {
      background: #0056b3;
    }
  `]
})
export class ReadHistoryComponent {}
