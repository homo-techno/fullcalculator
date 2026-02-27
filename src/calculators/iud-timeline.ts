import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const iudTimelineCalculator: CalculatorDefinition = {
  slug: "iud-timeline-calculator",
  title: "IUD Timeline Calculator",
  description:
    "Calculate IUD insertion, replacement, and expiration dates. Track your IUD lifespan for hormonal (Mirena, Kyleena, Liletta, Skyla) and copper (Paragard) IUDs.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: [
    "iud timeline calculator",
    "iud expiration date",
    "iud replacement date",
    "mirena timeline",
    "paragard timeline",
    "iud lifespan",
    "when to replace iud",
  ],
  variants: [
    {
      id: "timeline",
      name: "IUD Replacement Timeline",
      description: "Calculate when your IUD needs replacement",
      fields: [
        {
          name: "iudType",
          label: "IUD Type",
          type: "select",
          options: [
            { label: "Mirena (levonorgestrel 52mg)", value: "mirena" },
            { label: "Kyleena (levonorgestrel 19.5mg)", value: "kyleena" },
            { label: "Liletta (levonorgestrel 52mg)", value: "liletta" },
            { label: "Skyla (levonorgestrel 13.5mg)", value: "skyla" },
            { label: "Paragard (copper)", value: "paragard" },
          ],
          defaultValue: "mirena",
        },
        {
          name: "monthsSinceInsertion",
          label: "Months Since Insertion",
          type: "number",
          placeholder: "e.g. 24",
          suffix: "months",
          min: 0,
          max: 150,
        },
      ],
      calculate: (inputs) => {
        const iudType = inputs.iudType as string;
        const monthsSince = parseFloat(inputs.monthsSinceInsertion as string);
        if (isNaN(monthsSince)) return null;

        // FDA-approved durations (years)
        const durations: Record<string, number> = {
          mirena: 8, kyleena: 5, liletta: 8, skyla: 3, paragard: 10,
        };
        const hormoneType: Record<string, string> = {
          mirena: "Levonorgestrel 52mg",
          kyleena: "Levonorgestrel 19.5mg",
          liletta: "Levonorgestrel 52mg",
          skyla: "Levonorgestrel 13.5mg",
          paragard: "Copper (non-hormonal)",
        };

        const durationYears = durations[iudType] || 5;
        const durationMonths = durationYears * 12;
        const monthsRemaining = Math.max(0, durationMonths - monthsSince);
        const yearsRemaining = monthsRemaining / 12;
        const percentUsed = Math.min(100, (monthsSince / durationMonths) * 100);

        // Schedule replacement 1-2 months before expiration
        const replacementMonth = Math.max(0, monthsRemaining - 1);

        let status: string;
        if (monthsSince >= durationMonths) {
          status = "Expired -- schedule replacement now";
        } else if (monthsRemaining <= 3) {
          status = "Expiring soon -- schedule replacement";
        } else if (monthsRemaining <= 12) {
          status = "Less than 1 year remaining";
        } else {
          status = "Active and effective";
        }

        return {
          primary: { label: "Time Remaining", value: yearsRemaining >= 1 ? `${formatNumber(yearsRemaining, 1)} years` : `${formatNumber(monthsRemaining, 0)} months` },
          details: [
            { label: "Status", value: status },
            { label: "IUD Type", value: hormoneType[iudType] || iudType },
            { label: "Approved Duration", value: `${formatNumber(durationYears, 0)} years` },
            { label: "Time Since Insertion", value: `${formatNumber(monthsSince, 0)} months (${formatNumber(monthsSince / 12, 1)} yr)` },
            { label: "Lifespan Used", value: `${formatNumber(percentUsed, 1)}%` },
            { label: "Schedule Replacement In", value: monthsRemaining > 1 ? `${formatNumber(replacementMonth, 0)} months` : "Now" },
          ],
          note: "Duration reflects current FDA-approved guidelines, which have been extended for some IUDs. Some studies suggest effectiveness may last beyond the approved period. Discuss with your provider about off-label extended use. IUDs can be removed at any time.",
        };
      },
    },
    {
      id: "comparison",
      name: "IUD Comparison",
      description: "Compare different IUD types side-by-side",
      fields: [
        {
          name: "priority",
          label: "What Matters Most",
          type: "select",
          options: [
            { label: "Longest duration", value: "duration" },
            { label: "Lightest periods", value: "periods" },
            { label: "Smallest size (nulliparous)", value: "size" },
            { label: "Non-hormonal option", value: "nonhormonal" },
            { label: "Lowest cost over time", value: "cost" },
          ],
          defaultValue: "duration",
        },
      ],
      calculate: (inputs) => {
        const priority = inputs.priority as string;

        const recommendations: Record<string, { best: string; reason: string }> = {
          duration: { best: "Paragard (10 years)", reason: "Longest FDA-approved duration. Mirena/Liletta last 8 years." },
          periods: { best: "Mirena or Liletta", reason: "Highest levonorgestrel dose; ~20% of users stop periods entirely by year 1." },
          size: { best: "Kyleena or Skyla", reason: "Smaller T-frame designed for nulliparous uterus. Skyla is the smallest." },
          nonhormonal: { best: "Paragard (copper)", reason: "Only non-hormonal IUD. No effect on ovulation or hormones." },
          cost: { best: "Liletta", reason: "Lowest list price (~$50-$75 vs $800-$1000 for others). 8-year duration." },
        };

        const rec = recommendations[priority] || recommendations.duration;

        return {
          primary: { label: "Best Match", value: rec.best },
          details: [
            { label: "Why", value: rec.reason },
            { label: "Mirena", value: "8 yr, hormonal, lighter periods" },
            { label: "Kyleena", value: "5 yr, hormonal, small size" },
            { label: "Liletta", value: "8 yr, hormonal, lowest cost" },
            { label: "Skyla", value: "3 yr, hormonal, smallest size" },
            { label: "Paragard", value: "10 yr, copper, non-hormonal" },
          ],
          note: "All IUDs are >99% effective at preventing pregnancy. Side effects and suitability vary. Hormonal IUDs may reduce period flow; Paragard may increase flow initially. Discuss options with your healthcare provider.",
        };
      },
    },
  ],
  relatedSlugs: ["menstrual-cycle-length-calculator", "ovulation-calculator", "prenatal-vitamin-calculator"],
  faq: [
    {
      question: "How long does each type of IUD last?",
      answer:
        "Paragard (copper) is approved for 10 years. Mirena and Liletta are approved for 8 years. Kyleena is approved for 5 years. Skyla is approved for 3 years. Some research suggests effectiveness may extend beyond these approved periods, and guidelines continue to evolve.",
    },
    {
      question: "When should I schedule IUD replacement?",
      answer:
        "Schedule replacement 1-2 months before the expiration date to ensure continuous contraception. If you want to switch types or discontinue, the old IUD can be removed and new one inserted in the same visit. Fertility returns quickly after IUD removal.",
    },
    {
      question: "Can an IUD be removed early?",
      answer:
        "Yes, an IUD can be removed at any time for any reason. Removal is typically quick and less uncomfortable than insertion. Fertility returns rapidly -- often within one cycle. If you want continuous contraception, have a backup method ready or start a new method immediately.",
    },
  ],
  formula:
    "Months Remaining = (Duration Years x 12) - Months Since Insertion | Replacement Date = Expiration - 1 month",
};
