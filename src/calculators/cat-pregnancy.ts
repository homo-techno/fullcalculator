import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const catPregnancyCalculator: CalculatorDefinition = {
  slug: "cat-pregnancy-calculator",
  title: "Cat Pregnancy Calculator",
  description:
    "Free cat pregnancy/gestation calculator. Calculate your cat's due date and track feline pregnancy stages week by week.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "cat pregnancy calculator",
    "cat due date calculator",
    "cat gestation calculator",
    "how long is a cat pregnant",
    "feline pregnancy timeline",
  ],
  variants: [
    {
      id: "catDueDate",
      name: "Due Date Calculator",
      fields: [
        {
          name: "matingDay",
          label: "Mating Day (day of year, 1-365)",
          type: "number",
          placeholder: "e.g. 45 (Feb 14)",
          min: 1,
          max: 365,
        },
      ],
      calculate: (inputs) => {
        const matingDay = inputs.matingDay as number;
        if (!matingDay || matingDay < 1 || matingDay > 365) return null;

        // Cat gestation: 63-67 days, average 65
        const gestationDays = 65;
        const dueDay = ((matingDay + gestationDays - 1) % 365) + 1;
        const earliestDay = ((matingDay + 63 - 1) % 365) + 1;
        const latestDay = ((matingDay + 67 - 1) % 365) + 1;

        const dayToDate = (day: number): string => {
          const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
          const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
          let remaining = day;
          for (let m = 0; m < 12; m++) {
            if (remaining <= daysInMonth[m]) return `${months[m]} ${remaining}`;
            remaining -= daysInMonth[m];
          }
          return `Dec ${remaining}`;
        };

        const ultrasoundDay = ((matingDay + 20 - 1) % 365) + 1;

        return {
          primary: {
            label: "Expected Due Date",
            value: "~" + dayToDate(dueDay) + " (Day " + dueDay + ")",
          },
          details: [
            { label: "Mating Date", value: dayToDate(matingDay) + " (Day " + matingDay + ")" },
            { label: "Gestation Period", value: gestationDays + " days (average)" },
            { label: "Earliest Due", value: dayToDate(earliestDay) + " (Day 63)" },
            { label: "Latest Due", value: dayToDate(latestDay) + " (Day 67)" },
            { label: "Expected Litter Size", value: "3-5 kittens (range 1-12)" },
            { label: "Ultrasound Date", value: dayToDate(ultrasoundDay) + " (Day 20-25)" },
            { label: "Nipple Pinking", value: "Day 15-18 (first visible sign)" },
            {
              label: "Important",
              value: "Schedule vet visit by day 20. Avoid vaccines and flea treatments during pregnancy.",
            },
          ],
        };
      },
    },
    {
      id: "catPregnancyStage",
      name: "Current Pregnancy Stage",
      fields: [
        {
          name: "daysSinceMating",
          label: "Days Since Mating",
          type: "number",
          placeholder: "e.g. 30",
          min: 1,
          max: 70,
        },
      ],
      calculate: (inputs) => {
        const days = inputs.daysSinceMating as number;
        if (!days || days < 1) return null;

        const week = Math.ceil(days / 7);
        const daysRemaining = Math.max(0, 65 - days);

        const stages: Record<number, { stage: string; development: string; care: string }> = {
          1: { stage: "Fertilization", development: "Eggs fertilized. Embryos dividing.", care: "Normal routine. Keep cat indoors." },
          2: { stage: "Embryo Development", development: "Embryos travel to uterus. Implantation begins.", care: "Normal feeding. Avoid stress." },
          3: { stage: "Nipple Pinking", development: "Nipples become pink and enlarged ('pinking up'). ~1cm embryos.", care: "Morning sickness possible. Offer small, frequent meals." },
          4: { stage: "Confirmed Pregnancy", development: "Vet can palpate kittens. Belly starting to swell.", care: "Vet visit for confirmation. Begin increasing food." },
          5: { stage: "Rapid Growth", development: "Kittens developing rapidly. Skeletal formation.", care: "Increase food by 25%. Switch to kitten food." },
          6: { stage: "Movement Visible", development: "Kittens moving. Belly prominently enlarged.", care: "Increase food to 50% more. Prepare nesting/kittening box." },
          7: { stage: "Milk Production", development: "Mammary glands enlarging. Kittens nearly fully formed.", care: "Set up quiet birthing area. Temperature monitoring." },
          8: { stage: "Pre-Labor", development: "Nesting behavior. Restlessness. Appetite may decrease.", care: "Watch for labor signs: panting, licking, discharge." },
          9: { stage: "Labor Imminent", development: "Kittens in birth position. Contractions may start.", care: "Stay nearby. Have vet emergency number ready." },
        };

        const weekClamped = Math.min(9, Math.max(1, week));
        const info = stages[weekClamped];

        return {
          primary: {
            label: "Pregnancy Stage",
            value: "Week " + weekClamped + " - " + info.stage,
          },
          details: [
            { label: "Days Pregnant", value: days + " of ~65" },
            { label: "Days Remaining", value: formatNumber(daysRemaining, 0) },
            { label: "Development", value: info.development },
            { label: "Care Tips", value: info.care },
            { label: "Progress", value: formatNumber((days / 65) * 100, 0) + "%" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["kitten-growth-calculator", "cat-calorie-calculator", "cat-food-amount-calculator"],
  faq: [
    {
      question: "How long is a cat pregnant?",
      answer:
        "Cats are pregnant for approximately 63-67 days (about 9 weeks), with an average of 65 days from mating to birth. Kittens born before day 58 are considered premature and may need veterinary intervention. If pregnancy extends beyond 70 days, contact your veterinarian.",
    },
    {
      question: "How many kittens are in a typical litter?",
      answer:
        "The average litter size is 3-5 kittens, though litters of 1-12 are possible. First-time mothers and older cats tend to have smaller litters. Siamese and oriental breeds often have larger litters. An ultrasound at day 20-25 or X-ray after day 45 can help estimate litter size.",
    },
    {
      question: "What are the first signs of cat pregnancy?",
      answer:
        "The earliest visible sign is 'pinking up' of the nipples at around days 15-18, where they become pinker and slightly enlarged. Other early signs include increased appetite, mild morning sickness, increased affection, and slight weight gain. A veterinarian can confirm pregnancy by palpation at day 20-25.",
    },
  ],
  formula:
    "Due date = mating date + 65 days (average). Range: 63-67 days. Average litter: 3-5 kittens. Pregnancy week = days since mating / 7.",
};
