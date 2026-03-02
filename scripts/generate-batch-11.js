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

// === BATCH 11: 100 CALCULATORS ===

add('cattle-weight-gain-calculator', 'Cattle Weight Gain Calculator',
  'Estimate average daily gain and total weight gain for cattle over a feeding period based on intake and feed efficiency.',
  'Everyday', 'everyday', '~',
  ['cattle weight gain', 'average daily gain calculator', 'beef cattle growth'],
  [
    '{ name: "startWeight", label: "Starting Weight (lb)", type: "number", min: 200, max: 2000, defaultValue: 550 }',
    '{ name: "targetWeight", label: "Target Weight (lb)", type: "number", min: 300, max: 2500, defaultValue: 1300 }',
    '{ name: "adg", label: "Average Daily Gain (lb/day)", type: "number", min: 0.5, max: 5, defaultValue: 2.8 }',
    '{ name: "numHead", label: "Number of Head", type: "number", min: 1, max: 10000, defaultValue: 50 }',
  ],
  `(inputs) => {
      const sw = inputs.startWeight as number;
      const tw = inputs.targetWeight as number;
      const adg = inputs.adg as number;
      const nh = inputs.numHead as number;
      if (!sw || !tw || !adg || !nh || tw <= sw) return null;
      const gainPerHead = tw - sw;
      const daysOnFeed = Math.ceil(gainPerHead / adg);
      const totalGain = gainPerHead * nh;
      const weeksOnFeed = Math.round(daysOnFeed / 7 * 10) / 10;
      return {
        primary: { label: "Days on Feed", value: formatNumber(daysOnFeed) + " days" },
        details: [
          { label: "Gain Per Head", value: formatNumber(gainPerHead) + " lb" },
          { label: "Total Herd Gain", value: formatNumber(totalGain) + " lb" },
          { label: "Weeks on Feed", value: formatNumber(weeksOnFeed) },
        ],
      };
  }`,
  [{ q: 'What is a good average daily gain for beef cattle?', a: 'Feedlot cattle typically gain 2.5 to 4 pounds per day depending on breed, diet, and management. Pasture-raised cattle average 1.5 to 2.5 pounds per day.' },
   { q: 'How does feed quality affect weight gain?', a: 'Higher energy feeds like grain produce faster gains. Cattle on a high-concentrate diet can gain 3 to 4 lb per day, while forage-only diets produce slower gains of 1 to 2 lb per day.' }],
  `Average Daily Gain (ADG) = Total Weight Gain / Days on Feed
Days on Feed = (Target Weight - Start Weight) / ADG
Total Herd Gain = Gain Per Head x Number of Head`,
  ['livestock-feed-calculator', 'hay-bale-calculator']
);

add('poultry-egg-production-calculator', 'Poultry Egg Production Calculator',
  'Calculate expected egg production, revenue, and feed costs for a laying flock over a production cycle.',
  'Everyday', 'everyday', '~',
  ['egg production calculator', 'laying hen calculator', 'poultry farm production'],
  [
    '{ name: "numHens", label: "Number of Laying Hens", type: "number", min: 1, max: 100000, defaultValue: 200 }',
    '{ name: "layRate", label: "Laying Rate (%)", type: "number", min: 30, max: 100, defaultValue: 75 }',
    '{ name: "eggPrice", label: "Price Per Dozen ($)", type: "number", min: 0.5, max: 20, defaultValue: 3.5 }',
    '{ name: "feedCostPerBag", label: "Feed Cost Per 50lb Bag ($)", type: "number", min: 5, max: 100, defaultValue: 18 }',
    '{ name: "weeks", label: "Production Period (weeks)", type: "number", min: 1, max: 104, defaultValue: 52 }',
  ],
  `(inputs) => {
      const hens = inputs.numHens as number;
      const rate = inputs.layRate as number;
      const price = inputs.eggPrice as number;
      const feedCost = inputs.feedCostPerBag as number;
      const weeks = inputs.weeks as number;
      if (!hens || !rate || !price || !feedCost || !weeks) return null;
      const days = weeks * 7;
      const totalEggs = Math.round(hens * (rate / 100) * days);
      const dozens = Math.round(totalEggs / 12);
      const revenue = Math.round(dozens * price * 100) / 100;
      const feedLbPerHenDay = 0.25;
      const totalFeedLbs = Math.round(hens * feedLbPerHenDay * days);
      const totalFeedCost = Math.round(totalFeedLbs / 50 * feedCost * 100) / 100;
      const profit = Math.round((revenue - totalFeedCost) * 100) / 100;
      return {
        primary: { label: "Total Eggs Produced", value: formatNumber(totalEggs) },
        details: [
          { label: "Dozens", value: formatNumber(dozens) },
          { label: "Egg Revenue", value: "$" + formatNumber(revenue) },
          { label: "Feed Cost", value: "$" + formatNumber(totalFeedCost) },
          { label: "Net Profit", value: "$" + formatNumber(profit) },
        ],
      };
  }`,
  [{ q: 'How many eggs does a hen lay per year?', a: 'A productive laying hen produces approximately 250 to 300 eggs per year, which translates to a 70 to 82 percent lay rate.' },
   { q: 'When do hens stop laying eggs?', a: 'Hens produce the most eggs in their first two years. Production drops by about 10 to 15 percent each year after that.' }],
  `Total Eggs = Number of Hens x Lay Rate x Days
Revenue = (Total Eggs / 12) x Price Per Dozen
Feed Cost = Hens x 0.25 lb/day x Days / 50 x Bag Price`,
  ['livestock-feed-calculator', 'cattle-weight-gain-calculator']
);

add('farm-profit-margin-calculator', 'Farm Profit Margin Calculator',
  'Calculate gross and net profit margins for your farm operation based on revenue, cost of production, and operating expenses.',
  'Finance', 'finance', '$',
  ['farm profit margin', 'agriculture profit calculator', 'farm income calculator'],
  [
    '{ name: "grossRevenue", label: "Gross Revenue ($)", type: "number", min: 0, max: 50000000, defaultValue: 500000 }',
    '{ name: "costOfGoods", label: "Cost of Production ($)", type: "number", min: 0, max: 50000000, defaultValue: 280000 }',
    '{ name: "operatingExp", label: "Operating Expenses ($)", type: "number", min: 0, max: 10000000, defaultValue: 120000 }',
    '{ name: "debtPayments", label: "Annual Debt Payments ($)", type: "number", min: 0, max: 5000000, defaultValue: 35000 }',
  ],
  `(inputs) => {
      const rev = inputs.grossRevenue as number;
      const cogs = inputs.costOfGoods as number;
      const opex = inputs.operatingExp as number;
      const debt = inputs.debtPayments as number;
      if (!rev) return null;
      const grossProfit = rev - cogs;
      const grossMargin = Math.round(grossProfit / rev * 10000) / 100;
      const netIncome = grossProfit - opex - debt;
      const netMargin = Math.round(netIncome / rev * 10000) / 100;
      return {
        primary: { label: "Net Profit Margin", value: formatNumber(netMargin) + "%" },
        details: [
          { label: "Gross Profit", value: "$" + formatNumber(Math.round(grossProfit)) },
          { label: "Gross Margin", value: formatNumber(grossMargin) + "%" },
          { label: "Net Income", value: "$" + formatNumber(Math.round(netIncome)) },
          { label: "Total Expenses", value: "$" + formatNumber(Math.round(cogs + opex + debt)) },
        ],
      };
  }`,
  [{ q: 'What is a good profit margin for a farm?', a: 'Farm profit margins vary widely by commodity. Crop farms typically see 10 to 25 percent net margins in good years, while livestock operations average 5 to 15 percent. Specialty crops can exceed 30 percent.' },
   { q: 'How can farmers improve profit margins?', a: 'Farmers can improve margins by reducing input costs, improving yields through better management, adding value through processing, diversifying income streams, and negotiating better commodity prices.' }],
  `Gross Profit = Revenue - Cost of Production
Net Income = Gross Profit - Operating Expenses - Debt Payments
Net Margin = Net Income / Revenue x 100`,
  ['crop-yield-calculator', 'livestock-feed-calculator']
);

add('tractor-fuel-cost-calculator', 'Tractor Fuel Cost Calculator',
  'Estimate diesel fuel consumption and cost for tractor field operations based on horsepower, load factor, and hours worked.',
  'Everyday', 'everyday', '~',
  ['tractor fuel cost', 'diesel consumption calculator', 'farm equipment fuel'],
  [
    '{ name: "horsePower", label: "Tractor Horsepower", type: "number", min: 20, max: 600, defaultValue: 150 }',
    '{ name: "loadFactor", label: "Load Factor (%)", type: "number", min: 20, max: 100, defaultValue: 55 }',
    '{ name: "hoursPerDay", label: "Hours Per Day", type: "number", min: 1, max: 24, defaultValue: 8 }',
    '{ name: "daysPerYear", label: "Days Per Year", type: "number", min: 1, max: 365, defaultValue: 120 }',
    '{ name: "fuelPrice", label: "Diesel Price ($/gallon)", type: "number", min: 1, max: 10, defaultValue: 3.75 }',
  ],
  `(inputs) => {
      const hp = inputs.horsePower as number;
      const lf = inputs.loadFactor as number;
      const hpd = inputs.hoursPerDay as number;
      const dpy = inputs.daysPerYear as number;
      const fp = inputs.fuelPrice as number;
      if (!hp || !lf || !hpd || !dpy || !fp) return null;
      const galPerHour = hp * (lf / 100) * 0.044;
      const dailyFuel = Math.round(galPerHour * hpd * 100) / 100;
      const annualGallons = Math.round(galPerHour * hpd * dpy);
      const annualCost = Math.round(annualGallons * fp * 100) / 100;
      const costPerHour = Math.round(galPerHour * fp * 100) / 100;
      return {
        primary: { label: "Annual Fuel Cost", value: "$" + formatNumber(annualCost) },
        details: [
          { label: "Gallons Per Hour", value: formatNumber(Math.round(galPerHour * 100) / 100) },
          { label: "Daily Fuel Use", value: formatNumber(dailyFuel) + " gal" },
          { label: "Annual Gallons", value: formatNumber(annualGallons) + " gal" },
          { label: "Cost Per Hour", value: "$" + formatNumber(costPerHour) },
        ],
      };
  }`,
  [{ q: 'How much fuel does a tractor use per hour?', a: 'A general rule of thumb is that a diesel engine consumes about 0.044 gallons per horsepower-hour at full load. A 100 HP tractor at 50% load uses roughly 2.2 gallons per hour.' },
   { q: 'What is load factor?', a: 'Load factor is the percentage of maximum engine power being used during an operation. Heavy tillage may be 70 to 85%, while light mowing may be 30 to 40%.' }],
  `Fuel Consumption (gal/hr) = HP x Load Factor x 0.044
Annual Cost = Gal/Hr x Hours/Day x Days/Year x Fuel Price`,
  ['tractor-pto-calculator', 'farm-profit-margin-calculator']
);

add('silage-volume-calculator', 'Silage Volume Calculator',
  'Calculate silage storage volume needed and estimate tonnage for bunker silos, tower silos, or silage bags.',
  'Everyday', 'everyday', '~',
  ['silage volume', 'silage storage calculator', 'bunker silo capacity'],
  [
    '{ name: "storageType", label: "Storage Type", type: "select", options: [{ value: "1", label: "Bunker Silo" }, { value: "2", label: "Tower Silo" }, { value: "3", label: "Silage Bag" }], defaultValue: "1" }',
    '{ name: "length", label: "Length/Height (feet)", type: "number", min: 10, max: 500, defaultValue: 100 }',
    '{ name: "width", label: "Width/Diameter (feet)", type: "number", min: 5, max: 100, defaultValue: 40 }',
    '{ name: "depth", label: "Depth (feet, bunker only)", type: "number", min: 1, max: 30, defaultValue: 10 }',
    '{ name: "density", label: "Silage Density (lb/cu ft)", type: "number", min: 30, max: 60, defaultValue: 44 }',
  ],
  `(inputs) => {
      const st = inputs.storageType as number;
      const len = inputs.length as number;
      const wid = inputs.width as number;
      const dep = inputs.depth as number;
      const dens = inputs.density as number;
      if (!len || !wid || !dens) return null;
      var volume = 0;
      if (st == 1) {
        volume = len * wid * dep;
      } else if (st == 2) {
        var radius = wid / 2;
        volume = Math.round(3.14159 * radius * radius * len);
      } else {
        var radius2 = wid / 2;
        volume = Math.round(3.14159 * radius2 * radius2 * len);
      }
      const totalLbs = Math.round(volume * dens);
      const tons = Math.round(totalLbs / 2000 * 10) / 10;
      return {
        primary: { label: "Storage Volume", value: formatNumber(Math.round(volume)) + " cu ft" },
        details: [
          { label: "Total Weight", value: formatNumber(totalLbs) + " lb" },
          { label: "Tons of Silage", value: formatNumber(tons) + " tons" },
          { label: "Density Used", value: dens + " lb/cu ft" },
        ],
      };
  }`,
  [{ q: 'What is a good silage density?', a: 'Well-packed corn silage should achieve 14 to 16 pounds per cubic foot on a dry matter basis, or 40 to 50 pounds per cubic foot as fed. Higher density reduces spoilage.' },
   { q: 'How long does silage last in storage?', a: 'Properly stored and sealed silage can last 2 to 3 years. Once opened, a bunker face should be fed out at 6 to 12 inches per day to minimize spoilage.' }],
  `Bunker Volume = Length x Width x Depth
Tower/Bag Volume = Pi x (Diameter/2)^2 x Length
Tons = Volume x Density / 2000`,
  ['hay-bale-calculator', 'livestock-feed-calculator']
);

add('crop-rotation-planner-calculator', 'Crop Rotation Planner Calculator',
  'Plan crop rotation across multiple fields and seasons to optimize soil health, reduce pest pressure, and maximize nutrient cycling.',
  'Science', 'science', 'A',
  ['crop rotation', 'field rotation planner', 'crop sequence calculator'],
  [
    '{ name: "numFields", label: "Number of Fields", type: "number", min: 2, max: 20, defaultValue: 4 }',
    '{ name: "acresPerField", label: "Acres Per Field", type: "number", min: 1, max: 5000, defaultValue: 80 }',
    '{ name: "rotationType", label: "Rotation Type", type: "select", options: [{ value: "1", label: "Corn-Soybean (2-yr)" }, { value: "2", label: "Corn-Soy-Wheat (3-yr)" }, { value: "3", label: "Corn-Soy-Wheat-Hay (4-yr)" }], defaultValue: "2" }',
    '{ name: "currentYear", label: "Starting Year", type: "number", min: 2020, max: 2040, defaultValue: 2026 }',
  ],
  `(inputs) => {
      const nf = inputs.numFields as number;
      const apf = inputs.acresPerField as number;
      const rt = inputs.rotationType as number;
      const yr = inputs.currentYear as number;
      if (!nf || !apf || !yr) return null;
      var crops = [];
      if (rt == 1) crops = ["Corn", "Soybean"];
      else if (rt == 2) crops = ["Corn", "Soybean", "Wheat"];
      else crops = ["Corn", "Soybean", "Wheat", "Hay"];
      const rotLen = crops.length;
      const totalAcres = nf * apf;
      const acresPerCrop = Math.round(totalAcres / rotLen);
      var schedule = [];
      for (var i = 0; i < Math.min(nf, 4); i++) {
        var cropIdx = i % rotLen;
        schedule.push({ label: "Field " + (i + 1) + " (" + yr + ")", value: crops[cropIdx] });
      }
      return {
        primary: { label: "Rotation Length", value: rotLen + " years" },
        details: [
          { label: "Total Acres", value: formatNumber(totalAcres) },
          { label: "Acres Per Crop/Year", value: formatNumber(acresPerCrop) },
        ].concat(schedule),
      };
  }`,
  [{ q: 'Why is crop rotation important?', a: 'Crop rotation breaks pest and disease cycles, improves soil structure, balances nutrient use, reduces herbicide resistance, and can improve yields by 10 to 15 percent over continuous cropping.' },
   { q: 'What is the best crop rotation for corn?', a: 'A corn-soybean rotation is the most common in the US Midwest. Adding a small grain like wheat and a cover crop or hay year provides even greater soil health benefits.' }],
  `Rotation Length = Number of unique crops in sequence
Acres Per Crop = Total Acres / Rotation Length
Each field shifts one crop forward each year`,
  ['crop-yield-calculator', 'seed-rate-calculator']
);

add('farm-labor-cost-calculator', 'Farm Labor Cost Calculator',
  'Calculate total labor costs for farm operations including wages, overtime, benefits, and seasonal workers.',
  'Finance', 'finance', '$',
  ['farm labor cost', 'agricultural worker cost', 'farm payroll calculator'],
  [
    '{ name: "numWorkers", label: "Number of Workers", type: "number", min: 1, max: 500, defaultValue: 5 }',
    '{ name: "hourlyWage", label: "Hourly Wage ($)", type: "number", min: 7, max: 50, defaultValue: 15 }',
    '{ name: "hoursPerWeek", label: "Hours Per Week", type: "number", min: 10, max: 80, defaultValue: 45 }',
    '{ name: "weeksPerYear", label: "Weeks Per Year", type: "number", min: 1, max: 52, defaultValue: 40 }',
    '{ name: "benefitsPct", label: "Benefits & Taxes (%)", type: "number", min: 0, max: 50, defaultValue: 18 }',
  ],
  `(inputs) => {
      const nw = inputs.numWorkers as number;
      const hw = inputs.hourlyWage as number;
      const hpw = inputs.hoursPerWeek as number;
      const wpy = inputs.weeksPerYear as number;
      const bp = inputs.benefitsPct as number;
      if (!nw || !hw || !hpw || !wpy) return null;
      const regHours = Math.min(hpw, 40);
      const otHours = Math.max(0, hpw - 40);
      const weeklyPay = (regHours * hw) + (otHours * hw * 1.5);
      const annualPerWorker = Math.round(weeklyPay * wpy * 100) / 100;
      const benefits = Math.round(annualPerWorker * bp / 100 * 100) / 100;
      const totalPerWorker = Math.round(annualPerWorker + benefits);
      const totalLabor = Math.round(totalPerWorker * nw);
      return {
        primary: { label: "Total Annual Labor Cost", value: "$" + formatNumber(totalLabor) },
        details: [
          { label: "Cost Per Worker", value: "$" + formatNumber(totalPerWorker) },
          { label: "Base Pay Per Worker", value: "$" + formatNumber(Math.round(annualPerWorker)) },
          { label: "Benefits Per Worker", value: "$" + formatNumber(Math.round(benefits)) },
          { label: "Overtime Hours/Week", value: formatNumber(otHours) },
        ],
      };
  }`,
  [{ q: 'What is the average farm worker wage?', a: 'The average US farm worker wage ranges from $13 to $18 per hour depending on region, experience, and type of agriculture. Skilled equipment operators and supervisors earn $18 to $28 per hour.' },
   { q: 'Are farm workers entitled to overtime?', a: 'Federal overtime rules for farm workers vary. Many states now require agricultural overtime after 40 or 60 hours per week. Check your state labor laws for specific requirements.' }],
  `Weekly Pay = (Regular Hours x Wage) + (OT Hours x Wage x 1.5)
Annual Pay = Weekly Pay x Weeks Per Year
Total Cost = Annual Pay x (1 + Benefits%) x Number of Workers`,
  ['farm-profit-margin-calculator', 'tractor-fuel-cost-calculator']
);

add('fertilizer-application-rate-calculator', 'Fertilizer Application Rate Calculator',
  'Determine the correct amount of fertilizer product to apply based on soil test recommendations, nutrient content, and field size.',
  'Science', 'science', 'A',
  ['fertilizer application rate', 'npk calculator', 'fertilizer amount calculator'],
  [
    '{ name: "targetN", label: "Target Nitrogen (lb/acre)", type: "number", min: 0, max: 300, defaultValue: 150 }',
    '{ name: "fertilizerN", label: "Fertilizer N Content (%)", type: "number", min: 1, max: 82, defaultValue: 46 }',
    '{ name: "acres", label: "Field Size (acres)", type: "number", min: 0.1, max: 50000, defaultValue: 100 }',
    '{ name: "applicationPasses", label: "Number of Applications", type: "number", min: 1, max: 5, defaultValue: 2 }',
    '{ name: "costPerTon", label: "Fertilizer Cost ($/ton)", type: "number", min: 100, max: 3000, defaultValue: 650 }',
  ],
  `(inputs) => {
      const tn = inputs.targetN as number;
      const fn = inputs.fertilizerN as number;
      const ac = inputs.acres as number;
      const ap = inputs.applicationPasses as number;
      const cpt = inputs.costPerTon as number;
      if (!tn || !fn || !ac || !ap || !cpt) return null;
      const productPerAcre = Math.round(tn / (fn / 100) * 100) / 100;
      const perApplication = Math.round(productPerAcre / ap * 100) / 100;
      const totalProduct = Math.round(productPerAcre * ac);
      const totalTons = Math.round(totalProduct / 2000 * 100) / 100;
      const totalCost = Math.round(totalTons * cpt * 100) / 100;
      const costPerAcre = Math.round(totalCost / ac * 100) / 100;
      return {
        primary: { label: "Product Per Acre", value: formatNumber(productPerAcre) + " lb/acre" },
        details: [
          { label: "Per Application", value: formatNumber(perApplication) + " lb/acre" },
          { label: "Total Product Needed", value: formatNumber(totalProduct) + " lb" },
          { label: "Total Tons", value: formatNumber(totalTons) },
          { label: "Total Cost", value: "$" + formatNumber(totalCost) },
          { label: "Cost Per Acre", value: "$" + formatNumber(costPerAcre) },
        ],
      };
  }`,
  [{ q: 'How do I determine how much fertilizer to apply?', a: 'Start with a soil test to know current nutrient levels. Subtract available nutrients from crop requirements. Divide the nutrient needed by the fertilizer analysis percentage to get product rate.' },
   { q: 'What does 46-0-0 mean on fertilizer?', a: 'The three numbers represent the percentages of nitrogen (N), phosphorus (P2O5), and potassium (K2O). So 46-0-0 (urea) contains 46% nitrogen and no phosphorus or potassium.' }],
  `Product Rate (lb/acre) = Target Nutrient / (Fertilizer % / 100)
Total Product = Rate x Acres
Cost = Total Product / 2000 x Cost Per Ton`,
  ['crop-yield-calculator', 'soil-ph-amendment-calculator']
);

add('livestock-water-needs-calculator', 'Livestock Water Needs Calculator',
  'Calculate daily and seasonal water requirements for different livestock types based on animal weight, temperature, and production stage.',
  'Everyday', 'everyday', '~',
  ['livestock water needs', 'cattle water calculator', 'animal water requirements'],
  [
    '{ name: "animalType", label: "Animal Type", type: "select", options: [{ value: "1", label: "Beef Cattle" }, { value: "2", label: "Dairy Cow" }, { value: "3", label: "Horse" }, { value: "4", label: "Sheep/Goat" }, { value: "5", label: "Swine" }], defaultValue: "1" }',
    '{ name: "numAnimals", label: "Number of Animals", type: "number", min: 1, max: 10000, defaultValue: 100 }',
    '{ name: "avgTemp", label: "Average Temperature (F)", type: "number", min: 0, max: 120, defaultValue: 80 }',
    '{ name: "days", label: "Period (days)", type: "number", min: 1, max: 365, defaultValue: 90 }',
  ],
  `(inputs) => {
      const at = inputs.animalType as number;
      const na = inputs.numAnimals as number;
      const temp = inputs.avgTemp as number;
      const days = inputs.days as number;
      if (!na || !days) return null;
      var baseGal = 12;
      if (at == 1) baseGal = 12;
      else if (at == 2) baseGal = 30;
      else if (at == 3) baseGal = 10;
      else if (at == 4) baseGal = 2;
      else baseGal = 5;
      var tempFactor = 1;
      if (temp > 90) tempFactor = 1.5;
      else if (temp > 80) tempFactor = 1.2;
      else if (temp < 32) tempFactor = 0.85;
      const dailyPerHead = Math.round(baseGal * tempFactor * 10) / 10;
      const dailyTotal = Math.round(dailyPerHead * na);
      const totalGallons = dailyTotal * days;
      return {
        primary: { label: "Daily Per Head", value: formatNumber(dailyPerHead) + " gal" },
        details: [
          { label: "Daily Herd Total", value: formatNumber(dailyTotal) + " gal" },
          { label: "Period Total", value: formatNumber(totalGallons) + " gal" },
          { label: "Temperature Factor", value: formatNumber(tempFactor) + "x" },
        ],
      };
  }`,
  [{ q: 'How much water does a cow drink per day?', a: 'A beef cow drinks 7 to 20 gallons per day depending on size, temperature, and lactation. Dairy cows drink 25 to 50 gallons per day due to milk production demands.' },
   { q: 'Does temperature affect water consumption?', a: 'Yes significantly. Cattle water intake can increase 50% or more when temperatures exceed 90 degrees F. Adequate water supply is critical for preventing heat stress.' }],
  `Daily Water = Base Requirement x Temperature Factor
Total Water = Daily Per Head x Number of Animals x Days`,
  ['livestock-feed-calculator', 'cattle-weight-gain-calculator']
);

add('beehive-honey-yield-calculator', 'Beehive Honey Yield Calculator',
  'Estimate annual honey production and revenue from your apiary based on hive count, local conditions, and harvest frequency.',
  'Everyday', 'everyday', '~',
  ['honey yield calculator', 'beekeeping calculator', 'apiary production estimator'],
  [
    '{ name: "numHives", label: "Number of Hives", type: "number", min: 1, max: 5000, defaultValue: 10 }',
    '{ name: "yieldPerHive", label: "Yield Per Hive (lb/year)", type: "number", min: 10, max: 200, defaultValue: 60 }',
    '{ name: "honeyPrice", label: "Honey Price ($/lb)", type: "number", min: 2, max: 30, defaultValue: 8 }',
    '{ name: "lossPct", label: "Colony Loss Rate (%)", type: "number", min: 0, max: 80, defaultValue: 20 }',
    '{ name: "costPerHive", label: "Annual Cost Per Hive ($)", type: "number", min: 10, max: 500, defaultValue: 75 }',
  ],
  `(inputs) => {
      const nh = inputs.numHives as number;
      const yph = inputs.yieldPerHive as number;
      const hp = inputs.honeyPrice as number;
      const lp = inputs.lossPct as number;
      const cph = inputs.costPerHive as number;
      if (!nh || !yph || !hp || !cph) return null;
      const effectiveHives = Math.round(nh * (1 - lp / 100) * 10) / 10;
      const totalHoney = Math.round(effectiveHives * yph);
      const revenue = Math.round(totalHoney * hp * 100) / 100;
      const totalCost = Math.round(nh * cph);
      const profit = Math.round((revenue - totalCost) * 100) / 100;
      return {
        primary: { label: "Total Honey Yield", value: formatNumber(totalHoney) + " lb" },
        details: [
          { label: "Effective Hives", value: formatNumber(effectiveHives) },
          { label: "Revenue", value: "$" + formatNumber(revenue) },
          { label: "Total Costs", value: "$" + formatNumber(totalCost) },
          { label: "Net Profit", value: "$" + formatNumber(profit) },
        ],
      };
  }`,
  [{ q: 'How much honey does one hive produce?', a: 'An average hive produces 30 to 80 pounds of surplus honey per year depending on location, forage availability, weather, and colony strength. Exceptional hives can produce over 100 pounds.' },
   { q: 'What is the average colony loss rate?', a: 'US beekeepers experience an average annual colony loss of 30 to 45 percent. Good management practices can reduce losses to 15 to 20 percent.' }],
  `Effective Hives = Total Hives x (1 - Loss Rate)
Total Honey = Effective Hives x Yield Per Hive
Profit = (Honey x Price) - (Hives x Cost Per Hive)`,
  ['poultry-egg-production-calculator', 'farm-profit-margin-calculator']
);

add('orchard-tree-spacing-calculator', 'Orchard Tree Spacing Calculator',
  'Calculate the number of trees per acre, total trees needed, and planting layout based on row and tree spacing for orchard design.',
  'Science', 'science', 'A',
  ['orchard spacing', 'tree planting calculator', 'trees per acre calculator'],
  [
    '{ name: "rowSpacing", label: "Row Spacing (feet)", type: "number", min: 4, max: 50, defaultValue: 20 }',
    '{ name: "treeSpacing", label: "Tree Spacing in Row (feet)", type: "number", min: 2, max: 40, defaultValue: 15 }',
    '{ name: "totalAcres", label: "Total Acres", type: "number", min: 0.1, max: 5000, defaultValue: 10 }',
    '{ name: "costPerTree", label: "Cost Per Tree ($)", type: "number", min: 1, max: 200, defaultValue: 25 }',
    '{ name: "replantPct", label: "Extra for Replanting (%)", type: "number", min: 0, max: 30, defaultValue: 10 }',
  ],
  `(inputs) => {
      const rs = inputs.rowSpacing as number;
      const ts = inputs.treeSpacing as number;
      const ac = inputs.totalAcres as number;
      const cpt = inputs.costPerTree as number;
      const rp = inputs.replantPct as number;
      if (!rs || !ts || !ac || !cpt) return null;
      const sqFtPerTree = rs * ts;
      const treesPerAcre = Math.floor(43560 / sqFtPerTree);
      const totalTrees = Math.ceil(treesPerAcre * ac);
      const withExtra = Math.ceil(totalTrees * (1 + rp / 100));
      const totalCost = Math.round(withExtra * cpt);
      const rowsPerAcre = Math.floor(Math.sqrt(43560 / rs) / ts * ts / rs);
      return {
        primary: { label: "Trees Per Acre", value: formatNumber(treesPerAcre) },
        details: [
          { label: "Total Trees Needed", value: formatNumber(totalTrees) },
          { label: "With Replant Extra", value: formatNumber(withExtra) },
          { label: "Sq Ft Per Tree", value: formatNumber(sqFtPerTree) + " sq ft" },
          { label: "Total Tree Cost", value: "$" + formatNumber(totalCost) },
        ],
      };
  }`,
  [{ q: 'What is the best spacing for apple trees?', a: 'Standard apple trees need 25 to 35 feet between rows and 15 to 25 feet between trees. Semi-dwarf trees use 12 to 18 foot spacing, and high-density dwarf plantings can be as close as 3 to 6 feet apart.' },
   { q: 'How many trees fit on one acre?', a: 'It depends on spacing. At 20x15 foot spacing, you get about 145 trees per acre. High-density apple orchards at 12x4 foot spacing can fit over 900 trees per acre.' }],
  `Trees Per Acre = 43,560 / (Row Spacing x Tree Spacing)
Total Trees = Trees Per Acre x Acres
Total Cost = Trees x (1 + Replant%) x Cost Per Tree`,
  ['seed-spacing-calculator', 'vineyard-yield-estimator-calculator']
);

add('vineyard-yield-estimator-calculator', 'Vineyard Yield Estimator Calculator',
  'Estimate grape yield per acre and total vineyard production based on vine spacing, clusters per vine, and average berry weight.',
  'Science', 'science', 'A',
  ['vineyard yield', 'grape production calculator', 'wine grape yield estimator'],
  [
    '{ name: "vinesPerAcre", label: "Vines Per Acre", type: "number", min: 200, max: 4000, defaultValue: 1200 }',
    '{ name: "clustersPerVine", label: "Clusters Per Vine", type: "number", min: 5, max: 80, defaultValue: 30 }',
    '{ name: "clusterWeight", label: "Avg Cluster Weight (oz)", type: "number", min: 1, max: 16, defaultValue: 4 }',
    '{ name: "totalAcres", label: "Vineyard Acres", type: "number", min: 0.1, max: 5000, defaultValue: 20 }',
    '{ name: "grapePrice", label: "Grape Price ($/ton)", type: "number", min: 200, max: 10000, defaultValue: 2000 }',
  ],
  `(inputs) => {
      const vpa = inputs.vinesPerAcre as number;
      const cpv = inputs.clustersPerVine as number;
      const cw = inputs.clusterWeight as number;
      const ac = inputs.totalAcres as number;
      const gp = inputs.grapePrice as number;
      if (!vpa || !cpv || !cw || !ac || !gp) return null;
      const lbsPerVine = Math.round(cpv * cw / 16 * 100) / 100;
      const lbsPerAcre = Math.round(lbsPerVine * vpa);
      const tonsPerAcre = Math.round(lbsPerAcre / 2000 * 100) / 100;
      const totalTons = Math.round(tonsPerAcre * ac * 100) / 100;
      const revenuePerAcre = Math.round(tonsPerAcre * gp);
      const totalRevenue = Math.round(totalTons * gp);
      return {
        primary: { label: "Tons Per Acre", value: formatNumber(tonsPerAcre) },
        details: [
          { label: "Lbs Per Vine", value: formatNumber(lbsPerVine) + " lb" },
          { label: "Lbs Per Acre", value: formatNumber(lbsPerAcre) + " lb" },
          { label: "Total Tons", value: formatNumber(totalTons) },
          { label: "Revenue Per Acre", value: "$" + formatNumber(revenuePerAcre) },
          { label: "Total Revenue", value: "$" + formatNumber(totalRevenue) },
        ],
      };
  }`,
  [{ q: 'What is a typical grape yield per acre?', a: 'Wine grape yields typically range from 2 to 10 tons per acre. Premium wine regions often target 3 to 5 tons per acre for higher quality. Table grape vineyards can produce 8 to 15 tons per acre.' },
   { q: 'How many bottles of wine per ton of grapes?', a: 'One ton of grapes produces approximately 60 to 70 cases or 720 to 840 bottles of wine, depending on grape variety and winemaking process.' }],
  `Lbs Per Vine = Clusters x Cluster Weight (oz) / 16
Tons Per Acre = (Lbs Per Vine x Vines Per Acre) / 2000
Revenue = Tons x Price Per Ton`,
  ['orchard-tree-spacing-calculator', 'crop-yield-calculator']
);

add('compost-pile-volume-calculator', 'Compost Pile Volume Calculator',
  'Calculate the volume and weight of compost generated from green and brown organic materials, with moisture and carbon-to-nitrogen ratio analysis.',
  'Everyday', 'everyday', '~',
  ['compost pile volume', 'compost calculator', 'composting ratio calculator'],
  [
    '{ name: "greenMaterial", label: "Green Material (lb/week)", type: "number", min: 1, max: 5000, defaultValue: 50 }',
    '{ name: "brownMaterial", label: "Brown Material (lb/week)", type: "number", min: 1, max: 5000, defaultValue: 100 }',
    '{ name: "weeks", label: "Collection Period (weeks)", type: "number", min: 1, max: 52, defaultValue: 12 }',
    '{ name: "pileHeight", label: "Desired Pile Height (feet)", type: "number", min: 2, max: 8, defaultValue: 4 }',
  ],
  `(inputs) => {
      const gm = inputs.greenMaterial as number;
      const bm = inputs.brownMaterial as number;
      const wk = inputs.weeks as number;
      const ph = inputs.pileHeight as number;
      if (!gm || !bm || !wk || !ph) return null;
      const totalGreen = gm * wk;
      const totalBrown = bm * wk;
      const totalMaterial = totalGreen + totalBrown;
      const cnRatio = Math.round(((bm * 50 + gm * 15) / (bm + gm)) * 10) / 10;
      var densityLbPerCuFt = 25;
      var volumeCuFt = Math.round(totalMaterial / densityLbPerCuFt);
      var finishedVolume = Math.round(volumeCuFt * 0.4);
      var pileBaseWidth = Math.round(Math.sqrt(volumeCuFt / (ph * 0.5)) * 10) / 10;
      return {
        primary: { label: "Initial Pile Volume", value: formatNumber(volumeCuFt) + " cu ft" },
        details: [
          { label: "Finished Compost Volume", value: formatNumber(finishedVolume) + " cu ft" },
          { label: "Total Material", value: formatNumber(totalMaterial) + " lb" },
          { label: "C:N Ratio", value: formatNumber(cnRatio) + ":1" },
          { label: "Estimated Base Width", value: formatNumber(pileBaseWidth) + " ft" },
        ],
      };
  }`,
  [{ q: 'What is the ideal carbon to nitrogen ratio for composting?', a: 'The ideal C:N ratio for active composting is 25:1 to 35:1. Too much carbon (browns) slows decomposition, while too much nitrogen (greens) causes odor and ammonia loss.' },
   { q: 'How much does a compost pile shrink?', a: 'A compost pile typically reduces to 40 to 60 percent of its original volume as materials decompose, compact, and lose moisture.' }],
  `Pile Volume = Total Material Weight / Density
Finished Volume = Initial Volume x 0.4
C:N Ratio = Weighted average of green and brown carbon ratios`,
  ['compost-bin-size-calculator', 'fertilizer-application-rate-calculator']
);

add('soil-ph-amendment-calculator', 'Soil pH Amendment Calculator',
  'Calculate the amount of lime or sulfur needed to adjust soil pH to the target level for optimal crop growth.',
  'Science', 'science', 'A',
  ['soil ph amendment', 'lime calculator', 'soil sulfur calculator', 'ph correction'],
  [
    '{ name: "currentPH", label: "Current Soil pH", type: "number", min: 3, max: 10, defaultValue: 5.5 }',
    '{ name: "targetPH", label: "Target Soil pH", type: "number", min: 4, max: 9, defaultValue: 6.5 }',
    '{ name: "soilType", label: "Soil Texture", type: "select", options: [{ value: "1", label: "Sandy" }, { value: "2", label: "Loam" }, { value: "3", label: "Clay" }], defaultValue: "2" }',
    '{ name: "acres", label: "Area (acres)", type: "number", min: 0.01, max: 10000, defaultValue: 10 }',
    '{ name: "depth", label: "Incorporation Depth (inches)", type: "number", min: 3, max: 12, defaultValue: 6 }',
  ],
  `(inputs) => {
      const cp = inputs.currentPH as number;
      const tp = inputs.targetPH as number;
      const st = inputs.soilType as number;
      const ac = inputs.acres as number;
      const dep = inputs.depth as number;
      if (!cp || !tp || !ac || !dep) return null;
      var phChange = tp - cp;
      var isLime = phChange > 0;
      var absChange = Math.abs(phChange);
      var baseLbPerAcre = 0;
      if (isLime) {
        var bufferFactor = st == 1 ? 1000 : st == 2 ? 2000 : 3500;
        baseLbPerAcre = Math.round(absChange * bufferFactor * (dep / 6));
      } else {
        var sulfurFactor = st == 1 ? 100 : st == 2 ? 150 : 200;
        baseLbPerAcre = Math.round(absChange * sulfurFactor * (dep / 6));
      }
      var totalLbs = Math.round(baseLbPerAcre * ac);
      var totalTons = Math.round(totalLbs / 2000 * 100) / 100;
      var amendment = isLime ? "Ag Lime" : "Elemental Sulfur";
      return {
        primary: { label: amendment + " Per Acre", value: formatNumber(baseLbPerAcre) + " lb" },
        details: [
          { label: "Amendment Type", value: amendment },
          { label: "pH Change Needed", value: (isLime ? "+" : "") + formatNumber(Math.round(phChange * 10) / 10) },
          { label: "Total Needed", value: formatNumber(totalLbs) + " lb" },
          { label: "Total Tons", value: formatNumber(totalTons) },
        ],
      };
  }`,
  [{ q: 'How long does it take for lime to change soil pH?', a: 'Agricultural lime typically takes 3 to 12 months to fully react with soil. Finer ground lime reacts faster. For quicker results, pelleted lime or liquid lime can begin working within weeks.' },
   { q: 'What pH do most crops prefer?', a: 'Most field crops and vegetables grow best in soil pH 6.0 to 7.0. Blueberries prefer acidic soil at pH 4.5 to 5.5, while alfalfa prefers slightly alkaline soil at pH 6.5 to 7.5.' }],
  `Lime Needed = pH Change x Buffer Factor x (Depth / 6)
Sulfur Needed = pH Change x Sulfur Factor x (Depth / 6)
Buffer Factor varies by soil texture (sandy < loam < clay)`,
  ['fertilizer-application-rate-calculator', 'raised-bed-soil-calculator']
);

add('farm-fence-cost-calculator', 'Farm Fence Cost Calculator',
  'Estimate the total cost of fencing a farm area including materials, posts, gates, and labor for various fence types.',
  'Finance', 'finance', '$',
  ['farm fence cost', 'fencing calculator', 'pasture fence estimate'],
  [
    '{ name: "fenceType", label: "Fence Type", type: "select", options: [{ value: "1", label: "Barbed Wire (4-strand)" }, { value: "2", label: "Woven Wire" }, { value: "3", label: "Electric (3-wire)" }, { value: "4", label: "Board Fence" }], defaultValue: "1" }',
    '{ name: "perimeter", label: "Total Length (feet)", type: "number", min: 100, max: 100000, defaultValue: 5280 }',
    '{ name: "postSpacing", label: "Post Spacing (feet)", type: "number", min: 6, max: 30, defaultValue: 12 }',
    '{ name: "numGates", label: "Number of Gates", type: "number", min: 0, max: 50, defaultValue: 4 }',
    '{ name: "laborRate", label: "Labor Rate ($/hour)", type: "number", min: 0, max: 100, defaultValue: 20 }',
  ],
  `(inputs) => {
      const ft = inputs.fenceType as number;
      const per = inputs.perimeter as number;
      const ps = inputs.postSpacing as number;
      const ng = inputs.numGates as number;
      const lr = inputs.laborRate as number;
      if (!per || !ps) return null;
      var matCostPerFt = 0;
      if (ft == 1) matCostPerFt = 1.5;
      else if (ft == 2) matCostPerFt = 3.0;
      else if (ft == 3) matCostPerFt = 0.75;
      else matCostPerFt = 8.0;
      var numPosts = Math.ceil(per / ps) + 1;
      var postCost = ft == 4 ? 15 : 8;
      var materialCost = Math.round(per * matCostPerFt + numPosts * postCost);
      var gateCost = ng * 250;
      var ftPerHour = ft == 4 ? 15 : 30;
      var laborHours = Math.round(per / ftPerHour);
      var laborCost = Math.round(laborHours * lr);
      var totalCost = materialCost + gateCost + laborCost;
      var costPerFoot = Math.round(totalCost / per * 100) / 100;
      return {
        primary: { label: "Total Fence Cost", value: "$" + formatNumber(totalCost) },
        details: [
          { label: "Material Cost", value: "$" + formatNumber(materialCost) },
          { label: "Gate Cost", value: "$" + formatNumber(gateCost) },
          { label: "Labor Cost", value: "$" + formatNumber(laborCost) },
          { label: "Cost Per Foot", value: "$" + formatNumber(costPerFoot) },
          { label: "Number of Posts", value: formatNumber(numPosts) },
        ],
      };
  }`,
  [{ q: 'What is the cheapest farm fence?', a: 'Electric fencing is typically the cheapest option at $0.50 to $1.50 per foot installed. Barbed wire runs $1.50 to $3.00, woven wire $3.00 to $6.00, and board fence $8.00 to $15.00 per foot.' },
   { q: 'How far apart should fence posts be?', a: 'Standard post spacing is 8 to 12 feet for most wire fences. Electric fence can use 20 to 30 foot spacing. Board fence posts are typically 8 feet apart. Corner and gate posts should be braced.' }],
  `Material Cost = Length x Cost Per Foot + Posts x Post Cost
Labor Cost = (Length / Feet Per Hour) x Labor Rate
Total = Materials + Gates + Labor`,
  ['fence-material-calculator', 'pasture-stocking-rate-calculator']
);

add('aquaculture-feed-rate-calculator', 'Aquaculture Feed Rate Calculator',
  'Calculate daily feed amounts, feed conversion ratio, and total feed costs for fish farming operations.',
  'Science', 'science', 'A',
  ['aquaculture feed rate', 'fish feed calculator', 'fish farm feed cost'],
  [
    '{ name: "totalBiomass", label: "Total Fish Biomass (lb)", type: "number", min: 10, max: 1000000, defaultValue: 5000 }',
    '{ name: "feedRate", label: "Feed Rate (% body weight/day)", type: "number", min: 0.5, max: 10, defaultValue: 3 }',
    '{ name: "fcr", label: "Feed Conversion Ratio", type: "number", min: 0.8, max: 5, defaultValue: 1.6 }',
    '{ name: "feedCostPerLb", label: "Feed Cost ($/lb)", type: "number", min: 0.1, max: 5, defaultValue: 0.55 }',
    '{ name: "growoutDays", label: "Grow-out Period (days)", type: "number", min: 30, max: 730, defaultValue: 180 }',
  ],
  `(inputs) => {
      const tb = inputs.totalBiomass as number;
      const fr = inputs.feedRate as number;
      const fcr = inputs.fcr as number;
      const fcl = inputs.feedCostPerLb as number;
      const days = inputs.growoutDays as number;
      if (!tb || !fr || !fcr || !fcl || !days) return null;
      const dailyFeed = Math.round(tb * fr / 100 * 100) / 100;
      const totalFeed = Math.round(dailyFeed * days);
      const expectedGain = Math.round(totalFeed / fcr);
      const totalFeedCost = Math.round(totalFeed * fcl * 100) / 100;
      const costPerLbGain = Math.round(fcr * fcl * 100) / 100;
      return {
        primary: { label: "Daily Feed Amount", value: formatNumber(dailyFeed) + " lb" },
        details: [
          { label: "Total Feed Needed", value: formatNumber(totalFeed) + " lb" },
          { label: "Expected Weight Gain", value: formatNumber(expectedGain) + " lb" },
          { label: "Total Feed Cost", value: "$" + formatNumber(totalFeedCost) },
          { label: "Feed Cost Per Lb Gain", value: "$" + formatNumber(costPerLbGain) },
        ],
      };
  }`,
  [{ q: 'What is a good feed conversion ratio for fish?', a: 'Tilapia and catfish typically achieve FCR of 1.4 to 1.8. Salmon and trout can reach 1.0 to 1.3. Lower FCR means more efficient feed use and lower production costs.' },
   { q: 'How often should fish be fed?', a: 'Most farmed fish are fed 2 to 4 times daily. Young fry may need feeding 4 to 6 times per day. Feeding frequency decreases as fish grow larger.' }],
  `Daily Feed = Total Biomass x Feed Rate %
Expected Gain = Total Feed / Feed Conversion Ratio
Feed Cost Per Lb Gain = FCR x Feed Price Per Lb`,
  ['aquaponics-sizing-calculator', 'livestock-feed-calculator']
);

add('grain-storage-moisture-calculator', 'Grain Storage Moisture Calculator',
  'Determine safe storage duration for grain based on moisture content and temperature, with drying recommendations.',
  'Science', 'science', 'A',
  ['grain moisture', 'grain storage calculator', 'safe grain storage time'],
  [
    '{ name: "grainType", label: "Grain Type", type: "select", options: [{ value: "1", label: "Corn" }, { value: "2", label: "Soybeans" }, { value: "3", label: "Wheat" }, { value: "4", label: "Rice" }], defaultValue: "1" }',
    '{ name: "moisturePct", label: "Moisture Content (%)", type: "number", min: 8, max: 35, defaultValue: 18 }',
    '{ name: "tempF", label: "Grain Temperature (F)", type: "number", min: 20, max: 110, defaultValue: 70 }',
    '{ name: "bushels", label: "Total Bushels", type: "number", min: 100, max: 5000000, defaultValue: 50000 }',
  ],
  `(inputs) => {
      const gt = inputs.grainType as number;
      const mc = inputs.moisturePct as number;
      const temp = inputs.tempF as number;
      const bu = inputs.bushels as number;
      if (!mc || !temp || !bu) return null;
      var safeMoisture = gt == 1 ? 15.5 : gt == 2 ? 13 : gt == 3 ? 14 : 14;
      var moistureToRemove = Math.max(0, mc - safeMoisture);
      var daysAllowable = 1000;
      if (mc > safeMoisture) {
        var excessM = mc - safeMoisture;
        var tempFactor = Math.max(1, (temp - 30) / 10);
        daysAllowable = Math.max(1, Math.round(150 / (excessM * tempFactor)));
      }
      var lbsWaterPerBu = gt == 1 ? 56 : gt == 2 ? 60 : gt == 3 ? 60 : 45;
      var waterToRemove = Math.round(bu * lbsWaterPerBu * moistureToRemove / 100);
      var status = mc <= safeMoisture ? "Safe for long-term storage" : daysAllowable > 30 ? "Short-term storage only" : "Dry immediately";
      return {
        primary: { label: "Safe Storage Time", value: mc <= safeMoisture ? "Indefinite" : formatNumber(daysAllowable) + " days" },
        details: [
          { label: "Storage Status", value: status },
          { label: "Safe Moisture Level", value: safeMoisture + "%" },
          { label: "Moisture to Remove", value: formatNumber(Math.round(moistureToRemove * 10) / 10) + "%" },
          { label: "Water to Remove", value: formatNumber(waterToRemove) + " lb" },
        ],
      };
  }`,
  [{ q: 'What moisture level is safe for corn storage?', a: 'Corn should be dried to 15.5% moisture for short-term storage (less than 6 months) and 13 to 14% for long-term storage over a year. Lower moisture reduces spoilage risk.' },
   { q: 'What happens if grain is stored too wet?', a: 'Wet grain promotes mold growth, mycotoxin production, and heating. This leads to quality loss, reduced test weight, and can cause spontaneous combustion in severe cases.' }],
  `Safe Storage Days = 150 / (Excess Moisture x Temperature Factor)
Water to Remove = Bushels x Weight/Bu x Excess Moisture%
Temperature Factor = (Temp - 30) / 10`,
  ['grain-bin-capacity-calculator', 'crop-yield-calculator']
);

add('pasture-carrying-capacity-calculator', 'Pasture Carrying Capacity Calculator',
  'Determine how many animal units a pasture can support based on forage growth, rest period, and seasonal production patterns.',
  'Science', 'science', 'A',
  ['carrying capacity', 'pasture capacity calculator', 'grazing capacity estimator'],
  [
    '{ name: "pastureAcres", label: "Pasture Size (acres)", type: "number", min: 1, max: 100000, defaultValue: 200 }',
    '{ name: "forageGrowth", label: "Forage Growth (lb DM/acre/month)", type: "number", min: 100, max: 2000, defaultValue: 500 }',
    '{ name: "utilizationPct", label: "Utilization Rate (%)", type: "number", min: 20, max: 80, defaultValue: 50 }',
    '{ name: "grazingMonths", label: "Grazing Season (months)", type: "number", min: 1, max: 12, defaultValue: 6 }',
    '{ name: "animalUnitDemand", label: "AU Demand (lb DM/month)", type: "number", min: 400, max: 1200, defaultValue: 780 }',
  ],
  `(inputs) => {
      const ac = inputs.pastureAcres as number;
      const fg = inputs.forageGrowth as number;
      const ut = inputs.utilizationPct as number;
      const gm = inputs.grazingMonths as number;
      const aud = inputs.animalUnitDemand as number;
      if (!ac || !fg || !ut || !gm || !aud) return null;
      const availableForage = ac * fg * gm * (ut / 100);
      const totalDemand = aud * gm;
      const animalUnits = Math.floor(availableForage / totalDemand);
      const acresPerAU = Math.round(ac / Math.max(1, animalUnits) * 10) / 10;
      const totalForageTons = Math.round(availableForage / 2000 * 10) / 10;
      return {
        primary: { label: "Animal Units Supported", value: formatNumber(animalUnits) },
        details: [
          { label: "Acres Per Animal Unit", value: formatNumber(acresPerAU) },
          { label: "Available Forage", value: formatNumber(totalForageTons) + " tons DM" },
          { label: "Utilization Rate", value: ut + "%" },
          { label: "Grazing Season", value: gm + " months" },
        ],
      };
  }`,
  [{ q: 'What is an animal unit?', a: 'An animal unit (AU) is defined as one 1,000-pound cow with a calf, consuming approximately 780 pounds of dry matter per month or 26 pounds per day.' },
   { q: 'Why not graze all the forage?', a: 'Leaving 40 to 60 percent of forage ungrazed maintains plant root reserves, prevents soil compaction, reduces erosion, and ensures pasture regrowth for sustainable long-term production.' }],
  `Available Forage = Acres x Growth Rate x Months x Utilization%
Animal Units = Available Forage / (AU Demand x Months)
Acres Per AU = Total Acres / Animal Units`,
  ['pasture-stocking-rate-calculator', 'livestock-feed-calculator']
);

add('greenhouse-energy-cost-calculator', 'Greenhouse Energy Cost Calculator',
  'Estimate monthly and annual heating and cooling energy costs for a greenhouse based on dimensions, climate zone, and covering material.',
  'Finance', 'finance', '$',
  ['greenhouse energy cost', 'greenhouse heating cost', 'greenhouse operating cost'],
  [
    '{ name: "lengthFt", label: "Greenhouse Length (feet)", type: "number", min: 10, max: 500, defaultValue: 96 }',
    '{ name: "widthFt", label: "Greenhouse Width (feet)", type: "number", min: 10, max: 100, defaultValue: 30 }',
    '{ name: "coverType", label: "Covering Type", type: "select", options: [{ value: "1", label: "Single Poly" }, { value: "2", label: "Double Poly" }, { value: "3", label: "Polycarbonate" }, { value: "4", label: "Glass" }], defaultValue: "2" }',
    '{ name: "heatingMonths", label: "Months Needing Heat", type: "number", min: 0, max: 12, defaultValue: 5 }',
    '{ name: "fuelCostPerGal", label: "Propane Cost ($/gallon)", type: "number", min: 0.5, max: 8, defaultValue: 2.5 }',
    '{ name: "avgTempDiff", label: "Avg Inside-Outside Temp Diff (F)", type: "number", min: 5, max: 80, defaultValue: 35 }',
  ],
  `(inputs) => {
      const len = inputs.lengthFt as number;
      const wid = inputs.widthFt as number;
      const ct = inputs.coverType as number;
      const hm = inputs.heatingMonths as number;
      const fc = inputs.fuelCostPerGal as number;
      const td = inputs.avgTempDiff as number;
      if (!len || !wid || !hm || !fc || !td) return null;
      var uFactor = ct == 1 ? 1.13 : ct == 2 ? 0.7 : ct == 3 ? 0.58 : 1.1;
      var wallHeight = 8;
      var surfaceArea = 2 * (len * wallHeight) + 2 * (wid * wallHeight) + len * wid * 1.2;
      var btuPerHour = Math.round(surfaceArea * uFactor * td);
      var btuPerMonth = btuPerHour * 24 * 30;
      var gallonsPerMonth = Math.round(btuPerMonth / 91500);
      var monthlyCost = Math.round(gallonsPerMonth * fc * 100) / 100;
      var annualCost = Math.round(monthlyCost * hm * 100) / 100;
      return {
        primary: { label: "Annual Heating Cost", value: "$" + formatNumber(annualCost) },
        details: [
          { label: "Monthly Heating Cost", value: "$" + formatNumber(monthlyCost) },
          { label: "BTU/Hour Heat Loss", value: formatNumber(btuPerHour) },
          { label: "Propane Per Month", value: formatNumber(gallonsPerMonth) + " gal" },
          { label: "Surface Area", value: formatNumber(Math.round(surfaceArea)) + " sq ft" },
        ],
      };
  }`,
  [{ q: 'How can I reduce greenhouse heating costs?', a: 'Use double-layer poly or polycarbonate covering, add thermal curtains, seal air leaks, use thermal mass like water barrels, and consider zone heating. Double poly can reduce costs by 30 to 40 percent versus single layer.' },
   { q: 'What temperature should a greenhouse be?', a: 'Most vegetables and flowers grow best at 65 to 75 degrees F during the day and 55 to 65 degrees F at night. Cool-season crops can be grown at 50 to 60 degrees F.' }],
  `Heat Loss (BTU/hr) = Surface Area x U-Factor x Temperature Difference
Monthly Fuel = BTU/hr x 24 x 30 / BTU per Gallon
Annual Cost = Monthly Cost x Heating Months`,
  ['greenhouse-heating-calculator', 'farm-profit-margin-calculator']
);

add('farm-insurance-cost-calculator', 'Farm Insurance Cost Calculator',
  'Estimate annual farm insurance premiums including crop insurance, liability, property, and equipment coverage.',
  'Finance', 'finance', '$',
  ['farm insurance cost', 'crop insurance calculator', 'agricultural insurance estimator'],
  [
    '{ name: "cropAcres", label: "Insured Crop Acres", type: "number", min: 0, max: 50000, defaultValue: 500 }',
    '{ name: "expectedRevenue", label: "Expected Revenue Per Acre ($)", type: "number", min: 50, max: 3000, defaultValue: 600 }',
    '{ name: "coverageLevel", label: "Coverage Level (%)", type: "number", min: 50, max: 85, defaultValue: 75 }',
    '{ name: "propertyValue", label: "Farm Property Value ($)", type: "number", min: 0, max: 50000000, defaultValue: 500000 }',
    '{ name: "equipmentValue", label: "Equipment Value ($)", type: "number", min: 0, max: 10000000, defaultValue: 200000 }',
  ],
  `(inputs) => {
      const ca = inputs.cropAcres as number;
      const er = inputs.expectedRevenue as number;
      const cl = inputs.coverageLevel as number;
      const pv = inputs.propertyValue as number;
      const ev = inputs.equipmentValue as number;
      if (!ca || !er || !cl) return null;
      var cropInsuranceRate = 0.065;
      var insuredValue = ca * er * (cl / 100);
      var cropPremium = Math.round(insuredValue * cropInsuranceRate);
      var subsidy = Math.round(cropPremium * 0.55);
      var farmerCropPremium = cropPremium - subsidy;
      var propertyPremium = Math.round(pv * 0.005);
      var equipmentPremium = Math.round(ev * 0.015);
      var liabilityPremium = 750;
      var totalPremium = farmerCropPremium + propertyPremium + equipmentPremium + liabilityPremium;
      return {
        primary: { label: "Total Annual Premium", value: "$" + formatNumber(totalPremium) },
        details: [
          { label: "Crop Insurance (farmer share)", value: "$" + formatNumber(farmerCropPremium) },
          { label: "Federal Subsidy", value: "$" + formatNumber(subsidy) },
          { label: "Property Insurance", value: "$" + formatNumber(propertyPremium) },
          { label: "Equipment Insurance", value: "$" + formatNumber(equipmentPremium) },
          { label: "Liability Insurance", value: "$" + formatNumber(liabilityPremium) },
        ],
      };
  }`,
  [{ q: 'How much does crop insurance cost per acre?', a: 'Crop insurance premiums typically range from $5 to $40 per acre after federal subsidies, depending on crop type, coverage level, and county risk rating. Higher coverage levels cost more.' },
   { q: 'Does the government subsidize crop insurance?', a: 'Yes. The federal government subsidizes 38 to 67 percent of crop insurance premiums depending on the coverage level. A 75% coverage level receives approximately 55% premium subsidy.' }],
  `Crop Premium = Acres x Revenue/Acre x Coverage% x Rate
Farmer Share = Crop Premium x (1 - Subsidy%)
Total = Crop + Property + Equipment + Liability`,
  ['farm-profit-margin-calculator', 'crop-yield-calculator']
);

add('feed-conversion-ratio-calculator', 'Feed Conversion Ratio Calculator',
  'Calculate feed conversion ratio and cost of gain for livestock to evaluate feeding efficiency and compare diets.',
  'Everyday', 'everyday', '~',
  ['feed conversion ratio', 'FCR calculator', 'cost of gain livestock'],
  [
    '{ name: "totalFeedConsumed", label: "Total Feed Consumed (lb)", type: "number", min: 10, max: 10000000, defaultValue: 15000 }',
    '{ name: "totalWeightGain", label: "Total Weight Gain (lb)", type: "number", min: 1, max: 5000000, defaultValue: 9000 }',
    '{ name: "feedCostPerTon", label: "Feed Cost ($/ton)", type: "number", min: 50, max: 2000, defaultValue: 300 }',
    '{ name: "numHead", label: "Number of Head", type: "number", min: 1, max: 50000, defaultValue: 100 }',
    '{ name: "daysOnFeed", label: "Days on Feed", type: "number", min: 1, max: 365, defaultValue: 150 }',
  ],
  `(inputs) => {
      const tfc = inputs.totalFeedConsumed as number;
      const twg = inputs.totalWeightGain as number;
      const fcpt = inputs.feedCostPerTon as number;
      const nh = inputs.numHead as number;
      const dof = inputs.daysOnFeed as number;
      if (!tfc || !twg || !fcpt || !nh || !dof) return null;
      const fcr = Math.round(tfc / twg * 100) / 100;
      const costOfGain = Math.round(fcr * fcpt / 2000 * 100) / 100;
      const dailyGainPerHead = Math.round(twg / nh / dof * 100) / 100;
      const dailyFeedPerHead = Math.round(tfc / nh / dof * 100) / 100;
      const totalFeedCost = Math.round(tfc / 2000 * fcpt);
      return {
        primary: { label: "Feed Conversion Ratio", value: formatNumber(fcr) + ":1" },
        details: [
          { label: "Cost of Gain", value: "$" + formatNumber(costOfGain) + "/lb" },
          { label: "Daily Gain Per Head", value: formatNumber(dailyGainPerHead) + " lb" },
          { label: "Daily Feed Per Head", value: formatNumber(dailyFeedPerHead) + " lb" },
          { label: "Total Feed Cost", value: "$" + formatNumber(totalFeedCost) },
        ],
      };
  }`,
  [{ q: 'What is a good feed conversion ratio for cattle?', a: 'Feedlot cattle typically achieve an FCR of 5.5:1 to 7:1, meaning 5.5 to 7 pounds of feed per pound of gain. Poultry has the best FCR at 1.6:1 to 2:1, and swine averages 2.5:1 to 3.5:1.' },
   { q: 'How can I improve feed conversion?', a: 'Improve FCR through better genetics, optimized rations, proper feed processing, managing animal health, maintaining comfortable housing temperatures, and minimizing feed waste.' }],
  `FCR = Total Feed Consumed / Total Weight Gain
Cost of Gain = FCR x Feed Cost Per Pound
Daily Gain = Total Gain / Head / Days`,
  ['livestock-feed-calculator', 'cattle-weight-gain-calculator']
);

add('center-pivot-irrigation-calculator', 'Center Pivot Irrigation Calculator',
  'Calculate the coverage area, water application rate, and operating cost of a center pivot irrigation system.',
  'Science', 'science', 'A',
  ['center pivot calculator', 'pivot irrigation', 'irrigation system sizing'],
  [
    '{ name: "pivotLength", label: "Pivot Length (feet)", type: "number", min: 100, max: 3000, defaultValue: 1320 }',
    '{ name: "flowRate", label: "Flow Rate (GPM)", type: "number", min: 100, max: 3000, defaultValue: 800 }',
    '{ name: "hoursPerRev", label: "Hours Per Revolution", type: "number", min: 10, max: 200, defaultValue: 60 }',
    '{ name: "energyCostPerHr", label: "Energy Cost ($/hour)", type: "number", min: 1, max: 100, defaultValue: 15 }',
    '{ name: "seasonDays", label: "Irrigation Season (days)", type: "number", min: 30, max: 250, defaultValue: 120 }',
  ],
  `(inputs) => {
      const pl = inputs.pivotLength as number;
      const fr = inputs.flowRate as number;
      const hpr = inputs.hoursPerRev as number;
      const ec = inputs.energyCostPerHr as number;
      const sd = inputs.seasonDays as number;
      if (!pl || !fr || !hpr || !ec || !sd) return null;
      var areaSqFt = 3.14159 * pl * pl;
      var areaAcres = Math.round(areaSqFt / 43560 * 10) / 10;
      var gallonsPerRev = fr * hpr * 60;
      var inchesPerRev = Math.round(gallonsPerRev / (areaSqFt * 0.0623) * 100) / 100;
      var revsPerSeason = Math.round(sd * 24 / hpr * 10) / 10;
      var seasonGallons = Math.round(gallonsPerRev * revsPerSeason);
      var seasonCost = Math.round(sd * 24 * ec);
      return {
        primary: { label: "Coverage Area", value: formatNumber(areaAcres) + " acres" },
        details: [
          { label: "Inches Per Revolution", value: formatNumber(inchesPerRev) + " in" },
          { label: "Gallons Per Revolution", value: formatNumber(gallonsPerRev) },
          { label: "Revolutions Per Season", value: formatNumber(revsPerSeason) },
          { label: "Season Energy Cost", value: "$" + formatNumber(seasonCost) },
        ],
      };
  }`,
  [{ q: 'How much area does a center pivot cover?', a: 'A standard quarter-mile (1,320 ft) center pivot covers about 132 acres in a circular pattern within a 160-acre quarter section. Corner systems can increase coverage to 148 to 152 acres.' },
   { q: 'How much water does a center pivot apply?', a: 'A typical center pivot applies 0.5 to 1.5 inches of water per revolution. Application depth depends on flow rate, speed, and system length. Most pivots complete one revolution in 12 to 96 hours.' }],
  `Coverage = Pi x Pivot Length^2 / 43,560
Inches Per Rev = (GPM x Hours x 60) / (Area sq ft x 0.0623)
Season Cost = Days x 24 x Energy Cost/Hr`,
  ['irrigation-water-calculator', 'drip-irrigation-calculator']
);

add('grain-drying-cost-calculator', 'Grain Drying Cost Calculator',
  'Estimate the cost of drying grain based on initial and target moisture content, fuel type, and grain volume.',
  'Finance', 'finance', '$',
  ['grain drying cost', 'corn drying calculator', 'grain dryer fuel cost'],
  [
    '{ name: "bushels", label: "Bushels to Dry", type: "number", min: 100, max: 5000000, defaultValue: 50000 }',
    '{ name: "initialMoisture", label: "Initial Moisture (%)", type: "number", min: 14, max: 35, defaultValue: 22 }',
    '{ name: "targetMoisture", label: "Target Moisture (%)", type: "number", min: 10, max: 18, defaultValue: 15 }',
    '{ name: "fuelType", label: "Fuel Type", type: "select", options: [{ value: "1", label: "Propane" }, { value: "2", label: "Natural Gas" }], defaultValue: "1" }',
    '{ name: "fuelPrice", label: "Fuel Price ($/gallon or $/therm)", type: "number", min: 0.5, max: 10, defaultValue: 2.5 }',
  ],
  `(inputs) => {
      const bu = inputs.bushels as number;
      const im = inputs.initialMoisture as number;
      const tm = inputs.targetMoisture as number;
      const ft = inputs.fuelType as number;
      const fp = inputs.fuelPrice as number;
      if (!bu || !im || !tm || !fp || im <= tm) return null;
      var pointsToRemove = im - tm;
      var btuPerPointPerBu = ft == 1 ? 2200 : 2000;
      var totalBtu = bu * pointsToRemove * btuPerPointPerBu;
      var fuelUnits = ft == 1 ? Math.round(totalBtu / 91500) : Math.round(totalBtu / 100000);
      var fuelCost = Math.round(fuelUnits * fp * 100) / 100;
      var electricCost = Math.round(bu * pointsToRemove * 0.005 * 100) / 100;
      var totalCost = Math.round((fuelCost + electricCost) * 100) / 100;
      var costPerBu = Math.round(totalCost / bu * 1000) / 1000;
      var costPerPoint = Math.round(costPerBu / pointsToRemove * 1000) / 1000;
      var shrinkPct = Math.round(pointsToRemove * 1.183 * 100) / 100;
      return {
        primary: { label: "Total Drying Cost", value: "$" + formatNumber(totalCost) },
        details: [
          { label: "Cost Per Bushel", value: "$" + formatNumber(costPerBu) },
          { label: "Cost Per Point Removed", value: "$" + formatNumber(costPerPoint) + "/bu" },
          { label: "Fuel Cost", value: "$" + formatNumber(fuelCost) },
          { label: "Moisture Points Removed", value: formatNumber(pointsToRemove) },
          { label: "Shrink Factor", value: formatNumber(shrinkPct) + "%" },
        ],
      };
  }`,
  [{ q: 'How much does it cost to dry corn per bushel?', a: 'Drying corn typically costs $0.03 to $0.06 per bushel per point of moisture removed. Drying from 22% to 15% (7 points) costs roughly $0.21 to $0.42 per bushel depending on fuel prices.' },
   { q: 'What is grain shrink?', a: 'Shrink is the weight loss that occurs during drying. For every 1 point of moisture removed, approximately 1.183% of weight is lost. This reduces the number of marketable bushels.' }],
  `BTU Needed = Bushels x Points x BTU Per Point Per Bushel
Fuel Gallons = Total BTU / 91,500 (propane)
Shrink = Points Removed x 1.183%`,
  ['grain-storage-moisture-calculator', 'grain-bin-capacity-calculator']
);

add('farm-break-even-price-calculator', 'Farm Break-Even Price Calculator',
  'Calculate the minimum commodity price needed to cover all production costs and return a profit on your farm operation.',
  'Finance', 'finance', '$',
  ['break even price', 'farm breakeven calculator', 'cost of production calculator'],
  [
    '{ name: "totalAcres", label: "Total Planted Acres", type: "number", min: 1, max: 100000, defaultValue: 500 }',
    '{ name: "expectedYield", label: "Expected Yield (bushels/acre)", type: "number", min: 10, max: 500, defaultValue: 180 }',
    '{ name: "variableCost", label: "Variable Cost ($/acre)", type: "number", min: 50, max: 2000, defaultValue: 450 }',
    '{ name: "fixedCost", label: "Fixed Cost ($/acre)", type: "number", min: 50, max: 1000, defaultValue: 200 }',
    '{ name: "targetProfit", label: "Target Profit ($/acre)", type: "number", min: 0, max: 1000, defaultValue: 100 }',
  ],
  `(inputs) => {
      const ac = inputs.totalAcres as number;
      const ey = inputs.expectedYield as number;
      const vc = inputs.variableCost as number;
      const fc = inputs.fixedCost as number;
      const tp = inputs.targetProfit as number;
      if (!ac || !ey || !vc || !fc) return null;
      var totalCostPerAcre = vc + fc;
      var breakEvenPrice = Math.round(totalCostPerAcre / ey * 100) / 100;
      var targetPrice = Math.round((totalCostPerAcre + tp) / ey * 100) / 100;
      var totalCost = Math.round(totalCostPerAcre * ac);
      var totalBushels = ey * ac;
      var totalTargetRevenue = Math.round(targetPrice * totalBushels);
      return {
        primary: { label: "Break-Even Price", value: "$" + formatNumber(breakEvenPrice) + "/bu" },
        details: [
          { label: "Target Price (with profit)", value: "$" + formatNumber(targetPrice) + "/bu" },
          { label: "Total Cost Per Acre", value: "$" + formatNumber(totalCostPerAcre) },
          { label: "Total Production Cost", value: "$" + formatNumber(totalCost) },
          { label: "Total Bushels", value: formatNumber(totalBushels) },
          { label: "Revenue Needed at Target", value: "$" + formatNumber(totalTargetRevenue) },
        ],
      };
  }`,
  [{ q: 'What costs go into break-even calculations?', a: 'Variable costs include seed, fertilizer, chemicals, fuel, crop insurance, and drying. Fixed costs include land rent or mortgage payments, depreciation, insurance, and taxes. Both must be covered to break even.' },
   { q: 'How does yield affect break-even price?', a: 'Higher yields lower the break-even price because fixed costs are spread over more bushels. A 10% yield increase can reduce break-even price by roughly 9%, making yield management critical.' }],
  `Break-Even Price = (Variable Cost + Fixed Cost) / Expected Yield
Target Price = (Total Cost + Target Profit) / Yield
Total Cost = Cost Per Acre x Acres`,
  ['farm-profit-margin-calculator', 'crop-yield-calculator']
);

add('livestock-pregnancy-due-date-calculator', 'Livestock Pregnancy Due Date Calculator',
  'Calculate expected due dates for livestock breeding programs based on species-specific gestation periods and breeding date.',
  'Everyday', 'everyday', '~',
  ['livestock due date', 'gestation calculator', 'calving date calculator', 'lambing date'],
  [
    '{ name: "species", label: "Species", type: "select", options: [{ value: "1", label: "Cattle (283 days)" }, { value: "2", label: "Horse (340 days)" }, { value: "3", label: "Sheep (147 days)" }, { value: "4", label: "Goat (150 days)" }, { value: "5", label: "Swine (114 days)" }], defaultValue: "1" }',
    '{ name: "breedMonth", label: "Breeding Month (1-12)", type: "number", min: 1, max: 12, defaultValue: 4 }',
    '{ name: "breedDay", label: "Breeding Day", type: "number", min: 1, max: 31, defaultValue: 15 }',
    '{ name: "numBred", label: "Number Bred", type: "number", min: 1, max: 5000, defaultValue: 30 }',
    '{ name: "conceptionRate", label: "Conception Rate (%)", type: "number", min: 20, max: 100, defaultValue: 65 }',
  ],
  `(inputs) => {
      const sp = inputs.species as number;
      const bm = inputs.breedMonth as number;
      const bd = inputs.breedDay as number;
      const nb = inputs.numBred as number;
      const cr = inputs.conceptionRate as number;
      if (!bm || !bd || !nb || !cr) return null;
      var gestation = sp == 1 ? 283 : sp == 2 ? 340 : sp == 3 ? 147 : sp == 4 ? 150 : 114;
      var breedDate = new Date(2026, bm - 1, bd);
      var dueDate = new Date(breedDate.getTime() + gestation * 24 * 60 * 60 * 1000);
      var earlyDate = new Date(breedDate.getTime() + (gestation - 10) * 24 * 60 * 60 * 1000);
      var lateDate = new Date(breedDate.getTime() + (gestation + 10) * 24 * 60 * 60 * 1000);
      var months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
      var expectedPregnant = Math.round(nb * cr / 100);
      var dueDateStr = months[dueDate.getMonth()] + " " + dueDate.getDate() + ", " + dueDate.getFullYear();
      var earlyStr = months[earlyDate.getMonth()] + " " + earlyDate.getDate();
      var lateStr = months[lateDate.getMonth()] + " " + lateDate.getDate();
      return {
        primary: { label: "Expected Due Date", value: dueDateStr },
        details: [
          { label: "Gestation Period", value: formatNumber(gestation) + " days" },
          { label: "Due Window", value: earlyStr + " - " + lateStr },
          { label: "Expected Pregnant", value: formatNumber(expectedPregnant) },
          { label: "Breeding Date", value: months[bm - 1] + " " + bd },
        ],
      };
  }`,
  [{ q: 'How long is a cow pregnant?', a: 'The average gestation period for cattle is 283 days or about 9.3 months. Beef breeds tend to be slightly shorter (279-283 days) and dairy breeds slightly longer (279-287 days).' },
   { q: 'What is a good conception rate for cattle?', a: 'A good first-service conception rate for cattle AI breeding is 55 to 70 percent. Natural service bulls typically achieve 60 to 75 percent. Overall pregnancy rates for a breeding season should exceed 90 percent.' }],
  `Due Date = Breeding Date + Gestation Days
Due Window = Due Date +/- 10 days
Expected Pregnant = Number Bred x Conception Rate`,
  ['cattle-weight-gain-calculator', 'livestock-water-needs-calculator']
);
add(
  "legal-fee-estimator-calculator",
  "Legal Fee Estimator Calculator",
  "Estimate total legal fees based on case type, complexity, and attorney rate.",
  "Finance",
  "finance",
  "$",
  ["legal fee estimator", "lawyer cost", "attorney fees", "legal costs"],
  [
    '{ name: "caseType", label: "Case Type", type: "select", options: [{ value: "1", label: "Family Law" }, { value: "2", label: "Criminal Defense" }, { value: "3", label: "Personal Injury" }, { value: "4", label: "Business Litigation" }, { value: "5", label: "Estate Planning" }], defaultValue: "1" }',
    '{ name: "complexity", label: "Case Complexity", type: "select", options: [{ value: "1", label: "Simple" }, { value: "2", label: "Moderate" }, { value: "3", label: "Complex" }], defaultValue: "2" }',
    '{ name: "hourlyRate", label: "Attorney Hourly Rate ($)", type: "number", min: 50, max: 1500, defaultValue: 300 }',
    '{ name: "region", label: "Region Cost Factor", type: "select", options: [{ value: "1", label: "Rural" }, { value: "2", label: "Suburban" }, { value: "3", label: "Urban/Metro" }], defaultValue: "2" }'
  ],
  `(inputs) => {
    const caseType = inputs.caseType as string;
    const complexity = parseInt(inputs.complexity as string);
    const hourlyRate = inputs.hourlyRate as number;
    const region = parseInt(inputs.region as string);
    const baseHours: Record<string, number> = { "1": 25, "2": 40, "3": 30, "4": 60, "5": 15 };
    const caseNames: Record<string, string> = { "1": "Family Law", "2": "Criminal Defense", "3": "Personal Injury", "4": "Business Litigation", "5": "Estate Planning" };
    const complexityMult = [1, 1.5, 2.5][complexity - 1] || 1.5;
    const regionMult = [0.8, 1, 1.3][region - 1] || 1;
    const estHours = (baseHours[caseType] || 25) * complexityMult;
    const totalFee = estHours * hourlyRate * regionMult;
    const courtCosts = totalFee * 0.08;
    const grandTotal = totalFee + courtCosts;
    return {
      primary: { label: "Estimated Total Legal Fees", value: "$" + formatNumber(grandTotal) },
      details: [
        { label: "Case Type", value: caseNames[caseType] || "General" },
        { label: "Estimated Hours", value: formatNumber(estHours) },
        { label: "Attorney Fees", value: "$" + formatNumber(totalFee) },
        { label: "Estimated Court Costs", value: "$" + formatNumber(courtCosts) }
      ]
    };
  }`,
  [
    { q: "How much do lawyers charge per hour?", a: "Attorney rates typically range from $150 to $500+ per hour depending on experience, specialization, and location." },
    { q: "What factors affect legal fees?", a: "Case complexity, attorney experience, geographic region, case type, and whether the case goes to trial all affect total fees." },
    { q: "Are legal fees tax deductible?", a: "Some legal fees are deductible, such as those related to business operations, tax advice, or employment discrimination. Personal legal fees are generally not deductible." }
  ],
  "Total Fees = (Base Hours x Complexity Multiplier) x Hourly Rate x Region Factor + Court Costs",
  ["billable-hours-calculator", "legal-retainer-calculator", "attorney-hourly-rate-comparison-calculator"]
);

add(
  "billable-hours-calculator",
  "Billable Hours Calculator",
  "Calculate total billable amount based on hours worked, billing increment, and hourly rate.",
  "Finance",
  "finance",
  "$",
  ["billable hours", "attorney billing", "law firm billing", "time tracking"],
  [
    '{ name: "hoursWorked", label: "Hours Worked", type: "number", min: 0.1, max: 500, defaultValue: 8 }',
    '{ name: "billingIncrement", label: "Billing Increment (minutes)", type: "select", options: [{ value: "6", label: "6 min (1/10 hr)" }, { value: "10", label: "10 min (1/6 hr)" }, { value: "15", label: "15 min (1/4 hr)" }], defaultValue: "6" }',
    '{ name: "hourlyRate", label: "Hourly Rate ($)", type: "number", min: 50, max: 2000, defaultValue: 350 }',
    '{ name: "discountPct", label: "Client Discount (%)", type: "number", min: 0, max: 50, defaultValue: 0 }'
  ],
  `(inputs) => {
    const hoursWorked = inputs.hoursWorked as number;
    const billingIncrement = parseInt(inputs.billingIncrement as string);
    const hourlyRate = inputs.hourlyRate as number;
    const discountPct = inputs.discountPct as number;
    const incrementHour = billingIncrement / 60;
    const billedHours = Math.ceil(hoursWorked / incrementHour) * incrementHour;
    const grossAmount = billedHours * hourlyRate;
    const discount = grossAmount * (discountPct / 100);
    const netAmount = grossAmount - discount;
    return {
      primary: { label: "Net Billable Amount", value: "$" + formatNumber(netAmount) },
      details: [
        { label: "Actual Hours", value: formatNumber(hoursWorked) },
        { label: "Billed Hours (rounded up)", value: formatNumber(billedHours) },
        { label: "Gross Amount", value: "$" + formatNumber(grossAmount) },
        { label: "Discount", value: "$" + formatNumber(discount) }
      ]
    };
  }`,
  [
    { q: "What is the most common billing increment for lawyers?", a: "Most law firms use 6-minute increments (one-tenth of an hour), which is the industry standard." },
    { q: "What are billable hours?", a: "Billable hours are the time an attorney spends working directly on a client matter that can be charged to the client." },
    { q: "How many billable hours do lawyers work per year?", a: "Most law firms expect 1,800 to 2,200 billable hours per year, though this varies by firm size and practice area." }
  ],
  "Net Amount = (Rounded Billed Hours x Hourly Rate) x (1 - Discount%/100)",
  ["legal-fee-estimator-calculator", "legal-retainer-calculator", "attorney-hourly-rate-comparison-calculator"]
);

add(
  "court-filing-fee-calculator",
  "Court Filing Fee Calculator",
  "Estimate court filing fees based on case type, court level, and jurisdiction.",
  "Finance",
  "finance",
  "$",
  ["court filing fee", "court costs", "filing fees", "lawsuit cost"],
  [
    '{ name: "caseType", label: "Case Type", type: "select", options: [{ value: "1", label: "Small Claims" }, { value: "2", label: "Civil (under $25k)" }, { value: "3", label: "Civil ($25k-$100k)" }, { value: "4", label: "Civil (over $100k)" }, { value: "5", label: "Family/Divorce" }, { value: "6", label: "Criminal" }], defaultValue: "2" }',
    '{ name: "courtLevel", label: "Court Level", type: "select", options: [{ value: "1", label: "Municipal/Local" }, { value: "2", label: "State/Superior" }, { value: "3", label: "Federal District" }, { value: "4", label: "Appellate" }], defaultValue: "2" }',
    '{ name: "additionalMotions", label: "Additional Motions", type: "number", min: 0, max: 20, defaultValue: 0 }',
    '{ name: "eFilingDiscount", label: "E-Filing", type: "select", options: [{ value: "0", label: "Paper Filing" }, { value: "1", label: "E-Filing" }], defaultValue: "1" }'
  ],
  `(inputs) => {
    const caseType = parseInt(inputs.caseType as string);
    const courtLevel = parseInt(inputs.courtLevel as string);
    const additionalMotions = inputs.additionalMotions as number;
    const eFiling = parseInt(inputs.eFilingDiscount as string);
    const baseFees = [75, 200, 350, 500, 300, 150];
    const courtMultipliers = [0.8, 1, 1.5, 2];
    const baseFee = (baseFees[caseType - 1] || 200) * (courtMultipliers[courtLevel - 1] || 1);
    const motionFee = additionalMotions * 60;
    const subtotal = baseFee + motionFee;
    const eDiscount = eFiling === 1 ? subtotal * 0.1 : 0;
    const total = subtotal - eDiscount;
    return {
      primary: { label: "Estimated Filing Fees", value: "$" + formatNumber(total) },
      details: [
        { label: "Base Filing Fee", value: "$" + formatNumber(baseFee) },
        { label: "Motion Fees", value: "$" + formatNumber(motionFee) },
        { label: "E-Filing Savings", value: "$" + formatNumber(eDiscount) },
        { label: "Subtotal Before Discount", value: "$" + formatNumber(subtotal) }
      ]
    };
  }`,
  [
    { q: "How much does it cost to file a lawsuit?", a: "Filing fees vary widely from $30 for small claims to $400+ for federal civil cases depending on jurisdiction and case type." },
    { q: "Can court filing fees be waived?", a: "Yes, courts offer fee waivers (in forma pauperis) for individuals who cannot afford the fees, typically requiring proof of income." },
    { q: "Are filing fees refundable?", a: "Generally, court filing fees are non-refundable once the case has been filed, even if the case is dismissed or settled." }
  ],
  "Total Fees = (Base Fee x Court Multiplier) + (Motion Count x Motion Fee) - E-Filing Discount",
  ["legal-fee-estimator-calculator", "settlement-value-estimator-calculator", "case-timeline-estimator-calculator"]
);

add(
  "settlement-value-estimator-calculator",
  "Settlement Value Estimator Calculator",
  "Estimate potential settlement value for personal injury and civil cases.",
  "Finance",
  "finance",
  "$",
  ["settlement value", "case settlement", "personal injury settlement", "claim value"],
  [
    '{ name: "medicalExpenses", label: "Total Medical Expenses ($)", type: "number", min: 0, max: 5000000, defaultValue: 25000 }',
    '{ name: "lostWages", label: "Lost Wages ($)", type: "number", min: 0, max: 1000000, defaultValue: 10000 }',
    '{ name: "painMultiplier", label: "Injury Severity", type: "select", options: [{ value: "1.5", label: "Minor Injury" }, { value: "3", label: "Moderate Injury" }, { value: "5", label: "Severe Injury" }, { value: "7", label: "Life-Altering Injury" }], defaultValue: "3" }',
    '{ name: "liability", label: "Defendant Liability Strength", type: "select", options: [{ value: "0.5", label: "Weak (50%)" }, { value: "0.75", label: "Moderate (75%)" }, { value: "1", label: "Strong (100%)" }], defaultValue: "0.75" }'
  ],
  `(inputs) => {
    const medicalExpenses = inputs.medicalExpenses as number;
    const lostWages = inputs.lostWages as number;
    const painMultiplier = parseFloat(inputs.painMultiplier as string);
    const liability = parseFloat(inputs.liability as string);
    const painAndSuffering = medicalExpenses * painMultiplier;
    const totalDamages = medicalExpenses + lostWages + painAndSuffering;
    const adjustedValue = totalDamages * liability;
    const lowEstimate = adjustedValue * 0.75;
    const highEstimate = adjustedValue * 1.25;
    return {
      primary: { label: "Estimated Settlement Value", value: "$" + formatNumber(adjustedValue) },
      details: [
        { label: "Medical Expenses", value: "$" + formatNumber(medicalExpenses) },
        { label: "Lost Wages", value: "$" + formatNumber(lostWages) },
        { label: "Pain & Suffering", value: "$" + formatNumber(painAndSuffering) },
        { label: "Settlement Range", value: "$" + formatNumber(lowEstimate) + " - $" + formatNumber(highEstimate) }
      ]
    };
  }`,
  [
    { q: "How is settlement value calculated?", a: "Settlements typically consider medical expenses, lost wages, pain and suffering (often a multiplier of medical costs), and the strength of liability evidence." },
    { q: "What is the pain and suffering multiplier?", a: "The multiplier method multiplies medical expenses by 1.5 to 5 or more depending on injury severity to estimate non-economic damages." },
    { q: "How long does it take to settle a case?", a: "Most personal injury cases settle within 1 to 3 years, though complex cases can take longer." }
  ],
  "Settlement = (Medical + Lost Wages + Medical x Pain Multiplier) x Liability Factor",
  ["legal-fee-estimator-calculator", "contract-breach-damages-calculator", "legal-malpractice-damages-calculator"]
);

add(
  "child-support-guideline-calculator",
  "Child Support Guideline Calculator",
  "Estimate child support payments using income shares model guidelines.",
  "Finance",
  "finance",
  "$",
  ["child support", "child support calculator", "custody support", "parental support"],
  [
    '{ name: "payorIncome", label: "Payor Monthly Gross Income ($)", type: "number", min: 0, max: 100000, defaultValue: 6000 }',
    '{ name: "recipientIncome", label: "Recipient Monthly Gross Income ($)", type: "number", min: 0, max: 100000, defaultValue: 3000 }',
    '{ name: "children", label: "Number of Children", type: "number", min: 1, max: 10, defaultValue: 2 }',
    '{ name: "overnights", label: "Payor Overnights per Year", type: "number", min: 0, max: 365, defaultValue: 90 }',
    '{ name: "healthInsurance", label: "Monthly Health Insurance for Children ($)", type: "number", min: 0, max: 5000, defaultValue: 300 }'
  ],
  `(inputs) => {
    const payorIncome = inputs.payorIncome as number;
    const recipientIncome = inputs.recipientIncome as number;
    const children = inputs.children as number;
    const overnights = inputs.overnights as number;
    const healthInsurance = inputs.healthInsurance as number;
    const combinedIncome = payorIncome + recipientIncome;
    const childPctTable = [0.2, 0.3, 0.35, 0.38, 0.4];
    const childPct = childPctTable[Math.min(children, 5) - 1] || 0.2;
    const totalObligation = combinedIncome * childPct;
    const payorShare = combinedIncome > 0 ? payorIncome / combinedIncome : 0.5;
    const baseSupport = totalObligation * payorShare;
    const overnightCredit = overnights > 109 ? baseSupport * ((overnights - 109) / 365) * 0.5 : 0;
    const insuranceCredit = healthInsurance * payorShare;
    const monthlySupport = Math.max(baseSupport - overnightCredit - insuranceCredit, 0);
    return {
      primary: { label: "Estimated Monthly Child Support", value: "$" + formatNumber(monthlySupport) },
      details: [
        { label: "Combined Monthly Income", value: "$" + formatNumber(combinedIncome) },
        { label: "Total Child Obligation", value: "$" + formatNumber(totalObligation) },
        { label: "Payor Income Share", value: formatNumber(payorShare * 100) + "%" },
        { label: "Overnight Credit", value: "$" + formatNumber(overnightCredit) },
        { label: "Annual Support", value: "$" + formatNumber(monthlySupport * 12) }
      ]
    };
  }`,
  [
    { q: "How is child support calculated?", a: "Most states use the income shares model, which combines both parents incomes and determines each parent's proportional share of child-rearing costs." },
    { q: "Can child support be modified?", a: "Yes, child support can be modified when there is a material change in circumstances such as job loss, income change, or change in custody." },
    { q: "Does overnight custody affect child support?", a: "Yes, in many states the number of overnights the payor has reduces the support obligation, typically after exceeding a threshold like 110 nights." }
  ],
  "Monthly Support = (Combined Income x Child%) x Payor Share - Overnight Credit - Insurance Credit",
  ["alimony-estimator-calculator", "legal-fee-estimator-calculator", "settlement-value-estimator-calculator"]
);

add(
  "alimony-estimator-calculator",
  "Alimony Estimator Calculator",
  "Estimate spousal support payments based on income, marriage duration, and state guidelines.",
  "Finance",
  "finance",
  "$",
  ["alimony calculator", "spousal support", "maintenance calculator", "divorce alimony"],
  [
    '{ name: "payorIncome", label: "Payor Annual Gross Income ($)", type: "number", min: 0, max: 2000000, defaultValue: 120000 }',
    '{ name: "recipientIncome", label: "Recipient Annual Gross Income ($)", type: "number", min: 0, max: 2000000, defaultValue: 40000 }',
    '{ name: "marriageYears", label: "Years of Marriage", type: "number", min: 0, max: 60, defaultValue: 12 }',
    '{ name: "method", label: "Calculation Method", type: "select", options: [{ value: "1", label: "One-Third Rule" }, { value: "2", label: "40% Difference" }, { value: "3", label: "AAML Formula" }], defaultValue: "1" }'
  ],
  `(inputs) => {
    const payorIncome = inputs.payorIncome as number;
    const recipientIncome = inputs.recipientIncome as number;
    const marriageYears = inputs.marriageYears as number;
    const method = inputs.method as string;
    const methodNames: Record<string, string> = { "1": "One-Third Rule", "2": "40% Difference", "3": "AAML Formula" };
    let annualAlimony = 0;
    if (method === "1") {
      annualAlimony = (payorIncome - recipientIncome) / 3;
    } else if (method === "2") {
      annualAlimony = (payorIncome - recipientIncome) * 0.4;
    } else {
      annualAlimony = (payorIncome * 0.3) - (recipientIncome * 0.2);
    }
    annualAlimony = Math.max(annualAlimony, 0);
    const monthlyAlimony = annualAlimony / 12;
    const durationYears = Math.min(Math.round(marriageYears * 0.4), marriageYears);
    const totalAlimony = annualAlimony * durationYears;
    return {
      primary: { label: "Estimated Monthly Alimony", value: "$" + formatNumber(monthlyAlimony) },
      details: [
        { label: "Calculation Method", value: methodNames[method] || "One-Third Rule" },
        { label: "Annual Alimony", value: "$" + formatNumber(annualAlimony) },
        { label: "Estimated Duration", value: formatNumber(durationYears) + " years" },
        { label: "Total Over Duration", value: "$" + formatNumber(totalAlimony) }
      ]
    };
  }`,
  [
    { q: "How long does alimony last?", a: "Alimony duration varies by state and marriage length. A common guideline is 30 to 50 percent of the marriage duration for marriages over 10 years." },
    { q: "What is the difference between alimony and child support?", a: "Alimony supports the lower-earning spouse, while child support specifically covers the needs of children. They are calculated separately." },
    { q: "Can alimony be modified after divorce?", a: "Yes, alimony can often be modified if there is a substantial change in circumstances such as job loss or remarriage of the recipient." }
  ],
  "Monthly Alimony = (Payor Income - Recipient Income) x Method Factor / 12",
  ["child-support-guideline-calculator", "legal-fee-estimator-calculator", "settlement-value-estimator-calculator"]
);

add(
  "bail-bond-cost-calculator",
  "Bail Bond Cost Calculator",
  "Calculate bail bond premiums and total costs including fees.",
  "Finance",
  "finance",
  "$",
  ["bail bond cost", "bail amount", "bond premium", "bail calculator"],
  [
    '{ name: "bailAmount", label: "Bail Amount Set by Court ($)", type: "number", min: 100, max: 10000000, defaultValue: 50000 }',
    '{ name: "bondType", label: "Bond Type", type: "select", options: [{ value: "1", label: "Surety Bond (Bail Bondsman)" }, { value: "2", label: "Cash Bond (Full Amount)" }, { value: "3", label: "Property Bond" }], defaultValue: "1" }',
    '{ name: "premiumRate", label: "Bond Premium Rate (%)", type: "number", min: 5, max: 15, defaultValue: 10 }',
    '{ name: "collateral", label: "Collateral Value ($)", type: "number", min: 0, max: 10000000, defaultValue: 0 }'
  ],
  `(inputs) => {
    const bailAmount = inputs.bailAmount as number;
    const bondType = parseInt(inputs.bondType as string);
    const premiumRate = inputs.premiumRate as number;
    const collateral = inputs.collateral as number;
    const bondNames = ["", "Surety Bond", "Cash Bond", "Property Bond"];
    let outOfPocket = 0;
    let premium = 0;
    let additionalFees = 0;
    if (bondType === 1) {
      premium = bailAmount * (premiumRate / 100);
      additionalFees = 75;
      outOfPocket = premium + additionalFees;
    } else if (bondType === 2) {
      outOfPocket = bailAmount;
      premium = 0;
    } else {
      premium = 0;
      additionalFees = bailAmount * 0.02;
      outOfPocket = additionalFees;
    }
    const refundable = bondType === 2 ? bailAmount : collateral;
    return {
      primary: { label: "Total Out-of-Pocket Cost", value: "$" + formatNumber(outOfPocket) },
      details: [
        { label: "Bond Type", value: bondNames[bondType] || "Surety Bond" },
        { label: "Bail Amount", value: "$" + formatNumber(bailAmount) },
        { label: "Premium (Non-Refundable)", value: "$" + formatNumber(premium) },
        { label: "Additional Fees", value: "$" + formatNumber(additionalFees) },
        { label: "Refundable Upon Compliance", value: "$" + formatNumber(refundable) }
      ]
    };
  }`,
  [
    { q: "How much does a bail bond cost?", a: "A bail bond through a bondsman typically costs 10 percent of the bail amount as a non-refundable premium, though rates vary by state from 5 to 15 percent." },
    { q: "Do you get bail bond money back?", a: "The premium paid to a bail bondsman is non-refundable. However, cash bonds posted directly with the court are returned when the case concludes if the defendant appears at all hearings." },
    { q: "What is collateral for a bail bond?", a: "Collateral is property or assets pledged to secure a bail bond, such as real estate, vehicles, or jewelry. It is returned when the case is resolved." }
  ],
  "Surety Bond Cost = Bail Amount x Premium Rate + Administrative Fees",
  ["legal-fee-estimator-calculator", "court-filing-fee-calculator", "legal-retainer-calculator"]
);

add(
  "legal-retainer-calculator",
  "Legal Retainer Calculator",
  "Estimate how long a legal retainer will last based on expected hours and billing rate.",
  "Finance",
  "finance",
  "$",
  ["legal retainer", "retainer fee", "attorney retainer", "retainer estimate"],
  [
    '{ name: "retainerAmount", label: "Retainer Amount ($)", type: "number", min: 500, max: 500000, defaultValue: 5000 }',
    '{ name: "hourlyRate", label: "Hourly Rate ($)", type: "number", min: 50, max: 2000, defaultValue: 300 }',
    '{ name: "monthlyHours", label: "Estimated Monthly Hours Needed", type: "number", min: 1, max: 200, defaultValue: 10 }',
    '{ name: "paraRate", label: "Paralegal Hourly Rate ($)", type: "number", min: 0, max: 500, defaultValue: 100 }',
    '{ name: "paraHours", label: "Paralegal Monthly Hours", type: "number", min: 0, max: 100, defaultValue: 5 }'
  ],
  `(inputs) => {
    const retainerAmount = inputs.retainerAmount as number;
    const hourlyRate = inputs.hourlyRate as number;
    const monthlyHours = inputs.monthlyHours as number;
    const paraRate = inputs.paraRate as number;
    const paraHours = inputs.paraHours as number;
    const monthlyAttorneyCost = monthlyHours * hourlyRate;
    const monthlyParaCost = paraHours * paraRate;
    const monthlyCost = monthlyAttorneyCost + monthlyParaCost;
    const monthsLasting = monthlyCost > 0 ? retainerAmount / monthlyCost : 0;
    const totalHoursAvailable = hourlyRate > 0 ? retainerAmount / hourlyRate : 0;
    return {
      primary: { label: "Retainer Lasts Approximately", value: formatNumber(monthsLasting) + " months" },
      details: [
        { label: "Monthly Attorney Cost", value: "$" + formatNumber(monthlyAttorneyCost) },
        { label: "Monthly Paralegal Cost", value: "$" + formatNumber(monthlyParaCost) },
        { label: "Total Monthly Burn Rate", value: "$" + formatNumber(monthlyCost) },
        { label: "Attorney Hours Available", value: formatNumber(totalHoursAvailable) + " hrs" }
      ]
    };
  }`,
  [
    { q: "What is a legal retainer?", a: "A retainer is an upfront fee paid to an attorney to secure their services. The attorney bills against the retainer as work is performed." },
    { q: "Is a retainer fee refundable?", a: "If the retainer is not fully used, most states require attorneys to refund the unused portion. Earned retainers are non-refundable." },
    { q: "How much is a typical retainer?", a: "Retainers vary widely from $2,000 to $25,000 or more depending on case type, complexity, and the attorney's experience." }
  ],
  "Months Lasting = Retainer Amount / (Attorney Hours x Rate + Paralegal Hours x Rate)",
  ["billable-hours-calculator", "legal-fee-estimator-calculator", "attorney-hourly-rate-comparison-calculator"]
);

add(
  "probate-cost-estimator-calculator",
  "Probate Cost Estimator Calculator",
  "Estimate total probate costs including court fees, attorney fees, and executor compensation.",
  "Finance",
  "finance",
  "$",
  ["probate cost", "estate probate", "probate fees", "estate administration cost"],
  [
    '{ name: "estateValue", label: "Gross Estate Value ($)", type: "number", min: 0, max: 100000000, defaultValue: 500000 }',
    '{ name: "state", label: "Fee Structure", type: "select", options: [{ value: "1", label: "Statutory (% of Estate)" }, { value: "2", label: "Reasonable Fee" }, { value: "3", label: "Flat Fee" }], defaultValue: "1" }',
    '{ name: "isContested", label: "Contested Estate?", type: "select", options: [{ value: "0", label: "No" }, { value: "1", label: "Yes" }], defaultValue: "0" }',
    '{ name: "realProperty", label: "Number of Real Properties", type: "number", min: 0, max: 20, defaultValue: 1 }'
  ],
  `(inputs) => {
    const estateValue = inputs.estateValue as number;
    const state = inputs.state as string;
    const isContested = parseInt(inputs.isContested as string);
    const realProperty = inputs.realProperty as number;
    let attorneyFee = 0;
    if (state === "1") {
      if (estateValue <= 100000) attorneyFee = estateValue * 0.04;
      else if (estateValue <= 1000000) attorneyFee = 4000 + (estateValue - 100000) * 0.03;
      else attorneyFee = 31000 + (estateValue - 1000000) * 0.02;
    } else if (state === "2") {
      attorneyFee = estateValue * 0.025;
    } else {
      attorneyFee = Math.max(estateValue * 0.015, 3000);
    }
    const executorFee = attorneyFee * 0.8;
    const courtFees = 500 + (realProperty * 200);
    const contestedExtra = isContested === 1 ? attorneyFee * 0.5 : 0;
    const totalCost = attorneyFee + executorFee + courtFees + contestedExtra;
    return {
      primary: { label: "Estimated Total Probate Cost", value: "$" + formatNumber(totalCost) },
      details: [
        { label: "Attorney Fees", value: "$" + formatNumber(attorneyFee) },
        { label: "Executor Compensation", value: "$" + formatNumber(executorFee) },
        { label: "Court Filing Fees", value: "$" + formatNumber(courtFees) },
        { label: "Contested Litigation Extra", value: "$" + formatNumber(contestedExtra) },
        { label: "Probate Cost as % of Estate", value: formatNumber(estateValue > 0 ? (totalCost / estateValue) * 100 : 0) + "%" }
      ]
    };
  }`,
  [
    { q: "How much does probate cost?", a: "Probate typically costs 3 to 7 percent of the estate value, including attorney fees, executor compensation, court fees, and other administrative costs." },
    { q: "How long does probate take?", a: "Simple probate cases take 6 to 12 months. Complex or contested estates can take 2 to 5 years or more." },
    { q: "Can you avoid probate?", a: "Yes, through living trusts, joint ownership, beneficiary designations, and transfer-on-death accounts. Estate planning can significantly reduce or eliminate probate." }
  ],
  "Total Probate Cost = Attorney Fee + Executor Fee + Court Fees + Contested Extra",
  ["legal-fee-estimator-calculator", "settlement-value-estimator-calculator", "legal-retainer-calculator"]
);

add(
  "attorney-hourly-rate-comparison-calculator",
  "Attorney Hourly Rate Comparison Calculator",
  "Compare attorney costs by experience level, practice area, and geographic region.",
  "Finance",
  "finance",
  "$",
  ["attorney rates", "lawyer hourly rate", "attorney cost comparison", "legal rate comparison"],
  [
    '{ name: "practiceArea", label: "Practice Area", type: "select", options: [{ value: "1", label: "General Practice" }, { value: "2", label: "Family Law" }, { value: "3", label: "Criminal Defense" }, { value: "4", label: "Corporate/Business" }, { value: "5", label: "Intellectual Property" }, { value: "6", label: "Real Estate" }], defaultValue: "1" }',
    '{ name: "experience", label: "Experience Level", type: "select", options: [{ value: "1", label: "Junior (1-3 years)" }, { value: "2", label: "Mid-Level (4-9 years)" }, { value: "3", label: "Senior (10-19 years)" }, { value: "4", label: "Partner (20+ years)" }], defaultValue: "2" }',
    '{ name: "region", label: "Region", type: "select", options: [{ value: "1", label: "Rural" }, { value: "2", label: "Suburban" }, { value: "3", label: "Mid-Size City" }, { value: "4", label: "Major Metro" }], defaultValue: "3" }',
    '{ name: "hoursNeeded", label: "Estimated Hours Needed", type: "number", min: 1, max: 1000, defaultValue: 20 }'
  ],
  `(inputs) => {
    const practiceArea = parseInt(inputs.practiceArea as string);
    const experience = parseInt(inputs.experience as string);
    const region = parseInt(inputs.region as string);
    const hoursNeeded = inputs.hoursNeeded as number;
    const areaNames = ["", "General Practice", "Family Law", "Criminal Defense", "Corporate/Business", "Intellectual Property", "Real Estate"];
    const baseRates = [0, 200, 250, 275, 350, 400, 225];
    const expMultipliers = [0, 0.7, 1, 1.4, 1.9];
    const regionMultipliers = [0, 0.75, 0.9, 1.1, 1.45];
    const rate = (baseRates[practiceArea] || 200) * (expMultipliers[experience] || 1) * (regionMultipliers[region] || 1);
    const totalCost = rate * hoursNeeded;
    const paraRate = rate * 0.35;
    const paraTotalCost = paraRate * hoursNeeded;
    return {
      primary: { label: "Estimated Hourly Rate", value: "$" + formatNumber(rate) },
      details: [
        { label: "Practice Area", value: areaNames[practiceArea] || "General" },
        { label: "Total Cost for " + hoursNeeded + " Hours", value: "$" + formatNumber(totalCost) },
        { label: "Comparable Paralegal Rate", value: "$" + formatNumber(paraRate) },
        { label: "Paralegal Cost for Same Hours", value: "$" + formatNumber(paraTotalCost) }
      ]
    };
  }`,
  [
    { q: "What is the average hourly rate for a lawyer?", a: "The national average is approximately $250 to $350 per hour, but rates range from $150 in rural areas to $1,000+ for top partners in major cities." },
    { q: "Why do IP lawyers charge more?", a: "Intellectual property attorneys often have specialized technical degrees in addition to law degrees, and the subject matter requires highly specialized knowledge." },
    { q: "Should I hire a cheaper lawyer to save money?", a: "Not necessarily. An experienced attorney may resolve your case faster and more effectively, potentially costing less overall than a cheaper but less efficient attorney." }
  ],
  "Hourly Rate = Base Rate x Experience Multiplier x Region Multiplier",
  ["legal-fee-estimator-calculator", "billable-hours-calculator", "legal-retainer-calculator"]
);

add(
  "case-timeline-estimator-calculator",
  "Case Timeline Estimator Calculator",
  "Estimate how long a legal case will take from filing to resolution.",
  "Everyday",
  "everyday",
  "~",
  ["case timeline", "lawsuit duration", "case length", "legal case timeline"],
  [
    '{ name: "caseType", label: "Case Type", type: "select", options: [{ value: "1", label: "Small Claims" }, { value: "2", label: "Personal Injury" }, { value: "3", label: "Divorce/Family" }, { value: "4", label: "Contract Dispute" }, { value: "5", label: "Criminal" }, { value: "6", label: "Medical Malpractice" }], defaultValue: "2" }',
    '{ name: "complexity", label: "Case Complexity", type: "select", options: [{ value: "1", label: "Simple" }, { value: "2", label: "Moderate" }, { value: "3", label: "Complex" }], defaultValue: "2" }',
    '{ name: "goToTrial", label: "Likely Outcome", type: "select", options: [{ value: "1", label: "Settlement" }, { value: "2", label: "Mediation" }, { value: "3", label: "Trial" }], defaultValue: "1" }',
    '{ name: "courtBacklog", label: "Court Backlog", type: "select", options: [{ value: "1", label: "Light" }, { value: "2", label: "Moderate" }, { value: "3", label: "Heavy" }], defaultValue: "2" }'
  ],
  `(inputs) => {
    const caseType = parseInt(inputs.caseType as string);
    const complexity = parseInt(inputs.complexity as string);
    const goToTrial = parseInt(inputs.goToTrial as string);
    const courtBacklog = parseInt(inputs.courtBacklog as string);
    const caseNames = ["", "Small Claims", "Personal Injury", "Divorce/Family", "Contract Dispute", "Criminal", "Medical Malpractice"];
    const baseMonths = [0, 3, 12, 8, 10, 6, 18];
    const complexMultiplier = [1, 1.5, 2.5][complexity - 1] || 1.5;
    const trialMultiplier = [0.6, 0.8, 1.5][goToTrial - 1] || 1;
    const backlogMultiplier = [0.8, 1, 1.4][courtBacklog - 1] || 1;
    const totalMonths = Math.round((baseMonths[caseType] || 10) * complexMultiplier * trialMultiplier * backlogMultiplier);
    const discoveryPhase = Math.round(totalMonths * 0.4);
    const pretrial = Math.round(totalMonths * 0.25);
    const resolution = totalMonths - discoveryPhase - pretrial;
    return {
      primary: { label: "Estimated Case Duration", value: formatNumber(totalMonths) + " months" },
      details: [
        { label: "Case Type", value: caseNames[caseType] || "General" },
        { label: "Discovery Phase", value: formatNumber(discoveryPhase) + " months" },
        { label: "Pre-Trial Phase", value: formatNumber(pretrial) + " months" },
        { label: "Resolution Phase", value: formatNumber(resolution) + " months" }
      ]
    };
  }`,
  [
    { q: "How long does a typical lawsuit take?", a: "Most civil lawsuits take 12 to 24 months. Simple cases may resolve in 3 to 6 months, while complex litigation can take 3 to 5 years." },
    { q: "What is the discovery phase?", a: "Discovery is the pre-trial phase where both sides exchange evidence, take depositions, and gather information. It typically takes the longest portion of a case." },
    { q: "Does settling save time?", a: "Yes, settlements typically resolve cases 40 to 60 percent faster than going to trial, and avoid the uncertainty of a jury verdict." }
  ],
  "Duration = Base Months x Complexity x Trial Factor x Court Backlog Factor",
  ["court-filing-fee-calculator", "legal-fee-estimator-calculator", "settlement-value-estimator-calculator"]
);

add(
  "legal-malpractice-damages-calculator",
  "Legal Malpractice Damages Calculator",
  "Estimate potential damages in a legal malpractice claim.",
  "Finance",
  "finance",
  "$",
  ["legal malpractice", "attorney malpractice", "malpractice damages", "legal negligence"],
  [
    '{ name: "originalCaseValue", label: "Original Case Value Lost ($)", type: "number", min: 0, max: 50000000, defaultValue: 100000 }',
    '{ name: "legalFeesLost", label: "Legal Fees Paid to Negligent Attorney ($)", type: "number", min: 0, max: 1000000, defaultValue: 15000 }',
    '{ name: "additionalCosts", label: "Additional Costs Incurred ($)", type: "number", min: 0, max: 1000000, defaultValue: 5000 }',
    '{ name: "provability", label: "Case Provability", type: "select", options: [{ value: "0.3", label: "Difficult (30%)" }, { value: "0.5", label: "Moderate (50%)" }, { value: "0.7", label: "Strong (70%)" }, { value: "0.9", label: "Very Strong (90%)" }], defaultValue: "0.5" }'
  ],
  `(inputs) => {
    const originalCaseValue = inputs.originalCaseValue as number;
    const legalFeesLost = inputs.legalFeesLost as number;
    const additionalCosts = inputs.additionalCosts as number;
    const provability = parseFloat(inputs.provability as string);
    const totalDamages = originalCaseValue + legalFeesLost + additionalCosts;
    const adjustedDamages = totalDamages * provability;
    const lowRange = adjustedDamages * 0.7;
    const highRange = adjustedDamages * 1.3;
    const malpracticeLegalFees = adjustedDamages * 0.33;
    const netRecovery = adjustedDamages - malpracticeLegalFees;
    return {
      primary: { label: "Estimated Adjusted Damages", value: "$" + formatNumber(adjustedDamages) },
      details: [
        { label: "Total Raw Damages", value: "$" + formatNumber(totalDamages) },
        { label: "Provability Adjustment", value: formatNumber(provability * 100) + "%" },
        { label: "Estimated Range", value: "$" + formatNumber(lowRange) + " - $" + formatNumber(highRange) },
        { label: "Contingency Fee (33%)", value: "$" + formatNumber(malpracticeLegalFees) },
        { label: "Estimated Net Recovery", value: "$" + formatNumber(netRecovery) }
      ]
    };
  }`,
  [
    { q: "What is legal malpractice?", a: "Legal malpractice occurs when an attorney fails to meet the standard of care, causing measurable harm to the client, such as missing deadlines, conflicts of interest, or negligent case handling." },
    { q: "How hard is it to prove legal malpractice?", a: "You must prove the case within a case: that the attorney was negligent AND that you would have won the underlying case but for their negligence." },
    { q: "What is the statute of limitations for legal malpractice?", a: "It varies by state, typically 1 to 6 years from when the malpractice was discovered or should have been discovered." }
  ],
  "Adjusted Damages = (Case Value Lost + Fees Lost + Additional Costs) x Provability Factor",
  ["settlement-value-estimator-calculator", "contract-breach-damages-calculator", "legal-fee-estimator-calculator"]
);

add(
  "contract-breach-damages-calculator",
  "Contract Breach Damages Calculator",
  "Calculate potential damages for breach of contract claims.",
  "Finance",
  "finance",
  "$",
  ["breach of contract", "contract damages", "breach damages", "contract litigation"],
  [
    '{ name: "contractValue", label: "Total Contract Value ($)", type: "number", min: 0, max: 100000000, defaultValue: 250000 }',
    '{ name: "performedValue", label: "Value of Performance Completed ($)", type: "number", min: 0, max: 100000000, defaultValue: 100000 }',
    '{ name: "mitigatedAmount", label: "Amount Mitigated (Replacement Costs Saved) ($)", type: "number", min: 0, max: 100000000, defaultValue: 20000 }',
    '{ name: "consequentialDamages", label: "Consequential/Incidental Damages ($)", type: "number", min: 0, max: 50000000, defaultValue: 15000 }',
    '{ name: "damageType", label: "Damage Measure", type: "select", options: [{ value: "1", label: "Expectation Damages" }, { value: "2", label: "Reliance Damages" }, { value: "3", label: "Restitution Damages" }], defaultValue: "1" }'
  ],
  `(inputs) => {
    const contractValue = inputs.contractValue as number;
    const performedValue = inputs.performedValue as number;
    const mitigatedAmount = inputs.mitigatedAmount as number;
    const consequentialDamages = inputs.consequentialDamages as number;
    const damageType = inputs.damageType as string;
    const typeNames: Record<string, string> = { "1": "Expectation Damages", "2": "Reliance Damages", "3": "Restitution Damages" };
    let directDamages = 0;
    if (damageType === "1") {
      directDamages = contractValue - performedValue;
    } else if (damageType === "2") {
      directDamages = performedValue;
    } else {
      directDamages = performedValue * 0.8;
    }
    const totalBeforeMitigation = directDamages + consequentialDamages;
    const totalDamages = Math.max(totalBeforeMitigation - mitigatedAmount, 0);
    return {
      primary: { label: "Estimated Total Damages", value: "$" + formatNumber(totalDamages) },
      details: [
        { label: "Damage Measure", value: typeNames[damageType] || "Expectation" },
        { label: "Direct Damages", value: "$" + formatNumber(directDamages) },
        { label: "Consequential Damages", value: "$" + formatNumber(consequentialDamages) },
        { label: "Mitigation Credit", value: "$" + formatNumber(mitigatedAmount) }
      ]
    };
  }`,
  [
    { q: "What are expectation damages?", a: "Expectation damages put the non-breaching party in the position they would have been in had the contract been fully performed, covering the benefit of the bargain." },
    { q: "What is the duty to mitigate?", a: "The injured party must take reasonable steps to minimize their damages. Failure to mitigate can reduce the recoverable amount." },
    { q: "Are punitive damages available for breach of contract?", a: "Generally no. Punitive damages are rarely awarded for breach of contract unless the breach also involves fraud or other tortious conduct." }
  ],
  "Damages = (Contract Value - Performed Value) + Consequential - Mitigated Amount",
  ["settlement-value-estimator-calculator", "legal-malpractice-damages-calculator", "legal-fee-estimator-calculator"]
);

add(
  "intellectual-property-value-calculator",
  "Intellectual Property Value Calculator",
  "Estimate the value of intellectual property including patents, trademarks, and copyrights.",
  "Finance",
  "finance",
  "$",
  ["IP valuation", "intellectual property value", "patent value", "trademark value"],
  [
    '{ name: "ipType", label: "IP Type", type: "select", options: [{ value: "1", label: "Patent" }, { value: "2", label: "Trademark" }, { value: "3", label: "Copyright" }, { value: "4", label: "Trade Secret" }], defaultValue: "1" }',
    '{ name: "annualRevenue", label: "Annual Revenue from IP ($)", type: "number", min: 0, max: 100000000, defaultValue: 500000 }',
    '{ name: "remainingLife", label: "Remaining Useful Life (years)", type: "number", min: 1, max: 70, defaultValue: 10 }',
    '{ name: "growthRate", label: "Annual Growth Rate (%)", type: "number", min: -20, max: 50, defaultValue: 5 }',
    '{ name: "discountRate", label: "Discount Rate (%)", type: "number", min: 1, max: 30, defaultValue: 12 }'
  ],
  `(inputs) => {
    const ipType = inputs.ipType as string;
    const annualRevenue = inputs.annualRevenue as number;
    const remainingLife = inputs.remainingLife as number;
    const growthRate = inputs.growthRate as number;
    const discountRate = inputs.discountRate as number;
    const ipNames: Record<string, string> = { "1": "Patent", "2": "Trademark", "3": "Copyright", "4": "Trade Secret" };
    let totalValue = 0;
    for (let i = 1; i <= remainingLife; i++) {
      const futureRevenue = annualRevenue * Math.pow(1 + growthRate / 100, i);
      totalValue += futureRevenue / Math.pow(1 + discountRate / 100, i);
    }
    const royaltyRates: Record<string, number> = { "1": 0.05, "2": 0.03, "3": 0.04, "4": 0.06 };
    const royaltyValue = totalValue * (royaltyRates[ipType] || 0.05) * 10;
    return {
      primary: { label: "Estimated IP Value (Income Method)", value: "$" + formatNumber(totalValue) },
      details: [
        { label: "IP Type", value: ipNames[ipType] || "Patent" },
        { label: "First Year Revenue", value: "$" + formatNumber(annualRevenue) },
        { label: "Remaining Life", value: formatNumber(remainingLife) + " years" },
        { label: "Relief from Royalty Value", value: "$" + formatNumber(royaltyValue) }
      ]
    };
  }`,
  [
    { q: "How is intellectual property valued?", a: "IP is commonly valued using three approaches: the income method (discounted future cash flows), the market method (comparable transactions), and the cost method (cost to recreate)." },
    { q: "How long does a patent last?", a: "Utility patents last 20 years from the filing date. Design patents last 15 years from the grant date. Maintenance fees are required to keep utility patents in force." },
    { q: "What affects IP value?", a: "Key factors include remaining life, revenue generated, market exclusivity, enforceability, breadth of protection, and competitive landscape." }
  ],
  "IP Value = Sum of [Annual Revenue x (1 + Growth)^n / (1 + Discount)^n] for each year",
  ["trademark-registration-cost-calculator", "patent-filing-cost-calculator", "copyright-registration-cost-calculator"]
);

add(
  "trademark-registration-cost-calculator",
  "Trademark Registration Cost Calculator",
  "Estimate total costs for trademark registration including filing and attorney fees.",
  "Finance",
  "finance",
  "$",
  ["trademark registration", "trademark filing", "trademark cost", "brand registration"],
  [
    '{ name: "classes", label: "Number of Classes", type: "number", min: 1, max: 45, defaultValue: 1 }',
    '{ name: "filingBasis", label: "Filing Basis", type: "select", options: [{ value: "1", label: "TEAS Plus ($250/class)" }, { value: "2", label: "TEAS Standard ($350/class)" }], defaultValue: "1" }',
    '{ name: "useAttorney", label: "Attorney Assistance", type: "select", options: [{ value: "0", label: "Self-Filing" }, { value: "1", label: "Attorney ($1,000-$2,000)" }], defaultValue: "1" }',
    '{ name: "searchType", label: "Trademark Search", type: "select", options: [{ value: "0", label: "No Search" }, { value: "1", label: "Basic Search ($100)" }, { value: "2", label: "Comprehensive Search ($500)" }], defaultValue: "1" }'
  ],
  `(inputs) => {
    const classes = inputs.classes as number;
    const filingBasis = parseInt(inputs.filingBasis as string);
    const useAttorney = parseInt(inputs.useAttorney as string);
    const searchType = parseInt(inputs.searchType as string);
    const filingFee = filingBasis === 1 ? 250 * classes : 350 * classes;
    const attorneyFee = useAttorney === 1 ? 1500 : 0;
    const searchFees = [0, 100, 500][searchType] || 0;
    const maintenanceFee = 225 * classes;
    const totalInitial = filingFee + attorneyFee + searchFees;
    return {
      primary: { label: "Total Initial Registration Cost", value: "$" + formatNumber(totalInitial) },
      details: [
        { label: "USPTO Filing Fee", value: "$" + formatNumber(filingFee) },
        { label: "Attorney Fee", value: "$" + formatNumber(attorneyFee) },
        { label: "Search Fee", value: "$" + formatNumber(searchFees) },
        { label: "Maintenance (Year 5-6)", value: "$" + formatNumber(maintenanceFee) + " per class" }
      ]
    };
  }`,
  [
    { q: "How much does it cost to register a trademark?", a: "Federal trademark registration costs $250 to $350 per class for filing fees, plus optional attorney fees of $1,000 to $2,000 or more." },
    { q: "How long does trademark registration take?", a: "The USPTO process typically takes 8 to 12 months if there are no issues, and longer if an office action or opposition is filed." },
    { q: "Do I need a lawyer to file a trademark?", a: "While not required for US applicants, an attorney can help avoid costly mistakes, respond to office actions, and ensure comprehensive protection." }
  ],
  "Total Cost = (Filing Fee x Classes) + Attorney Fee + Search Fee",
  ["patent-filing-cost-calculator", "copyright-registration-cost-calculator", "intellectual-property-value-calculator"]
);

add(
  "patent-filing-cost-calculator",
  "Patent Filing Cost Calculator",
  "Estimate patent filing costs including USPTO fees, attorney fees, and maintenance.",
  "Finance",
  "finance",
  "$",
  ["patent filing cost", "patent application", "USPTO fees", "patent attorney cost"],
  [
    '{ name: "patentType", label: "Patent Type", type: "select", options: [{ value: "1", label: "Utility Patent" }, { value: "2", label: "Design Patent" }, { value: "3", label: "Provisional Application" }], defaultValue: "1" }',
    '{ name: "entitySize", label: "Entity Size", type: "select", options: [{ value: "1", label: "Micro Entity" }, { value: "2", label: "Small Entity" }, { value: "3", label: "Large Entity" }], defaultValue: "2" }',
    '{ name: "complexity", label: "Invention Complexity", type: "select", options: [{ value: "1", label: "Simple" }, { value: "2", label: "Moderate" }, { value: "3", label: "Complex" }], defaultValue: "2" }',
    '{ name: "claims", label: "Number of Claims", type: "number", min: 1, max: 100, defaultValue: 20 }'
  ],
  `(inputs) => {
    const patentType = parseInt(inputs.patentType as string);
    const entitySize = parseInt(inputs.entitySize as string);
    const complexity = parseInt(inputs.complexity as string);
    const claims = inputs.claims as number;
    const typeNames = ["", "Utility Patent", "Design Patent", "Provisional Application"];
    const baseFiling = [0, 1600, 1000, 320][patentType] || 1600;
    const entityDiscount = [0, 0.25, 0.5, 1][entitySize] || 0.5;
    const filingFee = baseFiling * entityDiscount;
    const excessClaims = Math.max(claims - 20, 0);
    const claimFee = excessClaims * 80 * entityDiscount;
    const attorneyBase = [0, 8000, 3000, 2000][patentType] || 8000;
    const complexityMult = [1, 1.5, 2.5][complexity - 1] || 1.5;
    const attorneyFee = attorneyBase * complexityMult;
    const drawingFee = patentType === 2 ? 800 : 500;
    const searchFee = [0, 700, 500, 0][patentType] * entityDiscount;
    const totalCost = filingFee + claimFee + attorneyFee + drawingFee + searchFee;
    return {
      primary: { label: "Estimated Total Patent Cost", value: "$" + formatNumber(totalCost) },
      details: [
        { label: "Patent Type", value: typeNames[patentType] || "Utility" },
        { label: "USPTO Filing Fee", value: "$" + formatNumber(filingFee) },
        { label: "Excess Claims Fee", value: "$" + formatNumber(claimFee) },
        { label: "Attorney Fee", value: "$" + formatNumber(attorneyFee) },
        { label: "Drawings & Search", value: "$" + formatNumber(drawingFee + searchFee) }
      ]
    };
  }`,
  [
    { q: "How much does a patent cost?", a: "A utility patent typically costs $8,000 to $25,000+ including USPTO fees and attorney costs. Provisional patents are much cheaper at $2,000 to $5,000." },
    { q: "What is the difference between a provisional and nonprovisional patent?", a: "A provisional patent provides a 12-month placeholder filing date at lower cost but does not itself become a patent. A nonprovisional is the full application examined by the USPTO." },
    { q: "How long does it take to get a patent?", a: "The average time from filing to grant is 2 to 3 years for utility patents. Design patents typically take 12 to 18 months." }
  ],
  "Total Cost = Filing Fee + Claims Fee + Attorney Fee + Drawings + Search",
  ["trademark-registration-cost-calculator", "copyright-registration-cost-calculator", "intellectual-property-value-calculator"]
);

add(
  "copyright-registration-cost-calculator",
  "Copyright Registration Cost Calculator",
  "Calculate copyright registration costs with the US Copyright Office.",
  "Finance",
  "finance",
  "$",
  ["copyright registration", "copyright filing", "copyright cost", "USCO fee"],
  [
    '{ name: "workType", label: "Type of Work", type: "select", options: [{ value: "1", label: "Single Work - Single Author" }, { value: "2", label: "Single Work - Multiple Authors" }, { value: "3", label: "Collection/Group" }, { value: "4", label: "Sound Recording" }], defaultValue: "1" }',
    '{ name: "filingMethod", label: "Filing Method", type: "select", options: [{ value: "1", label: "Online (Standard)" }, { value: "2", label: "Paper Filing" }], defaultValue: "1" }',
    '{ name: "works", label: "Number of Registrations", type: "number", min: 1, max: 50, defaultValue: 1 }',
    '{ name: "expedited", label: "Expedited Processing", type: "select", options: [{ value: "0", label: "Standard (3-6 months)" }, { value: "1", label: "Expedited ($800 extra)" }], defaultValue: "0" }'
  ],
  `(inputs) => {
    const workType = parseInt(inputs.workType as string);
    const filingMethod = parseInt(inputs.filingMethod as string);
    const works = inputs.works as number;
    const expedited = parseInt(inputs.expedited as string);
    const typeNames = ["", "Single Work - Single Author", "Single Work - Multiple Authors", "Collection/Group", "Sound Recording"];
    const baseFees = [0, 45, 65, 65, 65];
    const paperSurcharge = filingMethod === 2 ? 40 : 0;
    const perRegistration = (baseFees[workType] || 65) + paperSurcharge;
    const totalFiling = perRegistration * works;
    const expeditedFee = expedited === 1 ? 800 * works : 0;
    const totalCost = totalFiling + expeditedFee;
    return {
      primary: { label: "Total Copyright Registration Cost", value: "$" + formatNumber(totalCost) },
      details: [
        { label: "Work Type", value: typeNames[workType] || "Standard" },
        { label: "Fee Per Registration", value: "$" + formatNumber(perRegistration) },
        { label: "Number of Registrations", value: formatNumber(works) },
        { label: "Expedited Fee", value: "$" + formatNumber(expeditedFee) }
      ]
    };
  }`,
  [
    { q: "How much does copyright registration cost?", a: "Online registration with the US Copyright Office costs $45 for a single work by one author and $65 for other works. Paper filing adds approximately $40." },
    { q: "Is copyright registration required?", a: "No, copyright exists automatically upon creation. However, registration is required to sue for infringement and enables statutory damages and attorney fee recovery." },
    { q: "How long does copyright registration take?", a: "Standard processing takes 3 to 6 months for online filings. Expedited processing (Special Handling) costs $800 and takes 5 to 10 business days." }
  ],
  "Total Cost = (Base Fee + Paper Surcharge) x Registrations + Expedited Fees",
  ["trademark-registration-cost-calculator", "patent-filing-cost-calculator", "intellectual-property-value-calculator"]
);

add(
  "arbitration-cost-calculator",
  "Arbitration Cost Calculator",
  "Estimate arbitration costs including filing fees, arbitrator fees, and administrative costs.",
  "Finance",
  "finance",
  "$",
  ["arbitration cost", "arbitration fees", "ADR cost", "dispute resolution cost"],
  [
    '{ name: "claimAmount", label: "Claim Amount ($)", type: "number", min: 0, max: 100000000, defaultValue: 200000 }',
    '{ name: "arbitrators", label: "Number of Arbitrators", type: "select", options: [{ value: "1", label: "1 Arbitrator" }, { value: "3", label: "3 Arbitrators (Panel)" }], defaultValue: "1" }',
    '{ name: "hearingDays", label: "Estimated Hearing Days", type: "number", min: 1, max: 60, defaultValue: 3 }',
    '{ name: "provider", label: "Arbitration Provider", type: "select", options: [{ value: "1", label: "AAA" }, { value: "2", label: "JAMS" }, { value: "3", label: "Private" }], defaultValue: "1" }'
  ],
  `(inputs) => {
    const claimAmount = inputs.claimAmount as number;
    const arbitrators = parseInt(inputs.arbitrators as string);
    const hearingDays = inputs.hearingDays as number;
    const provider = parseInt(inputs.provider as string);
    const providerNames = ["", "AAA", "JAMS", "Private"];
    let filingFee = 0;
    if (claimAmount <= 75000) filingFee = 925;
    else if (claimAmount <= 150000) filingFee = 1850;
    else if (claimAmount <= 300000) filingFee = 2800;
    else if (claimAmount <= 500000) filingFee = 4350;
    else filingFee = 6200;
    const providerMult = [0, 1, 1.2, 0.8][provider] || 1;
    filingFee = filingFee * providerMult;
    const dailyArbitratorRate = 3000;
    const arbitratorFees = dailyArbitratorRate * hearingDays * arbitrators;
    const adminFee = claimAmount * 0.005;
    const totalCost = filingFee + arbitratorFees + adminFee;
    const perPartyCost = totalCost / 2;
    return {
      primary: { label: "Estimated Total Arbitration Cost", value: "$" + formatNumber(totalCost) },
      details: [
        { label: "Provider", value: providerNames[provider] || "AAA" },
        { label: "Filing Fee", value: "$" + formatNumber(filingFee) },
        { label: "Arbitrator Fees", value: "$" + formatNumber(arbitratorFees) },
        { label: "Administrative Fee", value: "$" + formatNumber(adminFee) },
        { label: "Per-Party Share (50/50)", value: "$" + formatNumber(perPartyCost) }
      ]
    };
  }`,
  [
    { q: "Is arbitration cheaper than litigation?", a: "Often yes for smaller disputes, but large complex cases can have comparable or higher costs due to arbitrator fees that would not exist in court." },
    { q: "How long does arbitration take?", a: "Most commercial arbitrations conclude within 6 to 12 months, significantly faster than typical court litigation." },
    { q: "Is an arbitration decision final?", a: "Generally yes. Arbitration awards have very limited grounds for appeal, which provides certainty but also limits recourse if the outcome is unfavorable." }
  ],
  "Total Cost = Filing Fee + (Daily Rate x Days x Arbitrators) + Admin Fee",
  ["mediation-cost-calculator", "legal-fee-estimator-calculator", "court-filing-fee-calculator"]
);

add(
  "mediation-cost-calculator",
  "Mediation Cost Calculator",
  "Calculate estimated mediation costs for dispute resolution.",
  "Finance",
  "finance",
  "$",
  ["mediation cost", "mediator fees", "dispute mediation", "ADR mediation"],
  [
    '{ name: "mediatorRate", label: "Mediator Hourly Rate ($)", type: "number", min: 100, max: 2000, defaultValue: 400 }',
    '{ name: "sessions", label: "Number of Sessions", type: "number", min: 1, max: 20, defaultValue: 3 }',
    '{ name: "hoursPerSession", label: "Hours Per Session", type: "number", min: 1, max: 10, defaultValue: 4 }',
    '{ name: "parties", label: "Number of Parties", type: "number", min: 2, max: 10, defaultValue: 2 }',
    '{ name: "venueRental", label: "Venue Rental Per Session ($)", type: "number", min: 0, max: 2000, defaultValue: 200 }'
  ],
  `(inputs) => {
    const mediatorRate = inputs.mediatorRate as number;
    const sessions = inputs.sessions as number;
    const hoursPerSession = inputs.hoursPerSession as number;
    const parties = inputs.parties as number;
    const venueRental = inputs.venueRental as number;
    const totalHours = sessions * hoursPerSession;
    const mediatorCost = totalHours * mediatorRate;
    const venueCost = sessions * venueRental;
    const adminFee = 250;
    const totalCost = mediatorCost + venueCost + adminFee;
    const perPartyCost = totalCost / parties;
    return {
      primary: { label: "Total Mediation Cost", value: "$" + formatNumber(totalCost) },
      details: [
        { label: "Total Hours", value: formatNumber(totalHours) },
        { label: "Mediator Fees", value: "$" + formatNumber(mediatorCost) },
        { label: "Venue Costs", value: "$" + formatNumber(venueCost) },
        { label: "Admin Fee", value: "$" + formatNumber(adminFee) },
        { label: "Cost Per Party", value: "$" + formatNumber(perPartyCost) }
      ]
    };
  }`,
  [
    { q: "How much does mediation cost?", a: "Mediation typically costs $200 to $500 per hour for the mediator, with total costs often ranging from $2,000 to $10,000 depending on complexity." },
    { q: "How is mediation different from arbitration?", a: "A mediator facilitates negotiation but cannot impose a decision. An arbitrator acts like a judge and issues a binding decision." },
    { q: "What is the success rate of mediation?", a: "Mediation resolves approximately 70 to 85 percent of cases that go through the process, making it a highly effective dispute resolution method." }
  ],
  "Total Cost = (Sessions x Hours x Rate) + Venue Costs + Admin Fee",
  ["arbitration-cost-calculator", "legal-fee-estimator-calculator", "settlement-value-estimator-calculator"]
);

add(
  "notary-fee-calculator",
  "Notary Fee Calculator",
  "Calculate notary public fees based on document type and service type.",
  "Finance",
  "finance",
  "$",
  ["notary fee", "notarization cost", "notary public", "mobile notary"],
  [
    '{ name: "serviceType", label: "Service Type", type: "select", options: [{ value: "1", label: "In-Office Notarization" }, { value: "2", label: "Mobile Notary" }, { value: "3", label: "Remote Online Notarization" }], defaultValue: "1" }',
    '{ name: "documents", label: "Number of Documents", type: "number", min: 1, max: 50, defaultValue: 2 }',
    '{ name: "signatures", label: "Signatures Per Document", type: "number", min: 1, max: 20, defaultValue: 2 }',
    '{ name: "travelMiles", label: "Travel Distance (miles, mobile only)", type: "number", min: 0, max: 100, defaultValue: 10 }'
  ],
  `(inputs) => {
    const serviceType = parseInt(inputs.serviceType as string);
    const documents = inputs.documents as number;
    const signatures = inputs.signatures as number;
    const travelMiles = inputs.travelMiles as number;
    const serviceNames = ["", "In-Office", "Mobile Notary", "Remote Online"];
    const basePerSignature = [0, 10, 15, 25][serviceType] || 10;
    const totalSignatures = documents * signatures;
    const notaryFee = totalSignatures * basePerSignature;
    const travelFee = serviceType === 2 ? travelMiles * 1.5 : 0;
    const serviceFee = serviceType === 2 ? 75 : (serviceType === 3 ? 50 : 0);
    const totalCost = notaryFee + travelFee + serviceFee;
    return {
      primary: { label: "Total Notary Cost", value: "$" + formatNumber(totalCost) },
      details: [
        { label: "Service Type", value: serviceNames[serviceType] || "In-Office" },
        { label: "Total Signatures", value: formatNumber(totalSignatures) },
        { label: "Notarization Fees", value: "$" + formatNumber(notaryFee) },
        { label: "Travel Fee", value: "$" + formatNumber(travelFee) },
        { label: "Service Fee", value: "$" + formatNumber(serviceFee) }
      ]
    };
  }`,
  [
    { q: "How much does a notary charge?", a: "Standard notary fees range from $2 to $15 per signature depending on the state. Mobile notaries and remote online notarizations typically charge more." },
    { q: "What does a notary do?", a: "A notary public verifies the identity of document signers, witnesses signatures, and administers oaths to help prevent fraud." },
    { q: "Can any document be notarized?", a: "Most documents can be notarized, but the notary cannot notarize their own signature, a document they have a financial interest in, or incomplete documents." }
  ],
  "Total Cost = (Documents x Signatures x Per-Signature Fee) + Travel Fee + Service Fee",
  ["legal-document-preparation-cost-calculator", "legal-fee-estimator-calculator", "court-filing-fee-calculator"]
);

add(
  "deposition-cost-calculator",
  "Deposition Cost Calculator",
  "Estimate total deposition costs including court reporter, videographer, and transcript fees.",
  "Finance",
  "finance",
  "$",
  ["deposition cost", "court reporter fees", "deposition transcript", "legal deposition"],
  [
    '{ name: "hours", label: "Estimated Deposition Hours", type: "number", min: 1, max: 20, defaultValue: 4 }',
    '{ name: "depositions", label: "Number of Depositions", type: "number", min: 1, max: 30, defaultValue: 3 }',
    '{ name: "videoRecord", label: "Video Recording", type: "select", options: [{ value: "0", label: "No Video" }, { value: "1", label: "Yes (Videographer)" }], defaultValue: "0" }',
    '{ name: "expeditedTranscript", label: "Transcript Delivery", type: "select", options: [{ value: "1", label: "Standard (14 days)" }, { value: "2", label: "Expedited (7 days)" }, { value: "3", label: "Rush (3 days)" }, { value: "4", label: "Same Day" }], defaultValue: "1" }',
    '{ name: "locationFee", label: "Conference Room Rental ($)", type: "number", min: 0, max: 2000, defaultValue: 0 }'
  ],
  `(inputs) => {
    const hours = inputs.hours as number;
    const depositions = inputs.depositions as number;
    const videoRecord = parseInt(inputs.videoRecord as string);
    const expeditedTranscript = parseInt(inputs.expeditedTranscript as string);
    const locationFee = inputs.locationFee as number;
    const pagesPerHour = 40;
    const totalPages = hours * pagesPerHour;
    const basePerPage = 4;
    const expeditedMultiplier = [0, 1, 1.5, 2, 3][expeditedTranscript] || 1;
    const transcriptCost = totalPages * basePerPage * expeditedMultiplier;
    const reporterAppearance = 350;
    const videoCost = videoRecord === 1 ? hours * 200 + 500 : 0;
    const perDeposition = transcriptCost + reporterAppearance + videoCost + locationFee;
    const totalCost = perDeposition * depositions;
    return {
      primary: { label: "Total Deposition Costs", value: "$" + formatNumber(totalCost) },
      details: [
        { label: "Cost Per Deposition", value: "$" + formatNumber(perDeposition) },
        { label: "Transcript Cost Each", value: "$" + formatNumber(transcriptCost) },
        { label: "Reporter Appearance Each", value: "$" + formatNumber(reporterAppearance) },
        { label: "Video Cost Each", value: "$" + formatNumber(videoCost) },
        { label: "Estimated Pages Per Depo", value: formatNumber(totalPages) }
      ]
    };
  }`,
  [
    { q: "How much does a deposition cost?", a: "A typical half-day deposition costs $1,000 to $3,000 including court reporter fees and transcript. Video depositions and expedited transcripts add significant cost." },
    { q: "Who pays for deposition costs?", a: "The party requesting the deposition typically pays for the court reporter and transcript. Each side pays for their own copies." },
    { q: "How long does a deposition last?", a: "Most depositions last 2 to 7 hours. Federal rules limit depositions to one day of 7 hours unless the court orders otherwise." }
  ],
  "Total Cost = (Transcript + Reporter Fee + Video + Venue) x Number of Depositions",
  ["expert-witness-fee-calculator", "legal-fee-estimator-calculator", "case-timeline-estimator-calculator"]
);

add(
  "expert-witness-fee-calculator",
  "Expert Witness Fee Calculator",
  "Estimate expert witness costs including review, report, deposition, and trial testimony.",
  "Finance",
  "finance",
  "$",
  ["expert witness fee", "expert witness cost", "expert testimony", "litigation expert"],
  [
    '{ name: "specialty", label: "Expert Specialty", type: "select", options: [{ value: "1", label: "Medical" }, { value: "2", label: "Engineering" }, { value: "3", label: "Financial/Accounting" }, { value: "4", label: "Vocational/Economic" }, { value: "5", label: "Technology/Computer" }], defaultValue: "1" }',
    '{ name: "reviewHours", label: "Document Review Hours", type: "number", min: 1, max: 200, defaultValue: 20 }',
    '{ name: "depositionHours", label: "Deposition Hours", type: "number", min: 0, max: 20, defaultValue: 4 }',
    '{ name: "trialDays", label: "Trial Testimony Days", type: "number", min: 0, max: 10, defaultValue: 1 }',
    '{ name: "reportNeeded", label: "Written Report Needed", type: "select", options: [{ value: "0", label: "No" }, { value: "1", label: "Yes" }], defaultValue: "1" }'
  ],
  `(inputs) => {
    const specialty = parseInt(inputs.specialty as string);
    const reviewHours = inputs.reviewHours as number;
    const depositionHours = inputs.depositionHours as number;
    const trialDays = inputs.trialDays as number;
    const reportNeeded = parseInt(inputs.reportNeeded as string);
    const specialtyNames = ["", "Medical", "Engineering", "Financial/Accounting", "Vocational/Economic", "Technology/Computer"];
    const hourlyRates = [0, 500, 350, 400, 300, 450];
    const rate = hourlyRates[specialty] || 400;
    const reviewCost = reviewHours * rate;
    const depositionCost = depositionHours * rate * 1.25;
    const trialCost = trialDays * 8 * rate * 1.5;
    const reportCost = reportNeeded === 1 ? 3500 : 0;
    const travelExpenses = trialDays > 0 ? trialDays * 600 : 0;
    const totalCost = reviewCost + depositionCost + trialCost + reportCost + travelExpenses;
    return {
      primary: { label: "Estimated Expert Witness Cost", value: "$" + formatNumber(totalCost) },
      details: [
        { label: "Specialty", value: specialtyNames[specialty] || "General" },
        { label: "Hourly Rate", value: "$" + formatNumber(rate) },
        { label: "Review Cost", value: "$" + formatNumber(reviewCost) },
        { label: "Deposition Cost", value: "$" + formatNumber(depositionCost) },
        { label: "Trial Testimony Cost", value: "$" + formatNumber(trialCost) },
        { label: "Report & Travel", value: "$" + formatNumber(reportCost + travelExpenses) }
      ]
    };
  }`,
  [
    { q: "How much does an expert witness charge?", a: "Expert witness fees typically range from $200 to $1,000+ per hour depending on specialty. Medical experts and PhDs tend to charge the highest rates." },
    { q: "Who pays for expert witness fees?", a: "Each party pays for their own expert witnesses. In some cases, the losing party may be ordered to pay the winner's expert costs." },
    { q: "Can expert witness fees be recovered?", a: "Federal courts allow recovery of limited expert witness fees (currently $40/day) as costs. Some state courts and fee-shifting statutes allow full recovery." }
  ],
  "Total = Review Hours x Rate + Deposition x 1.25 Rate + Trial Days x 8 x 1.5 Rate + Report + Travel",
  ["deposition-cost-calculator", "legal-fee-estimator-calculator", "settlement-value-estimator-calculator"]
);

add(
  "jury-duty-pay-calculator",
  "Jury Duty Pay Calculator",
  "Calculate jury duty compensation and estimate lost wages.",
  "Finance",
  "finance",
  "$",
  ["jury duty pay", "juror compensation", "jury service pay", "jury duty wages"],
  [
    '{ name: "days", label: "Days of Jury Service", type: "number", min: 1, max: 180, defaultValue: 5 }',
    '{ name: "courtType", label: "Court Type", type: "select", options: [{ value: "1", label: "Federal Court ($50/day)" }, { value: "2", label: "State Court ($15-40/day)" }], defaultValue: "1" }',
    '{ name: "dailyWage", label: "Your Daily Wage ($)", type: "number", min: 0, max: 5000, defaultValue: 250 }',
    '{ name: "employerPays", label: "Employer Pays During Service?", type: "select", options: [{ value: "0", label: "No" }, { value: "1", label: "Yes, Full Pay" }, { value: "2", label: "Yes, Partial (50%)" }], defaultValue: "0" }',
    '{ name: "mileage", label: "Round-Trip Miles to Court", type: "number", min: 0, max: 200, defaultValue: 20 }'
  ],
  `(inputs) => {
    const days = inputs.days as number;
    const courtType = parseInt(inputs.courtType as string);
    const dailyWage = inputs.dailyWage as number;
    const employerPays = parseInt(inputs.employerPays as string);
    const mileage = inputs.mileage as number;
    const juryPay = courtType === 1 ? 50 : 25;
    const totalJuryPay = juryPay * days;
    const mileageReimbursement = mileage * 0.655 * days;
    const employerPay = employerPays === 1 ? dailyWage * days : (employerPays === 2 ? dailyWage * 0.5 * days : 0);
    const normalEarnings = dailyWage * days;
    const totalCompensation = totalJuryPay + mileageReimbursement + employerPay;
    const lostWages = Math.max(normalEarnings - totalCompensation, 0);
    return {
      primary: { label: "Total Compensation", value: "$" + formatNumber(totalCompensation) },
      details: [
        { label: "Jury Pay", value: "$" + formatNumber(totalJuryPay) + " ($" + formatNumber(juryPay) + "/day)" },
        { label: "Mileage Reimbursement", value: "$" + formatNumber(mileageReimbursement) },
        { label: "Employer Pay", value: "$" + formatNumber(employerPay) },
        { label: "Normal Earnings", value: "$" + formatNumber(normalEarnings) },
        { label: "Estimated Lost Wages", value: "$" + formatNumber(lostWages) }
      ]
    };
  }`,
  [
    { q: "How much does jury duty pay?", a: "Federal courts pay $50 per day ($60 after 10 days). State courts vary widely from $5 to $50 per day, with some paying nothing for the first few days." },
    { q: "Can my employer fire me for jury duty?", a: "Federal law and most state laws prohibit employers from firing, threatening, or penalizing employees for serving on a jury." },
    { q: "How long does jury duty last?", a: "Most jury service lasts 1 to 2 weeks for trial juries. Grand jury duty can last several months. Many people are dismissed after one day of selection." }
  ],
  "Total Compensation = (Jury Pay x Days) + Mileage + Employer Pay",
  ["legal-fee-estimator-calculator", "court-filing-fee-calculator", "case-timeline-estimator-calculator"]
);

add(
  "immigration-filing-fee-calculator",
  "Immigration Filing Fee Calculator",
  "Calculate USCIS filing fees for common immigration applications.",
  "Finance",
  "finance",
  "$",
  ["immigration filing fee", "USCIS fees", "visa cost", "green card cost", "immigration cost"],
  [
    '{ name: "formType", label: "Application Type", type: "select", options: [{ value: "1", label: "I-130 Family Petition ($535)" }, { value: "2", label: "I-485 Adjustment of Status ($1,225)" }, { value: "3", label: "N-400 Naturalization ($710)" }, { value: "4", label: "I-765 Work Permit ($410)" }, { value: "5", label: "I-140 Employer Petition ($700)" }, { value: "6", label: "I-751 Remove Conditions ($750)" }], defaultValue: "1" }',
    '{ name: "biometrics", label: "Biometrics Required", type: "select", options: [{ value: "0", label: "No" }, { value: "1", label: "Yes ($85)" }], defaultValue: "1" }',
    '{ name: "premiumProcessing", label: "Premium Processing", type: "select", options: [{ value: "0", label: "No" }, { value: "1", label: "Yes ($2,805)" }], defaultValue: "0" }',
    '{ name: "applicants", label: "Number of Applicants", type: "number", min: 1, max: 10, defaultValue: 1 }',
    '{ name: "attorneyFee", label: "Attorney Fee ($)", type: "number", min: 0, max: 50000, defaultValue: 3000 }'
  ],
  `(inputs) => {
    const formType = parseInt(inputs.formType as string);
    const biometrics = parseInt(inputs.biometrics as string);
    const premiumProcessing = parseInt(inputs.premiumProcessing as string);
    const applicants = inputs.applicants as number;
    const attorneyFee = inputs.attorneyFee as number;
    const formNames = ["", "I-130 Family Petition", "I-485 Adjustment", "N-400 Naturalization", "I-765 Work Permit", "I-140 Employer Petition", "I-751 Remove Conditions"];
    const baseFees = [0, 535, 1225, 710, 410, 700, 750];
    const filingFee = baseFees[formType] || 535;
    const biometricsFee = biometrics === 1 ? 85 : 0;
    const premiumFee = premiumProcessing === 1 ? 2805 : 0;
    const perApplicant = filingFee + biometricsFee + premiumFee;
    const totalFiling = perApplicant * applicants;
    const grandTotal = totalFiling + attorneyFee;
    return {
      primary: { label: "Total Immigration Cost", value: "$" + formatNumber(grandTotal) },
      details: [
        { label: "Application", value: formNames[formType] || "I-130" },
        { label: "USCIS Filing Fee", value: "$" + formatNumber(filingFee) + " per applicant" },
        { label: "Biometrics Fee", value: "$" + formatNumber(biometricsFee * applicants) },
        { label: "Premium Processing", value: "$" + formatNumber(premiumFee * applicants) },
        { label: "Attorney Fee", value: "$" + formatNumber(attorneyFee) }
      ]
    };
  }`,
  [
    { q: "How much does a green card cost?", a: "The total cost for a family-based green card including I-130 and I-485 filings is approximately $1,760 in government fees, plus attorney fees of $2,000 to $8,000." },
    { q: "Can USCIS fees be waived?", a: "Fee waivers are available for certain forms (I-485, N-400, I-765) if you demonstrate financial hardship, receive means-tested benefits, or have income below 150% of poverty guidelines." },
    { q: "What is premium processing?", a: "Premium processing guarantees USCIS will process certain petitions within 15 business days for an additional fee of $2,805. It is available for I-140 and some I-129 petitions." }
  ],
  "Total Cost = (Filing Fee + Biometrics + Premium) x Applicants + Attorney Fee",
  ["legal-fee-estimator-calculator", "court-filing-fee-calculator", "legal-document-preparation-cost-calculator"]
);

add(
  "legal-document-preparation-cost-calculator",
  "Legal Document Preparation Cost Calculator",
  "Estimate costs for preparing common legal documents with or without attorney assistance.",
  "Finance",
  "finance",
  "$",
  ["legal document cost", "document preparation", "legal forms", "legal document fee"],
  [
    '{ name: "docType", label: "Document Type", type: "select", options: [{ value: "1", label: "Simple Will" }, { value: "2", label: "Living Trust" }, { value: "3", label: "Power of Attorney" }, { value: "4", label: "LLC Operating Agreement" }, { value: "5", label: "Prenuptial Agreement" }, { value: "6", label: "Lease Agreement" }], defaultValue: "1" }',
    '{ name: "prepMethod", label: "Preparation Method", type: "select", options: [{ value: "1", label: "DIY Online Service" }, { value: "2", label: "Legal Document Preparer" }, { value: "3", label: "Attorney Drafted" }], defaultValue: "2" }',
    '{ name: "documents", label: "Number of Documents", type: "number", min: 1, max: 20, defaultValue: 1 }',
    '{ name: "revisions", label: "Expected Revisions", type: "number", min: 0, max: 10, defaultValue: 1 }'
  ],
  `(inputs) => {
    const docType = parseInt(inputs.docType as string);
    const prepMethod = parseInt(inputs.prepMethod as string);
    const documents = inputs.documents as number;
    const revisions = inputs.revisions as number;
    const docNames = ["", "Simple Will", "Living Trust", "Power of Attorney", "LLC Operating Agreement", "Prenuptial Agreement", "Lease Agreement"];
    const diyCosts = [0, 50, 150, 35, 100, 200, 40];
    const preparerCosts = [0, 200, 600, 100, 400, 800, 150];
    const attorneyCosts = [0, 800, 2500, 400, 1500, 3500, 600];
    const costs = [[], diyCosts, preparerCosts, attorneyCosts];
    const baseCost = (costs[prepMethod] || preparerCosts)[docType] || 200;
    const revisionCost = prepMethod === 3 ? revisions * baseCost * 0.15 : revisions * baseCost * 0.05;
    const perDoc = baseCost + revisionCost;
    const totalCost = perDoc * documents;
    const methodNames = ["", "DIY Online", "Document Preparer", "Attorney Drafted"];
    return {
      primary: { label: "Total Document Preparation Cost", value: "$" + formatNumber(totalCost) },
      details: [
        { label: "Document Type", value: docNames[docType] || "General" },
        { label: "Preparation Method", value: methodNames[prepMethod] || "Preparer" },
        { label: "Base Cost Per Document", value: "$" + formatNumber(baseCost) },
        { label: "Revision Costs", value: "$" + formatNumber(revisionCost * documents) },
        { label: "Cost Per Document", value: "$" + formatNumber(perDoc) }
      ]
    };
  }`,
  [
    { q: "How much does it cost to prepare a will?", a: "A simple will costs $50 to $100 with online services, $200 to $400 with a document preparer, or $500 to $1,500 with an attorney." },
    { q: "Is it worth hiring an attorney for legal documents?", a: "For complex situations like trusts, prenups, or business agreements, attorney review can prevent costly mistakes. Simple documents may be fine with online services." },
    { q: "What is a legal document preparer?", a: "A legal document preparer is a non-attorney professional who helps complete legal forms and documents at a lower cost than an attorney. They cannot provide legal advice." }
  ],
  "Total Cost = (Base Cost + Revision Cost) x Number of Documents",
  ["notary-fee-calculator", "legal-fee-estimator-calculator", "probate-cost-estimator-calculator"]
);
add(
  "bpm-tempo-calculator",
  "BPM Tempo Calculator",
  "Calculate beats per minute, tempo markings, and timing intervals for music production and performance.",
  "Everyday",
  "everyday",
  "~",
  ["bpm", "tempo", "beats per minute", "music tempo", "metronome"],
  [
    '{ name: "bpm", label: "Tempo (BPM)", type: "number", min: 20, max: 300, defaultValue: 120 }',
    '{ name: "beatsPerMeasure", label: "Beats Per Measure", type: "select", options: [{ value: "3", label: "3/4 (Waltz)" }, { value: "4", label: "4/4 (Common)" }, { value: "6", label: "6/8 (Compound)" }, { value: "5", label: "5/4 (Odd)" }], defaultValue: "4" }',
    '{ name: "measures", label: "Number of Measures", type: "number", min: 1, max: 500, defaultValue: 32 }'
  ],
  `(inputs) => {
    const bpm = inputs.bpm as number;
    const beatsPerMeasure = inputs.beatsPerMeasure as number;
    const measures = inputs.measures as number;
    const msPerBeat = 60000 / bpm;
    const secPerMeasure = (beatsPerMeasure * 60) / bpm;
    const totalBeats = measures * beatsPerMeasure;
    const totalSeconds = totalBeats * (60 / bpm);
    const totalMinutes = totalSeconds / 60;
    let tempoMarking = "Grave";
    if (bpm >= 40) tempoMarking = "Largo";
    if (bpm >= 55) tempoMarking = "Adagio";
    if (bpm >= 70) tempoMarking = "Andante";
    if (bpm >= 90) tempoMarking = "Moderato";
    if (bpm >= 110) tempoMarking = "Allegro";
    if (bpm >= 140) tempoMarking = "Vivace";
    if (bpm >= 170) tempoMarking = "Presto";
    if (bpm >= 200) tempoMarking = "Prestissimo";
    return {
      primary: { label: "Milliseconds Per Beat", value: formatNumber(msPerBeat) + " ms" },
      details: [
        { label: "Tempo Marking", value: tempoMarking },
        { label: "Seconds Per Measure", value: formatNumber(secPerMeasure) + " sec" },
        { label: "Total Duration", value: formatNumber(totalMinutes) + " min" },
        { label: "Total Beats", value: formatNumber(totalBeats) }
      ]
    };
  }`,
  [
    { q: "What is BPM in music?", a: "BPM stands for beats per minute and measures the tempo or speed of a piece of music." },
    { q: "What BPM is standard pop music?", a: "Most pop music falls between 100 and 130 BPM, with 120 BPM being very common." },
    { q: "How do I find the BPM of a song?", a: "You can tap along with the beat using a metronome app or use audio analysis software to detect BPM automatically." }
  ],
  `ms per beat = 60000 / BPM\nDuration = (Measures x Beats Per Measure) / BPM x 60`,
  ["music-key-transposer-calculator", "dj-set-time-planner-calculator", "chord-progression-calculator"]
);

add(
  "music-key-transposer-calculator",
  "Music Key Transposer Calculator",
  "Transpose musical keys up or down by a given number of semitones for any instrument.",
  "Everyday",
  "everyday",
  "~",
  ["transpose", "key change", "semitone", "music key", "transposition"],
  [
    '{ name: "originalKey", label: "Original Key", type: "select", options: [{ value: "0", label: "C" }, { value: "1", label: "C#/Db" }, { value: "2", label: "D" }, { value: "3", label: "D#/Eb" }, { value: "4", label: "E" }, { value: "5", label: "F" }, { value: "6", label: "F#/Gb" }, { value: "7", label: "G" }, { value: "8", label: "G#/Ab" }, { value: "9", label: "A" }, { value: "10", label: "A#/Bb" }, { value: "11", label: "B" }], defaultValue: "0" }',
    '{ name: "semitones", label: "Semitones to Transpose", type: "number", min: -12, max: 12, defaultValue: 5 }',
    '{ name: "scaleType", label: "Scale Type", type: "select", options: [{ value: "1", label: "Major" }, { value: "2", label: "Minor" }], defaultValue: "1" }'
  ],
  `(inputs) => {
    const originalKey = inputs.originalKey as number;
    const semitones = inputs.semitones as number;
    const scaleType = inputs.scaleType as number;
    const notes = ["C", "C#/Db", "D", "D#/Eb", "E", "F", "F#/Gb", "G", "G#/Ab", "A", "A#/Bb", "B"];
    const newKeyIndex = ((originalKey + semitones) % 12 + 12) % 12;
    const originalNote = notes[originalKey];
    const newNote = notes[newKeyIndex];
    const scaleLabel = scaleType === 1 ? "Major" : "Minor";
    const relativeIndex = scaleType === 1 ? ((newKeyIndex + 9) % 12) : ((newKeyIndex + 3) % 12);
    const relativeKey = notes[relativeIndex];
    const relativeLabel = scaleType === 1 ? "Relative Minor" : "Relative Major";
    const direction = semitones > 0 ? "Up" : semitones < 0 ? "Down" : "None";
    const interval = Math.abs(semitones);
    return {
      primary: { label: "New Key", value: newNote + " " + scaleLabel },
      details: [
        { label: "Original Key", value: originalNote + " " + scaleLabel },
        { label: "Direction", value: direction + " " + formatNumber(interval) + " semitones" },
        { label: relativeLabel, value: relativeKey },
        { label: "Enharmonic Steps", value: formatNumber(interval) }
      ]
    };
  }`,
  [
    { q: "What does transposing a key mean?", a: "Transposing shifts all notes in a piece of music up or down by the same interval, changing the key while preserving the melody." },
    { q: "How many semitones are in an octave?", a: "There are 12 semitones in one octave on the chromatic scale." },
    { q: "Why would you transpose music?", a: "Common reasons include matching a singer's vocal range, accommodating transposing instruments like Bb trumpet, or making a piece easier to play." }
  ],
  `New Key Index = (Original Key + Semitones) mod 12`,
  ["bpm-tempo-calculator", "chord-progression-calculator", "guitar-string-gauge-calculator"]
);

add(
  "chord-progression-calculator",
  "Chord Progression Calculator",
  "Generate common chord progressions in any key with Roman numeral analysis for songwriting.",
  "Everyday",
  "everyday",
  "~",
  ["chord progression", "songwriting", "chords", "harmony", "music theory"],
  [
    '{ name: "rootKey", label: "Root Key", type: "select", options: [{ value: "0", label: "C" }, { value: "2", label: "D" }, { value: "4", label: "E" }, { value: "5", label: "F" }, { value: "7", label: "G" }, { value: "9", label: "A" }, { value: "11", label: "B" }], defaultValue: "0" }',
    '{ name: "progression", label: "Progression Type", type: "select", options: [{ value: "1", label: "I-IV-V-I (Classic)" }, { value: "2", label: "I-V-vi-IV (Pop)" }, { value: "3", label: "ii-V-I (Jazz)" }, { value: "4", label: "I-vi-IV-V (50s)" }, { value: "5", label: "vi-IV-I-V (Modern)" }], defaultValue: "2" }',
    '{ name: "bpm", label: "Tempo (BPM)", type: "number", min: 40, max: 240, defaultValue: 120 }'
  ],
  `(inputs) => {
    const rootKey = inputs.rootKey as number;
    const progression = inputs.progression as number;
    const bpm = inputs.bpm as number;
    const notes = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
    const majorScale = [0, 2, 4, 5, 7, 9, 11];
    const getNote = (degree) => notes[(rootKey + majorScale[degree]) % 12];
    let chords = [];
    let roman = "";
    if (progression === 1) { chords = [getNote(0), getNote(3), getNote(4), getNote(0)]; roman = "I - IV - V - I"; }
    else if (progression === 2) { chords = [getNote(0), getNote(4), getNote(5) + "m", getNote(3)]; roman = "I - V - vi - IV"; }
    else if (progression === 3) { chords = [getNote(1) + "m", getNote(4), getNote(0)]; roman = "ii - V - I"; }
    else if (progression === 4) { chords = [getNote(0), getNote(5) + "m", getNote(3), getNote(4)]; roman = "I - vi - IV - V"; }
    else { chords = [getNote(5) + "m", getNote(3), getNote(0), getNote(4)]; roman = "vi - IV - I - V"; }
    const chordsStr = chords.join(" - ");
    const beatsPerChord = 4;
    const secPerChord = (beatsPerChord * 60) / bpm;
    const loopDuration = secPerChord * chords.length;
    return {
      primary: { label: "Chord Progression", value: chordsStr },
      details: [
        { label: "Roman Numerals", value: roman },
        { label: "Key", value: notes[rootKey] + " Major" },
        { label: "Seconds Per Chord", value: formatNumber(secPerChord) + " sec" },
        { label: "Loop Duration", value: formatNumber(loopDuration) + " sec" }
      ]
    };
  }`,
  [
    { q: "What is the most popular chord progression?", a: "The I-V-vi-IV progression is the most widely used in modern pop music, used in hundreds of hit songs." },
    { q: "What is a ii-V-I progression?", a: "It is the most important chord progression in jazz, creating strong harmonic motion toward the tonic." },
    { q: "Do I need to know music theory to write songs?", a: "While not required, understanding chord progressions can help you write more compelling and harmonically interesting music." }
  ],
  `Chords derived from scale degrees of the selected key\nLoop Duration = (Beats Per Chord x Chords) / BPM x 60`,
  ["music-key-transposer-calculator", "bpm-tempo-calculator", "music-royalty-split-calculator"]
);

add(
  "speaker-wattage-calculator",
  "Speaker Wattage Calculator",
  "Determine the right speaker wattage for your room or venue based on size and use case.",
  "Everyday",
  "everyday",
  "~",
  ["speaker", "wattage", "power", "amplifier", "audio"],
  [
    '{ name: "roomArea", label: "Room Area (sq ft)", type: "number", min: 50, max: 50000, defaultValue: 300 }',
    '{ name: "usage", label: "Usage Type", type: "select", options: [{ value: "1", label: "Background Music" }, { value: "2", label: "Home Listening" }, { value: "3", label: "Party / DJ" }, { value: "4", label: "Live Band / Venue" }], defaultValue: "2" }',
    '{ name: "speakerSensitivity", label: "Speaker Sensitivity (dB)", type: "number", min: 80, max: 105, defaultValue: 89 }',
    '{ name: "targetSPL", label: "Target Volume (dB SPL)", type: "number", min: 70, max: 120, defaultValue: 85 }'
  ],
  `(inputs) => {
    const roomArea = inputs.roomArea as number;
    const usage = inputs.usage as number;
    const sensitivity = inputs.speakerSensitivity as number;
    const targetSPL = inputs.targetSPL as number;
    const distanceM = Math.sqrt(roomArea * 0.0929) / 2;
    const distanceLoss = 20 * Math.log10(distanceM);
    const requiredPowerDB = targetSPL - sensitivity + distanceLoss;
    const watts = Math.pow(10, requiredPowerDB / 10);
    const recommendedWatts = Math.ceil(watts * 1.5);
    const ampHeadroom = Math.ceil(recommendedWatts * 1.25);
    const usageLabels = ["", "Background Music", "Home Listening", "Party / DJ", "Live Band / Venue"];
    return {
      primary: { label: "Recommended Speaker Power", value: formatNumber(recommendedWatts) + " W" },
      details: [
        { label: "Minimum Power Needed", value: formatNumber(Math.ceil(watts)) + " W" },
        { label: "Recommended Amp Power", value: formatNumber(ampHeadroom) + " W" },
        { label: "Listening Distance", value: formatNumber(distanceM) + " m" },
        { label: "Usage Type", value: usageLabels[usage] }
      ]
    };
  }`,
  [
    { q: "How many watts do I need for a room?", a: "For home listening, 20-50 watts per channel is usually sufficient for rooms up to 400 square feet." },
    { q: "Does higher wattage mean louder speakers?", a: "Not necessarily. Speaker sensitivity matters more. A 3dB increase in sensitivity is equivalent to doubling the power." },
    { q: "Should my amp be more powerful than my speakers?", a: "Your amplifier should be rated slightly above your speaker capacity to provide headroom without distortion." }
  ],
  `Required Power (dB) = Target SPL - Sensitivity + 20 * log10(distance)\nWatts = 10^(Power dB / 10)`,
  ["speaker-room-size-calculator", "subwoofer-box-volume-calculator", "concert-venue-capacity-calculator"]
);

add(
  "concert-ticket-value-calculator",
  "Concert Ticket Value Calculator",
  "Evaluate whether a concert ticket price offers good value based on show length, artists, and extras.",
  "Finance",
  "finance",
  "$",
  ["concert", "ticket", "value", "entertainment", "live music"],
  [
    '{ name: "ticketPrice", label: "Ticket Price ($)", type: "number", min: 10, max: 5000, defaultValue: 85 }',
    '{ name: "showHours", label: "Expected Show Length (hours)", type: "number", min: 0.5, max: 8, defaultValue: 2.5 }',
    '{ name: "numArtists", label: "Number of Acts", type: "number", min: 1, max: 20, defaultValue: 3 }',
    '{ name: "travelCost", label: "Travel & Parking ($)", type: "number", min: 0, max: 500, defaultValue: 30 }',
    '{ name: "foodDrink", label: "Estimated Food & Drink ($)", type: "number", min: 0, max: 500, defaultValue: 40 }'
  ],
  `(inputs) => {
    const ticketPrice = inputs.ticketPrice as number;
    const showHours = inputs.showHours as number;
    const numArtists = inputs.numArtists as number;
    const travelCost = inputs.travelCost as number;
    const foodDrink = inputs.foodDrink as number;
    const totalCost = ticketPrice + travelCost + foodDrink;
    const costPerHour = totalCost / showHours;
    const costPerAct = totalCost / numArtists;
    const costPerMinute = totalCost / (showHours * 60);
    const movieEquivalent = totalCost / 15;
    return {
      primary: { label: "Cost Per Hour of Entertainment", value: "$" + formatNumber(costPerHour) },
      details: [
        { label: "Total Evening Cost", value: "$" + formatNumber(totalCost) },
        { label: "Cost Per Act", value: "$" + formatNumber(costPerAct) },
        { label: "Cost Per Minute", value: "$" + formatNumber(costPerMinute) },
        { label: "Equivalent Movie Tickets", value: formatNumber(movieEquivalent) }
      ]
    };
  }`,
  [
    { q: "How do you determine if a concert ticket is worth it?", a: "Divide total cost by hours of entertainment. Under $30 per hour is generally good value compared to other entertainment." },
    { q: "What is the average concert ticket price?", a: "Average concert ticket prices range from $50 to $150, though top artists can command $200 or more." },
    { q: "Should I factor in travel costs?", a: "Yes, travel, parking, food, and drinks can easily double the cost of attending a concert." }
  ],
  `Cost Per Hour = (Ticket + Travel + Food) / Show Hours`,
  ["concert-venue-capacity-calculator", "dj-set-time-planner-calculator", "music-streaming-revenue-calculator"]
);

add(
  "music-streaming-revenue-calculator",
  "Music Streaming Revenue Calculator",
  "Estimate earnings from music streams across major platforms like Spotify, Apple Music, and YouTube.",
  "Finance",
  "finance",
  "$",
  ["streaming", "Spotify", "Apple Music", "revenue", "music income", "royalties"],
  [
    '{ name: "streams", label: "Total Monthly Streams", type: "number", min: 100, max: 100000000, defaultValue: 50000 }',
    '{ name: "platform", label: "Primary Platform", type: "select", options: [{ value: "1", label: "Spotify ($0.004/stream)" }, { value: "2", label: "Apple Music ($0.008/stream)" }, { value: "3", label: "YouTube Music ($0.002/stream)" }, { value: "4", label: "Tidal ($0.013/stream)" }], defaultValue: "1" }',
    '{ name: "distributorCut", label: "Distributor Cut (%)", type: "number", min: 0, max: 50, defaultValue: 15 }',
    '{ name: "splitMembers", label: "Band Members Splitting", type: "number", min: 1, max: 10, defaultValue: 1 }'
  ],
  `(inputs) => {
    const streams = inputs.streams as number;
    const platform = inputs.platform as number;
    const distributorCut = inputs.distributorCut as number;
    const splitMembers = inputs.splitMembers as number;
    const rates = [0, 0.004, 0.008, 0.002, 0.013];
    const rate = rates[platform];
    const grossRevenue = streams * rate;
    const afterDistributor = grossRevenue * (1 - distributorCut / 100);
    const perMember = afterDistributor / splitMembers;
    const annualRevenue = perMember * 12;
    const streamsForMinWage = Math.ceil((1257 / rate) / (1 - distributorCut / 100));
    return {
      primary: { label: "Monthly Revenue Per Member", value: "$" + formatNumber(perMember) },
      details: [
        { label: "Gross Monthly Revenue", value: "$" + formatNumber(grossRevenue) },
        { label: "After Distributor Cut", value: "$" + formatNumber(afterDistributor) },
        { label: "Estimated Annual Revenue", value: "$" + formatNumber(annualRevenue) },
        { label: "Streams Needed for Min Wage", value: formatNumber(streamsForMinWage) }
      ]
    };
  }`,
  [
    { q: "How much does Spotify pay per stream?", a: "Spotify pays approximately $0.003 to $0.005 per stream depending on the listener's country and subscription type." },
    { q: "Which streaming service pays artists the most?", a: "Tidal typically pays the most per stream at around $0.013, followed by Apple Music at approximately $0.008." },
    { q: "How many streams do you need to make a living?", a: "On Spotify, you would need roughly 300,000-400,000 streams per month to earn US minimum wage." }
  ],
  `Revenue = Streams x Rate Per Stream x (1 - Distributor %)\nPer Member = Revenue / Members`,
  ["music-royalty-split-calculator", "podcast-production-cost-calculator", "album-production-budget-calculator"]
);

add(
  "dj-set-time-planner-calculator",
  "DJ Set Time Planner Calculator",
  "Plan your DJ set with track counts, transitions, and energy flow based on set length and genre.",
  "Everyday",
  "everyday",
  "~",
  ["DJ", "set time", "tracklist", "mixing", "playlist"],
  [
    '{ name: "setLength", label: "Set Length (minutes)", type: "number", min: 15, max: 480, defaultValue: 60 }',
    '{ name: "avgTrackLength", label: "Avg Track Length (minutes)", type: "number", min: 2, max: 10, defaultValue: 4 }',
    '{ name: "transitionLength", label: "Avg Transition (seconds)", type: "number", min: 5, max: 60, defaultValue: 16 }',
    '{ name: "genre", label: "Genre", type: "select", options: [{ value: "1", label: "House / Techno" }, { value: "2", label: "Hip-Hop / R&B" }, { value: "3", label: "EDM / Festival" }, { value: "4", label: "Open Format" }], defaultValue: "1" }'
  ],
  `(inputs) => {
    const setLength = inputs.setLength as number;
    const avgTrackLength = inputs.avgTrackLength as number;
    const transitionLength = inputs.transitionLength as number;
    const genre = inputs.genre as number;
    const transitionMin = transitionLength / 60;
    const effectiveTrackTime = avgTrackLength - transitionMin;
    const totalTracks = Math.ceil(setLength / effectiveTrackTime);
    const prepTracks = Math.ceil(totalTracks * 1.5);
    const totalTransitions = totalTracks - 1;
    const genreLabels = ["", "House / Techno", "Hip-Hop / R&B", "EDM / Festival", "Open Format"];
    const bpmRanges = ["", "120-135 BPM", "85-115 BPM", "125-150 BPM", "80-140 BPM"];
    return {
      primary: { label: "Tracks Needed", value: formatNumber(totalTracks) },
      details: [
        { label: "Prepare at Least", value: formatNumber(prepTracks) + " tracks" },
        { label: "Total Transitions", value: formatNumber(totalTransitions) },
        { label: "Genre", value: genreLabels[genre] },
        { label: "Typical BPM Range", value: bpmRanges[genre] }
      ]
    };
  }`,
  [
    { q: "How many songs do I need for a 1-hour DJ set?", a: "For a typical 1-hour set, plan for 15-20 tracks depending on track length and how long you mix transitions." },
    { q: "How long should DJ transitions be?", a: "Transitions vary by genre: house music uses 16-32 beat mixes while hip-hop may use quick 4-8 beat cuts." },
    { q: "Should I prepare extra tracks?", a: "Always prepare 1.5 to 2 times the tracks you plan to play to allow flexibility and read the crowd." }
  ],
  `Tracks = Set Length / (Avg Track Length - Transition Length)\nPrep Tracks = Tracks x 1.5`,
  ["bpm-tempo-calculator", "concert-ticket-value-calculator", "music-streaming-revenue-calculator"]
);

add(
  "audio-bitrate-file-size-calculator",
  "Audio Bitrate File Size Calculator",
  "Calculate audio file sizes based on bitrate, sample rate, duration, and format.",
  "Conversion",
  "conversion",
  "R",
  ["audio", "bitrate", "file size", "mp3", "wav", "flac"],
  [
    '{ name: "duration", label: "Duration (minutes)", type: "number", min: 0.5, max: 600, defaultValue: 4 }',
    '{ name: "format", label: "Audio Format", type: "select", options: [{ value: "1", label: "MP3 (128 kbps)" }, { value: "2", label: "MP3 (320 kbps)" }, { value: "3", label: "WAV (16-bit/44.1kHz)" }, { value: "4", label: "FLAC (Lossless)" }, { value: "5", label: "AAC (256 kbps)" }], defaultValue: "2" }',
    '{ name: "numTracks", label: "Number of Tracks", type: "number", min: 1, max: 500, defaultValue: 12 }'
  ],
  `(inputs) => {
    const duration = inputs.duration as number;
    const format = inputs.format as number;
    const numTracks = inputs.numTracks as number;
    const bitrates = [0, 128, 320, 1411, 900, 256];
    const formatLabels = ["", "MP3 128kbps", "MP3 320kbps", "WAV 16-bit", "FLAC Lossless", "AAC 256kbps"];
    const bitrate = bitrates[format];
    const fileSizeMB = (bitrate * duration * 60) / 8 / 1024;
    const totalSizeMB = fileSizeMB * numTracks;
    const totalSizeGB = totalSizeMB / 1024;
    const totalDuration = duration * numTracks;
    return {
      primary: { label: "File Size Per Track", value: formatNumber(fileSizeMB) + " MB" },
      details: [
        { label: "Format", value: formatLabels[format] },
        { label: "Total Size (" + numTracks + " tracks)", value: totalSizeGB >= 1 ? formatNumber(totalSizeGB) + " GB" : formatNumber(totalSizeMB) + " MB" },
        { label: "Bitrate", value: formatNumber(bitrate) + " kbps" },
        { label: "Total Duration", value: formatNumber(totalDuration) + " min" }
      ]
    };
  }`,
  [
    { q: "How big is a 3-minute MP3 file?", a: "At 320 kbps, a 3-minute MP3 is approximately 7.2 MB. At 128 kbps it is about 2.9 MB." },
    { q: "What is the difference between lossy and lossless audio?", a: "Lossy formats like MP3 discard some audio data to reduce size, while lossless formats like FLAC preserve all original audio data." },
    { q: "What bitrate should I use for music?", a: "For high quality listening, 320 kbps MP3 or 256 kbps AAC are excellent. Audiophiles prefer FLAC or WAV for lossless quality." }
  ],
  `File Size (MB) = (Bitrate kbps x Duration sec) / 8 / 1024`,
  ["podcast-production-cost-calculator", "album-production-budget-calculator", "music-streaming-revenue-calculator"]
);

add(
  "vinyl-record-value-calculator",
  "Vinyl Record Value Calculator",
  "Estimate the collectible value of a vinyl record based on condition, pressing, and rarity.",
  "Finance",
  "finance",
  "$",
  ["vinyl", "record", "collectible", "value", "LP", "pressing"],
  [
    '{ name: "basePrice", label: "Original/Catalog Price ($)", type: "number", min: 1, max: 1000, defaultValue: 25 }',
    '{ name: "condition", label: "Record Condition", type: "select", options: [{ value: "5", label: "Mint (M)" }, { value: "4", label: "Near Mint (NM)" }, { value: "3", label: "Very Good Plus (VG+)" }, { value: "2", label: "Very Good (VG)" }, { value: "1", label: "Good (G)" }], defaultValue: "3" }',
    '{ name: "pressing", label: "Pressing Type", type: "select", options: [{ value: "3", label: "First Pressing" }, { value: "2", label: "Early Reissue" }, { value: "1.2", label: "Modern Reissue" }, { value: "4", label: "Limited/Colored" }], defaultValue: "1.2" }',
    '{ name: "age", label: "Age (years)", type: "number", min: 0, max: 80, defaultValue: 30 }'
  ],
  `(inputs) => {
    const basePrice = inputs.basePrice as number;
    const condition = inputs.condition as number;
    const pressing = inputs.pressing as number;
    const age = inputs.age as number;
    const conditionMultiplier = condition / 3;
    const ageMultiplier = 1 + (age * 0.02);
    const estimatedValue = basePrice * conditionMultiplier * pressing * ageMultiplier;
    const conditionLabels = { 5: "Mint", 4: "Near Mint", 3: "VG+", 2: "VG", 1: "Good" };
    const appreciation = ((estimatedValue - basePrice) / basePrice) * 100;
    return {
      primary: { label: "Estimated Value", value: "$" + formatNumber(estimatedValue) },
      details: [
        { label: "Condition Grade", value: conditionLabels[condition] || "Unknown" },
        { label: "Pressing Multiplier", value: formatNumber(pressing) + "x" },
        { label: "Age Factor", value: formatNumber(ageMultiplier) + "x" },
        { label: "Value Appreciation", value: formatNumber(appreciation) + "%" }
      ]
    };
  }`,
  [
    { q: "What makes a vinyl record valuable?", a: "First pressings, limited editions, condition, and cultural significance are the primary factors that determine a record's value." },
    { q: "How does condition affect vinyl value?", a: "Condition is the biggest factor. A Mint record can be worth 5-10 times more than the same record in Good condition." },
    { q: "Are colored vinyl records worth more?", a: "Limited colored pressings often carry a premium, especially if the run was small and the album is popular." }
  ],
  `Estimated Value = Base Price x Condition Multiplier x Pressing Multiplier x Age Factor`,
  ["instrument-depreciation-calculator", "concert-ticket-value-calculator", "album-production-budget-calculator"]
);

add(
  "guitar-string-gauge-calculator",
  "Guitar String Gauge Calculator",
  "Find the right guitar string gauge and tension for your tuning and scale length.",
  "Everyday",
  "everyday",
  "~",
  ["guitar", "string gauge", "tension", "tuning", "guitar strings"],
  [
    '{ name: "scaleLength", label: "Scale Length (inches)", type: "number", min: 20, max: 30, defaultValue: 25.5 }',
    '{ name: "tuning", label: "Tuning", type: "select", options: [{ value: "1", label: "Standard (E)" }, { value: "2", label: "Half Step Down (Eb)" }, { value: "3", label: "Drop D" }, { value: "4", label: "Full Step Down (D)" }, { value: "5", label: "Drop C" }], defaultValue: "1" }',
    '{ name: "playStyle", label: "Playing Style", type: "select", options: [{ value: "1", label: "Light (9-42)" }, { value: "2", label: "Regular (10-46)" }, { value: "3", label: "Medium (11-49)" }, { value: "4", label: "Heavy (12-54)" }], defaultValue: "2" }',
    '{ name: "stringCount", label: "Number of Strings", type: "select", options: [{ value: "6", label: "6 String" }, { value: "7", label: "7 String" }, { value: "8", label: "8 String" }], defaultValue: "6" }'
  ],
  `(inputs) => {
    const scaleLength = inputs.scaleLength as number;
    const tuning = inputs.tuning as number;
    const playStyle = inputs.playStyle as number;
    const stringCount = inputs.stringCount as number;
    const gauges = { 1: "9-42", 2: "10-46", 3: "11-49", 4: "12-54" };
    const tensionBase = { 1: 14.5, 2: 17.5, 3: 21, 4: 24.5 };
    const tuningFactor = { 1: 1, 2: 0.94, 3: 0.95, 4: 0.89, 5: 0.84 };
    const tuningLabels = { 1: "Standard E", 2: "Eb Standard", 3: "Drop D", 4: "D Standard", 5: "Drop C" };
    const tension = tensionBase[playStyle] * tuningFactor[tuning] * (scaleLength / 25.5);
    const totalTension = tension * stringCount;
    const gaugeSet = gauges[playStyle];
    const recommendation = tuning >= 4 && playStyle < 3 ? "Consider heavier gauge for lower tunings" : "Good match for this tuning";
    return {
      primary: { label: "Recommended Gauge Set", value: gaugeSet },
      details: [
        { label: "Avg String Tension", value: formatNumber(tension) + " lbs" },
        { label: "Total Neck Tension", value: formatNumber(totalTension) + " lbs" },
        { label: "Tuning", value: tuningLabels[tuning] },
        { label: "Recommendation", value: recommendation }
      ]
    };
  }`,
  [
    { q: "What guitar string gauge should I use?", a: "Beginners and players who do lots of bending prefer lighter gauges (9-42). Rhythm players and lower tunings benefit from heavier gauges." },
    { q: "Does scale length affect string tension?", a: "Yes, longer scale lengths produce higher tension for the same gauge. A 25.5 inch Fender has more tension than a 24.75 inch Gibson." },
    { q: "Should I use heavier strings for drop tuning?", a: "Yes, heavier strings help maintain tension and prevent buzzing when tuning down." }
  ],
  `String Tension = Base Tension x Tuning Factor x (Scale Length / 25.5)`,
  ["drum-tuning-frequency-calculator", "instrument-depreciation-calculator", "music-key-transposer-calculator"]
);

add(
  "drum-tuning-frequency-calculator",
  "Drum Tuning Frequency Calculator",
  "Calculate the fundamental frequency and interval for drum tuning across your kit.",
  "Science",
  "science",
  "A",
  ["drum tuning", "frequency", "drum pitch", "percussion", "drum head"],
  [
    '{ name: "drumDiameter", label: "Drum Diameter (inches)", type: "number", min: 6, max: 26, defaultValue: 14 }',
    '{ name: "drumType", label: "Drum Type", type: "select", options: [{ value: "1", label: "Snare" }, { value: "2", label: "Rack Tom" }, { value: "3", label: "Floor Tom" }, { value: "4", label: "Bass Drum" }], defaultValue: "1" }',
    '{ name: "tuningStyle", label: "Tuning Style", type: "select", options: [{ value: "1", label: "Jazz (Higher)" }, { value: "2", label: "Rock (Medium)" }, { value: "3", label: "Metal (Lower)" }], defaultValue: "2" }',
    '{ name: "headType", label: "Head Type", type: "select", options: [{ value: "1", label: "Single Ply (Brighter)" }, { value: "2", label: "Double Ply (Warmer)" }], defaultValue: "1" }'
  ],
  `(inputs) => {
    const diameter = inputs.drumDiameter as number;
    const drumType = inputs.drumType as number;
    const tuningStyle = inputs.tuningStyle as number;
    const headType = inputs.headType as number;
    const baseFreqs = { 1: 200, 2: 170, 3: 100, 4: 60 };
    const tuningMult = { 1: 1.2, 2: 1.0, 3: 0.8 };
    const headMult = { 1: 1.05, 2: 0.95 };
    const sizeRef = { 1: 14, 2: 12, 3: 16, 4: 22 };
    const refDiam = sizeRef[drumType];
    const freq = baseFreqs[drumType] * (refDiam / diameter) * tuningMult[tuningStyle] * headMult[headType];
    const drumLabels = { 1: "Snare", 2: "Rack Tom", 3: "Floor Tom", 4: "Bass Drum" };
    const noteNames = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
    const midiNote = 12 * Math.log2(freq / 440) + 69;
    const nearestNote = noteNames[Math.round(midiNote) % 12];
    const octave = Math.floor(Math.round(midiNote) / 12) - 1;
    return {
      primary: { label: "Target Frequency", value: formatNumber(freq) + " Hz" },
      details: [
        { label: "Nearest Note", value: nearestNote + octave },
        { label: "Drum Type", value: drumLabels[drumType] },
        { label: "Diameter", value: formatNumber(diameter) + " inches" },
        { label: "MIDI Note", value: formatNumber(Math.round(midiNote)) }
      ]
    };
  }`,
  [
    { q: "What frequency should I tune my snare to?", a: "A 14-inch snare is typically tuned between 180-250 Hz depending on the style. Jazz players tune higher, metal drummers lower." },
    { q: "How do I tune drums by ear?", a: "Tap near each lug and adjust until each point produces the same pitch, then adjust overall tension for desired pitch." },
    { q: "Should toms be tuned to specific notes?", a: "Many drummers tune toms in musical intervals such as thirds or fourths for a melodic sound across the kit." }
  ],
  `Frequency = Base Freq x (Ref Diameter / Actual Diameter) x Tuning x Head Factor`,
  ["guitar-string-gauge-calculator", "bpm-tempo-calculator", "equalizer-frequency-calculator"]
);

add(
  "studio-recording-cost-calculator",
  "Studio Recording Cost Calculator",
  "Estimate the total cost of recording a song or album at a professional studio.",
  "Finance",
  "finance",
  "$",
  ["studio", "recording", "cost", "music production", "session"],
  [
    '{ name: "studioRate", label: "Studio Hourly Rate ($)", type: "number", min: 20, max: 500, defaultValue: 75 }',
    '{ name: "hoursPerSong", label: "Hours Per Song", type: "number", min: 1, max: 40, defaultValue: 6 }',
    '{ name: "numSongs", label: "Number of Songs", type: "number", min: 1, max: 30, defaultValue: 10 }',
    '{ name: "mixingRate", label: "Mixing Cost Per Song ($)", type: "number", min: 50, max: 2000, defaultValue: 200 }',
    '{ name: "masteringRate", label: "Mastering Cost Per Song ($)", type: "number", min: 30, max: 500, defaultValue: 100 }'
  ],
  `(inputs) => {
    const studioRate = inputs.studioRate as number;
    const hoursPerSong = inputs.hoursPerSong as number;
    const numSongs = inputs.numSongs as number;
    const mixingRate = inputs.mixingRate as number;
    const masteringRate = inputs.masteringRate as number;
    const trackingCost = studioRate * hoursPerSong * numSongs;
    const mixingCost = mixingRate * numSongs;
    const masteringCost = masteringRate * numSongs;
    const totalCost = trackingCost + mixingCost + masteringCost;
    const costPerSong = totalCost / numSongs;
    const totalHours = hoursPerSong * numSongs;
    return {
      primary: { label: "Total Production Cost", value: "$" + formatNumber(totalCost) },
      details: [
        { label: "Tracking Cost", value: "$" + formatNumber(trackingCost) },
        { label: "Mixing Cost", value: "$" + formatNumber(mixingCost) },
        { label: "Mastering Cost", value: "$" + formatNumber(masteringCost) },
        { label: "Cost Per Song", value: "$" + formatNumber(costPerSong) },
        { label: "Total Studio Hours", value: formatNumber(totalHours) }
      ]
    };
  }`,
  [
    { q: "How much does it cost to record a song?", a: "Recording a professional song typically costs $300 to $2,000 including tracking, mixing, and mastering." },
    { q: "What is the difference between mixing and mastering?", a: "Mixing balances individual tracks into a stereo mix. Mastering polishes the final mix for consistent playback across all systems." },
    { q: "How long does it take to record a song?", a: "A well-rehearsed song can be tracked in 4-8 hours. Complex productions may require 20+ hours." }
  ],
  `Total = (Studio Rate x Hours x Songs) + (Mixing x Songs) + (Mastering x Songs)`,
  ["album-production-budget-calculator", "music-streaming-revenue-calculator", "podcast-production-cost-calculator"]
);

add(
  "album-production-budget-calculator",
  "Album Production Budget Calculator",
  "Plan your complete album budget including recording, artwork, distribution, and marketing.",
  "Finance",
  "finance",
  "$",
  ["album", "budget", "production", "music release", "indie"],
  [
    '{ name: "recordingCost", label: "Total Recording Cost ($)", type: "number", min: 500, max: 100000, defaultValue: 5000 }',
    '{ name: "artworkCost", label: "Album Artwork ($)", type: "number", min: 0, max: 5000, defaultValue: 500 }',
    '{ name: "distributionCost", label: "Distribution Fee ($)", type: "number", min: 0, max: 1000, defaultValue: 50 }',
    '{ name: "marketingBudget", label: "Marketing Budget ($)", type: "number", min: 0, max: 50000, defaultValue: 1000 }',
    '{ name: "musicVideoCost", label: "Music Video Cost ($)", type: "number", min: 0, max: 50000, defaultValue: 2000 }'
  ],
  `(inputs) => {
    const recordingCost = inputs.recordingCost as number;
    const artworkCost = inputs.artworkCost as number;
    const distributionCost = inputs.distributionCost as number;
    const marketingBudget = inputs.marketingBudget as number;
    const musicVideoCost = inputs.musicVideoCost as number;
    const totalBudget = recordingCost + artworkCost + distributionCost + marketingBudget + musicVideoCost;
    const recordingPct = (recordingCost / totalBudget) * 100;
    const marketingPct = (marketingBudget / totalBudget) * 100;
    const streamsToRecoup = Math.ceil(totalBudget / 0.004);
    return {
      primary: { label: "Total Album Budget", value: "$" + formatNumber(totalBudget) },
      details: [
        { label: "Recording", value: "$" + formatNumber(recordingCost) + " (" + formatNumber(recordingPct) + "%)" },
        { label: "Marketing", value: "$" + formatNumber(marketingBudget) + " (" + formatNumber(marketingPct) + "%)" },
        { label: "Music Video", value: "$" + formatNumber(musicVideoCost) },
        { label: "Streams to Recoup (Spotify)", value: formatNumber(streamsToRecoup) }
      ]
    };
  }`,
  [
    { q: "How much does it cost to produce an album?", a: "Indie albums typically cost $5,000 to $25,000. Professional major label albums can cost $100,000 or more." },
    { q: "What percentage should go to marketing?", a: "Industry standard suggests spending 20-30% of your total album budget on marketing and promotion." },
    { q: "Is a music video worth the investment?", a: "Music videos significantly boost engagement and streaming numbers. Even a low-budget video can increase visibility." }
  ],
  `Total Budget = Recording + Artwork + Distribution + Marketing + Music Video`,
  ["studio-recording-cost-calculator", "music-streaming-revenue-calculator", "music-royalty-split-calculator"]
);

add(
  "instrument-depreciation-calculator",
  "Instrument Depreciation Calculator",
  "Estimate how much a musical instrument depreciates over time based on type and condition.",
  "Finance",
  "finance",
  "$",
  ["instrument", "depreciation", "value", "resale", "musical instrument"],
  [
    '{ name: "purchasePrice", label: "Purchase Price ($)", type: "number", min: 50, max: 200000, defaultValue: 1500 }',
    '{ name: "yearsOwned", label: "Years Owned", type: "number", min: 0, max: 50, defaultValue: 5 }',
    '{ name: "instrumentType", label: "Instrument Type", type: "select", options: [{ value: "1", label: "Electric Guitar/Bass" }, { value: "2", label: "Acoustic Guitar" }, { value: "3", label: "Piano/Keyboard" }, { value: "4", label: "Drums" }, { value: "5", label: "Vintage/Collectible" }], defaultValue: "1" }',
    '{ name: "condition", label: "Current Condition", type: "select", options: [{ value: "1", label: "Excellent" }, { value: "0.85", label: "Good" }, { value: "0.7", label: "Fair" }, { value: "0.5", label: "Poor" }], defaultValue: "0.85" }'
  ],
  `(inputs) => {
    const purchasePrice = inputs.purchasePrice as number;
    const yearsOwned = inputs.yearsOwned as number;
    const instrumentType = inputs.instrumentType as number;
    const condition = inputs.condition as number;
    const depRates = { 1: 0.07, 2: 0.05, 3: 0.08, 4: 0.09, 5: -0.03 };
    const annualRate = depRates[instrumentType] || 0.07;
    let currentValue;
    if (annualRate < 0) {
      currentValue = purchasePrice * Math.pow(1 + Math.abs(annualRate), yearsOwned) * condition;
    } else {
      currentValue = purchasePrice * Math.pow(1 - annualRate, yearsOwned) * condition;
    }
    const totalDepreciation = purchasePrice - currentValue;
    const percentLost = (totalDepreciation / purchasePrice) * 100;
    const typeLabels = { 1: "Electric Guitar/Bass", 2: "Acoustic Guitar", 3: "Piano/Keyboard", 4: "Drums", 5: "Vintage/Collectible" };
    return {
      primary: { label: "Current Estimated Value", value: "$" + formatNumber(currentValue) },
      details: [
        { label: "Original Price", value: "$" + formatNumber(purchasePrice) },
        { label: "Total Change", value: "$" + formatNumber(Math.abs(totalDepreciation)) + (totalDepreciation < 0 ? " (Gain)" : " (Loss)") },
        { label: "Percentage Change", value: formatNumber(Math.abs(percentLost)) + "%" },
        { label: "Instrument Type", value: typeLabels[instrumentType] }
      ]
    };
  }`,
  [
    { q: "Do musical instruments lose value?", a: "Most instruments depreciate 5-10% annually, but vintage and high-end instruments can appreciate significantly." },
    { q: "Which instruments hold their value best?", a: "Acoustic guitars and vintage instruments tend to hold value best. Quality brand-name instruments depreciate less." },
    { q: "When does an instrument become vintage?", a: "Generally instruments over 20-30 years old are considered vintage, and those over 50 years may be called antique." }
  ],
  `Current Value = Purchase Price x (1 - Depreciation Rate)^Years x Condition Factor`,
  ["vinyl-record-value-calculator", "guitar-string-gauge-calculator", "concert-ticket-value-calculator"]
);

add(
  "speaker-room-size-calculator",
  "Speaker Room Size Calculator",
  "Determine the ideal speaker placement and count for optimal room coverage.",
  "Everyday",
  "everyday",
  "~",
  ["speaker placement", "room size", "audio", "surround sound", "home theater"],
  [
    '{ name: "roomLength", label: "Room Length (ft)", type: "number", min: 5, max: 100, defaultValue: 20 }',
    '{ name: "roomWidth", label: "Room Width (ft)", type: "number", min: 5, max: 100, defaultValue: 15 }',
    '{ name: "ceilingHeight", label: "Ceiling Height (ft)", type: "number", min: 7, max: 20, defaultValue: 9 }',
    '{ name: "purpose", label: "Purpose", type: "select", options: [{ value: "1", label: "Stereo Music" }, { value: "2", label: "Home Theater 5.1" }, { value: "3", label: "Home Theater 7.1" }, { value: "4", label: "Whole Room Background" }], defaultValue: "1" }'
  ],
  `(inputs) => {
    const length = inputs.roomLength as number;
    const width = inputs.roomWidth as number;
    const ceilingHeight = inputs.ceilingHeight as number;
    const purpose = inputs.purpose as number;
    const area = length * width;
    const volume = area * ceilingHeight;
    const speakerCounts = { 1: 2, 2: 6, 3: 8, 4: Math.ceil(area / 150) * 2 };
    const speakers = speakerCounts[purpose];
    const idealDistance = length * 0.38;
    const listenerDistance = length * 0.62;
    const purposeLabels = { 1: "Stereo Music", 2: "Home Theater 5.1", 3: "Home Theater 7.1", 4: "Whole Room Background" };
    const minWatts = Math.ceil(area * 0.5);
    return {
      primary: { label: "Recommended Speakers", value: formatNumber(speakers) },
      details: [
        { label: "Room Volume", value: formatNumber(volume) + " cu ft" },
        { label: "Room Area", value: formatNumber(area) + " sq ft" },
        { label: "Speaker Distance from Wall", value: formatNumber(idealDistance) + " ft" },
        { label: "Min Power Per Speaker", value: formatNumber(minWatts) + " W" },
        { label: "Setup Type", value: purposeLabels[purpose] }
      ]
    };
  }`,
  [
    { q: "How far should speakers be from the wall?", a: "Speakers should generally be at least 2-3 feet from walls and about 38% of the room length from the front wall." },
    { q: "What is the ideal room size for a home theater?", a: "A room of 200-400 square feet with 9-10 foot ceilings provides excellent home theater acoustics." },
    { q: "Do I need a subwoofer for a small room?", a: "Even in small rooms, a subwoofer handles low frequencies that regular speakers cannot reproduce effectively." }
  ],
  `Speaker Distance = Room Length x 0.38\nListener Position = Room Length x 0.62`,
  ["speaker-wattage-calculator", "subwoofer-box-volume-calculator", "soundproofing-cost-calculator"]
);

add(
  "subwoofer-box-volume-calculator",
  "Subwoofer Box Volume Calculator",
  "Calculate the optimal sealed or ported enclosure volume for your subwoofer driver.",
  "Science",
  "science",
  "A",
  ["subwoofer", "box volume", "enclosure", "speaker box", "car audio"],
  [
    '{ name: "driverSize", label: "Driver Size (inches)", type: "select", options: [{ value: "8", label: "8 inch" }, { value: "10", label: "10 inch" }, { value: "12", label: "12 inch" }, { value: "15", label: "15 inch" }, { value: "18", label: "18 inch" }], defaultValue: "12" }',
    '{ name: "enclosureType", label: "Enclosure Type", type: "select", options: [{ value: "1", label: "Sealed (Tight Bass)" }, { value: "2", label: "Ported (Louder Bass)" }], defaultValue: "1" }',
    '{ name: "numDrivers", label: "Number of Drivers", type: "number", min: 1, max: 4, defaultValue: 1 }',
    '{ name: "vas", label: "Vas (Equivalent Volume, liters)", type: "number", min: 5, max: 300, defaultValue: 50 }'
  ],
  `(inputs) => {
    const driverSize = inputs.driverSize as number;
    const enclosureType = inputs.enclosureType as number;
    const numDrivers = inputs.numDrivers as number;
    const vas = inputs.vas as number;
    const sealedMultiplier = 0.7;
    const portedMultiplier = 1.5;
    const multiplier = enclosureType === 1 ? sealedMultiplier : portedMultiplier;
    const volumePerDriver = vas * multiplier;
    const totalVolumeLiters = volumePerDriver * numDrivers;
    const totalVolumeCuFt = totalVolumeLiters * 0.0353147;
    const encLabel = enclosureType === 1 ? "Sealed" : "Ported";
    const portDiameter = enclosureType === 2 ? driverSize * 0.4 : 0;
    const portLength = enclosureType === 2 ? Math.round(driverSize * 1.5) : 0;
    return {
      primary: { label: "Total Enclosure Volume", value: formatNumber(totalVolumeCuFt) + " cu ft" },
      details: [
        { label: "Volume in Liters", value: formatNumber(totalVolumeLiters) + " L" },
        { label: "Volume Per Driver", value: formatNumber(volumePerDriver * 0.0353147) + " cu ft" },
        { label: "Enclosure Type", value: encLabel },
        { label: enclosureType === 2 ? "Port Diameter" : "Box Type", value: enclosureType === 2 ? formatNumber(portDiameter) + " inches" : "Sealed - No Port" }
      ]
    };
  }`,
  [
    { q: "Is a sealed or ported subwoofer box better?", a: "Sealed boxes produce tighter, more accurate bass while ported boxes are louder and more efficient but less precise." },
    { q: "Does box volume affect bass quality?", a: "Yes, too small a box makes bass sound thin and boomy, while too large a box reduces output and control." },
    { q: "What size box do I need for a 12-inch sub?", a: "A 12-inch subwoofer typically needs 1.0-1.5 cubic feet sealed or 2.0-3.0 cubic feet ported." }
  ],
  `Sealed Volume = Vas x 0.7 per driver\nPorted Volume = Vas x 1.5 per driver`,
  ["speaker-wattage-calculator", "speaker-room-size-calculator", "microphone-sensitivity-calculator"]
);

add(
  "microphone-sensitivity-calculator",
  "Microphone Sensitivity Calculator",
  "Convert microphone sensitivity between dBV and mV/Pa and calculate output levels.",
  "Science",
  "science",
  "A",
  ["microphone", "sensitivity", "dBV", "preamp", "gain", "audio"],
  [
    '{ name: "sensitivityDBV", label: "Sensitivity (dBV/Pa)", type: "number", min: -70, max: -10, defaultValue: -40 }',
    '{ name: "spl", label: "Sound Pressure Level (dB SPL)", type: "number", min: 40, max: 140, defaultValue: 85 }',
    '{ name: "preampGain", label: "Preamp Gain (dB)", type: "number", min: 0, max: 70, defaultValue: 30 }',
    '{ name: "micType", label: "Microphone Type", type: "select", options: [{ value: "1", label: "Dynamic" }, { value: "2", label: "Condenser (Large)" }, { value: "3", label: "Condenser (Small)" }, { value: "4", label: "Ribbon" }], defaultValue: "1" }'
  ],
  `(inputs) => {
    const sensitivityDBV = inputs.sensitivityDBV as number;
    const spl = inputs.spl as number;
    const preampGain = inputs.preampGain as number;
    const micType = inputs.micType as number;
    const mvPerPa = Math.pow(10, sensitivityDBV / 20) * 1000;
    const splPa = Math.pow(10, (spl - 94) / 20);
    const outputVoltage = (mvPerPa / 1000) * splPa;
    const outputDBV = 20 * Math.log10(outputVoltage);
    const afterPreamp = outputDBV + preampGain;
    const micLabels = { 1: "Dynamic", 2: "Large Condenser", 3: "Small Condenser", 4: "Ribbon" };
    const headroom = -afterPreamp;
    return {
      primary: { label: "Output Level (after preamp)", value: formatNumber(afterPreamp) + " dBV" },
      details: [
        { label: "Sensitivity", value: formatNumber(mvPerPa) + " mV/Pa" },
        { label: "Raw Output Voltage", value: formatNumber(outputVoltage * 1000) + " mV" },
        { label: "Mic Type", value: micLabels[micType] },
        { label: "Headroom to Clip", value: formatNumber(Math.abs(headroom)) + " dB" }
      ]
    };
  }`,
  [
    { q: "What is microphone sensitivity?", a: "Sensitivity measures how much electrical output a microphone produces for a given sound pressure, usually measured in dBV/Pa." },
    { q: "Is higher or lower sensitivity better?", a: "Neither is inherently better. Higher sensitivity mics need less gain but may clip on loud sources. Lower sensitivity mics handle louder sounds." },
    { q: "What sensitivity do I need for vocals?", a: "For vocals, a large diaphragm condenser with around -30 to -40 dBV sensitivity is ideal for most recording situations." }
  ],
  `mV/Pa = 10^(dBV/20) x 1000\nOutput = Sensitivity x SPL Pressure x Preamp Gain`,
  ["equalizer-frequency-calculator", "drum-tuning-frequency-calculator", "speaker-wattage-calculator"]
);

add(
  "equalizer-frequency-calculator",
  "Equalizer Frequency Calculator",
  "Find the right EQ frequencies to boost or cut for common instruments and vocals.",
  "Everyday",
  "everyday",
  "~",
  ["EQ", "equalizer", "frequency", "mixing", "audio production"],
  [
    '{ name: "source", label: "Audio Source", type: "select", options: [{ value: "1", label: "Vocals" }, { value: "2", label: "Kick Drum" }, { value: "3", label: "Snare Drum" }, { value: "4", label: "Electric Guitar" }, { value: "5", label: "Bass Guitar" }, { value: "6", label: "Acoustic Guitar" }], defaultValue: "1" }',
    '{ name: "problem", label: "Sound Problem", type: "select", options: [{ value: "1", label: "Too Muddy" }, { value: "2", label: "Too Harsh" }, { value: "3", label: "Lacks Presence" }, { value: "4", label: "Too Thin" }, { value: "5", label: "Too Boomy" }], defaultValue: "1" }',
    '{ name: "cutAmount", label: "Cut/Boost Amount (dB)", type: "number", min: 1, max: 12, defaultValue: 3 }'
  ],
  `(inputs) => {
    const source = inputs.source as number;
    const problem = inputs.problem as number;
    const cutAmount = inputs.cutAmount as number;
    const freqMap = {
      "1_1": { freq: "200-400 Hz", action: "Cut", desc: "Reduce muddiness in vocals" },
      "1_2": { freq: "2-4 kHz", action: "Cut", desc: "Tame harsh sibilance" },
      "1_3": { freq: "3-5 kHz", action: "Boost", desc: "Add vocal presence and clarity" },
      "1_4": { freq: "100-200 Hz", action: "Boost", desc: "Add warmth and body" },
      "1_5": { freq: "80-150 Hz", action: "Cut", desc: "Reduce proximity boom" },
      "2_1": { freq: "300-500 Hz", action: "Cut", desc: "Clean up kick mud" },
      "2_2": { freq: "3-5 kHz", action: "Cut", desc: "Reduce beater harshness" },
      "2_3": { freq: "2-4 kHz", action: "Boost", desc: "Add click and attack" },
      "2_4": { freq: "60-80 Hz", action: "Boost", desc: "Add low-end thump" },
      "2_5": { freq: "200-400 Hz", action: "Cut", desc: "Reduce boominess" },
      "3_1": { freq: "300-600 Hz", action: "Cut", desc: "Remove snare mud" },
      "3_2": { freq: "1-2 kHz", action: "Cut", desc: "Reduce harshness" },
      "3_3": { freq: "3-5 kHz", action: "Boost", desc: "Add snare crack" },
      "3_4": { freq: "150-250 Hz", action: "Boost", desc: "Add body to snare" },
      "3_5": { freq: "200-400 Hz", action: "Cut", desc: "Tighten snare tone" },
      "4_1": { freq: "300-500 Hz", action: "Cut", desc: "Clean guitar mud" },
      "4_2": { freq: "2-4 kHz", action: "Cut", desc: "Reduce guitar bite" },
      "4_3": { freq: "3-6 kHz", action: "Boost", desc: "Add presence" },
      "4_4": { freq: "200-400 Hz", action: "Boost", desc: "Add warmth" },
      "4_5": { freq: "100-250 Hz", action: "Cut", desc: "Reduce low boom" },
      "5_1": { freq: "200-400 Hz", action: "Cut", desc: "Clean bass mud" },
      "5_2": { freq: "800-1.5k Hz", action: "Cut", desc: "Reduce clank" },
      "5_3": { freq: "700-1k Hz", action: "Boost", desc: "Add growl and presence" },
      "5_4": { freq: "60-100 Hz", action: "Boost", desc: "Add deep low end" },
      "5_5": { freq: "80-200 Hz", action: "Cut", desc: "Tighten bass" },
      "6_1": { freq: "200-400 Hz", action: "Cut", desc: "Remove body mud" },
      "6_2": { freq: "2-5 kHz", action: "Cut", desc: "Reduce string harshness" },
      "6_3": { freq: "5-8 kHz", action: "Boost", desc: "Add shimmer" },
      "6_4": { freq: "100-200 Hz", action: "Boost", desc: "Add body warmth" },
      "6_5": { freq: "100-200 Hz", action: "Cut", desc: "Reduce boom" }
    };
    const key = source + "_" + problem;
    const result = freqMap[key] || { freq: "1 kHz", action: "Cut", desc: "General adjustment" };
    return {
      primary: { label: "Target Frequency", value: result.freq },
      details: [
        { label: "Action", value: result.action + " " + formatNumber(cutAmount) + " dB" },
        { label: "Description", value: result.desc },
        { label: "Q Width", value: result.action === "Cut" ? "Narrow (High Q)" : "Moderate (Medium Q)" },
        { label: "Tip", value: "Always cut before boosting" }
      ]
    };
  }`,
  [
    { q: "What is EQ in music production?", a: "EQ (equalization) adjusts the balance of frequency components in audio, allowing you to shape tone by boosting or cutting specific frequencies." },
    { q: "Should I boost or cut frequencies?", a: "Cutting is generally preferred over boosting. Subtractive EQ sounds more natural and avoids introducing noise or distortion." },
    { q: "What frequencies are muddy?", a: "Muddiness typically lives in the 200-500 Hz range. Cutting here can dramatically clean up a mix." }
  ],
  `EQ adjustments based on source instrument and identified problem frequency range`,
  ["microphone-sensitivity-calculator", "drum-tuning-frequency-calculator", "bpm-tempo-calculator"]
);

add(
  "music-royalty-split-calculator",
  "Music Royalty Split Calculator",
  "Calculate fair royalty splits between songwriters, producers, and performers.",
  "Finance",
  "finance",
  "$",
  ["royalty", "split", "songwriting", "publishing", "music income"],
  [
    '{ name: "totalRevenue", label: "Total Revenue ($)", type: "number", min: 100, max: 10000000, defaultValue: 10000 }',
    '{ name: "numWriters", label: "Number of Songwriters", type: "number", min: 1, max: 10, defaultValue: 2 }',
    '{ name: "producerPct", label: "Producer Share (%)", type: "number", min: 0, max: 50, defaultValue: 20 }',
    '{ name: "labelPct", label: "Label/Distributor Share (%)", type: "number", min: 0, max: 80, defaultValue: 15 }',
    '{ name: "managerPct", label: "Manager Commission (%)", type: "number", min: 0, max: 25, defaultValue: 15 }'
  ],
  `(inputs) => {
    const totalRevenue = inputs.totalRevenue as number;
    const numWriters = inputs.numWriters as number;
    const producerPct = inputs.producerPct as number;
    const labelPct = inputs.labelPct as number;
    const managerPct = inputs.managerPct as number;
    const labelCut = totalRevenue * (labelPct / 100);
    const afterLabel = totalRevenue - labelCut;
    const producerCut = afterLabel * (producerPct / 100);
    const afterProducer = afterLabel - producerCut;
    const managerCut = afterProducer * (managerPct / 100);
    const afterManager = afterProducer - managerCut;
    const perWriter = afterManager / numWriters;
    const writerPctOfTotal = (perWriter / totalRevenue) * 100;
    return {
      primary: { label: "Per Songwriter Share", value: "$" + formatNumber(perWriter) },
      details: [
        { label: "Label/Distributor Take", value: "$" + formatNumber(labelCut) },
        { label: "Producer Take", value: "$" + formatNumber(producerCut) },
        { label: "Manager Take", value: "$" + formatNumber(managerCut) },
        { label: "Writer % of Total", value: formatNumber(writerPctOfTotal) + "%" }
      ]
    };
  }`,
  [
    { q: "How are music royalties typically split?", a: "A common split is 50% songwriter share and 50% publisher share. Producer points typically come from the artist's share." },
    { q: "What percentage does a music producer get?", a: "Producers typically receive 15-25% of recording royalties, sometimes as 3-5 'points' on the album." },
    { q: "What does a music manager take?", a: "Music managers typically take 15-20% of the artist's gross income from all music-related revenue." }
  ],
  `Per Writer = (Revenue - Label Cut - Producer Cut - Manager Cut) / Writers`,
  ["music-streaming-revenue-calculator", "album-production-budget-calculator", "podcast-production-cost-calculator"]
);

add(
  "podcast-production-cost-calculator",
  "Podcast Production Cost Calculator",
  "Estimate the costs of starting and running a podcast including equipment, hosting, and editing.",
  "Finance",
  "finance",
  "$",
  ["podcast", "production", "cost", "audio", "hosting", "editing"],
  [
    '{ name: "equipmentCost", label: "Equipment Cost ($)", type: "number", min: 50, max: 10000, defaultValue: 500 }',
    '{ name: "editingRate", label: "Editing Cost Per Episode ($)", type: "number", min: 0, max: 500, defaultValue: 75 }',
    '{ name: "hostingMonthly", label: "Monthly Hosting Fee ($)", type: "number", min: 0, max: 100, defaultValue: 20 }',
    '{ name: "episodesPerMonth", label: "Episodes Per Month", type: "number", min: 1, max: 30, defaultValue: 4 }',
    '{ name: "months", label: "Duration (months)", type: "number", min: 1, max: 60, defaultValue: 12 }'
  ],
  `(inputs) => {
    const equipmentCost = inputs.equipmentCost as number;
    const editingRate = inputs.editingRate as number;
    const hostingMonthly = inputs.hostingMonthly as number;
    const episodesPerMonth = inputs.episodesPerMonth as number;
    const months = inputs.months as number;
    const totalEpisodes = episodesPerMonth * months;
    const totalEditing = editingRate * totalEpisodes;
    const totalHosting = hostingMonthly * months;
    const totalCost = equipmentCost + totalEditing + totalHosting;
    const costPerEpisode = totalCost / totalEpisodes;
    const monthlyCost = (totalEditing + totalHosting) / months;
    return {
      primary: { label: "Total Cost (" + months + " months)", value: "$" + formatNumber(totalCost) },
      details: [
        { label: "Equipment (One-Time)", value: "$" + formatNumber(equipmentCost) },
        { label: "Total Editing Cost", value: "$" + formatNumber(totalEditing) },
        { label: "Total Hosting", value: "$" + formatNumber(totalHosting) },
        { label: "Cost Per Episode", value: "$" + formatNumber(costPerEpisode) },
        { label: "Monthly Recurring", value: "$" + formatNumber(monthlyCost) }
      ]
    };
  }`,
  [
    { q: "How much does it cost to start a podcast?", a: "A basic podcast setup can start at $100-200 for equipment. A professional setup with editing services runs $500-2000 to launch." },
    { q: "Should I pay for podcast editing?", a: "Professional editing costs $50-150 per episode but significantly improves audio quality and listener retention." },
    { q: "What equipment do I need for a podcast?", a: "At minimum you need a USB microphone ($50-100), headphones ($30-50), and recording software (free options available)." }
  ],
  `Total Cost = Equipment + (Editing x Episodes) + (Hosting x Months)`,
  ["studio-recording-cost-calculator", "music-streaming-revenue-calculator", "soundproofing-cost-calculator"]
);

add(
  "concert-venue-capacity-calculator",
  "Concert Venue Capacity Calculator",
  "Calculate safe venue capacity, ticket revenue, and staffing needs for live music events.",
  "Everyday",
  "everyday",
  "~",
  ["venue", "capacity", "concert", "event", "live music", "safety"],
  [
    '{ name: "venueArea", label: "Venue Area (sq ft)", type: "number", min: 200, max: 500000, defaultValue: 5000 }',
    '{ name: "seatingType", label: "Seating Type", type: "select", options: [{ value: "1", label: "General Admission (Standing)" }, { value: "2", label: "Theater Seating" }, { value: "3", label: "Cabaret/Tables" }, { value: "4", label: "Festival (Outdoor)" }], defaultValue: "1" }',
    '{ name: "ticketPrice", label: "Avg Ticket Price ($)", type: "number", min: 5, max: 500, defaultValue: 35 }',
    '{ name: "stageArea", label: "Stage/Production Area (sq ft)", type: "number", min: 50, max: 50000, defaultValue: 500 }'
  ],
  `(inputs) => {
    const venueArea = inputs.venueArea as number;
    const seatingType = inputs.seatingType as number;
    const ticketPrice = inputs.ticketPrice as number;
    const stageArea = inputs.stageArea as number;
    const usableArea = venueArea - stageArea;
    const sqftPerPerson = { 1: 5, 2: 7, 3: 12, 4: 6 };
    const capacity = Math.floor(usableArea / sqftPerPerson[seatingType]);
    const grossRevenue = capacity * ticketPrice;
    const securityStaff = Math.ceil(capacity / 100);
    const barStaff = Math.ceil(capacity / 75);
    const totalStaff = securityStaff + barStaff + 2;
    const seatingLabels = { 1: "Standing GA", 2: "Theater", 3: "Cabaret/Tables", 4: "Festival" };
    return {
      primary: { label: "Max Capacity", value: formatNumber(capacity) + " people" },
      details: [
        { label: "Seating Type", value: seatingLabels[seatingType] },
        { label: "Gross Ticket Revenue", value: "$" + formatNumber(grossRevenue) },
        { label: "Security Staff Needed", value: formatNumber(securityStaff) },
        { label: "Total Staff Needed", value: formatNumber(totalStaff) },
        { label: "Usable Area", value: formatNumber(usableArea) + " sq ft" }
      ]
    };
  }`,
  [
    { q: "How many square feet per person at a concert?", a: "Standing general admission needs about 5-6 sq ft per person, seated venues need 7-12 sq ft per person." },
    { q: "How much security do I need for a concert?", a: "The general guideline is 1 security guard per 100 attendees, with more for high-energy or alcohol-serving events." },
    { q: "What is the maximum occupancy for a venue?", a: "Maximum occupancy is determined by fire codes, typically based on available floor space minus stage, exits, and aisles." }
  ],
  `Capacity = (Venue Area - Stage Area) / Sq Ft Per Person`,
  ["concert-ticket-value-calculator", "speaker-wattage-calculator", "soundproofing-cost-calculator"]
);

add(
  "soundproofing-cost-calculator",
  "Soundproofing Cost Calculator",
  "Estimate the cost of soundproofing a room for music practice, recording, or noise reduction.",
  "Finance",
  "finance",
  "$",
  ["soundproofing", "acoustic", "noise reduction", "studio", "insulation"],
  [
    '{ name: "roomArea", label: "Total Wall Area (sq ft)", type: "number", min: 50, max: 5000, defaultValue: 400 }',
    '{ name: "method", label: "Soundproofing Method", type: "select", options: [{ value: "1", label: "Basic (Foam Panels)" }, { value: "2", label: "Moderate (MLV + Insulation)" }, { value: "3", label: "Professional (Room in Room)" }, { value: "4", label: "DIY Acoustic Panels" }], defaultValue: "2" }',
    '{ name: "includeCeiling", label: "Include Ceiling", type: "select", options: [{ value: "1", label: "Yes" }, { value: "0", label: "No" }], defaultValue: "1" }',
    '{ name: "includeFlooring", label: "Include Floor Treatment", type: "select", options: [{ value: "1", label: "Yes" }, { value: "0", label: "No" }], defaultValue: "0" }'
  ],
  `(inputs) => {
    const roomArea = inputs.roomArea as number;
    const method = inputs.method as number;
    const includeCeiling = inputs.includeCeiling as number;
    const includeFlooring = inputs.includeFlooring as number;
    const costPerSqFt = { 1: 2.5, 2: 8, 3: 25, 4: 4 };
    const methodLabels = { 1: "Foam Panels", 2: "MLV + Insulation", 3: "Room in Room", 4: "DIY Panels" };
    const stcRating = { 1: "STC 25-30", 2: "STC 40-50", 3: "STC 55-65", 4: "STC 30-35" };
    const totalArea = roomArea + (includeCeiling === 1 ? roomArea * 0.4 : 0) + (includeFlooring === 1 ? roomArea * 0.35 : 0);
    const materialCost = totalArea * costPerSqFt[method];
    const laborCost = method === 4 ? 0 : materialCost * 0.5;
    const totalCost = materialCost + laborCost;
    return {
      primary: { label: "Total Soundproofing Cost", value: "$" + formatNumber(totalCost) },
      details: [
        { label: "Material Cost", value: "$" + formatNumber(materialCost) },
        { label: "Labor Cost", value: "$" + formatNumber(laborCost) },
        { label: "Method", value: methodLabels[method] },
        { label: "Noise Reduction", value: stcRating[method] },
        { label: "Total Treatment Area", value: formatNumber(totalArea) + " sq ft" }
      ]
    };
  }`,
  [
    { q: "How much does soundproofing cost per square foot?", a: "Basic foam panels cost $2-4 per sq ft. Professional soundproofing with MLV and isolation can cost $15-30 per sq ft." },
    { q: "What is the most effective soundproofing method?", a: "A room-within-a-room construction with decoupled walls is the most effective, achieving STC ratings of 55-65." },
    { q: "Can I soundproof a room myself?", a: "DIY options like acoustic foam, mass loaded vinyl, and weatherstripping are effective for moderate noise reduction at lower cost." }
  ],
  `Total Cost = (Wall + Ceiling + Floor Area) x Cost Per Sq Ft x (1 + Labor Factor)`,
  ["speaker-room-size-calculator", "studio-recording-cost-calculator", "concert-venue-capacity-calculator"]
);

add(
  "music-copyright-value-calculator",
  "Music Copyright Value Calculator",
  "Estimate the value of a music catalog based on annual revenue and industry multipliers.",
  "Finance",
  "finance",
  "$",
  ["copyright", "catalog", "music value", "publishing", "IP"],
  [
    '{ name: "annualRevenue", label: "Annual Revenue ($)", type: "number", min: 100, max: 100000000, defaultValue: 50000 }',
    '{ name: "catalogAge", label: "Catalog Age (years)", type: "number", min: 1, max: 60, defaultValue: 10 }',
    '{ name: "catalogType", label: "Catalog Type", type: "select", options: [{ value: "1", label: "Independent/Indie" }, { value: "2", label: "Established Artist" }, { value: "3", label: "Hit Catalog" }, { value: "4", label: "Evergreen Classics" }], defaultValue: "2" }',
    '{ name: "growthRate", label: "Revenue Growth Rate (%)", type: "number", min: -10, max: 30, defaultValue: 5 }'
  ],
  `(inputs) => {
    const annualRevenue = inputs.annualRevenue as number;
    const catalogAge = inputs.catalogAge as number;
    const catalogType = inputs.catalogType as number;
    const growthRate = inputs.growthRate as number;
    const multipliers = { 1: 8, 2: 15, 3: 22, 4: 28 };
    const multiplier = multipliers[catalogType];
    const ageFactor = catalogAge >= 20 ? 1.2 : catalogAge >= 10 ? 1.0 : 0.85;
    const growthFactor = 1 + (growthRate / 100);
    const estimatedValue = annualRevenue * multiplier * ageFactor;
    const fiveYearProjection = annualRevenue * ((Math.pow(growthFactor, 5) - 1) / (growthFactor - 1 || 5));
    const typeLabels = { 1: "Independent", 2: "Established", 3: "Hit Catalog", 4: "Evergreen Classics" };
    return {
      primary: { label: "Estimated Catalog Value", value: "$" + formatNumber(estimatedValue) },
      details: [
        { label: "Revenue Multiplier", value: formatNumber(multiplier) + "x" },
        { label: "Age Factor", value: formatNumber(ageFactor) + "x" },
        { label: "Catalog Type", value: typeLabels[catalogType] },
        { label: "5-Year Revenue Projection", value: "$" + formatNumber(fiveYearProjection) }
      ]
    };
  }`,
  [
    { q: "How are music catalogs valued?", a: "Music catalogs are typically valued at 10-30 times their annual revenue, depending on the quality and longevity of the catalog." },
    { q: "Why are music catalogs selling for so much?", a: "Low interest rates, streaming growth, and the proven stability of music royalties have driven catalog multiples to historic highs." },
    { q: "What makes a music catalog more valuable?", a: "Evergreen songs with consistent streaming, sync licensing potential, and multiple revenue streams command the highest multiples." }
  ],
  `Catalog Value = Annual Revenue x Type Multiplier x Age Factor`,
  ["music-royalty-split-calculator", "music-streaming-revenue-calculator", "album-production-budget-calculator"]
);

add(
  "music-practice-time-calculator",
  "Music Practice Time Calculator",
  "Plan effective practice sessions with time allocation for technique, repertoire, and theory.",
  "Everyday",
  "everyday",
  "~",
  ["practice", "music", "instrument", "schedule", "learning"],
  [
    '{ name: "totalMinutes", label: "Total Practice Time (minutes)", type: "number", min: 15, max: 240, defaultValue: 60 }',
    '{ name: "level", label: "Skill Level", type: "select", options: [{ value: "1", label: "Beginner" }, { value: "2", label: "Intermediate" }, { value: "3", label: "Advanced" }], defaultValue: "2" }',
    '{ name: "daysPerWeek", label: "Practice Days Per Week", type: "number", min: 1, max: 7, defaultValue: 5 }',
    '{ name: "goal", label: "Primary Goal", type: "select", options: [{ value: "1", label: "General Improvement" }, { value: "2", label: "Performance Prep" }, { value: "3", label: "Exam/Audition Prep" }], defaultValue: "1" }'
  ],
  `(inputs) => {
    const totalMinutes = inputs.totalMinutes as number;
    const level = inputs.level as number;
    const daysPerWeek = inputs.daysPerWeek as number;
    const goal = inputs.goal as number;
    const splits = {
      "1_1": { warmup: 0.20, technique: 0.30, repertoire: 0.30, theory: 0.20 },
      "1_2": { warmup: 0.15, technique: 0.20, repertoire: 0.50, theory: 0.15 },
      "1_3": { warmup: 0.15, technique: 0.25, repertoire: 0.40, theory: 0.20 },
      "2_1": { warmup: 0.15, technique: 0.25, repertoire: 0.40, theory: 0.20 },
      "2_2": { warmup: 0.10, technique: 0.15, repertoire: 0.60, theory: 0.15 },
      "2_3": { warmup: 0.10, technique: 0.25, repertoire: 0.45, theory: 0.20 },
      "3_1": { warmup: 0.10, technique: 0.20, repertoire: 0.50, theory: 0.20 },
      "3_2": { warmup: 0.10, technique: 0.10, repertoire: 0.70, theory: 0.10 },
      "3_3": { warmup: 0.10, technique: 0.20, repertoire: 0.55, theory: 0.15 }
    };
    const key = level + "_" + goal;
    const split = splits[key] || splits["2_1"];
    const warmup = Math.round(totalMinutes * split.warmup);
    const technique = Math.round(totalMinutes * split.technique);
    const repertoire = Math.round(totalMinutes * split.repertoire);
    const theory = totalMinutes - warmup - technique - repertoire;
    const weeklyHours = (totalMinutes * daysPerWeek) / 60;
    const monthlyHours = weeklyHours * 4.33;
    return {
      primary: { label: "Weekly Practice Hours", value: formatNumber(weeklyHours) + " hrs" },
      details: [
        { label: "Warm-up / Scales", value: formatNumber(warmup) + " min" },
        { label: "Technique / Etudes", value: formatNumber(technique) + " min" },
        { label: "Repertoire", value: formatNumber(repertoire) + " min" },
        { label: "Theory / Ear Training", value: formatNumber(theory) + " min" },
        { label: "Monthly Total", value: formatNumber(monthlyHours) + " hrs" }
      ]
    };
  }`,
  [
    { q: "How long should I practice my instrument daily?", a: "Beginners benefit from 30-45 minutes daily. Intermediate players should aim for 1-2 hours. Advanced players often practice 3-4 hours." },
    { q: "Is it better to practice every day or skip days?", a: "Consistent daily practice, even shorter sessions, is more effective than long sporadic sessions for building muscle memory." },
    { q: "How should I structure my practice session?", a: "Start with warm-ups and scales, then work on technique, followed by repertoire, and end with sight-reading or theory." }
  ],
  `Time allocation based on skill level and goal priorities\nWeekly Hours = Daily Minutes x Days / 60`,
  ["bpm-tempo-calculator", "chord-progression-calculator", "guitar-string-gauge-calculator"]
);

add(
  "audio-delay-compensation-calculator",
  "Audio Delay Compensation Calculator",
  "Calculate audio delay times for live sound and studio synchronization based on distance and temperature.",
  "Science",
  "science",
  "A",
  ["audio delay", "latency", "speed of sound", "live sound", "sync"],
  [
    '{ name: "distance", label: "Distance (feet)", type: "number", min: 1, max: 5000, defaultValue: 50 }',
    '{ name: "temperature", label: "Temperature (F)", type: "number", min: 0, max: 120, defaultValue: 72 }',
    '{ name: "sampleRate", label: "Sample Rate", type: "select", options: [{ value: "44100", label: "44.1 kHz (CD)" }, { value: "48000", label: "48 kHz (Video)" }, { value: "96000", label: "96 kHz (Hi-Res)" }], defaultValue: "48000" }',
    '{ name: "humidity", label: "Humidity (%)", type: "number", min: 0, max: 100, defaultValue: 50 }'
  ],
  `(inputs) => {
    const distance = inputs.distance as number;
    const temperature = inputs.temperature as number;
    const sampleRate = inputs.sampleRate as number;
    const humidity = inputs.humidity as number;
    const tempC = (temperature - 32) * 5 / 9;
    const speedOfSound = 331.3 + (0.606 * tempC) + (0.0124 * humidity);
    const distanceM = distance * 0.3048;
    const delayMs = (distanceM / speedOfSound) * 1000;
    const delaySamples = Math.round(delayMs * sampleRate / 1000);
    const speedFtPerSec = speedOfSound * 3.28084;
    const wavelength1k = speedOfSound / 1000;
    return {
      primary: { label: "Delay Time", value: formatNumber(delayMs) + " ms" },
      details: [
        { label: "Delay in Samples", value: formatNumber(delaySamples) + " samples" },
        { label: "Speed of Sound", value: formatNumber(speedFtPerSec) + " ft/s" },
        { label: "Distance", value: formatNumber(distance) + " ft (" + formatNumber(distanceM) + " m)" },
        { label: "1 kHz Wavelength", value: formatNumber(wavelength1k) + " m" }
      ]
    };
  }`,
  [
    { q: "Why does audio need delay compensation?", a: "Sound travels at roughly 1 foot per millisecond. In large venues, delayed speakers must be timed to match the main system." },
    { q: "Does temperature affect the speed of sound?", a: "Yes, sound travels faster in warmer air. At 72F sound travels about 1128 ft/s versus 1087 ft/s at 32F." },
    { q: "How do I set delay on PA speakers?", a: "Measure the distance between main and delay speakers, then calculate the delay time using distance divided by speed of sound." }
  ],
  `Delay (ms) = (Distance m / Speed of Sound) x 1000\nSpeed = 331.3 + 0.606 x Temperature C`,
  ["speaker-wattage-calculator", "concert-venue-capacity-calculator", "microphone-sensitivity-calculator"]
);
add(
  "tennis-racket-string-tension-calculator",
  "Tennis Racket String Tension Calculator",
  "Calculate optimal string tension based on playing style, racket head size, and string type.",
  "Everyday",
  "everyday",
  "~",
  ["tennis string tension", "racket stringing", "tennis racket tension", "string gauge"],
  [
    '{ name: "headSize", label: "Racket Head Size (sq in)", type: "number", min: 85, max: 115, defaultValue: 100 }',
    '{ name: "playStyle", label: "Playing Style", type: "select", options: [{ value: "1", label: "Power Hitter" }, { value: "2", label: "All-Around" }, { value: "3", label: "Control Player" }], defaultValue: "2" }',
    '{ name: "stringType", label: "String Type", type: "select", options: [{ value: "1", label: "Natural Gut" }, { value: "2", label: "Polyester" }, { value: "3", label: "Synthetic Gut" }, { value: "4", label: "Multifilament" }], defaultValue: "2" }',
    '{ name: "skillLevel", label: "Skill Level", type: "select", options: [{ value: "1", label: "Beginner" }, { value: "2", label: "Intermediate" }, { value: "3", label: "Advanced" }], defaultValue: "2" }'
  ],
  `(inputs) => {
    const headSize = inputs.headSize as number;
    const playStyle = parseInt(inputs.playStyle as string);
    const stringType = parseInt(inputs.stringType as string);
    const skillLevel = parseInt(inputs.skillLevel as string);
    const baseTension = 55;
    const headAdj = (headSize - 100) * -0.2;
    const styleAdj = playStyle === 1 ? -3 : playStyle === 3 ? 3 : 0;
    const stringAdj = stringType === 1 ? 2 : stringType === 2 ? -2 : stringType === 4 ? 1 : 0;
    const skillAdj = skillLevel === 1 ? -2 : skillLevel === 3 ? 2 : 0;
    const tension = Math.round(baseTension + headAdj + styleAdj + stringAdj + skillAdj);
    const rangeLow = tension - 2;
    const rangeHigh = tension + 2;
    return {
      primary: { label: "Recommended Tension", value: formatNumber(tension) + " lbs" },
      details: [
        { label: "Tension Range", value: formatNumber(rangeLow) + " - " + formatNumber(rangeHigh) + " lbs" },
        { label: "Head Size Adjustment", value: formatNumber(headAdj) + " lbs" },
        { label: "Style Adjustment", value: formatNumber(styleAdj) + " lbs" }
      ]
    };
  }`,
  [
    { q: "What is a good tennis string tension?", a: "Most players string between 50 and 60 pounds. Lower tension gives more power while higher tension provides more control." },
    { q: "Does racket head size affect string tension?", a: "Yes, larger heads generally need slightly lower tension because the longer strings already provide more power." },
    { q: "How often should I restring my racket?", a: "A common rule is to restring as many times per year as you play per week. Competitive players may restring more often." }
  ],
  "Tension = Base (55 lbs) + Head Size Adj + Play Style Adj + String Type Adj + Skill Adj",
  ["golf-club-fitting-calculator", "swim-pace-calculator"]
);

add(
  "golf-club-fitting-calculator",
  "Golf Club Fitting Calculator",
  "Determine recommended club length and lie angle based on your height, wrist-to-floor measurement, and swing speed.",
  "Everyday",
  "everyday",
  "~",
  ["golf club fitting", "club length", "golf club size", "lie angle"],
  [
    '{ name: "height", label: "Height (inches)", type: "number", min: 54, max: 84, defaultValue: 70 }',
    '{ name: "wristToFloor", label: "Wrist-to-Floor (inches)", type: "number", min: 25, max: 42, defaultValue: 34 }',
    '{ name: "swingSpeed", label: "Driver Swing Speed (mph)", type: "number", min: 50, max: 130, defaultValue: 90 }',
    '{ name: "handicap", label: "Handicap Range", type: "select", options: [{ value: "1", label: "High (20+)" }, { value: "2", label: "Mid (10-19)" }, { value: "3", label: "Low (0-9)" }], defaultValue: "2" }'
  ],
  `(inputs) => {
    const height = inputs.height as number;
    const wtf = inputs.wristToFloor as number;
    const swingSpeed = inputs.swingSpeed as number;
    const handicap = parseInt(inputs.handicap as string);
    const standardLength = 36.5;
    const lengthAdj = (wtf - 34) * 0.25;
    const clubLength = standardLength + lengthAdj;
    const standardLie = 62;
    const lieAdj = (height - 70) * 0.3 + (wtf - 34) * -0.4;
    const lieAngle = Math.round((standardLie + lieAdj) * 10) / 10;
    const shaftFlex = swingSpeed < 70 ? "Ladies" : swingSpeed < 85 ? "Regular" : swingSpeed < 100 ? "Stiff" : "Extra Stiff";
    return {
      primary: { label: "Recommended 7-Iron Length", value: formatNumber(Math.round(clubLength * 10) / 10) + " inches" },
      details: [
        { label: "Lie Angle Adjustment", value: formatNumber(lieAngle) + " degrees" },
        { label: "Shaft Flex", value: shaftFlex },
        { label: "Length Adjustment", value: (lengthAdj >= 0 ? "+" : "") + formatNumber(Math.round(lengthAdj * 100) / 100) + " inches" }
      ]
    };
  }`,
  [
    { q: "How do I know what golf club length I need?", a: "Club length is primarily based on your wrist-to-floor measurement. Standard 7-iron length is about 36.5 inches for a player 70 inches tall." },
    { q: "What is lie angle in golf?", a: "Lie angle is the angle between the club shaft and the ground. Taller players generally need more upright lie angles." },
    { q: "How important is club fitting?", a: "Proper fitting can improve accuracy and distance by 5 to 15 percent, even for beginners." }
  ],
  "Club Length = 36.5 + (Wrist-to-Floor - 34) x 0.25; Lie Angle = 62 + Height Adj + WTF Adj",
  ["tennis-racket-string-tension-calculator", "baseball-bat-weight-calculator"]
);

add(
  "ski-boot-size-calculator",
  "Ski Boot Size Calculator",
  "Find your ski boot mondo point size from foot length and determine appropriate flex rating.",
  "Everyday",
  "everyday",
  "~",
  ["ski boot size", "mondo point", "ski boot fitting", "ski boot flex"],
  [
    '{ name: "footLength", label: "Foot Length (cm)", type: "number", min: 20, max: 35, defaultValue: 27 }',
    '{ name: "footWidth", label: "Foot Width", type: "select", options: [{ value: "1", label: "Narrow" }, { value: "2", label: "Average" }, { value: "3", label: "Wide" }], defaultValue: "2" }',
    '{ name: "ability", label: "Skiing Ability", type: "select", options: [{ value: "1", label: "Beginner" }, { value: "2", label: "Intermediate" }, { value: "3", label: "Advanced" }, { value: "4", label: "Expert" }], defaultValue: "2" }',
    '{ name: "weight", label: "Body Weight (lbs)", type: "number", min: 80, max: 300, defaultValue: 170 }'
  ],
  `(inputs) => {
    const footLength = inputs.footLength as number;
    const footWidth = parseInt(inputs.footWidth as string);
    const ability = parseInt(inputs.ability as string);
    const weight = inputs.weight as number;
    const mondoSize = Math.round(footLength * 2) / 2;
    const shellSize = ability >= 3 ? mondoSize : mondoSize + 0.5;
    const lastWidth = footWidth === 1 ? "96-98mm" : footWidth === 2 ? "100-102mm" : "104-106mm";
    const baseFlex = weight < 130 ? 70 : weight < 170 ? 90 : weight < 210 ? 100 : 120;
    const flexAdj = ability === 1 ? -20 : ability === 3 ? 10 : ability === 4 ? 20 : 0;
    const flex = baseFlex + flexAdj;
    return {
      primary: { label: "Mondo Point Size", value: formatNumber(mondoSize) },
      details: [
        { label: "Recommended Shell Size", value: formatNumber(shellSize) },
        { label: "Last Width", value: lastWidth },
        { label: "Recommended Flex", value: formatNumber(flex) }
      ]
    };
  }`,
  [
    { q: "What is mondo point sizing?", a: "Mondo point is the ski boot sizing system based on foot length in centimeters. A 27cm foot takes a mondo size 27 boot." },
    { q: "What flex should my ski boot be?", a: "Beginners typically use 60 to 80 flex, intermediates 80 to 100, and advanced skiers 100 to 130 or higher." },
    { q: "Should ski boots be tight?", a: "Ski boots should be snug but not painful. Your toes should lightly touch the front when standing upright." }
  ],
  "Mondo Size = Foot Length (cm) rounded to nearest 0.5; Flex = Base Flex (by weight) + Ability Adjustment",
  ["snowboard-size-calculator", "kayak-size-calculator"]
);

add(
  "bicycle-gear-ratio-calculator",
  "Bicycle Gear Ratio Calculator",
  "Calculate gear ratios, development, and speed for any chainring and cassette combination.",
  "Everyday",
  "everyday",
  "~",
  ["bicycle gear ratio", "bike gearing", "chainring cassette", "gear inches"],
  [
    '{ name: "chainring", label: "Chainring Teeth", type: "number", min: 20, max: 60, defaultValue: 50 }',
    '{ name: "cog", label: "Rear Cog Teeth", type: "number", min: 10, max: 42, defaultValue: 17 }',
    '{ name: "wheelSize", label: "Wheel Size", type: "select", options: [{ value: "2100", label: "700c (2100mm)" }, { value: "2070", label: "650b (2070mm)" }, { value: "2030", label: "26 inch (2030mm)" }, { value: "2290", label: "29 inch (2290mm)" }], defaultValue: "2100" }',
    '{ name: "cadence", label: "Pedaling Cadence (RPM)", type: "number", min: 50, max: 130, defaultValue: 85 }'
  ],
  `(inputs) => {
    const chainring = inputs.chainring as number;
    const cog = inputs.cog as number;
    const wheelSize = parseInt(inputs.wheelSize as string);
    const cadence = inputs.cadence as number;
    const gearRatio = chainring / cog;
    const development = gearRatio * (wheelSize / 1000) * Math.PI;
    const speedKmh = development * cadence * 60 / 1000;
    const speedMph = speedKmh * 0.621371;
    const gearInches = gearRatio * (wheelSize / 25.4 / Math.PI) * Math.PI;
    return {
      primary: { label: "Gear Ratio", value: formatNumber(Math.round(gearRatio * 100) / 100) },
      details: [
        { label: "Development", value: formatNumber(Math.round(development * 100) / 100) + " m per pedal rev" },
        { label: "Speed at Cadence", value: formatNumber(Math.round(speedMph * 10) / 10) + " mph" },
        { label: "Gear Inches", value: formatNumber(Math.round(gearInches * 10) / 10) }
      ]
    };
  }`,
  [
    { q: "What is a good gear ratio for cycling?", a: "It depends on terrain. A ratio of 2.5 to 3.0 is common for flat riding, while 1.0 to 1.5 is typical for climbing steep hills." },
    { q: "What are gear inches?", a: "Gear inches represent the effective diameter of the wheel as if it were a penny-farthing. Higher gear inches mean a harder gear." },
    { q: "What cadence should I ride at?", a: "Most efficient cycling occurs between 80 and 100 RPM. Beginners often pedal at 60 to 80 RPM." }
  ],
  "Gear Ratio = Chainring Teeth / Cog Teeth; Development = Ratio x Wheel Circumference",
  ["tennis-racket-string-tension-calculator", "swim-pace-calculator"]
);

add(
  "swim-pace-calculator",
  "Swim Pace Calculator",
  "Calculate swim pace per 100m or 100yd, total time, and calorie burn for pool or open water swimming.",
  "Health",
  "health",
  "H",
  ["swim pace", "swimming time", "pool pace calculator", "swim speed"],
  [
    '{ name: "distance", label: "Distance (meters)", type: "number", min: 25, max: 10000, defaultValue: 1500 }',
    '{ name: "minutes", label: "Total Time Minutes", type: "number", min: 0, max: 300, defaultValue: 30 }',
    '{ name: "seconds", label: "Total Time Seconds", type: "number", min: 0, max: 59, defaultValue: 0 }',
    '{ name: "weight", label: "Body Weight (lbs)", type: "number", min: 80, max: 400, defaultValue: 160 }'
  ],
  `(inputs) => {
    const distance = inputs.distance as number;
    const minutes = inputs.minutes as number;
    const seconds = inputs.seconds as number;
    const weight = inputs.weight as number;
    const totalSeconds = minutes * 60 + seconds;
    const pacePer100 = (totalSeconds / distance) * 100;
    const paceMin = Math.floor(pacePer100 / 60);
    const paceSec = Math.round(pacePer100 % 60);
    const speedMph = (distance / 1609.34) / (totalSeconds / 3600);
    const metPerMin = weight * 0.00714 * speedMph * 3.5;
    const calories = Math.round(metPerMin * (totalSeconds / 60));
    return {
      primary: { label: "Pace per 100m", value: formatNumber(paceMin) + ":" + (paceSec < 10 ? "0" : "") + formatNumber(paceSec) },
      details: [
        { label: "Speed", value: formatNumber(Math.round(speedMph * 100) / 100) + " mph" },
        { label: "Estimated Calories", value: formatNumber(calories) + " cal" },
        { label: "Total Time", value: formatNumber(minutes) + "m " + formatNumber(seconds) + "s" }
      ]
    };
  }`,
  [
    { q: "What is a good swim pace per 100m?", a: "Beginner swimmers average 2:30 to 3:00 per 100m. Intermediate swimmers hit 1:45 to 2:15, and competitive swimmers are often under 1:30." },
    { q: "How many calories does swimming burn?", a: "Swimming burns roughly 400 to 700 calories per hour depending on intensity, stroke, and body weight." },
    { q: "Is swimming good for weight loss?", a: "Yes, swimming is an excellent full-body workout that is easy on joints and can burn significant calories." }
  ],
  "Pace per 100m = (Total Seconds / Distance) x 100; Calories = MET x Duration x Body Weight Factor",
  ["triathlon-transition-time-calculator", "rowing-stroke-rate-calculator"]
);

add(
  "running-shoe-mileage-calculator",
  "Running Shoe Mileage Calculator",
  "Track running shoe wear and estimate remaining lifespan based on weekly mileage and shoe type.",
  "Health",
  "health",
  "H",
  ["running shoe mileage", "shoe replacement", "shoe lifespan", "running shoe tracker"],
  [
    '{ name: "weeklyMiles", label: "Weekly Mileage", type: "number", min: 1, max: 150, defaultValue: 25 }',
    '{ name: "currentMiles", label: "Current Miles on Shoes", type: "number", min: 0, max: 1000, defaultValue: 150 }',
    '{ name: "shoeType", label: "Shoe Type", type: "select", options: [{ value: "350", label: "Lightweight Racing" }, { value: "450", label: "Standard Training" }, { value: "550", label: "Max Cushion / Trail" }], defaultValue: "450" }',
    '{ name: "terrain", label: "Primary Terrain", type: "select", options: [{ value: "1", label: "Road" }, { value: "0.85", label: "Trail" }, { value: "1.1", label: "Treadmill" }], defaultValue: "1" }'
  ],
  `(inputs) => {
    const weeklyMiles = inputs.weeklyMiles as number;
    const currentMiles = inputs.currentMiles as number;
    const maxMiles = parseInt(inputs.shoeType as string);
    const terrainFactor = parseFloat(inputs.terrain as string);
    const adjustedMax = Math.round(maxMiles * terrainFactor);
    const remaining = Math.max(adjustedMax - currentMiles, 0);
    const weeksLeft = weeklyMiles > 0 ? Math.round(remaining / weeklyMiles) : 0;
    const wearPercent = Math.min(Math.round((currentMiles / adjustedMax) * 100), 100);
    return {
      primary: { label: "Remaining Shoe Life", value: formatNumber(remaining) + " miles" },
      details: [
        { label: "Weeks Until Replacement", value: formatNumber(weeksLeft) },
        { label: "Wear Percentage", value: formatNumber(wearPercent) + "%" },
        { label: "Adjusted Max Lifespan", value: formatNumber(adjustedMax) + " miles" }
      ]
    };
  }`,
  [
    { q: "How long do running shoes last?", a: "Most running shoes last 300 to 500 miles. Lightweight racing shoes may wear out closer to 200 to 350 miles." },
    { q: "How do I know when to replace running shoes?", a: "Replace shoes when you notice reduced cushioning, visible sole wear, or new aches and pains during runs." },
    { q: "Do trail shoes last longer?", a: "Trail shoes often have more durable outsoles but the rough terrain can reduce overall lifespan compared to road running." }
  ],
  "Remaining Miles = (Max Lifespan x Terrain Factor) - Current Miles; Weeks Left = Remaining / Weekly Mileage",
  ["swim-pace-calculator", "triathlon-transition-time-calculator"]
);

add(
  "boxing-reach-advantage-calculator",
  "Boxing Reach Advantage Calculator",
  "Calculate reach advantage and optimal fighting distance based on arm span and height.",
  "Health",
  "health",
  "H",
  ["boxing reach", "reach advantage", "arm span boxing", "fighting distance"],
  [
    '{ name: "yourReach", label: "Your Reach (inches)", type: "number", min: 55, max: 90, defaultValue: 72 }',
    '{ name: "opponentReach", label: "Opponent Reach (inches)", type: "number", min: 55, max: 90, defaultValue: 70 }',
    '{ name: "yourHeight", label: "Your Height (inches)", type: "number", min: 58, max: 84, defaultValue: 70 }',
    '{ name: "stance", label: "Your Stance", type: "select", options: [{ value: "1", label: "Orthodox" }, { value: "2", label: "Southpaw" }], defaultValue: "1" }'
  ],
  `(inputs) => {
    const yourReach = inputs.yourReach as number;
    const opponentReach = inputs.opponentReach as number;
    const yourHeight = inputs.yourHeight as number;
    const stance = parseInt(inputs.stance as string);
    const reachDiff = yourReach - opponentReach;
    const apeIndex = yourReach - yourHeight;
    const optimalDistance = Math.round(yourReach * 0.6);
    const jabRange = Math.round(yourReach * 0.42);
    const advantage = reachDiff > 0 ? "You have the reach advantage" : reachDiff < 0 ? "Opponent has the reach advantage" : "Reach is equal";
    return {
      primary: { label: "Reach Difference", value: (reachDiff >= 0 ? "+" : "") + formatNumber(reachDiff) + " inches" },
      details: [
        { label: "Assessment", value: advantage },
        { label: "Ape Index", value: (apeIndex >= 0 ? "+" : "") + formatNumber(apeIndex) + " inches" },
        { label: "Optimal Fighting Distance", value: formatNumber(optimalDistance) + " inches" }
      ]
    };
  }`,
  [
    { q: "What is reach in boxing?", a: "Reach is the distance from fingertip to fingertip with arms outstretched. It determines how far you can hit without being hit." },
    { q: "What is ape index?", a: "Ape index is the difference between your arm span and height. A positive ape index is advantageous in combat sports." },
    { q: "Does reach advantage matter in boxing?", a: "Yes, a longer reach allows fighters to land jabs from further away and control distance. It is one of the most important physical attributes." }
  ],
  "Reach Difference = Your Reach - Opponent Reach; Ape Index = Reach - Height",
  ["martial-arts-belt-progression-calculator", "lacrosse-stick-length-calculator"]
);

add(
  "hockey-stick-flex-calculator",
  "Hockey Stick Flex Calculator",
  "Determine optimal hockey stick flex rating based on body weight, position, and playing style.",
  "Everyday",
  "everyday",
  "~",
  ["hockey stick flex", "hockey stick rating", "stick flex guide", "hockey equipment"],
  [
    '{ name: "weight", label: "Body Weight (lbs)", type: "number", min: 60, max: 300, defaultValue: 180 }',
    '{ name: "position", label: "Position", type: "select", options: [{ value: "1", label: "Forward" }, { value: "2", label: "Defenseman" }, { value: "3", label: "Goalie" }], defaultValue: "1" }',
    '{ name: "shotType", label: "Shot Type Preference", type: "select", options: [{ value: "1", label: "Wrist / Snap Shot" }, { value: "2", label: "Slap Shot" }], defaultValue: "1" }',
    '{ name: "height", label: "Height (inches)", type: "number", min: 48, max: 84, defaultValue: 70 }'
  ],
  `(inputs) => {
    const weight = inputs.weight as number;
    const position = parseInt(inputs.position as string);
    const shotType = parseInt(inputs.shotType as string);
    const height = inputs.height as number;
    const baseFlex = Math.round(weight / 2);
    const posAdj = position === 2 ? 5 : position === 3 ? -10 : 0;
    const shotAdj = shotType === 2 ? 5 : -5;
    const flex = baseFlex + posAdj + shotAdj;
    const stickLength = height <= 60 ? "Junior (46-54 in)" : height <= 68 ? "Intermediate (54-57 in)" : "Senior (57-63 in)";
    const kickPoint = shotType === 1 ? "Low Kick" : "Mid Kick";
    return {
      primary: { label: "Recommended Flex", value: formatNumber(flex) },
      details: [
        { label: "Stick Category", value: stickLength },
        { label: "Kick Point", value: kickPoint },
        { label: "Position Adjustment", value: (posAdj >= 0 ? "+" : "") + formatNumber(posAdj) }
      ]
    };
  }`,
  [
    { q: "What flex hockey stick should I use?", a: "A common guideline is to use a flex rating equal to about half your body weight in pounds." },
    { q: "Does position affect stick flex?", a: "Yes, defensemen often prefer slightly stiffer sticks for slap shots while forwards may prefer softer flex for quick releases." },
    { q: "What is kick point?", a: "Kick point is where the stick flexes most. Low kick helps wrist shots; mid kick helps slap shots." }
  ],
  "Base Flex = Body Weight / 2; Final Flex = Base + Position Adj + Shot Type Adj",
  ["lacrosse-stick-length-calculator", "baseball-bat-weight-calculator"]
);

add(
  "baseball-bat-weight-calculator",
  "Baseball Bat Weight Calculator",
  "Find ideal bat weight and length-to-weight drop based on age, height, and league requirements.",
  "Everyday",
  "everyday",
  "~",
  ["baseball bat weight", "bat size", "bat drop", "bat length"],
  [
    '{ name: "age", label: "Player Age", type: "number", min: 5, max: 60, defaultValue: 16 }',
    '{ name: "height", label: "Height (inches)", type: "number", min: 36, max: 84, defaultValue: 68 }',
    '{ name: "weight", label: "Body Weight (lbs)", type: "number", min: 40, max: 300, defaultValue: 160 }',
    '{ name: "league", label: "League Type", type: "select", options: [{ value: "1", label: "Youth (T-Ball/Coach Pitch)" }, { value: "2", label: "Little League" }, { value: "3", label: "High School" }, { value: "4", label: "College/Adult" }], defaultValue: "3" }'
  ],
  `(inputs) => {
    const age = inputs.age as number;
    const height = inputs.height as number;
    const weight = inputs.weight as number;
    const league = parseInt(inputs.league as string);
    var batLength = 0;
    if (height <= 48) batLength = 26;
    else if (height <= 54) batLength = 28;
    else if (height <= 60) batLength = 29;
    else if (height <= 66) batLength = 31;
    else if (height <= 72) batLength = 32;
    else batLength = 33;
    var drop = league === 1 ? -12 : league === 2 ? -10 : league === 3 ? -3 : -3;
    if (age < 10) drop = Math.min(drop, -10);
    const batWeight = batLength + drop;
    return {
      primary: { label: "Recommended Bat Weight", value: formatNumber(batWeight) + " oz" },
      details: [
        { label: "Bat Length", value: formatNumber(batLength) + " inches" },
        { label: "Drop Weight", value: formatNumber(drop) },
        { label: "League Standard", value: league === 1 ? "Youth" : league === 2 ? "Little League" : league === 3 ? "High School" : "College/Adult" }
      ]
    };
  }`,
  [
    { q: "What does bat drop mean?", a: "Bat drop is the difference between length in inches and weight in ounces. A 32 inch bat weighing 29 oz has a drop of -3." },
    { q: "How do I know what bat size to get?", a: "Bat size depends on height, weight, and league rules. Youth bats are lighter with higher drops while adult bats are heavier." },
    { q: "What bat drop is allowed in high school?", a: "NFHS high school rules require BBCOR-certified bats with a -3 drop maximum." }
  ],
  "Bat Length = based on height chart; Bat Weight = Bat Length + Drop",
  ["golf-club-fitting-calculator", "hockey-stick-flex-calculator"]
);

add(
  "basketball-court-dimensions-calculator",
  "Basketball Court Dimensions Calculator",
  "Calculate total area, paint zone, three-point area, and markings for various basketball court types.",
  "Math",
  "math",
  "+",
  ["basketball court dimensions", "court area", "basketball measurements", "court markings"],
  [
    '{ name: "courtType", label: "Court Type", type: "select", options: [{ value: "1", label: "NBA (94x50 ft)" }, { value: "2", label: "NCAA (94x50 ft)" }, { value: "3", label: "High School (84x50 ft)" }, { value: "4", label: "FIBA (91.9x49.2 ft)" }], defaultValue: "1" }',
    '{ name: "includeRunout", label: "Include Runout Area (ft)", type: "number", min: 0, max: 15, defaultValue: 6 }',
    '{ name: "surfaceCost", label: "Surface Cost per Sq Ft ($)", type: "number", min: 1, max: 50, defaultValue: 5 }'
  ],
  `(inputs) => {
    const courtType = parseInt(inputs.courtType as string);
    const runout = inputs.includeRunout as number;
    const surfaceCost = inputs.surfaceCost as number;
    const dims = courtType === 1 ? [94, 50] : courtType === 2 ? [94, 50] : courtType === 3 ? [84, 50] : [91.9, 49.2];
    const length = dims[0];
    const width = dims[1];
    const courtArea = length * width;
    const totalLength = length + 2 * runout;
    const totalWidth = width + 2 * runout;
    const totalArea = totalLength * totalWidth;
    const totalCost = Math.round(totalArea * surfaceCost);
    const threePointDist = courtType === 1 ? 23.75 : courtType === 2 ? 22.15 : courtType === 3 ? 19.75 : 22.15;
    return {
      primary: { label: "Court Area", value: formatNumber(Math.round(courtArea)) + " sq ft" },
      details: [
        { label: "Dimensions", value: formatNumber(length) + " x " + formatNumber(width) + " ft" },
        { label: "Total Area with Runout", value: formatNumber(Math.round(totalArea)) + " sq ft" },
        { label: "Three-Point Distance", value: formatNumber(threePointDist) + " ft" },
        { label: "Estimated Surface Cost", value: "$" + formatNumber(totalCost) }
      ]
    };
  }`,
  [
    { q: "How big is a standard basketball court?", a: "An NBA and NCAA court is 94 feet long by 50 feet wide. High school courts are 84 by 50 feet." },
    { q: "What is the three-point line distance?", a: "The NBA three-point line is 23 feet 9 inches from the basket. College is 22 feet 1.75 inches." },
    { q: "How much does a basketball court cost to build?", a: "An outdoor court costs $10,000 to $40,000. Indoor courts can cost $100,000 or more depending on materials." }
  ],
  "Court Area = Length x Width; Total Area = (Length + 2 x Runout) x (Width + 2 x Runout)",
  ["soccer-field-area-calculator", "football-field-goal-distance-calculator"]
);

add(
  "football-field-goal-distance-calculator",
  "Football Field Goal Distance Calculator",
  "Calculate actual field goal kick distance including end zone and holder position offset.",
  "Math",
  "math",
  "+",
  ["field goal distance", "football kick distance", "field goal calculator", "kicking distance"],
  [
    '{ name: "lineOfScrimmage", label: "Line of Scrimmage (yard line)", type: "number", min: 1, max: 50, defaultValue: 25 }',
    '{ name: "holderOffset", label: "Holder Position (yards behind line)", type: "number", min: 6, max: 9, defaultValue: 7 }',
    '{ name: "endZoneDepth", label: "End Zone Depth (yards)", type: "number", min: 10, max: 10, defaultValue: 10 }',
    '{ name: "windSpeed", label: "Wind Speed (mph)", type: "number", min: 0, max: 40, defaultValue: 0 }'
  ],
  `(inputs) => {
    const los = inputs.lineOfScrimmage as number;
    const holder = inputs.holderOffset as number;
    const endZone = inputs.endZoneDepth as number;
    const wind = inputs.windSpeed as number;
    const kickDistance = los + holder + endZone;
    const kickDistanceFt = kickDistance * 3;
    const windEffect = wind > 10 ? (wind > 20 ? "Strong headwind reduces accuracy significantly" : "Moderate wind impact") : "Minimal wind impact";
    const difficulty = kickDistance <= 30 ? "Easy (chip shot)" : kickDistance <= 40 ? "Short" : kickDistance <= 50 ? "Moderate" : kickDistance <= 55 ? "Long" : "Very Long";
    const nflAvgPct = kickDistance <= 30 ? 95 : kickDistance <= 40 ? 88 : kickDistance <= 50 ? 75 : kickDistance <= 55 ? 60 : 40;
    return {
      primary: { label: "Field Goal Distance", value: formatNumber(kickDistance) + " yards" },
      details: [
        { label: "Distance in Feet", value: formatNumber(kickDistanceFt) + " ft" },
        { label: "Difficulty Rating", value: difficulty },
        { label: "NFL Average Make %", value: formatNumber(nflAvgPct) + "%" },
        { label: "Wind Assessment", value: windEffect }
      ]
    };
  }`,
  [
    { q: "How is field goal distance calculated?", a: "Field goal distance equals the line of scrimmage plus 7 yards for the holder plus 10 yards for the end zone. A kick from the 25-yard line is a 42-yard attempt." },
    { q: "What is the longest NFL field goal?", a: "The longest NFL field goal is 66 yards, kicked by Justin Tucker in 2021." },
    { q: "What percentage of 50-yard field goals are made?", a: "NFL kickers convert roughly 60 to 70 percent of field goals from 50 to 54 yards." }
  ],
  "Field Goal Distance = Line of Scrimmage + Holder Offset (7 yds) + End Zone (10 yds)",
  ["basketball-court-dimensions-calculator", "soccer-field-area-calculator"]
);

add(
  "soccer-field-area-calculator",
  "Soccer Field Area Calculator",
  "Calculate soccer field area, penalty box dimensions, and turf requirements for different standards.",
  "Math",
  "math",
  "+",
  ["soccer field area", "soccer pitch size", "football pitch dimensions", "soccer field calculator"],
  [
    '{ name: "fieldStandard", label: "Field Standard", type: "select", options: [{ value: "1", label: "FIFA International (110x75 yd)" }, { value: "2", label: "MLS/Premier League (115x75 yd)" }, { value: "3", label: "Youth U12 (80x50 yd)" }, { value: "4", label: "Youth U8 (40x30 yd)" }], defaultValue: "1" }',
    '{ name: "turfCost", label: "Turf Cost per Sq Yd ($)", type: "number", min: 1, max: 30, defaultValue: 8 }',
    '{ name: "unit", label: "Display Units", type: "select", options: [{ value: "1", label: "Yards" }, { value: "2", label: "Meters" }], defaultValue: "1" }'
  ],
  `(inputs) => {
    const standard = parseInt(inputs.fieldStandard as string);
    const turfCost = inputs.turfCost as number;
    const unit = parseInt(inputs.unit as string);
    const dims = standard === 1 ? [110, 75] : standard === 2 ? [115, 75] : standard === 3 ? [80, 50] : [40, 30];
    var length = dims[0];
    var width = dims[1];
    const areaYd = length * width;
    const areaSqFt = areaYd * 9;
    const totalTurfCost = Math.round(areaYd * turfCost);
    const penaltyBoxL = standard <= 2 ? 18 : standard === 3 ? 14 : 10;
    const penaltyBoxW = standard <= 2 ? 44 : standard === 3 ? 32 : 20;
    const label = unit === 2 ? "meters" : "yards";
    const factor = unit === 2 ? 0.9144 : 1;
    return {
      primary: { label: "Field Area", value: formatNumber(Math.round(areaYd * factor * factor)) + " sq " + label },
      details: [
        { label: "Dimensions", value: formatNumber(Math.round(length * factor)) + " x " + formatNumber(Math.round(width * factor)) + " " + label },
        { label: "Penalty Box", value: formatNumber(Math.round(penaltyBoxL * factor)) + " x " + formatNumber(Math.round(penaltyBoxW * factor)) + " " + label },
        { label: "Estimated Turf Cost", value: "$" + formatNumber(totalTurfCost) }
      ]
    };
  }`,
  [
    { q: "How big is a standard soccer field?", a: "A FIFA international field is 110 to 120 yards long and 70 to 80 yards wide. The most common size is 110 by 75 yards." },
    { q: "Are all soccer fields the same size?", a: "No, FIFA allows a range of dimensions. Youth fields are significantly smaller than professional fields." },
    { q: "How big is the penalty box?", a: "The standard penalty area is 18 yards deep by 44 yards wide on a full-size field." }
  ],
  "Field Area = Length x Width; Turf Cost = Area x Cost per Sq Yd",
  ["basketball-court-dimensions-calculator", "football-field-goal-distance-calculator"]
);

add(
  "archery-arrow-spine-calculator",
  "Archery Arrow Spine Calculator",
  "Calculate correct arrow spine stiffness based on draw weight, arrow length, and point weight.",
  "Everyday",
  "everyday",
  "~",
  ["arrow spine", "archery arrow", "arrow stiffness", "spine chart"],
  [
    '{ name: "drawWeight", label: "Draw Weight (lbs)", type: "number", min: 15, max: 80, defaultValue: 45 }',
    '{ name: "arrowLength", label: "Arrow Length (inches)", type: "number", min: 24, max: 34, defaultValue: 28 }',
    '{ name: "pointWeight", label: "Point Weight (grains)", type: "number", min: 75, max: 300, defaultValue: 100 }',
    '{ name: "bowType", label: "Bow Type", type: "select", options: [{ value: "1", label: "Compound" }, { value: "2", label: "Recurve" }, { value: "3", label: "Longbow" }], defaultValue: "1" }'
  ],
  `(inputs) => {
    const drawWeight = inputs.drawWeight as number;
    const arrowLength = inputs.arrowLength as number;
    const pointWeight = inputs.pointWeight as number;
    const bowType = parseInt(inputs.bowType as string);
    var effectiveWeight = drawWeight;
    if (arrowLength > 28) effectiveWeight += (arrowLength - 28) * 1.5;
    if (arrowLength < 28) effectiveWeight -= (28 - arrowLength) * 1.5;
    if (pointWeight > 125) effectiveWeight += (pointWeight - 125) * 0.03;
    if (bowType === 2) effectiveWeight -= 5;
    if (bowType === 3) effectiveWeight -= 10;
    var spine = 0;
    if (effectiveWeight < 30) spine = 700;
    else if (effectiveWeight < 40) spine = 600;
    else if (effectiveWeight < 50) spine = 500;
    else if (effectiveWeight < 60) spine = 400;
    else if (effectiveWeight < 70) spine = 340;
    else spine = 300;
    const grainPerLb = Math.round(pointWeight / drawWeight * 10) / 10;
    const foc = Math.round((pointWeight / (arrowLength * 8 + pointWeight)) * 100);
    return {
      primary: { label: "Recommended Spine", value: formatNumber(spine) },
      details: [
        { label: "Effective Draw Weight", value: formatNumber(Math.round(effectiveWeight)) + " lbs" },
        { label: "Grains per Lb", value: formatNumber(grainPerLb) },
        { label: "Estimated FOC", value: formatNumber(foc) + "%" }
      ]
    };
  }`,
  [
    { q: "What is arrow spine?", a: "Arrow spine is a measure of stiffness. A lower number means a stiffer arrow. Spine 400 deflects less than spine 600." },
    { q: "What happens if arrow spine is wrong?", a: "Too weak a spine causes arrows to flex excessively and fly erratically. Too stiff a spine reduces accuracy and forgiveness." },
    { q: "What is FOC in archery?", a: "Front of Center is the percentage of the arrow weight that is in the front half. An FOC of 10 to 15 percent is ideal for target shooting." }
  ],
  "Effective Weight = Draw Weight + Length Adj + Point Weight Adj + Bow Type Adj; Spine from lookup table",
  ["tennis-racket-string-tension-calculator", "bowling-ball-weight-calculator"]
);

add(
  "bowling-ball-weight-calculator",
  "Bowling Ball Weight Calculator",
  "Find ideal bowling ball weight based on body weight, age, strength level, and bowling style.",
  "Everyday",
  "everyday",
  "~",
  ["bowling ball weight", "bowling ball size", "bowling equipment", "ball weight guide"],
  [
    '{ name: "bodyWeight", label: "Body Weight (lbs)", type: "number", min: 40, max: 350, defaultValue: 170 }',
    '{ name: "age", label: "Age", type: "number", min: 5, max: 90, defaultValue: 30 }',
    '{ name: "strength", label: "Upper Body Strength", type: "select", options: [{ value: "0.8", label: "Below Average" }, { value: "1", label: "Average" }, { value: "1.2", label: "Above Average" }], defaultValue: "1" }',
    '{ name: "style", label: "Bowling Style", type: "select", options: [{ value: "1", label: "Straight Ball" }, { value: "2", label: "Hook Ball" }, { value: "3", label: "Power Player" }], defaultValue: "1" }'
  ],
  `(inputs) => {
    const bodyWeight = inputs.bodyWeight as number;
    const age = inputs.age as number;
    const strength = parseFloat(inputs.strength as string);
    const style = parseInt(inputs.style as string);
    var baseBall = Math.round(bodyWeight * 0.1);
    baseBall = Math.round(baseBall * strength);
    if (age < 12) baseBall = Math.min(baseBall, 10);
    else if (age > 60) baseBall = Math.max(baseBall - 2, 8);
    if (style === 3) baseBall = Math.max(baseBall - 1, 8);
    baseBall = Math.max(Math.min(baseBall, 16), 6);
    const spanSize = bodyWeight < 120 ? "Small" : bodyWeight < 180 ? "Medium" : "Large";
    return {
      primary: { label: "Recommended Ball Weight", value: formatNumber(baseBall) + " lbs" },
      details: [
        { label: "Weight Range", value: formatNumber(Math.max(baseBall - 1, 6)) + " - " + formatNumber(Math.min(baseBall + 1, 16)) + " lbs" },
        { label: "Hand Span", value: spanSize },
        { label: "Max Recommended", value: formatNumber(Math.min(Math.round(bodyWeight * 0.1 * 1.2), 16)) + " lbs" }
      ]
    };
  }`,
  [
    { q: "How heavy should my bowling ball be?", a: "A common guideline is about 10 percent of your body weight, up to 16 pounds maximum." },
    { q: "Is a heavier bowling ball better?", a: "Heavier balls carry more energy into the pins but only if you can control them comfortably. An overly heavy ball hurts accuracy." },
    { q: "What weight bowling ball do pros use?", a: "Most professional bowlers use 15 or 16 pound balls for maximum pin carry." }
  ],
  "Ball Weight = Body Weight x 10% x Strength Factor, adjusted for age and style (6-16 lb range)",
  ["archery-arrow-spine-calculator", "baseball-bat-weight-calculator"]
);

add(
  "rock-climbing-grade-converter-calculator",
  "Rock Climbing Grade Converter Calculator",
  "Convert climbing grades between YDS, French, UIAA, and Ewbank systems.",
  "Conversion",
  "conversion",
  "R",
  ["climbing grade converter", "YDS to French", "climbing difficulty", "bouldering grade"],
  [
    '{ name: "grade", label: "Grade Value (numeric, e.g. 10 for 5.10)", type: "number", min: 1, max: 15, defaultValue: 10 }',
    '{ name: "subGrade", label: "Sub Grade", type: "select", options: [{ value: "0", label: "a / base" }, { value: "1", label: "b" }, { value: "2", label: "c" }, { value: "3", label: "d" }], defaultValue: "0" }',
    '{ name: "climbType", label: "Climb Type", type: "select", options: [{ value: "1", label: "Sport / Trad" }, { value: "2", label: "Bouldering" }], defaultValue: "1" }'
  ],
  `(inputs) => {
    const grade = inputs.grade as number;
    const subGrade = parseInt(inputs.subGrade as string);
    const climbType = parseInt(inputs.climbType as string);
    const subLabels = ["a", "b", "c", "d"];
    var yds = "";
    var french = "";
    var uiaa = "";
    if (climbType === 1) {
      yds = "5." + grade + (grade >= 10 ? subLabels[subGrade] : "");
      const frenchNum = Math.round(grade * 0.85 + subGrade * 0.2 + 1);
      french = formatNumber(frenchNum) + subLabels[Math.min(subGrade, 2)];
      uiaa = "VII" + (grade > 10 ? "+" : "");
      if (grade <= 7) uiaa = "IV";
      else if (grade <= 8) uiaa = "V";
      else if (grade <= 9) uiaa = "VI";
      else if (grade <= 10) uiaa = "VII";
      else if (grade <= 11) uiaa = "VIII";
      else if (grade <= 12) uiaa = "IX";
      else uiaa = "X";
    } else {
      yds = "V" + formatNumber(Math.max(grade - 6, 0));
      french = formatNumber(grade) + subLabels[Math.min(subGrade, 2)];
      uiaa = "Font " + formatNumber(grade) + subLabels[Math.min(subGrade, 2)];
    }
    return {
      primary: { label: "YDS Grade", value: yds },
      details: [
        { label: "French Grade", value: french },
        { label: "UIAA Grade", value: uiaa },
        { label: "Type", value: climbType === 1 ? "Sport / Trad" : "Bouldering" }
      ]
    };
  }`,
  [
    { q: "What climbing grade system is used in the US?", a: "The US uses the Yosemite Decimal System (YDS) for rope climbing (5.0 to 5.15) and the V-scale for bouldering (V0 to V17)." },
    { q: "What is French climbing grade?", a: "The French system uses numbers and letters like 6a, 7b+. It is widely used in Europe for both sport and bouldering." },
    { q: "What is a good beginner climbing grade?", a: "Beginners typically start at 5.6 to 5.8 in YDS or V0 to V1 in bouldering." }
  ],
  "Conversion uses grade lookup tables between YDS, French, UIAA, Ewbank, and V-scale systems",
  ["surfboard-volume-calculator", "kayak-size-calculator"]
);

add(
  "surfboard-volume-calculator",
  "Surfboard Volume Calculator",
  "Calculate ideal surfboard volume in liters based on weight, skill level, and wave conditions.",
  "Everyday",
  "everyday",
  "~",
  ["surfboard volume", "surfboard size", "surfboard liters", "board volume"],
  [
    '{ name: "weight", label: "Body Weight (lbs)", type: "number", min: 80, max: 300, defaultValue: 170 }',
    '{ name: "skill", label: "Skill Level", type: "select", options: [{ value: "0.7", label: "Beginner" }, { value: "0.5", label: "Intermediate" }, { value: "0.38", label: "Advanced" }, { value: "0.34", label: "Pro" }], defaultValue: "0.5" }',
    '{ name: "fitness", label: "Fitness Level", type: "select", options: [{ value: "1.1", label: "Low" }, { value: "1", label: "Average" }, { value: "0.9", label: "High" }], defaultValue: "1" }',
    '{ name: "waveType", label: "Wave Conditions", type: "select", options: [{ value: "1.15", label: "Small / Mushy" }, { value: "1", label: "Average" }, { value: "0.9", label: "Overhead / Powerful" }], defaultValue: "1" }'
  ],
  `(inputs) => {
    const weight = inputs.weight as number;
    const skill = parseFloat(inputs.skill as string);
    const fitness = parseFloat(inputs.fitness as string);
    const waveType = parseFloat(inputs.waveType as string);
    const weightKg = weight * 0.453592;
    const volume = Math.round(weightKg * skill * fitness * waveType * 10) / 10;
    const lengthFt = volume < 25 ? "5'8 - 6'0" : volume < 35 ? "6'0 - 6'6" : volume < 45 ? "6'6 - 7'2" : "7'6 - 9'0";
    const boardType = volume < 25 ? "Shortboard" : volume < 35 ? "Fish / Hybrid" : volume < 45 ? "Funboard / Mini-Mal" : "Longboard";
    return {
      primary: { label: "Recommended Volume", value: formatNumber(volume) + " liters" },
      details: [
        { label: "Board Type", value: boardType },
        { label: "Approximate Length", value: lengthFt },
        { label: "Weight in Kg", value: formatNumber(Math.round(weightKg * 10) / 10) + " kg" }
      ]
    };
  }`,
  [
    { q: "How do I choose surfboard volume?", a: "Volume depends on your weight, skill, and wave conditions. Beginners need about 0.6 to 0.8 liters per kg of body weight." },
    { q: "What does surfboard volume affect?", a: "More volume gives more float and paddle power, making it easier to catch waves. Less volume allows sharper turns." },
    { q: "What volume surfboard for a beginner?", a: "A 170 lb beginner should look for a board around 50 to 60 liters for maximum stability and wave-catching ability." }
  ],
  "Volume (L) = Weight (kg) x Skill Factor x Fitness Factor x Wave Factor",
  ["kayak-size-calculator", "snowboard-size-calculator"]
);

add(
  "kayak-size-calculator",
  "Kayak Size Calculator",
  "Find the right kayak length and width based on your weight, paddling style, and intended water type.",
  "Everyday",
  "everyday",
  "~",
  ["kayak size", "kayak length", "kayak width", "kayak fitting"],
  [
    '{ name: "weight", label: "Paddler Weight (lbs)", type: "number", min: 60, max: 350, defaultValue: 170 }',
    '{ name: "height", label: "Paddler Height (inches)", type: "number", min: 54, max: 84, defaultValue: 70 }',
    '{ name: "waterType", label: "Water Type", type: "select", options: [{ value: "1", label: "Calm Lakes / Ponds" }, { value: "2", label: "Rivers / Streams" }, { value: "3", label: "Coastal / Open Water" }, { value: "4", label: "Whitewater" }], defaultValue: "1" }',
    '{ name: "purpose", label: "Primary Purpose", type: "select", options: [{ value: "1", label: "Recreational" }, { value: "2", label: "Touring / Fitness" }, { value: "3", label: "Fishing" }], defaultValue: "1" }'
  ],
  `(inputs) => {
    const weight = inputs.weight as number;
    const height = inputs.height as number;
    const waterType = parseInt(inputs.waterType as string);
    const purpose = parseInt(inputs.purpose as string);
    var lengthFt = 10;
    if (purpose === 1) lengthFt = weight < 150 ? 9.5 : weight < 200 ? 10.5 : 12;
    else if (purpose === 2) lengthFt = weight < 150 ? 12 : weight < 200 ? 14 : 16;
    else lengthFt = weight < 150 ? 10 : weight < 200 ? 12 : 13;
    if (waterType === 3) lengthFt += 2;
    if (waterType === 4) lengthFt = Math.min(lengthFt, 9);
    var widthIn = purpose === 1 ? 30 : purpose === 2 ? 24 : 34;
    if (weight > 220) widthIn += 2;
    const capacity = Math.round(weight * 1.5 + 30);
    const cockpitSize = height > 74 ? "Large" : height > 66 ? "Medium" : "Standard";
    return {
      primary: { label: "Recommended Kayak Length", value: formatNumber(Math.round(lengthFt * 10) / 10) + " ft" },
      details: [
        { label: "Recommended Width", value: formatNumber(widthIn) + " inches" },
        { label: "Min Weight Capacity", value: formatNumber(capacity) + " lbs" },
        { label: "Cockpit Size", value: cockpitSize }
      ]
    };
  }`,
  [
    { q: "What size kayak do I need?", a: "Kayak size depends on your weight, height, and intended use. Recreational kayaks are 9 to 12 feet, touring kayaks 12 to 16 feet." },
    { q: "Does kayak width matter?", a: "Wider kayaks are more stable but slower. Narrow kayaks track better and are faster but require more balance." },
    { q: "What weight capacity kayak should I get?", a: "Choose a kayak with at least 1.5 times your body weight in capacity to maintain proper performance." }
  ],
  "Length based on weight, purpose, and water type tables; Width by purpose; Capacity = Weight x 1.5 + 30",
  ["surfboard-volume-calculator", "snowboard-size-calculator"]
);

add(
  "snowboard-size-calculator",
  "Snowboard Size Calculator",
  "Calculate ideal snowboard length and width based on height, weight, boot size, and riding style.",
  "Everyday",
  "everyday",
  "~",
  ["snowboard size", "snowboard length", "snowboard width", "snowboard fitting"],
  [
    '{ name: "height", label: "Height (inches)", type: "number", min: 48, max: 84, defaultValue: 70 }',
    '{ name: "weight", label: "Body Weight (lbs)", type: "number", min: 60, max: 300, defaultValue: 170 }',
    '{ name: "bootSize", label: "Boot Size (US)", type: "number", min: 5, max: 16, defaultValue: 10 }',
    '{ name: "style", label: "Riding Style", type: "select", options: [{ value: "1", label: "All-Mountain" }, { value: "2", label: "Freestyle / Park" }, { value: "3", label: "Freeride / Powder" }], defaultValue: "1" }'
  ],
  `(inputs) => {
    const height = inputs.height as number;
    const weight = inputs.weight as number;
    const bootSize = inputs.bootSize as number;
    const style = parseInt(inputs.style as string);
    const heightCm = height * 2.54;
    var boardCm = Math.round(heightCm * 0.88);
    if (weight < 130) boardCm -= 3;
    else if (weight > 200) boardCm += 3;
    if (style === 2) boardCm -= 3;
    else if (style === 3) boardCm += 3;
    const needWide = bootSize >= 11;
    const waistWidth = needWide ? "26+ cm (Wide)" : bootSize >= 9 ? "25-26 cm (Standard)" : "24-25 cm (Narrow)";
    const boardFt = Math.round(boardCm / 30.48 * 10) / 10;
    return {
      primary: { label: "Recommended Board Length", value: formatNumber(boardCm) + " cm" },
      details: [
        { label: "Length in Feet", value: formatNumber(boardFt) + " ft" },
        { label: "Waist Width", value: waistWidth },
        { label: "Wide Board Needed", value: needWide ? "Yes" : "No" }
      ]
    };
  }`,
  [
    { q: "How do I choose snowboard size?", a: "General rule is your board should reach between your chin and nose when stood on end. Weight and riding style also matter." },
    { q: "When do I need a wide snowboard?", a: "If your boot size is 11 or larger, you likely need a wide board to prevent toe and heel drag." },
    { q: "Does riding style affect board length?", a: "Freestyle riders typically go 2 to 4 cm shorter for maneuverability, while freeride and powder riders go longer for float." }
  ],
  "Board Length (cm) = Height (cm) x 0.88 + Weight Adj + Style Adj",
  ["ski-boot-size-calculator", "surfboard-volume-calculator"]
);

add(
  "skateboard-truck-width-calculator",
  "Skateboard Truck Width Calculator",
  "Match skateboard truck width to your deck size for optimal performance.",
  "Everyday",
  "everyday",
  "~",
  ["skateboard truck width", "truck size", "skateboard setup", "truck axle width"],
  [
    '{ name: "deckWidth", label: "Deck Width (inches)", type: "number", min: 7, max: 10, defaultValue: 8 }',
    '{ name: "style", label: "Skating Style", type: "select", options: [{ value: "1", label: "Street" }, { value: "2", label: "Park / Transition" }, { value: "3", label: "Cruising / Commute" }], defaultValue: "1" }',
    '{ name: "wheelSize", label: "Wheel Diameter (mm)", type: "number", min: 48, max: 70, defaultValue: 54 }'
  ],
  `(inputs) => {
    const deckWidth = inputs.deckWidth as number;
    const style = parseInt(inputs.style as string);
    const wheelSize = inputs.wheelSize as number;
    var truckWidth = Math.round(deckWidth * 25.4);
    const truckInch = deckWidth;
    var risers = "None needed";
    if (wheelSize >= 56) risers = '1/8" riser pads';
    if (wheelSize >= 60) risers = '1/4" riser pads';
    const hardness = style === 1 ? "Medium (90-94a)" : style === 2 ? "Medium-Hard (94-97a)" : "Soft (78-87a)";
    const bushings = style === 1 ? "Medium (90a)" : style === 2 ? "Medium-Hard (94a)" : "Soft (85a)";
    return {
      primary: { label: "Truck Axle Width", value: formatNumber(truckWidth) + " mm (" + formatNumber(Math.round(truckInch * 10) / 10) + '"' + ")" },
      details: [
        { label: "Risers", value: risers },
        { label: "Recommended Wheel Hardness", value: hardness },
        { label: "Bushing Hardness", value: bushings }
      ]
    };
  }`,
  [
    { q: "How wide should skateboard trucks be?", a: "Truck axle width should match your deck width within about a quarter inch. An 8 inch deck needs trucks around 8 inches wide." },
    { q: "Do I need riser pads?", a: "Riser pads prevent wheel bite. Use them with wheels larger than 56mm or if you ride loose trucks." },
    { q: "What size wheels for street skating?", a: "Street skating typically uses 50 to 54mm wheels. Larger wheels are better for cruising and rough terrain." }
  ],
  "Truck Width = Deck Width (matched); Risers determined by wheel size",
  ["snowboard-size-calculator", "bicycle-gear-ratio-calculator"]
);

add(
  "lacrosse-stick-length-calculator",
  "Lacrosse Stick Length Calculator",
  "Determine optimal lacrosse stick length based on position, age, and league rules.",
  "Everyday",
  "everyday",
  "~",
  ["lacrosse stick length", "lacrosse shaft size", "lacrosse equipment", "crosse length"],
  [
    '{ name: "position", label: "Position", type: "select", options: [{ value: "1", label: "Attack" }, { value: "2", label: "Midfield" }, { value: "3", label: "Defense" }, { value: "4", label: "Goalie" }], defaultValue: "2" }',
    '{ name: "age", label: "Player Age", type: "number", min: 6, max: 40, defaultValue: 16 }',
    '{ name: "height", label: "Player Height (inches)", type: "number", min: 36, max: 84, defaultValue: 68 }',
    '{ name: "gender", label: "League", type: "select", options: [{ value: "1", label: "Men/Boys" }, { value: "2", label: "Women/Girls" }], defaultValue: "1" }'
  ],
  `(inputs) => {
    const position = parseInt(inputs.position as string);
    const age = inputs.age as number;
    const height = inputs.height as number;
    const gender = parseInt(inputs.gender as string);
    var minLength = 0;
    var maxLength = 0;
    if (gender === 1) {
      if (position <= 2) { minLength = 40; maxLength = 42; }
      else if (position === 3) { minLength = 52; maxLength = 72; }
      else { minLength = 40; maxLength = 72; }
    } else {
      if (position <= 2) { minLength = 35.5; maxLength = 43.25; }
      else if (position === 3) { minLength = 35.5; maxLength = 43.25; }
      else { minLength = 35.5; maxLength = 52; }
    }
    if (age < 10) { minLength = Math.min(minLength, 36); maxLength = Math.min(maxLength, 42); }
    var recommended = Math.round((minLength + maxLength) / 2);
    if (height < 60) recommended = Math.round(minLength + (maxLength - minLength) * 0.25);
    const headWidth = gender === 1 ? (position === 4 ? "10-12 in" : "6-10 in") : "7-9 in";
    return {
      primary: { label: "Recommended Total Length", value: formatNumber(recommended) + " inches" },
      details: [
        { label: "Legal Range", value: formatNumber(minLength) + " - " + formatNumber(maxLength) + " inches" },
        { label: "Head Width", value: headWidth },
        { label: "Position", value: position === 1 ? "Attack" : position === 2 ? "Midfield" : position === 3 ? "Defense" : "Goalie" }
      ]
    };
  }`,
  [
    { q: "How long should my lacrosse stick be?", a: "Attack and midfield sticks are 40 to 42 inches. Defensive sticks range from 52 to 72 inches in men's lacrosse." },
    { q: "Are women's lacrosse sticks different?", a: "Yes, women's sticks range from 35.5 to 43.25 inches for field players and have different pocket rules." },
    { q: "What stick length for a youth player?", a: "Youth players under 10 typically use sticks between 36 and 42 inches total." }
  ],
  "Stick Length = Position-based range per league rules, adjusted for age and height",
  ["hockey-stick-flex-calculator", "boxing-reach-advantage-calculator"]
);

add(
  "martial-arts-belt-progression-calculator",
  "Martial Arts Belt Progression Calculator",
  "Estimate time to reach your target belt rank based on training frequency and martial art discipline.",
  "Health",
  "health",
  "H",
  ["martial arts belt", "belt progression", "karate belt time", "belt rank"],
  [
    '{ name: "discipline", label: "Martial Art", type: "select", options: [{ value: "1", label: "Karate" }, { value: "2", label: "Taekwondo" }, { value: "3", label: "Brazilian Jiu-Jitsu" }, { value: "4", label: "Judo" }], defaultValue: "1" }',
    '{ name: "currentBelt", label: "Current Belt Level", type: "select", options: [{ value: "0", label: "White (Beginner)" }, { value: "1", label: "Yellow / Gray" }, { value: "2", label: "Orange / Green" }, { value: "3", label: "Blue / Purple" }, { value: "4", label: "Brown" }, { value: "5", label: "Black 1st Degree" }], defaultValue: "0" }',
    '{ name: "targetBelt", label: "Target Belt Level", type: "select", options: [{ value: "1", label: "Yellow / Gray" }, { value: "2", label: "Orange / Green" }, { value: "3", label: "Blue / Purple" }, { value: "4", label: "Brown" }, { value: "5", label: "Black 1st Degree" }], defaultValue: "5" }',
    '{ name: "sessionsPerWeek", label: "Training Sessions per Week", type: "number", min: 1, max: 7, defaultValue: 3 }'
  ],
  `(inputs) => {
    const discipline = parseInt(inputs.discipline as string);
    const currentBelt = parseInt(inputs.currentBelt as string);
    const targetBelt = parseInt(inputs.targetBelt as string);
    const sessions = inputs.sessionsPerWeek as number;
    const monthsPerLevel = discipline === 1 ? 6 : discipline === 2 ? 5 : discipline === 3 ? 18 : 8;
    const levelsToGo = Math.max(targetBelt - currentBelt, 0);
    const baseMonths = levelsToGo * monthsPerLevel;
    const frequencyFactor = sessions >= 5 ? 0.7 : sessions >= 3 ? 1 : sessions >= 2 ? 1.4 : 2;
    const adjustedMonths = Math.round(baseMonths * frequencyFactor);
    const years = Math.floor(adjustedMonths / 12);
    const months = adjustedMonths % 12;
    const totalSessions = adjustedMonths * sessions * 4;
    return {
      primary: { label: "Estimated Time", value: (years > 0 ? formatNumber(years) + " yr " : "") + formatNumber(months) + " mo" },
      details: [
        { label: "Levels to Advance", value: formatNumber(levelsToGo) },
        { label: "Total Training Sessions", value: formatNumber(totalSessions) },
        { label: "Training Frequency Factor", value: formatNumber(frequencyFactor) + "x" }
      ]
    };
  }`,
  [
    { q: "How long does it take to get a black belt?", a: "It varies by discipline. Karate and Taekwondo typically take 3 to 5 years. Brazilian Jiu-Jitsu averages 8 to 12 years." },
    { q: "Does training more often speed up progression?", a: "Yes, training 4 to 5 times per week can accelerate progression by 30 percent compared to twice weekly." },
    { q: "Are belt systems the same across martial arts?", a: "No, each art has its own belt system. BJJ has fewer belts but takes longer per belt. Karate and Taekwondo have more intermediate ranks." }
  ],
  "Time = (Levels x Months per Level) x Frequency Factor; varies by discipline",
  ["boxing-reach-advantage-calculator", "running-shoe-mileage-calculator"]
);

add(
  "rowing-stroke-rate-calculator",
  "Rowing Stroke Rate Calculator",
  "Calculate rowing metrics including stroke rate, split time, power output, and calories burned.",
  "Health",
  "health",
  "H",
  ["rowing stroke rate", "rowing pace", "rowing split", "erg calculator"],
  [
    '{ name: "distance", label: "Distance (meters)", type: "number", min: 100, max: 42195, defaultValue: 2000 }',
    '{ name: "minutes", label: "Time Minutes", type: "number", min: 0, max: 120, defaultValue: 7 }',
    '{ name: "seconds", label: "Time Seconds", type: "number", min: 0, max: 59, defaultValue: 30 }',
    '{ name: "weight", label: "Body Weight (lbs)", type: "number", min: 80, max: 350, defaultValue: 175 }'
  ],
  `(inputs) => {
    const distance = inputs.distance as number;
    const minutes = inputs.minutes as number;
    const seconds = inputs.seconds as number;
    const weight = inputs.weight as number;
    const totalSeconds = minutes * 60 + seconds;
    const splitSeconds = (totalSeconds / distance) * 500;
    const splitMin = Math.floor(splitSeconds / 60);
    const splitSec = Math.round(splitSeconds % 60);
    const pace = distance / totalSeconds;
    const watts = 2.8 / Math.pow(splitSeconds / 500, 3) * 1000;
    const calPerHour = Math.round((watts * 4 + 0.35 * weight * 0.453592) * 0.86);
    const totalCal = Math.round(calPerHour * (totalSeconds / 3600));
    const strokeRate = Math.round(distance / (totalSeconds / 60) / 10);
    return {
      primary: { label: "500m Split", value: formatNumber(splitMin) + ":" + (splitSec < 10 ? "0" : "") + formatNumber(splitSec) },
      details: [
        { label: "Estimated Watts", value: formatNumber(Math.round(watts)) },
        { label: "Estimated Stroke Rate", value: formatNumber(strokeRate) + " spm" },
        { label: "Calories Burned", value: formatNumber(totalCal) + " cal" }
      ]
    };
  }`,
  [
    { q: "What is a good 2K rowing time?", a: "For men, sub-7:00 is competitive and sub-6:20 is elite. For women, sub-8:00 is competitive and sub-7:10 is elite." },
    { q: "What stroke rate should I row at?", a: "Steady-state rows are typically 18 to 22 strokes per minute. Race pace is 28 to 36 strokes per minute." },
    { q: "How many calories does rowing burn?", a: "Rowing burns approximately 400 to 800 calories per hour depending on intensity and body weight." }
  ],
  "Split = (Total Time / Distance) x 500; Watts = 2.8 / (Split/500)^3 x 1000",
  ["swim-pace-calculator", "triathlon-transition-time-calculator"]
);

add(
  "triathlon-transition-time-calculator",
  "Triathlon Transition Time Calculator",
  "Estimate triathlon total time including swim, bike, run legs and T1/T2 transition times.",
  "Health",
  "health",
  "H",
  ["triathlon time", "triathlon transition", "T1 T2 time", "triathlon calculator"],
  [
    '{ name: "raceType", label: "Race Distance", type: "select", options: [{ value: "1", label: "Sprint (750m/20K/5K)" }, { value: "2", label: "Olympic (1.5K/40K/10K)" }, { value: "3", label: "Half Ironman (1.9K/90K/21.1K)" }, { value: "4", label: "Ironman (3.8K/180K/42.2K)" }], defaultValue: "2" }',
    '{ name: "swimPace", label: "Swim Pace (min per 100m)", type: "number", min: 1, max: 5, defaultValue: 2 }',
    '{ name: "bikePace", label: "Bike Speed (mph)", type: "number", min: 8, max: 30, defaultValue: 18 }',
    '{ name: "runPace", label: "Run Pace (min per mile)", type: "number", min: 5, max: 16, defaultValue: 9 }'
  ],
  `(inputs) => {
    const raceType = parseInt(inputs.raceType as string);
    const swimPace = inputs.swimPace as number;
    const bikePace = inputs.bikePace as number;
    const runPace = inputs.runPace as number;
    const races = [[750, 20, 5], [1500, 40, 10], [1900, 90, 21.1], [3800, 180, 42.2]];
    const race = races[raceType - 1];
    const swimMin = (race[0] / 100) * swimPace;
    const bikeMin = (race[1] / 1.60934) / bikePace * 60;
    const runMin = (race[2] / 1.60934) * runPace;
    const t1 = raceType <= 2 ? 3 : 5;
    const t2 = raceType <= 2 ? 2 : 4;
    const totalMin = swimMin + t1 + bikeMin + t2 + runMin;
    const hours = Math.floor(totalMin / 60);
    const mins = Math.round(totalMin % 60);
    return {
      primary: { label: "Estimated Total Time", value: formatNumber(hours) + "h " + formatNumber(mins) + "m" },
      details: [
        { label: "Swim Time", value: formatNumber(Math.round(swimMin)) + " min" },
        { label: "Bike Time", value: formatNumber(Math.round(bikeMin)) + " min" },
        { label: "Run Time", value: formatNumber(Math.round(runMin)) + " min" },
        { label: "T1 + T2 Transitions", value: formatNumber(t1 + t2) + " min" }
      ]
    };
  }`,
  [
    { q: "What are T1 and T2 in triathlon?", a: "T1 is the transition from swim to bike. T2 is the transition from bike to run. Together they can add 5 to 15 minutes." },
    { q: "What is a good Olympic triathlon time?", a: "For age-group athletes, 2:30 to 3:00 is solid. Competitive amateurs finish in 2:00 to 2:30. Elites are under 2:00." },
    { q: "How do I reduce transition time?", a: "Practice transitions, use elastic laces, lay out gear logically, and consider a race belt for your bib number." }
  ],
  "Total = Swim Time + T1 + Bike Time + T2 + Run Time",
  ["swim-pace-calculator", "rowing-stroke-rate-calculator"]
);

add(
  "sports-drink-hydration-calculator",
  "Sports Drink Hydration Calculator",
  "Calculate fluid, electrolyte, and carbohydrate needs during exercise based on activity and conditions.",
  "Health",
  "health",
  "H",
  ["sports drink", "exercise hydration", "electrolyte needs", "fluid replacement"],
  [
    '{ name: "duration", label: "Exercise Duration (minutes)", type: "number", min: 15, max: 600, defaultValue: 90 }',
    '{ name: "intensity", label: "Exercise Intensity", type: "select", options: [{ value: "1", label: "Low (walking, yoga)" }, { value: "2", label: "Moderate (jogging, cycling)" }, { value: "3", label: "High (racing, HIIT)" }], defaultValue: "2" }',
    '{ name: "weight", label: "Body Weight (lbs)", type: "number", min: 80, max: 350, defaultValue: 160 }',
    '{ name: "temp", label: "Temperature", type: "select", options: [{ value: "1", label: "Cool (under 60F)" }, { value: "1.3", label: "Moderate (60-80F)" }, { value: "1.6", label: "Hot (over 80F)" }], defaultValue: "1.3" }'
  ],
  `(inputs) => {
    const duration = inputs.duration as number;
    const intensity = parseInt(inputs.intensity as string);
    const weight = inputs.weight as number;
    const temp = parseFloat(inputs.temp as string);
    const baseSweatRate = intensity === 1 ? 16 : intensity === 2 ? 28 : 40;
    const sweatOzPerHour = Math.round(baseSweatRate * (weight / 150) * temp);
    const totalFluidOz = Math.round(sweatOzPerHour * (duration / 60));
    const sodiumMg = Math.round(sweatOzPerHour * 30 * (duration / 60));
    const carbGrams = duration > 60 ? Math.round(duration / 60 * 40) : 0;
    const drinkServings = Math.ceil(totalFluidOz / 8);
    return {
      primary: { label: "Fluid Needed", value: formatNumber(totalFluidOz) + " oz" },
      details: [
        { label: "Sweat Rate", value: formatNumber(sweatOzPerHour) + " oz/hr" },
        { label: "Sodium Needed", value: formatNumber(sodiumMg) + " mg" },
        { label: "Carbs Needed", value: formatNumber(carbGrams) + " g" },
        { label: "Drink Servings (8oz)", value: formatNumber(drinkServings) }
      ]
    };
  }`,
  [
    { q: "How much should I drink during exercise?", a: "General guidelines suggest 4 to 8 ounces every 15 to 20 minutes during exercise. Individual needs vary with sweat rate." },
    { q: "Do I need a sports drink for short workouts?", a: "For exercise under 60 minutes, water is usually sufficient. Sports drinks help during longer or intense sessions." },
    { q: "How much sodium do I lose in sweat?", a: "Average sweat contains 800 to 1500 mg of sodium per liter. Heavy sweaters may lose even more." }
  ],
  "Fluid (oz) = Sweat Rate x Weight Factor x Temp Factor x Duration; Sodium = Sweat Rate x 30mg/oz",
  ["swim-pace-calculator", "running-shoe-mileage-calculator"]
);

add(
  "athletic-tape-usage-calculator",
  "Athletic Tape Usage Calculator",
  "Calculate the amount of athletic tape needed for common sports taping applications.",
  "Health",
  "health",
  "H",
  ["athletic tape", "sports tape", "kinesiology tape", "taping guide"],
  [
    '{ name: "application", label: "Taping Application", type: "select", options: [{ value: "1", label: "Ankle Stabilization" }, { value: "2", label: "Knee Support" }, { value: "3", label: "Wrist Support" }, { value: "4", label: "Shoulder / Rotator Cuff" }, { value: "5", label: "Shin Splints" }], defaultValue: "1" }',
    '{ name: "tapeType", label: "Tape Type", type: "select", options: [{ value: "1", label: "Athletic (1.5in rigid)" }, { value: "2", label: "Kinesiology (2in elastic)" }, { value: "3", label: "Elastic Bandage (3in)" }], defaultValue: "1" }',
    '{ name: "joints", label: "Number of Joints to Tape", type: "number", min: 1, max: 6, defaultValue: 2 }',
    '{ name: "sessions", label: "Sessions per Week", type: "number", min: 1, max: 14, defaultValue: 5 }'
  ],
  `(inputs) => {
    const application = parseInt(inputs.application as string);
    const tapeType = parseInt(inputs.tapeType as string);
    const joints = inputs.joints as number;
    const sessions = inputs.sessions as number;
    const inchesPerApp = application === 1 ? 120 : application === 2 ? 96 : application === 3 ? 60 : application === 4 ? 80 : 72;
    const tapeWidthFactor = tapeType === 1 ? 1 : tapeType === 2 ? 0.8 : 0.6;
    const inchesPerSession = Math.round(inchesPerApp * tapeWidthFactor * joints);
    const inchesPerWeek = inchesPerSession * sessions;
    const rollLength = tapeType === 1 ? 360 : tapeType === 2 ? 240 : 180;
    const rollsPerWeek = Math.ceil(inchesPerWeek / rollLength * 10) / 10;
    const rollsPerMonth = Math.ceil(rollsPerWeek * 4.33);
    const costPerRoll = tapeType === 1 ? 4 : tapeType === 2 ? 12 : 3;
    const monthlyCost = Math.round(rollsPerMonth * costPerRoll);
    return {
      primary: { label: "Tape per Session", value: formatNumber(Math.round(inchesPerSession / 12)) + " ft (" + formatNumber(inchesPerSession) + " in)" },
      details: [
        { label: "Weekly Usage", value: formatNumber(Math.round(inchesPerWeek / 12)) + " ft" },
        { label: "Rolls per Month", value: formatNumber(rollsPerMonth) },
        { label: "Monthly Cost", value: "$" + formatNumber(monthlyCost) }
      ]
    };
  }`,
  [
    { q: "How much tape do I need for an ankle?", a: "A standard ankle taping uses about 8 to 12 feet of 1.5 inch rigid athletic tape including anchors and stirrups." },
    { q: "What is the difference between athletic tape and kinesiology tape?", a: "Athletic tape is rigid and restricts movement for support. Kinesiology tape is elastic and allows movement while providing proprioceptive feedback." },
    { q: "Can I reuse athletic tape?", a: "No, athletic tape should not be reused. Kinesiology tape can stay on for 2 to 5 days if applied properly." }
  ],
  "Tape per Session = Base Inches x Width Factor x Joints; Rolls/Month = Weekly Usage / Roll Length x 4.33",
  ["sports-drink-hydration-calculator", "running-shoe-mileage-calculator"]
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
fs.writeFileSync(path.join(__dirname, 'new-imports-batch11.txt'), newImports.join('\n'));
fs.writeFileSync(path.join(__dirname, 'new-regs-batch11.txt'), newRegs.join('\n'));
console.log(`Imports saved to: scripts/new-imports-batch11.txt`);
console.log(`Registry saved to: scripts/new-regs-batch11.txt`);
