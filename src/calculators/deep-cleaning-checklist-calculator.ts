import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const deepCleaningChecklistCalculator: CalculatorDefinition = {
  slug: "deep-cleaning-checklist-calculator",
  title: "Deep Cleaning Checklist Calculator",
  description: "Estimate total deep cleaning time for your home.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["deep","cleaning","checklist","time"],
  variants: [{
    id: "standard",
    name: "Deep Cleaning Checklist",
    description: "Estimate total deep cleaning time for your home.",
    fields: [
      { name: "rooms", label: "Number of Rooms", type: "number", min: 1, max: 15, defaultValue: 5 },
      { name: "bathrooms", label: "Number of Bathrooms", type: "number", min: 1, max: 6, defaultValue: 2 },
      { name: "kitchen", label: "Kitchen Deep Clean", type: "select", options: [{ value: "60", label: "Standard" }, { value: "90", label: "Thorough" }, { value: "120", label: "Full Detail" }] },
    ],
    calculate: (inputs) => {
    const rooms = inputs.rooms as number;
    const bathrooms = inputs.bathrooms as number;
    const kitchen = inputs.kitchen as number;
    const roomTime = rooms * 40;
    const bathroomTime = bathrooms * 45;
    const kitchenTime = kitchen;
    const totalMinutes = roomTime + bathroomTime + kitchenTime;
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return { primary: { label: "Total Deep Clean Time", value: hours + "h " + minutes + "m" }, details: [{ label: "Room Time", value: roomTime + " minutes" }, { label: "Bathroom Time", value: bathroomTime + " minutes" }, { label: "Kitchen Time", value: kitchenTime + " minutes" }] };
  },
  }],
  relatedSlugs: ["house-cleaning-time-calculator","maid-service-cost-calculator","cleaning-supply-calculator"],
  faq: [
    { question: "How long does a deep clean take?", answer: "About 3 to 6 hours for an average-sized home." },
    { question: "What is included in a deep clean?", answer: "Baseboards, vents, inside appliances, and grout scrubbing." },
    { question: "How often should you deep clean?", answer: "Every 1 to 3 months for best results." },
  ],
  formula: "Total = Rooms * 40 + Bathrooms * 45 + KitchenTime",
};
