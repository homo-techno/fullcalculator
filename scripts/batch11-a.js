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
