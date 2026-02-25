import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const imageFilesizeCalculator: CalculatorDefinition = {
  slug: "image-filesize-calculator",
  title: "Image File Size Calculator",
  description: "Free image file size calculator. Estimate uncompressed and compressed image file sizes based on resolution, color depth, and format.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["image file size calculator", "image size estimator", "photo file size", "image resolution size", "picture size calculator"],
  variants: [
    {
      id: "image-size",
      name: "Image File Size",
      description: "Estimate image file size from resolution and format",
      fields: [
        { name: "widthPx", label: "Width (pixels)", type: "number", placeholder: "e.g. 4000", min: 1 },
        { name: "heightPx", label: "Height (pixels)", type: "number", placeholder: "e.g. 3000", min: 1 },
        { name: "colorDepth", label: "Color Depth", type: "select", options: [
          { label: "8-bit (256 colors)", value: "8" },
          { label: "24-bit (True Color)", value: "24" },
          { label: "32-bit (True Color + Alpha)", value: "32" },
          { label: "48-bit (16-bit per channel)", value: "48" },
        ], defaultValue: "24" },
        { name: "format", label: "Image Format", type: "select", options: [
          { label: "BMP (uncompressed)", value: "1" },
          { label: "PNG (lossless, ~50%)", value: "0.5" },
          { label: "JPEG (high quality, ~15%)", value: "0.15" },
          { label: "JPEG (medium quality, ~8%)", value: "0.08" },
          { label: "WebP (lossy, ~10%)", value: "0.1" },
          { label: "WebP (lossless, ~40%)", value: "0.4" },
          { label: "AVIF (lossy, ~7%)", value: "0.07" },
        ], defaultValue: "0.15" },
      ],
      calculate: (inputs) => {
        const widthPx = inputs.widthPx as number;
        const heightPx = inputs.heightPx as number;
        const colorDepth = parseInt(inputs.colorDepth as string) || 24;
        const compressionRatio = parseFloat(inputs.format as string) || 0.15;
        if (!widthPx || !heightPx) return null;

        const totalPixels = widthPx * heightPx;
        const megapixels = totalPixels / 1000000;
        const uncompressedBytes = (totalPixels * colorDepth) / 8;
        const compressedBytes = uncompressedBytes * compressionRatio;

        const formatBytes = (b: number) => {
          if (b >= 1073741824) return `${formatNumber(b / 1073741824, 2)} GB`;
          if (b >= 1048576) return `${formatNumber(b / 1048576, 2)} MB`;
          if (b >= 1024) return `${formatNumber(b / 1024, 2)} KB`;
          return `${formatNumber(b, 0)} bytes`;
        };

        // Storage for batch of images
        const per100 = compressedBytes * 100;
        const per1000 = compressedBytes * 1000;

        return {
          primary: { label: "Estimated File Size", value: formatBytes(compressedBytes) },
          details: [
            { label: "Resolution", value: `${widthPx} x ${heightPx}` },
            { label: "Megapixels", value: `${formatNumber(megapixels, 1)} MP` },
            { label: "Color Depth", value: `${colorDepth}-bit` },
            { label: "Uncompressed Size", value: formatBytes(uncompressedBytes) },
            { label: "Compressed Size", value: formatBytes(compressedBytes) },
            { label: "Compression Ratio", value: `${formatNumber(compressionRatio * 100, 0)}% of original` },
            { label: "Space Saved", value: formatBytes(uncompressedBytes - compressedBytes) },
            { label: "100 Images", value: formatBytes(per100) },
            { label: "1,000 Images", value: formatBytes(per1000) },
          ],
        };
      },
    },
    {
      id: "batch-storage",
      name: "Batch Image Storage",
      description: "Calculate storage needed for a batch of images",
      fields: [
        { name: "avgFileSize", label: "Average File Size (MB)", type: "number", placeholder: "e.g. 5", min: 0.001, defaultValue: 5 },
        { name: "imageCount", label: "Number of Images", type: "number", placeholder: "e.g. 10000", min: 1 },
        { name: "keepOriginals", label: "Keep Originals?", type: "select", options: [
          { label: "No (compressed only)", value: "1" },
          { label: "Yes (2x storage)", value: "2" },
          { label: "Yes + Thumbnails (2.1x)", value: "2.1" },
        ], defaultValue: "1" },
      ],
      calculate: (inputs) => {
        const avgFileSize = inputs.avgFileSize as number;
        const imageCount = inputs.imageCount as number;
        const multiplier = parseFloat(inputs.keepOriginals as string) || 1;
        if (!avgFileSize || !imageCount) return null;

        const totalMB = avgFileSize * imageCount * multiplier;
        const totalGB = totalMB / 1024;
        const totalTB = totalGB / 1024;

        const formatSize = (mb: number) => {
          if (mb >= 1048576) return `${formatNumber(mb / 1048576, 2)} TB`;
          if (mb >= 1024) return `${formatNumber(mb / 1024, 2)} GB`;
          return `${formatNumber(mb, 2)} MB`;
        };

        return {
          primary: { label: "Total Storage Needed", value: formatSize(totalMB) },
          details: [
            { label: "Average File Size", value: `${formatNumber(avgFileSize, 2)} MB` },
            { label: "Image Count", value: formatNumber(imageCount, 0) },
            { label: "Storage Multiplier", value: `${multiplier}x` },
            { label: "Total Storage (MB)", value: formatNumber(totalMB, 0) },
            { label: "Total Storage (GB)", value: formatNumber(totalGB, 2) },
            { label: "Total Storage (TB)", value: formatNumber(totalTB, 4) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["color-depth-calculator", "video-storage-calculator", "data-storage-converter"],
  faq: [
    { question: "Why do JPEG files vary so much in size?", answer: "JPEG compression is lossy and adaptive. Images with lots of detail (textures, noise) compress less than smooth images (sky, gradients). Quality settings drastically affect size: quality 95 can be 3-5x larger than quality 75 with minimal visible difference. The same resolution can produce very different file sizes." },
    { question: "Which image format should I use?", answer: "JPEG for photos (lossy, smallest size). PNG for graphics with transparency or text (lossless). WebP for web (30% smaller than JPEG/PNG). AVIF for next-gen web (50% smaller than JPEG). TIFF/BMP for uncompressed archival. SVG for vector graphics (logos, icons)." },
  ],
  formula: "Uncompressed = Width x Height x (BitDepth / 8) | Compressed = Uncompressed x Compression Ratio",
};
