import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const cpapPressureCalculator: CalculatorDefinition = {
  slug: "cpap-pressure-calculator",
  title: "CPAP Pressure Estimator",
  description:
    "Estimate your CPAP pressure settings based on clinical factors. Includes the Miljeteig-Hoffstein formula and BMI-based estimates for sleep apnea management.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: [
    "cpap pressure calculator",
    "cpap settings",
    "cpap pressure estimator",
    "sleep apnea pressure",
    "apap pressure",
    "cpap titration estimate",
  ],
  variants: [
    {
      id: "estimate",
      name: "Pressure Estimate",
      description: "Estimate optimal CPAP pressure using clinical formulas",
      fields: [
        {
          name: "bmi",
          label: "BMI",
          type: "number",
          placeholder: "e.g. 32",
          min: 15,
          max: 70,
        },
        {
          name: "neckCircumference",
          label: "Neck Circumference",
          type: "number",
          placeholder: "e.g. 17",
          suffix: "inches",
          min: 10,
          max: 30,
        },
        {
          name: "ahi",
          label: "AHI (Apnea-Hypopnea Index)",
          type: "number",
          placeholder: "e.g. 25",
          suffix: "events/hr",
          min: 0,
          max: 120,
        },
        {
          name: "severity",
          label: "OSA Severity",
          type: "select",
          options: [
            { label: "Mild (AHI 5-15)", value: "mild" },
            { label: "Moderate (AHI 15-30)", value: "moderate" },
            { label: "Severe (AHI 30+)", value: "severe" },
          ],
          defaultValue: "moderate",
        },
      ],
      calculate: (inputs) => {
        const bmi = parseFloat(inputs.bmi as string);
        const neck = parseFloat(inputs.neckCircumference as string);
        const ahi = parseFloat(inputs.ahi as string);
        const severity = inputs.severity as string;
        if (!bmi) return null;

        const neckCm = neck ? neck * 2.54 : bmi > 30 ? 43 : 38;
        const ahiVal = ahi || (severity === "mild" ? 10 : severity === "moderate" ? 22 : 45);

        // Miljeteig-Hoffstein formula: P = 0.16 x BMI + 0.13 x NC(cm) + 0.04 x AHI - 5.12
        const estimatedPressure = 0.16 * bmi + 0.13 * neckCm + 0.04 * ahiVal - 5.12;
        const pressureClamped = Math.max(4, Math.min(20, estimatedPressure));

        // Suggested APAP range
        const apapLow = Math.max(4, Math.round(pressureClamped - 3));
        const apapHigh = Math.min(20, Math.round(pressureClamped + 3));

        let severityLabel: string;
        if (ahiVal < 5) severityLabel = "Normal / no OSA";
        else if (ahiVal < 15) severityLabel = "Mild OSA";
        else if (ahiVal < 30) severityLabel = "Moderate OSA";
        else severityLabel = "Severe OSA";

        return {
          primary: { label: "Estimated CPAP Pressure", value: `${formatNumber(pressureClamped, 1)} cmH2O` },
          details: [
            { label: "APAP Range Suggestion", value: `${formatNumber(apapLow, 0)} - ${formatNumber(apapHigh, 0)} cmH2O` },
            { label: "OSA Severity", value: severityLabel },
            { label: "AHI Used", value: `${formatNumber(ahiVal, 1)} events/hr` },
            { label: "BMI", value: formatNumber(bmi, 1) },
            { label: "Neck (cm)", value: formatNumber(neckCm, 1) },
          ],
          note: "This is an ESTIMATE only based on the Miljeteig-Hoffstein formula. Actual CPAP pressure must be determined by a sleep specialist through in-lab titration or auto-titrating CPAP (APAP) data review. Never adjust your pressure without consulting your sleep physician.",
        };
      },
    },
    {
      id: "compliance",
      name: "Compliance Tracker",
      description: "Estimate CPAP usage compliance and effectiveness",
      fields: [
        {
          name: "nightsUsed",
          label: "Nights Used Per Week",
          type: "number",
          placeholder: "e.g. 5",
          min: 0,
          max: 7,
          defaultValue: 5,
        },
        {
          name: "hoursPerNight",
          label: "Average Hours Per Night",
          type: "number",
          placeholder: "e.g. 6",
          suffix: "hours",
          min: 0,
          max: 12,
          step: 0.5,
          defaultValue: 6,
        },
        {
          name: "ahiBefore",
          label: "AHI Before CPAP",
          type: "number",
          placeholder: "e.g. 30",
          suffix: "events/hr",
          min: 0,
          max: 120,
        },
        {
          name: "ahiOnCpap",
          label: "AHI On CPAP (residual)",
          type: "number",
          placeholder: "e.g. 3",
          suffix: "events/hr",
          min: 0,
          max: 30,
        },
      ],
      calculate: (inputs) => {
        const nightsUsed = parseFloat(inputs.nightsUsed as string);
        const hoursPerNight = parseFloat(inputs.hoursPerNight as string);
        const ahiBefore = parseFloat(inputs.ahiBefore as string);
        const ahiOnCpap = parseFloat(inputs.ahiOnCpap as string);
        if (isNaN(nightsUsed) || isNaN(hoursPerNight)) return null;

        // Medicare compliance: >= 4 hours on >= 70% of nights (5/7)
        const compliancePercent = (nightsUsed / 7) * 100;
        const meetsCompliance = nightsUsed >= 5 && hoursPerNight >= 4;

        const ahiReduction = ahiBefore && ahiOnCpap ? ((ahiBefore - ahiOnCpap) / ahiBefore) * 100 : 0;
        const residualOk = ahiOnCpap !== undefined ? ahiOnCpap < 5 : true;

        const weeklyHours = nightsUsed * hoursPerNight;
        const monthlyHours = weeklyHours * 4.33;

        return {
          primary: { label: "Compliance Status", value: meetsCompliance ? "Compliant" : "Below threshold" },
          details: [
            { label: "Usage Rate", value: `${formatNumber(compliancePercent, 0)}% of nights` },
            { label: "Hours/Night", value: `${formatNumber(hoursPerNight, 1)} hours` },
            { label: "Weekly Hours", value: `${formatNumber(weeklyHours, 1)} hours` },
            { label: "Monthly Hours", value: `${formatNumber(monthlyHours, 0)} hours` },
            { label: "AHI Reduction", value: ahiBefore ? `${formatNumber(ahiReduction, 0)}%` : "N/A" },
            { label: "Residual AHI OK (<5)", value: ahiOnCpap !== undefined ? (residualOk ? "Yes" : "No -- consult doctor") : "N/A" },
            { label: "Medicare Threshold", value: "4+ hrs on 70%+ nights" },
          ],
          note: "Medicare and most insurance require CPAP use >= 4 hours per night on >= 70% of nights during a consecutive 30-day period within the first 90 days. Optimal benefit requires use during all sleep. Residual AHI should be < 5 events/hr.",
        };
      },
    },
  ],
  relatedSlugs: ["bmi-calculator", "sleep-calculator", "hearing-aid-cost-calculator"],
  faq: [
    {
      question: "What CPAP pressure do I need?",
      answer:
        "CPAP pressure ranges from 4-20 cmH2O, with most patients needing 8-12 cmH2O. The exact pressure is determined by a sleep specialist through in-lab titration study or by reviewing data from an auto-adjusting CPAP (APAP). Factors include BMI, neck circumference, and AHI severity.",
    },
    {
      question: "What is the difference between CPAP and APAP?",
      answer:
        "CPAP delivers a single fixed pressure all night. APAP (auto-titrating PAP) automatically adjusts pressure breath-by-breath between a set range, delivering only the pressure needed. APAP is often preferred for comfort and is used for both treatment and pressure determination.",
    },
    {
      question: "What is good CPAP compliance?",
      answer:
        "Medicare defines compliance as using CPAP >= 4 hours per night on >= 70% of nights. However, optimal health benefits come from using CPAP all night, every night. Studies show each additional hour of use provides incremental benefit for daytime alertness and cardiovascular health.",
    },
  ],
  formula:
    "Estimated Pressure (cmH2O) = 0.16 x BMI + 0.13 x Neck(cm) + 0.04 x AHI - 5.12 (Miljeteig-Hoffstein formula)",
};
