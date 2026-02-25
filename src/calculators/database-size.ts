import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const databaseSizeCalculator: CalculatorDefinition = {
  slug: "database-size-estimator",
  title: "Database Size Estimator",
  description: "Free database size estimator. Calculate expected database storage requirements based on row size, row count, indexes, and growth rate.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["database size calculator", "database storage estimator", "db size calculator", "table size estimator", "database capacity planning"],
  variants: [
    {
      id: "table-size",
      name: "Table Size Estimation",
      description: "Estimate the size of a database table",
      fields: [
        { name: "avgRowSize", label: "Average Row Size (bytes)", type: "number", placeholder: "e.g. 200", min: 1, defaultValue: 200 },
        { name: "rowCount", label: "Number of Rows", type: "number", placeholder: "e.g. 1000000", min: 1 },
        { name: "indexCount", label: "Number of Indexes", type: "number", placeholder: "e.g. 3", min: 0, defaultValue: 3 },
        { name: "avgIndexSize", label: "Avg Index Entry Size (bytes)", type: "number", placeholder: "e.g. 40", min: 1, defaultValue: 40 },
        { name: "overheadPercent", label: "Overhead (page fill, metadata %)", type: "number", placeholder: "e.g. 20", min: 0, max: 100, defaultValue: 20 },
      ],
      calculate: (inputs) => {
        const avgRowSize = (inputs.avgRowSize as number) || 200;
        const rowCount = inputs.rowCount as number;
        const indexCount = (inputs.indexCount as number) || 0;
        const avgIndexSize = (inputs.avgIndexSize as number) || 40;
        const overheadPercent = (inputs.overheadPercent as number) || 20;
        if (!rowCount) return null;

        const dataSize = avgRowSize * rowCount;
        const indexSize = indexCount * avgIndexSize * rowCount;
        const subtotal = dataSize + indexSize;
        const overhead = subtotal * (overheadPercent / 100);
        const totalSize = subtotal + overhead;

        const formatBytes = (b: number) => {
          if (b >= 1099511627776) return `${formatNumber(b / 1099511627776, 2)} TB`;
          if (b >= 1073741824) return `${formatNumber(b / 1073741824, 2)} GB`;
          if (b >= 1048576) return `${formatNumber(b / 1048576, 2)} MB`;
          if (b >= 1024) return `${formatNumber(b / 1024, 2)} KB`;
          return `${formatNumber(b, 0)} bytes`;
        };

        return {
          primary: { label: "Estimated Table Size", value: formatBytes(totalSize) },
          details: [
            { label: "Data Size", value: formatBytes(dataSize) },
            { label: "Index Size", value: formatBytes(indexSize) },
            { label: "Subtotal", value: formatBytes(subtotal) },
            { label: "Overhead", value: formatBytes(overhead) },
            { label: "Total Size", value: formatBytes(totalSize) },
            { label: "Rows", value: formatNumber(rowCount, 0) },
            { label: "Size per Row (with overhead)", value: `${formatNumber(totalSize / rowCount, 1)} bytes` },
          ],
        };
      },
    },
    {
      id: "growth-projection",
      name: "Growth Projection",
      description: "Project database size growth over time",
      fields: [
        { name: "currentSize", label: "Current DB Size (GB)", type: "number", placeholder: "e.g. 10", min: 0.001 },
        { name: "dailyNewRows", label: "New Rows per Day", type: "number", placeholder: "e.g. 50000", min: 1 },
        { name: "avgRowSize", label: "Avg Row Size (bytes)", type: "number", placeholder: "e.g. 500", min: 1, defaultValue: 500 },
        { name: "months", label: "Projection Period (months)", type: "number", placeholder: "e.g. 12", min: 1, defaultValue: 12 },
      ],
      calculate: (inputs) => {
        const currentSize = (inputs.currentSize as number) || 0;
        const dailyNewRows = inputs.dailyNewRows as number;
        const avgRowSize = (inputs.avgRowSize as number) || 500;
        const months = (inputs.months as number) || 12;
        if (!dailyNewRows) return null;

        const currentSizeBytes = currentSize * 1073741824;
        const dailyGrowthBytes = dailyNewRows * avgRowSize * 1.2; // 20% overhead
        const monthlyGrowthBytes = dailyGrowthBytes * 30;
        const projectedTotalBytes = currentSizeBytes + (dailyGrowthBytes * months * 30);

        const formatBytes = (b: number) => {
          if (b >= 1099511627776) return `${formatNumber(b / 1099511627776, 2)} TB`;
          if (b >= 1073741824) return `${formatNumber(b / 1073741824, 2)} GB`;
          if (b >= 1048576) return `${formatNumber(b / 1048576, 2)} MB`;
          return `${formatNumber(b / 1024, 2)} KB`;
        };

        return {
          primary: { label: `Projected Size (${months} mo)`, value: formatBytes(projectedTotalBytes) },
          details: [
            { label: "Current Size", value: `${formatNumber(currentSize, 2)} GB` },
            { label: "Daily Growth", value: formatBytes(dailyGrowthBytes) },
            { label: "Monthly Growth", value: formatBytes(monthlyGrowthBytes) },
            { label: "Yearly Growth", value: formatBytes(dailyGrowthBytes * 365) },
            { label: `Projected Size (${months} months)`, value: formatBytes(projectedTotalBytes) },
            { label: "New Rows/Day", value: formatNumber(dailyNewRows, 0) },
            { label: "New Rows/Month", value: formatNumber(dailyNewRows * 30, 0) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["data-storage-converter", "backup-size-calculator", "server-bandwidth-calculator"],
  faq: [
    { question: "How do I estimate row size?", answer: "Add up the storage for each column: INT = 4 bytes, BIGINT = 8, VARCHAR(n) = actual length + 1-2 bytes, TEXT = actual length + 2-4 bytes, DATETIME = 8 bytes, BOOLEAN = 1 byte. Then add 20-30% for row overhead (headers, null bitmaps, alignment)." },
    { question: "Why are indexes so important for size estimation?", answer: "Indexes can be 20-50% of total database size. Each index stores a copy of the indexed columns plus row pointers. A table with 5 indexes may have indexes larger than the data itself. B-tree indexes also have page fill factor overhead (typically 70-90% full)." },
  ],
  formula: "Total Size = (Row Size x Rows) + (Index Count x Index Size x Rows) + Overhead%",
};
