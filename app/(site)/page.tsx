import Link from "next/link";
import Image from "next/image";
import { db } from "@/lib/db";
import { listings } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { ListingCard } from "@/components/shared/listing-card";
import { Hero } from "@/components/shared/hero";
import {
  Search,
  ShieldCheck,
  TrendingUp,
  Handshake,
  Clock,
  ArrowRight,
} from "lucide-react";
import { QuickListForm } from "@/components/shared/quick-list-form";

/* ───────────────────────────── mock data ───────────────────────────── */


const whyChooseUs = [
  {
    icon: ShieldCheck,
    title: "Trusted Expertise",
    copy: "Decades of experience navigating Pakistan's real estate market with integrity.",
  },
  {
    icon: TrendingUp,
    title: "Market Insights",
    copy: "Data-driven valuations so you price your property right from day one.",
  },
  {
    icon: Handshake,
    title: "End-to-End Support",
    copy: "From listing to closing — we handle documentation, marketing, and negotiations.",
  },
  {
    icon: Clock,
    title: "Fast Results",
    copy: "Our network of qualified tenants means shorter listing times and faster closings.",
  },
];

import { getLocations } from "@/app/actions/locations";

/* ─────────────────────────────── page ─────────────────────────────── */

export default async function HomePage() {
  const latestListings = await db
    .select()
    .from(listings)
    .where(eq(listings.status, "published"))
    .orderBy(desc(listings.createdAt))
    .limit(4);

  const locations = await getLocations();

  return (
    <div>
      <Hero locations={locations} />

      {/* ── 1.25. Parent Company Banner ───────────────────────────────── */}
      <div className="bg-slate-900 border-t border-slate-800 py-3 sm:py-4 relative z-20">
        <div className="mx-auto max-w-7xl px-4 text-center">
          <p className="text-xs sm:text-sm font-medium text-slate-300">
            Proudly part of the <a href="https://nextavenue.pk" target="_blank" rel="noopener noreferrer" className="font-bold text-white hover:text-primary transition-colors underline underline-offset-4 decoration-slate-600 hover:decoration-primary">Next Avenue</a> family. Looking to buy or sell instead? 
            <a href="https://nextavenue.pk" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary/80 font-bold ml-1.5 inline-flex items-center">
              Visit Next Avenue <ArrowRight className="ml-1 size-3" />
            </a>
          </p>
        </div>
      </div>

      {/* ── 1.5. Quick List Form ──────────────────────────────────────── */}
      <QuickListForm locations={locations} />


      {/* ── 2. Featured Listings ────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 py-14 md:px-6 md:py-20">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="font-heading text-2xl font-bold text-foreground">
              Featured Properties
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Hand-picked listings from Islamabad&apos;s most sought-after
              locations.
            </p>
          </div>
          <Button variant="ghost" size="sm" className="hidden sm:flex" asChild>
            <Link href="/rent">
              View all
              <ArrowRight className="ml-1 size-3.5" />
            </Link>
          </Button>
        </div>

        {/* Horizontal scroll on mobile, grid on md+ */}
        <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-none md:grid md:grid-cols-2 md:overflow-visible md:pb-0 lg:grid-cols-4">
          {latestListings.map((listing) => (
            <div
              key={listing.id}
              className="w-[280px] flex-shrink-0 snap-start md:w-auto"
            >
              <ListingCard {...listing as any} />
            </div>
          ))}
        </div>

        <div className="mt-6 text-center sm:hidden">
          <Button variant="outline" size="sm" asChild>
            <Link href="/rent">
              View all listings
              <ArrowRight className="ml-1 size-3.5" />
            </Link>
          </Button>
        </div>
      </section>

      {/* ── 3. About Summary ───────────────────────────────────── */}
      <section className="bg-white py-20 md:py-32">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="flex flex-col gap-12 lg:flex-row lg:items-center lg:gap-20">
            {/* Image side with clean floating card effect */}
            <div className="relative w-full lg:w-1/2">
              <div className="relative z-10 aspect-[4/3] w-full overflow-hidden rounded-3xl shadow-2xl shadow-slate-200/50 ring-1 ring-slate-100">
                <Image
                  src="/hero-centaurus.png"
                  alt="About Rent Your Property - Centaurus Mall"
                  fill
                  className="object-cover transition-transform duration-700 hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              {/* Decorative background element for professional look */}
              <div className="absolute -bottom-6 -left-6 z-0 h-full w-full rounded-3xl border border-slate-100 bg-slate-50/50 sm:-bottom-8 sm:-left-8" />
            </div>

            {/* Clean typography side */}
            <div className="flex flex-col space-y-6 lg:w-1/2">
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
                  Who We Are
                </span>
                <h2 className="font-heading text-2xl font-bold text-foreground">
                  About Rent Your Property
                </h2>
              </div>
              
              <div className="space-y-4 text-base leading-relaxed text-slate-500 sm:text-lg">
                <p>
                  Rent Your Property is connecting homeowners with serious tenants through transparent valuations, professional marketing, and end-to-end transaction support.
                </p>
                <p>
                  We believe renting your property should be straightforward — no hidden fees, no unnecessary delays. Whether you&apos;re listing a family home in Islamabad&apos;s residential sectors or a commercial space in the business district, our team brings local expertise to every deal.
                </p>
                
                <p className="border-l-2 border-primary/30 pl-4 py-1 italic text-sm text-slate-400 mt-6">
                  As the dedicated rental platform of the <a href="https://nextavenue.pk" target="_blank" rel="noopener noreferrer" className="font-bold text-slate-700 hover:text-primary transition-colors underline underline-offset-4">Next Avenue</a> family, we bring the same trust, transparency, and excellence you expect from Pakistan's premier real estate network.
                </p>
              </div>

              <div className="pt-4">
                <Button variant="default" className="rounded-full px-8 py-6 text-sm font-bold shadow-lg shadow-primary/20 hover:-translate-y-1 hover:shadow-xl transition-all" asChild>
                  <Link href="/about">
                    Discover Our Story
                    <ArrowRight className="ml-2 size-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. Why Choose Us ───────────────────────────────────── */}
      <section className="bg-slate-50/80 py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="mb-20 text-center max-w-3xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
              Our Advantages
            </span>
            <h2 className="mt-1 font-heading text-2xl font-bold text-foreground">
              Why Choose Rent Your Property
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-slate-500">
              We make renting property simple, transparent, and fast. Discover the premium features that set us apart from the rest.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {whyChooseUs.map((item, index) => (
              <div
                key={item.title}
                className="group relative flex flex-col rounded-3xl bg-white p-8 shadow-xl shadow-slate-200/40 border border-slate-100 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
              >
                <div className="mb-6 flex size-14 items-center justify-center rounded-2xl bg-primary/5 text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-white">
                  <item.icon className="size-6 stroke-[1.5]" />
                </div>
                <h3 className="mb-4 font-heading text-xl font-bold text-slate-900">
                  {item.title}
                </h3>
                <p className="leading-relaxed text-slate-500">
                  {item.copy}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. Final CTA Banner ────────────────────────────────── */}
      <section className="relative overflow-hidden bg-slate-900 border-t border-slate-800 py-16 md:py-24">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/hero-pakistan-monument.jpg"
            alt="Pakistan Monument Islamabad"
            fill
            className="object-cover object-center opacity-25 mix-blend-overlay grayscale"
          />
        </div>

        {/* Subtle Background Glows */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[400px] h-[400px] rounded-full bg-primary/20 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-[300px] h-[300px] rounded-full bg-primary/10 blur-[100px] pointer-events-none" />

        <div className="relative z-10 mx-auto max-w-7xl px-4 md:px-6">
          <div className="flex flex-col items-center justify-between gap-8 md:flex-row md:gap-12">
            <div className="flex-1 text-center md:text-left">
              <h2 className="font-heading text-2xl font-bold text-white md:text-3xl">
                Ready to Rent Out Your Property?
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-400 md:text-base mx-auto md:mx-0">
                List with Rent Your Property and get your property in front of thousands of
                qualified tenants. No upfront fees — we only succeed when you do.
              </p>
            </div>
            
            <div className="flex-shrink-0">
              <Button
                size="lg"
                className="h-14 rounded-full px-8 text-base font-bold bg-primary text-white hover:bg-primary/90 shadow-xl shadow-primary/20 hover:-translate-y-1 transition-all"
                asChild
              >
                <Link href="/list-property">
                  Get Started — It&apos;s Free
                  <ArrowRight className="ml-2 size-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
