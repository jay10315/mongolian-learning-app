# -*- coding: utf-8 -*-
import xml.etree.ElementTree as ET

def test_svg(svg_str):
    tree = ET.fromstring(svg_str)
    return tree.tag == "{http://www.w3.org/2000/svg}svg"

# Test SVG snippet with baby chick styling
svg_chick = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 110" width="80" height="88">
  <ellipse cx="38" cy="102" rx="9" ry="5" fill="#f59e0b" />
  <ellipse cx="62" cy="102" rx="9" ry="5" fill="#f59e0b" />
  <ellipse cx="50" cy="68" rx="32" ry="34" fill="#64748b" />
  <ellipse cx="50" cy="71" rx="23" ry="24" fill="#f8fafc" />
  <path d="M 22 62 Q 14 74 24 82 Q 26 73 25 64 Z" fill="#64748b" />
  <path d="M 78 62 Q 86 74 76 82 Q 74 73 75 64 Z" fill="#64748b" />
  <circle cx="41" cy="56" r="4.5" fill="#0f172a" />
  <circle cx="59" cy="56" r="4.5" fill="#0f172a" />
  <circle cx="43" cy="54" r="1.8" fill="#ffffff" />
  <circle cx="61" cy="54" r="1.8" fill="#ffffff" />
  <circle cx="34" cy="62" r="4" fill="#fb7185" opacity="0.65" />
  <circle cx="66" cy="62" r="4" fill="#fb7185" opacity="0.65" />
  <polygon points="50,58 45,64 55,64" fill="#f59e0b" />
  <!-- Eggshell hat -->
  <path d="M 34 44 Q 50 20 66 44 L 58 40 L 50 44 L 42 40 Z" fill="#fef08a" stroke="#ca8a04" stroke-width="1.2" />
</svg>"""

assert test_svg(svg_chick)
print("Chick SVG valid XML!")
