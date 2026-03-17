export interface ChapterData {
  name: string;
  erotico: string;
  chapter: {
    chapter: number;
    img: string[];
    joint: string[];
  };
  _id: string;
  real_id: string;
  roto: string;
}

export interface MangaConfig {
  id: string;
  title: string;
  coverImage: string;
  totalChapters: number;
  apiBaseUrl: string;
}
