import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const perfumeConcentrationCalculator: CalculatorDefinition = {
  slug: "perfume-concentration-calculator",
  title: "Perfume Concentration Calculator",
  description: "Free perfume concentration calculator. Compare fragrance types (Parfum, EDP, EDT, EDC) and estimate longevity and sillage.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["perfume concentration calculator", "EDP vs EDT", "fragrance concentration", "perfume strength", "perfume longevity calculator"],
  variants: [
    {
      id: "fragrance-type",
      name: "Fragrance Type Comparison",
      description: "Compare fragrance concentrations and expected performance",
      fields: [
        { name: "type", label: "Fragrance Type", type: "select", options: [
          { label: "Parfum / Extrait (20-30%)", value: "parfum" },
          { label: "Eau de Parfum / EDP (15-20%)", value: "edp" },
          { label: "Eau de Toilette / EDT (5-15%)", value: "edt" },
          { label: "Eau de Cologne / EDC (2-5%)", value: "edc" },
          { label: "Eau Fraiche (1-3%)", value: "fraiche" },
          { label: "Body Mist (1-2%)", value: "mist" },
        ], defaultValue: "edp" },
        { name: "sprays", label: "Number of Sprays", type: "number", placeholder: "e.g. 4", min: 1, max: 20, defaultValue: 4 },
        { name: "season", label: "Season / Climate", type: "select", options: [
          { label: "Hot / Summer", value: "hot" },
          { label: "Mild / Spring-Fall", value: "mild" },
          { label: "Cold / Winter", value: "cold" },
        ], defaultValue: "mild" },
      ],
      calculate: (inputs) => {
        const type = inputs.type as string;
        const sprays = inputs.sprays as number;
        const season = inputs.season as string;
        if (!sprays) return null;

        const data: Record<string, { concentration: string; longevityHours: [number, number]; sillage: string; priceRange: string; sprayRec: [number, number]; mlPerSpray: number }> = {
          parfum: { concentration: "20-30%", longevityHours: [8, 24], sillage: "Strong", priceRange: "$$$$$", sprayRec: [2, 4], mlPerSpray: 0.1 },
          edp: { concentration: "15-20%", longevityHours: [6, 10], sillage: "Moderate-Strong", priceRange: "$$$$", sprayRec: [3, 5], mlPerSpray: 0.1 },
          edt: { concentration: "5-15%", longevityHours: [3, 6], sillage: "Moderate", priceRange: "$$$", sprayRec: [4, 7], mlPerSpray: 0.1 },
          edc: { concentration: "2-5%", longevityHours: [2, 3], sillage: "Light", priceRange: "$$", sprayRec: [5, 8], mlPerSpray: 0.12 },
          fraiche: { concentration: "1-3%", longevityHours: [1, 2], sillage: "Very Light", priceRange: "$", sprayRec: [5, 10], mlPerSpray: 0.12 },
          mist: { concentration: "1-2%", longevityHours: [1, 2], sillage: "Very Light / Intimate", priceRange: "$", sprayRec: [6, 12], mlPerSpray: 0.15 },
        };

        const info = data[type];
        if (!info) return null;

        // Season adjustment
        let longevityMultiplier = 1;
        let sprayAdjustment = "";
        if (season === "hot") {
          longevityMultiplier = 0.85;
          sprayAdjustment = "Use fewer sprays in heat — fragrance projects more.";
        } else if (season === "cold") {
          longevityMultiplier = 1.15;
          sprayAdjustment = "May need 1-2 extra sprays in cold — fragrance projects less.";
        } else {
          sprayAdjustment = "Moderate weather is ideal for most fragrances.";
        }

        const adjLongevityLow = info.longevityHours[0] * longevityMultiplier;
        const adjLongevityHigh = info.longevityHours[1] * longevityMultiplier;

        // Calculate bottle usage
        const mlUsedPerDay = sprays * info.mlPerSpray;
        const daysFrom50ml = 50 / mlUsedPerDay;
        const daysFrom100ml = 100 / mlUsedPerDay;

        const isOptimalSprays = sprays >= info.sprayRec[0] && sprays <= info.sprayRec[1];

        return {
          primary: { label: "Longevity (adjusted)", value: `${formatNumber(adjLongevityLow, 0)}-${formatNumber(adjLongevityHigh, 0)} hours` },
          details: [
            { label: "Concentration", value: info.concentration },
            { label: "Sillage", value: info.sillage },
            { label: "Recommended Sprays", value: `${info.sprayRec[0]}-${info.sprayRec[1]}` },
            { label: "Your Sprays", value: `${sprays} (${isOptimalSprays ? "Good" : sprays < info.sprayRec[0] ? "May be light" : "May be heavy"})` },
            { label: "Daily Usage", value: `${formatNumber(mlUsedPerDay, 2)} ml/day` },
            { label: "50ml Bottle Lasts", value: `~${formatNumber(daysFrom50ml, 0)} days` },
            { label: "100ml Bottle Lasts", value: `~${formatNumber(daysFrom100ml, 0)} days` },
            { label: "Season Tip", value: sprayAdjustment },
          ],
          note: "Performance varies by skin chemistry, weather, and fragrance composition. Moisturized skin holds fragrance longer.",
        };
      },
    },
  ],
  relatedSlugs: ["skin-type-calculator", "skincare-routine-calculator"],
  faq: [
    { question: "What is the difference between EDP and EDT?", answer: "Eau de Parfum (EDP) has 15-20% fragrance oil concentration and lasts 6-10 hours. Eau de Toilette (EDT) has 5-15% concentration and lasts 3-6 hours. EDP is stronger, more expensive, and requires fewer sprays." },
    { question: "How many sprays of perfume should I use?", answer: "For EDP: 3-5 sprays. For EDT: 4-7 sprays. For Parfum: 2-4 sprays. Apply to pulse points (wrists, neck, behind ears). Less is more in close quarters or hot weather." },
    { question: "How can I make my fragrance last longer?", answer: "Apply to moisturized skin (use unscented lotion first), spray on pulse points, do not rub wrists together (it breaks down molecules), store fragrance away from heat and light, and layer with matching shower gel or lotion." },
    { question: "Why does perfume smell different on different people?", answer: "Body chemistry, skin pH, diet, medications, and skin type all affect how fragrance smells. Oily skin tends to hold fragrance longer than dry skin. Hormones and even stress can alter scent perception." },
  ],
  formula: "Parfum: 20-30% oil, 8-24h | EDP: 15-20%, 6-10h | EDT: 5-15%, 3-6h | EDC: 2-5%, 2-3h | Spray volume ≈ 0.1 ml per spray",
};
