export interface FeaturedProduct {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  set: string;
  isHot?: boolean;
  isNew?: boolean;
  category?: string;
}
export const featuredProducts: FeaturedProduct[] = [
];
