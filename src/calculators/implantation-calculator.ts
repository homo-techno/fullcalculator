import type { CalculatorDefinition } from "./types";

export const implantationCalculator: CalculatorDefinition = {
  slug: "implantation-calculator",
  title: "Implantation Calculator",
  description:
    "Free implantation calculator. Estimate when a fertilized egg may implant in the uterus based on your ovulation or last period date.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: [
    "implantation calculator",
    "implantation date",
    "when does implantation occur",
    "implantation bleeding",
    "embryo implantation",
  ],
  variants: [
    {
      id: "from-ovulation",
      name: "Implantation from Ovulation Date",
      description: "Estimate implantation window based on ovulation",
      fields: [
        {
          name: "ovulationDay",
          label: "Ovulation Day of Month",
          type: "number",
          placeholder: "e.g. 14",
          min: 1,
          max: 31,
        },
        {
          name: "ovulationMonth",
          label: "Ovulation Month (1-12)",
          type: "number",
          placeholder: "e.g. 3",
          min: 1,
          max: 12,
        },
      ],
      calculate: (inputs) => {
        const day = inputs.ovulationDay as number;
        const month = inputs.ovulationMonth as number;
        if (!day || !month) return null;

        const year = new Date().getFullYear();
        const ovDate = new Date(year, month - 1, day);
        const implantEarly = new Date(ovDate.getTime() + 6 * 86400000);
        const implantMost = new Date(ovDate.getTime() + 9 * 86400000);
        const implantLate = new Date(ovDate.getTime() + 12 * 86400000);
        const testDate = new Date(ovDate.getTime() + 14 * 86400000);
        const bleedingStart = new Date(ovDate.getTime() + 6 * 86400000);
        const bleedingEnd = new Date(ovDate.getTime() + 12 * 86400000);

        const fmt = (d: Date) =>
          d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

        return {
          primary: {
            label: "Most Likely Implantation",
            value: fmt(implantMost),
          },
          details: [
            { label: "Earliest Implantation", value: fmt(implantEarly) },
            { label: "Most Common (8-10 DPO)", value: `${fmt(new Date(ovDate.getTime() + 8 * 86400000))} - ${fmt(new Date(ovDate.getTime() + 10 * 86400000))}` },
            { label: "Latest Implantation", value: fmt(implantLate) },
            { label: "Possible Bleeding Window", value: `${fmt(bleedingStart)} - ${fmt(bleedingEnd)}` },
            { label: "Earliest Pregnancy Test", value: fmt(testDate) },
          ],
          note: "Implantation typically occurs 6-12 days after ovulation, most commonly around 8-10 days post-ovulation (DPO). Implantation bleeding, if it occurs, is light spotting lasting 1-2 days.",
        };
      },
    },
    {
      id: "from-period",
      name: "Implantation from Last Period",
      description: "Estimate implantation window based on last period",
      fields: [
        {
          name: "periodDay",
          label: "First Day of Last Period (day)",
          type: "number",
          placeholder: "e.g. 1",
          min: 1,
          max: 31,
        },
        {
          name: "periodMonth",
          label: "Month of Last Period (1-12)",
          type: "number",
          placeholder: "e.g. 3",
          min: 1,
          max: 12,
        },
        {
          name: "cycleLength",
          label: "Average Cycle Length (days)",
          type: "number",
          placeholder: "e.g. 28",
          min: 21,
          max: 40,
          defaultValue: 28,
        },
      ],
      calculate: (inputs) => {
        const day = inputs.periodDay as number;
        const month = inputs.periodMonth as number;
        const cycleLen = (inputs.cycleLength as number) || 28;
        if (!day || !month) return null;

        const year = new Date().getFullYear();
        const periodDate = new Date(year, month - 1, day);
        const ovulationDaysAfter = cycleLen - 14;
        const ovDate = new Date(periodDate.getTime() + ovulationDaysAfter * 86400000);
        const implantEarly = new Date(ovDate.getTime() + 6 * 86400000);
        const implantMost = new Date(ovDate.getTime() + 9 * 86400000);
        const implantLate = new Date(ovDate.getTime() + 12 * 86400000);
        const testDate = new Date(ovDate.getTime() + 14 * 86400000);

        const fmt = (d: Date) =>
          d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

        return {
          primary: {
            label: "Most Likely Implantation",
            value: fmt(implantMost),
          },
          details: [
            { label: "Estimated Ovulation", value: fmt(ovDate) },
            { label: "Earliest Implantation (6 DPO)", value: fmt(implantEarly) },
            { label: "Most Common (8-10 DPO)", value: `${fmt(new Date(ovDate.getTime() + 8 * 86400000))} - ${fmt(new Date(ovDate.getTime() + 10 * 86400000))}` },
            { label: "Latest Implantation (12 DPO)", value: fmt(implantLate) },
            { label: "Earliest Pregnancy Test", value: fmt(testDate) },
          ],
          note: "This estimate assumes ovulation occurs about 14 days before your next expected period. Actual ovulation timing can vary. Use ovulation predictor kits for more accurate timing.",
        };
      },
    },
  ],
  relatedSlugs: ["ovulation-calculator", "fertility-window-calculator", "pregnancy-test-timing-calculator"],
  faq: [
    {
      question: "What is implantation?",
      answer:
        "Implantation is when a fertilized egg (blastocyst) attaches to the lining of the uterus. This typically occurs 6-12 days after ovulation, most commonly around 8-10 days post-ovulation. Successful implantation is required for pregnancy to begin.",
    },
    {
      question: "What does implantation bleeding look like?",
      answer:
        "Implantation bleeding is typically very light pink or brown spotting that lasts 1-2 days. It's much lighter than a normal period. Only about 25-30% of pregnant women experience implantation bleeding.",
    },
    {
      question: "Can I take a pregnancy test during implantation?",
      answer:
        "It's best to wait until at least 14 days past ovulation (DPO) or the day of your expected period. hCG levels need time to rise after implantation, and testing too early may give a false negative.",
    },
  ],
  formula:
    "Implantation Window = Ovulation Date + 6 to 12 days | Most Common = Ovulation + 8 to 10 days | Earliest Test = Ovulation + 14 days",
};
