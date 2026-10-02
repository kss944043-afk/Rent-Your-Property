import { db } from "../lib/db";
import { blogPosts } from "../db/schema";

const generateSlugId = () => Math.random().toString(36).substring(2, 8);

const seedData = [
  {
    title: "Top 5 Tips for Landlords to Maximize Rental Yield in Islamabad",
    slug: "top-5-tips-landlords-islamabad-" + generateSlugId(),
    excerpt: "Discover actionable strategies to increase your property's value and secure high-paying, reliable tenants in Islamabad's competitive rental market.",
    content: `
      <h2>1. Understand the Local Market Rates</h2>
      <p>Before listing your property, it is crucial to understand the going rates in sectors like F-6, F-11, and DHA. Setting an unrealistic price can leave your property vacant for months, costing you more than a slight reduction in rent.</p>
      <h2>2. Focus on Minor Upgrades</h2>
      <p>Tenants in premium sectors expect high-quality finishes. Upgrading kitchen cabinets, installing modern bathroom fixtures, or simply applying a fresh coat of high-quality paint can significantly increase your asking rent.</p>
      <h2>3. Professional Photography is Key</h2>
      <p>In the digital age, your property's first impression is online. Hire a professional photographer to capture your property in the best light. Well-lit, high-resolution photos attract premium tenants.</p>
      <h2>4. Highlight Unique Features</h2>
      <p>Does your property have a servant quarter, a beautiful park-facing view, or a dedicated backup generator? Make sure these features are front and center in your listing description.</p>
      <h2>5. Partner with a Reliable Platform</h2>
      <p>Using a trusted platform like Rent Your Property ensures that your listing reaches verified, serious tenants, saving you time and protecting your investment.</p>
    `,
    coverImage: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=1000",
    author: "Rent Your Property Team",
    published: true,
    publishedAt: new Date(),
  },
  {
    title: "A Tenant's Guide to Finding the Perfect Apartment in F-11",
    slug: "tenant-guide-f-11-apartment-" + generateSlugId(),
    excerpt: "Looking for an apartment in F-11? Here is everything you need to know about navigating the market, negotiating rent, and securing the best spot.",
    content: `
      <h2>Why F-11?</h2>
      <p>Sector F-11 has rapidly become one of the most sought-after residential areas in Islamabad. With its bustling Markaz, lush green parks, and high-end apartment complexes, it offers a perfect blend of convenience and luxury.</p>
      <h2>What to Look For</h2>
      <p>When touring apartments, pay close attention to the building's maintenance. Check if the elevators are functional, ask about the backup generator policy, and observe the security protocols at the entrance.</p>
      <h2>Negotiating Your Lease</h2>
      <p>Many landlords in Islamabad prefer long-term stability over short-term gains. If you are willing to sign a two-year lease or pay several months of rent upfront, you can often negotiate a better monthly rate.</p>
      <h2>Understanding the Paperwork</h2>
      <p>Always ensure that the tenancy agreement is drafted clearly. It should explicitly state who is responsible for maintenance issues, the terms for returning the security deposit, and the notice period required before vacating.</p>
      <h2>Start Your Search Early</h2>
      <p>Premium apartments in F-11 don't stay on the market for long. Set up alerts on Rent Your Property and be ready to schedule viewings as soon as a suitable listing goes live.</p>
    `,
    coverImage: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=1000",
    author: "Rent Your Property Team",
    published: true,
    publishedAt: new Date(),
  }
];

async function seed() {
  console.log("Seeding blog posts...");
  try {
    await db.insert(blogPosts).values(seedData);
    console.log("Blog posts seeded successfully!");
  } catch (error) {
    console.error("Error seeding blog posts:", error);
  }
}

seed();
