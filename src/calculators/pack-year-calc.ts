import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const packYearCalculator: CalculatorDefinition = {
  slug: "pack-year-calc",
  title: "Smoking Pack-Year Calculator",
  description:
    "Free online smoking pack-year calculator to quantify lifetime tobacco exposure.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: [
    "pack year",
    "smoking",
    "tobacco",
    "cigarettes",
    "lung cancer screening",
    "smoking history",
    "pack years",
  ],
  variants: [
    {
      id: "pack-years",
      name: "Calculate Pack-Years",
      description:
        "Calculate total pack-years of smoking to quantify tobacco exposure.",
      fields: [
        {
          name: "cigarettesPerDay",
          label: "Cigarettes per Day",
          type: "number",
          placeholder: "e.g. 20",
        },
        {
          name: "yearsSmoked",
          label: "Years Smoked",
          type: "number",
          placeholder: "e.g. 15",
          suffix: "years",
        },
      ],
      calculate: (inputs) => {
        const cigs = parseFloat(inputs.cigarettesPerDay as string) || 0;
        const years = parseFloat(inputs.yearsSmoked as string) || 0;

        if (cigs <= 0 || years <= 0) return null;

        const packsPerDay = cigs / 20; // 20 cigarettes per pack
        const packYears = packsPerDay * years;
        const totalCigarettes = cigs * years * 365;

        let riskCategory: string;
        if (packYears < 10) riskCategory = "Low exposure";
        else if (packYears < 20) riskCategory = "Moderate exposure";
        else if (packYears < 30) riskCategory = "High exposure";
        else riskCategory = "Very high exposure";

        const ldctEligible = packYears >= 20 ? "Yes (>= 20 pack-years)" : "No (< 20 pack-years)";

        return {
          primary: {
            label: "Pack-Years",
            value: formatNumber(packYears),
          },
          details: [
            { label: "Packs per Day", value: formatNumber(packsPerDay) },
            {
              label: "Total Cigarettes Smoked",
              value: formatNumber(totalCigarettes),
            },
            { label: "Exposure Category", value: riskCategory },
            {
              label: "LDCT Screening Eligible",
              value: ldctEligible,
            },
            { label: "Years Smoked", value: formatNumber(years) },
          ],
          note: "Pack-years >= 20 with age 50-80 may qualify for annual low-dose CT lung cancer screening per USPSTF guidelines.",
        };
      },
    },
    {
      id: "multiple-periods",
      name: "Multiple Smoking Periods",
      description:
        "Calculate pack-years across different smoking periods with varying intensity.",
      fields: [
        {
          name: "cigs1",
          label: "Period 1: Cigarettes/Day",
          type: "number",
          placeholder: "e.g. 10",
        },
        {
          name: "years1",
          label: "Period 1: Years",
          type: "number",
          placeholder: "e.g. 5",
        },
        {
          name: "cigs2",
          label: "Period 2: Cigarettes/Day",
          type: "number",
          placeholder: "e.g. 20",
        },
        {
          name: "years2",
          label: "Period 2: Years",
          type: "number",
          placeholder: "e.g. 10",
        },
        {
          name: "cigs3",
          label: "Period 3: Cigarettes/Day (0 if none)",
          type: "number",
          placeholder: "e.g. 0",
        },
        {
          name: "years3",
          label: "Period 3: Years (0 if none)",
          type: "number",
          placeholder: "e.g. 0",
        },
      ],
      calculate: (inputs) => {
        const c1 = parseFloat(inputs.cigs1 as string) || 0;
        const y1 = parseFloat(inputs.years1 as string) || 0;
        const c2 = parseFloat(inputs.cigs2 as string) || 0;
        const y2 = parseFloat(inputs.years2 as string) || 0;
        const c3 = parseFloat(inputs.cigs3 as string) || 0;
        const y3 = parseFloat(inputs.years3 as string) || 0;

        const py1 = (c1 / 20) * y1;
        const py2 = (c2 / 20) * y2;
        const py3 = (c3 / 20) * y3;
        const totalPackYears = py1 + py2 + py3;
        const totalYears = y1 + y2 + y3;

        if (totalPackYears <= 0) return null;

        const avgCigsPerDay = totalYears > 0
          ? (c1 * y1 + c2 * y2 + c3 * y3) / totalYears
          : 0;

        return {
          primary: {
            label: "Total Pack-Years",
            value: formatNumber(totalPackYears),
          },
          details: [
            { label: "Period 1 Pack-Years", value: formatNumber(py1) },
            { label: "Period 2 Pack-Years", value: formatNumber(py2) },
            { label: "Period 3 Pack-Years", value: formatNumber(py3) },
            { label: "Total Years Smoked", value: formatNumber(totalYears) },
            {
              label: "Average Cigarettes/Day",
              value: formatNumber(avgCigsPerDay),
            },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["smoking-recovery", "life-expectancy-calc", "ascvd-risk"],
  faq: [
    {
      question: "What is a pack-year?",
      answer:
        "A pack-year is a unit that quantifies lifetime tobacco exposure. One pack-year equals smoking one pack (20 cigarettes) per day for one year. For example, smoking 2 packs/day for 10 years = 20 pack-years.",
    },
    {
      question: "Why are pack-years important?",
      answer:
        "Pack-years are used clinically to assess cumulative smoking exposure, guide lung cancer screening eligibility (USPSTF recommends annual LDCT for adults aged 50-80 with >= 20 pack-year history), and estimate disease risk for COPD, cardiovascular disease, and various cancers.",
    },
    {
      question: "Does quitting smoking reduce my pack-year count?",
      answer:
        "No, your pack-year count is a historical measure that does not decrease after quitting. However, quitting smoking significantly reduces future health risks. After 10-15 years of cessation, the lung cancer risk drops substantially, though it never returns to that of a never-smoker.",
    },
  ],
  formula:
    "Pack-Years = (Cigarettes_per_day / 20) × Years_smoked. For multiple periods: Total = Σ(cigarettes_i / 20 × years_i).",
};
