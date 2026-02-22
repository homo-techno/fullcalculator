import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const dogChocolateToxicityCalculator: CalculatorDefinition = {
  slug: "dog-chocolate-toxicity-calculator",
  title: "Dog Chocolate Toxicity Calculator",
  description:
    "Free dog chocolate toxicity calculator. Determine if the amount of chocolate your dog ate is dangerous based on weight and chocolate type. Get emergency guidance instantly.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "dog chocolate toxicity",
    "chocolate poisoning dog",
    "dog ate chocolate",
    "theobromine toxicity dog",
    "chocolate dangerous for dogs",
  ],
  variants: [
    {
      id: "chocolateToxicity",
      name: "Chocolate Toxicity Assessment",
      fields: [
        {
          name: "dogWeight",
          label: "Dog's Weight (lbs)",
          type: "number",
          placeholder: "e.g. 30",
          min: 1,
          max: 250,
          step: 1,
        },
        {
          name: "chocolateType",
          label: "Chocolate Type",
          type: "select",
          options: [
            { label: "Milk Chocolate", value: "milk" },
            { label: "Dark Chocolate (60-69%)", value: "dark" },
            { label: "Dark Chocolate (70-85%)", value: "dark_high" },
            { label: "Baker's / Unsweetened Chocolate", value: "bakers" },
            { label: "White Chocolate", value: "white" },
            { label: "Cocoa Powder (dry)", value: "cocoa" },
          ],
        },
        {
          name: "amountOz",
          label: "Amount Eaten (oz)",
          type: "number",
          placeholder: "e.g. 2",
          min: 0.1,
          max: 100,
          step: 0.1,
        },
      ],
      calculate: (inputs) => {
        const dogWeight = inputs.dogWeight as number;
        const chocolateType = (inputs.chocolateType as string) || "milk";
        const amountOz = inputs.amountOz as number;
        if (!dogWeight || dogWeight <= 0 || !amountOz || amountOz <= 0) return null;

        const dogWeightKg = dogWeight * 0.453592;
        const amountG = amountOz * 28.3495;

        // Theobromine content mg per gram of chocolate
        const theobrominePerGram: Record<string, number> = {
          white: 0.04,
          milk: 1.5,
          dark: 5.5,
          dark_high: 8.0,
          bakers: 14.0,
          cocoa: 20.0,
        };

        const totalTheobromine = amountG * theobrominePerGram[chocolateType];
        const dosePerKg = totalTheobromine / dogWeightKg;

        let severity = "";
        let action = "";
        if (dosePerKg < 20) {
          severity = "Mild / Unlikely Toxicity";
          action = "Monitor for mild GI upset. Usually safe but watch for vomiting or diarrhea.";
        } else if (dosePerKg < 40) {
          severity = "Moderate Toxicity";
          action = "Contact your veterinarian. May cause vomiting, diarrhea, increased heart rate, and restlessness.";
        } else if (dosePerKg < 60) {
          severity = "Severe Toxicity";
          action = "CALL YOUR VET OR EMERGENCY ANIMAL HOSPITAL IMMEDIATELY. Risk of tremors, seizures, and cardiac issues.";
        } else {
          severity = "POTENTIALLY LETHAL";
          action = "EMERGENCY! Seek immediate veterinary care. Potentially fatal dose - do not wait for symptoms.";
        }

        const typeLabels: Record<string, string> = {
          white: "White Chocolate",
          milk: "Milk Chocolate",
          dark: "Dark Chocolate (60-69%)",
          dark_high: "Dark Chocolate (70-85%)",
          bakers: "Baker's/Unsweetened",
          cocoa: "Cocoa Powder",
        };

        return {
          primary: {
            label: "Toxicity Level",
            value: severity,
          },
          details: [
            { label: "Theobromine Ingested", value: formatNumber(totalTheobromine, 1) + " mg" },
            { label: "Dose Per Body Weight", value: formatNumber(dosePerKg, 1) + " mg/kg" },
            { label: "Chocolate Type", value: typeLabels[chocolateType] },
            { label: "Amount Eaten", value: formatNumber(amountOz, 1) + " oz (" + formatNumber(amountG, 0) + " g)" },
            { label: "Dog Weight", value: formatNumber(dogWeight, 1) + " lbs (" + formatNumber(dogWeightKg, 1) + " kg)" },
            { label: "Recommended Action", value: action },
          ],
          note: "This calculator is for guidance only. When in doubt, ALWAYS contact your veterinarian or the ASPCA Animal Poison Control Center (888-426-4435).",
        };
      },
    },
  ],
  relatedSlugs: ["dog-weight-calculator", "dog-medicine-dosage-calculator", "dog-calorie-calculator"],
  faq: [
    {
      question: "How much chocolate is toxic to dogs?",
      answer:
        "Toxicity depends on the type of chocolate and the dog's weight. As a general rule, theobromine doses above 20 mg/kg can cause mild symptoms, above 40 mg/kg causes moderate toxicity, and above 60 mg/kg can be life-threatening. Dark chocolate and baker's chocolate are far more dangerous than milk chocolate.",
    },
    {
      question: "What are the symptoms of chocolate poisoning in dogs?",
      answer:
        "Symptoms typically appear 6-12 hours after ingestion and include vomiting, diarrhea, rapid breathing, increased heart rate, restlessness, excessive urination, muscle tremors, and in severe cases seizures or cardiac failure.",
    },
    {
      question: "What should I do if my dog ate chocolate?",
      answer:
        "First, determine how much and what type of chocolate was eaten. Use this calculator to assess severity. For any amount of dark or baker's chocolate, or large amounts of milk chocolate, contact your veterinarian or the ASPCA Animal Poison Control Center (888-426-4435) immediately. Do not induce vomiting unless directed by a veterinarian.",
    },
  ],
  formula:
    "Total Theobromine (mg) = chocolate amount (g) x theobromine concentration (mg/g). Dose (mg/kg) = Total Theobromine / dog weight (kg). Theobromine per gram: white 0.04, milk 1.5, dark 60-69% = 5.5, dark 70-85% = 8.0, baker's 14.0, cocoa powder 20.0. Toxicity thresholds: <20 mg/kg mild, 20-40 mg/kg moderate, 40-60 mg/kg severe, >60 mg/kg potentially lethal.",
};
