import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const weddingRegistryValueCalculator: CalculatorDefinition = {
  slug: "wedding-registry-value-calculator",
  title: "Wedding Registry Value Calculator",
  description: "Calculate the ideal wedding registry value by estimating guest gift contributions and building a balanced registry across price ranges.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["wedding registry","gift registry value","wedding gift list","registry planning"],
  variants: [{
    id: "standard",
    name: "Wedding Registry Value",
    description: "Calculate the ideal wedding registry value by estimating guest gift contributions and building a balanced registry across price ranges.",
    fields: [
      { name: "totalGuests", label: "Total Invited Guests", type: "number", min: 10, max: 500, defaultValue: 150 },
      { name: "expectedAttendance", label: "Expected Attendance (%)", type: "number", min: 30, max: 100, defaultValue: 80 },
      { name: "avgGiftValue", label: "Average Gift Value ($)", type: "number", min: 25, max: 500, defaultValue: 100 },
      { name: "coupleGifts", label: "% of Couples Giving One Gift", type: "number", min: 0, max: 100, defaultValue: 60 },
      { name: "registryMarkup", label: "Registry Value Multiplier", type: "number", min: 1, max: 3, defaultValue: 1.5 },
    ],
    calculate: (inputs) => {
    const guests = inputs.totalGuests as number;
    const attendance = inputs.expectedAttendance as number / 100;
    const avgGift = inputs.avgGiftValue as number;
    const couplesPct = inputs.coupleGifts as number / 100;
    const multiplier = inputs.registryMarkup as number;
    const attendingGuests = Math.round(guests * attendance);
    const soloGivers = Math.round(attendingGuests * (1 - couplesPct));
    const coupleGivers = Math.round(attendingGuests * couplesPct / 2);
    const totalGivers = soloGivers + coupleGivers;
    const expectedGiftTotal = totalGivers * avgGift;
    const registryValue = expectedGiftTotal * multiplier;
    const lowRange = Math.round(registryValue * 0.3);
    const midRange = Math.round(registryValue * 0.45);
    const highRange = Math.round(registryValue * 0.25);
    return {
      primary: { label: "Recommended Registry Value", value: "$" + formatNumber(Math.round(registryValue)) },
      details: [
        { label: "Expected Gift Total", value: "$" + formatNumber(Math.round(expectedGiftTotal)) },
        { label: "Estimated Gift-Givers", value: formatNumber(totalGivers) },
        { label: "Budget Items (under $50)", value: "$" + formatNumber(lowRange) + " worth" },
        { label: "Mid-Range ($50-$150)", value: "$" + formatNumber(midRange) + " worth" },
        { label: "Premium ($150+)", value: "$" + formatNumber(highRange) + " worth" }
      ]
    };
  },
  }],
  relatedSlugs: ["wedding-budget-calculator","wedding-guest-calculator","wedding-favor-cost-calculator"],
  faq: [
    { question: "How much should a wedding registry be worth?", answer: "A good rule is to register for 1.5 to 2 times the expected total gift amount. This gives guests plenty of options across price points." },
    { question: "How many items should be on a wedding registry?", answer: "Register for at least as many items as you have guests. A 150-guest wedding should have 150-200 items across various price points." },
    { question: "What price range should registry items be?", answer: "Include 30% budget items (under $50), 45% mid-range ($50-$150), and 25% premium items ($150+). This accommodates all guest budgets." },
  ],
  formula: "Gift Givers = Solo Guests + (Couple Guests / 2); Expected Gifts = Gift Givers x Average Gift Value; Registry Value = Expected Gifts x Multiplier",
};
