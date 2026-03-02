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

// === BATCH 8: 100 CALCULATORS ===

add('wedding-budget-calculator', 'Wedding Budget Calculator',
  'Calculate a total wedding budget breakdown by category.',
  'Finance', 'finance', '$',
  ['wedding budget', 'wedding cost', 'wedding planning'],
  [
    '{ name: "totalBudget", label: "Total Budget ($)", type: "number", min: 1000, max: 500000, defaultValue: 30000 }',
    '{ name: "venuePercent", label: "Venue (%)", type: "number", min: 0, max: 100, defaultValue: 40 }',
    '{ name: "cateringPercent", label: "Catering (%)", type: "number", min: 0, max: 100, defaultValue: 25 }',
    '{ name: "photoPercent", label: "Photo/Video (%)", type: "number", min: 0, max: 100, defaultValue: 10 }',
  ],
  `(inputs) => {
      const total = inputs.totalBudget as number;
      const venue = inputs.venuePercent as number;
      const catering = inputs.cateringPercent as number;
      const photo = inputs.photoPercent as number;
      if (!total) return null;
      const venueAmt = total * venue / 100;
      const cateringAmt = total * catering / 100;
      const photoAmt = total * photo / 100;
      const remaining = total - venueAmt - cateringAmt - photoAmt;
      return {
        primary: { label: "Total Budget", value: "$" + formatNumber(total) },
        details: [
          { label: "Venue", value: "$" + formatNumber(Math.round(venueAmt)) },
          { label: "Catering", value: "$" + formatNumber(Math.round(cateringAmt)) },
          { label: "Photo/Video", value: "$" + formatNumber(Math.round(photoAmt)) },
          { label: "Remaining", value: "$" + formatNumber(Math.round(remaining)) },
        ],
      };
  }`,
  [{ q: 'What is the average wedding budget?', a: 'The average US wedding costs about $30,000 to $35,000.' },
   { q: 'What takes the most of a wedding budget?', a: 'The venue and catering typically take 50 to 60 percent.' }],
  'Category Amount = Total Budget x Category Percent / 100',
  ['wedding-guest-calculator', 'event-catering-calculator']
);

add('wedding-guest-calculator', 'Wedding Guest Calculator',
  'Estimate catering and seating needs from guest count.',
  'Everyday', 'everyday', '~',
  ['wedding guests', 'wedding seating', 'wedding catering'],
  [
    '{ name: "guests", label: "Guest Count", type: "number", min: 10, max: 1000, defaultValue: 150 }',
    '{ name: "costPerHead", label: "Cost per Head ($)", type: "number", min: 10, max: 500, defaultValue: 75 }',
    '{ name: "tables", label: "Seats per Table", type: "number", min: 4, max: 12, defaultValue: 8 }',
  ],
  `(inputs) => {
      const guests = inputs.guests as number;
      const cost = inputs.costPerHead as number;
      const seats = inputs.tables as number;
      if (!guests || !cost || !seats) return null;
      const totalCost = guests * cost;
      const tableCount = Math.ceil(guests / seats);
      return {
        primary: { label: "Total Catering Cost", value: "$" + formatNumber(totalCost) },
        details: [
          { label: "Guest Count", value: formatNumber(guests) },
          { label: "Tables Needed", value: formatNumber(tableCount) },
          { label: "Cost per Head", value: "$" + formatNumber(cost) },
        ],
      };
  }`,
  [{ q: 'How many guests should I plan for?', a: 'Plan for about 80 percent of invited guests to attend.' },
   { q: 'How many seats per table at a wedding?', a: 'Round tables typically seat 8 to 10 guests each.' }],
  'Total Cost = Guest Count x Cost per Head',
  ['wedding-budget-calculator', 'event-catering-calculator']
);

add('wedding-flower-calculator', 'Wedding Flower Calculator',
  'Estimate floral arrangement costs for a wedding.',
  'Finance', 'finance', '$',
  ['wedding flowers', 'floral cost', 'wedding bouquet'],
  [
    '{ name: "bouquets", label: "Bouquets", type: "number", min: 0, max: 20, defaultValue: 5 }',
    '{ name: "bouquetCost", label: "Cost per Bouquet ($)", type: "number", min: 20, max: 500, defaultValue: 150 }',
    '{ name: "centerpieces", label: "Centerpieces", type: "number", min: 0, max: 50, defaultValue: 15 }',
    '{ name: "centerpieceCost", label: "Cost per Centerpiece ($)", type: "number", min: 20, max: 300, defaultValue: 75 }',
  ],
  `(inputs) => {
      const bq = inputs.bouquets as number;
      const bqCost = inputs.bouquetCost as number;
      const cp = inputs.centerpieces as number;
      const cpCost = inputs.centerpieceCost as number;
      const bouquetTotal = bq * bqCost;
      const cpTotal = cp * cpCost;
      const total = bouquetTotal + cpTotal;
      return {
        primary: { label: "Total Floral Cost", value: "$" + formatNumber(total) },
        details: [
          { label: "Bouquets Cost", value: "$" + formatNumber(bouquetTotal) },
          { label: "Centerpieces Cost", value: "$" + formatNumber(cpTotal) },
          { label: "Total Arrangements", value: formatNumber(bq + cp) },
        ],
      };
  }`,
  [{ q: 'How much do wedding flowers cost?', a: 'Wedding flowers typically cost $1,500 to $5,000 total.' },
   { q: 'How many centerpieces do I need?', a: 'You need one centerpiece per guest table.' }],
  'Total = (Bouquets x Cost) + (Centerpieces x Cost)',
  ['wedding-budget-calculator', 'wedding-cake-calculator']
);

add('wedding-cake-calculator', 'Wedding Cake Calculator',
  'Calculate cake servings and cost by number of tiers.',
  'Everyday', 'everyday', '~',
  ['wedding cake', 'cake servings', 'cake tiers'],
  [
    '{ name: "tiers", label: "Number of Tiers", type: "select", options: [{ value: "2", label: "2 Tiers" }, { value: "3", label: "3 Tiers" }, { value: "4", label: "4 Tiers" }, { value: "5", label: "5 Tiers" }], defaultValue: "3" }',
    '{ name: "costPerSlice", label: "Cost per Slice ($)", type: "number", min: 2, max: 30, defaultValue: 8 }',
    '{ name: "guests", label: "Guest Count", type: "number", min: 10, max: 500, defaultValue: 150 }',
  ],
  `(inputs) => {
      const tiers = parseInt(inputs.tiers as string);
      const costSlice = inputs.costPerSlice as number;
      const guests = inputs.guests as number;
      if (!tiers || !costSlice || !guests) return null;
      const servingsMap: Record<number, number> = { 2: 60, 3: 100, 4: 150, 5: 200 };
      const servings = servingsMap[tiers] || 100;
      const needed = Math.max(servings, guests);
      const total = needed * costSlice;
      return {
        primary: { label: "Cake Cost", value: "$" + formatNumber(total) },
        details: [
          { label: "Tiers", value: formatNumber(tiers) },
          { label: "Servings", value: formatNumber(needed) },
          { label: "Cost per Slice", value: "$" + formatNumber(costSlice) },
        ],
      };
  }`,
  [{ q: 'How many tiers for 150 guests?', a: 'A 3-tier cake typically serves 100 to 150 guests.' },
   { q: 'How much does a wedding cake cost?', a: 'Wedding cakes cost about $3 to $12 per slice on average.' }],
  'Total Cost = Servings x Cost per Slice',
  ['wedding-budget-calculator', 'wedding-guest-calculator']
);

add('wedding-invitation-calculator', 'Wedding Invitation Calculator',
  'Calculate invitation quantity and printing cost.',
  'Everyday', 'everyday', '~',
  ['wedding invitations', 'invitation count', 'invitation cost'],
  [
    '{ name: "households", label: "Households to Invite", type: "number", min: 10, max: 500, defaultValue: 100 }',
    '{ name: "costPer", label: "Cost per Invitation ($)", type: "number", min: 1, max: 30, defaultValue: 5 }',
    '{ name: "extraPercent", label: "Extra Invitations (%)", type: "number", min: 0, max: 50, defaultValue: 10 }',
  ],
  `(inputs) => {
      const hh = inputs.households as number;
      const cost = inputs.costPer as number;
      const extra = inputs.extraPercent as number;
      if (!hh || !cost) return null;
      const total = Math.ceil(hh * (1 + extra / 100));
      const totalCost = total * cost;
      return {
        primary: { label: "Total Invitations", value: formatNumber(total) },
        details: [
          { label: "Households", value: formatNumber(hh) },
          { label: "Extra Copies", value: formatNumber(total - hh) },
          { label: "Total Cost", value: "$" + formatNumber(totalCost) },
        ],
      };
  }`,
  [{ q: 'How many invitations do I need?', a: 'Send one per household, plus 10 percent extra.' },
   { q: 'When should invitations be sent?', a: 'Send wedding invitations 6 to 8 weeks before the date.' }],
  'Total = Households x (1 + Extra Percent / 100)',
  ['wedding-guest-calculator', 'wedding-budget-calculator']
);

add('event-tent-size-calculator', 'Event Tent Size Calculator',
  'Determine tent size needed for an outdoor event.',
  'Everyday', 'everyday', '~',
  ['event tent', 'tent size', 'outdoor event tent'],
  [
    '{ name: "guests", label: "Guest Count", type: "number", min: 10, max: 1000, defaultValue: 100 }',
    '{ name: "sqftPerGuest", label: "Sq Ft per Guest", type: "number", min: 8, max: 25, defaultValue: 12 }',
    '{ name: "hasDance", label: "Dance Floor", type: "select", options: [{ value: "0", label: "No" }, { value: "1", label: "Yes" }], defaultValue: "0" }',
  ],
  `(inputs) => {
      const guests = inputs.guests as number;
      const sqft = inputs.sqftPerGuest as number;
      const dance = inputs.hasDance as string;
      if (!guests || !sqft) return null;
      const base = guests * sqft;
      const danceArea = dance === "1" ? guests * 3 : 0;
      const total = base + danceArea;
      return {
        primary: { label: "Tent Size Needed", value: formatNumber(total) + " sq ft" },
        details: [
          { label: "Seating Area", value: formatNumber(base) + " sq ft" },
          { label: "Dance Floor", value: formatNumber(danceArea) + " sq ft" },
          { label: "Suggested Tent", value: Math.ceil(total / 100) * 100 + " sq ft" },
        ],
      };
  }`,
  [{ q: 'How much tent space per guest?', a: 'Allow 10 to 12 square feet per guest for seated events.' },
   { q: 'What size tent for 100 guests?', a: 'A 30x40 tent (1,200 sq ft) fits about 100 seated guests.' }],
  'Total Sq Ft = (Guests x Sq Ft per Guest) + Dance Area',
  ['event-catering-calculator', 'event-parking-calculator']
);

add('event-catering-calculator', 'Event Catering Calculator',
  'Estimate total catering cost per head for events.',
  'Finance', 'finance', '$',
  ['event catering', 'catering cost', 'catering per head'],
  [
    '{ name: "guests", label: "Guest Count", type: "number", min: 10, max: 2000, defaultValue: 100 }',
    '{ name: "mealCost", label: "Meal Cost per Head ($)", type: "number", min: 10, max: 300, defaultValue: 50 }',
    '{ name: "drinkCost", label: "Drink Cost per Head ($)", type: "number", min: 0, max: 100, defaultValue: 15 }',
    '{ name: "serviceFee", label: "Service Fee (%)", type: "number", min: 0, max: 30, defaultValue: 18 }',
  ],
  `(inputs) => {
      const guests = inputs.guests as number;
      const meal = inputs.mealCost as number;
      const drink = inputs.drinkCost as number;
      const fee = inputs.serviceFee as number;
      if (!guests || !meal) return null;
      const subtotal = guests * (meal + drink);
      const feeAmt = subtotal * fee / 100;
      const total = subtotal + feeAmt;
      return {
        primary: { label: "Total Catering Cost", value: "$" + formatNumber(Math.round(total)) },
        details: [
          { label: "Subtotal", value: "$" + formatNumber(Math.round(subtotal)) },
          { label: "Service Fee", value: "$" + formatNumber(Math.round(feeAmt)) },
          { label: "Cost per Guest", value: "$" + formatNumber(Math.round(total / guests)) },
        ],
      };
  }`,
  [{ q: 'How much does event catering cost?', a: 'Event catering averages $30 to $100 per person.' },
   { q: 'Should I include a service fee?', a: 'Most caterers add 15 to 20 percent for service and gratuity.' }],
  'Total = Guests x (Meal + Drink) x (1 + Service Fee / 100)',
  ['wedding-guest-calculator', 'event-bar-calculator']
);

add('event-parking-calculator', 'Event Parking Calculator',
  'Estimate parking spaces needed for an event.',
  'Everyday', 'everyday', '~',
  ['event parking', 'parking spaces', 'parking lot event'],
  [
    '{ name: "guests", label: "Guest Count", type: "number", min: 10, max: 2000, defaultValue: 200 }',
    '{ name: "guestsPerCar", label: "Guests per Car", type: "number", min: 1, max: 6, defaultValue: 2 }',
    '{ name: "staffCars", label: "Staff Vehicles", type: "number", min: 0, max: 100, defaultValue: 10 }',
  ],
  `(inputs) => {
      const guests = inputs.guests as number;
      const perCar = inputs.guestsPerCar as number;
      const staff = inputs.staffCars as number;
      if (!guests || !perCar) return null;
      const guestCars = Math.ceil(guests / perCar);
      const total = guestCars + staff;
      const lotSqFt = total * 180;
      return {
        primary: { label: "Parking Spaces Needed", value: formatNumber(total) },
        details: [
          { label: "Guest Cars", value: formatNumber(guestCars) },
          { label: "Staff Cars", value: formatNumber(staff) },
          { label: "Lot Size Needed", value: formatNumber(lotSqFt) + " sq ft" },
        ],
      };
  }`,
  [{ q: 'How many parking spaces per guest?', a: 'Plan one space per 2 to 3 guests on average.' },
   { q: 'How big is a standard parking space?', a: 'A standard parking space is about 9 by 18 feet.' }],
  'Spaces = ceil(Guests / Guests per Car) + Staff',
  ['event-tent-size-calculator', 'event-catering-calculator']
);

add('event-bar-calculator', 'Event Bar Calculator',
  'Estimate bar drink quantities per guest.',
  'Everyday', 'everyday', '~',
  ['event bar', 'drinks per guest', 'bar estimate'],
  [
    '{ name: "guests", label: "Guest Count", type: "number", min: 10, max: 1000, defaultValue: 100 }',
    '{ name: "hours", label: "Event Duration (hours)", type: "number", min: 1, max: 8, defaultValue: 4 }',
    '{ name: "drinksPerHour", label: "Drinks per Guest per Hour", type: "number", min: 1, max: 3, defaultValue: 2 }',
  ],
  `(inputs) => {
      const guests = inputs.guests as number;
      const hours = inputs.hours as number;
      const dph = inputs.drinksPerHour as number;
      if (!guests || !hours || !dph) return null;
      const totalDrinks = guests * hours * dph;
      const wine = Math.ceil(totalDrinks * 0.4 / 5);
      const beer = Math.ceil(totalDrinks * 0.4);
      const liquor = Math.ceil(totalDrinks * 0.2 / 16);
      return {
        primary: { label: "Total Drinks", value: formatNumber(totalDrinks) },
        details: [
          { label: "Wine Bottles", value: formatNumber(wine) },
          { label: "Beer Units", value: formatNumber(beer) },
          { label: "Liquor Bottles", value: formatNumber(liquor) },
        ],
      };
  }`,
  [{ q: 'How many drinks per guest should I plan?', a: 'Plan about 2 drinks per guest for the first hour and 1 after.' },
   { q: 'How many bottles of wine for 100 guests?', a: 'About 30 to 40 bottles of wine for 100 guests over 4 hours.' }],
  'Total Drinks = Guests x Hours x Drinks per Hour',
  ['event-catering-calculator', 'wedding-budget-calculator']
);

add('party-balloon-calculator', 'Party Balloon Calculator',
  'Calculate balloons needed for event decoration.',
  'Everyday', 'everyday', '~',
  ['party balloons', 'balloon count', 'decoration balloons'],
  [
    '{ name: "tables", label: "Number of Tables", type: "number", min: 0, max: 100, defaultValue: 10 }',
    '{ name: "balloonsPerTable", label: "Balloons per Table", type: "number", min: 1, max: 20, defaultValue: 5 }',
    '{ name: "archBalloons", label: "Arch Balloons", type: "number", min: 0, max: 500, defaultValue: 100 }',
    '{ name: "costPer", label: "Cost per Balloon ($)", type: "number", min: 0, max: 10, defaultValue: 1 }',
  ],
  `(inputs) => {
      const tables = inputs.tables as number;
      const perTable = inputs.balloonsPerTable as number;
      const arch = inputs.archBalloons as number;
      const cost = inputs.costPer as number;
      const tableBalloons = tables * perTable;
      const total = tableBalloons + arch;
      const totalCost = total * cost;
      return {
        primary: { label: "Total Balloons", value: formatNumber(total) },
        details: [
          { label: "Table Balloons", value: formatNumber(tableBalloons) },
          { label: "Arch Balloons", value: formatNumber(arch) },
          { label: "Total Cost", value: "$" + formatNumber(Math.round(totalCost)) },
        ],
      };
  }`,
  [{ q: 'How many balloons for a balloon arch?', a: 'A standard arch needs 80 to 120 balloons depending on size.' },
   { q: 'How many balloons per table?', a: 'Use 3 to 5 balloons per table centerpiece cluster.' }],
  'Total = (Tables x Balloons per Table) + Arch Balloons',
  ['event-tent-size-calculator', 'event-catering-calculator']
);

add('retirement-home-cost-calculator', 'Retirement Home Cost Calculator',
  'Estimate monthly senior living facility costs.',
  'Finance', 'finance', '$',
  ['retirement home cost', 'senior living cost', 'assisted living'],
  [
    '{ name: "careLevel", label: "Care Level", type: "select", options: [{ value: "independent", label: "Independent" }, { value: "assisted", label: "Assisted" }, { value: "memory", label: "Memory Care" }], defaultValue: "assisted" }',
    '{ name: "baseRate", label: "Base Monthly Rate ($)", type: "number", min: 1000, max: 20000, defaultValue: 4500 }',
    '{ name: "extras", label: "Extra Services ($)", type: "number", min: 0, max: 5000, defaultValue: 500 }',
  ],
  `(inputs) => {
      const level = inputs.careLevel as string;
      const base = inputs.baseRate as number;
      const extras = inputs.extras as number;
      if (!base) return null;
      const multiplier: Record<string, number> = { independent: 0.8, assisted: 1, memory: 1.5 };
      const mult = multiplier[level] || 1;
      const monthly = base * mult + extras;
      const annual = monthly * 12;
      return {
        primary: { label: "Monthly Cost", value: "$" + formatNumber(Math.round(monthly)) },
        details: [
          { label: "Care Level", value: level },
          { label: "Base Adjusted", value: "$" + formatNumber(Math.round(base * mult)) },
          { label: "Annual Cost", value: "$" + formatNumber(Math.round(annual)) },
        ],
      };
  }`,
  [{ q: 'How much does assisted living cost?', a: 'Assisted living averages $4,000 to $6,000 per month in the US.' },
   { q: 'Does Medicare cover senior living?', a: 'Medicare generally does not cover assisted living costs.' }],
  'Monthly = Base Rate x Care Multiplier + Extras',
  ['elder-care-cost-calculator', 'medicare-supplement-calculator']
);

add('medicare-supplement-calculator', 'Medicare Supplement Calculator',
  'Estimate monthly Medigap supplement premium.',
  'Finance', 'finance', '$',
  ['medigap premium', 'medicare supplement', 'medigap cost'],
  [
    '{ name: "age", label: "Age", type: "number", min: 65, max: 100, defaultValue: 67 }',
    '{ name: "plan", label: "Plan Type", type: "select", options: [{ value: "F", label: "Plan F" }, { value: "G", label: "Plan G" }, { value: "N", label: "Plan N" }], defaultValue: "G" }',
    '{ name: "smoker", label: "Smoker", type: "select", options: [{ value: "0", label: "No" }, { value: "1", label: "Yes" }], defaultValue: "0" }',
  ],
  `(inputs) => {
      const age = inputs.age as number;
      const plan = inputs.plan as string;
      const smoker = inputs.smoker as string;
      if (!age) return null;
      const basePremium: Record<string, number> = { F: 220, G: 180, N: 130 };
      const base = basePremium[plan] || 180;
      const ageFactor = 1 + (age - 65) * 0.02;
      const smokerFactor = smoker === "1" ? 1.25 : 1;
      const monthly = base * ageFactor * smokerFactor;
      const annual = monthly * 12;
      return {
        primary: { label: "Estimated Monthly Premium", value: "$" + formatNumber(Math.round(monthly)) },
        details: [
          { label: "Plan", value: "Plan " + plan },
          { label: "Age Factor", value: formatNumber(Math.round(ageFactor * 100) / 100) },
          { label: "Annual Premium", value: "$" + formatNumber(Math.round(annual)) },
        ],
      };
  }`,
  [{ q: 'What is the most popular Medigap plan?', a: 'Plan G is currently the most popular Medigap plan.' },
   { q: 'When can I enroll in Medigap?', a: 'Open enrollment starts when you turn 65 and enroll in Part B.' }],
  'Premium = Base x Age Factor x Smoker Factor',
  ['retirement-home-cost-calculator', 'elder-care-cost-calculator']
);

add('elder-care-cost-calculator', 'Elder Care Cost Calculator',
  'Estimate in-home elder care costs per month.',
  'Finance', 'finance', '$',
  ['elder care cost', 'home care cost', 'caregiver cost'],
  [
    '{ name: "hoursPerDay", label: "Hours per Day", type: "number", min: 1, max: 24, defaultValue: 8 }',
    '{ name: "daysPerWeek", label: "Days per Week", type: "number", min: 1, max: 7, defaultValue: 5 }',
    '{ name: "hourlyRate", label: "Hourly Rate ($)", type: "number", min: 10, max: 60, defaultValue: 25 }',
  ],
  `(inputs) => {
      const hours = inputs.hoursPerDay as number;
      const days = inputs.daysPerWeek as number;
      const rate = inputs.hourlyRate as number;
      if (!hours || !days || !rate) return null;
      const weekly = hours * days * rate;
      const monthly = weekly * 4.33;
      const annual = monthly * 12;
      return {
        primary: { label: "Monthly Cost", value: "$" + formatNumber(Math.round(monthly)) },
        details: [
          { label: "Weekly Cost", value: "$" + formatNumber(Math.round(weekly)) },
          { label: "Daily Cost", value: "$" + formatNumber(Math.round(hours * rate)) },
          { label: "Annual Cost", value: "$" + formatNumber(Math.round(annual)) },
        ],
      };
  }`,
  [{ q: 'How much does in-home care cost?', a: 'In-home care averages $20 to $30 per hour in most states.' },
   { q: 'Does insurance cover home care?', a: 'Long-term care insurance may cover in-home care services.' }],
  'Monthly = Hours x Days x Rate x 4.33',
  ['retirement-home-cost-calculator', 'medicare-supplement-calculator']
);

add('wheelchair-ramp-calculator', 'Wheelchair Ramp Calculator',
  'Calculate ramp length needed for a given height.',
  'Everyday', 'everyday', '~',
  ['wheelchair ramp', 'ramp length', 'ADA ramp'],
  [
    '{ name: "height", label: "Rise Height (in)", type: "number", min: 1, max: 60, defaultValue: 24 }',
    '{ name: "ratio", label: "Slope Ratio (1:X)", type: "number", min: 8, max: 20, defaultValue: 12 }',
    '{ name: "width", label: "Ramp Width (in)", type: "number", min: 36, max: 60, defaultValue: 36 }',
  ],
  `(inputs) => {
      const height = inputs.height as number;
      const ratio = inputs.ratio as number;
      const width = inputs.width as number;
      if (!height || !ratio) return null;
      const lengthIn = height * ratio;
      const lengthFt = lengthIn / 12;
      const landings = Math.floor(lengthFt / 30);
      return {
        primary: { label: "Ramp Length", value: formatNumber(Math.round(lengthFt * 10) / 10) + " ft" },
        details: [
          { label: "Rise", value: formatNumber(height) + " in" },
          { label: "Slope Ratio", value: "1:" + formatNumber(ratio) },
          { label: "Landings Needed", value: formatNumber(landings) },
        ],
      };
  }`,
  [{ q: 'What is the ADA ramp slope requirement?', a: 'ADA requires a maximum slope ratio of 1:12.' },
   { q: 'How wide should a wheelchair ramp be?', a: 'ADA requires a minimum ramp width of 36 inches.' }],
  'Length = Rise Height x Slope Ratio',
  ['grab-bar-placement-calculator', 'fall-risk-calculator']
);

add('grab-bar-placement-calculator', 'Grab Bar Placement Calculator',
  'Determine grab bar height and position for bathrooms.',
  'Everyday', 'everyday', '~',
  ['grab bar height', 'grab bar placement', 'bathroom safety'],
  [
    '{ name: "userHeight", label: "User Height (in)", type: "number", min: 48, max: 84, defaultValue: 66 }',
    '{ name: "location", label: "Location", type: "select", options: [{ value: "shower", label: "Shower" }, { value: "toilet", label: "Toilet" }, { value: "tub", label: "Bathtub" }], defaultValue: "shower" }',
    '{ name: "barLength", label: "Bar Length (in)", type: "select", options: [{ value: "12", label: "12 inch" }, { value: "18", label: "18 inch" }, { value: "24", label: "24 inch" }, { value: "36", label: "36 inch" }], defaultValue: "18" }',
  ],
  `(inputs) => {
      const height = inputs.userHeight as number;
      const location = inputs.location as string;
      const barLen = parseInt(inputs.barLength as string);
      if (!height) return null;
      const heightMap: Record<string, number> = { shower: 36, toilet: 33, tub: 34 };
      const baseHeight = heightMap[location] || 34;
      const adjusted = Math.round(baseHeight * (height / 66));
      return {
        primary: { label: "Recommended Height", value: formatNumber(adjusted) + " in" },
        details: [
          { label: "Location", value: location },
          { label: "Bar Length", value: formatNumber(barLen) + " in" },
          { label: "ADA Standard", value: formatNumber(baseHeight) + " in" },
        ],
      };
  }`,
  [{ q: 'How high should a grab bar be in a shower?', a: 'Shower grab bars are typically placed at 33 to 36 inches.' },
   { q: 'What size grab bar do I need?', a: 'An 18-inch bar works for most bathroom applications.' }],
  'Height = Base Height x (User Height / 66)',
  ['wheelchair-ramp-calculator', 'fall-risk-calculator']
);

add('medication-schedule-calculator', 'Medication Schedule Calculator',
  'Calculate daily medication timing intervals.',
  'Health', 'health', 'H',
  ['medication schedule', 'pill timing', 'medication interval'],
  [
    '{ name: "medications", label: "Number of Medications", type: "number", min: 1, max: 20, defaultValue: 3 }',
    '{ name: "wakeHour", label: "Wake Time (hour 0-23)", type: "number", min: 0, max: 23, defaultValue: 7 }',
    '{ name: "sleepHour", label: "Sleep Time (hour 0-23)", type: "number", min: 0, max: 23, defaultValue: 22 }',
  ],
  `(inputs) => {
      const meds = inputs.medications as number;
      const wake = inputs.wakeHour as number;
      const sleep = inputs.sleepHour as number;
      if (!meds) return null;
      const awakeHours = sleep > wake ? sleep - wake : 24 - wake + sleep;
      const interval = awakeHours / meds;
      const times = [];
      for (let i = 0; i < Math.min(meds, 5); i++) {
        const hr = (wake + Math.round(interval * i)) % 24;
        times.push(hr + ":00");
      }
      return {
        primary: { label: "Interval", value: formatNumber(Math.round(interval * 10) / 10) + " hours" },
        details: [
          { label: "Awake Hours", value: formatNumber(awakeHours) },
          { label: "Medications", value: formatNumber(meds) },
          { label: "First Doses", value: times.join(", ") },
        ],
      };
  }`,
  [{ q: 'How do I space medications evenly?', a: 'Divide your awake hours by the number of medications.' },
   { q: 'Should I take meds with food?', a: 'Check each medication label for food requirements.' }],
  'Interval = Awake Hours / Number of Medications',
  ['fall-risk-calculator', 'elder-care-cost-calculator']
);

add('fall-risk-calculator', 'Fall Risk Calculator',
  'Assess fall risk score for senior individuals.',
  'Health', 'health', 'H',
  ['fall risk', 'senior fall', 'fall assessment'],
  [
    '{ name: "age", label: "Age", type: "number", min: 60, max: 110, defaultValue: 75 }',
    '{ name: "fallHistory", label: "Falls in Past Year", type: "number", min: 0, max: 20, defaultValue: 0 }',
    '{ name: "medications", label: "Number of Medications", type: "number", min: 0, max: 20, defaultValue: 4 }',
    '{ name: "mobilityAid", label: "Uses Mobility Aid", type: "select", options: [{ value: "0", label: "No" }, { value: "1", label: "Yes" }], defaultValue: "0" }',
  ],
  `(inputs) => {
      const age = inputs.age as number;
      const falls = inputs.fallHistory as number;
      const meds = inputs.medications as number;
      const aid = inputs.mobilityAid as string;
      if (!age) return null;
      let score = 0;
      if (age >= 80) score += 3; else if (age >= 70) score += 2; else score += 1;
      score += Math.min(falls * 2, 6);
      if (meds >= 4) score += 2; else if (meds >= 2) score += 1;
      if (aid === "1") score += 2;
      const risk = score >= 7 ? "High" : score >= 4 ? "Moderate" : "Low";
      return {
        primary: { label: "Fall Risk", value: risk },
        details: [
          { label: "Risk Score", value: formatNumber(score) + " / 13" },
          { label: "Age Factor", value: age >= 80 ? "High" : "Moderate" },
          { label: "Medication Factor", value: meds >= 4 ? "High" : "Low" },
        ],
      };
  }`,
  [{ q: 'What increases fall risk in seniors?', a: 'Medications, poor balance, and home hazards increase risk.' },
   { q: 'How can seniors reduce fall risk?', a: 'Exercise, home modifications, and medication review help.' }],
  'Score = Age Factor + Fall History + Medication Factor + Mobility Aid',
  ['wheelchair-ramp-calculator', 'grab-bar-placement-calculator']
);

add('hearing-aid-cost-calculator', 'Hearing Aid Cost Calculator',
  'Estimate total hearing aid purchase and fitting cost.',
  'Finance', 'finance', '$',
  ['hearing aid cost', 'hearing aid price', 'hearing device'],
  [
    '{ name: "type", label: "Type", type: "select", options: [{ value: "basic", label: "Basic" }, { value: "mid", label: "Mid-Range" }, { value: "premium", label: "Premium" }], defaultValue: "mid" }',
    '{ name: "quantity", label: "Ears (1 or 2)", type: "select", options: [{ value: "1", label: "One Ear" }, { value: "2", label: "Both Ears" }], defaultValue: "2" }',
    '{ name: "fitting", label: "Fitting Fee ($)", type: "number", min: 0, max: 500, defaultValue: 200 }',
  ],
  `(inputs) => {
      const type = inputs.type as string;
      const qty = parseInt(inputs.quantity as string);
      const fitting = inputs.fitting as number;
      const priceMap: Record<string, number> = { basic: 1000, mid: 2500, premium: 4500 };
      const unitPrice = priceMap[type] || 2500;
      const deviceCost = unitPrice * qty;
      const total = deviceCost + fitting;
      return {
        primary: { label: "Total Cost", value: "$" + formatNumber(total) },
        details: [
          { label: "Device Cost", value: "$" + formatNumber(deviceCost) },
          { label: "Fitting Fee", value: "$" + formatNumber(fitting) },
          { label: "Per Unit", value: "$" + formatNumber(unitPrice) },
        ],
      };
  }`,
  [{ q: 'How much do hearing aids cost?', a: 'Hearing aids range from $1,000 to $4,500 per ear.' },
   { q: 'Does insurance cover hearing aids?', a: 'Some insurance plans cover part of hearing aid costs.' }],
  'Total = Unit Price x Quantity + Fitting Fee',
  ['vision-correction-cost-calculator', 'dental-implant-cost-calculator']
);

add('vision-correction-cost-calculator', 'Vision Correction Cost Calculator',
  'Compare costs of LASIK vs contacts vs glasses.',
  'Finance', 'finance', '$',
  ['vision correction cost', 'lasik cost', 'glasses vs contacts'],
  [
    '{ name: "lasikCost", label: "LASIK Cost (both eyes) ($)", type: "number", min: 1000, max: 10000, defaultValue: 4000 }',
    '{ name: "glassesCost", label: "Glasses Cost per Year ($)", type: "number", min: 50, max: 1000, defaultValue: 300 }',
    '{ name: "contactsCost", label: "Contacts Cost per Year ($)", type: "number", min: 100, max: 2000, defaultValue: 500 }',
    '{ name: "years", label: "Years to Compare", type: "number", min: 1, max: 30, defaultValue: 10 }',
  ],
  `(inputs) => {
      const lasik = inputs.lasikCost as number;
      const glasses = inputs.glassesCost as number;
      const contacts = inputs.contactsCost as number;
      const years = inputs.years as number;
      if (!years) return null;
      const glassesTotal = glasses * years;
      const contactsTotal = contacts * years;
      const cheapest = Math.min(lasik, glassesTotal, contactsTotal);
      const best = cheapest === lasik ? "LASIK" : cheapest === glassesTotal ? "Glasses" : "Contacts";
      return {
        primary: { label: "Best Value (" + years + " yr)", value: best },
        details: [
          { label: "LASIK Total", value: "$" + formatNumber(lasik) },
          { label: "Glasses Total", value: "$" + formatNumber(glassesTotal) },
          { label: "Contacts Total", value: "$" + formatNumber(contactsTotal) },
        ],
      };
  }`,
  [{ q: 'Is LASIK worth the cost?', a: 'LASIK often pays for itself within 5 to 8 years vs contacts.' },
   { q: 'How much do contacts cost per year?', a: 'Annual contact lens costs average $200 to $600.' }],
  'Compare: LASIK one-time vs Glasses x Years vs Contacts x Years',
  ['hearing-aid-cost-calculator', 'dental-implant-cost-calculator']
);

add('dental-implant-cost-calculator', 'Dental Implant Cost Calculator',
  'Estimate total dental implant procedure cost.',
  'Finance', 'finance', '$',
  ['dental implant cost', 'implant price', 'tooth implant'],
  [
    '{ name: "implants", label: "Number of Implants", type: "number", min: 1, max: 16, defaultValue: 1 }',
    '{ name: "costPerImplant", label: "Cost per Implant ($)", type: "number", min: 1000, max: 8000, defaultValue: 3500 }',
    '{ name: "crownCost", label: "Crown Cost ($)", type: "number", min: 500, max: 3000, defaultValue: 1500 }',
    '{ name: "boneGraft", label: "Bone Graft Needed", type: "select", options: [{ value: "0", label: "No" }, { value: "1", label: "Yes" }], defaultValue: "0" }',
  ],
  `(inputs) => {
      const count = inputs.implants as number;
      const implantCost = inputs.costPerImplant as number;
      const crown = inputs.crownCost as number;
      const graft = inputs.boneGraft as string;
      if (!count || !implantCost) return null;
      const graftCost = graft === "1" ? 800 * count : 0;
      const total = count * (implantCost + crown) + graftCost;
      return {
        primary: { label: "Total Cost", value: "$" + formatNumber(total) },
        details: [
          { label: "Implant Cost", value: "$" + formatNumber(count * implantCost) },
          { label: "Crown Cost", value: "$" + formatNumber(count * crown) },
          { label: "Bone Graft", value: "$" + formatNumber(graftCost) },
        ],
      };
  }`,
  [{ q: 'How much does one dental implant cost?', a: 'A single dental implant costs $3,000 to $5,000 total.' },
   { q: 'Does insurance cover dental implants?', a: 'Many dental plans cover a portion of implant costs.' }],
  'Total = Implants x (Implant Cost + Crown) + Bone Graft',
  ['hearing-aid-cost-calculator', 'vision-correction-cost-calculator']
);

add('arduino-power-calculator', 'Arduino Power Calculator',
  'Calculate power needs for an Arduino project.',
  'Science', 'science', 'A',
  ['arduino power', 'arduino current', 'arduino supply'],
  [
    '{ name: "boardCurrent", label: "Board Current (mA)", type: "number", min: 10, max: 500, defaultValue: 50 }',
    '{ name: "sensorCount", label: "Number of Sensors", type: "number", min: 0, max: 20, defaultValue: 3 }',
    '{ name: "sensorCurrent", label: "Current per Sensor (mA)", type: "number", min: 1, max: 100, defaultValue: 20 }',
    '{ name: "voltage", label: "Supply Voltage (V)", type: "number", min: 3, max: 12, defaultValue: 5 }',
  ],
  `(inputs) => {
      const board = inputs.boardCurrent as number;
      const sensors = inputs.sensorCount as number;
      const sensorMa = inputs.sensorCurrent as number;
      const voltage = inputs.voltage as number;
      if (!voltage) return null;
      const totalMa = board + sensors * sensorMa;
      const watts = totalMa * voltage / 1000;
      const margin = totalMa * 1.25;
      return {
        primary: { label: "Total Current", value: formatNumber(Math.round(totalMa)) + " mA" },
        details: [
          { label: "Power", value: formatNumber(Math.round(watts * 100) / 100) + " W" },
          { label: "With 25% Margin", value: formatNumber(Math.round(margin)) + " mA" },
          { label: "Supply Voltage", value: formatNumber(voltage) + " V" },
        ],
      };
  }`,
  [{ q: 'How much current does an Arduino Uno use?', a: 'An Arduino Uno draws about 40 to 50 mA at 5V.' },
   { q: 'Can I power Arduino from USB?', a: 'USB provides 500 mA at 5V, enough for most projects.' }],
  'Total mA = Board Current + (Sensors x Current per Sensor)',
  ['raspberry-pi-power-calculator', 'relay-sizing-calculator']
);

add('raspberry-pi-power-calculator', 'Raspberry Pi Power Calculator',
  'Size the power supply for a Raspberry Pi project.',
  'Science', 'science', 'A',
  ['raspberry pi power', 'pi supply', 'pi current'],
  [
    '{ name: "model", label: "Pi Model", type: "select", options: [{ value: "3", label: "Pi 3" }, { value: "4", label: "Pi 4" }, { value: "5", label: "Pi 5" }, { value: "zero", label: "Pi Zero" }], defaultValue: "4" }',
    '{ name: "peripherals", label: "USB Peripherals (mA)", type: "number", min: 0, max: 2000, defaultValue: 200 }',
    '{ name: "hat", label: "HAT/Add-on (mA)", type: "number", min: 0, max: 1000, defaultValue: 100 }',
  ],
  `(inputs) => {
      const model = inputs.model as string;
      const periph = inputs.peripherals as number;
      const hat = inputs.hat as number;
      const baseMa: Record<string, number> = { "3": 700, "4": 900, "5": 1200, zero: 200 };
      const base = baseMa[model] || 900;
      const totalMa = base + periph + hat;
      const voltage = model === "5" ? 5 : 5;
      const watts = totalMa * voltage / 1000;
      const recommended = Math.ceil(watts * 1.3);
      return {
        primary: { label: "Total Current", value: formatNumber(totalMa) + " mA" },
        details: [
          { label: "Base Draw", value: formatNumber(base) + " mA" },
          { label: "Power", value: formatNumber(Math.round(watts * 10) / 10) + " W" },
          { label: "Recommended Supply", value: formatNumber(recommended) + " W" },
        ],
      };
  }`,
  [{ q: 'What power supply does Pi 4 need?', a: 'The Raspberry Pi 4 needs a 5V 3A USB-C power supply.' },
   { q: 'Can I power a Pi from a battery?', a: 'Yes, use a 5V power bank with sufficient current output.' }],
  'Total mA = Base Draw + Peripherals + HAT',
  ['arduino-power-calculator', 'servo-motor-calculator']
);

add('servo-motor-calculator', 'Servo Motor Calculator',
  'Calculate servo torque needed for a given load.',
  'Science', 'science', 'A',
  ['servo torque', 'servo motor', 'servo sizing'],
  [
    '{ name: "load", label: "Load Weight (g)", type: "number", min: 1, max: 10000, defaultValue: 200 }',
    '{ name: "armLength", label: "Arm Length (cm)", type: "number", min: 1, max: 50, defaultValue: 5 }',
    '{ name: "safetyFactor", label: "Safety Factor", type: "number", min: 1, max: 5, defaultValue: 2 }',
  ],
  `(inputs) => {
      const load = inputs.load as number;
      const arm = inputs.armLength as number;
      const sf = inputs.safetyFactor as number;
      if (!load || !arm || !sf) return null;
      const torqueGcm = load * arm;
      const torqueKgcm = torqueGcm / 1000;
      const recommended = torqueKgcm * sf;
      return {
        primary: { label: "Required Torque", value: formatNumber(Math.round(recommended * 100) / 100) + " kg-cm" },
        details: [
          { label: "Raw Torque", value: formatNumber(Math.round(torqueKgcm * 100) / 100) + " kg-cm" },
          { label: "Safety Factor", value: formatNumber(sf) + "x" },
          { label: "Torque (g-cm)", value: formatNumber(torqueGcm) },
        ],
      };
  }`,
  [{ q: 'How do I calculate servo torque?', a: 'Torque = Load Weight x Arm Length, then apply a safety factor.' },
   { q: 'What is a good safety factor for servos?', a: 'Use a safety factor of 2x for most hobby projects.' }],
  'Torque = Load x Arm Length x Safety Factor / 1000',
  ['arduino-power-calculator', 'relay-sizing-calculator']
);

add('relay-sizing-calculator', 'Relay Sizing Calculator',
  'Determine relay contact rating for a given load.',
  'Science', 'science', 'A',
  ['relay sizing', 'relay rating', 'relay current'],
  [
    '{ name: "loadWatts", label: "Load Power (W)", type: "number", min: 1, max: 5000, defaultValue: 100 }',
    '{ name: "voltage", label: "Supply Voltage (V)", type: "number", min: 5, max: 480, defaultValue: 120 }',
    '{ name: "loadType", label: "Load Type", type: "select", options: [{ value: "resistive", label: "Resistive" }, { value: "inductive", label: "Inductive" }, { value: "motor", label: "Motor" }], defaultValue: "resistive" }',
  ],
  `(inputs) => {
      const watts = inputs.loadWatts as number;
      const voltage = inputs.voltage as number;
      const loadType = inputs.loadType as string;
      if (!watts || !voltage) return null;
      const amps = watts / voltage;
      const derating: Record<string, number> = { resistive: 1, inductive: 0.75, motor: 0.5 };
      const factor = derating[loadType] || 1;
      const relayRating = amps / factor;
      return {
        primary: { label: "Relay Rating Needed", value: formatNumber(Math.round(relayRating * 10) / 10) + " A" },
        details: [
          { label: "Load Current", value: formatNumber(Math.round(amps * 100) / 100) + " A" },
          { label: "Derating Factor", value: formatNumber(factor) },
          { label: "Load Type", value: loadType },
        ],
      };
  }`,
  [{ q: 'How do I size a relay for a motor?', a: 'Derate the relay to 50 percent of its rating for motor loads.' },
   { q: 'What is relay derating?', a: 'Derating reduces the max rating for inductive or motor loads.' }],
  'Relay Rating = (Load Watts / Voltage) / Derating Factor',
  ['arduino-power-calculator', 'transformer-sizing-calculator']
);

add('transformer-sizing-calculator', 'Transformer Sizing Calculator',
  'Calculate transformer VA rating for your load.',
  'Science', 'science', 'A',
  ['transformer VA', 'transformer sizing', 'transformer rating'],
  [
    '{ name: "loadWatts", label: "Total Load (W)", type: "number", min: 1, max: 50000, defaultValue: 500 }',
    '{ name: "powerFactor", label: "Power Factor", type: "number", min: 0, max: 1, defaultValue: 0 }',
    '{ name: "safetyMargin", label: "Safety Margin (%)", type: "number", min: 0, max: 100, defaultValue: 25 }',
  ],
  `(inputs) => {
      const watts = inputs.loadWatts as number;
      const pf = inputs.powerFactor as number;
      const margin = inputs.safetyMargin as number;
      if (!watts) return null;
      const effectivePf = pf > 0 ? pf : 0.8;
      const va = watts / effectivePf;
      const withMargin = va * (1 + margin / 100);
      const standardSizes = [75, 150, 300, 500, 750, 1000, 1500, 2000, 3000, 5000, 7500, 10000];
      const recommended = standardSizes.find(s => s >= withMargin) || Math.ceil(withMargin / 1000) * 1000;
      return {
        primary: { label: "Recommended VA", value: formatNumber(recommended) + " VA" },
        details: [
          { label: "Calculated VA", value: formatNumber(Math.round(va)) },
          { label: "With Margin", value: formatNumber(Math.round(withMargin)) + " VA" },
          { label: "Power Factor", value: formatNumber(effectivePf) },
        ],
      };
  }`,
  [{ q: 'How do I size a transformer?', a: 'Divide total watts by power factor and add a 25 percent margin.' },
   { q: 'What is a good power factor?', a: 'Most mixed loads have a power factor of 0.8 to 0.9.' }],
  'VA = Load Watts / Power Factor x (1 + Margin / 100)',
  ['relay-sizing-calculator', 'arduino-power-calculator']
);
add('board-foot-calculator', 'Board Foot Calculator',
  'Calculate board feet from lumber thickness, width, and length.',
  'Everyday', 'everyday', '~',
  ['board foot', 'lumber calculator', 'board feet'],
  [
    '{ name: "thickness", label: "Thickness (inches)", type: "number", min: 0.25, max: 12, defaultValue: 1 }',
    '{ name: "width", label: "Width (inches)", type: "number", min: 1, max: 24, defaultValue: 6 }',
    '{ name: "length", label: "Length (feet)", type: "number", min: 1, max: 20, defaultValue: 8 }',
    '{ name: "qty", label: "Number of Boards", type: "number", min: 1, max: 500, defaultValue: 1 }',
  ],
  `(inputs) => {
      const t = inputs.thickness as number;
      const w = inputs.width as number;
      const l = inputs.length as number;
      const q = inputs.qty as number;
      if (!t || !w || !l || !q) return null;
      const bf = (t * w * l) / 12;
      const total = Math.round(bf * q * 100) / 100;
      return {
        primary: { label: "Total Board Feet", value: formatNumber(total) + " BF" },
        details: [
          { label: "Board Feet Per Piece", value: formatNumber(Math.round(bf * 100) / 100) + " BF" },
          { label: "Number of Boards", value: formatNumber(q) },
        ],
      };
  }`,
  [{ q: 'What is a board foot?', a: 'A board foot is a volume unit equal to 1 inch thick by 12 inches wide by 12 inches long.' },
   { q: 'How do I price lumber?', a: 'Multiply the total board feet by the price per board foot for your species.' }],
  'Board Feet = (Thickness x Width x Length) / 12',
  []
);

add('plywood-sheet-calculator', 'Plywood Sheet Calculator',
  'Determine how many plywood sheets you need for a project.',
  'Everyday', 'everyday', '~',
  ['plywood calculator', 'sheet goods calculator'],
  [
    '{ name: "areaLength", label: "Project Length (ft)", type: "number", min: 1, max: 200, defaultValue: 12 }',
    '{ name: "areaWidth", label: "Project Width (ft)", type: "number", min: 1, max: 200, defaultValue: 10 }',
    '{ name: "sheetL", label: "Sheet Length (ft)", type: "number", min: 1, max: 10, defaultValue: 8 }',
    '{ name: "sheetW", label: "Sheet Width (ft)", type: "number", min: 1, max: 10, defaultValue: 4 }',
    '{ name: "waste", label: "Waste Factor (%)", type: "number", min: 0, max: 50, defaultValue: 10 }',
  ],
  `(inputs) => {
      const al = inputs.areaLength as number;
      const aw = inputs.areaWidth as number;
      const sl = inputs.sheetL as number;
      const sw = inputs.sheetW as number;
      const wf = inputs.waste as number;
      if (!al || !aw || !sl || !sw) return null;
      const totalArea = al * aw;
      const sheetArea = sl * sw;
      const sheetsRaw = totalArea / sheetArea;
      const sheets = Math.ceil(sheetsRaw * (1 + wf / 100));
      return {
        primary: { label: "Sheets Needed", value: formatNumber(sheets) },
        details: [
          { label: "Total Area", value: formatNumber(totalArea) + " sq ft" },
          { label: "Area Per Sheet", value: formatNumber(sheetArea) + " sq ft" },
          { label: "Waste Included", value: wf + "%" },
        ],
      };
  }`,
  [{ q: 'What is the standard plywood sheet size?', a: 'The standard size is 4 feet by 8 feet, which equals 32 square feet.' },
   { q: 'How much waste should I plan for?', a: 'Plan for 10 to 15 percent waste for most rectangular projects.' }],
  'Sheets = ceil((Area / Sheet Area) x (1 + Waste%))',
  []
);

add('wood-shrinkage-calculator', 'Wood Shrinkage Calculator',
  'Estimate dimensional change in wood from moisture shifts.',
  'Science', 'science', 'A',
  ['wood shrinkage', 'moisture content calculator'],
  [
    '{ name: "dimension", label: "Current Dimension (inches)", type: "number", min: 0.1, max: 48, defaultValue: 6 }',
    '{ name: "mcStart", label: "Starting Moisture Content (%)", type: "number", min: 0, max: 30, defaultValue: 12 }',
    '{ name: "mcEnd", label: "Final Moisture Content (%)", type: "number", min: 0, max: 30, defaultValue: 7 }',
    '{ name: "coeff", label: "Shrinkage Coefficient (%)", type: "number", min: 0.1, max: 0.5, defaultValue: 0.25 }',
  ],
  `(inputs) => {
      const dim = inputs.dimension as number;
      const mcS = inputs.mcStart as number;
      const mcE = inputs.mcEnd as number;
      const co = inputs.coeff as number;
      if (!dim || mcS === undefined || mcE === undefined || !co) return null;
      const change = dim * (mcS - mcE) * (co / 100);
      const finalDim = Math.round((dim - change) * 1000) / 1000;
      const changePct = Math.round(((change / dim) * 100) * 100) / 100;
      return {
        primary: { label: "Final Dimension", value: formatNumber(finalDim) + " in" },
        details: [
          { label: "Dimensional Change", value: formatNumber(Math.round(Math.abs(change) * 1000) / 1000) + " in" },
          { label: "Percentage Change", value: formatNumber(changePct) + "%" },
          { label: "Direction", value: change > 0 ? "Shrinkage" : "Expansion" },
        ],
      };
  }`,
  [{ q: 'What causes wood to shrink?', a: 'Wood shrinks as it loses moisture below the fiber saturation point of about 28%.' },
   { q: 'Which direction shrinks more?', a: 'Tangential shrinkage is roughly twice the radial shrinkage.' }],
  'Change = Dimension x (MC Start - MC End) x Coefficient',
  []
);

add('wood-stain-coverage-calculator', 'Wood Stain Coverage Calculator',
  'Calculate the amount of stain needed for a wood surface.',
  'Everyday', 'everyday', '~',
  ['wood stain calculator', 'stain coverage'],
  [
    '{ name: "area", label: "Surface Area (sq ft)", type: "number", min: 1, max: 5000, defaultValue: 200 }',
    '{ name: "coverage", label: "Stain Coverage (sq ft/gal)", type: "number", min: 50, max: 600, defaultValue: 250 }',
    '{ name: "coats", label: "Number of Coats", type: "number", min: 1, max: 5, defaultValue: 2 }',
  ],
  `(inputs) => {
      const area = inputs.area as number;
      const cov = inputs.coverage as number;
      const coats = inputs.coats as number;
      if (!area || !cov || !coats) return null;
      const gallons = Math.round((area * coats / cov) * 100) / 100;
      const quarts = Math.ceil(gallons * 4);
      return {
        primary: { label: "Stain Needed", value: formatNumber(gallons) + " gal" },
        details: [
          { label: "Quarts Needed", value: formatNumber(quarts) },
          { label: "Total Coverage Area", value: formatNumber(area * coats) + " sq ft" },
          { label: "Coats", value: formatNumber(coats) },
        ],
      };
  }`,
  [{ q: 'How much area does a gallon of stain cover?', a: 'Most wood stains cover 200 to 300 square feet per gallon on smooth wood.' },
   { q: 'Do I need multiple coats of stain?', a: 'Two coats provide richer color and more consistent results.' }],
  'Gallons = (Area x Coats) / Coverage Per Gallon',
  []
);

add('dowel-joint-calculator', 'Dowel Joint Calculator',
  'Find the right dowel size and spacing for wood joints.',
  'Everyday', 'everyday', '~',
  ['dowel joint', 'dowel spacing calculator'],
  [
    '{ name: "boardThick", label: "Board Thickness (inches)", type: "number", min: 0.25, max: 4, defaultValue: 0.75 }',
    '{ name: "jointLength", label: "Joint Length (inches)", type: "number", min: 1, max: 96, defaultValue: 24 }',
    '{ name: "spacing", label: "Dowel Spacing (inches)", type: "number", min: 1, max: 12, defaultValue: 6 }',
  ],
  `(inputs) => {
      const thick = inputs.boardThick as number;
      const jl = inputs.jointLength as number;
      const sp = inputs.spacing as number;
      if (!thick || !jl || !sp) return null;
      const dowelDia = Math.round((thick / 2) * 8) / 8;
      const dowelDepth = Math.round(dowelDia * 3 * 100) / 100;
      const numDowels = Math.floor(jl / sp) + 1;
      return {
        primary: { label: "Recommended Dowel Diameter", value: formatNumber(dowelDia) + " in" },
        details: [
          { label: "Dowel Depth Per Side", value: formatNumber(dowelDepth) + " in" },
          { label: "Number of Dowels", value: formatNumber(numDowels) },
          { label: "Actual Spacing", value: formatNumber(Math.round((jl / (numDowels - 1)) * 100) / 100) + " in" },
        ],
      };
  }`,
  [{ q: 'How do I choose dowel size?', a: 'Use a dowel diameter that is about half the board thickness.' },
   { q: 'How deep should dowel holes be?', a: 'Drill holes about 3 times the dowel diameter deep on each side.' }],
  'Dowel Diameter = Board Thickness / 2; Count = floor(Length / Spacing) + 1',
  []
);

add('miter-angle-calculator', 'Miter Angle Calculator',
  'Calculate miter saw angle for multi-sided corners.',
  'Math', 'math', '+',
  ['miter angle', 'miter saw calculator', 'corner angle'],
  [
    '{ name: "sides", label: "Number of Sides", type: "number", min: 3, max: 36, defaultValue: 4 }',
    '{ name: "cornerAngle", label: "Corner Angle Override (degrees)", type: "number", min: 0, max: 360, defaultValue: 0 }',
  ],
  `(inputs) => {
      const sides = inputs.sides as number;
      const override = inputs.cornerAngle as number;
      if (!sides) return null;
      const interiorAngle = override > 0 ? override : ((sides - 2) * 180) / sides;
      const miterAngle = Math.round((interiorAngle / 2) * 1000) / 1000;
      const sawSetting = Math.round((90 - miterAngle) * 1000) / 1000;
      return {
        primary: { label: "Miter Saw Setting", value: formatNumber(sawSetting) + " degrees" },
        details: [
          { label: "Interior Angle", value: formatNumber(interiorAngle) + " degrees" },
          { label: "Miter Angle", value: formatNumber(miterAngle) + " degrees" },
          { label: "Number of Sides", value: formatNumber(sides) },
        ],
      };
  }`,
  [{ q: 'What miter angle do I need for a square corner?', a: 'Set the miter saw to 45 degrees for a standard 90 degree corner.' },
   { q: 'How do I calculate a miter for an octagon?', a: 'An octagon has 135 degree interior angles so the saw setting is 22.5 degrees.' }],
  'Saw Setting = 90 - (Interior Angle / 2)',
  []
);

add('wood-screw-pilot-hole-calculator', 'Wood Screw Pilot Hole Calculator',
  'Determine the correct pilot hole diameter for wood screws.',
  'Everyday', 'everyday', '~',
  ['pilot hole', 'wood screw calculator'],
  [
    '{ name: "screwGauge", label: "Screw Gauge Number", type: "number", min: 2, max: 14, defaultValue: 8 }',
    '{ name: "woodType", label: "Wood Type", type: "select", options: [{ value: "soft", label: "Softwood" }, { value: "hard", label: "Hardwood" }], defaultValue: "soft" }',
  ],
  `(inputs) => {
      const gauge = inputs.screwGauge as number;
      const wood = inputs.woodType as string;
      if (!gauge) return null;
      const majorDia = 0.06 + gauge * 0.013;
      const softPilot = Math.round(majorDia * 0.65 * 1000) / 1000;
      const hardPilot = Math.round(majorDia * 0.85 * 1000) / 1000;
      const pilot = wood === "hard" ? hardPilot : softPilot;
      const pilot64 = Math.round(pilot * 64);
      return {
        primary: { label: "Pilot Hole Diameter", value: formatNumber(pilot) + " in (" + pilot64 + "/64)" },
        details: [
          { label: "Screw Major Diameter", value: formatNumber(Math.round(majorDia * 1000) / 1000) + " in" },
          { label: "Wood Type", value: wood === "hard" ? "Hardwood" : "Softwood" },
          { label: "Ratio Used", value: wood === "hard" ? "85%" : "65%" },
        ],
      };
  }`,
  [{ q: 'Do I always need a pilot hole?', a: 'Hardwoods always need pilot holes. Softwoods benefit from them to prevent splitting.' },
   { q: 'What happens without a pilot hole?', a: 'The wood can split, especially near edges, and the screw may not seat properly.' }],
  'Pilot = Major Diameter x Factor (65% softwood, 85% hardwood)',
  []
);

add('weld-filler-metal-calculator', 'Weld Filler Metal Calculator',
  'Estimate filler metal weight for a welding joint.',
  'Science', 'science', 'A',
  ['weld filler metal', 'welding rod calculator'],
  [
    '{ name: "jointLength", label: "Joint Length (inches)", type: "number", min: 1, max: 1000, defaultValue: 24 }',
    '{ name: "crossSection", label: "Weld Cross Section (sq in)", type: "number", min: 0.001, max: 5, defaultValue: 0.1 }',
    '{ name: "density", label: "Metal Density (lb/cu in)", type: "number", min: 0.05, max: 0.5, defaultValue: 0.283 }',
    '{ name: "waste", label: "Waste Factor (%)", type: "number", min: 0, max: 50, defaultValue: 15 }',
  ],
  `(inputs) => {
      const jl = inputs.jointLength as number;
      const cs = inputs.crossSection as number;
      const den = inputs.density as number;
      const wf = inputs.waste as number;
      if (!jl || !cs || !den) return null;
      const volume = jl * cs;
      const weightNet = volume * den;
      const weightTotal = Math.round(weightNet * (1 + wf / 100) * 1000) / 1000;
      return {
        primary: { label: "Filler Metal Needed", value: formatNumber(weightTotal) + " lb" },
        details: [
          { label: "Net Weight", value: formatNumber(Math.round(weightNet * 1000) / 1000) + " lb" },
          { label: "Weld Volume", value: formatNumber(Math.round(volume * 1000) / 1000) + " cu in" },
          { label: "Waste Factor", value: wf + "%" },
        ],
      };
  }`,
  [{ q: 'What density should I use for steel?', a: 'Mild steel has a density of about 0.283 pounds per cubic inch.' },
   { q: 'Why add a waste factor?', a: 'Waste accounts for spatter, stub ends, and grinding losses during welding.' }],
  'Weight = Joint Length x Cross Section x Density x (1 + Waste%)',
  []
);

add('weld-heat-input-calculator', 'Weld Heat Input Calculator',
  'Calculate heat input for arc welding processes.',
  'Science', 'science', 'A',
  ['weld heat input', 'welding energy calculator'],
  [
    '{ name: "voltage", label: "Arc Voltage (V)", type: "number", min: 10, max: 50, defaultValue: 25 }',
    '{ name: "amperage", label: "Welding Current (A)", type: "number", min: 50, max: 500, defaultValue: 200 }',
    '{ name: "travelSpeed", label: "Travel Speed (in/min)", type: "number", min: 1, max: 60, defaultValue: 10 }',
    '{ name: "efficiency", label: "Process Efficiency (%)", type: "number", min: 20, max: 100, defaultValue: 80 }',
  ],
  `(inputs) => {
      const v = inputs.voltage as number;
      const a = inputs.amperage as number;
      const ts = inputs.travelSpeed as number;
      const eff = inputs.efficiency as number;
      if (!v || !a || !ts || !eff) return null;
      const heatRaw = (v * a * 60) / ts;
      const heatNet = Math.round(heatRaw * (eff / 100));
      const kjPerIn = Math.round(heatNet / 1000 * 100) / 100;
      return {
        primary: { label: "Heat Input", value: formatNumber(kjPerIn) + " kJ/in" },
        details: [
          { label: "Gross Heat Input", value: formatNumber(Math.round(heatRaw / 1000 * 100) / 100) + " kJ/in" },
          { label: "Arc Power", value: formatNumber(v * a) + " W" },
          { label: "Efficiency", value: eff + "%" },
        ],
      };
  }`,
  [{ q: 'Why does heat input matter?', a: 'Heat input affects the weld microstructure, distortion, and residual stress.' },
   { q: 'What is a typical efficiency for MIG welding?', a: 'MIG or GMAW typically has a process efficiency of 80 to 85 percent.' }],
  'Heat Input (kJ/in) = (Voltage x Amps x 60 / Travel Speed) x Efficiency / 1000',
  []
);

add('metal-weight-calculator', 'Metal Weight Calculator',
  'Calculate the weight of a metal piece by shape and alloy.',
  'Science', 'science', 'A',
  ['metal weight', 'steel weight calculator'],
  [
    '{ name: "shape", label: "Shape", type: "select", options: [{ value: "flat", label: "Flat Plate" }, { value: "round", label: "Round Bar" }, { value: "tube", label: "Round Tube" }], defaultValue: "flat" }',
    '{ name: "length", label: "Length (inches)", type: "number", min: 0.1, max: 1000, defaultValue: 24 }',
    '{ name: "dim1", label: "Width or OD (inches)", type: "number", min: 0.01, max: 100, defaultValue: 4 }',
    '{ name: "dim2", label: "Thickness or Wall (inches)", type: "number", min: 0.01, max: 20, defaultValue: 0.25 }',
    '{ name: "density", label: "Density (lb/cu in)", type: "number", min: 0.05, max: 0.5, defaultValue: 0.283 }',
  ],
  `(inputs) => {
      const shape = inputs.shape as string;
      const len = inputs.length as number;
      const d1 = inputs.dim1 as number;
      const d2 = inputs.dim2 as number;
      const den = inputs.density as number;
      if (!len || !d1 || !d2 || !den) return null;
      var vol = 0;
      if (shape === "round") {
        vol = Math.PI * Math.pow(d1 / 2, 2) * len;
      } else if (shape === "tube") {
        var innerR = (d1 / 2) - d2;
        vol = Math.PI * (Math.pow(d1 / 2, 2) - Math.pow(innerR, 2)) * len;
      } else {
        vol = d1 * d2 * len;
      }
      var weight = Math.round(vol * den * 1000) / 1000;
      return {
        primary: { label: "Weight", value: formatNumber(weight) + " lb" },
        details: [
          { label: "Volume", value: formatNumber(Math.round(vol * 1000) / 1000) + " cu in" },
          { label: "Shape", value: shape === "flat" ? "Flat Plate" : shape === "round" ? "Round Bar" : "Round Tube" },
          { label: "Length", value: formatNumber(len) + " in" },
        ],
      };
  }`,
  [{ q: 'What density should I use for aluminum?', a: 'Aluminum alloys have a density of about 0.098 pounds per cubic inch.' },
   { q: 'How do I weigh stainless steel?', a: 'Use a density of 0.289 pounds per cubic inch for 304 stainless steel.' }],
  'Weight = Volume x Density',
  []
);

add('sheet-metal-bend-calculator', 'Sheet Metal Bend Calculator',
  'Calculate bend allowance and deduction for sheet metal.',
  'Science', 'science', 'A',
  ['bend allowance', 'sheet metal calculator'],
  [
    '{ name: "angle", label: "Bend Angle (degrees)", type: "number", min: 1, max: 180, defaultValue: 90 }',
    '{ name: "radius", label: "Inside Bend Radius (inches)", type: "number", min: 0.01, max: 10, defaultValue: 0.125 }',
    '{ name: "thickness", label: "Material Thickness (inches)", type: "number", min: 0.005, max: 2, defaultValue: 0.06 }',
    '{ name: "kFactor", label: "K-Factor", type: "number", min: 0.1, max: 0.5, defaultValue: 0.33 }',
  ],
  `(inputs) => {
      const ang = inputs.angle as number;
      const r = inputs.radius as number;
      const t = inputs.thickness as number;
      const k = inputs.kFactor as number;
      if (!ang || !r || !t || !k) return null;
      const radians = ang * Math.PI / 180;
      const ba = radians * (r + k * t);
      const ossb = (r + t) * Math.tan((ang / 2) * Math.PI / 180);
      const bd = 2 * ossb - ba;
      return {
        primary: { label: "Bend Allowance", value: formatNumber(Math.round(ba * 10000) / 10000) + " in" },
        details: [
          { label: "Bend Deduction", value: formatNumber(Math.round(bd * 10000) / 10000) + " in" },
          { label: "Outside Setback", value: formatNumber(Math.round(ossb * 10000) / 10000) + " in" },
          { label: "K-Factor", value: formatNumber(k) },
        ],
      };
  }`,
  [{ q: 'What is the K-factor?', a: 'The K-factor is the ratio of the neutral axis location to the material thickness.' },
   { q: 'What K-factor should I use for mild steel?', a: 'Use 0.33 for air bending and 0.42 for bottom bending mild steel.' }],
  'BA = (PI/180) x Angle x (Radius + K x Thickness)',
  []
);

add('tap-drill-size-calculator', 'Tap Drill Size Calculator',
  'Calculate the tap drill diameter for threaded holes.',
  'Science', 'science', 'A',
  ['tap drill', 'thread tap calculator'],
  [
    '{ name: "majorDia", label: "Major Diameter (inches)", type: "number", min: 0.05, max: 4, defaultValue: 0.25 }',
    '{ name: "tpi", label: "Threads Per Inch", type: "number", min: 4, max: 80, defaultValue: 20 }',
    '{ name: "threadPct", label: "Thread Percentage (%)", type: "number", min: 50, max: 100, defaultValue: 75 }',
  ],
  `(inputs) => {
      const maj = inputs.majorDia as number;
      const tpi = inputs.tpi as number;
      const pct = inputs.threadPct as number;
      if (!maj || !tpi || !pct) return null;
      const pitch = 1 / tpi;
      const basicPD = maj - 0.6495 * pitch;
      const drillSize = maj - (pct / 100) * 0.6495 * 2 * pitch;
      var drill64 = Math.round(drillSize * 64);
      return {
        primary: { label: "Tap Drill Size", value: formatNumber(Math.round(drillSize * 10000) / 10000) + " in" },
        details: [
          { label: "Nearest 64th", value: drill64 + "/64 in" },
          { label: "Pitch", value: formatNumber(Math.round(pitch * 10000) / 10000) + " in" },
          { label: "Thread Engagement", value: pct + "%" },
        ],
      };
  }`,
  [{ q: 'What thread percentage should I use?', a: 'Use 75 percent for most applications. Going above 80 percent adds little strength.' },
   { q: 'How do I find threads per inch?', a: 'Use a thread pitch gauge or count threads over one inch of the fastener.' }],
  'Drill = Major Dia - Thread% x 1.299 x Pitch',
  []
);

add('thread-pitch-calculator', 'Thread Pitch Calculator',
  'Calculate thread dimensions from gauge and pitch.',
  'Science', 'science', 'A',
  ['thread pitch', 'thread gauge calculator'],
  [
    '{ name: "majorDia", label: "Major Diameter (inches)", type: "number", min: 0.05, max: 4, defaultValue: 0.5 }',
    '{ name: "tpi", label: "Threads Per Inch", type: "number", min: 4, max: 80, defaultValue: 13 }',
  ],
  `(inputs) => {
      const maj = inputs.majorDia as number;
      const tpi = inputs.tpi as number;
      if (!maj || !tpi) return null;
      const pitch = 1 / tpi;
      const pitchDia = Math.round((maj - 0.6495 * pitch) * 10000) / 10000;
      const minorDia = Math.round((maj - 1.299 * pitch) * 10000) / 10000;
      const threadDepth = Math.round((0.6134 * pitch) * 10000) / 10000;
      return {
        primary: { label: "Pitch Diameter", value: formatNumber(pitchDia) + " in" },
        details: [
          { label: "Minor Diameter", value: formatNumber(minorDia) + " in" },
          { label: "Pitch", value: formatNumber(Math.round(pitch * 10000) / 10000) + " in" },
          { label: "Thread Depth", value: formatNumber(threadDepth) + " in" },
        ],
      };
  }`,
  [{ q: 'What is the pitch diameter?', a: 'The pitch diameter is where the thread width equals the space between threads.' },
   { q: 'What is the difference between UNC and UNF?', a: 'UNC is coarse thread with fewer TPI. UNF is fine thread with more TPI.' }],
  'Pitch Dia = Major - 0.6495 x Pitch; Minor = Major - 1.299 x Pitch',
  []
);

add('fabric-shrinkage-calculator', 'Fabric Shrinkage Calculator',
  'Calculate how much extra fabric to buy before pre-shrinking.',
  'Everyday', 'everyday', '~',
  ['fabric shrinkage', 'pre-shrink calculator'],
  [
    '{ name: "finishedLength", label: "Finished Length Needed (inches)", type: "number", min: 1, max: 500, defaultValue: 45 }',
    '{ name: "finishedWidth", label: "Finished Width Needed (inches)", type: "number", min: 1, max: 120, defaultValue: 36 }',
    '{ name: "shrinkLength", label: "Length Shrinkage (%)", type: "number", min: 0, max: 20, defaultValue: 5 }',
    '{ name: "shrinkWidth", label: "Width Shrinkage (%)", type: "number", min: 0, max: 20, defaultValue: 3 }',
  ],
  `(inputs) => {
      const fl = inputs.finishedLength as number;
      const fw = inputs.finishedWidth as number;
      const sl = inputs.shrinkLength as number;
      const sw = inputs.shrinkWidth as number;
      if (!fl || !fw) return null;
      const cutLength = Math.round((fl / (1 - sl / 100)) * 100) / 100;
      const cutWidth = Math.round((fw / (1 - sw / 100)) * 100) / 100;
      const extraL = Math.round((cutLength - fl) * 100) / 100;
      const extraW = Math.round((cutWidth - fw) * 100) / 100;
      return {
        primary: { label: "Cut Length Before Wash", value: formatNumber(cutLength) + " in" },
        details: [
          { label: "Cut Width Before Wash", value: formatNumber(cutWidth) + " in" },
          { label: "Extra Length", value: formatNumber(extraL) + " in" },
          { label: "Extra Width", value: formatNumber(extraW) + " in" },
        ],
      };
  }`,
  [{ q: 'How much does cotton shrink?', a: 'Cotton typically shrinks 3 to 5 percent in length and 2 to 3 percent in width.' },
   { q: 'Should I always pre-shrink fabric?', a: 'Yes. Pre-shrink washable fabrics before cutting to avoid a too-small finished item.' }],
  'Cut Length = Finished Length / (1 - Shrinkage%)',
  []
);

add('seam-allowance-calculator', 'Seam Allowance Calculator',
  'Calculate total fabric dimensions including seam allowances.',
  'Everyday', 'everyday', '~',
  ['seam allowance', 'sewing calculator'],
  [
    '{ name: "finishedLength", label: "Finished Length (inches)", type: "number", min: 1, max: 500, defaultValue: 20 }',
    '{ name: "finishedWidth", label: "Finished Width (inches)", type: "number", min: 1, max: 200, defaultValue: 15 }',
    '{ name: "seamAllowance", label: "Seam Allowance (inches)", type: "number", min: 0.125, max: 2, defaultValue: 0.625 }',
    '{ name: "seamSides", label: "Sides with Seams", type: "number", min: 1, max: 4, defaultValue: 4 }',
  ],
  `(inputs) => {
      const fl = inputs.finishedLength as number;
      const fw = inputs.finishedWidth as number;
      const sa = inputs.seamAllowance as number;
      const sides = inputs.seamSides as number;
      if (!fl || !fw || !sa || !sides) return null;
      var addL = sides >= 3 ? sa * 2 : sa;
      var addW = sides >= 2 ? sa * 2 : sa;
      if (sides === 1) { addL = sa; addW = 0; }
      var cutL = fl + addL;
      var cutW = fw + addW;
      return {
        primary: { label: "Cut Length", value: formatNumber(cutL) + " in" },
        details: [
          { label: "Cut Width", value: formatNumber(cutW) + " in" },
          { label: "Seam Allowance Per Side", value: formatNumber(sa) + " in" },
          { label: "Total Seam Addition", value: formatNumber(Math.round((addL + addW) * 100) / 100) + " in" },
        ],
      };
  }`,
  [{ q: 'What is the standard seam allowance?', a: 'The standard seam allowance is 5/8 inch (0.625 inches) for most garments.' },
   { q: 'When should I use a narrower seam?', a: 'Use 1/4 inch seams for quilting and 3/8 inch for lightweight fabrics.' }],
  'Cut Size = Finished Size + (Seam Allowance x 2) per dimension',
  []
);

add('button-spacing-calculator', 'Button Spacing Calculator',
  'Calculate even button placement on a garment.',
  'Everyday', 'everyday', '~',
  ['button spacing', 'button placement calculator'],
  [
    '{ name: "placketLength", label: "Placket Length (inches)", type: "number", min: 2, max: 60, defaultValue: 24 }',
    '{ name: "numButtons", label: "Number of Buttons", type: "number", min: 2, max: 20, defaultValue: 6 }',
    '{ name: "topOffset", label: "Top Offset (inches)", type: "number", min: 0, max: 5, defaultValue: 0.75 }',
    '{ name: "bottomOffset", label: "Bottom Offset (inches)", type: "number", min: 0, max: 5, defaultValue: 0.75 }',
  ],
  `(inputs) => {
      const pl = inputs.placketLength as number;
      const nb = inputs.numButtons as number;
      const to = inputs.topOffset as number;
      const bo = inputs.bottomOffset as number;
      if (!pl || !nb) return null;
      const usable = pl - to - bo;
      const spacing = Math.round((usable / (nb - 1)) * 1000) / 1000;
      var positions = [];
      for (var i = 0; i < nb; i++) {
        positions.push(Math.round((to + i * spacing) * 100) / 100);
      }
      return {
        primary: { label: "Button Spacing", value: formatNumber(spacing) + " in" },
        details: [
          { label: "Usable Length", value: formatNumber(Math.round(usable * 100) / 100) + " in" },
          { label: "First Button Position", value: formatNumber(to) + " in from top" },
          { label: "Last Button Position", value: formatNumber(positions[positions.length - 1]) + " in from top" },
        ],
      };
  }`,
  [{ q: 'How far apart should buttons be?', a: 'Buttons are typically spaced 2.5 to 4 inches apart on a shirt.' },
   { q: 'Where should the top button go?', a: 'Place the top button about 0.5 to 1 inch below the neckline edge.' }],
  'Spacing = (Placket Length - Top Offset - Bottom Offset) / (Buttons - 1)',
  []
);

add('elastic-length-calculator', 'Elastic Length Calculator',
  'Calculate the cutting length for elastic in a garment.',
  'Everyday', 'everyday', '~',
  ['elastic length', 'elastic calculator sewing'],
  [
    '{ name: "bodyMeasure", label: "Body Measurement (inches)", type: "number", min: 5, max: 80, defaultValue: 30 }',
    '{ name: "stretchRatio", label: "Stretch Ratio (%)", type: "number", min: 50, max: 95, defaultValue: 80 }',
    '{ name: "overlapAllowance", label: "Overlap Allowance (inches)", type: "number", min: 0, max: 3, defaultValue: 1 }',
  ],
  `(inputs) => {
      const body = inputs.bodyMeasure as number;
      const ratio = inputs.stretchRatio as number;
      const overlap = inputs.overlapAllowance as number;
      if (!body || !ratio) return null;
      const relaxedLen = Math.round((body * ratio / 100) * 100) / 100;
      const cutLen = Math.round((relaxedLen + overlap) * 100) / 100;
      const stretch = Math.round((body - relaxedLen) * 100) / 100;
      return {
        primary: { label: "Cut Elastic Length", value: formatNumber(cutLen) + " in" },
        details: [
          { label: "Relaxed Elastic Length", value: formatNumber(relaxedLen) + " in" },
          { label: "Stretch Needed", value: formatNumber(stretch) + " in" },
          { label: "Overlap Included", value: formatNumber(overlap) + " in" },
        ],
      };
  }`,
  [{ q: 'What stretch ratio should I use?', a: 'Use 75 to 85 percent of the body measurement for comfortable elastic fit.' },
   { q: 'How much overlap do I need?', a: 'Add 0.5 to 1 inch of overlap for joining the elastic ends together.' }],
  'Cut Length = (Body Measurement x Stretch Ratio) + Overlap',
  []
);

add('crop-yield-calculator', 'Crop Yield Calculator',
  'Estimate expected crop yield per acre from field data.',
  'Science', 'science', 'A',
  ['crop yield', 'harvest yield calculator'],
  [
    '{ name: "rowLength", label: "Row Length (feet)", type: "number", min: 10, max: 5280, defaultValue: 1000 }',
    '{ name: "rowSpacing", label: "Row Spacing (inches)", type: "number", min: 6, max: 60, defaultValue: 30 }',
    '{ name: "plantSpacing", label: "Plant Spacing (inches)", type: "number", min: 2, max: 48, defaultValue: 8 }',
    '{ name: "yieldPerPlant", label: "Yield Per Plant (lb)", type: "number", min: 0.01, max: 50, defaultValue: 0.5 }',
    '{ name: "acres", label: "Total Acres", type: "number", min: 0.1, max: 10000, defaultValue: 10 }',
  ],
  `(inputs) => {
      const rl = inputs.rowLength as number;
      const rs = inputs.rowSpacing as number;
      const ps = inputs.plantSpacing as number;
      const ypp = inputs.yieldPerPlant as number;
      const ac = inputs.acres as number;
      if (!rl || !rs || !ps || !ypp || !ac) return null;
      const rowsPerAcre = Math.floor(43560 / (rl * rs / 12));
      const plantsPerRow = Math.floor(rl * 12 / ps);
      const plantsPerAcre = rowsPerAcre * plantsPerRow;
      const yieldPerAcre = Math.round(plantsPerAcre * ypp);
      var totalYield = Math.round(yieldPerAcre * ac);
      return {
        primary: { label: "Yield Per Acre", value: formatNumber(yieldPerAcre) + " lb" },
        details: [
          { label: "Total Yield", value: formatNumber(totalYield) + " lb" },
          { label: "Plants Per Acre", value: formatNumber(plantsPerAcre) },
          { label: "Rows Per Acre", value: formatNumber(rowsPerAcre) },
        ],
      };
  }`,
  [{ q: 'How do I estimate yield per plant?', a: 'Weigh the harvest of a sample row and divide by the number of plants.' },
   { q: 'What affects crop yield?', a: 'Soil fertility, water, sunlight, spacing, and pest control all affect yield.' }],
  'Yield/Acre = Plants Per Acre x Yield Per Plant',
  []
);

add('seed-rate-calculator', 'Seed Rate Calculator',
  'Calculate seeding rate per acre for planting.',
  'Science', 'science', 'A',
  ['seed rate', 'planting rate calculator'],
  [
    '{ name: "desiredPlants", label: "Desired Plants Per Acre", type: "number", min: 100, max: 500000, defaultValue: 32000 }',
    '{ name: "germRate", label: "Germination Rate (%)", type: "number", min: 10, max: 100, defaultValue: 92 }',
    '{ name: "seedsPerLb", label: "Seeds Per Pound", type: "number", min: 10, max: 500000, defaultValue: 1500 }',
    '{ name: "acres", label: "Total Acres", type: "number", min: 0.1, max: 10000, defaultValue: 40 }',
  ],
  `(inputs) => {
      const dp = inputs.desiredPlants as number;
      const gr = inputs.germRate as number;
      const spl = inputs.seedsPerLb as number;
      const ac = inputs.acres as number;
      if (!dp || !gr || !spl || !ac) return null;
      const seedsNeeded = Math.ceil(dp / (gr / 100));
      const lbsPerAcre = Math.round((seedsNeeded / spl) * 100) / 100;
      const totalLbs = Math.round(lbsPerAcre * ac * 100) / 100;
      return {
        primary: { label: "Seed Rate", value: formatNumber(lbsPerAcre) + " lb/acre" },
        details: [
          { label: "Seeds Needed Per Acre", value: formatNumber(seedsNeeded) },
          { label: "Total Seed Needed", value: formatNumber(totalLbs) + " lb" },
          { label: "Adjusted for Germination", value: gr + "%" },
        ],
      };
  }`,
  [{ q: 'What is a typical corn seeding rate?', a: 'Corn is typically planted at 28000 to 36000 seeds per acre.' },
   { q: 'Why adjust for germination rate?', a: 'Not all seeds germinate, so you plant extra to reach the desired stand count.' }],
  'Seed Rate (lb/acre) = (Desired Plants / Germination%) / Seeds Per Pound',
  []
);

add('irrigation-water-calculator', 'Irrigation Water Calculator',
  'Estimate irrigation water needs for crops per acre.',
  'Science', 'science', 'A',
  ['irrigation water', 'crop water calculator'],
  [
    '{ name: "etRate", label: "ET Rate (inches/day)", type: "number", min: 0.05, max: 0.5, defaultValue: 0.2 }',
    '{ name: "rainfall", label: "Weekly Rainfall (inches)", type: "number", min: 0, max: 10, defaultValue: 0.5 }',
    '{ name: "efficiency", label: "System Efficiency (%)", type: "number", min: 30, max: 100, defaultValue: 75 }',
    '{ name: "acres", label: "Irrigated Acres", type: "number", min: 0.1, max: 10000, defaultValue: 80 }',
  ],
  `(inputs) => {
      const et = inputs.etRate as number;
      const rain = inputs.rainfall as number;
      const eff = inputs.efficiency as number;
      const ac = inputs.acres as number;
      if (!et || !eff || !ac) return null;
      const weeklyET = et * 7;
      const netNeed = Math.max(0, weeklyET - rain);
      const grossNeed = Math.round((netNeed / (eff / 100)) * 100) / 100;
      var gallonsPerAcre = Math.round(grossNeed * 27154);
      var totalGallons = Math.round(gallonsPerAcre * ac);
      return {
        primary: { label: "Weekly Irrigation Need", value: formatNumber(grossNeed) + " in/acre" },
        details: [
          { label: "Gallons Per Acre Per Week", value: formatNumber(gallonsPerAcre) },
          { label: "Total Gallons Per Week", value: formatNumber(totalGallons) },
          { label: "Net Crop Need", value: formatNumber(Math.round(netNeed * 100) / 100) + " in" },
        ],
      };
  }`,
  [{ q: 'What is ET rate?', a: 'ET is evapotranspiration, the rate at which a crop uses water through evaporation and transpiration.' },
   { q: 'What irrigation efficiency should I use?', a: 'Use 75% for sprinkler, 85% for center pivot, and 90% for drip irrigation.' }],
  'Irrigation = (ET x 7 - Rainfall) / Efficiency',
  []
);

add('livestock-feed-calculator', 'Livestock Feed Calculator',
  'Calculate daily feed requirements per animal.',
  'Everyday', 'everyday', '~',
  ['livestock feed', 'cattle feed calculator'],
  [
    '{ name: "animalWeight", label: "Animal Weight (lb)", type: "number", min: 50, max: 3000, defaultValue: 1200 }',
    '{ name: "intakePct", label: "Dry Matter Intake (%BW)", type: "number", min: 1, max: 5, defaultValue: 2.5 }',
    '{ name: "numAnimals", label: "Number of Animals", type: "number", min: 1, max: 5000, defaultValue: 50 }',
    '{ name: "days", label: "Feeding Period (days)", type: "number", min: 1, max: 365, defaultValue: 120 }',
  ],
  `(inputs) => {
      const wt = inputs.animalWeight as number;
      const pct = inputs.intakePct as number;
      const num = inputs.numAnimals as number;
      const days = inputs.days as number;
      if (!wt || !pct || !num || !days) return null;
      const dailyPerHead = Math.round(wt * pct / 100 * 100) / 100;
      const dailyTotal = Math.round(dailyPerHead * num * 100) / 100;
      const totalFeed = Math.round(dailyTotal * days);
      var totalTons = Math.round(totalFeed / 2000 * 10) / 10;
      return {
        primary: { label: "Daily Feed Per Head", value: formatNumber(dailyPerHead) + " lb" },
        details: [
          { label: "Daily Herd Total", value: formatNumber(dailyTotal) + " lb" },
          { label: "Total Feed Needed", value: formatNumber(totalFeed) + " lb" },
          { label: "Total in Tons", value: formatNumber(totalTons) + " tons" },
        ],
      };
  }`,
  [{ q: 'How much does a cow eat per day?', a: 'A cow eats about 2 to 3 percent of its body weight in dry matter per day.' },
   { q: 'Does feed intake change by season?', a: 'Yes. Cold weather increases intake and hot weather decreases it.' }],
  'Daily Feed = Animal Weight x Intake Percentage',
  []
);

add('hay-bale-calculator', 'Hay Bale Calculator',
  'Calculate hay bales needed for winter feeding.',
  'Everyday', 'everyday', '~',
  ['hay bale', 'hay storage calculator'],
  [
    '{ name: "numAnimals", label: "Number of Animals", type: "number", min: 1, max: 2000, defaultValue: 30 }',
    '{ name: "dailyHay", label: "Hay Per Animal Per Day (lb)", type: "number", min: 5, max: 50, defaultValue: 25 }',
    '{ name: "feedingDays", label: "Feeding Days", type: "number", min: 30, max: 365, defaultValue: 150 }',
    '{ name: "baleWeight", label: "Bale Weight (lb)", type: "number", min: 40, max: 2000, defaultValue: 1200 }',
    '{ name: "wastePct", label: "Hay Waste (%)", type: "number", min: 0, max: 40, defaultValue: 15 }',
  ],
  `(inputs) => {
      const na = inputs.numAnimals as number;
      const dh = inputs.dailyHay as number;
      const fd = inputs.feedingDays as number;
      const bw = inputs.baleWeight as number;
      const wp = inputs.wastePct as number;
      if (!na || !dh || !fd || !bw) return null;
      const totalHay = na * dh * fd;
      const withWaste = Math.round(totalHay * (1 + wp / 100));
      const bales = Math.ceil(withWaste / bw);
      var totalTons = Math.round(withWaste / 2000 * 10) / 10;
      return {
        primary: { label: "Bales Needed", value: formatNumber(bales) },
        details: [
          { label: "Total Hay", value: formatNumber(withWaste) + " lb" },
          { label: "Total in Tons", value: formatNumber(totalTons) + " tons" },
          { label: "Waste Included", value: wp + "%" },
        ],
      };
  }`,
  [{ q: 'How much waste should I plan for?', a: 'Plan for 10 to 20 percent waste depending on storage and feeding method.' },
   { q: 'How much hay does a horse need daily?', a: 'A horse typically needs 15 to 25 pounds of hay per day.' }],
  'Bales = (Animals x Daily Hay x Days x (1 + Waste%)) / Bale Weight',
  []
);

add('pasture-stocking-rate-calculator', 'Pasture Stocking Rate Calculator',
  'Calculate how many animals a pasture can support.',
  'Science', 'science', 'A',
  ['stocking rate', 'pasture capacity calculator'],
  [
    '{ name: "pastureAcres", label: "Pasture Size (acres)", type: "number", min: 1, max: 50000, defaultValue: 100 }',
    '{ name: "forageProd", label: "Forage Production (lb DM/acre/year)", type: "number", min: 500, max: 15000, defaultValue: 4000 }',
    '{ name: "utilization", label: "Utilization Rate (%)", type: "number", min: 20, max: 80, defaultValue: 50 }',
    '{ name: "auDemand", label: "Animal Unit Demand (lb DM/month)", type: "number", min: 400, max: 1200, defaultValue: 780 }',
    '{ name: "grazingMonths", label: "Grazing Months", type: "number", min: 1, max: 12, defaultValue: 7 }',
  ],
  `(inputs) => {
      const ac = inputs.pastureAcres as number;
      const fp = inputs.forageProd as number;
      const ut = inputs.utilization as number;
      const aud = inputs.auDemand as number;
      const gm = inputs.grazingMonths as number;
      if (!ac || !fp || !ut || !aud || !gm) return null;
      var availForage = ac * fp * (ut / 100);
      var demandPerAU = aud * gm;
      var animalUnits = Math.floor(availForage / demandPerAU);
      var acresPerAU = Math.round((ac / animalUnits) * 10) / 10;
      return {
        primary: { label: "Animal Units Supported", value: formatNumber(animalUnits) },
        details: [
          { label: "Acres Per Animal Unit", value: formatNumber(acresPerAU) },
          { label: "Available Forage", value: formatNumber(Math.round(availForage)) + " lb DM" },
          { label: "Demand Per Animal Unit", value: formatNumber(demandPerAU) + " lb DM" },
        ],
      };
  }`,
  [{ q: 'What is an animal unit?', a: 'An animal unit is one 1000 lb cow with a calf, consuming about 780 lb DM per month.' },
   { q: 'What utilization rate should I use?', a: 'Use 50% for sustainable grazing to maintain pasture health.' }],
  'Animal Units = (Acres x Forage x Utilization%) / (Monthly Demand x Months)',
  []
);

add('grain-bin-capacity-calculator', 'Grain Bin Capacity Calculator',
  'Calculate grain storage capacity of a cylindrical bin.',
  'Science', 'science', 'A',
  ['grain bin', 'grain storage calculator'],
  [
    '{ name: "diameter", label: "Bin Diameter (feet)", type: "number", min: 6, max: 120, defaultValue: 30 }',
    '{ name: "eaveHeight", label: "Eave Height (feet)", type: "number", min: 5, max: 60, defaultValue: 20 }',
    '{ name: "peakHeight", label: "Peak Height Above Eave (feet)", type: "number", min: 0, max: 20, defaultValue: 5 }',
    '{ name: "bushelsPerCuFt", label: "Bushels Per Cubic Foot", type: "number", min: 0.5, max: 1.5, defaultValue: 0.8 }',
  ],
  `(inputs) => {
      const d = inputs.diameter as number;
      const eh = inputs.eaveHeight as number;
      const pk = inputs.peakHeight as number;
      const bpf = inputs.bushelsPerCuFt as number;
      if (!d || !eh || !bpf) return null;
      const r = d / 2;
      const cylVol = Math.PI * r * r * eh;
      const coneVol = (1 / 3) * Math.PI * r * r * pk;
      const totalVol = cylVol + coneVol;
      var bushels = Math.round(totalVol * bpf);
      var tons = Math.round(bushels * 56 / 2000 * 10) / 10;
      return {
        primary: { label: "Capacity", value: formatNumber(bushels) + " bushels" },
        details: [
          { label: "Total Volume", value: formatNumber(Math.round(totalVol)) + " cu ft" },
          { label: "Approximate Tons (corn)", value: formatNumber(tons) },
          { label: "Bin Floor Area", value: formatNumber(Math.round(Math.PI * r * r)) + " sq ft" },
        ],
      };
  }`,
  [{ q: 'How do I convert bushels to tons?', a: 'For corn, multiply bushels by 56 and divide by 2000 to get short tons.' },
   { q: 'What is the standard bushel conversion?', a: 'One bushel equals 1.2445 cubic feet, or about 0.8 bushels per cubic foot.' }],
  'Bushels = (Cylinder Vol + Cone Vol) x Bushels Per Cu Ft',
  []
);

add('tractor-pto-calculator', 'Tractor PTO Calculator',
  'Estimate PTO horsepower needs for implements.',
  'Science', 'science', 'A',
  ['tractor PTO', 'PTO horsepower calculator'],
  [
    '{ name: "implementHP", label: "Implement PTO Requirement (HP)", type: "number", min: 5, max: 500, defaultValue: 45 }',
    '{ name: "ptoEfficiency", label: "PTO Efficiency (%)", type: "number", min: 70, max: 100, defaultValue: 86 }',
    '{ name: "altitude", label: "Altitude (feet)", type: "number", min: 0, max: 10000, defaultValue: 500 }',
    '{ name: "safetyMargin", label: "Safety Margin (%)", type: "number", min: 0, max: 50, defaultValue: 20 }',
  ],
  `(inputs) => {
      const ihp = inputs.implementHP as number;
      const eff = inputs.ptoEfficiency as number;
      const alt = inputs.altitude as number;
      const margin = inputs.safetyMargin as number;
      if (!ihp || !eff) return null;
      var altDerate = 1 - (alt / 1000) * 0.035;
      if (altDerate < 0.5) altDerate = 0.5;
      var engineHP = ihp / (eff / 100);
      var adjustedHP = engineHP / altDerate;
      var recommended = Math.ceil(adjustedHP * (1 + margin / 100));
      return {
        primary: { label: "Recommended Engine HP", value: formatNumber(recommended) + " HP" },
        details: [
          { label: "Engine HP at Sea Level", value: formatNumber(Math.round(engineHP * 10) / 10) + " HP" },
          { label: "Altitude Derating", value: formatNumber(Math.round((1 - altDerate) * 100)) + "%" },
          { label: "Safety Margin", value: margin + "%" },
        ],
      };
  }`,
  [{ q: 'What is PTO efficiency?', a: 'PTO efficiency is the percentage of engine power that reaches the PTO shaft, typically 83 to 87%.' },
   { q: 'How does altitude affect tractor power?', a: 'Engines lose about 3.5 percent of power for every 1000 feet of altitude.' }],
  'Engine HP = (Implement HP / PTO Efficiency) / Altitude Factor x (1 + Margin)',
  []
);
add(
  "aircraft-weight-balance-calculator",
  "Aircraft Weight Balance Calculator",
  "Calculate aircraft center of gravity from weight and arm data.",
  "Science",
  "science",
  "A",
  ["aircraft", "weight", "balance", "CG"],
  [
    '{ name: "emptyWeight", label: "Empty Weight (lbs)", type: "number", min: 500, max: 50000, defaultValue: 1500 }',
    '{ name: "emptyArm", label: "Empty Weight Arm (in)", type: "number", min: 10, max: 300, defaultValue: 82 }',
    '{ name: "fuelWeight", label: "Fuel Weight (lbs)", type: "number", min: 0, max: 5000, defaultValue: 300 }',
    '{ name: "fuelArm", label: "Fuel Arm (in)", type: "number", min: 10, max: 300, defaultValue: 95 }',
    '{ name: "payloadWeight", label: "Payload Weight (lbs)", type: "number", min: 0, max: 5000, defaultValue: 400 }',
    '{ name: "payloadArm", label: "Payload Arm (in)", type: "number", min: 10, max: 300, defaultValue: 73 }',
  ],
  `(inputs) => {
    const emptyWeight = inputs.emptyWeight as number;
    const emptyArm = inputs.emptyArm as number;
    const fuelWeight = inputs.fuelWeight as number;
    const fuelArm = inputs.fuelArm as number;
    const payloadWeight = inputs.payloadWeight as number;
    const payloadArm = inputs.payloadArm as number;
    const totalWeight = emptyWeight + fuelWeight + payloadWeight;
    const totalMoment = emptyWeight * emptyArm + fuelWeight * fuelArm + payloadWeight * payloadArm;
    const cg = totalMoment / totalWeight;
    return {
      primary: { label: "Center of Gravity", value: formatNumber(cg) + " in aft of datum" },
      details: [
        { label: "Total Weight", value: formatNumber(totalWeight) + " lbs" },
        { label: "Total Moment", value: formatNumber(totalMoment) + " lb-in" }
      ]
    };
  }`,
  [
    { q: "What is center of gravity in aviation?", a: "It is the point where the aircraft balances longitudinally." },
    { q: "Why does CG matter for flight?", a: "An out of range CG makes the aircraft unstable or uncontrollable." }
  ],
  "CG = Total Moment / Total Weight; Moment = Weight x Arm",
  ["fuel-burn-rate-calculator", "true-airspeed-calculator"]
);

add(
  "fuel-burn-rate-calculator",
  "Fuel Burn Rate Calculator",
  "Estimate aircraft fuel consumption over a flight leg.",
  "Science",
  "science",
  "A",
  ["fuel", "burn", "rate", "aircraft"],
  [
    '{ name: "fuelOnboard", label: "Fuel On Board (gal)", type: "number", min: 1, max: 5000, defaultValue: 50 }',
    '{ name: "burnRate", label: "Burn Rate (gal/hr)", type: "number", min: 1, max: 500, defaultValue: 10 }',
    '{ name: "flightTime", label: "Flight Time (hours)", type: "number", min: 0.1, max: 24, defaultValue: 2.5 }',
  ],
  `(inputs) => {
    const fuelOnboard = inputs.fuelOnboard as number;
    const burnRate = inputs.burnRate as number;
    const flightTime = inputs.flightTime as number;
    const fuelUsed = burnRate * flightTime;
    const fuelRemaining = fuelOnboard - fuelUsed;
    const endurance = fuelOnboard / burnRate;
    return {
      primary: { label: "Fuel Remaining", value: formatNumber(fuelRemaining) + " gal" },
      details: [
        { label: "Fuel Used", value: formatNumber(fuelUsed) + " gal" },
        { label: "Total Endurance", value: formatNumber(endurance) + " hours" }
      ]
    };
  }`,
  [
    { q: "What is a typical fuel burn for a small airplane?", a: "A small piston aircraft burns about 8 to 15 gallons per hour." },
    { q: "How much fuel reserve is required?", a: "VFR flights require at least 30 minutes of fuel reserve." }
  ],
  "Fuel Used = Burn Rate x Flight Time; Remaining = On Board - Used",
  ["aircraft-weight-balance-calculator", "flight-time-calculator"]
);

add(
  "crosswind-component-calculator",
  "Crosswind Component Calculator",
  "Calculate crosswind and headwind from wind angle and speed.",
  "Science",
  "science",
  "A",
  ["crosswind", "headwind", "runway", "wind"],
  [
    '{ name: "windSpeed", label: "Wind Speed (kts)", type: "number", min: 0, max: 100, defaultValue: 20 }',
    '{ name: "windAngle", label: "Wind Angle Off Runway (deg)", type: "number", min: 0, max: 90, defaultValue: 30 }',
  ],
  `(inputs) => {
    const windSpeed = inputs.windSpeed as number;
    const windAngle = inputs.windAngle as number;
    const rad = windAngle * Math.PI / 180;
    const crosswind = windSpeed * Math.sin(rad);
    const headwind = windSpeed * Math.cos(rad);
    return {
      primary: { label: "Crosswind Component", value: formatNumber(crosswind) + " kts" },
      details: [
        { label: "Headwind Component", value: formatNumber(headwind) + " kts" },
        { label: "Wind Angle", value: formatNumber(windAngle) + " degrees" }
      ]
    };
  }`,
  [
    { q: "How do you calculate crosswind?", a: "Multiply wind speed by the sine of the angle off the runway." },
    { q: "What is a safe crosswind limit?", a: "Most small aircraft have a limit of 15 to 20 knots crosswind." }
  ],
  "Crosswind = Wind Speed x sin(Angle); Headwind = Wind Speed x cos(Angle)",
  ["density-altitude-calculator", "true-airspeed-calculator"]
);

add(
  "density-altitude-calculator",
  "Density Altitude Calculator",
  "Calculate density altitude from elevation and temperature.",
  "Science",
  "science",
  "A",
  ["density", "altitude", "pressure", "temperature"],
  [
    '{ name: "fieldElev", label: "Field Elevation (ft)", type: "number", min: 0, max: 15000, defaultValue: 5000 }',
    '{ name: "altimeter", label: "Altimeter Setting (inHg)", type: "number", min: 28, max: 31, defaultValue: 29.92 }',
    '{ name: "oat", label: "Outside Air Temp (C)", type: "number", min: -40, max: 50, defaultValue: 25 }',
  ],
  `(inputs) => {
    const fieldElev = inputs.fieldElev as number;
    const altimeter = inputs.altimeter as number;
    const oat = inputs.oat as number;
    const pressAlt = fieldElev + (29.92 - altimeter) * 1000;
    const stdTemp = 15 - (pressAlt / 1000) * 2;
    const tempDev = oat - stdTemp;
    const densityAlt = pressAlt + 120 * tempDev;
    return {
      primary: { label: "Density Altitude", value: formatNumber(densityAlt) + " ft" },
      details: [
        { label: "Pressure Altitude", value: formatNumber(pressAlt) + " ft" },
        { label: "Standard Temp at Altitude", value: formatNumber(stdTemp) + " C" },
        { label: "Temp Deviation", value: formatNumber(tempDev) + " C" }
      ]
    };
  }`,
  [
    { q: "What is density altitude?", a: "It is pressure altitude corrected for nonstandard temperature." },
    { q: "Why does density altitude matter?", a: "Higher density altitude reduces engine power and lift." }
  ],
  "Pressure Alt = Elev + (29.92 - Altimeter) x 1000; DA = PA + 120 x Temp Dev",
  ["crosswind-component-calculator", "true-airspeed-calculator"]
);

add(
  "true-airspeed-calculator",
  "True Airspeed Calculator",
  "Calculate true airspeed from indicated airspeed and altitude.",
  "Science",
  "science",
  "A",
  ["true", "airspeed", "TAS", "IAS"],
  [
    '{ name: "ias", label: "Indicated Airspeed (kts)", type: "number", min: 40, max: 500, defaultValue: 120 }',
    '{ name: "pressAlt", label: "Pressure Altitude (ft)", type: "number", min: 0, max: 45000, defaultValue: 8000 }',
    '{ name: "oat", label: "Outside Air Temp (C)", type: "number", min: -60, max: 50, defaultValue: 5 }',
  ],
  `(inputs) => {
    const ias = inputs.ias as number;
    const pressAlt = inputs.pressAlt as number;
    const oat = inputs.oat as number;
    const stdTemp = 15 - (pressAlt / 1000) * 2;
    const tempRatio = (oat + 273.15) / (stdTemp + 273.15);
    const densityRatio = Math.pow(1 - pressAlt / 145442, 4.256);
    const tas = ias / Math.sqrt(densityRatio / tempRatio);
    return {
      primary: { label: "True Airspeed", value: formatNumber(tas) + " kts" },
      details: [
        { label: "Indicated Airspeed", value: formatNumber(ias) + " kts" },
        { label: "Standard Temp", value: formatNumber(stdTemp) + " C" },
        { label: "TAS Increase", value: formatNumber(tas - ias) + " kts" }
      ]
    };
  }`,
  [
    { q: "What is true airspeed?", a: "TAS is the actual speed of the aircraft through the air mass." },
    { q: "How does altitude affect TAS?", a: "TAS increases about 2 percent per 1000 feet of altitude." }
  ],
  "TAS = IAS / sqrt(Density Ratio / Temp Ratio)",
  ["density-altitude-calculator", "flight-time-calculator"]
);

add(
  "flight-time-calculator",
  "Flight Time Calculator",
  "Estimate flight duration from distance and groundspeed.",
  "Science",
  "science",
  "A",
  ["flight", "time", "distance", "groundspeed"],
  [
    '{ name: "distance", label: "Distance (NM)", type: "number", min: 1, max: 15000, defaultValue: 250 }',
    '{ name: "groundspeed", label: "Groundspeed (kts)", type: "number", min: 30, max: 600, defaultValue: 130 }',
  ],
  `(inputs) => {
    const distance = inputs.distance as number;
    const groundspeed = inputs.groundspeed as number;
    const timeHours = distance / groundspeed;
    const hours = Math.floor(timeHours);
    const minutes = Math.round((timeHours - hours) * 60);
    return {
      primary: { label: "Flight Time", value: hours + " hr " + minutes + " min" },
      details: [
        { label: "Decimal Hours", value: formatNumber(timeHours) + " hrs" },
        { label: "Distance", value: formatNumber(distance) + " NM" },
        { label: "Groundspeed", value: formatNumber(groundspeed) + " kts" }
      ]
    };
  }`,
  [
    { q: "What is groundspeed?", a: "Groundspeed is the speed of the aircraft relative to the ground." },
    { q: "How is flight time calculated?", a: "Divide the distance in nautical miles by groundspeed in knots." }
  ],
  "Flight Time = Distance / Groundspeed",
  ["fuel-burn-rate-calculator", "true-airspeed-calculator"]
);

add(
  "runway-length-calculator",
  "Runway Length Calculator",
  "Estimate required runway length for takeoff.",
  "Science",
  "science",
  "A",
  ["runway", "takeoff", "distance", "aircraft"],
  [
    '{ name: "grossWeight", label: "Gross Weight (lbs)", type: "number", min: 1000, max: 100000, defaultValue: 2500 }',
    '{ name: "densityAlt", label: "Density Altitude (ft)", type: "number", min: 0, max: 15000, defaultValue: 3000 }',
    '{ name: "baseRun", label: "Sea Level Takeoff Roll (ft)", type: "number", min: 200, max: 10000, defaultValue: 1200 }',
  ],
  `(inputs) => {
    const grossWeight = inputs.grossWeight as number;
    const densityAlt = inputs.densityAlt as number;
    const baseRun = inputs.baseRun as number;
    const altFactor = 1 + densityAlt / 1000 * 0.10;
    const weightFactor = grossWeight / 2500;
    const requiredRun = baseRun * altFactor * weightFactor;
    const safetyMargin = requiredRun * 1.5;
    return {
      primary: { label: "Required Runway", value: formatNumber(requiredRun) + " ft" },
      details: [
        { label: "With 50% Safety Margin", value: formatNumber(safetyMargin) + " ft" },
        { label: "Altitude Factor", value: formatNumber(altFactor) },
        { label: "Weight Factor", value: formatNumber(weightFactor) }
      ]
    };
  }`,
  [
    { q: "How does altitude affect takeoff distance?", a: "Takeoff distance increases about 10 percent per 1000 feet." },
    { q: "What safety margin should I use?", a: "Add at least 50 percent to calculated takeoff distance." }
  ],
  "Required = Base Roll x Altitude Factor x Weight Factor",
  ["density-altitude-calculator", "aircraft-weight-balance-calculator"]
);

add(
  "nautical-mile-converter-calculator",
  "Nautical Mile Converter Calculator",
  "Convert nautical miles to kilometers and statute miles.",
  "Conversion",
  "conversion",
  "R",
  ["nautical", "mile", "kilometer", "conversion"],
  [
    '{ name: "nauticalMiles", label: "Nautical Miles", type: "number", min: 0, max: 100000, defaultValue: 100 }',
  ],
  `(inputs) => {
    const nauticalMiles = inputs.nauticalMiles as number;
    const km = nauticalMiles * 1.852;
    const statuteMiles = nauticalMiles * 1.15078;
    const meters = km * 1000;
    return {
      primary: { label: "Kilometers", value: formatNumber(km) + " km" },
      details: [
        { label: "Statute Miles", value: formatNumber(statuteMiles) + " mi" },
        { label: "Meters", value: formatNumber(meters) + " m" },
        { label: "Nautical Miles", value: formatNumber(nauticalMiles) + " NM" }
      ]
    };
  }`,
  [
    { q: "How long is a nautical mile?", a: "One nautical mile equals 1.852 kilometers or 1.15078 statute miles." },
    { q: "Why do sailors use nautical miles?", a: "A nautical mile equals one minute of latitude on a chart." }
  ],
  "Kilometers = NM x 1.852; Statute Miles = NM x 1.15078",
  ["chart-distance-calculator", "light-year-distance-calculator"]
);

add(
  "true-wind-calculator",
  "True Wind Calculator",
  "Calculate true wind speed and direction from apparent wind.",
  "Science",
  "science",
  "A",
  ["true", "wind", "apparent", "sailing"],
  [
    '{ name: "apparentSpeed", label: "Apparent Wind Speed (kts)", type: "number", min: 0, max: 100, defaultValue: 18 }',
    '{ name: "apparentAngle", label: "Apparent Wind Angle (deg)", type: "number", min: 0, max: 180, defaultValue: 45 }',
    '{ name: "boatSpeed", label: "Boat Speed (kts)", type: "number", min: 0, max: 40, defaultValue: 6 }',
  ],
  `(inputs) => {
    const apparentSpeed = inputs.apparentSpeed as number;
    const apparentAngle = inputs.apparentAngle as number;
    const boatSpeed = inputs.boatSpeed as number;
    const rad = apparentAngle * Math.PI / 180;
    const twx = apparentSpeed * Math.sin(rad);
    const twy = apparentSpeed * Math.cos(rad) - boatSpeed;
    const trueSpeed = Math.sqrt(twx * twx + twy * twy);
    const trueAngle = Math.atan2(twx, twy) * 180 / Math.PI;
    return {
      primary: { label: "True Wind Speed", value: formatNumber(trueSpeed) + " kts" },
      details: [
        { label: "True Wind Angle", value: formatNumber(trueAngle) + " degrees" },
        { label: "Apparent Wind Speed", value: formatNumber(apparentSpeed) + " kts" },
        { label: "Boat Speed", value: formatNumber(boatSpeed) + " kts" }
      ]
    };
  }`,
  [
    { q: "What is apparent wind?", a: "Apparent wind is the wind felt on a moving vessel." },
    { q: "Why is true wind important for sailing?", a: "True wind determines sail trim and optimal course heading." }
  ],
  "True Wind = vector difference of Apparent Wind and Boat Speed",
  ["crosswind-component-calculator", "tidal-range-calculator"]
);

add(
  "tidal-range-calculator",
  "Tidal Range Calculator",
  "Estimate tide height at a given time between high and low.",
  "Science",
  "science",
  "A",
  ["tidal", "range", "tide", "height"],
  [
    '{ name: "highTide", label: "High Tide Height (ft)", type: "number", min: 0, max: 30, defaultValue: 8 }',
    '{ name: "lowTide", label: "Low Tide Height (ft)", type: "number", min: -5, max: 20, defaultValue: 2 }',
    '{ name: "hoursAfterHigh", label: "Hours After High Tide", type: "number", min: 0, max: 12, defaultValue: 3 }',
    '{ name: "tidalPeriod", label: "Tidal Period (hours)", type: "number", min: 6, max: 13, defaultValue: 12.42 }',
  ],
  `(inputs) => {
    const highTide = inputs.highTide as number;
    const lowTide = inputs.lowTide as number;
    const hoursAfterHigh = inputs.hoursAfterHigh as number;
    const tidalPeriod = inputs.tidalPeriod as number;
    const range = highTide - lowTide;
    const midLevel = (highTide + lowTide) / 2;
    const angle = (2 * Math.PI * hoursAfterHigh) / tidalPeriod;
    const currentHeight = midLevel + (range / 2) * Math.cos(angle);
    return {
      primary: { label: "Current Tide Height", value: formatNumber(currentHeight) + " ft" },
      details: [
        { label: "Tidal Range", value: formatNumber(range) + " ft" },
        { label: "Mid Tide Level", value: formatNumber(midLevel) + " ft" },
        { label: "Hours After High", value: formatNumber(hoursAfterHigh) + " hrs" }
      ]
    };
  }`,
  [
    { q: "How long is a tidal cycle?", a: "A typical semidiurnal tidal cycle is about 12 hours 25 minutes." },
    { q: "What is tidal range?", a: "Tidal range is the height difference between high and low tide." }
  ],
  "Height = MidLevel + (Range / 2) x cos(2 x pi x Hours / Period)",
  ["true-wind-calculator", "chart-distance-calculator"]
);

add(
  "chart-distance-calculator",
  "Chart Distance Calculator",
  "Calculate nautical distance from chart measurements.",
  "Science",
  "science",
  "A",
  ["chart", "distance", "nautical", "navigation"],
  [
    '{ name: "chartDist", label: "Chart Distance (cm)", type: "number", min: 0.1, max: 100, defaultValue: 5 }',
    '{ name: "scale", label: "Chart Scale (1:N)", type: "number", min: 1000, max: 10000000, defaultValue: 50000 }',
  ],
  `(inputs) => {
    const chartDist = inputs.chartDist as number;
    const scale = inputs.scale as number;
    const realCm = chartDist * scale;
    const realKm = realCm / 100000;
    const nauticalMiles = realKm / 1.852;
    return {
      primary: { label: "Nautical Miles", value: formatNumber(nauticalMiles) + " NM" },
      details: [
        { label: "Real Distance", value: formatNumber(realKm) + " km" },
        { label: "Chart Scale", value: "1:" + formatNumber(scale) },
        { label: "Chart Measurement", value: formatNumber(chartDist) + " cm" }
      ]
    };
  }`,
  [
    { q: "How do I measure distance on a nautical chart?", a: "Measure with dividers and compare to the latitude scale." },
    { q: "What scale are most coastal charts?", a: "Coastal charts are typically 1:40000 to 1:80000 scale." }
  ],
  "Real Distance = Chart Distance x Scale; NM = km / 1.852",
  ["nautical-mile-converter-calculator", "tidal-range-calculator"]
);

add(
  "fuel-range-calculator",
  "Fuel Range Calculator",
  "Estimate how far a boat can travel on available fuel.",
  "Science",
  "science",
  "A",
  ["fuel", "range", "boat", "marine"],
  [
    '{ name: "fuelCapacity", label: "Fuel Capacity (gal)", type: "number", min: 1, max: 10000, defaultValue: 150 }',
    '{ name: "burnRate", label: "Fuel Burn Rate (gal/hr)", type: "number", min: 0.5, max: 500, defaultValue: 12 }',
    '{ name: "cruiseSpeed", label: "Cruise Speed (kts)", type: "number", min: 1, max: 50, defaultValue: 18 }',
    '{ name: "reserve", label: "Reserve Fuel (%)", type: "number", min: 0, max: 50, defaultValue: 10 }',
  ],
  `(inputs) => {
    const fuelCapacity = inputs.fuelCapacity as number;
    const burnRate = inputs.burnRate as number;
    const cruiseSpeed = inputs.cruiseSpeed as number;
    const reserve = inputs.reserve as number;
    const usableFuel = fuelCapacity * (1 - reserve / 100);
    const endurance = usableFuel / burnRate;
    const rangeNM = endurance * cruiseSpeed;
    return {
      primary: { label: "Maximum Range", value: formatNumber(rangeNM) + " NM" },
      details: [
        { label: "Usable Fuel", value: formatNumber(usableFuel) + " gal" },
        { label: "Endurance", value: formatNumber(endurance) + " hours" },
        { label: "Reserve Fuel", value: formatNumber(fuelCapacity - usableFuel) + " gal" }
      ]
    };
  }`,
  [
    { q: "How much fuel reserve should a boat carry?", a: "The rule of thirds says one third for out, one third back, one third reserve." },
    { q: "How is boat range calculated?", a: "Range equals endurance hours multiplied by cruise speed." }
  ],
  "Usable = Capacity x (1 - Reserve%); Range = (Usable / Burn Rate) x Speed",
  ["fuel-burn-rate-calculator", "nautical-mile-converter-calculator"]
);

add(
  "wind-chill-calculator",
  "Wind Chill Calculator",
  "Calculate wind chill temperature from air temp and wind speed.",
  "Science",
  "science",
  "A",
  ["wind", "chill", "temperature", "weather"],
  [
    '{ name: "temp", label: "Air Temperature (F)", type: "number", min: -50, max: 50, defaultValue: 20 }',
    '{ name: "windSpeed", label: "Wind Speed (mph)", type: "number", min: 3, max: 100, defaultValue: 15 }',
  ],
  `(inputs) => {
    const temp = inputs.temp as number;
    const windSpeed = inputs.windSpeed as number;
    const wc = 35.74 + 0.6215 * temp - 35.75 * Math.pow(windSpeed, 0.16) + 0.4275 * temp * Math.pow(windSpeed, 0.16);
    const frostbiteMin = windSpeed > 30 && temp < 0 ? 10 : windSpeed > 15 && temp < 0 ? 30 : 0;
    return {
      primary: { label: "Wind Chill", value: formatNumber(wc) + " F" },
      details: [
        { label: "Actual Temperature", value: formatNumber(temp) + " F" },
        { label: "Wind Speed", value: formatNumber(windSpeed) + " mph" },
        { label: "Frostbite Risk (min)", value: frostbiteMin > 0 ? formatNumber(frostbiteMin) + " min" : "Low risk" }
      ]
    };
  }`,
  [
    { q: "When does wind chill apply?", a: "Wind chill applies when temperature is below 50 F and wind exceeds 3 mph." },
    { q: "At what wind chill is frostbite a risk?", a: "Frostbite can occur in 30 minutes at wind chill below minus 18 F." }
  ],
  "WC = 35.74 + 0.6215T - 35.75V^0.16 + 0.4275TV^0.16",
  ["heat-index-calculator", "dew-point-calculator"]
);

add(
  "heat-index-calculator",
  "Heat Index Calculator",
  "Calculate the heat index from temperature and humidity.",
  "Science",
  "science",
  "A",
  ["heat", "index", "humidity", "temperature"],
  [
    '{ name: "temp", label: "Air Temperature (F)", type: "number", min: 75, max: 130, defaultValue: 90 }',
    '{ name: "humidity", label: "Relative Humidity (%)", type: "number", min: 10, max: 100, defaultValue: 60 }',
  ],
  `(inputs) => {
    const temp = inputs.temp as number;
    const humidity = inputs.humidity as number;
    const hi = -42.379 + 2.04901523 * temp + 10.14333127 * humidity - 0.22475541 * temp * humidity - 0.00683783 * temp * temp - 0.05481717 * humidity * humidity + 0.00122874 * temp * temp * humidity + 0.00085282 * temp * humidity * humidity - 0.00000199 * temp * temp * humidity * humidity;
    const danger = hi >= 130 ? "Extreme Danger" : hi >= 105 ? "Danger" : hi >= 90 ? "Extreme Caution" : "Caution";
    return {
      primary: { label: "Heat Index", value: formatNumber(hi) + " F" },
      details: [
        { label: "Danger Level", value: danger },
        { label: "Air Temperature", value: formatNumber(temp) + " F" },
        { label: "Relative Humidity", value: formatNumber(humidity) + "%" }
      ]
    };
  }`,
  [
    { q: "What is the heat index?", a: "It is the perceived temperature combining heat and humidity." },
    { q: "When is heat index dangerous?", a: "A heat index above 105 F poses danger of heat exhaustion." }
  ],
  "Rothfusz regression equation for heat index",
  ["wind-chill-calculator", "dew-point-calculator"]
);

add(
  "dew-point-calculator",
  "Dew Point Calculator",
  "Calculate the dew point from temperature and humidity.",
  "Science",
  "science",
  "A",
  ["dew", "point", "humidity", "condensation"],
  [
    '{ name: "temp", label: "Air Temperature (C)", type: "number", min: -20, max: 50, defaultValue: 25 }',
    '{ name: "humidity", label: "Relative Humidity (%)", type: "number", min: 5, max: 100, defaultValue: 60 }',
  ],
  `(inputs) => {
    const temp = inputs.temp as number;
    const humidity = inputs.humidity as number;
    const a = 17.27;
    const b = 237.7;
    const gamma = (a * temp) / (b + temp) + Math.log(humidity / 100);
    const dewPoint = (b * gamma) / (a - gamma);
    const spread = temp - dewPoint;
    return {
      primary: { label: "Dew Point", value: formatNumber(dewPoint) + " C" },
      details: [
        { label: "Temperature", value: formatNumber(temp) + " C" },
        { label: "Relative Humidity", value: formatNumber(humidity) + "%" },
        { label: "Temp-Dew Spread", value: formatNumber(spread) + " C" }
      ]
    };
  }`,
  [
    { q: "What is the dew point?", a: "It is the temperature at which air becomes saturated and dew forms." },
    { q: "What dew point is comfortable?", a: "A dew point below 15 C (60 F) feels comfortable to most people." }
  ],
  "Dew Point = 237.7 x gamma / (17.27 - gamma); Magnus formula",
  ["heat-index-calculator", "wind-chill-calculator"]
);

add(
  "barometric-pressure-altitude-calculator",
  "Barometric Pressure Altitude Calculator",
  "Estimate atmospheric pressure at a given altitude.",
  "Science",
  "science",
  "A",
  ["barometric", "pressure", "altitude", "atmosphere"],
  [
    '{ name: "altitude", label: "Altitude (ft)", type: "number", min: 0, max: 60000, defaultValue: 5000 }',
    '{ name: "seaLevelPressure", label: "Sea Level Pressure (inHg)", type: "number", min: 28, max: 31, defaultValue: 29.92 }',
  ],
  `(inputs) => {
    const altitude = inputs.altitude as number;
    const seaLevelPressure = inputs.seaLevelPressure as number;
    const pressureRatio = Math.pow(1 - altitude / 145442, 5.2559);
    const pressure = seaLevelPressure * pressureRatio;
    const pressureMb = pressure * 33.8639;
    return {
      primary: { label: "Pressure at Altitude", value: formatNumber(pressure) + " inHg" },
      details: [
        { label: "Pressure in Millibars", value: formatNumber(pressureMb) + " mb" },
        { label: "Altitude", value: formatNumber(altitude) + " ft" },
        { label: "Sea Level Pressure", value: formatNumber(seaLevelPressure) + " inHg" }
      ]
    };
  }`,
  [
    { q: "How does pressure change with altitude?", a: "Pressure decreases about 1 inHg per 1000 feet near sea level." },
    { q: "What is standard sea level pressure?", a: "Standard sea level pressure is 29.92 inHg or 1013.25 mb." }
  ],
  "Pressure = Sea Level x (1 - Altitude / 145442)^5.2559",
  ["density-altitude-calculator", "dew-point-calculator"]
);

add(
  "uv-exposure-calculator",
  "UV Exposure Calculator",
  "Estimate safe sun exposure time based on UV index and skin type.",
  "Health",
  "health",
  "H",
  ["UV", "exposure", "sunburn", "skin"],
  [
    '{ name: "uvIndex", label: "UV Index", type: "number", min: 1, max: 15, defaultValue: 7 }',
    '{ name: "skinType", label: "Skin Type", type: "select", options: [{ value: "1", label: "Very Fair" }, { value: "2", label: "Fair" }, { value: "3", label: "Medium" }, { value: "4", label: "Olive" }, { value: "5", label: "Brown" }, { value: "6", label: "Dark" }], defaultValue: "2" }',
    '{ name: "spf", label: "Sunscreen SPF", type: "number", min: 0, max: 100, defaultValue: 30 }',
  ],
  `(inputs) => {
    const uvIndex = inputs.uvIndex as number;
    const skinType = inputs.skinType as number;
    const spf = inputs.spf as number;
    const baseMED = { 1: 15, 2: 25, 3: 35, 4: 45, 5: 60, 6: 90 };
    const baseMinutes = (baseMED[skinType] || 25) * 10 / uvIndex;
    const protectedMinutes = spf > 0 ? baseMinutes * spf : baseMinutes;
    const cappedProtected = Math.min(protectedMinutes, 480);
    return {
      primary: { label: "Safe Exposure (No SPF)", value: formatNumber(baseMinutes) + " min" },
      details: [
        { label: "With SPF " + spf, value: formatNumber(cappedProtected) + " min" },
        { label: "UV Index", value: formatNumber(uvIndex) },
        { label: "Skin Type", value: formatNumber(skinType) }
      ]
    };
  }`,
  [
    { q: "What UV index requires sunscreen?", a: "Apply sunscreen when the UV index is 3 or higher." },
    { q: "How does SPF extend safe exposure?", a: "SPF 30 means you can stay 30 times longer than without it." }
  ],
  "Base Minutes = Skin MED x 10 / UV Index; Protected = Base x SPF",
  ["heat-index-calculator", "wind-chill-calculator"]
);

add(
  "rainfall-intensity-calculator",
  "Rainfall Intensity Calculator",
  "Calculate rainfall rate from total amount and duration.",
  "Science",
  "science",
  "A",
  ["rainfall", "intensity", "precipitation", "rate"],
  [
    '{ name: "totalRain", label: "Total Rainfall (inches)", type: "number", min: 0.01, max: 30, defaultValue: 1.5 }',
    '{ name: "duration", label: "Duration (hours)", type: "number", min: 0.1, max: 72, defaultValue: 3 }',
  ],
  `(inputs) => {
    const totalRain = inputs.totalRain as number;
    const duration = inputs.duration as number;
    const ratePerHour = totalRain / duration;
    const rateMm = ratePerHour * 25.4;
    const category = ratePerHour >= 2 ? "Violent" : ratePerHour >= 0.3 ? "Heavy" : ratePerHour >= 0.1 ? "Moderate" : "Light";
    return {
      primary: { label: "Rainfall Rate", value: formatNumber(ratePerHour) + " in/hr" },
      details: [
        { label: "Rate in mm/hr", value: formatNumber(rateMm) + " mm/hr" },
        { label: "Intensity Category", value: category },
        { label: "Total Rainfall", value: formatNumber(totalRain) + " in" }
      ]
    };
  }`,
  [
    { q: "What is heavy rainfall?", a: "Heavy rainfall is generally above 0.3 inches per hour." },
    { q: "How is rainfall measured?", a: "Rainfall is measured in inches or millimeters of accumulated water." }
  ],
  "Rate = Total Rainfall / Duration",
  ["dew-point-calculator", "snow-load-calculator"]
);

add(
  "snow-load-calculator",
  "Snow Load Calculator",
  "Estimate the weight of snow on a roof surface.",
  "Science",
  "science",
  "A",
  ["snow", "load", "roof", "weight"],
  [
    '{ name: "roofArea", label: "Roof Area (sq ft)", type: "number", min: 100, max: 10000, defaultValue: 1500 }',
    '{ name: "snowDepth", label: "Snow Depth (inches)", type: "number", min: 1, max: 72, defaultValue: 12 }',
    '{ name: "snowType", label: "Snow Type", type: "select", options: [{ value: "1", label: "Fresh (light)" }, { value: "2", label: "Packed" }, { value: "3", label: "Wet / Heavy" }], defaultValue: "2" }',
  ],
  `(inputs) => {
    const roofArea = inputs.roofArea as number;
    const snowDepth = inputs.snowDepth as number;
    const snowType = inputs.snowType as number;
    const densityPSF = { 1: 1.25, 2: 3.0, 3: 5.2 };
    const psfPerInch = densityPSF[snowType] || 3.0;
    const loadPSF = psfPerInch * snowDepth;
    const totalWeight = loadPSF * roofArea;
    return {
      primary: { label: "Snow Load", value: formatNumber(loadPSF) + " psf" },
      details: [
        { label: "Total Roof Weight", value: formatNumber(totalWeight) + " lbs" },
        { label: "Roof Area", value: formatNumber(roofArea) + " sq ft" },
        { label: "Snow Depth", value: formatNumber(snowDepth) + " in" }
      ]
    };
  }`,
  [
    { q: "How heavy is snow on a roof?", a: "Fresh snow weighs about 1.25 psf per inch of depth." },
    { q: "When should I remove roof snow?", a: "Consider removal when snow load exceeds 20 to 25 psf." }
  ],
  "Load (psf) = Density per Inch x Snow Depth; Total = Load x Roof Area",
  ["rainfall-intensity-calculator", "wind-chill-calculator"]
);

add(
  "telescope-magnification-calculator",
  "Telescope Magnification Calculator",
  "Calculate telescope magnification from focal lengths.",
  "Science",
  "science",
  "A",
  ["telescope", "magnification", "focal", "eyepiece"],
  [
    '{ name: "focalLengthScope", label: "Telescope Focal Length (mm)", type: "number", min: 100, max: 10000, defaultValue: 1200 }',
    '{ name: "focalLengthEyepiece", label: "Eyepiece Focal Length (mm)", type: "number", min: 2, max: 60, defaultValue: 25 }',
    '{ name: "aperture", label: "Aperture (mm)", type: "number", min: 25, max: 500, defaultValue: 150 }',
  ],
  `(inputs) => {
    const focalLengthScope = inputs.focalLengthScope as number;
    const focalLengthEyepiece = inputs.focalLengthEyepiece as number;
    const aperture = inputs.aperture as number;
    const magnification = focalLengthScope / focalLengthEyepiece;
    const maxUsable = aperture * 2;
    const exitPupil = aperture / magnification;
    return {
      primary: { label: "Magnification", value: formatNumber(magnification) + "x" },
      details: [
        { label: "Max Usable Magnification", value: formatNumber(maxUsable) + "x" },
        { label: "Exit Pupil", value: formatNumber(exitPupil) + " mm" },
        { label: "Focal Ratio", value: "f/" + formatNumber(focalLengthScope / aperture) }
      ]
    };
  }`,
  [
    { q: "How is telescope magnification calculated?", a: "Divide telescope focal length by eyepiece focal length." },
    { q: "What is maximum useful magnification?", a: "Maximum useful magnification is about 2 times the aperture in mm." }
  ],
  "Magnification = Telescope Focal Length / Eyepiece Focal Length",
  ["telescope-fov-calculator", "star-magnitude-calculator"]
);

add(
  "telescope-fov-calculator",
  "Telescope FOV Calculator",
  "Calculate the field of view for a telescope and eyepiece.",
  "Science",
  "science",
  "A",
  ["telescope", "field", "view", "eyepiece"],
  [
    '{ name: "eyepieceFOV", label: "Eyepiece Apparent FOV (deg)", type: "number", min: 20, max: 120, defaultValue: 52 }',
    '{ name: "focalLengthScope", label: "Telescope Focal Length (mm)", type: "number", min: 100, max: 10000, defaultValue: 1200 }',
    '{ name: "focalLengthEyepiece", label: "Eyepiece Focal Length (mm)", type: "number", min: 2, max: 60, defaultValue: 25 }',
  ],
  `(inputs) => {
    const eyepieceFOV = inputs.eyepieceFOV as number;
    const focalLengthScope = inputs.focalLengthScope as number;
    const focalLengthEyepiece = inputs.focalLengthEyepiece as number;
    const magnification = focalLengthScope / focalLengthEyepiece;
    const trueFOV = eyepieceFOV / magnification;
    const arcminutes = trueFOV * 60;
    return {
      primary: { label: "True Field of View", value: formatNumber(trueFOV) + " degrees" },
      details: [
        { label: "True FOV in Arcminutes", value: formatNumber(arcminutes) + " arcmin" },
        { label: "Magnification", value: formatNumber(magnification) + "x" },
        { label: "Apparent FOV", value: formatNumber(eyepieceFOV) + " degrees" }
      ]
    };
  }`,
  [
    { q: "What is true field of view?", a: "True FOV is the actual sky area visible through the telescope." },
    { q: "How does magnification affect FOV?", a: "Higher magnification reduces the field of view proportionally." }
  ],
  "True FOV = Apparent FOV / Magnification",
  ["telescope-magnification-calculator", "star-magnitude-calculator"]
);

add(
  "star-magnitude-calculator",
  "Star Magnitude Calculator",
  "Convert between apparent and absolute stellar magnitudes.",
  "Science",
  "science",
  "A",
  ["star", "magnitude", "distance", "brightness"],
  [
    '{ name: "apparentMag", label: "Apparent Magnitude", type: "number", min: -30, max: 30, defaultValue: 1.5 }',
    '{ name: "distanceParsecs", label: "Distance (parsecs)", type: "number", min: 0.1, max: 100000, defaultValue: 100 }',
  ],
  `(inputs) => {
    const apparentMag = inputs.apparentMag as number;
    const distanceParsecs = inputs.distanceParsecs as number;
    const absoluteMag = apparentMag - 5 * Math.log10(distanceParsecs / 10);
    const distanceLY = distanceParsecs * 3.2616;
    const brightnessRatio = Math.pow(10, (apparentMag - absoluteMag) / -2.5);
    return {
      primary: { label: "Absolute Magnitude", value: formatNumber(absoluteMag) },
      details: [
        { label: "Apparent Magnitude", value: formatNumber(apparentMag) },
        { label: "Distance", value: formatNumber(distanceLY) + " light years" },
        { label: "Brightness Ratio", value: formatNumber(brightnessRatio) }
      ]
    };
  }`,
  [
    { q: "What is absolute magnitude?", a: "It is a star brightness measured as if it were 10 parsecs away." },
    { q: "What is a parsec?", a: "A parsec is about 3.26 light years or 3.09 x 10^13 km." }
  ],
  "M = m - 5 x log10(d / 10); distance modulus formula",
  ["telescope-magnification-calculator", "light-year-distance-calculator"]
);

add(
  "orbital-velocity-calculator",
  "Orbital Velocity Calculator",
  "Calculate orbital speed at a given altitude above Earth.",
  "Science",
  "science",
  "A",
  ["orbital", "velocity", "satellite", "space"],
  [
    '{ name: "altitude", label: "Orbital Altitude (km)", type: "number", min: 100, max: 100000, defaultValue: 400 }',
  ],
  `(inputs) => {
    const altitude = inputs.altitude as number;
    const earthRadius = 6371;
    const mu = 398600.4418;
    const r = earthRadius + altitude;
    const velocity = Math.sqrt(mu / r);
    const periodSeconds = 2 * Math.PI * r / velocity;
    const periodMinutes = periodSeconds / 60;
    return {
      primary: { label: "Orbital Velocity", value: formatNumber(velocity) + " km/s" },
      details: [
        { label: "Orbital Radius", value: formatNumber(r) + " km" },
        { label: "Orbital Period", value: formatNumber(periodMinutes) + " min" },
        { label: "Altitude", value: formatNumber(altitude) + " km" }
      ]
    };
  }`,
  [
    { q: "What is orbital velocity?", a: "It is the speed needed to maintain a stable orbit at a given altitude." },
    { q: "What is the ISS orbital speed?", a: "The ISS orbits at about 7.66 km/s at 400 km altitude." }
  ],
  "v = sqrt(GM / r); Period = 2 x pi x r / v",
  ["planetary-weight-calculator", "light-year-distance-calculator"]
);

add(
  "light-year-distance-calculator",
  "Light Year Distance Calculator",
  "Convert light years to kilometers and other distance units.",
  "Conversion",
  "conversion",
  "R",
  ["light", "year", "distance", "astronomy"],
  [
    '{ name: "lightYears", label: "Light Years", type: "number", min: 0.001, max: 100000, defaultValue: 4.24 }',
  ],
  `(inputs) => {
    const lightYears = inputs.lightYears as number;
    const km = lightYears * 9.461e12;
    const au = lightYears * 63241.1;
    const parsecs = lightYears / 3.2616;
    return {
      primary: { label: "Distance in km", value: formatNumber(km) + " km" },
      details: [
        { label: "Astronomical Units", value: formatNumber(au) + " AU" },
        { label: "Parsecs", value: formatNumber(parsecs) + " pc" },
        { label: "Light Years", value: formatNumber(lightYears) + " ly" }
      ]
    };
  }`,
  [
    { q: "How far is one light year?", a: "One light year is about 9.461 trillion kilometers." },
    { q: "What is the nearest star?", a: "Proxima Centauri is about 4.24 light years from Earth." }
  ],
  "km = Light Years x 9.461 x 10^12; AU = Light Years x 63241.1",
  ["star-magnitude-calculator", "orbital-velocity-calculator"]
);

add(
  "planetary-weight-calculator",
  "Planetary Weight Calculator",
  "Calculate your weight on other planets in the solar system.",
  "Science",
  "science",
  "A",
  ["planetary", "weight", "gravity", "planets"],
  [
    '{ name: "earthWeight", label: "Earth Weight (lbs)", type: "number", min: 1, max: 1000, defaultValue: 150 }',
    '{ name: "planet", label: "Planet", type: "select", options: [{ value: "1", label: "Mercury" }, { value: "2", label: "Venus" }, { value: "3", label: "Mars" }, { value: "4", label: "Jupiter" }, { value: "5", label: "Saturn" }, { value: "6", label: "Uranus" }, { value: "7", label: "Neptune" }, { value: "8", label: "Moon" }], defaultValue: "3" }',
  ],
  `(inputs) => {
    const earthWeight = inputs.earthWeight as number;
    const planet = inputs.planet as number;
    const gravity = { 1: 0.378, 2: 0.907, 3: 0.377, 4: 2.36, 5: 0.916, 6: 0.889, 7: 1.12, 8: 0.166 };
    const names = { 1: "Mercury", 2: "Venus", 3: "Mars", 4: "Jupiter", 5: "Saturn", 6: "Uranus", 7: "Neptune", 8: "Moon" };
    const g = gravity[planet] || 1;
    const planetName = names[planet] || "Unknown";
    const newWeight = earthWeight * g;
    const mass = earthWeight / 32.174;
    return {
      primary: { label: "Weight on " + planetName, value: formatNumber(newWeight) + " lbs" },
      details: [
        { label: "Earth Weight", value: formatNumber(earthWeight) + " lbs" },
        { label: "Surface Gravity Factor", value: formatNumber(g) },
        { label: "Your Mass", value: formatNumber(mass) + " slugs" }
      ]
    };
  }`,
  [
    { q: "Where would I weigh the most?", a: "You would weigh the most on Jupiter at 2.36 times Earth weight." },
    { q: "Does your mass change on other planets?", a: "No. Mass stays the same but weight changes with gravity." }
  ],
  "Weight on Planet = Earth Weight x Surface Gravity Factor",
  ["orbital-velocity-calculator", "light-year-distance-calculator"]
);
add('gaming-pc-wattage-calculator', 'Gaming PC Wattage Calculator',
  'Estimate total power supply wattage needed for a PC build.',
  'Science', 'science', 'A',
  ['PC wattage', 'power supply calculator'],
  [
    '{ name: "cpuTdp", label: "CPU TDP (W)", type: "number", min: 15, max: 500, defaultValue: 125 }',
    '{ name: "gpuTdp", label: "GPU TDP (W)", type: "number", min: 30, max: 700, defaultValue: 300 }',
    '{ name: "ramSticks", label: "RAM Sticks", type: "number", min: 1, max: 8, defaultValue: 2 }',
    '{ name: "storageDevices", label: "Storage Devices", type: "number", min: 1, max: 10, defaultValue: 2 }',
    '{ name: "fans", label: "Case Fans", type: "number", min: 1, max: 12, defaultValue: 4 }',
  ],
  `(inputs) => {
      const cpu = inputs.cpuTdp as number;
      const gpu = inputs.gpuTdp as number;
      const ram = inputs.ramSticks as number;
      const stor = inputs.storageDevices as number;
      const fans = inputs.fans as number;
      if (!cpu || !gpu) return null;
      const ramW = ram * 5;
      const storW = stor * 10;
      const fanW = fans * 3;
      const mobo = 80;
      const total = cpu + gpu + ramW + storW + fanW + mobo;
      const recommended = Math.ceil(total * 1.25 / 50) * 50;
      return {
        primary: { label: "Recommended PSU", value: formatNumber(recommended) + " W" },
        details: [
          { label: "Estimated Draw", value: formatNumber(total) + " W" },
          { label: "CPU + GPU", value: formatNumber(cpu + gpu) + " W" },
          { label: "Other Components", value: formatNumber(ramW + storW + fanW + mobo) + " W" },
        ],
      };
  }`,
  [{ q: 'How much headroom should a PSU have?', a: 'A 20% to 25% buffer above peak draw is recommended.' },
   { q: 'Does a bigger PSU use more power?', a: 'No. The PSU only draws what components need.' }],
  'Recommended PSU = Total Draw x 1.25 rounded to nearest 50',
  []
);

add('monitor-ppi-calculator', 'Monitor PPI Calculator',
  'Calculate pixels per inch from screen size and resolution.',
  'Science', 'science', 'A',
  ['monitor PPI', 'pixel density calculator'],
  [
    '{ name: "hRes", label: "Horizontal Resolution (px)", type: "number", min: 640, max: 15360, defaultValue: 2560 }',
    '{ name: "vRes", label: "Vertical Resolution (px)", type: "number", min: 480, max: 8640, defaultValue: 1440 }',
    '{ name: "diagSize", label: "Screen Diagonal (in)", type: "number", min: 5, max: 120, defaultValue: 27 }',
  ],
  `(inputs) => {
      const h = inputs.hRes as number;
      const v = inputs.vRes as number;
      const d = inputs.diagSize as number;
      if (!h || !v || !d) return null;
      const diagPx = Math.sqrt(h * h + v * v);
      const ppi = Math.round(diagPx / d * 100) / 100;
      const totalPx = h * v;
      return {
        primary: { label: "Pixels Per Inch", value: formatNumber(ppi) + " PPI" },
        details: [
          { label: "Diagonal Pixels", value: formatNumber(Math.round(diagPx)) + " px" },
          { label: "Total Pixels", value: formatNumber(totalPx) },
          { label: "Aspect Ratio", value: h + ":" + v },
        ],
      };
  }`,
  [{ q: 'What PPI is considered sharp?', a: 'Above 110 PPI is sharp at typical desk distance.' },
   { q: 'Does higher PPI mean better image?', a: 'Yes, higher PPI gives finer detail and smoother text.' }],
  'PPI = sqrt(H^2 + V^2) / Diagonal Size',
  []
);

add('gaming-fps-calculator', 'Gaming FPS Calculator',
  'Estimate frames per second from GPU and CPU specs.',
  'Science', 'science', 'A',
  ['gaming FPS', 'frame rate estimator'],
  [
    '{ name: "gpuScore", label: "GPU Benchmark Score", type: "number", min: 1000, max: 50000, defaultValue: 15000 }',
    '{ name: "cpuScore", label: "CPU Benchmark Score", type: "number", min: 500, max: 20000, defaultValue: 8000 }',
    '{ name: "resolution", label: "Resolution", type: "select", options: [{ value: "1", label: "1080p" }, { value: "1.8", label: "1440p" }, { value: "4", label: "4K" }], defaultValue: "1" }',
    '{ name: "quality", label: "Quality Preset", type: "select", options: [{ value: "0.5", label: "Low" }, { value: "0.75", label: "Medium" }, { value: "1", label: "High" }, { value: "1.3", label: "Ultra" }], defaultValue: "1" }',
  ],
  `(inputs) => {
      const gpu = inputs.gpuScore as number;
      const cpu = inputs.cpuScore as number;
      const res = inputs.resolution as number;
      const qual = inputs.quality as number;
      if (!gpu || !cpu || !res || !qual) return null;
      const gpuFps = gpu / (res * qual * 100);
      const cpuFps = cpu / 40;
      const estFps = Math.round(Math.min(gpuFps, cpuFps));
      const bottleneck = gpuFps < cpuFps ? "GPU" : "CPU";
      return {
        primary: { label: "Estimated FPS", value: formatNumber(estFps) + " fps" },
        details: [
          { label: "GPU Limited FPS", value: formatNumber(Math.round(gpuFps)) + " fps" },
          { label: "CPU Limited FPS", value: formatNumber(Math.round(cpuFps)) + " fps" },
          { label: "Bottleneck", value: bottleneck },
        ],
      };
  }`,
  [{ q: 'What is a good FPS for gaming?', a: '60 FPS is smooth. 144 FPS is ideal for competitive play.' },
   { q: 'What causes low FPS?', a: 'Usually a weak GPU at high resolution or quality settings.' }],
  'Estimated FPS = min(GPU Score / (Res x Quality x 100), CPU Score / 40)',
  []
);

add('keyboard-switch-calculator', 'Keyboard Switch Calculator',
  'Calculate switches and stabilizers for a custom keyboard.',
  'Everyday', 'everyday', '~',
  ['keyboard switch', 'custom keyboard calculator'],
  [
    '{ name: "layout", label: "Layout Size", type: "select", options: [{ value: "61", label: "60% (61 keys)" }, { value: "68", label: "65% (68 keys)" }, { value: "75", label: "75% (75 keys)" }, { value: "87", label: "TKL (87 keys)" }, { value: "104", label: "Full (104 keys)" }], defaultValue: "87" }',
    '{ name: "switchPrice", label: "Price Per Switch (cents)", type: "number", min: 1, max: 500, defaultValue: 50 }',
    '{ name: "extraPct", label: "Extra Switches (%)", type: "number", min: 0, max: 50, defaultValue: 10 }',
  ],
  `(inputs) => {
      const keys = inputs.layout as number;
      const price = inputs.switchPrice as number;
      const extra = inputs.extraPct as number;
      if (!keys || !price) return null;
      const totalSwitches = Math.ceil(keys * (1 + extra / 100));
      const cost = Math.round(totalSwitches * price) / 100;
      const stabs = keys >= 100 ? 7 : keys >= 80 ? 5 : 4;
      return {
        primary: { label: "Switches Needed", value: formatNumber(totalSwitches) },
        details: [
          { label: "Base Keys", value: formatNumber(keys) },
          { label: "Switch Cost", value: "$" + formatNumber(cost) },
          { label: "Stabilizers Needed", value: formatNumber(stabs) },
        ],
      };
  }`,
  [{ q: 'How many extra switches should I order?', a: 'Order 10% extra for spares and replacements.' },
   { q: 'What are stabilizers for?', a: 'Stabilizers support wider keys like spacebar and shift.' }],
  'Switches = Keys x (1 + Extra%)',
  []
);

add('dice-probability-calculator', 'Dice Probability Calculator',
  'Calculate the probability of rolling a target sum with dice.',
  'Math', 'math', '+',
  ['dice probability', 'dice roll calculator'],
  [
    '{ name: "numDice", label: "Number of Dice", type: "number", min: 1, max: 10, defaultValue: 2 }',
    '{ name: "sides", label: "Sides Per Die", type: "number", min: 2, max: 100, defaultValue: 6 }',
    '{ name: "target", label: "Target Sum", type: "number", min: 1, max: 1000, defaultValue: 7 }',
  ],
  `(inputs) => {
      const n = inputs.numDice as number;
      const s = inputs.sides as number;
      const t = inputs.target as number;
      if (!n || !s || !t) return null;
      if (t < n || t > n * s) return { primary: { label: "Probability", value: "0%" }, details: [{ label: "Outcome", value: "Impossible with these dice" }] };
      const total = Math.pow(s, n);
      let ways = 0;
      for (let k = 0; k <= Math.floor((t - n) / s); k++) {
        const sign = k % 2 === 0 ? 1 : -1;
        let binom = 1;
        for (let i = 0; i < k; i++) { binom = binom * (n - i) / (i + 1); }
        let combo = 1;
        const val = t - 1 - k * s;
        for (let i = 0; i < n - 1; i++) { combo = combo * (val - i) / (i + 1); }
        ways += sign * binom * combo;
      }
      const prob = Math.round(ways / total * 10000) / 100;
      return {
        primary: { label: "Probability", value: prob + "%" },
        details: [
          { label: "Favorable Outcomes", value: formatNumber(Math.round(ways)) },
          { label: "Total Outcomes", value: formatNumber(total) },
          { label: "Odds", value: "1 in " + formatNumber(Math.round(total / Math.max(ways, 1))) },
        ],
      };
  }`,
  [{ q: 'What is the most common roll with 2d6?', a: 'A sum of 7 is the most common with a 16.67% chance.' },
   { q: 'How are dice probabilities calculated?', a: 'By counting favorable outcomes and dividing by total outcomes.' }],
  'P = favorable outcomes / total outcomes (s^n)',
  []
);

add('miniature-scale-calculator', 'Miniature Scale Calculator',
  'Convert real dimensions to scale model dimensions.',
  'Math', 'math', '+',
  ['miniature scale', 'scale model calculator'],
  [
    '{ name: "realSize", label: "Real Size (in)", type: "number", min: 0.1, max: 100000, defaultValue: 72 }',
    '{ name: "scaleRatio", label: "Scale Ratio (1:X)", type: "number", min: 1, max: 1000, defaultValue: 48 }',
  ],
  `(inputs) => {
      const real = inputs.realSize as number;
      const ratio = inputs.scaleRatio as number;
      if (!real || !ratio) return null;
      const model = Math.round(real / ratio * 1000) / 1000;
      const modelMm = Math.round(model * 25.4 * 100) / 100;
      const pct = Math.round(100 / ratio * 100) / 100;
      return {
        primary: { label: "Model Size", value: formatNumber(model) + " in" },
        details: [
          { label: "Model Size (mm)", value: formatNumber(modelMm) + " mm" },
          { label: "Scale Ratio", value: "1:" + formatNumber(ratio) },
          { label: "Scale Percentage", value: pct + "%" },
        ],
      };
  }`,
  [{ q: 'What does 1:48 scale mean?', a: 'It means the model is 48 times smaller than real life.' },
   { q: 'What is O scale for models?', a: 'O scale is 1:48 commonly used for toy trains and dioramas.' }],
  'Model Size = Real Size / Scale Ratio',
  []
);

add('model-train-scale-calculator', 'Model Train Scale Calculator',
  'Convert real train dimensions to model train scale.',
  'Math', 'math', '+',
  ['model train scale', 'train scale converter'],
  [
    '{ name: "realLength", label: "Real Length (ft)", type: "number", min: 1, max: 5000, defaultValue: 50 }',
    '{ name: "scale", label: "Scale", type: "select", options: [{ value: "220", label: "Z (1:220)" }, { value: "160", label: "N (1:160)" }, { value: "87", label: "HO (1:87)" }, { value: "48", label: "O (1:48)" }, { value: "29", label: "G (1:29)" }], defaultValue: "87" }',
  ],
  `(inputs) => {
      const real = inputs.realLength as number;
      const scale = inputs.scale as number;
      if (!real || !scale) return null;
      const modelIn = Math.round(real * 12 / scale * 100) / 100;
      const modelFt = Math.round(modelIn / 12 * 100) / 100;
      const modelCm = Math.round(modelIn * 2.54 * 100) / 100;
      return {
        primary: { label: "Model Length", value: formatNumber(modelIn) + " in" },
        details: [
          { label: "Model Length (ft)", value: formatNumber(modelFt) + " ft" },
          { label: "Model Length (cm)", value: formatNumber(modelCm) + " cm" },
          { label: "Scale Ratio", value: "1:" + formatNumber(scale) },
        ],
      };
  }`,
  [{ q: 'What is the most popular model train scale?', a: 'HO scale (1:87) is the most popular worldwide.' },
   { q: 'What scale is best for small spaces?', a: 'N scale (1:160) or Z scale (1:220) works well in tight spaces.' }],
  'Model Length = Real Length x 12 / Scale Ratio',
  []
);

add('origami-paper-size-calculator', 'Origami Paper Size Calculator',
  'Determine paper size needed for a desired origami model size.',
  'Math', 'math', '+',
  ['origami paper', 'paper size calculator'],
  [
    '{ name: "modelSize", label: "Desired Model Size (in)", type: "number", min: 0.5, max: 48, defaultValue: 6 }',
    '{ name: "complexity", label: "Model Complexity", type: "select", options: [{ value: "2.5", label: "Simple" }, { value: "3.5", label: "Moderate" }, { value: "5", label: "Complex" }, { value: "7", label: "Super Complex" }], defaultValue: "3.5" }',
  ],
  `(inputs) => {
      const model = inputs.modelSize as number;
      const ratio = inputs.complexity as number;
      if (!model || !ratio) return null;
      const paperSize = Math.round(model * ratio * 10) / 10;
      const paperCm = Math.round(paperSize * 2.54 * 10) / 10;
      const area = Math.round(paperSize * paperSize * 100) / 100;
      return {
        primary: { label: "Paper Size", value: formatNumber(paperSize) + " x " + formatNumber(paperSize) + " in" },
        details: [
          { label: "Paper Size (cm)", value: formatNumber(paperCm) + " x " + formatNumber(paperCm) + " cm" },
          { label: "Paper Area", value: formatNumber(area) + " sq in" },
          { label: "Model to Paper Ratio", value: "1:" + formatNumber(ratio) },
        ],
      };
  }`,
  [{ q: 'What size paper is standard for origami?', a: 'Standard origami paper is 6 x 6 inches or 15 x 15 cm.' },
   { q: 'Does thicker paper work for origami?', a: 'Thin paper is better for complex folds. Thick paper suits simple models.' }],
  'Paper Size = Desired Model Size x Complexity Ratio',
  []
);

add('aquaponics-sizing-calculator', 'Aquaponics Sizing Calculator',
  'Size grow beds and fish tanks for an aquaponics system.',
  'Science', 'science', 'A',
  ['aquaponics sizing', 'aquaponics system calculator'],
  [
    '{ name: "fishTankGal", label: "Fish Tank (gallons)", type: "number", min: 10, max: 5000, defaultValue: 200 }',
    '{ name: "fishPerGal", label: "Fish Per 10 Gallons", type: "number", min: 1, max: 10, defaultValue: 1 }',
    '{ name: "bedDepth", label: "Grow Bed Depth (in)", type: "number", min: 6, max: 24, defaultValue: 12 }',
  ],
  `(inputs) => {
      const tank = inputs.fishTankGal as number;
      const fpg = inputs.fishPerGal as number;
      const depth = inputs.bedDepth as number;
      if (!tank || !fpg || !depth) return null;
      const fish = Math.floor(tank / 10 * fpg);
      const bedVol = Math.round(tank * 1.5);
      const bedArea = Math.round(bedVol * 231 / depth);
      const bedSqFt = Math.round(bedArea / 144 * 10) / 10;
      return {
        primary: { label: "Grow Bed Area", value: formatNumber(bedSqFt) + " sq ft" },
        details: [
          { label: "Max Fish", value: formatNumber(fish) },
          { label: "Grow Bed Volume", value: formatNumber(bedVol) + " gal" },
          { label: "Bed Depth", value: formatNumber(depth) + " in" },
        ],
      };
  }`,
  [{ q: 'What is the ideal grow bed to tank ratio?', a: 'A 1:1 to 2:1 grow bed to fish tank ratio is ideal.' },
   { q: 'How many fish can an aquaponics system hold?', a: 'Typically 1 fish per 5 to 10 gallons of tank water.' }],
  'Grow Bed Area = (Tank Gallons x 1.5 x 231) / Depth / 144',
  []
);

add('hydroponics-nutrient-calculator', 'Hydroponics Nutrient Calculator',
  'Calculate nutrient solution concentrations for hydroponics.',
  'Science', 'science', 'A',
  ['hydroponics nutrient', 'nutrient solution calculator'],
  [
    '{ name: "reservoirGal", label: "Reservoir Size (gallons)", type: "number", min: 1, max: 1000, defaultValue: 20 }',
    '{ name: "targetPpm", label: "Target PPM", type: "number", min: 100, max: 2000, defaultValue: 800 }',
    '{ name: "currentPpm", label: "Current PPM", type: "number", min: 0, max: 2000, defaultValue: 200 }',
  ],
  `(inputs) => {
      const gal = inputs.reservoirGal as number;
      const target = inputs.targetPpm as number;
      const current = inputs.currentPpm as number;
      if (!gal || !target) return null;
      const needed = target - current;
      if (needed <= 0) return { primary: { label: "Status", value: "Already at or above target" }, details: [{ label: "Current PPM", value: formatNumber(current) }] };
      const liters = Math.round(gal * 3.785 * 100) / 100;
      const mlPerGal = Math.round(needed / 200 * 5 * 100) / 100;
      const totalMl = Math.round(mlPerGal * gal * 100) / 100;
      return {
        primary: { label: "Nutrient To Add", value: formatNumber(totalMl) + " mL" },
        details: [
          { label: "PPM Increase Needed", value: formatNumber(needed) + " ppm" },
          { label: "Reservoir Volume", value: formatNumber(liters) + " L" },
          { label: "mL Per Gallon", value: formatNumber(mlPerGal) + " mL/gal" },
        ],
      };
  }`,
  [{ q: 'What PPM is good for hydroponic lettuce?', a: 'Lettuce grows best at 560 to 840 PPM.' },
   { q: 'How often should I change nutrient solution?', a: 'Change the solution every 1 to 2 weeks for best results.' }],
  'Nutrient mL = (Target PPM - Current PPM) / 200 x 5 x Gallons',
  []
);

add('terrarium-size-calculator', 'Terrarium Size Calculator',
  'Determine terrarium dimensions for a reptile species.',
  'Everyday', 'everyday', '~',
  ['terrarium size', 'reptile enclosure calculator'],
  [
    '{ name: "reptileLength", label: "Reptile Length (in)", type: "number", min: 2, max: 120, defaultValue: 18 }',
    '{ name: "numAnimals", label: "Number of Animals", type: "number", min: 1, max: 5, defaultValue: 1 }',
    '{ name: "arboreal", label: "Arboreal?", type: "select", options: [{ value: "0", label: "No (Terrestrial)" }, { value: "1", label: "Yes (Arboreal)" }], defaultValue: "0" }',
  ],
  `(inputs) => {
      const len = inputs.reptileLength as number;
      const num = inputs.numAnimals as number;
      const arb = inputs.arboreal as number;
      if (!len || !num) return null;
      const baseLen = len * 2;
      const baseW = len * 1;
      const baseH = arb === 1 ? len * 2 : len * 1;
      const extra = (num - 1) * 0.5;
      const finalL = Math.round(baseLen * (1 + extra));
      const finalW = Math.round(baseW * (1 + extra * 0.5));
      const finalH = Math.round(baseH);
      const volGal = Math.round(finalL * finalW * finalH / 231 * 10) / 10;
      return {
        primary: { label: "Minimum Size", value: finalL + " x " + finalW + " x " + finalH + " in" },
        details: [
          { label: "Volume", value: formatNumber(volGal) + " gallons" },
          { label: "Type", value: arb === 1 ? "Arboreal (tall)" : "Terrestrial (long)" },
          { label: "Animals", value: formatNumber(num) },
        ],
      };
  }`,
  [{ q: 'How big should a terrarium be?', a: 'Minimum length should be twice the reptile body length.' },
   { q: 'Do arboreal reptiles need taller tanks?', a: 'Yes. Arboreal species need height equal to twice their length.' }],
  'Min Length = Reptile Length x 2; Height = Length x 2 if arboreal',
  []
);

add('bird-cage-size-calculator', 'Bird Cage Size Calculator',
  'Calculate minimum cage dimensions for a pet bird.',
  'Everyday', 'everyday', '~',
  ['bird cage size', 'birdcage calculator'],
  [
    '{ name: "wingspan", label: "Bird Wingspan (in)", type: "number", min: 4, max: 60, defaultValue: 12 }',
    '{ name: "numBirds", label: "Number of Birds", type: "number", min: 1, max: 10, defaultValue: 1 }',
    '{ name: "flighted", label: "Flighted?", type: "select", options: [{ value: "1.5", label: "Yes" }, { value: "1", label: "No (Clipped)" }], defaultValue: "1.5" }',
  ],
  `(inputs) => {
      const ws = inputs.wingspan as number;
      const num = inputs.numBirds as number;
      const flight = inputs.flighted as number;
      if (!ws || !num || !flight) return null;
      const minW = Math.round(ws * 2.5 * flight);
      const minD = Math.round(ws * 2 * flight);
      const minH = Math.round(ws * 3 * flight);
      const extra = num > 1 ? (num - 1) * 0.25 : 0;
      const finalW = Math.round(minW * (1 + extra));
      const finalD = Math.round(minD * (1 + extra));
      const finalH = minH;
      return {
        primary: { label: "Minimum Cage", value: finalW + " x " + finalD + " x " + finalH + " in" },
        details: [
          { label: "Width", value: formatNumber(finalW) + " in" },
          { label: "Depth", value: formatNumber(finalD) + " in" },
          { label: "Height", value: formatNumber(finalH) + " in" },
        ],
      };
  }`,
  [{ q: 'How big should a bird cage be?', a: 'Width should be at least 2.5 times the bird wingspan.' },
   { q: 'Should the cage be wide or tall?', a: 'Width is more important than height for most species.' }],
  'Min Width = Wingspan x 2.5 x Flight Factor',
  []
);

add('fish-stocking-calculator', 'Fish Stocking Calculator',
  'Calculate how many fish an aquarium can safely hold.',
  'Science', 'science', 'A',
  ['fish stocking', 'aquarium fish calculator'],
  [
    '{ name: "tankGal", label: "Tank Size (gallons)", type: "number", min: 1, max: 5000, defaultValue: 30 }',
    '{ name: "fishLength", label: "Avg Fish Length (in)", type: "number", min: 0.5, max: 36, defaultValue: 2 }',
    '{ name: "filterRating", label: "Filter Rating", type: "select", options: [{ value: "0.8", label: "Undersized" }, { value: "1", label: "Matched" }, { value: "1.3", label: "Oversized" }], defaultValue: "1" }',
  ],
  `(inputs) => {
      const tank = inputs.tankGal as number;
      const fish = inputs.fishLength as number;
      const filt = inputs.filterRating as number;
      if (!tank || !fish || !filt) return null;
      const maxFish = Math.floor(tank / fish * filt);
      const bioload = Math.round(maxFish * fish / tank * 100) / 100;
      const waterChange = bioload > 1.5 ? "25% weekly" : "20% bi-weekly";
      return {
        primary: { label: "Max Fish", value: formatNumber(maxFish) },
        details: [
          { label: "Rule", value: "1 inch of fish per gallon" },
          { label: "Bio Load Index", value: formatNumber(bioload) },
          { label: "Water Change", value: waterChange },
        ],
      };
  }`,
  [{ q: 'How many fish per gallon is safe?', a: 'The general rule is 1 inch of fish per gallon of water.' },
   { q: 'Does filtration affect stocking?', a: 'Yes. Oversized filters allow slightly higher stocking levels.' }],
  'Max Fish = Tank Gallons / Avg Fish Length x Filter Rating',
  []
);

add('sourdough-starter-calculator', 'Sourdough Starter Calculator',
  'Calculate flour and water amounts for sourdough starter.',
  'Everyday', 'everyday', '~',
  ['sourdough starter', 'starter feeding calculator'],
  [
    '{ name: "starterAmount", label: "Starter to Keep (g)", type: "number", min: 5, max: 500, defaultValue: 50 }',
    '{ name: "ratio", label: "Feed Ratio (1:X:X)", type: "select", options: [{ value: "1", label: "1:1:1" }, { value: "2", label: "1:2:2" }, { value: "5", label: "1:5:5" }, { value: "10", label: "1:10:10" }], defaultValue: "1" }',
  ],
  `(inputs) => {
      const starter = inputs.starterAmount as number;
      const ratio = inputs.ratio as number;
      if (!starter || !ratio) return null;
      const flour = starter * ratio;
      const water = starter * ratio;
      const total = starter + flour + water;
      const hydration = 100;
      return {
        primary: { label: "Total Starter", value: formatNumber(total) + " g" },
        details: [
          { label: "Flour to Add", value: formatNumber(flour) + " g" },
          { label: "Water to Add", value: formatNumber(water) + " g" },
          { label: "Hydration", value: hydration + "%" },
        ],
      };
  }`,
  [{ q: 'What ratio should I feed my starter?', a: 'Use 1:1:1 for daily feeding and 1:5:5 for less frequent feeding.' },
   { q: 'How much starter do I need to keep?', a: 'Keep 25 to 50 grams and discard the rest before feeding.' }],
  'Flour = Starter x Ratio; Water = Starter x Ratio',
  []
);

add('beer-abv-calculator', 'Beer ABV Calculator',
  'Calculate alcohol by volume from original and final gravity.',
  'Science', 'science', 'A',
  ['beer ABV', 'alcohol by volume calculator'],
  [
    '{ name: "og", label: "Original Gravity (OG)", type: "number", min: 1, max: 1.2, defaultValue: 1.05 }',
    '{ name: "fg", label: "Final Gravity (FG)", type: "number", min: 0.99, max: 1.1, defaultValue: 1.01 }',
  ],
  `(inputs) => {
      const og = inputs.og as number;
      const fg = inputs.fg as number;
      if (!og || !fg) return null;
      if (fg >= og) return { primary: { label: "Error", value: "FG must be less than OG" }, details: [] };
      const abv = Math.round((og - fg) * 131.25 * 100) / 100;
      const atten = Math.round((og - fg) / (og - 1) * 100 * 10) / 10;
      const calories = Math.round((1881.22 * (og - fg) + 3550 * fg * (og - fg) / (1.775 - og)) * fg / (100 * 3.55));
      return {
        primary: { label: "ABV", value: abv + "%" },
        details: [
          { label: "Apparent Attenuation", value: atten + "%" },
          { label: "Est. Calories (12 oz)", value: formatNumber(Math.abs(calories)) + " cal" },
          { label: "Gravity Drop", value: formatNumber(Math.round((og - fg) * 1000) / 1000) },
        ],
      };
  }`,
  [{ q: 'What is a normal beer ABV?', a: 'Most beers range from 4% to 6% ABV.' },
   { q: 'How is ABV calculated from gravity?', a: 'ABV = (OG - FG) x 131.25 is the standard formula.' }],
  'ABV = (OG - FG) x 131.25',
  []
);

add('wine-sulfite-calculator', 'Wine Sulfite Calculator',
  'Calculate sulfite additions for winemaking.',
  'Science', 'science', 'A',
  ['wine sulfite', 'SO2 addition calculator'],
  [
    '{ name: "volumeGal", label: "Wine Volume (gallons)", type: "number", min: 1, max: 1000, defaultValue: 6 }',
    '{ name: "currentSo2", label: "Current Free SO2 (ppm)", type: "number", min: 0, max: 100, defaultValue: 10 }',
    '{ name: "targetSo2", label: "Target Free SO2 (ppm)", type: "number", min: 10, max: 100, defaultValue: 35 }',
    '{ name: "ph", label: "Wine pH", type: "number", min: 2.8, max: 4.2, defaultValue: 3.4 }',
  ],
  `(inputs) => {
      const vol = inputs.volumeGal as number;
      const current = inputs.currentSo2 as number;
      const target = inputs.targetSo2 as number;
      const ph = inputs.ph as number;
      if (!vol || !target || !ph) return null;
      const needed = target - current;
      if (needed <= 0) return { primary: { label: "Status", value: "SO2 already at or above target" }, details: [] };
      const liters = vol * 3.785;
      const kmeta = Math.round(needed * liters / 570 * 100) / 100;
      const campden = Math.round(kmeta / 0.44 * 10) / 10;
      return {
        primary: { label: "Potassium Metabisulfite", value: formatNumber(kmeta) + " g" },
        details: [
          { label: "Campden Tablets", value: formatNumber(campden) + " tablets" },
          { label: "SO2 Increase", value: formatNumber(needed) + " ppm" },
          { label: "Wine pH", value: formatNumber(ph) },
        ],
      };
  }`,
  [{ q: 'What SO2 level is safe for wine?', a: 'Most wines need 25 to 50 ppm free SO2 for preservation.' },
   { q: 'Does pH affect sulfite needs?', a: 'Yes. Higher pH wines need more free SO2 for protection.' }],
  'KMeta (g) = (Target - Current) x Liters / 570',
  []
);

add('coffee-ratio-calculator', 'Coffee Ratio Calculator',
  'Calculate coffee grounds and water for the perfect brew.',
  'Everyday', 'everyday', '~',
  ['coffee ratio', 'coffee brewing calculator'],
  [
    '{ name: "cups", label: "Cups to Brew", type: "number", min: 1, max: 20, defaultValue: 4 }',
    '{ name: "cupSize", label: "Cup Size (oz)", type: "number", min: 4, max: 16, defaultValue: 6 }',
    '{ name: "strength", label: "Strength", type: "select", options: [{ value: "18", label: "Mild (1:18)" }, { value: "16", label: "Medium (1:16)" }, { value: "14", label: "Strong (1:14)" }, { value: "12", label: "Extra Strong (1:12)" }], defaultValue: "16" }',
  ],
  `(inputs) => {
      const cups = inputs.cups as number;
      const size = inputs.cupSize as number;
      const ratio = inputs.strength as number;
      if (!cups || !size || !ratio) return null;
      const totalOz = cups * size;
      const waterMl = Math.round(totalOz * 29.574);
      const coffeeG = Math.round(waterMl / ratio * 10) / 10;
      const tbsp = Math.round(coffeeG / 5 * 10) / 10;
      return {
        primary: { label: "Coffee Needed", value: formatNumber(coffeeG) + " g" },
        details: [
          { label: "Tablespoons", value: formatNumber(tbsp) + " tbsp" },
          { label: "Water", value: formatNumber(waterMl) + " mL" },
          { label: "Ratio", value: "1:" + formatNumber(ratio) },
        ],
      };
  }`,
  [{ q: 'What is the golden ratio for coffee?', a: 'The golden ratio is 1:16 or about 1 gram per 16 mL of water.' },
   { q: 'How many tablespoons per cup?', a: 'About 2 tablespoons of ground coffee per 6 oz cup.' }],
  'Coffee (g) = Water (mL) / Ratio',
  []
);

add('tea-brewing-calculator', 'Tea Brewing Calculator',
  'Calculate tea amount and steeping time for your cup.',
  'Everyday', 'everyday', '~',
  ['tea brewing', 'tea steeping calculator'],
  [
    '{ name: "waterOz", label: "Water Amount (oz)", type: "number", min: 4, max: 128, defaultValue: 8 }',
    '{ name: "teaType", label: "Tea Type", type: "select", options: [{ value: "1", label: "Green" }, { value: "2", label: "Black" }, { value: "3", label: "Oolong" }, { value: "4", label: "White" }, { value: "5", label: "Herbal" }], defaultValue: "2" }',
  ],
  `(inputs) => {
      const oz = inputs.waterOz as number;
      const t = inputs.teaType as number;
      if (!oz || !t) return null;
      const temps = [175, 212, 195, 160, 212];
      const times = [2, 4, 3, 3, 5];
      const gPer8oz = [2, 2.5, 2.5, 2, 2];
      const idx = t - 1;
      const teaG = Math.round(gPer8oz[idx] * oz / 8 * 10) / 10;
      const tsp = Math.round(teaG / 2.5 * 10) / 10;
      return {
        primary: { label: "Tea Amount", value: formatNumber(teaG) + " g" },
        details: [
          { label: "Teaspoons", value: formatNumber(tsp) + " tsp" },
          { label: "Water Temperature", value: temps[idx] + " F" },
          { label: "Steep Time", value: times[idx] + " minutes" },
        ],
      };
  }`,
  [{ q: 'How much tea per cup?', a: 'Use about 2 to 2.5 grams of loose tea per 8 oz of water.' },
   { q: 'Does water temperature matter for tea?', a: 'Yes. Green tea needs cooler water and black tea needs boiling.' }],
  'Tea (g) = grams per 8 oz x Water oz / 8',
  []
);

add('kombucha-brewing-calculator', 'Kombucha Brewing Calculator',
  'Calculate ingredients for a batch of kombucha.',
  'Everyday', 'everyday', '~',
  ['kombucha brewing', 'kombucha recipe calculator'],
  [
    '{ name: "batchSize", label: "Batch Size (gallons)", type: "number", min: 0.5, max: 20, defaultValue: 1 }',
    '{ name: "teaType", label: "Tea Type", type: "select", options: [{ value: "1", label: "Black Tea" }, { value: "2", label: "Green Tea" }, { value: "3", label: "Mixed" }], defaultValue: "1" }',
  ],
  `(inputs) => {
      const gal = inputs.batchSize as number;
      const tea = inputs.teaType as number;
      if (!gal || !tea) return null;
      const waterCups = Math.round(gal * 16);
      const sugarCups = Math.round(gal * 1 * 10) / 10;
      const teaBags = Math.round(gal * 8);
      const starterOz = Math.round(gal * 16);
      const fermentDays = tea === 2 ? "5 to 7" : "7 to 14";
      return {
        primary: { label: "Sugar", value: formatNumber(sugarCups) + " cups" },
        details: [
          { label: "Water", value: formatNumber(waterCups) + " cups" },
          { label: "Tea Bags", value: formatNumber(teaBags) },
          { label: "Starter Liquid", value: formatNumber(starterOz) + " oz" },
          { label: "Ferment Time", value: fermentDays + " days" },
        ],
      };
  }`,
  [{ q: 'How much sugar does kombucha need?', a: 'Use about 1 cup of sugar per gallon. The SCOBY consumes most of it.' },
   { q: 'How long does kombucha take to ferment?', a: 'First fermentation takes 7 to 14 days at room temperature.' }],
  'Sugar = 1 cup per gallon; Tea Bags = 8 per gallon',
  []
);

add('essential-oil-dilution-calculator', 'Essential Oil Dilution Calculator',
  'Calculate carrier oil and drops for safe essential oil dilution.',
  'Health', 'health', 'H',
  ['essential oil dilution', 'oil dilution calculator'],
  [
    '{ name: "carrierMl", label: "Carrier Oil (mL)", type: "number", min: 5, max: 500, defaultValue: 30 }',
    '{ name: "dilutionPct", label: "Dilution (%)", type: "select", options: [{ value: "1", label: "1% (Sensitive Skin)" }, { value: "2", label: "2% (Adults General)" }, { value: "3", label: "3% (Acute)" }, { value: "5", label: "5% (Short Term)" }], defaultValue: "2" }',
  ],
  `(inputs) => {
      const carrier = inputs.carrierMl as number;
      const pct = inputs.dilutionPct as number;
      if (!carrier || !pct) return null;
      const eoMl = Math.round(carrier * pct / 100 * 100) / 100;
      const drops = Math.round(eoMl * 20);
      const totalMl = carrier + eoMl;
      return {
        primary: { label: "Essential Oil Drops", value: formatNumber(drops) + " drops" },
        details: [
          { label: "Essential Oil Volume", value: formatNumber(eoMl) + " mL" },
          { label: "Carrier Oil", value: formatNumber(carrier) + " mL" },
          { label: "Total Blend", value: formatNumber(totalMl) + " mL" },
        ],
      };
  }`,
  [{ q: 'What dilution is safe for adults?', a: 'A 2% dilution is generally safe for everyday adult use.' },
   { q: 'How many drops are in 1 mL of essential oil?', a: 'There are approximately 20 drops per mL of essential oil.' }],
  'Drops = Carrier mL x Dilution% / 100 x 20',
  []
);

add('soap-lye-calculator', 'Soap Lye Calculator',
  'Calculate lye and water for cold process soap making.',
  'Science', 'science', 'A',
  ['soap lye', 'lye calculator cold process'],
  [
    '{ name: "oilWeight", label: "Oil Weight (oz)", type: "number", min: 4, max: 500, defaultValue: 32 }',
    '{ name: "sapValue", label: "SAP Value (NaOH)", type: "number", min: 0.05, max: 0.2, defaultValue: 0.135 }',
    '{ name: "superfat", label: "Superfat (%)", type: "number", min: 0, max: 20, defaultValue: 5 }',
    '{ name: "waterPct", label: "Water as % of Oils", type: "number", min: 25, max: 45, defaultValue: 33 }',
  ],
  `(inputs) => {
      const oil = inputs.oilWeight as number;
      const sap = inputs.sapValue as number;
      const sf = inputs.superfat as number;
      const wp = inputs.waterPct as number;
      if (!oil || !sap) return null;
      const lye = Math.round(oil * sap * (1 - sf / 100) * 100) / 100;
      const water = Math.round(oil * wp / 100 * 100) / 100;
      const totalBatch = Math.round((oil + lye + water) * 100) / 100;
      return {
        primary: { label: "Lye (NaOH)", value: formatNumber(lye) + " oz" },
        details: [
          { label: "Water", value: formatNumber(water) + " oz" },
          { label: "Superfat", value: sf + "%" },
          { label: "Total Batch Weight", value: formatNumber(totalBatch) + " oz" },
        ],
      };
  }`,
  [{ q: 'What is superfatting in soap making?', a: 'Superfatting leaves extra oil in soap for a moisturizing bar.' },
   { q: 'Can I substitute KOH for NaOH?', a: 'Yes, but KOH makes liquid soap. Multiply lye amount by 1.4.' }],
  'Lye = Oil Weight x SAP Value x (1 - Superfat% / 100)',
  []
);

add('resin-volume-calculator', 'Resin Volume Calculator',
  'Calculate epoxy resin needed to fill a mold.',
  'Science', 'science', 'A',
  ['resin volume', 'epoxy resin calculator'],
  [
    '{ name: "moldLength", label: "Mold Length (in)", type: "number", min: 0.5, max: 96, defaultValue: 8 }',
    '{ name: "moldWidth", label: "Mold Width (in)", type: "number", min: 0.5, max: 96, defaultValue: 6 }',
    '{ name: "moldDepth", label: "Mold Depth (in)", type: "number", min: 0.1, max: 24, defaultValue: 1 }',
    '{ name: "mixRatio", label: "Mix Ratio (Resin:Hardener)", type: "select", options: [{ value: "1", label: "1:1" }, { value: "2", label: "2:1" }, { value: "3", label: "3:1" }], defaultValue: "1" }',
  ],
  `(inputs) => {
      const l = inputs.moldLength as number;
      const w = inputs.moldWidth as number;
      const d = inputs.moldDepth as number;
      const ratio = inputs.mixRatio as number;
      if (!l || !w || !d || !ratio) return null;
      const volCuIn = l * w * d;
      const volOz = Math.round(volCuIn * 0.554 * 100) / 100;
      const resinOz = Math.round(volOz * ratio / (ratio + 1) * 100) / 100;
      const hardenerOz = Math.round(volOz / (ratio + 1) * 100) / 100;
      const withExtra = Math.round(volOz * 1.1 * 100) / 100;
      return {
        primary: { label: "Total Resin Needed", value: formatNumber(withExtra) + " fl oz" },
        details: [
          { label: "Resin Part", value: formatNumber(resinOz) + " fl oz" },
          { label: "Hardener Part", value: formatNumber(hardenerOz) + " fl oz" },
          { label: "Mold Volume", value: formatNumber(Math.round(volCuIn * 100) / 100) + " cu in" },
        ],
      };
  }`,
  [{ q: 'How much extra resin should I mix?', a: 'Mix 10% extra to account for mixing cup residue.' },
   { q: 'Can I pour resin in thick layers?', a: 'Most resins should be poured in layers of 0.25 to 0.5 inches.' }],
  'Volume (oz) = L x W x D x 0.554; add 10% extra',
  []
);

add('pottery-glaze-calculator', 'Pottery Glaze Calculator',
  'Scale a glaze recipe to a different batch size.',
  'Everyday', 'everyday', '~',
  ['pottery glaze', 'glaze recipe calculator'],
  [
    '{ name: "originalBatch", label: "Original Batch (g)", type: "number", min: 50, max: 50000, defaultValue: 1000 }',
    '{ name: "desiredBatch", label: "Desired Batch (g)", type: "number", min: 50, max: 50000, defaultValue: 500 }',
    '{ name: "numIngredients", label: "Number of Ingredients", type: "number", min: 2, max: 15, defaultValue: 5 }',
  ],
  `(inputs) => {
      const orig = inputs.originalBatch as number;
      const desired = inputs.desiredBatch as number;
      const num = inputs.numIngredients as number;
      if (!orig || !desired || !num) return null;
      const factor = Math.round(desired / orig * 1000) / 1000;
      const waterOrig = Math.round(orig * 0.45);
      const waterNew = Math.round(waterOrig * factor);
      const perIngredient = Math.round(desired / num * 10) / 10;
      return {
        primary: { label: "Scale Factor", value: formatNumber(factor) + "x" },
        details: [
          { label: "New Batch Size", value: formatNumber(desired) + " g" },
          { label: "Water (approx)", value: formatNumber(waterNew) + " g" },
          { label: "Avg Per Ingredient", value: formatNumber(perIngredient) + " g" },
        ],
      };
  }`,
  [{ q: 'How do I scale a glaze recipe?', a: 'Multiply each ingredient by the ratio of new to original batch.' },
   { q: 'How much water should glaze have?', a: 'Typically 40% to 50% water by dry weight for dipping glaze.' }],
  'Scale Factor = Desired Batch / Original Batch',
  []
);

add('leather-thickness-calculator', 'Leather Thickness Calculator',
  'Convert leather thickness between ounces and millimeters.',
  'Conversion', 'conversion', 'R',
  ['leather thickness', 'leather oz to mm'],
  [
    '{ name: "value", label: "Thickness Value", type: "number", min: 0.1, max: 50, defaultValue: 5 }',
    '{ name: "unit", label: "Input Unit", type: "select", options: [{ value: "oz", label: "Ounces (oz)" }, { value: "mm", label: "Millimeters (mm)" }], defaultValue: "oz" }',
  ],
  `(inputs) => {
      const val = inputs.value as number;
      const unit = inputs.unit as string;
      if (!val) return null;
      let mm, oz, inches;
      if (unit === "oz") {
        mm = Math.round(val / 64 * 25.4 * 100) / 100;
        oz = val;
        inches = Math.round(val / 64 * 1000) / 1000;
      } else {
        mm = val;
        oz = Math.round(val / 25.4 * 64 * 100) / 100;
        inches = Math.round(val / 25.4 * 1000) / 1000;
      }
      const weight = oz <= 3 ? "Light" : oz <= 6 ? "Medium" : "Heavy";
      return {
        primary: { label: "Thickness", value: formatNumber(mm) + " mm / " + formatNumber(oz) + " oz" },
        details: [
          { label: "Inches", value: formatNumber(inches) + " in" },
          { label: "Weight Class", value: weight },
          { label: "Common Use", value: oz <= 3 ? "Garments and linings" : oz <= 6 ? "Bags and belts" : "Saddles and armor" },
        ],
      };
  }`,
  [{ q: 'What does leather oz mean?', a: 'Each ounce equals 1/64 of an inch of thickness.' },
   { q: 'What thickness is best for wallets?', a: 'Use 2 to 3 oz (0.8 to 1.2 mm) leather for wallets.' }],
  '1 oz = 1/64 inch = 0.397 mm',
  []
);

add('paint-mixing-ratio-calculator', 'Paint Mixing Ratio Calculator',
  'Calculate paint mixing proportions for custom colors.',
  'Everyday', 'everyday', '~',
  ['paint mixing', 'paint ratio calculator'],
  [
    '{ name: "totalAmount", label: "Total Paint Needed (oz)", type: "number", min: 1, max: 500, defaultValue: 16 }',
    '{ name: "ratioA", label: "Color A Parts", type: "number", min: 1, max: 20, defaultValue: 3 }',
    '{ name: "ratioB", label: "Color B Parts", type: "number", min: 1, max: 20, defaultValue: 1 }',
    '{ name: "ratioC", label: "Color C Parts (0 if none)", type: "number", min: 0, max: 20, defaultValue: 0 }',
  ],
  `(inputs) => {
      const total = inputs.totalAmount as number;
      const a = inputs.ratioA as number;
      const b = inputs.ratioB as number;
      const c = inputs.ratioC as number;
      if (!total || !a || !b) return null;
      const parts = a + b + c;
      const perPart = Math.round(total / parts * 100) / 100;
      const amtA = Math.round(a * perPart * 100) / 100;
      const amtB = Math.round(b * perPart * 100) / 100;
      const amtC = Math.round(c * perPart * 100) / 100;
      const details = [
        { label: "Color A", value: formatNumber(amtA) + " oz (" + a + " parts)" },
        { label: "Color B", value: formatNumber(amtB) + " oz (" + b + " parts)" },
      ];
      if (c > 0) details.push({ label: "Color C", value: formatNumber(amtC) + " oz (" + c + " parts)" });
      details.push({ label: "Volume Per Part", value: formatNumber(perPart) + " oz" });
      return {
        primary: { label: "Total Mix", value: formatNumber(total) + " oz" },
        details: details,
      };
  }`,
  [{ q: 'How do I mix paint ratios?', a: 'Divide total volume by total parts, then multiply by each color part.' },
   { q: 'Should I mix more than I need?', a: 'Yes. Mix 10% to 15% extra because matching a custom color is hard.' }],
  'Amount = Total x (Parts / Sum of All Parts)',
  []
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
fs.writeFileSync(path.join(__dirname, 'new-imports-batch8.txt'), newImports.join('\n'));
fs.writeFileSync(path.join(__dirname, 'new-regs-batch8.txt'), newRegs.join('\n'));
console.log(`Imports saved to: scripts/new-imports-batch8.txt`);
console.log(`Registry saved to: scripts/new-regs-batch8.txt`);
