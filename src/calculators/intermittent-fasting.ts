import type { CalculatorDefinition } from "./types";

export const intermittentFastingCalculator: CalculatorDefinition = {
  slug: "intermittent-fasting-calculator",
  title: "Intermittent Fasting Calculator",
  description:
    "Free intermittent fasting calculator. Plan your eating and fasting windows for 16:8, 18:6, 20:4, or OMAD protocols. Get meal timing suggestions for your schedule.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: [
    "intermittent fasting calculator",
    "IF calculator",
    "fasting window calculator",
    "16 8 fasting calculator",
    "eating window calculator",
    "OMAD calculator",
  ],
  variants: [
    {
      id: "calc",
      name: "Plan Your Fasting Window",
      description: "Set up your intermittent fasting schedule",
      fields: [
        { name: "startHour", label: "Eating Window Start (hour, 0-23)", type: "number", placeholder: "e.g. 12", min: 0, max: 23 },
        {
          name: "protocol",
          label: "Fasting Protocol",
          type: "select",
          options: [
            { label: "16:8 (16h fast, 8h eating)", value: "16:8" },
            { label: "18:6 (18h fast, 6h eating)", value: "18:6" },
            { label: "20:4 (20h fast, 4h eating)", value: "20:4" },
            { label: "OMAD (23h fast, 1h eating)", value: "23:1" },
          ],
          defaultValue: "16:8",
        },
      ],
      calculate: (inputs) => {
        const startHour = inputs.startHour as number;
        const protocol = inputs.protocol as string;
        if (startHour === undefined || startHour === null) return null;

        const [fastHours, eatHours] = protocol.split(":").map(Number);

        const formatTime = (h: number) => {
          const hour24 = ((h % 24) + 24) % 24;
          const ampm = hour24 >= 12 ? "PM" : "AM";
          const hour12 = hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24;
          return `${hour12}:00 ${ampm}`;
        };

        const eatStart = startHour;
        const eatEnd = (startHour + eatHours) % 24;
        const fastStart = eatEnd;
        const fastEnd = eatStart;

        const details: { label: string; value: string }[] = [
          { label: "Eating Window", value: `${formatTime(eatStart)} - ${formatTime(eatEnd)} (${eatHours}h)` },
          { label: "Fasting Window", value: `${formatTime(fastStart)} - ${formatTime(fastEnd)} (${fastHours}h)` },
        ];

        if (eatHours >= 6) {
          details.push(
            { label: "Meal 1 (break fast)", value: formatTime(eatStart) },
            { label: "Meal 2 (midday)", value: formatTime(eatStart + Math.floor(eatHours / 2)) },
            { label: "Meal 3 (last meal)", value: formatTime(eatEnd - 1) },
          );
        } else if (eatHours >= 4) {
          details.push(
            { label: "Meal 1 (break fast)", value: formatTime(eatStart) },
            { label: "Meal 2 (last meal)", value: formatTime(eatEnd - 1) },
          );
        } else {
          details.push(
            { label: "Main Meal", value: formatTime(eatStart) },
          );
        }

        details.push(
          { label: "Protocol", value: `${fastHours}:${eatHours}` },
        );

        return {
          primary: { label: "Eating Window", value: `${formatTime(eatStart)} - ${formatTime(eatEnd)}` },
          details,
          note: "During fasting hours, you can have water, black coffee, and plain tea. Break your fast with a balanced meal including protein and healthy fats.",
        };
      },
    },
  ],
  relatedSlugs: ["calorie-calculator", "tdee-calculator", "calorie-deficit-calculator", "macro-calculator"],
  faq: [
    {
      question: "What is the best intermittent fasting schedule?",
      answer:
        "The 16:8 method is the most popular and easiest to maintain. You fast for 16 hours and eat within an 8-hour window. Most people skip breakfast and eat from noon to 8 PM. Start with 16:8 and progress to stricter protocols if desired.",
    },
    {
      question: "What can I consume during the fasting window?",
      answer:
        "During fasting hours, you can consume zero-calorie beverages: water, black coffee (no cream or sugar), plain tea, sparkling water, and electrolytes. Anything with calories will break your fast.",
    },
    {
      question: "Does intermittent fasting help with weight loss?",
      answer:
        "IF can help with weight loss primarily by restricting the eating window, which often leads to consuming fewer total calories. It may also improve insulin sensitivity and increase fat oxidation. However, calorie intake still matters -- you can overeat within your eating window.",
    },
  ],
  formula:
    "Eating Window = Start Time to Start Time + Eating Hours | Fasting Window = 24 - Eating Hours",
};
