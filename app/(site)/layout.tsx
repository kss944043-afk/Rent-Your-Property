import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { LandlordSlideIn } from "@/components/shared/landlord-slide-in";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <LandlordSlideIn />
    </div>
  );
}
