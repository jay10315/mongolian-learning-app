// ============================================================
// モンゴル語 指示代名詞・場所＆時間後置詞マスター データファイル
// 豊富なインラインSVGイラスト・詳細解説・音声再生完全対応
// ============================================================

export const SPATIAL_CATEGORIES = [
  {
    "id": "all",
    "name": "すべて",
    "icon": "🧭",
    "desc": "指示代名詞・場所・時間後置詞の全問特訓"
  },
  {
    "id": "spatial",
    "name": "空間・場所の後置詞",
    "icon": "📍",
    "desc": "上(дээр)・下(доор)・中(дотор)・前(өмнө)・後(ард)・間(хооронд)など"
  },
  {
    "id": "demonstrative",
    "name": "指示代名詞・方向詞",
    "icon": "👉",
    "desc": "これ(энэ)・あれ(тэр)・ここ(энд)・あそこ(тэнд)・こちらへ(наашаа)など"
  },
  {
    "id": "temporal",
    "name": "時間・時代表現の後置詞",
    "icon": "⏰",
    "desc": "〜前(өмнө)・〜後(дараа)・〜まで(хүртэл)・〜の間中(турш)・〜以来(хойш)など"
  }
];

export const SPATIAL_SVGS = {
  "box_on": `<svg viewBox="0 0 160 120" xmlns="http://www.w3.org/2000/svg" class="w-full h-full">
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
</svg>`,
  "box_under": `<svg viewBox="0 0 160 120" xmlns="http://www.w3.org/2000/svg" class="w-full h-full">
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
</svg>`,
  "box_inside": `<svg viewBox="0 0 160 120" xmlns="http://www.w3.org/2000/svg" class="w-full h-full">
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
</svg>`,
  "box_outside": `<svg viewBox="0 0 160 120" xmlns="http://www.w3.org/2000/svg" class="w-full h-full">
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
</svg>`,
  "box_front": `<svg viewBox="0 0 160 120" xmlns="http://www.w3.org/2000/svg" class="w-full h-full">
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
</svg>`,
  "box_behind": `<svg viewBox="0 0 160 120" xmlns="http://www.w3.org/2000/svg" class="w-full h-full">
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
</svg>`,
  "box_between": `<svg viewBox="0 0 160 120" xmlns="http://www.w3.org/2000/svg" class="w-full h-full">
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
</svg>`,
  "box_middle": `<svg viewBox="0 0 160 120" xmlns="http://www.w3.org/2000/svg" class="w-full h-full">
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
</svg>`,
  "box_beside": `<svg viewBox="0 0 160 120" xmlns="http://www.w3.org/2000/svg" class="w-full h-full">
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
</svg>`,
  "box_opposite": `<svg viewBox="0 0 160 120" xmlns="http://www.w3.org/2000/svg" class="w-full h-full">
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
</svg>`,
  "box_around": `<svg viewBox="0 0 160 120" xmlns="http://www.w3.org/2000/svg" class="w-full h-full">
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
</svg>`,
  "dir_left": `<svg viewBox="0 0 160 120" xmlns="http://www.w3.org/2000/svg" class="w-full h-full">
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
</svg>`,
  "dir_right": `<svg viewBox="0 0 160 120" xmlns="http://www.w3.org/2000/svg" class="w-full h-full">
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
</svg>`,
  "point_this": `<svg viewBox="0 0 160 120" xmlns="http://www.w3.org/2000/svg" class="w-full h-full">
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
</svg>`,
  "point_that": `<svg viewBox="0 0 160 120" xmlns="http://www.w3.org/2000/svg" class="w-full h-full">
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
</svg>`,
  "point_these": `<svg viewBox="0 0 160 120" xmlns="http://www.w3.org/2000/svg" class="w-full h-full">
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
</svg>`,
  "point_those": `<svg viewBox="0 0 160 120" xmlns="http://www.w3.org/2000/svg" class="w-full h-full">
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
</svg>`,
  "point_here": `<svg viewBox="0 0 160 120" xmlns="http://www.w3.org/2000/svg" class="w-full h-full">
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
</svg>`,
  "point_there": `<svg viewBox="0 0 160 120" xmlns="http://www.w3.org/2000/svg" class="w-full h-full">
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
</svg>`,
  "arrow_towards": `<svg viewBox="0 0 160 120" xmlns="http://www.w3.org/2000/svg" class="w-full h-full">
  <defs>
    <linearGradient id="bg_toward" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#eff6ff"/><stop offset="100%" stop-color="#dbeafe"/></linearGradient>
    <linearGradient id="arrow_grad_in" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#60a5fa"/><stop offset="100%" stop-color="#1d4ed8"/></linearGradient>
  </defs>
  <rect width="160" height="120" rx="16" fill="url(#bg_toward)"/>
  <!-- Big 3D Arrow coming toward screen/speaker -->
  <polygon points="65,30 95,30 95,65 115,65 80,105 45,65 65,65" fill="url(#arrow_grad_in)" stroke="#1e40af" stroke-width="2.5"/>
  <!-- Ripple lines at bottom -->
  <ellipse cx="80" cy="108" rx="36" ry="6" fill="#3b82f6" opacity="0.3"/>
</svg>`,
  "arrow_away": `<svg viewBox="0 0 160 120" xmlns="http://www.w3.org/2000/svg" class="w-full h-full">
  <defs>
    <linearGradient id="bg_away" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#fdf2f8"/><stop offset="100%" stop-color="#fce7f3"/></linearGradient>
    <linearGradient id="arrow_grad_out" x1="0" y1="1" x2="0" y2="0"><stop offset="0%" stop-color="#f472b6"/><stop offset="100%" stop-color="#be185d"/></linearGradient>
  </defs>
  <rect width="160" height="120" rx="16" fill="url(#bg_away)"/>
  <!-- Big 3D Arrow shooting AWAY into horizon -->
  <polygon points="65,100 95,100 95,65 115,65 80,25 45,65 65,65" fill="url(#arrow_grad_out)" stroke="#9d174d" stroke-width="2.5"/>
</svg>`,
  "arrow_up": `<svg viewBox="0 0 160 120" xmlns="http://www.w3.org/2000/svg" class="w-full h-full">
  <defs>
    <linearGradient id="bg_up" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#ecfeff"/><stop offset="100%" stop-color="#cffafe"/></linearGradient>
  </defs>
  <rect width="160" height="120" rx="16" fill="url(#bg_up)"/>
  <!-- Stairs leading UP -->
  <path d="M 25,100 L 50,100 L 50,80 L 75,80 L 75,60 L 100,60 L 100,40 L 125,40" fill="none" stroke="#0891b2" stroke-width="3" stroke-linecap="round"/>
  <!-- Arrow UP -->
  <path d="M 40,88 Q 75,45 115,30 M 102,28 L 118,29 L 115,44" fill="none" stroke="#06b6d4" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`,
  "arrow_down": `<svg viewBox="0 0 160 120" xmlns="http://www.w3.org/2000/svg" class="w-full h-full">
  <defs>
    <linearGradient id="bg_down" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#fff7ed"/><stop offset="100%" stop-color="#ffedd5"/></linearGradient>
  </defs>
  <rect width="160" height="120" rx="16" fill="url(#bg_down)"/>
  <!-- Stairs leading DOWN -->
  <path d="M 25,40 L 50,40 L 50,60 L 75,60 L 75,80 L 100,80 L 100,100 L 125,100" fill="none" stroke="#ea580c" stroke-width="3" stroke-linecap="round"/>
  <!-- Arrow DOWN -->
  <path d="M 38,32 Q 78,75 118,92 M 106,94 L 120,93 L 118,78" fill="none" stroke="#f97316" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`,
  "shape_like_this": `<svg viewBox="0 0 160 120" xmlns="http://www.w3.org/2000/svg" class="w-full h-full">
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
</svg>`,
  "shape_like_that": `<svg viewBox="0 0 160 120" xmlns="http://www.w3.org/2000/svg" class="w-full h-full">
  <defs>
    <linearGradient id="bg_that_shape" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#fffbeb"/><stop offset="100%" stop-color="#fef3c7"/></linearGradient>
  </defs>
  <rect width="160" height="120" rx="16" fill="url(#bg_that_shape)"/>
  <!-- Giant glowing star admiring from afar -->
  <polygon points="115,35 122,50 138,52 126,64 129,80 115,72 101,80 104,64 92,52 108,50" fill="#f59e0b" stroke="#b45309" stroke-width="2"/>
  <!-- Admiring eyes / exclamation -->
</svg>`,
  "time_before": `<svg viewBox="0 0 160 120" xmlns="http://www.w3.org/2000/svg" class="w-full h-full">
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
</svg>`,
  "time_after": `<svg viewBox="0 0 160 120" xmlns="http://www.w3.org/2000/svg" class="w-full h-full">
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
</svg>`,
  "time_until": `<svg viewBox="0 0 160 120" xmlns="http://www.w3.org/2000/svg" class="w-full h-full">
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
</svg>`,
  "time_throughout": `<svg viewBox="0 0 160 120" xmlns="http://www.w3.org/2000/svg" class="w-full h-full">
  <defs>
    <linearGradient id="bg_t_thru" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#f5f3ff"/><stop offset="100%" stop-color="#ede9fe"/></linearGradient>
    <linearGradient id="bar_grad" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="#8b5cf6"/><stop offset="100%" stop-color="#ec4899"/></linearGradient>
  </defs>
  <rect width="160" height="120" rx="16" fill="url(#bg_t_thru)"/>
  <!-- Entire span filled block -->
  <rect x="25" y="55" width="110" height="26" rx="13" fill="url(#bar_grad)"/>
  <path d="M 22,90 L 138,90" stroke="#7c3aed" stroke-width="2" stroke-linecap="round"/>
</svg>`,
  "time_since": `<svg viewBox="0 0 160 120" xmlns="http://www.w3.org/2000/svg" class="w-full h-full">
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
</svg>`,
  "time_when": `<svg viewBox="0 0 160 120" xmlns="http://www.w3.org/2000/svg" class="w-full h-full">
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
</svg>`,
  "time_while": `<svg viewBox="0 0 160 120" xmlns="http://www.w3.org/2000/svg" class="w-full h-full">
  <defs>
    <linearGradient id="bg_t_while" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#faf5ff"/><stop offset="100%" stop-color="#f3e8ff"/></linearGradient>
  </defs>
  <rect width="160" height="120" rx="16" fill="url(#bg_t_while)"/>
  <!-- Hourglass ⏳ in center -->
  <polygon points="65,40 95,40 80,65 95,90 65,90 80,65" fill="#e9d5ff" stroke="#9333ea" stroke-width="2"/>
  <polygon points="72,82 88,82 80,68" fill="#a855f7"/>
  <line x1="80" y1="58" x2="80" y2="66" stroke="#a855f7" stroke-width="2" stroke-dasharray="2,2"/>
</svg>`,
  "time_first": `<svg viewBox="0 0 160 120" xmlns="http://www.w3.org/2000/svg" class="w-full h-full">
  <defs>
    <linearGradient id="bg_t_first" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#fff7ed"/><stop offset="100%" stop-color="#ffedd5"/></linearGradient>
  </defs>
  <rect width="160" height="120" rx="16" fill="url(#bg_t_first)"/>
  <!-- Number 1 Podium / Flag -->
  <rect x="55" y="55" width="50" height="42" rx="4" fill="#f97316" stroke="#c2410c" stroke-width="2"/>
  <circle cx="80" cy="42" r="16" fill="#facc15" stroke="#ca8a04" stroke-width="2"/>
  <text x="80" y="48" fill="#78350f" font-size="16" font-weight="black" text-anchor="middle">1</text>
</svg>`,
};

export const SPATIAL_ITEMS = [
  {
    "id": "post_deer",
    "word": "дээр",
    "cyrillic": "дээр",
    "pronunciation": "デーレ",
    "japanese": "〜の上、〜の上に",
    "category": "spatial",
    "caseRequirement": "名詞の直接接続（または子音末尾名詞）",
    "summary": "物体の上部表面や接触している場所を示します。",
    "explanation": "「机の上」「ベッドの上」「草原の上」など、面の上に存在・接触している状態を表します。空間だけでなく「〜に関して（тухай）」の意味で用いられることもあります。",
    "example": "Ширээн дээр ном, дэвтэр байна.",
    "exampleJa": "机の上に本とノートがあります。",
    "svgKey": "box_on",
    "ruleTip": "名詞の末尾に直接「дээр」をつけます（例：ширээн дээр, ор дээр）。"
  },
  {
    "id": "post_door",
    "word": "доор",
    "cyrillic": "доор",
    "pronunciation": "ドール",
    "japanese": "〜の下、〜の下に",
    "category": "spatial",
    "caseRequirement": "名詞の属格 (-ын / -ийн) または直接接続",
    "summary": "物体の下側や覆われている空間を示します。",
    "explanation": "「椅子の下」「木の下」「橋の下」など、基準となる物の下部空間を表します。反意語は「дээр」です。",
    "example": "Сандлын доор жижигхэн муур унтаж байна.",
    "exampleJa": "椅子の下で小さな猫が眠っています。",
    "svgKey": "box_under",
    "ruleTip": "「сандлын доор (椅子の下)」「модны доор (木の下)」のように属格と結びつくのが標準的です。"
  },
  {
    "id": "post_dotor",
    "word": "дотор",
    "cyrillic": "дотор",
    "pronunciation": "ドトル",
    "japanese": "〜の中、〜の中に",
    "category": "spatial",
    "caseRequirement": "名詞の直接接続（または隠れн）",
    "summary": "囲まれた空間・容器・建物などの内部を示します。",
    "explanation": "「部屋の中」「箱の中」「カバンの中」「国の中」など内部を表します。「гадагш / гадна (外)」の対義語です。",
    "example": "Өрөөн дотор хэн ч байхгүй, чимээгүй байна.",
    "exampleJa": "部屋の中には誰もいなくて静かです。",
    "svgKey": "box_inside",
    "ruleTip": "「цүнхэн дотор (カバンの中)」「хайрцаг дотор (箱の中)」のように使います。"
  },
  {
    "id": "post_gadna",
    "word": "гадна",
    "cyrillic": "гадна",
    "pronunciation": "ガドナ",
    "japanese": "〜の外、〜の外に / 〜のほかに",
    "category": "spatial",
    "caseRequirement": "名詞の属格 (-ын / -ийн) または直接接続",
    "summary": "空間の外部を表すほか、「〜に加えて」「〜の他に」の意味も持ちます。",
    "explanation": "「家の外」「建物の外」という空間的な外部を示すだけでなく、「энэ номноос гадна (この本のほかに)」のように除外・追加表現でも多用されます。",
    "example": "Байшингийн гадна том мод болон машин байна.",
    "exampleJa": "家の外に大きな木と車があります。",
    "svgKey": "box_outside",
    "ruleTip": "空間の「外」は「байшингийн гадна」、除外の「〜の他に」は「үүний гадна」などで使われます。"
  },
  {
    "id": "post_omno_sp",
    "word": "өмнө",
    "cyrillic": "өмнө",
    "pronunciation": "オムヌ",
    "japanese": "〜の前、〜の前に [空間]",
    "category": "spatial",
    "caseRequirement": "名詞の属格 (-ын / -ийн)",
    "summary": "建物の正面や、人の真正面など、前方空間を示します。",
    "explanation": "「学校の前」「駅の前」など正面の位置を表します。※時間表現の「〜前（5年前など）」にも全く同じ単語「өмнө」が使われます。",
    "example": "Манай сургуулийн өмнө сайхан цэцэрлэгт хүрээлэн бий.",
    "exampleJa": "私たちの学校の前に美しい公園があります。",
    "svgKey": "box_front",
    "ruleTip": "「сургуулийн өмнө (学校の前)」のように、前に置く名詞は属格をとります。"
  },
  {
    "id": "post_ard",
    "word": "ард",
    "cyrillic": "ард",
    "pronunciation": "アルド",
    "japanese": "〜の後ろ、〜の裏に",
    "category": "spatial",
    "caseRequirement": "名詞の属格 (-ын / -ийн)",
    "summary": "建物の裏手、背後、後方を示します。",
    "explanation": "「ар талд」とも言います。「өмнө (前)」の対義語で、物体の背後・裏側を示します。（※なお単独の名詞「ард」は「人民・民衆」の意味もあります）。",
    "example": "Номын сангийн ард хүүхдийн тоглоомын талбай байна.",
    "exampleJa": "図書館の裏に子供の遊び場（公園）があります。",
    "svgKey": "box_behind",
    "ruleTip": "「номын сангийн ард (図書館の裏)」のように属格名詞の後ろに置きます。"
  },
  {
    "id": "post_khoino_sp",
    "word": "хойно",
    "cyrillic": "хойно",
    "pronunciation": "ホイノ",
    "japanese": "〜の後ろに、〜の北に",
    "category": "spatial",
    "caseRequirement": "名詞の属格 (-ын / -ийн)",
    "summary": "後方または北の方角を示します（モンゴルの伝統方位で北＝後ろ）。",
    "explanation": "ゲル（移動式住居）の構造上、南に入り口があり北（奥）が上座・後ろにあたるため、「хойно」は「後ろ」と「北」の両方を意味します。",
    "example": "Ширээний хойно багш зогсож байна.",
    "exampleJa": "机の後ろに先生が立っています。",
    "svgKey": "box_behind",
    "ruleTip": "方角の「北」としても使われます（Улаанбаатарын хойно ＝ ウランバートルの北に）。"
  },
  {
    "id": "post_derged",
    "word": "дэргэд",
    "cyrillic": "дэргэд",
    "pronunciation": "デルゲド",
    "japanese": "〜のそばに、〜の隣に",
    "category": "spatial",
    "caseRequirement": "名詞の属格 (-ын / -ийн) または人称代名詞属格",
    "summary": "すぐ近くのそば、傍ら、隣接した場所を示します。",
    "explanation": "「хажууд」とほぼ同義で使われます。「миний дэргэд (私のそばに)」のように人称代名詞ともよく結びつきます。",
    "example": "Та манай найзын дэргэд суугаарай.",
    "exampleJa": "私の友達の隣（そば）に座ってください。",
    "svgKey": "box_beside",
    "ruleTip": "「миний дэргэд (私のそばに)」「буудлын дэргэд (バス停のそばに)」のように使います。"
  },
  {
    "id": "post_khajuud",
    "word": "хажууд",
    "cyrillic": "хажууд",
    "pronunciation": "ハジュード",
    "japanese": "〜の横、〜の隣に",
    "category": "spatial",
    "caseRequirement": "名詞の属格 (-ын / -ийн)",
    "summary": "物理的な側面、横、隣の場所を示します。",
    "explanation": "「хажуу (側面・横)」の与位格形から派生した後置詞で、対象のすぐ横・隣の位置を表します。",
    "example": "Дэлгүүрийн хажууд эмийн сан байрладаг.",
    "exampleJa": "店の横（隣）に薬局があります。",
    "svgKey": "box_beside",
    "ruleTip": "「дэлгүүрийн хажууд」のように属格の後に置かれます。"
  },
  {
    "id": "post_khoorond",
    "word": "хооронд",
    "cyrillic": "хооронд",
    "pronunciation": "ホーフロンド",
    "japanese": "〜の間 [2者・2地点の間]",
    "category": "spatial",
    "caseRequirement": "2つの名詞を並べる、または複数形属格",
    "summary": "2つの物体・地点・人物の「あいだ（挟まれた空間）」を示します。",
    "explanation": "「A ба B-ийн хооронд (AとBの間)」「хоёр байшингийн хооронд (2つの家の間)」のように、はっきりと2者の間を指す時に使います（3者以上の集団の真ん中は「дунд」）。",
    "example": "Япон ба Монгол хоёр улсын хооронд найрамдалт харилцаа бий.",
    "exampleJa": "日本とモンゴル両国の間には友好関係があります。",
    "svgKey": "box_between",
    "ruleTip": "【超重要】2者の間なら「хооронд」、多数・群衆の中なら「дунд」を使います！"
  },
  {
    "id": "post_dund",
    "word": "дунд",
    "cyrillic": "дунд",
    "pronunciation": "ドンド",
    "japanese": "〜の真ん中、〜の中で [3者以上・集団]",
    "category": "spatial",
    "caseRequirement": "複数名詞属格 または 集合名詞",
    "summary": "多数の物・人・群衆の「真ん中・中心・渦中」を示します。",
    "explanation": "「хүмүүсийн дунд (人々の中で)」「ой модон дунд (森の真ん中で)」のように、周りを取り囲まれている中心を表します。",
    "example": "Тэр олон хүний дунд зогсож байсан.",
    "exampleJa": "彼は大勢の人々の真ん中に立っていました。",
    "svgKey": "box_middle",
    "ruleTip": "「2つの間」は хооронд、「3つ以上の群れの中」は дунд と使い分けます。"
  },
  {
    "id": "post_esreg",
    "word": "эсрэг талд",
    "cyrillic": "эсрэг талд",
    "pronunciation": "エスレグ タルド",
    "japanese": "〜の向かい側、反対側に",
    "category": "spatial",
    "caseRequirement": "名詞の属格 (-ын / -ийн)",
    "summary": "道路や広場などを挟んで正面に対面している向かい側を示します。",
    "explanation": "「эсрэг (反対・向かい)」＋「тал (側)」＋「-д (与位格)」から成る表現で、道向かいの建物などを指す時に頻出します。",
    "example": "Галт тэрэгний буудлын эсрэг талд том зочид буудал бий.",
    "exampleJa": "駅の向かい側に大きなホテルがあります。",
    "svgKey": "box_opposite",
    "ruleTip": "「буудлын эсрэг талд (駅の向かい側に)」のように属格を取ります。"
  },
  {
    "id": "post_toirond",
    "word": "тойронд",
    "cyrillic": "тойронд",
    "pronunciation": "トイロンド",
    "japanese": "〜の周り、周囲に",
    "category": "spatial",
    "caseRequirement": "名詞の属格 (-ын / -ийн)",
    "summary": "物体の周囲、円を描くような周辺空間を示します。",
    "explanation": "「эргэн тойронд」とも言います。「нуурын тойронд (湖の周りに)」「ширээний тойронд (机の周りに)」のように使います。",
    "example": "Сайхан нуурын тойронд ногоон моднууд ургаж байна.",
    "exampleJa": "美しい湖の周りに緑の木々が生えています。",
    "svgKey": "box_around",
    "ruleTip": "「эргэн тойронд」と「тойронд」は同義で、取り囲む円周上を指します。"
  },
  {
    "id": "post_zuun",
    "word": "зүүн талд",
    "cyrillic": "зүүн талд",
    "pronunciation": "ズーヌ タルド",
    "japanese": "〜の左側に、〜の東側に",
    "category": "spatial",
    "caseRequirement": "名詞の属格 (-ын / -ийн)",
    "summary": "左側、または方角の東側を示します（南を向いた伝統視点で左＝東）。",
    "explanation": "モンゴル語では「зүүн」が「左」と「東」の2つの意味を持ちます。「ゲルから南を向いて立つ」という遊牧文化に由来します。",
    "example": "Зургийн зүүн талд миний найз зогсож байна.",
    "exampleJa": "写真の左側に私の友達が立っています。",
    "svgKey": "dir_left",
    "ruleTip": "「зүүн」＝「左」かつ「東」！対義語は「баруун（右・西）」です。"
  },
  {
    "id": "post_baruun",
    "word": "баруун талд",
    "cyrillic": "баруун талд",
    "pronunciation": "バルーヌ タルド",
    "japanese": "〜の右側に、〜の西側に",
    "category": "spatial",
    "caseRequirement": "名詞の属格 (-ын / -ийн)",
    "summary": "右側、または方角の西側を示します（南を向いた視点で右＝西）。",
    "explanation": "モンゴル語で「баруун」は「右」と「西」を意味します。ゲルは南向きに建てるため、右手側が常に西になります。",
    "example": "Ширээний баруун талд компьютер тавиарай.",
    "exampleJa": "机の右側にパソコンを置いてください。",
    "svgKey": "dir_right",
    "ruleTip": "「баруун」＝「右」かつ「西」！「зүүн」の反対語です。"
  },
  {
    "id": "dem_ene",
    "word": "энэ",
    "cyrillic": "энэ",
    "pronunciation": "エネ",
    "japanese": "これ、この [近称]",
    "category": "demonstrative",
    "caseRequirement": "名詞の前に置く（限定詞）または単独で主語・補語",
    "summary": "話者のすぐ手元・至近距離にある物や人を指します。",
    "explanation": "日本語の「これ」「この」に相当する近称指示詞です。名詞の前につけると「この〜（энэ ном = この本）」、単独では「これ（Энэ юу вэ? = これは何ですか？）」になります。",
    "example": "Энэ бол миний Японоос авчирсан бэлэг юм.",
    "exampleJa": "これは私が日本から持ってきたプレゼントです。",
    "svgKey": "point_this",
    "ruleTip": "話者の手元にある身近なものはすべて「энэ」です。"
  },
  {
    "id": "dem_ter",
    "word": "тэр",
    "cyrillic": "тэр",
    "pronunciation": "テレ",
    "japanese": "あれ、それ、あの、その [遠称・既知]",
    "category": "demonstrative",
    "caseRequirement": "名詞の前に置く、または単独代名詞",
    "summary": "離れた対象、または話題にのぼっている既知の対象を指します。",
    "explanation": "モンゴル語には日本語のような「これ・それ・あれ」の3区分がなく、「энэ (近称)」と「тэр (遠称)」の2大区分が基本です。相手の近くのものも「тэр」で表します。",
    "example": "Тэр уулын орой дээр цас орсон байна.",
    "exampleJa": "あの山の頂上に雪が降っています。",
    "svgKey": "point_that",
    "ruleTip": "モンゴル語は「これ(энэ)」と「あれ/それ(тэр)」の2分法が基本！"
  },
  {
    "id": "dem_edgeer",
    "word": "эдгээр",
    "cyrillic": "эдгээр",
    "pronunciation": "エドゲール",
    "japanese": "これら、これらの [近称複数]",
    "category": "demonstrative",
    "caseRequirement": "名詞の前に置く、または単独複数主語",
    "summary": "手元にある複数の物や人をまとめて指します。",
    "explanation": "「энэ」の複数形から派生した指示詞で、「これらの〜（эдгээр ном = これらの本）」のように使われます。",
    "example": "Эдгээр дасгалыг өнөөдөр заавал хийж дуусгаарай.",
    "exampleJa": "これらの練習問題を今日必ずやり終えてください。",
    "svgKey": "point_these",
    "ruleTip": "手元の「複数の対象」を指すときは「эдгээр」を使います。"
  },
  {
    "id": "dem_tedgeer",
    "word": "тэдгээр",
    "cyrillic": "тэдгээр",
    "pronunciation": "テドゲール",
    "japanese": "あれら、それら、あの〜たち [遠称複数]",
    "category": "demonstrative",
    "caseRequirement": "名詞の前に置く、または単独複数主語",
    "summary": "離れた場所にある複数の対象、または話題の複数のものを指します。",
    "explanation": "「тэр」の複数形から派生した指示詞で、「あれらの〜（тэдгээр хүмүүс = あの人々）」のように遠くの複数を指します。",
    "example": "Тэдгээр морьд тал нутагт эрх чөлөөтэй давхиж байна.",
    "exampleJa": "あの馬たちは大草原を自由に疾走しています。",
    "svgKey": "point_those",
    "ruleTip": "遠くの「複数の対象」を指すときは「тэдгээр」を使います。"
  },
  {
    "id": "dem_end",
    "word": "энд",
    "cyrillic": "энд",
    "pronunciation": "エンド",
    "japanese": "ここ、ここで [場所近称]",
    "category": "demonstrative",
    "caseRequirement": "場所の副詞（文中で述語を修飾）",
    "summary": "話者が今いる場所、足元、この地点を示します。",
    "explanation": "「энэ」に場所の格語尾がついた形で、「ここで（at here）」または「ここへ（to here）」の意味で幅広く使われます。",
    "example": "Та энд түр хүлээгээрэй, би удахгүй ирнэ.",
    "exampleJa": "ここで少し待っていてください、すぐに戻ります。",
    "svgKey": "point_here",
    "ruleTip": "「энд」＝「ここ（で）」。「Энд суу (ここに座って)」のように使います。"
  },
  {
    "id": "dem_tend",
    "word": "тэнд",
    "cyrillic": "тэнд",
    "pronunciation": "テンド",
    "japanese": "あそこ、そこで [場所遠称]",
    "category": "demonstrative",
    "caseRequirement": "場所の副詞",
    "summary": "話者から離れた場所、あちらの地点を示します。",
    "explanation": "「тэр」に対応する場所の指示詞です。「あそこで（at there）」または「あそこへ（to there）」を表します。",
    "example": "Тэнд маш амттай хоолтой монгол ресторан бий.",
    "exampleJa": "あそこにとてもおいしい料理があるモンゴル料理店があります。",
    "svgKey": "point_there",
    "ruleTip": "「энд (ここ)」の対義語が「тэнд (あそこ・そこ)」です。"
  },
  {
    "id": "dem_naashaa",
    "word": "наашаа",
    "cyrillic": "наашаа",
    "pronunciation": "ナーシャー",
    "japanese": "こちらへ、手前へ [方向近称]",
    "category": "demonstrative",
    "caseRequirement": "方向を表す副詞（移動動詞と共起）",
    "summary": "話者のいる手前の方向へ向かってくる動きを示します。",
    "explanation": "「нааш (こちらへ)」の方向格（-аа⁴）が付いた形で、「Наашаа ир! (こっちにおいで！)」のように移動動詞とセットで非常に良く使われます。",
    "example": "Наашаа сууж, хамтдаа халуун цай ууя.",
    "exampleJa": "こちらに座って、一緒に温かいお茶を飲みましょう。",
    "svgKey": "arrow_towards",
    "ruleTip": "「こちらへ向かう動き」は「наашаа」！「Наашаа хүрээд ир (こっちにおいで)」"
  },
  {
    "id": "dem_tsaashaa",
    "word": "цаашаа",
    "cyrillic": "цаашаа",
    "pronunciation": "ツァーシャー",
    "japanese": "あちらへ、向こうへ [方向遠称]",
    "category": "demonstrative",
    "caseRequirement": "方向を表す副詞（移動動詞と共起）",
    "summary": "話者から離れて向こう側・奥へ進んでいく動きを示します。",
    "explanation": "「наашаа (こちらへ)」の対義語です。「Цаашаа яв (あっちへ行け・向こうへ進め)」や「もっと奥へ」の意味を表します。",
    "example": "Замаар цаашаа чигээрээ явбал эмнэлэг харагдана.",
    "exampleJa": "この道をあちらへ真っ直ぐ行くと病院が見えます。",
    "svgKey": "arrow_away",
    "ruleTip": "「あちらへ・向こうへ」離れる方向は「цаашаа」です。"
  },
  {
    "id": "dem_deeshee",
    "word": "дээшээ",
    "cyrillic": "дээшээ",
    "pronunciation": "デーシェー",
    "japanese": "上へ、上方に",
    "category": "demonstrative",
    "caseRequirement": "方向を表す副詞",
    "summary": "上方・階段の上・山の上などへ向かう動きを示します。",
    "explanation": "「дээш」の方向格で、「上へ上がる（дээшээ гарах）」「上を見る（дээшээ харах）」のように使います。",
    "example": "Хоёр давхар луу шатаар дээшээ гараарай.",
    "exampleJa": "階段で2階へ上へ上がってください。",
    "svgKey": "arrow_up",
    "ruleTip": "「上へ」は「дээшээ」、対義語の「下へ」は「доошоо」です。"
  },
  {
    "id": "dem_dooshoo",
    "word": "доошоо",
    "cyrillic": "доошоо",
    "pronunciation": "ドーショー",
    "japanese": "下へ、下方に",
    "category": "demonstrative",
    "caseRequirement": "方向を表す副詞",
    "summary": "下方・地面・階段の下などへ向かう動きを示します。",
    "explanation": "「доош」の方向格で、「下へ降りる（доошоо буух）」「下にしゃがむ（доошоо суух）」などで使います。",
    "example": "Лифтээр нэг давхар луу доошоо бууя.",
    "exampleJa": "エレベーターで1階へ下へ降りましょう。",
    "svgKey": "arrow_down",
    "ruleTip": "「下へ」は「доошоо」です。"
  },
  {
    "id": "dem_iim",
    "word": "ийм",
    "cyrillic": "ийм",
    "pronunciation": "イーム",
    "japanese": "このような、こんな",
    "category": "demonstrative",
    "caseRequirement": "名詞の前を修飾（連体形）",
    "summary": "手元にあるものと同様の性質・状態・様態を示します。",
    "explanation": "「ийм ном (こんな本)」「ийм том (こんなに大きい)」のように、手近な例や自分側の様態を指します。",
    "example": "Би ийм гоё амттай монгол хоол анх удаа идэж байна.",
    "exampleJa": "私はこんなに美味しいモンゴル料理を初めて食べています。",
    "svgKey": "shape_like_this",
    "ruleTip": "「こんな・このような」＝「ийм」。「あんな・そんな」＝「тийм」です。"
  },
  {
    "id": "dem_tiim",
    "word": "тийм",
    "cyrillic": "тийм",
    "pronunciation": "ティーム",
    "japanese": "あのような、そんな、あんな / そうです",
    "category": "demonstrative",
    "caseRequirement": "名詞の前を修飾、または返事の「はい」",
    "summary": "離れた対象の性質・様態を示すほか、肯定の相槌「そうです」にも使われます。",
    "explanation": "「тийм хүн (あんな人)」「тийм ээ (そうです)」のように、様態指示詞と相槌の両面で最重要語彙です。",
    "example": "Тийм том уулыг өмнө нь хэзээ ч харж байгаагүй.",
    "exampleJa": "あんなに大きな山は以前一度も見たことがありませんでした。",
    "svgKey": "shape_like_that",
    "ruleTip": "様態指示「あのような」だけでなく「Тийм (はい/そうです)」の返答でも頻出！"
  },
  {
    "id": "temp_omno",
    "word": "өмнө",
    "cyrillic": "өмнө",
    "pronunciation": "オムヌ",
    "japanese": "〜の前に [時間]",
    "category": "temporal",
    "caseRequirement": "名詞・時間詞（属格または直接接続）、動名詞（-хын/-хийн өмнө）",
    "summary": "ある出来事や基準時よりも過去・事前の時点を示します。",
    "explanation": "「хоёр жилийн өмнө (2年前)」「хоол идэхийн өмнө (食事をする前に)」のように、時間の前を表す最重要語です。",
    "example": "Хоол идэхийн өмнө гараа заавал сайн угаагаарай.",
    "exampleJa": "ご飯を食べる前に必ず手をよく洗いましょう。",
    "svgKey": "time_before",
    "ruleTip": "動詞につけるときは「動詞語幹 ＋ -хын/-хийн өмнө (〜する前に)」の形になります！"
  },
  {
    "id": "temp_daraa",
    "word": "дараа",
    "cyrillic": "дараа",
    "pronunciation": "ダラー",
    "japanese": "〜の後に、〜の次に [時間]",
    "category": "temporal",
    "caseRequirement": "名詞の属格 (-ын / -ийн)、動名詞（-сны/-сний дараа）",
    "summary": "ある出来事の終了後、事後の時点を示します。",
    "explanation": "「хичээлийн дараа (授業の後に)」「хоол идсэний дараа (ご飯を食べた後に)」のように用います。",
    "example": "Хичээл тарсны дараа хамтдаа номын сан явъя.",
    "exampleJa": "授業が終わった後に一緒に図書館へ行きましょう。",
    "svgKey": "time_after",
    "ruleTip": "動詞につけるときは過去形動名詞「-сны/-сний дараа (〜した後に)」が基本形です！"
  },
  {
    "id": "temp_khurtel",
    "word": "хүртэл",
    "cyrillic": "хүртэл",
    "pronunciation": "フルテル",
    "japanese": "〜まで [時間・空間の限界・終点]",
    "category": "temporal",
    "caseRequirement": "名詞・時間詞の直接接続、または動詞（-тал⁴/-тэл⁴ хүртэл）",
    "summary": "時間や場所の終点・限度「〜まで」を示します。",
    "explanation": "「таван цаг хүртэл (5時まで)」「маргааш хүртэл (明日まで)」「Улаанбаатар хүртэл (ウランバートルまで)」のように時間と場所の両方に使えます。",
    "example": "Би оройн зургаан цаг хүртэл энд хичээлээ хийнэ.",
    "exampleJa": "私は夕方6時までここで勉強をします。",
    "svgKey": "time_until",
    "ruleTip": "「〜から〜まで」は「-аас⁴ ... хүртэл (例: 9 цагаас 17 цаг хүртэл)」のペアで頻出！"
  },
  {
    "id": "temp_tursh",
    "word": "турш",
    "cyrillic": "турш",
    "pronunciation": "トルシ",
    "japanese": "〜の間中、〜ずっと [期間全体]",
    "category": "temporal",
    "caseRequirement": "期間を表す名詞の直接接続（または再帰属格）",
    "summary": "ある時間・期間の最初から最後まで途切れず継続することを示します。",
    "explanation": "「жилийн турш (1年間ずっと)」「бүтэн өдрийн турш (一日中ずっと)」「амралтынхаа турш (休暇の間ずっと)」のように使います。",
    "example": "Тэр бүтэн жилийн турш монгол хэл хичээнгүйлэн сурсан.",
    "exampleJa": "彼は丸一年の間ずっと熱心にモンゴル語を勉強しました。",
    "svgKey": "time_throughout",
    "ruleTip": "「期間の最初から最後までずっと」継続するニュアンスを持ちます。"
  },
  {
    "id": "temp_khoish",
    "word": "хойш",
    "cyrillic": "хойш",
    "pronunciation": "ホイシ",
    "japanese": "〜以来、〜からずっと [過去起点]",
    "category": "temporal",
    "caseRequirement": "名詞の奪格 (-аас⁴ / -оос⁴ / -өөс⁴ / -ээс⁴) ＋ хойш",
    "summary": "過去の特定時点から現在に至るまでの継続を示します。",
    "explanation": "必ず「奪格（-аас⁴）」とセットで使われます。「Монголд ирснээс хойш (モンゴルに来て以来)」「өглөөнөөс хойш (朝からずっと)」のように使います。",
    "example": "Монголд ирснээс хойш хоёр сар өнгөрсөн байна.",
    "exampleJa": "モンゴルに来て以来、2ヶ月が過ぎました。",
    "svgKey": "time_since",
    "ruleTip": "【超重要公式】必ず「奪格（-аас⁴）＋ хойш」の組み合わせになります！"
  },
  {
    "id": "temp_ued",
    "word": "үед",
    "cyrillic": "үед",
    "pronunciation": "ウェド",
    "japanese": "〜の時に、〜の頃に",
    "category": "temporal",
    "caseRequirement": "名詞の属格、または動名詞（-х үед, -сан үед）",
    "summary": "ある出来事が発生した「時点」「時期」「時代」を示します。",
    "explanation": "「үе (時・時代)」の与位格形です。「хүүхэд байх үедээ (子供の頃に)」「чөлөөт цагаараа / завтай үедээ (暇な時に)」のように用います。",
    "example": "Би бага байх үедээ төгөлдөр хуур тоглодог байсан.",
    "exampleJa": "私は幼かった頃、ピアノを弾いていました。",
    "svgKey": "time_when",
    "ruleTip": "「〜する時」＝「-х үед」、「〜した時」＝「-сан⁴ үед」で表します。"
  },
  {
    "id": "temp_zuur",
    "word": "зуур",
    "cyrillic": "зуур",
    "pronunciation": "ズール",
    "japanese": "〜の合間に、〜している間に",
    "category": "temporal",
    "caseRequirement": "動名詞（-х зуур / -х зуураа）",
    "summary": "ある動作を行っている最中のわずかな時間や合間を示します。",
    "explanation": "「цай уух зуураа (お茶を飲んでいる合間に)」「амарч суух зуур (休んでいる間に)」のように、別の行動の最中の時間的隙間を表します。",
    "example": "Кофе уух зуураа бид сонин сайхан зүйл ярилцсан.",
    "exampleJa": "コーヒーを飲む合間に、私たちは近況や面白い話を取り交わしました。",
    "svgKey": "time_while",
    "ruleTip": "「動作の合間に別のことをする」ニュアンスで使われます。"
  },
  {
    "id": "temp_ekhleed",
    "word": "эхлээд",
    "cyrillic": "эхлээд",
    "pronunciation": "エフレード",
    "japanese": "まず初めに、最初に",
    "category": "temporal",
    "caseRequirement": "文頭・文中の副詞",
    "summary": "複数の順序の中で「まず第一に」行う行動を示します。",
    "explanation": "「эхлэх (始まる)」の副動詞形（-аад⁴）から副詞化したもので、「Эхлээд ..., дараа нь ... (まず初めに〜、その後に〜)」という手順説明で定番です。",
    "example": "Эхлээд гараа угаагаад, дараа нь хоолоо иднэ үү.",
    "exampleJa": "まず初めに手を洗って、その後に食事をしてください。",
    "svgKey": "time_first",
    "ruleTip": "「эхлээд (まず最初に) → дараа нь (その後に)」の順序コンボが鉄板です！"
  }
];

export const spatialQuizzes = [
  {
    "id": "sq_1",
    "category": "spatial",
    "svgKey": "box_on",
    "prompt": "Ширээн ___ шинэ ном, дэвтэр байна.",
    "promptJa": "机の___新しい本とノートがあります。",
    "options": [
      "дээр",
      "доор",
      "дотор",
      "гадна"
    ],
    "answer": "дээр",
    "explanation": "【正解: дээр (〜の上)】\nイラストのように、机の上面に接触して物が載っている状態を表すため「дээр」が正解です。\n・доор: 〜の下\n・дотор: 〜の中\n・гадна: 〜の外"
  },
  {
    "id": "sq_2",
    "category": "spatial",
    "svgKey": "box_under",
    "prompt": "Сандлын ___ хөөрхөн жижигхэн муур унтаж байна.",
    "promptJa": "椅子の___可愛い小さな猫が眠っています。",
    "options": [
      "доор",
      "дээр",
      "өмнө",
      "хооронд"
    ],
    "answer": "доор",
    "explanation": "【正解: доор (〜の下)】\nイラストのように、椅子の下側の空間に入って眠っているため「доор (下)」が正解です。\n・дээр: 上\n・өмнө: 前\n・хооронд: （2者の）間"
  },
  {
    "id": "sq_3",
    "category": "spatial",
    "svgKey": "box_inside",
    "prompt": "Цүнхэн ___ миний түлхүүр болон гар утас байна.",
    "promptJa": "バッグの___私の鍵と携帯電話があります。",
    "options": [
      "дотор",
      "гадна",
      "дээр",
      "ард"
    ],
    "answer": "дотор",
    "explanation": "【正解: дотор (〜の中)】\nカバンや箱など、閉じた入れ物や空間の「内部」に入っている時は「дотор」を用います。\n・гадна: 外\n・дээр: 上\n・ард: 後ろ"
  },
  {
    "id": "sq_4",
    "category": "spatial",
    "svgKey": "box_outside",
    "prompt": "Байшингийн ___ цас орж, хүйтэн салхи салхилж байна.",
    "promptJa": "家の___雪が降り、冷たい風が吹いています。",
    "options": [
      "гадна",
      "дотор",
      "дээр",
      "дунд"
    ],
    "answer": "гадна",
    "explanation": "【正解: гадна (〜の外)】\nイラストのように建物の外側の空間を表すため「гадна」が正解です。\n・дотор: 中\n・дээр: 上\n・дунд: 真ん中"
  },
  {
    "id": "sq_5",
    "category": "spatial",
    "svgKey": "box_front",
    "prompt": "Сургуулийн ___ том мод болон сайхан цэцэгс ургажээ.",
    "promptJa": "学校の___大きな木と美しい花々が生えています。",
    "options": [
      "өмнө",
      "хойно",
      "доор",
      "дээр"
    ],
    "answer": "өмнө",
    "explanation": "【正解: өмнө (〜の前)】\nイラストのように建物の正面（前）を表す位置関係は「өмнө」です。\n・хойно: 後ろ\n・доор: 下\n・дээр: 上"
  },
  {
    "id": "sq_6",
    "category": "spatial",
    "svgKey": "box_behind",
    "prompt": "Номын сангийн ___ хүүхдүүдийн тоглох сагсан бөмбөгийн талбай бий.",
    "promptJa": "図書館の___子供たちが遊ぶバスケットボール場があります。",
    "options": [
      "ард",
      "өмнө",
      "дотор",
      "дээр"
    ],
    "answer": "ард",
    "explanation": "【正解: ард (〜の後ろ・裏)】\nイラストのように建物の背後・裏側を示すのは「ард（または ар талд）」です。\n・өмнө: 前\n・дотор: 中\n・дээр: 上"
  },
  {
    "id": "sq_7",
    "category": "spatial",
    "svgKey": "box_between",
    "prompt": "Хоёр байшингийн ___ нарийхан жим зам байна.",
    "promptJa": "2つの家の___細い小道があります。",
    "options": [
      "хооронд",
      "дунд",
      "дээр",
      "гадна"
    ],
    "answer": "хооронд",
    "explanation": "【正解: хооронд (2者の間)】\n「Хоёр байшин (2つの家)」のように、はっきりと【2つの対象に挟まれた間】を指すときは「хооронд」を使います！\n※3者以上の群集や集団の真ん中なら「дунд」になります。"
  },
  {
    "id": "sq_8",
    "category": "spatial",
    "svgKey": "box_middle",
    "prompt": "Тэр олон хүмүүсийн ___ зогсоод инээмсэглэж байв.",
    "promptJa": "彼は大勢の人々の___立って微笑んでいました。",
    "options": [
      "дунд",
      "хооронд",
      "доор",
      "гадна"
    ],
    "answer": "дунд",
    "explanation": "【正解: дунд (〜の真ん中・中)】\nイラストのように、「олон хүмүүс (大勢の人々)」という多数の群衆・集団に取り囲まれた中心・真ん中は「дунд」を使います。\n※2者の間は「хооронд」です。"
  },
  {
    "id": "sq_9",
    "category": "spatial",
    "svgKey": "box_beside",
    "prompt": "Миний ___ суугаад, энэ зургийг хамт хараарай.",
    "promptJa": "私の___座って、この写真を一緒に見てください。",
    "options": [
      "дэргэд",
      "доор",
      "ард",
      "хооронд"
    ],
    "answer": "дэргэд",
    "explanation": "【正解: дэргэд (〜のそば・隣)】\nイラストのようにすぐ横・傍らに並ぶ位置関係は「дэргэд（または хажууд）」です。\n・миний дэргэд: 私の隣に / 私のそばに"
  },
  {
    "id": "sq_10",
    "category": "spatial",
    "svgKey": "box_opposite",
    "prompt": "Замын ___ шинэ эмийн сан нээгдсэн байна.",
    "promptJa": "道路の___新しい薬局がオープンしています。",
    "options": [
      "эсрэг талд",
      "дотор",
      "дээр",
      "хооронд"
    ],
    "answer": "эсрэг талд",
    "explanation": "【正解: эсрэг талд (〜の向かい側・反対側に)】\n道路や広場などを挟んで正面に対面している位置関係を表すため「эсрэг талд」が正解です。"
  },
  {
    "id": "sq_11",
    "category": "spatial",
    "svgKey": "box_around",
    "prompt": "Сайхан нуурын ___ олон ногоон мод ургажээ.",
    "promptJa": "美しい湖の___たくさんの緑の木が生えています。",
    "options": [
      "тойронд",
      "дотор",
      "хооронд",
      "доор"
    ],
    "answer": "тойронд",
    "explanation": "【正解: тойронд (〜の周り・周囲に)】\nイラストのように対象の周囲をぐるりと取り囲む円周上の位置関係は「тойронд（または эргэн тойронд）」です。"
  },
  {
    "id": "sq_12",
    "category": "spatial",
    "svgKey": "dir_left",
    "prompt": "Ширээний ___ талд номын тавиур байна.",
    "promptJa": "机の___側に本棚があります。",
    "options": [
      "зүүн",
      "дээр",
      "дотор",
      "хооронд"
    ],
    "answer": "зүүн",
    "explanation": "【正解: зүүн (左 / 東)】\n左側を表すモンゴル語は「зүүн」です（зүүн талд ＝ 左側に）。\n※モンゴルの伝統方位では南を向いて立つため「зүүн」は「左」と「東」の両方を意味します。"
  },
  {
    "id": "sq_13",
    "category": "spatial",
    "svgKey": "dir_right",
    "prompt": "Зургийн ___ талд байгаа хүн бол манай аав юм.",
    "promptJa": "写真の___側にいる人は私の父です。",
    "options": [
      "баруун",
      "зүүн",
      "дотор",
      "гадна"
    ],
    "answer": "баруун",
    "explanation": "【正解: баруун (右 / 西)】\n右側を表す単語は「баруун」です（баруун талд ＝ 右側に）。\n※方角の「西」の意味も持ちます。"
  },
  {
    "id": "sq_14",
    "category": "demonstrative",
    "svgKey": "point_this",
    "prompt": "___ ном маш сонирхолтой тул би өдөр бүр уншдаг.",
    "promptJa": "___本はとても面白いので、私は毎日読んでいます。",
    "options": [
      "Энэ",
      "Тэр",
      "Тэнд",
      "Цаашаа"
    ],
    "answer": "Энэ",
    "explanation": "【正解: Энэ (これ / この)】\n話者の手元にある身近な対象を指す近称指示詞は「Энэ」です。\n・Тэр: あれ / あの\n・Тэнд: あそこで\n・Цаашаа: あちらへ"
  },
  {
    "id": "sq_15",
    "category": "demonstrative",
    "svgKey": "point_that",
    "prompt": "___ алсын цэнхэр уулыг хар даа, ямар сайхан бэ!",
    "promptJa": "___遠くの青い山をごらん、なんて美しいのでしょう！",
    "options": [
      "Тэр",
      "Энэ",
      "Энд",
      "Наашаа"
    ],
    "answer": "Тэр",
    "explanation": "【正解: Тэр (あれ / あの)】\n遠く離れた対象を指す遠称指示詞は「Тэр」です。\n・Энэ: これ / この\n・Энд: ここで\n・Наашаа: こちらへ"
  },
  {
    "id": "sq_16",
    "category": "demonstrative",
    "svgKey": "point_these",
    "prompt": "___ шинэ үгсийг цээжилбэл шалгалтад тустай.",
    "promptJa": "___新しい単語たちを暗記すれば試験に役立ちます。",
    "options": [
      "Эдгээр",
      "Тэдгээр",
      "Тэр",
      "Тэнд"
    ],
    "answer": "Эдгээр",
    "explanation": "【正解: Эдгээр (これら / これらの)】\n手元にある「複数の対象」をまとめて指す近称複数指示詞は「Эдгээр」です。\n・Тэдгээр: あれら / それら"
  },
  {
    "id": "sq_17",
    "category": "demonstrative",
    "svgKey": "point_those",
    "prompt": "Тал нутагт бэлчиж буй ___ олон адууг хараарай.",
    "promptJa": "草原で草を食んでいる___たくさんの馬たちをごらん。",
    "options": [
      "тэдгээр",
      "эдгээр",
      "энэ",
      "энд"
    ],
    "answer": "тэдгээр",
    "explanation": "【正解: тэдгээр (あれら / それら / あの〜たち)】\n遠くにある複数の対象を指す遠称複数指示詞は「тэдгээр」です。"
  },
  {
    "id": "sq_18",
    "category": "demonstrative",
    "svgKey": "point_here",
    "prompt": "Би одоо ___ амьдарч байна. Чи хэзээ ирэх вэ?",
    "promptJa": "私は今___住んでいます。あなたはいつ来ますか？",
    "options": [
      "энд",
      "тэнд",
      "наашаа",
      "цаашаа"
    ],
    "answer": "энд",
    "explanation": "【正解: энд (ここ / ここで)】\n話者の現在地・足元の場所を指すのは「энд」です。\n・тэнд: あそこ（で）\n・наашаа: こちらへ（方向）\n・цаашаа: あちらへ（方向）"
  },
  {
    "id": "sq_19",
    "category": "demonstrative",
    "svgKey": "point_there",
    "prompt": "___ нэг том банк болон шуудангийн газар бий.",
    "promptJa": "___ひとつの大きな銀行と郵便局があります。",
    "options": [
      "Тэнд",
      "Энд",
      "Ийм",
      "Дээшээ"
    ],
    "answer": "Тэнд",
    "explanation": "【正解: Тэнд (あそこ / そこ / あそこで)】\n離れた場所を指す場所遠称指示詞は「Тэнд」です。"
  },
  {
    "id": "sq_20",
    "category": "demonstrative",
    "svgKey": "arrow_towards",
    "prompt": "Цаг агаар хүйтэн байна, ___ гэрт ороод дулаац.",
    "promptJa": "天気が寒いです、___家の中に入って暖まって。",
    "options": [
      "наашаа",
      "цаашаа",
      "тэнд",
      "доошоо"
    ],
    "answer": "наашаа",
    "explanation": "【正解: наашаа (こちらへ / 手前へ)】\n話者のいる方向に向かってくる動きを表すのは「наашаа」です。\n対義語は「цаашаа (あちらへ)」です。"
  },
  {
    "id": "sq_21",
    "category": "demonstrative",
    "svgKey": "arrow_away",
    "prompt": "Энэ замаар ___ явбал цэцэрлэгт хүрээлэн байгаа.",
    "promptJa": "この道を___行けば、公園があります。",
    "options": [
      "цаашаа",
      "наашаа",
      "энд",
      "доошоо"
    ],
    "answer": "цаашаа",
    "explanation": "【正解: цаашаа (あちらへ / 向こうへ)】\n話者から遠ざかって奥や先へ進む方向を示すのは「цаашаа」です。"
  },
  {
    "id": "sq_22",
    "category": "demonstrative",
    "svgKey": "arrow_up",
    "prompt": "Шат өөд ___ гараад баруун тийшээ эргээрэй.",
    "promptJa": "階段を___上がって、右へ曲がってください。",
    "options": [
      "дээшээ",
      "доошоо",
      "наашаа",
      "энд"
    ],
    "answer": "дээшээ",
    "explanation": "【正解: дээшээ (上へ)】\n上方に向かう動きを示すのは「дээшээ」です。\n対義語は「доошоо (下へ)」です。"
  },
  {
    "id": "sq_23",
    "category": "demonstrative",
    "svgKey": "arrow_down",
    "prompt": "Уулнаас болгоомжтой ___ буугаарай, хальтиргаатай байна.",
    "promptJa": "山から気をつけて___降りてください、滑りやすいです。",
    "options": [
      "доошоо",
      "дээшээ",
      "энд",
      "ийм"
    ],
    "answer": "доошоо",
    "explanation": "【正解: доошоо (下へ)】\n下方に向かう動きを示すのは「доошоо」です。"
  },
  {
    "id": "sq_24",
    "category": "demonstrative",
    "svgKey": "shape_like_this",
    "prompt": "Би ___ хөөрхөн бэлэг авсандаа маш их баярласан.",
    "promptJa": "私は___可愛いプレゼントをもらってとても嬉しかったです。",
    "options": [
      "ийм",
      "энд",
      "наашаа",
      "дээр"
    ],
    "answer": "ийм",
    "explanation": "【正解: ийм (このような / こんな)】\n手元にある対象の性質・状態を指す様態指示詞は「ийм」です。\n・ийм бэлэг: こんなプレゼント"
  },
  {
    "id": "sq_25",
    "category": "demonstrative",
    "svgKey": "shape_like_that",
    "prompt": "___ хэцүү ажлыг ганцаараа хийж чадах уу?",
    "promptJa": "___難しい仕事を一人でやり遂げられますか？",
    "options": [
      "Тийм",
      "Энд",
      "Тэнд",
      "Дээр"
    ],
    "answer": "Тийм",
    "explanation": "【正解: Тийм (あのような / そんな / あんな)】\n話題の対象や離れた物事の様態を示すのは「Тийм」です。\n・Тийм хэцүү ажил: そんなに難しい仕事"
  },
  {
    "id": "sq_26",
    "category": "temporal",
    "svgKey": "time_before",
    "prompt": "Би гурван жилийн ___ Монгол улсад анх удаа ирсэн.",
    "promptJa": "私は3年の___モンゴル国に初めて来ました。",
    "options": [
      "өмнө",
      "дараа",
      "хүртэл",
      "турш"
    ],
    "answer": "өмнө",
    "explanation": "【正解: өмнө (〜の前に)】\n時間の過去の時点（〜年前など）を表すのは「өмнө」です。\n・гурван жилийн өмнө: 3年前に\n・дараа: 〜後に\n・хүртэл: 〜まで\n・турш: 〜の間中"
  },
  {
    "id": "sq_27",
    "category": "temporal",
    "svgKey": "time_after",
    "prompt": "Хичээл тарсны ___ бид хамтдаа хоолонд орцгооё.",
    "promptJa": "授業が終わった___私たちは一緒に食事に行きましょう。",
    "options": [
      "дараа",
      "өмнө",
      "хүртэл",
      "зуур"
    ],
    "answer": "дараа",
    "explanation": "【正解: дараа (〜の後に)】\n動作の終了後の時間を表すのは「-сны/-сний дараа (〜した後に)」です。\n・өмнө: 〜の前に\n・хүртэл: 〜まで\n・зуур: 〜の合間に"
  },
  {
    "id": "sq_28",
    "category": "temporal",
    "svgKey": "time_until",
    "prompt": "Маргааш өглөөний арван цаг ___ энэ даалгаврыг явуулаарай.",
    "promptJa": "明日の朝10時___この課題を送ってください。",
    "options": [
      "хүртэл",
      "дараа",
      "өмнө",
      "турш"
    ],
    "answer": "хүртэл",
    "explanation": "【正解: хүртэл (〜まで)】\n時間や期限の終点を示すのは「хүртэл」です。\n・арван цаг хүртэл: 10時まで"
  },
  {
    "id": "sq_29",
    "category": "temporal",
    "svgKey": "time_throughout",
    "prompt": "Зуны амралтынхаа ___ би олон сонирхолтой ном уншсан.",
    "promptJa": "夏休みの___私はたくさんの面白い本を読みました。",
    "options": [
      "турш",
      "хүртэл",
      "дараа",
      "өмнө"
    ],
    "answer": "турш",
    "explanation": "【正解: турш (〜の間中 / ずっと)】\n期間の最初から最後まで継続したことを表すのは「турш」です。\n・амралтынхаа турш: 休暇の間ずっと"
  },
  {
    "id": "sq_30",
    "category": "temporal",
    "svgKey": "time_since",
    "prompt": "Японоос ирснээс ___ би өдөр бүр монгол хоол идэж байна.",
    "promptJa": "日本から来て___私は毎日モンゴル料理を食べています。",
    "options": [
      "хойш",
      "өмнө",
      "хүртэл",
      "турш"
    ],
    "answer": "хойш",
    "explanation": "【正解: хойш (〜以来 / 〜からずっと)】\n奪格（-аас⁴）とセットで、過去の時点から現在まで継続していることを表すのは「-аас хойш」です。\n・ирснээс хойш: 来て以来"
  },
  {
    "id": "sq_31",
    "category": "temporal",
    "svgKey": "time_when",
    "prompt": "Бага насны хүүхэд байх ___ би их сахилгагүй байсан.",
    "promptJa": "幼い子供であった___私はとてもやんちゃでした。",
    "options": [
      "үед",
      "хүртэл",
      "турш",
      "дараа"
    ],
    "answer": "үед",
    "explanation": "【正解: үед (〜の時に / 〜の頃に)】\n特定の時代や時点を表す名詞「үе」の与位格形「үед」が正解です。\n・хүүхэд байх үед: 子供の頃に"
  },
  {
    "id": "sq_32",
    "category": "temporal",
    "svgKey": "time_while",
    "prompt": "Замдаа явах ___ би найзтайгаа утсаар ярилаа.",
    "promptJa": "道を行く___私は友達と電話で話しました。",
    "options": [
      "зуур",
      "дараа",
      "өмнө",
      "хүртэл"
    ],
    "answer": "зуур",
    "explanation": "【正解: зуур (〜の合間に / 〜している間に)】\nある動作を行っている隙間の時間を表すのは「зуур（または зуураа）」です。\n・явах зуур: 行く合間に"
  },
  {
    "id": "sq_33",
    "category": "temporal",
    "svgKey": "time_first",
    "prompt": "___ гараа угаагаад, дараа нь хоолоо идээрэй.",
    "promptJa": "___手を洗って、その後にご飯を食べてください。",
    "options": [
      "Эхлээд",
      "Сүүлд",
      "Турш",
      "Хойш"
    ],
    "answer": "Эхлээд",
    "explanation": "【正解: Эхлээд (まず初めに / 最初に)】\n順序として「まず第一に」行う行動を表すのは「Эхлээд」です。\n対句の「дараа нь (その後に)」とセットで非常によく使われます。"
  },
  {
    "id": "sq_34",
    "category": "spatial",
    "svgKey": "box_on",
    "prompt": "Ор ___ миний дулаахан хөнжил байна.",
    "promptJa": "ベッドの___私の温かい毛布があります。",
    "options": [
      "дээр",
      "доор",
      "гадна",
      "хооронд"
    ],
    "answer": "дээр",
    "explanation": "【正解: дээр (〜の上)】\nベッドの上面にあるため「ор дээр (ベッドの上に)」が自然です。"
  },
  {
    "id": "sq_35",
    "category": "spatial",
    "svgKey": "box_under",
    "prompt": "Модны ___ сэрүүн сүүдэрт суугаад амарцгаая.",
    "promptJa": "木の___涼しい日陰に座って休みましょう。",
    "options": [
      "доор",
      "дээр",
      "дотор",
      "гадна"
    ],
    "answer": "доор",
    "explanation": "【正解: доор (〜の下)】\n木の下側・日陰に入るため「модны доор」が正解です。"
  },
  {
    "id": "sq_36",
    "category": "spatial",
    "svgKey": "box_inside",
    "prompt": "Хөргөгч ___ сүү, тараг, жимс байна.",
    "promptJa": "冷蔵庫の___牛乳、ヨーグルト、果物があります。",
    "options": [
      "дотор",
      "дээр",
      "ард",
      "гадна"
    ],
    "answer": "дотор",
    "explanation": "【正解: дотор (〜の中)】\n冷蔵庫という密閉容器の内部にあるため「дотор」が正解です。"
  },
  {
    "id": "sq_37",
    "category": "spatial",
    "svgKey": "box_outside",
    "prompt": "Гадаа хүйтэн байна, үүдний ___ удаан зогсож болохгүй.",
    "promptJa": "外は寒いです、玄関の___長く立っていてはいけません。",
    "options": [
      "гадна",
      "дотор",
      "дээр",
      "доор"
    ],
    "answer": "гадна",
    "explanation": "【正解: гадна (〜の外)】\n玄関の外側を表すため「үүдний гадна」が正解です。"
  },
  {
    "id": "sq_38",
    "category": "spatial",
    "svgKey": "box_front",
    "prompt": "Эмнэлгийн ___ олон түргэн тусламжийн машин зогсож байна.",
    "promptJa": "病院の___多くの救急車が停まっています。",
    "options": [
      "өмнө",
      "хойно",
      "доор",
      "хооронд"
    ],
    "answer": "өмнө",
    "explanation": "【正解: өмнө (〜の前)】\n建物の正面・前方を指すため「өмнө」が正解です。"
  },
  {
    "id": "sq_39",
    "category": "spatial",
    "svgKey": "box_behind",
    "prompt": "Цэцэрлэгийн ___ өндөр уул сүндэрлэж харагдана.",
    "promptJa": "幼稚園・公園の___高い山がそびえて見えます。",
    "options": [
      "ард",
      "дотор",
      "дээр",
      "хооронд"
    ],
    "answer": "ард",
    "explanation": "【正解: ард (〜の裏・後ろ)】\n公園の後方に山がそびえている位置関係は「ард」です。"
  },
  {
    "id": "sq_40",
    "category": "spatial",
    "svgKey": "box_between",
    "prompt": "Ширээ, сандал хоёрын ___ миний үзэг уначихжээ.",
    "promptJa": "机と椅子の2つの___私のペンが落ちてしまいました。",
    "options": [
      "хооронд",
      "дунд",
      "дээр",
      "гадна"
    ],
    "answer": "хооронд",
    "explanation": "【正解: хооронд (2者の間)】\n机と椅子という【2つの物の間】に落ちているため「хооронд」です。"
  },
  {
    "id": "sq_41",
    "category": "spatial",
    "svgKey": "box_middle",
    "prompt": "Цэцэгсийн ___ нэгэн үзэсгэлэнтэй эрвээхэй нисэж байна.",
    "promptJa": "たくさんの花々の___一匹の美しい蝶が飛んでいます。",
    "options": [
      "дунд",
      "хооронд",
      "доор",
      "гадна"
    ],
    "answer": "дунд",
    "explanation": "【正解: дунд (〜の真ん中・中)】\n無数の花に囲まれた群れの真ん中は「дунд」を使います。"
  },
  {
    "id": "sq_42",
    "category": "spatial",
    "svgKey": "box_beside",
    "prompt": "Манай байрны ___ нэг жижигхэн кофе шоп бий.",
    "promptJa": "私たちのアパートの___小さなカフェがあります。",
    "options": [
      "хажууд",
      "дотор",
      "дээр",
      "хооронд"
    ],
    "answer": "хажууд",
    "explanation": "【正解: хажууд (〜の横・隣)】\n建物のすぐ横・隣接した位置は「хажууд（または дэргэд）」です。"
  },
  {
    "id": "sq_43",
    "category": "spatial",
    "svgKey": "box_opposite",
    "prompt": "Их дэлгүүрийн ___ талд том зогсоол байдаг.",
    "promptJa": "ノミンデパートの___側に大きな駐車場があります。",
    "options": [
      "эсрэг",
      "дотор",
      "дээр",
      "хооронд"
    ],
    "answer": "эсрэг",
    "explanation": "【正解: эсрэг (向かい)】\n道路を挟んで向かい側は「эсрэг талд」と言います。"
  },
  {
    "id": "sq_44",
    "category": "demonstrative",
    "svgKey": "point_this",
    "prompt": "___ асуултыг би сайн ойлгохгүй байна, зааж өгнө үү.",
    "promptJa": "___質問を私はよく理解できません、教えてください。",
    "options": [
      "Энэ",
      "Тэр",
      "Тэнд",
      "Цаашаа"
    ],
    "answer": "Энэ",
    "explanation": "【正解: Энэ (この)】\n目の前にある問題・質問を指すので「Энэ」です。"
  },
  {
    "id": "sq_45",
    "category": "demonstrative",
    "svgKey": "point_that",
    "prompt": "___ барилга хэдэн онд баригдсан бэ?",
    "promptJa": "___建物は何年に建てられたのですか？",
    "options": [
      "Тэр",
      "Энд",
      "Наашаа",
      "Дээшээ"
    ],
    "answer": "Тэр",
    "explanation": "【正解: Тэр (あの / その)】\n離れた場所にある建物や話題の建物を指す遠称指示詞は「Тэр」です。"
  },
  {
    "id": "sq_46",
    "category": "demonstrative",
    "svgKey": "point_here",
    "prompt": "Манай гэр бүл ___ гурван жил амьдарч байна.",
    "promptJa": "私たちの家族は___3年間住んでいます。",
    "options": [
      "энд",
      "наашаа",
      "цаашаа",
      "тийм"
    ],
    "answer": "энд",
    "explanation": "【正解: энд (ここ / ここで)】\n話者の現住所・現在地を指す場所副詞は「энд」です。"
  },
  {
    "id": "sq_47",
    "category": "demonstrative",
    "svgKey": "point_there",
    "prompt": "Багш одоо ___ хичээл зааж байгаа тул битгий чимээ гарга.",
    "promptJa": "先生は今___授業を教えているので、音を立てないで。",
    "options": [
      "тэнд",
      "энд",
      "ийм",
      "наашаа"
    ],
    "answer": "тэнд",
    "explanation": "【正解: тэнд (あそこで / そこで)】\n離れた別の教室・場所を指すので「тэнд」です。"
  },
  {
    "id": "sq_48",
    "category": "demonstrative",
    "svgKey": "arrow_towards",
    "prompt": "Бүгдээрээ ___ ирээд дугуйрч суугаарай.",
    "promptJa": "みんな___来て円になって座ってください。",
    "options": [
      "наашаа",
      "цаашаа",
      "тэнд",
      "доошоо"
    ],
    "answer": "наашаа",
    "explanation": "【正解: наашаа (こちらへ)】\n話者のいる方向へ集まる呼びかけなので「наашаа」です。"
  },
  {
    "id": "sq_49",
    "category": "demonstrative",
    "svgKey": "arrow_away",
    "prompt": "Бид маргааш хөдөө тийшээ ___ явна.",
    "promptJa": "私たちは明日田舎の方へ___行きます。",
    "options": [
      "цаашаа",
      "наашаа",
      "энд",
      "доор"
    ],
    "answer": "цаашаа",
    "explanation": "【正解: цаашаа (あちらへ / 向こうへ)】\n都市から田舎へ離れていく方向なので「цаашаа」が自然です。"
  },
  {
    "id": "sq_50",
    "category": "demonstrative",
    "svgKey": "arrow_up",
    "prompt": "Тэнгэр өөд ___ харвал олон түмэн од гялалзаж байна.",
    "promptJa": "空に向かって___見上げると、無数の星が輝いています。",
    "options": [
      "дээшээ",
      "доошоо",
      "наашаа",
      "энд"
    ],
    "answer": "дээшээ",
    "explanation": "【正解: дээшээ (上へ)】\n空を見上げる動作は「дээшээ харах」です。"
  },
  {
    "id": "sq_51",
    "category": "demonstrative",
    "svgKey": "arrow_down",
    "prompt": "Нүх рүү ___ битгий шагайгаарай, аюултай.",
    "promptJa": "穴へ向かって___覗き込まないでください、危ないです。",
    "options": [
      "доошоо",
      "дээшээ",
      "энд",
      "ийм"
    ],
    "answer": "доошоо",
    "explanation": "【正解: доошоо (下へ)】\n穴の下方を見下ろす方向なので「доошоо」です。"
  },
  {
    "id": "sq_52",
    "category": "demonstrative",
    "svgKey": "shape_like_this",
    "prompt": "Японд ___ төрлийн цахилгаан хэрэгсэл маш их зарагддаг.",
    "promptJa": "日本で___種類の電化製品がとてもよく売れています。",
    "options": [
      "ийм",
      "энд",
      "наашаа",
      "дээр"
    ],
    "answer": "ийм",
    "explanation": "【正解: ийм (このような)】\n手元で提示している種類の様態を示すので「ийм」です。"
  },
  {
    "id": "sq_53",
    "category": "demonstrative",
    "svgKey": "shape_like_that",
    "prompt": "Тэр үед тийм сайхан байшин ховор байсан.",
    "promptJa": "当時、あのような美しい家は珍しかった。",
    "options": [
      "тийм",
      "ийм",
      "энд",
      "наашаа"
    ],
    "answer": "тийм",
    "explanation": "【正解: тийм (あのような / そんな)】\n過去の話題や離れた対象の様態を回想して述べるので「тийм」が適切です。"
  },
  {
    "id": "sq_54",
    "category": "temporal",
    "svgKey": "time_before",
    "prompt": "Монгол явахын ___ би монгол бичиг бага зэрэг сурсан.",
    "promptJa": "モンゴルへ行く___私はモンゴル文字を少し勉強しました。",
    "options": [
      "өмнө",
      "дараа",
      "хүртэл",
      "турш"
    ],
    "answer": "өмнө",
    "explanation": "【正解: өмнө (〜の前に)】\n「-хын өмнө (〜する前に)」という未来の行動の前の事前段階を表します。"
  },
  {
    "id": "sq_55",
    "category": "temporal",
    "svgKey": "time_after",
    "prompt": "Уулзсаны ___ би чам руу зурвас илгээнэ.",
    "promptJa": "会った___私はあなたにメッセージを送ります。",
    "options": [
      "дараа",
      "өмнө",
      "хүртэл",
      "зуур"
    ],
    "answer": "дараа",
    "explanation": "【正解: дараа (〜の後に)】\n「-сны дараа (〜した後に)」という動作の完了後を表します。"
  },
  {
    "id": "sq_56",
    "category": "temporal",
    "svgKey": "time_until",
    "prompt": "Бид нар орой болтол буюу нар жаргах ___ ажилласан.",
    "promptJa": "私たちは日が暮れる___働きました。",
    "options": [
      "хүртэл",
      "дараа",
      "өмнө",
      "турш"
    ],
    "answer": "хүртэл",
    "explanation": "【正解: хүртэл (〜まで)】\n行動の限界・終点を表すのは「хүртэл」です。"
  },
  {
    "id": "sq_57",
    "category": "temporal",
    "svgKey": "time_throughout",
    "prompt": "Өвлийн ___ Монголд маш хүйтэн байдаг.",
    "promptJa": "冬の___モンゴルはとても寒いです。",
    "options": [
      "турш",
      "хүртэл",
      "дараа",
      "өмнө"
    ],
    "answer": "турш",
    "explanation": "【正解: турш (〜の間中)】\n冬という季節全体を通して継続する状態を表すので「турш」です。"
  },
  {
    "id": "sq_58",
    "category": "temporal",
    "svgKey": "time_since",
    "prompt": "Тэр үеэс ___ би монгол хэлээ тасралтгүй сурч байгаа.",
    "promptJa": "その時___私はモンゴル語を途切れることなく学び続けている。",
    "options": [
      "хойш",
      "өмнө",
      "хүртэл",
      "зуур"
    ],
    "answer": "хойш",
    "explanation": "【正解: хойш (〜以来 / 〜からずっと)】\n奪格「-ээс」と呼応して過去の起点からの継続を示すので「хойш」です。"
  },
  {
    "id": "sq_59",
    "category": "temporal",
    "svgKey": "time_when",
    "prompt": "Оюутан байх ___ олон гадаад найзтай болсон.",
    "promptJa": "学生であった___たくさんの外国人の友達ができました。",
    "options": [
      "үед",
      "хүртэл",
      "турш",
      "дараа"
    ],
    "answer": "үед",
    "explanation": "【正解: үед (〜の時に / 〜の頃に)】\n学生時代という時期を表すので「үед」です。"
  },
  {
    "id": "sq_60",
    "category": "temporal",
    "svgKey": "time_first",
    "prompt": "Шалгалт эхлэхэд ___ нэрээ бичээрэй.",
    "promptJa": "試験が始まったら___自分の名前を書きなさい。",
    "options": [
      "эхлээд",
      "сүүлд",
      "турш",
      "хойш"
    ],
    "answer": "эхлээд",
    "explanation": "【正解: эхлээд (まず最初に)】\n最初に行う行動を指示しているので「эхлээд」です。"
  }
];
