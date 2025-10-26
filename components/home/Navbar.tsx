"use client";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { auth, db } from "@/configs/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { useCartStore } from "@/lib/store/cartStore";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Menu, X } from "lucide-react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

const Navbar = () => {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallButton, setShowInstallButton] = useState(false);
  const { cart } = useCartStore();

  useEffect(() => {
    const handleBeforeInstallPrompt = (event: Event) => {
      const promptEvent = event as BeforeInstallPromptEvent;
      promptEvent.preventDefault();
      setDeferredPrompt(promptEvent);
      setShowInstallButton(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt as EventListener);
    return () => window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt as EventListener);
  }, []);

  const handleInstallClick = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === "accepted") console.log("✅ User accepted PWA install");
        setDeferredPrompt(null);
        setShowInstallButton(false);
      });
    }
  };

  useEffect(() => {
    const checkAdmin = async (userId: string) => {
      try {
        const adminRef = doc(db, "admins", userId);
        const adminSnap = await getDoc(adminRef);
        setIsAdmin(adminSnap.exists());
      } catch (error) {
        console.error("⚠️ Error checking admin status:", error);
      } finally {
        setLoading(false);
      }
    };

    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) checkAdmin(user.uid);
      else {
        setIsAdmin(false);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = () => {
    auth.signOut();
    localStorage.removeItem("user");
    router.push("/login");
    setSidebarOpen(false);
  };

  const cartItemCount = cart.length;

  return (
    <>
      {/* Navbar */}
      <motion.nav
        className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-6 py-4 backdrop-blur-lg bg-white/40"
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {/* Logo & Brand */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => router.push("/")}>
          <Image src="/images/barber.png" alt="logo" width={40} height={40} className="" />
          <span className="text-xl md:text-2xl font-serif tracking-wide text-[#2C2C2C]" style={{ fontFamily: 'Playfair Display, serif' }}>
            Luxe Beauty
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-6">
          <Link href="/cart" className="relative">
            <ShoppingBag className="w-6 h-6 text-[#2C2C2C]" />
            {cartItemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-[#E8B4B8] text-white text-xs font-semibold px-2 py-0.5 rounded-full shadow-sm">
                {cartItemCount}
              </span>
            )}
          </Link>

          <button onClick={() => setSidebarOpen(true)} className="text-[#2C2C2C]">
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </motion.nav>

      {/* Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed top-0 right-0 w-4/5 sm:w-1/3 h-full bg-white shadow-2xl z-50 flex flex-col p-8"
          >
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-2xl font-semibold font-serif text-[#2C2C2C]" style={{ fontFamily: 'Playfair Display, serif' }}>
                Menu
              </h2>
              <button onClick={() => setSidebarOpen(false)}>
                <X className="w-6 h-6 text-gray-700" />
              </button>
            </div>

            <nav className="flex flex-col gap-5 text-lg text-[#333]">
              <Link href="/" onClick={() => setSidebarOpen(false)} className="hover:text-[#E8B4B8] transition">
                Home
              </Link>
              <Link href="/profile" onClick={() => setSidebarOpen(false)} className="hover:text-[#E8B4B8] transition">
                Profile
              </Link>
              {!loading && isAdmin && (
                <Link href="/admin" onClick={() => setSidebarOpen(false)} className="hover:text-[#E8B4B8] transition">
                  Admin Dashboard
                </Link>
              )}
              {showInstallButton && (
                <button
                  onClick={handleInstallClick}
                  className="mt-4 bg-[#E8B4B8] text-white py-2 rounded-full font-medium shadow-sm hover:shadow-md transition"
                >
                  Install App
                </button>
              )}
              <button
                onClick={handleLogout}
                className="mt-4 bg-[#2C2C2C] text-white py-2 rounded-full font-medium hover:bg-[#3c3c3c] transition"
              >
                Logout
              </button>
            </nav>

            <div className="mt-auto text-center text-sm text-gray-400">
              © {new Date().getFullYear()} Luxe Beauty Salon
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
