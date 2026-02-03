import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="analytics-container">
      <h1>📈 Thống kê & Báo cáo</h1>

      <div class="analytics-grid">
        <div class="chart-card">
          <h2>📊 Lượt xem theo ngày (7 ngày gần đây)</h2>
          <div class="chart-placeholder">
            <p>📈 Biểu đồ sẽ được hiển thị tại đây</p>
            <p>Sử dụng Chart.js hoặc ng2-charts</p>
          </div>
        </div>

        <div class="chart-card">
          <h2>📥 Lượt tải theo ngày</h2>
          <div class="chart-placeholder">
            <p>📈 Biểu đồ sẽ được hiển thị tại đây</p>
          </div>
        </div>

        <div class="chart-card">
          <h2>📚 Top 10 sách được xem</h2>
          <div class="list-placeholder">
            <ol>
              <li>Chiếc thuyền ngoài xa - 5,420 lần</li>
              <li>Sapiens - 4,850 lần</li>
              <li>The Shining - 3,920 lần</li>
              <li>Khi đôi ta còn trẻ - 3,450 lần</li>
              <li>Thương nhớ ở ai - 2,890 lần</li>
            </ol>
          </div>
        </div>

        <div class="chart-card">
          <h2>👥 Thống kê người dùng</h2>
          <div class="stats-list">
            <div class="stat">
              <span>Tổng người dùng:</span>
              <strong>3,840</strong>
            </div>
            <div class="stat">
              <span>Người dùng hoạt động (7 ngày):</span>
              <strong>1,245</strong>
            </div>
            <div class="stat">
              <span>Người dùng mới (hôm nay):</span>
              <strong>42</strong>
            </div>
            <div class="stat">
              <span>Tỷ lệ hoạt động:</span>
              <strong>32.4%</strong>
            </div>
          </div>
        </div>
      </div>

      <div class="export-section">
        <h2>📥 Xuất dữ liệu</h2>
        <div class="export-buttons">
          <button class="btn-export">📊 Xuất Excel (Thống kê tổng)</button>
          <button class="btn-export">📋 Xuất CSV (Chi tiết người dùng)</button>
          <button class="btn-export">📄 Xuất PDF (Báo cáo tháng)</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .analytics-container {
      max-width: 1400px;
      margin: 0 auto;
    }

    h1 {
      color: #333;
      margin-bottom: 30px;
    }

    h2 {
      color: #555;
      font-size: 16px;
      margin: 0 0 15px 0;
    }

    .analytics-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
      gap: 20px;
      margin-bottom: 30px;
    }

    .chart-card {
      background: white;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .chart-placeholder {
      background: #f9f9f9;
      padding: 40px;
      border-radius: 6px;
      text-align: center;
      color: #999;
      min-height: 250px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }

    .list-placeholder {
      background: #f9f9f9;
      padding: 20px;
      border-radius: 6px;
    }

    .list-placeholder ol {
      margin: 0;
      padding-left: 20px;
      color: #666;
    }

    .list-placeholder li {
      padding: 8px 0;
      border-bottom: 1px solid #eee;
    }

    .list-placeholder li:last-child {
      border-bottom: none;
    }

    .stats-list {
      background: #f9f9f9;
      padding: 20px;
      border-radius: 6px;
    }

    .stat {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px 0;
      border-bottom: 1px solid #eee;
      color: #666;
    }

    .stat:last-child {
      border-bottom: none;
    }

    .stat strong {
      color: #007bff;
      font-size: 18px;
    }

    .export-section {
      background: white;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .export-buttons {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
    }

    .btn-export {
      padding: 12px 20px;
      background: #007bff;
      color: white;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-weight: 600;
      font-size: 14px;
      transition: background 0.3s;
    }

    .btn-export:hover {
      background: #0056b3;
    }

    @media (max-width: 768px) {
      .analytics-grid {
        grid-template-columns: 1fr;
      }

      .export-buttons {
        flex-direction: column;
      }

      .btn-export {
        width: 100%;
      }
    }
  `]
})
export class AnalyticsComponent {}
