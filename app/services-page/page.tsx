'use client'
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ScissorsIcon, SparklesIcon, HeartIcon, SearchIcon, PlusIcon, MinusIcon, ArrowLeftIcon, CheckIcon } from 'lucide-react';
import { useBooking } from '@/context/BookingContext';
import { useRouter } from 'next/navigation';
const categories = ['All', 'Hair', 'Nails', 'Skin', 'Spa'];
const allServices = [{
  id: '1',
  name: 'Haircut & Styling',
  category: 'Hair',
  price: 1500,
  duration: 45,
  description: 'Professional cut and style',
  image: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=400&h=300&fit=crop'
}, {
  id: '2',
  name: 'Hair Coloring',
  category: 'Hair',
  price: 3500,
  duration: 120,
  description: 'Full color treatment',
  image: 'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?w=400&h=300&fit=crop'
}, {
  id: '3',
  name: 'Balayage',
  category: 'Hair',
  price: 4500,
  duration: 180,
  description: 'Hand-painted highlights',
  image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&h=300&fit=crop'
}, {
  id: '4',
  name: 'Keratin Treatment',
  category: 'Hair',
  price: 5000,
  duration: 150,
  description: 'Smoothing treatment',
  image: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=400&h=300&fit=crop'
}, {
  id: '5',
  name: 'Manicure',
  category: 'Nails',
  price: 1000,
  duration: 30,
  description: 'Classic nail care',
  image: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400&h=300&fit=crop'
}, {
  id: '6',
  name: 'Pedicure',
  category: 'Nails',
  price: 1200,
  duration: 45,
  description: 'Foot spa and nail care',
  image: 'https://images.unsplash.com/photo-1610992015732-2449b76344bc?w=400&h=300&fit=crop'
}, {
  id: '7',
  name: 'Gel Nails',
  category: 'Nails',
  price: 2000,
  duration: 60,
  description: 'Long-lasting gel polish',
  image: 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?w=400&h=300&fit=crop'
}, {
  id: '8',
  name: 'Facial Treatment',
  category: 'Skin',
  price: 2500,
  duration: 60,
  description: 'Rejuvenating facial',
  image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=400&h=300&fit=crop'
}, {
  id: '9',
  name: 'Deep Cleansing Facial',
  category: 'Skin',
  price: 3000,
  duration: 75,
  description: 'Intensive skin cleansing',
  image: 'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=400&h=300&fit=crop'
}, {
  id: '10',
  name: 'Anti-Aging Treatment',
  category: 'Skin',
  price: 4000,
  duration: 90,
  description: 'Advanced anti-aging care',
  image: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=400&h=300&fit=crop'
}, {
  id: '11',
  name: 'Swedish Massage',
  category: 'Spa',
  price: 3500,
  duration: 60,
  description: 'Relaxing full body massage',
  image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400&h=300&fit=crop'
}, {
  id: '12',
  name: 'Hot Stone Massage',
  category: 'Spa',
  price: 4500,
  duration: 90,
  description: 'Therapeutic stone massage',
  image: 'https://images.unsplash.com/photo-1600334129128-685c5582fd35?w=400&h=300&fit=crop'
}];
export default function ServicesPage() {
    const router = useRouter()
  const {
    selectedServices,
    addService,
    removeService,
    updateServiceQuantity,
    getTotalPrice
  } = useBooking();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const filteredServices = allServices.filter(service => {
    const matchesCategory = selectedCategory === 'All' || service.category === selectedCategory;
    const matchesSearch = service.name.toLowerCase().includes(searchQuery.toLowerCase()) || service.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });
  const getServiceQuantity = (serviceId: string) => {
    const service = selectedServices.find(s => s.id === serviceId);
    return service ? service.quantity : 0;
  };
  const handleContinue = () => {
    if (selectedServices.length > 0) {
      router.push('/stylist');
    }
  };
  return <div className="min-h-screen bg-[#FAF6F3] w-full pb-32 mt-20">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4 mb-5">
            <button onClick={() => router.push('/')} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <ArrowLeftIcon className="w-6 h-6 text-[#2C2C2C]" />
            </button>
            <h1 className="text-3xl font-serif text-[#2C2C2C]" style={{
            fontFamily: 'Playfair Display, serif'
          }}>
              Choose Your Services
            </h1>
          </div>
          {/* Search Bar */}
          <div className="relative">
            <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input type="text" placeholder="Search services..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-[#E8B4B8] transition-all" />
          </div>
        </div>
      </div>
      {/* Category Filters */}
      <div className="sticky top-[140px] bg-[#FAF6F3] z-30 py-4 px-4 border-b border-gray-200">
        <div className="max-w-7xl mx-auto flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map(category => <button key={category} onClick={() => setSelectedCategory(category)} className={`px-6 py-2 rounded-full font-medium whitespace-nowrap transition-all duration-300 ${selectedCategory === category ? 'bg-[#E8B4B8] text-white shadow-md' : 'bg-white text-[#2C2C2C] hover:bg-gray-100'}`}>
              {category}
            </button>)}
        </div>
      </div>
      {/* Services Grid */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service, index) => {
          const quantity = getServiceQuantity(service.id);
          const isSelected = quantity > 0;
          return <motion.div key={service.id} className={`bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 ${isSelected ? 'ring-2 ring-[#E8B4B8]' : ''}`} initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            delay: index * 0.05
          }}>
                <div className="relative h-48 overflow-hidden">
                  <img src={service.image} alt={service.name} className="w-full h-full object-cover" />
                  {isSelected && <div className="absolute top-4 right-4 w-8 h-8 bg-[#E8B4B8] rounded-full flex items-center justify-center shadow-lg">
                      <CheckIcon className="w-5 h-5 text-white" />
                    </div>}
                </div>
                <div className="p-6">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-xl font-semibold text-[#2C2C2C]">
                      {service.name}
                    </h3>
                    <span className="text-sm text-gray-500">
                      {service.duration} min
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-4">
                    {service.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-[#E8B4B8] font-bold text-xl">
                      KSH {service.price.toLocaleString()}
                    </span>
                    {quantity === 0 ? <button onClick={() => addService({
                  ...service,
                  quantity: 1
                })} className="bg-[#E8B4B8] hover:bg-[#d9a5a9] text-white px-4 py-2 rounded-full flex items-center gap-2 transition-all duration-300 transform hover:scale-105">
                        <PlusIcon className="w-4 h-4" />
                        Add
                      </button> : <div className="flex items-center gap-3 bg-[#E8B4B8]/10 rounded-full px-2 py-1">
                        <button onClick={() => updateServiceQuantity(service.id, quantity - 1)} className="w-8 h-8 bg-[#E8B4B8] hover:bg-[#d9a5a9] text-white rounded-full flex items-center justify-center transition-all">
                          <MinusIcon className="w-4 h-4" />
                        </button>
                        <span className="font-semibold text-[#2C2C2C] w-6 text-center">
                          {quantity}
                        </span>
                        <button onClick={() => updateServiceQuantity(service.id, quantity + 1)} className="w-8 h-8 bg-[#E8B4B8] hover:bg-[#d9a5a9] text-white rounded-full flex items-center justify-center transition-all">
                          <PlusIcon className="w-4 h-4" />
                        </button>
                      </div>}
                  </div>
                </div>
              </motion.div>;
        })}
        </div>
      </div>
      {/* Sticky Bottom Bar */}
      {selectedServices.length > 0 && <motion.div className="fixed bottom-0 left-0 right-0 bg-white shadow-2xl border-t border-gray-200 z-50" initial={{
      y: 100
    }} animate={{
      y: 0
    }} transition={{
      type: 'spring',
      damping: 20
    }}>
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-sm text-gray-600">
                  {selectedServices.length} service
                  {selectedServices.length > 1 ? 's' : ''} selected
                </p>
                <p className="text-2xl font-bold text-[#2C2C2C]">
                  KSH {getTotalPrice().toLocaleString()}
                </p>
              </div>
              <button onClick={handleContinue} className="bg-[#E8B4B8] hover:bg-[#d9a5a9] text-white px-8 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105">
                Continue
              </button>
            </div>
          </div>
        </motion.div>}
    </div>;
}