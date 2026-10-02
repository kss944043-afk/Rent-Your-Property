"use server";

import { db } from "@/lib/db";
import { sectors, subSectors } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getLocations() {
  const allSectors = await db.select().from(sectors).orderBy(sectors.name);
  const allSubSectors = await db.select().from(subSectors).orderBy(subSectors.name);

  // Group sub-sectors by sectorId for easy frontend consumption
  const grouped = allSectors.map((sector) => ({
    ...sector,
    subSectors: allSubSectors.filter((sub) => sub.sectorId === sector.id),
  }));

  return grouped;
}

export async function addSector(name: string, autoGenerateSubs: boolean = false) {
  try {
    const trimmed = name.trim();
    if (!trimmed) return { success: false, error: "Name is required" };

    const [newSector] = await db.insert(sectors).values({ name: trimmed }).returning();
    
    let generatedSubs: any[] = [];
    if (autoGenerateSubs) {
      const subsToInsert = [1, 2, 3, 4].map(num => ({
        sectorId: newSector.id,
        name: `${trimmed}/${num}`
      }));
      generatedSubs = await db.insert(subSectors).values(subsToInsert).returning();
    }

    revalidatePath("/admin/locations");
    revalidatePath("/");
    revalidatePath("/rent");
    revalidatePath("/list-property");
    
    return { success: true, data: { ...newSector, subSectors: generatedSubs } };
  } catch (error: any) {
    if (error.code === '23505') return { success: false, error: "Sector already exists" };
    return { success: false, error: "Failed to add sector" };
  }
}

export async function deleteSector(id: number) {
  try {
    await db.delete(sectors).where(eq(sectors.id, id));
    revalidatePath("/admin/locations");
    revalidatePath("/");
    revalidatePath("/rent");
    revalidatePath("/list-property");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to delete sector" };
  }
}

export async function addSubSector(sectorId: number, name: string) {
  try {
    const trimmed = name.trim();
    if (!trimmed) return { success: false, error: "Name is required" };

    const [newSub] = await db.insert(subSectors).values({ 
      sectorId, 
      name: trimmed 
    }).returning();
    
    revalidatePath("/admin/locations");
    revalidatePath("/");
    revalidatePath("/rent");
    revalidatePath("/list-property");
    return { success: true, data: newSub };
  } catch (error) {
    return { success: false, error: "Failed to add sub-sector" };
  }
}

export async function deleteSubSector(id: number) {
  try {
    await db.delete(subSectors).where(eq(subSectors.id, id));
    revalidatePath("/admin/locations");
    revalidatePath("/");
    revalidatePath("/rent");
    revalidatePath("/list-property");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to delete sub-sector" };
  }
}
