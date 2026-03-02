add(
  "car-depreciation-curve-calculator",
  "Car Depreciation Curve Calculator",
  "Estimate your vehicle value over time using an exponential depreciation curve based on purchase price, age, and annual depreciation rate.",
  "Finance",
  "finance",
  "$",
  ["car depreciation curve", "vehicle value over time", "auto depreciation rate", "car resale value"],
  [
    '{ name: "purchasePrice", label: "Purchase Price ($)", type: "number", min: 1000, max: 500000, defaultValue: 35000 }',
    '{ name: "vehicleAge", label: "Current Vehicle Age (years)", type: "number", min: 0, max: 30, defaultValue: 3 }',
    '{ name: "annualDepreciation", label: "Annual Depreciation Rate (%)", type: "number", min: 1, max: 40, defaultValue: 15 }',
    '{ name: "projectionYears", label: "Projection Years", type: "number", min: 1, max: 20, defaultValue: 5 }'
  ],
  `(inputs) => {
    const price = inputs.purchasePrice as number;
    const age = inputs.vehicleAge as number;
    const rate = inputs.annualDepreciation as number / 100;
    const projection = inputs.projectionYears as number;
    const currentValue = price * Math.pow(1 - rate, age);
    const futureValue = price * Math.pow(1 - rate, age + projection);
    const totalDepreciation = currentValue - futureValue;
    const percentRetained = (futureValue / price) * 100;
    return {
      primary: { label: "Current Value", value: "$" + formatNumber(Math.round(currentValue)) },
      details: [
        { label: "Value After " + projection + " More Years", value: "$" + formatNumber(Math.round(futureValue)) },
        { label: "Depreciation Over Projection", value: "$" + formatNumber(Math.round(totalDepreciation)) },
        { label: "Percent of Original Retained", value: formatNumber(Math.round(percentRetained * 10) / 10) + "%" },
        { label: "Annual Loss (Avg)", value: "$" + formatNumber(Math.round(totalDepreciation / projection)) }
      ]
    };
  }`,
  [
    { q: "How fast do cars depreciate?", a: "Most new cars lose about 20 percent of their value in the first year and roughly 15 percent each year after that. After five years a typical car retains about 40 percent of its original value." },
    { q: "What factors affect car depreciation?", a: "Brand reputation, mileage, condition, color, market demand, fuel efficiency, and whether the model has been redesigned all affect depreciation rates." },
    { q: "Do electric vehicles depreciate differently?", a: "EVs historically depreciated faster due to battery concerns and rapid technology changes, but newer models with longer range and better battery warranties are holding value better." }
  ],
  `Current Value = Purchase Price x (1 - Depreciation Rate) ^ Age
Future Value = Purchase Price x (1 - Depreciation Rate) ^ (Age + Projection Years)`,
  ["vehicle-depreciation-schedule-calculator", "car-loan-refinance-calculator"]
);

add(
  "car-wash-frequency-cost-calculator",
  "Car Wash Frequency Cost Calculator",
  "Calculate your annual car wash spending based on wash type, frequency, and optional membership versus pay-per-wash comparison.",
  "Everyday",
  "everyday",
  "~",
  ["car wash cost", "car wash frequency", "car wash membership", "auto wash budget"],
  [
    '{ name: "washType", label: "Wash Type", type: "select", options: [{ value: "1", label: "Basic ($8)" }, { value: "2", label: "Standard ($15)" }, { value: "3", label: "Premium ($25)" }, { value: "4", label: "Full Detail ($75)" }], defaultValue: "2" }',
    '{ name: "washesPerMonth", label: "Washes Per Month", type: "number", min: 1, max: 12, defaultValue: 2 }',
    '{ name: "membershipCost", label: "Monthly Membership Cost ($)", type: "number", min: 0, max: 200, defaultValue: 30 }',
    '{ name: "tipPercent", label: "Tip Percentage (%)", type: "number", min: 0, max: 30, defaultValue: 10 }'
  ],
  `(inputs) => {
    const washType = parseInt(inputs.washType as string);
    const washesPerMonth = inputs.washesPerMonth as number;
    const membership = inputs.membershipCost as number;
    const tipPct = inputs.tipPercent as number / 100;
    const washPrices = { 1: 8, 2: 15, 3: 25, 4: 75 };
    const pricePerWash = washPrices[washType] || 15;
    const monthlyPayPerWash = washesPerMonth * pricePerWash * (1 + tipPct);
    const annualPayPerWash = monthlyPayPerWash * 12;
    const annualMembership = membership * 12;
    const savings = annualPayPerWash - annualMembership;
    return {
      primary: { label: "Annual Pay-Per-Wash Cost", value: "$" + formatNumber(Math.round(annualPayPerWash)) },
      details: [
        { label: "Monthly Pay-Per-Wash", value: "$" + formatNumber(Math.round(monthlyPayPerWash * 100) / 100) },
        { label: "Annual Membership Cost", value: "$" + formatNumber(annualMembership) },
        { label: "Annual Savings with Membership", value: savings > 0 ? "$" + formatNumber(Math.round(savings)) : "-$" + formatNumber(Math.round(Math.abs(savings))) },
        { label: "Recommendation", value: savings > 0 ? "Membership saves money" : "Pay-per-wash is cheaper" }
      ]
    };
  }`,
  [
    { q: "How often should I wash my car?", a: "Most experts recommend washing your car every two weeks. If you drive in harsh conditions such as salt roads, dirt roads, or areas with heavy pollen, consider washing weekly." },
    { q: "Is a car wash membership worth it?", a: "If you wash your car two or more times per month, an unlimited wash membership often saves 30 to 50 percent compared to paying per wash." },
    { q: "Does frequent washing damage paint?", a: "Touchless and hand washes are safest. Automatic brush washes can create micro scratches over time. Using a quality wax or sealant provides additional protection." }
  ],
  `Annual Pay-Per-Wash = Washes/Month x Price x (1 + Tip%) x 12
Annual Membership = Monthly Membership x 12
Savings = Annual Pay-Per-Wash - Annual Membership`,
  ["car-detailing-cost-calculator", "car-wax-application-calculator"]
);

add(
  "engine-oil-capacity-calculator",
  "Engine Oil Capacity Calculator",
  "Estimate engine oil capacity and total oil change cost based on engine size, oil type, and filter cost.",
  "Everyday",
  "everyday",
  "~",
  ["engine oil capacity", "oil change cost", "motor oil calculator", "engine displacement oil"],
  [
    '{ name: "engineSize", label: "Engine Displacement (liters)", type: "number", min: 0.5, max: 10, defaultValue: 2.5 }',
    '{ name: "engineType", label: "Engine Type", type: "select", options: [{ value: "1", label: "Inline 4-Cylinder" }, { value: "2", label: "V6" }, { value: "3", label: "V8" }, { value: "4", label: "Inline 6-Cylinder" }, { value: "5", label: "Turbocharged 4-Cylinder" }], defaultValue: "1" }',
    '{ name: "oilType", label: "Oil Type", type: "select", options: [{ value: "1", label: "Conventional ($5/qt)" }, { value: "2", label: "Synthetic Blend ($7/qt)" }, { value: "3", label: "Full Synthetic ($10/qt)" }, { value: "4", label: "High Mileage ($9/qt)" }], defaultValue: "3" }',
    '{ name: "filterCost", label: "Oil Filter Cost ($)", type: "number", min: 3, max: 30, defaultValue: 8 }'
  ],
  `(inputs) => {
    const displacement = inputs.engineSize as number;
    const engineType = parseInt(inputs.engineType as string);
    const oilType = parseInt(inputs.oilType as string);
    const filterCost = inputs.filterCost as number;
    const baseCapacity = { 1: 4.5, 2: 5.5, 3: 7, 4: 6, 5: 5 };
    const sizeMultiplier = displacement / 2.5;
    const capacity = Math.round((baseCapacity[engineType] || 5) * sizeMultiplier * 10) / 10;
    const quartsNeeded = Math.ceil(capacity);
    const oilPrices = { 1: 5, 2: 7, 3: 10, 4: 9 };
    const pricePerQuart = oilPrices[oilType] || 10;
    const totalCost = quartsNeeded * pricePerQuart + filterCost;
    return {
      primary: { label: "Estimated Oil Capacity", value: formatNumber(capacity) + " quarts" },
      details: [
        { label: "Quarts to Purchase", value: formatNumber(quartsNeeded) },
        { label: "Oil Cost", value: "$" + formatNumber(quartsNeeded * pricePerQuart) },
        { label: "Filter Cost", value: "$" + formatNumber(filterCost) },
        { label: "Total DIY Cost", value: "$" + formatNumber(totalCost) }
      ]
    };
  }`,
  [
    { q: "How do I find my exact oil capacity?", a: "Check your vehicle owner manual or the oil fill cap for the exact specification. This calculator provides an estimate based on engine type and displacement." },
    { q: "Is synthetic oil worth the extra cost?", a: "Full synthetic oil lasts longer between changes, performs better in extreme temperatures, and provides superior engine protection. Most modern vehicles require or recommend synthetic oil." },
    { q: "How much oil does a typical car need?", a: "Most four-cylinder engines require 4 to 5 quarts, V6 engines need 5 to 6 quarts, and V8 engines typically require 6 to 8 quarts of oil." }
  ],
  `Estimated Capacity = Base Capacity (by engine type) x (Displacement / 2.5)
Total DIY Cost = (Quarts Needed x Price Per Quart) + Filter Cost`,
  ["oil-change-interval-calculator", "spark-plug-replacement-calculator"]
);

add(
  "coolant-flush-schedule-calculator",
  "Coolant Flush Schedule Calculator",
  "Calculate when your next coolant flush is due based on mileage, time interval, and coolant type to keep your engine cooling system healthy.",
  "Everyday",
  "everyday",
  "~",
  ["coolant flush", "antifreeze change", "radiator flush schedule", "cooling system maintenance"],
  [
    '{ name: "currentMileage", label: "Current Mileage", type: "number", min: 0, max: 500000, defaultValue: 60000 }',
    '{ name: "lastFlushMileage", label: "Last Flush Mileage", type: "number", min: 0, max: 500000, defaultValue: 30000 }',
    '{ name: "coolantType", label: "Coolant Type", type: "select", options: [{ value: "1", label: "Conventional (30,000 mi)" }, { value: "2", label: "Extended Life (50,000 mi)" }, { value: "3", label: "Long Life (100,000 mi)" }], defaultValue: "2" }',
    '{ name: "monthlyMiles", label: "Monthly Miles Driven", type: "number", min: 100, max: 10000, defaultValue: 1000 }',
    '{ name: "flushCost", label: "Flush Service Cost ($)", type: "number", min: 50, max: 300, defaultValue: 120 }'
  ],
  `(inputs) => {
    const current = inputs.currentMileage as number;
    const lastFlush = inputs.lastFlushMileage as number;
    const coolantType = parseInt(inputs.coolantType as string);
    const monthly = inputs.monthlyMiles as number;
    const cost = inputs.flushCost as number;
    const intervals = { 1: 30000, 2: 50000, 3: 100000 };
    const interval = intervals[coolantType] || 50000;
    const milesSinceFlush = current - lastFlush;
    const milesUntilDue = interval - milesSinceFlush;
    const nextFlushMileage = lastFlush + interval;
    const monthsUntilDue = milesUntilDue > 0 ? Math.round(milesUntilDue / monthly * 10) / 10 : 0;
    const annualCost = Math.round(cost / (interval / (monthly * 12)) * 100) / 100;
    return {
      primary: { label: "Next Flush Due At", value: formatNumber(nextFlushMileage) + " mi" },
      details: [
        { label: "Miles Since Last Flush", value: formatNumber(milesSinceFlush) },
        { label: "Miles Until Due", value: formatNumber(Math.max(milesUntilDue, 0)) },
        { label: "Months Until Due", value: formatNumber(monthsUntilDue) },
        { label: "Annualized Cost", value: "$" + formatNumber(Math.round(annualCost)) },
        { label: "Status", value: milesUntilDue <= 0 ? "Overdue" : milesUntilDue < 5000 ? "Due Soon" : "On Schedule" }
      ]
    };
  }`,
  [
    { q: "How often should coolant be flushed?", a: "Conventional coolant should be changed every 30,000 miles or 2 years. Extended life coolant lasts about 50,000 miles, and long life formulas can go up to 100,000 miles." },
    { q: "What happens if I skip a coolant flush?", a: "Old coolant loses its anti-corrosion additives and can cause rust buildup, clogged passages, overheating, and potentially catastrophic engine damage from a blown head gasket." },
    { q: "Can I mix different coolant types?", a: "Mixing different coolant types can cause chemical reactions that form gel or sludge. Always use the type specified in your owner manual and flush completely when switching." }
  ],
  `Next Flush Mileage = Last Flush Mileage + Interval (by coolant type)
Miles Until Due = Interval - (Current Mileage - Last Flush Mileage)
Annualized Cost = Flush Cost / (Interval / Annual Miles)`,
  ["oil-change-interval-calculator", "transmission-fluid-change-calculator"]
);

add(
  "transmission-fluid-change-calculator",
  "Transmission Fluid Change Calculator",
  "Determine when your transmission fluid change is due and estimate service costs based on transmission type and driving conditions.",
  "Everyday",
  "everyday",
  "~",
  ["transmission fluid change", "transmission service", "ATF change schedule", "gearbox fluid"],
  [
    '{ name: "currentMileage", label: "Current Mileage", type: "number", min: 0, max: 500000, defaultValue: 75000 }',
    '{ name: "lastServiceMileage", label: "Last Service Mileage", type: "number", min: 0, max: 500000, defaultValue: 30000 }',
    '{ name: "transType", label: "Transmission Type", type: "select", options: [{ value: "1", label: "Automatic" }, { value: "2", label: "Manual" }, { value: "3", label: "CVT" }, { value: "4", label: "Dual-Clutch (DCT)" }], defaultValue: "1" }',
    '{ name: "drivingCondition", label: "Driving Conditions", type: "select", options: [{ value: "1", label: "Normal" }, { value: "2", label: "Severe (towing, city, hot climate)" }], defaultValue: "1" }',
    '{ name: "monthlyMiles", label: "Monthly Miles Driven", type: "number", min: 100, max: 10000, defaultValue: 1200 }'
  ],
  `(inputs) => {
    const current = inputs.currentMileage as number;
    const lastService = inputs.lastServiceMileage as number;
    const transType = parseInt(inputs.transType as string);
    const condition = parseInt(inputs.drivingCondition as string);
    const monthly = inputs.monthlyMiles as number;
    const baseIntervals = { 1: 60000, 2: 60000, 3: 50000, 4: 40000 };
    const severeMultiplier = condition === 2 ? 0.5 : 1;
    const interval = Math.round((baseIntervals[transType] || 60000) * severeMultiplier);
    const costs = { 1: 200, 2: 120, 3: 250, 4: 300 };
    const serviceCost = costs[transType] || 200;
    const milesSinceLast = current - lastService;
    const milesUntilDue = interval - milesSinceLast;
    const monthsUntilDue = milesUntilDue > 0 ? Math.round(milesUntilDue / monthly * 10) / 10 : 0;
    return {
      primary: { label: "Next Service At", value: formatNumber(lastService + interval) + " mi" },
      details: [
        { label: "Service Interval", value: formatNumber(interval) + " mi" },
        { label: "Miles Since Last Service", value: formatNumber(milesSinceLast) },
        { label: "Miles Until Due", value: formatNumber(Math.max(milesUntilDue, 0)) },
        { label: "Months Until Due", value: formatNumber(monthsUntilDue) },
        { label: "Estimated Service Cost", value: "$" + formatNumber(serviceCost) },
        { label: "Status", value: milesUntilDue <= 0 ? "Overdue" : "On Schedule" }
      ]
    };
  }`,
  [
    { q: "How often should transmission fluid be changed?", a: "Automatic transmissions typically need fluid changes every 60,000 to 100,000 miles under normal conditions, or every 30,000 miles under severe conditions like frequent towing or city driving." },
    { q: "What are signs of bad transmission fluid?", a: "Dark or burnt-smelling fluid, delayed gear engagement, rough shifting, and transmission slipping are all signs that the fluid needs to be changed." },
    { q: "Is a transmission flush or drain-and-fill better?", a: "A drain-and-fill is generally safer for high-mileage vehicles. A full flush replaces more fluid but can dislodge debris in older transmissions. Consult your vehicle manufacturer recommendation." }
  ],
  `Service Interval = Base Interval x Condition Multiplier
Next Service = Last Service Mileage + Service Interval
Months Until Due = Miles Until Due / Monthly Miles`,
  ["coolant-flush-schedule-calculator", "oil-change-interval-calculator"]
);

add(
  "spark-plug-replacement-calculator",
  "Spark Plug Replacement Calculator",
  "Calculate when spark plugs need replacing and estimate total replacement cost based on plug type, engine cylinder count, and mileage.",
  "Everyday",
  "everyday",
  "~",
  ["spark plug replacement", "spark plug interval", "spark plug cost", "ignition maintenance"],
  [
    '{ name: "currentMileage", label: "Current Mileage", type: "number", min: 0, max: 500000, defaultValue: 80000 }',
    '{ name: "lastReplacementMileage", label: "Last Replacement Mileage", type: "number", min: 0, max: 500000, defaultValue: 30000 }',
    '{ name: "plugType", label: "Spark Plug Type", type: "select", options: [{ value: "1", label: "Copper (30,000 mi)" }, { value: "2", label: "Platinum (60,000 mi)" }, { value: "3", label: "Double Platinum (80,000 mi)" }, { value: "4", label: "Iridium (100,000 mi)" }], defaultValue: "4" }',
    '{ name: "cylinders", label: "Number of Cylinders", type: "select", options: [{ value: "3", label: "3 Cylinder" }, { value: "4", label: "4 Cylinder" }, { value: "5", label: "5 Cylinder" }, { value: "6", label: "6 Cylinder" }, { value: "8", label: "8 Cylinder" }], defaultValue: "4" }',
    '{ name: "laborCost", label: "Labor Cost ($)", type: "number", min: 0, max: 500, defaultValue: 100 }'
  ],
  `(inputs) => {
    const current = inputs.currentMileage as number;
    const lastReplacement = inputs.lastReplacementMileage as number;
    const plugType = parseInt(inputs.plugType as string);
    const cylinders = parseInt(inputs.cylinders as string);
    const labor = inputs.laborCost as number;
    const intervals = { 1: 30000, 2: 60000, 3: 80000, 4: 100000 };
    const plugCosts = { 1: 3, 2: 8, 3: 12, 4: 15 };
    const interval = intervals[plugType] || 100000;
    const costPerPlug = plugCosts[plugType] || 15;
    const totalPartsCost = cylinders * costPerPlug;
    const totalCost = totalPartsCost + labor;
    const milesSinceLast = current - lastReplacement;
    const milesUntilDue = interval - milesSinceLast;
    return {
      primary: { label: "Next Replacement At", value: formatNumber(lastReplacement + interval) + " mi" },
      details: [
        { label: "Replacement Interval", value: formatNumber(interval) + " mi" },
        { label: "Miles Until Due", value: formatNumber(Math.max(milesUntilDue, 0)) },
        { label: "Plugs Needed", value: formatNumber(cylinders) },
        { label: "Parts Cost", value: "$" + formatNumber(totalPartsCost) },
        { label: "Total Cost (Parts + Labor)", value: "$" + formatNumber(totalCost) },
        { label: "Status", value: milesUntilDue <= 0 ? "Overdue" : milesUntilDue < 5000 ? "Due Soon" : "On Schedule" }
      ]
    };
  }`,
  [
    { q: "How often should spark plugs be replaced?", a: "Copper plugs last about 30,000 miles, platinum plugs 60,000 miles, and iridium plugs can last up to 100,000 miles. Check your owner manual for the specific recommendation." },
    { q: "What happens if spark plugs are worn out?", a: "Worn spark plugs cause misfires, poor fuel economy, rough idling, difficulty starting, and reduced engine performance. Ignoring them can damage the catalytic converter." },
    { q: "Can I replace spark plugs myself?", a: "On many four-cylinder engines, spark plugs are accessible and DIY-friendly. V6 and V8 engines may have plugs that are harder to reach, especially on transverse-mounted engines." }
  ],
  `Next Replacement = Last Replacement Mileage + Interval (by plug type)
Parts Cost = Number of Cylinders x Cost Per Plug
Total Cost = Parts Cost + Labor Cost`,
  ["oil-change-interval-calculator", "engine-oil-capacity-calculator"]
);

add(
  "car-battery-replacement-cost-calculator",
  "Car Battery Replacement Cost Calculator",
  "Estimate battery replacement cost and remaining battery life based on battery type, climate, and vehicle usage patterns.",
  "Everyday",
  "everyday",
  "~",
  ["car battery cost", "battery replacement", "auto battery life", "car battery calculator"],
  [
    '{ name: "batteryType", label: "Battery Type", type: "select", options: [{ value: "1", label: "Standard Lead-Acid ($100-150)" }, { value: "2", label: "AGM ($200-300)" }, { value: "3", label: "Enhanced Flooded ($150-200)" }, { value: "4", label: "Lithium (Starter) ($250-400)" }], defaultValue: "1" }',
    '{ name: "batteryAge", label: "Battery Age (years)", type: "number", min: 0, max: 10, defaultValue: 3 }',
    '{ name: "climate", label: "Climate", type: "select", options: [{ value: "1", label: "Mild" }, { value: "2", label: "Hot (over 90F summers)" }, { value: "3", label: "Cold (below 20F winters)" }, { value: "4", label: "Extreme (both hot and cold)" }], defaultValue: "1" }',
    '{ name: "installationType", label: "Installation", type: "select", options: [{ value: "1", label: "DIY" }, { value: "2", label: "Shop Install ($30-50)" }, { value: "3", label: "Dealer Install ($75-125)" }], defaultValue: "2" }'
  ],
  `(inputs) => {
    const batteryType = parseInt(inputs.batteryType as string);
    const age = inputs.batteryAge as number;
    const climate = parseInt(inputs.climate as string);
    const install = parseInt(inputs.installationType as string);
    const batteryCosts = { 1: 125, 2: 250, 3: 175, 4: 325 };
    const baseLife = { 1: 4, 2: 6, 3: 5, 4: 8 };
    const climateMultiplier = { 1: 1.0, 2: 0.75, 3: 0.85, 4: 0.65 };
    const installCosts = { 1: 0, 2: 40, 3: 100 };
    const batteryCost = batteryCosts[batteryType] || 125;
    const expectedLife = Math.round((baseLife[batteryType] || 4) * (climateMultiplier[climate] || 1) * 10) / 10;
    const installCost = installCosts[install] || 0;
    const totalCost = batteryCost + installCost;
    const remainingLife = Math.max(expectedLife - age, 0);
    const costPerYear = Math.round(totalCost / expectedLife * 100) / 100;
    return {
      primary: { label: "Total Replacement Cost", value: "$" + formatNumber(totalCost) },
      details: [
        { label: "Battery Cost", value: "$" + formatNumber(batteryCost) },
        { label: "Installation Cost", value: "$" + formatNumber(installCost) },
        { label: "Expected Battery Life", value: formatNumber(expectedLife) + " years" },
        { label: "Estimated Remaining Life", value: formatNumber(Math.round(remainingLife * 10) / 10) + " years" },
        { label: "Cost Per Year", value: "$" + formatNumber(Math.round(costPerYear)) }
      ]
    };
  }`,
  [
    { q: "How long do car batteries last?", a: "Standard lead-acid batteries last 3 to 5 years, AGM batteries last 5 to 7 years, and lithium starter batteries can last 8 to 10 years. Hot climates significantly shorten battery life." },
    { q: "What are signs of a dying battery?", a: "Slow cranking, dim headlights, electrical issues, a swollen battery case, a sulfur smell, and needing frequent jump-starts are all signs your battery is failing." },
    { q: "Should I choose AGM over standard?", a: "AGM batteries are better for vehicles with start-stop technology, high electrical demands, or extreme climates. They cost more but last longer and handle deep discharges better." }
  ],
  `Total Cost = Battery Cost + Installation Cost
Expected Life = Base Life (by type) x Climate Multiplier
Remaining Life = Expected Life - Current Age`,
  ["car-annual-maintenance-cost-calculator", "spark-plug-replacement-calculator"]
);

add(
  "wheel-alignment-frequency-calculator",
  "Wheel Alignment Frequency Calculator",
  "Calculate when your next wheel alignment is due and estimate how misalignment affects tire wear cost and fuel economy.",
  "Everyday",
  "everyday",
  "~",
  ["wheel alignment", "tire alignment schedule", "alignment frequency", "front end alignment"],
  [
    '{ name: "lastAlignmentMileage", label: "Last Alignment Mileage", type: "number", min: 0, max: 500000, defaultValue: 40000 }',
    '{ name: "currentMileage", label: "Current Mileage", type: "number", min: 0, max: 500000, defaultValue: 55000 }',
    '{ name: "roadCondition", label: "Road Conditions", type: "select", options: [{ value: "1", label: "Good (highways, smooth roads)" }, { value: "2", label: "Average (mixed roads)" }, { value: "3", label: "Poor (potholes, rough roads)" }], defaultValue: "2" }',
    '{ name: "alignmentCost", label: "Alignment Service Cost ($)", type: "number", min: 50, max: 250, defaultValue: 100 }',
    '{ name: "tireSetCost", label: "Cost of Tire Set ($)", type: "number", min: 200, max: 2000, defaultValue: 600 }'
  ],
  `(inputs) => {
    const lastAlign = inputs.lastAlignmentMileage as number;
    const current = inputs.currentMileage as number;
    const roadCond = parseInt(inputs.roadCondition as string);
    const alignCost = inputs.alignmentCost as number;
    const tireCost = inputs.tireSetCost as number;
    const intervals = { 1: 15000, 2: 12000, 3: 8000 };
    const interval = intervals[roadCond] || 12000;
    const milesSinceLast = current - lastAlign;
    const milesUntilDue = interval - milesSinceLast;
    const tireLifeReduction = milesSinceLast > interval ? Math.round((milesSinceLast - interval) / interval * 20) : 0;
    const wastedTireCost = Math.round(tireCost * tireLifeReduction / 100);
    return {
      primary: { label: "Next Alignment At", value: formatNumber(lastAlign + interval) + " mi" },
      details: [
        { label: "Recommended Interval", value: formatNumber(interval) + " mi" },
        { label: "Miles Since Last Alignment", value: formatNumber(milesSinceLast) },
        { label: "Miles Until Due", value: formatNumber(Math.max(milesUntilDue, 0)) },
        { label: "Est. Tire Life Reduction", value: formatNumber(tireLifeReduction) + "%" },
        { label: "Est. Wasted Tire Cost", value: "$" + formatNumber(wastedTireCost) },
        { label: "Status", value: milesUntilDue <= 0 ? "Overdue" : "On Schedule" }
      ]
    };
  }`,
  [
    { q: "How often do I need a wheel alignment?", a: "Most vehicles should be aligned every 10,000 to 15,000 miles or annually. If you frequently hit potholes or drive on rough roads, check alignment every 8,000 miles." },
    { q: "What does misalignment cost me?", a: "Misalignment can reduce tire life by 25 percent or more and decrease fuel economy by up to 10 percent. A $100 alignment can save hundreds in premature tire replacement." },
    { q: "What are signs of misalignment?", a: "Uneven tire wear, the vehicle pulling to one side, a crooked steering wheel when driving straight, and vibration in the steering wheel are common signs." }
  ],
  `Alignment Interval = Base Interval (by road condition)
Next Alignment = Last Alignment Mileage + Interval
Tire Life Reduction = Overdue Miles / Interval x 20%`,
  ["tire-rotation-schedule-calculator", "tire-tread-life-calculator"]
);

add(
  "car-wax-application-calculator",
  "Car Wax Application Calculator",
  "Calculate your car wax schedule, annual cost, and product usage based on wax type, vehicle size, and application frequency.",
  "Everyday",
  "everyday",
  "~",
  ["car wax schedule", "wax application", "car paint protection", "wax cost calculator"],
  [
    '{ name: "vehicleSize", label: "Vehicle Size", type: "select", options: [{ value: "1", label: "Compact Car" }, { value: "2", label: "Mid-Size Sedan" }, { value: "3", label: "Full-Size SUV" }, { value: "4", label: "Truck" }], defaultValue: "2" }',
    '{ name: "waxType", label: "Wax Type", type: "select", options: [{ value: "1", label: "Paste Wax (2-3 month durability)" }, { value: "2", label: "Liquid Wax (2-4 month)" }, { value: "3", label: "Spray Wax (2-4 weeks)" }, { value: "4", label: "Ceramic Coating (6-12 month)" }], defaultValue: "2" }',
    '{ name: "productCost", label: "Product Cost ($)", type: "number", min: 5, max: 200, defaultValue: 25 }',
    '{ name: "applicationsPerBottle", label: "Applications Per Bottle", type: "number", min: 1, max: 20, defaultValue: 4 }'
  ],
  `(inputs) => {
    const vehicleSize = parseInt(inputs.vehicleSize as string);
    const waxType = parseInt(inputs.waxType as string);
    const productCost = inputs.productCost as number;
    const appsPerBottle = inputs.applicationsPerBottle as number;
    const durabilityMonths = { 1: 2.5, 2: 3, 3: 0.75, 4: 9 };
    const sizeMultiplier = { 1: 0.8, 2: 1.0, 3: 1.4, 4: 1.5 };
    const monthsDuration = durabilityMonths[waxType] || 3;
    const applicationsPerYear = Math.round(12 / monthsDuration * 10) / 10;
    const sizeMult = sizeMultiplier[vehicleSize] || 1;
    const adjustedAppsPerBottle = Math.round(appsPerBottle / sizeMult);
    const bottlesPerYear = Math.ceil(applicationsPerYear / adjustedAppsPerBottle);
    const annualCost = bottlesPerYear * productCost;
    const costPerApplication = Math.round(productCost / adjustedAppsPerBottle * 100) / 100;
    return {
      primary: { label: "Applications Per Year", value: formatNumber(Math.ceil(applicationsPerYear)) },
      details: [
        { label: "Wax Durability", value: formatNumber(monthsDuration) + " months" },
        { label: "Cost Per Application", value: "$" + formatNumber(costPerApplication) },
        { label: "Bottles Per Year", value: formatNumber(bottlesPerYear) },
        { label: "Annual Wax Cost", value: "$" + formatNumber(annualCost) }
      ]
    };
  }`,
  [
    { q: "How often should I wax my car?", a: "Paste and liquid waxes typically last 2 to 4 months. Spray waxes last only a few weeks. Ceramic coatings can protect for 6 to 12 months or longer depending on the product." },
    { q: "Does waxing actually protect paint?", a: "Yes, wax provides a sacrificial layer that shields paint from UV rays, bird droppings, tree sap, and minor scratches. Regular waxing preserves paint condition and resale value." },
    { q: "Is ceramic coating better than wax?", a: "Ceramic coatings last longer and provide superior protection, but cost significantly more upfront. Traditional wax is easier to apply and more affordable for regular maintenance." }
  ],
  `Applications Per Year = 12 / Durability (months)
Cost Per Application = Product Cost / Applications Per Bottle (adjusted for vehicle size)
Annual Cost = Bottles Per Year x Product Cost`,
  ["car-wash-frequency-cost-calculator", "paint-protection-film-cost-calculator"]
);

add(
  "paint-protection-film-cost-calculator",
  "Paint Protection Film Cost Calculator",
  "Estimate the cost of paint protection film (PPF) installation based on coverage area, film quality, and vehicle size.",
  "Everyday",
  "everyday",
  "~",
  ["paint protection film", "PPF cost", "clear bra cost", "car paint protection", "PPF calculator"],
  [
    '{ name: "vehicleSize", label: "Vehicle Size", type: "select", options: [{ value: "1", label: "Compact Car" }, { value: "2", label: "Mid-Size Sedan" }, { value: "3", label: "Full-Size SUV/Truck" }, { value: "4", label: "Luxury/Exotic" }], defaultValue: "2" }',
    '{ name: "coverage", label: "Coverage Level", type: "select", options: [{ value: "1", label: "Partial Front (hood, bumper, mirrors)" }, { value: "2", label: "Full Front (add fenders, A-pillars)" }, { value: "3", label: "Full Front + Rockers" }, { value: "4", label: "Full Vehicle Wrap" }], defaultValue: "2" }',
    '{ name: "filmQuality", label: "Film Quality", type: "select", options: [{ value: "1", label: "Budget ($)" }, { value: "2", label: "Mid-Range ($$)" }, { value: "3", label: "Premium ($$$)" }], defaultValue: "2" }',
    '{ name: "filmLifespan", label: "Expected Film Lifespan (years)", type: "number", min: 3, max: 12, defaultValue: 7 }'
  ],
  `(inputs) => {
    const vehicleSize = parseInt(inputs.vehicleSize as string);
    const coverage = parseInt(inputs.coverage as string);
    const filmQuality = parseInt(inputs.filmQuality as string);
    const lifespan = inputs.filmLifespan as number;
    const baseCosts = { 1: 800, 2: 1200, 3: 1800, 4: 5000 };
    const sizeMultiplier = { 1: 0.85, 2: 1.0, 3: 1.3, 4: 1.6 };
    const qualityMultiplier = { 1: 0.7, 2: 1.0, 3: 1.5 };
    const base = baseCosts[coverage] || 1200;
    const totalCost = Math.round(base * (sizeMultiplier[vehicleSize] || 1) * (qualityMultiplier[filmQuality] || 1));
    const costPerYear = Math.round(totalCost / lifespan);
    const costPerMonth = Math.round(totalCost / (lifespan * 12) * 100) / 100;
    const sqft = { 1: 15, 2: 25, 3: 35, 4: 120 };
    const area = Math.round((sqft[coverage] || 25) * (sizeMultiplier[vehicleSize] || 1));
    return {
      primary: { label: "Estimated Total Cost", value: "$" + formatNumber(totalCost) },
      details: [
        { label: "Coverage Area", value: formatNumber(area) + " sq ft" },
        { label: "Cost Per Year", value: "$" + formatNumber(costPerYear) },
        { label: "Cost Per Month", value: "$" + formatNumber(costPerMonth) },
        { label: "Film Lifespan", value: formatNumber(lifespan) + " years" }
      ]
    };
  }`,
  [
    { q: "What is paint protection film?", a: "PPF is a clear urethane film applied to painted surfaces to protect against rock chips, scratches, bug splatter, and UV damage. High-quality films are self-healing for minor scratches." },
    { q: "How long does PPF last?", a: "Budget films last 3 to 5 years, mid-range films 5 to 7 years, and premium films like XPEL Ultimate or 3M Pro Series can last 7 to 10 years or more with proper care." },
    { q: "Is PPF worth the investment?", a: "For new or high-value vehicles, PPF preserves paint condition and can significantly improve resale value. The cost is often recovered through avoided paint repair and detailing expenses." }
  ],
  `Total Cost = Base Cost (by coverage) x Size Multiplier x Quality Multiplier
Cost Per Year = Total Cost / Film Lifespan
Coverage Area = Base Area x Size Multiplier`,
  ["car-wax-application-calculator", "car-detailing-cost-calculator"]
);

add(
  "window-tint-darkness-calculator",
  "Window Tint Darkness Calculator",
  "Calculate window tint percentages, visible light transmission, and estimated cost for different tint levels and window counts.",
  "Everyday",
  "everyday",
  "~",
  ["window tint", "tint darkness", "VLT calculator", "car window tint cost", "tint percentage"],
  [
    '{ name: "tintLevel", label: "Tint Darkness", type: "select", options: [{ value: "1", label: "Light (50% VLT)" }, { value: "2", label: "Medium (35% VLT)" }, { value: "3", label: "Dark (20% VLT)" }, { value: "4", label: "Very Dark (5% VLT - Limo)" }], defaultValue: "2" }',
    '{ name: "filmType", label: "Film Type", type: "select", options: [{ value: "1", label: "Dyed ($)" }, { value: "2", label: "Metallic ($$)" }, { value: "3", label: "Carbon ($$$)" }, { value: "4", label: "Ceramic ($$$$)" }], defaultValue: "3" }',
    '{ name: "windowCount", label: "Number of Windows", type: "number", min: 2, max: 10, defaultValue: 5 }',
    '{ name: "includeWindshield", label: "Include Windshield Strip", type: "select", options: [{ value: "0", label: "No" }, { value: "1", label: "Yes (+$50)" }], defaultValue: "0" }'
  ],
  `(inputs) => {
    const tintLevel = parseInt(inputs.tintLevel as string);
    const filmType = parseInt(inputs.filmType as string);
    const windowCount = inputs.windowCount as number;
    const includeWindshield = parseInt(inputs.includeWindshield as string);
    const vltValues = { 1: 50, 2: 35, 3: 20, 4: 5 };
    const costPerWindow = { 1: 25, 2: 40, 3: 55, 4: 80 };
    const heatRejection = { 1: 15, 2: 35, 3: 50, 4: 70 };
    const uvRejection = { 1: 90, 2: 95, 3: 97, 4: 99 };
    const vlt = vltValues[tintLevel] || 35;
    const perWindow = costPerWindow[filmType] || 55;
    const totalCost = (windowCount * perWindow) + (includeWindshield * 50);
    const heatReject = heatRejection[filmType] || 50;
    const uvReject = uvRejection[filmType] || 97;
    return {
      primary: { label: "Estimated Total Cost", value: "$" + formatNumber(totalCost) },
      details: [
        { label: "Visible Light Transmission", value: formatNumber(vlt) + "%" },
        { label: "Heat Rejection", value: formatNumber(heatReject) + "%" },
        { label: "UV Rejection", value: formatNumber(uvReject) + "%" },
        { label: "Cost Per Window", value: "$" + formatNumber(perWindow) },
        { label: "Windows Tinted", value: formatNumber(windowCount) + (includeWindshield ? " + windshield strip" : "") }
      ]
    };
  }`,
  [
    { q: "What tint percentage is legal?", a: "Legal VLT varies by state and window position. Most states allow 35 percent or darker on rear windows but restrict front side windows to 35 to 70 percent VLT. Always check local laws before tinting." },
    { q: "What does VLT mean?", a: "VLT stands for Visible Light Transmission, the percentage of visible light that passes through the film. Lower VLT means darker tint. A 5 percent VLT allows only 5 percent of light through." },
    { q: "Is ceramic tint worth the extra cost?", a: "Ceramic tint provides the best heat rejection without interfering with electronics, and it does not fade over time like dyed films. It offers the best combination of visibility and heat reduction." }
  ],
  `Total Cost = (Number of Windows x Cost Per Window) + Windshield Strip
VLT = Percentage of visible light passing through
Heat Rejection varies by film type (15% dyed to 70% ceramic)`,
  ["car-tint-cost-calculator", "paint-protection-film-cost-calculator"]
);

add(
  "dash-cam-storage-calculator",
  "Dash Cam Storage Calculator",
  "Calculate how much video storage your dash cam needs based on resolution, recording hours, and whether you use loop recording.",
  "Everyday",
  "everyday",
  "~",
  ["dash cam storage", "dashcam memory card", "dash cam SD card", "dash cam recording time"],
  [
    '{ name: "resolution", label: "Recording Resolution", type: "select", options: [{ value: "1", label: "1080p (Full HD)" }, { value: "2", label: "1440p (2K QHD)" }, { value: "3", label: "2160p (4K UHD)" }], defaultValue: "1" }',
    '{ name: "dailyHours", label: "Daily Recording Hours", type: "number", min: 0.5, max: 24, defaultValue: 2 }',
    '{ name: "daysBeforeOverwrite", label: "Days Before Loop Overwrite", type: "number", min: 1, max: 30, defaultValue: 7 }',
    '{ name: "channels", label: "Camera Channels", type: "select", options: [{ value: "1", label: "Front Only" }, { value: "2", label: "Front + Rear" }, { value: "3", label: "Front + Rear + Interior" }], defaultValue: "1" }',
    '{ name: "parkingMode", label: "Parking Mode Recording", type: "select", options: [{ value: "0", label: "No" }, { value: "1", label: "Yes (add 4 hrs/day)" }], defaultValue: "0" }'
  ],
  `(inputs) => {
    const resolution = parseInt(inputs.resolution as string);
    const dailyHours = inputs.dailyHours as number;
    const days = inputs.daysBeforeOverwrite as number;
    const channels = parseInt(inputs.channels as string);
    const parking = parseInt(inputs.parkingMode as string);
    const gbPerHour = { 1: 6, 2: 10, 3: 18 };
    const ratePerHour = gbPerHour[resolution] || 6;
    const totalDailyHours = (dailyHours + (parking * 4)) * channels;
    const dailyGB = totalDailyHours * ratePerHour;
    const totalGB = dailyGB * days;
    const cardSizes = [32, 64, 128, 256, 512];
    const recommendedCard = cardSizes.find(s => s >= totalGB) || 512;
    return {
      primary: { label: "Storage Needed", value: formatNumber(Math.ceil(totalGB)) + " GB" },
      details: [
        { label: "Daily Storage Usage", value: formatNumber(Math.round(dailyGB * 10) / 10) + " GB" },
        { label: "Daily Recording Hours", value: formatNumber(totalDailyHours) + " hrs" },
        { label: "Data Rate Per Channel", value: formatNumber(ratePerHour) + " GB/hr" },
        { label: "Recommended Card Size", value: formatNumber(recommendedCard) + " GB" },
        { label: "Loop Coverage", value: formatNumber(days) + " days" }
      ]
    };
  }`,
  [
    { q: "What size SD card do I need for a dash cam?", a: "For a 1080p single-channel dash cam recording 2 hours daily with 7-day loop coverage, a 128 GB card is sufficient. 4K or dual-channel setups may need 256 GB or larger." },
    { q: "How long does a 128 GB card last in a dash cam?", a: "At 1080p with one camera, a 128 GB card holds approximately 21 hours of footage, or about 10 days at 2 hours of daily driving." },
    { q: "Should I use a regular SD card in my dash cam?", a: "No. Use a high-endurance micro SD card designed for continuous recording. Regular cards fail much faster under the constant write cycles of a dash cam." }
  ],
  `Daily Storage = (Driving Hours + Parking Hours) x Channels x GB Per Hour
Total Storage = Daily Storage x Days Before Overwrite
GB Per Hour: 1080p = 6 GB, 1440p = 10 GB, 4K = 18 GB`,
  ["car-annual-maintenance-cost-calculator", "car-fuel-tank-range-calculator"]
);

add(
  "car-seat-fit-calculator",
  "Car Seat Fit Calculator",
  "Determine the right car seat type for your child based on age, weight, and height following current safety guidelines.",
  "Everyday",
  "everyday",
  "~",
  ["car seat fit", "child car seat", "car seat type", "car seat safety", "child restraint calculator"],
  [
    '{ name: "childAge", label: "Child Age (months)", type: "number", min: 0, max: 144, defaultValue: 24 }',
    '{ name: "childWeight", label: "Child Weight (lbs)", type: "number", min: 4, max: 120, defaultValue: 30 }',
    '{ name: "childHeight", label: "Child Height (inches)", type: "number", min: 18, max: 60, defaultValue: 34 }',
    '{ name: "vehicleType", label: "Vehicle Type", type: "select", options: [{ value: "1", label: "Sedan" }, { value: "2", label: "SUV" }, { value: "3", label: "Minivan" }, { value: "4", label: "Truck (Extended Cab)" }], defaultValue: "1" }'
  ],
  `(inputs) => {
    const ageMonths = inputs.childAge as number;
    const weight = inputs.childWeight as number;
    const height = inputs.childHeight as number;
    const vehicle = parseInt(inputs.vehicleType as string);
    let seatType = "";
    let facing = "";
    let notes = "";
    if (ageMonths < 24 || weight < 25 || height < 30) {
      seatType = "Rear-Facing Infant/Convertible Seat";
      facing = "Rear-Facing";
      notes = "Keep rear-facing as long as possible, ideally until age 2 or max seat weight/height";
    } else if (weight < 65 && height < 49 && ageMonths < 84) {
      seatType = "Forward-Facing Convertible Seat with Harness";
      facing = "Forward-Facing";
      notes = "Use the harness until the child exceeds the seat weight or height limit";
    } else if (weight < 100 && height < 57 && ageMonths < 144) {
      seatType = "Booster Seat (High-Back or Backless)";
      facing = "Forward-Facing";
      notes = "Seat belt should fit properly across chest and lap when using booster";
    } else {
      seatType = "Vehicle Seat Belt Only";
      facing = "Forward-Facing";
      notes = "Belt should lie across upper thighs and chest, not stomach or neck";
    }
    const rearSeatSpace = { 1: "Standard", 2: "Ample", 3: "Ample", 4: "Limited" };
    return {
      primary: { label: "Recommended Seat Type", value: seatType },
      details: [
        { label: "Orientation", value: facing },
        { label: "Child Age", value: formatNumber(Math.floor(ageMonths / 12)) + " years " + formatNumber(ageMonths % 12) + " months" },
        { label: "Rear Seat Space", value: rearSeatSpace[vehicle] || "Standard" },
        { label: "Safety Note", value: notes }
      ]
    };
  }`,
  [
    { q: "When should a child switch from rear-facing to forward-facing?", a: "The American Academy of Pediatrics recommends keeping children rear-facing until at least age 2, or until they exceed the maximum weight or height limit of their rear-facing car seat." },
    { q: "When can my child use just a seat belt?", a: "Children should use a booster seat until the vehicle seat belt fits properly, typically when they are 4 feet 9 inches tall and between 8 and 12 years old." },
    { q: "Can I use a car seat in the front seat?", a: "Children under 13 should always ride in the back seat. A rear-facing car seat should never be placed in front of an active airbag." }
  ],
  `Rear-Facing: Under 2 years OR under 25 lbs OR under 30 inches
Forward-Facing Harness: 2-7 years AND under 65 lbs AND under 49 inches
Booster: Until seat belt fits properly (typically 4 ft 9 in, 80-100 lbs)`,
  ["car-annual-maintenance-cost-calculator", "car-fuel-tank-range-calculator"]
);

add(
  "engine-horsepower-to-weight-calculator",
  "Engine Horsepower-to-Weight Ratio Calculator",
  "Calculate your vehicle power-to-weight ratio and compare performance potential based on horsepower, torque, and curb weight.",
  "Everyday",
  "everyday",
  "~",
  ["horsepower to weight ratio", "power to weight", "car performance calculator", "HP per ton"],
  [
    '{ name: "horsepower", label: "Engine Horsepower (HP)", type: "number", min: 50, max: 2000, defaultValue: 300 }',
    '{ name: "torque", label: "Engine Torque (lb-ft)", type: "number", min: 50, max: 2000, defaultValue: 280 }',
    '{ name: "curbWeight", label: "Curb Weight (lbs)", type: "number", min: 1000, max: 10000, defaultValue: 3500 }',
    '{ name: "driverWeight", label: "Driver + Passenger Weight (lbs)", type: "number", min: 100, max: 600, defaultValue: 180 }'
  ],
  `(inputs) => {
    const hp = inputs.horsepower as number;
    const torque = inputs.torque as number;
    const curb = inputs.curbWeight as number;
    const driver = inputs.driverWeight as number;
    const totalWeight = curb + driver;
    const hpPerTon = Math.round(hp / (totalWeight / 2000) * 10) / 10;
    const lbsPerHp = Math.round(totalWeight / hp * 10) / 10;
    const torquePerTon = Math.round(torque / (totalWeight / 2000) * 10) / 10;
    let classification = "";
    if (hpPerTon > 400) classification = "Supercar Territory";
    else if (hpPerTon > 250) classification = "Sports Car";
    else if (hpPerTon > 150) classification = "Quick";
    else if (hpPerTon > 100) classification = "Average";
    else classification = "Economy";
    return {
      primary: { label: "HP Per Ton", value: formatNumber(hpPerTon) },
      details: [
        { label: "Lbs Per HP", value: formatNumber(lbsPerHp) + " lbs/HP" },
        { label: "Torque Per Ton", value: formatNumber(torquePerTon) + " lb-ft/ton" },
        { label: "Total Weight", value: formatNumber(totalWeight) + " lbs" },
        { label: "Performance Class", value: classification }
      ]
    };
  }`,
  [
    { q: "What is a good power-to-weight ratio?", a: "A ratio above 200 HP per ton is considered quick, above 300 is sports car territory, and above 400 puts you in supercar range. The average family sedan is around 100 to 150 HP per ton." },
    { q: "Is horsepower or torque more important?", a: "Horsepower determines top speed and high-RPM acceleration, while torque determines low-end pulling power and responsiveness. For everyday driving, torque often feels more impactful." },
    { q: "How does weight affect acceleration?", a: "Every 100 pounds of additional weight reduces acceleration by roughly 1 to 2 percent. Removing unnecessary weight is one of the most cost-effective ways to improve performance." }
  ],
  `HP Per Ton = Horsepower / (Total Weight / 2000)
Lbs Per HP = Total Weight / Horsepower
Total Weight = Curb Weight + Occupant Weight`,
  ["zero-to-sixty-time-calculator", "quarter-mile-time-calculator"]
);

add(
  "zero-to-sixty-time-calculator",
  "0-60 MPH Time Estimator",
  "Estimate your vehicle 0-60 mph acceleration time based on horsepower, weight, drivetrain, and transmission type.",
  "Everyday",
  "everyday",
  "~",
  ["0-60 time", "zero to sixty", "acceleration calculator", "0-60 mph estimator"],
  [
    '{ name: "horsepower", label: "Engine Horsepower (HP)", type: "number", min: 50, max: 2000, defaultValue: 300 }',
    '{ name: "curbWeight", label: "Curb Weight (lbs)", type: "number", min: 1000, max: 10000, defaultValue: 3500 }',
    '{ name: "drivetrain", label: "Drivetrain", type: "select", options: [{ value: "1", label: "Front-Wheel Drive" }, { value: "2", label: "Rear-Wheel Drive" }, { value: "3", label: "All-Wheel Drive" }], defaultValue: "2" }',
    '{ name: "transmission", label: "Transmission", type: "select", options: [{ value: "1", label: "Manual" }, { value: "2", label: "Automatic (Torque Converter)" }, { value: "3", label: "Dual-Clutch (DCT)" }, { value: "4", label: "CVT" }], defaultValue: "2" }'
  ],
  `(inputs) => {
    const hp = inputs.horsepower as number;
    const weight = inputs.curbWeight as number;
    const drivetrain = parseInt(inputs.drivetrain as string);
    const trans = parseInt(inputs.transmission as string);
    const ratio = weight / hp;
    const baseTime = Math.pow(ratio, 0.75) * 0.45;
    const drivetrainMult = { 1: 1.05, 2: 1.0, 3: 0.92 };
    const transMult = { 1: 1.0, 2: 1.02, 3: 0.95, 4: 1.08 };
    const estimated060 = Math.round(baseTime * (drivetrainMult[drivetrain] || 1) * (transMult[trans] || 1) * 100) / 100;
    const speed30 = Math.round(estimated060 * 0.38 * 100) / 100;
    let rating = "";
    if (estimated060 < 3.5) rating = "Supercar Quick";
    else if (estimated060 < 5) rating = "Very Fast";
    else if (estimated060 < 7) rating = "Quick";
    else if (estimated060 < 9) rating = "Average";
    else rating = "Leisurely";
    return {
      primary: { label: "Estimated 0-60 MPH", value: formatNumber(estimated060) + " seconds" },
      details: [
        { label: "0-30 MPH", value: formatNumber(speed30) + " seconds" },
        { label: "Weight-to-Power Ratio", value: formatNumber(Math.round(ratio * 10) / 10) + " lbs/HP" },
        { label: "Performance Rating", value: rating }
      ]
    };
  }`,
  [
    { q: "How accurate is this 0-60 estimate?", a: "This calculator uses a simplified physics model and is typically accurate within 0.5 to 1.5 seconds. Real-world times depend on tire grip, launch technique, altitude, temperature, and gearing." },
    { q: "Does AWD improve 0-60 times?", a: "All-wheel drive improves traction off the line, which typically reduces 0-60 times by 0.3 to 0.8 seconds compared to RWD on the same vehicle, especially in high-power applications." },
    { q: "Why are DCT transmissions faster?", a: "Dual-clutch transmissions pre-select the next gear for near-instantaneous shifts with minimal power interruption, reducing shift times to under 100 milliseconds." }
  ],
  `Base Time = (Weight/HP)^0.75 x 0.45
Adjusted Time = Base Time x Drivetrain Factor x Transmission Factor
AWD factor: 0.92, FWD: 1.05, RWD: 1.0`,
  ["engine-horsepower-to-weight-calculator", "quarter-mile-time-calculator"]
);

add(
  "quarter-mile-time-calculator",
  "Quarter Mile Time Calculator",
  "Estimate quarter-mile elapsed time and trap speed based on vehicle horsepower and weight for drag strip performance prediction.",
  "Everyday",
  "everyday",
  "~",
  ["quarter mile time", "drag strip calculator", "ET calculator", "quarter mile trap speed"],
  [
    '{ name: "horsepower", label: "Engine Horsepower (HP)", type: "number", min: 50, max: 3000, defaultValue: 350 }',
    '{ name: "curbWeight", label: "Vehicle Weight (lbs)", type: "number", min: 1000, max: 10000, defaultValue: 3500 }',
    '{ name: "driverWeight", label: "Driver Weight (lbs)", type: "number", min: 100, max: 400, defaultValue: 180 }',
    '{ name: "altitude", label: "Altitude (feet)", type: "number", min: 0, max: 10000, defaultValue: 500 }'
  ],
  `(inputs) => {
    const hp = inputs.horsepower as number;
    const vehicle = inputs.curbWeight as number;
    const driver = inputs.driverWeight as number;
    const altitude = inputs.altitude as number;
    const totalWeight = vehicle + driver;
    const altitudeFactor = 1 + (altitude / 30000);
    const effectiveHP = hp / altitudeFactor;
    const et = 5.825 * Math.pow(totalWeight / effectiveHP, 1 / 3);
    const trapSpeed = 234.24 * Math.pow(effectiveHP / totalWeight, 1 / 3);
    const eighthMileET = Math.round(et * 0.632 * 1000) / 1000;
    const etRounded = Math.round(et * 1000) / 1000;
    const trapRounded = Math.round(trapSpeed * 10) / 10;
    return {
      primary: { label: "Quarter Mile ET", value: formatNumber(etRounded) + " seconds" },
      details: [
        { label: "Trap Speed", value: formatNumber(trapRounded) + " mph" },
        { label: "1/8 Mile ET", value: formatNumber(eighthMileET) + " seconds" },
        { label: "Effective HP (altitude adjusted)", value: formatNumber(Math.round(effectiveHP)) },
        { label: "Total Weight", value: formatNumber(totalWeight) + " lbs" }
      ]
    };
  }`,
  [
    { q: "What is the quarter mile ET formula?", a: "The most common formula is the Roger Huntington equation: ET = 5.825 x (Weight/HP)^(1/3). This assumes reasonable traction and is accurate for most street vehicles." },
    { q: "How does altitude affect quarter mile time?", a: "Naturally aspirated engines lose roughly 3 percent power per 1,000 feet of elevation. Turbocharged vehicles are less affected since the turbo compensates for thinner air." },
    { q: "What is a good quarter mile time?", a: "A stock sports car typically runs 12 to 14 seconds, performance sedans 14 to 16 seconds, and economy cars 16 to 18 seconds. Under 10 seconds is professional drag racing territory." }
  ],
  `Quarter Mile ET = 5.825 x (Weight / HP) ^ (1/3)
Trap Speed = 234.24 x (HP / Weight) ^ (1/3)
1/8 Mile ET = Quarter Mile ET x 0.632`,
  ["zero-to-sixty-time-calculator", "engine-horsepower-to-weight-calculator"]
);

add(
  "car-loan-refinance-calculator",
  "Car Loan Refinance Calculator",
  "Compare your current auto loan with a refinanced loan to see potential monthly savings, total interest reduction, and break-even timeline.",
  "Finance",
  "finance",
  "$",
  ["car loan refinance", "auto loan refinance", "car refinance savings", "vehicle loan comparison"],
  [
    '{ name: "currentBalance", label: "Current Loan Balance ($)", type: "number", min: 1000, max: 100000, defaultValue: 20000 }',
    '{ name: "currentRate", label: "Current Interest Rate (%)", type: "number", min: 0.5, max: 30, defaultValue: 7.5 }',
    '{ name: "currentMonthsLeft", label: "Months Remaining on Current Loan", type: "number", min: 1, max: 84, defaultValue: 48 }',
    '{ name: "newRate", label: "New Interest Rate (%)", type: "number", min: 0.5, max: 30, defaultValue: 4.5 }',
    '{ name: "newTerm", label: "New Loan Term (months)", type: "number", min: 12, max: 84, defaultValue: 48 }',
    '{ name: "refiCost", label: "Refinance Fees ($)", type: "number", min: 0, max: 1000, defaultValue: 200 }'
  ],
  `(inputs) => {
    const balance = inputs.currentBalance as number;
    const currentRate = inputs.currentRate as number / 100 / 12;
    const currentMonths = inputs.currentMonthsLeft as number;
    const newRate = inputs.newRate as number / 100 / 12;
    const newTerm = inputs.newTerm as number;
    const refiCost = inputs.refiCost as number;
    const currentPayment = balance * (currentRate * Math.pow(1 + currentRate, currentMonths)) / (Math.pow(1 + currentRate, currentMonths) - 1);
    const newPayment = balance * (newRate * Math.pow(1 + newRate, newTerm)) / (Math.pow(1 + newRate, newTerm) - 1);
    const currentTotalInterest = (currentPayment * currentMonths) - balance;
    const newTotalInterest = (newPayment * newTerm) - balance;
    const monthlySavings = currentPayment - newPayment;
    const totalSavings = currentTotalInterest - newTotalInterest - refiCost;
    const breakEvenMonths = monthlySavings > 0 ? Math.ceil(refiCost / monthlySavings) : 0;
    return {
      primary: { label: "Monthly Savings", value: "$" + formatNumber(Math.round(monthlySavings * 100) / 100) },
      details: [
        { label: "Current Monthly Payment", value: "$" + formatNumber(Math.round(currentPayment * 100) / 100) },
        { label: "New Monthly Payment", value: "$" + formatNumber(Math.round(newPayment * 100) / 100) },
        { label: "Current Total Interest", value: "$" + formatNumber(Math.round(currentTotalInterest)) },
        { label: "New Total Interest", value: "$" + formatNumber(Math.round(newTotalInterest)) },
        { label: "Net Savings (after fees)", value: "$" + formatNumber(Math.round(totalSavings)) },
        { label: "Break-Even Period", value: formatNumber(breakEvenMonths) + " months" }
      ]
    };
  }`,
  [
    { q: "When should I refinance my car loan?", a: "Refinancing makes sense when interest rates have dropped significantly, your credit score has improved, or you want to change your loan term. Generally a 1 to 2 percent rate reduction makes refinancing worthwhile." },
    { q: "Does refinancing hurt my credit score?", a: "A refinance application triggers a hard inquiry that may temporarily lower your score by 5 to 10 points. However, lower payments can improve your debt-to-income ratio over time." },
    { q: "Can I refinance an upside-down car loan?", a: "Some lenders will refinance when you owe more than the car is worth, but terms may not be as favorable. Paying down the balance closer to the car value first yields better refinance rates." }
  ],
  `Monthly Payment = Balance x [r(1+r)^n] / [(1+r)^n - 1]
Monthly Savings = Current Payment - New Payment
Net Savings = (Current Interest - New Interest) - Refinance Fees
Break-Even = Refinance Fees / Monthly Savings`,
  ["car-depreciation-curve-calculator", "car-subscription-vs-ownership-calculator"]
);

add(
  "car-subscription-vs-ownership-calculator",
  "Car Subscription vs Ownership Calculator",
  "Compare the total monthly cost of a car subscription service against traditional vehicle ownership including loan payments, insurance, and maintenance.",
  "Finance",
  "finance",
  "$",
  ["car subscription", "car subscription vs buying", "vehicle subscription cost", "car ownership cost comparison"],
  [
    '{ name: "subscriptionMonthly", label: "Monthly Subscription Fee ($)", type: "number", min: 200, max: 3000, defaultValue: 600 }',
    '{ name: "loanPayment", label: "Monthly Loan Payment ($)", type: "number", min: 0, max: 2000, defaultValue: 450 }',
    '{ name: "insuranceCost", label: "Monthly Insurance ($)", type: "number", min: 50, max: 500, defaultValue: 150 }',
    '{ name: "maintenanceCost", label: "Monthly Maintenance Avg ($)", type: "number", min: 20, max: 300, defaultValue: 80 }',
    '{ name: "depreciationMonthly", label: "Monthly Depreciation ($)", type: "number", min: 50, max: 1000, defaultValue: 250 }',
    '{ name: "comparisonMonths", label: "Comparison Period (months)", type: "number", min: 6, max: 60, defaultValue: 24 }'
  ],
  `(inputs) => {
    const subscription = inputs.subscriptionMonthly as number;
    const loan = inputs.loanPayment as number;
    const insurance = inputs.insuranceCost as number;
    const maintenance = inputs.maintenanceCost as number;
    const depreciation = inputs.depreciationMonthly as number;
    const months = inputs.comparisonMonths as number;
    const ownershipMonthly = loan + insurance + maintenance + depreciation;
    const subscriptionTotal = subscription * months;
    const ownershipTotal = ownershipMonthly * months;
    const difference = subscriptionTotal - ownershipTotal;
    const subscriptionIncludes = "Insurance, maintenance, and depreciation included";
    return {
      primary: { label: "Monthly Cost Difference", value: "$" + formatNumber(Math.round(Math.abs(difference / months))) + (difference > 0 ? " (ownership cheaper)" : " (subscription cheaper)") },
      details: [
        { label: "Subscription Monthly", value: "$" + formatNumber(subscription) },
        { label: "Ownership Monthly", value: "$" + formatNumber(Math.round(ownershipMonthly)) },
        { label: "Subscription Total (" + months + " mo)", value: "$" + formatNumber(subscriptionTotal) },
        { label: "Ownership Total (" + months + " mo)", value: "$" + formatNumber(Math.round(ownershipTotal)) },
        { label: "Subscription Benefit", value: subscriptionIncludes },
        { label: "Better Option", value: difference > 0 ? "Ownership" : "Subscription" }
      ]
    };
  }`,
  [
    { q: "What is a car subscription?", a: "A car subscription is an all-inclusive monthly fee that covers the vehicle, insurance, maintenance, and roadside assistance. You can typically swap vehicles or cancel with short notice." },
    { q: "Is a car subscription worth it?", a: "Subscriptions offer flexibility and convenience but typically cost more than ownership for long-term use. They are ideal for people who want to change cars frequently or avoid long-term commitments." },
    { q: "What does a car subscription include?", a: "Most subscriptions include the vehicle, insurance, scheduled maintenance, roadside assistance, and sometimes registration fees. Fuel and tolls are typically not included." }
  ],
  `Ownership Monthly = Loan + Insurance + Maintenance + Depreciation
Subscription Total = Monthly Fee x Months
Ownership Total = Ownership Monthly x Months
Difference = Subscription Total - Ownership Total`,
  ["car-loan-refinance-calculator", "car-depreciation-curve-calculator"]
);

add(
  "tire-tread-life-calculator",
  "Tire Tread Life Calculator",
  "Estimate remaining tire life and replacement timeline based on current tread depth, wear rate, and driving habits.",
  "Everyday",
  "everyday",
  "~",
  ["tire tread life", "tire wear calculator", "tread depth", "tire replacement timeline"],
  [
    '{ name: "currentTread", label: "Current Tread Depth (32nds of inch)", type: "number", min: 1, max: 12, defaultValue: 6 }',
    '{ name: "originalTread", label: "Original Tread Depth (32nds)", type: "number", min: 8, max: 14, defaultValue: 10 }',
    '{ name: "milesDriven", label: "Miles Driven on These Tires", type: "number", min: 100, max: 100000, defaultValue: 25000 }',
    '{ name: "monthlyMiles", label: "Monthly Miles Driven", type: "number", min: 100, max: 10000, defaultValue: 1200 }',
    '{ name: "tireSetCost", label: "Replacement Tire Set Cost ($)", type: "number", min: 200, max: 3000, defaultValue: 600 }'
  ],
  `(inputs) => {
    const current = inputs.currentTread as number;
    const original = inputs.originalTread as number;
    const milesDriven = inputs.milesDriven as number;
    const monthly = inputs.monthlyMiles as number;
    const tireCost = inputs.tireSetCost as number;
    const minimumTread = 2;
    const usableTreadWorn = original - current;
    const usableTreadRemaining = current - minimumTread;
    const wearRate = usableTreadWorn > 0 ? milesDriven / usableTreadWorn : 0;
    const milesRemaining = Math.round(usableTreadRemaining * wearRate);
    const monthsRemaining = monthly > 0 ? Math.round(milesRemaining / monthly * 10) / 10 : 0;
    const percentWorn = Math.round(usableTreadWorn / (original - minimumTread) * 100);
    const costPerMile = milesDriven > 0 ? Math.round(tireCost / (milesDriven + milesRemaining) * 10000) / 10000 : 0;
    return {
      primary: { label: "Estimated Miles Remaining", value: formatNumber(milesRemaining) + " mi" },
      details: [
        { label: "Months Until Replacement", value: formatNumber(monthsRemaining) },
        { label: "Tread Worn", value: formatNumber(percentWorn) + "%" },
        { label: "Wear Rate", value: formatNumber(Math.round(wearRate)) + " mi per 1/32 inch" },
        { label: "Cost Per Mile", value: "$" + formatNumber(costPerMile) },
        { label: "Status", value: current <= 2 ? "Replace Now" : current <= 4 ? "Replace Soon" : "Good" }
      ]
    };
  }`,
  [
    { q: "What is the minimum safe tread depth?", a: "The legal minimum is 2/32 of an inch in most states, but tire performance drops significantly below 4/32. In rain, tires with less than 4/32 tread have substantially reduced grip." },
    { q: "How do I measure tread depth?", a: "Use a tread depth gauge or the penny test. Insert a penny head-first into the tread. If you can see all of Lincoln head, your tread is below 2/32 and tires need replacement." },
    { q: "Do front tires wear faster than rear tires?", a: "On front-wheel-drive vehicles, front tires typically wear faster due to steering and drivetrain forces. Regular rotation every 5,000 to 7,500 miles helps equalize wear across all four tires." }
  ],
  `Wear Rate = Miles Driven / Tread Worn (32nds)
Miles Remaining = Usable Tread Left x Wear Rate
Usable Tread Left = Current Depth - Minimum (2/32)`,
  ["tire-rotation-schedule-calculator", "wheel-alignment-frequency-calculator"]
);

add(
  "car-ac-recharge-cost-calculator",
  "Car AC Recharge Cost Calculator",
  "Estimate the cost of recharging your vehicle air conditioning system based on refrigerant type, system capacity, and service method.",
  "Everyday",
  "everyday",
  "~",
  ["car AC recharge", "auto air conditioning", "AC refrigerant cost", "car AC service"],
  [
    '{ name: "refrigerantType", label: "Refrigerant Type", type: "select", options: [{ value: "1", label: "R-134a (most cars 1994-2015)" }, { value: "2", label: "R-1234yf (2016+ vehicles)" }, { value: "3", label: "R-12 (pre-1994 vehicles)" }], defaultValue: "1" }',
    '{ name: "systemCapacity", label: "System Capacity (oz)", type: "number", min: 10, max: 60, defaultValue: 28 }',
    '{ name: "serviceMethod", label: "Service Method", type: "select", options: [{ value: "1", label: "DIY Recharge Kit" }, { value: "2", label: "Independent Shop" }, { value: "3", label: "Dealership" }], defaultValue: "2" }',
    '{ name: "leakTest", label: "Include Leak Test", type: "select", options: [{ value: "0", label: "No" }, { value: "1", label: "Yes" }], defaultValue: "1" }'
  ],
  `(inputs) => {
    const refType = parseInt(inputs.refrigerantType as string);
    const capacity = inputs.systemCapacity as number;
    const method = parseInt(inputs.serviceMethod as string);
    const leakTest = parseInt(inputs.leakTest as string);
    const refCostPerOz = { 1: 3, 2: 8, 3: 15 };
    const laborCosts = { 1: 0, 2: 120, 3: 200 };
    const leakTestCost = { 1: 0, 2: 50, 3: 75 };
    const refrigerantCost = Math.round(capacity * (refCostPerOz[refType] || 3));
    const labor = laborCosts[method] || 120;
    const leak = leakTest * (leakTestCost[method] || 50);
    const diyCost = refType === 1 ? 40 : refType === 2 ? 80 : 0;
    const totalCost = method === 1 ? diyCost : refrigerantCost + labor + leak;
    return {
      primary: { label: "Estimated Total Cost", value: "$" + formatNumber(totalCost) },
      details: [
        { label: "Refrigerant Cost", value: method === 1 ? "Included in kit" : "$" + formatNumber(refrigerantCost) },
        { label: "Labor Cost", value: "$" + formatNumber(labor) },
        { label: "Leak Test", value: leakTest ? "$" + formatNumber(leak) : "Not included" },
        { label: "System Capacity", value: formatNumber(capacity) + " oz" }
      ]
    };
  }`,
  [
    { q: "How often does car AC need recharging?", a: "A properly sealed AC system should not need regular recharging. If your AC needs frequent topping off, there is likely a leak that should be repaired to avoid compressor damage." },
    { q: "What is the difference between R-134a and R-1234yf?", a: "R-1234yf is a newer, more environmentally friendly refrigerant used in most vehicles built after 2015. It costs significantly more than R-134a but has a much lower global warming potential." },
    { q: "Can I recharge my car AC myself?", a: "DIY recharge kits work for R-134a systems and are simple to use. R-1234yf requires special equipment and is best handled by professionals. Overcharging can damage the compressor." }
  ],
  `Professional Cost = Refrigerant (capacity x price/oz) + Labor + Leak Test
DIY Cost = Recharge Kit Price
R-134a: ~$3/oz, R-1234yf: ~$8/oz, R-12: ~$15/oz`,
  ["car-annual-maintenance-cost-calculator", "car-battery-replacement-cost-calculator"]
);

add(
  "timing-belt-replacement-calculator",
  "Timing Belt Replacement Calculator",
  "Calculate when your timing belt or chain needs replacement and estimate the cost based on engine type and service complexity.",
  "Everyday",
  "everyday",
  "~",
  ["timing belt replacement", "timing chain", "timing belt cost", "engine timing service"],
  [
    '{ name: "currentMileage", label: "Current Mileage", type: "number", min: 0, max: 500000, defaultValue: 85000 }',
    '{ name: "lastReplacementMileage", label: "Last Replacement Mileage", type: "number", min: 0, max: 500000, defaultValue: 0 }',
    '{ name: "timingType", label: "Timing Component Type", type: "select", options: [{ value: "1", label: "Timing Belt" }, { value: "2", label: "Timing Chain" }], defaultValue: "1" }',
    '{ name: "engineConfig", label: "Engine Configuration", type: "select", options: [{ value: "1", label: "4-Cylinder (simpler)" }, { value: "2", label: "V6 (moderate)" }, { value: "3", label: "V8 or Complex Layout" }], defaultValue: "1" }',
    '{ name: "includeWaterPump", label: "Replace Water Pump Too", type: "select", options: [{ value: "0", label: "No" }, { value: "1", label: "Yes (recommended)" }], defaultValue: "1" }'
  ],
  `(inputs) => {
    const current = inputs.currentMileage as number;
    const lastReplacement = inputs.lastReplacementMileage as number;
    const timingType = parseInt(inputs.timingType as string);
    const engineConfig = parseInt(inputs.engineConfig as string);
    const includeWP = parseInt(inputs.includeWaterPump as string);
    const intervals = { 1: 90000, 2: 200000 };
    const interval = intervals[timingType] || 90000;
    const baseLaborCost = { 1: 400, 2: 600, 3: 900 };
    const basePartsCost = { 1: 150, 2: 80 };
    const waterPumpCost = includeWP ? 150 : 0;
    const labor = baseLaborCost[engineConfig] || 400;
    const parts = (basePartsCost[timingType] || 150) + waterPumpCost;
    const totalCost = labor + parts;
    const milesSinceLast = current - lastReplacement;
    const milesUntilDue = interval - milesSinceLast;
    return {
      primary: { label: "Next Replacement At", value: formatNumber(lastReplacement + interval) + " mi" },
      details: [
        { label: "Replacement Interval", value: formatNumber(interval) + " mi" },
        { label: "Miles Until Due", value: formatNumber(Math.max(milesUntilDue, 0)) },
        { label: "Parts Cost", value: "$" + formatNumber(parts) },
        { label: "Labor Cost", value: "$" + formatNumber(labor) },
        { label: "Total Estimated Cost", value: "$" + formatNumber(totalCost) },
        { label: "Status", value: milesUntilDue <= 0 ? "Overdue - Replace Immediately" : milesUntilDue < 10000 ? "Due Soon" : "On Schedule" }
      ]
    };
  }`,
  [
    { q: "How often should a timing belt be replaced?", a: "Most timing belts should be replaced every 60,000 to 100,000 miles or 7 to 10 years, whichever comes first. Check your owner manual for the exact interval." },
    { q: "What happens if a timing belt breaks?", a: "On an interference engine, a broken timing belt causes pistons to strike valves, resulting in thousands of dollars in engine damage. On non-interference engines, the engine simply stops running." },
    { q: "Should I replace the water pump with the timing belt?", a: "Yes. The water pump is accessed during timing belt replacement, so replacing it at the same time saves significant labor cost compared to doing it separately later." }
  ],
  `Timing Belt Interval: ~90,000 miles
Timing Chain Interval: ~200,000 miles
Total Cost = Labor (by engine complexity) + Parts + Water Pump (optional)`,
  ["spark-plug-replacement-calculator", "car-annual-maintenance-cost-calculator"]
);

add(
  "car-fuel-tank-range-calculator",
  "Car Fuel Tank Range Calculator",
  "Calculate your vehicle total driving range, cost per mile, and remaining range based on fuel tank size, MPG, and current fuel level.",
  "Everyday",
  "everyday",
  "~",
  ["fuel tank range", "driving range calculator", "miles per tank", "fuel range estimator"],
  [
    '{ name: "tankSize", label: "Fuel Tank Size (gallons)", type: "number", min: 5, max: 50, defaultValue: 14 }',
    '{ name: "mpgCity", label: "City MPG", type: "number", min: 5, max: 100, defaultValue: 28 }',
    '{ name: "mpgHighway", label: "Highway MPG", type: "number", min: 5, max: 100, defaultValue: 36 }',
    '{ name: "cityPercent", label: "City Driving (%)", type: "number", min: 0, max: 100, defaultValue: 60 }',
    '{ name: "fuelLevel", label: "Current Fuel Level (%)", type: "number", min: 0, max: 100, defaultValue: 50 }',
    '{ name: "fuelPrice", label: "Fuel Price Per Gallon ($)", type: "number", min: 1, max: 10, defaultValue: 3.50 }'
  ],
  `(inputs) => {
    const tankSize = inputs.tankSize as number;
    const mpgCity = inputs.mpgCity as number;
    const mpgHighway = inputs.mpgHighway as number;
    const cityPct = inputs.cityPercent as number / 100;
    const fuelLevel = inputs.fuelLevel as number / 100;
    const fuelPrice = inputs.fuelPrice as number;
    const combinedMPG = 1 / (cityPct / mpgCity + (1 - cityPct) / mpgHighway);
    const totalRange = Math.round(tankSize * combinedMPG);
    const remainingGallons = tankSize * fuelLevel;
    const remainingRange = Math.round(remainingGallons * combinedMPG);
    const costPerMile = fuelPrice / combinedMPG;
    const costToFill = (tankSize - remainingGallons) * fuelPrice;
    return {
      primary: { label: "Total Range (Full Tank)", value: formatNumber(totalRange) + " miles" },
      details: [
        { label: "Combined MPG", value: formatNumber(Math.round(combinedMPG * 10) / 10) },
        { label: "Remaining Range", value: formatNumber(remainingRange) + " miles" },
        { label: "Remaining Fuel", value: formatNumber(Math.round(remainingGallons * 10) / 10) + " gallons" },
        { label: "Cost Per Mile", value: "$" + formatNumber(Math.round(costPerMile * 1000) / 1000) },
        { label: "Cost to Fill Up", value: "$" + formatNumber(Math.round(costToFill * 100) / 100) }
      ]
    };
  }`,
  [
    { q: "How is combined MPG calculated?", a: "Combined MPG uses a harmonic mean weighted by driving mix. For 60 percent city and 40 percent highway, it accounts for the lower efficiency of city driving proportionally." },
    { q: "How far can I drive on empty?", a: "Most vehicles can travel 30 to 50 miles after the fuel light turns on, but this varies widely by vehicle. Running on empty can damage the fuel pump and should be avoided." },
    { q: "Does driving style affect range?", a: "Aggressive acceleration, high speeds, and frequent braking can reduce fuel economy by 15 to 33 percent. Smooth, steady driving at moderate speeds maximizes your range." }
  ],
  `Combined MPG = 1 / (City% / City MPG + Highway% / Highway MPG)
Total Range = Tank Size x Combined MPG
Cost Per Mile = Fuel Price / Combined MPG`,
  ["car-annual-maintenance-cost-calculator", "dash-cam-storage-calculator"]
);

add(
  "car-brake-rotor-life-calculator",
  "Car Brake Rotor Life Calculator",
  "Estimate remaining brake rotor life and replacement cost based on rotor thickness, minimum specification, and driving patterns.",
  "Everyday",
  "everyday",
  "~",
  ["brake rotor life", "rotor replacement", "brake disc wear", "rotor thickness calculator"],
  [
    '{ name: "currentThickness", label: "Current Rotor Thickness (mm)", type: "number", min: 15, max: 40, defaultValue: 26 }',
    '{ name: "minimumThickness", label: "Minimum Thickness Spec (mm)", type: "number", min: 12, max: 35, defaultValue: 22 }',
    '{ name: "originalThickness", label: "Original Thickness (mm)", type: "number", min: 20, max: 40, defaultValue: 30 }',
    '{ name: "milesSinceNew", label: "Miles Since Rotors New", type: "number", min: 0, max: 200000, defaultValue: 35000 }',
    '{ name: "monthlyMiles", label: "Monthly Miles Driven", type: "number", min: 100, max: 10000, defaultValue: 1200 }',
    '{ name: "rotorSetCost", label: "Rotor Set Cost ($)", type: "number", min: 50, max: 1000, defaultValue: 200 }'
  ],
  `(inputs) => {
    const current = inputs.currentThickness as number;
    const minimum = inputs.minimumThickness as number;
    const original = inputs.originalThickness as number;
    const miles = inputs.milesSinceNew as number;
    const monthly = inputs.monthlyMiles as number;
    const rotorCost = inputs.rotorSetCost as number;
    const totalWorn = original - current;
    const usableRemaining = current - minimum;
    const wearRate = totalWorn > 0 ? miles / totalWorn : 0;
    const milesRemaining = Math.round(usableRemaining * wearRate);
    const monthsRemaining = monthly > 0 ? Math.round(milesRemaining / monthly * 10) / 10 : 0;
    const percentWorn = Math.round(totalWorn / (original - minimum) * 100);
    const laborEstimate = 150;
    const totalReplacementCost = rotorCost + laborEstimate;
    return {
      primary: { label: "Estimated Miles Remaining", value: formatNumber(milesRemaining) + " mi" },
      details: [
        { label: "Months Until Replacement", value: formatNumber(monthsRemaining) },
        { label: "Rotor Wear", value: formatNumber(Math.min(percentWorn, 100)) + "%" },
        { label: "Remaining Thickness Above Min", value: formatNumber(Math.round(usableRemaining * 10) / 10) + " mm" },
        { label: "Replacement Cost (parts + labor)", value: "$" + formatNumber(totalReplacementCost) },
        { label: "Status", value: usableRemaining <= 0 ? "Replace Now" : usableRemaining <= 1 ? "Replace Soon" : "Good" }
      ]
    };
  }`,
  [
    { q: "How do I know if my brake rotors need replacing?", a: "Measure rotor thickness with a micrometer and compare to the minimum specification stamped on the rotor. Visible grooves deeper than 1mm, blue discoloration, or vibration during braking also indicate replacement is needed." },
    { q: "Can brake rotors be resurfaced instead of replaced?", a: "Rotors can be resurfaced if there is enough material above the minimum thickness specification. However, modern rotors are thinner and many cannot be resurfaced. Replacement is often more cost-effective." },
    { q: "How long do brake rotors last?", a: "Brake rotors typically last 50,000 to 80,000 miles depending on driving habits, vehicle weight, and whether brake pads were replaced on time. Aggressive driving and frequent towing shorten rotor life." }
  ],
  `Wear Rate = Miles Driven / Thickness Worn (mm)
Miles Remaining = Usable Thickness Left x Wear Rate
Usable Remaining = Current Thickness - Minimum Spec`,
  ["brake-pad-life-calculator", "tire-tread-life-calculator"]
);

add(
  "vehicle-registration-renewal-calculator",
  "Vehicle Registration Renewal Calculator",
  "Estimate your annual vehicle registration renewal cost based on vehicle value, weight, age, and state fee structures.",
  "Finance",
  "finance",
  "$",
  ["vehicle registration", "registration renewal cost", "car registration fee", "annual registration"],
  [
    '{ name: "vehicleValue", label: "Vehicle Value ($)", type: "number", min: 500, max: 200000, defaultValue: 25000 }',
    '{ name: "vehicleWeight", label: "Vehicle Weight (lbs)", type: "number", min: 1000, max: 10000, defaultValue: 3500 }',
    '{ name: "vehicleAge", label: "Vehicle Age (years)", type: "number", min: 0, max: 30, defaultValue: 3 }',
    '{ name: "feeStructure", label: "Fee Structure Type", type: "select", options: [{ value: "1", label: "Flat Fee ($75-150)" }, { value: "2", label: "Value-Based (ad valorem)" }, { value: "3", label: "Weight-Based" }, { value: "4", label: "Combined (value + weight)" }], defaultValue: "2" }',
    '{ name: "emissionsTest", label: "Emissions Test Required", type: "select", options: [{ value: "0", label: "No" }, { value: "1", label: "Yes (+$25-50)" }], defaultValue: "0" }'
  ],
  `(inputs) => {
    const value = inputs.vehicleValue as number;
    const weight = inputs.vehicleWeight as number;
    const age = inputs.vehicleAge as number;
    const structure = parseInt(inputs.feeStructure as string);
    const emissions = parseInt(inputs.emissionsTest as string);
    let baseFee = 0;
    if (structure === 1) baseFee = 100;
    else if (structure === 2) baseFee = Math.round(value * 0.01 * Math.max(1 - age * 0.05, 0.3));
    else if (structure === 3) baseFee = Math.round(weight * 0.02);
    else baseFee = Math.round(value * 0.006 * Math.max(1 - age * 0.05, 0.3) + weight * 0.01);
    const titleFee = 15;
    const plateFee = age === 0 ? 35 : 0;
    const emissionsCost = emissions * 35;
    const totalCost = baseFee + titleFee + plateFee + emissionsCost;
    const monthlyEquiv = Math.round(totalCost / 12 * 100) / 100;
    return {
      primary: { label: "Estimated Annual Registration", value: "$" + formatNumber(totalCost) },
      details: [
        { label: "Base Registration Fee", value: "$" + formatNumber(baseFee) },
        { label: "Title/Processing Fee", value: "$" + formatNumber(titleFee) },
        { label: "New Plate Fee", value: plateFee > 0 ? "$" + formatNumber(plateFee) : "N/A" },
        { label: "Emissions Test Fee", value: emissions ? "$" + formatNumber(emissionsCost) : "Not required" },
        { label: "Monthly Equivalent", value: "$" + formatNumber(monthlyEquiv) }
      ]
    };
  }`,
  [
    { q: "Why do registration fees vary by state?", a: "Each state uses different formulas. Some charge flat fees, others base fees on vehicle value, weight, age, or combinations. Some states also include property tax within registration fees." },
    { q: "Do registration fees decrease as a car ages?", a: "In value-based states, registration fees decrease as the vehicle depreciates. In flat-fee or weight-based states, the fee remains relatively constant regardless of age." },
    { q: "What happens if I miss my registration renewal?", a: "Late renewal typically incurs penalty fees ranging from $10 to $100 or more. Driving with expired registration can result in traffic citations and fines in most states." }
  ],
  `Flat Fee: Fixed amount ($75-150)
Value-Based: Vehicle Value x Tax Rate x Age Factor
Weight-Based: Vehicle Weight x Rate Per Pound
Total = Base Fee + Title Fee + Plate Fee + Emissions`,
  ["car-depreciation-curve-calculator", "car-annual-maintenance-cost-calculator"]
);

add(
  "car-annual-maintenance-cost-calculator",
  "Car Annual Maintenance Cost Calculator",
  "Estimate total annual vehicle maintenance cost including oil changes, tires, brakes, and scheduled services based on driving habits and vehicle age.",
  "Finance",
  "finance",
  "$",
  ["annual maintenance cost", "car maintenance budget", "vehicle upkeep cost", "car ownership cost"],
  [
    '{ name: "vehicleAge", label: "Vehicle Age (years)", type: "number", min: 0, max: 25, defaultValue: 5 }',
    '{ name: "annualMiles", label: "Annual Miles Driven", type: "number", min: 1000, max: 50000, defaultValue: 15000 }',
    '{ name: "vehicleClass", label: "Vehicle Class", type: "select", options: [{ value: "1", label: "Economy" }, { value: "2", label: "Mid-Range" }, { value: "3", label: "Luxury" }, { value: "4", label: "Truck/SUV" }], defaultValue: "2" }',
    '{ name: "oilType", label: "Oil Type", type: "select", options: [{ value: "1", label: "Conventional" }, { value: "2", label: "Synthetic" }], defaultValue: "2" }',
    '{ name: "diyPercent", label: "DIY Maintenance (%)", type: "number", min: 0, max: 100, defaultValue: 20 }'
  ],
  `(inputs) => {
    const age = inputs.vehicleAge as number;
    const annualMiles = inputs.annualMiles as number;
    const vehicleClass = parseInt(inputs.vehicleClass as string);
    const oilType = parseInt(inputs.oilType as string);
    const diyPct = inputs.diyPercent as number / 100;
    const classMultiplier = { 1: 0.7, 2: 1.0, 3: 1.8, 4: 1.2 };
    const ageMultiplier = 1 + Math.max(age - 3, 0) * 0.08;
    const oilChanges = oilType === 1 ? Math.ceil(annualMiles / 5000) : Math.ceil(annualMiles / 7500);
    const oilChangeCost = oilType === 1 ? 45 : 75;
    const annualOilCost = oilChanges * oilChangeCost;
    const tiresCostAnnual = Math.round(annualMiles / 50000 * 600);
    const brakesCostAnnual = Math.round(annualMiles / 50000 * 400);
    const scheduledService = 200 * ageMultiplier;
    const unexpectedRepairs = age > 5 ? 300 * (age - 5) * 0.3 : 0;
    const classMult = classMultiplier[vehicleClass] || 1;
    const subtotal = (annualOilCost + tiresCostAnnual + brakesCostAnnual + scheduledService + unexpectedRepairs) * classMult;
    const diyDiscount = subtotal * diyPct * 0.4;
    const totalCost = Math.round(subtotal - diyDiscount);
    const monthlyCost = Math.round(totalCost / 12);
    const costPerMile = Math.round(totalCost / annualMiles * 1000) / 1000;
    return {
      primary: { label: "Estimated Annual Maintenance", value: "$" + formatNumber(totalCost) },
      details: [
        { label: "Monthly Average", value: "$" + formatNumber(monthlyCost) },
        { label: "Cost Per Mile", value: "$" + formatNumber(costPerMile) },
        { label: "Oil Changes/Year", value: formatNumber(oilChanges) + " ($" + formatNumber(annualOilCost) + ")" },
        { label: "Tires (annualized)", value: "$" + formatNumber(Math.round(tiresCostAnnual * classMult)) },
        { label: "DIY Savings", value: "$" + formatNumber(Math.round(diyDiscount)) }
      ]
    };
  }`,
  [
    { q: "How much does car maintenance cost per year?", a: "The average annual maintenance cost is $800 to $1,200 for vehicles under 5 years old. Costs increase with age, and luxury vehicles can cost 50 to 80 percent more than economy cars." },
    { q: "Does DIY maintenance really save money?", a: "DIY maintenance on basic tasks like oil changes, air filters, and wiper blades can save 30 to 50 percent on labor costs. However, complex repairs often require specialized tools and expertise." },
    { q: "Do older cars cost more to maintain?", a: "Yes. Maintenance costs typically increase 8 to 15 percent per year after the warranty period ends, as more components wear out and require replacement or repair." }
  ],
  `Annual Cost = (Oil + Tires + Brakes + Service + Repairs) x Class Multiplier - DIY Savings
Age Multiplier = 1 + max(Age - 3, 0) x 0.08
DIY Savings = Subtotal x DIY% x 40% labor discount`,
  ["car-depreciation-curve-calculator", "oil-change-interval-calculator"]
);
