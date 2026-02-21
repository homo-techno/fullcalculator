import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const travelVaccineCalculator: CalculatorDefinition = {
  slug: "travel-vaccine-calculator",
  title: "Travel Vaccine Requirement Checker",
  description:
    "Free travel vaccine checker. Find recommended and required vaccinations by destination region and estimate costs and timing.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "travel vaccine",
    "travel vaccination",
    "travel immunization",
    "travel health",
    "vaccine requirements",
  ],
  variants: [
    {
      id: "check",
      name: "Check Vaccine Requirements",
      description: "See recommended vaccines by destination region",
      fields: [
        {
          name: "destination",
          label: "Destination Region",
          type: "select",
          options: [
            { label: "Southeast Asia", value: "seasia" },
            { label: "South Asia (India, Nepal)", value: "sasia" },
            { label: "East Asia (China, Japan, Korea)", value: "easia" },
            { label: "Sub-Saharan Africa", value: "africa" },
            { label: "North Africa / Middle East", value: "mena" },
            { label: "Central America / Caribbean", value: "centralam" },
            { label: "South America", value: "southam" },
            { label: "Western Europe", value: "weurope" },
            { label: "Eastern Europe", value: "eeurope" },
            { label: "Australia / Pacific Islands", value: "pacific" },
          ],
          defaultValue: "seasia",
        },
        {
          name: "tripType",
          label: "Trip Type",
          type: "select",
          options: [
            { label: "Urban tourism only", value: "urban" },
            { label: "Rural / adventure travel", value: "rural" },
            { label: "Extended stay (1+ months)", value: "extended" },
            { label: "Volunteering / aid work", value: "volunteer" },
          ],
          defaultValue: "urban",
        },
        {
          name: "weeksBeforeTravel",
          label: "Weeks Until Travel",
          type: "number",
          placeholder: "e.g. 8",
        },
      ],
      calculate: (inputs) => {
        const destination = inputs.destination as string;
        const tripType = inputs.tripType as string;
        const weeksBeforeTravel = inputs.weeksBeforeTravel as number;
        if (!weeksBeforeTravel) return null;

        const vaccineData: Record<string, { required: string[]; recommended: string[]; rural: string[]; cost: number }> = {
          seasia: { required: [], recommended: ["Hep A", "Hep B", "Typhoid", "Tetanus"], rural: ["Japanese Encephalitis", "Rabies", "Malaria prophylaxis"], cost: 350 },
          sasia: { required: [], recommended: ["Hep A", "Hep B", "Typhoid", "Tetanus", "Polio booster"], rural: ["Japanese Encephalitis", "Rabies", "Malaria prophylaxis", "Cholera"], cost: 450 },
          easia: { required: [], recommended: ["Hep A", "Hep B", "Tetanus"], rural: ["Japanese Encephalitis", "Rabies"], cost: 250 },
          africa: { required: ["Yellow Fever"], recommended: ["Hep A", "Hep B", "Typhoid", "Tetanus", "Meningitis", "Polio booster"], rural: ["Rabies", "Malaria prophylaxis", "Cholera"], cost: 600 },
          mena: { required: [], recommended: ["Hep A", "Hep B", "Typhoid", "Tetanus"], rural: ["Rabies"], cost: 300 },
          centralam: { required: [], recommended: ["Hep A", "Hep B", "Typhoid", "Tetanus"], rural: ["Rabies", "Malaria prophylaxis"], cost: 350 },
          southam: { required: ["Yellow Fever (some areas)"], recommended: ["Hep A", "Hep B", "Typhoid", "Tetanus"], rural: ["Rabies", "Malaria prophylaxis", "Yellow Fever"], cost: 450 },
          weurope: { required: [], recommended: ["Hep A", "Tetanus"], rural: [], cost: 100 },
          eeurope: { required: [], recommended: ["Hep A", "Hep B", "Tetanus"], rural: ["Rabies", "Tick-borne Encephalitis"], cost: 200 },
          pacific: { required: [], recommended: ["Hep A", "Tetanus"], rural: ["Japanese Encephalitis"], cost: 150 },
        };

        const data = vaccineData[destination] || vaccineData.seasia;
        const isRural = tripType === "rural" || tripType === "extended" || tripType === "volunteer";
        const allVaccines = [...data.required, ...data.recommended, ...(isRural ? data.rural : [])];
        const uniqueVaccines = [...new Set(allVaccines)];
        const estimatedCost = isRural ? data.cost * 1.5 : data.cost;
        const hasEnoughTime = weeksBeforeTravel >= 6;
        const vaccineCount = uniqueVaccines.length;
        const needsMultipleVisits = vaccineCount > 3;

        return {
          primary: {
            label: "Vaccines Recommended",
            value: `${vaccineCount} vaccinations`,
          },
          details: [
            { label: "Required", value: data.required.length > 0 ? data.required.join(", ") : "None mandatory" },
            { label: "Recommended", value: data.recommended.join(", ") },
            { label: "Additional for rural/adventure", value: isRural ? data.rural.join(", ") || "None" : "N/A (urban trip)" },
            { label: "Estimated total cost", value: `$${formatNumber(estimatedCost, 0)}` },
            { label: "Time available", value: `${weeksBeforeTravel} weeks` },
            { label: "Sufficient time?", value: hasEnoughTime ? "Yes" : "Tight - see a travel clinic ASAP" },
            { label: "Clinic visits needed", value: needsMultipleVisits ? "2-3 visits" : "1-2 visits" },
          ],
          note: !hasEnoughTime
            ? "You have less than 6 weeks before travel. Some vaccines need 2-4 weeks to become effective, and multi-dose vaccines may require several weeks. See a travel health clinic immediately."
            : `You have sufficient time for all recommended vaccinations. Schedule a travel health clinic visit 6-8 weeks before departure for best results.`,
        };
      },
    },
  ],
  relatedSlugs: ["travel-checklist-calculator", "travel-insurance-calculator"],
  faq: [
    {
      question: "How far in advance should I get travel vaccines?",
      answer:
        "Visit a travel health clinic 6-8 weeks before your trip. Some vaccines need multiple doses over several weeks, and most take 2-4 weeks to reach full effectiveness. Hepatitis A and B series, for example, require multiple doses over months for full protection.",
    },
    {
      question: "Which countries require Yellow Fever vaccination?",
      answer:
        "Many countries in Sub-Saharan Africa and South America require proof of Yellow Fever vaccination. Some countries require it only if you're arriving from an endemic area. An International Certificate of Vaccination (yellow card) is required for entry.",
    },
    {
      question: "How much do travel vaccines cost?",
      answer:
        "Travel vaccines typically cost $100-$600+ depending on the destination and number of vaccines needed. Hepatitis A costs $50-$100, Typhoid $50-$100, Yellow Fever $150-$300, and Rabies $800-$1200 for the full series. Some insurance plans cover travel vaccines.",
    },
  ],
  formula:
    "Vaccine requirements are based on WHO and CDC recommendations by destination region, trip type, and duration. Costs are estimated averages at US travel clinics.",
};
