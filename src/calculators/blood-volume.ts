import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const bloodVolumeCalculator: CalculatorDefinition = {
  slug: "blood-volume-calculator",
  title: "Blood Volume Calculator",
  description:
    "Free blood volume calculator. Estimate total blood volume based on height, weight, and sex using Nadler's equation. Used in surgery, transfusion medicine, and clinical assessment.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: [
    "blood volume calculator",
    "total blood volume",
    "Nadler equation",
    "estimated blood volume",
    "blood loss percentage",
    "circulating volume",
  ],
  variants: [
    {
      id: "nadler",
      name: "Nadler's Equation",
      description: "Estimate total blood volume using Nadler's formula",
      fields: [
        {
          name: "sex",
          label: "Sex",
          type: "select",
          options: [
            { label: "Male", value: "male" },
            { label: "Female", value: "female" },
          ],
        },
        {
          name: "height",
          label: "Height",
          type: "number",
          placeholder: "e.g. 175",
          suffix: "cm",
          min: 50,
          max: 250,
        },
        {
          name: "weight",
          label: "Weight",
          type: "number",
          placeholder: "e.g. 70",
          suffix: "kg",
          min: 10,
          max: 300,
        },
      ],
      calculate: (inputs) => {
        const sex = inputs.sex as string;
        const height = inputs.height as number;
        const weight = inputs.weight as number;
        if (!sex || !height || !weight) return null;

        const heightM = height / 100;
        let bloodVolumeMl: number;

        if (sex === "male") {
          // Nadler male: BV = 0.3669 × H³ + 0.03219 × W + 0.6041
          bloodVolumeMl = (0.3669 * Math.pow(heightM, 3) + 0.03219 * weight + 0.6041) * 1000;
        } else {
          // Nadler female: BV = 0.3561 × H³ + 0.03308 × W + 0.1833
          bloodVolumeMl = (0.3561 * Math.pow(heightM, 3) + 0.03308 * weight + 0.1833) * 1000;
        }

        const bloodVolumeLiters = bloodVolumeMl / 1000;
        const mlPerKg = bloodVolumeMl / weight;

        // Blood loss class estimates
        const class1 = bloodVolumeMl * 0.15; // up to 15%
        const class2 = bloodVolumeMl * 0.30; // 15-30%
        const class3 = bloodVolumeMl * 0.40; // 30-40%

        return {
          primary: { label: "Total Blood Volume", value: `${formatNumber(bloodVolumeMl, 0)} mL` },
          details: [
            { label: "Blood volume", value: `${formatNumber(bloodVolumeLiters, 2)} L (${formatNumber(bloodVolumeMl, 0)} mL)` },
            { label: "Volume per kg", value: `${formatNumber(mlPerKg, 1)} mL/kg` },
            { label: "Expected range", value: sex === "male" ? "~70 mL/kg (males)" : "~65 mL/kg (females)" },
            { label: "Class I hemorrhage (up to 15%)", value: `up to ${formatNumber(class1, 0)} mL` },
            { label: "Class II hemorrhage (15-30%)", value: `${formatNumber(class1, 0)} - ${formatNumber(class2, 0)} mL` },
            { label: "Class III hemorrhage (30-40%)", value: `${formatNumber(class2, 0)} - ${formatNumber(class3, 0)} mL` },
          ],
          note: "Uses Nadler's equation (1962). Average blood volume is ~70 mL/kg for adult males and ~65 mL/kg for adult females. Actual volume varies with age, body composition, and medical conditions. For clinical decisions, always use institution-specific protocols.",
        };
      },
    },
    {
      id: "simple",
      name: "Quick Estimate (mL/kg)",
      description: "Quick blood volume estimate using weight-based approximation",
      fields: [
        {
          name: "weight",
          label: "Weight",
          type: "number",
          placeholder: "e.g. 70",
          suffix: "kg",
          min: 1,
          max: 300,
        },
        {
          name: "patientType",
          label: "Patient Type",
          type: "select",
          options: [
            { label: "Adult Male (~70 mL/kg)", value: "adult-male" },
            { label: "Adult Female (~65 mL/kg)", value: "adult-female" },
            { label: "Child (~80 mL/kg)", value: "child" },
            { label: "Infant (~80 mL/kg)", value: "infant" },
            { label: "Neonate (~85 mL/kg)", value: "neonate" },
            { label: "Premature Neonate (~95 mL/kg)", value: "preemie" },
          ],
        },
      ],
      calculate: (inputs) => {
        const weight = inputs.weight as number;
        const type = inputs.patientType as string;
        if (!weight || !type) return null;

        const mlPerKgMap: Record<string, number> = {
          "adult-male": 70,
          "adult-female": 65,
          "child": 80,
          "infant": 80,
          "neonate": 85,
          "preemie": 95,
        };

        const mlPerKg = mlPerKgMap[type] || 70;
        const volume = weight * mlPerKg;

        const loss10pct = volume * 0.10;
        const loss20pct = volume * 0.20;
        const loss30pct = volume * 0.30;

        return {
          primary: { label: "Estimated Blood Volume", value: `${formatNumber(volume, 0)} mL` },
          details: [
            { label: "Estimated volume", value: `${formatNumber(volume, 0)} mL (${formatNumber(volume / 1000, 2)} L)` },
            { label: "Estimate basis", value: `${mlPerKg} mL/kg` },
            { label: "10% blood loss", value: `${formatNumber(loss10pct, 0)} mL` },
            { label: "20% blood loss", value: `${formatNumber(loss20pct, 0)} mL` },
            { label: "30% blood loss", value: `${formatNumber(loss30pct, 0)} mL` },
          ],
          note: "This is a quick estimate using standard mL/kg values. Individual variation exists. For surgical planning and critical care, consider using Nadler's equation and clinical assessment. Obese patients may have lower mL/kg values.",
        };
      },
    },
  ],
  relatedSlugs: ["blood-type-compatibility-calculator", "blood-pressure-calculator", "iv-flow-rate-calculator"],
  faq: [
    {
      question: "How much blood is in the human body?",
      answer:
        "The average adult has about 4.7-5.5 liters (1.2-1.5 gallons) of blood. This is roughly 7% of body weight. Males average ~70 mL/kg and females ~65 mL/kg.",
    },
    {
      question: "What is Nadler's equation?",
      answer:
        "Nadler's equation (1962) estimates total blood volume using height and weight: Males: BV(L) = 0.3669 x H(m)^3 + 0.03219 x W(kg) + 0.6041. Females: BV(L) = 0.3561 x H(m)^3 + 0.03308 x W(kg) + 0.1833.",
    },
    {
      question: "How much blood can you safely lose?",
      answer:
        "Class I hemorrhage (up to 15%, ~750 mL in adults) typically requires no transfusion. Class II (15-30%) may need fluids. Class III (30-40%) and Class IV (>40%) are life-threatening and typically require blood transfusion.",
    },
    {
      question: "Why does blood volume matter in medicine?",
      answer:
        "Blood volume estimation is critical in surgery, trauma management, blood transfusion planning, fluid resuscitation, and pharmacokinetic calculations for drugs distributed in blood.",
    },
  ],
  formula:
    "Nadler's Equation: Males: BV(L) = 0.3669 × H(m)^3 + 0.03219 × W(kg) + 0.6041 | Females: BV(L) = 0.3561 × H(m)^3 + 0.03308 × W(kg) + 0.1833 | Quick estimate: BV(mL) = Weight(kg) × mL/kg factor",
};
