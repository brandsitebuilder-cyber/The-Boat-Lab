import React, { useState } from 'react';
import { ShoppingCart, Loader2 } from 'lucide-react';

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
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    console.log('Initiating checkout for:', product.name);
    setLoading(true);

    // If a direct Stripe Payment Link is provided, use it immediately
    if (product.stripeLink) {
      console.log('Redirecting to direct Stripe Payment Link:', product.stripeLink);
      window.location.href = product.stripeLink;
      return;
    }

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-idempotency-key': crypto.randomUUID() // Send idempotency key from client
        },
        body: JSON.stringify({ items: [{ id: product.id, quantity: 1 }] }),
      });
      
      console.log('Response status:', response.status);
      
      const contentType = response.headers.get("content-type");
      let errorMessage = `Server error: ${response.status}`;
      
      if (contentType && contentType.indexOf("application/json") !== -1) {
        const data = await response.json();
        console.log('Response data:', data);
        
        if (response.ok && data.url) {
          console.log('Redirecting to:', data.url);
          window.location.href = data.url;
          return;
        }
        errorMessage = data.error || data.message || errorMessage;
      } else {
        const text = await response.text();
        console.error('Non-JSON response received:', text);
        // If it's a 500 and we got HTML, it's likely a Vercel crash or missing env var
        if (response.status === 500) {
          errorMessage = "Internal Server Error (500). This usually means a crash on the server or missing Environment Variables in Vercel.";
        }
      }
      
      throw new Error(errorMessage);
    } catch (error: any) {
      console.error('Checkout error details:', error);
      alert(`Checkout Error: ${error.message}\n\nIf you are on Vercel, please check your Vercel Logs for the exact error.`);
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
