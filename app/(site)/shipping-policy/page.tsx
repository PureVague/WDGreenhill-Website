import type { Metadata } from "next";
import Link from "next/link";
import { getShippingSettings } from "@/lib/sanity/data";
import { formatPrice } from "@/lib/format";

export const metadata: Metadata = {
  title: "Shipping & Returns Policy",
  description:
    "How WD Greenhill & Co ships digital piano, keyboard, and organ parts worldwide — UK, Europe, and rest of world rates, customs, delivery times, and returns.",
};

export const revalidate = 60;

// Fallbacks only for display resilience if Sanity is briefly unreachable —
// the live rates come from shippingSettings (edited in Studio).
const FALLBACK = { uk: 5.95, europe: 14.95, row: 24.95 };

export default async function ShippingPolicyPage() {
  const settings = await getShippingSettings();
  const zones = settings?.zones ?? [];
  const feeFor = (key: "uk" | "europe" | "row") =>
    zones.find((z) => z.zoneKey === key)?.baseFeeGBP ?? FALLBACK[key];
  const ukFree = zones.find((z) => z.zoneKey === "uk")?.freeShippingThresholdGBP;

  const ukFee = formatPrice(feeFor("uk"));
  const euFee = formatPrice(feeFor("europe"));
  const rowFee = formatPrice(feeFor("row"));

  return (
    <div className="min-h-screen pt-28 pb-24">
      <div className="max-w-3xl mx-auto px-6">
        <nav aria-label="Breadcrumb" className="text-sm text-[hsl(240,4%,56%)] mb-8">
          <Link href="/" className="hover:text-[hsl(245,85%,58%)] transition-colors">Home</Link>
          <span className="mx-2">/</span>
          <span aria-current="page">Shipping & Returns</span>
        </nav>

        {/* Draft banner */}
        <div className="mb-8 p-4 rounded-lg bg-amber-50 border border-amber-200">
          <p className="text-sm font-semibold text-amber-800">
            Draft — please have this policy reviewed by a solicitor before launch.
          </p>
        </div>

        <h1 className="font-display font-bold text-4xl mb-2">Shipping &amp; Returns</h1>
        <p className="text-sm text-[hsl(240,4%,56%)] mb-10">
          W D Greenhill &amp; Co Ltd · Last updated:{" "}
          {new Date().toLocaleDateString("en-GB", { month: "long", year: "numeric" })}
        </p>

        <div className="prose prose-sm max-w-none text-[hsl(240,4%,36%)] space-y-8">
          <p>
            We ship parts, consumables, and manuals worldwide. Shipping is charged by weight, so a
            single chip costs a great deal less to send than a cabinet panel. The rate is calculated
            and shown before you pay. Larger or heavier items are sent by courier and quoted
            individually — see <a href="#quote">Ships by quote</a> below.
          </p>

          {/* UK */}
          <section>
            <h2 className="font-display font-bold text-2xl text-[hsl(240,10%,4%)] mb-4">UK Shipping</h2>
            <ul>
              <li><strong>Areas covered:</strong> mainland Great Britain, Northern Ireland, the Isle of Man, and the Channel Islands.</li>
              <li><strong>Method:</strong> Royal Mail Tracked 48 for standard parts; courier for larger items.</li>
              <li><strong>Cost:</strong> from {ukFee}, calculated by total weight.</li>
              <li><strong>Delivery time:</strong> typically 2–4 working days once despatched.</li>
              {ukFree != null && (
                <li><strong>Free shipping</strong> on UK orders over {formatPrice(ukFree)} (ex. VAT).</li>
              )}
            </ul>
          </section>

          {/* Europe */}
          <section>
            <h2 className="font-display font-bold text-2xl text-[hsl(240,10%,4%)] mb-4">European Shipping</h2>
            <ul>
              <li><strong>Areas covered:</strong> all EU member states, plus Switzerland, Norway, Iceland, Liechtenstein, and the European microstates.</li>
              <li><strong>Method:</strong> Royal Mail International Tracked.</li>
              <li><strong>Cost:</strong> from {euFee}, calculated by total weight.</li>
              <li><strong>Delivery time:</strong> typically 5–10 working days.</li>
            </ul>
            <p className="mt-4">
              <strong>Customs &amp; VAT (important):</strong> Since Brexit, orders shipped to the EU are
              exported from the UK without VAT. Your own country&apos;s import VAT, customs duty, and any
              courier handling fee may apply on arrival, and these are the responsibility of the recipient.
              In practice, small parts and manuals are usually delivered without additional charges, but we
              cannot guarantee it, as the rules vary from country to country.
            </p>
          </section>

          {/* Rest of World */}
          <section>
            <h2 className="font-display font-bold text-2xl text-[hsl(240,10%,4%)] mb-4">Rest of World Shipping</h2>
            <ul>
              <li><strong>Areas covered:</strong> everywhere outside the UK and Europe — the USA, Canada, Australia, Japan, and beyond.</li>
              <li><strong>Method:</strong> International Tracked.</li>
              <li><strong>Cost:</strong> from {rowFee}, calculated by total weight.</li>
              <li><strong>Delivery time:</strong> typically 7–21 working days.</li>
            </ul>
            <p className="mt-4">
              <strong>US customers:</strong> for lower-value orders, Royal Mail&apos;s Postal Delivery Duties
              Paid service handles US import formalities where applicable, which usually means your parcel is
              delivered without further action on your part. Higher-value shipments may still attract duty.
            </p>
            <p className="mt-2">
              <strong>Customs &amp; VAT:</strong> as with Europe, any import VAT, duty, or handling fee levied
              by the destination country is the responsibility of the recipient and is not included in the
              shipping cost shown at checkout.
            </p>
          </section>

          {/* Ships by quote */}
          <section id="quote">
            <h2 className="font-display font-bold text-2xl text-[hsl(240,10%,4%)] mb-4">Ships by Quote (heavy or large items)</h2>
            <p>
              Some items are too heavy or too large to fall within our standard weight bands, or need a
              courier rather than Royal Mail. Rather than overcharge everyone with a blanket rate, we quote
              these individually so you pay the fair cost for your address.
            </p>
            <p className="mt-2"><strong>How it works:</strong></p>
            <ol>
              <li>Add the items to your basket and choose <strong>Request Shipping Quote</strong> at checkout.</li>
              <li>Complete the short form — we&apos;ll email you a shipping quote within 1 working day.</li>
              <li>Accept the quote and pay securely via the payment link we send.</li>
              <li>We despatch your order and send tracking.</li>
            </ol>
            <p className="mt-2">
              Items that typically need a quote include full keyboards and key assemblies, cabinet parts and
              panels, large PCB assemblies, speakers, and anything over our per-item weight or size limit. No
              payment is taken until you accept the quote.
            </p>
          </section>

          {/* Delivery times */}
          <section>
            <h2 className="font-display font-bold text-2xl text-[hsl(240,10%,4%)] mb-4">Estimated Delivery Times</h2>
            <table className="w-full text-sm border border-[hsl(240,6%,88%)]">
              <thead className="bg-[hsl(240,5%,96%)]">
                <tr>
                  <th className="text-left px-4 py-2.5 font-semibold">Destination</th>
                  <th className="text-left px-4 py-2.5 font-semibold">From</th>
                  <th className="text-left px-4 py-2.5 font-semibold">Estimated time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[hsl(240,6%,92%)]">
                <tr><td className="px-4 py-2.5">United Kingdom</td><td className="px-4 py-2.5">{ukFee}</td><td className="px-4 py-2.5">2–4 working days</td></tr>
                <tr><td className="px-4 py-2.5">Europe</td><td className="px-4 py-2.5">{euFee}</td><td className="px-4 py-2.5">5–10 working days</td></tr>
                <tr><td className="px-4 py-2.5">Rest of World</td><td className="px-4 py-2.5">{rowFee}</td><td className="px-4 py-2.5">7–21 working days</td></tr>
              </tbody>
            </table>
            <p className="mt-3 text-xs text-[hsl(240,4%,56%)]">
              Delivery times are estimates from the point of despatch and are not guaranteed. Weather,
              customs clearance, and carrier delays can extend them, particularly for international orders.
            </p>
          </section>

          {/* Missing / damaged */}
          <section>
            <h2 className="font-display font-bold text-2xl text-[hsl(240,10%,4%)] mb-4">Missing or Damaged Parcels</h2>
            <p>
              If your order arrives damaged, or doesn&apos;t arrive at all, email{" "}
              <a href="mailto:support@wdgreenhill.com">support@wdgreenhill.com</a> with your order number and
              — for damage — clear photographs of the item and its packaging. Photographs are required before
              we can open a claim with the carrier.
            </p>
            <p className="mt-2">
              Carrier compensation is limited by the service used: up to £75 for Royal Mail Tracked in the UK,
              with international cover varying by destination and service. We&apos;ll always help you recover
              what the carrier allows and put things right.
            </p>
          </section>

          {/* Returns */}
          <section>
            <h2 className="font-display font-bold text-2xl text-[hsl(240,10%,4%)] mb-4">Returns</h2>
            <p>
              Under the UK Consumer Contracts Regulations you have the right to cancel most orders within
              <strong> 14 days</strong> of receiving them, for any reason. To start a return, email{" "}
              <a href="mailto:sales@wdgreenhill.com">sales@wdgreenhill.com</a> with your order number.
            </p>
            <ul className="mt-2">
              <li><strong>Return address:</strong> W D Greenhill &amp; Co Ltd, 138 Ashingdon Road, Rochford, Essex, SS4 1TA, United Kingdom.</li>
              <li><strong>Return postage</strong> is paid by the customer, unless the item was faulty or wrongly supplied — in which case we cover it.</li>
              <li><strong>Refunds</strong> are processed within 14 days of us receiving the returned item, to the original payment method.</li>
              <li><strong>Manuals and digital downloads</strong> are non-returnable once opened or downloaded.</li>
            </ul>
            <p className="mt-2 text-xs text-[hsl(240,4%,56%)]">
              This does not affect your statutory rights in respect of faulty goods.
            </p>
          </section>

          <p className="text-sm">
            Questions about a specific order or destination? Email{" "}
            <a href="mailto:sales@wdgreenhill.com">sales@wdgreenhill.com</a> and we&apos;ll help.
          </p>
        </div>
      </div>
    </div>
  );
}
