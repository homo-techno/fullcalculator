import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const reptileEnclosureCalculator: CalculatorDefinition = {
  slug: "reptile-enclosure-calculator",
  title: "Reptile Enclosure Size Calculator",
  description:
    "Free reptile enclosure size calculator. Find the right terrarium or vivarium size for snakes, lizards, geckos, and turtles based on species and size.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "reptile enclosure calculator",
    "snake tank size",
    "gecko terrarium size",
    "bearded dragon enclosure",
    "reptile vivarium calculator",
  ],
  variants: [
    {
      id: "bySpecies",
      name: "Enclosure by Species",
      fields: [
        {
          name: "species",
          label: "Reptile Species",
          type: "select",
          options: [
            { label: "Leopard Gecko", value: "leopard_gecko" },
            { label: "Crested Gecko", value: "crested_gecko" },
            { label: "Bearded Dragon", value: "bearded_dragon" },
            { label: "Ball Python", value: "ball_python" },
            { label: "Corn Snake", value: "corn_snake" },
            { label: "King Snake", value: "king_snake" },
            { label: "Boa Constrictor", value: "boa" },
            { label: "Blue Tongue Skink", value: "blue_tongue" },
            { label: "Chameleon (Veiled/Panther)", value: "chameleon" },
            { label: "Red-Eared Slider Turtle", value: "turtle" },
            { label: "Box Turtle", value: "box_turtle" },
            { label: "Green Iguana", value: "iguana" },
          ],
        },
        {
          name: "animalCount",
          label: "Number of Animals",
          type: "number",
          placeholder: "1",
          min: 1,
          max: 5,
          defaultValue: 1,
        },
      ],
      calculate: (inputs) => {
        const species = (inputs.species as string) || "ball_python";
        const count = (inputs.animalCount as number) || 1;

        // Enclosure specs: L x W x H in inches, plus care requirements
        const specs: Record<
          string,
          {
            l: number; w: number; h: number;
            type: string; tempHot: string; tempCool: string;
            humidity: string; substrate: string; lifespan: string; adultSize: string;
          }
        > = {
          leopard_gecko: {
            l: 36, w: 18, h: 12, type: "Terrestrial (long, low)",
            tempHot: "88-92°F", tempCool: "75-80°F", humidity: "30-40%",
            substrate: "Tile, paper towel, or reptile carpet", lifespan: "15-20 years", adultSize: "8-10 inches",
          },
          crested_gecko: {
            l: 18, w: 18, h: 24, type: "Arboreal (tall)",
            tempHot: "78-82°F", tempCool: "72-75°F", humidity: "60-80%",
            substrate: "Coconut fiber, sphagnum moss", lifespan: "15-20 years", adultSize: "7-9 inches",
          },
          bearded_dragon: {
            l: 48, w: 24, h: 24, type: "Terrestrial/Semi-arboreal",
            tempHot: "100-110°F basking", tempCool: "80-85°F", humidity: "30-40%",
            substrate: "Tile, excavator clay, or reptile carpet", lifespan: "10-15 years", adultSize: "18-24 inches",
          },
          ball_python: {
            l: 48, w: 24, h: 18, type: "Terrestrial (secure lid essential)",
            tempHot: "88-92°F", tempCool: "76-80°F", humidity: "55-65%",
            substrate: "Coconut fiber, cypress mulch", lifespan: "20-30 years", adultSize: "3-5 feet",
          },
          corn_snake: {
            l: 48, w: 18, h: 18, type: "Semi-arboreal (secure lid essential)",
            tempHot: "85-88°F", tempCool: "75-80°F", humidity: "40-60%",
            substrate: "Aspen shavings, coconut fiber", lifespan: "15-20 years", adultSize: "3-5 feet",
          },
          king_snake: {
            l: 48, w: 18, h: 18, type: "Terrestrial (escape-proof lid!)",
            tempHot: "85-88°F", tempCool: "72-78°F", humidity: "40-60%",
            substrate: "Aspen shavings, coconut fiber", lifespan: "15-20 years", adultSize: "3-6 feet",
          },
          boa: {
            l: 72, w: 36, h: 24, type: "Terrestrial (heavy-duty enclosure)",
            tempHot: "88-92°F", tempCool: "78-82°F", humidity: "60-70%",
            substrate: "Cypress mulch, coconut fiber", lifespan: "20-30 years", adultSize: "6-10 feet",
          },
          blue_tongue: {
            l: 48, w: 24, h: 18, type: "Terrestrial",
            tempHot: "95-100°F basking", tempCool: "75-80°F", humidity: "40-60%",
            substrate: "Cypress mulch, aspen, or soil mix", lifespan: "15-20 years", adultSize: "18-24 inches",
          },
          chameleon: {
            l: 24, w: 24, h: 48, type: "Arboreal (screen cage preferred)",
            tempHot: "85-90°F basking", tempCool: "72-78°F", humidity: "50-70%",
            substrate: "None (bare bottom or bioactive)", lifespan: "5-10 years", adultSize: "12-24 inches",
          },
          turtle: {
            l: 48, w: 24, h: 18, type: "Aquatic (75% water, 25% land)",
            tempHot: "85-90°F basking", tempCool: "75-80°F water", humidity: "N/A (aquatic)",
            substrate: "River rock or bare bottom (easy cleaning)", lifespan: "20-40 years", adultSize: "10-12 inches",
          },
          box_turtle: {
            l: 48, w: 24, h: 18, type: "Terrestrial with shallow water",
            tempHot: "85-88°F basking", tempCool: "75-80°F", humidity: "60-80%",
            substrate: "Soil/coconut fiber mix (must hold humidity)", lifespan: "30-50+ years", adultSize: "5-7 inches",
          },
          iguana: {
            l: 72, w: 36, h: 72, type: "Arboreal (very large; room-size ideal)",
            tempHot: "95-100°F basking", tempCool: "80-85°F", humidity: "65-75%",
            substrate: "Newspaper, carpet, or soil (bioactive)", lifespan: "15-20 years", adultSize: "5-7 feet",
          },
        };

        const spec = specs[species] || specs.ball_python;
        const adjL = spec.l + (count > 1 ? (count - 1) * spec.l * 0.5 : 0);
        const volume = (adjL * spec.w * spec.h) / 1728; // cubic feet
        const gallons = (adjL * spec.w * spec.h) / 231; // gallons

        // UVB needed?
        const uvbNeeded = ["leopard_gecko", "ball_python", "corn_snake", "king_snake", "boa"].includes(species)
          ? "Low/Optional (provide if possible)"
          : "Yes - UVB lighting essential (10-12 hrs/day)";

        return {
          primary: {
            label: "Minimum Enclosure Size",
            value: `${formatNumber(adjL, 0)}" L x ${formatNumber(spec.w, 0)}" W x ${formatNumber(spec.h, 0)}" H`,
          },
          details: [
            { label: "Volume", value: formatNumber(volume, 1) + " cu ft (~" + formatNumber(gallons, 0) + " gallons)" },
            { label: "Enclosure Type", value: spec.type },
            { label: "Hot Side Temp", value: spec.tempHot },
            { label: "Cool Side Temp", value: spec.tempCool },
            { label: "Humidity", value: spec.humidity },
            { label: "UVB Lighting", value: uvbNeeded },
            { label: "Substrate", value: spec.substrate },
            { label: "Adult Size", value: spec.adultSize },
            { label: "Lifespan", value: spec.lifespan },
            { label: "Number of Animals", value: String(count) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["fish-tank-size-calculator", "bird-cage-size-calculator", "hamster-cage-size-calculator"],
  faq: [
    {
      question: "How big should a bearded dragon enclosure be?",
      answer:
        "An adult bearded dragon needs a minimum of 120 gallons (48\" x 24\" x 24\"), though 75 gallons (48\" x 18\" x 21\") is the commonly cited minimum. Larger is always better. They need a temperature gradient from 100-110°F on the basking side to 80-85°F on the cool side, with UVB lighting.",
    },
    {
      question: "What size tank does a ball python need?",
      answer:
        "An adult ball python needs at least a 40-gallon tank (36\" x 18\" x 18\"), but a 4' x 2' x 2' enclosure (120 gallons) is the modern recommended minimum. The enclosure must be secure, as ball pythons are notorious escape artists. Provide at least two hides (warm and cool side).",
    },
    {
      question: "Do reptiles need UVB lighting?",
      answer:
        "Most diurnal reptiles (bearded dragons, chameleons, iguanas, turtles) absolutely need UVB lighting for vitamin D3 synthesis and calcium metabolism. Without UVB, they develop metabolic bone disease. Some nocturnal species (leopard geckos, ball pythons) can get by without it but still benefit from low-level UVB.",
    },
  ],
  formula:
    "Minimum enclosure size based on species-specific guidelines. General snake rule: enclosure length + width >= snake length. Lizard rule: enclosure length >= 2x animal length. Additional animals add ~50% to length. Always provide a temperature gradient and appropriate humidity.",
};
