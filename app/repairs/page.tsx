import type { Metadata } from "next";
import Link from "next/link";
import { brands } from "@/data/brands";
import { CheckCircle2, Phone, Wrench, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Digital Piano Repairs — Every Make & Model",
  description:
    "WD Greenhill & Co repairs digital pianos, keyboards, and organs from every major manufacturer. 45 years of specialist experience. Official Kawai UK service partner.",
};

const WHAT_WE_FIX = [
  "Dead, stuck, or noisy keys",
  "Key contact and key frame faults",
  "PCB and mainboard failures",
  "Power supply and transformer faults",
  "Speaker and amplifier faults",
  "Display and LCD panel failures",
  "Pedal mechanism problems",
  "Firmware and software issues",
  "Bluetooth and MIDI connectivity",
  "Cabinet and cosmetic damage",
  "Fader, potentiometer, and switch wear",
  "Leslie speaker and rotary faults",
];

const PROCESS_STEPS = [
  { n: "01", title: "Enquire", body: "Submit your repair request online or call us. Tell us the make, model, and the fault — as much detail as you can." },
  { n: "02", title: "Diagnose", body: "Our technicians review your request and diagnose remotely where possible. We'll ask for photos or video if needed." },
  { n: "03", title: "Quote", body: "We provide a clear, itemised quote — parts and labour. No surprises. You approve before we begin." },
  { n: "04", title: "Repair", body: "Genuine parts sourced from our 30,000+ line stock. Bench repairs completed to original manufacturer specification." },
  { n: "05", title: "Return", body: "Instrument returned fully tested. UK courier collection and return available, or you can ship direct." },
];

export default function RepairsPage() {
  const sortedBrands = [...brands].sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative bg-[hsl(240,10%,4%)] text-white overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-[hsl(245,85%,40%)]/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-[hsl(38,93%,50%)]/10 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 pt-36 pb-24">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[hsl(38,93%,65%)] mb-4">
            Specialist Repairs · Est. 1980
          </p>
          <h1 className="font-display font-bold text-4xl sm:text-5xl md:text-6xl leading-[1.05] mb-6 max-w-3xl">
            Digital piano repairs —{" "}
            <span className="text-[hsl(38,93%,65%)]">every make,</span>{" "}
            every model.
          </h1>
          <p className="text-lg text-white/70 max-w-2xl leading-relaxed mb-10">
            Over 45 years of specialist experience repairing digital pianos, keyboards, and organs
            from every major manufacturer. We hold the UK&apos;s largest independent stock of genuine spare parts.
            Official Kawai service partner for UK customers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button asChild size="lg" className="bg-[hsl(38,93%,50%)] hover:bg-[hsl(38,93%,42%)] text-[hsl(240,10%,4%)] font-bold text-base gap-2">
              <Link href="/repairs/request">
                Request a Repair <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10 gap-2">
              <a href="tel:+441702546195">
                <Phone className="w-4 h-4" /> Call 01702 546195
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Brands we repair */}
      <section className="py-20 bg-white border-b border-[hsl(240,6%,88%)]">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[hsl(245,85%,58%)] mb-3">All makes supported</p>
          <h2 className="font-display font-bold text-3xl md:text-4xl mb-4">Brands we repair</h2>
          <p className="text-[hsl(240,4%,46%)] mb-10 max-w-2xl">
            We repair instruments from every major digital piano, keyboard, and organ manufacturer —
            including vintage and discontinued models. If the parts exist, we can source them.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {sortedBrands.map((brand) => (
              <div
                key={brand.slug}
                className="group flex items-center gap-3 p-3 rounded-lg border border-[hsl(240,6%,88%)] bg-[hsl(50,20%,98%)] hover:border-[hsl(245,85%,58%)] hover:bg-[hsl(245,85%,58%)]/5 transition-all"
              >
                <div className="w-2 h-2 rounded-full bg-[hsl(245,85%,58%)] flex-shrink-0 group-hover:scale-125 transition-transform" />
                <span className="text-sm font-semibold text-[hsl(240,10%,4%)]">{brand.name}</span>
                {brand.slug === "kawai" && (
                  <span className="ml-auto text-[10px] font-bold text-[hsl(245,85%,58%)] bg-[hsl(245,85%,58%)]/10 px-1.5 py-0.5 rounded">
                    Official
                  </span>
                )}
              </div>
            ))}
            <div className="flex items-center gap-3 p-3 rounded-lg border border-dashed border-[hsl(240,6%,88%)] bg-transparent">
              <div className="w-2 h-2 rounded-full bg-[hsl(240,4%,70%)] flex-shrink-0" />
              <span className="text-sm text-[hsl(240,4%,56%)] italic">Other — ask us</span>
            </div>
          </div>
        </div>
      </section>

      {/* Kawai partnership callout */}
      <section className="py-16 bg-[hsl(245,85%,58%)] text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/60 mb-3">Signature capability</p>
              <h2 className="font-display font-bold text-3xl md:text-4xl mb-4">
                Official Kawai UK service partner
              </h2>
              <p className="text-white/80 leading-relaxed mb-6">
                WD Greenhill is recommended by Kawai UK for all out-of-warranty servicing and repair.
                We hold the UK&apos;s most comprehensive stock of genuine Kawai spare parts — action
                components, PCBs, power supplies, speakers, and more.
              </p>
              <p className="text-white/80 leading-relaxed mb-8">
                Kawai work is a signature capability, but it represents only a fraction of the
                instruments we service. Whatever make you own, our technicians have the parts and
                expertise to help.
              </p>
              <Button asChild variant="outline" className="border-white/30 text-white hover:bg-white/10">
                <Link href="/kawai-support">Kawai Support Hub →</Link>
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { stat: "45+", label: "Years of experience" },
                { stat: "30+", label: "Brands supported" },
                { stat: "30k+", label: "Parts in stock" },
                { stat: "1 day", label: "Response target" },
              ].map(({ stat, label }) => (
                <div key={label} className="p-6 rounded-xl bg-white/10 backdrop-blur-sm">
                  <p className="font-display font-bold text-3xl text-white">{stat}</p>
                  <p className="text-sm text-white/70 mt-1">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* What we fix */}
      <section className="py-20 bg-[hsl(50,20%,98%)]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-start">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[hsl(245,85%,58%)] mb-3">Fault types</p>
              <h2 className="font-display font-bold text-3xl md:text-4xl mb-4">What we fix</h2>
              <p className="text-[hsl(240,4%,46%)] leading-relaxed mb-8">
                From a single dead key to a complete electronic failure, our technicians can diagnose
                and repair faults across the full instrument — including PCB-level component work.
              </p>
              <Button asChild size="lg" className="gap-2">
                <Link href="/repairs/request">
                  <Wrench className="w-4 h-4" />
                  Request a Repair
                </Link>
              </Button>
            </div>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {WHAT_WE_FIX.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[hsl(245,85%,58%)] flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-[hsl(240,4%,36%)]">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Process timeline */}
      <section className="py-20 bg-white border-t border-[hsl(240,6%,88%)]">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[hsl(245,85%,58%)] mb-3 text-center">How it works</p>
          <h2 className="font-display font-bold text-3xl md:text-4xl mb-14 text-center">The repair process</h2>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 md:gap-4">
            {PROCESS_STEPS.map((step, i) => (
              <div key={step.n} className="relative flex flex-col items-center text-center md:items-start md:text-left">
                {/* Connector line between steps (desktop) */}
                {i < PROCESS_STEPS.length - 1 && (
                  <div className="hidden md:block absolute top-6 left-[calc(50%+24px)] right-[-50%] h-px bg-[hsl(245,85%,58%)]/30" aria-hidden="true" />
                )}
                <div className="w-12 h-12 rounded-full bg-[hsl(245,85%,58%)] text-white flex items-center justify-center font-bold text-sm mb-4 z-10 flex-shrink-0">
                  {step.n}
                </div>
                <h3 className="font-display font-bold text-lg mb-2">{step.title}</h3>
                <p className="text-sm text-[hsl(240,4%,46%)] leading-relaxed">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA bar */}
      <section className="py-16 bg-[hsl(240,10%,4%)] text-white">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="font-display font-bold text-3xl md:text-4xl mb-4">Ready to get started?</h2>
          <p className="text-white/60 mb-8 leading-relaxed">
            Submit your repair request online and we&apos;ll respond within one working day.
            Or call us directly to discuss your instrument.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-[hsl(38,93%,50%)] hover:bg-[hsl(38,93%,42%)] text-[hsl(240,10%,4%)] font-bold gap-2">
              <Link href="/repairs/request">
                Request a Repair <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10 gap-2">
              <a href="tel:+441702546195">
                <Phone className="w-4 h-4" /> 01702 546195
              </a>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
