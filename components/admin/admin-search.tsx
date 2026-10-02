"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, Building, FileText, Users, Loader2, X } from "lucide-react";
import { adminSearch } from "@/app/actions/admin-search";
import Link from "next/link";

export function AdminSearch() {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<{
    listings: any[];
    submissions: any[];
    blogs: any[];
  }>({ listings: [], submissions: [], blogs: [] });

  const containerRef = useRef<HTMLDivElement>(null);
  
  // Custom simple debounce since we might not have use-debounce hook available
  const [debouncedQuery, setDebouncedQuery] = useState(query);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 300);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    async function performSearch() {
      if (!debouncedQuery || debouncedQuery.trim().length < 2) {
        setResults({ listings: [], submissions: [], blogs: [] });
        return;
      }

      setLoading(true);
      const res = await adminSearch(debouncedQuery);
      if (res.success && res.data) {
        setResults(res.data);
      }
      setLoading(false);
    }

    performSearch();
  }, [debouncedQuery]);

  // Handle click outside to close
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle Ctrl+K shortcut
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        const input = containerRef.current?.querySelector("input");
        if (input) {
          input.focus();
          setIsOpen(true);
        }
      } else if (e.key === "Escape") {
        setIsOpen(false);
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const totalResults = results.listings.length + results.submissions.length + results.blogs.length;

  return (
    <div className="relative w-full group" ref={containerRef}>
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400 group-focus-within:text-brand-accent transition-colors">
        <Search className="size-4" />
      </div>
      <input
        type="text"
        placeholder="Search properties, inquiries, or blogs..."
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
        className="flex h-11 w-full rounded-full border border-slate-200 bg-slate-50/50 px-3 py-2 pl-10 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent/20 focus-visible:border-brand-accent transition-all duration-200 shadow-sm"
      />
      
      <div className="absolute inset-y-0 right-0 flex items-center pr-3 gap-1">
        {loading && <Loader2 className="size-4 animate-spin text-slate-400" />}
        {query && (
          <button onClick={() => { setQuery(""); setIsOpen(false); }} className="p-1 hover:bg-slate-200 rounded-full text-slate-400 hover:text-slate-600 transition-colors">
            <X className="size-3" />
          </button>
        )}
        {!query && (
          <kbd className="hidden sm:inline-flex h-5 items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100 pointer-events-none">
            <span className="text-xs">⌘</span>K
          </kbd>
        )}
      </div>

      {/* Search Results Dropdown */}
      {isOpen && query.trim().length >= 2 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-50 flex flex-col max-h-[70vh]">
          {loading && totalResults === 0 ? (
            <div className="p-8 text-center text-sm text-slate-500 flex flex-col items-center gap-2">
              <Loader2 className="size-6 animate-spin text-brand-accent/50" />
              Searching...
            </div>
          ) : totalResults === 0 ? (
            <div className="p-8 text-center text-sm text-slate-500">
              No results found for "{query}".
            </div>
          ) : (
            <div className="overflow-y-auto p-2">
              
              {/* Listings */}
              {results.listings.length > 0 && (
                <div className="mb-2">
                  <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    Properties
                  </div>
                  {results.listings.map((listing) => (
                    <Link
                      key={listing.id}
                      href={`/admin/listings/${listing.id}/edit`}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-slate-50 transition-colors group/item"
                    >
                      <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600 group-hover/item:bg-blue-100 transition-colors">
                        <Building className="size-4" />
                      </div>
                      <div className="flex flex-col overflow-hidden">
                        <span className="text-sm font-medium text-slate-900 truncate">{listing.title}</span>
                        <span className="text-xs text-slate-500 truncate">{listing.slug}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              {/* Submissions */}
              {results.submissions.length > 0 && (
                <div className="mb-2">
                  <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    Rental Inquiries
                  </div>
                  {results.submissions.map((sub) => (
                    <Link
                      key={sub.id}
                      href={`/admin/submissions`}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-slate-50 transition-colors group/item"
                    >
                      <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 group-hover/item:bg-emerald-100 transition-colors">
                        <Users className="size-4" />
                      </div>
                      <div className="flex flex-col overflow-hidden">
                        <span className="text-sm font-medium text-slate-900 truncate">{sub.ownerName}</span>
                        <span className="text-xs text-slate-500 truncate">{sub.phone}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              {/* Blogs */}
              {results.blogs.length > 0 && (
                <div>
                  <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    Blog Posts
                  </div>
                  {results.blogs.map((blog) => (
                    <Link
                      key={blog.id}
                      href={`/admin/blog/${blog.id}`}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-slate-50 transition-colors group/item"
                    >
                      <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-purple-50 text-purple-600 group-hover/item:bg-purple-100 transition-colors">
                        <FileText className="size-4" />
                      </div>
                      <div className="flex flex-col overflow-hidden">
                        <span className="text-sm font-medium text-slate-900 truncate">{blog.title}</span>
                        <span className="text-xs text-slate-500 truncate">{blog.slug}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
