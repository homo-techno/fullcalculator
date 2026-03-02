add(
  "concrete-driveway-cost-calculator",
  "Concrete Driveway Cost Calculator",
  "Estimate the cost of a concrete driveway by area and thickness.",
  "Finance",
  "finance",
  "$",
  ["concrete", "driveway", "cost", "paving"],
  [
    '{ name: "length", label: "Driveway Length (ft)", type: "number", min: 10, max: 200, defaultValue: 40 }',
    '{ name: "width", label: "Driveway Width (ft)", type: "number", min: 8, max: 50, defaultValue: 16 }',
    '{ name: "thickness", label: "Thickness (inches)", type: "number", min: 3, max: 8, defaultValue: 4 }',
    '{ name: "pricePerYard", label: "Price per Cubic Yard ($)", type: "number", min: 50, max: 500, defaultValue: 150 }',
  ],
  `(inputs) => {
    const length = inputs.length as number;
    const width = inputs.width as number;
    const thickness = inputs.thickness as number;
    const pricePerYard = inputs.pricePerYard as number;
    const areaSqFt = length * width;
    const volumeCuFt = areaSqFt * (thickness / 12);
    const cubicYards = volumeCuFt / 27;
    const totalCost = cubicYards * pricePerYard;
    return {
      primary: { label: "Estimated Cost", value: "$" + formatNumber(totalCost) },
      details: [
        { label: "Area", value: formatNumber(areaSqFt) + " sq ft" },
        { label: "Cubic Yards Needed", value: formatNumber(cubicYards) }
      ]
    };
  }`,
  [
    { q: "How thick should a concrete driveway be?", a: "A residential driveway should be at least 4 inches thick." },
    { q: "How long does concrete take to cure?", a: "Concrete reaches full strength in about 28 days." }
  ],
  "Volume = Length x Width x (Thickness / 12); Cost = (Volume / 27) x Price per Cubic Yard",
  ["epoxy-floor-calculator", "countertop-square-footage-calculator"]
);

add(
  "epoxy-floor-calculator",
  "Epoxy Floor Calculator",
  "Calculate epoxy coating needed for a garage floor.",
  "Everyday",
  "everyday",
  "~",
  ["epoxy", "garage", "floor", "coating"],
  [
    '{ name: "length", label: "Floor Length (ft)", type: "number", min: 5, max: 100, defaultValue: 20 }',
    '{ name: "width", label: "Floor Width (ft)", type: "number", min: 5, max: 100, defaultValue: 20 }',
    '{ name: "coverageRate", label: "Coverage per Gallon (sq ft)", type: "number", min: 100, max: 500, defaultValue: 250 }',
    '{ name: "coats", label: "Number of Coats", type: "number", min: 1, max: 4, defaultValue: 2 }',
  ],
  `(inputs) => {
    const length = inputs.length as number;
    const width = inputs.width as number;
    const coverageRate = inputs.coverageRate as number;
    const coats = inputs.coats as number;
    const area = length * width;
    const gallonsPerCoat = area / coverageRate;
    const totalGallons = gallonsPerCoat * coats;
    return {
      primary: { label: "Total Epoxy Needed", value: formatNumber(totalGallons) + " gallons" },
      details: [
        { label: "Floor Area", value: formatNumber(area) + " sq ft" },
        { label: "Gallons per Coat", value: formatNumber(gallonsPerCoat) }
      ]
    };
  }`,
  [
    { q: "How many coats of epoxy are recommended?", a: "Two coats are recommended for most garage floors." },
    { q: "How long between epoxy coats?", a: "Wait 12 to 24 hours between coats of epoxy." }
  ],
  "Total Gallons = (Length x Width / Coverage Rate) x Number of Coats",
  ["concrete-driveway-cost-calculator", "home-gym-space-calculator"]
);

add(
  "garage-door-size-calculator",
  "Garage Door Size Calculator",
  "Determine the right garage door dimensions for your opening.",
  "Everyday",
  "everyday",
  "~",
  ["garage", "door", "size", "dimensions"],
  [
    '{ name: "openingWidth", label: "Opening Width (ft)", type: "number", min: 6, max: 30, defaultValue: 16 }',
    '{ name: "openingHeight", label: "Opening Height (ft)", type: "number", min: 6, max: 14, defaultValue: 7 }',
    '{ name: "cars", label: "Number of Cars", type: "select", options: [{ value: "1", label: "1 Car" }, { value: "2", label: "2 Cars" }, { value: "3", label: "3 Cars" }], defaultValue: "2" }',
  ],
  `(inputs) => {
    const openingWidth = inputs.openingWidth as number;
    const openingHeight = inputs.openingHeight as number;
    const cars = inputs.cars as number;
    const recommendedWidth = cars * 9;
    const recommendedHeight = 7;
    const fits = openingWidth >= recommendedWidth && openingHeight >= recommendedHeight;
    return {
      primary: { label: "Recommended Door Size", value: recommendedWidth + " x " + recommendedHeight + " ft" },
      details: [
        { label: "Your Opening", value: openingWidth + " x " + openingHeight + " ft" },
        { label: "Fits Standard Door", value: fits ? "Yes" : "No" }
      ]
    };
  }`,
  [
    { q: "What is a standard single garage door size?", a: "A standard single garage door is 9 feet wide by 7 feet tall." },
    { q: "What is a standard double garage door size?", a: "A standard double garage door is 16 feet wide by 7 feet tall." }
  ],
  "Recommended Width = Number of Cars x 9 ft; Standard Height = 7 ft",
  ["home-gym-space-calculator", "billiard-room-size-calculator"]
);

add(
  "pergola-shade-calculator",
  "Pergola Shade Calculator",
  "Estimate shade coverage area from a pergola structure.",
  "Everyday",
  "everyday",
  "~",
  ["pergola", "shade", "coverage", "outdoor"],
  [
    '{ name: "pergolaLength", label: "Pergola Length (ft)", type: "number", min: 4, max: 40, defaultValue: 12 }',
    '{ name: "pergolaWidth", label: "Pergola Width (ft)", type: "number", min: 4, max: 40, defaultValue: 10 }',
    '{ name: "slatCoverage", label: "Slat Coverage (%)", type: "number", min: 10, max: 100, defaultValue: 60 }',
  ],
  `(inputs) => {
    const pergolaLength = inputs.pergolaLength as number;
    const pergolaWidth = inputs.pergolaWidth as number;
    const slatCoverage = inputs.slatCoverage as number;
    const totalArea = pergolaLength * pergolaWidth;
    const shadedArea = totalArea * (slatCoverage / 100);
    return {
      primary: { label: "Shaded Area", value: formatNumber(shadedArea) + " sq ft" },
      details: [
        { label: "Total Pergola Area", value: formatNumber(totalArea) + " sq ft" },
        { label: "Shade Percentage", value: slatCoverage + "%" }
      ]
    };
  }`,
  [
    { q: "How much shade does a pergola provide?", a: "A typical pergola provides 50 to 75 percent shade coverage." },
    { q: "What is the best pergola slat spacing?", a: "Slats spaced 1 to 2 inches apart provide good shade balance." }
  ],
  "Shaded Area = Length x Width x (Slat Coverage / 100)",
  ["landscape-lighting-calculator", "sandbox-sand-calculator"]
);

add(
  "trampoline-weight-limit-calculator",
  "Trampoline Weight Limit Calculator",
  "Estimate the maximum user weight for a trampoline size.",
  "Everyday",
  "everyday",
  "~",
  ["trampoline", "weight", "limit", "safety"],
  [
    '{ name: "diameter", label: "Trampoline Diameter (ft)", type: "number", min: 6, max: 20, defaultValue: 14 }',
    '{ name: "springCount", label: "Number of Springs", type: "number", min: 36, max: 150, defaultValue: 96 }',
    '{ name: "users", label: "Number of Users", type: "number", min: 1, max: 4, defaultValue: 1 }',
  ],
  `(inputs) => {
    const diameter = inputs.diameter as number;
    const springCount = inputs.springCount as number;
    const users = inputs.users as number;
    const baseWeight = diameter * 20 + springCount * 1.5;
    const perUser = baseWeight / users;
    return {
      primary: { label: "Max Weight Limit", value: formatNumber(baseWeight) + " lbs" },
      details: [
        { label: "Max per User", value: formatNumber(perUser) + " lbs" },
        { label: "Number of Users", value: formatNumber(users) }
      ]
    };
  }`,
  [
    { q: "What is a typical trampoline weight limit?", a: "Most 14 foot trampolines support 250 to 400 pounds." },
    { q: "Can multiple people jump at once?", a: "Manufacturers recommend only one jumper at a time for safety." }
  ],
  "Max Weight = Diameter x 20 + Spring Count x 1.5",
  ["swing-set-spacing-calculator", "basketball-court-size-calculator"]
);

add(
  "swing-set-spacing-calculator",
  "Swing Set Spacing Calculator",
  "Calculate proper spacing for swing set layout.",
  "Everyday",
  "everyday",
  "~",
  ["swing", "set", "spacing", "playground"],
  [
    '{ name: "swings", label: "Number of Swings", type: "number", min: 1, max: 8, defaultValue: 3 }',
    '{ name: "swingWidth", label: "Swing Seat Width (in)", type: "number", min: 12, max: 30, defaultValue: 18 }',
    '{ name: "beamHeight", label: "Beam Height (ft)", type: "number", min: 6, max: 14, defaultValue: 8 }',
  ],
  `(inputs) => {
    const swings = inputs.swings as number;
    const swingWidth = inputs.swingWidth as number;
    const beamHeight = inputs.beamHeight as number;
    const spacingInches = swingWidth + 6;
    const edgeClearance = 24;
    const totalWidthInches = swings * spacingInches + 2 * edgeClearance;
    const totalWidthFeet = totalWidthInches / 12;
    const safetyZone = beamHeight * 2;
    return {
      primary: { label: "Total Beam Length", value: formatNumber(totalWidthFeet) + " ft" },
      details: [
        { label: "Spacing Between Swings", value: formatNumber(spacingInches) + " in" },
        { label: "Front/Back Safety Zone", value: formatNumber(safetyZone) + " ft" }
      ]
    };
  }`,
  [
    { q: "How far apart should swings be?", a: "Swings should be at least 24 inches apart center to center." },
    { q: "What is a safe fall zone for swings?", a: "The fall zone should extend twice the beam height in all directions." }
  ],
  "Total Width = (Swings x (Seat Width + 6)) + 48 inches edge clearance",
  ["trampoline-weight-limit-calculator", "sandbox-sand-calculator"]
);

add(
  "sandbox-sand-calculator",
  "Sandbox Sand Calculator",
  "Calculate the volume of sand needed to fill a sandbox.",
  "Everyday",
  "everyday",
  "~",
  ["sandbox", "sand", "volume", "playground"],
  [
    '{ name: "length", label: "Sandbox Length (ft)", type: "number", min: 2, max: 20, defaultValue: 6 }',
    '{ name: "width", label: "Sandbox Width (ft)", type: "number", min: 2, max: 20, defaultValue: 6 }',
    '{ name: "depth", label: "Sand Depth (inches)", type: "number", min: 3, max: 24, defaultValue: 12 }',
    '{ name: "bagWeight", label: "Bag Weight (lbs)", type: "number", min: 25, max: 100, defaultValue: 50 }',
  ],
  `(inputs) => {
    const length = inputs.length as number;
    const width = inputs.width as number;
    const depth = inputs.depth as number;
    const bagWeight = inputs.bagWeight as number;
    const volumeCuFt = length * width * (depth / 12);
    const totalWeight = volumeCuFt * 100;
    const bags = Math.ceil(totalWeight / bagWeight);
    return {
      primary: { label: "Sand Volume", value: formatNumber(volumeCuFt) + " cu ft" },
      details: [
        { label: "Total Weight", value: formatNumber(totalWeight) + " lbs" },
        { label: "Bags Needed", value: formatNumber(bags) }
      ]
    };
  }`,
  [
    { q: "How deep should sandbox sand be?", a: "Sandbox sand should be at least 12 inches deep for good play." },
    { q: "What type of sand is best for sandboxes?", a: "Use washed play sand that is free of dust and contaminants." }
  ],
  "Volume = Length x Width x (Depth / 12); Weight = Volume x 100 lbs per cu ft",
  ["swing-set-spacing-calculator", "pergola-shade-calculator"]
);

add(
  "basketball-court-size-calculator",
  "Basketball Court Size Calculator",
  "Get court dimensions by basketball court type.",
  "Everyday",
  "everyday",
  "~",
  ["basketball", "court", "size", "dimensions"],
  [
    '{ name: "courtType", label: "Court Type", type: "select", options: [{ value: "1", label: "Full NBA" }, { value: "2", label: "Full College" }, { value: "3", label: "Half Court" }, { value: "4", label: "High School" }], defaultValue: "3" }',
    '{ name: "surfaceCost", label: "Surface Cost per Sq Ft ($)", type: "number", min: 1, max: 50, defaultValue: 5 }',
  ],
  `(inputs) => {
    const courtType = inputs.courtType as number;
    const surfaceCost = inputs.surfaceCost as number;
    let length = 94;
    let width = 50;
    if (courtType === 2) { length = 94; width = 50; }
    if (courtType === 3) { length = 47; width = 50; }
    if (courtType === 4) { length = 84; width = 50; }
    const area = length * width;
    const cost = area * surfaceCost;
    return {
      primary: { label: "Court Dimensions", value: length + " x " + width + " ft" },
      details: [
        { label: "Total Area", value: formatNumber(area) + " sq ft" },
        { label: "Surface Cost", value: "$" + formatNumber(cost) }
      ]
    };
  }`,
  [
    { q: "How big is an NBA basketball court?", a: "An NBA court is 94 feet long by 50 feet wide." },
    { q: "What is the size of a half court?", a: "A half court is 47 feet long by 50 feet wide." }
  ],
  "Area = Court Length x Court Width; Cost = Area x Surface Cost per Sq Ft",
  ["tennis-court-cost-calculator", "batting-cage-size-calculator"]
);

add(
  "tennis-court-cost-calculator",
  "Tennis Court Cost Calculator",
  "Estimate the cost of building a tennis court.",
  "Finance",
  "finance",
  "$",
  ["tennis", "court", "cost", "construction"],
  [
    '{ name: "surfaceType", label: "Surface Type", type: "select", options: [{ value: "1", label: "Hard Court" }, { value: "2", label: "Clay" }, { value: "3", label: "Grass" }], defaultValue: "1" }',
    '{ name: "fencing", label: "Include Fencing", type: "select", options: [{ value: "1", label: "Yes" }, { value: "0", label: "No" }], defaultValue: "1" }',
    '{ name: "lighting", label: "Include Lighting", type: "select", options: [{ value: "1", label: "Yes" }, { value: "0", label: "No" }], defaultValue: "0" }',
  ],
  `(inputs) => {
    const surfaceType = inputs.surfaceType as number;
    const fencing = inputs.fencing as number;
    const lighting = inputs.lighting as number;
    const courtArea = 78 * 36;
    let baseCost = 25000;
    if (surfaceType === 2) baseCost = 35000;
    if (surfaceType === 3) baseCost = 50000;
    const fencingCost = fencing === 1 ? 8000 : 0;
    const lightingCost = lighting === 1 ? 12000 : 0;
    const totalCost = baseCost + fencingCost + lightingCost;
    return {
      primary: { label: "Total Estimated Cost", value: "$" + formatNumber(totalCost) },
      details: [
        { label: "Court Area", value: formatNumber(courtArea) + " sq ft" },
        { label: "Base Surface Cost", value: "$" + formatNumber(baseCost) },
        { label: "Fencing Cost", value: "$" + formatNumber(fencingCost) },
        { label: "Lighting Cost", value: "$" + formatNumber(lightingCost) }
      ]
    };
  }`,
  [
    { q: "How much does a tennis court cost?", a: "A basic hard court costs around 25000 to 50000 dollars." },
    { q: "What is the standard tennis court size?", a: "A standard tennis court is 78 feet long by 36 feet wide." }
  ],
  "Total Cost = Base Surface Cost + Fencing Cost + Lighting Cost",
  ["basketball-court-size-calculator", "concrete-driveway-cost-calculator"]
);

add(
  "batting-cage-size-calculator",
  "Batting Cage Size Calculator",
  "Determine batting cage dimensions for your space.",
  "Everyday",
  "everyday",
  "~",
  ["batting", "cage", "size", "baseball"],
  [
    '{ name: "cageType", label: "Cage Type", type: "select", options: [{ value: "1", label: "Softball" }, { value: "2", label: "Baseball" }, { value: "3", label: "Youth" }], defaultValue: "2" }',
    '{ name: "cages", label: "Number of Cages", type: "number", min: 1, max: 10, defaultValue: 1 }',
  ],
  `(inputs) => {
    const cageType = inputs.cageType as number;
    const cages = inputs.cages as number;
    let length = 70;
    let width = 14;
    let height = 12;
    if (cageType === 1) { length = 55; width = 14; height = 12; }
    if (cageType === 3) { length = 50; width = 12; height = 10; }
    const totalWidth = width * cages;
    const area = length * totalWidth;
    return {
      primary: { label: "Cage Dimensions", value: length + " x " + width + " x " + height + " ft" },
      details: [
        { label: "Total Width for All Cages", value: formatNumber(totalWidth) + " ft" },
        { label: "Total Footprint", value: formatNumber(area) + " sq ft" }
      ]
    };
  }`,
  [
    { q: "How long should a batting cage be?", a: "A standard baseball batting cage is 70 feet long." },
    { q: "How wide is a batting cage?", a: "A standard batting cage is 12 to 14 feet wide." }
  ],
  "Cage Length varies by type; Total Width = Cage Width x Number of Cages",
  ["basketball-court-size-calculator", "archery-range-calculator"]
);

add(
  "archery-range-calculator",
  "Archery Range Calculator",
  "Calculate archery range safety zone dimensions.",
  "Everyday",
  "everyday",
  "~",
  ["archery", "range", "safety", "shooting"],
  [
    '{ name: "distance", label: "Shooting Distance (yards)", type: "number", min: 10, max: 100, defaultValue: 20 }',
    '{ name: "lanes", label: "Number of Lanes", type: "number", min: 1, max: 20, defaultValue: 4 }',
    '{ name: "laneWidth", label: "Lane Width (ft)", type: "number", min: 4, max: 10, defaultValue: 5 }',
  ],
  `(inputs) => {
    const distance = inputs.distance as number;
    const lanes = inputs.lanes as number;
    const laneWidth = inputs.laneWidth as number;
    const rangeLengthFt = distance * 3 + 30;
    const rangeWidth = lanes * laneWidth + 10;
    const totalArea = rangeLengthFt * rangeWidth;
    return {
      primary: { label: "Range Length", value: formatNumber(rangeLengthFt) + " ft" },
      details: [
        { label: "Range Width", value: formatNumber(rangeWidth) + " ft" },
        { label: "Total Area Needed", value: formatNumber(totalArea) + " sq ft" }
      ]
    };
  }`,
  [
    { q: "How far behind the target is the safety zone?", a: "Allow at least 30 feet of buffer behind the target backstop." },
    { q: "How wide should an archery lane be?", a: "Each archery lane should be at least 5 feet wide." }
  ],
  "Range Length = (Distance in yards x 3) + 30 ft buffer; Width = Lanes x Lane Width + 10",
  ["batting-cage-size-calculator", "dart-board-height-calculator"]
);

add(
  "dart-board-height-calculator",
  "Dart Board Height Calculator",
  "Get official dart board mounting dimensions.",
  "Everyday",
  "everyday",
  "~",
  ["dart", "board", "height", "mounting"],
  [
    '{ name: "gameType", label: "Game Type", type: "select", options: [{ value: "1", label: "Steel Tip" }, { value: "2", label: "Soft Tip" }], defaultValue: "1" }',
    '{ name: "wallWidth", label: "Available Wall Width (ft)", type: "number", min: 2, max: 20, defaultValue: 6 }',
  ],
  `(inputs) => {
    const gameType = inputs.gameType as number;
    const wallWidth = inputs.wallWidth as number;
    const bullseyeHeight = 68;
    const throwDistance = gameType === 1 ? 93.25 : 96;
    const boardDiameter = 18;
    const minWidth = 3;
    const fits = wallWidth >= minWidth;
    return {
      primary: { label: "Bullseye Height", value: bullseyeHeight + " inches from floor" },
      details: [
        { label: "Throw Distance", value: throwDistance + " inches" },
        { label: "Board Diameter", value: boardDiameter + " inches" },
        { label: "Wall Width OK", value: fits ? "Yes" : "No" }
      ]
    };
  }`,
  [
    { q: "How high should a dart board be?", a: "The bullseye should be 5 feet 8 inches from the floor." },
    { q: "How far do you stand from a dart board?", a: "The steel tip throwing distance is 7 feet 9.25 inches." }
  ],
  "Bullseye Height = 68 inches; Throw Distance = 93.25 (steel) or 96 (soft) inches",
  ["billiard-room-size-calculator", "archery-range-calculator"]
);

add(
  "billiard-room-size-calculator",
  "Billiard Room Size Calculator",
  "Calculate the room size needed for a pool table.",
  "Everyday",
  "everyday",
  "~",
  ["billiard", "pool", "table", "room", "size"],
  [
    '{ name: "tableSize", label: "Table Size", type: "select", options: [{ value: "7", label: "7 ft Bar" }, { value: "8", label: "8 ft Standard" }, { value: "9", label: "9 ft Tournament" }], defaultValue: "8" }',
    '{ name: "cueLength", label: "Cue Length (inches)", type: "number", min: 36, max: 62, defaultValue: 58 }',
  ],
  `(inputs) => {
    const tableSize = inputs.tableSize as number;
    const cueLength = inputs.cueLength as number;
    const tableWidths = { 7: 40, 8: 44, 9: 50 };
    const tableLengths = { 7: 80, 8: 88, 9: 100 };
    const tw = tableWidths[tableSize] || 44;
    const tl = tableLengths[tableSize] || 88;
    const roomWidth = (tw + 2 * cueLength) / 12;
    const roomLength = (tl + 2 * cueLength) / 12;
    const roomArea = roomWidth * roomLength;
    return {
      primary: { label: "Minimum Room Size", value: formatNumber(roomLength) + " x " + formatNumber(roomWidth) + " ft" },
      details: [
        { label: "Table Playing Surface", value: tl + " x " + tw + " in" },
        { label: "Room Area Needed", value: formatNumber(roomArea) + " sq ft" }
      ]
    };
  }`,
  [
    { q: "How big a room for a pool table?", a: "An 8 foot table needs at least a 13 by 17 foot room." },
    { q: "What is the standard pool cue length?", a: "A standard pool cue is 58 inches long." }
  ],
  "Room Dimension = (Table Dimension + 2 x Cue Length) / 12",
  ["dart-board-height-calculator", "home-gym-space-calculator"]
);

add(
  "home-gym-space-calculator",
  "Home Gym Space Calculator",
  "Calculate the floor space needed for a home gym.",
  "Everyday",
  "everyday",
  "~",
  ["home", "gym", "space", "fitness"],
  [
    '{ name: "equipment", label: "Equipment Pieces", type: "number", min: 1, max: 20, defaultValue: 5 }',
    '{ name: "avgFootprint", label: "Avg Equipment Size (sq ft)", type: "number", min: 5, max: 80, defaultValue: 25 }',
    '{ name: "freeWeight", label: "Free Weight Area (sq ft)", type: "number", min: 0, max: 200, defaultValue: 50 }',
    '{ name: "stretchArea", label: "Stretch Area (sq ft)", type: "number", min: 0, max: 150, defaultValue: 40 }',
  ],
  `(inputs) => {
    const equipment = inputs.equipment as number;
    const avgFootprint = inputs.avgFootprint as number;
    const freeWeight = inputs.freeWeight as number;
    const stretchArea = inputs.stretchArea as number;
    const equipmentArea = equipment * avgFootprint;
    const walkways = equipmentArea * 0.3;
    const totalArea = equipmentArea + walkways + freeWeight + stretchArea;
    return {
      primary: { label: "Total Space Needed", value: formatNumber(totalArea) + " sq ft" },
      details: [
        { label: "Equipment Area", value: formatNumber(equipmentArea) + " sq ft" },
        { label: "Walkway Space", value: formatNumber(walkways) + " sq ft" },
        { label: "Free Weight Area", value: formatNumber(freeWeight) + " sq ft" },
        { label: "Stretch Area", value: formatNumber(stretchArea) + " sq ft" }
      ]
    };
  }`,
  [
    { q: "How much space for a home gym?", a: "A basic home gym needs at least 100 to 200 square feet." },
    { q: "What ceiling height is best for a gym?", a: "A ceiling height of at least 8 feet is recommended." }
  ],
  "Total Area = Equipment x Avg Size x 1.3 + Free Weight Area + Stretch Area",
  ["billiard-room-size-calculator", "epoxy-floor-calculator"]
);

add(
  "sauna-heater-calculator",
  "Sauna Heater Calculator",
  "Calculate the heater kW needed for your sauna room.",
  "Science",
  "science",
  "A",
  ["sauna", "heater", "kW", "room"],
  [
    '{ name: "length", label: "Room Length (ft)", type: "number", min: 3, max: 20, defaultValue: 7 }',
    '{ name: "width", label: "Room Width (ft)", type: "number", min: 3, max: 20, defaultValue: 6 }',
    '{ name: "height", label: "Ceiling Height (ft)", type: "number", min: 6, max: 10, defaultValue: 7 }',
    '{ name: "insulation", label: "Insulation Quality", type: "select", options: [{ value: "1", label: "Good" }, { value: "2", label: "Average" }, { value: "3", label: "Poor" }], defaultValue: "1" }',
  ],
  `(inputs) => {
    const length = inputs.length as number;
    const width = inputs.width as number;
    const height = inputs.height as number;
    const insulation = inputs.insulation as number;
    const volumeCuFt = length * width * height;
    const volumeCuM = volumeCuFt * 0.0283168;
    let kw = volumeCuM * 1.0;
    if (insulation === 2) kw = volumeCuM * 1.3;
    if (insulation === 3) kw = volumeCuM * 1.6;
    return {
      primary: { label: "Heater Size Needed", value: formatNumber(kw) + " kW" },
      details: [
        { label: "Room Volume", value: formatNumber(volumeCuFt) + " cu ft" },
        { label: "Volume in Cubic Meters", value: formatNumber(volumeCuM) + " cu m" }
      ]
    };
  }`,
  [
    { q: "How many kW per cubic meter for a sauna?", a: "Use about 1 kW per cubic meter for a well insulated sauna." },
    { q: "What temperature should a sauna be?", a: "A traditional sauna should be between 150 and 195 degrees F." }
  ],
  "kW = Volume in Cubic Meters x Insulation Factor (1.0 to 1.6)",
  ["steam-room-generator-calculator", "home-gym-space-calculator"]
);

add(
  "steam-room-generator-calculator",
  "Steam Room Generator Calculator",
  "Calculate steam generator size for your steam room.",
  "Science",
  "science",
  "A",
  ["steam", "room", "generator", "spa"],
  [
    '{ name: "length", label: "Room Length (ft)", type: "number", min: 3, max: 20, defaultValue: 6 }',
    '{ name: "width", label: "Room Width (ft)", type: "number", min: 3, max: 20, defaultValue: 5 }',
    '{ name: "height", label: "Ceiling Height (ft)", type: "number", min: 6, max: 10, defaultValue: 8 }',
    '{ name: "wallType", label: "Wall Material", type: "select", options: [{ value: "1", label: "Tile / Stone" }, { value: "2", label: "Acrylic" }, { value: "3", label: "Natural Stone" }], defaultValue: "1" }',
  ],
  `(inputs) => {
    const length = inputs.length as number;
    const width = inputs.width as number;
    const height = inputs.height as number;
    const wallType = inputs.wallType as number;
    const volumeCuFt = length * width * height;
    let factor = 1.0;
    if (wallType === 2) factor = 0.8;
    if (wallType === 3) factor = 1.5;
    const adjustedVolume = volumeCuFt * factor;
    const kw = adjustedVolume / 30;
    return {
      primary: { label: "Generator Size", value: formatNumber(kw) + " kW" },
      details: [
        { label: "Room Volume", value: formatNumber(volumeCuFt) + " cu ft" },
        { label: "Adjusted Volume", value: formatNumber(adjustedVolume) + " cu ft" }
      ]
    };
  }`,
  [
    { q: "How is steam generator size determined?", a: "Generator size is based on room volume and wall material type." },
    { q: "What wall material is best for steam rooms?", a: "Ceramic tile and porcelain are the most popular choices." }
  ],
  "kW = (Volume x Material Factor) / 30",
  ["sauna-heater-calculator", "home-gym-space-calculator"]
);

add(
  "wine-cellar-capacity-calculator",
  "Wine Cellar Capacity Calculator",
  "Estimate the number of bottles a wine cellar can hold.",
  "Everyday",
  "everyday",
  "~",
  ["wine", "cellar", "capacity", "bottles"],
  [
    '{ name: "length", label: "Cellar Length (ft)", type: "number", min: 3, max: 40, defaultValue: 10 }',
    '{ name: "width", label: "Cellar Width (ft)", type: "number", min: 3, max: 40, defaultValue: 8 }',
    '{ name: "wallCoverage", label: "Wall Rack Coverage (%)", type: "number", min: 10, max: 100, defaultValue: 70 }',
    '{ name: "rackDepth", label: "Rack Depth (bottles)", type: "number", min: 1, max: 5, defaultValue: 1 }',
  ],
  `(inputs) => {
    const length = inputs.length as number;
    const width = inputs.width as number;
    const wallCoverage = inputs.wallCoverage as number;
    const rackDepth = inputs.rackDepth as number;
    const perimeter = 2 * (length + width);
    const rackWallFt = perimeter * (wallCoverage / 100);
    const bottlesPerFt = 12;
    const totalBottles = Math.floor(rackWallFt * bottlesPerFt * rackDepth);
    return {
      primary: { label: "Bottle Capacity", value: formatNumber(totalBottles) + " bottles" },
      details: [
        { label: "Rack Wall Length", value: formatNumber(rackWallFt) + " ft" },
        { label: "Cellar Area", value: formatNumber(length * width) + " sq ft" }
      ]
    };
  }`,
  [
    { q: "How many bottles per linear foot of racking?", a: "Standard wine racks hold about 12 bottles per linear foot." },
    { q: "What temperature is best for wine storage?", a: "Wine should be stored between 55 and 58 degrees Fahrenheit." }
  ],
  "Bottles = Rack Wall Length x 12 bottles per ft x Rack Depth",
  ["bookshelf-capacity-calculator", "kitchen-island-size-calculator"]
);

add(
  "bookshelf-capacity-calculator",
  "Bookshelf Capacity Calculator",
  "Estimate the number of books a bookshelf can hold.",
  "Everyday",
  "everyday",
  "~",
  ["bookshelf", "books", "capacity", "storage"],
  [
    '{ name: "shelfWidth", label: "Shelf Width (inches)", type: "number", min: 12, max: 96, defaultValue: 36 }',
    '{ name: "shelves", label: "Number of Shelves", type: "number", min: 1, max: 12, defaultValue: 5 }',
    '{ name: "bookThickness", label: "Avg Book Thickness (inches)", type: "number", min: 0.5, max: 3, defaultValue: 1 }',
  ],
  `(inputs) => {
    const shelfWidth = inputs.shelfWidth as number;
    const shelves = inputs.shelves as number;
    const bookThickness = inputs.bookThickness as number;
    const booksPerShelf = Math.floor(shelfWidth / bookThickness);
    const totalBooks = booksPerShelf * shelves;
    return {
      primary: { label: "Total Book Capacity", value: formatNumber(totalBooks) + " books" },
      details: [
        { label: "Books per Shelf", value: formatNumber(booksPerShelf) },
        { label: "Number of Shelves", value: formatNumber(shelves) }
      ]
    };
  }`,
  [
    { q: "How many books fit on a 36 inch shelf?", a: "About 25 to 36 average sized books fit on a 36 inch shelf." },
    { q: "What is a standard bookshelf width?", a: "Standard bookshelves are 24 to 36 inches wide." }
  ],
  "Books per Shelf = Shelf Width / Avg Book Thickness; Total = Books per Shelf x Shelves",
  ["closet-organizer-calculator", "wine-cellar-capacity-calculator"]
);

add(
  "closet-organizer-calculator",
  "Closet Organizer Calculator",
  "Calculate closet storage capacity and layout options.",
  "Everyday",
  "everyday",
  "~",
  ["closet", "organizer", "storage", "wardrobe"],
  [
    '{ name: "closetWidth", label: "Closet Width (ft)", type: "number", min: 2, max: 20, defaultValue: 6 }',
    '{ name: "closetDepth", label: "Closet Depth (ft)", type: "number", min: 1, max: 10, defaultValue: 2 }',
    '{ name: "closetHeight", label: "Closet Height (ft)", type: "number", min: 6, max: 10, defaultValue: 8 }',
    '{ name: "hangingRatio", label: "Hanging Space (%)", type: "number", min: 0, max: 100, defaultValue: 60 }',
  ],
  `(inputs) => {
    const closetWidth = inputs.closetWidth as number;
    const closetDepth = inputs.closetDepth as number;
    const closetHeight = inputs.closetHeight as number;
    const hangingRatio = inputs.hangingRatio as number;
    const totalLinearFt = closetWidth;
    const hangingFt = totalLinearFt * (hangingRatio / 100);
    const shelfFt = totalLinearFt - hangingFt;
    const hangingItems = Math.floor(hangingFt * 12);
    const shelfItems = Math.floor(shelfFt * closetHeight * 2);
    return {
      primary: { label: "Hanging Items Capacity", value: formatNumber(hangingItems) + " items" },
      details: [
        { label: "Hanging Rod Length", value: formatNumber(hangingFt) + " ft" },
        { label: "Shelf Section", value: formatNumber(shelfFt) + " ft" },
        { label: "Folded Item Capacity", value: formatNumber(shelfItems) + " items" }
      ]
    };
  }`,
  [
    { q: "How much hanging space do I need?", a: "Most people need about 4 to 6 feet of hanging rod space." },
    { q: "What is the ideal closet depth?", a: "A minimum depth of 24 inches is needed for hanging clothes." }
  ],
  "Hanging Items = Hanging Feet x 12; Shelf Items = Shelf Feet x Height x 2",
  ["bookshelf-capacity-calculator", "kitchen-island-size-calculator"]
);

add(
  "kitchen-island-size-calculator",
  "Kitchen Island Size Calculator",
  "Determine the right kitchen island dimensions for your space.",
  "Everyday",
  "everyday",
  "~",
  ["kitchen", "island", "size", "dimensions"],
  [
    '{ name: "kitchenLength", label: "Kitchen Length (ft)", type: "number", min: 8, max: 40, defaultValue: 16 }',
    '{ name: "kitchenWidth", label: "Kitchen Width (ft)", type: "number", min: 8, max: 40, defaultValue: 12 }',
    '{ name: "clearance", label: "Walkway Clearance (ft)", type: "number", min: 3, max: 5, defaultValue: 4 }',
  ],
  `(inputs) => {
    const kitchenLength = inputs.kitchenLength as number;
    const kitchenWidth = inputs.kitchenWidth as number;
    const clearance = inputs.clearance as number;
    const islandLength = kitchenLength - 2 * clearance;
    const islandWidth = kitchenWidth - 2 * clearance;
    const maxIslandLength = Math.max(islandLength, 2);
    const maxIslandWidth = Math.min(Math.max(islandWidth, 2), 4);
    const islandArea = maxIslandLength * maxIslandWidth;
    return {
      primary: { label: "Max Island Size", value: formatNumber(maxIslandLength) + " x " + formatNumber(maxIslandWidth) + " ft" },
      details: [
        { label: "Island Counter Area", value: formatNumber(islandArea) + " sq ft" },
        { label: "Walkway Clearance", value: clearance + " ft on each side" }
      ]
    };
  }`,
  [
    { q: "How much clearance around a kitchen island?", a: "Allow at least 36 to 48 inches of clearance on all sides." },
    { q: "What is a good kitchen island size?", a: "A common island size is 4 feet long by 2 feet wide." }
  ],
  "Island Length = Kitchen Length - 2 x Clearance; Width capped at 4 ft",
  ["countertop-square-footage-calculator", "cabinet-hardware-calculator"]
);

add(
  "countertop-square-footage-calculator",
  "Countertop Square Footage Calculator",
  "Calculate total countertop area for your kitchen.",
  "Everyday",
  "everyday",
  "~",
  ["countertop", "square", "footage", "kitchen"],
  [
    '{ name: "sections", label: "Number of Sections", type: "number", min: 1, max: 10, defaultValue: 3 }',
    '{ name: "avgLength", label: "Avg Section Length (ft)", type: "number", min: 1, max: 20, defaultValue: 6 }',
    '{ name: "depth", label: "Counter Depth (inches)", type: "number", min: 12, max: 36, defaultValue: 25 }',
    '{ name: "pricePerSqFt", label: "Price per Sq Ft ($)", type: "number", min: 5, max: 300, defaultValue: 60 }',
  ],
  `(inputs) => {
    const sections = inputs.sections as number;
    const avgLength = inputs.avgLength as number;
    const depth = inputs.depth as number;
    const pricePerSqFt = inputs.pricePerSqFt as number;
    const depthFt = depth / 12;
    const totalSqFt = sections * avgLength * depthFt;
    const totalCost = totalSqFt * pricePerSqFt;
    return {
      primary: { label: "Total Countertop Area", value: formatNumber(totalSqFt) + " sq ft" },
      details: [
        { label: "Depth in Feet", value: formatNumber(depthFt) + " ft" },
        { label: "Estimated Cost", value: "$" + formatNumber(totalCost) }
      ]
    };
  }`,
  [
    { q: "What is a standard countertop depth?", a: "Standard kitchen countertop depth is 25 inches." },
    { q: "How much does granite countertop cost?", a: "Granite costs about 40 to 100 dollars per square foot installed." }
  ],
  "Total Sq Ft = Sections x Avg Length x (Depth / 12); Cost = Sq Ft x Price",
  ["kitchen-island-size-calculator", "cabinet-hardware-calculator"]
);

add(
  "cabinet-hardware-calculator",
  "Cabinet Hardware Calculator",
  "Calculate the number of knobs and pulls needed for cabinets.",
  "Everyday",
  "everyday",
  "~",
  ["cabinet", "hardware", "knobs", "pulls"],
  [
    '{ name: "doors", label: "Number of Doors", type: "number", min: 0, max: 60, defaultValue: 20 }',
    '{ name: "drawers", label: "Number of Drawers", type: "number", min: 0, max: 40, defaultValue: 10 }',
    '{ name: "knobPrice", label: "Knob Price ($)", type: "number", min: 1, max: 50, defaultValue: 5 }',
    '{ name: "pullPrice", label: "Pull Price ($)", type: "number", min: 1, max: 80, defaultValue: 8 }',
  ],
  `(inputs) => {
    const doors = inputs.doors as number;
    const drawers = inputs.drawers as number;
    const knobPrice = inputs.knobPrice as number;
    const pullPrice = inputs.pullPrice as number;
    const knobs = doors;
    const pulls = drawers;
    const totalPieces = knobs + pulls;
    const totalCost = knobs * knobPrice + pulls * pullPrice;
    return {
      primary: { label: "Total Hardware Pieces", value: formatNumber(totalPieces) },
      details: [
        { label: "Knobs for Doors", value: formatNumber(knobs) },
        { label: "Pulls for Drawers", value: formatNumber(pulls) },
        { label: "Total Cost", value: "$" + formatNumber(totalCost) }
      ]
    };
  }`,
  [
    { q: "Should I use knobs or pulls on cabinets?", a: "Knobs are common on doors and pulls are common on drawers." },
    { q: "What size pulls for kitchen cabinets?", a: "The most popular pull sizes are 3 inch and 4 inch centers." }
  ],
  "Knobs = Number of Doors; Pulls = Number of Drawers; Cost = Knobs x Price + Pulls x Price",
  ["countertop-square-footage-calculator", "kitchen-island-size-calculator"]
);

add(
  "lighting-lumen-calculator",
  "Lighting Lumen Calculator",
  "Calculate the lumens needed for a room by purpose.",
  "Science",
  "science",
  "A",
  ["lighting", "lumens", "room", "brightness"],
  [
    '{ name: "length", label: "Room Length (ft)", type: "number", min: 4, max: 60, defaultValue: 14 }',
    '{ name: "width", label: "Room Width (ft)", type: "number", min: 4, max: 60, defaultValue: 12 }',
    '{ name: "roomType", label: "Room Type", type: "select", options: [{ value: "1", label: "Living Room" }, { value: "2", label: "Kitchen" }, { value: "3", label: "Bedroom" }, { value: "4", label: "Office" }], defaultValue: "2" }',
  ],
  `(inputs) => {
    const length = inputs.length as number;
    const width = inputs.width as number;
    const roomType = inputs.roomType as number;
    const area = length * width;
    let lumensPerSqFt = 20;
    if (roomType === 2) lumensPerSqFt = 40;
    if (roomType === 3) lumensPerSqFt = 15;
    if (roomType === 4) lumensPerSqFt = 50;
    const totalLumens = area * lumensPerSqFt;
    const bulbs60W = Math.ceil(totalLumens / 800);
    return {
      primary: { label: "Total Lumens Needed", value: formatNumber(totalLumens) + " lumens" },
      details: [
        { label: "Room Area", value: formatNumber(area) + " sq ft" },
        { label: "Lumens per Sq Ft", value: formatNumber(lumensPerSqFt) },
        { label: "Equivalent 60W Bulbs", value: formatNumber(bulbs60W) }
      ]
    };
  }`,
  [
    { q: "How many lumens per square foot?", a: "Kitchens need 40, living rooms 20, and bedrooms 15 lumens." },
    { q: "How many lumens is a 60W bulb?", a: "A standard 60 watt incandescent bulb produces about 800 lumens." }
  ],
  "Total Lumens = Room Area x Lumens per Sq Ft (varies by room type)",
  ["recessed-lighting-calculator", "landscape-lighting-calculator"]
);

add(
  "recessed-lighting-calculator",
  "Recessed Lighting Calculator",
  "Calculate recessed light spacing and quantity needed.",
  "Everyday",
  "everyday",
  "~",
  ["recessed", "lighting", "spacing", "ceiling"],
  [
    '{ name: "roomLength", label: "Room Length (ft)", type: "number", min: 4, max: 60, defaultValue: 14 }',
    '{ name: "roomWidth", label: "Room Width (ft)", type: "number", min: 4, max: 60, defaultValue: 12 }',
    '{ name: "ceilingHeight", label: "Ceiling Height (ft)", type: "number", min: 7, max: 20, defaultValue: 8 }',
  ],
  `(inputs) => {
    const roomLength = inputs.roomLength as number;
    const roomWidth = inputs.roomWidth as number;
    const ceilingHeight = inputs.ceilingHeight as number;
    const spacing = ceilingHeight / 2;
    const rows = Math.ceil(roomLength / spacing);
    const cols = Math.ceil(roomWidth / spacing);
    const totalLights = rows * cols;
    return {
      primary: { label: "Lights Needed", value: formatNumber(totalLights) },
      details: [
        { label: "Recommended Spacing", value: formatNumber(spacing) + " ft" },
        { label: "Rows", value: formatNumber(rows) },
        { label: "Columns", value: formatNumber(cols) }
      ]
    };
  }`,
  [
    { q: "How far apart should recessed lights be?", a: "Space recessed lights at half the ceiling height apart." },
    { q: "How far from the wall should recessed lights be?", a: "Place recessed lights about 2 to 3 feet from the wall." }
  ],
  "Spacing = Ceiling Height / 2; Lights = Rows x Columns",
  ["lighting-lumen-calculator", "landscape-lighting-calculator"]
);

add(
  "landscape-lighting-calculator",
  "Landscape Lighting Calculator",
  "Calculate landscape lighting fixtures and total wattage.",
  "Everyday",
  "everyday",
  "~",
  ["landscape", "lighting", "outdoor", "wattage"],
  [
    '{ name: "pathLength", label: "Path Length (ft)", type: "number", min: 5, max: 500, defaultValue: 60 }',
    '{ name: "spacing", label: "Fixture Spacing (ft)", type: "number", min: 4, max: 20, defaultValue: 8 }',
    '{ name: "wattsPerFixture", label: "Watts per Fixture", type: "number", min: 1, max: 50, defaultValue: 5 }',
    '{ name: "accentLights", label: "Accent Lights", type: "number", min: 0, max: 30, defaultValue: 4 }',
  ],
  `(inputs) => {
    const pathLength = inputs.pathLength as number;
    const spacing = inputs.spacing as number;
    const wattsPerFixture = inputs.wattsPerFixture as number;
    const accentLights = inputs.accentLights as number;
    const pathLights = Math.ceil(pathLength / spacing) + 1;
    const totalFixtures = pathLights + accentLights;
    const totalWatts = totalFixtures * wattsPerFixture;
    return {
      primary: { label: "Total Fixtures", value: formatNumber(totalFixtures) },
      details: [
        { label: "Path Lights", value: formatNumber(pathLights) },
        { label: "Accent Lights", value: formatNumber(accentLights) },
        { label: "Total Wattage", value: formatNumber(totalWatts) + " W" }
      ]
    };
  }`,
  [
    { q: "How far apart should path lights be?", a: "Space path lights 6 to 8 feet apart for even illumination." },
    { q: "What wattage for landscape lights?", a: "Low voltage LED landscape lights use 3 to 8 watts each." }
  ],
  "Path Lights = (Path Length / Spacing) + 1; Total Watts = Total Fixtures x Watts",
  ["recessed-lighting-calculator", "lighting-lumen-calculator"]
);
