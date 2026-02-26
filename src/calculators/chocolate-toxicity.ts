import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const chocolateToxicityCalculator: CalculatorDefinition = {
  slug: "chocolate-toxicity-calculator",
  title: "Dog Chocolate Toxicity Calculator",
  description:
    "Free online dog chocolate toxicity calculator. Determine the danger level if your dog ate chocolate based on dog weight, chocolate type, and amount consumed.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: [
    "chocolate toxicity calculator",
    "dog ate chocolate calculator",
    "theobromine toxicity dog",
    "chocolate poisoning dog",
    "dog chocolate danger calculator",
  ],
  variants: [
    {
      id: "toxicity",
      name: "Chocolate Toxicity Check",
      description: "Check chocolate toxicity level for your dog",
      fields: [
        { name: "dogWeight", label: "Dog's Weight", type: "number", placeholder: "e.g. 30", suffix: "lbs" },
        {
          name: "chocolateType",
          label: "Type of Chocolate",
          type: "select",
          options: [
            { label: "White chocolate", value: "white" },
            { label: "Milk chocolate", value: "milk" },
            { label: "Dark chocolate (60-69%)", value: "dark" },
            { label: "Dark chocolate (70-85%)", value: "very_dark" },
            { label: "Baker's / unsweetened chocolate", value: "bakers" },
            { label: "Cocoa powder (dry)", value: "cocoa" },
          ],
          defaultValue: "milk",
        },
        { name: "amountOz", label: "Amount Consumed", type: "number", placeholder: "e.g. 2", suffix: "oz" },
      ],
      calculate: (inputs) => {
        const dogWeight = parseFloat(inputs.dogWeight as string) || 0;
        const type = inputs.chocolateType as string;
        const amount = parseFloat(inputs.amountOz as string) || 0;
        if (!dogWeight || !amount) return null;

        // Theobromine content (mg per oz of chocolate)
        const theobrominePerOz: Record<string, number> = {
          white: 0.25,
          milk: 58,
          dark: 130,
          very_dark: 228,
          bakers: 393,
          cocoa: 737,
        };

        // Caffeine content (mg per oz)
        const caffeinePerOz: Record<string, number> = {
          white: 0.85,
          milk: 6,
          dark: 20,
          very_dark: 35,
          bakers: 47,
          cocoa: 70,
        };

        const dogWeightKg = dogWeight * 0.4536;
        const totalTheobromine = (theobrominePerOz[type] || 0) * amount;
        const totalCaffeine = (caffeinePerOz[type] || 0) * amount;
        const theobrominePerKg = totalTheobromine / dogWeightKg;

        // Toxicity levels for theobromine:
        // <20 mg/kg: usually mild or no symptoms
        // 20-40 mg/kg: mild symptoms (vomiting, diarrhea, restlessness)
        // 40-60 mg/kg: moderate symptoms (rapid heart rate, hyperactivity)
        // >60 mg/kg: severe (seizures, muscle tremors, possible death)
        // Lethal dose: ~100-200 mg/kg

        let severity: string;
        let recommendation: string;
        if (theobrominePerKg < 20) {
          severity = "LOW RISK";
          recommendation = "Monitor for mild symptoms (upset stomach). Usually no treatment needed.";
        } else if (theobrominePerKg < 40) {
          severity = "MILD TOXICITY";
          recommendation = "Symptoms likely (vomiting, diarrhea, restlessness). Call your vet.";
        } else if (theobrominePerKg < 60) {
          severity = "MODERATE TOXICITY";
          recommendation = "Seek veterinary care immediately. Symptoms may include rapid heart rate and hyperactivity.";
        } else {
          severity = "SEVERE TOXICITY - EMERGENCY";
          recommendation = "GO TO AN EMERGENCY VET IMMEDIATELY. Risk of seizures, cardiac failure, and death.";
        }

        return {
          primary: { label: "Toxicity Level", value: severity },
          details: [
            { label: "Theobromine ingested", value: `${formatNumber(totalTheobromine)} mg` },
            { label: "Theobromine per kg body weight", value: `${formatNumber(theobrominePerKg)} mg/kg` },
            { label: "Caffeine ingested", value: `${formatNumber(totalCaffeine)} mg` },
            { label: "Dog weight", value: `${formatNumber(dogWeight)} lbs (${formatNumber(dogWeightKg)} kg)` },
            { label: "Chocolate amount", value: `${formatNumber(amount)} oz` },
          ],
          note: recommendation,
        };
      },
    },
  ],
  relatedSlugs: ["dog-food-calculator", "puppy-weight-calculator", "pet-insurance-calculator"],
  faq: [
    {
      question: "Why is chocolate toxic to dogs?",
      answer:
        "Chocolate contains theobromine and caffeine, which dogs metabolize much more slowly than humans. Theobromine can cause vomiting, diarrhea, rapid heart rate, seizures, and in severe cases, death. Darker chocolate contains more theobromine and is more dangerous.",
    },
    {
      question: "What should I do if my dog ate chocolate?",
      answer:
        "Note the type and amount of chocolate and your dog's weight, then call your vet or the ASPCA Animal Poison Control Center (888-426-4435). Do not induce vomiting unless instructed by a veterinarian. Time is critical for severe cases.",
    },
    {
      question: "Which type of chocolate is most dangerous for dogs?",
      answer:
        "Cocoa powder and baker's chocolate are the most dangerous due to high theobromine content (393-737 mg/oz). Dark chocolate is also very dangerous (130-228 mg/oz). Milk chocolate is less toxic (58 mg/oz) and white chocolate has negligible theobromine.",
    },
  ],
  formula: "Toxicity = (Theobromine per oz x Amount) / Dog Weight in kg; Thresholds: <20 mg/kg low, 20-40 mild, 40-60 moderate, >60 severe",
};
