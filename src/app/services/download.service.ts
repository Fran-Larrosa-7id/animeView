import { Injectable, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import JSZip from 'jszip';
import { MangaService } from './manga.service';
import type { MangaConfig } from '../models/manga.model';

export interface DownloadState {
  isDownloading: boolean;
  chapterNum: number | null;
  current: number;
  total: number;
  error: string | null;
}

@Injectable({ providedIn: 'root' })
export class DownloadService {
  private readonly mangaService = inject(MangaService);

  readonly state = signal<DownloadState>({
    isDownloading: false,
    chapterNum: null,
    current: 0,
    total: 0,
    error: null,
  });

  private async fetchWithRetry(url: string, retries = 4, delayMs = 600): Promise<Response> {
    for (let attempt = 0; attempt <= retries; attempt++) {
      const response = await fetch(url);
      if (response.ok) return response;
      if (attempt < retries) {
        await new Promise((resolve) => setTimeout(resolve, delayMs * Math.pow(2, attempt)));
      } else {
        throw new Error(`HTTP ${response.status} al descargar ${url}`);
      }
    }
    throw new Error('Error inesperado en fetchWithRetry');
  }

  async downloadChapter(manga: MangaConfig, chapterNum: number): Promise<void> {
    if (this.state().isDownloading) return;

    this.state.set({ isDownloading: true, chapterNum, current: 0, total: 0, error: null });

    try {
      const chapterData = await firstValueFrom(this.mangaService.getChapter(manga, chapterNum));
      const images = chapterData.chapter.img;

      this.state.set({
        isDownloading: true,
        chapterNum,
        current: 0,
        total: images.length,
        error: null,
      });

      const zip = new JSZip();
      const folder = zip.folder(`${manga.title} - Capítulo ${chapterNum}`)!;

      for (let i = 0; i < images.length; i++) {
        const url = images[i];
        if (i > 0) await new Promise((resolve) => setTimeout(resolve, 300));
        const response = await this.fetchWithRetry(url);
        const blob = await response.blob();
        const ext = url.split('.').pop()?.split('?')[0] ?? 'webp';
        folder.file(`${String(i + 1).padStart(3, '0')}.${ext}`, blob);
        this.state.update((s) => ({ ...s, current: i + 1 }));
      }

      const content = await zip.generateAsync({ type: 'blob' });
      const anchor = document.createElement('a');
      anchor.href = URL.createObjectURL(content);
      anchor.download = `${manga.title} - Capítulo ${chapterNum}.zip`;
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
      URL.revokeObjectURL(anchor.href);

      this.state.set({
        isDownloading: false,
        chapterNum: null,
        current: images.length,
        total: images.length,
        error: null,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error desconocido al descargar';
      this.state.set({
        isDownloading: false,
        chapterNum: null,
        current: 0,
        total: 0,
        error: message,
      });
    }
  }

  clearError(): void {
    this.state.update((s) => ({ ...s, error: null }));
  }
}
