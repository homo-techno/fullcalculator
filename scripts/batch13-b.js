add(
  "smartphone-screen-repair-cost-calculator",
  "Smartphone Screen Repair Cost Calculator",
  "Estimate the cost of repairing a cracked or broken smartphone screen based on phone brand, model tier, and repair method to help you decide between DIY and professional service.",
  "Everyday",
  "everyday",
  "~",
  ["smartphone screen repair cost", "phone screen replacement", "cracked screen fix price", "phone repair estimate"],
  [
    '{ name: "phoneBrand", label: "Phone Brand", type: "select", options: [{ value: "1", label: "Apple iPhone" }, { value: "2", label: "Samsung Galaxy" }, { value: "3", label: "Google Pixel" }, { value: "4", label: "OnePlus" }, { value: "5", label: "Other Android" }], defaultValue: "1" }',
    '{ name: "modelTier", label: "Model Tier", type: "select", options: [{ value: "1", label: "Budget" }, { value: "2", label: "Mid-Range" }, { value: "3", label: "Flagship" }, { value: "4", label: "Ultra/Pro Max" }], defaultValue: "3" }',
    '{ name: "repairMethod", label: "Repair Method", type: "select", options: [{ value: "1", label: "Official Service Center" }, { value: "2", label: "Third-Party Shop" }, { value: "3", label: "DIY Repair" }], defaultValue: "2" }',
    '{ name: "hasInsurance", label: "Has Insurance/Protection Plan", type: "select", options: [{ value: "0", label: "No" }, { value: "1", label: "Yes" }], defaultValue: "0" }'
  ],
  `(inputs) => {
    const brand = parseInt(inputs.phoneBrand as string);
    const tier = parseInt(inputs.modelTier as string);
    const method = parseInt(inputs.repairMethod as string);
    const insured = parseInt(inputs.hasInsurance as string);
    const baseCosts = { 1: [129, 199, 279, 379], 2: [99, 169, 249, 329], 3: [89, 149, 219, 279], 4: [79, 129, 199, 249], 5: [69, 109, 179, 229] };
    const brandCosts = baseCosts[brand] || baseCosts[5];
    const baseCost = brandCosts[tier - 1] || brandCosts[2];
    const methodMultiplier = { 1: 1.0, 2: 0.7, 3: 0.4 };
    const repairCost = Math.round(baseCost * (methodMultiplier[method] || 0.7));
    const insuranceDeductible = insured === 1 ? Math.round(repairCost * 0.3) : repairCost;
    const savings = repairCost - insuranceDeductible;
    const phoneValue = tier * 250 + brand * 50;
    const repairPercent = Math.round((insuranceDeductible / phoneValue) * 100);
    return {
      primary: { label: "Estimated Repair Cost", value: "$" + formatNumber(insuranceDeductible) },
      details: [
        { label: "Full Price Without Insurance", value: "$" + formatNumber(repairCost) },
        { label: "Insurance Savings", value: "$" + formatNumber(savings) },
        { label: "Repair as % of Phone Value", value: formatNumber(repairPercent) + "%" },
        { label: "Recommendation", value: repairPercent > 50 ? "Consider upgrading" : "Repair is worthwhile" }
      ]
    };
  }`,
  [
    "Q: How much does it cost to fix a cracked phone screen?||A: Screen repair costs vary widely from $50 for budget Android DIY fixes to over $350 for flagship iPhone repairs at official service centers. The brand, model, and repair method are the biggest factors.",
    "Q: Is it worth repairing a phone screen or buying a new phone?||A: If the repair cost exceeds 50 percent of the phone current value, upgrading often makes more financial sense. For newer phones, repair is usually the better option.",
    "Q: Does phone insurance cover screen repair?||A: Most phone insurance plans and protection programs cover accidental screen damage with a deductible ranging from $29 to $99 depending on the plan and device tier."
  ],
  `Repair Cost = Base Cost (by brand and tier) x Method Multiplier\nInsurance Cost = Repair Cost x Deductible Rate (30%)\nRepair % of Value = Insurance Cost / Estimated Phone Value x 100`,
  ["electric-bill-device-cost-calculator", "phone-battery-health-calculator"]
);

add(
  "streaming-service-cost-comparison-calculator",
  "Streaming Service Cost Comparison Calculator",
  "Compare monthly and annual costs of multiple streaming subscriptions to see your total entertainment spending and find potential savings.",
  "Finance",
  "finance",
  "$",
  ["streaming cost comparison", "subscription cost total", "streaming budget", "netflix hulu disney cost", "streaming services"],
  [
    '{ name: "service1", label: "Service 1 Monthly Cost ($)", type: "number", min: 0, max: 50, defaultValue: 15.49 }',
    '{ name: "service2", label: "Service 2 Monthly Cost ($)", type: "number", min: 0, max: 50, defaultValue: 7.99 }',
    '{ name: "service3", label: "Service 3 Monthly Cost ($)", type: "number", min: 0, max: 50, defaultValue: 13.99 }',
    '{ name: "service4", label: "Service 4 Monthly Cost ($)", type: "number", min: 0, max: 50, defaultValue: 9.99 }',
    '{ name: "service5", label: "Service 5 Monthly Cost ($)", type: "number", min: 0, max: 50, defaultValue: 0 }'
  ],
  `(inputs) => {
    const s1 = inputs.service1 as number;
    const s2 = inputs.service2 as number;
    const s3 = inputs.service3 as number;
    const s4 = inputs.service4 as number;
    const s5 = inputs.service5 as number;
    const monthlyTotal = s1 + s2 + s3 + s4 + s5;
    const annualTotal = monthlyTotal * 12;
    const activeServices = [s1, s2, s3, s4, s5].filter(s => s > 0).length;
    const avgPerService = activeServices > 0 ? monthlyTotal / activeServices : 0;
    const dailyCost = monthlyTotal / 30.44;
    return {
      primary: { label: "Total Monthly Cost", value: "$" + formatNumber(Math.round(monthlyTotal * 100) / 100) },
      details: [
        { label: "Annual Cost", value: "$" + formatNumber(Math.round(annualTotal * 100) / 100) },
        { label: "Active Subscriptions", value: formatNumber(activeServices) },
        { label: "Average Per Service", value: "$" + formatNumber(Math.round(avgPerService * 100) / 100) },
        { label: "Daily Cost", value: "$" + formatNumber(Math.round(dailyCost * 100) / 100) }
      ]
    };
  }`,
  [
    "Q: How much does the average person spend on streaming?||A: The average US household spends approximately $50 to $80 per month on streaming services. Many subscribers maintain 3 to 5 active services simultaneously.",
    "Q: How can I reduce my streaming costs?||A: Rotate services monthly by subscribing only to the one you are actively watching. Use ad-supported tiers, share family plans, and watch for annual plan discounts to save money.",
    "Q: Is cable TV cheaper than streaming services?||A: Cable TV averages $80 to $120 per month. Streaming can be cheaper if you limit yourself to 2 or 3 services, but stacking many subscriptions can exceed cable costs."
  ],
  `Monthly Total = Sum of all service costs\nAnnual Total = Monthly Total x 12\nAverage Per Service = Monthly Total / Number of Active Services`,
  ["electric-bill-device-cost-calculator", "gaming-pc-build-budget-calculator"]
);

add(
  "gaming-pc-build-budget-calculator",
  "Gaming PC Build Budget Calculator",
  "Plan your gaming PC build budget by allocating costs across major components including CPU, GPU, RAM, storage, and peripherals.",
  "Finance",
  "finance",
  "$",
  ["gaming pc budget", "pc build cost", "computer build calculator", "custom pc price", "gaming rig budget"],
  [
    '{ name: "totalBudget", label: "Total Budget ($)", type: "number", min: 500, max: 10000, defaultValue: 1500 }',
    '{ name: "buildTier", label: "Build Tier", type: "select", options: [{ value: "1", label: "Budget (1080p)" }, { value: "2", label: "Mid-Range (1440p)" }, { value: "3", label: "High-End (4K)" }, { value: "4", label: "Enthusiast (4K Max)" }], defaultValue: "2" }',
    '{ name: "includeMonitor", label: "Include Monitor", type: "select", options: [{ value: "0", label: "No" }, { value: "1", label: "Yes" }], defaultValue: "0" }',
    '{ name: "includePeripherals", label: "Include Peripherals", type: "select", options: [{ value: "0", label: "No" }, { value: "1", label: "Yes" }], defaultValue: "0" }'
  ],
  `(inputs) => {
    const budget = inputs.totalBudget as number;
    const tier = parseInt(inputs.buildTier as string);
    const monitor = parseInt(inputs.includeMonitor as string);
    const peripherals = parseInt(inputs.includePeripherals as string);
    const monitorCost = monitor === 1 ? budget * 0.15 : 0;
    const peripheralCost = peripherals === 1 ? budget * 0.08 : 0;
    const coreBudget = budget - monitorCost - peripheralCost;
    const gpuPercent = { 1: 0.35, 2: 0.38, 3: 0.40, 4: 0.42 };
    const gpu = Math.round(coreBudget * (gpuPercent[tier] || 0.38));
    const cpu = Math.round(coreBudget * 0.22);
    const mobo = Math.round(coreBudget * 0.12);
    const ram = Math.round(coreBudget * 0.08);
    const storage = Math.round(coreBudget * 0.08);
    const psu = Math.round(coreBudget * 0.06);
    const pcCase = Math.round(coreBudget * 0.06);
    const cooling = coreBudget - gpu - cpu - mobo - ram - storage - psu - pcCase;
    return {
      primary: { label: "GPU Budget", value: "$" + formatNumber(gpu) },
      details: [
        { label: "CPU", value: "$" + formatNumber(cpu) },
        { label: "Motherboard", value: "$" + formatNumber(mobo) },
        { label: "RAM + Storage", value: "$" + formatNumber(ram + storage) },
        { label: "PSU + Case + Cooling", value: "$" + formatNumber(psu + pcCase + cooling) },
        { label: "Monitor", value: "$" + formatNumber(Math.round(monitorCost)) },
        { label: "Peripherals", value: "$" + formatNumber(Math.round(peripheralCost)) }
      ]
    };
  }`,
  [
    "Q: How much should I spend on a GPU for gaming?||A: The GPU should receive 35 to 42 percent of your core build budget. For 1080p gaming around $200-350 works, 1440p gaming needs $350-600, and 4K gaming typically requires $600 or more.",
    "Q: What is a good budget for a gaming PC?||A: A capable 1080p gaming PC can be built for $600-800. For 1440p high settings expect $1000-1500. A top-tier 4K build can cost $2000-3000 or more.",
    "Q: Should I buy prebuilt or build my own PC?||A: Building your own PC typically saves 10-20 percent and lets you choose higher quality components. Prebuilts offer convenience and a single warranty but may cut corners on the power supply or cooling."
  ],
  `GPU Budget = Core Budget x GPU Allocation % (35-42%)\nCPU Budget = Core Budget x 22%\nCore Budget = Total Budget - Monitor - Peripherals`,
  ["streaming-service-cost-comparison-calculator", "electric-bill-device-cost-calculator", "monitor-size-distance-calculator"]
);

add(
  "monitor-size-distance-calculator",
  "Monitor Size and Viewing Distance Calculator",
  "Calculate the optimal viewing distance for any monitor or TV based on screen size, resolution, and panel type for the best visual experience.",
  "Everyday",
  "everyday",
  "~",
  ["monitor viewing distance", "screen size distance", "optimal monitor distance", "desk monitor size", "ergonomic screen distance"],
  [
    '{ name: "screenSize", label: "Screen Size (inches diagonal)", type: "number", min: 13, max: 100, defaultValue: 27 }',
    '{ name: "resolution", label: "Resolution", type: "select", options: [{ value: "1", label: "1080p (Full HD)" }, { value: "2", label: "1440p (QHD)" }, { value: "3", label: "2160p (4K UHD)" }, { value: "4", label: "720p (HD)" }], defaultValue: "2" }',
    '{ name: "aspectRatio", label: "Aspect Ratio", type: "select", options: [{ value: "16", label: "16:9 Standard" }, { value: "21", label: "21:9 Ultrawide" }, { value: "32", label: "32:9 Super Ultrawide" }], defaultValue: "16" }',
    '{ name: "usage", label: "Primary Use", type: "select", options: [{ value: "1", label: "Productivity/Office" }, { value: "2", label: "Gaming" }, { value: "3", label: "Movie Watching" }], defaultValue: "1" }'
  ],
  `(inputs) => {
    const size = inputs.screenSize as number;
    const resolution = parseInt(inputs.resolution as string);
    const aspect = parseInt(inputs.aspectRatio as string);
    const usage = parseInt(inputs.usage as string);
    const resMultiplier = { 1: 1.5, 2: 1.2, 3: 1.0, 4: 2.0 };
    const usageMultiplier = { 1: 1.0, 2: 0.9, 3: 1.3 };
    const minDistance = Math.round(size * (resMultiplier[resolution] || 1.2) * (usageMultiplier[usage] || 1.0));
    const maxDistance = Math.round(minDistance * 1.5);
    const optimalDistance = Math.round((minDistance + maxDistance) / 2);
    const ppi = Math.round(Math.sqrt(Math.pow(1920 * resolution, 2) + Math.pow(1080 * resolution, 2)) / size);
    const screenWidthInches = Math.round(size * (aspect === 16 ? 0.872 : aspect === 21 ? 0.928 : 0.964) * 10) / 10;
    return {
      primary: { label: "Optimal Distance", value: formatNumber(optimalDistance) + " inches" },
      details: [
        { label: "Minimum Distance", value: formatNumber(minDistance) + " inches" },
        { label: "Maximum Distance", value: formatNumber(maxDistance) + " inches" },
        { label: "Approx. Screen Width", value: formatNumber(screenWidthInches) + " inches" },
        { label: "Pixel Density (PPI)", value: formatNumber(ppi) }
      ]
    };
  }`,
  [
    "Q: How far should I sit from a 27 inch monitor?||A: For a 27-inch 1440p monitor used for general productivity the ideal distance is about 32 to 40 inches (approximately arm length). For gaming you can sit slightly closer at 28 to 36 inches.",
    "Q: Does resolution affect viewing distance?||A: Yes. Higher resolution monitors like 4K can be viewed from closer distances without seeing individual pixels, while 1080p monitors need more distance to appear sharp.",
    "Q: What size monitor is best for a desk?||A: For a standard desk depth of 24-30 inches, a 24 to 27 inch monitor at 1440p is ideal. If your desk is deeper, you can comfortably use a 32 inch or larger display."
  ],
  `Optimal Distance = Screen Size x Resolution Factor x Usage Factor\nMinimum Distance = Size x Resolution Multiplier x Usage Multiplier\nMaximum Distance = Minimum Distance x 1.5`,
  ["tv-viewing-distance-calculator", "screen-resolution-comparison-calculator", "projector-throw-distance-calculator"]
);

add(
  "usb-transfer-speed-calculator",
  "USB Transfer Speed Calculator",
  "Calculate file transfer times over USB connections based on USB version, file size, and real-world speed factors.",
  "Everyday",
  "everyday",
  "~",
  ["usb transfer speed", "file transfer time usb", "usb 3.0 speed", "usb copy time", "data transfer usb"],
  [
    '{ name: "fileSize", label: "File Size (GB)", type: "number", min: 0.01, max: 10000, defaultValue: 10 }',
    '{ name: "usbVersion", label: "USB Version", type: "select", options: [{ value: "60", label: "USB 2.0 (480 Mbps)" }, { value: "625", label: "USB 3.0 (5 Gbps)" }, { value: "1250", label: "USB 3.1 (10 Gbps)" }, { value: "2500", label: "USB 3.2 (20 Gbps)" }, { value: "5000", label: "USB 4.0 (40 Gbps)" }], defaultValue: "625" }',
    '{ name: "efficiency", label: "Real-World Efficiency (%)", type: "number", min: 20, max: 100, defaultValue: 60 }',
    '{ name: "numFiles", label: "Number of Files", type: "number", min: 1, max: 1000000, defaultValue: 1 }'
  ],
  `(inputs) => {
    const fileSizeGB = inputs.fileSize as number;
    const maxSpeedMBps = inputs.usbVersion as number;
    const efficiency = inputs.efficiency as number / 100;
    const numFiles = inputs.numFiles as number;
    const realSpeedMBps = maxSpeedMBps * efficiency;
    const fileSizeMB = fileSizeGB * 1024;
    const overhead = numFiles > 1 ? numFiles * 0.002 : 0;
    const transferTime = (fileSizeMB / realSpeedMBps) + overhead;
    const hours = Math.floor(transferTime / 3600);
    const minutes = Math.floor((transferTime % 3600) / 60);
    const seconds = Math.round(transferTime % 60);
    const timeStr = hours > 0 ? hours + "h " + minutes + "m " + seconds + "s" : minutes > 0 ? minutes + "m " + seconds + "s" : seconds + "s";
    return {
      primary: { label: "Transfer Time", value: timeStr },
      details: [
        { label: "Real-World Speed", value: formatNumber(Math.round(realSpeedMBps)) + " MB/s" },
        { label: "Max Theoretical Speed", value: formatNumber(Math.round(maxSpeedMBps)) + " MB/s" },
        { label: "Total Data", value: formatNumber(Math.round(fileSizeMB)) + " MB" },
        { label: "File Overhead", value: formatNumber(Math.round(overhead * 100) / 100) + " seconds" }
      ]
    };
  }`,
  [
    "Q: What is the real-world speed of USB 3.0?||A: USB 3.0 has a theoretical maximum of 5 Gbps (625 MB/s), but real-world speeds are typically 300-400 MB/s or about 50-65 percent of the maximum due to protocol overhead and drive limitations.",
    "Q: Why is my USB transfer so slow?||A: Common causes include using a USB 2.0 port or cable instead of 3.0, a slow source or destination drive, transferring many small files, or background processes consuming bandwidth.",
    "Q: Does USB 4.0 make a noticeable difference?||A: USB 4.0 at 40 Gbps is extremely fast for large file transfers and external SSDs, but you need compatible devices on both ends. For flash drives, the drive itself is usually the bottleneck."
  ],
  `Transfer Time = (File Size in MB / Real Speed in MB/s) + File Overhead\nReal Speed = Max Speed x Efficiency %\nFile Overhead = Number of Files x 0.002 seconds`,
  ["data-transfer-time-calculator", "ssd-cost-per-gb-calculator"]
);

add(
  "ssd-cost-per-gb-calculator",
  "SSD Cost Per GB Calculator",
  "Compare solid state drive values by calculating cost per gigabyte across different SSD types, capacities, and interfaces to find the best deal.",
  "Finance",
  "finance",
  "$",
  ["ssd cost per gb", "solid state drive value", "ssd price comparison", "nvme vs sata cost", "storage cost calculator"],
  [
    '{ name: "ssdPrice", label: "SSD Price ($)", type: "number", min: 10, max: 5000, defaultValue: 89 }',
    '{ name: "capacity", label: "Capacity (GB)", type: "number", min: 32, max: 16000, defaultValue: 1000 }',
    '{ name: "ssdType", label: "SSD Type", type: "select", options: [{ value: "1", label: "SATA 2.5-inch" }, { value: "2", label: "NVMe PCIe 3.0" }, { value: "3", label: "NVMe PCIe 4.0" }, { value: "4", label: "NVMe PCIe 5.0" }], defaultValue: "2" }',
    '{ name: "comparePrice", label: "Compare SSD Price ($)", type: "number", min: 0, max: 5000, defaultValue: 159 }',
    '{ name: "compareCapacity", label: "Compare Capacity (GB)", type: "number", min: 32, max: 16000, defaultValue: 2000 }'
  ],
  `(inputs) => {
    const price1 = inputs.ssdPrice as number;
    const cap1 = inputs.capacity as number;
    const ssdType = parseInt(inputs.ssdType as string);
    const price2 = inputs.comparePrice as number;
    const cap2 = inputs.compareCapacity as number;
    const costPerGB1 = price1 / cap1;
    const costPerGB2 = price2 > 0 ? price2 / cap2 : 0;
    const costPerTB1 = costPerGB1 * 1000;
    const costPerTB2 = costPerGB2 * 1000;
    const speedLabels = { 1: "Up to 550 MB/s", 2: "Up to 3500 MB/s", 3: "Up to 7000 MB/s", 4: "Up to 12000 MB/s" };
    const betterDeal = costPerGB2 > 0 ? (costPerGB1 < costPerGB2 ? "SSD 1 is cheaper per GB" : costPerGB1 > costPerGB2 ? "SSD 2 is cheaper per GB" : "Both are equal value") : "Add comparison SSD";
    return {
      primary: { label: "Cost Per GB (SSD 1)", value: "$" + formatNumber(Math.round(costPerGB1 * 1000) / 1000) },
      details: [
        { label: "Cost Per TB (SSD 1)", value: "$" + formatNumber(Math.round(costPerTB1 * 100) / 100) },
        { label: "Cost Per GB (SSD 2)", value: costPerGB2 > 0 ? "$" + formatNumber(Math.round(costPerGB2 * 1000) / 1000) : "N/A" },
        { label: "Cost Per TB (SSD 2)", value: costPerGB2 > 0 ? "$" + formatNumber(Math.round(costPerTB2 * 100) / 100) : "N/A" },
        { label: "Max Read Speed", value: speedLabels[ssdType] || "Unknown" },
        { label: "Better Deal", value: betterDeal }
      ]
    };
  }`,
  [
    "Q: What is a good cost per GB for an SSD?||A: In 2024-2025, a good cost per GB for SATA SSDs is around $0.05-0.08 and for NVMe drives around $0.06-0.10. Prices vary by capacity and interface generation.",
    "Q: Is NVMe worth the extra cost over SATA?||A: For everyday use and gaming, NVMe offers noticeable improvements in boot and load times. For video editing, large file transfers, and professional workloads the speed difference is substantial and worth the premium.",
    "Q: How much SSD storage do I need?||A: 500GB is minimum for a modern system. 1TB is recommended for gaming. Content creators and professionals should consider 2TB or more for their working drives."
  ],
  `Cost Per GB = SSD Price / Capacity (GB)\nCost Per TB = Cost Per GB x 1000`,
  ["usb-transfer-speed-calculator", "nas-drive-cost-calculator", "gaming-pc-build-budget-calculator"]
);

add(
  "wireless-router-range-calculator",
  "Wireless Router Range Calculator",
  "Estimate the effective Wi-Fi coverage area of your wireless router based on frequency band, walls, and obstructions for optimal router placement.",
  "Everyday",
  "everyday",
  "~",
  ["wifi range calculator", "router coverage area", "wireless signal range", "wifi distance estimator", "router placement"],
  [
    '{ name: "routerType", label: "Router Standard", type: "select", options: [{ value: "1", label: "Wi-Fi 5 (802.11ac)" }, { value: "2", label: "Wi-Fi 6 (802.11ax)" }, { value: "3", label: "Wi-Fi 6E" }, { value: "4", label: "Wi-Fi 7 (802.11be)" }], defaultValue: "2" }',
    '{ name: "band", label: "Frequency Band", type: "select", options: [{ value: "24", label: "2.4 GHz (longer range)" }, { value: "5", label: "5 GHz (faster speed)" }, { value: "6", label: "6 GHz (fastest, shortest range)" }], defaultValue: "24" }',
    '{ name: "walls", label: "Number of Walls to Penetrate", type: "number", min: 0, max: 10, defaultValue: 2 }',
    '{ name: "wallType", label: "Wall Material", type: "select", options: [{ value: "1", label: "Drywall (light)" }, { value: "2", label: "Wood (medium)" }, { value: "3", label: "Brick/Concrete (heavy)" }, { value: "4", label: "Metal (severe)" }], defaultValue: "1" }'
  ],
  `(inputs) => {
    const router = parseInt(inputs.routerType as string);
    const band = parseInt(inputs.band as string);
    const walls = inputs.walls as number;
    const wallType = parseInt(inputs.wallType as string);
    const baseRange = { 24: 150, 5: 80, 6: 50 };
    const routerBonus = { 1: 1.0, 2: 1.15, 3: 1.2, 4: 1.3 };
    const wallLoss = { 1: 0.08, 2: 0.12, 3: 0.20, 4: 0.35 };
    const maxRange = Math.round((baseRange[band] || 100) * (routerBonus[router] || 1.0));
    const effectiveRange = Math.round(maxRange * Math.pow(1 - (wallLoss[wallType] || 0.1), walls));
    const coverageArea = Math.round(Math.PI * Math.pow(effectiveRange, 2));
    const signalLoss = Math.round((1 - effectiveRange / maxRange) * 100);
    return {
      primary: { label: "Effective Range", value: formatNumber(effectiveRange) + " feet" },
      details: [
        { label: "Max Open-Air Range", value: formatNumber(maxRange) + " feet" },
        { label: "Coverage Area", value: formatNumber(coverageArea) + " sq ft" },
        { label: "Signal Loss from Walls", value: formatNumber(signalLoss) + "%" },
        { label: "Recommendation", value: effectiveRange < 30 ? "Consider a mesh system" : effectiveRange < 60 ? "Good for small spaces" : "Good coverage" }
      ]
    };
  }`,
  [
    "Q: How far does a Wi-Fi router reach?||A: A typical router reaches 100-150 feet on the 2.4 GHz band in open air. Walls, floors, and obstructions significantly reduce this range. The 5 GHz band offers faster speeds but shorter range of 50-80 feet.",
    "Q: Does Wi-Fi 6 have better range than Wi-Fi 5?||A: Wi-Fi 6 offers 10-15 percent better range than Wi-Fi 5 along with improved performance in congested environments. The biggest improvement is in handling multiple devices simultaneously.",
    "Q: Where should I place my router for best coverage?||A: Place your router in a central elevated location away from walls, metal objects, and other electronics. Avoid closets, corners, and basements for optimal signal distribution."
  ],
  `Effective Range = Max Range x (1 - Wall Loss per Wall) ^ Number of Walls\nCoverage Area = Pi x Effective Range^2\nMax Range = Base Range (by band) x Router Bonus`,
  ["bluetooth-range-estimator-calculator", "security-camera-storage-calculator"]
);

add(
  "pc-power-supply-calculator",
  "PC Power Supply Calculator",
  "Estimate the wattage needed for your PC power supply based on CPU, GPU, RAM, storage, and peripheral power draw to choose the right PSU.",
  "Everyday",
  "everyday",
  "~",
  ["pc power supply calculator", "psu wattage calculator", "computer wattage", "power supply sizing", "pc watt requirements"],
  [
    '{ name: "cpuTdp", label: "CPU TDP (Watts)", type: "number", min: 15, max: 350, defaultValue: 105 }',
    '{ name: "gpuTdp", label: "GPU TDP (Watts)", type: "number", min: 0, max: 600, defaultValue: 250 }',
    '{ name: "ramSticks", label: "RAM Sticks", type: "number", min: 1, max: 8, defaultValue: 2 }',
    '{ name: "storageDevices", label: "Storage Drives (SSD/HDD)", type: "number", min: 1, max: 10, defaultValue: 2 }',
    '{ name: "fans", label: "Case Fans", type: "number", min: 1, max: 12, defaultValue: 4 }'
  ],
  `(inputs) => {
    const cpuTdp = inputs.cpuTdp as number;
    const gpuTdp = inputs.gpuTdp as number;
    const ramSticks = inputs.ramSticks as number;
    const storage = inputs.storageDevices as number;
    const fans = inputs.fans as number;
    const ramPower = ramSticks * 5;
    const storagePower = storage * 8;
    const fanPower = fans * 3;
    const motherboard = 75;
    const misc = 25;
    const totalDraw = cpuTdp + gpuTdp + ramPower + storagePower + fanPower + motherboard + misc;
    const recommended = Math.ceil(totalDraw * 1.25 / 50) * 50;
    const headroom = recommended - totalDraw;
    const efficiency80Plus = Math.round(totalDraw / 0.87);
    return {
      primary: { label: "Recommended PSU Wattage", value: formatNumber(recommended) + "W" },
      details: [
        { label: "Estimated Total Draw", value: formatNumber(totalDraw) + "W" },
        { label: "Headroom", value: formatNumber(headroom) + "W" },
        { label: "Wall Draw (80+ Gold)", value: formatNumber(efficiency80Plus) + "W" },
        { label: "CPU + GPU Draw", value: formatNumber(cpuTdp + gpuTdp) + "W" }
      ]
    };
  }`,
  [
    "Q: How do I know what wattage PSU I need?||A: Add up the TDP of your CPU and GPU, then add approximately 100-150W for other components. Multiply the total by 1.25 for headroom. Most gaming PCs need 550-850W PSUs.",
    "Q: What happens if my PSU is too small?||A: An undersized power supply can cause system crashes, random shutdowns, component damage, or fail to boot at all. GPU power spikes can trip overcurrent protection on inadequate PSUs.",
    "Q: Is a higher wattage PSU less efficient?||A: PSUs are most efficient at 40-60 percent load. A significantly oversized PSU running at very low load can be slightly less efficient, but the difference is small. A modest amount of headroom is always recommended."
  ],
  `Total Draw = CPU TDP + GPU TDP + RAM + Storage + Fans + Motherboard + Misc\nRecommended PSU = Total Draw x 1.25 (rounded up to nearest 50W)\nWall Draw = Total Draw / PSU Efficiency`,
  ["gaming-pc-build-budget-calculator", "electric-bill-device-cost-calculator", "ups-runtime-calculator"]
);

add(
  "rgb-led-strip-calculator",
  "RGB LED Strip Calculator",
  "Calculate the total power consumption, required power supply, and cost of running RGB LED strips based on strip length, LED density, and usage hours.",
  "Everyday",
  "everyday",
  "~",
  ["led strip calculator", "rgb led power", "led strip wattage", "led strip power supply", "addressable led calculator"],
  [
    '{ name: "stripLength", label: "Total Strip Length (meters)", type: "number", min: 0.5, max: 50, defaultValue: 5 }',
    '{ name: "ledDensity", label: "LEDs Per Meter", type: "select", options: [{ value: "30", label: "30 LEDs/m (Standard)" }, { value: "60", label: "60 LEDs/m (High Density)" }, { value: "144", label: "144 LEDs/m (Ultra Dense)" }], defaultValue: "60" }',
    '{ name: "wattsPerLed", label: "Watts Per LED", type: "number", min: 0.05, max: 0.5, defaultValue: 0.2 }',
    '{ name: "hoursPerDay", label: "Hours Used Per Day", type: "number", min: 1, max: 24, defaultValue: 6 }',
    '{ name: "electricRate", label: "Electricity Rate ($/kWh)", type: "number", min: 0.05, max: 0.60, defaultValue: 0.13 }'
  ],
  `(inputs) => {
    const length = inputs.stripLength as number;
    const density = inputs.ledDensity as number;
    const wattsPerLed = inputs.wattsPerLed as number;
    const hours = inputs.hoursPerDay as number;
    const rate = inputs.electricRate as number;
    const totalLeds = Math.round(length * density);
    const totalWatts = totalLeds * wattsPerLed;
    const psuWatts = Math.ceil(totalWatts * 1.2 / 10) * 10;
    const psuAmps = Math.round(psuWatts / 12 * 10) / 10;
    const dailyKwh = totalWatts * hours / 1000;
    const monthlyKwh = dailyKwh * 30.44;
    const monthlyCost = monthlyKwh * rate;
    const annualCost = monthlyCost * 12;
    return {
      primary: { label: "Total Power Draw", value: formatNumber(Math.round(totalWatts * 10) / 10) + "W" },
      details: [
        { label: "Total LEDs", value: formatNumber(totalLeds) },
        { label: "Recommended PSU", value: formatNumber(psuWatts) + "W / " + formatNumber(psuAmps) + "A (12V)" },
        { label: "Monthly Energy Use", value: formatNumber(Math.round(monthlyKwh * 100) / 100) + " kWh" },
        { label: "Monthly Electricity Cost", value: "$" + formatNumber(Math.round(monthlyCost * 100) / 100) },
        { label: "Annual Electricity Cost", value: "$" + formatNumber(Math.round(annualCost * 100) / 100) }
      ]
    };
  }`,
  [
    "Q: How many watts does an LED strip use?||A: A standard 5-meter LED strip with 60 LEDs per meter uses about 60 watts at full brightness. Actual power depends on LED type, density, and brightness level.",
    "Q: What power supply do I need for LED strips?||A: Choose a power supply rated at least 20 percent above the total strip wattage. Most LED strips run on 12V or 24V DC, so match the voltage to your strip specification.",
    "Q: Are LED strips expensive to run?||A: LED strips are very energy efficient. A typical 5-meter strip running 6 hours daily costs about $0.50 to $1.50 per month in electricity depending on your local rate."
  ],
  `Total Watts = Length x LED Density x Watts Per LED\nRecommended PSU = Total Watts x 1.2 (rounded up)\nMonthly Cost = (Total Watts x Hours/Day x 30.44 / 1000) x Rate`,
  ["electric-bill-device-cost-calculator", "pc-power-supply-calculator"]
);

add(
  "3d-printer-filament-cost-calculator",
  "3D Printer Filament Cost Calculator",
  "Estimate the filament usage and cost for 3D printing projects based on model volume, infill percentage, filament type, and material cost.",
  "Everyday",
  "everyday",
  "~",
  ["3d printer filament cost", "3d printing cost", "filament usage calculator", "pla filament price", "3d print material cost"],
  [
    '{ name: "modelVolume", label: "Model Volume (cubic cm)", type: "number", min: 1, max: 10000, defaultValue: 50 }',
    '{ name: "infillPercent", label: "Infill Percentage (%)", type: "number", min: 5, max: 100, defaultValue: 20 }',
    '{ name: "filamentType", label: "Filament Type", type: "select", options: [{ value: "1.24", label: "PLA ($20/kg)" }, { value: "1.04", label: "ABS ($22/kg)" }, { value: "1.25", label: "PETG ($25/kg)" }, { value: "1.31", label: "TPU ($30/kg)" }, { value: "1.27", label: "Nylon ($35/kg)" }], defaultValue: "1.24" }',
    '{ name: "spoolCost", label: "Spool Cost ($)", type: "number", min: 10, max: 200, defaultValue: 20 }',
    '{ name: "spoolWeight", label: "Spool Weight (grams)", type: "number", min: 250, max: 5000, defaultValue: 1000 }'
  ],
  `(inputs) => {
    const volume = inputs.modelVolume as number;
    const infill = inputs.infillPercent as number / 100;
    const density = parseFloat(inputs.filamentType as string);
    const spoolCost = inputs.spoolCost as number;
    const spoolWeight = inputs.spoolWeight as number;
    const shellVolume = volume * 0.15;
    const infillVolume = volume * 0.85 * infill;
    const totalVolume = shellVolume + infillVolume;
    const weightGrams = totalVolume * density;
    const costPerGram = spoolCost / spoolWeight;
    const printCost = weightGrams * costPerGram;
    const spoolPercent = (weightGrams / spoolWeight) * 100;
    const electricityCost = (totalVolume / 10) * 0.02;
    const totalCost = printCost + electricityCost;
    return {
      primary: { label: "Filament Cost", value: "$" + formatNumber(Math.round(printCost * 100) / 100) },
      details: [
        { label: "Filament Weight", value: formatNumber(Math.round(weightGrams * 10) / 10) + "g" },
        { label: "Spool Usage", value: formatNumber(Math.round(spoolPercent * 10) / 10) + "%" },
        { label: "Electricity Estimate", value: "$" + formatNumber(Math.round(electricityCost * 100) / 100) },
        { label: "Total Print Cost", value: "$" + formatNumber(Math.round(totalCost * 100) / 100) }
      ]
    };
  }`,
  [
    "Q: How much does it cost to 3D print something?||A: Most small 3D prints cost between $0.50 and $5 in filament. A typical benchy boat print uses about 15g of PLA and costs around $0.30. Larger prints can cost $10 or more in material alone.",
    "Q: What infill percentage should I use?||A: 10-20 percent infill works for decorative items, 30-50 percent for functional parts, and 80-100 percent for structural or load-bearing parts. Higher infill uses more filament and takes longer to print.",
    "Q: Which filament type is cheapest?||A: PLA is the most affordable at $15-25 per kilogram spool. ABS is similar in price. Specialty filaments like carbon fiber, metal-filled, or flexible TPU can cost $30-80 per kilogram."
  ],
  `Filament Weight = (Shell Volume + Infill Volume) x Material Density\nShell Volume = Model Volume x 15%\nInfill Volume = Model Volume x 85% x Infill %\nCost = Weight x (Spool Cost / Spool Weight)`,
  ["laser-printer-cost-per-page-calculator", "printer-ink-cost-calculator"]
);

add(
  "laser-printer-cost-per-page-calculator",
  "Laser Printer Cost Per Page Calculator",
  "Calculate the true cost per page of your laser printer including toner, drum, and maintenance costs to compare printing expenses.",
  "Finance",
  "finance",
  "$",
  ["laser printer cost per page", "toner cost calculator", "printing cost", "laser vs inkjet cost", "printer running cost"],
  [
    '{ name: "tonerCost", label: "Toner Cartridge Cost ($)", type: "number", min: 10, max: 500, defaultValue: 65 }',
    '{ name: "tonerYield", label: "Toner Page Yield", type: "number", min: 500, max: 30000, defaultValue: 3000 }',
    '{ name: "drumCost", label: "Drum Unit Cost ($)", type: "number", min: 0, max: 300, defaultValue: 45 }',
    '{ name: "drumYield", label: "Drum Page Yield", type: "number", min: 5000, max: 100000, defaultValue: 12000 }',
    '{ name: "pagesPerMonth", label: "Pages Printed Per Month", type: "number", min: 10, max: 10000, defaultValue: 500 }',
    '{ name: "paperCost", label: "Paper Cost Per Ream ($)", type: "number", min: 3, max: 30, defaultValue: 6 }'
  ],
  `(inputs) => {
    const tonerCost = inputs.tonerCost as number;
    const tonerYield = inputs.tonerYield as number;
    const drumCost = inputs.drumCost as number;
    const drumYield = inputs.drumYield as number;
    const pagesPerMonth = inputs.pagesPerMonth as number;
    const paperCostReam = inputs.paperCost as number;
    const tonerPerPage = tonerCost / tonerYield;
    const drumPerPage = drumCost / drumYield;
    const paperPerPage = paperCostReam / 500;
    const totalPerPage = tonerPerPage + drumPerPage + paperPerPage;
    const monthlyCost = totalPerPage * pagesPerMonth;
    const annualCost = monthlyCost * 12;
    const tonerMonths = tonerYield / pagesPerMonth;
    return {
      primary: { label: "Cost Per Page", value: "$" + formatNumber(Math.round(totalPerPage * 10000) / 10000) },
      details: [
        { label: "Toner Cost Per Page", value: "$" + formatNumber(Math.round(tonerPerPage * 10000) / 10000) },
        { label: "Monthly Printing Cost", value: "$" + formatNumber(Math.round(monthlyCost * 100) / 100) },
        { label: "Annual Printing Cost", value: "$" + formatNumber(Math.round(annualCost * 100) / 100) },
        { label: "Toner Lasts (Months)", value: formatNumber(Math.round(tonerMonths * 10) / 10) }
      ]
    };
  }`,
  [
    "Q: What is a good cost per page for a laser printer?||A: A good cost per page for a monochrome laser printer is $0.02 to $0.04 including toner and paper. Color laser printers typically cost $0.08 to $0.15 per page.",
    "Q: Is a laser printer cheaper than inkjet?||A: For high volume printing, laser printers cost significantly less per page. Inkjet printers have lower upfront costs but higher per-page costs, making them better for occasional photo printing.",
    "Q: How long does a toner cartridge last?||A: A standard toner cartridge yields 2000-3000 pages. High-yield cartridges can print 5000-10000 pages. Actual yield depends on coverage and print density."
  ],
  `Cost Per Page = (Toner Cost / Yield) + (Drum Cost / Yield) + (Paper Cost / 500)\nMonthly Cost = Cost Per Page x Pages Per Month\nAnnual Cost = Monthly Cost x 12`,
  ["printer-ink-cost-calculator", "3d-printer-filament-cost-calculator"]
);

add(
  "ups-runtime-calculator",
  "UPS Runtime Calculator",
  "Calculate how long an uninterruptible power supply will keep your equipment running during a power outage based on UPS capacity and connected load.",
  "Everyday",
  "everyday",
  "~",
  ["ups runtime calculator", "ups battery backup time", "uninterruptible power supply", "ups sizing calculator", "battery backup duration"],
  [
    '{ name: "upsVa", label: "UPS Capacity (VA)", type: "number", min: 300, max: 20000, defaultValue: 1500 }',
    '{ name: "upsWatts", label: "UPS Watts Rating", type: "number", min: 180, max: 15000, defaultValue: 900 }',
    '{ name: "totalLoad", label: "Connected Load (Watts)", type: "number", min: 50, max: 10000, defaultValue: 400 }',
    '{ name: "batteryAh", label: "Battery Capacity (Ah)", type: "number", min: 5, max: 200, defaultValue: 9 }',
    '{ name: "batteryVoltage", label: "Battery Voltage (V)", type: "number", min: 12, max: 96, defaultValue: 24 }'
  ],
  `(inputs) => {
    const upsVa = inputs.upsVa as number;
    const upsWatts = inputs.upsWatts as number;
    const load = inputs.totalLoad as number;
    const battAh = inputs.batteryAh as number;
    const battV = inputs.batteryVoltage as number;
    const batteryWh = battAh * battV;
    const efficiency = 0.85;
    const usableWh = batteryWh * efficiency;
    const runtimeHours = usableWh / load;
    const runtimeMinutes = Math.round(runtimeHours * 60);
    const loadPercent = Math.round((load / upsWatts) * 100);
    const loadVaPercent = Math.round((load / (upsVa * 0.6)) * 100);
    const overloaded = load > upsWatts;
    return {
      primary: { label: "Estimated Runtime", value: runtimeMinutes + " minutes" },
      details: [
        { label: "Battery Energy", value: formatNumber(Math.round(batteryWh)) + " Wh" },
        { label: "Usable Energy (85% eff.)", value: formatNumber(Math.round(usableWh)) + " Wh" },
        { label: "Load Percentage", value: formatNumber(loadPercent) + "%" },
        { label: "Status", value: overloaded ? "WARNING: Load exceeds UPS capacity" : loadPercent > 80 ? "High load - limited runtime" : "Load within safe range" }
      ]
    };
  }`,
  [
    "Q: How long will a UPS keep my computer running?||A: A typical 1500VA UPS with a 400W load provides 15-25 minutes of runtime. This is enough time to save your work and perform a graceful shutdown during a power outage.",
    "Q: What size UPS do I need?||A: Add up the wattage of all equipment you want to protect. Your UPS wattage rating should be at least 25 percent higher than your total load to ensure adequate runtime and prevent overloading.",
    "Q: Does a UPS waste electricity?||A: A UPS consumes 3-10 percent of its rated capacity in standby mode for charging and conversion. A 1500VA UPS typically uses 30-50 watts continuously, adding a few dollars per month to your electric bill."
  ],
  `Runtime (minutes) = (Battery Ah x Voltage x Efficiency) / Load x 60\nLoad % = Connected Load / UPS Watts Rating x 100\nUsable Energy = Battery Capacity x Voltage x 0.85`,
  ["pc-power-supply-calculator", "electric-bill-device-cost-calculator"]
);

add(
  "smart-thermostat-savings-calculator",
  "Smart Thermostat Savings Calculator",
  "Estimate annual energy savings from installing a smart thermostat based on current heating and cooling costs, climate zone, and scheduling preferences.",
  "Finance",
  "finance",
  "$",
  ["smart thermostat savings", "nest savings calculator", "programmable thermostat", "energy savings thermostat", "hvac cost reduction"],
  [
    '{ name: "monthlyHvac", label: "Monthly HVAC Cost ($)", type: "number", min: 20, max: 800, defaultValue: 150 }',
    '{ name: "climateZone", label: "Climate Zone", type: "select", options: [{ value: "1", label: "Hot (cooling dominant)" }, { value: "2", label: "Mixed (heating and cooling)" }, { value: "3", label: "Cold (heating dominant)" }], defaultValue: "2" }',
    '{ name: "awayHours", label: "Hours Away From Home Daily", type: "number", min: 0, max: 16, defaultValue: 9 }',
    '{ name: "thermostatCost", label: "Smart Thermostat Cost ($)", type: "number", min: 50, max: 500, defaultValue: 200 }',
    '{ name: "currentType", label: "Current Thermostat Type", type: "select", options: [{ value: "1", label: "Manual (non-programmable)" }, { value: "2", label: "Basic Programmable" }, { value: "3", label: "Already Smart" }], defaultValue: "1" }'
  ],
  `(inputs) => {
    const monthlyHvac = inputs.monthlyHvac as number;
    const zone = parseInt(inputs.climateZone as string);
    const awayHours = inputs.awayHours as number;
    const thermostatCost = inputs.thermostatCost as number;
    const currentType = parseInt(inputs.currentType as string);
    const annualHvac = monthlyHvac * 12;
    const baseSavingsRate = { 1: 0.15, 2: 0.12, 3: 0.10 };
    const typeMultiplier = { 1: 1.0, 2: 0.6, 3: 0.15 };
    const awayBonus = (awayHours / 24) * 0.08;
    const savingsRate = ((baseSavingsRate[zone] || 0.12) + awayBonus) * (typeMultiplier[currentType] || 1.0);
    const annualSavings = Math.round(annualHvac * savingsRate);
    const monthlySavings = Math.round(annualSavings / 12);
    const paybackMonths = Math.round(thermostatCost / monthlySavings);
    const fiveYearSavings = annualSavings * 5 - thermostatCost;
    return {
      primary: { label: "Estimated Annual Savings", value: "$" + formatNumber(annualSavings) },
      details: [
        { label: "Monthly Savings", value: "$" + formatNumber(monthlySavings) },
        { label: "Payback Period", value: formatNumber(paybackMonths) + " months" },
        { label: "5-Year Net Savings", value: "$" + formatNumber(fiveYearSavings) },
        { label: "Savings Rate", value: formatNumber(Math.round(savingsRate * 100)) + "%" }
      ]
    };
  }`,
  [
    "Q: How much can a smart thermostat save?||A: Studies show smart thermostats save 10-15 percent on heating and 12-15 percent on cooling costs. The average household saves $100-150 per year, though savings depend on climate, usage habits, and home insulation.",
    "Q: How long does it take for a smart thermostat to pay for itself?||A: Most smart thermostats pay for themselves in 12 to 24 months through energy savings. Homes with higher HVAC costs and longer away-from-home periods see faster payback.",
    "Q: Do smart thermostats work with all HVAC systems?||A: Most smart thermostats are compatible with common HVAC systems including central forced air, heat pumps, and radiant heating. Check compatibility with your specific system before purchasing."
  ],
  `Annual Savings = Annual HVAC Cost x (Base Savings Rate + Away Bonus) x Type Multiplier\nPayback Period = Thermostat Cost / Monthly Savings\n5-Year Net = Annual Savings x 5 - Thermostat Cost`,
  ["electric-bill-device-cost-calculator", "ups-runtime-calculator"]
);

add(
  "security-camera-storage-calculator",
  "Security Camera Storage Calculator",
  "Calculate the storage space required for security camera footage based on number of cameras, resolution, frame rate, and retention period.",
  "Everyday",
  "everyday",
  "~",
  ["security camera storage", "cctv storage calculator", "surveillance storage", "ip camera hard drive", "nvr storage calculator"],
  [
    '{ name: "numCameras", label: "Number of Cameras", type: "number", min: 1, max: 64, defaultValue: 4 }',
    '{ name: "resolution", label: "Camera Resolution", type: "select", options: [{ value: "0.75", label: "1080p (2 MP)" }, { value: "1.5", label: "2K (4 MP)" }, { value: "3", label: "4K (8 MP)" }, { value: "0.3", label: "720p (1 MP)" }], defaultValue: "0.75" }',
    '{ name: "fps", label: "Frame Rate (FPS)", type: "number", min: 1, max: 30, defaultValue: 15 }',
    '{ name: "recordHours", label: "Recording Hours Per Day", type: "number", min: 1, max: 24, defaultValue: 24 }',
    '{ name: "retentionDays", label: "Retention Period (Days)", type: "number", min: 1, max: 365, defaultValue: 30 }',
    '{ name: "compression", label: "Compression", type: "select", options: [{ value: "1", label: "H.264 (Standard)" }, { value: "0.5", label: "H.265 (Efficient)" }], defaultValue: "1" }'
  ],
  `(inputs) => {
    const cameras = inputs.numCameras as number;
    const mbPerHour = parseFloat(inputs.resolution as string);
    const fps = inputs.fps as number;
    const hours = inputs.recordHours as number;
    const days = inputs.retentionDays as number;
    const compressionFactor = parseFloat(inputs.compression as string);
    const gbPerCamPerHour = mbPerHour * (fps / 15) * compressionFactor;
    const dailyPerCam = gbPerCamPerHour * hours;
    const dailyTotal = dailyPerCam * cameras;
    const totalStorage = dailyTotal * days;
    const totalTB = totalStorage / 1000;
    const recommendedDrives = Math.ceil(totalTB / 4);
    return {
      primary: { label: "Total Storage Needed", value: formatNumber(Math.round(totalStorage)) + " GB" },
      details: [
        { label: "Storage in TB", value: formatNumber(Math.round(totalTB * 100) / 100) + " TB" },
        { label: "Daily Usage (All Cameras)", value: formatNumber(Math.round(dailyTotal * 10) / 10) + " GB/day" },
        { label: "Per Camera Per Day", value: formatNumber(Math.round(dailyPerCam * 10) / 10) + " GB" },
        { label: "Recommended 4TB Drives", value: formatNumber(recommendedDrives) }
      ]
    };
  }`,
  [
    "Q: How much storage do security cameras need?||A: A single 1080p camera recording 24/7 at 15 FPS with H.264 uses about 18 GB per day or 540 GB per month. Higher resolutions and frame rates increase storage needs proportionally.",
    "Q: Should I use H.264 or H.265 compression?||A: H.265 reduces file sizes by approximately 50 percent compared to H.264 with similar quality. Most modern cameras and NVRs support H.265, making it the recommended choice for storage efficiency.",
    "Q: How long should I keep security footage?||A: Most home users keep 7-30 days of footage. Businesses often retain 30-90 days. Legal or compliance requirements may mandate specific retention periods in some industries."
  ],
  `Daily Storage = GB/hour x (FPS/15) x Compression Factor x Hours x Cameras\nTotal Storage = Daily Storage x Retention Days\nGB/hour based on resolution: 1080p = 0.75 GB, 4K = 3 GB`,
  ["nas-drive-cost-calculator", "wireless-router-range-calculator"]
);

add(
  "nas-drive-cost-calculator",
  "NAS Drive Cost Calculator",
  "Estimate the total cost and usable storage of a NAS (Network Attached Storage) setup including drive costs, RAID configuration, and enclosure pricing.",
  "Finance",
  "finance",
  "$",
  ["nas cost calculator", "network storage cost", "raid storage calculator", "nas setup price", "home server storage"],
  [
    '{ name: "numDrives", label: "Number of Drives", type: "number", min: 1, max: 12, defaultValue: 4 }',
    '{ name: "driveSize", label: "Drive Size (TB)", type: "number", min: 1, max: 24, defaultValue: 8 }',
    '{ name: "driveCost", label: "Cost Per Drive ($)", type: "number", min: 30, max: 800, defaultValue: 180 }',
    '{ name: "raidType", label: "RAID Configuration", type: "select", options: [{ value: "0", label: "RAID 0 (No redundancy)" }, { value: "1", label: "RAID 1 (Mirror)" }, { value: "5", label: "RAID 5 (Single parity)" }, { value: "6", label: "RAID 6 (Double parity)" }, { value: "10", label: "RAID 10 (Striped mirrors)" }], defaultValue: "5" }',
    '{ name: "enclosureCost", label: "NAS Enclosure Cost ($)", type: "number", min: 100, max: 3000, defaultValue: 350 }'
  ],
  `(inputs) => {
    const numDrives = inputs.numDrives as number;
    const driveSize = inputs.driveSize as number;
    const driveCost = inputs.driveCost as number;
    const raid = parseInt(inputs.raidType as string);
    const enclosure = inputs.enclosureCost as number;
    const totalRaw = numDrives * driveSize;
    var usable = totalRaw;
    var raidLabel = "None";
    if (raid === 0) { usable = totalRaw; raidLabel = "RAID 0 - No redundancy"; }
    else if (raid === 1) { usable = totalRaw / 2; raidLabel = "RAID 1 - Mirrored"; }
    else if (raid === 5) { usable = (numDrives - 1) * driveSize; raidLabel = "RAID 5 - Single parity"; }
    else if (raid === 6) { usable = (numDrives - 2) * driveSize; raidLabel = "RAID 6 - Double parity"; }
    else if (raid === 10) { usable = totalRaw / 2; raidLabel = "RAID 10 - Striped mirrors"; }
    const totalDriveCost = numDrives * driveCost;
    const totalCost = totalDriveCost + enclosure;
    const costPerTB = usable > 0 ? totalCost / usable : 0;
    const redundancy = totalRaw - usable;
    return {
      primary: { label: "Usable Storage", value: formatNumber(Math.round(usable)) + " TB" },
      details: [
        { label: "Total Raw Storage", value: formatNumber(totalRaw) + " TB" },
        { label: "Redundancy Overhead", value: formatNumber(Math.round(redundancy)) + " TB" },
        { label: "Total System Cost", value: "$" + formatNumber(Math.round(totalCost)) },
        { label: "Cost Per Usable TB", value: "$" + formatNumber(Math.round(costPerTB)) },
        { label: "RAID Type", value: raidLabel }
      ]
    };
  }`,
  [
    "Q: What RAID level should I use for a home NAS?||A: RAID 5 is the most popular choice for home NAS with 3 or more drives, offering a good balance of performance, capacity, and single-drive fault tolerance. RAID 1 is ideal for 2-drive setups.",
    "Q: How much does a NAS setup cost?||A: A basic 2-bay NAS starts around $300-500 total. A 4-bay NAS with 8TB drives in RAID 5 providing 24TB usable typically costs $1000-1400 including the enclosure and drives.",
    "Q: Should I use NAS-rated drives?||A: Yes. NAS-rated drives like WD Red or Seagate IronWolf are designed for 24/7 operation, vibration tolerance, and multi-drive environments. Consumer desktop drives may fail prematurely in a NAS."
  ],
  `Usable Storage (RAID 5) = (Number of Drives - 1) x Drive Size\nUsable Storage (RAID 1/10) = Total Raw / 2\nCost Per TB = Total Cost / Usable Storage`,
  ["ssd-cost-per-gb-calculator", "security-camera-storage-calculator"]
);

add(
  "printer-ink-cost-calculator",
  "Printer Ink Cost Per Page Calculator",
  "Calculate the true cost per page of inkjet printing based on cartridge prices, page yields, and paper costs to track your printing expenses.",
  "Finance",
  "finance",
  "$",
  ["printer ink cost", "inkjet cost per page", "ink cartridge cost", "printing cost calculator", "ink cost comparison"],
  [
    '{ name: "blackInkCost", label: "Black Ink Cartridge Cost ($)", type: "number", min: 5, max: 100, defaultValue: 25 }',
    '{ name: "blackYield", label: "Black Ink Page Yield", type: "number", min: 100, max: 5000, defaultValue: 500 }',
    '{ name: "colorInkCost", label: "Color Ink Set Cost ($)", type: "number", min: 10, max: 200, defaultValue: 45 }',
    '{ name: "colorYield", label: "Color Ink Page Yield", type: "number", min: 100, max: 5000, defaultValue: 300 }',
    '{ name: "colorPercent", label: "Percentage of Color Prints (%)", type: "number", min: 0, max: 100, defaultValue: 30 }',
    '{ name: "pagesPerMonth", label: "Pages Per Month", type: "number", min: 10, max: 5000, defaultValue: 200 }'
  ],
  `(inputs) => {
    const blackCost = inputs.blackInkCost as number;
    const blackYield = inputs.blackYield as number;
    const colorCost = inputs.colorInkCost as number;
    const colorYield = inputs.colorYield as number;
    const colorPct = inputs.colorPercent as number / 100;
    const pagesMonth = inputs.pagesPerMonth as number;
    const blackPerPage = blackCost / blackYield;
    const colorPerPage = colorCost / colorYield;
    const paperPerPage = 0.012;
    const bwCostPerPage = blackPerPage + paperPerPage;
    const colorCostPerPage = blackPerPage + colorPerPage + paperPerPage;
    const blendedCost = bwCostPerPage * (1 - colorPct) + colorCostPerPage * colorPct;
    const monthlyCost = blendedCost * pagesMonth;
    const annualCost = monthlyCost * 12;
    const blackCartridgesYear = Math.ceil((pagesMonth * 12) / blackYield);
    return {
      primary: { label: "Blended Cost Per Page", value: "$" + formatNumber(Math.round(blendedCost * 10000) / 10000) },
      details: [
        { label: "B/W Only Cost Per Page", value: "$" + formatNumber(Math.round(bwCostPerPage * 10000) / 10000) },
        { label: "Color Cost Per Page", value: "$" + formatNumber(Math.round(colorCostPerPage * 10000) / 10000) },
        { label: "Monthly Printing Cost", value: "$" + formatNumber(Math.round(monthlyCost * 100) / 100) },
        { label: "Annual Printing Cost", value: "$" + formatNumber(Math.round(annualCost * 100) / 100) },
        { label: "Black Cartridges Per Year", value: formatNumber(blackCartridgesYear) }
      ]
    };
  }`,
  [
    "Q: How much does printer ink cost per page?||A: Inkjet printing typically costs $0.05 to $0.10 per black-and-white page and $0.15 to $0.25 per color page. Ink tank printers can reduce this to $0.01 per page or less.",
    "Q: Why is printer ink so expensive?||A: Printer manufacturers sell printers at low margins and profit from ink sales. Third-party and refilled cartridges cost significantly less. Ink tank (supertank) printers offer the lowest per-page costs.",
    "Q: How can I reduce my printing costs?||A: Use draft mode for non-critical prints, print in black and white when color is not needed, use third-party ink, and consider an ink tank printer if you print frequently."
  ],
  `Blended Cost = BW Cost x (1 - Color%) + Color Cost x Color%\nBW Cost/Page = Black Ink/Yield + Paper Cost\nColor Cost/Page = Black Ink/Yield + Color Ink/Yield + Paper Cost`,
  ["laser-printer-cost-per-page-calculator", "3d-printer-filament-cost-calculator"]
);

add(
  "e-reader-battery-calculator",
  "E-Reader Battery Life Calculator",
  "Estimate how long your e-reader battery will last based on reading habits, screen type, backlight usage, and Wi-Fi connectivity.",
  "Everyday",
  "everyday",
  "~",
  ["e-reader battery life", "kindle battery calculator", "e-ink battery", "ebook reader battery", "reading device battery"],
  [
    '{ name: "batteryMah", label: "Battery Capacity (mAh)", type: "number", min: 500, max: 5000, defaultValue: 1700 }',
    '{ name: "readingHoursPerDay", label: "Reading Hours Per Day", type: "number", min: 0.5, max: 12, defaultValue: 2 }',
    '{ name: "pagesPerHour", label: "Page Turns Per Hour", type: "number", min: 10, max: 120, defaultValue: 40 }',
    '{ name: "backlightLevel", label: "Backlight Level", type: "select", options: [{ value: "0", label: "Off" }, { value: "1", label: "Low" }, { value: "2", label: "Medium" }, { value: "3", label: "High" }], defaultValue: "1" }',
    '{ name: "wifiOn", label: "Wi-Fi", type: "select", options: [{ value: "0", label: "Off" }, { value: "1", label: "On" }], defaultValue: "0" }'
  ],
  `(inputs) => {
    const battery = inputs.batteryMah as number;
    const hoursPerDay = inputs.readingHoursPerDay as number;
    const pagesPerHour = inputs.pagesPerHour as number;
    const backlight = parseInt(inputs.backlightLevel as string);
    const wifi = parseInt(inputs.wifiOn as string);
    const baseDraw = 0.01;
    const pageRefreshDraw = pagesPerHour * 0.0003;
    const backlightDraw = { 0: 0, 1: 0.02, 2: 0.05, 3: 0.10 };
    const wifiDraw = wifi === 1 ? 0.04 : 0;
    const totalDrawMa = (baseDraw + pageRefreshDraw + (backlightDraw[backlight] || 0) + wifiDraw) * 1000;
    const totalReadingHours = battery / totalDrawMa;
    const daysOfReading = totalReadingHours / hoursPerDay;
    const weeksOfReading = daysOfReading / 7;
    const totalPages = Math.round(totalReadingHours * pagesPerHour);
    return {
      primary: { label: "Battery Life", value: formatNumber(Math.round(daysOfReading)) + " days" },
      details: [
        { label: "Total Reading Hours", value: formatNumber(Math.round(totalReadingHours)) + " hours" },
        { label: "Weeks of Reading", value: formatNumber(Math.round(weeksOfReading * 10) / 10) },
        { label: "Pages Before Recharge", value: formatNumber(totalPages) },
        { label: "Power Draw", value: formatNumber(Math.round(totalDrawMa * 10) / 10) + " mA" }
      ]
    };
  }`,
  [
    "Q: How long does a Kindle battery last?||A: With Wi-Fi off and backlight on low, most Kindle models last 4-6 weeks with 30 minutes of daily reading. Heavier readers with high backlight may get 2-3 weeks between charges.",
    "Q: Does the backlight drain the battery faster?||A: Yes. E-ink displays use almost no power for static pages, so the backlight is the biggest battery drain. Turning it off or using low settings dramatically extends battery life.",
    "Q: Should I leave Wi-Fi on my e-reader?||A: Turn Wi-Fi off when not downloading books. Wi-Fi continuously searching for signals drains battery. Enable it only when syncing or purchasing new content."
  ],
  `Total Draw = Base + Page Refresh + Backlight + Wi-Fi (in mA)\nReading Hours = Battery (mAh) / Total Draw (mA)\nDays = Reading Hours / Daily Reading Hours`,
  ["phone-battery-health-calculator", "wireless-charger-efficiency-calculator"]
);

add(
  "wireless-charger-efficiency-calculator",
  "Wireless Charger Efficiency Calculator",
  "Calculate the energy efficiency and cost overhead of wireless charging compared to wired charging for your devices.",
  "Everyday",
  "everyday",
  "~",
  ["wireless charging efficiency", "qi charger energy loss", "wireless vs wired charging", "inductive charging cost", "wireless charger waste"],
  [
    '{ name: "batteryCapacity", label: "Device Battery (mAh)", type: "number", min: 1000, max: 10000, defaultValue: 4500 }',
    '{ name: "batteryVoltage", label: "Battery Voltage (V)", type: "number", min: 3.0, max: 5.0, defaultValue: 3.85 }',
    '{ name: "wirelessEfficiency", label: "Wireless Charging Efficiency (%)", type: "number", min: 50, max: 95, defaultValue: 75 }',
    '{ name: "chargesPerWeek", label: "Charges Per Week", type: "number", min: 1, max: 14, defaultValue: 7 }',
    '{ name: "electricRate", label: "Electricity Rate ($/kWh)", type: "number", min: 0.05, max: 0.60, defaultValue: 0.13 }'
  ],
  `(inputs) => {
    const battery = inputs.batteryCapacity as number;
    const voltage = inputs.batteryVoltage as number;
    const efficiency = inputs.wirelessEfficiency as number / 100;
    const chargesWeek = inputs.chargesPerWeek as number;
    const rate = inputs.electricRate as number;
    const batteryWh = battery * voltage / 1000;
    const wiredEnergy = batteryWh / 0.92;
    const wirelessEnergy = batteryWh / efficiency;
    const wastedPerCharge = wirelessEnergy - wiredEnergy;
    const weeklyWaste = wastedPerCharge * chargesWeek;
    const annualWasteKwh = weeklyWaste * 52 / 1000;
    const annualExtraCost = annualWasteKwh * rate;
    const wiredAnnualKwh = wiredEnergy * chargesWeek * 52 / 1000;
    const wirelessAnnualKwh = wirelessEnergy * chargesWeek * 52 / 1000;
    return {
      primary: { label: "Energy Wasted Per Charge", value: formatNumber(Math.round(wastedPerCharge * 100) / 100) + " Wh" },
      details: [
        { label: "Wireless Energy Per Charge", value: formatNumber(Math.round(wirelessEnergy * 100) / 100) + " Wh" },
        { label: "Wired Energy Per Charge", value: formatNumber(Math.round(wiredEnergy * 100) / 100) + " Wh" },
        { label: "Annual Extra Energy", value: formatNumber(Math.round(annualWasteKwh * 100) / 100) + " kWh" },
        { label: "Annual Extra Cost", value: "$" + formatNumber(Math.round(annualExtraCost * 100) / 100) }
      ]
    };
  }`,
  [
    "Q: How efficient is wireless charging?||A: Most Qi wireless chargers operate at 70-80 percent efficiency, meaning 20-30 percent of energy is lost as heat. Wired charging is about 90-95 percent efficient.",
    "Q: Does wireless charging waste a lot of electricity?||A: The extra energy cost is minimal, typically $1-3 per year for daily smartphone charging. The convenience often outweighs the small efficiency loss.",
    "Q: Does wireless charging damage battery health?||A: The heat generated by wireless charging can slightly accelerate battery degradation over time. Using well-aligned, quality chargers that minimize heat helps preserve battery health."
  ],
  `Energy Per Charge (Wireless) = Battery Wh / Wireless Efficiency\nEnergy Per Charge (Wired) = Battery Wh / 0.92\nWasted Per Charge = Wireless Energy - Wired Energy\nAnnual Extra Cost = Weekly Waste x 52 / 1000 x Rate`,
  ["phone-battery-health-calculator", "e-reader-battery-calculator", "electric-bill-device-cost-calculator"]
);

add(
  "bluetooth-range-estimator-calculator",
  "Bluetooth Range Estimator Calculator",
  "Estimate the effective Bluetooth range between devices based on Bluetooth version, transmit power, environment, and obstacles.",
  "Everyday",
  "everyday",
  "~",
  ["bluetooth range estimator", "bluetooth distance calculator", "bluetooth signal range", "bt range", "wireless range calculator"],
  [
    '{ name: "btVersion", label: "Bluetooth Version", type: "select", options: [{ value: "1", label: "Bluetooth 4.0 / 4.2 (BLE)" }, { value: "2", label: "Bluetooth 5.0" }, { value: "3", label: "Bluetooth 5.1 / 5.2" }, { value: "4", label: "Bluetooth 5.3+" }], defaultValue: "2" }',
    '{ name: "powerClass", label: "Power Class", type: "select", options: [{ value: "1", label: "Class 1 (100m max)" }, { value: "2", label: "Class 2 (10m max)" }, { value: "3", label: "Class 3 (1m max)" }], defaultValue: "2" }',
    '{ name: "environment", label: "Environment", type: "select", options: [{ value: "1", label: "Open Outdoor" }, { value: "2", label: "Indoor (few walls)" }, { value: "3", label: "Indoor (many walls)" }, { value: "4", label: "Crowded/Urban" }], defaultValue: "2" }',
    '{ name: "obstacles", label: "Number of Walls/Obstacles", type: "number", min: 0, max: 10, defaultValue: 1 }'
  ],
  `(inputs) => {
    const version = parseInt(inputs.btVersion as string);
    const powerClass = parseInt(inputs.powerClass as string);
    const env = parseInt(inputs.environment as string);
    const obstacles = inputs.obstacles as number;
    const maxRange = { 1: 100, 2: 10, 3: 1 };
    const versionMultiplier = { 1: 1.0, 2: 4.0, 3: 4.0, 4: 4.0 };
    const envFactor = { 1: 1.0, 2: 0.5, 3: 0.25, 4: 0.3 };
    const baseRange = (maxRange[powerClass] || 10) * (versionMultiplier[version] || 1.0);
    const effectiveRange = Math.round(baseRange * (envFactor[env] || 0.5) * Math.pow(0.7, obstacles));
    const signalQuality = effectiveRange > 20 ? "Strong" : effectiveRange > 8 ? "Good" : effectiveRange > 3 ? "Fair" : "Weak";
    const dataRate = version >= 2 ? "2 Mbps" : "1 Mbps";
    return {
      primary: { label: "Effective Range", value: formatNumber(effectiveRange) + " meters" },
      details: [
        { label: "Max Theoretical Range", value: formatNumber(Math.round(baseRange)) + " meters" },
        { label: "Signal Quality", value: signalQuality },
        { label: "Max Data Rate", value: dataRate },
        { label: "Range in Feet", value: formatNumber(Math.round(effectiveRange * 3.281)) + " feet" }
      ]
    };
  }`,
  [
    "Q: How far does Bluetooth 5.0 reach?||A: Bluetooth 5.0 Class 2 has a theoretical range of 40 meters (130 feet) outdoors. Indoors with walls and interference, expect 10-20 meters (30-65 feet) of reliable range.",
    "Q: Why does Bluetooth keep disconnecting?||A: Common causes include distance beyond effective range, walls and obstacles, interference from Wi-Fi and other 2.4 GHz devices, low battery on either device, and outdated Bluetooth versions.",
    "Q: Does Bluetooth version affect range?||A: Yes. Bluetooth 5.0 and later versions offer up to 4 times the range of Bluetooth 4.2 in ideal conditions. However, both devices need to support the newer version to benefit."
  ],
  `Effective Range = Max Range x Version Multiplier x Environment Factor x 0.7^Obstacles\nMax Range: Class 1 = 100m, Class 2 = 10m, Class 3 = 1m\nBT 5.0+ multiplies range by 4x`,
  ["wireless-router-range-calculator", "wireless-charger-efficiency-calculator"]
);

add(
  "data-transfer-time-calculator",
  "Data Transfer Time Calculator",
  "Calculate the time required to transfer files over various network connections including Ethernet, Wi-Fi, and internet speeds.",
  "Everyday",
  "everyday",
  "~",
  ["data transfer time", "file transfer calculator", "download time calculator", "upload time estimator", "network transfer speed"],
  [
    '{ name: "fileSize", label: "File Size", type: "number", min: 1, max: 100000, defaultValue: 1000 }',
    '{ name: "sizeUnit", label: "Size Unit", type: "select", options: [{ value: "1", label: "MB" }, { value: "1024", label: "GB" }, { value: "1048576", label: "TB" }], defaultValue: "1024" }',
    '{ name: "connectionSpeed", label: "Connection Speed (Mbps)", type: "number", min: 1, max: 10000, defaultValue: 100 }',
    '{ name: "overhead", label: "Protocol Overhead (%)", type: "number", min: 0, max: 50, defaultValue: 15 }'
  ],
  `(inputs) => {
    const fileSize = inputs.fileSize as number;
    const sizeMultiplier = inputs.sizeUnit as number;
    const speedMbps = inputs.connectionSpeed as number;
    const overhead = inputs.overhead as number / 100;
    const fileSizeMB = fileSize * sizeMultiplier;
    const fileSizeGb = fileSizeMB / 1024;
    const effectiveSpeedMbps = speedMbps * (1 - overhead);
    const effectiveSpeedMBps = effectiveSpeedMbps / 8;
    const transferSeconds = fileSizeMB / effectiveSpeedMBps;
    const hours = Math.floor(transferSeconds / 3600);
    const minutes = Math.floor((transferSeconds % 3600) / 60);
    const seconds = Math.round(transferSeconds % 60);
    const timeStr = hours > 0 ? hours + "h " + minutes + "m " + seconds + "s" : minutes > 0 ? minutes + "m " + seconds + "s" : seconds + "s";
    return {
      primary: { label: "Transfer Time", value: timeStr },
      details: [
        { label: "File Size", value: formatNumber(Math.round(fileSizeMB)) + " MB (" + formatNumber(Math.round(fileSizeGb * 100) / 100) + " GB)" },
        { label: "Effective Speed", value: formatNumber(Math.round(effectiveSpeedMBps * 100) / 100) + " MB/s" },
        { label: "Effective Speed (Mbps)", value: formatNumber(Math.round(effectiveSpeedMbps)) + " Mbps" },
        { label: "Total Seconds", value: formatNumber(Math.round(transferSeconds)) }
      ]
    };
  }`,
  [
    "Q: How long does it take to download 1 GB?||A: At 100 Mbps it takes about 80 seconds. At 50 Mbps about 2.5 minutes. At 25 Mbps about 5 minutes. Real-world speeds are typically 10-20 percent slower than advertised due to overhead.",
    "Q: Why is my transfer slower than my internet speed?||A: Internet speeds are measured in megabits per second (Mbps) while files are measured in megabytes (MB). Divide Mbps by 8 to get MB/s. Protocol overhead, network congestion, and server limits also reduce speeds.",
    "Q: What internet speed do I need for large file transfers?||A: For occasional large transfers, 100 Mbps is adequate. For frequent multi-gigabyte transfers, 500 Mbps or gigabit speeds significantly reduce wait times."
  ],
  `Transfer Time = File Size (MB) / Effective Speed (MB/s)\nEffective Speed = Connection Speed x (1 - Overhead%) / 8\nFile Size (MB) = File Size x Unit Multiplier`,
  ["usb-transfer-speed-calculator", "screen-resolution-comparison-calculator"]
);

add(
  "screen-resolution-comparison-calculator",
  "Screen Resolution Comparison Calculator",
  "Compare screen resolutions by calculating total pixels, pixel density, and aspect ratios to understand the difference between display standards.",
  "Everyday",
  "everyday",
  "~",
  ["screen resolution comparison", "display resolution calculator", "pixel density comparison", "4k vs 1080p", "monitor resolution"],
  [
    '{ name: "width1", label: "Resolution 1 - Width (px)", type: "number", min: 320, max: 15360, defaultValue: 1920 }',
    '{ name: "height1", label: "Resolution 1 - Height (px)", type: "number", min: 240, max: 8640, defaultValue: 1080 }',
    '{ name: "width2", label: "Resolution 2 - Width (px)", type: "number", min: 320, max: 15360, defaultValue: 3840 }',
    '{ name: "height2", label: "Resolution 2 - Height (px)", type: "number", min: 240, max: 8640, defaultValue: 2160 }',
    '{ name: "screenSize", label: "Screen Size (inches)", type: "number", min: 5, max: 100, defaultValue: 27 }'
  ],
  `(inputs) => {
    const w1 = inputs.width1 as number;
    const h1 = inputs.height1 as number;
    const w2 = inputs.width2 as number;
    const h2 = inputs.height2 as number;
    const size = inputs.screenSize as number;
    const pixels1 = w1 * h1;
    const pixels2 = w2 * h2;
    const diag1 = Math.sqrt(w1 * w1 + h1 * h1);
    const diag2 = Math.sqrt(w2 * w2 + h2 * h2);
    const ppi1 = Math.round(diag1 / size);
    const ppi2 = Math.round(diag2 / size);
    const pixelRatio = Math.round((pixels2 / pixels1) * 100) / 100;
    const ppiDiff = ppi2 - ppi1;
    return {
      primary: { label: "Pixel Count Ratio", value: formatNumber(pixelRatio) + "x more pixels" },
      details: [
        { label: "Resolution 1 Total Pixels", value: formatNumber(pixels1) },
        { label: "Resolution 2 Total Pixels", value: formatNumber(pixels2) },
        { label: "PPI at " + size + " inches (Res 1)", value: formatNumber(ppi1) + " PPI" },
        { label: "PPI at " + size + " inches (Res 2)", value: formatNumber(ppi2) + " PPI" },
        { label: "PPI Difference", value: "+" + formatNumber(ppiDiff) + " PPI" }
      ]
    };
  }`,
  [
    "Q: What is the difference between 1080p and 4K?||A: 4K (3840x2160) has exactly 4 times the pixels of 1080p (1920x1080). This means sharper text, more screen real estate, and finer detail, especially noticeable on larger displays.",
    "Q: What PPI is considered retina quality?||A: Apple defines retina as roughly 220+ PPI for typical viewing distances. At normal monitor viewing distance, 110+ PPI is good and 163+ PPI provides excellent sharpness.",
    "Q: Does higher resolution use more GPU power?||A: Yes. Doubling the resolution roughly quadruples the number of pixels the GPU must render, requiring significantly more graphics processing power for gaming and video playback."
  ],
  `Total Pixels = Width x Height\nPPI = Diagonal Pixels / Screen Size (inches)\nDiagonal Pixels = sqrt(Width^2 + Height^2)\nPixel Ratio = Resolution 2 Pixels / Resolution 1 Pixels`,
  ["monitor-size-distance-calculator", "tv-viewing-distance-calculator"]
);

add(
  "phone-battery-health-calculator",
  "Phone Battery Health Calculator",
  "Estimate your phone battery degradation and remaining capacity based on charge cycles, age, and usage patterns.",
  "Everyday",
  "everyday",
  "~",
  ["phone battery health", "battery degradation calculator", "battery cycle count", "phone battery capacity", "battery lifespan"],
  [
    '{ name: "originalCapacity", label: "Original Battery Capacity (mAh)", type: "number", min: 1000, max: 10000, defaultValue: 4500 }',
    '{ name: "phoneAge", label: "Phone Age (Months)", type: "number", min: 1, max: 72, defaultValue: 24 }',
    '{ name: "chargesPerDay", label: "Charges Per Day (Avg)", type: "number", min: 0.3, max: 3, defaultValue: 1 }',
    '{ name: "chargingHabit", label: "Typical Charging Range", type: "select", options: [{ value: "1", label: "0-100% (Full cycles)" }, { value: "2", label: "20-80% (Optimal)" }, { value: "3", label: "10-90% (Moderate)" }, { value: "4", label: "0-100% with fast charge" }], defaultValue: "1" }',
    '{ name: "fastCharging", label: "Uses Fast Charging", type: "select", options: [{ value: "0", label: "No" }, { value: "1", label: "Yes" }], defaultValue: "1" }'
  ],
  `(inputs) => {
    const original = inputs.originalCapacity as number;
    const ageMonths = inputs.phoneAge as number;
    const chargesDay = inputs.chargesPerDay as number;
    const habit = parseInt(inputs.chargingHabit as string);
    const fastCharge = parseInt(inputs.fastCharging as string);
    const totalCycles = Math.round(chargesDay * ageMonths * 30.44);
    const habitWear = { 1: 1.0, 2: 0.5, 3: 0.7, 4: 1.3 };
    const fastChargeWear = fastCharge === 1 ? 1.15 : 1.0;
    const effectiveCycles = totalCycles * (habitWear[habit] || 1.0) * fastChargeWear;
    const degradation = Math.min(effectiveCycles * 0.04, 50);
    const healthPercent = Math.round(100 - degradation);
    const currentCapacity = Math.round(original * healthPercent / 100);
    const cyclesTo80 = Math.round(800 / ((habitWear[habit] || 1.0) * fastChargeWear));
    const monthsTo80 = Math.round(cyclesTo80 / (chargesDay * 30.44));
    return {
      primary: { label: "Estimated Battery Health", value: formatNumber(healthPercent) + "%" },
      details: [
        { label: "Current Capacity", value: formatNumber(currentCapacity) + " mAh" },
        { label: "Capacity Lost", value: formatNumber(original - currentCapacity) + " mAh" },
        { label: "Estimated Charge Cycles", value: formatNumber(totalCycles) },
        { label: "Months Until 80% Health", value: monthsTo80 > ageMonths ? formatNumber(monthsTo80 - ageMonths) + " months remaining" : "Already below 80%" }
      ]
    };
  }`,
  [
    "Q: How long does a phone battery last before degrading?||A: Most lithium-ion phone batteries retain 80 percent of their original capacity after 500-800 charge cycles, typically 2-3 years of normal use. Battery health degrades gradually over time.",
    "Q: Does fast charging damage the battery?||A: Fast charging generates more heat which can slightly accelerate battery degradation over time. The impact is roughly 10-15 percent more wear compared to standard charging.",
    "Q: What is the best way to charge a phone for battery longevity?||A: Keep the battery between 20-80 percent, avoid overnight full charges when possible, use standard speed charging, and keep the phone cool during charging."
  ],
  `Health % = 100 - (Effective Cycles x 0.04)\nEffective Cycles = Total Cycles x Habit Wear x Fast Charge Wear\nTotal Cycles = Charges/Day x Age (months) x 30.44`,
  ["e-reader-battery-calculator", "wireless-charger-efficiency-calculator", "smartphone-screen-repair-cost-calculator"]
);

add(
  "tv-viewing-distance-calculator",
  "TV Viewing Distance Calculator",
  "Calculate the ideal viewing distance for your TV based on screen size and resolution for the most immersive and comfortable viewing experience.",
  "Everyday",
  "everyday",
  "~",
  ["tv viewing distance", "tv size distance calculator", "ideal tv distance", "screen distance recommendation", "tv placement guide"],
  [
    '{ name: "tvSize", label: "TV Screen Size (inches)", type: "number", min: 32, max: 120, defaultValue: 55 }',
    '{ name: "resolution", label: "TV Resolution", type: "select", options: [{ value: "1", label: "1080p (Full HD)" }, { value: "2", label: "4K (Ultra HD)" }, { value: "3", label: "8K" }, { value: "4", label: "720p" }], defaultValue: "2" }',
    '{ name: "usage", label: "Primary Usage", type: "select", options: [{ value: "1", label: "Movies and TV Shows" }, { value: "2", label: "Sports" }, { value: "3", label: "Gaming" }, { value: "4", label: "Mixed Use" }], defaultValue: "4" }',
    '{ name: "roomWidth", label: "Room Width (feet)", type: "number", min: 5, max: 40, defaultValue: 14 }'
  ],
  `(inputs) => {
    const tvSize = inputs.tvSize as number;
    const res = parseInt(inputs.resolution as string);
    const usage = parseInt(inputs.usage as string);
    const roomWidth = inputs.roomWidth as number;
    const resMultiplier = { 1: 1.6, 2: 1.0, 3: 0.75, 4: 2.0 };
    const usageMultiplier = { 1: 1.0, 2: 1.1, 3: 0.85, 4: 1.0 };
    const minDistFeet = Math.round((tvSize * (resMultiplier[res] || 1.0) * (usageMultiplier[usage] || 1.0)) / 12 * 10) / 10;
    const maxDistFeet = Math.round(minDistFeet * 1.6 * 10) / 10;
    const optimalFeet = Math.round((minDistFeet + maxDistFeet) / 2 * 10) / 10;
    const fitsRoom = optimalFeet <= roomWidth * 0.8;
    const idealTvSize = Math.round(roomWidth * 0.8 * 12 / ((resMultiplier[res] || 1.0) * (usageMultiplier[usage] || 1.0)));
    return {
      primary: { label: "Optimal Viewing Distance", value: formatNumber(optimalFeet) + " feet" },
      details: [
        { label: "Minimum Distance", value: formatNumber(minDistFeet) + " feet" },
        { label: "Maximum Distance", value: formatNumber(maxDistFeet) + " feet" },
        { label: "Fits Your Room", value: fitsRoom ? "Yes - good fit" : "No - TV may be too large" },
        { label: "Ideal TV Size for Room", value: formatNumber(idealTvSize) + " inches" }
      ]
    };
  }`,
  [
    "Q: How far should I sit from a 55 inch TV?||A: For a 55-inch 4K TV, the optimal viewing distance is approximately 4.5 to 7 feet. At 1080p, sit 7 to 11 feet away for the best experience without seeing individual pixels.",
    "Q: Is sitting too close to the TV bad for your eyes?||A: Modern TVs do not cause permanent eye damage at close distances. However, sitting too close may cause eye strain and fatigue. Following recommended viewing distances ensures comfort during long viewing sessions.",
    "Q: What size TV should I get for my room?||A: Multiply your viewing distance in inches by 0.625 for 4K TVs. For a 10-foot viewing distance, a 65-75 inch 4K TV is ideal. For 1080p, use a 0.4 multiplier instead."
  ],
  `Optimal Distance (ft) = TV Size x Resolution Factor x Usage Factor / 12\nMin Distance = TV Size x Res Multiplier x Usage Multiplier / 12\nMax Distance = Min Distance x 1.6`,
  ["monitor-size-distance-calculator", "projector-throw-distance-calculator", "screen-resolution-comparison-calculator"]
);

add(
  "projector-throw-distance-calculator",
  "Projector Throw Distance Calculator",
  "Calculate the required throw distance for your projector to achieve the desired screen size, or determine screen size from available distance.",
  "Everyday",
  "everyday",
  "~",
  ["projector throw distance", "projector screen size", "projector placement", "throw ratio calculator", "projector distance calculator"],
  [
    '{ name: "desiredWidth", label: "Desired Screen Width (inches)", type: "number", min: 40, max: 300, defaultValue: 100 }',
    '{ name: "throwRatio", label: "Projector Throw Ratio", type: "number", min: 0.2, max: 3.0, defaultValue: 1.2 }',
    '{ name: "projectorType", label: "Projector Type", type: "select", options: [{ value: "1", label: "Standard Throw" }, { value: "2", label: "Short Throw" }, { value: "3", label: "Ultra Short Throw" }], defaultValue: "1" }',
    '{ name: "availableDistance", label: "Available Room Distance (feet)", type: "number", min: 2, max: 50, defaultValue: 12 }',
    '{ name: "aspectRatio", label: "Aspect Ratio", type: "select", options: [{ value: "16", label: "16:9 (Widescreen)" }, { value: "4", label: "4:3 (Standard)" }, { value: "21", label: "21:9 (Ultrawide)" }], defaultValue: "16" }'
  ],
  `(inputs) => {
    const desiredWidth = inputs.desiredWidth as number;
    const throwRatio = inputs.throwRatio as number;
    const projType = parseInt(inputs.projectorType as string);
    const availDist = inputs.availableDistance as number;
    const aspect = parseInt(inputs.aspectRatio as string);
    const throwDistInches = desiredWidth * throwRatio;
    const throwDistFeet = Math.round(throwDistInches / 12 * 10) / 10;
    const maxScreenFromDist = Math.round(availDist * 12 / throwRatio);
    const heightRatio = aspect === 16 ? 9/16 : aspect === 4 ? 3/4 : 9/21;
    const screenHeight = Math.round(desiredWidth * heightRatio);
    const diagonalInches = Math.round(Math.sqrt(desiredWidth * desiredWidth + screenHeight * screenHeight));
    const fits = throwDistFeet <= availDist;
    return {
      primary: { label: "Required Throw Distance", value: formatNumber(throwDistFeet) + " feet" },
      details: [
        { label: "Screen Diagonal", value: formatNumber(diagonalInches) + " inches" },
        { label: "Screen Height", value: formatNumber(screenHeight) + " inches" },
        { label: "Max Screen Width (from room)", value: formatNumber(maxScreenFromDist) + " inches" },
        { label: "Fits Available Space", value: fits ? "Yes" : "No - need more distance" }
      ]
    };
  }`,
  [
    "Q: What is throw ratio on a projector?||A: Throw ratio is the distance from projector to screen divided by screen width. A ratio of 1.2 means the projector needs to be 1.2 feet away for every 1 foot of screen width. Lower ratios mean shorter distances.",
    "Q: How far should a projector be from the screen?||A: This depends on the throw ratio and desired screen size. A standard throw projector at 1.2 ratio needs about 10 feet for a 100-inch diagonal image. Short throw projectors can achieve this from 3-5 feet.",
    "Q: What size projector screen do I need?||A: For a home theater, a 100-120 inch diagonal screen is popular. Consider viewing distance: viewers should sit 1.2 to 1.6 times the screen diagonal away for the best 4K experience."
  ],
  `Throw Distance = Screen Width x Throw Ratio\nScreen Diagonal = sqrt(Width^2 + Height^2)\nMax Screen Width = Available Distance x 12 / Throw Ratio`,
  ["tv-viewing-distance-calculator", "monitor-size-distance-calculator"]
);

add(
  "electric-bill-device-cost-calculator",
  "Electric Bill Device Cost Calculator",
  "Calculate how much any electronic device adds to your monthly electric bill based on wattage, hours of use, and local electricity rate.",
  "Finance",
  "finance",
  "$",
  ["device electricity cost", "appliance power cost", "device electric bill", "watt to dollar", "device energy cost calculator"],
  [
    '{ name: "deviceWatts", label: "Device Wattage (W)", type: "number", min: 1, max: 5000, defaultValue: 200 }',
    '{ name: "hoursPerDay", label: "Hours Used Per Day", type: "number", min: 0.5, max: 24, defaultValue: 4 }',
    '{ name: "daysPerWeek", label: "Days Used Per Week", type: "number", min: 1, max: 7, defaultValue: 7 }',
    '{ name: "electricRate", label: "Electricity Rate ($/kWh)", type: "number", min: 0.05, max: 0.60, defaultValue: 0.13 }',
    '{ name: "standbyWatts", label: "Standby Power (W)", type: "number", min: 0, max: 50, defaultValue: 2 }'
  ],
  `(inputs) => {
    const watts = inputs.deviceWatts as number;
    const hours = inputs.hoursPerDay as number;
    const days = inputs.daysPerWeek as number;
    const rate = inputs.electricRate as number;
    const standby = inputs.standbyWatts as number;
    const activeKwhDay = (watts * hours) / 1000;
    const standbyHours = 24 - hours;
    const standbyKwhDay = (standby * standbyHours) / 1000;
    const dailyKwh = activeKwhDay + standbyKwhDay;
    const weeklyKwh = (activeKwhDay * days) + (standbyKwhDay * 7);
    const monthlyKwh = weeklyKwh * 4.345;
    const monthlyCost = monthlyKwh * rate;
    const annualCost = monthlyCost * 12;
    const annualKwh = monthlyKwh * 12;
    return {
      primary: { label: "Monthly Cost", value: "$" + formatNumber(Math.round(monthlyCost * 100) / 100) },
      details: [
        { label: "Annual Cost", value: "$" + formatNumber(Math.round(annualCost * 100) / 100) },
        { label: "Monthly Energy Use", value: formatNumber(Math.round(monthlyKwh * 100) / 100) + " kWh" },
        { label: "Annual Energy Use", value: formatNumber(Math.round(annualKwh * 100) / 100) + " kWh" },
        { label: "Daily Active Cost", value: "$" + formatNumber(Math.round(activeKwhDay * rate * 100) / 100) },
        { label: "Monthly Standby Cost", value: "$" + formatNumber(Math.round(standbyKwhDay * 30.44 * rate * 100) / 100) }
      ]
    };
  }`,
  [
    "Q: How much does it cost to run a gaming PC?||A: A gaming PC drawing 300-500W for 4 hours daily costs roughly $6-15 per month at average US electricity rates. Standby power adds another $0.50-2.00 per month.",
    "Q: What devices use the most electricity?||A: Space heaters (1500W), window AC units (500-1400W), gaming PCs (300-600W), large TVs (100-200W), and refrigerators (100-400W) are among the highest energy consumers in a typical home.",
    "Q: What is phantom or standby power?||A: Standby power is energy consumed by devices that are turned off but still plugged in. TVs, game consoles, and chargers can draw 1-15W in standby, costing $5-30 per year across all devices."
  ],
  `Monthly kWh = ((Watts x Hours/Day x Days/Week) + (Standby x Remaining Hours x 7)) x 4.345 / 1000\nMonthly Cost = Monthly kWh x Rate\nAnnual Cost = Monthly Cost x 12`,
  ["smart-thermostat-savings-calculator", "pc-power-supply-calculator", "rgb-led-strip-calculator"]
);