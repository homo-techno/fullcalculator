import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const woodBendingCalculator: CalculatorDefinition = {
  slug: "wood-bending-calculator",
  title: "Steam Bending Radius Calculator",
  description: "Free steam bending radius calculator. Determine minimum bending radius, steaming time, and spring-back for steam-bent wood.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["steam bending calculator", "wood bending radius", "minimum bend radius", "steaming time calculator", "bent wood calculator"],
  variants: [
    {
      id: "steam-bending",
      name: "Steam Bending Parameters",
      description: "Calculate steaming time and minimum radius for steam bending",
      fields: [
        { name: "thickness", label: "Wood Thickness (inches)", type: "number", placeholder: "e.g. 0.75" },
        { name: "desiredRadius", label: "Desired Inside Radius (inches)", type: "number", placeholder: "e.g. 12" },
        {
          name: "species",
          label: "Wood Species",
          type: "select",
          options: [
            { label: "White Oak (excellent bending)", value: "8" },
            { label: "Red Oak (good bending)", value: "10" },
            { label: "Ash (good bending)", value: "10" },
            { label: "Walnut (moderate bending)", value: "14" },
            { label: "Cherry (moderate bending)", value: "14" },
            { label: "Maple (moderate bending)", value: "12" },
            { label: "Pine (poor bending)", value: "20" },
          ],
        },
        {
          name: "grainType",
          label: "Grain Type",
          type: "select",
          options: [
            { label: "Straight grain (best)", value: "1.0" },
            { label: "Slightly irregular", value: "1.3" },
            { label: "Irregular grain", value: "1.6" },
          ],
        },
      ],
      calculate: (inputs) => {
        const thickness = inputs.thickness as number;
        const desiredRadius = inputs.desiredRadius as number;
        const minRadiusFactor = parseFloat(inputs.species as string);
        const grainFactor = parseFloat(inputs.grainType as string);
        if (!thickness || !desiredRadius) return null;
        const minRadius = thickness * minRadiusFactor * grainFactor;
        const steamTime = thickness * 60;
        const springBack = 15;
        const formRadius = desiredRadius * (1 - springBack / 100);
        const bendable = desiredRadius >= minRadius;
        const arcLength = desiredRadius > 0 ? (Math.PI * desiredRadius) : 0;
        const outerRadius = desiredRadius + thickness;
        const compressionRatio = desiredRadius > 0 ? thickness / (2 * desiredRadius + thickness) * 100 : 0;
        return {
          primary: { label: "Minimum Bend Radius", value: `${formatNumber(minRadius, 1)} inches` },
          details: [
            { label: "Desired Radius", value: `${formatNumber(desiredRadius, 1)} inches` },
            { label: "Feasible", value: bendable ? "Yes" : "No - radius too tight" },
            { label: "Steam Time", value: `${formatNumber(steamTime, 0)} minutes` },
            { label: "Form Radius (with spring-back)", value: `${formatNumber(formRadius, 1)} inches` },
            { label: "Expected Spring-Back", value: `${formatNumber(springBack, 0)}%` },
            { label: "Outer Radius", value: `${formatNumber(outerRadius, 2)} inches` },
            { label: "Compression Ratio", value: `${formatNumber(compressionRatio, 1)}%` },
            { label: "Half-Circle Arc Length", value: `${formatNumber(arcLength, 1)} inches` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["wood-moisture-calculator", "wood-density-calculator", "wood-shrinkage-calculator"],
  faq: [
    { question: "How long should I steam wood?", answer: "The general rule is one hour of steaming per inch of thickness. For example, 3/4 inch stock needs about 45 minutes of steaming at 212 degrees F." },
    { question: "What is spring-back in steam bending?", answer: "Spring-back is the tendency of bent wood to partially straighten after it is removed from the form. Plan for about 10-20% spring-back by making the form radius tighter than desired." },
  ],
  formula: "Min Radius = Thickness x Species Factor x Grain Factor | Steam Time = Thickness x 60 min | Form Radius = Desired x (1 - SpringBack%)",
};
