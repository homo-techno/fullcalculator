import os

D = r"c:/Users/fip4i/OneDrive/Documents/Cursor/fullcalculator/src/calculators/"
BT = chr(96)
DL = chr(36)
NL = chr(10)
n = 0

def tl(expr):
    return BT + DL + "{" + expr + "}" + BT

def w(name, content):
    global n
    with open(D + name, "w") as fout:
        fout.write(content.replace(chr(13), ""))
    n += 1
    print(str(n) + ". Created: " + name)

H1 = 'import type { CalculatorDefinition } from "./types";'
H2 = 'import { formatNumber } from "@/lib/utils";'
HDR = H1 + NL + H2 + NL + NL

# 1. cinder-block.ts
c = HDR + "export const cinderBlockCalculator: CalculatorDefinition = {" + NL
c += "  slug: \"cinder-block-calculator\"," + NL
c += "  title: \"Cinder Block Calculator\"," + NL
c += "  description: \"Free cinder block calculator. Estimate how many cinder blocks (CMUs) you need for walls, foundations, and raised beds.\"," + NL
c += "  category: \"Everyday\"," + NL
c += "  categorySlug: \"everyday\"," + NL
c += "  icon: \"~\"," + NL
