import { Routes } from '@angular/router';
import { BrowseListComponent } from '../../components/browse-list/browse-list.component';
import { SubmitDocumentComponent } from '../../components/submit-document/submit-document.component';
import { AssignApproveComponent } from './submission-dashboard/assign-approve.component.ts/assign-approve.component';
import { SubmissionDetailComponent } from './submission-dashboard/submission-detail/submission-detail.component';
import { SubmissionDashboardComponent } from './submission-dashboard/submission-dashboard.component.ts';
import { DocumentListComponent } from '../../components/document-list/document-list.component';
import { AdminSubmissionDetailComponent } from './submission-dashboard/admin-submission-detail/admin-submission-detail';
import { ReviewDashboardComponent } from './submission-dashboard/review-dashboard/review-dashboard.component';
import { ReviewWorkflowDetailComponent } from './submission-dashboard/review-workflow-detail/review-workflow-detail.component';
import { ReviewFormDetailComponent } from './submission-dashboard/review-form-detail/review-form-detail.component';

export const LIBRARY_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/library-list/library-list.component').then(m => m.LibraryListComponent)
  },
  {
    path: 'document/:id',
    loadComponent: () => import('./pages/document-detail/document-detail.component').then(m => m.DocumentDetailComponent)
  },
  {
    path: 'read/:id',
    loadComponent: () => import('./pages/book-reader/book-reader.component').then(m => m.BookReaderComponent)
  },
  {
    path: 'read-history',
    loadComponent: () => import('./pages/read-history/read-history.component').then(m => m.ReadHistoryComponent)
  },
  { path: 'browse/:category', component: BrowseListComponent },
  { path: 'list', component: DocumentListComponent },
  { path: 'submit', component: SubmitDocumentComponent },
  { path: 'submission-dashboard', component: SubmissionDashboardComponent },
  { path: 'submission-detail/:id', component: SubmissionDetailComponent },
  { path: 'assign-approve', component: AssignApproveComponent },
  { path: 'admin-submission-detail/:id', component: AdminSubmissionDetailComponent },
  { path: 'review-dashboard', component: ReviewDashboardComponent },
  { path: 'review-workflow/:id', component: ReviewWorkflowDetailComponent },
  { path: 'review-form/:id', component: ReviewFormDetailComponent }
];
