import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const cyclingFtpCalculator: CalculatorDefinition = {
  slug: "cycling-ftp-calculator",
  title: "Cycling FTP Calculator",
  description:
    "Free Cycling FTP (Functional Threshold Power) calculator. Estimate your FTP from different test protocols and calculate power-to-weight ratio and training zones.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: [
    "ftp calculator",
    "functional threshold power",
    "cycling ftp test",
    "power to weight ratio",
    "cycling training zones",
  ],
  variants: [
    {
      id: "twenty-min",
      name: "20-Minute FTP Test",
      description: "Estimate FTP from a 20-minute all-out effort",
      fields: [
        { name: "avgPower", label: "Average 20-Min Power (watts)", type: "number", placeholder: "e.g. 250", min: 1 },
        { name: "weight", label: "Body Weight (kg)", type: "number", placeholder: "e.g. 75", step: 0.1 },
      ],
      calculate: (inputs) => {
        const avgPower = inputs.avgPower as number;
        const weight = inputs.weight as number;
        if (!avgPower) return null;

        const ftp = avgPower * 0.95;
        const wPerKg = weight ? ftp / weight : 0;

        let level = "Untrained";
        if (wPerKg >= 6.0) level = "World Class (Pro Tour)";
        else if (wPerKg >= 5.0) level = "Exceptional (Cat 1/Pro)";
        else if (wPerKg >= 4.0) level = "Very Good (Cat 2-3)";
        else if (wPerKg >= 3.0) level = "Good (Cat 4-5)";
        else if (wPerKg >= 2.0) level = "Moderate (Recreational)";
        else if (wPerKg > 0) level = "Untrained";

        // Training zones (Coggan)
        const zones = [
          { name: "Z1 Active Recovery", low: ftp * 0.0, high: ftp * 0.55 },
          { name: "Z2 Endurance", low: ftp * 0.56, high: ftp * 0.75 },
          { name: "Z3 Tempo", low: ftp * 0.76, high: ftp * 0.90 },
          { name: "Z4 Threshold", low: ftp * 0.91, high: ftp * 1.05 },
          { name: "Z5 VO2max", low: ftp * 1.06, high: ftp * 1.20 },
          { name: "Z6 Anaerobic", low: ftp * 1.21, high: ftp * 1.50 },
        ];

        const details = [
          { label: "FTP", value: `${formatNumber(ftp, 0)} W` },
          { label: "W/kg", value: weight ? formatNumber(wPerKg, 2) : "Enter weight" },
          { label: "Level", value: level },
        ];

        zones.forEach(z => {
          details.push({ label: z.name, value: `${formatNumber(z.low, 0)}-${formatNumber(z.high, 0)} W` });
        });

        return {
          primary: { label: "Estimated FTP", value: formatNumber(ftp, 0), suffix: "watts" },
          details,
        };
      },
    },
    {
      id: "ramp",
      name: "Ramp Test",
      description: "Estimate FTP from a ramp test (last completed step)",
      fields: [
        { name: "lastStepPower", label: "Last Completed Step Power (watts)", type: "number", placeholder: "e.g. 310", min: 1 },
        { name: "weight", label: "Body Weight (kg)", type: "number", placeholder: "e.g. 75", step: 0.1 },
      ],
      calculate: (inputs) => {
        const lastStep = inputs.lastStepPower as number;
        const weight = inputs.weight as number;
        if (!lastStep) return null;

        const ftp = lastStep * 0.75;
        const wPerKg = weight ? ftp / weight : 0;

        let level = "Untrained";
        if (wPerKg >= 6.0) level = "World Class";
        else if (wPerKg >= 5.0) level = "Exceptional";
        else if (wPerKg >= 4.0) level = "Very Good";
        else if (wPerKg >= 3.0) level = "Good";
        else if (wPerKg >= 2.0) level = "Moderate";
        else if (wPerKg > 0) level = "Untrained";

        return {
          primary: { label: "Estimated FTP", value: formatNumber(ftp, 0), suffix: "watts" },
          details: [
            { label: "Last Ramp Step", value: `${formatNumber(lastStep, 0)} W` },
            { label: "FTP (75% of last step)", value: `${formatNumber(ftp, 0)} W` },
            { label: "W/kg", value: weight ? formatNumber(wPerKg, 2) : "Enter weight" },
            { label: "Level", value: level },
          ],
          note: "Ramp test estimates FTP as 75% of the last fully completed step. This method may slightly overestimate FTP for some riders.",
        };
      },
    },
    {
      id: "eight-min",
      name: "8-Minute Test",
      description: "Estimate FTP from two 8-minute efforts",
      fields: [
        { name: "effort1", label: "1st 8-Min Effort Avg Power (watts)", type: "number", placeholder: "e.g. 270", min: 1 },
        { name: "effort2", label: "2nd 8-Min Effort Avg Power (watts)", type: "number", placeholder: "e.g. 265", min: 1 },
        { name: "weight", label: "Body Weight (kg)", type: "number", placeholder: "e.g. 75", step: 0.1 },
      ],
      calculate: (inputs) => {
        const effort1 = inputs.effort1 as number;
        const effort2 = inputs.effort2 as number;
        const weight = inputs.weight as number;
        if (!effort1 || !effort2) return null;

        const avgPower = (effort1 + effort2) / 2;
        const ftp = avgPower * 0.90;
        const wPerKg = weight ? ftp / weight : 0;

        return {
          primary: { label: "Estimated FTP", value: formatNumber(ftp, 0), suffix: "watts" },
          details: [
            { label: "Effort 1 Avg", value: `${formatNumber(effort1, 0)} W` },
            { label: "Effort 2 Avg", value: `${formatNumber(effort2, 0)} W` },
            { label: "Average of Both", value: `${formatNumber(avgPower, 0)} W` },
            { label: "FTP (90% of avg)", value: `${formatNumber(ftp, 0)} W` },
            { label: "W/kg", value: weight ? formatNumber(wPerKg, 2) : "Enter weight" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["cycling-power-calculator", "cycling-calorie-calculator", "training-zone-calculator"],
  faq: [
    {
      question: "What is FTP in cycling?",
      answer:
        "FTP (Functional Threshold Power) is the highest average power you can sustain for approximately one hour. It represents the boundary between sustainable and unsustainable exercise intensity and is the foundation for power-based training zones.",
    },
    {
      question: "What is a good FTP?",
      answer:
        "FTP is best measured as watts per kilogram (W/kg). For males: 2.0 W/kg is recreational, 3.0 is good, 4.0 is very good (Cat 3), 5.0+ is exceptional (Cat 1/Pro). For females, subtract about 0.5-1.0 W/kg from each level.",
    },
    {
      question: "How often should I test my FTP?",
      answer:
        "Test every 4-8 weeks during structured training blocks. Avoid testing during recovery weeks or when fatigued. Consistency in test conditions (hydration, nutrition, rest, time of day) is essential for accurate comparisons.",
    },
  ],
  formula: "20-Min Test: FTP = 95% × 20-min avg power | Ramp Test: FTP = 75% × last completed step | 8-Min Test: FTP = 90% × avg of two 8-min efforts",
};
