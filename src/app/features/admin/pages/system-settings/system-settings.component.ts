import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-system-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="settings-container">
      <h1>⚙️ Cài đặt hệ thống</h1>

      <div class="settings-section">
        <h2>Quyền hạn theo vai trò</h2>
        <table class="permissions-table">
          <thead>
            <tr>
              <th>Chức năng</th>
              <th>Xem</th>
              <th>Độc</th>
              <th>Tải</th>
              <th>Quản trị</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Chưa đăng nhập</td>
              <td><input type="checkbox" checked disabled /></td>
              <td><input type="checkbox" disabled /></td>
              <td><input type="checkbox" disabled /></td>
              <td><input type="checkbox" disabled /></td>
            </tr>
            <tr>
              <td>Sinh viên</td>
              <td><input type="checkbox" checked /></td>
              <td><input type="checkbox" checked /></td>
              <td><input type="checkbox" disabled /></td>
              <td><input type="checkbox" disabled /></td>
            </tr>
            <tr>
              <td>Giáo viên</td>
              <td><input type="checkbox" checked /></td>
              <td><input type="checkbox" checked /></td>
              <td><input type="checkbox" checked /></td>
              <td><input type="checkbox" disabled /></td>
            </tr>
            <tr>
              <td>Admin</td>
              <td><input type="checkbox" checked /></td>
              <td><input type="checkbox" checked /></td>
              <td><input type="checkbox" checked /></td>
              <td><input type="checkbox" checked /></td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="settings-section">
        <h2>Giới hạn tải xuống theo ngày</h2>
        <div class="setting-item">
          <label>Sinh viên (tối đa lần/ngày):</label>
          <input type="number" [(ngModel)]="studentDailyLimit" class="input-number" />
        </div>
        <div class="setting-item">
          <label>Giáo viên (tối đa lần/ngày):</label>
          <input type="number" [(ngModel)]="teacherDailyLimit" class="input-number" />
        </div>
        <div class="setting-item">
          <label>Admin (tối đa lần/ngày):</label>
          <input type="number" [(ngModel)]="adminDailyLimit" class="input-number" />
        </div>
      </div>

      <div class="settings-section">
        <h2>Cài đặt chung</h2>
        <div class="setting-item">
          <label>
            <input type="checkbox" [(ngModel)]="allowGuestView" />
            Cho phép khách xem danh sách sách
          </label>
        </div>
        <div class="setting-item">
          <label>
            <input type="checkbox" [(ngModel)]="requireEmailVerification" />
            Yêu cầu xác thực email khi đăng ký
          </label>
        </div>
        <div class="setting-item">
          <label>
            <input type="checkbox" [(ngModel)]="enableComments" />
            Cho phép bình luận trên sách
          </label>
        </div>
      </div>

      <div class="settings-actions">
        <button class="btn-save" (click)="saveSettings()">💾 Lưu cài đặt</button>
        <button class="btn-reset" (click)="resetSettings()">🔄 Đặt lại</button>
      </div>
    </div>
  `,
  styles: [`
    .settings-container {
      max-width: 1000px;
      margin: 0 auto;
    }

    h1 {
      color: #333;
      margin-bottom: 30px;
    }

    h2 {
      color: #555;
      font-size: 18px;
      margin-bottom: 20px;
      border-bottom: 2px solid #007bff;
      padding-bottom: 10px;
    }

    .settings-section {
      background: white;
      padding: 20px;
      border-radius: 8px;
      margin-bottom: 20px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .permissions-table {
      width: 100%;
      border-collapse: collapse;
    }

    .permissions-table th {
      background: #f8f9fa;
      padding: 12px;
      text-align: left;
      font-weight: 600;
      border-bottom: 2px solid #dee2e6;
    }

    .permissions-table td {
      padding: 12px;
      border-bottom: 1px solid #dee2e6;
    }

    .permissions-table input[type="checkbox"] {
      cursor: pointer;
      width: 20px;
      height: 20px;
    }

    .setting-item {
      margin-bottom: 15px;
    }

    .setting-item label {
      display: block;
      margin-bottom: 8px;
      color: #333;
      font-weight: 500;
      cursor: pointer;
    }

    .setting-item input[type="checkbox"] {
      margin-right: 8px;
      cursor: pointer;
    }

    .input-number {
      padding: 8px 12px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 14px;
      width: 200px;
    }

    .settings-actions {
      display: flex;
      gap: 10px;
      margin-top: 30px;
    }

    .btn-save, .btn-reset {
      padding: 12px 24px;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-weight: 600;
      font-size: 14px;
    }

    .btn-save {
      background: #28a745;
      color: white;
    }

    .btn-save:hover {
      background: #1e7e34;
    }

    .btn-reset {
      background: #6c757d;
      color: white;
    }

    .btn-reset:hover {
      background: #545b62;
    }
  `]
})
export class SystemSettingsComponent {
  studentDailyLimit = 5;
  teacherDailyLimit = 20;
  adminDailyLimit = 100;
  allowGuestView = true;
  requireEmailVerification = true;
  enableComments = true;

  saveSettings(): void {
    alert('Cài đặt đã được lưu thành công!');
  }

  resetSettings(): void {
    this.studentDailyLimit = 5;
    this.teacherDailyLimit = 20;
    this.adminDailyLimit = 100;
    this.allowGuestView = true;
    this.requireEmailVerification = true;
    this.enableComments = true;
    alert('Cài đặt đã được đặt lại về mặc định!');
  }
}
