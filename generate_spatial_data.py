# -*- coding: utf-8 -*-
"""
generate_spatial_data.py
Creates js/data/spatialPostpositionData.js with:
- Categories (all, spatial, demonstrative, temporal)
- Items with detailed metadata, formulas, usage notes, and examples
- Rich SVG illustrations for all spatial, demonstrative, and temporal concepts
- 60+ comprehensive multiple-choice questions with full explanations
"""

import os
import json

base_dir = r"C:\Users\kkaho\.gemini\antigravity\scratch\mongol-learning-app"
os.chdir(base_dir)

# 1. SVGs for spatial, demonstrative, temporal concepts
# ViewBox: 0 0 160 120
SVGS = {
    "box_on": '''<svg viewBox="0 0 160 120" xmlns="http://www.w3.org/2000/svg" class="w-full h-full">
  <defs>
    <linearGradient id="bg_on" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#eff6ff"/><stop offset="100%" stop-color="#dbeafe"/></linearGradient>
    <linearGradient id="box_grad1" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#3b82f6"/><stop offset="100%" stop-color="#1d4ed8"/></linearGradient>
  </defs>
  <rect width="160" height="120" rx="16" fill="url(#bg_on)"/>
  <ellipse cx="80" cy="104" rx="55" ry="10" fill="#93c5fd" opacity="0.6"/>
  <!-- Box Top/Body -->
  <polygon points="40,65 80,48 120,65 80,82" fill="#60a5fa" stroke="#1e40af" stroke-width="2"/>
  <polygon points="40,65 80,82 80,105 40,88" fill="#3b82f6" stroke="#1e40af" stroke-width="2"/>
  <polygon points="120,65 80,82 80,105 120,88" fill="#2563eb" stroke="#1e40af" stroke-width="2"/>
  <!-- Penguin sitting ON top -->
  <ellipse cx="80" cy="42" rx="14" ry="18" fill="#1e293b"/>
  <ellipse cx="80" cy="45" rx="9" ry="12" fill="#ffffff"/>
  <ellipse cx="80" cy="27" rx="10" ry="10" fill="#1e293b"/>
  <ellipse cx="80" cy="28" rx="6" ry="6" fill="#ffffff"/>
  <circle cx="77" cy="27" r="1.5" fill="#0f172a"/><circle cx="83" cy="27" r="1.5" fill="#0f172a"/>
  <polygon points="80,29 76,33 84,33" fill="#f59e0b"/>
  <!-- Feet -->
  <ellipse cx="73" cy="58" rx="4" ry="2" fill="#f59e0b"/>
  <ellipse cx="87" cy="58" rx="4" ry="2" fill="#f59e0b"/>
  <!-- Highlight Arrow pointing ON TOP -->
  <path d="M 80,6 L 80,16 M 75,12 L 80,17 L 85,12" stroke="#ef4444" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
</svg>''',

    "box_under": '''<svg viewBox="0 0 160 120" xmlns="http://www.w3.org/2000/svg" class="w-full h-full">
  <defs>
    <linearGradient id="bg_under" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#fdf4ff"/><stop offset="100%" stop-color="#fae8ff"/></linearGradient>
  </defs>
  <rect width="160" height="120" rx="16" fill="url(#bg_under)"/>
  <ellipse cx="80" cy="106" rx="55" ry="8" fill="#e9d5ff" opacity="0.6"/>
  <!-- Penguin peeking UNDER the box -->
  <ellipse cx="80" cy="94" rx="14" ry="14" fill="#1e293b"/>
  <ellipse cx="80" cy="96" rx="9" ry="10" fill="#ffffff"/>
  <circle cx="77" cy="92" r="1.8" fill="#0f172a"/><circle cx="83" cy="92" r="1.8" fill="#0f172a"/>
  <polygon points="80,94 77,98 83,98" fill="#f59e0b"/>
  <!-- Floating Box Above -->
  <polygon points="35,42 80,25 125,42 80,59" fill="#c084fc" stroke="#6b21a8" stroke-width="2"/>
  <polygon points="35,42 80,59 80,82 35,65" fill="#a855f7" stroke="#6b21a8" stroke-width="2"/>
  <polygon points="125,42 80,59 80,82 125,65" fill="#9333ea" stroke="#6b21a8" stroke-width="2"/>
  <!-- Arrow pointing down UNDER -->
  <path d="M 80,68 L 80,84 M 76,80 L 80,85 L 84,80" stroke="#a855f7" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>''',

    "box_inside": '''<svg viewBox="0 0 160 120" xmlns="http://www.w3.org/2000/svg" class="w-full h-full">
  <defs>
    <linearGradient id="bg_in" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#ecfdf5"/><stop offset="100%" stop-color="#d1fae5"/></linearGradient>
  </defs>
  <rect width="160" height="120" rx="16" fill="url(#bg_in)"/>
  <ellipse cx="80" cy="104" rx="50" ry="10" fill="#a7f3d0" opacity="0.6"/>
  <!-- Box Back Faces -->
  <polygon points="40,50 80,35 120,50 80,65" fill="#6ee7b7" stroke="#047857" stroke-width="1.5"/>
  <!-- Penguin INSIDE -->
  <ellipse cx="80" cy="55" rx="14" ry="18" fill="#1e293b"/>
  <ellipse cx="80" cy="58" rx="9" ry="12" fill="#ffffff"/>
  <ellipse cx="80" cy="42" rx="9" ry="9" fill="#1e293b"/>
  <circle cx="77" cy="42" r="1.5" fill="#0f172a"/><circle cx="83" cy="42" r="1.5" fill="#0f172a"/>
  <polygon points="80,45 77,48 83,48" fill="#f59e0b"/>
  <!-- Waving Wings inside box -->
  <ellipse cx="64" cy="52" rx="4" ry="8" fill="#1e293b" transform="rotate(-30 64 52)"/>
  <ellipse cx="96" cy="52" rx="4" ry="8" fill="#1e293b" transform="rotate(30 96 52)"/>
  <!-- Box Front Cut Faces -->
  <polygon points="40,50 80,65 80,95 40,80" fill="#10b981" stroke="#047857" stroke-width="2" opacity="0.95"/>
  <polygon points="120,50 80,65 80,95 120,80" fill="#059669" stroke="#047857" stroke-width="2" opacity="0.95"/>
  <!-- Heart icon -->
  <path d="M 80,26 C 78,22 73,22 73,26 C 73,29 80,33 80,33 C 80,33 87,29 87,26 C 87,22 82,22 80,26 Z" fill="#ef4444"/>
</svg>''',

    "box_outside": '''<svg viewBox="0 0 160 120" xmlns="http://www.w3.org/2000/svg" class="w-full h-full">
  <defs>
    <linearGradient id="bg_out" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#fffbeb"/><stop offset="100%" stop-color="#fef3c7"/></linearGradient>
  </defs>
  <rect width="160" height="120" rx="16" fill="url(#bg_out)"/>
  <ellipse cx="80" cy="105" rx="65" ry="10" fill="#fde68a" opacity="0.6"/>
  <!-- Ger (House) on Right/Center -->
  <path d="M 70,68 L 130,68 L 128,95 L 72,95 Z" fill="#ffffff" stroke="#d97706" stroke-width="2"/>
  <path d="M 68,68 Q 100,45 132,68 Z" fill="#ffffff" stroke="#d97706" stroke-width="2"/>
  <ellipse cx="100" cy="46" rx="12" ry="5" fill="#f59e0b" stroke="#b45309" stroke-width="1.5"/>
  <rect x="94" y="72" width="12" height="23" fill="#ef4444" rx="1"/>
  <!-- Penguin Standing OUTSIDE on Left -->
  <ellipse cx="42" cy="78" rx="12" ry="16" fill="#1e293b"/>
  <ellipse cx="42" cy="80" rx="7" ry="10" fill="#ffffff"/>
  <ellipse cx="42" cy="65" rx="8" ry="8" fill="#1e293b"/>
  <circle cx="40" cy="64" r="1.5" fill="#0f172a"/><circle cx="45" cy="64" r="1.5" fill="#0f172a"/>
  <polygon points="42,67 39,70 45,70" fill="#f59e0b"/>
  <!-- Waving hand -->
  <ellipse cx="30" cy="72" rx="3.5" ry="8" fill="#1e293b" transform="rotate(-40 30 72)"/>
  <!-- Arrow from inside to outside -->
  <path d="M 80,80 Q 62,80 56,78" fill="none" stroke="#f59e0b" stroke-width="2" stroke-dasharray="3,2"/>
</svg>''',

    "box_front": '''<svg viewBox="0 0 160 120" xmlns="http://www.w3.org/2000/svg" class="w-full h-full">
  <defs>
    <linearGradient id="bg_front" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#f0fdf4"/><stop offset="100%" stop-color="#dcfce7"/></linearGradient>
  </defs>
  <rect width="160" height="120" rx="16" fill="url(#bg_front)"/>
  <!-- Building in background -->
  <rect x="45" y="25" width="70" height="50" rx="4" fill="#e2e8f0" stroke="#64748b" stroke-width="2"/>
  <polygon points="40,26 80,12 120,26" fill="#94a3b8" stroke="#64748b" stroke-width="1.5"/>
  <rect x="55" y="35" width="14" height="14" fill="#93c5fd" stroke="#64748b" stroke-width="1"/>
  <rect x="91" y="35" width="14" height="14" fill="#93c5fd" stroke="#64748b" stroke-width="1"/>
  <rect x="73" y="55" width="14" height="20" fill="#78350f"/>
  <!-- Pathway forward -->
  <polygon points="65,75 95,75 110,112 50,112" fill="#cbd5e1" opacity="0.6"/>
  <!-- Penguin standing in FRONT -->
  <ellipse cx="80" cy="88" rx="16" ry="20" fill="#1e293b"/>
  <ellipse cx="80" cy="91" rx="10" ry="14" fill="#ffffff"/>
  <ellipse cx="80" cy="71" rx="11" ry="11" fill="#1e293b"/>
  <circle cx="76" cy="70" r="1.8" fill="#0f172a"/><circle cx="84" cy="70" r="1.8" fill="#0f172a"/>
  <polygon points="80,74 76,78 84,78" fill="#f59e0b"/>
  <!-- Feet -->
  <ellipse cx="73" cy="107" rx="5" ry="2.5" fill="#f59e0b"/>
  <ellipse cx="87" cy="107" rx="5" ry="2.5" fill="#f59e0b"/>
</svg>''',

    "box_behind": '''<svg viewBox="0 0 160 120" xmlns="http://www.w3.org/2000/svg" class="w-full h-full">
  <defs>
    <linearGradient id="bg_behind" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#faf5ff"/><stop offset="100%" stop-color="#f3e8ff"/></linearGradient>
  </defs>
  <rect width="160" height="120" rx="16" fill="url(#bg_behind)"/>
  <!-- Penguin peeking from BEHIND building -->
  <ellipse cx="108" cy="46" rx="13" ry="15" fill="#1e293b"/>
  <ellipse cx="109" cy="47" rx="8" ry="10" fill="#ffffff"/>
  <circle cx="106" cy="44" r="1.5" fill="#0f172a"/><circle cx="112" cy="44" r="1.5" fill="#0f172a"/>
  <polygon points="108,48 105,51 111,51" fill="#f59e0b"/>
  <!-- Waving wing from behind -->
  <ellipse cx="122" cy="42" rx="4" ry="9" fill="#1e293b" transform="rotate(35 122 42)"/>
  <!-- House in foreground -->
  <rect x="35" y="45" width="70" height="55" rx="4" fill="#e2e8f0" stroke="#475569" stroke-width="2"/>
  <polygon points="30,46 70,28 110,46" fill="#a855f7" stroke="#475569" stroke-width="2"/>
  <rect x="48" y="56" width="14" height="14" fill="#93c5fd" stroke="#475569" stroke-width="1"/>
  <rect x="78" y="56" width="14" height="14" fill="#93c5fd" stroke="#475569" stroke-width="1"/>
  <rect x="62" y="76" width="16" height="24" fill="#78350f"/>
</svg>''',

    "box_between": '''<svg viewBox="0 0 160 120" xmlns="http://www.w3.org/2000/svg" class="w-full h-full">
  <defs>
    <linearGradient id="bg_bet" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#fff1f2"/><stop offset="100%" stop-color="#ffe4e6"/></linearGradient>
  </defs>
  <rect width="160" height="120" rx="16" fill="url(#bg_bet)"/>
  <ellipse cx="80" cy="106" rx="65" ry="8" fill="#fecdd3" opacity="0.6"/>
  <!-- Left Box A -->
  <rect x="18" y="50" width="34" height="46" rx="4" fill="#fb7185" stroke="#be123c" stroke-width="2"/>
  <!-- Right Box B -->
  <rect x="108" y="50" width="34" height="46" rx="4" fill="#fb7185" stroke="#be123c" stroke-width="2"/>
  <!-- Penguin in the MIDDLE BETWEEN A and B -->
  <ellipse cx="80" cy="74" rx="13" ry="17" fill="#1e293b"/>
  <ellipse cx="80" cy="76" rx="8" ry="11" fill="#ffffff"/>
  <ellipse cx="80" cy="60" rx="9" ry="9" fill="#1e293b"/>
  <circle cx="77" cy="59" r="1.5" fill="#0f172a"/><circle cx="83" cy="59" r="1.5" fill="#0f172a"/>
  <polygon points="80,62 77,65 83,65" fill="#f59e0b"/>
  <!-- Outstretched wings -->
  <ellipse cx="65" cy="72" rx="4" ry="9" fill="#1e293b" transform="rotate(-30 65 72)"/>
  <ellipse cx="95" cy="72" rx="4" ry="9" fill="#1e293b" transform="rotate(30 95 72)"/>
  <!-- Bidirectional arrow -->
  <path d="M 54,42 L 106,42 M 58,38 L 54,42 L 58,46 M 102,38 L 106,42 L 102,46" stroke="#e11d48" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>''',

    "box_middle": '''<svg viewBox="0 0 160 120" xmlns="http://www.w3.org/2000/svg" class="w-full h-full">
  <defs>
    <linearGradient id="bg_mid" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#f0fdfa"/><stop offset="100%" stop-color="#ccfbf1"/></linearGradient>
  </defs>
  <rect width="160" height="120" rx="16" fill="url(#bg_mid)"/>
  <!-- Surrounding crowd circles -->
  <circle cx="40" cy="50" r="10" fill="#99f6e4" stroke="#0f766e" stroke-width="1.5"/>
  <circle cx="120" cy="50" r="10" fill="#99f6e4" stroke="#0f766e" stroke-width="1.5"/>
  <circle cx="45" cy="90" r="10" fill="#99f6e4" stroke="#0f766e" stroke-width="1.5"/>
  <circle cx="115" cy="90" r="10" fill="#99f6e4" stroke="#0f766e" stroke-width="1.5"/>
  <circle cx="80" cy="35" r="9" fill="#99f6e4" stroke="#0f766e" stroke-width="1.5"/>
  <!-- Central Highlight Ring -->
  <ellipse cx="80" cy="75" rx="22" ry="22" fill="#5eead4" opacity="0.4"/>
  <!-- Penguin in the CENTER/AMIDST -->
  <ellipse cx="80" cy="74" rx="13" ry="17" fill="#1e293b"/>
  <ellipse cx="80" cy="76" rx="8" ry="11" fill="#ffffff"/>
  <ellipse cx="80" cy="60" rx="9" ry="9" fill="#1e293b"/>
  <circle cx="77" cy="59" r="1.5" fill="#0f172a"/><circle cx="83" cy="59" r="1.5" fill="#0f172a"/>
  <polygon points="80,62 77,65 83,65" fill="#f59e0b"/>
</svg>''',

    "box_beside": '''<svg viewBox="0 0 160 120" xmlns="http://www.w3.org/2000/svg" class="w-full h-full">
  <defs>
    <linearGradient id="bg_beside" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#eff6ff"/><stop offset="100%" stop-color="#dbeafe"/></linearGradient>
  </defs>
  <rect width="160" height="120" rx="16" fill="url(#bg_beside)"/>
  <ellipse cx="80" cy="106" rx="60" ry="8" fill="#bfdbfe" opacity="0.6"/>
  <!-- Big Armchair / Desk on Left -->
  <rect x="25" y="48" width="46" height="50" rx="6" fill="#3b82f6" stroke="#1d4ed8" stroke-width="2"/>
  <rect x="20" y="62" width="10" height="25" rx="3" fill="#60a5fa"/>
  <rect x="66" y="62" width="10" height="25" rx="3" fill="#60a5fa"/>
  <!-- Penguin standing right BESIDE / NEXT TO IT -->
  <ellipse cx="105" cy="76" rx="14" ry="18" fill="#1e293b"/>
  <ellipse cx="105" cy="79" rx="9" ry="12" fill="#ffffff"/>
  <ellipse cx="105" cy="61" rx="10" ry="10" fill="#1e293b"/>
  <circle cx="102" cy="60" r="1.5" fill="#0f172a"/><circle cx="108" cy="60" r="1.5" fill="#0f172a"/>
  <polygon points="105,63 102,66 108,66" fill="#f59e0b"/>
  <!-- Arrow indicating side -->
  <path d="M 74,74 L 88,74 M 84,70 L 89,74 L 84,78" stroke="#f59e0b" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>''',

    "box_opposite": '''<svg viewBox="0 0 160 120" xmlns="http://www.w3.org/2000/svg" class="w-full h-full">
  <defs>
    <linearGradient id="bg_opp" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#f8fafc"/><stop offset="100%" stop-color="#f1f5f9"/></linearGradient>
  </defs>
  <rect width="160" height="120" rx="16" fill="url(#bg_opp)"/>
  <!-- Road running down middle -->
  <rect x="65" y="24" width="30" height="90" fill="#475569"/>
  <line x1="80" y1="28" x2="80" y2="40" stroke="#fef08a" stroke-width="2" stroke-linecap="round"/>
  <line x1="80" y1="52" x2="80" y2="64" stroke="#fef08a" stroke-width="2" stroke-linecap="round"/>
  <line x1="80" y1="76" x2="80" y2="88" stroke="#fef08a" stroke-width="2" stroke-linecap="round"/>
  <line x1="80" y1="100" x2="80" y2="112" stroke="#fef08a" stroke-width="2" stroke-linecap="round"/>
  <!-- Shop on Left -->
  <rect x="12" y="45" width="42" height="45" rx="3" fill="#0284c7" stroke="#0369a1" stroke-width="2"/>
  <polygon points="8,46 33,32 58,46" fill="#38bdf8"/>
  <rect x="22" y="62" width="14" height="28" fill="#ffffff"/>
  <!-- Penguin across street on Right -->
  <ellipse cx="128" cy="76" rx="13" ry="17" fill="#1e293b"/>
  <ellipse cx="128" cy="78" rx="8" ry="11" fill="#ffffff"/>
  <ellipse cx="128" cy="61" rx="9" ry="9" fill="#1e293b"/>
  <circle cx="125" cy="60" r="1.5" fill="#0f172a"/><circle cx="131" cy="60" r="1.5" fill="#0f172a"/>
  <polygon points="128,63 125,66 131,66" fill="#f59e0b"/>
  <!-- Facing cross-arrow -->
  <path d="M 58,68 L 110,68 M 62,64 L 58,68 L 62,72 M 106,64 L 110,68 L 106,72" stroke="#ef4444" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>''',

    "box_around": '''<svg viewBox="0 0 160 120" xmlns="http://www.w3.org/2000/svg" class="w-full h-full">
  <defs>
    <linearGradient id="bg_around" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#fdf4ff"/><stop offset="100%" stop-color="#fae8ff"/></linearGradient>
  </defs>
  <rect width="160" height="120" rx="16" fill="url(#bg_around)"/>
  <!-- Tree / Lake in center -->
  <ellipse cx="80" cy="70" rx="22" ry="14" fill="#38bdf8" stroke="#0284c7" stroke-width="2"/>
  <!-- Orbiting circular arrows -->
  <path d="M 40,70 A 40,24 0 1,1 120,70 A 40,24 0 1,1 40,70" fill="none" stroke="#d946ef" stroke-width="2.5" stroke-dasharray="6,4"/>
  <!-- Penguin walking along circular path -->
  <ellipse cx="116" cy="62" rx="10" ry="13" fill="#1e293b"/>
  <ellipse cx="116" cy="64" rx="6" ry="8" fill="#ffffff"/>
  <circle cx="114" cy="53" r="7" fill="#1e293b"/>
  <circle cx="113" cy="52" r="1.2" fill="#ffffff"/><circle cx="116" cy="52" r="1.2" fill="#ffffff"/>
  <polygon points="112,54 108,56 112,58" fill="#f59e0b"/>
</svg>''',

    "dir_left": '''<svg viewBox="0 0 160 120" xmlns="http://www.w3.org/2000/svg" class="w-full h-full">
  <defs>
    <linearGradient id="bg_l" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#eff6ff"/><stop offset="100%" stop-color="#dbeafe"/></linearGradient>
  </defs>
  <rect width="160" height="120" rx="16" fill="url(#bg_l)"/>
  <!-- Center separator line -->
  <line x1="80" y1="26" x2="80" y2="108" stroke="#94a3b8" stroke-width="1.5" stroke-dasharray="4,4"/>
  <!-- Big Left Arrow -->
  <path d="M 68,68 L 26,68 M 36,56 L 24,68 L 36,80" stroke="#2563eb" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/>
  <!-- Target Penguin on LEFT -->
  <ellipse cx="44" cy="70" rx="12" ry="16" fill="#1e293b" opacity="0.3"/>
</svg>''',

    "dir_right": '''<svg viewBox="0 0 160 120" xmlns="http://www.w3.org/2000/svg" class="w-full h-full">
  <defs>
    <linearGradient id="bg_r" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#eff6ff"/><stop offset="100%" stop-color="#dbeafe"/></linearGradient>
  </defs>
  <rect width="160" height="120" rx="16" fill="url(#bg_r)"/>
  <!-- Center separator line -->
  <line x1="80" y1="26" x2="80" y2="108" stroke="#94a3b8" stroke-width="1.5" stroke-dasharray="4,4"/>
  <!-- Big Right Arrow -->
  <path d="M 92,68 L 134,68 M 124,56 L 136,68 L 124,80" stroke="#f97316" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/>
  <!-- Target Penguin on RIGHT -->
  <ellipse cx="116" cy="70" rx="12" ry="16" fill="#1e293b" opacity="0.3"/>
</svg>''',

    # Demonstratives
    "point_this": '''<svg viewBox="0 0 160 120" xmlns="http://www.w3.org/2000/svg" class="w-full h-full">
  <defs>
    <linearGradient id="bg_this" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#ecfdf5"/><stop offset="100%" stop-color="#d1fae5"/></linearGradient>
  </defs>
  <rect width="160" height="120" rx="16" fill="url(#bg_this)"/>
  <!-- Speaker Hand on Left, pointing CLOSE -->
  <circle cx="35" cy="75" r="16" fill="#fbbf24"/>
  <rect x="35" y="68" width="30" height="14" rx="7" fill="#fbbf24"/>
  <!-- Short Distance Indicator [20cm] -->
  <path d="M 68,75 L 88,75" stroke="#059669" stroke-width="2.5" stroke-dasharray="3,2"/>
  <!-- Close Target Object (Apple) -->
  <circle cx="106" cy="75" r="16" fill="#ef4444" stroke="#b91c1c" stroke-width="2"/>
  <path d="M 106,59 Q 110,50 114,54" fill="none" stroke="#15803d" stroke-width="2.5"/>
  <ellipse cx="114" cy="56" rx="4" ry="2" fill="#22c55e"/>
  <!-- Sparkling stars -->
  <text x="126" y="60" fill="#f59e0b" font-size="14">✨</text>
</svg>''',

    "point_that": '''<svg viewBox="0 0 160 120" xmlns="http://www.w3.org/2000/svg" class="w-full h-full">
  <defs>
    <linearGradient id="bg_that" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#f0f9ff"/><stop offset="100%" stop-color="#e0f2fe"/></linearGradient>
  </defs>
  <rect width="160" height="120" rx="16" fill="url(#bg_that)"/>
  <!-- Speaker Hand on Left -->
  <circle cx="28" cy="82" r="14" fill="#fbbf24"/>
  <rect x="28" y="76" width="22" height="12" rx="6" fill="#fbbf24"/>
  <!-- Long distance dotted line -->
  <path d="M 52,80 L 118,48" stroke="#0284c7" stroke-width="2" stroke-dasharray="5,4"/>
  <polygon points="120,46 110,48 114,54" fill="#0284c7"/>
  <!-- Distant Target Object (Far mountain/Ger) -->
  <path d="M 112,58 L 142,58 L 138,40 L 116,40 Z" fill="#e2e8f0" stroke="#0369a1" stroke-width="1.5"/>
  <polygon points="112,40 127,28 142,40" fill="#38bdf8"/>
</svg>''',

    "point_these": '''<svg viewBox="0 0 160 120" xmlns="http://www.w3.org/2000/svg" class="w-full h-full">
  <defs>
    <linearGradient id="bg_these" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#fdf4ff"/><stop offset="100%" stop-color="#fae8ff"/></linearGradient>
  </defs>
  <rect width="160" height="120" rx="16" fill="url(#bg_these)"/>
  <!-- Hand pointing near -->
  <circle cx="32" cy="72" r="14" fill="#fbbf24"/>
  <rect x="32" y="66" width="24" height="12" rx="6" fill="#fbbf24"/>
  <!-- Multiple items clustered together close -->
  <rect x="80" y="58" width="20" height="26" rx="2" fill="#a855f7" stroke="#6b21a8" stroke-width="1.5"/>
  <rect x="104" y="54" width="20" height="26" rx="2" fill="#c084fc" stroke="#6b21a8" stroke-width="1.5"/>
  <rect x="128" y="62" width="20" height="26" rx="2" fill="#e9d5ff" stroke="#6b21a8" stroke-width="1.5"/>
</svg>''',

    "point_those": '''<svg viewBox="0 0 160 120" xmlns="http://www.w3.org/2000/svg" class="w-full h-full">
  <defs>
    <linearGradient id="bg_those" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#f8fafc"/><stop offset="100%" stop-color="#e2e8f0"/></linearGradient>
  </defs>
  <rect width="160" height="120" rx="16" fill="url(#bg_those)"/>
  <circle cx="26" cy="85" r="12" fill="#fbbf24"/>
  <rect x="26" y="80" width="20" height="10" rx="5" fill="#fbbf24"/>
  <!-- Arrow to distant multiple objects -->
  <path d="M 48,82 L 95,54" stroke="#475569" stroke-width="2" stroke-dasharray="4,3"/>
  <!-- Multiple distant mountains/horses -->
  <ellipse cx="106" cy="50" rx="10" ry="7" fill="#64748b"/>
  <ellipse cx="126" cy="46" rx="10" ry="7" fill="#64748b"/>
  <ellipse cx="144" cy="52" rx="10" ry="7" fill="#64748b"/>
</svg>''',

    "point_here": '''<svg viewBox="0 0 160 120" xmlns="http://www.w3.org/2000/svg" class="w-full h-full">
  <defs>
    <linearGradient id="bg_here" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#ecfdf5"/><stop offset="100%" stop-color="#d1fae5"/></linearGradient>
  </defs>
  <rect width="160" height="120" rx="16" fill="url(#bg_here)"/>
  <!-- Map Grid Tile under feet -->
  <polygon points="30,80 80,60 130,80 80,100" fill="#a7f3d0" stroke="#059669" stroke-width="2"/>
  <!-- Glowing target pulse -->
  <ellipse cx="80" cy="80" rx="20" ry="10" fill="#34d399" opacity="0.4"/>
  <!-- Big Red Location Pin 📍 right HERE -->
  <path d="M 80,42 C 70,42 64,48 64,56 C 64,68 80,82 80,82 C 80,82 96,68 96,56 C 96,48 90,42 80,42 Z" fill="#ef4444" stroke="#b91c1c" stroke-width="2"/>
  <circle cx="80" cy="55" r="5" fill="#ffffff"/>
</svg>''',

    "point_there": '''<svg viewBox="0 0 160 120" xmlns="http://www.w3.org/2000/svg" class="w-full h-full">
  <defs>
    <linearGradient id="bg_there" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#f0f9ff"/><stop offset="100%" stop-color="#e0f2fe"/></linearGradient>
  </defs>
  <rect width="160" height="120" rx="16" fill="url(#bg_there)"/>
  <!-- Distant Hill -->
  <path d="M 70,105 Q 120,40 160,85 L 160,120 L 70,120 Z" fill="#bae6fd"/>
  <!-- Location Pin on Far Hill -->
  <path d="M 125,48 C 119,48 115,52 115,57 C 115,64 125,74 125,74 C 125,74 135,64 135,57 C 135,52 131,48 125,48 Z" fill="#0284c7" stroke="#0369a1" stroke-width="1.5"/>
  <circle cx="125" cy="56" r="3" fill="#ffffff"/>
  <!-- Speaker looking from Left -->
  <ellipse cx="36" cy="92" rx="12" ry="15" fill="#1e293b"/>
  <ellipse cx="36" cy="78" rx="8" ry="8" fill="#1e293b"/>
  <path d="M 52,78 L 105,60" stroke="#0284c7" stroke-width="2" stroke-dasharray="3,3"/>
</svg>''',

    "arrow_towards": '''<svg viewBox="0 0 160 120" xmlns="http://www.w3.org/2000/svg" class="w-full h-full">
  <defs>
    <linearGradient id="bg_toward" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#eff6ff"/><stop offset="100%" stop-color="#dbeafe"/></linearGradient>
    <linearGradient id="arrow_grad_in" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#60a5fa"/><stop offset="100%" stop-color="#1d4ed8"/></linearGradient>
  </defs>
  <rect width="160" height="120" rx="16" fill="url(#bg_toward)"/>
  <!-- Big 3D Arrow coming toward screen/speaker -->
  <polygon points="65,30 95,30 95,65 115,65 80,105 45,65 65,65" fill="url(#arrow_grad_in)" stroke="#1e40af" stroke-width="2.5"/>
  <!-- Ripple lines at bottom -->
  <ellipse cx="80" cy="108" rx="36" ry="6" fill="#3b82f6" opacity="0.3"/>
</svg>''',

    "arrow_away": '''<svg viewBox="0 0 160 120" xmlns="http://www.w3.org/2000/svg" class="w-full h-full">
  <defs>
    <linearGradient id="bg_away" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#fdf2f8"/><stop offset="100%" stop-color="#fce7f3"/></linearGradient>
    <linearGradient id="arrow_grad_out" x1="0" y1="1" x2="0" y2="0"><stop offset="0%" stop-color="#f472b6"/><stop offset="100%" stop-color="#be185d"/></linearGradient>
  </defs>
  <rect width="160" height="120" rx="16" fill="url(#bg_away)"/>
  <!-- Big 3D Arrow shooting AWAY into horizon -->
  <polygon points="65,100 95,100 95,65 115,65 80,25 45,65 65,65" fill="url(#arrow_grad_out)" stroke="#9d174d" stroke-width="2.5"/>
</svg>''',

    "arrow_up": '''<svg viewBox="0 0 160 120" xmlns="http://www.w3.org/2000/svg" class="w-full h-full">
  <defs>
    <linearGradient id="bg_up" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#ecfeff"/><stop offset="100%" stop-color="#cffafe"/></linearGradient>
  </defs>
  <rect width="160" height="120" rx="16" fill="url(#bg_up)"/>
  <!-- Stairs leading UP -->
  <path d="M 25,100 L 50,100 L 50,80 L 75,80 L 75,60 L 100,60 L 100,40 L 125,40" fill="none" stroke="#0891b2" stroke-width="3" stroke-linecap="round"/>
  <!-- Arrow UP -->
  <path d="M 40,88 Q 75,45 115,30 M 102,28 L 118,29 L 115,44" fill="none" stroke="#06b6d4" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>''',

    "arrow_down": '''<svg viewBox="0 0 160 120" xmlns="http://www.w3.org/2000/svg" class="w-full h-full">
  <defs>
    <linearGradient id="bg_down" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#fff7ed"/><stop offset="100%" stop-color="#ffedd5"/></linearGradient>
  </defs>
  <rect width="160" height="120" rx="16" fill="url(#bg_down)"/>
  <!-- Stairs leading DOWN -->
  <path d="M 25,40 L 50,40 L 50,60 L 75,60 L 75,80 L 100,80 L 100,100 L 125,100" fill="none" stroke="#ea580c" stroke-width="3" stroke-linecap="round"/>
  <!-- Arrow DOWN -->
  <path d="M 38,32 Q 78,75 118,92 M 106,94 L 120,93 L 118,78" fill="none" stroke="#f97316" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>''',

    "shape_like_this": '''<svg viewBox="0 0 160 120" xmlns="http://www.w3.org/2000/svg" class="w-full h-full">
  <defs>
    <linearGradient id="bg_this_shape" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#f5f3ff"/><stop offset="100%" stop-color="#ede9fe"/></linearGradient>
  </defs>
  <rect width="160" height="120" rx="16" fill="url(#bg_this_shape)"/>
  <!-- Sample A and Sample B of identical shape -->
  <circle cx="48" cy="68" r="18" fill="#8b5cf6" stroke="#5b21b6" stroke-width="2"/>
  <text x="48" y="73" fill="#ffffff" font-weight="bold" font-size="13" text-anchor="middle">★</text>
  <text x="80" y="74" fill="#7c3aed" font-weight="black" font-size="20" text-anchor="middle">=</text>
  <circle cx="112" cy="68" r="18" fill="#a78bfa" stroke="#5b21b6" stroke-width="2"/>
  <text x="112" y="73" fill="#ffffff" font-weight="bold" font-size="13" text-anchor="middle">★</text>
</svg>''',

    "shape_like_that": '''<svg viewBox="0 0 160 120" xmlns="http://www.w3.org/2000/svg" class="w-full h-full">
  <defs>
    <linearGradient id="bg_that_shape" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#fffbeb"/><stop offset="100%" stop-color="#fef3c7"/></linearGradient>
  </defs>
  <rect width="160" height="120" rx="16" fill="url(#bg_that_shape)"/>
  <!-- Giant glowing star admiring from afar -->
  <polygon points="115,35 122,50 138,52 126,64 129,80 115,72 101,80 104,64 92,52 108,50" fill="#f59e0b" stroke="#b45309" stroke-width="2"/>
  <!-- Admiring eyes / exclamation -->
</svg>''',

    # Temporal Postpositions
    "time_before": '''<svg viewBox="0 0 160 120" xmlns="http://www.w3.org/2000/svg" class="w-full h-full">
  <defs>
    <linearGradient id="bg_t_bef" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#eff6ff"/><stop offset="100%" stop-color="#dbeafe"/></linearGradient>
  </defs>
  <rect width="160" height="120" rx="16" fill="url(#bg_t_bef)"/>
  <!-- Timeline horizontal axis -->
  <line x1="20" y1="72" x2="140" y2="72" stroke="#64748b" stroke-width="3" stroke-linecap="round"/>
  <polygon points="144,72 136,68 136,76" fill="#64748b"/>
  <!-- Center Marker (Event/Now) -->
  <circle cx="95" cy="72" r="5" fill="#0284c7"/>
  <!-- Left Target Highlight (BEFORE) -->
  <circle cx="48" cy="72" r="8" fill="#ef4444"/>
  <path d="M 85,55 L 55,55 M 62,49 L 52,55 L 62,61" stroke="#ef4444" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>''',

    "time_after": '''<svg viewBox="0 0 160 120" xmlns="http://www.w3.org/2000/svg" class="w-full h-full">
  <defs>
    <linearGradient id="bg_t_aft" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#ecfdf5"/><stop offset="100%" stop-color="#d1fae5"/></linearGradient>
  </defs>
  <rect width="160" height="120" rx="16" fill="url(#bg_t_aft)"/>
  <!-- Timeline horizontal axis -->
  <line x1="20" y1="72" x2="140" y2="72" stroke="#64748b" stroke-width="3" stroke-linecap="round"/>
  <polygon points="144,72 136,68 136,76" fill="#64748b"/>
  <!-- Center Marker (Event/Now) -->
  <circle cx="55" cy="72" r="5" fill="#059669"/>
  <!-- Right Target Highlight (AFTER) -->
  <circle cx="112" cy="72" r="8" fill="#10b981"/>
  <path d="M 68,55 L 102,55 M 95,49 L 105,55 L 95,61" stroke="#059669" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>''',

    "time_until": '''<svg viewBox="0 0 160 120" xmlns="http://www.w3.org/2000/svg" class="w-full h-full">
  <defs>
    <linearGradient id="bg_t_until" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#fffbeb"/><stop offset="100%" stop-color="#fef3c7"/></linearGradient>
  </defs>
  <rect width="160" height="120" rx="16" fill="url(#bg_t_until)"/>
  <!-- Span arrow from start to finish -->
  <line x1="25" y1="75" x2="115" y2="75" stroke="#f59e0b" stroke-width="4" stroke-linecap="round"/>
  <circle cx="25" cy="75" r="5" fill="#d97706"/>
  <!-- Goal Flag at End 🚩 -->
  <line x1="118" y1="40" x2="118" y2="85" stroke="#78350f" stroke-width="2.5"/>
  <polygon points="118,42 142,50 118,58" fill="#ef4444"/>
</svg>''',

    "time_throughout": '''<svg viewBox="0 0 160 120" xmlns="http://www.w3.org/2000/svg" class="w-full h-full">
  <defs>
    <linearGradient id="bg_t_thru" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#f5f3ff"/><stop offset="100%" stop-color="#ede9fe"/></linearGradient>
    <linearGradient id="bar_grad" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="#8b5cf6"/><stop offset="100%" stop-color="#ec4899"/></linearGradient>
  </defs>
  <rect width="160" height="120" rx="16" fill="url(#bg_t_thru)"/>
  <!-- Entire span filled block -->
  <rect x="25" y="55" width="110" height="26" rx="13" fill="url(#bar_grad)"/>
  <path d="M 22,90 L 138,90" stroke="#7c3aed" stroke-width="2" stroke-linecap="round"/>
</svg>''',

    "time_since": '''<svg viewBox="0 0 160 120" xmlns="http://www.w3.org/2000/svg" class="w-full h-full">
  <defs>
    <linearGradient id="bg_t_since" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#eff6ff"/><stop offset="100%" stop-color="#dbeafe"/></linearGradient>
  </defs>
  <rect width="160" height="120" rx="16" fill="url(#bg_t_since)"/>
  <!-- Flag in past -->
  <line x1="36" y1="46" x2="36" y2="85" stroke="#1e3a8a" stroke-width="2"/>
  <polygon points="36,48 54,54 36,60" fill="#2563eb"/>
  <!-- Arrow continuing from past to NOW -->
  <path d="M 40,70 L 126,70 M 118,64 L 128,70 L 118,76" stroke="#2563eb" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
  <circle cx="130" cy="70" r="5" fill="#ef4444"/>
</svg>''',

    "time_when": '''<svg viewBox="0 0 160 120" xmlns="http://www.w3.org/2000/svg" class="w-full h-full">
  <defs>
    <linearGradient id="bg_t_when" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#f0fdf4"/><stop offset="100%" stop-color="#dcfce7"/></linearGradient>
  </defs>
  <rect width="160" height="120" rx="16" fill="url(#bg_t_when)"/>
  <!-- Wall clock -->
  <circle cx="80" cy="66" r="28" fill="#ffffff" stroke="#16a34a" stroke-width="3"/>
  <circle cx="80" cy="66" r="3" fill="#15803d"/>
  <line x1="80" y1="66" x2="80" y2="48" stroke="#15803d" stroke-width="2.5" stroke-linecap="round"/>
  <line x1="80" y1="66" x2="94" y2="66" stroke="#15803d" stroke-width="2" stroke-linecap="round"/>
  <!-- Stars -->
  <text x="122" y="52" fill="#eab308" font-size="14">✨</text>
  <text x="32" y="75" fill="#eab308" font-size="14">✨</text>
</svg>''',

    "time_while": '''<svg viewBox="0 0 160 120" xmlns="http://www.w3.org/2000/svg" class="w-full h-full">
  <defs>
    <linearGradient id="bg_t_while" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#faf5ff"/><stop offset="100%" stop-color="#f3e8ff"/></linearGradient>
  </defs>
  <rect width="160" height="120" rx="16" fill="url(#bg_t_while)"/>
  <!-- Hourglass ⏳ in center -->
  <polygon points="65,40 95,40 80,65 95,90 65,90 80,65" fill="#e9d5ff" stroke="#9333ea" stroke-width="2"/>
  <polygon points="72,82 88,82 80,68" fill="#a855f7"/>
  <line x1="80" y1="58" x2="80" y2="66" stroke="#a855f7" stroke-width="2" stroke-dasharray="2,2"/>
</svg>''',

    "time_first": '''<svg viewBox="0 0 160 120" xmlns="http://www.w3.org/2000/svg" class="w-full h-full">
  <defs>
    <linearGradient id="bg_t_first" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#fff7ed"/><stop offset="100%" stop-color="#ffedd5"/></linearGradient>
  </defs>
  <rect width="160" height="120" rx="16" fill="url(#bg_t_first)"/>
  <!-- Number 1 Podium / Flag -->
  <rect x="55" y="55" width="50" height="42" rx="4" fill="#f97316" stroke="#c2410c" stroke-width="2"/>
  <circle cx="80" cy="42" r="16" fill="#facc15" stroke="#ca8a04" stroke-width="2"/>
  <text x="80" y="48" fill="#78350f" font-size="16" font-weight="black" text-anchor="middle">1</text>
</svg>'''
}

# Print check
print(f"Total SVGs defined: {len(SVGS)}")
