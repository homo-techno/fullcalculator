import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const scrapbookPageLayoutCalculator: CalculatorDefinition = {
  slug: "scrapbook-page-layout-calculator",
  title: "Scrapbook Page Layout Calculator",
  description: "Plan scrapbook page layouts by calculating photo sizes, spacing, and number of photos that fit on a page.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["scrapbook layout","photo page planner","scrapbook design","photo layout"],
  variants: [{
    id: "standard",
    name: "Scrapbook Page Layout",
    description: "Plan scrapbook page layouts by calculating photo sizes, spacing, and number of photos that fit on a page.",
    fields: [
      { name: "pageSize", label: "Page Size", type: "select", options: [{ value: "8.5", label: "8.5 x 8.5 inches" }, { value: "12", label: "12 x 12 inches" }, { value: "6", label: "6 x 8 inches" }], defaultValue: "12" },
      { name: "photoWidth", label: "Photo Width (inches)", type: "number", min: 1, max: 10, defaultValue: 4 },
      { name: "photoHeight", label: "Photo Height (inches)", type: "number", min: 1, max: 10, defaultValue: 3 },
      { name: "spacing", label: "Spacing Between Photos (inches)", type: "number", min: 0.1, max: 2, defaultValue: 0.5 },
      { name: "margin", label: "Page Margin (inches)", type: "number", min: 0.25, max: 2, defaultValue: 0.75 },
    ],
    calculate: (inputs) => {
    const pageW = parseFloat(inputs.pageSize as string);
    const pageH = pageW === 6 ? 8 : pageW;
    const photoW = inputs.photoWidth as number;
    const photoH = inputs.photoHeight as number;
    const spacing = inputs.spacing as number;
    const margin = inputs.margin as number;
    const usableW = pageW - margin * 2;
    const usableH = pageH - margin * 2;
    const photosAcross = Math.floor((usableW + spacing) / (photoW + spacing));
    const photosDown = Math.floor((usableH + spacing) / (photoH + spacing));
    const totalPhotos = photosAcross * photosDown;
    const usedW = photosAcross * photoW + (photosAcross - 1) * spacing;
    const usedH = photosDown * photoH + (photosDown - 1) * spacing;
    const remainW = Math.round((usableW - usedW) * 100) / 100;
    const remainH = Math.round((usableH - usedH) * 100) / 100;
    return {
      primary: { label: "Photos Per Page", value: formatNumber(totalPhotos) },
      details: [
        { label: "Grid Layout", value: formatNumber(photosAcross) + " x " + formatNumber(photosDown) },
        { label: "Usable Area", value: formatNumber(Math.round(usableW * 10) / 10) + " x " + formatNumber(Math.round(usableH * 10) / 10) + " in" },
        { label: "Remaining Width", value: formatNumber(remainW) + " in" },
        { label: "Remaining Height", value: formatNumber(remainH) + " in" }
      ]
    };
  },
  }],
  relatedSlugs: ["card-making-supplies-calculator","cross-stitch-fabric-calculator"],
  faq: [
    { question: "What is the standard scrapbook page size?", answer: "The most common scrapbook page size is 12 x 12 inches. Other popular sizes include 8.5 x 8.5 and 6 x 8 inches for mini albums." },
    { question: "How many photos should I put on a scrapbook page?", answer: "A well-balanced 12 x 12 page typically has 2 to 5 photos. Too many photos can look cluttered. Leave space for journaling and embellishments." },
    { question: "What size should I print scrapbook photos?", answer: "Common print sizes for scrapbooking are 4 x 6, 3 x 4, and 2 x 3 inches. Mix sizes for visual interest." },
  ],
  formula: "Photos Across = floor((Usable Width + Spacing) / (Photo Width + Spacing))
Photos Down = floor((Usable Height + Spacing) / (Photo Height + Spacing))
Total Photos = Photos Across x Photos Down",
};
