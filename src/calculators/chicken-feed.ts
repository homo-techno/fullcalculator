import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const chickenFeedCalculator: CalculatorDefinition = {
  slug: "chicken-feed-calculator",
  title: "Chicken Feed Calculator",
  description:
    "Free chicken feed calculator. Estimate the daily and monthly feed requirements for your backyard flock based on chicken type, number, age, and egg production.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "chicken feed calculator",
    "poultry feed calculator",
    "how much feed chickens",
    "backyard chicken feed",
    "chicken food consumption",
  ],
  variants: [
    {
      id: "feed-amount",
      name: "Chicken Feed Requirements",
      description: "Calculate how much feed your flock needs",
      fields: [
        {
          name: "numberOfChickens",
          label: "Number of Chickens",
          type: "number",
          placeholder: "e.g. 6",
          min: 1,
          max: 100,
        },
        {
          name: "chickenType",
          label: "Chicken Type",
          type: "select",
          options: [
            { label: "Laying Hens (standard)", value: "layer" },
            { label: "Laying Hens (heavy breed)", value: "layer_heavy" },
            { label: "Bantams", value: "bantam" },
            { label: "Meat Birds (broilers)", value: "broiler" },
            { label: "Dual Purpose", value: "dual" },
          ],
          defaultValue: "layer",
        },
        {
          name: "chickenAge",
          label: "Age Stage",
          type: "select",
          options: [
            { label: "Chick (0-8 weeks)", value: "chick" },
            { label: "Pullet (8-18 weeks)", value: "pullet" },
            { label: "Adult (18+ weeks)", value: "adult" },
          ],
          defaultValue: "adult",
        },
        {
          name: "freeRange",
          label: "Free Range Access",
          type: "select",
          options: [
            { label: "No (coop/run only)", value: "no" },
            { label: "Limited (few hours daily)", value: "limited" },
            { label: "Full Free Range", value: "full" },
          ],
          defaultValue: "limited",
        },
        {
          name: "season",
          label: "Season",
          type: "select",
          options: [
            { label: "Spring/Summer", value: "warm" },
            { label: "Fall", value: "fall" },
            { label: "Winter (cold climate)", value: "cold" },
          ],
          defaultValue: "warm",
        },
      ],
      calculate: (inputs) => {
        const numberOfChickens = inputs.numberOfChickens as number;
        const chickenType = inputs.chickenType as string;
        const chickenAge = inputs.chickenAge as string;
        const freeRange = inputs.freeRange as string;
        const season = inputs.season as string;
        if (!numberOfChickens) return null;

        // Base feed per bird per day (in pounds)
        let baseFeedPerDay: number; // lbs per bird
        let feedType: string;

        if (chickenAge === "chick") {
          baseFeedPerDay = 0.05; // starts very small
          feedType = "Chick Starter (18-20% protein)";
        } else if (chickenAge === "pullet") {
          baseFeedPerDay = 0.15;
          feedType = "Grower Feed (16-18% protein)";
        } else {
          // Adult
          switch (chickenType) {
            case "layer":
              baseFeedPerDay = 0.25; // ~1/4 lb per day
              feedType = "Layer Feed (16% protein)";
              break;
            case "layer_heavy":
              baseFeedPerDay = 0.33;
              feedType = "Layer Feed (16% protein)";
              break;
            case "bantam":
              baseFeedPerDay = 0.15;
              feedType = "Layer Feed (16% protein)";
              break;
            case "broiler":
              baseFeedPerDay = 0.45;
              feedType = "Broiler Feed (20-22% protein)";
              break;
            case "dual":
              baseFeedPerDay = 0.30;
              feedType = "All-Flock Feed (18% protein)";
              break;
            default:
              baseFeedPerDay = 0.25;
              feedType = "Layer Feed (16% protein)";
          }
        }

        // Free range reduces feed needs
        let freeRangeAdjustment = 1.0;
        if (freeRange === "full") freeRangeAdjustment = 0.75;
        else if (freeRange === "limited") freeRangeAdjustment = 0.9;

        // Winter increases feed needs (thermogenesis)
        let seasonAdjustment = 1.0;
        if (season === "cold") seasonAdjustment = 1.15;
        else if (season === "fall") seasonAdjustment = 1.05;

        const dailyPerBird = baseFeedPerDay * freeRangeAdjustment * seasonAdjustment;
        const dailyTotal = dailyPerBird * numberOfChickens;
        const weeklyTotal = dailyTotal * 7;
        const monthlyTotal = dailyTotal * 30;

        // 50 lb bag calculation
        const bagsPerMonth = monthlyTotal / 50;
        const costPerBag = 18; // average estimate
        const monthlyCost = bagsPerMonth * costPerBag;

        // Oyster shell for layers
        const oystershell = chickenType !== "broiler" && chickenAge === "adult"
          ? `${formatNumber(numberOfChickens * 0.01 * 30, 1)} lbs/month`
          : "Not needed";

        return {
          primary: {
            label: "Daily Feed (total flock)",
            value: `${formatNumber(dailyTotal, 2)} lbs`,
          },
          details: [
            { label: "Per Bird Per Day", value: `${formatNumber(dailyPerBird, 2)} lbs (${formatNumber(dailyPerBird * 16, 1)} oz)` },
            { label: "Weekly Total", value: `${formatNumber(weeklyTotal, 1)} lbs` },
            { label: "Monthly Total", value: `${formatNumber(monthlyTotal, 1)} lbs` },
            { label: "50 lb Bags per Month", value: `${formatNumber(bagsPerMonth, 1)} bags` },
            { label: "Feed Type Recommended", value: feedType },
            { label: "Oyster Shell (layers)", value: oystershell },
            { label: "Est. Monthly Cost", value: `$${formatNumber(monthlyCost, 2)}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["horse-hay-calculator", "pet-calorie-burn-calculator"],
  faq: [
    {
      question: "How much feed does a chicken eat per day?",
      answer:
        "A standard laying hen eats about 1/4 pound (4 ounces) of feed per day. Heavy breeds eat more (up to 1/3 pound), while bantams eat less (about 2.5 ounces). This amounts to roughly 1.5-2 pounds per week per bird.",
    },
    {
      question: "Does free ranging reduce feed costs?",
      answer:
        "Yes, free-range chickens can reduce their feed consumption by 10-25% by foraging for insects, seeds, and plants. However, they should still have access to complete feed to ensure proper nutrition, especially laying hens that need consistent calcium.",
    },
    {
      question: "What supplements do chickens need?",
      answer:
        "Laying hens need supplemental calcium through oyster shell offered free-choice. All chickens need grit (if not free-ranging) to grind food in their gizzard. Fresh, clean water is essential at all times. Scratch grains can be offered as a treat but should be less than 10% of the diet.",
    },
  ],
  formula:
    "Daily Feed = Base per Bird x Free Range Factor x Season Factor x Number of Birds",
};
