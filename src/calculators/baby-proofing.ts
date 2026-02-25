import type { CalculatorDefinition } from "./types";

export const babyProofingCalculator: CalculatorDefinition = {
  slug: "baby-proofing-calculator",
  title: "Baby Proofing Budget Calculator",
  description:
    "Free baby proofing budget calculator. Estimate the cost to baby-proof your home based on the number of rooms and safety items needed.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: [
    "baby proofing",
    "childproofing cost",
    "baby safety",
    "baby proof home",
    "childproofing budget",
  ],
  variants: [
    {
      id: "budget",
      name: "Baby Proofing Budget",
      description: "Estimate costs to baby-proof your home",
      fields: [
        {
          name: "homeType",
          label: "Home Type",
          type: "select",
          options: [
            { label: "Apartment (1-2 bedrooms)", value: "apt_small" },
            { label: "Apartment (3+ bedrooms)", value: "apt_large" },
            { label: "House (small, <1500 sq ft)", value: "house_small" },
            { label: "House (medium, 1500-2500 sq ft)", value: "house_med" },
            { label: "House (large, 2500+ sq ft)", value: "house_large" },
          ],
        },
        {
          name: "numBathrooms",
          label: "Number of Bathrooms",
          type: "number",
          placeholder: "e.g. 2",
          min: 1,
          max: 6,
        },
        {
          name: "hasStairs",
          label: "Stairs in Home",
          type: "select",
          options: [
            { label: "No stairs", value: "none" },
            { label: "1 staircase", value: "1" },
            { label: "2+ staircases", value: "2" },
          ],
        },
        {
          name: "hasPool",
          label: "Pool or Hot Tub",
          type: "select",
          options: [
            { label: "No", value: "no" },
            { label: "Yes - already fenced", value: "fenced" },
            { label: "Yes - needs fencing", value: "unfenced" },
          ],
        },
        {
          name: "quality",
          label: "Product Quality Preference",
          type: "select",
          options: [
            { label: "Budget-friendly", value: "budget" },
            { label: "Mid-range", value: "mid" },
            { label: "Premium", value: "premium" },
          ],
        },
      ],
      calculate: (inputs) => {
        const homeType = inputs.homeType as string;
        const bathrooms = inputs.numBathrooms as number;
        const stairs = inputs.hasStairs as string;
        const pool = inputs.hasPool as string;
        const quality = inputs.quality as string;
        if (!homeType || !bathrooms || !stairs || !pool || !quality) return null;

        const qualityMultiplier: Record<string, number> = {
          budget: 0.7,
          mid: 1.0,
          premium: 1.5,
        };
        const mult = qualityMultiplier[quality] ?? 1.0;

        // Base items and costs
        const items: { name: string; qty: number; unitCost: number }[] = [];

        // Outlet covers - based on home size
        const outletCounts: Record<string, number> = {
          apt_small: 20, apt_large: 30, house_small: 35, house_med: 50, house_large: 70,
        };
        const outlets = outletCounts[homeType] ?? 30;
        items.push({ name: "Outlet covers/plugs", qty: outlets, unitCost: 1 });

        // Cabinet locks
        const cabinetCounts: Record<string, number> = {
          apt_small: 10, apt_large: 15, house_small: 18, house_med: 25, house_large: 35,
        };
        items.push({ name: "Cabinet/drawer locks", qty: cabinetCounts[homeType] ?? 15, unitCost: 4 });

        // Corner/edge protectors
        const cornerCounts: Record<string, number> = {
          apt_small: 8, apt_large: 12, house_small: 14, house_med: 18, house_large: 24,
        };
        items.push({ name: "Corner & edge protectors", qty: cornerCounts[homeType] ?? 12, unitCost: 2 });

        // Door knob covers
        const doorCounts: Record<string, number> = {
          apt_small: 4, apt_large: 6, house_small: 8, house_med: 12, house_large: 16,
        };
        items.push({ name: "Door knob covers", qty: doorCounts[homeType] ?? 6, unitCost: 3 });

        // Baby gates for stairs
        if (stairs === "1") {
          items.push({ name: "Baby gates (top & bottom)", qty: 2, unitCost: 45 });
        } else if (stairs === "2") {
          items.push({ name: "Baby gates (multiple stairs)", qty: 4, unitCost: 45 });
        }

        // Room-blocking gates
        items.push({ name: "Room-blocking gates", qty: 1, unitCost: 35 });

        // Bathroom safety
        items.push({ name: "Toilet locks", qty: bathrooms, unitCost: 8 });
        items.push({ name: "Bath spout covers", qty: bathrooms, unitCost: 10 });
        items.push({ name: "Non-slip bath mats", qty: bathrooms, unitCost: 12 });

        // Furniture anchors
        const anchorCounts: Record<string, number> = {
          apt_small: 4, apt_large: 6, house_small: 8, house_med: 12, house_large: 16,
        };
        items.push({ name: "Furniture anchor straps", qty: anchorCounts[homeType] ?? 6, unitCost: 6 });

        // Smoke/CO detectors
        items.push({ name: "Smoke/CO detectors (check/replace)", qty: 3, unitCost: 25 });

        // Window guards
        const windowGuards: Record<string, number> = {
          apt_small: 3, apt_large: 5, house_small: 6, house_med: 8, house_large: 12,
        };
        items.push({ name: "Window guards/stops", qty: windowGuards[homeType] ?? 5, unitCost: 12 });

        // Pool fencing
        if (pool === "unfenced") {
          items.push({ name: "Pool safety fence", qty: 1, unitCost: 1500 });
          items.push({ name: "Pool alarm", qty: 1, unitCost: 100 });
        } else if (pool === "fenced") {
          items.push({ name: "Pool alarm", qty: 1, unitCost: 100 });
        }

        // First aid kit
        items.push({ name: "Baby first aid kit", qty: 1, unitCost: 25 });

        let totalCost = 0;
        const itemizedList: string[] = [];
        for (const item of items) {
          const cost = Math.round(item.qty * item.unitCost * mult);
          totalCost += cost;
          itemizedList.push(`${item.name}: ${item.qty} x $${Math.round(item.unitCost * mult)} = $${cost}`);
        }

        const diyVsPro = totalCost < 500
          ? "DIY recommended - straightforward installation"
          : `DIY: $${Math.round(totalCost).toLocaleString()} | Professional install: $${Math.round(totalCost * 1.8).toLocaleString()}-$${Math.round(totalCost * 2.5).toLocaleString()}`;

        return {
          primary: {
            label: "Estimated Baby Proofing Cost",
            value: `$${Math.round(totalCost).toLocaleString()}`,
          },
          details: [
            { label: "Total items", value: `${items.length} categories, ${items.reduce((s, i) => s + i.qty, 0)} individual items` },
            { label: "DIY vs Professional", value: diyVsPro },
            {
              label: "Top expenses",
              value: itemizedList
                .sort((a, b) => {
                  const costA = parseInt(a.split("$").pop() || "0");
                  const costB = parseInt(b.split("$").pop() || "0");
                  return costB - costA;
                })
                .slice(0, 5)
                .join(" | "),
            },
            {
              label: "When to baby-proof",
              value: "Start by 4-6 months, before baby crawls. Reassess as baby grows.",
            },
            { label: "Quality level", value: quality === "budget" ? "Budget" : quality === "mid" ? "Mid-range" : "Premium" },
          ],
          note: "Start baby proofing before your baby starts crawling (usually 6-9 months). Get on your hands and knees to see the world from baby's perspective!",
        };
      },
    },
  ],
  relatedSlugs: ["nursery-room-calculator", "daycare-cost-calculator"],
  faq: [
    {
      question: "How much does it cost to baby-proof a home?",
      answer:
        "Basic baby proofing typically costs $200-500 for DIY with budget to mid-range products. A larger home with stairs and a pool can cost $500-1,500+. Professional baby-proofing services charge $300-1,500 for labor plus materials.",
    },
    {
      question: "When should I start baby proofing?",
      answer:
        "Start baby proofing by 4-6 months, before your baby begins crawling (typically 6-9 months). Focus first on the rooms where baby spends the most time. Reassess regularly as your child grows and becomes more mobile and curious.",
    },
  ],
  formula:
    "Total cost = sum of (item quantity x unit cost x quality multiplier) for all safety items. Professional install typically costs 1.8-2.5x DIY materials cost.",
};
