import type { MangaConfig } from '../models/manga.model';

export const MANGA_LIST: MangaConfig[] = [
  {
    id: 'comic-solo_leveling_1691379040764',
    title: 'Solo Leveling',
    coverImage: 'sololeveling.jpeg',
    totalChapters: 200,
    apiBaseUrl:
      'https://manhwawebbackend-production.up.railway.app/chapters/see/comic-solo_leveling_1691379040764-',
  },
  {
    id: 'jujutsu-kaisen_1692934515995',
    title: 'Jujutsu Kaisen',
    coverImage: 'jujutsu-kaisen.avif',
    totalChapters: 271,
    apiBaseUrl:
      'https://manhwawebbackend-production.up.railway.app/chapters/see/jujutsu-kaisen_1692934515995-',
  },
];
