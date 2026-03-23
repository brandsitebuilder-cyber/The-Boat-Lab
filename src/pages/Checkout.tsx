import React, { useState } from 'react';
import { Trash2, Plus, Minus, Loader2, ArrowLeft } from 'lucide-react';
import Navbar from '../components/Navbar';
import { useCart } from '../context/CartContext';
import { getStripe } from '../lib/stripe';

export default function Checkout() {
  const { state, updateQuantity, removeFromCart, subtotal, totalItems } = useCart();
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    if (state.items.length === 0) return;
    
    setLoading(true);
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-idempotency-key': crypto.randomUUID()
        },
        body: JSON.stringify({ items: state.items }),
      });
      
      const contentType = response.headers.get("content-type");
      let errorMessage = `Server error: ${response.status}`;
      
      if (contentType && contentType.indexOf("application/json") !== -1) {
        const data = await response.json();
        
        if (response.ok) {
          if (data.sessionId) {
            // Use @stripe/stripe-js to redirect if sessionId is provided
            const stripe = await getStripe();
            if (stripe) {
              const { error } = await (stripe as any).redirectToCheckout({ sessionId: data.sessionId });
              if (error) throw new Error(error.message);
              return;
            }
          }
          
          // Fallback to URL redirect
          if (data.url) {
            window.location.href = data.url;
            return;
          }
        }
        errorMessage = data.error || data.message || errorMessage;
      } else {
        const text = await response.text();
        if (response.status === 500) {
          errorMessage = "Internal Server Error (500). Please check your configuration.";
        }
      }
      
      throw new Error(errorMessage);
    } catch (error: any) {
      console.error('Checkout error details:', error);
      alert(`Checkout Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-marine-gray">
      <Navbar />
      
      <main className="pt-32 pb-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <a href="/" onClick={(e) => {
            e.preventDefault();
            window.history.pushState({}, '', '/');
            window.dispatchEvent(new PopStateEvent('popstate'));
          }} className="inline-flex items-center text-sm font-bold text-maritime-navy/60 hover:text-maritime-navy transition-colors mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            CONTINUE SHOPPING
          </a>
          <h1 className="text-4xl font-black tracking-tight">YOUR CART</h1>
        </div>

        {state.items.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-maritime-navy/5 shadow-sm">
            <p className="text-maritime-navy/60 text-lg mb-6">Your cart is currently empty.</p>
            <a href="/products" onClick={(e) => {
              e.preventDefault();
              window.history.pushState({}, '', '/products');
              window.dispatchEvent(new PopStateEvent('popstate'));
            }} className="btn-primary inline-flex">
              Browse Gear
            </a>
          </div>
        ) : (
          <div className="bg-white rounded-2xl overflow-hidden border border-maritime-navy/5 shadow-sm">
            <div className="p-6 sm:p-8">
              <div className="flow-root">
                <ul className="-my-6 divide-y divide-maritime-navy/10">
                  {state.items.map((item) => (
                    <li key={item.id} className="py-6 flex">
                      <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-maritime-navy/10 bg-marine-gray">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-full w-full object-cover object-center"
                          referrerPolicy="no-referrer"
                        />
                      </div>

                      <div className="ml-4 flex flex-1 flex-col">
                        <div>
                          <div className="flex justify-between text-base font-bold text-maritime-navy">
                            <h3>{item.name}</h3>
                            <p className="ml-4">${(item.price * item.quantity).toFixed(2)}</p>
                          </div>
                          <p className="mt-1 text-sm text-maritime-navy/60">${item.price.toFixed(2)} each</p>
                        </div>
                        <div className="flex flex-1 items-end justify-between text-sm">
                          <div className="flex items-center border border-maritime-navy/20 rounded-lg">
                            <button 
                              onClick={() => updateQuantity(item.id, -1)}
                              className="p-2 hover:bg-maritime-navy/5 transition-colors text-maritime-navy"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="px-4 font-bold">{item.quantity}</span>
                            <button 
                              onClick={() => updateQuantity(item.id, 1)}
                              className="p-2 hover:bg-maritime-navy/5 transition-colors text-maritime-navy"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>

                          <div className="flex">
                            <button
                              type="button"
                              onClick={() => removeFromCart(item.id)}
                              className="font-medium text-safety-orange hover:text-safety-orange/80 flex items-center gap-1"
                            >
                              <Trash2 className="w-4 h-4" />
                              <span>Remove</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="border-t border-maritime-navy/10 bg-marine-gray/30 p-6 sm:p-8">
              <div className="flex justify-between text-lg font-bold text-maritime-navy mb-2">
                <p>Subtotal ({totalItems} items)</p>
                <p>${subtotal.toFixed(2)}</p>
              </div>
              <p className="text-sm text-maritime-navy/60 mb-6">Shipping and taxes calculated at checkout.</p>
              <div className="mt-6">
                <button
                  onClick={handleCheckout}
                  disabled={loading}
                  className="w-full btn-primary flex items-center justify-center gap-2 py-4 text-lg"
                >
                  {loading ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : (
                    'Pay Now'
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
