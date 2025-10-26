'use client'
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeftIcon, StarIcon, SparklesIcon, ChevronDownIcon, ChevronUpIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useBooking } from '@/context/BookingContext';
import Image from 'next/image';
const stylists = [{
  id: 'any',
  name: 'Any Available Stylist',
  specialty: 'First Available',
  image: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=300&h=300&fit=crop',
  rating: 5.0,
  bio: 'Book with our next available professional for the quickest appointment.',
  expertise: ['All Services']
}, {
  id: '1',
  name: 'Sarah Johnson',
  specialty: 'Hair Specialist',
  image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&h=300&fit=crop',
  rating: 4.9,
  bio: 'With over 10 years of experience, Sarah specializes in cutting-edge hairstyles and color techniques.',
  expertise: ['Haircuts', 'Coloring', 'Styling', 'Balayage']
}, {
  id: '2',
  name: 'Michael Chen',
  specialty: 'Color Expert',
  image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop',
  rating: 4.8,
  bio: 'Michael is renowned for his artistic approach to hair coloring and transformative styles.',
  expertise: ['Balayage', 'Highlights', 'Color Correction', 'Fashion Colors']
}, {
  id: '3',
  name: 'Emily Davis',
  specialty: 'Nail Artist',
  image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop',
  rating: 5.0,
  bio: 'Emily creates stunning nail art and provides exceptional nail care services.',
  expertise: ['Manicures', 'Pedicures', 'Gel Nails', 'Nail Art']
}, {
  id: '4',
  name: 'David Martinez',
  specialty: 'Spa Therapist',
  image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop',
  rating: 4.9,
  bio: 'David brings relaxation and rejuvenation through expert massage and spa treatments.',
  expertise: ['Swedish Massage', 'Hot Stone', 'Deep Tissue', 'Aromatherapy']
}, {
  id: '5',
  name: 'Jessica Lee',
  specialty: 'Skincare Expert',
  image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&h=300&fit=crop',
  rating: 4.9,
  bio: 'Jessica specializes in advanced skincare treatments and facial therapies.',
  expertise: ['Facials', 'Anti-Aging', 'Deep Cleansing', 'Chemical Peels']
}];
export default function StylistPage() {
  const router = useRouter()
  const {
    selectedStylist,
    setSelectedStylist
  } = useBooking();
  const [expandedStylist, setExpandedStylist] = useState<string | null>(null);
  const handleSelectStylist = (stylist: (typeof stylists)[0]) => {
    setSelectedStylist({
      id: stylist.id,
      name: stylist.name,
      specialty: stylist.specialty
    });
  };
  const handleContinue = () => {
    if (selectedStylist) {
      router.push('/datetime');
    }
  };
  const toggleExpand = (stylistId: string) => {
    setExpandedStylist(expandedStylist === stylistId ? null : stylistId);
  };
  return <div className="min-h-screen bg-[#FAF6F3] w-full pb-24 mt-20">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <button onClick={() => router.push('/services-page')} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <ArrowLeftIcon className="w-6 h-6 text-[#2C2C2C]" />
            </button>
            <h1 className="text-3xl font-serif text-[#2C2C2C]" style={{
            fontFamily: 'Playfair Display, serif'
          }}>
              Choose Your Stylist
            </h1>
          </div>
        </div>
      </div>
      {/* Stylists Grid */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stylists.map((stylist, index) => {
          const isSelected = selectedStylist?.id === stylist.id;
          const isExpanded = expandedStylist === stylist.id;
          return <motion.div key={stylist.id} className={`bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 ${isSelected ? 'ring-2 ring-[#E8B4B8]' : ''}`} initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            delay: index * 0.05
          }}>
                <div className="relative">
                  <div className="h-64 overflow-hidden">
                    <Image width={400} height={400} src={stylist.image} alt={stylist.name} className="w-full h-full object-cover" />
                  </div>
                  {stylist.id === 'any' && <div className="absolute top-4 left-4 bg-[#E8B4B8] text-white px-3 py-1 rounded-full flex items-center gap-1">
                      <SparklesIcon className="w-4 h-4" />
                      <span className="text-sm font-medium">Quick Book</span>
                    </div>}
                  {isSelected && <div className="absolute top-4 right-4 w-8 h-8 bg-[#E8B4B8] rounded-full flex items-center justify-center shadow-lg">
                      <motion.div initial={{
                  scale: 0
                }} animate={{
                  scale: 1
                }} transition={{
                  type: 'spring'
                }}>
                        <StarIcon className="w-5 h-5 fill-white text-white" />
                      </motion.div>
                    </div>}
                </div>
                <div className="p-6">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-xl font-semibold text-[#2C2C2C]">
                        {stylist.name}
                      </h3>
                      <p className="text-[#B8C5B1] font-medium">
                        {stylist.specialty}
                      </p>
                    </div>
                    {stylist.id !== 'any' && <div className="flex items-center gap-1 bg-[#E8B4B8]/10 px-2 py-1 rounded-full">
                        <StarIcon className="w-4 h-4 fill-[#E8B4B8] text-[#E8B4B8]" />
                        <span className="text-sm font-semibold text-[#2C2C2C]">
                          {stylist.rating}
                        </span>
                      </div>}
                  </div>
                  <AnimatePresence>
                    {isExpanded && <motion.div initial={{
                  height: 0,
                  opacity: 0
                }} animate={{
                  height: 'auto',
                  opacity: 1
                }} exit={{
                  height: 0,
                  opacity: 0
                }} transition={{
                  duration: 0.3
                }} className="overflow-hidden">
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <p className="text-gray-600 text-sm mb-3">
                            {stylist.bio}
                          </p>
                          <div>
                            <p className="text-sm font-semibold text-[#2C2C2C] mb-2">
                              Expertise:
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {stylist.expertise.map(skill => <span key={skill} className="text-xs bg-[#B8C5B1]/20 text-[#2C2C2C] px-3 py-1 rounded-full">
                                  {skill}
                                </span>)}
                            </div>
                          </div>
                        </div>
                      </motion.div>}
                  </AnimatePresence>
                  <div className="mt-4 flex gap-2">
                    <button onClick={() => handleSelectStylist(stylist)} className={`flex-1 py-3 rounded-full font-semibold transition-all duration-300 ${isSelected ? 'bg-[#E8B4B8] text-white' : 'bg-[#E8B4B8]/10 text-[#E8B4B8] hover:bg-[#E8B4B8]/20'}`}>
                      {isSelected ? 'Selected' : 'Select'}
                    </button>
                    <button onClick={() => toggleExpand(stylist.id)} className="w-12 h-12 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors">
                      {isExpanded ? <ChevronUpIcon className="w-5 h-5 text-[#2C2C2C]" /> : <ChevronDownIcon className="w-5 h-5 text-[#2C2C2C]" />}
                    </button>
                  </div>
                </div>
              </motion.div>;
        })}
        </div>
      </div>
      {/* Continue Button */}
      {selectedStylist && <motion.div className="fixed bottom-0 left-0 right-0 bg-white shadow-2xl border-t border-gray-200 z-50" initial={{
      y: 100
    }} animate={{
      y: 0
    }} transition={{
      type: 'spring',
      damping: 20
    }}>
          <div className="max-w-7xl mx-auto px-4 py-4">
            <button onClick={handleContinue} className="w-full bg-[#E8B4B8] hover:bg-[#d9a5a9] text-white py-4 rounded-full font-semibold text-lg transition-all duration-300 transform hover:scale-105">
              Continue to Date & Time
            </button>
          </div>
        </motion.div>}
    </div>;
}