import React from 'react';

interface ProductHeaderProps {
  set: string;
  name: string;
  price: number;
  originalPrice?: number;
}

const ProductHeader: React.FC<ProductHeaderProps> = ({
  set,
  name,
  price,
  originalPrice,
}) => {
  return (
    <div className="mb-4">
      <p className="text-pokemon-blue font-semibold text-sm mb-2">{set}</p>
      <h1 className="text-2xl md:text-3xl font-bold text-pokemon-dark mb-4">
        {name}
      </h1>

      <div className="flex items-center space-x-4 mb-6">
        {originalPrice && originalPrice > 20 && (
          <span className={`text-sm text-gray-500 line-through`}>
            ${originalPrice?.toFixed(2)} USD
          </span>
        )}

        <span className=" text-pokemon-red text-lg font-bold">
          ${price.toFixed(2)} USD
        </span>
      </div>
    </div>
  );
};

export default ProductHeader;
