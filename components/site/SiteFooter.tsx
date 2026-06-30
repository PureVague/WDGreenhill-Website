import Link from "next/link";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { Logo } from "@/components/site/Logo";

const SHOP_LINKS = [
  { label: "Browse All Parts", href: "/shop" },
  { label: "Semiconductors & ICs", href: "/shop/semiconductors" },
  { label: "Keys & Key Frames", href: "/shop/keys-keyframes" },
  { label: "Power Supplies", href: "/shop/power-supplies" },
  { label: "Potentiometers", href: "/shop/potentiometers" },
  { label: "Hammond Oil", href: "/shop/hammond-oil" },
  { label: "Service Manuals", href: "/shop/service-manuals" },
];

const SUPPORT_LINKS = [
  { label: "Repairs & Servicing", href: "/repairs" },
  { label: "Request a Repair", href: "/repairs/request" },
  { label: "Kawai Support Hub", href: "/kawai-support" },
  { label: "Kawai FAQ", href: "/kawai-support/faq" },
  { label: "Manuals Library", href: "/manuals" },
];

const COMPANY_LINKS = [
  { label: "About WDGreenhill", href: "/about" },
  { label: "Contact Us", href: "/contact" },
  { label: "Terms & Conditions", href: "/terms" },
  { label: "Privacy Policy", href: "/privacy-policy" },
];

const FEATURED_BRANDS = ["Hammond", "Kawai", "Yamaha", "Roland", "Fender Rhodes", "Wurlitzer", "Technics", "Korg", "Kurzweil", "Leslie"];

export function SiteFooter() {
  return (
    <footer className="bg-[hsl(240,10%,4%)] text-white">
      {/* Piano keys decorative bar */}
      <div className="h-3" style={{
        background: "repeating-linear-gradient(90deg, #1a1a2e 0px, #1a1a2e 14px, #fff 14px, #fff 16px, #1a1a2e 16px, #1a1a2e 30px)"
      }} aria-hidden="true" />

      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand column */}
          <div className="lg:col-span-1">
            <div className="mb-6">
              <Logo variant="light" />
            </div>
            <p className="text-white/60 text-sm leading-relaxed mb-6">
              Europe&apos;s largest independent stockist of digital piano, keyboard & organ parts. Est. 1980. Official Kawai UK service partner.
            </p>
            <div className="space-y-2 text-sm text-white/60">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-[hsl(245,85%,65%)]" />
                <span>138 Ashingdon Road, Rochford, Essex, SS4 1TA, UK</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 flex-shrink-0 text-[hsl(245,85%,65%)]" />
                <a href="tel:+441702546195" className="hover:text-white transition-colors">+44 (0)1702 546195</a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 flex-shrink-0 text-[hsl(245,85%,65%)]" />
                <a href="tel:+447860890755" className="hover:text-white transition-colors">07860 890755</a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 flex-shrink-0 text-[hsl(245,85%,65%)]" />
                <a href="mailto:info@wdgreenhill.com" className="hover:text-white transition-colors">info@wdgreenhill.com</a>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 flex-shrink-0 text-[hsl(245,85%,65%)]" />
                {/* TODO: confirm with client */}
                <span>Mon–Fri 9:00–17:00</span>
              </div>
            </div>
          </div>

          {/* Shop column */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-[hsl(38,93%,50%)] mb-5">Shop</h3>
            <ul className="space-y-2.5">
              {SHOP_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/60 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support column */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-[hsl(38,93%,50%)] mb-5">Support</h3>
            <ul className="space-y-2.5">
              {SUPPORT_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/60 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company column */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-[hsl(38,93%,50%)] mb-5">Company</h3>
            <ul className="space-y-2.5">
              {COMPANY_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/60 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Brand strip */}
        <div className="mt-14 pt-8 border-t border-white/10">
          <p className="text-xs font-bold uppercase tracking-widest text-white/40 mb-4">Brands We Support</p>
          <div className="flex flex-wrap gap-x-4 gap-y-2">
            {FEATURED_BRANDS.map((brand) => (
              <span key={brand} className="text-xs text-white/30">
                {brand}
              </span>
            ))}
            <span className="text-xs text-white/20">& 20 more</span>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-white/30">
          <p>© {new Date().getFullYear()} W D Greenhill & Co Ltd. All rights reserved. Registered in England.</p>
          <p>Prices shown ex. VAT. UK VAT registration required for exempt purchases.</p>
        </div>
      </div>
    </footer>
  );
}
