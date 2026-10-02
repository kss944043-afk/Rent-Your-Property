"use server";

import { db } from "@/lib/db";
import { listings, rentSubmissions, blogPosts } from "@/db/schema";
import { ilike, or } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function adminSearch(query: string) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    
    if (!session || session.user.role !== "admin") {
      return { success: false, error: "Unauthorized" };
    }

    if (!query || query.trim().length < 2) {
      return { success: true, data: { listings: [], submissions: [], blogs: [] } };
    }

    const searchTerm = `%${query.trim()}%`;

    const foundListings = await db
      .select({ id: listings.id, title: listings.title, slug: listings.slug, status: listings.status })
      .from(listings)
      .where(or(ilike(listings.title, searchTerm), ilike(listings.slug, searchTerm), ilike(listings.address, searchTerm)))
      .limit(5);

    const foundSubmissions = await db
      .select({ id: rentSubmissions.id, ownerName: rentSubmissions.ownerName, phone: rentSubmissions.phone, status: rentSubmissions.status })
      .from(rentSubmissions)
      .where(or(ilike(rentSubmissions.ownerName, searchTerm), ilike(rentSubmissions.phone, searchTerm)))
      .limit(5);

    const foundBlogs = await db
      .select({ id: blogPosts.id, title: blogPosts.title, slug: blogPosts.slug })
      .from(blogPosts)
      .where(ilike(blogPosts.title, searchTerm))
      .limit(3);

    return { 
      success: true, 
      data: {
        listings: foundListings,
        submissions: foundSubmissions,
        blogs: foundBlogs
      }
    };
  } catch (error) {
    console.error("Admin search error:", error);
    return { success: false, error: "Search failed" };
  }
}
