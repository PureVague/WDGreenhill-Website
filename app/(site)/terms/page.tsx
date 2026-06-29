import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: "Terms and conditions for WD Greenhill & Co Ltd.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen pt-28 pb-24">
      <div className="max-w-3xl mx-auto px-6">
        <nav aria-label="Breadcrumb" className="text-sm text-[hsl(240,4%,56%)] mb-8">
          <Link href="/" className="hover:text-[hsl(245,85%,58%)] transition-colors">Home</Link>
          <span className="mx-2">/</span>
          <span aria-current="page">Terms & Conditions</span>
        </nav>

        {/* Draft banner */}
        <div className="mb-8 p-4 rounded-lg bg-amber-50 border border-amber-200">
          <p className="text-sm font-semibold text-amber-800">
            Draft — please have these terms reviewed by a solicitor before publishing.
          </p>
        </div>

        <h1 className="font-display font-bold text-4xl mb-2">Terms & Conditions</h1>
        <p className="text-sm text-[hsl(240,4%,56%)] mb-10">W D Greenhill & Co Ltd · Last updated: {new Date().toLocaleDateString("en-GB", { month: "long", year: "numeric" })}</p>

        <div className="prose prose-sm max-w-none text-[hsl(240,4%,36%)] space-y-8">
          <section>
            <h2 className="font-display font-bold text-2xl text-[hsl(240,10%,4%)] mb-4">1. Company Information</h2>
            <p>W D Greenhill & Co Ltd (&ldquo;WDGreenhill&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;) is a company registered in England and Wales. Our registered address is 138 Ashingdon Road, Rochford, Essex, SS4 1TA. VAT registration details available on request.</p>
          </section>

          <section>
            <h2 className="font-display font-bold text-2xl text-[hsl(240,10%,4%)] mb-4">2. Products and Pricing</h2>
            <p>All prices shown on the website are exclusive of VAT unless otherwise stated. UK VAT at the standard rate (currently 20%) will be added at checkout. WDGreenhill reserves the right to modify prices without notice. Orders are not binding until accepted and confirmed by WDGreenhill.</p>
            <p>Product descriptions and compatibility information are provided in good faith. We recommend confirming fitment before ordering, particularly for older or discontinued instruments. Contact us with your model and serial number if in doubt.</p>
          </section>

          <section>
            <h2 className="font-display font-bold text-2xl text-[hsl(240,10%,4%)] mb-4">3. Orders and Payment</h2>
            <p>Payment is processed securely via Stripe. We accept major credit and debit cards. Orders are subject to availability. In the event that an ordered item is unavailable, we will contact you promptly to offer an alternative or full refund.</p>
          </section>

          <section>
            <h2 className="font-display font-bold text-2xl text-[hsl(240,10%,4%)] mb-4">4. Delivery</h2>
            <p>We aim to despatch orders received before 2:00pm on working days the same day. Delivery timescales are estimates and are not guaranteed. WDGreenhill is not liable for delays caused by postal or courier services. Risk passes to the buyer on despatch. International orders may be subject to import duties payable by the buyer.</p>
          </section>

          <section>
            <h2 className="font-display font-bold text-2xl text-[hsl(240,10%,4%)] mb-4">5. Returns and Refunds</h2>
            <p>Unused parts in original condition may be returned within 30 days of receipt. Please contact <a href="mailto:sales@wdgreenhill.com" className="text-[hsl(245,85%,58%)] underline underline-offset-2">sales@wdgreenhill.com</a> before returning any item. Return postage is the buyer&apos;s responsibility unless the item is defective or incorrectly supplied.</p>
            <p>Manuals supplied as copies are non-returnable once despatched.</p>
          </section>

          <section>
            <h2 className="font-display font-bold text-2xl text-[hsl(240,10%,4%)] mb-4">6. Limitation of Liability</h2>
            <p>WDGreenhill&apos;s liability to you shall not exceed the value of the goods supplied. We are not liable for indirect or consequential loss arising from the use of parts purchased from us. Nothing in these terms limits liability for death or personal injury caused by negligence.</p>
          </section>

          <section>
            <h2 className="font-display font-bold text-2xl text-[hsl(240,10%,4%)] mb-4">7. Governing Law</h2>
            <p>These terms are governed by the laws of England and Wales. Any disputes shall be subject to the exclusive jurisdiction of the courts of England and Wales.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
