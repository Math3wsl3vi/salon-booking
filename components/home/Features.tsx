"use client";

import { ScissorsIcon, SparklesIcon, DropletsIcon, LeafIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import React from 'react';

const services = [
  {
    id: '1',
    name: 'Haircut & Styling',
    icon: ScissorsIcon,
    price: 1500,
    description: 'Transform your look with a tailored cut and perfect finish.',
  },
  {
    id: '2',
    name: 'Hair Coloring',
    icon: SparklesIcon,
    price: 3500,
    description: 'Add vibrance and personality with expert coloring treatments.',
  },
  {
    id: '3',
    name: 'Manicure & Pedicure',
    icon: DropletsIcon,
    price: 2000,
    description: 'Pamper your hands and feet with our complete nail care.',
  },
  {
    id: '4',
    name: 'Facial Treatment',
    icon: LeafIcon,
    price: 2500,
    description: 'Rejuvenate your skin with our soothing facial therapy.',
  },
];

const Featured = () => {
  return (
    <section className="py-20 px-6 md:px-10 bg-[#FAF6F3]">
      {/* Section Header */}
      <motion.div
        className="text-center mb-14"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <h2
          className="text-4xl md:text-5xl font-serif mb-3 text-[#2C2C2C]"
          style={{ fontFamily: 'Playfair Display, serif' }}
        >
          Our Signature Services
        </h2>
        <p className="text-gray-600 text-lg">
          Indulge in luxury. Experience beauty crafted with care.
        </p>
      </motion.div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
        {services.map((service, index) => (
          <motion.div
            key={service.id}
            className="relative group bg-white rounded-2xl p-8 shadow-md hover:shadow-2xl transition-all duration-500 cursor-pointer overflow-hidden"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.15, duration: 0.6 }}
            viewport={{ once: true }}
            whileHover={{ y: -8 }}
          >
            {/* Soft gradient hover effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#E8B4B8]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />

            {/* Icon */}
            <div className="relative z-10 w-14 h-14 bg-[#E8B4B8]/20 rounded-full flex items-center justify-center mb-6 group-hover:bg-[#E8B4B8] transition-colors duration-500">
              <service.icon className="w-7 h-7 text-[#E8B4B8] group-hover:text-white transition-colors duration-500" />
            </div>

            {/* Service Name */}
            <h3 className="text-xl font-semibold mb-3 text-[#2C2C2C] relative z-10">
              {service.name}
            </h3>

            {/* Description */}
            <p className="text-gray-600 text-sm mb-5 relative z-10 leading-relaxed">
              {service.description}
            </p>

            {/* Price Tag */}
            <div className="flex items-center justify-between relative z-10">
              <span className="text-[#E8B4B8] font-bold text-lg">
                KSH {service.price.toLocaleString()}
              </span>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-1.5 text-sm font-medium bg-[#E8B4B8]/90 text-white rounded-full shadow-sm hover:bg-[#dba3a8] transition-colors"
              >
                Book Now
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Featured;
