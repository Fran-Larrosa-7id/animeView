import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import type { ChapterData, MangaConfig } from '../models/manga.model';
import { MANGA_LIST } from '../config/manga.config';

@Injectable({ providedIn: 'root' })
export class MangaService {
  private readonly http = inject(HttpClient);

  getMangaList(): MangaConfig[] {
    return MANGA_LIST;
  }

  getMangaById(id: string): MangaConfig | undefined {
    return MANGA_LIST.find((m) => m.id === id);
  }

  getChapter(manga: MangaConfig, chapter: number): Observable<ChapterData> {
    return this.http.get<ChapterData>(`${manga.apiBaseUrl}${chapter}`);
  }
}
