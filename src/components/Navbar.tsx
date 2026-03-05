import React from 'react';
import { Anchor, ShoppingCart, Menu } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 bg-white z-50 border-b border-maritime-navy/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-28">
          <div className="flex items-center gap-3">
            <img 
              src="https://drive.google.com/thumbnail?id=1lfHgTLJz97bPF0hPCKX_Gpap_wwK-Bsg&sz=w500" 
              alt="The Boat Lab Logo" 
              className="h-20 w-auto object-contain mix-blend-multiply contrast-[1.1] brightness-[1.05]"
              referrerPolicy="no-referrer"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.parentElement?.classList.add('flex', 'items-center', 'justify-center');
                const icon = document.createElement('div');
                icon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-maritime-navy"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/><path d="m9 12 2 2 4-4"/></svg>';
                e.currentTarget.parentElement?.appendChild(icon.firstChild as Node);
              }}
            />
            <span className="text-xl font-black tracking-tighter uppercase text-maritime-navy">The Boat <span className="text-safety-orange">Lab</span></span>
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-medium uppercase tracking-widest">
            <a href="#" className="hover:text-safety-orange transition-colors">Vessels</a>
            <a href="#" className="hover:text-safety-orange transition-colors">Gear</a>
            <a href="#" className="hover:text-safety-orange transition-colors">Tech</a>
            <a href="#" className="hover:text-safety-orange transition-colors">Support</a>
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-maritime-navy/5 rounded-full transition-colors relative">
              <ShoppingCart className="w-6 h-6" />
              <span className="absolute top-0 right-0 w-4 h-4 bg-golden-yellow text-maritime-navy text-[10px] flex items-center justify-center rounded-full font-bold">0</span>
            </button>
            <button className="md:hidden p-2 hover:bg-maritime-navy/5 rounded-full transition-colors">
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
