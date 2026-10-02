import { getLocations } from "@/app/actions/locations";
import { LocationsManager } from "@/components/admin/locations-manager";

export const metadata = {
  title: "Locations | Admin",
};

export default async function AdminLocationsPage() {
  const locations = await getLocations();

  return (
    <div className="space-y-6 w-full">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-black text-slate-900 tracking-tight">Locations</h1>
          <p className="mt-1 text-sm font-medium text-slate-500">
            Manage dynamic sectors and sub-sectors for your property listings.
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-md shadow-slate-200/40 w-full overflow-hidden">
        <LocationsManager initialLocations={locations} />
      </div>
    </div>
  );
}
