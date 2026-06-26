export interface Chapter {
  id: string;
  number: number;
  title: string;
  role: string;
  description: string;
  colorTheme: string; // e.g., 'blue', 'rose', 'teal', 'purple', 'amber', 'orange', 'emerald', 'indigo'
  accentColor: string; // Tailwind color class e.g. 'text-blue-400'
  bgGradient: string; // Tailwind gradient from-to
  borderColor: string;
  imagesCount: number;
  defaultFooter: string;
}

export interface MemoryNote {
  id: string;
  chapterId: string;
  author: string;
  text: string;
  createdAt: string;
  color: 'yellow' | 'pink' | 'blue' | 'green' | 'orange' | 'purple';
  rotation: number; // degrees of rotation for the sticky note
}

export interface UserPhoto {
  id: string; // e.g., 'varun-0', 'varun-1', etc.
  chapterId: string;
  photoUrl: string; // Base64 or object URL or placeholder
  caption?: string;
}
