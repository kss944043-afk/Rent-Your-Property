import { google } from "googleapis";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

async function addHeaders() {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const privateKey = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY?.replace(/\\n/g, "\n");
  const sheetId = process.env.GOOGLE_SHEET_ID;

  if (!email || !privateKey || !sheetId) {
    // Try alternate env variable names
    const email2 = process.env.GOOGLE_CLIENT_EMAIL;
    const privateKey2 = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n");

    if (!email2 || !privateKey2 || !sheetId) {
      console.error("Missing Google Sheets credentials in .env.local");
      console.log("Looked for: GOOGLE_SERVICE_ACCOUNT_EMAIL / GOOGLE_CLIENT_EMAIL");
      console.log("            GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY / GOOGLE_PRIVATE_KEY");
      console.log("            GOOGLE_SHEET_ID");
      return;
    }

    const auth = new google.auth.JWT({
      email: email2,
      key: privateKey2,
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const sheets = google.sheets({ version: "v4", auth });

    await sheets.spreadsheets.values.update({
      spreadsheetId: sheetId,
      range: "Rentals!A1:M1",
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [
          ["ID", "Owner Name", "Phone", "Email", "Property Type", "Sector", "Address", "Expected Rent", "Bedrooms", "Bathrooms", "Description", "Remarks", "Date"],
        ],
      },
    });

    console.log("✅ Headers added to 'Rentals' tab successfully!");
    return;
  }

  const auth = new google.auth.JWT({
    email,
    key: privateKey,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  const sheets = google.sheets({ version: "v4", auth });

  await sheets.spreadsheets.values.update({
    spreadsheetId: sheetId,
    range: "Rentals!A1:M1",
    valueInputOption: "USER_ENTERED",
    requestBody: {
      values: [
        ["ID", "Owner Name", "Phone", "Email", "Property Type", "Sector", "Address", "Expected Rent", "Bedrooms", "Bathrooms", "Description", "Remarks", "Date"],
      ],
    },
  });

  console.log("✅ Headers added to 'Rentals' tab successfully!");
}

addHeaders().catch(console.error);
