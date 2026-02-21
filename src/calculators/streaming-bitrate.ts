import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const streamingBitrateCalculator: CalculatorDefinition = {
  slug: "streaming-bitrate-calculator",
  title: "Streaming Bitrate Calculator",
  description:
    "Free streaming bitrate calculator. Calculate optimal bitrate settings for Twitch, YouTube, and other platforms based on resolution and FPS.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "streaming bitrate calculator",
    "Twitch bitrate",
    "YouTube bitrate",
    "OBS settings",
    "stream quality",
    "upload speed streaming",
    "encoding settings",
  ],
  variants: [
    {
      id: "recommended-bitrate",
      name: "Recommended Bitrate",
      description: "Get recommended bitrate based on resolution, FPS, and platform",
      fields: [
        {
          name: "resolution",
          label: "Stream Resolution",
          type: "select",
          options: [
            { label: "720p (1280x720)", value: "720" },
            { label: "900p (1600x900)", value: "900" },
            { label: "1080p (1920x1080)", value: "1080" },
            { label: "1440p (2560x1440)", value: "1440" },
            { label: "4K (3840x2160)", value: "2160" },
          ],
          defaultValue: "1080",
        },
        {
          name: "fps",
          label: "Frame Rate",
          type: "select",
          options: [
            { label: "30 FPS", value: "30" },
            { label: "60 FPS", value: "60" },
          ],
          defaultValue: "60",
        },
        {
          name: "platform",
          label: "Streaming Platform",
          type: "select",
          options: [
            { label: "Twitch", value: "twitch" },
            { label: "YouTube Live", value: "youtube" },
            { label: "Facebook Gaming", value: "facebook" },
            { label: "Kick", value: "kick" },
          ],
          defaultValue: "twitch",
        },
        {
          name: "contentType",
          label: "Content Type",
          type: "select",
          options: [
            { label: "Low motion (talking, card games)", value: "low" },
            { label: "Medium motion (RPG, strategy)", value: "medium" },
            { label: "High motion (FPS, racing)", value: "high" },
          ],
          defaultValue: "medium",
        },
      ],
      calculate: (inputs) => {
        const resolution = parseInt(inputs.resolution as string);
        const fps = parseInt(inputs.fps as string);
        const platform = inputs.platform as string;
        const contentType = inputs.contentType as string;
        if (!resolution || !fps) return null;

        // Base bitrates by resolution (Kbps) for 30fps medium motion
        const baseBitrates: Record<number, number> = {
          720: 3000,
          900: 4500,
          1080: 6000,
          1440: 9000,
          2160: 20000,
        };

        let bitrate = baseBitrates[resolution] || 6000;

        // FPS multiplier
        if (fps === 60) bitrate *= 1.5;

        // Content type multiplier
        if (contentType === "low") bitrate *= 0.7;
        else if (contentType === "high") bitrate *= 1.3;

        bitrate = Math.round(bitrate);

        // Platform max limits
        const platformLimits: Record<string, { maxBitrate: number; name: string; audioBitrate: number }> = {
          twitch: { maxBitrate: 8500, name: "Twitch", audioBitrate: 160 },
          youtube: { maxBitrate: 51000, name: "YouTube Live", audioBitrate: 128 },
          facebook: { maxBitrate: 8000, name: "Facebook Gaming", audioBitrate: 128 },
          kick: { maxBitrate: 8000, name: "Kick", audioBitrate: 160 },
        };

        const platformSpec = platformLimits[platform] || platformLimits.twitch;
        const cappedBitrate = Math.min(bitrate, platformSpec.maxBitrate);
        const totalBitrate = cappedBitrate + platformSpec.audioBitrate;
        const requiredUploadMbps = totalBitrate / 1000 * 1.25; // 25% overhead

        // Storage estimate per hour
        const gbPerHour = (totalBitrate * 3600) / (8 * 1024 * 1024);

        const encoder = resolution >= 1440 ? "NVENC (GPU) or x264 Medium" : "x264 Veryfast or NVENC";

        return {
          primary: { label: "Recommended Video Bitrate", value: formatNumber(cappedBitrate, 0) + " Kbps" },
          details: [
            { label: "Platform", value: platformSpec.name },
            { label: "Platform Max Bitrate", value: formatNumber(platformSpec.maxBitrate, 0) + " Kbps" },
            { label: "Audio Bitrate", value: platformSpec.audioBitrate + " Kbps (AAC)" },
            { label: "Total Bitrate", value: formatNumber(totalBitrate, 0) + " Kbps" },
            { label: "Required Upload Speed", value: formatNumber(requiredUploadMbps, 1) + " Mbps (minimum)" },
            { label: "Storage per Hour", value: formatNumber(gbPerHour, 1) + " GB" },
            { label: "Suggested Encoder", value: encoder },
            { label: "Resolution", value: `${resolution}p @ ${fps} FPS` },
            { label: "Content Motion", value: contentType },
          ],
          note: cappedBitrate < bitrate
            ? `Ideal bitrate (${formatNumber(bitrate, 0)} Kbps) exceeds ${platformSpec.name}'s max of ${formatNumber(platformSpec.maxBitrate, 0)} Kbps. Consider a lower resolution for best quality.`
            : undefined,
        };
      },
    },
    {
      id: "upload-check",
      name: "Upload Speed Check",
      description: "Determine max stream quality from your upload speed",
      fields: [
        {
          name: "uploadMbps",
          label: "Upload Speed (Mbps)",
          type: "number",
          placeholder: "e.g. 10",
          min: 0.5,
          step: 0.5,
        },
        {
          name: "fps",
          label: "Target FPS",
          type: "select",
          options: [
            { label: "30 FPS", value: "30" },
            { label: "60 FPS", value: "60" },
          ],
          defaultValue: "60",
        },
      ],
      calculate: (inputs) => {
        const upload = inputs.uploadMbps as number;
        const fps = parseInt(inputs.fps as string) || 60;
        if (!upload || upload <= 0) return null;

        // Available for streaming (use 75% of upload to avoid congestion)
        const availableKbps = upload * 1000 * 0.75;
        const videoBitrate = availableKbps - 160; // subtract audio

        let maxRes = "480p";
        if (fps === 60) {
          if (videoBitrate >= 9000) maxRes = "1080p60";
          else if (videoBitrate >= 6000) maxRes = "900p60";
          else if (videoBitrate >= 4500) maxRes = "720p60";
          else if (videoBitrate >= 2500) maxRes = "720p30 (lower FPS)";
          else maxRes = "480p";
        } else {
          if (videoBitrate >= 6000) maxRes = "1080p30";
          else if (videoBitrate >= 4500) maxRes = "900p30";
          else if (videoBitrate >= 3000) maxRes = "720p30";
          else maxRes = "480p30";
        }

        return {
          primary: { label: "Max Recommended Quality", value: maxRes },
          details: [
            { label: "Upload Speed", value: formatNumber(upload, 1) + " Mbps" },
            { label: "Usable for Stream (75%)", value: formatNumber(availableKbps, 0) + " Kbps" },
            { label: "Max Video Bitrate", value: formatNumber(videoBitrate, 0) + " Kbps" },
            { label: "Audio Bitrate", value: "160 Kbps" },
          ],
          note: upload < 3 ? "Your upload speed is very low for streaming. Consider lowering resolution to 480p or 720p30." : undefined,
        };
      },
    },
  ],
  relatedSlugs: ["video-game-fps-calculator", "gaming-monitor-calculator", "data-storage-calculator"],
  faq: [
    {
      question: "What bitrate should I stream at on Twitch?",
      answer:
        "For Twitch, 6000 Kbps is recommended for 1080p60 streams. Twitch's max is 8500 Kbps. If you're not a partner, viewers without transcoding may struggle, so 720p60 at 4500 Kbps is a safe choice for broader accessibility.",
    },
    {
      question: "What upload speed do I need to stream?",
      answer:
        "You need at least 1.5x your total bitrate in upload speed. For a 6000 Kbps stream: at least 9 Mbps upload. For 720p30 at 3000 Kbps: at least 5 Mbps. Always run a speed test and use 75% of your upload capacity to avoid dropped frames.",
    },
    {
      question: "Should I use x264 or NVENC for encoding?",
      answer:
        "NVENC (GPU encoding) is recommended for most streamers as it offloads encoding from the CPU, maintaining game performance. x264 (CPU encoding) produces slightly better quality at the same bitrate but uses significant CPU resources. If you have an RTX GPU, NVENC quality is very close to x264 Medium.",
    },
  ],
  formula:
    "Required Upload (Mbps) = Total Bitrate (Kbps) / 1000 x 1.25 | Storage/hr (GB) = Total Bitrate x 3600 / (8 x 1024 x 1024) | 60fps bitrate = 30fps bitrate x 1.5",
};
