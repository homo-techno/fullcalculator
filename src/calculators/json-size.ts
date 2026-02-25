import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const jsonSizeCalculator: CalculatorDefinition = {
  slug: "json-size-calculator",
  title: "JSON Size Calculator",
  description: "Free JSON size calculator. Estimate the byte size of JSON payloads based on field count, field types, and nesting depth for API planning.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["json size calculator", "json payload size", "json byte size", "api payload estimator", "json data size"],
  variants: [
    {
      id: "json-estimate",
      name: "Estimate JSON Size",
      description: "Estimate the size of a JSON object based on fields and values",
      fields: [
        { name: "stringFields", label: "Number of String Fields", type: "number", placeholder: "e.g. 5", min: 0, defaultValue: 5 },
        { name: "avgStringLength", label: "Avg String Value Length (chars)", type: "number", placeholder: "e.g. 20", min: 1, defaultValue: 20 },
        { name: "numberFields", label: "Number of Number Fields", type: "number", placeholder: "e.g. 3", min: 0, defaultValue: 3 },
        { name: "boolFields", label: "Number of Boolean Fields", type: "number", placeholder: "e.g. 2", min: 0, defaultValue: 2 },
        { name: "avgKeyLength", label: "Avg Key Name Length (chars)", type: "number", placeholder: "e.g. 10", min: 1, defaultValue: 10 },
        { name: "arrayItems", label: "Array Items (objects with above schema)", type: "number", placeholder: "e.g. 1", min: 1, defaultValue: 1 },
      ],
      calculate: (inputs) => {
        const stringFields = (inputs.stringFields as number) || 0;
        const avgStringLength = (inputs.avgStringLength as number) || 20;
        const numberFields = (inputs.numberFields as number) || 0;
        const boolFields = (inputs.boolFields as number) || 0;
        const avgKeyLength = (inputs.avgKeyLength as number) || 10;
        const arrayItems = (inputs.arrayItems as number) || 1;

        // Each field has: "key": value  (quotes around key = 2 chars, colon + space = 2, comma = 1)
        const overhead = 5; // "": , per field
        const stringFieldSize = stringFields * (avgKeyLength + overhead + avgStringLength + 2); // +2 for quotes around value
        const numberFieldSize = numberFields * (avgKeyLength + overhead + 6); // avg number is ~6 chars
        const boolFieldSize = boolFields * (avgKeyLength + overhead + 5); // "true" or "false" avg ~5

        const singleObjectSize = stringFieldSize + numberFieldSize + boolFieldSize + 2; // +2 for {}
        const totalSize = arrayItems === 1 ? singleObjectSize : (singleObjectSize * arrayItems) + (arrayItems - 1) + 2; // commas + []

        const gzipEstimate = Math.round(totalSize * 0.3);
        const base64Size = Math.ceil(totalSize * 4 / 3);

        return {
          primary: { label: "Estimated JSON Size", value: totalSize >= 1024 ? `${formatNumber(totalSize / 1024, 2)} KB` : `${formatNumber(totalSize, 0)} bytes` },
          details: [
            { label: "Raw Size (bytes)", value: formatNumber(totalSize, 0) },
            { label: "Raw Size (KB)", value: formatNumber(totalSize / 1024, 2) },
            { label: "Gzip Estimate (~30%)", value: gzipEstimate >= 1024 ? `${formatNumber(gzipEstimate / 1024, 2)} KB` : `${formatNumber(gzipEstimate, 0)} bytes` },
            { label: "Base64 Encoded Size", value: formatNumber(base64Size, 0) + " bytes" },
            { label: "Total Fields per Object", value: formatNumber(stringFields + numberFields + boolFields, 0) },
            { label: "Array Items", value: formatNumber(arrayItems, 0) },
            { label: "Size per Object", value: formatNumber(singleObjectSize, 0) + " bytes" },
          ],
        };
      },
    },
    {
      id: "records-payload",
      name: "API Response Size",
      description: "Estimate total API response size for a given number of records",
      fields: [
        { name: "recordSize", label: "Avg Record Size (bytes)", type: "number", placeholder: "e.g. 500", min: 1, defaultValue: 500 },
        { name: "records", label: "Number of Records", type: "number", placeholder: "e.g. 100", min: 1, defaultValue: 100 },
        { name: "overhead", label: "Response Overhead (bytes)", type: "number", placeholder: "e.g. 200", min: 0, defaultValue: 200 },
      ],
      calculate: (inputs) => {
        const recordSize = (inputs.recordSize as number) || 500;
        const records = (inputs.records as number) || 100;
        const overhead = (inputs.overhead as number) || 0;

        const totalBytes = (recordSize * records) + overhead;
        const gzipEstimate = Math.round(totalBytes * 0.3);

        const formatBytes = (b: number) => {
          if (b >= 1048576) return `${formatNumber(b / 1048576, 2)} MB`;
          if (b >= 1024) return `${formatNumber(b / 1024, 2)} KB`;
          return `${formatNumber(b, 0)} bytes`;
        };

        // Time estimates at different speeds
        const time3G = (totalBytes * 8) / (2 * 1000000); // 2 Mbps
        const time4G = (totalBytes * 8) / (20 * 1000000); // 20 Mbps
        const timeBroadband = (totalBytes * 8) / (100 * 1000000); // 100 Mbps

        return {
          primary: { label: "Total Response Size", value: formatBytes(totalBytes) },
          details: [
            { label: "Total Size", value: formatBytes(totalBytes) },
            { label: "Gzip Estimate (~30%)", value: formatBytes(gzipEstimate) },
            { label: "Records", value: formatNumber(records, 0) },
            { label: "Per Record", value: formatBytes(recordSize) },
            { label: "Download on 3G (~2 Mbps)", value: `${formatNumber(time3G * 1000, 0)} ms` },
            { label: "Download on 4G (~20 Mbps)", value: `${formatNumber(time4G * 1000, 0)} ms` },
            { label: "Download on Broadband (~100 Mbps)", value: `${formatNumber(timeBroadband * 1000, 1)} ms` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["base64-size-calculator", "data-storage-converter", "api-rate-limit-calculator"],
  faq: [
    { question: "Why does JSON size matter?", answer: "JSON size affects API response times, bandwidth costs, and client-side parsing performance. Large payloads slow mobile apps, increase data transfer costs, and can exceed API gateway limits (e.g., AWS API Gateway has a 10 MB limit)." },
    { question: "How much does gzip reduce JSON size?", answer: "Gzip typically compresses JSON to 20-40% of its original size because JSON has lots of repetitive structure (keys, braces, quotes). Highly repetitive data can compress to as little as 10% of original size." },
  ],
  formula: "Size = Sum(keyLength + overhead + valueSize) per field | Gzip ~= Raw * 0.3",
};
