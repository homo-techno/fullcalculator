add(
  "pallet-load-calculator",
  "Pallet Load Calculator",
  "Calculate how many items fit on a pallet by dimensions.",
  "Everyday",
  "~",
  "Package",
  ["pallet", "load", "items", "dimensions", "stacking"],
  [
    '{ name: "palletLength", label: "Pallet Length (in)", type: "number", min: 1, max: 120, defaultValue: 48 }',
    '{ name: "palletWidth", label: "Pallet Width (in)", type: "number", min: 1, max: 120, defaultValue: 40 }',
    '{ name: "palletHeight", label: "Max Stack Height (in)", type: "number", min: 1, max: 120, defaultValue: 60 }',
    '{ name: "itemLength", label: "Item Length (in)", type: "number", min: 0.1, max: 120, defaultValue: 12 }',
    '{ name: "itemWidth", label: "Item Width (in)", type: "number", min: 0.1, max: 120, defaultValue: 10 }',
    '{ name: "itemHeight", label: "Item Height (in)", type: "number", min: 0.1, max: 120, defaultValue: 8 }'
  ],
  `(inputs) => {
    const palletLength = inputs.palletLength as number;
    const palletWidth = inputs.palletWidth as number;
    const palletHeight = inputs.palletHeight as number;
    const itemLength = inputs.itemLength as number;
    const itemWidth = inputs.itemWidth as number;
    const itemHeight = inputs.itemHeight as number;
    const itemsPerRow = Math.floor(palletLength / itemLength);
    const itemsPerCol = Math.floor(palletWidth / itemWidth);
    const layers = Math.floor(palletHeight / itemHeight);
    const perLayer = itemsPerRow * itemsPerCol;
    const totalItems = perLayer * layers;
    return {
      primary: { label: "Total Items on Pallet", value: formatNumber(totalItems) },
      details: [
        { label: "Items Per Layer", value: formatNumber(perLayer) },
        { label: "Number of Layers", value: formatNumber(layers) },
        { label: "Items Per Row", value: formatNumber(itemsPerRow) },
        { label: "Items Per Column", value: formatNumber(itemsPerCol) }
      ]
    };
  }`,
  [
    { q: "How do I calculate items per pallet?", a: "Divide pallet dimensions by item dimensions to find rows, columns, and layers." },
    { q: "What is a standard pallet size?", a: "The most common US pallet is 48 by 40 inches." }
  ],
  "Total Items = floor(PL / IL) x floor(PW / IW) x floor(PH / IH)",
  ["container-load-calculator", "palletizing-calculator", "cbm-calculator"]
);

add(
  "container-load-calculator",
  "Container Load Calculator",
  "Calculate how many boxes fit in a shipping container.",
  "Everyday",
  "~",
  "Package",
  ["container", "shipping", "boxes", "load", "cargo"],
  [
    '{ name: "containerLength", label: "Container Length (ft)", type: "number", min: 1, max: 60, defaultValue: 40 }',
    '{ name: "containerWidth", label: "Container Width (ft)", type: "number", min: 1, max: 20, defaultValue: 8 }',
    '{ name: "containerHeight", label: "Container Height (ft)", type: "number", min: 1, max: 20, defaultValue: 8 }',
    '{ name: "boxLength", label: "Box Length (ft)", type: "number", min: 0.1, max: 20, defaultValue: 2 }',
    '{ name: "boxWidth", label: "Box Width (ft)", type: "number", min: 0.1, max: 20, defaultValue: 1.5 }',
    '{ name: "boxHeight", label: "Box Height (ft)", type: "number", min: 0.1, max: 20, defaultValue: 1.5 }'
  ],
  `(inputs) => {
    const containerLength = inputs.containerLength as number;
    const containerWidth = inputs.containerWidth as number;
    const containerHeight = inputs.containerHeight as number;
    const boxLength = inputs.boxLength as number;
    const boxWidth = inputs.boxWidth as number;
    const boxHeight = inputs.boxHeight as number;
    const containerVol = containerLength * containerWidth * containerHeight;
    const boxVol = boxLength * boxWidth * boxHeight;
    const lengthFit = Math.floor(containerLength / boxLength);
    const widthFit = Math.floor(containerWidth / boxWidth);
    const heightFit = Math.floor(containerHeight / boxHeight);
    const totalBoxes = lengthFit * widthFit * heightFit;
    const utilization = (totalBoxes * boxVol) / containerVol * 100;
    return {
      primary: { label: "Total Boxes", value: formatNumber(totalBoxes) },
      details: [
        { label: "Container Volume (cu ft)", value: formatNumber(containerVol) },
        { label: "Box Volume (cu ft)", value: formatNumber(boxVol) },
        { label: "Space Utilization", value: formatNumber(utilization) + "%" }
      ]
    };
  }`,
  [
    { q: "What are standard container sizes?", a: "Common sizes are 20-foot and 40-foot containers with 8-foot width and height." },
    { q: "How is container utilization calculated?", a: "Divide total box volume by container volume and multiply by 100." }
  ],
  "Total Boxes = floor(CL/BL) x floor(CW/BW) x floor(CH/BH)",
  ["pallet-load-calculator", "cbm-calculator", "container-weight-calculator"]
);

add(
  "freight-class-calculator",
  "Freight Class Calculator",
  "Determine freight density and NMFC class for shipping.",
  "Everyday",
  "~",
  "Truck",
  ["freight", "class", "density", "NMFC", "LTL"],
  [
    '{ name: "weight", label: "Weight (lbs)", type: "number", min: 1, max: 50000, defaultValue: 500 }',
    '{ name: "length", label: "Length (in)", type: "number", min: 1, max: 600, defaultValue: 48 }',
    '{ name: "width", label: "Width (in)", type: "number", min: 1, max: 600, defaultValue: 40 }',
    '{ name: "height", label: "Height (in)", type: "number", min: 1, max: 600, defaultValue: 36 }'
  ],
  `(inputs) => {
    const weight = inputs.weight as number;
    const length = inputs.length as number;
    const width = inputs.width as number;
    const height = inputs.height as number;
    const cubicFeet = (length * width * height) / 1728;
    const density = weight / cubicFeet;
    let freightClass = "500";
    if (density >= 50) freightClass = "50";
    else if (density >= 35) freightClass = "55";
    else if (density >= 30) freightClass = "60";
    else if (density >= 22.5) freightClass = "65";
    else if (density >= 15) freightClass = "70";
    else if (density >= 13.5) freightClass = "77.5";
    else if (density >= 12) freightClass = "85";
    else if (density >= 10.5) freightClass = "92.5";
    else if (density >= 9) freightClass = "100";
    else if (density >= 8) freightClass = "110";
    else if (density >= 7) freightClass = "125";
    else if (density >= 6) freightClass = "150";
    else if (density >= 5) freightClass = "175";
    else if (density >= 4) freightClass = "200";
    else if (density >= 3) freightClass = "250";
    else if (density >= 2) freightClass = "300";
    else if (density >= 1) freightClass = "400";
    return {
      primary: { label: "Freight Class", value: freightClass },
      details: [
        { label: "Density (lbs/cu ft)", value: formatNumber(density) },
        { label: "Cubic Feet", value: formatNumber(cubicFeet) },
        { label: "Weight (lbs)", value: formatNumber(weight) }
      ]
    };
  }`,
  [
    { q: "What is freight class?", a: "A classification system from 50 to 500 based on density, value, and handling." },
    { q: "How is freight density calculated?", a: "Divide the weight in pounds by the volume in cubic feet." }
  ],
  "Density = Weight / (L x W x H / 1728)",
  ["ltl-freight-cost-calculator", "dimensional-weight-calculator", "cbm-calculator"]
);

add(
  "dimensional-weight-calculator",
  "Dimensional Weight Calculator",
  "Calculate DIM weight for shipping packages.",
  "Everyday",
  "~",
  "Package",
  ["dimensional", "weight", "DIM", "shipping", "package"],
  [
    '{ name: "length", label: "Length (in)", type: "number", min: 1, max: 200, defaultValue: 20 }',
    '{ name: "width", label: "Width (in)", type: "number", min: 1, max: 200, defaultValue: 15 }',
    '{ name: "height", label: "Height (in)", type: "number", min: 1, max: 200, defaultValue: 10 }',
    '{ name: "actualWeight", label: "Actual Weight (lbs)", type: "number", min: 0.1, max: 5000, defaultValue: 25 }',
    '{ name: "dimFactor", label: "DIM Factor", type: "number", min: 100, max: 250, defaultValue: 139 }'
  ],
  `(inputs) => {
    const length = inputs.length as number;
    const width = inputs.width as number;
    const height = inputs.height as number;
    const actualWeight = inputs.actualWeight as number;
    const dimFactor = inputs.dimFactor as number;
    const cubicInches = length * width * height;
    const dimWeight = cubicInches / dimFactor;
    const billableWeight = Math.max(actualWeight, dimWeight);
    const useDim = dimWeight > actualWeight;
    return {
      primary: { label: "Billable Weight (lbs)", value: formatNumber(billableWeight) },
      details: [
        { label: "Dimensional Weight (lbs)", value: formatNumber(dimWeight) },
        { label: "Actual Weight (lbs)", value: formatNumber(actualWeight) },
        { label: "Cubic Inches", value: formatNumber(cubicInches) },
        { label: "Billed By", value: useDim ? "DIM Weight" : "Actual Weight" }
      ]
    };
  }`,
  [
    { q: "What is dimensional weight?", a: "A pricing method based on package volume rather than actual weight." },
    { q: "What DIM factor should I use?", a: "UPS and FedEx typically use 139 for domestic shipments." }
  ],
  "DIM Weight = (L x W x H) / DIM Factor",
  ["freight-class-calculator", "container-load-calculator", "cbm-calculator"]
);

add(
  "ltl-freight-cost-calculator",
  "LTL Freight Cost Calculator",
  "Estimate less-than-truckload shipping costs.",
  "Finance",
  "$",
  "DollarSign",
  ["LTL", "freight", "cost", "shipping", "trucking"],
  [
    '{ name: "weight", label: "Weight (lbs)", type: "number", min: 1, max: 20000, defaultValue: 1000 }',
    '{ name: "distance", label: "Distance (miles)", type: "number", min: 1, max: 5000, defaultValue: 500 }',
    '{ name: "freightClass", label: "Freight Class", type: "number", min: 50, max: 500, defaultValue: 100 }',
    '{ name: "ratePerCwt", label: "Rate per CWT ($)", type: "number", min: 1, max: 500, defaultValue: 25 }',
    '{ name: "fuelSurchargePercent", label: "Fuel Surcharge (%)", type: "number", min: 0, max: 50, defaultValue: 15 }'
  ],
  `(inputs) => {
    const weight = inputs.weight as number;
    const distance = inputs.distance as number;
    const freightClass = inputs.freightClass as number;
    const ratePerCwt = inputs.ratePerCwt as number;
    const fuelSurchargePercent = inputs.fuelSurchargePercent as number;
    const cwt = weight / 100;
    const baseCharge = cwt * ratePerCwt;
    const fuelSurcharge = baseCharge * (fuelSurchargePercent / 100);
    const totalCost = baseCharge + fuelSurcharge;
    const costPerPound = totalCost / weight;
    return {
      primary: { label: "Total LTL Cost", value: "$" + formatNumber(totalCost) },
      details: [
        { label: "Base Charge", value: "$" + formatNumber(baseCharge) },
        { label: "Fuel Surcharge", value: "$" + formatNumber(fuelSurcharge) },
        { label: "Cost Per Pound", value: "$" + formatNumber(costPerPound) },
        { label: "CWT (Hundredweight)", value: formatNumber(cwt) }
      ]
    };
  }`,
  [
    { q: "What is LTL freight?", a: "Less-than-truckload shipping for loads that do not fill an entire trailer." },
    { q: "What is CWT?", a: "CWT stands for hundredweight and equals 100 pounds." }
  ],
  "Total = (Weight / 100) x Rate per CWT x (1 + Fuel Surcharge %)",
  ["freight-class-calculator", "fuel-surcharge-calculator", "deadhead-miles-calculator"]
);

add(
  "warehouse-space-calculator",
  "Warehouse Space Calculator",
  "Calculate the warehouse square footage needed for inventory.",
  "Everyday",
  "~",
  "Warehouse",
  ["warehouse", "space", "storage", "sqft", "inventory"],
  [
    '{ name: "palletCount", label: "Number of Pallets", type: "number", min: 1, max: 100000, defaultValue: 500 }',
    '{ name: "palletSqft", label: "Pallet Footprint (sq ft)", type: "number", min: 1, max: 100, defaultValue: 13.33 }',
    '{ name: "stackHeight", label: "Stack Height (levels)", type: "number", min: 1, max: 10, defaultValue: 3 }',
    '{ name: "aislePercent", label: "Aisle Space (%)", type: "number", min: 10, max: 60, defaultValue: 40 }'
  ],
  `(inputs) => {
    const palletCount = inputs.palletCount as number;
    const palletSqft = inputs.palletSqft as number;
    const stackHeight = inputs.stackHeight as number;
    const aislePercent = inputs.aislePercent as number;
    const storageFloorSqft = (palletCount / stackHeight) * palletSqft;
    const aisleSqft = storageFloorSqft * (aislePercent / 100);
    const totalSqft = storageFloorSqft + aisleSqft;
    return {
      primary: { label: "Total Warehouse Sq Ft Needed", value: formatNumber(totalSqft) },
      details: [
        { label: "Storage Floor Area (sq ft)", value: formatNumber(storageFloorSqft) },
        { label: "Aisle Area (sq ft)", value: formatNumber(aisleSqft) },
        { label: "Pallet Positions on Floor", value: formatNumber(palletCount / stackHeight) }
      ]
    };
  }`,
  [
    { q: "How much warehouse space do I need?", a: "Divide pallets by stack height, multiply by footprint, and add aisle space." },
    { q: "What percentage of warehouse is aisles?", a: "Typically 35 to 45 percent of total floor area is used for aisles." }
  ],
  "Total Sq Ft = (Pallets / Stack Height) x Footprint x (1 + Aisle %)",
  ["pallet-load-calculator", "pick-pack-time-calculator", "container-load-calculator"]
);

add(
  "pick-pack-time-calculator",
  "Pick and Pack Time Calculator",
  "Estimate order fulfillment pick and pack time.",
  "Everyday",
  "~",
  "Clock",
  ["pick", "pack", "fulfillment", "warehouse", "order"],
  [
    '{ name: "orderCount", label: "Number of Orders", type: "number", min: 1, max: 10000, defaultValue: 100 }',
    '{ name: "itemsPerOrder", label: "Avg Items Per Order", type: "number", min: 1, max: 100, defaultValue: 5 }',
    '{ name: "pickTimePerItem", label: "Pick Time Per Item (sec)", type: "number", min: 1, max: 300, defaultValue: 30 }',
    '{ name: "packTimePerOrder", label: "Pack Time Per Order (sec)", type: "number", min: 10, max: 600, defaultValue: 120 }',
    '{ name: "workers", label: "Number of Workers", type: "number", min: 1, max: 100, defaultValue: 5 }'
  ],
  `(inputs) => {
    const orderCount = inputs.orderCount as number;
    const itemsPerOrder = inputs.itemsPerOrder as number;
    const pickTimePerItem = inputs.pickTimePerItem as number;
    const packTimePerOrder = inputs.packTimePerOrder as number;
    const workers = inputs.workers as number;
    const totalItems = orderCount * itemsPerOrder;
    const totalPickSec = totalItems * pickTimePerItem;
    const totalPackSec = orderCount * packTimePerOrder;
    const totalSec = totalPickSec + totalPackSec;
    const totalHours = totalSec / 3600;
    const hoursPerWorker = totalHours / workers;
    return {
      primary: { label: "Total Fulfillment Time (hrs)", value: formatNumber(totalHours) },
      details: [
        { label: "Hours Per Worker", value: formatNumber(hoursPerWorker) },
        { label: "Total Pick Time (hrs)", value: formatNumber(totalPickSec / 3600) },
        { label: "Total Pack Time (hrs)", value: formatNumber(totalPackSec / 3600) },
        { label: "Total Items to Pick", value: formatNumber(totalItems) }
      ]
    };
  }`,
  [
    { q: "How do I estimate pick and pack time?", a: "Multiply items by pick time, add pack time per order, then divide by workers." },
    { q: "What is a good pick rate?", a: "A typical manual pick rate is 60 to 120 items per hour per worker." }
  ],
  "Total Time = (Items x Pick Time + Orders x Pack Time) / Workers",
  ["warehouse-space-calculator", "pallet-load-calculator", "conveyor-speed-calculator"]
);

add(
  "forklift-capacity-calculator",
  "Forklift Capacity Calculator",
  "Calculate forklift load capacity at a given load center.",
  "Science",
  "A",
  "Truck",
  ["forklift", "capacity", "load", "center", "lifting"],
  [
    '{ name: "ratedCapacity", label: "Rated Capacity (lbs)", type: "number", min: 1000, max: 100000, defaultValue: 5000 }',
    '{ name: "ratedLoadCenter", label: "Rated Load Center (in)", type: "number", min: 12, max: 60, defaultValue: 24 }',
    '{ name: "actualLoadCenter", label: "Actual Load Center (in)", type: "number", min: 12, max: 120, defaultValue: 30 }'
  ],
  `(inputs) => {
    const ratedCapacity = inputs.ratedCapacity as number;
    const ratedLoadCenter = inputs.ratedLoadCenter as number;
    const actualLoadCenter = inputs.actualLoadCenter as number;
    const actualCapacity = (ratedCapacity * ratedLoadCenter) / actualLoadCenter;
    const capacityLoss = ratedCapacity - actualCapacity;
    const percentOfRated = (actualCapacity / ratedCapacity) * 100;
    return {
      primary: { label: "Actual Capacity (lbs)", value: formatNumber(actualCapacity) },
      details: [
        { label: "Rated Capacity (lbs)", value: formatNumber(ratedCapacity) },
        { label: "Capacity Reduction (lbs)", value: formatNumber(capacityLoss) },
        { label: "Percent of Rated", value: formatNumber(percentOfRated) + "%" }
      ]
    };
  }`,
  [
    { q: "What is load center on a forklift?", a: "The horizontal distance from the fork face to the center of gravity of the load." },
    { q: "How does load center affect capacity?", a: "As load center increases, the effective lifting capacity decreases." }
  ],
  "Actual Capacity = Rated Capacity x Rated Center / Actual Center",
  ["pallet-load-calculator", "trailer-tongue-weight-calculator", "towing-capacity-calculator"]
);

add(
  "conveyor-speed-calculator",
  "Conveyor Speed Calculator",
  "Calculate conveyor belt throughput and speed.",
  "Science",
  "A",
  "Activity",
  ["conveyor", "belt", "speed", "throughput", "material"],
  [
    '{ name: "beltSpeed", label: "Belt Speed (ft/min)", type: "number", min: 1, max: 2000, defaultValue: 100 }',
    '{ name: "beltWidth", label: "Belt Width (in)", type: "number", min: 6, max: 96, defaultValue: 24 }',
    '{ name: "materialDepth", label: "Material Depth (in)", type: "number", min: 0.5, max: 24, defaultValue: 3 }',
    '{ name: "materialDensity", label: "Material Density (lbs/cu ft)", type: "number", min: 1, max: 200, defaultValue: 50 }'
  ],
  `(inputs) => {
    const beltSpeed = inputs.beltSpeed as number;
    const beltWidth = inputs.beltWidth as number;
    const materialDepth = inputs.materialDepth as number;
    const materialDensity = inputs.materialDensity as number;
    const crossSectionSqFt = (beltWidth / 12) * (materialDepth / 12);
    const volumePerMin = crossSectionSqFt * beltSpeed;
    const volumePerHour = volumePerMin * 60;
    const tonsPerHour = (volumePerHour * materialDensity) / 2000;
    return {
      primary: { label: "Throughput (tons/hr)", value: formatNumber(tonsPerHour) },
      details: [
        { label: "Volume Per Minute (cu ft)", value: formatNumber(volumePerMin) },
        { label: "Volume Per Hour (cu ft)", value: formatNumber(volumePerHour) },
        { label: "Cross Section (sq ft)", value: formatNumber(crossSectionSqFt) }
      ]
    };
  }`,
  [
    { q: "How is conveyor throughput calculated?", a: "Multiply cross-sectional area by belt speed and material density." },
    { q: "What is a typical conveyor belt speed?", a: "Common speeds range from 50 to 400 feet per minute depending on the application." }
  ],
  "Tons/hr = Belt Width x Depth x Speed x Density / 2000",
  ["pick-pack-time-calculator", "warehouse-space-calculator", "forklift-capacity-calculator"]
);

add(
  "fleet-fuel-cost-calculator",
  "Fleet Fuel Cost Calculator",
  "Calculate total fuel cost for a vehicle fleet.",
  "Finance",
  "$",
  "DollarSign",
  ["fleet", "fuel", "cost", "vehicles", "mileage"],
  [
    '{ name: "vehicleCount", label: "Number of Vehicles", type: "number", min: 1, max: 10000, defaultValue: 20 }',
    '{ name: "milesPerVehicle", label: "Miles Per Vehicle/Month", type: "number", min: 100, max: 50000, defaultValue: 5000 }',
    '{ name: "mpg", label: "Average MPG", type: "number", min: 1, max: 100, defaultValue: 8 }',
    '{ name: "fuelPrice", label: "Fuel Price ($/gal)", type: "number", min: 0.5, max: 15, defaultValue: 3.75 }'
  ],
  `(inputs) => {
    const vehicleCount = inputs.vehicleCount as number;
    const milesPerVehicle = inputs.milesPerVehicle as number;
    const mpg = inputs.mpg as number;
    const fuelPrice = inputs.fuelPrice as number;
    const totalMiles = vehicleCount * milesPerVehicle;
    const totalGallons = totalMiles / mpg;
    const totalCost = totalGallons * fuelPrice;
    const costPerVehicle = totalCost / vehicleCount;
    const costPerMile = totalCost / totalMiles;
    return {
      primary: { label: "Total Monthly Fuel Cost", value: "$" + formatNumber(totalCost) },
      details: [
        { label: "Cost Per Vehicle", value: "$" + formatNumber(costPerVehicle) },
        { label: "Cost Per Mile", value: "$" + formatNumber(costPerMile) },
        { label: "Total Gallons", value: formatNumber(totalGallons) },
        { label: "Total Fleet Miles", value: formatNumber(totalMiles) }
      ]
    };
  }`,
  [
    { q: "How do I calculate fleet fuel cost?", a: "Multiply total miles by fuel price and divide by average miles per gallon." },
    { q: "What is a good MPG for trucks?", a: "Class 8 trucks average 5 to 8 MPG while delivery vans get 10 to 15 MPG." }
  ],
  "Total Cost = (Vehicles x Miles / MPG) x Fuel Price",
  ["fuel-surcharge-calculator", "deadhead-miles-calculator", "vehicle-depreciation-schedule-calculator"]
);

add(
  "vehicle-depreciation-schedule-calculator",
  "Vehicle Depreciation Schedule Calculator",
  "Calculate fleet vehicle depreciation over time.",
  "Finance",
  "$",
  "TrendingDown",
  ["vehicle", "depreciation", "fleet", "asset", "schedule"],
  [
    '{ name: "purchasePrice", label: "Purchase Price ($)", type: "number", min: 1000, max: 500000, defaultValue: 80000 }',
    '{ name: "salvageValue", label: "Salvage Value ($)", type: "number", min: 0, max: 200000, defaultValue: 15000 }',
    '{ name: "usefulLifeYears", label: "Useful Life (years)", type: "number", min: 1, max: 30, defaultValue: 7 }',
    '{ name: "currentYear", label: "Current Year Number", type: "number", min: 1, max: 30, defaultValue: 1 }'
  ],
  `(inputs) => {
    const purchasePrice = inputs.purchasePrice as number;
    const salvageValue = inputs.salvageValue as number;
    const usefulLifeYears = inputs.usefulLifeYears as number;
    const currentYear = inputs.currentYear as number;
    const depreciableAmount = purchasePrice - salvageValue;
    const annualDepreciation = depreciableAmount / usefulLifeYears;
    const accumulatedDep = Math.min(annualDepreciation * currentYear, depreciableAmount);
    const bookValue = purchasePrice - accumulatedDep;
    return {
      primary: { label: "Current Book Value", value: "$" + formatNumber(bookValue) },
      details: [
        { label: "Annual Depreciation", value: "$" + formatNumber(annualDepreciation) },
        { label: "Accumulated Depreciation", value: "$" + formatNumber(accumulatedDep) },
        { label: "Depreciable Amount", value: "$" + formatNumber(depreciableAmount) }
      ]
    };
  }`,
  [
    { q: "How is straight-line depreciation calculated?", a: "Subtract salvage value from cost and divide by the useful life in years." },
    { q: "What is useful life for a fleet truck?", a: "Fleet trucks are commonly depreciated over 5 to 10 years." }
  ],
  "Annual Depreciation = (Purchase Price - Salvage Value) / Useful Life",
  ["fleet-fuel-cost-calculator", "brake-pad-life-calculator", "tire-rotation-schedule-calculator"]
);

add(
  "tire-rotation-schedule-calculator",
  "Tire Rotation Schedule Calculator",
  "Calculate when your next tire rotation is due.",
  "Everyday",
  "~",
  "RefreshCw",
  ["tire", "rotation", "schedule", "mileage", "maintenance"],
  [
    '{ name: "currentMileage", label: "Current Mileage", type: "number", min: 0, max: 1000000, defaultValue: 35000 }',
    '{ name: "lastRotationMileage", label: "Last Rotation Mileage", type: "number", min: 0, max: 1000000, defaultValue: 30000 }',
    '{ name: "rotationInterval", label: "Rotation Interval (miles)", type: "number", min: 3000, max: 15000, defaultValue: 7500 }',
    '{ name: "monthlyMiles", label: "Monthly Miles Driven", type: "number", min: 100, max: 10000, defaultValue: 1200 }'
  ],
  `(inputs) => {
    const currentMileage = inputs.currentMileage as number;
    const lastRotationMileage = inputs.lastRotationMileage as number;
    const rotationInterval = inputs.rotationInterval as number;
    const monthlyMiles = inputs.monthlyMiles as number;
    const milesSinceLast = currentMileage - lastRotationMileage;
    const milesUntilNext = rotationInterval - milesSinceLast;
    const nextRotationMileage = lastRotationMileage + rotationInterval;
    const monthsUntilDue = milesUntilNext > 0 ? milesUntilNext / monthlyMiles : 0;
    return {
      primary: { label: "Next Rotation At", value: formatNumber(nextRotationMileage) + " mi" },
      details: [
        { label: "Miles Since Last Rotation", value: formatNumber(milesSinceLast) },
        { label: "Miles Until Due", value: formatNumber(Math.max(milesUntilNext, 0)) },
        { label: "Months Until Due", value: formatNumber(monthsUntilDue) },
        { label: "Status", value: milesUntilNext <= 0 ? "Overdue" : "On Schedule" }
      ]
    };
  }`,
  [
    { q: "How often should I rotate tires?", a: "Most manufacturers recommend every 5000 to 7500 miles." },
    { q: "Why is tire rotation important?", a: "It promotes even tread wear and extends the life of your tires." }
  ],
  "Next Rotation = Last Rotation Mileage + Rotation Interval",
  ["oil-change-interval-calculator", "brake-pad-life-calculator", "vehicle-depreciation-schedule-calculator"]
);

add(
  "oil-change-interval-calculator",
  "Oil Change Interval Calculator",
  "Calculate when your next oil change is due.",
  "Everyday",
  "~",
  "Droplet",
  ["oil", "change", "interval", "maintenance", "engine"],
  [
    '{ name: "currentMileage", label: "Current Mileage", type: "number", min: 0, max: 1000000, defaultValue: 48000 }',
    '{ name: "lastChangeMileage", label: "Last Oil Change Mileage", type: "number", min: 0, max: 1000000, defaultValue: 43000 }',
    '{ name: "changeInterval", label: "Change Interval (miles)", type: "number", min: 1000, max: 20000, defaultValue: 5000 }',
    '{ name: "monthlyMiles", label: "Monthly Miles Driven", type: "number", min: 100, max: 10000, defaultValue: 1000 }',
    '{ name: "oilCost", label: "Oil Change Cost ($)", type: "number", min: 10, max: 500, defaultValue: 65 }'
  ],
  `(inputs) => {
    const currentMileage = inputs.currentMileage as number;
    const lastChangeMileage = inputs.lastChangeMileage as number;
    const changeInterval = inputs.changeInterval as number;
    const monthlyMiles = inputs.monthlyMiles as number;
    const oilCost = inputs.oilCost as number;
    const milesSinceLast = currentMileage - lastChangeMileage;
    const milesUntilNext = changeInterval - milesSinceLast;
    const nextChangeMileage = lastChangeMileage + changeInterval;
    const monthsUntilDue = milesUntilNext > 0 ? milesUntilNext / monthlyMiles : 0;
    const changesPerYear = (monthlyMiles * 12) / changeInterval;
    const annualCost = changesPerYear * oilCost;
    return {
      primary: { label: "Next Oil Change At", value: formatNumber(nextChangeMileage) + " mi" },
      details: [
        { label: "Miles Until Due", value: formatNumber(Math.max(milesUntilNext, 0)) },
        { label: "Months Until Due", value: formatNumber(monthsUntilDue) },
        { label: "Changes Per Year", value: formatNumber(changesPerYear) },
        { label: "Annual Oil Change Cost", value: "$" + formatNumber(annualCost) }
      ]
    };
  }`,
  [
    { q: "How often should I change my oil?", a: "Most modern vehicles need an oil change every 5000 to 7500 miles." },
    { q: "Does synthetic oil last longer?", a: "Yes, full synthetic oil can often go 7500 to 15000 miles between changes." }
  ],
  "Next Change = Last Change Mileage + Change Interval",
  ["tire-rotation-schedule-calculator", "brake-pad-life-calculator", "vehicle-depreciation-schedule-calculator"]
);

add(
  "brake-pad-life-calculator",
  "Brake Pad Life Calculator",
  "Estimate when brake pads need replacement.",
  "Everyday",
  "~",
  "AlertCircle",
  ["brake", "pad", "life", "replacement", "wear"],
  [
    '{ name: "currentThickness", label: "Current Thickness (mm)", type: "number", min: 1, max: 15, defaultValue: 6 }',
    '{ name: "newThickness", label: "New Pad Thickness (mm)", type: "number", min: 8, max: 15, defaultValue: 12 }',
    '{ name: "minThickness", label: "Min Safe Thickness (mm)", type: "number", min: 1, max: 5, defaultValue: 3 }',
    '{ name: "currentMileage", label: "Current Mileage", type: "number", min: 0, max: 1000000, defaultValue: 45000 }',
    '{ name: "installMileage", label: "Install Mileage", type: "number", min: 0, max: 1000000, defaultValue: 30000 }'
  ],
  `(inputs) => {
    const currentThickness = inputs.currentThickness as number;
    const newThickness = inputs.newThickness as number;
    const minThickness = inputs.minThickness as number;
    const currentMileage = inputs.currentMileage as number;
    const installMileage = inputs.installMileage as number;
    const milesDriven = currentMileage - installMileage;
    const wornMm = newThickness - currentThickness;
    const wearRatePerMile = wornMm / milesDriven;
    const remainingMm = currentThickness - minThickness;
    const milesRemaining = remainingMm / wearRatePerMile;
    const replacementMileage = currentMileage + milesRemaining;
    const percentWorn = (wornMm / (newThickness - minThickness)) * 100;
    return {
      primary: { label: "Replace At Mileage", value: formatNumber(replacementMileage) + " mi" },
      details: [
        { label: "Miles Remaining", value: formatNumber(milesRemaining) },
        { label: "Percent Worn", value: formatNumber(percentWorn) + "%" },
        { label: "Remaining Thickness (mm)", value: formatNumber(remainingMm) },
        { label: "Wear Rate (mm/1000 mi)", value: formatNumber(wearRatePerMile * 1000) }
      ]
    };
  }`,
  [
    { q: "When should brake pads be replaced?", a: "Replace them when thickness reaches 3 mm or less." },
    { q: "How long do brake pads last?", a: "Brake pads typically last 25000 to 70000 miles depending on driving habits." }
  ],
  "Miles Remaining = (Current - Min Thickness) / Wear Rate Per Mile",
  ["tire-rotation-schedule-calculator", "oil-change-interval-calculator", "vehicle-depreciation-schedule-calculator"]
);

add(
  "trailer-tongue-weight-calculator",
  "Trailer Tongue Weight Calculator",
  "Calculate tongue weight for safe towing.",
  "Science",
  "A",
  "Scale",
  ["tongue", "weight", "trailer", "towing", "hitch"],
  [
    '{ name: "trailerWeight", label: "Loaded Trailer Weight (lbs)", type: "number", min: 100, max: 50000, defaultValue: 5000 }',
    '{ name: "tonguePercent", label: "Target Tongue Weight (%)", type: "number", min: 5, max: 25, defaultValue: 12 }',
    '{ name: "hitchRating", label: "Hitch Rating (lbs)", type: "number", min: 100, max: 20000, defaultValue: 800 }'
  ],
  `(inputs) => {
    const trailerWeight = inputs.trailerWeight as number;
    const tonguePercent = inputs.tonguePercent as number;
    const hitchRating = inputs.hitchRating as number;
    const tongueWeight = trailerWeight * (tonguePercent / 100);
    const isSafe = tongueWeight <= hitchRating;
    const margin = hitchRating - tongueWeight;
    const actualPercent = (tongueWeight / trailerWeight) * 100;
    return {
      primary: { label: "Tongue Weight (lbs)", value: formatNumber(tongueWeight) },
      details: [
        { label: "Tongue Weight Percent", value: formatNumber(actualPercent) + "%" },
        { label: "Hitch Rating (lbs)", value: formatNumber(hitchRating) },
        { label: "Safety Margin (lbs)", value: formatNumber(margin) },
        { label: "Status", value: isSafe ? "Within Rating" : "Exceeds Hitch Rating" }
      ]
    };
  }`,
  [
    { q: "What is the ideal tongue weight?", a: "Tongue weight should be 10 to 15 percent of total loaded trailer weight." },
    { q: "What happens with too little tongue weight?", a: "Too little tongue weight can cause trailer sway and loss of control." }
  ],
  "Tongue Weight = Trailer Weight x Tongue Weight Percentage",
  ["towing-capacity-calculator", "forklift-capacity-calculator", "container-weight-calculator"]
);

add(
  "towing-capacity-calculator",
  "Towing Capacity Calculator",
  "Check if your vehicle can safely tow a load.",
  "Everyday",
  "~",
  "Truck",
  ["towing", "capacity", "vehicle", "trailer", "weight"],
  [
    '{ name: "gcwr", label: "GCWR (lbs)", type: "number", min: 5000, max: 50000, defaultValue: 15000 }',
    '{ name: "curbWeight", label: "Vehicle Curb Weight (lbs)", type: "number", min: 2000, max: 15000, defaultValue: 5500 }',
    '{ name: "passengers", label: "Passenger Weight (lbs)", type: "number", min: 0, max: 2000, defaultValue: 350 }',
    '{ name: "cargo", label: "Cargo in Vehicle (lbs)", type: "number", min: 0, max: 5000, defaultValue: 200 }',
    '{ name: "trailerWeight", label: "Loaded Trailer Weight (lbs)", type: "number", min: 100, max: 40000, defaultValue: 6000 }'
  ],
  `(inputs) => {
    const gcwr = inputs.gcwr as number;
    const curbWeight = inputs.curbWeight as number;
    const passengers = inputs.passengers as number;
    const cargo = inputs.cargo as number;
    const trailerWeight = inputs.trailerWeight as number;
    const vehicleLoaded = curbWeight + passengers + cargo;
    const totalCombined = vehicleLoaded + trailerWeight;
    const maxTowCapacity = gcwr - vehicleLoaded;
    const remaining = gcwr - totalCombined;
    const isSafe = remaining >= 0;
    return {
      primary: { label: "Max Tow Capacity (lbs)", value: formatNumber(maxTowCapacity) },
      details: [
        { label: "Total Combined Weight (lbs)", value: formatNumber(totalCombined) },
        { label: "GCWR (lbs)", value: formatNumber(gcwr) },
        { label: "Remaining Capacity (lbs)", value: formatNumber(remaining) },
        { label: "Status", value: isSafe ? "Safe to Tow" : "Exceeds GCWR" }
      ]
    };
  }`,
  [
    { q: "What is GCWR?", a: "Gross Combined Weight Rating is the max total weight of vehicle, cargo, and trailer." },
    { q: "How do I find my towing capacity?", a: "Subtract your loaded vehicle weight from the GCWR listed by the manufacturer." }
  ],
  "Max Tow Capacity = GCWR - (Curb Weight + Passengers + Cargo)",
  ["trailer-tongue-weight-calculator", "container-weight-calculator", "forklift-capacity-calculator"]
);

add(
  "fuel-surcharge-calculator",
  "Fuel Surcharge Calculator",
  "Calculate the fuel surcharge percentage for freight.",
  "Finance",
  "$",
  "DollarSign",
  ["fuel", "surcharge", "freight", "shipping", "diesel"],
  [
    '{ name: "currentFuelPrice", label: "Current Fuel Price ($/gal)", type: "number", min: 1, max: 15, defaultValue: 4.25 }',
    '{ name: "baseFuelPrice", label: "Base Fuel Price ($/gal)", type: "number", min: 1, max: 10, defaultValue: 1.25 }',
    '{ name: "mpg", label: "Vehicle MPG", type: "number", min: 1, max: 50, defaultValue: 6 }',
    '{ name: "lineHaul", label: "Line Haul Charge ($)", type: "number", min: 100, max: 100000, defaultValue: 2500 }'
  ],
  `(inputs) => {
    const currentFuelPrice = inputs.currentFuelPrice as number;
    const baseFuelPrice = inputs.baseFuelPrice as number;
    const mpg = inputs.mpg as number;
    const lineHaul = inputs.lineHaul as number;
    const priceDiff = currentFuelPrice - baseFuelPrice;
    const surchargePercent = (priceDiff / mpg) / (baseFuelPrice / mpg) * 100;
    const surchargeAmount = lineHaul * (surchargePercent / 100);
    const totalCharge = lineHaul + surchargeAmount;
    return {
      primary: { label: "Fuel Surcharge", value: formatNumber(surchargePercent) + "%" },
      details: [
        { label: "Surcharge Amount", value: "$" + formatNumber(surchargeAmount) },
        { label: "Total with Surcharge", value: "$" + formatNumber(totalCharge) },
        { label: "Fuel Price Difference", value: "$" + formatNumber(priceDiff) },
        { label: "Line Haul Charge", value: "$" + formatNumber(lineHaul) }
      ]
    };
  }`,
  [
    { q: "How is fuel surcharge calculated?", a: "It is based on the difference between current and base fuel prices." },
    { q: "What is the base fuel price?", a: "A threshold price set by the carrier below which no surcharge applies." }
  ],
  "Surcharge % = ((Current - Base Fuel Price) / Base Price) x 100",
  ["fleet-fuel-cost-calculator", "ltl-freight-cost-calculator", "deadhead-miles-calculator"]
);

add(
  "deadhead-miles-calculator",
  "Deadhead Miles Calculator",
  "Calculate the cost of empty return miles.",
  "Finance",
  "$",
  "DollarSign",
  ["deadhead", "empty", "miles", "trucking", "cost"],
  [
    '{ name: "totalMiles", label: "Total Trip Miles", type: "number", min: 1, max: 10000, defaultValue: 800 }',
    '{ name: "loadedMiles", label: "Loaded Miles", type: "number", min: 0, max: 10000, defaultValue: 600 }',
    '{ name: "costPerMile", label: "Operating Cost Per Mile ($)", type: "number", min: 0.5, max: 10, defaultValue: 1.85 }',
    '{ name: "revenuePerLoadedMile", label: "Revenue Per Loaded Mile ($)", type: "number", min: 0.5, max: 20, defaultValue: 3.00 }'
  ],
  `(inputs) => {
    const totalMiles = inputs.totalMiles as number;
    const loadedMiles = inputs.loadedMiles as number;
    const costPerMile = inputs.costPerMile as number;
    const revenuePerLoadedMile = inputs.revenuePerLoadedMile as number;
    const deadheadMiles = totalMiles - loadedMiles;
    const deadheadPercent = (deadheadMiles / totalMiles) * 100;
    const deadheadCost = deadheadMiles * costPerMile;
    const revenue = loadedMiles * revenuePerLoadedMile;
    const totalOperatingCost = totalMiles * costPerMile;
    const netProfit = revenue - totalOperatingCost;
    return {
      primary: { label: "Deadhead Cost", value: "$" + formatNumber(deadheadCost) },
      details: [
        { label: "Deadhead Miles", value: formatNumber(deadheadMiles) },
        { label: "Deadhead Percentage", value: formatNumber(deadheadPercent) + "%" },
        { label: "Trip Revenue", value: "$" + formatNumber(revenue) },
        { label: "Net Profit", value: "$" + formatNumber(netProfit) }
      ]
    };
  }`,
  [
    { q: "What are deadhead miles?", a: "Miles driven without any cargo, generating no revenue for the carrier." },
    { q: "What is a good deadhead percentage?", a: "Most carriers aim to keep deadhead miles below 15 percent of total." }
  ],
  "Deadhead Cost = (Total Miles - Loaded Miles) x Cost Per Mile",
  ["fleet-fuel-cost-calculator", "fuel-surcharge-calculator", "driver-pay-calculator"]
);

add(
  "driver-pay-calculator",
  "Driver Pay Calculator",
  "Estimate truck driver pay for a trip or period.",
  "Finance",
  "$",
  "DollarSign",
  ["driver", "pay", "trucking", "salary", "wages"],
  [
    '{ name: "payType", label: "Pay Type", type: "select", options: [{ value: "mile", label: "Per Mile" }, { value: "hour", label: "Per Hour" }, { value: "percent", label: "Percent of Load" }] }',
    '{ name: "rate", label: "Rate ($/mi, $/hr, or %)", type: "number", min: 0.1, max: 100, defaultValue: 0.55 }',
    '{ name: "miles", label: "Total Miles", type: "number", min: 0, max: 20000, defaultValue: 2500 }',
    '{ name: "hours", label: "Total Hours", type: "number", min: 0, max: 500, defaultValue: 50 }',
    '{ name: "loadRevenue", label: "Load Revenue ($)", type: "number", min: 0, max: 100000, defaultValue: 5000 }'
  ],
  `(inputs) => {
    const payType = inputs.payType as string;
    const rate = inputs.rate as number;
    const miles = inputs.miles as number;
    const hours = inputs.hours as number;
    const loadRevenue = inputs.loadRevenue as number;
    let grossPay = 0;
    if (payType === "mile") {
      grossPay = rate * miles;
    } else if (payType === "hour") {
      grossPay = rate * hours;
    } else {
      grossPay = loadRevenue * (rate / 100);
    }
    const effectivePerMile = miles > 0 ? grossPay / miles : 0;
    const effectivePerHour = hours > 0 ? grossPay / hours : 0;
    return {
      primary: { label: "Gross Pay", value: "$" + formatNumber(grossPay) },
      details: [
        { label: "Pay Type", value: payType === "mile" ? "Per Mile" : payType === "hour" ? "Per Hour" : "Percent of Load" },
        { label: "Effective $/Mile", value: "$" + formatNumber(effectivePerMile) },
        { label: "Effective $/Hour", value: "$" + formatNumber(effectivePerHour) },
        { label: "Total Miles", value: formatNumber(miles) }
      ]
    };
  }`,
  [
    { q: "How are truck drivers paid?", a: "Common methods include per mile, per hour, or a percentage of load revenue." },
    { q: "What is average truck driver pay per mile?", a: "Company drivers typically earn 0.45 to 0.65 per mile." }
  ],
  "Gross Pay = Rate x Miles (or Hours or % of Revenue)",
  ["deadhead-miles-calculator", "eld-hours-calculator", "fleet-fuel-cost-calculator"]
);

add(
  "eld-hours-calculator",
  "ELD Hours of Service Calculator",
  "Calculate remaining ELD hours of service.",
  "Everyday",
  "~",
  "Clock",
  ["ELD", "hours", "service", "driving", "HOS"],
  [
    '{ name: "drivingUsed", label: "Driving Hours Used Today", type: "number", min: 0, max: 11, defaultValue: 6 }',
    '{ name: "onDutyUsed", label: "On-Duty Hours Used Today", type: "number", min: 0, max: 14, defaultValue: 8 }',
    '{ name: "cycleUsed", label: "70-Hr Cycle Hours Used", type: "number", min: 0, max: 70, defaultValue: 45 }',
    '{ name: "avgSpeed", label: "Average Speed (mph)", type: "number", min: 10, max: 80, defaultValue: 55 }'
  ],
  `(inputs) => {
    const drivingUsed = inputs.drivingUsed as number;
    const onDutyUsed = inputs.onDutyUsed as number;
    const cycleUsed = inputs.cycleUsed as number;
    const avgSpeed = inputs.avgSpeed as number;
    const drivingRemain = 11 - drivingUsed;
    const onDutyRemain = 14 - onDutyUsed;
    const cycleRemain = 70 - cycleUsed;
    const effectiveRemain = Math.min(drivingRemain, onDutyRemain, cycleRemain);
    const milesRemaining = effectiveRemain * avgSpeed;
    return {
      primary: { label: "Effective Hours Remaining", value: formatNumber(effectiveRemain) + " hrs" },
      details: [
        { label: "Driving Hours Left (11-hr)", value: formatNumber(drivingRemain) },
        { label: "On-Duty Hours Left (14-hr)", value: formatNumber(onDutyRemain) },
        { label: "Cycle Hours Left (70-hr)", value: formatNumber(cycleRemain) },
        { label: "Estimated Miles Remaining", value: formatNumber(milesRemaining) }
      ]
    };
  }`,
  [
    { q: "What are ELD hours of service rules?", a: "Drivers may drive 11 hours within a 14-hour on-duty window after 10 hours off." },
    { q: "What is the 70-hour rule?", a: "Drivers cannot exceed 70 hours of on-duty time in 8 consecutive days." }
  ],
  "Effective Remaining = min(11 - Driving, 14 - OnDuty, 70 - Cycle)",
  ["driver-pay-calculator", "deadhead-miles-calculator", "fleet-fuel-cost-calculator"]
);

add(
  "customs-duty-calculator",
  "Customs Duty Calculator",
  "Estimate import customs duty for goods.",
  "Finance",
  "$",
  "DollarSign",
  ["customs", "duty", "import", "tariff", "trade"],
  [
    '{ name: "goodsValue", label: "Value of Goods ($)", type: "number", min: 1, max: 10000000, defaultValue: 10000 }',
    '{ name: "dutyRate", label: "Duty Rate (%)", type: "number", min: 0, max: 100, defaultValue: 5 }',
    '{ name: "freightCost", label: "Freight Cost ($)", type: "number", min: 0, max: 500000, defaultValue: 1500 }',
    '{ name: "insuranceCost", label: "Insurance Cost ($)", type: "number", min: 0, max: 100000, defaultValue: 200 }'
  ],
  `(inputs) => {
    const goodsValue = inputs.goodsValue as number;
    const dutyRate = inputs.dutyRate as number;
    const freightCost = inputs.freightCost as number;
    const insuranceCost = inputs.insuranceCost as number;
    const cifValue = goodsValue + freightCost + insuranceCost;
    const dutyAmount = cifValue * (dutyRate / 100);
    const totalLandedCost = cifValue + dutyAmount;
    const effectiveDutyPercent = (dutyAmount / goodsValue) * 100;
    return {
      primary: { label: "Customs Duty", value: "$" + formatNumber(dutyAmount) },
      details: [
        { label: "CIF Value", value: "$" + formatNumber(cifValue) },
        { label: "Total After Duty", value: "$" + formatNumber(totalLandedCost) },
        { label: "Effective Duty on Goods", value: formatNumber(effectiveDutyPercent) + "%" },
        { label: "Duty Rate Applied", value: formatNumber(dutyRate) + "%" }
      ]
    };
  }`,
  [
    { q: "What is CIF value?", a: "CIF stands for Cost, Insurance, and Freight and is used as the duty basis." },
    { q: "How do I find the duty rate?", a: "Look up the Harmonized Tariff Schedule for your product classification." }
  ],
  "Duty = (Goods Value + Freight + Insurance) x Duty Rate",
  ["landed-cost-calculator", "cbm-calculator", "container-weight-calculator"]
);

add(
  "landed-cost-calculator",
  "Landed Cost Calculator",
  "Calculate total landed cost of imported goods.",
  "Finance",
  "$",
  "DollarSign",
  ["landed", "cost", "import", "shipping", "total"],
  [
    '{ name: "productCost", label: "Product Cost ($)", type: "number", min: 1, max: 10000000, defaultValue: 10000 }',
    '{ name: "shippingCost", label: "Shipping Cost ($)", type: "number", min: 0, max: 500000, defaultValue: 2000 }',
    '{ name: "insurance", label: "Insurance ($)", type: "number", min: 0, max: 100000, defaultValue: 300 }',
    '{ name: "customsDuty", label: "Customs Duty ($)", type: "number", min: 0, max: 1000000, defaultValue: 500 }',
    '{ name: "handlingFees", label: "Handling Fees ($)", type: "number", min: 0, max: 50000, defaultValue: 250 }',
    '{ name: "units", label: "Total Units", type: "number", min: 1, max: 1000000, defaultValue: 500 }'
  ],
  `(inputs) => {
    const productCost = inputs.productCost as number;
    const shippingCost = inputs.shippingCost as number;
    const insurance = inputs.insurance as number;
    const customsDuty = inputs.customsDuty as number;
    const handlingFees = inputs.handlingFees as number;
    const units = inputs.units as number;
    const totalLanded = productCost + shippingCost + insurance + customsDuty + handlingFees;
    const costPerUnit = totalLanded / units;
    const addonCosts = shippingCost + insurance + customsDuty + handlingFees;
    const addonPercent = (addonCosts / productCost) * 100;
    return {
      primary: { label: "Total Landed Cost", value: "$" + formatNumber(totalLanded) },
      details: [
        { label: "Cost Per Unit", value: "$" + formatNumber(costPerUnit) },
        { label: "Add-On Costs", value: "$" + formatNumber(addonCosts) },
        { label: "Add-On Percentage", value: formatNumber(addonPercent) + "%" },
        { label: "Product Cost", value: "$" + formatNumber(productCost) }
      ]
    };
  }`,
  [
    { q: "What is landed cost?", a: "The total cost of a product including purchase, shipping, duty, and fees." },
    { q: "Why is landed cost important?", a: "It gives the true cost of imported goods for accurate pricing and margins." }
  ],
  "Landed Cost = Product + Shipping + Insurance + Duty + Handling",
  ["customs-duty-calculator", "cbm-calculator", "ltl-freight-cost-calculator"]
);

add(
  "cbm-calculator",
  "CBM Calculator",
  "Calculate cubic meters for a shipment.",
  "Conversion",
  "R",
  "Box",
  ["CBM", "cubic", "meters", "shipment", "volume"],
  [
    '{ name: "length", label: "Length (cm)", type: "number", min: 1, max: 10000, defaultValue: 120 }',
    '{ name: "width", label: "Width (cm)", type: "number", min: 1, max: 10000, defaultValue: 80 }',
    '{ name: "height", label: "Height (cm)", type: "number", min: 1, max: 10000, defaultValue: 60 }',
    '{ name: "quantity", label: "Number of Packages", type: "number", min: 1, max: 100000, defaultValue: 10 }'
  ],
  `(inputs) => {
    const length = inputs.length as number;
    const width = inputs.width as number;
    const height = inputs.height as number;
    const quantity = inputs.quantity as number;
    const cbmPerUnit = (length * width * height) / 1000000;
    const totalCbm = cbmPerUnit * quantity;
    const cubicFeet = totalCbm * 35.3147;
    return {
      primary: { label: "Total CBM", value: formatNumber(totalCbm) + " m3" },
      details: [
        { label: "CBM Per Package", value: formatNumber(cbmPerUnit) },
        { label: "Total Cubic Feet", value: formatNumber(cubicFeet) },
        { label: "Number of Packages", value: formatNumber(quantity) }
      ]
    };
  }`,
  [
    { q: "What is CBM?", a: "CBM stands for cubic meter, the standard volume unit for international shipping." },
    { q: "How is CBM calculated?", a: "Multiply length by width by height in centimeters and divide by 1000000." }
  ],
  "CBM = (Length x Width x Height in cm) / 1,000,000",
  ["container-load-calculator", "dimensional-weight-calculator", "container-weight-calculator"]
);

add(
  "container-weight-calculator",
  "Container Weight Calculator",
  "Calculate shipping container gross weight.",
  "Everyday",
  "~",
  "Package",
  ["container", "weight", "gross", "tare", "shipping"],
  [
    '{ name: "tareWeight", label: "Container Tare Weight (lbs)", type: "number", min: 1000, max: 20000, defaultValue: 5070 }',
    '{ name: "cargoWeight", label: "Cargo Weight (lbs)", type: "number", min: 0, max: 100000, defaultValue: 35000 }',
    '{ name: "maxGross", label: "Max Gross Weight (lbs)", type: "number", min: 10000, max: 100000, defaultValue: 67200 }',
    '{ name: "palletCount", label: "Number of Pallets", type: "number", min: 0, max: 100, defaultValue: 20 }',
    '{ name: "palletWeight", label: "Pallet Weight Each (lbs)", type: "number", min: 0, max: 100, defaultValue: 40 }'
  ],
  `(inputs) => {
    const tareWeight = inputs.tareWeight as number;
    const cargoWeight = inputs.cargoWeight as number;
    const maxGross = inputs.maxGross as number;
    const palletCount = inputs.palletCount as number;
    const palletWeight = inputs.palletWeight as number;
    const totalPalletWeight = palletCount * palletWeight;
    const grossWeight = tareWeight + cargoWeight + totalPalletWeight;
    const remainingCapacity = maxGross - grossWeight;
    const utilization = (grossWeight / maxGross) * 100;
    return {
      primary: { label: "Gross Weight (lbs)", value: formatNumber(grossWeight) },
      details: [
        { label: "Cargo Weight (lbs)", value: formatNumber(cargoWeight) },
        { label: "Pallet Weight Total (lbs)", value: formatNumber(totalPalletWeight) },
        { label: "Remaining Capacity (lbs)", value: formatNumber(remainingCapacity) },
        { label: "Weight Utilization", value: formatNumber(utilization) + "%" }
      ]
    };
  }`,
  [
    { q: "What is tare weight?", a: "The weight of the empty container before any cargo is loaded." },
    { q: "What is the max weight for a 40-foot container?", a: "A standard 40-foot container has a max gross weight of about 67200 lbs." }
  ],
  "Gross Weight = Tare Weight + Cargo Weight + Pallet Weight",
  ["container-load-calculator", "cbm-calculator", "pallet-load-calculator"]
);

add(
  "palletizing-calculator",
  "Palletizing Calculator",
  "Calculate optimal pallet stacking layers and arrangement.",
  "Math",
  "+",
  "Layers",
  ["palletizing", "stacking", "layers", "arrangement", "boxes"],
  [
    '{ name: "palletLength", label: "Pallet Length (in)", type: "number", min: 1, max: 120, defaultValue: 48 }',
    '{ name: "palletWidth", label: "Pallet Width (in)", type: "number", min: 1, max: 120, defaultValue: 40 }',
    '{ name: "maxHeight", label: "Max Stack Height (in)", type: "number", min: 1, max: 120, defaultValue: 60 }',
    '{ name: "boxLength", label: "Box Length (in)", type: "number", min: 0.5, max: 60, defaultValue: 16 }',
    '{ name: "boxWidth", label: "Box Width (in)", type: "number", min: 0.5, max: 60, defaultValue: 12 }',
    '{ name: "boxHeight", label: "Box Height (in)", type: "number", min: 0.5, max: 60, defaultValue: 10 }',
    '{ name: "boxWeight", label: "Box Weight (lbs)", type: "number", min: 0.1, max: 500, defaultValue: 25 }'
  ],
  `(inputs) => {
    const palletLength = inputs.palletLength as number;
    const palletWidth = inputs.palletWidth as number;
    const maxHeight = inputs.maxHeight as number;
    const boxLength = inputs.boxLength as number;
    const boxWidth = inputs.boxWidth as number;
    const boxHeight = inputs.boxHeight as number;
    const boxWeight = inputs.boxWeight as number;
    const opt1Row = Math.floor(palletLength / boxLength);
    const opt1Col = Math.floor(palletWidth / boxWidth);
    const opt1PerLayer = opt1Row * opt1Col;
    const opt2Row = Math.floor(palletLength / boxWidth);
    const opt2Col = Math.floor(palletWidth / boxLength);
    const opt2PerLayer = opt2Row * opt2Col;
    const bestPerLayer = Math.max(opt1PerLayer, opt2PerLayer);
    const layers = Math.floor(maxHeight / boxHeight);
    const totalBoxes = bestPerLayer * layers;
    const totalWeight = totalBoxes * boxWeight;
    const palletArea = palletLength * palletWidth;
    const boxArea = bestPerLayer * boxLength * boxWidth;
    const areaUtil = Math.min((boxArea / palletArea) * 100, 100);
    return {
      primary: { label: "Total Boxes on Pallet", value: formatNumber(totalBoxes) },
      details: [
        { label: "Boxes Per Layer", value: formatNumber(bestPerLayer) },
        { label: "Number of Layers", value: formatNumber(layers) },
        { label: "Total Weight (lbs)", value: formatNumber(totalWeight) },
        { label: "Area Utilization", value: formatNumber(areaUtil) + "%" }
      ]
    };
  }`,
  [
    { q: "How do I optimize pallet stacking?", a: "Try both orientations of the box and choose the one that fits more per layer." },
    { q: "What limits pallet stacking height?", a: "Height is limited by warehouse clearance, weight, and box crush strength." }
  ],
  "Total = max(Orientation1, Orientation2) per Layer x Layers",
  ["pallet-load-calculator", "container-load-calculator", "warehouse-space-calculator"]
);
