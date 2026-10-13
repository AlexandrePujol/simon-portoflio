export type Photo = {
  id: string;
  src: string;
  mobileSrc?: string;
  alt: string;
  dominantColor?: string;
  caption?: Caption;
  aspectRatio?: number;
};

export type ExtendedPhoto = Photo & {
  date: string;
  group: string;
  capitalizedTitle: string;
  aspectRatio: number;
  place: string;
};

export type Caption = {
  idx?: string;
  title?: string;
  place?: string;
  date?: string;
};

export type PhotoInfo = {
  title: string;
  place: string;
  date: string;
};
