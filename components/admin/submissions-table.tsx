"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { format } from "date-fns";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle,
  SheetDescription 
} from "@/components/ui/sheet";
import { AlertCircle, RefreshCw, Phone, Mail, MapPin, Trash2, CalendarDays, Building2, BedDouble, Bath, CheckCircle2 } from "lucide-react";
import { updateSubmissionStatus, retrySheetSync, deleteSubmission } from "@/app/actions/submissions";
import { toast } from "sonner";
import { type rentSubmissions } from "@/db/schema";
import { InferSelectModel } from "drizzle-orm";
import { AlertModal } from "@/components/admin/alert-modal";

type Submission = InferSelectModel<typeof rentSubmissions>;

export function SubmissionsTable({ data }: { data: Submission[] }) {
  const router = useRouter();
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [selectedSubmission, setSelectedSubmission] = React.useState<Submission | null>(null);
  const [isSheetOpen, setIsSheetOpen] = React.useState(false);
  const [syncingIds, setSyncingIds] = React.useState<Set<number>>(new Set());
  const [statusUpdating, setStatusUpdating] = React.useState<Set<number>>(new Set());
  const [deletingIds, setDeletingIds] = React.useState<Set<number>>(new Set());
  const [deleteOpen, setDeleteOpen] = React.useState(false);
  const [pendingDeleteId, setPendingDeleteId] = React.useState<number | null>(null);
  const [isDeleting, setIsDeleting] = React.useState(false);

  const openDeleteModal = (id: number, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setPendingDeleteId(id);
    setDeleteOpen(true);
  };

  const handleDelete = async () => {
    if (!pendingDeleteId) return;
    setIsDeleting(true);
    setDeletingIds(prev => new Set(prev).add(pendingDeleteId));
    const res = await deleteSubmission(pendingDeleteId);
    setIsDeleting(false);
    setDeletingIds(prev => { const next = new Set(prev); next.delete(pendingDeleteId!); return next; });
    if (res.success) {
      toast.success("Submission deleted");
      setDeleteOpen(false);
      setPendingDeleteId(null);
      setIsSheetOpen(false);
      setSelectedSubmission(null);
      router.refresh();
    } else {
      toast.error(res.error || "Failed to delete");
    }
  };

  const handleStatusChange = async (id: number, newStatus: string) => {
    setStatusUpdating(prev => new Set(prev).add(id));
    const res = await updateSubmissionStatus(id, newStatus as any);
    if (res.success) {
      toast.success("Status updated");
      router.refresh();
    } else {
      toast.error("Failed to update status");
    }
    setStatusUpdating(prev => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };

  const handleRetrySync = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setSyncingIds(prev => new Set(prev).add(id));
    const res = await retrySheetSync(id);
    if (res.success) {
      toast.success("Successfully synced to Sheets");
      router.refresh();
    } else {
      toast.error(res.error || "Failed to sync");
    }
    setSyncingIds(prev => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };

  const columns: ColumnDef<Submission>[] = [
    {
      accessorKey: "ownerName",
      header: "Owner Name",
      cell: ({ row }) => <div className="font-medium whitespace-nowrap">{row.getValue("ownerName")}</div>,
    },
    {
      accessorKey: "phone",
      header: "Phone",
    },
    {
      accessorKey: "propertyType",
      header: "Property Type",
      cell: ({ row }) => <span className="capitalize">{row.getValue("propertyType")}</span>,
    },
    {
      accessorKey: "sector",
      header: "Sector",
    },
    {
      accessorKey: "expectedRent",
      header: "Expected Rent",
      cell: ({ row }) => {
        const val = row.getValue("expectedRent") as number | null;
        return <div className="font-mono">{val ? `PKR ${val.toLocaleString()}/mo` : "-"}</div>;
      },
    },
    {
      accessorKey: "createdAt",
      header: "Date",
      cell: ({ row }) => format(new Date(row.getValue("createdAt")), "MMM d, yyyy"),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const id = row.original.id;
        const status = row.original.status;
        const isUpdating = statusUpdating.has(id);
        
        return (
          <div onClick={(e) => e.stopPropagation()}>
            <Select 
              value={status} 
              onValueChange={(val) => handleStatusChange(id, val)}
              disabled={isUpdating}
            >
              <SelectTrigger className="w-[120px] h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="contacted">Contacted</SelectItem>
                <SelectItem value="listed">Listed</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        );
      },
    },
    {
      id: "sync",
      header: "Sheet",
      cell: ({ row }) => {
        const { id, sheetSynced } = row.original;
        const isSyncing = syncingIds.has(id);

        if (sheetSynced) {
          return (
            <div className="flex items-center gap-1 text-xs font-medium text-emerald-600">
              <span className="flex size-2 rounded-full bg-emerald-500" />
              Synced
            </div>
          );
        }

        return (
          <Button
            variant="outline"
            size="sm"
            className="h-7 px-2 text-xs text-amber-600 border-amber-200 hover:bg-amber-50 hover:text-amber-700"
            onClick={(e) => handleRetrySync(id, e)}
            disabled={isSyncing}
          >
            {isSyncing ? <RefreshCw className="h-3 w-3 animate-spin mr-1" /> : <AlertCircle className="h-3 w-3 mr-1" />}
            {isSyncing ? "Syncing…" : "Retry"}
          </Button>
        );
      },
    },
    {
      id: "delete",
      header: "",
      cell: ({ row }) => {
        const { id } = row.original;
        const isDeleting = deletingIds.has(id);
        
        return (
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 px-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
            onClick={(e) => openDeleteModal(id, e)}
            disabled={isDeleting}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        );
      },
    }
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  });

  return (
    <div>
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter by landlord name..."
          value={(table.getColumn("ownerName")?.getFilterValue() as string) ?? ""}
          onChange={(event) => table.getColumn("ownerName")?.setFilterValue(event.target.value)}
          className="max-w-sm"
        />
      </div>
      
      {/* Desktop Table View */}
      <div className="hidden md:block rounded-md border bg-card">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => {
                    setSelectedSubmission(row.original);
                    setIsSheetOpen(true);
                  }}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">No results.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Stacked Card View */}
      <div className="md:hidden grid gap-4">
        {table.getRowModel().rows?.length ? (
          table.getRowModel().rows.map((row) => {
            const data = row.original;
            const isSyncing = syncingIds.has(data.id);
            const isUpdatingStatus = statusUpdating.has(data.id);
            
            return (
              <Card 
                key={row.id} 
                className="cursor-pointer active:bg-muted/50 transition-colors"
                onClick={() => {
                  setSelectedSubmission(data);
                  setIsSheetOpen(true);
                }}
              >
                <CardContent className="p-4 flex flex-col gap-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-semibold text-lg">{data.ownerName}</div>
                      <div className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                        <Phone className="h-3 w-3" /> {data.phone}
                      </div>
                    </div>
                    {!data.sheetSynced && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="h-7 text-xs text-destructive border-destructive/30"
                        onClick={(e) => handleRetrySync(data.id, e)}
                        disabled={isSyncing}
                      >
                        {isSyncing ? <RefreshCw className="h-3 w-3 animate-spin mr-1" /> : <AlertCircle className="h-3 w-3 mr-1" />}
                        Retry Sync
                      </Button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-sm mt-2">
                    <div>
                      <span className="text-muted-foreground">Type:</span> <span className="capitalize">{data.propertyType}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Sector:</span> {data.sector || "-"}
                    </div>
                    <div>
                      <span className="text-muted-foreground">Expected Rent:</span> {data.expectedRent ? `PKR ${data.expectedRent.toLocaleString()}/mo` : "-"}
                    </div>
                    <div>
                      <span className="text-muted-foreground">Date:</span> {format(new Date(data.createdAt), "MMM d, yyyy")}
                    </div>
                  </div>
                  
                  <div className="pt-2 border-t mt-2 flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                    <Select 
                      value={data.status} 
                      onValueChange={(val) => handleStatusChange(data.id, val)}
                      disabled={isUpdatingStatus}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new">New</SelectItem>
                        <SelectItem value="contacted">Contacted</SelectItem>
                        <SelectItem value="listed">Listed</SelectItem>
                        <SelectItem value="closed">Closed</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      variant="outline"
                      size="icon"
                      className="shrink-0 h-10 w-10 text-muted-foreground hover:text-destructive hover:border-destructive/30"
                      onClick={(e) => openDeleteModal(data.id, e)}
                      disabled={deletingIds.has(data.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })
        ) : (
          <div className="text-center py-10 text-muted-foreground border rounded-md">No results.</div>
        )}
      </div>

      <div className="flex items-center justify-end space-x-2 py-4">
        <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>Previous</Button>
        <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>Next</Button>
      </div>

      {/* Details Sheet */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="sm:max-w-lg overflow-y-auto p-0">
          {selectedSubmission && (
            <>
              {/* Header */}
              <div className="bg-slate-900 px-6 pt-10 pb-6">
                <div className="flex items-start justify-between">
                  <div>
                    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest mb-3 ${
                      selectedSubmission.status === "new" ? "bg-blue-500/20 text-blue-300" :
                      selectedSubmission.status === "contacted" ? "bg-amber-500/20 text-amber-300" :
                      selectedSubmission.status === "listed" ? "bg-emerald-500/20 text-emerald-300" :
                      "bg-slate-500/20 text-slate-300"
                    }`}>
                      <span className="size-1.5 rounded-full bg-current" />
                      {selectedSubmission.status}
                    </span>
                    <h2 className="font-heading text-2xl font-bold text-white">{selectedSubmission.ownerName}</h2>
                    <div className="flex items-center gap-1.5 mt-1 text-slate-400 text-sm">
                      <CalendarDays className="h-3.5 w-3.5" />
                      {format(new Date(selectedSubmission.createdAt), "PPP")}
                    </div>
                  </div>
                  <div className={`flex size-10 items-center justify-center rounded-full ${selectedSubmission.sheetSynced ? "bg-emerald-500/20" : "bg-amber-500/20"}`}>
                    {selectedSubmission.sheetSynced
                      ? <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                      : <AlertCircle className="h-5 w-5 text-amber-400" />}
                  </div>
                </div>

                {/* Quick contact row */}
                <div className="mt-5 flex flex-wrap gap-2">
                  <a href={`tel:${selectedSubmission.phone}`}
                    className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white hover:bg-white/20 transition-colors">
                    <Phone className="h-3.5 w-3.5" /> {selectedSubmission.phone}
                  </a>
                  {selectedSubmission.email && (
                    <a href={`mailto:${selectedSubmission.email}`}
                      className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white hover:bg-white/20 transition-colors">
                      <Mail className="h-3.5 w-3.5" /> {selectedSubmission.email}
                    </a>
                  )}
                </div>
              </div>

              {/* Body */}
              <div className="px-6 py-6 space-y-6">

                {/* Property Details Grid */}
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">Property Details</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-xl bg-slate-50 border border-slate-100 p-4">
                      <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
                        <Building2 className="h-3.5 w-3.5" /> Type
                      </div>
                      <div className="font-semibold text-slate-900 capitalize text-sm">{selectedSubmission.propertyType.replace("_", " ")}</div>
                    </div>
                    <div className="rounded-xl bg-slate-50 border border-slate-100 p-4">
                      <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
                        <MapPin className="h-3.5 w-3.5" /> Sector
                      </div>
                      <div className="font-semibold text-slate-900 text-sm">{selectedSubmission.sector || "—"}</div>
                    </div>
                    {selectedSubmission.bedrooms != null && (
                      <div className="rounded-xl bg-slate-50 border border-slate-100 p-4">
                        <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
                          <BedDouble className="h-3.5 w-3.5" /> Bedrooms
                        </div>
                        <div className="font-semibold text-slate-900 text-sm">{selectedSubmission.bedrooms}</div>
                      </div>
                    )}
                    {selectedSubmission.bathrooms != null && (
                      <div className="rounded-xl bg-slate-50 border border-slate-100 p-4">
                        <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
                          <Bath className="h-3.5 w-3.5" /> Bathrooms
                        </div>
                        <div className="font-semibold text-slate-900 text-sm">{selectedSubmission.bathrooms}</div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Expected Rent */}
                <div className="rounded-xl bg-primary/5 border border-primary/10 p-4">
                  <div className="text-xs font-bold uppercase tracking-widest text-primary/70 mb-1">Expected Monthly Rent</div>
                  <div className="text-2xl font-black text-primary font-mono">
                    {selectedSubmission.expectedRent ? `PKR ${selectedSubmission.expectedRent.toLocaleString()}` : "Not Specified"}
                    {selectedSubmission.expectedRent && <span className="text-sm font-medium text-primary/60 ml-1">/mo</span>}
                  </div>
                </div>

                {/* Address */}
                {selectedSubmission.address && (
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Address</h3>
                    <div className="flex items-start gap-2 rounded-xl bg-slate-50 border border-slate-100 p-4 text-sm text-slate-700">
                      <MapPin className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                      {selectedSubmission.address}
                    </div>
                  </div>
                )}

                {/* Description */}
                {selectedSubmission.description && (
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Description</h3>
                    <div className="rounded-xl bg-slate-50 border border-slate-100 p-4 text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">
                      {selectedSubmission.description}
                    </div>
                  </div>
                )}

                {/* Remarks */}
                {selectedSubmission.remarks && (
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Remarks</h3>
                    <div className="rounded-xl bg-amber-50 border border-amber-100 p-4 text-sm text-amber-900 whitespace-pre-wrap leading-relaxed">
                      {selectedSubmission.remarks}
                    </div>
                  </div>
                )}

                {/* Update Status */}
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Update Status</h3>
                  <Select
                    value={selectedSubmission.status}
                    onValueChange={(val) => handleStatusChange(selectedSubmission.id, val)}
                    disabled={statusUpdating.has(selectedSubmission.id)}
                  >
                    <SelectTrigger className="w-full h-11 rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">🔵 New</SelectItem>
                      <SelectItem value="contacted">🟡 Contacted</SelectItem>
                      <SelectItem value="listed">🟢 Listed</SelectItem>
                      <SelectItem value="closed">⚫ Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Delete */}
                <div className="pt-2">
                  <Button
                    variant="outline"
                    className="w-full border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 rounded-xl h-11"
                    onClick={() => openDeleteModal(selectedSubmission.id)}
                    disabled={deletingIds.has(selectedSubmission.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Submission
                  </Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      <AlertModal
        isOpen={deleteOpen}
        onClose={() => { setDeleteOpen(false); setPendingDeleteId(null); }}
        onConfirm={handleDelete}
        loading={isDeleting}
        title="Delete Submission"
        description="Are you sure you want to permanently delete this submission? This action cannot be undone."
        variant="danger"
        confirmText="Delete Submission"
      />
    </div>
  );
}
