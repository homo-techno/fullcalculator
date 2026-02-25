import type { CalculatorDefinition } from "./types";

export const nicuStayCalculator: CalculatorDefinition = {
  slug: "nicu-stay-calculator",
  title: "NICU Stay Estimator",
  description:
    "Free NICU stay estimator. Estimate potential NICU length of stay based on gestational age at birth, birth weight, and common complications.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: [
    "NICU stay",
    "NICU length",
    "premature baby hospital",
    "neonatal intensive care",
    "NICU estimator",
  ],
  variants: [
    {
      id: "estimate",
      name: "Estimate NICU Stay",
      description: "Estimate length of NICU stay based on baby's condition",
      fields: [
        {
          name: "gestWeeksAtBirth",
          label: "Gestational Age at Birth (weeks)",
          type: "number",
          placeholder: "e.g. 32",
          min: 22,
          max: 42,
        },
        {
          name: "birthWeightG",
          label: "Birth Weight (grams)",
          type: "number",
          placeholder: "e.g. 1800",
          min: 300,
          max: 5000,
        },
        {
          name: "complications",
          label: "Complications",
          type: "select",
          options: [
            { label: "None / Mild", value: "none" },
            { label: "Breathing support needed", value: "respiratory" },
            { label: "Feeding difficulties", value: "feeding" },
            { label: "Multiple complications", value: "multiple" },
          ],
        },
      ],
      calculate: (inputs) => {
        const gestWeeks = inputs.gestWeeksAtBirth as number;
        const birthWeight = inputs.birthWeightG as number;
        const complications = inputs.complications as string;
        if (!gestWeeks || !birthWeight || !complications) return null;

        // General rule: NICU stay until original due date (40 weeks)
        const weeksEarly = Math.max(0, 40 - gestWeeks);
        let baseStayDays = weeksEarly * 7;

        // Adjust for weight
        const birthWeightLbs = birthWeight / 453.592;
        if (birthWeight < 1000) {
          baseStayDays = Math.max(baseStayDays, 90);
        } else if (birthWeight < 1500) {
          baseStayDays = Math.max(baseStayDays, 60);
        } else if (birthWeight < 2000) {
          baseStayDays = Math.max(baseStayDays, 30);
        }

        // Adjust for complications
        let complicationFactor = 1.0;
        let complicationNote = "No significant complications expected";
        if (complications === "respiratory") {
          complicationFactor = 1.3;
          complicationNote = "Respiratory support may extend stay by 20-40%";
        } else if (complications === "feeding") {
          complicationFactor = 1.2;
          complicationNote = "Feeding issues may add 1-3 weeks";
        } else if (complications === "multiple") {
          complicationFactor = 1.5;
          complicationNote = "Multiple complications can significantly extend stay";
        }

        const adjustedStayDays = Math.round(baseStayDays * complicationFactor);
        const stayWeeks = Math.round(adjustedStayDays / 7);

        // If term baby (37+), minimal NICU needed
        let estimate = "";
        if (gestWeeks >= 37 && complications === "none") {
          estimate = "Brief observation (0-3 days)";
        } else if (gestWeeks >= 37) {
          estimate = `${Math.max(3, Math.round(adjustedStayDays * 0.3))}-${Math.round(adjustedStayDays * 0.5)} days`;
        } else {
          estimate = `${Math.round(adjustedStayDays * 0.8)}-${adjustedStayDays} days (~${stayWeeks} weeks)`;
        }

        // Milestones
        const milestones = [];
        if (gestWeeks < 34) {
          milestones.push("Breathing independently");
          milestones.push("Maintaining body temperature");
        }
        milestones.push("Feeding by mouth (breast or bottle)");
        milestones.push("Steady weight gain");
        if (gestWeeks < 35) {
          milestones.push("No apnea/bradycardia events for 5-7 days");
        }

        // Estimated cost range
        const dailyCostLow = 3000;
        const dailyCostHigh = 5000;
        const totalCostLow = adjustedStayDays * dailyCostLow;
        const totalCostHigh = adjustedStayDays * dailyCostHigh;

        return {
          primary: { label: "Estimated NICU Stay", value: estimate },
          details: [
            { label: "Gestational age at birth", value: `${gestWeeks} weeks (${weeksEarly} weeks early)` },
            { label: "Birth weight", value: `${birthWeight} g (${birthWeightLbs.toFixed(2)} lbs)` },
            { label: "Complications", value: complicationNote },
            { label: "Discharge milestones", value: milestones.join("; ") },
            {
              label: "Estimated cost range",
              value: adjustedStayDays > 0
                ? `$${(totalCostLow / 1000).toFixed(0)}K-$${(totalCostHigh / 1000).toFixed(0)}K (before insurance)`
                : "Minimal",
            },
            { label: "Target discharge", value: "Often near original due date for preemies" },
          ],
          note: "This is a rough estimate only. Actual NICU stays vary greatly based on individual circumstances. Your medical team will provide specific guidance for your baby.",
        };
      },
    },
  ],
  relatedSlugs: ["apgar-score-calculator", "fetal-weight-calculator"],
  faq: [
    {
      question: "How long will my premature baby be in the NICU?",
      answer:
        "A general rule is that premature babies often stay in the NICU until close to their original due date (40 weeks). For example, a baby born at 32 weeks might stay about 8 weeks. However, actual stays depend on the baby's ability to breathe, eat, and maintain temperature independently.",
    },
    {
      question: "What milestones does a baby need to meet before NICU discharge?",
      answer:
        "Key discharge milestones include: breathing independently without support, maintaining body temperature in an open crib, feeding well by mouth, gaining weight steadily, and being free of apnea/bradycardia events for at least 5-7 days.",
    },
  ],
  formula:
    "Base estimate: (40 - gestational age at birth) x 7 days. Adjusted for weight (<1000g: 90+ days, <1500g: 60+ days, <2000g: 30+ days) and complications (respiratory: +30%, feeding: +20%, multiple: +50%).",
};
