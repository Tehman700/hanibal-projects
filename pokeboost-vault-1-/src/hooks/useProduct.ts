import { useState } from 'react';
import { useParams } from 'react-router-dom';
import products from '../data/products.json';

export interface ProductData {
  id: string;
  name: string;
  set: string;
  price: number;
  originalPrice?: number;
  stock: boolean;
  images: string;
}

export const useProduct = () => {
  const { id } = useParams();
  const [copied, setCopied] = useState(false);
  const [quantity, setQuantity] = useState(1);

  

  const searchedProduct = products.find((prd) => prd.id === id);

  const product: ProductData = {
    id: searchedProduct?.id ?? '',
    name: searchedProduct?.name ?? '',
    set: searchedProduct?.set ?? '',
    price: Number(searchedProduct?.price.toFixed(2)),
    originalPrice: Number(searchedProduct?.originalPrice.toFixed(2)),
    stock: true,
    images: searchedProduct?.image ?? '',
  };

  const handleQuantityChange = (change: number) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1) {
      setQuantity(newQuantity);
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(url);
      } else {
        const el = document.createElement('textarea');
        el.value = url;
        el.setAttribute('readonly', '');
        el.style.position = 'absolute';
        el.style.left = '-9999px';
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
      }
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch (e) {
      // Silently ignore; no toast by default
    }
  };

  return {
    product,
    quantity,
    copied,
    handleQuantityChange,
    handleShare,
  };
};
