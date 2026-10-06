import Image from "next/image";
import { BarChart3, Camera, Megaphone, ShieldCheck, Home, Briefcase, Globe } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us | Rent Your Property",
  description: "Learn more about Rent Your Property and our story.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white pb-24">
      {/* ── 1. Hero Section ────────────────────────────────────── */}
      <section className="relative flex min-h-[500px] md:min-h-[600px] w-full flex-col items-center justify-center overflow-hidden bg-slate-900">
        {/* Background Image Layer */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070"
            alt="Cityscape"
            fill
            className="object-cover object-bottom"
            priority
          />
        </div>

        {/* Dual Shading Gradients (Matching Homepage) */}
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-black/80 via-black/40 to-transparent" />

        {/* Atmospheric Glow Element (Matching Homepage) */}
        <div className="absolute left-1/2 top-1/4 z-0 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/30 blur-[140px] md:h-[700px] md:w-[700px]" />
        
        {/* Hero Content */}
        <div className="relative z-10 flex flex-col items-center text-center px-4 max-w-4xl mx-auto mt-16">
          <span className="mb-6 inline-flex items-center rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-white backdrop-blur-md shadow-lg">
            <span className="mr-2 flex size-2 rounded-full bg-primary animate-pulse" />
            About Us
          </span>
          <h1 className="mb-6 font-heading text-4xl md:text-6xl font-bold text-white tracking-tight leading-tight drop-shadow-md">
            Redefining the <br className="hidden sm:block" /> Rental Experience
          </h1>
          <p className="text-base md:text-lg text-slate-200 leading-relaxed max-w-2xl drop-shadow">
            We are Pakistan's most trusted platform for renting properties, connecting reliable landlords with verified tenants through transparency, speed, and professionalism.
          </p>
        </div>
      </section>

      {/* ── 2. Our Story & Next Avenue Connection ────────────────────── */}
      <section className="relative z-20 mx-auto max-w-7xl px-4 py-20 md:py-32">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
          {/* Left Text Content */}
          <div className="flex flex-1 flex-col justify-center">
            <span className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-primary">
              Our Heritage
            </span>
            <h2 className="mb-6 font-heading text-2xl font-bold text-foreground">
              Backed by Pakistan's Real Estate Leaders
            </h2>
            <div className="space-y-6 text-base md:text-lg leading-relaxed text-slate-500">
              <p>
                Rent Your Property was built with a singular vision: to revolutionize the rental market by removing the friction, hidden fees, and uncertainty that have traditionally plagued it.
              </p>
              <p>
                As a proud member of the <a href="https://www.nextavenuepk.com/" target="_blank" rel="noopener noreferrer" className="font-bold text-slate-900 hover:text-primary transition-colors underline underline-offset-4 decoration-slate-200 hover:decoration-primary">Next Avenue</a> family of companies, we bring decades of industry expertise, an unshakeable reputation, and a massive network of verified users to the rental ecosystem.
              </p>
              <p>
                Whether you are a landlord looking for peace of mind or a tenant searching for a place to call home, we combine the cutting-edge technology of a modern startup with the profound market trust of Next Avenue.
              </p>
            </div>
          </div>

          {/* Right Image Content */}
          <div className="relative w-full lg:w-1/2 aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl shadow-slate-200/50 ring-1 ring-slate-100">
            <Image
              src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1000"
              alt="Professional Team"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* ── 3. What We Do ───────────────────────────────────── */}
      <section className="bg-slate-50/80 py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Our Expertise</span>
            <h2 className="mt-2 font-heading text-2xl font-bold text-foreground">How We Help You</h2>
            <p className="mt-6 text-lg leading-relaxed text-slate-500">
              We provide an end-to-end rental experience. Our goal is to lease your property faster, at the best possible rental yield, with zero stress.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: "Accurate Rent Valuations",
                desc: "Data-driven market analysis to price your rental competitively from day one.",
                icon: <BarChart3 className="size-6 stroke-[1.5]" />,
              },
              {
                title: "Premium Presentation",
                desc: "High-quality photography and detailed descriptions to make your listing stand out.",
                icon: <Camera className="size-6 stroke-[1.5]" />,
              },
              {
                title: "Targeted Marketing",
                desc: "Strategic digital campaigns reaching thousands of qualified tenants quickly.",
                icon: <Megaphone className="size-6 stroke-[1.5]" />,
              },
              {
                title: "Secure Tenancy",
                desc: "End-to-end documentation assistance for a transparent, risk-free lease agreement.",
                icon: <ShieldCheck className="size-6 stroke-[1.5]" />,
              }
            ].map((item, i) => (
              <div key={i} className="group relative flex flex-col rounded-3xl bg-white p-8 shadow-xl shadow-slate-200/40 border border-slate-100 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
                <div className="mb-6 flex size-14 items-center justify-center rounded-2xl bg-primary/5 text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-white">
                  {item.icon}
                </div>
                <h3 className="mb-4 font-heading text-xl font-bold text-slate-900">{item.title}</h3>
                <p className="leading-relaxed text-slate-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. Targeted Customers ───────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 mt-24 md:mt-32">
        <div className="rounded-[40px] bg-slate-900 px-6 py-16 md:p-20 relative overflow-hidden">
          {/* Background Pattern/Glow */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-72 h-72 rounded-full bg-primary opacity-20 blur-[100px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-72 h-72 rounded-full bg-white opacity-10 blur-[100px] pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row gap-12 lg:gap-20 items-center">
            <div className="lg:w-1/3 space-y-6 text-center lg:text-left">
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary">Our Audience</span>
              <h2 className="mt-2 font-heading text-2xl font-bold text-white">Who We Serve</h2>
              <p className="text-base leading-relaxed text-slate-300">
                If you value transparency, speed, and professionalism, Rent Your Property is built precisely for you.
              </p>
            </div>

            <div className="lg:w-2/3 grid sm:grid-cols-3 gap-4 md:gap-6">
              {[
                {
                  title: "Landlords",
                  desc: "Looking to rent residential or commercial properties quickly to verified tenants.",
                  icon: <Home className="h-5 w-5 text-slate-200" />
                },
                {
                  title: "Tenants",
                  desc: "Seeking transparent pricing and direct access to premium rental spaces.",
                  icon: <Briefcase className="h-5 w-5 text-slate-200" />
                },
                {
                  title: "Expats",
                  desc: "Overseas Pakistanis needing a trustworthy partner for remote property management.",
                  icon: <Globe className="h-5 w-5 text-slate-200" />
                }
              ].map((audience, i) => (
                <div key={i} className="flex flex-col rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-colors hover:bg-white/10">
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
                    {audience.icon}
                  </div>
                  <h3 className="mb-2 font-heading text-lg font-bold text-white">{audience.title}</h3>
                  <p className="text-sm leading-relaxed text-slate-400">{audience.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
