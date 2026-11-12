# -*- coding: utf-8 -*-
"""
clean_svg_and_prompts.py
Removes all answer text, badges, and spoiler labels from SVGs and quiz promptJa.
"""

import os, re, sys

sys.stdout.reconfigure(encoding='utf-8')
base_dir = r"C:\Users\kkaho\.gemini\antigravity\scratch\mongol-learning-app"
os.chdir(base_dir)

# 1. Update generate_spatial_data.py
with open("generate_spatial_data.py", "r", encoding="utf-8") as f:
    code = f.read()

# Pattern to remove <!-- Badge --> ... </svg>
# In the original SVGs, badge is at the end:
#   <!-- Badge -->
#   <rect x="..." y="3" ... />
#   <text ... >...</text>
# </svg>
# We replace it with just </svg>
code_cleaned = re.sub(r'\s*<!-- Badge -->\s*<rect[^>]*/>\s*<text[^>]*>[^<]*</text>\s*(?=</svg>)', '\n', code)

# Also remove internal text labels in SVGs that give away answers:
# <text ...>私</text>
# <text ...>遠い</text>
# <text ...>複数の本 (手元)</text>
# <text ...>遠くの馬たち</text>
# <text ...>あんなに?!</text>
# <text ...>基準の時</text>
# <text ...>〜の前</text>
# <text ...>〜の後</text>
# <text ...>終了点 (17:00)</text>
# <text ...>期間ずっと（1年間等）</text>
# <text ...>過去の起点</text>
# <text ...>現在</text>
# <text ...>〜の合間に</text>
# <text ...>A</text>
# <text ...>B</text>
internal_labels = [
    r'\s*<text[^>]*>私</text>',
    r'\s*<text[^>]*>遠い</text>',
    r'\s*<text[^>]*>複数の本[^<]*</text>',
    r'\s*<text[^>]*>遠くの馬たち</text>',
    r'\s*<text[^>]*>あんなに\?!</text>',
    r'\s*<text[^>]*>基準の時</text>',
    r'\s*<text[^>]*>〜の前</text>',
    r'\s*<text[^>]*>〜の後</text>',
    r'\s*<text[^>]*>終了点[^<]*</text>',
    r'\s*<text[^>]*>期間ずっと[^<]*</text>',
    r'\s*<text[^>]*>過去の起点</text>',
    r'\s*<text[^>]*>現在</text>',
    r'\s*<text[^>]*>〜の合間に</text>',
    r'\s*<text[^>]*>A</text>',
    r'\s*<text[^>]*>B</text>',
    r'\s*<rect\s+x="[^"]*"\s+y="3"\s+width="[^"]*"\s+height="18"\s+rx="9"[^>]*/>'
]

for pat in internal_labels:
    code_cleaned = re.sub(pat, '', code_cleaned)

with open("generate_spatial_data.py", "w", encoding="utf-8") as f:
    f.write(code_cleaned)

print("generate_spatial_data.py cleaned successfully.")

# 2. Update build_spatial_master_data.py:
# Clean quiz promptJa to remove parenthetical answer hints like:
# （机の上に） -> ""
# （椅子の下に） -> ""
# （バッグの中に） -> ""
# （家の外で） -> ""
# （学校の前に） -> ""
# （図書館の裏・後ろに） -> ""
# （2つの家の間に） -> ""
# （人々の真ん中で） -> ""
# （私の隣・そばに） -> ""
# （道路の向かい側に） -> ""
# （湖の周りに） -> ""
# （左側に） -> ""
# （右側に） -> ""
# （この本は [手元]） -> ""
# etc.
with open("build_spatial_master_data.py", "r", encoding="utf-8") as f:
    bcode = f.read()

# Replace "promptJa": "..." containing （...） at the end of the prompt
def clean_prompt_ja(match):
    full = match.group(0)
    # Remove any trailing （...） or (...):
    cleaned = re.sub(r'（[^）]+）\s*"', '"', full)
    return cleaned

bcode_cleaned = re.sub(r'"promptJa":\s*"[^"]*"', clean_prompt_ja, bcode)

with open("build_spatial_master_data.py", "w", encoding="utf-8") as f:
    f.write(bcode_cleaned)

print("build_spatial_master_data.py promptJa cleaned successfully.")
