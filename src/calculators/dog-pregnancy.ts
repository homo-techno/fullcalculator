import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const dogPregnancyCalculator: CalculatorDefinition = {
  slug: "dog-pregnancy-calculator",
  title: "Dog Pregnancy Calculator",
  description:
    "Free dog pregnancy/gestation calculator. Calculate your dog's due date, track pregnancy stages, and know what to expect during each week of canine gestation.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "dog pregnancy calculator",
    "dog due date calculator",
    "dog gestation calculator",
    "canine pregnancy timeline",
    "how long is a dog pregnant",
  ],
  variants: [
    {
      id: "dueDate",
      name: "Due Date Calculator",
      fields: [
        {
          name: "breedingDay",
          label: "Breeding/Mating Day (day of year, 1-365)",
          type: "number",
          placeholder: "e.g. 60 (March 1)",
          min: 1,
          max: 365,
        },
        {
          name: "breedSize",
          label: "Breed Size",
          type: "select",
          options: [
            { label: "Small Breed (under 20 lbs)", value: "small" },
            { label: "Medium Breed (20-50 lbs)", value: "medium" },
            { label: "Large Breed (50-90 lbs)", value: "large" },
            { label: "Giant Breed (90+ lbs)", value: "giant" },
          ],
        },
        {
          name: "litterNumber",
          label: "Litter Number",
          type: "select",
          options: [
            { label: "First Litter", value: "first" },
            { label: "Second or Later", value: "experienced" },
          ],
        },
      ],
      calculate: (inputs) => {
        const breedingDay = inputs.breedingDay as number;
        const breedSize = (inputs.breedSize as string) || "medium";
        const litterNumber = (inputs.litterNumber as string) || "first";
        if (!breedingDay || breedingDay < 1 || breedingDay > 365) return null;

        // Dog gestation is approximately 63 days (58-68 day range)
        const gestationDays = 63;
        const dueDay = ((breedingDay + gestationDays - 1) % 365) + 1;
        const earliestDay = ((breedingDay + 58 - 1) % 365) + 1;
        const latestDay = ((breedingDay + 68 - 1) % 365) + 1;

        // Convert day of year to approximate date string
        const dayToDate = (day: number): string => {
          const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
          const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
          let remaining = day;
          for (let m = 0; m < 12; m++) {
            if (remaining <= daysInMonth[m]) {
              return `${months[m]} ${remaining}`;
            }
            remaining -= daysInMonth[m];
          }
          return `Dec ${remaining}`;
        };

        // Expected litter size by breed
        const litterSizes: Record<string, string> = {
          small: "1-4 puppies",
          medium: "4-6 puppies",
          large: "6-10 puppies",
          giant: "8-14 puppies",
        };

        // Pregnancy week stages
        const currentWeekInfo = [
          "Week 1-2: Fertilization and cell division. No visible changes.",
          "Week 3: Embryo implantation. Morning sickness possible.",
          "Week 4: Veterinary confirmation possible (ultrasound). Increase food by 10%.",
          "Week 5: Fetuses developing rapidly. Belly starting to show.",
          "Week 6: Puppies' skeletons forming. X-ray can count puppies.",
          "Week 7: Puppies nearly fully formed. Prepare whelping box.",
          "Week 8: Nesting behavior begins. Milk may be present.",
          "Week 9: Whelping imminent. Temperature drops 1-2°F before labor.",
        ];

        return {
          primary: {
            label: "Expected Due Date",
            value: "~" + dayToDate(dueDay) + " (Day " + dueDay + ")",
          },
          details: [
            { label: "Breeding Date", value: dayToDate(breedingDay) + " (Day " + breedingDay + ")" },
            { label: "Gestation Period", value: gestationDays + " days (average)" },
            { label: "Earliest Due", value: dayToDate(earliestDay) + " (Day 58)" },
            { label: "Latest Due", value: dayToDate(latestDay) + " (Day 68)" },
            { label: "Expected Litter Size", value: litterSizes[breedSize] || "4-8 puppies" },
            { label: "Ultrasound Possible", value: "Day 25-35 (Week 4)" },
            { label: "X-Ray for Count", value: "Day 45+ (Week 7)" },
            { label: "Vet Visit Before", value: dayToDate(((breedingDay + 25 - 1) % 365) + 1) + " (Day 25)" },
            {
              label: "Important",
              value: litterNumber === "first"
                ? "First-time mothers may whelp slightly early or late. Have vet's emergency number ready."
                : "Monitor temperature drop (below 99°F) which signals labor within 24 hours.",
            },
          ],
        };
      },
    },
    {
      id: "pregnancyStage",
      name: "Current Pregnancy Stage",
      fields: [
        {
          name: "daysSinceMating",
          label: "Days Since Mating",
          type: "number",
          placeholder: "e.g. 35",
          min: 1,
          max: 70,
        },
      ],
      calculate: (inputs) => {
        const days = inputs.daysSinceMating as number;
        if (!days || days < 1) return null;

        const week = Math.ceil(days / 7);
        const daysRemaining = Math.max(0, 63 - days);

        const stages: Record<number, { stage: string; development: string; care: string }> = {
          1: { stage: "Early Embryonic", development: "Sperm meets egg. Cell division begins.", care: "Normal routine. Avoid chemicals/toxins." },
          2: { stage: "Embryo Travel", development: "Embryos traveling to uterus. 4-cell to blastocyst stage.", care: "Normal diet. Avoid stress and rough play." },
          3: { stage: "Implantation", development: "Embryos implant in uterine wall. ~1mm size.", care: "Some dogs may have morning sickness. Light meals." },
          4: { stage: "Organ Formation", development: "Heart, spine, eyes forming. ~1.5cm. Ultrasound visible.", care: "Vet visit for confirmation. No vaccines during pregnancy." },
          5: { stage: "Rapid Development", development: "Toes, claws, whiskers forming. ~5cm. Sex determined.", care: "Increase food by 25%. Switch to puppy food." },
          6: { stage: "Growth Acceleration", development: "Puppies growing rapidly. Skin pigmentation developing.", care: "Increase food by 25-50%. Smaller, more frequent meals." },
          7: { stage: "Near Completion", development: "Fur developing. Puppies can be felt moving. X-ray possible.", care: "Prepare whelping box. Temperature monitoring starts." },
          8: { stage: "Pre-Whelping", development: "Puppies fully formed. Nesting behavior. Milk production.", care: "Keep area calm and quiet. Watch for labor signs." },
          9: { stage: "Whelping Imminent", development: "Puppies in position. Labor within days.", care: "Monitor temperature (drops below 99°F = labor in 24 hrs)." },
        };

        const weekClamped = Math.min(9, Math.max(1, week));
        const info = stages[weekClamped];

        return {
          primary: {
            label: "Pregnancy Stage",
            value: "Week " + weekClamped + " - " + info.stage,
          },
          details: [
            { label: "Days Pregnant", value: days + " of 63" },
            { label: "Days Remaining", value: formatNumber(daysRemaining, 0) },
            { label: "Development", value: info.development },
            { label: "Care Tips", value: info.care },
            { label: "Progress", value: formatNumber((days / 63) * 100, 0) + "%" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["puppy-growth-calculator", "dog-calorie-calculator", "dog-food-amount-calculator"],
  faq: [
    {
      question: "How long is a dog pregnant?",
      answer:
        "Dogs are pregnant for approximately 63 days (about 9 weeks) from the date of ovulation. The range is typically 58-68 days. Smaller breeds sometimes whelp a day or two earlier, while larger breeds may go slightly longer. A pregnancy lasting less than 58 or more than 68 days warrants veterinary attention.",
    },
    {
      question: "How can I tell if my dog is pregnant?",
      answer:
        "Early signs (weeks 1-3) may include decreased appetite and lethargy. By week 4, a veterinarian can confirm pregnancy via ultrasound. Around week 5-6, the belly becomes noticeably enlarged. By week 7-8, puppies can be felt moving, and nesting behavior begins. Blood tests for relaxin can confirm pregnancy as early as day 22-27.",
    },
    {
      question: "What should I feed my pregnant dog?",
      answer:
        "Feed normal amounts for the first 4 weeks, then gradually increase food by 25-50% during weeks 5-9. Switch to high-quality puppy food (higher calories and calcium). Feed smaller, more frequent meals as the puppies take up abdominal space. Ensure constant access to fresh water.",
    },
  ],
  formula:
    "Due date = breeding date + 63 days. Range: 58-68 days. Earliest due = breeding + 58 days. Latest due = breeding + 68 days. Week = days since mating / 7.",
};
