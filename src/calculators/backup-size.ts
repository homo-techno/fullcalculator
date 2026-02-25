import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const backupSizeCalculator: CalculatorDefinition = {
  slug: "backup-size-calculator",
  title: "Backup Size Calculator",
  description: "Free backup size calculator. Estimate storage needed for full, incremental, and differential backups over time. Plan backup retention policies.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["backup size calculator", "backup storage estimator", "incremental backup size", "backup retention calculator", "data backup planning"],
  variants: [
    {
      id: "backup-storage",
      name: "Backup Storage Estimate",
      description: "Calculate total backup storage for a retention policy",
      fields: [
        { name: "dataSize", label: "Total Data Size (GB)", type: "number", placeholder: "e.g. 500", min: 0.1 },
        { name: "dailyChangePercent", label: "Daily Change Rate (%)", type: "number", placeholder: "e.g. 5", min: 0.1, max: 100, defaultValue: 5 },
        { name: "backupType", label: "Backup Strategy", type: "select", options: [
          { label: "Full Daily", value: "full" },
          { label: "Weekly Full + Daily Incremental", value: "incremental" },
          { label: "Weekly Full + Daily Differential", value: "differential" },
        ], defaultValue: "incremental" },
        { name: "retentionDays", label: "Retention Period (days)", type: "number", placeholder: "e.g. 30", min: 1, defaultValue: 30 },
        { name: "compressionRatio", label: "Compression", type: "select", options: [
          { label: "None (1:1)", value: "1" },
          { label: "Low (2:1)", value: "0.5" },
          { label: "Medium (3:1)", value: "0.333" },
          { label: "High (5:1)", value: "0.2" },
        ], defaultValue: "0.5" },
      ],
      calculate: (inputs) => {
        const dataSize = inputs.dataSize as number;
        const dailyChangePercent = (inputs.dailyChangePercent as number) || 5;
        const backupType = inputs.backupType as string;
        const retentionDays = (inputs.retentionDays as number) || 30;
        const compression = parseFloat(inputs.compressionRatio as string) || 0.5;
        if (!dataSize) return null;

        const fullBackupSize = dataSize * compression;
        const dailyChangeSize = dataSize * (dailyChangePercent / 100) * compression;
        let totalStorage = 0;
        let description = "";

        const weeks = Math.ceil(retentionDays / 7);

        if (backupType === "full") {
          totalStorage = fullBackupSize * retentionDays;
          description = "One full backup every day";
        } else if (backupType === "incremental") {
          // Weekly full + 6 daily incrementals per week
          const fullBackups = weeks;
          const incrementalBackups = retentionDays - weeks;
          totalStorage = (fullBackups * fullBackupSize) + (incrementalBackups * dailyChangeSize);
          description = "Weekly full + daily incremental (each day's changes only)";
        } else {
          // Weekly full + daily differential (grows each day)
          const fullBackups = weeks;
          let diffTotal = 0;
          for (let w = 0; w < weeks; w++) {
            const daysInWeek = Math.min(6, retentionDays - (w * 7) - 1);
            for (let d = 1; d <= daysInWeek; d++) {
              diffTotal += dailyChangeSize * d;
            }
          }
          totalStorage = (fullBackups * fullBackupSize) + diffTotal;
          description = "Weekly full + daily differential (cumulative changes since last full)";
        }

        const formatSize = (gb: number) => {
          if (gb >= 1024) return `${formatNumber(gb / 1024, 2)} TB`;
          return `${formatNumber(gb, 1)} GB`;
        };

        return {
          primary: { label: "Total Backup Storage", value: formatSize(totalStorage) },
          details: [
            { label: "Strategy", value: description },
            { label: "Data Size", value: formatSize(dataSize) },
            { label: "Full Backup (compressed)", value: formatSize(fullBackupSize) },
            { label: "Daily Change (compressed)", value: formatSize(dailyChangeSize) },
            { label: "Retention Period", value: `${retentionDays} days` },
            { label: "Total Storage Required", value: formatSize(totalStorage) },
            { label: "Storage vs Data Ratio", value: `${formatNumber(totalStorage / dataSize, 1)}x` },
            { label: "Monthly Cost (at $0.023/GB)", value: `$${formatNumber(totalStorage * 0.023, 2)}` },
          ],
        };
      },
    },
    {
      id: "backup-time",
      name: "Backup Time Estimate",
      description: "Estimate how long a backup will take",
      fields: [
        { name: "dataSize", label: "Data to Backup (GB)", type: "number", placeholder: "e.g. 500", min: 0.1 },
        { name: "transferSpeed", label: "Transfer Speed", type: "select", options: [
          { label: "USB 2.0 (30 MB/s)", value: "30" },
          { label: "USB 3.0 (300 MB/s)", value: "300" },
          { label: "1 Gbps Network (100 MB/s)", value: "100" },
          { label: "10 Gbps Network (1 GB/s)", value: "1000" },
          { label: "Cloud Upload (10 MB/s)", value: "10" },
          { label: "Cloud Upload (50 MB/s)", value: "50" },
        ], defaultValue: "100" },
      ],
      calculate: (inputs) => {
        const dataSize = inputs.dataSize as number;
        const transferSpeed = parseFloat(inputs.transferSpeed as string) || 100;
        if (!dataSize) return null;

        const dataMB = dataSize * 1024;
        const timeSeconds = dataMB / transferSpeed;
        const timeMinutes = timeSeconds / 60;
        const timeHours = timeMinutes / 60;

        const formatTime = (sec: number) => {
          if (sec >= 86400) return `${formatNumber(sec / 86400, 1)} days`;
          if (sec >= 3600) return `${formatNumber(sec / 3600, 1)} hours`;
          if (sec >= 60) return `${formatNumber(sec / 60, 1)} minutes`;
          return `${formatNumber(sec, 0)} seconds`;
        };

        return {
          primary: { label: "Backup Time", value: formatTime(timeSeconds) },
          details: [
            { label: "Data Size", value: `${formatNumber(dataSize, 1)} GB` },
            { label: "Transfer Speed", value: `${formatNumber(transferSpeed, 0)} MB/s` },
            { label: "Estimated Time", value: formatTime(timeSeconds) },
            { label: "Time (minutes)", value: formatNumber(timeMinutes, 1) },
            { label: "Time (hours)", value: formatNumber(timeHours, 2) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["database-size-estimator", "data-storage-converter", "raid-storage-calculator"],
  faq: [
    { question: "What is the difference between incremental and differential backups?", answer: "Incremental backups store only changes since the last backup (any type), making them small and fast. Differential backups store all changes since the last full backup, growing larger each day but requiring only the last full + last differential to restore. Incremental needs full + all incrementals to restore." },
    { question: "How often should I do full backups?", answer: "Weekly full backups with daily incrementals is the most common strategy. For critical databases, consider daily fulls. The decision depends on backup window (how long the full backup takes), storage cost, and restore time requirements (RTO). More frequent full backups = faster restore but more storage." },
  ],
  formula: "Incremental Storage = (Weeks x Full Size) + (Days x Daily Change) | Backup Time = Data Size / Transfer Speed",
};
