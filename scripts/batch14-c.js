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
