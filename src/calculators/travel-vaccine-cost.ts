import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const travelVaccineCost: CalculatorDefinition = {
  slug: "travel-vaccine-cost",
  title: "Travel Vaccine Cost Calculator",
  description:
    "Free online travel vaccine cost calculator. Estimate travel vaccination costs by destination and required immunizations.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "travel vaccine",
    "vaccination cost",
    "travel immunization",
    "travel health",
    "vaccine price",
  ],
  variants: [
    {
      id: "vaccine-cost",
      name: "Estimate Vaccination Costs",
      fields: [
        {
          name: "destination",
          label: "Travel Destination",
          type: "select",
          options: [
            { label: "Sub-Saharan Africa", value: "ssafrica" },
            { label: "Southeast Asia", value: "seasia" },
            { label: "South Asia (India, Nepal)", value: "sasia" },
            { label: "Central/South America", value: "latam" },
            { label: "Middle East / North Africa", value: "mena" },
            { label: "East Africa (Safari)", value: "eafrica" },
            { label: "Western Europe", value: "weurope" },
            { label: "East Asia (Japan, Korea)", value: "easia" },
          ],
        },
        {
          name: "travelers",
          label: "Number of Travelers",
          type: "number",
          placeholder: "e.g. 2",
        },
        {
          name: "hasInsurance",
          label: "Insurance Coverage",
          type: "select",
          options: [
            { label: "No Insurance Coverage", value: "none" },
            { label: "Partial Coverage (50%)", value: "partial" },
            { label: "Full Insurance Coverage", value: "full" },
          ],
        },
      ],
      calculate: (inputs) => {
        const travelers = parseFloat(inputs.travelers as string) || 1;
        const destination = inputs.destination as string;
        const hasInsurance = inputs.hasInsurance as string;

        // Vaccine costs (approximate US costs per dose)
        const vaccines: Record<string, { name: string; cost: number }[]> = {
          ssafrica: [
            { name: "Yellow Fever", cost: 250 },
            { name: "Typhoid", cost: 85 },
            { name: "Hepatitis A", cost: 100 },
            { name: "Hepatitis B", cost: 75 },
            { name: "Meningitis", cost: 160 },
            { name: "Malaria Prophylaxis", cost: 100 },
          ],
          seasia: [
            { name: "Hepatitis A", cost: 100 },
            { name: "Hepatitis B", cost: 75 },
            { name: "Typhoid", cost: 85 },
            { name: "Japanese Encephalitis", cost: 350 },
            { name: "Malaria Prophylaxis", cost: 100 },
          ],
          sasia: [
            { name: "Hepatitis A", cost: 100 },
            { name: "Hepatitis B", cost: 75 },
            { name: "Typhoid", cost: 85 },
            { name: "Japanese Encephalitis", cost: 350 },
            { name: "Rabies (pre-exposure)", cost: 400 },
            { name: "Malaria Prophylaxis", cost: 100 },
          ],
          latam: [
            { name: "Hepatitis A", cost: 100 },
            { name: "Typhoid", cost: 85 },
            { name: "Yellow Fever", cost: 250 },
            { name: "Malaria Prophylaxis", cost: 100 },
          ],
          mena: [
            { name: "Hepatitis A", cost: 100 },
            { name: "Hepatitis B", cost: 75 },
            { name: "Typhoid", cost: 85 },
          ],
          eafrica: [
            { name: "Yellow Fever", cost: 250 },
            { name: "Typhoid", cost: 85 },
            { name: "Hepatitis A", cost: 100 },
            { name: "Malaria Prophylaxis", cost: 100 },
            { name: "Rabies (pre-exposure)", cost: 400 },
          ],
          weurope: [
            { name: "Routine Boosters (Tdap)", cost: 60 },
          ],
          easia: [
            { name: "Hepatitis A", cost: 100 },
            { name: "Japanese Encephalitis", cost: 350 },
          ],
        };

        const destVaccines = vaccines[destination] || vaccines.weurope;
        const consultFee = 60;
        const vaccineTotal = destVaccines.reduce((sum, v) => sum + v.cost, 0);
        const totalPerPerson = vaccineTotal + consultFee;
        const totalAll = totalPerPerson * travelers;

        const coverageRate = hasInsurance === "full" ? 1.0 : hasInsurance === "partial" ? 0.5 : 0;
        const insuredAmount = totalAll * coverageRate;
        const outOfPocket = totalAll - insuredAmount;

        const details = destVaccines.map((v) => ({
          label: v.name,
          value: "$" + formatNumber(v.cost, 2) + " per person",
        }));

        details.push({ label: "Travel Health Consultation", value: "$" + formatNumber(consultFee, 2) + " per person" });

        return {
          primary: { label: "Out-of-Pocket Cost", value: "$" + formatNumber(outOfPocket, 2) },
          details: [
            ...details,
            { label: "Total per Person", value: "$" + formatNumber(totalPerPerson, 2) },
            { label: "Total All Travelers", value: "$" + formatNumber(totalAll, 2) },
            { label: "Insurance Coverage", value: "$" + formatNumber(insuredAmount, 2) },
          ],
          note: "Costs are estimates. Visit a travel medicine clinic 4-6 weeks before departure.",
        };
      },
    },
  ],
  relatedSlugs: ["travel-budget-daily", "backpacking-cost", "travel-adapter"],
  faq: [
    {
      question: "How much do travel vaccines cost?",
      answer:
        "Individual vaccines range from $60-$400 per dose. A full set of travel vaccines for tropical destinations can cost $500-$1,200 per person. Some insurance plans cover part of the cost.",
    },
    {
      question: "How far in advance should I get travel vaccines?",
      answer:
        "Visit a travel medicine clinic at least 4-6 weeks before departure. Some vaccines require multiple doses over weeks, and others (like Yellow Fever) need 10 days to become effective.",
    },
    {
      question: "Does health insurance cover travel vaccines?",
      answer:
        "Some insurance plans cover routine vaccinations like Hepatitis A/B and Tdap, but travel-specific vaccines like Yellow Fever and Japanese Encephalitis are often not covered. Check with your provider.",
    },
  ],
  formula:
    "Total Cost = (Sum of All Vaccine Costs + Consultation Fee) x Number of Travelers\nOut-of-Pocket = Total Cost - Insurance Coverage",
};
