import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const aiImageGenerationCost: CalculatorDefinition = {
  slug: "ai-image-generation-cost",
  title: "AI Image Generation Cost Calculator",
  description:
    "Calculate monthly costs for DALL-E, Midjourney, Stable Diffusion, and other AI image generators. Compare pricing by resolution and upscaling.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "image generation cost calculator",
    "DALL-E pricing",
    "Midjourney cost",
    "Stable Diffusion pricing",
    "AI art generation budget",
  ],
  variants: [
    {
      id: "estimate",
      name: "Calculate Costs",
      description: "Estimate monthly image generation costs",
      fields: [
        {
          name: "service",
          label: "AI Image Service",
          type: "select",
          options: [
            { label: "DALL-E 3 (OpenAI)", value: "dalle3" },
            { label: "DALL-E 2 (OpenAI)", value: "dalle2" },
            { label: "Midjourney (Standard)", value: "midjourney" },
            { label: "Stable Diffusion (API)", value: "stablediff" },
            { label: "Adobe Firefly", value: "firefly" },
          ],
          defaultValue: "dalle3",
        },
        {
          name: "images",
          label: "Images Per Month",
          type: "number",
          placeholder: "e.g. 100",
          suffix: "images",
        },
        {
          name: "resolution",
          label: "Image Resolution",
          type: "select",
          options: [
            { label: "256×256 (Low)", value: "low" },
            { label: "512×512 (Medium)", value: "medium" },
            { label: "1024×1024 (High)", value: "high" },
            { label: "1024×1792 (Ultra)", value: "ultra" },
          ],
          defaultValue: "medium",
        },
        {
          name: "upscales",
          label: "Upscales Per Month",
          type: "number",
          placeholder: "e.g. 20",
          suffix: "upscales",
        },
      ],
      calculate: (inputs) => {
        const service = inputs.service as string;
        const images = parseFloat(inputs.images as string) || 0;
        const resolution = inputs.resolution as string;
        const upscales = parseFloat(inputs.upscales as string) || 0;

        let imageCost = 0;
        let upscaleCost = 0;
        let serviceName = "";

        if (service === "dalle3") {
          serviceName = "DALL-E 3";
          imageCost = resolution === "ultra" ? 0.08 : resolution === "high" ? 0.04 : resolution === "medium" ? 0.04 : 0.04;
          upscaleCost = 0.02;
        } else if (service === "dalle2") {
          serviceName = "DALL-E 2";
          imageCost = resolution === "high" ? 0.02 : resolution === "medium" ? 0.018 : 0.016;
          upscaleCost = 0.016;
        } else if (service === "midjourney") {
          serviceName = "Midjourney";
          imageCost = 0.20; // Approximate per image from subscription
          upscaleCost = 0.05;
        } else if (service === "stablediff") {
          serviceName = "Stable Diffusion";
          imageCost = 0.001; // Much cheaper
          upscaleCost = 0.0005;
        } else if (service === "firefly") {
          serviceName = "Adobe Firefly";
          imageCost = 0.008;
          upscaleCost = 0.002;
        }

        const imagesTotalCost = images * imageCost;
        const upscalesTotalCost = upscales * upscaleCost;
        const totalCost = imagesTotalCost + upscalesTotalCost;

        return {
          primary: { label: "Monthly Cost", value: `$${formatNumber(totalCost, 2)}` },
          details: [
            { label: "Service", value: serviceName },
            { label: "Images generated", value: formatNumber(images) },
            { label: "Cost per image", value: `$${formatNumber(imageCost, 4)}` },
            { label: "Image generation cost", value: `$${formatNumber(imagesTotalCost, 2)}` },
            { label: "Upscales", value: formatNumber(upscales) },
            { label: "Upscaling cost", value: `$${formatNumber(upscalesTotalCost, 2)}` },
            { label: "Total monthly", value: `$${formatNumber(totalCost, 2)}` },
            { label: "Annual projection", value: `$${formatNumber(totalCost * 12, 2)}` },
          ],
          note: "Prices approximate as of March 2026. Actual costs vary by service tier and promotional pricing.",
        };
      },
    },
    {
      id: "compare",
      name: "Compare Services",
      description: "Compare costs across image generation platforms",
      fields: [
        {
          name: "images",
          label: "Images Per Month",
          type: "number",
          placeholder: "e.g. 100",
          suffix: "images",
        },
      ],
      calculate: (inputs) => {
        const images = parseFloat(inputs.images as string) || 0;

        const services = [
          { name: "DALL-E 3", costPerImage: 0.04, upscaleCost: 0.02 },
          { name: "DALL-E 2", costPerImage: 0.018, upscaleCost: 0.016 },
          { name: "Midjourney", costPerImage: 0.20, upscaleCost: 0.05 },
          { name: "Stable Diffusion", costPerImage: 0.001, upscaleCost: 0.0005 },
          { name: "Adobe Firefly", costPerImage: 0.008, upscaleCost: 0.002 },
        ];

        let details: { label: string; value: string }[] = [];
        let cheapest = { name: "", cost: Infinity };
        let mostExpensive = { name: "", cost: 0 };

        services.forEach((s) => {
          const cost = images * s.costPerImage;
          details.push({ label: s.name, value: `$${formatNumber(cost, 2)}/mo` });
          if (cost < cheapest.cost) {
            cheapest = { name: s.name, cost };
          }
          if (cost > mostExpensive.cost) {
            mostExpensive = { name: s.name, cost };
          }
        });

        const savings = mostExpensive.cost - cheapest.cost;

        return {
          primary: {
            label: "Cheapest Option",
            value: `${cheapest.name} ($${formatNumber(cheapest.cost, 2)}/mo)`
          },
          details: [
            ...details,
            { label: "Savings opportunity", value: `$${formatNumber(savings, 2)}/mo` },
          ],
          note: "Prices vary by resolution and quality. Midjourney includes subscription model alternatives.",
        };
      },
    },
  ],
  relatedSlugs: ["llm-api-cost-calculator", "gpu-rental-cost-calculator"],
  faq: [
    {
      question: "Which AI image generator is cheapest?",
      answer:
        "Stable Diffusion API is cheapest (~$0.001 per image). However, quality varies. DALL-E and Midjourney offer better quality at higher cost. For free options, consider local models like Stable Diffusion self-hosted.",
    },
    {
      question: "What affects image generation cost?",
      answer:
        "Resolution, inference time, and API provider all impact cost. Higher resolutions cost more. Some providers charge per-second for generation. Upscaling and editing typically cost extra.",
    },
    {
      question: "Can I reduce image generation costs?",
      answer:
        "Yes: batch generation during off-peak hours, use lower resolutions where possible, leverage free tier limits, or self-host open-source models like Stable Diffusion locally.",
    },
  ],
  formula: "Total Cost = (Images × Cost Per Image) + (Upscales × Upscale Cost)",
};
