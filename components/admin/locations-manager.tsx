"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Trash2, Plus, MapPin, Map, Loader2 } from "lucide-react";
import { addSector, deleteSector, addSubSector, deleteSubSector } from "@/app/actions/locations";

type LocationData = {
  id: number;
  name: string;
  createdAt: Date;
  subSectors: { id: number; sectorId: number; name: string; createdAt: Date }[];
};

export function LocationsManager({ initialLocations }: { initialLocations: LocationData[] }) {
  const [locations, setLocations] = useState(initialLocations);
  const [selectedSector, setSelectedSector] = useState<LocationData | null>(initialLocations[0] || null);
  
  const [newSectorName, setNewSectorName] = useState("");
  const [newSubSectorName, setNewSubSectorName] = useState("");
  const [isAddingSector, setIsAddingSector] = useState(false);
  const [isAddingSub, setIsAddingSub] = useState(false);
  
  // Conditionally default autoGenerate based on user input
  const [autoGenerate, setAutoGenerate] = useState(true);
  React.useEffect(() => {
    const lower = newSectorName.toLowerCase();
    if (lower.includes("bahria") || lower.includes("dha")) {
      setAutoGenerate(false);
    } else {
      setAutoGenerate(true);
    }
  }, [newSectorName]);

  const handleAddSector = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSectorName.trim()) return;
    setIsAddingSector(true);
    const res = await addSector(newSectorName, autoGenerate);
    setIsAddingSector(false);
    
    if (res.success && res.data) {
      toast.success("Sector added");
      setNewSectorName("");
      const newSectorData = res.data;
      setLocations(prev => [...prev, newSectorData].sort((a, b) => a.name.localeCompare(b.name)));
      if (!selectedSector || selectedSector.id === newSectorData.id) setSelectedSector(newSectorData);
    } else {
      toast.error(res.error || "Failed to add sector");
    }
  };

  const handleDeleteSector = async (id: number) => {
    if (!confirm("Are you sure? This will also delete all sub-sectors under it.")) return;
    const res = await deleteSector(id);
    if (res.success) {
      toast.success("Sector deleted");
      setLocations(prev => prev.filter(l => l.id !== id));
      if (selectedSector?.id === id) {
        setSelectedSector(null);
      }
    } else {
      toast.error(res.error || "Failed to delete sector");
    }
  };

  const handleAddSubSector = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSector || !newSubSectorName.trim()) return;
    
    setIsAddingSub(true);
    const res = await addSubSector(selectedSector.id, newSubSectorName);
    setIsAddingSub(false);

    if (res.success && res.data) {
      toast.success("Sub-sector added");
      setNewSubSectorName("");
      
      const newSub = res.data;
      setLocations(prev => prev.map(loc => {
        if (loc.id === selectedSector.id) {
          const updated = {
            ...loc,
            subSectors: [...loc.subSectors, newSub].sort((a, b) => a.name.localeCompare(b.name))
          };
          if (selectedSector.id === updated.id) setSelectedSector(updated);
          return updated;
        }
        return loc;
      }));
    } else {
      toast.error(res.error || "Failed to add sub-sector");
    }
  };

  const handleDeleteSubSector = async (id: number, sectorId: number) => {
    if (!confirm("Are you sure you want to delete this sub-sector?")) return;
    
    const res = await deleteSubSector(id);
    if (res.success) {
      toast.success("Sub-sector deleted");
      setLocations(prev => prev.map(loc => {
        if (loc.id === sectorId) {
          const updated = {
            ...loc,
            subSectors: loc.subSectors.filter(s => s.id !== id)
          };
          if (selectedSector?.id === updated.id) setSelectedSector(updated);
          return updated;
        }
        return loc;
      }));
    } else {
      toast.error(res.error || "Failed to delete sub-sector");
    }
  };

  return (
    <div className="grid md:grid-cols-2 gap-6 h-[600px]">
      {/* Left Panel: Sectors */}
      <div className="flex flex-col border rounded-xl overflow-hidden bg-slate-50/50">
        <div className="p-4 border-b bg-white">
          <h2 className="font-bold text-lg flex items-center gap-2">
            <Map className="h-5 w-5 text-primary" /> 
            Main Sectors
          </h2>
          <form onSubmit={handleAddSector} className="mt-3 flex flex-col gap-2">
            <div className="flex gap-2">
              <Input 
                placeholder="e.g. F-6, Bahria Town..." 
                value={newSectorName}
                onChange={(e) => setNewSectorName(e.target.value)}
                className="bg-white"
              />
              <Button type="submit" disabled={isAddingSector || !newSectorName.trim()}>
                {isAddingSector ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
              </Button>
            </div>
            {newSectorName.trim() && (
              <label className="flex items-center gap-2 text-[11px] text-slate-500 cursor-pointer pl-1 mt-1">
                <input 
                  type="checkbox" 
                  checked={autoGenerate}
                  onChange={(e) => setAutoGenerate(e.target.checked)}
                  className="rounded border-slate-300 text-primary focus:ring-primary"
                />
                Auto-generate sub-sectors (/1 to /4)
              </label>
            )}
          </form>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {locations.length === 0 ? (
            <div className="text-center text-slate-500 py-10 text-sm">No sectors added yet.</div>
          ) : (
            locations.map((sector) => (
              <div 
                key={sector.id} 
                onClick={() => setSelectedSector(sector)}
                className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                  selectedSector?.id === sector.id 
                    ? "bg-primary/10 border-primary/20 border text-primary" 
                    : "hover:bg-slate-100 border border-transparent text-slate-700"
                }`}
              >
                <div className="font-medium flex items-center gap-2">
                  <MapPin className="h-4 w-4 opacity-50" />
                  {sector.name}
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs bg-white px-2 py-0.5 rounded-full border shadow-sm text-slate-500">
                    {sector.subSectors.length}
                  </span>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-7 w-7 text-red-500 hover:text-red-700 hover:bg-red-50"
                    onClick={(e) => { e.stopPropagation(); handleDeleteSector(sector.id); }}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Right Panel: Sub-Sectors */}
      <div className="flex flex-col border rounded-xl overflow-hidden bg-slate-50/50">
        {selectedSector ? (
          <>
            <div className="p-4 border-b bg-white">
              <h2 className="font-bold text-lg flex items-center gap-2">
                Sub-Sectors for <span className="text-primary">{selectedSector.name}</span>
              </h2>
              <form onSubmit={handleAddSubSector} className="mt-3 flex gap-2">
                <Input 
                  placeholder={`e.g. ${selectedSector.name}/1, Phase 8...`} 
                  value={newSubSectorName}
                  onChange={(e) => setNewSubSectorName(e.target.value)}
                  className="bg-white"
                />
                <Button type="submit" disabled={isAddingSub || !newSubSectorName.trim()}>
                  {isAddingSub ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                </Button>
              </form>
            </div>
            <div className="flex-1 overflow-y-auto p-2 space-y-1">
              {selectedSector.subSectors.length === 0 ? (
                <div className="text-center text-slate-500 py-10 text-sm">No sub-sectors yet.</div>
              ) : (
                selectedSector.subSectors.map((sub) => (
                  <div 
                    key={sub.id} 
                    className="flex items-center justify-between p-3 rounded-lg bg-white border shadow-sm"
                  >
                    <div className="font-medium text-slate-700 pl-2">
                      {sub.name}
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-7 w-7 text-red-500 hover:text-red-700 hover:bg-red-50"
                      onClick={() => handleDeleteSubSector(sub.id, selectedSector.id)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                ))
              )}
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400 p-6 text-center">
            <Map className="h-12 w-12 opacity-20 mb-3" />
            <p>Select a sector from the left to manage its sub-sectors.</p>
          </div>
        )}
      </div>
    </div>
  );
}
