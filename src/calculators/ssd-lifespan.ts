import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const ssdLifespanCalculator: CalculatorDefinition = {
  slug: "ssd-lifespan-calculator",
  title: "SSD Lifespan Calculator (TBW)",
  description: "Free SSD lifespan calculator. Estimate how long your SSD will last based on TBW rating, daily write workload, and DWPD specifications.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["ssd lifespan calculator", "tbw calculator", "ssd endurance", "dwpd calculator", "ssd wear calculator"],
  variants: [
    {
      id: "tbw-lifespan",
      name: "TBW Lifespan Estimate",
      description: "Estimate SSD lifespan from TBW rating and daily writes",
      fields: [
        { name: "tbw", label: "TBW Rating (Terabytes Written)", type: "number", placeholder: "e.g. 600", min: 1 },
        { name: "dailyWriteGB", label: "Daily Write Workload (GB)", type: "number", placeholder: "e.g. 50", min: 0.1, defaultValue: 50 },
        { name: "writeAmplification", label: "Write Amplification Factor", type: "select", options: [
          { label: "Low (1.1x - Sequential)", value: "1.1" },
          { label: "Medium (1.5x - Mixed)", value: "1.5" },
          { label: "High (2.0x - Random)", value: "2.0" },
          { label: "Very High (3.0x - Heavy Random)", value: "3.0" },
        ], defaultValue: "1.5" },
      ],
      calculate: (inputs) => {
        const tbw = inputs.tbw as number;
        const dailyWriteGB = inputs.dailyWriteGB as number;
        const waf = parseFloat(inputs.writeAmplification as string) || 1.5;
        if (!tbw || !dailyWriteGB) return null;

        const tbwBytes = tbw * 1099511627776;
        const actualDailyWriteGB = dailyWriteGB * waf;
        const actualDailyWriteTB = actualDailyWriteGB / 1024;
        const daysRemaining = (tbw * 1024) / actualDailyWriteGB;
        const yearsRemaining = daysRemaining / 365;
        const monthsRemaining = daysRemaining / 30;

        const yearlyWriteTB = actualDailyWriteGB * 365 / 1024;
        const enduranceUsedPerYear = (yearlyWriteTB / tbw) * 100;

        return {
          primary: { label: "Estimated Lifespan", value: `${formatNumber(yearsRemaining, 1)} years` },
          details: [
            { label: "TBW Rating", value: `${formatNumber(tbw, 0)} TB` },
            { label: "Daily Writes (host)", value: `${formatNumber(dailyWriteGB, 1)} GB` },
            { label: "Write Amplification", value: `${waf}x` },
            { label: "Actual Daily Writes", value: `${formatNumber(actualDailyWriteGB, 1)} GB` },
            { label: "Yearly Writes", value: `${formatNumber(yearlyWriteTB, 2)} TB` },
            { label: "Endurance Used/Year", value: `${formatNumber(enduranceUsedPerYear, 1)}%` },
            { label: "Estimated Days", value: formatNumber(daysRemaining, 0) },
            { label: "Estimated Months", value: formatNumber(monthsRemaining, 0) },
            { label: "Estimated Years", value: formatNumber(yearsRemaining, 1) },
          ],
        };
      },
    },
    {
      id: "dwpd-to-tbw",
      name: "DWPD to TBW Conversion",
      description: "Convert DWPD (Drive Writes Per Day) to TBW",
      fields: [
        { name: "capacity", label: "SSD Capacity (GB)", type: "number", placeholder: "e.g. 1000", min: 1 },
        { name: "dwpd", label: "DWPD Rating", type: "number", placeholder: "e.g. 1", min: 0.01, step: 0.1, defaultValue: 1 },
        { name: "warrantyYears", label: "Warranty Period (years)", type: "number", placeholder: "e.g. 5", min: 1, defaultValue: 5 },
      ],
      calculate: (inputs) => {
        const capacity = inputs.capacity as number;
        const dwpd = inputs.dwpd as number;
        const warrantyYears = inputs.warrantyYears as number;
        if (!capacity || !dwpd || !warrantyYears) return null;

        const dailyWriteGB = capacity * dwpd;
        const tbw = (dailyWriteGB * warrantyYears * 365) / 1024;
        const yearlyWriteTB = (dailyWriteGB * 365) / 1024;

        return {
          primary: { label: "TBW Rating", value: `${formatNumber(tbw, 0)} TB` },
          details: [
            { label: "SSD Capacity", value: `${formatNumber(capacity, 0)} GB` },
            { label: "DWPD", value: `${dwpd}` },
            { label: "Warranty Period", value: `${warrantyYears} years` },
            { label: "Daily Write Allowance", value: `${formatNumber(dailyWriteGB, 0)} GB/day` },
            { label: "Yearly Writes", value: `${formatNumber(yearlyWriteTB, 1)} TB/year` },
            { label: "Calculated TBW", value: `${formatNumber(tbw, 0)} TB` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["data-storage-converter", "backup-size-calculator", "raid-storage-calculator"],
  faq: [
    { question: "What is TBW?", answer: "TBW (Terabytes Written) is the total amount of data that can be written to an SSD before it is expected to reach end of life. A 600 TBW drive can sustain 600 terabytes of writes. Consumer SSDs typically have 150-600 TBW; enterprise drives can exceed 10,000 TBW." },
    { question: "What is write amplification?", answer: "Write amplification is the ratio of actual NAND writes to host writes. Due to garbage collection, wear leveling, and data management, the SSD internally writes more data than the host requests. A WAF of 1.5 means the SSD writes 1.5x the host data. Sequential workloads have lower WAF than random." },
  ],
  formula: "Lifespan (days) = (TBW x 1024) / (Daily Writes GB x WAF) | TBW = Capacity x DWPD x 365 x Years / 1024",
};
