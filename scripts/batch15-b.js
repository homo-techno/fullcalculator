add(
  "wire-gauge-ampacity-calculator",
  "Wire Gauge Ampacity Calculator",
  "Determine the maximum current carrying capacity of electrical wire based on AWG gauge size, insulation type, and ambient temperature for safe residential and commercial wiring.",
  "Everyday",
  "everyday",
  "~",
  ["wire gauge ampacity", "AWG current capacity", "wire size calculator", "electrical wire ampacity"],
  [
    '{ name: "awgGauge", label: "AWG Wire Gauge", type: "select", options: [{ value: "14", label: "14 AWG" }, { value: "12", label: "12 AWG" }, { value: "10", label: "10 AWG" }, { value: "8", label: "8 AWG" }, { value: "6", label: "6 AWG" }, { value: "4", label: "4 AWG" }, { value: "2", label: "2 AWG" }, { value: "1", label: "1 AWG" }], defaultValue: "12" }',
    '{ name: "insulationType", label: "Insulation Type", type: "select", options: [{ value: "1", label: "TW (60C)" }, { value: "2", label: "THW (75C)" }, { value: "3", label: "THHN (90C)" }], defaultValue: "2" }',
    '{ name: "ambientTemp", label: "Ambient Temperature (F)", type: "number", min: 50, max: 150, defaultValue: 86 }',
    '{ name: "conductorsInConduit", label: "Conductors in Conduit", type: "select", options: [{ value: "3", label: "1-3" }, { value: "6", label: "4-6" }, { value: "9", label: "7-9" }], defaultValue: "3" }'
  ],
  `(inputs) => {
    const gauge = parseInt(inputs.awgGauge as string);
    const insType = parseInt(inputs.insulationType as string);
    const ambTemp = inputs.ambientTemp as number;
    const condCount = parseInt(inputs.conductorsInConduit as string);
    const baseAmpacity = { 14: [15, 20, 25], 12: [20, 25, 30], 10: [30, 35, 40], 8: [40, 50, 55], 6: [55, 65, 75], 4: [70, 85, 95], 2: [95, 115, 130], 1: [110, 130, 150] };
    const amps = baseAmpacity[gauge] ? baseAmpacity[gauge][insType - 1] : 20;
    const tempDerate = ambTemp > 86 ? Math.max(0.5, 1 - (ambTemp - 86) * 0.01) : 1.0;
    const conduitDerate = condCount <= 3 ? 1.0 : condCount <= 6 ? 0.8 : 0.7;
    const adjustedAmps = amps * tempDerate * conduitDerate;
    const breakerSize = Math.floor(adjustedAmps / 5) * 5;
    return {
      primary: { label: "Adjusted Ampacity", value: formatNumber(Math.round(adjustedAmps * 10) / 10) + " A" },
      details: [
        { label: "Base Ampacity", value: formatNumber(amps) + " A" },
        { label: "Temperature Derating", value: formatNumber(Math.round(tempDerate * 100)) + "%" },
        { label: "Conduit Fill Derating", value: formatNumber(Math.round(conduitDerate * 100)) + "%" },
        { label: "Recommended Breaker", value: formatNumber(breakerSize) + " A" }
      ]
    };
  }`,
  [
    "Q: What wire gauge do I need for 20 amps?||A: For a 20-amp circuit you typically need 12 AWG copper wire with standard THW insulation. Always check local electrical codes as requirements may vary by jurisdiction.",
    "Q: How does temperature affect wire ampacity?||A: Higher ambient temperatures reduce wire ampacity because the insulation cannot dissipate heat as effectively. For every degree above 86F (30C) the ampacity must be derated.",
    "Q: Why does the number of wires in conduit matter?||A: More conductors in a conduit generate more heat and reduce the ability of each wire to dissipate that heat. NEC requires derating ampacity when more than 3 current-carrying conductors share a conduit."
  ],
  `Base Ampacity = NEC Table 310.16 lookup by gauge and insulation\nTemp Derating = 1 - (Ambient - 86) x 0.01 (if above 86F)\nConduit Derating = 1.0 (1-3), 0.8 (4-6), 0.7 (7-9)\nAdjusted Ampacity = Base x Temp Derating x Conduit Derating`,
  ["voltage-drop-calculator", "circuit-breaker-sizing-calculator"]
);

add(
  "conduit-fill-calculator",
  "Conduit Fill Calculator",
  "Calculate the maximum number of wires that can be safely pulled through electrical conduit based on conduit size, wire gauge, and NEC fill percentage rules.",
  "Everyday",
  "everyday",
  "~",
  ["conduit fill", "NEC conduit calculator", "wire conduit capacity", "electrical conduit sizing"],
  [
    '{ name: "conduitSize", label: "Conduit Size (inches)", type: "select", options: [{ value: "0.5", label: "1/2 inch" }, { value: "0.75", label: "3/4 inch" }, { value: "1", label: "1 inch" }, { value: "1.25", label: "1-1/4 inch" }, { value: "1.5", label: "1-1/2 inch" }, { value: "2", label: "2 inch" }], defaultValue: "0.75" }',
    '{ name: "conduitType", label: "Conduit Type", type: "select", options: [{ value: "1", label: "EMT" }, { value: "2", label: "IMC" }, { value: "3", label: "PVC Schedule 40" }], defaultValue: "1" }',
    '{ name: "wireGauge", label: "Wire Gauge (AWG)", type: "select", options: [{ value: "14", label: "14 AWG" }, { value: "12", label: "12 AWG" }, { value: "10", label: "10 AWG" }, { value: "8", label: "8 AWG" }, { value: "6", label: "6 AWG" }], defaultValue: "12" }',
    '{ name: "wireCount", label: "Number of Wires", type: "number", min: 1, max: 50, defaultValue: 4 }'
  ],
  `(inputs) => {
    const conduitSize = parseFloat(inputs.conduitSize as string);
    const conduitType = parseInt(inputs.conduitType as string);
    const wireGauge = parseInt(inputs.wireGauge as string);
    const wireCount = inputs.wireCount as number;
    const conduitArea = { 0.5: [0.122, 0.137, 0.131], 0.75: [0.213, 0.235, 0.228], 1: [0.346, 0.384, 0.37], 1.25: [0.598, 0.66, 0.65], 1.5: [0.814, 0.89, 0.88], 2: [1.342, 1.452, 1.44] };
    const wireArea = { 14: 0.0097, 12: 0.0133, 10: 0.0211, 8: 0.0366, 6: 0.0507 };
    const condArea = conduitArea[conduitSize] ? conduitArea[conduitSize][conduitType - 1] : 0.213;
    const singleWireArea = wireArea[wireGauge] || 0.0133;
    const fillLimit = wireCount <= 1 ? 0.53 : wireCount === 2 ? 0.31 : 0.40;
    const allowableArea = condArea * fillLimit;
    const totalWireArea = singleWireArea * wireCount;
    const fillPct = (totalWireArea / condArea) * 100;
    const maxWires = Math.floor(allowableArea / singleWireArea);
    const passes = totalWireArea <= allowableArea ? "Yes" : "No";
    return {
      primary: { label: "Fill Percentage", value: formatNumber(Math.round(fillPct * 10) / 10) + "%" },
      details: [
        { label: "Passes NEC Fill Rules", value: passes },
        { label: "Max Wires Allowed", value: formatNumber(maxWires) },
        { label: "Conduit Area", value: formatNumber(Math.round(condArea * 1000) / 1000) + " sq in" },
        { label: "Total Wire Area", value: formatNumber(Math.round(totalWireArea * 10000) / 10000) + " sq in" }
      ]
    };
  }`,
  [
    "Q: What is the NEC conduit fill rule?||A: The NEC allows 53 percent fill for one wire, 31 percent for two wires, and 40 percent for three or more wires. These limits prevent overheating and allow easy wire pulling.",
    "Q: What conduit size do I need for 4 wires of 12 AWG?||A: Four 12 AWG THHN wires require a minimum of 1/2 inch EMT conduit. The total wire area is about 0.053 sq in which is within the 40 percent fill limit of 0.049 sq in for 1/2 inch EMT.",
    "Q: What happens if I overfill conduit?||A: Overfilling conduit makes pulling wires difficult, can damage insulation, causes heat buildup, and violates electrical code. It can lead to premature wire failure or fire hazards."
  ],
  `Fill Limit = 53% (1 wire), 31% (2 wires), 40% (3+ wires)\nAllowable Area = Conduit Internal Area x Fill Limit\nTotal Wire Area = Single Wire Area x Number of Wires\nFill Percentage = (Total Wire Area / Conduit Area) x 100`,
  ["wire-gauge-ampacity-calculator", "voltage-drop-calculator"]
);

add(
  "voltage-drop-calculator",
  "Voltage Drop Calculator",
  "Calculate voltage drop in electrical circuits based on wire length, gauge, load current, and voltage to ensure installations meet NEC recommended limits.",
  "Science",
  "science",
  "A",
  ["voltage drop", "wire voltage loss", "electrical voltage drop", "NEC voltage drop calculator"],
  [
    '{ name: "voltage", label: "System Voltage (V)", type: "select", options: [{ value: "120", label: "120V" }, { value: "208", label: "208V" }, { value: "240", label: "240V" }, { value: "277", label: "277V" }, { value: "480", label: "480V" }], defaultValue: "120" }',
    '{ name: "current", label: "Load Current (Amps)", type: "number", min: 0.5, max: 500, defaultValue: 20 }',
    '{ name: "wireLength", label: "One-Way Wire Length (ft)", type: "number", min: 1, max: 2000, defaultValue: 100 }',
    '{ name: "wireGauge", label: "Wire Gauge (AWG)", type: "select", options: [{ value: "14", label: "14 AWG" }, { value: "12", label: "12 AWG" }, { value: "10", label: "10 AWG" }, { value: "8", label: "8 AWG" }, { value: "6", label: "6 AWG" }, { value: "4", label: "4 AWG" }, { value: "2", label: "2 AWG" }], defaultValue: "12" }'
  ],
  `(inputs) => {
    const voltage = parseFloat(inputs.voltage as string);
    const current = inputs.current as number;
    const length = inputs.wireLength as number;
    const gauge = parseInt(inputs.wireGauge as string);
    const resistance = { 14: 3.14, 12: 1.98, 10: 1.24, 8: 0.778, 6: 0.491, 4: 0.308, 2: 0.194 };
    const rPer1000 = resistance[gauge] || 1.98;
    const totalR = (rPer1000 * length * 2) / 1000;
    const vDrop = current * totalR;
    const vDropPct = (vDrop / voltage) * 100;
    const voltageAtLoad = voltage - vDrop;
    const powerLoss = current * current * totalR;
    const status = vDropPct <= 3 ? "Acceptable (under 3%)" : vDropPct <= 5 ? "Marginal (3-5%)" : "Excessive (over 5%)";
    return {
      primary: { label: "Voltage Drop", value: formatNumber(Math.round(vDrop * 100) / 100) + " V (" + formatNumber(Math.round(vDropPct * 100) / 100) + "%)" },
      details: [
        { label: "Voltage at Load", value: formatNumber(Math.round(voltageAtLoad * 100) / 100) + " V" },
        { label: "Total Wire Resistance", value: formatNumber(Math.round(totalR * 1000) / 1000) + " ohms" },
        { label: "Power Loss in Wire", value: formatNumber(Math.round(powerLoss * 10) / 10) + " W" },
        { label: "Status", value: status }
      ]
    };
  }`,
  [
    "Q: What is acceptable voltage drop per NEC?||A: The NEC recommends no more than 3 percent voltage drop for branch circuits and 5 percent total for feeder plus branch circuit combined. These are recommendations, not hard requirements in most cases.",
    "Q: How do I reduce voltage drop?||A: You can reduce voltage drop by using a larger wire gauge, shortening the wire run, reducing the load current, or increasing the system voltage. Larger gauge wire has lower resistance per foot.",
    "Q: Why does voltage drop matter?||A: Excessive voltage drop causes equipment to underperform, motors to overheat, lights to dim, and sensitive electronics to malfunction. It also wastes energy as heat in the wiring."
  ],
  `Total Resistance = (Resistance per 1000ft x Length x 2) / 1000\nVoltage Drop = Current x Total Resistance\nVoltage Drop % = (Voltage Drop / System Voltage) x 100\nPower Loss = Current^2 x Total Resistance`,
  ["wire-gauge-ampacity-calculator", "electrical-panel-load-calculator"]
);

add(
  "electrical-panel-load-calculator",
  "Electrical Panel Load Calculator",
  "Calculate total electrical panel load and determine if your service panel has sufficient capacity for existing circuits and planned additions.",
  "Everyday",
  "everyday",
  "~",
  ["electrical panel load", "service panel capacity", "breaker panel calculator", "home electrical load"],
  [
    '{ name: "panelAmps", label: "Panel Rating (Amps)", type: "select", options: [{ value: "100", label: "100A" }, { value: "150", label: "150A" }, { value: "200", label: "200A" }, { value: "400", label: "400A" }], defaultValue: "200" }',
    '{ name: "systemVoltage", label: "System Voltage", type: "select", options: [{ value: "240", label: "240V Split Phase" }, { value: "208", label: "208V Three Phase" }], defaultValue: "240" }',
    '{ name: "generalLoad", label: "General Lighting and Receptacles (W)", type: "number", min: 0, max: 50000, defaultValue: 10000 }',
    '{ name: "applianceLoad", label: "Fixed Appliance Load (W)", type: "number", min: 0, max: 50000, defaultValue: 8000 }',
    '{ name: "hvacLoad", label: "HVAC Load (W)", type: "number", min: 0, max: 30000, defaultValue: 5000 }'
  ],
  `(inputs) => {
    const panelAmps = parseFloat(inputs.panelAmps as string);
    const voltage = parseFloat(inputs.systemVoltage as string);
    const general = inputs.generalLoad as number;
    const appliance = inputs.applianceLoad as number;
    const hvac = inputs.hvacLoad as number;
    const panelCapacity = panelAmps * voltage;
    const first10k = Math.min(general, 10000);
    const over10k = Math.max(general - 10000, 0) * 0.4;
    const demandGeneral = first10k + over10k;
    const demandAppliance = appliance * 0.75;
    const totalDemand = demandGeneral + demandAppliance + hvac;
    const totalAmps = totalDemand / voltage;
    const utilization = (totalDemand / panelCapacity) * 100;
    const remaining = panelCapacity - totalDemand;
    return {
      primary: { label: "Total Demand Load", value: formatNumber(Math.round(totalDemand)) + " W" },
      details: [
        { label: "Demand Current", value: formatNumber(Math.round(totalAmps * 10) / 10) + " A" },
        { label: "Panel Capacity", value: formatNumber(Math.round(panelCapacity)) + " W" },
        { label: "Panel Utilization", value: formatNumber(Math.round(utilization)) + "%" },
        { label: "Remaining Capacity", value: formatNumber(Math.round(remaining)) + " W" }
      ]
    };
  }`,
  [
    "Q: How do I know if my panel is overloaded?||A: If your panel utilization exceeds 80 percent, you are near capacity and should consider upgrading. Signs include frequently tripping breakers, warm panel surfaces, or flickering lights.",
    "Q: What size panel do I need for a house?||A: Most modern homes need a 200-amp panel. Smaller homes may use 100-amp panels, while large homes with electric heating, EV chargers, and pools may need 400-amp service.",
    "Q: What is demand factor in load calculation?||A: Demand factor accounts for the fact that not all circuits operate at full load simultaneously. NEC allows 100 percent for the first 10,000W of general load and 40 percent for the remainder."
  ],
  `Demand General = First 10,000W at 100% + Remainder at 40%\nDemand Appliance = Appliance Load x 75%\nTotal Demand = Demand General + Demand Appliance + HVAC\nPanel Utilization = (Total Demand / Panel Capacity) x 100`,
  ["circuit-breaker-sizing-calculator", "voltage-drop-calculator"]
);

add(
  "circuit-breaker-sizing-calculator",
  "Circuit Breaker Sizing Calculator",
  "Determine the correct circuit breaker size for your electrical load based on continuous and non-continuous loads, wire gauge, and NEC 80 percent rule.",
  "Everyday",
  "everyday",
  "~",
  ["circuit breaker size", "breaker sizing calculator", "NEC breaker sizing", "electrical breaker calculator"],
  [
    '{ name: "continuousLoad", label: "Continuous Load (Amps)", type: "number", min: 0, max: 200, defaultValue: 12 }',
    '{ name: "nonContinuousLoad", label: "Non-Continuous Load (Amps)", type: "number", min: 0, max: 200, defaultValue: 5 }',
    '{ name: "systemVoltage", label: "System Voltage", type: "select", options: [{ value: "120", label: "120V Single Phase" }, { value: "240", label: "240V Single Phase" }, { value: "208", label: "208V Three Phase" }], defaultValue: "120" }',
    '{ name: "wireGauge", label: "Wire Gauge (AWG)", type: "select", options: [{ value: "14", label: "14 AWG (15A max)" }, { value: "12", label: "12 AWG (20A max)" }, { value: "10", label: "10 AWG (30A max)" }, { value: "8", label: "8 AWG (40A max)" }, { value: "6", label: "6 AWG (55A max)" }], defaultValue: "12" }'
  ],
  `(inputs) => {
    const contLoad = inputs.continuousLoad as number;
    const nonContLoad = inputs.nonContinuousLoad as number;
    const voltage = parseFloat(inputs.systemVoltage as string);
    const gauge = parseInt(inputs.wireGauge as string);
    const wireMaxAmps = { 14: 15, 12: 20, 10: 30, 8: 40, 6: 55 };
    const maxWireAmps = wireMaxAmps[gauge] || 20;
    const totalAdjusted = contLoad * 1.25 + nonContLoad;
    const totalActual = contLoad + nonContLoad;
    const standardSizes = [15, 20, 25, 30, 35, 40, 45, 50, 60, 70, 80, 90, 100];
    let breakerSize = 15;
    for (let i = 0; i < standardSizes.length; i++) {
      if (standardSizes[i] >= totalAdjusted) { breakerSize = standardSizes[i]; break; }
    }
    const safeLoad = breakerSize * 0.8;
    const loadPct = (totalActual / breakerSize) * 100;
    const wireOk = breakerSize <= maxWireAmps ? "Wire is adequate" : "Wire gauge too small";
    return {
      primary: { label: "Recommended Breaker", value: formatNumber(breakerSize) + " A" },
      details: [
        { label: "Adjusted Load (125% continuous)", value: formatNumber(Math.round(totalAdjusted * 10) / 10) + " A" },
        { label: "Actual Total Load", value: formatNumber(Math.round(totalActual * 10) / 10) + " A" },
        { label: "Safe Continuous Load (80%)", value: formatNumber(safeLoad) + " A" },
        { label: "Wire Check", value: wireOk }
      ]
    };
  }`,
  [
    "Q: Why is the 80 percent rule used for breaker sizing?||A: NEC requires that continuous loads (running 3+ hours) not exceed 80 percent of the breaker rating. This provides a safety margin to prevent overheating and nuisance tripping.",
    "Q: Can I use a larger breaker to stop tripping?||A: Never upsize a breaker without also upsizing the wire. The breaker protects the wire from overheating. Using a larger breaker with undersized wire creates a fire hazard.",
    "Q: What is the difference between continuous and non-continuous loads?||A: A continuous load runs for 3 or more hours, such as lighting or electric heating. Non-continuous loads run intermittently, like a garbage disposal or power tools."
  ],
  `Adjusted Load = (Continuous Load x 1.25) + Non-Continuous Load\nBreaker Size = Next standard size >= Adjusted Load\nSafe Continuous Load = Breaker Size x 0.80\nLoad Percentage = (Actual Load / Breaker Size) x 100`,
  ["wire-gauge-ampacity-calculator", "electrical-panel-load-calculator"]
);

add(
  "pipe-flow-rate-calculator",
  "Pipe Flow Rate Calculator",
  "Calculate water flow rate through pipes based on pipe diameter, length, pressure, and material using the Hazen-Williams equation for plumbing design.",
  "Science",
  "science",
  "A",
  ["pipe flow rate", "water flow calculator", "plumbing flow rate", "Hazen-Williams calculator"],
  [
    '{ name: "pipeDiameter", label: "Pipe Inner Diameter (inches)", type: "select", options: [{ value: "0.5", label: "1/2 inch" }, { value: "0.75", label: "3/4 inch" }, { value: "1", label: "1 inch" }, { value: "1.25", label: "1-1/4 inch" }, { value: "1.5", label: "1-1/2 inch" }, { value: "2", label: "2 inch" }], defaultValue: "0.75" }',
    '{ name: "pipeLength", label: "Pipe Length (ft)", type: "number", min: 1, max: 5000, defaultValue: 100 }',
    '{ name: "pressureDrop", label: "Available Pressure (psi)", type: "number", min: 1, max: 150, defaultValue: 40 }',
    '{ name: "pipeMaterial", label: "Pipe Material", type: "select", options: [{ value: "150", label: "Copper (C=150)" }, { value: "140", label: "PVC/CPVC (C=140)" }, { value: "130", label: "Steel (C=130)" }, { value: "100", label: "Galvanized Iron (C=100)" }], defaultValue: "150" }'
  ],
  `(inputs) => {
    const diameter = parseFloat(inputs.pipeDiameter as string);
    const length = inputs.pipeLength as number;
    const pressure = inputs.pressureDrop as number;
    const cFactor = parseFloat(inputs.pipeMaterial as string);
    const dFt = diameter / 12;
    const headLoss = pressure * 2.31;
    const slope = headLoss / length;
    const velocity = 1.318 * cFactor * Math.pow(dFt / 4, 0.63) * Math.pow(slope, 0.54);
    const areaSqFt = Math.PI * Math.pow(dFt / 2, 2);
    const flowCFS = velocity * areaSqFt;
    const flowGPM = flowCFS * 448.831;
    const velocityFPS = velocity;
    const status = velocityFPS > 8 ? "High velocity - may cause noise" : velocityFPS > 5 ? "Acceptable" : "Good";
    return {
      primary: { label: "Flow Rate", value: formatNumber(Math.round(flowGPM * 100) / 100) + " GPM" },
      details: [
        { label: "Water Velocity", value: formatNumber(Math.round(velocityFPS * 100) / 100) + " ft/s" },
        { label: "Head Loss", value: formatNumber(Math.round(headLoss * 10) / 10) + " ft" },
        { label: "Pipe Cross Section", value: formatNumber(Math.round(areaSqFt * 10000) / 10000) + " sq ft" },
        { label: "Velocity Status", value: status }
      ]
    };
  }`,
  [
    "Q: What is a good water velocity in pipes?||A: Residential plumbing should have water velocity between 2 and 5 feet per second. Above 5 fps may cause noise and above 8 fps can cause pipe erosion and water hammer.",
    "Q: What is the Hazen-Williams C factor?||A: The C factor represents pipe roughness. Higher values mean smoother pipes with less friction. New copper is 150, PVC is 140, steel is 130, and old galvanized iron can be as low as 80.",
    "Q: How does pipe diameter affect flow rate?||A: Flow rate increases dramatically with diameter. Doubling the pipe diameter can increase flow by about 5 to 6 times because flow depends on diameter raised to the 2.63 power."
  ],
  `Head Loss = Pressure (psi) x 2.31\nSlope = Head Loss / Pipe Length\nVelocity = 1.318 x C x (D/4)^0.63 x Slope^0.54\nFlow Rate (GPM) = Velocity x Pipe Area x 448.831`,
  ["pipe-sizing-calculator", "drain-slope-calculator"]
);

add(
  "water-heater-sizing-calculator",
  "Water Heater Sizing Calculator",
  "Determine the right water heater size for your household based on number of occupants, usage patterns, and fixture count to ensure adequate hot water supply.",
  "Everyday",
  "everyday",
  "~",
  ["water heater size", "hot water heater calculator", "water heater capacity", "tankless water heater sizing"],
  [
    '{ name: "occupants", label: "Number of Occupants", type: "number", min: 1, max: 12, defaultValue: 4 }',
    '{ name: "bathrooms", label: "Number of Bathrooms", type: "number", min: 1, max: 6, defaultValue: 2 }',
    '{ name: "heaterType", label: "Heater Type", type: "select", options: [{ value: "1", label: "Tank (Storage)" }, { value: "2", label: "Tankless" }, { value: "3", label: "Heat Pump" }], defaultValue: "1" }',
    '{ name: "usageLevel", label: "Usage Level", type: "select", options: [{ value: "1", label: "Low (quick showers)" }, { value: "2", label: "Medium (average)" }, { value: "3", label: "High (long showers, baths)" }], defaultValue: "2" }'
  ],
  `(inputs) => {
    const occupants = inputs.occupants as number;
    const bathrooms = inputs.bathrooms as number;
    const heaterType = parseInt(inputs.heaterType as string);
    const usage = parseInt(inputs.usageLevel as string);
    const gallonsPerPerson = { 1: 15, 2: 20, 3: 30 };
    const dailyGallons = occupants * (gallonsPerPerson[usage] || 20);
    const peakGPM = bathrooms * 2.0 + 1.0;
    const fhr = dailyGallons * 0.7;
    let tankSize = 0;
    if (heaterType === 1) {
      if (fhr <= 40) tankSize = 40;
      else if (fhr <= 55) tankSize = 50;
      else if (fhr <= 70) tankSize = 65;
      else tankSize = 80;
    }
    const tanklessGPM = Math.ceil(peakGPM * 10) / 10;
    const btuNeeded = heaterType === 2 ? Math.round(tanklessGPM * 500 * 60) : Math.round(dailyGallons * 8.33 * 60 * 0.8);
    const annualCostEstimate = heaterType === 3 ? Math.round(dailyGallons * 365 * 0.005) : heaterType === 2 ? Math.round(dailyGallons * 365 * 0.008) : Math.round(dailyGallons * 365 * 0.012);
    return {
      primary: { label: heaterType === 2 ? "Required Flow Rate" : "Recommended Tank Size", value: heaterType === 2 ? formatNumber(tanklessGPM) + " GPM" : formatNumber(tankSize) + " gallons" },
      details: [
        { label: "Daily Hot Water Usage", value: formatNumber(dailyGallons) + " gallons" },
        { label: "First Hour Rating", value: formatNumber(Math.round(fhr)) + " gallons" },
        { label: "Peak Demand", value: formatNumber(Math.round(peakGPM * 10) / 10) + " GPM" },
        { label: "Est. Annual Operating Cost", value: "$" + formatNumber(annualCostEstimate) }
      ]
    };
  }`,
  [
    "Q: What size water heater do I need for a family of 4?||A: A family of 4 with average usage typically needs a 50-gallon tank water heater or a tankless unit rated for at least 5 GPM to handle simultaneous fixtures.",
    "Q: Are tankless water heaters worth it?||A: Tankless heaters cost more upfront but save 20-30 percent on energy by heating water on demand. They last 20+ years versus 10-15 for tanks and provide unlimited hot water.",
    "Q: What is first hour rating?||A: First hour rating (FHR) measures how many gallons of hot water a tank heater can deliver in its first hour of use. It accounts for both stored hot water and heating recovery rate."
  ],
  `Daily Usage = Occupants x Gallons Per Person\nFirst Hour Rating = Daily Usage x 0.7\nPeak GPM = Bathrooms x 2.0 + 1.0\nTank Size = Based on FHR (40-80 gallons)`,
  ["pipe-flow-rate-calculator", "btu-heating-calculator"]
);

add(
  "drain-slope-calculator",
  "Drain Slope Calculator",
  "Calculate the correct drainage pipe slope and fall over a given distance to meet plumbing code requirements for proper wastewater flow.",
  "Everyday",
  "everyday",
  "~",
  ["drain slope", "drainage pipe grade", "plumbing slope calculator", "sewer pipe fall calculator"],
  [
    '{ name: "pipeSize", label: "Drain Pipe Size (inches)", type: "select", options: [{ value: "1.5", label: "1-1/2 inch" }, { value: "2", label: "2 inch" }, { value: "3", label: "3 inch" }, { value: "4", label: "4 inch" }, { value: "6", label: "6 inch" }], defaultValue: "3" }',
    '{ name: "runLength", label: "Horizontal Run (ft)", type: "number", min: 1, max: 500, defaultValue: 20 }',
    '{ name: "slopeType", label: "Slope Standard", type: "select", options: [{ value: "0.25", label: "1/4 inch per foot (standard)" }, { value: "0.125", label: "1/8 inch per foot (3 inch+ pipe)" }, { value: "0.5", label: "1/2 inch per foot (steep)" }], defaultValue: "0.25" }'
  ],
  `(inputs) => {
    const pipeSize = parseFloat(inputs.pipeSize as string);
    const runLength = inputs.runLength as number;
    const slopePerFt = parseFloat(inputs.slopeType as string);
    const totalFall = slopePerFt * runLength;
    const slopePct = (slopePerFt / 12) * 100;
    const minSlope = pipeSize >= 3 ? 0.125 : 0.25;
    const meetsCode = slopePerFt >= minSlope ? "Yes" : "No - increase slope";
    const slopeRatio = Math.round(12 / slopePerFt);
    const velocityEst = Math.sqrt(slopePerFt / 12) * 4.5;
    return {
      primary: { label: "Total Fall", value: formatNumber(Math.round(totalFall * 100) / 100) + " inches" },
      details: [
        { label: "Slope", value: formatNumber(slopePerFt) + " in/ft (" + formatNumber(Math.round(slopePct * 100) / 100) + "%)" },
        { label: "Slope Ratio", value: "1:" + formatNumber(slopeRatio) },
        { label: "Estimated Flow Velocity", value: formatNumber(Math.round(velocityEst * 100) / 100) + " ft/s" },
        { label: "Meets Code Minimum", value: meetsCode }
      ]
    };
  }`,
  [
    "Q: What is the correct slope for a drain pipe?||A: Standard plumbing code requires 1/4 inch per foot slope for pipes 3 inches and smaller, and 1/8 inch per foot for pipes larger than 3 inches.",
    "Q: Can a drain pipe have too much slope?||A: Yes, excessive slope causes liquids to flow too fast while solids lag behind, leading to clogs. The maximum recommended slope is typically 1/2 inch per foot.",
    "Q: How do I measure drain pipe slope?||A: Use a level and tape measure. Place the level on the pipe, raise one end until level, and measure the gap. Divide the gap by the distance between supports to get the slope per foot."
  ],
  `Total Fall = Slope Per Foot x Run Length\nSlope Percentage = (Slope Per Foot / 12) x 100\nMinimum Slope = 1/4 in/ft (pipes <= 3 in) or 1/8 in/ft (pipes > 3 in)`,
  ["pipe-sizing-calculator", "pipe-flow-rate-calculator"]
);

add(
  "pipe-sizing-calculator",
  "Pipe Sizing Calculator",
  "Determine the correct plumbing pipe diameter for water supply lines based on fixture units, flow demand, and available pressure for residential and commercial buildings.",
  "Everyday",
  "everyday",
  "~",
  ["pipe sizing", "water pipe size calculator", "plumbing pipe diameter", "supply pipe sizing"],
  [
    '{ name: "fixtureUnits", label: "Total Fixture Units", type: "number", min: 1, max: 500, defaultValue: 20 }',
    '{ name: "pipeMaterial", label: "Pipe Material", type: "select", options: [{ value: "1", label: "Copper Type L" }, { value: "2", label: "CPVC" }, { value: "3", label: "PEX" }], defaultValue: "1" }',
    '{ name: "supplyPressure", label: "Supply Pressure (psi)", type: "number", min: 20, max: 100, defaultValue: 50 }',
    '{ name: "longestRun", label: "Longest Run (ft)", type: "number", min: 10, max: 500, defaultValue: 75 }'
  ],
  `(inputs) => {
    const fixtureUnits = inputs.fixtureUnits as number;
    const material = parseInt(inputs.pipeMaterial as string);
    const pressure = inputs.supplyPressure as number;
    const longestRun = inputs.longestRun as number;
    const gpm = fixtureUnits <= 10 ? fixtureUnits * 1.0 : 10 + (fixtureUnits - 10) * 0.6;
    const pressureLossPerFoot = (pressure * 0.8) / longestRun;
    let mainSize = 0.75;
    if (gpm > 25) mainSize = 1.5;
    else if (gpm > 15) mainSize = 1.25;
    else if (gpm > 8) mainSize = 1.0;
    else mainSize = 0.75;
    const materialFactor = { 1: 1.0, 2: 1.05, 3: 1.0 };
    const adjustedSize = mainSize * (materialFactor[material] || 1.0);
    const branchSize = mainSize >= 1.0 ? 0.75 : 0.5;
    const velocity = gpm / (Math.PI * Math.pow(mainSize / 2, 2)) * 0.408;
    return {
      primary: { label: "Recommended Main Size", value: formatNumber(adjustedSize) + " inch" },
      details: [
        { label: "Estimated Flow Demand", value: formatNumber(Math.round(gpm * 10) / 10) + " GPM" },
        { label: "Branch Line Size", value: formatNumber(branchSize) + " inch" },
        { label: "Available Pressure Loss", value: formatNumber(Math.round(pressureLossPerFoot * 100) / 100) + " psi/ft" },
        { label: "Estimated Velocity", value: formatNumber(Math.round(velocity * 10) / 10) + " ft/s" }
      ]
    };
  }`,
  [
    "Q: What size water supply pipe do I need?||A: Most homes use a 3/4-inch main supply line for up to 8 GPM flow. Larger homes with many fixtures may need 1-inch or 1-1/4-inch main lines. Branch lines are typically 1/2 or 3/4 inch.",
    "Q: What are fixture units in plumbing?||A: Fixture units are a standardized measure of water demand. A lavatory is 1 unit, a toilet is 2.5 units, a bathtub is 2 units, and a kitchen sink is 1.5 units.",
    "Q: Does pipe material affect sizing?||A: Yes, different materials have different friction characteristics. Copper is very smooth, PEX has slightly more friction at fittings due to smaller insert fittings, and CPVC has similar performance to copper."
  ],
  `GPM Demand = First 10 FU x 1.0 + Remaining FU x 0.6\nPressure Loss Budget = (Supply Pressure x 0.8) / Longest Run\nMain Size = Based on GPM demand lookup\nBranch Size = 0.5 or 0.75 inch based on main size`,
  ["pipe-flow-rate-calculator", "water-heater-sizing-calculator"]
);

add(
  "btu-heating-calculator",
  "BTU Heating Calculator",
  "Calculate the BTU heating capacity needed for a room or building based on square footage, insulation quality, climate zone, and ceiling height.",
  "Everyday",
  "everyday",
  "~",
  ["BTU calculator", "heating BTU calculator", "furnace sizing", "heating capacity calculator"],
  [
    '{ name: "squareFootage", label: "Area (sq ft)", type: "number", min: 50, max: 20000, defaultValue: 1500 }',
    '{ name: "ceilingHeight", label: "Ceiling Height (ft)", type: "number", min: 7, max: 20, defaultValue: 8 }',
    '{ name: "insulation", label: "Insulation Quality", type: "select", options: [{ value: "1", label: "Poor (old, no insulation)" }, { value: "2", label: "Average (some insulation)" }, { value: "3", label: "Good (well insulated)" }, { value: "4", label: "Excellent (new construction)" }], defaultValue: "2" }',
    '{ name: "climateZone", label: "Climate Zone", type: "select", options: [{ value: "1", label: "Zone 1-2 (Hot/Warm)" }, { value: "2", label: "Zone 3-4 (Mixed)" }, { value: "3", label: "Zone 5-6 (Cold)" }, { value: "4", label: "Zone 7 (Very Cold)" }], defaultValue: "2" }'
  ],
  `(inputs) => {
    const sqft = inputs.squareFootage as number;
    const ceiling = inputs.ceilingHeight as number;
    const insulation = parseInt(inputs.insulation as string);
    const climate = parseInt(inputs.climateZone as string);
    const baseBtuPerSqFt = { 1: 25, 2: 35, 3: 45, 4: 60 };
    const insulationFactor = { 1: 1.4, 2: 1.0, 3: 0.8, 4: 0.65 };
    const ceilingFactor = ceiling / 8;
    const baseBtu = sqft * (baseBtuPerSqFt[climate] || 35);
    const adjustedBtu = baseBtu * (insulationFactor[insulation] || 1.0) * ceilingFactor;
    const furnaceSize = Math.ceil(adjustedBtu / 10000) * 10000;
    const tonnage = Math.round(adjustedBtu / 12000 * 10) / 10;
    return {
      primary: { label: "Required BTU", value: formatNumber(Math.round(adjustedBtu)) + " BTU/hr" },
      details: [
        { label: "Base BTU Requirement", value: formatNumber(Math.round(baseBtu)) + " BTU/hr" },
        { label: "Recommended Furnace", value: formatNumber(furnaceSize) + " BTU/hr" },
        { label: "Equivalent Tonnage", value: formatNumber(tonnage) + " tons" },
        { label: "Ceiling Height Factor", value: formatNumber(Math.round(ceilingFactor * 100) / 100) + "x" }
      ]
    };
  }`,
  [
    "Q: How many BTU per square foot do I need?||A: In a moderate climate with average insulation, plan for about 30-35 BTU per square foot. Cold climates may need 45-60 BTU per square foot while warm climates need only 20-25.",
    "Q: How do I convert BTU to tons?||A: One ton of heating or cooling equals 12,000 BTU per hour. Divide your BTU requirement by 12,000 to get the tonnage needed.",
    "Q: Should I oversize my furnace?||A: Mild oversizing (10-20 percent) is acceptable, but significant oversizing causes short cycling, poor humidity control, and wasted energy. Proper sizing is more efficient and comfortable."
  ],
  `Base BTU = Square Footage x BTU Per Sq Ft (by climate zone)\nAdjusted BTU = Base BTU x Insulation Factor x (Ceiling Height / 8)\nFurnace Size = Rounded up to nearest 10,000 BTU\nTonnage = Adjusted BTU / 12,000`,
  ["duct-sizing-calculator", "heat-pump-cop-calculator"]
);

add(
  "duct-sizing-calculator",
  "Duct Sizing Calculator",
  "Calculate the correct HVAC duct dimensions based on airflow requirements, friction rate, and duct shape for efficient air distribution in heating and cooling systems.",
  "Everyday",
  "everyday",
  "~",
  ["duct sizing", "HVAC duct calculator", "air duct size", "ductwork sizing calculator"],
  [
    '{ name: "cfm", label: "Required Airflow (CFM)", type: "number", min: 50, max: 5000, defaultValue: 400 }',
    '{ name: "frictionRate", label: "Friction Rate (in. w.g. per 100 ft)", type: "select", options: [{ value: "0.06", label: "0.06 (quiet, residential)" }, { value: "0.08", label: "0.08 (standard residential)" }, { value: "0.10", label: "0.10 (commercial)" }], defaultValue: "0.08" }',
    '{ name: "ductShape", label: "Duct Shape", type: "select", options: [{ value: "1", label: "Round" }, { value: "2", label: "Rectangular" }], defaultValue: "1" }',
    '{ name: "maxVelocity", label: "Max Air Velocity (fpm)", type: "number", min: 300, max: 2000, defaultValue: 700 }'
  ],
  `(inputs) => {
    const cfm = inputs.cfm as number;
    const friction = parseFloat(inputs.frictionRate as string);
    const shape = parseInt(inputs.ductShape as string);
    const maxVel = inputs.maxVelocity as number;
    const areaSqIn = (cfm / maxVel) * 144;
    const roundDia = Math.sqrt(areaSqIn / Math.PI) * 2;
    const roundDiaStd = Math.ceil(roundDia);
    const actualArea = Math.PI * Math.pow(roundDiaStd / 2, 2);
    const actualVel = (cfm * 144) / actualArea;
    let rectW = 0;
    let rectH = 0;
    if (shape === 2) {
      rectW = Math.ceil(roundDiaStd * 1.2 / 2) * 2;
      rectH = Math.ceil(areaSqIn / rectW / 2) * 2;
      if (rectH < 4) rectH = 4;
    }
    const equivRound = shape === 2 ? Math.round(1.3 * Math.pow(rectW * rectH, 0.625) / Math.pow(rectW + rectH, 0.25)) : roundDiaStd;
    return {
      primary: { label: shape === 1 ? "Round Duct Diameter" : "Rectangular Duct Size", value: shape === 1 ? formatNumber(roundDiaStd) + " inches" : formatNumber(rectW) + " x " + formatNumber(rectH) + " inches" },
      details: [
        { label: "Required Cross-Section", value: formatNumber(Math.round(areaSqIn * 10) / 10) + " sq in" },
        { label: "Air Velocity", value: formatNumber(Math.round(actualVel)) + " fpm" },
        { label: "Equivalent Round Diameter", value: formatNumber(equivRound) + " inches" },
        { label: "Friction Rate", value: formatNumber(friction) + " in. w.g./100ft" }
      ]
    };
  }`,
  [
    "Q: What size duct do I need for 400 CFM?||A: For 400 CFM at standard residential friction rate, you need approximately a 10-inch round duct or an equivalent rectangular duct such as 12 x 8 inches.",
    "Q: What is friction rate in duct sizing?||A: Friction rate is the pressure drop per 100 feet of duct measured in inches of water gauge. Lower friction rates mean larger ducts but quieter operation and better efficiency.",
    "Q: Are round or rectangular ducts better?||A: Round ducts are more efficient because they have less surface area per unit of airflow, which reduces friction and heat loss. Rectangular ducts are used when height clearance is limited."
  ],
  `Cross-Section Area = (CFM / Max Velocity) x 144\nRound Diameter = sqrt(Area / Pi) x 2\nRectangular Equivalent = Based on equal friction method\nActual Velocity = (CFM x 144) / Actual Area`,
  ["btu-heating-calculator", "exhaust-fan-cfm-calculator"]
);

add(
  "refrigerant-charge-calculator",
  "Refrigerant Charge Calculator",
  "Estimate the refrigerant charge needed for HVAC systems based on line set length, system capacity, and refrigerant type for proper air conditioning performance.",
  "Science",
  "science",
  "A",
  ["refrigerant charge", "AC refrigerant calculator", "R-410A charge", "HVAC refrigerant amount"],
  [
    '{ name: "systemTons", label: "System Capacity (tons)", type: "select", options: [{ value: "1.5", label: "1.5 tons" }, { value: "2", label: "2 tons" }, { value: "2.5", label: "2.5 tons" }, { value: "3", label: "3 tons" }, { value: "3.5", label: "3.5 tons" }, { value: "4", label: "4 tons" }, { value: "5", label: "5 tons" }], defaultValue: "3" }',
    '{ name: "lineSetLength", label: "Line Set Length (ft)", type: "number", min: 10, max: 200, defaultValue: 25 }',
    '{ name: "factoryCharge", label: "Factory Line Set Length (ft)", type: "number", min: 10, max: 50, defaultValue: 15 }',
    '{ name: "refrigerantType", label: "Refrigerant Type", type: "select", options: [{ value: "1", label: "R-410A" }, { value: "2", label: "R-32" }, { value: "3", label: "R-22 (legacy)" }], defaultValue: "1" }'
  ],
  `(inputs) => {
    const tons = parseFloat(inputs.systemTons as string);
    const lineLength = inputs.lineSetLength as number;
    const factoryLength = inputs.factoryCharge as number;
    const refType = parseInt(inputs.refrigerantType as string);
    const ozPerFt = { 1: 0.6, 2: 0.5, 3: 0.65 };
    const baseCharge = { 1: tons * 48, 2: tons * 40, 3: tons * 52 };
    const addlLength = Math.max(lineLength - factoryLength, 0);
    const addlCharge = addlLength * (ozPerFt[refType] || 0.6);
    const totalCharge = (baseCharge[refType] || tons * 48) + addlCharge;
    const totalLbs = totalCharge / 16;
    const refName = { 1: "R-410A", 2: "R-32", 3: "R-22" };
    return {
      primary: { label: "Total Charge", value: formatNumber(Math.round(totalCharge * 10) / 10) + " oz" },
      details: [
        { label: "Total in Pounds", value: formatNumber(Math.round(totalLbs * 100) / 100) + " lbs" },
        { label: "Factory Charge", value: formatNumber(Math.round((baseCharge[refType] || 0) * 10) / 10) + " oz" },
        { label: "Additional Charge", value: formatNumber(Math.round(addlCharge * 10) / 10) + " oz" },
        { label: "Refrigerant", value: refName[refType] || "R-410A" }
      ]
    };
  }`,
  [
    "Q: How much refrigerant does a 3-ton AC need?||A: A 3-ton system typically needs about 6 to 12 pounds of R-410A refrigerant, including the factory charge. Additional refrigerant is added based on the line set length beyond the factory default.",
    "Q: How is additional refrigerant charge calculated?||A: Most manufacturers specify adding about 0.6 ounces of R-410A per foot of line set beyond the factory-charged length, which is typically 15 to 25 feet.",
    "Q: What happens if the system is overcharged?||A: Overcharging causes high head pressure, reduced efficiency, compressor damage, and potential liquid slugging. Proper charge is critical for system performance and longevity."
  ],
  `Factory Charge = System Tons x Base Charge Per Ton\nAdditional Length = Line Set Length - Factory Length\nAdditional Charge = Additional Length x Oz Per Foot\nTotal Charge = Factory Charge + Additional Charge`,
  ["heat-pump-cop-calculator", "mini-split-sizing-calculator"]
);

add(
  "heat-pump-cop-calculator",
  "Heat Pump COP Calculator",
  "Calculate the coefficient of performance for heat pumps by comparing heating output to energy input across different operating temperatures and system types.",
  "Science",
  "science",
  "A",
  ["heat pump COP", "coefficient of performance", "heat pump efficiency", "COP calculator HVAC"],
  [
    '{ name: "heatingOutput", label: "Heating Output (BTU/hr)", type: "number", min: 5000, max: 200000, defaultValue: 36000 }',
    '{ name: "powerInput", label: "Electrical Input (Watts)", type: "number", min: 500, max: 30000, defaultValue: 3000 }',
    '{ name: "outdoorTemp", label: "Outdoor Temperature (F)", type: "number", min: -20, max: 70, defaultValue: 35 }',
    '{ name: "systemType", label: "System Type", type: "select", options: [{ value: "1", label: "Air Source" }, { value: "2", label: "Ground Source (Geothermal)" }, { value: "3", label: "Mini Split" }], defaultValue: "1" }'
  ],
  `(inputs) => {
    const heatingBtu = inputs.heatingOutput as number;
    const watts = inputs.powerInput as number;
    const outdoorF = inputs.outdoorTemp as number;
    const sysType = parseInt(inputs.systemType as string);
    const heatingWatts = heatingBtu / 3.412;
    const cop = heatingWatts / watts;
    const hspf = cop * 3.412;
    const electricHeatCost = 1.0;
    const heatPumpCost = electricHeatCost / cop;
    const savings = ((1 - heatPumpCost / electricHeatCost) * 100);
    const tempPenalty = outdoorF < 32 ? (32 - outdoorF) * 0.02 : 0;
    const adjustedCOP = Math.max(cop - tempPenalty, 1.0);
    const rating = adjustedCOP >= 4 ? "Excellent" : adjustedCOP >= 3 ? "Good" : adjustedCOP >= 2 ? "Average" : "Poor";
    return {
      primary: { label: "COP", value: formatNumber(Math.round(cop * 100) / 100) },
      details: [
        { label: "HSPF Equivalent", value: formatNumber(Math.round(hspf * 100) / 100) },
        { label: "Adjusted COP (for temp)", value: formatNumber(Math.round(adjustedCOP * 100) / 100) },
        { label: "Savings vs Electric Heat", value: formatNumber(Math.round(savings)) + "%" },
        { label: "Efficiency Rating", value: rating }
      ]
    };
  }`,
  [
    "Q: What is a good COP for a heat pump?||A: A COP of 3.0 or higher is considered good, meaning the system produces 3 units of heat for every 1 unit of electricity consumed. Ground source heat pumps can achieve COP of 4 to 5.",
    "Q: How does outdoor temperature affect COP?||A: Heat pump COP decreases as outdoor temperature drops because it becomes harder to extract heat from colder air. Below 25-30F, some air-source heat pumps need supplemental heating.",
    "Q: What is the difference between COP and HSPF?||A: COP is an instantaneous efficiency ratio while HSPF (Heating Seasonal Performance Factor) measures efficiency over an entire heating season. HSPF equals COP multiplied by 3.412."
  ],
  `COP = Heating Output (Watts) / Electrical Input (Watts)\nHeating Watts = BTU/hr / 3.412\nHSPF = COP x 3.412\nAdjusted COP = COP - Temperature Penalty`,
  ["btu-heating-calculator", "boiler-efficiency-calculator"]
);

add(
  "boiler-efficiency-calculator",
  "Boiler Efficiency Calculator",
  "Calculate boiler operating efficiency by comparing fuel input energy to useful heat output, accounting for stack losses, radiation losses, and combustion efficiency.",
  "Science",
  "science",
  "A",
  ["boiler efficiency", "combustion efficiency calculator", "boiler performance", "heating efficiency"],
  [
    '{ name: "fuelInput", label: "Fuel Input (BTU/hr)", type: "number", min: 10000, max: 5000000, defaultValue: 100000 }',
    '{ name: "steamOutput", label: "Useful Heat Output (BTU/hr)", type: "number", min: 5000, max: 5000000, defaultValue: 82000 }',
    '{ name: "stackTemp", label: "Stack Temperature (F)", type: "number", min: 200, max: 800, defaultValue: 350 }',
    '{ name: "fuelType", label: "Fuel Type", type: "select", options: [{ value: "1", label: "Natural Gas" }, { value: "2", label: "Propane" }, { value: "3", label: "Fuel Oil #2" }, { value: "4", label: "Electric" }], defaultValue: "1" }'
  ],
  `(inputs) => {
    const fuelInput = inputs.fuelInput as number;
    const heatOutput = inputs.steamOutput as number;
    const stackTemp = inputs.stackTemp as number;
    const fuelType = parseInt(inputs.fuelType as string);
    const combustionEff = fuelType === 4 ? 100 : Math.max(70, 100 - (stackTemp - 300) * 0.05);
    const grossEff = (heatOutput / fuelInput) * 100;
    const radiationLoss = fuelInput * 0.02;
    const stackLoss = fuelInput * (1 - grossEff / 100) * 0.7;
    const netEff = grossEff * 0.98;
    const fuelCostPerMBTU = { 1: 10, 2: 25, 3: 20, 4: 30 };
    const annualFuelCost = (fuelInput / 1000000) * (fuelCostPerMBTU[fuelType] || 10) * 2000;
    const savingsIfUpgrade = annualFuelCost * (1 - grossEff / 95);
    return {
      primary: { label: "Gross Efficiency", value: formatNumber(Math.round(grossEff * 10) / 10) + "%" },
      details: [
        { label: "Net Efficiency", value: formatNumber(Math.round(netEff * 10) / 10) + "%" },
        { label: "Combustion Efficiency", value: formatNumber(Math.round(combustionEff * 10) / 10) + "%" },
        { label: "Estimated Annual Fuel Cost", value: "$" + formatNumber(Math.round(annualFuelCost)) },
        { label: "Savings if Upgraded to 95%", value: "$" + formatNumber(Math.round(Math.abs(savingsIfUpgrade))) + "/yr" }
      ]
    };
  }`,
  [
    "Q: What is a good boiler efficiency?||A: Standard boilers operate at 80-85 percent efficiency. High-efficiency condensing boilers achieve 90-98 percent. Older boilers may operate at only 60-75 percent efficiency.",
    "Q: What is the difference between gross and net efficiency?||A: Gross efficiency measures heat output versus fuel input at the boiler. Net efficiency accounts for additional losses including radiation, piping, and standby losses throughout the system.",
    "Q: How does stack temperature indicate efficiency?||A: Lower stack temperatures generally indicate higher efficiency because less heat is escaping up the flue. Condensing boilers achieve stack temperatures below 130F by recovering latent heat."
  ],
  `Gross Efficiency = (Heat Output / Fuel Input) x 100\nNet Efficiency = Gross Efficiency x 0.98 (radiation loss)\nCombustion Efficiency = 100 - (Stack Temp - 300) x 0.05\nAnnual Cost = (Input / 1M BTU) x Fuel Cost x Operating Hours`,
  ["heat-pump-cop-calculator", "btu-heating-calculator"]
);

add(
  "radiant-floor-heating-calculator",
  "Radiant Floor Heating Calculator",
  "Calculate radiant floor heating requirements including tube spacing, water temperature, and BTU output per square foot for hydronic or electric radiant systems.",
  "Everyday",
  "everyday",
  "~",
  ["radiant floor heating", "hydronic floor heating calculator", "in-floor heating", "radiant heat BTU"],
  [
    '{ name: "floorArea", label: "Floor Area (sq ft)", type: "number", min: 50, max: 10000, defaultValue: 500 }',
    '{ name: "heatLoss", label: "Room Heat Loss (BTU/sq ft/hr)", type: "number", min: 10, max: 60, defaultValue: 25 }',
    '{ name: "floorType", label: "Floor Covering", type: "select", options: [{ value: "1", label: "Tile/Stone" }, { value: "2", label: "Hardwood" }, { value: "3", label: "Carpet" }, { value: "4", label: "Laminate" }], defaultValue: "1" }',
    '{ name: "systemType", label: "System Type", type: "select", options: [{ value: "1", label: "Hydronic (water)" }, { value: "2", label: "Electric" }], defaultValue: "1" }'
  ],
  `(inputs) => {
    const area = inputs.floorArea as number;
    const heatLoss = inputs.heatLoss as number;
    const floorType = parseInt(inputs.floorType as string);
    const sysType = parseInt(inputs.systemType as string);
    const totalBtu = area * heatLoss;
    const rValue = { 1: 0.5, 2: 1.0, 3: 2.0, 4: 0.8 };
    const floorR = rValue[floorType] || 1.0;
    const waterTemp = 85 + floorR * 15 + heatLoss * 0.5;
    const tubeSpacing = heatLoss <= 20 ? 12 : heatLoss <= 35 ? 9 : 6;
    const tubeLength = (area / tubeSpacing) * 12;
    const wattsPerSqFt = sysType === 2 ? heatLoss / 3.412 : 0;
    const electricWatts = wattsPerSqFt * area;
    const monthlyCost = sysType === 2 ? (electricWatts / 1000) * 0.12 * 8 * 30 : (totalBtu / 100000) * 1.0 * 8 * 30;
    return {
      primary: { label: "Total Heating Capacity", value: formatNumber(Math.round(totalBtu)) + " BTU/hr" },
      details: [
        { label: sysType === 1 ? "Water Temperature" : "Watts Per Sq Ft", value: sysType === 1 ? formatNumber(Math.round(waterTemp)) + " F" : formatNumber(Math.round(wattsPerSqFt * 10) / 10) + " W/sq ft" },
        { label: "Tube Spacing", value: formatNumber(tubeSpacing) + " inches" },
        { label: sysType === 1 ? "Total Tube Length" : "Total Wattage", value: sysType === 1 ? formatNumber(Math.round(tubeLength)) + " ft" : formatNumber(Math.round(electricWatts)) + " W" },
        { label: "Est. Monthly Cost (8hr/day)", value: "$" + formatNumber(Math.round(monthlyCost)) }
      ]
    };
  }`,
  [
    "Q: What temperature should radiant floor water be?||A: Hydronic radiant floors typically use water between 85-130F depending on heat loss and floor covering. Tile floors need lower temperatures than carpet because they conduct heat better.",
    "Q: How far apart should radiant floor tubes be?||A: Standard spacing is 9-12 inches for moderate heating needs. High heat loss areas may need 6-inch spacing. Closer spacing provides more even heating but requires more tubing.",
    "Q: Is radiant floor heating energy efficient?||A: Radiant floors are 25-30 percent more efficient than forced air because they heat objects directly, operate at lower temperatures, and eliminate duct losses. They also improve comfort."
  ],
  `Total BTU = Floor Area x Heat Loss Per Sq Ft\nWater Temp = 85 + (Floor R-Value x 15) + (Heat Loss x 0.5)\nTube Spacing = 12 in (low), 9 in (medium), 6 in (high heat loss)\nTube Length = (Area / Spacing) x 12`,
  ["btu-heating-calculator", "boiler-efficiency-calculator"]
);

add(
  "mini-split-sizing-calculator",
  "Mini Split Sizing Calculator",
  "Calculate the correct mini split heat pump size for a room based on square footage, insulation, sun exposure, and climate to ensure efficient heating and cooling.",
  "Everyday",
  "everyday",
  "~",
  ["mini split sizing", "ductless AC sizing", "mini split BTU calculator", "ductless heat pump size"],
  [
    '{ name: "roomSqFt", label: "Room Size (sq ft)", type: "number", min: 50, max: 3000, defaultValue: 400 }',
    '{ name: "ceilingHeight", label: "Ceiling Height (ft)", type: "number", min: 7, max: 16, defaultValue: 8 }',
    '{ name: "sunExposure", label: "Sun Exposure", type: "select", options: [{ value: "1", label: "Mostly Shaded" }, { value: "2", label: "Average" }, { value: "3", label: "Lots of Sun" }], defaultValue: "2" }',
    '{ name: "insulation", label: "Insulation Quality", type: "select", options: [{ value: "1", label: "Poor" }, { value: "2", label: "Average" }, { value: "3", label: "Good" }, { value: "4", label: "Excellent" }], defaultValue: "2" }',
    '{ name: "climate", label: "Climate", type: "select", options: [{ value: "1", label: "Mild" }, { value: "2", label: "Moderate" }, { value: "3", label: "Hot Summers / Cold Winters" }, { value: "4", label: "Extreme" }], defaultValue: "2" }'
  ],
  `(inputs) => {
    const sqft = inputs.roomSqFt as number;
    const ceiling = inputs.ceilingHeight as number;
    const sun = parseInt(inputs.sunExposure as string);
    const insulation = parseInt(inputs.insulation as string);
    const climate = parseInt(inputs.climate as string);
    const baseBtu = sqft * 25;
    const ceilingFactor = ceiling / 8;
    const sunFactor = { 1: 0.9, 2: 1.0, 3: 1.15 };
    const insFactor = { 1: 1.3, 2: 1.0, 3: 0.85, 4: 0.75 };
    const climFactor = { 1: 0.85, 2: 1.0, 3: 1.2, 4: 1.4 };
    const adjustedBtu = baseBtu * ceilingFactor * (sunFactor[sun] || 1.0) * (insFactor[insulation] || 1.0) * (climFactor[climate] || 1.0);
    const standardSizes = [6000, 9000, 12000, 15000, 18000, 24000, 30000, 36000];
    let unitSize = 9000;
    for (let i = 0; i < standardSizes.length; i++) {
      if (standardSizes[i] >= adjustedBtu) { unitSize = standardSizes[i]; break; }
      if (i === standardSizes.length - 1) unitSize = standardSizes[i];
    }
    const tons = unitSize / 12000;
    const seer = 20;
    const annualCool = (unitSize / seer) * 1000 / 1000 * 0.12 * 8 * 120;
    return {
      primary: { label: "Recommended Unit Size", value: formatNumber(unitSize) + " BTU" },
      details: [
        { label: "Calculated Requirement", value: formatNumber(Math.round(adjustedBtu)) + " BTU" },
        { label: "Unit Tonnage", value: formatNumber(Math.round(tons * 10) / 10) + " tons" },
        { label: "Est. Annual Cooling Cost", value: "$" + formatNumber(Math.round(annualCool)) },
        { label: "Ceiling Factor", value: formatNumber(Math.round(ceilingFactor * 100) / 100) + "x" }
      ]
    };
  }`,
  [
    "Q: What size mini split do I need for a 400 sq ft room?||A: A 400 sq ft room with average insulation and climate typically needs a 9,000 or 12,000 BTU mini split. Rooms with poor insulation or extreme climates may need 15,000 BTU.",
    "Q: Can one mini split heat a whole house?||A: A single mini split can heat or cool one large open area effectively. For whole-house coverage, multi-zone systems with multiple indoor units connected to one outdoor compressor are recommended.",
    "Q: Are mini splits more efficient than central AC?||A: Yes, mini splits are typically 30-40 percent more efficient than central systems because they eliminate duct losses and use inverter compressors that adjust speed to match the load."
  ],
  `Base BTU = Square Footage x 25\nAdjusted BTU = Base x Ceiling Factor x Sun Factor x Insulation Factor x Climate Factor\nUnit Size = Next standard size above Adjusted BTU\nStandard sizes: 6K, 9K, 12K, 15K, 18K, 24K, 30K, 36K BTU`,
  ["btu-heating-calculator", "refrigerant-charge-calculator"]
);

add(
  "exhaust-fan-cfm-calculator",
  "Exhaust Fan CFM Calculator",
  "Calculate the required exhaust fan airflow in CFM for bathrooms, kitchens, and utility spaces based on room size, use type, and ventilation code requirements.",
  "Everyday",
  "everyday",
  "~",
  ["exhaust fan CFM", "bathroom fan size", "kitchen exhaust calculator", "ventilation fan sizing"],
  [
    '{ name: "roomType", label: "Room Type", type: "select", options: [{ value: "1", label: "Bathroom" }, { value: "2", label: "Kitchen" }, { value: "3", label: "Laundry Room" }, { value: "4", label: "Garage/Workshop" }], defaultValue: "1" }',
    '{ name: "roomLength", label: "Room Length (ft)", type: "number", min: 3, max: 50, defaultValue: 10 }',
    '{ name: "roomWidth", label: "Room Width (ft)", type: "number", min: 3, max: 50, defaultValue: 8 }',
    '{ name: "ceilingHeight", label: "Ceiling Height (ft)", type: "number", min: 7, max: 14, defaultValue: 8 }'
  ],
  `(inputs) => {
    const roomType = parseInt(inputs.roomType as string);
    const length = inputs.roomLength as number;
    const width = inputs.roomWidth as number;
    const ceiling = inputs.ceilingHeight as number;
    const sqft = length * width;
    const volume = sqft * ceiling;
    const acph = { 1: 8, 2: 15, 3: 6, 4: 10 };
    const minCFM = { 1: 50, 2: 100, 3: 50, 4: 75 };
    const cfmByVolume = (volume * (acph[roomType] || 8)) / 60;
    const cfmBySqFt = roomType === 1 ? sqft * 1.0 : roomType === 2 ? sqft * 2.0 : sqft * 0.75;
    const requiredCFM = Math.max(cfmByVolume, cfmBySqFt, minCFM[roomType] || 50);
    const stdSizes = [50, 70, 80, 100, 110, 150, 200, 250, 300, 400, 500];
    let fanSize = 50;
    for (let i = 0; i < stdSizes.length; i++) {
      if (stdSizes[i] >= requiredCFM) { fanSize = stdSizes[i]; break; }
      if (i === stdSizes.length - 1) fanSize = stdSizes[i];
    }
    const sones = fanSize <= 80 ? 0.5 : fanSize <= 110 ? 1.0 : fanSize <= 200 ? 2.0 : 3.0;
    const roomTypeName = { 1: "Bathroom", 2: "Kitchen", 3: "Laundry", 4: "Garage" };
    return {
      primary: { label: "Required CFM", value: formatNumber(Math.round(requiredCFM)) + " CFM" },
      details: [
        { label: "Recommended Fan Size", value: formatNumber(fanSize) + " CFM" },
        { label: "Room Volume", value: formatNumber(Math.round(volume)) + " cu ft" },
        { label: "Estimated Noise Level", value: formatNumber(sones) + " sones" },
        { label: "Room Type", value: roomTypeName[roomType] || "General" }
      ]
    };
  }`,
  [
    "Q: What size exhaust fan do I need for a bathroom?||A: For bathrooms up to 100 sq ft, use 1 CFM per square foot with a minimum of 50 CFM. Larger bathrooms need additional CFM for each enclosed fixture (toilet, shower, tub).",
    "Q: How many sones is a quiet exhaust fan?||A: Fans rated at 0.5 to 1.0 sones are very quiet. Fans at 1.0 to 2.0 sones are moderate. Anything above 3.0 sones is noticeably loud. Look for ENERGY STAR rated fans for quiet operation.",
    "Q: Do I need an exhaust fan if I have a window?||A: Most building codes require a mechanical exhaust fan in bathrooms regardless of windows. Windows do not provide consistent ventilation and cannot effectively remove moisture."
  ],
  `CFM by Volume = (Length x Width x Height x Air Changes/hr) / 60\nCFM by Area = Square Footage x CFM Per Sq Ft\nRequired CFM = Maximum of Volume, Area, and Code Minimum\nAir Changes: Bathroom=8, Kitchen=15, Laundry=6, Garage=10`,
  ["duct-sizing-calculator", "btu-heating-calculator"]
);

add(
  "grounding-electrode-calculator",
  "Grounding Electrode Calculator",
  "Calculate grounding electrode requirements including conductor size, ground rod specifications, and soil resistivity considerations for electrical system grounding per NEC.",
  "Science",
  "science",
  "A",
  ["grounding electrode", "ground rod calculator", "electrical grounding", "NEC grounding requirements"],
  [
    '{ name: "serviceSize", label: "Service Size (Amps)", type: "select", options: [{ value: "100", label: "100A" }, { value: "200", label: "200A" }, { value: "400", label: "400A" }, { value: "600", label: "600A" }], defaultValue: "200" }',
    '{ name: "soilType", label: "Soil Type", type: "select", options: [{ value: "1", label: "Wet Clay (low resistivity)" }, { value: "2", label: "Loam/Garden Soil" }, { value: "3", label: "Sandy Soil" }, { value: "4", label: "Rocky/Dry (high resistivity)" }], defaultValue: "2" }',
    '{ name: "rodMaterial", label: "Ground Rod Material", type: "select", options: [{ value: "1", label: "Copper-Bonded Steel (5/8 in)" }, { value: "2", label: "Galvanized Steel (5/8 in)" }, { value: "3", label: "Solid Copper (1/2 in)" }], defaultValue: "1" }',
    '{ name: "rodCount", label: "Number of Ground Rods", type: "number", min: 1, max: 8, defaultValue: 2 }'
  ],
  `(inputs) => {
    const serviceAmps = parseFloat(inputs.serviceSize as string);
    const soilType = parseInt(inputs.soilType as string);
    const rodMat = parseInt(inputs.rodMaterial as string);
    const rodCount = inputs.rodCount as number;
    const gecSize = serviceAmps <= 100 ? 8 : serviceAmps <= 200 ? 4 : serviceAmps <= 400 ? 2 : 1;
    const gecSizeLabel = gecSize === 8 ? "8 AWG" : gecSize === 4 ? "4 AWG" : gecSize === 2 ? "2 AWG" : "1/0 AWG";
    const soilResistivity = { 1: 25, 2: 100, 3: 300, 4: 1000 };
    const resistivity = soilResistivity[soilType] || 100;
    const singleRodR = (resistivity * 0.8) / 8;
    const totalR = singleRodR / rodCount;
    const meetsNEC = totalR <= 25 ? "Yes (under 25 ohms)" : "No - add more rods";
    const rodLength = 8;
    const totalRodLength = rodLength * rodCount;
    const minSpacing = rodLength * 2;
    return {
      primary: { label: "GEC Size", value: gecSizeLabel + " copper" },
      details: [
        { label: "Estimated Ground Resistance", value: formatNumber(Math.round(totalR * 10) / 10) + " ohms" },
        { label: "Meets NEC 25-Ohm Rule", value: meetsNEC },
        { label: "Total Rod Length", value: formatNumber(totalRodLength) + " ft (" + formatNumber(rodCount) + " rods)" },
        { label: "Minimum Rod Spacing", value: formatNumber(minSpacing) + " ft apart" }
      ]
    };
  }`,
  [
    "Q: How deep should a ground rod be?||A: NEC requires ground rods to be driven at least 8 feet into the earth. If rocky soil prevents full depth, the rod can be buried horizontally in a trench at least 30 inches deep.",
    "Q: Why do I need two ground rods?||A: NEC requires a second ground rod if a single rod does not achieve 25 ohms or less resistance to ground. In practice, two rods are almost always installed because testing is rarely performed.",
    "Q: What size grounding electrode conductor do I need?||A: For a 200-amp service, NEC requires a minimum 4 AWG copper grounding electrode conductor. Larger services require larger conductors per NEC Table 250.66."
  ],
  `GEC Size = Per NEC Table 250.66 based on service size\nSingle Rod Resistance = (Soil Resistivity x 0.8) / Rod Length\nTotal Resistance = Single Rod R / Number of Rods\nMinimum Rod Spacing = 2 x Rod Length`,
  ["wire-gauge-ampacity-calculator", "electrical-panel-load-calculator"]
);

add(
  "transformer-sizing-calculator",
  "Transformer Sizing Calculator",
  "Calculate the correct transformer kVA rating based on connected load, demand factor, future growth, and voltage configuration for commercial and industrial applications.",
  "Science",
  "science",
  "A",
  ["transformer sizing", "kVA calculator", "transformer capacity", "electrical transformer sizing"],
  [
    '{ name: "totalLoad", label: "Total Connected Load (kW)", type: "number", min: 1, max: 5000, defaultValue: 75 }',
    '{ name: "powerFactor", label: "Power Factor", type: "number", min: 0.5, max: 1, defaultValue: 0.85 }',
    '{ name: "demandFactor", label: "Demand Factor (%)", type: "number", min: 30, max: 100, defaultValue: 80 }',
    '{ name: "growthFactor", label: "Future Growth (%)", type: "number", min: 0, max: 100, defaultValue: 25 }',
    '{ name: "voltageConfig", label: "Voltage Configuration", type: "select", options: [{ value: "1", label: "480V 3-Phase" }, { value: "2", label: "208V 3-Phase" }, { value: "3", label: "240V Single Phase" }], defaultValue: "1" }'
  ],
  `(inputs) => {
    const totalKW = inputs.totalLoad as number;
    const pf = inputs.powerFactor as number;
    const demandPct = inputs.demandFactor as number / 100;
    const growthPct = inputs.growthFactor as number / 100;
    const voltConfig = parseInt(inputs.voltageConfig as string);
    const demandKW = totalKW * demandPct;
    const futureKW = demandKW * (1 + growthPct);
    const kvaRequired = futureKW / pf;
    const stdSizes = [15, 25, 37.5, 45, 75, 112.5, 150, 225, 300, 500, 750, 1000, 1500, 2000, 2500];
    let xfmrSize = 15;
    for (let i = 0; i < stdSizes.length; i++) {
      if (stdSizes[i] >= kvaRequired) { xfmrSize = stdSizes[i]; break; }
      if (i === stdSizes.length - 1) xfmrSize = stdSizes[i];
    }
    const voltages = { 1: 480, 2: 208, 3: 240 };
    const phases = { 1: 3, 2: 3, 3: 1 };
    const voltage = voltages[voltConfig] || 480;
    const phase = phases[voltConfig] || 3;
    const fla = phase === 3 ? (xfmrSize * 1000) / (voltage * 1.732) : (xfmrSize * 1000) / voltage;
    const loading = (kvaRequired / xfmrSize) * 100;
    return {
      primary: { label: "Recommended Transformer", value: formatNumber(xfmrSize) + " kVA" },
      details: [
        { label: "Required kVA", value: formatNumber(Math.round(kvaRequired * 10) / 10) + " kVA" },
        { label: "Full Load Amps", value: formatNumber(Math.round(fla * 10) / 10) + " A" },
        { label: "Transformer Loading", value: formatNumber(Math.round(loading)) + "%" },
        { label: "Demand Load", value: formatNumber(Math.round(futureKW * 10) / 10) + " kW" }
      ]
    };
  }`,
  [
    "Q: How do I size a transformer?||A: Calculate total connected load in kW, apply the demand factor (typically 60-80 percent), add growth allowance (20-25 percent), and divide by power factor to get kVA. Select the next standard size up.",
    "Q: What is transformer demand factor?||A: Demand factor is the ratio of actual maximum demand to total connected load. Not all loads run simultaneously, so demand factor is typically 60-80 percent for commercial buildings.",
    "Q: Should I oversize a transformer?||A: Mild oversizing (loading at 65-80 percent) is ideal for efficiency and longevity. Severely oversized transformers waste energy through core losses. Undersized transformers overheat and fail prematurely."
  ],
  `Demand kW = Total Load x Demand Factor\nFuture kW = Demand kW x (1 + Growth Factor)\nRequired kVA = Future kW / Power Factor\nFLA (3-phase) = (kVA x 1000) / (Voltage x 1.732)`,
  ["electrical-panel-load-calculator", "motor-starter-sizing-calculator"]
);

add(
  "motor-starter-sizing-calculator",
  "Motor Starter Sizing Calculator",
  "Determine the correct motor starter, overload relay, and wire size for electric motors based on horsepower, voltage, and starting method per NEC requirements.",
  "Science",
  "science",
  "A",
  ["motor starter sizing", "motor overload calculator", "motor circuit sizing", "NEC motor starter"],
  [
    '{ name: "motorHP", label: "Motor Horsepower", type: "select", options: [{ value: "0.5", label: "1/2 HP" }, { value: "1", label: "1 HP" }, { value: "2", label: "2 HP" }, { value: "3", label: "3 HP" }, { value: "5", label: "5 HP" }, { value: "7.5", label: "7.5 HP" }, { value: "10", label: "10 HP" }, { value: "15", label: "15 HP" }], defaultValue: "5" }',
    '{ name: "voltage", label: "Voltage", type: "select", options: [{ value: "120", label: "120V 1-Phase" }, { value: "208", label: "208V 3-Phase" }, { value: "240", label: "240V 3-Phase" }, { value: "480", label: "480V 3-Phase" }], defaultValue: "208" }',
    '{ name: "startType", label: "Starting Method", type: "select", options: [{ value: "1", label: "Direct On Line (DOL)" }, { value: "2", label: "Soft Starter" }, { value: "3", label: "VFD" }], defaultValue: "1" }',
    '{ name: "serviceFactor", label: "Service Factor", type: "number", min: 1.0, max: 1.5, defaultValue: 1.15 }'
  ],
  `(inputs) => {
    const hp = parseFloat(inputs.motorHP as string);
    const voltage = parseFloat(inputs.voltage as string);
    const startType = parseInt(inputs.startType as string);
    const sf = inputs.serviceFactor as number;
    const phase = voltage >= 208 ? 3 : 1;
    const efficiency = 0.88;
    const fla = phase === 3 ? (hp * 746) / (voltage * 1.732 * efficiency * 0.85) : (hp * 746) / (voltage * efficiency * 0.85);
    const olRelay = fla * sf * 1.15;
    const breakerMultiplier = startType === 1 ? 2.5 : startType === 2 ? 1.75 : 1.5;
    const breakerSize = fla * breakerMultiplier;
    const stdBreakers = [15, 20, 25, 30, 35, 40, 45, 50, 60, 70, 80, 90, 100, 110, 125, 150, 175, 200];
    let breaker = 15;
    for (let i = 0; i < stdBreakers.length; i++) {
      if (stdBreakers[i] >= breakerSize) { breaker = stdBreakers[i]; break; }
      if (i === stdBreakers.length - 1) breaker = stdBreakers[i];
    }
    const wireSize = fla <= 15 ? "14 AWG" : fla <= 20 ? "12 AWG" : fla <= 30 ? "10 AWG" : fla <= 40 ? "8 AWG" : fla <= 55 ? "6 AWG" : fla <= 70 ? "4 AWG" : "2 AWG";
    const startTypeName = { 1: "DOL", 2: "Soft Starter", 3: "VFD" };
    return {
      primary: { label: "Motor FLA", value: formatNumber(Math.round(fla * 10) / 10) + " A" },
      details: [
        { label: "Overload Relay Setting", value: formatNumber(Math.round(olRelay * 10) / 10) + " A" },
        { label: "Branch Circuit Breaker", value: formatNumber(breaker) + " A" },
        { label: "Minimum Wire Size", value: wireSize },
        { label: "Start Method", value: startTypeName[startType] || "DOL" }
      ]
    };
  }`,
  [
    "Q: How do I size a motor starter?||A: Size the starter based on motor FLA and voltage. The overload relay is set to 115 percent of FLA times the service factor. The branch circuit breaker is sized at 250 percent of FLA for standard starters.",
    "Q: What is the advantage of a VFD over DOL starting?||A: VFDs provide soft starting with lower inrush current (1.5x vs 6-8x FLA), variable speed control, energy savings at partial loads, and reduced mechanical stress on equipment.",
    "Q: What is motor service factor?||A: Service factor (SF) indicates how much a motor can be continuously overloaded beyond nameplate HP. A 1.15 SF motor can run at 115 percent of rated load without damage under normal conditions."
  ],
  `FLA (3-phase) = (HP x 746) / (Voltage x 1.732 x Efficiency x PF)\nOverload Setting = FLA x Service Factor x 1.15\nBreaker Size = FLA x Start Type Multiplier\nDOL = 2.5x, Soft Start = 1.75x, VFD = 1.5x`,
  ["transformer-sizing-calculator", "power-factor-correction-calculator"]
);

add(
  "power-factor-correction-calculator",
  "Power Factor Correction Calculator",
  "Calculate the capacitor bank size needed to correct power factor from current to target values, reducing utility penalties and improving electrical system efficiency.",
  "Science",
  "science",
  "A",
  ["power factor correction", "capacitor bank sizing", "kVAR calculator", "PF correction"],
  [
    '{ name: "realPower", label: "Real Power (kW)", type: "number", min: 10, max: 10000, defaultValue: 200 }',
    '{ name: "currentPF", label: "Current Power Factor", type: "number", min: 0.5, max: 0.99, defaultValue: 0.75 }',
    '{ name: "targetPF", label: "Target Power Factor", type: "number", min: 0.85, max: 1, defaultValue: 0.95 }',
    '{ name: "voltage", label: "System Voltage", type: "select", options: [{ value: "208", label: "208V" }, { value: "240", label: "240V" }, { value: "480", label: "480V" }], defaultValue: "480" }'
  ],
  `(inputs) => {
    const kw = inputs.realPower as number;
    const currentPF = inputs.currentPF as number;
    const targetPF = inputs.targetPF as number;
    const voltage = parseFloat(inputs.voltage as string);
    const currentAngle = Math.acos(currentPF);
    const targetAngle = Math.acos(targetPF);
    const currentKVAR = kw * Math.tan(currentAngle);
    const targetKVAR = kw * Math.tan(targetAngle);
    const requiredKVAR = currentKVAR - targetKVAR;
    const currentKVA = kw / currentPF;
    const targetKVA = kw / targetPF;
    const kvaReduction = currentKVA - targetKVA;
    const currentSavings = kvaReduction * 1000 / (voltage * 1.732);
    const annualSavings = requiredKVAR * 3.5 * 12;
    return {
      primary: { label: "Required Capacitor Bank", value: formatNumber(Math.round(requiredKVAR * 10) / 10) + " kVAR" },
      details: [
        { label: "Current kVA Demand", value: formatNumber(Math.round(currentKVA * 10) / 10) + " kVA" },
        { label: "New kVA Demand", value: formatNumber(Math.round(targetKVA * 10) / 10) + " kVA" },
        { label: "Current Reduction", value: formatNumber(Math.round(currentSavings * 10) / 10) + " A" },
        { label: "Est. Annual Savings", value: "$" + formatNumber(Math.round(annualSavings)) }
      ]
    };
  }`,
  [
    "Q: What is power factor and why does it matter?||A: Power factor is the ratio of real power (kW) to apparent power (kVA). Low power factor means you draw more current than needed, increasing utility bills, cable losses, and transformer loading.",
    "Q: What power factor should I target?||A: Most utilities require a minimum of 0.90 and penalize below that. Targeting 0.95 to 0.98 is optimal. Correcting to unity (1.0) can cause leading power factor issues with light loads.",
    "Q: How do capacitor banks correct power factor?||A: Capacitors supply reactive power (kVAR) locally, reducing the reactive current drawn from the utility. This lowers apparent power demand, reduces losses, and improves voltage regulation."
  ],
  `Current kVAR = kW x tan(arccos(Current PF))\nTarget kVAR = kW x tan(arccos(Target PF))\nRequired Capacitor = Current kVAR - Target kVAR\nkVA Reduction = (kW / Current PF) - (kW / Target PF)`,
  ["transformer-sizing-calculator", "harmonic-distortion-calculator"]
);

add(
  "harmonic-distortion-calculator",
  "Harmonic Distortion Calculator",
  "Calculate total harmonic distortion (THD) in electrical systems from nonlinear loads such as VFDs, UPS systems, and LED lighting to assess power quality issues.",
  "Science",
  "science",
  "A",
  ["harmonic distortion", "THD calculator", "power quality harmonics", "electrical harmonics analysis"],
  [
    '{ name: "fundamentalCurrent", label: "Fundamental Current (A)", type: "number", min: 1, max: 2000, defaultValue: 100 }',
    '{ name: "thirdHarmonic", label: "3rd Harmonic (%)", type: "number", min: 0, max: 100, defaultValue: 30 }',
    '{ name: "fifthHarmonic", label: "5th Harmonic (%)", type: "number", min: 0, max: 100, defaultValue: 20 }',
    '{ name: "seventhHarmonic", label: "7th Harmonic (%)", type: "number", min: 0, max: 100, defaultValue: 14 }',
    '{ name: "eleventhHarmonic", label: "11th Harmonic (%)", type: "number", min: 0, max: 100, defaultValue: 9 }'
  ],
  `(inputs) => {
    const i1 = inputs.fundamentalCurrent as number;
    const h3 = inputs.thirdHarmonic as number / 100;
    const h5 = inputs.fifthHarmonic as number / 100;
    const h7 = inputs.seventhHarmonic as number / 100;
    const h11 = inputs.eleventhHarmonic as number / 100;
    const thd = Math.sqrt(h3 * h3 + h5 * h5 + h7 * h7 + h11 * h11) * 100;
    const totalRMS = i1 * Math.sqrt(1 + h3 * h3 + h5 * h5 + h7 * h7 + h11 * h11);
    const neutralCurrent = i1 * h3 * 3;
    const kFactor = 1 + (h3 * h3 * 9 + h5 * h5 * 25 + h7 * h7 * 49 + h11 * h11 * 121);
    const status = thd <= 5 ? "Excellent (IEEE 519 compliant)" : thd <= 8 ? "Acceptable" : thd <= 20 ? "High - consider filtering" : "Excessive - requires filtering";
    return {
      primary: { label: "Total Harmonic Distortion", value: formatNumber(Math.round(thd * 10) / 10) + "%" },
      details: [
        { label: "Total RMS Current", value: formatNumber(Math.round(totalRMS * 10) / 10) + " A" },
        { label: "Neutral Current (3-phase)", value: formatNumber(Math.round(neutralCurrent * 10) / 10) + " A" },
        { label: "K-Factor", value: formatNumber(Math.round(kFactor * 10) / 10) },
        { label: "Status", value: status }
      ]
    };
  }`,
  [
    "Q: What is an acceptable THD level?||A: IEEE 519 recommends current THD below 5 percent at the point of common coupling for most systems. Voltage THD should be below 5 percent for general systems and below 3 percent for sensitive equipment.",
    "Q: What causes harmonic distortion?||A: Nonlinear loads such as variable frequency drives, switching power supplies, LED drivers, UPS systems, and arc furnaces draw non-sinusoidal current that creates harmonic frequencies.",
    "Q: How do harmonics affect electrical equipment?||A: Harmonics cause transformer overheating, neutral conductor overloading, capacitor failure, motor vibration, breaker nuisance tripping, and interference with sensitive electronics."
  ],
  `THD = sqrt(H3^2 + H5^2 + H7^2 + H11^2) x 100\nTotal RMS = I1 x sqrt(1 + H3^2 + H5^2 + H7^2 + H11^2)\nNeutral Current = I1 x H3 x 3 (triplen harmonics)\nK-Factor = 1 + sum(Hn^2 x n^2)`,
  ["power-factor-correction-calculator", "transformer-sizing-calculator"]
);

add(
  "cable-tray-fill-calculator",
  "Cable Tray Fill Calculator",
  "Calculate cable tray fill area and capacity based on tray dimensions, cable sizes, and NEC fill requirements for organized and code-compliant cable management.",
  "Everyday",
  "everyday",
  "~",
  ["cable tray fill", "cable tray sizing", "NEC cable tray calculator", "cable management sizing"],
  [
    '{ name: "trayWidth", label: "Tray Width (inches)", type: "select", options: [{ value: "6", label: "6 inch" }, { value: "12", label: "12 inch" }, { value: "18", label: "18 inch" }, { value: "24", label: "24 inch" }, { value: "30", label: "30 inch" }, { value: "36", label: "36 inch" }], defaultValue: "12" }',
    '{ name: "trayDepth", label: "Tray Depth (inches)", type: "select", options: [{ value: "3", label: "3 inch" }, { value: "4", label: "4 inch" }, { value: "5", label: "5 inch" }, { value: "6", label: "6 inch" }], defaultValue: "4" }',
    '{ name: "cableDiameter", label: "Average Cable OD (inches)", type: "number", min: 0.2, max: 3, defaultValue: 0.75 }',
    '{ name: "cableCount", label: "Number of Cables", type: "number", min: 1, max: 200, defaultValue: 20 }'
  ],
  `(inputs) => {
    const trayW = parseFloat(inputs.trayWidth as string);
    const trayD = parseFloat(inputs.trayDepth as string);
    const cableOD = inputs.cableDiameter as number;
    const cableCount = inputs.cableCount as number;
    const trayArea = trayW * trayD;
    const cableArea = Math.PI * Math.pow(cableOD / 2, 2);
    const totalCableArea = cableArea * cableCount;
    const fillPct = (totalCableArea / trayArea) * 100;
    const maxFillPct = 40;
    const maxCables = Math.floor((trayArea * maxFillPct / 100) / cableArea);
    const remainingCapacity = maxCables - cableCount;
    const passes = fillPct <= maxFillPct ? "Yes" : "No - tray too full";
    return {
      primary: { label: "Cable Tray Fill", value: formatNumber(Math.round(fillPct * 10) / 10) + "%" },
      details: [
        { label: "Passes NEC Fill Limit (40%)", value: passes },
        { label: "Maximum Cables", value: formatNumber(maxCables) },
        { label: "Remaining Capacity", value: formatNumber(Math.max(remainingCapacity, 0)) + " cables" },
        { label: "Total Cable Area", value: formatNumber(Math.round(totalCableArea * 100) / 100) + " sq in" }
      ]
    };
  }`,
  [
    "Q: What is the NEC fill limit for cable trays?||A: NEC Article 392 generally limits cable tray fill to 40 percent of the cross-sectional area for power cables. Signal and control cables may have different limits based on cable type and voltage.",
    "Q: How do I choose cable tray size?||A: Calculate total cross-sectional area of all cables, then select a tray where that area is no more than 40 percent of the tray cross section. Allow 25 percent spare capacity for future additions.",
    "Q: What types of cable trays are available?||A: Common types include ladder, solid bottom, ventilated, wire mesh, and channel. Ladder trays are best for heavy power cables while wire mesh is ideal for data and communication cables."
  ],
  `Tray Area = Tray Width x Tray Depth\nCable Area = Pi x (Cable OD / 2)^2\nTotal Cable Area = Cable Area x Number of Cables\nFill Percentage = (Total Cable Area / Tray Area) x 100\nMax Cables = (Tray Area x 40%) / Cable Area`,
  ["conduit-fill-calculator", "wire-gauge-ampacity-calculator"]
);

add(
  "emergency-generator-sizing-calculator",
  "Emergency Generator Sizing Calculator",
  "Calculate the required emergency generator size in kW or kVA for backup power based on critical loads, motor starting requirements, and step loading sequence.",
  "Everyday",
  "everyday",
  "~",
  ["generator sizing", "backup generator calculator", "standby generator size", "emergency power calculator"],
  [
    '{ name: "lightingLoad", label: "Lighting Load (kW)", type: "number", min: 0, max: 500, defaultValue: 15 }',
    '{ name: "hvacLoad", label: "HVAC Load (kW)", type: "number", min: 0, max: 500, defaultValue: 20 }',
    '{ name: "largestMotorHP", label: "Largest Motor (HP)", type: "number", min: 0, max: 200, defaultValue: 10 }',
    '{ name: "criticalLoad", label: "Other Critical Loads (kW)", type: "number", min: 0, max: 500, defaultValue: 10 }',
    '{ name: "powerFactor", label: "Power Factor", type: "number", min: 0.7, max: 1, defaultValue: 0.8 }'
  ],
  `(inputs) => {
    const lighting = inputs.lightingLoad as number;
    const hvac = inputs.hvacLoad as number;
    const motorHP = inputs.largestMotorHP as number;
    const critical = inputs.criticalLoad as number;
    const pf = inputs.powerFactor as number;
    const totalRunKW = lighting + hvac + critical;
    const motorKW = motorHP * 0.746;
    const motorStartKW = motorKW * 3;
    const peakKW = totalRunKW + motorStartKW;
    const runningKW = totalRunKW + motorKW;
    const requiredKVA = peakKW / pf;
    const stdSizes = [20, 30, 45, 60, 80, 100, 125, 150, 200, 250, 300, 350, 400, 500, 600, 750, 1000];
    let genSize = 20;
    for (let i = 0; i < stdSizes.length; i++) {
      if (stdSizes[i] >= requiredKVA) { genSize = stdSizes[i]; break; }
      if (i === stdSizes.length - 1) genSize = stdSizes[i];
    }
    const loading = (runningKW / (genSize * pf)) * 100;
    const fuelGPH = genSize * 0.07;
    return {
      primary: { label: "Recommended Generator", value: formatNumber(genSize) + " kVA" },
      details: [
        { label: "Running Load", value: formatNumber(Math.round(runningKW * 10) / 10) + " kW" },
        { label: "Peak Load (motor start)", value: formatNumber(Math.round(peakKW * 10) / 10) + " kW" },
        { label: "Running Load Factor", value: formatNumber(Math.round(loading)) + "%" },
        { label: "Est. Fuel Consumption", value: formatNumber(Math.round(fuelGPH * 10) / 10) + " gal/hr" }
      ]
    };
  }`,
  [
    "Q: How do I size an emergency generator?||A: Add all running loads in kW, then add motor starting surge for the largest motor (typically 3x running kW). Divide by power factor to get kVA, then select the next standard generator size.",
    "Q: Why does motor starting affect generator sizing?||A: Motors draw 3-6 times their running current during startup. The generator must handle this inrush current without excessive voltage or frequency dip, often requiring a larger generator.",
    "Q: What is a good load factor for a generator?||A: Generators run most efficiently at 50-80 percent load factor. Below 30 percent causes wet stacking in diesel generators. Above 80 percent leaves insufficient margin for load transients."
  ],
  `Total Running kW = Lighting + HVAC + Critical Loads + Motor kW\nMotor Start kW = Motor HP x 0.746 x 3\nPeak kW = Running Loads + Motor Start kW\nRequired kVA = Peak kW / Power Factor`,
  ["transformer-sizing-calculator", "electrical-panel-load-calculator"]
);

add(
  "solar-inverter-sizing-calculator",
  "Solar Inverter Sizing Calculator",
  "Calculate the correct solar inverter size based on panel array capacity, system voltage, temperature derating, and desired DC-to-AC ratio for optimal solar performance.",
  "Science",
  "science",
  "A",
  ["solar inverter sizing", "inverter calculator", "solar system inverter", "DC to AC ratio solar"],
  [
    '{ name: "arrayKW", label: "Solar Array Size (kW DC)", type: "number", min: 1, max: 500, defaultValue: 10 }',
    '{ name: "dcAcRatio", label: "DC-to-AC Ratio", type: "select", options: [{ value: "1.0", label: "1.0 (conservative)" }, { value: "1.15", label: "1.15 (standard)" }, { value: "1.25", label: "1.25 (moderate clipping)" }, { value: "1.35", label: "1.35 (aggressive)" }], defaultValue: "1.25" }',
    '{ name: "inverterType", label: "Inverter Type", type: "select", options: [{ value: "1", label: "String Inverter" }, { value: "2", label: "Microinverters" }, { value: "3", label: "Power Optimizers + String" }], defaultValue: "1" }',
    '{ name: "maxTemp", label: "Max Ambient Temperature (F)", type: "number", min: 70, max: 130, defaultValue: 95 }'
  ],
  `(inputs) => {
    const arrayKW = inputs.arrayKW as number;
    const dcAcRatio = parseFloat(inputs.dcAcRatio as string);
    const invType = parseInt(inputs.inverterType as string);
    const maxTemp = inputs.maxTemp as number;
    const inverterKW = arrayKW / dcAcRatio;
    const tempDerate = maxTemp > 95 ? Math.max(0.8, 1 - (maxTemp - 95) * 0.005) : 1.0;
    const deratedKW = inverterKW / tempDerate;
    const stdSizes = [3, 3.8, 5, 6, 7.6, 8, 10, 11.4, 12, 15, 20, 25, 30, 33.3, 40, 50, 60, 75, 100, 125];
    let invSize = 3;
    for (let i = 0; i < stdSizes.length; i++) {
      if (stdSizes[i] >= deratedKW) { invSize = stdSizes[i]; break; }
      if (i === stdSizes.length - 1) invSize = stdSizes[i];
    }
    const actualRatio = arrayKW / invSize;
    const microCount = invType === 2 ? Math.ceil(arrayKW / 0.4) : 0;
    const annualKWh = arrayKW * 1400 * (invType === 2 ? 0.98 : 0.96);
    const clippingLoss = actualRatio > 1.3 ? (actualRatio - 1.0) * 2 : actualRatio > 1.15 ? (actualRatio - 1.0) * 0.5 : 0;
    return {
      primary: { label: invType === 2 ? "Microinverters Needed" : "Inverter Size", value: invType === 2 ? formatNumber(microCount) + " units" : formatNumber(invSize) + " kW" },
      details: [
        { label: "Actual DC/AC Ratio", value: formatNumber(Math.round(actualRatio * 100) / 100) },
        { label: "Temperature Derating", value: formatNumber(Math.round(tempDerate * 100)) + "%" },
        { label: "Est. Annual Production", value: formatNumber(Math.round(annualKWh)) + " kWh" },
        { label: "Est. Clipping Loss", value: formatNumber(Math.round(clippingLoss * 100) / 100) + "%" }
      ]
    };
  }`,
  [
    "Q: What DC-to-AC ratio should I use?||A: A ratio of 1.15 to 1.25 is standard for most residential systems. Higher ratios reduce inverter cost but increase clipping losses during peak sun hours. A 1.25 ratio clips about 1-2 percent annually.",
    "Q: String inverter vs microinverters - which is better?||A: String inverters cost less but are affected by shade on any panel. Microinverters optimize each panel independently, performing better in shaded conditions and offering panel-level monitoring.",
    "Q: How does temperature affect solar inverter performance?||A: Inverters derate their output in high temperatures to prevent overheating. Above 95-105F ambient, output may reduce by 0.5 percent per degree. Ensure adequate ventilation and shade for the inverter."
  ],
  `Inverter kW = Array kW / DC-to-AC Ratio\nTemp Derate = 1 - (Temp - 95) x 0.005 (if above 95F)\nDerated Size = Inverter kW / Temp Derate Factor\nAnnual Production = Array kW x 1400 hrs x System Efficiency`,
  ["electrical-panel-load-calculator", "power-factor-correction-calculator"]
);
