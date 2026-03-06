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

// === BATCH 14: 100 CALCULATORS ===

add(
  "restaurant-profit-margin-calculator",
  "Restaurant Profit Margin Calculator",
  "Calculate your restaurant net profit margin by entering revenue, food costs, labor costs, rent, and other operating expenses to see profitability at a glance.",
  "Finance",
  "finance",
  "$",
  ["restaurant profit margin", "restaurant profitability", "food business profit", "restaurant net margin"],
  [
    '{ name: "monthlyRevenue", label: "Monthly Revenue ($)", type: "number", min: 1000, max: 5000000, defaultValue: 80000 }',
    '{ name: "foodCost", label: "Food and Beverage Cost ($)", type: "number", min: 0, max: 3000000, defaultValue: 24000 }',
    '{ name: "laborCost", label: "Labor Cost ($)", type: "number", min: 0, max: 3000000, defaultValue: 22400 }',
    '{ name: "rentUtilities", label: "Rent and Utilities ($)", type: "number", min: 0, max: 500000, defaultValue: 8000 }',
    '{ name: "otherExpenses", label: "Other Operating Expenses ($)", type: "number", min: 0, max: 500000, defaultValue: 6000 }'
  ],
  `(inputs) => {
    const revenue = inputs.monthlyRevenue as number;
    const food = inputs.foodCost as number;
    const labor = inputs.laborCost as number;
    const rent = inputs.rentUtilities as number;
    const other = inputs.otherExpenses as number;
    const totalExpenses = food + labor + rent + other;
    const netProfit = revenue - totalExpenses;
    const profitMargin = revenue > 0 ? (netProfit / revenue) * 100 : 0;
    const foodPct = revenue > 0 ? (food / revenue) * 100 : 0;
    const laborPct = revenue > 0 ? (labor / revenue) * 100 : 0;
    return {
      primary: { label: "Net Profit Margin", value: formatNumber(Math.round(profitMargin * 100) / 100) + "%" },
      details: [
        { label: "Monthly Net Profit", value: "$" + formatNumber(Math.round(netProfit)) },
        { label: "Annual Net Profit (est.)", value: "$" + formatNumber(Math.round(netProfit * 12)) },
        { label: "Food Cost Percentage", value: formatNumber(Math.round(foodPct * 10) / 10) + "%" },
        { label: "Labor Cost Percentage", value: formatNumber(Math.round(laborPct * 10) / 10) + "%" },
        { label: "Total Monthly Expenses", value: "$" + formatNumber(Math.round(totalExpenses)) }
      ]
    };
  }`,
  [
    { q: "What is a good profit margin for a restaurant?", a: "Full-service restaurants typically achieve a net profit margin of 3 to 9 percent. Fast-casual restaurants may reach 6 to 9 percent, while fine dining can vary widely from 2 to 15 percent depending on volume and pricing." },
    { q: "How can I improve my restaurant profit margin?", a: "Focus on controlling food waste, optimizing labor scheduling, negotiating supplier prices, engineering your menu to promote high-margin items, and reviewing portion sizes regularly." },
    { q: "What percentage of revenue should food cost be?", a: "Most successful restaurants keep food cost between 28 and 35 percent of revenue. Fine dining may run higher at 35 to 40 percent, while fast food aims for 25 to 30 percent." }
  ],
  `Net Profit = Revenue - (Food Cost + Labor Cost + Rent/Utilities + Other Expenses)
Profit Margin = (Net Profit / Revenue) x 100`,
  ["food-cost-percentage-calculator", "restaurant-labor-cost-percentage-calculator"]
);

add(
  "food-cost-percentage-calculator",
  "Food Cost Percentage Calculator",
  "Determine your food cost percentage by comparing ingredient costs to menu item selling prices to ensure profitable pricing for every dish.",
  "Finance",
  "finance",
  "$",
  ["food cost percentage", "recipe cost", "ingredient cost ratio", "food cost formula"],
  [
    '{ name: "ingredientCost", label: "Total Ingredient Cost ($)", type: "number", min: 0, max: 100000, defaultValue: 4.50 }',
    '{ name: "menuPrice", label: "Menu Selling Price ($)", type: "number", min: 0.01, max: 100000, defaultValue: 14.00 }',
    '{ name: "portionsPerRecipe", label: "Portions Per Recipe", type: "number", min: 1, max: 500, defaultValue: 1 }',
    '{ name: "targetFoodCost", label: "Target Food Cost (%)", type: "number", min: 10, max: 60, defaultValue: 30 }'
  ],
  `(inputs) => {
    const ingredientCost = inputs.ingredientCost as number;
    const menuPrice = inputs.menuPrice as number;
    const portions = inputs.portionsPerRecipe as number;
    const target = inputs.targetFoodCost as number;
    const costPerPortion = ingredientCost / portions;
    const foodCostPct = menuPrice > 0 ? (costPerPortion / menuPrice) * 100 : 0;
    const idealPrice = target > 0 ? costPerPortion / (target / 100) : 0;
    const grossProfit = menuPrice - costPerPortion;
    const status = foodCostPct <= target ? "On Target" : "Over Target";
    return {
      primary: { label: "Food Cost Percentage", value: formatNumber(Math.round(foodCostPct * 100) / 100) + "%" },
      details: [
        { label: "Cost Per Portion", value: "$" + formatNumber(Math.round(costPerPortion * 100) / 100) },
        { label: "Gross Profit Per Plate", value: "$" + formatNumber(Math.round(grossProfit * 100) / 100) },
        { label: "Ideal Menu Price (at target %)", value: "$" + formatNumber(Math.round(idealPrice * 100) / 100) },
        { label: "Status", value: status }
      ]
    };
  }`,
  [
    { q: "What is food cost percentage?", a: "Food cost percentage is the ratio of ingredient cost to menu selling price, expressed as a percentage. It tells you how much of every dollar earned from a dish goes toward paying for its ingredients." },
    { q: "What is an ideal food cost percentage?", a: "Most restaurants aim for a food cost percentage between 28 and 35 percent. Lower is better for profitability, but going too low may compromise quality and portion sizes." },
    { q: "How do I lower food cost percentage?", a: "Negotiate better supplier pricing, reduce waste through proper storage and FIFO rotation, adjust portion sizes, substitute expensive ingredients, and redesign recipes to use more seasonal and local products." }
  ],
  `Food Cost % = (Ingredient Cost per Portion / Menu Price) x 100
Ideal Menu Price = Cost per Portion / (Target Food Cost % / 100)`,
  ["restaurant-profit-margin-calculator", "menu-pricing-calculator"]
);

add(
  "menu-pricing-calculator",
  "Menu Pricing Calculator",
  "Set profitable menu prices by calculating the ideal selling price based on raw ingredient costs, target food cost percentage, and desired profit margin.",
  "Finance",
  "finance",
  "$",
  ["menu pricing", "dish pricing strategy", "restaurant menu price", "food pricing formula"],
  [
    '{ name: "rawCost", label: "Raw Ingredient Cost ($)", type: "number", min: 0.01, max: 10000, defaultValue: 5.00 }',
    '{ name: "targetFoodCostPct", label: "Target Food Cost (%)", type: "number", min: 10, max: 60, defaultValue: 30 }',
    '{ name: "overhead", label: "Overhead Markup (%)", type: "number", min: 0, max: 100, defaultValue: 15 }',
    '{ name: "desiredMargin", label: "Desired Net Margin (%)", type: "number", min: 1, max: 50, defaultValue: 10 }'
  ],
  `(inputs) => {
    const raw = inputs.rawCost as number;
    const targetPct = inputs.targetFoodCostPct as number;
    const overhead = inputs.overhead as number / 100;
    const margin = inputs.desiredMargin as number / 100;
    const basePrice = targetPct > 0 ? raw / (targetPct / 100) : 0;
    const withOverhead = basePrice * (1 + overhead);
    const finalPrice = margin < 1 ? withOverhead / (1 - margin) : withOverhead * 2;
    const grossProfit = finalPrice - raw;
    const actualFoodCostPct = finalPrice > 0 ? (raw / finalPrice) * 100 : 0;
    return {
      primary: { label: "Recommended Menu Price", value: "$" + formatNumber(Math.round(finalPrice * 100) / 100) },
      details: [
        { label: "Base Price (from food cost target)", value: "$" + formatNumber(Math.round(basePrice * 100) / 100) },
        { label: "With Overhead Markup", value: "$" + formatNumber(Math.round(withOverhead * 100) / 100) },
        { label: "Gross Profit Per Item", value: "$" + formatNumber(Math.round(grossProfit * 100) / 100) },
        { label: "Actual Food Cost %", value: formatNumber(Math.round(actualFoodCostPct * 10) / 10) + "%" }
      ]
    };
  }`,
  [
    { q: "How should I price my menu items?", a: "Start by calculating raw ingredient cost per portion, then divide by your target food cost percentage (typically 0.28 to 0.35). Add overhead and desired margin. Also consider competitor pricing and perceived value." },
    { q: "Should all menu items have the same food cost percentage?", a: "No. Different categories have different norms. Appetizers and desserts often run 20 to 25 percent food cost, entrees 28 to 35 percent, and beverages 15 to 25 percent. Balance high and low cost items across the menu." },
    { q: "What is menu engineering?", a: "Menu engineering analyzes each item by profitability and popularity. Items are classified as Stars (high profit, high popularity), Puzzles (high profit, low popularity), Plowhorses (low profit, high popularity), and Dogs (low profit, low popularity)." }
  ],
  `Base Price = Raw Cost / (Target Food Cost % / 100)
With Overhead = Base Price x (1 + Overhead %)
Final Price = With Overhead / (1 - Desired Net Margin %)`,
  ["food-cost-percentage-calculator", "plate-cost-calculator"]
);

add(
  "kitchen-equipment-cost-calculator",
  "Kitchen Equipment Cost Calculator",
  "Estimate the total cost of outfitting a commercial kitchen by selecting equipment categories, quantities, and quality tiers for a new or renovated restaurant.",
  "Finance",
  "finance",
  "$",
  ["commercial kitchen equipment", "restaurant equipment cost", "kitchen buildout", "kitchen startup cost"],
  [
    '{ name: "kitchenSize", label: "Kitchen Size", type: "select", options: [{ value: "1", label: "Small (under 500 sq ft)" }, { value: "2", label: "Medium (500-1000 sq ft)" }, { value: "3", label: "Large (over 1000 sq ft)" }], defaultValue: "2" }',
    '{ name: "qualityTier", label: "Equipment Quality", type: "select", options: [{ value: "1", label: "Budget / Used" }, { value: "2", label: "Mid-Range / New" }, { value: "3", label: "Premium / Commercial Grade" }], defaultValue: "2" }',
    '{ name: "cuisineType", label: "Cuisine Type", type: "select", options: [{ value: "1", label: "Fast Casual" }, { value: "2", label: "Full Service" }, { value: "3", label: "Fine Dining" }, { value: "4", label: "Bakery / Cafe" }], defaultValue: "2" }',
    '{ name: "installationPct", label: "Installation and Delivery (%)", type: "number", min: 0, max: 30, defaultValue: 10 }'
  ],
  `(inputs) => {
    const size = parseInt(inputs.kitchenSize as string);
    const quality = parseInt(inputs.qualityTier as string);
    const cuisine = parseInt(inputs.cuisineType as string);
    const installPct = inputs.installationPct as number / 100;
    const sizeMultiplier = { 1: 0.6, 2: 1.0, 3: 1.6 };
    const qualityMultiplier = { 1: 0.5, 2: 1.0, 3: 1.8 };
    const cuisineBase = { 1: 35000, 2: 55000, 3: 85000, 4: 40000 };
    const base = cuisineBase[cuisine] || 55000;
    const equipmentCost = Math.round(base * (sizeMultiplier[size] || 1) * (qualityMultiplier[quality] || 1));
    const installCost = Math.round(equipmentCost * installPct);
    const totalCost = equipmentCost + installCost;
    return {
      primary: { label: "Total Kitchen Equipment Cost", value: "$" + formatNumber(totalCost) },
      details: [
        { label: "Equipment Cost", value: "$" + formatNumber(equipmentCost) },
        { label: "Installation and Delivery", value: "$" + formatNumber(installCost) },
        { label: "Estimated Monthly Depreciation (7yr)", value: "$" + formatNumber(Math.round(totalCost / 84)) },
        { label: "Budget Range", value: "$" + formatNumber(Math.round(totalCost * 0.85)) + " - $" + formatNumber(Math.round(totalCost * 1.15)) }
      ]
    };
  }`,
  [
    { q: "How much does it cost to equip a commercial kitchen?", a: "A typical commercial kitchen costs between $30,000 and $200,000 to equip, depending on size, equipment quality, and cuisine type. Fast casual setups cost less, while fine dining requires more specialized and expensive equipment." },
    { q: "Should I buy new or used restaurant equipment?", a: "Used equipment can save 40 to 60 percent off new prices. Reliable items to buy used include stainless steel tables, shelving, and ovens. Buy new for refrigeration, ventilation hoods, and anything with complex electronics." },
    { q: "What are the most essential pieces of commercial kitchen equipment?", a: "Essential items include a commercial range or cooktop, oven, walk-in or reach-in refrigerator, freezer, prep tables, a ventilation hood, three-compartment sink, and a commercial dishwasher." }
  ],
  `Equipment Cost = Cuisine Base Cost x Size Multiplier x Quality Multiplier
Installation = Equipment Cost x Installation %
Total = Equipment Cost + Installation`,
  ["restaurant-break-even-calculator", "food-truck-startup-cost-calculator"]
);

add(
  "restaurant-seating-capacity-calculator",
  "Restaurant Seating Capacity Calculator",
  "Calculate the optimal seating capacity for your restaurant based on total dining area, service style, and local code requirements for aisle and spacing.",
  "Everyday",
  "everyday",
  "~",
  ["restaurant seating capacity", "dining room layout", "restaurant seats per square foot", "restaurant floor plan"],
  [
    '{ name: "diningArea", label: "Dining Area (sq ft)", type: "number", min: 100, max: 50000, defaultValue: 2000 }',
    '{ name: "serviceStyle", label: "Service Style", type: "select", options: [{ value: "1", label: "Fast Food / Counter (12 sq ft/seat)" }, { value: "2", label: "Fast Casual (15 sq ft/seat)" }, { value: "3", label: "Full Service (18 sq ft/seat)" }, { value: "4", label: "Fine Dining (22 sq ft/seat)" }], defaultValue: "3" }',
    '{ name: "avgPartySize", label: "Average Party Size", type: "number", min: 1, max: 12, defaultValue: 3 }',
    '{ name: "turnsPerService", label: "Table Turns Per Service", type: "number", min: 1, max: 8, defaultValue: 2 }'
  ],
  `(inputs) => {
    const area = inputs.diningArea as number;
    const style = parseInt(inputs.serviceStyle as string);
    const partySize = inputs.avgPartySize as number;
    const turns = inputs.turnsPerService as number;
    const sqFtPerSeat = { 1: 12, 2: 15, 3: 18, 4: 22 };
    const perSeat = sqFtPerSeat[style] || 18;
    const maxSeats = Math.floor(area / perSeat);
    const numTables = Math.floor(maxSeats / partySize);
    const guestsPerService = maxSeats * turns;
    const guestsPerDay = guestsPerService * 2;
    return {
      primary: { label: "Maximum Seating Capacity", value: formatNumber(maxSeats) + " seats" },
      details: [
        { label: "Square Feet Per Seat", value: formatNumber(perSeat) + " sq ft" },
        { label: "Estimated Tables", value: formatNumber(numTables) },
        { label: "Guests Per Service (with turns)", value: formatNumber(guestsPerService) },
        { label: "Guests Per Day (lunch + dinner)", value: formatNumber(guestsPerDay) }
      ]
    };
  }`,
  [
    { q: "How many square feet per seat does a restaurant need?", a: "Fast food averages 12 square feet per seat, fast casual 15, full-service restaurants 18, and fine dining 20 to 25 square feet per seat. These figures include aisle space and table clearance." },
    { q: "What is table turn rate?", a: "Table turn rate is the number of times a table is occupied by different parties during a single meal service. Fast casual restaurants average 3 to 4 turns, full service 1.5 to 2.5 turns, and fine dining 1 to 1.5 turns." },
    { q: "How does seating capacity affect revenue?", a: "More seats allow more covers per service, but overcrowding reduces guest satisfaction. Optimal seating balances capacity with comfort. Increasing table turns through efficient service is often more profitable than adding seats." }
  ],
  `Max Seats = Dining Area (sq ft) / Sq Ft Per Seat
Estimated Tables = Max Seats / Average Party Size
Guests Per Service = Max Seats x Table Turns`,
  ["table-turnover-rate-calculator", "restaurant-break-even-calculator"]
);

add(
  "table-turnover-rate-calculator",
  "Table Turnover Rate Calculator",
  "Calculate your restaurant table turnover rate and revenue potential by tracking seated parties, average check size, and service hours to optimize throughput.",
  "Finance",
  "finance",
  "$",
  ["table turnover rate", "restaurant table turns", "covers per hour", "restaurant throughput"],
  [
    '{ name: "totalTables", label: "Total Tables", type: "number", min: 1, max: 200, defaultValue: 25 }',
    '{ name: "partiesServed", label: "Parties Served Per Service", type: "number", min: 1, max: 500, defaultValue: 50 }',
    '{ name: "avgCheckSize", label: "Average Check Size ($)", type: "number", min: 5, max: 500, defaultValue: 55 }',
    '{ name: "avgPartySize", label: "Average Party Size", type: "number", min: 1, max: 12, defaultValue: 3 }',
    '{ name: "serviceHours", label: "Service Hours", type: "number", min: 1, max: 12, defaultValue: 4 }'
  ],
  `(inputs) => {
    const tables = inputs.totalTables as number;
    const parties = inputs.partiesServed as number;
    const check = inputs.avgCheckSize as number;
    const partySize = inputs.avgPartySize as number;
    const hours = inputs.serviceHours as number;
    const turnoverRate = tables > 0 ? parties / tables : 0;
    const totalCovers = parties * partySize;
    const revenuePerService = totalCovers * check;
    const revenuePerSeatHour = tables > 0 && hours > 0 ? revenuePerService / (tables * partySize * hours) : 0;
    const avgDineTime = hours > 0 && turnoverRate > 0 ? Math.round((hours / turnoverRate) * 60) : 0;
    return {
      primary: { label: "Table Turnover Rate", value: formatNumber(Math.round(turnoverRate * 100) / 100) + " turns" },
      details: [
        { label: "Total Covers Per Service", value: formatNumber(totalCovers) },
        { label: "Revenue Per Service", value: "$" + formatNumber(Math.round(revenuePerService)) },
        { label: "Revenue Per Seat-Hour", value: "$" + formatNumber(Math.round(revenuePerSeatHour * 100) / 100) },
        { label: "Avg Dining Time", value: formatNumber(avgDineTime) + " minutes" }
      ]
    };
  }`,
  [
    { q: "What is a good table turnover rate?", a: "For fast casual restaurants 3 to 4 turns per meal period is typical. Full-service restaurants average 1.5 to 2.5 turns, and fine dining aims for 1 to 1.5 turns per service." },
    { q: "How can I increase table turnover without rushing guests?", a: "Streamline your kitchen workflow, train servers to pace courses efficiently, use reservation systems to stagger seating, offer digital payment, and design your menu to minimize kitchen bottlenecks." },
    { q: "What is revenue per seat-hour?", a: "Revenue per seat-hour measures how much revenue each seat generates per hour of operation. It combines average check size and turnover rate into a single efficiency metric used to benchmark restaurant performance." }
  ],
  `Turnover Rate = Parties Served / Total Tables
Total Covers = Parties x Average Party Size
Revenue Per Service = Total Covers x Average Check Size`,
  ["restaurant-seating-capacity-calculator", "restaurant-profit-margin-calculator"]
);

add(
  "bar-pour-cost-calculator",
  "Bar Pour Cost Calculator",
  "Calculate your bar pour cost percentage for cocktails, beer, and wine by comparing the cost of ingredients to the selling price for each drink.",
  "Finance",
  "finance",
  "$",
  ["bar pour cost", "liquor cost percentage", "drink cost calculator", "bar profitability"],
  [
    '{ name: "bottleCost", label: "Bottle or Ingredient Cost ($)", type: "number", min: 0.5, max: 1000, defaultValue: 28 }',
    '{ name: "servingsPerBottle", label: "Servings Per Bottle", type: "number", min: 1, max: 100, defaultValue: 17 }',
    '{ name: "sellingPrice", label: "Drink Selling Price ($)", type: "number", min: 0.5, max: 200, defaultValue: 12 }',
    '{ name: "mixerCost", label: "Mixer and Garnish Cost Per Drink ($)", type: "number", min: 0, max: 20, defaultValue: 0.75 }',
    '{ name: "drinksPerWeek", label: "Drinks Sold Per Week", type: "number", min: 1, max: 10000, defaultValue: 200 }'
  ],
  `(inputs) => {
    const bottleCost = inputs.bottleCost as number;
    const servings = inputs.servingsPerBottle as number;
    const price = inputs.sellingPrice as number;
    const mixer = inputs.mixerCost as number;
    const weekly = inputs.drinksPerWeek as number;
    const costPerDrink = (bottleCost / servings) + mixer;
    const pourCostPct = price > 0 ? (costPerDrink / price) * 100 : 0;
    const profitPerDrink = price - costPerDrink;
    const weeklyRevenue = weekly * price;
    const weeklyProfit = weekly * profitPerDrink;
    return {
      primary: { label: "Pour Cost Percentage", value: formatNumber(Math.round(pourCostPct * 100) / 100) + "%" },
      details: [
        { label: "Cost Per Drink", value: "$" + formatNumber(Math.round(costPerDrink * 100) / 100) },
        { label: "Profit Per Drink", value: "$" + formatNumber(Math.round(profitPerDrink * 100) / 100) },
        { label: "Weekly Revenue", value: "$" + formatNumber(Math.round(weeklyRevenue)) },
        { label: "Weekly Gross Profit", value: "$" + formatNumber(Math.round(weeklyProfit)) }
      ]
    };
  }`,
  [
    { q: "What is a good pour cost percentage?", a: "A healthy bar pour cost is typically 18 to 24 percent. Liquor pours average 18 to 20 percent, draft beer 20 to 24 percent, bottled beer 24 to 28 percent, and wine 30 to 35 percent." },
    { q: "How do I reduce bar pour cost?", a: "Use measured pourers or jiggers, implement strict inventory tracking, train bartenders on recipes, reduce over-pouring, minimize spillage and waste, and renegotiate supplier pricing." },
    { q: "How many servings are in a standard liquor bottle?", a: "A standard 750ml bottle contains about 17 servings at 1.5 ounces each. A liter bottle yields approximately 22 servings at the same pour size." }
  ],
  `Cost Per Drink = (Bottle Cost / Servings Per Bottle) + Mixer Cost
Pour Cost % = (Cost Per Drink / Selling Price) x 100
Profit Per Drink = Selling Price - Cost Per Drink`,
  ["cocktail-recipe-cost-calculator", "happy-hour-profit-calculator"]
);

add(
  "tip-pool-distribution-calculator",
  "Tip Pool Distribution Calculator",
  "Distribute pooled tips fairly among restaurant staff based on hours worked, position, and customizable tip share percentages for each role.",
  "Finance",
  "finance",
  "$",
  ["tip pool distribution", "tip share calculator", "restaurant tip split", "server tip allocation"],
  [
    '{ name: "totalTips", label: "Total Tips to Distribute ($)", type: "number", min: 0, max: 100000, defaultValue: 1200 }',
    '{ name: "serverHours", label: "Total Server Hours", type: "number", min: 0, max: 500, defaultValue: 40 }',
    '{ name: "bartenderHours", label: "Total Bartender Hours", type: "number", min: 0, max: 200, defaultValue: 16 }',
    '{ name: "bussersHours", label: "Total Busser Hours", type: "number", min: 0, max: 200, defaultValue: 20 }',
    '{ name: "serverShare", label: "Server Tip Share (%)", type: "number", min: 0, max: 100, defaultValue: 60 }',
    '{ name: "bartenderShare", label: "Bartender Tip Share (%)", type: "number", min: 0, max: 100, defaultValue: 25 }',
    '{ name: "busserShare", label: "Busser Tip Share (%)", type: "number", min: 0, max: 100, defaultValue: 15 }'
  ],
  `(inputs) => {
    const total = inputs.totalTips as number;
    const sHours = inputs.serverHours as number;
    const bHours = inputs.bartenderHours as number;
    const buHours = inputs.bussersHours as number;
    const sShare = inputs.serverShare as number;
    const bShare = inputs.bartenderShare as number;
    const buShare = inputs.busserShare as number;
    const totalShare = sShare + bShare + buShare;
    const serverPool = totalShare > 0 ? total * (sShare / totalShare) : 0;
    const bartenderPool = totalShare > 0 ? total * (bShare / totalShare) : 0;
    const busserPool = totalShare > 0 ? total * (buShare / totalShare) : 0;
    const serverPerHour = sHours > 0 ? serverPool / sHours : 0;
    const bartenderPerHour = bHours > 0 ? bartenderPool / bHours : 0;
    const busserPerHour = buHours > 0 ? busserPool / buHours : 0;
    return {
      primary: { label: "Server Pool Total", value: "$" + formatNumber(Math.round(serverPool * 100) / 100) },
      details: [
        { label: "Server Tips Per Hour", value: "$" + formatNumber(Math.round(serverPerHour * 100) / 100) },
        { label: "Bartender Pool Total", value: "$" + formatNumber(Math.round(bartenderPool * 100) / 100) },
        { label: "Bartender Tips Per Hour", value: "$" + formatNumber(Math.round(bartenderPerHour * 100) / 100) },
        { label: "Busser Pool Total", value: "$" + formatNumber(Math.round(busserPool * 100) / 100) },
        { label: "Busser Tips Per Hour", value: "$" + formatNumber(Math.round(busserPerHour * 100) / 100) }
      ]
    };
  }`,
  [
    { q: "How does a tip pool work?", a: "In a tip pool, all or a portion of tips collected by front-of-house staff are combined into a single pool and then distributed among eligible employees based on hours worked, position, or a point system." },
    { q: "Is tip pooling legal?", a: "Tip pooling is legal in most U.S. states as long as employers do not keep any portion. Federal law prohibits managers and supervisors from participating. Some states have additional restrictions on which positions can be included." },
    { q: "What is a fair tip pool split?", a: "A common split is 55 to 70 percent to servers, 15 to 25 percent to bartenders, and 10 to 20 percent to bussers and food runners. The exact percentages should reflect each role contribution to guest service." }
  ],
  `Server Pool = Total Tips x (Server Share % / Total Share %)
Tips Per Hour = Role Pool Total / Role Total Hours`,
  ["restaurant-profit-margin-calculator", "restaurant-labor-cost-percentage-calculator"]
);

add(
  "catering-cost-per-head-calculator",
  "Catering Cost Per Head Calculator",
  "Estimate total catering costs and per-person pricing for events by selecting service style, menu complexity, staff needs, and equipment rentals.",
  "Finance",
  "finance",
  "$",
  ["catering cost per head", "catering price per person", "event catering budget", "banquet catering cost"],
  [
    '{ name: "guestCount", label: "Number of Guests", type: "number", min: 10, max: 5000, defaultValue: 100 }',
    '{ name: "serviceStyle", label: "Service Style", type: "select", options: [{ value: "1", label: "Buffet ($25-40/head)" }, { value: "2", label: "Plated Dinner ($40-75/head)" }, { value: "3", label: "Food Stations ($30-50/head)" }, { value: "4", label: "Family Style ($35-55/head)" }], defaultValue: "2" }',
    '{ name: "menuTier", label: "Menu Tier", type: "select", options: [{ value: "1", label: "Standard" }, { value: "2", label: "Premium" }, { value: "3", label: "Luxury" }], defaultValue: "2" }',
    '{ name: "barService", label: "Bar Service", type: "select", options: [{ value: "0", label: "No Bar" }, { value: "1", label: "Beer and Wine ($15/head)" }, { value: "2", label: "Open Bar ($30/head)" }, { value: "3", label: "Premium Open Bar ($45/head)" }], defaultValue: "1" }',
    '{ name: "rentalCost", label: "Equipment and Rental Cost ($)", type: "number", min: 0, max: 50000, defaultValue: 1500 }'
  ],
  `(inputs) => {
    const guests = inputs.guestCount as number;
    const style = parseInt(inputs.serviceStyle as string);
    const tier = parseInt(inputs.menuTier as string);
    const bar = parseInt(inputs.barService as string);
    const rentals = inputs.rentalCost as number;
    const styleBase = { 1: 32, 2: 55, 3: 40, 4: 45 };
    const tierMult = { 1: 0.85, 2: 1.0, 3: 1.4 };
    const barCost = { 0: 0, 1: 15, 2: 30, 3: 45 };
    const foodPerHead = (styleBase[style] || 45) * (tierMult[tier] || 1);
    const barPerHead = barCost[bar] || 0;
    const totalPerHead = foodPerHead + barPerHead;
    const subtotal = totalPerHead * guests;
    const grandTotal = subtotal + rentals;
    const costPerHead = guests > 0 ? grandTotal / guests : 0;
    return {
      primary: { label: "Total Cost Per Head", value: "$" + formatNumber(Math.round(costPerHead * 100) / 100) },
      details: [
        { label: "Food Per Head", value: "$" + formatNumber(Math.round(foodPerHead * 100) / 100) },
        { label: "Bar Per Head", value: "$" + formatNumber(barPerHead) },
        { label: "Subtotal (Food + Bar)", value: "$" + formatNumber(Math.round(subtotal)) },
        { label: "Rentals and Equipment", value: "$" + formatNumber(Math.round(rentals)) },
        { label: "Grand Total", value: "$" + formatNumber(Math.round(grandTotal)) }
      ]
    };
  }`,
  [
    { q: "How much does catering cost per person?", a: "Catering costs range widely: buffets average $25 to $40 per person, plated dinners $40 to $75, and premium events can exceed $100 per person including bar service, rentals, and staffing." },
    { q: "What is included in a catering per-head price?", a: "Per-head pricing typically includes food preparation, service staff, basic table settings, and sometimes beverages. Equipment rentals, linens, specialty decor, and premium bar packages are usually extra." },
    { q: "How do I choose between buffet and plated service?", a: "Buffets are more budget-friendly and work well for casual events. Plated dinners provide an elevated experience for formal occasions. Food stations offer a middle ground with interactive variety." }
  ],
  `Food Per Head = Style Base Price x Menu Tier Multiplier
Total Per Head = Food Per Head + Bar Per Head
Grand Total = (Total Per Head x Guests) + Rentals`,
  ["banquet-hall-rental-cost-calculator", "buffet-quantity-calculator"]
);

add(
  "food-truck-startup-cost-calculator",
  "Food Truck Startup Cost Calculator",
  "Estimate total startup costs for a food truck business including the vehicle, equipment, permits, branding, and initial inventory.",
  "Finance",
  "finance",
  "$",
  ["food truck startup cost", "food truck business cost", "mobile food business", "food truck investment"],
  [
    '{ name: "truckType", label: "Truck Type", type: "select", options: [{ value: "1", label: "Used Truck ($30k-60k)" }, { value: "2", label: "New Custom Build ($75k-150k)" }, { value: "3", label: "Trailer ($15k-40k)" }], defaultValue: "1" }',
    '{ name: "equipmentBudget", label: "Kitchen Equipment Budget ($)", type: "number", min: 2000, max: 100000, defaultValue: 15000 }',
    '{ name: "permitsFees", label: "Permits and Licenses ($)", type: "number", min: 500, max: 20000, defaultValue: 3000 }',
    '{ name: "branding", label: "Wrap, Branding and Marketing ($)", type: "number", min: 0, max: 20000, defaultValue: 5000 }',
    '{ name: "initialInventory", label: "Initial Inventory ($)", type: "number", min: 500, max: 20000, defaultValue: 2000 }',
    '{ name: "insurance", label: "Annual Insurance ($)", type: "number", min: 1000, max: 15000, defaultValue: 3500 }'
  ],
  `(inputs) => {
    const truckType = parseInt(inputs.truckType as string);
    const equipment = inputs.equipmentBudget as number;
    const permits = inputs.permitsFees as number;
    const branding = inputs.branding as number;
    const inventory = inputs.initialInventory as number;
    const insurance = inputs.insurance as number;
    const truckCost = { 1: 45000, 2: 110000, 3: 27000 };
    const truck = truckCost[truckType] || 45000;
    const totalStartup = truck + equipment + permits + branding + inventory + insurance;
    const monthlyInsurance = Math.round(insurance / 12);
    return {
      primary: { label: "Total Startup Cost", value: "$" + formatNumber(totalStartup) },
      details: [
        { label: "Truck or Trailer", value: "$" + formatNumber(truck) },
        { label: "Kitchen Equipment", value: "$" + formatNumber(equipment) },
        { label: "Permits and Licenses", value: "$" + formatNumber(permits) },
        { label: "Branding and Marketing", value: "$" + formatNumber(branding) },
        { label: "Initial Inventory", value: "$" + formatNumber(inventory) },
        { label: "Monthly Insurance", value: "$" + formatNumber(monthlyInsurance) }
      ]
    };
  }`,
  [
    { q: "How much does it cost to start a food truck?", a: "Most food trucks cost between $50,000 and $200,000 to launch. A used truck with basic equipment starts around $50,000 while a new custom build with premium equipment can exceed $175,000." },
    { q: "What permits do I need for a food truck?", a: "Requirements vary by city but typically include a business license, food service permit, health department inspection, fire safety certification, vehicle registration, and a mobile food vendor permit. Some cities also require commissary agreements." },
    { q: "Is a food truck more profitable than a restaurant?", a: "Food trucks have lower overhead and startup costs. Average food truck revenue is $250,000 to $500,000 annually with profit margins of 6 to 9 percent. They offer more flexibility but are weather-dependent and face location competition." }
  ],
  `Total Startup = Truck Cost + Equipment + Permits + Branding + Inventory + Insurance`,
  ["food-trailer-licensing-cost-calculator", "restaurant-break-even-calculator"]
);

add(
  "bakery-ingredient-cost-calculator",
  "Bakery Ingredient Cost Calculator",
  "Calculate ingredient costs per batch and per unit for bakery products by entering flour, sugar, butter, eggs, and other component prices.",
  "Finance",
  "finance",
  "$",
  ["bakery ingredient cost", "baking recipe cost", "bakery pricing", "cost per pastry"],
  [
    '{ name: "flourCost", label: "Flour Cost Per Batch ($)", type: "number", min: 0, max: 500, defaultValue: 2.50 }',
    '{ name: "sugarCost", label: "Sugar and Sweeteners Per Batch ($)", type: "number", min: 0, max: 500, defaultValue: 1.20 }',
    '{ name: "butterDairyCost", label: "Butter and Dairy Per Batch ($)", type: "number", min: 0, max: 500, defaultValue: 3.80 }',
    '{ name: "eggsCost", label: "Eggs Per Batch ($)", type: "number", min: 0, max: 200, defaultValue: 1.50 }',
    '{ name: "otherIngredients", label: "Other Ingredients Per Batch ($)", type: "number", min: 0, max: 500, defaultValue: 1.00 }',
    '{ name: "unitsPerBatch", label: "Units Produced Per Batch", type: "number", min: 1, max: 1000, defaultValue: 24 }',
    '{ name: "sellingPrice", label: "Selling Price Per Unit ($)", type: "number", min: 0.01, max: 500, defaultValue: 3.50 }'
  ],
  `(inputs) => {
    const flour = inputs.flourCost as number;
    const sugar = inputs.sugarCost as number;
    const butter = inputs.butterDairyCost as number;
    const eggs = inputs.eggsCost as number;
    const other = inputs.otherIngredients as number;
    const units = inputs.unitsPerBatch as number;
    const price = inputs.sellingPrice as number;
    const batchCost = flour + sugar + butter + eggs + other;
    const costPerUnit = units > 0 ? batchCost / units : 0;
    const profitPerUnit = price - costPerUnit;
    const margin = price > 0 ? (profitPerUnit / price) * 100 : 0;
    const batchRevenue = units * price;
    const batchProfit = batchRevenue - batchCost;
    return {
      primary: { label: "Cost Per Unit", value: "$" + formatNumber(Math.round(costPerUnit * 100) / 100) },
      details: [
        { label: "Total Batch Cost", value: "$" + formatNumber(Math.round(batchCost * 100) / 100) },
        { label: "Profit Per Unit", value: "$" + formatNumber(Math.round(profitPerUnit * 100) / 100) },
        { label: "Profit Margin", value: formatNumber(Math.round(margin * 10) / 10) + "%" },
        { label: "Batch Revenue", value: "$" + formatNumber(Math.round(batchRevenue * 100) / 100) },
        { label: "Batch Profit", value: "$" + formatNumber(Math.round(batchProfit * 100) / 100) }
      ]
    };
  }`,
  [
    { q: "What is a good profit margin for a bakery?", a: "Bakeries typically target a gross profit margin of 50 to 70 percent on individual items. Overall net profit margins for bakery businesses range from 5 to 15 percent after accounting for labor, rent, and overhead." },
    { q: "How do I price bakery items?", a: "A common rule is to multiply your ingredient cost by 3 to 4 for retail items. This covers ingredients at roughly 25 to 35 percent, labor at 25 to 35 percent, overhead at 15 to 25 percent, and leaves profit." },
    { q: "What are the most expensive bakery ingredients?", a: "Butter, vanilla extract, chocolate, and nuts are typically the most expensive bakery ingredients. Specialty items like saffron, high-quality cocoa, and imported European butter can significantly increase recipe costs." }
  ],
  `Batch Cost = Flour + Sugar + Butter/Dairy + Eggs + Other Ingredients
Cost Per Unit = Batch Cost / Units Per Batch
Profit Margin = ((Selling Price - Cost Per Unit) / Selling Price) x 100`,
  ["food-cost-percentage-calculator", "menu-pricing-calculator"]
);

add(
  "coffee-shop-daily-revenue-calculator",
  "Coffee Shop Daily Revenue Calculator",
  "Estimate daily and monthly revenue for a coffee shop based on average drinks sold, food sales, average ticket price, and peak versus off-peak traffic.",
  "Finance",
  "finance",
  "$",
  ["coffee shop revenue", "cafe daily sales", "coffee shop income", "coffee business revenue"],
  [
    '{ name: "drinksPerDay", label: "Drinks Sold Per Day", type: "number", min: 10, max: 2000, defaultValue: 200 }',
    '{ name: "avgDrinkPrice", label: "Average Drink Price ($)", type: "number", min: 1, max: 20, defaultValue: 5.25 }',
    '{ name: "foodItemsPerDay", label: "Food Items Sold Per Day", type: "number", min: 0, max: 500, defaultValue: 60 }',
    '{ name: "avgFoodPrice", label: "Average Food Item Price ($)", type: "number", min: 0, max: 30, defaultValue: 4.50 }',
    '{ name: "daysOpen", label: "Days Open Per Month", type: "number", min: 1, max: 31, defaultValue: 26 }'
  ],
  `(inputs) => {
    const drinks = inputs.drinksPerDay as number;
    const drinkPrice = inputs.avgDrinkPrice as number;
    const food = inputs.foodItemsPerDay as number;
    const foodPrice = inputs.avgFoodPrice as number;
    const days = inputs.daysOpen as number;
    const dailyDrinkRev = drinks * drinkPrice;
    const dailyFoodRev = food * foodPrice;
    const dailyTotal = dailyDrinkRev + dailyFoodRev;
    const monthlyRevenue = dailyTotal * days;
    const annualRevenue = monthlyRevenue * 12;
    const avgTicket = (drinks + food) > 0 ? dailyTotal / (drinks + food) : 0;
    return {
      primary: { label: "Daily Revenue", value: "$" + formatNumber(Math.round(dailyTotal)) },
      details: [
        { label: "Daily Drink Revenue", value: "$" + formatNumber(Math.round(dailyDrinkRev)) },
        { label: "Daily Food Revenue", value: "$" + formatNumber(Math.round(dailyFoodRev)) },
        { label: "Average Ticket", value: "$" + formatNumber(Math.round(avgTicket * 100) / 100) },
        { label: "Monthly Revenue", value: "$" + formatNumber(Math.round(monthlyRevenue)) },
        { label: "Annual Revenue (est.)", value: "$" + formatNumber(Math.round(annualRevenue)) }
      ]
    };
  }`,
  [
    { q: "How much revenue does an average coffee shop make?", a: "An average coffee shop generates $500 to $2,000 per day in revenue, or roughly $200,000 to $600,000 annually. High-traffic locations in urban areas can exceed $1 million per year." },
    { q: "What is the average profit margin for a coffee shop?", a: "Coffee shops typically achieve a net profit margin of 5 to 15 percent. Drinks have high margins of 65 to 80 percent, while food items run 50 to 65 percent. Rent and labor are the largest expenses." },
    { q: "How can I increase coffee shop revenue?", a: "Boost average ticket with upselling, add food and pastry options, introduce loyalty programs, expand into catering and wholesale, offer seasonal specials, and extend operating hours to capture more dayparts." }
  ],
  `Daily Revenue = (Drinks Sold x Avg Drink Price) + (Food Items x Avg Food Price)
Monthly Revenue = Daily Revenue x Days Open
Average Ticket = Daily Revenue / Total Items Sold`,
  ["restaurant-profit-margin-calculator", "bakery-ingredient-cost-calculator"]
);

add(
  "restaurant-labor-cost-percentage-calculator",
  "Restaurant Labor Cost Percentage Calculator",
  "Calculate your restaurant labor cost as a percentage of revenue including wages, benefits, payroll taxes, and overtime for all staff categories.",
  "Finance",
  "finance",
  "$",
  ["restaurant labor cost", "labor cost percentage", "restaurant payroll", "staff cost ratio"],
  [
    '{ name: "monthlyRevenue", label: "Monthly Revenue ($)", type: "number", min: 1000, max: 5000000, defaultValue: 80000 }',
    '{ name: "fohWages", label: "Front-of-House Wages ($)", type: "number", min: 0, max: 1000000, defaultValue: 12000 }',
    '{ name: "bohWages", label: "Back-of-House Wages ($)", type: "number", min: 0, max: 1000000, defaultValue: 10000 }',
    '{ name: "managementSalaries", label: "Management Salaries ($)", type: "number", min: 0, max: 500000, defaultValue: 5500 }',
    '{ name: "payrollTaxPct", label: "Payroll Taxes and Benefits (%)", type: "number", min: 0, max: 40, defaultValue: 12 }'
  ],
  `(inputs) => {
    const revenue = inputs.monthlyRevenue as number;
    const foh = inputs.fohWages as number;
    const boh = inputs.bohWages as number;
    const mgmt = inputs.managementSalaries as number;
    const taxPct = inputs.payrollTaxPct as number / 100;
    const baseLabor = foh + boh + mgmt;
    const taxes = baseLabor * taxPct;
    const totalLabor = baseLabor + taxes;
    const laborPct = revenue > 0 ? (totalLabor / revenue) * 100 : 0;
    const fohPct = revenue > 0 ? (foh / revenue) * 100 : 0;
    const bohPct = revenue > 0 ? (boh / revenue) * 100 : 0;
    return {
      primary: { label: "Total Labor Cost %", value: formatNumber(Math.round(laborPct * 10) / 10) + "%" },
      details: [
        { label: "Total Labor Cost", value: "$" + formatNumber(Math.round(totalLabor)) },
        { label: "Base Wages (before taxes)", value: "$" + formatNumber(Math.round(baseLabor)) },
        { label: "Payroll Taxes and Benefits", value: "$" + formatNumber(Math.round(taxes)) },
        { label: "FOH Labor %", value: formatNumber(Math.round(fohPct * 10) / 10) + "%" },
        { label: "BOH Labor %", value: formatNumber(Math.round(bohPct * 10) / 10) + "%" }
      ]
    };
  }`,
  [
    { q: "What should restaurant labor cost percentage be?", a: "Restaurant labor cost should be 25 to 35 percent of total revenue. Full-service restaurants run 30 to 35 percent, fast casual 25 to 30 percent, and quick-service 20 to 25 percent. Prime cost (food plus labor) should stay under 65 percent." },
    { q: "How can I reduce labor costs without cutting staff?", a: "Cross-train employees to cover multiple roles, optimize scheduling using sales forecasts, reduce overtime through better shift planning, invest in kitchen technology, streamline prep processes, and use part-time staff during peak hours." },
    { q: "What is prime cost in a restaurant?", a: "Prime cost is the sum of total food and beverage cost plus total labor cost. It is the single most important metric for restaurant profitability. A well-managed restaurant keeps prime cost between 55 and 65 percent of revenue." }
  ],
  `Total Labor = FOH Wages + BOH Wages + Management + Payroll Taxes
Labor Cost % = (Total Labor / Revenue) x 100`,
  ["restaurant-profit-margin-calculator", "tip-pool-distribution-calculator"]
);

add(
  "inventory-turnover-rate-calculator",
  "Restaurant Inventory Turnover Rate Calculator",
  "Measure how efficiently your restaurant uses inventory by calculating turnover rate, average days on hand, and cost of goods sold ratios.",
  "Finance",
  "finance",
  "$",
  ["inventory turnover rate", "restaurant inventory efficiency", "COGS ratio", "stock turnover"],
  [
    '{ name: "cogsMonthly", label: "Monthly Cost of Goods Sold ($)", type: "number", min: 100, max: 2000000, defaultValue: 24000 }',
    '{ name: "beginInventory", label: "Beginning Inventory Value ($)", type: "number", min: 100, max: 500000, defaultValue: 8000 }',
    '{ name: "endInventory", label: "Ending Inventory Value ($)", type: "number", min: 100, max: 500000, defaultValue: 6000 }',
    '{ name: "monthlyRevenue", label: "Monthly Revenue ($)", type: "number", min: 100, max: 5000000, defaultValue: 80000 }'
  ],
  `(inputs) => {
    const cogs = inputs.cogsMonthly as number;
    const beginInv = inputs.beginInventory as number;
    const endInv = inputs.endInventory as number;
    const revenue = inputs.monthlyRevenue as number;
    const avgInventory = (beginInv + endInv) / 2;
    const turnoverRate = avgInventory > 0 ? cogs / avgInventory : 0;
    const daysOnHand = turnoverRate > 0 ? 30 / turnoverRate : 0;
    const cogsPct = revenue > 0 ? (cogs / revenue) * 100 : 0;
    const annualTurnover = turnoverRate * 12;
    return {
      primary: { label: "Monthly Turnover Rate", value: formatNumber(Math.round(turnoverRate * 100) / 100) + "x" },
      details: [
        { label: "Average Inventory Value", value: "$" + formatNumber(Math.round(avgInventory)) },
        { label: "Days of Inventory on Hand", value: formatNumber(Math.round(daysOnHand * 10) / 10) + " days" },
        { label: "COGS as % of Revenue", value: formatNumber(Math.round(cogsPct * 10) / 10) + "%" },
        { label: "Annualized Turnover Rate", value: formatNumber(Math.round(annualTurnover * 10) / 10) + "x" }
      ]
    };
  }`,
  [
    { q: "What is a good inventory turnover rate for restaurants?", a: "Restaurants should turn over their food inventory 4 to 8 times per month. Perishable items like produce should turn over daily or every 2 to 3 days, while dry goods and shelf-stable items may turn over weekly or biweekly." },
    { q: "How does inventory turnover affect profitability?", a: "Higher turnover means less money tied up in stock, lower waste from spoilage, and fresher ingredients. Low turnover indicates overstocking, potential waste, and cash flow problems." },
    { q: "How do I improve inventory turnover?", a: "Implement FIFO (first in, first out) rotation, order more frequently in smaller quantities, track waste and spoilage, use inventory management software, conduct regular counts, and adjust pars based on actual usage data." }
  ],
  `Average Inventory = (Beginning Inventory + Ending Inventory) / 2
Turnover Rate = Cost of Goods Sold / Average Inventory
Days on Hand = 30 / Turnover Rate`,
  ["food-waste-cost-calculator", "food-cost-percentage-calculator"]
);

add(
  "plate-cost-calculator",
  "Plate Cost Calculator",
  "Break down the exact cost of each plate by entering individual ingredient weights and unit prices to optimize recipe profitability and portion control.",
  "Finance",
  "finance",
  "$",
  ["plate cost", "dish cost breakdown", "recipe costing", "portion cost calculator"],
  [
    '{ name: "proteinCost", label: "Protein Cost ($)", type: "number", min: 0, max: 200, defaultValue: 3.50 }',
    '{ name: "starchCost", label: "Starch/Grain Cost ($)", type: "number", min: 0, max: 50, defaultValue: 0.45 }',
    '{ name: "vegetableCost", label: "Vegetable/Side Cost ($)", type: "number", min: 0, max: 50, defaultValue: 0.80 }',
    '{ name: "sauceCost", label: "Sauce/Dressing Cost ($)", type: "number", min: 0, max: 50, defaultValue: 0.35 }',
    '{ name: "garnishCost", label: "Garnish and Extras ($)", type: "number", min: 0, max: 50, defaultValue: 0.20 }',
    '{ name: "sellingPrice", label: "Menu Selling Price ($)", type: "number", min: 1, max: 500, defaultValue: 18.00 }'
  ],
  `(inputs) => {
    const protein = inputs.proteinCost as number;
    const starch = inputs.starchCost as number;
    const veg = inputs.vegetableCost as number;
    const sauce = inputs.sauceCost as number;
    const garnish = inputs.garnishCost as number;
    const price = inputs.sellingPrice as number;
    const totalCost = protein + starch + veg + sauce + garnish;
    const foodCostPct = price > 0 ? (totalCost / price) * 100 : 0;
    const grossProfit = price - totalCost;
    const grossMargin = price > 0 ? (grossProfit / price) * 100 : 0;
    const proteinPct = totalCost > 0 ? (protein / totalCost) * 100 : 0;
    return {
      primary: { label: "Total Plate Cost", value: "$" + formatNumber(Math.round(totalCost * 100) / 100) },
      details: [
        { label: "Food Cost Percentage", value: formatNumber(Math.round(foodCostPct * 10) / 10) + "%" },
        { label: "Gross Profit Per Plate", value: "$" + formatNumber(Math.round(grossProfit * 100) / 100) },
        { label: "Gross Margin", value: formatNumber(Math.round(grossMargin * 10) / 10) + "%" },
        { label: "Protein % of Plate Cost", value: formatNumber(Math.round(proteinPct * 10) / 10) + "%" }
      ]
    };
  }`,
  [
    { q: "What is plate costing?", a: "Plate costing is the process of calculating the exact ingredient cost of every component on a dish. It accounts for protein, starch, vegetables, sauces, garnishes, and any condiments to determine the total food cost per serving." },
    { q: "What percentage of plate cost is typically protein?", a: "Protein is usually the most expensive component, accounting for 50 to 70 percent of total plate cost. Managing protein portions is the most effective way to control overall food cost." },
    { q: "How often should I recalculate plate costs?", a: "Recalculate plate costs monthly or whenever ingredient prices change significantly. Seasonal price fluctuations, supplier changes, and recipe modifications all warrant a fresh plate cost analysis." }
  ],
  `Total Plate Cost = Protein + Starch + Vegetable + Sauce + Garnish
Food Cost % = (Total Plate Cost / Menu Price) x 100
Gross Profit = Menu Price - Total Plate Cost`,
  ["food-cost-percentage-calculator", "menu-pricing-calculator"]
);

add(
  "banquet-hall-rental-cost-calculator",
  "Banquet Hall Rental Cost Calculator",
  "Estimate total banquet hall rental costs by entering room size, event duration, catering needs, and additional services like AV equipment and decor.",
  "Finance",
  "finance",
  "$",
  ["banquet hall rental", "event venue cost", "banquet room pricing", "reception hall cost"],
  [
    '{ name: "guestCount", label: "Number of Guests", type: "number", min: 20, max: 2000, defaultValue: 150 }',
    '{ name: "venueType", label: "Venue Type", type: "select", options: [{ value: "1", label: "Basic Hall ($500-1500)" }, { value: "2", label: "Mid-Range Venue ($1500-4000)" }, { value: "3", label: "Upscale Venue ($4000-10000)" }, { value: "4", label: "Luxury Venue ($10000+)" }], defaultValue: "2" }',
    '{ name: "eventHours", label: "Event Duration (hours)", type: "number", min: 1, max: 24, defaultValue: 5 }',
    '{ name: "cateringPerHead", label: "Catering Per Person ($)", type: "number", min: 0, max: 300, defaultValue: 55 }',
    '{ name: "avDecor", label: "AV, Decor and Extras ($)", type: "number", min: 0, max: 50000, defaultValue: 2000 }'
  ],
  `(inputs) => {
    const guests = inputs.guestCount as number;
    const venue = parseInt(inputs.venueType as string);
    const hours = inputs.eventHours as number;
    const catering = inputs.cateringPerHead as number;
    const extras = inputs.avDecor as number;
    const venueBase = { 1: 1000, 2: 2750, 3: 7000, 4: 15000 };
    const base = venueBase[venue] || 2750;
    const hourlyExtra = hours > 5 ? (hours - 5) * (base * 0.1) : 0;
    const venueCost = base + hourlyExtra;
    const cateringTotal = guests * catering;
    const grandTotal = venueCost + cateringTotal + extras;
    const perGuestTotal = guests > 0 ? grandTotal / guests : 0;
    return {
      primary: { label: "Total Event Cost", value: "$" + formatNumber(Math.round(grandTotal)) },
      details: [
        { label: "Venue Rental", value: "$" + formatNumber(Math.round(venueCost)) },
        { label: "Total Catering", value: "$" + formatNumber(Math.round(cateringTotal)) },
        { label: "AV, Decor and Extras", value: "$" + formatNumber(Math.round(extras)) },
        { label: "Cost Per Guest", value: "$" + formatNumber(Math.round(perGuestTotal * 100) / 100) }
      ]
    };
  }`,
  [
    { q: "How much does it cost to rent a banquet hall?", a: "Banquet hall rentals range from $500 to $2,000 for basic community halls, $1,500 to $5,000 for mid-range venues, and $5,000 to $20,000 or more for upscale or luxury venues. Pricing varies by location, day of week, and season." },
    { q: "What is included in a banquet hall rental?", a: "Basic rentals typically include the space, tables, chairs, and basic cleanup. Upgraded packages may include table linens, place settings, staff, parking, and a bridal suite. Catering, bar, AV, and decor are usually separate." },
    { q: "How do I choose the right size banquet hall?", a: "Plan for 12 to 15 square feet per seated guest or 6 to 8 square feet for standing receptions. A 200-guest seated dinner needs about 2,500 to 3,000 square feet of dining space plus room for buffet, bar, and dance floor." }
  ],
  `Venue Cost = Base Rental + Extra Hours Charge
Total Catering = Guests x Catering Per Person
Grand Total = Venue Cost + Total Catering + AV/Decor/Extras`,
  ["catering-cost-per-head-calculator", "buffet-quantity-calculator"]
);

add(
  "buffet-quantity-calculator",
  "Buffet Quantity Calculator",
  "Calculate how much food to prepare for a buffet event based on guest count, event duration, and number of menu items to avoid shortages and waste.",
  "Everyday",
  "everyday",
  "~",
  ["buffet quantity", "buffet food amount", "event food quantity", "how much food for buffet"],
  [
    '{ name: "guestCount", label: "Number of Guests", type: "number", min: 10, max: 2000, defaultValue: 100 }',
    '{ name: "eventDuration", label: "Event Duration (hours)", type: "number", min: 1, max: 12, defaultValue: 3 }',
    '{ name: "mealType", label: "Meal Type", type: "select", options: [{ value: "1", label: "Light Appetizers" }, { value: "2", label: "Heavy Appetizers / Cocktail" }, { value: "3", label: "Full Lunch Buffet" }, { value: "4", label: "Full Dinner Buffet" }], defaultValue: "4" }',
    '{ name: "numEntrees", label: "Number of Entree Options", type: "number", min: 1, max: 10, defaultValue: 3 }',
    '{ name: "numSides", label: "Number of Side Options", type: "number", min: 1, max: 10, defaultValue: 4 }'
  ],
  `(inputs) => {
    const guests = inputs.guestCount as number;
    const hours = inputs.eventDuration as number;
    const meal = parseInt(inputs.mealType as string);
    const entrees = inputs.numEntrees as number;
    const sides = inputs.numSides as number;
    const proteinOzPerGuest = { 1: 2, 2: 4, 3: 5, 4: 6 };
    const starchOzPerGuest = { 1: 1, 2: 3, 3: 4, 4: 5 };
    const proteinOz = (proteinOzPerGuest[meal] || 6) * guests;
    const starchOz = (starchOzPerGuest[meal] || 5) * guests;
    const veggieOz = guests * 4;
    const saladOz = guests * 2;
    const overage = 1.1;
    const totalProteinLbs = Math.ceil((proteinOz * overage) / 16);
    const totalStarchLbs = Math.ceil((starchOz * overage) / 16);
    const totalVegLbs = Math.ceil((veggieOz * overage) / 16);
    const totalSaladLbs = Math.ceil((saladOz * overage) / 16);
    const proteinPerEntree = Math.ceil(totalProteinLbs / entrees);
    const starchPerSide = Math.ceil(totalStarchLbs / sides);
    return {
      primary: { label: "Total Protein Needed", value: formatNumber(totalProteinLbs) + " lbs" },
      details: [
        { label: "Protein Per Entree Option", value: formatNumber(proteinPerEntree) + " lbs" },
        { label: "Total Starch/Grain", value: formatNumber(totalStarchLbs) + " lbs" },
        { label: "Starch Per Side Option", value: formatNumber(starchPerSide) + " lbs" },
        { label: "Total Vegetables", value: formatNumber(totalVegLbs) + " lbs" },
        { label: "Total Salad", value: formatNumber(totalSaladLbs) + " lbs" }
      ]
    };
  }`,
  [
    { q: "How much food do I need per person for a buffet?", a: "For a full dinner buffet, plan 6 ounces of protein, 5 ounces of starch, and 4 ounces of vegetables per person. For lighter events plan 3 to 4 ounces of protein. Always add 10 percent overage." },
    { q: "How do multiple entree options affect quantity?", a: "With multiple entrees, divide total protein needed by the number of options. Guests tend to take smaller portions of each when there are more choices. Three entree options is the sweet spot for variety without waste." },
    { q: "How do I reduce buffet food waste?", a: "Use smaller serving vessels and replenish frequently, offer fewer but well-chosen options, use action stations where food is prepared to order, and have take-away containers for guests at the end of the event." }
  ],
  `Total Protein (lbs) = (Oz Per Guest x Guest Count x 1.10 overage) / 16
Per Entree Option = Total Protein / Number of Entrees
Total Starch (lbs) = (Oz Per Guest x Guest Count x 1.10) / 16`,
  ["catering-cost-per-head-calculator", "banquet-hall-rental-cost-calculator"]
);

add(
  "food-waste-cost-calculator",
  "Food Waste Cost Calculator",
  "Calculate the financial impact of food waste in your restaurant by tracking waste percentages across categories and identifying cost-saving opportunities.",
  "Finance",
  "finance",
  "$",
  ["food waste cost", "restaurant waste", "food spoilage cost", "kitchen waste calculator"],
  [
    '{ name: "monthlyFoodPurchases", label: "Monthly Food Purchases ($)", type: "number", min: 500, max: 2000000, defaultValue: 25000 }',
    '{ name: "prepWastePct", label: "Prep Waste (%)", type: "number", min: 0, max: 30, defaultValue: 5 }',
    '{ name: "spoilageWastePct", label: "Spoilage Waste (%)", type: "number", min: 0, max: 30, defaultValue: 3 }',
    '{ name: "overproductionPct", label: "Overproduction Waste (%)", type: "number", min: 0, max: 30, defaultValue: 4 }',
    '{ name: "plateWastePct", label: "Plate Waste (%)", type: "number", min: 0, max: 20, defaultValue: 2 }'
  ],
  `(inputs) => {
    const purchases = inputs.monthlyFoodPurchases as number;
    const prep = inputs.prepWastePct as number / 100;
    const spoilage = inputs.spoilageWastePct as number / 100;
    const overprod = inputs.overproductionPct as number / 100;
    const plate = inputs.plateWastePct as number / 100;
    const totalWastePct = prep + spoilage + overprod + plate;
    const totalWasteCost = purchases * totalWastePct;
    const prepCost = purchases * prep;
    const spoilageCost = purchases * spoilage;
    const overprodCost = purchases * overprod;
    const plateCost = purchases * plate;
    const annualWaste = totalWasteCost * 12;
    return {
      primary: { label: "Monthly Waste Cost", value: "$" + formatNumber(Math.round(totalWasteCost)) },
      details: [
        { label: "Total Waste Percentage", value: formatNumber(Math.round(totalWastePct * 1000) / 10) + "%" },
        { label: "Prep Waste Cost", value: "$" + formatNumber(Math.round(prepCost)) },
        { label: "Spoilage Cost", value: "$" + formatNumber(Math.round(spoilageCost)) },
        { label: "Overproduction Cost", value: "$" + formatNumber(Math.round(overprodCost)) },
        { label: "Plate Waste Cost", value: "$" + formatNumber(Math.round(plateCost)) },
        { label: "Annual Waste Cost", value: "$" + formatNumber(Math.round(annualWaste)) }
      ]
    };
  }`,
  [
    { q: "How much food does the average restaurant waste?", a: "The average restaurant wastes 4 to 10 percent of purchased food. This translates to about $2,000 to $10,000 per month depending on size and type, costing the U.S. restaurant industry an estimated $25 billion per year." },
    { q: "What are the main causes of restaurant food waste?", a: "The top causes are overproduction and over-prepping, spoilage from improper storage, large portion sizes leading to plate waste, menu items that do not sell well, and inefficient inventory management." },
    { q: "How can I reduce food waste in my restaurant?", a: "Implement strict FIFO rotation, right-size your pars and prep sheets, use daily specials to repurpose ingredients, train staff on proper storage, track waste daily in a waste log, and adjust menu offerings based on actual sales data." }
  ],
  `Total Waste % = Prep Waste % + Spoilage % + Overproduction % + Plate Waste %
Monthly Waste Cost = Monthly Food Purchases x Total Waste %
Annual Waste Cost = Monthly Waste Cost x 12`,
  ["inventory-turnover-rate-calculator", "food-cost-percentage-calculator"]
);

add(
  "delivery-service-commission-calculator",
  "Delivery Service Commission Calculator",
  "Compare the true cost of third-party delivery platforms by calculating commission fees, service charges, and net revenue per order across different providers.",
  "Finance",
  "finance",
  "$",
  ["delivery commission", "food delivery fees", "third party delivery cost", "restaurant delivery profit"],
  [
    '{ name: "avgOrderValue", label: "Average Order Value ($)", type: "number", min: 5, max: 500, defaultValue: 35 }',
    '{ name: "commissionPct", label: "Platform Commission (%)", type: "number", min: 5, max: 40, defaultValue: 25 }',
    '{ name: "monthlyOrders", label: "Monthly Delivery Orders", type: "number", min: 10, max: 10000, defaultValue: 400 }',
    '{ name: "foodCostPct", label: "Food Cost (%)", type: "number", min: 15, max: 50, defaultValue: 30 }',
    '{ name: "packagingCost", label: "Packaging Cost Per Order ($)", type: "number", min: 0, max: 10, defaultValue: 1.50 }'
  ],
  `(inputs) => {
    const orderVal = inputs.avgOrderValue as number;
    const commission = inputs.commissionPct as number / 100;
    const orders = inputs.monthlyOrders as number;
    const foodPct = inputs.foodCostPct as number / 100;
    const packaging = inputs.packagingCost as number;
    const commissionPerOrder = orderVal * commission;
    const foodCostPerOrder = orderVal * foodPct;
    const netPerOrder = orderVal - commissionPerOrder - foodCostPerOrder - packaging;
    const monthlyCommission = commissionPerOrder * orders;
    const monthlyNet = netPerOrder * orders;
    const effectiveMargin = orderVal > 0 ? (netPerOrder / orderVal) * 100 : 0;
    return {
      primary: { label: "Net Revenue Per Order", value: "$" + formatNumber(Math.round(netPerOrder * 100) / 100) },
      details: [
        { label: "Commission Per Order", value: "$" + formatNumber(Math.round(commissionPerOrder * 100) / 100) },
        { label: "Food Cost Per Order", value: "$" + formatNumber(Math.round(foodCostPerOrder * 100) / 100) },
        { label: "Monthly Commission Paid", value: "$" + formatNumber(Math.round(monthlyCommission)) },
        { label: "Monthly Net Revenue", value: "$" + formatNumber(Math.round(monthlyNet)) },
        { label: "Effective Margin", value: formatNumber(Math.round(effectiveMargin * 10) / 10) + "%" }
      ]
    };
  }`,
  [
    { q: "How much do delivery apps charge restaurants?", a: "Major delivery platforms charge restaurants 15 to 30 percent commission per order. Basic listings run 15 to 20 percent, while promoted placements and full delivery service can cost 25 to 30 percent or more." },
    { q: "Is third-party delivery profitable for restaurants?", a: "Margins are thin after commission, food cost, and packaging. Many restaurants raise delivery menu prices 10 to 20 percent to offset commissions. Delivery is most profitable when it brings incremental volume without requiring additional fixed costs." },
    { q: "Should I build my own delivery service?", a: "In-house delivery typically costs 10 to 15 percent of revenue versus 25 to 30 percent for third-party apps. However, it requires hiring drivers, insurance, and managing logistics. A hybrid approach using both is common." }
  ],
  `Commission Per Order = Order Value x Commission %
Net Per Order = Order Value - Commission - Food Cost - Packaging
Monthly Net Revenue = Net Per Order x Monthly Orders`,
  ["restaurant-profit-margin-calculator", "food-cost-percentage-calculator"]
);

add(
  "happy-hour-profit-calculator",
  "Happy Hour Profit Calculator",
  "Analyze the profitability of your happy hour program by comparing discounted pricing, increased volume, and food sales to determine if promotions boost overall profit.",
  "Finance",
  "finance",
  "$",
  ["happy hour profit", "drink discount profit", "bar promotion analysis", "happy hour revenue"],
  [
    '{ name: "regularDrinkPrice", label: "Regular Avg Drink Price ($)", type: "number", min: 3, max: 50, defaultValue: 12 }',
    '{ name: "happyHourDiscount", label: "Happy Hour Discount (%)", type: "number", min: 10, max: 60, defaultValue: 30 }',
    '{ name: "regularDrinksPerHour", label: "Drinks Sold Per Hour (Regular)", type: "number", min: 5, max: 500, defaultValue: 25 }',
    '{ name: "happyHourDrinksPerHour", label: "Drinks Sold Per Hour (Happy Hour)", type: "number", min: 5, max: 500, defaultValue: 55 }',
    '{ name: "happyHourDuration", label: "Happy Hour Duration (hours)", type: "number", min: 1, max: 6, defaultValue: 2 }',
    '{ name: "avgFoodPerGuest", label: "Avg Food Spend Per Guest ($)", type: "number", min: 0, max: 50, defaultValue: 8 }',
    '{ name: "pourCostPct", label: "Pour Cost (%)", type: "number", min: 10, max: 40, defaultValue: 22 }'
  ],
  `(inputs) => {
    const regPrice = inputs.regularDrinkPrice as number;
    const discount = inputs.happyHourDiscount as number / 100;
    const regDrinks = inputs.regularDrinksPerHour as number;
    const hhDrinks = inputs.happyHourDrinksPerHour as number;
    const duration = inputs.happyHourDuration as number;
    const foodSpend = inputs.avgFoodPerGuest as number;
    const pourCost = inputs.pourCostPct as number / 100;
    const hhPrice = regPrice * (1 - discount);
    const costPerDrink = regPrice * pourCost;
    const regProfitPerHour = regDrinks * (regPrice - costPerDrink);
    const hhDrinkProfit = hhDrinks * (hhPrice - costPerDrink);
    const hhFoodRevenue = hhDrinks * foodSpend * 0.5;
    const hhFoodProfit = hhFoodRevenue * 0.6;
    const hhTotalPerHour = hhDrinkProfit + hhFoodProfit;
    const totalHHProfit = hhTotalPerHour * duration;
    const regularEquiv = regProfitPerHour * duration;
    const netDifference = totalHHProfit - regularEquiv;
    return {
      primary: { label: "Happy Hour Total Profit", value: "$" + formatNumber(Math.round(totalHHProfit)) },
      details: [
        { label: "Happy Hour Drink Price", value: "$" + formatNumber(Math.round(hhPrice * 100) / 100) },
        { label: "HH Drink Profit / Hour", value: "$" + formatNumber(Math.round(hhDrinkProfit)) },
        { label: "HH Food Profit / Hour", value: "$" + formatNumber(Math.round(hhFoodProfit)) },
        { label: "Equivalent Regular Period Profit", value: "$" + formatNumber(Math.round(regularEquiv)) },
        { label: "Net Gain/Loss vs Regular", value: (netDifference >= 0 ? "$" : "-$") + formatNumber(Math.round(Math.abs(netDifference))) }
      ]
    };
  }`,
  [
    { q: "Is happy hour profitable for restaurants?", a: "Happy hour can be very profitable when it drives significantly higher volume and food sales. The key is that increased guest count and food spending offset the lower drink margins. Most successful programs double or triple drink volume." },
    { q: "What is a good happy hour discount?", a: "Most restaurants offer 20 to 40 percent off drinks and select appetizers during happy hour. Half-price drinks are common. The discount should be enough to drive traffic but not so deep that margins disappear." },
    { q: "How can I maximize happy hour profit?", a: "Promote high-margin food items alongside drink specials, offer discounted appetizers to increase food attach rate, time happy hour to fill slow periods, limit the discount to well drinks and select beers, and create a fun atmosphere to encourage return visits." }
  ],
  `HH Drink Price = Regular Price x (1 - Discount %)
HH Drink Profit/Hr = HH Drinks/Hr x (HH Price - Cost Per Drink)
Net Gain = Total HH Profit - Equivalent Regular Period Profit`,
  ["bar-pour-cost-calculator", "cocktail-recipe-cost-calculator"]
);

add(
  "cocktail-recipe-cost-calculator",
  "Cocktail Recipe Cost Calculator",
  "Calculate the exact cost of any cocktail recipe by adding up each spirit, mixer, and garnish component to determine pour cost and optimal pricing.",
  "Finance",
  "finance",
  "$",
  ["cocktail recipe cost", "mixed drink cost", "cocktail pricing", "drink recipe calculator"],
  [
    '{ name: "spirit1Cost", label: "Primary Spirit (cost per oz) ($)", type: "number", min: 0, max: 50, defaultValue: 1.65 }',
    '{ name: "spirit1Oz", label: "Primary Spirit (oz)", type: "number", min: 0, max: 6, defaultValue: 2 }',
    '{ name: "spirit2Cost", label: "Secondary Spirit/Liqueur (cost per oz) ($)", type: "number", min: 0, max: 50, defaultValue: 1.20 }',
    '{ name: "spirit2Oz", label: "Secondary Spirit/Liqueur (oz)", type: "number", min: 0, max: 6, defaultValue: 0.75 }',
    '{ name: "mixerCost", label: "Mixers and Juice (total) ($)", type: "number", min: 0, max: 10, defaultValue: 0.40 }',
    '{ name: "garnishCost", label: "Garnish Cost ($)", type: "number", min: 0, max: 5, defaultValue: 0.25 }',
    '{ name: "targetPourCost", label: "Target Pour Cost (%)", type: "number", min: 10, max: 40, defaultValue: 20 }'
  ],
  `(inputs) => {
    const s1Cost = inputs.spirit1Cost as number;
    const s1Oz = inputs.spirit1Oz as number;
    const s2Cost = inputs.spirit2Cost as number;
    const s2Oz = inputs.spirit2Oz as number;
    const mixer = inputs.mixerCost as number;
    const garnish = inputs.garnishCost as number;
    const targetPct = inputs.targetPourCost as number;
    const spirit1Total = s1Cost * s1Oz;
    const spirit2Total = s2Cost * s2Oz;
    const totalCost = spirit1Total + spirit2Total + mixer + garnish;
    const idealPrice = targetPct > 0 ? totalCost / (targetPct / 100) : 0;
    const profitAtIdeal = idealPrice - totalCost;
    return {
      primary: { label: "Total Cocktail Cost", value: "$" + formatNumber(Math.round(totalCost * 100) / 100) },
      details: [
        { label: "Primary Spirit Cost", value: "$" + formatNumber(Math.round(spirit1Total * 100) / 100) },
        { label: "Secondary Spirit Cost", value: "$" + formatNumber(Math.round(spirit2Total * 100) / 100) },
        { label: "Mixers and Garnish", value: "$" + formatNumber(Math.round((mixer + garnish) * 100) / 100) },
        { label: "Ideal Menu Price (at target %)", value: "$" + formatNumber(Math.round(idealPrice * 100) / 100) },
        { label: "Profit at Ideal Price", value: "$" + formatNumber(Math.round(profitAtIdeal * 100) / 100) }
      ]
    };
  }`,
  [
    { q: "What is the average cost to make a cocktail?", a: "A standard cocktail costs $1.50 to $4.50 to make depending on the spirits used. Well drinks cost about $1.00 to $2.00, call drinks $2.00 to $3.50, and premium cocktails $3.50 to $6.00 or more." },
    { q: "How should I price cocktails on my menu?", a: "Price cocktails at 4 to 5 times ingredient cost for a 20 to 25 percent pour cost. A cocktail that costs $3.00 to make should sell for $12 to $15. Consider also the perceived value, presentation, and competition." },
    { q: "What cocktails have the best profit margins?", a: "Simple highballs and spirit-forward drinks using well spirits have the best margins. Moscow Mules, Gin and Tonics, and Margaritas are perennial profit leaders. Drinks with expensive liqueurs or fresh juices have lower margins." }
  ],
  `Total Cost = (Spirit 1 Cost x Oz) + (Spirit 2 Cost x Oz) + Mixers + Garnish
Ideal Menu Price = Total Cost / (Target Pour Cost % / 100)
Profit = Ideal Menu Price - Total Cost`,
  ["bar-pour-cost-calculator", "happy-hour-profit-calculator"]
);

add(
  "food-trailer-licensing-cost-calculator",
  "Food Trailer Licensing Cost Calculator",
  "Estimate all licensing, permit, and registration costs required to legally operate a food trailer or mobile food vending business in your area.",
  "Finance",
  "finance",
  "$",
  ["food trailer license", "mobile food permit", "food truck permits", "food vendor license cost"],
  [
    '{ name: "businessLicense", label: "Business License ($)", type: "number", min: 0, max: 5000, defaultValue: 250 }',
    '{ name: "healthPermit", label: "Health Department Permit ($)", type: "number", min: 0, max: 5000, defaultValue: 500 }',
    '{ name: "fireSafety", label: "Fire Safety Inspection ($)", type: "number", min: 0, max: 2000, defaultValue: 200 }',
    '{ name: "mobileVendor", label: "Mobile Vendor Permit ($)", type: "number", min: 0, max: 5000, defaultValue: 400 }',
    '{ name: "vehicleRegistration", label: "Vehicle Registration ($)", type: "number", min: 0, max: 2000, defaultValue: 150 }',
    '{ name: "commissaryFee", label: "Monthly Commissary Fee ($)", type: "number", min: 0, max: 3000, defaultValue: 500 }',
    '{ name: "liabilityInsurance", label: "Annual Liability Insurance ($)", type: "number", min: 500, max: 15000, defaultValue: 3000 }'
  ],
  `(inputs) => {
    const business = inputs.businessLicense as number;
    const health = inputs.healthPermit as number;
    const fire = inputs.fireSafety as number;
    const vendor = inputs.mobileVendor as number;
    const registration = inputs.vehicleRegistration as number;
    const commissary = inputs.commissaryFee as number;
    const insurance = inputs.liabilityInsurance as number;
    const oneTimeTotal = business + health + fire + vendor + registration;
    const annualRecurring = (commissary * 12) + insurance;
    const firstYearTotal = oneTimeTotal + annualRecurring;
    const monthlyLicensingCost = Math.round(firstYearTotal / 12);
    return {
      primary: { label: "First Year Total Cost", value: "$" + formatNumber(Math.round(firstYearTotal)) },
      details: [
        { label: "One-Time Permits and Licenses", value: "$" + formatNumber(Math.round(oneTimeTotal)) },
        { label: "Annual Recurring Costs", value: "$" + formatNumber(Math.round(annualRecurring)) },
        { label: "Monthly Commissary", value: "$" + formatNumber(Math.round(commissary)) },
        { label: "Monthly Insurance", value: "$" + formatNumber(Math.round(insurance / 12)) },
        { label: "Average Monthly Licensing Cost", value: "$" + formatNumber(monthlyLicensingCost) }
      ]
    };
  }`,
  [
    { q: "What permits do I need for a food trailer?", a: "Typical requirements include a business license, health department food service permit, fire safety inspection certificate, mobile food vendor permit, vehicle registration, liability insurance, and often a commissary agreement for prep and storage." },
    { q: "How much do food trailer permits cost?", a: "Total first-year permit and licensing costs range from $2,000 to $10,000 depending on your city and state. Annual renewal costs are typically 40 to 60 percent of first-year costs since one-time fees are not repeated." },
    { q: "What is a commissary kitchen requirement?", a: "Many cities require food trailers to operate from a licensed commissary kitchen for food prep, storage, and waste disposal. Commissary fees range from $300 to $1,500 per month depending on the facility and your usage level." }
  ],
  `One-Time Costs = Business License + Health Permit + Fire Safety + Vendor Permit + Registration
Annual Recurring = (Commissary x 12) + Insurance
First Year Total = One-Time Costs + Annual Recurring`,
  ["food-truck-startup-cost-calculator", "restaurant-break-even-calculator"]
);

add(
  "restaurant-break-even-calculator",
  "Restaurant Break-Even Calculator",
  "Determine how many covers or how much revenue your restaurant needs each month to break even after fixed costs, variable costs, and average check size.",
  "Finance",
  "finance",
  "$",
  ["restaurant break even", "break even analysis restaurant", "restaurant cover target", "food business break even"],
  [
    '{ name: "monthlyFixedCosts", label: "Monthly Fixed Costs ($)", type: "number", min: 1000, max: 500000, defaultValue: 18000 }',
    '{ name: "avgCheck", label: "Average Check Per Cover ($)", type: "number", min: 5, max: 300, defaultValue: 35 }',
    '{ name: "variableCostPct", label: "Variable Cost Per Cover (%)", type: "number", min: 20, max: 80, defaultValue: 55 }',
    '{ name: "daysOpen", label: "Operating Days Per Month", type: "number", min: 15, max: 31, defaultValue: 26 }'
  ],
  `(inputs) => {
    const fixed = inputs.monthlyFixedCosts as number;
    const avgCheck = inputs.avgCheck as number;
    const varPct = inputs.variableCostPct as number / 100;
    const days = inputs.daysOpen as number;
    const contributionPerCover = avgCheck * (1 - varPct);
    const breakEvenCovers = contributionPerCover > 0 ? Math.ceil(fixed / contributionPerCover) : 0;
    const breakEvenRevenue = breakEvenCovers * avgCheck;
    const coversPerDay = days > 0 ? Math.ceil(breakEvenCovers / days) : 0;
    const revenuePerDay = days > 0 ? Math.round(breakEvenRevenue / days) : 0;
    return {
      primary: { label: "Break-Even Covers Per Month", value: formatNumber(breakEvenCovers) },
      details: [
        { label: "Break-Even Revenue", value: "$" + formatNumber(breakEvenRevenue) },
        { label: "Contribution Per Cover", value: "$" + formatNumber(Math.round(contributionPerCover * 100) / 100) },
        { label: "Covers Needed Per Day", value: formatNumber(coversPerDay) },
        { label: "Revenue Needed Per Day", value: "$" + formatNumber(revenuePerDay) }
      ]
    };
  }`,
  [
    { q: "What is break-even analysis for a restaurant?", a: "Break-even analysis determines the point where total revenue equals total costs, meaning zero profit or loss. It tells you the minimum number of customers or revenue needed each month to cover all fixed and variable expenses." },
    { q: "What are typical fixed costs for a restaurant?", a: "Fixed costs include rent or mortgage, insurance, loan payments, management salaries, accounting and legal fees, equipment leases, and software subscriptions. These costs remain constant regardless of sales volume." },
    { q: "How long does it take a new restaurant to break even?", a: "Most new restaurants take 6 to 18 months to reach their break-even point. Some may take up to 2 years. Factors include location, concept, initial investment size, and how quickly the restaurant builds a steady customer base." }
  ],
  `Contribution Per Cover = Average Check x (1 - Variable Cost %)
Break-Even Covers = Monthly Fixed Costs / Contribution Per Cover
Break-Even Revenue = Break-Even Covers x Average Check`,
  ["restaurant-profit-margin-calculator", "restaurant-labor-cost-percentage-calculator"]
);

add(
  "commercial-kitchen-ventilation-calculator",
  "Commercial Kitchen Ventilation Calculator",
  "Calculate the required exhaust airflow (CFM) for your commercial kitchen hood based on hood size, cooking equipment type, and local code requirements.",
  "Science",
  "science",
  "A",
  ["kitchen ventilation CFM", "exhaust hood calculator", "commercial hood airflow", "kitchen ventilation requirements"],
  [
    '{ name: "hoodLength", label: "Hood Length (feet)", type: "number", min: 2, max: 30, defaultValue: 8 }',
    '{ name: "hoodWidth", label: "Hood Depth (feet)", type: "number", min: 2, max: 10, defaultValue: 4 }',
    '{ name: "equipmentType", label: "Cooking Equipment", type: "select", options: [{ value: "1", label: "Light Duty (ovens, steamers) - 200 CFM/ft" }, { value: "2", label: "Medium Duty (griddles, fryers) - 300 CFM/ft" }, { value: "3", label: "Heavy Duty (charbroilers, woks) - 400 CFM/ft" }, { value: "4", label: "Extra Heavy (solid fuel, mesquite) - 500 CFM/ft" }], defaultValue: "2" }',
    '{ name: "hoodStyle", label: "Hood Style", type: "select", options: [{ value: "1", label: "Wall-Mounted (canopy)" }, { value: "2", label: "Island (double) Hood" }], defaultValue: "1" }'
  ],
  `(inputs) => {
    const length = inputs.hoodLength as number;
    const width = inputs.hoodWidth as number;
    const equipment = parseInt(inputs.equipmentType as string);
    const style = parseInt(inputs.hoodStyle as string);
    const cfmPerFt = { 1: 200, 2: 300, 3: 400, 4: 500 };
    const ratePerFt = cfmPerFt[equipment] || 300;
    const baseCFM = ratePerFt * length;
    const styleMult = style === 2 ? 1.4 : 1.0;
    const requiredCFM = Math.round(baseCFM * styleMult);
    const makeupAir = Math.round(requiredCFM * 0.8);
    const hoodArea = length * width;
    const faceVelocity = hoodArea > 0 ? Math.round(requiredCFM / hoodArea) : 0;
    return {
      primary: { label: "Required Exhaust CFM", value: formatNumber(requiredCFM) + " CFM" },
      details: [
        { label: "Rate Per Linear Foot", value: formatNumber(ratePerFt) + " CFM/ft" },
        { label: "Hood Area", value: formatNumber(hoodArea) + " sq ft" },
        { label: "Face Velocity", value: formatNumber(faceVelocity) + " FPM" },
        { label: "Makeup Air (80%)", value: formatNumber(makeupAir) + " CFM" }
      ]
    };
  }`,
  [
    { q: "How do I calculate exhaust CFM for a kitchen hood?", a: "The standard method multiplies the linear foot length of the hood by a CFM rate based on equipment type: 200 CFM/ft for light duty, 300 for medium, 400 for heavy, and 500 for extra heavy. Island hoods require 40 percent more airflow." },
    { q: "What is makeup air in a commercial kitchen?", a: "Makeup air replaces the air removed by the exhaust hood to maintain neutral pressure in the kitchen. Typically 80 percent of exhaust volume should be replaced by a dedicated makeup air unit to prevent negative pressure issues." },
    { q: "What are common hood installation mistakes?", a: "Common mistakes include undersizing the exhaust fan, insufficient makeup air, placing the hood too high above equipment, improper overhang dimensions, and not accounting for cross-drafts from doors or HVAC vents that disrupt capture." }
  ],
  `Required CFM = CFM Per Linear Foot x Hood Length x Hood Style Multiplier
Makeup Air = Required CFM x 80%
Face Velocity = Required CFM / Hood Area`,
  ["kitchen-equipment-cost-calculator", "restaurant-break-even-calculator"]
);

add(
  "dishwasher-cycle-cost-calculator",
  "Dishwasher Cycle Cost Calculator",
  "Calculate the cost per cycle and monthly operating cost of a commercial dishwasher including water, electricity, detergent, and rinse aid consumption.",
  "Everyday",
  "everyday",
  "~",
  ["dishwasher cycle cost", "commercial dishwasher cost", "warewashing cost", "dish machine operating cost"],
  [
    '{ name: "machineType", label: "Machine Type", type: "select", options: [{ value: "1", label: "Under-counter (1 gal/cycle)" }, { value: "2", label: "Door-Type (2 gal/cycle)" }, { value: "3", label: "Conveyor (3.5 gal/cycle)" }, { value: "4", label: "Flight-Type (5 gal/cycle)" }], defaultValue: "2" }',
    '{ name: "cyclesPerDay", label: "Cycles Per Day", type: "number", min: 5, max: 500, defaultValue: 40 }',
    '{ name: "waterCost", label: "Water Cost Per 1000 Gallons ($)", type: "number", min: 1, max: 30, defaultValue: 8 }',
    '{ name: "electricityRate", label: "Electricity Rate ($/kWh)", type: "number", min: 0.05, max: 0.50, defaultValue: 0.14 }',
    '{ name: "detergentPerCycle", label: "Detergent Cost Per Cycle ($)", type: "number", min: 0.01, max: 2, defaultValue: 0.12 }',
    '{ name: "daysPerMonth", label: "Operating Days Per Month", type: "number", min: 15, max: 31, defaultValue: 26 }'
  ],
  `(inputs) => {
    const machine = parseInt(inputs.machineType as string);
    const cycles = inputs.cyclesPerDay as number;
    const waterRate = inputs.waterCost as number;
    const elecRate = inputs.electricityRate as number;
    const detergent = inputs.detergentPerCycle as number;
    const days = inputs.daysPerMonth as number;
    const galPerCycle = { 1: 1, 2: 2, 3: 3.5, 4: 5 };
    const kwhPerCycle = { 1: 1.2, 2: 2.0, 3: 3.5, 4: 5.5 };
    const water = galPerCycle[machine] || 2;
    const kwh = kwhPerCycle[machine] || 2;
    const waterCostPerCycle = (water / 1000) * waterRate;
    const elecCostPerCycle = kwh * elecRate;
    const costPerCycle = waterCostPerCycle + elecCostPerCycle + detergent;
    const dailyCost = costPerCycle * cycles;
    const monthlyCost = dailyCost * days;
    const annualCost = monthlyCost * 12;
    return {
      primary: { label: "Cost Per Cycle", value: "$" + formatNumber(Math.round(costPerCycle * 1000) / 1000) },
      details: [
        { label: "Water Cost Per Cycle", value: "$" + formatNumber(Math.round(waterCostPerCycle * 1000) / 1000) },
        { label: "Electricity Per Cycle", value: "$" + formatNumber(Math.round(elecCostPerCycle * 1000) / 1000) },
        { label: "Daily Operating Cost", value: "$" + formatNumber(Math.round(dailyCost * 100) / 100) },
        { label: "Monthly Operating Cost", value: "$" + formatNumber(Math.round(monthlyCost)) },
        { label: "Annual Operating Cost", value: "$" + formatNumber(Math.round(annualCost)) }
      ]
    };
  }`,
  [
    { q: "How much does it cost to run a commercial dishwasher?", a: "A commercial door-type dishwasher costs approximately $0.35 to $0.60 per cycle including water, electricity, and chemicals. Running 40 cycles per day costs roughly $15 to $25 daily or $400 to $650 per month." },
    { q: "Which type of commercial dishwasher is most efficient?", a: "Modern door-type dishwashers with heat recovery and energy-star ratings are the most efficient for mid-volume operations. Conveyor machines are more efficient per rack for high-volume operations exceeding 150 racks per hour." },
    { q: "How can I reduce dishwasher operating costs?", a: "Scrape plates properly before loading, run full racks only, maintain proper water temperature, use correct detergent dosing, clean machine daily, and install a heat recovery system to preheat incoming water with exhaust heat." }
  ],
  `Cost Per Cycle = Water Cost + Electricity Cost + Detergent Cost
Water Cost = (Gallons/Cycle / 1000) x Water Rate
Monthly Cost = Cost Per Cycle x Cycles/Day x Operating Days`,
  ["kitchen-equipment-cost-calculator", "food-waste-cost-calculator"]
);
add(
  "gaming-monitor-input-lag-calculator",
  "Gaming Monitor Input Lag Calculator",
  "Calculate total input lag for your gaming setup including monitor response time, refresh rate delay, and system processing latency to optimize competitive gameplay.",
  "Everyday",
  "everyday",
  "~",
  ["gaming monitor input lag", "display latency calculator", "monitor response time", "gaming delay estimator"],
  [
    '{ name: "refreshRate", label: "Monitor Refresh Rate (Hz)", type: "number", min: 30, max: 500, defaultValue: 144 }',
    '{ name: "responseTime", label: "Response Time (ms)", type: "number", min: 0.5, max: 25, defaultValue: 4 }',
    '{ name: "systemLatency", label: "System Processing Latency (ms)", type: "number", min: 1, max: 100, defaultValue: 15 }',
    '{ name: "vsync", label: "V-Sync Enabled", type: "select", options: [{ value: "0", label: "Off" }, { value: "1", label: "On" }], defaultValue: "0" }'
  ],
  `(inputs) => {
    const refreshRate = inputs.refreshRate as number;
    const responseTime = inputs.responseTime as number;
    const systemLatency = inputs.systemLatency as number;
    const vsync = parseInt(inputs.vsync as string);
    const frameDuration = 1000 / refreshRate;
    const vsyncPenalty = vsync === 1 ? frameDuration : 0;
    const totalLag = responseTime + frameDuration + systemLatency + vsyncPenalty;
    const rating = totalLag < 20 ? "Excellent" : totalLag < 40 ? "Good" : totalLag < 60 ? "Average" : "Noticeable lag";
    return {
      primary: { label: "Total Input Lag", value: formatNumber(Math.round(totalLag * 10) / 10) + " ms" },
      details: [
        { label: "Frame Duration", value: formatNumber(Math.round(frameDuration * 100) / 100) + " ms" },
        { label: "V-Sync Penalty", value: formatNumber(Math.round(vsyncPenalty * 100) / 100) + " ms" },
        { label: "Response Time", value: formatNumber(responseTime) + " ms" },
        { label: "Rating", value: rating }
      ]
    };
  }`,
  [
    "Q: What is good input lag for gaming?||A: Under 20ms total input lag is excellent for competitive gaming. Most professional esports players aim for sub-15ms. Casual gamers may not notice lag below 40ms.",
    "Q: Does V-Sync increase input lag?||A: Yes, enabling V-Sync adds up to one full frame of delay because the GPU waits for the monitor to finish its refresh cycle before displaying the next frame.",
    "Q: How does refresh rate affect input lag?||A: Higher refresh rates reduce the time each frame is displayed. A 240Hz monitor has a frame duration of about 4.2ms compared to 16.7ms on a 60Hz panel."
  ],
  `Frame Duration = 1000 / Refresh Rate\nV-Sync Penalty = Frame Duration (if enabled, else 0)\nTotal Input Lag = Response Time + Frame Duration + System Latency + V-Sync Penalty`,
  ["gaming-fps-calculator", "gaming-monitor-size-calculator"]
);

add(
  "esports-prize-pool-split-calculator",
  "Esports Prize Pool Split Calculator",
  "Calculate prize money distribution among team members for esports tournaments including organization cuts, coach shares, and tax withholding estimates.",
  "Finance",
  "finance",
  "$",
  ["esports prize pool", "tournament winnings split", "team prize distribution", "esports earnings calculator"],
  [
    '{ name: "totalPrize", label: "Total Prize Pool ($)", type: "number", min: 100, max: 50000000, defaultValue: 50000 }',
    '{ name: "teamPlacement", label: "Placement", type: "select", options: [{ value: "1", label: "1st (50%)" }, { value: "2", label: "2nd (25%)" }, { value: "3", label: "3rd (12%)" }, { value: "4", label: "4th (6%)" }], defaultValue: "1" }',
    '{ name: "teamSize", label: "Team Size (Players)", type: "number", min: 1, max: 10, defaultValue: 5 }',
    '{ name: "orgCut", label: "Organization Cut (%)", type: "number", min: 0, max: 50, defaultValue: 20 }'
  ],
  `(inputs) => {
    const totalPrize = inputs.totalPrize as number;
    const placement = parseInt(inputs.teamPlacement as string);
    const teamSize = inputs.teamSize as number;
    const orgCut = inputs.orgCut as number / 100;
    const placeShare = { 1: 0.50, 2: 0.25, 3: 0.12, 4: 0.06 };
    const teamWinnings = totalPrize * (placeShare[placement] || 0.06);
    const orgTake = teamWinnings * orgCut;
    const afterOrg = teamWinnings - orgTake;
    const perPlayer = afterOrg / teamSize;
    const taxEstimate = perPlayer * 0.25;
    const takeHome = perPlayer - taxEstimate;
    return {
      primary: { label: "Per Player Earnings", value: "$" + formatNumber(Math.round(perPlayer)) },
      details: [
        { label: "Team Total Winnings", value: "$" + formatNumber(Math.round(teamWinnings)) },
        { label: "Organization Cut", value: "$" + formatNumber(Math.round(orgTake)) },
        { label: "Estimated Tax (25%)", value: "$" + formatNumber(Math.round(taxEstimate)) },
        { label: "Estimated Take-Home", value: "$" + formatNumber(Math.round(takeHome)) }
      ]
    };
  }`,
  [
    "Q: How are esports prize pools typically split?||A: First place usually receives 40-50 percent of the total prize pool. Second place gets 20-25 percent, third gets 10-15 percent, and remaining teams split the rest.",
    "Q: What percentage do esports organizations take?||A: Most organizations take 10-30 percent of tournament winnings. Top-tier organizations with salaried players may take a smaller cut while providing base salaries and benefits.",
    "Q: Are esports winnings taxable?||A: Yes, tournament winnings are considered taxable income in most countries. In the US, prizes over $600 require tax reporting and the effective tax rate depends on total annual income."
  ],
  `Team Winnings = Total Prize x Placement Percentage\nAfter Org = Team Winnings x (1 - Org Cut)\nPer Player = After Org / Team Size\nTake-Home = Per Player x (1 - Tax Rate)`,
  ["twitch-streamer-revenue-calculator", "youtube-gaming-cpm-calculator"]
);

add(
  "game-server-hosting-cost-calculator",
  "Game Server Hosting Cost Calculator",
  "Estimate monthly and annual costs for hosting a dedicated game server based on player count, game type, performance tier, and location preferences.",
  "Finance",
  "finance",
  "$",
  ["game server cost", "dedicated server hosting", "minecraft server cost", "game hosting price"],
  [
    '{ name: "gameType", label: "Game Type", type: "select", options: [{ value: "1", label: "Minecraft" }, { value: "2", label: "Rust/ARK" }, { value: "3", label: "CS2/Valorant" }, { value: "4", label: "MMO/Large Scale" }], defaultValue: "1" }',
    '{ name: "playerSlots", label: "Player Slots", type: "number", min: 2, max: 500, defaultValue: 20 }',
    '{ name: "performanceTier", label: "Performance Tier", type: "select", options: [{ value: "1", label: "Budget" }, { value: "2", label: "Standard" }, { value: "3", label: "Premium" }, { value: "4", label: "Enterprise" }], defaultValue: "2" }',
    '{ name: "addons", label: "Monthly Addon Costs ($)", type: "number", min: 0, max: 200, defaultValue: 5 }'
  ],
  `(inputs) => {
    const gameType = parseInt(inputs.gameType as string);
    const slots = inputs.playerSlots as number;
    const tier = parseInt(inputs.performanceTier as string);
    const addons = inputs.addons as number;
    const baseCostPerSlot = { 1: 0.50, 2: 0.85, 3: 0.60, 4: 1.20 };
    const tierMultiplier = { 1: 0.7, 2: 1.0, 3: 1.5, 4: 2.2 };
    const costPerSlot = (baseCostPerSlot[gameType] || 0.60) * (tierMultiplier[tier] || 1.0);
    const monthlyCost = slots * costPerSlot + addons;
    const annualCost = monthlyCost * 12;
    const annualDiscount = annualCost * 0.85;
    const ramEstimate = Math.ceil(slots / 10) * (gameType === 2 || gameType === 4 ? 2 : 1);
    return {
      primary: { label: "Monthly Cost", value: "$" + formatNumber(Math.round(monthlyCost * 100) / 100) },
      details: [
        { label: "Annual Cost (Monthly Billing)", value: "$" + formatNumber(Math.round(annualCost)) },
        { label: "Annual Cost (15% Prepay Discount)", value: "$" + formatNumber(Math.round(annualDiscount)) },
        { label: "Estimated RAM Needed", value: formatNumber(ramEstimate) + " GB" },
        { label: "Cost Per Player Slot", value: "$" + formatNumber(Math.round(costPerSlot * 100) / 100) + "/mo" }
      ]
    };
  }`,
  [
    "Q: How much does a Minecraft server cost?||A: A basic Minecraft server for 10-20 players typically costs $5 to $15 per month. Larger servers with 50 or more players and mods can cost $25 to $60 per month.",
    "Q: What specs do I need for a game server?||A: Most game servers need at least 2-4GB RAM for small groups. CPU performance matters more than core count. Fast SSD storage and a low-latency network connection are also important.",
    "Q: Is it cheaper to host your own game server?||A: Self-hosting can be cheaper for small setups but requires technical knowledge, electricity costs, and a reliable internet connection. Cloud hosting is usually more cost-effective for 24/7 uptime."
  ],
  `Monthly Cost = Player Slots x Base Cost Per Slot x Tier Multiplier + Addons\nAnnual Cost = Monthly Cost x 12\nPrepay Discount = Annual Cost x 0.85`,
  ["gaming-pc-wattage-calculator", "discord-server-cost-calculator"]
);

add(
  "mouse-sensitivity-edpi-calculator",
  "Mouse Sensitivity eDPI Calculator",
  "Convert mouse sensitivity between games using effective DPI (eDPI) to maintain consistent aim across different titles with varying sensitivity scales.",
  "Everyday",
  "everyday",
  "~",
  ["eDPI calculator", "mouse sensitivity converter", "DPI sensitivity", "gaming mouse calculator"],
  [
    '{ name: "mouseDPI", label: "Mouse DPI", type: "number", min: 100, max: 25600, defaultValue: 800 }',
    '{ name: "inGameSens", label: "In-Game Sensitivity", type: "number", min: 0.01, max: 100, defaultValue: 1.5 }',
    '{ name: "targetGame", label: "Convert To Game", type: "select", options: [{ value: "1", label: "CS2 (Scale: 1x)" }, { value: "2", label: "Valorant (Scale: 3.18x)" }, { value: "3", label: "Overwatch 2 (Scale: 10.6x)" }, { value: "4", label: "Apex Legends (Scale: 5.0x)" }, { value: "5", label: "Fortnite (Scale: 5.6x)" }], defaultValue: "2" }',
    '{ name: "mousepadWidth", label: "Mousepad Width (inches)", type: "number", min: 5, max: 48, defaultValue: 18 }'
  ],
  `(inputs) => {
    const dpi = inputs.mouseDPI as number;
    const sens = inputs.inGameSens as number;
    const targetGame = parseInt(inputs.targetGame as string);
    const mousepadWidth = inputs.mousepadWidth as number;
    const edpi = dpi * sens;
    const gameScales = { 1: 1, 2: 3.18, 3: 10.6, 4: 5.0, 5: 5.6 };
    const targetScale = gameScales[targetGame] || 1;
    const convertedSens = Math.round((edpi / dpi / targetScale) * 10000) / 10000;
    const cmPer360 = (360 / (edpi * 0.022)) * 2.54;
    const inPer360 = cmPer360 / 2.54;
    const full360sPossible = Math.round((mousepadWidth / inPer360) * 10) / 10;
    return {
      primary: { label: "eDPI", value: formatNumber(Math.round(edpi * 100) / 100) },
      details: [
        { label: "Converted Sensitivity", value: formatNumber(convertedSens) },
        { label: "cm per 360-degree Turn", value: formatNumber(Math.round(cmPer360 * 10) / 10) + " cm" },
        { label: "Inches per 360-degree Turn", value: formatNumber(Math.round(inPer360 * 10) / 10) + " in" },
        { label: "Full 360s on Mousepad", value: formatNumber(full360sPossible) }
      ]
    };
  }`,
  [
    "Q: What is eDPI and why does it matter?||A: eDPI stands for effective dots per inch and equals your mouse DPI multiplied by your in-game sensitivity. It standardizes sensitivity comparison across different DPI settings.",
    "Q: What eDPI do professional FPS players use?||A: Most CS2 professionals use an eDPI between 600 and 1200. Valorant professionals typically range from 200 to 400 eDPI. Lower sensitivities allow more precise aiming.",
    "Q: Should I change my DPI or in-game sensitivity?||A: Either achieves the same eDPI result. Many players prefer 800 or 1600 DPI for a good balance between desktop usability and in-game precision."
  ],
  `eDPI = Mouse DPI x In-Game Sensitivity\nConverted Sensitivity = eDPI / DPI / Target Game Scale\ncm per 360 = (360 / (eDPI x 0.022)) x 2.54`,
  ["gaming-monitor-input-lag-calculator", "gaming-fps-calculator"]
);

add(
  "game-download-time-calculator",
  "Game Download Time Calculator",
  "Estimate how long it will take to download a game based on file size and your internet connection speed with overhead adjustments.",
  "Everyday",
  "everyday",
  "~",
  ["game download time", "download speed calculator", "game install time", "internet download estimator"],
  [
    '{ name: "fileSize", label: "Game File Size (GB)", type: "number", min: 0.1, max: 300, defaultValue: 50 }',
    '{ name: "downloadSpeed", label: "Internet Speed (Mbps)", type: "number", min: 1, max: 10000, defaultValue: 100 }',
    '{ name: "overhead", label: "Network Overhead (%)", type: "number", min: 0, max: 50, defaultValue: 15 }',
    '{ name: "simultaneousDownloads", label: "Simultaneous Downloads", type: "number", min: 1, max: 10, defaultValue: 1 }'
  ],
  `(inputs) => {
    const fileSize = inputs.fileSize as number;
    const speed = inputs.downloadSpeed as number;
    const overhead = inputs.overhead as number / 100;
    const simultaneous = inputs.simultaneousDownloads as number;
    const effectiveSpeed = (speed * (1 - overhead)) / simultaneous;
    const fileSizeMb = fileSize * 1024;
    const fileSizeMbit = fileSizeMb * 8;
    const timeSeconds = fileSizeMbit / effectiveSpeed;
    const hours = Math.floor(timeSeconds / 3600);
    const minutes = Math.floor((timeSeconds % 3600) / 60);
    const seconds = Math.round(timeSeconds % 60);
    const timeStr = hours > 0 ? hours + "h " + minutes + "m " + seconds + "s" : minutes + "m " + seconds + "s";
    return {
      primary: { label: "Estimated Download Time", value: timeStr },
      details: [
        { label: "Effective Speed", value: formatNumber(Math.round(effectiveSpeed * 10) / 10) + " Mbps" },
        { label: "Effective Speed (MB/s)", value: formatNumber(Math.round(effectiveSpeed / 8 * 100) / 100) + " MB/s" },
        { label: "File Size", value: formatNumber(fileSizeMb) + " MB" },
        { label: "Total Seconds", value: formatNumber(Math.round(timeSeconds)) }
      ]
    };
  }`,
  [
    "Q: Why is my download slower than my internet speed?||A: Network overhead, server throttling, Wi-Fi interference, and other devices sharing bandwidth all reduce effective download speeds. Expect 10-20 percent lower than advertised speeds.",
    "Q: How big are modern games?||A: AAA titles typically range from 50 to 150 GB. Some games like Call of Duty can exceed 200 GB with all content installed. Indie games are usually under 10 GB.",
    "Q: Can I speed up game downloads?||A: Use a wired ethernet connection, pause other downloads, close bandwidth-heavy applications, and download during off-peak hours for the fastest speeds."
  ],
  `Effective Speed = Internet Speed x (1 - Overhead) / Simultaneous Downloads\nTime (seconds) = (File Size in GB x 1024 x 8) / Effective Speed (Mbps)`,
  ["game-server-hosting-cost-calculator", "gaming-streaming-bitrate-calculator"]
);

add(
  "gpu-benchmark-score-estimator",
  "GPU Benchmark Score Estimator",
  "Estimate your GPU benchmark score based on GPU tier, clock speed, VRAM, and architecture generation for relative performance comparison.",
  "Everyday",
  "everyday",
  "~",
  ["GPU benchmark", "graphics card score", "GPU performance estimator", "video card benchmark"],
  [
    '{ name: "gpuTier", label: "GPU Tier", type: "select", options: [{ value: "1", label: "Budget (e.g. RTX 4060)" }, { value: "2", label: "Mid-Range (e.g. RTX 4070)" }, { value: "3", label: "High-End (e.g. RTX 4080)" }, { value: "4", label: "Flagship (e.g. RTX 4090)" }], defaultValue: "2" }',
    '{ name: "clockSpeed", label: "Boost Clock Speed (MHz)", type: "number", min: 500, max: 3500, defaultValue: 2100 }',
    '{ name: "vram", label: "VRAM (GB)", type: "number", min: 2, max: 48, defaultValue: 12 }',
    '{ name: "generation", label: "Architecture Generation", type: "select", options: [{ value: "1", label: "Current Gen" }, { value: "2", label: "Last Gen" }, { value: "3", label: "2 Gens Old" }], defaultValue: "1" }'
  ],
  `(inputs) => {
    const tier = parseInt(inputs.gpuTier as string);
    const clock = inputs.clockSpeed as number;
    const vram = inputs.vram as number;
    const gen = parseInt(inputs.generation as string);
    const tierBase = { 1: 8000, 2: 14000, 3: 22000, 4: 30000 };
    const genMultiplier = { 1: 1.0, 2: 0.78, 3: 0.60 };
    const base = (tierBase[tier] || 14000) * (genMultiplier[gen] || 1.0);
    const clockBonus = (clock - 1800) * 3;
    const vramBonus = vram * 50;
    const estimatedScore = Math.round(base + clockBonus + vramBonus);
    const fps1080p = Math.round(estimatedScore / 100);
    const fps1440p = Math.round(fps1080p * 0.72);
    const fps4k = Math.round(fps1080p * 0.42);
    return {
      primary: { label: "Estimated Benchmark Score", value: formatNumber(estimatedScore) },
      details: [
        { label: "Estimated 1080p FPS (AAA)", value: formatNumber(fps1080p) + " FPS" },
        { label: "Estimated 1440p FPS (AAA)", value: formatNumber(fps1440p) + " FPS" },
        { label: "Estimated 4K FPS (AAA)", value: formatNumber(fps4k) + " FPS" },
        { label: "Performance Tier", value: estimatedScore > 25000 ? "Ultra" : estimatedScore > 18000 ? "High" : estimatedScore > 10000 ? "Medium" : "Low" }
      ]
    };
  }`,
  [
    "Q: What is a good GPU benchmark score?||A: Scores above 20000 in 3DMark Time Spy are considered high-end. Scores around 12000-15000 handle 1440p gaming well. Budget cards typically score 6000-9000.",
    "Q: How important is VRAM for gaming?||A: At 1080p, 8GB VRAM is sufficient for most games. At 1440p, 10-12GB is recommended. At 4K with ultra textures, 12-16GB or more ensures smooth performance.",
    "Q: Does clock speed matter more than GPU tier?||A: GPU tier (architecture and core count) has a much larger impact on performance than clock speed. A higher-tier card at lower clocks will outperform a lower-tier card at higher clocks."
  ],
  `Base Score = Tier Base Score x Generation Multiplier\nClock Bonus = (Clock Speed - 1800) x 3\nVRAM Bonus = VRAM x 50\nEstimated Score = Base + Clock Bonus + VRAM Bonus`,
  ["gaming-pc-wattage-calculator", "gaming-fps-calculator"]
);

add(
  "vr-headset-fov-calculator",
  "VR Headset FOV Calculator",
  "Calculate the effective field of view for your VR headset based on lens type, IPD setting, and face gasket depth to optimize your immersion.",
  "Everyday",
  "everyday",
  "~",
  ["VR FOV calculator", "virtual reality field of view", "VR headset comparison", "VR lens calculator"],
  [
    '{ name: "headsetType", label: "Headset Category", type: "select", options: [{ value: "1", label: "Budget (90-100 deg)" }, { value: "2", label: "Mid-Range (100-110 deg)" }, { value: "3", label: "High-End (110-120 deg)" }, { value: "4", label: "Ultra-Wide (120-140 deg)" }], defaultValue: "2" }',
    '{ name: "ipd", label: "IPD - Interpupillary Distance (mm)", type: "number", min: 55, max: 75, defaultValue: 63 }',
    '{ name: "faceDepth", label: "Face Gasket Depth (mm)", type: "number", min: 5, max: 30, defaultValue: 12 }',
    '{ name: "lensType", label: "Lens Type", type: "select", options: [{ value: "1", label: "Fresnel" }, { value: "2", label: "Pancake" }, { value: "3", label: "Aspheric" }], defaultValue: "2" }'
  ],
  `(inputs) => {
    const headset = parseInt(inputs.headsetType as string);
    const ipd = inputs.ipd as number;
    const depth = inputs.faceDepth as number;
    const lens = parseInt(inputs.lensType as string);
    const baseFov = { 1: 95, 2: 105, 3: 115, 4: 130 };
    const lensModifier = { 1: 0, 2: -3, 3: 4 };
    const ipdOffset = (63 - ipd) * 0.4;
    const depthOffset = (12 - depth) * 1.5;
    const horizontalFov = Math.round((baseFov[headset] || 105) + ipdOffset + depthOffset + (lensModifier[lens] || 0));
    const verticalFov = Math.round(horizontalFov * 0.82);
    const diagonalFov = Math.round(Math.sqrt(horizontalFov * horizontalFov + verticalFov * verticalFov));
    const sweetSpotRating = lens === 2 ? "Large" : lens === 3 ? "Medium-Large" : "Medium";
    return {
      primary: { label: "Horizontal FOV", value: formatNumber(horizontalFov) + " degrees" },
      details: [
        { label: "Vertical FOV", value: formatNumber(verticalFov) + " degrees" },
        { label: "Diagonal FOV", value: formatNumber(diagonalFov) + " degrees" },
        { label: "Sweet Spot Size", value: sweetSpotRating },
        { label: "Immersion Rating", value: horizontalFov >= 120 ? "Excellent" : horizontalFov >= 105 ? "Good" : "Adequate" }
      ]
    };
  }`,
  [
    "Q: What is a good FOV for VR?||A: A horizontal FOV of 100-110 degrees is standard for most VR headsets. FOV above 120 degrees significantly improves immersion and peripheral awareness.",
    "Q: Does IPD affect FOV in VR?||A: Yes, users with a wider IPD than the headset default may experience a slightly narrower effective FOV. Proper IPD adjustment is critical for both comfort and visual clarity.",
    "Q: What is the difference between Fresnel and pancake lenses?||A: Fresnel lenses are cheaper and lighter but can produce visible ring artifacts. Pancake lenses are thinner, produce clearer images, but may have a slightly smaller sweet spot and reduced FOV."
  ],
  `Horizontal FOV = Base FOV + IPD Offset + Depth Offset + Lens Modifier\nIPD Offset = (63 - IPD) x 0.4\nDepth Offset = (12 - Face Depth) x 1.5\nVertical FOV = Horizontal FOV x 0.82`,
  ["gaming-monitor-input-lag-calculator", "gpu-benchmark-score-estimator"]
);

add(
  "gaming-desk-setup-cost-calculator",
  "Gaming Desk Setup Cost Calculator",
  "Plan your gaming desk setup budget with itemized cost estimates for desk, chair, monitors, peripherals, and accessories.",
  "Finance",
  "finance",
  "$",
  ["gaming desk cost", "gaming setup budget", "PC desk setup", "gaming room cost"],
  [
    '{ name: "deskType", label: "Desk Type", type: "select", options: [{ value: "1", label: "Basic ($100-200)" }, { value: "2", label: "Gaming Desk ($200-400)" }, { value: "3", label: "Standing Desk ($300-600)" }, { value: "4", label: "L-Shaped ($250-500)" }], defaultValue: "2" }',
    '{ name: "monitorCount", label: "Number of Monitors", type: "number", min: 1, max: 4, defaultValue: 2 }',
    '{ name: "monitorBudget", label: "Budget Per Monitor ($)", type: "number", min: 100, max: 3000, defaultValue: 350 }',
    '{ name: "peripheralTier", label: "Peripheral Tier", type: "select", options: [{ value: "1", label: "Budget ($80 total)" }, { value: "2", label: "Mid-Range ($200 total)" }, { value: "3", label: "Premium ($450 total)" }, { value: "4", label: "Enthusiast ($800 total)" }], defaultValue: "2" }'
  ],
  `(inputs) => {
    const deskType = parseInt(inputs.deskType as string);
    const monitors = inputs.monitorCount as number;
    const monitorBudget = inputs.monitorBudget as number;
    const peripheralTier = parseInt(inputs.peripheralTier as string);
    const deskCosts = { 1: 150, 2: 300, 3: 450, 4: 375 };
    const peripheralCosts = { 1: 80, 2: 200, 3: 450, 4: 800 };
    const deskCost = deskCosts[deskType] || 300;
    const monitorCost = monitors * monitorBudget;
    const peripherals = peripheralCosts[peripheralTier] || 200;
    const accessories = 50 + monitors * 30;
    const totalCost = deskCost + monitorCost + peripherals + accessories;
    return {
      primary: { label: "Total Setup Cost", value: "$" + formatNumber(Math.round(totalCost)) },
      details: [
        { label: "Desk", value: "$" + formatNumber(deskCost) },
        { label: "Monitors (" + monitors + ")", value: "$" + formatNumber(monitorCost) },
        { label: "Peripherals", value: "$" + formatNumber(peripherals) },
        { label: "Accessories (mount, cable mgmt)", value: "$" + formatNumber(accessories) }
      ]
    };
  }`,
  [
    "Q: How much does a complete gaming desk setup cost?||A: A budget gaming desk setup costs around $400-600. A mid-range setup runs $800-1500. Premium setups with ultrawide monitors and ergonomic furniture can exceed $3000.",
    "Q: Is a standing desk worth it for gaming?||A: Standing desks offer health benefits for long gaming sessions by letting you alternate between sitting and standing. They cost more but can reduce back pain and improve posture.",
    "Q: What peripherals do I need for a gaming setup?||A: Essential peripherals include a gaming keyboard, mouse, mousepad, and headset. Optional upgrades include a microphone, webcam, controller, and stream deck."
  ],
  `Total Cost = Desk + (Monitors x Budget Per Monitor) + Peripherals + Accessories\nAccessories = $50 base + $30 per monitor`,
  ["gaming-pc-build-budget-calculator", "gaming-peripheral-budget-calculator"]
);

add(
  "twitch-streamer-revenue-calculator",
  "Twitch Streamer Revenue Calculator",
  "Estimate monthly Twitch streaming revenue from subscriptions, bits, ads, and donations based on average viewers and stream hours.",
  "Finance",
  "finance",
  "$",
  ["Twitch revenue calculator", "streaming income", "Twitch earnings estimator", "streamer money calculator"],
  [
    '{ name: "avgViewers", label: "Average Concurrent Viewers", type: "number", min: 1, max: 100000, defaultValue: 50 }',
    '{ name: "streamHoursPerWeek", label: "Stream Hours Per Week", type: "number", min: 1, max: 80, defaultValue: 20 }',
    '{ name: "subRate", label: "Subscriber Rate (%)", type: "number", min: 0, max: 20, defaultValue: 5 }',
    '{ name: "subTier", label: "Average Sub Tier", type: "select", options: [{ value: "1", label: "Tier 1 ($2.50/sub)" }, { value: "2", label: "Tier 2 ($5.00/sub)" }, { value: "3", label: "Tier 3 ($12.50/sub)" }], defaultValue: "1" }'
  ],
  `(inputs) => {
    const viewers = inputs.avgViewers as number;
    const hours = inputs.streamHoursPerWeek as number;
    const subRate = inputs.subRate as number / 100;
    const subTier = parseInt(inputs.subTier as string);
    const subPayouts = { 1: 2.50, 2: 5.00, 3: 12.50 };
    const payout = subPayouts[subTier] || 2.50;
    const monthlyHours = hours * 4.33;
    const subscribers = Math.round(viewers * subRate);
    const subRevenue = subscribers * payout;
    const adRevenue = viewers * monthlyHours * 0.003;
    const bitsRevenue = viewers * 0.15 * 4.33;
    const donationRevenue = viewers * 0.10 * 4.33;
    const totalRevenue = subRevenue + adRevenue + bitsRevenue + donationRevenue;
    return {
      primary: { label: "Estimated Monthly Revenue", value: "$" + formatNumber(Math.round(totalRevenue)) },
      details: [
        { label: "Subscription Revenue", value: "$" + formatNumber(Math.round(subRevenue)) },
        { label: "Ad Revenue", value: "$" + formatNumber(Math.round(adRevenue)) },
        { label: "Bits Revenue", value: "$" + formatNumber(Math.round(bitsRevenue)) },
        { label: "Donations Estimate", value: "$" + formatNumber(Math.round(donationRevenue)) }
      ]
    };
  }`,
  [
    "Q: How much do Twitch streamers make?||A: Revenue varies enormously. Small streamers with 10-50 viewers may earn $50-300 per month. Mid-tier streamers with 100-500 viewers can earn $500-3000. Top streamers earn six figures monthly.",
    "Q: What is the Twitch subscription split?||A: Standard affiliates receive 50 percent of the subscription price. Partners may negotiate up to 70 percent. Twitch has been moving toward a more standardized 50/50 split.",
    "Q: How many viewers do you need to make money on Twitch?||A: You need at least 75 average viewers and 3 concurrent viewers to become an Affiliate, which is the minimum requirement to earn subscription revenue on Twitch."
  ],
  `Subscribers = Avg Viewers x Sub Rate\nSub Revenue = Subscribers x Payout Per Sub\nAd Revenue = Viewers x Monthly Hours x $0.003\nTotal = Sub Revenue + Ad Revenue + Bits + Donations`,
  ["youtube-gaming-cpm-calculator", "esports-prize-pool-split-calculator"]
);

add(
  "youtube-gaming-cpm-calculator",
  "YouTube Gaming CPM Calculator",
  "Calculate estimated YouTube gaming channel revenue based on views, CPM rates, and content type to project monthly and annual earnings.",
  "Finance",
  "finance",
  "$",
  ["YouTube CPM calculator", "YouTube gaming revenue", "YouTube earnings estimator", "gaming channel income"],
  [
    '{ name: "monthlyViews", label: "Monthly Views", type: "number", min: 100, max: 100000000, defaultValue: 100000 }',
    '{ name: "contentType", label: "Content Type", type: "select", options: [{ value: "1", label: "Let-s Plays ($2-4 CPM)" }, { value: "2", label: "Reviews/Guides ($4-8 CPM)" }, { value: "3", label: "Esports/Competitive ($3-6 CPM)" }, { value: "4", label: "Tech/Hardware ($6-12 CPM)" }], defaultValue: "2" }',
    '{ name: "avgVideoLength", label: "Average Video Length (min)", type: "number", min: 1, max: 240, defaultValue: 15 }',
    '{ name: "sponsorRate", label: "Monthly Sponsorship ($)", type: "number", min: 0, max: 100000, defaultValue: 0 }'
  ],
  `(inputs) => {
    const views = inputs.monthlyViews as number;
    const content = parseInt(inputs.contentType as string);
    const videoLength = inputs.avgVideoLength as number;
    const sponsorship = inputs.sponsorRate as number;
    const cpmRanges = { 1: 3, 2: 6, 3: 4.5, 4: 9 };
    const baseCpm = cpmRanges[content] || 4;
    const lengthMultiplier = videoLength >= 8 ? 1.0 + (Math.min(videoLength, 20) - 8) * 0.02 : 0.7;
    const effectiveCpm = baseCpm * lengthMultiplier;
    const adRevenue = (views / 1000) * effectiveCpm;
    const membershipRevenue = views * 0.0002;
    const totalRevenue = adRevenue + membershipRevenue + sponsorship;
    const annualRevenue = totalRevenue * 12;
    return {
      primary: { label: "Estimated Monthly Revenue", value: "$" + formatNumber(Math.round(totalRevenue)) },
      details: [
        { label: "Ad Revenue", value: "$" + formatNumber(Math.round(adRevenue)) },
        { label: "Effective CPM", value: "$" + formatNumber(Math.round(effectiveCpm * 100) / 100) },
        { label: "Memberships Estimate", value: "$" + formatNumber(Math.round(membershipRevenue)) },
        { label: "Projected Annual Revenue", value: "$" + formatNumber(Math.round(annualRevenue)) }
      ]
    };
  }`,
  [
    "Q: What is CPM for gaming YouTube channels?||A: Gaming CPM typically ranges from $2 to $8 depending on content type. Hardware reviews and tech content get the highest CPM at $6-12. Pure gameplay content averages $2-4.",
    "Q: How many views do you need to make money on YouTube?||A: You need 1000 subscribers and 4000 watch hours to join the YouTube Partner Program. After that, expect about $2-8 per 1000 views depending on your niche.",
    "Q: Do longer videos earn more on YouTube?||A: Videos over 8 minutes can include mid-roll ads, which significantly increases revenue. However, watch time and engagement are more important than length alone."
  ],
  `Effective CPM = Base CPM x Length Multiplier\nAd Revenue = (Monthly Views / 1000) x Effective CPM\nTotal = Ad Revenue + Memberships + Sponsorships`,
  ["twitch-streamer-revenue-calculator", "esports-prize-pool-split-calculator"]
);

add(
  "discord-server-cost-calculator",
  "Discord Server Cost Calculator",
  "Estimate the monthly cost of running a Discord community including Nitro boosts, bot subscriptions, moderation tools, and premium features.",
  "Finance",
  "finance",
  "$",
  ["Discord server cost", "Discord Nitro boost cost", "Discord bot pricing", "community server budget"],
  [
    '{ name: "memberCount", label: "Server Member Count", type: "number", min: 10, max: 1000000, defaultValue: 500 }',
    '{ name: "boostLevel", label: "Desired Boost Level", type: "select", options: [{ value: "0", label: "No Boosts" }, { value: "1", label: "Level 1 (2 boosts)" }, { value: "2", label: "Level 2 (7 boosts)" }, { value: "3", label: "Level 3 (14 boosts)" }], defaultValue: "2" }',
    '{ name: "premiumBots", label: "Premium Bot Subscriptions", type: "number", min: 0, max: 20, defaultValue: 3 }',
    '{ name: "modTools", label: "Moderation Tool Budget ($)", type: "number", min: 0, max: 200, defaultValue: 10 }'
  ],
  `(inputs) => {
    const members = inputs.memberCount as number;
    const boostLevel = parseInt(inputs.boostLevel as string);
    const premiumBots = inputs.premiumBots as number;
    const modTools = inputs.modTools as number;
    const boostCosts = { 0: 0, 1: 9.98, 2: 34.93, 3: 69.86 };
    const boostCost = boostCosts[boostLevel] || 0;
    const avgBotCost = 5;
    const botTotal = premiumBots * avgBotCost;
    const monthlyCost = boostCost + botTotal + modTools;
    const annualCost = monthlyCost * 12;
    const costPerMember = members > 0 ? monthlyCost / members : 0;
    return {
      primary: { label: "Monthly Server Cost", value: "$" + formatNumber(Math.round(monthlyCost * 100) / 100) },
      details: [
        { label: "Boost Cost", value: "$" + formatNumber(Math.round(boostCost * 100) / 100) },
        { label: "Bot Subscriptions", value: "$" + formatNumber(botTotal) },
        { label: "Moderation Tools", value: "$" + formatNumber(modTools) },
        { label: "Annual Cost", value: "$" + formatNumber(Math.round(annualCost)) }
      ]
    };
  }`,
  [
    "Q: How much does it cost to boost a Discord server?||A: Each Nitro boost costs $4.99 per month. Level 1 requires 2 boosts ($9.98), Level 2 requires 7 boosts ($34.93), and Level 3 requires 14 boosts ($69.86).",
    "Q: What do Discord server boosts unlock?||A: Boosts unlock higher audio quality, more emoji slots, increased upload limits, custom server banner, animated server icon, and vanity invite URLs at higher levels.",
    "Q: Are Discord bots free?||A: Many popular bots offer free tiers with basic features. Premium bot subscriptions typically cost $3-10 per month and unlock advanced features like custom commands and analytics."
  ],
  `Boost Cost = Number of Boosts Required x $4.99\nBot Total = Premium Bots x Average Bot Cost\nMonthly Cost = Boost Cost + Bot Total + Moderation Tools`,
  ["game-server-hosting-cost-calculator", "twitch-streamer-revenue-calculator"]
);

add(
  "game-development-budget-calculator",
  "Game Development Budget Calculator",
  "Plan your indie game development budget by estimating costs across programming, art, audio, marketing, and distribution for solo and small team projects.",
  "Finance",
  "finance",
  "$",
  ["game dev budget", "indie game cost", "game development cost", "video game budget planner"],
  [
    '{ name: "teamSize", label: "Team Size", type: "number", min: 1, max: 50, defaultValue: 3 }',
    '{ name: "devMonths", label: "Development Duration (months)", type: "number", min: 1, max: 60, defaultValue: 12 }',
    '{ name: "avgMonthlySalary", label: "Avg Monthly Salary/Cost ($)", type: "number", min: 0, max: 20000, defaultValue: 5000 }',
    '{ name: "scope", label: "Game Scope", type: "select", options: [{ value: "1", label: "Small (mobile/casual)" }, { value: "2", label: "Medium (indie)" }, { value: "3", label: "Large (AA indie)" }, { value: "4", label: "Ambitious (large indie)" }], defaultValue: "2" }'
  ],
  `(inputs) => {
    const team = inputs.teamSize as number;
    const months = inputs.devMonths as number;
    const salary = inputs.avgMonthlySalary as number;
    const scope = parseInt(inputs.scope as string);
    const laborCost = team * months * salary;
    const assetMultiplier = { 1: 0.10, 2: 0.20, 3: 0.30, 4: 0.40 };
    const assetCost = laborCost * (assetMultiplier[scope] || 0.20);
    const toolsAndLicenses = months * 50 * team;
    const marketingPercent = { 1: 0.15, 2: 0.20, 3: 0.25, 4: 0.30 };
    const marketing = (laborCost + assetCost) * (marketingPercent[scope] || 0.20);
    const totalBudget = laborCost + assetCost + toolsAndLicenses + marketing;
    return {
      primary: { label: "Total Estimated Budget", value: "$" + formatNumber(Math.round(totalBudget)) },
      details: [
        { label: "Labor Cost", value: "$" + formatNumber(Math.round(laborCost)) },
        { label: "Assets (Art, Audio, etc.)", value: "$" + formatNumber(Math.round(assetCost)) },
        { label: "Tools and Licenses", value: "$" + formatNumber(Math.round(toolsAndLicenses)) },
        { label: "Marketing Budget", value: "$" + formatNumber(Math.round(marketing)) }
      ]
    };
  }`,
  [
    "Q: How much does it cost to make an indie game?||A: A solo developer can make a small game for $10,000-50,000. A small team indie game typically costs $50,000-500,000. More ambitious projects can reach $1-5 million.",
    "Q: How long does it take to develop an indie game?||A: Simple mobile games take 3-6 months. A typical indie game takes 1-3 years. Large-scope indie projects can take 3-5 years or more depending on team size and ambition.",
    "Q: How much should I spend on marketing an indie game?||A: Industry guidance suggests spending 20-30 percent of your development budget on marketing. At minimum, allocate funds for a game trailer, press outreach, and social media presence."
  ],
  `Labor Cost = Team Size x Development Months x Monthly Salary\nAsset Cost = Labor Cost x Scope Multiplier\nMarketing = (Labor + Assets) x Marketing Percentage\nTotal = Labor + Assets + Tools + Marketing`,
  ["esports-prize-pool-split-calculator", "game-server-hosting-cost-calculator"]
);

add(
  "tabletop-rpg-encounter-builder-calculator",
  "Tabletop RPG Encounter Builder Calculator",
  "Build balanced RPG encounters by calculating difficulty ratings based on party size, level, number of enemies, and challenge rating for D&D style games.",
  "Everyday",
  "everyday",
  "~",
  ["D&D encounter builder", "RPG encounter calculator", "tabletop combat difficulty", "encounter challenge rating"],
  [
    '{ name: "partySize", label: "Party Size (players)", type: "number", min: 1, max: 10, defaultValue: 4 }',
    '{ name: "partyLevel", label: "Average Party Level", type: "number", min: 1, max: 20, defaultValue: 5 }',
    '{ name: "numEnemies", label: "Number of Enemies", type: "number", min: 1, max: 30, defaultValue: 4 }',
    '{ name: "enemyCR", label: "Enemy Challenge Rating", type: "number", min: 0.125, max: 30, defaultValue: 2 }'
  ],
  `(inputs) => {
    const partySize = inputs.partySize as number;
    const level = inputs.partyLevel as number;
    const numEnemies = inputs.numEnemies as number;
    const cr = inputs.enemyCR as number;
    const xpByCR = cr <= 0.125 ? 25 : cr <= 0.25 ? 50 : cr <= 0.5 ? 100 : cr <= 1 ? 200 : cr <= 2 ? 450 : cr <= 3 ? 700 : cr <= 4 ? 1100 : cr <= 5 ? 1800 : cr <= 6 ? 2300 : cr <= 7 ? 2900 : cr <= 8 ? 3900 : cr <= 9 ? 5000 : cr <= 10 ? 5900 : cr * 700;
    const encounterMultiplier = numEnemies <= 1 ? 1 : numEnemies <= 2 ? 1.5 : numEnemies <= 6 ? 2 : numEnemies <= 10 ? 2.5 : numEnemies <= 14 ? 3 : 4;
    const adjustedXP = xpByCR * numEnemies * encounterMultiplier;
    const easyThreshold = level * 25 * partySize;
    const mediumThreshold = level * 50 * partySize;
    const hardThreshold = level * 75 * partySize;
    const deadlyThreshold = level * 100 * partySize;
    const difficulty = adjustedXP >= deadlyThreshold ? "Deadly" : adjustedXP >= hardThreshold ? "Hard" : adjustedXP >= mediumThreshold ? "Medium" : "Easy";
    return {
      primary: { label: "Encounter Difficulty", value: difficulty },
      details: [
        { label: "Adjusted XP", value: formatNumber(Math.round(adjustedXP)) },
        { label: "XP Per Player", value: formatNumber(Math.round(xpByCR * numEnemies / partySize)) },
        { label: "Easy/Medium Threshold", value: formatNumber(easyThreshold) + " / " + formatNumber(mediumThreshold) },
        { label: "Hard/Deadly Threshold", value: formatNumber(hardThreshold) + " / " + formatNumber(deadlyThreshold) }
      ]
    };
  }`,
  [
    "Q: What is challenge rating in D&D?||A: Challenge Rating (CR) represents the difficulty of a single monster. A CR equal to the party level should be a medium challenge for a party of four adventurers.",
    "Q: How do I balance encounters for different party sizes?||A: Larger parties can handle higher CRs. Add approximately 50 percent more XP worth of monsters for each player beyond four. Reduce by 50 percent for each player below four.",
    "Q: How many encounters should be in a typical D&D session?||A: A standard adventuring day assumes 6-8 medium or hard encounters with short rests between groups. Most actual sessions run 2-4 encounters lasting 3-4 hours."
  ],
  `XP per Enemy = CR-based XP Table Lookup\nAdjusted XP = XP per Enemy x Number of Enemies x Group Multiplier\nDifficulty = Compare Adjusted XP to Party Thresholds (Easy/Medium/Hard/Deadly)`,
  ["card-game-deck-value-calculator", "board-game-play-time-calculator"]
);

add(
  "card-game-deck-value-calculator",
  "Card Game Deck Value Calculator",
  "Calculate the total value of a trading card game deck based on card rarity distribution and average market prices per rarity tier.",
  "Everyday",
  "everyday",
  "~",
  ["deck value calculator", "TCG deck cost", "card game deck price", "MTG deck value"],
  [
    '{ name: "gameSystem", label: "Card Game", type: "select", options: [{ value: "1", label: "Magic: The Gathering" }, { value: "2", label: "Pokemon TCG" }, { value: "3", label: "Yu-Gi-Oh!" }, { value: "4", label: "Flesh and Blood" }], defaultValue: "1" }',
    '{ name: "commonCards", label: "Common/Uncommon Cards", type: "number", min: 0, max: 100, defaultValue: 30 }',
    '{ name: "rareCards", label: "Rare Cards", type: "number", min: 0, max: 60, defaultValue: 15 }',
    '{ name: "mythicCards", label: "Mythic/Ultra Rare Cards", type: "number", min: 0, max: 30, defaultValue: 5 }'
  ],
  `(inputs) => {
    const game = parseInt(inputs.gameSystem as string);
    const commons = inputs.commonCards as number;
    const rares = inputs.rareCards as number;
    const mythics = inputs.mythicCards as number;
    const prices = {
      1: { common: 0.25, rare: 3.50, mythic: 15 },
      2: { common: 0.15, rare: 2.50, mythic: 12 },
      3: { common: 0.10, rare: 2.00, mythic: 10 },
      4: { common: 0.30, rare: 4.00, mythic: 18 }
    };
    const p = prices[game] || prices[1];
    const commonValue = commons * p.common;
    const rareValue = rares * p.rare;
    const mythicValue = mythics * p.mythic;
    const totalValue = commonValue + rareValue + mythicValue;
    const totalCards = commons + rares + mythics;
    const avgPerCard = totalCards > 0 ? totalValue / totalCards : 0;
    return {
      primary: { label: "Total Deck Value", value: "$" + formatNumber(Math.round(totalValue * 100) / 100) },
      details: [
        { label: "Common/Uncommon Value", value: "$" + formatNumber(Math.round(commonValue * 100) / 100) },
        { label: "Rare Value", value: "$" + formatNumber(Math.round(rareValue * 100) / 100) },
        { label: "Mythic/Ultra Rare Value", value: "$" + formatNumber(Math.round(mythicValue * 100) / 100) },
        { label: "Average Per Card", value: "$" + formatNumber(Math.round(avgPerCard * 100) / 100) }
      ]
    };
  }`,
  [
    "Q: How much does a competitive MTG deck cost?||A: Competitive Standard decks cost $150-400. Modern decks range from $300-1500. Legacy and Vintage decks can cost $2000-30000 due to reserved list cards.",
    "Q: Do trading cards hold their value?||A: High-rarity staple cards in popular formats tend to hold or increase in value. Bulk commons and rotated standard cards typically decrease. Sealed product often appreciates over time.",
    "Q: What is the most expensive trading card game to play?||A: Vintage Magic: The Gathering is the most expensive with decks costing $10,000 or more. Pokemon competitive decks are among the most affordable at $100-300 for Standard."
  ],
  `Common Value = Common Cards x Avg Common Price\nRare Value = Rare Cards x Avg Rare Price\nMythic Value = Mythic Cards x Avg Mythic Price\nTotal Deck Value = Common + Rare + Mythic Value`,
  ["tabletop-rpg-encounter-builder-calculator", "miniatures-army-cost-calculator"]
);

add(
  "board-game-play-time-calculator",
  "Board Game Play Time Calculator",
  "Estimate total board game session time based on game complexity, player count, player experience, and setup time to plan your game night.",
  "Everyday",
  "everyday",
  "~",
  ["board game time estimator", "game night planner", "board game session length", "tabletop play time"],
  [
    '{ name: "basePlayTime", label: "Box Play Time Estimate (min)", type: "number", min: 5, max: 600, defaultValue: 60 }',
    '{ name: "playerCount", label: "Number of Players", type: "number", min: 1, max: 12, defaultValue: 4 }',
    '{ name: "experience", label: "Player Experience", type: "select", options: [{ value: "1", label: "First time players" }, { value: "2", label: "Played a few times" }, { value: "3", label: "Experienced" }, { value: "4", label: "Expert" }], defaultValue: "2" }',
    '{ name: "complexity", label: "Game Complexity", type: "select", options: [{ value: "1", label: "Light (party game)" }, { value: "2", label: "Medium (strategy)" }, { value: "3", label: "Heavy (euro/war)" }, { value: "4", label: "Very Heavy (grand strategy)" }], defaultValue: "2" }'
  ],
  `(inputs) => {
    const baseTime = inputs.basePlayTime as number;
    const players = inputs.playerCount as number;
    const exp = parseInt(inputs.experience as string);
    const complexity = parseInt(inputs.complexity as string);
    const playerScaling = 1 + (players - 2) * 0.12;
    const expMultiplier = { 1: 1.6, 2: 1.2, 3: 1.0, 4: 0.85 };
    const setupTimes = { 1: 5, 2: 15, 3: 25, 4: 40 };
    const ruleExplainTime = exp === 1 ? complexity * 10 : 0;
    const playTime = Math.round(baseTime * playerScaling * (expMultiplier[exp] || 1.0));
    const setup = setupTimes[complexity] || 15;
    const totalTime = playTime + setup + ruleExplainTime;
    const hours = Math.floor(totalTime / 60);
    const mins = totalTime % 60;
    return {
      primary: { label: "Total Session Time", value: hours > 0 ? hours + "h " + mins + "m" : mins + " minutes" },
      details: [
        { label: "Actual Play Time", value: formatNumber(playTime) + " min" },
        { label: "Setup Time", value: formatNumber(setup) + " min" },
        { label: "Rules Explanation", value: formatNumber(ruleExplainTime) + " min" },
        { label: "Player Scaling Factor", value: formatNumber(Math.round(playerScaling * 100) / 100) + "x" }
      ]
    };
  }`,
  [
    "Q: Why do board games take longer than the box says?||A: Box times assume experienced players with minimal downtime. New players, rules explanations, analysis paralysis, and social chat all add significant time to the actual play experience.",
    "Q: How does player count affect game length?||A: Each additional player typically adds 10-15 percent more time due to extra turns, decisions, and interactions. Some games with simultaneous actions scale better than sequential turn games.",
    "Q: How long should a game night be?||A: Plan for 3-4 hours for a game night. This allows time for one large game or 2-3 shorter games including setup, rules, and breaks."
  ],
  `Play Time = Base Time x Player Scaling x Experience Multiplier\nSetup = Complexity-based estimate\nTotal Session = Play Time + Setup + Rules Explanation`,
  ["tabletop-rpg-encounter-builder-calculator", "card-game-deck-value-calculator"]
);

add(
  "miniatures-army-cost-calculator",
  "Miniatures Army Cost Calculator",
  "Calculate the total cost of building a tabletop miniatures army including models, paints, tools, and hobby supplies for popular wargaming systems.",
  "Finance",
  "finance",
  "$",
  ["miniatures army cost", "Warhammer army cost", "wargaming budget", "miniature painting cost"],
  [
    '{ name: "gameSystem", label: "Game System", type: "select", options: [{ value: "1", label: "Warhammer 40K" }, { value: "2", label: "Age of Sigmar" }, { value: "3", label: "Star Wars Legion" }, { value: "4", label: "Bolt Action" }], defaultValue: "1" }',
    '{ name: "armyPoints", label: "Army Point Value", type: "number", min: 250, max: 5000, defaultValue: 2000 }',
    '{ name: "paintSupplies", label: "Already Own Paint Supplies", type: "select", options: [{ value: "0", label: "No - Starting from scratch" }, { value: "1", label: "Yes - Have supplies" }], defaultValue: "0" }',
    '{ name: "purchaseMethod", label: "Purchase Method", type: "select", options: [{ value: "1", label: "New retail" }, { value: "2", label: "Online discount (15% off)" }, { value: "3", label: "Used/secondhand (40% off)" }], defaultValue: "1" }'
  ],
  `(inputs) => {
    const system = parseInt(inputs.gameSystem as string);
    const points = inputs.armyPoints as number;
    const hasPaints = parseInt(inputs.paintSupplies as string);
    const method = parseInt(inputs.purchaseMethod as string);
    const costPerPoint = { 1: 0.30, 2: 0.28, 3: 0.22, 4: 0.18 };
    const discounts = { 1: 1.0, 2: 0.85, 3: 0.60 };
    const baseModelCost = points * (costPerPoint[system] || 0.25);
    const modelCost = baseModelCost * (discounts[method] || 1.0);
    const paintCost = hasPaints === 0 ? 120 : 25;
    const toolsCost = hasPaints === 0 ? 60 : 0;
    const totalCost = modelCost + paintCost + toolsCost;
    const modelsEstimate = Math.round(points / 25);
    return {
      primary: { label: "Total Army Cost", value: "$" + formatNumber(Math.round(totalCost)) },
      details: [
        { label: "Model Cost", value: "$" + formatNumber(Math.round(modelCost)) },
        { label: "Paint Supplies", value: "$" + formatNumber(paintCost) },
        { label: "Tools and Accessories", value: "$" + formatNumber(toolsCost) },
        { label: "Estimated Model Count", value: formatNumber(modelsEstimate) + " models" }
      ]
    };
  }`,
  [
    "Q: How much does a Warhammer 40K army cost?||A: A competitive 2000-point Warhammer 40K army typically costs $500-800 at retail for models alone. Adding paints, brushes, and tools can add another $100-200 for beginners.",
    "Q: Is it cheaper to buy secondhand miniatures?||A: Yes, buying used miniatures on eBay or local groups can save 30-50 percent. Pre-assembled or partially painted models are often even cheaper. Stripping paint is straightforward.",
    "Q: What hobby supplies do I need to start?||A: Essential supplies include plastic clippers, a hobby knife, plastic glue, primer spray, a starter paint set, and at least 3 brush sizes. Expect to spend $50-80 on a beginner toolkit."
  ],
  `Model Cost = Army Points x Cost Per Point x Discount Multiplier\nPaint Supplies = $120 (new) or $25 (resupply)\nTools = $60 (new hobbyist) or $0 (existing)\nTotal = Models + Paint + Tools`,
  ["card-game-deck-value-calculator", "tabletop-rpg-encounter-builder-calculator"]
);

add(
  "chess-elo-rating-calculator",
  "Chess ELO Rating Calculator",
  "Calculate your expected new ELO rating after a chess match based on both players ratings and the match outcome using the standard ELO formula.",
  "Math",
  "math",
  "+",
  ["chess ELO calculator", "chess rating calculator", "ELO rating change", "chess ranking estimator"],
  [
    '{ name: "yourRating", label: "Your Current Rating", type: "number", min: 100, max: 3000, defaultValue: 1200 }',
    '{ name: "opponentRating", label: "Opponent Rating", type: "number", min: 100, max: 3000, defaultValue: 1400 }',
    '{ name: "result", label: "Match Result", type: "select", options: [{ value: "1", label: "Win" }, { value: "0.5", label: "Draw" }, { value: "0", label: "Loss" }], defaultValue: "1" }',
    '{ name: "kFactor", label: "K-Factor", type: "select", options: [{ value: "40", label: "40 (New player)" }, { value: "20", label: "20 (Standard)" }, { value: "10", label: "10 (Master level)" }], defaultValue: "20" }'
  ],
  `(inputs) => {
    const myRating = inputs.yourRating as number;
    const oppRating = inputs.opponentRating as number;
    const result = parseFloat(inputs.result as string);
    const k = parseInt(inputs.kFactor as string);
    const expectedScore = 1 / (1 + Math.pow(10, (oppRating - myRating) / 400));
    const ratingChange = Math.round(k * (result - expectedScore));
    const newRating = myRating + ratingChange;
    const winExpectancy = Math.round(expectedScore * 100);
    return {
      primary: { label: "New Rating", value: formatNumber(newRating) },
      details: [
        { label: "Rating Change", value: (ratingChange >= 0 ? "+" : "") + formatNumber(ratingChange) },
        { label: "Expected Score", value: formatNumber(Math.round(expectedScore * 1000) / 1000) },
        { label: "Win Probability", value: formatNumber(winExpectancy) + "%" },
        { label: "K-Factor Used", value: formatNumber(k) }
      ]
    };
  }`,
  [
    "Q: What is a good chess ELO rating?||A: Beginners start around 800-1000. Club players are typically 1200-1800. Expert level is 2000-2200. Masters are 2200 and above. Grandmasters are usually 2500 or higher.",
    "Q: What is the K-factor in ELO?||A: The K-factor determines how much a single game can change your rating. New players use K=40 for faster calibration. Established players use K=20. Top players use K=10 for stability.",
    "Q: How does the ELO system work?||A: The ELO system predicts expected outcomes based on rating differences. If you perform better than expected, your rating increases. The magnitude of change depends on the surprise factor and the K-factor."
  ],
  `Expected Score = 1 / (1 + 10^((Opponent Rating - Your Rating) / 400))\nRating Change = K x (Actual Result - Expected Score)\nNew Rating = Current Rating + Rating Change`,
  ["tabletop-rpg-encounter-builder-calculator", "poker-pot-odds-calculator"]
);

add(
  "poker-pot-odds-calculator",
  "Poker Pot Odds Calculator",
  "Calculate pot odds, equity needed, and expected value to make mathematically optimal decisions in Texas Hold em poker.",
  "Math",
  "math",
  "+",
  ["poker pot odds", "poker equity calculator", "poker math", "Texas Hold em odds"],
  [
    '{ name: "potSize", label: "Current Pot Size ($)", type: "number", min: 1, max: 100000, defaultValue: 100 }',
    '{ name: "betToCall", label: "Bet to Call ($)", type: "number", min: 1, max: 50000, defaultValue: 25 }',
    '{ name: "outs", label: "Number of Outs", type: "number", min: 0, max: 20, defaultValue: 9 }',
    '{ name: "street", label: "Current Street", type: "select", options: [{ value: "1", label: "Flop (2 cards to come)" }, { value: "2", label: "Turn (1 card to come)" }], defaultValue: "2" }'
  ],
  `(inputs) => {
    const pot = inputs.potSize as number;
    const bet = inputs.betToCall as number;
    const outs = inputs.outs as number;
    const street = parseInt(inputs.street as string);
    const totalPot = pot + bet;
    const potOdds = (bet / totalPot) * 100;
    const equity = street === 1 ? (1 - Math.pow((47 - outs) / 47 * (46 - outs) / 46, 1)) * 100 : (outs / 46) * 100;
    const approxEquity = street === 1 ? outs * 4 : outs * 2;
    const ev = (equity / 100) * pot - ((100 - equity) / 100) * bet;
    const decision = equity > potOdds ? "Call (Profitable)" : "Fold (Unprofitable)";
    return {
      primary: { label: "Decision", value: decision },
      details: [
        { label: "Pot Odds", value: formatNumber(Math.round(potOdds * 10) / 10) + "%" },
        { label: "Hand Equity", value: formatNumber(Math.round(equity * 10) / 10) + "%" },
        { label: "Quick Estimate (Rule of 2/4)", value: formatNumber(approxEquity) + "%" },
        { label: "Expected Value", value: (ev >= 0 ? "+$" : "-$") + formatNumber(Math.round(Math.abs(ev) * 100) / 100) }
      ]
    };
  }`,
  [
    "Q: What are pot odds in poker?||A: Pot odds represent the ratio between the current pot size and the cost of calling a bet. If the pot is $100 and you must call $25, your pot odds are 20 percent (25/125).",
    "Q: What are outs in poker?||A: Outs are the remaining cards in the deck that will complete your hand. For example, a flush draw has 9 outs (13 cards of a suit minus 4 you already see).",
    "Q: When should you call based on pot odds?||A: Call when your hand equity (chance of winning) exceeds the pot odds. If you need 20 percent equity to call profitably and your flush draw gives you 35 percent, calling is correct."
  ],
  `Pot Odds = Bet to Call / (Pot + Bet to Call) x 100\nEquity (Turn) = Outs / 46 x 100\nEquity (Flop) = 1 - ((47-Outs)/47 x (46-Outs)/46) x 100\nEV = Equity x Pot - (1-Equity) x Bet`,
  ["chess-elo-rating-calculator", "fantasy-sports-lineup-value-calculator"]
);

add(
  "fantasy-sports-lineup-value-calculator",
  "Fantasy Sports Lineup Value Calculator",
  "Optimize your daily fantasy sports lineup by calculating value scores, projected points per salary dollar, and remaining budget allocation.",
  "Finance",
  "finance",
  "$",
  ["fantasy sports lineup", "DFS lineup optimizer", "fantasy football value", "daily fantasy calculator"],
  [
    '{ name: "salaryCap", label: "Salary Cap ($)", type: "number", min: 10000, max: 100000, defaultValue: 50000 }',
    '{ name: "playersNeeded", label: "Roster Spots", type: "number", min: 1, max: 15, defaultValue: 9 }',
    '{ name: "salaryUsed", label: "Salary Used So Far ($)", type: "number", min: 0, max: 100000, defaultValue: 35000 }',
    '{ name: "playersSelected", label: "Players Selected", type: "number", min: 0, max: 14, defaultValue: 6 }'
  ],
  `(inputs) => {
    const cap = inputs.salaryCap as number;
    const spots = inputs.playersNeeded as number;
    const used = inputs.salaryUsed as number;
    const selected = inputs.playersSelected as number;
    const remaining = cap - used;
    const spotsLeft = spots - selected;
    const avgPerSpot = spotsLeft > 0 ? Math.round(remaining / spotsLeft) : 0;
    const idealAvg = Math.round(cap / spots);
    const overUnder = avgPerSpot - idealAvg;
    const flexibility = remaining > 0 ? Math.round((remaining / cap) * 100) : 0;
    const status = overUnder > 1000 ? "Above average budget remaining" : overUnder < -1000 ? "Below average - seek value plays" : "On track";
    return {
      primary: { label: "Avg Salary Per Remaining Spot", value: "$" + formatNumber(avgPerSpot) },
      details: [
        { label: "Remaining Budget", value: "$" + formatNumber(remaining) },
        { label: "Roster Spots Left", value: formatNumber(spotsLeft) },
        { label: "Ideal Average Per Spot", value: "$" + formatNumber(idealAvg) },
        { label: "Budget Status", value: status }
      ]
    };
  }`,
  [
    "Q: What is a good value target in daily fantasy?||A: Most winning lineups target players who produce 4-5x their salary in points. For example, a $5000 player should project for 20-25 fantasy points.",
    "Q: How should I allocate my DFS salary cap?||A: The stars and scrubs strategy allocates 60-70 percent of salary to 2-3 elite players and fills remaining spots with minimum salary plays. Balanced builds spread salary more evenly.",
    "Q: What percentage of DFS players are profitable?||A: Studies suggest roughly 10-15 percent of daily fantasy players are consistently profitable. Success requires research, bankroll management, and understanding ownership percentages."
  ],
  `Remaining Budget = Salary Cap - Salary Used\nSpots Left = Roster Spots - Players Selected\nAvg Per Spot = Remaining Budget / Spots Left\nIdeal Avg = Salary Cap / Total Roster Spots`,
  ["poker-pot-odds-calculator", "esports-prize-pool-split-calculator"]
);

add(
  "gaming-streaming-bitrate-calculator",
  "Gaming Streaming Bitrate Calculator",
  "Calculate the optimal streaming bitrate for your gaming streams based on resolution, frame rate, and upload speed to maximize quality without buffering.",
  "Everyday",
  "everyday",
  "~",
  ["streaming bitrate calculator", "OBS bitrate settings", "Twitch bitrate", "stream quality calculator"],
  [
    '{ name: "resolution", label: "Stream Resolution", type: "select", options: [{ value: "1", label: "720p" }, { value: "2", label: "900p" }, { value: "3", label: "1080p" }, { value: "4", label: "1440p" }, { value: "5", label: "4K" }], defaultValue: "3" }',
    '{ name: "fps", label: "Frame Rate", type: "select", options: [{ value: "30", label: "30 FPS" }, { value: "60", label: "60 FPS" }], defaultValue: "60" }',
    '{ name: "uploadSpeed", label: "Upload Speed (Mbps)", type: "number", min: 1, max: 1000, defaultValue: 20 }',
    '{ name: "gameMotion", label: "Game Motion Level", type: "select", options: [{ value: "1", label: "Low (card/strategy)" }, { value: "2", label: "Medium (RPG/MOBA)" }, { value: "3", label: "High (FPS/racing)" }], defaultValue: "2" }'
  ],
  `(inputs) => {
    const res = parseInt(inputs.resolution as string);
    const fps = parseInt(inputs.fps as string);
    const upload = inputs.uploadSpeed as number;
    const motion = parseInt(inputs.gameMotion as string);
    const baseBitrate = { 1: 3000, 2: 4500, 3: 6000, 4: 9000, 5: 20000 };
    const fpsMultiplier = fps === 60 ? 1.5 : 1.0;
    const motionMultiplier = { 1: 0.8, 2: 1.0, 3: 1.2 };
    const idealBitrate = Math.round((baseBitrate[res] || 6000) * fpsMultiplier * (motionMultiplier[motion] || 1.0));
    const maxUsable = Math.round(upload * 1000 * 0.75);
    const recommendedBitrate = Math.min(idealBitrate, maxUsable);
    const twitchMax = 6000;
    const platformCapped = Math.min(recommendedBitrate, twitchMax);
    const audioBitrate = 160;
    const totalBitrate = recommendedBitrate + audioBitrate;
    return {
      primary: { label: "Recommended Bitrate", value: formatNumber(recommendedBitrate) + " Kbps" },
      details: [
        { label: "Ideal Bitrate", value: formatNumber(idealBitrate) + " Kbps" },
        { label: "Max Usable (75% upload)", value: formatNumber(maxUsable) + " Kbps" },
        { label: "Twitch-Capped Bitrate", value: formatNumber(platformCapped) + " Kbps" },
        { label: "Total with Audio", value: formatNumber(totalBitrate) + " Kbps" }
      ]
    };
  }`,
  [
    "Q: What bitrate should I stream at on Twitch?||A: Twitch recommends a maximum of 6000 Kbps for non-partners. For 1080p 60fps, use 6000 Kbps. For 720p 30fps, 2500-3500 Kbps works well. Higher is not always better if viewers have slow connections.",
    "Q: How much upload speed do I need to stream?||A: For 1080p 60fps streaming at 6000 Kbps, you need at least 10 Mbps upload speed. This allows for the stream plus headroom for gaming and other network activity.",
    "Q: Does higher bitrate always mean better quality?||A: Higher bitrate improves quality up to a point, but it also requires more viewer bandwidth. Twitch and YouTube compress your stream further. Encoder quality settings often matter more than raw bitrate."
  ],
  `Ideal Bitrate = Base Bitrate x FPS Multiplier x Motion Multiplier\nMax Usable = Upload Speed x 1000 x 0.75\nRecommended = min(Ideal, Max Usable)\nPlatform Capped = min(Recommended, Platform Max)`,
  ["game-download-time-calculator", "twitch-streamer-revenue-calculator"]
);

add(
  "retro-game-collection-value-calculator",
  "Retro Game Collection Value Calculator",
  "Estimate the market value of your retro game collection based on console, condition, completeness, and number of titles.",
  "Finance",
  "finance",
  "$",
  ["retro game value", "vintage game collection", "old game prices", "retro gaming calculator"],
  [
    '{ name: "console", label: "Console Generation", type: "select", options: [{ value: "1", label: "NES/Master System" }, { value: "2", label: "SNES/Genesis" }, { value: "3", label: "N64/PS1/Saturn" }, { value: "4", label: "GameCube/PS2/Dreamcast" }, { value: "5", label: "Game Boy/GBA" }], defaultValue: "2" }',
    '{ name: "totalGames", label: "Total Number of Games", type: "number", min: 1, max: 1000, defaultValue: 25 }',
    '{ name: "condition", label: "Average Condition", type: "select", options: [{ value: "1", label: "Poor (loose, damaged)" }, { value: "2", label: "Good (loose, working)" }, { value: "3", label: "Very Good (complete in box)" }, { value: "4", label: "Excellent (CIB, near mint)" }], defaultValue: "2" }',
    '{ name: "rarePercent", label: "Percentage of Rare Titles (%)", type: "number", min: 0, max: 100, defaultValue: 10 }'
  ],
  `(inputs) => {
    const console = parseInt(inputs.console as string);
    const games = inputs.totalGames as number;
    const condition = parseInt(inputs.condition as string);
    const rarePercent = inputs.rarePercent as number / 100;
    const baseValues = { 1: 15, 2: 20, 3: 18, 4: 12, 5: 10 };
    const conditionMultiplier = { 1: 0.4, 2: 1.0, 3: 2.5, 4: 4.0 };
    const basePerGame = (baseValues[console] || 15) * (conditionMultiplier[condition] || 1.0);
    const commonGames = Math.round(games * (1 - rarePercent));
    const rareGames = games - commonGames;
    const commonValue = commonGames * basePerGame;
    const rareValue = rareGames * basePerGame * 5;
    const totalValue = commonValue + rareValue;
    const avgPerGame = games > 0 ? Math.round(totalValue / games * 100) / 100 : 0;
    return {
      primary: { label: "Estimated Collection Value", value: "$" + formatNumber(Math.round(totalValue)) },
      details: [
        { label: "Common Titles Value", value: "$" + formatNumber(Math.round(commonValue)) },
        { label: "Rare Titles Value", value: "$" + formatNumber(Math.round(rareValue)) },
        { label: "Average Per Game", value: "$" + formatNumber(avgPerGame) },
        { label: "Number of Rare Titles", value: formatNumber(rareGames) }
      ]
    };
  }`,
  [
    "Q: What retro games are worth the most?||A: Sealed copies of popular games command the highest prices. Rare titles like EarthBound, Chrono Trigger, and Little Samson can be worth hundreds or thousands. Condition and completeness are critical.",
    "Q: Does the box and manual matter for retro games?||A: Significantly. A complete-in-box game is typically worth 2-4 times more than a loose cartridge. Sealed games can be worth 10-50 times more than loose copies.",
    "Q: Are retro games a good investment?||A: Retro game prices have generally increased over the past decade, especially for popular and rare titles. However, the market can be volatile and storage conditions affect long-term value."
  ],
  `Base Value = Console Base Price x Condition Multiplier\nCommon Value = Common Games x Base Value\nRare Value = Rare Games x Base Value x 5\nTotal = Common Value + Rare Value`,
  ["card-game-deck-value-calculator", "gaming-peripheral-budget-calculator"]
);

add(
  "gaming-peripheral-budget-calculator",
  "Gaming Peripheral Budget Calculator",
  "Plan your gaming peripheral upgrade budget across keyboard, mouse, headset, mousepad, and extras with tier-based pricing.",
  "Finance",
  "finance",
  "$",
  ["gaming peripheral cost", "gaming gear budget", "keyboard mouse budget", "gaming accessories cost"],
  [
    '{ name: "keyboardTier", label: "Keyboard Tier", type: "select", options: [{ value: "1", label: "Budget membrane ($20)" }, { value: "2", label: "Entry mechanical ($50)" }, { value: "3", label: "Mid mechanical ($100)" }, { value: "4", label: "Premium mechanical ($180)" }, { value: "5", label: "Enthusiast custom ($300)" }], defaultValue: "3" }',
    '{ name: "mouseTier", label: "Mouse Tier", type: "select", options: [{ value: "1", label: "Budget ($15)" }, { value: "2", label: "Mid-range ($40)" }, { value: "3", label: "Premium ($70)" }, { value: "4", label: "Ultra-light/wireless ($130)" }], defaultValue: "3" }',
    '{ name: "headsetTier", label: "Headset Tier", type: "select", options: [{ value: "1", label: "Budget ($25)" }, { value: "2", label: "Mid-range ($60)" }, { value: "3", label: "Premium ($120)" }, { value: "4", label: "Audiophile ($250)" }], defaultValue: "2" }',
    '{ name: "extras", label: "Extra Accessories Budget ($)", type: "number", min: 0, max: 500, defaultValue: 40 }'
  ],
  `(inputs) => {
    const kbTier = parseInt(inputs.keyboardTier as string);
    const mouseTier = parseInt(inputs.mouseTier as string);
    const headsetTier = parseInt(inputs.headsetTier as string);
    const extras = inputs.extras as number;
    const kbPrices = { 1: 20, 2: 50, 3: 100, 4: 180, 5: 300 };
    const mousePrices = { 1: 15, 2: 40, 3: 70, 4: 130 };
    const headsetPrices = { 1: 25, 2: 60, 3: 120, 4: 250 };
    const kbCost = kbPrices[kbTier] || 100;
    const mouseCost = mousePrices[mouseTier] || 70;
    const headsetCost = headsetPrices[headsetTier] || 60;
    const mousepadCost = mouseTier >= 3 ? 30 : 15;
    const totalCost = kbCost + mouseCost + headsetCost + mousepadCost + extras;
    return {
      primary: { label: "Total Peripheral Budget", value: "$" + formatNumber(totalCost) },
      details: [
        { label: "Keyboard", value: "$" + formatNumber(kbCost) },
        { label: "Mouse", value: "$" + formatNumber(mouseCost) },
        { label: "Headset", value: "$" + formatNumber(headsetCost) },
        { label: "Mousepad + Extras", value: "$" + formatNumber(mousepadCost + extras) }
      ]
    };
  }`,
  [
    "Q: What gaming peripherals should I upgrade first?||A: Upgrade your mouse first for the biggest impact on aim and comfort. A good mousepad is a cheap second upgrade. A mechanical keyboard improves feel and responsiveness. Headset upgrades benefit communication and immersion.",
    "Q: Are expensive gaming peripherals worth it?||A: Mid-range peripherals ($50-100 per item) offer the best value. Premium options provide diminishing returns but better build quality, features, and longevity. Budget options are fine for casual gaming.",
    "Q: How long do gaming peripherals last?||A: Quality mechanical keyboards last 5-10 years. Gaming mice typically last 2-4 years depending on switch quality. Headsets average 2-5 years. Mousepads should be replaced annually."
  ],
  `Total = Keyboard + Mouse + Headset + Mousepad + Extras\nMousepad = $30 (premium) or $15 (standard)`,
  ["gaming-desk-setup-cost-calculator", "gaming-pc-build-budget-calculator"]
);

add(
  "loot-box-probability-calculator",
  "Loot Box Probability Calculator",
  "Calculate the probability of getting a specific item from loot boxes based on drop rates, number of boxes opened, and pity system mechanics.",
  "Math",
  "math",
  "+",
  ["loot box probability", "gacha calculator", "drop rate calculator", "loot box odds"],
  [
    '{ name: "dropRate", label: "Item Drop Rate (%)", type: "number", min: 0.01, max: 100, defaultValue: 5 }',
    '{ name: "boxesOpened", label: "Boxes to Open", type: "number", min: 1, max: 1000, defaultValue: 20 }',
    '{ name: "costPerBox", label: "Cost Per Box ($)", type: "number", min: 0, max: 100, defaultValue: 2.50 }',
    '{ name: "pitySystem", label: "Pity System (Guaranteed After)", type: "number", min: 0, max: 500, defaultValue: 0 }'
  ],
  `(inputs) => {
    const rate = inputs.dropRate as number / 100;
    const boxes = inputs.boxesOpened as number;
    const cost = inputs.costPerBox as number;
    const pity = inputs.pitySystem as number;
    const probNone = Math.pow(1 - rate, boxes);
    const probAtLeastOne = (1 - probNone) * 100;
    const adjustedProb = pity > 0 && boxes >= pity ? 100 : probAtLeastOne;
    const expectedBoxes = Math.ceil(1 / rate);
    const expectedCost = expectedBoxes * cost;
    const totalSpend = boxes * cost;
    const avgDropsExpected = Math.round(boxes * rate * 100) / 100;
    return {
      primary: { label: "Chance of Getting Item", value: formatNumber(Math.round(adjustedProb * 100) / 100) + "%" },
      details: [
        { label: "Expected Boxes to Get Item", value: formatNumber(expectedBoxes) },
        { label: "Expected Cost for Item", value: "$" + formatNumber(Math.round(expectedCost * 100) / 100) },
        { label: "Total Spend (" + boxes + " boxes)", value: "$" + formatNumber(Math.round(totalSpend * 100) / 100) },
        { label: "Expected Drops in " + boxes + " Boxes", value: formatNumber(avgDropsExpected) }
      ]
    };
  }`,
  [
    "Q: What are typical loot box drop rates?||A: Common items have 50-80 percent drop rates. Rare items are typically 10-20 percent. Epic items are 2-5 percent. Legendary items are often 0.5-2 percent. Some ultra-rare items have rates below 0.1 percent.",
    "Q: What is a pity system in gacha games?||A: A pity system guarantees a rare item after a set number of unsuccessful pulls. For example, many gacha games guarantee a 5-star character within 90 pulls even if the base rate is very low.",
    "Q: How much do loot boxes really cost?||A: The expected cost to get a specific legendary item at 1 percent drop rate with $2 boxes is about $200. With a 0.1 percent rate it jumps to $2000. Pity systems reduce the worst-case scenario."
  ],
  `Prob(0 drops) = (1 - Drop Rate)^Boxes\nProb(at least 1) = 1 - Prob(0 drops)\nExpected Boxes = 1 / Drop Rate\nExpected Cost = Expected Boxes x Cost Per Box`,
  ["poker-pot-odds-calculator", "card-game-deck-value-calculator"]
);

add(
  "gaming-chair-size-calculator",
  "Gaming Chair Size Calculator",
  "Find the right gaming chair size based on your height, weight, and preferred sitting style to ensure proper ergonomic support during long sessions.",
  "Everyday",
  "everyday",
  "~",
  ["gaming chair size", "ergonomic chair calculator", "gaming seat guide", "chair size finder"],
  [
    '{ name: "height", label: "Your Height (inches)", type: "number", min: 48, max: 84, defaultValue: 70 }',
    '{ name: "weight", label: "Your Weight (lbs)", type: "number", min: 80, max: 400, defaultValue: 175 }',
    '{ name: "sittingStyle", label: "Sitting Preference", type: "select", options: [{ value: "1", label: "Upright" }, { value: "2", label: "Slightly reclined" }, { value: "3", label: "Heavily reclined" }], defaultValue: "2" }',
    '{ name: "budget", label: "Budget ($)", type: "number", min: 50, max: 2000, defaultValue: 300 }'
  ],
  `(inputs) => {
    const height = inputs.height as number;
    const weight = inputs.weight as number;
    const style = parseInt(inputs.sittingStyle as string);
    const budget = inputs.budget as number;
    const chairSize = height < 64 ? "Small" : height < 70 ? "Medium" : height < 76 ? "Large" : "Extra Large";
    const seatWidth = weight < 150 ? 17 : weight < 200 ? 19 : weight < 250 ? 21 : 23;
    const seatHeight = Math.round(height * 0.25 * 10) / 10;
    const backHeight = style === 3 ? "Tall (30+ inches)" : style === 2 ? "Standard (26-30 inches)" : "Mid-back (22-26 inches)";
    const recommendation = budget >= 400 ? "Ergonomic office chair" : budget >= 200 ? "Mid-range gaming chair" : "Budget gaming chair";
    return {
      primary: { label: "Recommended Size", value: chairSize },
      details: [
        { label: "Minimum Seat Width", value: formatNumber(seatWidth) + " inches" },
        { label: "Ideal Seat Height", value: formatNumber(seatHeight) + " inches" },
        { label: "Back Height", value: backHeight },
        { label: "Budget Recommendation", value: recommendation }
      ]
    };
  }`,
  [
    "Q: What size gaming chair do I need?||A: Gaming chairs are sized by height: Small for under 5 foot 4, Medium for 5 foot 4 to 5 foot 10, Large for 5 foot 10 to 6 foot 3, and XL for above 6 foot 3. Weight capacity should exceed your weight by at least 25 percent.",
    "Q: Are gaming chairs better than office chairs?||A: Ergonomic office chairs generally provide better long-term support and adjustability. Gaming chairs offer more style options and features like recline. For extended sitting, ergonomic office chairs are recommended.",
    "Q: How long should a gaming chair last?||A: A quality gaming chair should last 3-5 years with daily use. Premium chairs can last 5-7 years. Mesh office chairs often outlast foam gaming chairs because foam degrades over time."
  ],
  `Chair Size = Based on height ranges\nSeat Width = Based on weight ranges\nIdeal Seat Height = Height x 0.25\nBack Height = Based on sitting style preference`,
  ["gaming-desk-setup-cost-calculator", "gaming-peripheral-budget-calculator"]
);

add(
  "gaming-monitor-size-calculator",
  "Gaming Monitor Size Calculator",
  "Determine the optimal monitor size and resolution based on your viewing distance, desk depth, and primary use case for the best visual experience.",
  "Everyday",
  "everyday",
  "~",
  ["gaming monitor size", "monitor distance calculator", "screen size guide", "gaming display calculator"],
  [
    '{ name: "deskDepth", label: "Desk Depth / Viewing Distance (inches)", type: "number", min: 15, max: 60, defaultValue: 28 }',
    '{ name: "primaryUse", label: "Primary Use", type: "select", options: [{ value: "1", label: "Competitive FPS" }, { value: "2", label: "RPG/Story games" }, { value: "3", label: "Sim racing/flight" }, { value: "4", label: "Mixed gaming and work" }], defaultValue: "4" }',
    '{ name: "budgetRange", label: "Budget Range", type: "select", options: [{ value: "1", label: "Under $200" }, { value: "2", label: "$200-400" }, { value: "3", label: "$400-700" }, { value: "4", label: "$700+" }], defaultValue: "2" }',
    '{ name: "multiMonitor", label: "Multi-Monitor Setup", type: "select", options: [{ value: "1", label: "Single monitor" }, { value: "2", label: "Dual monitors" }, { value: "3", label: "Triple monitors" }], defaultValue: "1" }'
  ],
  `(inputs) => {
    const distance = inputs.deskDepth as number;
    const use = parseInt(inputs.primaryUse as string);
    const budget = parseInt(inputs.budgetRange as string);
    const multi = parseInt(inputs.multiMonitor as string);
    const idealSize = Math.round(distance * 0.95);
    const clampedSize = Math.max(24, Math.min(idealSize, 42));
    const resolution = clampedSize >= 32 ? "4K (3840x2160)" : clampedSize >= 27 ? "1440p (2560x1440)" : "1080p (1920x1080)";
    const refreshRate = use === 1 ? "240Hz+" : use === 2 ? "60-144Hz" : use === 3 ? "120-165Hz" : "144Hz";
    const panelType = use === 1 ? "TN or Fast IPS" : use === 2 ? "IPS or OLED" : use === 3 ? "VA or OLED" : "IPS";
    const estimatedCost = (budget === 1 ? 150 : budget === 2 ? 300 : budget === 3 ? 550 : 900) * multi;
    return {
      primary: { label: "Recommended Size", value: formatNumber(clampedSize) + " inches" },
      details: [
        { label: "Recommended Resolution", value: resolution },
        { label: "Ideal Refresh Rate", value: refreshRate },
        { label: "Best Panel Type", value: panelType },
        { label: "Estimated Total Cost (" + multi + " monitor" + (multi > 1 ? "s" : "") + ")", value: "$" + formatNumber(estimatedCost) }
      ]
    };
  }`,
  [
    "Q: What size monitor is best for gaming?||A: For competitive FPS at arm length (24-28 inches), a 24-27 inch monitor is ideal. For immersive gaming at greater distance, 27-32 inches works well. Ultrawide 34 inch monitors suit sim racing and RPGs.",
    "Q: Is 4K worth it for gaming?||A: At 27 inches or smaller, the difference between 1440p and 4K is subtle. At 32 inches and above, 4K becomes noticeably sharper. However, 4K requires a much more powerful GPU to drive high frame rates.",
    "Q: Does panel type matter for gaming?||A: IPS panels offer the best color accuracy and viewing angles. TN panels have the fastest response times for competitive play. VA panels have the best contrast ratios. OLED offers perfect blacks and fast response."
  ],
  `Ideal Size = Viewing Distance x 0.95 (clamped 24-42 inches)\nResolution = Based on screen size\nRefresh Rate = Based on primary use case\nPanel Type = Based on primary use case`,
  ["gaming-monitor-input-lag-calculator", "gaming-desk-setup-cost-calculator"]
);
add(
  "centrifuge-rcf-rpm-calculator",
  "Centrifuge RCF to RPM Calculator",
  "Convert between relative centrifugal force (RCF/g-force) and revolutions per minute (RPM) for any rotor radius used in laboratory centrifugation.",
  "Science",
  "science",
  "A",
  ["rcf to rpm", "centrifuge calculator", "g-force rpm conversion", "rotor radius", "relative centrifugal force"],
  [
    '{ name: "rcf", label: "Relative Centrifugal Force (x g)", type: "number", min: 1, max: 1000000, defaultValue: 10000 }',
    '{ name: "radius", label: "Rotor Radius (mm)", type: "number", min: 10, max: 500, defaultValue: 100 }',
    '{ name: "mode", label: "Conversion Direction", type: "select", options: [{ value: "1", label: "RCF to RPM" }, { value: "2", label: "RPM to RCF" }], defaultValue: "1" }'
  ],
  `(inputs) => {
    const rcf = inputs.rcf as number;
    const radius = inputs.radius as number;
    const mode = inputs.mode as number;
    if (mode === 1) {
      const rpm = Math.sqrt(rcf / (1.118e-5 * radius));
      return {
        primary: { label: "RPM", value: formatNumber(Math.round(rpm)) },
        details: [
          { label: "RCF Input", value: formatNumber(rcf) + " x g" },
          { label: "Rotor Radius", value: formatNumber(radius) + " mm" },
          { label: "Angular Velocity", value: formatNumber(Math.round(rpm * 2 * 3.14159 / 60 * 10) / 10) + " rad/s" }
        ]
      };
    } else {
      const rpmVal = rcf;
      const calcRcf = 1.118e-5 * radius * rpmVal * rpmVal;
      return {
        primary: { label: "RCF (x g)", value: formatNumber(Math.round(calcRcf)) },
        details: [
          { label: "RPM Input", value: formatNumber(rpmVal) },
          { label: "Rotor Radius", value: formatNumber(radius) + " mm" },
          { label: "Angular Velocity", value: formatNumber(Math.round(rpmVal * 2 * 3.14159 / 60 * 10) / 10) + " rad/s" }
        ]
      };
    }
  }`,
  [
    "Q: What is RCF and how does it differ from RPM?||A: RCF (Relative Centrifugal Force) measures the actual gravitational force applied to samples in units of g. RPM measures rotor speed. RCF depends on both RPM and rotor radius, making it the more accurate specification for protocols.",
    "Q: Why do protocols specify RCF instead of RPM?||A: Protocols specify RCF because it is independent of rotor size. The same RPM on different rotors produces different g-forces. Using RCF ensures reproducible separation across different centrifuge models.",
    "Q: How do I measure my rotor radius?||A: Measure from the center of the rotor shaft to the bottom of the sample tube when loaded in the rotor. Most rotor manuals list both minimum and maximum radius values."
  ],
  `RCF = 1.118 x 10^-5 x r x RPM^2\nRPM = sqrt(RCF / (1.118 x 10^-5 x r))\nwhere r = rotor radius in mm`,
  ["serial-dilution-calculator", "molarity-calculator", "spectrophotometer-calculator"]
);

add(
  "electrolysis-time-calculator",
  "Electrolysis Time Calculator",
  "Calculate the time required for electrolysis based on current, mass of substance deposited, molar mass, and valence using Faraday laws of electrolysis.",
  "Science",
  "science",
  "A",
  ["electrolysis time", "faraday law", "electroplating time", "electrolytic deposition", "coulombs calculation"],
  [
    '{ name: "mass", label: "Mass to Deposit (g)", type: "number", min: 0.001, max: 10000, defaultValue: 10 }',
    '{ name: "molarMass", label: "Molar Mass (g/mol)", type: "number", min: 1, max: 300, defaultValue: 63.55 }',
    '{ name: "valence", label: "Valence (electrons transferred)", type: "number", min: 1, max: 8, defaultValue: 2 }',
    '{ name: "current", label: "Current (Amperes)", type: "number", min: 0.01, max: 1000, defaultValue: 5 }'
  ],
  `(inputs) => {
    const mass = inputs.mass as number;
    const molarMass = inputs.molarMass as number;
    const valence = inputs.valence as number;
    const current = inputs.current as number;
    const faraday = 96485;
    const moles = mass / molarMass;
    const charge = moles * valence * faraday;
    const timeSeconds = charge / current;
    const timeMinutes = timeSeconds / 60;
    const timeHours = timeMinutes / 60;
    return {
      primary: { label: "Time Required", value: formatNumber(Math.round(timeMinutes * 10) / 10) + " min" },
      details: [
        { label: "Time (seconds)", value: formatNumber(Math.round(timeSeconds)) },
        { label: "Time (hours)", value: formatNumber(Math.round(timeHours * 100) / 100) },
        { label: "Total Charge", value: formatNumber(Math.round(charge)) + " C" },
        { label: "Moles Deposited", value: formatNumber(Math.round(moles * 10000) / 10000) }
      ]
    };
  }`,
  [
    "Q: What is Faraday constant used in electrolysis?||A: The Faraday constant is 96,485 coulombs per mole of electrons. It represents the total electric charge carried by one mole of electrons and is fundamental to calculating electrolysis time and mass deposited.",
    "Q: How does valence affect electrolysis time?||A: Higher valence means more electrons must be transferred per atom deposited. For example, depositing Cu2+ requires 2 electrons per atom while depositing Al3+ requires 3, making aluminum deposition take longer for the same number of moles.",
    "Q: Can I use this for electroplating calculations?||A: Yes. Electroplating is a form of electrolysis. Enter the mass of metal you want to plate, its molar mass and valence, and your plating current to determine the required time."
  ],
  `t = (m x z x F) / (M x I)\nwhere m = mass (g), z = valence, F = 96485 C/mol\nM = molar mass (g/mol), I = current (A)`,
  ["nernst-equation-calculator", "molarity-calculator", "oxidation-number-calculator"]
);

add(
  "bacterial-growth-rate-calculator",
  "Bacterial Growth Rate Calculator",
  "Calculate bacterial growth rate, generation time, and projected population from initial and final cell counts during exponential growth phase.",
  "Science",
  "science",
  "A",
  ["bacterial growth rate", "generation time", "doubling rate bacteria", "exponential growth microbiology", "cell division rate"],
  [
    '{ name: "n0", label: "Initial Cell Count", type: "number", min: 1, max: 1e12, defaultValue: 1000 }',
    '{ name: "nt", label: "Final Cell Count", type: "number", min: 1, max: 1e15, defaultValue: 1000000 }',
    '{ name: "time", label: "Time Elapsed (hours)", type: "number", min: 0.1, max: 200, defaultValue: 6 }'
  ],
  `(inputs) => {
    const n0 = inputs.n0 as number;
    const nt = inputs.nt as number;
    const time = inputs.time as number;
    const generations = Math.log2(nt / n0);
    const generationTime = time / generations;
    const growthRate = Math.log(nt / n0) / time;
    const doublingTime = Math.log(2) / growthRate;
    const predict24 = n0 * Math.pow(2, 24 / generationTime);
    return {
      primary: { label: "Growth Rate (k)", value: formatNumber(Math.round(growthRate * 10000) / 10000) + " /hr" },
      details: [
        { label: "Generation Time", value: formatNumber(Math.round(generationTime * 100) / 100) + " hrs" },
        { label: "Number of Generations", value: formatNumber(Math.round(generations * 100) / 100) },
        { label: "Doubling Time", value: formatNumber(Math.round(doublingTime * 100) / 100) + " hrs" },
        { label: "Projected 24hr Population", value: formatNumber(Math.round(predict24)) }
      ]
    };
  }`,
  [
    "Q: What is the difference between growth rate and generation time?||A: Growth rate (k) describes how fast the population increases per unit time using natural logarithm. Generation time (g) is the time required for the population to double. They are inversely related: g = ln(2)/k.",
    "Q: Why does this only work for exponential phase?||A: During lag and stationary phases, growth rate changes. This calculator assumes constant exponential growth where nutrients are unlimited and waste is not inhibitory. For accurate results, use cell counts taken during log phase only.",
    "Q: What is a typical bacterial generation time?||A: E. coli doubles every 20 minutes under optimal conditions. Most common lab bacteria have generation times of 20 minutes to 2 hours. Environmental bacteria may take hours to days."
  ],
  `k = ln(Nt / N0) / t\ng = ln(2) / k\nGenerations = log2(Nt / N0)\nwhere Nt = final count, N0 = initial count, t = time`,
  ["generation-time-calculator", "doubling-time-calculator", "serial-dilution-calculator"]
);

add(
  "solution-preparation-calculator",
  "Solution Preparation Calculator",
  "Calculate the mass of solute needed to prepare a solution of a desired molar concentration and volume in the laboratory.",
  "Science",
  "science",
  "A",
  ["solution preparation", "molar solution", "reagent mass", "lab solution making", "prepare molar solution"],
  [
    '{ name: "concentration", label: "Desired Concentration (M)", type: "number", min: 0.0001, max: 20, defaultValue: 0.5 }',
    '{ name: "volume", label: "Final Volume (mL)", type: "number", min: 1, max: 100000, defaultValue: 500 }',
    '{ name: "molarMass", label: "Molar Mass of Solute (g/mol)", type: "number", min: 1, max: 2000, defaultValue: 58.44 }',
    '{ name: "purity", label: "Reagent Purity (%)", type: "number", min: 1, max: 100, defaultValue: 99 }'
  ],
  `(inputs) => {
    const concentration = inputs.concentration as number;
    const volume = inputs.volume as number;
    const molarMass = inputs.molarMass as number;
    const purity = inputs.purity as number;
    const volumeL = volume / 1000;
    const molesNeeded = concentration * volumeL;
    const massIdeal = molesNeeded * molarMass;
    const massActual = massIdeal / (purity / 100);
    return {
      primary: { label: "Mass of Solute Needed", value: formatNumber(Math.round(massActual * 1000) / 1000) + " g" },
      details: [
        { label: "Ideal Mass (100% pure)", value: formatNumber(Math.round(massIdeal * 1000) / 1000) + " g" },
        { label: "Moles Required", value: formatNumber(Math.round(molesNeeded * 10000) / 10000) + " mol" },
        { label: "Volume in Liters", value: formatNumber(volumeL) + " L" },
        { label: "Purity Correction Factor", value: formatNumber(Math.round(100 / purity * 10000) / 10000) }
      ]
    };
  }`,
  [
    "Q: How do I account for reagent purity?||A: Divide the ideal mass by the fractional purity. For example, if you need 5.844 g of NaCl but your reagent is 98% pure, weigh out 5.844 / 0.98 = 5.963 g to get the correct amount of actual solute.",
    "Q: Should I dissolve solute in the full final volume?||A: No. Dissolve the solute in about 80% of the final volume first, then bring the solution up to the final volume mark in a volumetric flask. Adding solute changes the volume.",
    "Q: What is the most common molar solution prepared in labs?||A: 1 M NaCl (molar mass 58.44 g/mol) is one of the most common. Others include 1 M HCl, 1 M NaOH, and various buffer solutions at specific concentrations."
  ],
  `Mass = (Concentration x Volume(L) x Molar Mass) / (Purity/100)\nMoles = Concentration x Volume(L)`,
  ["molarity-calculator", "dilution-calculator", "molar-mass-calculator"]
);

add(
  "reagent-cost-per-experiment-calculator",
  "Reagent Cost Per Experiment Calculator",
  "Estimate the cost of reagents consumed per experiment based on reagent prices, volumes used, and number of replicates to budget lab research spending.",
  "Finance",
  "finance",
  "$",
  ["reagent cost", "experiment budget", "lab reagent expense", "research cost per experiment", "laboratory supplies cost"],
  [
    '{ name: "reagentCost", label: "Reagent Bottle Cost ($)", type: "number", min: 1, max: 50000, defaultValue: 250 }',
    '{ name: "bottleVolume", label: "Bottle Volume (mL)", type: "number", min: 0.1, max: 10000, defaultValue: 500 }',
    '{ name: "volumePerExpt", label: "Volume Per Experiment (mL)", type: "number", min: 0.001, max: 5000, defaultValue: 5 }',
    '{ name: "replicates", label: "Replicates Per Experiment", type: "number", min: 1, max: 100, defaultValue: 3 }',
    '{ name: "numReagents", label: "Number of Different Reagents", type: "number", min: 1, max: 50, defaultValue: 4 }'
  ],
  `(inputs) => {
    const reagentCost = inputs.reagentCost as number;
    const bottleVolume = inputs.bottleVolume as number;
    const volumePerExpt = inputs.volumePerExpt as number;
    const replicates = inputs.replicates as number;
    const numReagents = inputs.numReagents as number;
    const costPerMl = reagentCost / bottleVolume;
    const totalVolume = volumePerExpt * replicates;
    const costPerReagent = costPerMl * totalVolume;
    const totalCostPerExpt = costPerReagent * numReagents;
    const exptPerBottle = Math.floor(bottleVolume / totalVolume);
    return {
      primary: { label: "Total Cost Per Experiment", value: "$" + formatNumber(Math.round(totalCostPerExpt * 100) / 100) },
      details: [
        { label: "Cost Per Reagent Used", value: "$" + formatNumber(Math.round(costPerReagent * 100) / 100) },
        { label: "Cost Per mL", value: "$" + formatNumber(Math.round(costPerMl * 1000) / 1000) },
        { label: "Total Volume Per Experiment", value: formatNumber(totalVolume) + " mL" },
        { label: "Experiments Per Bottle", value: formatNumber(exptPerBottle) }
      ]
    };
  }`,
  [
    "Q: How can I reduce reagent cost per experiment?||A: Buy reagents in bulk when possible, optimize protocol volumes, reduce unnecessary replicates, share reagents between lab groups, and check for cheaper supplier alternatives or generic brands.",
    "Q: Should I include overhead costs in experiment budgets?||A: This calculator covers direct reagent costs. Full experiment costing should also include labor, equipment depreciation, consumables like pipette tips, and facility overhead, which can double or triple the reagent-only cost.",
    "Q: How many replicates should I run?||A: Most experiments require at least 3 biological replicates for statistical validity. Power analysis can determine the optimal number based on expected effect size and desired statistical significance."
  ],
  `Cost Per mL = Reagent Price / Bottle Volume\nCost Per Experiment = Cost/mL x Volume/Expt x Replicates x Number of Reagents`,
  ["molarity-calculator", "dilution-calculator", "serial-dilution-calculator"]
);

add(
  "lab-equipment-depreciation-calculator",
  "Lab Equipment Depreciation Calculator",
  "Calculate annual depreciation, book value, and cost-per-use for laboratory equipment using straight-line or declining balance depreciation methods.",
  "Finance",
  "finance",
  "$",
  ["lab equipment depreciation", "instrument depreciation", "lab asset value", "equipment book value", "scientific instrument cost"],
  [
    '{ name: "purchasePrice", label: "Purchase Price ($)", type: "number", min: 100, max: 10000000, defaultValue: 50000 }',
    '{ name: "salvageValue", label: "Salvage Value ($)", type: "number", min: 0, max: 5000000, defaultValue: 5000 }',
    '{ name: "usefulLife", label: "Useful Life (years)", type: "number", min: 1, max: 30, defaultValue: 10 }',
    '{ name: "currentAge", label: "Current Age (years)", type: "number", min: 0, max: 30, defaultValue: 3 }',
    '{ name: "usesPerYear", label: "Uses Per Year", type: "number", min: 1, max: 10000, defaultValue: 500 }'
  ],
  `(inputs) => {
    const purchasePrice = inputs.purchasePrice as number;
    const salvageValue = inputs.salvageValue as number;
    const usefulLife = inputs.usefulLife as number;
    const currentAge = inputs.currentAge as number;
    const usesPerYear = inputs.usesPerYear as number;
    const depreciableAmount = purchasePrice - salvageValue;
    const annualDepreciation = depreciableAmount / usefulLife;
    const totalDepreciation = Math.min(annualDepreciation * currentAge, depreciableAmount);
    const currentBookValue = purchasePrice - totalDepreciation;
    const costPerUse = annualDepreciation / usesPerYear;
    const remainingLife = Math.max(usefulLife - currentAge, 0);
    return {
      primary: { label: "Current Book Value", value: "$" + formatNumber(Math.round(currentBookValue)) },
      details: [
        { label: "Annual Depreciation", value: "$" + formatNumber(Math.round(annualDepreciation)) },
        { label: "Total Depreciation to Date", value: "$" + formatNumber(Math.round(totalDepreciation)) },
        { label: "Cost Per Use", value: "$" + formatNumber(Math.round(costPerUse * 100) / 100) },
        { label: "Remaining Useful Life", value: formatNumber(remainingLife) + " years" }
      ]
    };
  }`,
  [
    "Q: What depreciation method is standard for lab equipment?||A: Straight-line depreciation is most common for lab equipment in academic settings. It spreads the cost evenly over the useful life. Some institutions use declining balance for equipment that loses value faster in early years.",
    "Q: What is a typical useful life for common lab instruments?||A: Centrifuges and spectrophotometers typically last 10-15 years. PCR machines last 7-10 years. Microscopes can last 15-20 years with proper maintenance. High-end mass spectrometers may have 10-year useful lives.",
    "Q: Why is cost-per-use important for lab budgeting?||A: Cost-per-use helps justify equipment purchases, set user fees for shared instruments, and compare whether purchasing or renting equipment is more economical for your usage volume."
  ],
  `Annual Depreciation = (Purchase Price - Salvage Value) / Useful Life\nBook Value = Purchase Price - (Annual Depreciation x Age)\nCost Per Use = Annual Depreciation / Uses Per Year`,
  ["reagent-cost-per-experiment-calculator", "molarity-calculator", "solution-preparation-calculator"]
);

add(
  "pcr-cycle-number-calculator",
  "PCR Cycle Number Calculator",
  "Calculate the theoretical DNA amplification yield from PCR based on number of cycles, initial template copies, and amplification efficiency.",
  "Science",
  "science",
  "A",
  ["pcr cycle calculator", "pcr amplification", "dna copies pcr", "polymerase chain reaction", "pcr yield"],
  [
    '{ name: "initialCopies", label: "Initial Template Copies", type: "number", min: 1, max: 1e12, defaultValue: 1000 }',
    '{ name: "cycles", label: "Number of PCR Cycles", type: "number", min: 1, max: 60, defaultValue: 30 }',
    '{ name: "efficiency", label: "Amplification Efficiency (%)", type: "number", min: 50, max: 100, defaultValue: 95 }'
  ],
  `(inputs) => {
    const initialCopies = inputs.initialCopies as number;
    const cycles = inputs.cycles as number;
    const efficiency = inputs.efficiency as number;
    const effFraction = efficiency / 100;
    const finalCopies = initialCopies * Math.pow(1 + effFraction, cycles);
    const foldAmplification = Math.pow(1 + effFraction, cycles);
    const idealCopies = initialCopies * Math.pow(2, cycles);
    const actualVsIdeal = (finalCopies / idealCopies) * 100;
    return {
      primary: { label: "Final DNA Copies", value: formatNumber(Math.round(finalCopies)) },
      details: [
        { label: "Fold Amplification", value: formatNumber(Math.round(foldAmplification)) + "x" },
        { label: "Ideal Copies (100% eff.)", value: formatNumber(Math.round(idealCopies)) },
        { label: "Actual vs Ideal", value: formatNumber(Math.round(actualVsIdeal * 100) / 100) + "%" },
        { label: "Effective Doublings", value: formatNumber(Math.round(Math.log2(foldAmplification) * 100) / 100) }
      ]
    };
  }`,
  [
    "Q: What is a good PCR amplification efficiency?||A: An efficiency of 90-100% is considered good. Efficiency above 100% suggests primer dimers or non-specific amplification. Below 90% may indicate suboptimal primer design, inhibitors, or poor reaction conditions.",
    "Q: Why do most PCR protocols use 25-35 cycles?||A: Below 25 cycles there may not be enough product to detect. Above 35 cycles, reagents become depleted and non-specific products accumulate. The plateau phase typically begins around 30-35 cycles.",
    "Q: How is PCR efficiency determined experimentally?||A: PCR efficiency is determined by running a standard curve with serial dilutions of template. Plot Ct values against log template amount. Efficiency = (10^(-1/slope) - 1) x 100. A slope of -3.32 indicates 100% efficiency."
  ],
  `Final Copies = N0 x (1 + E)^n\nwhere N0 = initial copies, E = efficiency (decimal)\nn = number of cycles\nFold Amplification = (1 + E)^n`,
  ["dna-concentration-calculator", "pcr-primer-calculator", "serial-dilution-calculator"]
);

add(
  "qpcr-fold-change-calculator",
  "qPCR Fold Change Calculator (Delta-Delta Ct)",
  "Calculate relative gene expression fold change from qPCR data using the delta-delta Ct method comparing target and reference genes across treatment and control samples.",
  "Science",
  "science",
  "A",
  ["qpcr fold change", "delta delta ct", "gene expression", "relative quantification", "real-time pcr analysis"],
  [
    '{ name: "ctTarget", label: "Ct Target Gene (Treatment)", type: "number", min: 5, max: 45, defaultValue: 22 }',
    '{ name: "ctRef", label: "Ct Reference Gene (Treatment)", type: "number", min: 5, max: 45, defaultValue: 18 }',
    '{ name: "ctTargetCtrl", label: "Ct Target Gene (Control)", type: "number", min: 5, max: 45, defaultValue: 25 }',
    '{ name: "ctRefCtrl", label: "Ct Reference Gene (Control)", type: "number", min: 5, max: 45, defaultValue: 18 }'
  ],
  `(inputs) => {
    const ctTarget = inputs.ctTarget as number;
    const ctRef = inputs.ctRef as number;
    const ctTargetCtrl = inputs.ctTargetCtrl as number;
    const ctRefCtrl = inputs.ctRefCtrl as number;
    const deltaCt = ctTarget - ctRef;
    const deltaCtCtrl = ctTargetCtrl - ctRefCtrl;
    const deltaDeltaCt = deltaCt - deltaCtCtrl;
    const foldChange = Math.pow(2, -deltaDeltaCt);
    var regulation = "No change";
    if (foldChange > 1.5) { regulation = "Upregulated"; }
    if (foldChange < 0.67) { regulation = "Downregulated"; }
    return {
      primary: { label: "Fold Change", value: formatNumber(Math.round(foldChange * 1000) / 1000) + "x" },
      details: [
        { label: "Delta Ct (Treatment)", value: formatNumber(Math.round(deltaCt * 100) / 100) },
        { label: "Delta Ct (Control)", value: formatNumber(Math.round(deltaCtCtrl * 100) / 100) },
        { label: "Delta-Delta Ct", value: formatNumber(Math.round(deltaDeltaCt * 100) / 100) },
        { label: "Regulation Status", value: regulation }
      ]
    };
  }`,
  [
    "Q: What is the delta-delta Ct method?||A: The delta-delta Ct (2^-DDCt) method calculates relative gene expression by normalizing the target gene Ct to a reference gene (delta Ct), then comparing treatment to control (delta-delta Ct). The fold change is 2 raised to the negative delta-delta Ct.",
    "Q: What are good reference genes for qPCR?||A: Common reference genes include GAPDH, beta-actin, 18S rRNA, and HPRT1. The best reference gene should have stable expression across your experimental conditions. Use tools like geNorm or NormFinder to validate.",
    "Q: What fold change is considered significant?||A: A fold change of 2 or greater (or 0.5 or less) is commonly considered biologically meaningful, though statistical significance from biological replicates is more important than an arbitrary cutoff."
  ],
  `Delta Ct = Ct(target) - Ct(reference)\nDelta-Delta Ct = Delta Ct(treatment) - Delta Ct(control)\nFold Change = 2^(-Delta-Delta Ct)`,
  ["pcr-cycle-number-calculator", "dna-concentration-calculator", "pcr-primer-calculator"]
);

add(
  "od600-cell-density-calculator",
  "OD600 Cell Density Calculator",
  "Convert optical density at 600nm (OD600) readings to estimated cell density in CFU/mL or cells/mL for common bacterial and yeast cultures.",
  "Science",
  "science",
  "A",
  ["od600 calculator", "optical density cells", "bacterial cell density", "absorbance to cfu", "spectrophotometer cell count"],
  [
    '{ name: "od600", label: "OD600 Reading", type: "number", min: 0.01, max: 5, defaultValue: 0.6 }',
    '{ name: "organism", label: "Organism Type", type: "select", options: [{ value: "8", label: "E. coli (8e8 cells/mL/OD)" }, { value: "3", label: "S. cerevisiae (3e7 cells/mL/OD)" }, { value: "5", label: "Generic Bacteria (5e8 cells/mL/OD)" }], defaultValue: "8" }',
    '{ name: "dilutionFactor", label: "Dilution Factor", type: "number", min: 1, max: 10000, defaultValue: 1 }',
    '{ name: "targetOd", label: "Target OD600 for Subculture", type: "number", min: 0.01, max: 2, defaultValue: 0.05 }'
  ],
  `(inputs) => {
    const od600 = inputs.od600 as number;
    const organism = inputs.organism as number;
    const dilutionFactor = inputs.dilutionFactor as number;
    const targetOd = inputs.targetOd as number;
    var cellsPerOd = 8e8;
    if (organism === 3) { cellsPerOd = 3e7; }
    if (organism === 5) { cellsPerOd = 5e8; }
    const actualOd = od600 * dilutionFactor;
    const cellDensity = actualOd * cellsPerOd;
    const dilutionNeeded = actualOd / targetOd;
    const volumeToAdd = 1000 / dilutionNeeded;
    return {
      primary: { label: "Cell Density", value: formatNumber(Math.round(cellDensity)) + " cells/mL" },
      details: [
        { label: "Corrected OD600", value: formatNumber(Math.round(actualOd * 1000) / 1000) },
        { label: "Dilution for Target OD", value: "1:" + formatNumber(Math.round(dilutionNeeded * 10) / 10) },
        { label: "Culture Volume for 1 L", value: formatNumber(Math.round(volumeToAdd * 10) / 10) + " mL" },
        { label: "Conversion Factor", value: formatNumber(cellsPerOd) + " cells/mL/OD" }
      ]
    };
  }`,
  [
    "Q: Why is OD600 used to measure bacterial density?||A: OD600 (600 nm wavelength) is used because most bacteria scatter light at this wavelength without significant absorption. It provides a quick, non-destructive estimate of cell density without needing to plate and count colonies.",
    "Q: Is OD600 reliable above 0.4?||A: The linear relationship between OD600 and cell density holds best between OD 0.1-0.4 for most spectrophotometers. Above 0.4, dilutions should be performed before reading. Above 1.0, the reading is unreliable without dilution correction.",
    "Q: What OD600 corresponds to mid-log phase for E. coli?||A: Mid-log phase for E. coli is typically at OD600 of 0.4-0.6, corresponding to roughly 3-5 x 10^8 cells/mL. Stationary phase begins around OD600 of 1.0-2.0."
  ],
  `Cell Density = OD600 x Dilution Factor x Conversion Factor\nDilution for Target = Actual OD / Target OD\nE. coli: ~8 x 10^8 cells/mL per OD unit`,
  ["bacterial-growth-rate-calculator", "serial-dilution-calculator", "spectrophotometer-calculator"]
);

add(
  "cfu-colony-counting-calculator",
  "CFU Colony Counting Calculator",
  "Calculate colony forming units per milliliter (CFU/mL) from plate counts with dilution factors for accurate microbial enumeration in lab samples.",
  "Science",
  "science",
  "A",
  ["cfu calculator", "colony forming units", "plate count method", "microbial enumeration", "viable cell count"],
  [
    '{ name: "colonies", label: "Colonies Counted", type: "number", min: 1, max: 1000, defaultValue: 150 }',
    '{ name: "dilutionFactor", label: "Dilution Factor (e.g. 1e-6 enter 6)", type: "number", min: 0, max: 15, defaultValue: 6 }',
    '{ name: "volumePlated", label: "Volume Plated (mL)", type: "number", min: 0.01, max: 1, defaultValue: 0.1 }',
    '{ name: "numPlates", label: "Number of Replicate Plates", type: "number", min: 1, max: 10, defaultValue: 3 }'
  ],
  `(inputs) => {
    const colonies = inputs.colonies as number;
    const dilutionFactor = inputs.dilutionFactor as number;
    const volumePlated = inputs.volumePlated as number;
    const numPlates = inputs.numPlates as number;
    const avgColonies = colonies / numPlates;
    const dilution = Math.pow(10, -dilutionFactor);
    const cfuPerMl = avgColonies / (dilution * volumePlated);
    const logCfu = Math.log10(cfuPerMl);
    return {
      primary: { label: "CFU/mL", value: formatNumber(Math.round(cfuPerMl)) },
      details: [
        { label: "Average Colonies Per Plate", value: formatNumber(Math.round(avgColonies * 10) / 10) },
        { label: "Dilution Used", value: "10^-" + formatNumber(dilutionFactor) },
        { label: "Log10 CFU/mL", value: formatNumber(Math.round(logCfu * 100) / 100) },
        { label: "Total Colonies Counted", value: formatNumber(colonies) }
      ]
    };
  }`,
  [
    "Q: What colony count range is statistically valid?||A: Plates with 30-300 colonies are considered statistically reliable for standard pour plates. Fewer than 30 colonies has high sampling error. More than 300 makes accurate counting difficult and colonies may compete for nutrients.",
    "Q: What is the difference between CFU and total cell count?||A: CFU counts only viable cells capable of forming colonies. Dead cells and viable-but-non-culturable cells are not counted. Total cell counts from microscopy or flow cytometry include all cells regardless of viability.",
    "Q: How do I choose the right dilution to plate?||A: Plate multiple dilutions (e.g., 10^-4, 10^-5, 10^-6) to ensure at least one plate falls in the countable 30-300 colony range. For unknown samples, use a wider range of dilutions."
  ],
  `CFU/mL = (Average Colonies) / (Dilution Factor x Volume Plated)\nDilution Factor = 10^(-n)\nwhere n = number of serial dilution steps`,
  ["bacterial-growth-rate-calculator", "od600-cell-density-calculator", "serial-dilution-calculator"]
);

add(
  "bradford-assay-protein-calculator",
  "Bradford Assay Protein Concentration Calculator",
  "Calculate protein concentration from Bradford assay absorbance readings using a standard curve with BSA standards and Beer-Lambert law.",
  "Science",
  "science",
  "A",
  ["bradford assay", "protein concentration", "bsa standard curve", "coomassie assay", "protein quantification"],
  [
    '{ name: "absorbance", label: "Sample Absorbance (595 nm)", type: "number", min: 0.01, max: 2, defaultValue: 0.45 }',
    '{ name: "slope", label: "Standard Curve Slope (Abs/ug/mL)", type: "number", min: 0.0001, max: 0.1, defaultValue: 0.0012 }',
    '{ name: "intercept", label: "Standard Curve Y-Intercept", type: "number", min: -0.5, max: 0.5, defaultValue: 0.05 }',
    '{ name: "dilutionFactor", label: "Sample Dilution Factor", type: "number", min: 1, max: 1000, defaultValue: 10 }',
    '{ name: "sampleVolume", label: "Total Sample Volume (mL)", type: "number", min: 0.01, max: 100, defaultValue: 1 }'
  ],
  `(inputs) => {
    const absorbance = inputs.absorbance as number;
    const slope = inputs.slope as number;
    const intercept = inputs.intercept as number;
    const dilutionFactor = inputs.dilutionFactor as number;
    const sampleVolume = inputs.sampleVolume as number;
    const concDiluted = (absorbance - intercept) / slope;
    const concOriginal = concDiluted * dilutionFactor;
    const totalProtein = concOriginal * sampleVolume / 1000;
    const concMgMl = concOriginal / 1000;
    return {
      primary: { label: "Protein Concentration", value: formatNumber(Math.round(concOriginal * 10) / 10) + " ug/mL" },
      details: [
        { label: "Concentration (mg/mL)", value: formatNumber(Math.round(concMgMl * 1000) / 1000) },
        { label: "Diluted Sample Conc.", value: formatNumber(Math.round(concDiluted * 10) / 10) + " ug/mL" },
        { label: "Total Protein", value: formatNumber(Math.round(totalProtein * 1000) / 1000) + " mg" },
        { label: "Dilution Correction", value: formatNumber(dilutionFactor) + "x" }
      ]
    };
  }`,
  [
    "Q: What is the linear range of the Bradford assay?||A: The standard Bradford assay is linear from approximately 100-1500 ug/mL of BSA. The micro-Bradford assay extends the lower range to 1-25 ug/mL. Always ensure your samples fall within the standard curve range.",
    "Q: Why is BSA used as the protein standard?||A: Bovine serum albumin (BSA) is inexpensive, highly purified, stable, and well-characterized. However, the Bradford assay responds differently to different proteins, so BSA-equivalent concentrations are reported.",
    "Q: What can interfere with Bradford assay results?||A: Detergents (SDS, Triton X-100), strong bases, and high concentrations of reducing agents can interfere. Diluting samples or using compatible protein assays like BCA may be necessary."
  ],
  `Concentration (diluted) = (Absorbance - Intercept) / Slope\nOriginal Concentration = Diluted Conc. x Dilution Factor\nTotal Protein = Concentration x Volume`,
  ["spectrophotometer-calculator", "serial-dilution-calculator", "solution-preparation-calculator"]
);

add(
  "cell-viability-calculator",
  "Cell Viability Calculator",
  "Calculate cell viability percentage and viable cell concentration from trypan blue exclusion assay hemocytometer counts in cell culture experiments.",
  "Science",
  "science",
  "A",
  ["cell viability", "trypan blue exclusion", "hemocytometer count", "live dead cell ratio", "cell culture viability"],
  [
    '{ name: "liveCells", label: "Live Cells Counted", type: "number", min: 0, max: 500, defaultValue: 85 }',
    '{ name: "deadCells", label: "Dead Cells Counted (Stained)", type: "number", min: 0, max: 500, defaultValue: 15 }',
    '{ name: "squaresCounted", label: "Large Squares Counted", type: "number", min: 1, max: 25, defaultValue: 4 }',
    '{ name: "dilutionFactor", label: "Dilution Factor", type: "number", min: 1, max: 100, defaultValue: 2 }'
  ],
  `(inputs) => {
    const liveCells = inputs.liveCells as number;
    const deadCells = inputs.deadCells as number;
    const squaresCounted = inputs.squaresCounted as number;
    const dilutionFactor = inputs.dilutionFactor as number;
    const totalCells = liveCells + deadCells;
    const viability = totalCells > 0 ? (liveCells / totalCells) * 100 : 0;
    const avgPerSquare = totalCells / squaresCounted;
    const cellsPerMl = avgPerSquare * 10000 * dilutionFactor;
    const viableCellsPerMl = cellsPerMl * (viability / 100);
    return {
      primary: { label: "Cell Viability", value: formatNumber(Math.round(viability * 10) / 10) + "%" },
      details: [
        { label: "Viable Cells/mL", value: formatNumber(Math.round(viableCellsPerMl)) },
        { label: "Total Cells/mL", value: formatNumber(Math.round(cellsPerMl)) },
        { label: "Total Cells Counted", value: formatNumber(totalCells) },
        { label: "Average Per Square", value: formatNumber(Math.round(avgPerSquare * 10) / 10) }
      ]
    };
  }`,
  [
    "Q: What cell viability is acceptable for experiments?||A: Cell viability above 90% is generally required for most experiments. Below 80% viability, results may be unreliable due to dead cell debris affecting the culture. Transfection and other procedures may require above 95% viability.",
    "Q: How does trypan blue exclusion work?||A: Trypan blue is a dye that cannot penetrate intact cell membranes. Live cells exclude the dye and appear clear/bright. Dead cells with compromised membranes take up the dye and appear blue. Counting is done within 3-5 minutes of staining.",
    "Q: Why multiply by 10,000 in hemocytometer calculations?||A: Each large square of a hemocytometer has a volume of 0.1 microliters (1mm x 1mm x 0.1mm). To convert to cells per milliliter, multiply by 10,000 (the inverse of 0.0001 mL)."
  ],
  `Viability (%) = (Live Cells / Total Cells) x 100\nCells/mL = (Avg Cells/Square) x 10,000 x Dilution Factor\nViable Cells/mL = Cells/mL x (Viability/100)`,
  ["hemocytometer-calculator", "od600-cell-density-calculator", "bacterial-growth-rate-calculator"]
);

add(
  "cell-culture-media-prep-calculator",
  "Cell Culture Media Preparation Calculator",
  "Calculate volumes of base media, serum, and supplements needed to prepare cell culture media for a given total volume with correct percentages.",
  "Science",
  "science",
  "A",
  ["cell culture media", "media preparation", "fbs volume", "culture medium recipe", "cell culture supplements"],
  [
    '{ name: "totalVolume", label: "Total Volume to Prepare (mL)", type: "number", min: 10, max: 10000, defaultValue: 500 }',
    '{ name: "serumPercent", label: "Serum Percentage (%)", type: "number", min: 0, max: 30, defaultValue: 10 }',
    '{ name: "antibioticPercent", label: "Antibiotic Percentage (%)", type: "number", min: 0, max: 5, defaultValue: 1 }',
    '{ name: "glutaminePercent", label: "L-Glutamine Percentage (%)", type: "number", min: 0, max: 5, defaultValue: 1 }',
    '{ name: "otherPercent", label: "Other Supplements (%)", type: "number", min: 0, max: 10, defaultValue: 0 }'
  ],
  `(inputs) => {
    const totalVolume = inputs.totalVolume as number;
    const serumPercent = inputs.serumPercent as number;
    const antibioticPercent = inputs.antibioticPercent as number;
    const glutaminePercent = inputs.glutaminePercent as number;
    const otherPercent = inputs.otherPercent as number;
    const totalSupplementPercent = serumPercent + antibioticPercent + glutaminePercent + otherPercent;
    const baseMediaPercent = 100 - totalSupplementPercent;
    const baseMediaVol = totalVolume * baseMediaPercent / 100;
    const serumVol = totalVolume * serumPercent / 100;
    const antibioticVol = totalVolume * antibioticPercent / 100;
    const glutamineVol = totalVolume * glutaminePercent / 100;
    const otherVol = totalVolume * otherPercent / 100;
    return {
      primary: { label: "Base Media Volume", value: formatNumber(Math.round(baseMediaVol * 10) / 10) + " mL" },
      details: [
        { label: "Serum Volume", value: formatNumber(Math.round(serumVol * 10) / 10) + " mL" },
        { label: "Antibiotic Volume", value: formatNumber(Math.round(antibioticVol * 10) / 10) + " mL" },
        { label: "L-Glutamine Volume", value: formatNumber(Math.round(glutamineVol * 10) / 10) + " mL" },
        { label: "Other Supplements", value: formatNumber(Math.round(otherVol * 10) / 10) + " mL" }
      ]
    };
  }`,
  [
    "Q: Why is FBS added at 10% for most cell lines?||A: Fetal bovine serum (FBS) at 10% provides growth factors, hormones, and attachment factors needed by most mammalian cell lines. Some specialized cells require higher or lower concentrations, and serum-free formulations exist for specific applications.",
    "Q: Should I add antibiotics to cell culture media?||A: Antibiotics like penicillin-streptomycin (1%) are commonly added to prevent bacterial contamination. However, routine use can mask poor aseptic technique and may affect cell behavior. Many labs use antibiotic-free media for experiments.",
    "Q: How long can supplemented media be stored?||A: Complete media with serum and supplements should be stored at 4C and used within 2-4 weeks. L-glutamine degrades over time, so some labs add it fresh. Aliquoting into smaller volumes minimizes contamination risk."
  ],
  `Base Media = Total Volume x (100 - Sum of Supplement %) / 100\nSupplement Volume = Total Volume x Supplement % / 100`,
  ["solution-preparation-calculator", "dilution-calculator", "molarity-calculator"]
);

add(
  "ligation-ratio-calculator",
  "DNA Ligation Ratio Calculator",
  "Calculate the optimal insert-to-vector molar ratio and DNA masses for molecular cloning ligation reactions based on fragment sizes.",
  "Science",
  "science",
  "A",
  ["ligation ratio", "insert vector ratio", "molecular cloning", "dna ligation", "cloning calculator"],
  [
    '{ name: "vectorSize", label: "Vector Size (bp)", type: "number", min: 500, max: 50000, defaultValue: 5000 }',
    '{ name: "insertSize", label: "Insert Size (bp)", type: "number", min: 50, max: 50000, defaultValue: 1000 }',
    '{ name: "vectorMass", label: "Vector Mass (ng)", type: "number", min: 1, max: 1000, defaultValue: 50 }',
    '{ name: "molarRatio", label: "Insert:Vector Molar Ratio", type: "select", options: [{ value: "1", label: "1:1" }, { value: "3", label: "3:1" }, { value: "5", label: "5:1" }, { value: "10", label: "10:1" }], defaultValue: "3" }'
  ],
  `(inputs) => {
    const vectorSize = inputs.vectorSize as number;
    const insertSize = inputs.insertSize as number;
    const vectorMass = inputs.vectorMass as number;
    const molarRatio = inputs.molarRatio as number;
    const insertMass = (molarRatio * vectorMass * insertSize) / vectorSize;
    const vectorPmol = (vectorMass * 1000) / (vectorSize * 660);
    const insertPmol = vectorPmol * molarRatio;
    const totalDna = vectorMass + insertMass;
    return {
      primary: { label: "Insert Mass Needed", value: formatNumber(Math.round(insertMass * 100) / 100) + " ng" },
      details: [
        { label: "Vector (pmol)", value: formatNumber(Math.round(vectorPmol * 1000) / 1000) },
        { label: "Insert (pmol)", value: formatNumber(Math.round(insertPmol * 1000) / 1000) },
        { label: "Total DNA in Reaction", value: formatNumber(Math.round(totalDna * 100) / 100) + " ng" },
        { label: "Insert:Vector Ratio", value: formatNumber(molarRatio) + ":1" }
      ]
    };
  }`,
  [
    "Q: What insert-to-vector molar ratio should I use?||A: A 3:1 insert-to-vector molar ratio is most commonly recommended. For difficult ligations, try 5:1 or 10:1. For blunt-end ligations, higher ratios (5:1 to 10:1) are often necessary due to lower efficiency.",
    "Q: How much vector DNA should I use per ligation?||A: Use 25-100 ng of vector DNA per 10-20 uL ligation reaction. Too much DNA can inhibit transformation. Too little may not produce enough colonies.",
    "Q: What is the formula for calculating insert mass?||A: Insert mass (ng) = Molar Ratio x Vector mass (ng) x Insert size (bp) / Vector size (bp). This ensures the correct molar ratio regardless of fragment sizes."
  ],
  `Insert mass (ng) = Ratio x Vector mass (ng) x Insert size (bp) / Vector size (bp)\npmol = mass (ng) x 1000 / (size (bp) x 660)`,
  ["dna-concentration-calculator", "pcr-cycle-number-calculator", "serial-dilution-calculator"]
);

add(
  "transformation-efficiency-calculator",
  "Transformation Efficiency Calculator",
  "Calculate bacterial transformation efficiency as colony forming units per microgram of plasmid DNA from transformation experiment plate counts.",
  "Science",
  "science",
  "A",
  ["transformation efficiency", "bacterial transformation", "cfu per microgram", "competent cell efficiency", "plasmid transformation"],
  [
    '{ name: "colonies", label: "Colonies on Plate", type: "number", min: 1, max: 10000, defaultValue: 150 }',
    '{ name: "dnaAmount", label: "DNA Used (ng)", type: "number", min: 0.01, max: 1000, defaultValue: 10 }',
    '{ name: "totalVolume", label: "Total Recovery Volume (uL)", type: "number", min: 100, max: 5000, defaultValue: 1000 }',
    '{ name: "volumePlated", label: "Volume Plated (uL)", type: "number", min: 10, max: 1000, defaultValue: 100 }'
  ],
  `(inputs) => {
    const colonies = inputs.colonies as number;
    const dnaAmount = inputs.dnaAmount as number;
    const totalVolume = inputs.totalVolume as number;
    const volumePlated = inputs.volumePlated as number;
    const totalColonies = colonies * (totalVolume / volumePlated);
    const dnaUg = dnaAmount / 1000;
    const efficiency = totalColonies / dnaUg;
    var rating = "Low (chemical competent)";
    if (efficiency >= 1e6) { rating = "Good (chemical competent)"; }
    if (efficiency >= 1e8) { rating = "High (electrocompetent)"; }
    if (efficiency >= 1e9) { rating = "Excellent (ultra-competent)"; }
    return {
      primary: { label: "Transformation Efficiency", value: formatNumber(Math.round(efficiency)) + " CFU/ug" },
      details: [
        { label: "Total Colonies (adjusted)", value: formatNumber(Math.round(totalColonies)) },
        { label: "DNA Amount", value: formatNumber(dnaUg * 1000) + " ng (" + formatNumber(dnaUg) + " ug)" },
        { label: "Competency Rating", value: rating },
        { label: "Plating Fraction", value: formatNumber(Math.round(volumePlated / totalVolume * 100)) + "%" }
      ]
    };
  }`,
  [
    "Q: What is a good transformation efficiency?||A: For routine cloning, 10^6 CFU/ug is adequate. High-efficiency chemical competent cells reach 10^8-10^9 CFU/ug. Electrocompetent cells can achieve 10^9-10^10 CFU/ug, ideal for library construction.",
    "Q: How can I improve transformation efficiency?||A: Use freshly prepared competent cells, minimize DNA volume (less than 5% of cell volume), maintain cells on ice, use optimal heat shock timing (42C for exactly 45 seconds for most protocols), and allow full recovery in SOC medium.",
    "Q: Why is the control plate important in transformation?||A: A vector-only control (no insert) shows the background of uncut or recircularized vector. A no-DNA control confirms antibiotic selection is working. These controls help distinguish true transformants from false positives."
  ],
  `Total Colonies = Counted Colonies x (Total Volume / Volume Plated)\nEfficiency (CFU/ug) = Total Colonies / DNA (ug)`,
  ["ligation-ratio-calculator", "cfu-colony-counting-calculator", "dna-concentration-calculator"]
);

add(
  "transfection-efficiency-calculator",
  "Transfection Efficiency Calculator",
  "Calculate mammalian cell transfection efficiency and optimize DNA-to-reagent ratios for lipofection, electroporation, or calcium phosphate transfection methods.",
  "Science",
  "science",
  "A",
  ["transfection efficiency", "lipofection calculator", "dna transfection", "cell transfection", "gene delivery efficiency"],
  [
    '{ name: "totalCells", label: "Total Cells Counted", type: "number", min: 10, max: 10000, defaultValue: 500 }',
    '{ name: "positiveCells", label: "Positive (Transfected) Cells", type: "number", min: 0, max: 10000, defaultValue: 175 }',
    '{ name: "dnaAmount", label: "DNA Amount (ug)", type: "number", min: 0.1, max: 100, defaultValue: 2 }',
    '{ name: "reagentVolume", label: "Transfection Reagent (uL)", type: "number", min: 0.1, max: 200, defaultValue: 6 }',
    '{ name: "wellArea", label: "Well Area (cm2)", type: "select", options: [{ value: "0.32", label: "96-well (0.32 cm2)" }, { value: "1.9", label: "24-well (1.9 cm2)" }, { value: "9.6", label: "6-well (9.6 cm2)" }, { value: "21", label: "35mm dish (21 cm2)" }, { value: "78.5", label: "100mm dish (78.5 cm2)" }], defaultValue: "9.6" }'
  ],
  `(inputs) => {
    const totalCells = inputs.totalCells as number;
    const positiveCells = inputs.positiveCells as number;
    const dnaAmount = inputs.dnaAmount as number;
    const reagentVolume = inputs.reagentVolume as number;
    const wellArea = inputs.wellArea as number;
    const efficiency = totalCells > 0 ? (positiveCells / totalCells) * 100 : 0;
    const ratio = reagentVolume / dnaAmount;
    const dnaPerCm2 = dnaAmount / wellArea;
    var rating = "Poor - optimize conditions";
    if (efficiency >= 20) { rating = "Fair"; }
    if (efficiency >= 50) { rating = "Good"; }
    if (efficiency >= 70) { rating = "Excellent"; }
    return {
      primary: { label: "Transfection Efficiency", value: formatNumber(Math.round(efficiency * 10) / 10) + "%" },
      details: [
        { label: "Reagent:DNA Ratio", value: formatNumber(Math.round(ratio * 10) / 10) + ":1 (uL:ug)" },
        { label: "DNA Per cm2", value: formatNumber(Math.round(dnaPerCm2 * 1000) / 1000) + " ug/cm2" },
        { label: "Performance Rating", value: rating },
        { label: "Positive / Total Cells", value: formatNumber(positiveCells) + " / " + formatNumber(totalCells) }
      ]
    };
  }`,
  [
    "Q: What is a good transfection efficiency?||A: It depends on the cell line and method. HEK293 cells routinely achieve 70-90% efficiency with lipofection. Primary cells may only reach 10-30%. For stable transfection, even 1-5% can be sufficient with selection.",
    "Q: What is the optimal DNA-to-reagent ratio?||A: Most lipofection reagents work best at a 2:1 to 4:1 reagent-to-DNA ratio (uL:ug). However, this varies by reagent brand and cell type. Optimization with a ratio matrix is recommended.",
    "Q: How do I scale transfection between different plate sizes?||A: Scale DNA and reagent amounts proportionally to the growth area. For example, if a 6-well (9.6 cm2) uses 2 ug DNA, a 100mm dish (78.5 cm2) would need approximately 16.4 ug."
  ],
  `Transfection Efficiency (%) = (Positive Cells / Total Cells) x 100\nReagent:DNA Ratio = Reagent Volume (uL) / DNA Amount (ug)\nDNA/cm2 = DNA Amount / Well Area`,
  ["cell-viability-calculator", "ligation-ratio-calculator", "dna-concentration-calculator"]
);

add(
  "enzyme-unit-conversion-calculator",
  "Enzyme Unit Conversion Calculator",
  "Convert between enzyme activity units including International Units (IU), katal, specific activity, and volumetric activity for biochemistry experiments.",
  "Science",
  "science",
  "A",
  ["enzyme unit conversion", "international unit katal", "specific activity enzyme", "enzyme activity calculator", "iu to katal"],
  [
    '{ name: "activityValue", label: "Enzyme Activity Value", type: "number", min: 0.0001, max: 1e10, defaultValue: 500 }',
    '{ name: "unitFrom", label: "Input Unit", type: "select", options: [{ value: "1", label: "IU (umol/min)" }, { value: "2", label: "nkat (nmol/s)" }, { value: "3", label: "ukat (umol/s)" }], defaultValue: "1" }',
    '{ name: "proteinMass", label: "Total Protein (mg)", type: "number", min: 0.001, max: 100000, defaultValue: 10 }',
    '{ name: "volume", label: "Solution Volume (mL)", type: "number", min: 0.01, max: 10000, defaultValue: 1 }'
  ],
  `(inputs) => {
    const activityValue = inputs.activityValue as number;
    const unitFrom = inputs.unitFrom as number;
    const proteinMass = inputs.proteinMass as number;
    const volume = inputs.volume as number;
    var iu = activityValue;
    if (unitFrom === 2) { iu = activityValue * 0.06; }
    if (unitFrom === 3) { iu = activityValue * 60; }
    const nkat = iu / 0.06;
    const ukat = iu / 60;
    const specificActivity = iu / proteinMass;
    const volumetricActivity = iu / volume;
    return {
      primary: { label: "Activity (IU)", value: formatNumber(Math.round(iu * 1000) / 1000) + " IU" },
      details: [
        { label: "Activity (nkat)", value: formatNumber(Math.round(nkat * 1000) / 1000) },
        { label: "Activity (ukat)", value: formatNumber(Math.round(ukat * 10000) / 10000) },
        { label: "Specific Activity", value: formatNumber(Math.round(specificActivity * 100) / 100) + " IU/mg" },
        { label: "Volumetric Activity", value: formatNumber(Math.round(volumetricActivity * 100) / 100) + " IU/mL" }
      ]
    };
  }`,
  [
    "Q: What is an International Unit (IU) of enzyme activity?||A: One IU is defined as the amount of enzyme that catalyzes the conversion of 1 micromole of substrate per minute under specified conditions of temperature, pH, and substrate concentration.",
    "Q: What is a katal?||A: The katal (kat) is the SI unit of enzyme activity. One katal equals the amount of enzyme converting 1 mole of substrate per second. 1 IU = 16.67 nanokatal. The katal is rarely used in practice; IU remains the standard.",
    "Q: What does specific activity tell you about enzyme purity?||A: Specific activity (IU/mg protein) increases as the enzyme is purified, since contaminating proteins are removed. A higher specific activity indicates greater purity. It is the primary metric for tracking purification progress."
  ],
  `1 IU = 1 umol/min = 16.67 nkat\n1 ukat = 1 umol/s = 60 IU\nSpecific Activity = Total Activity / Total Protein\nVolumetric Activity = Total Activity / Volume`,
  ["bradford-assay-protein-calculator", "molarity-calculator", "spectrophotometer-calculator"]
);

add(
  "melting-temperature-primer-calculator",
  "Primer Melting Temperature (Tm) Calculator",
  "Calculate DNA primer melting temperature using basic, salt-adjusted, and nearest-neighbor methods for PCR primer design and optimization.",
  "Science",
  "science",
  "A",
  ["primer tm calculator", "melting temperature dna", "pcr primer tm", "oligonucleotide tm", "primer design temperature"],
  [
    '{ name: "lengthBp", label: "Primer Length (bp)", type: "number", min: 10, max: 60, defaultValue: 20 }',
    '{ name: "gcCount", label: "Number of G+C Bases", type: "number", min: 0, max: 60, defaultValue: 10 }',
    '{ name: "naConc", label: "Na+ Concentration (mM)", type: "number", min: 10, max: 1000, defaultValue: 50 }',
    '{ name: "primerConc", label: "Primer Concentration (nM)", type: "number", min: 50, max: 5000, defaultValue: 250 }'
  ],
  `(inputs) => {
    const lengthBp = inputs.lengthBp as number;
    const gcCount = inputs.gcCount as number;
    const naConc = inputs.naConc as number;
    const primerConc = inputs.primerConc as number;
    const atCount = lengthBp - gcCount;
    const gcPercent = (gcCount / lengthBp) * 100;
    const basicTm = (atCount * 2) + (gcCount * 4);
    const saltTm = 100.5 + (41 * gcCount / lengthBp) - (820 / lengthBp) + 16.6 * Math.log10(naConc / 1000);
    var suggestedAnnealing = saltTm - 5;
    return {
      primary: { label: "Basic Tm", value: formatNumber(Math.round(basicTm * 10) / 10) + " C" },
      details: [
        { label: "Salt-Adjusted Tm", value: formatNumber(Math.round(saltTm * 10) / 10) + " C" },
        { label: "GC Content", value: formatNumber(Math.round(gcPercent * 10) / 10) + "%" },
        { label: "Suggested Annealing Temp", value: formatNumber(Math.round(suggestedAnnealing * 10) / 10) + " C" },
        { label: "A+T / G+C Bases", value: formatNumber(atCount) + " / " + formatNumber(gcCount) }
      ]
    };
  }`,
  [
    "Q: Which Tm method should I use?||A: The basic formula (2AT + 4GC) is a quick estimate for primers under 20 bp. Salt-adjusted formulas account for ionic conditions. Nearest-neighbor methods are most accurate for primers of any length. Use salt-adjusted as a practical balance.",
    "Q: What is the ideal Tm range for PCR primers?||A: Primers should have a Tm between 55-65C for standard PCR. Paired primers should have Tm values within 2-3C of each other. Higher Tm primers (65-72C) are used for GC-rich templates or specialized protocols.",
    "Q: How does salt concentration affect Tm?||A: Higher salt (Na+, K+, Mg2+) stabilizes DNA duplexes and increases Tm. Standard PCR buffers contain 50 mM KCl and 1.5 mM MgCl2. Adjusting salt in the formula gives more accurate Tm predictions for your specific buffer."
  ],
  `Basic Tm = 2(A+T) + 4(G+C)\nSalt-Adjusted Tm = 100.5 + 41(GC/N) - 820/N + 16.6 x log10([Na+])\nAnnealing Temp ~ Tm - 5 C`,
  ["pcr-cycle-number-calculator", "pcr-primer-calculator", "dna-concentration-calculator"]
);

add(
  "gel-band-size-estimator",
  "Gel Electrophoresis Band Size Estimator",
  "Estimate DNA or protein band molecular weight from gel electrophoresis migration distance using a standard curve from known molecular weight markers.",
  "Science",
  "science",
  "A",
  ["gel electrophoresis", "band size estimation", "dna gel calculator", "molecular weight marker", "gel migration distance"],
  [
    '{ name: "marker1Size", label: "Marker Band 1 Size (bp or kDa)", type: "number", min: 1, max: 100000, defaultValue: 1000 }',
    '{ name: "marker1Dist", label: "Marker 1 Migration (mm)", type: "number", min: 1, max: 200, defaultValue: 30 }',
    '{ name: "marker2Size", label: "Marker Band 2 Size (bp or kDa)", type: "number", min: 1, max: 100000, defaultValue: 5000 }',
    '{ name: "marker2Dist", label: "Marker 2 Migration (mm)", type: "number", min: 1, max: 200, defaultValue: 10 }',
    '{ name: "sampleDist", label: "Sample Band Migration (mm)", type: "number", min: 1, max: 200, defaultValue: 20 }'
  ],
  `(inputs) => {
    const marker1Size = inputs.marker1Size as number;
    const marker1Dist = inputs.marker1Dist as number;
    const marker2Size = inputs.marker2Size as number;
    const marker2Dist = inputs.marker2Dist as number;
    const sampleDist = inputs.sampleDist as number;
    const logSize1 = Math.log10(marker1Size);
    const logSize2 = Math.log10(marker2Size);
    const slope = (logSize2 - logSize1) / (marker2Dist - marker1Dist);
    const intercept = logSize1 - slope * marker1Dist;
    const logSampleSize = slope * sampleDist + intercept;
    const sampleSize = Math.pow(10, logSampleSize);
    const rSquared = 1;
    return {
      primary: { label: "Estimated Size", value: formatNumber(Math.round(sampleSize)) },
      details: [
        { label: "Log10(Size)", value: formatNumber(Math.round(logSampleSize * 1000) / 1000) },
        { label: "Slope (log/mm)", value: formatNumber(Math.round(slope * 10000) / 10000) },
        { label: "Y-Intercept", value: formatNumber(Math.round(intercept * 1000) / 1000) },
        { label: "Calibration Points", value: "2 markers" }
      ]
    };
  }`,
  [
    "Q: Why is the log of molecular weight linear with migration distance?||A: In agarose or polyacrylamide gels, DNA and SDS-denatured proteins migrate through pores at rates inversely proportional to the log of their size. This creates a linear relationship between log(MW) and distance, enabling size estimation from a standard curve.",
    "Q: How many marker bands should I use for accurate estimation?||A: At minimum, use two markers that bracket your sample band. For greater accuracy, use 3-5 markers spanning the relevant size range and fit a linear regression to the log(size) vs. distance data.",
    "Q: What affects band migration in gel electrophoresis?||A: Gel concentration (higher % = better small fragment resolution), voltage, buffer composition, temperature, and DNA conformation (supercoiled vs. linear vs. nicked circular) all affect migration distance."
  ],
  `log10(Size) = Slope x Distance + Intercept\nSlope = (log(Size2) - log(Size1)) / (Dist2 - Dist1)\nEstimated Size = 10^(log10(Size))`,
  ["dna-concentration-calculator", "pcr-cycle-number-calculator", "ligation-ratio-calculator"]
);

add(
  "elisa-standard-curve-calculator",
  "ELISA Standard Curve Calculator",
  "Calculate analyte concentration from ELISA optical density readings using a linear standard curve with known concentration standards.",
  "Science",
  "science",
  "A",
  ["elisa calculator", "elisa standard curve", "elisa concentration", "immunoassay analysis", "od to concentration"],
  [
    '{ name: "sampleOd", label: "Sample OD Reading", type: "number", min: 0.01, max: 4, defaultValue: 0.85 }',
    '{ name: "slope", label: "Standard Curve Slope", type: "number", min: 0.0001, max: 10, defaultValue: 0.005 }',
    '{ name: "intercept", label: "Y-Intercept", type: "number", min: -1, max: 1, defaultValue: 0.05 }',
    '{ name: "dilutionFactor", label: "Sample Dilution Factor", type: "number", min: 1, max: 10000, defaultValue: 100 }',
    '{ name: "unit", label: "Concentration Unit", type: "select", options: [{ value: "1", label: "pg/mL" }, { value: "2", label: "ng/mL" }, { value: "3", label: "ug/mL" }], defaultValue: "1" }'
  ],
  `(inputs) => {
    const sampleOd = inputs.sampleOd as number;
    const slope = inputs.slope as number;
    const intercept = inputs.intercept as number;
    const dilutionFactor = inputs.dilutionFactor as number;
    const unit = inputs.unit as number;
    var unitLabel = "pg/mL";
    if (unit === 2) { unitLabel = "ng/mL"; }
    if (unit === 3) { unitLabel = "ug/mL"; }
    const concDiluted = (sampleOd - intercept) / slope;
    const concOriginal = concDiluted * dilutionFactor;
    const correctedOd = sampleOd - intercept;
    return {
      primary: { label: "Analyte Concentration", value: formatNumber(Math.round(concOriginal * 100) / 100) + " " + unitLabel },
      details: [
        { label: "Diluted Sample Conc.", value: formatNumber(Math.round(concDiluted * 100) / 100) + " " + unitLabel },
        { label: "Corrected OD", value: formatNumber(Math.round(correctedOd * 1000) / 1000) },
        { label: "Dilution Factor", value: formatNumber(dilutionFactor) + "x" },
        { label: "Blank-Subtracted OD", value: formatNumber(Math.round(sampleOd * 1000) / 1000) }
      ]
    };
  }`,
  [
    "Q: What R-squared value is acceptable for an ELISA standard curve?||A: An R-squared of 0.99 or higher is ideal for a linear standard curve. Values between 0.98 and 0.99 are acceptable. Below 0.98, consider repeating the assay or using a 4-parameter logistic curve fit instead of linear regression.",
    "Q: How do I choose the right sample dilution?||A: Run a pilot experiment with multiple dilutions to find one that gives OD values within the linear range of the standard curve. Most ELISA kits specify recommended dilution ranges for different sample types (serum, plasma, cell supernatant).",
    "Q: When should I use a 4-parameter logistic curve instead of linear?||A: Use 4-PL fitting when the standard curve spans a wide concentration range or shows a sigmoidal shape. Linear regression works for the middle portion of the curve where the relationship between OD and concentration is truly linear."
  ],
  `Concentration (diluted) = (Sample OD - Intercept) / Slope\nOriginal Concentration = Diluted Conc. x Dilution Factor`,
  ["bradford-assay-protein-calculator", "spectrophotometer-calculator", "serial-dilution-calculator"]
);

add(
  "western-blot-dilution-calculator",
  "Western Blot Antibody Dilution Calculator",
  "Calculate antibody dilution volumes for western blot experiments based on stock concentration, desired working dilution, and total volume of blocking solution.",
  "Science",
  "science",
  "A",
  ["western blot dilution", "antibody dilution", "primary antibody volume", "immunoblot dilution", "wb antibody prep"],
  [
    '{ name: "desiredDilution", label: "Desired Dilution (e.g. 1000 for 1:1000)", type: "number", min: 10, max: 100000, defaultValue: 1000 }',
    '{ name: "totalVolume", label: "Total Solution Volume (mL)", type: "number", min: 1, max: 100, defaultValue: 10 }',
    '{ name: "stockConc", label: "Stock Antibody Conc. (mg/mL)", type: "number", min: 0.01, max: 20, defaultValue: 1 }',
    '{ name: "numStrips", label: "Number of Membrane Strips", type: "number", min: 1, max: 20, defaultValue: 1 }'
  ],
  `(inputs) => {
    const desiredDilution = inputs.desiredDilution as number;
    const totalVolume = inputs.totalVolume as number;
    const stockConc = inputs.stockConc as number;
    const numStrips = inputs.numStrips as number;
    const totalVolumeNeeded = totalVolume * numStrips;
    const antibodyVolume = totalVolumeNeeded / desiredDilution;
    const antibodyVolUl = antibodyVolume * 1000;
    const workingConc = stockConc / desiredDilution * 1000;
    const blockingVol = totalVolumeNeeded - antibodyVolume;
    return {
      primary: { label: "Antibody Volume Needed", value: formatNumber(Math.round(antibodyVolUl * 100) / 100) + " uL" },
      details: [
        { label: "Working Concentration", value: formatNumber(Math.round(workingConc * 100) / 100) + " ug/mL" },
        { label: "Blocking Solution Volume", value: formatNumber(Math.round(blockingVol * 100) / 100) + " mL" },
        { label: "Total Solution Volume", value: formatNumber(totalVolumeNeeded) + " mL" },
        { label: "Dilution Ratio", value: "1:" + formatNumber(desiredDilution) }
      ]
    };
  }`,
  [
    "Q: What dilution should I use for primary antibodies?||A: Most primary antibodies are used at 1:500 to 1:5000 dilution. Check the manufacturer datasheet for recommended western blot dilutions. Start with the suggested dilution and optimize by testing a range.",
    "Q: How long should I incubate the primary antibody?||A: Overnight incubation at 4C with gentle rocking is standard for primary antibodies. For strong signals, 1-2 hours at room temperature may suffice. Secondary antibodies typically need only 1 hour at room temperature.",
    "Q: Can I reuse antibody solutions?||A: Primary antibody solutions can often be reused 2-5 times if stored at 4C with 0.02% sodium azide added as a preservative. Signal intensity may decrease with each reuse. Secondary antibodies should be prepared fresh each time."
  ],
  `Antibody Volume (mL) = Total Volume / Dilution Factor\nWorking Conc. (ug/mL) = Stock Conc. (mg/mL) x 1000 / Dilution\nBlocking Solution = Total Volume - Antibody Volume`,
  ["dilution-calculator", "bradford-assay-protein-calculator", "solution-preparation-calculator"]
);

add(
  "fluorescence-quenching-calculator",
  "Fluorescence Quenching Calculator (Stern-Volmer)",
  "Analyze fluorescence quenching data using the Stern-Volmer equation to determine quenching constants and binding parameters for molecular interaction studies.",
  "Science",
  "science",
  "A",
  ["stern-volmer", "fluorescence quenching", "quenching constant", "ksv calculator", "fluorescence binding"],
  [
    '{ name: "f0", label: "Fluorescence Without Quencher (F0)", type: "number", min: 1, max: 100000, defaultValue: 10000 }',
    '{ name: "f", label: "Fluorescence With Quencher (F)", type: "number", min: 1, max: 100000, defaultValue: 6000 }',
    '{ name: "quencherConc", label: "Quencher Concentration (M)", type: "number", min: 0.0000001, max: 1, defaultValue: 0.001 }',
    '{ name: "temperature", label: "Temperature (K)", type: "number", min: 273, max: 373, defaultValue: 298 }'
  ],
  `(inputs) => {
    const f0 = inputs.f0 as number;
    const f = inputs.f as number;
    const quencherConc = inputs.quencherConc as number;
    const temperature = inputs.temperature as number;
    const ratio = f0 / f;
    const ksv = (ratio - 1) / quencherConc;
    const quenchPercent = ((f0 - f) / f0) * 100;
    const kq = ksv / 1e-8;
    var mechanism = "Static quenching likely";
    if (kq > 2e10) { mechanism = "Dynamic quenching likely"; }
    return {
      primary: { label: "Stern-Volmer Constant (Ksv)", value: formatNumber(Math.round(ksv)) + " M-1" },
      details: [
        { label: "F0/F Ratio", value: formatNumber(Math.round(ratio * 1000) / 1000) },
        { label: "Quenching Percentage", value: formatNumber(Math.round(quenchPercent * 10) / 10) + "%" },
        { label: "Bimolecular Rate (Kq)", value: formatNumber(Math.round(kq)) + " M-1s-1" },
        { label: "Likely Mechanism", value: mechanism }
      ]
    };
  }`,
  [
    "Q: What is the Stern-Volmer equation?||A: The Stern-Volmer equation F0/F = 1 + Ksv[Q] describes the relationship between fluorescence intensity and quencher concentration. Ksv is the Stern-Volmer constant, and [Q] is quencher concentration. A linear plot indicates a single class of fluorophore.",
    "Q: How do I distinguish static from dynamic quenching?||A: Dynamic (collisional) quenching has Kq values near the diffusion limit (about 10^10 M-1s-1). Static quenching involves complex formation and does not change fluorescence lifetime. Temperature dependence also differs: dynamic increases with temperature, static decreases.",
    "Q: What is a typical Ksv value?||A: Ksv values range widely depending on the system. For protein-drug binding, values of 10^3-10^5 M-1 are common. Highly efficient quenchers like iodide for tryptophan fluorescence give Ksv around 10^4 M-1."
  ],
  `F0/F = 1 + Ksv[Q]\nKsv = (F0/F - 1) / [Q]\nKq = Ksv / tau0\nwhere tau0 ~ 10^-8 s (typical fluorescence lifetime)`,
  ["spectrophotometer-calculator", "molarity-calculator", "bradford-assay-protein-calculator"]
);

add(
  "dna-rna-yield-calculator",
  "DNA/RNA Yield and Purity Calculator",
  "Calculate nucleic acid concentration, total yield, and purity ratios from UV spectrophotometer A260/A280 readings for DNA and RNA samples.",
  "Science",
  "science",
  "A",
  ["dna yield calculator", "rna yield purity", "a260 a280 ratio", "nucleic acid concentration", "nanodrop results"],
  [
    '{ name: "a260", label: "Absorbance at 260 nm", type: "number", min: 0.001, max: 10, defaultValue: 0.5 }',
    '{ name: "a280", label: "Absorbance at 280 nm", type: "number", min: 0.001, max: 10, defaultValue: 0.27 }',
    '{ name: "a230", label: "Absorbance at 230 nm", type: "number", min: 0.001, max: 10, defaultValue: 0.2 }',
    '{ name: "nucleicType", label: "Nucleic Acid Type", type: "select", options: [{ value: "50", label: "Double-stranded DNA (50 ug/mL/OD)" }, { value: "40", label: "RNA (40 ug/mL/OD)" }, { value: "33", label: "Single-stranded DNA (33 ug/mL/OD)" }], defaultValue: "50" }',
    '{ name: "dilutionFactor", label: "Dilution Factor", type: "number", min: 1, max: 1000, defaultValue: 1 }',
    '{ name: "totalVolume", label: "Total Sample Volume (uL)", type: "number", min: 1, max: 10000, defaultValue: 50 }'
  ],
  `(inputs) => {
    const a260 = inputs.a260 as number;
    const a280 = inputs.a280 as number;
    const a230 = inputs.a230 as number;
    const nucleicType = inputs.nucleicType as number;
    const dilutionFactor = inputs.dilutionFactor as number;
    const totalVolume = inputs.totalVolume as number;
    const concentration = a260 * nucleicType * dilutionFactor;
    const totalYield = concentration * totalVolume / 1000;
    const ratio260280 = a260 / a280;
    const ratio260230 = a260 / a230;
    var purityStatus = "Good purity";
    if (nucleicType === 50 && (ratio260280 < 1.7 || ratio260280 > 2.0)) { purityStatus = "Possible contamination"; }
    if (nucleicType === 40 && (ratio260280 < 1.8 || ratio260280 > 2.2)) { purityStatus = "Possible contamination"; }
    if (ratio260230 < 1.8) { purityStatus = purityStatus + " (organic contamination possible)"; }
    return {
      primary: { label: "Concentration", value: formatNumber(Math.round(concentration * 10) / 10) + " ug/mL" },
      details: [
        { label: "Total Yield", value: formatNumber(Math.round(totalYield * 100) / 100) + " ug" },
        { label: "A260/A280 Ratio", value: formatNumber(Math.round(ratio260280 * 100) / 100) },
        { label: "A260/A230 Ratio", value: formatNumber(Math.round(ratio260230 * 100) / 100) },
        { label: "Purity Assessment", value: purityStatus }
      ]
    };
  }`,
  [
    "Q: What is a good A260/A280 ratio?||A: For pure DNA, the A260/A280 ratio should be approximately 1.8. For pure RNA, it should be approximately 2.0. Lower values indicate protein contamination. Values above 2.0 for DNA may indicate RNA contamination.",
    "Q: What does the A260/A230 ratio indicate?||A: The A260/A230 ratio should be between 2.0-2.2 for pure nucleic acids. Low ratios indicate contamination with organic compounds like phenol, TRIzol, chaotropic salts, or carbohydrates from extraction procedures.",
    "Q: Why are different conversion factors used for DNA vs RNA?||A: Double-stranded DNA uses 50 ug/mL per OD260 unit, RNA uses 40, and single-stranded DNA uses 33. These differences reflect the distinct molar absorptivities of the nucleotide bases in each form."
  ],
  `Concentration = A260 x Conversion Factor x Dilution\nTotal Yield = Concentration x Volume / 1000\nConversion: dsDNA = 50, RNA = 40, ssDNA = 33 (ug/mL per OD260)`,
  ["dna-concentration-calculator", "pcr-cycle-number-calculator", "spectrophotometer-calculator"]
);

add(
  "plasmid-copy-number-calculator",
  "Plasmid Copy Number Calculator",
  "Estimate plasmid copy number per cell from qPCR or gel densitometry data by comparing plasmid DNA signal to chromosomal DNA reference signal.",
  "Science",
  "science",
  "A",
  ["plasmid copy number", "copy number calculation", "plasmid quantification", "gene dosage", "vector copy number"],
  [
    '{ name: "plasmidCt", label: "Plasmid Gene Ct Value", type: "number", min: 5, max: 45, defaultValue: 15 }',
    '{ name: "chromCt", label: "Chromosomal Gene Ct Value", type: "number", min: 5, max: 45, defaultValue: 22 }',
    '{ name: "efficiency", label: "PCR Efficiency (%)", type: "number", min: 80, max: 110, defaultValue: 95 }',
    '{ name: "chromCopyNum", label: "Chromosomal Gene Copies Per Genome", type: "number", min: 1, max: 10, defaultValue: 1 }'
  ],
  `(inputs) => {
    const plasmidCt = inputs.plasmidCt as number;
    const chromCt = inputs.chromCt as number;
    const efficiency = inputs.efficiency as number;
    const chromCopyNum = inputs.chromCopyNum as number;
    const eff = 1 + (efficiency / 100);
    const deltaCt = chromCt - plasmidCt;
    const copyNumber = Math.pow(eff, deltaCt) * chromCopyNum;
    const log2Copy = Math.log2(copyNumber);
    var copyRange = "Low copy (1-20)";
    if (copyNumber > 20 && copyNumber <= 100) { copyRange = "Medium copy (20-100)"; }
    if (copyNumber > 100 && copyNumber <= 500) { copyRange = "High copy (100-500)"; }
    if (copyNumber > 500) { copyRange = "Very high copy (>500)"; }
    return {
      primary: { label: "Plasmid Copy Number", value: formatNumber(Math.round(copyNumber)) + " copies/cell" },
      details: [
        { label: "Delta Ct", value: formatNumber(Math.round(deltaCt * 100) / 100) },
        { label: "Log2 Copy Number", value: formatNumber(Math.round(log2Copy * 100) / 100) },
        { label: "Copy Range Category", value: copyRange },
        { label: "PCR Efficiency Factor", value: formatNumber(Math.round(eff * 1000) / 1000) }
      ]
    };
  }`,
  [
    "Q: What is a typical copy number for common plasmid vectors?||A: pUC vectors have very high copy numbers (500-700). pBR322-derived vectors are medium copy (15-20). pACYC184 is low copy (10-12). BAC vectors maintain at 1-2 copies per cell.",
    "Q: Why does copy number matter for protein expression?||A: Higher copy number generally means more gene copies for transcription, leading to higher protein expression. However, very high copy numbers can burden the cell metabolically and cause instability or reduced growth rate.",
    "Q: How accurate is qPCR for copy number determination?||A: qPCR is reliable within 2-fold accuracy when PCR efficiency is matched between target and reference genes. For more precise measurements, digital PCR (dPCR) provides absolute quantification without a standard curve."
  ],
  `Copy Number = E^(Ct_chrom - Ct_plasmid) x Chromosomal Copies\nwhere E = 1 + (Efficiency/100)\nDelta Ct = Ct(chromosomal) - Ct(plasmid)`,
  ["qpcr-fold-change-calculator", "pcr-cycle-number-calculator", "dna-concentration-calculator"]
);

add(
  "stoichiometry-mass-calculator",
  "Stoichiometry Mass-to-Mass Calculator",
  "Calculate the mass of product formed or reactant needed using stoichiometric ratios and molar masses for balanced chemical equations.",
  "Science",
  "science",
  "A",
  ["stoichiometry calculator", "mass to mass conversion", "chemical equation calculator", "mole ratio", "theoretical yield mass"],
  [
    '{ name: "massReactant", label: "Mass of Known Substance (g)", type: "number", min: 0.001, max: 100000, defaultValue: 10 }',
    '{ name: "molarMassReactant", label: "Molar Mass of Known (g/mol)", type: "number", min: 1, max: 1000, defaultValue: 36.46 }',
    '{ name: "molarMassProduct", label: "Molar Mass of Unknown (g/mol)", type: "number", min: 1, max: 1000, defaultValue: 58.44 }',
    '{ name: "coeffReactant", label: "Coefficient of Known", type: "number", min: 1, max: 20, defaultValue: 1 }',
    '{ name: "coeffProduct", label: "Coefficient of Unknown", type: "number", min: 1, max: 20, defaultValue: 1 }',
    '{ name: "percentYield", label: "Expected Percent Yield (%)", type: "number", min: 1, max: 100, defaultValue: 100 }'
  ],
  `(inputs) => {
    const massReactant = inputs.massReactant as number;
    const molarMassReactant = inputs.molarMassReactant as number;
    const molarMassProduct = inputs.molarMassProduct as number;
    const coeffReactant = inputs.coeffReactant as number;
    const coeffProduct = inputs.coeffProduct as number;
    const percentYield = inputs.percentYield as number;
    const molesReactant = massReactant / molarMassReactant;
    const molesProduct = molesReactant * (coeffProduct / coeffReactant);
    const theoreticalMass = molesProduct * molarMassProduct;
    const actualMass = theoreticalMass * (percentYield / 100);
    return {
      primary: { label: "Mass of Unknown", value: formatNumber(Math.round(actualMass * 1000) / 1000) + " g" },
      details: [
        { label: "Theoretical Mass (100%)", value: formatNumber(Math.round(theoreticalMass * 1000) / 1000) + " g" },
        { label: "Moles of Known", value: formatNumber(Math.round(molesReactant * 10000) / 10000) + " mol" },
        { label: "Moles of Unknown", value: formatNumber(Math.round(molesProduct * 10000) / 10000) + " mol" },
        { label: "Mole Ratio", value: formatNumber(coeffReactant) + ":" + formatNumber(coeffProduct) }
      ]
    };
  }`,
  [
    "Q: How do I determine stoichiometric coefficients?||A: Coefficients come from the balanced chemical equation. For example, in 2H2 + O2 -> 2H2O, hydrogen has coefficient 2, oxygen has 1, and water has 2. The equation must be balanced before using stoichiometry.",
    "Q: What is the difference between theoretical and actual yield?||A: Theoretical yield is the maximum mass of product calculated from stoichiometry assuming complete reaction. Actual yield is what you obtain experimentally. Percent yield = (actual/theoretical) x 100.",
    "Q: Why is my actual yield less than theoretical?||A: Yields below 100% result from incomplete reactions, side reactions, loss during purification, transfer losses, and measurement errors. Yields of 60-90% are common in organic synthesis. Quantitative yields (near 100%) are rare."
  ],
  `Moles(known) = Mass / Molar Mass\nMoles(unknown) = Moles(known) x (Coeff unknown / Coeff known)\nTheoretical Mass = Moles(unknown) x Molar Mass(unknown)\nActual Mass = Theoretical x Yield%`,
  ["percent-yield-calculator", "limiting-reagent-calculator", "molar-mass-calculator"]
);
add(
  "reception-venue-cost-calculator",
  "Reception Venue Cost Calculator",
  "Estimate reception venue rental costs based on guest count, venue type, hours of rental, and seasonal pricing adjustments.",
  "Finance",
  "finance",
  "$",
  ["reception venue cost", "wedding venue rental", "venue pricing", "event space cost"],
  [
    '{ name: "guestCount", label: "Number of Guests", type: "number", min: 10, max: 500, defaultValue: 150 }',
    '{ name: "venueType", label: "Venue Type", type: "select", options: [{ value: "1", label: "Community Hall" }, { value: "2", label: "Hotel Ballroom" }, { value: "3", label: "Garden/Estate" }, { value: "4", label: "Luxury Resort" }], defaultValue: "2" }',
    '{ name: "rentalHours", label: "Rental Hours", type: "number", min: 2, max: 16, defaultValue: 6 }',
    '{ name: "season", label: "Season", type: "select", options: [{ value: "1", label: "Off-Season (Nov-Mar)" }, { value: "1.3", label: "Peak Season (Jun-Oct)" }, { value: "1.15", label: "Shoulder Season (Apr-May)" }], defaultValue: "1.3" }'
  ],
  `(inputs) => {
    const guests = inputs.guestCount as number;
    const venueType = parseFloat(inputs.venueType as unknown as string);
    const hours = inputs.rentalHours as number;
    const seasonMult = parseFloat(inputs.season as unknown as string);
    const baseCosts = { 1: 1500, 2: 4000, 3: 5500, 4: 10000 } as Record<number, number>;
    const baseCost = baseCosts[venueType] || 4000;
    const perGuestFee = venueType * 15;
    const hourlyExtra = hours > 5 ? (hours - 5) * 500 : 0;
    const subtotal = baseCost + (guests * perGuestFee) + hourlyExtra;
    const total = subtotal * seasonMult;
    const perGuest = total / guests;
    return {
      primary: { label: "Estimated Venue Cost", value: "$" + formatNumber(Math.round(total)) },
      details: [
        { label: "Base Venue Fee", value: "$" + formatNumber(baseCost) },
        { label: "Guest Surcharge", value: "$" + formatNumber(Math.round(guests * perGuestFee)) },
        { label: "Extra Hours Fee", value: "$" + formatNumber(hourlyExtra) },
        { label: "Seasonal Adjustment", value: (seasonMult * 100 - 100).toFixed(0) + "% markup" },
        { label: "Cost Per Guest", value: "$" + formatNumber(Math.round(perGuest)) }
      ]
    };
  }`,
  [
    { q: "How much does a wedding reception venue cost?", a: "Reception venues typically range from $1,500 for a community hall to $15,000 or more for a luxury resort. The average is $5,000 to $10,000 depending on location and guest count." },
    { q: "Does season affect venue pricing?", a: "Yes. Peak wedding season (June through October) commands 20-40% higher prices. Off-season bookings can save thousands of dollars." },
    { q: "What is included in a venue rental fee?", a: "Venue fees usually include the space, tables, chairs, basic setup, and a certain number of hours. Catering, decor, and additional hours are often extra." }
  ],
  `Total = (BaseFee + GuestCount x PerGuestFee + ExtraHoursFee) x SeasonMultiplier
Per Guest = Total / GuestCount`,
  ["wedding-budget-calculator", "event-catering-calculator", "wedding-guest-calculator"]
);

add(
  "dj-vs-band-cost-calculator",
  "DJ vs Band Cost Calculator",
  "Compare the cost of hiring a DJ versus a live band for your wedding or event based on hours, size of band, and equipment needs.",
  "Finance",
  "finance",
  "$",
  ["DJ cost", "wedding band cost", "live music pricing", "wedding entertainment cost"],
  [
    '{ name: "eventHours", label: "Entertainment Hours", type: "number", min: 1, max: 10, defaultValue: 5 }',
    '{ name: "djHourlyRate", label: "DJ Hourly Rate ($)", type: "number", min: 50, max: 500, defaultValue: 150 }',
    '{ name: "bandMembers", label: "Number of Band Members", type: "number", min: 2, max: 12, defaultValue: 5 }',
    '{ name: "bandMemberRate", label: "Band Member Hourly Rate ($)", type: "number", min: 50, max: 400, defaultValue: 125 }',
    '{ name: "soundSystemNeeded", label: "Sound System Rental", type: "select", options: [{ value: "0", label: "Included" }, { value: "500", label: "Basic ($500)" }, { value: "1200", label: "Premium ($1200)" }], defaultValue: "0" }'
  ],
  `(inputs) => {
    const hours = inputs.eventHours as number;
    const djRate = inputs.djHourlyRate as number;
    const bandMembers = inputs.bandMembers as number;
    const bandRate = inputs.bandMemberRate as number;
    const soundCost = parseFloat(inputs.soundSystemNeeded as unknown as string);
    const djTotal = (hours * djRate) + soundCost;
    const bandTotal = (hours * bandRate * bandMembers) + soundCost;
    const savings = bandTotal - djTotal;
    return {
      primary: { label: "DJ Total Cost", value: "$" + formatNumber(Math.round(djTotal)) },
      details: [
        { label: "Band Total Cost", value: "$" + formatNumber(Math.round(bandTotal)) },
        { label: "Savings with DJ", value: "$" + formatNumber(Math.round(savings)) },
        { label: "DJ Hourly Cost", value: "$" + formatNumber(djRate) + "/hr" },
        { label: "Band Hourly Cost", value: "$" + formatNumber(bandRate * bandMembers) + "/hr" },
        { label: "Sound System Add-on", value: "$" + formatNumber(soundCost) }
      ]
    };
  }`,
  [
    { q: "Is a DJ cheaper than a band for a wedding?", a: "Yes, DJs typically cost $500 to $1,500 for a wedding, while a live band ranges from $2,000 to $10,000 or more depending on size and talent level." },
    { q: "How many hours of music do you need at a wedding?", a: "Most weddings need 4 to 5 hours of music: about 1 hour for cocktails and dinner, and 3 to 4 hours for dancing." },
    { q: "Can you have both a DJ and a band?", a: "Yes, some couples hire a band for the reception and a DJ for cocktail hour or late-night dancing, though this increases the total cost." }
  ],
  `DJ Total = (Hours x DJ Rate) + Sound System
Band Total = (Hours x Band Member Rate x Members) + Sound System
Savings = Band Total - DJ Total`,
  ["wedding-budget-calculator", "event-catering-calculator", "reception-venue-cost-calculator"]
);

add(
  "wedding-photographer-cost-calculator",
  "Wedding Photographer Cost Calculator",
  "Estimate wedding photography costs including coverage hours, second shooter, engagement session, prints, and album options.",
  "Finance",
  "finance",
  "$",
  ["wedding photographer cost", "wedding photography pricing", "photographer rates", "wedding photo package"],
  [
    '{ name: "coverageHours", label: "Coverage Hours", type: "number", min: 2, max: 14, defaultValue: 8 }',
    '{ name: "hourlyRate", label: "Photographer Hourly Rate ($)", type: "number", min: 50, max: 600, defaultValue: 200 }',
    '{ name: "secondShooter", label: "Second Shooter", type: "select", options: [{ value: "0", label: "No" }, { value: "1", label: "Yes" }], defaultValue: "0" }',
    '{ name: "engagementSession", label: "Engagement Session", type: "select", options: [{ value: "0", label: "No" }, { value: "500", label: "Standard ($500)" }, { value: "1000", label: "Premium ($1000)" }], defaultValue: "500" }',
    '{ name: "albumCost", label: "Photo Album Cost ($)", type: "number", min: 0, max: 3000, defaultValue: 800 }'
  ],
  `(inputs) => {
    const hours = inputs.coverageHours as number;
    const rate = inputs.hourlyRate as number;
    const secondShooter = parseFloat(inputs.secondShooter as unknown as string);
    const engagement = parseFloat(inputs.engagementSession as unknown as string);
    const album = inputs.albumCost as number;
    const primaryCost = hours * rate;
    const secondCost = secondShooter === 1 ? hours * rate * 0.5 : 0;
    const total = primaryCost + secondCost + engagement + album;
    return {
      primary: { label: "Total Photography Cost", value: "$" + formatNumber(Math.round(total)) },
      details: [
        { label: "Primary Photographer", value: "$" + formatNumber(Math.round(primaryCost)) },
        { label: "Second Shooter", value: "$" + formatNumber(Math.round(secondCost)) },
        { label: "Engagement Session", value: "$" + formatNumber(engagement) },
        { label: "Album", value: "$" + formatNumber(album) },
        { label: "Effective Hourly Rate", value: "$" + formatNumber(Math.round(total / hours)) + "/hr" }
      ]
    };
  }`,
  [
    { q: "How much does a wedding photographer cost?", a: "Wedding photographers typically charge $2,000 to $5,000 for full-day coverage. Luxury photographers can charge $8,000 to $15,000 or more." },
    { q: "Do you need a second photographer at a wedding?", a: "A second shooter captures additional angles, candid moments, and the other partner getting ready simultaneously. It is recommended for weddings with 100+ guests." },
    { q: "How many photos do wedding photographers deliver?", a: "Most photographers deliver 50 to 100 edited photos per hour of coverage, so an 8-hour wedding typically yields 400 to 800 final images." }
  ],
  `Total = (Hours x Rate) + SecondShooterCost + EngagementSession + AlbumCost
Second Shooter = Hours x Rate x 0.5 (if selected)`,
  ["wedding-budget-calculator", "wedding-videography-cost-calculator", "reception-venue-cost-calculator"]
);

add(
  "bridesmaid-dress-budget-calculator",
  "Bridesmaid Dress Budget Calculator",
  "Calculate the total cost of bridesmaid dresses including alterations, accessories, and shoes for the entire bridal party.",
  "Finance",
  "finance",
  "$",
  ["bridesmaid dress cost", "bridal party budget", "bridesmaid outfit", "wedding party attire"],
  [
    '{ name: "bridesmaids", label: "Number of Bridesmaids", type: "number", min: 1, max: 15, defaultValue: 5 }',
    '{ name: "dressPrice", label: "Dress Price Per Person ($)", type: "number", min: 50, max: 1000, defaultValue: 180 }',
    '{ name: "alterationCost", label: "Alteration Cost Per Dress ($)", type: "number", min: 0, max: 500, defaultValue: 75 }',
    '{ name: "shoesCost", label: "Shoes Per Person ($)", type: "number", min: 0, max: 300, defaultValue: 65 }',
    '{ name: "accessoryCost", label: "Accessories Per Person ($)", type: "number", min: 0, max: 200, defaultValue: 40 }'
  ],
  `(inputs) => {
    const count = inputs.bridesmaids as number;
    const dress = inputs.dressPrice as number;
    const alteration = inputs.alterationCost as number;
    const shoes = inputs.shoesCost as number;
    const accessories = inputs.accessoryCost as number;
    const perPerson = dress + alteration + shoes + accessories;
    const totalDresses = count * dress;
    const totalAlterations = count * alteration;
    const totalShoes = count * shoes;
    const totalAccessories = count * accessories;
    const grandTotal = count * perPerson;
    return {
      primary: { label: "Total Bridal Party Cost", value: "$" + formatNumber(Math.round(grandTotal)) },
      details: [
        { label: "Cost Per Bridesmaid", value: "$" + formatNumber(Math.round(perPerson)) },
        { label: "All Dresses", value: "$" + formatNumber(totalDresses) },
        { label: "All Alterations", value: "$" + formatNumber(totalAlterations) },
        { label: "All Shoes", value: "$" + formatNumber(totalShoes) },
        { label: "All Accessories", value: "$" + formatNumber(totalAccessories) }
      ]
    };
  }`,
  [
    { q: "How much do bridesmaid dresses cost?", a: "Bridesmaid dresses typically range from $100 to $300 each. Designer options can cost $300 to $600 or more." },
    { q: "Who pays for bridesmaid dresses?", a: "Traditionally, bridesmaids pay for their own dresses and accessories. Some brides choose to cover these costs as a gift to their bridal party." },
    { q: "Do bridesmaid dresses need alterations?", a: "Most bridesmaid dresses need some alterations for proper fit. Common adjustments include hemming, taking in the waist, or adjusting straps, costing $50 to $150." }
  ],
  `Per Person = DressPrice + Alterations + Shoes + Accessories
Total = NumberOfBridesmaids x PerPersonCost`,
  ["wedding-budget-calculator", "groomsmen-cost-calculator", "wedding-dress-alteration-cost-calculator"]
);

add(
  "groomsmen-cost-calculator",
  "Groomsmen Cost Calculator",
  "Estimate the total cost for outfitting groomsmen including suit rental or purchase, shoes, accessories, and gifts.",
  "Finance",
  "finance",
  "$",
  ["groomsmen cost", "groomsmen suit rental", "wedding party men", "best man attire cost"],
  [
    '{ name: "groomsmen", label: "Number of Groomsmen", type: "number", min: 1, max: 15, defaultValue: 5 }',
    '{ name: "attireOption", label: "Attire Option", type: "select", options: [{ value: "1", label: "Suit Rental" }, { value: "2", label: "Suit Purchase" }, { value: "3", label: "Tuxedo Rental" }], defaultValue: "1" }',
    '{ name: "attireCost", label: "Attire Cost Per Person ($)", type: "number", min: 50, max: 1500, defaultValue: 200 }',
    '{ name: "shoesCost", label: "Shoes Per Person ($)", type: "number", min: 0, max: 400, defaultValue: 70 }',
    '{ name: "accessoryCost", label: "Accessories Per Person ($)", type: "number", min: 0, max: 200, defaultValue: 50 }',
    '{ name: "giftCost", label: "Gift Per Groomsman ($)", type: "number", min: 0, max: 300, defaultValue: 50 }'
  ],
  `(inputs) => {
    const count = inputs.groomsmen as number;
    const attire = inputs.attireCost as number;
    const shoes = inputs.shoesCost as number;
    const accessories = inputs.accessoryCost as number;
    const gift = inputs.giftCost as number;
    const perPerson = attire + shoes + accessories + gift;
    const totalAttire = count * attire;
    const totalGifts = count * gift;
    const grandTotal = count * perPerson;
    return {
      primary: { label: "Total Groomsmen Cost", value: "$" + formatNumber(Math.round(grandTotal)) },
      details: [
        { label: "Cost Per Groomsman", value: "$" + formatNumber(Math.round(perPerson)) },
        { label: "All Attire", value: "$" + formatNumber(totalAttire) },
        { label: "All Shoes", value: "$" + formatNumber(count * shoes) },
        { label: "All Accessories", value: "$" + formatNumber(count * accessories) },
        { label: "All Gifts", value: "$" + formatNumber(totalGifts) }
      ]
    };
  }`,
  [
    { q: "How much does a groomsman outfit cost?", a: "Suit rentals typically cost $150 to $250, while purchased suits range from $200 to $800. Tuxedo rentals average $175 to $300." },
    { q: "Who pays for groomsmen attire?", a: "Traditionally, groomsmen pay for their own attire. The groom may cover the cost as a gift or split expenses with the wedding party." },
    { q: "Should the groom give gifts to groomsmen?", a: "Yes, it is customary for the groom to give groomsmen a thank-you gift ranging from $25 to $100 per person." }
  ],
  `Per Groomsman = AttireCost + Shoes + Accessories + Gift
Total = NumberOfGroomsmen x PerPersonCost`,
  ["wedding-budget-calculator", "bridesmaid-dress-budget-calculator", "wedding-guest-calculator"]
);

add(
  "seating-chart-optimizer-calculator",
  "Seating Chart Optimizer Calculator",
  "Plan your event seating layout by calculating table counts, seats per table, head table size, and remaining capacity.",
  "Everyday",
  "everyday",
  "~",
  ["seating chart", "wedding seating plan", "table layout", "event seating optimizer"],
  [
    '{ name: "totalGuests", label: "Total Guests", type: "number", min: 10, max: 500, defaultValue: 120 }',
    '{ name: "tableType", label: "Table Type", type: "select", options: [{ value: "8", label: "Round (8 per table)" }, { value: "10", label: "Round (10 per table)" }, { value: "6", label: "Rectangular (6 per table)" }, { value: "12", label: "Long Banquet (12 per table)" }], defaultValue: "8" }',
    '{ name: "headTableSize", label: "Head Table Seats", type: "number", min: 0, max: 30, defaultValue: 10 }',
    '{ name: "kidsTable", label: "Separate Kids Table", type: "select", options: [{ value: "0", label: "No" }, { value: "1", label: "Yes" }], defaultValue: "0" }',
    '{ name: "kidsCount", label: "Number of Kids (if separate)", type: "number", min: 0, max: 50, defaultValue: 8 }'
  ],
  `(inputs) => {
    const totalGuests = inputs.totalGuests as number;
    const seatsPerTable = parseInt(inputs.tableType as unknown as string);
    const headTable = inputs.headTableSize as number;
    const kidsTableFlag = parseInt(inputs.kidsTable as unknown as string);
    const kids = inputs.kidsCount as number;
    const kidsAtSeparate = kidsTableFlag === 1 ? kids : 0;
    const remainingGuests = totalGuests - headTable - kidsAtSeparate;
    const tablesNeeded = Math.ceil(remainingGuests / seatsPerTable);
    const totalSeats = headTable + kidsAtSeparate + (tablesNeeded * seatsPerTable);
    const emptySeats = totalSeats - totalGuests;
    const kidsTables = kidsTableFlag === 1 ? Math.ceil(kids / seatsPerTable) : 0;
    const totalTables = tablesNeeded + 1 + kidsTables;
    return {
      primary: { label: "Guest Tables Needed", value: formatNumber(tablesNeeded) },
      details: [
        { label: "Total Tables (incl. Head)", value: formatNumber(totalTables) },
        { label: "Seats Per Table", value: formatNumber(seatsPerTable) },
        { label: "Head Table Seats", value: formatNumber(headTable) },
        { label: "Kids Tables", value: formatNumber(kidsTables) },
        { label: "Empty Seats", value: formatNumber(emptySeats) }
      ]
    };
  }`,
  [
    { q: "How many tables do you need for 100 guests?", a: "For round tables seating 8, you need about 12-13 tables for 100 guests (accounting for a head table). For tables of 10, you need 10-11 tables." },
    { q: "What is the best table layout for a wedding?", a: "Round tables of 8-10 promote conversation. Long banquet tables create an intimate feel. The best layout depends on your venue shape and guest dynamics." },
    { q: "Should kids have a separate table?", a: "Separate kids tables work well for children aged 5-12. Younger children usually sit with parents, while teens can sit at regular guest tables." }
  ],
  `Remaining = TotalGuests - HeadTable - KidsAtSeparateTable
Tables Needed = ceil(Remaining / SeatsPerTable)
Empty Seats = TotalSeats - TotalGuests`,
  ["wedding-guest-calculator", "reception-venue-cost-calculator", "event-catering-calculator"]
);

add(
  "event-timeline-planner-calculator",
  "Event Timeline Planner Calculator",
  "Build a wedding or event timeline by allocating hours for ceremony, cocktails, dinner, dancing, and other activities.",
  "Everyday",
  "everyday",
  "~",
  ["event timeline", "wedding schedule", "reception timeline", "event planning hours"],
  [
    '{ name: "ceremonyMinutes", label: "Ceremony Duration (min)", type: "number", min: 10, max: 120, defaultValue: 30 }',
    '{ name: "cocktailMinutes", label: "Cocktail Hour (min)", type: "number", min: 0, max: 120, defaultValue: 60 }',
    '{ name: "dinnerMinutes", label: "Dinner Duration (min)", type: "number", min: 30, max: 180, defaultValue: 90 }',
    '{ name: "dancingMinutes", label: "Dancing/Party (min)", type: "number", min: 30, max: 300, defaultValue: 180 }',
    '{ name: "photosMinutes", label: "Photo Session (min)", type: "number", min: 0, max: 120, defaultValue: 45 }',
    '{ name: "bufferMinutes", label: "Buffer/Transition Time (min)", type: "number", min: 0, max: 60, defaultValue: 30 }'
  ],
  `(inputs) => {
    const ceremony = inputs.ceremonyMinutes as number;
    const cocktail = inputs.cocktailMinutes as number;
    const dinner = inputs.dinnerMinutes as number;
    const dancing = inputs.dancingMinutes as number;
    const photos = inputs.photosMinutes as number;
    const buffer = inputs.bufferMinutes as number;
    const totalMinutes = ceremony + cocktail + dinner + dancing + photos + buffer;
    const totalHours = totalMinutes / 60;
    return {
      primary: { label: "Total Event Duration", value: formatNumber(Math.round(totalHours * 10) / 10) + " hours" },
      details: [
        { label: "Total Minutes", value: formatNumber(totalMinutes) + " min" },
        { label: "Ceremony", value: formatNumber(ceremony) + " min" },
        { label: "Cocktail Hour", value: formatNumber(cocktail) + " min" },
        { label: "Dinner", value: formatNumber(dinner) + " min" },
        { label: "Dancing/Party", value: formatNumber(dancing) + " min" },
        { label: "Photos + Buffer", value: formatNumber(photos + buffer) + " min" }
      ]
    };
  }`,
  [
    { q: "How long should a wedding reception be?", a: "Most wedding receptions last 4 to 5 hours. This includes a cocktail hour, dinner service, toasts, and 2-3 hours of dancing." },
    { q: "What is a typical wedding day timeline?", a: "A typical timeline is: getting ready (3-4 hours), ceremony (30 minutes), photos (45 minutes), cocktail hour (1 hour), dinner (1.5 hours), and dancing (3 hours)." },
    { q: "How much buffer time should you plan?", a: "Allow 15-30 minutes of buffer between major events. Transitions always take longer than expected, especially with large guest counts." }
  ],
  `Total Duration (hours) = (Ceremony + Cocktail + Dinner + Dancing + Photos + Buffer) / 60`,
  ["reception-venue-cost-calculator", "wedding-budget-calculator", "seating-chart-optimizer-calculator"]
);

add(
  "birthday-milestone-cost-calculator",
  "Birthday Milestone Cost Calculator",
  "Estimate costs for a milestone birthday celebration including venue, catering, decorations, entertainment, and a special cake.",
  "Finance",
  "finance",
  "$",
  ["milestone birthday cost", "birthday party budget", "special birthday planning", "birthday celebration cost"],
  [
    '{ name: "guests", label: "Number of Guests", type: "number", min: 5, max: 200, defaultValue: 40 }',
    '{ name: "venueRental", label: "Venue Rental ($)", type: "number", min: 0, max: 10000, defaultValue: 1000 }',
    '{ name: "foodPerPerson", label: "Food Cost Per Person ($)", type: "number", min: 10, max: 200, defaultValue: 45 }',
    '{ name: "drinkPerPerson", label: "Drink Cost Per Person ($)", type: "number", min: 0, max: 80, defaultValue: 20 }',
    '{ name: "decorations", label: "Decorations Budget ($)", type: "number", min: 0, max: 5000, defaultValue: 300 }',
    '{ name: "entertainment", label: "Entertainment Cost ($)", type: "number", min: 0, max: 5000, defaultValue: 500 }',
    '{ name: "cakeCost", label: "Custom Cake Cost ($)", type: "number", min: 0, max: 2000, defaultValue: 200 }'
  ],
  `(inputs) => {
    const guests = inputs.guests as number;
    const venue = inputs.venueRental as number;
    const food = inputs.foodPerPerson as number;
    const drink = inputs.drinkPerPerson as number;
    const decor = inputs.decorations as number;
    const entertainment = inputs.entertainment as number;
    const cake = inputs.cakeCost as number;
    const cateringTotal = guests * (food + drink);
    const total = venue + cateringTotal + decor + entertainment + cake;
    const perGuest = total / guests;
    return {
      primary: { label: "Total Party Cost", value: "$" + formatNumber(Math.round(total)) },
      details: [
        { label: "Venue Rental", value: "$" + formatNumber(venue) },
        { label: "Total Catering", value: "$" + formatNumber(Math.round(cateringTotal)) },
        { label: "Decorations", value: "$" + formatNumber(decor) },
        { label: "Entertainment", value: "$" + formatNumber(entertainment) },
        { label: "Cake", value: "$" + formatNumber(cake) },
        { label: "Cost Per Guest", value: "$" + formatNumber(Math.round(perGuest)) }
      ]
    };
  }`,
  [
    { q: "How much does a milestone birthday party cost?", a: "Milestone birthday parties (30th, 40th, 50th) typically cost $1,000 to $5,000 for 30-50 guests. Elaborate celebrations can exceed $10,000." },
    { q: "What makes a good milestone birthday party?", a: "Great milestone parties include personalized decor, quality catering, entertainment, a custom cake, and thoughtful touches like photo displays or memory books." },
    { q: "How many guests should you invite to a birthday party?", a: "Adult birthday parties typically have 20-50 guests. Milestone birthdays may have more, up to 100, depending on venue and budget." }
  ],
  `Catering = Guests x (FoodPerPerson + DrinkPerPerson)
Total = Venue + Catering + Decorations + Entertainment + Cake
Per Guest = Total / Guests`,
  ["wedding-budget-calculator", "event-catering-calculator", "party-balloon-calculator"]
);

add(
  "anniversary-gift-budget-calculator",
  "Anniversary Gift Budget Calculator",
  "Plan anniversary celebration spending including a traditional or modern gift, dinner, flowers, and a special experience.",
  "Finance",
  "finance",
  "$",
  ["anniversary gift budget", "anniversary celebration cost", "anniversary planning", "wedding anniversary gift"],
  [
    '{ name: "giftBudget", label: "Gift Budget ($)", type: "number", min: 10, max: 10000, defaultValue: 200 }',
    '{ name: "dinnerBudget", label: "Dinner Budget ($)", type: "number", min: 0, max: 2000, defaultValue: 150 }',
    '{ name: "flowersBudget", label: "Flowers Budget ($)", type: "number", min: 0, max: 500, defaultValue: 75 }',
    '{ name: "experienceBudget", label: "Experience/Activity ($)", type: "number", min: 0, max: 5000, defaultValue: 100 }',
    '{ name: "cardAndExtras", label: "Card and Extras ($)", type: "number", min: 0, max: 200, defaultValue: 25 }'
  ],
  `(inputs) => {
    const gift = inputs.giftBudget as number;
    const dinner = inputs.dinnerBudget as number;
    const flowers = inputs.flowersBudget as number;
    const experience = inputs.experienceBudget as number;
    const extras = inputs.cardAndExtras as number;
    const total = gift + dinner + flowers + experience + extras;
    const giftPct = total > 0 ? (gift / total) * 100 : 0;
    return {
      primary: { label: "Total Anniversary Budget", value: "$" + formatNumber(Math.round(total)) },
      details: [
        { label: "Gift", value: "$" + formatNumber(gift) },
        { label: "Dinner", value: "$" + formatNumber(dinner) },
        { label: "Flowers", value: "$" + formatNumber(flowers) },
        { label: "Experience/Activity", value: "$" + formatNumber(experience) },
        { label: "Card and Extras", value: "$" + formatNumber(extras) },
        { label: "Gift as % of Total", value: formatNumber(Math.round(giftPct)) + "%" }
      ]
    };
  }`,
  [
    { q: "How much should you spend on an anniversary gift?", a: "There is no fixed rule, but common ranges are $50-$150 for early anniversaries and $200-$500 or more for milestone years like 10th, 25th, or 50th." },
    { q: "What are the traditional anniversary gift themes?", a: "Traditional themes include paper (1st), cotton (2nd), leather (3rd), wood (5th), tin (10th), silver (25th), and gold (50th). Modern alternatives also exist for each year." },
    { q: "Is an experience better than a physical gift?", a: "Experiences like trips, cooking classes, or spa days create lasting memories and are increasingly popular as anniversary gifts, especially for couples who prefer minimal material possessions." }
  ],
  `Total = Gift + Dinner + Flowers + Experience + Extras
Gift Percentage = (Gift / Total) x 100`,
  ["birthday-milestone-cost-calculator", "wedding-budget-calculator", "honeymoon-budget-planner-calculator"]
);

add(
  "rehearsal-dinner-cost-calculator",
  "Rehearsal Dinner Cost Calculator",
  "Estimate rehearsal dinner costs based on guest count, venue style, menu selection, drinks, and additional touches.",
  "Finance",
  "finance",
  "$",
  ["rehearsal dinner cost", "rehearsal dinner budget", "wedding rehearsal", "pre-wedding dinner"],
  [
    '{ name: "guests", label: "Number of Guests", type: "number", min: 5, max: 100, defaultValue: 30 }',
    '{ name: "venueStyle", label: "Venue Style", type: "select", options: [{ value: "30", label: "Casual Restaurant" }, { value: "55", label: "Upscale Restaurant" }, { value: "80", label: "Private Dining Room" }, { value: "120", label: "Private Event Space" }], defaultValue: "55" }',
    '{ name: "drinksPerPerson", label: "Drinks Per Person ($)", type: "number", min: 0, max: 100, defaultValue: 25 }',
    '{ name: "decorations", label: "Decorations ($)", type: "number", min: 0, max: 2000, defaultValue: 200 }',
    '{ name: "gratuity", label: "Gratuity (%)", type: "number", min: 0, max: 30, defaultValue: 20 }'
  ],
  `(inputs) => {
    const guests = inputs.guests as number;
    const foodPerPerson = parseFloat(inputs.venueStyle as unknown as string);
    const drinks = inputs.drinksPerPerson as number;
    const decor = inputs.decorations as number;
    const gratPct = inputs.gratuity as number;
    const foodTotal = guests * foodPerPerson;
    const drinkTotal = guests * drinks;
    const subtotal = foodTotal + drinkTotal + decor;
    const gratuity = (foodTotal + drinkTotal) * (gratPct / 100);
    const total = subtotal + gratuity;
    const perGuest = total / guests;
    return {
      primary: { label: "Total Rehearsal Dinner Cost", value: "$" + formatNumber(Math.round(total)) },
      details: [
        { label: "Food Cost", value: "$" + formatNumber(Math.round(foodTotal)) },
        { label: "Drinks Cost", value: "$" + formatNumber(Math.round(drinkTotal)) },
        { label: "Decorations", value: "$" + formatNumber(decor) },
        { label: "Gratuity", value: "$" + formatNumber(Math.round(gratuity)) },
        { label: "Cost Per Guest", value: "$" + formatNumber(Math.round(perGuest)) }
      ]
    };
  }`,
  [
    { q: "How much does a rehearsal dinner cost?", a: "Rehearsal dinners typically cost $1,000 to $5,000 for 20-40 guests. The average is about $75 to $100 per person including food, drinks, and gratuity." },
    { q: "Who is invited to the rehearsal dinner?", a: "Traditionally, the wedding party, immediate family, officiant, and their partners attend. Some couples extend invitations to out-of-town guests." },
    { q: "Who pays for the rehearsal dinner?", a: "Traditionally, the groom's family hosts and pays for the rehearsal dinner. Modern couples may split costs or have either family cover it." }
  ],
  `Subtotal = (Guests x FoodPerPerson) + (Guests x DrinksPerPerson) + Decorations
Gratuity = (Food + Drinks) x GratuityRate
Total = Subtotal + Gratuity`,
  ["wedding-budget-calculator", "event-catering-calculator", "reception-venue-cost-calculator"]
);

add(
  "honeymoon-budget-planner-calculator",
  "Honeymoon Budget Planner Calculator",
  "Plan and estimate your honeymoon budget including flights, accommodation, meals, activities, and spending money.",
  "Finance",
  "finance",
  "$",
  ["honeymoon budget", "honeymoon cost", "honeymoon planning", "travel budget wedding"],
  [
    '{ name: "nights", label: "Number of Nights", type: "number", min: 1, max: 30, defaultValue: 7 }',
    '{ name: "flightCost", label: "Flights (both people, $)", type: "number", min: 0, max: 10000, defaultValue: 1500 }',
    '{ name: "hotelPerNight", label: "Hotel Per Night ($)", type: "number", min: 50, max: 2000, defaultValue: 250 }',
    '{ name: "mealsPerDay", label: "Meals Per Day (both, $)", type: "number", min: 20, max: 500, defaultValue: 120 }',
    '{ name: "activitiesPerDay", label: "Activities Per Day ($)", type: "number", min: 0, max: 500, defaultValue: 80 }',
    '{ name: "spendingMoney", label: "Shopping/Souvenirs ($)", type: "number", min: 0, max: 5000, defaultValue: 500 }'
  ],
  `(inputs) => {
    const nights = inputs.nights as number;
    const flights = inputs.flightCost as number;
    const hotel = inputs.hotelPerNight as number;
    const meals = inputs.mealsPerDay as number;
    const activities = inputs.activitiesPerDay as number;
    const shopping = inputs.spendingMoney as number;
    const totalHotel = nights * hotel;
    const totalMeals = nights * meals;
    const totalActivities = nights * activities;
    const total = flights + totalHotel + totalMeals + totalActivities + shopping;
    const perDay = total / nights;
    return {
      primary: { label: "Total Honeymoon Budget", value: "$" + formatNumber(Math.round(total)) },
      details: [
        { label: "Flights", value: "$" + formatNumber(flights) },
        { label: "Accommodation", value: "$" + formatNumber(Math.round(totalHotel)) },
        { label: "Meals", value: "$" + formatNumber(Math.round(totalMeals)) },
        { label: "Activities", value: "$" + formatNumber(Math.round(totalActivities)) },
        { label: "Shopping/Souvenirs", value: "$" + formatNumber(shopping) },
        { label: "Average Per Day", value: "$" + formatNumber(Math.round(perDay)) }
      ]
    };
  }`,
  [
    { q: "How much does the average honeymoon cost?", a: "The average honeymoon costs $4,000 to $5,000 for a domestic trip and $5,000 to $10,000 for an international destination. Luxury honeymoons can exceed $15,000." },
    { q: "How long should a honeymoon be?", a: "Most honeymoons last 7 to 10 days. Some couples opt for a mini-moon of 3-4 days after the wedding and take a longer trip later." },
    { q: "When should you book your honeymoon?", a: "Book flights and hotels 6-9 months in advance for the best rates. Popular destinations during peak season should be booked even earlier." }
  ],
  `Total = Flights + (Nights x HotelPerNight) + (Nights x MealsPerDay) + (Nights x ActivitiesPerDay) + Shopping
Average Per Day = Total / Nights`,
  ["wedding-budget-calculator", "destination-wedding-savings-calculator", "anniversary-gift-budget-calculator"]
);

add(
  "wedding-registry-value-calculator",
  "Wedding Registry Value Calculator",
  "Calculate the ideal wedding registry value by estimating guest gift contributions and building a balanced registry across price ranges.",
  "Finance",
  "finance",
  "$",
  ["wedding registry", "gift registry value", "wedding gift list", "registry planning"],
  [
    '{ name: "totalGuests", label: "Total Invited Guests", type: "number", min: 10, max: 500, defaultValue: 150 }',
    '{ name: "expectedAttendance", label: "Expected Attendance (%)", type: "number", min: 30, max: 100, defaultValue: 80 }',
    '{ name: "avgGiftValue", label: "Average Gift Value ($)", type: "number", min: 25, max: 500, defaultValue: 100 }',
    '{ name: "coupleGifts", label: "% of Couples Giving One Gift", type: "number", min: 0, max: 100, defaultValue: 60 }',
    '{ name: "registryMarkup", label: "Registry Value Multiplier", type: "number", min: 1, max: 3, defaultValue: 1.5 }'
  ],
  `(inputs) => {
    const guests = inputs.totalGuests as number;
    const attendance = inputs.expectedAttendance as number / 100;
    const avgGift = inputs.avgGiftValue as number;
    const couplesPct = inputs.coupleGifts as number / 100;
    const multiplier = inputs.registryMarkup as number;
    const attendingGuests = Math.round(guests * attendance);
    const soloGivers = Math.round(attendingGuests * (1 - couplesPct));
    const coupleGivers = Math.round(attendingGuests * couplesPct / 2);
    const totalGivers = soloGivers + coupleGivers;
    const expectedGiftTotal = totalGivers * avgGift;
    const registryValue = expectedGiftTotal * multiplier;
    const lowRange = Math.round(registryValue * 0.3);
    const midRange = Math.round(registryValue * 0.45);
    const highRange = Math.round(registryValue * 0.25);
    return {
      primary: { label: "Recommended Registry Value", value: "$" + formatNumber(Math.round(registryValue)) },
      details: [
        { label: "Expected Gift Total", value: "$" + formatNumber(Math.round(expectedGiftTotal)) },
        { label: "Estimated Gift-Givers", value: formatNumber(totalGivers) },
        { label: "Budget Items (under $50)", value: "$" + formatNumber(lowRange) + " worth" },
        { label: "Mid-Range ($50-$150)", value: "$" + formatNumber(midRange) + " worth" },
        { label: "Premium ($150+)", value: "$" + formatNumber(highRange) + " worth" }
      ]
    };
  }`,
  [
    { q: "How much should a wedding registry be worth?", a: "A good rule is to register for 1.5 to 2 times the expected total gift amount. This gives guests plenty of options across price points." },
    { q: "How many items should be on a wedding registry?", a: "Register for at least as many items as you have guests. A 150-guest wedding should have 150-200 items across various price points." },
    { q: "What price range should registry items be?", a: "Include 30% budget items (under $50), 45% mid-range ($50-$150), and 25% premium items ($150+). This accommodates all guest budgets." }
  ],
  `Gift Givers = Solo Guests + (Couple Guests / 2)
Expected Gifts = Gift Givers x Average Gift Value
Registry Value = Expected Gifts x Multiplier`,
  ["wedding-budget-calculator", "wedding-guest-calculator", "wedding-favor-cost-calculator"]
);

add(
  "bridal-shower-cost-calculator",
  "Bridal Shower Cost Calculator",
  "Estimate bridal shower expenses including venue, food, decorations, games, favors, and a gift for the bride.",
  "Finance",
  "finance",
  "$",
  ["bridal shower cost", "bridal shower budget", "bridal shower planning", "pre-wedding shower"],
  [
    '{ name: "guests", label: "Number of Guests", type: "number", min: 5, max: 80, defaultValue: 25 }',
    '{ name: "venueOrHome", label: "Venue Type", type: "select", options: [{ value: "0", label: "Home/Free Venue" }, { value: "500", label: "Restaurant ($500)" }, { value: "1000", label: "Rented Space ($1000)" }], defaultValue: "0" }',
    '{ name: "foodPerPerson", label: "Food Per Person ($)", type: "number", min: 5, max: 100, defaultValue: 25 }',
    '{ name: "drinkPerPerson", label: "Drinks Per Person ($)", type: "number", min: 0, max: 50, defaultValue: 10 }',
    '{ name: "decorations", label: "Decorations ($)", type: "number", min: 0, max: 1000, defaultValue: 150 }',
    '{ name: "favors", label: "Favors Per Guest ($)", type: "number", min: 0, max: 30, defaultValue: 8 }',
    '{ name: "brideGift", label: "Gift for Bride ($)", type: "number", min: 0, max: 500, defaultValue: 75 }'
  ],
  `(inputs) => {
    const guests = inputs.guests as number;
    const venue = parseFloat(inputs.venueOrHome as unknown as string);
    const food = inputs.foodPerPerson as number;
    const drinks = inputs.drinkPerPerson as number;
    const decor = inputs.decorations as number;
    const favors = inputs.favors as number;
    const brideGift = inputs.brideGift as number;
    const totalFood = guests * (food + drinks);
    const totalFavors = guests * favors;
    const total = venue + totalFood + decor + totalFavors + brideGift;
    const perGuest = total / guests;
    return {
      primary: { label: "Total Bridal Shower Cost", value: "$" + formatNumber(Math.round(total)) },
      details: [
        { label: "Venue", value: "$" + formatNumber(venue) },
        { label: "Food and Drinks", value: "$" + formatNumber(Math.round(totalFood)) },
        { label: "Decorations", value: "$" + formatNumber(decor) },
        { label: "Favors", value: "$" + formatNumber(Math.round(totalFavors)) },
        { label: "Gift for Bride", value: "$" + formatNumber(brideGift) },
        { label: "Cost Per Guest", value: "$" + formatNumber(Math.round(perGuest)) }
      ]
    };
  }`,
  [
    { q: "How much does a bridal shower cost?", a: "Bridal showers typically cost $500 to $2,000 total, or $15 to $50 per guest. Costs vary widely based on venue choice and catering." },
    { q: "Who pays for the bridal shower?", a: "Traditionally, the maid of honor and bridesmaids host and split the cost. Sometimes the mother of the bride or other family members contribute." },
    { q: "How many guests attend a bridal shower?", a: "Bridal showers typically have 15 to 40 guests, including close friends, family members, and wedding party members." }
  ],
  `Total = Venue + (Guests x (Food + Drinks)) + Decorations + (Guests x Favors) + BrideGift
Per Guest = Total / Guests`,
  ["wedding-budget-calculator", "bridesmaid-dress-budget-calculator", "rehearsal-dinner-cost-calculator"]
);

add(
  "engagement-ring-affordability-calculator",
  "Engagement Ring Affordability Calculator",
  "Determine how much engagement ring you can afford based on income, savings, financing options, and monthly payment capacity.",
  "Finance",
  "finance",
  "$",
  ["engagement ring affordability", "ring budget", "engagement ring cost", "how much to spend on ring"],
  [
    '{ name: "annualIncome", label: "Annual Income ($)", type: "number", min: 15000, max: 500000, defaultValue: 65000 }',
    '{ name: "monthlySavings", label: "Monthly Savings Available ($)", type: "number", min: 0, max: 5000, defaultValue: 300 }',
    '{ name: "savedSoFar", label: "Already Saved ($)", type: "number", min: 0, max: 50000, defaultValue: 1000 }',
    '{ name: "monthsToSave", label: "Months Until Purchase", type: "number", min: 0, max: 24, defaultValue: 6 }',
    '{ name: "financingMonths", label: "Financing Term (0 if none)", type: "number", min: 0, max: 36, defaultValue: 0 }',
    '{ name: "financingRate", label: "Financing APR (%)", type: "number", min: 0, max: 30, defaultValue: 12 }'
  ],
  `(inputs) => {
    const income = inputs.annualIncome as number;
    const monthlySave = inputs.monthlySavings as number;
    const saved = inputs.savedSoFar as number;
    const months = inputs.monthsToSave as number;
    const finMonths = inputs.financingMonths as number;
    const apr = inputs.financingRate as number;
    const totalSaved = saved + (monthlySave * months);
    const oneMonthRule = Math.round(income / 12);
    const twoMonthRule = Math.round(income / 6);
    const threeMonthRule = Math.round(income / 4);
    let financedBudget = totalSaved;
    if (finMonths > 0) {
      const monthlyRate = apr / 100 / 12;
      if (monthlyRate > 0) {
        financedBudget = totalSaved + (monthlySave * ((1 - Math.pow(1 + monthlyRate, -finMonths)) / monthlyRate));
      } else {
        financedBudget = totalSaved + (monthlySave * finMonths);
      }
    }
    return {
      primary: { label: "Cash Budget", value: "$" + formatNumber(Math.round(totalSaved)) },
      details: [
        { label: "With Financing", value: "$" + formatNumber(Math.round(financedBudget)) },
        { label: "1-Month Salary Rule", value: "$" + formatNumber(oneMonthRule) },
        { label: "2-Month Salary Rule", value: "$" + formatNumber(twoMonthRule) },
        { label: "3-Month Salary Rule", value: "$" + formatNumber(threeMonthRule) },
        { label: "Monthly Savings Potential", value: "$" + formatNumber(monthlySave) + "/mo" }
      ]
    };
  }`,
  [
    { q: "How much should you spend on an engagement ring?", a: "The old rule of 2-3 months salary is outdated. Financial experts suggest spending what you can comfortably afford without going into debt, typically 1-2 months of income." },
    { q: "Is financing an engagement ring a good idea?", a: "0% financing can be smart if you pay it off on time. Avoid high-interest financing as a $5,000 ring at 20% APR over 3 years costs over $6,700 total." },
    { q: "What is the average engagement ring cost?", a: "The average engagement ring costs $5,000 to $7,000 in the US. However, beautiful rings are available at every price point from $500 and up." }
  ],
  `Cash Budget = AlreadySaved + (MonthlySavings x MonthsToSave)
Financed = CashBudget + MonthlySavings x ((1 - (1+r)^-n) / r)
Salary Rules: 1-month, 2-month, 3-month comparisons`,
  ["wedding-budget-calculator", "wedding-registry-value-calculator", "honeymoon-budget-planner-calculator"]
);

add(
  "wedding-dress-alteration-cost-calculator",
  "Wedding Dress Alteration Cost Calculator",
  "Estimate wedding dress alteration costs based on the type of alterations needed including hemming, bustle, bodice, and adding details.",
  "Finance",
  "finance",
  "$",
  ["wedding dress alterations", "bridal gown fitting", "dress tailoring cost", "wedding dress hemming"],
  [
    '{ name: "hemming", label: "Hemming Needed", type: "select", options: [{ value: "0", label: "None" }, { value: "100", label: "Simple Hem ($100)" }, { value: "250", label: "Multi-Layer Hem ($250)" }, { value: "400", label: "Lace/Beaded Hem ($400)" }], defaultValue: "100" }',
    '{ name: "bustleType", label: "Bustle Type", type: "select", options: [{ value: "0", label: "None" }, { value: "75", label: "Simple Bustle ($75)" }, { value: "150", label: "French Bustle ($150)" }, { value: "250", label: "Multi-Point Bustle ($250)" }], defaultValue: "75" }',
    '{ name: "bodiceWork", label: "Bodice Alterations", type: "select", options: [{ value: "0", label: "None" }, { value: "75", label: "Take In/Let Out ($75)" }, { value: "150", label: "Restructure ($150)" }, { value: "250", label: "Add Boning/Cups ($250)" }], defaultValue: "75" }',
    '{ name: "strapAdjust", label: "Strap/Sleeve Work", type: "select", options: [{ value: "0", label: "None" }, { value: "50", label: "Shorten Straps ($50)" }, { value: "150", label: "Add Sleeves ($150)" }, { value: "200", label: "Cap to Long Sleeve ($200)" }], defaultValue: "0" }',
    '{ name: "pressing", label: "Professional Pressing", type: "select", options: [{ value: "0", label: "Not Needed" }, { value: "75", label: "Standard ($75)" }, { value: "150", label: "Full Steaming ($150)" }], defaultValue: "75" }'
  ],
  `(inputs) => {
    const hem = parseFloat(inputs.hemming as unknown as string);
    const bustle = parseFloat(inputs.bustleType as unknown as string);
    const bodice = parseFloat(inputs.bodiceWork as unknown as string);
    const straps = parseFloat(inputs.strapAdjust as unknown as string);
    const pressing = parseFloat(inputs.pressing as unknown as string);
    const total = hem + bustle + bodice + straps + pressing;
    const items = [];
    if (hem > 0) items.push("Hemming");
    if (bustle > 0) items.push("Bustle");
    if (bodice > 0) items.push("Bodice");
    if (straps > 0) items.push("Straps/Sleeves");
    if (pressing > 0) items.push("Pressing");
    return {
      primary: { label: "Total Alteration Cost", value: "$" + formatNumber(Math.round(total)) },
      details: [
        { label: "Hemming", value: "$" + formatNumber(hem) },
        { label: "Bustle", value: "$" + formatNumber(bustle) },
        { label: "Bodice Work", value: "$" + formatNumber(bodice) },
        { label: "Strap/Sleeve Work", value: "$" + formatNumber(straps) },
        { label: "Professional Pressing", value: "$" + formatNumber(pressing) },
        { label: "Number of Services", value: formatNumber(items.length) }
      ]
    };
  }`,
  [
    { q: "How much do wedding dress alterations cost?", a: "Wedding dress alterations typically cost $200 to $800 total. Simple adjustments start at $50, while extensive work like adding sleeves or restructuring the bodice can exceed $500." },
    { q: "When should you start dress alterations?", a: "Begin alterations 2-3 months before the wedding. Plan for 2-3 fitting appointments spaced 2-3 weeks apart." },
    { q: "Do all wedding dresses need alterations?", a: "Nearly all wedding dresses need some alteration for a perfect fit. Even off-the-rack dresses typically need hemming and minor adjustments." }
  ],
  `Total = Hemming + Bustle + Bodice + StrapWork + Pressing`,
  ["wedding-budget-calculator", "bridesmaid-dress-budget-calculator", "bridal-shower-cost-calculator"]
);

add(
  "tent-rental-cost-calculator",
  "Tent Rental Cost Calculator",
  "Calculate tent rental costs for outdoor events based on guest count, tent style, flooring, sidewalls, and lighting options.",
  "Finance",
  "finance",
  "$",
  ["tent rental cost", "event tent rental", "wedding tent", "outdoor event tent pricing"],
  [
    '{ name: "guestCount", label: "Number of Guests", type: "number", min: 10, max: 500, defaultValue: 100 }',
    '{ name: "tentStyle", label: "Tent Style", type: "select", options: [{ value: "1", label: "Frame Tent (basic)" }, { value: "1.5", label: "Pole Tent (classic)" }, { value: "2.5", label: "Sailcloth Tent" }, { value: "3", label: "Clear-Span Structure" }], defaultValue: "1.5" }',
    '{ name: "flooring", label: "Flooring", type: "select", options: [{ value: "0", label: "None (grass)" }, { value: "3", label: "Subflooring ($3/sqft)" }, { value: "6", label: "Dance Floor ($6/sqft)" }, { value: "8", label: "Full Flooring ($8/sqft)" }], defaultValue: "3" }',
    '{ name: "sidewalls", label: "Sidewalls", type: "select", options: [{ value: "0", label: "None (open)" }, { value: "200", label: "Standard White ($200)" }, { value: "500", label: "Clear Panels ($500)" }, { value: "800", label: "French Windows ($800)" }], defaultValue: "200" }',
    '{ name: "lighting", label: "Lighting Package", type: "select", options: [{ value: "0", label: "None" }, { value: "300", label: "Basic String Lights ($300)" }, { value: "800", label: "Chandeliers ($800)" }, { value: "1500", label: "Full Design ($1500)" }], defaultValue: "300" }'
  ],
  `(inputs) => {
    const guests = inputs.guestCount as number;
    const styleMult = parseFloat(inputs.tentStyle as unknown as string);
    const floorRate = parseFloat(inputs.flooring as unknown as string);
    const sidewalls = parseFloat(inputs.sidewalls as unknown as string);
    const lighting = parseFloat(inputs.lighting as unknown as string);
    const sqftPerGuest = 15;
    const totalSqft = guests * sqftPerGuest;
    const baseCostPerSqft = 2;
    const tentCost = totalSqft * baseCostPerSqft * styleMult;
    const flooringCost = totalSqft * floorRate;
    const total = tentCost + flooringCost + sidewalls + lighting;
    const delivery = total * 0.1;
    const grandTotal = total + delivery;
    return {
      primary: { label: "Total Tent Rental Cost", value: "$" + formatNumber(Math.round(grandTotal)) },
      details: [
        { label: "Tent Rental", value: "$" + formatNumber(Math.round(tentCost)) },
        { label: "Flooring", value: "$" + formatNumber(Math.round(flooringCost)) },
        { label: "Sidewalls", value: "$" + formatNumber(sidewalls) },
        { label: "Lighting", value: "$" + formatNumber(lighting) },
        { label: "Delivery/Setup (10%)", value: "$" + formatNumber(Math.round(delivery)) },
        { label: "Total Square Footage", value: formatNumber(totalSqft) + " sqft" }
      ]
    };
  }`,
  [
    { q: "How much does a tent rental cost for a wedding?", a: "Wedding tent rentals range from $1,000 to $10,000 depending on size and style. A standard pole tent for 100 guests costs $2,000 to $4,000. Sailcloth and clear-span tents cost significantly more." },
    { q: "How much space do you need per guest in a tent?", a: "Plan for 12-15 square feet per guest for seated dinner with a dance floor. Cocktail-style events need about 8-10 square feet per guest." },
    { q: "Do you need a permit for a tent at a wedding?", a: "Many municipalities require permits for tents over a certain size (often 200+ square feet). Check with your local building department well in advance." }
  ],
  `Tent Area = Guests x 15 sqft
Tent Cost = Area x BaseCostPerSqft x StyleMultiplier
Total = TentCost + Flooring + Sidewalls + Lighting + Delivery`,
  ["event-tent-size-calculator", "reception-venue-cost-calculator", "event-lighting-cost-calculator"]
);

add(
  "event-lighting-cost-calculator",
  "Event Lighting Cost Calculator",
  "Estimate event lighting costs for weddings and parties including uplighting, string lights, spotlights, and gobo projections.",
  "Finance",
  "finance",
  "$",
  ["event lighting cost", "wedding lighting", "uplighting rental", "party lights budget"],
  [
    '{ name: "uplights", label: "Number of Uplights", type: "number", min: 0, max: 50, defaultValue: 12 }',
    '{ name: "uplightCost", label: "Cost Per Uplight ($)", type: "number", min: 10, max: 100, defaultValue: 25 }',
    '{ name: "stringLightFeet", label: "String Lights (feet)", type: "number", min: 0, max: 1000, defaultValue: 200 }',
    '{ name: "stringLightRate", label: "String Light Rate ($/ft)", type: "number", min: 1, max: 15, defaultValue: 4 }',
    '{ name: "spotlights", label: "Spotlights/Pin Spots", type: "number", min: 0, max: 20, defaultValue: 4 }',
    '{ name: "spotlightCost", label: "Cost Per Spotlight ($)", type: "number", min: 20, max: 150, defaultValue: 50 }',
    '{ name: "goboProjection", label: "Gobo/Monogram Projection", type: "select", options: [{ value: "0", label: "None" }, { value: "150", label: "Standard ($150)" }, { value: "350", label: "Custom Design ($350)" }], defaultValue: "0" }'
  ],
  `(inputs) => {
    const uplights = inputs.uplights as number;
    const uplightCost = inputs.uplightCost as number;
    const stringFeet = inputs.stringLightFeet as number;
    const stringRate = inputs.stringLightRate as number;
    const spots = inputs.spotlights as number;
    const spotCost = inputs.spotlightCost as number;
    const gobo = parseFloat(inputs.goboProjection as unknown as string);
    const totalUplighting = uplights * uplightCost;
    const totalString = stringFeet * stringRate;
    const totalSpots = spots * spotCost;
    const subtotal = totalUplighting + totalString + totalSpots + gobo;
    const setupFee = subtotal * 0.15;
    const total = subtotal + setupFee;
    return {
      primary: { label: "Total Lighting Cost", value: "$" + formatNumber(Math.round(total)) },
      details: [
        { label: "Uplighting", value: "$" + formatNumber(Math.round(totalUplighting)) },
        { label: "String Lights", value: "$" + formatNumber(Math.round(totalString)) },
        { label: "Spotlights", value: "$" + formatNumber(Math.round(totalSpots)) },
        { label: "Gobo Projection", value: "$" + formatNumber(gobo) },
        { label: "Setup/Teardown (15%)", value: "$" + formatNumber(Math.round(setupFee)) }
      ]
    };
  }`,
  [
    { q: "How much does event lighting cost?", a: "Basic uplighting packages start at $200-$500. Full lighting design with string lights, spots, and gobos ranges from $1,000 to $3,000 or more." },
    { q: "How many uplights do you need for a wedding?", a: "Plan one uplight every 6-8 feet along walls. A typical ballroom needs 12-20 uplights for full coverage." },
    { q: "What is a gobo projection?", a: "A gobo is a stencil placed in front of a light to project a pattern or monogram. Custom gobos with your initials or wedding date add a personal touch to the dance floor." }
  ],
  `Total = Uplighting + StringLights + Spotlights + Gobo + SetupFee
Setup Fee = Subtotal x 0.15`,
  ["tent-rental-cost-calculator", "reception-venue-cost-calculator", "dj-vs-band-cost-calculator"]
);

add(
  "party-rental-equipment-cost-calculator",
  "Party Rental Equipment Cost Calculator",
  "Estimate rental costs for party equipment including tables, chairs, linens, dinnerware, and glassware for your event.",
  "Finance",
  "finance",
  "$",
  ["party rental cost", "table and chair rental", "event equipment rental", "linen rental cost"],
  [
    '{ name: "guestCount", label: "Number of Guests", type: "number", min: 10, max: 500, defaultValue: 100 }',
    '{ name: "tableRental", label: "Table Rental Each ($)", type: "number", min: 5, max: 100, defaultValue: 12 }',
    '{ name: "seatsPerTable", label: "Seats Per Table", type: "number", min: 4, max: 12, defaultValue: 8 }',
    '{ name: "chairRental", label: "Chair Rental Each ($)", type: "number", min: 1, max: 20, defaultValue: 3 }',
    '{ name: "linenPerTable", label: "Linen Per Table ($)", type: "number", min: 0, max: 50, defaultValue: 15 }',
    '{ name: "placeSettingCost", label: "Place Setting Per Guest ($)", type: "number", min: 0, max: 25, defaultValue: 5 }',
    '{ name: "glasswareCost", label: "Glassware Per Guest ($)", type: "number", min: 0, max: 10, defaultValue: 3 }'
  ],
  `(inputs) => {
    const guests = inputs.guestCount as number;
    const tablePrice = inputs.tableRental as number;
    const seatsPerTable = inputs.seatsPerTable as number;
    const chairPrice = inputs.chairRental as number;
    const linenPrice = inputs.linenPerTable as number;
    const placeSetting = inputs.placeSettingCost as number;
    const glassware = inputs.glasswareCost as number;
    const tablesNeeded = Math.ceil(guests / seatsPerTable);
    const totalTables = tablesNeeded * tablePrice;
    const totalChairs = guests * chairPrice;
    const totalLinens = tablesNeeded * linenPrice;
    const totalPlaceSettings = guests * placeSetting;
    const totalGlassware = guests * glassware;
    const subtotal = totalTables + totalChairs + totalLinens + totalPlaceSettings + totalGlassware;
    const delivery = subtotal * 0.1;
    const total = subtotal + delivery;
    return {
      primary: { label: "Total Rental Cost", value: "$" + formatNumber(Math.round(total)) },
      details: [
        { label: "Tables (" + tablesNeeded + ")", value: "$" + formatNumber(Math.round(totalTables)) },
        { label: "Chairs (" + guests + ")", value: "$" + formatNumber(Math.round(totalChairs)) },
        { label: "Linens", value: "$" + formatNumber(Math.round(totalLinens)) },
        { label: "Place Settings", value: "$" + formatNumber(Math.round(totalPlaceSettings)) },
        { label: "Glassware", value: "$" + formatNumber(Math.round(totalGlassware)) },
        { label: "Delivery/Pickup (10%)", value: "$" + formatNumber(Math.round(delivery)) }
      ]
    };
  }`,
  [
    { q: "How much does party equipment rental cost?", a: "Basic table and chair rental runs $5-$15 per person. Adding linens, dinnerware, and glassware brings it to $15-$40 per person depending on quality." },
    { q: "When should you book party rentals?", a: "Book event rentals 3-6 months in advance, especially for peak wedding season (May-October). Last-minute bookings may have limited inventory and higher prices." },
    { q: "What is included in a place setting rental?", a: "A standard place setting includes a dinner plate, salad plate, fork, knife, spoon, and napkin. Charger plates and specialty utensils cost extra." }
  ],
  `Tables = ceil(Guests / SeatsPerTable) x TablePrice
Chairs = Guests x ChairPrice
Total = Tables + Chairs + Linens + PlaceSettings + Glassware + Delivery`,
  ["event-catering-calculator", "reception-venue-cost-calculator", "tent-rental-cost-calculator"]
);

add(
  "wedding-favor-cost-calculator",
  "Wedding Favor Cost Calculator",
  "Calculate the total cost of wedding favors including per-item cost, packaging, personalization, and shipping for DIY or purchased options.",
  "Finance",
  "finance",
  "$",
  ["wedding favor cost", "party favors budget", "wedding gifts for guests", "favor packaging cost"],
  [
    '{ name: "guestCount", label: "Number of Guests", type: "number", min: 10, max: 500, defaultValue: 120 }',
    '{ name: "favorType", label: "Favor Type", type: "select", options: [{ value: "2", label: "DIY/Homemade ($2)" }, { value: "4", label: "Standard ($4)" }, { value: "7", label: "Premium ($7)" }, { value: "12", label: "Luxury ($12)" }], defaultValue: "4" }',
    '{ name: "packagingCost", label: "Packaging Per Favor ($)", type: "number", min: 0, max: 5, defaultValue: 1 }',
    '{ name: "personalization", label: "Personalization Per Favor ($)", type: "number", min: 0, max: 5, defaultValue: 0.5 }',
    '{ name: "extraPercent", label: "Extra Favors Buffer (%)", type: "number", min: 0, max: 25, defaultValue: 10 }'
  ],
  `(inputs) => {
    const guests = inputs.guestCount as number;
    const favorCost = parseFloat(inputs.favorType as unknown as string);
    const packaging = inputs.packagingCost as number;
    const personalization = inputs.personalization as number;
    const buffer = inputs.extraPercent as number;
    const totalFavors = Math.ceil(guests * (1 + buffer / 100));
    const perFavor = favorCost + packaging + personalization;
    const totalCost = totalFavors * perFavor;
    const costPerGuest = totalCost / guests;
    return {
      primary: { label: "Total Favor Cost", value: "$" + formatNumber(Math.round(totalCost * 100) / 100) },
      details: [
        { label: "Cost Per Favor", value: "$" + formatNumber(Math.round(perFavor * 100) / 100) },
        { label: "Total Favors (with buffer)", value: formatNumber(totalFavors) },
        { label: "Favor Item Cost", value: "$" + formatNumber(favorCost) + " each" },
        { label: "Packaging Total", value: "$" + formatNumber(Math.round(totalFavors * packaging * 100) / 100) },
        { label: "Personalization Total", value: "$" + formatNumber(Math.round(totalFavors * personalization * 100) / 100) },
        { label: "Cost Per Guest", value: "$" + formatNumber(Math.round(costPerGuest * 100) / 100) }
      ]
    };
  }`,
  [
    { q: "How much should you spend on wedding favors?", a: "Most couples spend $2 to $5 per favor. The total favor budget is typically 2-3% of the overall wedding budget." },
    { q: "Do you need wedding favors for every guest?", a: "Provide one favor per guest or per couple. Order 10% extra to account for last-minute additions and table display needs." },
    { q: "What are affordable wedding favor ideas?", a: "Popular budget-friendly favors include homemade cookies, seed packets, custom matchboxes, candy bags, or small succulents. DIY options can cost under $2 each." }
  ],
  `Favors Needed = Guests x (1 + Buffer%)
Per Favor = FavorCost + Packaging + Personalization
Total = FavorsNeeded x PerFavor`,
  ["wedding-budget-calculator", "wedding-guest-calculator", "wedding-registry-value-calculator"]
);

add(
  "destination-wedding-savings-calculator",
  "Destination Wedding Savings Calculator",
  "Compare the cost of a local wedding versus a destination wedding including travel, venue, guest expenses, and potential savings.",
  "Finance",
  "finance",
  "$",
  ["destination wedding cost", "destination vs local wedding", "wedding abroad cost", "travel wedding savings"],
  [
    '{ name: "localCost", label: "Estimated Local Wedding Cost ($)", type: "number", min: 5000, max: 200000, defaultValue: 35000 }',
    '{ name: "destVenueCost", label: "Destination Venue Package ($)", type: "number", min: 2000, max: 100000, defaultValue: 12000 }',
    '{ name: "coupleFlights", label: "Couple Flight Cost ($)", type: "number", min: 200, max: 10000, defaultValue: 1500 }',
    '{ name: "guestsLocal", label: "Local Wedding Guest Count", type: "number", min: 20, max: 500, defaultValue: 150 }',
    '{ name: "guestsDest", label: "Destination Guest Count", type: "number", min: 5, max: 200, defaultValue: 40 }',
    '{ name: "destPerGuestCost", label: "Destination Per-Guest Cost ($)", type: "number", min: 50, max: 500, defaultValue: 150 }',
    '{ name: "extraTravel", label: "Additional Travel Costs ($)", type: "number", min: 0, max: 20000, defaultValue: 3000 }'
  ],
  `(inputs) => {
    const localCost = inputs.localCost as number;
    const destVenue = inputs.destVenueCost as number;
    const flights = inputs.coupleFlights as number;
    const guestsLocal = inputs.guestsLocal as number;
    const guestsDest = inputs.guestsDest as number;
    const destPerGuest = inputs.destPerGuestCost as number;
    const extraTravel = inputs.extraTravel as number;
    const destGuestCost = guestsDest * destPerGuest;
    const destTotal = destVenue + flights + destGuestCost + extraTravel;
    const savings = localCost - destTotal;
    const localPerGuest = localCost / guestsLocal;
    const destPerGuestTotal = destTotal / guestsDest;
    return {
      primary: { label: "Destination Wedding Cost", value: "$" + formatNumber(Math.round(destTotal)) },
      details: [
        { label: "Local Wedding Cost", value: "$" + formatNumber(localCost) },
        { label: "Savings with Destination", value: "$" + formatNumber(Math.round(savings)) },
        { label: "Destination Per Guest", value: "$" + formatNumber(Math.round(destPerGuestTotal)) },
        { label: "Local Per Guest", value: "$" + formatNumber(Math.round(localPerGuest)) },
        { label: "Guest Reduction", value: formatNumber(guestsLocal - guestsDest) + " fewer guests" }
      ]
    };
  }`,
  [
    { q: "Is a destination wedding cheaper than a local one?", a: "Destination weddings can be 30-50% cheaper than local weddings primarily because fewer guests attend. The smaller guest list significantly reduces catering and venue costs." },
    { q: "How many guests attend a destination wedding?", a: "On average, 50-70% of invited guests attend a destination wedding compared to 80-90% for a local wedding. Most destination weddings have 30-50 guests." },
    { q: "Who pays for travel to a destination wedding?", a: "Guests typically pay for their own travel and accommodation. Some couples help by negotiating group hotel rates or covering welcome dinner costs." }
  ],
  `Destination Total = VenuePackage + Flights + (DestGuests x PerGuestCost) + TravelCosts
Savings = LocalCost - DestinationTotal`,
  ["wedding-budget-calculator", "honeymoon-budget-planner-calculator", "reception-venue-cost-calculator"]
);

add(
  "wedding-guest-meal-cost-calculator",
  "Wedding Guest Meal Cost Calculator",
  "Calculate per-guest and total meal costs for your wedding including appetizers, entrees, dessert, beverages, and service charges.",
  "Finance",
  "finance",
  "$",
  ["wedding meal cost", "wedding catering per person", "reception food cost", "wedding dinner pricing"],
  [
    '{ name: "guests", label: "Number of Guests", type: "number", min: 10, max: 500, defaultValue: 120 }',
    '{ name: "serviceStyle", label: "Service Style", type: "select", options: [{ value: "1", label: "Buffet" }, { value: "1.3", label: "Plated Dinner" }, { value: "1.6", label: "Family Style" }, { value: "0.8", label: "Food Stations" }], defaultValue: "1.3" }',
    '{ name: "appetizerCost", label: "Appetizers Per Person ($)", type: "number", min: 0, max: 50, defaultValue: 12 }',
    '{ name: "entreeCost", label: "Entree Per Person ($)", type: "number", min: 15, max: 200, defaultValue: 45 }',
    '{ name: "dessertCost", label: "Dessert Per Person ($)", type: "number", min: 0, max: 50, defaultValue: 8 }',
    '{ name: "beverageCost", label: "Beverages Per Person ($)", type: "number", min: 0, max: 80, defaultValue: 25 }',
    '{ name: "serviceCharge", label: "Service Charge (%)", type: "number", min: 0, max: 25, defaultValue: 20 }'
  ],
  `(inputs) => {
    const guests = inputs.guests as number;
    const styleMult = parseFloat(inputs.serviceStyle as unknown as string);
    const appetizer = inputs.appetizerCost as number;
    const entree = inputs.entreeCost as number;
    const dessert = inputs.dessertCost as number;
    const beverage = inputs.beverageCost as number;
    const serviceRate = inputs.serviceCharge as number;
    const foodPerPerson = (appetizer + entree + dessert) * styleMult;
    const totalPerPerson = foodPerPerson + beverage;
    const subtotal = totalPerPerson * guests;
    const serviceCharge = subtotal * (serviceRate / 100);
    const total = subtotal + serviceCharge;
    const perGuest = total / guests;
    return {
      primary: { label: "Total Meal Cost", value: "$" + formatNumber(Math.round(total)) },
      details: [
        { label: "Cost Per Guest", value: "$" + formatNumber(Math.round(perGuest)) },
        { label: "Food Per Person", value: "$" + formatNumber(Math.round(foodPerPerson)) },
        { label: "Beverages Per Person", value: "$" + formatNumber(beverage) },
        { label: "Subtotal", value: "$" + formatNumber(Math.round(subtotal)) },
        { label: "Service Charge", value: "$" + formatNumber(Math.round(serviceCharge)) }
      ]
    };
  }`,
  [
    { q: "How much does a wedding meal cost per person?", a: "Wedding meals typically cost $50 to $150 per person depending on location and menu. Plated dinners cost more than buffets due to additional service staff." },
    { q: "Which is cheaper, buffet or plated dinner?", a: "Buffets are generally 15-30% less expensive than plated dinners because they require fewer servers. However, buffets may lead to more food waste." },
    { q: "How do you calculate food quantities for a wedding?", a: "Plan for 6-8 appetizer pieces per guest during cocktail hour, one full entree per guest, and 1.5 dessert servings per person." }
  ],
  `Food Per Person = (Appetizer + Entree + Dessert) x ServiceStyleMultiplier
Subtotal = (Food + Beverages) x Guests
Total = Subtotal + ServiceCharge`,
  ["event-catering-calculator", "wedding-budget-calculator", "wedding-guest-calculator"]
);

add(
  "floral-arrangement-budget-calculator",
  "Floral Arrangement Budget Calculator",
  "Plan your wedding or event floral budget with detailed costs for bridal bouquet, centerpieces, boutonnieres, ceremony flowers, and more.",
  "Finance",
  "finance",
  "$",
  ["floral budget", "wedding flowers cost", "centerpiece cost", "bouquet pricing", "event florals"],
  [
    '{ name: "bridalBouquet", label: "Bridal Bouquet ($)", type: "number", min: 50, max: 1000, defaultValue: 250 }',
    '{ name: "bridesmaidBouquets", label: "Bridesmaid Bouquets Count", type: "number", min: 0, max: 15, defaultValue: 4 }',
    '{ name: "bridesmaidBouquetCost", label: "Each Bridesmaid Bouquet ($)", type: "number", min: 30, max: 300, defaultValue: 85 }',
    '{ name: "centerpieces", label: "Number of Centerpieces", type: "number", min: 0, max: 50, defaultValue: 15 }',
    '{ name: "centerpieceCost", label: "Each Centerpiece ($)", type: "number", min: 30, max: 500, defaultValue: 100 }',
    '{ name: "boutonnieres", label: "Boutonnieres Count", type: "number", min: 0, max: 20, defaultValue: 8 }',
    '{ name: "boutonniereCost", label: "Each Boutonniere ($)", type: "number", min: 5, max: 40, defaultValue: 15 }',
    '{ name: "ceremonyCost", label: "Ceremony Florals ($)", type: "number", min: 0, max: 5000, defaultValue: 500 }'
  ],
  `(inputs) => {
    const bridal = inputs.bridalBouquet as number;
    const bmCount = inputs.bridesmaidBouquets as number;
    const bmCost = inputs.bridesmaidBouquetCost as number;
    const cpCount = inputs.centerpieces as number;
    const cpCost = inputs.centerpieceCost as number;
    const boutCount = inputs.boutonnieres as number;
    const boutCost = inputs.boutonniereCost as number;
    const ceremony = inputs.ceremonyCost as number;
    const totalBridesmaid = bmCount * bmCost;
    const totalCenterpieces = cpCount * cpCost;
    const totalBoutonnieres = boutCount * boutCost;
    const total = bridal + totalBridesmaid + totalCenterpieces + totalBoutonnieres + ceremony;
    return {
      primary: { label: "Total Floral Budget", value: "$" + formatNumber(Math.round(total)) },
      details: [
        { label: "Bridal Bouquet", value: "$" + formatNumber(bridal) },
        { label: "Bridesmaid Bouquets", value: "$" + formatNumber(Math.round(totalBridesmaid)) },
        { label: "Centerpieces", value: "$" + formatNumber(Math.round(totalCenterpieces)) },
        { label: "Boutonnieres", value: "$" + formatNumber(Math.round(totalBoutonnieres)) },
        { label: "Ceremony Florals", value: "$" + formatNumber(ceremony) }
      ]
    };
  }`,
  [
    { q: "How much do wedding flowers cost on average?", a: "The average wedding floral budget is $2,000 to $5,000. Centerpieces and the bridal bouquet are the largest expenses, while boutonnieres and corsages are modest." },
    { q: "How can you save on wedding flowers?", a: "Choose in-season flowers, use greenery-heavy designs, repurpose ceremony arrangements at the reception, and consider non-floral elements like candles or lanterns for centerpieces." },
    { q: "How many centerpieces do you need for a wedding?", a: "You need one centerpiece per guest table. For 100-150 guests with tables of 8-10, plan for 12-18 centerpieces." }
  ],
  `Total = BridalBouquet + (BridesmaidCount x BridesmaidCost) + (Centerpieces x CenterpieceCost) + (Boutonnieres x BoutonniereCost) + CeremonyFlorals`,
  ["wedding-flower-calculator", "wedding-budget-calculator", "reception-venue-cost-calculator"]
);

add(
  "wedding-cake-cost-estimator",
  "Wedding Cake Cost Estimator",
  "Estimate detailed wedding cake costs based on servings, tiers, filling options, fondant versus buttercream, and specialty decorations.",
  "Finance",
  "finance",
  "$",
  ["wedding cake cost", "tiered cake pricing", "cake per serving cost", "wedding dessert budget"],
  [
    '{ name: "servings", label: "Number of Servings", type: "number", min: 10, max: 500, defaultValue: 120 }',
    '{ name: "tiers", label: "Number of Tiers", type: "number", min: 1, max: 7, defaultValue: 3 }',
    '{ name: "icingType", label: "Icing Type", type: "select", options: [{ value: "1", label: "Buttercream" }, { value: "1.5", label: "Fondant" }, { value: "1.8", label: "Ganache" }], defaultValue: "1" }',
    '{ name: "fillingUpgrade", label: "Premium Filling", type: "select", options: [{ value: "0", label: "Standard (included)" }, { value: "1", label: "Fruit Curd (+$1/serving)" }, { value: "2", label: "Mousse (+$2/serving)" }, { value: "3", label: "Specialty (+$3/serving)" }], defaultValue: "0" }',
    '{ name: "decorLevel", label: "Decoration Level", type: "select", options: [{ value: "0", label: "Simple/Minimal" }, { value: "200", label: "Fresh Flowers ($200)" }, { value: "400", label: "Sugar Flowers ($400)" }, { value: "800", label: "Elaborate Design ($800)" }], defaultValue: "200" }',
    '{ name: "delivery", label: "Delivery and Setup ($)", type: "number", min: 0, max: 500, defaultValue: 100 }'
  ],
  `(inputs) => {
    const servings = inputs.servings as number;
    const tiers = inputs.tiers as number;
    const icingMult = parseFloat(inputs.icingType as unknown as string);
    const filling = parseFloat(inputs.fillingUpgrade as unknown as string);
    const decor = parseFloat(inputs.decorLevel as unknown as string);
    const delivery = inputs.delivery as number;
    const basePerServing = 4 + (tiers * 0.75);
    const cakeCost = servings * basePerServing * icingMult;
    const fillingCost = servings * filling;
    const total = cakeCost + fillingCost + decor + delivery;
    const perServing = total / servings;
    return {
      primary: { label: "Total Cake Cost", value: "$" + formatNumber(Math.round(total)) },
      details: [
        { label: "Base Cake Cost", value: "$" + formatNumber(Math.round(cakeCost)) },
        { label: "Filling Upgrade", value: "$" + formatNumber(Math.round(fillingCost)) },
        { label: "Decorations", value: "$" + formatNumber(decor) },
        { label: "Delivery and Setup", value: "$" + formatNumber(delivery) },
        { label: "Cost Per Serving", value: "$" + formatNumber(Math.round(perServing * 100) / 100) }
      ]
    };
  }`,
  [
    { q: "How much does a wedding cake cost per serving?", a: "Wedding cakes typically cost $4 to $12 per serving. Simple buttercream designs start lower, while fondant cakes with elaborate details cost $8 to $15 per slice." },
    { q: "How many tiers do you need for a wedding cake?", a: "A 3-tier cake serves 75-100 guests. For 150+ guests, consider a 4-5 tier cake or a smaller display cake with additional sheet cakes for serving." },
    { q: "Is fondant or buttercream more expensive?", a: "Fondant is typically 30-50% more expensive than buttercream due to the labor-intensive application process. Buttercream is more popular for taste, fondant for smooth visual appeal." }
  ],
  `Base Per Serving = $4 + (Tiers x $0.75)
Cake Cost = Servings x BasePerServing x IcingMultiplier
Total = CakeCost + FillingUpgrade + Decorations + Delivery`,
  ["wedding-cake-calculator", "wedding-budget-calculator", "event-catering-calculator"]
);

add(
  "wedding-invitation-quantity-calculator",
  "Wedding Invitation Quantity Calculator",
  "Calculate exactly how many wedding invitations to order based on guest list, household groupings, vendor copies, and keepsake extras.",
  "Everyday",
  "everyday",
  "~",
  ["invitation quantity", "how many invitations", "wedding stationery count", "save the date quantity"],
  [
    '{ name: "totalGuests", label: "Total Guest Count", type: "number", min: 10, max: 500, defaultValue: 150 }',
    '{ name: "households", label: "Number of Households", type: "number", min: 5, max: 400, defaultValue: 95 }',
    '{ name: "vendorCopies", label: "Vendor Copies Needed", type: "number", min: 0, max: 20, defaultValue: 3 }',
    '{ name: "keepsakeExtras", label: "Keepsake/Extra Copies", type: "number", min: 0, max: 20, defaultValue: 5 }',
    '{ name: "errorBuffer", label: "Error Buffer (%)", type: "number", min: 0, max: 25, defaultValue: 10 }',
    '{ name: "costPerInvite", label: "Cost Per Invitation Suite ($)", type: "number", min: 1, max: 30, defaultValue: 4 }'
  ],
  `(inputs) => {
    const guests = inputs.totalGuests as number;
    const households = inputs.households as number;
    const vendorCopies = inputs.vendorCopies as number;
    const keepsakes = inputs.keepsakeExtras as number;
    const buffer = inputs.errorBuffer as number;
    const costEach = inputs.costPerInvite as number;
    const baseInvitations = households;
    const bufferQty = Math.ceil(households * (buffer / 100));
    const totalInvitations = baseInvitations + vendorCopies + keepsakes + bufferQty;
    const totalCost = totalInvitations * costEach;
    const postageCost = totalInvitations * 0.68;
    return {
      primary: { label: "Total Invitations to Order", value: formatNumber(totalInvitations) },
      details: [
        { label: "Household Invitations", value: formatNumber(baseInvitations) },
        { label: "Buffer Copies", value: formatNumber(bufferQty) },
        { label: "Vendor + Keepsake", value: formatNumber(vendorCopies + keepsakes) },
        { label: "Printing Cost", value: "$" + formatNumber(Math.round(totalCost)) },
        { label: "Estimated Postage", value: "$" + formatNumber(Math.round(postageCost * 100) / 100) },
        { label: "Total Stationery Cost", value: "$" + formatNumber(Math.round(totalCost + postageCost)) }
      ]
    };
  }`,
  [
    { q: "How do you determine the number of wedding invitations?", a: "Count households, not individual guests. A couple living together gets one invitation. Add 10% extra for mistakes, plus a few for keepsakes and vendors." },
    { q: "When should wedding invitations be sent?", a: "Mail invitations 6-8 weeks before the wedding. Destination weddings should send 8-12 weeks in advance. Save-the-dates go out 6-8 months early." },
    { q: "What should be included in a wedding invitation suite?", a: "A full suite includes the invitation, RSVP card with envelope, details/reception card, and outer and inner envelopes. Some add maps, accommodation cards, or meal choice cards." }
  ],
  `Total Invitations = Households + ceil(Households x Buffer%) + VendorCopies + Keepsakes
Printing Cost = TotalInvitations x CostPerInvite
Postage = TotalInvitations x $0.68`,
  ["wedding-invitation-calculator", "wedding-guest-calculator", "wedding-budget-calculator"]
);

add(
  "wedding-transportation-cost-calculator",
  "Wedding Transportation Cost Calculator",
  "Estimate wedding day transportation costs for the couple, bridal party, and guest shuttles including limos, party buses, and car services.",
  "Finance",
  "finance",
  "$",
  ["wedding transportation", "wedding limo cost", "party bus rental", "guest shuttle cost"],
  [
    '{ name: "coupleTransport", label: "Couple Vehicle Type", type: "select", options: [{ value: "300", label: "Sedan ($300)" }, { value: "600", label: "Limousine ($600)" }, { value: "900", label: "Vintage/Luxury ($900)" }, { value: "150", label: "Personal Vehicle ($150)" }], defaultValue: "600" }',
    '{ name: "bridalPartySize", label: "Bridal Party Size", type: "number", min: 0, max: 20, defaultValue: 10 }',
    '{ name: "partyTransport", label: "Party Transport Type", type: "select", options: [{ value: "0", label: "Not Needed" }, { value: "400", label: "SUV Limos ($400)" }, { value: "800", label: "Party Bus ($800)" }, { value: "300", label: "Sedan Service ($300)" }], defaultValue: "400" }',
    '{ name: "guestShuttles", label: "Guest Shuttles Needed", type: "number", min: 0, max: 5, defaultValue: 1 }',
    '{ name: "shuttleCost", label: "Cost Per Shuttle ($)", type: "number", min: 0, max: 2000, defaultValue: 500 }',
    '{ name: "hours", label: "Total Service Hours", type: "number", min: 2, max: 12, defaultValue: 6 }'
  ],
  `(inputs) => {
    const coupleVehicle = parseFloat(inputs.coupleTransport as unknown as string);
    const partySize = inputs.bridalPartySize as number;
    const partyVehicle = parseFloat(inputs.partyTransport as unknown as string);
    const shuttleCount = inputs.guestShuttles as number;
    const shuttleCost = inputs.shuttleCost as number;
    const hours = inputs.hours as number;
    const coupleTotal = coupleVehicle;
    const partyTotal = partyVehicle;
    const shuttleTotal = shuttleCount * shuttleCost;
    const gratuity = (coupleTotal + partyTotal + shuttleTotal) * 0.18;
    const total = coupleTotal + partyTotal + shuttleTotal + gratuity;
    return {
      primary: { label: "Total Transportation Cost", value: "$" + formatNumber(Math.round(total)) },
      details: [
        { label: "Couple Vehicle", value: "$" + formatNumber(coupleVehicle) },
        { label: "Bridal Party Transport", value: "$" + formatNumber(partyVehicle) },
        { label: "Guest Shuttles", value: "$" + formatNumber(Math.round(shuttleTotal)) },
        { label: "Gratuity (18%)", value: "$" + formatNumber(Math.round(gratuity)) },
        { label: "Service Hours", value: formatNumber(hours) + " hours" }
      ]
    };
  }`,
  [
    { q: "How much does wedding transportation cost?", a: "Wedding transportation typically costs $500 to $2,500. A single limousine costs $400-$800, party buses $600-$1,200, and guest shuttles $300-$600 each." },
    { q: "Do you need guest shuttles for a wedding?", a: "Guest shuttles are recommended when the ceremony and reception are at different locations, or when parking is limited. They also help ensure guest safety when alcohol is served." },
    { q: "How much should you tip wedding drivers?", a: "Standard gratuity for wedding drivers is 15-20% of the total fare. Some companies include gratuity in the contract, so always check before adding extra." }
  ],
  `Total = CoupleVehicle + PartyTransport + (Shuttles x ShuttleCost) + Gratuity
Gratuity = (CoupleVehicle + PartyTransport + ShuttleCost) x 18%`,
  ["wedding-budget-calculator", "reception-venue-cost-calculator", "destination-wedding-savings-calculator"]
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
fs.writeFileSync(path.join(__dirname, 'new-imports-batch14.txt'), newImports.join('\n'));
fs.writeFileSync(path.join(__dirname, 'new-regs-batch14.txt'), newRegs.join('\n'));
console.log(`Imports saved to: scripts/new-imports-batch14.txt`);
console.log(`Registry saved to: scripts/new-regs-batch14.txt`);
