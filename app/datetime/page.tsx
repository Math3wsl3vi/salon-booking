// app/datetime/page.tsx
'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeftIcon, CalendarIcon, ClockIcon } from 'lucide-react';
import { useBooking } from '@/context/BookingContext';
import { useRouter } from 'next/navigation';

export default function DateTimePage() {
  const router = useRouter();
  const {
    selectedTime,
    setSelectedTime,
    selectedDate,
    setSelectedDate
  } = useBooking();

  const today = new Date().toISOString().split('T')[0];
  
  // Convert selectedDate to string for the input
  const [dateInput, setDateInput] = useState(
    selectedDate ? selectedDate.toISOString().split('T')[0] : ''
  );

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dateString = e.target.value;
    setDateInput(dateString);
    
    if (dateString) {
      // Convert string to Date object and set in context
      const date = new Date(dateString);
      setSelectedDate(date);
    } else {
      setSelectedDate(null);
    }
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedTime(e.target.value);
  };

  const handleContinue = () => {
    if (selectedDate && selectedTime) {
      router.push('/customer-info');
    } else {
      alert('Please select both date and time');
    }
  };

  return (
    <div className='mt-20'>
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <button onClick={() => router.push('/stylist')} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <ArrowLeftIcon className="w-6 h-6 text-[#2C2C2C]" />
            </button>
            <h1 className="text-3xl font-serif text-[#2C2C2C] hidden md:block" style={{
              fontFamily: 'Playfair Display, serif'
            }}>
              Back To Stylist
            </h1>
          </div>
        </div>
      </div>
      
      <div className="min-h-screen bg-[#FAF6F3] flex flex-col items-center px-4 py-16">
        <motion.div
          className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1
            className="text-3xl font-serif text-center mb-4 text-[#2C2C2C]"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            Select Date & Time
          </h1>
          <p className="text-gray-600 text-center mb-8">
            Choose when {"you'd"} like your appointment.
          </p>

          {/* Date Picker */}
          <div className="mb-6">
            <label className="text-gray-700 font-medium mb-2 flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-black" />
              Select Date *
            </label>
            <input
              type="date"
              value={dateInput}
              onChange={handleDateChange}
              min={today}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black transition-all"
              required
            />
          </div>

          {/* Time Picker */}
          <div className="mb-8">
            <label className="text-gray-700 font-medium mb-2 flex items-center gap-2">
              <ClockIcon className="w-5 h-5 text-black" />
              Select Time *
            </label>
            <input
              type="time"
              value={selectedTime || ''}
              onChange={handleTimeChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black transition-all"
              required
            />
          </div>

          {/* Summary */}
          {selectedDate && selectedTime && (
            <motion.div
              className="bg-gray-100 border border-gray-300 rounded-xl p-4 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <p className="text-gray-700">
                You selected:
              </p>
              <p className="font-semibold text-[#2C2C2C] mt-1">
                {selectedDate.toLocaleDateString()} at {selectedTime}
              </p>
            </motion.div>
          )}

          {/* Continue Button */}
          <button
            onClick={handleContinue}
            disabled={!selectedDate || !selectedTime}
            className={`w-full mt-6 py-4 rounded-full font-semibold text-lg transition-all duration-300 ${
              selectedDate && selectedTime
                ? 'bg-black text-white hover:bg-gray-800 transform hover:scale-105'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Continue to Customer Info
          </button>
        </motion.div>
      </div>
    </div>
  );
}