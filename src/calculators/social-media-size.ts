import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const socialMediaSizeCalculator: CalculatorDefinition = {
  slug: "social-media-size-calculator",
  title: "Social Media Image Size Calculator",
  description: "Free social media image size calculator. Get recommended image dimensions, aspect ratios, and file sizes for Instagram, Facebook, Twitter/X, YouTube, TikTok, and LinkedIn.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["social media image size", "Instagram image size", "Facebook image size", "Twitter image dimensions", "YouTube thumbnail size", "social media dimensions"],
  variants: [
    {
      id: "instagram",
      name: "Instagram Sizes",
      description: "Recommended image sizes for Instagram",
      fields: [
        { name: "postType", label: "Post Type", type: "select", options: [
          { label: "Feed Post - Square (1:1)", value: "1080x1080" },
          { label: "Feed Post - Portrait (4:5)", value: "1080x1350" },
          { label: "Feed Post - Landscape (1.91:1)", value: "1080x566" },
          { label: "Story / Reel (9:16)", value: "1080x1920" },
          { label: "Profile Picture", value: "320x320" },
          { label: "Carousel (1:1)", value: "1080x1080" },
          { label: "IGTV Cover", value: "420x654" },
        ], defaultValue: "1080x1350" },
      ],
      calculate: (inputs) => {
        const size = inputs.postType as string;
        if (!size) return null;

        const [w, h] = size.split("x").map(Number);
        const megapixels = (w * h) / 1000000;
        const aspectW = w / Math.min(w, h);
        const aspectH = h / Math.min(w, h);

        return {
          primary: { label: "Recommended Size", value: `${w} x ${h} px` },
          details: [
            { label: "Width", value: `${w} px` },
            { label: "Height", value: `${h} px` },
            { label: "Aspect ratio", value: w === h ? "1:1" : `${formatNumber(aspectW, 2)}:${formatNumber(aspectH, 2)}` },
            { label: "Megapixels", value: formatNumber(megapixels, 2) },
            { label: "Max file size", value: "30 MB (JPEG/PNG)" },
            { label: "Recommended format", value: "JPEG for photos, PNG for graphics" },
          ],
          note: "Instagram compresses images. Upload at the recommended resolution for best quality. Use sRGB color space.",
        };
      },
    },
    {
      id: "platform",
      name: "All Platforms - Post",
      description: "Compare post sizes across platforms",
      fields: [
        { name: "platform", label: "Platform", type: "select", options: [
          { label: "Facebook Post", value: "fb-post" },
          { label: "Facebook Cover Photo", value: "fb-cover" },
          { label: "Twitter/X Post", value: "tw-post" },
          { label: "Twitter/X Header", value: "tw-header" },
          { label: "YouTube Thumbnail", value: "yt-thumb" },
          { label: "YouTube Channel Art", value: "yt-banner" },
          { label: "LinkedIn Post", value: "li-post" },
          { label: "LinkedIn Cover", value: "li-cover" },
          { label: "TikTok Video", value: "tt-video" },
          { label: "Pinterest Pin", value: "pin" },
        ], defaultValue: "fb-post" },
      ],
      calculate: (inputs) => {
        const platform = inputs.platform as string;
        if (!platform) return null;

        const sizes: Record<string, { w: number; h: number; ratio: string; maxMB: number; note: string }> = {
          "fb-post": { w: 1200, h: 630, ratio: "1.91:1", maxMB: 30, note: "Feed images auto-resize. Use 1200x630 for link previews." },
          "fb-cover": { w: 851, h: 315, ratio: "2.7:1", maxMB: 10, note: "Displays 820x312 on desktop, 640x360 on mobile." },
          "tw-post": { w: 1600, h: 900, ratio: "16:9", maxMB: 5, note: "Supports 1:1, 16:9, and 4:3. Max 4096x4096." },
          "tw-header": { w: 1500, h: 500, ratio: "3:1", maxMB: 5, note: "Some areas may be cropped on different devices." },
          "yt-thumb": { w: 1280, h: 720, ratio: "16:9", maxMB: 2, note: "Minimum 640x360. Custom thumbnails need verified account." },
          "yt-banner": { w: 2560, h: 1440, ratio: "16:9", maxMB: 6, note: "Safe area for all devices: 1546x423 (center)." },
          "li-post": { w: 1200, h: 627, ratio: "1.91:1", maxMB: 10, note: "Square (1:1) also works well at 1080x1080." },
          "li-cover": { w: 1584, h: 396, ratio: "4:1", maxMB: 8, note: "Personal profile cover. Company pages use 1128x191." },
          "tt-video": { w: 1080, h: 1920, ratio: "9:16", maxMB: 287, note: "Full-screen vertical video. Keep text in safe zone." },
          "pin": { w: 1000, h: 1500, ratio: "2:3", maxMB: 20, note: "Tall pins (2:3 or 1:2.1) perform best. Min width 600px." },
        };

        const s = sizes[platform];
        if (!s) return null;

        return {
          primary: { label: "Recommended Size", value: `${s.w} x ${s.h} px` },
          details: [
            { label: "Width", value: `${s.w} px` },
            { label: "Height", value: `${s.h} px` },
            { label: "Aspect ratio", value: s.ratio },
            { label: "Max file size", value: `${s.maxMB} MB` },
            { label: "Megapixels", value: formatNumber((s.w * s.h) / 1000000, 2) },
          ],
          note: s.note,
        };
      },
    },
    {
      id: "resize",
      name: "Resize for Platform",
      description: "Calculate how to resize your image for a platform",
      fields: [
        { name: "imageWidth", label: "Your Image Width (px)", type: "number", placeholder: "e.g. 4000" },
        { name: "imageHeight", label: "Your Image Height (px)", type: "number", placeholder: "e.g. 3000" },
        { name: "targetRatio", label: "Target Aspect Ratio", type: "select", options: [
          { label: "1:1 (Instagram Square)", value: "1" },
          { label: "4:5 (Instagram Portrait)", value: "0.8" },
          { label: "16:9 (YouTube/Twitter)", value: "1.778" },
          { label: "9:16 (Stories/Reels/TikTok)", value: "0.5625" },
          { label: "1.91:1 (Facebook/LinkedIn)", value: "1.91" },
          { label: "2:3 (Pinterest)", value: "0.667" },
        ], defaultValue: "1" },
      ],
      calculate: (inputs) => {
        const iw = inputs.imageWidth as number;
        const ih = inputs.imageHeight as number;
        const targetRatio = parseFloat(inputs.targetRatio as string) || 1;
        if (!iw || !ih) return null;

        const currentRatio = iw / ih;
        let cropW: number, cropH: number;

        if (currentRatio > targetRatio) {
          cropH = ih;
          cropW = Math.round(ih * targetRatio);
        } else {
          cropW = iw;
          cropH = Math.round(iw / targetRatio);
        }

        const pixelsLost = (iw * ih) - (cropW * cropH);
        const percentKept = (cropW * cropH) / (iw * ih) * 100;

        return {
          primary: { label: "Crop To", value: `${cropW} x ${cropH} px` },
          details: [
            { label: "Original size", value: `${iw} x ${ih} px` },
            { label: "Cropped size", value: `${cropW} x ${cropH} px` },
            { label: "Original ratio", value: `${formatNumber(currentRatio, 2)}:1` },
            { label: "Target ratio", value: `${formatNumber(targetRatio, 2)}:1` },
            { label: "Image area kept", value: `${formatNumber(percentKept, 1)}%` },
            { label: "Pixels cropped", value: formatNumber(pixelsLost, 0) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["banner-size-calculator", "photo-print-size-calculator", "canvas-size-calculator"],
  faq: [
    { question: "What is the best image size for Instagram?", answer: "For Instagram feed posts, use 1080x1350 pixels (4:5 portrait) for maximum screen real estate. Stories and Reels use 1080x1920 (9:16). Square posts are 1080x1080." },
    { question: "What size should a YouTube thumbnail be?", answer: "YouTube thumbnails should be 1280x720 pixels (16:9 aspect ratio). The minimum width is 640 pixels. File must be under 2 MB in JPG, GIF, or PNG format." },
    { question: "What image format is best for social media?", answer: "Use JPEG for photographs (smaller file size, good quality). Use PNG for graphics with text, logos, or transparency. Use WebP where supported for best compression." },
  ],
  formula: "Crop Width = Height × Target Ratio (if wider) | Crop Height = Width / Target Ratio (if taller)",
};
