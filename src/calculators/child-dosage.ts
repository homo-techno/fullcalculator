import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const childDosageCalculator: CalculatorDefinition = {
  slug: "child-dosage-calculator",
  title: "Children's Medicine Dosage Calculator",
  description:
    "Free children's medicine dosage calculator. Calculate correct acetaminophen (Tylenol) and ibuprofen (Motrin/Advil) doses by weight for children.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: [
    "children's dosage",
    "kids medicine dose",
    "children's Tylenol dose",
    "children's ibuprofen dose",
    "pediatric dosage chart",
  ],
  variants: [
    {
      id: "acetaminophen",
      name: "Acetaminophen (Tylenol)",
      description: "Calculate acetaminophen dose by weight",
      fields: [
        {
          name: "weight",
          label: "Child's Weight (lbs)",
          type: "number",
          placeholder: "e.g. 25",
          min: 6,
          max: 120,
        },
        {
          name: "formulation",
          label: "Formulation",
          type: "select",
          options: [
            { label: "Infant Drops (160mg/5ml)", value: "infant" },
            { label: "Children's Liquid (160mg/5ml)", value: "liquid" },
            { label: "Chewable Tablets (160mg each)", value: "chewable" },
            { label: "Junior Strength (325mg each)", value: "junior" },
          ],
          defaultValue: "liquid",
        },
      ],
      calculate: (inputs) => {
        const weightLbs = inputs.weight as number;
        const formulation = inputs.formulation as string;
        if (!weightLbs) return null;

        const weightKg = weightLbs * 0.453592;
        // Standard dose: 10-15 mg/kg every 4-6 hours, max 5 doses/day
        const doseMg = Math.min(weightKg * 15, 1000); // max single dose 1000mg
        const maxDailyMg = Math.min(doseMg * 5, 4000);

        let doseAmount: string;
        let unit: string;
        switch (formulation) {
          case "infant":
            doseAmount = formatNumber((doseMg / 160) * 5, 1);
            unit = "ml";
            break;
          case "liquid":
            doseAmount = formatNumber((doseMg / 160) * 5, 1);
            unit = "ml";
            break;
          case "chewable":
            doseAmount = formatNumber(Math.round(doseMg / 160), 0);
            unit = "tablet(s)";
            break;
          case "junior":
            doseAmount = formatNumber(Math.round(doseMg / 325), 0);
            unit = "tablet(s)";
            break;
          default:
            doseAmount = formatNumber((doseMg / 160) * 5, 1);
            unit = "ml";
        }

        return {
          primary: {
            label: "Dose",
            value: `${doseAmount} ${unit}`,
          },
          details: [
            { label: "Dose (mg)", value: `${formatNumber(doseMg, 0)} mg` },
            { label: "Frequency", value: "Every 4-6 hours" },
            { label: "Max Doses Per Day", value: "5 doses" },
            { label: "Max Daily Amount", value: `${formatNumber(maxDailyMg, 0)} mg` },
            { label: "Child's Weight", value: `${formatNumber(weightLbs, 0)} lbs (${formatNumber(weightKg, 1)} kg)` },
            { label: "Minimum Age", value: "2 months (consult doctor for younger)" },
          ],
          note: "IMPORTANT: This is for reference only. Always verify dosing with your pediatrician or pharmacist. Do not give acetaminophen to infants under 2 months without medical advice. Use the measuring device included with the medicine.",
        };
      },
    },
    {
      id: "ibuprofen",
      name: "Ibuprofen (Motrin/Advil)",
      description: "Calculate ibuprofen dose by weight",
      fields: [
        {
          name: "weight",
          label: "Child's Weight (lbs)",
          type: "number",
          placeholder: "e.g. 25",
          min: 12,
          max: 120,
        },
        {
          name: "formulation",
          label: "Formulation",
          type: "select",
          options: [
            { label: "Infant Drops (50mg/1.25ml)", value: "infant" },
            { label: "Children's Liquid (100mg/5ml)", value: "liquid" },
            { label: "Chewable Tablets (100mg each)", value: "chewable" },
            { label: "Junior Strength (200mg each)", value: "junior" },
          ],
          defaultValue: "liquid",
        },
      ],
      calculate: (inputs) => {
        const weightLbs = inputs.weight as number;
        const formulation = inputs.formulation as string;
        if (!weightLbs) return null;

        const weightKg = weightLbs * 0.453592;
        // Standard dose: 5-10 mg/kg every 6-8 hours, max 4 doses/day
        const doseMg = Math.min(weightKg * 10, 400); // max single dose 400mg
        const maxDailyMg = Math.min(doseMg * 4, 1200);

        let doseAmount: string;
        let unit: string;
        switch (formulation) {
          case "infant":
            doseAmount = formatNumber((doseMg / 50) * 1.25, 1);
            unit = "ml";
            break;
          case "liquid":
            doseAmount = formatNumber((doseMg / 100) * 5, 1);
            unit = "ml";
            break;
          case "chewable":
            doseAmount = formatNumber(Math.round(doseMg / 100), 0);
            unit = "tablet(s)";
            break;
          case "junior":
            doseAmount = formatNumber(Math.round(doseMg / 200), 0);
            unit = "tablet(s)";
            break;
          default:
            doseAmount = formatNumber((doseMg / 100) * 5, 1);
            unit = "ml";
        }

        return {
          primary: {
            label: "Dose",
            value: `${doseAmount} ${unit}`,
          },
          details: [
            { label: "Dose (mg)", value: `${formatNumber(doseMg, 0)} mg` },
            { label: "Frequency", value: "Every 6-8 hours" },
            { label: "Max Doses Per Day", value: "4 doses" },
            { label: "Max Daily Amount", value: `${formatNumber(maxDailyMg, 0)} mg` },
            { label: "Child's Weight", value: `${formatNumber(weightLbs, 0)} lbs (${formatNumber(weightKg, 1)} kg)` },
            { label: "Minimum Age", value: "6 months" },
          ],
          note: "IMPORTANT: This is for reference only. Do NOT give ibuprofen to children under 6 months. Always verify dosing with your pediatrician or pharmacist. Give with food to reduce stomach upset. Use the measuring device included with the medicine.",
        };
      },
    },
  ],
  relatedSlugs: ["pediatric-dose-calculator", "baby-weight-percentile-calculator", "baby-growth-calculator"],
  faq: [
    {
      question: "Should I dose by weight or age?",
      answer:
        "Always dose by weight when possible, as it is more accurate. Age-based dosing is a rough guide. A small 4-year-old and a large 4-year-old need different amounts. If you do not know the exact weight, use the most recent weight from a doctor's visit.",
    },
    {
      question: "Can I alternate Tylenol and ibuprofen?",
      answer:
        "Many pediatricians recommend alternating acetaminophen and ibuprofen every 3-4 hours for persistent fevers, but always check with your doctor first. Keep a written log of what you gave and when to prevent accidental double-dosing.",
    },
    {
      question: "When should I call the doctor about a fever?",
      answer:
        "Call your doctor if: your child is under 3 months with any fever (100.4F+), fever lasts more than 3 days, fever is above 104F, the child appears very ill/lethargic, fever returns after being gone for 24+ hours, or you are concerned about symptoms.",
    },
  ],
  formula:
    "Acetaminophen: 10-15 mg/kg every 4-6 hours, max 5 doses/day, max 75 mg/kg/day | Ibuprofen: 5-10 mg/kg every 6-8 hours, max 4 doses/day, max 40 mg/kg/day. Weight: lbs × 0.4536 = kg.",
};
