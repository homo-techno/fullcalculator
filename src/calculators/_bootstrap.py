import os, json, sys
D = r"c:/Users/fip4i/OneDrive/Documents/Cursor/fullcalculator/src/calculators/"
# Read config chunks and generate files
configs = []
i = 1
while os.path.exists(D + f"_chunk{i}.json"):
    with open(D + f"_chunk{i}.json") as f2:
        configs.extend(json.load(f2))
    i += 1
print(f"Loaded {len(configs)} calculator configs")
for cfg in configs:
    with open(D + cfg["filename"], "w", newline="
") as f2:
        f2.write(cfg["content"])
    print(f"Created: {cfg["filename"]}")
print(f"Done! Created {len(configs)} files.")
