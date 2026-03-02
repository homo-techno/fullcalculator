import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const backupStorageCalculator: CalculatorDefinition = {
  slug: "backup-storage-calculator",
  title: "Backup Storage Calculator",
  description: "Estimate storage needed for backup retention policies.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["backup storage","backup size calculator"],
  variants: [{
    id: "standard",
    name: "Backup Storage",
    description: "Estimate storage needed for backup retention policies.",
    fields: [
      { name: "dataSize", label: "Data Size (GB)", type: "number", min: 1, max: 1000000, defaultValue: 500 },
      { name: "dailyChange", label: "Daily Change Rate (%)", type: "number", min: 0.1, max: 100, defaultValue: 5 },
      { name: "retentionDays", label: "Retention Period (days)", type: "number", min: 1, max: 365, defaultValue: 30 },
    ],
    calculate: (inputs) => {
      const data = inputs.dataSize as number;
      const change = inputs.dailyChange as number;
      const days = inputs.retentionDays as number;
      if (!data || !change || !days) return null;
      const fullBackup = data;
      const incrementalSize = data * (change / 100);
      const totalIncremental = incrementalSize * (days - 1);
      const totalStorage = Math.round((fullBackup + totalIncremental) * 100) / 100;
      const totalTB = Math.round(totalStorage / 1024 * 100) / 100;
      return {
        primary: { label: "Total Backup Storage", value: totalStorage > 1024 ? formatNumber(totalTB) + " TB" : formatNumber(Math.round(totalStorage)) + " GB" },
        details: [
          { label: "Full Backup Size", value: formatNumber(fullBackup) + " GB" },
          { label: "Daily Incremental", value: formatNumber(Math.round(incrementalSize * 100) / 100) + " GB" },
          { label: "Retention Period", value: String(days) + " days" },
        ],
      };
  },
  }],
  relatedSlugs: [],
  faq: [
    { question: "What is an incremental backup?", answer: "An incremental backup only saves data that changed since the last backup." },
    { question: "How long should I retain backups?", answer: "Retain daily backups for 30 days and monthly backups for one year." },
  ],
  formula: "Total = Full Backup + (Daily Change x (Retention Days - 1))",
};
