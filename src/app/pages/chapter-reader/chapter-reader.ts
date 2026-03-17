import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { MangaService } from '../../services/manga.service';
import { DownloadService } from '../../services/download.service';
import type { ChapterData } from '../../models/manga.model';

type LoadState = 'idle' | 'loading' | 'loaded' | 'error';

@Component({
  selector: 'app-chapter-reader',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  templateUrl: './chapter-reader.html',
})
export class ChapterReader {
  readonly mangaId = input.required<string>();
  readonly chapter = input.required<string>();

  private readonly mangaService = inject(MangaService);
  readonly downloadService = inject(DownloadService);
  private readonly router = inject(Router);

  readonly manga = computed(() => this.mangaService.getMangaById(this.mangaId()));
  readonly chapterNum = computed(() => Number(this.chapter()));

  readonly loadState = signal<LoadState>('idle');
  readonly chapterData = signal<ChapterData | null>(null);

  readonly hasPrev = computed(() => this.chapterNum() > 1);
  readonly hasNext = computed(() => {
    const m = this.manga();
    return !!m && this.chapterNum() < m.totalChapters;
  });

  constructor() {
    effect(() => {
      const manga = this.manga();
      const num = this.chapterNum();
      if (!manga || !num) return;
      this.loadChapter(num);
    });
  }

  private loadChapter(num: number): void {
    const manga = this.manga();
    if (!manga) return;
    this.loadState.set('loading');
    this.chapterData.set(null);
    window.scrollTo({ top: 0 });

    this.mangaService.getChapter(manga, num).subscribe({
      next: (data) => {
        this.chapterData.set(data);
        this.loadState.set('loaded');
      },
      error: () => {
        this.loadState.set('error');
      },
    });
  }

  goToChapter(num: number): void {
    const m = this.manga();
    if (!m) return;
    this.router.navigate(['/manga', m.id, 'chapter', num]);
  }

  download(): void {
    const m = this.manga();
    if (m) this.downloadService.downloadChapter(m, this.chapterNum());
  }
}
