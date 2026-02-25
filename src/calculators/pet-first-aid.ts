import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const petFirstAidCalculator: CalculatorDefinition = {
  slug: "pet-first-aid-calculator",
  title: "Pet First Aid Kit Calculator",
  description:
    "Free pet first aid kit calculator. Determine the supplies and quantities needed for your pet first aid kit based on pet type, number of pets, and travel plans.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "pet first aid kit",
    "pet first aid calculator",
    "dog first aid supplies",
    "cat first aid kit",
    "pet emergency kit",
  ],
  variants: [
    {
      id: "first-aid-kit",
      name: "First Aid Kit Contents",
      description: "Calculate what you need in your pet first aid kit",
      fields: [
        {
          name: "petType",
          label: "Primary Pet Type",
          type: "select",
          options: [
            { label: "Dog", value: "dog" },
            { label: "Cat", value: "cat" },
            { label: "Dog + Cat", value: "both" },
            { label: "Small Animal (rabbit, guinea pig)", value: "small" },
          ],
          defaultValue: "dog",
        },
        {
          name: "numberOfPets",
          label: "Total Number of Pets",
          type: "number",
          placeholder: "e.g. 2",
          min: 1,
          max: 10,
        },
        {
          name: "kitType",
          label: "Kit Type",
          type: "select",
          options: [
            { label: "Home Kit (basic)", value: "home" },
            { label: "Travel Kit (portable)", value: "travel" },
            { label: "Comprehensive (home + travel)", value: "comprehensive" },
          ],
          defaultValue: "home",
        },
        {
          name: "petSize",
          label: "Largest Pet Size",
          type: "select",
          options: [
            { label: "Small (under 20 lbs)", value: "small" },
            { label: "Medium (20-50 lbs)", value: "medium" },
            { label: "Large (over 50 lbs)", value: "large" },
          ],
          defaultValue: "medium",
        },
      ],
      calculate: (inputs) => {
        const petType = inputs.petType as string;
        const numberOfPets = inputs.numberOfPets as number;
        const kitType = inputs.kitType as string;
        const petSize = inputs.petSize as string;
        if (!numberOfPets) return null;

        // Base item counts, scaled by number of pets
        const bandageRolls = Math.max(2, Math.ceil(numberOfPets * 1.5));
        const gauzePads = Math.max(10, numberOfPets * 6);
        const adhesiveTape = Math.max(1, Math.ceil(numberOfPets / 2));
        const salineFlush = Math.max(2, numberOfPets);

        // Size-dependent items
        let muzzleSize: string;
        if (petSize === "large") muzzleSize = "Large";
        else if (petSize === "medium") muzzleSize = "Medium";
        else muzzleSize = "Small";

        const isComprehensive = kitType === "comprehensive";
        const isTravel = kitType === "travel" || isComprehensive;

        // Calculate total items
        let totalItems = 15; // base items every kit needs
        if (isTravel) totalItems += 5;
        if (isComprehensive) totalItems += 5;
        totalItems += Math.floor(numberOfPets * 2);

        // Estimated cost
        let baseCost = 35;
        if (isTravel) baseCost += 15;
        if (isComprehensive) baseCost += 25;
        baseCost += numberOfPets * 5;

        const itemList = [
          `Gauze pads: ${gauzePads}`,
          `Bandage rolls: ${bandageRolls}`,
          `Adhesive tape: ${adhesiveTape} roll(s)`,
          `Saline eye/wound wash: ${salineFlush}`,
          `Digital thermometer: 1`,
          `Blunt-tip scissors: 1`,
          `Tweezers: 1`,
          `Emergency blanket: ${Math.ceil(numberOfPets / 2)}`,
        ].join(" | ");

        return {
          primary: {
            label: "Total Kit Items",
            value: `~${formatNumber(totalItems)} items`,
          },
          details: [
            { label: "Gauze Pads", value: `${gauzePads} pads` },
            { label: "Bandage Rolls", value: `${bandageRolls} rolls` },
            { label: "Adhesive Tape", value: `${adhesiveTape} roll(s)` },
            { label: "Saline Wash Bottles", value: `${salineFlush}` },
            { label: "Muzzle Size", value: petType === "cat" || petType === "small" ? "Not needed (use towel wrap)" : muzzleSize },
            { label: "Emergency Blankets", value: `${Math.ceil(numberOfPets / 2)}` },
            { label: "Estimated Kit Cost", value: `$${formatNumber(baseCost)}` },
          ],
          note: "Always include your vet's phone number and a pet poison control hotline (ASPCA: 888-426-4435). Consult your vet about including medications like Benadryl or styptic powder.",
        };
      },
    },
  ],
  relatedSlugs: ["pet-calorie-burn-calculator", "dog-collar-size-calculator"],
  faq: [
    {
      question: "What should be in a pet first aid kit?",
      answer:
        "Essential items include: gauze pads and rolls, adhesive tape, bandage scissors, tweezers, digital thermometer, saline wound wash, antiseptic wipes, emergency blanket, latex gloves, and your vet's contact information. A comprehensive kit also includes a muzzle, splint materials, and a pet first aid manual.",
    },
    {
      question: "Can I use human first aid supplies for pets?",
      answer:
        "Many human first aid supplies (gauze, bandages, saline solution) are safe for pets. However, never use human medications without consulting a vet, as many are toxic to animals (e.g., ibuprofen, acetaminophen). Always have pet-specific supplies where possible.",
    },
    {
      question: "When should I take my pet to an emergency vet?",
      answer:
        "Seek emergency vet care for: difficulty breathing, seizures, bleeding that won't stop, suspected poisoning, inability to walk or stand, bloated abdomen (dogs), straining to urinate (especially male cats), loss of consciousness, or any severe injury. When in doubt, always call your vet.",
    },
  ],
  formula:
    "Kit Items = Base Items (15) + Travel Items + Comprehensive Items + (Pets x 2)",
};
