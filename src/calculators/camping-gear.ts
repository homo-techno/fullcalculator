import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const campingGearCalculator: CalculatorDefinition = {
  slug: "camping-gear-calculator",
  title: "Camping Gear Checklist Calculator",
  description:
    "Free camping gear checklist calculator. Get a customized gear list based on trip type, season, duration, and number of campers with weight estimates.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "camping gear",
    "camping checklist",
    "camping equipment",
    "camping list",
    "backpacking gear",
  ],
  variants: [
    {
      id: "gear",
      name: "Camping Gear Calculator",
      description: "Get gear recommendations and weight estimates",
      fields: [
        {
          name: "campingType",
          label: "Camping Type",
          type: "select",
          options: [
            { label: "Car camping (drive to site)", value: "car" },
            { label: "Backpacking (hike to site)", value: "backpack" },
            { label: "Glamping (comfort camping)", value: "glamping" },
            { label: "Winter camping", value: "winter" },
            { label: "Beach camping", value: "beach" },
          ],
          defaultValue: "car",
        },
        {
          name: "nights",
          label: "Number of Nights",
          type: "number",
          placeholder: "e.g. 3",
        },
        {
          name: "campers",
          label: "Number of Campers",
          type: "select",
          options: [
            { label: "1 (solo)", value: "1" },
            { label: "2 (couple)", value: "2" },
            { label: "3-4 (small group)", value: "4" },
            { label: "5-6 (large group)", value: "6" },
            { label: "7+ (family/group)", value: "8" },
          ],
          defaultValue: "2",
        },
        {
          name: "season",
          label: "Season / Temperature",
          type: "select",
          options: [
            { label: "Summer (above 60F nights)", value: "summer" },
            { label: "Spring/Fall (40-60F nights)", value: "shoulder" },
            { label: "Cold weather (20-40F nights)", value: "cold" },
            { label: "Winter (below 20F nights)", value: "winter" },
          ],
          defaultValue: "summer",
        },
        {
          name: "cooking",
          label: "Cooking Plans",
          type: "select",
          options: [
            { label: "No cooking (pre-made food)", value: "none" },
            { label: "Simple camp stove meals", value: "simple" },
            { label: "Full camp cooking (grill + stove)", value: "full" },
            { label: "Campfire cooking only", value: "fire" },
          ],
          defaultValue: "simple",
        },
      ],
      calculate: (inputs) => {
        const campingType = inputs.campingType as string;
        const nights = inputs.nights as number;
        const campers = parseInt(inputs.campers as string) || 2;
        const season = inputs.season as string;
        const cooking = inputs.cooking as string;
        if (!nights || nights <= 0) return null;

        const shelterGear: { item: string; weight: number }[] = [];
        const sleepGear: { item: string; weight: number }[] = [];
        const cookGear: { item: string; weight: number }[] = [];
        const essentials: { item: string; weight: number }[] = [];

        if (campingType === "backpack") {
          shelterGear.push({ item: "Lightweight tent", weight: 3.5 });
          shelterGear.push({ item: "Groundsheet/footprint", weight: 0.5 });
        } else if (campingType === "winter") {
          shelterGear.push({ item: "4-season tent", weight: 7 });
          shelterGear.push({ item: "Groundsheet", weight: 1 });
          shelterGear.push({ item: "Snow stakes", weight: 0.5 });
        } else {
          shelterGear.push({ item: "Camping tent", weight: 8 });
          shelterGear.push({ item: "Tent footprint", weight: 1 });
        }

        const sleepBagWeight = season === "winter" ? 5 : season === "cold" ? 4 : season === "shoulder" ? 3 : 2;
        const padWeight = campingType === "backpack" ? 1.5 : 3;
        sleepGear.push({ item: `Sleeping bag (${season === "winter" ? "0F" : season === "cold" ? "20F" : season === "shoulder" ? "35F" : "50F"} rated)`, weight: sleepBagWeight });
        sleepGear.push({ item: campingType === "backpack" ? "Sleeping pad (inflatable)" : "Sleeping pad/air mattress", weight: padWeight });
        sleepGear.push({ item: "Pillow", weight: campingType === "backpack" ? 0.3 : 1 });

        if (cooking !== "none") {
          if (cooking === "simple" || cooking === "full") {
            cookGear.push({ item: campingType === "backpack" ? "Backpacking stove" : "Camp stove", weight: campingType === "backpack" ? 0.8 : 5 });
            cookGear.push({ item: "Fuel canister(s)", weight: campingType === "backpack" ? 0.5 : 2 });
          }
          if (cooking === "full") {
            cookGear.push({ item: "Camping grill/grate", weight: 5 });
          }
          cookGear.push({ item: "Cookware set", weight: campingType === "backpack" ? 1 : 3 });
          cookGear.push({ item: "Utensils/plates/cups", weight: 1 * campers });
          cookGear.push({ item: "Cooler", weight: campingType === "backpack" ? 0 : 8 });
          cookGear.push({ item: "Water bottles/filter", weight: 1 });
        }

        essentials.push({ item: "First aid kit", weight: 1.5 });
        essentials.push({ item: "Headlamp/flashlight", weight: 0.3 });
        essentials.push({ item: "Fire starter/matches", weight: 0.2 });
        essentials.push({ item: "Multi-tool/knife", weight: 0.5 });
        essentials.push({ item: "Trash bags", weight: 0.2 });
        essentials.push({ item: "Insect repellent", weight: 0.3 });
        essentials.push({ item: "Sunscreen", weight: 0.3 });
        if (campingType === "backpack") essentials.push({ item: "Backpack (65L+)", weight: 4.5 });
        if (season === "cold" || season === "winter") essentials.push({ item: "Extra insulation layers", weight: 3 });
        if (campingType === "beach") essentials.push({ item: "Beach shade/canopy", weight: 4 });

        const allGear = [...shelterGear, ...sleepGear, ...cookGear, ...essentials];
        const totalWeight = allGear.reduce((sum, g) => sum + g.weight, 0);
        const totalItems = allGear.length;

        const perPersonWeight = totalWeight / campers;
        const waterNeeded = campers * nights * 0.5;
        const foodWeight = campers * nights * 2;
        const totalWithConsumables = totalWeight + waterNeeded * 8.3 + foodWeight;

        const gearSummary = [
          `Shelter: ${shelterGear.map((g) => g.item).join(", ")}`,
          `Sleep: ${sleepGear.map((g) => g.item).join(", ")}`,
          `Cook: ${cookGear.length > 0 ? cookGear.map((g) => g.item).join(", ") : "None"}`,
        ];

        return {
          primary: {
            label: "Total Gear Items",
            value: `${totalItems} items (~${formatNumber(totalWeight, 1)} lbs)`,
          },
          details: [
            { label: "Shelter items", value: `${shelterGear.length} items (${formatNumber(shelterGear.reduce((s, g) => s + g.weight, 0), 1)} lbs)` },
            { label: "Sleep items", value: `${sleepGear.length} items x ${campers} people` },
            { label: "Cooking items", value: `${cookGear.length} items (${formatNumber(cookGear.reduce((s, g) => s + g.weight, 0), 1)} lbs)` },
            { label: "Essential items", value: `${essentials.length} items` },
            { label: "Total gear weight", value: `${formatNumber(totalWeight, 1)} lbs (${formatNumber(totalWeight * 0.453592, 1)} kg)` },
            { label: "Weight per person", value: `${formatNumber(perPersonWeight, 1)} lbs` },
            { label: "Water needed (est.)", value: `${formatNumber(waterNeeded, 1)} gallons` },
            { label: "Food weight (est.)", value: `${formatNumber(foodWeight, 1)} lbs` },
            { label: "All-in weight", value: `${formatNumber(totalWithConsumables, 1)} lbs` },
          ],
          note: campingType === "backpack"
            ? `Target pack weight under 20% of body weight. Your gear is ${formatNumber(totalWeight, 1)} lbs before food and water. Ultralight backpackers aim for a base weight under 10 lbs.`
            : `Total gear weight is ${formatNumber(totalWeight, 1)} lbs. ${gearSummary[0]}. Don't forget to pack food, water, and personal items!`,
        };
      },
    },
    {
      id: "cost",
      name: "Gear Cost Estimator",
      description: "Estimate the cost of camping gear",
      fields: [
        {
          name: "budget",
          label: "Budget Level",
          type: "select",
          options: [
            { label: "Budget-friendly (entry level)", value: "budget" },
            { label: "Mid-range (quality brands)", value: "mid" },
            { label: "Premium (top brands)", value: "premium" },
            { label: "Ultralight (weight-optimized)", value: "ultralight" },
          ],
          defaultValue: "mid",
        },
        {
          name: "hasGear",
          label: "Existing Gear",
          type: "select",
          options: [
            { label: "Starting from scratch", value: "none" },
            { label: "Have basics (tent + sleeping bag)", value: "basics" },
            { label: "Have most gear, need upgrades", value: "most" },
          ],
          defaultValue: "none",
        },
        {
          name: "campers",
          label: "Number of Campers",
          type: "select",
          options: [
            { label: "1 (solo)", value: "1" },
            { label: "2 (couple)", value: "2" },
            { label: "3-4 (family)", value: "4" },
          ],
          defaultValue: "2",
        },
      ],
      calculate: (inputs) => {
        const budget = inputs.budget as string;
        const hasGear = inputs.hasGear as string;
        const campers = parseInt(inputs.campers as string) || 2;

        const prices: Record<string, { tent: number; sleepBag: number; pad: number; stove: number; cookSet: number; extras: number }> = {
          budget: { tent: 80, sleepBag: 40, pad: 25, stove: 25, cookSet: 30, extras: 50 },
          mid: { tent: 250, sleepBag: 120, pad: 75, stove: 60, cookSet: 60, extras: 100 },
          premium: { tent: 500, sleepBag: 300, pad: 150, stove: 120, cookSet: 100, extras: 200 },
          ultralight: { tent: 400, sleepBag: 350, pad: 180, stove: 80, cookSet: 80, extras: 150 },
        };

        const p = prices[budget] || prices.mid;
        const sharedGear = p.tent + p.stove + p.cookSet + p.extras;
        const perPersonGear = (p.sleepBag + p.pad) * campers;
        const fullCost = sharedGear + perPersonGear;

        let adjustedCost = fullCost;
        if (hasGear === "basics") adjustedCost = fullCost * 0.5;
        else if (hasGear === "most") adjustedCost = fullCost * 0.25;

        return {
          primary: {
            label: "Estimated Gear Cost",
            value: `$${formatNumber(adjustedCost, 0)}`,
          },
          details: [
            { label: "Tent", value: `$${formatNumber(p.tent, 0)}` },
            { label: "Sleeping bags", value: `$${formatNumber(p.sleepBag * campers, 0)} (${campers}x $${p.sleepBag})` },
            { label: "Sleeping pads", value: `$${formatNumber(p.pad * campers, 0)} (${campers}x $${p.pad})` },
            { label: "Camp stove", value: `$${formatNumber(p.stove, 0)}` },
            { label: "Cookware set", value: `$${formatNumber(p.cookSet, 0)}` },
            { label: "Extras (tools, lights, etc.)", value: `$${formatNumber(p.extras, 0)}` },
            { label: "Full setup cost", value: `$${formatNumber(fullCost, 0)}` },
            { label: "Your cost (adjusted)", value: `$${formatNumber(adjustedCost, 0)}` },
          ],
          note: hasGear === "none"
            ? `Starting from scratch at ${budget} level costs about $${formatNumber(fullCost, 0)}. Consider renting gear for your first trip to test before buying.`
            : `Based on your existing gear, you need about $${formatNumber(adjustedCost, 0)} to fill in the gaps.`,
        };
      },
    },
  ],
  relatedSlugs: ["travel-checklist-calculator", "altitude-sickness-calculator", "travel-packing-calculator"],
  faq: [
    {
      question: "What are the 10 essentials for camping?",
      answer:
        "The 10 essentials are: 1) Navigation (map/compass), 2) Sun protection (sunscreen, hat), 3) Insulation (extra clothing), 4) Illumination (headlamp), 5) First aid kit, 6) Fire (matches, lighter), 7) Repair tools (multi-tool, duct tape), 8) Nutrition (extra food), 9) Hydration (water, filter), 10) Emergency shelter (space blanket).",
    },
    {
      question: "How much does camping gear cost for beginners?",
      answer:
        "A budget camping setup for two costs $300-$500 (tent $80-$150, sleeping bags $40-$80 each, pads $25-$50 each, stove $25-$60, cookware $30-$50). Mid-range gear runs $600-$1,000. Many stores rent gear, which is a great way to try camping before investing.",
    },
    {
      question: "What size tent do I need?",
      answer:
        "Get a tent rated for 1-2 more people than will sleep in it. A '2-person' tent is tight for two adults; a 3-person tent is more comfortable. For car camping, size up further. Consider height (stand-up room), vestibule space for gear storage, and ease of setup.",
    },
  ],
  formula:
    "Gear list and weight generated based on camping type, season, cooking plans, and group size. Weight = sum of individual item weights. Cost varies by budget tier.",
};
