"use client";

import { motion, type Variants } from "framer-motion";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { cn } from "@/lib/utils";

interface Props {
  text: string;
  className?: string;
  highlightWords?: string[];
  highlightClassName?: string;
  delay?: number;
}

export function AnimatedHeadline({
  text,
  className,
  highlightWords = [],
  highlightClassName = "text-[hsl(38,93%,50%)]",
  delay = 0,
}: Props) {
  const reduced = useReducedMotion();
  const words = text.split(" ");

  if (reduced) {
    return (
      <span className={className}>
        {words.map((word, i) => {
          const isHighlighted = highlightWords.includes(word);
          return (
            <span key={i} className={cn(isHighlighted && highlightClassName)}>
              {word}{i < words.length - 1 ? " " : ""}
            </span>
          );
        })}
      </span>
    );
  }

  const container = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.06, delayChildren: delay } },
  };

  const wordVariant: Variants = {
    hidden: { opacity: 0, y: 24, rotate: -2 },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    visible: { opacity: 1, y: 0, rotate: 0, transition: { duration: 0.5 } } as any,
  };

  return (
    <motion.span
      className={cn("inline", className)}
      variants={container}
      initial="hidden"
      animate="visible"
    >
      {words.map((word, i) => {
        const isHighlighted = highlightWords.includes(word);
        return (
          <motion.span
            key={i}
            className={cn("inline-block", isHighlighted && highlightClassName)}
            variants={wordVariant}
          >
            {word}{i < words.length - 1 ? "\u00a0" : ""}
          </motion.span>
        );
      })}
    </motion.span>
  );
}
