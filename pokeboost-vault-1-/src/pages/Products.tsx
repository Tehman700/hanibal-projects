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

// API response interface
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

// Transformed product interface to match your existing structure
interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  set: string;
  category: string;
  isHot?: boolean;
  isNew?: boolean;
}

interface ProductsProps {
  addToCart: (product: Omit<CartItem, 'quantity'>) => void;
}

const Products: React.FC<ProductsProps> = ({ addToCart }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const {
    sortBy,
    viewMode,
    sortedProducts,
    handleSortChange,
    handleViewModeChange,
  } = useProducts(products);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const API_URL = import.meta.env.VITE_API_URL;

        const response = await fetch(`${API_URL}/api/products/`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: ProductAPIItem[] = await response.json();

        // Transform API data to match your existing product structure
        const transformedProducts: Product[] = data.map((apiProduct) => {
          const price = parseFloat(apiProduct.price) || 0;
          const originalPrice = parseFloat(apiProduct.original_price) || 0;

          return {
            id: apiProduct.id.toString(),
            name: apiProduct.name,
            price: price,
            originalPrice: originalPrice > price ? originalPrice : undefined,
            image: apiProduct.image,
            set: apiProduct.category || 'Unknown Set', // Using category as set
            category: apiProduct.category,
            isHot: apiProduct.is_hot,
            isNew: apiProduct.is_new,
          };
        });

        setProducts(transformedProducts);
      } catch (err) {
        console.error('Failed to fetch products:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-pokemon-gray py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ProductsHeader />
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-pokemon-blue"></div>
            <p className="mt-4 text-gray-600">Loading products...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-pokemon-gray py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ProductsHeader />
          <div className="text-center py-8 text-red-600">
            <p className="text-lg font-medium">Error loading products</p>
            <p className="mt-2">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-pokemon-blue text-white rounded hover:bg-blue-600"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

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

        {/* Products Display */}
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