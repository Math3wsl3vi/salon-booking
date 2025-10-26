import type { Metadata } from "next";
import "./../globals.css";

import { Toaster } from "@/components/ui/toaster";
import { BookingProvider } from "@/context/BookingContext";
import { AuthProvider } from "@/context/AuthContext";


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
        <Toaster/>
        {children}
        </BookingProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
