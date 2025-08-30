import React, { useEffect, useState } from 'react';
import { CartItem } from '../App';
import { useProducts } from '../hooks/useProducts';
import {
  ProductsHeader,
  ProductsControls,
  ProductsGrid,
  ProductsList,
  NoResults,
} from '../components/products';

interface ProductAPIItem {
  id: number;
  name: string;
  price: string;
  original_price: string;
  image: string;
  description: string;
  category: string;
  is_hot: boolean;
  is_new: boolean;
}

interface ProductWithDiscount {
  id: number;
  name: string;
  price: number;
  originalPrice: number;
  discount: number;
  image: string;
  description: string;
  category: string;
  is_hot: boolean;
  is_new: boolean;
}

interface ProductsProps {
  addToCart: (product: Omit<CartItem, 'quantity'>) => void;
}

const Products: React.FC<ProductsProps> = ({ addToCart }) => {
  const [products, setProducts] = useState<ProductWithDiscount[]>([]);
  const {
    sortBy,
    viewMode,
    sortedProducts,
    handleSortChange,
    handleViewModeChange,
  } = useProducts(products);

const API_URL = import.meta.env.VITE_API_URL;

useEffect(() => {
  fetch(`${API_URL}/api/products`)  // ✅ Correct string interpolation
    .then((res) => res.json())
    .then((data: ProductAPIItem[]) => {
      const productsWithDiscount: ProductWithDiscount[] = data.map((p) => {
        const price = parseFloat(p.price);
        const originalPrice = parseFloat(p.original_price);
        const discount =
          originalPrice > price
            ? Math.round(((originalPrice - price) / originalPrice) * 100)
            : 0;

        return {
          id: p.id,
          name: p.name,
          price,
          originalPrice,
          discount,
          image: p.image,
          description: p.description,
          category: p.category,
          is_hot: p.is_hot,
          is_new: p.is_new,
        };
      });

      setProducts(productsWithDiscount);
    })
    .catch((err) => console.error("Failed to fetch products:", err));
}, []);



  return (
    <div className="min-h-screen bg-pokemon-gray py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ProductsHeader />
        <ProductsControls
          sortBy={sortBy}
          viewMode={viewMode}
          onSortChange={handleSortChange}
          onViewModeChange={handleViewModeChange}
        />
        {sortedProducts.length > 0 ? (
          viewMode === 'grid' ? (
            <ProductsGrid products={sortedProducts} addToCart={addToCart} />
          ) : (
            <ProductsList products={sortedProducts} addToCart={addToCart} />
          )
        ) : (
          <NoResults />
        )}
      </div>
    </div>
  );
};

export default Products;
