# -*- coding: utf-8 -*-
import xml.etree.ElementTree as ET

svg_idle = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 110" width="80" height="88">
  <!-- Feet -->
  <ellipse cx="38" cy="102" rx="10" ry="5" fill="#f59e0b" />
  <ellipse cx="62" cy="102" rx="10" ry="5" fill="#f59e0b" />
  <!-- Body Outer -->
  <ellipse cx="50" cy="65" rx="35" ry="38" fill="#1e293b" />
  <!-- Belly -->
  <ellipse cx="50" cy="68" rx="25" ry="28" fill="#ffffff" />
  <!-- Wings -->
  <path d="M 18 55 Q 10 70 20 82 Q 24 70 22 58 Z" fill="#1e293b" />
  <path d="M 82 55 Q 90 70 80 82 Q 76 70 78 58 Z" fill="#1e293b" />
  <!-- Eyes -->
  <circle cx="40" cy="52" r="5" fill="#0f172a" />
  <circle cx="60" cy="52" r="5" fill="#0f172a" />
  <circle cx="42" cy="50" r="1.8" fill="#ffffff" />
  <circle cx="62" cy="50" r="1.8" fill="#ffffff" />
  <!-- Cheeks -->
  <circle cx="33" cy="58" r="4" fill="#fb7185" opacity="0.6" />
  <circle cx="67" cy="58" r="4" fill="#fb7185" opacity="0.6" />
  <!-- Beak -->
  <polygon points="50,54 44,62 56,62" fill="#f59e0b" />
  <!-- Mongolian Malgai (Hat) -->
  <path d="M 32 36 Q 50 12 50 10 Q 50 12 68 36 Z" fill="#0284c7" />
  <!-- Hat Top Knot -->
  <circle cx="50" cy="10" r="4.5" fill="#eab308" />
  <line x1="50" y1="10" x2="53" y2="16" stroke="#dc2626" stroke-width="1.5" />
  <!-- Hat Fur Rim -->
  <rect x="30" y="33" width="40" height="8" rx="4" fill="#f1f5f9" stroke="#cbd5e1" stroke-width="1" />
</svg>"""

tree = ET.fromstring(svg_idle)
print("SVG Valid XML! Tag:", tree.tag)
