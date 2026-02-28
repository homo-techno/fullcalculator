import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const hashGeneratorCalculator: CalculatorDefinition = {
  slug: "hash-generator",
  title: "Cryptographic Hash Generator",
  description: "Free online hash generator. Create MD5, SHA-1, SHA-256, and SHA-512 hashes from text input. All processing happens in your browser.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["hash generator online", "sha256 generator", "md5 hash generator online"],
  variants: [{
    id: "standard",
    name: "Cryptographic Hash",
    description: "Free online hash generator",
    fields: [
      { name: "length", label: "Input Text Length", type: "number", suffix: "chars", min: 1, defaultValue: 10 },
      { name: "algorithm", label: "Algorithm", type: "select", options: [{ label: "MD5 (128-bit)", value: "md5" }, { label: "SHA-1 (160-bit)", value: "sha1" }, { label: "SHA-256 (256-bit)", value: "sha256" }, { label: "SHA-512 (512-bit)", value: "sha512" }], defaultValue: "sha256" },
    ],
    calculate: (inputs) => {
      const len = inputs.length as number;
      const algo = inputs.algorithm as string;
      if (!len || len <= 0) return null;
      const hashLengths: Record<string, number> = { md5: 32, sha1: 40, sha256: 64, sha512: 128 };
      const bits: Record<string, number> = { md5: 128, sha1: 160, sha256: 256, sha512: 512 };
      const security: Record<string, string> = { md5: "BROKEN — collision attacks", sha1: "WEAK — deprecated since 2017", sha256: "SECURE — industry standard", sha512: "SECURE — extra margin" };
      return {
        primary: { label: "Hash Length", value: hashLengths[algo] + " hex characters" },
        details: [
          { label: "Algorithm", value: algo.toUpperCase() },
          { label: "Output bits", value: bits[algo] + " bits" },
          { label: "Security status", value: security[algo] },
          { label: "Input size", value: len + " characters" },
        ],
        note: "Use SHA-256 or SHA-512 for security applications. MD5/SHA-1 are deprecated for cryptographic use but still used for checksums.",
      };
    },
  }],
  relatedSlugs: [],
  faq: [
    { question: "Which hash algorithm should I use?", answer: "SHA-256 for most purposes. SHA-512 for extra security. Never use MD5 or SHA-1 for passwords or security — they have known vulnerabilities." },
    { question: "Are hash functions reversible?", answer: "No. Hashes are one-way functions. You cannot recover the original input from a hash. This is why they are used for password storage." },
  ],
  formula: "Hash = one-way function producing fixed-length output from any input",
};
