import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const databaseSizeCalculator: CalculatorDefinition = {
  slug: "database-size-calculator",
  title: "Database Size Calculator",
  description: "Estimate database storage requirements based on record count, row size, and index overhead.",
  category: "Math",
  categorySlug: "math",
  icon: "+",
  keywords: ["database size", "DB storage calculator", "database storage estimation"],
  variants: [{
    id: "standard",
    name: "Database Size",
    description: "Estimate database storage requirements based on record count, row size, and index overhead",
    fields: [
      { name: "rowCount", label: "Number of Rows", type: "number", suffix: "rows", min: 1000, max: 10000000000, step: 10000, defaultValue: 1000000 },
      { name: "avgRowSize", label: "Average Row Size", type: "number", suffix: "bytes", min: 10, max: 10000, step: 10, defaultValue: 500 },
      { name: "indexCount", label: "Number of Indexes", type: "number", suffix: "indexes", min: 0, max: 50, defaultValue: 5 },
      { name: "growthRate", label: "Monthly Growth Rate", type: "number", suffix: "%", min: 0, max: 100, step: 1, defaultValue: 10 },
    ],
    calculate: (inputs) => {
      const rows = inputs.rowCount as number;
      const rowSize = inputs.avgRowSize as number;
      const indexes = inputs.indexCount as number;
      const growth = (inputs.growthRate as number) / 100;
      if (!rows || !rowSize || rows <= 0 || rowSize <= 0) return null;
      const rawDataBytes = rows * rowSize;
      const indexOverhead = indexes * rows * 50;
      const totalBytes = rawDataBytes + indexOverhead;
      const totalGB = totalBytes / (1024 * 1024 * 1024);
      const sixMonthGB = totalGB * Math.pow(1 + growth, 6);
      const oneYearGB = totalGB * Math.pow(1 + growth, 12);
      const unit = totalGB >= 1 ? "GB" : "MB";
      const displaySize = totalGB >= 1 ? totalGB : totalGB * 1024;
      return {
        primary: { label: "Current Database Size", value: formatNumber(Math.round(displaySize * 100) / 100) + " " + unit },
        details: [
          { label: "Raw Data Size", value: formatNumber(Math.round(rawDataBytes / (1024 * 1024) * 100) / 100) + " MB" },
          { label: "6-Month Projection", value: formatNumber(Math.round(sixMonthGB * 100) / 100) + " GB" },
          { label: "12-Month Projection", value: formatNumber(Math.round(oneYearGB * 100) / 100) + " GB" },
        ],
      };
    },
  }],
  relatedSlugs: ["server-sizing-calculator", "cloud-cost-calculator"],
  faq: [
    { question: "How do I estimate database storage needs?", answer: "Multiply the number of rows by the average row size to get raw data size, then add 20 to 40 percent for index overhead, transaction logs, and system metadata." },
    { question: "What contributes to database size beyond data?", answer: "Indexes, transaction logs, temporary tables, system catalogs, and fragmentation all contribute to the total database size beyond the raw data itself." },
  ],
  formula: "Database Size = (Rows x Row Size) + (Indexes x Rows x 50 bytes overhead)",
};
