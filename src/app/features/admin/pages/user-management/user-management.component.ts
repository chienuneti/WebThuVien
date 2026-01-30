import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="management-container">
      <h1>👥 Quản lý người dùng</h1>
      <div class="actions">
        <button class="btn-primary">➕ Thêm người dùng</button>
      </div>
      <div class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th>Tên</th>
              <th>Email</th>
              <th>Vai trò</th>
              <th>Trạng thái</th>
              <th>Tham gia lúc</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Test User</td>
              <td>test&#64;example.com</td>
              <td><span class="badge user">User</span></td>
              <td><span class="badge active">Kích hoạt</span></td>
              <td>01/01/2024</td>
              <td>
                <button class="btn-small">✏️ Sửa</button>
                <button class="btn-small danger">🗑️ Xóa</button>
              </td>
            </tr>
            <tr>
              <td>John Doe</td>
              <td>john&#64;example.com</td>
              <td><span class="badge admin">Admin</span></td>
              <td><span class="badge active">Kích hoạt</span></td>
              <td>01/01/2024</td>
              <td>
                <button class="btn-small">✏️ Sửa</button>
                <button class="btn-small danger">🗑️ Xóa</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .management-container {
      max-width: 1200px;
      margin: 0 auto;
    }

    h1 {
      color: #333;
      margin-bottom: 20px;
    }

    .actions {
      margin-bottom: 20px;
    }

    .btn-primary {
      padding: 10px 20px;
      background: #007bff;
      color: white;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-weight: 600;
    }

    .btn-primary:hover {
      background: #0056b3;
    }

    .table-container {
      overflow-x: auto;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .data-table {
      width: 100%;
      border-collapse: collapse;
    }

    .data-table thead {
      background: #f8f9fa;
      border-bottom: 2px solid #dee2e6;
    }

    .data-table th {
      padding: 15px;
      text-align: left;
      font-weight: 600;
      color: #333;
      font-size: 14px;
    }

    .data-table td {
      padding: 15px;
      border-bottom: 1px solid #dee2e6;
      color: #666;
      font-size: 14px;
    }

    .data-table tbody tr:hover {
      background: #f9f9f9;
    }

    .badge {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
    }

    .badge.user {
      background: #e7f3ff;
      color: #0066cc;
    }

    .badge.admin {
      background: #fff3cd;
      color: #ff9800;
    }

    .badge.active {
      background: #d4edda;
      color: #155724;
    }

    .btn-small {
      padding: 6px 12px;
      margin-right: 5px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 12px;
      background: #007bff;
      color: white;
    }

    .btn-small:hover {
      background: #0056b3;
    }

    .btn-small.danger {
      background: #dc3545;
    }

    .btn-small.danger:hover {
      background: #c82333;
    }
  `]
})
export class UserManagementComponent {}
