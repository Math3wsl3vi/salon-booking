'use client'
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeftIcon, StarIcon, SparklesIcon, ChevronDownIcon, ChevronUpIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useBooking } from '@/context/BookingContext';
import Image from 'next/image';
import { db } from '@/configs/firebaseConfig';
import { collection, onSnapshot, query, where } from 'firebase/firestore';

interface Stylist {
  id: string;
  name: string;
  specialty: string;
  imageUrl: string;
  rating: number;
  bio: string;
  expertise: string[];
  email?: string;
  phone?: string;
  experience?: string;
  status: 'active' | 'inactive';
}

export default function StylistPage() {
  const router = useRouter();
  const {
    selectedStylist,
    setSelectedStylist
  } = useBooking();
  
  const [stylists, setStylists] = useState<Stylist[]>([]);
  const [expandedStylist, setExpandedStylist] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch stylists from Firebase
  useEffect(() => {
    const stylistsRef = collection(db, 'stylists');
    
    // Create a query to only get active stylists
    const q = query(stylistsRef, where('status', '==', 'active'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const stylistsData: Stylist[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      } as Stylist));

      console.log('Fetched stylists:', stylistsData); // Debug log
      
      // Add "Any Available Stylist" option
      const anyStylist: Stylist = {
        id: 'any',
        name: 'Any Available Stylist',
        specialty: 'First Available',
        imageUrl: 'https://images.unsplash.com/photo-1567894340315-735d7c361db0?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fGhhaXIlMjBkcmVzc2VyfGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=400',
        rating: 5.0,
        bio: 'Book with our next available professional for the quickest appointment.',
        expertise: ['All Services'],
        status: 'active'
      };

      setStylists([anyStylist, ...stylistsData]);
      setLoading(false);
    }, (error) => {
      console.error('Error fetching stylists:', error);
      
      // Fallback to "Any Available Stylist" only if there's an error
      const anyStylist: Stylist = {
        id: 'any',
        name: 'Any Available Stylist',
        specialty: 'First Available',
        imageUrl: 'https://images.unsplash.com/photo-1567894340315-735d7c361db0?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fGhhaXIlMjBkcmVzc2VyfGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=400',
        rating: 5.0,
        bio: 'Book with our next available professional for the quickest appointment.',
        expertise: ['All Services'],
        status: 'active'
      };
      
      setStylists([anyStylist]);
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const handleSelectStylist = (stylist: Stylist) => {
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

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF6F3] w-full flex items-center justify-center mt-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600">Loading stylists...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF6F3] w-full pb-24 mt-20">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => router.push('/services-page')} 
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeftIcon className="w-6 h-6 text-[#2C2C2C]" />
            </button>
            <h1 className="text-3xl font-serif text-[#2C2C2C] hidden md:block" style={{
              fontFamily: 'Playfair Display, serif'
            }}>
              Choose Your Stylist
            </h1>
          </div>
        </div>
      </div>

      {/* Stylists Grid */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {stylists.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-muted-foreground mb-4">
              <SparklesIcon className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <p className="text-lg font-semibold">No stylists available</p>
              <p className="mt-2">Our team will be available soon. You can book with any available stylist.</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stylists.map((stylist, index) => {
              const isSelected = selectedStylist?.id === stylist.id;
              const isExpanded = expandedStylist === stylist.id;
              
              return (
                <motion.div 
                  key={stylist.id}
                  className={`bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 ${
                    isSelected ? 'ring-2 ring-black' : ''
                  }`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <div className="relative">
                    <div className="h-64 overflow-hidden">
                      <Image 
                        width={400} 
                        height={400} 
                        src={stylist.imageUrl} 
                        alt={stylist.name} 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          // Fallback image if the URL fails
                          e.currentTarget.src = 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&h=300&fit=crop';
                        }}
                      />
                    </div>
                    
                    {stylist.id === 'any' && (
                      <div className="absolute top-4 left-4 bg-black text-white px-3 py-1 rounded-full flex items-center gap-1">
                        <SparklesIcon className="w-4 h-4" />
                        <span className="text-sm font-medium">Quick Book</span>
                      </div>
                    )}
                    
                    {isSelected && (
                      <div className="absolute top-4 right-4 w-8 h-8 bg-black rounded-full flex items-center justify-center shadow-lg">
                        <motion.div 
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: 'spring' }}
                        >
                          <StarIcon className="w-5 h-5 fill-white text-white" />
                        </motion.div>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-xl font-semibold text-[#2C2C2C]">
                          {stylist.name}
                        </h3>
                        <p className="text-gray-600 font-medium">
                          {stylist.specialty}
                        </p>
                      </div>
                      
                      {stylist.id !== 'any' && (
                        <div className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-full">
                          <StarIcon className="w-4 h-4 fill-black text-black" />
                          <span className="text-sm font-semibold text-[#2C2C2C]">
                            {stylist.rating}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div 
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="mt-4 pt-4 border-t border-gray-200">
                            <p className="text-gray-600 text-sm mb-3">
                              {stylist.bio}
                            </p>
                            <div>
                              <p className="text-sm font-semibold text-[#2C2C2C] mb-2">
                                Expertise:
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {stylist.expertise.map(skill => (
                                  <span 
                                    key={skill} 
                                    className="text-xs bg-gray-100 text-[#2C2C2C] px-3 py-1 rounded-full"
                                  >
                                    {skill}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                    
                    <div className="mt-4 flex gap-2">
                      <button 
                        onClick={() => handleSelectStylist(stylist)}
                        className={`flex-1 py-3 rounded-full font-semibold transition-all duration-300 ${
                          isSelected 
                            ? 'bg-black text-white' 
                            : 'bg-gray-100 text-black hover:bg-gray-200'
                        }`}
                      >
                        {isSelected ? 'Selected' : 'Select'}
                      </button>
                      <button 
                        onClick={() => toggleExpand(stylist.id)}
                        className="w-12 h-12 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
                      >
                        {isExpanded ? 
                          <ChevronUpIcon className="w-5 h-5 text-[#2C2C2C]" /> : 
                          <ChevronDownIcon className="w-5 h-5 text-[#2C2C2C]" />
                        }
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Continue Button */}
      {selectedStylist && (
        <motion.div 
          className="fixed bottom-0 left-0 right-0 bg-white shadow-2xl border-t border-gray-200 z-50"
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          transition={{ type: 'spring', damping: 20 }}
        >
          <div className="max-w-7xl mx-auto px-4 py-4">
            <button 
              onClick={handleContinue}
              className="w-full bg-black text-white py-4 rounded-full font-semibold text-lg transition-all duration-300 transform hover:scale-105"
            >
              Continue to Date & Time
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}