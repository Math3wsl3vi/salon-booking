import React from 'react';
import { motion } from 'framer-motion';
import { SparklesIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Hero() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#FAF6F3] w-full">
      <section className="relative h-screen w-full bg-[#FAF6F3] overflow-hidden">
        {/* Static Background Image */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170"
            alt="Salon"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/70" />
        </div>

        {/* Content */}
        <div className="relative z-10 h-full flex flex-col justify-center items-center text-center text-white px-6">
          <motion.h1
            className="text-5xl md:text-7xl font-serif mb-4 leading-tight"
            style={{ fontFamily: 'Playfair Display, serif' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            Maison de Beauté Salon
          </motion.h1>

          <motion.p
            className="text-lg md:text-2xl max-w-2xl text-white/90 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            Elevate your style. Rejuvenate your confidence. Where beauty meets excellence.
          </motion.p>

          <motion.button
            onClick={() => router.push('/services-page')}
            className="bg-black text-white rounded-md px-10 py-4 text-lg shadow-xl transition-transform duration-300 hover:scale-105"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            Book Your Appointment
          </motion.button>

          {/* Sparkling Accent */}
          <motion.div
            className="absolute top-10 right-10 hidden md:flex items-center gap-2 text-[#f0d8da]"
            animate={{ opacity: [0.6, 1, 0.6], scale: [1, 1.05, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <SparklesIcon className="w-5 h-5" />
            <span className="text-sm tracking-wide uppercase">Luxury Redefined</span>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
