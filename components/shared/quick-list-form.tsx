"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowRight, Building } from "lucide-react";

export function QuickListForm({ locations }: { locations: any[] }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [sector, setSector] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (name) params.set("ownerName", name);
    if (phone) params.set("phone", phone);
    if (sector) params.set("sector", sector);
    
    router.push(`/list-property?${params.toString()}`);
  };

  return (
    <section className="bg-white py-12 border-b border-slate-100">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 md:p-10 shadow-2xl shadow-slate-200/40 relative overflow-hidden">
          {/* Decorative Glow */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-brand-accent/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-center relative z-10">
            {/* Left side text */}
            <div className="w-full lg:w-1/3 text-center lg:text-left space-y-3">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-brand-accent/10 text-brand-accent mx-auto lg:mx-0 shadow-inner">
                <Building className="w-7 h-7" />
              </div>
              <h2 className="text-3xl font-black font-heading text-slate-900 tracking-tight">List Your Property</h2>
              <p className="text-slate-500 text-sm sm:text-base leading-relaxed">
                Enter your basic details below to get started. Find highly qualified tenants fast with zero upfront fees.
              </p>
            </div>
            
            {/* Right side form */}
            <div className="w-full lg:w-2/3">
              <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input 
                  placeholder="Your Full Name" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)}
                  className="h-14 bg-white rounded-xl border-slate-200 focus-visible:ring-brand-accent/20"
                  required
                />
                <Input 
                  placeholder="Phone Number (e.g. 0300...)" 
                  value={phone} 
                  onChange={(e) => setPhone(e.target.value)}
                  className="h-14 bg-white rounded-xl border-slate-200 focus-visible:ring-brand-accent/20"
                  required
                />
                <Select value={sector} onValueChange={setSector} required>
                  <SelectTrigger className="h-14 bg-white rounded-xl border-slate-200 focus:ring-brand-accent/20">
                    <SelectValue placeholder="Property Sector (e.g. F-8)" />
                  </SelectTrigger>
                  <SelectContent className="max-h-60 rounded-xl">
                    {locations.map((loc) => (
                      <SelectItem key={loc.name} value={loc.name}>{loc.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button type="submit" className="h-14 rounded-xl bg-brand-accent hover:bg-brand-accent/90 text-white font-bold text-base transition-all shadow-lg shadow-brand-accent/20 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0">
                  Start Listing <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
