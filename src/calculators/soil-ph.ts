import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const soilPhCalculator: CalculatorDefinition = {
  slug: "soil-ph-calculator",
  title: "Soil pH Calculator",
  description: "Free soil pH calculator. Check if your soil pH is optimal for your plants and get amendment recommendations.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["soil ph calculator", "soil acidity", "garden soil pH", "soil pH for plants", "soil amendment calculator"],
  variants: [
    {
      id: "calc",
      name: "Check Soil pH",
      fields: [
        { name: "ph", label: "Measured Soil pH", type: "number", placeholder: "e.g. 6.5", min: 0, max: 14, step: 0.1 },
        { name: "plantType", label: "Plant Type", type: "select", options: [
          { label: "Vegetables (tomatoes, peppers, etc.)", value: "vegetables" },
          { label: "Berries (blueberries, strawberries)", value: "berries" },
          { label: "Lawn / Turf Grass", value: "lawn" },
          { label: "Azaleas / Rhododendrons", value: "azaleas" },
          { label: "Roses", value: "roses" },
        ], defaultValue: "vegetables" },
      ],
      calculate: (inputs) => {
        const ph = inputs.ph as number;
        const plantType = inputs.plantType as string;
        if (ph === undefined || ph === null) return null;

        // Optimal pH ranges
        const ranges: Record<string, { min: number; max: number; name: string }> = {
          vegetables: { min: 6.0, max: 7.0, name: "Vegetables" },
          berries: { min: 4.5, max: 5.5, name: "Berries (blueberries)" },
          lawn: { min: 6.0, max: 7.0, name: "Lawn / Turf Grass" },
          azaleas: { min: 4.5, max: 5.5, name: "Azaleas / Rhododendrons" },
          roses: { min: 6.0, max: 6.5, name: "Roses" },
        };

        const range = ranges[plantType] || ranges.vegetables;
        const isOptimal = ph >= range.min && ph <= range.max;
        const tooAcidic = ph < range.min;
        const tooAlkaline = ph > range.max;

        let status: string;
        let amendment: string;
        if (isOptimal) {
          status = "Optimal — no adjustment needed";
          amendment = "None needed. Maintain with regular composting and mulching.";
        } else if (tooAcidic) {
          const diff = range.min - ph;
          status = `Too acidic (need to raise pH by ~${formatNumber(diff, 1)})`;
          if (diff > 1) {
            amendment = "Apply agricultural lime (calcium carbonate) at 5–10 lbs per 100 sq ft. Retest in 3 months. Consider dolomitic lime if magnesium is also low.";
          } else {
            amendment = "Apply agricultural lime at 2–5 lbs per 100 sq ft, or use wood ash (1–2 lbs per 100 sq ft). Retest in 3 months.";
          }
        } else {
          const diff = ph - range.max;
          status = `Too alkaline (need to lower pH by ~${formatNumber(diff, 1)})`;
          if (diff > 1) {
            amendment = "Apply elemental sulfur at 1–2 lbs per 100 sq ft. Work into soil. This is a slow process — retest in 6 months. Add acidic organic matter (peat moss, pine needles).";
          } else {
            amendment = "Apply elemental sulfur at 0.5–1 lb per 100 sq ft, or use acidifying fertilizer (ammonium sulfate). Add coffee grounds or pine needles as mulch.";
          }
        }

        // General soil classification
        let soilClass: string;
        if (ph < 4.5) soilClass = "Extremely acidic";
        else if (ph < 5.5) soilClass = "Strongly acidic";
        else if (ph < 6.0) soilClass = "Moderately acidic";
        else if (ph < 6.5) soilClass = "Slightly acidic";
        else if (ph < 7.0) soilClass = "Neutral to slightly acidic";
        else if (ph === 7.0) soilClass = "Neutral";
        else if (ph < 7.5) soilClass = "Slightly alkaline";
        else if (ph < 8.0) soilClass = "Moderately alkaline";
        else soilClass = "Strongly alkaline";

        return {
          primary: { label: "Soil pH Assessment", value: isOptimal ? "Optimal" : tooAcidic ? "Too Acidic" : "Too Alkaline" },
          details: [
            { label: "Your Soil pH", value: formatNumber(ph, 1) },
            { label: "Soil Classification", value: soilClass },
            { label: "Plant Type", value: range.name },
            { label: "Optimal Range", value: `${range.min}–${range.max}` },
            { label: "Status", value: status },
            { label: "Recommended Amendment", value: amendment },
          ],
          note: "Soil pH changes slowly. Apply amendments gradually and retest after 2–3 months. pH varies by soil type — clay soils require more amendment than sandy soils.",
        };
      },
    },
  ],
  relatedSlugs: ["water-hardness-calculator", "pool-salt-calculator", "ph-calculator"],
  faq: [
    { question: "Why does soil pH matter?", answer: "Soil pH affects nutrient availability. Most nutrients are most available at pH 6.0–7.0. Very acidic or alkaline soil locks up essential nutrients, causing deficiencies even when nutrients are present in the soil." },
    { question: "How do I test my soil pH?", answer: "Use a home soil pH test kit, a digital pH meter, or send a sample to your local agricultural extension office for professional testing. Test multiple spots in your garden for an accurate picture." },
    { question: "How long does it take to change soil pH?", answer: "Lime (to raise pH) takes 2–3 months to fully react. Sulfur (to lower pH) can take 3–6 months. Apply in fall for spring planting. Organic amendments work more slowly but improve soil structure too." },
  ],
  formula: "Vegetables: pH 6.0–7.0 | Berries: 4.5–5.5 | Lawn: 6.0–7.0 | Azaleas: 4.5–5.5 | Roses: 6.0–6.5",
};
