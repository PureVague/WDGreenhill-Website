"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingCart, Menu, X, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/lib/cart-store";
import { CartDrawer } from "@/components/site/CartDrawer";
import { Logo } from "@/components/site/Logo";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { label: "Shop", href: "/shop" },
  { label: "Repairs", href: "/repairs" },
  { label: "Kawai Support", href: "/kawai-support" },
  { label: "Manuals", href: "/manuals" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

// Pages where the top of the page has a dark/full-bleed hero behind the header.
// On these pages the header starts transparent and needs the light (white) logo.
// All other pages have a light background, so we always use the dark logo there.
const DARK_HERO_ROUTES = ["/", "/repairs"];

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const totalItems = useCartStore((s) => s.totalItems());
  const hasDarkHero = DARK_HERO_ROUTES.includes(pathname);
  // Use light logo only when transparent header sits over a dark hero
  const logoVariant = (!scrolled && hasDarkHero) ? "light" : "dark";

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-40 transition-all duration-300",
          scrolled
            ? "bg-white/95 backdrop-blur-md shadow-md shadow-black/5 border-b border-[hsl(240,6%,88%)]"
            : "bg-transparent"
        )}
      >
        {/* Top bar */}
        <div className={cn(
          "hidden md:flex items-center justify-between px-6 py-1.5 text-xs transition-all duration-300",
          scrolled
            ? "bg-[hsl(245,85%,58%)] text-white"
            : hasDarkHero
              ? "bg-[hsl(240,10%,4%)] text-white/70"
              : "bg-[hsl(245,85%,58%)] text-white"
        )}>
          <span>Official Kawai UK Service Partner — Est. 1980</span>
          <div className="flex items-center gap-4">
            <a href="tel:+441702546195" className="flex items-center gap-1 hover:text-white transition-colors">
              <Phone className="w-3 h-3" />
              +44 (0)1702 546195
            </a>
            <a href="mailto:info@wdgreenhill.com" className="hover:text-white transition-colors">
              info@wdgreenhill.com
            </a>
          </div>
        </div>

        {/* Main nav */}
        <div className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
          {/* Logo */}
          <Link href="/" aria-label="WD Greenhill & Co — home">
            <Logo variant={logoVariant} />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8" aria-label="Main navigation">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                aria-current={pathname.startsWith(link.href) && link.href !== "/" ? "page" : undefined}
                className={cn(
                  "nav-link text-sm font-semibold transition-colors duration-200",
                  scrolled || !hasDarkHero
                    ? "text-[hsl(240,10%,4%)] hover:text-[hsl(245,85%,58%)]"
                    : "text-white/90 hover:text-white"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setCartOpen(true)}
              className={cn(
                "relative flex items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold transition-all duration-200",
                scrolled || !hasDarkHero
                  ? "bg-[hsl(245,85%,58%)] text-white hover:bg-[hsl(245,85%,50%)]"
                  : "bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm"
              )}
              aria-label="Open cart"
              data-cart-trigger
            >
              <ShoppingCart className="w-4 h-4" />
              <span className="hidden sm:inline">Cart</span>
              <AnimatePresence>
                {mounted && totalItems > 0 && (
                  <motion.span
                    key={totalItems}
                    className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-[hsl(38,93%,50%)] text-xs font-bold text-[hsl(240,10%,4%)]"
                    initial={{ scale: 0.4, opacity: 0 }}
                    animate={{ scale: [1.4, 1], opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                  >
                    {totalItems}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>

            {/* Mobile menu toggle */}
            <button
              className={cn(
                "md:hidden rounded-md p-2 transition-colors",
                scrolled || !hasDarkHero ? "text-[hsl(240,10%,4%)]" : "text-white"
              )}
              onClick={() => setMenuOpen((v) => !v)}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <nav
            className="md:hidden bg-white border-t border-[hsl(240,6%,88%)] px-6 pb-4"
            aria-label="Mobile navigation"
          >
            <div className="flex items-center gap-2 py-3 text-xs text-[hsl(240,4%,46%)]">
              <Phone className="w-3 h-3" />
              <a href="tel:+441702546195">+44 (0)1702 546195</a>
            </div>
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block py-3 border-b border-[hsl(240,6%,92%)] text-sm font-semibold text-[hsl(240,10%,4%)] hover:text-[hsl(245,85%,58%)] transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-4">
              <Button asChild className="w-full" size="sm">
                <Link href="/repairs/request">Request a Repair</Link>
              </Button>
            </div>
          </nav>
        )}
      </header>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
