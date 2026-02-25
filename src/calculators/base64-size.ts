import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const base64SizeCalculator: CalculatorDefinition = {
  slug: "base64-size-calculator",
  title: "Base64 Encoded Size Calculator",
  description: "Free Base64 size calculator. Calculate the encoded size of data after Base64 encoding, including padding overhead and size increase percentage.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["base64 size calculator", "base64 encoded size", "base64 overhead", "base64 encoding size", "base64 data size"],
  variants: [
    {
      id: "encode-size",
      name: "Base64 Encoded Size",
      description: "Calculate how large data becomes after Base64 encoding",
      fields: [
        { name: "inputSize", label: "Input Data Size", type: "number", placeholder: "e.g. 1024", min: 0 },
        { name: "unit", label: "Unit", type: "select", options: [
          { label: "Bytes", value: "1" },
          { label: "KB", value: "1024" },
          { label: "MB", value: "1048576" },
        ], defaultValue: "1024" },
      ],
      calculate: (inputs) => {
        const inputSize = inputs.inputSize as number;
        const unit = parseFloat(inputs.unit as string) || 1;
        if (!inputSize || inputSize < 0) return null;

        const inputBytes = inputSize * unit;
        // Base64 encodes 3 bytes into 4 characters, with padding
        const encodedBytes = Math.ceil(inputBytes / 3) * 4;
        const overhead = encodedBytes - inputBytes;
        const overheadPercent = (overhead / inputBytes) * 100;

        // With line breaks (76 chars per line + CRLF)
        const lines = Math.ceil(encodedBytes / 76);
        const withLineBreaks = encodedBytes + (lines * 2);

        const formatBytes = (b: number) => {
          if (b >= 1048576) return `${formatNumber(b / 1048576, 2)} MB`;
          if (b >= 1024) return `${formatNumber(b / 1024, 2)} KB`;
          return `${formatNumber(b, 0)} bytes`;
        };

        return {
          primary: { label: "Base64 Encoded Size", value: formatBytes(encodedBytes) },
          details: [
            { label: "Original Size", value: formatBytes(inputBytes) },
            { label: "Encoded Size", value: formatBytes(encodedBytes) },
            { label: "Size Increase", value: formatBytes(overhead) },
            { label: "Overhead Percentage", value: `${formatNumber(overheadPercent, 1)}%` },
            { label: "Encoded Characters", value: formatNumber(encodedBytes, 0) },
            { label: "With Line Breaks (MIME)", value: formatBytes(withLineBreaks) },
            { label: "Ratio", value: `${formatNumber(encodedBytes / inputBytes, 4)}x` },
          ],
        };
      },
    },
    {
      id: "decode-size",
      name: "Decode Size Estimate",
      description: "Estimate the original size from a Base64 encoded data length",
      fields: [
        { name: "encodedSize", label: "Base64 Encoded Size", type: "number", placeholder: "e.g. 1368", min: 0 },
        { name: "unit", label: "Unit", type: "select", options: [
          { label: "Characters", value: "1" },
          { label: "KB", value: "1024" },
          { label: "MB", value: "1048576" },
        ], defaultValue: "1" },
      ],
      calculate: (inputs) => {
        const encodedSize = inputs.encodedSize as number;
        const unit = parseFloat(inputs.unit as string) || 1;
        if (!encodedSize || encodedSize < 0) return null;

        const encodedChars = encodedSize * unit;
        // Base64 decodes 4 characters into 3 bytes
        const decodedBytes = Math.floor(encodedChars / 4) * 3;

        const formatBytes = (b: number) => {
          if (b >= 1048576) return `${formatNumber(b / 1048576, 2)} MB`;
          if (b >= 1024) return `${formatNumber(b / 1024, 2)} KB`;
          return `${formatNumber(b, 0)} bytes`;
        };

        const savings = encodedChars - decodedBytes;

        return {
          primary: { label: "Decoded Size", value: formatBytes(decodedBytes) },
          details: [
            { label: "Encoded Size", value: formatBytes(encodedChars) },
            { label: "Decoded Size", value: formatBytes(decodedBytes) },
            { label: "Space Saved After Decoding", value: formatBytes(savings) },
            { label: "Decoded Bytes", value: formatNumber(decodedBytes, 0) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["json-size-calculator", "data-storage-converter", "image-filesize-calculator"],
  faq: [
    { question: "Why is Base64 encoding larger than the original?", answer: "Base64 encodes 3 bytes of binary data into 4 ASCII characters, resulting in a 33% size increase. This is because Base64 uses only 64 printable ASCII characters (A-Z, a-z, 0-9, +, /) to represent binary data, which is less efficient but safe for text-based protocols." },
    { question: "When should I use Base64 encoding?", answer: "Base64 is used to embed binary data (images, files) in text-based formats like JSON, XML, HTML, CSS, or email (MIME). It is also used in data URIs, JWT tokens, and basic HTTP authentication. Avoid it when binary transfer is possible, as it increases size by ~33%." },
  ],
  formula: "Encoded Size = ceil(Input Bytes / 3) * 4 | Overhead = ~33.33%",
};
