import React from 'react';

interface ProductBadgesProps {
  isHot?: boolean;
  isNew?: boolean;
  originalPrice?: number;
  price?: number;
}

const ProductBadges: React.FC<ProductBadgesProps> = ({
  isHot,
  isNew,
  originalPrice,
  price,
}) => {
  // Show save badge if originalPrice > price
  const showSaveBadge =
    originalPrice !== undefined &&
    price !== undefined &&
    originalPrice > price;

  // Calculate saved amount
  const savedAmount = showSaveBadge ? originalPrice! - price! : 0;

  return (
    <div className="absolute top-2 left-2 flex flex-col space-y-1">
        {isHot && (
          <span className="bg-red-700 text-white text-xs font-bold px-2 py-1 rounded">
            HOT 🔥
          </span>
        )}
      {isNew && (
        <span className="bg-pokemon-blue text-white text-xs font-bold px-2 py-1 rounded">
          NEW
        </span>
      )}
      {showSaveBadge && (
        <span className="bg-pokemon-red text-white text-xs font-bold px-2 py-1 rounded">
            Save ${Math.round(savedAmount)} USD
        </span>
      )}
    </div>
  );
};

export default ProductBadges;
