import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgOptimizedImage } from '@angular/common';
import { MangaService } from '../../services/manga.service';
import { DownloadService } from '../../services/download.service';

@Component({
  selector: 'app-manga-detail',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, NgOptimizedImage],
  templateUrl: './manga-detail.html',
})
export class MangaDetail {
  readonly mangaId = input.required<string>();

  private readonly mangaService = inject(MangaService);
  readonly downloadService = inject(DownloadService);

  readonly manga = computed(() => this.mangaService.getMangaById(this.mangaId()));

  readonly chapters = computed(() => {
    const m = this.manga();
    if (!m) return [];
    return Array.from({ length: m.totalChapters }, (_, i) => i + 1);
  });

  download(chapterNum: number): void {
    const m = this.manga();
    if (m) this.downloadService.downloadChapter(m, chapterNum);
  }
}
