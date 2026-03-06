add(
  "earthquake-magnitude-converter",
  "Earthquake Magnitude Converter",
  "Convert between earthquake magnitude scales including Richter, moment magnitude, surface wave, and body wave magnitude with energy equivalents.",
  "Science",
  "science",
  "A",
  ["earthquake magnitude", "Richter scale", "moment magnitude", "seismic scale converter"],
  [
    '{ name: "magnitude", label: "Earthquake Magnitude", type: "number", min: 0, max: 10, defaultValue: 5 }',
    '{ name: "inputScale", label: "Input Scale", type: "select", options: [{ value: "1", label: "Moment Magnitude (Mw)" }, { value: "2", label: "Richter / Local (ML)" }, { value: "3", label: "Surface Wave (Ms)" }, { value: "4", label: "Body Wave (mb)" }], defaultValue: "1" }'
  ],
  `(inputs) => {
    const mag = inputs.magnitude as number;
    const scale = parseFloat(inputs.inputScale as unknown as string);
    let mw = mag;
    if (scale === 2) mw = mag * 0.98 + 0.08;
    if (scale === 3) mw = (mag + 1.07) / 1.03;
    if (scale === 4) mw = (mag - 0.39) / 0.77;
    const ml = (mw - 0.08) / 0.98;
    const ms = mw * 1.03 - 1.07;
    const mb = mw * 0.77 + 0.39;
    const energyJoules = Math.pow(10, 1.5 * mw + 4.8);
    const tntTons = energyJoules / 4.184e9;
    let tntLabel = "";
    if (tntTons < 1000) tntLabel = formatNumber(Math.round(tntTons)) + " tons TNT";
    else if (tntTons < 1e6) tntLabel = formatNumber(Math.round(tntTons / 1000)) + " kilotons TNT";
    else tntLabel = formatNumber(Math.round(tntTons / 1e6)) + " megatons TNT";
    return {
      primary: { label: "Moment Magnitude (Mw)", value: formatNumber(parseFloat(mw.toFixed(2))) },
      details: [
        { label: "Richter / Local (ML)", value: formatNumber(parseFloat(ml.toFixed(2))) },
        { label: "Surface Wave (Ms)", value: formatNumber(parseFloat(ms.toFixed(2))) },
        { label: "Body Wave (mb)", value: formatNumber(parseFloat(mb.toFixed(2))) },
        { label: "Energy Released", value: tntLabel },
        { label: "Energy (Joules)", value: energyJoules.toExponential(2) + " J" }
      ]
    };
  }`,
  [
    { q: "What is the difference between Richter and moment magnitude?", a: "The Richter scale (local magnitude ML) was the original earthquake scale but saturates above 6.5. Moment magnitude (Mw) is more accurate for large earthquakes and is now the standard used by seismologists worldwide." },
    { q: "How much stronger is each whole number increase?", a: "Each whole number increase in magnitude represents roughly 31.6 times more energy released. A magnitude 7 earthquake releases about 1,000 times more energy than a magnitude 5." },
    { q: "What magnitude can humans feel?", a: "Most people can feel earthquakes starting around magnitude 3. Earthquakes below 2.5 are typically not felt but are recorded by instruments." }
  ],
  `Mw (from ML) = ML x 0.98 + 0.08
Mw (from Ms) = (Ms + 1.07) / 1.03
Mw (from mb) = (mb - 0.39) / 0.77
Energy (Joules) = 10^(1.5 x Mw + 4.8)`,
  ["seismic-wave-velocity-calculator", "tsunami-wave-speed-calculator", "volcanic-eruption-index-calculator"]
);

add(
  "seismic-wave-velocity-calculator",
  "Seismic Wave Velocity Calculator",
  "Calculate P-wave and S-wave velocities through different rock types based on density and elastic moduli for seismic analysis.",
  "Science",
  "science",
  "A",
  ["seismic wave velocity", "P-wave speed", "S-wave speed", "seismic analysis", "rock wave propagation"],
  [
    '{ name: "rockType", label: "Rock Type", type: "select", options: [{ value: "1", label: "Granite" }, { value: "2", label: "Basalt" }, { value: "3", label: "Limestone" }, { value: "4", label: "Sandstone" }, { value: "5", label: "Shale" }, { value: "6", label: "Soil/Sediment" }], defaultValue: "1" }',
    '{ name: "depth", label: "Depth (km)", type: "number", min: 0, max: 100, defaultValue: 5 }',
    '{ name: "saturation", label: "Saturation", type: "select", options: [{ value: "1", label: "Dry" }, { value: "1.1", label: "Partially Saturated" }, { value: "1.2", label: "Fully Saturated" }], defaultValue: "1" }'
  ],
  `(inputs) => {
    const rock = parseFloat(inputs.rockType as unknown as string);
    const depth = inputs.depth as number;
    const sat = parseFloat(inputs.saturation as unknown as string);
    const vpBase = { 1: 5500, 2: 6200, 3: 5000, 4: 3500, 5: 3000, 6: 1500 } as Record<number, number>;
    const vsBase = { 1: 3200, 2: 3400, 3: 2800, 4: 2000, 5: 1700, 6: 600 } as Record<number, number>;
    const densities = { 1: 2650, 2: 2900, 3: 2700, 4: 2350, 5: 2400, 6: 1800 } as Record<number, number>;
    const depthFactor = 1 + depth * 0.002;
    const vp = vpBase[rock] * depthFactor * sat;
    const vs = vsBase[rock] * depthFactor;
    const ratio = vp / vs;
    const density = densities[rock];
    const poisson = (Math.pow(ratio, 2) - 2) / (2 * (Math.pow(ratio, 2) - 1));
    return {
      primary: { label: "P-Wave Velocity", value: formatNumber(Math.round(vp)) + " m/s" },
      details: [
        { label: "S-Wave Velocity", value: formatNumber(Math.round(vs)) + " m/s" },
        { label: "Vp/Vs Ratio", value: formatNumber(parseFloat(ratio.toFixed(3))) },
        { label: "Rock Density", value: formatNumber(density) + " kg/m3" },
        { label: "Poisson Ratio", value: formatNumber(parseFloat(poisson.toFixed(3))) },
        { label: "Depth Factor", value: depthFactor.toFixed(3) }
      ]
    };
  }`,
  [
    { q: "What are P-waves and S-waves?", a: "P-waves (primary waves) are compressional waves that travel fastest and arrive first. S-waves (secondary waves) are shear waves that are slower but cause more ground shaking. S-waves cannot travel through liquids." },
    { q: "Why does wave velocity increase with depth?", a: "As depth increases, so does pressure, which compresses the rock and increases its elastic moduli. This causes seismic waves to travel faster through deeper rock layers." },
    { q: "What affects seismic wave velocity?", a: "Key factors include rock type, density, porosity, fluid saturation, confining pressure (depth), temperature, and fracturing. Saturated rocks transmit P-waves faster than dry rocks." }
  ],
  `Vp = BaseVp x DepthFactor x SaturationFactor
Vs = BaseVs x DepthFactor
Vp/Vs Ratio = Vp / Vs
Poisson Ratio = (Ratio^2 - 2) / (2 x (Ratio^2 - 1))`,
  ["earthquake-magnitude-converter", "rock-density-calculator", "slope-stability-factor-calculator"]
);

add(
  "mineral-hardness-comparison-calculator",
  "Mineral Hardness Comparison Calculator",
  "Compare mineral hardness values on the Mohs scale and estimate scratch resistance, absolute hardness, and practical durability ratings.",
  "Science",
  "science",
  "A",
  ["mineral hardness", "Mohs scale", "scratch resistance", "mineral comparison", "gemstone hardness"],
  [
    '{ name: "mineral1", label: "Mineral 1", type: "select", options: [{ value: "1", label: "Talc (1)" }, { value: "2", label: "Gypsum (2)" }, { value: "3", label: "Calcite (3)" }, { value: "4", label: "Fluorite (4)" }, { value: "5", label: "Apatite (5)" }, { value: "6", label: "Orthoclase (6)" }, { value: "7", label: "Quartz (7)" }, { value: "8", label: "Topaz (8)" }, { value: "9", label: "Corundum (9)" }, { value: "10", label: "Diamond (10)" }], defaultValue: "7" }',
    '{ name: "mineral2", label: "Mineral 2", type: "select", options: [{ value: "1", label: "Talc (1)" }, { value: "2", label: "Gypsum (2)" }, { value: "3", label: "Calcite (3)" }, { value: "4", label: "Fluorite (4)" }, { value: "5", label: "Apatite (5)" }, { value: "6", label: "Orthoclase (6)" }, { value: "7", label: "Quartz (7)" }, { value: "8", label: "Topaz (8)" }, { value: "9", label: "Corundum (9)" }, { value: "10", label: "Diamond (10)" }], defaultValue: "5" }'
  ],
  `(inputs) => {
    const m1 = parseFloat(inputs.mineral1 as unknown as string);
    const m2 = parseFloat(inputs.mineral2 as unknown as string);
    const absHardness = { 1: 1, 2: 3, 3: 9, 4: 21, 5: 48, 6: 72, 7: 100, 8: 200, 9: 400, 10: 1500 } as Record<number, number>;
    const names = { 1: "Talc", 2: "Gypsum", 3: "Calcite", 4: "Fluorite", 5: "Apatite", 6: "Orthoclase", 7: "Quartz", 8: "Topaz", 9: "Corundum", 10: "Diamond" } as Record<number, string>;
    const abs1 = absHardness[m1];
    const abs2 = absHardness[m2];
    const ratio = abs1 / abs2;
    const diff = m1 - m2;
    const canScratch = diff > 0 ? names[m1] + " scratches " + names[m2] : diff < 0 ? names[m2] + " scratches " + names[m1] : "Neither scratches the other";
    return {
      primary: { label: "Mohs Difference", value: formatNumber(Math.abs(diff)) + " levels" },
      details: [
        { label: "Scratch Result", value: canScratch },
        { label: names[m1] + " Absolute Hardness", value: formatNumber(abs1) },
        { label: names[m2] + " Absolute Hardness", value: formatNumber(abs2) },
        { label: "Absolute Hardness Ratio", value: formatNumber(parseFloat(ratio.toFixed(2))) + "x" },
        { label: "Harder Mineral", value: diff >= 0 ? names[m1] : names[m2] }
      ]
    };
  }`,
  [
    { q: "What is the Mohs hardness scale?", a: "The Mohs scale ranks mineral hardness from 1 (talc, softest) to 10 (diamond, hardest). A mineral can scratch any mineral with a lower number. It is a relative scale, not linear." },
    { q: "Why is the Mohs scale not linear?", a: "The absolute hardness difference between each Mohs level varies enormously. The jump from corundum (9) to diamond (10) is much larger than from talc (1) to corundum (9) in absolute terms." },
    { q: "What common items can test hardness?", a: "A fingernail is about 2.5, a copper penny about 3.5, a steel knife blade about 5.5, and a glass plate about 5.5 on the Mohs scale." }
  ],
  `Mohs Difference = |Hardness1 - Hardness2|
Absolute Hardness Ratio = AbsoluteHardness1 / AbsoluteHardness2
Scratch Test: Higher Mohs number scratches lower`,
  ["gemstone-carat-to-mm-calculator", "rock-density-calculator", "gold-ore-grade-value-calculator"]
);

add(
  "rock-density-calculator",
  "Rock Density Calculator",
  "Calculate rock density from mass and volume measurements, or estimate density by rock type with porosity and moisture content adjustments.",
  "Science",
  "science",
  "A",
  ["rock density", "mineral density", "specific gravity", "bulk density", "rock mass properties"],
  [
    '{ name: "rockType", label: "Rock Type", type: "select", options: [{ value: "2650", label: "Granite" }, { value: "2900", label: "Basalt" }, { value: "2710", label: "Limestone" }, { value: "2350", label: "Sandstone" }, { value: "2750", label: "Marble" }, { value: "2700", label: "Gneiss" }, { value: "0", label: "Custom (Enter Mass/Volume)" }], defaultValue: "2650" }',
    '{ name: "mass", label: "Sample Mass (grams)", type: "number", min: 0, max: 100000, defaultValue: 500 }',
    '{ name: "volume", label: "Sample Volume (cm3)", type: "number", min: 0, max: 50000, defaultValue: 190 }',
    '{ name: "porosity", label: "Porosity (%)", type: "number", min: 0, max: 60, defaultValue: 5 }',
    '{ name: "moistureContent", label: "Moisture Content (%)", type: "number", min: 0, max: 100, defaultValue: 0 }'
  ],
  `(inputs) => {
    const rockType = parseFloat(inputs.rockType as unknown as string);
    const mass = inputs.mass as number;
    const vol = inputs.volume as number;
    const porosity = inputs.porosity as number / 100;
    const moisture = inputs.moistureContent as number / 100;
    let grainDensity = rockType > 0 ? rockType : (vol > 0 ? (mass / vol) * 1000 : 0);
    const bulkDensity = grainDensity * (1 - porosity) + 1000 * porosity * moisture;
    const dryDensity = grainDensity * (1 - porosity);
    const specificGravity = grainDensity / 1000;
    const satDensity = grainDensity * (1 - porosity) + 1000 * porosity;
    const measuredDensity = vol > 0 ? (mass / vol) * 1000 : grainDensity;
    return {
      primary: { label: "Bulk Density", value: formatNumber(Math.round(bulkDensity)) + " kg/m3" },
      details: [
        { label: "Grain Density", value: formatNumber(Math.round(grainDensity)) + " kg/m3" },
        { label: "Dry Density", value: formatNumber(Math.round(dryDensity)) + " kg/m3" },
        { label: "Saturated Density", value: formatNumber(Math.round(satDensity)) + " kg/m3" },
        { label: "Specific Gravity", value: formatNumber(parseFloat(specificGravity.toFixed(3))) },
        { label: "Measured Density", value: formatNumber(Math.round(measuredDensity)) + " kg/m3" }
      ]
    };
  }`,
  [
    { q: "What is the difference between bulk and grain density?", a: "Grain density is the density of the solid mineral material only. Bulk density includes the pore spaces and any fluids filling them. Bulk density is always lower than or equal to grain density." },
    { q: "How does porosity affect rock density?", a: "Higher porosity means more void space and lower bulk density. A rock with 20% porosity has 20% of its volume as empty space, which significantly reduces its overall density." },
    { q: "What is the densest common rock?", a: "Among common rocks, basalt and gabbro are the densest at about 2,900 to 3,100 kg/m3. For comparison, granite averages about 2,650 kg/m3 and sandstone about 2,350 kg/m3." }
  ],
  `Bulk Density = Grain Density x (1 - Porosity) + Water Density x Porosity x Moisture
Dry Density = Grain Density x (1 - Porosity)
Specific Gravity = Grain Density / 1000`,
  ["mineral-hardness-comparison-calculator", "aggregate-volume-calculator", "excavation-volume-calculator"]
);

add(
  "well-drilling-cost-calculator",
  "Well Drilling Cost Calculator",
  "Estimate the total cost of drilling a water or monitoring well including per-foot drilling costs, casing, pump installation, and permits.",
  "Finance",
  "finance",
  "$",
  ["well drilling cost", "water well price", "borehole cost", "well installation estimate"],
  [
    '{ name: "depth", label: "Well Depth (feet)", type: "number", min: 20, max: 2000, defaultValue: 200 }',
    '{ name: "diameter", label: "Well Diameter (inches)", type: "select", options: [{ value: "4", label: "4 inch" }, { value: "6", label: "6 inch" }, { value: "8", label: "8 inch" }, { value: "12", label: "12 inch" }], defaultValue: "6" }',
    '{ name: "soilType", label: "Ground Conditions", type: "select", options: [{ value: "15", label: "Soft Soil ($15/ft)" }, { value: "25", label: "Clay/Gravel ($25/ft)" }, { value: "45", label: "Soft Rock ($45/ft)" }, { value: "65", label: "Hard Rock ($65/ft)" }], defaultValue: "25" }',
    '{ name: "pumpType", label: "Pump Type", type: "select", options: [{ value: "0", label: "None (Monitoring Well)" }, { value: "1500", label: "Submersible ($1,500)" }, { value: "3000", label: "Deep Well Jet ($3,000)" }, { value: "5000", label: "High-Capacity ($5,000)" }], defaultValue: "1500" }',
    '{ name: "permitCost", label: "Permit and Testing Fees ($)", type: "number", min: 0, max: 5000, defaultValue: 500 }'
  ],
  `(inputs) => {
    const depth = inputs.depth as number;
    const diameter = parseFloat(inputs.diameter as unknown as string);
    const costPerFoot = parseFloat(inputs.soilType as unknown as string);
    const pump = parseFloat(inputs.pumpType as unknown as string);
    const permit = inputs.permitCost as number;
    const diameterMult = diameter / 6;
    const drillingCost = depth * costPerFoot * diameterMult;
    const casingCost = depth * 7 * diameterMult;
    const groutSeal = depth * 3;
    const total = drillingCost + casingCost + groutSeal + pump + permit;
    const costPerGallon = depth > 0 ? total / (depth * 0.5) : 0;
    return {
      primary: { label: "Total Well Cost", value: "$" + formatNumber(Math.round(total)) },
      details: [
        { label: "Drilling Cost", value: "$" + formatNumber(Math.round(drillingCost)) },
        { label: "Casing Cost", value: "$" + formatNumber(Math.round(casingCost)) },
        { label: "Grout and Seal", value: "$" + formatNumber(Math.round(groutSeal)) },
        { label: "Pump Installation", value: "$" + formatNumber(Math.round(pump)) },
        { label: "Permits and Testing", value: "$" + formatNumber(Math.round(permit)) }
      ]
    };
  }`,
  [
    { q: "How much does it cost to drill a well?", a: "Residential water wells typically cost $3,000 to $15,000 depending on depth, ground conditions, and diameter. Shallow wells in soft soil are cheapest, while deep wells through hard rock are most expensive." },
    { q: "How deep does a water well need to be?", a: "Residential wells are typically 100 to 400 feet deep. The required depth depends on the local water table, aquifer depth, and water quality at various levels." },
    { q: "Does well diameter affect cost?", a: "Yes, larger diameter wells cost more due to bigger drill bits, more casing material, and longer drilling time. A 4-inch well is standard for residential, while 8-12 inch wells are used for irrigation or commercial purposes." }
  ],
  `Drilling Cost = Depth x CostPerFoot x (Diameter / 6)
Casing Cost = Depth x $7 x (Diameter / 6)
Grout and Seal = Depth x $3
Total = Drilling + Casing + Grout + Pump + Permits`,
  ["groundwater-flow-rate-calculator", "aquifer-yield-calculator", "excavation-volume-calculator"]
);

add(
  "groundwater-flow-rate-calculator",
  "Groundwater Flow Rate Calculator",
  "Calculate groundwater flow velocity and discharge rate using hydraulic conductivity, hydraulic gradient, and aquifer cross-sectional area.",
  "Science",
  "science",
  "A",
  ["groundwater flow", "Darcy law", "hydraulic conductivity", "aquifer flow rate", "seepage velocity"],
  [
    '{ name: "hydraulicConductivity", label: "Hydraulic Conductivity (m/day)", type: "number", min: 0.001, max: 1000, defaultValue: 10 }',
    '{ name: "hydraulicGradient", label: "Hydraulic Gradient (m/m)", type: "number", min: 0.0001, max: 1, defaultValue: 0.01 }',
    '{ name: "crossSectionArea", label: "Cross-Sectional Area (m2)", type: "number", min: 1, max: 100000, defaultValue: 100 }',
    '{ name: "porosity", label: "Effective Porosity (%)", type: "number", min: 1, max: 60, defaultValue: 25 }'
  ],
  `(inputs) => {
    const K = inputs.hydraulicConductivity as number;
    const i = inputs.hydraulicGradient as number;
    const A = inputs.crossSectionArea as number;
    const n = inputs.porosity as number / 100;
    const darcyVelocity = K * i;
    const seepageVelocity = darcyVelocity / n;
    const discharge = K * i * A;
    const dailyVolume = discharge;
    const yearlyVolume = discharge * 365;
    const travelTime100m = n > 0 ? 100 / seepageVelocity : 0;
    return {
      primary: { label: "Darcy Velocity", value: formatNumber(parseFloat(darcyVelocity.toFixed(4))) + " m/day" },
      details: [
        { label: "Seepage Velocity", value: formatNumber(parseFloat(seepageVelocity.toFixed(4))) + " m/day" },
        { label: "Discharge (Q)", value: formatNumber(parseFloat(discharge.toFixed(2))) + " m3/day" },
        { label: "Annual Volume", value: formatNumber(Math.round(yearlyVolume)) + " m3/year" },
        { label: "Travel Time (100m)", value: formatNumber(parseFloat(travelTime100m.toFixed(1))) + " days" },
        { label: "Effective Porosity", value: formatNumber(n * 100) + "%" }
      ]
    };
  }`,
  [
    { q: "What is Darcy velocity vs seepage velocity?", a: "Darcy velocity is the apparent flow rate through the entire cross-section. Seepage velocity is the actual speed water moves through pore spaces, which is always faster since water only flows through the pores, not the solid rock." },
    { q: "What is hydraulic conductivity?", a: "Hydraulic conductivity measures how easily water flows through soil or rock. Sand and gravel have high values (1-1000 m/day), while clay has very low values (less than 0.001 m/day)." },
    { q: "How fast does groundwater move?", a: "Groundwater typically moves very slowly, from centimeters per day to a few meters per day. In highly permeable gravel aquifers, it can move faster, but it is generally much slower than surface water." }
  ],
  `Darcy Velocity (v) = K x i
Seepage Velocity = v / n (effective porosity)
Discharge (Q) = K x i x A
Travel Time = Distance / Seepage Velocity`,
  ["well-drilling-cost-calculator", "aquifer-yield-calculator", "river-discharge-rate-calculator"]
);

add(
  "soil-compaction-test-calculator",
  "Soil Compaction Test Calculator",
  "Calculate soil compaction percentage, dry density, and moisture content from Proctor test data for construction quality control.",
  "Science",
  "science",
  "A",
  ["soil compaction", "Proctor test", "dry density", "compaction percentage", "construction soil testing"],
  [
    '{ name: "wetWeight", label: "Wet Soil Weight (grams)", type: "number", min: 100, max: 10000, defaultValue: 1850 }',
    '{ name: "moldVolume", label: "Mold Volume (cm3)", type: "number", min: 100, max: 5000, defaultValue: 944 }',
    '{ name: "moistureContent", label: "Moisture Content (%)", type: "number", min: 0, max: 50, defaultValue: 12 }',
    '{ name: "maxDryDensity", label: "Max Dry Density - MDD (g/cm3)", type: "number", min: 1, max: 3, defaultValue: 1.85 }',
    '{ name: "optimumMoisture", label: "Optimum Moisture Content (%)", type: "number", min: 0, max: 40, defaultValue: 14 }'
  ],
  `(inputs) => {
    const wetWt = inputs.wetWeight as number;
    const moldVol = inputs.moldVolume as number;
    const mc = inputs.moistureContent as number;
    const mdd = inputs.maxDryDensity as number;
    const omc = inputs.optimumMoisture as number;
    const wetDensity = wetWt / moldVol;
    const dryDensity = wetDensity / (1 + mc / 100);
    const compaction = (dryDensity / mdd) * 100;
    const voidRatio = (2.65 / dryDensity) - 1;
    const saturation = mc > 0 ? (mc * dryDensity) / (voidRatio * 1) * 100 : 0;
    const pass = compaction >= 95 ? "PASS (>= 95%)" : "FAIL (< 95%)";
    return {
      primary: { label: "Compaction Percentage", value: formatNumber(parseFloat(compaction.toFixed(1))) + "%" },
      details: [
        { label: "Dry Density", value: formatNumber(parseFloat(dryDensity.toFixed(3))) + " g/cm3" },
        { label: "Wet Density", value: formatNumber(parseFloat(wetDensity.toFixed(3))) + " g/cm3" },
        { label: "Void Ratio", value: formatNumber(parseFloat(voidRatio.toFixed(3))) },
        { label: "QC Result (95% Spec)", value: pass },
        { label: "Moisture vs Optimum", value: (mc - omc >= 0 ? "+" : "") + formatNumber(parseFloat((mc - omc).toFixed(1))) + "%" }
      ]
    };
  }`,
  [
    { q: "What is a good soil compaction percentage?", a: "For most construction projects, 95% of the maximum dry density (standard Proctor) is the minimum acceptable compaction. Highway subgrades often require 98% or higher." },
    { q: "What is the Proctor test?", a: "The Proctor compaction test determines the optimal moisture content at which a soil reaches its maximum dry density. The standard test uses a specific compaction energy to establish the benchmark for field quality control." },
    { q: "Why is moisture content important for compaction?", a: "Too little moisture means soil particles cannot slide together efficiently. Too much moisture fills voids with water that cannot be compressed. The optimum moisture content allows maximum particle packing." }
  ],
  `Wet Density = Wet Weight / Mold Volume
Dry Density = Wet Density / (1 + Moisture Content / 100)
Compaction % = (Dry Density / Max Dry Density) x 100
Void Ratio = (Gs / Dry Density) - 1`,
  ["bearing-capacity-calculator", "slope-stability-factor-calculator", "excavation-volume-calculator"]
);

add(
  "bearing-capacity-calculator",
  "Bearing Capacity Calculator",
  "Calculate the ultimate and allowable bearing capacity of soil using Terzaghi bearing capacity equation for foundation design.",
  "Science",
  "science",
  "A",
  ["bearing capacity", "foundation design", "Terzaghi equation", "soil bearing strength", "footing design"],
  [
    '{ name: "cohesion", label: "Soil Cohesion (kPa)", type: "number", min: 0, max: 500, defaultValue: 20 }',
    '{ name: "frictionAngle", label: "Friction Angle (degrees)", type: "number", min: 0, max: 45, defaultValue: 30 }',
    '{ name: "foundationWidth", label: "Foundation Width (m)", type: "number", min: 0.3, max: 20, defaultValue: 2 }',
    '{ name: "foundationDepth", label: "Foundation Depth (m)", type: "number", min: 0.3, max: 10, defaultValue: 1.5 }',
    '{ name: "soilUnitWeight", label: "Soil Unit Weight (kN/m3)", type: "number", min: 10, max: 25, defaultValue: 18 }',
    '{ name: "factorOfSafety", label: "Factor of Safety", type: "number", min: 1, max: 5, defaultValue: 3 }'
  ],
  `(inputs) => {
    const c = inputs.cohesion as number;
    const phi = inputs.frictionAngle as number;
    const B = inputs.foundationWidth as number;
    const D = inputs.foundationDepth as number;
    const gamma = inputs.soilUnitWeight as number;
    const FOS = inputs.factorOfSafety as number;
    const phiRad = phi * Math.PI / 180;
    const Nq = Math.exp(Math.PI * Math.tan(phiRad)) * Math.pow(Math.tan(Math.PI / 4 + phiRad / 2), 2);
    const Nc = (Nq - 1) / Math.tan(phiRad || 0.001);
    const Ngamma = 2 * (Nq + 1) * Math.tan(phiRad);
    const q = gamma * D;
    const qu = c * Nc + q * Nq + 0.5 * gamma * B * Ngamma;
    const qa = qu / FOS;
    return {
      primary: { label: "Allowable Bearing Capacity", value: formatNumber(Math.round(qa)) + " kPa" },
      details: [
        { label: "Ultimate Bearing Capacity", value: formatNumber(Math.round(qu)) + " kPa" },
        { label: "Nc Factor", value: formatNumber(parseFloat(Nc.toFixed(2))) },
        { label: "Nq Factor", value: formatNumber(parseFloat(Nq.toFixed(2))) },
        { label: "Ngamma Factor", value: formatNumber(parseFloat(Ngamma.toFixed(2))) },
        { label: "Overburden Pressure (q)", value: formatNumber(parseFloat(q.toFixed(1))) + " kPa" }
      ]
    };
  }`,
  [
    { q: "What is bearing capacity?", a: "Bearing capacity is the maximum pressure a soil can support from a foundation without failing through shear or excessive settlement. It determines the size and type of foundation needed for a structure." },
    { q: "What factor of safety is used for foundations?", a: "A factor of safety of 3 is standard for most building foundations. Critical structures may use higher values. The allowable bearing capacity is the ultimate capacity divided by the factor of safety." },
    { q: "What affects soil bearing capacity?", a: "Key factors include soil type, cohesion, internal friction angle, depth of foundation, groundwater level, and foundation width and shape. Clay soils rely on cohesion while sandy soils rely on friction." }
  ],
  `qu = c x Nc + q x Nq + 0.5 x gamma x B x Ngamma
qa = qu / Factor of Safety
Nq = e^(pi x tan(phi)) x tan^2(45 + phi/2)
Nc = (Nq - 1) / tan(phi)
Ngamma = 2(Nq + 1) x tan(phi)`,
  ["soil-compaction-test-calculator", "slope-stability-factor-calculator", "excavation-volume-calculator"]
);

add(
  "slope-stability-factor-calculator",
  "Slope Stability Factor Calculator",
  "Calculate the factor of safety for slope stability using the infinite slope method considering soil properties, slope angle, and water table.",
  "Science",
  "science",
  "A",
  ["slope stability", "factor of safety", "landslide risk", "slope angle", "geotechnical analysis"],
  [
    '{ name: "slopeAngle", label: "Slope Angle (degrees)", type: "number", min: 1, max: 80, defaultValue: 30 }',
    '{ name: "cohesion", label: "Soil Cohesion (kPa)", type: "number", min: 0, max: 200, defaultValue: 10 }',
    '{ name: "frictionAngle", label: "Internal Friction Angle (degrees)", type: "number", min: 0, max: 45, defaultValue: 25 }',
    '{ name: "soilDepth", label: "Soil Depth to Failure Plane (m)", type: "number", min: 0.5, max: 30, defaultValue: 3 }',
    '{ name: "unitWeight", label: "Soil Unit Weight (kN/m3)", type: "number", min: 10, max: 25, defaultValue: 19 }',
    '{ name: "waterTable", label: "Water Table Condition", type: "select", options: [{ value: "0", label: "Dry Slope" }, { value: "0.5", label: "Water at Half Depth" }, { value: "1", label: "Fully Saturated" }], defaultValue: "0" }'
  ],
  `(inputs) => {
    const beta = inputs.slopeAngle as number * Math.PI / 180;
    const c = inputs.cohesion as number;
    const phi = inputs.frictionAngle as number * Math.PI / 180;
    const H = inputs.soilDepth as number;
    const gamma = inputs.unitWeight as number;
    const waterRatio = parseFloat(inputs.waterTable as unknown as string);
    const gammaW = 9.81;
    const u = gammaW * H * waterRatio * Math.cos(beta) * Math.cos(beta);
    const normalStress = gamma * H * Math.cos(beta) * Math.cos(beta);
    const shearStress = gamma * H * Math.sin(beta) * Math.cos(beta);
    const shearStrength = c + (normalStress - u) * Math.tan(phi);
    const FOS = shearStress > 0 ? shearStrength / shearStress : 999;
    const status = FOS >= 1.5 ? "Stable" : FOS >= 1.0 ? "Marginally Stable" : "Unstable";
    return {
      primary: { label: "Factor of Safety", value: formatNumber(parseFloat(FOS.toFixed(3))) },
      details: [
        { label: "Stability Status", value: status },
        { label: "Shear Strength", value: formatNumber(parseFloat(shearStrength.toFixed(2))) + " kPa" },
        { label: "Shear Stress", value: formatNumber(parseFloat(shearStress.toFixed(2))) + " kPa" },
        { label: "Normal Stress", value: formatNumber(parseFloat(normalStress.toFixed(2))) + " kPa" },
        { label: "Pore Water Pressure", value: formatNumber(parseFloat(u.toFixed(2))) + " kPa" }
      ]
    };
  }`,
  [
    { q: "What factor of safety is considered stable?", a: "A factor of safety of 1.5 or greater is generally considered stable for permanent slopes. Temporary construction slopes may use 1.25. Values below 1.0 indicate the slope will fail." },
    { q: "How does water affect slope stability?", a: "Water is the most common trigger for landslides. It increases pore water pressure, reduces the effective normal stress, and thus reduces the shear strength along the failure plane, dramatically lowering the factor of safety." },
    { q: "What is the infinite slope method?", a: "The infinite slope method analyzes a long, uniform slope by examining a thin slice of soil parallel to the surface. It works well for shallow, planar failures and is the simplest slope stability analysis method." }
  ],
  `FOS = Shear Strength / Shear Stress
Shear Strength = c + (Normal Stress - Pore Pressure) x tan(phi)
Normal Stress = gamma x H x cos^2(beta)
Shear Stress = gamma x H x sin(beta) x cos(beta)`,
  ["bearing-capacity-calculator", "soil-compaction-test-calculator", "excavation-volume-calculator"]
);

add(
  "tsunami-wave-speed-calculator",
  "Tsunami Wave Speed Calculator",
  "Calculate tsunami wave speed, wavelength, and arrival time based on ocean depth and distance using shallow water wave theory.",
  "Science",
  "science",
  "A",
  ["tsunami speed", "tsunami wave", "shallow water wave", "tsunami arrival time", "ocean wave calculator"],
  [
    '{ name: "oceanDepth", label: "Average Ocean Depth (meters)", type: "number", min: 10, max: 11000, defaultValue: 4000 }',
    '{ name: "distance", label: "Distance to Coast (km)", type: "number", min: 1, max: 20000, defaultValue: 1000 }',
    '{ name: "wavePeriod", label: "Wave Period (minutes)", type: "number", min: 5, max: 120, defaultValue: 20 }',
    '{ name: "initialHeight", label: "Initial Wave Height (m)", type: "number", min: 0.1, max: 30, defaultValue: 1 }',
    '{ name: "coastalDepth", label: "Coastal Shelf Depth (m)", type: "number", min: 1, max: 200, defaultValue: 20 }'
  ],
  `(inputs) => {
    const d = inputs.oceanDepth as number;
    const dist = inputs.distance as number;
    const T = inputs.wavePeriod as number * 60;
    const H0 = inputs.initialHeight as number;
    const dCoast = inputs.coastalDepth as number;
    const g = 9.81;
    const speed = Math.sqrt(g * d);
    const speedKmh = speed * 3.6;
    const wavelength = speed * T / 1000;
    const arrivalMinutes = (dist * 1000 / speed) / 60;
    const arrivalHours = arrivalMinutes / 60;
    const coastalSpeed = Math.sqrt(g * dCoast);
    const amplification = Math.pow(d / dCoast, 0.25);
    const coastalHeight = H0 * amplification;
    return {
      primary: { label: "Deep Water Speed", value: formatNumber(Math.round(speedKmh)) + " km/h" },
      details: [
        { label: "Wave Speed (m/s)", value: formatNumber(parseFloat(speed.toFixed(1))) + " m/s" },
        { label: "Wavelength", value: formatNumber(Math.round(wavelength)) + " km" },
        { label: "Arrival Time", value: formatNumber(parseFloat(arrivalHours.toFixed(2))) + " hours" },
        { label: "Coastal Wave Height", value: formatNumber(parseFloat(coastalHeight.toFixed(1))) + " m" },
        { label: "Amplification Factor", value: formatNumber(parseFloat(amplification.toFixed(2))) + "x" }
      ]
    };
  }`,
  [
    { q: "How fast do tsunamis travel?", a: "In deep ocean (4000m depth), tsunamis travel at about 700 km/h, as fast as a jet airplane. In shallow coastal waters, they slow to about 40-50 km/h but grow much taller." },
    { q: "Why do tsunamis grow taller near shore?", a: "As a tsunami enters shallow water, it slows down but its energy is compressed into a smaller volume. The wave height increases proportionally to the fourth root of the depth ratio, a process called shoaling." },
    { q: "Can you feel a tsunami in deep ocean?", a: "No. In deep water, a tsunami may be only 0.5 to 1 meter tall with a wavelength of hundreds of kilometers. Ships at sea would barely notice it passing underneath." }
  ],
  `Speed = sqrt(g x depth)
Wavelength = Speed x Period
Arrival Time = Distance / Speed
Coastal Height = Initial Height x (Ocean Depth / Coastal Depth)^0.25`,
  ["earthquake-magnitude-converter", "seismic-wave-velocity-calculator", "volcanic-eruption-index-calculator"]
);

add(
  "volcanic-eruption-index-calculator",
  "Volcanic Eruption Index Calculator",
  "Estimate the Volcanic Explosivity Index (VEI) and eruption characteristics from ejected volume, plume height, and eruption duration.",
  "Science",
  "science",
  "A",
  ["volcanic eruption index", "VEI calculator", "eruption magnitude", "volcanic explosivity", "volcano eruption size"],
  [
    '{ name: "ejectaVolume", label: "Ejected Volume (cubic km)", type: "number", min: 0.00001, max: 10000, defaultValue: 1 }',
    '{ name: "plumeHeight", label: "Plume Height (km)", type: "number", min: 0.1, max: 50, defaultValue: 15 }',
    '{ name: "durationHours", label: "Eruption Duration (hours)", type: "number", min: 0.1, max: 10000, defaultValue: 12 }',
    '{ name: "eruptionType", label: "Eruption Style", type: "select", options: [{ value: "1", label: "Effusive (Lava Flow)" }, { value: "2", label: "Explosive (Strombolian)" }, { value: "3", label: "Plinian" }, { value: "4", label: "Ultra-Plinian" }], defaultValue: "2" }'
  ],
  `(inputs) => {
    const vol = inputs.ejectaVolume as number;
    const plume = inputs.plumeHeight as number;
    const duration = inputs.durationHours as number;
    const style = parseFloat(inputs.eruptionType as unknown as string);
    let vei = 0;
    if (vol >= 1000) vei = 8;
    else if (vol >= 100) vei = 7;
    else if (vol >= 10) vei = 6;
    else if (vol >= 1) vei = 5;
    else if (vol >= 0.1) vei = 4;
    else if (vol >= 0.01) vei = 3;
    else if (vol >= 0.001) vei = 2;
    else if (vol >= 0.0001) vei = 1;
    const descriptions = { 0: "Non-explosive", 1: "Gentle", 2: "Explosive", 3: "Severe", 4: "Cataclysmic", 5: "Paroxysmal", 6: "Colossal", 7: "Super-colossal", 8: "Mega-colossal" } as Record<number, string>;
    const energyJoules = vol * 1e9 * 2500 * 1000 * 9.81 * plume * 1000;
    const megatons = energyJoules / 4.184e15;
    const dischargeRate = vol / (duration / 3600);
    return {
      primary: { label: "Volcanic Explosivity Index", value: "VEI " + formatNumber(vei) },
      details: [
        { label: "Classification", value: descriptions[vei] || "Unknown" },
        { label: "Ejecta Volume", value: formatNumber(parseFloat(vol.toFixed(4))) + " km3" },
        { label: "Plume Height", value: formatNumber(plume) + " km" },
        { label: "Energy Equivalent", value: formatNumber(Math.round(megatons)) + " megatons TNT" },
        { label: "Discharge Rate", value: formatNumber(parseFloat(dischargeRate.toFixed(4))) + " km3/s" }
      ]
    };
  }`,
  [
    { q: "What is the Volcanic Explosivity Index?", a: "The VEI is a scale from 0 to 8 that measures the explosiveness of volcanic eruptions based primarily on the volume of ejected material. Each level represents a tenfold increase in ejecta volume." },
    { q: "What was the largest volcanic eruption in history?", a: "The largest known eruption was the Toba supervolcano about 75,000 years ago (VEI 8, ~2,800 km3). In recorded history, the 1815 eruption of Mount Tambora (VEI 7) was the largest, causing the Year Without a Summer." },
    { q: "How often do large eruptions occur?", a: "VEI 2-3 eruptions happen weekly to monthly worldwide. VEI 5 eruptions occur roughly once per decade. VEI 7 eruptions happen every few centuries, and VEI 8 supervolcano events occur every 50,000 to 100,000 years." }
  ],
  `VEI = log10(Ejecta Volume in m3) - 6 (approximately)
Energy = Volume x Density x g x Plume Height
Discharge Rate = Volume / Duration`,
  ["earthquake-magnitude-converter", "tsunami-wave-speed-calculator", "geothermal-gradient-calculator"]
);

add(
  "gemstone-carat-to-mm-calculator",
  "Gemstone Carat to MM Calculator",
  "Convert gemstone weight in carats to approximate dimensions in millimeters based on gem type, cut shape, and specific gravity.",
  "Conversion",
  "conversion",
  "R",
  ["carat to mm", "gemstone size", "diamond dimensions", "gem carat converter", "stone measurements"],
  [
    '{ name: "carats", label: "Weight (Carats)", type: "number", min: 0.01, max: 100, defaultValue: 1 }',
    '{ name: "gemType", label: "Gemstone Type", type: "select", options: [{ value: "3.52", label: "Diamond (SG 3.52)" }, { value: "4.03", label: "Ruby/Sapphire (SG 4.03)" }, { value: "2.72", label: "Emerald (SG 2.72)" }, { value: "3.53", label: "Alexandrite (SG 3.53)" }, { value: "2.65", label: "Quartz/Amethyst (SG 2.65)" }, { value: "3.18", label: "Tourmaline (SG 3.18)" }], defaultValue: "3.52" }',
    '{ name: "cutShape", label: "Cut Shape", type: "select", options: [{ value: "1", label: "Round Brilliant" }, { value: "2", label: "Oval" }, { value: "3", label: "Princess (Square)" }, { value: "4", label: "Emerald Cut" }, { value: "5", label: "Pear" }], defaultValue: "1" }'
  ],
  `(inputs) => {
    const carats = inputs.carats as number;
    const sg = parseFloat(inputs.gemType as unknown as string);
    const cut = parseFloat(inputs.cutShape as unknown as string);
    const massGrams = carats * 0.2;
    const volumeMm3 = (massGrams / sg) * 1000;
    const depthRatios = { 1: 0.6, 2: 0.62, 3: 0.72, 4: 0.65, 5: 0.62 } as Record<number, number>;
    const widthRatios = { 1: 1, 2: 0.75, 3: 1, 4: 0.75, 5: 0.65 } as Record<number, number>;
    const depthR = depthRatios[cut];
    const widthR = widthRatios[cut];
    const diameter = Math.pow(volumeMm3 / (depthR * widthR * Math.PI / 4), 1/3) * (cut === 3 ? 0.95 : 1);
    const length = cut === 1 ? diameter : diameter / widthR;
    const width = cut === 1 ? diameter : diameter;
    const depth = diameter * depthR;
    return {
      primary: { label: "Estimated Diameter/Width", value: formatNumber(parseFloat(width.toFixed(2))) + " mm" },
      details: [
        { label: "Length", value: formatNumber(parseFloat(length.toFixed(2))) + " mm" },
        { label: "Depth", value: formatNumber(parseFloat(depth.toFixed(2))) + " mm" },
        { label: "Mass", value: formatNumber(parseFloat(massGrams.toFixed(4))) + " grams" },
        { label: "Volume", value: formatNumber(parseFloat(volumeMm3.toFixed(2))) + " mm3" },
        { label: "Specific Gravity", value: formatNumber(sg) }
      ]
    };
  }`,
  [
    { q: "How big is a 1 carat diamond?", a: "A 1 carat round brilliant diamond is approximately 6.5mm in diameter. However, the exact dimensions depend on the cut proportions and depth. Well-cut diamonds may appear larger face-up." },
    { q: "Does gemstone type affect size for the same carat weight?", a: "Yes, because different gems have different densities (specific gravity). A 1 carat emerald (SG 2.72) is physically larger than a 1 carat ruby (SG 4.03) because emerald is less dense." },
    { q: "What is a carat?", a: "A carat is a unit of weight equal to 200 milligrams (0.2 grams). It is the standard measure for gemstones. It should not be confused with karat, which measures gold purity." }
  ],
  `Mass (g) = Carats x 0.2
Volume (mm3) = Mass / Specific Gravity x 1000
Diameter = cube root of (Volume / (Depth Ratio x Width Ratio x pi/4))`,
  ["mineral-hardness-comparison-calculator", "gold-ore-grade-value-calculator", "rock-density-calculator"]
);

add(
  "gold-ore-grade-value-calculator",
  "Gold Ore Grade Value Calculator",
  "Calculate the value of gold ore based on grade (grams per tonne), tonnage, gold price, and estimated recovery rate from processing.",
  "Finance",
  "finance",
  "$",
  ["gold ore grade", "ore value", "gold mining value", "ore grade calculator", "gold recovery"],
  [
    '{ name: "oreGrade", label: "Ore Grade (g/tonne)", type: "number", min: 0.1, max: 500, defaultValue: 5 }',
    '{ name: "tonnage", label: "Ore Tonnage (tonnes)", type: "number", min: 1, max: 10000000, defaultValue: 10000 }',
    '{ name: "goldPrice", label: "Gold Price ($/oz)", type: "number", min: 500, max: 5000, defaultValue: 2000 }',
    '{ name: "recoveryRate", label: "Recovery Rate (%)", type: "number", min: 50, max: 99, defaultValue: 90 }',
    '{ name: "processingCost", label: "Processing Cost ($/tonne)", type: "number", min: 5, max: 200, defaultValue: 30 }'
  ],
  `(inputs) => {
    const grade = inputs.oreGrade as number;
    const tonnes = inputs.tonnage as number;
    const price = inputs.goldPrice as number;
    const recovery = inputs.recoveryRate as number / 100;
    const procCost = inputs.processingCost as number;
    const goldGrams = grade * tonnes;
    const recoveredGrams = goldGrams * recovery;
    const troyOz = recoveredGrams / 31.1035;
    const grossValue = troyOz * price;
    const totalProcessing = procCost * tonnes;
    const netValue = grossValue - totalProcessing;
    const valuePerTonne = tonnes > 0 ? netValue / tonnes : 0;
    const breakEvenGrade = (procCost * 31.1035) / (price * recovery);
    return {
      primary: { label: "Net Ore Value", value: "$" + formatNumber(Math.round(netValue)) },
      details: [
        { label: "Gross Gold Value", value: "$" + formatNumber(Math.round(grossValue)) },
        { label: "Recovered Gold", value: formatNumber(parseFloat(troyOz.toFixed(2))) + " troy oz" },
        { label: "Total Processing Cost", value: "$" + formatNumber(Math.round(totalProcessing)) },
        { label: "Net Value Per Tonne", value: "$" + formatNumber(parseFloat(valuePerTonne.toFixed(2))) },
        { label: "Break-Even Grade", value: formatNumber(parseFloat(breakEvenGrade.toFixed(2))) + " g/t" }
      ]
    };
  }`,
  [
    { q: "What is a good gold ore grade?", a: "A grade of 5 to 10 grams per tonne is considered good for open-pit mining. Underground mines typically need 8+ g/t to be profitable. Some high-grade deposits exceed 30 g/t." },
    { q: "What is the recovery rate?", a: "Recovery rate is the percentage of gold successfully extracted from ore during processing. Modern cyanide leaching achieves 85-95% recovery. Gravity methods recover 50-70% depending on ore characteristics." },
    { q: "What does break-even grade mean?", a: "Break-even grade is the minimum ore grade needed for the gold recovered to cover processing costs. Below this grade, mining the ore results in a financial loss." }
  ],
  `Total Gold = Grade x Tonnage
Recovered Gold = Total Gold x Recovery Rate
Troy Ounces = Recovered Grams / 31.1035
Net Value = (Troy Oz x Price) - (Tonnage x Processing Cost)
Break-Even Grade = (Processing Cost x 31.1035) / (Price x Recovery)`,
  ["mining-equipment-cost-per-ton-calculator", "gemstone-carat-to-mm-calculator", "coal-heating-value-calculator"]
);

add(
  "mining-equipment-cost-per-ton-calculator",
  "Mining Equipment Cost Per Ton Calculator",
  "Estimate the per-ton operating cost of mining equipment including fuel, maintenance, operator wages, and depreciation for different equipment types.",
  "Finance",
  "finance",
  "$",
  ["mining cost per ton", "mining equipment cost", "excavator cost", "haul truck cost", "mining operations"],
  [
    '{ name: "equipmentType", label: "Equipment Type", type: "select", options: [{ value: "1", label: "Excavator (200-ton class)" }, { value: "2", label: "Haul Truck (150-ton)" }, { value: "3", label: "Wheel Loader" }, { value: "4", label: "Drill Rig" }, { value: "5", label: "Dozer (D10/D11)" }], defaultValue: "1" }',
    '{ name: "tonsPerHour", label: "Production Rate (tons/hour)", type: "number", min: 10, max: 5000, defaultValue: 500 }',
    '{ name: "hoursPerShift", label: "Hours Per Shift", type: "number", min: 4, max: 12, defaultValue: 10 }',
    '{ name: "fuelPrice", label: "Fuel Price ($/gallon)", type: "number", min: 1, max: 10, defaultValue: 4 }',
    '{ name: "operatorWage", label: "Operator Hourly Wage ($)", type: "number", min: 15, max: 100, defaultValue: 35 }'
  ],
  `(inputs) => {
    const equip = parseFloat(inputs.equipmentType as unknown as string);
    const tph = inputs.tonsPerHour as number;
    const hours = inputs.hoursPerShift as number;
    const fuelPrice = inputs.fuelPrice as number;
    const wage = inputs.operatorWage as number;
    const fuelRates = { 1: 60, 2: 45, 3: 30, 4: 20, 5: 50 } as Record<number, number>;
    const maintRates = { 1: 250, 2: 180, 3: 120, 4: 150, 5: 200 } as Record<number, number>;
    const depreciationHr = { 1: 300, 2: 200, 3: 150, 4: 180, 5: 250 } as Record<number, number>;
    const fuelGph = fuelRates[equip];
    const fuelCostHr = fuelGph * fuelPrice;
    const maintCostHr = maintRates[equip];
    const depHr = depreciationHr[equip];
    const totalHourlyCost = fuelCostHr + maintCostHr + wage + depHr;
    const costPerTon = tph > 0 ? totalHourlyCost / tph : 0;
    const shiftCost = totalHourlyCost * hours;
    const shiftTons = tph * hours;
    return {
      primary: { label: "Cost Per Ton", value: "$" + formatNumber(parseFloat(costPerTon.toFixed(2))) },
      details: [
        { label: "Total Hourly Cost", value: "$" + formatNumber(Math.round(totalHourlyCost)) + "/hr" },
        { label: "Fuel Cost", value: "$" + formatNumber(Math.round(fuelCostHr)) + "/hr (" + fuelGph + " gal/hr)" },
        { label: "Maintenance Cost", value: "$" + formatNumber(maintRates[equip]) + "/hr" },
        { label: "Shift Total Cost", value: "$" + formatNumber(Math.round(shiftCost)) },
        { label: "Shift Production", value: formatNumber(shiftTons) + " tons" }
      ]
    };
  }`,
  [
    { q: "What is the biggest cost in mining operations?", a: "Fuel and maintenance are typically the largest equipment operating costs, often accounting for 60-70% of the total. Labor, depreciation, and tires/undercarriage make up the remainder." },
    { q: "How many tons can a large excavator move per hour?", a: "A 200-ton class hydraulic excavator can load 400 to 800 tons per hour depending on material type, swing angle, and truck positioning. Harder rock reduces productivity significantly." },
    { q: "How do you reduce mining cost per ton?", a: "Key strategies include maximizing equipment utilization, optimizing haul routes, matching truck and loader sizes, reducing idle time, and implementing preventive maintenance programs." }
  ],
  `Fuel Cost/hr = Gallons/hr x Fuel Price
Total Hourly Cost = Fuel + Maintenance + Operator Wage + Depreciation
Cost Per Ton = Total Hourly Cost / Tons Per Hour
Shift Cost = Hourly Cost x Hours Per Shift`,
  ["gold-ore-grade-value-calculator", "excavation-volume-calculator", "aggregate-volume-calculator"]
);

add(
  "land-survey-area-calculator",
  "Land Survey Area Calculator",
  "Calculate land area from survey measurements using traverse coordinates or simple length and width for rectangular, triangular, and irregular plots.",
  "Math",
  "math",
  "+",
  ["land survey area", "plot area", "survey calculator", "acreage calculator", "land measurement"],
  [
    '{ name: "plotShape", label: "Plot Shape", type: "select", options: [{ value: "1", label: "Rectangle" }, { value: "2", label: "Triangle" }, { value: "3", label: "Trapezoid" }, { value: "4", label: "Irregular (4 sides)" }], defaultValue: "1" }',
    '{ name: "side1", label: "Side 1 / Length (meters)", type: "number", min: 1, max: 100000, defaultValue: 100 }',
    '{ name: "side2", label: "Side 2 / Width (meters)", type: "number", min: 1, max: 100000, defaultValue: 50 }',
    '{ name: "side3", label: "Side 3 (for trapezoid/irregular, meters)", type: "number", min: 0, max: 100000, defaultValue: 80 }',
    '{ name: "height", label: "Height/Perpendicular Distance (meters)", type: "number", min: 0, max: 100000, defaultValue: 50 }'
  ],
  `(inputs) => {
    const shape = parseFloat(inputs.plotShape as unknown as string);
    const s1 = inputs.side1 as number;
    const s2 = inputs.side2 as number;
    const s3 = inputs.side3 as number;
    const h = inputs.height as number;
    let areaSqm = 0;
    if (shape === 1) areaSqm = s1 * s2;
    else if (shape === 2) areaSqm = 0.5 * s1 * h;
    else if (shape === 3) areaSqm = 0.5 * (s1 + s3) * h;
    else areaSqm = 0.5 * (s1 + s3) * h;
    const acres = areaSqm / 4046.86;
    const hectares = areaSqm / 10000;
    const sqFeet = areaSqm * 10.7639;
    const perimeter = shape === 1 ? 2 * (s1 + s2) : shape === 2 ? s1 + s2 + Math.sqrt(s1 * s1 + h * h) : s1 + s2 + s3 + h;
    return {
      primary: { label: "Area", value: formatNumber(parseFloat(areaSqm.toFixed(2))) + " m2" },
      details: [
        { label: "Acres", value: formatNumber(parseFloat(acres.toFixed(4))) },
        { label: "Hectares", value: formatNumber(parseFloat(hectares.toFixed(4))) },
        { label: "Square Feet", value: formatNumber(Math.round(sqFeet)) },
        { label: "Perimeter", value: formatNumber(parseFloat(perimeter.toFixed(2))) + " m" },
        { label: "Shape", value: shape === 1 ? "Rectangle" : shape === 2 ? "Triangle" : shape === 3 ? "Trapezoid" : "Irregular" }
      ]
    };
  }`,
  [
    { q: "How many square meters in an acre?", a: "One acre equals 4,046.86 square meters or 43,560 square feet. It is roughly the size of a football field without the end zones." },
    { q: "What tools do land surveyors use?", a: "Modern land surveyors use total stations, GPS/GNSS receivers, and laser scanners. Traditional tools include theodolites, measuring chains, and level instruments. Software processes raw measurements into coordinates and areas." },
    { q: "How accurate are land surveys?", a: "Professional land surveys are typically accurate to within a few centimeters. Boundary surveys must meet legal accuracy standards that vary by jurisdiction, usually 1:5000 to 1:20000 precision ratios." }
  ],
  `Rectangle: Area = Length x Width
Triangle: Area = 0.5 x Base x Height
Trapezoid: Area = 0.5 x (Base1 + Base2) x Height
Acres = Area(m2) / 4046.86
Hectares = Area(m2) / 10000`,
  ["topographic-prominence-calculator", "excavation-volume-calculator", "gravel-calculator"]
);

add(
  "topographic-prominence-calculator",
  "Topographic Prominence Calculator",
  "Calculate the topographic prominence and isolation of a peak by comparing its summit elevation to the highest col connecting it to a higher peak.",
  "Science",
  "science",
  "A",
  ["topographic prominence", "peak prominence", "mountain elevation", "summit isolation", "peak bagging"],
  [
    '{ name: "summitElevation", label: "Summit Elevation (meters)", type: "number", min: 1, max: 9000, defaultValue: 3000 }',
    '{ name: "colElevation", label: "Key Col Elevation (meters)", type: "number", min: 0, max: 8999, defaultValue: 2200 }',
    '{ name: "parentPeakElevation", label: "Parent Peak Elevation (meters)", type: "number", min: 1, max: 9000, defaultValue: 4000 }',
    '{ name: "distanceToParent", label: "Distance to Parent Peak (km)", type: "number", min: 0.1, max: 1000, defaultValue: 25 }'
  ],
  `(inputs) => {
    const summit = inputs.summitElevation as number;
    const col = inputs.colElevation as number;
    const parent = inputs.parentPeakElevation as number;
    const dist = inputs.distanceToParent as number;
    const prominence = summit - col;
    const promRatio = summit > 0 ? (prominence / summit) * 100 : 0;
    const isolation = dist;
    const rise = parent - col;
    const colDepth = summit - col;
    const classification = prominence >= 1500 ? "Ultra-Prominent Peak" : prominence >= 600 ? "Major Peak" : prominence >= 150 ? "Notable Peak" : prominence >= 30 ? "Minor Peak" : "Subpeak";
    const lineOfSight = Math.sqrt(Math.pow(dist * 1000, 2) + Math.pow(parent - summit, 2)) / 1000;
    return {
      primary: { label: "Topographic Prominence", value: formatNumber(Math.round(prominence)) + " m" },
      details: [
        { label: "Prominence Ratio", value: formatNumber(parseFloat(promRatio.toFixed(1))) + "%" },
        { label: "Classification", value: classification },
        { label: "Isolation Distance", value: formatNumber(parseFloat(isolation.toFixed(1))) + " km" },
        { label: "Col Depth", value: formatNumber(Math.round(colDepth)) + " m" },
        { label: "Line-of-Sight to Parent", value: formatNumber(parseFloat(lineOfSight.toFixed(2))) + " km" }
      ]
    };
  }`,
  [
    { q: "What is topographic prominence?", a: "Prominence is the height of a peak above the lowest contour that encircles it but no higher peak. In simpler terms, it is how far you must descend from the summit before ascending a higher peak." },
    { q: "What is an ultra-prominent peak?", a: "An ultra-prominent peak has at least 1,500 meters (about 4,921 feet) of topographic prominence. There are roughly 1,524 ultra-prominent peaks worldwide. Mount Everest has the greatest prominence at 8,849 meters." },
    { q: "What is the difference between prominence and elevation?", a: "Elevation is the height above sea level. Prominence measures how much a peak stands out from its surroundings. A 3,000m peak next to a 2,900m ridge has only 100m prominence despite its high elevation." }
  ],
  `Prominence = Summit Elevation - Key Col Elevation
Prominence Ratio = (Prominence / Summit Elevation) x 100%
Line-of-Sight = sqrt(Distance^2 + Elevation Difference^2)`,
  ["land-survey-area-calculator", "slope-stability-factor-calculator", "river-discharge-rate-calculator"]
);

add(
  "river-discharge-rate-calculator",
  "River Discharge Rate Calculator",
  "Calculate river flow rate (discharge) using channel cross-section area and average velocity with Manning equation for open channel flow.",
  "Science",
  "science",
  "A",
  ["river discharge", "stream flow rate", "Manning equation", "channel flow", "water discharge calculator"],
  [
    '{ name: "channelWidth", label: "Channel Width (meters)", type: "number", min: 0.5, max: 5000, defaultValue: 10 }',
    '{ name: "avgDepth", label: "Average Depth (meters)", type: "number", min: 0.1, max: 50, defaultValue: 2 }',
    '{ name: "slope", label: "Channel Slope (m/m)", type: "number", min: 0.0001, max: 0.5, defaultValue: 0.002 }',
    '{ name: "roughness", label: "Manning Roughness (n)", type: "select", options: [{ value: "0.025", label: "Clean, straight (0.025)" }, { value: "0.03", label: "Winding, some pools (0.030)" }, { value: "0.04", label: "Weedy, deep pools (0.040)" }, { value: "0.06", label: "Mountain stream, cobbles (0.060)" }, { value: "0.1", label: "Floodplain, heavy brush (0.100)" }], defaultValue: "0.03" }'
  ],
  `(inputs) => {
    const w = inputs.channelWidth as number;
    const d = inputs.avgDepth as number;
    const s = inputs.slope as number;
    const n = parseFloat(inputs.roughness as unknown as string);
    const area = w * d;
    const wettedPerimeter = w + 2 * d;
    const hydraulicRadius = area / wettedPerimeter;
    const velocity = (1 / n) * Math.pow(hydraulicRadius, 2/3) * Math.pow(s, 0.5);
    const discharge = velocity * area;
    const dischargeLps = discharge * 1000;
    const dischargeGpm = discharge * 15850.3;
    const dischargeCfs = discharge * 35.3147;
    return {
      primary: { label: "Discharge (Q)", value: formatNumber(parseFloat(discharge.toFixed(2))) + " m3/s" },
      details: [
        { label: "Flow Velocity", value: formatNumber(parseFloat(velocity.toFixed(3))) + " m/s" },
        { label: "Discharge (CFS)", value: formatNumber(parseFloat(dischargeCfs.toFixed(1))) + " ft3/s" },
        { label: "Cross-Section Area", value: formatNumber(parseFloat(area.toFixed(2))) + " m2" },
        { label: "Hydraulic Radius", value: formatNumber(parseFloat(hydraulicRadius.toFixed(3))) + " m" },
        { label: "Wetted Perimeter", value: formatNumber(parseFloat(wettedPerimeter.toFixed(2))) + " m" }
      ]
    };
  }`,
  [
    { q: "What is Manning equation?", a: "Manning equation calculates flow velocity in open channels based on the hydraulic radius, channel slope, and a roughness coefficient (n). It is one of the most widely used formulas in hydraulic engineering." },
    { q: "What affects river discharge?", a: "River discharge depends on channel size (width and depth), slope, and roughness. Rainfall, snowmelt, land use, and upstream dams also affect how much water flows through a river at any given time." },
    { q: "What is hydraulic radius?", a: "Hydraulic radius is the cross-sectional area of flow divided by the wetted perimeter. For wide, shallow channels, it approximately equals the average depth. It is a key parameter in flow calculations." }
  ],
  `V = (1/n) x R^(2/3) x S^(1/2) (Manning Equation)
Q = V x A
R = A / P (Hydraulic Radius)
A = Width x Depth
P = Width + 2 x Depth`,
  ["sediment-transport-calculator", "groundwater-flow-rate-calculator", "aquifer-yield-calculator"]
);

add(
  "sediment-transport-calculator",
  "Sediment Transport Calculator",
  "Estimate sediment transport capacity in rivers using flow velocity, particle size, and channel characteristics with the simplified Engelund-Hansen approach.",
  "Science",
  "science",
  "A",
  ["sediment transport", "bed load", "suspended sediment", "river erosion", "sediment yield"],
  [
    '{ name: "flowVelocity", label: "Flow Velocity (m/s)", type: "number", min: 0.1, max: 10, defaultValue: 1.5 }',
    '{ name: "waterDepth", label: "Water Depth (m)", type: "number", min: 0.1, max: 30, defaultValue: 2 }',
    '{ name: "channelWidth", label: "Channel Width (m)", type: "number", min: 1, max: 5000, defaultValue: 15 }',
    '{ name: "particleSize", label: "Median Particle Size (mm)", type: "select", options: [{ value: "0.1", label: "Fine Sand (0.1 mm)" }, { value: "0.5", label: "Medium Sand (0.5 mm)" }, { value: "2", label: "Coarse Sand (2 mm)" }, { value: "10", label: "Gravel (10 mm)" }, { value: "50", label: "Cobble (50 mm)" }], defaultValue: "0.5" }',
    '{ name: "slope", label: "Channel Slope (m/m)", type: "number", min: 0.0001, max: 0.1, defaultValue: 0.001 }'
  ],
  `(inputs) => {
    const V = inputs.flowVelocity as number;
    const d = inputs.waterDepth as number;
    const w = inputs.channelWidth as number;
    const D = parseFloat(inputs.particleSize as unknown as string) / 1000;
    const S = inputs.slope as number;
    const rhoW = 1000;
    const rhoS = 2650;
    const g = 9.81;
    const shearStress = rhoW * g * d * S;
    const shieldsParam = shearStress / ((rhoS - rhoW) * g * D);
    const criticalShields = 0.047;
    const transport = shieldsParam > criticalShields;
    const qs = 0.05 * rhoS * Math.pow(V, 2) * d * S / ((rhoS / rhoW - 1) * g * D * Math.sqrt((rhoS / rhoW - 1) * g * D));
    const totalTransport = Math.max(0, qs) * w;
    const dailyTons = totalTransport * 86400 / 1000;
    const annualTons = dailyTons * 365;
    return {
      primary: { label: "Transport Rate", value: formatNumber(parseFloat(totalTransport.toFixed(4))) + " kg/s" },
      details: [
        { label: "Daily Load", value: formatNumber(Math.round(dailyTons)) + " tonnes/day" },
        { label: "Annual Load", value: formatNumber(Math.round(annualTons)) + " tonnes/year" },
        { label: "Bed Shear Stress", value: formatNumber(parseFloat(shearStress.toFixed(2))) + " Pa" },
        { label: "Shields Parameter", value: formatNumber(parseFloat(shieldsParam.toFixed(4))) },
        { label: "Transport Active", value: transport ? "Yes" : "No (below threshold)" }
      ]
    };
  }`,
  [
    { q: "What is sediment transport?", a: "Sediment transport is the movement of solid particles (sand, gravel, silt) by flowing water. It includes bed load (particles rolling along the bottom) and suspended load (particles carried in the water column)." },
    { q: "What is the Shields parameter?", a: "The Shields parameter is a dimensionless number comparing the forces trying to move a sediment particle (shear stress) to the forces keeping it in place (gravity). Transport begins when it exceeds a critical value of about 0.047." },
    { q: "Why does sediment transport matter?", a: "Sediment transport affects river channel shape, reservoir sedimentation, coastal erosion, water quality, and aquatic habitat. Understanding it is essential for dam design, flood control, and environmental management." }
  ],
  `Bed Shear Stress = rho_w x g x depth x slope
Shields Parameter = Shear Stress / ((rho_s - rho_w) x g x D)
Transport Rate (Engelund-Hansen) = 0.05 x rho_s x V^2 x d x S / ((SG-1) x g x D x sqrt((SG-1) x g x D))`,
  ["river-discharge-rate-calculator", "groundwater-flow-rate-calculator", "slope-stability-factor-calculator"]
);

add(
  "aquifer-yield-calculator",
  "Aquifer Yield Calculator",
  "Calculate the sustainable yield of an aquifer using transmissivity, storativity, and pumping test data for water supply planning.",
  "Science",
  "science",
  "A",
  ["aquifer yield", "well yield", "transmissivity", "sustainable pumping rate", "groundwater supply"],
  [
    '{ name: "transmissivity", label: "Transmissivity (m2/day)", type: "number", min: 1, max: 10000, defaultValue: 500 }',
    '{ name: "storativity", label: "Storativity", type: "number", min: 0.0001, max: 0.5, defaultValue: 0.001 }',
    '{ name: "aquiferThickness", label: "Aquifer Thickness (m)", type: "number", min: 1, max: 500, defaultValue: 30 }',
    '{ name: "maxDrawdown", label: "Maximum Allowable Drawdown (m)", type: "number", min: 1, max: 200, defaultValue: 15 }',
    '{ name: "wellRadius", label: "Well Radius (m)", type: "number", min: 0.05, max: 1, defaultValue: 0.15 }',
    '{ name: "pumpingDays", label: "Pumping Duration (days)", type: "number", min: 1, max: 365, defaultValue: 180 }'
  ],
  `(inputs) => {
    const T = inputs.transmissivity as number;
    const S = inputs.storativity as number;
    const b = inputs.aquiferThickness as number;
    const sw = inputs.maxDrawdown as number;
    const rw = inputs.wellRadius as number;
    const t = inputs.pumpingDays as number;
    const u = (rw * rw * S) / (4 * T * t);
    const W = -0.5772 - Math.log(u);
    const Q = (4 * Math.PI * T * sw) / W;
    const Qm3day = Q;
    const Qlpm = Q / 1.44;
    const Qgpm = Qlpm * 0.264172;
    const K = T / b;
    const specificCapacity = Q / sw;
    const totalVolume = Q * t;
    return {
      primary: { label: "Sustainable Yield", value: formatNumber(Math.round(Qm3day)) + " m3/day" },
      details: [
        { label: "Pumping Rate", value: formatNumber(parseFloat(Qlpm.toFixed(1))) + " L/min" },
        { label: "Pumping Rate (US)", value: formatNumber(parseFloat(Qgpm.toFixed(1))) + " gal/min" },
        { label: "Specific Capacity", value: formatNumber(parseFloat(specificCapacity.toFixed(2))) + " m3/day/m" },
        { label: "Hydraulic Conductivity", value: formatNumber(parseFloat(K.toFixed(2))) + " m/day" },
        { label: "Total Volume (" + t + " days)", value: formatNumber(Math.round(totalVolume)) + " m3" }
      ]
    };
  }`,
  [
    { q: "What is transmissivity?", a: "Transmissivity is the rate at which water flows through a unit width of aquifer for a unit hydraulic gradient. It equals hydraulic conductivity times aquifer thickness and is measured in m2/day. Higher values mean more productive aquifers." },
    { q: "What is storativity?", a: "Storativity (storage coefficient) is the volume of water released per unit area per unit decline in head. Confined aquifers have very low storativity (0.0001-0.001), while unconfined aquifers have higher values (0.01-0.3)." },
    { q: "How do you determine sustainable yield?", a: "Sustainable yield is determined through pumping tests, aquifer analysis, and long-term water balance studies. It must account for recharge rates, neighboring well interference, and environmental water needs." }
  ],
  `Q = (4 x pi x T x Drawdown) / W(u) (Theis Equation)
u = r^2 x S / (4 x T x t)
W(u) = -0.5772 - ln(u) (approximation)
Specific Capacity = Q / Drawdown
Hydraulic Conductivity = T / Aquifer Thickness`,
  ["groundwater-flow-rate-calculator", "well-drilling-cost-calculator", "river-discharge-rate-calculator"]
);

add(
  "geothermal-gradient-calculator",
  "Geothermal Gradient Calculator",
  "Calculate subsurface temperature at any depth using the geothermal gradient, surface temperature, and thermal conductivity of rock layers.",
  "Science",
  "science",
  "A",
  ["geothermal gradient", "subsurface temperature", "underground temperature", "geothermal energy", "heat flow"],
  [
    '{ name: "surfaceTemp", label: "Surface Temperature (C)", type: "number", min: -30, max: 50, defaultValue: 15 }',
    '{ name: "gradient", label: "Geothermal Gradient (C/km)", type: "number", min: 10, max: 100, defaultValue: 25 }',
    '{ name: "depth", label: "Target Depth (meters)", type: "number", min: 10, max: 10000, defaultValue: 3000 }',
    '{ name: "thermalConductivity", label: "Rock Thermal Conductivity (W/mK)", type: "number", min: 0.5, max: 7, defaultValue: 2.5 }',
    '{ name: "heatFlowDensity", label: "Heat Flow Density (mW/m2)", type: "number", min: 20, max: 200, defaultValue: 65 }'
  ],
  `(inputs) => {
    const Ts = inputs.surfaceTemp as number;
    const grad = inputs.gradient as number;
    const depth = inputs.depth as number;
    const k = inputs.thermalConductivity as number;
    const q = inputs.heatFlowDensity as number;
    const tempAtDepth = Ts + (grad * depth / 1000);
    const tempFromHeatFlow = Ts + (q * depth) / (k * 1000);
    const depthToBoiling = ((100 - Ts) / grad) * 1000;
    const heatFlowCalc = grad * k;
    const tempF = tempAtDepth * 9/5 + 32;
    const energyPotential = tempAtDepth > 150 ? "High (direct power generation)" : tempAtDepth > 90 ? "Medium (binary cycle power)" : tempAtDepth > 50 ? "Low (direct heating use)" : "Very low (heat pumps only)";
    return {
      primary: { label: "Temperature at Depth", value: formatNumber(parseFloat(tempAtDepth.toFixed(1))) + " C" },
      details: [
        { label: "Temperature (Fahrenheit)", value: formatNumber(parseFloat(tempF.toFixed(1))) + " F" },
        { label: "Heat Flow (calculated)", value: formatNumber(parseFloat(heatFlowCalc.toFixed(1))) + " mW/m2" },
        { label: "Depth to 100C", value: formatNumber(Math.round(depthToBoiling)) + " m" },
        { label: "Geothermal Potential", value: energyPotential },
        { label: "Temp from Heat Flow Model", value: formatNumber(parseFloat(tempFromHeatFlow.toFixed(1))) + " C" }
      ]
    };
  }`,
  [
    { q: "What is the average geothermal gradient?", a: "The average geothermal gradient is about 25 to 30 degrees Celsius per kilometer of depth. However, it varies widely from 10 C/km in old continental crust to over 80 C/km near volcanic areas and tectonic boundaries." },
    { q: "How deep do you need to drill for geothermal energy?", a: "For electricity generation, wells typically need to reach 150 C or higher, which is usually 2-5 km deep. For direct heating, shallower wells of 1-2 km may suffice. Geothermal heat pumps work at just 3-100 meters." },
    { q: "What is heat flow density?", a: "Heat flow density measures the rate of heat transfer from the Earth interior to the surface per unit area, in milliwatts per square meter. The global average is about 65 mW/m2, higher near plate boundaries and hotspots." }
  ],
  `Temperature at Depth = Surface Temp + (Gradient x Depth / 1000)
Heat Flow = Gradient x Thermal Conductivity
Depth to 100C = ((100 - Surface Temp) / Gradient) x 1000`,
  ["volcanic-eruption-index-calculator", "well-drilling-cost-calculator", "rock-density-calculator"]
);

add(
  "plate-tectonics-velocity-calculator",
  "Plate Tectonics Velocity Calculator",
  "Calculate tectonic plate movement rates, displacement over time, and convergence or divergence speeds between two plates.",
  "Science",
  "science",
  "A",
  ["plate tectonics velocity", "plate movement", "continental drift", "plate boundary speed", "tectonic rate"],
  [
    '{ name: "plate1Velocity", label: "Plate 1 Velocity (mm/year)", type: "number", min: 0, max: 200, defaultValue: 60 }',
    '{ name: "plate1Direction", label: "Plate 1 Direction (degrees from N)", type: "number", min: 0, max: 360, defaultValue: 315 }',
    '{ name: "plate2Velocity", label: "Plate 2 Velocity (mm/year)", type: "number", min: 0, max: 200, defaultValue: 25 }',
    '{ name: "plate2Direction", label: "Plate 2 Direction (degrees from N)", type: "number", min: 0, max: 360, defaultValue: 45 }',
    '{ name: "timeYears", label: "Time Period (million years)", type: "number", min: 0.1, max: 500, defaultValue: 10 }'
  ],
  `(inputs) => {
    const v1 = inputs.plate1Velocity as number;
    const d1 = inputs.plate1Direction as number * Math.PI / 180;
    const v2 = inputs.plate2Velocity as number;
    const d2 = inputs.plate2Direction as number * Math.PI / 180;
    const t = inputs.timeYears as number;
    const v1x = v1 * Math.sin(d1);
    const v1y = v1 * Math.cos(d1);
    const v2x = v2 * Math.sin(d2);
    const v2y = v2 * Math.cos(d2);
    const relVx = v1x - v2x;
    const relVy = v1y - v2y;
    const relVelocity = Math.sqrt(relVx * relVx + relVy * relVy);
    const relDirection = (Math.atan2(relVx, relVy) * 180 / Math.PI + 360) % 360;
    const displacementKm = relVelocity * t * 1e6 / 1e6;
    const plate1DisplKm = v1 * t * 1e6 / 1e6;
    const cmPerYear = relVelocity / 10;
    const boundaryType = relVelocity < 5 ? "Transform/Slow" : "Active Convergent/Divergent";
    return {
      primary: { label: "Relative Velocity", value: formatNumber(parseFloat(relVelocity.toFixed(1))) + " mm/yr" },
      details: [
        { label: "Relative Speed (cm/yr)", value: formatNumber(parseFloat(cmPerYear.toFixed(2))) + " cm/yr" },
        { label: "Relative Direction", value: formatNumber(Math.round(relDirection)) + " degrees" },
        { label: "Displacement in " + t + " Myr", value: formatNumber(Math.round(displacementKm)) + " km" },
        { label: "Plate 1 Travel in " + t + " Myr", value: formatNumber(Math.round(plate1DisplKm)) + " km" },
        { label: "Boundary Activity", value: boundaryType }
      ]
    };
  }`,
  [
    { q: "How fast do tectonic plates move?", a: "Most plates move 1 to 10 centimeters per year. The fastest is the Pacific Plate at about 7-10 cm/yr. The slowest plates, like the Antarctic Plate, move less than 2 cm/yr." },
    { q: "What happens at plate boundaries?", a: "At convergent boundaries, plates collide causing mountains, trenches, and subduction. At divergent boundaries, plates separate creating rift valleys and mid-ocean ridges. Transform boundaries cause lateral sliding and earthquakes." },
    { q: "How is plate velocity measured?", a: "Modern plate velocities are measured using GPS stations, satellite laser ranging, and very long baseline interferometry. Historical velocities are determined from magnetic anomalies on the ocean floor and hotspot tracks." }
  ],
  `Relative Velocity = sqrt((V1x - V2x)^2 + (V1y - V2y)^2)
Vx = V x sin(Direction), Vy = V x cos(Direction)
Displacement (km) = Relative Velocity (mm/yr) x Time (Myr)`,
  ["earthquake-magnitude-converter", "seismic-wave-velocity-calculator", "volcanic-eruption-index-calculator"]
);

add(
  "coal-heating-value-calculator",
  "Coal Heating Value Calculator",
  "Calculate the heating value and energy content of coal based on rank, moisture content, ash content, and sulfur percentage.",
  "Science",
  "science",
  "A",
  ["coal heating value", "BTU coal", "coal energy", "coal rank", "calorific value"],
  [
    '{ name: "coalRank", label: "Coal Rank", type: "select", options: [{ value: "14000", label: "Anthracite (14,000 BTU/lb)" }, { value: "12500", label: "Bituminous (12,500 BTU/lb)" }, { value: "9500", label: "Sub-bituminous (9,500 BTU/lb)" }, { value: "6500", label: "Lignite (6,500 BTU/lb)" }], defaultValue: "12500" }',
    '{ name: "tonnage", label: "Coal Quantity (tonnes)", type: "number", min: 1, max: 1000000, defaultValue: 1000 }',
    '{ name: "moisture", label: "Moisture Content (%)", type: "number", min: 0, max: 50, defaultValue: 8 }',
    '{ name: "ash", label: "Ash Content (%)", type: "number", min: 0, max: 40, defaultValue: 10 }',
    '{ name: "sulfur", label: "Sulfur Content (%)", type: "number", min: 0, max: 8, defaultValue: 1.5 }'
  ],
  `(inputs) => {
    const baseBTU = parseFloat(inputs.coalRank as unknown as string);
    const tonnes = inputs.tonnage as number;
    const moisture = inputs.moisture as number / 100;
    const ash = inputs.ash as number / 100;
    const sulfur = inputs.sulfur as number / 100;
    const effectiveFraction = 1 - moisture - ash;
    const actualBTU = baseBTU * effectiveFraction;
    const totalBTU = actualBTU * tonnes * 2204.62;
    const totalGJ = totalBTU * 0.001055 / 1000;
    const totalMWh = totalGJ / 3.6;
    const co2Tons = tonnes * effectiveFraction * 0.75 * 3.667;
    const so2Tons = tonnes * sulfur * 2;
    const pricePerTon = actualBTU > 10000 ? 80 : actualBTU > 7000 ? 50 : 30;
    return {
      primary: { label: "Effective Heating Value", value: formatNumber(Math.round(actualBTU)) + " BTU/lb" },
      details: [
        { label: "Total Energy", value: formatNumber(Math.round(totalGJ)) + " GJ" },
        { label: "Electrical Equivalent", value: formatNumber(Math.round(totalMWh)) + " MWh" },
        { label: "Combustible Fraction", value: (effectiveFraction * 100).toFixed(1) + "%" },
        { label: "CO2 Emissions", value: formatNumber(Math.round(co2Tons)) + " tonnes" },
        { label: "SO2 Emissions", value: formatNumber(parseFloat(so2Tons.toFixed(1))) + " tonnes" }
      ]
    };
  }`,
  [
    { q: "What is coal heating value?", a: "Heating value (calorific value) is the amount of energy released when coal is burned, measured in BTU per pound or megajoules per kilogram. It determines how much useful energy can be extracted from a given quantity of coal." },
    { q: "How do moisture and ash affect coal quality?", a: "Moisture and ash are non-combustible components that reduce the effective heating value. A coal with 10% moisture and 10% ash can only burn 80% of its mass as fuel, significantly lowering its energy output per ton." },
    { q: "What coal rank has the highest heating value?", a: "Anthracite has the highest heating value at about 14,000 BTU/lb, followed by bituminous (12,000-13,000), sub-bituminous (8,000-10,000), and lignite (5,500-7,500 BTU/lb)." }
  ],
  `Effective BTU/lb = Base BTU x (1 - Moisture - Ash)
Total Energy (BTU) = Effective BTU x Tonnes x 2204.62 lbs/tonne
Energy (GJ) = Total BTU x 0.001055 / 1000
CO2 = Tonnage x Combustible Fraction x Carbon Content x 3.667`,
  ["gold-ore-grade-value-calculator", "mining-equipment-cost-per-ton-calculator", "geothermal-gradient-calculator"]
);

add(
  "aggregate-volume-calculator",
  "Aggregate Volume Calculator",
  "Calculate the volume and weight of aggregate material needed for construction projects based on area, depth, and material type.",
  "Everyday",
  "everyday",
  "~",
  ["aggregate volume", "gravel amount", "crushed stone calculator", "fill material", "construction aggregate"],
  [
    '{ name: "length", label: "Area Length (meters)", type: "number", min: 0.5, max: 1000, defaultValue: 10 }',
    '{ name: "width", label: "Area Width (meters)", type: "number", min: 0.5, max: 1000, defaultValue: 5 }',
    '{ name: "depth", label: "Depth/Thickness (cm)", type: "number", min: 1, max: 200, defaultValue: 15 }',
    '{ name: "materialType", label: "Material Type", type: "select", options: [{ value: "1500", label: "Pea Gravel (1,500 kg/m3)" }, { value: "1600", label: "Crushed Stone (1,600 kg/m3)" }, { value: "1700", label: "Compacted Gravel (1,700 kg/m3)" }, { value: "1400", label: "Sand (1,400 kg/m3)" }, { value: "2000", label: "Recycled Concrete (2,000 kg/m3)" }], defaultValue: "1600" }',
    '{ name: "compactionFactor", label: "Compaction Waste Factor (%)", type: "number", min: 0, max: 30, defaultValue: 10 }'
  ],
  `(inputs) => {
    const l = inputs.length as number;
    const w = inputs.width as number;
    const d = inputs.depth as number / 100;
    const density = parseFloat(inputs.materialType as unknown as string);
    const waste = inputs.compactionFactor as number / 100;
    const baseVolume = l * w * d;
    const totalVolume = baseVolume * (1 + waste);
    const weightKg = totalVolume * density;
    const weightTons = weightKg / 1000;
    const cubicYards = totalVolume * 1.30795;
    const area = l * w;
    const priceEstimate = weightTons * 25;
    return {
      primary: { label: "Total Volume Needed", value: formatNumber(parseFloat(totalVolume.toFixed(2))) + " m3" },
      details: [
        { label: "Weight", value: formatNumber(Math.round(weightKg)) + " kg (" + formatNumber(parseFloat(weightTons.toFixed(2))) + " tonnes)" },
        { label: "Cubic Yards", value: formatNumber(parseFloat(cubicYards.toFixed(2))) + " yd3" },
        { label: "Coverage Area", value: formatNumber(parseFloat(area.toFixed(2))) + " m2" },
        { label: "Base Volume (no waste)", value: formatNumber(parseFloat(baseVolume.toFixed(2))) + " m3" },
        { label: "Estimated Cost ($25/tonne)", value: "$" + formatNumber(Math.round(priceEstimate)) }
      ]
    };
  }`,
  [
    { q: "How much aggregate do I need per square meter?", a: "It depends on depth. For a 10cm layer, you need 0.1 cubic meters per square meter. At typical crushed stone density (1,600 kg/m3), that is about 160 kg per square meter." },
    { q: "Should I add extra for waste and compaction?", a: "Yes. Aggregate compacts during installation and some material is lost during spreading. Adding 10-15% extra is standard practice. Compacted gravel may need even more as it settles significantly." },
    { q: "What size aggregate should I use?", a: "For driveways, use 3/4 inch crushed stone. For drainage, use larger 1.5 to 2 inch stone. For base layers under pavement, use a graded mix of sizes for maximum compaction and stability." }
  ],
  `Volume = Length x Width x (Depth / 100)
Total Volume = Volume x (1 + Waste Factor)
Weight = Total Volume x Material Density
Cubic Yards = Volume(m3) x 1.30795`,
  ["gravel-calculator", "excavation-volume-calculator", "land-survey-area-calculator"]
);

add(
  "excavation-volume-calculator",
  "Excavation Volume Calculator",
  "Calculate excavation volume, soil removal weight, truck loads needed, and disposal costs for construction site earthwork.",
  "Everyday",
  "everyday",
  "~",
  ["excavation volume", "earthwork calculator", "dig volume", "soil removal", "cut and fill"],
  [
    '{ name: "length", label: "Excavation Length (meters)", type: "number", min: 1, max: 1000, defaultValue: 20 }',
    '{ name: "width", label: "Excavation Width (meters)", type: "number", min: 1, max: 500, defaultValue: 10 }',
    '{ name: "depth", label: "Excavation Depth (meters)", type: "number", min: 0.1, max: 50, defaultValue: 3 }',
    '{ name: "soilType", label: "Soil Type", type: "select", options: [{ value: "1400", label: "Loose Sand (1,400 kg/m3)" }, { value: "1700", label: "Clay (1,700 kg/m3)" }, { value: "1900", label: "Compacted Soil (1,900 kg/m3)" }, { value: "2500", label: "Rock (2,500 kg/m3)" }], defaultValue: "1700" }',
    '{ name: "swellFactor", label: "Swell Factor (%)", type: "number", min: 10, max: 60, defaultValue: 25 }',
    '{ name: "truckCapacity", label: "Truck Capacity (m3)", type: "number", min: 5, max: 25, defaultValue: 12 }'
  ],
  `(inputs) => {
    const l = inputs.length as number;
    const w = inputs.width as number;
    const d = inputs.depth as number;
    const density = parseFloat(inputs.soilType as unknown as string);
    const swell = inputs.swellFactor as number / 100;
    const truck = inputs.truckCapacity as number;
    const bankVolume = l * w * d;
    const looseVolume = bankVolume * (1 + swell);
    const weight = bankVolume * density;
    const weightTons = weight / 1000;
    const truckLoads = Math.ceil(looseVolume / truck);
    const disposalCost = weightTons * 15;
    const haulCost = truckLoads * 150;
    const totalCost = disposalCost + haulCost;
    return {
      primary: { label: "Bank Volume", value: formatNumber(parseFloat(bankVolume.toFixed(2))) + " m3" },
      details: [
        { label: "Loose Volume (after swell)", value: formatNumber(parseFloat(looseVolume.toFixed(2))) + " m3" },
        { label: "Total Weight", value: formatNumber(Math.round(weightTons)) + " tonnes" },
        { label: "Truck Loads Required", value: formatNumber(truckLoads) + " loads" },
        { label: "Disposal Cost ($15/tonne)", value: "$" + formatNumber(Math.round(disposalCost)) },
        { label: "Total Estimated Cost", value: "$" + formatNumber(Math.round(totalCost)) }
      ]
    };
  }`,
  [
    { q: "What is the swell factor in excavation?", a: "When soil is dug up, it increases in volume because it loosens and air pockets form. This increase is called swell. Clay typically swells 20-30%, sand 10-15%, and rock 40-60%. You must account for this when planning truck loads." },
    { q: "How many truck loads for 100 cubic meters?", a: "For a standard 12m3 dump truck with 25% swell factor: 100 x 1.25 / 12 = about 11 truck loads. Always round up since you cannot have a partial load." },
    { q: "What is bank volume vs loose volume?", a: "Bank volume is the soil in its original compacted state in the ground. Loose volume is the greater amount of space it occupies after excavation due to swell. Loose volume is always greater than bank volume." }
  ],
  `Bank Volume = Length x Width x Depth
Loose Volume = Bank Volume x (1 + Swell Factor)
Weight = Bank Volume x Soil Density
Truck Loads = Loose Volume / Truck Capacity (rounded up)`,
  ["aggregate-volume-calculator", "gravel-calculator", "land-survey-area-calculator"]
);

add(
  "gravel-calculator",
  "Gravel Calculator",
  "Calculate gravel quantity needed for driveways, paths, and landscaping projects with weight, volume, cost, and delivery truck estimates.",
  "Everyday",
  "everyday",
  "~",
  ["gravel calculator", "driveway gravel", "landscaping stone", "gravel weight", "gravel coverage"],
  [
    '{ name: "area", label: "Area to Cover (sq meters)", type: "number", min: 1, max: 10000, defaultValue: 50 }',
    '{ name: "thickness", label: "Gravel Thickness (cm)", type: "number", min: 1, max: 50, defaultValue: 8 }',
    '{ name: "gravelType", label: "Gravel Type", type: "select", options: [{ value: "1450", label: "Pea Gravel" }, { value: "1600", label: "Crushed Limestone" }, { value: "1550", label: "River Rock" }, { value: "1700", label: "Granite Chips" }, { value: "1350", label: "Lava Rock" }], defaultValue: "1600" }',
    '{ name: "pricePerTonne", label: "Price Per Tonne ($)", type: "number", min: 10, max: 200, defaultValue: 40 }',
    '{ name: "deliveryFee", label: "Delivery Fee ($)", type: "number", min: 0, max: 500, defaultValue: 75 }'
  ],
  `(inputs) => {
    const area = inputs.area as number;
    const t = inputs.thickness as number / 100;
    const density = parseFloat(inputs.gravelType as unknown as string);
    const price = inputs.pricePerTonne as number;
    const delivery = inputs.deliveryFee as number;
    const volume = area * t;
    const volumeExtra = volume * 1.1;
    const weightKg = volumeExtra * density;
    const weightTonnes = weightKg / 1000;
    const cubicYards = volumeExtra * 1.30795;
    const materialCost = weightTonnes * price;
    const totalCost = materialCost + delivery;
    const bags25kg = Math.ceil(weightKg / 25);
    return {
      primary: { label: "Gravel Needed", value: formatNumber(parseFloat(weightTonnes.toFixed(2))) + " tonnes" },
      details: [
        { label: "Volume (with 10% extra)", value: formatNumber(parseFloat(volumeExtra.toFixed(2))) + " m3" },
        { label: "Cubic Yards", value: formatNumber(parseFloat(cubicYards.toFixed(2))) + " yd3" },
        { label: "25kg Bags Equivalent", value: formatNumber(bags25kg) + " bags" },
        { label: "Material Cost", value: "$" + formatNumber(Math.round(materialCost)) },
        { label: "Total Cost (incl. delivery)", value: "$" + formatNumber(Math.round(totalCost)) }
      ]
    };
  }`,
  [
    { q: "How thick should driveway gravel be?", a: "A driveway typically needs 10 to 15 cm (4-6 inches) of gravel, usually applied in two layers: a coarser base layer and a finer top layer. Paths and patios need about 5-8 cm." },
    { q: "How much does a cubic meter of gravel weigh?", a: "Most gravel weighs 1,400 to 1,700 kg per cubic meter depending on type and moisture. Crushed limestone averages about 1,600 kg/m3, while lighter materials like lava rock weigh around 1,350 kg/m3." },
    { q: "Should I order extra gravel?", a: "Yes. Order 10-15% more than calculated to account for uneven ground, compaction settling, and spreading waste. It is better to have a small surplus than to run short mid-project." }
  ],
  `Volume = Area x Thickness
Volume with Extra = Volume x 1.10
Weight = Volume x Density
Material Cost = Weight(tonnes) x Price Per Tonne
Total = Material Cost + Delivery`,
  ["aggregate-volume-calculator", "excavation-volume-calculator", "land-survey-area-calculator"]
);
