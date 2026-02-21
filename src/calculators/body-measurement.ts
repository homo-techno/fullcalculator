import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const bodyMeasurementCalculator: CalculatorDefinition = {
  slug: "body-measurement-calculator",
  title: "Body Measurement Calculator",
  description: "Free body measurement calculator for tailoring. Record and convert body measurements for custom clothing and alterations.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["body measurement calculator", "tailoring measurements", "custom clothing measurements", "body measurements for sewing", "measurement chart"],
  variants: [
    {
      id: "upper-body",
      name: "Upper Body Measurements",
      description: "Calculate proportional measurements for tops, jackets, and shirts",
      fields: [
        { name: "chest", label: "Chest / Bust (fullest point)", type: "number", placeholder: "e.g. 38", suffix: "in", step: 0.25 },
        { name: "waist", label: "Natural Waist (narrowest point)", type: "number", placeholder: "e.g. 32", suffix: "in", step: 0.25 },
        { name: "shoulderWidth", label: "Shoulder Width (seam to seam)", type: "number", placeholder: "e.g. 17", suffix: "in", step: 0.25 },
        { name: "sleeveLength", label: "Sleeve Length (shoulder to wrist)", type: "number", placeholder: "e.g. 25", suffix: "in", step: 0.25 },
        { name: "unit", label: "Unit", type: "select", options: [
          { label: "Inches", value: "in" },
          { label: "Centimeters", value: "cm" },
        ], defaultValue: "in" },
      ],
      calculate: (inputs) => {
        let chest = inputs.chest as number;
        let waist = inputs.waist as number;
        let shoulderWidth = inputs.shoulderWidth as number;
        let sleeveLength = inputs.sleeveLength as number;
        const unit = inputs.unit as string;
        if (!chest) return null;

        const toIn = unit === "cm" ? 1 / 2.54 : 1;
        const toCm = unit === "cm" ? 1 : 2.54;

        const chestIn = chest * toIn;
        const waistIn = (waist || 0) * toIn;
        const shoulderIn = (shoulderWidth || 0) * toIn;
        const sleeveIn = (sleeveLength || 0) * toIn;

        // Ease allowances for tailoring
        const easeClose = 2; // inches, close/fitted
        const easeComfort = 4; // standard comfort
        const easeLoose = 6; // loose fit

        const details: { label: string; value: string }[] = [
          { label: "Chest", value: `${formatNumber(chestIn, 1)} in / ${formatNumber(chestIn * 2.54, 1)} cm` },
        ];

        if (waist) details.push({ label: "Waist", value: `${formatNumber(waistIn, 1)} in / ${formatNumber(waistIn * 2.54, 1)} cm` });
        if (shoulderWidth) details.push({ label: "Shoulder Width", value: `${formatNumber(shoulderIn, 1)} in / ${formatNumber(shoulderIn * 2.54, 1)} cm` });
        if (sleeveLength) details.push({ label: "Sleeve Length", value: `${formatNumber(sleeveIn, 1)} in / ${formatNumber(sleeveIn * 2.54, 1)} cm` });

        details.push(
          { label: "Pattern Size (fitted)", value: `${formatNumber(chestIn + easeClose, 1)} in chest` },
          { label: "Pattern Size (comfort)", value: `${formatNumber(chestIn + easeComfort, 1)} in chest` },
          { label: "Pattern Size (loose)", value: `${formatNumber(chestIn + easeLoose, 1)} in chest` },
        );

        if (waist && chest) {
          const drop = chestIn - waistIn;
          details.push({ label: "Chest-Waist Drop", value: `${formatNumber(drop, 1)} inches` });
        }

        return {
          primary: { label: "Chest Measurement", value: `${formatNumber(chestIn, 1)} in` },
          details,
          note: "Ease is the extra room added to body measurements for comfort. Fitted: +2\", Standard: +4\", Loose: +6\". Pattern measurements include ease.",
        };
      },
    },
    {
      id: "lower-body",
      name: "Lower Body Measurements",
      description: "Calculate measurements for pants, skirts, and lower garments",
      fields: [
        { name: "waist", label: "Natural Waist", type: "number", placeholder: "e.g. 30", suffix: "in", step: 0.25 },
        { name: "hips", label: "Hips (fullest point)", type: "number", placeholder: "e.g. 40", suffix: "in", step: 0.25 },
        { name: "inseam", label: "Inseam (crotch to ankle)", type: "number", placeholder: "e.g. 31", suffix: "in", step: 0.25 },
        { name: "outseam", label: "Outseam (waist to ankle)", type: "number", placeholder: "e.g. 42", suffix: "in", step: 0.25 },
        { name: "thigh", label: "Thigh (fullest point)", type: "number", placeholder: "e.g. 24", suffix: "in", step: 0.25 },
        { name: "unit", label: "Unit", type: "select", options: [
          { label: "Inches", value: "in" },
          { label: "Centimeters", value: "cm" },
        ], defaultValue: "in" },
      ],
      calculate: (inputs) => {
        let waist = inputs.waist as number;
        let hips = inputs.hips as number;
        let inseam = inputs.inseam as number;
        let outseam = inputs.outseam as number;
        let thigh = inputs.thigh as number;
        const unit = inputs.unit as string;
        if (!waist || !hips) return null;

        const toIn = unit === "cm" ? 1 / 2.54 : 1;

        const waistIn = waist * toIn;
        const hipsIn = hips * toIn;
        const inseamIn = (inseam || 0) * toIn;
        const outseamIn = (outseam || 0) * toIn;
        const thighIn = (thigh || 0) * toIn;

        const hipWaistDiff = hipsIn - waistIn;

        // Rise calculation
        const rise = outseamIn && inseamIn ? outseamIn - inseamIn : 0;

        const details: { label: string; value: string }[] = [
          { label: "Waist", value: `${formatNumber(waistIn, 1)} in / ${formatNumber(waistIn * 2.54, 1)} cm` },
          { label: "Hips", value: `${formatNumber(hipsIn, 1)} in / ${formatNumber(hipsIn * 2.54, 1)} cm` },
          { label: "Hip-Waist Difference", value: `${formatNumber(hipWaistDiff, 1)} inches` },
        ];

        if (inseam) details.push({ label: "Inseam", value: `${formatNumber(inseamIn, 1)} in / ${formatNumber(inseamIn * 2.54, 1)} cm` });
        if (outseam) details.push({ label: "Outseam", value: `${formatNumber(outseamIn, 1)} in / ${formatNumber(outseamIn * 2.54, 1)} cm` });
        if (rise) details.push({ label: "Rise", value: `${formatNumber(rise, 1)} in` });
        if (thigh) details.push({ label: "Thigh", value: `${formatNumber(thighIn, 1)} in / ${formatNumber(thighIn * 2.54, 1)} cm` });

        return {
          primary: { label: "Hip-Waist Ratio", value: `${formatNumber(hipWaistDiff, 1)} in difference` },
          details,
          note: "For pants patterns, add 1-2 inches ease at waist and 2-3 inches ease at hips. Rise = Outseam - Inseam.",
        };
      },
    },
  ],
  relatedSlugs: ["dress-size-calculator", "mens-suit-size-calculator", "fabric-yardage-calculator"],
  faq: [
    { question: "How do I take accurate body measurements for sewing?", answer: "Wear fitted clothing or undergarments. Use a flexible tape measure. Keep it level and snug but not tight. Measure chest/bust at fullest point, waist at narrowest, hips at widest. Have someone help for back measurements." },
    { question: "What is ease in sewing and tailoring?", answer: "Ease is the extra measurement added to body dimensions for comfort and movement. Wearing ease (minimum for movement): 2-3 inches at chest. Design ease (style): varies from 0 for stretch fabrics to 6+ inches for loose fits." },
    { question: "How often should I update my measurements?", answer: "Re-measure yourself every 6-12 months, or whenever your weight changes by 5+ pounds. Body measurements can change due to fitness routine changes, aging, and other factors." },
  ],
  formula: "Pattern measurement = Body measurement + Ease | Fitted ease: +2\" | Comfort ease: +4\" | Loose ease: +6\" | Rise = Outseam − Inseam",
};
