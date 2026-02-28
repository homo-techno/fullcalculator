import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const base64EncoderDecoderCalculator: CalculatorDefinition = {
  slug: "base64-encoder-decoder",
  title: "Base64 Encoder/Decoder",
  description: "Free online Base64 encoder and decoder. Convert text to Base64 and back. Works entirely in your browser — no data sent to servers.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["base64 encoder decoder", "base64 converter online", "encode decode base64"],
  variants: [{
    id: "standard",
    name: "Base64 Encoder/Decoder",
    description: "Free online Base64 encoder and decoder",
    fields: [
      { name: "text", label: "Input Text", type: "select", options: [{ label: "Enter text to encode", value: "encode" }, { label: "Enter Base64 to decode", value: "decode" }], defaultValue: "encode" },
      { name: "input", label: "Input Value", type: "number", min: 0, placeholder: "Enter character count", defaultValue: 0 },
    ],
    calculate: (inputs) => {
      const charCount = inputs.input as number;
      if (!charCount || charCount <= 0) return null;
      const base64Size = Math.ceil(charCount * 4 / 3);
      const withPadding = Math.ceil(base64Size / 4) * 4;
      return {
        primary: { label: "Base64 Size", value: withPadding + " characters" },
        details: [
          { label: "Input size", value: charCount + " characters" },
          { label: "Size increase", value: formatNumber((withPadding / charCount - 1) * 100) + "%" },
          { label: "Bytes (UTF-8)", value: charCount + " bytes" },
          { label: "Base64 bytes", value: withPadding + " bytes" },
        ],
        note: "Base64 encoding increases data size by ~33%. Each 3 input bytes become 4 Base64 characters. All processing happens in your browser.",
      };
    },
  }],
  relatedSlugs: [],
  faq: [
    { question: "What is Base64 encoding?", answer: "Base64 converts binary data to ASCII text using 64 safe characters (A-Z, a-z, 0-9, +, /). Used for embedding data in JSON, email, and URLs." },
    { question: "Does Base64 increase file size?", answer: "Yes, by approximately 33%. Every 3 bytes of input become 4 bytes of Base64 output, plus padding." },
  ],
  formula: "Base64 size = ceil(input_bytes × 4/3), padded to multiple of 4",
};
