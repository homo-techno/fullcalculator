import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const dataStorageConverter: CalculatorDefinition = {
  slug: "data-storage-converter",
  title: "Data Storage Converter",
  description: "Free data storage converter. Convert between bytes, KB, MB, GB, TB, and PB. Understand file sizes and storage capacity.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: ["bytes to mb", "mb to gb", "data storage converter", "file size converter", "gb to tb converter"],
  variants: [
    {
      id: "convert",
      name: "Convert Data Size",
      fields: [
        { name: "value", label: "Value", type: "number", placeholder: "e.g. 1500" },
        { name: "from", label: "From", type: "select", options: [
          { label: "Bytes (B)", value: "1" },
          { label: "Kilobytes (KB)", value: "1024" },
          { label: "Megabytes (MB)", value: "1048576" },
          { label: "Gigabytes (GB)", value: "1073741824" },
          { label: "Terabytes (TB)", value: "1099511627776" },
        ], defaultValue: "1048576" },
      ],
      calculate: (inputs) => {
        const value = inputs.value as number;
        const factor = parseFloat(inputs.from as string) || 1;
        if (!value) return null;
        const bytes = value * factor;
        return {
          primary: { label: `${formatNumber(value)} (input)`, value: bytes >= 1099511627776 ? `${formatNumber(bytes / 1099511627776, 4)} TB` : bytes >= 1073741824 ? `${formatNumber(bytes / 1073741824, 4)} GB` : `${formatNumber(bytes / 1048576, 4)} MB` },
          details: [
            { label: "Bytes", value: bytes < 1e15 ? formatNumber(bytes, 0) : bytes.toExponential(4) },
            { label: "Kilobytes (KB)", value: formatNumber(bytes / 1024, 4) },
            { label: "Megabytes (MB)", value: formatNumber(bytes / 1048576, 4) },
            { label: "Gigabytes (GB)", value: formatNumber(bytes / 1073741824, 6) },
            { label: "Terabytes (TB)", value: formatNumber(bytes / 1099511627776, 8) },
          ],
          note: "Uses binary (1 KB = 1024 bytes). Storage manufacturers use decimal (1 KB = 1000 bytes), so a '1 TB' drive shows as ~931 GB on your computer.",
        };
      },
    },
  ],
  relatedSlugs: ["unit-converter", "binary-hex-converter", "speed-converter"],
  faq: [
    { question: "Why does my 1TB drive show 931 GB?", answer: "Drive manufacturers use decimal: 1 TB = 1,000,000,000,000 bytes. Computers use binary: 1 TB = 1,099,511,627,776 bytes. So 1,000,000,000,000 ÷ 1,099,511,627,776 ≈ 0.909 TB = ~931 GB." },
  ],
  formula: "1 KB = 1024 B | 1 MB = 1024 KB | 1 GB = 1024 MB | 1 TB = 1024 GB",
};
