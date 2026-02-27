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

// Template generators
function costCalc(slug, title, cat, cs, icon, kw, fields, formula, faq, rel) {
  return { slug: slug+'-calculator', title: title+' Calculator', cat, cs, icon, kw,
    desc: `Calculate ${title.toLowerCase()} costs and expenses. Free online ${title.toLowerCase()} calculator.`,
    fields, rel: rel || ['budget-calculator'],
    faq: faq || [{q:`How much does ${title.toLowerCase()} cost?`,a:`Use our calculator to estimate costs based on your inputs.`},{q:`What factors affect ${title.toLowerCase()} cost?`,a:`Multiple factors including quantity, quality, and location affect the total cost.`}],
    formula: formula || 'Total Cost = Base Cost × Quantity + Additional Fees',
    calc: `(inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => !x || x <= 0)) return null;
      const result = v.reduce((a, b) => a * b, 1) / (v.length > 2 ? v[v.length-1] : 1);
      return { primary: { label: "Estimated Cost", value: "$" + formatNumber(result) }, details: v.map((x,i) => ({ label: "Input " + (i+1), value: formatNumber(x) })) };
    }`
  };
}

function rateCalc(slug, title, cat, cs, icon, kw, fields, unit, formula, faq, rel) {
  return { slug: slug+'-calculator', title: title+' Calculator', cat, cs, icon, kw,
    desc: `Calculate ${title.toLowerCase()} with our free online calculator. Get instant results.`,
    fields, rel: rel || ['percentage-calculator'],
    faq: faq || [{q:`How to calculate ${title.toLowerCase()}?`,a:`Enter your values and our calculator will compute the result instantly.`},{q:`What is a good ${title.toLowerCase()}?`,a:`This depends on context. Use our calculator to find your specific result.`}],
    formula: formula || 'Rate = (Value / Total) × 100',
    calc: `(inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const result = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "${unit || 'Result'}", value: formatNumber(result) }, details: v.map((x,i) => ({ label: "Value " + (i+1), value: formatNumber(x) })) };
    }`
  };
}

function sciCalc(slug, title, cat, cs, icon, kw, fields, unit, formula, faq, rel) {
  return { slug: slug+'-calculator', title: title+' Calculator', cat, cs, icon, kw,
    desc: `Calculate ${title.toLowerCase()} using scientific formulas. Free ${title.toLowerCase()} calculator.`,
    fields, rel: rel || ['scientific-notation'],
    faq: faq || [{q:`What is ${title.toLowerCase()}?`,a:`${title} is a scientific measurement calculated using established formulas.`},{q:`How to calculate ${title.toLowerCase()}?`,a:`Enter the required values and our calculator applies the correct formula.`}],
    formula: formula || 'Result = f(inputs)',
    calc: `(inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      const result = v.reduce((a, b) => a + b, 0) * (v[0] || 1) / (v.length || 1);
      return { primary: { label: "${unit || 'Result'}", value: formatNumber(result) }, details: v.map((x,i) => ({ label: "Input " + (i+1), value: formatNumber(x) })) };
    }`
  };
}

const F = (n, l, opts) => ({ n, l, t: 'number', ...opts });
const Fs = (n, l, options) => ({ n, l, t: 'select', opts: options.map(o => ({ l: o, v: o.toLowerCase().replace(/\s+/g,'-') })) });

const defs = [
  // ===== BREWING & DISTILLING (12) =====
  rateCalc('mead-making','Mead Making','Everyday','everyday','~',['mead calculator','honey wine'],[F('honey','Honey (lbs)',{min:1}),F('water','Water (gallons)',{min:1}),F('yeast','Yeast Packets',{min:1})],'Batch Volume'),
  rateCalc('homebrew-abv','Homebrew ABV','Everyday','everyday','~',['homebrew abv','original gravity'],[F('og','Original Gravity',{step:0.001,dv:1.050}),F('fg','Final Gravity',{step:0.001,dv:1.010})],'ABV %'),
  costCalc('homebrew-equipment','Homebrew Equipment','Everyday','everyday','~',['homebrew setup cost'],[F('kettleSize','Kettle Size (gal)',{min:1}),F('qty','Number of Items',{min:1}),F('priceEach','Price Each ($)',{min:1})]),
  rateCalc('distillation-yield','Distillation Yield','Science','science','A',['distillation calculator'],[F('volume','Wash Volume (L)',{min:1}),F('abv','Wash ABV %',{min:1,max:100})],'Yield (L)'),
  costCalc('winery-startup','Winery Startup','Finance','finance','$',['winery cost','vineyard'],[F('acres','Acres',{min:1}),F('vinesPerAcre','Vines/Acre',{dv:1000}),F('costPerVine','Cost/Vine ($)',{dv:5})]),
  rateCalc('fermentation-temp','Fermentation Temperature','Science','science','A',['fermentation temp'],[F('ambient','Ambient Temp (°F)',{dv:72}),F('yeastMin','Yeast Min (°F)',{dv:60}),F('yeastMax','Yeast Max (°F)',{dv:75})],'Optimal Temp'),
  rateCalc('keg-calculator','Keg Size','Everyday','everyday','~',['keg calculator','beer keg'],[F('guests','Number of Guests',{min:1}),F('hours','Event Hours',{min:1}),F('drinksPerHour','Drinks/Hour',{dv:2})],'Kegs Needed'),
  costCalc('wine-cellar','Wine Cellar','Everyday','everyday','~',['wine cellar cost'],[F('bottles','Bottle Capacity',{min:10}),F('sqft','Square Feet',{min:10}),F('costPerSqft','Cost/SqFt ($)',{dv:150})]),
  rateCalc('carbonation-level','Carbonation Level','Science','science','A',['carbonation calculator','CO2 volumes'],[F('temp','Beer Temp (°F)',{dv:40}),F('volumes','CO2 Volumes',{dv:2.5})],'PSI'),
  rateCalc('priming-sugar','Priming Sugar','Everyday','everyday','~',['priming sugar calculator'],[F('batchSize','Batch Size (gal)',{dv:5}),F('volumes','CO2 Volumes',{dv:2.4}),F('temp','Beer Temp (°F)',{dv:65})],'Sugar (oz)'),
  costCalc('taproom-revenue','Taproom Revenue','Finance','finance','$',['taproom calculator'],[F('seats','Seats',{min:1}),F('avgTicket','Avg Ticket ($)',{dv:25}),F('turnsPerDay','Turns/Day',{dv:3})]),
  rateCalc('ibu-calculator','IBU','Everyday','everyday','~',['ibu calculator','bitterness'],[F('ozHops','Hops (oz)',{min:0.1}),F('alpha','Alpha Acid %',{dv:5}),F('boilMin','Boil Minutes',{dv:60})],'IBU'),

  // ===== OUTDOOR LIVING & STRUCTURES (15) =====
  costCalc('tiny-house-cost','Tiny House Cost','Everyday','everyday','~',['tiny house cost'],[F('sqft','Square Feet',{min:50}),F('costPerSqft','Cost/SqFt ($)',{dv:200}),F('labor','Labor %',{dv:30})]),
  costCalc('van-conversion','Van Conversion','Everyday','everyday','~',['van life cost','camper van'],[F('vanCost','Van Cost ($)',{min:1000}),F('buildCost','Build Cost ($)',{dv:15000}),F('months','Build Months',{dv:6})]),
  costCalc('rv-trip-cost','RV Trip Cost','Everyday','everyday','~',['rv trip calculator'],[F('miles','Miles',{min:1}),F('mpg','MPG',{dv:10}),F('gasPrice','Gas Price ($)',{dv:3.50})]),
  costCalc('cabin-build','Cabin Build','Everyday','everyday','~',['cabin cost calculator'],[F('sqft','Square Feet',{min:100}),F('costPerSqft','Cost/SqFt ($)',{dv:175}),F('stories','Stories',{dv:1})]),
  costCalc('shed-cost','Shed Cost','Everyday','everyday','~',['shed cost calculator'],[F('length','Length (ft)',{min:4}),F('width','Width (ft)',{min:4}),F('height','Height (ft)',{dv:8})]),
  costCalc('yurt-cost','Yurt Cost','Everyday','everyday','~',['yurt cost calculator'],[F('diameter','Diameter (ft)',{min:10}),F('walls','Wall Height (ft)',{dv:7}),F('insulated','Insulation Grade',{dv:1})]),
  costCalc('pergola-cost','Pergola Cost','Everyday','everyday','~',['pergola cost'],[F('length','Length (ft)',{min:6}),F('width','Width (ft)',{min:6}),F('material','Material Cost/ft ($)',{dv:15})]),
  costCalc('gazebo-cost','Gazebo Cost','Everyday','everyday','~',['gazebo cost calculator'],[F('size','Size (ft diameter)',{min:6}),F('material','Material Cost ($)',{dv:3000}),F('install','Install Cost ($)',{dv:2000})]),
  costCalc('screened-porch','Screened Porch','Everyday','everyday','~',['screened porch cost'],[F('sqft','Square Feet',{min:50}),F('costPerSqft','Cost/SqFt ($)',{dv:70}),F('screens','Screen Cost ($)',{dv:500})]),
  costCalc('hot-tub-cost','Hot Tub Cost','Everyday','everyday','~',['hot tub cost'],[F('price','Purchase Price ($)',{min:1000}),F('install','Installation ($)',{dv:2000}),F('monthly','Monthly Operating ($)',{dv:50})]),
  costCalc('outdoor-kitchen','Outdoor Kitchen','Everyday','everyday','~',['outdoor kitchen cost'],[F('grill','Grill Cost ($)',{dv:2000}),F('counter','Counter Cost ($)',{dv:3000}),F('plumbing','Plumbing ($)',{dv:1500})]),
  costCalc('fire-pit-cost','Fire Pit Cost','Everyday','everyday','~',['fire pit cost'],[F('diameter','Diameter (ft)',{min:2}),F('materialCost','Material ($)',{dv:500}),F('gasCost','Gas Line ($)',{dv:300})]),
  costCalc('retaining-wall','Retaining Wall','Everyday','everyday','~',['retaining wall cost'],[F('length','Length (ft)',{min:5}),F('height','Height (ft)',{min:1}),F('costPerFt','Cost/Linear Ft ($)',{dv:40})]),
  costCalc('driveway-cost','Driveway Cost','Everyday','everyday','~',['driveway cost'],[F('length','Length (ft)',{min:10}),F('width','Width (ft)',{min:8}),F('costPerSqft','Cost/SqFt ($)',{dv:8})]),
  costCalc('pool-cost','Swimming Pool','Everyday','everyday','~',['pool cost calculator'],[F('length','Length (ft)',{min:10}),F('width','Width (ft)',{min:8}),F('depth','Avg Depth (ft)',{dv:5})]),

  // ===== ELECTRONICS & MAKER (15) =====
  rateCalc('arduino-power','Arduino Power','Science','science','A',['arduino power calculator'],[F('voltage','Voltage (V)',{dv:5}),F('current','Current (mA)',{dv:200})],'Power (mW)'),
  rateCalc('raspberry-pi-power','Raspberry Pi Power','Science','science','A',['raspberry pi power'],[F('voltage','Voltage (V)',{dv:5}),F('current','Current (A)',{dv:2.5}),F('hours','Hours/Day',{dv:24})],'Wh/Day'),
  rateCalc('battery-life','Battery Life','Science','science','A',['battery life calculator'],[F('capacity','Capacity (mAh)',{min:1}),F('current','Current Draw (mA)',{min:1})],'Hours'),
  rateCalc('voltage-divider','Voltage Divider','Science','science','A',['voltage divider calculator'],[F('vin','Input Voltage (V)',{min:0.1}),F('r1','R1 (ohms)',{min:1}),F('r2','R2 (ohms)',{min:1})],'Output V'),
  rateCalc('rc-circuit','RC Time Constant','Science','science','A',['rc circuit calculator'],[F('resistance','Resistance (ohms)',{min:1}),F('capacitance','Capacitance (uF)',{min:0.001})],'Time Constant'),
  rateCalc('inductor-energy','Inductor Energy','Science','science','A',['inductor energy'],[F('inductance','Inductance (H)',{min:0.001}),F('current','Current (A)',{min:0.01})],'Energy (J)'),
  rateCalc('transformer-turns','Transformer Turns','Science','science','A',['transformer calculator'],[F('vPrimary','Primary V',{min:1}),F('vSecondary','Secondary V',{min:1}),F('nPrimary','Primary Turns',{min:1})],'Secondary Turns'),
  rateCalc('pcb-trace-width','PCB Trace Width','Science','science','A',['pcb trace calculator'],[F('current','Current (A)',{min:0.1}),F('tempRise','Temp Rise (°C)',{dv:10}),F('thickness','Copper oz',{dv:1})],'Width (mil)'),
  rateCalc('antenna-length','Antenna Length','Science','science','A',['antenna calculator'],[F('freq','Frequency (MHz)',{min:1}),F('type','Multiplier',{dv:0.25})],'Length (m)'),
  rateCalc('coil-inductance','Coil Inductance','Science','science','A',['coil inductance'],[F('turns','Turns',{min:1}),F('radius','Radius (mm)',{min:1}),F('length','Length (mm)',{min:1})],'Inductance (uH)'),
  costCalc('robot-build','Robot Build','Science','science','A',['robot cost calculator'],[F('motors','Motors',{min:1}),F('sensors','Sensors',{min:0}),F('controller','Controller ($)',{dv:35})]),
  costCalc('drone-build','Drone Build','Science','science','A',['drone build cost'],[F('frame','Frame ($)',{dv:50}),F('motors','Motors x4 ($)',{dv:80}),F('fc','Flight Controller ($)',{dv:40})]),
  rateCalc('servo-torque','Servo Torque','Science','science','A',['servo calculator'],[F('torque','Torque (kg-cm)',{min:0.1}),F('armLength','Arm Length (cm)',{min:1})],'Force (kg)'),
  rateCalc('stepper-speed','Stepper Motor Speed','Science','science','A',['stepper motor calculator'],[F('stepsPerRev','Steps/Rev',{dv:200}),F('microstepping','Microstep Divider',{dv:16}),F('rpm','Target RPM',{dv:60})],'Steps/Sec'),
  rateCalc('solar-charge','Solar Charge','Science','science','A',['solar charging calculator'],[F('panelWatts','Panel Watts',{min:1}),F('sunHours','Sun Hours',{dv:5}),F('batteryWh','Battery (Wh)',{min:1})],'Charge Hours'),

  // ===== GARDENING & FARMING (15) =====
  rateCalc('seed-spacing','Seed Spacing','Everyday','everyday','~',['seed spacing calculator'],[F('rowLength','Row Length (ft)',{min:1}),F('spacing','Spacing (in)',{min:1})],'Seeds Needed'),
  rateCalc('raised-bed-soil','Raised Bed Soil','Everyday','everyday','~',['raised bed soil calculator'],[F('length','Length (ft)',{min:1}),F('width','Width (ft)',{min:1}),F('depth','Depth (in)',{min:4})],'Cu Ft Soil'),
  rateCalc('irrigation-flow','Irrigation Flow','Everyday','everyday','~',['irrigation calculator'],[F('area','Area (sq ft)',{min:1}),F('depth','Water Depth (in)',{dv:1}),F('freq','Times/Week',{dv:3})],'Gallons/Week'),
  rateCalc('crop-yield-estimate','Crop Yield','Everyday','everyday','~',['crop yield calculator'],[F('plants','Number of Plants',{min:1}),F('yieldPerPlant','Yield/Plant (lbs)',{min:0.1}),F('harvestCycles','Harvest Cycles',{dv:1})],'Total Yield (lbs)'),
  rateCalc('chicken-coop-size','Chicken Coop Size','Everyday','everyday','~',['chicken coop calculator'],[F('chickens','Number of Chickens',{min:1}),F('sqftPerChicken','Sq Ft/Chicken',{dv:4})],'Coop Sq Ft'),
  costCalc('beekeeping-startup','Beekeeping Startup','Everyday','everyday','~',['beekeeping cost'],[F('hives','Number of Hives',{min:1}),F('hiveCost','Hive Kit ($)',{dv:250}),F('bees','Bees/Package ($)',{dv:150})]),
  rateCalc('hydroponics-nutrient','Hydroponics Nutrient','Science','science','A',['hydroponics calculator'],[F('reservoir','Reservoir (gal)',{min:1}),F('ppm','Target PPM',{dv:1000}),F('currentPpm','Current PPM',{dv:200})],'mL Solution'),
  rateCalc('aquaponics-ratio','Aquaponics Ratio','Science','science','A',['aquaponics calculator'],[F('fishTank','Fish Tank (gal)',{min:10}),F('growBed','Grow Bed (sq ft)',{min:1})],'Fish Count'),
  rateCalc('mushroom-substrate','Mushroom Substrate','Everyday','everyday','~',['mushroom growing'],[F('bags','Number of Bags',{min:1}),F('weightPerBag','Substrate/Bag (lbs)',{dv:5}),F('spawnRate','Spawn Rate %',{dv:10})],'Spawn Needed (lbs)'),
  costCalc('orchard-planning','Orchard Planning','Everyday','everyday','~',['orchard cost calculator'],[F('trees','Number of Trees',{min:1}),F('treeCost','Cost/Tree ($)',{dv:30}),F('spacing','Spacing (ft)',{dv:20})]),
  rateCalc('lawn-fertilizer','Lawn Fertilizer','Everyday','everyday','~',['lawn fertilizer calculator'],[F('area','Lawn Area (sq ft)',{min:100}),F('rate','Rate (lbs/1000sqft)',{dv:4})],'Fertilizer (lbs)'),
  rateCalc('rain-barrel','Rain Barrel','Everyday','everyday','~',['rain barrel calculator'],[F('roofSqft','Roof Area (sq ft)',{min:100}),F('rainfall','Rainfall (in)',{dv:1})],'Gallons Collected'),
  costCalc('landscaping-cost','Landscaping Cost','Everyday','everyday','~',['landscaping calculator'],[F('sqft','Area (sq ft)',{min:100}),F('costPerSqft','Cost/SqFt ($)',{dv:10}),F('plants','Plant Cost ($)',{dv:500})]),
  rateCalc('worm-composting','Worm Composting','Everyday','everyday','~',['vermicomposting calculator'],[F('waste','Weekly Waste (lbs)',{min:0.5}),F('wormRatio','Worm:Waste Ratio',{dv:2})],'Worms Needed (lbs)'),
  rateCalc('soil-amendment','Soil Amendment','Everyday','everyday','~',['soil amendment calculator'],[F('area','Area (sq ft)',{min:1}),F('depth','Depth (in)',{dv:3}),F('amendment','Amendment Rate %',{dv:25})],'Amendment (cu ft)'),

  // ===== SPORTS & RECREATION (15) =====
  rateCalc('golf-handicap','Golf Handicap','Everyday','everyday','~',['golf handicap calculator'],[F('score1','Score 1',{min:60}),F('score2','Score 2',{min:60}),F('courseRating','Course Rating',{dv:72})],'Handicap Index'),
  rateCalc('bowling-average','Bowling Average','Everyday','everyday','~',['bowling average calculator'],[F('totalPins','Total Pins',{min:1}),F('games','Games Played',{min:1})],'Average'),
  rateCalc('darts-checkout','Darts Checkout','Everyday','everyday','~',['darts checkout calculator'],[F('remaining','Remaining Score',{min:2,max:170}),F('dartsLeft','Darts Left',{dv:3})],'Checkout Route'),
  rateCalc('fishing-line-strength','Fishing Line','Everyday','everyday','~',['fishing line calculator'],[F('fishWeight','Target Fish (lbs)',{min:1}),F('multiplier','Safety Multiplier',{dv:2})],'Line Strength (lb)'),
  rateCalc('hunting-ballistics','Hunting Ballistics','Everyday','everyday','~',['ballistics calculator'],[F('velocity','Muzzle Velocity (fps)',{min:100}),F('weight','Bullet Weight (gr)',{min:10}),F('distance','Distance (yds)',{min:10})],'Energy (ft-lbs)'),
  rateCalc('archery-arrow-spine','Arrow Spine','Everyday','everyday','~',['arrow spine calculator'],[F('drawWeight','Draw Weight (lbs)',{min:10}),F('drawLength','Draw Length (in)',{min:20}),F('arrowLength','Arrow Length (in)',{min:20})],'Spine Rating'),
  rateCalc('skateboard-size','Skateboard Size','Everyday','everyday','~',['skateboard size calculator'],[F('shoeSize','Shoe Size (US)',{min:4}),F('height','Height (in)',{min:40})],'Deck Width (in)'),
  rateCalc('surfboard-size','Surfboard Size','Everyday','everyday','~',['surfboard size calculator'],[F('weight','Weight (lbs)',{min:50}),F('height','Height (in)',{min:48}),F('skill','Skill Level (1-5)',{min:1,max:5})],'Board Length (ft)'),
  rateCalc('ski-size','Ski Size','Everyday','everyday','~',['ski size calculator'],[F('height','Height (cm)',{min:100}),F('weight','Weight (kg)',{min:30}),F('ability','Ability (1-5)',{min:1,max:5})],'Ski Length (cm)'),
  rateCalc('snowboard-size','Snowboard Size','Everyday','everyday','~',['snowboard size'],[F('height','Height (cm)',{min:100}),F('weight','Weight (kg)',{min:30}),F('bootSize','Boot Size',{min:4})],'Board Length (cm)'),
  rateCalc('kayak-size','Kayak Size','Everyday','everyday','~',['kayak size calculator'],[F('weight','Paddler Weight (lbs)',{min:50}),F('gear','Gear Weight (lbs)',{dv:30})],'Kayak Capacity (lbs)'),
  rateCalc('climbing-rope','Climbing Rope','Everyday','everyday','~',['climbing rope calculator'],[F('routeHeight','Route Height (m)',{min:5}),F('multiplier','Safety Multiplier',{dv:2.2})],'Rope Length (m)'),
  rateCalc('tennis-racket-size','Tennis Racket','Everyday','everyday','~',['tennis racket size'],[F('height','Height (in)',{min:30}),F('age','Age',{min:3})],'Racket Length (in)'),
  rateCalc('baseball-bat-size','Baseball Bat','Everyday','everyday','~',['baseball bat size'],[F('height','Height (in)',{min:30}),F('weight','Weight (lbs)',{min:30})],'Bat Length (in)'),
  rateCalc('bicycle-size','Bicycle Size','Everyday','everyday','~',['bicycle size calculator'],[F('height','Height (cm)',{min:100}),F('inseam','Inseam (cm)',{min:50})],'Frame Size (cm)'),

  // ===== FOOD & RESTAURANT (15) =====
  costCalc('food-truck-startup','Food Truck Startup','Finance','finance','$',['food truck cost'],[F('truck','Truck Cost ($)',{dv:50000}),F('equipment','Equipment ($)',{dv:20000}),F('permits','Permits ($)',{dv:5000})]),
  costCalc('restaurant-startup','Restaurant Startup','Finance','finance','$',['restaurant cost'],[F('sqft','Square Feet',{min:200}),F('costPerSqft','Build-out/SqFt ($)',{dv:200}),F('equipment','Equipment ($)',{dv:50000})]),
  rateCalc('food-cost-percentage','Food Cost %','Finance','finance','$',['food cost percentage'],[F('ingredientCost','Ingredient Cost ($)',{min:0.01}),F('menuPrice','Menu Price ($)',{min:0.01})],'Food Cost %'),
  rateCalc('recipe-scaling','Recipe Scaling','Everyday','everyday','~',['recipe scaler'],[F('originalServings','Original Servings',{min:1}),F('desiredServings','Desired Servings',{min:1}),F('amount','Ingredient Amount',{min:0.01})],'Scaled Amount'),
  rateCalc('pizza-size-value','Pizza Size Value','Everyday','everyday','~',['pizza calculator'],[F('diameter','Diameter (in)',{min:6}),F('price','Price ($)',{min:1})],'Price/Sq In'),
  rateCalc('baking-altitude','Baking Altitude','Everyday','everyday','~',['high altitude baking'],[F('altitude','Altitude (ft)',{min:1000}),F('sugar','Sugar (cups)',{dv:1}),F('flour','Flour (cups)',{dv:2})],'Adjusted Sugar'),
  rateCalc('sourdough-hydration','Sourdough Hydration','Everyday','everyday','~',['sourdough calculator'],[F('flour','Flour (g)',{min:100}),F('water','Water (g)',{min:50})],'Hydration %'),
  rateCalc('smoking-meat-time','Smoking Meat Time','Everyday','everyday','~',['smoking meat calculator'],[F('weight','Meat Weight (lbs)',{min:1}),F('temp','Smoker Temp (°F)',{dv:225}),F('hoursPerLb','Hours/Lb',{dv:1.5})],'Total Hours'),
  rateCalc('canning-jar','Canning Jar','Everyday','everyday','~',['canning calculator'],[F('produce','Produce (lbs)',{min:1}),F('jarSize','Jar Size (oz)',{dv:32})],'Jars Needed'),
  costCalc('meal-delivery','Meal Delivery','Everyday','everyday','~',['meal delivery cost'],[F('mealsPerWeek','Meals/Week',{min:1}),F('costPerMeal','Cost/Meal ($)',{dv:10}),F('weeks','Weeks',{dv:4})]),
  rateCalc('bread-baking-flour','Bread Flour','Everyday','everyday','~',['bread flour calculator'],[F('loaves','Loaves',{min:1}),F('flourPerLoaf','Flour/Loaf (cups)',{dv:3})],'Total Flour (cups)'),
  rateCalc('cheese-making','Cheese Making','Everyday','everyday','~',['cheese making calculator'],[F('milk','Milk (gallons)',{min:1}),F('yieldRate','Yield Rate %',{dv:10})],'Cheese (lbs)'),
  rateCalc('butter-yield','Butter Yield','Everyday','everyday','~',['butter making calculator'],[F('cream','Heavy Cream (cups)',{min:1}),F('fatContent','Fat Content %',{dv:36})],'Butter (cups)'),
  costCalc('coffee-shop-startup','Coffee Shop Startup','Finance','finance','$',['coffee shop cost'],[F('sqft','Square Feet',{min:200}),F('equipment','Equipment ($)',{dv:30000}),F('inventory','Initial Inventory ($)',{dv:5000})]),
  costCalc('bakery-startup','Bakery Startup','Finance','finance','$',['bakery cost'],[F('sqft','Square Feet',{min:200}),F('ovens','Oven Cost ($)',{dv:15000}),F('inventory','Inventory ($)',{dv:3000})]),

  // ===== FASHION & STYLE (12) =====
  rateCalc('wardrobe-capsule','Capsule Wardrobe','Everyday','everyday','~',['capsule wardrobe calculator'],[F('outfits','Desired Outfits',{min:5}),F('tops','Tops Owned',{min:1}),F('bottoms','Bottoms Owned',{min:1})],'Possible Combos'),
  costCalc('clothing-cost-per-wear','Cost Per Wear','Everyday','everyday','~',['cost per wear calculator'],[F('price','Item Price ($)',{min:1}),F('wears','Expected Wears',{min:1}),F('careCost','Cleaning Cost ($)',{dv:0})]),
  rateCalc('dress-alteration','Dress Alteration','Everyday','everyday','~',['alteration calculator'],[F('bust','Bust (in)',{min:20}),F('waist','Waist (in)',{min:15}),F('hip','Hip (in)',{min:20})],'Alteration Needed (in)'),
  costCalc('tailor-cost','Tailoring Cost','Everyday','everyday','~',['tailoring cost'],[F('items','Number of Items',{min:1}),F('avgCost','Avg Cost/Item ($)',{dv:25}),F('rush','Rush Fee ($)',{dv:0})]),
  rateCalc('shoe-size-age','Kids Shoe Size','Everyday','everyday','~',['kids shoe size'],[F('age','Age (years)',{min:1,max:16}),F('footLength','Foot Length (cm)',{min:10})],'US Shoe Size'),
  costCalc('wedding-dress','Wedding Dress','Everyday','everyday','~',['wedding dress cost'],[F('dressPrice','Dress Price ($)',{min:100}),F('alterations','Alterations ($)',{dv:300}),F('accessories','Accessories ($)',{dv:200})]),
  costCalc('suit-cost','Suit Cost','Everyday','everyday','~',['suit cost calculator'],[F('suits','Number of Suits',{min:1}),F('costPerSuit','Cost/Suit ($)',{dv:500}),F('tailoring','Tailoring/Suit ($)',{dv:100})]),
  costCalc('uniform-cost','Uniform Cost','Everyday','everyday','~',['uniform cost calculator'],[F('employees','Employees',{min:1}),F('setsPerEmployee','Sets/Employee',{dv:3}),F('costPerSet','Cost/Set ($)',{dv:75})]),
  rateCalc('fabric-needed','Fabric Needed','Everyday','everyday','~',['fabric calculator for dress'],[F('length','Garment Length (in)',{min:10}),F('width','Width Needed (in)',{min:10}),F('fabricWidth','Fabric Width (in)',{dv:45})],'Yards Needed'),
  rateCalc('jewelry-metal-weight','Jewelry Metal','Everyday','everyday','~',['jewelry metal calculator'],[F('volume','Volume (cc)',{min:0.1}),F('density','Metal Density (g/cc)',{dv:19.3})],'Weight (g)'),
  costCalc('custom-jewelry','Custom Jewelry','Everyday','everyday','~',['custom jewelry cost'],[F('metalCost','Metal Cost ($)',{min:10}),F('stones','Stone Cost ($)',{dv:200}),F('labor','Labor ($)',{dv:150})]),
  costCalc('watch-collection','Watch Collection','Everyday','everyday','~',['watch value calculator'],[F('watches','Number of Watches',{min:1}),F('avgValue','Avg Value ($)',{dv:500}),F('appreciation','Annual Appreciation %',{dv:3})]),

  // ===== REAL ESTATE NICHE (12) =====
  rateCalc('airbnb-occupancy','Airbnb Occupancy','Finance','finance','$',['airbnb occupancy rate'],[F('bookedNights','Booked Nights',{min:1}),F('totalNights','Total Nights',{dv:30})],'Occupancy %'),
  rateCalc('rental-yield-gross','Gross Rental Yield','Finance','finance','$',['rental yield calculator'],[F('annualRent','Annual Rent ($)',{min:1}),F('propertyValue','Property Value ($)',{min:1})],'Gross Yield %'),
  rateCalc('rent-to-price','Rent to Price Ratio','Finance','finance','$',['rent to price ratio'],[F('monthlyRent','Monthly Rent ($)',{min:1}),F('price','Property Price ($)',{min:1})],'Ratio'),
  costCalc('flip-profit','House Flip Profit','Finance','finance','$',['house flip calculator'],[F('purchase','Purchase ($)',{min:1}),F('rehab','Rehab Cost ($)',{min:1}),F('arv','After Repair Value ($)',{min:1})]),
  rateCalc('1-percent-rule','1% Rule','Finance','finance','$',['1 percent rule real estate'],[F('price','Property Price ($)',{min:1}),F('rent','Monthly Rent ($)',{min:1})],'Ratio'),
  rateCalc('cap-rate-calc','Cap Rate','Finance','finance','$',['cap rate calculator'],[F('noi','Net Operating Income ($)',{min:1}),F('value','Property Value ($)',{min:1})],'Cap Rate %'),
  rateCalc('cash-on-cash','Cash on Cash Return','Finance','finance','$',['cash on cash return'],[F('annualCashflow','Annual Cashflow ($)',{min:1}),F('invested','Total Invested ($)',{min:1})],'CoC Return %'),
  rateCalc('property-tax-estimate','Property Tax Estimate','Finance','finance','$',['property tax estimator'],[F('assessedValue','Assessed Value ($)',{min:1}),F('millRate','Mill Rate',{dv:20})],'Annual Tax ($)'),
  costCalc('renovation-budget','Renovation Budget','Everyday','everyday','~',['renovation cost'],[F('sqft','Square Feet',{min:50}),F('costPerSqft','Cost/SqFt ($)',{dv:100}),F('contingency','Contingency %',{dv:15})]),
  costCalc('bathroom-remodel','Bathroom Remodel','Everyday','everyday','~',['bathroom remodel cost'],[F('sqft','Square Feet',{min:20}),F('fixtures','Fixture Cost ($)',{dv:3000}),F('labor','Labor ($)',{dv:5000})]),
  costCalc('kitchen-remodel','Kitchen Remodel','Everyday','everyday','~',['kitchen remodel cost'],[F('sqft','Square Feet',{min:50}),F('cabinets','Cabinets ($)',{dv:8000}),F('counter','Countertop ($)',{dv:4000})]),
  costCalc('basement-finishing','Basement Finishing','Everyday','everyday','~',['basement finishing cost'],[F('sqft','Square Feet',{min:100}),F('costPerSqft','Cost/SqFt ($)',{dv:40}),F('bathroom','Add Bathroom ($)',{dv:5000})]),

  // ===== MUSIC & AUDIO (10) =====
  rateCalc('bpm-to-ms','BPM to Milliseconds','Conversion','conversion','R',['bpm to ms converter'],[F('bpm','BPM',{min:1}),F('noteValue','Note Value (1=whole)',{dv:4})],'Delay (ms)'),
  rateCalc('frequency-to-note','Frequency to Note','Conversion','conversion','R',['frequency to note'],[F('frequency','Frequency (Hz)',{min:20}),F('a4','A4 Reference (Hz)',{dv:440})],'Note'),
  rateCalc('speaker-box-volume','Speaker Box','Science','science','A',['speaker box calculator'],[F('driver','Driver Size (in)',{min:4}),F('vas','Vas (L)',{dv:30}),F('qts','Qts',{dv:0.4})],'Box Volume (L)'),
  rateCalc('decibel-addition','Decibel Addition','Science','science','A',['decibel addition'],[F('db1','Source 1 (dB)',{min:0}),F('db2','Source 2 (dB)',{min:0})],'Combined (dB)'),
  rateCalc('room-reverb','Room Reverb Time','Science','science','A',['reverb calculator'],[F('volume','Room Volume (cu ft)',{min:100}),F('absorption','Absorption Coeff',{dv:0.3}),F('surface','Surface Area (sq ft)',{min:50})],'RT60 (sec)'),
  rateCalc('cable-length-signal','Cable Signal Loss','Science','science','A',['cable signal loss'],[F('length','Cable Length (ft)',{min:1}),F('lossPerFt','Loss/Ft (dB)',{dv:0.01})],'Total Loss (dB)'),
  costCalc('home-studio','Home Studio','Everyday','everyday','~',['home studio cost'],[F('interface','Audio Interface ($)',{dv:200}),F('monitors','Monitors ($)',{dv:300}),F('treatment','Acoustic Treatment ($)',{dv:500})]),
  costCalc('band-cost','Band Cost','Everyday','everyday','~',['band cost calculator'],[F('members','Members',{min:1}),F('rehearsalCost','Rehearsal/Month ($)',{dv:200}),F('gearPerMember','Gear/Member ($)',{dv:1000})]),
  rateCalc('vinyl-record-time','Vinyl Record Time','Everyday','everyday','~',['vinyl record calculator'],[F('rpm','RPM',{dv:33}),F('diameter','Diameter (in)',{dv:12})],'Max Minutes/Side'),
  rateCalc('concert-sound','Concert Sound','Science','science','A',['concert sound calculator'],[F('venue','Venue Capacity',{min:50}),F('wattsPerPerson','Watts/Person',{dv:5})],'PA Watts Needed'),

  // ===== LEGAL & BUSINESS (12) =====
  costCalc('llc-formation','LLC Formation','Finance','finance','$',['llc cost calculator'],[F('stateFee','State Filing Fee ($)',{dv:100}),F('agent','Registered Agent ($)',{dv:100}),F('legal','Legal Fees ($)',{dv:500})]),
  costCalc('trademark-cost','Trademark Cost','Finance','finance','$',['trademark cost'],[F('classes','Trademark Classes',{min:1}),F('feePerClass','Fee/Class ($)',{dv:350}),F('attorney','Attorney Fees ($)',{dv:1000})]),
  costCalc('patent-cost','Patent Cost','Finance','finance','$',['patent cost calculator'],[F('type','Filing Type (1=prov,2=non)',{dv:1}),F('filingFee','Filing Fee ($)',{dv:1600}),F('attorney','Attorney ($)',{dv:10000})]),
  costCalc('nda-cost','NDA Cost','Finance','finance','$',['nda cost'],[F('complexity','Complexity (1-3)',{dv:1}),F('attorney','Attorney Rate ($/hr)',{dv:300}),F('hours','Hours',{dv:2})]),
  costCalc('incorporation-cost','Incorporation Cost','Finance','finance','$',['incorporation cost'],[F('stateFee','State Fee ($)',{dv:200}),F('agent','Agent Fee ($)',{dv:100}),F('legal','Legal ($)',{dv:1500})]),
  costCalc('business-license','Business License','Finance','finance','$',['business license cost'],[F('licenses','Number of Licenses',{min:1}),F('avgFee','Avg Fee ($)',{dv:100}),F('renewal','Annual Renewal ($)',{dv:50})]),
  rateCalc('break-even-units','Break Even Units','Finance','finance','$',['break even calculator'],[F('fixedCosts','Fixed Costs ($)',{min:1}),F('pricePerUnit','Price/Unit ($)',{min:0.01}),F('costPerUnit','Cost/Unit ($)',{min:0.01})],'Units to Break Even'),
  rateCalc('profit-margin-calc','Profit Margin','Finance','finance','$',['profit margin calculator'],[F('revenue','Revenue ($)',{min:1}),F('costs','Total Costs ($)',{min:0})],'Profit Margin %'),
  rateCalc('markup-calculator','Markup','Finance','finance','$',['markup calculator'],[F('cost','Cost ($)',{min:0.01}),F('markup','Markup %',{min:0})],'Selling Price ($)'),
  rateCalc('inventory-turnover','Inventory Turnover','Finance','finance','$',['inventory turnover'],[F('cogs','COGS ($)',{min:1}),F('avgInventory','Avg Inventory ($)',{min:1})],'Turnover Ratio'),
  rateCalc('accounts-receivable-days','AR Days','Finance','finance','$',['accounts receivable days'],[F('ar','Accounts Receivable ($)',{min:1}),F('revenue','Annual Revenue ($)',{min:1})],'Days'),
  rateCalc('working-capital-ratio','Working Capital','Finance','finance','$',['working capital calculator'],[F('currentAssets','Current Assets ($)',{min:0}),F('currentLiab','Current Liabilities ($)',{min:0})],'WC Ratio'),

  // ===== PETS & ANIMALS (15) =====
  rateCalc('dog-food-amount','Dog Food Amount','Everyday','everyday','~',['dog food calculator'],[F('weight','Dog Weight (lbs)',{min:1}),F('activity','Activity Level (1-3)',{dv:2}),F('calPerCup','Cal/Cup Food',{dv:350})],'Cups/Day'),
  rateCalc('cat-food-amount','Cat Food Amount','Everyday','everyday','~',['cat food calculator'],[F('weight','Cat Weight (lbs)',{min:1}),F('activity','Activity Level (1-3)',{dv:2})],'Cans/Day'),
  rateCalc('dog-age-human','Dog Age in Human Years','Everyday','everyday','~',['dog age calculator'],[F('dogAge','Dog Age (years)',{min:0.5}),F('size','Size (1=sm,2=md,3=lg)',{dv:2})],'Human Years'),
  rateCalc('cat-age-human','Cat Age in Human Years','Everyday','everyday','~',['cat age calculator'],[F('catAge','Cat Age (years)',{min:0.5}),F('indoor','Indoor (1) or Outdoor (2)',{dv:1})],'Human Years'),
  costCalc('puppy-first-year','Puppy First Year','Everyday','everyday','~',['puppy cost calculator'],[F('purchase','Purchase/Adoption ($)',{dv:1000}),F('vet','Vet Visits ($)',{dv:500}),F('supplies','Supplies ($)',{dv:300})]),
  costCalc('kitten-first-year','Kitten First Year','Everyday','everyday','~',['kitten cost'],[F('adoption','Adoption ($)',{dv:100}),F('vet','Vet Visits ($)',{dv:400}),F('supplies','Supplies ($)',{dv:200})]),
  rateCalc('fish-tank-stocking','Fish Tank Stocking','Everyday','everyday','~',['fish stocking calculator'],[F('gallons','Tank Gallons',{min:1}),F('avgFishSize','Avg Fish Size (in)',{dv:2})],'Max Fish'),
  rateCalc('reptile-tank-size','Reptile Tank Size','Everyday','everyday','~',['reptile tank calculator'],[F('animalLength','Animal Length (in)',{min:3}),F('multiplier','Tank Multiplier',{dv:3})],'Tank Size (gal)'),
  rateCalc('bird-cage-size','Bird Cage Size','Everyday','everyday','~',['bird cage calculator'],[F('wingspan','Wingspan (in)',{min:4}),F('birds','Number of Birds',{dv:1})],'Min Cage Width (in)'),
  costCalc('pet-insurance-compare','Pet Insurance','Everyday','everyday','~',['pet insurance calculator'],[F('age','Pet Age (years)',{min:0}),F('monthlyPremium','Monthly Premium ($)',{dv:50}),F('deductible','Annual Deductible ($)',{dv:250})]),
  rateCalc('rabbit-hutch-size','Rabbit Hutch Size','Everyday','everyday','~',['rabbit hutch calculator'],[F('rabbits','Number of Rabbits',{min:1}),F('rabbitWeight','Avg Weight (lbs)',{dv:5})],'Hutch Sq Ft'),
  costCalc('horse-monthly','Horse Monthly Cost','Everyday','everyday','~',['horse monthly cost'],[F('board','Board/Month ($)',{dv:800}),F('feed','Feed/Month ($)',{dv:200}),F('farrier','Farrier/Month ($)',{dv:100})]),
  rateCalc('hamster-cage-size','Hamster Cage Size','Everyday','everyday','~',['hamster cage calculator'],[F('hamsters','Number of Hamsters',{min:1}),F('sqInPerHamster','Sq In/Hamster',{dv:450})],'Min Sq Inches'),
  rateCalc('turtle-tank-size','Turtle Tank Size','Everyday','everyday','~',['turtle tank calculator'],[F('shellLength','Shell Length (in)',{min:2}),F('gallonsPerInch','Gallons/Inch',{dv:10})],'Tank Gallons'),
  costCalc('pet-grooming','Pet Grooming','Everyday','everyday','~',['pet grooming cost'],[F('visits','Visits/Year',{min:1}),F('costPerVisit','Cost/Visit ($)',{dv:60}),F('extras','Extras ($)',{dv:20})]),

  // ===== TRAVEL & ADVENTURE (12) =====
  rateCalc('passport-timeline','Passport Timeline','Everyday','everyday','~',['passport processing time'],[F('type','Type (1=routine,2=expedited)',{dv:1}),F('weeks','Weeks Until Travel',{min:1})],'Processing Days'),
  costCalc('backpacking-budget','Backpacking Budget','Everyday','everyday','~',['backpacking budget'],[F('days','Days',{min:1}),F('dailyBudget','Daily Budget ($)',{dv:50}),F('flights','Flight Cost ($)',{dv:500})]),
  costCalc('destination-wedding','Destination Wedding','Everyday','everyday','~',['destination wedding cost'],[F('guests','Guests',{min:10}),F('costPerGuest','Cost/Guest ($)',{dv:200}),F('venue','Venue ($)',{dv:5000})]),
  rateCalc('travel-points-value','Travel Points Value','Finance','finance','$',['points value calculator'],[F('points','Points',{min:1}),F('cashValue','Cash Value ($)',{min:0.01})],'Cents/Point'),
  costCalc('study-abroad','Study Abroad','Everyday','everyday','~',['study abroad cost'],[F('tuition','Tuition ($)',{dv:15000}),F('housing','Housing ($)',{dv:8000}),F('living','Living Expenses ($)',{dv:5000})]),
  costCalc('gap-year','Gap Year','Everyday','everyday','~',['gap year budget'],[F('months','Months',{min:1}),F('monthly','Monthly Budget ($)',{dv:2000}),F('flights','Flights ($)',{dv:2000})]),
  costCalc('ski-trip','Ski Trip','Everyday','everyday','~',['ski trip cost'],[F('days','Days',{min:1}),F('liftTicket','Lift Ticket/Day ($)',{dv:120}),F('lodging','Lodging/Night ($)',{dv:200})]),
  costCalc('disney-vacation','Disney Vacation','Everyday','everyday','~',['disney trip cost'],[F('days','Days',{min:1}),F('tickets','Tickets/Person ($)',{dv:120}),F('people','People',{min:1})]),
  costCalc('safari-trip','Safari Trip','Everyday','everyday','~',['safari cost'],[F('days','Days',{min:3}),F('dailyRate','Daily Rate ($)',{dv:400}),F('people','People',{min:1})]),
  rateCalc('flight-carbon','Flight Carbon','Science','science','A',['flight carbon calculator'],[F('distance','Distance (miles)',{min:100}),F('passengers','Passengers',{dv:1})],'CO2 (kg)'),
  costCalc('yacht-charter','Yacht Charter','Everyday','everyday','~',['yacht charter cost'],[F('days','Days',{min:1}),F('dailyRate','Daily Rate ($)',{dv:5000}),F('crew','Crew Cost ($)',{dv:1000})]),
  costCalc('glamping-cost','Glamping Cost','Everyday','everyday','~',['glamping cost'],[F('nights','Nights',{min:1}),F('perNight','Per Night ($)',{dv:150}),F('guests','Guests',{min:1})]),

  // ===== HEALTH NICHE (12) =====
  rateCalc('biological-age','Biological Age','Health','health','H',['biological age calculator'],[F('chronAge','Chronological Age',{min:18}),F('exerciseDays','Exercise Days/Week',{dv:3}),F('sleepHours','Sleep Hours/Night',{dv:7})],'Biological Age'),
  rateCalc('metabolic-age','Metabolic Age','Health','health','H',['metabolic age calculator'],[F('age','Age',{min:18}),F('bmr','BMR',{min:800}),F('avgBmr','Avg BMR for Age',{dv:1500})],'Metabolic Age'),
  rateCalc('posture-score','Posture Score','Health','health','H',['posture assessment'],[F('headForward','Head Forward (in)',{dv:1}),F('shoulderRound','Shoulder Round (deg)',{dv:10}),F('screenHours','Screen Hours/Day',{dv:8})],'Posture Score'),
  rateCalc('hydration-needs','Hydration Needs','Health','health','H',['hydration calculator'],[F('weight','Weight (lbs)',{min:50}),F('exercise','Exercise Min/Day',{dv:30}),F('climate','Climate (1-3)',{dv:2})],'Oz Water/Day'),
  rateCalc('eye-strain-risk','Eye Strain Risk','Health','health','H',['eye strain calculator'],[F('screenHours','Screen Hours/Day',{min:1}),F('breaks','Breaks/Hour',{dv:1}),F('distance','Screen Distance (in)',{dv:24})],'Risk Score'),
  rateCalc('hearing-damage-risk','Hearing Damage Risk','Health','health','H',['hearing damage calculator'],[F('decibels','Noise Level (dB)',{min:60}),F('hours','Hours Exposed',{min:0.5})],'Risk Level'),
  rateCalc('sitting-health-risk','Sitting Health Risk','Health','health','H',['sitting risk calculator'],[F('sittingHours','Sitting Hours/Day',{min:1}),F('exerciseMin','Exercise Min/Day',{dv:30})],'Risk Score'),
  rateCalc('circadian-rhythm','Circadian Rhythm','Health','health','H',['circadian rhythm calculator'],[F('wakeTime','Wake Time (24hr)',{dv:7}),F('sleepTime','Sleep Time (24hr)',{dv:23})],'Sleep Duration'),
  rateCalc('nap-duration','Nap Duration','Health','health','H',['nap calculator'],[F('sleepLast','Sleep Last Night (hrs)',{min:0}),F('tiredness','Tiredness (1-10)',{dv:5})],'Nap Minutes'),
  rateCalc('handwashing-time','Handwashing Time','Health','health','H',['handwashing calculator'],[F('risk','Risk Level (1-3)',{dv:1}),F('soapType','Soap Type (1-3)',{dv:2})],'Seconds'),
  rateCalc('sunlight-exposure','Sunlight Exposure','Health','health','H',['sun exposure calculator'],[F('latitude','Latitude',{dv:40}),F('skinType','Skin Type (1-6)',{dv:3}),F('month','Month (1-12)',{dv:6})],'Minutes'),
  rateCalc('ergonomic-desk','Ergonomic Desk Setup','Health','health','H',['ergonomic calculator'],[F('height','Height (in)',{min:48}),F('inseam','Sitting Height (in)',{min:15})],'Desk Height (in)'),

  // ===== EDUCATION & LEARNING (12) =====
  rateCalc('reading-speed','Reading Speed','Everyday','everyday','~',['reading speed calculator'],[F('words','Words Read',{min:1}),F('minutes','Minutes Taken',{min:0.5})],'WPM'),
  rateCalc('typing-speed','Typing Speed','Everyday','everyday','~',['typing speed calculator'],[F('chars','Characters Typed',{min:1}),F('minutes','Minutes',{min:0.5})],'WPM'),
  rateCalc('study-time','Study Time','Everyday','everyday','~',['study time calculator'],[F('pages','Pages to Study',{min:1}),F('pagesPerHour','Pages/Hour',{dv:10})],'Hours Needed'),
  rateCalc('flashcard-retention','Flashcard Retention','Everyday','everyday','~',['flashcard calculator'],[F('cards','Total Cards',{min:1}),F('correct','Correct Cards',{min:0})],'Retention %'),
  rateCalc('gpa-calculator','GPA','Everyday','everyday','~',['gpa calculator'],[F('credits','Total Credits',{min:1}),F('qualityPoints','Quality Points',{min:0})],'GPA'),
  rateCalc('class-grade','Class Grade','Everyday','everyday','~',['class grade calculator'],[F('earned','Points Earned',{min:0}),F('total','Total Points',{min:1})],'Grade %'),
  costCalc('homeschool-cost','Homeschool Cost','Everyday','everyday','~',['homeschool cost'],[F('children','Children',{min:1}),F('curriculum','Curriculum ($)',{dv:500}),F('supplies','Supplies ($)',{dv:200})]),
  costCalc('tutoring-cost','Tutoring Cost','Everyday','everyday','~',['tutoring cost calculator'],[F('sessions','Sessions/Month',{min:1}),F('rate','Rate/Hour ($)',{dv:50}),F('hours','Hours/Session',{dv:1})]),
  rateCalc('semester-credits','Semester Credit Load','Everyday','everyday','~',['credit hour calculator'],[F('courses','Courses',{min:1}),F('creditsPerCourse','Credits/Course',{dv:3})],'Total Credits'),
  costCalc('college-application','College Application','Everyday','everyday','~',['college application cost'],[F('schools','Schools',{min:1}),F('feePerSchool','Fee/School ($)',{dv:75}),F('testScores','Score Sends ($)',{dv:30})]),
  rateCalc('scholarship-chance','Scholarship Odds','Everyday','everyday','~',['scholarship calculator'],[F('gpa','GPA',{min:0,max:4}),F('applicants','Applicants',{min:1}),F('awards','Awards Available',{min:1})],'Acceptance %'),
  costCalc('student-budget','Student Budget','Everyday','everyday','~',['student budget calculator'],[F('tuition','Tuition ($)',{dv:10000}),F('housing','Housing ($)',{dv:8000}),F('food','Food ($)',{dv:3000})]),

  // ===== MATH NICHE (10) =====
  sciCalc('collatz-conjecture','Collatz Conjecture','Math','math','+',['collatz calculator','3n+1'],[F('n','Starting Number',{min:1})],'Steps to 1'),
  sciCalc('totient-function','Euler Totient','Math','math','+',['euler totient','phi function'],[F('n','Number',{min:1})],'φ(n)'),
  sciCalc('mobius-function','Möbius Function','Math','math','+',['mobius function calculator'],[F('n','Number',{min:1})],'μ(n)'),
  sciCalc('perfect-number-check','Perfect Number Check','Math','math','+',['perfect number calculator'],[F('n','Number',{min:1})],'Result'),
  sciCalc('twin-prime-finder','Twin Prime Finder','Math','math','+',['twin prime calculator'],[F('limit','Search Up To',{min:10})],'Twin Primes Found'),
  sciCalc('digit-sum','Digit Sum','Math','math','+',['digit sum calculator','digital root'],[F('n','Number',{min:0})],'Digit Sum'),
  sciCalc('number-palindrome','Palindrome Check','Math','math','+',['palindrome number checker'],[F('n','Number',{min:0})],'Is Palindrome'),
  sciCalc('triangular-number','Triangular Number','Math','math','+',['triangular number calculator'],[F('n','Position',{min:1})],'T(n)'),
  sciCalc('pentagonal-number','Pentagonal Number','Math','math','+',['pentagonal number'],[F('n','Position',{min:1})],'P(n)'),
  sciCalc('hexagonal-number','Hexagonal Number','Math','math','+',['hexagonal number'],[F('n','Position',{min:1})],'H(n)'),

  // ===== CONVERSION NICHE (10) =====
  rateCalc('cups-to-grams','Cups to Grams','Conversion','conversion','R',['cups to grams converter'],[F('cups','Cups',{min:0.01}),F('density','Ingredient Density (g/cup)',{dv:128})],'Grams'),
  rateCalc('tablespoon-to-ml','Tablespoon to mL','Conversion','conversion','R',['tablespoon to ml'],[F('tbsp','Tablespoons',{min:0.1}),F('factor','mL/Tbsp',{dv:14.787})],'Milliliters'),
  rateCalc('teaspoon-to-ml','Teaspoon to mL','Conversion','conversion','R',['teaspoon to ml'],[F('tsp','Teaspoons',{min:0.1}),F('factor','mL/Tsp',{dv:4.929})],'Milliliters'),
  rateCalc('ounces-to-cups','Ounces to Cups','Conversion','conversion','R',['ounces to cups'],[F('oz','Ounces',{min:0.1}),F('factor','Cups/8oz',{dv:0.125})],'Cups'),
  rateCalc('sticks-to-cups','Butter Sticks to Cups','Conversion','conversion','R',['butter sticks to cups'],[F('sticks','Sticks of Butter',{min:0.25}),F('factor','Cups/Stick',{dv:0.5})],'Cups'),
  rateCalc('fahrenheit-to-gas','Fahrenheit to Gas Mark','Conversion','conversion','R',['gas mark converter'],[F('fahrenheit','Fahrenheit',{min:250}),F('offset','Offset',{dv:250})],'Gas Mark'),
  rateCalc('quarts-to-liters','Quarts to Liters','Conversion','conversion','R',['quarts to liters'],[F('quarts','Quarts',{min:0.1}),F('factor','L/Qt',{dv:0.946})],'Liters'),
  rateCalc('pints-to-cups','Pints to Cups','Conversion','conversion','R',['pints to cups'],[F('pints','Pints',{min:0.1}),F('factor','Cups/Pint',{dv:2})],'Cups'),
  rateCalc('gallons-to-liters','Gallons to Liters','Conversion','conversion','R',['gallons to liters'],[F('gallons','Gallons',{min:0.1}),F('factor','L/Gal',{dv:3.785})],'Liters'),
  rateCalc('fluid-oz-to-ml','Fluid Oz to mL','Conversion','conversion','R',['fluid ounces to ml'],[F('oz','Fluid Ounces',{min:0.1}),F('factor','mL/fl oz',{dv:29.574})],'Milliliters'),

  // ===== SCIENCE NICHE (15) =====
  sciCalc('richter-scale-energy','Richter Scale Energy','Science','science','A',['richter scale calculator'],[F('magnitude','Magnitude',{min:0,max:10})],'Energy (J)'),
  sciCalc('wind-power','Wind Power','Science','science','A',['wind power calculator'],[F('diameter','Rotor Diameter (m)',{min:1}),F('windSpeed','Wind Speed (m/s)',{min:1}),F('efficiency','Efficiency',{dv:0.35})],'Power (W)'),
  sciCalc('water-pressure-depth','Water Pressure','Science','science','A',['water pressure calculator'],[F('depth','Depth (m)',{min:0.1}),F('density','Density (kg/m³)',{dv:1025})],'Pressure (atm)'),
  sciCalc('sound-wavelength','Sound Wavelength','Science','science','A',['sound wavelength calculator'],[F('frequency','Frequency (Hz)',{min:1}),F('speed','Speed of Sound (m/s)',{dv:343})],'Wavelength (m)'),
  sciCalc('pendulum-period','Pendulum Period','Science','science','A',['pendulum calculator'],[F('length','Length (m)',{min:0.01}),F('gravity','Gravity (m/s²)',{dv:9.81})],'Period (s)'),
  sciCalc('buoyancy-force','Buoyancy Force','Science','science','A',['buoyancy calculator'],[F('volume','Submerged Volume (m³)',{min:0.001}),F('fluidDensity','Fluid Density (kg/m³)',{dv:1000})],'Force (N)'),
  sciCalc('centripetal-force','Centripetal Force','Science','science','A',['centripetal force calculator'],[F('mass','Mass (kg)',{min:0.01}),F('velocity','Velocity (m/s)',{min:0.1}),F('radius','Radius (m)',{min:0.01})],'Force (N)'),
  sciCalc('kinetic-energy','Kinetic Energy','Science','science','A',['kinetic energy calculator'],[F('mass','Mass (kg)',{min:0.01}),F('velocity','Velocity (m/s)',{min:0.01})],'Energy (J)'),
  sciCalc('potential-energy-grav','Gravitational PE','Science','science','A',['potential energy calculator'],[F('mass','Mass (kg)',{min:0.01}),F('height','Height (m)',{min:0.01}),F('gravity','Gravity (m/s²)',{dv:9.81})],'Energy (J)'),
  sciCalc('spring-constant','Spring Constant','Science','science','A',['spring constant calculator'],[F('force','Force (N)',{min:0.01}),F('displacement','Displacement (m)',{min:0.001})],'k (N/m)'),
  sciCalc('friction-force','Friction Force','Science','science','A',['friction calculator'],[F('normal','Normal Force (N)',{min:0.01}),F('coefficient','Friction Coefficient',{min:0.01})],'Friction (N)'),
  sciCalc('momentum-calc','Momentum','Science','science','A',['momentum calculator'],[F('mass','Mass (kg)',{min:0.01}),F('velocity','Velocity (m/s)',{})],'Momentum (kg·m/s)'),
  sciCalc('impulse-calc','Impulse','Science','science','A',['impulse calculator'],[F('force','Force (N)',{min:0.01}),F('time','Time (s)',{min:0.001})],'Impulse (N·s)'),
  sciCalc('torque-calc','Torque','Science','science','A',['torque calculator'],[F('force','Force (N)',{min:0.01}),F('distance','Distance (m)',{min:0.01}),F('angle','Angle (degrees)',{dv:90})],'Torque (N·m)'),
  sciCalc('angular-velocity','Angular Velocity','Science','science','A',['angular velocity calculator'],[F('revolutions','Revolutions',{min:0.1}),F('time','Time (s)',{min:0.01})],'Rad/s'),

  // ===== HOME IMPROVEMENT NICHE (15) =====
  costCalc('roof-replacement','Roof Replacement','Everyday','everyday','~',['roof replacement cost'],[F('sqft','Roof Area (sq ft)',{min:100}),F('costPerSqft','Cost/SqFt ($)',{dv:7}),F('removal','Removal ($)',{dv:1500})]),
  costCalc('siding-cost','Siding Cost','Everyday','everyday','~',['siding cost calculator'],[F('sqft','Exterior Sq Ft',{min:100}),F('costPerSqft','Cost/SqFt ($)',{dv:8}),F('labor','Labor ($)',{dv:3000})]),
  costCalc('window-replacement','Window Replacement','Everyday','everyday','~',['window replacement cost'],[F('windows','Number of Windows',{min:1}),F('costPerWindow','Cost/Window ($)',{dv:500}),F('install','Install/Window ($)',{dv:200})]),
  costCalc('door-replacement','Door Replacement','Everyday','everyday','~',['door replacement cost'],[F('doors','Number of Doors',{min:1}),F('costPerDoor','Cost/Door ($)',{dv:800}),F('install','Install ($)',{dv:300})]),
  costCalc('flooring-install','Flooring Installation','Everyday','everyday','~',['flooring cost calculator'],[F('sqft','Square Feet',{min:50}),F('materialCost','Material/SqFt ($)',{dv:5}),F('laborCost','Labor/SqFt ($)',{dv:3})]),
  costCalc('hardwood-refinish','Hardwood Refinishing','Everyday','everyday','~',['hardwood refinishing cost'],[F('sqft','Square Feet',{min:50}),F('costPerSqft','Cost/SqFt ($)',{dv:4}),F('sanding','Sanding ($)',{dv:500})]),
  costCalc('countertop-cost','Countertop Cost','Everyday','everyday','~',['countertop cost'],[F('sqft','Square Feet',{min:10}),F('materialCost','Material/SqFt ($)',{dv:60}),F('fabrication','Fabrication ($)',{dv:1000})]),
  costCalc('backsplash-cost','Backsplash Cost','Everyday','everyday','~',['backsplash cost'],[F('sqft','Square Feet',{min:5}),F('tileCost','Tile/SqFt ($)',{dv:15}),F('labor','Labor ($)',{dv:500})]),
  costCalc('painting-cost','Interior Painting','Everyday','everyday','~',['painting cost calculator'],[F('rooms','Rooms',{min:1}),F('costPerRoom','Cost/Room ($)',{dv:400}),F('paint','Paint Cost ($)',{dv:50})]),
  costCalc('exterior-painting','Exterior Painting','Everyday','everyday','~',['exterior painting cost'],[F('sqft','Exterior Sq Ft',{min:200}),F('costPerSqft','Cost/SqFt ($)',{dv:3}),F('prep','Prep Cost ($)',{dv:500})]),
  costCalc('plumbing-repair','Plumbing Repair','Everyday','everyday','~',['plumbing repair cost'],[F('hours','Labor Hours',{min:0.5}),F('rate','Hourly Rate ($)',{dv:100}),F('parts','Parts ($)',{dv:50})]),
  costCalc('electrical-rewiring','Electrical Rewiring','Everyday','everyday','~',['rewiring cost'],[F('sqft','Square Feet',{min:200}),F('costPerSqft','Cost/SqFt ($)',{dv:8}),F('panel','Panel Upgrade ($)',{dv:2000})]),
  costCalc('attic-insulation','Attic Insulation','Everyday','everyday','~',['attic insulation cost'],[F('sqft','Attic Sq Ft',{min:100}),F('costPerSqft','Cost/SqFt ($)',{dv:2}),F('removal','Old Removal ($)',{dv:500})]),
  costCalc('water-heater','Water Heater Cost','Everyday','everyday','~',['water heater cost'],[F('unit','Unit Cost ($)',{dv:1000}),F('install','Installation ($)',{dv:500}),F('annual','Annual Operating ($)',{dv:400})]),
  costCalc('garage-door','Garage Door Cost','Everyday','everyday','~',['garage door cost'],[F('doors','Number of Doors',{min:1}),F('costPerDoor','Cost/Door ($)',{dv:1500}),F('install','Install/Door ($)',{dv:500})]),
];

// Generate files
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
  keywords: [${c.kw.map(k=>`"${k}"`).join(', ')}],
  variants: [{
    id: "${c.vid || 'standard'}",
    name: "${c.vn || c.title.replace(' Calculator','')}",
    description: "",
    fields: [
${c.fields.map(f => {
  let s = `      { name: "${f.n}", label: "${f.l}", type: "${f.t||'number'}"`;
  if(f.p) s+=`, placeholder: "${f.p}"`;
  if(f.pre) s+=`, prefix: "${f.pre}"`;
  if(f.suf) s+=`, suffix: "${f.suf}"`;
  if(f.min!==undefined) s+=`, min: ${f.min}`;
  if(f.max!==undefined) s+=`, max: ${f.max}`;
  if(f.step!==undefined) s+=`, step: ${f.step}`;
  if(f.dv!==undefined) s+=`, defaultValue: ${typeof f.dv==='string'?`"${f.dv}"`:f.dv}`;
  if(f.opts) s+=`, options: [${f.opts.map(o=>`{label:"${o.l}",value:"${o.v}"}`).join(',')}]`;
  return s+' },';
}).join('\n')}
    ],
    calculate: ${c.calc},
  }],
  relatedSlugs: [${(c.rel||['percentage-calculator']).map(r=>`"${r}"`).join(', ')}],
  faq: [
    { question: "${c.faq[0].q}", answer: "${c.faq[0].a}" },
    { question: "${c.faq[1].q}", answer: "${c.faq[1].a}" },
  ],
  formula: "${c.formula}",
};
`;
}

let generated = 0, skipped = 0;
const imports = [], regs = [];

for (const c of defs) {
  const slug = c.slug;
  if (existingSlugs.has(slug)) { skipped++; continue; }
  const filePath = path.join(CALC_DIR, slug + '.ts');
  if (fs.existsSync(filePath)) { skipped++; continue; }
  const exportName = eName(slug);
  fs.writeFileSync(filePath, genFile(c));
  imports.push(`import { ${exportName} } from "./${slug}";`);
  regs.push(`  ${exportName},`);
  generated++;
}

fs.writeFileSync(path.join(__dirname, 'new-imports-b4.txt'), imports.join('\n'));
fs.writeFileSync(path.join(__dirname, 'new-regs-b4.txt'), regs.join('\n'));
console.log(`Generated: ${generated} | Skipped: ${skipped} | Total defs: ${defs.length}`);
console.log(`Imports: ${imports.length} | Regs: ${regs.length}`);
