import type { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { SectionHeading } from "@/components/site/SectionHeading";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { kawaiFaqs } from "@/data/faqs";

export const metadata: Metadata = {
  title: "Kawai Digital Piano FAQ",
  description:
    "Frequently asked questions about Kawai digital piano servicing — firmware updates, pedal behaviour, action noise, and sustain issues. From WDGreenhill, official Kawai UK service partner.",
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: kawaiFaqs
    .map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1").replace(/\*\*?([^*]+)\*\*?/g, "$1"),
      },
    })),
};

export default function KawaiFaqPage() {
  return (
    <div className="min-h-screen pt-28 pb-24">
      <div className="max-w-4xl mx-auto px-6">
        <nav aria-label="Breadcrumb" className="text-sm text-[hsl(240,4%,56%)] mb-8">
          <Link href="/" className="hover:text-[hsl(245,85%,58%)] transition-colors">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/kawai-support" className="hover:text-[hsl(245,85%,58%)] transition-colors">Kawai Support</Link>
          <span className="mx-2">/</span>
          <span aria-current="page">FAQ</span>
        </nav>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />

        <div className="flex items-start gap-4 mb-4">
          <SectionHeading
            label="Knowledge base"
            title="Kawai FAQ"
            subtitle="Technical answers to the most common questions about Kawai digital pianos, from firmware updates to unusual action behaviour."
            className="mb-0 flex-1"
          />
        </div>

        <div className="flex items-center gap-3 mb-10">
          <Badge variant="draft">Draft answers — pending client review</Badge>
          <span className="text-xs text-[hsl(240,4%,56%)]">These answers are prepared by WDGreenhill technicians and are pending final review.</span>
        </div>

        <Accordion type="single" collapsible className="space-y-4">
          {kawaiFaqs.map((faq) => (
            <AccordionItem
              key={faq.id}
              value={faq.id}
              className="border border-[hsl(240,6%,88%)] rounded-xl px-6 bg-white"
            >
              <AccordionTrigger className="text-base font-semibold text-left hover:no-underline hover:text-[hsl(245,85%,58%)] transition-colors py-5">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent>
                <div className="prose prose-sm max-w-none text-[hsl(240,4%,36%)] leading-relaxed pb-2">
                  {faq.answer.split("\n\n").map((para, i) => (
                    <p key={i} dangerouslySetInnerHTML={{ __html: para.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-[hsl(245,85%,58%)] underline underline-offset-2">$1</a>').replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>").replace(/\*([^*]+)\*/g, "<em>$1</em>") }} />
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div className="mt-16 p-8 rounded-2xl bg-[hsl(245,85%,58%)] text-white">
          <h3 className="font-display font-bold text-2xl mb-3">Didn&apos;t find your answer?</h3>
          <p className="text-white/80 mb-6 leading-relaxed">
            Our team has 45 years of experience servicing digital pianos, organs, and keyboards.
            Submit a support request and we&apos;ll respond within one working day.
          </p>
          <Link
            href="/repairs/request"
            className="inline-flex items-center gap-2 bg-white text-[hsl(245,85%,58%)] font-bold rounded-lg px-6 py-3 hover:bg-white/90 transition-colors"
          >
            Request Support →
          </Link>
        </div>
      </div>
    </div>
  );
}
