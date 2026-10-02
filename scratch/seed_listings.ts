import { db } from "../lib/db";
import { listings } from "../db/schema";

const generateSlugId = () => Math.random().toString(36).substring(2, 8);

const seedData = [
  {
    title: "Luxury 5 Bedroom House in F-6",
    slug: "luxury-5-bedroom-house-f-6-" + generateSlugId(),
    description: "Experience unparalleled luxury in this stunning 5-bedroom house located in the heart of F-6. Features include modern architecture, spacious living areas, a beautiful garden, and top-tier security.",
    propertyType: "house" as const,
    purpose: "rent",
    sector: "F-6",
    address: "Street 14, F-6/3, Islamabad",
    monthlyRent: 850000,
    bedrooms: 5,
    bathrooms: 6,
    area: 2,
    areaUnit: "kanal",
    areaSqft: 10890,
    condition: "excellent",
    furnished: true,
    corner: true,
    parkFacing: true,
    servantQuarters: true,
    images: ["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=1000", "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1000"],
    status: "published" as const,
    featured: true,
  },
  {
    title: "Modern 3 Bed Apartment F-11 Markaz",
    slug: "modern-3-bed-apartment-f-11-" + generateSlugId(),
    description: "Brand new 3-bedroom luxury apartment offering panoramic views of the Margalla Hills. Comes with dedicated basement parking, 24/7 elevator access, and a standby generator.",
    propertyType: "apartment" as const,
    purpose: "rent",
    sector: "F-11",
    address: "F-11 Markaz, Islamabad",
    monthlyRent: 150000,
    bedrooms: 3,
    bathrooms: 4,
    area: 2200,
    areaUnit: "sqft",
    areaSqft: 2200,
    condition: "new",
    furnished: false,
    corner: false,
    parkFacing: false,
    servantQuarters: false,
    images: ["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=1000"],
    status: "published" as const,
    featured: true,
  },
  {
    title: "Spacious Upper Portion G-6",
    slug: "spacious-upper-portion-g-6-" + generateSlugId(),
    description: "Well-maintained upper portion available for rent in G-6. Independent entrance, 2 bedrooms with attached baths, a large terrace, and separate utility meters.",
    propertyType: "upper_portion" as const,
    purpose: "rent",
    sector: "G-6",
    address: "Street 40, G-6/1, Islamabad",
    monthlyRent: 75000,
    bedrooms: 2,
    bathrooms: 2,
    area: 10,
    areaUnit: "marla",
    areaSqft: 2722,
    condition: "good",
    furnished: false,
    corner: false,
    parkFacing: true,
    servantQuarters: false,
    images: ["https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1000"],
    status: "published" as const,
    featured: false,
  },
  {
    title: "Prime Commercial Office Space in F-11",
    slug: "prime-commercial-office-f-11-" + generateSlugId(),
    description: "Spacious and fully networked office space ready for immediate occupation. Perfect for IT companies or corporate headquarters. Located in a high-footfall area of F-11 Markaz.",
    propertyType: "office" as const,
    purpose: "rent",
    sector: "F-11",
    address: "Main Double Road, F-11, Islamabad",
    monthlyRent: 350000,
    bedrooms: 0,
    bathrooms: 2,
    area: 3500,
    areaUnit: "sqft",
    areaSqft: 3500,
    condition: "new",
    furnished: false,
    corner: true,
    parkFacing: false,
    servantQuarters: false,
    images: ["https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1000"],
    status: "published" as const,
    featured: true,
  }
];

async function seed() {
  console.log("Seeding properties...");
  try {
    await db.insert(listings).values(seedData);
    console.log("Properties seeded successfully!");
  } catch (error) {
    console.error("Error seeding properties:", error);
  }
}

seed();
