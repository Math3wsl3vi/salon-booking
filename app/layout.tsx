import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/home/Navbar";

import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/context/AuthContext";
import { BookingProvider } from "@/context/BookingContext";


export const metadata: Metadata = {
  title: "Maison de Beauté",
  description: "Salon Booking Platform",
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`antialiased`}
      >
        <AuthProvider>
          <BookingProvider>
        <div>
          <Navbar/>
        </div>
        <Toaster/>
        {children}
        <div className="">
        {/* <BottomBar /> */}
      </div>
      </BookingProvider>
      </AuthProvider>
      </body>
    </html>
  );
}
