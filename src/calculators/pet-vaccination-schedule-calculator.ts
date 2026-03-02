import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const petVaccinationScheduleCalculator: CalculatorDefinition = {
  slug: "pet-vaccination-schedule-calculator",
  title: "Pet Vaccination Schedule Calculator",
  description: "Determine the next vaccination due date and cost for your pet.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["pet vaccination schedule","dog vaccine timing","cat vaccine due date"],
  variants: [{
    id: "standard",
    name: "Pet Vaccination Schedule",
    description: "Determine the next vaccination due date and cost for your pet.",
    fields: [
      { name: "petType", label: "Pet Type", type: "select", options: [{ value: "1", label: "Dog" }, { value: "2", label: "Cat" }] },
      { name: "ageMonths", label: "Pet Age (months)", type: "number", min: 1, max: 240, defaultValue: 12 },
      { name: "lastVaccine", label: "Months Since Last Vaccine", type: "number", min: 0, max: 36, defaultValue: 6 },
    ],
    calculate: (inputs) => {
    const petType = inputs.petType as string;
    const ageMonths = inputs.ageMonths as number;
    const lastVaccine = inputs.lastVaccine as number;
    let intervalMonths = 12;
    if (ageMonths < 4) intervalMonths = 1;
    else if (ageMonths < 16) intervalMonths = 3;
    const monthsUntilDue = Math.max(0, intervalMonths - lastVaccine);
    const costPerVisit = petType === "1" ? 85 : 70;
    const status = monthsUntilDue === 0 ? "Overdue or Due Now" : "Due in " + monthsUntilDue + " months";
    const petName = petType === "1" ? "Dog" : "Cat";
    return {
      primary: { label: "Vaccination Status", value: status },
      details: [
        { label: "Pet Type", value: petName },
        { label: "Vaccine Interval", value: intervalMonths + " months" },
        { label: "Estimated Cost per Visit", value: "$" + formatNumber(costPerVisit) },
        { label: "Pet Age", value: ageMonths + " months" }
      ]
    };
  },
  }],
  relatedSlugs: ["vet-visit-cost-calculator","pet-weight-calculator","pet-dental-cost-calculator"],
  faq: [
    { question: "How often do dogs need vaccinations?", answer: "Puppies need vaccines every 3 to 4 weeks until 16 weeks, then annually." },
    { question: "What are core vaccines for cats?", answer: "Core cat vaccines include FVRCP and rabies, required for all cats." },
    { question: "How much do pet vaccinations cost?", answer: "Pet vaccinations typically cost $50 to $100 per visit depending on the vaccines." },
  ],
  formula: "Months Until Due = Vaccine Interval - Months Since Last Vaccine",
};
