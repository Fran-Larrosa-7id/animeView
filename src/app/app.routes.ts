import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home').then((m) => m.Home),
  },
  {
    path: 'manga/:mangaId',
    loadComponent: () => import('./pages/manga-detail/manga-detail').then((m) => m.MangaDetail),
  },
  {
    path: 'manga/:mangaId/chapter/:chapter',
    loadComponent: () => import('./pages/chapter-reader/chapter-reader').then((m) => m.ChapterReader),
  },
  { path: '**', redirectTo: '' },
];
