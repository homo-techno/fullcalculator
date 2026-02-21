import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const candyTemperatureCalculator: CalculatorDefinition = {
  slug: "candy-temperature-calculator",
  title: "Candy Making Temperature Guide Calculator",
  description:
    "Free candy making temperature calculator. Look up sugar stages, temperatures, and uses for fudge, caramel, toffee, hard candy, and more.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "candy temperature",
    "sugar stages",
    "candy thermometer",
    "soft ball stage",
    "hard crack stage",
    "caramel temperature",
    "fudge temperature",
  ],
  variants: [
    {
      id: "by-candy",
      name: "Temperature by Candy Type",
      description: "Find the right temperature for what you're making",
      fields: [
        {
          name: "candy",
          label: "What Are You Making?",
          type: "select",
          options: [
            { label: "Fudge", value: "fudge" },
            { label: "Caramels (soft)", value: "caramels_soft" },
            { label: "Caramels (firm)", value: "caramels_firm" },
            { label: "Taffy", value: "taffy" },
            { label: "Toffee", value: "toffee" },
            { label: "Butterscotch", value: "butterscotch" },
            { label: "Hard Candy / Lollipops", value: "hard_candy" },
            { label: "Marshmallows", value: "marshmallow" },
            { label: "Divinity", value: "divinity" },
            { label: "Pralines", value: "pralines" },
            { label: "Peanut Brittle", value: "brittle" },
            { label: "Spun Sugar / Cotton Candy", value: "spun_sugar" },
            { label: "Caramel Sauce (pour)", value: "caramel_sauce" },
          ],
        },
        {
          name: "altitude",
          label: "Your Altitude",
          type: "select",
          options: [
            { label: "Sea Level (0 - 1,000 ft)", value: "0" },
            { label: "2,000 ft", value: "2000" },
            { label: "3,000 ft", value: "3000" },
            { label: "4,000 ft", value: "4000" },
            { label: "5,000 ft", value: "5000" },
            { label: "7,500 ft", value: "7500" },
          ],
        },
      ],
      calculate: (inputs) => {
        const candy = inputs.candy as string;
        const altitude = parseFloat(inputs.altitude as string) || 0;
        if (!candy) return null;

        interface CandyData {
          stage: string;
          tempF: number;
          tempHighF: number;
          coldWaterTest: string;
          tips: string;
        }

        const candyGuide: Record<string, CandyData> = {
          fudge: { stage: "Soft Ball", tempF: 235, tempHighF: 240, coldWaterTest: "Forms a soft, pliable ball that flattens when removed", tips: "Beat vigorously after cooling to 110\u00B0F for smooth texture." },
          caramels_soft: { stage: "Firm Ball", tempF: 242, tempHighF: 248, coldWaterTest: "Forms a firm ball that holds its shape but is pliable", tips: "Use heavy cream for richest flavor. Stir constantly." },
          caramels_firm: { stage: "Hard Ball", tempF: 250, tempHighF: 265, coldWaterTest: "Forms a rigid ball that gives slightly under pressure", tips: "Cook slightly higher for chewy caramels." },
          taffy: { stage: "Soft Crack", tempF: 270, tempHighF: 289, coldWaterTest: "Separates into hard but pliable threads", tips: "Pull when cool enough to handle but still warm." },
          toffee: { stage: "Hard Crack", tempF: 300, tempHighF: 310, coldWaterTest: "Separates into hard, brittle threads that snap", tips: "Use butter and watch carefully - it goes from perfect to burnt quickly." },
          butterscotch: { stage: "Soft Crack to Hard Crack", tempF: 289, tempHighF: 300, coldWaterTest: "Separates into hard threads that are slightly pliable", tips: "Use brown sugar for authentic butterscotch flavor." },
          hard_candy: { stage: "Hard Crack", tempF: 300, tempHighF: 310, coldWaterTest: "Separates into hard, brittle threads", tips: "Add color and flavor when removed from heat. Work quickly." },
          marshmallow: { stage: "Soft Ball", tempF: 240, tempHighF: 242, coldWaterTest: "Forms a soft ball", tips: "Beat gelatin mixture on high speed for 10-15 minutes until tripled." },
          divinity: { stage: "Hard Ball", tempF: 260, tempHighF: 262, coldWaterTest: "Forms a hard ball", tips: "Do not make on humid days. Beat until it holds its shape." },
          pralines: { stage: "Soft Ball", tempF: 236, tempHighF: 238, coldWaterTest: "Forms a soft ball", tips: "Drop quickly onto parchment. They set fast." },
          brittle: { stage: "Hard Crack", tempF: 300, tempHighF: 310, coldWaterTest: "Separates into hard, brittle threads", tips: "Add baking soda at the end for airy texture. Spread thin immediately." },
          spun_sugar: { stage: "Light Caramel", tempF: 320, tempHighF: 338, coldWaterTest: "Sugar liquefies, begins to turn amber", tips: "Flick with a fork over a rolling pin for decorative strands." },
          caramel_sauce: { stage: "Thread to Soft Ball", tempF: 230, tempHighF: 240, coldWaterTest: "Forms thin threads", tips: "Swirl pan (don't stir) to prevent crystallization. Add warm cream slowly." },
        };

        const data = candyGuide[candy];
        if (!data) return null;

        // Altitude adjustment: subtract 2F per 1000 ft elevation
        const altAdj = (altitude / 1000) * 2;
        const adjTempLow = data.tempF - altAdj;
        const adjTempHigh = data.tempHighF - altAdj;
        const adjTempLowC = (adjTempLow - 32) * 5 / 9;
        const adjTempHighC = (adjTempHigh - 32) * 5 / 9;

        return {
          primary: {
            label: "Target Temperature",
            value: formatNumber(adjTempLow, 0) + " - " + formatNumber(adjTempHigh, 0) + "\u00B0F",
          },
          details: [
            { label: "Sugar Stage", value: data.stage },
            { label: "Temperature (\u00B0F)", value: formatNumber(adjTempLow, 0) + " - " + formatNumber(adjTempHigh, 0) + "\u00B0F" },
            { label: "Temperature (\u00B0C)", value: formatNumber(adjTempLowC, 0) + " - " + formatNumber(adjTempHighC, 0) + "\u00B0C" },
            { label: "Altitude Adjustment", value: altitude > 0 ? "-" + formatNumber(altAdj, 0) + "\u00B0F from sea level" : "None (sea level)" },
            { label: "Cold Water Test", value: data.coldWaterTest },
            { label: "Tips", value: data.tips },
          ],
        };
      },
    },
    {
      id: "by-stage",
      name: "Sugar Stage Reference",
      description: "Look up all sugar stages and their temperatures",
      fields: [
        {
          name: "stage",
          label: "Sugar Stage",
          type: "select",
          options: [
            { label: "Thread (223-235\u00B0F)", value: "thread" },
            { label: "Soft Ball (235-240\u00B0F)", value: "soft_ball" },
            { label: "Firm Ball (242-248\u00B0F)", value: "firm_ball" },
            { label: "Hard Ball (250-265\u00B0F)", value: "hard_ball" },
            { label: "Soft Crack (270-289\u00B0F)", value: "soft_crack" },
            { label: "Hard Crack (300-310\u00B0F)", value: "hard_crack" },
            { label: "Light Caramel (320-338\u00B0F)", value: "light_caramel" },
            { label: "Dark Caramel (350-360\u00B0F)", value: "dark_caramel" },
          ],
        },
      ],
      calculate: (inputs) => {
        const stage = inputs.stage as string;
        if (!stage) return null;

        const stages: Record<string, { tempF: string; tempC: string; test: string; uses: string }> = {
          thread: { tempF: "223-235\u00B0F", tempC: "106-113\u00B0C", test: "Syrup drips from spoon in thin threads", uses: "Sugar syrups, glazes, some icings" },
          soft_ball: { tempF: "235-240\u00B0F", tempC: "113-116\u00B0C", test: "Forms a soft, pliable ball in cold water", uses: "Fudge, pralines, fondant, marshmallows" },
          firm_ball: { tempF: "242-248\u00B0F", tempC: "117-120\u00B0C", test: "Forms a firm but still pliable ball", uses: "Soft caramels, nougat" },
          hard_ball: { tempF: "250-265\u00B0F", tempC: "121-130\u00B0C", test: "Forms a hard ball that resists pressure", uses: "Divinity, marshmallows, gummies, rock candy" },
          soft_crack: { tempF: "270-289\u00B0F", tempC: "132-143\u00B0C", test: "Separates into hard but pliable threads", uses: "Taffy, butterscotch, popcorn balls" },
          hard_crack: { tempF: "300-310\u00B0F", tempC: "149-154\u00B0C", test: "Separates into hard, brittle threads", uses: "Toffee, hard candy, lollipops, peanut brittle" },
          light_caramel: { tempF: "320-338\u00B0F", tempC: "160-170\u00B0C", test: "Sugar liquefies and turns golden amber", uses: "Praline, caramel sauce, spun sugar, creme brulee" },
          dark_caramel: { tempF: "350-360\u00B0F", tempC: "177-182\u00B0C", test: "Sugar is dark amber with smoky flavor", uses: "Dark caramel sauce, color additive. Close to burnt." },
        };

        const data = stages[stage];
        if (!data) return null;

        return {
          primary: {
            label: "Temperature Range",
            value: data.tempF,
          },
          details: [
            { label: "Fahrenheit", value: data.tempF },
            { label: "Celsius", value: data.tempC },
            { label: "Cold Water Test", value: data.test },
            { label: "Common Uses", value: data.uses },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["baking-conversion-calculator", "canning-time-calculator"],
  faq: [
    {
      question: "Why does altitude affect candy making?",
      answer:
        "At higher altitudes, water boils at a lower temperature. Since candy making relies on reaching specific temperatures to evaporate water and concentrate sugar, you need to reduce target temperatures by about 2\u00B0F for every 1,000 feet above sea level.",
    },
    {
      question: "What is the cold water test for candy?",
      answer:
        "Drop a small amount of hot sugar syrup into a bowl of cold water and observe how it behaves. Each sugar stage produces different results: soft ball (fudge), firm ball (caramels), hard ball (divinity), soft crack (taffy), hard crack (lollipops).",
    },
    {
      question: "Do I need a candy thermometer?",
      answer:
        "A candy thermometer is highly recommended for accuracy. If you don't have one, you can use the cold water test, but a thermometer removes guesswork. Clip it to the side of the pan without touching the bottom.",
    },
  ],
  formula:
    "Sugar Stages: Thread 223-235\u00B0F, Soft Ball 235-240\u00B0F, Firm Ball 242-248\u00B0F, Hard Ball 250-265\u00B0F, Soft Crack 270-289\u00B0F, Hard Crack 300-310\u00B0F, Caramel 320-360\u00B0F. Altitude adjustment: -2\u00B0F per 1,000 ft elevation.",
};
