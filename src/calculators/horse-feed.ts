import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const horseFeedCalculator: CalculatorDefinition = {
  slug: "horse-feed-calculator",
  title: "Horse Feed Calculator",
  description:
    "Free horse feed calculator. Calculate daily hay, grain, and water needs for your horse based on weight, workload, and life stage.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "horse feed calculator",
    "how much hay does a horse need",
    "horse grain calculator",
    "equine nutrition calculator",
    "horse feeding guide",
  ],
  variants: [
    {
      id: "horseFeed",
      name: "Daily Feed Requirements",
      fields: [
        {
          name: "weight",
          label: "Horse Weight (lbs)",
          type: "number",
          placeholder: "e.g. 1100",
          min: 200,
          max: 2500,
          step: 50,
        },
        {
          name: "workload",
          label: "Work/Activity Level",
          type: "select",
          options: [
            { label: "Maintenance (idle/light)", value: "maintenance" },
            { label: "Light Work (trail riding 1-3 hrs/wk)", value: "light" },
            { label: "Moderate Work (schooling 3-5 hrs/wk)", value: "moderate" },
            { label: "Heavy Work (competition/racing)", value: "heavy" },
          ],
        },
        {
          name: "lifeStage",
          label: "Life Stage",
          type: "select",
          options: [
            { label: "Adult (4-15 years)", value: "adult" },
            { label: "Growing (1-3 years)", value: "growing" },
            { label: "Senior (15+ years)", value: "senior" },
            { label: "Pregnant Mare (last trimester)", value: "pregnant" },
            { label: "Lactating Mare", value: "lactating" },
          ],
        },
        {
          name: "hayType",
          label: "Hay Type",
          type: "select",
          options: [
            { label: "Grass Hay (Timothy, Orchard)", value: "grass" },
            { label: "Legume Hay (Alfalfa)", value: "legume" },
            { label: "Mixed Hay", value: "mixed" },
          ],
        },
      ],
      calculate: (inputs) => {
        const weight = inputs.weight as number;
        const workload = (inputs.workload as string) || "maintenance";
        const lifeStage = (inputs.lifeStage as string) || "adult";
        const hayType = (inputs.hayType as string) || "grass";
        if (!weight || weight <= 0) return null;

        // Base: horse needs 1.5-3% of body weight in total feed per day
        // Hay should be minimum 1.5% of body weight
        const hayPercents: Record<string, number> = {
          maintenance: 2.0,
          light: 1.8,
          moderate: 1.7,
          heavy: 1.5,
        };

        const grainPercents: Record<string, number> = {
          maintenance: 0,
          light: 0.3,
          moderate: 0.5,
          heavy: 1.0,
        };

        // Life stage adjustments
        const stageMultipliers: Record<string, number> = {
          adult: 1.0,
          growing: 1.15,
          senior: 1.0,
          pregnant: 1.1,
          lactating: 1.3,
        };

        const multiplier = stageMultipliers[lifeStage] || 1.0;
        const hayLbs = weight * (hayPercents[workload] || 2.0) / 100 * multiplier;
        const grainLbs = weight * (grainPercents[workload] || 0) / 100 * multiplier;
        const totalFeedLbs = hayLbs + grainLbs;
        const totalFeedPercent = (totalFeedLbs / weight) * 100;

        // Calories estimate (grass hay ~900 cal/lb, legume ~1000 cal/lb, grain ~1500 cal/lb)
        const hayCalPerLb = hayType === "legume" ? 1000 : hayType === "mixed" ? 950 : 900;
        const dailyCals = hayLbs * hayCalPerLb + grainLbs * 1500;

        // Water: 5-10 gallons per day (0.5 gal per 100 lbs baseline)
        const waterGallons = (weight / 100) * 0.5 * (workload === "heavy" ? 1.5 : workload === "moderate" ? 1.3 : 1.0);

        // Salt: 1-2 oz per day
        const saltOz = weight > 1200 ? 2 : 1;

        // Monthly costs estimate
        const hayBales = (hayLbs * 30) / 50; // 50-lb bales
        const grainBags = grainLbs > 0 ? (grainLbs * 30) / 50 : 0; // 50-lb bags

        return {
          primary: {
            label: "Daily Hay",
            value: formatNumber(hayLbs, 1) + " lbs/day",
          },
          details: [
            { label: "Daily Grain/Concentrate", value: grainLbs > 0 ? formatNumber(grainLbs, 1) + " lbs/day" : "None needed" },
            { label: "Total Feed", value: formatNumber(totalFeedLbs, 1) + " lbs (" + formatNumber(totalFeedPercent, 1) + "% body weight)" },
            { label: "Estimated Daily Calories", value: formatNumber(dailyCals, 0) + " kcal" },
            { label: "Water", value: formatNumber(waterGallons, 1) + " gallons/day" },
            { label: "Salt", value: saltOz + " oz/day (provide free-choice salt block)" },
            { label: "Monthly Hay Bales (50 lb)", value: formatNumber(hayBales, 0) + " bales" },
            { label: "Monthly Grain Bags (50 lb)", value: grainBags > 0 ? formatNumber(grainBags, 1) + " bags" : "N/A" },
            {
              label: "Note",
              value: lifeStage === "senior"
                ? "Seniors may need soaked hay or senior feed if dental issues are present."
                : "Split hay into 2-3 feedings. Never restrict forage to less than 1.5% of body weight.",
            },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["horse-weight-calculator", "livestock-water-calculator", "pet-food-calculator"],
  faq: [
    {
      question: "How much hay does a horse need per day?",
      answer:
        "A horse should eat 1.5-2.5% of their body weight in forage (hay/pasture) daily. A 1,100-lb horse at maintenance needs about 22 lbs of hay per day. Working horses may get slightly less hay but supplement with grain. Never feed less than 1.5% body weight in forage.",
    },
    {
      question: "Does my horse need grain?",
      answer:
        "Horses in light work or at maintenance often do well on hay alone with a vitamin/mineral supplement. Grain or concentrates are typically added for horses in moderate to heavy work, growing horses, lactating mares, and hard keepers who need extra calories. Overfeeding grain can cause colic and laminitis.",
    },
    {
      question: "How much water does a horse drink?",
      answer:
        "An average horse drinks 5-10 gallons of water per day. This increases significantly in hot weather and during heavy exercise (up to 15-20 gallons). Horses should always have access to clean, fresh water. Inadequate water intake is a leading cause of impaction colic.",
    },
  ],
  formula:
    "Hay (lbs) = body weight x hay % / 100 x life stage multiplier. Grain (lbs) = body weight x grain % / 100 x life stage multiplier. Water (gal) = weight / 100 x 0.5 x work factor. Total feed should be 1.5-3% of body weight.",
};
