add(
  "yarn-yardage-calculator",
  "Yarn Yardage Calculator",
  "Calculate how much yarn you need for knitting or crochet projects based on project type, size, and yarn weight.",
  "Everyday",
  "everyday",
  "~",
  ["yarn yardage", "knitting yarn calculator", "crochet yarn amount", "yarn estimator"],
  [
    '{ name: "projectType", label: "Project Type", type: "select", options: [{ value: "1", label: "Scarf" }, { value: "2", label: "Blanket" }, { value: "3", label: "Sweater" }, { value: "4", label: "Hat" }, { value: "5", label: "Socks" }], defaultValue: "1" }',
    '{ name: "yarnWeight", label: "Yarn Weight", type: "select", options: [{ value: "1", label: "Lace" }, { value: "2", label: "Fingering" }, { value: "3", label: "DK" }, { value: "4", label: "Worsted" }, { value: "5", label: "Bulky" }], defaultValue: "4" }',
    '{ name: "projectSize", label: "Project Size", type: "select", options: [{ value: "1", label: "Small" }, { value: "2", label: "Medium" }, { value: "3", label: "Large" }, { value: "4", label: "Extra Large" }], defaultValue: "2" }',
    '{ name: "skeinYardage", label: "Yards Per Skein", type: "number", min: 50, max: 1000, defaultValue: 220 }'
  ],
  `(inputs) => {
    const projectType = parseInt(inputs.projectType as string);
    const yarnWeight = parseInt(inputs.yarnWeight as string);
    const projectSize = parseInt(inputs.projectSize as string);
    const skeinYardage = inputs.skeinYardage as number;
    const baseYardage = { 1: 300, 2: 1200, 3: 1500, 4: 150, 5: 400 };
    const weightMultiplier = { 1: 1.6, 2: 1.3, 3: 1.0, 4: 0.85, 5: 0.65 };
    const sizeMultiplier = { 1: 0.7, 2: 1.0, 3: 1.3, 4: 1.6 };
    const base = baseYardage[projectType] || 300;
    const wMult = weightMultiplier[yarnWeight] || 1.0;
    const sMult = sizeMultiplier[projectSize] || 1.0;
    const totalYards = Math.round(base * wMult * sMult);
    const skeinsNeeded = Math.ceil(totalYards / skeinYardage);
    const totalMeters = Math.round(totalYards * 0.9144);
    return {
      primary: { label: "Total Yards Needed", value: formatNumber(totalYards) + " yds" },
      details: [
        { label: "Total Meters", value: formatNumber(totalMeters) + " m" },
        { label: "Skeins Needed", value: formatNumber(skeinsNeeded) },
        { label: "Total Skein Yardage", value: formatNumber(skeinsNeeded * skeinYardage) + " yds" }
      ]
    };
  }`,
  [
    { q: "How do I estimate yarn yardage for a project?", a: "Yardage depends on project type, size, and yarn weight. Thinner yarns generally require more yardage because they have more yards per ounce, while bulkier yarns cover more area per yard." },
    { q: "Should I buy extra yarn?", a: "Yes, it is wise to buy 10 to 15 percent more than your estimate. Dye lots can vary, so purchasing all your yarn at once ensures color consistency." },
    { q: "Does yarn weight affect how much I need?", a: "Absolutely. Lace weight yarn uses the most yardage while bulky yarn uses the least for the same project because thicker yarn covers more area per stitch." }
  ],
  `Total Yards = Base Yardage (by project type) x Yarn Weight Multiplier x Size Multiplier
Skeins Needed = ceil(Total Yards / Yards Per Skein)`,
  ["crochet-hook-size-calculator", "fabric-yardage-calculator"]
);

add(
  "quilt-fabric-calculator",
  "Quilt Fabric Calculator",
  "Estimate total fabric yardage needed for quilt tops, backing, and binding based on quilt dimensions and block size.",
  "Everyday",
  "everyday",
  "~",
  ["quilt fabric", "quilting yardage", "quilt calculator", "patchwork fabric"],
  [
    '{ name: "quiltWidth", label: "Quilt Width (inches)", type: "number", min: 20, max: 120, defaultValue: 60 }',
    '{ name: "quiltLength", label: "Quilt Length (inches)", type: "number", min: 20, max: 120, defaultValue: 80 }',
    '{ name: "blockSize", label: "Block Size (inches)", type: "number", min: 4, max: 24, defaultValue: 12 }',
    '{ name: "seamAllowance", label: "Seam Allowance (inches)", type: "number", min: 0.25, max: 1, defaultValue: 0.25 }',
    '{ name: "fabricWidth", label: "Fabric Width (inches)", type: "number", min: 36, max: 60, defaultValue: 44 }'
  ],
  `(inputs) => {
    const quiltWidth = inputs.quiltWidth as number;
    const quiltLength = inputs.quiltLength as number;
    const blockSize = inputs.blockSize as number;
    const seam = inputs.seamAllowance as number;
    const fabricWidth = inputs.fabricWidth as number;
    const cutBlock = blockSize + seam * 2;
    const blocksAcross = Math.ceil(quiltWidth / blockSize);
    const blocksDown = Math.ceil(quiltLength / blockSize);
    const totalBlocks = blocksAcross * blocksDown;
    const blocksPerRow = Math.floor(fabricWidth / cutBlock);
    const rowsNeeded = Math.ceil(totalBlocks / blocksPerRow);
    const topYardage = Math.ceil((rowsNeeded * cutBlock) / 36 * 10) / 10;
    const backingYardage = Math.ceil((quiltLength + 8) / 36 * (Math.ceil((quiltWidth + 8) / fabricWidth)) * 10) / 10;
    const bindingYardage = Math.ceil(((quiltWidth + quiltLength) * 2 + 20) / (fabricWidth * 6) * 36) / 36;
    const bindingRounded = Math.ceil(bindingYardage * 10) / 10;
    return {
      primary: { label: "Top Fabric Needed", value: formatNumber(topYardage) + " yards" },
      details: [
        { label: "Total Blocks", value: formatNumber(totalBlocks) },
        { label: "Backing Fabric", value: formatNumber(backingYardage) + " yards" },
        { label: "Binding Fabric", value: formatNumber(bindingRounded) + " yards" },
        { label: "Blocks Per Fabric Row", value: formatNumber(blocksPerRow) }
      ]
    };
  }`,
  [
    { q: "How do I calculate fabric for a quilt?", a: "Determine the number of blocks, account for seam allowances, then calculate how many blocks fit across your fabric width to find how many rows you need to cut." },
    { q: "How much extra fabric should I buy for quilting?", a: "Buy 10 to 20 percent extra to account for cutting mistakes, shrinkage, and fabric defects. Pre-wash cotton fabrics as they can shrink up to 5 percent." },
    { q: "What is a standard quilt seam allowance?", a: "The standard quilting seam allowance is one quarter inch. This is smaller than garment sewing which typically uses five eighths of an inch." }
  ],
  `Top Fabric = (Rows Needed x Cut Block Size) / 36 yards
Backing = (Quilt Length + 8) / 36 x Widths Needed
Binding = Perimeter / (Fabric Width x 6 strips per yard)`,
  ["fabric-yardage-calculator", "yarn-yardage-calculator"]
);

add(
  "candle-making-wax-calculator",
  "Candle Making Wax Calculator",
  "Calculate the amount of wax, fragrance oil, and dye needed for candle making based on container volume and wax type.",
  "Everyday",
  "everyday",
  "~",
  ["candle wax calculator", "candle making", "wax weight", "fragrance load"],
  [
    '{ name: "containerVolume", label: "Container Volume (oz)", type: "number", min: 1, max: 64, defaultValue: 8 }',
    '{ name: "numCandles", label: "Number of Candles", type: "number", min: 1, max: 100, defaultValue: 6 }',
    '{ name: "waxType", label: "Wax Type", type: "select", options: [{ value: "1", label: "Soy Wax" }, { value: "2", label: "Paraffin" }, { value: "3", label: "Coconut Wax" }, { value: "4", label: "Beeswax" }], defaultValue: "1" }',
    '{ name: "fragrancePercent", label: "Fragrance Load (%)", type: "number", min: 0, max: 15, defaultValue: 8 }'
  ],
  `(inputs) => {
    const containerVol = inputs.containerVolume as number;
    const numCandles = inputs.numCandles as number;
    const waxType = parseInt(inputs.waxType as string);
    const fragPercent = inputs.fragrancePercent as number;
    const densityFactor = { 1: 0.86, 2: 0.9, 3: 0.84, 4: 0.96 };
    const density = densityFactor[waxType] || 0.86;
    const waxPerCandle = containerVol * density;
    const totalWaxOz = waxPerCandle * numCandles;
    const totalWaxLbs = totalWaxOz / 16;
    const fragranceOz = totalWaxOz * (fragPercent / 100);
    const dyeOz = totalWaxOz * 0.002;
    return {
      primary: { label: "Total Wax Needed", value: formatNumber(Math.round(totalWaxLbs * 100) / 100) + " lbs" },
      details: [
        { label: "Wax Per Candle", value: formatNumber(Math.round(waxPerCandle * 100) / 100) + " oz" },
        { label: "Total Wax (oz)", value: formatNumber(Math.round(totalWaxOz * 10) / 10) + " oz" },
        { label: "Fragrance Oil Needed", value: formatNumber(Math.round(fragranceOz * 100) / 100) + " oz" },
        { label: "Dye Needed", value: formatNumber(Math.round(dyeOz * 100) / 100) + " oz" }
      ]
    };
  }`,
  [
    { q: "How much wax do I need for a candle?", a: "Multiply your container volume in ounces by the wax density factor. Soy wax weighs about 0.86 oz per fluid oz, so an 8 oz container needs roughly 6.9 oz of wax by weight." },
    { q: "What is a good fragrance load for candles?", a: "Most waxes handle 6 to 10 percent fragrance load. Soy wax typically maxes out around 10 to 12 percent. Going too high can cause sweating or poor burn quality." },
    { q: "What is the difference between soy and paraffin wax?", a: "Soy wax is natural and burns cleaner but has a lower scent throw. Paraffin is petroleum-based with stronger scent throw but produces more soot." }
  ],
  `Wax Per Candle (oz) = Container Volume x Wax Density Factor
Total Wax = Wax Per Candle x Number of Candles
Fragrance Oil = Total Wax x (Fragrance Load % / 100)`,
  ["soap-making-lye-calculator", "resin-art-volume-calculator"]
);

add(
  "soap-making-lye-calculator",
  "Soap Making Lye Calculator",
  "Calculate the correct amount of lye (sodium hydroxide) and water needed for cold process soap making based on oil weights and SAP values.",
  "Science",
  "science",
  "A",
  ["soap lye calculator", "saponification", "cold process soap", "NaOH calculator"],
  [
    '{ name: "oilWeight", label: "Total Oil Weight (oz)", type: "number", min: 4, max: 200, defaultValue: 32 }',
    '{ name: "oilType", label: "Primary Oil", type: "select", options: [{ value: "1", label: "Olive Oil" }, { value: "2", label: "Coconut Oil" }, { value: "3", label: "Palm Oil" }, { value: "4", label: "Lard/Tallow" }, { value: "5", label: "Castor Oil" }], defaultValue: "1" }',
    '{ name: "superfat", label: "Superfat (%)", type: "number", min: 0, max: 20, defaultValue: 5 }',
    '{ name: "waterRatio", label: "Water:Lye Ratio", type: "select", options: [{ value: "1.5", label: "1.5:1 (Less Water)" }, { value: "2", label: "2:1 (Standard)" }, { value: "2.5", label: "2.5:1 (More Water)" }], defaultValue: "2" }'
  ],
  `(inputs) => {
    const oilWeight = inputs.oilWeight as number;
    const oilType = parseInt(inputs.oilType as string);
    const superfat = inputs.superfat as number;
    const waterRatio = parseFloat(inputs.waterRatio as string);
    const sapValues = { 1: 0.1353, 2: 0.1910, 3: 0.1413, 4: 0.1405, 5: 0.1286 };
    const sap = sapValues[oilType] || 0.1353;
    const lyeNeeded = oilWeight * sap * (1 - superfat / 100);
    const waterNeeded = lyeNeeded * waterRatio;
    const totalBatchWeight = oilWeight + lyeNeeded + waterNeeded;
    return {
      primary: { label: "Lye (NaOH) Needed", value: formatNumber(Math.round(lyeNeeded * 100) / 100) + " oz" },
      details: [
        { label: "Water Needed", value: formatNumber(Math.round(waterNeeded * 100) / 100) + " oz" },
        { label: "SAP Value Used", value: formatNumber(sap) },
        { label: "Total Batch Weight", value: formatNumber(Math.round(totalBatchWeight * 100) / 100) + " oz" },
        { label: "Superfat Amount", value: formatNumber(superfat) + "%" }
      ]
    };
  }`,
  [
    { q: "What is the SAP value?", a: "SAP (saponification value) indicates how much lye is needed to convert one ounce of a specific oil into soap. Each oil has a unique SAP value." },
    { q: "Why do I need superfat?", a: "Superfatting leaves a percentage of oils unsaponified in the finished soap. This makes the soap more moisturizing and provides a safety margin to ensure no excess lye remains." },
    { q: "Is lye dangerous?", a: "Yes, sodium hydroxide is a caustic chemical. Always wear gloves and eye protection. Add lye to water, never water to lye, to avoid a dangerous exothermic reaction." }
  ],
  `Lye = Oil Weight x SAP Value x (1 - Superfat% / 100)
Water = Lye x Water:Lye Ratio
Total Batch Weight = Oil + Lye + Water`,
  ["candle-making-wax-calculator", "resin-art-volume-calculator"]
);

add(
  "resin-art-volume-calculator",
  "Resin Art Volume Calculator",
  "Calculate the amount of epoxy resin and hardener needed for art projects based on mold dimensions and resin type.",
  "Everyday",
  "everyday",
  "~",
  ["resin volume", "epoxy calculator", "resin art", "casting resin amount"],
  [
    '{ name: "shape", label: "Mold Shape", type: "select", options: [{ value: "1", label: "Rectangle" }, { value: "2", label: "Circle" }, { value: "3", label: "Irregular (approx)" }], defaultValue: "1" }',
    '{ name: "length", label: "Length/Diameter (inches)", type: "number", min: 1, max: 60, defaultValue: 12 }',
    '{ name: "width", label: "Width (inches, for rectangle)", type: "number", min: 1, max: 60, defaultValue: 8 }',
    '{ name: "depth", label: "Depth (inches)", type: "number", min: 0.1, max: 6, defaultValue: 0.5 }',
    '{ name: "mixRatio", label: "Resin Mix Ratio", type: "select", options: [{ value: "1", label: "1:1 by Volume" }, { value: "2", label: "2:1 by Volume" }, { value: "3", label: "3:1 by Volume" }], defaultValue: "1" }'
  ],
  `(inputs) => {
    const shape = parseInt(inputs.shape as string);
    const length = inputs.length as number;
    const width = inputs.width as number;
    const depth = inputs.depth as number;
    const mixRatio = parseInt(inputs.mixRatio as string);
    let volumeCuIn = 0;
    if (shape === 1) {
      volumeCuIn = length * width * depth;
    } else if (shape === 2) {
      volumeCuIn = Math.PI * Math.pow(length / 2, 2) * depth;
    } else {
      volumeCuIn = length * width * depth * 0.75;
    }
    const volumeFlOz = volumeCuIn * 0.554;
    const extraFactor = 1.1;
    const totalFlOz = volumeFlOz * extraFactor;
    const ratioTotal = mixRatio === 1 ? 2 : mixRatio === 2 ? 3 : 4;
    const resinPart = totalFlOz * (mixRatio === 1 ? 1 : mixRatio) / ratioTotal;
    const hardenerPart = totalFlOz / ratioTotal;
    return {
      primary: { label: "Total Mixed Resin", value: formatNumber(Math.round(totalFlOz * 10) / 10) + " fl oz" },
      details: [
        { label: "Resin Part", value: formatNumber(Math.round(resinPart * 10) / 10) + " fl oz" },
        { label: "Hardener Part", value: formatNumber(Math.round(hardenerPart * 10) / 10) + " fl oz" },
        { label: "Mold Volume", value: formatNumber(Math.round(volumeCuIn * 10) / 10) + " cu in" },
        { label: "Includes 10% Extra", value: "Yes" }
      ]
    };
  }`,
  [
    { q: "How do I measure resin for a project?", a: "Calculate the volume of your mold in cubic inches, convert to fluid ounces, then add 10 percent extra for mixing losses and surface tension." },
    { q: "What is the difference between 1:1 and 2:1 resin?", a: "A 1:1 ratio means equal parts resin and hardener. A 2:1 ratio means twice as much resin as hardener. The ratio is set by the manufacturer and must be followed exactly." },
    { q: "Can I pour thick layers of resin?", a: "Most table-top resins should be poured in layers of one quarter inch or less. Deep pour resins can handle 1 to 2 inches at a time. Pouring too thick causes excessive heat and cracking." }
  ],
  `Volume (cu in) = Length x Width x Depth (rectangle) or Pi x r^2 x Depth (circle)
Volume (fl oz) = Volume (cu in) x 0.554
Total = Volume (fl oz) x 1.10 (10% extra)`,
  ["candle-making-wax-calculator", "soap-making-lye-calculator"]
);

add(
  "leather-working-cost-calculator",
  "Leather Working Cost Calculator",
  "Estimate material costs for leather projects based on leather type, area needed, hardware, and thread.",
  "Finance",
  "finance",
  "$",
  ["leather cost", "leathercraft budget", "leather project cost", "leather material"],
  [
    '{ name: "leatherArea", label: "Leather Area Needed (sq ft)", type: "number", min: 0.5, max: 50, defaultValue: 4 }',
    '{ name: "leatherType", label: "Leather Type", type: "select", options: [{ value: "1", label: "Vegetable Tanned" }, { value: "2", label: "Chrome Tanned" }, { value: "3", label: "Exotic (Snake/Croc)" }, { value: "4", label: "Suede" }], defaultValue: "1" }',
    '{ name: "hardwareCount", label: "Hardware Pieces (snaps, rivets)", type: "number", min: 0, max: 50, defaultValue: 6 }',
    '{ name: "hardwareType", label: "Hardware Quality", type: "select", options: [{ value: "1", label: "Basic Brass" }, { value: "2", label: "Solid Brass" }, { value: "3", label: "Stainless Steel" }], defaultValue: "1" }',
    '{ name: "threadLength", label: "Thread Needed (yards)", type: "number", min: 1, max: 100, defaultValue: 10 }'
  ],
  `(inputs) => {
    const area = inputs.leatherArea as number;
    const type = parseInt(inputs.leatherType as string);
    const hwCount = inputs.hardwareCount as number;
    const hwType = parseInt(inputs.hardwareType as string);
    const thread = inputs.threadLength as number;
    const leatherPrice = { 1: 12, 2: 8, 3: 35, 4: 6 };
    const hwPrice = { 1: 0.5, 2: 1.5, 3: 2.0 };
    const threadPricePerYard = 0.15;
    const leatherCost = area * (leatherPrice[type] || 12);
    const hardwareCost = hwCount * (hwPrice[hwType] || 0.5);
    const threadCost = thread * threadPricePerYard;
    const totalCost = leatherCost + hardwareCost + threadCost;
    return {
      primary: { label: "Total Material Cost", value: "$" + formatNumber(Math.round(totalCost * 100) / 100) },
      details: [
        { label: "Leather Cost", value: "$" + formatNumber(Math.round(leatherCost * 100) / 100) },
        { label: "Hardware Cost", value: "$" + formatNumber(Math.round(hardwareCost * 100) / 100) },
        { label: "Thread Cost", value: "$" + formatNumber(Math.round(threadCost * 100) / 100) },
        { label: "Cost Per Sq Ft", value: "$" + formatNumber(leatherPrice[type] || 12) }
      ]
    };
  }`,
  [
    { q: "How much does leather cost per square foot?", a: "Vegetable tanned leather costs around 8 to 15 dollars per square foot. Exotic leathers like snake or crocodile can cost 25 to 50 dollars or more per square foot." },
    { q: "What type of leather is best for beginners?", a: "Vegetable tanned leather is ideal for beginners. It is firm, easy to cut, accepts dye well, and can be tooled and stamped." },
    { q: "How much leather do I need for a wallet?", a: "A simple bifold wallet typically requires about 1 to 1.5 square feet of leather depending on the design and number of card slots." }
  ],
  `Total Cost = (Leather Area x Price Per Sq Ft) + (Hardware Count x Price Per Piece) + (Thread Yards x Price Per Yard)`,
  ["candle-making-wax-calculator", "jewelry-wire-calculator"]
);

add(
  "pottery-kiln-firing-cost-calculator",
  "Pottery Kiln Firing Cost Calculator",
  "Estimate electricity or gas cost for pottery kiln firings based on kiln size, cone temperature, and energy rates.",
  "Finance",
  "finance",
  "$",
  ["kiln cost", "pottery firing cost", "kiln electricity", "ceramics firing"],
  [
    '{ name: "kilnKw", label: "Kiln Power (kW)", type: "number", min: 1, max: 30, defaultValue: 8 }',
    '{ name: "coneTemp", label: "Cone Temperature", type: "select", options: [{ value: "1", label: "Cone 06 (Bisque, ~1830F)" }, { value: "2", label: "Cone 6 (Mid-Fire, ~2230F)" }, { value: "3", label: "Cone 10 (High-Fire, ~2380F)" }], defaultValue: "2" }',
    '{ name: "electricRate", label: "Electricity Rate ($/kWh)", type: "number", min: 0.05, max: 0.5, defaultValue: 0.12 }',
    '{ name: "firingsPerMonth", label: "Firings Per Month", type: "number", min: 1, max: 30, defaultValue: 4 }'
  ],
  `(inputs) => {
    const kilnKw = inputs.kilnKw as number;
    const cone = parseInt(inputs.coneTemp as string);
    const rate = inputs.electricRate as number;
    const firings = inputs.firingsPerMonth as number;
    const firingHours = { 1: 8, 2: 10, 3: 12 };
    const hours = firingHours[cone] || 10;
    const kwhPerFiring = kilnKw * hours * 0.65;
    const costPerFiring = kwhPerFiring * rate;
    const monthlyCost = costPerFiring * firings;
    const annualCost = monthlyCost * 12;
    return {
      primary: { label: "Cost Per Firing", value: "$" + formatNumber(Math.round(costPerFiring * 100) / 100) },
      details: [
        { label: "kWh Per Firing", value: formatNumber(Math.round(kwhPerFiring * 10) / 10) + " kWh" },
        { label: "Firing Duration", value: formatNumber(hours) + " hours" },
        { label: "Monthly Cost", value: "$" + formatNumber(Math.round(monthlyCost * 100) / 100) },
        { label: "Annual Cost", value: "$" + formatNumber(Math.round(annualCost * 100) / 100) }
      ]
    };
  }`,
  [
    { q: "How much does it cost to fire a kiln?", a: "A typical cone 6 firing in an 8 kW kiln costs around 5 to 8 dollars in electricity at average US rates. Larger kilns and higher temperatures increase the cost." },
    { q: "Why is the duty cycle 65 percent?", a: "Electric kilns cycle their elements on and off to maintain temperature. On average they draw about 65 percent of their rated power over a full firing cycle." },
    { q: "Is gas or electric cheaper for pottery firing?", a: "Gas kilns can be cheaper at high temperatures (cone 10) but have higher upfront costs. Electric kilns are simpler and more common for home potters." }
  ],
  `kWh Per Firing = Kiln kW x Firing Hours x 0.65 (duty cycle)
Cost Per Firing = kWh x Electricity Rate
Monthly Cost = Cost Per Firing x Firings Per Month`,
  ["candle-making-wax-calculator", "leather-working-cost-calculator"]
);

add(
  "cross-stitch-fabric-calculator",
  "Cross Stitch Fabric Calculator",
  "Calculate the fabric dimensions and thread amounts needed for cross stitch projects based on pattern size and fabric count.",
  "Everyday",
  "everyday",
  "~",
  ["cross stitch fabric", "aida cloth calculator", "cross stitch size", "needlework fabric"],
  [
    '{ name: "patternWidth", label: "Pattern Width (stitches)", type: "number", min: 10, max: 1000, defaultValue: 100 }',
    '{ name: "patternHeight", label: "Pattern Height (stitches)", type: "number", min: 10, max: 1000, defaultValue: 80 }',
    '{ name: "fabricCount", label: "Fabric Count", type: "select", options: [{ value: "11", label: "11 count Aida" }, { value: "14", label: "14 count Aida" }, { value: "16", label: "16 count Aida" }, { value: "18", label: "18 count Aida" }, { value: "28", label: "28 count Evenweave" }], defaultValue: "14" }',
    '{ name: "margin", label: "Border Margin (inches)", type: "number", min: 1, max: 6, defaultValue: 3 }'
  ],
  `(inputs) => {
    const pw = inputs.patternWidth as number;
    const ph = inputs.patternHeight as number;
    const count = parseInt(inputs.fabricCount as string);
    const margin = inputs.margin as number;
    const stitchCount = count >= 28 ? count / 2 : count;
    const designWidth = pw / stitchCount;
    const designHeight = ph / stitchCount;
    const fabricWidth = designWidth + margin * 2;
    const fabricHeight = designHeight + margin * 2;
    const totalStitches = pw * ph;
    const flossPerStitch = 0.012;
    const estimatedSkeins = Math.ceil(totalStitches * flossPerStitch / 8);
    return {
      primary: { label: "Fabric Size Needed", value: formatNumber(Math.round(fabricWidth * 10) / 10) + " x " + formatNumber(Math.round(fabricHeight * 10) / 10) + " inches" },
      details: [
        { label: "Design Size", value: formatNumber(Math.round(designWidth * 10) / 10) + " x " + formatNumber(Math.round(designHeight * 10) / 10) + " inches" },
        { label: "Total Stitches", value: formatNumber(totalStitches) },
        { label: "Estimated Skeins (all colors)", value: formatNumber(estimatedSkeins) },
        { label: "Effective Count", value: formatNumber(stitchCount) + " stitches/inch" }
      ]
    };
  }`,
  [
    { q: "What fabric count should I use for cross stitch?", a: "Beginners should start with 14 count Aida. Higher counts like 18 count produce finer details but are harder to see. 28 count evenweave is stitched over two threads." },
    { q: "How much margin should I leave around my design?", a: "Leave at least 3 inches on each side for framing. If your piece will be mounted in a large frame, leave 4 to 6 inches." },
    { q: "How do I estimate thread for a cross stitch project?", a: "A general rule is about 1 skein of 8-yard floss per 500 to 700 stitches, though this varies with coverage density and number of thread strands used." }
  ],
  `Design Size = Pattern Stitches / Fabric Count
Fabric Size = Design Size + (Margin x 2) on each dimension
Estimated Skeins = (Total Stitches x 0.012 yards per stitch) / 8 yards per skein`,
  ["embroidery-thread-calculator", "quilt-fabric-calculator"]
);

add(
  "embroidery-thread-calculator",
  "Embroidery Thread Calculator",
  "Estimate embroidery thread or floss usage based on design area, stitch density, and number of colors.",
  "Everyday",
  "everyday",
  "~",
  ["embroidery thread", "floss calculator", "embroidery supplies", "thread estimator"],
  [
    '{ name: "designArea", label: "Design Area (sq inches)", type: "number", min: 1, max: 500, defaultValue: 25 }',
    '{ name: "coverage", label: "Stitch Coverage (%)", type: "number", min: 10, max: 100, defaultValue: 60 }',
    '{ name: "numColors", label: "Number of Colors", type: "number", min: 1, max: 50, defaultValue: 8 }',
    '{ name: "stitchType", label: "Primary Stitch Type", type: "select", options: [{ value: "1", label: "Satin Stitch" }, { value: "2", label: "Fill Stitch" }, { value: "3", label: "Running/Outline" }], defaultValue: "2" }',
    '{ name: "strands", label: "Number of Strands", type: "select", options: [{ value: "1", label: "1 Strand" }, { value: "2", label: "2 Strands" }, { value: "3", label: "3 Strands" }, { value: "6", label: "6 Strands" }], defaultValue: "2" }'
  ],
  `(inputs) => {
    const area = inputs.designArea as number;
    const coverage = inputs.coverage as number;
    const numColors = inputs.numColors as number;
    const stitchType = parseInt(inputs.stitchType as string);
    const strands = parseInt(inputs.strands as string);
    const densityFactor = { 1: 1.3, 2: 1.0, 3: 0.5 };
    const density = densityFactor[stitchType] || 1.0;
    const coveredArea = area * (coverage / 100);
    const threadYards = coveredArea * density * strands * 2.5;
    const yardsPerSkein = 8.7;
    const totalSkeins = Math.ceil(threadYards / yardsPerSkein);
    const skeinsPerColor = Math.max(1, Math.ceil(totalSkeins / numColors));
    return {
      primary: { label: "Total Thread Needed", value: formatNumber(Math.round(threadYards * 10) / 10) + " yards" },
      details: [
        { label: "Total Skeins", value: formatNumber(totalSkeins) },
        { label: "Avg Skeins Per Color", value: formatNumber(skeinsPerColor) },
        { label: "Covered Area", value: formatNumber(Math.round(coveredArea * 10) / 10) + " sq in" },
        { label: "Strands Used", value: formatNumber(strands) }
      ]
    };
  }`,
  [
    { q: "How many strands of embroidery floss should I use?", a: "Two strands is the most common for standard embroidery. Use one strand for fine detail and three or more for bold textures. Cross stitch on 14 count Aida typically uses two strands." },
    { q: "How much thread does a satin stitch use?", a: "Satin stitch uses about 30 percent more thread than fill stitch because the thread lies flat on the surface with minimal back stitching." },
    { q: "How many yards are in a skein of embroidery floss?", a: "A standard DMC embroidery floss skein contains 8.7 yards (approximately 8 meters) of six-strand cotton thread." }
  ],
  `Thread (yards) = Covered Area x Density Factor x Strands x 2.5
Total Skeins = Thread Yards / 8.7 yards per skein
Avg Per Color = Total Skeins / Number of Colors`,
  ["cross-stitch-fabric-calculator", "yarn-yardage-calculator"]
);

add(
  "scrapbook-page-layout-calculator",
  "Scrapbook Page Layout Calculator",
  "Plan scrapbook page layouts by calculating photo sizes, spacing, and number of photos that fit on a page.",
  "Everyday",
  "everyday",
  "~",
  ["scrapbook layout", "photo page planner", "scrapbook design", "photo layout"],
  [
    '{ name: "pageSize", label: "Page Size", type: "select", options: [{ value: "8.5", label: "8.5 x 8.5 inches" }, { value: "12", label: "12 x 12 inches" }, { value: "6", label: "6 x 8 inches" }], defaultValue: "12" }',
    '{ name: "photoWidth", label: "Photo Width (inches)", type: "number", min: 1, max: 10, defaultValue: 4 }',
    '{ name: "photoHeight", label: "Photo Height (inches)", type: "number", min: 1, max: 10, defaultValue: 3 }',
    '{ name: "spacing", label: "Spacing Between Photos (inches)", type: "number", min: 0.1, max: 2, defaultValue: 0.5 }',
    '{ name: "margin", label: "Page Margin (inches)", type: "number", min: 0.25, max: 2, defaultValue: 0.75 }'
  ],
  `(inputs) => {
    const pageW = parseFloat(inputs.pageSize as string);
    const pageH = pageW === 6 ? 8 : pageW;
    const photoW = inputs.photoWidth as number;
    const photoH = inputs.photoHeight as number;
    const spacing = inputs.spacing as number;
    const margin = inputs.margin as number;
    const usableW = pageW - margin * 2;
    const usableH = pageH - margin * 2;
    const photosAcross = Math.floor((usableW + spacing) / (photoW + spacing));
    const photosDown = Math.floor((usableH + spacing) / (photoH + spacing));
    const totalPhotos = photosAcross * photosDown;
    const usedW = photosAcross * photoW + (photosAcross - 1) * spacing;
    const usedH = photosDown * photoH + (photosDown - 1) * spacing;
    const remainW = Math.round((usableW - usedW) * 100) / 100;
    const remainH = Math.round((usableH - usedH) * 100) / 100;
    return {
      primary: { label: "Photos Per Page", value: formatNumber(totalPhotos) },
      details: [
        { label: "Grid Layout", value: formatNumber(photosAcross) + " x " + formatNumber(photosDown) },
        { label: "Usable Area", value: formatNumber(Math.round(usableW * 10) / 10) + " x " + formatNumber(Math.round(usableH * 10) / 10) + " in" },
        { label: "Remaining Width", value: formatNumber(remainW) + " in" },
        { label: "Remaining Height", value: formatNumber(remainH) + " in" }
      ]
    };
  }`,
  [
    { q: "What is the standard scrapbook page size?", a: "The most common scrapbook page size is 12 x 12 inches. Other popular sizes include 8.5 x 8.5 and 6 x 8 inches for mini albums." },
    { q: "How many photos should I put on a scrapbook page?", a: "A well-balanced 12 x 12 page typically has 2 to 5 photos. Too many photos can look cluttered. Leave space for journaling and embellishments." },
    { q: "What size should I print scrapbook photos?", a: "Common print sizes for scrapbooking are 4 x 6, 3 x 4, and 2 x 3 inches. Mix sizes for visual interest." }
  ],
  `Photos Across = floor((Usable Width + Spacing) / (Photo Width + Spacing))
Photos Down = floor((Usable Height + Spacing) / (Photo Height + Spacing))
Total Photos = Photos Across x Photos Down`,
  ["card-making-supplies-calculator", "cross-stitch-fabric-calculator"]
);

add(
  "wood-turning-blank-size-calculator",
  "Wood Turning Blank Size Calculator",
  "Calculate the minimum wood blank dimensions needed for turned bowls, spindles, and vessels including waste allowance.",
  "Everyday",
  "everyday",
  "~",
  ["wood turning blank", "lathe blank size", "bowl blank", "wood turning calculator"],
  [
    '{ name: "projectType", label: "Project Type", type: "select", options: [{ value: "1", label: "Bowl" }, { value: "2", label: "Spindle/Pen" }, { value: "3", label: "Vase/Vessel" }, { value: "4", label: "Platter" }], defaultValue: "1" }',
    '{ name: "finishedDiameter", label: "Finished Diameter (inches)", type: "number", min: 1, max: 24, defaultValue: 8 }',
    '{ name: "finishedHeight", label: "Finished Height/Depth (inches)", type: "number", min: 0.5, max: 18, defaultValue: 3 }',
    '{ name: "wallThickness", label: "Wall Thickness (inches)", type: "number", min: 0.125, max: 1, defaultValue: 0.25 }'
  ],
  `(inputs) => {
    const projType = parseInt(inputs.projectType as string);
    const finDiam = inputs.finishedDiameter as number;
    const finHeight = inputs.finishedHeight as number;
    const wall = inputs.wallThickness as number;
    const wasteMargin = 1;
    const chuckAllowance = projType === 1 || projType === 3 ? 0.75 : 0.5;
    const blankDiam = finDiam + wasteMargin * 2;
    const blankThick = projType === 2 ? finDiam + wasteMargin : finHeight + chuckAllowance + wasteMargin;
    const volumeCuIn = Math.PI * Math.pow(blankDiam / 2, 2) * blankThick;
    const boardFeet = volumeCuIn / 144;
    return {
      primary: { label: "Blank Size", value: formatNumber(Math.round(blankDiam * 10) / 10) + " x " + formatNumber(Math.round(blankThick * 10) / 10) + " inches" },
      details: [
        { label: "Blank Diameter", value: formatNumber(Math.round(blankDiam * 10) / 10) + " in" },
        { label: "Blank Thickness", value: formatNumber(Math.round(blankThick * 10) / 10) + " in" },
        { label: "Blank Volume", value: formatNumber(Math.round(volumeCuIn * 10) / 10) + " cu in" },
        { label: "Board Feet", value: formatNumber(Math.round(boardFeet * 100) / 100) + " BF" }
      ]
    };
  }`,
  [
    { q: "How much extra wood do I need for turning?", a: "Add at least 1 inch to the diameter and 0.75 to 1 inch to the height for waste from truing, tenon creation, and final finishing cuts." },
    { q: "What is a tenon in wood turning?", a: "A tenon is a cylindrical nub left on the bottom of a bowl blank that fits into a chuck to hold the piece securely on the lathe during turning." },
    { q: "What wood is best for turning?", a: "Cherry, maple, walnut, and ash are excellent turning woods. Green (wet) wood is easier to turn but must be dried slowly to prevent cracking." }
  ],
  `Blank Diameter = Finished Diameter + (Waste Margin x 2)
Blank Thickness = Finished Height + Chuck Allowance + Waste Margin
Board Feet = (Pi x r^2 x Thickness) / 144`,
  ["leather-working-cost-calculator", "quilt-fabric-calculator"]
);

add(
  "model-railroad-scale-calculator",
  "Model Railroad Scale Calculator",
  "Convert real-world dimensions to model railroad scale dimensions for popular scales including HO, N, O, and G.",
  "Conversion",
  "conversion",
  "R",
  ["model railroad scale", "model train scale", "HO scale converter", "miniature scale"],
  [
    '{ name: "realLength", label: "Real-World Length (feet)", type: "number", min: 0.1, max: 5000, defaultValue: 50 }',
    '{ name: "realWidth", label: "Real-World Width (feet)", type: "number", min: 0.1, max: 500, defaultValue: 12 }',
    '{ name: "realHeight", label: "Real-World Height (feet)", type: "number", min: 0.1, max: 500, defaultValue: 15 }',
    '{ name: "scale", label: "Model Scale", type: "select", options: [{ value: "220", label: "Z Scale (1:220)" }, { value: "160", label: "N Scale (1:160)" }, { value: "87", label: "HO Scale (1:87)" }, { value: "48", label: "O Scale (1:48)" }, { value: "22.5", label: "G Scale (1:22.5)" }], defaultValue: "87" }'
  ],
  `(inputs) => {
    const realL = inputs.realLength as number;
    const realW = inputs.realWidth as number;
    const realH = inputs.realHeight as number;
    const scale = parseFloat(inputs.scale as string);
    const modelL = realL * 12 / scale;
    const modelW = realW * 12 / scale;
    const modelH = realH * 12 / scale;
    const modelLmm = modelL * 25.4;
    const modelWmm = modelW * 25.4;
    const modelHmm = modelH * 25.4;
    return {
      primary: { label: "Model Length", value: formatNumber(Math.round(modelL * 100) / 100) + " inches" },
      details: [
        { label: "Model Width", value: formatNumber(Math.round(modelW * 100) / 100) + " inches" },
        { label: "Model Height", value: formatNumber(Math.round(modelH * 100) / 100) + " inches" },
        { label: "Length (mm)", value: formatNumber(Math.round(modelLmm * 10) / 10) + " mm" },
        { label: "Width (mm)", value: formatNumber(Math.round(modelWmm * 10) / 10) + " mm" },
        { label: "Scale Ratio", value: "1:" + formatNumber(scale) }
      ]
    };
  }`,
  [
    { q: "What is the most popular model railroad scale?", a: "HO scale (1:87) is the most popular worldwide. It offers a good balance between detail and space requirements." },
    { q: "How do I convert real dimensions to scale?", a: "Divide the real dimension by the scale ratio. For HO scale, divide by 87. A 50-foot building becomes about 6.9 inches in HO." },
    { q: "How much space do I need for a model railroad?", a: "A basic HO layout needs at least a 4 by 8 foot table. N scale can fit in smaller spaces. O and G scale require significantly more room." }
  ],
  `Model Dimension (inches) = Real Dimension (feet) x 12 / Scale Ratio
Model Dimension (mm) = Model Dimension (inches) x 25.4`,
  ["miniature-painting-cost-calculator", "wood-turning-blank-size-calculator"]
);

add(
  "miniature-painting-cost-calculator",
  "Miniature Painting Cost Calculator",
  "Estimate paint, brush, and supply costs for miniature painting projects based on number of minis and detail level.",
  "Finance",
  "finance",
  "$",
  ["miniature painting cost", "mini painting supplies", "warhammer paint", "model painting budget"],
  [
    '{ name: "numMinis", label: "Number of Miniatures", type: "number", min: 1, max: 500, defaultValue: 10 }',
    '{ name: "miniSize", label: "Miniature Scale", type: "select", options: [{ value: "1", label: "28mm (Standard)" }, { value: "2", label: "32mm (Heroic)" }, { value: "3", label: "54mm (Large)" }, { value: "4", label: "75mm+ (Display)" }], defaultValue: "1" }',
    '{ name: "detailLevel", label: "Detail Level", type: "select", options: [{ value: "1", label: "Tabletop (3 colors)" }, { value: "2", label: "Good (5-8 colors)" }, { value: "3", label: "High (10+ colors)" }, { value: "4", label: "Competition" }], defaultValue: "2" }',
    '{ name: "paintBrand", label: "Paint Brand Tier", type: "select", options: [{ value: "1", label: "Budget ($2-3/bottle)" }, { value: "2", label: "Standard ($4-5/bottle)" }, { value: "3", label: "Premium ($6-8/bottle)" }], defaultValue: "2" }'
  ],
  `(inputs) => {
    const numMinis = inputs.numMinis as number;
    const miniSize = parseInt(inputs.miniSize as string);
    const detail = parseInt(inputs.detailLevel as string);
    const brand = parseInt(inputs.paintBrand as string);
    const colorsNeeded = { 1: 3, 2: 7, 3: 12, 4: 18 };
    const paintPrice = { 1: 2.5, 2: 4.5, 3: 7 };
    const sizeMultiplier = { 1: 1, 2: 1.2, 3: 2, 4: 3 };
    const colors = colorsNeeded[detail] || 7;
    const pricePerBottle = paintPrice[brand] || 4.5;
    const sizeMult = sizeMultiplier[miniSize] || 1;
    const paintCost = colors * pricePerBottle;
    const mlPerMini = 0.3 * sizeMult;
    const bottleMl = 17;
    const bottlesConsumed = Math.ceil((numMinis * mlPerMini * colors) / (bottleMl * colors)) ;
    const brushCost = detail >= 3 ? 25 : 12;
    const primerCost = Math.ceil(numMinis / 20) * 12;
    const totalCost = paintCost + brushCost + primerCost;
    return {
      primary: { label: "Paint Set Cost", value: "$" + formatNumber(Math.round(paintCost * 100) / 100) },
      details: [
        { label: "Colors Needed", value: formatNumber(colors) },
        { label: "Brush Cost", value: "$" + formatNumber(brushCost) },
        { label: "Primer Cost", value: "$" + formatNumber(primerCost) },
        { label: "Total Startup Cost", value: "$" + formatNumber(Math.round(totalCost * 100) / 100) }
      ]
    };
  }`,
  [
    { q: "How much paint do I need for miniatures?", a: "A standard 17ml bottle of miniature paint covers approximately 50 to 60 standard 28mm miniatures with a single thin coat of one color." },
    { q: "What paints are best for beginners?", a: "Citadel, Vallejo, and Army Painter are popular choices. Vallejo offers the best value while Citadel has the widest hobby support." },
    { q: "Do I need to prime miniatures?", a: "Yes, priming provides a surface for paint to adhere to. Spray primer is fastest; brush-on primer works for small batches." }
  ],
  `Paint Set Cost = Number of Colors x Price Per Bottle
Primer Cost = ceil(Minis / 20) x Spray Can Price
Total Startup = Paint + Brushes + Primer`,
  ["model-railroad-scale-calculator", "leather-working-cost-calculator"]
);

add(
  "bead-pattern-calculator",
  "Bead Pattern Calculator",
  "Calculate the number of beads needed for bead weaving, loom work, or stringing projects based on pattern dimensions and bead size.",
  "Everyday",
  "everyday",
  "~",
  ["bead calculator", "bead pattern", "bead weaving", "seed bead count"],
  [
    '{ name: "patternWidth", label: "Pattern Width (beads)", type: "number", min: 5, max: 500, defaultValue: 40 }',
    '{ name: "patternHeight", label: "Pattern Height (rows)", type: "number", min: 5, max: 500, defaultValue: 50 }',
    '{ name: "beadSize", label: "Bead Size", type: "select", options: [{ value: "1", label: "15/0 (1.5mm)" }, { value: "2", label: "11/0 (2.2mm)" }, { value: "3", label: "8/0 (3mm)" }, { value: "4", label: "6/0 (4mm)" }], defaultValue: "2" }',
    '{ name: "numColors", label: "Number of Colors", type: "number", min: 1, max: 30, defaultValue: 5 }',
    '{ name: "technique", label: "Technique", type: "select", options: [{ value: "1", label: "Loom" }, { value: "2", label: "Peyote" }, { value: "3", label: "Brick Stitch" }, { value: "4", label: "Right Angle Weave" }], defaultValue: "1" }'
  ],
  `(inputs) => {
    const pw = inputs.patternWidth as number;
    const ph = inputs.patternHeight as number;
    const beadSize = parseInt(inputs.beadSize as string);
    const numColors = inputs.numColors as number;
    const technique = parseInt(inputs.technique as string);
    const beadMm = { 1: 1.5, 2: 2.2, 3: 3, 4: 4 };
    const mm = beadMm[beadSize] || 2.2;
    const wasteFactor = { 1: 1.05, 2: 1.08, 3: 1.08, 4: 1.12 };
    const waste = wasteFactor[technique] || 1.05;
    const totalBeads = Math.ceil(pw * ph * waste);
    const beadsPerColor = Math.ceil(totalBeads / numColors);
    const widthInches = Math.round(pw * mm / 25.4 * 100) / 100;
    const heightInches = Math.round(ph * mm / 25.4 * 100) / 100;
    const gramsPerBead = { 1: 0.02, 2: 0.04, 3: 0.1, 4: 0.2 };
    const totalGrams = Math.round(totalBeads * (gramsPerBead[beadSize] || 0.04) * 10) / 10;
    return {
      primary: { label: "Total Beads Needed", value: formatNumber(totalBeads) },
      details: [
        { label: "Avg Beads Per Color", value: formatNumber(beadsPerColor) },
        { label: "Finished Width", value: formatNumber(widthInches) + " inches" },
        { label: "Finished Height", value: formatNumber(heightInches) + " inches" },
        { label: "Total Weight", value: formatNumber(totalGrams) + " grams" }
      ]
    };
  }`,
  [
    { q: "How many beads are in a gram?", a: "For size 11/0 seed beads, there are approximately 110 beads per gram. Larger beads like 6/0 have about 10 per gram, while tiny 15/0 have about 290 per gram." },
    { q: "Why add a waste factor?", a: "The waste factor accounts for beads lost during work, irregular beads that must be discarded, and extras needed for tension adjustments in the weaving technique." },
    { q: "What is the difference between peyote and loom beading?", a: "Loom beading uses a loom to hold warp threads and creates a flat fabric quickly. Peyote stitch is off-loom and more portable but slower. Both produce similar-looking flat beadwork." }
  ],
  `Total Beads = Pattern Width x Pattern Height x Waste Factor
Finished Size (inches) = Beads x Bead Size (mm) / 25.4
Weight (grams) = Total Beads x Grams Per Bead`,
  ["jewelry-wire-calculator", "embroidery-thread-calculator"]
);

add(
  "macrame-cord-calculator",
  "Macrame Cord Calculator",
  "Calculate the total cord length needed for macrame projects based on finished length, knot type, and number of cords.",
  "Everyday",
  "everyday",
  "~",
  ["macrame cord", "macrame rope calculator", "macrame length", "macrame supplies"],
  [
    '{ name: "finishedLength", label: "Finished Project Length (inches)", type: "number", min: 6, max: 120, defaultValue: 36 }',
    '{ name: "numCords", label: "Number of Cords", type: "number", min: 2, max: 100, defaultValue: 16 }',
    '{ name: "knotType", label: "Primary Knot Type", type: "select", options: [{ value: "1", label: "Square Knots" }, { value: "2", label: "Spiral/Half Hitch" }, { value: "3", label: "Gathering Knots" }, { value: "4", label: "Berry Knots" }], defaultValue: "1" }',
    '{ name: "cordThickness", label: "Cord Thickness (mm)", type: "number", min: 1, max: 10, defaultValue: 4 }',
    '{ name: "density", label: "Knot Density", type: "select", options: [{ value: "1", label: "Loose/Airy" }, { value: "2", label: "Medium" }, { value: "3", label: "Dense/Tight" }], defaultValue: "2" }'
  ],
  `(inputs) => {
    const finLength = inputs.finishedLength as number;
    const numCords = inputs.numCords as number;
    const knotType = parseInt(inputs.knotType as string);
    const cordThick = inputs.cordThickness as number;
    const density = parseInt(inputs.density as string);
    const knotMultiplier = { 1: 4, 2: 5, 3: 3.5, 4: 6 };
    const densityMult = { 1: 0.8, 2: 1.0, 3: 1.3 };
    const thickMult = 1 + (cordThick - 3) * 0.05;
    const mult = (knotMultiplier[knotType] || 4) * (densityMult[density] || 1) * thickMult;
    const cordLength = Math.round(finLength * mult);
    const totalLength = cordLength * numCords;
    const totalFeet = Math.round(totalLength / 12);
    const totalYards = Math.round(totalFeet / 3 * 10) / 10;
    return {
      primary: { label: "Length Per Cord", value: formatNumber(cordLength) + " inches" },
      details: [
        { label: "Total Cord Needed", value: formatNumber(totalFeet) + " feet" },
        { label: "Total in Yards", value: formatNumber(totalYards) + " yards" },
        { label: "Number of Cords", value: formatNumber(numCords) },
        { label: "Multiplier Used", value: formatNumber(Math.round(mult * 10) / 10) + "x" }
      ]
    };
  }`,
  [
    { q: "How much cord do I need for macrame?", a: "A general rule is to cut cords 3 to 5 times the finished length. Dense patterns with complex knots may need up to 6 to 8 times the finished length." },
    { q: "What size cord is best for macrame?", a: "3mm to 5mm cord is most popular for wall hangings. 1 to 2mm works for jewelry. 6mm or larger is used for plant hangers and large pieces." },
    { q: "Should I cut all cords the same length?", a: "For most patterns, yes. If your design has outer cords that remain unknotted, those can be shorter. Always err on the side of too long since you can trim but cannot add." }
  ],
  `Cord Length = Finished Length x Knot Multiplier x Density Factor x Thickness Factor
Total Cord = Cord Length x Number of Cords`,
  ["yarn-yardage-calculator", "jewelry-wire-calculator"]
);

add(
  "calligraphy-ink-usage-calculator",
  "Calligraphy Ink Usage Calculator",
  "Estimate ink consumption for calligraphy projects based on writing area, nib size, and ink type.",
  "Everyday",
  "everyday",
  "~",
  ["calligraphy ink", "ink usage calculator", "fountain pen ink", "calligraphy supplies"],
  [
    '{ name: "numPages", label: "Number of Pages", type: "number", min: 1, max: 500, defaultValue: 10 }',
    '{ name: "linesPerPage", label: "Lines Per Page", type: "number", min: 1, max: 50, defaultValue: 20 }',
    '{ name: "nibSize", label: "Nib Size", type: "select", options: [{ value: "1", label: "Fine (0.5-1mm)" }, { value: "2", label: "Medium (1.5-2mm)" }, { value: "3", label: "Broad (2.5-4mm)" }, { value: "4", label: "Extra Broad (5mm+)" }], defaultValue: "2" }',
    '{ name: "inkType", label: "Ink Type", type: "select", options: [{ value: "1", label: "Iron Gall" }, { value: "2", label: "Carbon/Sumi" }, { value: "3", label: "Fountain Pen Ink" }, { value: "4", label: "Gouache/Watercolor" }], defaultValue: "1" }',
    '{ name: "lineLength", label: "Average Line Length (inches)", type: "number", min: 2, max: 12, defaultValue: 7 }'
  ],
  `(inputs) => {
    const pages = inputs.numPages as number;
    const lines = inputs.linesPerPage as number;
    const nib = parseInt(inputs.nibSize as string);
    const inkType = parseInt(inputs.inkType as string);
    const lineLen = inputs.lineLength as number;
    const nibFactor = { 1: 0.003, 2: 0.006, 3: 0.012, 4: 0.02 };
    const inkFactor = { 1: 1.0, 2: 1.2, 3: 0.8, 4: 1.5 };
    const mlPerInch = (nibFactor[nib] || 0.006) * (inkFactor[inkType] || 1.0);
    const totalInches = pages * lines * lineLen;
    const totalMl = totalInches * mlPerInch;
    const bottles30ml = Math.ceil(totalMl / 30);
    const dipLoads = Math.round(totalMl / 0.05);
    return {
      primary: { label: "Total Ink Needed", value: formatNumber(Math.round(totalMl * 10) / 10) + " ml" },
      details: [
        { label: "30ml Bottles Needed", value: formatNumber(bottles30ml) },
        { label: "Total Writing Length", value: formatNumber(Math.round(totalInches / 12)) + " feet" },
        { label: "Estimated Dip Loads", value: formatNumber(dipLoads) },
        { label: "Ink Per Page", value: formatNumber(Math.round(totalMl / pages * 100) / 100) + " ml" }
      ]
    };
  }`,
  [
    { q: "How long does a bottle of calligraphy ink last?", a: "A 30ml bottle of calligraphy ink can last 50 to 200 pages depending on nib width and writing density. Fine nibs use much less ink than broad nibs." },
    { q: "What ink is best for calligraphy beginners?", a: "Iron gall ink is traditional and flows well from a dip pen. Sumi ink is great for brush calligraphy. Fountain pen inks are convenient but may feather on some papers." },
    { q: "Does nib size affect ink consumption?", a: "Yes, significantly. A broad nib can use 4 to 6 times more ink than a fine nib because it deposits a wider line of ink on the paper." }
  ],
  `Ink Per Inch = Nib Factor x Ink Type Factor
Total Ink (ml) = Pages x Lines Per Page x Line Length x Ink Per Inch
Bottles = ceil(Total Ink / 30 ml)`,
  ["card-making-supplies-calculator", "scrapbook-page-layout-calculator"]
);

add(
  "paper-crafting-sheets-calculator",
  "Paper Crafting Sheets Calculator",
  "Calculate how many sheets of cardstock or paper are needed for crafting projects based on cuts per sheet and quantities.",
  "Everyday",
  "everyday",
  "~",
  ["paper crafting", "cardstock calculator", "paper cutting", "craft paper sheets"],
  [
    '{ name: "sheetWidth", label: "Sheet Width (inches)", type: "number", min: 4, max: 24, defaultValue: 12 }',
    '{ name: "sheetHeight", label: "Sheet Height (inches)", type: "number", min: 4, max: 24, defaultValue: 12 }',
    '{ name: "cutWidth", label: "Cut Piece Width (inches)", type: "number", min: 0.5, max: 12, defaultValue: 4.25 }',
    '{ name: "cutHeight", label: "Cut Piece Height (inches)", type: "number", min: 0.5, max: 12, defaultValue: 5.5 }',
    '{ name: "quantity", label: "Pieces Needed", type: "number", min: 1, max: 500, defaultValue: 24 }',
    '{ name: "wasteMargin", label: "Blade Waste (inches)", type: "number", min: 0, max: 0.25, defaultValue: 0.0625 }'
  ],
  `(inputs) => {
    const sw = inputs.sheetWidth as number;
    const sh = inputs.sheetHeight as number;
    const cw = inputs.cutWidth as number;
    const ch = inputs.cutHeight as number;
    const qty = inputs.quantity as number;
    const waste = inputs.wasteMargin as number;
    const effectCW = cw + waste;
    const effectCH = ch + waste;
    const orient1 = Math.floor(sw / effectCW) * Math.floor(sh / effectCH);
    const orient2 = Math.floor(sw / effectCH) * Math.floor(sh / effectCW);
    const cutsPerSheet = Math.max(orient1, orient2);
    const sheetsNeeded = Math.ceil(qty / Math.max(cutsPerSheet, 1));
    const totalCuts = sheetsNeeded * cutsPerSheet;
    const wastePercent = Math.round((1 - (cutsPerSheet * cw * ch) / (sw * sh)) * 100);
    return {
      primary: { label: "Sheets Needed", value: formatNumber(sheetsNeeded) },
      details: [
        { label: "Cuts Per Sheet", value: formatNumber(cutsPerSheet) },
        { label: "Total Pieces Cut", value: formatNumber(totalCuts) },
        { label: "Leftover Pieces", value: formatNumber(totalCuts - qty) },
        { label: "Sheet Waste", value: formatNumber(wastePercent) + "%" }
      ]
    };
  }`,
  [
    { q: "What is the standard cardstock sheet size?", a: "The most common cardstock sizes for crafting are 8.5 x 11 inches (letter) and 12 x 12 inches (scrapbook size). A7 card bases are typically cut from 8.5 x 11 sheets." },
    { q: "How thick should cardstock be for card making?", a: "Card bases typically use 65 to 110 lb cardstock. 80 lb is a good all-purpose weight. Lighter weights work for layering and decorative panels." },
    { q: "Should I account for blade waste when cutting?", a: "Yes, trimmer blades remove a tiny amount of material. For precise work, add 1/16 inch per cut to your calculations." }
  ],
  `Cuts Per Sheet = max(floor(W/cw) x floor(H/ch), floor(W/ch) x floor(H/cw))
Sheets Needed = ceil(Quantity / Cuts Per Sheet)
Waste % = (1 - (Cuts x Cut Area) / Sheet Area) x 100`,
  ["card-making-supplies-calculator", "scrapbook-page-layout-calculator"]
);

add(
  "stained-glass-area-calculator",
  "Stained Glass Area Calculator",
  "Calculate glass area, lead came or copper foil, and solder needed for stained glass panel projects.",
  "Everyday",
  "everyday",
  "~",
  ["stained glass area", "stained glass calculator", "lead came", "copper foil glass"],
  [
    '{ name: "panelWidth", label: "Panel Width (inches)", type: "number", min: 4, max: 72, defaultValue: 18 }',
    '{ name: "panelHeight", label: "Panel Height (inches)", type: "number", min: 4, max: 72, defaultValue: 24 }',
    '{ name: "numPieces", label: "Number of Glass Pieces", type: "number", min: 2, max: 200, defaultValue: 25 }',
    '{ name: "technique", label: "Technique", type: "select", options: [{ value: "1", label: "Copper Foil (Tiffany)" }, { value: "2", label: "Lead Came" }], defaultValue: "1" }',
    '{ name: "glassPrice", label: "Glass Price ($/sq ft)", type: "number", min: 3, max: 50, defaultValue: 10 }'
  ],
  `(inputs) => {
    const pw = inputs.panelWidth as number;
    const ph = inputs.panelHeight as number;
    const pieces = inputs.numPieces as number;
    const tech = parseInt(inputs.technique as string);
    const glassPrice = inputs.glassPrice as number;
    const panelArea = pw * ph;
    const panelAreaSqFt = panelArea / 144;
    const wasteFactor = 1.33;
    const glassNeeded = panelAreaSqFt * wasteFactor;
    const glassCost = glassNeeded * glassPrice;
    const avgPerimeter = Math.sqrt(panelArea / pieces) * 4;
    const totalSeamLength = (pieces * avgPerimeter) / 2;
    const borderLength = (pw + ph) * 2;
    const totalCameLength = Math.round(totalSeamLength + borderLength);
    const solderOz = tech === 1 ? Math.round(totalCameLength * 0.06 * 10) / 10 : Math.round(pieces * 0.3 * 10) / 10;
    return {
      primary: { label: "Glass Needed", value: formatNumber(Math.round(glassNeeded * 100) / 100) + " sq ft" },
      details: [
        { label: "Glass Cost", value: "$" + formatNumber(Math.round(glassCost * 100) / 100) },
        { label: "Came/Foil Length", value: formatNumber(totalCameLength) + " inches" },
        { label: "Solder Needed", value: formatNumber(solderOz) + " oz" },
        { label: "Panel Area", value: formatNumber(Math.round(panelAreaSqFt * 100) / 100) + " sq ft" }
      ]
    };
  }`,
  [
    { q: "How much extra glass should I buy for stained glass?", a: "Buy 30 to 40 percent more glass than the panel area to account for cutting waste, breakage, and irregular shapes. Complex curved pieces have higher waste." },
    { q: "What is the difference between copper foil and lead came?", a: "Copper foil (Tiffany method) wraps each piece in adhesive-backed foil and solders joints. Lead came uses H-shaped lead strips between pieces. Foil allows finer detail; came is more traditional." },
    { q: "How much solder do I need?", a: "For copper foil, estimate about 0.5 to 1 pound of solder per 4 square feet of panel. Lead came uses less solder since joints are only at intersections." }
  ],
  `Glass Needed = (Panel Width x Height / 144) x 1.33 waste factor
Came Length = (Pieces x Avg Perimeter / 2) + Border
Solder = Came Length x Usage Factor`,
  ["mosaic-tile-calculator", "resin-art-volume-calculator"]
);

add(
  "mosaic-tile-calculator",
  "Mosaic Tile Calculator",
  "Calculate the number of mosaic tiles, grout, and adhesive needed for mosaic art projects based on area and tile size.",
  "Everyday",
  "everyday",
  "~",
  ["mosaic tile calculator", "mosaic art supplies", "tessera count", "mosaic grout"],
  [
    '{ name: "projectWidth", label: "Project Width (inches)", type: "number", min: 2, max: 120, defaultValue: 18 }',
    '{ name: "projectHeight", label: "Project Height (inches)", type: "number", min: 2, max: 120, defaultValue: 18 }',
    '{ name: "tileSize", label: "Tile Size", type: "select", options: [{ value: "0.375", label: "3/8 inch Micro" }, { value: "0.5", label: "1/2 inch Mini" }, { value: "0.75", label: "3/4 inch Standard" }, { value: "1", label: "1 inch Large" }], defaultValue: "0.75" }',
    '{ name: "groutGap", label: "Grout Gap (inches)", type: "number", min: 0.03, max: 0.25, defaultValue: 0.0625 }',
    '{ name: "coverage", label: "Coverage (%)", type: "number", min: 50, max: 100, defaultValue: 95 }'
  ],
  `(inputs) => {
    const pw = inputs.projectWidth as number;
    const ph = inputs.projectHeight as number;
    const tileSize = parseFloat(inputs.tileSize as string);
    const gap = inputs.groutGap as number;
    const coverage = inputs.coverage as number;
    const projectArea = pw * ph;
    const coveredArea = projectArea * (coverage / 100);
    const tileWithGap = tileSize + gap;
    const tilesAcross = Math.floor(pw / tileWithGap);
    const tilesDown = Math.floor(ph / tileWithGap);
    const totalTiles = Math.ceil(tilesAcross * tilesDown * (coverage / 100));
    const wasteTiles = Math.ceil(totalTiles * 0.15);
    const tilesToBuy = totalTiles + wasteTiles;
    const groutArea = coveredArea - (totalTiles * tileSize * tileSize);
    const groutOz = Math.round(Math.max(groutArea, 0) * 0.5 * 10) / 10;
    return {
      primary: { label: "Tiles Needed (with waste)", value: formatNumber(tilesToBuy) },
      details: [
        { label: "Exact Tile Count", value: formatNumber(totalTiles) },
        { label: "Extra for Waste (15%)", value: formatNumber(wasteTiles) },
        { label: "Grout Needed", value: formatNumber(groutOz) + " oz" },
        { label: "Project Area", value: formatNumber(Math.round(projectArea * 10) / 10) + " sq in" }
      ]
    };
  }`,
  [
    { q: "How many mosaic tiles do I need?", a: "Divide your project area by the tile area (including grout gaps), then add 10 to 15 percent for breakage and waste during cutting." },
    { q: "What size mosaic tile is best for beginners?", a: "Three quarter inch tiles are the most versatile for beginners. They are large enough to handle easily but small enough for good detail." },
    { q: "How much grout do I need for mosaics?", a: "Grout amount depends on gap width and tile thickness. A general rule is about 0.5 ounces per square inch of grout area for standard craft mosaics." }
  ],
  `Tiles = floor(Width / (Tile + Gap)) x floor(Height / (Tile + Gap)) x Coverage%
Tiles to Buy = Tiles + 15% waste
Grout = Grout Area x 0.5 oz per sq inch`,
  ["stained-glass-area-calculator", "resin-art-volume-calculator"]
);

add(
  "crochet-hook-size-calculator",
  "Crochet Hook Size Calculator",
  "Determine the recommended crochet hook size based on yarn weight, gauge swatch measurements, and desired fabric density.",
  "Everyday",
  "everyday",
  "~",
  ["crochet hook size", "crochet gauge", "hook recommendation", "crochet calculator"],
  [
    '{ name: "yarnWeight", label: "Yarn Weight", type: "select", options: [{ value: "1", label: "Lace (0)" }, { value: "2", label: "Fingering (1)" }, { value: "3", label: "Sport (2)" }, { value: "4", label: "DK (3)" }, { value: "5", label: "Worsted (4)" }, { value: "6", label: "Bulky (5)" }, { value: "7", label: "Super Bulky (6)" }], defaultValue: "5" }',
    '{ name: "swatchStitches", label: "Stitches in 4-inch Swatch", type: "number", min: 4, max: 40, defaultValue: 16 }',
    '{ name: "targetStitches", label: "Target Stitches per 4 inches", type: "number", min: 4, max: 40, defaultValue: 16 }',
    '{ name: "density", label: "Desired Fabric Feel", type: "select", options: [{ value: "1", label: "Tight/Dense" }, { value: "2", label: "Standard" }, { value: "3", label: "Loose/Drapey" }], defaultValue: "2" }'
  ],
  `(inputs) => {
    const yarnWeight = parseInt(inputs.yarnWeight as string);
    const swatchSt = inputs.swatchStitches as number;
    const targetSt = inputs.targetStitches as number;
    const density = parseInt(inputs.density as string);
    const baseHookMm = { 1: 2.0, 2: 2.75, 3: 3.5, 4: 4.0, 5: 5.0, 6: 6.5, 7: 9.0 };
    const baseMm = baseHookMm[yarnWeight] || 5.0;
    const gaugeAdj = (swatchSt - targetSt) * 0.25;
    const densityAdj = density === 1 ? -0.5 : density === 3 ? 0.5 : 0;
    const hookMm = Math.round((baseMm + gaugeAdj + densityAdj) * 4) / 4;
    const usLetters = { 2.0: "B/1", 2.25: "B/1", 2.75: "C/2", 3.25: "D/3", 3.5: "E/4", 3.75: "F/5", 4.0: "G/6", 4.5: "7", 5.0: "H/8", 5.5: "I/9", 6.0: "J/10", 6.5: "K/10.5", 8.0: "L/11", 9.0: "M/13", 10.0: "N/15" };
    const closest = Object.keys(usLetters).map(Number).reduce((a, b) => Math.abs(b - hookMm) < Math.abs(a - hookMm) ? b : a);
    const usLetter = usLetters[closest] || "--";
    return {
      primary: { label: "Recommended Hook", value: formatNumber(hookMm) + " mm" },
      details: [
        { label: "US Letter Size", value: usLetter },
        { label: "Base Hook for Yarn", value: formatNumber(baseMm) + " mm" },
        { label: "Gauge Adjustment", value: (gaugeAdj >= 0 ? "+" : "") + formatNumber(gaugeAdj) + " mm" },
        { label: "Density Adjustment", value: (densityAdj >= 0 ? "+" : "") + formatNumber(densityAdj) + " mm" }
      ]
    };
  }`,
  [
    { q: "How do I choose a crochet hook size?", a: "Start with the hook size recommended on the yarn label. Make a gauge swatch and adjust up if your stitches are too tight or down if too loose." },
    { q: "Does hook material affect gauge?", a: "Yes. Aluminum hooks tend to produce tighter stitches while bamboo and wood hooks give slightly looser gauge due to friction differences." },
    { q: "What is gauge in crochet?", a: "Gauge is the number of stitches and rows per inch or per 4 inches. Matching gauge ensures your finished project is the correct size." }
  ],
  `Hook (mm) = Base Hook Size + Gauge Adjustment + Density Adjustment
Gauge Adj = (Swatch Stitches - Target Stitches) x 0.25 mm`,
  ["yarn-yardage-calculator", "cross-stitch-fabric-calculator"]
);

add(
  "sewing-pattern-sizing-calculator",
  "Sewing Pattern Sizing Calculator",
  "Determine your sewing pattern size and adjustments needed based on body measurements and ease preferences.",
  "Everyday",
  "everyday",
  "~",
  ["sewing pattern size", "pattern sizing", "sewing measurements", "garment ease"],
  [
    '{ name: "bust", label: "Bust Measurement (inches)", type: "number", min: 28, max: 60, defaultValue: 36 }',
    '{ name: "waist", label: "Waist Measurement (inches)", type: "number", min: 22, max: 55, defaultValue: 28 }',
    '{ name: "hip", label: "Hip Measurement (inches)", type: "number", min: 30, max: 60, defaultValue: 38 }',
    '{ name: "ease", label: "Desired Ease", type: "select", options: [{ value: "1", label: "Close-fitting (+1-2 in)" }, { value: "2", label: "Standard (+3-4 in)" }, { value: "3", label: "Loose (+5-6 in)" }, { value: "4", label: "Oversized (+8+ in)" }], defaultValue: "2" }',
    '{ name: "patternType", label: "Pattern Type", type: "select", options: [{ value: "1", label: "Top/Blouse" }, { value: "2", label: "Dress" }, { value: "3", label: "Pants/Skirt" }], defaultValue: "1" }'
  ],
  `(inputs) => {
    const bust = inputs.bust as number;
    const waist = inputs.waist as number;
    const hip = inputs.hip as number;
    const ease = parseInt(inputs.ease as string);
    const patternType = parseInt(inputs.patternType as string);
    const easeValues = { 1: 1.5, 2: 3.5, 3: 5.5, 4: 8 };
    const easeAmt = easeValues[ease] || 3.5;
    const bustWithEase = bust + easeAmt;
    const waistWithEase = waist + easeAmt;
    const hipWithEase = hip + easeAmt;
    const sizeChart = [
      { size: 4, bust: 31.5, waist: 23.5, hip: 33.5 },
      { size: 6, bust: 32.5, waist: 24.5, hip: 34.5 },
      { size: 8, bust: 33.5, waist: 25.5, hip: 35.5 },
      { size: 10, bust: 35, waist: 27, hip: 37 },
      { size: 12, bust: 36.5, waist: 28.5, hip: 38.5 },
      { size: 14, bust: 38, waist: 30, hip: 40 },
      { size: 16, bust: 40, waist: 32, hip: 42 },
      { size: 18, bust: 42, waist: 34, hip: 44 },
      { size: 20, bust: 44, waist: 36, hip: 46 }
    ];
    const primary = patternType === 3 ? hip : bust;
    const matchField = patternType === 3 ? "hip" : "bust";
    let bestSize = sizeChart[0];
    for (let i = 0; i < sizeChart.length; i++) {
      if (primary <= sizeChart[i][matchField]) {
        bestSize = sizeChart[i];
        break;
      }
      if (i === sizeChart.length - 1) bestSize = sizeChart[i];
    }
    const bustDiff = Math.round((bust - bestSize.bust) * 10) / 10;
    const waistDiff = Math.round((waist - bestSize.waist) * 10) / 10;
    const hipDiff = Math.round((hip - bestSize.hip) * 10) / 10;
    return {
      primary: { label: "Pattern Size", value: formatNumber(bestSize.size) },
      details: [
        { label: "Bust Adjustment", value: (bustDiff >= 0 ? "+" : "") + formatNumber(bustDiff) + " in" },
        { label: "Waist Adjustment", value: (waistDiff >= 0 ? "+" : "") + formatNumber(waistDiff) + " in" },
        { label: "Hip Adjustment", value: (hipDiff >= 0 ? "+" : "") + formatNumber(hipDiff) + " in" },
        { label: "Ease Added", value: formatNumber(easeAmt) + " inches" }
      ]
    };
  }`,
  [
    { q: "How do I find my sewing pattern size?", a: "Measure your bust, waist, and hips at the fullest points. Compare to the pattern size chart. For tops, match your bust. For skirts and pants, match your hip measurement." },
    { q: "What is ease in sewing?", a: "Ease is extra room built into a pattern beyond your body measurements. Wearing ease allows movement. Design ease creates the style silhouette." },
    { q: "What if I am between pattern sizes?", a: "Cut the larger size and adjust fit during construction. You can also grade between sizes, cutting one size at the bust and another at the hip." }
  ],
  `Pattern Size = Closest size match to primary measurement (bust for tops, hip for bottoms)
Adjustments = Body Measurement - Pattern Size Chart Measurement`,
  ["quilt-fabric-calculator", "fabric-yardage-calculator"]
);

add(
  "tie-dye-fabric-calculator",
  "Tie-Dye Fabric Calculator",
  "Calculate dye powder, soda ash, and water quantities for tie-dye projects based on fabric weight and number of items.",
  "Everyday",
  "everyday",
  "~",
  ["tie dye calculator", "fabric dye amount", "tie dye supplies", "dye powder calculator"],
  [
    '{ name: "numItems", label: "Number of Items", type: "number", min: 1, max: 50, defaultValue: 6 }',
    '{ name: "itemWeight", label: "Avg Item Weight (oz)", type: "number", min: 2, max: 32, defaultValue: 6 }',
    '{ name: "dyeType", label: "Dye Type", type: "select", options: [{ value: "1", label: "Procion MX (powder)" }, { value: "2", label: "Liquid Dye" }, { value: "3", label: "All-Purpose (Rit)" }], defaultValue: "1" }',
    '{ name: "numColors", label: "Number of Colors", type: "number", min: 1, max: 10, defaultValue: 3 }',
    '{ name: "intensity", label: "Color Intensity", type: "select", options: [{ value: "1", label: "Pastel" }, { value: "2", label: "Medium" }, { value: "3", label: "Dark/Vibrant" }], defaultValue: "2" }'
  ],
  `(inputs) => {
    const numItems = inputs.numItems as number;
    const itemWeight = inputs.itemWeight as number;
    const dyeType = parseInt(inputs.dyeType as string);
    const numColors = inputs.numColors as number;
    const intensity = parseInt(inputs.intensity as string);
    const totalFabricOz = numItems * itemWeight;
    const tspPerOzFabric = { 1: 0.15, 2: 0.5, 3: 0.3 };
    const intensityMult = { 1: 0.5, 2: 1.0, 3: 2.0 };
    const dyePerOz = (tspPerOzFabric[dyeType] || 0.15) * (intensityMult[intensity] || 1.0);
    const totalDyeTsp = totalFabricOz * dyePerOz;
    const dyePerColor = Math.round(totalDyeTsp / numColors * 10) / 10;
    const sodaAshTsp = totalFabricOz * 0.2;
    const waterCups = totalFabricOz * 0.5;
    return {
      primary: { label: "Total Dye Needed", value: formatNumber(Math.round(totalDyeTsp * 10) / 10) + " tsp" },
      details: [
        { label: "Dye Per Color", value: formatNumber(dyePerColor) + " tsp" },
        { label: "Soda Ash", value: formatNumber(Math.round(sodaAshTsp * 10) / 10) + " tsp" },
        { label: "Water for Dye", value: formatNumber(Math.round(waterCups * 10) / 10) + " cups" },
        { label: "Total Fabric Weight", value: formatNumber(totalFabricOz) + " oz" }
      ]
    };
  }`,
  [
    { q: "How much dye do I need for tie-dye?", a: "For Procion MX dye, use about 2 to 4 teaspoons of dye powder per 8 ounces of fabric for medium colors. Double for dark or vibrant results." },
    { q: "What is soda ash for in tie-dye?", a: "Soda ash (sodium carbonate) is a fixative that raises the pH to allow fiber-reactive dyes like Procion MX to bond permanently with cotton fibers." },
    { q: "Can I tie-dye polyester?", a: "Standard fiber-reactive dyes only work on natural fibers like cotton. Polyester requires disperse dyes and high heat. Cotton or cotton blends with at least 60 percent cotton work best." }
  ],
  `Total Dye (tsp) = Total Fabric Weight x Dye Rate x Intensity Multiplier
Dye Per Color = Total Dye / Number of Colors
Soda Ash = Fabric Weight x 0.2 tsp per oz`,
  ["candle-making-wax-calculator", "soap-making-lye-calculator"]
);

add(
  "flower-arrangement-cost-calculator",
  "Flower Arrangement Cost Calculator",
  "Estimate the cost of floral arrangements based on flower types, quantities, and arrangement style.",
  "Finance",
  "finance",
  "$",
  ["flower arrangement cost", "floral budget", "bouquet price", "wedding flowers cost"],
  [
    '{ name: "arrangementType", label: "Arrangement Type", type: "select", options: [{ value: "1", label: "Bouquet" }, { value: "2", label: "Centerpiece" }, { value: "3", label: "Corsage/Boutonniere" }, { value: "4", label: "Large Urn/Altar" }], defaultValue: "1" }',
    '{ name: "flowerTier", label: "Flower Tier", type: "select", options: [{ value: "1", label: "Budget (Carnations, Daisies)" }, { value: "2", label: "Mid-Range (Roses, Lilies)" }, { value: "3", label: "Premium (Peonies, Orchids)" }], defaultValue: "2" }',
    '{ name: "numArrangements", label: "Number of Arrangements", type: "number", min: 1, max: 50, defaultValue: 5 }',
    '{ name: "greenery", label: "Greenery Level", type: "select", options: [{ value: "1", label: "Minimal" }, { value: "2", label: "Standard" }, { value: "3", label: "Lush/Full" }], defaultValue: "2" }',
    '{ name: "season", label: "Season", type: "select", options: [{ value: "1", label: "In Season" }, { value: "2", label: "Off Season" }], defaultValue: "1" }'
  ],
  `(inputs) => {
    const arrType = parseInt(inputs.arrangementType as string);
    const tier = parseInt(inputs.flowerTier as string);
    const numArr = inputs.numArrangements as number;
    const greenery = parseInt(inputs.greenery as string);
    const season = parseInt(inputs.season as string);
    const baseCost = { 1: 45, 2: 55, 3: 15, 4: 120 };
    const tierMult = { 1: 0.6, 2: 1.0, 3: 1.8 };
    const greeneryAdd = { 1: 0, 2: 8, 3: 18 };
    const seasonMult = season === 2 ? 1.3 : 1.0;
    const costPerArr = ((baseCost[arrType] || 45) * (tierMult[tier] || 1.0) + (greeneryAdd[greenery] || 8)) * seasonMult;
    const totalCost = costPerArr * numArr;
    const deliveryFee = totalCost > 200 ? 0 : 25;
    const grandTotal = totalCost + deliveryFee;
    return {
      primary: { label: "Cost Per Arrangement", value: "$" + formatNumber(Math.round(costPerArr * 100) / 100) },
      details: [
        { label: "Total for All", value: "$" + formatNumber(Math.round(totalCost * 100) / 100) },
        { label: "Number of Arrangements", value: formatNumber(numArr) },
        { label: "Delivery Fee", value: deliveryFee === 0 ? "Free (over $200)" : "$" + formatNumber(deliveryFee) },
        { label: "Grand Total", value: "$" + formatNumber(Math.round(grandTotal * 100) / 100) }
      ]
    };
  }`,
  [
    { q: "How much do flower arrangements cost?", a: "A simple bouquet starts around 25 to 40 dollars. Centerpieces run 40 to 80 dollars. Large altar arrangements can cost 100 to 300 dollars or more depending on flowers used." },
    { q: "Are wedding flowers more expensive?", a: "Wedding flowers often cost more due to design time, delivery, setup, and the expectation of premium blooms. Valentine's Day and Mother's Day also drive prices up." },
    { q: "How can I save money on flowers?", a: "Use in-season flowers, choose more greenery, use budget-friendly blooms as filler, and keep arrangements smaller. Buying wholesale for DIY arrangements can save 40 to 60 percent." }
  ],
  `Cost Per Arrangement = (Base Cost x Flower Tier Multiplier + Greenery Add-on) x Season Multiplier
Total Cost = Cost Per Arrangement x Number of Arrangements`,
  ["candle-making-wax-calculator", "leather-working-cost-calculator"]
);

add(
  "card-making-supplies-calculator",
  "Card Making Supplies Calculator",
  "Calculate cardstock, envelopes, and embellishment quantities for handmade card projects.",
  "Everyday",
  "everyday",
  "~",
  ["card making supplies", "handmade card calculator", "greeting card materials", "cardstock calculator"],
  [
    '{ name: "numCards", label: "Number of Cards", type: "number", min: 1, max: 200, defaultValue: 20 }',
    '{ name: "cardSize", label: "Card Size", type: "select", options: [{ value: "1", label: "A2 (4.25x5.5)" }, { value: "2", label: "A6 (4.5x6.25)" }, { value: "3", label: "A7 (5x7)" }, { value: "4", label: "Square (5.5x5.5)" }], defaultValue: "1" }',
    '{ name: "layers", label: "Number of Card Layers", type: "number", min: 1, max: 5, defaultValue: 2 }',
    '{ name: "embellishments", label: "Embellishment Level", type: "select", options: [{ value: "1", label: "None/Minimal" }, { value: "2", label: "Moderate (ribbon, gems)" }, { value: "3", label: "Elaborate (die cuts, stamps)" }], defaultValue: "2" }',
    '{ name: "includeEnvelopes", label: "Include Envelopes", type: "select", options: [{ value: "1", label: "Yes" }, { value: "0", label: "No" }], defaultValue: "1" }'
  ],
  `(inputs) => {
    const numCards = inputs.numCards as number;
    const cardSize = parseInt(inputs.cardSize as string);
    const layers = inputs.layers as number;
    const embLevel = parseInt(inputs.embellishments as string);
    const inclEnv = parseInt(inputs.includeEnvelopes as string);
    const cardDims = { 1: [8.5, 5.5], 2: [9, 6.25], 3: [10, 7], 4: [11, 5.5] };
    const dims = cardDims[cardSize] || [8.5, 5.5];
    const sheetArea = 12 * 12;
    const cardArea = dims[0] * dims[1];
    const cardsPerSheet = Math.floor(sheetArea / cardArea);
    const baseSheetsNeeded = Math.ceil(numCards / Math.max(cardsPerSheet, 1));
    const totalSheets = baseSheetsNeeded * layers;
    const embCostPer = { 1: 0.1, 2: 0.5, 3: 1.5 };
    const sheetCost = totalSheets * 0.5;
    const embCost = numCards * (embCostPer[embLevel] || 0.5);
    const envCost = inclEnv === 1 ? numCards * 0.25 : 0;
    const totalCost = sheetCost + embCost + envCost;
    const costPerCard = totalCost / numCards;
    return {
      primary: { label: "Cardstock Sheets Needed", value: formatNumber(totalSheets) },
      details: [
        { label: "Cards Per Sheet", value: formatNumber(cardsPerSheet) },
        { label: "Cardstock Cost", value: "$" + formatNumber(Math.round(sheetCost * 100) / 100) },
        { label: "Embellishment Cost", value: "$" + formatNumber(Math.round(embCost * 100) / 100) },
        { label: "Cost Per Card", value: "$" + formatNumber(Math.round(costPerCard * 100) / 100) }
      ]
    };
  }`,
  [
    { q: "How much does it cost to make handmade cards?", a: "A simple handmade card costs about 50 cents to 1 dollar in materials. Elaborate cards with die cuts, stamps, and special papers can cost 2 to 5 dollars each." },
    { q: "What cardstock weight is best for card making?", a: "Use 80 to 110 lb cardstock for card bases. Lighter weights (65 lb) work for decorative layers. Heavier weights can be difficult to fold cleanly." },
    { q: "What size envelopes do I need?", a: "A2 cards use A2 envelopes (4.375 x 5.75). A7 cards use A7 envelopes (5.25 x 7.25). Always buy envelopes slightly larger than the card." }
  ],
  `Sheets = ceil(Cards / Cards Per Sheet) x Layers
Cost = (Sheets x $0.50) + (Cards x Embellishment Cost) + Envelope Cost
Cost Per Card = Total Cost / Number of Cards`,
  ["paper-crafting-sheets-calculator", "scrapbook-page-layout-calculator"]
);

add(
  "jewelry-wire-calculator",
  "Jewelry Wire Calculator",
  "Calculate wire length, gauge recommendations, and cost for jewelry making projects based on design type and dimensions.",
  "Everyday",
  "everyday",
  "~",
  ["jewelry wire", "wire wrapping calculator", "beading wire", "jewelry making supplies"],
  [
    '{ name: "projectType", label: "Project Type", type: "select", options: [{ value: "1", label: "Simple Chain/Necklace" }, { value: "2", label: "Wire Wrapped Pendant" }, { value: "3", label: "Bracelet" }, { value: "4", label: "Earrings (pair)" }, { value: "5", label: "Wire Wrapped Ring" }], defaultValue: "1" }',
    '{ name: "designLength", label: "Finished Length (inches)", type: "number", min: 1, max: 36, defaultValue: 18 }',
    '{ name: "wireGauge", label: "Wire Gauge", type: "select", options: [{ value: "1", label: "18 gauge (Heavy)" }, { value: "2", label: "20 gauge (Medium)" }, { value: "3", label: "22 gauge (Fine)" }, { value: "4", label: "24 gauge (Thin)" }, { value: "5", label: "26 gauge (Extra Thin)" }], defaultValue: "3" }',
    '{ name: "wireMaterial", label: "Wire Material", type: "select", options: [{ value: "1", label: "Copper" }, { value: "2", label: "Sterling Silver" }, { value: "3", label: "Gold-Filled" }, { value: "4", label: "Craft Wire" }], defaultValue: "1" }',
    '{ name: "complexity", label: "Design Complexity", type: "select", options: [{ value: "1", label: "Simple" }, { value: "2", label: "Moderate" }, { value: "3", label: "Complex" }], defaultValue: "2" }'
  ],
  `(inputs) => {
    const projType = parseInt(inputs.projectType as string);
    const designLen = inputs.designLength as number;
    const gauge = parseInt(inputs.wireGauge as string);
    const material = parseInt(inputs.wireMaterial as string);
    const complexity = parseInt(inputs.complexity as string);
    const projMultiplier = { 1: 1.3, 2: 5, 3: 1.5, 4: 3, 5: 4 };
    const complexMult = { 1: 1.0, 2: 1.5, 3: 2.5 };
    const mult = (projMultiplier[projType] || 1.5) * (complexMult[complexity] || 1.5);
    const wireInches = Math.round(designLen * mult);
    const wireFeet = Math.round(wireInches / 12 * 10) / 10;
    const pricePerFoot = { 1: 0.15, 2: 2.5, 3: 4.0, 4: 0.08 };
    const gaugePriceMult = { 1: 2.0, 2: 1.5, 3: 1.0, 4: 0.7, 5: 0.5 };
    const costPerFt = (pricePerFoot[material] || 0.15) * (gaugePriceMult[gauge] || 1.0);
    const totalCost = wireFeet * costPerFt;
    return {
      primary: { label: "Wire Needed", value: formatNumber(wireInches) + " inches" },
      details: [
        { label: "Wire in Feet", value: formatNumber(wireFeet) + " ft" },
        { label: "Cost Per Foot", value: "$" + formatNumber(Math.round(costPerFt * 100) / 100) },
        { label: "Total Wire Cost", value: "$" + formatNumber(Math.round(totalCost * 100) / 100) },
        { label: "Multiplier Used", value: formatNumber(Math.round(mult * 10) / 10) + "x" }
      ]
    };
  }`,
  [
    { q: "How much wire do I need for a wrapped pendant?", a: "A wire-wrapped pendant typically requires 3 to 5 feet of wire depending on stone size and wrapping complexity. Practice pieces first to get an accurate estimate." },
    { q: "What gauge wire is best for jewelry?", a: "20 gauge is good for structural elements and ear wires. 22 to 24 gauge works for wire wrapping. 26 gauge is used for intricate weaving and coiling." },
    { q: "Is sterling silver wire worth the cost?", a: "Sterling silver produces professional results and does not cause skin reactions. For practice and learning, use copper wire which behaves similarly at a fraction of the cost." }
  ],
  `Wire Needed = Finished Length x Project Multiplier x Complexity Multiplier
Cost = Wire (feet) x Price Per Foot x Gauge Multiplier`,
  ["bead-pattern-calculator", "leather-working-cost-calculator"]
);
