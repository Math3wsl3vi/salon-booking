'use client'
import { useBooking } from '@/context/BookingContext';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeftIcon, UserIcon, MailIcon, MapPinIcon } from 'lucide-react';

export default function CustomerInfoPage() {
  const {
    customerInfo,
    setCustomerInfo
  } = useBooking();
  
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: customerInfo?.name || '',
    email: customerInfo?.email || '',
    phone: customerInfo?.phone || '+254',
    notes: customerInfo?.notes || ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Save customer info to context
    setCustomerInfo(formData);
    // Navigate to confirmation or payment page
    router.push('/confirmation');
  };

  const isFormValid = formData.name && formData.email && formData.phone;

  return (
    <div className="min-h-screen bg-[#FAF6F3] mt-20">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => router.back()} 
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeftIcon className="w-6 h-6 text-[#2C2C2C]" />
            </button>
            <h1 className="text-2xl font-bold text-[#2C2C2C]">
              Your Information
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white rounded-2xl shadow-lg p-6 md:p-8"
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl font-serif text-[#2C2C2C] mb-3" style={{ fontFamily: 'Playfair Display, serif' }}>
              Complete Your Booking
            </h1>
            <p className="text-gray-600 text-lg">
              Please provide your contact information to confirm your appointment
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-[#2C2C2C] flex items-center gap-2">
                <UserIcon className="w-5 h-5" />
                Personal Information
              </h3>
              
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black transition-all"
                  placeholder="Enter your full name"
                />
              </div>
            </div>

            {/* Contact Information Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-[#2C2C2C] flex items-center gap-2">
                <MailIcon className="w-5 h-5" />
                Contact Information
              </h3>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black transition-all"
                  placeholder="your.email@example.com"
                />
              </div>
              
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black transition-all"
                  placeholder="+254 XXX XXX XXX"
                />
                <p className="text-sm text-gray-500 mt-1">
                 {" We'll"} use this to send appointment reminders
                </p>
              </div>
            </div>

            {/* Additional Notes */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-[#2C2C2C] flex items-center gap-2">
                <MapPinIcon className="w-5 h-5" />
                Additional Information
              </h3>
              
              <div>
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                  Special Requests or Notes
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black transition-all resize-none"
                  placeholder="Any special requests, allergies, preferred stylist notes, or additional information we should know..."
                />
                <p className="text-sm text-gray-500 mt-1">
                  Let us know how we can make your experience better
                </p>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <button
                type="button"
                onClick={() => router.back()}
                className="flex-1 py-4 border border-gray-300 text-gray-700 rounded-full font-semibold transition-all hover:bg-gray-50"
              >
                Back
              </button>
              
              <button
                type="submit"
                disabled={!isFormValid}
                className={`flex-1 py-4 rounded-full font-semibold text-lg transition-all duration-300 transform hover:scale-105 ${
                  isFormValid 
                    ? 'bg-black text-white hover:bg-gray-800' 
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Continue to Confirmation
              </button>
            </div>

            {/* Privacy Notice */}
            <div className="text-center text-sm text-gray-500 pt-4">
              <p>
                Your information is secure and will only be used for your appointment. 
                We respect your privacy and never share your data with third parties.
              </p>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}