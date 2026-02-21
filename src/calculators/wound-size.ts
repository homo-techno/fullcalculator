import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const woundSizeCalculator: CalculatorDefinition = {
  slug: "wound-size-calculator",
  title: "Wound Size Measurement Calculator",
  description:
    "Free wound size calculator. Calculate wound area, volume, and track healing progress. Used for clinical wound assessment and documentation.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: [
    "wound size calculator",
    "wound measurement",
    "wound area",
    "wound volume",
    "wound healing",
    "wound assessment",
    "wound documentation",
  ],
  variants: [
    {
      id: "area",
      name: "Wound Area Calculation",
      description: "Calculate wound surface area from length and width measurements",
      fields: [
        {
          name: "length",
          label: "Wound Length (longest dimension)",
          type: "number",
          placeholder: "e.g. 5",
          suffix: "cm",
          min: 0.1,
          max: 100,
          step: 0.1,
        },
        {
          name: "width",
          label: "Wound Width (perpendicular to length)",
          type: "number",
          placeholder: "e.g. 3",
          suffix: "cm",
          min: 0.1,
          max: 100,
          step: 0.1,
        },
        {
          name: "shape",
          label: "Wound Shape",
          type: "select",
          options: [
            { label: "Rectangular/Square (L x W)", value: "rectangular" },
            { label: "Elliptical/Oval (pi x L/2 x W/2)", value: "elliptical" },
            { label: "Circular (pi x r²)", value: "circular" },
          ],
        },
      ],
      calculate: (inputs) => {
        const length = inputs.length as number;
        const width = inputs.width as number;
        const shape = inputs.shape as string;
        if (!length || !width || !shape) return null;

        let area: number;
        let formula: string;
        if (shape === "rectangular") {
          area = length * width;
          formula = "L x W";
        } else if (shape === "elliptical") {
          area = Math.PI * (length / 2) * (width / 2);
          formula = "pi x (L/2) x (W/2)";
        } else {
          const radius = Math.max(length, width) / 2;
          area = Math.PI * radius * radius;
          formula = "pi x r^2";
        }

        const perimeter = shape === "circular"
          ? 2 * Math.PI * (Math.max(length, width) / 2)
          : shape === "elliptical"
            ? Math.PI * (3 * (length / 2 + width / 2) - Math.sqrt((3 * length / 2 + width / 2) * (length / 2 + 3 * width / 2)))
            : 2 * (length + width);

        let sizeCategory: string;
        if (area < 1) sizeCategory = "Small (< 1 cm²)";
        else if (area < 5) sizeCategory = "Small-medium (1-5 cm²)";
        else if (area < 25) sizeCategory = "Medium (5-25 cm²)";
        else if (area < 100) sizeCategory = "Large (25-100 cm²)";
        else sizeCategory = "Very large (> 100 cm²)";

        return {
          primary: { label: "Wound Area", value: `${formatNumber(area, 1)} cm²` },
          details: [
            { label: "Length", value: `${length} cm` },
            { label: "Width", value: `${width} cm` },
            { label: "Area", value: `${formatNumber(area, 2)} cm²` },
            { label: "Approximate perimeter", value: `${formatNumber(perimeter, 1)} cm` },
            { label: "Size category", value: sizeCategory },
            { label: "Shape formula used", value: formula },
          ],
          note: "Measure wound length as the longest dimension (head to toe orientation) and width perpendicular to length. The elliptical formula is generally more accurate for wounds than L x W, which overestimates area. Always measure consistently for tracking.",
        };
      },
    },
    {
      id: "volume",
      name: "Wound Volume (with Depth)",
      description: "Calculate wound volume including depth measurement",
      fields: [
        {
          name: "length",
          label: "Wound Length",
          type: "number",
          placeholder: "e.g. 5",
          suffix: "cm",
          min: 0.1,
          max: 100,
          step: 0.1,
        },
        {
          name: "width",
          label: "Wound Width",
          type: "number",
          placeholder: "e.g. 3",
          suffix: "cm",
          min: 0.1,
          max: 100,
          step: 0.1,
        },
        {
          name: "depth",
          label: "Wound Depth (deepest point)",
          type: "number",
          placeholder: "e.g. 1.5",
          suffix: "cm",
          min: 0.1,
          max: 30,
          step: 0.1,
        },
      ],
      calculate: (inputs) => {
        const length = inputs.length as number;
        const width = inputs.width as number;
        const depth = inputs.depth as number;
        if (!length || !width || !depth) return null;

        const surfaceArea = length * width;
        const ellipticalArea = Math.PI * (length / 2) * (width / 2);
        const volumeRect = surfaceArea * depth;
        const volumeElliptical = ellipticalArea * depth * 0.5; // half-ellipsoid approximation

        return {
          primary: { label: "Wound Volume", value: `${formatNumber(volumeRect, 1)} cm³` },
          details: [
            { label: "Dimensions", value: `${length} x ${width} x ${depth} cm` },
            { label: "Surface area (L x W)", value: `${formatNumber(surfaceArea, 1)} cm²` },
            { label: "Volume (L x W x D)", value: `${formatNumber(volumeRect, 2)} cm³ / mL` },
            { label: "Volume (ellipsoidal est.)", value: `${formatNumber(volumeElliptical, 2)} cm³ / mL` },
          ],
          note: "Wound depth is measured at the deepest point using a sterile probe. Volume = L x W x D provides a maximum estimate. The ellipsoidal method (half of ellipsoidal volume) may be more accurate. Track wound volume over time to assess healing progress.",
        };
      },
    },
    {
      id: "healing-progress",
      name: "Wound Healing Progress",
      description: "Track wound size reduction over time",
      fields: [
        {
          name: "initialArea",
          label: "Initial Wound Area",
          type: "number",
          placeholder: "e.g. 15",
          suffix: "cm²",
          min: 0.1,
          max: 1000,
          step: 0.1,
        },
        {
          name: "currentArea",
          label: "Current Wound Area",
          type: "number",
          placeholder: "e.g. 10",
          suffix: "cm²",
          min: 0,
          max: 1000,
          step: 0.1,
        },
        {
          name: "weeks",
          label: "Time Elapsed",
          type: "number",
          placeholder: "e.g. 4",
          suffix: "weeks",
          min: 1,
          max: 52,
        },
      ],
      calculate: (inputs) => {
        const initial = inputs.initialArea as number;
        const current = inputs.currentArea as number;
        const weeks = inputs.weeks as number;
        if (!initial || current === undefined || !weeks) return null;

        const reduction = initial - current;
        const percentReduction = (reduction / initial) * 100;
        const weeklyRate = reduction / weeks;
        const weeklyPercentRate = percentReduction / weeks;

        // Estimate weeks to full closure
        let weeksToClose: string;
        if (current <= 0) weeksToClose = "Wound is closed";
        else if (weeklyRate <= 0) weeksToClose = "Wound is not improving — reassess treatment";
        else weeksToClose = `~${formatNumber(current / weeklyRate, 0)} weeks at current rate`;

        let progressAssessment: string;
        // Gilman criterion: wounds reducing by 20-40% in 2 weeks are likely to heal
        const twoWeekProjection = weeks >= 2 ? percentReduction : (percentReduction / weeks) * 2;
        if (current <= 0) progressAssessment = "Healed";
        else if (twoWeekProjection >= 40) progressAssessment = "Excellent healing trajectory";
        else if (twoWeekProjection >= 20) progressAssessment = "Adequate healing — wound likely to heal";
        else if (twoWeekProjection > 0) progressAssessment = "Slow healing — consider treatment reassessment";
        else progressAssessment = "Not healing or worsening — treatment change needed";

        return {
          primary: { label: "Wound Reduction", value: `${formatNumber(percentReduction, 0)}%` },
          details: [
            { label: "Initial area", value: `${formatNumber(initial, 1)} cm²` },
            { label: "Current area", value: `${formatNumber(current, 1)} cm²` },
            { label: "Area reduced", value: `${formatNumber(reduction, 1)} cm² (${formatNumber(percentReduction, 1)}%)` },
            { label: "Weekly reduction rate", value: `${formatNumber(weeklyRate, 2)} cm²/week` },
            { label: "Estimated time to closure", value: weeksToClose },
            { label: "Healing assessment", value: progressAssessment },
          ],
          note: "Evidence suggests wounds that reduce by 20-40% in area within 2 weeks are likely to heal with current treatment. Wounds not showing adequate progress at 2-4 weeks should be reassessed for underlying causes and treatment changes.",
        };
      },
    },
  ],
  relatedSlugs: ["pain-scale-calculator", "body-surface-area-calculator"],
  faq: [
    {
      question: "How do you measure wound size?",
      answer:
        "Measure length as the longest dimension in a head-to-toe orientation, width perpendicular to length, and depth at the deepest point using a sterile probe. Document undermining and tunneling separately with clock positions.",
    },
    {
      question: "What is a normal wound healing rate?",
      answer:
        "A wound that decreases in area by 20-40% within 2 weeks is generally expected to heal. Acute wounds typically close within 2-4 weeks. Chronic wounds (> 4-6 weeks) require specialized assessment.",
    },
    {
      question: "Why is wound measurement important?",
      answer:
        "Consistent wound measurement is essential for tracking healing progress, determining treatment effectiveness, justifying treatment changes, clinical documentation, and insurance/reimbursement requirements.",
    },
  ],
  formula:
    "Rectangular area = L x W | Elliptical area = pi x (L/2) x (W/2) | Volume = L x W x D | Percent reduction = ((Initial - Current) / Initial) x 100 | Weekly rate = Total reduction / Weeks",
};
