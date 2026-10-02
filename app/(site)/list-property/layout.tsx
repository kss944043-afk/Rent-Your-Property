import { Metadata } from "next";

export const metadata: Metadata = {
  title: "List Your Property for Rent",
  description: "List your property with Rent Your Property to find reliable tenants quickly and securely.",
};

export default function ListPropertyLayout({ children }: { children: React.ReactNode }) {
  return children;
}
