import React, { useState } from 'react';
import { ShoppingCart, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  hoverImage?: string;
  description: string;
  imageClassName?: string;
  stripeLink?: string;
}

export default function ProductCard({ product }: { product: Product, key?: string }) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  const handleAddToCart = () => {
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-maritime-navy/5">
      <div className="aspect-square overflow-hidden bg-marine-gray relative">
        <img 
          src={product.image} 
          alt={product.name}
          className={`absolute inset-0 w-full h-full object-cover transition-all duration-500 ${product.hoverImage ? 'group-hover:opacity-0' : 'group-hover:scale-110'} ${product.imageClassName || ''}`}
          referrerPolicy="no-referrer"
        />
        {product.hoverImage && (
          <img 
            src={product.hoverImage} 
            alt={`${product.name} alternate view`}
            className={`absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-all duration-500 group-hover:scale-110 ${product.imageClassName || ''}`}
            referrerPolicy="no-referrer"
          />
        )}
        <div className="absolute top-4 right-4 bg-golden-yellow text-maritime-navy px-3 py-1 rounded-full text-xs font-bold tracking-wider z-10">
          NEW ARRIVAL
        </div>
      </div>
      
      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-bold tracking-tight">{product.name}</h3>
          <span className="text-xl font-black text-maritime-navy">${product.price}</span>
        </div>
        <p className="text-sm text-maritime-navy/60 mb-6 line-clamp-2">
          {product.description}
        </p>
        
        <button 
          onClick={handleAddToCart}
          disabled={added}
          className={`w-full flex items-center justify-center gap-2 transition-all duration-300 ${
            added 
              ? 'bg-green-500 text-white py-3 rounded-lg font-bold' 
              : 'btn-primary'
          }`}
        >
          {added ? (
            <>
              <Check className="w-5 h-5" />
              Added to Cart
            </>
          ) : (
            <>
              <ShoppingCart className="w-5 h-5" />
              Add to Cart
            </>
          )}
        </button>
      </div>
    </div>
  );
}
