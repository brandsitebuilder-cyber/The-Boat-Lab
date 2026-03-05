import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Anchor, Waves, Shield, Zap, ArrowRight } from 'lucide-react';
import Navbar from './components/Navbar';
import ProductCard from './components/ProductCard';
import Success from './pages/Success';
import Cancel from './pages/Cancel';

const PRODUCTS = [
  {
    id: 'cutting-board',
    name: 'Pro-Series Marine Cutting Board',
    price: 65,
    image: 'https://drive.google.com/thumbnail?id=1EHmxNL9sFBGHsLKyRwf4JU4_XVY3ZLWj&sz=w1000',
    description: 'High-density, non-porous marine-grade cutting surface. Designed to stay stable on deck while resisting odors and stains.',
    imageClassName: 'object-bottom scale-[1.4] origin-bottom group-hover:scale-[1.5]'
  },
  {
    id: 'cup-holder',
    name: 'Technical Marine Cup Holder',
    price: 45,
    image: 'https://drive.google.com/thumbnail?id=1-LjdtHq2pk73sKcJ5ISa1dFKoZST7n7L&sz=w1000',
    description: 'Precision-engineered cup holder designed for high-speed stability. Fits standard and oversized containers with secure grip technology.'
  }
];

export default function App() {
  const [path, setPath] = useState(window.location.pathname);

  useEffect(() => {
    const handleLocationChange = () => setPath(window.location.pathname);
    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  if (path === '/success') return <Success />;
  if (path === '/cancel') return <Cancel />;

  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative h-screen flex items-center overflow-hidden pt-28 bg-black">
        <div className="absolute inset-0 z-0">
          <motion.img 
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5 }}
            src="https://drive.google.com/thumbnail?id=1-UpFdNx7cG2n15FGTZ2Mdf83jCQ40mMg&sz=w2000" 
            className="w-full h-full object-cover"
            alt="The Boat Lab Hero Background"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-maritime-navy via-maritime-navy/10 to-transparent"></div>
          <div className="absolute inset-0 bg-maritime-navy/20"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="h-[2px] w-12 bg-golden-yellow"></div>
              <span className="text-golden-yellow font-bold tracking-[0.3em] uppercase text-sm">Maritime Professional</span>
            </div>
            <h1 className="text-6xl md:text-8xl font-black text-white mb-6 tracking-tighter leading-none">
              THE BOAT <span className="text-safety-orange">LAB.</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/80 mb-10 leading-relaxed font-light">
              Upgrade Your Vessel with technical marine gear designed for the most demanding conditions.
            </p>
            <div className="flex flex-wrap gap-4">
              <a href="#shop" className="btn-primary flex items-center gap-2">
                Explore Gear <ArrowRight className="w-5 h-5" />
              </a>
              <a href="#" className="btn-outline border-white text-white hover:bg-white hover:text-maritime-navy">
                Our Story
              </a>
            </div>
          </motion.div>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce hidden md:block">
          <div className="w-6 h-10 border-2 border-maritime-navy/20 rounded-full flex justify-center p-1">
            <div className="w-1 h-2 bg-maritime-navy rounded-full"></div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-maritime-navy/5 rounded-2xl flex items-center justify-center mb-6 text-maritime-navy">
                <Shield className="w-8 h-8 text-golden-yellow" />
              </div>
              <h3 className="text-xl font-bold mb-3">Marine Grade</h3>
              <p className="text-maritime-navy/60">Built to withstand salt, sun, and extreme maritime environments.</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-maritime-navy/5 rounded-2xl flex items-center justify-center mb-6 text-maritime-navy">
                <Waves className="w-8 h-8 text-safety-orange" />
              </div>
              <h3 className="text-xl font-bold mb-3">Waterproof Tech</h3>
              <p className="text-maritime-navy/60">Advanced sealing technology keeping your electronics safe at sea.</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-maritime-navy/5 rounded-2xl flex items-center justify-center mb-6 text-maritime-navy">
                <Zap className="w-8 h-8 text-golden-yellow" />
              </div>
              <h3 className="text-xl font-bold mb-3">High Performance</h3>
              <p className="text-maritime-navy/60">Tested by professionals to ensure reliability when it matters most.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Shop Section */}
      <section id="shop" className="py-24 bg-marine-gray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div>
              <h2 className="text-4xl font-black tracking-tight mb-4">ESSENTIAL GEAR</h2>
              <p className="text-maritime-navy/60 max-w-md">Curated technical add-ons for the modern mariner.</p>
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-white border border-maritime-navy/10 rounded-full text-sm font-bold hover:bg-maritime-navy hover:text-white transition-all">ALL</button>
              <button className="px-4 py-2 bg-white border border-maritime-navy/10 rounded-full text-sm font-bold hover:bg-maritime-navy hover:text-white transition-all">STORAGE</button>
              <button className="px-4 py-2 bg-white border border-maritime-navy/10 rounded-full text-sm font-bold hover:bg-maritime-navy hover:text-white transition-all">LIGHTING</button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {PRODUCTS.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
            
            {/* Placeholder for future products */}
            <div className="border-2 border-dashed border-maritime-navy/10 rounded-2xl flex flex-center items-center justify-center p-12 text-center">
              <div>
                <div className="w-12 h-12 bg-maritime-navy/5 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Anchor className="w-6 h-6 text-maritime-navy/20" />
                </div>
                <p className="text-maritime-navy/40 font-bold uppercase tracking-widest text-xs">More Gear Incoming</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-maritime-navy text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <img 
                  src="https://drive.google.com/thumbnail?id=1lfHgTLJz97bPF0hPCKX_Gpap_wwK-Bsg&sz=w500" 
                  alt="The Boat Lab Logo" 
                  className="h-20 w-auto object-contain"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
                <span className="text-2xl font-black tracking-tighter uppercase">The Boat <span className="text-safety-orange">Lab</span></span>
              </div>
              <p className="text-white/60 max-w-sm mb-8">
                The premier destination for technical marine accessories. Engineered for the ocean, designed for the vessel.
              </p>
              <div className="flex gap-4">
                {/* Social placeholders */}
                <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-golden-yellow transition-colors cursor-pointer">
                  <Waves className="w-5 h-5" />
                </div>
                <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-safety-orange transition-colors cursor-pointer">
                  <Shield className="w-5 h-5" />
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-bold mb-6 uppercase tracking-widest text-sm">Shop</h4>
              <ul className="space-y-4 text-white/60">
                <li><a href="#" className="hover:text-white transition-colors">Cutting Boards</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Spotlights</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Navigation gear</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Safety kits</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-6 uppercase tracking-widest text-sm">Lab</h4>
              <ul className="space-y-4 text-white/60">
                <li><a href="#" className="hover:text-white transition-colors">Our Tech</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Testing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Support</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-white/40">
            <p>© 2026 THE BOAT LAB. ALL RIGHTS RESERVED.</p>
            <div className="flex gap-8">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
