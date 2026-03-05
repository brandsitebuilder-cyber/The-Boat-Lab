import React, { useState } from 'react';
import { ShoppingCart, Loader2 } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  imageClassName?: string;
}

export default function ProductCard({ product }: { product: Product, key?: string }) {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: [product] }),
      });
      const { url } = await response.json();
      if (url) window.location.href = url;
    } catch (error) {
      console.error('Checkout error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-maritime-navy/5">
      <div className="aspect-square overflow-hidden bg-marine-gray relative">
        <img 
          src={product.image} 
          alt={product.name}
          className={`w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ${product.imageClassName || ''}`}
          referrerPolicy="no-referrer"
        />
        <div className="absolute top-4 right-4 bg-golden-yellow text-maritime-navy px-3 py-1 rounded-full text-xs font-bold tracking-wider">
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
          onClick={handleCheckout}
          disabled={loading}
          className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              <ShoppingCart className="w-5 h-5" />
              Buy Now
            </>
          )}
        </button>
      </div>
    </div>
  );
}
