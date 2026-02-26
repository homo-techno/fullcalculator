import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const lutealPhaseCalculator: CalculatorDefinition = {
  slug: "luteal-phase-calculator",
  title: "Luteal Phase Calculator",
  description:
    "Calculate your luteal phase length from cycle and ovulation data. Identify potential luteal phase defects and understand your fertility window timing.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: [
    "luteal phase calculator",
    "luteal phase length",
    "luteal phase defect",
    "progesterone",
    "fertility cycle",
    "ovulation to period",
    "cycle phase calculator",
  ],
  variants: [
    {
      id: "luteal-length",
      name: "Luteal Phase Length Calculator",
      description: "Calculate luteal phase length from ovulation day and cycle length",
      fields: [
        {
          name: "cycleLength",
          label: "Total Cycle Length",
          type: "number",
          placeholder: "e.g. 28",
          suffix: "days",
          min: 18,
          max: 45,
          step: 1,
        },
        {
          name: "ovulationDay",
          label: "Ovulation Day (Cycle Day)",
          type: "number",
          placeholder: "e.g. 14",
          suffix: "day",
          min: 8,
          max: 35,
          step: 1,
        },
      ],
      calculate: (inputs) => {
        const cycleLength = parseFloat(inputs.cycleLength as string);
        const ovulationDay = parseFloat(inputs.ovulationDay as string);

        if (isNaN(cycleLength) || isNaN(ovulationDay)) return null;

        const lutealPhase = cycleLength - ovulationDay;
        const follicularPhase = ovulationDay;

        let assessment: string;
        if (lutealPhase < 10) {
          assessment = "Short luteal phase (possible luteal phase defect) — may affect implantation";
        } else if (lutealPhase <= 16) {
          assessment = "Normal luteal phase length";
        } else {
          assessment = "Longer than typical — could indicate pregnancy or hormonal variation";
        }

        let fertilityNote: string;
        if (lutealPhase < 10) {
          fertilityNote = "A short luteal phase may indicate low progesterone. Consider discussing with a fertility specialist.";
        } else if (lutealPhase >= 10 && lutealPhase <= 12) {
          fertilityNote = "Adequate for implantation but on the shorter side. Progesterone support may be considered.";
        } else {
          fertilityNote = "Healthy luteal phase length — sufficient time for embryo implantation.";
        }

        return {
          primary: { label: "Luteal Phase Length", value: `${formatNumber(lutealPhase, 0)} days` },
          details: [
            { label: "Cycle Length", value: `${formatNumber(cycleLength, 0)} days` },
            { label: "Ovulation Day", value: `Cycle Day ${formatNumber(ovulationDay, 0)}` },
            { label: "Follicular Phase", value: `${formatNumber(follicularPhase, 0)} days` },
            { label: "Luteal Phase", value: `${formatNumber(lutealPhase, 0)} days` },
            { label: "Assessment", value: assessment },
            { label: "Fertility Note", value: fertilityNote },
          ],
          note: "Normal luteal phase is 10-16 days (average 12-14). A consistently short luteal phase (<10 days) may indicate a luteal phase defect. Consult your healthcare provider for personalized assessment.",
        };
      },
    },
    {
      id: "multi-cycle",
      name: "Multi-Cycle Luteal Phase Average",
      description: "Average luteal phase length over multiple cycles",
      fields: [
        {
          name: "lp1",
          label: "Cycle 1 — Luteal Phase Length",
          type: "number",
          placeholder: "e.g. 13",
          suffix: "days",
          min: 5,
          max: 25,
          step: 1,
        },
        {
          name: "lp2",
          label: "Cycle 2 — Luteal Phase Length",
          type: "number",
          placeholder: "e.g. 12",
          suffix: "days",
          min: 5,
          max: 25,
          step: 1,
        },
        {
          name: "lp3",
          label: "Cycle 3 — Luteal Phase Length",
          type: "number",
          placeholder: "e.g. 14",
          suffix: "days",
          min: 5,
          max: 25,
          step: 1,
        },
      ],
      calculate: (inputs) => {
        const lp1 = parseFloat(inputs.lp1 as string);
        const lp2 = parseFloat(inputs.lp2 as string);
        const lp3 = parseFloat(inputs.lp3 as string);

        if (isNaN(lp1) || isNaN(lp2) || isNaN(lp3)) return null;

        const avg = (lp1 + lp2 + lp3) / 3;
        const min = Math.min(lp1, lp2, lp3);
        const max = Math.max(lp1, lp2, lp3);
        const range = max - min;

        let consistency: string;
        if (range <= 1) consistency = "Very consistent — excellent cycle regularity";
        else if (range <= 2) consistency = "Consistent — normal variation";
        else if (range <= 4) consistency = "Moderately variable — some cycle irregularity";
        else consistency = "Highly variable — consider evaluation for hormonal imbalance";

        let assessment: string;
        if (avg < 10) assessment = "Average suggests possible luteal phase defect";
        else if (avg <= 16) assessment = "Average is within normal range";
        else assessment = "Average is longer than typical";

        return {
          primary: { label: "Average Luteal Phase", value: `${formatNumber(avg, 1)} days` },
          details: [
            { label: "Cycle 1", value: `${formatNumber(lp1, 0)} days` },
            { label: "Cycle 2", value: `${formatNumber(lp2, 0)} days` },
            { label: "Cycle 3", value: `${formatNumber(lp3, 0)} days` },
            { label: "Range", value: `${formatNumber(min, 0)} - ${formatNumber(max, 0)} days` },
            { label: "Consistency", value: consistency },
            { label: "Assessment", value: assessment },
          ],
          note: "Tracking luteal phase over multiple cycles gives a better picture of your hormonal health. The luteal phase is typically the most consistent part of the cycle (varying by 1-2 days).",
        };
      },
    },
  ],
  relatedSlugs: ["basal-body-temp-calculator", "clomid-ovulation-calculator", "period-calculator"],
  faq: [
    {
      question: "What is the luteal phase?",
      answer:
        "The luteal phase is the second half of your menstrual cycle, starting after ovulation and ending when your next period begins. During this phase, the corpus luteum produces progesterone to prepare the uterine lining for potential implantation.",
    },
    {
      question: "What is a luteal phase defect?",
      answer:
        "A luteal phase defect (LPD) occurs when the luteal phase is shorter than 10 days or progesterone production is insufficient. This can make it difficult for a fertilized egg to implant. Treatment options include progesterone supplementation or Clomid.",
    },
    {
      question: "How can I lengthen my luteal phase?",
      answer:
        "Options include: progesterone supplementation (prescription), vitamin B6 (50-100mg/day), vitamin C, reducing stress, and addressing underlying conditions like thyroid disorders. Always consult your healthcare provider before starting any treatment.",
    },
  ],
  formula:
    "Luteal Phase Length = Total Cycle Length - Ovulation Day | Follicular Phase = Ovulation Day | Normal range: 10-16 days, Optimal: 12-14 days",
};
