import React from 'react'
import { motion } from 'framer-motion';
import { StarIcon } from 'lucide-react';

const stylists = [{
    id: '1',
    name: 'Sarah Johnson',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&h=300&fit=crop',
    specialty: 'Hair Specialist'
  }, {
    id: '2',
    name: 'Michael Chen',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop',
    specialty: 'Color Expert'
  }, {
    id: '3',
    name: 'Emily Davis',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop',
    specialty: 'Nail Artist'
  }];

const Stylist = () => {
  return (
    <div>
              {/* Meet Our Stylists */}
      <section className="py-16 px-4 md:px-8 max-w-7xl mx-auto bg-white/50 rounded-3xl">
        <h2 className="text-4xl md:text-5xl font-serif text-center mb-4 text-[#2C2C2C]" style={{
        fontFamily: 'Playfair Display, serif'
      }}>
          Meet Our Stylists
        </h2>
        <p className="text-center text-gray-600 mb-12">
          Expert professionals dedicated to your beauty
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stylists.map((stylist, index) => <motion.div key={stylist.id} className="text-center" initial={{
          opacity: 0,
          scale: 0.9
        }} animate={{
          opacity: 1,
          scale: 1
        }} transition={{
          delay: index * 0.1
        }}>
              <div className="w-48 h-48 mx-auto mb-4 rounded-full overflow-hidden border-4 border-[#E8B4B8] shadow-lg">
                <img src={stylist.image} alt={stylist.name} className="w-full h-full object-cover" />
              </div>
              <h3 className="text-2xl font-semibold mb-2 text-[#2C2C2C]">
                {stylist.name}
              </h3>
              <p className="text-[#B8C5B1] font-medium">{stylist.specialty}</p>
              <div className="flex items-center justify-center gap-1 mt-2">
                {[...Array(5)].map((_, i) => <StarIcon key={i} className="w-4 h-4 fill-[#E8B4B8] text-[#E8B4B8]" />)}
              </div>
            </motion.div>)}
        </div>
      </section>
    </div>
  )
}

export default Stylist