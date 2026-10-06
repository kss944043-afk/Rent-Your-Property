"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "cn";
import { MenuIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/rent", label: "Rental Properties" },
  { href: "/list-property", label: "Rent Your Property" },
  { href: "/about", label: "About" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      if (pathname === "/") {
        const hero = document.querySelector('main section');
        if (hero) {
          // Change to white when we've scrolled past the hero (minus navbar height roughly)
          const threshold = hero.clientHeight - 80;
          setScrolled(window.scrollY > threshold);
        } else {
          setScrolled(window.scrollY > 10);
        }
      } else {
        setScrolled(window.scrollY > 10);
      }
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname]);

  const isHome = pathname === "/";

  return (
    <div className={cn("w-full z-50 top-0 transition-all duration-300", isHome ? "fixed" : "sticky")}>
      <header
        className={cn(
          "w-full transition-all duration-300 border-b",
          (isHome && !scrolled)
            ? "bg-transparent border-transparent"
            : "bg-white shadow-sm border-slate-200"
        )}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:h-20 md:px-6">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className={cn(
              "font-heading text-xl md:text-2xl font-black tracking-tight transition-colors",
              (isHome && !scrolled) ? "text-white" : "text-primary"
            )}>
              Rent Your Property
            </span>
          </Link>

          {/* Desktop nav — hidden below md */}
          <nav className="hidden flex-1 items-center justify-center gap-8 md:flex">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "relative py-2 text-sm font-bold transition-colors group",
                    isActive && !isHome
                      ? "text-primary"
                      : (isHome && !scrolled)
                      ? "text-white/90 hover:text-white"
                      : "text-muted-foreground hover:text-primary"
                  )}
                >
                  {link.label}
                  {/* Animated underline */}
                  <span
                    className={cn(
                      "absolute bottom-0 left-0 h-0.5 w-full origin-left transform transition-transform duration-300 ease-out",
                      (isHome && !scrolled) ? "bg-white" : "bg-primary",
                      isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                    )}
                  />
                </Link>
              );
            })}
          </nav>

          {/* Desktop CTA — hidden below md */}
          <div className="hidden items-center gap-3 md:flex">
            <Button variant="outline" className={cn("border-white/20 bg-white/10 hover:bg-white/20 text-white backdrop-blur-md", !(isHome && !scrolled) && "border-primary/20 bg-primary/5 hover:bg-primary/10 text-primary")} asChild>
              <a href="https://nextavenue.pk" target="_blank" rel="noopener noreferrer">Sell Your Property</a>
            </Button>
            <Button variant="accent" className={cn((isHome && !scrolled) && "bg-white text-primary hover:bg-white/90")} asChild>
              <Link href="/list-property">Rent Your Property</Link>
            </Button>
          </div>

        {/* Mobile hamburger — visible below md */}
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className={cn("md:hidden", (isHome && !scrolled) ? "text-white hover:bg-white/20" : "")}
              aria-label="Open menu"
            >
              <MenuIcon className="size-6" />
            </Button>
          </SheetTrigger>

          <SheetContent side="right" className="flex w-[85vw] flex-col p-0 bg-white/95 backdrop-blur-xl border-l-0 shadow-2xl">
            <SheetHeader className="border-b border-slate-100 px-6 py-5 text-left">
              <SheetTitle>
                <span className="font-heading text-xl font-black tracking-tight text-slate-900">
                  Rent Your <span className="text-primary">Property</span>
                </span>
              </SheetTitle>
            </SheetHeader>

            {/* Nav links */}
            <nav className="flex flex-1 flex-col gap-2 overflow-y-auto px-4 py-8">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <SheetClose key={link.href} asChild>
                    <Link
                      href={link.href}
                      className={cn(
                        "rounded-2xl px-5 py-4 text-base font-bold transition-all",
                        isActive
                          ? "bg-primary/10 text-primary"
                          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                      )}
                    >
                      {link.label}
                    </Link>
                  </SheetClose>
                );
              })}
            </nav>

            {/* Sticky CTAs at bottom of sheet */}
            <div className="border-t border-slate-100 bg-white/50 p-6 flex flex-col gap-3 pb-8">
              <SheetClose asChild>
                <Button variant="outline" className="w-full h-12 rounded-xl font-bold border-slate-200 text-slate-700 hover:bg-slate-50 shadow-sm" asChild>
                  <a href="https://nextavenue.pk" target="_blank" rel="noopener noreferrer">Sell Your Property</a>
                </Button>
              </SheetClose>
              <SheetClose asChild>
                <Button variant="accent" className="w-full h-12 rounded-xl font-bold shadow-md shadow-primary/20 hover:-translate-y-0.5 transition-transform" asChild>
                  <Link href="/list-property">Rent Your Property</Link>
                </Button>
              </SheetClose>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
    </div>
  );
}
