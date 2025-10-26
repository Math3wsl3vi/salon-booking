'use client'
import React, { useEffect, useState } from 'react';
import { useBooking } from '@/context/BookingContext';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeftIcon, CalendarIcon, ClockIcon, UserIcon, CreditCardIcon, WalletIcon, CheckCircleIcon, ShoppingCartIcon } from 'lucide-react';

const Confirmation = () => {
  const router = useRouter();
  const {
    selectedServices,
    selectedStylist,
    selectedDate,
    selectedTime,
    customerInfo,
    getTotalPrice,
    getTotalDuration,
    setPaymentMethod,
    submitBooking,
    clearBooking
  } = useBooking();

  const [paymentChoice, setPaymentChoice] = useState<'now' | 'later' | null>(null);
  const [phoneNumber, setPhoneNumber] = useState(customerInfo?.phone || '+254');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    // Redirect if no services selected
    if (selectedServices.length === 0) {
      router.push('/services-page');
    }
  }, [selectedServices.length, router]);

  if (selectedServices.length === 0) {
    return (
      <div className="min-h-screen bg-[#FAF6F3] flex items-center justify-center mt-20">
        <div className="text-center">
          <ShoppingCartIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-800 mb-4">No Services Selected</h1>
          <p className="text-gray-600 mb-6">Please select services before proceeding to confirmation.</p>
          <button 
            onClick={() => router.push('/services-page')}
            className="bg-black text-white px-6 py-3 rounded-full font-semibold hover:bg-gray-800 transition-all"
          >
            Browse Services
          </button>
        </div>
      </div>
    );
  }

  const handleMpesaPayment = async () => {
    const totalAmount = getTotalPrice();
  
    if (!phoneNumber || !phoneNumber.startsWith('+254')) {
      alert("Please enter a valid Kenyan phone number starting with +254");
      return;
    }
  
    setIsProcessing(true);
    try {
      // First process M-Pesa payment
      const response = await fetch("/api/mpesa/stkpush", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          phone: phoneNumber, 
          amount: totalAmount,
          bookingDetails: {
            services: selectedServices,
            stylist: selectedStylist,
            date: selectedDate,
            time: selectedTime,
            customer: customerInfo
          }
        }),
      });
  
      if (response.ok) {
        // If M-Pesa payment is successful, save booking to Firebase
        setPaymentMethod('mpesa');
        const result = await submitBooking();
        
        if (result.success) {
          // DON'T clear booking here - let the success page show the data
          router.push("/booking-success");
        } else {
          alert("Payment successful but failed to save booking. Please contact support.");
        }
      } else {
        alert("M-Pesa payment failed. Please try again.");
      }
    } catch (error) {
      console.error("Payment error:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handlePayLater = async () => {
    setIsProcessing(true);
    try {
      setPaymentMethod('pay_at_salon');
      const result = await submitBooking();
      
      if (result.success) {
        // DON'T clear booking here - let the success page show the data
        router.push("/booking-success");
      } else {
        alert("Failed to confirm booking. Please try again.");
      }
    } catch (error) {
      console.error("Booking error:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };
  

  const formatDate = (date: Date | null) => {
    if (!date) return 'Not selected';
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (time: string | null) => {
    if (!time) return 'Not selected';
    return time;
  };

  return (
    <div className="min-h-screen bg-[#FAF6F3] mt-20">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => router.back()} 
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeftIcon className="w-6 h-6 text-[#2C2C2C]" />
            </button>
            <h1 className="text-2xl font-bold text-[#2C2C2C]">
              Confirm Your Booking
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Booking Summary */}
          <div className="lg:col-span-2 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-lg p-6"
            >
              <h2 className="text-2xl font-serif text-[#2C2C2C] mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
                Booking Summary
              </h2>

              {/* Customer Information */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-[#2C2C2C] flex items-center gap-2 mb-4">
                  <UserIcon className="w-5 h-5" />
                  Customer Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Name</p>
                    <p className="font-semibold">{customerInfo?.name || 'Not provided'}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Email</p>
                    <p className="font-semibold">{customerInfo?.email || 'Not provided'}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Phone</p>
                    <p className="font-semibold">{customerInfo?.phone || 'Not provided'}</p>
                  </div>
                </div>
              </div>

              {/* Appointment Details */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-[#2C2C2C] mb-4">Appointment Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-3">
                    <CalendarIcon className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="text-gray-600">Date</p>
                      <p className="font-semibold">{formatDate(selectedDate)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <ClockIcon className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="text-gray-600">Time</p>
                      <p className="font-semibold">{formatTime(selectedTime)}</p>
                    </div>
                  </div>
                  {selectedStylist && (
                    <div className="flex items-center gap-3">
                      <UserIcon className="w-5 h-5 text-gray-500" />
                      <div>
                        <p className="text-gray-600">Stylist</p>
                        <p className="font-semibold">{selectedStylist.name}</p>
                        <p className="text-gray-500 text-sm">{selectedStylist.specialty}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Services */}
              <div>
                <h3 className="text-lg font-semibold text-[#2C2C2C] mb-4">Selected Services</h3>
                <div className="space-y-3">
                  {selectedServices.map((service) => (
                    <div key={service.id} className="flex justify-between items-center py-2 border-b border-gray-100">
                      <div>
                        <p className="font-semibold">{service.name}</p>
                        <p className="text-sm text-gray-500">
                          {service.duration} min × {service.quantity}
                        </p>
                      </div>
                      <p className="font-semibold">
                        KSH {(service.price * service.quantity).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Payment Section */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl shadow-lg p-6 sticky top-24"
            >
              <h2 className="text-xl font-semibold text-[#2C2C2C] mb-6">Payment</h2>

              {/* Total Amount */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Total Amount</span>
                  <span className="text-2xl font-bold text-[#2C2C2C]">
                    KSH {getTotalPrice().toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Total Duration</span>
                  <span>{getTotalDuration()} minutes</span>
                </div>
              </div>

              {/* Payment Options */}
              <div className="space-y-4 mb-6">
                <h3 className="font-semibold text-[#2C2C2C]">Choose Payment Method</h3>
                
                {/* Pay Now Option */}
                <div 
                  className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                    paymentChoice === 'now' ? 'border-black bg-black/5' : 'border-gray-200 hover:border-gray-400'
                  }`}
                  onClick={() => setPaymentChoice('now')}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      paymentChoice === 'now' ? 'border-black bg-black' : 'border-gray-300'
                    }`}>
                      {paymentChoice === 'now' && <CheckCircleIcon className="w-3 h-3 text-white" />}
                    </div>
                    <CreditCardIcon className="w-5 h-5" />
                    <div>
                      <p className="font-semibold">Pay Now with M-Pesa</p>
                      <p className="text-sm text-gray-500">Secure instant payment</p>
                    </div>
                  </div>
                </div>

                {/* Pay Later Option */}
                <div 
                  className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                    paymentChoice === 'later' ? 'border-black bg-black/5' : 'border-gray-200 hover:border-gray-400'
                  }`}
                  onClick={() => setPaymentChoice('later')}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      paymentChoice === 'later' ? 'border-black bg-black' : 'border-gray-300'
                    }`}>
                      {paymentChoice === 'later' && <CheckCircleIcon className="w-3 h-3 text-white" />}
                    </div>
                    <WalletIcon className="w-5 h-5" />
                    <div>
                      <p className="font-semibold">Pay at Salon</p>
                      <p className="text-sm text-gray-500">Pay during your appointment</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* M-Pesa Phone Input */}
              {paymentChoice === 'now' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mb-6"
                >
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    M-Pesa Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black transition-all"
                    placeholder="+254 XXX XXX XXX"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Enter your M-Pesa registered phone number
                  </p>
                </motion.div>
              )}

              {/* Action Buttons */}
              <div className="space-y-3">
                {paymentChoice === 'now' && (
                  <button
                    onClick={handleMpesaPayment}
                    disabled={isProcessing || !phoneNumber}
                    className={`w-full py-4 rounded-full font-semibold text-lg transition-all duration-300 ${
                      isProcessing || !phoneNumber
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-black text-white hover:bg-gray-800 transform hover:scale-105'
                    }`}
                  >
                    {isProcessing ? 'Processing...' : `Pay KSH ${getTotalPrice().toLocaleString()}`}
                  </button>
                )}

                {paymentChoice === 'later' && (
                  <button
                    onClick={handlePayLater}
                    disabled={isProcessing}
                    className={`w-full py-4 rounded-full font-semibold text-lg transition-all duration-300 transform hover:scale-105 ${
                      isProcessing
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-black text-white hover:bg-gray-800'
                    }`}
                  >
                    {isProcessing ? 'Confirming...' : 'Confirm Booking'}
                  </button>
                )}

                {!paymentChoice && (
                  <button
                    disabled
                    className="w-full py-4 bg-gray-300 text-gray-500 rounded-full font-semibold text-lg cursor-not-allowed"
                  >
                    Select Payment Method
                  </button>
                )}

                <button
                  onClick={() => router.back()}
                  disabled={isProcessing}
                  className="w-full py-4 border border-gray-300 text-gray-700 rounded-full font-semibold transition-all hover:bg-gray-50 disabled:opacity-50"
                >
                  Back
                </button>
              </div>

              {/* Security Notice */}
              <div className="text-center text-xs text-gray-500 mt-4">
                <p>Your payment information is secure and encrypted</p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Confirmation;