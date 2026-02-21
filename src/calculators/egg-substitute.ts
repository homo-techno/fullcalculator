import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const eggSubstituteCalculator: CalculatorDefinition = {
  slug: "egg-substitute-calculator",
  title: "Egg Substitute Calculator",
  description:
    "Free egg substitute calculator. Find the right egg replacement and amount for baking and cooking, including vegan and allergy-friendly options.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "egg substitute",
    "egg replacement",
    "vegan egg substitute",
    "egg substitute for baking",
    "flax egg",
    "egg allergy substitute",
  ],
  variants: [
    {
      id: "calc",
      name: "Calculate Egg Substitute",
      fields: [
        {
          name: "eggs",
          label: "Number of Eggs to Replace",
          type: "number",
          placeholder: "e.g. 2",
        },
        {
          name: "eggSize",
          label: "Egg Size in Recipe",
          type: "select",
          options: [
            { label: "Large (50g / 3.25 tbsp)", value: "large" },
            { label: "Medium (44g / 2.75 tbsp)", value: "medium" },
            { label: "Extra Large (56g / 4 tbsp)", value: "extra_large" },
          ],
        },
        {
          name: "substitute",
          label: "Substitute Type",
          type: "select",
          options: [
            { label: "Flax Egg (vegan)", value: "flax" },
            { label: "Chia Egg (vegan)", value: "chia" },
            { label: "Mashed Banana", value: "banana" },
            { label: "Applesauce", value: "applesauce" },
            { label: "Silken Tofu", value: "tofu" },
            { label: "Yogurt / Sour Cream", value: "yogurt" },
            { label: "Aquafaba (chickpea liquid)", value: "aquafaba" },
            { label: "Commercial Egg Replacer", value: "commercial" },
            { label: "Buttermilk + Baking Soda", value: "buttermilk" },
            { label: "Vinegar + Baking Soda", value: "vinegar" },
          ],
        },
        {
          name: "purpose",
          label: "Purpose in Recipe",
          type: "select",
          options: [
            { label: "Binding (cookies, muffins)", value: "binding" },
            { label: "Leavening (cakes, pancakes)", value: "leavening" },
            { label: "Moisture (brownies, quick bread)", value: "moisture" },
          ],
        },
      ],
      calculate: (inputs) => {
        const eggs = inputs.eggs as number;
        const substitute = inputs.substitute as string;
        const purpose = inputs.purpose as string;
        if (!eggs || !substitute || !purpose) return null;

        interface SubData {
          perEgg: string;
          total: string;
          bestFor: string;
          notes: string;
          effectiveness: string;
        }

        const substitutes: Record<string, SubData> = {
          flax: {
            perEgg: "1 tbsp ground flax + 3 tbsp water (let sit 5 min)",
            total: eggs + " tbsp ground flax + " + (eggs * 3) + " tbsp water",
            bestFor: "Binding, Moisture",
            notes: "Creates a gel similar to egg whites. Adds a slightly nutty flavor. Works great in cookies, muffins, and pancakes.",
            effectiveness: purpose === "binding" ? "Excellent" : purpose === "moisture" ? "Good" : "Fair",
          },
          chia: {
            perEgg: "1 tbsp chia seeds + 3 tbsp water (let sit 5 min)",
            total: eggs + " tbsp chia seeds + " + (eggs * 3) + " tbsp water",
            bestFor: "Binding, Moisture",
            notes: "Similar to flax eggs but with a milder flavor. Seeds remain visible - grind first for smoother texture.",
            effectiveness: purpose === "binding" ? "Excellent" : purpose === "moisture" ? "Good" : "Fair",
          },
          banana: {
            perEgg: "1/4 cup (about 1/2 medium banana), mashed",
            total: formatNumber(eggs * 0.25, 2) + " cups mashed banana (" + formatNumber(eggs * 0.5, 1) + " bananas)",
            bestFor: "Moisture, Binding",
            notes: "Adds banana flavor and sweetness. Best in recipes where banana flavor complements (muffins, pancakes, brownies).",
            effectiveness: purpose === "moisture" ? "Excellent" : purpose === "binding" ? "Good" : "Fair",
          },
          applesauce: {
            perEgg: "1/4 cup unsweetened applesauce",
            total: formatNumber(eggs * 0.25, 2) + " cups applesauce",
            bestFor: "Moisture",
            notes: "Adds moisture and slight sweetness with neutral flavor. May make baked goods denser. Reduce sugar slightly.",
            effectiveness: purpose === "moisture" ? "Excellent" : purpose === "binding" ? "Good" : "Fair",
          },
          tofu: {
            perEgg: "1/4 cup silken tofu, blended smooth",
            total: formatNumber(eggs * 0.25, 2) + " cups silken tofu (" + formatNumber(eggs * 60, 0) + "g)",
            bestFor: "Moisture, Binding",
            notes: "Very neutral flavor. Blend until completely smooth. Works well in dense, moist baked goods like brownies and cheesecake.",
            effectiveness: purpose === "moisture" ? "Excellent" : purpose === "binding" ? "Good" : "Good",
          },
          yogurt: {
            perEgg: "1/4 cup yogurt or sour cream",
            total: formatNumber(eggs * 0.25, 2) + " cups yogurt/sour cream",
            bestFor: "Moisture, Leavening",
            notes: "Adds richness and tang. The acidity helps with leavening when combined with baking soda. Not vegan unless using plant-based yogurt.",
            effectiveness: purpose === "moisture" ? "Excellent" : purpose === "leavening" ? "Good" : "Good",
          },
          aquafaba: {
            perEgg: "3 tbsp aquafaba (liquid from canned chickpeas)",
            total: (eggs * 3) + " tbsp aquafaba (" + formatNumber(eggs * 45, 0) + " mL)",
            bestFor: "Leavening, Binding",
            notes: "Can be whipped like egg whites for meringues and mousses. Best vegan egg white substitute available. 2 tbsp = 1 egg white.",
            effectiveness: purpose === "leavening" ? "Excellent" : purpose === "binding" ? "Good" : "Good",
          },
          commercial: {
            perEgg: "Follow package directions (typically 1.5 tsp powder + 2-3 tbsp water)",
            total: formatNumber(eggs * 1.5, 1) + " tsp powder + " + (eggs * 3) + " tbsp water",
            bestFor: "All purposes",
            notes: "Brands like Bob's Red Mill or JUST Egg work well. Follow package instructions for best results.",
            effectiveness: "Good",
          },
          buttermilk: {
            perEgg: "1/4 cup buttermilk + 1/4 tsp baking soda",
            total: formatNumber(eggs * 0.25, 2) + " cups buttermilk + " + formatNumber(eggs * 0.25, 2) + " tsp baking soda",
            bestFor: "Leavening, Moisture",
            notes: "The acid in buttermilk reacts with baking soda for extra lift. Great for fluffy pancakes and cakes.",
            effectiveness: purpose === "leavening" ? "Excellent" : purpose === "moisture" ? "Good" : "Fair",
          },
          vinegar: {
            perEgg: "1 tbsp white vinegar + 1 tsp baking soda",
            total: eggs + " tbsp vinegar + " + eggs + " tsp baking soda",
            bestFor: "Leavening",
            notes: "Creates a quick chemical reaction for lift. Add to batter immediately and bake right away. Best for light, fluffy cakes.",
            effectiveness: purpose === "leavening" ? "Excellent" : "Fair",
          },
        };

        const data = substitutes[substitute];
        if (!data) return null;

        return {
          primary: {
            label: "Substitute Amount",
            value: data.total,
          },
          details: [
            { label: "Per Egg", value: data.perEgg },
            { label: "Eggs to Replace", value: String(eggs) },
            { label: "Best For", value: data.bestFor },
            { label: "Effectiveness", value: data.effectiveness },
            { label: "Notes", value: data.notes },
          ],
          note: eggs > 3 ? "Replacing more than 3 eggs can significantly change texture. Consider using a combination of substitutes for best results." : undefined,
        };
      },
    },
  ],
  relatedSlugs: ["baking-conversion-calculator", "butter-oil-conversion-calculator"],
  faq: [
    {
      question: "What is the best egg substitute for baking?",
      answer:
        "It depends on the egg's role in the recipe. For binding (cookies, muffins), use flax or chia eggs. For leavening (cakes), use aquafaba or vinegar + baking soda. For moisture (brownies), use mashed banana or applesauce.",
    },
    {
      question: "How do you make a flax egg?",
      answer:
        "Mix 1 tablespoon of ground flaxseed with 3 tablespoons of water. Stir and let sit for 5 minutes until it becomes gel-like. This replaces one egg and works best for binding in cookies, muffins, and pancakes.",
    },
    {
      question: "Can I replace more than 3 eggs in a recipe?",
      answer:
        "Replacing more than 3 eggs is challenging and may significantly alter the texture and structure. For recipes calling for many eggs (like angel food cake), try using a combination of substitutes or choose a recipe specifically designed to be egg-free.",
    },
  ],
  formula:
    "1 large egg (50g) = 1 tbsp ground flax + 3 tbsp water = 1/4 cup mashed banana = 1/4 cup applesauce = 3 tbsp aquafaba = 1/4 cup silken tofu. For egg whites: 2 tbsp aquafaba = 1 egg white.",
};
