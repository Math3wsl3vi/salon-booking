import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SparklesIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
const salonImages = ['https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1200&h=600&fit=crop', 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=1200&h=600&fit=crop', 'https://images.unsplash.com/photo-1633681926022-84c23e8cb2d6?w=1200&h=600&fit=crop'];


export default function Hero() {
  const router = useRouter()
  const [currentImage, setCurrentImage] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage(prev => (prev + 1) % salonImages.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);
  return <div className="min-h-screen bg-[#FAF6F3] w-full">
         <section className="relative h-screen w-full bg-[#FAF6F3] overflow-hidden">
      {/* Background Image Slideshow */}
      <div className="absolute inset-0">
        <AnimatePresence mode="wait">
          <motion.img
            key={salonImages[currentImage]}
            src={salonImages[currentImage]}
            alt="Salon"
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 1.5 }}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </AnimatePresence>
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
          Luxe Beauty Salon
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
          className="bg-gradient-to-r from-[#E8B4B8] to-[#f5c6c9] hover:from-[#dba3a8] hover:to-[#e9b8bc] text-[#2C2C2C] font-semibold px-10 py-4 rounded-full text-lg shadow-xl transition-transform duration-300 hover:scale-105"
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

      {/* Dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-20">
        {salonImages.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentImage(i)}
            className={`h-3 rounded-full transition-all duration-500 ${
              currentImage === i ? 'bg-[#E8B4B8] w-8' : 'bg-white/50 w-3'
            }`}
          />
        ))}
      </div>

      {/* Floating Book Button for Mobile */}
      <motion.button
        onClick={() => router.push('/services-page')}
        className="md:hidden fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-r from-[#E8B4B8] to-[#f3c2c6] rounded-full shadow-2xl flex items-center justify-center z-50"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <SparklesIcon className="w-7 h-7 text-white" />
      </motion.button>
    </section>
      {/* Floating Action Button (Mobile) */}
      <motion.button onClick={() => router.push('/services-page')} className="md:hidden fixed bottom-6 right-6 w-16 h-16 bg-[#E8B4B8] rounded-full shadow-2xl flex items-center justify-center z-50" whileHover={{
      scale: 1.1
    }} whileTap={{
      scale: 0.9
    }}>
        <SparklesIcon className="w-6 h-6 text-white" />
      </motion.button>
    </div>;
}