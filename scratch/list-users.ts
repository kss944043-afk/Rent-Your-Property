import { db } from "../lib/db";
import { user } from "../db/schema";

async function listUsers() {
  const users = await db.select({ id: user.id, name: user.name, email: user.email, role: user.role }).from(user);
  console.log("Registered admin users:");
  users.forEach(u => {
    console.log(`  - Email: ${u.email} | Name: ${u.name} | Role: ${u.role}`);
  });
  if (users.length === 0) {
    console.log("  No users found! You need to create an admin account.");
  }
}

listUsers().catch(console.error);
