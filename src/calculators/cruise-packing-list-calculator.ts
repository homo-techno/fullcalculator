import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const cruisePackingListCalculator: CalculatorDefinition = {
  slug: "cruise-packing-list-calculator",
  title: "Cruise Packing List Calculator",
  description: "Calculate the recommended number of outfits, formal wear, and essentials to pack based on cruise length and type.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["cruise packing list","cruise packing calculator","what to pack cruise","cruise wardrobe"],
  variants: [{
    id: "standard",
    name: "Cruise Packing List",
    description: "Calculate the recommended number of outfits, formal wear, and essentials to pack based on cruise length and type.",
    fields: [
      { name: "cruiseNights", label: "Cruise Length (nights)", type: "number", min: 2, max: 30, defaultValue: 7 },
      { name: "cruiseType", label: "Cruise Type", type: "select", options: [{ value: "1", label: "Casual (river/expedition)" }, { value: "2", label: "Contemporary (Carnival, Royal)" }, { value: "3", label: "Premium (Celebrity, Holland)" }, { value: "4", label: "Luxury (Regent, Silversea)" }], defaultValue: "2" },
      { name: "portDays", label: "Port Days", type: "number", min: 0, max: 20, defaultValue: 3 },
      { name: "laundryAvailable", label: "Onboard Laundry?", type: "select", options: [{ value: "0", label: "No" }, { value: "1", label: "Yes" }], defaultValue: "0" },
    ],
    calculate: (inputs) => {
    const nights = inputs.cruiseNights as number;
    const cruiseType = parseInt(inputs.cruiseType as string);
    const portDays = inputs.portDays as number;
    const laundry = inputs.laundryAvailable as string;
    const laundryFactor = laundry === "1" ? 0.6 : 1;
    const formalNights = cruiseType === 1 ? 0 : cruiseType === 2 ? Math.floor(nights / 4) : cruiseType === 3 ? Math.floor(nights / 3) : Math.floor(nights / 2);
    const casualOutfits = Math.ceil((nights - formalNights) * laundryFactor);
    const formalOutfits = Math.ceil(formalNights * laundryFactor);
    const swimsuits = Math.min(Math.ceil(nights / 3), 4);
    const shoreOutfits = Math.min(portDays, casualOutfits);
    const totalOutfits = casualOutfits + formalOutfits;
    const estimatedWeight = totalOutfits * 1.5 + swimsuits * 0.5 + 5;
    return {
      primary: { label: "Total Outfits Needed", value: formatNumber(totalOutfits) },
      details: [
        { label: "Casual/Smart Casual", value: formatNumber(casualOutfits) },
        { label: "Formal/Dressy", value: formatNumber(formalOutfits) },
        { label: "Formal Nights", value: formatNumber(formalNights) },
        { label: "Swimsuits", value: formatNumber(swimsuits) },
        { label: "Shore Excursion Outfits", value: formatNumber(shoreOutfits) },
        { label: "Est. Clothing Weight", value: formatNumber(Math.round(estimatedWeight * 10) / 10) + " lb" }
      ]
    };
  },
  }],
  relatedSlugs: ["cruise-cabin-cost-comparison-calculator","luggage-weight-converter-calculator","travel-budget-calculator"],
  faq: [
    { question: "How many outfits do I need for a 7-day cruise?", answer: "For a 7-night cruise, plan for 5 to 6 casual outfits, 1 to 2 formal outfits, 2 to 3 swimsuits, and shore excursion clothes. Mix and match to pack lighter." },
    { question: "What are formal nights on a cruise?", answer: "Formal nights typically occur once per 3 to 4 cruise nights. Men wear suits or tuxedos, women wear cocktail dresses or evening gowns. Contemporary lines are more relaxed." },
    { question: "How can I pack lighter for a cruise?", answer: "Choose a color-coordinated wardrobe, use mix-and-match pieces, take advantage of onboard laundry, and remember that casual dining options do not require dressy clothes." },
  ],
  formula: "Formal Nights = Cruise Nights / Formality Factor
Total Outfits = Casual + Formal (adjusted for laundry)",
};
