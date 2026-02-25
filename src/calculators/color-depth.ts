import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const colorDepthCalculator: CalculatorDefinition = {
  slug: "color-depth-calculator",
  title: "Color Depth Calculator",
  description: "Free color depth calculator. Calculate the number of possible colors, bits per pixel, and memory requirements for different color depth configurations.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["color depth calculator", "bits per pixel", "color depth", "bit depth", "color palette calculator"],
  variants: [
    {
      id: "color-depth",
      name: "Color Depth Details",
      description: "Calculate color information from bit depth",
      fields: [
        { name: "bitDepth", label: "Bit Depth", type: "select", options: [
          { label: "1-bit (Monochrome)", value: "1" },
          { label: "4-bit (16 colors)", value: "4" },
          { label: "8-bit (256 colors)", value: "8" },
          { label: "15-bit (High Color)", value: "15" },
          { label: "16-bit (High Color)", value: "16" },
          { label: "24-bit (True Color)", value: "24" },
          { label: "30-bit (Deep Color)", value: "30" },
          { label: "32-bit (True Color + Alpha)", value: "32" },
          { label: "36-bit (Deep Color)", value: "36" },
          { label: "48-bit (Deep Color)", value: "48" },
        ], defaultValue: "24" },
        { name: "widthPx", label: "Image Width (px)", type: "number", placeholder: "e.g. 1920", min: 1, defaultValue: 1920 },
        { name: "heightPx", label: "Image Height (px)", type: "number", placeholder: "e.g. 1080", min: 1, defaultValue: 1080 },
      ],
      calculate: (inputs) => {
        const bitDepth = parseInt(inputs.bitDepth as string) || 24;
        const widthPx = (inputs.widthPx as number) || 1920;
        const heightPx = (inputs.heightPx as number) || 1080;

        const totalColors = Math.pow(2, bitDepth);
        const totalPixels = widthPx * heightPx;
        const rawSizeBytes = (totalPixels * bitDepth) / 8;
        const bytesPerPixel = bitDepth / 8;

        // Channel distribution
        let channelInfo = "";
        let hasAlpha = false;
        if (bitDepth === 1) channelInfo = "1-bit monochrome";
        else if (bitDepth === 4) channelInfo = "4-bit indexed palette";
        else if (bitDepth === 8) channelInfo = "8-bit indexed palette";
        else if (bitDepth === 15) channelInfo = "5-5-5 RGB";
        else if (bitDepth === 16) channelInfo = "5-6-5 RGB";
        else if (bitDepth === 24) channelInfo = "8-8-8 RGB";
        else if (bitDepth === 30) channelInfo = "10-10-10 RGB";
        else if (bitDepth === 32) { channelInfo = "8-8-8-8 RGBA"; hasAlpha = true; }
        else if (bitDepth === 36) channelInfo = "12-12-12 RGB";
        else if (bitDepth === 48) channelInfo = "16-16-16 RGB";

        const bitsPerChannel = bitDepth <= 8 ? bitDepth : hasAlpha ? (bitDepth - 8) / 3 : bitDepth / 3;
        const colorsPerChannel = Math.pow(2, Math.floor(bitsPerChannel));

        const formatBytes = (b: number) => {
          if (b >= 1073741824) return `${formatNumber(b / 1073741824, 2)} GB`;
          if (b >= 1048576) return `${formatNumber(b / 1048576, 2)} MB`;
          if (b >= 1024) return `${formatNumber(b / 1024, 2)} KB`;
          return `${formatNumber(b, 0)} bytes`;
        };

        return {
          primary: { label: "Total Colors", value: totalColors > 1e9 ? `${formatNumber(totalColors / 1e9, 2)} billion` : formatNumber(totalColors, 0) },
          details: [
            { label: "Bit Depth", value: `${bitDepth} bits per pixel` },
            { label: "Channel Layout", value: channelInfo },
            { label: "Total Possible Colors", value: totalColors > 1e12 ? totalColors.toExponential(2) : formatNumber(totalColors, 0) },
            { label: "Levels per Channel", value: formatNumber(colorsPerChannel, 0) },
            { label: "Has Alpha Channel", value: hasAlpha ? "Yes" : "No" },
            { label: "Bytes per Pixel", value: formatNumber(bytesPerPixel, 2) },
            { label: "Resolution", value: `${widthPx} x ${heightPx}` },
            { label: "Total Pixels", value: formatNumber(totalPixels, 0) },
            { label: "Uncompressed Size", value: formatBytes(rawSizeBytes) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["monitor-ppi-calculator", "image-filesize-calculator", "color-converter"],
  faq: [
    { question: "What is the difference between 8-bit and 10-bit color?", answer: "8-bit color has 256 levels per channel (16.7 million colors total). 10-bit color has 1,024 levels per channel (1.07 billion colors). The extra levels eliminate color banding in smooth gradients -- most visible in sunsets, shadows, and video content. Professional monitors and HDR displays use 10-bit." },
    { question: "Do I need more than 24-bit color?", answer: "For web and general use, 24-bit (True Color, 16.7M colors) is sufficient. For professional photo/video editing, 30-bit (10-bit per channel) provides smoother gradients. For scientific visualization and medical imaging, 36-bit or 48-bit may be needed." },
  ],
  formula: "Total Colors = 2^Bit Depth | Uncompressed Size = Width x Height x (Bit Depth / 8)",
};
