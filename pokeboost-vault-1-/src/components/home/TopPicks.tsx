import React, { useEffect, useState } from 'react';
import { ShoppingCart, Eye } from 'lucide-react';
import { CartItem } from '../../App';
import { Link } from 'react-router-dom';
import ProductBadges from '../products/ProductBadges';

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
interface FeaturedProduct {
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

interface TopPicksProps {
  addToCart: (product: Omit<CartItem, 'quantity'>) => void;
}

const TopPicks: React.FC<TopPicksProps> = ({ addToCart }) => {
  const [hotProducts, setHotProducts] = useState<FeaturedProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHotProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const API_URL = import.meta.env.VITE_API_URL;
        const response = await fetch(`${API_URL}/api/products/`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: ProductAPIItem[] = await response.json();
        console.log('API Response:', data);

        // Filter products where is_hot is true and transform them
const hotProductsFiltered: FeaturedProduct[] = data
  .filter((product) => product.is_hot === true)
  .map((apiProduct) => {
    const price = parseFloat(apiProduct.price) || 0;
    const originalPrice = parseFloat(apiProduct.original_price) || 0;

    return {
      id: apiProduct.id.toString(),
      name: apiProduct.name,
      price: price,
      originalPrice: originalPrice > price ? originalPrice : undefined,
      image: apiProduct.image,
      set: apiProduct.category || 'Unknown Set',
      isHot: apiProduct.is_hot,
      isNew: apiProduct.is_new,
      category: apiProduct.category,
    };
  })
  .sort((a, b) => a.name.localeCompare(b.name)); // <-- added sorting


        setHotProducts(hotProductsFiltered);
      } catch (err) {
        console.error('Failed to fetch hot products:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch products');
        setHotProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchHotProducts();
  }, []);

  // Always render the section structure, even during loading
  return (
    <section className="py-16 bg-pokemon-gray">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-press-start text-pokemon-dark mb-4">
            Top Picks
          </h2>
          <p className="text-gray-600 text-lg font-inter max-w-2xl mx-auto">
            Best sellers and customer favorites - don't miss out on these
            popular items!
          </p>
        </div>

        {/* Loading state */}
        {loading && (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-pokemon-blue"></div>
            <p className="mt-4 text-gray-600">Loading hot products...</p>
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="text-center py-8">
            <p className="text-red-600 mb-4">Error: {error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-pokemon-blue text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Products grid */}
        {!loading && !error && hotProducts.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {hotProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 overflow-hidden group"
              >
                <div className="relative flex justify-center">
                  <Link
                    to={`/product/${product.id}`}
                    onClick={() => window.scrollTo(0, 0)}
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-48 group-hover:scale-110 transition-transform duration-300 mt-4"
                    />
                  </Link>

                  <ProductBadges
                    isHot={product.isHot}
                    isNew={product.isNew}
                    originalPrice={product.originalPrice}
                    price={product.price}
                  />

                  <div className="absolute top-2 right-2">
                    <button className="bg-white/80 hover:bg-white p-2 rounded-full shadow-md transition-colors">
                      <Eye className="w-4 h-4 text-pokemon-dark" />
                    </button>
                  </div>
                </div>

                <div className="p-4">
                  <p className="text-xs text-pokemon-blue font-semibold mb-1">
                    {product.set}
                  </p>
                  <Link
                    to={`/product/${product.id}`}
                    onClick={() => window.scrollTo(0, 0)}
                  >
                    <h3 className="font-semibold text-pokemon-dark mb-2 line-clamp-2">
                      {product.name}
                    </h3>
                  </Link>

                  <div className="flex items-center space-x-2 mb-4">
                    {product.originalPrice && (
                      <span className="text-sm text-gray-500 line-through">
                        ${product.originalPrice}
                      </span>
                    )}
                    <span className="text-lg font-bold text-pokemon-red">
                      ${product.price}
                    </span>
                  </div>

                  <button
                    onClick={() => addToCart(product)}
                    className="w-full bg-pokemon-yellow hover:bg-yellow-400 text-pokemon-dark font-bold py-2 px-4 rounded-lg transition-all duration-300 hover:shadow-md flex items-center justify-center space-x-2"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span>Add to Cart</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* No hot products message */}
        {!loading && !error && hotProducts.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-600">No hot products available at the moment.</p>
          </div>
        )}

        <div className="text-center mt-12">
          <Link
            to="/products"
            className="inline-block bg-pokemon-red hover:bg-red-600 text-white font-bold py-3 px-8 rounded-lg transition-all duration-300 hover:shadow-lg"
            onClick={() => window.scrollTo(0, 0)}
          >
            View All Products
          </Link>
        </div>
      </div>
    </section>
  );
};

export default TopPicks;