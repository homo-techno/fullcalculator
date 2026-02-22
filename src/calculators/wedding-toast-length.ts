import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const weddingToastLengthCalculator: CalculatorDefinition = {
  slug: "wedding-toast-length",
  title: "Wedding Toast Length Calculator",
  description: "Free wedding toast length calculator. Estimate speech duration based on word count and plan the toasts segment of your reception.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["wedding toast", "speech length", "best man speech", "maid of honor toast", "wedding speech"],
  variants: [
    {
      id: "bySpeaker",
      name: "By Speaker Count",
      fields: [
        { name: "speakerCount", label: "Number of Speakers", type: "number", placeholder: "e.g. 4" },
        { name: "avgWordCount", label: "Average Words Per Speech", type: "number", placeholder: "e.g. 600" },
        { name: "speakingPace", label: "Speaking Pace", type: "select", options: [
          { label: "Slow (110 wpm)", value: "slow" },
          { label: "Average (130 wpm)", value: "average" },
          { label: "Fast (150 wpm)", value: "fast" },
        ] },
        { name: "transitionTime", label: "Transition Time Per Speaker (sec)", type: "number", placeholder: "e.g. 30" },
      ],
      calculate: (inputs) => {
        const speakerCount = (inputs.speakerCount as number) || 0;
        const avgWordCount = (inputs.avgWordCount as number) || 600;
        const speakingPace = (inputs.speakingPace as string) || "average";
        const transitionTime = (inputs.transitionTime as number) || 30;
        if (speakerCount <= 0) return null;
        const wpm = speakingPace === "slow" ? 110 : speakingPace === "fast" ? 150 : 130;
        const speechMinutes = avgWordCount / wpm;
        const transitionMinutes = (transitionTime * speakerCount) / 60;
        const totalMinutes = (speechMinutes * speakerCount) + transitionMinutes;
        const totalWords = avgWordCount * speakerCount;
        return {
          primary: { label: "Total Toast Time", value: formatNumber(Math.ceil(totalMinutes)) + " minutes" },
          details: [
            { label: "Time Per Speech", value: formatNumber(speechMinutes, 1) + " min" },
            { label: "Number of Speakers", value: formatNumber(speakerCount) },
            { label: "Total Words", value: formatNumber(totalWords) },
            { label: "Speaking Pace", value: formatNumber(wpm) + " words/min" },
            { label: "Transition Time", value: formatNumber(transitionMinutes, 1) + " min" },
            { label: "Recommended Max", value: "3-5 min per speech" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["reception-timeline", "wedding-dj-timeline", "wedding-photo-timeline"],
  faq: [
    { question: "How long should a wedding toast be?", answer: "Ideal wedding toasts are 3-5 minutes (about 400-650 words). Best man and maid of honor speeches can be slightly longer, up to 7 minutes." },
    { question: "How many toasts should a wedding have?", answer: "Most weddings have 2-4 toasts: typically the best man, maid of honor, and optionally one or both parents. Keep total toast time under 20 minutes." },
  ],
  formula: "Total Time = (Word Count / Words Per Minute) x Speakers + Transitions",
};
