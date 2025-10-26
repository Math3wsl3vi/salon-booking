"use client";
import { useEffect } from "react";
import MenuSection from "@/components/foodSection/MenuSection";
import Footer from "@/components/home/Footer";
import Hero from "@/components/home/Hero";
import Reviews from "@/components/home/Review";
import ProtectedRoute from "@/components/ProtectedRoute";
import Features from "@/components/home/Features";
import Stylist from "@/components/home/Stylist";

export default function Home() {
  useEffect(() => {
    if (process.env.NODE_ENV === "production" && "serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(console.error);
    }
  }, []);


  return (
    <ProtectedRoute>
      <div className="flex flex-col relative h-screen w-full font-popppins">
          <Hero />
          <Features/>
          <Stylist/>
        <div className="mt-10">
          <Footer />
        </div>
      </div>
    </ProtectedRoute>
  );
}
