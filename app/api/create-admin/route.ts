import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

// Temporary route to create the first admin user
// DELETE THIS FILE after creating your admin account!
export async function GET() {
  try {
    const user = await auth.api.signUpEmail({
      body: {
        name: "Admin",
        email: "admin@rentyourproperty.pk",
        password: "Admin@1234",
      },
    });

    return NextResponse.json({
      success: true,
      message: "Admin user created successfully!",
      credentials: {
        email: "admin@rentyourproperty.pk",
        password: "Admin@1234",
      },
      note: "⚠️ CHANGE YOUR PASSWORD after first login! Then DELETE app/api/create-admin/route.ts",
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message || "Failed to create admin user",
    }, { status: 500 });
  }
}
