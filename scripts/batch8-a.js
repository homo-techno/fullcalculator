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
