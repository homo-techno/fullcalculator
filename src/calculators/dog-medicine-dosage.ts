import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const dogMedicineDosageCalculator: CalculatorDefinition = {
  slug: "dog-medicine-dosage-calculator",
  title: "Dog Medicine Dosage Calculator",
  description:
    "Free dog medicine dosage calculator. Calculate safe medication doses for your dog by weight for common over-the-counter medications. Always verify with your veterinarian.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "dog medicine dosage",
    "dog medication calculator",
    "dog Benadryl dosage",
    "dog aspirin dose by weight",
    "dog medication dose chart",
  ],
  variants: [
    {
      id: "medicineDosage",
      name: "Medicine Dosage by Weight",
      fields: [
        {
          name: "weight",
          label: "Dog's Weight (lbs)",
          type: "number",
          placeholder: "e.g. 50",
          min: 1,
          max: 250,
          step: 1,
        },
        {
          name: "medication",
          label: "Medication",
          type: "select",
          options: [
            { label: "Benadryl (diphenhydramine)", value: "benadryl" },
            { label: "Pepcid AC (famotidine)", value: "pepcid" },
            { label: "Buffered Aspirin", value: "aspirin" },
            { label: "Hydrogen Peroxide (emetic)", value: "h2o2" },
            { label: "Melatonin", value: "melatonin" },
            { label: "Fish Oil (Omega-3)", value: "fishoil" },
          ],
        },
      ],
      calculate: (inputs) => {
        const weight = inputs.weight as number;
        const medication = (inputs.medication as string) || "benadryl";
        if (!weight || weight <= 0) return null;

        const weightKg = weight * 0.453592;

        interface MedInfo {
          doseMgPerKg: number;
          maxDoseMg: number;
          frequency: string;
          commonStrength: string;
          notes: string;
          name: string;
        }

        const meds: Record<string, MedInfo> = {
          benadryl: {
            name: "Benadryl (Diphenhydramine)",
            doseMgPerKg: 2,
            maxDoseMg: 100,
            frequency: "Every 8-12 hours",
            commonStrength: "25 mg tablets",
            notes: "Use plain diphenhydramine only. Avoid formulas with pseudoephedrine or xylitol.",
          },
          pepcid: {
            name: "Pepcid AC (Famotidine)",
            doseMgPerKg: 0.5,
            maxDoseMg: 40,
            frequency: "Once or twice daily",
            commonStrength: "10 mg or 20 mg tablets",
            notes: "Give 30 minutes before a meal. Use original formula, not maximum strength.",
          },
          aspirin: {
            name: "Buffered Aspirin",
            doseMgPerKg: 10,
            maxDoseMg: 600,
            frequency: "Every 12 hours (short-term only)",
            commonStrength: "325 mg tablets",
            notes: "Short-term use only (1-2 days). Never give to cats. May cause GI upset. Consult vet first.",
          },
          h2o2: {
            name: "Hydrogen Peroxide 3% (Emetic)",
            doseMgPerKg: 0,
            maxDoseMg: 0,
            frequency: "One-time use only, under vet guidance",
            commonStrength: "3% solution",
            notes: "ONLY use under veterinarian direction. 1 tsp per 5 lbs, max 3 tbsp. Do NOT use for caustic substance ingestion.",
          },
          melatonin: {
            name: "Melatonin",
            doseMgPerKg: 0,
            maxDoseMg: 0,
            frequency: "1-2 times daily as needed",
            commonStrength: "1 mg, 3 mg, or 5 mg tablets",
            notes: "Ensure product is xylitol-free. Used for anxiety, sleep, and Cushing's disease support.",
          },
          fishoil: {
            name: "Fish Oil (Omega-3 EPA/DHA)",
            doseMgPerKg: 0,
            maxDoseMg: 0,
            frequency: "Daily with food",
            commonStrength: "1000 mg capsules (varies in EPA/DHA)",
            notes: "Recommended EPA dose: 20 mg per lb of body weight. Supports skin, coat, joints, and heart.",
          },
        };

        const med = meds[medication];
        let doseMg: number;
        let doseDisplay = "";

        if (medication === "h2o2") {
          const tsp = weight / 5;
          const maxTsp = 9; // 3 tablespoons = 9 tsp
          const actualTsp = Math.min(tsp, maxTsp);
          doseDisplay = formatNumber(actualTsp, 1) + " tsp (3% solution)";
          doseMg = 0;
        } else if (medication === "melatonin") {
          let melDose: number;
          if (weight < 10) melDose = 1;
          else if (weight < 25) melDose = 1.5;
          else if (weight < 100) melDose = 3;
          else melDose = 5;
          doseMg = melDose;
          doseDisplay = formatNumber(melDose, 1) + " mg";
        } else if (medication === "fishoil") {
          const epaDose = 20 * weight; // mg EPA per day
          doseMg = epaDose;
          doseDisplay = formatNumber(epaDose, 0) + " mg EPA";
        } else {
          doseMg = Math.min(med.doseMgPerKg * weightKg, med.maxDoseMg);
          doseDisplay = formatNumber(doseMg, 1) + " mg";
        }

        return {
          primary: {
            label: "Recommended Dose",
            value: doseDisplay,
          },
          details: [
            { label: "Medication", value: med.name },
            { label: "Dog Weight", value: formatNumber(weight, 0) + " lbs (" + formatNumber(weightKg, 1) + " kg)" },
            { label: "Frequency", value: med.frequency },
            { label: "Common Strength", value: med.commonStrength },
            { label: "Important Notes", value: med.notes },
            {
              label: "WARNING",
              value: "This calculator is for reference only. ALWAYS consult your veterinarian before giving any medication. Individual dogs may have contraindications or allergies.",
            },
          ],
          note: "Never give human medications to your dog without veterinary approval. Some common human drugs are toxic to dogs.",
        };
      },
    },
  ],
  relatedSlugs: ["dog-weight-calculator", "pet-medication-dose-calculator", "dog-chocolate-toxicity-calculator"],
  faq: [
    {
      question: "What human medications are safe for dogs?",
      answer:
        "Some commonly used human medications for dogs (with vet approval) include Benadryl (diphenhydramine), Pepcid AC (famotidine), and buffered aspirin for short-term use. However, NEVER give your dog medication without consulting your vet first, as dosages and safety vary by individual dog.",
    },
    {
      question: "How much Benadryl can I give my dog?",
      answer:
        "The standard veterinary dosage for Benadryl is 1 mg per pound of body weight (2 mg/kg), given 2-3 times daily. A 50-lb dog would get about 50 mg (two 25-mg tablets). Always use plain diphenhydramine and avoid formulations with decongestants or xylitol.",
    },
    {
      question: "What medications are toxic to dogs?",
      answer:
        "Many common human medications are toxic to dogs, including ibuprofen (Advil/Motrin), acetaminophen (Tylenol), pseudoephedrine, and xylitol-containing medications. Antidepressants, ADHD medications, and sleep aids are also common causes of pet poisoning. Always keep medications out of reach and consult your vet.",
    },
  ],
  formula:
    "Benadryl: 2 mg/kg, max 100 mg. Pepcid: 0.5 mg/kg, max 40 mg. Aspirin: 10 mg/kg, max 600 mg (short-term). H2O2 (3%): 1 tsp per 5 lbs, max 3 tbsp. Melatonin: <10 lbs = 1 mg, 10-25 lbs = 1.5 mg, 25-100 lbs = 3 mg, >100 lbs = 5 mg. Fish Oil EPA: 20 mg per lb.",
};
