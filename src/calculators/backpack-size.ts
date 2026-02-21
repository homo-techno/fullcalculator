import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const backpackSizeCalculator: CalculatorDefinition = {
  slug: "backpack-size-calculator",
  title: "Backpack Size Calculator",
  description: "Free backpack size calculator. Find the right backpack volume and fit based on your torso length and trip type.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["backpack size calculator", "backpack volume calculator", "hiking backpack size", "what size backpack do I need", "backpack fitting"],
  variants: [
    {
      id: "calc",
      name: "Calculate Backpack Size",
      fields: [
        { name: "torso", label: "Torso Length", type: "number", placeholder: "e.g. 18", suffix: "in", step: 0.5 },
        { name: "tripType", label: "Trip Type", type: "select", options: [
          { label: "Day Hike (1 day)", value: "day" },
          { label: "Weekend (1–3 nights)", value: "weekend" },
          { label: "Week+ (multi-day)", value: "week" },
        ], defaultValue: "day" },
      ],
      calculate: (inputs) => {
        const torso = inputs.torso as number;
        const tripType = inputs.tripType as string;
        if (!torso) return null;

        // Frame size from torso length
        let frameSize: string;
        if (torso < 16) frameSize = "Extra Small";
        else if (torso < 18) frameSize = "Small";
        else if (torso < 20) frameSize = "Medium / Regular";
        else if (torso < 22) frameSize = "Large / Tall";
        else frameSize = "Extra Large";

        // Volume recommendation based on trip type
        let volumeMin: number;
        let volumeMax: number;
        let tripDesc: string;
        let features: string;

        if (tripType === "day") {
          volumeMin = 20;
          volumeMax = 30;
          tripDesc = "Day Hike — light and compact";
          features = "Hydration sleeve, hip belt, rain cover";
        } else if (tripType === "weekend") {
          volumeMin = 30;
          volumeMax = 50;
          tripDesc = "Weekend Trip — room for sleeping bag and extra layers";
          features = "Hip belt, load lifters, sleeping bag compartment, rain cover";
        } else {
          volumeMin = 50;
          volumeMax = 80;
          tripDesc = "Extended Trip — full camping gear capacity";
          features = "Adjustable suspension, hip belt, load lifters, multiple compartments, external attachment points";
        }

        const torsoCm = torso * 2.54;

        return {
          primary: { label: "Recommended Volume", value: `${volumeMin}–${volumeMax} liters` },
          details: [
            { label: "Frame Size", value: frameSize },
            { label: "Trip Type", value: tripDesc },
            { label: "Torso Length", value: `${formatNumber(torso, 1)} in (${formatNumber(torsoCm, 0)} cm)` },
            { label: "Recommended Features", value: features },
            { label: "Pack Weight Target", value: tripType === "day" ? "< 2 lbs" : tripType === "weekend" ? "3–5 lbs" : "4–7 lbs" },
          ],
          note: "Measure your torso from the C7 vertebra (base of neck) to the top of your hip bones. The pack's hip belt should rest on top of your iliac crest.",
        };
      },
    },
  ],
  relatedSlugs: ["bike-size-calculator", "ski-size-calculator", "helmet-size-calculator"],
  faq: [
    { question: "How do I measure my torso for a backpack?", answer: "Tilt your head forward and feel for the bony bump at the base of your neck (C7 vertebra). Have someone measure from that point down your spine to the top of your hip bones (iliac crest). This distance in inches is your torso length." },
    { question: "What size backpack for day hiking?", answer: "A 20–30 liter backpack is ideal for day hikes. It's enough for water, snacks, rain jacket, first aid kit, and a few extras without being cumbersome." },
    { question: "Does torso length or height determine pack size?", answer: "Torso length, not overall height, determines pack size. Two people of the same height can have very different torso lengths, so always measure your torso directly." },
  ],
  formula: "Day Hike: 20–30L | Weekend: 30–50L | Week+: 50–80L | Frame size based on torso length",
};
