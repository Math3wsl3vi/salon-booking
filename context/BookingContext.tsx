'use client'
import React, { useState, createContext, useContext, ReactNode } from 'react';
interface Service {
  id: string;
  name: string;
  price: number;
  duration: number;
  quantity: number;
}
interface Stylist {
  id: string;
  name: string;
  specialty: string;
}
interface BookingContextType {
  selectedServices: Service[];
  selectedStylist: Stylist | null;
  selectedDate: Date | null;
  selectedTime: string | null;
  customerInfo: {
    name: string;
    phone: string;
    email: string;
    notes: string;
  };
  paymentMethod: string;
  addService: (service: Service) => void;
  removeService: (serviceId: string) => void;
  updateServiceQuantity: (serviceId: string, quantity: number) => void;
  setSelectedStylist: (stylist: Stylist | null) => void;
  setSelectedDate: (date: Date | null) => void;
  setSelectedTime: (time: string | null) => void;
  setCustomerInfo: (info: any) => void;
  setPaymentMethod: (method: string) => void;
  getTotalPrice: () => number;
  getTotalDuration: () => number;
}
const BookingContext = createContext<BookingContextType | undefined>(undefined);
export function BookingProvider({
  children
}: {
  children: ReactNode;
}) {
  const [selectedServices, setSelectedServices] = useState<Service[]>([]);
  const [selectedStylist, setSelectedStylist] = useState<Stylist | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: '+254',
    email: '',
    notes: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('salon');
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
  const removeService = (serviceId: string) => {
    setSelectedServices(prev => prev.filter(s => s.id !== serviceId));
  };
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
  const getTotalPrice = () => {
    return selectedServices.reduce((total, service) => total + service.price * service.quantity, 0);
  };
  const getTotalDuration = () => {
    return selectedServices.reduce((total, service) => total + service.duration * service.quantity, 0);
  };
  return <BookingContext.Provider value={{
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
    getTotalDuration
  }}>
      {children}
    </BookingContext.Provider>;
}
export function useBooking() {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within BookingProvider');
  }
  return context;
}