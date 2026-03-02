import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const carSeatFitCalculator: CalculatorDefinition = {
  slug: "car-seat-fit-calculator",
  title: "Car Seat Fit Calculator",
  description: "Determine the right car seat type for your child based on age, weight, and height following current safety guidelines.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["car seat fit","child car seat","car seat type","car seat safety","child restraint calculator"],
  variants: [{
    id: "standard",
    name: "Car Seat Fit",
    description: "Determine the right car seat type for your child based on age, weight, and height following current safety guidelines.",
    fields: [
      { name: "childAge", label: "Child Age (months)", type: "number", min: 0, max: 144, defaultValue: 24 },
      { name: "childWeight", label: "Child Weight (lbs)", type: "number", min: 4, max: 120, defaultValue: 30 },
      { name: "childHeight", label: "Child Height (inches)", type: "number", min: 18, max: 60, defaultValue: 34 },
      { name: "vehicleType", label: "Vehicle Type", type: "select", options: [{ value: "1", label: "Sedan" }, { value: "2", label: "SUV" }, { value: "3", label: "Minivan" }, { value: "4", label: "Truck (Extended Cab)" }], defaultValue: "1" },
    ],
    calculate: (inputs) => {
    const ageMonths = inputs.childAge as number;
    const weight = inputs.childWeight as number;
    const height = inputs.childHeight as number;
    const vehicle = parseInt(inputs.vehicleType as string);
    let seatType = "";
    let facing = "";
    let notes = "";
    if (ageMonths < 24 || weight < 25 || height < 30) {
      seatType = "Rear-Facing Infant/Convertible Seat";
      facing = "Rear-Facing";
      notes = "Keep rear-facing as long as possible, ideally until age 2 or max seat weight/height";
    } else if (weight < 65 && height < 49 && ageMonths < 84) {
      seatType = "Forward-Facing Convertible Seat with Harness";
      facing = "Forward-Facing";
      notes = "Use the harness until the child exceeds the seat weight or height limit";
    } else if (weight < 100 && height < 57 && ageMonths < 144) {
      seatType = "Booster Seat (High-Back or Backless)";
      facing = "Forward-Facing";
      notes = "Seat belt should fit properly across chest and lap when using booster";
    } else {
      seatType = "Vehicle Seat Belt Only";
      facing = "Forward-Facing";
      notes = "Belt should lie across upper thighs and chest, not stomach or neck";
    }
    const rearSeatSpace = { 1: "Standard", 2: "Ample", 3: "Ample", 4: "Limited" };
    return {
      primary: { label: "Recommended Seat Type", value: seatType },
      details: [
        { label: "Orientation", value: facing },
        { label: "Child Age", value: formatNumber(Math.floor(ageMonths / 12)) + " years " + formatNumber(ageMonths % 12) + " months" },
        { label: "Rear Seat Space", value: rearSeatSpace[vehicle] || "Standard" },
        { label: "Safety Note", value: notes }
      ]
    };
  },
  }],
  relatedSlugs: ["car-annual-maintenance-cost-calculator","car-fuel-tank-range-calculator"],
  faq: [
    { question: "When should a child switch from rear-facing to forward-facing?", answer: "The American Academy of Pediatrics recommends keeping children rear-facing until at least age 2, or until they exceed the maximum weight or height limit of their rear-facing car seat." },
    { question: "When can my child use just a seat belt?", answer: "Children should use a booster seat until the vehicle seat belt fits properly, typically when they are 4 feet 9 inches tall and between 8 and 12 years old." },
    { question: "Can I use a car seat in the front seat?", answer: "Children under 13 should always ride in the back seat. A rear-facing car seat should never be placed in front of an active airbag." },
  ],
  formula: "Rear-Facing: Under 2 years OR under 25 lbs OR under 30 inches
Forward-Facing Harness: 2-7 years AND under 65 lbs AND under 49 inches
Booster: Until seat belt fits properly (typically 4 ft 9 in, 80-100 lbs)",
};
