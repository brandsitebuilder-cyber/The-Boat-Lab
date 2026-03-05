import React from 'react';
import { XCircle, ArrowLeft } from 'lucide-react';
import { motion } from 'motion/react';

export default function Cancel() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-marine-gray p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-white p-8 rounded-3xl shadow-2xl text-center"
      >
        <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <XCircle className="w-10 h-10" />
        </div>
        <h1 className="text-3xl font-black mb-4 tracking-tight">Order Cancelled</h1>
        <p className="text-maritime-navy/60 mb-8">
          The checkout process was interrupted. Your gear is still waiting in the lab.
        </p>
        <a href="/" className="btn-outline inline-flex items-center gap-2">
          <ArrowLeft className="w-5 h-5" /> Back to Shop
        </a>
      </motion.div>
    </div>
  );
}
