// ペンギン探検隊（モンゴル全22地域・全21アイマグ＋首都特別市 名所めぐり旅）コンポーネント
import { expeditionDestinations } from '../data/expeditionData.js';
import { GamificationService } from '../services/gamification.js';
import { SpeechService } from '../services/speech.js';
import { SoundEffects } from '../utils/helpers.js';

export class PenguinExpeditionComponent {
  static state = {
    selectedDestination: null,
    currentFilter: 'all', // 'all', 'unlocked', 'locked', 'capital', 'north', 'west', 'central', 'gobi', 'east'
    hoveredRegionId: null
  };

  static render(container, onNavigate) {
    this.container = container;
    this.onNavigate = onNavigate;
    const profile = GamificationService.getProfile();
    const currentXp = profile.totalXp;

    const totalCount = expeditionDestinations.length;
    const unlockedCount = expeditionDestinations.filter(d => currentXp >= d.requiredXp).length;
    const progressPercent = Math.min(100, Math.round((unlockedCount / totalCount) * 100));

    // フィルタリング処理
    const filteredDestinations = expeditionDestinations.filter(d => {
      const isUnlocked = currentXp >= d.requiredXp;
      if (this.state.currentFilter === 'unlocked') return isUnlocked;
      if (this.state.currentFilter === 'locked') return !isUnlocked;
      if (['capital', 'north', 'west', 'central', 'gobi', 'east'].includes(this.state.currentFilter)) {
        return d.zone === this.state.currentFilter;
      }
      return true;
    });

    this.container.innerHTML = `
      <div class="animate-fade-in max-w-5xl mx-auto px-3 sm:px-4 py-4 space-y-6">
        
        <!-- ヘッダー -->
        <div class="flex items-center justify-between border-b border-slate-200 pb-3">
          <div class="flex items-center gap-2.5">
            <span class="text-2xl p-2 rounded-xl bg-gradient-to-tr from-sky-500 to-emerald-500 text-white shadow-xs">🗺️</span>
            <div>
              <h2 class="text-lg font-bold text-slate-800 flex items-center gap-2">
                <span>ペンギン探検隊（モンゴル全土 名所めぐり）</span>
                <span class="text-xs bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold hidden sm:inline-block">全22地域</span>
              </h2>
              <p class="text-xs text-slate-500">学習XPを貯めると地図に色がつき、全21アイマグと首都を制覇できます！</p>
            </div>
          </div>
          <button type="button" id="btn-back-home" class="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-all cursor-pointer">
            ✕ ホームへ
          </button>
        </div>

        <!-- 旅の進捗ステータスバナー -->
        <div class="bg-gradient-to-r from-sky-600 via-teal-600 to-emerald-600 rounded-3xl p-5 text-white shadow-md flex flex-col md:flex-row items-center justify-between gap-4">
          <div class="flex items-center gap-3.5 w-full md:w-auto">
            <div class="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-3xl shadow-xs flex-shrink-0">
              🐧
            </div>
            <div class="flex-1">
              <div class="text-xs font-bold text-sky-100 flex items-center gap-2">
                <span>探検隊の冒険記録</span>
                <span class="bg-white/20 px-2 py-0.2 rounded-full text-[10px] font-black">${progressPercent}% 制覇</span>
              </div>
              <h3 class="text-lg font-black leading-tight mt-0.5">
                全22地域中 <span class="text-amber-300 text-2xl">${unlockedCount}</span> ヶ所を開拓！
              </h3>
              <!-- プログレスバー -->
              <div class="w-full bg-black/25 rounded-full h-2.5 mt-2 overflow-hidden border border-white/20">
                <div class="bg-gradient-to-r from-amber-300 via-emerald-300 to-teal-200 h-full rounded-full transition-all duration-700 shadow-sm" style="width: ${progressPercent}%;"></div>
              </div>
            </div>
          </div>

          <div class="flex items-center gap-3 w-full md:w-auto justify-end">
            <div class="bg-black/20 backdrop-blur-xs px-4 py-2.5 rounded-2xl border border-white/20 text-right">
              <div class="text-[11px] text-sky-100 font-bold">現在の累計XP</div>
              <strong class="text-amber-300 text-base font-black">${currentXp.toLocaleString()} XP ⚡</strong>
            </div>
          </div>
        </div>

        <!-- 🗺️ インタラクティブ・モンゴル全土地図セクション -->
        <div class="bg-white rounded-3xl p-4 sm:p-6 border border-slate-200 shadow-sm space-y-3 relative overflow-hidden">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div>
              <h3 class="text-sm font-extrabold text-slate-800 flex items-center gap-2">
                <span>🎨 モンゴル探検インタラクティブ地図</span>
                <span class="text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md font-bold">タップで解説表示</span>
              </h3>
              <p class="text-[11px] text-slate-500">開拓した地域は色が鮮やかに点灯します。地図上のどの地域もタップして詳細解説を読めます。</p>
            </div>
            
            <div class="flex items-center gap-2 text-xs font-bold text-slate-600">
              <span class="flex items-center gap-1"><span class="w-3 h-3 rounded-sm bg-emerald-500 inline-block"></span> 開拓済み</span>
              <span class="flex items-center gap-1"><span class="w-3 h-3 rounded-sm bg-slate-300 border border-slate-400 border-dashed inline-block"></span> 未開拓（未到達）</span>
            </div>
          </div>

          <!-- SVG地図描画エリア -->
          <div class="relative w-full rounded-2xl bg-gradient-to-b from-sky-50/60 via-slate-50/40 to-amber-50/40 border border-slate-200/80 p-2 sm:p-4 overflow-hidden">
            ${this.renderSvgMap(currentXp)}
            
            <!-- マウスホバー用フローティングツールチップ -->
            <div id="map-tooltip" class="absolute pointer-events-none hidden bg-slate-900/90 text-white text-xs px-3 py-1.5 rounded-xl shadow-lg border border-slate-700 backdrop-blur-xs z-20"></div>
          </div>
        </div>

        <!-- フィルタータブバー -->
        <div class="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs font-bold">
          <button type="button" data-filter="all" class="filter-tab-btn px-3 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
            this.state.currentFilter === 'all' ? 'bg-slate-800 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }">
            すべて (22)
          </button>
          <button type="button" data-filter="unlocked" class="filter-tab-btn px-3 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
            this.state.currentFilter === 'unlocked' ? 'bg-emerald-600 text-white shadow-xs' : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
          }">
            開拓済み (${unlockedCount})
          </button>
          <button type="button" data-filter="locked" class="filter-tab-btn px-3 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
            this.state.currentFilter === 'locked' ? 'bg-slate-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }">
            未開拓 (${totalCount - unlockedCount})
          </button>
          <div class="h-4 w-px bg-slate-300 mx-1"></div>
          <button type="button" data-filter="capital" class="filter-tab-btn px-3 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
            this.state.currentFilter === 'capital' ? 'bg-rose-600 text-white shadow-xs' : 'bg-rose-50 text-rose-800 hover:bg-rose-100'
          }">
            首都特別市
          </button>
          <button type="button" data-filter="north" class="filter-tab-btn px-3 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
            this.state.currentFilter === 'north' ? 'bg-teal-600 text-white shadow-xs' : 'bg-teal-50 text-teal-800 hover:bg-teal-100'
          }">
            北部
          </button>
          <button type="button" data-filter="west" class="filter-tab-btn px-3 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
            this.state.currentFilter === 'west' ? 'bg-cyan-600 text-white shadow-xs' : 'bg-cyan-50 text-cyan-800 hover:bg-cyan-100'
          }">
            西部
          </button>
          <button type="button" data-filter="central" class="filter-tab-btn px-3 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
            this.state.currentFilter === 'central' ? 'bg-emerald-600 text-white shadow-xs' : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
          }">
            中央部
          </button>
          <button type="button" data-filter="gobi" class="filter-tab-btn px-3 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
            this.state.currentFilter === 'gobi' ? 'bg-amber-600 text-white shadow-xs' : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
          }">
            ゴビ・南部
          </button>
          <button type="button" data-filter="east" class="filter-tab-btn px-3 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
            this.state.currentFilter === 'east' ? 'bg-purple-600 text-white shadow-xs' : 'bg-purple-50 text-purple-800 hover:bg-purple-100'
          }">
            東部
          </button>
        </div>

        <!-- 地域カード一覧グリッド -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          ${filteredDestinations.map((dest, i) => {
            const isUnlocked = currentXp >= dest.requiredXp;
            const remainingXp = Math.max(0, dest.requiredXp - currentXp);

            return `
              <div class="dest-card rounded-2xl p-4 sm:p-5 border-2 transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between hover:scale-[1.01] shadow-2xs ${
                isUnlocked 
                  ? 'bg-white border-emerald-300 hover:border-emerald-500 hover:shadow-md' 
                  : 'bg-slate-50 border-slate-200 hover:border-slate-300 opacity-85'
              }" data-id="${dest.id}">
                <div>
                  <div class="flex items-center justify-between mb-2.5">
                    <div class="flex items-center gap-2">
                      <span class="text-3xl p-1 rounded-xl shadow-2xs" style="background-color: ${isUnlocked ? dest.color + '22' : '#f1f5f9'};">
                        ${dest.badgeIcon}
                      </span>
                      <div>
                        <span class="text-[10px] font-black px-2 py-0.5 rounded-full ${
                          isUnlocked 
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                            : 'bg-slate-200 text-slate-600'
                        }">
                          ${isUnlocked ? '開拓済み 🚩' : `あと ${remainingXp} XP 🔒`}
                        </span>
                        <div class="text-[10px] text-slate-400 font-bold">${dest.zoneJa}</div>
                      </div>
                    </div>
                    <span class="text-[11px] font-mono font-bold text-slate-400">#${i + 1}</span>
                  </div>

                  <div class="space-y-0.5">
                    <h4 class="text-base font-black text-slate-900 cyrillic-text flex items-center gap-1.5">
                      <span>${dest.nameMn}</span>
                    </h4>
                    <div class="text-xs font-bold text-slate-700">
                      ${dest.nameJa}
                    </div>
                    <div class="text-[11px] text-slate-500">
                      県都: <strong>${dest.capitalMn} (${dest.capitalJa})</strong>
                    </div>
                  </div>

                  <p class="text-xs text-slate-600 mt-2 leading-relaxed line-clamp-2">
                    ${dest.description}
                  </p>
                </div>

                <div class="mt-4 pt-3 border-t ${isUnlocked ? 'border-emerald-100 text-emerald-700' : 'border-slate-200 text-slate-500'} flex items-center justify-between text-xs font-bold">
                  <span>${isUnlocked ? '記念カード・解説を見る 📸' : '詳細解説を見る 📖'}</span>
                  <span>→</span>
                </div>
              </div>
            `;
          }).join('')}
        </div>

        <!-- 名所記念カード・解説モーダル（選択時） -->
        ${this.state.selectedDestination ? this.renderModalHTML(this.state.selectedDestination) : ''}
      </div>
    `;

    this.bindEvents();
  }

  // SVG地図のHTML生成
  static renderSvgMap(currentXp) {
    return `
      <svg viewBox="0 0 960 520" class="w-full h-auto max-h-[500px] select-none font-sans" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="map-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        <!-- 背景デコレーション（山脈・方位記号） -->
        <g opacity="0.3">
          <!-- コンパス方位記号 -->
          <g transform="translate(870, 70)">
            <circle cx="0" cy="0" r="28" fill="none" stroke="#64748b" stroke-width="1.5" stroke-dasharray="3,3" />
            <path d="M 0 -24 L 6 0 L 0 -6 L -6 0 Z" fill="#059669" />
            <path d="M 0 24 L 6 0 L 0 6 L -6 0 Z" fill="#64748b" />
            <text x="0" y="-30" font-size="11" font-weight="bold" fill="#059669" text-anchor="middle">N</text>
            <text x="32" y="4" font-size="9" font-weight="bold" fill="#64748b" text-anchor="start">E</text>
            <text x="0" y="38" font-size="9" font-weight="bold" fill="#64748b" text-anchor="middle">S</text>
            <text x="-32" y="4" font-size="9" font-weight="bold" fill="#64748b" text-anchor="end">W</text>
          </g>
          <!-- モンゴル国境輪郭装飾 -->
          <text x="50" y="480" font-size="12" font-weight="bold" fill="#64748b" letter-spacing="2">MONGOLIA EXPEDITION MAP</text>
          <text x="50" y="496" font-size="10" fill="#94a3b8">21 Aimags & Capital Municipality</text>
        </g>

        <!-- 22地域のポリゴンとラベル描画 -->
        ${expeditionDestinations.map(dest => {
          const isUnlocked = currentXp >= dest.requiredXp;
          const pointsStr = dest.polygonPoints.map(pt => pt.join(',')).join(' ');
          const cx = dest.center.x;
          const cy = dest.center.y;
          const shortName = dest.nameMn.replace(' аймаг', '').replace(' хот', '');

          const fillColor = isUnlocked ? dest.color : '#cbd5e1';
          const fillOpacity = isUnlocked ? '0.88' : '0.45';
          const strokeColor = isUnlocked ? '#ffffff' : '#94a3b8';
          const strokeWidth = isUnlocked ? '2.5' : '1.5';
          const strokeDash = isUnlocked ? 'none' : '4,3';

          return `
            <g class="svg-region-group cursor-pointer group" data-region-id="${dest.id}">
              <!-- 地域ポリゴン -->
              <polygon 
                points="${pointsStr}" 
                fill="${fillColor}" 
                fill-opacity="${fillOpacity}" 
                stroke="${strokeColor}" 
                stroke-width="${strokeWidth}" 
                stroke-dasharray="${strokeDash}" 
                stroke-linejoin="round"
                class="transition-all duration-300 group-hover:brightness-110 group-hover:stroke-amber-400 group-hover:stroke-[3.5]"
              />

              <!-- 地域バッジピン（中心点） -->
              <g transform="translate(${cx}, ${cy})">
                <!-- ピン背景円 -->
                <circle 
                  cx="0" 
                  cy="0" 
                  r="${dest.id === 'ulaanbaatar' ? 14 : 12}" 
                  fill="${isUnlocked ? '#ffffff' : '#f1f5f9'}" 
                  stroke="${isUnlocked ? dest.color : '#94a3b8'}" 
                  stroke-width="${isUnlocked ? '2' : '1.5'}" 
                  filter="drop-shadow(0px 2px 3px rgba(0,0,0,0.25))"
                  class="transition-transform group-hover:scale-125"
                />

                <!-- アイコン (未開拓時は鍵アイコン) -->
                <text 
                  x="0" 
                  y="${dest.id === 'ulaanbaatar' ? 4 : 4}" 
                  font-size="${dest.id === 'ulaanbaatar' ? 13 : 11}" 
                  text-anchor="middle"
                  class="pointer-events-none select-none"
                >
                  ${isUnlocked ? dest.badgeIcon : '🔒'}
                </text>

                <!-- 地名ラベル（キリル文字） -->
                <text 
                  x="0" 
                  y="${dest.id === 'ulaanbaatar' ? -18 : (dest.id === 'tov' ? 22 : -16)}" 
                  font-size="${dest.id === 'ulaanbaatar' ? 11 : 9.5}" 
                  font-weight="bold" 
                  fill="${isUnlocked ? '#0f172a' : '#475569'}" 
                  text-anchor="middle"
                  stroke="#ffffff"
                  stroke-width="3"
                  paint-order="stroke fill"
                  class="pointer-events-none select-none transition-all group-hover:fill-amber-600"
                >
                  ${shortName}
                </text>
              </g>
            </g>
          `;
        }).join('')}
      </svg>
    `;
  }

  // イベントバインド
  static bindEvents() {
    // ホームへ戻る
    const backBtn = this.container.querySelector('#btn-back-home');
    if (backBtn) {
      backBtn.addEventListener('click', () => {
        if (this.onNavigate) this.onNavigate('home');
      });
    }

    // フィルターボタン
    this.container.querySelectorAll('.filter-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.state.currentFilter = btn.getAttribute('data-filter');
        this.render(this.container, this.onNavigate);
      });
    });

    // カードクリックで解説を開く
    this.container.querySelectorAll('.dest-card').forEach(card => {
      card.addEventListener('click', () => {
        const id = card.dataset.id;
        this.openRegionModal(id);
      });
    });

    // SVG地図の地域クリックで解説を開く
    this.container.querySelectorAll('.svg-region-group').forEach(group => {
      const id = group.getAttribute('data-region-id');
      const dest = expeditionDestinations.find(d => d.id === id);

      group.addEventListener('click', () => {
        this.openRegionModal(id);
      });

      // ツールチップ表示
      group.addEventListener('mouseenter', (e) => {
        const tooltip = this.container.querySelector('#map-tooltip');
        if (tooltip && dest) {
          const profile = GamificationService.getProfile();
          const isUnlocked = profile.totalXp >= dest.requiredXp;
          tooltip.innerHTML = `
            <div class="font-bold flex items-center gap-1.5">
              <span>${dest.badgeIcon}</span>
              <span>${dest.nameMn}</span>
              <span class="text-[10px] text-amber-300">(${dest.nameJa})</span>
            </div>
            <div class="text-[10px] text-slate-300 mt-0.5">
              県都: ${dest.capitalMn} | ${isUnlocked ? '🚩 開拓済み' : `🔒 あと ${Math.max(0, dest.requiredXp - profile.totalXp)} XP`}
            </div>
            <div class="text-[9px] text-sky-200 mt-0.5">タップで詳細解説を表示 →</div>
          `;
          tooltip.classList.remove('hidden');
        }
      });

      group.addEventListener('mousemove', (e) => {
        const tooltip = this.container.querySelector('#map-tooltip');
        if (tooltip) {
          const rect = this.container.getBoundingClientRect();
          tooltip.style.left = `${e.clientX - rect.left + 12}px`;
          tooltip.style.top = `${e.clientY - rect.top + 12}px`;
        }
      });

      group.addEventListener('mouseleave', () => {
        const tooltip = this.container.querySelector('#map-tooltip');
        if (tooltip) tooltip.classList.add('hidden');
      });
    });

    // モーダルクローズ
    const closeBtn = this.container.querySelector('#btn-close-exp-modal');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        this.state.selectedDestination = null;
        this.render(this.container, this.onNavigate);
      });
    }

    // 音声再生
    const modalSpeakBtn = this.container.querySelector('#btn-exp-speak');
    if (modalSpeakBtn && this.state.selectedDestination) {
      modalSpeakBtn.addEventListener('click', () => {
        SpeechService.speak(this.state.selectedDestination.nameMn);
      });
    }
  }

  static openRegionModal(id) {
    const dest = expeditionDestinations.find(d => d.id === id);
    if (dest) {
      this.state.selectedDestination = dest;
      SoundEffects.playCorrect();
      this.render(this.container, this.onNavigate);
    }
  }

  // 詳細解説モーダルのHTML生成
  static renderModalHTML(dest) {
    const profile = GamificationService.getProfile();
    const isUnlocked = profile.totalXp >= dest.requiredXp;
    const remainingXp = Math.max(0, dest.requiredXp - profile.totalXp);

    return `
      <div class="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-fade-in" id="expedition-modal-overlay">
        <div class="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-100 flex flex-col max-h-[92vh]">
          
          <!-- カード上部バナー -->
          <div class="bg-gradient-to-r ${dest.postcardColor} p-5 sm:p-6 text-white text-center relative flex-shrink-0">
            <button type="button" id="btn-close-exp-modal" class="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/20 hover:bg-black/40 text-white flex items-center justify-center text-sm font-bold transition-all cursor-pointer">
              ✕
            </button>
            <div class="text-4xl sm:text-5xl mb-1.5 filter drop-shadow-md">${dest.badgeIcon}</div>
            <div class="text-[10px] font-bold text-white/80 font-mono tracking-wider">MONGOLIA EXPEDITION POSTCARD</div>
            <h3 class="text-xl sm:text-2xl font-black cyrillic-text mt-0.5 leading-tight">${dest.nameMn}</h3>
            <div class="text-xs text-white/95 font-medium mt-0.5">${dest.nameJa}</div>
            <div class="mt-2 inline-flex items-center gap-1.5 bg-black/20 px-3 py-0.5 rounded-full text-[11px] font-bold">
              <span>📍 県都: ${dest.capitalMn} (${dest.capitalJa})</span>
              <span>•</span>
              <span>${dest.zoneJa}</span>
            </div>
          </div>

          <!-- カード詳細本文 -->
          <div class="p-5 sm:p-6 space-y-4 overflow-y-auto">
            
            <!-- ステータス ＆ 発音ボタン -->
            <div class="flex items-center justify-between border-b border-slate-100 pb-3 gap-2">
              <span class="text-xs font-bold ${isUnlocked ? 'text-emerald-700 bg-emerald-50 border border-emerald-200' : 'text-slate-600 bg-slate-100 border border-slate-200'} px-2.5 py-1 rounded-full flex items-center gap-1">
                ${isUnlocked ? '🚩 開拓済み（バッジ獲得）' : `🔒 未到達（あと ${remainingXp} XP）`}
              </span>
              <button type="button" id="btn-exp-speak" class="px-3 py-1 bg-sky-50 hover:bg-sky-100 text-sky-800 rounded-xl text-xs font-bold flex items-center gap-1.5 border border-sky-200 transition-all cursor-pointer shadow-2xs">
                <span>🔊</span> 発音を聞く
              </button>
            </div>

            <!-- 解説文 -->
            <div class="space-y-1.5">
              <h5 class="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                <span>📜</span> 歴史と自然の解説
              </h5>
              <p class="text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80">
                ${dest.description}
              </p>
            </div>

            <!-- 見どころ ＆ 特産品 -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <!-- 見どころ -->
              <div class="bg-sky-50/70 p-3 rounded-2xl border border-sky-200/80 space-y-1.5">
                <div class="text-xs font-bold text-sky-900 flex items-center gap-1">
                  <span>🏞️</span> 主な見どころ・名所:
                </div>
                <ul class="text-[11px] text-slate-700 space-y-1">
                  ${dest.attractions ? dest.attractions.map(a => `<li class="flex items-start gap-1"><span class="text-sky-500">•</span><span>${a}</span></li>`).join('') : ''}
                </ul>
              </div>

              <!-- 特産品 -->
              <div class="bg-emerald-50/70 p-3 rounded-2xl border border-emerald-200/80 space-y-1.5">
                <div class="text-xs font-bold text-emerald-900 flex items-center gap-1">
                  <span>🎁</span> 特産品・名物・文化:
                </div>
                <ul class="text-[11px] text-slate-700 space-y-1">
                  ${dest.specialties ? dest.specialties.map(s => `<li class="flex items-start gap-1"><span class="text-emerald-500">•</span><span>${s}</span></li>`).join('') : ''}
                </ul>
              </div>
            </div>

            <!-- 探検隊の豆知識（Fun Fact） -->
            <div class="bg-amber-50 p-3.5 rounded-2xl border border-amber-200 text-xs text-amber-950 space-y-1">
              <div class="font-bold flex items-center gap-1.5 text-amber-900">
                <span>💡</span> 探検隊の豆知識（Fun Fact）：
              </div>
              <p class="leading-relaxed text-[11px] sm:text-xs">
                ${dest.funFact}
              </p>
            </div>

            <!-- 獲得記念品 -->
            <div class="bg-slate-50 p-3 rounded-2xl border border-slate-200 flex items-center justify-between">
              <div>
                <div class="text-[10px] font-bold text-slate-400">探検記念品（お土産）</div>
                <div class="text-xs font-black text-slate-800">${dest.souvenir}</div>
              </div>
              <div class="text-right">
                <div class="text-[10px] font-bold text-slate-400">必要XP</div>
                <div class="text-xs font-mono font-bold text-emerald-700">${dest.requiredXp} XP</div>
              </div>
            </div>

          </div>

          <!-- モーダルフッター -->
          <div class="p-3 bg-slate-50 border-t border-slate-100 text-center">
            <button type="button" onclick="document.getElementById('btn-close-exp-modal').click()" class="w-full py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold transition-all cursor-pointer">
              探検マップに戻る
            </button>
          </div>

        </div>
      </div>
    `;
  }
}
