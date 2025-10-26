'use client'
import React, { useEffect } from 'react';
import { useBooking } from '@/context/BookingContext';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { CheckCircleIcon, CalendarIcon, ClockIcon, UserIcon, Share2Icon, DownloadIcon } from 'lucide-react';

const BookingSuccess = () => {
  const router = useRouter();
  const {
    selectedServices,
    selectedStylist,
    selectedDate,
    selectedTime,
    customerInfo,
    getTotalPrice,
    paymentMethod,
    clearBooking
  } = useBooking();

  // Check if we have booking data on component mount
  useEffect(() => {
    console.log('BookingSuccess mounted - selectedServices:', selectedServices.length);
    console.log('Booking data:', {
      services: selectedServices,
      date: selectedDate,
      time: selectedTime,
      customer: customerInfo
    });

    if (selectedServices.length === 0) {
      console.log('No booking data found, redirecting to services...');
      router.push('/services-page');
    }
  }, []); // Empty dependency array - only run on mount

  if (!selectedServices.length) {
    return (
      <div className="min-h-screen bg-[#FAF6F3] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">No Booking Found</h1>
          <p className="text-gray-600 mb-6">Please start a new booking.</p>
          <button 
            onClick={() => router.push('/services-page')}
            className="bg-black text-white px-6 py-3 rounded-full font-semibold hover:bg-gray-800 transition-all"
          >
            Book Services
          </button>
        </div>
      </div>
    );
  }

  const formatDate = (date: Date | null) => {
    if (!date) return 'Not specified';
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const downloadReceipt = () => {
    const receiptContent = `
      SALON BOOKING CONFIRMATION
      ===========================
      
      Customer: ${customerInfo?.name || 'Not provided'}
      Email: ${customerInfo?.email || 'Not provided'}
      Phone: ${customerInfo?.phone || 'Not provided'}
      
      Appointment Details:
      -------------------
      Date: ${formatDate(selectedDate)}
      Time: ${selectedTime || 'Not specified'}
      Stylist: ${selectedStylist?.name || 'Any Available Stylist'}
      
      Services:
      ---------
      ${selectedServices.map(service => 
        `${service.name} x${service.quantity} - KSH ${(service.price * service.quantity).toLocaleString()}`
      ).join('\n      ')}
      
      Total Amount: KSH ${getTotalPrice().toLocaleString()}
      Payment Method: ${paymentMethod === 'pay_at_salon' ? 'Pay at Salon' : 'Paid via M-Pesa'}
      
      Thank you for your booking!
      We look forward to seeing you.
    `;

    const blob = new Blob([receiptContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `booking-confirmation-${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const shareBooking = async () => {
    const shareData = {
      title: 'My Salon Appointment',
      text: `I have a salon appointment on ${formatDate(selectedDate)} at ${selectedTime} with ${selectedStylist?.name || 'a stylist'}.`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(shareData.text);
      alert('Booking details copied to clipboard!');
    }
  };

  const handleBackToHome = () => {
    clearBooking();
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-[#FAF6F3] mt-20">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-2xl shadow-lg p-8 text-center"
        >
          {/* Success Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="mb-6"
          >
            <CheckCircleIcon className="w-20 h-20 text-green-500 mx-auto" />
          </motion.div>

          {/* Success Message */}
          <h1 className="text-3xl font-serif text-[#2C2C2C] mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
            Booking Confirmed!
          </h1>
          <p className="text-gray-600 text-lg mb-8">
            Your appointment has been successfully scheduled. We've sent a confirmation to your email.
          </p>

          {/* Booking Summary */}
          <div className="bg-gray-50 rounded-xl p-6 mb-8 text-left">
            <h2 className="text-xl font-semibold text-[#2C2C2C] mb-4">Booking Summary</h2>
            
            {/* Customer Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="flex items-center gap-3">
                <UserIcon className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-600">Customer</p>
                  <p className="font-semibold capitalize">{customerInfo?.name || 'Not provided'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <CalendarIcon className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-600">Date</p>
                  <p className="font-semibold">{formatDate(selectedDate)}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <ClockIcon className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-600">Time</p>
                  <p className="font-semibold">{selectedTime || 'Not specified'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <UserIcon className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-600">Stylist</p>
                  <p className="font-semibold">{selectedStylist?.name || 'Any Available Stylist'}</p>
                </div>
              </div>
            </div>

            {/* Services */}
            <div className="mb-4">
              <h3 className="font-semibold text-[#2C2C2C] mb-3">Services Booked</h3>
              <div className="space-y-2">
                {selectedServices.map((service) => (
                  <div key={service.id} className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{service.name}</p>
                      <p className="text-sm text-gray-500">
                        {service.quantity} × {service.duration} min
                      </p>
                    </div>
                    <p className="font-semibold">
                      KSH {(service.price * service.quantity).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Total */}
            <div className="border-t border-gray-200 pt-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold">Total</span>
                <span className="text-2xl font-bold text-[#2C2C2C]">
                  KSH {getTotalPrice().toLocaleString()}
                </span>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Payment: {paymentMethod === 'pay_at_salon' ? 'Pay at Salon' : 'Paid via M-Pesa'}
              </p>
            </div>
          </div>

          {/* Important Notes */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-8 text-left">
            <h3 className="font-semibold text-blue-900 mb-2">Important Information</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Please arrive 10 minutes before your appointment</li>
              <li>• Bring any reference images for your desired style</li>
              <li>• Cancellations require 24 hours notice</li>
              <li>• Contact us if you need to reschedule</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={downloadReceipt}
              className="flex-1 py-4 border border-gray-300 text-gray-700 rounded-full font-semibold transition-all hover:bg-gray-50 flex items-center justify-center gap-2"
            >
              <DownloadIcon className="w-5 h-5" />
              Download Receipt
            </button>
            
            <button
              onClick={shareBooking}
              className="flex-1 py-4 border border-gray-300 text-gray-700 rounded-full font-semibold transition-all hover:bg-gray-50 flex items-center justify-center gap-2"
            >
              <Share2Icon className="w-5 h-5" />
              Share Booking
            </button>
            
            <button
              onClick={handleBackToHome}
              className="flex-1 py-4 bg-black text-white rounded-full font-semibold transition-all hover:bg-gray-800 transform hover:scale-105"
            >
              Back to Home
            </button>
          </div>

          {/* Contact Information */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              Need to make changes? Contact us at{' '}
              <a href="tel:+254700000000" className="text-black font-semibold hover:underline">
                +254 700 000 000
              </a>{' '}
              or{' '}
              <a href="mailto:info@salon.com" className="text-black font-semibold hover:underline">
                info@salon.com
              </a>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default BookingSuccess;