"use client";

import { ClockIcon, MailIcon, MapPinIcon, PhoneIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const Footer = () => {
  return (
    <footer className="bg-[#2C2C2C] text-white py-12 px-4 md:px-8 mt-16">
    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
      <div>
        <h3 className="text-2xl font-serif mb-4" style={{
        fontFamily: 'Playfair Display, serif'
      }}>
          Luxe Beauty Salon
        </h3>
        <p className="text-gray-400">Where beauty meets excellence</p>
      </div>
      <div>
        <h4 className="font-semibold mb-4">Contact Us</h4>
        <div className="space-y-2 text-gray-400">
          <div className="flex items-center gap-2">
            <PhoneIcon className="w-4 h-4" />
            <span>+254 712 345 678</span>
          </div>
          <div className="flex items-center gap-2">
            <MailIcon className="w-4 h-4" />
            <span>info@luxebeauty.co.ke</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPinIcon className="w-4 h-4" />
            <span>123 Kimathi Street, Nairobi</span>
          </div>
        </div>
      </div>
      <div>
        <h4 className="font-semibold mb-4">Opening Hours</h4>
        <div className="space-y-2 text-gray-400">
          <div className="flex items-center gap-2">
            <ClockIcon className="w-4 h-4" />
            <div>
              <p>Mon - Fri: 9:00 AM - 7:00 PM</p>
              <p>Sat: 9:00 AM - 6:00 PM</p>
              <p>Sun: 10:00 AM - 4:00 PM</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div className="max-w-7xl mx-auto mt-8 pt-8 border-t border-gray-700 text-center text-gray-400">
      <p>&copy; 2024 Luxe Beauty Salon. All rights reserved.</p>
    </div>
  </footer>
  );
};

export default Footer;
