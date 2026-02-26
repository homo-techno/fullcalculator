import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const clomidOvulationCalculator: CalculatorDefinition = {
  slug: "clomid-ovulation-calculator",
  title: "Clomid Ovulation Calculator",
  description:
    "Predict ovulation timing when taking Clomid (clomiphene citrate). Estimate your fertile window based on when you started Clomid and your cycle day.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: [
    "clomid ovulation calculator",
    "clomiphene citrate",
    "fertility medication",
    "ovulation prediction",
    "clomid cycle",
    "fertile window clomid",
    "clomid timing",
  ],
  variants: [
    {
      id: "clomid-standard",
      name: "Standard Clomid Ovulation Prediction",
      description: "Predict ovulation based on the day you started taking Clomid",
      fields: [
        {
          name: "startDay",
          label: "Clomid Start Day (Cycle Day)",
          type: "select",
          options: [
            { label: "Day 2", value: "2" },
            { label: "Day 3", value: "3" },
            { label: "Day 4", value: "4" },
            { label: "Day 5", value: "5" },
          ],
        },
        {
          name: "daysOnClomid",
          label: "Days Taking Clomid",
          type: "select",
          options: [
            { label: "5 days (standard)", value: "5" },
            { label: "7 days (extended)", value: "7" },
          ],
        },
        {
          name: "cycleLength",
          label: "Typical Cycle Length",
          type: "number",
          placeholder: "e.g. 28",
          suffix: "days",
          min: 21,
          max: 45,
          step: 1,
          defaultValue: 28,
        },
      ],
      calculate: (inputs) => {
        const startDay = parseFloat(inputs.startDay as string);
        const daysOnClomid = parseFloat(inputs.daysOnClomid as string);
        const cycleLength = parseFloat(inputs.cycleLength as string) || 28;

        if (isNaN(startDay)) return null;

        const lastClomidDay = startDay + daysOnClomid - 1;
        const earliestOvulation = lastClomidDay + 5;
        const typicalOvulation = lastClomidDay + 7;
        const latestOvulation = lastClomidDay + 10;

        const fertileWindowStart = earliestOvulation - 2;
        const fertileWindowEnd = latestOvulation + 1;

        return {
          primary: { label: "Expected Ovulation", value: `Cycle Day ${formatNumber(typicalOvulation, 0)}` },
          details: [
            { label: "Clomid Days", value: `Cycle Day ${formatNumber(startDay, 0)} to ${formatNumber(lastClomidDay, 0)}` },
            { label: "Earliest Ovulation", value: `Cycle Day ${formatNumber(earliestOvulation, 0)}` },
            { label: "Most Likely Ovulation", value: `Cycle Day ${formatNumber(typicalOvulation, 0)}` },
            { label: "Latest Ovulation", value: `Cycle Day ${formatNumber(latestOvulation, 0)}` },
            { label: "Fertile Window", value: `Cycle Day ${formatNumber(fertileWindowStart, 0)} to ${formatNumber(fertileWindowEnd, 0)}` },
            { label: "Recommended Testing (OPK)", value: `Start on Cycle Day ${formatNumber(earliestOvulation - 3, 0)}` },
          ],
          note: "Most women on Clomid ovulate 5-10 days after the last pill. Use ovulation predictor kits (OPKs) to confirm. Timed intercourse is recommended every other day during the fertile window.",
        };
      },
    },
    {
      id: "clomid-trigger",
      name: "Clomid + HCG Trigger Shot Timing",
      description: "Predict ovulation when using Clomid with an HCG trigger shot",
      fields: [
        {
          name: "triggerDay",
          label: "HCG Trigger Shot Cycle Day",
          type: "number",
          placeholder: "e.g. 12",
          min: 8,
          max: 25,
          step: 1,
        },
        {
          name: "follicleSize",
          label: "Largest Follicle Size at Trigger",
          type: "select",
          options: [
            { label: "16-17 mm", value: "16" },
            { label: "18-19 mm", value: "18" },
            { label: "20-22 mm", value: "20" },
            { label: "23-25 mm", value: "23" },
            { label: "26+ mm", value: "26" },
          ],
        },
      ],
      calculate: (inputs) => {
        const triggerDay = parseFloat(inputs.triggerDay as string);
        const follicleSize = parseFloat(inputs.follicleSize as string);

        if (isNaN(triggerDay) || isNaN(follicleSize)) return null;

        const ovulationDay = triggerDay + 1.5;
        const ovulationDayEarly = triggerDay + 1;
        const ovulationDayLate = triggerDay + 2;

        let follicleStatus: string;
        if (follicleSize < 18) follicleStatus = "Borderline — may be slightly early for trigger";
        else if (follicleSize <= 22) follicleStatus = "Optimal size for trigger shot";
        else if (follicleSize <= 25) follicleStatus = "Mature — good timing";
        else follicleStatus = "Very large — may have already released or be post-mature";

        const iuiWindow = `Cycle Day ${formatNumber(triggerDay + 1, 0)}`;
        const intercourseWindow = `Cycle Day ${formatNumber(triggerDay, 0)} and ${formatNumber(triggerDay + 1, 0)}`;

        return {
          primary: { label: "Expected Ovulation", value: `~${formatNumber(ovulationDay, 0)} hours after trigger (Cycle Day ${formatNumber(Math.round(ovulationDay), 0)})` },
          details: [
            { label: "Trigger Shot Day", value: `Cycle Day ${formatNumber(triggerDay, 0)}` },
            { label: "Ovulation Window", value: `Cycle Day ${formatNumber(ovulationDayEarly, 0)} to ${formatNumber(ovulationDayLate, 0)}` },
            { label: "Follicle Size", value: `${formatNumber(follicleSize, 0)} mm — ${follicleStatus}` },
            { label: "Best IUI Timing", value: iuiWindow },
            { label: "Best Intercourse Timing", value: intercourseWindow },
          ],
          note: "HCG trigger shot typically causes ovulation 24-36 hours after injection. IUI is usually performed 24-36 hours post-trigger. Follow your fertility specialist's specific instructions.",
        };
      },
    },
  ],
  relatedSlugs: ["basal-body-temp-calculator", "luteal-phase-calculator", "implantation-calculator"],
  faq: [
    {
      question: "When does ovulation occur after taking Clomid?",
      answer:
        "Most women ovulate 5-10 days after their last Clomid pill. If you take Clomid on days 3-7, expect ovulation around days 12-17. If on days 5-9, expect around days 14-19. Use ovulation predictor kits starting a few days before expected ovulation.",
    },
    {
      question: "What is the success rate with Clomid?",
      answer:
        "About 80% of women ovulate on Clomid, and approximately 30-40% conceive within the first 3 cycles. Success rates per cycle are about 10-12% for timed intercourse and 15-18% when combined with IUI.",
    },
  ],
  formula:
    "Typical Ovulation Day = Last Clomid Day + 7 (range: +5 to +10) | Fertile Window = Earliest Ovulation Day - 2 to Latest Ovulation Day + 1 | HCG Trigger: Ovulation occurs 24-36 hours post-injection",
};
