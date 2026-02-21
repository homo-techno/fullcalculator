import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const watchSizeCalculator: CalculatorDefinition = {
  slug: "watch-size-calculator",
  title: "Watch Size Calculator",
  description: "Free watch size calculator. Find the ideal watch case diameter and strap size based on your wrist circumference.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["watch size calculator", "watch size for wrist", "watch case size guide", "watch strap size", "wrist size for watch"],
  variants: [
    {
      id: "wrist-measurement",
      name: "From Wrist Circumference",
      description: "Find your ideal watch size based on wrist measurement",
      fields: [
        { name: "wristCirc", label: "Wrist Circumference", type: "number", placeholder: "e.g. 7", suffix: "in", step: 0.25 },
        { name: "unit", label: "Unit", type: "select", options: [
          { label: "Inches", value: "in" },
          { label: "Centimeters", value: "cm" },
        ], defaultValue: "in" },
        { name: "style", label: "Watch Style Preference", type: "select", options: [
          { label: "Dress / minimalist", value: "dress" },
          { label: "Everyday / casual", value: "casual" },
          { label: "Sport / diver", value: "sport" },
          { label: "Oversized / statement", value: "oversized" },
        ], defaultValue: "casual" },
        { name: "gender", label: "Category", type: "select", options: [
          { label: "Men's watches", value: "mens" },
          { label: "Women's watches", value: "womens" },
          { label: "Unisex", value: "unisex" },
        ], defaultValue: "mens" },
      ],
      calculate: (inputs) => {
        let wristCirc = inputs.wristCirc as number;
        const unit = inputs.unit as string;
        const style = inputs.style as string;
        const gender = inputs.gender as string;
        if (!wristCirc) return null;

        if (unit === "cm") wristCirc = wristCirc / 2.54;
        const wristCm = wristCirc * 2.54;

        // Calculate wrist width (approximate flat width for lug-to-lug)
        const wristWidth = wristCirc / Math.PI;
        const wristWidthMm = wristWidth * 25.4;

        // Ideal case diameter: should not exceed wrist width
        // General rule: case diameter should be 65-75% of wrist width for proportional look
        let idealMinMm: number;
        let idealMaxMm: number;

        if (gender === "womens") {
          if (wristCm < 14) { idealMinMm = 26; idealMaxMm = 32; }
          else if (wristCm < 16) { idealMinMm = 28; idealMaxMm = 34; }
          else if (wristCm < 17) { idealMinMm = 30; idealMaxMm = 36; }
          else { idealMinMm = 34; idealMaxMm = 40; }
        } else {
          if (wristCm < 16) { idealMinMm = 34; idealMaxMm = 38; }
          else if (wristCm < 17) { idealMinMm = 36; idealMaxMm = 40; }
          else if (wristCm < 18) { idealMinMm = 38; idealMaxMm = 42; }
          else if (wristCm < 19.5) { idealMinMm = 40; idealMaxMm = 44; }
          else { idealMinMm = 42; idealMaxMm = 46; }
        }

        // Style adjustment
        if (style === "dress") { idealMinMm -= 2; idealMaxMm -= 2; }
        else if (style === "sport") { idealMinMm += 2; idealMaxMm += 2; }
        else if (style === "oversized") { idealMinMm += 4; idealMaxMm += 4; }

        // Strap/band width (typically 50-60% of case diameter)
        const avgCase = (idealMinMm + idealMaxMm) / 2;
        const strapWidth = Math.round(avgCase * 0.55 / 2) * 2; // round to nearest even mm

        // Strap length
        let strapLength: string;
        if (wristCm < 15.5) strapLength = "Short (110/65 mm)";
        else if (wristCm < 18) strapLength = "Regular (120/70 mm)";
        else if (wristCm < 20) strapLength = "Long (130/80 mm)";
        else strapLength = "Extra Long (140/85 mm)";

        // Lug-to-lug should not exceed wrist width
        const maxLugToLug = Math.round(wristWidthMm);

        return {
          primary: { label: "Ideal Case Size", value: `${idealMinMm}-${idealMaxMm} mm` },
          details: [
            { label: "Wrist Circumference", value: `${formatNumber(wristCm, 1)} cm (${formatNumber(wristCirc, 1)} in)` },
            { label: "Wrist Width (flat top)", value: `~${formatNumber(wristWidthMm, 0)} mm` },
            { label: "Max Lug-to-Lug", value: `~${maxLugToLug} mm` },
            { label: "Recommended Strap Width", value: `${strapWidth} mm` },
            { label: "Strap Length", value: strapLength },
            { label: "Style", value: style.charAt(0).toUpperCase() + style.slice(1) },
          ],
          note: "The watch case should not overhang the edges of your wrist. Lug-to-lug distance is often more important than case diameter for fit.",
        };
      },
    },
  ],
  relatedSlugs: ["bracelet-size-calculator", "ring-size-calculator", "glasses-size-calculator"],
  faq: [
    { question: "How do I measure my wrist for a watch?", answer: "Wrap a flexible tape measure around your wrist just below the wrist bone (where you would normally wear a watch). Note the circumference in inches or centimeters. If using string, mark and measure with a ruler." },
    { question: "What watch size is right for my wrist?", answer: "For men: 6-7\" wrist suits 38-42mm, 7-7.5\" suits 40-44mm, 7.5\"+ suits 42-46mm. For women: under 6\" suits 26-34mm, 6-7\" suits 28-38mm. The case should not overhang your wrist." },
    { question: "What is lug-to-lug distance and why does it matter?", answer: "Lug-to-lug is the distance from the top to bottom of the case including the lugs (where the strap attaches). This should not exceed your wrist width, or the watch will overhang. It is more important than case diameter for comfort." },
    { question: "How do I know my watch strap size?", answer: "Strap width is measured where the strap meets the case (lug width). Common sizes: 18mm, 20mm, 22mm, 24mm. Check your watch case or measure the gap between the lugs. Strap length depends on wrist circumference." },
  ],
  formula: "Ideal case size based on wrist circumference | Dress: -2mm, Sport: +2mm, Oversized: +4mm | Strap width ≈ 55% of case diameter | Lug-to-lug ≤ wrist width",
};
