"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Search, Building2, ChevronLeft, ChevronRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useRouter } from "next/navigation";

const HERO_SLIDES = [
  {
    src: "/Hero-Blue-Area.png",
    title: <>Find Your Perfect <br className="hidden sm:block" /> Rental Home</>,
    subtitle: "Pakistan's most trusted platform for renting properties. Discover premium listings in top locations, with transparent pricing and direct owner contact."
  },
  {
    src: "/hero-faisal-mosque.jpg",
    title: <>Experience Premium <br className="hidden sm:block" /> Living</>,
    subtitle: "Browse exclusive rental properties offering unparalleled comfort, security, and world-class amenities in the heart of the city."
  },
  {
    src: "/hero-centaurus.png",
    title: <>Your Next Home <br className="hidden sm:block" /> Awaits</>,
    subtitle: "Connect directly with property owners and secure your ideal living space with zero hidden fees and maximum transparency."
  }
];

export function Hero({ locations = [] }: { locations?: any[] }) {
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [sector, setSector] = useState("");
  const [subSector, setSubSector] = useState("");
  const [type, setType] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [beds, setBeds] = useState("");
  const [baths, setBaths] = useState("");
  const [minArea, setMinArea] = useState("");
  const [maxArea, setMaxArea] = useState("");
  const [areaUnit, setAreaUnit] = useState("Marla");

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchQuery) params.set("q", searchQuery);
    if (sector) params.set("sector", sector);
    if (subSector) params.set("subSector", subSector);
    if (type) params.set("type", type);
    if (minPrice) params.set("min", minPrice);
    if (maxPrice) params.set("max", maxPrice);
    if (beds) params.set("beds", beds);
    if (baths) params.set("baths", baths);
    if (minArea) params.set("minArea", minArea);
    if (maxArea) params.set("maxArea", maxArea);
    if (areaUnit) params.set("areaUnit", areaUnit);

    router.push(`/rent?${params.toString()}`);
  };


  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrentSlide((p) => (p + 1) % HERO_SLIDES.length);
  const prevSlide = () => setCurrentSlide((p) => (p - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);

  return (
    <section className="relative flex min-h-[700px] w-full flex-col items-center justify-center overflow-hidden bg-slate-900 sm:min-h-[800px] lg:min-h-[880px]">
      {/* Multi-Layered Background Architecture */}
      <div className="absolute inset-0 z-0">
        {HERO_SLIDES.map((slide, index) => (
          <img
            key={slide.src}
            src={slide.src}
            alt={`Hero Background ${index + 1}`}
            className={cn(
              "absolute inset-0 h-full w-full object-cover object-center transition-all duration-1000 ease-in-out",
              currentSlide === index ? "opacity-100 scale-105" : "opacity-0 scale-100"
            )}
          />
        ))}
      </div>

      {/* Dual Shading Gradients */}
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-black/80 via-black/40 to-transparent" />

      {/* Atmospheric Glow Element */}
      <div className="absolute left-1/2 top-1/4 z-0 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/30 blur-[140px] md:h-[700px] md:w-[700px]" />

      {/* Main Content Enclosure */}
      <div className="relative z-10 flex w-full max-w-7xl flex-col items-center justify-center px-4 py-16 text-center sm:px-6 sm:py-24 lg:px-8 lg:py-28 mt-10">
        
        {/* Dynamic Text Container */}
        <div className="grid w-full place-items-center">
          {HERO_SLIDES.map((slide, index) => (
            <div 
              key={index} 
              className={cn(
                "[grid-area:1/1] flex w-full flex-col items-center justify-center transition-all duration-700 ease-in-out",
                currentSlide === index 
                  ? "opacity-100 translate-y-0 z-10" 
                  : "opacity-0 translate-y-4 pointer-events-none z-0"
              )}
            >
              <h1 className="font-heading text-5xl font-bold leading-tight tracking-tight text-white sm:text-6xl md:text-7xl lg:text-[5.5rem] drop-shadow-md">
                {slide.title}
              </h1>
              <p className="mt-6 max-w-xs text-sm font-medium leading-relaxed text-slate-200 sm:max-w-xl sm:text-lg md:max-w-2xl md:text-xl drop-shadow">
                {slide.subtitle}
              </p>
            </div>
          ))}
        </div>

        {/* Interactive Property Search & Filter Console */}
        <form 
          onSubmit={(e) => { e.preventDefault(); handleSearch(); }}
          className="mt-8 sm:mt-12 w-full max-w-3xl animate-in fade-in slide-in-from-bottom-10 flex flex-col gap-4 px-2 sm:px-0"
        >
          
          {/* Row 1: Primary Search Input (Mobile standalone, Desktop combined) */}
          <div className="relative flex w-full flex-col sm:flex-row items-center sm:rounded-full sm:bg-white/10 sm:p-2 sm:shadow-xl sm:backdrop-blur-md sm:border sm:border-white/20 gap-3 sm:gap-0">
            
            <div className="relative flex w-full items-center rounded-full bg-white/10 p-2 sm:bg-transparent sm:p-0 shadow-xl sm:shadow-none backdrop-blur-md sm:backdrop-blur-none border border-white/20 sm:border-none">
              <Search className="absolute left-4 sm:left-6 size-5 text-white/70" />
              <input
                type="text"
                placeholder="Search location, society, or keyword..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-12 w-full bg-transparent pl-12 sm:pl-14 pr-10 text-sm font-medium text-white placeholder:text-white/70 focus:outline-none sm:text-base"
              />
              {searchQuery && (
                <button 
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 text-white/70 hover:text-white"
                >
                  <X className="size-5" />
                </button>
              )}
            </div>

            {/* Desktop Action Button */}
            <Button type="submit" variant="accent" className="hidden sm:flex h-11 rounded-full px-8 py-3.5 shadow-md hover:shadow-lg transition-all">
              Search
            </Button>
          </div>

          {/* Row 2: Secondary Quick-Filters & Popovers */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
            {/* Sector Dropdown */}
            <Select value={sector} onValueChange={(val) => { setSector(val); setSubSector(""); }}>
              <SelectTrigger className="h-9 sm:h-8 rounded-full border-white/20 bg-white/10 px-4 py-1.5 text-[11px] sm:text-[11px] font-bold text-white data-placeholder:text-white [&_svg]:text-white backdrop-blur-sm hover:bg-white/20 data-[state=open]:bg-white/20">
                <SelectValue placeholder="Sector" />
              </SelectTrigger>
              <SelectContent position="popper" sideOffset={4} className="rounded-xl border-white/20 bg-background/95 backdrop-blur-md">
                {locations?.map((loc) => (
                  <SelectItem key={loc.name} value={loc.name}>{loc.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Sub-Sector Dropdown (Appears if selected sector has sub-sectors) */}
            {sector && locations?.find((l) => l.name === sector)?.subSectors?.length > 0 && (
              <Select value={subSector} onValueChange={setSubSector}>
                <SelectTrigger className="h-9 sm:h-8 rounded-full border-white/20 bg-white/10 px-4 py-1.5 text-[11px] sm:text-[11px] font-bold text-white data-placeholder:text-white [&_svg]:text-white backdrop-blur-sm hover:bg-white/20 data-[state=open]:bg-white/20">
                  <SelectValue placeholder="Sub-Sector" />
                </SelectTrigger>
                <SelectContent position="popper" sideOffset={4} className="rounded-xl border-white/20 bg-background/95 backdrop-blur-md">
                  <SelectItem value="any">Any Sub-Sector</SelectItem>
                  {locations.find((l) => l.name === sector)?.subSectors.map((sub: any) => (
                    <SelectItem key={sub.name} value={sub.name}>{sub.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            <Select value={type} onValueChange={setType}>
              <SelectTrigger className="h-9 sm:h-8 rounded-full border-white/20 bg-white/10 px-4 py-1.5 text-[11px] sm:text-[11px] font-bold text-white data-placeholder:text-white [&_svg]:text-white backdrop-blur-sm hover:bg-white/20 data-[state=open]:bg-white/20">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent position="popper" sideOffset={4} className="rounded-xl border-white/20 bg-background/95 backdrop-blur-md">
                <SelectItem value="house">House</SelectItem>
                <SelectItem value="apartment">Apartment</SelectItem>
                <SelectItem value="commercial">Commercial</SelectItem>
                <SelectItem value="office">Office</SelectItem>
                <SelectItem value="upper_portion">Upper Portion</SelectItem>
                <SelectItem value="lower_portion">Lower Portion</SelectItem>
                <SelectItem value="shop">Shop</SelectItem>
                <SelectItem value="plot">Plot</SelectItem>
              </SelectContent>
            </Select>

            {/* Interactive Price Range Popover */}
            <Popover>
              <PopoverTrigger asChild>
                <button type="button" className="flex h-9 sm:h-8 items-center rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-[11px] sm:text-[11px] font-bold text-white backdrop-blur-sm transition-colors hover:bg-white/20 data-[state=open]:bg-white/20">
                  {minPrice || maxPrice ? 'Price Set' : 'Price Range'}
                </button>
              </PopoverTrigger>
              <PopoverContent sideOffset={4} className="w-72 rounded-2xl border-white/20 bg-background/95 p-5 shadow-xl backdrop-blur-md" align="center">
                <div className="space-y-4">
                  <h4 className="font-heading text-sm font-bold text-foreground">Select Price Range</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Min (PKR)</label>
                      <Input 
                        type="number" 
                        placeholder="0" 
                        value={minPrice} 
                        onChange={(e) => setMinPrice(e.target.value)}
                        className="h-8 rounded-lg font-mono text-xs" 
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Max (PKR)</label>
                      <Input 
                        type="number" 
                        placeholder="Any" 
                        value={maxPrice} 
                        onChange={(e) => setMaxPrice(e.target.value)}
                        className="h-8 rounded-lg font-mono text-xs" 
                      />
                    </div>
                  </div>
                  <Button type="button" variant="default" className="w-full rounded-xl" size="sm" onClick={() => document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))}>
                    Apply Price
                  </Button>
                </div>
              </PopoverContent>
            </Popover>

            {/* Beds & Baths Popover */}
            <Popover>
              <PopoverTrigger asChild>
                <button type="button" className="flex h-9 sm:h-8 items-center rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-[11px] sm:text-[11px] font-bold text-white backdrop-blur-sm transition-colors hover:bg-white/20 data-[state=open]:bg-white/20">
                  {beds || baths ? 'Beds/Baths Set' : 'Beds & Baths'}
                </button>
              </PopoverTrigger>
              <PopoverContent sideOffset={4} className="w-64 rounded-2xl border-white/20 bg-background/95 p-5 shadow-xl backdrop-blur-md" align="center">
                <div className="space-y-4">
                  <h4 className="font-heading text-sm font-bold text-foreground">Beds & Bathrooms</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Beds</label>
                      <Select value={beds} onValueChange={(v) => setBeds(v === 'clear' ? '' : v)}>
                        <SelectTrigger className="h-8 rounded-lg text-xs">
                          <SelectValue placeholder="Any" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="clear">Any</SelectItem>
                          <SelectItem value="1">1+</SelectItem>
                          <SelectItem value="2">2+</SelectItem>
                          <SelectItem value="3">3+</SelectItem>
                          <SelectItem value="4">4+</SelectItem>
                          <SelectItem value="5">5+</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Baths</label>
                      <Select value={baths} onValueChange={(v) => setBaths(v === 'clear' ? '' : v)}>
                        <SelectTrigger className="h-8 rounded-lg text-xs">
                          <SelectValue placeholder="Any" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="clear">Any</SelectItem>
                          <SelectItem value="1">1+</SelectItem>
                          <SelectItem value="2">2+</SelectItem>
                          <SelectItem value="3">3+</SelectItem>
                          <SelectItem value="4">4+</SelectItem>
                          <SelectItem value="5">5+</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <Button type="button" variant="default" className="w-full rounded-xl" size="sm" onClick={() => document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))}>
                    Apply Rooms
                  </Button>
                </div>
              </PopoverContent>
            </Popover>

            {/* Area Size Popover */}
            <Popover>
              <PopoverTrigger asChild>
                <button type="button" className="flex h-9 sm:h-8 items-center rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-[11px] sm:text-[11px] font-bold text-white backdrop-blur-sm transition-colors hover:bg-white/20 data-[state=open]:bg-white/20">
                  {minArea || maxArea ? 'Area Set' : 'Area Size'}
                </button>
              </PopoverTrigger>
              <PopoverContent sideOffset={4} className="w-72 rounded-2xl border-white/20 bg-background/95 p-5 shadow-xl backdrop-blur-md" align="center">
                <div className="space-y-4">
                  <h4 className="font-heading text-sm font-bold text-foreground">Property Area</h4>
                  <div className="space-y-3">
                    <Select value={areaUnit} onValueChange={setAreaUnit}>
                      <SelectTrigger className="h-8 rounded-lg text-xs w-full">
                        <SelectValue placeholder="Unit" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Marla">Marla</SelectItem>
                        <SelectItem value="Kanal">Kanal</SelectItem>
                        <SelectItem value="Sq. Yd.">Sq. Yd.</SelectItem>
                        <SelectItem value="Sq. Ft.">Sq. Ft.</SelectItem>
                      </SelectContent>
                    </Select>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Min</label>
                        <Input 
                          type="number" 
                          placeholder="0" 
                          value={minArea} 
                          onChange={(e) => setMinArea(e.target.value)}
                          className="h-8 rounded-lg font-mono text-xs" 
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Max</label>
                        <Input 
                          type="number" 
                          placeholder="Any" 
                          value={maxArea} 
                          onChange={(e) => setMaxArea(e.target.value)}
                          className="h-8 rounded-lg font-mono text-xs" 
                        />
                      </div>
                    </div>
                  </div>
                  <Button type="button" variant="default" className="w-full rounded-xl" size="sm" onClick={() => document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))}>
                    Apply Area
                  </Button>
                </div>
              </PopoverContent>
            </Popover>

            {/* Active Filter Reset */}
            {(searchQuery || sector || type || minPrice || maxPrice || beds || baths || minArea || maxArea) && (
              <button 
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setSector("");
                  setType("");
                  setMinPrice("");
                  setMaxPrice("");
                  setBeds("");
                  setBaths("");
                  setMinArea("");
                  setMaxArea("");
                }}
                className="ml-2 text-[11px] font-bold text-white/70 underline underline-offset-4 hover:text-white"
              >
                Reset
              </button>
            )}
          </div>

          {/* Mobile Action Buttons */}
          <div className="mt-2 flex w-full flex-row gap-2 sm:hidden">
            <Button type="submit" variant="accent" className="h-12 flex-1 rounded-full text-[11px] font-bold shadow-xl px-1">
              Search Rentals
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => window.open('https://nextavenue.pk', '_blank')}
              className="h-12 flex-1 rounded-full border-white/20 bg-white/10 text-[11px] font-bold text-white shadow-xl backdrop-blur-md hover:bg-white/20 hover:text-white px-1 whitespace-normal leading-tight text-center"
            >
              Sell Property
            </Button>
          </div>

        </form>
      </div>

      {/* Morphing Slide Pagination Indicators */}
      <div className="absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2">
        {HERO_SLIDES.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={cn(
              "h-[7px] rounded-full bg-white transition-all duration-300",
              currentSlide === index ? "w-[24px] opacity-100" : "w-[7px] opacity-50 hover:opacity-75"
            )}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
