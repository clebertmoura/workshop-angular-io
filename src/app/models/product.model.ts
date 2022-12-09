export interface IProduct {
  id: number;
  name?: string | null;
  description?: string | null;
  price?: number | null;
  image?: string | null;
  imageContentType?: string | null;
}