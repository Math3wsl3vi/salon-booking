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
    setSelectedTime
  } = useBooking();

  const today = new Date().toISOString().split('T')[0]; // Prevent past date selection
  const [selectedDate, setSelectedDate] = useState<string>("");

  return (
    <div className='mt-20'>
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
            Choose when you'd like your appointment.
          </p>

          {/* Date Picker */}
          <div className="mb-6">
            <label className="text-gray-700 font-medium mb-2 flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-black" />
              Select Date
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              min={today}
              className="w-full border border-black rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black transition-all"
            />
          </div>

          {/* Time Picker */}
          <div className="mb-8">
            <label className="text-gray-700 font-medium mb-2 flex items-center gap-2">
              <ClockIcon className="w-5 h-5 text-black" />
              Select Time
            </label>
            <input
              type="time"
              value={selectedTime || ''}
              onChange={(e) => setSelectedTime(e.target.value)}
              className="w-full border border-black rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black transition-all"
            />
          </div>

          {/* Summary */}
          {selectedDate && selectedTime && (
            <motion.div
              className="bg-gray-100 border border-black rounded-xl p-4 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <p className="text-gray-700">
                You selected:
              </p>
              <p className="font-semibold text-[#2C2C2C] mt-1">
                {new Date(selectedDate).toLocaleDateString()} at {selectedTime}
              </p>
            </motion.div>
          )}

          {/* Continue Button */}
          {selectedDate && selectedTime && (
            <motion.button
              onClick={() => router.push('/confirmation')}
              className="w-full bg-black text-white py-4 rounded-full font-semibold text-lg mt-6 transition-all duration-300 transform hover:scale-105"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              Continue to Confirmation
            </motion.button>
          )}
        </motion.div>
      </div>
    </div>
  );
}