import os
D = r"c:/Users/fip4i/OneDrive/Documents/Cursor/fullcalculator/src/calculators/"
BT = chr(96)  # backtick
NL = chr(10)
n = 0

def w(name, content):
    global n
    with open(D + name, "w") as f:
        f.write(content.replace(chr(13), ""))
    n += 1
    print(str(n) + ". Created: " + name)

H = "import type { CalculatorDefinition } from " + chr(34) + "./types" + chr(34) + ";" + NL
H += "import { formatNumber } from " + chr(34) + "@/lib/utils" + chr(34) + ";" + NL + NL

def q(s):
    """wrap string in double quotes for TS"""
    return chr(34) + s + chr(34)

def tl(expr):
    """create template literal"""
    return BT + chr(36) + chr(123) + expr + chr(125) + BT
