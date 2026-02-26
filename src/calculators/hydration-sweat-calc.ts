import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const hydrationSweatCalculator: CalculatorDefinition = {
  slug: "hydration-sweat-calculator",
  title: "Sweat Rate & Hydration Calculator",
  description: "Free sweat rate and hydration needs calculator. Determine your fluid loss during exercise and calculate optimal hydration strategies for peak performance.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["sweat rate calculator", "hydration calculator", "fluid loss", "dehydration calculator", "sports hydration"],
  variants: [
    {
      id: "sweat-rate",
      name: "Sweat Rate Calculator",
      description: "Calculate your sweat rate from before/after exercise weights",
      fields: [
        { name: "preWeight", label: "Pre-Exercise Weight (lbs)", type: "number", placeholder: "e.g. 170" },
        { name: "postWeight", label: "Post-Exercise Weight (lbs)", type: "number", placeholder: "e.g. 168" },
        { name: "fluidConsumed", label: "Fluid Consumed During (oz)", type: "number", placeholder: "e.g. 16", defaultValue: 0 },
        { name: "duration", label: "Exercise Duration (minutes)", type: "number", placeholder: "e.g. 60" },
      ],
      calculate: (inputs) => {
        const pre = parseFloat(inputs.preWeight as string);
        const post = parseFloat(inputs.postWeight as string);
        const fluid = parseFloat(inputs.fluidConsumed as string);
        const dur = parseFloat(inputs.duration as string);
        if (isNaN(pre) || isNaN(post) || isNaN(fluid) || isNaN(dur) || dur <= 0) return null;

        const weightLossLbs = pre - post;
        const weightLossOz = weightLossLbs * 16;
        const totalFluidLoss = weightLossOz + fluid;
        const sweatRatePerHour = (totalFluidLoss / dur) * 60;
        const dehydrationPct = (weightLossLbs / pre) * 100;

        let hydrationStatus = "Well Hydrated";
        if (dehydrationPct > 3) hydrationStatus = "Severely Dehydrated";
        else if (dehydrationPct > 2) hydrationStatus = "Significantly Dehydrated";
        else if (dehydrationPct > 1) hydrationStatus = "Mildly Dehydrated";

        const recommendedPerHour = sweatRatePerHour * 0.8;
        const sodiumPerHour = sweatRatePerHour > 32 ? "500-1000 mg" : "300-500 mg";

        return {
          primary: { label: "Sweat Rate", value: `${formatNumber(sweatRatePerHour, 1)} oz/hr` },
          details: [
            { label: "Total Fluid Lost", value: `${formatNumber(totalFluidLoss, 1)} oz` },
            { label: "Weight Lost", value: `${formatNumber(weightLossLbs, 2)} lbs` },
            { label: "Dehydration Level", value: `${formatNumber(dehydrationPct, 1)}%` },
            { label: "Hydration Status", value: hydrationStatus },
            { label: "Recommended Intake", value: `${formatNumber(recommendedPerHour, 0)} oz/hr` },
            { label: "Sodium Needs", value: sodiumPerHour },
            { label: "Recovery Fluid", value: `${formatNumber(totalFluidLoss * 1.5, 0)} oz over 2-4 hrs` },
          ],
          note: dehydrationPct > 2 ? "Dehydration above 2% significantly impairs performance. Increase fluid intake during exercise." : undefined,
        };
      },
    },
    {
      id: "daily-hydration",
      name: "Daily Hydration Needs",
      description: "Calculate your daily water intake based on activity and conditions",
      fields: [
        { name: "weight", label: "Body Weight (lbs)", type: "number", placeholder: "e.g. 170" },
        { name: "activityLevel", label: "Activity Level", type: "select", options: [
          { label: "Sedentary", value: "sedentary" },
          { label: "Light Activity", value: "light" },
          { label: "Moderate Exercise (30-60 min)", value: "moderate" },
          { label: "Heavy Exercise (60+ min)", value: "heavy" },
          { label: "Extreme (2+ hrs intense)", value: "extreme" },
        ] },
        { name: "climate", label: "Climate / Environment", type: "select", options: [
          { label: "Cool / Indoor", value: "cool" },
          { label: "Moderate", value: "moderate" },
          { label: "Hot / Humid", value: "hot" },
          { label: "High Altitude", value: "altitude" },
        ], defaultValue: "moderate" },
      ],
      calculate: (inputs) => {
        const weight = parseFloat(inputs.weight as string);
        const activity = inputs.activityLevel as string;
        const climate = inputs.climate as string;
        if (isNaN(weight)) return null;

        const baseOz = weight * 0.5;
        const actMult: Record<string, number> = { sedentary: 1.0, light: 1.15, moderate: 1.35, heavy: 1.55, extreme: 1.8 };
        const climMult: Record<string, number> = { cool: 0.95, moderate: 1.0, hot: 1.2, altitude: 1.15 };

        const totalOz = baseOz * (actMult[activity] || 1) * (climMult[climate] || 1);
        const totalCups = totalOz / 8;
        const totalLiters = totalOz * 0.0296;

        return {
          primary: { label: "Daily Water Intake", value: `${formatNumber(totalOz, 0)} oz` },
          details: [
            { label: "In Cups", value: formatNumber(totalCups, 1) },
            { label: "In Liters", value: formatNumber(totalLiters, 1) },
            { label: "Base Need (0.5 oz/lb)", value: `${formatNumber(baseOz, 0)} oz` },
            { label: "Activity Multiplier", value: `${formatNumber((actMult[activity] || 1) * 100, 0)}%` },
            { label: "Climate Multiplier", value: `${formatNumber((climMult[climate] || 1) * 100, 0)}%` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["water-intake-calculator", "calorie-calculator", "muscle-recovery-calculator"],
  faq: [
    { question: "How do I measure my sweat rate?", answer: "Weigh yourself nude before exercise, track all fluids consumed during exercise, then weigh yourself nude after. The weight difference (converted to ounces: 1 lb = 16 oz) plus fluids consumed equals total sweat loss." },
    { question: "How much should I drink during exercise?", answer: "Aim to replace about 80% of your sweat losses during exercise. For most people this is 16-32 oz per hour. Drinking too much can cause hyponatremia, which is dangerous. Use your sweat rate to personalize." },
    { question: "Do I need electrolytes?", answer: "For exercise over 60 minutes or in hot conditions, yes. Sodium is the primary electrolyte lost in sweat (300-1000+ mg/hour). Sports drinks or electrolyte tablets help maintain fluid balance and performance." },
  ],
  formula: "Sweat Rate = ((Pre-Weight - Post-Weight) x 16 + Fluid Consumed) / Duration x 60 | Daily Water ≈ Body Weight (lbs) x 0.5 oz x Activity x Climate",
};
