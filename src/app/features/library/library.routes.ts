import { Routes } from '@angular/router';
import { BrowseListComponent } from '../../components/browse-list/browse-list.component';

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
  { path: 'browse/:category', component: BrowseListComponent }
];
