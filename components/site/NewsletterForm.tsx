"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export function NewsletterForm() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    await fetch("/api/newsletter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: data.get("email") }),
    });
    setSubmitted(true);
    form.reset();
  };

  if (submitted) {
    return (
      <p className="text-[hsl(245,85%,58%)] font-semibold">
        Thanks for subscribing — we&apos;ll be in touch.
      </p>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col sm:flex-row gap-3 mt-4"
    >
      <input
        type="email"
        name="email"
        required
        placeholder="your@email.com"
        className="flex-1 h-12 px-4 rounded-lg border border-[hsl(240,6%,88%)] bg-[hsl(240,5%,96%)] text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(245,85%,58%)]"
        aria-label="Email address for newsletter"
      />
      <Button type="submit" size="lg">Subscribe</Button>
    </form>
  );
}
