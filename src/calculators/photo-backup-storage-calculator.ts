import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const photoBackupStorageCalculator: CalculatorDefinition = {
  slug: "photo-backup-storage-calculator",
  title: "Photo Backup Storage Calculator",
  description: "Calculate total backup storage needs and costs for photographers based on shooting volume, file types, and backup strategy.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["photo backup storage","photographer storage","photo archive calculator","backup drive size"],
  variants: [{
    id: "standard",
    name: "Photo Backup Storage",
    description: "Calculate total backup storage needs and costs for photographers based on shooting volume, file types, and backup strategy.",
    fields: [
      { name: "shootsPerMonth", label: "Shoots Per Month", type: "number", min: 1, max: 60, defaultValue: 8 },
      { name: "photosPerShoot", label: "Photos Per Shoot", type: "number", min: 10, max: 5000, defaultValue: 500 },
      { name: "avgFileSizeMB", label: "Avg RAW File Size (MB)", type: "number", min: 5, max: 150, defaultValue: 30 },
      { name: "keepRate", label: "Keep Rate (%)", type: "number", min: 5, max: 100, defaultValue: 30 },
      { name: "backupCopies", label: "Number of Backup Copies", type: "select", options: [{ value: "1", label: "1 copy (no redundancy)" }, { value: "2", label: "2 copies (3-2-1 basic)" }, { value: "3", label: "3 copies (3-2-1 full)" }], defaultValue: "2" },
    ],
    calculate: (inputs) => {
    const shoots = inputs.shootsPerMonth as number;
    const photosPerShoot = inputs.photosPerShoot as number;
    const fileSize = inputs.avgFileSizeMB as number;
    const keepRate = inputs.keepRate as number;
    const copies = parseInt(inputs.backupCopies as string);
    const monthlyPhotos = shoots * photosPerShoot;
    const keptPhotos = Math.round(monthlyPhotos * keepRate / 100);
    const monthlyGB = Math.round(keptPhotos * fileSize / 1024 * 10) / 10;
    const yearlyGB = Math.round(monthlyGB * 12 * 10) / 10;
    const yearlyTB = Math.round(yearlyGB / 1024 * 100) / 100;
    const totalWithBackups = Math.round(yearlyGB * copies * 10) / 10;
    const totalTB = Math.round(totalWithBackups / 1024 * 100) / 100;
    const costEstimate = Math.round(totalTB * 25 * 100) / 100;
    return {
      primary: { label: "Annual Storage Needed", value: yearlyTB >= 1 ? formatNumber(yearlyTB) + " TB" : formatNumber(yearlyGB) + " GB" },
      details: [
        { label: "Monthly New Data", value: formatNumber(monthlyGB) + " GB" },
        { label: "Photos Kept Per Month", value: formatNumber(keptPhotos) },
        { label: "Total With Backups", value: totalTB >= 1 ? formatNumber(totalTB) + " TB" : formatNumber(totalWithBackups) + " GB" },
        { label: "Est. HDD Cost/Year", value: "$" + formatNumber(costEstimate) + " (at ~$25/TB)" }
      ]
    };
  },
  }],
  relatedSlugs: ["video-storage-estimator","photo-print-cost-calculator"],
  faq: [
    { question: "What is the 3-2-1 backup rule?", answer: "Keep 3 copies of your data on 2 different types of media with 1 copy stored offsite. This protects against hardware failure, theft, and natural disasters." },
    { question: "How much storage does a professional photographer need?", answer: "A busy wedding or event photographer may generate 2-5 TB per year. Commercial and studio photographers often need less, around 500 GB to 2 TB." },
    { question: "Should I keep all RAW files?", answer: "Many professionals keep all RAW files from delivered shoots permanently. Storage is cheaper than reshooting. Budget for long-term archival storage." },
  ],
  formula: "Monthly Data = Shoots x Photos x Keep Rate x File Size
Annual Storage = Monthly Data x 12
Total = Annual Storage x Number of Backup Copies",
};
