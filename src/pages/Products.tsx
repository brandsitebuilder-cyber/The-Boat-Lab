import React from 'react';
import { Anchor } from 'lucide-react';
import Navbar from '../components/Navbar';
import ProductCard from '../components/ProductCard';
import { PRODUCTS } from '../data/products';

export default function Products() {
  return (
    <div className="min-h-screen bg-marine-gray">
      <Navbar />
      
      <main className="pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">ALL GEAR</h1>
            <p className="text-maritime-navy/60 max-w-2xl text-lg">
              Explore our complete collection of technical marine accessories. Engineered for the ocean, designed for the vessel.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {PRODUCTS.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
            
            {/* Placeholder for future products */}
            <div className="border-2 border-dashed border-maritime-navy/10 rounded-2xl flex flex-col items-center justify-center p-12 text-center min-h-[400px]">
              <div className="w-16 h-16 bg-maritime-navy/5 rounded-full flex items-center justify-center mx-auto mb-4">
                <Anchor className="w-8 h-8 text-maritime-navy/20" />
              </div>
              <p className="text-maritime-navy/40 font-bold uppercase tracking-widest text-sm">More Gear Incoming</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
