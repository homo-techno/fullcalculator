// #51 Composting Toilet Calculator
add('composting-toilet-calculator', 'Composting Toilet Calculator',
  'Estimate composting toilet capacity, water savings, and compost output for your household.',
  'Everyday', 'everyday', '~',
  ['composting toilet', 'waterless toilet', 'compost toilet sizing'],
  [
    '{ name: "people", label: "Number of People", type: "number", suffix: "people", min: 1, max: 20, defaultValue: 4 }',
    '{ name: "usesPerDay", label: "Average Uses per Person per Day", type: "number", suffix: "uses", min: 1, max: 15, defaultValue: 6 }',
    '{ name: "waterCostPerGallon", label: "Water Cost per Gallon", type: "number", prefix: "$", min: 0, max: 1, step: 0.001, defaultValue: 0.005 }',
  ],
  `(inputs) => {
      const people = inputs.people as number;
      const uses = inputs.usesPerDay as number;
      const waterCost = inputs.waterCostPerGallon as number;
      if (!people || !uses) return null;
      const flushesPerDay = people * uses;
      const gallonsSavedPerDay = flushesPerDay * 1.6;
      const gallonsSavedPerYear = gallonsSavedPerDay * 365;
      const annualSavings = gallonsSavedPerYear * waterCost;
      const compostPerYear = people * 80;
      return {
        primary: { label: "Water Saved per Year", value: formatNumber(Math.round(gallonsSavedPerYear)) + " gallons" },
        details: [
          { label: "Flushes Eliminated Daily", value: formatNumber(flushesPerDay) },
          { label: "Annual Water Cost Savings", value: "$" + formatNumber(Math.round(annualSavings * 100) / 100) },
          { label: "Compost Produced per Year", value: formatNumber(compostPerYear) + " lbs" },
        ],
      };
    }`,
  [{ q: 'How much water does a composting toilet save?', a: 'A composting toilet can save approximately 6,600 gallons of water per person per year by eliminating the need for flushing.' },
   { q: 'Is compost from a composting toilet safe to use?', a: 'When properly maintained and composted for 12 to 24 months, the resulting humus is safe for use on non-edible plants and trees.' }],
  'Water Saved = People x Uses per Day x 1.6 gallons x 365 days',
  ['water-conservation-calculator', 'greywater-system-calculator']
);

// #52 Greywater System Calculator
add('greywater-system-calculator', 'Greywater System Calculator',
  'Calculate potential water reuse savings from a greywater recycling system for your home.',
  'Everyday', 'everyday', '~',
  ['greywater system', 'greywater reuse', 'water recycling calculator'],
  [
    '{ name: "people", label: "Household Members", type: "number", suffix: "people", min: 1, max: 15, defaultValue: 4 }',
    '{ name: "waterRate", label: "Water Rate per Gallon", type: "number", prefix: "$", min: 0, max: 0.1, step: 0.001, defaultValue: 0.005 }',
    '{ name: "systemType", label: "System Type", type: "select", options: [{value:"laundry",label:"Laundry Only"},{value:"bath",label:"Bath and Shower"},{value:"full",label:"Full Greywater System"}], defaultValue: "full" }',
  ],
  `(inputs) => {
      const people = inputs.people as number;
      const rate = inputs.waterRate as number;
      const sType = inputs.systemType as string;
      if (!people || people <= 0) return null;
      const dailyUse: Record<string, number> = { laundry: 15, bath: 25, full: 40 };
      const greywaterPerDay = (dailyUse[sType] || 40) * people;
      const yearlyGallons = greywaterPerDay * 365;
      const annualSavings = yearlyGallons * rate;
      const irrigationArea = greywaterPerDay * 0.5;
      return {
        primary: { label: "Greywater Reused per Year", value: formatNumber(Math.round(yearlyGallons)) + " gallons" },
        details: [
          { label: "Daily Greywater Output", value: formatNumber(greywaterPerDay) + " gallons" },
          { label: "Annual Savings", value: "$" + formatNumber(Math.round(annualSavings * 100) / 100) },
          { label: "Irrigation Area Supported", value: formatNumber(Math.round(irrigationArea)) + " sq ft" },
        ],
      };
    }`,
  [{ q: 'What is greywater?', a: 'Greywater is gently used water from sinks, showers, bathtubs, and washing machines. It does not include water from toilets or kitchen sinks with food waste.' },
   { q: 'Is greywater safe for garden use?', a: 'Greywater is generally safe for irrigating non-edible plants and trees when used with biodegradable soaps and applied below the surface.' }],
  'Greywater Reused = People x Daily Greywater per Person x 365',
  ['water-conservation-calculator', 'composting-toilet-calculator']
);

// #53 Food Forest Calculator
add('food-forest-calculator', 'Food Forest Calculator',
  'Plan your food forest layout by estimating tree count, yield, and spacing for your available area.',
  'Everyday', 'everyday', '~',
  ['food forest', 'permaculture calculator', 'food forest planner'],
  [
    '{ name: "area", label: "Available Area", type: "number", suffix: "sq ft", min: 100, max: 100000, defaultValue: 5000 }',
    '{ name: "treeType", label: "Primary Tree Type", type: "select", options: [{value:"fruit",label:"Fruit Trees"},{value:"nut",label:"Nut Trees"},{value:"mixed",label:"Mixed Orchard"}], defaultValue: "mixed" }',
    '{ name: "climate", label: "Climate Zone", type: "select", options: [{value:"tropical",label:"Tropical"},{value:"temperate",label:"Temperate"},{value:"arid",label:"Arid"}], defaultValue: "temperate" }',
  ],
  `(inputs) => {
      const area = inputs.area as number;
      const treeType = inputs.treeType as string;
      const climate = inputs.climate as string;
      if (!area || area <= 0) return null;
      const spacing: Record<string, number> = { fruit: 200, nut: 400, mixed: 300 };
      const yieldPerTree: Record<string, number> = { fruit: 100, nut: 50, mixed: 75 };
      const climateMod: Record<string, number> = { tropical: 1.3, temperate: 1.0, arid: 0.7 };
      const treeCount = Math.floor(area / (spacing[treeType] || 300));
      const annualYield = treeCount * (yieldPerTree[treeType] || 75) * (climateMod[climate] || 1.0);
      const understoryPlants = treeCount * 3;
      return {
        primary: { label: "Trees You Can Plant", value: formatNumber(treeCount) + " trees" },
        details: [
          { label: "Estimated Annual Yield", value: formatNumber(Math.round(annualYield)) + " lbs" },
          { label: "Understory Plant Slots", value: formatNumber(understoryPlants) },
          { label: "Spacing per Tree", value: formatNumber(spacing[treeType] || 300) + " sq ft" },
        ],
      };
    }`,
  [{ q: 'What is a food forest?', a: 'A food forest is a diverse planting of edible plants that mimics the structure and function of a natural forest ecosystem, with layers of trees, shrubs, and ground cover.' },
   { q: 'How long does a food forest take to establish?', a: 'Most food forests begin producing meaningful harvests within 3 to 5 years, with full maturity reached in 10 to 15 years depending on the species planted.' }],
  'Tree Count = Available Area / Spacing per Tree',
  ['tree-carbon-calculator', 'water-conservation-calculator']
);

// #54 Cloth Diaper Savings Calculator
add('cloth-diaper-savings-calculator', 'Cloth Diaper Savings Calculator',
  'Compare the total cost of cloth diapers versus disposable diapers over your diapering period.',
  'Finance', 'finance', '$',
  ['cloth diaper savings', 'cloth vs disposable diapers', 'reusable diaper cost'],
  [
    '{ name: "months", label: "Months of Diapering", type: "number", suffix: "months", min: 6, max: 48, defaultValue: 30 }',
    '{ name: "changesPerDay", label: "Diaper Changes per Day", type: "number", suffix: "changes", min: 4, max: 15, defaultValue: 8 }',
    '{ name: "disposableCost", label: "Cost per Disposable Diaper", type: "number", prefix: "$", min: 0.05, max: 1, step: 0.01, defaultValue: 0.25 }',
    '{ name: "clothSetCost", label: "Cloth Diaper Set Cost", type: "number", prefix: "$", min: 100, max: 2000, defaultValue: 400 }',
  ],
  `(inputs) => {
      const months = inputs.months as number;
      const changes = inputs.changesPerDay as number;
      const dispCost = inputs.disposableCost as number;
      const clothCost = inputs.clothSetCost as number;
      if (!months || !changes) return null;
      const totalDays = months * 30;
      const disposableTotal = totalDays * changes * dispCost;
      const laundryPerMonth = 20;
      const clothTotal = clothCost + (months * laundryPerMonth);
      const savings = disposableTotal - clothTotal;
      const diapersSaved = totalDays * changes;
      return {
        primary: { label: "Total Savings with Cloth", value: "$" + formatNumber(Math.round(savings * 100) / 100) },
        details: [
          { label: "Disposable Diaper Total Cost", value: "$" + formatNumber(Math.round(disposableTotal * 100) / 100) },
          { label: "Cloth Diaper Total Cost", value: "$" + formatNumber(Math.round(clothTotal * 100) / 100) },
          { label: "Disposable Diapers Avoided", value: formatNumber(diapersSaved) },
        ],
      };
    }`,
  [{ q: 'How much do cloth diapers really save?', a: 'Most families save between $1,000 and $2,000 over the diapering period by switching to cloth, with even greater savings when reusing for additional children.' },
   { q: 'How many cloth diapers do I need?', a: 'A typical set of 24 to 36 cloth diapers is enough for one child, allowing you to wash every 2 to 3 days without running out.' }],
  'Savings = (Days x Changes x Disposable Cost) - (Cloth Set Cost + Months x Laundry Cost)',
  ['zero-waste-savings-calculator', 'led-conversion-savings-calculator']
);

// #55 Zero Waste Savings Calculator
add('zero-waste-savings-calculator', 'Zero Waste Savings Calculator',
  'Estimate the money you can save by adopting zero waste habits across common household categories.',
  'Finance', 'finance', '$',
  ['zero waste savings', 'zero waste lifestyle', 'waste reduction savings'],
  [
    '{ name: "monthlyGrocery", label: "Monthly Grocery Budget", type: "number", prefix: "$", min: 50, max: 5000, defaultValue: 600 }',
    '{ name: "adoptionLevel", label: "Zero Waste Adoption Level", type: "select", options: [{value:"beginner",label:"Beginner (25%)"},{value:"intermediate",label:"Intermediate (50%)"},{value:"advanced",label:"Advanced (75%)"}], defaultValue: "intermediate" }',
    '{ name: "householdSize", label: "Household Size", type: "number", suffix: "people", min: 1, max: 12, defaultValue: 3 }',
  ],
  `(inputs) => {
      const grocery = inputs.monthlyGrocery as number;
      const level = inputs.adoptionLevel as string;
      const household = inputs.householdSize as number;
      if (!grocery || !household) return null;
      const savingsRate: Record<string, number> = { beginner: 0.10, intermediate: 0.20, advanced: 0.30 };
      const rate = savingsRate[level] || 0.20;
      const monthlyFoodSavings = grocery * rate;
      const monthlyProductSavings = household * 15 * rate * 3;
      const totalMonthlySavings = monthlyFoodSavings + monthlyProductSavings;
      const annualSavings = totalMonthlySavings * 12;
      const wasteReduction = household * 4.4 * (rate * 2.5) * 52;
      return {
        primary: { label: "Annual Savings", value: "$" + formatNumber(Math.round(annualSavings)) },
        details: [
          { label: "Monthly Savings", value: "$" + formatNumber(Math.round(totalMonthlySavings)) },
          { label: "Waste Reduced per Year", value: formatNumber(Math.round(wasteReduction)) + " lbs" },
          { label: "Adoption Level", value: level.charAt(0).toUpperCase() + level.slice(1) },
        ],
      };
    }`,
  [{ q: 'How much money can zero waste living save?', a: 'Most households save between $1,000 and $5,000 per year by reducing packaging waste, buying in bulk, and choosing reusable products over disposable ones.' },
   { q: 'What are easy first steps for zero waste?', a: 'Start with reusable bags, water bottles, and containers. Buy in bulk, compost food scraps, and switch to bar soap and shampoo to reduce packaging.' }],
  'Annual Savings = (Grocery Budget x Savings Rate + Product Savings) x 12',
  ['cloth-diaper-savings-calculator', 'water-conservation-calculator']
);

// #56 Tree Carbon Offset Calculator
add('tree-carbon-calculator', 'Tree Carbon Offset Calculator',
  'Calculate how much CO2 your trees absorb annually and their equivalent carbon offset value.',
  'Science', 'science', 'A',
  ['tree carbon offset', 'CO2 absorption trees', 'carbon sequestration calculator'],
  [
    '{ name: "treeCount", label: "Number of Trees", type: "number", suffix: "trees", min: 1, max: 10000, defaultValue: 10 }',
    '{ name: "treeAge", label: "Average Tree Age", type: "select", options: [{value:"young",label:"Young (1-10 years)"},{value:"mature",label:"Mature (10-30 years)"},{value:"old",label:"Old Growth (30+ years)"}], defaultValue: "mature" }',
    '{ name: "treeType", label: "Tree Type", type: "select", options: [{value:"deciduous",label:"Deciduous (Oak, Maple)"},{value:"conifer",label:"Conifer (Pine, Spruce)"},{value:"tropical",label:"Tropical (Teak, Mahogany)"}], defaultValue: "deciduous" }',
  ],
  `(inputs) => {
      const count = inputs.treeCount as number;
      const age = inputs.treeAge as string;
      const tType = inputs.treeType as string;
      if (!count || count <= 0) return null;
      const baseAbsorption: Record<string, number> = { deciduous: 48, conifer: 36, tropical: 55 };
      const ageMod: Record<string, number> = { young: 0.5, mature: 1.0, old: 0.8 };
      const co2PerTree = (baseAbsorption[tType] || 48) * (ageMod[age] || 1.0);
      const totalCO2 = count * co2PerTree;
      const carsOffset = totalCO2 / 10000;
      const carbonCredits = totalCO2 / 2000 * 15;
      return {
        primary: { label: "CO2 Absorbed per Year", value: formatNumber(Math.round(totalCO2)) + " lbs" },
        details: [
          { label: "CO2 per Tree per Year", value: formatNumber(Math.round(co2PerTree)) + " lbs" },
          { label: "Equivalent Cars Offset", value: formatNumber(Math.round(carsOffset * 100) / 100) },
          { label: "Estimated Carbon Credit Value", value: "$" + formatNumber(Math.round(carbonCredits * 100) / 100) },
        ],
      };
    }`,
  [{ q: 'How much CO2 does a tree absorb per year?', a: 'A mature deciduous tree absorbs approximately 48 pounds of CO2 per year, while younger and older trees absorb somewhat less due to growth rates.' },
   { q: 'How many trees does it take to offset one car?', a: 'It takes approximately 200 mature trees to offset the annual CO2 emissions of one average car, which produces about 10,000 pounds of CO2 per year.' }],
  'Total CO2 Absorbed = Number of Trees x CO2 per Tree x Age Modifier',
  ['food-forest-calculator', 'water-conservation-calculator']
);

// #57 Home Energy Score Calculator
add('home-energy-score-calculator', 'Home Energy Score Calculator',
  'Estimate your home energy efficiency score based on insulation, heating system, and appliance age.',
  'Everyday', 'everyday', '~',
  ['home energy score', 'energy efficiency rating', 'home energy audit'],
  [
    '{ name: "homeSize", label: "Home Size", type: "number", suffix: "sq ft", min: 200, max: 20000, defaultValue: 2000 }',
    '{ name: "insulation", label: "Insulation Quality", type: "select", options: [{value:"poor",label:"Poor (No Insulation)"},{value:"average",label:"Average"},{value:"good",label:"Good (Well Insulated)"},{value:"excellent",label:"Excellent (Spray Foam)"}], defaultValue: "average" }',
    '{ name: "heatingAge", label: "Heating System Age", type: "number", suffix: "years", min: 0, max: 50, defaultValue: 10 }',
    '{ name: "windowType", label: "Window Type", type: "select", options: [{value:"single",label:"Single Pane"},{value:"double",label:"Double Pane"},{value:"triple",label:"Triple Pane"}], defaultValue: "double" }',
  ],
  `(inputs) => {
      const size = inputs.homeSize as number;
      const insulation = inputs.insulation as string;
      const hvacAge = inputs.heatingAge as number;
      const windows = inputs.windowType as string;
      if (!size || size <= 0) return null;
      let score = 5;
      const insulMod: Record<string, number> = { poor: -2, average: 0, good: 1.5, excellent: 2.5 };
      const windowMod: Record<string, number> = { single: -1.5, double: 0, triple: 1.5 };
      score += insulMod[insulation] || 0;
      score += windowMod[windows] || 0;
      if (hvacAge <= 5) score += 1.5;
      else if (hvacAge <= 10) score += 0.5;
      else if (hvacAge >= 20) score -= 1.5;
      score = Math.max(1, Math.min(10, Math.round(score * 10) / 10));
      const rating = score >= 8 ? "Excellent" : score >= 6 ? "Good" : score >= 4 ? "Average" : "Needs Improvement";
      const estMonthlyCost = size * 0.08 * (11 - score) / 5;
      return {
        primary: { label: "Home Energy Score", value: formatNumber(score) + " / 10" },
        details: [
          { label: "Rating", value: rating },
          { label: "Estimated Monthly Energy Cost", value: "$" + formatNumber(Math.round(estMonthlyCost)) },
          { label: "Potential Savings with Upgrades", value: "$" + formatNumber(Math.round(estMonthlyCost * 0.3)) + "/month" },
        ],
      };
    }`,
  [{ q: 'What is a home energy score?', a: 'A home energy score rates your home on a scale of 1 to 10 based on factors like insulation, heating systems, and windows. A higher score means greater energy efficiency.' },
   { q: 'How can I improve my home energy score?', a: 'Upgrading insulation, replacing old HVAC systems, installing double or triple pane windows, and sealing air leaks are the most effective ways to improve your score.' }],
  'Score = Base (5) + Insulation Modifier + Window Modifier + HVAC Age Modifier',
  ['led-conversion-savings-calculator', 'water-conservation-calculator']
);

// #58 LED Conversion Savings Calculator
add('led-conversion-savings-calculator', 'LED Conversion Savings Calculator',
  'Calculate how much you can save by replacing traditional light bulbs with LED bulbs.',
  'Finance', 'finance', '$',
  ['LED savings', 'LED bulb conversion', 'light bulb upgrade savings'],
  [
    '{ name: "bulbCount", label: "Number of Bulbs to Replace", type: "number", suffix: "bulbs", min: 1, max: 200, defaultValue: 20 }',
    '{ name: "hoursPerDay", label: "Average Daily Use per Bulb", type: "number", suffix: "hours", min: 1, max: 24, defaultValue: 5 }',
    '{ name: "electricityRate", label: "Electricity Rate", type: "number", prefix: "$", suffix: "/kWh", min: 0.01, max: 1, step: 0.01, defaultValue: 0.13 }',
    '{ name: "oldBulbType", label: "Current Bulb Type", type: "select", options: [{value:"incandescent",label:"Incandescent (60W)"},{value:"halogen",label:"Halogen (43W)"},{value:"cfl",label:"CFL (13W)"}], defaultValue: "incandescent" }',
  ],
  `(inputs) => {
      const bulbs = inputs.bulbCount as number;
      const hours = inputs.hoursPerDay as number;
      const rate = inputs.electricityRate as number;
      const oldType = inputs.oldBulbType as string;
      if (!bulbs || !hours) return null;
      const oldWatts: Record<string, number> = { incandescent: 60, halogen: 43, cfl: 13 };
      const ledWatts = 9;
      const oldW = oldWatts[oldType] || 60;
      const savingsPerBulbPerYear = (oldW - ledWatts) / 1000 * hours * 365 * rate;
      const totalAnnualSavings = savingsPerBulbPerYear * bulbs;
      const ledCost = bulbs * 3;
      const paybackMonths = ledCost / (totalAnnualSavings / 12);
      const kwhSaved = (oldW - ledWatts) / 1000 * hours * 365 * bulbs;
      return {
        primary: { label: "Annual Savings", value: "$" + formatNumber(Math.round(totalAnnualSavings * 100) / 100) },
        details: [
          { label: "Energy Saved per Year", value: formatNumber(Math.round(kwhSaved)) + " kWh" },
          { label: "LED Upgrade Cost", value: "$" + formatNumber(ledCost) },
          { label: "Payback Period", value: formatNumber(Math.round(paybackMonths * 10) / 10) + " months" },
        ],
      };
    }`,
  [{ q: 'How much can LED bulbs save on electricity?', a: 'LED bulbs use 75 to 80 percent less energy than incandescent bulbs. A typical household can save $100 to $300 per year by switching all bulbs to LED.' },
   { q: 'How long do LED bulbs last?', a: 'Most LED bulbs last 25,000 to 50,000 hours, which is 15 to 25 times longer than traditional incandescent bulbs.' }],
  'Annual Savings = Bulbs x (Old Watts - LED Watts) / 1000 x Hours/Day x 365 x Rate',
  ['home-energy-score-calculator', 'bicycle-commute-savings-calculator']
);

// #59 Water Conservation Calculator
add('water-conservation-calculator', 'Water Conservation Calculator',
  'Estimate water savings from implementing common water conservation strategies in your home.',
  'Everyday', 'everyday', '~',
  ['water conservation', 'water saving calculator', 'reduce water use'],
  [
    '{ name: "people", label: "Household Members", type: "number", suffix: "people", min: 1, max: 15, defaultValue: 4 }',
    '{ name: "currentUsage", label: "Current Monthly Water Use", type: "number", suffix: "gallons", min: 500, max: 50000, defaultValue: 8000 }',
    '{ name: "strategies", label: "Conservation Level", type: "select", options: [{value:"basic",label:"Basic (Low-Flow Fixtures)"},{value:"moderate",label:"Moderate (Fixtures + Habits)"},{value:"aggressive",label:"Aggressive (Full Overhaul)"}], defaultValue: "moderate" }',
    '{ name: "waterRate", label: "Water Cost per 1000 Gallons", type: "number", prefix: "$", min: 1, max: 30, defaultValue: 6 }',
  ],
  `(inputs) => {
      const people = inputs.people as number;
      const usage = inputs.currentUsage as number;
      const strategy = inputs.strategies as string;
      const rate = inputs.waterRate as number;
      if (!people || !usage) return null;
      const reductionRate: Record<string, number> = { basic: 0.15, moderate: 0.30, aggressive: 0.45 };
      const reduction = reductionRate[strategy] || 0.30;
      const monthlySaved = usage * reduction;
      const yearlySaved = monthlySaved * 12;
      const annualCostSavings = (yearlySaved / 1000) * rate;
      return {
        primary: { label: "Water Saved per Year", value: formatNumber(Math.round(yearlySaved)) + " gallons" },
        details: [
          { label: "Monthly Reduction", value: formatNumber(Math.round(monthlySaved)) + " gallons" },
          { label: "Annual Cost Savings", value: "$" + formatNumber(Math.round(annualCostSavings * 100) / 100) },
          { label: "Reduction Percentage", value: formatNumber(reduction * 100) + "%" },
        ],
      };
    }`,
  [{ q: 'What is the easiest way to conserve water at home?', a: 'Installing low-flow showerheads and faucet aerators is the easiest first step, reducing water use by 15 to 30 percent with minimal effort and cost.' },
   { q: 'How much water does the average household use?', a: 'The average American household uses about 300 gallons per day, or roughly 9,000 gallons per month, with toilets, showers, and laundry being the largest users.' }],
  'Water Saved = Current Usage x Reduction Rate x 12 months',
  ['greywater-system-calculator', 'composting-toilet-calculator']
);

// #60 Bicycle Commute Savings Calculator
add('bicycle-commute-savings-calculator', 'Bicycle Commute Savings Calculator',
  'Calculate how much money you save by commuting by bicycle instead of driving a car.',
  'Finance', 'finance', '$',
  ['bicycle commute savings', 'bike vs car commute', 'cycling savings calculator'],
  [
    '{ name: "commuteDistance", label: "One-Way Commute Distance", type: "number", suffix: "miles", min: 0.5, max: 50, step: 0.5, defaultValue: 8 }',
    '{ name: "daysPerWeek", label: "Commute Days per Week", type: "number", suffix: "days", min: 1, max: 7, defaultValue: 5 }',
    '{ name: "gasPrice", label: "Gas Price per Gallon", type: "number", prefix: "$", min: 1, max: 10, step: 0.01, defaultValue: 3.50 }',
    '{ name: "carMpg", label: "Car Fuel Efficiency", type: "number", suffix: "mpg", min: 10, max: 60, defaultValue: 28 }',
  ],
  `(inputs) => {
      const distance = inputs.commuteDistance as number;
      const days = inputs.daysPerWeek as number;
      const gas = inputs.gasPrice as number;
      const mpg = inputs.carMpg as number;
      if (!distance || !days || !mpg) return null;
      const weeklyMiles = distance * 2 * days;
      const yearlyMiles = weeklyMiles * 50;
      const yearlyGasCost = (yearlyMiles / mpg) * gas;
      const yearlyCarCosts = yearlyMiles * 0.20;
      const totalCarCost = yearlyGasCost + yearlyCarCosts;
      const bikeCostPerYear = 200;
      const savings = totalCarCost - bikeCostPerYear;
      const co2Saved = yearlyMiles * 0.89;
      return {
        primary: { label: "Annual Savings", value: "$" + formatNumber(Math.round(savings)) },
        details: [
          { label: "Annual Car Commute Cost", value: "$" + formatNumber(Math.round(totalCarCost)) },
          { label: "Annual Bike Cost (Maintenance)", value: "$" + formatNumber(bikeCostPerYear) },
          { label: "CO2 Emissions Avoided", value: formatNumber(Math.round(co2Saved)) + " lbs" },
        ],
      };
    }`,
  [{ q: 'How much can I save by biking to work?', a: 'Depending on your commute distance, most cyclists save between $2,000 and $5,000 per year compared to driving, including fuel, maintenance, and wear costs.' },
   { q: 'Is bicycle commuting practical year-round?', a: 'With proper rain gear, lights, and layered clothing, many cyclists commute year-round. Studded tires can help in icy conditions.' }],
  'Savings = (Yearly Miles / MPG x Gas Price + Yearly Miles x Wear Cost) - Bike Maintenance',
  ['led-conversion-savings-calculator', 'zero-waste-savings-calculator']
);

// #61 Movie Night Cost Calculator
add('movie-night-cost-calculator', 'Movie Night Cost Calculator',
  'Compare the cost of going to the theater versus hosting a movie night at home.',
  'Everyday', 'everyday', '~',
  ['movie night cost', 'theater vs home movie', 'movie budget calculator'],
  [
    '{ name: "people", label: "Number of People", type: "number", suffix: "people", min: 1, max: 20, defaultValue: 4 }',
    '{ name: "ticketPrice", label: "Movie Ticket Price", type: "number", prefix: "$", min: 5, max: 30, defaultValue: 14 }',
    '{ name: "snackBudget", label: "Snack Budget per Person", type: "number", prefix: "$", min: 0, max: 50, defaultValue: 10 }',
    '{ name: "venue", label: "Venue", type: "select", options: [{value:"theater",label:"Movie Theater"},{value:"home",label:"Home Streaming"}], defaultValue: "theater" }',
  ],
  `(inputs) => {
      const people = inputs.people as number;
      const ticket = inputs.ticketPrice as number;
      const snack = inputs.snackBudget as number;
      const venue = inputs.venue as string;
      if (!people || people <= 0) return null;
      let totalCost = 0;
      if (venue === "theater") {
        totalCost = (ticket * people) + (snack * people);
      } else {
        const rentalFee = 6;
        const homeSnacks = snack * 0.4 * people;
        totalCost = rentalFee + homeSnacks;
      }
      const costPerPerson = totalCost / people;
      const theaterTotal = (ticket * people) + (snack * people);
      const homeTotal = 6 + (snack * 0.4 * people);
      const savings = theaterTotal - homeTotal;
      return {
        primary: { label: "Total Cost", value: "$" + formatNumber(Math.round(totalCost * 100) / 100) },
        details: [
          { label: "Cost per Person", value: "$" + formatNumber(Math.round(costPerPerson * 100) / 100) },
          { label: "Theater Cost", value: "$" + formatNumber(Math.round(theaterTotal * 100) / 100) },
          { label: "Home Movie Savings", value: "$" + formatNumber(Math.round(savings * 100) / 100) },
        ],
      };
    }`,
  [{ q: 'How much does a movie night out typically cost?', a: 'A movie theater outing typically costs $20 to $30 per person when including tickets, popcorn, and drinks. A home movie night usually costs $3 to $5 per person.' },
   { q: 'What do I need for a home movie night?', a: 'A streaming subscription or rental, comfortable seating, snacks, and good lighting control are the essentials for a great home movie night.' }],
  'Total Cost = (Ticket Price x People) + (Snack Budget x People) or Rental Fee + Home Snacks',
  ['concert-budget-calculator', 'game-night-calculator']
);

// #62 Concert Budget Calculator
add('concert-budget-calculator', 'Concert Budget Calculator',
  'Plan your total concert trip budget including tickets, travel, food, and merchandise.',
  'Finance', 'finance', '$',
  ['concert budget', 'concert trip cost', 'concert expense planner'],
  [
    '{ name: "ticketCost", label: "Ticket Cost", type: "number", prefix: "$", min: 10, max: 2000, defaultValue: 120 }',
    '{ name: "people", label: "Number of People", type: "number", suffix: "people", min: 1, max: 10, defaultValue: 2 }',
    '{ name: "travelCost", label: "Travel Cost (Round Trip)", type: "number", prefix: "$", min: 0, max: 2000, defaultValue: 50 }',
    '{ name: "extras", label: "Food and Merchandise Budget", type: "number", prefix: "$", min: 0, max: 500, defaultValue: 60 }',
  ],
  `(inputs) => {
      const ticket = inputs.ticketCost as number;
      const people = inputs.people as number;
      const travel = inputs.travelCost as number;
      const extras = inputs.extras as number;
      if (!people || people <= 0) return null;
      const ticketsTotal = ticket * people;
      const extrasTotal = extras * people;
      const totalCost = ticketsTotal + travel + extrasTotal;
      const perPerson = totalCost / people;
      return {
        primary: { label: "Total Concert Budget", value: "$" + formatNumber(Math.round(totalCost * 100) / 100) },
        details: [
          { label: "Tickets Total", value: "$" + formatNumber(Math.round(ticketsTotal * 100) / 100) },
          { label: "Cost per Person", value: "$" + formatNumber(Math.round(perPerson * 100) / 100) },
          { label: "Travel + Extras", value: "$" + formatNumber(Math.round((travel + extrasTotal) * 100) / 100) },
        ],
      };
    }`,
  [{ q: 'How much should I budget for a concert?', a: 'Budget for the ticket price plus 30 to 50 percent more for parking, food, drinks, and merchandise. A typical concert outing costs $80 to $200 per person.' },
   { q: 'How can I save money on concert tickets?', a: 'Buy tickets early during presale events, use credit card reward points, check resale sites close to the event date, and consider lawn or general admission seats.' }],
  'Total Budget = (Ticket Cost x People) + Travel Cost + (Extras x People)',
  ['movie-night-cost-calculator', 'theme-park-budget-calculator']
);

// #63 Theme Park Budget Calculator
add('theme-park-budget-calculator', 'Theme Park Budget Calculator',
  'Estimate the total cost of a theme park visit including admission, food, and souvenirs.',
  'Finance', 'finance', '$',
  ['theme park budget', 'theme park cost', 'amusement park budget'],
  [
    '{ name: "adults", label: "Number of Adults", type: "number", suffix: "adults", min: 0, max: 20, defaultValue: 2 }',
    '{ name: "children", label: "Number of Children", type: "number", suffix: "children", min: 0, max: 20, defaultValue: 2 }',
    '{ name: "ticketType", label: "Ticket Type", type: "select", options: [{value:"single",label:"Single Day"},{value:"multi",label:"Multi-Day (2 days)"},{value:"season",label:"Season Pass"}], defaultValue: "single" }',
    '{ name: "foodBudget", label: "Food Budget per Person", type: "number", prefix: "$", min: 10, max: 200, defaultValue: 50 }',
  ],
  `(inputs) => {
      const adults = inputs.adults as number;
      const children = inputs.children as number;
      const ticketType = inputs.ticketType as string;
      const food = inputs.foodBudget as number;
      if ((adults + children) <= 0) return null;
      const adultPrices: Record<string, number> = { single: 110, multi: 190, season: 350 };
      const childPrices: Record<string, number> = { single: 85, multi: 150, season: 280 };
      const adultTickets = adults * (adultPrices[ticketType] || 110);
      const childTickets = children * (childPrices[ticketType] || 85);
      const totalPeople = adults + children;
      const foodTotal = food * totalPeople;
      const parking = 30;
      const souvenirs = totalPeople * 20;
      const total = adultTickets + childTickets + foodTotal + parking + souvenirs;
      return {
        primary: { label: "Total Trip Cost", value: "$" + formatNumber(Math.round(total)) },
        details: [
          { label: "Admission Total", value: "$" + formatNumber(Math.round(adultTickets + childTickets)) },
          { label: "Food and Souvenirs", value: "$" + formatNumber(Math.round(foodTotal + souvenirs)) },
          { label: "Cost per Person", value: "$" + formatNumber(Math.round(total / totalPeople)) },
        ],
      };
    }`,
  [{ q: 'How much does a theme park trip cost for a family of 4?', a: 'A typical single-day theme park visit for a family of four costs $500 to $800 including tickets, food, parking, and souvenirs.' },
   { q: 'Are season passes worth it?', a: 'Season passes are usually worth it if you visit three or more times per year. They often include perks like free parking and discounts on food and merchandise.' }],
  'Total = Adult Tickets + Child Tickets + Food + Parking + Souvenirs',
  ['concert-budget-calculator', 'zoo-visit-cost-calculator']
);

// #64 Escape Room Cost Calculator
add('escape-room-cost-calculator', 'Escape Room Cost Calculator',
  'Calculate the per person and total cost for an escape room outing with your group.',
  'Everyday', 'everyday', '~',
  ['escape room cost', 'escape room pricing', 'escape room group cost'],
  [
    '{ name: "groupSize", label: "Group Size", type: "number", suffix: "people", min: 2, max: 12, defaultValue: 6 }',
    '{ name: "pricePerPerson", label: "Price per Person", type: "number", prefix: "$", min: 15, max: 60, defaultValue: 30 }',
    '{ name: "rooms", label: "Number of Rooms", type: "number", suffix: "rooms", min: 1, max: 4, defaultValue: 1 }',
  ],
  `(inputs) => {
      const group = inputs.groupSize as number;
      const price = inputs.pricePerPerson as number;
      const rooms = inputs.rooms as number;
      if (!group || !price || !rooms) return null;
      const baseCost = group * price * rooms;
      const tipAmount = baseCost * 0.15;
      const totalWithTip = baseCost + tipAmount;
      const perPersonTotal = totalWithTip / group;
      return {
        primary: { label: "Total Cost", value: "$" + formatNumber(Math.round(totalWithTip * 100) / 100) },
        details: [
          { label: "Base Cost", value: "$" + formatNumber(Math.round(baseCost * 100) / 100) },
          { label: "Suggested Tip (15%)", value: "$" + formatNumber(Math.round(tipAmount * 100) / 100) },
          { label: "Per Person (with Tip)", value: "$" + formatNumber(Math.round(perPersonTotal * 100) / 100) },
        ],
      };
    }`,
  [{ q: 'How much does an escape room cost?', a: 'Escape rooms typically cost $25 to $40 per person per room. Group rates may be available for larger parties, and private bookings can cost more.' },
   { q: 'How many people should be in an escape room group?', a: 'Most escape rooms are designed for 4 to 8 players. A group of 4 to 6 is ideal for good communication and ensuring everyone stays engaged.' }],
  'Total Cost = Group Size x Price per Person x Rooms + Tip',
  ['bowling-cost-calculator', 'karaoke-cost-calculator']
);

// #65 Bowling Cost Calculator
add('bowling-cost-calculator', 'Bowling Cost Calculator',
  'Estimate the total cost of a bowling outing including games, shoe rental, and food.',
  'Everyday', 'everyday', '~',
  ['bowling cost', 'bowling night budget', 'bowling alley price'],
  [
    '{ name: "players", label: "Number of Players", type: "number", suffix: "players", min: 1, max: 20, defaultValue: 4 }',
    '{ name: "games", label: "Number of Games", type: "number", suffix: "games", min: 1, max: 10, defaultValue: 3 }',
    '{ name: "pricePerGame", label: "Price per Game per Person", type: "number", prefix: "$", min: 2, max: 15, defaultValue: 5 }',
    '{ name: "foodPerPerson", label: "Food and Drinks per Person", type: "number", prefix: "$", min: 0, max: 50, defaultValue: 12 }',
  ],
  `(inputs) => {
      const players = inputs.players as number;
      const games = inputs.games as number;
      const pricePerGame = inputs.pricePerGame as number;
      const food = inputs.foodPerPerson as number;
      if (!players || !games) return null;
      const gamesCost = players * games * pricePerGame;
      const shoeRental = players * 5;
      const foodTotal = players * food;
      const total = gamesCost + shoeRental + foodTotal;
      const perPerson = total / players;
      return {
        primary: { label: "Total Bowling Cost", value: "$" + formatNumber(Math.round(total * 100) / 100) },
        details: [
          { label: "Games Cost", value: "$" + formatNumber(Math.round(gamesCost * 100) / 100) },
          { label: "Shoe Rental", value: "$" + formatNumber(shoeRental) },
          { label: "Cost per Person", value: "$" + formatNumber(Math.round(perPerson * 100) / 100) },
        ],
      };
    }`,
  [{ q: 'How much does bowling cost per person?', a: 'A typical bowling outing costs $15 to $30 per person for 2 to 3 games including shoe rental. Adding food and drinks can bring the total to $25 to $45 per person.' },
   { q: 'Is it cheaper to bowl during off-peak hours?', a: 'Yes, many bowling alleys offer discounted rates during weekday afternoons and late-night sessions, often 30 to 50 percent less than peak weekend rates.' }],
  'Total = (Players x Games x Price per Game) + (Players x Shoe Rental) + (Players x Food)',
  ['escape-room-cost-calculator', 'movie-night-cost-calculator']
);

// #66 Game Night Calculator
add('game-night-calculator', 'Game Night Calculator',
  'Plan your game night hosting costs including snacks, drinks, and supplies for your group.',
  'Everyday', 'everyday', '~',
  ['game night cost', 'game night planner', 'hosting game night budget'],
  [
    '{ name: "guests", label: "Number of Guests", type: "number", suffix: "guests", min: 2, max: 20, defaultValue: 6 }',
    '{ name: "snackBudget", label: "Snack Budget", type: "number", prefix: "$", min: 5, max: 200, defaultValue: 30 }',
    '{ name: "drinkBudget", label: "Drink Budget", type: "number", prefix: "$", min: 0, max: 200, defaultValue: 25 }',
  ],
  `(inputs) => {
      const guests = inputs.guests as number;
      const snacks = inputs.snackBudget as number;
      const drinks = inputs.drinkBudget as number;
      if (!guests || guests <= 0) return null;
      const supplies = 10;
      const total = snacks + drinks + supplies;
      const perGuest = total / guests;
      const splitEvenly = total / (guests + 1);
      return {
        primary: { label: "Total Hosting Cost", value: "$" + formatNumber(Math.round(total * 100) / 100) },
        details: [
          { label: "Cost per Guest (Host Pays All)", value: "$" + formatNumber(Math.round(perGuest * 100) / 100) },
          { label: "Cost if Split Evenly", value: "$" + formatNumber(Math.round(splitEvenly * 100) / 100) + " each" },
          { label: "Supplies Estimate", value: "$" + formatNumber(supplies) },
        ],
      };
    }`,
  [{ q: 'How much does it cost to host a game night?', a: 'A typical game night costs $30 to $60 for snacks and drinks for 4 to 8 guests. Ask guests to bring a dish or drink to reduce costs.' },
   { q: 'What are good games for game night?', a: 'Popular choices include Codenames, Catan, Ticket to Ride, and Jackbox Party Packs. Choose games that match your group size and experience level.' }],
  'Total = Snack Budget + Drink Budget + Supplies',
  ['movie-night-cost-calculator', 'potluck-planner-calculator']
);

// #67 Karaoke Night Cost Calculator
add('karaoke-cost-calculator', 'Karaoke Night Cost Calculator',
  'Estimate the total cost of a karaoke night out including room rental, drinks, and food.',
  'Everyday', 'everyday', '~',
  ['karaoke cost', 'karaoke night budget', 'karaoke room price'],
  [
    '{ name: "people", label: "Number of People", type: "number", suffix: "people", min: 2, max: 20, defaultValue: 6 }',
    '{ name: "hours", label: "Room Hours", type: "number", suffix: "hours", min: 1, max: 6, defaultValue: 2 }',
    '{ name: "roomRate", label: "Room Rate per Hour", type: "number", prefix: "$", min: 20, max: 200, defaultValue: 50 }',
    '{ name: "drinksPerPerson", label: "Drinks and Food per Person", type: "number", prefix: "$", min: 0, max: 100, defaultValue: 20 }',
  ],
  `(inputs) => {
      const people = inputs.people as number;
      const hours = inputs.hours as number;
      const roomRate = inputs.roomRate as number;
      const drinks = inputs.drinksPerPerson as number;
      if (!people || !hours) return null;
      const roomCost = hours * roomRate;
      const drinksCost = people * drinks;
      const total = roomCost + drinksCost;
      const perPerson = total / people;
      return {
        primary: { label: "Total Karaoke Cost", value: "$" + formatNumber(Math.round(total * 100) / 100) },
        details: [
          { label: "Room Rental", value: "$" + formatNumber(Math.round(roomCost * 100) / 100) },
          { label: "Food and Drinks", value: "$" + formatNumber(Math.round(drinksCost * 100) / 100) },
          { label: "Per Person", value: "$" + formatNumber(Math.round(perPerson * 100) / 100) },
        ],
      };
    }`,
  [{ q: 'How much does a karaoke room cost?', a: 'Private karaoke rooms typically cost $30 to $80 per hour depending on location and room size. Many venues offer package deals for 2 or more hours.' },
   { q: 'How many people fit in a karaoke room?', a: 'Small rooms hold 4 to 8 people, medium rooms fit 8 to 15, and large rooms can accommodate 15 to 30 guests. Larger rooms cost more per hour.' }],
  'Total = (Hours x Room Rate) + (People x Drinks per Person)',
  ['bowling-cost-calculator', 'escape-room-cost-calculator']
);

// #68 Museum Visit Cost Calculator
add('museum-visit-calculator', 'Museum Visit Cost Calculator',
  'Estimate the total cost of a museum visit including admission, parking, and gift shop.',
  'Everyday', 'everyday', '~',
  ['museum visit cost', 'museum trip budget', 'museum admission price'],
  [
    '{ name: "adults", label: "Number of Adults", type: "number", suffix: "adults", min: 0, max: 20, defaultValue: 2 }',
    '{ name: "children", label: "Number of Children", type: "number", suffix: "children", min: 0, max: 20, defaultValue: 2 }',
    '{ name: "admissionType", label: "Admission Type", type: "select", options: [{value:"general",label:"General Admission ($20)"},{value:"special",label:"Special Exhibit ($30)"},{value:"membership",label:"Annual Membership ($120)"}], defaultValue: "general" }',
  ],
  `(inputs) => {
      const adults = inputs.adults as number;
      const children = inputs.children as number;
      const admType = inputs.admissionType as string;
      const totalPeople = adults + children;
      if (totalPeople <= 0) return null;
      const adultPrices: Record<string, number> = { general: 20, special: 30, membership: 120 };
      const childPrices: Record<string, number> = { general: 12, special: 18, membership: 60 };
      const admissionCost = (adults * (adultPrices[admType] || 20)) + (children * (childPrices[admType] || 12));
      const parking = 15;
      const giftShop = totalPeople * 10;
      const total = admissionCost + parking + giftShop;
      return {
        primary: { label: "Total Museum Visit Cost", value: "$" + formatNumber(Math.round(total)) },
        details: [
          { label: "Admission", value: "$" + formatNumber(Math.round(admissionCost)) },
          { label: "Parking", value: "$" + formatNumber(parking) },
          { label: "Cost per Person", value: "$" + formatNumber(Math.round(total / totalPeople)) },
        ],
      };
    }`,
  [{ q: 'How much does a museum visit cost?', a: 'Museum admission typically ranges from $15 to $30 for adults and $8 to $18 for children. Many museums offer free days or discounted hours throughout the month.' },
   { q: 'Are museum memberships worth it?', a: 'A membership usually pays for itself after 2 to 3 visits per year and often includes benefits like free parking, gift shop discounts, and guest passes.' }],
  'Total = (Adult Admission + Child Admission) + Parking + Gift Shop',
  ['zoo-visit-cost-calculator', 'theme-park-budget-calculator']
);

// #69 Zoo Visit Cost Calculator
add('zoo-visit-cost-calculator', 'Zoo Visit Cost Calculator',
  'Plan your zoo visit budget including tickets, food, and animal encounters.',
  'Everyday', 'everyday', '~',
  ['zoo visit cost', 'zoo trip budget', 'zoo admission price'],
  [
    '{ name: "adults", label: "Number of Adults", type: "number", suffix: "adults", min: 0, max: 20, defaultValue: 2 }',
    '{ name: "children", label: "Number of Children", type: "number", suffix: "children", min: 0, max: 20, defaultValue: 2 }',
    '{ name: "foodBudget", label: "Food Budget per Person", type: "number", prefix: "$", min: 0, max: 100, defaultValue: 20 }',
    '{ name: "extras", label: "Extra Experiences", type: "select", options: [{value:"none",label:"None"},{value:"basic",label:"Train Ride ($8)"},{value:"premium",label:"Animal Encounter ($25)"}], defaultValue: "basic" }',
  ],
  `(inputs) => {
      const adults = inputs.adults as number;
      const children = inputs.children as number;
      const food = inputs.foodBudget as number;
      const extras = inputs.extras as string;
      const totalPeople = adults + children;
      if (totalPeople <= 0) return null;
      const adultAdmission = adults * 25;
      const childAdmission = children * 18;
      const extraPrices: Record<string, number> = { none: 0, basic: 8, premium: 25 };
      const extrasCost = (extraPrices[extras] || 0) * totalPeople;
      const foodTotal = food * totalPeople;
      const parking = 20;
      const total = adultAdmission + childAdmission + extrasCost + foodTotal + parking;
      return {
        primary: { label: "Total Zoo Visit Cost", value: "$" + formatNumber(Math.round(total)) },
        details: [
          { label: "Admission Total", value: "$" + formatNumber(adultAdmission + childAdmission) },
          { label: "Food and Extras", value: "$" + formatNumber(Math.round(foodTotal + extrasCost)) },
          { label: "Cost per Person", value: "$" + formatNumber(Math.round(total / totalPeople)) },
        ],
      };
    }`,
  [{ q: 'How much does a zoo visit cost for a family?', a: 'A typical zoo visit for a family of four costs $120 to $200 including admission, food, and one or two extra experiences.' },
   { q: 'When is the best time to visit a zoo?', a: 'Weekday mornings are the least crowded and animals tend to be more active. Many zoos offer discounted admission during winter months.' }],
  'Total = Adult Admission + Child Admission + Food + Extras + Parking',
  ['museum-visit-calculator', 'theme-park-budget-calculator']
);

// #70 Amusement Park Calculator
add('amusement-park-calculator', 'Amusement Park Calculator',
  'Estimate ride capacity and average wait times at an amusement park based on crowd level.',
  'Everyday', 'everyday', '~',
  ['amusement park rides', 'ride wait time', 'park capacity calculator'],
  [
    '{ name: "parkHours", label: "Park Hours Available", type: "number", suffix: "hours", min: 1, max: 16, defaultValue: 8 }',
    '{ name: "crowdLevel", label: "Crowd Level", type: "select", options: [{value:"low",label:"Low (Weekday)"},{value:"medium",label:"Medium (Weekend)"},{value:"high",label:"High (Holiday)"}], defaultValue: "medium" }',
    '{ name: "ridePreference", label: "Ride Preference", type: "select", options: [{value:"thrill",label:"Thrill Rides"},{value:"family",label:"Family Rides"},{value:"mixed",label:"Mixed"}], defaultValue: "mixed" }',
  ],
  `(inputs) => {
      const hours = inputs.parkHours as number;
      const crowd = inputs.crowdLevel as string;
      const pref = inputs.ridePreference as string;
      if (!hours || hours <= 0) return null;
      const avgWait: Record<string, number> = { low: 10, medium: 30, high: 60 };
      const rideDuration: Record<string, number> = { thrill: 3, family: 5, mixed: 4 };
      const waitTime = avgWait[crowd] || 30;
      const duration = rideDuration[pref] || 4;
      const totalMinutes = hours * 60;
      const timePerRide = waitTime + duration;
      const ridesPerDay = Math.floor(totalMinutes / timePerRide);
      const actualRideTime = ridesPerDay * duration;
      const waitingTime = ridesPerDay * waitTime;
      return {
        primary: { label: "Rides You Can Enjoy", value: formatNumber(ridesPerDay) + " rides" },
        details: [
          { label: "Average Wait per Ride", value: formatNumber(waitTime) + " minutes" },
          { label: "Total Time on Rides", value: formatNumber(actualRideTime) + " minutes" },
          { label: "Total Time Waiting", value: formatNumber(waitingTime) + " minutes" },
        ],
      };
    }`,
  [{ q: 'How many rides can you go on in a day?', a: 'On an average day you can expect to ride 8 to 15 rides. On low crowd days you may get 20 or more, while high crowd days may limit you to 5 to 8 rides.' },
   { q: 'How can I minimize wait times at an amusement park?', a: 'Arrive early, visit on weekdays, use single rider lines, and consider purchasing skip-the-line passes to maximize your ride count.' }],
  'Rides per Day = Park Hours x 60 / (Average Wait + Ride Duration)',
  ['theme-park-budget-calculator', 'zoo-visit-cost-calculator']
);

// #71 Electrician Rate Calculator
add('electrician-rate-calculator', 'Electrician Rate Calculator',
  'Calculate electrician service pricing based on job type, hours, and material costs.',
  'Finance', 'finance', '$',
  ['electrician rate', 'electrician hourly cost', 'electrical work pricing'],
  [
    '{ name: "hours", label: "Estimated Hours", type: "number", suffix: "hours", min: 0.5, max: 40, step: 0.5, defaultValue: 3 }',
    '{ name: "hourlyRate", label: "Hourly Rate", type: "number", prefix: "$", min: 30, max: 200, defaultValue: 85 }',
    '{ name: "materialCost", label: "Material Cost", type: "number", prefix: "$", min: 0, max: 10000, defaultValue: 150 }',
    '{ name: "jobType", label: "Job Complexity", type: "select", options: [{value:"simple",label:"Simple (Outlet/Switch)"},{value:"moderate",label:"Moderate (Panel Work)"},{value:"complex",label:"Complex (Rewiring)"}], defaultValue: "moderate" }',
  ],
  `(inputs) => {
      const hours = inputs.hours as number;
      const rate = inputs.hourlyRate as number;
      const materials = inputs.materialCost as number;
      const jobType = inputs.jobType as string;
      if (!hours || !rate) return null;
      const complexityMod: Record<string, number> = { simple: 1.0, moderate: 1.2, complex: 1.5 };
      const laborCost = hours * rate * (complexityMod[jobType] || 1.2);
      const serviceFee = 75;
      const total = laborCost + materials + serviceFee;
      return {
        primary: { label: "Total Estimated Cost", value: "$" + formatNumber(Math.round(total * 100) / 100) },
        details: [
          { label: "Labor Cost", value: "$" + formatNumber(Math.round(laborCost * 100) / 100) },
          { label: "Materials", value: "$" + formatNumber(Math.round(materials * 100) / 100) },
          { label: "Service Call Fee", value: "$" + formatNumber(serviceFee) },
        ],
      };
    }`,
  [{ q: 'How much does an electrician charge per hour?', a: 'Electricians typically charge $50 to $130 per hour depending on experience, location, and job complexity. Emergency or after-hours calls often carry a premium.' },
   { q: 'Should I hire a licensed electrician?', a: 'Yes, always hire a licensed electrician for electrical work. Unlicensed work can void your insurance, violate building codes, and create serious safety hazards.' }],
  'Total = (Hours x Hourly Rate x Complexity Multiplier) + Materials + Service Fee',
  ['plumber-rate-calculator', 'contractor-markup-calculator']
);

// #72 Plumber Rate Calculator
add('plumber-rate-calculator', 'Plumber Rate Calculator',
  'Estimate plumbing service costs based on job type, duration, and parts needed.',
  'Finance', 'finance', '$',
  ['plumber rate', 'plumber cost', 'plumbing service pricing'],
  [
    '{ name: "hours", label: "Estimated Hours", type: "number", suffix: "hours", min: 0.5, max: 40, step: 0.5, defaultValue: 2 }',
    '{ name: "hourlyRate", label: "Hourly Rate", type: "number", prefix: "$", min: 40, max: 200, defaultValue: 90 }',
    '{ name: "partsCost", label: "Parts and Materials", type: "number", prefix: "$", min: 0, max: 5000, defaultValue: 100 }',
    '{ name: "urgency", label: "Urgency Level", type: "select", options: [{value:"scheduled",label:"Scheduled Visit"},{value:"sameday",label:"Same-Day Service"},{value:"emergency",label:"Emergency Call"}], defaultValue: "scheduled" }',
  ],
  `(inputs) => {
      const hours = inputs.hours as number;
      const rate = inputs.hourlyRate as number;
      const parts = inputs.partsCost as number;
      const urgency = inputs.urgency as string;
      if (!hours || !rate) return null;
      const urgencyMod: Record<string, number> = { scheduled: 1.0, sameday: 1.3, emergency: 1.75 };
      const laborCost = hours * rate * (urgencyMod[urgency] || 1.0);
      const tripCharge = 65;
      const total = laborCost + parts + tripCharge;
      return {
        primary: { label: "Total Estimated Cost", value: "$" + formatNumber(Math.round(total * 100) / 100) },
        details: [
          { label: "Labor Cost", value: "$" + formatNumber(Math.round(laborCost * 100) / 100) },
          { label: "Parts and Materials", value: "$" + formatNumber(Math.round(parts * 100) / 100) },
          { label: "Trip Charge", value: "$" + formatNumber(tripCharge) },
        ],
      };
    }`,
  [{ q: 'How much does a plumber cost per hour?', a: 'Plumbers typically charge $60 to $130 per hour for standard work. Emergency and after-hours calls can cost 50 to 100 percent more than regular rates.' },
   { q: 'When should I call a plumber?', a: 'Call a plumber for persistent leaks, low water pressure, sewage backups, water heater issues, or any plumbing project that requires permits or code compliance.' }],
  'Total = (Hours x Hourly Rate x Urgency Multiplier) + Parts + Trip Charge',
  ['electrician-rate-calculator', 'handyman-pricing-calculator']
);

// #73 Mechanic Labor Rate Calculator
add('mechanic-labor-rate-calculator', 'Mechanic Labor Rate Calculator',
  'Calculate auto repair costs based on labor hours, parts, and shop rates.',
  'Finance', 'finance', '$',
  ['mechanic labor rate', 'auto repair cost', 'car repair estimate'],
  [
    '{ name: "laborHours", label: "Labor Hours", type: "number", suffix: "hours", min: 0.5, max: 40, step: 0.5, defaultValue: 2 }',
    '{ name: "shopRate", label: "Shop Labor Rate", type: "number", prefix: "$", suffix: "/hr", min: 50, max: 250, defaultValue: 120 }',
    '{ name: "partsCost", label: "Parts Cost", type: "number", prefix: "$", min: 0, max: 10000, defaultValue: 250 }',
    '{ name: "shopType", label: "Shop Type", type: "select", options: [{value:"independent",label:"Independent Shop"},{value:"dealer",label:"Dealership"},{value:"chain",label:"Chain Shop"}], defaultValue: "independent" }',
  ],
  `(inputs) => {
      const hours = inputs.laborHours as number;
      const rate = inputs.shopRate as number;
      const parts = inputs.partsCost as number;
      const shopType = inputs.shopType as string;
      if (!hours || !rate) return null;
      const shopMod: Record<string, number> = { independent: 1.0, dealer: 1.3, chain: 0.9 };
      const laborCost = hours * rate * (shopMod[shopType] || 1.0);
      const shopFees = laborCost * 0.08;
      const total = laborCost + parts + shopFees;
      return {
        primary: { label: "Total Repair Estimate", value: "$" + formatNumber(Math.round(total * 100) / 100) },
        details: [
          { label: "Labor Cost", value: "$" + formatNumber(Math.round(laborCost * 100) / 100) },
          { label: "Parts", value: "$" + formatNumber(Math.round(parts * 100) / 100) },
          { label: "Shop Fees and Supplies", value: "$" + formatNumber(Math.round(shopFees * 100) / 100) },
        ],
      };
    }`,
  [{ q: 'What is a typical mechanic labor rate?', a: 'Mechanic labor rates range from $80 to $150 per hour at independent shops and $120 to $200 per hour at dealerships, depending on location and specialization.' },
   { q: 'Is a dealership more expensive than an independent mechanic?', a: 'Dealerships typically charge 20 to 40 percent more than independent shops. However, they may be better for warranty work and specialized brand-specific repairs.' }],
  'Total = (Labor Hours x Shop Rate x Shop Modifier) + Parts + Shop Fees',
  ['electrician-rate-calculator', 'contractor-markup-calculator']
);

// #74 Contractor Markup Calculator
add('contractor-markup-calculator', 'Contractor Markup Calculator',
  'Calculate the proper markup and final price for construction and contracting jobs.',
  'Finance', 'finance', '$',
  ['contractor markup', 'construction markup', 'contractor pricing calculator'],
  [
    '{ name: "directCost", label: "Direct Job Cost", type: "number", prefix: "$", min: 100, max: 1000000, defaultValue: 5000 }',
    '{ name: "markupPercent", label: "Markup Percentage", type: "number", suffix: "%", min: 5, max: 100, defaultValue: 25 }',
    '{ name: "overhead", label: "Overhead Percentage", type: "number", suffix: "%", min: 5, max: 50, defaultValue: 15 }',
  ],
  `(inputs) => {
      const cost = inputs.directCost as number;
      const markup = inputs.markupPercent as number;
      const overhead = inputs.overhead as number;
      if (!cost || cost <= 0) return null;
      const overheadAmount = cost * (overhead / 100);
      const totalCost = cost + overheadAmount;
      const markupAmount = totalCost * (markup / 100);
      const finalPrice = totalCost + markupAmount;
      const profitMargin = (markupAmount / finalPrice) * 100;
      return {
        primary: { label: "Final Client Price", value: "$" + formatNumber(Math.round(finalPrice * 100) / 100) },
        details: [
          { label: "Direct Cost + Overhead", value: "$" + formatNumber(Math.round(totalCost * 100) / 100) },
          { label: "Markup Amount", value: "$" + formatNumber(Math.round(markupAmount * 100) / 100) },
          { label: "Profit Margin", value: formatNumber(Math.round(profitMargin * 10) / 10) + "%" },
        ],
      };
    }`,
  [{ q: 'What is a typical contractor markup?', a: 'Most contractors use a markup of 15 to 35 percent on top of direct costs and overhead. The exact percentage depends on job complexity, market conditions, and specialization.' },
   { q: 'What is the difference between markup and margin?', a: 'Markup is the percentage added to cost to determine the selling price. Margin is the percentage of the selling price that is profit. A 25 percent markup equals about a 20 percent margin.' }],
  'Final Price = (Direct Cost + Overhead) x (1 + Markup Percentage)',
  ['electrician-rate-calculator', 'handyman-pricing-calculator']
);

// #75 Handyman Pricing Calculator
add('handyman-pricing-calculator', 'Handyman Pricing Calculator',
  'Estimate handyman service costs for common home repairs and maintenance tasks.',
  'Finance', 'finance', '$',
  ['handyman pricing', 'handyman rate', 'home repair cost'],
  [
    '{ name: "hours", label: "Estimated Hours", type: "number", suffix: "hours", min: 1, max: 24, defaultValue: 3 }',
    '{ name: "hourlyRate", label: "Hourly Rate", type: "number", prefix: "$", min: 30, max: 150, defaultValue: 65 }',
    '{ name: "materialCost", label: "Material Cost", type: "number", prefix: "$", min: 0, max: 5000, defaultValue: 50 }',
    '{ name: "jobCount", label: "Number of Tasks", type: "number", suffix: "tasks", min: 1, max: 10, defaultValue: 2 }',
  ],
  `(inputs) => {
      const hours = inputs.hours as number;
      const rate = inputs.hourlyRate as number;
      const materials = inputs.materialCost as number;
      const jobs = inputs.jobCount as number;
      if (!hours || !rate) return null;
      const laborCost = hours * rate;
      const minimumCharge = Math.max(laborCost, 150);
      const total = minimumCharge + materials;
      const perTask = total / jobs;
      return {
        primary: { label: "Total Estimated Cost", value: "$" + formatNumber(Math.round(total * 100) / 100) },
        details: [
          { label: "Labor (Minimum $150)", value: "$" + formatNumber(Math.round(minimumCharge * 100) / 100) },
          { label: "Materials", value: "$" + formatNumber(Math.round(materials * 100) / 100) },
          { label: "Average per Task", value: "$" + formatNumber(Math.round(perTask * 100) / 100) },
        ],
      };
    }`,
  [{ q: 'How much does a handyman charge?', a: 'Handyman rates typically range from $50 to $100 per hour, with most charging a minimum of 1 to 2 hours. Some handymen offer flat rates for common tasks.' },
   { q: 'What tasks can a handyman do?', a: 'Handymen handle minor repairs, furniture assembly, painting, drywall patching, fixture installation, caulking, and other small to medium home maintenance tasks.' }],
  'Total = Max(Hours x Rate, Minimum Charge) + Materials',
  ['plumber-rate-calculator', 'contractor-markup-calculator']
);

// #76 Photographer Pricing Calculator
add('photographer-pricing-calculator', 'Photographer Pricing Calculator',
  'Calculate photography session pricing including shooting time, editing, and deliverables.',
  'Finance', 'finance', '$',
  ['photographer pricing', 'photography session cost', 'photo shoot pricing'],
  [
    '{ name: "shootHours", label: "Shooting Hours", type: "number", suffix: "hours", min: 0.5, max: 12, step: 0.5, defaultValue: 2 }',
    '{ name: "editingHours", label: "Editing Hours", type: "number", suffix: "hours", min: 1, max: 40, defaultValue: 4 }',
    '{ name: "hourlyRate", label: "Hourly Rate", type: "number", prefix: "$", min: 50, max: 500, defaultValue: 150 }',
    '{ name: "sessionType", label: "Session Type", type: "select", options: [{value:"portrait",label:"Portrait/Headshot"},{value:"event",label:"Event Coverage"},{value:"wedding",label:"Wedding"}], defaultValue: "portrait" }',
  ],
  `(inputs) => {
      const shoot = inputs.shootHours as number;
      const editing = inputs.editingHours as number;
      const rate = inputs.hourlyRate as number;
      const sType = inputs.sessionType as string;
      if (!shoot || !rate) return null;
      const totalHours = shoot + editing;
      const baseCost = totalHours * rate;
      const equipmentFee: Record<string, number> = { portrait: 50, event: 150, wedding: 300 };
      const travelFee = 50;
      const total = baseCost + (equipmentFee[sType] || 50) + travelFee;
      const perHourEffective = total / shoot;
      return {
        primary: { label: "Total Session Price", value: "$" + formatNumber(Math.round(total)) },
        details: [
          { label: "Shooting + Editing", value: formatNumber(totalHours) + " hours at $" + formatNumber(rate) + "/hr" },
          { label: "Equipment and Travel", value: "$" + formatNumber((equipmentFee[sType] || 50) + travelFee) },
          { label: "Effective Rate per Shoot Hour", value: "$" + formatNumber(Math.round(perHourEffective)) + "/hr" },
        ],
      };
    }`,
  [{ q: 'How much does a photographer charge per hour?', a: 'Professional photographers typically charge $100 to $300 per hour. Wedding photographers often charge $2,000 to $5,000 for full-day coverage including editing.' },
   { q: 'What is included in a photography package?', a: 'Most packages include the shooting session, professional editing, a set number of digital images, and sometimes prints or an online gallery.' }],
  'Total = (Shooting + Editing Hours) x Rate + Equipment Fee + Travel',
  ['dj-pricing-calculator', 'personal-trainer-rate-calculator']
);

// #77 DJ Pricing Calculator
add('dj-pricing-calculator', 'DJ Pricing Calculator',
  'Estimate DJ event pricing based on event type, duration, and equipment needs.',
  'Finance', 'finance', '$',
  ['DJ pricing', 'DJ event cost', 'DJ hire cost'],
  [
    '{ name: "eventHours", label: "Event Duration", type: "number", suffix: "hours", min: 1, max: 12, defaultValue: 4 }',
    '{ name: "eventType", label: "Event Type", type: "select", options: [{value:"party",label:"Private Party"},{value:"corporate",label:"Corporate Event"},{value:"wedding",label:"Wedding"}], defaultValue: "party" }',
    '{ name: "equipment", label: "Equipment Level", type: "select", options: [{value:"basic",label:"Basic (Speakers Only)"},{value:"standard",label:"Standard (Sound + Lights)"},{value:"premium",label:"Premium (Full Production)"}], defaultValue: "standard" }',
  ],
  `(inputs) => {
      const hours = inputs.eventHours as number;
      const eventType = inputs.eventType as string;
      const equip = inputs.equipment as string;
      if (!hours || hours <= 0) return null;
      const baseRates: Record<string, number> = { party: 150, corporate: 200, wedding: 250 };
      const equipMod: Record<string, number> = { basic: 1.0, standard: 1.3, premium: 1.8 };
      const hourlyRate = (baseRates[eventType] || 150) * (equipMod[equip] || 1.3);
      const setupFee = 100;
      const travelFee = 75;
      const total = (hourlyRate * hours) + setupFee + travelFee;
      return {
        primary: { label: "Total DJ Cost", value: "$" + formatNumber(Math.round(total)) },
        details: [
          { label: "Performance Fee", value: "$" + formatNumber(Math.round(hourlyRate * hours)) },
          { label: "Effective Hourly Rate", value: "$" + formatNumber(Math.round(hourlyRate)) + "/hr" },
          { label: "Setup and Travel", value: "$" + formatNumber(setupFee + travelFee) },
        ],
      };
    }`,
  [{ q: 'How much does a DJ cost for a party?', a: 'DJs typically charge $300 to $1,000 for a private party, $500 to $2,000 for corporate events, and $1,000 to $3,000 for weddings, depending on duration and equipment.' },
   { q: 'What should I look for when hiring a DJ?', a: 'Look for experience with your event type, good reviews, proper equipment, a backup plan for equipment failure, and willingness to take song requests.' }],
  'Total = (Base Rate x Equipment Multiplier x Hours) + Setup Fee + Travel Fee',
  ['photographer-pricing-calculator', 'concert-budget-calculator']
);

// #78 Personal Trainer Rate Calculator
add('personal-trainer-rate-calculator', 'Personal Trainer Rate Calculator',
  'Calculate personal training costs based on session frequency, duration, and trainer experience.',
  'Finance', 'finance', '$',
  ['personal trainer rate', 'personal training cost', 'fitness trainer pricing'],
  [
    '{ name: "sessionsPerWeek", label: "Sessions per Week", type: "number", suffix: "sessions", min: 1, max: 7, defaultValue: 3 }',
    '{ name: "sessionLength", label: "Session Length", type: "select", options: [{value:"30",label:"30 Minutes"},{value:"45",label:"45 Minutes"},{value:"60",label:"60 Minutes"}], defaultValue: "60" }',
    '{ name: "trainerLevel", label: "Trainer Experience", type: "select", options: [{value:"junior",label:"Junior (1-3 years)"},{value:"senior",label:"Senior (3-7 years)"},{value:"elite",label:"Elite (7+ years)"}], defaultValue: "senior" }',
    '{ name: "weeks", label: "Number of Weeks", type: "number", suffix: "weeks", min: 1, max: 52, defaultValue: 12 }',
  ],
  `(inputs) => {
      const sessions = inputs.sessionsPerWeek as number;
      const length = inputs.sessionLength as string;
      const level = inputs.trainerLevel as string;
      const weeks = inputs.weeks as number;
      if (!sessions || !weeks) return null;
      const baseRates: Record<string, number> = { junior: 40, senior: 70, elite: 120 };
      const lengthMod: Record<string, number> = { "30": 0.6, "45": 0.8, "60": 1.0 };
      const perSession = (baseRates[level] || 70) * (lengthMod[length] || 1.0);
      const totalSessions = sessions * weeks;
      const totalCost = perSession * totalSessions;
      const monthlyAvg = totalCost / (weeks / 4.33);
      return {
        primary: { label: "Total Training Cost", value: "$" + formatNumber(Math.round(totalCost)) },
        details: [
          { label: "Per Session Rate", value: "$" + formatNumber(Math.round(perSession * 100) / 100) },
          { label: "Total Sessions", value: formatNumber(totalSessions) },
          { label: "Monthly Average", value: "$" + formatNumber(Math.round(monthlyAvg)) },
        ],
      };
    }`,
  [{ q: 'How much does a personal trainer cost?', a: 'Personal trainers charge $40 to $120 per hour session depending on experience and location. Package deals of 10 or more sessions often come with a 10 to 20 percent discount.' },
   { q: 'How many times a week should I train with a personal trainer?', a: 'For most people, 2 to 3 sessions per week provides the best balance of guided training and recovery time. Beginners may start with 1 to 2 sessions.' }],
  'Total = Sessions per Week x Weeks x (Base Rate x Length Modifier)',
  ['tutoring-rate-calculator', 'massage-therapist-rate-calculator']
);

// #79 Tutoring Rate Calculator
add('tutoring-rate-calculator', 'Tutoring Rate Calculator',
  'Calculate tutoring costs based on subject, frequency, and tutor qualifications.',
  'Finance', 'finance', '$',
  ['tutoring rate', 'tutor pricing', 'tutoring cost calculator'],
  [
    '{ name: "sessionsPerWeek", label: "Sessions per Week", type: "number", suffix: "sessions", min: 1, max: 7, defaultValue: 2 }',
    '{ name: "sessionLength", label: "Session Length (minutes)", type: "number", suffix: "min", min: 30, max: 120, defaultValue: 60 }',
    '{ name: "subject", label: "Subject Level", type: "select", options: [{value:"elementary",label:"Elementary/Middle School"},{value:"highschool",label:"High School"},{value:"college",label:"College Level"},{value:"test",label:"Test Prep (SAT/ACT)"}], defaultValue: "highschool" }',
    '{ name: "weeks", label: "Number of Weeks", type: "number", suffix: "weeks", min: 1, max: 52, defaultValue: 16 }',
  ],
  `(inputs) => {
      const sessions = inputs.sessionsPerWeek as number;
      const length = inputs.sessionLength as number;
      const subject = inputs.subject as string;
      const weeks = inputs.weeks as number;
      if (!sessions || !weeks || !length) return null;
      const hourlyRates: Record<string, number> = { elementary: 35, highschool: 50, college: 75, test: 90 };
      const hourlyRate = hourlyRates[subject] || 50;
      const perSession = hourlyRate * (length / 60);
      const totalSessions = sessions * weeks;
      const totalCost = perSession * totalSessions;
      const monthlyAvg = totalCost / (weeks / 4.33);
      return {
        primary: { label: "Total Tutoring Cost", value: "$" + formatNumber(Math.round(totalCost)) },
        details: [
          { label: "Per Session Cost", value: "$" + formatNumber(Math.round(perSession * 100) / 100) },
          { label: "Total Sessions", value: formatNumber(totalSessions) },
          { label: "Monthly Average", value: "$" + formatNumber(Math.round(monthlyAvg)) },
        ],
      };
    }`,
  [{ q: 'How much does tutoring cost per hour?', a: 'Tutoring rates range from $25 to $50 per hour for elementary subjects, $40 to $80 for high school, $60 to $100 for college, and $75 to $150 for specialized test prep.' },
   { q: 'How often should a student have tutoring sessions?', a: 'Most students benefit from 1 to 3 sessions per week. Consistency is more important than frequency, so choose a schedule that can be maintained long-term.' }],
  'Total = Sessions per Week x Weeks x (Hourly Rate x Session Length / 60)',
  ['personal-trainer-rate-calculator', 'photographer-pricing-calculator']
);

// #80 Massage Therapist Rate Calculator
add('massage-therapist-rate-calculator', 'Massage Therapist Rate Calculator',
  'Calculate massage therapy pricing based on session type, duration, and add-on services.',
  'Finance', 'finance', '$',
  ['massage therapist rate', 'massage pricing', 'massage therapy cost'],
  [
    '{ name: "sessionLength", label: "Session Length", type: "select", options: [{value:"30",label:"30 Minutes"},{value:"60",label:"60 Minutes"},{value:"90",label:"90 Minutes"},{value:"120",label:"120 Minutes"}], defaultValue: "60" }',
    '{ name: "massageType", label: "Massage Type", type: "select", options: [{value:"swedish",label:"Swedish (Relaxation)"},{value:"deep",label:"Deep Tissue"},{value:"sports",label:"Sports Massage"},{value:"hot",label:"Hot Stone"}], defaultValue: "swedish" }',
    '{ name: "sessions", label: "Number of Sessions", type: "number", suffix: "sessions", min: 1, max: 52, defaultValue: 4 }',
    '{ name: "tipPercent", label: "Tip Percentage", type: "number", suffix: "%", min: 0, max: 30, defaultValue: 20 }',
  ],
  `(inputs) => {
      const length = inputs.sessionLength as string;
      const mType = inputs.massageType as string;
      const sessions = inputs.sessions as number;
      const tipPct = inputs.tipPercent as number;
      if (!sessions || sessions <= 0) return null;
      const basePrices: Record<string, Record<string, number>> = {
        "30": { swedish: 45, deep: 55, sports: 55, hot: 60 },
        "60": { swedish: 80, deep: 95, sports: 95, hot: 110 },
        "90": { swedish: 120, deep: 140, sports: 140, hot: 160 },
        "120": { swedish: 150, deep: 175, sports: 175, hot: 200 }
      };
      const pricePerSession = (basePrices[length] && basePrices[length][mType]) || 80;
      const tipPerSession = pricePerSession * (tipPct / 100);
      const totalPerSession = pricePerSession + tipPerSession;
      const grandTotal = totalPerSession * sessions;
      return {
        primary: { label: "Total Cost", value: "$" + formatNumber(Math.round(grandTotal * 100) / 100) },
        details: [
          { label: "Per Session (before tip)", value: "$" + formatNumber(pricePerSession) },
          { label: "Tip per Session", value: "$" + formatNumber(Math.round(tipPerSession * 100) / 100) },
          { label: "Per Session (with tip)", value: "$" + formatNumber(Math.round(totalPerSession * 100) / 100) },
        ],
      };
    }`,
  [{ q: 'How much does a massage cost?', a: 'A 60-minute massage typically costs $60 to $120 depending on the type and location. Deep tissue and specialty massages cost more than standard Swedish massage.' },
   { q: 'How much should I tip a massage therapist?', a: 'A tip of 15 to 20 percent is customary for massage therapy. If the therapist is the business owner, tipping is appreciated but not always expected.' }],
  'Total = (Base Price + Tip) x Number of Sessions',
  ['personal-trainer-rate-calculator', 'tutoring-rate-calculator']
);

// #81 Meditation Timer Calculator
add('meditation-timer-calculator', 'Meditation Timer Calculator',
  'Plan your meditation session with recommended duration and technique based on experience level.',
  'Health', 'health', 'H',
  ['meditation timer', 'meditation session planner', 'mindfulness calculator'],
  [
    '{ name: "experience", label: "Experience Level", type: "select", options: [{value:"beginner",label:"Beginner (0-3 months)"},{value:"intermediate",label:"Intermediate (3-12 months)"},{value:"advanced",label:"Advanced (1+ years)"}], defaultValue: "beginner" }',
    '{ name: "sessionsPerDay", label: "Sessions per Day", type: "number", suffix: "sessions", min: 1, max: 5, defaultValue: 1 }',
    '{ name: "goal", label: "Primary Goal", type: "select", options: [{value:"stress",label:"Stress Relief"},{value:"focus",label:"Focus and Concentration"},{value:"sleep",label:"Better Sleep"},{value:"awareness",label:"Self-Awareness"}], defaultValue: "stress" }',
  ],
  `(inputs) => {
      const exp = inputs.experience as string;
      const sessions = inputs.sessionsPerDay as number;
      const goal = inputs.goal as string;
      if (!sessions || sessions <= 0) return null;
      const baseDuration: Record<string, number> = { beginner: 5, intermediate: 15, advanced: 30 };
      const goalMod: Record<string, number> = { stress: 1.0, focus: 1.2, sleep: 0.8, awareness: 1.3 };
      const duration = Math.round((baseDuration[exp] || 5) * (goalMod[goal] || 1.0));
      const dailyMinutes = duration * sessions;
      const weeklyMinutes = dailyMinutes * 7;
      const technique = goal === "stress" ? "Body Scan or Breathing" : goal === "focus" ? "Focused Attention" : goal === "sleep" ? "Yoga Nidra or Body Scan" : "Open Monitoring";
      return {
        primary: { label: "Recommended Session Length", value: formatNumber(duration) + " minutes" },
        details: [
          { label: "Daily Meditation Time", value: formatNumber(dailyMinutes) + " minutes" },
          { label: "Weekly Total", value: formatNumber(weeklyMinutes) + " minutes" },
          { label: "Suggested Technique", value: technique },
        ],
      };
    }`,
  [{ q: 'How long should a beginner meditate?', a: 'Beginners should start with 5 to 10 minutes per session and gradually increase as comfort grows. Consistency matters more than duration.' },
   { q: 'What is the best time of day to meditate?', a: 'Morning meditation helps set a calm tone for the day, while evening sessions can improve sleep. Choose a time you can maintain consistently.' }],
  'Session Duration = Base Duration x Goal Modifier',
  ['eye-strain-break-calculator', 'standing-desk-timer-calculator']
);

// #82 Stretching Routine Calculator
add('stretching-routine-calculator', 'Stretching Routine Calculator',
  'Build a personalized stretching routine with recommended duration and stretch count.',
  'Health', 'health', 'H',
  ['stretching routine', 'stretch timer', 'flexibility calculator'],
  [
    '{ name: "focusArea", label: "Focus Area", type: "select", options: [{value:"full",label:"Full Body"},{value:"upper",label:"Upper Body"},{value:"lower",label:"Lower Body"},{value:"back",label:"Back and Core"}], defaultValue: "full" }',
    '{ name: "intensity", label: "Intensity Level", type: "select", options: [{value:"gentle",label:"Gentle (Recovery)"},{value:"moderate",label:"Moderate (Maintenance)"},{value:"deep",label:"Deep (Flexibility Gains)"}], defaultValue: "moderate" }',
    '{ name: "availableTime", label: "Available Time", type: "number", suffix: "minutes", min: 5, max: 60, defaultValue: 15 }',
  ],
  `(inputs) => {
      const area = inputs.focusArea as string;
      const intensity = inputs.intensity as string;
      const time = inputs.availableTime as number;
      if (!time || time <= 0) return null;
      const holdTime: Record<string, number> = { gentle: 15, moderate: 30, deep: 45 };
      const hold = holdTime[intensity] || 30;
      const transitionTime = 10;
      const timePerStretch = hold + transitionTime;
      const stretchCount = Math.floor((time * 60) / timePerStretch);
      const actualDuration = Math.round((stretchCount * timePerStretch) / 60);
      const areaStretches: Record<string, number> = { full: 12, upper: 8, lower: 8, back: 6 };
      const setsNeeded = Math.ceil(stretchCount / (areaStretches[area] || 10));
      return {
        primary: { label: "Stretches in Your Routine", value: formatNumber(stretchCount) + " stretches" },
        details: [
          { label: "Hold Time per Stretch", value: formatNumber(hold) + " seconds" },
          { label: "Actual Routine Duration", value: formatNumber(actualDuration) + " minutes" },
          { label: "Sets per Stretch", value: formatNumber(setsNeeded) },
        ],
      };
    }`,
  [{ q: 'How long should I hold a stretch?', a: 'Hold static stretches for 15 to 30 seconds for maintenance and 30 to 60 seconds for flexibility improvement. Never bounce or force a stretch.' },
   { q: 'Should I stretch before or after exercise?', a: 'Dynamic stretching is best before exercise to warm up muscles. Static stretching is more effective after exercise when muscles are warm and pliable.' }],
  'Stretch Count = Available Time x 60 / (Hold Time + Transition Time)',
  ['meditation-timer-calculator', 'standing-desk-timer-calculator']
);

// #83 Cold Plunge Calculator
add('cold-plunge-calculator', 'Cold Plunge Calculator',
  'Determine safe cold plunge duration and temperature based on your experience level.',
  'Health', 'health', 'H',
  ['cold plunge', 'cold exposure calculator', 'ice bath timer'],
  [
    '{ name: "experience", label: "Cold Exposure Experience", type: "select", options: [{value:"beginner",label:"Beginner (First Time)"},{value:"intermediate",label:"Intermediate (Monthly)"},{value:"advanced",label:"Advanced (Weekly)"}], defaultValue: "beginner" }',
    '{ name: "waterTemp", label: "Water Temperature", type: "number", suffix: "F", min: 32, max: 70, defaultValue: 50 }',
    '{ name: "bodyWeight", label: "Body Weight", type: "number", suffix: "lbs", min: 80, max: 400, defaultValue: 170 }',
  ],
  `(inputs) => {
      const exp = inputs.experience as string;
      const temp = inputs.waterTemp as number;
      const weight = inputs.bodyWeight as number;
      if (!temp || !weight) return null;
      const baseTime: Record<string, number> = { beginner: 60, intermediate: 180, advanced: 360 };
      const base = baseTime[exp] || 60;
      const tempFactor = temp < 40 ? 0.5 : temp < 50 ? 0.75 : temp < 60 ? 1.0 : 1.5;
      const duration = Math.round(base * tempFactor);
      const maxDuration = Math.min(duration * 1.5, 600);
      const caloriesBurned = Math.round((weight * 0.05) * (duration / 60));
      const safetyRating = temp < 40 ? "High Caution" : temp < 50 ? "Moderate Caution" : "Low Risk";
      return {
        primary: { label: "Recommended Duration", value: formatNumber(Math.round(duration / 60 * 10) / 10) + " minutes" },
        details: [
          { label: "Maximum Duration", value: formatNumber(Math.round(maxDuration / 60 * 10) / 10) + " minutes" },
          { label: "Estimated Extra Calories", value: formatNumber(caloriesBurned) + " kcal" },
          { label: "Safety Level", value: safetyRating },
        ],
      };
    }`,
  [{ q: 'How long should I stay in a cold plunge?', a: 'Beginners should start with 30 to 60 seconds and gradually increase. Experienced practitioners typically stay 2 to 5 minutes. Never exceed 10 minutes in very cold water.' },
   { q: 'What temperature should a cold plunge be?', a: 'Most cold plunge benefits occur between 50 and 59 degrees Fahrenheit. Advanced practitioners may go as low as 38 to 45 degrees, but beginners should start warmer.' }],
  'Duration = Base Time x Temperature Factor',
  ['sauna-session-calculator', 'meditation-timer-calculator']
);

// #84 Sauna Session Calculator
add('sauna-session-calculator', 'Sauna Session Calculator',
  'Get recommended sauna session duration and temperature based on sauna type and experience.',
  'Health', 'health', 'H',
  ['sauna session', 'sauna time calculator', 'sauna temperature guide'],
  [
    '{ name: "saunaType", label: "Sauna Type", type: "select", options: [{value:"traditional",label:"Traditional (Dry)"},{value:"steam",label:"Steam Room"},{value:"infrared",label:"Infrared"}], defaultValue: "traditional" }',
    '{ name: "experience", label: "Experience Level", type: "select", options: [{value:"beginner",label:"Beginner"},{value:"regular",label:"Regular User"},{value:"experienced",label:"Experienced"}], defaultValue: "regular" }',
    '{ name: "rounds", label: "Number of Rounds", type: "number", suffix: "rounds", min: 1, max: 5, defaultValue: 3 }',
  ],
  `(inputs) => {
      const sType = inputs.saunaType as string;
      const exp = inputs.experience as string;
      const rounds = inputs.rounds as number;
      if (!rounds || rounds <= 0) return null;
      const tempRanges: Record<string, string> = { traditional: "150-185 F", steam: "110-120 F", infrared: "120-150 F" };
      const baseDuration: Record<string, number> = { beginner: 8, regular: 15, experienced: 20 };
      const typeMod: Record<string, number> = { traditional: 1.0, steam: 0.8, infrared: 1.5 };
      const sessionMin = Math.round((baseDuration[exp] || 15) * (typeMod[sType] || 1.0));
      const coolDown = 10;
      const totalTime = (sessionMin + coolDown) * rounds;
      const hydrationOz = rounds * sessionMin * 0.5;
      return {
        primary: { label: "Session Duration per Round", value: formatNumber(sessionMin) + " minutes" },
        details: [
          { label: "Recommended Temperature", value: tempRanges[sType] || "150-185 F" },
          { label: "Total Time (with cool-downs)", value: formatNumber(totalTime) + " minutes" },
          { label: "Recommended Water Intake", value: formatNumber(Math.round(hydrationOz)) + " oz" },
        ],
      };
    }`,
  [{ q: 'How long should I stay in a sauna?', a: 'Beginners should start with 5 to 10 minutes per session. Regular users can stay 15 to 20 minutes. Always leave if you feel dizzy, nauseous, or uncomfortable.' },
   { q: 'How many sauna rounds are recommended?', a: 'Two to three rounds with cool-down breaks between each is the traditional Finnish approach. Always hydrate well between rounds.' }],
  'Session Time = Base Duration x Sauna Type Modifier; Total = (Session + Cool Down) x Rounds',
  ['cold-plunge-calculator', 'meditation-timer-calculator']
);

// #85 Supplement Cost Calculator
add('supplement-cost-calculator', 'Supplement Cost Calculator',
  'Calculate your daily and monthly supplement spending based on your supplement stack.',
  'Health', 'health', 'H',
  ['supplement cost', 'vitamin cost calculator', 'supplement budget'],
  [
    '{ name: "supplementCount", label: "Number of Supplements", type: "number", suffix: "supplements", min: 1, max: 20, defaultValue: 4 }',
    '{ name: "avgCostPerBottle", label: "Average Cost per Bottle", type: "number", prefix: "$", min: 5, max: 200, defaultValue: 25 }',
    '{ name: "avgServingsPerBottle", label: "Average Servings per Bottle", type: "number", suffix: "servings", min: 10, max: 300, defaultValue: 60 }',
    '{ name: "dosesPerDay", label: "Total Doses per Day", type: "number", suffix: "doses", min: 1, max: 30, defaultValue: 6 }',
  ],
  `(inputs) => {
      const count = inputs.supplementCount as number;
      const costPerBottle = inputs.avgCostPerBottle as number;
      const servings = inputs.avgServingsPerBottle as number;
      const doses = inputs.dosesPerDay as number;
      if (!count || !servings || servings <= 0) return null;
      const costPerServing = costPerBottle / servings;
      const dailyCost = costPerServing * doses;
      const monthlyCost = dailyCost * 30;
      const yearlyCost = dailyCost * 365;
      const bottlesPerYear = Math.ceil((doses * 365) / servings);
      return {
        primary: { label: "Monthly Supplement Cost", value: "$" + formatNumber(Math.round(monthlyCost * 100) / 100) },
        details: [
          { label: "Daily Cost", value: "$" + formatNumber(Math.round(dailyCost * 100) / 100) },
          { label: "Annual Cost", value: "$" + formatNumber(Math.round(yearlyCost * 100) / 100) },
          { label: "Bottles per Year", value: formatNumber(bottlesPerYear) },
        ],
      };
    }`,
  [{ q: 'How much do supplements cost per month?', a: 'The average person taking 3 to 5 supplements spends $30 to $100 per month. Premium brands and specialized supplements can push costs higher.' },
   { q: 'Are expensive supplements worth the extra cost?', a: 'Not always. Look for third-party testing certifications rather than price as an indicator of quality. Many affordable brands offer excellent products.' }],
  'Monthly Cost = (Cost per Bottle / Servings per Bottle) x Daily Doses x 30',
  ['caffeine-half-life-calculator', 'steps-to-distance-calculator']
);

// #86 Eye Strain Break Calculator
add('eye-strain-break-calculator', 'Eye Strain Break Calculator',
  'Calculate your recommended screen breaks using the 20-20-20 rule and total daily strain.',
  'Health', 'health', 'H',
  ['eye strain breaks', '20-20-20 rule', 'screen break calculator'],
  [
    '{ name: "screenHours", label: "Daily Screen Time", type: "number", suffix: "hours", min: 1, max: 16, defaultValue: 8 }',
    '{ name: "breakFrequency", label: "Break Frequency", type: "select", options: [{value:"20",label:"Every 20 Minutes (Recommended)"},{value:"30",label:"Every 30 Minutes"},{value:"60",label:"Every 60 Minutes"}], defaultValue: "20" }',
    '{ name: "screenDistance", label: "Screen Distance", type: "select", options: [{value:"close",label:"Close (Under 20 inches)"},{value:"normal",label:"Normal (20-26 inches)"},{value:"far",label:"Far (Over 26 inches)"}], defaultValue: "normal" }',
  ],
  `(inputs) => {
      const hours = inputs.screenHours as number;
      const freq = inputs.breakFrequency as string;
      const distance = inputs.screenDistance as string;
      if (!hours || hours <= 0) return null;
      const freqMin = parseInt(freq) || 20;
      const totalMinutes = hours * 60;
      const breaksNeeded = Math.floor(totalMinutes / freqMin);
      const breakDuration = 20;
      const totalBreakTime = breaksNeeded * breakDuration;
      const strainRisk = distance === "close" ? "High" : distance === "normal" ? "Moderate" : "Low";
      const recommendation = freqMin <= 20 ? "Good frequency" : freqMin <= 30 ? "Acceptable but consider shorter intervals" : "Too infrequent for optimal eye health";
      return {
        primary: { label: "Breaks Needed Today", value: formatNumber(breaksNeeded) + " breaks" },
        details: [
          { label: "Break Duration", value: formatNumber(breakDuration) + " seconds each" },
          { label: "Eye Strain Risk", value: strainRisk },
          { label: "Assessment", value: recommendation },
        ],
      };
    }`,
  [{ q: 'What is the 20-20-20 rule?', a: 'Every 20 minutes, look at something 20 feet away for at least 20 seconds. This reduces eye strain by allowing your eye muscles to relax from close focus work.' },
   { q: 'How far should a computer screen be from your eyes?', a: 'Your monitor should be 20 to 26 inches from your eyes, with the top of the screen at or slightly below eye level to reduce neck and eye strain.' }],
  'Breaks Needed = Screen Time (minutes) / Break Interval (minutes)',
  ['standing-desk-timer-calculator', 'meditation-timer-calculator']
);

// #87 Steps to Distance Calculator
add('steps-to-distance-calculator', 'Steps to Distance Calculator',
  'Convert your step count to distance in miles or kilometers based on your stride length.',
  'Health', 'health', 'H',
  ['steps to distance', 'step counter distance', 'walking distance calculator'],
  [
    '{ name: "steps", label: "Number of Steps", type: "number", suffix: "steps", min: 100, max: 200000, defaultValue: 10000 }',
    '{ name: "height", label: "Your Height", type: "number", suffix: "inches", min: 48, max: 84, defaultValue: 68 }',
    '{ name: "pace", label: "Walking Pace", type: "select", options: [{value:"slow",label:"Slow (Casual Walk)"},{value:"moderate",label:"Moderate (Brisk Walk)"},{value:"fast",label:"Fast (Power Walk/Jog)"}], defaultValue: "moderate" }',
  ],
  `(inputs) => {
      const steps = inputs.steps as number;
      const height = inputs.height as number;
      const pace = inputs.pace as string;
      if (!steps || !height) return null;
      const strideMod: Record<string, number> = { slow: 0.37, moderate: 0.41, fast: 0.45 };
      const strideLength = height * (strideMod[pace] || 0.41);
      const distanceInches = steps * strideLength;
      const miles = distanceInches / 63360;
      const km = miles * 1.60934;
      const caloriesPer1000 = pace === "slow" ? 30 : pace === "moderate" ? 40 : 55;
      const calories = (steps / 1000) * caloriesPer1000;
      return {
        primary: { label: "Distance Covered", value: formatNumber(Math.round(miles * 100) / 100) + " miles" },
        details: [
          { label: "Distance in Kilometers", value: formatNumber(Math.round(km * 100) / 100) + " km" },
          { label: "Stride Length", value: formatNumber(Math.round(strideLength * 10) / 10) + " inches" },
          { label: "Estimated Calories Burned", value: formatNumber(Math.round(calories)) + " kcal" },
        ],
      };
    }`,
  [{ q: 'How many steps are in a mile?', a: 'The average person takes about 2,000 to 2,500 steps per mile, depending on height and stride length. Taller people take fewer steps per mile.' },
   { q: 'Is 10,000 steps a day a good goal?', a: 'Ten thousand steps per day is a popular target that equals roughly 4 to 5 miles. Studies show significant health benefits starting at 7,000 to 8,000 steps daily.' }],
  'Distance = Steps x Stride Length (Height x Pace Modifier) / 63360',
  ['caffeine-half-life-calculator', 'supplement-cost-calculator']
);

// #88 Standing Desk Timer Calculator
add('standing-desk-timer-calculator', 'Standing Desk Timer Calculator',
  'Calculate optimal sit and stand intervals for your standing desk throughout the workday.',
  'Health', 'health', 'H',
  ['standing desk timer', 'sit stand intervals', 'standing desk schedule'],
  [
    '{ name: "workHours", label: "Work Hours per Day", type: "number", suffix: "hours", min: 4, max: 12, defaultValue: 8 }',
    '{ name: "experience", label: "Standing Desk Experience", type: "select", options: [{value:"new",label:"New User (Under 1 Month)"},{value:"moderate",label:"Some Experience (1-6 Months)"},{value:"experienced",label:"Experienced (6+ Months)"}], defaultValue: "moderate" }',
    '{ name: "fitnessLevel", label: "Fitness Level", type: "select", options: [{value:"low",label:"Low (Mostly Sedentary)"},{value:"moderate",label:"Moderate (Some Exercise)"},{value:"high",label:"High (Regular Exercise)"}], defaultValue: "moderate" }',
  ],
  `(inputs) => {
      const workHours = inputs.workHours as number;
      const exp = inputs.experience as string;
      const fitness = inputs.fitnessLevel as string;
      if (!workHours || workHours <= 0) return null;
      const standRatio: Record<string, number> = { new: 0.25, moderate: 0.40, experienced: 0.50 };
      const fitMod: Record<string, number> = { low: 0.8, moderate: 1.0, high: 1.2 };
      const ratio = Math.min((standRatio[exp] || 0.40) * (fitMod[fitness] || 1.0), 0.60);
      const standMinutes = Math.round(workHours * 60 * ratio);
      const sitMinutes = (workHours * 60) - standMinutes;
      const standInterval = exp === "new" ? 15 : exp === "moderate" ? 25 : 30;
      const sitInterval = exp === "new" ? 45 : exp === "moderate" ? 35 : 30;
      const transitions = Math.round((workHours * 60) / (standInterval + sitInterval));
      return {
        primary: { label: "Daily Standing Time", value: formatNumber(standMinutes) + " minutes" },
        details: [
          { label: "Daily Sitting Time", value: formatNumber(sitMinutes) + " minutes" },
          { label: "Recommended Cycle", value: formatNumber(standInterval) + " min stand / " + formatNumber(sitInterval) + " min sit" },
          { label: "Daily Transitions", value: formatNumber(transitions) },
        ],
      };
    }`,
  [{ q: 'How long should I stand at a standing desk?', a: 'Start with 15 to 30 minutes of standing per hour and gradually increase. Most experts recommend a 1:1 to 1:2 standing to sitting ratio throughout the day.' },
   { q: 'Is a standing desk better than sitting all day?', a: 'Alternating between sitting and standing reduces back pain, improves posture, and increases energy. Standing all day is not recommended either, so regular transitions are key.' }],
  'Standing Time = Work Hours x Stand Ratio x Fitness Modifier',
  ['eye-strain-break-calculator', 'stretching-routine-calculator']
);

// #89 Caffeine Half Life Calculator
add('caffeine-half-life-calculator', 'Caffeine Half Life Calculator',
  'Track how caffeine is metabolized in your body and when it will be mostly eliminated.',
  'Health', 'health', 'H',
  ['caffeine half life', 'caffeine metabolism', 'coffee wear off calculator'],
  [
    '{ name: "caffeineAmount", label: "Caffeine Consumed", type: "number", suffix: "mg", min: 10, max: 1000, defaultValue: 200 }',
    '{ name: "consumeHour", label: "Time of Consumption (24h)", type: "number", suffix: "hour", min: 0, max: 23, defaultValue: 8 }',
    '{ name: "sensitivity", label: "Caffeine Sensitivity", type: "select", options: [{value:"fast",label:"Fast Metabolizer"},{value:"normal",label:"Normal"},{value:"slow",label:"Slow Metabolizer"}], defaultValue: "normal" }',
  ],
  `(inputs) => {
      const caffeine = inputs.caffeineAmount as number;
      const hour = inputs.consumeHour as number;
      const sensitivity = inputs.sensitivity as string;
      if (!caffeine || caffeine <= 0) return null;
      const halfLife: Record<string, number> = { fast: 3, normal: 5, slow: 7 };
      const hl = halfLife[sensitivity] || 5;
      const hoursToSleep = 22 - hour;
      const halfLives = hoursToSleep / hl;
      const atBedtime = caffeine * Math.pow(0.5, halfLives);
      const hoursTo25mg = Math.log(25 / caffeine) / Math.log(0.5) * hl;
      const clearHour = (hour + hoursTo25mg) % 24;
      const clearTime = Math.floor(clearHour) + ":" + (Math.round((clearHour % 1) * 60) < 10 ? "0" : "") + Math.round((clearHour % 1) * 60);
      return {
        primary: { label: "Caffeine at Bedtime (10 PM)", value: formatNumber(Math.round(atBedtime)) + " mg" },
        details: [
          { label: "Half Life", value: formatNumber(hl) + " hours" },
          { label: "Time to Reach 25 mg", value: formatNumber(Math.round(hoursTo25mg * 10) / 10) + " hours" },
          { label: "Mostly Clear By", value: clearTime },
        ],
      };
    }`,
  [{ q: 'How long does caffeine stay in your system?', a: 'Caffeine has a half life of 3 to 7 hours depending on individual metabolism. It takes 5 to 6 half lives (about 15 to 36 hours) to be nearly fully eliminated.' },
   { q: 'What time should I stop drinking coffee?', a: 'Most sleep experts recommend stopping caffeine intake 6 to 8 hours before bedtime. If you go to bed at 10 PM, have your last coffee by 2 PM at the latest.' }],
  'Remaining Caffeine = Initial Amount x (0.5 ^ (Hours Elapsed / Half Life))',
  ['supplement-cost-calculator', 'meditation-timer-calculator']
);

// #90 Skin Type Calculator
add('skin-type-calculator', 'Skin Type Calculator',
  'Determine your skin type based on oiliness, sensitivity, and hydration characteristics.',
  'Health', 'health', 'H',
  ['skin type test', 'skin type assessment', 'skincare type calculator'],
  [
    '{ name: "oiliness", label: "Oiliness Level (After 2 Hours)", type: "select", options: [{value:"none",label:"No Shine at All"},{value:"tzone",label:"Shine on T-Zone Only"},{value:"moderate",label:"Moderate Shine Overall"},{value:"heavy",label:"Heavy Shine Everywhere"}], defaultValue: "tzone" }',
    '{ name: "poreSize", label: "Pore Size", type: "select", options: [{value:"small",label:"Small/Barely Visible"},{value:"medium",label:"Medium (Nose/Cheeks)"},{value:"large",label:"Large and Visible"}], defaultValue: "medium" }',
    '{ name: "sensitivity", label: "Skin Sensitivity", type: "select", options: [{value:"none",label:"Rarely Irritated"},{value:"mild",label:"Occasionally Sensitive"},{value:"high",label:"Frequently Reactive"}], defaultValue: "mild" }',
    '{ name: "hydration", label: "Skin Hydration", type: "select", options: [{value:"tight",label:"Often Feels Tight/Dry"},{value:"normal",label:"Comfortable Most of the Day"},{value:"dewy",label:"Always Looks Dewy/Moist"}], defaultValue: "normal" }',
  ],
  `(inputs) => {
      const oil = inputs.oiliness as string;
      const pore = inputs.poreSize as string;
      const sens = inputs.sensitivity as string;
      const hydration = inputs.hydration as string;
      let oilScore = oil === "none" ? 0 : oil === "tzone" ? 1 : oil === "moderate" ? 2 : 3;
      let dryScore = hydration === "tight" ? 2 : hydration === "normal" ? 0 : -1;
      let skinType = "Normal";
      if (oilScore >= 2 && dryScore <= 0) skinType = "Oily";
      else if (oilScore <= 1 && dryScore >= 2) skinType = "Dry";
      else if (oilScore === 1 && dryScore >= 1) skinType = "Combination";
      else if (oilScore <= 1 && dryScore <= 0) skinType = "Normal";
      const sensLabel = sens === "high" ? " and Sensitive" : "";
      const routineSteps = skinType === "Oily" ? "Gel Cleanser, Toner, Lightweight Moisturizer, SPF" : skinType === "Dry" ? "Cream Cleanser, Hydrating Serum, Rich Moisturizer, SPF" : skinType === "Combination" ? "Gentle Cleanser, Balancing Toner, Light Moisturizer, SPF" : "Gentle Cleanser, Moisturizer, SPF";
      return {
        primary: { label: "Your Skin Type", value: skinType + sensLabel },
        details: [
          { label: "Oiliness Level", value: oil === "none" ? "Low" : oil === "tzone" ? "T-Zone" : oil === "moderate" ? "Moderate" : "High" },
          { label: "Pore Assessment", value: pore === "small" ? "Fine Pores" : pore === "medium" ? "Medium Pores" : "Enlarged Pores" },
          { label: "Recommended Routine", value: routineSteps },
        ],
      };
    }`,
  [{ q: 'How do I determine my skin type?', a: 'Wash your face with a gentle cleanser and wait 2 hours without applying any products. Observe the oiliness, tightness, and shine to determine if your skin is oily, dry, combination, or normal.' },
   { q: 'Can your skin type change over time?', a: 'Yes, skin type can change due to aging, hormonal shifts, climate, medications, and skincare routines. It is good practice to reassess your skin type seasonally.' }],
  'Skin Type = Assessment based on Oiliness + Hydration + Pore Size + Sensitivity scores',
  ['caffeine-half-life-calculator', 'supplement-cost-calculator']
);

// #91 Moving Day Tip Calculator
add('moving-day-tip-calculator', 'Moving Day Tip Calculator',
  'Calculate how much to tip your movers based on job size, hours, and service quality.',
  'Everyday', 'everyday', '~',
  ['moving day tip', 'tip movers', 'mover tip calculator'],
  [
    '{ name: "movers", label: "Number of Movers", type: "number", suffix: "movers", min: 1, max: 10, defaultValue: 3 }',
    '{ name: "hours", label: "Move Duration", type: "number", suffix: "hours", min: 1, max: 16, defaultValue: 6 }',
    '{ name: "moveSize", label: "Move Size", type: "select", options: [{value:"small",label:"Small (Studio/1BR)"},{value:"medium",label:"Medium (2-3BR)"},{value:"large",label:"Large (4+BR/Long Distance)"}], defaultValue: "medium" }',
    '{ name: "serviceQuality", label: "Service Quality", type: "select", options: [{value:"average",label:"Average"},{value:"good",label:"Good"},{value:"excellent",label:"Excellent"}], defaultValue: "good" }',
  ],
  `(inputs) => {
      const movers = inputs.movers as number;
      const hours = inputs.hours as number;
      const size = inputs.moveSize as string;
      const quality = inputs.serviceQuality as string;
      if (!movers || !hours) return null;
      const basePerHour: Record<string, number> = { small: 5, medium: 6, large: 8 };
      const qualityMod: Record<string, number> = { average: 0.8, good: 1.0, excellent: 1.3 };
      const tipPerMover = (basePerHour[size] || 6) * hours * (qualityMod[quality] || 1.0);
      const totalTip = tipPerMover * movers;
      const tipPerMoverRounded = Math.round(tipPerMover / 5) * 5;
      return {
        primary: { label: "Total Tip Amount", value: "$" + formatNumber(Math.round(totalTip / 5) * 5) },
        details: [
          { label: "Tip per Mover", value: "$" + formatNumber(tipPerMoverRounded) },
          { label: "Number of Movers", value: formatNumber(movers) },
          { label: "Service Rating", value: quality.charAt(0).toUpperCase() + quality.slice(1) },
        ],
      };
    }`,
  [{ q: 'How much should I tip movers?', a: 'A standard tip is $4 to $8 per mover per hour for local moves. For long-distance or exceptionally difficult moves, consider tipping $6 to $10 per mover per hour.' },
   { q: 'Should I tip movers in cash?', a: 'Cash is preferred for tipping movers as it can be distributed immediately. Hand each mover their tip individually at the end of the job.' }],
  'Tip per Mover = Base Rate per Hour x Hours x Quality Modifier',
  ['tipping-etiquette-calculator', 'potluck-planner-calculator']
);

// #92 Tipping Etiquette Calculator
add('tipping-etiquette-calculator', 'Tipping Etiquette Calculator',
  'Get recommended tip amounts for various service types based on standard etiquette.',
  'Everyday', 'everyday', '~',
  ['tipping etiquette', 'tip guide', 'how much to tip calculator'],
  [
    '{ name: "billAmount", label: "Bill or Service Amount", type: "number", prefix: "$", min: 1, max: 10000, defaultValue: 50 }',
    '{ name: "serviceType", label: "Service Type", type: "select", options: [{value:"restaurant",label:"Restaurant Server"},{value:"delivery",label:"Food Delivery"},{value:"salon",label:"Hair Salon/Barber"},{value:"taxi",label:"Taxi/Rideshare"},{value:"hotel",label:"Hotel Housekeeping"}], defaultValue: "restaurant" }',
    '{ name: "serviceQuality", label: "Service Quality", type: "select", options: [{value:"poor",label:"Below Average"},{value:"average",label:"Average"},{value:"good",label:"Good"},{value:"excellent",label:"Excellent"}], defaultValue: "good" }',
  ],
  `(inputs) => {
      const bill = inputs.billAmount as number;
      const sType = inputs.serviceType as string;
      const quality = inputs.serviceQuality as string;
      if (!bill || bill <= 0) return null;
      const baseTip: Record<string, number> = { restaurant: 0.18, delivery: 0.15, salon: 0.20, taxi: 0.15, hotel: 0.10 };
      const qualityMod: Record<string, number> = { poor: 0.7, average: 0.85, good: 1.0, excellent: 1.2 };
      const tipPercent = (baseTip[sType] || 0.18) * (qualityMod[quality] || 1.0);
      const tipAmount = bill * tipPercent;
      const totalWithTip = bill + tipAmount;
      const tipLabels: Record<string, string> = { restaurant: "15-20%", delivery: "15-20% or $3 minimum", salon: "18-25%", taxi: "15-20%", hotel: "$2-5 per night" };
      return {
        primary: { label: "Suggested Tip", value: "$" + formatNumber(Math.round(tipAmount * 100) / 100) },
        details: [
          { label: "Tip Percentage", value: formatNumber(Math.round(tipPercent * 1000) / 10) + "%" },
          { label: "Total with Tip", value: "$" + formatNumber(Math.round(totalWithTip * 100) / 100) },
          { label: "Standard Range", value: tipLabels[sType] || "15-20%" },
        ],
      };
    }`,
  [{ q: 'How much should I tip at a restaurant?', a: 'The standard restaurant tip in the United States is 15 to 20 percent of the pre-tax bill. For excellent service, 20 to 25 percent is appropriate.' },
   { q: 'Should I tip on the pre-tax or post-tax amount?', a: 'Traditionally, tips are calculated on the pre-tax subtotal. However, tipping on the total including tax has become increasingly common and is perfectly acceptable.' }],
  'Tip = Bill Amount x Base Tip Rate x Quality Modifier',
  ['moving-day-tip-calculator', 'potluck-planner-calculator']
);

// #93 Potluck Planner Calculator
add('potluck-planner-calculator', 'Potluck Planner Calculator',
  'Calculate food quantities and categories needed for a potluck dinner based on guest count.',
  'Everyday', 'everyday', '~',
  ['potluck planner', 'potluck food calculator', 'potluck quantity guide'],
  [
    '{ name: "guests", label: "Number of Guests", type: "number", suffix: "guests", min: 4, max: 100, defaultValue: 20 }',
    '{ name: "mealType", label: "Meal Type", type: "select", options: [{value:"appetizers",label:"Appetizers Only"},{value:"lunch",label:"Casual Lunch"},{value:"dinner",label:"Full Dinner"}], defaultValue: "dinner" }',
    '{ name: "duration", label: "Event Duration", type: "number", suffix: "hours", min: 1, max: 8, defaultValue: 3 }',
  ],
  `(inputs) => {
      const guests = inputs.guests as number;
      const meal = inputs.mealType as string;
      const duration = inputs.duration as number;
      if (!guests || guests <= 0) return null;
      const foodPerPerson: Record<string, number> = { appetizers: 0.5, lunch: 0.75, dinner: 1.0 };
      const totalLbs = guests * (foodPerPerson[meal] || 1.0);
      const mainDishes = Math.ceil(guests / 8);
      const sideDishes = Math.ceil(guests / 6);
      const desserts = Math.ceil(guests / 10);
      const drinks = Math.ceil(guests * duration * 0.5);
      return {
        primary: { label: "Total Food Needed", value: formatNumber(Math.round(totalLbs)) + " lbs" },
        details: [
          { label: "Main Dishes to Assign", value: formatNumber(mainDishes) + " dishes (serves 8 each)" },
          { label: "Side Dishes to Assign", value: formatNumber(sideDishes) + " dishes (serves 6 each)" },
          { label: "Drinks Needed", value: formatNumber(drinks) + " servings" },
        ],
      };
    }`,
  [{ q: 'How much food do I need for a potluck?', a: 'Plan for about 1 pound of food per person for a dinner potluck. For appetizer-only events, plan for 0.5 pounds per person over 2 hours.' },
   { q: 'How do I organize potluck assignments?', a: 'Assign categories to guests: have one main dish per 8 guests, one side per 6 guests, and one dessert per 10 guests. The host should provide drinks and basic supplies.' }],
  'Total Food = Guests x Food per Person; Dishes = Guests / Servings per Dish',
  ['game-night-calculator', 'tipping-etiquette-calculator']
);

// #94 Garage Sale Pricing Calculator
add('garage-sale-pricing-calculator', 'Garage Sale Pricing Calculator',
  'Get recommended pricing for used items at your garage sale based on condition and category.',
  'Finance', 'finance', '$',
  ['garage sale pricing', 'yard sale prices', 'used item pricing guide'],
  [
    '{ name: "originalPrice", label: "Original Purchase Price", type: "number", prefix: "$", min: 1, max: 10000, defaultValue: 50 }',
    '{ name: "condition", label: "Item Condition", type: "select", options: [{value:"likenew",label:"Like New"},{value:"good",label:"Good (Minor Wear)"},{value:"fair",label:"Fair (Visible Wear)"},{value:"worn",label:"Worn (Heavy Use)"}], defaultValue: "good" }',
    '{ name: "category", label: "Item Category", type: "select", options: [{value:"electronics",label:"Electronics"},{value:"clothing",label:"Clothing"},{value:"furniture",label:"Furniture"},{value:"toys",label:"Toys/Games"},{value:"books",label:"Books/Media"}], defaultValue: "electronics" }',
    '{ name: "age", label: "Item Age", type: "number", suffix: "years", min: 0, max: 30, defaultValue: 3 }',
  ],
  `(inputs) => {
      const original = inputs.originalPrice as number;
      const condition = inputs.condition as string;
      const category = inputs.category as string;
      const age = inputs.age as number;
      if (!original || original <= 0) return null;
      const condMod: Record<string, number> = { likenew: 0.50, good: 0.33, fair: 0.20, worn: 0.10 };
      const catMod: Record<string, number> = { electronics: 0.8, clothing: 0.6, furniture: 1.0, toys: 0.7, books: 0.5 };
      const ageMod = Math.max(0.3, 1.0 - (age * 0.08));
      const suggestedPrice = original * (condMod[condition] || 0.33) * (catMod[category] || 0.7) * ageMod;
      const minPrice = suggestedPrice * 0.7;
      const maxPrice = suggestedPrice * 1.3;
      return {
        primary: { label: "Suggested Price", value: "$" + formatNumber(Math.round(suggestedPrice * 100) / 100) },
        details: [
          { label: "Price Range", value: "$" + formatNumber(Math.round(minPrice * 100) / 100) + " - $" + formatNumber(Math.round(maxPrice * 100) / 100) },
          { label: "Percentage of Original", value: formatNumber(Math.round((suggestedPrice / original) * 100)) + "%" },
          { label: "Negotiation Floor", value: "$" + formatNumber(Math.round(minPrice * 100) / 100) },
        ],
      };
    }`,
  [{ q: 'How do I price items for a garage sale?', a: 'A general rule is to price items at 10 to 33 percent of the original price, depending on condition. Like-new items can go for up to 50 percent of original price.' },
   { q: 'What sells best at garage sales?', a: 'Furniture, tools, electronics, baby items, and kitchen appliances tend to sell quickly at garage sales. Price these competitively and display them prominently.' }],
  'Price = Original Price x Condition Modifier x Category Modifier x Age Modifier',
  ['estate-sale-calculator', 'tipping-etiquette-calculator']
);

// #95 Estate Sale Calculator
add('estate-sale-calculator', 'Estate Sale Calculator',
  'Estimate total revenue and net proceeds from an estate sale based on inventory value.',
  'Finance', 'finance', '$',
  ['estate sale calculator', 'estate sale revenue', 'estate liquidation estimate'],
  [
    '{ name: "estimatedValue", label: "Estimated Total Inventory Value", type: "number", prefix: "$", min: 500, max: 500000, defaultValue: 15000 }',
    '{ name: "saleType", label: "Sale Type", type: "select", options: [{value:"diy",label:"DIY (Self-Run)"},{value:"professional",label:"Professional Estate Company"},{value:"auction",label:"Auction House"}], defaultValue: "professional" }',
    '{ name: "itemCount", label: "Approximate Number of Items", type: "number", suffix: "items", min: 20, max: 5000, defaultValue: 200 }',
  ],
  `(inputs) => {
      const value = inputs.estimatedValue as number;
      const saleType = inputs.saleType as string;
      const items = inputs.itemCount as number;
      if (!value || value <= 0) return null;
      const sellRates: Record<string, number> = { diy: 0.60, professional: 0.75, auction: 0.70 };
      const commissions: Record<string, number> = { diy: 0, professional: 0.35, auction: 0.25 };
      const grossRevenue = value * (sellRates[saleType] || 0.75);
      const commission = grossRevenue * (commissions[saleType] || 0.35);
      const netProceeds = grossRevenue - commission;
      const avgPerItem = grossRevenue / items;
      return {
        primary: { label: "Estimated Net Proceeds", value: "$" + formatNumber(Math.round(netProceeds)) },
        details: [
          { label: "Gross Revenue", value: "$" + formatNumber(Math.round(grossRevenue)) },
          { label: "Commission/Fees", value: "$" + formatNumber(Math.round(commission)) },
          { label: "Average per Item", value: "$" + formatNumber(Math.round(avgPerItem * 100) / 100) },
        ],
      };
    }`,
  [{ q: 'How much does an estate sale company charge?', a: 'Estate sale companies typically charge 25 to 40 percent of gross sales as commission. This covers pricing, advertising, setup, staffing, and cleanup.' },
   { q: 'How much can you expect to make at an estate sale?', a: 'Most estate sales generate 50 to 75 percent of the estimated retail value of items. A well-run professional sale typically yields more than a DIY sale.' }],
  'Net Proceeds = (Inventory Value x Sell Rate) - (Gross Revenue x Commission Rate)',
  ['garage-sale-pricing-calculator', 'power-outage-cost-calculator']
);

// #96 Time Zone Meeting Calculator
add('time-zone-meeting-calculator', 'Time Zone Meeting Calculator',
  'Find the best overlapping meeting time across different time zones for your team.',
  'Everyday', 'everyday', '~',
  ['time zone meeting', 'meeting time zones', 'best meeting time calculator'],
  [
    '{ name: "yourOffset", label: "Your UTC Offset", type: "number", suffix: "hours", min: -12, max: 14, defaultValue: -5 }',
    '{ name: "theirOffset", label: "Other Party UTC Offset", type: "number", suffix: "hours", min: -12, max: 14, defaultValue: 1 }',
    '{ name: "workStart", label: "Earliest Acceptable Hour", type: "number", suffix: "(24h)", min: 6, max: 12, defaultValue: 9 }',
    '{ name: "workEnd", label: "Latest Acceptable Hour", type: "number", suffix: "(24h)", min: 15, max: 22, defaultValue: 18 }',
  ],
  `(inputs) => {
      const myOffset = inputs.yourOffset as number;
      const theirOffset = inputs.theirOffset as number;
      const workStart = inputs.workStart as number;
      const workEnd = inputs.workEnd as number;
      if (workStart >= workEnd) return null;
      const diff = theirOffset - myOffset;
      const theirStart = workStart + diff;
      const theirEnd = workEnd + diff;
      const overlapStart = Math.max(workStart, theirStart);
      const overlapEnd = Math.min(workEnd, theirEnd);
      const overlapHours = Math.max(0, overlapEnd - overlapStart);
      const bestMeetingLocal = overlapHours > 0 ? Math.round((overlapStart + overlapEnd) / 2) : -1;
      const bestMeetingTheirs = bestMeetingLocal >= 0 ? bestMeetingLocal + diff : -1;
      const formatHour = (h: number) => { const hr = ((h % 24) + 24) % 24; return hr + ":00"; };
      return {
        primary: { label: "Overlapping Hours", value: overlapHours > 0 ? formatNumber(overlapHours) + " hours" : "No overlap found" },
        details: [
          { label: "Best Meeting Time (Your Time)", value: bestMeetingLocal >= 0 ? formatHour(bestMeetingLocal) : "N/A" },
          { label: "Best Meeting Time (Their Time)", value: bestMeetingTheirs >= 0 ? formatHour(bestMeetingTheirs) : "N/A" },
          { label: "Time Difference", value: formatNumber(Math.abs(diff)) + " hours " + (diff > 0 ? "ahead" : diff < 0 ? "behind" : "same") },
        ],
      };
    }`,
  [{ q: 'How do I find the best meeting time across time zones?', a: 'Identify the working hours for all participants and find the overlapping window. The middle of the overlap is usually the best compromise for everyone.' },
   { q: 'What is UTC and how does it work?', a: 'UTC (Coordinated Universal Time) is the global time standard. Time zones are expressed as offsets from UTC. For example, US Eastern is UTC-5 and Central European is UTC+1.' }],
  'Overlap = Max(0, Min(End1, End2 + Offset) - Max(Start1, Start2 + Offset))',
  ['moving-day-tip-calculator', 'potluck-planner-calculator']
);

// #97 Power Outage Cost Calculator
add('power-outage-cost-calculator', 'Power Outage Cost Calculator',
  'Estimate the financial cost of a power outage including spoiled food, lost productivity, and damage.',
  'Finance', 'finance', '$',
  ['power outage cost', 'blackout cost calculator', 'electricity outage losses'],
  [
    '{ name: "durationHours", label: "Outage Duration", type: "number", suffix: "hours", min: 1, max: 168, defaultValue: 8 }',
    '{ name: "householdType", label: "Household Type", type: "select", options: [{value:"small",label:"Small (1-2 people)"},{value:"medium",label:"Medium (3-4 people)"},{value:"large",label:"Large (5+ people)"}], defaultValue: "medium" }',
    '{ name: "season", label: "Season", type: "select", options: [{value:"mild",label:"Mild Weather"},{value:"summer",label:"Summer (Hot)"},{value:"winter",label:"Winter (Cold)"}], defaultValue: "mild" }',
    '{ name: "workFromHome", label: "Work From Home Income per Day", type: "number", prefix: "$", min: 0, max: 2000, defaultValue: 200 }',
  ],
  `(inputs) => {
      const hours = inputs.durationHours as number;
      const household = inputs.householdType as string;
      const season = inputs.season as string;
      const wfhIncome = inputs.workFromHome as number;
      if (!hours || hours <= 0) return null;
      const foodLoss = hours >= 4 ? (household === "small" ? 50 : household === "medium" ? 150 : 250) : 0;
      const hvacCost: Record<string, number> = { mild: 0, summer: 5, winter: 8 };
      const comfortCost = (hvacCost[season] || 0) * hours;
      const workHoursLost = Math.min(hours, 8);
      const productivityLoss = (wfhIncome / 8) * workHoursLost;
      const total = foodLoss + comfortCost + productivityLoss;
      return {
        primary: { label: "Estimated Total Cost", value: "$" + formatNumber(Math.round(total)) },
        details: [
          { label: "Food Spoilage", value: "$" + formatNumber(foodLoss) },
          { label: "Comfort/HVAC Impact", value: "$" + formatNumber(Math.round(comfortCost)) },
          { label: "Lost Productivity", value: "$" + formatNumber(Math.round(productivityLoss)) },
        ],
      };
    }`,
  [{ q: 'How much does a power outage cost a household?', a: 'A typical 8-hour outage costs a household $50 to $500 depending on food spoilage, work disruption, and weather conditions. Extended outages can cost significantly more.' },
   { q: 'How can I prepare for a power outage?', a: 'Keep a battery backup for essential electronics, have a cooler and ice ready, maintain flashlights and batteries, and consider a portable generator for extended outages.' }],
  'Total Cost = Food Spoilage + (HVAC Rate x Hours) + (Income / 8 x Work Hours Lost)',
  ['radon-mitigation-calculator', 'mold-remediation-calculator']
);

// #98 Noise Ordinance Calculator
add('noise-ordinance-calculator', 'Noise Ordinance Calculator',
  'Check if your planned noise level complies with typical residential noise ordinance limits.',
  'Everyday', 'everyday', '~',
  ['noise ordinance', 'noise level calculator', 'noise compliance checker'],
  [
    '{ name: "noiseLevel", label: "Expected Noise Level", type: "number", suffix: "dB", min: 30, max: 130, defaultValue: 70 }',
    '{ name: "timeOfDay", label: "Time of Day", type: "select", options: [{value:"day",label:"Daytime (7 AM - 10 PM)"},{value:"night",label:"Nighttime (10 PM - 7 AM)"}], defaultValue: "day" }',
    '{ name: "zoneType", label: "Zone Type", type: "select", options: [{value:"residential",label:"Residential"},{value:"commercial",label:"Commercial"},{value:"mixed",label:"Mixed Use"}], defaultValue: "residential" }',
  ],
  `(inputs) => {
      const noise = inputs.noiseLevel as number;
      const time = inputs.timeOfDay as string;
      const zone = inputs.zoneType as string;
      if (!noise || noise <= 0) return null;
      const dayLimits: Record<string, number> = { residential: 65, commercial: 75, mixed: 70 };
      const nightLimits: Record<string, number> = { residential: 55, commercial: 65, mixed: 60 };
      const limit = time === "day" ? (dayLimits[zone] || 65) : (nightLimits[zone] || 55);
      const isCompliant = noise <= limit;
      const overBy = Math.max(0, noise - limit);
      const comparison = noise <= 50 ? "Quiet conversation level" : noise <= 65 ? "Normal conversation level" : noise <= 80 ? "Vacuum cleaner level" : noise <= 100 ? "Power tool level" : "Dangerously loud";
      return {
        primary: { label: "Compliance Status", value: isCompliant ? "Compliant" : "Exceeds Limit by " + formatNumber(overBy) + " dB" },
        details: [
          { label: "Your Noise Level", value: formatNumber(noise) + " dB" },
          { label: "Ordinance Limit", value: formatNumber(limit) + " dB" },
          { label: "Noise Comparison", value: comparison },
        ],
      };
    }`,
  [{ q: 'What are typical noise ordinance limits?', a: 'Most residential areas limit noise to 55 to 65 dB during the day and 45 to 55 dB at night. Commercial zones typically allow 10 dB higher than residential limits.' },
   { q: 'What activities commonly violate noise ordinances?', a: 'Loud music, power tools, barking dogs, construction, and vehicle modifications are the most common noise ordinance violations in residential areas.' }],
  'Compliance = Noise Level <= Zone Limit for Time of Day',
  ['radon-mitigation-calculator', 'mold-remediation-calculator']
);

// #99 Radon Mitigation Cost Calculator
add('radon-mitigation-calculator', 'Radon Mitigation Cost Calculator',
  'Estimate the cost of radon mitigation based on your home type and radon level.',
  'Everyday', 'everyday', '~',
  ['radon mitigation cost', 'radon remediation', 'radon reduction calculator'],
  [
    '{ name: "radonLevel", label: "Current Radon Level", type: "number", suffix: "pCi/L", min: 0.5, max: 50, step: 0.1, defaultValue: 6 }',
    '{ name: "homeType", label: "Home Type", type: "select", options: [{value:"slab",label:"Slab on Grade"},{value:"basement",label:"Basement"},{value:"crawl",label:"Crawl Space"},{value:"multi",label:"Multiple Foundation Types"}], defaultValue: "basement" }',
    '{ name: "homeSize", label: "Home Size", type: "number", suffix: "sq ft", min: 500, max: 10000, defaultValue: 2000 }',
  ],
  `(inputs) => {
      const radon = inputs.radonLevel as number;
      const homeType = inputs.homeType as string;
      const size = inputs.homeSize as number;
      if (!radon || !size) return null;
      const baseCost: Record<string, number> = { slab: 1000, basement: 1200, crawl: 1100, multi: 1800 };
      const sizeMod = size > 3000 ? 1.3 : size > 2000 ? 1.15 : 1.0;
      const levelMod = radon > 20 ? 1.5 : radon > 10 ? 1.25 : 1.0;
      const installCost = (baseCost[homeType] || 1200) * sizeMod * levelMod;
      const annualRunning = 50;
      const needsMitigation = radon >= 4;
      const expectedReduction = radon * 0.85;
      const afterLevel = radon - expectedReduction;
      return {
        primary: { label: "Estimated Mitigation Cost", value: "$" + formatNumber(Math.round(installCost)) },
        details: [
          { label: "Action Required", value: needsMitigation ? "Mitigation recommended (above 4 pCi/L)" : "Below EPA action level" },
          { label: "Expected Post-Mitigation Level", value: formatNumber(Math.round(afterLevel * 10) / 10) + " pCi/L" },
          { label: "Annual Operating Cost", value: "$" + formatNumber(annualRunning) },
        ],
      };
    }`,
  [{ q: 'What radon level requires mitigation?', a: 'The EPA recommends mitigation for radon levels at or above 4 pCi/L. Levels between 2 and 4 pCi/L should also be considered for mitigation.' },
   { q: 'How much does radon mitigation cost?', a: 'Most radon mitigation systems cost $800 to $2,500 for installation, with an average of about $1,200. The annual operating cost is typically $40 to $60 for the fan.' }],
  'Cost = Base Cost x Size Modifier x Level Modifier',
  ['mold-remediation-calculator', 'home-energy-score-calculator']
);

// #100 Mold Remediation Calculator
add('mold-remediation-calculator', 'Mold Remediation Calculator',
  'Estimate mold removal costs based on affected area, mold type, and location in the home.',
  'Everyday', 'everyday', '~',
  ['mold remediation cost', 'mold removal calculator', 'mold cleanup estimate'],
  [
    '{ name: "affectedArea", label: "Affected Area", type: "number", suffix: "sq ft", min: 1, max: 5000, defaultValue: 100 }',
    '{ name: "moldSeverity", label: "Mold Severity", type: "select", options: [{value:"minor",label:"Minor (Surface Only)"},{value:"moderate",label:"Moderate (Into Materials)"},{value:"severe",label:"Severe (Structural Damage)"}], defaultValue: "moderate" }',
    '{ name: "location", label: "Location in Home", type: "select", options: [{value:"bathroom",label:"Bathroom"},{value:"basement",label:"Basement"},{value:"attic",label:"Attic"},{value:"hvac",label:"HVAC/Ductwork"},{value:"crawl",label:"Crawl Space"}], defaultValue: "basement" }',
    '{ name: "testingNeeded", label: "Professional Testing", type: "select", options: [{value:"no",label:"Not Needed"},{value:"yes",label:"Testing Required ($300-600)"}], defaultValue: "yes" }',
  ],
  `(inputs) => {
      const area = inputs.affectedArea as number;
      const severity = inputs.moldSeverity as string;
      const location = inputs.location as string;
      const testing = inputs.testingNeeded as string;
      if (!area || area <= 0) return null;
      const costPerSqFt: Record<string, number> = { minor: 10, moderate: 25, severe: 50 };
      const locationMod: Record<string, number> = { bathroom: 1.0, basement: 1.1, attic: 1.3, hvac: 1.5, crawl: 1.4 };
      const baseCost = area * (costPerSqFt[severity] || 25) * (locationMod[location] || 1.1);
      const testCost = testing === "yes" ? 450 : 0;
      const total = baseCost + testCost;
      const timeline = area <= 50 ? "1-2 days" : area <= 200 ? "2-4 days" : "1-2 weeks";
      return {
        primary: { label: "Estimated Remediation Cost", value: "$" + formatNumber(Math.round(total)) },
        details: [
          { label: "Remediation Work", value: "$" + formatNumber(Math.round(baseCost)) },
          { label: "Testing Cost", value: "$" + formatNumber(testCost) },
          { label: "Estimated Timeline", value: timeline },
        ],
      };
    }`,
  [{ q: 'How much does mold remediation cost?', a: 'Mold remediation costs range from $500 to $6,000 for typical projects. Small areas (under 10 sq ft) may cost $500 to $1,500, while large projects can exceed $10,000.' },
   { q: 'Can I remove mold myself?', a: 'Small areas of mold (under 10 square feet) on hard surfaces can often be cleaned with detergent and water. Larger areas or mold in porous materials should be handled by professionals.' }],
  'Cost = Affected Area x Cost per Sq Ft x Location Modifier + Testing Cost',
  ['radon-mitigation-calculator', 'home-energy-score-calculator']
);
