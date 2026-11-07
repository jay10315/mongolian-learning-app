// ジャンル別単語マスター ＆ ジャンル別単語ゲーム コンポーネント
// 身体部位・学校文房具・衣類・食べ物・日用品家電・果物野菜・方位 の全7分野を完全網羅
import { StorageService } from '../services/storage.js';
import { SpeechService } from '../services/speech.js';
import { SoundEffects, shuffleArray, isPronunciationCautionWord, getWordIllustrationHTML } from '../utils/helpers.js';
import { PenguinMascot } from './PenguinMascot.js';
import { GamificationService } from '../services/gamification.js';

export const GENRE_CONFIG = [
  {
    id: 'body',
    titleJa: '身体の部位',
    titleMn: 'Хүний бие',
    icon: '🫀',
    color: 'rose',
    badgeClass: 'bg-rose-100 text-rose-800 border-rose-300',
    headerGradient: 'from-rose-500 to-pink-600',
    description: '目、耳、鼻、口、手足、内臓など人体の各部位と健康に関する語彙'
  },
  {
    id: 'school',
    titleJa: '学校・文房具・教室',
    titleMn: 'Сургууль, хичээлийн хэрэгсэл',
    icon: '🎒',
    color: 'amber',
    badgeClass: 'bg-amber-100 text-amber-800 border-amber-300',
    headerGradient: 'from-amber-500 to-orange-600',
    description: '学校、教室、文房具（鉛筆・ノート・消しゴム・定規など）、室内設備'
  },
  {
    id: 'clothing',
    titleJa: '衣類・服飾品',
    titleMn: 'Хувцас, гоёл',
    icon: '👔',
    color: 'blue',
    badgeClass: 'bg-blue-100 text-blue-800 border-blue-300',
    headerGradient: 'from-blue-500 to-indigo-600',
    description: '日常の服、下着、防寒具、帽子、靴、アクセサリー、民族衣装（デール）'
  },
  {
    id: 'dining',
    titleJa: '食べ物・レストラン',
    titleMn: 'Хоол хүнс, ресторан',
    icon: '🍲',
    color: 'emerald',
    badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    headerGradient: 'from-emerald-500 to-teal-600',
    description: 'モンゴル伝統料理（ボーズ・ホーショール・ツォイワン）、飲料、肉、パン'
  },
  {
    id: 'appliances',
    titleJa: '日用品・家電・家具',
    titleMn: 'Гэр ахуй, цахилгаан бараа',
    icon: '🛋️',
    color: 'violet',
    badgeClass: 'bg-violet-100 text-violet-800 border-violet-300',
    headerGradient: 'from-violet-500 to-purple-600',
    description: '冷蔵庫・テレビ・洗濯機などの家電、ベッド・机などの家具、生活用品'
  },
  {
    id: 'produce',
    titleJa: '果物・野菜',
    titleMn: 'Жимс, ногоо',
    icon: '🍎',
    color: 'red',
    badgeClass: 'bg-red-100 text-red-800 border-red-300',
    headerGradient: 'from-red-500 to-rose-600',
    description: 'りんご、バナナ、すいか等の果物と、じゃがいも、にんじん、玉ねぎ等の野菜'
  },
  {
    id: 'directions',
    titleJa: '方位・方角',
    titleMn: 'Зүг чиг',
    icon: '🧭',
    color: 'cyan',
    badgeClass: 'bg-cyan-100 text-cyan-800 border-cyan-300',
    headerGradient: 'from-cyan-500 to-blue-600',
    description: '東西南北、北東・南東・南西・北西、上下・内外などの方向表現'
  },
  {
    id: 'law_crime',
    titleJa: '犯罪・法・正義',
    titleMn: 'Хууль, эрх зүй',
    icon: '⚖️',
    color: 'slate',
    badgeClass: 'bg-slate-100 text-slate-800 border-slate-300',
    headerGradient: 'from-slate-700 to-slate-900',
    description: '警察・法律・裁判・弁護士・権利・刑罰・義務など法と社会の必須語彙'
  },
  {
    id: 'education',
    titleJa: '教育・大学・学問',
    titleMn: 'Боловсрол, сургууль',
    icon: '🎓',
    color: 'indigo',
    badgeClass: 'bg-indigo-100 text-indigo-800 border-indigo-300',
    headerGradient: 'from-indigo-600 to-blue-700',
    description: '大学・教授・講義・試験・合格・奨学金・学位記・学術研究に関する語彙'
  },
  {
    id: 'emotions',
    titleJa: '感情・心理・気持ち',
    titleMn: 'Сэтгэл хөдлөл',
    icon: '💖',
    color: 'pink',
    badgeClass: 'bg-pink-100 text-pink-800 border-pink-300',
    headerGradient: 'from-pink-500 to-rose-600',
    description: '喜び・怒り・恐怖・愛・嫉妬・心配など感情語彙（動詞の格支配解説付き）'
  },
  {
    id: 'weather',
    titleJa: '天気・気候・自然現象',
    titleMn: 'Цаг агаар, уур амьсгал',
    icon: '🌤️',
    color: 'sky',
    badgeClass: 'bg-sky-100 text-sky-800 border-sky-300',
    headerGradient: 'from-sky-500 to-blue-600',
    description: '晴れ・雨・雪・風・砂嵐・寒害（ゾド）・気温・四季など気象気候の語彙'
  },
  {
    id: 'pronouns',
    titleJa: '人称代名詞・自分',
    titleMn: 'Биеийн төлөөний нэр',
    icon: '👤',
    color: 'teal',
    badgeClass: 'bg-teal-100 text-teal-800 border-teal-300',
    headerGradient: 'from-teal-600 to-emerald-700',
    description: '私・君・あなた・彼・私たち・自分自身（格変化パターン完全網羅）'
  },
  {
    id: 'numbers',
    titleJa: '数字・数量・序数',
    titleMn: 'Тоо ширхэг, дэс дараалал',
    icon: '🔢',
    color: 'amber',
    badgeClass: 'bg-amber-100 text-amber-800 border-amber-300',
    headerGradient: 'from-amber-500 to-yellow-600',
    description: '1〜10、十、百、千、万、億、第1・第2（序数）、2人とも（集合数詞）'
  },
  {
    id: 'places',
    titleJa: '場所・施設・街',
    titleMn: 'Газар орон, барилга байгууламж',
    icon: '🏛️',
    color: 'emerald',
    badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    headerGradient: 'from-emerald-600 to-teal-700',
    description: '病院・薬局・郵便局・銀行・空港・市場・図書館・公園・大使館など街の施設'
  },
  {
    id: 'demonstratives',
    titleJa: '指示代名詞・疑問詞',
    titleMn: 'Заах, асуух төлөөний нэр',
    icon: '👉',
    color: 'orange',
    badgeClass: 'bg-orange-100 text-orange-800 border-orange-300',
    headerGradient: 'from-orange-500 to-amber-600',
    description: 'これ・あれ・ここ・あそこ・こちら・あちら・こんな・どんな・なぜ・いつ'
  },
  {
    id: 'postpositions',
    titleJa: '後置詞（格支配の完全解説）',
    titleMn: 'Дагавар үгс, тийн ялгалын захиргаа',
    icon: '🔗',
    color: 'purple',
    badgeClass: 'bg-purple-100 text-purple-800 border-purple-300',
    headerGradient: 'from-purple-600 to-indigo-700',
    description: '〜について・〜のために・〜の前に・〜以来・〜と一緒に等（各支配の徹底解説）'
  },
  {
    id: 'japan_culture',
    titleJa: '日本文化・日本紹介',
    titleMn: 'Японы соёл уламжлал',
    icon: '🗾',
    color: 'red',
    badgeClass: 'bg-red-100 text-red-800 border-red-300',
    headerGradient: 'from-red-600 to-rose-700',
    description: '富士山・桜・相撲・寿司・着物・温泉・新幹線・茶道・漫画など日本を紹介する語彙'
  },
  {
    id: 'music',
    titleJa: '音楽・芸能・楽器',
    titleMn: 'Хөгжим, дуу хуур',
    icon: '🎵',
    color: 'fuchsia',
    badgeClass: 'bg-fuchsia-100 text-fuchsia-800 border-fuchsia-300',
    headerGradient: 'from-fuchsia-600 to-pink-700',
    description: '馬頭琴・ホーミー・長唄（オルティンドー）・歌・リズム・コンサート・楽器'
  },
  {
    id: 'useful_phrases',
    titleJa: '便利な言葉・日常決まり文句',
    titleMn: 'Хэрэгтэй өдөр тутмын хэллэг',
    icon: '💬',
    color: 'lime',
    badgeClass: 'bg-lime-100 text-lime-800 border-lime-300',
    headerGradient: 'from-emerald-500 to-lime-600',
    description: 'ありがとう・どういたしまして・どうぞ・乾杯・相槌・日常の潤滑油フレーズ'
  },
  {
    id: 'business',
    titleJa: 'ビジネス・仕事・経済',
    titleMn: 'Бизнес, ажил хэрэг',
    icon: '💼',
    color: 'cyan',
    badgeClass: 'bg-cyan-100 text-cyan-800 border-cyan-300',
    headerGradient: 'from-cyan-600 to-teal-700',
    description: '会社・社長・同僚・会議・契約・給料・プロジェクト・貿易・税金・請求書'
  },
  {
    id: 'medical',
    titleJa: '医療・健康・病院',
    titleMn: 'Эрүүл мэнд, эмнэлэг',
    icon: '🩺',
    color: 'rose',
    badgeClass: 'bg-rose-100 text-rose-800 border-rose-300',
    headerGradient: 'from-rose-600 to-red-700',
    description: '医師・看護師・患者・薬・注射・熱・頭痛・風邪・手術・救急車・血圧'
  }
];

export class GenreWordMasterComponent {
  static container = null;
  static onNavigate = null;

  static state = {
    view: 'genre_select', // 'genre_select' | 'word_list' | 'game' | 'game_result'
    activeGenreId: 'body',
    searchQuery: '',
    
    // ゲーム状態
    gameQuestions: [],
    gameCurrentIndex: 0,
    currentQuestion: null,
    gameChoices: [],
    gameScore: 0,
    gameCombo: 0,
    gameMaxCombo: 0,
    gameCorrectCount: 0,
    hasAnswered: false,
    selectedChoice: null,
    isCorrect: false,
    mistakes: [],
    mascotMood: 'idle',
    mascotMessage: '準備はいいかい？全問正解を目指そう！🐧'
  };

  static render(container, onNavigate) {
    this.container = container;
    this.onNavigate = onNavigate;
    this.renderUI();
  }

  static getGenreWords(genreId) {
    const rawVocab = StorageService.getVocabulary();
    return rawVocab.filter(w => w.genreId === genreId);
  }

  static renderUI() {
    if (!this.container) return;

    if (this.state.view === 'genre_select') {
      this.renderGenreSelectUI();
    } else if (this.state.view === 'word_list') {
      this.renderWordListUI();
    } else if (this.state.view === 'game') {
      this.renderGameUI();
    } else if (this.state.view === 'game_result') {
      this.renderGameResultUI();
    }
  }

  // ==========================================
  // 1. ジャンル選択画面
  // ==========================================
  static renderGenreSelectUI() {
    const allVocab = StorageService.getVocabulary();

    const genreStats = GENRE_CONFIG.map(g => {
      const words = allVocab.filter(w => w.genreId === g.id);
      return {
        ...g,
        count: words.length,
        samples: words.slice(0, 4).map(w => w.mongolian).join('・')
      };
    });

    const totalGenreWords = genreStats.reduce((sum, g) => sum + g.count, 0);

    this.container.innerHTML = `
      <div class="animate-fade-in max-w-5xl mx-auto px-4 py-6 space-y-6">
        
        <!-- ヘッダーバナー -->
        <div class="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
          <div class="absolute -right-6 -bottom-6 text-8xl opacity-15 pointer-events-none">🏷️</div>
          <div class="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div class="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3.5 py-1 rounded-full text-xs font-bold mb-2">
                <span>⚡ テーマ別単語特訓</span>
                <span>•</span>
                <span>全7ジャンル (${totalGenreWords}語)</span>
              </div>
              <h2 class="text-2xl sm:text-3xl font-black tracking-tight">
                ジャンル別単語マスター ＆ クイズ
              </h2>
              <p class="text-emerald-100 text-sm mt-1 max-w-xl">
                身体の部位、学校、衣類、料理、日用品、野菜・果物、方位をジャンルごとに整理して学習。単語帳で音声を確認し、ジャンル別単語ゲームで即座に記憶に定着させましょう！
              </p>
            </div>
            <div class="flex items-center gap-2">
              <button type="button" id="btn-genre-home-back" class="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-1.5 shadow-sm">
                <span>← ホームへ</span>
              </button>
            </div>
          </div>
        </div>

        <!-- ジャンルカード一覧 (7分野) -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          ${genreStats.map(g => `
            <div class="bg-white rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all p-5 flex flex-col justify-between space-y-4 group">
              <div>
                <div class="flex items-center justify-between mb-3">
                  <span class="text-3xl p-2.5 bg-slate-50 rounded-2xl border border-slate-100 group-hover:scale-110 transition-transform">
                    ${g.icon}
                  </span>
                  <span class="text-xs font-black px-3 py-1 rounded-full ${g.badgeClass}">
                    ${g.count} 語収録
                  </span>
                </div>
                <h3 class="text-lg font-black text-slate-800 flex items-center gap-1.5">
                  ${g.titleJa}
                </h3>
                <div class="text-xs font-bold text-slate-500 mb-2">
                  ${g.titleMn}
                </div>
                <p class="text-xs text-slate-600 leading-relaxed mb-3">
                  ${g.description}
                </p>
                <div class="text-[11px] text-slate-400 bg-slate-50 p-2 rounded-xl border border-slate-100 font-mono">
                  💡 例: ${g.samples || '単語収集中'}
                </div>
              </div>

              <!-- アクションボタン -->
              <div class="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                <button type="button" class="btn-open-wordlist w-full py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all flex items-center justify-center gap-1" data-genre-id="${g.id}">
                  <span>📖 単語帳</span>
                </button>
                <button type="button" class="btn-start-genre-game w-full py-2 px-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white text-xs font-black shadow-xs active:scale-95 transition-all flex items-center justify-center gap-1" data-genre-id="${g.id}">
                  <span>🎮 ゲーム</span>
                </button>
              </div>
            </div>
          `).join('')}
        </div>

      </div>
    `;

    this.bindGenreSelectEvents();
  }

  static bindGenreSelectEvents() {
    const homeBtn = this.container.querySelector('#btn-genre-home-back');
    if (homeBtn && this.onNavigate) {
      homeBtn.addEventListener('click', () => this.onNavigate('home'));
    }

    this.container.querySelectorAll('.btn-open-wordlist').forEach(btn => {
      btn.addEventListener('click', () => {
        const gid = btn.dataset.genreId;
        this.state.activeGenreId = gid;
        this.state.searchQuery = '';
        this.state.view = 'word_list';
        this.renderUI();
      });
    });

    this.container.querySelectorAll('.btn-start-genre-game').forEach(btn => {
      btn.addEventListener('click', () => {
        const gid = btn.dataset.genreId;
        this.startGenreGame(gid);
      });
    });
  }

  // ==========================================
  // 2. 単語帳一覧画面（音声再生・検索対応）
  // ==========================================
  static renderWordListUI() {
    const genre = GENRE_CONFIG.find(g => g.id === this.state.activeGenreId) || GENRE_CONFIG[0];
    let words = this.getGenreWords(genre.id);

    // 検索フィルタ
    if (this.state.searchQuery.trim()) {
      const q = this.state.searchQuery.trim().toLowerCase();
      words = words.filter(w => 
        (w.mongolian && w.mongolian.toLowerCase().includes(q)) ||
        (w.japanese && w.japanese.toLowerCase().includes(q)) ||
        (w.pronunciation && w.pronunciation.includes(q))
      );
    }

    this.container.innerHTML = `
      <div class="animate-fade-in max-w-5xl mx-auto px-4 py-6 space-y-6">
        
        <!-- ナビバー -->
        <div class="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div class="flex items-center gap-2">
            <button type="button" id="btn-back-to-genres" class="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
              </svg>
            </button>
            <div class="flex items-center gap-2">
              <span class="text-2xl">${genre.icon}</span>
              <div>
                <h2 class="text-base sm:text-lg font-black text-slate-800">
                  ${genre.titleJa} 単語帳
                </h2>
                <div class="text-[11px] font-bold text-slate-400">
                  ${genre.titleMn} • ${words.length} 語表示
                </div>
              </div>
            </div>
          </div>

          <div class="flex items-center gap-2">
            <button type="button" id="btn-launch-game-from-list" class="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white text-xs font-black px-4 py-2 rounded-xl shadow-xs active:scale-95 transition-all flex items-center gap-1.5">
              <span>🎮 このジャンルでゲーム開始</span>
            </button>
          </div>
        </div>

        <!-- 検索バー ＆ ジャンル切替タブ -->
        <div class="flex flex-col sm:flex-row items-center gap-3">
          <div class="relative flex-1 w-full">
            <span class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
            <input 
              type="text" 
              id="genre-word-search" 
              value="${this.state.searchQuery}" 
              placeholder="モンゴル語・日本語・カタカナで検索..." 
              class="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 shadow-2xs"
            />
          </div>

          <!-- 他ジャンルへのクイック切り替え -->
          <div class="flex items-center gap-1 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            ${GENRE_CONFIG.map(g => `
              <button type="button" class="btn-switch-genre px-2.5 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all ${
                g.id === genre.id ? 'bg-slate-900 text-white shadow-xs' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }" data-genre-id="${g.id}">
                <span>${g.icon}</span>
                <span class="hidden md:inline">${g.titleJa}</span>
              </button>
            `).join('')}
          </div>
        </div>

        <!-- 単語一覧グリッド（ビジュアルイラスト付き・要件10準拠） -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          ${words.map(w => `
            <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-4 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-3">
              <div>
                <div class="flex items-start justify-between gap-2.5">
                  <div class="flex items-center gap-3">
                    ${(typeof getWordIllustrationHTML === 'function') ? getWordIllustrationHTML(w, { size: 'lg' }) : ''}
                    <div>
                      <div class="text-xl font-black text-slate-900 dark:text-white tracking-wide font-sans">
                        ${w.mongolian}
                      </div>
                      ${(typeof isPronunciationCautionWord === 'function' && isPronunciationCautionWord(w) && w.pronunciation) ? `
                        <div class="text-xs font-bold text-amber-600 dark:text-amber-400">
                          ⚠️ [ ${w.pronunciation} ]
                        </div>
                      ` : ''}
                    </div>
                  </div>
                  <button type="button" class="btn-play-word-audio p-2 rounded-xl bg-emerald-50 dark:bg-slate-700 hover:bg-emerald-100 dark:hover:bg-slate-600 text-emerald-700 dark:text-emerald-400 transition-colors cursor-pointer shrink-0" data-word="${w.mongolian}" title="音声を聴く">
                    <span class="text-base">🔊</span>
                  </button>
                </div>

                <div class="mt-2.5 pt-2.5 border-t border-slate-100 dark:border-slate-700">
                  <div class="text-sm font-black text-slate-800 dark:text-slate-100">
                    ${w.japanese}${w.altMongolian ? ` <span class="text-xs font-normal text-slate-500 dark:text-slate-400">(${w.altMongolian})</span>` : ''}
                  </div>
                  <div class="text-[11px] text-slate-400 dark:text-slate-400 font-medium flex items-center justify-between">
                    <span>品詞: ${w.pos || '名詞'}</span>
                    ${w.caseGovernment ? `<span class="px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-900 dark:text-purple-200 font-black text-[10px] border border-purple-200 dark:border-purple-800">⚡ ${w.caseGovernment}</span>` : ''}
                  </div>
                </div>

                ${w.caseGovernment ? `
                  <div class="mt-2 p-2.5 bg-gradient-to-br from-purple-50 to-indigo-50/50 dark:from-purple-950/40 dark:to-indigo-950/40 rounded-xl border border-purple-200 dark:border-purple-800 text-xs space-y-1">
                    <div class="font-black text-purple-950 dark:text-purple-200 flex items-center gap-1.5">
                      <span>⚡ 格支配:</span>
                      <span class="text-purple-800 dark:text-purple-300 font-bold">${w.caseGovernment}</span>
                    </div>
                    ${w.caseNote ? `<div class="text-[11px] text-purple-900 dark:text-purple-300 leading-relaxed">${w.caseNote}</div>` : ''}
                  </div>
                ` : ''}

                ${w.note ? `
                  <div class="mt-2 text-[11px] text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-700/50 p-2 rounded-xl border border-slate-100 dark:border-slate-700 leading-relaxed">
                    💡 ${w.note}
                  </div>
                ` : ''}

                ${w.exampleMn ? `
                  <div class="mt-2 p-2 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-100 dark:border-slate-700/60 text-xs space-y-0.5">
                    <div class="font-bold text-slate-700 dark:text-slate-200 font-sans">${w.exampleMn}</div>
                    <div class="text-[11px] text-slate-500 dark:text-slate-400">${w.exampleJa || ''}</div>
                  </div>
                ` : ''}

                ${(typeof getWordEtymologyHTML === 'function') ? getWordEtymologyHTML(w, w.mongolian) : ''}
                ${(typeof getWordMnemonicHTML === 'function') ? getWordMnemonicHTML(w, w.mongolian) : ''}
                ${(typeof getSimilarWordDistinctionHTML === 'function') ? getSimilarWordDistinctionHTML(w, w.mongolian) : ''}
              </div>
            </div>
          `).join('')}
        </div>

        ${words.length === 0 ? `
          <div class="text-center py-12 bg-white rounded-3xl border border-slate-200 p-8 space-y-2">
            <div class="text-4xl">🔍</div>
            <div class="text-base font-bold text-slate-700">該当する単語が見つかりませんでした</div>
            <div class="text-xs text-slate-400">検索キーワードを変更するかクリアしてください</div>
          </div>
        ` : ''}

      </div>
    `;

    this.bindWordListEvents();
  }

  static bindWordListEvents() {
    const backBtn = this.container.querySelector('#btn-back-to-genres');
    if (backBtn) {
      backBtn.addEventListener('click', () => {
        this.state.view = 'genre_select';
        this.renderUI();
      });
    }

    const launchGameBtn = this.container.querySelector('#btn-launch-game-from-list');
    if (launchGameBtn) {
      launchGameBtn.addEventListener('click', () => {
        this.startGenreGame(this.state.activeGenreId);
      });
    }

    const searchInput = this.container.querySelector('#genre-word-search');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.state.searchQuery = e.target.value;
        this.renderWordListUI();
      });
    }

    this.container.querySelectorAll('.btn-switch-genre').forEach(btn => {
      btn.addEventListener('click', () => {
        this.state.activeGenreId = btn.dataset.genreId;
        this.state.searchQuery = '';
        this.renderWordListUI();
      });
    });

    this.container.querySelectorAll('.btn-play-word-audio').forEach(btn => {
      btn.addEventListener('click', () => {
        const word = btn.dataset.word;
        if (word) {
          SpeechService.speak(word, { rate: 0.9 });
        }
      });
    });
  }

  // ==========================================
  // 3. ジャンル別単語ゲーム開始
  // ==========================================
  static startGenreGame(genreId) {
    this.state.activeGenreId = genreId;
    const words = this.getGenreWords(genreId);
    if (!words || words.length < 4) {
      alert('このジャンルの単語数がゲームの開始要件（4語以上）に達していません。');
      return;
    }

    // 10問（または単語数上限）をシャッフル抽出
    const shuffled = shuffleArray([...words]);
    const count = Math.min(10, shuffled.length);
    this.state.gameQuestions = shuffled.slice(0, count);
    this.state.gameCurrentIndex = 0;
    this.state.gameScore = 0;
    this.state.gameCombo = 0;
    this.state.gameMaxCombo = 0;
    this.state.gameCorrectCount = 0;
    this.state.mistakes = [];
    this.state.gameResults = [];
    this.state.view = 'game';

    this.loadGameQuestion();
    this.renderUI();
  }

  static loadGameQuestion() {
    if (this.state.gameCurrentIndex >= this.state.gameQuestions.length) {
      this.finishGenreGame();
      return;
    }

    const qWord = this.state.gameQuestions[this.state.gameCurrentIndex];
    this.state.currentQuestion = qWord;
    this.state.hasAnswered = false;
    this.state.selectedChoice = null;
    this.state.isCorrect = false;

    // 出題形式：50%で「モンゴル語 ➜ 日本語」、50%で「日本語 ➜ モンゴル語」
    const isMnToJa = Math.random() > 0.35;
    this.state.questionType = isMnToJa ? 'mn_to_ja' : 'ja_to_mn';

    // 4択肢の作成（正解 ＋ 同ジャンル内のダミー3件）
    const allGenreWords = this.getGenreWords(this.state.activeGenreId);
    const otherWords = allGenreWords.filter(w => w.id !== qWord.id);
    const chosenDummies = shuffleArray(otherWords).slice(0, 3);

    const pool = [qWord, ...chosenDummies];
    const shuffledPool = shuffleArray(pool);

    this.state.gameChoices = shuffledPool.map(w => {
      const isCaution = typeof isPronunciationCautionWord === 'function' ? isPronunciationCautionWord(w) : false;
      return {
        word: w,
        text: isMnToJa ? w.japanese : w.mongolian,
        subText: isMnToJa ? '' : (isCaution && w.pronunciation ? `⚠️ [${w.pronunciation}]` : ''),
        isAnswer: w.id === qWord.id
      };
    });

    this.state.mascotMood = 'idle';
    this.state.mascotMessage = `第 ${this.state.gameCurrentIndex + 1} 問！がんばって！🐧`;

    // 自動音声再生（モンゴル語提示時）
    if (isMnToJa) {
      setTimeout(() => {
        try {
          SpeechService.speak(qWord.mongolian, { rate: 0.9 });
        } catch (_) {}
      }, 200);
    }
  }

  static renderGameUI() {
    const genre = GENRE_CONFIG.find(g => g.id === this.state.activeGenreId) || GENRE_CONFIG[0];
    const { currentQuestion, gameCurrentIndex, gameQuestions, gameChoices, gameScore, gameCombo, questionType, hasAnswered, selectedChoice, isCorrect, mascotMood, mascotMessage } = this.state;

    const isMnToJa = questionType === 'mn_to_ja';
    const progressPercent = Math.round(((gameCurrentIndex + 1) / gameQuestions.length) * 100);

    this.container.innerHTML = `
      <div class="animate-fade-in max-w-3xl mx-auto px-4 py-6 space-y-6">
        
        <!-- ゲームヘッダーバー -->
        <div class="flex items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
          <div class="flex items-center gap-2">
            <button type="button" id="btn-quit-genre-game" class="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors" title="ゲームをやめる">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
            <div class="flex items-center gap-1.5 text-xs font-black text-slate-800">
              <span>${genre.icon}</span>
              <span>${genre.titleJa} ゲーム</span>
            </div>
          </div>

          <!-- スコア・コンボ -->
          <div class="flex items-center gap-2 text-xs">
            <div class="bg-amber-50 text-amber-900 border border-amber-300 px-3 py-1 rounded-full font-black flex items-center gap-1">
              <span>⚡</span>
              <span>${gameScore} pt</span>
              ${gameCombo >= 2 ? `<span class="bg-amber-400 text-slate-950 px-1.5 py-0.2 rounded-full text-[10px] font-bold">${gameCombo}連勝</span>` : ''}
            </div>
            <div class="text-slate-500 font-bold">
              ${gameCurrentIndex + 1} / ${gameQuestions.length}
            </div>
          </div>
        </div>

        <!-- 進捗バー -->
        <div class="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
          <div class="bg-emerald-500 h-full rounded-full transition-all duration-300" style="width: ${progressPercent}%"></div>
        </div>

        <!-- 問題カード -->
        <div class="bg-white rounded-3xl border-2 border-slate-200 p-6 sm:p-8 text-center shadow-lg relative overflow-hidden">
          
          <div class="inline-flex items-center gap-1 text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full mb-3">
            <span>${isMnToJa ? '🇲🇳 モンゴル語 ➜ 🇯🇵 日本語' : '🇯🇵 日本語 ➜ 🇲🇳 モンゴル語'}</span>
          </div>

          <!-- メイン問題文（ビジュアルイラスト付き） -->
          <div class="my-4">
            <div class="flex justify-center mb-3">
              ${(typeof getWordIllustrationHTML === 'function') ? getWordIllustrationHTML(currentQuestion, { size: 'xl' }) : ''}
            </div>
            ${isMnToJa ? `
              <h3 class="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-wide font-sans mb-2">
                ${currentQuestion.mongolian}
              </h3>
              ${(typeof isPronunciationCautionWord === 'function' && isPronunciationCautionWord(currentQuestion) && currentQuestion.pronunciation) ? `
                <div class="inline-block text-xs font-bold text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200 mb-3">
                  ⚠️ 読み注意: [ ${currentQuestion.pronunciation} ]
                </div>
              ` : '<div class="mb-2"></div>'}
              <button type="button" id="btn-audio-question" class="inline-flex items-center gap-1.5 text-xs bg-emerald-50 hover:bg-emerald-100 text-emerald-700 px-3.5 py-1.5 rounded-full font-bold transition-all border border-emerald-200 cursor-pointer">
                <span>🔊 発音を聴く</span>
              </button>
            ` : `
              <h3 class="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-wide font-sans mb-2">
                ${currentQuestion.japanese}
              </h3>
              <div class="text-xs text-slate-400 font-medium">
                品詞: ${currentQuestion.pos || '単語'}
              </div>
            `}
          </div>

          <!-- 4択選択肢 -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
            ${gameChoices.map((c, idx) => {
              let btnClass = 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-2 border-slate-200';
              if (hasAnswered) {
                if (c.isAnswer) {
                  btnClass = 'bg-emerald-500 text-white border-2 border-emerald-400 shadow-md font-black scale-102';
                } else if (selectedChoice === c && !isCorrect) {
                  btnClass = 'bg-rose-500 text-white border-2 border-rose-400 shadow-sm';
                } else {
                  btnClass = 'opacity-40 bg-slate-100 text-slate-400 border border-slate-200';
                }
              }

              return `
                <button type="button" class="btn-game-choice p-4 rounded-2xl text-left font-bold transition-all flex items-center justify-between ${btnClass} ${hasAnswered ? 'cursor-default pointer-events-none' : 'active:scale-98 cursor-pointer'}" data-choice-index="${idx}">
                  <div>
                    <div class="text-base sm:text-lg">${c.text}</div>
                    ${c.subText ? `<div class="text-xs text-amber-700 font-bold">${c.subText}</div>` : ''}
                  </div>
                  <span class="text-xs text-slate-400 font-mono">${idx + 1}</span>
                </button>
              `;
            }).join('')}
          </div>

          <!-- 回答後フィードバック -->
          ${hasAnswered ? `
            <div class="mt-6 p-4 rounded-2xl text-left border ${isCorrect ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-rose-50 border-rose-200 text-rose-900'}">
              <div class="flex items-center justify-between mb-2">
                <span class="font-black text-sm">
                  ${isCorrect ? '⭕ 正解！ амжилттай!' : '❌ おしい！'}
                </span>
                <button type="button" id="btn-next-game-q" class="px-5 py-2 rounded-xl bg-slate-900 text-white text-xs font-black hover:bg-slate-800 active:scale-95 transition-all shadow-md">
                  次へ進む →
                </button>
              </div>
              <div class="text-xs space-y-1">
                <div><strong>正解:</strong> <span class="correct-answer-text font-black text-slate-900">${currentQuestion.mongolian}</span> ${(typeof isPronunciationCautionWord === 'function' && isPronunciationCautionWord(currentQuestion) && currentQuestion.pronunciation) ? `<span class="text-amber-700 font-bold ml-1">⚠️ [${currentQuestion.pronunciation}]</span>` : ''} = ${currentQuestion.japanese}</div>
                ${currentQuestion.exampleMn ? `<div><strong>例文:</strong> ${currentQuestion.exampleMn} (${currentQuestion.exampleJa || ''})</div>` : ''}
                ${(typeof getWordEtymologyHTML === 'function') ? getWordEtymologyHTML(currentQuestion, currentQuestion.mongolian) : ''}
                ${(typeof getWordMnemonicHTML === 'function') ? getWordMnemonicHTML(currentQuestion, currentQuestion.mongolian) : ''}
                ${(typeof getSimilarWordDistinctionHTML === 'function') ? getSimilarWordDistinctionHTML(currentQuestion, currentQuestion.mongolian) : ''}
              </div>

              <!-- 選択肢に出た単語の全解説アコーディオン -->
              ${(typeof renderChoiceExplanationsHTML === 'function' && gameChoices && gameChoices.length > 0) ? renderChoiceExplanationsHTML(gameChoices.map(c => c.word), {
                expectedAnswer: isMnToJa ? currentQuestion.japanese : currentQuestion.mongolian,
                userAnswer: selectedChoice && selectedChoice.word ? (isMnToJa ? selectedChoice.word.japanese : selectedChoice.word.mongolian) : ''
              }) : ''}
            </div>
          ` : ''}

        </div>

        <!-- ペンギンマスコット リアクション -->
        <div class="bg-gradient-to-r from-sky-50 to-emerald-50 rounded-2xl p-4 border border-sky-200/70 flex items-center gap-3.5 shadow-2xs">
          <div class="shrink-0">
            ${PenguinMascot.getSvg({ mood: mascotMood, size: 50 })}
          </div>
          <div class="text-xs sm:text-sm font-bold text-slate-700">
            ${mascotMessage}
          </div>
        </div>

      </div>
    `;

    this.bindGameEvents();
  }

  static bindGameEvents() {
    const quitBtn = this.container.querySelector('#btn-quit-genre-game');
    if (quitBtn) {
      quitBtn.addEventListener('click', () => {
        if (confirm('ゲームを途中で終了してジャンル選択に戻りますか？')) {
          this.state.view = 'genre_select';
          this.renderUI();
        }
      });
    }

    const audioBtn = this.container.querySelector('#btn-audio-question');
    if (audioBtn && this.state.currentQuestion) {
      audioBtn.addEventListener('click', () => {
        SpeechService.speak(this.state.currentQuestion.mongolian, { rate: 0.9 });
      });
    }

    this.container.querySelectorAll('.btn-game-choice').forEach(btn => {
      btn.addEventListener('click', () => {
        if (this.state.hasAnswered) return;
        const idx = parseInt(btn.dataset.choiceIndex, 10);
        this.submitAnswer(idx);
      });
    });

    this.container.querySelectorAll('.btn-speak-choice-word').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const word = btn.getAttribute('data-word');
        if (word && typeof SpeechService !== 'undefined') {
          SpeechService.speak(word, { rate: 0.9 });
        }
      });
    });

    const nextBtn = this.container.querySelector('#btn-next-game-q');
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        this.state.gameCurrentIndex++;
        this.loadGameQuestion();
        this.renderUI();
      });
    }
  }

  static submitAnswer(choiceIdx) {
    if (this.state.hasAnswered) return;
    this.state.hasAnswered = true;

    const chosen = this.state.gameChoices[choiceIdx];
    this.state.selectedChoice = chosen;
    const isCorrect = chosen && chosen.isAnswer;
    this.state.isCorrect = isCorrect;

    if (isCorrect) {
      this.state.gameCombo++;
      if (this.state.gameCombo > this.state.gameMaxCombo) {
        this.state.gameMaxCombo = this.state.gameCombo;
      }
      this.state.gameCorrectCount++;
      const pts = 10 + Math.min(this.state.gameCombo * 2, 20);
      this.state.gameScore += pts;

      this.state.mascotMood = 'happy';
      this.state.mascotMessage = `大正解！モグモグ！美味しいお魚ありがとう！🐟 (+${pts} pt)`;

      try {
        SoundEffects.playCorrect();
      } catch (_) {}

      // XP付与
      try {
        if (typeof GamificationService !== 'undefined' && typeof GamificationService.addXp === 'function') {
          GamificationService.addXp(10);
        }
      } catch (_) {}
    } else {
      this.state.gameCombo = 0;
      this.state.mascotMood = 'sad';
      this.state.mascotMessage = 'おしい！次はきっと正解できるよ！ファイト！🐧';

      try {
        SoundEffects.playWrong();
      } catch (_) {}

      this.state.mistakes.push(this.state.currentQuestion);

      try {
        const curQ = this.state.currentQuestion;
        const genre = this.getGenreById(this.state.selectedGenreId) || {};
        const isMnToJa = this.state.questionType === 'mn_to_ja';
        const userWord = chosen ? chosen.word : null;
        StorageService.recordMistake({
          question: `【ジャンル: ${genre.titleJa || '単語'}】${isMnToJa ? curQ.mongolian : curQ.japanese}`,
          userAnswer: userWord ? (isMnToJa ? userWord.japanese : userWord.mongolian) : '(未選択)',
          correctAnswer: isMnToJa ? curQ.japanese : (curQ.dictForm || curQ.mongolian),
          type: 'word',
          category: genre.titleJa || 'ジャンル単語',
          explanation: `${curQ.mongolian} = ${curQ.japanese}。${curQ.note || curQ.derivation || ''}`
        });
      } catch (err) {
        console.warn('Genre mistake recording error:', err);
      }
    }

    if (!this.state.gameResults) this.state.gameResults = [];
    this.state.gameResults.push({
      question: this.state.currentQuestion,
      questionType: this.state.questionType,
      choices: this.state.gameChoices ? this.state.gameChoices.map(c => c.word) : [],
      selectedChoice: chosen ? chosen.word : null,
      isCorrect: isCorrect
    });

    this.renderUI();
  }

  static finishGenreGame() {
    this.state.view = 'game_result';

    // ゲーム完了時ボーナスXP
    try {
      if (typeof GamificationService !== 'undefined' && typeof GamificationService.addXp === 'function') {
        const bonus = this.state.gameCorrectCount >= 8 ? 40 : 20;
        GamificationService.addXp(bonus);
      }
    } catch (_) {}

    this.renderUI();
  }

  // ==========================================
  // 4. ゲーム結果画面
  // ==========================================
  static renderGameResultUI() {
    const genre = GENRE_CONFIG.find(g => g.id === this.state.activeGenreId) || GENRE_CONFIG[0];
    const { gameScore, gameCorrectCount, gameQuestions, gameMaxCombo, mistakes } = this.state;
    const accuracy = Math.round((gameCorrectCount / gameQuestions.length) * 100);

    this.container.innerHTML = `
      <div class="animate-fade-in max-w-2xl mx-auto px-4 py-8 space-y-6">
        
        <div class="bg-white rounded-3xl border-2 border-slate-200 p-6 sm:p-8 text-center shadow-xl space-y-6">
          <div class="text-5xl">🎉</div>
          <div>
            <h2 class="text-2xl sm:text-3xl font-black text-slate-900">
              ゲーム終了！お疲れ様でした！
            </h2>
            <div class="text-xs font-bold text-slate-500 mt-1">
              ${genre.icon} ${genre.titleJa} 単語チャレンジ
            </div>
          </div>

          <!-- スコア・正解率バッジ -->
          <div class="grid grid-cols-3 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <div>
              <div class="text-xs font-bold text-slate-500">獲得スコア</div>
              <div class="text-2xl font-black text-amber-600">${gameScore} pt</div>
            </div>
            <div>
              <div class="text-xs font-bold text-slate-500">正解数</div>
              <div class="text-2xl font-black text-emerald-600">${gameCorrectCount} / ${gameQuestions.length}</div>
            </div>
            <div>
              <div class="text-xs font-bold text-slate-500">最大連勝</div>
              <div class="text-2xl font-black text-indigo-600">${gameMaxCombo} 連勝</div>
            </div>
          </div>

          <!-- 間違えた単語の復習リスト -->
          ${mistakes.length > 0 ? `
            <!-- 間違いノート自動保存通知バナー ＆ 直行ボタン -->
            <div class="p-3.5 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 shadow-2xs text-left">
              <div class="text-xs text-rose-800 dark:text-rose-200 font-bold flex items-center gap-1.5">
                <span class="text-base">🔥</span>
                <span>間違えた <strong>${mistakes.length}</strong> 語を「間違いノート」に自動保存しました</span>
              </div>
              <button type="button" id="btn-goto-mistakes-from-genre" class="w-full sm:w-auto px-4 py-2 bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white font-black rounded-xl text-xs shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer shrink-0">
                <span>間違いノートで特訓</span>
                <span>→</span>
              </button>
            </div>

            <div class="text-left space-y-2 pt-2">
              <h4 class="text-xs font-black text-slate-700 flex items-center gap-1.5">
                <span>📝 要復習単語 (${mistakes.length}語):</span>
              </h4>
              <div class="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                ${mistakes.map(w => `
                  <div class="flex items-center justify-between p-2.5 bg-rose-50/70 border border-rose-200 rounded-xl text-xs">
                    <div>
                      <span class="font-black text-slate-900 font-sans">${w.mongolian}</span>
                      ${(typeof isPronunciationCautionWord === 'function' && isPronunciationCautionWord(w) && w.pronunciation) ? `<span class="text-amber-700 font-bold ml-1.5">⚠️ [${w.pronunciation}]</span>` : ''}
                    </div>
                    <span class="font-bold text-slate-700">${w.japanese}</span>
                  </div>
                `).join('')}
              </div>
            </div>
          ` : `
            <div class="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs font-black text-emerald-800">
              🌟 パーフェクト！このジャンルの単語は完璧です！
            </div>
          `}

          <!-- 出題問題と選択肢の全解説アコーディオンリスト -->
          ${(this.state.gameResults && this.state.gameResults.length > 0) ? `
            <div class="text-left space-y-3 pt-2">
              <h4 class="text-xs font-black text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
                <span>📋</span> 出題問題と選択肢の全解説 (${this.state.gameResults.length}問):
              </h4>
              <div class="space-y-3 max-h-96 overflow-y-auto pr-1">
                ${this.state.gameResults.map((res, qIdx) => {
                  const qWord = res.question;
                  const isMnToJa = res.questionType === 'mn_to_ja';
                  return `
                    <div class="p-3 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2 text-xs shadow-2xs">
                      <div class="flex items-start justify-between gap-2">
                        <div class="space-y-1">
                          <div class="flex items-center gap-2">
                            <span class="px-2 py-0.5 rounded-full text-[10px] font-bold ${res.isCorrect ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300' : 'bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300'}">
                              第${qIdx + 1}問: ${res.isCorrect ? '⭕ 正解' : '❌ 不正解'}
                            </span>
                            <span class="font-black text-slate-900 dark:text-white cyrillic-text text-sm">${qWord.mongolian}</span>
                            ${qWord.pronunciation ? `<span class="text-[11px] text-amber-600 dark:text-amber-400 font-bold">[${qWord.pronunciation}]</span>` : ''}
                          </div>
                          <div class="text-slate-600 dark:text-slate-300 font-bold">
                            意味: <span class="text-emerald-700 dark:text-emerald-400">${qWord.japanese}</span>
                          </div>
                          ${!res.isCorrect && res.selectedChoice ? `
                            <div class="text-rose-600 dark:text-rose-400 font-bold text-[11px]">
                              あなたの回答: <span class="line-through">${isMnToJa ? res.selectedChoice.japanese : res.selectedChoice.mongolian}</span>
                            </div>
                          ` : ''}
                        </div>
                        <button type="button" class="btn-speak-choice-word p-1.5 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-500 hover:text-emerald-700 dark:text-slate-300 cursor-pointer" data-word="${qWord.mongolian}" title="発音を聞く">
                          🔊
                        </button>
                      </div>

                      <!-- 4択の全解説アコーディオン -->
                      ${(typeof renderChoiceExplanationsHTML === 'function' && res.choices && res.choices.length > 0) ? renderChoiceExplanationsHTML(res.choices, {
                        expectedAnswer: isMnToJa ? qWord.japanese : qWord.mongolian,
                        userAnswer: res.selectedChoice ? (isMnToJa ? res.selectedChoice.japanese : res.selectedChoice.mongolian) : ''
                      }) : ''}
                    </div>
                  `;
                }).join('')}
              </div>
            </div>
          ` : ''}

          <!-- アクションボタン -->
          <div class="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button type="button" id="btn-replay-genre-game" class="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-black text-sm shadow-md active:scale-95 transition-all">
              🔄 もう一度挑戦
            </button>
            <button type="button" id="btn-result-to-wordlist" class="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm transition-all">
              📖 単語帳で復習
            </button>
            <button type="button" id="btn-result-to-genres" class="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold text-sm transition-all">
              🏷️ 他のジャンルへ
            </button>
          </div>

        </div>

      </div>
    `;

    this.bindResultEvents();
  }

  static bindResultEvents() {
    this.container.querySelectorAll('.btn-speak-choice-word').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const word = btn.getAttribute('data-word');
        if (word && typeof SpeechService !== 'undefined') {
          SpeechService.speak(word, { rate: 0.9 });
        }
      });
    });
    const replayBtn = this.container.querySelector('#btn-replay-genre-game');
    if (replayBtn) {
      replayBtn.addEventListener('click', () => {
        this.startGenreGame(this.state.activeGenreId);
      });
    }

    const gotoMistakesBtn = this.container.querySelector('#btn-goto-mistakes-from-genre');
    if (gotoMistakesBtn) {
      gotoMistakesBtn.addEventListener('click', () => {
        if (this.onNavigate) {
          if (typeof ReviewNotebookComponent !== 'undefined') {
            ReviewNotebookComponent.state.view = 'list';
            ReviewNotebookComponent.state.filterType = 'all';
          }
          this.onNavigate('review');
        }
      });
    }

    const wordlistBtn = this.container.querySelector('#btn-result-to-wordlist');
    if (wordlistBtn) {
      wordlistBtn.addEventListener('click', () => {
        this.state.view = 'word_list';
        this.renderUI();
      });
    }

    const genresBtn = this.container.querySelector('#btn-result-to-genres');
    if (genresBtn) {
      genresBtn.addEventListener('click', () => {
        this.state.view = 'genre_select';
        this.renderUI();
      });
    }
  }
}

if (typeof window !== 'undefined') {
  window.GenreWordMasterComponent = GenreWordMasterComponent;
}
