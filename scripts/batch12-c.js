add(
  "uv-protection-factor-calculator",
  "UV Protection Factor Calculator",
  "Calculate how long sunscreen protects you from UV radiation based on SPF, skin type, and UV index for safe sun exposure.",
  "Health",
  "health",
  "H",
  ["uv protection", "spf calculator", "sunscreen", "uv index", "sun exposure time"],
  [
    '{ name: "spf", label: "Sunscreen SPF", type: "select", options: [{ value: "15", label: "SPF 15" }, { value: "30", label: "SPF 30" }, { value: "50", label: "SPF 50" }, { value: "70", label: "SPF 70" }, { value: "100", label: "SPF 100" }], defaultValue: "30" }',
    '{ name: "skinType", label: "Skin Type (Fitzpatrick)", type: "select", options: [{ value: "1", label: "Type I - Very Fair" }, { value: "2", label: "Type II - Fair" }, { value: "3", label: "Type III - Medium" }, { value: "4", label: "Type IV - Olive" }, { value: "5", label: "Type V - Brown" }, { value: "6", label: "Type VI - Dark" }], defaultValue: "2" }',
    '{ name: "uvIndex", label: "UV Index", type: "number", min: 1, max: 15, defaultValue: 7 }'
  ],
  `(inputs) => {
    const spf = inputs.spf as number;
    const skinType = inputs.skinType as number;
    const uvIndex = inputs.uvIndex as number;
    const baseTimes = [5, 10, 15, 25, 35, 45];
    const baseMinutes = baseTimes[skinType - 1] || 10;
    const uvAdjust = 10 / uvIndex;
    const protectedMinutes = baseMinutes * spf * uvAdjust;
    const hours = Math.floor(protectedMinutes / 60);
    const mins = Math.round(protectedMinutes % 60);
    const reapplyMinutes = Math.min(protectedMinutes * 0.8, 120);
    const uvBlocked = ((spf - 1) / spf) * 100;
    return {
      primary: { label: "Protected Time", value: formatNumber(hours) + "h " + formatNumber(mins) + "m" },
      details: [
        { label: "Total Protected Minutes", value: formatNumber(Math.round(protectedMinutes)) + " min" },
        { label: "UV Radiation Blocked", value: formatNumber(Math.round(uvBlocked * 10) / 10) + "%" },
        { label: "Recommended Reapply After", value: formatNumber(Math.round(reapplyMinutes)) + " min" },
        { label: "Base Burn Time (No SPF)", value: formatNumber(Math.round(baseMinutes * uvAdjust)) + " min" }
      ]
    };
  }`,
  [
    "Q: How does SPF protect against UV radiation?||A: SPF (Sun Protection Factor) indicates how much longer you can stay in the sun before burning compared to unprotected skin. SPF 30 allows roughly 30 times your natural burn time.",
    "Q: Does higher SPF mean proportionally more protection?||A: No. SPF 30 blocks about 97% of UVB rays while SPF 50 blocks about 98%. The difference diminishes as SPF increases.",
    "Q: How often should I reapply sunscreen?||A: Dermatologists recommend reapplying every 2 hours regardless of SPF, and immediately after swimming or sweating."
  ],
  `Protected Time = Base Burn Time x SPF x (10 / UV Index)\nUV Blocked % = ((SPF - 1) / SPF) x 100`,
  ["wind-chill-calculator", "heat-index-calculator", "solar-panel-savings-calculator"]
);

add(
  "rainfall-collection-calculator",
  "Rainfall Collection Calculator",
  "Estimate how much rainwater you can collect from your roof based on catchment area, local rainfall, and collection efficiency.",
  "Science",
  "science",
  "A",
  ["rainfall collection", "rainwater collection", "roof catchment", "water harvesting", "rain barrel"],
  [
    '{ name: "roofArea", label: "Roof Catchment Area (sq ft)", type: "number", min: 50, max: 10000, defaultValue: 1500 }',
    '{ name: "annualRainfall", label: "Annual Rainfall (inches)", type: "number", min: 1, max: 120, defaultValue: 36 }',
    '{ name: "efficiency", label: "Collection Efficiency (%)", type: "number", min: 50, max: 95, defaultValue: 80 }'
  ],
  `(inputs) => {
    const roofArea = inputs.roofArea as number;
    const annualRainfall = inputs.annualRainfall as number;
    const efficiency = inputs.efficiency as number;
    const gallonsPerInchPerSqFt = 0.623;
    const totalGallons = roofArea * annualRainfall * gallonsPerInchPerSqFt * (efficiency / 100);
    const monthlyGallons = totalGallons / 12;
    const liters = totalGallons * 3.785;
    const avgHouseholdDaily = 80;
    const daysSupply = totalGallons / avgHouseholdDaily;
    return {
      primary: { label: "Annual Collection", value: formatNumber(Math.round(totalGallons)) + " gallons" },
      details: [
        { label: "Monthly Average", value: formatNumber(Math.round(monthlyGallons)) + " gallons" },
        { label: "Annual Collection (Liters)", value: formatNumber(Math.round(liters)) + " L" },
        { label: "Days of Household Supply", value: formatNumber(Math.round(daysSupply)) + " days" },
        { label: "Efficiency Loss", value: formatNumber(Math.round(totalGallons / (efficiency / 100) - totalGallons)) + " gallons" }
      ]
    };
  }`,
  [
    "Q: How much water can I collect from my roof?||A: A 1,000 sq ft roof receiving 1 inch of rain can yield roughly 623 gallons. Actual collection depends on roof material and gutter efficiency.",
    "Q: What is a good collection efficiency?||A: Most residential systems achieve 75-85% efficiency. Metal roofs perform better than asphalt shingles.",
    "Q: Can collected rainwater be used for drinking?||A: Rainwater can be potable with proper filtration and treatment, but many people use it for irrigation, toilet flushing, and laundry."
  ],
  `Annual Gallons = Roof Area x Annual Rainfall x 0.623 x (Efficiency / 100)\nMonthly = Annual / 12`,
  ["rainwater-harvesting-calculator", "solar-panel-savings-calculator", "carbon-footprint-calculator"]
);

add(
  "solar-panel-payback-calculator",
  "Solar Panel Payback Calculator",
  "Calculate the break-even timeline for solar panel installation based on system cost, energy production, electricity rates, and incentives.",
  "Finance",
  "finance",
  "$",
  ["solar payback", "solar roi", "solar panel break even", "solar investment", "solar energy savings"],
  [
    '{ name: "systemCost", label: "Total System Cost ($)", type: "number", min: 1000, max: 100000, defaultValue: 20000 }',
    '{ name: "annualProduction", label: "Annual Production (kWh)", type: "number", min: 500, max: 30000, defaultValue: 8000 }',
    '{ name: "electricityRate", label: "Electricity Rate ($/kWh)", type: "number", min: 0.05, max: 0.50, defaultValue: 0.13 }',
    '{ name: "incentivePercent", label: "Tax Credit / Incentive (%)", type: "number", min: 0, max: 50, defaultValue: 30 }'
  ],
  `(inputs) => {
    const systemCost = inputs.systemCost as number;
    const annualProduction = inputs.annualProduction as number;
    const electricityRate = inputs.electricityRate as number;
    const incentivePercent = inputs.incentivePercent as number;
    const netCost = systemCost * (1 - incentivePercent / 100);
    const annualSavings = annualProduction * electricityRate;
    const paybackYears = netCost / annualSavings;
    const twentyYearSavings = annualSavings * 20 - netCost;
    const roi = (twentyYearSavings / netCost) * 100;
    const monthlySavings = annualSavings / 12;
    return {
      primary: { label: "Payback Period", value: formatNumber(Math.round(paybackYears * 10) / 10) + " years" },
      details: [
        { label: "Net System Cost (After Incentives)", value: "$" + formatNumber(Math.round(netCost)) },
        { label: "Annual Savings", value: "$" + formatNumber(Math.round(annualSavings)) },
        { label: "Monthly Savings", value: "$" + formatNumber(Math.round(monthlySavings)) },
        { label: "20-Year Net Savings", value: "$" + formatNumber(Math.round(twentyYearSavings)) },
        { label: "20-Year ROI", value: formatNumber(Math.round(roi)) + "%" }
      ]
    };
  }`,
  [
    "Q: How long does it take for solar panels to pay for themselves?||A: Most residential solar systems pay for themselves in 6-12 years depending on location, electricity rates, and incentives.",
    "Q: What is the federal solar tax credit?||A: The US federal Investment Tax Credit (ITC) allows homeowners to deduct 30% of the cost of a solar system from their federal taxes.",
    "Q: Do solar panels increase home value?||A: Studies show solar panels increase home value by an average of 3-4%, often exceeding the cost of the system."
  ],
  `Net Cost = System Cost x (1 - Incentive%)\nPayback Years = Net Cost / (Annual kWh x Rate)\n20-Year Savings = (Annual Savings x 20) - Net Cost`,
  ["solar-panel-savings-calculator", "carbon-footprint-calculator", "rainfall-collection-calculator"]
);

add(
  "carbon-footprint-offset-calculator",
  "Carbon Footprint Offset Calculator",
  "Calculate the number of trees or carbon credits needed to offset your annual carbon footprint from driving, flights, and home energy.",
  "Science",
  "science",
  "A",
  ["carbon offset", "carbon neutrality", "tree planting", "carbon credits", "emissions offset"],
  [
    '{ name: "drivingMiles", label: "Annual Driving Miles", type: "number", min: 0, max: 100000, defaultValue: 12000 }',
    '{ name: "flightHours", label: "Annual Flight Hours", type: "number", min: 0, max: 500, defaultValue: 10 }',
    '{ name: "homeKwh", label: "Monthly Home Electricity (kWh)", type: "number", min: 0, max: 5000, defaultValue: 900 }',
    '{ name: "creditCost", label: "Carbon Credit Cost ($/ton)", type: "number", min: 5, max: 100, defaultValue: 15 }'
  ],
  `(inputs) => {
    const drivingMiles = inputs.drivingMiles as number;
    const flightHours = inputs.flightHours as number;
    const homeKwh = inputs.homeKwh as number;
    const creditCost = inputs.creditCost as number;
    const drivingCO2 = drivingMiles * 0.000404;
    const flightCO2 = flightHours * 0.255;
    const homeCO2 = homeKwh * 12 * 0.000417;
    const totalCO2 = drivingCO2 + flightCO2 + homeCO2;
    const treesNeeded = Math.ceil(totalCO2 / 0.022);
    const creditsCost = totalCO2 * creditCost;
    return {
      primary: { label: "Total Annual CO2", value: formatNumber(Math.round(totalCO2 * 100) / 100) + " metric tons" },
      details: [
        { label: "Driving Emissions", value: formatNumber(Math.round(drivingCO2 * 100) / 100) + " tons" },
        { label: "Flight Emissions", value: formatNumber(Math.round(flightCO2 * 100) / 100) + " tons" },
        { label: "Home Energy Emissions", value: formatNumber(Math.round(homeCO2 * 100) / 100) + " tons" },
        { label: "Trees Needed to Offset", value: formatNumber(treesNeeded) + " trees" },
        { label: "Carbon Credit Cost", value: "$" + formatNumber(Math.round(creditsCost)) }
      ]
    };
  }`,
  [
    "Q: How much CO2 does one tree absorb per year?||A: A mature tree absorbs approximately 22 kg (48 lbs) of CO2 per year, though this varies by species and growing conditions.",
    "Q: What is a carbon credit?||A: A carbon credit represents one metric ton of CO2 removed from or prevented from entering the atmosphere, traded on voluntary and compliance markets.",
    "Q: What is the average American carbon footprint?||A: The average American produces approximately 16 metric tons of CO2 per year, well above the global average of about 4 tons."
  ],
  `Driving CO2 = Miles x 0.000404 tons/mile\nFlight CO2 = Hours x 0.255 tons/hour\nHome CO2 = kWh x 12 x 0.000417 tons/kWh\nTrees = Total CO2 / 0.022`,
  ["carbon-footprint-calculator", "tree-carbon-calculator", "solar-panel-payback-calculator"]
);

add(
  "recycling-savings-calculator",
  "Recycling Savings Calculator",
  "Estimate the environmental and financial savings from recycling paper, plastic, glass, and aluminum compared to landfill disposal.",
  "Science",
  "science",
  "A",
  ["recycling savings", "recycling calculator", "waste diversion", "recycling benefits", "landfill reduction"],
  [
    '{ name: "paperLbs", label: "Paper Recycled (lbs/month)", type: "number", min: 0, max: 500, defaultValue: 20 }',
    '{ name: "plasticLbs", label: "Plastic Recycled (lbs/month)", type: "number", min: 0, max: 200, defaultValue: 8 }',
    '{ name: "glassLbs", label: "Glass Recycled (lbs/month)", type: "number", min: 0, max: 200, defaultValue: 10 }',
    '{ name: "aluminumLbs", label: "Aluminum Recycled (lbs/month)", type: "number", min: 0, max: 100, defaultValue: 4 }'
  ],
  `(inputs) => {
    const paperLbs = inputs.paperLbs as number;
    const plasticLbs = inputs.plasticLbs as number;
    const glassLbs = inputs.glassLbs as number;
    const aluminumLbs = inputs.aluminumLbs as number;
    const co2Paper = paperLbs * 12 * 1.17;
    const co2Plastic = plasticLbs * 12 * 1.5;
    const co2Glass = glassLbs * 12 * 0.31;
    const co2Aluminum = aluminumLbs * 12 * 8.14;
    const totalCO2Lbs = co2Paper + co2Plastic + co2Glass + co2Aluminum;
    const totalCO2Tons = totalCO2Lbs / 2204.6;
    const energySaved = paperLbs * 12 * 4100 + plasticLbs * 12 * 5774 + glassLbs * 12 * 42 + aluminumLbs * 12 * 14000;
    const energySavedKwh = energySaved / 3412;
    const landfillSaved = (paperLbs + plasticLbs + glassLbs + aluminumLbs) * 12;
    return {
      primary: { label: "Annual CO2 Saved", value: formatNumber(Math.round(totalCO2Tons * 100) / 100) + " tons" },
      details: [
        { label: "Total CO2 Saved", value: formatNumber(Math.round(totalCO2Lbs)) + " lbs" },
        { label: "Energy Saved", value: formatNumber(Math.round(energySavedKwh)) + " kWh" },
        { label: "Landfill Waste Avoided", value: formatNumber(landfillSaved) + " lbs/year" },
        { label: "Equivalent Trees Planted", value: formatNumber(Math.round(totalCO2Tons / 0.022)) }
      ]
    };
  }`,
  [
    "Q: How much CO2 does recycling one ton of paper save?||A: Recycling one ton of paper saves approximately 1.17 tons of CO2 compared to manufacturing from virgin pulp.",
    "Q: Which material saves the most energy when recycled?||A: Aluminum recycling saves up to 95% of the energy needed to produce new aluminum from raw bauxite ore.",
    "Q: What percentage of waste is recyclable?||A: Approximately 75% of waste is recyclable, but only about 30% is actually recycled in the United States."
  ],
  `CO2 Saved = (Paper x 1.17) + (Plastic x 1.5) + (Glass x 0.31) + (Aluminum x 8.14) lbs/lb\nAnnual = Monthly x 12`,
  ["carbon-footprint-offset-calculator", "carbon-footprint-calculator", "recycling-impact"]
);

add(
  "rainwater-tank-size-calculator",
  "Rainwater Tank Size Calculator",
  "Determine the optimal rainwater storage tank size based on roof area, rainfall patterns, and daily water usage requirements.",
  "Everyday",
  "everyday",
  "~",
  ["rainwater tank", "water tank sizing", "cistern calculator", "rain storage", "water storage tank"],
  [
    '{ name: "roofArea", label: "Roof Area (sq ft)", type: "number", min: 100, max: 10000, defaultValue: 2000 }',
    '{ name: "monthlyRainfall", label: "Average Monthly Rainfall (inches)", type: "number", min: 0.5, max: 15, defaultValue: 3 }',
    '{ name: "dailyUsage", label: "Daily Water Usage (gallons)", type: "number", min: 1, max: 200, defaultValue: 50 }',
    '{ name: "dryDays", label: "Longest Dry Spell (days)", type: "number", min: 1, max: 120, defaultValue: 30 }'
  ],
  `(inputs) => {
    const roofArea = inputs.roofArea as number;
    const monthlyRainfall = inputs.monthlyRainfall as number;
    const dailyUsage = inputs.dailyUsage as number;
    const dryDays = inputs.dryDays as number;
    const monthlyCollection = roofArea * monthlyRainfall * 0.623 * 0.8;
    const dailyCollection = monthlyCollection / 30;
    const reserveNeeded = dailyUsage * dryDays;
    const recommendedTank = Math.ceil(reserveNeeded / 50) * 50;
    const surplusDeficit = dailyCollection - dailyUsage;
    const daysAutonomy = recommendedTank / dailyUsage;
    return {
      primary: { label: "Recommended Tank Size", value: formatNumber(recommendedTank) + " gallons" },
      details: [
        { label: "Daily Collection Potential", value: formatNumber(Math.round(dailyCollection)) + " gallons" },
        { label: "Daily Usage", value: formatNumber(dailyUsage) + " gallons" },
        { label: "Daily Surplus/Deficit", value: formatNumber(Math.round(surplusDeficit)) + " gallons" },
        { label: "Reserve for Dry Spell", value: formatNumber(reserveNeeded) + " gallons" },
        { label: "Days of Autonomy", value: formatNumber(Math.round(daysAutonomy)) + " days" }
      ]
    };
  }`,
  [
    "Q: How do I choose the right rainwater tank size?||A: Consider your daily water usage, the length of dry spells in your area, and your roof catchment area. A tank should hold enough water for your longest expected dry period.",
    "Q: What shapes are available for rainwater tanks?||A: Tanks come in round, slimline, and underground options. Slimline tanks fit against walls while round tanks are more cost-effective per gallon.",
    "Q: Do I need a pump for a rainwater tank?||A: If the tank is elevated, gravity can feed water. Otherwise, a small pump is needed for pressurized applications like irrigation or household use."
  ],
  `Monthly Collection = Roof Area x Rainfall x 0.623 x 0.8\nReserve = Daily Usage x Dry Days\nRecommended Tank = Reserve rounded up to nearest 50 gallons`,
  ["rainfall-collection-calculator", "rainwater-harvesting-calculator", "solar-panel-payback-calculator"]
);

add(
  "air-quality-health-impact-calculator",
  "Air Quality Health Impact Calculator",
  "Assess the health impact of air pollution levels based on AQI, exposure duration, and activity level for respiratory risk awareness.",
  "Health",
  "health",
  "H",
  ["air quality", "aqi calculator", "pollution health", "respiratory risk", "air pollution index"],
  [
    '{ name: "aqi", label: "Air Quality Index (AQI)", type: "number", min: 0, max: 500, defaultValue: 75 }',
    '{ name: "exposureHours", label: "Daily Outdoor Exposure (hours)", type: "number", min: 0, max: 24, defaultValue: 3 }',
    '{ name: "activityLevel", label: "Activity Level", type: "select", options: [{ value: "1", label: "Light (walking)" }, { value: "2", label: "Moderate (jogging)" }, { value: "3", label: "Heavy (running/sports)" }], defaultValue: "1" }',
    '{ name: "sensitive", label: "Sensitive Group", type: "select", options: [{ value: "0", label: "No" }, { value: "1", label: "Yes (asthma, elderly, children)" }], defaultValue: "0" }'
  ],
  `(inputs) => {
    const aqi = inputs.aqi as number;
    const exposureHours = inputs.exposureHours as number;
    const activityLevel = inputs.activityLevel as number;
    const sensitive = inputs.sensitive as number;
    const breathingMultiplier = [1, 2.5, 5][activityLevel - 1];
    const sensitiveMultiplier = sensitive === 1 ? 1.5 : 1;
    const effectiveDose = aqi * (exposureHours / 24) * breathingMultiplier * sensitiveMultiplier;
    let riskLevel = "Low";
    let recommendation = "Normal outdoor activity is safe";
    if (effectiveDose > 300) { riskLevel = "Very High"; recommendation = "Avoid all outdoor exertion"; }
    else if (effectiveDose > 150) { riskLevel = "High"; recommendation = "Reduce prolonged outdoor exertion"; }
    else if (effectiveDose > 75) { riskLevel = "Moderate"; recommendation = "Sensitive groups should limit outdoor exertion"; }
    else if (effectiveDose > 35) { riskLevel = "Low-Moderate"; recommendation = "Unusually sensitive people should reduce outdoor activity"; }
    const annualExposure = effectiveDose * 365;
    return {
      primary: { label: "Risk Level", value: riskLevel },
      details: [
        { label: "Effective Daily Dose", value: formatNumber(Math.round(effectiveDose)) + " AQI-hours" },
        { label: "Annualized Exposure", value: formatNumber(Math.round(annualExposure)) + " AQI-hours/year" },
        { label: "Breathing Rate Multiplier", value: formatNumber(breathingMultiplier) + "x" },
        { label: "Recommendation", value: recommendation }
      ]
    };
  }`,
  [
    "Q: What is AQI and what do the numbers mean?||A: AQI (Air Quality Index) ranges from 0-500. 0-50 is good, 51-100 moderate, 101-150 unhealthy for sensitive groups, 151-200 unhealthy, 201-300 very unhealthy, 301+ hazardous.",
    "Q: Who is in a sensitive group for air quality?||A: Sensitive groups include children, older adults, people with asthma or lung disease, and people with heart disease.",
    "Q: Does exercise increase pollution exposure?||A: Yes, heavy exercise can increase your breathing rate 5-10 times compared to rest, proportionally increasing the amount of pollutants inhaled."
  ],
  `Effective Dose = AQI x (Hours / 24) x Activity Multiplier x Sensitivity Multiplier\nRisk thresholds: Low (<35), Moderate (35-75), High (75-150), Very High (>150)`,
  ["uv-protection-factor-calculator", "heat-index-calculator", "carbon-footprint-offset-calculator"]
);

add(
  "deforestation-impact-calculator",
  "Deforestation Impact Calculator",
  "Estimate the environmental impact of deforestation including lost carbon sequestration, biodiversity loss, and water cycle disruption.",
  "Science",
  "science",
  "A",
  ["deforestation", "forest loss", "carbon sequestration loss", "biodiversity impact", "tree loss calculator"],
  [
    '{ name: "hectares", label: "Area Deforested (hectares)", type: "number", min: 1, max: 100000, defaultValue: 100 }',
    '{ name: "forestType", label: "Forest Type", type: "select", options: [{ value: "1", label: "Tropical Rainforest" }, { value: "2", label: "Temperate Forest" }, { value: "3", label: "Boreal Forest" }, { value: "4", label: "Mangrove" }], defaultValue: "1" }',
    '{ name: "yearsLost", label: "Forest Age (years)", type: "number", min: 10, max: 500, defaultValue: 100 }'
  ],
  `(inputs) => {
    const hectares = inputs.hectares as number;
    const forestType = inputs.forestType as number;
    const yearsLost = inputs.yearsLost as number;
    const carbonPerHectare = [180, 120, 90, 220][forestType - 1];
    const speciesPerHectare = [400, 150, 60, 300][forestType - 1];
    const waterRetentionLiters = [8000000, 5000000, 4000000, 12000000][forestType - 1];
    const carbonReleased = hectares * carbonPerHectare;
    const speciesAffected = Math.round(hectares * speciesPerHectare * 0.01);
    const waterLoss = hectares * waterRetentionLiters;
    const waterLossMillionLiters = waterLoss / 1000000;
    const treesLost = hectares * 400;
    const yearsToRecover = yearsLost * 1.5;
    return {
      primary: { label: "Carbon Released", value: formatNumber(Math.round(carbonReleased)) + " metric tons CO2" },
      details: [
        { label: "Trees Destroyed", value: formatNumber(treesLost) },
        { label: "Species Potentially Affected", value: formatNumber(speciesAffected) },
        { label: "Water Retention Lost", value: formatNumber(Math.round(waterLossMillionLiters)) + " million liters" },
        { label: "Estimated Recovery Time", value: formatNumber(Math.round(yearsToRecover)) + " years" }
      ]
    };
  }`,
  [
    "Q: How much CO2 does deforestation release?||A: Deforestation accounts for approximately 10% of global CO2 emissions. A single hectare of tropical forest stores about 180 metric tons of carbon.",
    "Q: Can deforested areas recover?||A: Secondary forests can regrow, but it takes 100-200 years to approach the biodiversity and carbon storage of old-growth forest.",
    "Q: Which forests store the most carbon?||A: Mangrove forests store the most carbon per hectare, followed by tropical rainforests, temperate forests, and boreal forests."
  ],
  `Carbon Released = Hectares x Carbon per Hectare\nSpecies Affected = Hectares x Species Density x 0.01\nRecovery Time = Forest Age x 1.5`,
  ["carbon-footprint-offset-calculator", "tree-carbon-calculator", "soil-erosion-rate-calculator"]
);

add(
  "ocean-acidification-calculator",
  "Ocean Acidification Calculator",
  "Model the impact of CO2 absorption on ocean pH levels and the effects on marine ecosystems based on emissions scenarios.",
  "Science",
  "science",
  "A",
  ["ocean acidification", "ocean pH", "marine impact", "co2 ocean absorption", "coral reef impact"],
  [
    '{ name: "co2ppm", label: "Atmospheric CO2 (ppm)", type: "number", min: 280, max: 1000, defaultValue: 420 }',
    '{ name: "yearsProjected", label: "Years to Project", type: "number", min: 1, max: 200, defaultValue: 50 }',
    '{ name: "annualIncrease", label: "Annual CO2 Increase (ppm)", type: "number", min: 0, max: 10, defaultValue: 2.5 }'
  ],
  `(inputs) => {
    const co2ppm = inputs.co2ppm as number;
    const yearsProjected = inputs.yearsProjected as number;
    const annualIncrease = inputs.annualIncrease as number;
    const preindustrialCO2 = 280;
    const preindustrialPH = 8.18;
    const futureCO2 = co2ppm + (annualIncrease * yearsProjected);
    const currentPH = preindustrialPH - 0.0576 * Math.log(co2ppm / preindustrialCO2);
    const futurePH = preindustrialPH - 0.0576 * Math.log(futureCO2 / preindustrialCO2);
    const phDrop = currentPH - futurePH;
    const coralRisk = futurePH < 7.8 ? "Critical" : futurePH < 7.95 ? "Severe" : futurePH < 8.05 ? "Moderate" : "Low";
    const acidityIncrease = (Math.pow(10, -(futurePH)) / Math.pow(10, -(preindustrialPH)) - 1) * 100;
    return {
      primary: { label: "Projected Ocean pH", value: formatNumber(Math.round(futurePH * 1000) / 1000) },
      details: [
        { label: "Current Ocean pH", value: formatNumber(Math.round(currentPH * 1000) / 1000) },
        { label: "pH Drop Over Period", value: formatNumber(Math.round(phDrop * 1000) / 1000) },
        { label: "Projected CO2 Level", value: formatNumber(Math.round(futureCO2)) + " ppm" },
        { label: "Acidity Increase vs Pre-Industrial", value: formatNumber(Math.round(acidityIncrease)) + "%" },
        { label: "Coral Reef Risk Level", value: coralRisk }
      ]
    };
  }`,
  [
    "Q: What is ocean acidification?||A: Ocean acidification is the decrease in ocean pH caused by absorption of atmospheric CO2. The ocean has absorbed about 30% of human-produced CO2, lowering pH by 0.1 since pre-industrial times.",
    "Q: How does ocean acidification affect marine life?||A: Lower pH reduces carbonate availability, making it harder for corals, shellfish, and plankton to build shells and skeletons, threatening entire marine food chains.",
    "Q: Can ocean acidification be reversed?||A: If CO2 emissions are reduced dramatically, ocean pH can slowly recover over thousands of years, but the current rate of change is 100 times faster than any natural period."
  ],
  `Ocean pH = 8.18 - 0.0576 x ln(CO2 / 280)\nFuture CO2 = Current CO2 + (Annual Increase x Years)\nAcidity Change = (10^(-future pH) / 10^(-8.18) - 1) x 100%`,
  ["carbon-footprint-offset-calculator", "deforestation-impact-calculator", "permafrost-thaw-rate-calculator"]
);

add(
  "permafrost-thaw-rate-calculator",
  "Permafrost Thaw Rate Calculator",
  "Estimate permafrost degradation and methane release based on temperature rise, soil type, and ice content for climate impact modeling.",
  "Science",
  "science",
  "A",
  ["permafrost thaw", "permafrost melting", "methane release", "arctic warming", "frozen ground"],
  [
    '{ name: "tempRise", label: "Temperature Increase Above Baseline (°C)", type: "number", min: 0.5, max: 10, defaultValue: 2 }',
    '{ name: "areaKm2", label: "Permafrost Area (km²)", type: "number", min: 1, max: 1000000, defaultValue: 1000 }',
    '{ name: "iceContent", label: "Ice Content (%)", type: "number", min: 10, max: 90, defaultValue: 50 }',
    '{ name: "years", label: "Time Period (years)", type: "number", min: 1, max: 200, defaultValue: 50 }'
  ],
  `(inputs) => {
    const tempRise = inputs.tempRise as number;
    const areaKm2 = inputs.areaKm2 as number;
    const iceContent = inputs.iceContent as number;
    const years = inputs.years as number;
    const thawRateCmPerYear = tempRise * 3.5;
    const totalThawCm = thawRateCmPerYear * years;
    const carbonPerKm2 = 1500 * (iceContent / 100);
    const totalCarbonStored = areaKm2 * carbonPerKm2;
    const percentThawed = Math.min((totalThawCm / 300) * 100, 100);
    const carbonReleased = totalCarbonStored * (percentThawed / 100) * 0.1;
    const methaneReleased = carbonReleased * 0.023;
    const co2Equivalent = methaneReleased * 28 + carbonReleased * (1 - 0.023);
    return {
      primary: { label: "Estimated Thaw Depth", value: formatNumber(Math.round(totalThawCm)) + " cm" },
      details: [
        { label: "Thaw Rate", value: formatNumber(Math.round(thawRateCmPerYear * 10) / 10) + " cm/year" },
        { label: "Area Percent Thawed", value: formatNumber(Math.round(percentThawed)) + "%" },
        { label: "Carbon Released", value: formatNumber(Math.round(carbonReleased)) + " tons" },
        { label: "Methane Released", value: formatNumber(Math.round(methaneReleased)) + " tons CH4" },
        { label: "CO2 Equivalent", value: formatNumber(Math.round(co2Equivalent)) + " tons CO2e" }
      ]
    };
  }`,
  [
    "Q: What is permafrost?||A: Permafrost is ground that remains frozen for at least two consecutive years. It covers about 25% of the Northern Hemisphere's land surface and stores massive amounts of organic carbon.",
    "Q: Why is permafrost thaw dangerous?||A: Thawing permafrost releases stored carbon as CO2 and methane, creating a feedback loop that accelerates warming. Methane is 28 times more potent than CO2 as a greenhouse gas.",
    "Q: How fast is permafrost thawing?||A: Arctic permafrost is warming at about 0.3-0.5°C per decade. Some regions have lost meters of permafrost depth over the past 50 years."
  ],
  `Thaw Depth = Temperature Rise x 3.5 cm/year x Years\nPercent Thawed = (Thaw Depth / 300) x 100\nCarbon Released = Stored Carbon x % Thawed x 0.1\nCO2 Equivalent = (CH4 x 28) + CO2`,
  ["ocean-acidification-calculator", "deforestation-impact-calculator", "carbon-footprint-offset-calculator"]
);

add(
  "drought-severity-index-calculator",
  "Drought Severity Index Calculator",
  "Calculate drought severity using precipitation deficits, temperature anomalies, and soil moisture to assess agricultural and water supply risk.",
  "Science",
  "science",
  "A",
  ["drought index", "drought severity", "precipitation deficit", "water shortage", "drought monitor"],
  [
    '{ name: "actualPrecip", label: "Actual Precipitation (inches)", type: "number", min: 0, max: 50, defaultValue: 2 }',
    '{ name: "normalPrecip", label: "Normal Precipitation (inches)", type: "number", min: 0.5, max: 50, defaultValue: 4 }',
    '{ name: "tempAnomaly", label: "Temperature Above Normal (°F)", type: "number", min: 0, max: 20, defaultValue: 5 }',
    '{ name: "soilMoisture", label: "Soil Moisture (%)", type: "number", min: 0, max: 100, defaultValue: 30 }'
  ],
  `(inputs) => {
    const actualPrecip = inputs.actualPrecip as number;
    const normalPrecip = inputs.normalPrecip as number;
    const tempAnomaly = inputs.tempAnomaly as number;
    const soilMoisture = inputs.soilMoisture as number;
    const precipDeficit = ((normalPrecip - actualPrecip) / normalPrecip) * 100;
    const precipIndex = precipDeficit * 0.4;
    const tempIndex = tempAnomaly * 3;
    const moistureIndex = (100 - soilMoisture) * 0.3;
    const severityScore = precipIndex + tempIndex + moistureIndex;
    let category = "D0 - Abnormally Dry";
    if (severityScore >= 80) category = "D4 - Exceptional Drought";
    else if (severityScore >= 60) category = "D3 - Extreme Drought";
    else if (severityScore >= 45) category = "D2 - Severe Drought";
    else if (severityScore >= 30) category = "D1 - Moderate Drought";
    const cropImpact = severityScore > 60 ? "Major crop losses likely" : severityScore > 40 ? "Reduced yields expected" : "Minimal crop impact";
    return {
      primary: { label: "Drought Severity", value: category },
      details: [
        { label: "Severity Score", value: formatNumber(Math.round(severityScore)) },
        { label: "Precipitation Deficit", value: formatNumber(Math.round(precipDeficit)) + "%" },
        { label: "Temperature Contribution", value: formatNumber(Math.round(tempIndex)) + " pts" },
        { label: "Soil Moisture Contribution", value: formatNumber(Math.round(moistureIndex)) + " pts" },
        { label: "Agricultural Impact", value: cropImpact }
      ]
    };
  }`,
  [
    "Q: What are the drought severity categories?||A: The US Drought Monitor uses five categories: D0 (Abnormally Dry), D1 (Moderate), D2 (Severe), D3 (Extreme), and D4 (Exceptional Drought).",
    "Q: How does temperature affect drought?||A: Higher temperatures increase evapotranspiration, pulling more moisture from soil and plants, intensifying drought conditions even without reduced rainfall.",
    "Q: What is soil moisture and why does it matter?||A: Soil moisture is the water content in soil. It directly affects plant growth, groundwater recharge, and the severity of drought impacts on agriculture."
  ],
  `Severity Score = (Precip Deficit% x 0.4) + (Temp Anomaly x 3) + ((100 - Soil Moisture%) x 0.3)\nD0 < 30, D1 30-45, D2 45-60, D3 60-80, D4 > 80`,
  ["evapotranspiration-rate-calculator", "soil-erosion-rate-calculator", "growing-degree-days-calculator"]
);

add(
  "flood-risk-assessment-calculator",
  "Flood Risk Assessment Calculator",
  "Evaluate flood risk for a property based on elevation, proximity to water, rainfall intensity, and soil drainage characteristics.",
  "Everyday",
  "everyday",
  "~",
  ["flood risk", "flood assessment", "flood zone", "flooding probability", "flood insurance"],
  [
    '{ name: "elevationFt", label: "Elevation Above Floodplain (ft)", type: "number", min: 0, max: 100, defaultValue: 8 }',
    '{ name: "distanceToWater", label: "Distance to Nearest Water Body (ft)", type: "number", min: 0, max: 10000, defaultValue: 500 }',
    '{ name: "rainfallIntensity", label: "Max 24hr Rainfall (inches)", type: "number", min: 1, max: 30, defaultValue: 5 }',
    '{ name: "soilDrainage", label: "Soil Drainage", type: "select", options: [{ value: "1", label: "Well-Drained (Sandy)" }, { value: "2", label: "Moderate (Loam)" }, { value: "3", label: "Poor (Clay)" }, { value: "4", label: "Very Poor (Hardpan)" }], defaultValue: "2" }'
  ],
  `(inputs) => {
    const elevationFt = inputs.elevationFt as number;
    const distanceToWater = inputs.distanceToWater as number;
    const rainfallIntensity = inputs.rainfallIntensity as number;
    const soilDrainage = inputs.soilDrainage as number;
    const elevScore = Math.max(0, 100 - elevationFt * 5);
    const distScore = Math.max(0, 100 - distanceToWater * 0.02);
    const rainScore = rainfallIntensity * 8;
    const drainMultiplier = [0.5, 0.75, 1.2, 1.5][soilDrainage - 1];
    const riskScore = (elevScore * 0.35 + distScore * 0.25 + rainScore * 0.25) * drainMultiplier;
    const clampedScore = Math.min(Math.max(riskScore, 0), 100);
    let riskLevel = "Low";
    let zone = "Zone X";
    if (clampedScore >= 75) { riskLevel = "Very High"; zone = "Zone A (Special Flood Hazard)"; }
    else if (clampedScore >= 55) { riskLevel = "High"; zone = "Zone AE"; }
    else if (clampedScore >= 35) { riskLevel = "Moderate"; zone = "Zone B/X (shaded)"; }
    const annualProbability = clampedScore / 100 * 0.26;
    const insuranceEstimate = clampedScore >= 55 ? 2500 : clampedScore >= 35 ? 1200 : 500;
    return {
      primary: { label: "Flood Risk Level", value: riskLevel + " (" + formatNumber(Math.round(clampedScore)) + "/100)" },
      details: [
        { label: "Estimated FEMA Zone", value: zone },
        { label: "Annual Flood Probability", value: formatNumber(Math.round(annualProbability * 1000) / 10) + "%" },
        { label: "Elevation Risk Score", value: formatNumber(Math.round(elevScore)) + "/100" },
        { label: "Estimated Annual Insurance", value: "$" + formatNumber(insuranceEstimate) }
      ]
    };
  }`,
  [
    "Q: What are FEMA flood zones?||A: FEMA flood zones range from Zone A (high risk, 1% annual flood chance) to Zone X (low risk). Zones determine insurance requirements and building codes.",
    "Q: Is flood insurance required?||A: Federally-backed mortgages in Special Flood Hazard Areas (Zones A and V) require flood insurance. It is optional but recommended elsewhere.",
    "Q: What factors increase flood risk most?||A: Low elevation relative to nearby water bodies, poor soil drainage, proximity to rivers or coasts, and high rainfall intensity are the strongest predictors."
  ],
  `Risk Score = (Elevation Score x 0.35 + Distance Score x 0.25 + Rain Score x 0.25) x Drainage Multiplier\nElevation Score = max(0, 100 - Elevation x 5)`,
  ["rainfall-collection-calculator", "drought-severity-index-calculator", "hurricane-preparedness-cost-calculator"]
);

add(
  "wildfire-risk-calculator",
  "Wildfire Risk Calculator",
  "Assess wildfire risk for your property based on vegetation density, slope, distance to wildland, humidity, and wind conditions.",
  "Everyday",
  "everyday",
  "~",
  ["wildfire risk", "fire danger", "wildland fire", "fire risk assessment", "defensible space"],
  [
    '{ name: "vegetationDensity", label: "Vegetation Density", type: "select", options: [{ value: "1", label: "Sparse (desert/urban)" }, { value: "2", label: "Moderate (mixed)" }, { value: "3", label: "Dense (forest/chaparral)" }], defaultValue: "2" }',
    '{ name: "slopePercent", label: "Terrain Slope (%)", type: "number", min: 0, max: 100, defaultValue: 15 }',
    '{ name: "defensibleSpace", label: "Defensible Space (ft)", type: "number", min: 0, max: 300, defaultValue: 100 }',
    '{ name: "humidity", label: "Relative Humidity (%)", type: "number", min: 5, max: 100, defaultValue: 30 }',
    '{ name: "windSpeed", label: "Wind Speed (mph)", type: "number", min: 0, max: 80, defaultValue: 15 }'
  ],
  `(inputs) => {
    const vegetationDensity = inputs.vegetationDensity as number;
    const slopePercent = inputs.slopePercent as number;
    const defensibleSpace = inputs.defensibleSpace as number;
    const humidity = inputs.humidity as number;
    const windSpeed = inputs.windSpeed as number;
    const vegScore = [15, 40, 70][vegetationDensity - 1];
    const slopeScore = Math.min(slopePercent * 0.5, 30);
    const defenseReduction = Math.min(defensibleSpace / 3, 30);
    const humidityScore = Math.max(0, (50 - humidity) * 0.6);
    const windScore = windSpeed * 0.4;
    const rawRisk = vegScore + slopeScore + humidityScore + windScore - defenseReduction;
    const riskScore = Math.min(Math.max(rawRisk, 0), 100);
    let riskLevel = "Low";
    if (riskScore >= 75) riskLevel = "Extreme";
    else if (riskScore >= 55) riskLevel = "High";
    else if (riskScore >= 35) riskLevel = "Moderate";
    const fireSpreadRate = (windSpeed * 0.1 + slopePercent * 0.05) * vegetationDensity;
    const recommendedSpace = riskScore >= 55 ? 200 : riskScore >= 35 ? 100 : 50;
    return {
      primary: { label: "Wildfire Risk", value: riskLevel + " (" + formatNumber(Math.round(riskScore)) + "/100)" },
      details: [
        { label: "Vegetation Risk", value: formatNumber(vegScore) + "/70" },
        { label: "Slope Risk Contribution", value: formatNumber(Math.round(slopeScore)) + "/30" },
        { label: "Defensible Space Benefit", value: "-" + formatNumber(Math.round(defenseReduction)) + " pts" },
        { label: "Est. Fire Spread Rate", value: formatNumber(Math.round(fireSpreadRate * 10) / 10) + " chains/hr" },
        { label: "Recommended Defensible Space", value: formatNumber(recommendedSpace) + " ft" }
      ]
    };
  }`,
  [
    "Q: What is defensible space?||A: Defensible space is the area around a building where vegetation is managed to reduce fire risk. Most fire agencies recommend at least 100 feet of defensible space.",
    "Q: How does slope affect wildfire?||A: Fire travels faster uphill because heat rises and preheats vegetation above. A fire on a 30% slope can spread twice as fast as on flat ground.",
    "Q: What are the most fire-resistant building materials?||A: Metal roofing, stucco walls, tempered glass windows, and fiber cement siding are among the most fire-resistant residential materials."
  ],
  `Risk Score = Vegetation Score + Slope Score + Humidity Score + Wind Score - Defensible Space Reduction\nFire Spread = (Wind x 0.1 + Slope x 0.05) x Vegetation Density`,
  ["wildfire-prep-calculator", "wind-chill-calculator", "drought-severity-index-calculator"]
);

add(
  "tornado-safety-distance-calculator",
  "Tornado Safety Distance Calculator",
  "Calculate a safe distance from a tornado based on estimated size, wind speed, and projectile risk for emergency decision-making.",
  "Science",
  "science",
  "A",
  ["tornado distance", "tornado safety", "tornado wind speed", "fujita scale", "tornado shelter"],
  [
    '{ name: "efRating", label: "Enhanced Fujita Rating", type: "select", options: [{ value: "0", label: "EF0 (65-85 mph)" }, { value: "1", label: "EF1 (86-110 mph)" }, { value: "2", label: "EF2 (111-135 mph)" }, { value: "3", label: "EF3 (136-165 mph)" }, { value: "4", label: "EF4 (166-200 mph)" }, { value: "5", label: "EF5 (200+ mph)" }], defaultValue: "2" }',
    '{ name: "tornadoWidth", label: "Estimated Width (yards)", type: "number", min: 10, max: 3000, defaultValue: 300 }',
    '{ name: "movingSpeed", label: "Tornado Speed (mph)", type: "number", min: 5, max: 70, defaultValue: 30 }',
    '{ name: "timeToShelter", label: "Time to Reach Shelter (minutes)", type: "number", min: 1, max: 60, defaultValue: 10 }'
  ],
  `(inputs) => {
    const efRating = inputs.efRating as number;
    const tornadoWidth = inputs.tornadoWidth as number;
    const movingSpeed = inputs.movingSpeed as number;
    const timeToShelter = inputs.timeToShelter as number;
    const maxWinds = [85, 110, 135, 165, 200, 250][efRating];
    const debrisRadius = tornadoWidth * (1 + efRating * 0.5);
    const safeDistanceMiles = (movingSpeed * timeToShelter / 60) + (debrisRadius / 1760) + 0.5;
    const safeDistanceFt = safeDistanceMiles * 5280;
    const warningTimeMin = (safeDistanceMiles / movingSpeed) * 60;
    let shelterAdvice = "Interior room on lowest floor";
    if (efRating >= 4) shelterAdvice = "Underground shelter or safe room required";
    else if (efRating >= 2) shelterAdvice = "Basement or reinforced interior room";
    return {
      primary: { label: "Minimum Safe Distance", value: formatNumber(Math.round(safeDistanceMiles * 10) / 10) + " miles" },
      details: [
        { label: "Safe Distance (feet)", value: formatNumber(Math.round(safeDistanceFt)) + " ft" },
        { label: "Max Wind Speed", value: formatNumber(maxWinds) + " mph" },
        { label: "Debris Throw Radius", value: formatNumber(Math.round(debrisRadius)) + " yards" },
        { label: "Warning Time Needed", value: formatNumber(Math.round(warningTimeMin)) + " min" },
        { label: "Shelter Recommendation", value: shelterAdvice }
      ]
    };
  }`,
  [
    "Q: What is the Enhanced Fujita Scale?||A: The EF Scale rates tornadoes from EF0 (weakest, 65-85 mph) to EF5 (most violent, 200+ mph) based on observed damage and estimated wind speeds.",
    "Q: How far can tornado debris be thrown?||A: Strong tornadoes (EF3+) can loft debris miles from the tornado. Personal items have been found over 200 miles from their origin.",
    "Q: What is the safest place during a tornado?||A: An underground shelter or basement offers the best protection. Without one, an interior room on the lowest floor away from windows is recommended."
  ],
  `Safe Distance = (Speed x Time / 60) + (Debris Radius / 1760) + 0.5 miles\nDebris Radius = Width x (1 + EF Rating x 0.5)`,
  ["wind-chill-calculator", "hurricane-preparedness-cost-calculator", "wildfire-risk-calculator"]
);

add(
  "hurricane-preparedness-cost-calculator",
  "Hurricane Preparedness Cost Calculator",
  "Estimate the cost of hurricane preparation including shutters, supplies, generator, and evacuation expenses by storm category.",
  "Finance",
  "finance",
  "$",
  ["hurricane cost", "hurricane preparedness", "storm preparation", "hurricane supplies", "evacuation cost"],
  [
    '{ name: "category", label: "Hurricane Category", type: "select", options: [{ value: "1", label: "Category 1 (74-95 mph)" }, { value: "2", label: "Category 2 (96-110 mph)" }, { value: "3", label: "Category 3 (111-129 mph)" }, { value: "4", label: "Category 4 (130-156 mph)" }, { value: "5", label: "Category 5 (157+ mph)" }], defaultValue: "2" }',
    '{ name: "homeSize", label: "Home Size (sq ft)", type: "number", min: 500, max: 10000, defaultValue: 1800 }',
    '{ name: "householdSize", label: "Household Members", type: "number", min: 1, max: 10, defaultValue: 4 }',
    '{ name: "hasGenerator", label: "Own a Generator", type: "select", options: [{ value: "0", label: "No" }, { value: "1", label: "Yes" }], defaultValue: "0" }'
  ],
  `(inputs) => {
    const category = inputs.category as number;
    const homeSize = inputs.homeSize as number;
    const householdSize = inputs.householdSize as number;
    const hasGenerator = inputs.hasGenerator as number;
    const shutterCost = homeSize * [0.5, 1.0, 2.0, 3.5, 5.0][category - 1];
    const suppliesCost = householdSize * [75, 120, 200, 300, 400][category - 1];
    const generatorCost = hasGenerator === 1 ? 0 : (category >= 3 ? 2500 : category >= 2 ? 1500 : 0);
    const fuelCost = category * 75;
    const evacuationCost = category >= 3 ? householdSize * 250 : 0;
    const totalCost = shutterCost + suppliesCost + generatorCost + fuelCost + evacuationCost;
    const daysPrep = [1, 2, 3, 5, 7][category - 1];
    return {
      primary: { label: "Total Preparation Cost", value: "$" + formatNumber(Math.round(totalCost)) },
      details: [
        { label: "Storm Shutters/Protection", value: "$" + formatNumber(Math.round(shutterCost)) },
        { label: "Emergency Supplies", value: "$" + formatNumber(Math.round(suppliesCost)) },
        { label: "Generator", value: hasGenerator === 1 ? "Already owned" : "$" + formatNumber(generatorCost) },
        { label: "Fuel Costs", value: "$" + formatNumber(fuelCost) },
        { label: "Evacuation Costs", value: evacuationCost > 0 ? "$" + formatNumber(evacuationCost) : "Not needed" },
        { label: "Recommended Prep Days", value: formatNumber(daysPrep) + " days" }
      ]
    };
  }`,
  [
    "Q: What supplies do I need for a hurricane?||A: Essential supplies include water (1 gallon per person per day for 7 days), non-perishable food, medications, flashlights, batteries, first aid kit, and important documents.",
    "Q: When should I evacuate for a hurricane?||A: Evacuate when ordered by local authorities, typically for Category 3+ hurricanes in coastal areas. Leave early to avoid traffic congestion.",
    "Q: How much does a whole-house generator cost?||A: Portable generators cost $500-$2,000 while standby whole-house generators range from $2,000-$15,000 installed."
  ],
  `Total = Shutters + Supplies + Generator + Fuel + Evacuation\nShutters = Home Size x Category Multiplier\nSupplies = Household Size x Category Rate`,
  ["hurricane-prep-cost-calculator", "flood-risk-assessment-calculator", "tornado-safety-distance-calculator"]
);

add(
  "lightning-strike-probability-calculator",
  "Lightning Strike Probability Calculator",
  "Estimate the probability of a lightning strike based on location flash density, elevation, structure height, and exposure time.",
  "Science",
  "science",
  "A",
  ["lightning probability", "lightning strike", "thunderstorm risk", "lightning safety", "flash density"],
  [
    '{ name: "flashDensity", label: "Local Flash Density (strikes/km²/year)", type: "number", min: 0.1, max: 50, defaultValue: 6 }',
    '{ name: "structureHeight", label: "Structure Height (ft)", type: "number", min: 5, max: 2000, defaultValue: 30 }',
    '{ name: "structureArea", label: "Structure Footprint (sq ft)", type: "number", min: 100, max: 50000, defaultValue: 2000 }',
    '{ name: "exposureHours", label: "Annual Outdoor Exposure (hours)", type: "number", min: 0, max: 8760, defaultValue: 500 }'
  ],
  `(inputs) => {
    const flashDensity = inputs.flashDensity as number;
    const structureHeight = inputs.structureHeight as number;
    const structureArea = inputs.structureArea as number;
    const exposureHours = inputs.exposureHours as number;
    const heightMeters = structureHeight * 0.3048;
    const areaSqM = structureArea * 0.0929;
    const effectiveArea = areaSqM + 9 * Math.PI * heightMeters * heightMeters;
    const effectiveAreaKm2 = effectiveArea / 1000000;
    const annualStrikeProbStructure = 1 - Math.exp(-flashDensity * effectiveAreaKm2);
    const personalExposureFraction = exposureHours / 8760;
    const personalBodyArea = 0.0000001;
    const personalRisk = flashDensity * personalBodyArea * personalExposureFraction;
    const yearsForFiftyPercent = Math.log(2) / Math.max(annualStrikeProbStructure, 0.0001);
    return {
      primary: { label: "Annual Structure Strike Probability", value: formatNumber(Math.round(annualStrikeProbStructure * 10000) / 100) + "%" },
      details: [
        { label: "Effective Collection Area", value: formatNumber(Math.round(effectiveArea)) + " m²" },
        { label: "Personal Annual Risk", value: "1 in " + formatNumber(Math.round(1 / Math.max(personalRisk, 0.0000001))) },
        { label: "Years for 50% Chance (Structure)", value: formatNumber(Math.round(yearsForFiftyPercent)) + " years" },
        { label: "Local Flash Density", value: formatNumber(flashDensity) + " strikes/km²/year" }
      ]
    };
  }`,
  [
    "Q: What are the odds of being struck by lightning?||A: The annual risk of being struck by lightning in the US is about 1 in 1,222,000. Over a lifetime (80 years), it rises to about 1 in 15,300.",
    "Q: What is flash density?||A: Flash density measures the number of lightning strikes per square kilometer per year. Florida has the highest in the US at 12-15 strikes/km²/year.",
    "Q: Does a lightning rod prevent strikes?||A: Lightning rods do not prevent strikes but safely conduct the electrical charge to the ground, protecting the structure from fire and damage."
  ],
  `Effective Area = Structure Area + 9π x Height²\nAnnual Probability = 1 - e^(-Flash Density x Effective Area in km²)\nPersonal Risk = Flash Density x Body Area x (Exposure Hours / 8760)`,
  ["tornado-safety-distance-calculator", "flood-risk-assessment-calculator", "lightning-rod-calculator"]
);

add(
  "snow-load-calculator",
  "Snow Load Calculator",
  "Calculate the weight of accumulated snow on a roof based on snow depth, density, roof area, and pitch for structural safety assessment.",
  "Science",
  "science",
  "A",
  ["snow load", "roof snow weight", "snow density", "structural load", "roof collapse prevention"],
  [
    '{ name: "snowDepth", label: "Snow Depth (inches)", type: "number", min: 1, max: 120, defaultValue: 18 }',
    '{ name: "snowType", label: "Snow Type", type: "select", options: [{ value: "1", label: "Fresh Powder (5 lb/ft³)" }, { value: "2", label: "Settled Snow (15 lb/ft³)" }, { value: "3", label: "Packed Snow (25 lb/ft³)" }, { value: "4", label: "Ice/Sleet (50 lb/ft³)" }], defaultValue: "2" }',
    '{ name: "roofArea", label: "Roof Area (sq ft)", type: "number", min: 100, max: 20000, defaultValue: 2000 }',
    '{ name: "roofPitch", label: "Roof Pitch (degrees)", type: "number", min: 0, max: 60, defaultValue: 25 }'
  ],
  `(inputs) => {
    const snowDepth = inputs.snowDepth as number;
    const snowType = inputs.snowType as number;
    const roofArea = inputs.roofArea as number;
    const roofPitch = inputs.roofPitch as number;
    const densityPCF = [5, 15, 25, 50][snowType - 1];
    const pitchFactor = Math.cos(roofPitch * Math.PI / 180);
    const depthFt = snowDepth / 12;
    const psfLoad = depthFt * densityPCF * pitchFactor;
    const totalWeight = psfLoad * roofArea;
    const totalTons = totalWeight / 2000;
    let riskLevel = "Safe";
    if (psfLoad >= 60) riskLevel = "Critical - Immediate Action Required";
    else if (psfLoad >= 40) riskLevel = "High - Consider Snow Removal";
    else if (psfLoad >= 25) riskLevel = "Moderate - Monitor Closely";
    const typicalRoofCapacity = 40;
    const percentCapacity = (psfLoad / typicalRoofCapacity) * 100;
    return {
      primary: { label: "Snow Load", value: formatNumber(Math.round(psfLoad * 10) / 10) + " psf" },
      details: [
        { label: "Total Weight on Roof", value: formatNumber(Math.round(totalWeight)) + " lbs (" + formatNumber(Math.round(totalTons * 10) / 10) + " tons)" },
        { label: "Snow Density", value: formatNumber(densityPCF) + " lb/ft³" },
        { label: "Pitch Reduction Factor", value: formatNumber(Math.round(pitchFactor * 100) / 100) },
        { label: "Risk Level", value: riskLevel },
        { label: "% of Typical Roof Capacity", value: formatNumber(Math.round(percentCapacity)) + "%" }
      ]
    };
  }`,
  [
    "Q: How much does snow weigh on a roof?||A: Fresh powder weighs about 5 lbs per cubic foot while packed snow can weigh 25+ lbs. One foot of packed snow on a 2,000 sq ft roof is over 50,000 lbs.",
    "Q: When should I remove snow from my roof?||A: Most residential roofs can handle 20-40 psf. Consider removal when loads approach 30 psf or if you see signs of structural stress like cracking or sagging.",
    "Q: Does roof pitch affect snow load?||A: Yes, steeper roofs shed snow more easily. Roofs above 60 degrees typically shed most snow naturally, reducing the effective load."
  ],
  `Load (psf) = (Snow Depth / 12) x Density x cos(Pitch)\nTotal Weight = Load x Roof Area\n% Capacity = Load / 40 psf x 100`,
  ["snow-load-roof-calculator", "ice-dam-prevention-calculator", "frost-depth-calculator"]
);

add(
  "ice-dam-risk-calculator",
  "Ice Dam Risk Calculator",
  "Evaluate ice dam risk on your roof based on insulation levels, attic temperature, roof slope, and outdoor conditions.",
  "Everyday",
  "everyday",
  "~",
  ["ice dam", "roof ice", "ice dam prevention", "attic insulation", "roof ventilation"],
  [
    '{ name: "atticInsulation", label: "Attic Insulation R-Value", type: "number", min: 0, max: 60, defaultValue: 20 }',
    '{ name: "outsideTemp", label: "Outside Temperature (°F)", type: "number", min: -30, max: 35, defaultValue: 20 }',
    '{ name: "roofSlope", label: "Roof Slope (degrees)", type: "number", min: 5, max: 60, defaultValue: 30 }',
    '{ name: "snowDepth", label: "Snow on Roof (inches)", type: "number", min: 1, max: 48, defaultValue: 12 }',
    '{ name: "hasVentilation", label: "Adequate Roof Ventilation", type: "select", options: [{ value: "1", label: "Yes" }, { value: "0", label: "No" }], defaultValue: "1" }'
  ],
  `(inputs) => {
    const atticInsulation = inputs.atticInsulation as number;
    const outsideTemp = inputs.outsideTemp as number;
    const roofSlope = inputs.roofSlope as number;
    const snowDepth = inputs.snowDepth as number;
    const hasVentilation = inputs.hasVentilation as number;
    const insulationRisk = Math.max(0, 100 - atticInsulation * 2.5);
    const tempRisk = outsideTemp < 10 ? 20 : outsideTemp < 25 ? 40 : outsideTemp <= 32 ? 60 : 10;
    const snowRisk = Math.min(snowDepth * 3, 50);
    const slopeReduction = Math.min(roofSlope * 0.3, 15);
    const ventReduction = hasVentilation === 1 ? 15 : 0;
    const riskScore = Math.min(Math.max(insulationRisk * 0.35 + tempRisk * 0.25 + snowRisk * 0.25 - slopeReduction - ventReduction, 0), 100);
    let riskLevel = "Low";
    if (riskScore >= 65) riskLevel = "High";
    else if (riskScore >= 40) riskLevel = "Moderate";
    const recommendedR = 49;
    const insulationGap = Math.max(0, recommendedR - atticInsulation);
    return {
      primary: { label: "Ice Dam Risk", value: riskLevel + " (" + formatNumber(Math.round(riskScore)) + "/100)" },
      details: [
        { label: "Insulation Risk Factor", value: formatNumber(Math.round(insulationRisk)) + "/100" },
        { label: "Temperature Risk Factor", value: formatNumber(tempRisk) + "/100" },
        { label: "Snow Depth Risk", value: formatNumber(Math.round(snowRisk)) + "/50" },
        { label: "Current R-Value", value: "R-" + formatNumber(atticInsulation) },
        { label: "Insulation Upgrade Needed", value: insulationGap > 0 ? "Add R-" + formatNumber(insulationGap) : "Adequate" }
      ]
    };
  }`,
  [
    "Q: What causes ice dams?||A: Ice dams form when heat escaping through the roof melts snow, which refreezes at the colder roof edge, creating a dam that traps water and can cause leaks.",
    "Q: How do I prevent ice dams?||A: The best prevention is proper attic insulation (R-49+), adequate roof ventilation, and sealing air leaks from the living space into the attic.",
    "Q: Can ice dams damage my roof?||A: Yes, ice dams can lift shingles, damage gutters, and force water under roofing materials, causing leaks, mold, and structural damage inside the home."
  ],
  `Risk = (Insulation Risk x 0.35) + (Temp Risk x 0.25) + (Snow Risk x 0.25) - Slope Reduction - Ventilation Reduction\nInsulation Risk = max(0, 100 - R-Value x 2.5)`,
  ["ice-dam-prevention-calculator", "snow-load-calculator", "frost-depth-calculator"]
);

add(
  "frost-depth-calculator",
  "Frost Depth Calculator",
  "Estimate the frost penetration depth in soil based on freezing degree days, soil type, and moisture content for foundation and pipe planning.",
  "Science",
  "science",
  "A",
  ["frost depth", "frost line", "freezing depth", "frost penetration", "footing depth"],
  [
    '{ name: "freezingDegreeDays", label: "Freezing Degree Days (°F-days)", type: "number", min: 10, max: 5000, defaultValue: 500 }',
    '{ name: "soilType", label: "Soil Type", type: "select", options: [{ value: "1", label: "Sand/Gravel" }, { value: "2", label: "Silt/Loam" }, { value: "3", label: "Clay" }, { value: "4", label: "Peat/Organic" }], defaultValue: "2" }',
    '{ name: "moistureContent", label: "Soil Moisture (%)", type: "number", min: 5, max: 80, defaultValue: 25 }',
    '{ name: "snowCover", label: "Snow Cover Depth (inches)", type: "number", min: 0, max: 48, defaultValue: 6 }'
  ],
  `(inputs) => {
    const freezingDegreeDays = inputs.freezingDegreeDays as number;
    const soilType = inputs.soilType as number;
    const moistureContent = inputs.moistureContent as number;
    const snowCover = inputs.snowCover as number;
    const thermalDiffusivity = [1.2, 0.9, 0.65, 0.5][soilType - 1];
    const moistureFactor = 1 - (moistureContent / 200);
    const snowReduction = 1 - Math.min(snowCover * 0.02, 0.6);
    const frostDepthInches = 2.4 * Math.sqrt(freezingDegreeDays * thermalDiffusivity) * moistureFactor * snowReduction;
    const frostDepthFeet = frostDepthInches / 12;
    const recommendedFooting = Math.ceil((frostDepthInches + 6) / 6) * 6;
    const pipeDepthInches = frostDepthInches + 12;
    const soilNames = ["Sand/Gravel", "Silt/Loam", "Clay", "Peat/Organic"];
    return {
      primary: { label: "Estimated Frost Depth", value: formatNumber(Math.round(frostDepthInches)) + " inches (" + formatNumber(Math.round(frostDepthFeet * 10) / 10) + " ft)" },
      details: [
        { label: "Soil Type", value: soilNames[soilType - 1] },
        { label: "Thermal Diffusivity Factor", value: formatNumber(thermalDiffusivity) },
        { label: "Snow Cover Reduction", value: formatNumber(Math.round((1 - snowReduction) * 100)) + "%" },
        { label: "Recommended Footing Depth", value: formatNumber(recommendedFooting) + " inches" },
        { label: "Recommended Pipe Depth", value: formatNumber(Math.round(pipeDepthInches)) + " inches" }
      ]
    };
  }`,
  [
    "Q: What is frost depth and why does it matter?||A: Frost depth is how deep the ground freezes in winter. Building foundations and water pipes must be placed below the frost line to prevent heaving and freezing.",
    "Q: What are freezing degree days?||A: Freezing degree days measure cumulative cold. For each day the average temperature is below 32°F, the difference is added. Example: a day averaging 22°F adds 10 FDD.",
    "Q: How does snow cover affect frost depth?||A: Snow acts as insulation, reducing frost penetration. A consistent 12-inch snow cover can reduce frost depth by 20-40% compared to bare ground."
  ],
  `Frost Depth = 2.4 x sqrt(FDD x Thermal Diffusivity) x Moisture Factor x Snow Reduction\nMoisture Factor = 1 - (Moisture% / 200)\nSnow Reduction = 1 - min(Snow x 0.02, 0.6)`,
  ["snow-load-calculator", "ice-dam-risk-calculator", "growing-degree-days-calculator"]
);

add(
  "growing-degree-days-calculator",
  "Growing Degree Days Calculator",
  "Calculate accumulated growing degree days for crop planning based on daily temperatures and base temperature for your crop type.",
  "Science",
  "science",
  "A",
  ["growing degree days", "gdd calculator", "crop heat units", "planting calculator", "agriculture degree days"],
  [
    '{ name: "avgHighTemp", label: "Average Daily High (°F)", type: "number", min: 30, max: 120, defaultValue: 78 }',
    '{ name: "avgLowTemp", label: "Average Daily Low (°F)", type: "number", min: 10, max: 90, defaultValue: 55 }',
    '{ name: "baseTemp", label: "Base Temperature (°F)", type: "number", min: 32, max: 65, defaultValue: 50 }',
    '{ name: "daysInPeriod", label: "Growing Period (days)", type: "number", min: 1, max: 365, defaultValue: 120 }'
  ],
  `(inputs) => {
    const avgHighTemp = inputs.avgHighTemp as number;
    const avgLowTemp = inputs.avgLowTemp as number;
    const baseTemp = inputs.baseTemp as number;
    const daysInPeriod = inputs.daysInPeriod as number;
    const dailyAvg = (avgHighTemp + avgLowTemp) / 2;
    const dailyGDD = Math.max(dailyAvg - baseTemp, 0);
    const totalGDD = dailyGDD * daysInPeriod;
    const cornMaturity = 2700;
    const tomatoMaturity = 1400;
    const wheatMaturity = 2000;
    const cornDays = dailyGDD > 0 ? Math.round(cornMaturity / dailyGDD) : 0;
    const tomatoDays = dailyGDD > 0 ? Math.round(tomatoMaturity / dailyGDD) : 0;
    const wheatDays = dailyGDD > 0 ? Math.round(wheatMaturity / dailyGDD) : 0;
    return {
      primary: { label: "Total GDD Accumulated", value: formatNumber(Math.round(totalGDD)) + " GDD" },
      details: [
        { label: "Daily GDD", value: formatNumber(Math.round(dailyGDD * 10) / 10) },
        { label: "Daily Average Temperature", value: formatNumber(Math.round(dailyAvg * 10) / 10) + " °F" },
        { label: "Corn Maturity (2700 GDD)", value: cornDays > 0 ? formatNumber(cornDays) + " days" : "Insufficient heat" },
        { label: "Tomato Maturity (1400 GDD)", value: tomatoDays > 0 ? formatNumber(tomatoDays) + " days" : "Insufficient heat" },
        { label: "Wheat Maturity (2000 GDD)", value: wheatDays > 0 ? formatNumber(wheatDays) + " days" : "Insufficient heat" }
      ]
    };
  }`,
  [
    "Q: What are Growing Degree Days?||A: GDD measure accumulated heat above a base temperature that drives plant growth. Each day contributes the difference between the average temperature and the base temperature (if positive).",
    "Q: What base temperature should I use?||A: Common bases are 50°F for corn, wheat, and most warm-season crops, and 40°F for cool-season crops like peas and lettuce.",
    "Q: How are GDD used in agriculture?||A: GDD help predict crop maturity dates, optimal planting windows, pest emergence, and harvest timing more accurately than calendar dates alone."
  ],
  `Daily GDD = max((High + Low) / 2 - Base Temp, 0)\nTotal GDD = Daily GDD x Number of Days\nDays to Maturity = Required GDD / Daily GDD`,
  ["drought-severity-index-calculator", "evapotranspiration-rate-calculator", "frost-depth-calculator"]
);

add(
  "evapotranspiration-rate-calculator",
  "Evapotranspiration Rate Calculator",
  "Estimate daily evapotranspiration rate for irrigation planning using temperature, humidity, wind speed, and solar radiation data.",
  "Science",
  "science",
  "A",
  ["evapotranspiration", "ET rate", "irrigation water loss", "crop water use", "water evaporation rate"],
  [
    '{ name: "avgTemp", label: "Average Temperature (°F)", type: "number", min: 32, max: 120, defaultValue: 75 }',
    '{ name: "humidity", label: "Relative Humidity (%)", type: "number", min: 5, max: 100, defaultValue: 50 }',
    '{ name: "windSpeed", label: "Wind Speed (mph)", type: "number", min: 0, max: 40, defaultValue: 8 }',
    '{ name: "solarHours", label: "Daily Sunshine Hours", type: "number", min: 0, max: 16, defaultValue: 10 }',
    '{ name: "cropCoeff", label: "Crop Coefficient (Kc)", type: "number", min: 0.2, max: 1.5, defaultValue: 1.0 }'
  ],
  `(inputs) => {
    const avgTemp = inputs.avgTemp as number;
    const humidity = inputs.humidity as number;
    const windSpeed = inputs.windSpeed as number;
    const solarHours = inputs.solarHours as number;
    const cropCoeff = inputs.cropCoeff as number;
    const tempC = (avgTemp - 32) * 5 / 9;
    const satVaporPressure = 0.6108 * Math.exp((17.27 * tempC) / (tempC + 237.3));
    const actualVaporPressure = satVaporPressure * (humidity / 100);
    const vaporDeficit = satVaporPressure - actualVaporPressure;
    const solarRadiation = solarHours * 2.5;
    const windMs = windSpeed * 0.447;
    const etRef = (0.408 * solarRadiation + 0.063 * (tempC + 273) * windMs * vaporDeficit) / (1 + 0.34 * windMs);
    const etCrop = etRef * cropCoeff;
    const inchesPerDay = etCrop / 25.4;
    const weeklyInches = inchesPerDay * 7;
    const monthlyGallonsPer1000sqft = inchesPerDay * 30 * 623;
    return {
      primary: { label: "Daily ET Rate", value: formatNumber(Math.round(inchesPerDay * 100) / 100) + " inches/day" },
      details: [
        { label: "Reference ET (ETo)", value: formatNumber(Math.round(etRef * 100) / 100) + " mm/day" },
        { label: "Crop ET (ETc)", value: formatNumber(Math.round(etCrop * 100) / 100) + " mm/day" },
        { label: "Weekly Water Need", value: formatNumber(Math.round(weeklyInches * 100) / 100) + " inches" },
        { label: "Monthly per 1000 sq ft", value: formatNumber(Math.round(monthlyGallonsPer1000sqft)) + " gallons" },
        { label: "Vapor Pressure Deficit", value: formatNumber(Math.round(vaporDeficit * 100) / 100) + " kPa" }
      ]
    };
  }`,
  [
    "Q: What is evapotranspiration?||A: Evapotranspiration (ET) is the combined water loss from soil evaporation and plant transpiration. It determines how much water crops and landscapes need.",
    "Q: What is a crop coefficient (Kc)?||A: The crop coefficient adjusts reference ET for specific crops. Typical values: turf grass 0.8, corn 1.2, vegetables 0.7-1.0, trees 0.5-0.9.",
    "Q: How does ET affect irrigation scheduling?||A: Irrigation should replace water lost to ET. If daily ET is 0.25 inches, you need 0.25 inches of irrigation or rain to maintain soil moisture."
  ],
  `ETo = (0.408 x Solar Radiation + 0.063 x (Temp+273) x Wind x VPD) / (1 + 0.34 x Wind)\nETc = ETo x Crop Coefficient\nVPD = Saturation VP - Actual VP`,
  ["growing-degree-days-calculator", "drought-severity-index-calculator", "rainfall-collection-calculator"]
);

add(
  "soil-erosion-rate-calculator",
  "Soil Erosion Rate Calculator",
  "Estimate annual soil loss using the Universal Soil Loss Equation based on rainfall, soil type, slope, cover, and conservation practices.",
  "Science",
  "science",
  "A",
  ["soil erosion", "USLE calculator", "soil loss", "erosion rate", "topsoil loss"],
  [
    '{ name: "rainfallFactor", label: "Rainfall Erosivity (R factor)", type: "number", min: 10, max: 700, defaultValue: 200 }',
    '{ name: "soilErodibility", label: "Soil Erodibility (K factor)", type: "number", min: 0.01, max: 0.70, defaultValue: 0.30 }',
    '{ name: "slopeLength", label: "Slope Length (ft)", type: "number", min: 10, max: 1000, defaultValue: 200 }',
    '{ name: "slopePercent", label: "Slope Steepness (%)", type: "number", min: 0.5, max: 50, defaultValue: 5 }',
    '{ name: "coverFactor", label: "Cover Management (C factor)", type: "number", min: 0.001, max: 1.0, defaultValue: 0.15 }'
  ],
  `(inputs) => {
    const R = inputs.rainfallFactor as number;
    const K = inputs.soilErodibility as number;
    const slopeLength = inputs.slopeLength as number;
    const slopePercent = inputs.slopePercent as number;
    const C = inputs.coverFactor as number;
    const LS = Math.pow(slopeLength / 72.6, 0.5) * (0.065 + 0.045 * slopePercent + 0.0065 * slopePercent * slopePercent);
    const P = 1.0;
    const soilLoss = R * K * LS * C * P;
    const soilLossMetric = soilLoss * 0.224;
    let toleranceLevel = "Within Tolerance";
    if (soilLoss > 10) toleranceLevel = "Severe - Immediate action needed";
    else if (soilLoss > 5) toleranceLevel = "Above Tolerance - Conservation needed";
    else if (soilLoss > 3) toleranceLevel = "Near Tolerance Limit";
    const yearsToLoseInch = soilLoss > 0 ? Math.round(150 / soilLoss) : 999;
    const percentReductionWithCover = Math.round((1 - 0.003 / C) * 100);
    return {
      primary: { label: "Annual Soil Loss", value: formatNumber(Math.round(soilLoss * 100) / 100) + " tons/acre/year" },
      details: [
        { label: "Soil Loss (metric)", value: formatNumber(Math.round(soilLossMetric * 100) / 100) + " tonnes/ha/year" },
        { label: "LS Factor (Topography)", value: formatNumber(Math.round(LS * 100) / 100) },
        { label: "Erosion Status", value: toleranceLevel },
        { label: "Years to Lose 1 Inch Topsoil", value: formatNumber(yearsToLoseInch) + " years" },
        { label: "Soil Tolerance (T value)", value: "5 tons/acre/year" }
      ]
    };
  }`,
  [
    "Q: What is the Universal Soil Loss Equation?||A: The USLE (A = R x K x LS x C x P) predicts average annual soil erosion from rainfall based on climate, soil, topography, land cover, and conservation practices.",
    "Q: What is soil tolerance (T value)?||A: The T value is the maximum rate of soil erosion that permits sustained crop production, typically 3-5 tons per acre per year for most US agricultural soils.",
    "Q: How can I reduce soil erosion?||A: Key practices include maintaining vegetative cover, contour farming, terracing, no-till agriculture, cover crops, and riparian buffer strips."
  ],
  `A = R x K x LS x C x P (Universal Soil Loss Equation)\nLS = (Length/72.6)^0.5 x (0.065 + 0.045s + 0.0065s²)\nTolerance (T) = 5 tons/acre/year`,
  ["deforestation-impact-calculator", "drought-severity-index-calculator", "evapotranspiration-rate-calculator"]
);

add(
  "compost-volume-calculator",
  "Compost Volume Calculator",
  "Calculate the right compost bin dimensions and estimate composting time based on material volume, green-to-brown ratio, and turning frequency.",
  "Everyday",
  "everyday",
  "~",
  ["compost calculator", "compost bin dimensions", "composting time", "green brown ratio", "compost pile"],
  [
    '{ name: "greenLbs", label: "Green Material (lbs/week)", type: "number", min: 1, max: 200, defaultValue: 20 }',
    '{ name: "brownLbs", label: "Brown Material (lbs/week)", type: "number", min: 1, max: 200, defaultValue: 30 }',
    '{ name: "turningFreq", label: "Turning Frequency", type: "select", options: [{ value: "1", label: "Weekly" }, { value: "2", label: "Bi-weekly" }, { value: "3", label: "Monthly" }, { value: "4", label: "Rarely" }], defaultValue: "2" }',
    '{ name: "weeks", label: "Collection Period (weeks)", type: "number", min: 4, max: 52, defaultValue: 12 }'
  ],
  `(inputs) => {
    const greenLbs = inputs.greenLbs as number;
    const brownLbs = inputs.brownLbs as number;
    const turningFreq = inputs.turningFreq as number;
    const weeks = inputs.weeks as number;
    const totalLbs = (greenLbs + brownLbs) * weeks;
    const volumeCuFt = totalLbs / 25;
    const ratio = brownLbs / Math.max(greenLbs, 0.1);
    const turningDays = [60, 90, 150, 240][turningFreq - 1];
    const ratioAdjust = ratio >= 2 && ratio <= 4 ? 1 : ratio < 2 ? 1.3 : 1.2;
    const compostDays = Math.round(turningDays * ratioAdjust);
    const binSideFt = Math.pow(volumeCuFt, 1 / 3);
    const roundedSide = Math.ceil(binSideFt * 2) / 2;
    const idealRatio = "2:1 to 4:1";
    let ratioStatus = "Optimal";
    if (ratio < 2) ratioStatus = "Too much green - add browns";
    else if (ratio > 4) ratioStatus = "Too much brown - add greens";
    return {
      primary: { label: "Bin Volume Needed", value: formatNumber(Math.round(volumeCuFt)) + " cubic feet" },
      details: [
        { label: "Recommended Bin Size", value: formatNumber(roundedSide) + " x " + formatNumber(roundedSide) + " x " + formatNumber(roundedSide) + " ft" },
        { label: "Brown:Green Ratio", value: formatNumber(Math.round(ratio * 10) / 10) + ":1" },
        { label: "Ratio Status", value: ratioStatus + " (ideal " + idealRatio + ")" },
        { label: "Estimated Composting Time", value: formatNumber(compostDays) + " days" },
        { label: "Total Material Weight", value: formatNumber(totalLbs) + " lbs" }
      ]
    };
  }`,
  [
    "Q: What is the ideal green-to-brown ratio for composting?||A: The ideal carbon-to-nitrogen ratio is 25-30:1, which roughly translates to 2-4 parts brown material to 1 part green material by weight.",
    "Q: How often should I turn my compost?||A: Turning weekly produces compost fastest (6-8 weeks). Bi-weekly turning takes about 3 months. Passive composting without turning can take 6-12 months.",
    "Q: What size compost bin do I need?||A: A minimum of 3x3x3 feet (27 cubic feet) is recommended for efficient composting, as smaller piles cannot generate enough heat for rapid decomposition."
  ],
  `Volume = Total Weight / 25 lbs per cu ft\nBin Side = cube root of Volume\nCompost Time = Base Days x Ratio Adjustment\nBrown:Green Ratio = Brown lbs / Green lbs`,
  ["compost-bin-size-calculator", "recycling-savings-calculator", "carbon-footprint-offset-calculator"]
);

add(
  "wind-chill-extended-calculator",
  "Wind Chill Extended Calculator",
  "Calculate wind chill temperature with frostbite risk assessment and exposure time limits for cold weather safety planning.",
  "Science",
  "science",
  "A",
  ["wind chill extended", "frostbite risk", "cold exposure", "hypothermia risk", "windchill frostbite time"],
  [
    '{ name: "airTemp", label: "Air Temperature (°F)", type: "number", min: -60, max: 50, defaultValue: 10 }',
    '{ name: "windSpeed", label: "Wind Speed (mph)", type: "number", min: 3, max: 80, defaultValue: 25 }',
    '{ name: "exposureMinutes", label: "Exposure Duration (minutes)", type: "number", min: 1, max: 480, defaultValue: 30 }',
    '{ name: "skinCovered", label: "Skin Coverage", type: "select", options: [{ value: "1", label: "Face & hands exposed" }, { value: "2", label: "Only face exposed" }, { value: "3", label: "Fully covered" }], defaultValue: "1" }'
  ],
  `(inputs) => {
    const airTemp = inputs.airTemp as number;
    const windSpeed = inputs.windSpeed as number;
    const exposureMinutes = inputs.exposureMinutes as number;
    const skinCovered = inputs.skinCovered as number;
    const windChill = 35.74 + 0.6215 * airTemp - 35.75 * Math.pow(windSpeed, 0.16) + 0.4275 * airTemp * Math.pow(windSpeed, 0.16);
    const effectiveWC = Math.round(windChill);
    let frostbiteTime = "No immediate risk";
    if (effectiveWC <= -60) frostbiteTime = "Under 5 minutes";
    else if (effectiveWC <= -40) frostbiteTime = "5-10 minutes";
    else if (effectiveWC <= -20) frostbiteTime = "10-30 minutes";
    else if (effectiveWC <= 0) frostbiteTime = "30-60 minutes";
    const coverageMultiplier = [1, 1.5, 3][skinCovered - 1];
    const safeExposureBase = effectiveWC <= -40 ? 5 : effectiveWC <= -20 ? 15 : effectiveWC <= 0 ? 30 : effectiveWC <= 20 ? 60 : 120;
    const safeExposure = Math.round(safeExposureBase * coverageMultiplier);
    const exposureRisk = exposureMinutes > safeExposure ? "Exceeds safe limit" : "Within safe range";
    let dangerLevel = "Low";
    if (effectiveWC <= -40) dangerLevel = "Extreme Danger";
    else if (effectiveWC <= -20) dangerLevel = "High Danger";
    else if (effectiveWC <= 0) dangerLevel = "Moderate Danger";
    else if (effectiveWC <= 20) dangerLevel = "Low Danger";
    return {
      primary: { label: "Wind Chill Temperature", value: formatNumber(effectiveWC) + " °F" },
      details: [
        { label: "Danger Level", value: dangerLevel },
        { label: "Frostbite Risk", value: frostbiteTime },
        { label: "Safe Exposure Time", value: formatNumber(safeExposure) + " min" },
        { label: "Your Exposure", value: exposureRisk + " (" + formatNumber(exposureMinutes) + " min)" },
        { label: "Actual Air Temperature", value: formatNumber(airTemp) + " °F" }
      ]
    };
  }`,
  [
    "Q: How is wind chill calculated?||A: The NWS wind chill formula uses air temperature and wind speed: WC = 35.74 + 0.6215T - 35.75V^0.16 + 0.4275TV^0.16, where T is temperature (°F) and V is wind speed (mph).",
    "Q: At what wind chill does frostbite occur?||A: Frostbite can occur in as little as 5 minutes when wind chill drops below -40°F. At -20°F wind chill, frostbite risk begins within 30 minutes on exposed skin.",
    "Q: Does wind chill affect objects like car engines?||A: No. Wind chill only affects warm-blooded creatures. Objects cool faster in wind but cannot cool below the actual air temperature."
  ],
  `Wind Chill = 35.74 + 0.6215T - 35.75V^0.16 + 0.4275TV^0.16\nSafe Exposure = Base Time x Coverage Multiplier\nFrostbite risk increases rapidly below -20°F wind chill`,
  ["wind-chill-calculator", "heat-index-calculator", "frost-depth-calculator"]
);

add(
  "heat-index-activity-calculator",
  "Heat Index Activity Calculator",
  "Calculate the heat index with activity-specific safety guidelines including hydration needs, rest intervals, and heat illness risk levels.",
  "Health",
  "health",
  "H",
  ["heat index activity", "heat safety", "heat illness prevention", "hydration calculator", "heat stress"],
  [
    '{ name: "temperature", label: "Temperature (°F)", type: "number", min: 75, max: 130, defaultValue: 92 }',
    '{ name: "humidity", label: "Relative Humidity (%)", type: "number", min: 10, max: 100, defaultValue: 60 }',
    '{ name: "activityType", label: "Activity Type", type: "select", options: [{ value: "1", label: "Sedentary / Office" }, { value: "2", label: "Light Exercise" }, { value: "3", label: "Moderate Exercise" }, { value: "4", label: "Heavy Labor / Sports" }], defaultValue: "3" }',
    '{ name: "duration", label: "Activity Duration (minutes)", type: "number", min: 10, max: 480, defaultValue: 60 }'
  ],
  `(inputs) => {
    const temperature = inputs.temperature as number;
    const humidity = inputs.humidity as number;
    const activityType = inputs.activityType as number;
    const duration = inputs.duration as number;
    const T = temperature;
    const R = humidity;
    const HI = -42.379 + 2.04901523 * T + 10.14333127 * R - 0.22475541 * T * R - 0.00683783 * T * T - 0.05481717 * R * R + 0.00122874 * T * T * R + 0.00085282 * T * R * R - 0.00000199 * T * T * R * R;
    const activityMultiplier = [1, 1.2, 1.5, 2.0][activityType - 1];
    const effectiveHI = HI * activityMultiplier;
    let riskLevel = "Low";
    let hydrationOzPerHour = 8;
    let restInterval = "No additional rest needed";
    if (effectiveHI >= 175) { riskLevel = "Extreme Danger - Cancel activity"; hydrationOzPerHour = 48; restInterval = "Do not continue"; }
    else if (effectiveHI >= 145) { riskLevel = "Danger"; hydrationOzPerHour = 32; restInterval = "10 min rest every 20 min"; }
    else if (effectiveHI >= 120) { riskLevel = "Extreme Caution"; hydrationOzPerHour = 24; restInterval = "10 min rest every 30 min"; }
    else if (effectiveHI >= 100) { riskLevel = "Caution"; hydrationOzPerHour = 16; restInterval = "5 min rest every 30 min"; }
    const totalHydration = (hydrationOzPerHour * duration) / 60;
    return {
      primary: { label: "Heat Index", value: formatNumber(Math.round(HI)) + " °F" },
      details: [
        { label: "Activity-Adjusted Index", value: formatNumber(Math.round(effectiveHI)) + " °F equivalent" },
        { label: "Risk Level", value: riskLevel },
        { label: "Hydration Needed", value: formatNumber(hydrationOzPerHour) + " oz/hour" },
        { label: "Total Hydration for Session", value: formatNumber(Math.round(totalHydration)) + " oz" },
        { label: "Rest Interval", value: restInterval }
      ]
    };
  }`,
  [
    "Q: What is the heat index?||A: The heat index combines air temperature and humidity to determine the perceived temperature and risk of heat-related illness. High humidity prevents sweat evaporation, making it feel hotter.",
    "Q: How much water should I drink during exercise in heat?||A: The American College of Sports Medicine recommends 16-32 oz per hour during exercise in hot conditions, depending on intensity and conditions.",
    "Q: What are the signs of heat exhaustion?||A: Symptoms include heavy sweating, weakness, cold/pale/clammy skin, nausea, fast/weak pulse, and fainting. Move to a cool place and hydrate immediately."
  ],
  `Heat Index = -42.379 + 2.049T + 10.143R - 0.225TR - ... (Rothfusz regression)\nEffective HI = HI x Activity Multiplier\nHydration varies by risk level: 8-48 oz/hour`,
  ["heat-index-calculator", "uv-protection-factor-calculator", "wind-chill-extended-calculator"]
);
