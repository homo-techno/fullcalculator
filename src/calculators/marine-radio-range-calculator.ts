import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const marineRadioRangeCalculator: CalculatorDefinition = {
  slug: "marine-radio-range-calculator",
  title: "Marine Radio Range Calculator",
  description: "Estimate the effective communication range of your marine VHF radio based on antenna height, power output, and receiving station height.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["marine radio range","VHF range calculator","marine antenna height","radio line of sight"],
  variants: [{
    id: "standard",
    name: "Marine Radio Range",
    description: "Estimate the effective communication range of your marine VHF radio based on antenna height, power output, and receiving station height.",
    fields: [
      { name: "txAntennaHeight", label: "Your Antenna Height (feet)", type: "number", min: 3, max: 150, defaultValue: 15 },
      { name: "rxAntennaHeight", label: "Other Station Antenna Height (feet)", type: "number", min: 3, max: 500, defaultValue: 50 },
      { name: "power", label: "Transmit Power", type: "select", options: [{ value: "1", label: "1 Watt (Low)" }, { value: "5", label: "5 Watts (Handheld)" }, { value: "25", label: "25 Watts (Fixed Mount)" }], defaultValue: "25" },
      { name: "conditions", label: "Atmospheric Conditions", type: "select", options: [{ value: "1.0", label: "Normal" }, { value: "1.15", label: "Favorable (ducting)" }, { value: "0.8", label: "Degraded (rain/fog)" }], defaultValue: "1.0" },
    ],
    calculate: (inputs) => {
    const txH = inputs.txAntennaHeight as number;
    const rxH = inputs.rxAntennaHeight as number;
    const power = parseInt(inputs.power as string);
    const condFactor = parseFloat(inputs.conditions as string);
    const txRange = 1.42 * Math.sqrt(txH);
    const rxRange = 1.42 * Math.sqrt(rxH);
    const lineOfSight = (txRange + rxRange) * condFactor;
    const effectiveRange = Math.min(lineOfSight, power === 1 ? 5 : power === 5 ? 12 : lineOfSight);
    const boatToBoat = 1.42 * Math.sqrt(txH) * 2 * condFactor;
    return {
      primary: { label: "Estimated Range", value: formatNumber(Math.round(effectiveRange * 10) / 10) + " nautical miles" },
      details: [
        { label: "Line of Sight Distance", value: formatNumber(Math.round(lineOfSight * 10) / 10) + " NM" },
        { label: "Your Horizon Distance", value: formatNumber(Math.round(txRange * 10) / 10) + " NM" },
        { label: "Other Station Horizon", value: formatNumber(Math.round(rxRange * 10) / 10) + " NM" },
        { label: "Boat-to-Boat Range (same height)", value: formatNumber(Math.round(boatToBoat * 10) / 10) + " NM" },
        { label: "Transmit Power", value: power + " watts" }
      ]
    };
  },
  }],
  relatedSlugs: ["marine-battery-sizing-calculator","boat-fuel-consumption-calculator"],
  faq: [
    { question: "How far can a marine VHF radio reach?", answer: "VHF marine radio range depends primarily on antenna height, not power. A typical 25-watt fixed-mount radio on a sailboat with a 15-foot antenna can reach about 5 to 8 nautical miles to another boat, or 15 to 20 miles to a coast guard tower." },
    { question: "Does antenna height affect radio range?", answer: "Yes, antenna height is the most important factor in VHF range because VHF signals travel in straight lines. Doubling the antenna height increases range by about 40 percent. This is why tall mast-mounted antennas perform much better." },
    { question: "What VHF channel should I use for emergencies?", answer: "Channel 16 (156.800 MHz) is the international distress, safety, and calling frequency. All mariners should monitor Channel 16 at all times while underway. Use it only for distress calls and initial contact." },
  ],
  formula: "Horizon Distance = 1.42 x Square Root of Antenna Height (feet)
Line of Sight Range = Your Horizon + Other Station Horizon
Range is also limited by transmit power and atmospheric conditions",
};
