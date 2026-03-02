const fs = require('fs');
const path = require('path');
const CALC_DIR = path.join(__dirname, '..', 'src', 'calculators');

const existingSlugs = new Set();
for (const file of fs.readdirSync(CALC_DIR).filter(f => f.endsWith('.ts') && f !== 'types.ts' && f !== 'index.ts')) {
  const m = fs.readFileSync(path.join(CALC_DIR, file), 'utf8').match(/slug:\s*"([^"]+)"/);
  if (m) existingSlugs.add(m[1]);
}
console.log(`Existing: ${existingSlugs.size}`);

function eName(slug) {
  const c = slug.replace(/^(\d)/, 'n$1').replace(/-(\w)/g, (_, c) => c.toUpperCase());
  return c.endsWith('Calculator') ? c : c + 'Calculator';
}

const calcs = [];

function add(slug, title, desc, cat, cs, icon, kw, fields, calcBody, faq, formula, rel) {
  calcs.push({ slug, title, desc, cat, cs, icon, kw, fields, calcBody, faq, formula, rel: rel || [] });
}

// === BATCH 13: 100 CALCULATORS ===

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
add(
  "smartphone-screen-repair-cost-calculator",
  "Smartphone Screen Repair Cost Calculator",
  "Estimate the cost of repairing a cracked or broken smartphone screen based on phone brand, model tier, and repair method to help you decide between DIY and professional service.",
  "Everyday",
  "everyday",
  "~",
  ["smartphone screen repair cost", "phone screen replacement", "cracked screen fix price", "phone repair estimate"],
  [
    '{ name: "phoneBrand", label: "Phone Brand", type: "select", options: [{ value: "1", label: "Apple iPhone" }, { value: "2", label: "Samsung Galaxy" }, { value: "3", label: "Google Pixel" }, { value: "4", label: "OnePlus" }, { value: "5", label: "Other Android" }], defaultValue: "1" }',
    '{ name: "modelTier", label: "Model Tier", type: "select", options: [{ value: "1", label: "Budget" }, { value: "2", label: "Mid-Range" }, { value: "3", label: "Flagship" }, { value: "4", label: "Ultra/Pro Max" }], defaultValue: "3" }',
    '{ name: "repairMethod", label: "Repair Method", type: "select", options: [{ value: "1", label: "Official Service Center" }, { value: "2", label: "Third-Party Shop" }, { value: "3", label: "DIY Repair" }], defaultValue: "2" }',
    '{ name: "hasInsurance", label: "Has Insurance/Protection Plan", type: "select", options: [{ value: "0", label: "No" }, { value: "1", label: "Yes" }], defaultValue: "0" }'
  ],
  `(inputs) => {
    const brand = parseInt(inputs.phoneBrand as string);
    const tier = parseInt(inputs.modelTier as string);
    const method = parseInt(inputs.repairMethod as string);
    const insured = parseInt(inputs.hasInsurance as string);
    const baseCosts = { 1: [129, 199, 279, 379], 2: [99, 169, 249, 329], 3: [89, 149, 219, 279], 4: [79, 129, 199, 249], 5: [69, 109, 179, 229] };
    const brandCosts = baseCosts[brand] || baseCosts[5];
    const baseCost = brandCosts[tier - 1] || brandCosts[2];
    const methodMultiplier = { 1: 1.0, 2: 0.7, 3: 0.4 };
    const repairCost = Math.round(baseCost * (methodMultiplier[method] || 0.7));
    const insuranceDeductible = insured === 1 ? Math.round(repairCost * 0.3) : repairCost;
    const savings = repairCost - insuranceDeductible;
    const phoneValue = tier * 250 + brand * 50;
    const repairPercent = Math.round((insuranceDeductible / phoneValue) * 100);
    return {
      primary: { label: "Estimated Repair Cost", value: "$" + formatNumber(insuranceDeductible) },
      details: [
        { label: "Full Price Without Insurance", value: "$" + formatNumber(repairCost) },
        { label: "Insurance Savings", value: "$" + formatNumber(savings) },
        { label: "Repair as % of Phone Value", value: formatNumber(repairPercent) + "%" },
        { label: "Recommendation", value: repairPercent > 50 ? "Consider upgrading" : "Repair is worthwhile" }
      ]
    };
  }`,
  [
    "Q: How much does it cost to fix a cracked phone screen?||A: Screen repair costs vary widely from $50 for budget Android DIY fixes to over $350 for flagship iPhone repairs at official service centers. The brand, model, and repair method are the biggest factors.",
    "Q: Is it worth repairing a phone screen or buying a new phone?||A: If the repair cost exceeds 50 percent of the phone current value, upgrading often makes more financial sense. For newer phones, repair is usually the better option.",
    "Q: Does phone insurance cover screen repair?||A: Most phone insurance plans and protection programs cover accidental screen damage with a deductible ranging from $29 to $99 depending on the plan and device tier."
  ],
  `Repair Cost = Base Cost (by brand and tier) x Method Multiplier\nInsurance Cost = Repair Cost x Deductible Rate (30%)\nRepair % of Value = Insurance Cost / Estimated Phone Value x 100`,
  ["electric-bill-device-cost-calculator", "phone-battery-health-calculator"]
);

add(
  "streaming-service-cost-comparison-calculator",
  "Streaming Service Cost Comparison Calculator",
  "Compare monthly and annual costs of multiple streaming subscriptions to see your total entertainment spending and find potential savings.",
  "Finance",
  "finance",
  "$",
  ["streaming cost comparison", "subscription cost total", "streaming budget", "netflix hulu disney cost", "streaming services"],
  [
    '{ name: "service1", label: "Service 1 Monthly Cost ($)", type: "number", min: 0, max: 50, defaultValue: 15.49 }',
    '{ name: "service2", label: "Service 2 Monthly Cost ($)", type: "number", min: 0, max: 50, defaultValue: 7.99 }',
    '{ name: "service3", label: "Service 3 Monthly Cost ($)", type: "number", min: 0, max: 50, defaultValue: 13.99 }',
    '{ name: "service4", label: "Service 4 Monthly Cost ($)", type: "number", min: 0, max: 50, defaultValue: 9.99 }',
    '{ name: "service5", label: "Service 5 Monthly Cost ($)", type: "number", min: 0, max: 50, defaultValue: 0 }'
  ],
  `(inputs) => {
    const s1 = inputs.service1 as number;
    const s2 = inputs.service2 as number;
    const s3 = inputs.service3 as number;
    const s4 = inputs.service4 as number;
    const s5 = inputs.service5 as number;
    const monthlyTotal = s1 + s2 + s3 + s4 + s5;
    const annualTotal = monthlyTotal * 12;
    const activeServices = [s1, s2, s3, s4, s5].filter(s => s > 0).length;
    const avgPerService = activeServices > 0 ? monthlyTotal / activeServices : 0;
    const dailyCost = monthlyTotal / 30.44;
    return {
      primary: { label: "Total Monthly Cost", value: "$" + formatNumber(Math.round(monthlyTotal * 100) / 100) },
      details: [
        { label: "Annual Cost", value: "$" + formatNumber(Math.round(annualTotal * 100) / 100) },
        { label: "Active Subscriptions", value: formatNumber(activeServices) },
        { label: "Average Per Service", value: "$" + formatNumber(Math.round(avgPerService * 100) / 100) },
        { label: "Daily Cost", value: "$" + formatNumber(Math.round(dailyCost * 100) / 100) }
      ]
    };
  }`,
  [
    "Q: How much does the average person spend on streaming?||A: The average US household spends approximately $50 to $80 per month on streaming services. Many subscribers maintain 3 to 5 active services simultaneously.",
    "Q: How can I reduce my streaming costs?||A: Rotate services monthly by subscribing only to the one you are actively watching. Use ad-supported tiers, share family plans, and watch for annual plan discounts to save money.",
    "Q: Is cable TV cheaper than streaming services?||A: Cable TV averages $80 to $120 per month. Streaming can be cheaper if you limit yourself to 2 or 3 services, but stacking many subscriptions can exceed cable costs."
  ],
  `Monthly Total = Sum of all service costs\nAnnual Total = Monthly Total x 12\nAverage Per Service = Monthly Total / Number of Active Services`,
  ["electric-bill-device-cost-calculator", "gaming-pc-build-budget-calculator"]
);

add(
  "gaming-pc-build-budget-calculator",
  "Gaming PC Build Budget Calculator",
  "Plan your gaming PC build budget by allocating costs across major components including CPU, GPU, RAM, storage, and peripherals.",
  "Finance",
  "finance",
  "$",
  ["gaming pc budget", "pc build cost", "computer build calculator", "custom pc price", "gaming rig budget"],
  [
    '{ name: "totalBudget", label: "Total Budget ($)", type: "number", min: 500, max: 10000, defaultValue: 1500 }',
    '{ name: "buildTier", label: "Build Tier", type: "select", options: [{ value: "1", label: "Budget (1080p)" }, { value: "2", label: "Mid-Range (1440p)" }, { value: "3", label: "High-End (4K)" }, { value: "4", label: "Enthusiast (4K Max)" }], defaultValue: "2" }',
    '{ name: "includeMonitor", label: "Include Monitor", type: "select", options: [{ value: "0", label: "No" }, { value: "1", label: "Yes" }], defaultValue: "0" }',
    '{ name: "includePeripherals", label: "Include Peripherals", type: "select", options: [{ value: "0", label: "No" }, { value: "1", label: "Yes" }], defaultValue: "0" }'
  ],
  `(inputs) => {
    const budget = inputs.totalBudget as number;
    const tier = parseInt(inputs.buildTier as string);
    const monitor = parseInt(inputs.includeMonitor as string);
    const peripherals = parseInt(inputs.includePeripherals as string);
    const monitorCost = monitor === 1 ? budget * 0.15 : 0;
    const peripheralCost = peripherals === 1 ? budget * 0.08 : 0;
    const coreBudget = budget - monitorCost - peripheralCost;
    const gpuPercent = { 1: 0.35, 2: 0.38, 3: 0.40, 4: 0.42 };
    const gpu = Math.round(coreBudget * (gpuPercent[tier] || 0.38));
    const cpu = Math.round(coreBudget * 0.22);
    const mobo = Math.round(coreBudget * 0.12);
    const ram = Math.round(coreBudget * 0.08);
    const storage = Math.round(coreBudget * 0.08);
    const psu = Math.round(coreBudget * 0.06);
    const pcCase = Math.round(coreBudget * 0.06);
    const cooling = coreBudget - gpu - cpu - mobo - ram - storage - psu - pcCase;
    return {
      primary: { label: "GPU Budget", value: "$" + formatNumber(gpu) },
      details: [
        { label: "CPU", value: "$" + formatNumber(cpu) },
        { label: "Motherboard", value: "$" + formatNumber(mobo) },
        { label: "RAM + Storage", value: "$" + formatNumber(ram + storage) },
        { label: "PSU + Case + Cooling", value: "$" + formatNumber(psu + pcCase + cooling) },
        { label: "Monitor", value: "$" + formatNumber(Math.round(monitorCost)) },
        { label: "Peripherals", value: "$" + formatNumber(Math.round(peripheralCost)) }
      ]
    };
  }`,
  [
    "Q: How much should I spend on a GPU for gaming?||A: The GPU should receive 35 to 42 percent of your core build budget. For 1080p gaming around $200-350 works, 1440p gaming needs $350-600, and 4K gaming typically requires $600 or more.",
    "Q: What is a good budget for a gaming PC?||A: A capable 1080p gaming PC can be built for $600-800. For 1440p high settings expect $1000-1500. A top-tier 4K build can cost $2000-3000 or more.",
    "Q: Should I buy prebuilt or build my own PC?||A: Building your own PC typically saves 10-20 percent and lets you choose higher quality components. Prebuilts offer convenience and a single warranty but may cut corners on the power supply or cooling."
  ],
  `GPU Budget = Core Budget x GPU Allocation % (35-42%)\nCPU Budget = Core Budget x 22%\nCore Budget = Total Budget - Monitor - Peripherals`,
  ["streaming-service-cost-comparison-calculator", "electric-bill-device-cost-calculator", "monitor-size-distance-calculator"]
);

add(
  "monitor-size-distance-calculator",
  "Monitor Size and Viewing Distance Calculator",
  "Calculate the optimal viewing distance for any monitor or TV based on screen size, resolution, and panel type for the best visual experience.",
  "Everyday",
  "everyday",
  "~",
  ["monitor viewing distance", "screen size distance", "optimal monitor distance", "desk monitor size", "ergonomic screen distance"],
  [
    '{ name: "screenSize", label: "Screen Size (inches diagonal)", type: "number", min: 13, max: 100, defaultValue: 27 }',
    '{ name: "resolution", label: "Resolution", type: "select", options: [{ value: "1", label: "1080p (Full HD)" }, { value: "2", label: "1440p (QHD)" }, { value: "3", label: "2160p (4K UHD)" }, { value: "4", label: "720p (HD)" }], defaultValue: "2" }',
    '{ name: "aspectRatio", label: "Aspect Ratio", type: "select", options: [{ value: "16", label: "16:9 Standard" }, { value: "21", label: "21:9 Ultrawide" }, { value: "32", label: "32:9 Super Ultrawide" }], defaultValue: "16" }',
    '{ name: "usage", label: "Primary Use", type: "select", options: [{ value: "1", label: "Productivity/Office" }, { value: "2", label: "Gaming" }, { value: "3", label: "Movie Watching" }], defaultValue: "1" }'
  ],
  `(inputs) => {
    const size = inputs.screenSize as number;
    const resolution = parseInt(inputs.resolution as string);
    const aspect = parseInt(inputs.aspectRatio as string);
    const usage = parseInt(inputs.usage as string);
    const resMultiplier = { 1: 1.5, 2: 1.2, 3: 1.0, 4: 2.0 };
    const usageMultiplier = { 1: 1.0, 2: 0.9, 3: 1.3 };
    const minDistance = Math.round(size * (resMultiplier[resolution] || 1.2) * (usageMultiplier[usage] || 1.0));
    const maxDistance = Math.round(minDistance * 1.5);
    const optimalDistance = Math.round((minDistance + maxDistance) / 2);
    const ppi = Math.round(Math.sqrt(Math.pow(1920 * resolution, 2) + Math.pow(1080 * resolution, 2)) / size);
    const screenWidthInches = Math.round(size * (aspect === 16 ? 0.872 : aspect === 21 ? 0.928 : 0.964) * 10) / 10;
    return {
      primary: { label: "Optimal Distance", value: formatNumber(optimalDistance) + " inches" },
      details: [
        { label: "Minimum Distance", value: formatNumber(minDistance) + " inches" },
        { label: "Maximum Distance", value: formatNumber(maxDistance) + " inches" },
        { label: "Approx. Screen Width", value: formatNumber(screenWidthInches) + " inches" },
        { label: "Pixel Density (PPI)", value: formatNumber(ppi) }
      ]
    };
  }`,
  [
    "Q: How far should I sit from a 27 inch monitor?||A: For a 27-inch 1440p monitor used for general productivity the ideal distance is about 32 to 40 inches (approximately arm length). For gaming you can sit slightly closer at 28 to 36 inches.",
    "Q: Does resolution affect viewing distance?||A: Yes. Higher resolution monitors like 4K can be viewed from closer distances without seeing individual pixels, while 1080p monitors need more distance to appear sharp.",
    "Q: What size monitor is best for a desk?||A: For a standard desk depth of 24-30 inches, a 24 to 27 inch monitor at 1440p is ideal. If your desk is deeper, you can comfortably use a 32 inch or larger display."
  ],
  `Optimal Distance = Screen Size x Resolution Factor x Usage Factor\nMinimum Distance = Size x Resolution Multiplier x Usage Multiplier\nMaximum Distance = Minimum Distance x 1.5`,
  ["tv-viewing-distance-calculator", "screen-resolution-comparison-calculator", "projector-throw-distance-calculator"]
);

add(
  "usb-transfer-speed-calculator",
  "USB Transfer Speed Calculator",
  "Calculate file transfer times over USB connections based on USB version, file size, and real-world speed factors.",
  "Everyday",
  "everyday",
  "~",
  ["usb transfer speed", "file transfer time usb", "usb 3.0 speed", "usb copy time", "data transfer usb"],
  [
    '{ name: "fileSize", label: "File Size (GB)", type: "number", min: 0.01, max: 10000, defaultValue: 10 }',
    '{ name: "usbVersion", label: "USB Version", type: "select", options: [{ value: "60", label: "USB 2.0 (480 Mbps)" }, { value: "625", label: "USB 3.0 (5 Gbps)" }, { value: "1250", label: "USB 3.1 (10 Gbps)" }, { value: "2500", label: "USB 3.2 (20 Gbps)" }, { value: "5000", label: "USB 4.0 (40 Gbps)" }], defaultValue: "625" }',
    '{ name: "efficiency", label: "Real-World Efficiency (%)", type: "number", min: 20, max: 100, defaultValue: 60 }',
    '{ name: "numFiles", label: "Number of Files", type: "number", min: 1, max: 1000000, defaultValue: 1 }'
  ],
  `(inputs) => {
    const fileSizeGB = inputs.fileSize as number;
    const maxSpeedMBps = inputs.usbVersion as number;
    const efficiency = inputs.efficiency as number / 100;
    const numFiles = inputs.numFiles as number;
    const realSpeedMBps = maxSpeedMBps * efficiency;
    const fileSizeMB = fileSizeGB * 1024;
    const overhead = numFiles > 1 ? numFiles * 0.002 : 0;
    const transferTime = (fileSizeMB / realSpeedMBps) + overhead;
    const hours = Math.floor(transferTime / 3600);
    const minutes = Math.floor((transferTime % 3600) / 60);
    const seconds = Math.round(transferTime % 60);
    const timeStr = hours > 0 ? hours + "h " + minutes + "m " + seconds + "s" : minutes > 0 ? minutes + "m " + seconds + "s" : seconds + "s";
    return {
      primary: { label: "Transfer Time", value: timeStr },
      details: [
        { label: "Real-World Speed", value: formatNumber(Math.round(realSpeedMBps)) + " MB/s" },
        { label: "Max Theoretical Speed", value: formatNumber(Math.round(maxSpeedMBps)) + " MB/s" },
        { label: "Total Data", value: formatNumber(Math.round(fileSizeMB)) + " MB" },
        { label: "File Overhead", value: formatNumber(Math.round(overhead * 100) / 100) + " seconds" }
      ]
    };
  }`,
  [
    "Q: What is the real-world speed of USB 3.0?||A: USB 3.0 has a theoretical maximum of 5 Gbps (625 MB/s), but real-world speeds are typically 300-400 MB/s or about 50-65 percent of the maximum due to protocol overhead and drive limitations.",
    "Q: Why is my USB transfer so slow?||A: Common causes include using a USB 2.0 port or cable instead of 3.0, a slow source or destination drive, transferring many small files, or background processes consuming bandwidth.",
    "Q: Does USB 4.0 make a noticeable difference?||A: USB 4.0 at 40 Gbps is extremely fast for large file transfers and external SSDs, but you need compatible devices on both ends. For flash drives, the drive itself is usually the bottleneck."
  ],
  `Transfer Time = (File Size in MB / Real Speed in MB/s) + File Overhead\nReal Speed = Max Speed x Efficiency %\nFile Overhead = Number of Files x 0.002 seconds`,
  ["data-transfer-time-calculator", "ssd-cost-per-gb-calculator"]
);

add(
  "ssd-cost-per-gb-calculator",
  "SSD Cost Per GB Calculator",
  "Compare solid state drive values by calculating cost per gigabyte across different SSD types, capacities, and interfaces to find the best deal.",
  "Finance",
  "finance",
  "$",
  ["ssd cost per gb", "solid state drive value", "ssd price comparison", "nvme vs sata cost", "storage cost calculator"],
  [
    '{ name: "ssdPrice", label: "SSD Price ($)", type: "number", min: 10, max: 5000, defaultValue: 89 }',
    '{ name: "capacity", label: "Capacity (GB)", type: "number", min: 32, max: 16000, defaultValue: 1000 }',
    '{ name: "ssdType", label: "SSD Type", type: "select", options: [{ value: "1", label: "SATA 2.5-inch" }, { value: "2", label: "NVMe PCIe 3.0" }, { value: "3", label: "NVMe PCIe 4.0" }, { value: "4", label: "NVMe PCIe 5.0" }], defaultValue: "2" }',
    '{ name: "comparePrice", label: "Compare SSD Price ($)", type: "number", min: 0, max: 5000, defaultValue: 159 }',
    '{ name: "compareCapacity", label: "Compare Capacity (GB)", type: "number", min: 32, max: 16000, defaultValue: 2000 }'
  ],
  `(inputs) => {
    const price1 = inputs.ssdPrice as number;
    const cap1 = inputs.capacity as number;
    const ssdType = parseInt(inputs.ssdType as string);
    const price2 = inputs.comparePrice as number;
    const cap2 = inputs.compareCapacity as number;
    const costPerGB1 = price1 / cap1;
    const costPerGB2 = price2 > 0 ? price2 / cap2 : 0;
    const costPerTB1 = costPerGB1 * 1000;
    const costPerTB2 = costPerGB2 * 1000;
    const speedLabels = { 1: "Up to 550 MB/s", 2: "Up to 3500 MB/s", 3: "Up to 7000 MB/s", 4: "Up to 12000 MB/s" };
    const betterDeal = costPerGB2 > 0 ? (costPerGB1 < costPerGB2 ? "SSD 1 is cheaper per GB" : costPerGB1 > costPerGB2 ? "SSD 2 is cheaper per GB" : "Both are equal value") : "Add comparison SSD";
    return {
      primary: { label: "Cost Per GB (SSD 1)", value: "$" + formatNumber(Math.round(costPerGB1 * 1000) / 1000) },
      details: [
        { label: "Cost Per TB (SSD 1)", value: "$" + formatNumber(Math.round(costPerTB1 * 100) / 100) },
        { label: "Cost Per GB (SSD 2)", value: costPerGB2 > 0 ? "$" + formatNumber(Math.round(costPerGB2 * 1000) / 1000) : "N/A" },
        { label: "Cost Per TB (SSD 2)", value: costPerGB2 > 0 ? "$" + formatNumber(Math.round(costPerTB2 * 100) / 100) : "N/A" },
        { label: "Max Read Speed", value: speedLabels[ssdType] || "Unknown" },
        { label: "Better Deal", value: betterDeal }
      ]
    };
  }`,
  [
    "Q: What is a good cost per GB for an SSD?||A: In 2024-2025, a good cost per GB for SATA SSDs is around $0.05-0.08 and for NVMe drives around $0.06-0.10. Prices vary by capacity and interface generation.",
    "Q: Is NVMe worth the extra cost over SATA?||A: For everyday use and gaming, NVMe offers noticeable improvements in boot and load times. For video editing, large file transfers, and professional workloads the speed difference is substantial and worth the premium.",
    "Q: How much SSD storage do I need?||A: 500GB is minimum for a modern system. 1TB is recommended for gaming. Content creators and professionals should consider 2TB or more for their working drives."
  ],
  `Cost Per GB = SSD Price / Capacity (GB)\nCost Per TB = Cost Per GB x 1000`,
  ["usb-transfer-speed-calculator", "nas-drive-cost-calculator", "gaming-pc-build-budget-calculator"]
);

add(
  "wireless-router-range-calculator",
  "Wireless Router Range Calculator",
  "Estimate the effective Wi-Fi coverage area of your wireless router based on frequency band, walls, and obstructions for optimal router placement.",
  "Everyday",
  "everyday",
  "~",
  ["wifi range calculator", "router coverage area", "wireless signal range", "wifi distance estimator", "router placement"],
  [
    '{ name: "routerType", label: "Router Standard", type: "select", options: [{ value: "1", label: "Wi-Fi 5 (802.11ac)" }, { value: "2", label: "Wi-Fi 6 (802.11ax)" }, { value: "3", label: "Wi-Fi 6E" }, { value: "4", label: "Wi-Fi 7 (802.11be)" }], defaultValue: "2" }',
    '{ name: "band", label: "Frequency Band", type: "select", options: [{ value: "24", label: "2.4 GHz (longer range)" }, { value: "5", label: "5 GHz (faster speed)" }, { value: "6", label: "6 GHz (fastest, shortest range)" }], defaultValue: "24" }',
    '{ name: "walls", label: "Number of Walls to Penetrate", type: "number", min: 0, max: 10, defaultValue: 2 }',
    '{ name: "wallType", label: "Wall Material", type: "select", options: [{ value: "1", label: "Drywall (light)" }, { value: "2", label: "Wood (medium)" }, { value: "3", label: "Brick/Concrete (heavy)" }, { value: "4", label: "Metal (severe)" }], defaultValue: "1" }'
  ],
  `(inputs) => {
    const router = parseInt(inputs.routerType as string);
    const band = parseInt(inputs.band as string);
    const walls = inputs.walls as number;
    const wallType = parseInt(inputs.wallType as string);
    const baseRange = { 24: 150, 5: 80, 6: 50 };
    const routerBonus = { 1: 1.0, 2: 1.15, 3: 1.2, 4: 1.3 };
    const wallLoss = { 1: 0.08, 2: 0.12, 3: 0.20, 4: 0.35 };
    const maxRange = Math.round((baseRange[band] || 100) * (routerBonus[router] || 1.0));
    const effectiveRange = Math.round(maxRange * Math.pow(1 - (wallLoss[wallType] || 0.1), walls));
    const coverageArea = Math.round(Math.PI * Math.pow(effectiveRange, 2));
    const signalLoss = Math.round((1 - effectiveRange / maxRange) * 100);
    return {
      primary: { label: "Effective Range", value: formatNumber(effectiveRange) + " feet" },
      details: [
        { label: "Max Open-Air Range", value: formatNumber(maxRange) + " feet" },
        { label: "Coverage Area", value: formatNumber(coverageArea) + " sq ft" },
        { label: "Signal Loss from Walls", value: formatNumber(signalLoss) + "%" },
        { label: "Recommendation", value: effectiveRange < 30 ? "Consider a mesh system" : effectiveRange < 60 ? "Good for small spaces" : "Good coverage" }
      ]
    };
  }`,
  [
    "Q: How far does a Wi-Fi router reach?||A: A typical router reaches 100-150 feet on the 2.4 GHz band in open air. Walls, floors, and obstructions significantly reduce this range. The 5 GHz band offers faster speeds but shorter range of 50-80 feet.",
    "Q: Does Wi-Fi 6 have better range than Wi-Fi 5?||A: Wi-Fi 6 offers 10-15 percent better range than Wi-Fi 5 along with improved performance in congested environments. The biggest improvement is in handling multiple devices simultaneously.",
    "Q: Where should I place my router for best coverage?||A: Place your router in a central elevated location away from walls, metal objects, and other electronics. Avoid closets, corners, and basements for optimal signal distribution."
  ],
  `Effective Range = Max Range x (1 - Wall Loss per Wall) ^ Number of Walls\nCoverage Area = Pi x Effective Range^2\nMax Range = Base Range (by band) x Router Bonus`,
  ["bluetooth-range-estimator-calculator", "security-camera-storage-calculator"]
);

add(
  "pc-power-supply-calculator",
  "PC Power Supply Calculator",
  "Estimate the wattage needed for your PC power supply based on CPU, GPU, RAM, storage, and peripheral power draw to choose the right PSU.",
  "Everyday",
  "everyday",
  "~",
  ["pc power supply calculator", "psu wattage calculator", "computer wattage", "power supply sizing", "pc watt requirements"],
  [
    '{ name: "cpuTdp", label: "CPU TDP (Watts)", type: "number", min: 15, max: 350, defaultValue: 105 }',
    '{ name: "gpuTdp", label: "GPU TDP (Watts)", type: "number", min: 0, max: 600, defaultValue: 250 }',
    '{ name: "ramSticks", label: "RAM Sticks", type: "number", min: 1, max: 8, defaultValue: 2 }',
    '{ name: "storageDevices", label: "Storage Drives (SSD/HDD)", type: "number", min: 1, max: 10, defaultValue: 2 }',
    '{ name: "fans", label: "Case Fans", type: "number", min: 1, max: 12, defaultValue: 4 }'
  ],
  `(inputs) => {
    const cpuTdp = inputs.cpuTdp as number;
    const gpuTdp = inputs.gpuTdp as number;
    const ramSticks = inputs.ramSticks as number;
    const storage = inputs.storageDevices as number;
    const fans = inputs.fans as number;
    const ramPower = ramSticks * 5;
    const storagePower = storage * 8;
    const fanPower = fans * 3;
    const motherboard = 75;
    const misc = 25;
    const totalDraw = cpuTdp + gpuTdp + ramPower + storagePower + fanPower + motherboard + misc;
    const recommended = Math.ceil(totalDraw * 1.25 / 50) * 50;
    const headroom = recommended - totalDraw;
    const efficiency80Plus = Math.round(totalDraw / 0.87);
    return {
      primary: { label: "Recommended PSU Wattage", value: formatNumber(recommended) + "W" },
      details: [
        { label: "Estimated Total Draw", value: formatNumber(totalDraw) + "W" },
        { label: "Headroom", value: formatNumber(headroom) + "W" },
        { label: "Wall Draw (80+ Gold)", value: formatNumber(efficiency80Plus) + "W" },
        { label: "CPU + GPU Draw", value: formatNumber(cpuTdp + gpuTdp) + "W" }
      ]
    };
  }`,
  [
    "Q: How do I know what wattage PSU I need?||A: Add up the TDP of your CPU and GPU, then add approximately 100-150W for other components. Multiply the total by 1.25 for headroom. Most gaming PCs need 550-850W PSUs.",
    "Q: What happens if my PSU is too small?||A: An undersized power supply can cause system crashes, random shutdowns, component damage, or fail to boot at all. GPU power spikes can trip overcurrent protection on inadequate PSUs.",
    "Q: Is a higher wattage PSU less efficient?||A: PSUs are most efficient at 40-60 percent load. A significantly oversized PSU running at very low load can be slightly less efficient, but the difference is small. A modest amount of headroom is always recommended."
  ],
  `Total Draw = CPU TDP + GPU TDP + RAM + Storage + Fans + Motherboard + Misc\nRecommended PSU = Total Draw x 1.25 (rounded up to nearest 50W)\nWall Draw = Total Draw / PSU Efficiency`,
  ["gaming-pc-build-budget-calculator", "electric-bill-device-cost-calculator", "ups-runtime-calculator"]
);

add(
  "rgb-led-strip-calculator",
  "RGB LED Strip Calculator",
  "Calculate the total power consumption, required power supply, and cost of running RGB LED strips based on strip length, LED density, and usage hours.",
  "Everyday",
  "everyday",
  "~",
  ["led strip calculator", "rgb led power", "led strip wattage", "led strip power supply", "addressable led calculator"],
  [
    '{ name: "stripLength", label: "Total Strip Length (meters)", type: "number", min: 0.5, max: 50, defaultValue: 5 }',
    '{ name: "ledDensity", label: "LEDs Per Meter", type: "select", options: [{ value: "30", label: "30 LEDs/m (Standard)" }, { value: "60", label: "60 LEDs/m (High Density)" }, { value: "144", label: "144 LEDs/m (Ultra Dense)" }], defaultValue: "60" }',
    '{ name: "wattsPerLed", label: "Watts Per LED", type: "number", min: 0.05, max: 0.5, defaultValue: 0.2 }',
    '{ name: "hoursPerDay", label: "Hours Used Per Day", type: "number", min: 1, max: 24, defaultValue: 6 }',
    '{ name: "electricRate", label: "Electricity Rate ($/kWh)", type: "number", min: 0.05, max: 0.60, defaultValue: 0.13 }'
  ],
  `(inputs) => {
    const length = inputs.stripLength as number;
    const density = inputs.ledDensity as number;
    const wattsPerLed = inputs.wattsPerLed as number;
    const hours = inputs.hoursPerDay as number;
    const rate = inputs.electricRate as number;
    const totalLeds = Math.round(length * density);
    const totalWatts = totalLeds * wattsPerLed;
    const psuWatts = Math.ceil(totalWatts * 1.2 / 10) * 10;
    const psuAmps = Math.round(psuWatts / 12 * 10) / 10;
    const dailyKwh = totalWatts * hours / 1000;
    const monthlyKwh = dailyKwh * 30.44;
    const monthlyCost = monthlyKwh * rate;
    const annualCost = monthlyCost * 12;
    return {
      primary: { label: "Total Power Draw", value: formatNumber(Math.round(totalWatts * 10) / 10) + "W" },
      details: [
        { label: "Total LEDs", value: formatNumber(totalLeds) },
        { label: "Recommended PSU", value: formatNumber(psuWatts) + "W / " + formatNumber(psuAmps) + "A (12V)" },
        { label: "Monthly Energy Use", value: formatNumber(Math.round(monthlyKwh * 100) / 100) + " kWh" },
        { label: "Monthly Electricity Cost", value: "$" + formatNumber(Math.round(monthlyCost * 100) / 100) },
        { label: "Annual Electricity Cost", value: "$" + formatNumber(Math.round(annualCost * 100) / 100) }
      ]
    };
  }`,
  [
    "Q: How many watts does an LED strip use?||A: A standard 5-meter LED strip with 60 LEDs per meter uses about 60 watts at full brightness. Actual power depends on LED type, density, and brightness level.",
    "Q: What power supply do I need for LED strips?||A: Choose a power supply rated at least 20 percent above the total strip wattage. Most LED strips run on 12V or 24V DC, so match the voltage to your strip specification.",
    "Q: Are LED strips expensive to run?||A: LED strips are very energy efficient. A typical 5-meter strip running 6 hours daily costs about $0.50 to $1.50 per month in electricity depending on your local rate."
  ],
  `Total Watts = Length x LED Density x Watts Per LED\nRecommended PSU = Total Watts x 1.2 (rounded up)\nMonthly Cost = (Total Watts x Hours/Day x 30.44 / 1000) x Rate`,
  ["electric-bill-device-cost-calculator", "pc-power-supply-calculator"]
);

add(
  "3d-printer-filament-cost-calculator",
  "3D Printer Filament Cost Calculator",
  "Estimate the filament usage and cost for 3D printing projects based on model volume, infill percentage, filament type, and material cost.",
  "Everyday",
  "everyday",
  "~",
  ["3d printer filament cost", "3d printing cost", "filament usage calculator", "pla filament price", "3d print material cost"],
  [
    '{ name: "modelVolume", label: "Model Volume (cubic cm)", type: "number", min: 1, max: 10000, defaultValue: 50 }',
    '{ name: "infillPercent", label: "Infill Percentage (%)", type: "number", min: 5, max: 100, defaultValue: 20 }',
    '{ name: "filamentType", label: "Filament Type", type: "select", options: [{ value: "1.24", label: "PLA ($20/kg)" }, { value: "1.04", label: "ABS ($22/kg)" }, { value: "1.25", label: "PETG ($25/kg)" }, { value: "1.31", label: "TPU ($30/kg)" }, { value: "1.27", label: "Nylon ($35/kg)" }], defaultValue: "1.24" }',
    '{ name: "spoolCost", label: "Spool Cost ($)", type: "number", min: 10, max: 200, defaultValue: 20 }',
    '{ name: "spoolWeight", label: "Spool Weight (grams)", type: "number", min: 250, max: 5000, defaultValue: 1000 }'
  ],
  `(inputs) => {
    const volume = inputs.modelVolume as number;
    const infill = inputs.infillPercent as number / 100;
    const density = parseFloat(inputs.filamentType as string);
    const spoolCost = inputs.spoolCost as number;
    const spoolWeight = inputs.spoolWeight as number;
    const shellVolume = volume * 0.15;
    const infillVolume = volume * 0.85 * infill;
    const totalVolume = shellVolume + infillVolume;
    const weightGrams = totalVolume * density;
    const costPerGram = spoolCost / spoolWeight;
    const printCost = weightGrams * costPerGram;
    const spoolPercent = (weightGrams / spoolWeight) * 100;
    const electricityCost = (totalVolume / 10) * 0.02;
    const totalCost = printCost + electricityCost;
    return {
      primary: { label: "Filament Cost", value: "$" + formatNumber(Math.round(printCost * 100) / 100) },
      details: [
        { label: "Filament Weight", value: formatNumber(Math.round(weightGrams * 10) / 10) + "g" },
        { label: "Spool Usage", value: formatNumber(Math.round(spoolPercent * 10) / 10) + "%" },
        { label: "Electricity Estimate", value: "$" + formatNumber(Math.round(electricityCost * 100) / 100) },
        { label: "Total Print Cost", value: "$" + formatNumber(Math.round(totalCost * 100) / 100) }
      ]
    };
  }`,
  [
    "Q: How much does it cost to 3D print something?||A: Most small 3D prints cost between $0.50 and $5 in filament. A typical benchy boat print uses about 15g of PLA and costs around $0.30. Larger prints can cost $10 or more in material alone.",
    "Q: What infill percentage should I use?||A: 10-20 percent infill works for decorative items, 30-50 percent for functional parts, and 80-100 percent for structural or load-bearing parts. Higher infill uses more filament and takes longer to print.",
    "Q: Which filament type is cheapest?||A: PLA is the most affordable at $15-25 per kilogram spool. ABS is similar in price. Specialty filaments like carbon fiber, metal-filled, or flexible TPU can cost $30-80 per kilogram."
  ],
  `Filament Weight = (Shell Volume + Infill Volume) x Material Density\nShell Volume = Model Volume x 15%\nInfill Volume = Model Volume x 85% x Infill %\nCost = Weight x (Spool Cost / Spool Weight)`,
  ["laser-printer-cost-per-page-calculator", "printer-ink-cost-calculator"]
);

add(
  "laser-printer-cost-per-page-calculator",
  "Laser Printer Cost Per Page Calculator",
  "Calculate the true cost per page of your laser printer including toner, drum, and maintenance costs to compare printing expenses.",
  "Finance",
  "finance",
  "$",
  ["laser printer cost per page", "toner cost calculator", "printing cost", "laser vs inkjet cost", "printer running cost"],
  [
    '{ name: "tonerCost", label: "Toner Cartridge Cost ($)", type: "number", min: 10, max: 500, defaultValue: 65 }',
    '{ name: "tonerYield", label: "Toner Page Yield", type: "number", min: 500, max: 30000, defaultValue: 3000 }',
    '{ name: "drumCost", label: "Drum Unit Cost ($)", type: "number", min: 0, max: 300, defaultValue: 45 }',
    '{ name: "drumYield", label: "Drum Page Yield", type: "number", min: 5000, max: 100000, defaultValue: 12000 }',
    '{ name: "pagesPerMonth", label: "Pages Printed Per Month", type: "number", min: 10, max: 10000, defaultValue: 500 }',
    '{ name: "paperCost", label: "Paper Cost Per Ream ($)", type: "number", min: 3, max: 30, defaultValue: 6 }'
  ],
  `(inputs) => {
    const tonerCost = inputs.tonerCost as number;
    const tonerYield = inputs.tonerYield as number;
    const drumCost = inputs.drumCost as number;
    const drumYield = inputs.drumYield as number;
    const pagesPerMonth = inputs.pagesPerMonth as number;
    const paperCostReam = inputs.paperCost as number;
    const tonerPerPage = tonerCost / tonerYield;
    const drumPerPage = drumCost / drumYield;
    const paperPerPage = paperCostReam / 500;
    const totalPerPage = tonerPerPage + drumPerPage + paperPerPage;
    const monthlyCost = totalPerPage * pagesPerMonth;
    const annualCost = monthlyCost * 12;
    const tonerMonths = tonerYield / pagesPerMonth;
    return {
      primary: { label: "Cost Per Page", value: "$" + formatNumber(Math.round(totalPerPage * 10000) / 10000) },
      details: [
        { label: "Toner Cost Per Page", value: "$" + formatNumber(Math.round(tonerPerPage * 10000) / 10000) },
        { label: "Monthly Printing Cost", value: "$" + formatNumber(Math.round(monthlyCost * 100) / 100) },
        { label: "Annual Printing Cost", value: "$" + formatNumber(Math.round(annualCost * 100) / 100) },
        { label: "Toner Lasts (Months)", value: formatNumber(Math.round(tonerMonths * 10) / 10) }
      ]
    };
  }`,
  [
    "Q: What is a good cost per page for a laser printer?||A: A good cost per page for a monochrome laser printer is $0.02 to $0.04 including toner and paper. Color laser printers typically cost $0.08 to $0.15 per page.",
    "Q: Is a laser printer cheaper than inkjet?||A: For high volume printing, laser printers cost significantly less per page. Inkjet printers have lower upfront costs but higher per-page costs, making them better for occasional photo printing.",
    "Q: How long does a toner cartridge last?||A: A standard toner cartridge yields 2000-3000 pages. High-yield cartridges can print 5000-10000 pages. Actual yield depends on coverage and print density."
  ],
  `Cost Per Page = (Toner Cost / Yield) + (Drum Cost / Yield) + (Paper Cost / 500)\nMonthly Cost = Cost Per Page x Pages Per Month\nAnnual Cost = Monthly Cost x 12`,
  ["printer-ink-cost-calculator", "3d-printer-filament-cost-calculator"]
);

add(
  "ups-runtime-calculator",
  "UPS Runtime Calculator",
  "Calculate how long an uninterruptible power supply will keep your equipment running during a power outage based on UPS capacity and connected load.",
  "Everyday",
  "everyday",
  "~",
  ["ups runtime calculator", "ups battery backup time", "uninterruptible power supply", "ups sizing calculator", "battery backup duration"],
  [
    '{ name: "upsVa", label: "UPS Capacity (VA)", type: "number", min: 300, max: 20000, defaultValue: 1500 }',
    '{ name: "upsWatts", label: "UPS Watts Rating", type: "number", min: 180, max: 15000, defaultValue: 900 }',
    '{ name: "totalLoad", label: "Connected Load (Watts)", type: "number", min: 50, max: 10000, defaultValue: 400 }',
    '{ name: "batteryAh", label: "Battery Capacity (Ah)", type: "number", min: 5, max: 200, defaultValue: 9 }',
    '{ name: "batteryVoltage", label: "Battery Voltage (V)", type: "number", min: 12, max: 96, defaultValue: 24 }'
  ],
  `(inputs) => {
    const upsVa = inputs.upsVa as number;
    const upsWatts = inputs.upsWatts as number;
    const load = inputs.totalLoad as number;
    const battAh = inputs.batteryAh as number;
    const battV = inputs.batteryVoltage as number;
    const batteryWh = battAh * battV;
    const efficiency = 0.85;
    const usableWh = batteryWh * efficiency;
    const runtimeHours = usableWh / load;
    const runtimeMinutes = Math.round(runtimeHours * 60);
    const loadPercent = Math.round((load / upsWatts) * 100);
    const loadVaPercent = Math.round((load / (upsVa * 0.6)) * 100);
    const overloaded = load > upsWatts;
    return {
      primary: { label: "Estimated Runtime", value: runtimeMinutes + " minutes" },
      details: [
        { label: "Battery Energy", value: formatNumber(Math.round(batteryWh)) + " Wh" },
        { label: "Usable Energy (85% eff.)", value: formatNumber(Math.round(usableWh)) + " Wh" },
        { label: "Load Percentage", value: formatNumber(loadPercent) + "%" },
        { label: "Status", value: overloaded ? "WARNING: Load exceeds UPS capacity" : loadPercent > 80 ? "High load - limited runtime" : "Load within safe range" }
      ]
    };
  }`,
  [
    "Q: How long will a UPS keep my computer running?||A: A typical 1500VA UPS with a 400W load provides 15-25 minutes of runtime. This is enough time to save your work and perform a graceful shutdown during a power outage.",
    "Q: What size UPS do I need?||A: Add up the wattage of all equipment you want to protect. Your UPS wattage rating should be at least 25 percent higher than your total load to ensure adequate runtime and prevent overloading.",
    "Q: Does a UPS waste electricity?||A: A UPS consumes 3-10 percent of its rated capacity in standby mode for charging and conversion. A 1500VA UPS typically uses 30-50 watts continuously, adding a few dollars per month to your electric bill."
  ],
  `Runtime (minutes) = (Battery Ah x Voltage x Efficiency) / Load x 60\nLoad % = Connected Load / UPS Watts Rating x 100\nUsable Energy = Battery Capacity x Voltage x 0.85`,
  ["pc-power-supply-calculator", "electric-bill-device-cost-calculator"]
);

add(
  "smart-thermostat-savings-calculator",
  "Smart Thermostat Savings Calculator",
  "Estimate annual energy savings from installing a smart thermostat based on current heating and cooling costs, climate zone, and scheduling preferences.",
  "Finance",
  "finance",
  "$",
  ["smart thermostat savings", "nest savings calculator", "programmable thermostat", "energy savings thermostat", "hvac cost reduction"],
  [
    '{ name: "monthlyHvac", label: "Monthly HVAC Cost ($)", type: "number", min: 20, max: 800, defaultValue: 150 }',
    '{ name: "climateZone", label: "Climate Zone", type: "select", options: [{ value: "1", label: "Hot (cooling dominant)" }, { value: "2", label: "Mixed (heating and cooling)" }, { value: "3", label: "Cold (heating dominant)" }], defaultValue: "2" }',
    '{ name: "awayHours", label: "Hours Away From Home Daily", type: "number", min: 0, max: 16, defaultValue: 9 }',
    '{ name: "thermostatCost", label: "Smart Thermostat Cost ($)", type: "number", min: 50, max: 500, defaultValue: 200 }',
    '{ name: "currentType", label: "Current Thermostat Type", type: "select", options: [{ value: "1", label: "Manual (non-programmable)" }, { value: "2", label: "Basic Programmable" }, { value: "3", label: "Already Smart" }], defaultValue: "1" }'
  ],
  `(inputs) => {
    const monthlyHvac = inputs.monthlyHvac as number;
    const zone = parseInt(inputs.climateZone as string);
    const awayHours = inputs.awayHours as number;
    const thermostatCost = inputs.thermostatCost as number;
    const currentType = parseInt(inputs.currentType as string);
    const annualHvac = monthlyHvac * 12;
    const baseSavingsRate = { 1: 0.15, 2: 0.12, 3: 0.10 };
    const typeMultiplier = { 1: 1.0, 2: 0.6, 3: 0.15 };
    const awayBonus = (awayHours / 24) * 0.08;
    const savingsRate = ((baseSavingsRate[zone] || 0.12) + awayBonus) * (typeMultiplier[currentType] || 1.0);
    const annualSavings = Math.round(annualHvac * savingsRate);
    const monthlySavings = Math.round(annualSavings / 12);
    const paybackMonths = Math.round(thermostatCost / monthlySavings);
    const fiveYearSavings = annualSavings * 5 - thermostatCost;
    return {
      primary: { label: "Estimated Annual Savings", value: "$" + formatNumber(annualSavings) },
      details: [
        { label: "Monthly Savings", value: "$" + formatNumber(monthlySavings) },
        { label: "Payback Period", value: formatNumber(paybackMonths) + " months" },
        { label: "5-Year Net Savings", value: "$" + formatNumber(fiveYearSavings) },
        { label: "Savings Rate", value: formatNumber(Math.round(savingsRate * 100)) + "%" }
      ]
    };
  }`,
  [
    "Q: How much can a smart thermostat save?||A: Studies show smart thermostats save 10-15 percent on heating and 12-15 percent on cooling costs. The average household saves $100-150 per year, though savings depend on climate, usage habits, and home insulation.",
    "Q: How long does it take for a smart thermostat to pay for itself?||A: Most smart thermostats pay for themselves in 12 to 24 months through energy savings. Homes with higher HVAC costs and longer away-from-home periods see faster payback.",
    "Q: Do smart thermostats work with all HVAC systems?||A: Most smart thermostats are compatible with common HVAC systems including central forced air, heat pumps, and radiant heating. Check compatibility with your specific system before purchasing."
  ],
  `Annual Savings = Annual HVAC Cost x (Base Savings Rate + Away Bonus) x Type Multiplier\nPayback Period = Thermostat Cost / Monthly Savings\n5-Year Net = Annual Savings x 5 - Thermostat Cost`,
  ["electric-bill-device-cost-calculator", "ups-runtime-calculator"]
);

add(
  "security-camera-storage-calculator",
  "Security Camera Storage Calculator",
  "Calculate the storage space required for security camera footage based on number of cameras, resolution, frame rate, and retention period.",
  "Everyday",
  "everyday",
  "~",
  ["security camera storage", "cctv storage calculator", "surveillance storage", "ip camera hard drive", "nvr storage calculator"],
  [
    '{ name: "numCameras", label: "Number of Cameras", type: "number", min: 1, max: 64, defaultValue: 4 }',
    '{ name: "resolution", label: "Camera Resolution", type: "select", options: [{ value: "0.75", label: "1080p (2 MP)" }, { value: "1.5", label: "2K (4 MP)" }, { value: "3", label: "4K (8 MP)" }, { value: "0.3", label: "720p (1 MP)" }], defaultValue: "0.75" }',
    '{ name: "fps", label: "Frame Rate (FPS)", type: "number", min: 1, max: 30, defaultValue: 15 }',
    '{ name: "recordHours", label: "Recording Hours Per Day", type: "number", min: 1, max: 24, defaultValue: 24 }',
    '{ name: "retentionDays", label: "Retention Period (Days)", type: "number", min: 1, max: 365, defaultValue: 30 }',
    '{ name: "compression", label: "Compression", type: "select", options: [{ value: "1", label: "H.264 (Standard)" }, { value: "0.5", label: "H.265 (Efficient)" }], defaultValue: "1" }'
  ],
  `(inputs) => {
    const cameras = inputs.numCameras as number;
    const mbPerHour = parseFloat(inputs.resolution as string);
    const fps = inputs.fps as number;
    const hours = inputs.recordHours as number;
    const days = inputs.retentionDays as number;
    const compressionFactor = parseFloat(inputs.compression as string);
    const gbPerCamPerHour = mbPerHour * (fps / 15) * compressionFactor;
    const dailyPerCam = gbPerCamPerHour * hours;
    const dailyTotal = dailyPerCam * cameras;
    const totalStorage = dailyTotal * days;
    const totalTB = totalStorage / 1000;
    const recommendedDrives = Math.ceil(totalTB / 4);
    return {
      primary: { label: "Total Storage Needed", value: formatNumber(Math.round(totalStorage)) + " GB" },
      details: [
        { label: "Storage in TB", value: formatNumber(Math.round(totalTB * 100) / 100) + " TB" },
        { label: "Daily Usage (All Cameras)", value: formatNumber(Math.round(dailyTotal * 10) / 10) + " GB/day" },
        { label: "Per Camera Per Day", value: formatNumber(Math.round(dailyPerCam * 10) / 10) + " GB" },
        { label: "Recommended 4TB Drives", value: formatNumber(recommendedDrives) }
      ]
    };
  }`,
  [
    "Q: How much storage do security cameras need?||A: A single 1080p camera recording 24/7 at 15 FPS with H.264 uses about 18 GB per day or 540 GB per month. Higher resolutions and frame rates increase storage needs proportionally.",
    "Q: Should I use H.264 or H.265 compression?||A: H.265 reduces file sizes by approximately 50 percent compared to H.264 with similar quality. Most modern cameras and NVRs support H.265, making it the recommended choice for storage efficiency.",
    "Q: How long should I keep security footage?||A: Most home users keep 7-30 days of footage. Businesses often retain 30-90 days. Legal or compliance requirements may mandate specific retention periods in some industries."
  ],
  `Daily Storage = GB/hour x (FPS/15) x Compression Factor x Hours x Cameras\nTotal Storage = Daily Storage x Retention Days\nGB/hour based on resolution: 1080p = 0.75 GB, 4K = 3 GB`,
  ["nas-drive-cost-calculator", "wireless-router-range-calculator"]
);

add(
  "nas-drive-cost-calculator",
  "NAS Drive Cost Calculator",
  "Estimate the total cost and usable storage of a NAS (Network Attached Storage) setup including drive costs, RAID configuration, and enclosure pricing.",
  "Finance",
  "finance",
  "$",
  ["nas cost calculator", "network storage cost", "raid storage calculator", "nas setup price", "home server storage"],
  [
    '{ name: "numDrives", label: "Number of Drives", type: "number", min: 1, max: 12, defaultValue: 4 }',
    '{ name: "driveSize", label: "Drive Size (TB)", type: "number", min: 1, max: 24, defaultValue: 8 }',
    '{ name: "driveCost", label: "Cost Per Drive ($)", type: "number", min: 30, max: 800, defaultValue: 180 }',
    '{ name: "raidType", label: "RAID Configuration", type: "select", options: [{ value: "0", label: "RAID 0 (No redundancy)" }, { value: "1", label: "RAID 1 (Mirror)" }, { value: "5", label: "RAID 5 (Single parity)" }, { value: "6", label: "RAID 6 (Double parity)" }, { value: "10", label: "RAID 10 (Striped mirrors)" }], defaultValue: "5" }',
    '{ name: "enclosureCost", label: "NAS Enclosure Cost ($)", type: "number", min: 100, max: 3000, defaultValue: 350 }'
  ],
  `(inputs) => {
    const numDrives = inputs.numDrives as number;
    const driveSize = inputs.driveSize as number;
    const driveCost = inputs.driveCost as number;
    const raid = parseInt(inputs.raidType as string);
    const enclosure = inputs.enclosureCost as number;
    const totalRaw = numDrives * driveSize;
    var usable = totalRaw;
    var raidLabel = "None";
    if (raid === 0) { usable = totalRaw; raidLabel = "RAID 0 - No redundancy"; }
    else if (raid === 1) { usable = totalRaw / 2; raidLabel = "RAID 1 - Mirrored"; }
    else if (raid === 5) { usable = (numDrives - 1) * driveSize; raidLabel = "RAID 5 - Single parity"; }
    else if (raid === 6) { usable = (numDrives - 2) * driveSize; raidLabel = "RAID 6 - Double parity"; }
    else if (raid === 10) { usable = totalRaw / 2; raidLabel = "RAID 10 - Striped mirrors"; }
    const totalDriveCost = numDrives * driveCost;
    const totalCost = totalDriveCost + enclosure;
    const costPerTB = usable > 0 ? totalCost / usable : 0;
    const redundancy = totalRaw - usable;
    return {
      primary: { label: "Usable Storage", value: formatNumber(Math.round(usable)) + " TB" },
      details: [
        { label: "Total Raw Storage", value: formatNumber(totalRaw) + " TB" },
        { label: "Redundancy Overhead", value: formatNumber(Math.round(redundancy)) + " TB" },
        { label: "Total System Cost", value: "$" + formatNumber(Math.round(totalCost)) },
        { label: "Cost Per Usable TB", value: "$" + formatNumber(Math.round(costPerTB)) },
        { label: "RAID Type", value: raidLabel }
      ]
    };
  }`,
  [
    "Q: What RAID level should I use for a home NAS?||A: RAID 5 is the most popular choice for home NAS with 3 or more drives, offering a good balance of performance, capacity, and single-drive fault tolerance. RAID 1 is ideal for 2-drive setups.",
    "Q: How much does a NAS setup cost?||A: A basic 2-bay NAS starts around $300-500 total. A 4-bay NAS with 8TB drives in RAID 5 providing 24TB usable typically costs $1000-1400 including the enclosure and drives.",
    "Q: Should I use NAS-rated drives?||A: Yes. NAS-rated drives like WD Red or Seagate IronWolf are designed for 24/7 operation, vibration tolerance, and multi-drive environments. Consumer desktop drives may fail prematurely in a NAS."
  ],
  `Usable Storage (RAID 5) = (Number of Drives - 1) x Drive Size\nUsable Storage (RAID 1/10) = Total Raw / 2\nCost Per TB = Total Cost / Usable Storage`,
  ["ssd-cost-per-gb-calculator", "security-camera-storage-calculator"]
);

add(
  "printer-ink-cost-calculator",
  "Printer Ink Cost Per Page Calculator",
  "Calculate the true cost per page of inkjet printing based on cartridge prices, page yields, and paper costs to track your printing expenses.",
  "Finance",
  "finance",
  "$",
  ["printer ink cost", "inkjet cost per page", "ink cartridge cost", "printing cost calculator", "ink cost comparison"],
  [
    '{ name: "blackInkCost", label: "Black Ink Cartridge Cost ($)", type: "number", min: 5, max: 100, defaultValue: 25 }',
    '{ name: "blackYield", label: "Black Ink Page Yield", type: "number", min: 100, max: 5000, defaultValue: 500 }',
    '{ name: "colorInkCost", label: "Color Ink Set Cost ($)", type: "number", min: 10, max: 200, defaultValue: 45 }',
    '{ name: "colorYield", label: "Color Ink Page Yield", type: "number", min: 100, max: 5000, defaultValue: 300 }',
    '{ name: "colorPercent", label: "Percentage of Color Prints (%)", type: "number", min: 0, max: 100, defaultValue: 30 }',
    '{ name: "pagesPerMonth", label: "Pages Per Month", type: "number", min: 10, max: 5000, defaultValue: 200 }'
  ],
  `(inputs) => {
    const blackCost = inputs.blackInkCost as number;
    const blackYield = inputs.blackYield as number;
    const colorCost = inputs.colorInkCost as number;
    const colorYield = inputs.colorYield as number;
    const colorPct = inputs.colorPercent as number / 100;
    const pagesMonth = inputs.pagesPerMonth as number;
    const blackPerPage = blackCost / blackYield;
    const colorPerPage = colorCost / colorYield;
    const paperPerPage = 0.012;
    const bwCostPerPage = blackPerPage + paperPerPage;
    const colorCostPerPage = blackPerPage + colorPerPage + paperPerPage;
    const blendedCost = bwCostPerPage * (1 - colorPct) + colorCostPerPage * colorPct;
    const monthlyCost = blendedCost * pagesMonth;
    const annualCost = monthlyCost * 12;
    const blackCartridgesYear = Math.ceil((pagesMonth * 12) / blackYield);
    return {
      primary: { label: "Blended Cost Per Page", value: "$" + formatNumber(Math.round(blendedCost * 10000) / 10000) },
      details: [
        { label: "B/W Only Cost Per Page", value: "$" + formatNumber(Math.round(bwCostPerPage * 10000) / 10000) },
        { label: "Color Cost Per Page", value: "$" + formatNumber(Math.round(colorCostPerPage * 10000) / 10000) },
        { label: "Monthly Printing Cost", value: "$" + formatNumber(Math.round(monthlyCost * 100) / 100) },
        { label: "Annual Printing Cost", value: "$" + formatNumber(Math.round(annualCost * 100) / 100) },
        { label: "Black Cartridges Per Year", value: formatNumber(blackCartridgesYear) }
      ]
    };
  }`,
  [
    "Q: How much does printer ink cost per page?||A: Inkjet printing typically costs $0.05 to $0.10 per black-and-white page and $0.15 to $0.25 per color page. Ink tank printers can reduce this to $0.01 per page or less.",
    "Q: Why is printer ink so expensive?||A: Printer manufacturers sell printers at low margins and profit from ink sales. Third-party and refilled cartridges cost significantly less. Ink tank (supertank) printers offer the lowest per-page costs.",
    "Q: How can I reduce my printing costs?||A: Use draft mode for non-critical prints, print in black and white when color is not needed, use third-party ink, and consider an ink tank printer if you print frequently."
  ],
  `Blended Cost = BW Cost x (1 - Color%) + Color Cost x Color%\nBW Cost/Page = Black Ink/Yield + Paper Cost\nColor Cost/Page = Black Ink/Yield + Color Ink/Yield + Paper Cost`,
  ["laser-printer-cost-per-page-calculator", "3d-printer-filament-cost-calculator"]
);

add(
  "e-reader-battery-calculator",
  "E-Reader Battery Life Calculator",
  "Estimate how long your e-reader battery will last based on reading habits, screen type, backlight usage, and Wi-Fi connectivity.",
  "Everyday",
  "everyday",
  "~",
  ["e-reader battery life", "kindle battery calculator", "e-ink battery", "ebook reader battery", "reading device battery"],
  [
    '{ name: "batteryMah", label: "Battery Capacity (mAh)", type: "number", min: 500, max: 5000, defaultValue: 1700 }',
    '{ name: "readingHoursPerDay", label: "Reading Hours Per Day", type: "number", min: 0.5, max: 12, defaultValue: 2 }',
    '{ name: "pagesPerHour", label: "Page Turns Per Hour", type: "number", min: 10, max: 120, defaultValue: 40 }',
    '{ name: "backlightLevel", label: "Backlight Level", type: "select", options: [{ value: "0", label: "Off" }, { value: "1", label: "Low" }, { value: "2", label: "Medium" }, { value: "3", label: "High" }], defaultValue: "1" }',
    '{ name: "wifiOn", label: "Wi-Fi", type: "select", options: [{ value: "0", label: "Off" }, { value: "1", label: "On" }], defaultValue: "0" }'
  ],
  `(inputs) => {
    const battery = inputs.batteryMah as number;
    const hoursPerDay = inputs.readingHoursPerDay as number;
    const pagesPerHour = inputs.pagesPerHour as number;
    const backlight = parseInt(inputs.backlightLevel as string);
    const wifi = parseInt(inputs.wifiOn as string);
    const baseDraw = 0.01;
    const pageRefreshDraw = pagesPerHour * 0.0003;
    const backlightDraw = { 0: 0, 1: 0.02, 2: 0.05, 3: 0.10 };
    const wifiDraw = wifi === 1 ? 0.04 : 0;
    const totalDrawMa = (baseDraw + pageRefreshDraw + (backlightDraw[backlight] || 0) + wifiDraw) * 1000;
    const totalReadingHours = battery / totalDrawMa;
    const daysOfReading = totalReadingHours / hoursPerDay;
    const weeksOfReading = daysOfReading / 7;
    const totalPages = Math.round(totalReadingHours * pagesPerHour);
    return {
      primary: { label: "Battery Life", value: formatNumber(Math.round(daysOfReading)) + " days" },
      details: [
        { label: "Total Reading Hours", value: formatNumber(Math.round(totalReadingHours)) + " hours" },
        { label: "Weeks of Reading", value: formatNumber(Math.round(weeksOfReading * 10) / 10) },
        { label: "Pages Before Recharge", value: formatNumber(totalPages) },
        { label: "Power Draw", value: formatNumber(Math.round(totalDrawMa * 10) / 10) + " mA" }
      ]
    };
  }`,
  [
    "Q: How long does a Kindle battery last?||A: With Wi-Fi off and backlight on low, most Kindle models last 4-6 weeks with 30 minutes of daily reading. Heavier readers with high backlight may get 2-3 weeks between charges.",
    "Q: Does the backlight drain the battery faster?||A: Yes. E-ink displays use almost no power for static pages, so the backlight is the biggest battery drain. Turning it off or using low settings dramatically extends battery life.",
    "Q: Should I leave Wi-Fi on my e-reader?||A: Turn Wi-Fi off when not downloading books. Wi-Fi continuously searching for signals drains battery. Enable it only when syncing or purchasing new content."
  ],
  `Total Draw = Base + Page Refresh + Backlight + Wi-Fi (in mA)\nReading Hours = Battery (mAh) / Total Draw (mA)\nDays = Reading Hours / Daily Reading Hours`,
  ["phone-battery-health-calculator", "wireless-charger-efficiency-calculator"]
);

add(
  "wireless-charger-efficiency-calculator",
  "Wireless Charger Efficiency Calculator",
  "Calculate the energy efficiency and cost overhead of wireless charging compared to wired charging for your devices.",
  "Everyday",
  "everyday",
  "~",
  ["wireless charging efficiency", "qi charger energy loss", "wireless vs wired charging", "inductive charging cost", "wireless charger waste"],
  [
    '{ name: "batteryCapacity", label: "Device Battery (mAh)", type: "number", min: 1000, max: 10000, defaultValue: 4500 }',
    '{ name: "batteryVoltage", label: "Battery Voltage (V)", type: "number", min: 3.0, max: 5.0, defaultValue: 3.85 }',
    '{ name: "wirelessEfficiency", label: "Wireless Charging Efficiency (%)", type: "number", min: 50, max: 95, defaultValue: 75 }',
    '{ name: "chargesPerWeek", label: "Charges Per Week", type: "number", min: 1, max: 14, defaultValue: 7 }',
    '{ name: "electricRate", label: "Electricity Rate ($/kWh)", type: "number", min: 0.05, max: 0.60, defaultValue: 0.13 }'
  ],
  `(inputs) => {
    const battery = inputs.batteryCapacity as number;
    const voltage = inputs.batteryVoltage as number;
    const efficiency = inputs.wirelessEfficiency as number / 100;
    const chargesWeek = inputs.chargesPerWeek as number;
    const rate = inputs.electricRate as number;
    const batteryWh = battery * voltage / 1000;
    const wiredEnergy = batteryWh / 0.92;
    const wirelessEnergy = batteryWh / efficiency;
    const wastedPerCharge = wirelessEnergy - wiredEnergy;
    const weeklyWaste = wastedPerCharge * chargesWeek;
    const annualWasteKwh = weeklyWaste * 52 / 1000;
    const annualExtraCost = annualWasteKwh * rate;
    const wiredAnnualKwh = wiredEnergy * chargesWeek * 52 / 1000;
    const wirelessAnnualKwh = wirelessEnergy * chargesWeek * 52 / 1000;
    return {
      primary: { label: "Energy Wasted Per Charge", value: formatNumber(Math.round(wastedPerCharge * 100) / 100) + " Wh" },
      details: [
        { label: "Wireless Energy Per Charge", value: formatNumber(Math.round(wirelessEnergy * 100) / 100) + " Wh" },
        { label: "Wired Energy Per Charge", value: formatNumber(Math.round(wiredEnergy * 100) / 100) + " Wh" },
        { label: "Annual Extra Energy", value: formatNumber(Math.round(annualWasteKwh * 100) / 100) + " kWh" },
        { label: "Annual Extra Cost", value: "$" + formatNumber(Math.round(annualExtraCost * 100) / 100) }
      ]
    };
  }`,
  [
    "Q: How efficient is wireless charging?||A: Most Qi wireless chargers operate at 70-80 percent efficiency, meaning 20-30 percent of energy is lost as heat. Wired charging is about 90-95 percent efficient.",
    "Q: Does wireless charging waste a lot of electricity?||A: The extra energy cost is minimal, typically $1-3 per year for daily smartphone charging. The convenience often outweighs the small efficiency loss.",
    "Q: Does wireless charging damage battery health?||A: The heat generated by wireless charging can slightly accelerate battery degradation over time. Using well-aligned, quality chargers that minimize heat helps preserve battery health."
  ],
  `Energy Per Charge (Wireless) = Battery Wh / Wireless Efficiency\nEnergy Per Charge (Wired) = Battery Wh / 0.92\nWasted Per Charge = Wireless Energy - Wired Energy\nAnnual Extra Cost = Weekly Waste x 52 / 1000 x Rate`,
  ["phone-battery-health-calculator", "e-reader-battery-calculator", "electric-bill-device-cost-calculator"]
);

add(
  "bluetooth-range-estimator-calculator",
  "Bluetooth Range Estimator Calculator",
  "Estimate the effective Bluetooth range between devices based on Bluetooth version, transmit power, environment, and obstacles.",
  "Everyday",
  "everyday",
  "~",
  ["bluetooth range estimator", "bluetooth distance calculator", "bluetooth signal range", "bt range", "wireless range calculator"],
  [
    '{ name: "btVersion", label: "Bluetooth Version", type: "select", options: [{ value: "1", label: "Bluetooth 4.0 / 4.2 (BLE)" }, { value: "2", label: "Bluetooth 5.0" }, { value: "3", label: "Bluetooth 5.1 / 5.2" }, { value: "4", label: "Bluetooth 5.3+" }], defaultValue: "2" }',
    '{ name: "powerClass", label: "Power Class", type: "select", options: [{ value: "1", label: "Class 1 (100m max)" }, { value: "2", label: "Class 2 (10m max)" }, { value: "3", label: "Class 3 (1m max)" }], defaultValue: "2" }',
    '{ name: "environment", label: "Environment", type: "select", options: [{ value: "1", label: "Open Outdoor" }, { value: "2", label: "Indoor (few walls)" }, { value: "3", label: "Indoor (many walls)" }, { value: "4", label: "Crowded/Urban" }], defaultValue: "2" }',
    '{ name: "obstacles", label: "Number of Walls/Obstacles", type: "number", min: 0, max: 10, defaultValue: 1 }'
  ],
  `(inputs) => {
    const version = parseInt(inputs.btVersion as string);
    const powerClass = parseInt(inputs.powerClass as string);
    const env = parseInt(inputs.environment as string);
    const obstacles = inputs.obstacles as number;
    const maxRange = { 1: 100, 2: 10, 3: 1 };
    const versionMultiplier = { 1: 1.0, 2: 4.0, 3: 4.0, 4: 4.0 };
    const envFactor = { 1: 1.0, 2: 0.5, 3: 0.25, 4: 0.3 };
    const baseRange = (maxRange[powerClass] || 10) * (versionMultiplier[version] || 1.0);
    const effectiveRange = Math.round(baseRange * (envFactor[env] || 0.5) * Math.pow(0.7, obstacles));
    const signalQuality = effectiveRange > 20 ? "Strong" : effectiveRange > 8 ? "Good" : effectiveRange > 3 ? "Fair" : "Weak";
    const dataRate = version >= 2 ? "2 Mbps" : "1 Mbps";
    return {
      primary: { label: "Effective Range", value: formatNumber(effectiveRange) + " meters" },
      details: [
        { label: "Max Theoretical Range", value: formatNumber(Math.round(baseRange)) + " meters" },
        { label: "Signal Quality", value: signalQuality },
        { label: "Max Data Rate", value: dataRate },
        { label: "Range in Feet", value: formatNumber(Math.round(effectiveRange * 3.281)) + " feet" }
      ]
    };
  }`,
  [
    "Q: How far does Bluetooth 5.0 reach?||A: Bluetooth 5.0 Class 2 has a theoretical range of 40 meters (130 feet) outdoors. Indoors with walls and interference, expect 10-20 meters (30-65 feet) of reliable range.",
    "Q: Why does Bluetooth keep disconnecting?||A: Common causes include distance beyond effective range, walls and obstacles, interference from Wi-Fi and other 2.4 GHz devices, low battery on either device, and outdated Bluetooth versions.",
    "Q: Does Bluetooth version affect range?||A: Yes. Bluetooth 5.0 and later versions offer up to 4 times the range of Bluetooth 4.2 in ideal conditions. However, both devices need to support the newer version to benefit."
  ],
  `Effective Range = Max Range x Version Multiplier x Environment Factor x 0.7^Obstacles\nMax Range: Class 1 = 100m, Class 2 = 10m, Class 3 = 1m\nBT 5.0+ multiplies range by 4x`,
  ["wireless-router-range-calculator", "wireless-charger-efficiency-calculator"]
);

add(
  "data-transfer-time-calculator",
  "Data Transfer Time Calculator",
  "Calculate the time required to transfer files over various network connections including Ethernet, Wi-Fi, and internet speeds.",
  "Everyday",
  "everyday",
  "~",
  ["data transfer time", "file transfer calculator", "download time calculator", "upload time estimator", "network transfer speed"],
  [
    '{ name: "fileSize", label: "File Size", type: "number", min: 1, max: 100000, defaultValue: 1000 }',
    '{ name: "sizeUnit", label: "Size Unit", type: "select", options: [{ value: "1", label: "MB" }, { value: "1024", label: "GB" }, { value: "1048576", label: "TB" }], defaultValue: "1024" }',
    '{ name: "connectionSpeed", label: "Connection Speed (Mbps)", type: "number", min: 1, max: 10000, defaultValue: 100 }',
    '{ name: "overhead", label: "Protocol Overhead (%)", type: "number", min: 0, max: 50, defaultValue: 15 }'
  ],
  `(inputs) => {
    const fileSize = inputs.fileSize as number;
    const sizeMultiplier = inputs.sizeUnit as number;
    const speedMbps = inputs.connectionSpeed as number;
    const overhead = inputs.overhead as number / 100;
    const fileSizeMB = fileSize * sizeMultiplier;
    const fileSizeGb = fileSizeMB / 1024;
    const effectiveSpeedMbps = speedMbps * (1 - overhead);
    const effectiveSpeedMBps = effectiveSpeedMbps / 8;
    const transferSeconds = fileSizeMB / effectiveSpeedMBps;
    const hours = Math.floor(transferSeconds / 3600);
    const minutes = Math.floor((transferSeconds % 3600) / 60);
    const seconds = Math.round(transferSeconds % 60);
    const timeStr = hours > 0 ? hours + "h " + minutes + "m " + seconds + "s" : minutes > 0 ? minutes + "m " + seconds + "s" : seconds + "s";
    return {
      primary: { label: "Transfer Time", value: timeStr },
      details: [
        { label: "File Size", value: formatNumber(Math.round(fileSizeMB)) + " MB (" + formatNumber(Math.round(fileSizeGb * 100) / 100) + " GB)" },
        { label: "Effective Speed", value: formatNumber(Math.round(effectiveSpeedMBps * 100) / 100) + " MB/s" },
        { label: "Effective Speed (Mbps)", value: formatNumber(Math.round(effectiveSpeedMbps)) + " Mbps" },
        { label: "Total Seconds", value: formatNumber(Math.round(transferSeconds)) }
      ]
    };
  }`,
  [
    "Q: How long does it take to download 1 GB?||A: At 100 Mbps it takes about 80 seconds. At 50 Mbps about 2.5 minutes. At 25 Mbps about 5 minutes. Real-world speeds are typically 10-20 percent slower than advertised due to overhead.",
    "Q: Why is my transfer slower than my internet speed?||A: Internet speeds are measured in megabits per second (Mbps) while files are measured in megabytes (MB). Divide Mbps by 8 to get MB/s. Protocol overhead, network congestion, and server limits also reduce speeds.",
    "Q: What internet speed do I need for large file transfers?||A: For occasional large transfers, 100 Mbps is adequate. For frequent multi-gigabyte transfers, 500 Mbps or gigabit speeds significantly reduce wait times."
  ],
  `Transfer Time = File Size (MB) / Effective Speed (MB/s)\nEffective Speed = Connection Speed x (1 - Overhead%) / 8\nFile Size (MB) = File Size x Unit Multiplier`,
  ["usb-transfer-speed-calculator", "screen-resolution-comparison-calculator"]
);

add(
  "screen-resolution-comparison-calculator",
  "Screen Resolution Comparison Calculator",
  "Compare screen resolutions by calculating total pixels, pixel density, and aspect ratios to understand the difference between display standards.",
  "Everyday",
  "everyday",
  "~",
  ["screen resolution comparison", "display resolution calculator", "pixel density comparison", "4k vs 1080p", "monitor resolution"],
  [
    '{ name: "width1", label: "Resolution 1 - Width (px)", type: "number", min: 320, max: 15360, defaultValue: 1920 }',
    '{ name: "height1", label: "Resolution 1 - Height (px)", type: "number", min: 240, max: 8640, defaultValue: 1080 }',
    '{ name: "width2", label: "Resolution 2 - Width (px)", type: "number", min: 320, max: 15360, defaultValue: 3840 }',
    '{ name: "height2", label: "Resolution 2 - Height (px)", type: "number", min: 240, max: 8640, defaultValue: 2160 }',
    '{ name: "screenSize", label: "Screen Size (inches)", type: "number", min: 5, max: 100, defaultValue: 27 }'
  ],
  `(inputs) => {
    const w1 = inputs.width1 as number;
    const h1 = inputs.height1 as number;
    const w2 = inputs.width2 as number;
    const h2 = inputs.height2 as number;
    const size = inputs.screenSize as number;
    const pixels1 = w1 * h1;
    const pixels2 = w2 * h2;
    const diag1 = Math.sqrt(w1 * w1 + h1 * h1);
    const diag2 = Math.sqrt(w2 * w2 + h2 * h2);
    const ppi1 = Math.round(diag1 / size);
    const ppi2 = Math.round(diag2 / size);
    const pixelRatio = Math.round((pixels2 / pixels1) * 100) / 100;
    const ppiDiff = ppi2 - ppi1;
    return {
      primary: { label: "Pixel Count Ratio", value: formatNumber(pixelRatio) + "x more pixels" },
      details: [
        { label: "Resolution 1 Total Pixels", value: formatNumber(pixels1) },
        { label: "Resolution 2 Total Pixels", value: formatNumber(pixels2) },
        { label: "PPI at " + size + " inches (Res 1)", value: formatNumber(ppi1) + " PPI" },
        { label: "PPI at " + size + " inches (Res 2)", value: formatNumber(ppi2) + " PPI" },
        { label: "PPI Difference", value: "+" + formatNumber(ppiDiff) + " PPI" }
      ]
    };
  }`,
  [
    "Q: What is the difference between 1080p and 4K?||A: 4K (3840x2160) has exactly 4 times the pixels of 1080p (1920x1080). This means sharper text, more screen real estate, and finer detail, especially noticeable on larger displays.",
    "Q: What PPI is considered retina quality?||A: Apple defines retina as roughly 220+ PPI for typical viewing distances. At normal monitor viewing distance, 110+ PPI is good and 163+ PPI provides excellent sharpness.",
    "Q: Does higher resolution use more GPU power?||A: Yes. Doubling the resolution roughly quadruples the number of pixels the GPU must render, requiring significantly more graphics processing power for gaming and video playback."
  ],
  `Total Pixels = Width x Height\nPPI = Diagonal Pixels / Screen Size (inches)\nDiagonal Pixels = sqrt(Width^2 + Height^2)\nPixel Ratio = Resolution 2 Pixels / Resolution 1 Pixels`,
  ["monitor-size-distance-calculator", "tv-viewing-distance-calculator"]
);

add(
  "phone-battery-health-calculator",
  "Phone Battery Health Calculator",
  "Estimate your phone battery degradation and remaining capacity based on charge cycles, age, and usage patterns.",
  "Everyday",
  "everyday",
  "~",
  ["phone battery health", "battery degradation calculator", "battery cycle count", "phone battery capacity", "battery lifespan"],
  [
    '{ name: "originalCapacity", label: "Original Battery Capacity (mAh)", type: "number", min: 1000, max: 10000, defaultValue: 4500 }',
    '{ name: "phoneAge", label: "Phone Age (Months)", type: "number", min: 1, max: 72, defaultValue: 24 }',
    '{ name: "chargesPerDay", label: "Charges Per Day (Avg)", type: "number", min: 0.3, max: 3, defaultValue: 1 }',
    '{ name: "chargingHabit", label: "Typical Charging Range", type: "select", options: [{ value: "1", label: "0-100% (Full cycles)" }, { value: "2", label: "20-80% (Optimal)" }, { value: "3", label: "10-90% (Moderate)" }, { value: "4", label: "0-100% with fast charge" }], defaultValue: "1" }',
    '{ name: "fastCharging", label: "Uses Fast Charging", type: "select", options: [{ value: "0", label: "No" }, { value: "1", label: "Yes" }], defaultValue: "1" }'
  ],
  `(inputs) => {
    const original = inputs.originalCapacity as number;
    const ageMonths = inputs.phoneAge as number;
    const chargesDay = inputs.chargesPerDay as number;
    const habit = parseInt(inputs.chargingHabit as string);
    const fastCharge = parseInt(inputs.fastCharging as string);
    const totalCycles = Math.round(chargesDay * ageMonths * 30.44);
    const habitWear = { 1: 1.0, 2: 0.5, 3: 0.7, 4: 1.3 };
    const fastChargeWear = fastCharge === 1 ? 1.15 : 1.0;
    const effectiveCycles = totalCycles * (habitWear[habit] || 1.0) * fastChargeWear;
    const degradation = Math.min(effectiveCycles * 0.04, 50);
    const healthPercent = Math.round(100 - degradation);
    const currentCapacity = Math.round(original * healthPercent / 100);
    const cyclesTo80 = Math.round(800 / ((habitWear[habit] || 1.0) * fastChargeWear));
    const monthsTo80 = Math.round(cyclesTo80 / (chargesDay * 30.44));
    return {
      primary: { label: "Estimated Battery Health", value: formatNumber(healthPercent) + "%" },
      details: [
        { label: "Current Capacity", value: formatNumber(currentCapacity) + " mAh" },
        { label: "Capacity Lost", value: formatNumber(original - currentCapacity) + " mAh" },
        { label: "Estimated Charge Cycles", value: formatNumber(totalCycles) },
        { label: "Months Until 80% Health", value: monthsTo80 > ageMonths ? formatNumber(monthsTo80 - ageMonths) + " months remaining" : "Already below 80%" }
      ]
    };
  }`,
  [
    "Q: How long does a phone battery last before degrading?||A: Most lithium-ion phone batteries retain 80 percent of their original capacity after 500-800 charge cycles, typically 2-3 years of normal use. Battery health degrades gradually over time.",
    "Q: Does fast charging damage the battery?||A: Fast charging generates more heat which can slightly accelerate battery degradation over time. The impact is roughly 10-15 percent more wear compared to standard charging.",
    "Q: What is the best way to charge a phone for battery longevity?||A: Keep the battery between 20-80 percent, avoid overnight full charges when possible, use standard speed charging, and keep the phone cool during charging."
  ],
  `Health % = 100 - (Effective Cycles x 0.04)\nEffective Cycles = Total Cycles x Habit Wear x Fast Charge Wear\nTotal Cycles = Charges/Day x Age (months) x 30.44`,
  ["e-reader-battery-calculator", "wireless-charger-efficiency-calculator", "smartphone-screen-repair-cost-calculator"]
);

add(
  "tv-viewing-distance-calculator",
  "TV Viewing Distance Calculator",
  "Calculate the ideal viewing distance for your TV based on screen size and resolution for the most immersive and comfortable viewing experience.",
  "Everyday",
  "everyday",
  "~",
  ["tv viewing distance", "tv size distance calculator", "ideal tv distance", "screen distance recommendation", "tv placement guide"],
  [
    '{ name: "tvSize", label: "TV Screen Size (inches)", type: "number", min: 32, max: 120, defaultValue: 55 }',
    '{ name: "resolution", label: "TV Resolution", type: "select", options: [{ value: "1", label: "1080p (Full HD)" }, { value: "2", label: "4K (Ultra HD)" }, { value: "3", label: "8K" }, { value: "4", label: "720p" }], defaultValue: "2" }',
    '{ name: "usage", label: "Primary Usage", type: "select", options: [{ value: "1", label: "Movies and TV Shows" }, { value: "2", label: "Sports" }, { value: "3", label: "Gaming" }, { value: "4", label: "Mixed Use" }], defaultValue: "4" }',
    '{ name: "roomWidth", label: "Room Width (feet)", type: "number", min: 5, max: 40, defaultValue: 14 }'
  ],
  `(inputs) => {
    const tvSize = inputs.tvSize as number;
    const res = parseInt(inputs.resolution as string);
    const usage = parseInt(inputs.usage as string);
    const roomWidth = inputs.roomWidth as number;
    const resMultiplier = { 1: 1.6, 2: 1.0, 3: 0.75, 4: 2.0 };
    const usageMultiplier = { 1: 1.0, 2: 1.1, 3: 0.85, 4: 1.0 };
    const minDistFeet = Math.round((tvSize * (resMultiplier[res] || 1.0) * (usageMultiplier[usage] || 1.0)) / 12 * 10) / 10;
    const maxDistFeet = Math.round(minDistFeet * 1.6 * 10) / 10;
    const optimalFeet = Math.round((minDistFeet + maxDistFeet) / 2 * 10) / 10;
    const fitsRoom = optimalFeet <= roomWidth * 0.8;
    const idealTvSize = Math.round(roomWidth * 0.8 * 12 / ((resMultiplier[res] || 1.0) * (usageMultiplier[usage] || 1.0)));
    return {
      primary: { label: "Optimal Viewing Distance", value: formatNumber(optimalFeet) + " feet" },
      details: [
        { label: "Minimum Distance", value: formatNumber(minDistFeet) + " feet" },
        { label: "Maximum Distance", value: formatNumber(maxDistFeet) + " feet" },
        { label: "Fits Your Room", value: fitsRoom ? "Yes - good fit" : "No - TV may be too large" },
        { label: "Ideal TV Size for Room", value: formatNumber(idealTvSize) + " inches" }
      ]
    };
  }`,
  [
    "Q: How far should I sit from a 55 inch TV?||A: For a 55-inch 4K TV, the optimal viewing distance is approximately 4.5 to 7 feet. At 1080p, sit 7 to 11 feet away for the best experience without seeing individual pixels.",
    "Q: Is sitting too close to the TV bad for your eyes?||A: Modern TVs do not cause permanent eye damage at close distances. However, sitting too close may cause eye strain and fatigue. Following recommended viewing distances ensures comfort during long viewing sessions.",
    "Q: What size TV should I get for my room?||A: Multiply your viewing distance in inches by 0.625 for 4K TVs. For a 10-foot viewing distance, a 65-75 inch 4K TV is ideal. For 1080p, use a 0.4 multiplier instead."
  ],
  `Optimal Distance (ft) = TV Size x Resolution Factor x Usage Factor / 12\nMin Distance = TV Size x Res Multiplier x Usage Multiplier / 12\nMax Distance = Min Distance x 1.6`,
  ["monitor-size-distance-calculator", "projector-throw-distance-calculator", "screen-resolution-comparison-calculator"]
);

add(
  "projector-throw-distance-calculator",
  "Projector Throw Distance Calculator",
  "Calculate the required throw distance for your projector to achieve the desired screen size, or determine screen size from available distance.",
  "Everyday",
  "everyday",
  "~",
  ["projector throw distance", "projector screen size", "projector placement", "throw ratio calculator", "projector distance calculator"],
  [
    '{ name: "desiredWidth", label: "Desired Screen Width (inches)", type: "number", min: 40, max: 300, defaultValue: 100 }',
    '{ name: "throwRatio", label: "Projector Throw Ratio", type: "number", min: 0.2, max: 3.0, defaultValue: 1.2 }',
    '{ name: "projectorType", label: "Projector Type", type: "select", options: [{ value: "1", label: "Standard Throw" }, { value: "2", label: "Short Throw" }, { value: "3", label: "Ultra Short Throw" }], defaultValue: "1" }',
    '{ name: "availableDistance", label: "Available Room Distance (feet)", type: "number", min: 2, max: 50, defaultValue: 12 }',
    '{ name: "aspectRatio", label: "Aspect Ratio", type: "select", options: [{ value: "16", label: "16:9 (Widescreen)" }, { value: "4", label: "4:3 (Standard)" }, { value: "21", label: "21:9 (Ultrawide)" }], defaultValue: "16" }'
  ],
  `(inputs) => {
    const desiredWidth = inputs.desiredWidth as number;
    const throwRatio = inputs.throwRatio as number;
    const projType = parseInt(inputs.projectorType as string);
    const availDist = inputs.availableDistance as number;
    const aspect = parseInt(inputs.aspectRatio as string);
    const throwDistInches = desiredWidth * throwRatio;
    const throwDistFeet = Math.round(throwDistInches / 12 * 10) / 10;
    const maxScreenFromDist = Math.round(availDist * 12 / throwRatio);
    const heightRatio = aspect === 16 ? 9/16 : aspect === 4 ? 3/4 : 9/21;
    const screenHeight = Math.round(desiredWidth * heightRatio);
    const diagonalInches = Math.round(Math.sqrt(desiredWidth * desiredWidth + screenHeight * screenHeight));
    const fits = throwDistFeet <= availDist;
    return {
      primary: { label: "Required Throw Distance", value: formatNumber(throwDistFeet) + " feet" },
      details: [
        { label: "Screen Diagonal", value: formatNumber(diagonalInches) + " inches" },
        { label: "Screen Height", value: formatNumber(screenHeight) + " inches" },
        { label: "Max Screen Width (from room)", value: formatNumber(maxScreenFromDist) + " inches" },
        { label: "Fits Available Space", value: fits ? "Yes" : "No - need more distance" }
      ]
    };
  }`,
  [
    "Q: What is throw ratio on a projector?||A: Throw ratio is the distance from projector to screen divided by screen width. A ratio of 1.2 means the projector needs to be 1.2 feet away for every 1 foot of screen width. Lower ratios mean shorter distances.",
    "Q: How far should a projector be from the screen?||A: This depends on the throw ratio and desired screen size. A standard throw projector at 1.2 ratio needs about 10 feet for a 100-inch diagonal image. Short throw projectors can achieve this from 3-5 feet.",
    "Q: What size projector screen do I need?||A: For a home theater, a 100-120 inch diagonal screen is popular. Consider viewing distance: viewers should sit 1.2 to 1.6 times the screen diagonal away for the best 4K experience."
  ],
  `Throw Distance = Screen Width x Throw Ratio\nScreen Diagonal = sqrt(Width^2 + Height^2)\nMax Screen Width = Available Distance x 12 / Throw Ratio`,
  ["tv-viewing-distance-calculator", "monitor-size-distance-calculator"]
);

add(
  "electric-bill-device-cost-calculator",
  "Electric Bill Device Cost Calculator",
  "Calculate how much any electronic device adds to your monthly electric bill based on wattage, hours of use, and local electricity rate.",
  "Finance",
  "finance",
  "$",
  ["device electricity cost", "appliance power cost", "device electric bill", "watt to dollar", "device energy cost calculator"],
  [
    '{ name: "deviceWatts", label: "Device Wattage (W)", type: "number", min: 1, max: 5000, defaultValue: 200 }',
    '{ name: "hoursPerDay", label: "Hours Used Per Day", type: "number", min: 0.5, max: 24, defaultValue: 4 }',
    '{ name: "daysPerWeek", label: "Days Used Per Week", type: "number", min: 1, max: 7, defaultValue: 7 }',
    '{ name: "electricRate", label: "Electricity Rate ($/kWh)", type: "number", min: 0.05, max: 0.60, defaultValue: 0.13 }',
    '{ name: "standbyWatts", label: "Standby Power (W)", type: "number", min: 0, max: 50, defaultValue: 2 }'
  ],
  `(inputs) => {
    const watts = inputs.deviceWatts as number;
    const hours = inputs.hoursPerDay as number;
    const days = inputs.daysPerWeek as number;
    const rate = inputs.electricRate as number;
    const standby = inputs.standbyWatts as number;
    const activeKwhDay = (watts * hours) / 1000;
    const standbyHours = 24 - hours;
    const standbyKwhDay = (standby * standbyHours) / 1000;
    const dailyKwh = activeKwhDay + standbyKwhDay;
    const weeklyKwh = (activeKwhDay * days) + (standbyKwhDay * 7);
    const monthlyKwh = weeklyKwh * 4.345;
    const monthlyCost = monthlyKwh * rate;
    const annualCost = monthlyCost * 12;
    const annualKwh = monthlyKwh * 12;
    return {
      primary: { label: "Monthly Cost", value: "$" + formatNumber(Math.round(monthlyCost * 100) / 100) },
      details: [
        { label: "Annual Cost", value: "$" + formatNumber(Math.round(annualCost * 100) / 100) },
        { label: "Monthly Energy Use", value: formatNumber(Math.round(monthlyKwh * 100) / 100) + " kWh" },
        { label: "Annual Energy Use", value: formatNumber(Math.round(annualKwh * 100) / 100) + " kWh" },
        { label: "Daily Active Cost", value: "$" + formatNumber(Math.round(activeKwhDay * rate * 100) / 100) },
        { label: "Monthly Standby Cost", value: "$" + formatNumber(Math.round(standbyKwhDay * 30.44 * rate * 100) / 100) }
      ]
    };
  }`,
  [
    "Q: How much does it cost to run a gaming PC?||A: A gaming PC drawing 300-500W for 4 hours daily costs roughly $6-15 per month at average US electricity rates. Standby power adds another $0.50-2.00 per month.",
    "Q: What devices use the most electricity?||A: Space heaters (1500W), window AC units (500-1400W), gaming PCs (300-600W), large TVs (100-200W), and refrigerators (100-400W) are among the highest energy consumers in a typical home.",
    "Q: What is phantom or standby power?||A: Standby power is energy consumed by devices that are turned off but still plugged in. TVs, game consoles, and chargers can draw 1-15W in standby, costing $5-30 per year across all devices."
  ],
  `Monthly kWh = ((Watts x Hours/Day x Days/Week) + (Standby x Remaining Hours x 7)) x 4.345 / 1000\nMonthly Cost = Monthly kWh x Rate\nAnnual Cost = Monthly Cost x 12`,
  ["smart-thermostat-savings-calculator", "pc-power-supply-calculator", "rgb-led-strip-calculator"]
);add(
  "baby-formula-cost-calculator",
  "Baby Formula Cost Calculator",
  "Estimate the total cost of baby formula feeding based on formula type, daily consumption, and feeding duration to budget for your infant.",
  "Finance",
  "finance",
  "$",
  ["baby formula cost", "infant formula budget", "formula feeding cost", "baby feeding expense", "formula price"],
  [
    '{ name: "formulaType", label: "Formula Type", type: "select", options: [{ value: "25", label: "Generic Powder ($25/can)" }, { value: "35", label: "Name Brand Powder ($35/can)" }, { value: "45", label: "Organic Powder ($45/can)" }, { value: "8", label: "Ready-to-Feed ($8/bottle)" }], defaultValue: "35" }',
    '{ name: "ouncesPerDay", label: "Ounces Per Day", type: "number", min: 8, max: 40, defaultValue: 24 }',
    '{ name: "months", label: "Months of Formula Feeding", type: "number", min: 1, max: 18, defaultValue: 12 }',
    '{ name: "canOunces", label: "Powder Ounces Per Can", type: "number", min: 8, max: 40, defaultValue: 12 }'
  ],
  `(inputs) => {
    const costPerCan = inputs.formulaType as number;
    const ouncesPerDay = inputs.ouncesPerDay as number;
    const months = inputs.months as number;
    const canOunces = inputs.canOunces as number;
    const scoopsPerDay = ouncesPerDay / 2;
    const ouncePowderPerDay = scoopsPerDay * 0.32;
    const daysPerCan = canOunces / ouncePowderPerDay;
    const totalDays = months * 30.44;
    const totalCans = Math.ceil(totalDays / daysPerCan);
    const totalCost = totalCans * costPerCan;
    const monthlyCost = totalCost / months;
    const weeklyCost = monthlyCost / 4.33;
    return {
      primary: { label: "Total Formula Cost", value: "$" + formatNumber(Math.round(totalCost)) },
      details: [
        { label: "Monthly Cost", value: "$" + formatNumber(Math.round(monthlyCost)) },
        { label: "Weekly Cost", value: "$" + formatNumber(Math.round(weeklyCost)) },
        { label: "Cans Needed", value: formatNumber(totalCans) },
        { label: "Days Per Can", value: formatNumber(Math.round(daysPerCan * 10) / 10) }
      ]
    };
  }`,
  [
    "Q: How much does baby formula cost per month?||A: Baby formula typically costs between $100 and $300 per month depending on the brand and type. Generic powders are cheapest while ready-to-feed and specialty formulas cost significantly more.",
    "Q: How long do most babies use formula?||A: Most babies use formula until about 12 months of age, when they can transition to whole cow milk. Some specialty formulas may be used longer under pediatric guidance.",
    "Q: Is generic formula as good as name brand?||A: Yes. All infant formula sold in the US must meet strict FDA nutritional standards, so generic formulas are nutritionally equivalent to name-brand options."
  ],
  `Total Cans = Ceiling(Months x 30.44 / Days Per Can)\nDays Per Can = Can Ounces / (Scoops Per Day x 0.32)\nTotal Cost = Total Cans x Cost Per Can`,
  ["diaper-cost-calculator", "baby-food-stage-calculator", "nursery-setup-cost-calculator"]
);

add(
  "diaper-cost-calculator",
  "Diaper Cost Per Month Calculator",
  "Calculate the monthly and annual cost of disposable diapers based on diaper changes per day, brand tier, and your child age stage.",
  "Finance",
  "finance",
  "$",
  ["diaper cost", "diaper budget", "monthly diaper expense", "disposable diaper cost", "diaper spending"],
  [
    '{ name: "changesPerDay", label: "Diaper Changes Per Day", type: "number", min: 4, max: 16, defaultValue: 8 }',
    '{ name: "costPerDiaper", label: "Cost Per Diaper ($)", type: "number", min: 0.10, max: 0.80, defaultValue: 0.28 }',
    '{ name: "months", label: "Months to Calculate", type: "number", min: 1, max: 36, defaultValue: 12 }',
    '{ name: "wipes", label: "Wipes Cost Per Month ($)", type: "number", min: 5, max: 50, defaultValue: 15 }'
  ],
  `(inputs) => {
    const changesPerDay = inputs.changesPerDay as number;
    const costPerDiaper = inputs.costPerDiaper as number;
    const months = inputs.months as number;
    const wipes = inputs.wipes as number;
    const diapersPerMonth = changesPerDay * 30.44;
    const diaperCostPerMonth = diapersPerMonth * costPerDiaper;
    const totalMonthly = diaperCostPerMonth + wipes;
    const totalCost = totalMonthly * months;
    const totalDiapers = Math.round(diapersPerMonth * months);
    const annualized = totalMonthly * 12;
    return {
      primary: { label: "Monthly Diaper Cost", value: "$" + formatNumber(Math.round(totalMonthly)) },
      details: [
        { label: "Total Cost Over Period", value: "$" + formatNumber(Math.round(totalCost)) },
        { label: "Diapers Per Month", value: formatNumber(Math.round(diapersPerMonth)) },
        { label: "Total Diapers Used", value: formatNumber(totalDiapers) },
        { label: "Annualized Cost", value: "$" + formatNumber(Math.round(annualized)) }
      ]
    };
  }`,
  [
    "Q: How many diapers does a newborn use per day?||A: Newborns typically use 10-12 diapers per day. This decreases to about 6-8 per day as the baby grows older and their bladder capacity increases.",
    "Q: How much do diapers cost in the first year?||A: Most families spend between $700 and $1,200 on disposable diapers in the first year, depending on brand choice and diaper changes per day.",
    "Q: When do most children stop using diapers?||A: Most children are potty trained between ages 2 and 3, meaning roughly 2 to 2.5 years of diaper expenses."
  ],
  `Monthly Diaper Cost = Changes/Day x 30.44 x Cost/Diaper + Wipes\nTotal Cost = Monthly Cost x Months`,
  ["baby-formula-cost-calculator", "cloth-diaper-savings-calculator", "baby-food-stage-calculator"]
);

add(
  "baby-food-stage-calculator",
  "Baby Food Stage Calculator",
  "Determine the appropriate baby food stage and estimate monthly feeding costs based on your child age and feeding preferences.",
  "Health",
  "health",
  "H",
  ["baby food stage", "infant feeding", "baby food cost", "solid food introduction", "baby puree"],
  [
    '{ name: "ageMonths", label: "Baby Age (Months)", type: "number", min: 4, max: 24, defaultValue: 8 }',
    '{ name: "jarsPerDay", label: "Jars or Pouches Per Day", type: "number", min: 1, max: 8, defaultValue: 3 }',
    '{ name: "costPerJar", label: "Cost Per Jar/Pouch ($)", type: "number", min: 0.50, max: 3.00, defaultValue: 1.25 }',
    '{ name: "homemadePercent", label: "Homemade Food Percentage (%)", type: "number", min: 0, max: 100, defaultValue: 30 }'
  ],
  `(inputs) => {
    const ageMonths = inputs.ageMonths as number;
    const jarsPerDay = inputs.jarsPerDay as number;
    const costPerJar = inputs.costPerJar as number;
    const homemadePercent = inputs.homemadePercent as number;
    var stage = 1;
    var stageLabel = "Stage 1 - Single Ingredient Purees";
    if (ageMonths >= 8) { stage = 2; stageLabel = "Stage 2 - Combo Purees and Textures"; }
    if (ageMonths >= 10) { stage = 3; stageLabel = "Stage 3 - Chunky Blends and Soft Solids"; }
    if (ageMonths >= 12) { stage = 4; stageLabel = "Table Food Transition"; }
    const storeBoughtRatio = (100 - homemadePercent) / 100;
    const monthlyJars = jarsPerDay * 30.44 * storeBoughtRatio;
    const monthlyCost = monthlyJars * costPerJar;
    const homemadeSavings = jarsPerDay * 30.44 * (homemadePercent / 100) * costPerJar * 0.6;
    const annualCost = monthlyCost * 12;
    return {
      primary: { label: "Feeding Stage", value: stageLabel },
      details: [
        { label: "Monthly Store-Bought Cost", value: "$" + formatNumber(Math.round(monthlyCost)) },
        { label: "Monthly Homemade Savings", value: "$" + formatNumber(Math.round(homemadeSavings)) },
        { label: "Store Jars/Pouches Per Month", value: formatNumber(Math.round(monthlyJars)) },
        { label: "Annual Estimated Cost", value: "$" + formatNumber(Math.round(annualCost)) }
      ]
    };
  }`,
  [
    "Q: When should I start introducing solid foods?||A: The American Academy of Pediatrics recommends introducing solid foods around 6 months of age when the baby shows signs of readiness like sitting up and showing interest in food.",
    "Q: What are the baby food stages?||A: Stage 1 (4-6 months) is single-ingredient purees, Stage 2 (6-8 months) has combo purees, Stage 3 (8-10 months) introduces chunky textures, and toddler foods follow.",
    "Q: Is homemade baby food cheaper?||A: Yes, homemade baby food typically costs 40-60% less than store-bought, and you have full control over ingredients and freshness."
  ],
  `Stage = Based on age (4-6: Stage 1, 6-8: Stage 2, 8-10: Stage 3, 12+: Table Food)\nMonthly Cost = Jars/Day x 30.44 x Store-Bought Ratio x Cost/Jar`,
  ["baby-formula-cost-calculator", "diaper-cost-calculator", "nursery-setup-cost-calculator"]
);

add(
  "nursery-setup-cost-calculator",
  "Nursery Setup Cost Calculator",
  "Estimate the total cost of setting up a baby nursery including furniture, bedding, decor, and essential gear.",
  "Finance",
  "finance",
  "$",
  ["nursery cost", "baby room setup", "nursery budget", "baby furniture cost", "nursery essentials"],
  [
    '{ name: "crib", label: "Crib Cost ($)", type: "number", min: 100, max: 2000, defaultValue: 350 }',
    '{ name: "dresser", label: "Dresser/Changing Table ($)", type: "number", min: 100, max: 1500, defaultValue: 300 }',
    '{ name: "chair", label: "Glider/Rocker Chair ($)", type: "number", min: 100, max: 2000, defaultValue: 400 }',
    '{ name: "bedding", label: "Bedding and Linens ($)", type: "number", min: 50, max: 500, defaultValue: 150 }',
    '{ name: "decor", label: "Decor and Paint ($)", type: "number", min: 50, max: 1000, defaultValue: 200 }',
    '{ name: "extras", label: "Monitor, Lamp, Storage ($)", type: "number", min: 50, max: 1000, defaultValue: 250 }'
  ],
  `(inputs) => {
    const crib = inputs.crib as number;
    const dresser = inputs.dresser as number;
    const chair = inputs.chair as number;
    const bedding = inputs.bedding as number;
    const decor = inputs.decor as number;
    const extras = inputs.extras as number;
    const furniture = crib + dresser + chair;
    const softGoods = bedding + decor;
    const totalCost = furniture + softGoods + extras;
    const perItem = totalCost / 6;
    return {
      primary: { label: "Total Nursery Cost", value: "$" + formatNumber(Math.round(totalCost)) },
      details: [
        { label: "Furniture Subtotal", value: "$" + formatNumber(Math.round(furniture)) },
        { label: "Bedding and Decor", value: "$" + formatNumber(Math.round(softGoods)) },
        { label: "Electronics and Storage", value: "$" + formatNumber(Math.round(extras)) },
        { label: "Average Per Item", value: "$" + formatNumber(Math.round(perItem)) }
      ]
    };
  }`,
  [
    "Q: How much does it cost to set up a nursery?||A: A basic nursery setup costs between $1,000 and $3,000 on average. Budget-friendly options using secondhand furniture can reduce costs to under $800.",
    "Q: What are the essential nursery items?||A: The essentials include a crib with a firm mattress, fitted sheets, a dresser or changing table, a baby monitor, and adequate lighting. A glider is popular but optional.",
    "Q: Can I save money on nursery furniture?||A: Yes, buying secondhand, using convertible furniture that grows with the child, and skipping non-essential decor items can save hundreds of dollars."
  ],
  `Total Cost = Crib + Dresser + Chair + Bedding + Decor + Extras\nFurniture = Crib + Dresser + Chair`,
  ["baby-formula-cost-calculator", "childproofing-cost-calculator", "baby-clothes-size-predictor"]
);

add(
  "maternity-leave-pay-calculator",
  "Maternity Leave Pay Calculator",
  "Calculate your expected income during maternity leave based on employer benefits, state disability insurance, and savings to plan ahead financially.",
  "Finance",
  "finance",
  "$",
  ["maternity leave pay", "maternity benefits", "parental leave income", "pregnancy leave calculator", "paid family leave"],
  [
    '{ name: "weeklySalary", label: "Weekly Gross Salary ($)", type: "number", min: 200, max: 10000, defaultValue: 1200 }',
    '{ name: "paidWeeks", label: "Employer Paid Leave (Weeks)", type: "number", min: 0, max: 26, defaultValue: 6 }',
    '{ name: "paidPercent", label: "Employer Pay Rate (%)", type: "number", min: 0, max: 100, defaultValue: 100 }',
    '{ name: "stateWeeks", label: "State Disability Weeks", type: "number", min: 0, max: 26, defaultValue: 6 }',
    '{ name: "statePercent", label: "State Disability Rate (%)", type: "number", min: 0, max: 80, defaultValue: 60 }',
    '{ name: "unpaidWeeks", label: "Unpaid Leave Weeks", type: "number", min: 0, max: 26, defaultValue: 4 }'
  ],
  `(inputs) => {
    const weeklySalary = inputs.weeklySalary as number;
    const paidWeeks = inputs.paidWeeks as number;
    const paidPercent = inputs.paidPercent as number;
    const stateWeeks = inputs.stateWeeks as number;
    const statePercent = inputs.statePercent as number;
    const unpaidWeeks = inputs.unpaidWeeks as number;
    const employerPay = weeklySalary * (paidPercent / 100) * paidWeeks;
    const statePay = weeklySalary * (statePercent / 100) * stateWeeks;
    const totalLeaveWeeks = paidWeeks + stateWeeks + unpaidWeeks;
    const totalIncome = employerPay + statePay;
    const normalIncome = weeklySalary * totalLeaveWeeks;
    const incomeGap = normalIncome - totalIncome;
    const avgWeeklyDuringLeave = totalLeaveWeeks > 0 ? totalIncome / totalLeaveWeeks : 0;
    return {
      primary: { label: "Total Leave Income", value: "$" + formatNumber(Math.round(totalIncome)) },
      details: [
        { label: "Employer Paid Portion", value: "$" + formatNumber(Math.round(employerPay)) },
        { label: "State Disability Portion", value: "$" + formatNumber(Math.round(statePay)) },
        { label: "Total Leave Duration", value: formatNumber(totalLeaveWeeks) + " weeks" },
        { label: "Income Gap vs Normal Pay", value: "$" + formatNumber(Math.round(incomeGap)) },
        { label: "Average Weekly During Leave", value: "$" + formatNumber(Math.round(avgWeeklyDuringLeave)) }
      ]
    };
  }`,
  [
    "Q: How long is typical maternity leave in the US?||A: The FMLA provides 12 weeks of unpaid job-protected leave. Many employers offer 6-8 weeks of paid leave, and some states provide additional paid family leave benefits.",
    "Q: Does FMLA guarantee paid leave?||A: No. FMLA only guarantees unpaid leave with job protection. Paid leave depends on your employer benefits and state programs like disability insurance or paid family leave.",
    "Q: How can I prepare financially for maternity leave?||A: Start saving early, understand your employer benefits, research state programs, consider short-term disability insurance, and budget for the income gap during unpaid weeks."
  ],
  `Employer Pay = Weekly Salary x Paid% x Paid Weeks\nState Pay = Weekly Salary x State% x State Weeks\nIncome Gap = (Weekly Salary x Total Weeks) - Total Income`,
  ["baby-formula-cost-calculator", "nursery-setup-cost-calculator", "family-emergency-fund-calculator"]
);

add(
  "adoption-cost-estimator",
  "Adoption Cost Estimator",
  "Estimate the total cost of domestic, international, or foster care adoption including legal fees, agency costs, and travel expenses.",
  "Finance",
  "finance",
  "$",
  ["adoption cost", "adoption fees", "adoption budget", "child adoption expense", "adoption process cost"],
  [
    '{ name: "adoptionType", label: "Adoption Type", type: "select", options: [{ value: "1", label: "Domestic Private" }, { value: "2", label: "International" }, { value: "3", label: "Foster Care" }], defaultValue: "1" }',
    '{ name: "agencyFee", label: "Agency/Facilitator Fee ($)", type: "number", min: 0, max: 50000, defaultValue: 15000 }',
    '{ name: "legalFee", label: "Legal Fees ($)", type: "number", min: 500, max: 20000, defaultValue: 5000 }',
    '{ name: "homeStudy", label: "Home Study Fee ($)", type: "number", min: 500, max: 5000, defaultValue: 2000 }',
    '{ name: "travel", label: "Travel Expenses ($)", type: "number", min: 0, max: 30000, defaultValue: 3000 }'
  ],
  `(inputs) => {
    const adoptionType = inputs.adoptionType as number;
    const agencyFee = inputs.agencyFee as number;
    const legalFee = inputs.legalFee as number;
    const homeStudy = inputs.homeStudy as number;
    const travel = inputs.travel as number;
    const typeLabels = ["", "Domestic Private", "International", "Foster Care"];
    const totalCost = agencyFee + legalFee + homeStudy + travel;
    const taxCredit = Math.min(totalCost, 16810);
    const netCost = totalCost - taxCredit;
    return {
      primary: { label: "Total Adoption Cost", value: "$" + formatNumber(Math.round(totalCost)) },
      details: [
        { label: "Adoption Type", value: typeLabels[adoptionType] },
        { label: "Agency/Facilitator Fee", value: "$" + formatNumber(Math.round(agencyFee)) },
        { label: "Legal and Home Study", value: "$" + formatNumber(Math.round(legalFee + homeStudy)) },
        { label: "Federal Tax Credit (Estimated)", value: "$" + formatNumber(Math.round(taxCredit)) },
        { label: "Net Cost After Tax Credit", value: "$" + formatNumber(Math.round(netCost)) }
      ]
    };
  }`,
  [
    "Q: How much does adoption cost on average?||A: Domestic private adoption typically costs $20,000-$50,000, international adoption $25,000-$55,000, and foster care adoption is often free or costs under $3,000.",
    "Q: Is there a tax credit for adoption?||A: Yes, the federal adoption tax credit allows qualifying families to claim up to $16,810 per child for adoption-related expenses.",
    "Q: How long does the adoption process take?||A: Domestic private adoption takes 1-3 years, international adoption 2-5 years, and foster care adoption 1-2 years depending on the circumstances."
  ],
  `Total Cost = Agency Fee + Legal Fees + Home Study + Travel\nNet Cost = Total Cost - Federal Tax Credit (up to $16,810)`,
  ["surrogacy-cost-calculator", "fertility-treatment-cost-calculator", "maternity-leave-pay-calculator"]
);

add(
  "surrogacy-cost-calculator",
  "Surrogacy Cost Calculator",
  "Estimate the total cost of gestational surrogacy including surrogate compensation, agency fees, legal costs, and medical expenses.",
  "Finance",
  "finance",
  "$",
  ["surrogacy cost", "gestational surrogacy", "surrogate mother cost", "surrogacy budget", "surrogacy expenses"],
  [
    '{ name: "surrogateComp", label: "Surrogate Compensation ($)", type: "number", min: 20000, max: 100000, defaultValue: 40000 }',
    '{ name: "agencyFee", label: "Agency Fee ($)", type: "number", min: 5000, max: 40000, defaultValue: 20000 }',
    '{ name: "legalFees", label: "Legal Fees ($)", type: "number", min: 5000, max: 20000, defaultValue: 10000 }',
    '{ name: "medicalIVF", label: "IVF and Medical Costs ($)", type: "number", min: 10000, max: 50000, defaultValue: 25000 }',
    '{ name: "insurance", label: "Surrogate Insurance ($)", type: "number", min: 5000, max: 40000, defaultValue: 15000 }'
  ],
  `(inputs) => {
    const surrogateComp = inputs.surrogateComp as number;
    const agencyFee = inputs.agencyFee as number;
    const legalFees = inputs.legalFees as number;
    const medicalIVF = inputs.medicalIVF as number;
    const insurance = inputs.insurance as number;
    const miscExpenses = surrogateComp * 0.15;
    const totalCost = surrogateComp + agencyFee + legalFees + medicalIVF + insurance + miscExpenses;
    const monthlyIfFinanced = totalCost / 60;
    return {
      primary: { label: "Total Surrogacy Cost", value: "$" + formatNumber(Math.round(totalCost)) },
      details: [
        { label: "Surrogate Compensation", value: "$" + formatNumber(Math.round(surrogateComp)) },
        { label: "Agency and Legal", value: "$" + formatNumber(Math.round(agencyFee + legalFees)) },
        { label: "Medical and IVF", value: "$" + formatNumber(Math.round(medicalIVF)) },
        { label: "Insurance", value: "$" + formatNumber(Math.round(insurance)) },
        { label: "Misc Expenses (Est.)", value: "$" + formatNumber(Math.round(miscExpenses)) },
        { label: "If Financed Over 5 Years", value: "$" + formatNumber(Math.round(monthlyIfFinanced)) + "/mo" }
      ]
    };
  }`,
  [
    "Q: How much does surrogacy cost in the US?||A: Gestational surrogacy in the US typically costs between $100,000 and $200,000 including all agency, legal, medical, and compensation expenses.",
    "Q: What is the difference between gestational and traditional surrogacy?||A: In gestational surrogacy the surrogate has no genetic link to the baby as the embryo is created via IVF. Traditional surrogacy uses the surrogate egg, which is now rarely practiced.",
    "Q: Does insurance cover surrogacy costs?||A: Most standard insurance plans do not cover surrogacy. A separate policy or rider for the surrogate is typically needed, costing $15,000-$30,000."
  ],
  `Total Cost = Surrogate Compensation + Agency + Legal + Medical/IVF + Insurance + Misc\nMisc = Surrogate Compensation x 15%`,
  ["adoption-cost-estimator", "fertility-treatment-cost-calculator", "maternity-leave-pay-calculator"]
);

add(
  "fertility-treatment-cost-calculator",
  "Fertility Treatment Cost Calculator",
  "Estimate the cost of fertility treatments including IVF cycles, IUI, medication, and monitoring to plan your family building budget.",
  "Finance",
  "finance",
  "$",
  ["fertility treatment cost", "IVF cost", "IUI cost", "fertility medication", "reproductive treatment"],
  [
    '{ name: "treatmentType", label: "Treatment Type", type: "select", options: [{ value: "1", label: "IUI (Intrauterine Insemination)" }, { value: "2", label: "IVF (In Vitro Fertilization)" }, { value: "3", label: "IVF with Donor Eggs" }, { value: "4", label: "Frozen Embryo Transfer" }], defaultValue: "2" }',
    '{ name: "cycles", label: "Estimated Number of Cycles", type: "number", min: 1, max: 6, defaultValue: 2 }',
    '{ name: "medicationCost", label: "Medication Cost Per Cycle ($)", type: "number", min: 500, max: 10000, defaultValue: 4000 }',
    '{ name: "insuranceCoverage", label: "Insurance Coverage (%)", type: "number", min: 0, max: 100, defaultValue: 0 }'
  ],
  `(inputs) => {
    const treatmentType = inputs.treatmentType as number;
    const cycles = inputs.cycles as number;
    const medicationCost = inputs.medicationCost as number;
    const insuranceCoverage = inputs.insuranceCoverage as number;
    const baseCosts = [0, 1500, 15000, 25000, 5000];
    const baseCostPerCycle = baseCosts[treatmentType];
    const totalPerCycle = baseCostPerCycle + medicationCost;
    const grossTotal = totalPerCycle * cycles;
    const insuranceSavings = grossTotal * (insuranceCoverage / 100);
    const netCost = grossTotal - insuranceSavings;
    const treatmentLabels = ["", "IUI", "IVF", "IVF with Donor Eggs", "Frozen Embryo Transfer"];
    return {
      primary: { label: "Total Estimated Cost", value: "$" + formatNumber(Math.round(netCost)) },
      details: [
        { label: "Treatment Type", value: treatmentLabels[treatmentType] },
        { label: "Cost Per Cycle (Before Insurance)", value: "$" + formatNumber(Math.round(totalPerCycle)) },
        { label: "Gross Total for All Cycles", value: "$" + formatNumber(Math.round(grossTotal)) },
        { label: "Insurance Savings", value: "$" + formatNumber(Math.round(insuranceSavings)) },
        { label: "Number of Cycles", value: formatNumber(cycles) }
      ]
    };
  }`,
  [
    "Q: How much does one IVF cycle cost?||A: A single IVF cycle typically costs $12,000-$20,000 including medications, monitoring, retrieval, and transfer. Costs vary significantly by clinic and location.",
    "Q: How many IVF cycles are usually needed?||A: The average number of IVF cycles to achieve a live birth is 2-3, though success rates depend on age and individual factors. Success per cycle ranges from 20-50%.",
    "Q: Does insurance cover fertility treatments?||A: Coverage varies widely. About 20 US states have fertility insurance mandates, but coverage details differ. Check your specific plan for IVF and IUI benefits."
  ],
  `Cost Per Cycle = Base Procedure Cost + Medication Cost\nNet Cost = (Cost Per Cycle x Cycles) x (1 - Insurance Coverage%)`,
  ["surrogacy-cost-calculator", "adoption-cost-estimator", "maternity-leave-pay-calculator"]
);

add(
  "baby-shower-budget-calculator",
  "Baby Shower Budget Calculator",
  "Plan and budget your baby shower by estimating costs for venue, food, decorations, games, and favors based on guest count.",
  "Finance",
  "finance",
  "$",
  ["baby shower budget", "baby shower cost", "baby shower planning", "shower party budget", "baby celebration cost"],
  [
    '{ name: "guests", label: "Number of Guests", type: "number", min: 5, max: 100, defaultValue: 25 }',
    '{ name: "foodPerPerson", label: "Food/Drink Per Person ($)", type: "number", min: 5, max: 50, defaultValue: 15 }',
    '{ name: "venue", label: "Venue Cost ($)", type: "number", min: 0, max: 2000, defaultValue: 200 }',
    '{ name: "decorations", label: "Decorations ($)", type: "number", min: 20, max: 500, defaultValue: 75 }',
    '{ name: "favors", label: "Favor Cost Per Guest ($)", type: "number", min: 1, max: 15, defaultValue: 4 }'
  ],
  `(inputs) => {
    const guests = inputs.guests as number;
    const foodPerPerson = inputs.foodPerPerson as number;
    const venue = inputs.venue as number;
    const decorations = inputs.decorations as number;
    const favors = inputs.favors as number;
    const foodTotal = guests * foodPerPerson;
    const favorsTotal = guests * favors;
    const cakeCost = Math.max(40, guests * 3);
    const totalCost = foodTotal + venue + decorations + favorsTotal + cakeCost;
    const perGuest = totalCost / guests;
    return {
      primary: { label: "Total Budget", value: "$" + formatNumber(Math.round(totalCost)) },
      details: [
        { label: "Food and Drinks", value: "$" + formatNumber(Math.round(foodTotal)) },
        { label: "Venue", value: "$" + formatNumber(Math.round(venue)) },
        { label: "Cake/Dessert", value: "$" + formatNumber(Math.round(cakeCost)) },
        { label: "Decorations", value: "$" + formatNumber(Math.round(decorations)) },
        { label: "Party Favors", value: "$" + formatNumber(Math.round(favorsTotal)) },
        { label: "Cost Per Guest", value: "$" + formatNumber(Math.round(perGuest)) }
      ]
    };
  }`,
  [
    "Q: How much does a baby shower typically cost?||A: The average baby shower costs between $400 and $1,500 depending on guest count, venue, and catering choices. At-home showers can be done for under $300.",
    "Q: Who traditionally pays for a baby shower?||A: The host, typically a close friend or family member, traditionally pays for the shower. Some groups split costs among multiple hosts or co-organizers.",
    "Q: How many guests should I invite to a baby shower?||A: Most baby showers have 15-40 guests, though the right number depends on budget, venue capacity, and personal preference."
  ],
  `Total = (Food/Person x Guests) + Venue + Decorations + (Favor x Guests) + Cake\nCost Per Guest = Total / Guests`,
  ["nursery-setup-cost-calculator", "baby-formula-cost-calculator", "birthday-party-per-child-calculator"]
);

add(
  "baby-name-popularity-calculator",
  "Baby Name Popularity Rank Calculator",
  "Estimate the relative popularity and uniqueness of a baby name based on historical ranking trends and frequency data.",
  "Everyday",
  "everyday",
  "~",
  ["baby name popularity", "name ranking", "name frequency", "baby name trends", "unique baby name"],
  [
    '{ name: "currentRank", label: "Current Name Rank (1-1000)", type: "number", min: 1, max: 1000, defaultValue: 150 }',
    '{ name: "birthsPerYear", label: "Annual Births in Country", type: "number", min: 100000, max: 5000000, defaultValue: 3600000 }',
    '{ name: "genderSplit", label: "Gender Share of Births (%)", type: "number", min: 45, max: 55, defaultValue: 51 }',
    '{ name: "trendDirection", label: "Trend Direction", type: "select", options: [{ value: "1.05", label: "Rising" }, { value: "1.0", label: "Stable" }, { value: "0.95", label: "Declining" }], defaultValue: "1.0" }'
  ],
  `(inputs) => {
    const currentRank = inputs.currentRank as number;
    const birthsPerYear = inputs.birthsPerYear as number;
    const genderSplit = inputs.genderSplit as number;
    const trendDirection = inputs.trendDirection as number;
    const genderBirths = birthsPerYear * (genderSplit / 100);
    const estimatedFreq = genderBirths * Math.pow(0.94, Math.log(currentRank) / Math.log(1.5)) / 100;
    const babiesWithName = Math.round(estimatedFreq);
    const percentOfBirths = (estimatedFreq / genderBirths) * 100;
    const inClassOf30 = percentOfBirths * 30 / 100;
    const projectedRank5yr = Math.round(currentRank / Math.pow(trendDirection, 5));
    return {
      primary: { label: "Estimated Babies With This Name/Year", value: formatNumber(babiesWithName) },
      details: [
        { label: "Current Rank", value: "#" + formatNumber(currentRank) },
        { label: "Percentage of Births", value: formatNumber(Math.round(percentOfBirths * 1000) / 1000) + "%" },
        { label: "Chance of Same Name in Class of 30", value: formatNumber(Math.round(inClassOf30 * 100) / 100) + "%" },
        { label: "Projected Rank in 5 Years", value: "#" + formatNumber(projectedRank5yr) }
      ]
    };
  }`,
  [
    "Q: How are baby name rankings determined?||A: Name rankings are based on birth certificate data compiled by the Social Security Administration. Rank 1 is the most popular name given to babies that year.",
    "Q: What is considered a unique baby name?||A: Names ranked below 500 are considered uncommon, and names outside the top 1,000 are considered unique. The top 10 names each account for about 1% of births.",
    "Q: Do baby name trends change quickly?||A: Yes. A name can jump hundreds of ranks in a single year due to pop culture influence. However, classic names tend to remain in the top 200 for decades."
  ],
  `Estimated Frequency = Gender Births x 0.94^(ln(Rank)/ln(1.5)) / 100\nPercentage = Frequency / Gender Births x 100`,
  ["baby-food-stage-calculator", "nursery-setup-cost-calculator", "baby-clothes-size-predictor"]
);

add(
  "car-seat-expiration-calculator",
  "Car Seat Expiration Calculator",
  "Determine when your child car seat expires based on manufacture date and type, plus find the right seat for your child weight and age.",
  "Everyday",
  "everyday",
  "~",
  ["car seat expiration", "car seat lifespan", "child safety seat", "car seat age limit", "car seat replacement"],
  [
    '{ name: "seatType", label: "Car Seat Type", type: "select", options: [{ value: "6", label: "Infant Carrier (6 yr)" }, { value: "8", label: "Convertible Seat (8 yr)" }, { value: "10", label: "Booster Seat (10 yr)" }, { value: "7", label: "All-in-One (7 yr)" }], defaultValue: "8" }',
    '{ name: "mfgYear", label: "Manufacture Year", type: "number", min: 2015, max: 2026, defaultValue: 2022 }',
    '{ name: "childWeight", label: "Child Weight (lbs)", type: "number", min: 4, max: 120, defaultValue: 25 }',
    '{ name: "childAge", label: "Child Age (Months)", type: "number", min: 0, max: 144, defaultValue: 18 }'
  ],
  `(inputs) => {
    const lifespan = inputs.seatType as number;
    const mfgYear = inputs.mfgYear as number;
    const childWeight = inputs.childWeight as number;
    const childAge = inputs.childAge as number;
    const expirationYear = mfgYear + lifespan;
    const currentYear = 2026;
    const yearsRemaining = expirationYear - currentYear;
    const isExpired = yearsRemaining <= 0;
    var recommendedSeat = "Rear-Facing Infant Seat";
    if (childAge >= 12 && childWeight >= 20) { recommendedSeat = "Rear-Facing Convertible (recommended to age 2+)"; }
    if (childAge >= 24 && childWeight >= 30) { recommendedSeat = "Forward-Facing with Harness"; }
    if (childAge >= 48 && childWeight >= 40) { recommendedSeat = "Booster Seat"; }
    if (childAge >= 96 && childWeight >= 65) { recommendedSeat = "Seat Belt (if 4ft 9in+)"; }
    return {
      primary: { label: "Expiration Year", value: isExpired ? "EXPIRED" : formatNumber(expirationYear) },
      details: [
        { label: "Years Remaining", value: isExpired ? "Expired - Replace Immediately" : formatNumber(yearsRemaining) + " years" },
        { label: "Seat Lifespan", value: formatNumber(lifespan) + " years" },
        { label: "Recommended Seat Type", value: recommendedSeat },
        { label: "Child Age", value: formatNumber(Math.floor(childAge / 12)) + " yr " + formatNumber(childAge % 12) + " mo" }
      ]
    };
  }`,
  [
    "Q: Why do car seats expire?||A: Car seats expire because plastic degrades over time from temperature fluctuations and UV exposure, weakening structural integrity. Regulations and safety standards also evolve.",
    "Q: How long do car seats last?||A: Most car seats last 6-10 years from the manufacture date. Check the label on the bottom or back of the seat for the specific expiration date.",
    "Q: When should my child switch from rear-facing to forward-facing?||A: The AAP recommends keeping children rear-facing as long as possible, ideally until age 2 or until they exceed the seat height and weight limits."
  ],
  `Expiration Year = Manufacture Year + Seat Lifespan\nSeat recommendation based on child age and weight milestones`,
  ["baby-clothes-size-predictor", "childproofing-cost-calculator", "stroller-value-comparison-calculator"]
);

add(
  "stroller-value-comparison-calculator",
  "Stroller Value Comparison Calculator",
  "Compare the long-term value of strollers by calculating cost per use based on price, expected usage frequency, and years of use.",
  "Finance",
  "finance",
  "$",
  ["stroller comparison", "stroller value", "stroller cost per use", "stroller budget", "baby stroller calculator"],
  [
    '{ name: "price", label: "Stroller Price ($)", type: "number", min: 50, max: 3000, defaultValue: 400 }',
    '{ name: "usesPerWeek", label: "Uses Per Week", type: "number", min: 1, max: 14, defaultValue: 5 }',
    '{ name: "yearsOfUse", label: "Years of Use", type: "number", min: 1, max: 6, defaultValue: 3 }',
    '{ name: "accessories", label: "Accessories Cost ($)", type: "number", min: 0, max: 500, defaultValue: 75 }',
    '{ name: "resalePercent", label: "Expected Resale Value (%)", type: "number", min: 0, max: 60, defaultValue: 30 }'
  ],
  `(inputs) => {
    const price = inputs.price as number;
    const usesPerWeek = inputs.usesPerWeek as number;
    const yearsOfUse = inputs.yearsOfUse as number;
    const accessories = inputs.accessories as number;
    const resalePercent = inputs.resalePercent as number;
    const totalCost = price + accessories;
    const resaleValue = price * (resalePercent / 100);
    const netCost = totalCost - resaleValue;
    const totalUses = usesPerWeek * 52 * yearsOfUse;
    const costPerUse = netCost / totalUses;
    const monthlyCost = netCost / (yearsOfUse * 12);
    return {
      primary: { label: "Cost Per Use", value: "$" + formatNumber(Math.round(costPerUse * 100) / 100) },
      details: [
        { label: "Total Cost With Accessories", value: "$" + formatNumber(Math.round(totalCost)) },
        { label: "Estimated Resale Value", value: "$" + formatNumber(Math.round(resaleValue)) },
        { label: "Net Cost", value: "$" + formatNumber(Math.round(netCost)) },
        { label: "Total Estimated Uses", value: formatNumber(totalUses) },
        { label: "Monthly Cost", value: "$" + formatNumber(Math.round(monthlyCost * 100) / 100) }
      ]
    };
  }`,
  [
    "Q: Is an expensive stroller worth it?||A: An expensive stroller used daily for 3+ years can have a lower cost per use than a cheap one used less. Durability and resale value make premium strollers cost-effective for active families.",
    "Q: How long can you use a stroller?||A: Most children use strollers until age 3-4. Many strollers accommodate children up to 50 lbs. Jogging strollers may be used even longer.",
    "Q: Do strollers have good resale value?||A: Premium brand strollers like UPPAbaby and Bugaboo retain 30-50% of their value. Budget strollers typically have minimal resale value."
  ],
  `Net Cost = Price + Accessories - (Price x Resale%)\nCost Per Use = Net Cost / (Uses/Week x 52 x Years)`,
  ["car-seat-expiration-calculator", "nursery-setup-cost-calculator", "baby-clothes-size-predictor"]
);

add(
  "baby-clothes-size-predictor",
  "Baby Clothes Size Predictor",
  "Predict the baby clothing size needed based on age, current weight, and growth rate to help with shopping and gift planning.",
  "Everyday",
  "everyday",
  "~",
  ["baby clothes size", "infant clothing size", "baby growth chart", "baby size predictor", "newborn clothing"],
  [
    '{ name: "ageMonths", label: "Current Age (Months)", type: "number", min: 0, max: 36, defaultValue: 6 }',
    '{ name: "currentWeight", label: "Current Weight (lbs)", type: "number", min: 5, max: 40, defaultValue: 16 }',
    '{ name: "currentLength", label: "Current Length (inches)", type: "number", min: 18, max: 40, defaultValue: 26 }',
    '{ name: "monthsAhead", label: "Months Ahead to Predict", type: "number", min: 1, max: 12, defaultValue: 3 }'
  ],
  `(inputs) => {
    const ageMonths = inputs.ageMonths as number;
    const currentWeight = inputs.currentWeight as number;
    const currentLength = inputs.currentLength as number;
    const monthsAhead = inputs.monthsAhead as number;
    const futureAge = ageMonths + monthsAhead;
    const monthlyWeightGain = ageMonths < 6 ? 1.5 : (ageMonths < 12 ? 1.0 : 0.5);
    const monthlyLengthGain = ageMonths < 6 ? 1.0 : (ageMonths < 12 ? 0.6 : 0.4);
    const futureWeight = currentWeight + (monthlyWeightGain * monthsAhead);
    const futureLength = currentLength + (monthlyLengthGain * monthsAhead);
    var size = "Newborn";
    if (futureWeight >= 8 || futureLength >= 21) { size = "0-3 Months"; }
    if (futureWeight >= 12 || futureLength >= 24) { size = "3-6 Months"; }
    if (futureWeight >= 16 || futureLength >= 27) { size = "6-9 Months"; }
    if (futureWeight >= 20 || futureLength >= 29) { size = "9-12 Months"; }
    if (futureWeight >= 24 || futureLength >= 31) { size = "12-18 Months"; }
    if (futureWeight >= 28 || futureLength >= 34) { size = "18-24 Months"; }
    if (futureWeight >= 32 || futureLength >= 36) { size = "2T"; }
    if (futureWeight >= 36 || futureLength >= 39) { size = "3T"; }
    return {
      primary: { label: "Predicted Size", value: size },
      details: [
        { label: "Predicted Weight", value: formatNumber(Math.round(futureWeight * 10) / 10) + " lbs" },
        { label: "Predicted Length", value: formatNumber(Math.round(futureLength * 10) / 10) + " in" },
        { label: "Future Age", value: formatNumber(futureAge) + " months" },
        { label: "Monthly Weight Gain Rate", value: formatNumber(monthlyWeightGain) + " lbs/mo" }
      ]
    };
  }`,
  [
    "Q: How do baby clothing sizes work?||A: Baby sizes are based on age ranges (0-3M, 3-6M, etc.) but fit depends more on weight and length. Always check the weight range on the label rather than the age.",
    "Q: Should I buy clothes ahead of size?||A: Yes, especially for gifts. Babies grow fast and often skip sizes. Buying 1-2 sizes up ensures longer wearability.",
    "Q: Do all brands size the same?||A: No. Baby clothing sizes vary significantly between brands. Carter tends to run true to size while European brands often run smaller."
  ],
  `Future Weight = Current Weight + (Monthly Gain x Months Ahead)\nSize based on predicted weight and length thresholds`,
  ["car-seat-expiration-calculator", "baby-food-stage-calculator", "baby-name-popularity-calculator"]
);

add(
  "childproofing-cost-calculator",
  "Childproofing Cost Calculator",
  "Estimate the total cost of childproofing your home including safety gates, outlet covers, cabinet locks, and furniture anchors.",
  "Finance",
  "finance",
  "$",
  ["childproofing cost", "baby proofing", "home safety baby", "child safety products", "baby gate cost"],
  [
    '{ name: "rooms", label: "Number of Rooms to Childproof", type: "number", min: 1, max: 15, defaultValue: 6 }',
    '{ name: "gates", label: "Safety Gates Needed", type: "number", min: 0, max: 10, defaultValue: 3 }',
    '{ name: "gateCost", label: "Average Gate Cost ($)", type: "number", min: 20, max: 150, defaultValue: 45 }',
    '{ name: "outlets", label: "Outlet Covers Needed", type: "number", min: 5, max: 50, defaultValue: 20 }',
    '{ name: "cabinetLocks", label: "Cabinet/Drawer Locks", type: "number", min: 5, max: 30, defaultValue: 12 }'
  ],
  `(inputs) => {
    const rooms = inputs.rooms as number;
    const gates = inputs.gates as number;
    const gateCost = inputs.gateCost as number;
    const outlets = inputs.outlets as number;
    const cabinetLocks = inputs.cabinetLocks as number;
    const gateTotal = gates * gateCost;
    const outletTotal = outlets * 2.5;
    const lockTotal = cabinetLocks * 5;
    const cornerGuards = rooms * 4 * 1.5;
    const furnitureAnchors = rooms * 2 * 8;
    const miscSafety = rooms * 10;
    const totalCost = gateTotal + outletTotal + lockTotal + cornerGuards + furnitureAnchors + miscSafety;
    const perRoom = totalCost / rooms;
    return {
      primary: { label: "Total Childproofing Cost", value: "$" + formatNumber(Math.round(totalCost)) },
      details: [
        { label: "Safety Gates", value: "$" + formatNumber(Math.round(gateTotal)) },
        { label: "Outlet Covers", value: "$" + formatNumber(Math.round(outletTotal)) },
        { label: "Cabinet/Drawer Locks", value: "$" + formatNumber(Math.round(lockTotal)) },
        { label: "Corner Guards", value: "$" + formatNumber(Math.round(cornerGuards)) },
        { label: "Furniture Anchors", value: "$" + formatNumber(Math.round(furnitureAnchors)) },
        { label: "Cost Per Room", value: "$" + formatNumber(Math.round(perRoom)) }
      ]
    };
  }`,
  [
    "Q: How much does it cost to childproof a house?||A: Basic DIY childproofing costs $200-$500 for a typical home. Professional childproofing services charge $300-$1,000+ depending on home size.",
    "Q: When should I start childproofing?||A: Start childproofing by the time your baby is 6 months old, before they begin crawling. Key areas include stairs, kitchens, bathrooms, and any rooms with hazards.",
    "Q: What are the most important childproofing items?||A: The highest priority items are stair gates, outlet covers, cabinet locks for chemicals and medications, furniture anchors for tip-over prevention, and toilet locks."
  ],
  `Total = Gate Cost + Outlet Covers + Locks + Corner Guards + Furniture Anchors + Misc\nPer Room = Total / Number of Rooms`,
  ["nursery-setup-cost-calculator", "car-seat-expiration-calculator", "nanny-share-cost-calculator"]
);

add(
  "nanny-share-cost-calculator",
  "Nanny Share Cost Calculator",
  "Calculate the cost savings of a nanny share arrangement where two or more families split a nanny salary and related expenses.",
  "Finance",
  "finance",
  "$",
  ["nanny share", "shared nanny cost", "nanny split cost", "childcare sharing", "nanny share savings"],
  [
    '{ name: "nannyHourlyRate", label: "Nanny Hourly Rate ($)", type: "number", min: 15, max: 40, defaultValue: 22 }',
    '{ name: "hoursPerWeek", label: "Hours Per Week", type: "number", min: 20, max: 50, defaultValue: 40 }',
    '{ name: "families", label: "Number of Families Sharing", type: "number", min: 2, max: 4, defaultValue: 2 }',
    '{ name: "shareBonus", label: "Nanny Share Rate Increase (%)", type: "number", min: 0, max: 50, defaultValue: 20 }',
    '{ name: "payrollTax", label: "Payroll Tax and Benefits (%)", type: "number", min: 5, max: 20, defaultValue: 10 }'
  ],
  `(inputs) => {
    const nannyHourlyRate = inputs.nannyHourlyRate as number;
    const hoursPerWeek = inputs.hoursPerWeek as number;
    const families = inputs.families as number;
    const shareBonus = inputs.shareBonus as number;
    const payrollTax = inputs.payrollTax as number;
    const adjustedRate = nannyHourlyRate * (1 + shareBonus / 100);
    const weeklyTotal = adjustedRate * hoursPerWeek;
    const weeklyWithTax = weeklyTotal * (1 + payrollTax / 100);
    const yourWeekly = weeklyWithTax / families;
    const yourMonthly = yourWeekly * 4.33;
    const soloMonthly = nannyHourlyRate * hoursPerWeek * (1 + payrollTax / 100) * 4.33;
    const monthlySavings = soloMonthly - yourMonthly;
    const annualSavings = monthlySavings * 12;
    return {
      primary: { label: "Your Monthly Cost", value: "$" + formatNumber(Math.round(yourMonthly)) },
      details: [
        { label: "Solo Nanny Monthly Cost", value: "$" + formatNumber(Math.round(soloMonthly)) },
        { label: "Monthly Savings vs Solo", value: "$" + formatNumber(Math.round(monthlySavings)) },
        { label: "Annual Savings", value: "$" + formatNumber(Math.round(annualSavings)) },
        { label: "Your Weekly Cost", value: "$" + formatNumber(Math.round(yourWeekly)) },
        { label: "Nanny Total Weekly Pay", value: "$" + formatNumber(Math.round(weeklyWithTax)) }
      ]
    };
  }`,
  [
    "Q: What is a nanny share?||A: A nanny share is when two or more families hire one nanny to care for their children together, typically at one family home. Costs are split, making quality care more affordable.",
    "Q: How much does a nanny share save?||A: Families typically save 25-40% compared to hiring a solo nanny, even with the nanny receiving a higher overall rate for caring for more children.",
    "Q: How does nanny share pay work?||A: The nanny usually receives a 15-25% rate increase for additional children, and families split the total cost evenly. Each family pays less than they would for a solo nanny."
  ],
  `Adjusted Rate = Hourly Rate x (1 + Share Bonus%)\nYour Cost = (Adjusted Rate x Hours x (1 + Tax%)) / Families\nSavings = Solo Monthly - Share Monthly`,
  ["babysitting-rate-calculator", "au-pair-cost-calculator", "daycare-waitlist-estimator"]
);

add(
  "daycare-waitlist-estimator",
  "Daycare Waitlist Time Estimator",
  "Estimate how long you may wait for a daycare spot based on facility size, turnover rate, and your position on the waitlist.",
  "Everyday",
  "everyday",
  "~",
  ["daycare waitlist", "daycare wait time", "childcare availability", "daycare enrollment", "preschool waitlist"],
  [
    '{ name: "capacity", label: "Facility Total Capacity", type: "number", min: 10, max: 200, defaultValue: 60 }',
    '{ name: "annualTurnover", label: "Annual Turnover Rate (%)", type: "number", min: 10, max: 60, defaultValue: 30 }',
    '{ name: "waitlistPosition", label: "Your Position on Waitlist", type: "number", min: 1, max: 100, defaultValue: 8 }',
    '{ name: "ageGroup", label: "Age Group", type: "select", options: [{ value: "0.15", label: "Infant (0-12 mo) - 15% of spots" }, { value: "0.25", label: "Toddler (1-2 yr) - 25% of spots" }, { value: "0.35", label: "Preschool (3-4 yr) - 35% of spots" }, { value: "0.25", label: "Pre-K (4-5 yr) - 25% of spots" }], defaultValue: "0.25" }'
  ],
  `(inputs) => {
    const capacity = inputs.capacity as number;
    const annualTurnover = inputs.annualTurnover as number;
    const waitlistPosition = inputs.waitlistPosition as number;
    const ageGroupShare = inputs.ageGroup as number;
    const ageGroupCapacity = Math.round(capacity * ageGroupShare);
    const annualOpenings = ageGroupCapacity * (annualTurnover / 100);
    const monthlyOpenings = annualOpenings / 12;
    const estimatedMonths = monthlyOpenings > 0 ? waitlistPosition / monthlyOpenings : 99;
    const estimatedWeeks = Math.round(estimatedMonths * 4.33);
    return {
      primary: { label: "Estimated Wait Time", value: formatNumber(Math.round(estimatedMonths)) + " months" },
      details: [
        { label: "Estimated Weeks", value: formatNumber(estimatedWeeks) + " weeks" },
        { label: "Age Group Spots", value: formatNumber(ageGroupCapacity) },
        { label: "Estimated Openings Per Year", value: formatNumber(Math.round(annualOpenings)) },
        { label: "Openings Per Month", value: formatNumber(Math.round(monthlyOpenings * 10) / 10) },
        { label: "Your Waitlist Position", value: "#" + formatNumber(waitlistPosition) }
      ]
    };
  }`,
  [
    "Q: How long is the average daycare waitlist?||A: Daycare waitlists average 3-12 months for toddlers and can exceed 12 months for infant spots. Urban areas and popular facilities tend to have longer waits.",
    "Q: When should I get on a daycare waitlist?||A: Many parents sign up for waitlists during pregnancy or shortly after birth. For infant care, signing up 6-12 months before your desired start date is recommended.",
    "Q: Can I be on multiple daycare waitlists?||A: Yes. Being on multiple waitlists increases your chances of getting a spot sooner. Most facilities charge a small waitlist fee ($50-$200)."
  ],
  `Age Group Spots = Capacity x Age Group Share\nMonthly Openings = (Age Group Spots x Turnover%) / 12\nWait Time = Waitlist Position / Monthly Openings`,
  ["nanny-share-cost-calculator", "babysitting-rate-calculator", "au-pair-cost-calculator"]
);

add(
  "family-grocery-budget-calculator",
  "Family Grocery Budget Calculator",
  "Calculate a realistic monthly grocery budget for your family based on household size, dietary preferences, and cost-saving strategies.",
  "Finance",
  "finance",
  "$",
  ["family grocery budget", "food budget calculator", "grocery spending", "family food cost", "meal planning budget"],
  [
    '{ name: "adults", label: "Number of Adults", type: "number", min: 1, max: 6, defaultValue: 2 }',
    '{ name: "children", label: "Number of Children", type: "number", min: 0, max: 8, defaultValue: 2 }',
    '{ name: "dietType", label: "Diet Type", type: "select", options: [{ value: "1.0", label: "Standard" }, { value: "1.15", label: "Mostly Organic" }, { value: "1.3", label: "Fully Organic" }, { value: "0.9", label: "Budget-Focused" }], defaultValue: "1.0" }',
    '{ name: "mealPlanPercent", label: "Meals Cooked at Home (%)", type: "number", min: 30, max: 100, defaultValue: 75 }',
    '{ name: "region", label: "Cost of Living Region", type: "select", options: [{ value: "0.85", label: "Low Cost Area" }, { value: "1.0", label: "Average Cost Area" }, { value: "1.2", label: "High Cost Area" }, { value: "1.4", label: "Very High Cost Area" }], defaultValue: "1.0" }'
  ],
  `(inputs) => {
    const adults = inputs.adults as number;
    const children = inputs.children as number;
    const dietType = inputs.dietType as number;
    const mealPlanPercent = inputs.mealPlanPercent as number;
    const region = inputs.region as number;
    const adultMonthly = 325;
    const childMonthly = 200;
    const baseMonthly = (adults * adultMonthly + children * childMonthly) * dietType * region;
    const cookedRatio = mealPlanPercent / 100;
    const adjustedMonthly = baseMonthly * (0.5 + 0.5 * cookedRatio);
    const weekly = adjustedMonthly / 4.33;
    const annual = adjustedMonthly * 12;
    const perPerson = adjustedMonthly / (adults + children);
    const dailyPerPerson = perPerson / 30.44;
    return {
      primary: { label: "Monthly Grocery Budget", value: "$" + formatNumber(Math.round(adjustedMonthly)) },
      details: [
        { label: "Weekly Budget", value: "$" + formatNumber(Math.round(weekly)) },
        { label: "Annual Budget", value: "$" + formatNumber(Math.round(annual)) },
        { label: "Per Person Monthly", value: "$" + formatNumber(Math.round(perPerson)) },
        { label: "Daily Per Person", value: "$" + formatNumber(Math.round(dailyPerPerson * 100) / 100) }
      ]
    };
  }`,
  [
    "Q: How much should a family of 4 spend on groceries?||A: The USDA estimates a moderate-cost food plan for a family of 4 costs $900-$1,200 per month. Actual spending depends on diet, location, and shopping habits.",
    "Q: How can families save on groceries?||A: Meal planning, buying store brands, shopping sales, using coupons, buying in bulk, and reducing food waste can save 20-40% on monthly grocery bills.",
    "Q: Does cooking at home really save money?||A: Yes. Cooking at home costs roughly 3-5 times less than restaurant meals and 2-3 times less than takeout for equivalent portions."
  ],
  `Base Monthly = (Adults x $325 + Children x $200) x Diet Multiplier x Region\nAdjusted = Base x (0.5 + 0.5 x Home Cooking Ratio)`,
  ["family-vacation-budget-calculator", "birthday-party-per-child-calculator", "family-phone-plan-cost-calculator"]
);

add(
  "family-phone-plan-cost-calculator",
  "Family Phone Plan Cost Calculator",
  "Compare and estimate the monthly cost of family phone plans based on number of lines, data needs, and device payment options.",
  "Finance",
  "finance",
  "$",
  ["family phone plan", "cell phone family cost", "mobile plan comparison", "family wireless plan", "phone plan budget"],
  [
    '{ name: "lines", label: "Number of Lines", type: "number", min: 2, max: 8, defaultValue: 4 }',
    '{ name: "dataPerLine", label: "Data Tier", type: "select", options: [{ value: "30", label: "Basic 5GB ($30/line)" }, { value: "45", label: "Standard 15GB ($45/line)" }, { value: "55", label: "Unlimited ($55/line)" }, { value: "70", label: "Premium Unlimited ($70/line)" }], defaultValue: "55" }',
    '{ name: "devicePayments", label: "Device Payments Per Month ($)", type: "number", min: 0, max: 200, defaultValue: 50 }',
    '{ name: "insurance", label: "Device Insurance Per Line ($)", type: "number", min: 0, max: 20, defaultValue: 8 }'
  ],
  `(inputs) => {
    const lines = inputs.lines as number;
    const dataPerLine = inputs.dataPerLine as number;
    const devicePayments = inputs.devicePayments as number;
    const insurance = inputs.insurance as number;
    const planCost = lines * dataPerLine;
    const multiLineDiscount = lines >= 3 ? planCost * 0.1 : 0;
    const insuranceTotal = lines * insurance;
    const fees = lines * 3.5;
    const monthly = planCost - multiLineDiscount + devicePayments + insuranceTotal + fees;
    const annual = monthly * 12;
    const perLine = monthly / lines;
    return {
      primary: { label: "Monthly Family Plan Cost", value: "$" + formatNumber(Math.round(monthly)) },
      details: [
        { label: "Plan Base Cost", value: "$" + formatNumber(Math.round(planCost)) },
        { label: "Multi-Line Discount", value: "-$" + formatNumber(Math.round(multiLineDiscount)) },
        { label: "Device Payments", value: "$" + formatNumber(Math.round(devicePayments)) },
        { label: "Insurance and Fees", value: "$" + formatNumber(Math.round(insuranceTotal + fees)) },
        { label: "Cost Per Line", value: "$" + formatNumber(Math.round(perLine)) },
        { label: "Annual Cost", value: "$" + formatNumber(Math.round(annual)) }
      ]
    };
  }`,
  [
    "Q: How much does a family phone plan cost?||A: A family plan for 4 lines typically costs $120-$300 per month depending on the carrier, data plan, and device payments.",
    "Q: Is a family plan cheaper than individual plans?||A: Yes. Family plans offer per-line discounts, typically saving 20-40% compared to separate individual plans for the same number of lines.",
    "Q: Should I include device insurance?||A: Device insurance adds $8-17 per line monthly. It is worth considering for expensive phones but may not be cost-effective for budget devices."
  ],
  `Monthly = (Lines x Rate - Multi-Line Discount) + Device Payments + (Insurance x Lines) + Fees\nMulti-Line Discount = 10% if 3+ lines`,
  ["family-grocery-budget-calculator", "family-vacation-budget-calculator", "college-529-projector-calculator"]
);

add(
  "college-529-projector-calculator",
  "College 529 Plan Projector Calculator",
  "Project the future value of 529 college savings plan contributions with tax-free growth to estimate college funding readiness.",
  "Finance",
  "finance",
  "$",
  ["529 plan projector", "college savings growth", "529 calculator", "education fund projector", "college investment"],
  [
    '{ name: "currentBalance", label: "Current 529 Balance ($)", type: "number", min: 0, max: 500000, defaultValue: 5000 }',
    '{ name: "monthlyContribution", label: "Monthly Contribution ($)", type: "number", min: 0, max: 5000, defaultValue: 300 }',
    '{ name: "yearsToCollege", label: "Years Until College", type: "number", min: 1, max: 18, defaultValue: 12 }',
    '{ name: "annualReturn", label: "Expected Annual Return (%)", type: "number", min: 2, max: 12, defaultValue: 7 }',
    '{ name: "annualCollegeCost", label: "Projected Annual College Cost ($)", type: "number", min: 10000, max: 100000, defaultValue: 35000 }'
  ],
  `(inputs) => {
    const currentBalance = inputs.currentBalance as number;
    const monthlyContribution = inputs.monthlyContribution as number;
    const yearsToCollege = inputs.yearsToCollege as number;
    const annualReturn = inputs.annualReturn as number;
    const annualCollegeCost = inputs.annualCollegeCost as number;
    const r = annualReturn / 100 / 12;
    const n = yearsToCollege * 12;
    const futureValueLump = currentBalance * Math.pow(1 + r, n);
    const futureValueContrib = monthlyContribution * ((Math.pow(1 + r, n) - 1) / r);
    const totalFutureValue = futureValueLump + futureValueContrib;
    const totalContributed = currentBalance + (monthlyContribution * n);
    const growthEarnings = totalFutureValue - totalContributed;
    const fourYearCost = annualCollegeCost * 4 * Math.pow(1.04, yearsToCollege);
    const coveragePercent = (totalFutureValue / fourYearCost) * 100;
    const gap = fourYearCost - totalFutureValue;
    return {
      primary: { label: "Projected 529 Balance", value: "$" + formatNumber(Math.round(totalFutureValue)) },
      details: [
        { label: "Total Contributions", value: "$" + formatNumber(Math.round(totalContributed)) },
        { label: "Tax-Free Growth", value: "$" + formatNumber(Math.round(growthEarnings)) },
        { label: "Projected 4-Year Cost", value: "$" + formatNumber(Math.round(fourYearCost)) },
        { label: "Coverage Percentage", value: formatNumber(Math.round(coveragePercent)) + "%" },
        { label: "Funding Gap (if any)", value: gap > 0 ? "$" + formatNumber(Math.round(gap)) : "Fully Funded" }
      ]
    };
  }`,
  [
    "Q: What is a 529 plan?||A: A 529 plan is a tax-advantaged investment account designed for education savings. Earnings grow tax-free and withdrawals for qualified education expenses are not taxed.",
    "Q: How much should I save in a 529 plan?||A: Financial advisors suggest saving enough to cover at least 50-75% of projected college costs. Even smaller amounts benefit from years of tax-free compound growth.",
    "Q: What happens to unused 529 funds?||A: Unused 529 funds can be transferred to another family member for their education, used for K-12 tuition (up to $10,000/year), or rolled into a Roth IRA under recent legislation."
  ],
  `Future Value = Current x (1 + r)^n + Monthly x ((1 + r)^n - 1) / r\nProjected College Cost = Annual Cost x 4 x 1.04^Years\nCoverage = Future Value / College Cost x 100`,
  ["family-emergency-fund-calculator", "maternity-leave-pay-calculator", "family-grocery-budget-calculator"]
);

add(
  "family-vacation-budget-calculator",
  "Family Vacation Budget Calculator",
  "Plan and budget a family vacation by estimating costs for travel, accommodation, food, activities, and incidentals based on destination and family size.",
  "Finance",
  "finance",
  "$",
  ["family vacation budget", "family trip cost", "vacation planner", "travel budget family", "holiday cost calculator"],
  [
    '{ name: "familySize", label: "Family Size", type: "number", min: 2, max: 10, defaultValue: 4 }',
    '{ name: "nights", label: "Number of Nights", type: "number", min: 1, max: 21, defaultValue: 7 }',
    '{ name: "hotelPerNight", label: "Accommodation Per Night ($)", type: "number", min: 50, max: 1000, defaultValue: 175 }',
    '{ name: "travelCostTotal", label: "Round Trip Travel Total ($)", type: "number", min: 100, max: 10000, defaultValue: 1600 }',
    '{ name: "foodPerPersonDay", label: "Food Per Person Per Day ($)", type: "number", min: 20, max: 150, defaultValue: 50 }',
    '{ name: "activitiesPerDay", label: "Activities Per Day ($)", type: "number", min: 0, max: 500, defaultValue: 80 }'
  ],
  `(inputs) => {
    const familySize = inputs.familySize as number;
    const nights = inputs.nights as number;
    const hotelPerNight = inputs.hotelPerNight as number;
    const travelCostTotal = inputs.travelCostTotal as number;
    const foodPerPersonDay = inputs.foodPerPersonDay as number;
    const activitiesPerDay = inputs.activitiesPerDay as number;
    const days = nights + 1;
    const hotelTotal = hotelPerNight * nights;
    const foodTotal = foodPerPersonDay * familySize * days;
    const activitiesTotal = activitiesPerDay * days;
    const miscellaneous = (hotelTotal + foodTotal + activitiesTotal) * 0.1;
    const totalCost = travelCostTotal + hotelTotal + foodTotal + activitiesTotal + miscellaneous;
    const perPerson = totalCost / familySize;
    const perDay = totalCost / days;
    return {
      primary: { label: "Total Vacation Budget", value: "$" + formatNumber(Math.round(totalCost)) },
      details: [
        { label: "Travel", value: "$" + formatNumber(Math.round(travelCostTotal)) },
        { label: "Accommodation", value: "$" + formatNumber(Math.round(hotelTotal)) },
        { label: "Food", value: "$" + formatNumber(Math.round(foodTotal)) },
        { label: "Activities", value: "$" + formatNumber(Math.round(activitiesTotal)) },
        { label: "Miscellaneous (10%)", value: "$" + formatNumber(Math.round(miscellaneous)) },
        { label: "Cost Per Person", value: "$" + formatNumber(Math.round(perPerson)) }
      ]
    };
  }`,
  [
    "Q: How much does a family vacation cost?||A: The average American family of 4 spends $2,000-$5,000 on a week-long domestic vacation. International trips typically cost $5,000-$10,000+.",
    "Q: How can families save on vacation costs?||A: Traveling during off-peak seasons, booking early, using rewards points, choosing vacation rentals over hotels, and packing snacks can significantly reduce costs.",
    "Q: How much should I budget for food on vacation?||A: Budget $30-$60 per person per day for meals. Families can save by eating breakfast at the hotel, packing lunches, and reserving restaurants for dinner."
  ],
  `Total = Travel + (Hotel x Nights) + (Food x Family x Days) + (Activities x Days) + 10% Misc\nCost Per Person = Total / Family Size`,
  ["family-grocery-budget-calculator", "birthday-party-per-child-calculator", "family-phone-plan-cost-calculator"]
);

add(
  "birthday-party-per-child-calculator",
  "Birthday Party Cost Per Child Calculator",
  "Calculate the total cost of hosting a children birthday party and determine the per-child expense for venue, food, cake, and party bags.",
  "Finance",
  "finance",
  "$",
  ["birthday party cost", "kids party budget", "children party planner", "party cost per child", "birthday celebration budget"],
  [
    '{ name: "children", label: "Number of Children", type: "number", min: 5, max: 50, defaultValue: 15 }',
    '{ name: "venue", label: "Venue/Entertainment Cost ($)", type: "number", min: 0, max: 2000, defaultValue: 300 }',
    '{ name: "foodPerChild", label: "Food Per Child ($)", type: "number", min: 3, max: 30, defaultValue: 10 }',
    '{ name: "cake", label: "Cake Cost ($)", type: "number", min: 20, max: 300, defaultValue: 60 }',
    '{ name: "partyBagPerChild", label: "Party Bag Per Child ($)", type: "number", min: 2, max: 20, defaultValue: 6 }',
    '{ name: "decorations", label: "Decorations ($)", type: "number", min: 10, max: 300, defaultValue: 40 }'
  ],
  `(inputs) => {
    const children = inputs.children as number;
    const venue = inputs.venue as number;
    const foodPerChild = inputs.foodPerChild as number;
    const cake = inputs.cake as number;
    const partyBagPerChild = inputs.partyBagPerChild as number;
    const decorations = inputs.decorations as number;
    const foodTotal = foodPerChild * children;
    const partyBagsTotal = partyBagPerChild * children;
    const totalCost = venue + foodTotal + cake + partyBagsTotal + decorations;
    const perChild = totalCost / children;
    return {
      primary: { label: "Total Party Cost", value: "$" + formatNumber(Math.round(totalCost)) },
      details: [
        { label: "Cost Per Child", value: "$" + formatNumber(Math.round(perChild)) },
        { label: "Venue/Entertainment", value: "$" + formatNumber(Math.round(venue)) },
        { label: "Food Total", value: "$" + formatNumber(Math.round(foodTotal)) },
        { label: "Cake", value: "$" + formatNumber(Math.round(cake)) },
        { label: "Party Bags Total", value: "$" + formatNumber(Math.round(partyBagsTotal)) },
        { label: "Decorations", value: "$" + formatNumber(Math.round(decorations)) }
      ]
    };
  }`,
  [
    "Q: How much does a kids birthday party cost?||A: The average children birthday party costs $300-$500 for an at-home party and $400-$800+ for a venue party, depending on guest count and activities.",
    "Q: How many kids should I invite to a birthday party?||A: A common guideline is to invite the same number of children as the birthday child age (a 5-year-old gets 5 guests), though personal preference varies.",
    "Q: What are budget-friendly party ideas?||A: Park parties, backyard cookouts, movie nights, and themed craft parties are affordable options that keep costs under $200 for 10-15 children."
  ],
  `Total = Venue + (Food/Child x Children) + Cake + (Bag/Child x Children) + Decorations\nCost Per Child = Total / Number of Children`,
  ["family-vacation-budget-calculator", "baby-shower-budget-calculator", "family-grocery-budget-calculator"]
);

add(
  "family-emergency-fund-calculator",
  "Family Emergency Fund Calculator",
  "Calculate the recommended emergency fund size for your family based on monthly expenses, income sources, dependents, and risk factors.",
  "Finance",
  "finance",
  "$",
  ["emergency fund", "family savings goal", "rainy day fund", "emergency savings", "financial safety net"],
  [
    '{ name: "monthlyExpenses", label: "Monthly Essential Expenses ($)", type: "number", min: 1000, max: 20000, defaultValue: 4500 }',
    '{ name: "monthsRecommended", label: "Months of Coverage", type: "number", min: 3, max: 12, defaultValue: 6 }',
    '{ name: "dependents", label: "Number of Dependents", type: "number", min: 0, max: 10, defaultValue: 2 }',
    '{ name: "incomeStability", label: "Income Stability", type: "select", options: [{ value: "0.8", label: "Very Stable (Government/Tenured)" }, { value: "1.0", label: "Stable (Salaried)" }, { value: "1.3", label: "Variable (Commission/Freelance)" }, { value: "1.5", label: "Unstable (Seasonal/Gig)" }], defaultValue: "1.0" }',
    '{ name: "currentSavings", label: "Current Emergency Savings ($)", type: "number", min: 0, max: 200000, defaultValue: 5000 }'
  ],
  `(inputs) => {
    const monthlyExpenses = inputs.monthlyExpenses as number;
    const monthsRecommended = inputs.monthsRecommended as number;
    const dependents = inputs.dependents as number;
    const incomeStability = inputs.incomeStability as number;
    const currentSavings = inputs.currentSavings as number;
    const dependentAdj = 1 + (dependents * 0.05);
    const targetFund = monthlyExpenses * monthsRecommended * incomeStability * dependentAdj;
    const gap = Math.max(0, targetFund - currentSavings);
    const monthsToGoal12 = gap / (monthlyExpenses * 0.15);
    const percentComplete = Math.min(100, (currentSavings / targetFund) * 100);
    return {
      primary: { label: "Recommended Emergency Fund", value: "$" + formatNumber(Math.round(targetFund)) },
      details: [
        { label: "Current Savings", value: "$" + formatNumber(Math.round(currentSavings)) },
        { label: "Remaining Gap", value: "$" + formatNumber(Math.round(gap)) },
        { label: "Progress", value: formatNumber(Math.round(percentComplete)) + "%" },
        { label: "Months to Goal (Saving 15%)", value: gap > 0 ? formatNumber(Math.round(monthsToGoal12)) + " months" : "Goal Reached" },
        { label: "Months of Coverage Funded", value: formatNumber(Math.round((currentSavings / monthlyExpenses) * 10) / 10) }
      ]
    };
  }`,
  [
    "Q: How much should a family have in an emergency fund?||A: Financial experts recommend 3-6 months of essential expenses for dual-income families and 6-12 months for single-income households or variable income earners.",
    "Q: Where should I keep my emergency fund?||A: Keep emergency funds in a high-yield savings account that is easily accessible but separate from your daily checking account to avoid temptation to spend it.",
    "Q: What counts as a financial emergency?||A: True emergencies include job loss, medical emergencies, urgent home or car repairs, and unexpected family needs. Planned expenses and discretionary purchases are not emergencies."
  ],
  `Target = Monthly Expenses x Months x Income Stability Factor x (1 + Dependents x 5%)\nGap = Target - Current Savings`,
  ["maternity-leave-pay-calculator", "college-529-projector-calculator", "estate-planning-cost-calculator"]
);

add(
  "estate-planning-cost-calculator",
  "Estate Planning Cost Calculator",
  "Estimate the cost of essential estate planning documents including wills, trusts, power of attorney, and guardianship designations for families.",
  "Finance",
  "finance",
  "$",
  ["estate planning cost", "will cost", "trust cost", "estate attorney fees", "family estate plan"],
  [
    '{ name: "planType", label: "Estate Plan Type", type: "select", options: [{ value: "1", label: "Basic Will Package" }, { value: "2", label: "Will + Trust" }, { value: "3", label: "Comprehensive Estate Plan" }], defaultValue: "2" }',
    '{ name: "estateSize", label: "Estimated Estate Value ($)", type: "number", min: 50000, max: 10000000, defaultValue: 500000 }',
    '{ name: "region", label: "Cost Region", type: "select", options: [{ value: "0.8", label: "Low Cost Area" }, { value: "1.0", label: "Average" }, { value: "1.3", label: "High Cost Area" }, { value: "1.6", label: "Major Metro" }], defaultValue: "1.0" }',
    '{ name: "children", label: "Number of Minor Children", type: "number", min: 0, max: 10, defaultValue: 2 }'
  ],
  `(inputs) => {
    const planType = inputs.planType as number;
    const estateSize = inputs.estateSize as number;
    const region = inputs.region as number;
    const children = inputs.children as number;
    const baseCosts = [0, 500, 2500, 5000];
    const baseCost = baseCosts[planType];
    const guardianshipCost = children > 0 ? 200 + (children * 50) : 0;
    const complexityAdj = estateSize > 1000000 ? 1.3 : (estateSize > 500000 ? 1.15 : 1.0);
    const totalCost = (baseCost + guardianshipCost) * region * complexityAdj;
    const planLabels = ["", "Basic Will Package", "Will + Trust", "Comprehensive Estate Plan"];
    const annualMaintenance = planType >= 2 ? totalCost * 0.05 : 0;
    return {
      primary: { label: "Estimated Estate Planning Cost", value: "$" + formatNumber(Math.round(totalCost)) },
      details: [
        { label: "Plan Type", value: planLabels[planType] },
        { label: "Base Legal Fees", value: "$" + formatNumber(Math.round(baseCost * region)) },
        { label: "Guardianship Documents", value: "$" + formatNumber(Math.round(guardianshipCost * region)) },
        { label: "Complexity Adjustment", value: formatNumber(Math.round((complexityAdj - 1) * 100)) + "% premium" },
        { label: "Annual Maintenance/Updates", value: "$" + formatNumber(Math.round(annualMaintenance)) }
      ]
    };
  }`,
  [
    "Q: How much does a basic will cost?||A: A simple will costs $300-$1,000 when prepared by an attorney. Online will services cost $50-$200 but may not address complex family situations.",
    "Q: Do families with children need a trust?||A: A trust is not required but is recommended for families with minor children, as it provides more control over how assets are managed and distributed for children.",
    "Q: How often should estate plans be updated?||A: Review your estate plan every 3-5 years or after major life events like births, deaths, marriages, divorces, or significant changes in assets."
  ],
  `Total = (Base Cost + Guardianship) x Region Multiplier x Complexity Adjustment\nGuardianship = $200 + $50 per child`,
  ["family-emergency-fund-calculator", "family-life-insurance-calculator", "college-529-projector-calculator"]
);

add(
  "family-life-insurance-calculator",
  "Family Life Insurance Needs Calculator",
  "Calculate how much life insurance coverage your family needs based on income replacement, debts, education funding, and final expenses.",
  "Finance",
  "finance",
  "$",
  ["life insurance needs", "family insurance", "insurance coverage calculator", "income replacement", "death benefit"],
  [
    '{ name: "annualIncome", label: "Annual Income to Replace ($)", type: "number", min: 20000, max: 500000, defaultValue: 75000 }',
    '{ name: "yearsToReplace", label: "Years of Income Needed", type: "number", min: 5, max: 30, defaultValue: 15 }',
    '{ name: "totalDebts", label: "Total Outstanding Debts ($)", type: "number", min: 0, max: 1000000, defaultValue: 250000 }',
    '{ name: "childEducation", label: "Education Fund Per Child ($)", type: "number", min: 0, max: 200000, defaultValue: 80000 }',
    '{ name: "numChildren", label: "Number of Children", type: "number", min: 0, max: 8, defaultValue: 2 }',
    '{ name: "existingCoverage", label: "Existing Life Insurance ($)", type: "number", min: 0, max: 2000000, defaultValue: 100000 }'
  ],
  `(inputs) => {
    const annualIncome = inputs.annualIncome as number;
    const yearsToReplace = inputs.yearsToReplace as number;
    const totalDebts = inputs.totalDebts as number;
    const childEducation = inputs.childEducation as number;
    const numChildren = inputs.numChildren as number;
    const existingCoverage = inputs.existingCoverage as number;
    const incomeNeeds = annualIncome * yearsToReplace;
    const educationNeeds = childEducation * numChildren;
    const finalExpenses = 15000;
    const totalNeeds = incomeNeeds + totalDebts + educationNeeds + finalExpenses;
    const additionalNeeded = Math.max(0, totalNeeds - existingCoverage);
    const estMonthlyPremium20yr = (additionalNeeded / 1000) * 0.55;
    return {
      primary: { label: "Total Insurance Needed", value: "$" + formatNumber(Math.round(totalNeeds)) },
      details: [
        { label: "Income Replacement", value: "$" + formatNumber(Math.round(incomeNeeds)) },
        { label: "Debt Payoff", value: "$" + formatNumber(Math.round(totalDebts)) },
        { label: "Education Funding", value: "$" + formatNumber(Math.round(educationNeeds)) },
        { label: "Final Expenses", value: "$" + formatNumber(finalExpenses) },
        { label: "Additional Coverage Needed", value: "$" + formatNumber(Math.round(additionalNeeded)) },
        { label: "Est. Monthly Premium (20-yr term)", value: "$" + formatNumber(Math.round(estMonthlyPremium20yr)) }
      ]
    };
  }`,
  [
    "Q: How much life insurance does a family need?||A: A common rule of thumb is 10-12 times your annual income, but a thorough needs analysis considering debts, education, and income replacement gives a more accurate figure.",
    "Q: What type of life insurance is best for families?||A: Term life insurance offers the most affordable coverage for families. A 20 or 30-year term policy provides protection during the years your family depends on your income.",
    "Q: Is employer-provided life insurance enough?||A: Employer coverage (typically 1-2x salary) is rarely sufficient for families. It also ends when you leave the job, so supplemental personal coverage is recommended."
  ],
  `Total Needs = (Annual Income x Years) + Debts + (Education x Children) + Final Expenses\nAdditional Needed = Total Needs - Existing Coverage`,
  ["estate-planning-cost-calculator", "family-emergency-fund-calculator", "maternity-leave-pay-calculator"]
);

add(
  "family-health-insurance-cost-calculator",
  "Family Health Insurance Cost Calculator",
  "Compare family health insurance plan costs by estimating premiums, deductibles, copays, and out-of-pocket maximums for different plan types.",
  "Finance",
  "finance",
  "$",
  ["health insurance cost", "family health plan", "insurance comparison", "health coverage cost", "medical insurance"],
  [
    '{ name: "planType", label: "Plan Type", type: "select", options: [{ value: "1", label: "HMO" }, { value: "2", label: "PPO" }, { value: "3", label: "HDHP with HSA" }, { value: "4", label: "EPO" }], defaultValue: "2" }',
    '{ name: "monthlyPremium", label: "Monthly Premium ($)", type: "number", min: 200, max: 3000, defaultValue: 800 }',
    '{ name: "deductible", label: "Annual Deductible ($)", type: "number", min: 0, max: 15000, defaultValue: 3000 }',
    '{ name: "expectedVisits", label: "Expected Doctor Visits/Year", type: "number", min: 0, max: 50, defaultValue: 12 }',
    '{ name: "copay", label: "Average Copay Per Visit ($)", type: "number", min: 0, max: 100, defaultValue: 30 }',
    '{ name: "oopMax", label: "Out-of-Pocket Maximum ($)", type: "number", min: 1000, max: 20000, defaultValue: 8000 }'
  ],
  `(inputs) => {
    const planType = inputs.planType as number;
    const monthlyPremium = inputs.monthlyPremium as number;
    const deductible = inputs.deductible as number;
    const expectedVisits = inputs.expectedVisits as number;
    const copay = inputs.copay as number;
    const oopMax = inputs.oopMax as number;
    const annualPremium = monthlyPremium * 12;
    const copayTotal = expectedVisits * copay;
    const estimatedOOP = Math.min(copayTotal + deductible, oopMax);
    const totalAnnualCost = annualPremium + estimatedOOP;
    const worstCase = annualPremium + oopMax;
    const planLabels = ["", "HMO", "PPO", "HDHP with HSA", "EPO"];
    const monthlyTotal = totalAnnualCost / 12;
    return {
      primary: { label: "Estimated Annual Cost", value: "$" + formatNumber(Math.round(totalAnnualCost)) },
      details: [
        { label: "Plan Type", value: planLabels[planType] },
        { label: "Annual Premiums", value: "$" + formatNumber(Math.round(annualPremium)) },
        { label: "Estimated Out-of-Pocket", value: "$" + formatNumber(Math.round(estimatedOOP)) },
        { label: "Monthly Total (Estimated)", value: "$" + formatNumber(Math.round(monthlyTotal)) },
        { label: "Worst Case (Max OOP)", value: "$" + formatNumber(Math.round(worstCase)) }
      ]
    };
  }`,
  [
    "Q: How much does family health insurance cost?||A: The average family health insurance premium is about $1,500-$2,000 per month for employer-sponsored plans, with the employer covering roughly 70% of the cost.",
    "Q: What is the difference between HMO and PPO?||A: HMO plans cost less but require referrals and in-network care. PPO plans offer more flexibility to see specialists and out-of-network providers at a higher cost.",
    "Q: What is an HDHP with HSA?||A: A High Deductible Health Plan paired with a Health Savings Account has lower premiums and higher deductibles. HSA contributions are tax-deductible and grow tax-free."
  ],
  `Annual Cost = (Monthly Premium x 12) + min(Copays + Deductible, OOP Max)\nWorst Case = Annual Premium + Out-of-Pocket Maximum`,
  ["family-life-insurance-calculator", "family-emergency-fund-calculator", "family-grocery-budget-calculator"]
);
add(
  "roche-limit-calculator",
  "Roche Limit Calculator",
  "Calculate the Roche limit distance at which a celestial body held together only by gravity will be torn apart by tidal forces from a larger body.",
  "Science",
  "science",
  "A",
  ["roche limit", "tidal disruption", "satellite breakup", "gravitational limit"],
  [
    '{ name: "primaryRadius", label: "Primary Body Radius (km)", type: "number", min: 1, max: 1000000, defaultValue: 6371 }',
    '{ name: "primaryDensity", label: "Primary Body Density (kg/m3)", type: "number", min: 100, max: 30000, defaultValue: 5514 }',
    '{ name: "secondaryDensity", label: "Secondary Body Density (kg/m3)", type: "number", min: 100, max: 30000, defaultValue: 3346 }'
  ],
  `(inputs) => {
    const R = inputs.primaryRadius as number;
    const rhoP = inputs.primaryDensity as number;
    const rhoS = inputs.secondaryDensity as number;
    const rocheRigid = R * 1.26 * Math.pow(rhoP / rhoS, 1 / 3);
    const rocheFluid = R * 2.44 * Math.pow(rhoP / rhoS, 1 / 3);
    const ratio = rhoP / rhoS;
    return {
      primary: { label: "Roche Limit (Rigid Body)", value: formatNumber(Math.round(rocheRigid)) + " km" },
      details: [
        { label: "Roche Limit (Fluid Body)", value: formatNumber(Math.round(rocheFluid)) + " km" },
        { label: "Density Ratio", value: formatNumber(Math.round(ratio * 1000) / 1000) },
        { label: "Primary Radius", value: formatNumber(R) + " km" }
      ]
    };
  }`,
  [
    { q: "What is the Roche limit?", a: "The Roche limit is the minimum distance at which a smaller body can orbit a larger one without being torn apart by tidal forces. Inside this limit, gravitational tides exceed the self-gravity holding the smaller body together." },
    { q: "Why are there rigid and fluid Roche limits?", a: "A rigid body resists deformation and can survive closer to the primary. A fluid body deforms easily and is disrupted at a greater distance. Real bodies fall somewhere between these two extremes." },
    { q: "How do planetary rings relate to the Roche limit?", a: "Planetary rings like those of Saturn exist within the Roche limit of their planet. Material inside the Roche limit cannot coalesce into a moon and instead remains as a ring of small particles." }
  ],
  `Roche Limit (rigid) = R x 1.26 x (rho_primary / rho_secondary)^(1/3)
Roche Limit (fluid) = R x 2.44 x (rho_primary / rho_secondary)^(1/3)`,
  ["orbital-velocity-calculator", "planetary-weight-calculator"]
);

add(
  "lagrange-point-calculator",
  "Lagrange Point Calculator",
  "Calculate the distances to L1, L2, and L3 Lagrange points for a two-body gravitational system such as the Sun-Earth or Earth-Moon system.",
  "Science",
  "science",
  "A",
  ["lagrange point", "L1 L2 L3", "gravitational equilibrium", "orbital mechanics"],
  [
    '{ name: "massPrimary", label: "Primary Mass (kg, e.g. Sun)", type: "number", min: 1e10, max: 1e35, defaultValue: 1.989e30 }',
    '{ name: "massSecondary", label: "Secondary Mass (kg, e.g. Earth)", type: "number", min: 1, max: 1e30, defaultValue: 5.972e24 }',
    '{ name: "distance", label: "Orbital Distance (km)", type: "number", min: 1000, max: 1e12, defaultValue: 149597870 }'
  ],
  `(inputs) => {
    const M = inputs.massPrimary as number;
    const m = inputs.massSecondary as number;
    const d = inputs.distance as number;
    const ratio = m / (3 * M);
    const hillRadius = d * Math.pow(ratio, 1 / 3);
    const L1 = d - hillRadius;
    const L2 = d + hillRadius;
    const L3 = d * (1 + 5 * m / (12 * M));
    return {
      primary: { label: "L1 Distance from Primary", value: formatNumber(Math.round(L1)) + " km" },
      details: [
        { label: "L2 Distance from Primary", value: formatNumber(Math.round(L2)) + " km" },
        { label: "L3 Distance from Primary", value: formatNumber(Math.round(L3)) + " km" },
        { label: "Hill Sphere Radius", value: formatNumber(Math.round(hillRadius)) + " km" }
      ]
    };
  }`,
  [
    { q: "What are Lagrange points?", a: "Lagrange points are five positions in space where the gravitational pull of two large bodies and the centrifugal force balance, allowing a small object to remain relatively stationary with respect to the two larger bodies." },
    { q: "Which Lagrange point is the James Webb Space Telescope at?", a: "The James Webb Space Telescope orbits the Sun-Earth L2 point, about 1.5 million km from Earth on the side away from the Sun." },
    { q: "Are Lagrange points truly stable?", a: "Only L4 and L5 are naturally stable. L1, L2, and L3 are unstable and require station-keeping maneuvers to maintain a spacecraft in their vicinity." }
  ],
  `Hill Radius = d x (m / 3M)^(1/3)
L1 = d - Hill Radius
L2 = d + Hill Radius`,
  ["orbital-velocity-calculator", "roche-limit-calculator"]
);

add(
  "tidal-force-calculator",
  "Tidal Force Calculator",
  "Calculate the differential gravitational (tidal) force exerted by a massive body on a smaller object at a given distance.",
  "Science",
  "science",
  "A",
  ["tidal force", "differential gravity", "tidal acceleration", "tidal bulge"],
  [
    '{ name: "massPrimary", label: "Primary Body Mass (kg)", type: "number", min: 1e10, max: 1e35, defaultValue: 7.342e22 }',
    '{ name: "distance", label: "Distance Between Centers (m)", type: "number", min: 1000, max: 1e15, defaultValue: 384400000 }',
    '{ name: "objectSize", label: "Size of Affected Object (m)", type: "number", min: 0.1, max: 1e8, defaultValue: 12742000 }'
  ],
  `(inputs) => {
    const M = inputs.massPrimary as number;
    const d = inputs.distance as number;
    const r = inputs.objectSize as number;
    const G = 6.674e-11;
    const tidalAccel = 2 * G * M * r / (d * d * d);
    const tidalForcePerKg = tidalAccel;
    const tidalForce100kg = tidalAccel * 100;
    return {
      primary: { label: "Tidal Acceleration", value: formatNumber(tidalAccel) + " m/s2" },
      details: [
        { label: "Tidal Force per kg", value: formatNumber(tidalForcePerKg) + " N/kg" },
        { label: "Tidal Force on 100 kg", value: formatNumber(tidalForce100kg) + " N" },
        { label: "Distance", value: formatNumber(d / 1000) + " km" }
      ]
    };
  }`,
  [
    { q: "What causes tidal forces?", a: "Tidal forces arise from the difference in gravitational pull across the extent of an object. The near side of the object is pulled more strongly than the far side, creating a stretching effect." },
    { q: "How do tidal forces affect the Earth?", a: "The Moon and Sun exert tidal forces that cause ocean tides. They also slowly transfer angular momentum, causing the Moon to recede from Earth by about 3.8 cm per year." },
    { q: "Can tidal forces destroy objects?", a: "Yes. If a body ventures inside the Roche limit, tidal forces can exceed its self-gravity and tear it apart. This is how some comets are destroyed when they pass too close to planets." }
  ],
  `Tidal Acceleration = 2GM x r / d^3
where G = 6.674 x 10^-11, M = primary mass, r = object size, d = distance`,
  ["roche-limit-calculator", "orbital-velocity-calculator"]
);

add(
  "stellar-parallax-calculator",
  "Stellar Parallax Calculator",
  "Calculate the distance to a star using its observed parallax angle, converting between parallax in arcseconds, parsecs, and light years.",
  "Science",
  "science",
  "A",
  ["stellar parallax", "parallax angle", "star distance", "astrometry"],
  [
    '{ name: "parallaxArcsec", label: "Parallax Angle (arcseconds)", type: "number", min: 0.00001, max: 1, defaultValue: 0.01 }',
  ],
  `(inputs) => {
    const p = inputs.parallaxArcsec as number;
    const distanceParsecs = 1 / p;
    const distanceLY = distanceParsecs * 3.2616;
    const distanceKm = distanceParsecs * 3.086e13;
    const distanceAU = distanceParsecs * 206265;
    return {
      primary: { label: "Distance", value: formatNumber(Math.round(distanceParsecs * 100) / 100) + " parsecs" },
      details: [
        { label: "Distance in Light Years", value: formatNumber(Math.round(distanceLY * 100) / 100) + " ly" },
        { label: "Distance in AU", value: formatNumber(Math.round(distanceAU)) + " AU" },
        { label: "Parallax Angle", value: formatNumber(p) + " arcsec" }
      ]
    };
  }`,
  [
    { q: "What is stellar parallax?", a: "Stellar parallax is the apparent shift in position of a nearby star against the background of distant stars as Earth orbits the Sun. The shift is measured as an angle in arcseconds." },
    { q: "How is one parsec defined?", a: "A parsec is the distance at which a star would have a parallax angle of exactly one arcsecond, equivalent to about 3.26 light years or 206,265 astronomical units." },
    { q: "What are the limits of parallax measurements?", a: "Ground-based telescopes can measure parallax down to about 0.01 arcseconds. The Gaia spacecraft can measure parallax as small as 0.00001 arcseconds, allowing distance measurements up to tens of thousands of parsecs." }
  ],
  `Distance (parsecs) = 1 / Parallax (arcseconds)
Distance (ly) = Distance (pc) x 3.2616`,
  ["star-magnitude-calculator", "light-year-distance-calculator"]
);

add(
  "synodic-period-calculator",
  "Synodic Period Calculator",
  "Calculate the synodic period between two orbiting bodies, giving the time between successive alignments as seen from the reference body.",
  "Science",
  "science",
  "A",
  ["synodic period", "orbital alignment", "conjunction cycle", "planet opposition"],
  [
    '{ name: "periodInner", label: "Inner Orbit Period (days)", type: "number", min: 1, max: 100000, defaultValue: 365.25 }',
    '{ name: "periodOuter", label: "Outer Orbit Period (days)", type: "number", min: 1, max: 200000, defaultValue: 687 }'
  ],
  `(inputs) => {
    const pInner = inputs.periodInner as number;
    const pOuter = inputs.periodOuter as number;
    const inner = Math.min(pInner, pOuter);
    const outer = Math.max(pInner, pOuter);
    const synodic = 1 / Math.abs(1 / inner - 1 / outer);
    const synodicYears = synodic / 365.25;
    const freqPerYear = 365.25 / synodic;
    return {
      primary: { label: "Synodic Period", value: formatNumber(Math.round(synodic * 100) / 100) + " days" },
      details: [
        { label: "Synodic Period in Years", value: formatNumber(Math.round(synodicYears * 1000) / 1000) + " years" },
        { label: "Alignments per Year", value: formatNumber(Math.round(freqPerYear * 1000) / 1000) },
        { label: "Inner Period", value: formatNumber(inner) + " days" }
      ]
    };
  }`,
  [
    { q: "What is a synodic period?", a: "A synodic period is the time it takes for a planet to return to the same position relative to another body, typically as seen from Earth. For example, the synodic period of Mars is about 780 days between oppositions." },
    { q: "How does the synodic period differ from the sidereal period?", a: "The sidereal period is the true orbital period around the Sun. The synodic period accounts for the observer also moving, so it is the interval between repeated configurations like conjunctions or oppositions." },
    { q: "Why is the synodic period important?", a: "It determines how often planetary alignments, oppositions, and optimal launch windows occur. Mars launch windows repeat roughly every 26 months because of the Earth-Mars synodic period." }
  ],
  `1 / P_synodic = |1 / P_inner - 1 / P_outer|
P_synodic in years = P_synodic (days) / 365.25`,
  ["orbital-velocity-calculator", "lagrange-point-calculator"]
);

add(
  "hill-sphere-calculator",
  "Hill Sphere Calculator",
  "Calculate the Hill sphere radius of a body orbiting a more massive primary, defining the region where the body can gravitationally retain satellites.",
  "Science",
  "science",
  "A",
  ["hill sphere", "gravitational influence", "sphere of influence", "satellite retention"],
  [
    '{ name: "semiMajorAxis", label: "Semi-Major Axis (km)", type: "number", min: 1000, max: 1e12, defaultValue: 149597870 }',
    '{ name: "massBody", label: "Orbiting Body Mass (kg)", type: "number", min: 1e10, max: 1e30, defaultValue: 5.972e24 }',
    '{ name: "massPrimary", label: "Primary Body Mass (kg)", type: "number", min: 1e15, max: 1e35, defaultValue: 1.989e30 }',
    '{ name: "eccentricity", label: "Orbital Eccentricity", type: "number", min: 0, max: 0.99, defaultValue: 0.0167 }'
  ],
  `(inputs) => {
    const a = inputs.semiMajorAxis as number;
    const m = inputs.massBody as number;
    const M = inputs.massPrimary as number;
    const e = inputs.eccentricity as number;
    const hillRadius = a * (1 - e) * Math.pow(m / (3 * M), 1 / 3);
    const hillRadiusAU = hillRadius / 149597870.7;
    const hillRadiusBodyRadii = hillRadius / 6371;
    return {
      primary: { label: "Hill Sphere Radius", value: formatNumber(Math.round(hillRadius)) + " km" },
      details: [
        { label: "Hill Sphere in AU", value: formatNumber(Math.round(hillRadiusAU * 10000) / 10000) + " AU" },
        { label: "In Earth Radii", value: formatNumber(Math.round(hillRadiusBodyRadii * 10) / 10) },
        { label: "Orbital Eccentricity", value: formatNumber(e) }
      ]
    };
  }`,
  [
    { q: "What is the Hill sphere?", a: "The Hill sphere is the region around a body where its gravity dominates over the gravitational influence of the larger body it orbits. Moons must orbit within the Hill sphere of their planet to remain captured." },
    { q: "How large is the Hill sphere of Earth?", a: "The Hill sphere of Earth extends about 1.5 million km from Earth, roughly four times the Earth-Moon distance. The Moon orbits well within this boundary." },
    { q: "Can objects orbit at the edge of the Hill sphere?", a: "In practice, stable orbits require being well inside the Hill sphere. Orbits beyond roughly one-third to one-half of the Hill sphere radius tend to be unstable due to perturbations from the primary body." }
  ],
  `Hill Radius = a x (1 - e) x (m / 3M)^(1/3)
where a = semi-major axis, e = eccentricity, m = body mass, M = primary mass`,
  ["lagrange-point-calculator", "roche-limit-calculator"]
);

add(
  "jeans-mass-calculator",
  "Jeans Mass Calculator",
  "Calculate the minimum mass a gas cloud must have to undergo gravitational collapse and form a star, based on temperature and density.",
  "Science",
  "science",
  "A",
  ["jeans mass", "gravitational collapse", "star formation", "molecular cloud"],
  [
    '{ name: "temperature", label: "Gas Temperature (K)", type: "number", min: 1, max: 100000, defaultValue: 10 }',
    '{ name: "density", label: "Gas Density (kg/m3)", type: "number", min: 1e-25, max: 1e-10, defaultValue: 1e-18 }',
    '{ name: "meanMolWeight", label: "Mean Molecular Weight (amu)", type: "number", min: 1, max: 10, defaultValue: 2.33 }'
  ],
  `(inputs) => {
    const T = inputs.temperature as number;
    const rho = inputs.density as number;
    const mu = inputs.meanMolWeight as number;
    const kB = 1.381e-23;
    const G = 6.674e-11;
    const mH = 1.673e-27;
    const cs = Math.sqrt(kB * T / (mu * mH));
    const jeansLength = cs * Math.sqrt(Math.PI / (G * rho));
    const jeansMass = (Math.PI / 6) * rho * Math.pow(jeansLength, 3);
    const solarMasses = jeansMass / 1.989e30;
    return {
      primary: { label: "Jeans Mass", value: formatNumber(Math.round(solarMasses * 100) / 100) + " solar masses" },
      details: [
        { label: "Jeans Mass (kg)", value: formatNumber(jeansMass) + " kg" },
        { label: "Jeans Length", value: formatNumber(jeansLength / 3.086e16) + " pc" },
        { label: "Sound Speed", value: formatNumber(Math.round(cs)) + " m/s" }
      ]
    };
  }`,
  [
    { q: "What is the Jeans mass?", a: "The Jeans mass is the minimum mass a cloud of gas must have so that its gravitational self-attraction overcomes the internal pressure trying to expand it. Clouds exceeding this mass can collapse to form stars." },
    { q: "What determines the Jeans mass?", a: "The Jeans mass depends on temperature, density, and composition of the gas. Colder, denser clouds have a lower Jeans mass and can collapse more easily." },
    { q: "How does this relate to star formation?", a: "Molecular clouds in galaxies are much more massive than the Jeans mass and fragment into smaller clumps during collapse. Each fragment can form an individual star or a small stellar system." }
  ],
  `Jeans Length = cs x sqrt(pi / (G x rho))
Jeans Mass = (pi / 6) x rho x Jeans_Length^3
cs = sqrt(kB x T / (mu x mH))`,
  ["stellar-parallax-calculator", "star-magnitude-calculator"]
);

add(
  "bolometric-magnitude-calculator",
  "Bolometric Magnitude Calculator",
  "Calculate the bolometric magnitude of a star from its visual magnitude and bolometric correction, giving total luminosity across all wavelengths.",
  "Science",
  "science",
  "A",
  ["bolometric magnitude", "bolometric correction", "total luminosity", "stellar brightness"],
  [
    '{ name: "visualMag", label: "Visual Magnitude", type: "number", min: -30, max: 30, defaultValue: 4.83 }',
    '{ name: "bolCorrection", label: "Bolometric Correction", type: "number", min: -10, max: 0, defaultValue: -0.07 }',
    '{ name: "distancePc", label: "Distance (parsecs)", type: "number", min: 0.001, max: 1000000, defaultValue: 10 }'
  ],
  `(inputs) => {
    const mv = inputs.visualMag as number;
    const bc = inputs.bolCorrection as number;
    const d = inputs.distancePc as number;
    const mBol = mv + bc;
    const MBol = mBol - 5 * Math.log10(d / 10);
    const luminosityRatio = Math.pow(10, (4.74 - MBol) / 2.5);
    return {
      primary: { label: "Bolometric Magnitude (apparent)", value: formatNumber(Math.round(mBol * 1000) / 1000) },
      details: [
        { label: "Absolute Bolometric Magnitude", value: formatNumber(Math.round(MBol * 1000) / 1000) },
        { label: "Luminosity (solar units)", value: formatNumber(Math.round(luminosityRatio * 100) / 100) + " L_sun" },
        { label: "Bolometric Correction", value: formatNumber(bc) }
      ]
    };
  }`,
  [
    { q: "What is bolometric magnitude?", a: "Bolometric magnitude measures the total energy output of a star across all wavelengths of light, not just the visible portion. It gives a more complete picture of a star total luminosity." },
    { q: "What is the bolometric correction?", a: "The bolometric correction is the difference between visual magnitude and bolometric magnitude. It accounts for light emitted outside the visible spectrum, such as ultraviolet and infrared radiation." },
    { q: "Why is the bolometric correction always negative or zero?", a: "By convention, the bolometric correction is defined so that bolometric magnitude is always brighter (lower number) than visual magnitude, since total flux across all wavelengths cannot be less than just the visible flux." }
  ],
  `m_bol = m_v + BC
M_bol = m_bol - 5 x log10(d / 10)
L / L_sun = 10^((4.74 - M_bol) / 2.5)`,
  ["star-magnitude-calculator", "stellar-parallax-calculator"]
);

add(
  "hohmann-transfer-calculator",
  "Hohmann Transfer Orbit Calculator",
  "Calculate the delta-v requirements and transfer time for a Hohmann transfer orbit between two circular orbits around the same central body.",
  "Science",
  "science",
  "A",
  ["hohmann transfer", "orbital maneuver", "delta-v budget", "orbit transfer"],
  [
    '{ name: "innerRadius", label: "Inner Orbit Radius (km)", type: "number", min: 100, max: 1e9, defaultValue: 6771 }',
    '{ name: "outerRadius", label: "Outer Orbit Radius (km)", type: "number", min: 200, max: 1e9, defaultValue: 42164 }',
    '{ name: "centralMass", label: "Central Body Mass (kg)", type: "number", min: 1e15, max: 1e35, defaultValue: 5.972e24 }'
  ],
  `(inputs) => {
    const r1 = inputs.innerRadius as number * 1000;
    const r2 = inputs.outerRadius as number * 1000;
    const M = inputs.centralMass as number;
    const G = 6.674e-11;
    const mu = G * M;
    const v1 = Math.sqrt(mu / r1);
    const v2 = Math.sqrt(mu / r2);
    const aTransfer = (r1 + r2) / 2;
    const vPeri = Math.sqrt(mu * (2 / r1 - 1 / aTransfer));
    const vApo = Math.sqrt(mu * (2 / r2 - 1 / aTransfer));
    const dv1 = Math.abs(vPeri - v1);
    const dv2 = Math.abs(v2 - vApo);
    const totalDv = dv1 + dv2;
    const transferTime = Math.PI * Math.sqrt(Math.pow(aTransfer, 3) / mu);
    const transferHours = transferTime / 3600;
    return {
      primary: { label: "Total Delta-V", value: formatNumber(Math.round(totalDv * 10) / 10) + " m/s" },
      details: [
        { label: "First Burn Delta-V", value: formatNumber(Math.round(dv1 * 10) / 10) + " m/s" },
        { label: "Second Burn Delta-V", value: formatNumber(Math.round(dv2 * 10) / 10) + " m/s" },
        { label: "Transfer Time", value: formatNumber(Math.round(transferHours * 100) / 100) + " hours" }
      ]
    };
  }`,
  [
    { q: "What is a Hohmann transfer orbit?", a: "A Hohmann transfer is the most fuel-efficient two-burn orbital maneuver to move between two circular orbits. It uses an elliptical transfer orbit that is tangent to both the initial and final circular orbits." },
    { q: "When is a Hohmann transfer not optimal?", a: "For very large orbit changes where the ratio of outer to inner radius exceeds about 11.94, a bi-elliptic transfer can be more efficient. For time-critical missions, higher-energy transfers are used despite greater fuel cost." },
    { q: "How long does a Hohmann transfer to geostationary orbit take?", a: "A Hohmann transfer from low Earth orbit at 400 km altitude to geostationary orbit at 35,786 km takes about 5.25 hours for the half-orbit coast phase." }
  ],
  `Delta-V1 = sqrt(mu(2/r1 - 1/a)) - sqrt(mu/r1)
Delta-V2 = sqrt(mu/r2) - sqrt(mu(2/r2 - 1/a))
Transfer Time = pi x sqrt(a^3 / mu), where a = (r1 + r2) / 2`,
  ["orbital-velocity-calculator", "lagrange-point-calculator"]
);

add(
  "gravitational-lensing-calculator",
  "Gravitational Lensing Calculator",
  "Calculate the Einstein ring radius and deflection angle for gravitational lensing caused by a massive foreground object bending light from a distant source.",
  "Science",
  "science",
  "A",
  ["gravitational lensing", "einstein ring", "light bending", "gravitational deflection"],
  [
    '{ name: "lensMass", label: "Lens Mass (solar masses)", type: "number", min: 0.01, max: 1e15, defaultValue: 1e12 }',
    '{ name: "lensDistance", label: "Distance to Lens (Mpc)", type: "number", min: 0.001, max: 10000, defaultValue: 500 }',
    '{ name: "sourceDistance", label: "Distance to Source (Mpc)", type: "number", min: 0.001, max: 20000, defaultValue: 1500 }'
  ],
  `(inputs) => {
    const Msun = inputs.lensMass as number;
    const Dl = inputs.lensDistance as number;
    const Ds = inputs.sourceDistance as number;
    const Dls = Ds - Dl;
    if (Dls <= 0) {
      return { primary: { label: "Error", value: "Source must be farther than lens" } };
    }
    const G = 6.674e-11;
    const c = 3e8;
    const Mkg = Msun * 1.989e30;
    const DlM = Dl * 3.086e22;
    const DsM = Ds * 3.086e22;
    const DlsM = Dls * 3.086e22;
    const thetaE = Math.sqrt(4 * G * Mkg * DlsM / (c * c * DlM * DsM));
    const thetaArcsec = thetaE * 206265;
    const schwarzschild = 2 * G * Mkg / (c * c);
    const deflectionAngle = 4 * G * Mkg / (c * c * DlM * thetaE);
    const deflArcsec = deflectionAngle * 206265;
    return {
      primary: { label: "Einstein Ring Radius", value: formatNumber(Math.round(thetaArcsec * 10000) / 10000) + " arcsec" },
      details: [
        { label: "Deflection Angle", value: formatNumber(Math.round(deflArcsec * 10000) / 10000) + " arcsec" },
        { label: "Schwarzschild Radius of Lens", value: formatNumber(schwarzschild / 1000) + " km" },
        { label: "Lens-Source Separation", value: formatNumber(Dls) + " Mpc" }
      ]
    };
  }`,
  [
    { q: "What is gravitational lensing?", a: "Gravitational lensing occurs when the gravity of a massive foreground object bends and magnifies light from a more distant background source, as predicted by general relativity." },
    { q: "What is an Einstein ring?", a: "An Einstein ring appears when the source, lens, and observer are perfectly aligned. The light from the source is bent equally in all directions around the lens, forming a complete ring." },
    { q: "What can gravitational lensing reveal?", a: "Gravitational lensing is used to measure the mass of galaxy clusters, detect dark matter, discover distant galaxies, and even find exoplanets through microlensing events." }
  ],
  `Einstein Ring Radius = sqrt(4GM x Dls / (c^2 x Dl x Ds))
Deflection Angle = 4GM / (c^2 x b)`,
  ["star-magnitude-calculator", "roche-limit-calculator"]
);

add(
  "cosmic-redshift-distance-calculator",
  "Cosmic Redshift Distance Calculator",
  "Estimate the comoving distance, lookback time, and recession velocity of a distant object from its observed cosmological redshift.",
  "Science",
  "science",
  "A",
  ["cosmological redshift", "comoving distance", "lookback time", "recession velocity"],
  [
    '{ name: "redshift", label: "Observed Redshift (z)", type: "number", min: 0.001, max: 20, defaultValue: 1 }',
    '{ name: "hubbleConstant", label: "Hubble Constant (km/s/Mpc)", type: "number", min: 50, max: 100, defaultValue: 70 }'
  ],
  `(inputs) => {
    const z = inputs.redshift as number;
    const H0 = inputs.hubbleConstant as number;
    const c = 299792.458;
    const dH = c / H0;
    const comovingApprox = dH * (z + z * z / (2 * (1 + z)));
    const lookbackFraction = 1 - 1 / Math.sqrt(1 + z);
    const hubbleTimeSec = 1 / (H0 / 3.086e19);
    const hubbleTimeGyr = hubbleTimeSec / (365.25 * 24 * 3600 * 1e9);
    const lookbackTime = lookbackFraction * hubbleTimeGyr * 2;
    const recessionVelocity = H0 * comovingApprox;
    return {
      primary: { label: "Comoving Distance", value: formatNumber(Math.round(comovingApprox)) + " Mpc" },
      details: [
        { label: "Lookback Time", value: formatNumber(Math.round(lookbackTime * 100) / 100) + " Gyr" },
        { label: "Recession Velocity", value: formatNumber(Math.round(recessionVelocity)) + " km/s" },
        { label: "Redshift (z)", value: formatNumber(z) }
      ]
    };
  }`,
  [
    { q: "What does cosmological redshift mean?", a: "Cosmological redshift is the stretching of light wavelengths caused by the expansion of the universe. A higher redshift means the light has traveled through more expanding space and the object is farther away." },
    { q: "Can recession velocity exceed the speed of light?", a: "Yes. Hubble law velocity can exceed the speed of light for very distant objects because it measures the rate of expansion of space itself, not the motion of objects through space. This does not violate relativity." },
    { q: "What is the highest redshift ever observed?", a: "Galaxies have been observed at redshifts above z = 13, corresponding to when the universe was only a few hundred million years old. The cosmic microwave background has a redshift of about z = 1100." }
  ],
  `Comoving Distance (approx) = c/H0 x (z + z^2 / (2(1+z)))
Recession Velocity = H0 x Comoving Distance
Lookback Time = f(z) x Hubble Time`,
  ["light-year-distance-calculator", "stellar-parallax-calculator"]
);

add(
  "airy-disk-calculator",
  "Airy Disk Calculator",
  "Calculate the angular resolution and Airy disk radius for a circular aperture, determining the diffraction limit of a telescope or camera lens.",
  "Science",
  "science",
  "A",
  ["airy disk", "diffraction limit", "angular resolution", "telescope resolving power"],
  [
    '{ name: "aperture", label: "Aperture Diameter (mm)", type: "number", min: 1, max: 20000, defaultValue: 200 }',
    '{ name: "wavelength", label: "Wavelength of Light (nm)", type: "number", min: 100, max: 10000, defaultValue: 550 }',
    '{ name: "focalLength", label: "Focal Length (mm)", type: "number", min: 10, max: 100000, defaultValue: 2000 }'
  ],
  `(inputs) => {
    const D = inputs.aperture as number / 1000;
    const lambda = inputs.wavelength as number * 1e-9;
    const focalLength = inputs.focalLength as number / 1000;
    const angularRes = 1.22 * lambda / D;
    const angularResArcsec = angularRes * 206265;
    const airyRadius = 1.22 * lambda * focalLength / D;
    const airyRadiusMicrons = airyRadius * 1e6;
    const dawesLimit = 116 / (inputs.aperture as number);
    return {
      primary: { label: "Angular Resolution", value: formatNumber(Math.round(angularResArcsec * 1000) / 1000) + " arcsec" },
      details: [
        { label: "Airy Disk Radius", value: formatNumber(Math.round(airyRadiusMicrons * 100) / 100) + " microns" },
        { label: "Dawes Limit", value: formatNumber(Math.round(dawesLimit * 100) / 100) + " arcsec" },
        { label: "f-ratio", value: "f/" + formatNumber(Math.round(focalLength / D * 10) / 10) }
      ]
    };
  }`,
  [
    { q: "What is the Airy disk?", a: "The Airy disk is the central bright spot in the diffraction pattern produced by a circular aperture. It represents the smallest point to which a perfect optical system can focus light." },
    { q: "What is the Dawes limit?", a: "The Dawes limit is an empirical formula for the angular resolution of a telescope: 116 divided by the aperture in millimeters, giving the result in arcseconds. It is slightly more optimistic than the Rayleigh criterion." },
    { q: "How does aperture affect resolution?", a: "Larger apertures produce smaller Airy disks and better angular resolution. Doubling the aperture diameter halves the minimum resolvable angle, allowing you to see finer details." }
  ],
  `Angular Resolution = 1.22 x lambda / D (radians)
Airy Disk Radius = 1.22 x lambda x f / D
Dawes Limit = 116 / D(mm) arcseconds`,
  ["telescope-magnification-calculator", "telescope-fov-calculator"]
);

add(
  "schwarzschild-radius-advanced-calculator",
  "Black Hole Properties Calculator",
  "Calculate key properties of a non-rotating black hole including Schwarzschild radius, event horizon area, Hawking temperature, and evaporation time.",
  "Science",
  "science",
  "A",
  ["black hole", "schwarzschild radius", "hawking radiation", "event horizon"],
  [
    '{ name: "mass", label: "Black Hole Mass (solar masses)", type: "number", min: 0.0001, max: 1e15, defaultValue: 10 }'
  ],
  `(inputs) => {
    const Msun = inputs.mass as number;
    const M = Msun * 1.989e30;
    const G = 6.674e-11;
    const c = 3e8;
    const hbar = 1.055e-34;
    const kB = 1.381e-23;
    const Rs = 2 * G * M / (c * c);
    const area = 4 * Math.PI * Rs * Rs;
    const hawkingTemp = hbar * c * c * c / (8 * Math.PI * G * M * kB);
    const evapTime = 5120 * Math.PI * G * G * M * M * M / (hbar * c * c * c * c);
    const evapYears = evapTime / (365.25 * 24 * 3600);
    return {
      primary: { label: "Schwarzschild Radius", value: formatNumber(Math.round(Rs * 1000) / 1000) + " m" },
      details: [
        { label: "Event Horizon Area", value: formatNumber(area) + " m2" },
        { label: "Hawking Temperature", value: formatNumber(hawkingTemp) + " K" },
        { label: "Evaporation Time", value: formatNumber(evapYears) + " years" }
      ]
    };
  }`,
  [
    { q: "What is the Schwarzschild radius?", a: "The Schwarzschild radius is the radius of the event horizon of a non-rotating black hole. Any object compressed within its Schwarzschild radius becomes a black hole from which nothing can escape." },
    { q: "What is Hawking radiation?", a: "Hawking radiation is the theoretical thermal radiation emitted by black holes due to quantum effects near the event horizon. It causes black holes to slowly lose mass and eventually evaporate." },
    { q: "How long would a solar-mass black hole take to evaporate?", a: "A black hole of one solar mass would take approximately 2 x 10^67 years to evaporate through Hawking radiation, vastly longer than the current age of the universe." }
  ],
  `Rs = 2GM / c^2
Hawking Temperature = hbar x c^3 / (8 x pi x G x M x kB)
Evaporation Time = 5120 x pi x G^2 x M^3 / (hbar x c^4)`,
  ["roche-limit-calculator", "gravitational-lensing-calculator"]
);

add(
  "spectral-class-temperature-calculator",
  "Spectral Class Temperature Calculator",
  "Estimate the surface temperature, color, and luminosity class of a star based on its spectral classification or convert a known temperature to spectral type.",
  "Science",
  "science",
  "A",
  ["spectral class", "stellar temperature", "star color", "hertzsprung-russell"],
  [
    '{ name: "spectralType", label: "Spectral Type", type: "select", options: [{ value: "1", label: "O - Blue" }, { value: "2", label: "B - Blue-White" }, { value: "3", label: "A - White" }, { value: "4", label: "F - Yellow-White" }, { value: "5", label: "G - Yellow (Sun)" }, { value: "6", label: "K - Orange" }, { value: "7", label: "M - Red" }], defaultValue: "5" }',
    '{ name: "subclass", label: "Subclass (0-9)", type: "number", min: 0, max: 9, defaultValue: 2 }'
  ],
  `(inputs) => {
    const sType = parseInt(inputs.spectralType as string);
    const sub = inputs.subclass as number;
    const tempRanges = { 1: [30000, 50000], 2: [10000, 30000], 3: [7500, 10000], 4: [6000, 7500], 5: [5200, 6000], 6: [3700, 5200], 7: [2400, 3700] };
    const names = { 1: "O", 2: "B", 3: "A", 4: "F", 5: "G", 6: "K", 7: "M" };
    const colors = { 1: "Blue", 2: "Blue-White", 3: "White", 4: "Yellow-White", 5: "Yellow", 6: "Orange", 7: "Red" };
    const range = tempRanges[sType] || [5200, 6000];
    const temp = Math.round(range[1] - (sub / 10) * (range[1] - range[0]));
    const peakWavelength = Math.round(2897771 / temp);
    const luminosityRatio = Math.pow(temp / 5778, 4);
    const spectralName = (names[sType] || "G") + sub;
    return {
      primary: { label: "Surface Temperature", value: formatNumber(temp) + " K" },
      details: [
        { label: "Spectral Type", value: spectralName },
        { label: "Star Color", value: colors[sType] || "Yellow" },
        { label: "Peak Wavelength", value: formatNumber(peakWavelength) + " nm" }
      ]
    };
  }`,
  [
    { q: "What are stellar spectral classes?", a: "Stars are classified by spectral type using the sequence O, B, A, F, G, K, M from hottest to coolest. Each type is subdivided into subclasses 0-9, with 0 being the hottest within each class." },
    { q: "What spectral class is the Sun?", a: "The Sun is a G2V star with a surface temperature of about 5,778 K. The G means it is a yellow main-sequence star and the V indicates it is on the main sequence." },
    { q: "How does spectral class relate to luminosity?", a: "Hotter spectral classes are generally more luminous. An O-type star can be millions of times more luminous than the Sun, while an M-type red dwarf may be less than one-thousandth as luminous." }
  ],
  `Temperature = interpolation within spectral class range
Peak Wavelength = 2,897,771 / Temperature (Wien law)`,
  ["star-magnitude-calculator", "bolometric-magnitude-calculator"]
);

add(
  "binary-star-mass-calculator",
  "Binary Star Mass Calculator",
  "Calculate the total and individual masses of a binary star system from the orbital period and separation using Kepler third law.",
  "Science",
  "science",
  "A",
  ["binary star", "double star", "stellar mass", "binary orbit"],
  [
    '{ name: "orbitalPeriod", label: "Orbital Period (years)", type: "number", min: 0.001, max: 10000, defaultValue: 50 }',
    '{ name: "separation", label: "Semi-Major Axis (AU)", type: "number", min: 0.01, max: 100000, defaultValue: 20 }',
    '{ name: "massRatio", label: "Mass Ratio (M2/M1)", type: "number", min: 0.01, max: 1, defaultValue: 0.5 }'
  ],
  `(inputs) => {
    const P = inputs.orbitalPeriod as number;
    const a = inputs.separation as number;
    const q = inputs.massRatio as number;
    const totalMass = Math.pow(a, 3) / Math.pow(P, 2);
    const m1 = totalMass / (1 + q);
    const m2 = totalMass * q / (1 + q);
    const barycenter = a * q / (1 + q);
    return {
      primary: { label: "Total System Mass", value: formatNumber(Math.round(totalMass * 1000) / 1000) + " solar masses" },
      details: [
        { label: "Primary Star Mass", value: formatNumber(Math.round(m1 * 1000) / 1000) + " solar masses" },
        { label: "Secondary Star Mass", value: formatNumber(Math.round(m2 * 1000) / 1000) + " solar masses" },
        { label: "Barycenter from Primary", value: formatNumber(Math.round(barycenter * 1000) / 1000) + " AU" }
      ]
    };
  }`,
  [
    { q: "How do we measure binary star masses?", a: "For visual binaries with known orbital period and separation, Kepler third law gives the total mass. Radial velocity measurements and the mass ratio allow determination of individual masses." },
    { q: "What fraction of stars are in binary systems?", a: "Roughly half of all Sun-like stars exist in binary or multiple star systems. The fraction is higher for more massive stars and lower for red dwarfs." },
    { q: "What is the mass ratio?", a: "The mass ratio q is the mass of the secondary (less massive) star divided by the mass of the primary. It ranges from 0 to 1, with 1 meaning both stars have equal mass." }
  ],
  `Total Mass (solar) = a^3 / P^2 (Kepler third law in solar units)
M1 = Total / (1 + q), M2 = Total x q / (1 + q)`,
  ["star-magnitude-calculator", "spectral-class-temperature-calculator"]
);

add(
  "exoplanet-transit-depth-calculator",
  "Exoplanet Transit Depth Calculator",
  "Calculate the expected transit depth, duration, and probability for an exoplanet transiting its host star based on planetary and stellar radii and orbital distance.",
  "Science",
  "science",
  "A",
  ["exoplanet transit", "transit depth", "transit method", "planet detection"],
  [
    '{ name: "planetRadius", label: "Planet Radius (Earth radii)", type: "number", min: 0.1, max: 50, defaultValue: 1 }',
    '{ name: "starRadius", label: "Star Radius (solar radii)", type: "number", min: 0.1, max: 100, defaultValue: 1 }',
    '{ name: "orbitalDistance", label: "Orbital Distance (AU)", type: "number", min: 0.01, max: 100, defaultValue: 1 }',
    '{ name: "orbitalPeriod", label: "Orbital Period (days)", type: "number", min: 0.1, max: 100000, defaultValue: 365 }'
  ],
  `(inputs) => {
    const Rp = inputs.planetRadius as number * 6371;
    const Rs = inputs.starRadius as number * 696340;
    const a = inputs.orbitalDistance as number * 1.496e8;
    const P = inputs.orbitalPeriod as number;
    const transitDepth = Math.pow(Rp / Rs, 2) * 100;
    const transitDuration = P / Math.PI * (Rs / a) * 24;
    const transitProb = Rs / a * 100;
    return {
      primary: { label: "Transit Depth", value: formatNumber(Math.round(transitDepth * 10000) / 10000) + "%" },
      details: [
        { label: "Transit Duration", value: formatNumber(Math.round(transitDuration * 100) / 100) + " hours" },
        { label: "Transit Probability", value: formatNumber(Math.round(transitProb * 100) / 100) + "%" },
        { label: "Planet/Star Radius Ratio", value: formatNumber(Math.round(Rp / Rs * 10000) / 10000) }
      ]
    };
  }`,
  [
    { q: "What is transit depth?", a: "Transit depth is the fractional decrease in observed starlight when a planet passes in front of its host star. It equals the square of the ratio of the planet radius to the star radius." },
    { q: "How much does Earth dim the Sun during transit?", a: "Earth would cause a transit depth of about 0.0084 percent, dimming the Sun by 84 parts per million. This is detectable by space telescopes like Kepler and TESS but very challenging from the ground." },
    { q: "What determines the transit probability?", a: "The geometric transit probability is approximately the ratio of the star radius to the orbital distance. For Earth-like planets around Sun-like stars, the probability is only about 0.47 percent." }
  ],
  `Transit Depth = (Rp / Rs)^2
Transit Duration = (P / pi) x (Rs / a)
Transit Probability = Rs / a`,
  ["stellar-parallax-calculator", "binary-star-mass-calculator"]
);

add(
  "space-travel-time-calculator",
  "Space Travel Time Calculator",
  "Estimate travel time to destinations in the solar system and beyond at various speeds, from conventional rockets to hypothetical fraction-of-light-speed propulsion.",
  "Science",
  "science",
  "A",
  ["space travel time", "interstellar travel", "space mission duration", "light speed travel"],
  [
    '{ name: "distance", label: "Distance (AU)", type: "number", min: 0.001, max: 300000, defaultValue: 1 }',
    '{ name: "speed", label: "Travel Speed (km/s)", type: "number", min: 1, max: 299792, defaultValue: 30 }'
  ],
  `(inputs) => {
    const distAU = inputs.distance as number;
    const speed = inputs.speed as number;
    const distKm = distAU * 1.496e8;
    const timeSec = distKm / speed;
    const timeHours = timeSec / 3600;
    const timeDays = timeHours / 24;
    const timeYears = timeDays / 365.25;
    const fractionC = speed / 299792.458;
    var display = "";
    if (timeYears > 1) { display = formatNumber(Math.round(timeYears * 100) / 100) + " years"; }
    else if (timeDays > 1) { display = formatNumber(Math.round(timeDays * 100) / 100) + " days"; }
    else { display = formatNumber(Math.round(timeHours * 100) / 100) + " hours"; }
    return {
      primary: { label: "Travel Time", value: display },
      details: [
        { label: "Distance", value: formatNumber(Math.round(distKm)) + " km" },
        { label: "Speed as Fraction of c", value: formatNumber(Math.round(fractionC * 100000) / 100000) + " c" },
        { label: "Travel Time (days)", value: formatNumber(Math.round(timeDays * 100) / 100) + " days" }
      ]
    };
  }`,
  [
    { q: "How long would it take to reach Mars?", a: "At typical interplanetary transfer speeds of around 30 km/s, Mars at closest approach (about 0.37 AU) would take roughly 7 months via a Hohmann transfer orbit." },
    { q: "Could we reach another star in a human lifetime?", a: "Alpha Centauri is about 4.37 light years away. At 10 percent of light speed, the trip would take about 44 years. Current spacecraft travel far slower, making interstellar travel impractical with existing technology." },
    { q: "What is the fastest spacecraft ever launched?", a: "The Parker Solar Probe reached speeds exceeding 190 km/s relative to the Sun. At that speed, reaching Alpha Centauri would still take over 6,000 years." }
  ],
  `Travel Time = Distance / Speed
Distance (km) = Distance (AU) x 1.496 x 10^8
Fraction of c = Speed / 299,792.458`,
  ["hohmann-transfer-calculator", "orbital-velocity-calculator"]
);

add(
  "atmospheric-scale-height-calculator",
  "Atmospheric Scale Height Calculator",
  "Calculate how atmospheric pressure decreases with altitude using the barometric formula and scale height for any planetary atmosphere.",
  "Science",
  "science",
  "A",
  ["scale height", "atmospheric pressure altitude", "barometric formula", "atmospheric density"],
  [
    '{ name: "altitude", label: "Altitude (km)", type: "number", min: 0, max: 500, defaultValue: 10 }',
    '{ name: "surfacePressure", label: "Surface Pressure (atm)", type: "number", min: 0.001, max: 1000, defaultValue: 1 }',
    '{ name: "surfaceTemp", label: "Surface Temperature (K)", type: "number", min: 50, max: 2000, defaultValue: 288 }',
    '{ name: "meanMolWeight", label: "Mean Molecular Weight (g/mol)", type: "number", min: 1, max: 100, defaultValue: 28.97 }',
    '{ name: "surfaceGravity", label: "Surface Gravity (m/s2)", type: "number", min: 0.1, max: 100, defaultValue: 9.81 }'
  ],
  `(inputs) => {
    const h = inputs.altitude as number * 1000;
    const P0 = inputs.surfacePressure as number;
    const T = inputs.surfaceTemp as number;
    const M = inputs.meanMolWeight as number / 1000;
    const g = inputs.surfaceGravity as number;
    const R = 8.314;
    const H = R * T / (M * g);
    const pressure = P0 * Math.exp(-h / H);
    const densityRatio = Math.exp(-h / H);
    return {
      primary: { label: "Pressure at Altitude", value: formatNumber(Math.round(pressure * 100000) / 100000) + " atm" },
      details: [
        { label: "Scale Height", value: formatNumber(Math.round(H / 100) / 10) + " km" },
        { label: "Density Ratio", value: formatNumber(Math.round(densityRatio * 100000) / 100000) },
        { label: "Pressure (Pa)", value: formatNumber(Math.round(pressure * 101325 * 100) / 100) + " Pa" }
      ]
    };
  }`,
  [
    { q: "What is atmospheric scale height?", a: "The scale height is the altitude increase needed for atmospheric pressure to decrease by a factor of e (about 2.718). For Earth, the scale height is approximately 8.5 km." },
    { q: "How does pressure change with altitude on Earth?", a: "At sea level pressure of 1 atm, pressure drops to about 0.37 atm at one scale height (8.5 km), 0.14 atm at two scale heights, and so on exponentially." },
    { q: "Do other planets have different scale heights?", a: "Yes. Mars has a scale height of about 11 km despite lower gravity because of its thin CO2 atmosphere. Venus has a scale height of about 15 km. Jupiter has about 27 km." }
  ],
  `Scale Height H = RT / (Mg)
Pressure = P0 x exp(-h / H)
where R = 8.314 J/(mol K), M = molar mass, g = gravity`,
  ["orbital-velocity-calculator", "planetary-weight-calculator"]
);

add(
  "solar-luminosity-calculator",
  "Solar Panel in Space Calculator",
  "Calculate the solar radiation intensity and power output of a solar panel at any distance from the Sun, accounting for the inverse square law.",
  "Science",
  "science",
  "A",
  ["solar intensity", "inverse square law", "solar constant", "space solar power"],
  [
    '{ name: "distanceAU", label: "Distance from Sun (AU)", type: "number", min: 0.1, max: 100, defaultValue: 1 }',
    '{ name: "panelArea", label: "Solar Panel Area (m2)", type: "number", min: 0.01, max: 1000, defaultValue: 10 }',
    '{ name: "efficiency", label: "Panel Efficiency (%)", type: "number", min: 1, max: 50, defaultValue: 20 }'
  ],
  `(inputs) => {
    const d = inputs.distanceAU as number;
    const area = inputs.panelArea as number;
    const eff = inputs.efficiency as number / 100;
    const solarConstant = 1361;
    const intensity = solarConstant / (d * d);
    const powerTotal = intensity * area;
    const powerElectric = powerTotal * eff;
    return {
      primary: { label: "Solar Intensity", value: formatNumber(Math.round(intensity * 100) / 100) + " W/m2" },
      details: [
        { label: "Total Solar Power on Panel", value: formatNumber(Math.round(powerTotal * 100) / 100) + " W" },
        { label: "Electrical Output", value: formatNumber(Math.round(powerElectric * 100) / 100) + " W" },
        { label: "Intensity vs Earth", value: formatNumber(Math.round(1 / (d * d) * 10000) / 100) + "%" }
      ]
    };
  }`,
  [
    { q: "What is the solar constant?", a: "The solar constant is approximately 1,361 W/m2, the average solar radiation intensity at Earth distance (1 AU) from the Sun." },
    { q: "How does solar intensity change with distance?", a: "Solar intensity follows the inverse square law. At 2 AU, intensity is only one-quarter of what it is at 1 AU. At Jupiter (5.2 AU), it is only about 3.7 percent of Earth levels." },
    { q: "Can solar panels work in the outer solar system?", a: "Solar panels become impractical beyond Jupiter due to low light levels. The Juno spacecraft at Jupiter uses very large panels, while missions to Saturn and beyond typically rely on nuclear power sources." }
  ],
  `Solar Intensity = 1361 / d^2 (W/m2)
Power = Intensity x Panel Area x Efficiency`,
  ["space-travel-time-calculator", "hohmann-transfer-calculator"]
);

add(
  "gravitational-wave-strain-calculator",
  "Gravitational Wave Strain Calculator",
  "Estimate the gravitational wave strain amplitude from a binary system based on masses, orbital frequency, and distance to the source.",
  "Science",
  "science",
  "A",
  ["gravitational wave", "strain amplitude", "LIGO", "binary merger"],
  [
    '{ name: "mass1", label: "Mass 1 (solar masses)", type: "number", min: 0.1, max: 1000, defaultValue: 30 }',
    '{ name: "mass2", label: "Mass 2 (solar masses)", type: "number", min: 0.1, max: 1000, defaultValue: 30 }',
    '{ name: "frequency", label: "GW Frequency (Hz)", type: "number", min: 0.001, max: 10000, defaultValue: 100 }',
    '{ name: "distanceMpc", label: "Distance (Mpc)", type: "number", min: 0.01, max: 10000, defaultValue: 400 }'
  ],
  `(inputs) => {
    const m1 = inputs.mass1 as number * 1.989e30;
    const m2 = inputs.mass2 as number * 1.989e30;
    const f = inputs.frequency as number;
    const D = inputs.distanceMpc as number * 3.086e22;
    const G = 6.674e-11;
    const c = 3e8;
    const chirpMass = Math.pow(m1 * m2, 3 / 5) / Math.pow(m1 + m2, 1 / 5);
    const chirpSolar = chirpMass / 1.989e30;
    const strain = (4 / D) * Math.pow(G * chirpMass / (c * c), 5 / 3) * Math.pow(Math.PI * f / c, 2 / 3);
    const orbFreq = f / 2;
    return {
      primary: { label: "Strain Amplitude (h)", value: formatNumber(strain) },
      details: [
        { label: "Chirp Mass", value: formatNumber(Math.round(chirpSolar * 100) / 100) + " solar masses" },
        { label: "Orbital Frequency", value: formatNumber(orbFreq) + " Hz" },
        { label: "Distance", value: formatNumber(inputs.distanceMpc as number) + " Mpc" }
      ]
    };
  }`,
  [
    { q: "What is gravitational wave strain?", a: "Strain is the dimensionless amplitude of a gravitational wave, measuring the fractional change in distance between two points as the wave passes. LIGO detects strains as small as 10^-21." },
    { q: "What is chirp mass?", a: "Chirp mass is a specific combination of the two component masses that determines the gravitational wave amplitude and frequency evolution of a binary system. It is the most accurately measured parameter in a detection." },
    { q: "What generates detectable gravitational waves?", a: "The strongest sources are merging compact binaries: pairs of black holes, neutron stars, or mixed systems. The first detection by LIGO in 2015 was from two black holes of about 30 solar masses each merging at about 400 Mpc distance." }
  ],
  `h = (4/D) x (G x M_chirp / c^2)^(5/3) x (pi x f / c)^(2/3)
Chirp Mass = (m1 x m2)^(3/5) / (m1 + m2)^(1/5)`,
  ["schwarzschild-radius-advanced-calculator", "binary-star-mass-calculator"]
);

add(
  "orbital-decay-calculator",
  "Orbital Decay Calculator",
  "Calculate the rate of orbital decay for a satellite in low Earth orbit due to atmospheric drag, estimating the remaining orbital lifetime.",
  "Science",
  "science",
  "A",
  ["orbital decay", "satellite lifetime", "atmospheric drag", "orbit degradation"],
  [
    '{ name: "altitude", label: "Orbital Altitude (km)", type: "number", min: 100, max: 2000, defaultValue: 400 }',
    '{ name: "mass", label: "Satellite Mass (kg)", type: "number", min: 0.1, max: 100000, defaultValue: 1000 }',
    '{ name: "area", label: "Cross-Section Area (m2)", type: "number", min: 0.01, max: 1000, defaultValue: 10 }',
    '{ name: "dragCoeff", label: "Drag Coefficient", type: "number", min: 1, max: 4, defaultValue: 2.2 }'
  ],
  `(inputs) => {
    const h = inputs.altitude as number;
    const m = inputs.mass as number;
    const A = inputs.area as number;
    const Cd = inputs.dragCoeff as number;
    const rho0 = 1.225;
    const H = 8500;
    const rho = rho0 * Math.exp(-(h * 1000) / H);
    const earthRadius = 6371;
    const r = (earthRadius + h) * 1000;
    const mu = 3.986e14;
    const v = Math.sqrt(mu / r);
    const ballisticCoeff = m / (Cd * A);
    const decayRate = -0.5 * rho * v * v * Cd * A / m;
    const periodSec = 2 * Math.PI * r / v;
    const decayPerOrbit = Math.abs(decayRate) * periodSec;
    const roughLifeDays = (h * 1000) / (decayPerOrbit > 0 ? decayPerOrbit : 0.001) / 86400 * periodSec;
    var lifeDisplay = "";
    if (roughLifeDays > 365) { lifeDisplay = formatNumber(Math.round(roughLifeDays / 365 * 10) / 10) + " years"; }
    else { lifeDisplay = formatNumber(Math.round(roughLifeDays)) + " days"; }
    return {
      primary: { label: "Ballistic Coefficient", value: formatNumber(Math.round(ballisticCoeff * 10) / 10) + " kg/m2" },
      details: [
        { label: "Atmospheric Density", value: formatNumber(rho) + " kg/m3" },
        { label: "Orbital Velocity", value: formatNumber(Math.round(v / 1000 * 100) / 100) + " km/s" },
        { label: "Estimated Lifetime", value: lifeDisplay }
      ]
    };
  }`,
  [
    { q: "What causes orbital decay?", a: "Low Earth orbit satellites experience drag from the thin upper atmosphere. This drag removes kinetic energy, causing the orbit to gradually lower until the satellite reenters the atmosphere." },
    { q: "How does altitude affect orbital lifetime?", a: "Atmospheric density drops exponentially with altitude. A satellite at 200 km may last only days, while at 600 km it can last decades. Above about 1000 km, decay takes centuries." },
    { q: "What is the ballistic coefficient?", a: "The ballistic coefficient is the ratio of satellite mass to the product of drag coefficient and cross-sectional area. Higher values mean the satellite is less affected by drag and decays more slowly." }
  ],
  `Ballistic Coefficient = m / (Cd x A)
Atmospheric Density = rho0 x exp(-h / H)
Drag Deceleration = 0.5 x rho x v^2 x Cd x A / m`,
  ["orbital-velocity-calculator", "hohmann-transfer-calculator"]
);

add(
  "planet-surface-gravity-calculator",
  "Planet Surface Gravity Calculator",
  "Calculate the surface gravity of a celestial body from its mass and radius, comparing it to Earth gravity and calculating free-fall acceleration.",
  "Science",
  "science",
  "A",
  ["surface gravity", "gravitational acceleration", "planet gravity", "g force planet"],
  [
    '{ name: "mass", label: "Body Mass (Earth masses)", type: "number", min: 0.0001, max: 100000, defaultValue: 1 }',
    '{ name: "radius", label: "Body Radius (Earth radii)", type: "number", min: 0.01, max: 1000, defaultValue: 1 }'
  ],
  `(inputs) => {
    const massEarth = inputs.mass as number;
    const radiusEarth = inputs.radius as number;
    const gSurface = 9.81 * massEarth / (radiusEarth * radiusEarth);
    const gRatio = gSurface / 9.81;
    const escVel = 11.186 * Math.sqrt(massEarth / radiusEarth);
    const freeFallHeight = 10;
    const fallTime = Math.sqrt(2 * freeFallHeight / gSurface);
    return {
      primary: { label: "Surface Gravity", value: formatNumber(Math.round(gSurface * 1000) / 1000) + " m/s2" },
      details: [
        { label: "Relative to Earth", value: formatNumber(Math.round(gRatio * 1000) / 1000) + " g" },
        { label: "Escape Velocity", value: formatNumber(Math.round(escVel * 100) / 100) + " km/s" },
        { label: "Free-Fall Time (10m)", value: formatNumber(Math.round(fallTime * 1000) / 1000) + " sec" }
      ]
    };
  }`,
  [
    { q: "How is surface gravity calculated?", a: "Surface gravity is proportional to mass and inversely proportional to the square of the radius. A planet twice Earth mass but the same radius would have twice the surface gravity." },
    { q: "Which planet has the strongest surface gravity?", a: "Jupiter has the strongest surface gravity in our solar system at about 2.53 g. Among rocky bodies, Earth has the highest at 1 g, followed closely by Venus at 0.9 g." },
    { q: "How does surface gravity affect human activity?", a: "Humans can adapt to moderate gravity changes, but prolonged exposure to very different gravity levels affects bone density, muscle mass, and cardiovascular function. Long-duration space missions study these effects." }
  ],
  `g = G x M / R^2 = 9.81 x (M/M_Earth) / (R/R_Earth)^2
Escape Velocity = 11.186 x sqrt(M/M_Earth / R/R_Earth) km/s`,
  ["planetary-weight-calculator", "atmospheric-scale-height-calculator"]
);

add(
  "time-dilation-calculator",
  "Relativistic Time Dilation Calculator",
  "Calculate the time dilation effects from special and gravitational relativity for objects traveling at high speeds or near massive bodies.",
  "Science",
  "science",
  "A",
  ["time dilation", "special relativity", "lorentz factor", "twin paradox"],
  [
    '{ name: "velocity", label: "Travel Velocity (% of c)", type: "number", min: 0.01, max: 99.9999, defaultValue: 90 }',
    '{ name: "properTime", label: "Proper Time (years)", type: "number", min: 0.01, max: 10000, defaultValue: 10 }'
  ],
  `(inputs) => {
    const vPercent = inputs.velocity as number;
    const tau = inputs.properTime as number;
    const beta = vPercent / 100;
    const gamma = 1 / Math.sqrt(1 - beta * beta);
    const earthTime = tau * gamma;
    const lengthContract = 1 / gamma;
    const distanceLY = beta * earthTime;
    return {
      primary: { label: "Earth Time Elapsed", value: formatNumber(Math.round(earthTime * 1000) / 1000) + " years" },
      details: [
        { label: "Lorentz Factor", value: formatNumber(Math.round(gamma * 10000) / 10000) },
        { label: "Length Contraction", value: formatNumber(Math.round(lengthContract * 10000) / 10000) },
        { label: "Distance Traveled", value: formatNumber(Math.round(distanceLY * 100) / 100) + " light years" }
      ]
    };
  }`,
  [
    { q: "What is time dilation?", a: "Time dilation is the effect where time passes more slowly for an object moving at high speed relative to a stationary observer. At 90 percent of light speed, 10 years of traveler time corresponds to about 22.9 years on Earth." },
    { q: "Has time dilation been proven?", a: "Yes. Time dilation has been confirmed by many experiments, including muon decay observations, atomic clocks on aircraft, and GPS satellites which must account for both velocity and gravitational time dilation." },
    { q: "What is the twin paradox?", a: "The twin paradox describes how one twin traveling at high speed would age less than the twin who stayed on Earth. It is not actually a paradox since the traveling twin experiences acceleration, breaking the symmetry." }
  ],
  `Lorentz Factor: gamma = 1 / sqrt(1 - v^2/c^2)
Earth Time = Proper Time x gamma
Length Contraction = 1 / gamma`,
  ["space-travel-time-calculator", "cosmic-redshift-distance-calculator"]
);

add(
  "chandrasekhar-limit-calculator",
  "Chandrasekhar Limit Calculator",
  "Calculate the maximum mass of a stable white dwarf star based on composition, and determine whether a remnant will become a white dwarf, neutron star, or black hole.",
  "Science",
  "science",
  "A",
  ["chandrasekhar limit", "white dwarf mass", "stellar remnant", "electron degeneracy"],
  [
    '{ name: "remnantMass", label: "Stellar Remnant Mass (solar masses)", type: "number", min: 0.1, max: 100, defaultValue: 1.2 }',
    '{ name: "electronFraction", label: "Electron Fraction (Ye)", type: "number", min: 0.3, max: 0.6, defaultValue: 0.5 }'
  ],
  `(inputs) => {
    const mass = inputs.remnantMass as number;
    const Ye = inputs.electronFraction as number;
    const chandraLimit = 1.44 * Math.pow(Ye / 0.5, 2);
    const tolmanLimit = 2.16;
    var remnantType = "";
    if (mass < chandraLimit) { remnantType = "White Dwarf"; }
    else if (mass < tolmanLimit) { remnantType = "Neutron Star"; }
    else { remnantType = "Black Hole"; }
    const radius = mass < chandraLimit ? 0.01 * Math.pow(chandraLimit / mass, 1 / 3) : (mass < tolmanLimit ? 10 / 696340 : 0);
    const radiusKm = radius * 696340;
    return {
      primary: { label: "Remnant Type", value: remnantType },
      details: [
        { label: "Chandrasekhar Limit", value: formatNumber(Math.round(chandraLimit * 1000) / 1000) + " solar masses" },
        { label: "Remnant Mass", value: formatNumber(mass) + " solar masses" },
        { label: "Estimated Radius", value: formatNumber(Math.round(radiusKm)) + " km" }
      ]
    };
  }`,
  [
    { q: "What is the Chandrasekhar limit?", a: "The Chandrasekhar limit is approximately 1.44 solar masses, the maximum mass a white dwarf can have before electron degeneracy pressure can no longer support it against gravitational collapse." },
    { q: "What happens above the Chandrasekhar limit?", a: "A remnant above the Chandrasekhar limit but below about 2-3 solar masses becomes a neutron star, supported by neutron degeneracy pressure. Above that, it collapses into a black hole." },
    { q: "Why is the electron fraction important?", a: "The electron fraction Ye determines the number of electrons per baryon. The Chandrasekhar limit scales as Ye squared, so composition affects the exact mass threshold." }
  ],
  `Chandrasekhar Limit = 1.44 x (Ye / 0.5)^2 solar masses
White Dwarf: M < Chandrasekhar Limit
Neutron Star: Chandrasekhar Limit < M < ~2.16 solar masses
Black Hole: M > ~2.16 solar masses`,
  ["schwarzschild-radius-advanced-calculator", "binary-star-mass-calculator"]
);

add(
  "keplers-equation-solver",
  "Kepler Equation Solver",
  "Solve Kepler equation to find the position of an orbiting body at any time, converting mean anomaly to true anomaly via eccentric anomaly.",
  "Science",
  "science",
  "A",
  ["kepler equation", "mean anomaly", "eccentric anomaly", "true anomaly", "orbital position"],
  [
    '{ name: "meanAnomaly", label: "Mean Anomaly (degrees)", type: "number", min: 0, max: 360, defaultValue: 90 }',
    '{ name: "eccentricity", label: "Orbital Eccentricity", type: "number", min: 0, max: 0.99, defaultValue: 0.2 }',
    '{ name: "semiMajorAxis", label: "Semi-Major Axis (AU)", type: "number", min: 0.01, max: 100000, defaultValue: 1 }'
  ],
  `(inputs) => {
    const Mdeg = inputs.meanAnomaly as number;
    const e = inputs.eccentricity as number;
    const a = inputs.semiMajorAxis as number;
    const Mrad = Mdeg * Math.PI / 180;
    var E = Mrad;
    for (var i = 0; i < 100; i++) {
      var dE = (E - e * Math.sin(E) - Mrad) / (1 - e * Math.cos(E));
      E = E - dE;
      if (Math.abs(dE) < 1e-12) break;
    }
    var Edeg = E * 180 / Math.PI;
    var nu = 2 * Math.atan2(Math.sqrt(1 + e) * Math.sin(E / 2), Math.sqrt(1 - e) * Math.cos(E / 2));
    var nuDeg = nu * 180 / Math.PI;
    if (nuDeg < 0) nuDeg += 360;
    var r = a * (1 - e * Math.cos(E));
    return {
      primary: { label: "True Anomaly", value: formatNumber(Math.round(nuDeg * 1000) / 1000) + " degrees" },
      details: [
        { label: "Eccentric Anomaly", value: formatNumber(Math.round(Edeg * 1000) / 1000) + " degrees" },
        { label: "Orbital Radius", value: formatNumber(Math.round(r * 10000) / 10000) + " AU" },
        { label: "Mean Anomaly", value: formatNumber(Mdeg) + " degrees" }
      ]
    };
  }`,
  [
    { q: "What is Kepler equation?", a: "Kepler equation relates the mean anomaly M to the eccentric anomaly E through M = E - e sin(E). It must be solved iteratively because E cannot be expressed as a simple function of M." },
    { q: "What is the true anomaly?", a: "The true anomaly is the actual angular position of the orbiting body measured from the closest approach point (periapsis). It describes where the body is in its orbit at a given time." },
    { q: "Why does eccentricity matter?", a: "For circular orbits (e = 0) the true anomaly equals the mean anomaly. For highly elliptical orbits, the body spends more time near apoapsis and moves quickly through periapsis, making the anomalies very different." }
  ],
  `M = E - e sin(E) (Kepler equation, solve iteratively for E)
True Anomaly: nu = 2 x atan2(sqrt(1+e) x sin(E/2), sqrt(1-e) x cos(E/2))
Radius = a x (1 - e x cos(E))`,
  ["synodic-period-calculator", "hohmann-transfer-calculator"]
);

// === FOOTER: Generate files ===

function genFile(c) {
  return `import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const ${eName(c.slug)}: CalculatorDefinition = {
  slug: "${c.slug}",
  title: "${c.title}",
  description: "${c.desc}",
  category: "${c.cat}",
  categorySlug: "${c.cs}",
  icon: "${c.icon}",
  keywords: ${JSON.stringify(c.kw)},
  variants: [{
    id: "standard",
    name: "${c.title.replace(' Calculator', '')}",
    description: "${c.desc}",
    fields: [
      ${c.fields.join(',\n      ')},
    ],
    calculate: ${c.calcBody},
  }],
  relatedSlugs: ${JSON.stringify(c.rel)},
  faq: [
${c.faq.map(f => `    { question: "${f.q}", answer: "${f.a}" },`).join('\n')}
  ],
  formula: "${c.formula}",
};
`;
}

let generated = 0, skipped = 0;
for (const c of calcs) {
  if (existingSlugs.has(c.slug)) { skipped++; console.log(`SKIP (exists): ${c.slug}`); continue; }
  const filePath = path.join(CALC_DIR, c.slug + '.ts');
  fs.writeFileSync(filePath, genFile(c));
  generated++;
}

console.log(`\nGenerated: ${generated} | Skipped: ${skipped}`);
console.log(`Total definitions: ${calcs.length}`);

const newImports = calcs.filter(c => !existingSlugs.has(c.slug)).map(c => `import { ${eName(c.slug)} } from "./${c.slug}";`);
const newRegs = calcs.filter(c => !existingSlugs.has(c.slug)).map(c => `  ${eName(c.slug)},`);
fs.writeFileSync(path.join(__dirname, 'new-imports-batch13.txt'), newImports.join('\n'));
fs.writeFileSync(path.join(__dirname, 'new-regs-batch13.txt'), newRegs.join('\n'));
console.log(`Imports saved to: scripts/new-imports-batch13.txt`);
console.log(`Registry saved to: scripts/new-regs-batch13.txt`);
