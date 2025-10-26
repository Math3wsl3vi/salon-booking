// context/BookingContext.tsx
'use client'
import React, { useState, createContext, useContext, ReactNode } from 'react';
import { 
  collection, 
  addDoc, 
  doc, 
  setDoc, 
  serverTimestamp,
  updateDoc,
  arrayUnion 
} from 'firebase/firestore';
import { db } from '@/configs/firebaseConfig';

interface Service {
  id: string;
  name: string;
  price: number;
  duration: number;
  quantity: number;
  category?: string;
  description?: string;
  image?: string;
}

interface Stylist {
  id: string;
  name: string;
  specialty: string;
}

interface CustomerInfo {
  name: string;
  phone: string;
  email?: string;
  notes: string;
}

interface BookingContextType {
  selectedServices: Service[];
  selectedStylist: Stylist | null;
  selectedDate: Date | null;
  selectedTime: string | null;
  customerInfo: CustomerInfo;
  paymentMethod: string;
  addService: (service: Service) => void;
  removeService: (serviceId: string) => void;
  updateServiceQuantity: (serviceId: string, quantity: number) => void;
  setSelectedStylist: (stylist: Stylist | null) => void;
  setSelectedDate: (date: Date | null) => void;
  setSelectedTime: (time: string | null) => void;
  setCustomerInfo: (info: CustomerInfo) => void;
  setPaymentMethod: (method: string) => void;
  getTotalPrice: () => number;
  getTotalDuration: () => number;
  submitBooking: () => Promise<{ success: boolean; bookingId?: string; error?: string }>;
  clearBooking: () => void;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export function BookingProvider({ children }: { children: ReactNode }) {
  const [selectedServices, setSelectedServices] = useState<Service[]>([]);
  const [selectedStylist, setSelectedStylist] = useState<Stylist | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    name: '',
    phone: '+254',
    email: '',
    notes: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('salon');

  // Add service to booking
  const addService = (service: Service) => {
    setSelectedServices(prev => {
      const existing = prev.find(s => s.id === service.id);
      if (existing) {
        return prev.map(s => s.id === service.id ? {
          ...s,
          quantity: s.quantity + 1
        } : s);
      }
      return [...prev, {
        ...service,
        quantity: 1
      }];
    });
  };

  // Remove service from booking
  const removeService = (serviceId: string) => {
    setSelectedServices(prev => prev.filter(s => s.id !== serviceId));
  };

  // Update service quantity
  const updateServiceQuantity = (serviceId: string, quantity: number) => {
    if (quantity <= 0) {
      removeService(serviceId);
    } else {
      setSelectedServices(prev => prev.map(s => s.id === serviceId ? {
        ...s,
        quantity
      } : s));
    }
  };

  // Calculate total price
  const getTotalPrice = () => {
    return selectedServices.reduce((total, service) => total + service.price * service.quantity, 0);
  };

  // Calculate total duration
  const getTotalDuration = () => {
    return selectedServices.reduce((total, service) => total + service.duration * service.quantity, 0);
  };

  const submitBooking = async (): Promise<{ success: boolean; bookingId?: string; error?: string }> => {
    try {
      console.log('Starting booking submission...');
  
      if (!selectedDate || !selectedTime || !customerInfo.name || !customerInfo.email || !customerInfo.phone) {
        const missingFields = [
          !selectedDate && 'date',
          !selectedTime && 'time',
          !customerInfo.name && 'name',
          !customerInfo.email && 'email',
          !customerInfo.phone && 'phone'
        ].filter(Boolean);
  
        console.error('Missing required fields:', missingFields);
        return { success: false, error: `Missing required fields: ${missingFields.join(', ')}` };
      }
  
      console.log('Creating booking data...');
  
      const bookingData = {
        customer: {
          name: customerInfo.name,
          email: customerInfo.email,
          phone: customerInfo.phone,
          notes: customerInfo.notes
        },
        appointment: {
          date: selectedDate.toISOString().split('T')[0],
          time: selectedTime,
          datetime: new Date(`${selectedDate.toISOString().split('T')[0]}T${selectedTime}`)
        },
        services: selectedServices.map(service => ({
          id: service.id,
          name: service.name,
          price: service.price,
          duration: service.duration,
          quantity: service.quantity,
          total: service.price * service.quantity
        })),
        stylist: selectedStylist ? {
          id: selectedStylist.id,
          name: selectedStylist.name,
          specialty: selectedStylist.specialty
        } : null,
        payment: {
          method: paymentMethod,
          status: paymentMethod === 'pay_at_salon' ? 'pending' : 'paid',
          totalAmount: getTotalPrice()
        },
        status: 'confirmed',
        totalAmount: getTotalPrice(),
        totalDuration: getTotalDuration(),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
  
      console.log('Booking data:', bookingData);
      console.log('Adding to Firestore...');
  
      const docRef = await addDoc(collection(db, 'bookings'), bookingData);
      console.log('Booking created with ID:', docRef.id);
  
      console.log('Updating customer document...');
      await setDoc(doc(db, 'customers', customerInfo.email), {
        name: customerInfo.name,
        email: customerInfo.email,
        phone: customerInfo.phone,
        bookings: arrayUnion(docRef.id),
        lastBooking: serverTimestamp(),
        totalBookings: 1,
        updatedAt: serverTimestamp()
      }, { merge: true });
  
      console.log('Booking submission completed successfully');
      return { success: true, bookingId: docRef.id };
  
    } catch (error: unknown) {
      // ✅ Properly narrow and handle unknown errors
      if (error instanceof Error) {
        console.error('Error submitting booking to Firebase:', error);
        console.error('Error details:', {
          message: error.message,
          stack: error.stack
        });
        return { success: false, error: `Firebase error: ${error.message}` };
      } else {
        console.error('Unknown error submitting booking to Firebase:', error);
        return { success: false, error: `Unexpected error: ${String(error)}` };
      }
    }
  };
  

  // Clear booking data
  const clearBooking = () => {
    setSelectedServices([]);
    setSelectedStylist(null);
    setSelectedDate(null);
    setSelectedTime(null);
    setCustomerInfo({
      name: '',
      phone: '+254',
      email: '',
      notes: ''
    });
    setPaymentMethod('salon');
  };

  return (
    <BookingContext.Provider value={{
      selectedServices,
      selectedStylist,
      selectedDate,
      selectedTime,
      customerInfo,
      paymentMethod,
      addService,
      removeService,
      updateServiceQuantity,
      setSelectedStylist,
      setSelectedDate,
      setSelectedTime,
      setCustomerInfo,
      setPaymentMethod,
      getTotalPrice,
      getTotalDuration,
      submitBooking,
      clearBooking
    }}>
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within BookingProvider');
  }
  return context;
}