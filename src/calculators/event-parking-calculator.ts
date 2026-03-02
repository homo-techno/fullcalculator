import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const eventParkingCalculator: CalculatorDefinition = {
  slug: "event-parking-calculator",
  title: "Event Parking Calculator",
  description: "Estimate parking spaces needed for an event.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["event parking","parking spaces","parking lot event"],
  variants: [{
    id: "standard",
    name: "Event Parking",
    description: "Estimate parking spaces needed for an event.",
    fields: [
      { name: "guests", label: "Guest Count", type: "number", min: 10, max: 2000, defaultValue: 200 },
      { name: "guestsPerCar", label: "Guests per Car", type: "number", min: 1, max: 6, defaultValue: 2 },
      { name: "staffCars", label: "Staff Vehicles", type: "number", min: 0, max: 100, defaultValue: 10 },
    ],
    calculate: (inputs) => {
      const guests = inputs.guests as number;
      const perCar = inputs.guestsPerCar as number;
      const staff = inputs.staffCars as number;
      if (!guests || !perCar) return null;
      const guestCars = Math.ceil(guests / perCar);
      const total = guestCars + staff;
      const lotSqFt = total * 180;
      return {
        primary: { label: "Parking Spaces Needed", value: formatNumber(total) },
        details: [
          { label: "Guest Cars", value: formatNumber(guestCars) },
          { label: "Staff Cars", value: formatNumber(staff) },
          { label: "Lot Size Needed", value: formatNumber(lotSqFt) + " sq ft" },
        ],
      };
  },
  }],
  relatedSlugs: ["event-tent-size-calculator","event-catering-calculator"],
  faq: [
    { question: "How many parking spaces per guest?", answer: "Plan one space per 2 to 3 guests on average." },
    { question: "How big is a standard parking space?", answer: "A standard parking space is about 9 by 18 feet." },
  ],
  formula: "Spaces = ceil(Guests / Guests per Car) + Staff",
};
