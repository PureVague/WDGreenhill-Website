import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy policy for WD Greenhill & Co Ltd.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen pt-28 pb-24">
      <div className="max-w-3xl mx-auto px-6">
        <nav aria-label="Breadcrumb" className="text-sm text-[hsl(240,4%,56%)] mb-8">
          <Link href="/" className="hover:text-[hsl(245,85%,58%)] transition-colors">Home</Link>
          <span className="mx-2">/</span>
          <span aria-current="page">Privacy Policy</span>
        </nav>

        <div className="mb-8 p-4 rounded-lg bg-amber-50 border border-amber-200">
          <p className="text-sm font-semibold text-amber-800">
            Draft — please have this policy reviewed by a solicitor or GDPR specialist before publishing.
          </p>
        </div>

        <h1 className="font-display font-bold text-4xl mb-2">Privacy Policy</h1>
        <p className="text-sm text-[hsl(240,4%,56%)] mb-10">W D Greenhill & Co Ltd · Last updated: {new Date().toLocaleDateString("en-GB", { month: "long", year: "numeric" })}</p>

        <div className="prose prose-sm max-w-none text-[hsl(240,4%,36%)] space-y-8">
          <section>
            <h2 className="font-display font-bold text-2xl text-[hsl(240,10%,4%)] mb-4">1. Who We Are</h2>
            <p>W D Greenhill & Co Ltd (&ldquo;WDGreenhill&rdquo;) is the data controller for personal data collected through this website. Address: 138 Ashingdon Road, Rochford, Essex, SS4 1TA. Email: <a href="mailto:info@wdgreenhill.com" className="text-[hsl(245,85%,58%)] underline underline-offset-2">info@wdgreenhill.com</a>.</p>
          </section>

          <section>
            <h2 className="font-display font-bold text-2xl text-[hsl(240,10%,4%)] mb-4">2. Data We Collect</h2>
            <p>We collect personal data you provide when placing orders (name, email, address, phone), submitting contact or support forms, or signing up for our newsletter. We also collect standard server logs (IP address, browser type, pages visited) for security and analytics purposes.</p>
          </section>

          <section>
            <h2 className="font-display font-bold text-2xl text-[hsl(240,10%,4%)] mb-4">3. How We Use Your Data</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>To process and fulfil your orders</li>
              <li>To respond to enquiries and support requests</li>
              <li>To send you newsletters if you have subscribed (you may unsubscribe at any time)</li>
              <li>To improve our website and services</li>
              <li>To comply with legal obligations</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display font-bold text-2xl text-[hsl(240,10%,4%)] mb-4">4. Legal Basis</h2>
            <p>We process your data on the basis of contract performance (order fulfilment), legitimate interests (improving our services), consent (newsletter), and legal obligation (tax records).</p>
          </section>

          <section>
            <h2 className="font-display font-bold text-2xl text-[hsl(240,10%,4%)] mb-4">5. Third Parties</h2>
            <p>We use Stripe for payment processing. Stripe&apos;s privacy policy governs their handling of your payment data. We do not sell your personal data to third parties. We may share data with postal and courier services to fulfil orders.</p>
          </section>

          <section>
            <h2 className="font-display font-bold text-2xl text-[hsl(240,10%,4%)] mb-4">6. Data Retention</h2>
            <p>Order data is retained for 7 years to comply with UK tax law. Newsletter subscriber data is retained until you unsubscribe. Contact form data is retained for 2 years.</p>
          </section>

          <section>
            <h2 className="font-display font-bold text-2xl text-[hsl(240,10%,4%)] mb-4">7. Your Rights</h2>
            <p>Under UK GDPR you have the right to access, rectify, erase, restrict, and port your personal data, and to object to its processing. Contact <a href="mailto:info@wdgreenhill.com" className="text-[hsl(245,85%,58%)] underline underline-offset-2">info@wdgreenhill.com</a> to exercise any of these rights. You may also complain to the ICO at ico.org.uk.</p>
          </section>

          <section>
            <h2 className="font-display font-bold text-2xl text-[hsl(240,10%,4%)] mb-4">8. Cookies</h2>
            <p>This website uses cookies for shopping cart functionality (localStorage) and analytics. No advertising cookies are used. By using the site you consent to functional cookies.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
