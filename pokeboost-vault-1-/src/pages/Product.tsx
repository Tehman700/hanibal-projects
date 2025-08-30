import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { CartItem } from '../App';
import {
  ProductImages,
  ProductHeader,
  ProductStock,
  QuantitySelector,
  AddToCartSection,
  TrustBadges,
} from '../components/product';

interface ProductProps {
  addToCart: (product: Omit<CartItem, 'quantity'>) => void;
}

interface ProductType {
  id: number;
  name: string;
  price: string;
  original_price: string;
  image: string;
  description: string;
  stock?: number;
  set?: string;
}

const Product: React.FC<ProductProps> = ({ addToCart }) => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<ProductType | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch(`http://3.94.168.68/api/products/${id}`)
      .then((res) => res.json())
      .then((data) => setProduct(data))
      .catch((err) => console.error('Failed to fetch product:', err));
  }, [id]);

const handleQuantityChange = (change: number) => {
  if (!product) return;
  const newQty = Math.max(1, Math.min(quantity + change, product.stock ?? 10));
  setQuantity(newQty);
};


  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

const handleAddToCart = () => {
  if (!product) return;
  for (let i = 0; i < quantity; i++) {
    addToCart({
      id: product.id.toString(),
      name: product.name,
      price: parseFloat(product.price),
      image: product.image,
      set: product.set ?? '',
    });
  }
};


  if (!product) {
    return (
      <div className="min-h-screen bg-pokemon-gray py-16 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-3xl font-bold text-pokemon-dark mb-4">
            Loading Product...
          </h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-pokemon-gray py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6 lg:p-8">
            <ProductImages image={product.image} name={product.name} />

            <div>
              <ProductHeader
                name={product.name}
                price={parseFloat(product.price)}
                originalPrice={parseFloat(product.original_price)}
                set={product.set ?? ''}
              />

              {/* ✅ Product description */}
              <p className="text-gray-700 mb-4">{product.description}</p>

              <ProductStock stock={product.stock ?? 10} />

              <div className="mb-8">
                <QuantitySelector
                  quantity={quantity}
                  onQuantityChange={handleQuantityChange}
                  stock={product.stock ?? 10}
                />


                <AddToCartSection
                  onAddToCart={handleAddToCart}
                  onShare={handleShare}
                  copied={copied}
                  stock={product.stock ?? 10}
                />
              </div>

              <TrustBadges />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Product;