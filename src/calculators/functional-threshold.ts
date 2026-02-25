import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const functionalThresholdCalculator: CalculatorDefinition = {
  slug: "functional-threshold-calculator",
  title: "Functional Threshold Power Calculator",
  description: "Free FTP calculator for cycling. Estimate your Functional Threshold Power from a 20-minute test and calculate power-based training zones.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["ftp calculator", "functional threshold power", "cycling power zones", "ftp test", "cycling training zones", "watts per kg"],
  variants: [
    {
      id: "ftp-20min",
      name: "FTP from 20-Min Test",
      description: "Estimate FTP from a 20-minute all-out effort",
      fields: [
        { name: "avgPower", label: "Avg Power (20-min test)", type: "number", placeholder: "e.g. 260", suffix: "watts" },
        { name: "weight", label: "Body Weight", type: "number", placeholder: "e.g. 75" },
        { name: "unit", label: "Weight Unit", type: "select", options: [
          { label: "kg", value: "kg" }, { label: "lbs", value: "lbs" },
        ], defaultValue: "kg" },
      ],
      calculate: (inputs) => {
        const avgPower = inputs.avgPower as number;
        const weight = inputs.weight as number;
        const unit = inputs.unit as string;
        if (!avgPower) return null;
        const ftp = avgPower * 0.95;
        const weightKg = weight ? (unit === "lbs" ? weight * 0.4536 : weight) : null;
        const wpk = weightKg ? ftp / weightKg : null;
        let level = "";
        if (wpk !== null) {
          if (wpk < 2.0) level = "Untrained";
          else if (wpk < 2.5) level = "Recreational";
          else if (wpk < 3.0) level = "Intermediate";
          else if (wpk < 3.5) level = "Competitive";
          else if (wpk < 4.0) level = "Advanced";
          else if (wpk < 4.5) level = "Very Competitive";
          else if (wpk < 5.0) level = "Regional Elite";
          else if (wpk < 5.5) level = "National Level";
          else level = "Professional / World-class";
        }
        const z1 = [0, ftp * 0.55];
        const z2 = [ftp * 0.55, ftp * 0.75];
        const z3 = [ftp * 0.75, ftp * 0.90];
        const z4 = [ftp * 0.90, ftp * 1.05];
        const z5 = [ftp * 1.05, ftp * 1.20];
        const z6 = [ftp * 1.20, ftp * 1.50];
        const z7 = [ftp * 1.50, ftp * 2.00];
        const details: { label: string; value: string }[] = [
          { label: "20-Min Avg Power", value: `${formatNumber(avgPower, 0)} W` },
        ];
        if (wpk !== null) {
          details.push(
            { label: "Watts/kg", value: `${formatNumber(wpk, 2)} W/kg` },
            { label: "Level", value: level },
          );
        }
        details.push(
          { label: "Z1 Active Recovery", value: `< ${formatNumber(z1[1], 0)} W` },
          { label: "Z2 Endurance", value: `${formatNumber(z2[0], 0)}-${formatNumber(z2[1], 0)} W` },
          { label: "Z3 Tempo", value: `${formatNumber(z3[0], 0)}-${formatNumber(z3[1], 0)} W` },
          { label: "Z4 Threshold", value: `${formatNumber(z4[0], 0)}-${formatNumber(z4[1], 0)} W` },
          { label: "Z5 VO2 Max", value: `${formatNumber(z5[0], 0)}-${formatNumber(z5[1], 0)} W` },
          { label: "Z6 Anaerobic", value: `${formatNumber(z6[0], 0)}-${formatNumber(z6[1], 0)} W` },
          { label: "Z7 Neuromuscular", value: `> ${formatNumber(z7[0], 0)} W` },
        );
        return {
          primary: { label: "FTP", value: `${formatNumber(ftp, 0)} watts` },
          details,
          note: "FTP is 95% of your 20-minute average power. Warm up thoroughly and go all-out for 20 minutes on a flat course or trainer.",
        };
      },
    },
    {
      id: "ftp-ramp",
      name: "FTP from Ramp Test",
      description: "Estimate FTP from a ramp (step) test result",
      fields: [
        { name: "maxMinutePower", label: "Best 1-Min Power (last step)", type: "number", placeholder: "e.g. 350", suffix: "watts" },
        { name: "weight", label: "Body Weight (optional)", type: "number", placeholder: "e.g. 75" },
        { name: "unit", label: "Weight Unit", type: "select", options: [
          { label: "kg", value: "kg" }, { label: "lbs", value: "lbs" },
        ], defaultValue: "kg" },
      ],
      calculate: (inputs) => {
        const maxPower = inputs.maxMinutePower as number;
        const weight = inputs.weight as number;
        const unit = inputs.unit as string;
        if (!maxPower) return null;
        const ftp = maxPower * 0.75;
        const weightKg = weight ? (unit === "lbs" ? weight * 0.4536 : weight) : null;
        const details: { label: string; value: string }[] = [
          { label: "Max 1-Min Power", value: `${formatNumber(maxPower, 0)} W` },
          { label: "FTP (75% of MAP)", value: `${formatNumber(ftp, 0)} W` },
        ];
        if (weightKg) {
          details.push({ label: "Watts/kg", value: `${formatNumber(ftp / weightKg, 2)} W/kg` });
        }
        return {
          primary: { label: "FTP (Ramp)", value: `${formatNumber(ftp, 0)} watts` },
          details,
          note: "Ramp test FTP = 75% of the highest 1-minute power achieved. This method is less fatiguing than a 20-minute test but may be slightly less accurate.",
        };
      },
    },
  ],
  relatedSlugs: ["vo2-max-calculator", "lactate-threshold-calculator", "calorie-calculator"],
  faq: [
    { question: "What is FTP?", answer: "Functional Threshold Power (FTP) is the highest average power you can sustain for approximately one hour. It represents your lactate threshold in terms of power output and is the cornerstone of power-based cycling training." },
    { question: "What is a good FTP?", answer: "FTP is best measured in watts per kg (W/kg). Recreational: 2.0-2.5 W/kg. Competitive amateur: 3.0-3.5 W/kg. Cat 1/2 racer: 4.0-4.5 W/kg. Pro cyclist: 5.0-6.0+ W/kg. These values vary by gender and age." },
  ],
  formula: "FTP = 20-min avg power x 0.95 | Ramp test FTP = Max 1-min power x 0.75 | Zones based on % of FTP",
};
