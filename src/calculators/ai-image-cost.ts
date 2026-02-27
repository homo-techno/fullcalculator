import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const aiImageCostCalculator: CalculatorDefinition = {
  slug: "ai-image-cost",
  title: "AI Image Generation Cost Calculator",
  description:
    "Calculate the cost of generating images with AI tools like DALL-E, Midjourney, and Stable Diffusion based on volume and quality settings.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "ai image cost",
    "dall-e pricing",
    "midjourney cost",
    "stable diffusion cost",
    "ai art cost",
    "image generation pricing",
    "ai artwork budget",
  ],
  variants: [
    {
      slug: "ai-image-cost",
      title: "AI Image Generation Cost Calculator",
      description:
        "Estimate the cost of generating AI images across popular platforms.",
      fields: [
        {
          id: "platform",
          label: "AI Image Platform",
          type: "select",
          options: [
            { label: "DALL-E 3 (Standard)", value: "dalle3_standard" },
            { label: "DALL-E 3 (HD)", value: "dalle3_hd" },
            { label: "Midjourney (Basic Plan)", value: "midjourney_basic" },
            { label: "Midjourney (Standard Plan)", value: "midjourney_standard" },
            { label: "Midjourney (Pro Plan)", value: "midjourney_pro" },
            { label: "Stable Diffusion (API)", value: "sd_api" },
          ],
          defaultValue: "dalle3_standard",
        },
        {
          id: "resolution",
          label: "Resolution",
          type: "select",
          options: [
            { label: "1024x1024", value: "1024" },
            { label: "1024x1792 / 1792x1024", value: "1792" },
            { label: "512x512", value: "512" },
          ],
          defaultValue: "1024",
        },
        {
          id: "imagesPerDay",
          label: "Images per Day",
          type: "number",
          defaultValue: 50,
        },
        {
          id: "daysPerMonth",
          label: "Days per Month",
          type: "number",
          defaultValue: 30,
        },
      ],
      calculate(inputs) {
        const platform = inputs.platform as string;
        const resolution = inputs.resolution as string;
        const imagesPerDay = parseFloat(inputs.imagesPerDay as string);
        const daysPerMonth = parseFloat(inputs.daysPerMonth as string);

        // Cost per image
        const pricing: Record<string, Record<string, number>> = {
          dalle3_standard: { "512": 0.04, "1024": 0.04, "1792": 0.08 },
          dalle3_hd: { "512": 0.08, "1024": 0.08, "1792": 0.12 },
          midjourney_basic: { "512": 0.033, "1024": 0.033, "1792": 0.033 },
          midjourney_standard: { "512": 0.02, "1024": 0.02, "1792": 0.02 },
          midjourney_pro: { "512": 0.013, "1024": 0.013, "1792": 0.013 },
          sd_api: { "512": 0.002, "1024": 0.006, "1792": 0.012 },
        };

        const costPerImage =
          pricing[platform]?.[resolution] ??
          pricing["dalle3_standard"]["1024"];

        const totalImages = imagesPerDay * daysPerMonth;
        const monthlyCost = totalImages * costPerImage;
        const annualCost = monthlyCost * 12;

        return {
          "Cost per Image": "$" + formatNumber(costPerImage),
          "Images per Month": formatNumber(totalImages),
          "Monthly Cost": "$" + formatNumber(monthlyCost),
          "Annual Cost": "$" + formatNumber(annualCost),
          "Cost per 100 Images": "$" + formatNumber(costPerImage * 100),
          "Daily Cost": "$" + formatNumber(imagesPerDay * costPerImage),
        };
      },
    },
    {
      slug: "ai-image-cost-comparison",
      title: "AI Image Platform Cost Comparison",
      description:
        "Compare costs across AI image generation platforms for a given volume.",
      fields: [
        {
          id: "monthlyImages",
          label: "Monthly Image Volume",
          type: "number",
          defaultValue: 1000,
        },
        {
          id: "resolution",
          label: "Resolution",
          type: "select",
          options: [
            { label: "1024x1024", value: "1024" },
            { label: "1792x1024 (Large)", value: "1792" },
          ],
          defaultValue: "1024",
        },
      ],
      calculate(inputs) {
        const monthlyImages = parseFloat(inputs.monthlyImages as string);
        const resolution = inputs.resolution as string;

        const rates: Record<string, Record<string, number>> = {
          "DALL-E 3 Standard": { "1024": 0.04, "1792": 0.08 },
          "DALL-E 3 HD": { "1024": 0.08, "1792": 0.12 },
          "Midjourney Standard": { "1024": 0.02, "1792": 0.02 },
          "Midjourney Pro": { "1024": 0.013, "1792": 0.013 },
          "Stable Diffusion API": { "1024": 0.006, "1792": 0.012 },
        };

        const results: Record<string, string> = {};
        for (const [name, resolutions] of Object.entries(rates)) {
          const cost = (resolutions[resolution] ?? 0.04) * monthlyImages;
          results[name] = "$" + formatNumber(cost);
        }
        results["Monthly Volume"] = formatNumber(monthlyImages) + " images";

        return results;
      },
    },
  ],
  relatedSlugs: [
    "ai-api-cost",
    "llm-token-calculator",
    "ai-training-cost",
    "cloud-hosting-cost",
  ],
  faq: [
    {
      question: "Which AI image generator is cheapest?",
      answer:
        "Stable Diffusion API is typically the cheapest per image, especially at lower resolutions. However, if you self-host Stable Diffusion, costs depend on your GPU hardware. Midjourney Pro offers good value for high-volume users with its subscription model.",
    },
    {
      question: "Does image resolution affect cost?",
      answer:
        "Yes, higher resolutions cost more for most platforms. DALL-E charges more for larger images (1792px vs 1024px). Stable Diffusion API costs also scale with resolution. Midjourney subscriptions include all resolutions at the same price per image.",
    },
  ],
  formula:
    "Monthly Cost = Images per Day x Days per Month x Cost per Image. Cost per image varies by platform, model quality, and resolution settings.",
};
