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
