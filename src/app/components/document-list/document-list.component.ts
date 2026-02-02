import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { DocumentService } from '../../shared/services/document.service';
import { DocumentListDto } from '../../models/book.model';

@Component({
    selector: 'app-document-list',
    standalone: true,
    imports: [CommonModule, RouterModule],
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

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private documentService: DocumentService,
        private location: Location
    ) { }

    ngOnInit(): void {
        this.route.queryParams.subscribe(params => {
            this.currentPage = params['page'] ? +params['page'] : 1;
            this.updateTitle(params);
            this.loadData(params);
        });
    }

    goBack() {
    this.location.back();
  }

    loadData(params: any) {
        this.isLoading = true;
        const queryParams = {
            ...params,
            page: this.currentPage,
            pageSize: this.pageSize
        };

        console.log("page size:", this.pageSize);

        this.documentService.getDocuments(queryParams).subscribe({
            next: (res) => {
                this.documents = res.data;
                this.totalPages = res.totalPages;
                this.totalItems = res.totalItems;
                this.isLoading = false;
                window.scrollTo(0, 0); 
            },
            error: () => this.isLoading = false
        });
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
        const sortBy = params['sortBy'];

        if (sortBy === 'trending') {
            this.listTitle = 'Tài liệu đang xu hướng';
        } else if (sortBy === 'popular') {
            this.listTitle = 'Tài liệu tải nhiều nhất';
        } else if (sortBy === 'newest') {
            this.listTitle = 'Tài liệu mới nhất';
        } else if (params['keyword']) {
            this.listTitle = `Kết quả cho: "${params['keyword']}"`;
        } else {
            this.listTitle = 'Kho tài liệu';
        }
    }

    onImgError(event: any) {
        event.target.src = '/assets/images/default-book.png';
    }
}