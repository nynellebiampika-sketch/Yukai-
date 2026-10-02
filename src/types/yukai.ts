export interface GardenView {
  id: number;
  title: string;
  kanji: string;
  subtitle: string;
  index: string;
  description: string;
  image: string;
  quote: string;
  glowProps: {
    gx: string;
    gy: string;
    gr: string;
    gt: string;
    gt2: string;
    gc1: string;
    gc2: string;
    flame?: boolean;
  };
}

export interface SacredCraftLesson {
  id: number;
  num: string;
  title: string;
  kanji: string;
  description: string;
  duration: string;
  image: string;
  contemplation: string;
  details: string[];
}
