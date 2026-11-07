// かわいいペンギンのマスコット ＆ 育成・進化システム
// 「ペンギンを育てるためにモンゴル語を勉強する」育成ゲームパートナー

import { StorageService } from '../services/storage.js';
import { SoundEffects } from '../utils/helpers.js';

export const PENGUIN_STAGES = [
  { stage: 'champion', minLevel: 30, name: '草原の覇者ペンギン 👑', desc: '頂点を極めた英雄。黄金の王冠と王者マントを羽ばたかせる最高峰の Оцон шувуу！', color: 'from-amber-500 to-rose-600' },
  { stage: 'scholar', minLevel: 20, name: '語り部ペンギン 🌾', desc: '伝統の馬頭琴を携えた旅人。深紅の金糸デールを着て物語を紡ぐ実力派！', color: 'from-rose-600 to-amber-600' },
  { stage: 'adventurer', minLevel: 10, name: 'ぼうけんペンギン 🧭', desc: '一人前の探検家。青いモンゴル伝統デールと帽子を纏って文法の大草原へ！', color: 'from-sky-600 to-teal-600' },
  { stage: 'child', minLevel: 5, name: 'みならいペンギン 🎒', desc: '少し成長した元気なこども。草原のバンダナを巻いて単語集めに夢中！', color: 'from-emerald-500 to-teal-600' },
  { stage: 'chick', minLevel: 1, name: 'ヒナペンギン 🐣', desc: '生まれたばかりのもこもこヒナ。たまごの殻をかぶってモンゴル語を学び始めたよ！', color: 'from-slate-500 to-sky-600' }
];

export const STREAK_EXPRESSIONS = [
  { minDays: 30, id: 'aura_gold', name: '黄金のオーラ ✨', desc: '30日連続学習達成！草原の長老のような神々しいオーラ' },
  { minDays: 14, id: 'sparkle_eyes', name: 'うるうる尊い瞳 🥺', desc: '14日連続学習達成！モンゴル語愛に満ちたキラキラな瞳' },
  { minDays: 7, id: 'sunglasses', name: '草原のイケペン 😎', desc: '7日連続学習達成！1週間継続の自信にあふれたサングラス' },
  { minDays: 3, id: 'wink', name: '目配せウインク 😉', desc: '3日連続学習達成！学習のリズムをつかんだ愛らしいウインク' },
  { minDays: 1, id: 'normal', name: 'にっこり笑顔 😊', desc: '初日からの優しい笑顔' }
];

export class PenguinMascot {
  /**
   * サングラスモードの判定・取得
   */
  static isSunglassesMode() {
    try {
      return localStorage.getItem('mongol_app_penguin_sunglasses_v1') === 'true';
    } catch (_) {
      return false;
    }
  }

  /**
   * サングラスモードの保存
   */
  static setSunglassesMode(enabled) {
    try {
      localStorage.setItem('mongol_app_penguin_sunglasses_v1', enabled ? 'true' : 'false');
    } catch (_) {}
  }

  /**
   * サングラスモードの切り替え (ON <-> OFF)
   */
  static toggleSunglassesMode() {
    const next = !this.isSunglassesMode();
    this.setSunglassesMode(next);
    return next;
  }

  /**
   * レベルから現在の成長段階（ステージ）を取得
   */
  static getStageForLevel(level = 1) {
    return PENGUIN_STAGES.find(s => level >= s.minLevel) || PENGUIN_STAGES[PENGUIN_STAGES.length - 1];
  }

  /**
   * 次の進化段階と必要レベルを取得
   */
  static getNextStage(level = 1) {
    const reversed = [...PENGUIN_STAGES].reverse();
    return reversed.find(s => s.minLevel > level) || null;
  }

  /**
   * 連続学習日数に応じた最高位の特別表情を取得
   */
  static getUnlockedExpression(streakDays = 1) {
    return STREAK_EXPRESSIONS.find(e => streakDays >= e.minDays) || STREAK_EXPRESSIONS[STREAK_EXPRESSIONS.length - 1];
  }

  /**
   * ペンギンキャラクターのSVGを生成（成長段階・レベル・連続日数・表情に対応）
   */
  /**
   * エイリアス: renderSVG / renderSvg
   */
  static renderSVG(optionsOrMood = 'idle', size = 80) {
    return this.getSvg(optionsOrMood, size);
  }

  static renderSvg(optionsOrMood = 'idle', size = 80) {
    return this.getSvg(optionsOrMood, size);
  }

  static getSvg(optionsOrMood = 'idle', size = 80) {
    let mood = 'idle';
    let level = 1;
    let streakDays = 1;
    let renderSize = size;

    if (typeof optionsOrMood === 'string') {
      mood = optionsOrMood;
      // StorageServiceから現在のレベルとストリークを取得
      try {
        const stats = StorageService.getGameStats();
        const daily = StorageService.getDailyStats();
        level = stats.level || 1;
        streakDays = daily.streak || 1;
      } catch (_) {}
    } else if (typeof optionsOrMood === 'object' && optionsOrMood !== null) {
      mood = optionsOrMood.mood || 'idle';
      level = optionsOrMood.level !== undefined ? optionsOrMood.level : 1;
      streakDays = optionsOrMood.streakDays !== undefined ? optionsOrMood.streakDays : 1;
      renderSize = optionsOrMood.size || size;
    }

    const height = Math.round(renderSize * 1.1);
    const stageInfo = this.getStageForLevel(level);
    const stage = stageInfo.stage;

    // --- 1. 体色・羽毛の決定（ヒナ期はもこもこグレー、成長後はタキシードブラック） ---
    const isBaby = stage === 'chick';
    const bodyColor = isBaby ? '#64748b' : '#1e293b';
    const bellyColor = isBaby ? '#f8fafc' : '#ffffff';

    // --- 2. 表情（目・くちばし・ほっぺ・特別サングラス等） ---
    let eyesSvg = '';
    let beakSvg = '<polygon points="50,54 44,62 56,62" fill="#f59e0b" stroke="#d97706" stroke-width="0.5" />';
    let cheeksSvg = `
      <circle cx="33" cy="58" r="4.5" fill="#fb7185" opacity="0.65" />
      <circle cx="67" cy="58" r="4.5" fill="#fb7185" opacity="0.65" />
    `;
    let wingsSvg = `
      <path d="M 18 55 Q 9 70 20 82 Q 24 70 22 58 Z" fill="${bodyColor}" />
      <path d="M 82 55 Q 91 70 80 82 Q 76 70 78 58 Z" fill="${bodyColor}" />
    `;
    let extraEffects = '';

    const isSunglasses = (typeof optionsOrMood === 'object' && optionsOrMood.sunglasses !== undefined)
      ? Boolean(optionsOrMood.sunglasses)
      : (this.isSunglassesMode() || (streakDays >= 7 && mood === 'welcome'));

    const renderSunglassesEyes = (tiltDeg = 0, isSparkling = true) => `
      <!-- クールなサングラス -->
      <g ${tiltDeg ? `transform="rotate(${tiltDeg} 50 53)"` : ''}>
        <polygon points="31,47 49,47 46,58 34,58" fill="#0f172a" />
        <polygon points="51,47 69,47 66,58 54,58" fill="#0f172a" />
        <line x1="48" y1="49.5" x2="52" y2="49.5" stroke="#0f172a" stroke-width="2.5" />
        <!-- サングラスのハイライト光沢 -->
        <line x1="35" y1="49.5" x2="44" y2="56" stroke="#ffffff" stroke-width="1.5" opacity="0.85" stroke-linecap="round" />
        <line x1="55" y1="49.5" x2="64" y2="56" stroke="#ffffff" stroke-width="1.5" opacity="0.85" stroke-linecap="round" />
        ${isSparkling ? `
          <!-- キラリと光る星 -->
          <path d="M 67 46 L 69 42 L 71 46 L 75 47.5 L 71 49 L 69 53 L 67 49 L 63 47.5 Z" fill="#fbbf24" />
        ` : ''}
      </g>
    `;

    // 気分による表情基本
    switch (mood) {
      case 'happy':
        eyesSvg = isSunglasses ? renderSunglassesEyes(0, true) : `
          <path d="M 36 54 Q 40 47 44 54" fill="none" stroke="#0f172a" stroke-width="3" stroke-linecap="round" />
          <path d="M 56 54 Q 60 47 64 54" fill="none" stroke="#0f172a" stroke-width="3" stroke-linecap="round" />
        `;
        beakSvg = `
          <polygon points="50,53 42,61 58,61" fill="#f59e0b" />
          <path d="M 45 61 Q 50 67 55 61 Z" fill="#dc2626" />
        `;
        wingsSvg = `
          <path d="M 18 58 Q 6 52 14 42 Q 22 48 22 56 Z" fill="${bodyColor}" />
          <path d="M 82 58 Q 94 52 86 42 Q 78 48 78 56 Z" fill="${bodyColor}" />
        `;
        extraEffects += `
          <path d="M 14 36 L 16 30 L 18 36 L 24 38 L 18 40 L 16 46 L 14 40 L 8 38 Z" fill="#fbbf24" opacity="0.85" />
          <path d="M 82 32 L 83.5 27 L 85 32 L 90 33.5 L 85 35 L 83.5 40 L 82 35 L 77 33.5 Z" fill="#fbbf24" opacity="0.85" />
        `;
        break;

      case 'combo':
        eyesSvg = isSunglasses ? renderSunglassesEyes(0, true) : `
          <circle cx="40" cy="51" r="5" fill="#0f172a" />
          <circle cx="60" cy="51" r="5" fill="#0f172a" />
          <circle cx="42" cy="49" r="2.2" fill="#ffffff" />
          <circle cx="62" cy="49" r="2.2" fill="#ffffff" />
          <line x1="35" y1="44" x2="44" y2="47" stroke="#0f172a" stroke-width="2.5" stroke-linecap="round" />
          <line x1="65" y1="44" x2="56" y2="47" stroke="#0f172a" stroke-width="2.5" stroke-linecap="round" />
        `;
        wingsSvg = `
          <path d="M 20 60 Q 10 50 18 38 Q 24 45 22 56 Z" fill="${bodyColor}" />
          <path d="M 80 60 Q 90 50 82 38 Q 76 45 78 56 Z" fill="${bodyColor}" />
        `;
        extraEffects += `
          <path d="M 8 75 Q 4 60 12 55 Q 10 65 16 68 Z" fill="#ea580c" opacity="0.8" />
          <path d="M 92 75 Q 96 60 88 55 Q 90 65 84 68 Z" fill="#ea580c" opacity="0.8" />
          <path d="M 33 46 L 34.5 42 L 36 46 L 40 47.5 L 36 49 L 34.5 53 L 33 49 L 29 47.5 Z" fill="#fbbf24" />
        `;
        break;

      case 'wrong':
        eyesSvg = isSunglasses ? renderSunglassesEyes(6, false) : `
          <circle cx="40" cy="52" r="4.5" fill="#0f172a" />
          <circle cx="60" cy="52" r="4.5" fill="#0f172a" />
          <circle cx="42" cy="51" r="1.5" fill="#ffffff" />
          <circle cx="62" cy="51" r="1.5" fill="#ffffff" />
          <path d="M 36 47 Q 40 45 44 47" fill="none" stroke="#475569" stroke-width="1.8" stroke-linecap="round" />
          <path d="M 56 47 Q 60 45 64 47" fill="none" stroke="#475569" stroke-width="1.8" stroke-linecap="round" />
        `;
        extraEffects += `
          <path d="M 74 46 Q 78 50 75 53 Q 72 50 74 46 Z" fill="#38bdf8" />
        `;
        break;

      case 'celebrate':
        eyesSvg = isSunglasses ? renderSunglassesEyes(0, true) : `
          <path d="M 36 53 Q 40 46 44 53" fill="none" stroke="#0f172a" stroke-width="3" stroke-linecap="round" />
          <path d="M 56 53 Q 60 46 64 53" fill="none" stroke="#0f172a" stroke-width="3" stroke-linecap="round" />
        `;
        beakSvg = `
          <polygon points="50,52 42,60 58,60" fill="#f59e0b" />
          <path d="M 44 60 Q 50 67 56 60 Z" fill="#dc2626" />
        `;
        wingsSvg = `
          <path d="M 20 62 Q 8 48 16 32 Q 24 40 22 55 Z" fill="${bodyColor}" />
          <path d="M 80 62 Q 92 48 84 32 Q 76 40 78 55 Z" fill="${bodyColor}" />
        `;
        extraEffects += `
          <rect x="12" y="24" width="4" height="4" rx="1" fill="#ec4899" transform="rotate(25 14 26)" />
          <rect x="84" y="22" width="4" height="4" rx="1" fill="#3b82f6" transform="rotate(-15 86 24)" />
          <circle cx="20" cy="14" r="2.5" fill="#eab308" />
          <circle cx="78" cy="16" r="2.5" fill="#10b981" />
        `;
        break;

      case 'welcome':
      default:
        // 連続日数 または サングラスモード
        if (isSunglasses) {
          eyesSvg = renderSunglassesEyes(0, true);
        } else if (streakDays >= 3 && mood === 'welcome') {
          // 3日以上: ウインク！
          eyesSvg = `
            <path d="M 36 53 Q 40 48 44 53" fill="none" stroke="#0f172a" stroke-width="3" stroke-linecap="round" />
            <circle cx="60" cy="52" r="5" fill="#0f172a" />
            <circle cx="62" cy="50" r="1.8" fill="#ffffff" />
          `;
        } else {
          eyesSvg = `
            <circle cx="40" cy="52" r="5" fill="#0f172a" />
            <circle cx="60" cy="52" r="4.8" fill="#0f172a" />
            <circle cx="42" cy="50" r="1.8" fill="#ffffff" />
            <circle cx="62" cy="50" r="1.8" fill="#ffffff" />
          `;
        }

        if (mood === 'welcome') {
          wingsSvg = `
            <path d="M 18 55 Q 9 70 20 82 Q 24 70 22 58 Z" fill="${bodyColor}" />
            <path d="M 80 58 Q 94 48 88 36 Q 80 44 78 55 Z" fill="${bodyColor}" />
          `;
        }
        break;
    }

    // 連続30日以上の神々しいオーラ
    if (streakDays >= 30) {
      extraEffects += `
        <circle cx="50" cy="65" r="42" fill="none" stroke="#fbbf24" stroke-width="2" stroke-dasharray="4 4" opacity="0.75" class="animate-spin" />
      `;
    }

    // --- 3. 成長段階ごとの衣装（帽子・デール・持ち物・王冠） ---
    let costumeSvg = '';

    if (stage === 'chick') {
      // 【ヒナ期】たまごの殻の帽子
      costumeSvg = `
        <!-- たまごの殻帽子 -->
        <path d="M 32 42 Q 50 20 68 42 L 60 38 L 50 42 L 40 38 Z" fill="#fef08a" stroke="#eab308" stroke-width="1.2" />
        <!-- あたまの産毛 -->
        <path d="M 50 20 Q 52 14 55 12" fill="none" stroke="#64748b" stroke-width="1.8" stroke-linecap="round" />
      `;
    } else if (stage === 'child') {
      // 【こども期】草原のバンダナ ＆ 鉛筆
      costumeSvg = `
        <!-- 首元の緑のバンダナ -->
        <polygon points="34,60 50,72 66,60 50,65" fill="#059669" stroke="#047857" stroke-width="1" />
        <circle cx="50" cy="64" r="2.5" fill="#fbbf24" />
        <!-- 小さな青いキャップ -->
        <path d="M 36 38 Q 50 26 64 38 Z" fill="#0284c7" />
        <circle cx="50" cy="27" r="3" fill="#eab308" />
        <rect x="34" y="37" width="32" height="4" rx="2" fill="#e2e8f0" />
      `;
    } else if (stage === 'adventurer') {
      // 【冒険者期】モンゴル青デール ＆ 伝統帽子
      costumeSvg = `
        <!-- 青デールと金帯 -->
        <path d="M 30 68 Q 50 64 70 68 L 68 84 Q 50 86 32 84 Z" fill="#0284c7" opacity="0.9" />
        <rect x="31" y="74" width="38" height="5" rx="1.5" fill="#eab308" />
        <!-- 伝統マスカイ（帽子） -->
        <path d="M 32 37 Q 50 14 50 12 Q 50 14 68 37 Z" fill="#0284c7" />
        <circle cx="50" cy="12" r="4.5" fill="#eab308" stroke="#ca8a04" stroke-width="0.8" />
        <line x1="50" y1="12" x2="53" y2="18" stroke="#dc2626" stroke-width="1.8" stroke-linecap="round" />
        <rect x="29" y="34" width="42" height="8" rx="4" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.2" />
      `;
    } else if (stage === 'scholar') {
      // 【語り部期】金糸刺繍の深紅デール ＆ 馬頭琴（背中）
      costumeSvg = `
        <!-- 深紅の伝統デール -->
        <path d="M 28 66 Q 50 62 72 66 L 70 88 Q 50 90 30 88 Z" fill="#991b1b" />
        <!-- 銀の帯（мөнгөн бүс） -->
        <rect x="29" y="73" width="42" height="6" rx="2" fill="#e2e8f0" stroke="#94a3b8" stroke-width="1" />
        <circle cx="50" cy="76" r="3.5" fill="#38bdf8" stroke="#0284c7" stroke-width="0.8" />
        <!-- 高級毛皮帽子 -->
        <path d="M 32 36 Q 50 12 50 10 Q 50 12 68 36 Z" fill="#b45309" />
        <circle cx="50" cy="10" r="4.5" fill="#f59e0b" />
        <line x1="50" y1="10" x2="54" y2="17" stroke="#dc2626" stroke-width="2" stroke-linecap="round" />
        <rect x="28" y="33" width="44" height="9" rx="4.5" fill="#78350f" stroke="#451a03" stroke-width="1" />
        <!-- 馬頭琴の頭（背中から覗く） -->
        <path d="M 76 38 L 84 20 Q 88 18 90 22 L 87 28 L 79 44 Z" fill="#b45309" stroke="#78350f" stroke-width="0.8" />
        <circle cx="87" cy="22" r="2.5" fill="#fef08a" />
      `;
    } else if (stage === 'champion') {
      // 【覇者期】黄金の王冠 ＆ チャンピオン帯 ＆ 王者マント
      costumeSvg = `
        <!-- 王者の真紅マント -->
        <path d="M 20 62 Q 10 85 16 98 L 26 95 L 24 66 Z" fill="#b91c1c" />
        <path d="M 80 62 Q 90 85 84 98 L 74 95 L 76 66 Z" fill="#b91c1c" />
        <!-- 黄金のデール -->
        <path d="M 28 65 Q 50 62 72 65 L 70 90 Q 50 92 30 90 Z" fill="#1e1b4b" />
        <path d="M 30 72 L 70 72 L 68 78 L 32 78 Z" fill="#f59e0b" stroke="#d97706" stroke-width="1" />
        <circle cx="50" cy="75" r="4.5" fill="#ef4444" stroke="#ffffff" stroke-width="1" />
        <!-- 黄金の王冠（ハーンの冠） -->
        <polygon points="30,34 36,16 45,24 50,12 55,24 64,16 70,34" fill="#fbbf24" stroke="#d97706" stroke-width="1.5" />
        <circle cx="36" cy="16" r="2" fill="#ef4444" />
        <circle cx="50" cy="12" r="2.8" fill="#38bdf8" />
        <circle cx="64" cy="16" r="2" fill="#10b981" />
        <rect x="29" y="32" width="42" height="6" rx="2" fill="#d97706" />
        <circle cx="50" cy="35" r="2" fill="#ffffff" />
      `;
    }

    return `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 110" width="${renderSize}" height="${height}" class="penguin-mascot inline-block shrink-0 select-none drop-shadow-sm transition-transform duration-200">
        <!-- 足 -->
        <ellipse cx="38" cy="102" rx="10" ry="5.5" fill="#f59e0b" stroke="#d97706" stroke-width="0.8" />
        <ellipse cx="62" cy="102" rx="10" ry="5.5" fill="#f59e0b" stroke="#d97706" stroke-width="0.8" />
        
        <!-- ペンギンの体（成長段階別ボディ） -->
        <ellipse cx="50" cy="65" rx="${isBaby ? 32 : 35}" ry="${isBaby ? 35 : 38}" fill="${bodyColor}" />
        <ellipse cx="50" cy="68" rx="${isBaby ? 23 : 25}" ry="${isBaby ? 25 : 28}" fill="${bellyColor}" />
        
        <!-- 翼 -->
        ${wingsSvg}
        
        <!-- 衣装・デール・ベルト -->
        ${costumeSvg}
        
        <!-- 目 -->
        ${eyesSvg}
        
        <!-- ほっぺ -->
        ${cheeksSvg}
        
        <!-- くちばし -->
        ${beakSvg}
        
        <!-- 特別エフェクト（星・炎・オーラ・紙吹雪） -->
        ${extraEffects}
      </svg>
    `;
  }

  /**
   * ペンギンマスコットと吹き出しがセットになったUIカードを生成
   */
  static renderBubble(message, mood = 'idle', options = {}) {
    const size = options.size || 60;
    const svg = this.getSvg({ mood, size, ...options });

    return `
      <div class="penguin-partner-widget flex items-center gap-3 p-3 bg-gradient-to-r from-sky-50/80 via-white to-emerald-50/80 border border-sky-200/80 rounded-2xl shadow-2xs animate-fade-in ${options.extraClass || ''}">
        <div class="shrink-0 flex items-center justify-center cursor-pointer hover:scale-105 transition-transform" id="mascot-bubble-avatar" title="タップしてペンギンのお部屋へ">
          ${svg}
        </div>
        <div class="flex-1 relative">
          <div class="bg-white border border-sky-100 rounded-xl px-3.5 py-2 shadow-2xs text-slate-700 text-xs sm:text-sm font-bold leading-snug">
            <div class="flex items-center justify-between mb-0.5">
              <span class="text-[10px] font-black px-2 py-0.5 rounded-md bg-sky-100 text-sky-800 cyrillic-text">🐧 Оцон шувуу</span>
              ${options.title ? `<span class="text-[10px] text-slate-400 font-normal">${options.title}</span>` : ''}
            </div>
            <div>${message}</div>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * シチュエーション別のペンギンの台詞を取得
   */
  static getComment(situation, details = {}) {
    const COMMENTS = {
      welcome: [
        'Сайн байна уу!（こんにちは！）今日も一緒にモンゴル語を学ぼう！',
        'また会えてうれしい！少しずつ続けるのが上達の秘訣だよ！',
        'モンゴル語の世界へようこそ！一緒に楽しくレベルアップしよう！'
      ],
      correct: [
        'すごい！ зөв байна!（正解！）その調子だよ！',
        'ばっちり！ Маш сайн!（とても良いね！）',
        '見事な正解！どんどん単語が身についてるよ！',
        'その調子！草原の風のように快調だね！'
      ],
      combo: [
        `すごい！ ${details.combo || 5}問連続正解！コンボ継続中！🔥`,
        `集中力が研ぎ澄まされてるね！止まらない快進撃！🔥`,
        `素晴らしいリズム！この勢いで全問正解を目指そう！🔥`
      ],
      wrong: [
        '惜しい！もう一度挑戦しよう！失敗は成功のもとだよ！',
        '大丈夫、間違えた単語ほど記憶に残りやすいんだ！次いこう！',
        'Дахиад нэг!（もう一回！）語幹や活用をしっかり確認してみてね！',
        '惜しかった！この悔しさをバネに次を当てよう！'
      ],
      levelup: [
        `やったね！レベルアップして【Lv.${details.level || 2}】になったよ！🎉`,
        `おめでとう！努力が実を結んでレベルアップしたよ！🎉`
      ],
      evolution: [
        `おめでとう！ペンギンが【${details.stageName || '成長'}】に進化したよ！新しい衣装も解放！🎉`
      ],
      title: [
        `新しい称号【${details.title || 'モンゴル語探検家'}】を獲得したよ！誇らしいね！✨`
      ],
      result_perfect: [
        '全問正解パーフェクト！完璧すぎるよ！草原の覇者だね！👑',
        '満点おめでとう！モンゴル語マスターへの道が大きく拓けたよ！🌟'
      ],
      result_high: [
        '高得点おめでとう！着実にモンゴル語力がついてるよ！この調子！👍',
        '素晴らしい結果だよ！日々の積み重ねがバッチリ活きてるね！'
      ],
      result_encourage: [
        'お疲れさま！最後まで解き切ったことが素晴らしい一歩だよ！💪',
        'よく頑張ったね！間違えた問題を復習ノートで確認してみよう！'
      ]
    };

    const list = COMMENTS[situation] || COMMENTS.welcome;
    return list[Math.floor(Math.random() * list.length)];
  }

  /**
   * 「ペンギンのお部屋（育成・着せ替え・成長記録）」モーダルを開く
   */
  static showPenguinRoomModal(onNavigate) {
    const stats = StorageService.getGameStats();
    const daily = StorageService.getDailyStats();
    const level = stats.level || 1;
    const streakDays = daily.streak || 1;

    const currentStage = this.getStageForLevel(level);
    const nextStage = this.getNextStage(level);
    const currentExpr = this.getUnlockedExpression(streakDays);

    const modal = document.createElement('div');
    modal.id = "penguin-room-modal";
    modal.className = "fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-fade-in";

    modal.innerHTML = `
      <div class="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[92vh] flex flex-col relative overflow-hidden border-2 border-sky-300">
        
        <!-- 背景装飾 -->
        <div class="absolute -top-16 -right-16 w-48 h-48 bg-sky-200/40 rounded-full blur-2xl pointer-events-none"></div>
        <div class="absolute -bottom-16 -left-16 w-48 h-48 bg-emerald-200/40 rounded-full blur-2xl pointer-events-none"></div>

        <!-- ヘッダー -->
        <div class="flex items-center justify-between pb-2 border-b border-slate-100 relative z-10">
          <div class="flex items-center gap-2.5">
            <span class="text-2xl">🐧</span>
            <div>
              <h3 class="text-base font-black text-slate-900">ペンギンのお部屋（<span class="cyrillic-text">Оцон шувуу</span> 育成・着せ替え）</h3>
              <p class="text-[11px] text-slate-500 font-medium">モンゴル語を勉強して Оцон шувуу を育てよう！</p>
            </div>
          </div>
          <button type="button" id="btn-close-penguin-room" class="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 text-lg">
            ✕
          </button>
        </div>

        <!-- スクロールエリア -->
        <div class="overflow-y-auto space-y-4 pr-1 flex-1 relative z-10">
          
          <!-- メインキャラクターステージ -->
          <div class="bg-gradient-to-b from-sky-100/70 via-white to-emerald-50/70 rounded-3xl p-5 border border-sky-200 text-center relative overflow-hidden shadow-2xs">
            
            <!-- タップで喜ぶインタラクション -->
            <div id="room-penguin-avatar" class="cursor-pointer inline-block transform hover:scale-105 active:scale-95 transition-all py-1">
              ${this.getSvg({ mood: 'welcome', level, streakDays, size: 120 })}
            </div>
            <div class="text-[11px] text-sky-700 font-extrabold mt-1">
              👆 タップしてペンギンと触れ合う
            </div>

            <!-- 現在の姿・ステージ -->
            <div class="mt-2 space-y-0.5">
              <span class="inline-block text-xs font-black px-3 py-1 rounded-full bg-sky-600 text-white shadow-2xs">
                ${currentStage.name}
              </span>
              <p class="text-xs text-slate-600 max-w-sm mx-auto pt-1 font-medium leading-relaxed">
                ${currentStage.desc}
              </p>
            </div>

            <!-- 次の進化予告 -->
            ${nextStage ? `
              <div class="mt-3 p-2.5 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-900 font-bold flex items-center justify-between gap-2">
                <span class="flex items-center gap-1.5">
                  <span>✨</span> 次の進化: <span class="font-black">${nextStage.name}</span>
                </span>
                <span class="text-[10px] bg-amber-200 text-amber-950 px-2 py-0.5 rounded-full font-black">
                  Lv.${nextStage.minLevel} で解放！
                </span>
              </div>
            ` : `
              <div class="mt-3 p-2.5 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-900 font-black">
                👑 最高の進化段階【草原の覇者】に到達しています！真のマスター！
              </div>
            `}

          </div>

          <!-- 特別アクセサリー：サングラスモード 切り替え -->
          <div class="p-3.5 bg-slate-900 text-white rounded-2xl flex items-center justify-between gap-3 shadow-xs border border-slate-700">
            <div class="flex items-center gap-2.5 text-left">
              <span class="text-2xl">😎</span>
              <div>
                <div class="text-xs font-black flex items-center gap-1.5">
                  <span>サングラスモード</span>
                  <span id="room-sunglasses-badge" class="text-[10px] px-2 py-0.5 rounded-full font-black ${this.isSunglassesMode() ? 'bg-amber-400 text-slate-950' : 'bg-slate-700 text-slate-300'}">
                    ${this.isSunglassesMode() ? '🕶️ 着用中' : 'OFF'}
                  </span>
                </div>
                <p class="text-[10px] text-slate-400">クールなイケペン仕様に大変身！いつでも付け外しできます</p>
              </div>
            </div>
            <button type="button" id="btn-toggle-sunglasses" class="px-3.5 py-1.5 rounded-xl font-black text-xs transition-all active:scale-95 cursor-pointer shrink-0 ${this.isSunglassesMode() ? 'bg-amber-400 hover:bg-amber-500 text-slate-950 shadow-xs' : 'bg-slate-700 hover:bg-slate-600 text-white'}">
              ${this.isSunglassesMode() ? 'はずす' : 'かける 🕶️'}
            </button>
          </div>

          <!-- 成長段階（進化ロードマップ） -->
          <div class="space-y-2">
            <h4 class="text-xs font-black text-slate-800 flex items-center gap-1.5">
              <span>🌱</span> ペンギンの進化ロードマップ
            </h4>

            <div class="grid grid-cols-1 gap-2">
              ${PENGUIN_STAGES.map(s => {
                const isUnlocked = level >= s.minLevel;
                const isCurrent = currentStage.stage === s.stage;

                return `
                  <div class="p-3 rounded-2xl border ${isCurrent ? 'border-sky-500 bg-sky-50/80 shadow-xs' : (isUnlocked ? 'border-slate-200 bg-white' : 'border-slate-200 bg-slate-50 opacity-60')} flex items-center justify-between gap-3 text-xs">
                    <div class="flex items-center gap-2.5">
                      <div class="w-8 h-8 rounded-xl ${isUnlocked ? 'bg-sky-600 text-white' : 'bg-slate-200 text-slate-400'} font-black text-xs flex items-center justify-center shrink-0">
                        Lv.${s.minLevel}
                      </div>
                      <div>
                        <div class="font-black text-slate-900 flex items-center gap-1.5">
                          <span>${s.name}</span>
                          ${isCurrent ? '<span class="text-[10px] bg-sky-600 text-white px-2 py-0.2 rounded-full font-bold">現在の姿</span>' : ''}
                        </div>
                        <div class="text-[11px] text-slate-500 mt-0.5 line-clamp-1">${s.desc}</div>
                      </div>
                    </div>
                    <span class="text-[10px] font-extrabold shrink-0 px-2 py-0.5 rounded-full ${isUnlocked ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-500'}">
                      ${isUnlocked ? '解放済' : `Lv.${s.minLevel}`}
                    </span>
                  </div>
                `;
              }).join('')}
            </div>
          </div>

          <!-- 連続学習日数による特別表情 -->
          <div class="space-y-2">
            <h4 class="text-xs font-black text-slate-800 flex items-center gap-1.5">
              <span>🔥</span> 連続学習で解放される特別表情
            </h4>
            <div class="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5 text-xs">
              <div class="flex justify-between items-center font-bold text-slate-700">
                <span>現在の連続学習日数: <span class="text-emerald-600 font-extrabold text-sm">${streakDays}</span> 日連続</span>
                <span class="text-[11px] text-slate-500 font-normal">現在の表情: ${currentExpr.name}</span>
              </div>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                ${STREAK_EXPRESSIONS.map(e => {
                  const unlocked = streakDays >= e.minDays;
                  return `
                    <div class="p-2 rounded-xl border ${unlocked ? 'border-amber-300 bg-amber-50/50 text-slate-800 font-bold' : 'border-slate-200 bg-white opacity-60 text-slate-400'} text-[11px] flex items-center justify-between">
                      <span>${e.name}</span>
                      <span class="text-[10px] ${unlocked ? 'text-amber-700 font-extrabold' : 'text-slate-400'}">${e.minDays}日連続</span>
                    </div>
                  `;
                }).join('')}
              </div>
            </div>
          </div>

        </div>

        <!-- フッター閉じるボタン -->
        <button type="button" id="btn-close-penguin-room-bottom" class="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all">
          お部屋を出る
        </button>

      </div>
    `;

    document.body.appendChild(modal);

    const close = () => {
      modal.remove();
    };

    modal.querySelector('#btn-close-penguin-room')?.addEventListener('click', close);
    modal.querySelector('#btn-close-penguin-room-bottom')?.addEventListener('click', close);
    modal.addEventListener('click', (e) => {
      if (e.target === modal) close();
    });

    // サングラスモード切り替えボタン
    const toggleSunglassBtn = modal.querySelector('#btn-toggle-sunglasses');
    if (toggleSunglassBtn) {
      toggleSunglassBtn.addEventListener('click', () => {
        const isNowOn = this.toggleSunglassesMode();
        SoundEffects.playCorrect();

        const roomAvatar = modal.querySelector('#room-penguin-avatar');
        if (roomAvatar) {
          roomAvatar.innerHTML = this.getSvg({ mood: 'welcome', level, streakDays, size: 120 });
          roomAvatar.classList.add('animate-bounce');
          setTimeout(() => roomAvatar.classList.remove('animate-bounce'), 600);
        }

        const badge = modal.querySelector('#room-sunglasses-badge');
        if (badge) {
          badge.className = `text-[10px] px-2 py-0.5 rounded-full font-black ${isNowOn ? 'bg-amber-400 text-slate-950' : 'bg-slate-700 text-slate-300'}`;
          badge.textContent = isNowOn ? '🕶️ 着用中' : 'OFF';
        }

        toggleSunglassBtn.className = `px-3.5 py-1.5 rounded-xl font-black text-xs transition-all active:scale-95 cursor-pointer shrink-0 ${isNowOn ? 'bg-amber-400 hover:bg-amber-500 text-slate-950 shadow-xs' : 'bg-slate-700 hover:bg-slate-600 text-white'}`;
        toggleSunglassBtn.textContent = isNowOn ? 'はずす' : 'かける 🕶️';

        // ホーム画面のペンギン表示も同期
        const homePenguinBtn = document.getElementById('home-penguin-room-btn');
        if (homePenguinBtn) {
          homePenguinBtn.innerHTML = this.getSvg({ mood: 'welcome', level, streakDays, size: 76 });
        }
        const homeSunglassBtn = document.getElementById('btn-home-toggle-sunglasses');
        if (homeSunglassBtn) {
          homeSunglassBtn.className = `text-sm ${isNowOn ? 'bg-amber-400 text-slate-950 font-black shadow-xs ring-2 ring-amber-300' : 'bg-white/20 hover:bg-white/30 text-white/90 font-bold'} px-2 py-0.5 rounded-full transition-all flex items-center justify-center cursor-pointer`;
          homeSunglassBtn.innerHTML = `<span>🕶️</span>`;
          homeSunglassBtn.title = `サングラス (${isNowOn ? 'ON' : 'OFF'})`;
        }
      });
    }

    // ペンギンをタップした時のアニメーション＆鳴き声効果音
    const avatar = modal.querySelector('#room-penguin-avatar');
    if (avatar) {
      avatar.addEventListener('click', () => {
        SoundEffects.playCorrect();
        avatar.classList.add('animate-bounce');
        setTimeout(() => avatar.classList.remove('animate-bounce'), 800);
      });
    }
  }

  /**
   * 進化達成時の演出モーダル（ポケモン風進化アニメーション）
   */
  static showEvolutionModal({ oldStage, newStage, newLevel, onContinue }) {
    SoundEffects.playLevelUp();

    const modal = document.createElement('div');
    modal.className = "fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in";
    modal.innerHTML = `
      <div class="bg-gradient-to-b from-sky-900 via-slate-900 to-indigo-950 rounded-3xl max-w-sm w-full p-6 text-center shadow-2xl space-y-4 animate-scale-up border-2 border-amber-400 relative overflow-hidden text-white">
        
        <div class="absolute -top-12 -left-12 w-36 h-36 bg-amber-400/30 rounded-full blur-xl pointer-events-none"></div>
        <div class="absolute -bottom-12 -right-12 w-36 h-36 bg-sky-400/30 rounded-full blur-xl pointer-events-none"></div>

        <div class="text-xs font-black tracking-widest uppercase text-amber-400 animate-pulse">
          ✨ CONGRATULATIONS! PENGUIN EVOLUTION ✨
        </div>

        <h3 class="text-2xl font-black text-white">ペンギンが進化！</h3>

        <!-- 新しい姿 -->
        <div class="my-2 py-2 flex justify-center transform scale-110">
          ${this.getSvg({ mood: 'celebrate', level: newLevel, size: 110 })}
        </div>

        <div class="space-y-1">
          <div class="text-xs text-sky-200 font-bold">${oldStage ? oldStage.name : 'ヒナペンギン'} から進化！</div>
          <div class="text-xl font-black text-amber-300">${newStage.name}</div>
          <p class="text-xs text-slate-300 pt-1 leading-relaxed">${newStage.desc}</p>
        </div>

        <div class="p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 text-xs font-bold text-emerald-200">
          🐧「クエッ！モンゴル語を勉強してくれてありがとう！新しい姿でこれからも一緒に頑張るよ！」
        </div>

        <button type="button" id="btn-close-evolution" class="w-full py-3.5 bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 text-slate-950 font-black text-sm rounded-xl shadow-lg transition-all active:scale-98">
          やったね！Оцон шувууと冒険を続ける
        </button>
      </div>
    `;

    document.body.appendChild(modal);

    const close = () => {
      modal.remove();
      if (onContinue) onContinue();
    };

    modal.querySelector('#btn-close-evolution')?.addEventListener('click', close);
  }
}
