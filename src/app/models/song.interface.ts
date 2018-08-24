export interface Song {
  id: string;
  title: string;
  artist: string;
  link: string;
  duration: string;
  isPlaying?: boolean;
  currentTime?: string;
  currentPercent?: number;
}
