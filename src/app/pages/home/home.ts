import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgOptimizedImage } from '@angular/common';
import { MangaService } from '../../services/manga.service';

@Component({
  selector: 'app-home',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, NgOptimizedImage],
  templateUrl: './home.html',
})
export class Home {
  private readonly mangaService = inject(MangaService);
  readonly mangaList = this.mangaService.getMangaList();
}
