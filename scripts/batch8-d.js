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
