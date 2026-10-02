import { db } from "@/lib/db";
import { listings } from "@/db/schema";
import { eq, and, gte, lte, or, ilike } from "drizzle-orm";
import { ListingCard } from "@/components/shared/listing-card";
import { Search, MapPin, Building, Bed, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Properties for Rent | Rent Your Property",
  description: "Browse premium houses, apartments, and commercial properties for rent in Islamabad and Rawalpindi.",
};

export const dynamic = "force-dynamic";

export default async function RentPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;

  // Build filters from URL
  const conditions = [eq(listings.status, "published")];

  if (params.q && typeof params.q === "string") {
    const words = params.q.split(" ").filter(w => w.trim().length > 0);
    if (words.length > 0) {
      const wordConditions = words.map(word => 
        or(
          ilike(listings.title, `%${word}%`),
          ilike(listings.address, `%${word}%`),
          ilike(listings.sector, `%${word}%`),
          ilike(listings.description, `%${word}%`)
        )
      );
      const wordAnd = and(...wordConditions);
      if (wordAnd) {
        conditions.push(wordAnd);
      }
    }
  }

  if (params.type && typeof params.type === "string") {
    conditions.push(eq(listings.propertyType, params.type as any));
  }
  if (params.sector && typeof params.sector === "string") {
    conditions.push(eq(listings.sector, params.sector));
  }
  if (params.min && typeof params.min === "string") {
    conditions.push(gte(listings.monthlyRent, parseInt(params.min)));
  }
  if (params.max && typeof params.max === "string") {
    conditions.push(lte(listings.monthlyRent, parseInt(params.max)));
  }
  if (params.beds && typeof params.beds === "string") {
    conditions.push(gte(listings.bedrooms, parseInt(params.beds)));
  }
  if (params.baths && typeof params.baths === "string") {
    conditions.push(gte(listings.bathrooms, parseInt(params.baths)));
  }
  if (params.minArea && typeof params.minArea === "string") {
    conditions.push(gte(listings.area, parseInt(params.minArea)));
  }
  if (params.maxArea && typeof params.maxArea === "string") {
    conditions.push(lte(listings.area, parseInt(params.maxArea)));
  }
  // Only filter by areaUnit if the user actually specified an area range
  if ((params.minArea || params.maxArea) && params.areaUnit && typeof params.areaUnit === "string") {
    conditions.push(ilike(listings.areaUnit, params.areaUnit));
  }
  
  if (params.subSector && typeof params.subSector === "string") {
    conditions.push(eq(listings.subSector, params.subSector));
  }

  const results = await db
    .select()
    .from(listings)
    .where(and(...conditions))
    .orderBy(listings.createdAt);

  const { getLocations } = await import("@/app/actions/locations");
  const locations = await getLocations();

  return (
    <div className="min-h-screen bg-slate-50/50">
      {/* Hero Header */}
      <section className="relative flex h-[350px] md:h-[450px] w-full flex-col items-center justify-center overflow-hidden bg-neutral-900">
        <div className="absolute inset-0 z-0">
          <img
            src="/hero-centaurus.png"
            alt="Properties for Rent in Islamabad"
            className="absolute inset-0 h-full w-full object-cover opacity-60"
          />
          {/* Dual Shading Gradients & Glow matching Homepage */}
          <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/40 to-transparent" />
          <div className="absolute left-1/2 top-1/4 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/30 blur-[140px] md:h-[700px] md:w-[700px]" />
        </div>
        
        <div className="z-10 mx-auto max-w-7xl text-center px-4 -mt-10">
          <span className="mb-4 block text-[10px] font-bold uppercase tracking-[0.2em] text-white/80 drop-shadow-sm">
            Explore Rentals
          </span>
          <h1 className="font-heading text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl drop-shadow-lg">
            Find Your Ideal <br className="hidden md:block" />
            <span className="text-white">Rental Property.</span>
          </h1>
          <p className="mt-4 max-w-xl text-sm md:text-base text-white/90 mx-auto font-medium drop-shadow">
            Browse our exclusive portfolio of premium residential and commercial properties for rent in Islamabad.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar / Filters */}
          <div className="w-full lg:w-[320px] lg:shrink-0">
            <div className="sticky top-24 rounded-[2rem] border border-slate-100 bg-white p-6 shadow-xl shadow-slate-200/40">
              <div className="mb-6 flex items-center justify-between border-b border-slate-100 pb-4">
                <h2 className="font-heading text-lg font-bold text-slate-900">
                  Search Filters
                </h2>
                <div className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Search className="size-4" />
                </div>
              </div>

              {/* The form submits a GET request to update URL parameters */}
              <form method="GET" action="/rent" className="space-y-6">
                
                {/* Keyword Search */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-500">
                    <Search className="size-3.5" /> Keyword Search
                  </label>
                  <input 
                    name="q" 
                    type="text" 
                    placeholder="Search titles, addresses..." 
                    defaultValue={params.q as string || ""} 
                    className="w-full h-12 rounded-xl bg-slate-50 border-slate-200 px-4 text-sm font-medium text-slate-900 focus:ring-primary/20 placeholder:text-slate-400" 
                  />
                </div>

                {/* Sector */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-500">
                    <MapPin className="size-3.5" /> Sector / Location
                  </label>
                  <select name="sector" defaultValue={params.sector as string || ""} className="w-full h-12 rounded-xl bg-slate-50 border-slate-200 px-4 text-sm font-medium text-slate-900 focus:ring-primary/20">
                    <option value="">All Sectors</option>
                    {locations.map((loc) => (
                      <option key={loc.name} value={loc.name}>{loc.name}</option>
                    ))}
                  </select>
                </div>

                {/* Sub-Sector */}
                {params.sector && (locations.find(l => l.name === params.sector)?.subSectors?.length ?? 0) > 0 && (
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-500">
                      Sub-Sector
                    </label>
                    <select name="subSector" defaultValue={params.subSector as string || ""} className="w-full h-12 rounded-xl bg-slate-50 border-slate-200 px-4 text-sm font-medium text-slate-900 focus:ring-primary/20">
                      <option value="">All Sub-Sectors</option>
                      {locations.find(l => l.name === params.sector)?.subSectors.map((sub: any) => (
                        <option key={sub.name} value={sub.name}>{sub.name}</option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Property Type */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-500">
                    <Building className="size-3.5" /> Property Type
                  </label>
                  <select name="type" defaultValue={params.type as string || ""} className="w-full h-12 rounded-xl bg-slate-50 border-slate-200 px-4 text-sm font-medium text-slate-900 focus:ring-primary/20">
                    <option value="">All Types</option>
                    <option value="house">House</option>
                    <option value="apartment">Apartment</option>
                    <option value="commercial">Commercial</option>
                    <option value="office">Office</option>
                    <option value="upper_portion">Upper Portion</option>
                    <option value="lower_portion">Lower Portion</option>
                    <option value="shop">Shop</option>
                  </select>
                </div>

                {/* Monthly Rent Range */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-500">
                    <Wallet className="size-3.5" /> Monthly Rent (PKR)
                  </label>
                  <div className="flex items-center gap-2">
                    <input name="min" type="number" placeholder="Min" defaultValue={params.min as string || ""} className="w-full h-12 rounded-xl bg-slate-50 border-slate-200 px-4 text-sm font-medium text-slate-900 focus:ring-primary/20" />
                    <span className="text-slate-400">-</span>
                    <input name="max" type="number" placeholder="Max" defaultValue={params.max as string || ""} className="w-full h-12 rounded-xl bg-slate-50 border-slate-200 px-4 text-sm font-medium text-slate-900 focus:ring-primary/20" />
                  </div>
                </div>

                {/* Area */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-500">
                    <Building className="size-3.5" /> Area Size
                  </label>
                  <div className="flex gap-2">
                    <input name="minArea" type="number" placeholder="Min" defaultValue={params.minArea as string || ""} className="w-full h-12 rounded-xl bg-slate-50 border-slate-200 px-4 text-sm font-medium text-slate-900 focus:ring-primary/20" />
                    <input name="maxArea" type="number" placeholder="Max" defaultValue={params.maxArea as string || ""} className="w-full h-12 rounded-xl bg-slate-50 border-slate-200 px-4 text-sm font-medium text-slate-900 focus:ring-primary/20" />
                  </div>
                  <select name="areaUnit" defaultValue={params.areaUnit as string || "Marla"} className="w-full h-12 rounded-xl bg-slate-50 border-slate-200 px-4 text-sm font-medium text-slate-900 focus:ring-primary/20">
                    <option value="Marla">Marla</option>
                    <option value="Kanal">Kanal</option>
                    <option value="Sq. Yd.">Sq. Yd.</option>
                    <option value="Sq. Ft.">Sq. Ft.</option>
                  </select>
                </div>

                {/* Beds & Baths */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-500">
                      <Bed className="size-3.5" /> Beds
                    </label>
                    <select name="beds" defaultValue={params.beds as string || ""} className="w-full h-12 rounded-xl bg-slate-50 border-slate-200 px-4 text-sm font-medium text-slate-900 focus:ring-primary/20">
                      <option value="">Any</option>
                      <option value="1">1+</option>
                      <option value="2">2+</option>
                      <option value="3">3+</option>
                      <option value="4">4+</option>
                      <option value="5">5+</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-500">
                      Bathrooms
                    </label>
                    <select name="baths" defaultValue={params.baths as string || ""} className="w-full h-12 rounded-xl bg-slate-50 border-slate-200 px-4 text-sm font-medium text-slate-900 focus:ring-primary/20">
                      <option value="">Any</option>
                      <option value="1">1+</option>
                      <option value="2">2+</option>
                      <option value="3">3+</option>
                      <option value="4">4+</option>
                      <option value="5">5+</option>
                    </select>
                  </div>
                </div>

                {/* Form Buttons */}                <div className="pt-4 flex flex-col gap-3">
                  <Button type="submit" size="lg" className="w-full h-12 rounded-xl font-bold shadow-lg shadow-primary/20 hover:-translate-y-0.5 transition-all">
                    Apply Filters
                  </Button>
                  {Object.keys(params).length > 0 && (
                    <a href="/rent" className="text-center text-xs font-bold text-slate-400 hover:text-slate-600 underline underline-offset-4">
                      Clear all filters
                    </a>
                  )}
                </div>
              </form>
            </div>
          </div>

          {/* Results Grid */}
          <div className="flex-1">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="font-heading text-2xl font-bold text-slate-900">
                {results.length} {results.length === 1 ? 'Property' : 'Properties'} Available for Rent
              </h3>
            </div>

            {results.length === 0 ? (
              <div className="flex h-80 flex-col items-center justify-center rounded-[2rem] border border-dashed border-slate-300 bg-white text-center shadow-sm">
                <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-slate-50">
                  <Search className="size-8 text-slate-300" />
                </div>
                <p className="font-heading text-xl font-bold text-slate-900">
                  No matches found
                </p>
                <p className="mt-2 max-w-sm text-sm text-slate-500">
                  Try adjusting your filters or search criteria to find what you&apos;re looking for.
                </p>
                <a href="/rent" className="mt-6">
                  <Button variant="outline" className="rounded-xl">Clear Filters</Button>
                </a>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {results.map((listing) => (
                  <ListingCard key={listing.id} {...listing} />
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
