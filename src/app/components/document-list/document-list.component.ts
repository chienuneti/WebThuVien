import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { DocumentService } from '../../shared/services/document.service';
import { DocumentListDto } from '../../models/book.model';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../environments/environment';

@Component({
    selector: 'app-document-list',
    standalone: true,
    imports: [CommonModule, RouterModule, FormsModule],
    templateUrl: './document-list.component.html',
    styleUrl: './document-list.component.css'
})
export class DocumentListComponent implements OnInit {
    documents: DocumentListDto[] = [];
    isLoading = false;
    listTitle = 'Tất cả tài liệu';

    currentPage = 1;
    totalPages = 1;
    pageSize = 8;
    totalItems = 0;
    searchKeyword = '';

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private documentService: DocumentService,
        private location: Location
    ) { }


    ngOnInit(): void {
        this.route.queryParams.subscribe(params => {
            this.currentPage = params['page'] ? + params['page'] : 1;
            this.searchKeyword = params['keyword'] || '';
            this.updateTitle(params);
            this.loadData(params);
        });
    }

    goBack() {
        if (window.history.length > 1) {
            this.location.back();
        } else {
            this.router.navigate(['/library']);
        }
    }

    loadData(params: any) {
        this.isLoading = true;
        const queryParams = {
            ...params,
            page: this.currentPage,
            pageSize: this.pageSize
        };

        const advancedKeys = ['title', 'fromDate', 'toDate', 'keywords', 'degreeLevel', 'discipline', 'advisor', 'faculty', 'subType', 'publisher', 'researchLevel', 'venue', 'pubType'];
        const isAdvanced = Object.keys(params).some(key => advancedKeys.includes(key));

        const apiCall = isAdvanced
            ? this.documentService.getAdvancedDocuments(queryParams)
            : this.documentService.getDocuments(queryParams);

        apiCall.subscribe({
            next: (res: any) => {
                this.documents = res.data.map((doc: any) => ({
                    ...doc,
                    coverPath: this.formatCoverPath(doc.coverPath)
                }));
                this.totalPages = res.totalPages || 1;
                this.totalItems = res.totalItems || 0;
                this.isLoading = false;
                window.scrollTo(0, 0);
            },
            error: (err) => {
                console.error('Lỗi tải dữ liệu:', err);
                this.isLoading = false;
            }
        });
    }

    formatCoverPath(rawPath: string): string {
        if (!rawPath || rawPath[0] === 'a') return '/assets/images/default-cover.png';
        const baseUrl = environment.staticUrl.replace(/\/$/, '');
        const relativePath = rawPath.startsWith('/') ? rawPath.slice(1) : rawPath;
        return `${baseUrl}/${relativePath}`;
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

    updateTitle(params: any) {
        const { type, keyword, faculty, discipline, advisor, title, fromDate, toDate } = params;

        if (faculty || discipline || advisor || title || fromDate || toDate) {
            let label = 'Kết quả tìm kiếm: ';
            if (title) label += ` "${title}"`;
            if (faculty) label += ` | Khoa: ${faculty}`;
            if (discipline) label += ` | Ngành: ${discipline}`;
            this.listTitle = label;
            return;
        }

        if (params['sortBy'] === 'trending') this.listTitle = 'Tài liệu đang xu hướng';
        else if (params['sortBy'] === 'popular') this.listTitle = 'Tài liệu tải nhiều nhất';
        else if (type === 'InternalBook') this.listTitle = 'Sách nội bộ';
        else if (type === 'Thesis') this.listTitle = 'Khóa luận / Đồ án';
        else if (keyword) this.listTitle = `Kết quả cho: "${keyword}"`;
        else this.listTitle = 'Kho tài liệu';
    }

    onImgError(event: any) {
        event.target.src = '/assets/images/default-book.png';
    }



    onSearch(keyword: string): void {
        const value = keyword?.trim();

        const currentParams = this.route.snapshot.queryParams;

        const newParams = {
            ...currentParams,
            keyword: value || null,
            page: 1
        };

        this.router.navigate([], {
            relativeTo: this.route,
            queryParams: newParams,
            queryParamsHandling: 'merge'
        });
    }

}