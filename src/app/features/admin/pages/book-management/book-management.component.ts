import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-book-management',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="management-container">
      <h1>📚 Quản lý sách</h1>
      <div class="actions">
        <button class="btn-primary">➕ Thêm sách mới</button>
        <button class="btn-secondary">📤 Nhập từ Excel</button>
      </div>
      <div class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th>Tên sách</th>
              <th>Tác giả</th>
              <th>Thể loại</th>
              <th>Lượt xem</th>
              <th>Lượt tải</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Chiếc thuyền ngoài xa</td>
              <td>Nguyễn Nhật Ánh</td>
              <td>Tiểu thuyết</td>
              <td>5,420</td>
              <td>1,200</td>
              <td>
                <button class="btn-small">✏️ Sửa</button>
                <button class="btn-small danger">🗑️ Xóa</button>
              </td>
            </tr>
            <tr>
              <td>Khi đôi ta còn trẻ</td>
              <td>Nguyễn Nhật Ánh</td>
              <td>Tiểu thuyết</td>
              <td>4,320</td>
              <td>980</td>
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
      display: flex;
      gap: 10px;
    }

    .btn-primary, .btn-secondary {
      padding: 10px 20px;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-weight: 600;
      font-size: 14px;
    }

    .btn-primary {
      background: #007bff;
      color: white;
    }

    .btn-primary:hover {
      background: #0056b3;
    }

    .btn-secondary {
      background: #6c757d;
      color: white;
    }

    .btn-secondary:hover {
      background: #545b62;
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
export class BookManagementComponent {}
