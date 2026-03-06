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
