import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const uuidGeneratorCalculator: CalculatorDefinition = {
  slug: "uuid-generator",
  title: "UUID/GUID Generator",
  description: "Free UUID v4 generator. Generate universally unique identifiers for databases, APIs, and distributed systems.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["uuid generator", "guid generator online", "uuid v4 generator"],
  variants: [{
    id: "standard",
    name: "UUID/GUID",
    description: "Free UUID v4 generator",
    fields: [
      { name: "count", label: "Number of UUIDs", type: "number", min: 1, max: 100, defaultValue: 5 },
      { name: "format", label: "Format", type: "select", options: [{ label: "Standard (with hyphens)", value: "standard" }, { label: "No hyphens", value: "nohyphens" }, { label: "Uppercase", value: "upper" }], defaultValue: "standard" },
    ],
    calculate: (inputs) => {
      const count = inputs.count as number;
      const format = inputs.format as string;
      if (!count || count <= 0) return null;
      const uuids = [];
      for (let i = 0; i < Math.min(count, 5); i++) {
        let uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
          const r = Math.random() * 16 | 0;
          return (c === "x" ? r : (r & 0x3 | 0x8)).toString(16);
        });
        if (format === "nohyphens") uuid = uuid.replace(/-/g, "");
        if (format === "upper") uuid = uuid.toUpperCase();
        uuids.push(uuid);
      }
      return {
        primary: { label: "UUID v4", value: uuids[0] },
        details: uuids.slice(1).map((u, i) => ({ label: "UUID " + (i + 2), value: u })),
        note: "UUID v4 uses random/pseudo-random numbers. Collision probability: ~1 in 5.3×10³⁶. Safe for distributed systems without coordination.",
      };
    },
  }],
  relatedSlugs: [],
  faq: [
    { question: "What is a UUID?", answer: "Universally Unique Identifier — a 128-bit identifier formatted as 32 hex digits in 5 groups: 8-4-4-4-12. UUID v4 uses random generation." },
    { question: "Can UUIDs collide?", answer: "Theoretically yes, but the probability is astronomically low — you would need to generate 2.71×10¹⁸ UUIDs for a 50% chance of one collision." },
  ],
  formula: "UUID v4: random 128-bit identifier. Format: 8-4-4-4-12 hex digits",
};
