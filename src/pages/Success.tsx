import React from 'react';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

export default function Success() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-marine-gray p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-white p-8 rounded-3xl shadow-2xl text-center"
      >
        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10" />
        </div>
        <h1 className="text-3xl font-black mb-4 tracking-tight">Vessel Upgraded!</h1>
        <p className="text-maritime-navy/60 mb-8">
          Your order has been confirmed. We're preparing your gear for its maiden voyage.
        </p>
        <a href="/" className="btn-primary inline-flex items-center gap-2">
          Return to Lab <ArrowRight className="w-5 h-5" />
        </a>
      </motion.div>
    </div>
  );
}
