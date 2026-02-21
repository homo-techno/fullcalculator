import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const bannerSizeCalculator: CalculatorDefinition = {
  slug: "banner-size-calculator",
  title: "Banner & Ad Size Calculator",
  description: "Free banner and ad size calculator. Get dimensions for web banners, Google Ads, Facebook Ads, and print banners with pixel and physical measurements.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["banner size calculator", "ad size calculator", "web banner dimensions", "Google Ads size", "display ad size", "leaderboard banner"],
  variants: [
    {
      id: "web",
      name: "Web/Display Ad Sizes",
      description: "Standard IAB web banner and display ad sizes",
      fields: [
        { name: "adSize", label: "Ad Format", type: "select", options: [
          { label: "Leaderboard (728x90)", value: "728x90" },
          { label: "Medium Rectangle (300x250)", value: "300x250" },
          { label: "Large Rectangle (336x280)", value: "336x280" },
          { label: "Wide Skyscraper (160x600)", value: "160x600" },
          { label: "Skyscraper (120x600)", value: "120x600" },
          { label: "Half Page (300x600)", value: "300x600" },
          { label: "Billboard (970x250)", value: "970x250" },
          { label: "Large Leaderboard (970x90)", value: "970x90" },
          { label: "Mobile Banner (320x50)", value: "320x50" },
          { label: "Mobile Large (320x100)", value: "320x100" },
          { label: "Square (250x250)", value: "250x250" },
          { label: "Full Banner (468x60)", value: "468x60" },
        ], defaultValue: "300x250" },
        { name: "retina", label: "Retina/HiDPI", type: "select", options: [
          { label: "1x (standard)", value: "1" },
          { label: "2x (retina)", value: "2" },
          { label: "3x (super retina)", value: "3" },
        ], defaultValue: "1" },
      ],
      calculate: (inputs) => {
        const size = inputs.adSize as string;
        const scale = parseInt(inputs.retina as string) || 1;
        if (!size) return null;

        const [w, h] = size.split("x").map(Number);
        const actualW = w * scale;
        const actualH = h * scale;
        const maxFileKB = w * h < 50000 ? 150 : 200;

        return {
          primary: { label: "Banner Size", value: `${w} x ${h} px` },
          details: [
            { label: "CSS/display size", value: `${w} x ${h} px` },
            { label: "Actual pixel size", value: scale > 1 ? `${actualW} x ${actualH} px (${scale}x)` : `${actualW} x ${actualH} px` },
            { label: "Aspect ratio", value: `${formatNumber(w / h, 2)}:1` },
            { label: "Max file size (Google)", value: `${maxFileKB} KB` },
            { label: "Recommended format", value: "JPEG, PNG, GIF, or HTML5" },
            { label: "Orientation", value: w > h ? "Horizontal" : w < h ? "Vertical" : "Square" },
          ],
          note: "Google Ads max file size is 150 KB for most sizes. Use compressed JPEG for photos, PNG-8 for graphics, or HTML5 for animated ads.",
        };
      },
    },
    {
      id: "social-ads",
      name: "Social Media Ad Sizes",
      description: "Ad sizes for Facebook, Instagram, and other platforms",
      fields: [
        { name: "platform", label: "Platform & Format", type: "select", options: [
          { label: "Facebook Feed Ad (1200x628)", value: "1200x628" },
          { label: "Facebook Carousel (1080x1080)", value: "1080x1080" },
          { label: "Facebook Story Ad (1080x1920)", value: "1080x1920" },
          { label: "Instagram Feed Ad (1080x1080)", value: "1080x1080" },
          { label: "Instagram Story Ad (1080x1920)", value: "1080x1920" },
          { label: "Twitter/X Ad (1200x675)", value: "1200x675" },
          { label: "LinkedIn Sponsored (1200x627)", value: "1200x627" },
          { label: "Pinterest Promoted Pin (1000x1500)", value: "1000x1500" },
          { label: "YouTube Display Ad (300x250)", value: "300x250" },
          { label: "YouTube Overlay (480x70)", value: "480x70" },
        ], defaultValue: "1200x628" },
      ],
      calculate: (inputs) => {
        const size = inputs.platform as string;
        if (!size) return null;

        const [w, h] = size.split("x").map(Number);
        const megapixels = (w * h) / 1000000;

        return {
          primary: { label: "Ad Size", value: `${w} x ${h} px` },
          details: [
            { label: "Width", value: `${w} px` },
            { label: "Height", value: `${h} px` },
            { label: "Aspect ratio", value: `${formatNumber(w / h, 2)}:1` },
            { label: "Megapixels", value: formatNumber(megapixels, 2) },
            { label: "Recommended format", value: "JPEG or PNG" },
            { label: "Text limit", value: "Keep text under 20% of image area" },
          ],
        };
      },
    },
    {
      id: "print-banner",
      name: "Print Banner Size",
      description: "Calculate physical print banner dimensions",
      fields: [
        { name: "bannerType", label: "Banner Type", type: "select", options: [
          { label: "Retractable Banner (33x80 in)", value: "33x80" },
          { label: "Retractable Banner (36x92 in)", value: "36x92" },
          { label: "Table Top (6ft x 30in)", value: "72x30" },
          { label: "Step & Repeat (8x8 ft)", value: "96x96" },
          { label: "Vinyl Banner (3x6 ft)", value: "36x72" },
          { label: "Vinyl Banner (4x8 ft)", value: "48x96" },
          { label: "Yard Sign (18x24 in)", value: "18x24" },
          { label: "Poster (24x36 in)", value: "24x36" },
        ], defaultValue: "33x80" },
        { name: "dpi", label: "Print Resolution", type: "select", options: [
          { label: "72 DPI (large format)", value: "72" },
          { label: "100 DPI (banners)", value: "100" },
          { label: "150 DPI (good quality)", value: "150" },
          { label: "300 DPI (high quality)", value: "300" },
        ], defaultValue: "150" },
      ],
      calculate: (inputs) => {
        const size = inputs.bannerType as string;
        const dpi = parseInt(inputs.dpi as string) || 150;
        if (!size) return null;

        const [w, h] = size.split("x").map(Number);
        const pixW = w * dpi;
        const pixH = h * dpi;
        const megapixels = (pixW * pixH) / 1000000;

        return {
          primary: { label: "Print Size", value: `${w}" x ${h}" at ${dpi} DPI` },
          details: [
            { label: "Physical size", value: `${w}" x ${h}" (${formatNumber(w / 12, 1)}' x ${formatNumber(h / 12, 1)}')` },
            { label: "Pixel dimensions", value: `${formatNumber(pixW, 0)} x ${formatNumber(pixH, 0)} px` },
            { label: "Megapixels needed", value: formatNumber(megapixels, 1) },
            { label: "Print DPI", value: `${dpi}` },
            { label: "Estimated file size (TIFF)", value: `~${formatNumber(megapixels * 3, 0)} MB` },
            { label: "Metric size", value: `${formatNumber(w * 2.54, 0)} x ${formatNumber(h * 2.54, 0)} cm` },
          ],
          note: "Large format banners viewed from a distance can use lower DPI (72-150). Close-up viewing requires 150-300 DPI.",
        };
      },
    },
  ],
  relatedSlugs: ["social-media-size-calculator", "photo-print-size-calculator", "canvas-size-calculator"],
  faq: [
    { question: "What is the most common web banner size?", answer: "The 300x250 Medium Rectangle is the most common display ad size, followed by the 728x90 Leaderboard and 160x600 Wide Skyscraper. These three sizes cover most ad placements." },
    { question: "What file size should web banners be?", answer: "Google Ads recommends keeping banner files under 150 KB. Use JPEG compression for photos, PNG-8 for simple graphics, or HTML5 for animated ads. Smaller files load faster." },
    { question: "What DPI do I need for a print banner?", answer: "For large banners viewed from a distance (6+ feet), 72-100 DPI is fine. For banners viewed up close (trade shows), use 150 DPI. For small prints, use 300 DPI." },
  ],
  formula: "Pixel Size = Physical Size (inches) × DPI | File Size ≈ Width × Height × Color Depth / Compression",
};
