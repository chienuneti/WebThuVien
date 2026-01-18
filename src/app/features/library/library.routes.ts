import { Routes } from '@angular/router';

export const LIBRARY_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/library-list/library-list.component').then(m => m.LibraryListComponent)
  },
  {
    path: 'book/:id',
    loadComponent: () => import('./pages/book-detail/book-detail.component').then(m => m.BookDetailComponent)
  },
  {
    path: 'read/:id',
    loadComponent: () => import('./pages/book-reader/book-reader.component').then(m => m.BookReaderComponent)
  },
  {
    path: 'favorites',
    loadComponent: () => import('./pages/favorites/favorites.component').then(m => m.FavoritesComponent)
  },
  {
    path: 'read-history',
    loadComponent: () => import('./pages/read-history/read-history.component').then(m => m.ReadHistoryComponent)
  }
];
