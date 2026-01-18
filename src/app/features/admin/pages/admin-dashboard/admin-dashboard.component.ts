import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../../shared/services/auth.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="admin-container">
      <div class="admin-sidebar">
        <h2>⚙️ Quản trị viên</h2>
        <nav class="admin-menu">
          <a routerLink="/admin" [routerLinkActive]="'active'" [routerLinkActiveOptions]="{ exact: true }" class="menu-item">
            📊 Dashboard
          </a>
          <a routerLink="/admin/books" routerLinkActive="active" class="menu-item">
            📚 Quản lý sách
          </a>
          <a routerLink="/admin/users" routerLinkActive="active" class="menu-item">
            👥 Quản lý người dùng
          </a>
          <a routerLink="/admin/analytics" routerLinkActive="active" class="menu-item">
            📈 Thống kê & Báo cáo
          </a>
          <a routerLink="/admin/settings" routerLinkActive="active" class="menu-item">
            ⚙️ Cài đặt hệ thống
          </a>
          <button (click)="logout()" class="menu-item logout">
            🚪 Đăng xuất
          </button>
        </nav>
      </div>

      <div class="admin-content">
        <div class="dashboard-header">
          <h1>📊 Bảng điều khiển quản trị</h1>
          <p>Chào mừng, <strong>{{ userName }}</strong></p>
        </div>

        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon">📚</div>
            <div class="stat-info">
              <div class="stat-label">Tổng sách</div>
              <div class="stat-value">1,250</div>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon">👥</div>
            <div class="stat-info">
              <div class="stat-label">Người dùng</div>
              <div class="stat-value">3,840</div>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon">📥</div>
            <div class="stat-info">
              <div class="stat-label">Lượt tải hôm nay</div>
              <div class="stat-value">426</div>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon">👁️</div>
            <div class="stat-info">
              <div class="stat-label">Lượt xem hôm nay</div>
              <div class="stat-value">2,156</div>
            </div>
          </div>
        </div>

        <div class="dashboard-grid">
          <div class="widget">
            <h3>📊 Hoạt động gần đây</h3>
            <div class="activity-list">
              <div class="activity-item">
                <span class="activity-icon">📥</span>
                <span>Người dùng tải sách "Chiếc thuyền ngoài xa"</span>
                <span class="time">5 phút trước</span>
              </div>
              <div class="activity-item">
                <span class="activity-icon">⭐</span>
                <span>Người dùng đánh giá sách "Khi đôi ta còn trẻ"</span>
                <span class="time">15 phút trước</span>
              </div>
              <div class="activity-item">
                <span class="activity-icon">👤</span>
                <span>Người dùng mới đăng ký tài khoản</span>
                <span class="time">1 giờ trước</span>
              </div>
            </div>
          </div>

          <div class="widget">
            <h3>🔝 Top 5 sách được xem nhiều</h3>
            <div class="top-books">
              <div class="top-item">
                <span class="rank">1️⃣</span>
                <span class="title">Chiếc thuyền ngoài xa</span>
                <span class="count">5,420</span>
              </div>
              <div class="top-item">
                <span class="rank">2️⃣</span>
                <span class="title">Sapiens</span>
                <span class="count">4,850</span>
              </div>
              <div class="top-item">
                <span class="rank">3️⃣</span>
                <span class="title">The Shining</span>
                <span class="count">3,920</span>
              </div>
            </div>
          </div>
        </div>

        <div class="quick-actions">
          <h3>⚡ Hành động nhanh</h3>
          <div class="action-buttons">
            <button routerLink="/admin/books" class="action-btn">
              ➕ Thêm sách mới
            </button>
            <button routerLink="/admin/users" class="action-btn">
              ➕ Thêm người dùng
            </button>
            <button routerLink="/admin/settings" class="action-btn">
              ⚙️ Cấu hình quyền hạn
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .admin-container {
      display: grid;
      grid-template-columns: 250px 1fr;
      height: 100vh;
      background: #f5f5f5;
    }

    .admin-sidebar {
      background: #2c3e50;
      color: white;
      padding: 20px;
      overflow-y: auto;
    }

    .admin-sidebar h2 {
      margin: 0 0 30px 0;
      font-size: 20px;
      color: white;
    }

    .admin-menu {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .menu-item {
      padding: 12px 16px;
      border-radius: 6px;
      cursor: pointer;
      text-decoration: none;
      color: #bbb;
      transition: all 0.3s;
      display: block;
      font-size: 14px;
      border: none;
      background: none;
      text-align: left;
    }

    .menu-item:hover {
      background: rgba(255,255,255,0.1);
      color: white;
    }

    .menu-item.active {
      background: #007bff;
      color: white;
    }

    .menu-item.logout {
      margin-top: auto;
      color: #ff6b6b;
    }

    .menu-item.logout:hover {
      background: rgba(255, 107, 107, 0.2);
    }

    .admin-content {
      overflow-y: auto;
      padding: 30px;
    }

    .dashboard-header {
      margin-bottom: 30px;
    }

    .dashboard-header h1 {
      margin: 0 0 10px 0;
      color: #333;
    }

    .dashboard-header p {
      margin: 0;
      color: #666;
      font-size: 14px;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
      margin-bottom: 30px;
    }

    .stat-card {
      background: white;
      padding: 20px;
      border-radius: 8px;
      display: flex;
      gap: 15px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .stat-icon {
      font-size: 32px;
    }

    .stat-info {
      flex: 1;
    }

    .stat-label {
      font-size: 12px;
      color: #999;
      text-transform: uppercase;
      margin-bottom: 5px;
    }

    .stat-value {
      font-size: 24px;
      font-weight: 700;
      color: #333;
    }

    .dashboard-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      margin-bottom: 30px;
    }

    .widget {
      background: white;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .widget h3 {
      margin: 0 0 20px 0;
      color: #333;
      font-size: 18px;
    }

    .activity-list {
      display: flex;
      flex-direction: column;
      gap: 15px;
    }

    .activity-item {
      display: flex;
      gap: 10px;
      align-items: center;
      font-size: 14px;
      color: #666;
      padding-bottom: 15px;
      border-bottom: 1px solid #eee;
    }

    .activity-item:last-child {
      border-bottom: none;
      padding-bottom: 0;
    }

    .activity-icon {
      font-size: 18px;
    }

    .activity-item span:nth-child(2) {
      flex: 1;
    }

    .time {
      color: #999;
      font-size: 12px;
      white-space: nowrap;
    }

    .top-books {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .top-item {
      display: flex;
      gap: 10px;
      align-items: center;
      font-size: 14px;
      color: #666;
      padding: 10px;
      background: #f9f9f9;
      border-radius: 6px;
    }

    .rank {
      font-size: 18px;
      min-width: 30px;
    }

    .top-item .title {
      flex: 1;
      color: #333;
      font-weight: 500;
    }

    .top-item .count {
      color: #007bff;
      font-weight: 600;
    }

    .quick-actions {
      background: white;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .quick-actions h3 {
      margin: 0 0 15px 0;
      color: #333;
    }

    .action-buttons {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
    }

    .action-btn {
      padding: 10px 20px;
      background: #007bff;
      color: white;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-weight: 600;
      font-size: 14px;
      transition: background 0.3s;
    }

    .action-btn:hover {
      background: #0056b3;
    }

    @media (max-width: 768px) {
      .admin-container {
        grid-template-columns: 1fr;
        height: auto;
      }

      .admin-sidebar {
        order: 2;
        border-top: 1px solid #444;
      }

      .admin-content {
        order: 1;
      }

      .dashboard-grid {
        grid-template-columns: 1fr;
      }

      .stats-grid {
        grid-template-columns: repeat(2, 1fr);
      }

      .action-buttons {
        flex-direction: column;
      }

      .action-btn {
        width: 100%;
      }
    }
  `]
})
export class AdminDashboardComponent implements OnInit {
  userName = 'Admin';

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.userName = user.fullName || user.username;
    }
  }

  logout(): void {
    this.authService.logout();
  }
}
