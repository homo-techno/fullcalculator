import type { CalculatorDefinition } from "./types";

const compatibilityChart: Record<string, { canDonateTo: string[]; canReceiveFrom: string[] }> = {
  "O-": { canDonateTo: ["O-", "O+", "A-", "A+", "B-", "B+", "AB-", "AB+"], canReceiveFrom: ["O-"] },
  "O+": { canDonateTo: ["O+", "A+", "B+", "AB+"], canReceiveFrom: ["O-", "O+"] },
  "A-": { canDonateTo: ["A-", "A+", "AB-", "AB+"], canReceiveFrom: ["O-", "A-"] },
  "A+": { canDonateTo: ["A+", "AB+"], canReceiveFrom: ["O-", "O+", "A-", "A+"] },
  "B-": { canDonateTo: ["B-", "B+", "AB-", "AB+"], canReceiveFrom: ["O-", "B-"] },
  "B+": { canDonateTo: ["B+", "AB+"], canReceiveFrom: ["O-", "O+", "B-", "B+"] },
  "AB-": { canDonateTo: ["AB-", "AB+"], canReceiveFrom: ["O-", "A-", "B-", "AB-"] },
  "AB+": { canDonateTo: ["AB+"], canReceiveFrom: ["O-", "O+", "A-", "A+", "B-", "B+", "AB-", "AB+"] },
};

export const bloodTypeCompatibilityCalculator: CalculatorDefinition = {
  slug: "blood-type-compatibility-calculator",
  title: "Blood Type Compatibility Calculator",
  description:
    "Free blood type compatibility calculator. Check donor and recipient blood type compatibility for transfusions. Find who you can donate to and receive from.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: [
    "blood type compatibility",
    "blood transfusion",
    "blood donor",
    "blood type chart",
    "blood type matching",
    "universal donor",
  ],
  variants: [
    {
      id: "compatibility",
      name: "Check Blood Type Compatibility",
      description: "Find donation and receiving compatibility for your blood type",
      fields: [
        {
          name: "bloodType",
          label: "Your Blood Type",
          type: "select",
          options: [
            { label: "A+", value: "A+" },
            { label: "A-", value: "A-" },
            { label: "B+", value: "B+" },
            { label: "B-", value: "B-" },
            { label: "AB+", value: "AB+" },
            { label: "AB-", value: "AB-" },
            { label: "O+", value: "O+" },
            { label: "O-", value: "O-" },
          ],
        },
      ],
      calculate: (inputs) => {
        const bt = inputs.bloodType as string;
        if (!bt) return null;
        const info = compatibilityChart[bt];
        if (!info) return null;
        const isUniversalDonor = bt === "O-";
        const isUniversalRecipient = bt === "AB+";
        let specialNote = "";
        if (isUniversalDonor) specialNote = "You are a universal red blood cell donor!";
        if (isUniversalRecipient) specialNote = "You are a universal recipient!";
        return {
          primary: { label: "Blood Type", value: bt },
          details: [
            { label: "Can donate to", value: info.canDonateTo.join(", ") },
            { label: "Can receive from", value: info.canReceiveFrom.join(", ") },
            { label: "Compatible donors", value: String(info.canReceiveFrom.length) },
            { label: "Can donate to # types", value: String(info.canDonateTo.length) },
            ...(specialNote ? [{ label: "Special status", value: specialNote }] : []),
          ],
          note: "This calculator covers red blood cell compatibility only. Plasma compatibility follows different rules. Always rely on hospital cross-matching before any transfusion. This is not medical advice.",
        };
      },
    },
    {
      id: "donor-match",
      name: "Donor-Recipient Match",
      description: "Check if a specific donor and recipient are compatible",
      fields: [
        {
          name: "donorType",
          label: "Donor Blood Type",
          type: "select",
          options: [
            { label: "A+", value: "A+" },
            { label: "A-", value: "A-" },
            { label: "B+", value: "B+" },
            { label: "B-", value: "B-" },
            { label: "AB+", value: "AB+" },
            { label: "AB-", value: "AB-" },
            { label: "O+", value: "O+" },
            { label: "O-", value: "O-" },
          ],
        },
        {
          name: "recipientType",
          label: "Recipient Blood Type",
          type: "select",
          options: [
            { label: "A+", value: "A+" },
            { label: "A-", value: "A-" },
            { label: "B+", value: "B+" },
            { label: "B-", value: "B-" },
            { label: "AB+", value: "AB+" },
            { label: "AB-", value: "AB-" },
            { label: "O+", value: "O+" },
            { label: "O-", value: "O-" },
          ],
        },
      ],
      calculate: (inputs) => {
        const donor = inputs.donorType as string;
        const recipient = inputs.recipientType as string;
        if (!donor || !recipient) return null;
        const donorInfo = compatibilityChart[donor];
        if (!donorInfo) return null;
        const isCompatible = donorInfo.canDonateTo.includes(recipient);
        return {
          primary: { label: "Compatibility", value: isCompatible ? "Compatible" : "Not Compatible" },
          details: [
            { label: "Donor", value: donor },
            { label: "Recipient", value: recipient },
            { label: "Result", value: isCompatible ? "Transfusion is possible (red blood cells)" : "Transfusion is NOT possible" },
          ],
          note: "This is for educational purposes only. Actual transfusion compatibility requires laboratory cross-matching. This is not medical advice.",
        };
      },
    },
  ],
  relatedSlugs: ["blood-volume-calculator", "blood-pressure-calculator"],
  faq: [
    {
      question: "What is the universal donor blood type?",
      answer:
        "O-negative (O-) is the universal red blood cell donor type. O- red blood cells can be given to anyone regardless of blood type, making it critical for emergency transfusions.",
    },
    {
      question: "What is the universal recipient blood type?",
      answer:
        "AB+ is the universal recipient. People with AB+ blood can receive red blood cells from any blood type.",
    },
    {
      question: "What is the rarest blood type?",
      answer:
        "AB-negative is the rarest blood type, found in less than 1% of the population. O+ is the most common, found in about 37% of people.",
    },
    {
      question: "Why does blood type compatibility matter?",
      answer:
        "Receiving incompatible blood can cause a hemolytic transfusion reaction, where your immune system attacks the donated red blood cells. This can be life-threatening.",
    },
  ],
  formula:
    "Blood type compatibility is determined by the presence or absence of A, B, and Rh(D) antigens on red blood cells. Recipients must not receive antigens they lack.",
};
