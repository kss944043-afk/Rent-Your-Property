"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { X, Home, ArrowRight } from "lucide-react";

export function LandlordSlideIn() {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(true);

  useEffect(() => {
    // Only run on the client side
    const dismissed = sessionStorage.getItem("landlord_banner_dismissed");
    if (!dismissed) {
      setIsDismissed(false);
      // Wait 3 seconds before sliding in
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, []);

  if (isDismissed) return null;

  return (
    <div
      className={`fixed bottom-4 left-4 md:bottom-8 md:left-8 z-[100] max-w-sm w-[calc(100%-2rem)] bg-white rounded-2xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.2)] border border-slate-100 p-5 transform transition-all duration-700 ease-out ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-32 opacity-0 pointer-events-none"
      }`}
    >
      <button 
        onClick={() => {
          setIsVisible(false);
          sessionStorage.setItem("landlord_banner_dismissed", "true");
          setTimeout(() => setIsDismissed(true), 700);
        }}
        className="absolute top-3 right-3 p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors"
        aria-label="Close"
      >
        <X className="w-4 h-4" />
      </button>

      <div className="flex gap-4 items-start">
        <div className="shrink-0 mt-0.5">
          <div className="w-12 h-12 rounded-full bg-brand-accent/10 flex items-center justify-center shadow-inner">
            <Home className="w-6 h-6 text-brand-accent" />
          </div>
        </div>
        <div>
          <h3 className="font-heading font-bold text-slate-900 text-base leading-tight mb-1.5">
            Are you a landlord?
          </h3>
          <p className="text-sm text-slate-500 mb-4 leading-relaxed pr-2">
            List your property with us today and find highly qualified tenants fast.
          </p>
          <Link 
            href="/list-property"
            onClick={() => sessionStorage.setItem("landlord_banner_dismissed", "true")}
            className="inline-flex items-center gap-2 text-sm font-semibold bg-brand-accent text-white px-5 py-2.5 rounded-xl hover:bg-brand-accent/90 hover:scale-105 active:scale-95 transition-all shadow-md hover:shadow-lg"
          >
            List Your Property <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
