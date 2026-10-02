"use server";

import { db } from "@/lib/db";
import { rentSubmissions } from "@/db/schema";
import { google } from "googleapis";
import { Resend } from "resend";
import { z } from "zod";
import { eq } from "drizzle-orm";

const formSchema = z.object({
  ownerName: z.string().min(2),
  phone: z.string().min(10),
  email: z.string().email().optional().or(z.literal("")),
  propertyType: z.enum(["house", "apartment", "commercial", "office", "upper_portion", "lower_portion", "farm_house", "shop", "warehouse", "building", "plot"]),
  sector: z.string().optional(),
  subSector: z.string().optional(),
  address: z.string().optional(),
  expectedRent: z.string().optional(),
  bedrooms: z.string().optional(),
  bathrooms: z.string().optional(),
  description: z.string().optional(),
  remarks: z.string().optional(),
});

export async function submitRentForm(data: z.infer<typeof formSchema>) {
  try {
    // 1. Validate data
    const validatedData = formSchema.parse(data);

    // 2. Insert into database (Source of Truth)
    const [submission] = await db
      .insert(rentSubmissions)
      .values({
        ...validatedData,
        expectedRent: validatedData.expectedRent ? Number(validatedData.expectedRent) : null,
        bedrooms: validatedData.bedrooms ? Number(validatedData.bedrooms) : null,
        bathrooms: validatedData.bathrooms ? Number(validatedData.bathrooms) : null,
        email: validatedData.email || null,
        status: "new",
        sheetSynced: false,
      })
      .returning();

    // 3. Attempt Google Sheets Sync
    let sheetSynced = false;
    try {
      const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
      const privateKey = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY?.replace(/\\n/g, "\n");
      const sheetId = process.env.GOOGLE_SHEET_ID;

      if (email && privateKey && sheetId) {
        const auth = new google.auth.JWT({
          email,
          key: privateKey,
          scopes: ["https://www.googleapis.com/auth/spreadsheets"],
        });

        const sheets = google.sheets({ version: "v4", auth });

        // Append row to dedicated "Rentals" tab
        await sheets.spreadsheets.values.append({
          spreadsheetId: sheetId,
          range: "Rentals!A1",
          valueInputOption: "USER_ENTERED",
          requestBody: {
            values: [
              [
                submission.id,
                validatedData.ownerName,
                validatedData.phone,
                validatedData.email || "",
                validatedData.propertyType,
                validatedData.sector || "",
                validatedData.address || "",
                validatedData.expectedRent || "",
                validatedData.bedrooms || "",
                validatedData.bathrooms || "",
                validatedData.description || "",
                validatedData.remarks || "",
                new Date().toISOString(),
              ],
            ],
          },
        });

        await db
          .update(rentSubmissions)
          .set({ sheetSynced: true })
          .where(eq(rentSubmissions.id, submission.id));

        sheetSynced = true;
      } else {
        console.warn("Google Sheets credentials not fully configured.");
      }
    } catch (sheetError) {
      // Catch but do NOT fail the request. The DB insert succeeded.
      console.error("Google Sheets sync failed:", sheetError);
    }

    // 4. Attempt Email Notification
    try {
      const resendKey = process.env.RESEND_API_KEY;
      const adminEmail = process.env.ADMIN_EMAIL;

      if (resendKey && adminEmail) {
        const resend = new Resend(resendKey);
        await resend.emails.send({
          from: "Rent Your Property <onboarding@resend.dev>",
          to: adminEmail,
          subject: `New Rental Property Request: ${validatedData.propertyType}`,
          html: `
            <h2>New Rental Property Request</h2>
            <p><strong>Name:</strong> ${validatedData.ownerName}</p>
            <p><strong>Phone:</strong> ${validatedData.phone}</p>
            <p><strong>Type:</strong> ${validatedData.propertyType}</p>
            <p><strong>Sector:</strong> ${validatedData.sector || "N/A"}</p>
          `,
        });
      }
    } catch (emailError) {
      console.error("Resend email failed:", emailError);
    }

    return { success: true, sheetSynced };
  } catch (error) {
    console.error("Submission failed:", error);
    return { success: false, error: "Failed to submit form" };
  }
}
