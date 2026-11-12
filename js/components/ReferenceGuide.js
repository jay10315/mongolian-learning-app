import { SpeechService } from '../services/speech.js';
import { DeclensionTestComponent } from './DeclensionTest.js';
import { GrammarTestComponent } from './GrammarTest.js';
import { GRAMMAR_MATRIX_ROWS, GRAMMAR_MATRIX_COLS, GRAMMAR_MATRIX_DATA, grammarMatrixQuizzes } from '../data/grammarMatrixData.js';
import { StorageService } from '../services/storage.js';
import { grammarClozeQuizzes, GRAMMAR_CLOZE_CATEGORIES } from '../data/grammarClozeData.js';
import {
  renderClickableWordsHTML,
  showUniversalWordModal,
  findWordInDictionary,
  SoundEffects,
  scrollToQuizTop,
  shuffleArray
} from '../utils/helpers.js';
import { GamificationService } from '../services/gamification.js';
import { PenguinMascot } from './PenguinMascot.js';


export class ReferenceGuideComponent {
  static container = null;
  static onNavigate = null;
  static activeKeyHandler = null;

  static cleanupKeyHandler() {
    if (this.activeKeyHandler) {
      window.removeEventListener('keydown', this.activeKeyHandler);
      this.activeKeyHandler = null;
    }
  }

  static state = {
    view: 'guide', // 'guide' | 'cloze_settings' | 'cloze_testing' | 'cloze_result'
    selectedCategory: 'all',
    targetGrammarNum: null,
    targetGrammarTitle: null,
    questionCount: 10,
    quizzes: [],
    currentIndex: 0,
    currentQuiz: null,
    hasAnswered: false,
    selectedOption: null,
    isCorrect: false,
    combo: 0,
    results: [],
    // 表形式インタラクティブ回答モード State
    tableQuiz: {
      answeringMode: 'choice', // 'choice' (選択式) | 'input' (入力式)
      grammarRange: 'range1',  // 'range1' (1~15) | 'range2' (16~30) | 'range3' (31~48) | 'all' (1~48)
      categoryFilter: 'major', // 'major' | 'all' | 'phonetics' | 'exceptions' | 'syntax' | 'grammar'
      cells: {}, // key: `${grammarNum}_${rowKey}` -> { userAns: '', isCorrect: null, correctVal: '', title: '', rowLabel: '', explanation: '' }
      activeCell: null, // { grammarNum, rowKey }
      hasChecked: false,
      score: 0,
      totalAnswerable: 0,
      correctCount: 0
    },
  };

  // 外部から直接穴埋めモードを開始できるヘルパー
  static startClozeTest(categoryOrNum = 'all', targetTitle = null) {
    this.cleanupKeyHandler();
    if (typeof categoryOrNum === 'number') {
      this.state.targetGrammarNum = categoryOrNum;
      this.state.targetGrammarTitle = targetTitle || `No.${categoryOrNum}`;
      this.state.selectedCategory = 'specific';
    } else {
      this.state.targetGrammarNum = null;
      this.state.targetGrammarTitle = null;
      this.state.selectedCategory = categoryOrNum || 'all';
    }
    this.state.view = 'cloze_settings';
    const activeCont = this.container || document.getElementById('main-content') || document.querySelector('#app-container') || document.body;
    this.render(activeCont, this.onNavigate);
  }

  static render(container, onNavigate) {
    this.container = container;
    this.onNavigate = onNavigate;

    if (this.state.view === 'cloze_settings') {
      this.renderClozeSettings();
    } else if (this.state.view === 'cloze_testing') {
      this.renderClozeTesting();
    } else if (this.state.view === 'cloze_result') {
      this.renderClozeResult();
    } else if (this.state.view === 'table_settings') {
      this.renderTableSettings();
    } else if (this.state.view === 'table_testing') {
      this.renderTableTesting();
    } else if (this.state.view === 'table_result') {
      this.renderTableResult();
    } else {
      this.renderGuide();
    }
  }

  // ==========================================
  // 1. 文法まとめハンドブック（メイン画面）
  // ==========================================
  static renderGuide() {
    this.cleanupKeyHandler();
    const container = this.container || document.getElementById('main-content') || document.querySelector('#app-container') || document.body;
    this.container = container;
    const onNavigate = this.onNavigate;
    if (!container) return;
    const grammarList = StorageService.getGrammar();

    this.container.innerHTML = `

      <div class="animate-fade-in max-w-4xl mx-auto px-4 py-4 space-y-6">
        
        <!-- ヘッダー -->
        <div class="flex items-center justify-between border-b border-slate-200 pb-3">
          <div class="flex items-center gap-2">
            <span class="text-2xl">📖</span>
            <div>
              <h2 class="text-lg font-bold text-slate-800">文法まとめ・全48項目完全解説ハンドブック</h2>
              <p class="text-xs text-slate-500">モンゴル語文法リファレンス（全48文法構造）</p>
            </div>
          </div>
          <button type="button" id="btn-back-home" class="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-all">
            ✕ ホームへ戻る
          </button>
        </div>

        
        <!-- 🌟 文法まとめ穴埋め特訓モード（選択式・全48項目対応） 特設セクション -->
        <div id="grammar-cloze-hero-section" class="bg-gradient-to-br from-emerald-600 via-teal-700 to-sky-800 text-white rounded-2xl p-5 shadow-md space-y-4">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div class="flex items-center gap-3">
              <span class="text-3xl p-2.5 rounded-2xl bg-white/10 backdrop-blur-xs text-white shadow-inner">🎯</span>
              <div>
                <div class="flex items-center gap-2 flex-wrap">
                  <h3 class="text-base sm:text-lg font-black tracking-wide">文法穴埋めテスト（選択式・全48項目）</h3>
                  <span class="text-[11px] bg-amber-400 text-slate-900 px-2.5 py-0.5 rounded-full font-black shadow-xs">
                    新機能・選択式
                  </span>
                </div>
                <p class="text-xs text-emerald-100 font-medium mt-1">
                  全48文法の公式・例文・語尾の使い分けを4択の穴埋めでマスター！毎回答後に詳しい解説・公式付き。
                </p>
              </div>
            </div>
            
            <div class="flex flex-wrap sm:flex-col gap-2 shrink-0">
              <button type="button" id="btn-start-cloze-all" class="px-4 py-2.5 bg-amber-400 hover:bg-amber-300 active:scale-95 text-slate-900 rounded-xl text-xs sm:text-sm font-black shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer">
                <span>🎯</span> 穴埋めテスト（全48項目） →
              </button>
              <button type="button" id="btn-start-table-hero" class="px-4 py-2.5 bg-white/20 hover:bg-white/30 active:scale-95 text-white rounded-xl text-xs sm:text-sm font-black shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer border border-white/25">
                <span>📊</span> 表完成テスト（表形式回答） →
              </button>
            </div>
          </div>

          <!-- カテゴリ別クイックスタートボタン -->
          <div class="flex flex-wrap items-center gap-2 pt-2 border-t border-white/15 text-xs">
            <span class="text-emerald-200 font-bold text-[11px]">範囲別で特訓:</span>
            <button type="button" class="btn-cloze-quick-cat px-3 py-1.5 rounded-lg font-bold bg-white/15 hover:bg-white/25 text-white transition-all cursor-pointer flex items-center gap-1.5" data-cat="basic">
              <span>🟢</span> 基礎文法・格助詞（No.1〜15）
            </button>
            <button type="button" class="btn-cloze-quick-cat px-3 py-1.5 rounded-lg font-bold bg-white/15 hover:bg-white/25 text-white transition-all cursor-pointer flex items-center gap-1.5" data-cat="verb_tense">
              <span>🔵</span> 動詞の時制・活用（No.16〜30）
            </button>
            <button type="button" class="btn-cloze-quick-cat px-3 py-1.5 rounded-lg font-bold bg-white/15 hover:bg-white/25 text-white transition-all cursor-pointer flex items-center gap-1.5" data-cat="advanced">
              <span>🟣</span> 応用構文・複文（No.31〜48）
            </button>
          </div>
        </div>

        <!-- 🌟 隠れн・隠れг＆重要例外マスター完全攻略欄 -->
        <div id="hidden-letters-guide-section" class="bg-gradient-to-br from-indigo-50/80 via-purple-50/40 to-white rounded-2xl p-5 border-2 border-indigo-300 shadow-sm space-y-4">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-indigo-200/80 pb-3">
            <div class="flex items-center gap-3">
              <span class="text-2xl p-2 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white shadow-xs">🏛️</span>
              <div>
                <h3 class="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
                  <span>例外を覚える欄（隠れн・隠れг・落ちる母音）</span>
                  <span class="text-[11px] bg-indigo-600 text-white px-2.5 py-0.5 rounded-full font-bold shadow-2xs">完全攻略</span>
                </h3>
                <p class="text-xs text-indigo-950 font-medium mt-0.5">モンゴル語最難関の「潜在文字の出現」と「母音脱落」を徹底解説。音声再生付き！</p>
              </div>
            </div>
            
            <button type="button" id="btn-ref-start-hidden-test" class="px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl text-xs font-black shadow-xs hover:shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 shrink-0 cursor-pointer">
              <span>⚡</span> 隠れ文字特化テストに挑戦（32問） →
            </button>
          </div>

          <!-- サブタブ切り替え -->
          <div class="flex flex-wrap gap-2 text-xs border-b border-indigo-100 pb-2.5">
            <button type="button" class="btn-ref-subtab px-3.5 py-1.5 rounded-lg font-black transition-all bg-indigo-600 text-white shadow-2xs" data-tab="ref-tab-hidden-n">
              🟢 ① 隠れн (нууц н)
            </button>
            <button type="button" class="btn-ref-subtab px-3.5 py-1.5 rounded-lg font-bold transition-all bg-white border border-slate-200 text-slate-700 hover:bg-indigo-50" data-tab="ref-tab-hidden-g">
              🔵 ② 隠れг (нууц г)
            </button>
            <button type="button" class="btn-ref-subtab px-3.5 py-1.5 rounded-lg font-bold transition-all bg-white border border-slate-200 text-slate-700 hover:bg-indigo-50" data-tab="ref-tab-dropping-vowel">
              🟣 ③ 落ちる母音
            </button>
            <button type="button" class="btn-ref-subtab px-3.5 py-1.5 rounded-lg font-bold transition-all bg-white border border-slate-200 text-slate-700 hover:bg-indigo-50" data-tab="ref-tab-compare">
              ⚠️ ④ ひっかけ対比表
            </button>
            <button type="button" class="btn-ref-subtab px-3.5 py-1.5 rounded-lg font-bold transition-all bg-white border border-slate-200 text-slate-700 hover:bg-indigo-50" data-tab="ref-tab-frequency">
              ⏱️ ⑤ 頻度副詞スケール
            </button>
            <button type="button" class="btn-ref-subtab px-3.5 py-1.5 rounded-lg font-bold transition-all bg-white border border-slate-200 text-slate-700 hover:bg-indigo-50" data-tab="ref-tab-collective">
              🔢 ⑥ 集合数詞・後置詞
            </button>
            <button type="button" class="btn-ref-subtab px-3.5 py-1.5 rounded-lg font-bold transition-all bg-white border border-slate-200 text-slate-700 hover:bg-indigo-50" data-tab="ref-tab-conversation">
              💬 ⑦ 実践会話表現
            </button>
            <button type="button" class="btn-ref-subtab px-3.5 py-1.5 rounded-lg font-bold transition-all bg-white border border-slate-200 text-slate-700 hover:bg-indigo-50" data-tab="ref-tab-modality">
              🎭 ⑧ モダリティ終助詞12選
            </button>
            <button type="button" class="btn-ref-subtab px-3.5 py-1.5 rounded-lg font-bold transition-all bg-white border border-slate-200 text-slate-700 hover:bg-indigo-50" data-tab="ref-tab-volitive">
              🎯 ⑨ 希求形・意思形（-я⁴/-ъя⁴/-ье）
            </button>
            <button type="button" class="btn-ref-subtab px-3.5 py-1.5 rounded-lg font-bold transition-all bg-white border border-slate-200 text-slate-700 hover:bg-indigo-50" data-tab="ref-tab-converb-j-ch">
              ⚡ ⑩ 進行形（-ж/-ч）原則と5大例外
            </button>
            <button type="button" class="btn-ref-subtab px-3.5 py-1.5 rounded-lg font-bold transition-all bg-white border border-slate-200 text-slate-700 hover:bg-indigo-50" data-tab="ref-tab-auxiliary-verbs">
              🤝 ⑪ 補助動詞7大構文
            </button>
            <button type="button" class="btn-ref-subtab px-3.5 py-1.5 rounded-lg font-bold transition-all bg-white border border-slate-200 text-slate-700 hover:bg-indigo-50" data-tab="ref-tab-plural">
              👥 ⑫ 複数形（-ууд²/-нар/-д/-с/-чууд²）
            </button>
            <button type="button" class="btn-ref-subtab px-3.5 py-1.5 rounded-lg font-bold transition-all bg-white border border-slate-200 text-slate-700 hover:bg-indigo-50" data-tab="ref-tab-reflexive">
              🔄 ⑬ 再帰所有（-аа⁴）＆人称関係助詞
            </button>
            <button type="button" class="btn-ref-subtab px-3.5 py-1.5 rounded-lg font-bold transition-all bg-white border border-slate-200 text-slate-700 hover:bg-indigo-50" data-tab="ref-tab-interrogative">
              ❓ ⑭ 疑問詞全格変化マトリクス
            </button>
            <button type="button" class="btn-ref-subtab px-3.5 py-1.5 rounded-lg font-bold transition-all bg-white border border-slate-200 text-slate-700 hover:bg-indigo-50" data-tab="ref-tab-dative-locative">
              🏛️ ⑮ 与位格（-д/-т）接続＆隠れ-н
            </button>
            <button type="button" class="btn-ref-subtab px-3.5 py-1.5 rounded-lg font-bold transition-all bg-white border border-slate-200 text-slate-700 hover:bg-indigo-50" data-tab="ref-tab-time-dative">
              📅 ⑯ 文における月・日の使い方（与位格 -д/-т の要否）
            </button>
            <button type="button" class="btn-ref-subtab px-3.5 py-1.5 rounded-lg font-bold transition-all bg-white border border-slate-200 text-slate-700 hover:bg-indigo-50" data-tab="ref-tab-derivative-suffixes">
              🛠️ ⑰ 道具名詞(-уур) ＆ 使役(-уул/-лга) vs 受動(-гд)
            </button>
          </div>

          <!-- タブ1: 隠れн (нууц н) -->
          <div id="ref-tab-hidden-n" class="ref-subtab-pane space-y-3">
            <div class="bg-indigo-100/60 p-3.5 rounded-xl border border-indigo-200 text-xs text-indigo-950 space-y-2">
              <div class="font-black text-sm flex items-center gap-1.5 text-indigo-900">
                <span>💡</span> 隠れн（нууц н）とは？
              </div>
              <p class="leading-relaxed">
                原形（辞書形）では末尾に「н」が見えませんが、<strong>特定の格助詞（属格・与位格・奪格）が付く時に「н」が突如復活する名詞</strong>のことです。歴史的に語末にあった「н」が原形では脱落し、語尾接続時に再び姿を現します。
              </p>
              
              <!-- 格ごとの出現ルール -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 font-sans">
                <div class="bg-emerald-50 border border-emerald-200 p-2.5 rounded-lg">
                  <div class="font-bold text-emerald-900 flex items-center gap-1">
                    <span>⭕</span> 隠れнが現れる格（重要！）
                  </div>
                  <ul class="list-disc list-inside mt-1 space-y-0.5 text-emerald-800 text-[11px]">
                    <li><strong>属格（〜の）</strong>: -ны / -ний（例：мод → <strong>модны</strong>）</li>
                    <li><strong>与位格（〜に/で）</strong>: -анд/-энд/-онд/-өнд（例：мод → <strong>модонд</strong>）</li>
                    <li><strong>奪格（〜から）</strong>: -наас/-нээс/-ноос/-нөөс（例：мод → <strong>модноос</strong>）</li>
                  </ul>
                </div>
                <div class="bg-rose-50 border border-rose-200 p-2.5 rounded-lg">
                  <div class="font-bold text-rose-900 flex items-center gap-1">
                    <span>❌</span> 隠れнが現れない格（超頻出ひっかけ！）
                  </div>
                  <ul class="list-disc list-inside mt-1 space-y-0.5 text-rose-800 text-[11px]">
                    <li><strong>具格（〜で/手段）</strong>: -аар4（例：мод → <strong>модоор</strong> ◯ / модgоор ✕）</li>
                    <li><strong>共格（〜と/所持）</strong>: -тай3（例：мод → <strong>модтой</strong> ◯ / модонтой ✕）</li>
                    <li><strong>対格（〜を）</strong>: -ыг/-ийг（例：мод → <strong>модыг</strong> ◯）</li>
                  </ul>
                </div>
              </div>
            </div>

            <!-- 隠れн 代表名詞一覧テーブル -->
            
            <!-- 🌟 手書きノート公式①: 語末が長母音・二重母音の名詞の格変化（<г> と <н> の使い分け） -->
            <div class="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-300 p-4 rounded-xl text-xs space-y-2.5 shadow-2xs">
              <div class="font-black text-amber-950 text-sm flex items-center gap-2">
                <span>⚡</span> 【重要法則】長母音・二重母音終わりの名詞：〈г〉と〈н〉の使い分け
              </div>
              <p class="text-slate-700 leading-relaxed">
                長母音や二重母音で終わる名詞に属格（〜の）や対格（〜を）などの格語尾がつく際、間に<strong>「г」を入れるか「н」を入れるか</strong>は対象の意味によって明確に分かれます！
              </p>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                <!-- г が入るグループ -->
                <div class="bg-white/90 p-3 rounded-xl border border-amber-200 space-y-1.5">
                  <div class="font-black text-rose-900 flex items-center justify-between text-xs">
                    <span>👑 「г」が入るグループ</span>
                    <span class="px-2 py-0.5 rounded-full bg-rose-100 text-rose-900 text-[10px]">人・親族・固有名詞</span>
                  </div>
                  <ul class="space-y-1 text-slate-700 text-[11px] list-disc list-inside">
                    <li><strong>дүү</strong>（弟・妹）→ дүү<strong>г</strong>ийн（弟の）</li>
                    <li><strong>хүү</strong>（息子・男の子）→ хүү<strong>г</strong>ийн（息子の）</li>
                    <li><strong>Токио</strong>（東京・固有名詞）→ Токио<strong>г</strong>ийн（東京の）</li>
                    <li><strong>өвөө</strong>（祖父）→ өвөө<strong>г</strong>өөс（祖父から）</li>
                  </ul>
                  <div class="text-[10px] text-rose-800 bg-rose-50 p-1.5 rounded-lg font-bold">
                    💡 人名・親族名・国名・都市名などの「人・固有名詞」には〈г〉が接続！
                  </div>
                </div>
                <!-- н が入るグループ -->
                <div class="bg-white/90 p-3 rounded-xl border border-amber-200 space-y-1.5">
                  <div class="font-black text-emerald-900 flex items-center justify-between text-xs">
                    <span>📦 「н」が入るグループ</span>
                    <span class="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 text-[10px]">物・場所・抽象概念</span>
                  </div>
                  <ul class="space-y-1 text-slate-700 text-[11px] list-disc list-inside">
                    <li><strong>ширээ</strong>（机・物）→ ширээ<strong>н</strong>ий（机の）</li>
                    <li><strong>хөдөө</strong>（田舎・場所）→ хөдөө<strong>н</strong>ий（田舎の）</li>
                    <li><strong>санаа</strong>（考え・概念）→ санаа<strong>н</strong>ы（考えの）</li>
                    <li><strong>өрөө</strong>（部屋・場所）→ өрөө<strong>н</strong>өөс（部屋から）</li>
                  </ul>
                  <div class="text-[10px] text-emerald-800 bg-emerald-50 p-1.5 rounded-lg font-bold">
                    💡 「物・場所・抽象概念」の長母音終わりは隠れ〈н〉が接続！
                  </div>
                </div>
              </div>
            </div>

            <!-- 🌟 手書きノート公式②: 「隠れ н（不安定な н / тогтворгүй н）」を持つ古モンゴル語由来の名詞 3大分類 -->
            <div class="bg-white border border-indigo-200 p-4 rounded-xl text-xs space-y-2.5 shadow-2xs">
              <div class="font-black text-indigo-950 text-sm flex items-center gap-2">
                <span>📜</span> 【古モンゴル語由来】隠れ н（不安定な н）を持つ名詞の3大カテゴリー
              </div>
              <p class="text-slate-700 leading-relaxed">
                辞書形（主格）では「н」が見えないものの、格語尾がつく時や修飾語として前に置かれるときに「н」が現れる名詞は、モンゴル語の歴史上、以下の<strong>3大カテゴリー</strong>に集中しています。
              </p>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-2.5 pt-1">
                <div class="p-2.5 rounded-xl bg-sky-50 border border-sky-200 space-y-1">
                  <div class="font-black text-sky-950 flex items-center gap-1 text-[11px]">
                    <span>🌊</span> 自然・物質に関する語
                  </div>
                  <ul class="text-[11px] text-slate-700 space-y-0.5">
                    <li>・<strong>ус</strong>（水）→ ус<strong>н</strong>ы / ус<strong>н</strong>аас</li>
                    <li>・<strong>мод</strong>（木・森）→ мод<strong>н</strong>ы / мод<strong>н</strong>оос</li>
                    <li>・<strong>нар</strong>（太陽）→ нар<strong>н</strong>ы</li>
                    <li>・<strong>цас</strong>（雪）→ цас<strong>н</strong>ы</li>
                    <li>・<strong>чулуу</strong>（石）→ чулуу<strong>н</strong>ы</li>
                  </ul>
                </div>
                <div class="p-2.5 rounded-xl bg-purple-50 border border-purple-200 space-y-1">
                  <div class="font-black text-purple-950 flex items-center gap-1 text-[11px]">
                    <span>👁️</span> 身体の部位に関する語
                  </div>
                  <ul class="text-[11px] text-slate-700 space-y-0.5">
                    <li>・<strong>нүд</strong>（目）→ нүд<strong>н</strong>ий / нүд<strong>н</strong>ээс</li>
                    <li>・<strong>чих</strong>（耳）→ чих<strong>н</strong>ий</li>
                    <li>・<strong>шүд</strong>（歯）→ шүд<strong>н</strong>ий</li>
                    <li>・<strong>гар</strong>（手）→ гар<strong>н</strong>ы（※文脈）</li>
                  </ul>
                </div>
                <div class="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 space-y-1">
                  <div class="font-black text-emerald-950 flex items-center gap-1 text-[11px]">
                    <span>👕</span> 身の回り・生活道具
                  </div>
                  <ul class="text-[11px] text-slate-700 space-y-0.5">
                    <li>・<strong>хувцас</strong>（服）→ хувцас<strong>н</strong>ы / хувцас<strong>н</strong>аас</li>
                    <li>・<strong>гэр</strong>（家・ゲル）→ гэр<strong>н</strong>ий（複合語等）</li>
                    <li>・<strong>утас</strong>（糸・電話）→ утас<strong>н</strong>ы</li>
                  </ul>
                </div>
              </div>
            </div>

            <div class="overflow-x-auto border border-indigo-200 rounded-xl bg-white shadow-2xs">
              <table class="w-full text-xs text-left">
                <thead class="bg-indigo-50/80 text-indigo-950 font-bold border-b border-indigo-200">
                  <tr>
                    <th class="p-2.5">原形（主格）</th>
                    <th class="p-2.5">意味</th>
                    <th class="p-2.5 text-emerald-800">属格 (-ны/-ний)</th>
                    <th class="p-2.5 text-emerald-800">与位格 (-нд)</th>
                    <th class="p-2.5 text-emerald-800">奪格 (-наас)</th>
                    <th class="p-2.5 text-rose-800">具格（н非出現!）</th>
                    <th class="p-2.5">頻出表現・熟語</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100 text-slate-700">
                  ${[
                    { w: "мод", m: "木・林", gen: "модны", dat: "модонд", abl: "модноос", ins: "модоор", ex: "модны навч (木の葉)" },
                    { w: "ус", m: "水", gen: "усны", dat: "усанд", abl: "уснаас", ins: "усаар", ex: "усны сав (水筒), усанд сэлэх (水泳)" },
                    { w: "нар", m: "太陽・日", gen: "нарны", dat: "наранд", abl: "наcapture".replace("capture", "рнаас"), ins: "нараар", ex: "нарны шил (サングラス)" },
                    { w: "сар", m: "月", gen: "сарны", dat: "саранд", abl: "сарнаас", ins: "сараар", ex: "сарны гэрэл (月光)" },
                    { w: "гар", m: "手", gen: "гарны", dat: "гаранд", abl: "гарнаас", ins: "гараар", ex: "гарны үсэг (署名), гараар (手作業で)" },
                    { w: "хөл", m: "足・脚", gen: "хөлний", dat: "хөлөнд", abl: "хөлнөөс", ins: "хөлөөр", ex: "хөлний өвчин (足の痛み)" },
                    { w: "нүд", m: "目", gen: "нүдний", dat: "нүдэнд", abl: "нүднээс", ins: "нүдээр", ex: "нүдний шил (メガネ)" },
                    { w: "шүд", m: "歯", gen: "шүдний", dat: "шүдэнд", abl: "шүднээс", ins: "шүдээр", ex: "шүдний оо (歯磨き粉)" },
                    { w: "хэл", m: "言語・舌", gen: "хэлний", dat: "хэлэнд", abl: "хэлнээс", ins: "хэлээр", ex: "хэлний дүрэм (文法)" },
                    { w: "нэр", m: "名前", gen: "нэрний", dat: "нэрэнд", abl: "нэрнээс", ins: "нэрээр", ex: "нэрний хуудас (名刺)" },
                    { w: "цонх", m: "窓", gen: "цонхны", dat: "цонхонд", abl: "цонхноос", ins: "цонхоор", ex: "цонхны хөшиг (カーテン)" },
                    { w: "өвс", m: "草", gen: "өвсний", dat: "өвсөнд", abl: "өвснөөс", ins: "өвсөөр", ex: "өвсний үнэр (草の匂い)" },
                    { w: "гал", m: "火", gen: "галны", dat: "галанд", abl: "галнаас", ins: "галаар", ex: "галны машин (消防車)" },
                    { w: "мах", m: "肉", gen: "махны", dat: "маханд", abl: "махнаас", ins: "махаар", ex: "махны дэлгүүр (精肉店)" },
                    { w: "сүү", m: "牛乳", gen: "сүүний", dat: "сүүнд", abl: "сүүнээс", ins: "сүүгээр", ex: "сүүний цай (ミルクティー) ※長母音例外" },
                    { w: "толгой", m: "頭", gen: "толгойны", dat: "толгойнд", abl: "толгойноос", ins: "толгойгоор", ex: "толгойны өвчин (頭痛)" },
                    { w: "хашаа", m: "柵・庭", gen: "хашааны", dat: "хашаанд", abl: "хашаанаас", ins: "хашаагаар", ex: "хашаанд суух (庭にいる)" },
                    { w: "хуруу", m: "指", gen: "хурууны", dat: "хуруунд", abl: "хуруунаас", ins: "хуруугаар", ex: "хурууны хээ (指紋)" }
                  ].map((row, i) => `
                    <tr class="${i % 2 === 1 ? 'bg-indigo-50/20' : ''} hover:bg-indigo-50/50 transition-colors">
                      <td class="p-2.5 cyrillic-text font-bold text-slate-900">
                        <button type="button" class="btn-ref-speak text-indigo-600 hover:text-indigo-800 mr-1" data-text="${row.w}" title="発音を聞く">🔊</button>
                        ${row.w}
                      </td>
                      <td class="p-2.5 font-medium text-slate-600">${row.m}</td>
                      <td class="p-2.5 cyrillic-text font-bold text-emerald-800">
                        <button type="button" class="btn-ref-speak text-emerald-600 hover:text-emerald-800 mr-0.5" data-text="${row.gen}">🔊</button>
                        ${row.gen}
                      </td>
                      <td class="p-2.5 cyrillic-text font-semibold text-emerald-700">${row.dat}</td>
                      <td class="p-2.5 cyrillic-text font-semibold text-emerald-700">${row.abl}</td>
                      <td class="p-2.5 cyrillic-text font-bold text-rose-700 bg-rose-50/40">${row.ins}</td>
                      <td class="p-2.5 text-[11px] text-slate-500">${row.ex}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>

          <!-- タブ2: 隠れг (нууц г) -->
          <div id="ref-tab-hidden-g" class="ref-subtab-pane hidden space-y-3">

            <!-- 🌟 手書きノート公式: 語末の「н」と「隠れг（гの出現）」の法則 -->
            <div class="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-300 p-4 rounded-xl text-xs space-y-2.5 shadow-2xs">
              <div class="font-black text-blue-950 text-sm flex items-center gap-2">
                <span>👅</span> 【調音点と音韻法則】語末の「н」と「隠れг」の出現ルール
              </div>
              <p class="text-slate-700 leading-relaxed">
                モンゴル語の語末「н」には2種類の発音（歯茎鼻音 n vs 軟口蓋鼻音 ng）があり、<strong>どちらの音かによって属格変化した時に「г」が現れるかどうか</strong>が決まります！
              </p>
              <div class="overflow-x-auto border border-blue-200 rounded-xl bg-white">
                <table class="w-full text-xs text-left">
                  <thead class="bg-blue-100/70 text-blue-950 font-black border-b border-blue-200">
                    <tr>
                      <th class="p-2.5">種類</th>
                      <th class="p-2.5">発音の特徴（調音点）</th>
                      <th class="p-2.5 text-center">格変化時の「г」出現</th>
                      <th class="p-2.5">具体例</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-blue-100 text-slate-800">
                    <tr class="bg-white">
                      <td class="p-2.5 font-black text-slate-900">歯茎鼻音<br><span class="text-3xs text-slate-500 font-normal">（通常の n）</span></td>
                      <td class="p-2.5">舌先が上の前歯の裏につく明確な「ン」</td>
                      <td class="p-2.5 text-center font-black text-rose-600 bg-rose-50/50">❌ 現れない<br><span class="text-3xs text-slate-500 font-normal">（-ы / -ий がつく）</span></td>
                      <td class="p-2.5 font-bold font-mono">
                        ・<strong>он</strong>（年）→ он<strong>ы</strong>（年の）<br>
                        ・<strong>хүн</strong>（人）→ хүн<strong>ий</strong>（人の）
                      </td>
                    </tr>
                    <tr class="bg-blue-50/40">
                      <td class="p-2.5 font-black text-indigo-950">軟口蓋鼻音<br><span class="text-3xs text-indigo-600 font-normal">（ng [ŋ]）</span></td>
                      <td class="p-2.5">舌の奥が持ち上がり、口の奥で「ング」と響かせる鼻音</td>
                      <td class="p-2.5 text-center font-black text-emerald-700 bg-emerald-50/60">⭕ 現れる！<br><span class="text-3xs text-emerald-800 font-bold">（-гийн が出現）</span></td>
                      <td class="p-2.5 font-bold font-mono text-indigo-950">
                        ・<strong>сан</strong>（基金・庫）→ сан<strong>гийн</strong><br>
                        ・<strong>байшин</strong>（建物）→ байшин<strong>гийн</strong>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div class="bg-sky-50 p-3.5 rounded-xl border border-sky-200 text-xs text-sky-950 space-y-2">
              <div class="font-black text-sm flex items-center gap-1.5 text-sky-900">
                <span>💡</span> 隠れг（нууц г）の出現パターン
              </div>
              <p class="leading-relaxed">
                隠れг は主に<strong>「長母音・二重母音末尾名詞」</strong>や<strong>「子音н末尾名詞」</strong>の属格・奪格や、動詞接尾辞の接続時に出現します。
              </p>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div class="p-3.5 rounded-xl border border-sky-200 bg-white space-y-2">
                <div class="font-black text-sky-900 flex items-center gap-1.5">
                  <span>1️⃣</span> 長母音・二重母音終わりの名詞
                </div>
                <p class="text-slate-600 text-[11px]">
                  属格で単なる「-н」ではなく、<strong>「-гийн / -гийн」</strong>が付きます。
                </p>
                <div class="bg-slate-50 p-2 rounded-lg space-y-1 font-mono text-[11px]">
                  <div>・хүү（息子） → <strong class="text-sky-700">хүүгийн</strong>（息子の）</div>
                  <div>・дүү（弟・妹） → <strong class="text-sky-700">дүүгийн</strong>（弟・妹の）</div>
                  <div>・зураа（線） → <strong class="text-sky-700">зураагийн</strong></div>
                </div>
              </div>

              <div class="p-3.5 rounded-xl border border-sky-200 bg-white space-y-2">
                <div class="font-black text-sky-900 flex items-center gap-1.5">
                  <span>2️⃣</span> 子音「н」終わりの名詞の属格
                </div>
                <p class="text-slate-600 text-[11px]">
                  子音 н で終わる語には、属格で<strong>「-гийн / -гийн」</strong>が接続します。
                </p>
                <div class="bg-slate-50 p-2 rounded-lg space-y-1 font-mono text-[11px]">
                  <div>・байшин（建物） → <strong class="text-sky-700">байшингийн</strong>（建物の）</div>
                  <div>・номын сан（図書館） → <strong class="text-sky-700">номын сангийн</strong></div>
                  <div>・奪格: номын сан → <strong class="text-sky-700">номын сангаас</strong>（図書館から）</div>
                </div>
              </div>
            </div>
          </div>

          <!-- タブ3: 落ちる母音 (гээгдэх эгшиг) -->
          <div id="ref-tab-dropping-vowel" class="ref-subtab-pane hidden space-y-3">
            <div class="bg-purple-50 p-3.5 rounded-xl border border-purple-200 text-xs text-purple-950 space-y-2">
              <div class="font-black text-sm flex items-center gap-1.5 text-purple-900">
                <span>💡</span> 落ちる母音（гээгдэх эгшиг）とは？
              </div>
              <p class="leading-relaxed">
                単語の<strong>第2音節にある短母音（а, э, о, ө, у, ү, и）</strong>に、母音から始まる格助詞や接尾辞（-ын, -ийн, -аас など）が付いたとき、その母音が<strong>脱落（消去）</strong>する現象です。隠れнと混同しないよう要注意！
              </p>
            </div>

            <div class="overflow-x-auto border border-purple-200 rounded-xl bg-white">
              <table class="w-full text-xs text-left">
                <thead class="bg-purple-50 text-purple-950 font-bold border-b border-purple-200">
                  <tr>
                    <th class="p-2.5">原形</th>
                    <th class="p-2.5">意味</th>
                    <th class="p-2.5 text-purple-800">属格（母音脱落）</th>
                    <th class="p-2.5">脱落する母音</th>
                    <th class="p-2.5">解説</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100 text-slate-700">
                  ${[
                    { w: "өдөр", m: "日・昼", gen: "өдрийн", drop: "2番目の ө", note: "өдөрний ではない！隠れнなし" },
                    { w: "газар", m: "土地・場所", gen: "газрын", drop: "2番目の а", note: "газарны ではない！隠れнなし" },
                    { w: "нөхөр", m: "友人・夫", gen: "нөхрийн", drop: "2番目の ө", note: "нөхөрийн ではなく ө が脱落" },
                    { w: "булан", m: "角・コーナー", gen: "булангийн", drop: "（н終わり名詞）", note: "-гийн が付く" },
                    { w: "багш", m: "先生", gen: "багшийн", drop: "男性語だが ш 終わり", note: "-ийн が接続" }
                  ].map((row, i) => `
                    <tr class="${i % 2 === 1 ? 'bg-purple-50/20' : ''}">
                      <td class="p-2.5 cyrillic-text font-bold text-slate-900">${row.w}</td>
                      <td class="p-2.5">${row.m}</td>
                      <td class="p-2.5 cyrillic-text font-bold text-purple-800">${row.gen}</td>
                      <td class="p-2.5 text-rose-600 font-semibold">${row.drop}</td>
                      <td class="p-2.5 text-slate-500">${row.note}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>

          <!-- タブ4: ひっかけ対比表 -->
          <div id="ref-tab-compare" class="ref-subtab-pane hidden space-y-3">
            <div class="bg-amber-50 p-3.5 rounded-xl border border-amber-200 text-xs text-amber-950">
              <div class="font-black text-sm flex items-center gap-1.5 text-amber-900 mb-1">
                <span>⚠️</span> 似ているのにルールが違う！最重要対比ペア
              </div>
              <p>テストで最も狙われる「隠れнを持つ名詞」と「持たない名詞」の対比表です。</p>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div class="p-3.5 rounded-xl border-2 border-emerald-300 bg-emerald-50/30 space-y-2">
                <div class="font-bold text-emerald-900 flex items-center justify-between">
                  <span>🌿 мод（木）: 隠れнあり！</span>
                  <span class="text-[10px] bg-emerald-600 text-white px-2 py-0.5 rounded-full font-bold">隠れн</span>
                </div>
                <div class="space-y-1 text-slate-700">
                  <div>属格: <strong class="text-emerald-800 cyrillic-text">модны</strong>（木の）</div>
                  <div>与位格: <strong class="text-emerald-800 cyrillic-text">модонд</strong>（木に）</div>
                  <div>具格: <strong class="text-rose-700 cyrillic-text">модоор</strong>（具格はн出ない!）</div>
                </div>
              </div>

              <div class="p-3.5 rounded-xl border-2 border-slate-300 bg-slate-50 space-y-2">
                <div class="font-bold text-slate-900 flex items-center justify-between">
                  <span>☀️ өдөр（日）: 隠れнなし！</span>
                  <span class="text-[10px] bg-slate-600 text-white px-2 py-0.5 rounded-full font-bold">落ちる母音</span>
                </div>
                <div class="space-y-1 text-slate-700">
                  <div>属格: <strong class="text-indigo-800 cyrillic-text">өдрийн</strong>（日の）</div>
                  <div>与位格: <strong class="text-indigo-800 cyrillic-text">өдөрт</strong>（日に/昼に）</div>
                  <div>具格: <strong class="text-indigo-800 cyrillic-text">өдрөөр</strong></div>
                </div>
              </div>

              <div class="p-3.5 rounded-xl border-2 border-emerald-300 bg-emerald-50/30 space-y-2">
                <div class="font-bold text-emerald-900 flex items-center justify-between">
                  <span>💧 ус（水）: 隠れнあり！</span>
                  <span class="text-[10px] bg-emerald-600 text-white px-2 py-0.5 rounded-full font-bold">隠れн</span>
                </div>
                <div class="space-y-1 text-slate-700">
                  <div>属格: <strong class="text-emerald-800 cyrillic-text">усны</strong>（水の）</div>
                  <div>与位格: <strong class="text-emerald-800 cyrillic-text">усанд</strong>（水に）</div>
                  <div>奪格: <strong class="text-emerald-800 cyrillic-text">уснаас</strong>（水から）</div>
                </div>
              </div>

              <div class="p-3.5 rounded-xl border-2 border-slate-300 bg-slate-50 space-y-2">
                <div class="font-bold text-slate-900 flex items-center justify-between">
                  <span>🛣️ зам（道）: 隠れнなし！</span>
                  <span class="text-[10px] bg-slate-600 text-white px-2 py-0.5 rounded-full font-bold">通常変化</span>
                </div>
                <div class="space-y-1 text-slate-700">
                  <div>属格: <strong class="text-indigo-800 cyrillic-text">замын</strong>（道の）</div>
                  <div>与位格: <strong class="text-indigo-800 cyrillic-text">замд</strong>（道で）</div>
                  <div>奪格: <strong class="text-indigo-800 cyrillic-text">замаас</strong>（道から）</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 1. 格助詞の全まとめ表（PDF p.68付録準拠） -->
        <div class="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
          <div class="flex items-center gap-2">
            <span class="text-lg">🏛</span>
            <h3 class="text-sm font-bold text-slate-800">格助詞の全まとめ（7格＋方向格）</h3>
          </div>

          <div class="overflow-x-auto border border-slate-200 rounded-xl">
            <table class="w-full text-xs text-left">
              <thead class="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                <tr>
                  <th class="p-2.5">格</th>
                  <th class="p-2.5">日本語の助詞</th>
                  <th class="p-2.5">語尾・助詞</th>
                  <th class="p-2.5">主な用法</th>
                  <th class="p-2.5">疑問詞</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 text-slate-700">
                <tr>
                  <td class="p-2.5 font-bold text-emerald-800">主格</td>
                  <td class="p-2.5">〜は、〜が</td>
                  <td class="p-2.5">なし（基本形）</td>
                  <td class="p-2.5">主語・基本形</td>
                  <td class="p-2.5 cyrillic-text font-bold">хэн, юу</td>
                </tr>
                <tr class="bg-slate-50/50">
                  <td class="p-2.5 font-bold text-emerald-800">属格</td>
                  <td class="p-2.5">〜の（所属・所有）</td>
                  <td class="p-2.5 cyrillic-text font-semibold">-ын, -ийн, -ы, -ий, -н</td>
                  <td class="p-2.5">所属・所有（〜の）</td>
                  <td class="p-2.5 cyrillic-text font-bold">хэний, юуны</td>
                </tr>
                <tr>
                  <td class="p-2.5 font-bold text-emerald-800">対格</td>
                  <td class="p-2.5">〜を（目的語）</td>
                  <td class="p-2.5 cyrillic-text font-semibold">-ыг, -ийг, -г</td>
                  <td class="p-2.5">直接目的語（〜を）</td>
                  <td class="p-2.5 cyrillic-text font-bold">хэнийг, юуг</td>
                </tr>
                <tr class="bg-slate-50/50">
                  <td class="p-2.5 font-bold text-emerald-800">与位格</td>
                  <td class="p-2.5">〜に、〜で（場所・相手）</td>
                  <td class="p-2.5 cyrillic-text font-semibold">-д, -т</td>
                  <td class="p-2.5">相手・場所・時間（〜に・で）</td>
                  <td class="p-2.5 cyrillic-text font-bold">хэнд, юунд, хаана</td>
                </tr>
                <tr>
                  <td class="p-2.5 font-bold text-emerald-800">奪格</td>
                  <td class="p-2.5">〜から、〜より（起点・比較）</td>
                  <td class="p-2.5 cyrillic-text font-semibold">-аас, -ээс, -оос, -өөс</td>
                  <td class="p-2.5">起点・比較・材料（〜から）</td>
                  <td class="p-2.5 cyrillic-text font-bold">хэнээс, хаанаас</td>
                </tr>
                <tr class="bg-slate-50/50">
                  <td class="p-2.5 font-bold text-emerald-800">造格（具格）</td>
                  <td class="p-2.5">〜で（手段・道具）、〜として</td>
                  <td class="p-2.5 cyrillic-text font-semibold">-аар, -ээр, -оор, -өөр</td>
                  <td class="p-2.5">手段・道具・言語（〜で）</td>
                  <td class="p-2.5 cyrillic-text font-bold">хэнээр, юугаар</td>
                </tr>
                <tr>
                  <td class="p-2.5 font-bold text-emerald-800">共同格</td>
                  <td class="p-2.5">〜と、〜を持つ</td>
                  <td class="p-2.5 cyrillic-text font-semibold">-тай, -тэй, -той</td>
                  <td class="p-2.5">随伴・所持（〜と・を持つ）</td>
                  <td class="p-2.5 cyrillic-text font-bold">хэнтэй, юутай</td>
                </tr>
                <tr class="bg-slate-50/50">
                  <td class="p-2.5 font-bold text-emerald-800">方向格</td>
                  <td class="p-2.5">〜へ（方向）</td>
                  <td class="p-2.5 cyrillic-text font-semibold">руу, рүү, луу, лүү（分離）</td>
                  <td class="p-2.5">到達点・方向（〜へ・に向かって）</td>
                  <td class="p-2.5 cyrillic-text font-bold">хаашаа, хэн рүү</td>
                </tr>
              </tbody>
            </table>
                    <!-- タブ5: 頻度副詞体系（7段階頻度スケール） -->
          <div id="ref-tab-frequency" class="ref-subtab-pane hidden space-y-3">
            <div class="bg-amber-50/80 p-3.5 rounded-xl border border-amber-200 text-xs text-amber-950 space-y-2">
              <div class="font-black text-sm flex items-center gap-1.5 text-amber-900">
                <span>⏱️</span> モンゴル語の頻度表現（頻度順完全ガイド）
              </div>
              <p class="leading-relaxed">
                日常会話や試験で頻出する「どれくらいの頻度で行うか」を表す副詞です。毎日100%の「байнга」から、数ヶ月に1回の「ховор」まで、頻度スケール順に整理しました。
              </p>
            </div>

            <div class="overflow-x-auto border border-amber-200 rounded-xl bg-white shadow-2xs">
              <table class="w-full text-xs text-left">
                <thead class="bg-amber-100/70 text-amber-950 font-bold border-b border-amber-200">
                  <tr>
                    <th class="p-2.5">頻度副詞</th>
                    <th class="p-2.5">日本語の意味</th>
                    <th class="p-2.5">頻度の目安</th>
                    <th class="p-2.5">用例</th>
                    <th class="p-2.5 text-center">音声</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-amber-100 font-sans">
                  <tr class="hover:bg-amber-50/50">
                    <td class="p-2.5 font-black text-slate-900 cyrillic-text">байнга</td>
                    <td class="p-2.5 font-bold text-amber-900">常に、毎日（100%）</td>
                    <td class="p-2.5 text-slate-600">毎日（週7日）</td>
                    <td class="p-2.5 text-slate-700">Би байнга цай уудаг.（私は常に/毎日お茶を飲みます）</td>
                    <td class="p-2.5 text-center"><button type="button" class="btn-ref-speak px-2 py-0.5 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded text-xs font-bold" data-word="байнга">🔊</button></td>
                  </tr>
                  <tr class="hover:bg-amber-50/50">
                    <td class="p-2.5 font-black text-slate-900 cyrillic-text">дандаа</td>
                    <td class="p-2.5 font-bold text-amber-900">いつも、毎回</td>
                    <td class="p-2.5 text-slate-600">行動のたびにいつも</td>
                    <td class="p-2.5 text-slate-700">Тэр дандаа инээмсэглэдэг.（彼はいつも笑顔です）</td>
                    <td class="p-2.5 text-center"><button type="button" class="btn-ref-speak px-2 py-0.5 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded text-xs font-bold" data-word="дандаа">🔊</button></td>
                  </tr>
                  <tr class="hover:bg-amber-50/50">
                    <td class="p-2.5 font-black text-slate-900 cyrillic-text">ихэвчлэн</td>
                    <td class="p-2.5 font-bold text-amber-900">たいてい、普段は</td>
                    <td class="p-2.5 text-slate-600">週5〜6日程度</td>
                    <td class="p-2.5 text-slate-700">Би ихэвчлэн 7 цагт босдог.（普段はたいてい7時に起きます）</td>
                    <td class="p-2.5 text-center"><button type="button" class="btn-ref-speak px-2 py-0.5 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded text-xs font-bold" data-word="ихэвчлэн">🔊</button></td>
                  </tr>
                  <tr class="hover:bg-amber-50/50">
                    <td class="p-2.5 font-black text-slate-900 cyrillic-text">ихэнхдээ</td>
                    <td class="p-2.5 font-bold text-amber-900">大半は、大部分は</td>
                    <td class="p-2.5 text-slate-600">週4〜6日（確率・全体として）</td>
                    <td class="p-2.5 text-slate-700">Амралтын өдрөөр ихэнхдээ гэртээ амардаг.（休日は大半家で休みます）</td>
                    <td class="p-2.5 text-center"><button type="button" class="btn-ref-speak px-2 py-0.5 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded text-xs font-bold" data-word="ихэнхдээ">🔊</button></td>
                  </tr>
                  <tr class="hover:bg-amber-50/50">
                    <td class="p-2.5 font-black text-slate-900 cyrillic-text">заримдаа</td>
                    <td class="p-2.5 font-bold text-amber-900">時々</td>
                    <td class="p-2.5 text-slate-600">週2〜3日</td>
                    <td class="p-2.5 text-slate-700">Би заримдаа ресторанд хооллодог.（時々レストランで食事します）</td>
                    <td class="p-2.5 text-center"><button type="button" class="btn-ref-speak px-2 py-0.5 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded text-xs font-bold" data-word="заримдаа">🔊</button></td>
                  </tr>
                  <tr class="hover:bg-amber-50/50">
                    <td class="p-2.5 font-black text-slate-900 cyrillic-text">хааяа</td>
                    <td class="p-2.5 font-bold text-amber-900">たまに</td>
                    <td class="p-2.5 text-slate-600">週1日程度</td>
                    <td class="p-2.5 text-slate-700">Хааяа кино үздэг.（たまに映画を見ます）</td>
                    <td class="p-2.5 text-center"><button type="button" class="btn-ref-speak px-2 py-0.5 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded text-xs font-bold" data-word="хааяа">🔊</button></td>
                  </tr>
                  <tr class="hover:bg-amber-50/50">
                    <td class="p-2.5 font-black text-slate-900 cyrillic-text">хааяахан</td>
                    <td class="p-2.5 font-bold text-amber-900">ごくたまに</td>
                    <td class="p-2.5 text-slate-600">数週間に1回</td>
                    <td class="p-2.5 text-slate-700">Түүнтэй хааяахан тааралддаг.（彼とはごくたまに出くわします）</td>
                    <td class="p-2.5 text-center"><button type="button" class="btn-ref-speak px-2 py-0.5 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded text-xs font-bold" data-word="хааяахан">🔊</button></td>
                  </tr>
                  <tr class="hover:bg-amber-50/50">
                    <td class="p-2.5 font-black text-slate-900 cyrillic-text">ховор</td>
                    <td class="p-2.5 font-bold text-amber-900">めったにない、稀な</td>
                    <td class="p-2.5 text-slate-600">数ヶ月に1回（滅多に〜ない）</td>
                    <td class="p-2.5 text-slate-700">Би чихэрлэг зүйл ховор иддэг.（私は甘いものをめったに食べません）</td>
                    <td class="p-2.5 text-center"><button type="button" class="btn-ref-speak px-2 py-0.5 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded text-xs font-bold" data-word="ховор">🔊</button></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- タブ6: 集合数詞 ＆ 位置・時間後置詞 -->
          <div id="ref-tab-collective" class="ref-subtab-pane hidden space-y-3">
            
            <!-- 指示詞・場所・時間マスター特訓へのリンクボタン -->
            <div class="bg-gradient-to-r from-sky-600 to-indigo-600 text-white p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
              <div>
                <div class="font-black text-sm flex items-center gap-1.5">
                  <span>🧭</span> イラスト特化！指示詞・場所・時間マスター特訓
                </div>
                <p class="text-xs text-sky-100 mt-0.5">
                  上・下・中・前・後・間などの後置詞と指示代名詞を、かわいいイラスト図解と4択クイズで特訓！
                </p>
              </div>
              <button type="button" id="btn-ref-start-spatial-master" class="px-4 py-2 bg-white text-indigo-700 hover:bg-indigo-50 font-black rounded-lg text-xs shadow-xs transition-all whitespace-nowrap cursor-pointer">
                イラスト特訓を開始する →
              </button>
            </div>

            <div class="bg-sky-50/80 p-3.5 rounded-xl border border-sky-200 text-xs text-sky-950 space-y-2">
              <div class="font-black text-sm flex items-center gap-1.5 text-sky-900">
                <span>🔢</span> 集合数詞（〜人で）＆ 位置・方向・時間後置詞
              </div>
              <p class="leading-relaxed">
                人数を表す集合数詞（語尾: <strong>-уулаа / -үүлээ</strong>）と、日常会話に欠かせない空間・時間後置詞の体系です。
              </p>
            </div>

            <!-- 集合数詞カード -->
            <div class="bg-white p-3.5 rounded-xl border border-sky-200 space-y-2">
              <div class="font-bold text-sky-900 text-xs flex items-center gap-1">
                <span>👥</span> 集合数詞一覧（〜人で、全員で）
              </div>
              <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <div class="p-2 rounded-lg bg-sky-50 border border-sky-100">
                  <div class="font-black text-slate-900 cyrillic-text">хоёулаа</div>
                  <div class="text-[11px] text-sky-800">2人で（私たち2人）</div>
                </div>
                <div class="p-2 rounded-lg bg-sky-50 border border-sky-100">
                  <div class="font-black text-slate-900 cyrillic-text">гурвуулаа</div>
                  <div class="text-[11px] text-sky-800">3人で</div>
                </div>
                <div class="p-2 rounded-lg bg-sky-50 border border-sky-100">
                  <div class="font-black text-slate-900 cyrillic-text">дөрвүүлээ</div>
                  <div class="text-[11px] text-sky-800">4人で</div>
                </div>
                <div class="p-2 rounded-lg bg-sky-50 border border-sky-100">
                  <div class="font-black text-slate-900 cyrillic-text">тавуулаа</div>
                  <div class="text-[11px] text-sky-800">5人で</div>
                </div>
                <div class="p-2 rounded-lg bg-sky-50 border border-sky-100">
                  <div class="font-black text-slate-900 cyrillic-text">зургуулаа</div>
                  <div class="text-[11px] text-sky-800">6人で</div>
                </div>
                <div class="p-2 rounded-lg bg-sky-50 border border-sky-100">
                  <div class="font-black text-slate-900 cyrillic-text">долуулаа</div>
                  <div class="text-[11px] text-sky-800">7人で</div>
                </div>
                <div class="p-2 rounded-lg bg-sky-50 border border-sky-100">
                  <div class="font-black text-slate-900 cyrillic-text">олуулаа</div>
                  <div class="text-[11px] text-sky-800">大勢で</div>
                </div>
                <div class="p-2 rounded-lg bg-emerald-50 border border-emerald-200">
                  <div class="font-black text-emerald-900 cyrillic-text">бүгдээрээ</div>
                  <div class="text-[11px] text-emerald-800">全員で、みんなで</div>
                </div>
              </div>
              <div class="text-[11px] text-slate-500 bg-slate-50 p-2 rounded-lg border border-slate-100">
                💡 質問するときは「<strong>Хэдүүлээ явах вэ?</strong>（何人で行きますか？）」と言います。
              </div>
            </div>

            <!-- 位置・方向・時間後置詞 -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div class="bg-white p-3.5 rounded-xl border border-slate-200 space-y-2">
                <div class="font-bold text-slate-800 flex items-center gap-1">
                  <span>📍</span> 位置・方向の後置詞
                </div>
                <div class="space-y-1 text-[11px] text-slate-700">
                  <div><strong>дээр</strong> : 上に（ширээн дээр = 机の上に）</div>
                  <div><strong>дор / доор</strong> : 下に（модон доор = 木の下に）</div>
                  <div><strong>дотор</strong> : 中に（өрөөн дотор = 部屋の中に）</div>
                  <div><strong>гадаа</strong> : 外に（гэрийн гадаа = ゲルの外に）</div>
                  <div><strong>хажууд / дэргэд</strong> : 横に、そばに</div>
                  <div><strong>өмнө / урд</strong> : 前に、南に</div>
                  <div><strong>ард / хойно</strong> : 後ろに、北に</div>
                  <div><strong>хооронд</strong> : 間に（хоёр хотын хооронд = 2都市の間）</div>
                  <div><strong>наана / цаана</strong> : 手前に / 奥・向こうに</div>
                  <div><strong>руу / рүү</strong> : 〜へ向かって（чиглэл）</div>
                </div>
              </div>

              <div class="bg-white p-3.5 rounded-xl border border-slate-200 space-y-2">
                <div class="font-bold text-slate-800 flex items-center gap-1">
                  <span>📅</span> 時間・日時の表現
                </div>
                <div class="space-y-1 text-[11px] text-slate-700">
                  <div><strong>өмнө</strong> : 〜の前に（долоо хоногийн өмнө = 1週間前）</div>
                  <div><strong>дараа</strong> : 〜の後に（хичээлийн дараа = 授業の後）</div>
                  <div><strong>хойно</strong> : 〜以降に（хоёр цагаас хойш = 2時以降）</div>
                  <div><strong>эхээр / дундуур / сүүлээр</strong> : 初旬 / 中旬 / 下旬</div>
                  <div><strong>турш</strong> : 〜の間ずっと（жилийн турш = 1年間ずっと）</div>
                  <div><strong>хүртэл / болтол</strong> : 〜まで（10 цаг хүртэл = 10時まで）</div>
                  <div><strong>орчим</strong> : 約、およそ（3 хоног орчим = 約3日間）</div>
                  <div><strong>гаруй</strong> : 〜余り、〜以上（1000 гаруй = 1000人以上）</div>
                  <div><strong>шахам</strong> : 〜近く、〜弱（нэг цаг шахам = 1時間近く）</div>
                </div>
              </div>
            </div>
          </div>

          <!-- タブ7: 実践会話フレーズ -->
          <div id="ref-tab-conversation" class="ref-subtab-pane hidden space-y-3">
            <div class="bg-emerald-50/80 p-3.5 rounded-xl border border-emerald-200 text-xs text-emerald-950 space-y-2">
              <div class="font-black text-sm flex items-center gap-1.5 text-emerald-900">
                <span>💬</span> 日常・面接・実践会話で即役立つネイティブ表現集
              </div>
              <p class="leading-relaxed">
                英語の Actually, Just, Enough や、相槌「まさにその通り」「私もそう思いました」など、会話を驚くほど自然にする頻出キーフレーズです。
              </p>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
              <div class="bg-white p-3 rounded-xl border border-emerald-200 space-y-1">
                <div class="flex items-center justify-between">
                  <span class="font-black text-slate-900 cyrillic-text">Үнэндээ</span>
                  <span class="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">Actually</span>
                </div>
                <div class="font-bold text-emerald-900">実は、本当は</div>
                <div class="text-[11px] text-slate-600">Үнэндээ би кофе уудаггүй.（実は私はコーヒーを飲まないんです）</div>
              </div>

              <div class="bg-white p-3 rounded-xl border border-emerald-200 space-y-1">
                <div class="flex items-center justify-between">
                  <span class="font-black text-slate-900 cyrillic-text">Зүгээр л</span>
                  <span class="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">Just</span>
                </div>
                <div class="font-bold text-emerald-900">ただ、単に（〜だけ）</div>
                <div class="text-[11px] text-slate-600">Би зүгээр л асуусан юм.（ただ聞いてみただけですよ）</div>
              </div>

              <div class="bg-white p-3 rounded-xl border border-emerald-200 space-y-1">
                <div class="flex items-center justify-between">
                  <span class="font-black text-slate-900 cyrillic-text">Хангалттай</span>
                  <span class="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">Enough</span>
                </div>
                <div class="font-bold text-emerald-900">十分、足りている</div>
                <div class="text-[11px] text-slate-600">Энэ хангалттай сайн байна.（これで十分いいですよ）</div>
              </div>

              <div class="bg-white p-3 rounded-xl border border-emerald-200 space-y-1">
                <div class="flex items-center justify-between">
                  <span class="font-black text-slate-900 cyrillic-text">Түүнээс бусад нь</span>
                  <span class="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">Other than that</span>
                </div>
                <div class="font-bold text-emerald-900">それ以外は</div>
                <div class="text-[11px] text-slate-600">Түүнээс бусад нь бүх зүйл сайн байсан.（それ以外は全部順調でした）</div>
              </div>

              <div class="bg-white p-3 rounded-xl border border-emerald-200 space-y-1">
                <div class="flex items-center justify-between">
                  <span class="font-black text-slate-900 cyrillic-text">Тийм ээ, яг тийм</span>
                  <span class="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">Yeah, exactly</span>
                </div>
                <div class="font-bold text-emerald-900">うん、まさにその通り</div>
                <div class="text-[11px] text-slate-600">Тийм ээ, яг тийм зүйл болсон.（うん、まさにその通りのことが起きました）</div>
              </div>

              <div class="bg-white p-3 rounded-xl border border-emerald-200 space-y-1">
                <div class="flex items-center justify-between">
                  <span class="font-black text-slate-900 cyrillic-text">Би ч бас тэгж бодсон</span>
                  <span class="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">That's what I thought</span>
                </div>
                <div class="font-bold text-emerald-900">私もそう思いました</div>
                <div class="text-[11px] text-slate-600">Би ч бас тэгж бодож байсан юм.（私もまさにそう考えていました）</div>
              </div>

              <div class="bg-white p-3 rounded-xl border border-emerald-200 space-y-1">
                <div class="flex items-center justify-between">
                  <span class="font-black text-slate-900 cyrillic-text">Тэр үед</span>
                  <span class="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">At that time</span>
                </div>
                <div class="font-bold text-emerald-900">その時、当時</div>
                <div class="text-[11px] text-slate-600">Тэр үед би оюутан байсан.（当時私は学生でした）</div>
              </div>

              <div class="bg-white p-3 rounded-xl border border-emerald-200 space-y-1">
                <div class="flex items-center justify-between">
                  <span class="font-black text-slate-900 cyrillic-text">Биеэ бодоорой</span>
                  <span class="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">Take care</span>
                </div>
                <div class="font-bold text-emerald-900">お体に気をつけて（ご自愛ください）</div>
                <div class="text-[11px] text-slate-600">Хүйтэн байна, дулаан хувцаслаад биеэ бодоорой!（寒いので暖かくして気をつけてね！）</div>
              </div>
            </div>
          </div>

          <!-- タブ8: モダリティ・終助詞12選 -->
          <div id="ref-tab-modality" class="ref-subtab-pane hidden space-y-4">
            <div class="bg-indigo-100/60 p-3.5 rounded-xl border border-indigo-200 text-xs text-indigo-950 space-y-2">
              <div class="font-black text-sm flex items-center gap-1.5 text-indigo-900">
                <span>🎭</span> 働きかけ・モダリティ表現（12大終助詞・推量・義務・伝聞）
              </div>
              <p class="leading-relaxed">
                話し手の疑い、確信、推量、義務、想起、伝聞などの気持ちや働きかけを表す最重要終助詞・構文12種です。日常会話や口述試験で頻出します。
              </p>
            </div>

            <div class="overflow-x-auto rounded-xl border border-indigo-200 bg-white shadow-xs">
              <table class="w-full text-left text-xs border-collapse">
                <thead>
                  <tr class="bg-indigo-50 text-indigo-950 border-b border-indigo-200">
                    <th class="p-2.5 font-bold">表現</th>
                    <th class="p-2.5 font-bold">意味・用法</th>
                    <th class="p-2.5 font-bold">例文</th>
                    <th class="p-2.5 font-bold">日本語訳</th>
                    <th class="p-2.5 text-center font-bold">音声</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-indigo-100 text-slate-700">
                  <tr class="hover:bg-indigo-50/40">
                    <td class="p-2.5 font-bold text-indigo-700 cyrillic-text">гэж үү?</td>
                    <td class="p-2.5">疑い・意外「本当に〜ですか？まさか〜？」</td>
                    <td class="p-2.5 cyrillic-text font-medium text-slate-900">Энэ үнэн гэж үү?</td>
                    <td class="p-2.5">これが本当ですか（まさか本当なのですか）？</td>
                    <td class="p-2.5 text-center"><button type="button" class="btn-ref-speak text-xs bg-indigo-50 hover:bg-indigo-100 p-1.5 rounded-md" data-word="Энэ үнэн гэж үү?">🔊</button></td>
                  </tr>
                  <tr class="hover:bg-indigo-50/40">
                    <td class="p-2.5 font-bold text-indigo-700 cyrillic-text">биш үү?</td>
                    <td class="p-2.5">確認・反語「〜ではありませんか？」「〜ですよね？」</td>
                    <td class="p-2.5 cyrillic-text font-medium text-slate-900">Энэ таны ном биш үү?</td>
                    <td class="p-2.5">これはあなたの本ではありませんか？</td>
                    <td class="p-2.5 text-center"><button type="button" class="btn-ref-speak text-xs bg-indigo-50 hover:bg-indigo-100 p-1.5 rounded-md" data-word="Энэ таны ном биш үү?">🔊</button></td>
                  </tr>
                  <tr class="hover:bg-indigo-50/40">
                    <td class="p-2.5 font-bold text-indigo-700 cyrillic-text">биз / биз дээ?</td>
                    <td class="p-2.5">相手への念押し確認「〜でしょうね」「〜だよね」</td>
                    <td class="p-2.5 cyrillic-text font-medium text-slate-900">Та маргааш завтай биз дээ?</td>
                    <td class="p-2.5">明日お時間ありますよね？</td>
                    <td class="p-2.5 text-center"><button type="button" class="btn-ref-speak text-xs bg-indigo-50 hover:bg-indigo-100 p-1.5 rounded-md" data-word="Та маргааш завтай биз дээ?">🔊</button></td>
                  </tr>
                  <tr class="hover:bg-indigo-50/40">
                    <td class="p-2.5 font-bold text-indigo-700 cyrillic-text">билүү / билээ?</td>
                    <td class="p-2.5">過去の記憶想起「〜でしたっけ？」（忘れた事の確認）</td>
                    <td class="p-2.5 cyrillic-text font-medium text-slate-900">Түүний нэр хэн билээ?</td>
                    <td class="p-2.5">彼の名前は何でしたっけ？</td>
                    <td class="p-2.5 text-center"><button type="button" class="btn-ref-speak text-xs bg-indigo-50 hover:bg-indigo-100 p-1.5 rounded-md" data-word="Түүний нэр хэн билээ?">🔊</button></td>
                  </tr>
                  <tr class="hover:bg-indigo-50/40">
                    <td class="p-2.5 font-bold text-indigo-700 cyrillic-text">болов уу? / бол?</td>
                    <td class="p-2.5">自問・婉曲推量「〜かしら、〜だろうか」</td>
                    <td class="p-2.5 cyrillic-text font-medium text-slate-900">Маргааш бороо орох болов уу?</td>
                    <td class="p-2.5">明日雨が降るかしら？</td>
                    <td class="p-2.5 text-center"><button type="button" class="btn-ref-speak text-xs bg-indigo-50 hover:bg-indigo-100 p-1.5 rounded-md" data-word="Маргааш бороо орох болов уу?">🔊</button></td>
                  </tr>
                  <tr class="hover:bg-indigo-50/40">
                    <td class="p-2.5 font-bold text-indigo-700 cyrillic-text">байх аа</td>
                    <td class="p-2.5">主観的推量「〜でしょう、〜と思う」</td>
                    <td class="p-2.5 cyrillic-text font-medium text-slate-900">Тэр одоо гэртээ байгаа байх аа.</td>
                    <td class="p-2.5">彼は今家にいるでしょう。</td>
                    <td class="p-2.5 text-center"><button type="button" class="btn-ref-speak text-xs bg-indigo-50 hover:bg-indigo-100 p-1.5 rounded-md" data-word="Тэр одоо гэртээ байгаа байх аа.">🔊</button></td>
                  </tr>
                  <tr class="hover:bg-indigo-50/40">
                    <td class="p-2.5 font-bold text-indigo-700 cyrillic-text">-х ёстой</td>
                    <td class="p-2.5">当然・義務「〜のはずだ、〜すべきだ」</td>
                    <td class="p-2.5 cyrillic-text font-medium text-slate-900">Бид цагтаа очих ёстой.</td>
                    <td class="p-2.5">私たちは時間通りに行くべきです。</td>
                    <td class="p-2.5 text-center"><button type="button" class="btn-ref-speak text-xs bg-indigo-50 hover:bg-indigo-100 p-1.5 rounded-md" data-word="Бид цагтаа очих ёстой.">🔊</button></td>
                  </tr>
                  <tr class="hover:bg-indigo-50/40">
                    <td class="p-2.5 font-bold text-indigo-700 cyrillic-text">магадгүй</td>
                    <td class="p-2.5">可能性・不確実推量「〜かもしれない」</td>
                    <td class="p-2.5 cyrillic-text font-medium text-slate-900">Тэр өнөөдөр ирж магадгүй.</td>
                    <td class="p-2.5">彼は今日来るかもしれない。</td>
                    <td class="p-2.5 text-center"><button type="button" class="btn-ref-speak text-xs bg-indigo-50 hover:bg-indigo-100 p-1.5 rounded-md" data-word="Тэр өнөөдөр ирж магадгүй.">🔊</button></td>
                  </tr>
                  <tr class="hover:bg-indigo-50/40">
                    <td class="p-2.5 font-bold text-indigo-700 cyrillic-text">бололтой</td>
                    <td class="p-2.5">状況・外見からの推測「〜のようだ、〜らしい」</td>
                    <td class="p-2.5 cyrillic-text font-medium text-slate-900">Бороо орох бололтой.</td>
                    <td class="p-2.5">雨が降りそうだ（降るらしい）。</td>
                    <td class="p-2.5 text-center"><button type="button" class="btn-ref-speak text-xs bg-indigo-50 hover:bg-indigo-100 p-1.5 rounded-md" data-word="Бороо орох бололтой.">🔊</button></td>
                  </tr>
                  <tr class="hover:bg-indigo-50/40">
                    <td class="p-2.5 font-bold text-indigo-700 cyrillic-text">мөн</td>
                    <td class="p-2.5">強い確信「まさに〜に違いない」</td>
                    <td class="p-2.5 cyrillic-text font-medium text-slate-900">Энэ ном мөн байна.</td>
                    <td class="p-2.5">まさにこの本に間違いありません。</td>
                    <td class="p-2.5 text-center"><button type="button" class="btn-ref-speak text-xs bg-indigo-50 hover:bg-indigo-100 p-1.5 rounded-md" data-word="Энэ ном мөн байна.">🔊</button></td>
                  </tr>
                  <tr class="hover:bg-indigo-50/40">
                    <td class="p-2.5 font-bold text-indigo-700 cyrillic-text">гэнэ ээ</td>
                    <td class="p-2.5">伝聞「〜だそうだ、〜とのことだ」</td>
                    <td class="p-2.5 cyrillic-text font-medium text-slate-900">Маргааш цас орно гэнэ ээ.</td>
                    <td class="p-2.5">明日雪が降るそうです。</td>
                    <td class="p-2.5 text-center"><button type="button" class="btn-ref-speak text-xs bg-indigo-50 hover:bg-indigo-100 p-1.5 rounded-md" data-word="Маргааш цас орно гэнэ ээ.">🔊</button></td>
                  </tr>
                  <tr class="hover:bg-indigo-50/40">
                    <td class="p-2.5 font-bold text-indigo-700 cyrillic-text">юм шиг байна</td>
                    <td class="p-2.5">直感・印象推測「〜みたいです、〜のようです」</td>
                    <td class="p-2.5 cyrillic-text font-medium text-slate-900">Тэр их ядарсан юм шиг байна.</td>
                    <td class="p-2.5">彼はとても疲れているみたいです。</td>
                    <td class="p-2.5 text-center"><button type="button" class="btn-ref-speak text-xs bg-indigo-50 hover:bg-indigo-100 p-1.5 rounded-md" data-word="Тэр их ядарсан юм шиг байна.">🔊</button></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- タブ9: 希求形・意思形（-я⁴ / -ъя⁴ / -ье） -->
          <div id="ref-tab-volitive" class="ref-subtab-pane hidden space-y-4">
            <div class="bg-indigo-100/60 p-3.5 rounded-xl border border-indigo-200 text-xs text-indigo-950 space-y-2">
              <div class="font-black text-sm flex items-center gap-1.5 text-indigo-900">
                <span>🎯</span> 動詞の希求形・意思形（-я⁴ / -ъя⁴ / -ье）完全活用ルール
              </div>
              <p class="leading-relaxed">
                「〜しよう」「〜しましょう」を表す意思・勧誘の語尾です。男性語／女性語および語幹末尾（母音か子音か）によって<strong>硬音記号「ъ」や軟音記号「ь」を挟む厳密な正書法</strong>があります。
              </p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <!-- 男性語 -->
              <div class="bg-white rounded-xl p-4 border border-amber-200 shadow-2xs space-y-2.5">
                <div class="font-black text-amber-800 text-sm flex items-center justify-between border-b border-amber-100 pb-1.5">
                  <span>🔵 男性語（語幹母音が а, о, у）</span>
                  <span class="text-[11px] bg-amber-100 text-amber-900 px-2 py-0.5 rounded-md font-bold">-я / -ё / -ъя / -ъё</span>
                </div>
                <div class="space-y-2">
                  <div class="bg-amber-50/60 p-2.5 rounded-lg border border-amber-200/60">
                    <div class="font-bold text-slate-800 mb-1">1. 母音語幹 ➜ 直接「-я / -ё」を接続</div>
                    <ul class="space-y-1 text-slate-700 cyrillic-text">
                      <li>• уух（飲む）➜ <span class="font-bold text-amber-700">ууя</span>（飲もう）</li>
                      <li>• тоглох（遊ぶ）➜ <span class="font-bold text-amber-700">тоглоё</span>（遊ぼう）</li>
                      <li>• унах（乗る）➜ <span class="font-bold text-amber-700">уная</span>（乗ろう）</li>
                    </ul>
                  </div>
                  <div class="bg-amber-50/60 p-2.5 rounded-lg border border-amber-200/60">
                    <div class="font-bold text-slate-800 mb-1">2. 子音語幹 ➜ 硬音記号「ъ」を挟んで「-ъя / -ъё」</div>
                    <ul class="space-y-1 text-slate-700 cyrillic-text">
                      <li>• амрах（休む: 語幹 амар-）➜ <span class="font-bold text-amber-700">амаръя</span>（休もう）</li>
                      <li>• уулзах（会う: 語幹 уулз-）➜ <span class="font-bold text-amber-700">уулзъя</span>（会おう）</li>
                      <li>• сонсох（聴く: 語幹 сонс-）➜ <span class="font-bold text-amber-700">сонсъё</span>（聴こう）</li>
                      <li>• гарах（出る: 語幹 гар-）➜ <span class="font-bold text-amber-700">гаръя</span>（出よう）</li>
                      <li>• явах（行く: 語幹 яв-）➜ <span class="font-bold text-amber-700">явъя</span>（行こう）</li>
                      <li>• ярих（話す: 語幹 ярь-）➜ <span class="font-bold text-amber-700">яръя</span>（話そう: ьが脱落してъя）</li>
                    </ul>
                  </div>
                </div>
              </div>

              <!-- 女性語 -->
              <div class="bg-white rounded-xl p-4 border border-sky-200 shadow-2xs space-y-2.5">
                <div class="font-black text-sky-800 text-sm flex items-center justify-between border-b border-sky-100 pb-1.5">
                  <span>🌸 女性語（語幹母音が э, ө, ү, и）</span>
                  <span class="text-[11px] bg-sky-100 text-sky-900 px-2 py-0.5 rounded-md font-bold">-е / -ье</span>
                </div>
                <div class="space-y-2">
                  <div class="bg-sky-50/60 p-2.5 rounded-lg border border-sky-200/60">
                    <div class="font-bold text-slate-800 mb-1">1. 母音語幹 ➜ 直接「-е」を接続</div>
                    <ul class="space-y-1 text-slate-700 cyrillic-text">
                      <li>• гүйх（走る）➜ <span class="font-bold text-sky-700">гүе</span>（走ろう）</li>
                      <li>• цэвэрлэх（掃除する）➜ <span class="font-bold text-sky-700">цэвэрлэе</span>（掃除しよう）</li>
                      <li>• нээх（開ける）➜ <span class="font-bold text-sky-700">нээе</span>（開けよう）</li>
                      <li>• хийх（する）➜ <span class="font-bold text-sky-700">хийе</span>（しよう）</li>
                    </ul>
                  </div>
                  <div class="bg-sky-50/60 p-2.5 rounded-lg border border-sky-200/60">
                    <div class="font-bold text-slate-800 mb-1">2. 子音語幹 ➜ 軟音記号「ь」を挟んで「-ье」</div>
                    <ul class="space-y-1 text-slate-700 cyrillic-text">
                      <li>• үзэх（見る: 語幹 үз-）➜ <span class="font-bold text-sky-700">үзье</span>（見よう）</li>
                      <li>• идэх（食べる: 語幹 ид-）➜ <span class="font-bold text-sky-700">идье</span>（食べよう）</li>
                      <li>• хүсэх（願う: 語幹 хүс-）➜ <span class="font-bold text-sky-700">хүсье</span>（願おう）</li>
                      <li>• сэлэх（泳ぐ: 語幹 сэл-）➜ <span class="font-bold text-sky-700">сэлье</span>（泳ごう）</li>
                      <li>• шилжүүлэх（振り込む: 語幹 шилжүүл-）➜ <span class="font-bold text-sky-700">шилжүүлье</span></li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- タブ10: 進行形（-ж / -ч байна）の原則と5大例外 -->
          <div id="ref-tab-converb-j-ch" class="ref-subtab-pane hidden space-y-4">
            <div class="bg-indigo-100/60 p-3.5 rounded-xl border border-indigo-200 text-xs text-indigo-950 space-y-2">
              <div class="font-black text-sm flex items-center gap-1.5 text-indigo-900">
                <span>⚡</span> 現在進行形（-ж / -ч байна）の原則と5大例外動詞
              </div>
              <p class="leading-relaxed">
                モンゴル語の現在進行形「〜している」は動詞語幹に「-ж байна」または「-ч байна」を接続します。原則規則と、試験で狙われる<strong>超重要5大例外</strong>を完璧に押さえましょう。
              </p>
            </div>

            <!-- 原則と例外の対比カード -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div class="bg-white rounded-xl p-4 border border-emerald-200 shadow-2xs space-y-2">
                <div class="font-bold text-emerald-800 text-sm border-b border-emerald-100 pb-1">
                  📘 原則ルール（接続条件）
                </div>
                <div class="space-y-2 text-slate-700">
                  <div class="p-2 bg-emerald-50/50 rounded-lg">
                    <strong class="text-emerald-900">「-ч」を取る語幹:</strong><br>
                    語幹末尾が <strong>р, г, в, л</strong>（特に非摩擦子音）の場合:
                    <ul class="mt-1 space-y-0.5 cyrillic-text">
                      <li>• сур-（学ぶ）➜ <span class="font-bold text-emerald-700">сурч байна</span></li>
                      <li>• өг-（与える）➜ <span class="font-bold text-emerald-700">өгч байна</span></li>
                      <li>• ав-（取る）➜ <span class="font-bold text-emerald-700">авч байна</span></li>
                    </ul>
                  </div>
                  <div class="p-2 bg-emerald-50/50 rounded-lg">
                    <strong class="text-emerald-900">「-ж」を取る語幹:</strong><br>
                    母音語幹、および ж, ч, ш, ц, з, с, д, т, х, н, м 等:
                    <ul class="mt-1 space-y-0.5 cyrillic-text">
                      <li>• унши-（読む）➜ <span class="font-bold text-emerald-700">уншиж байна</span></li>
                      <li>• хий-（する）➜ <span class="font-bold text-emerald-700">хийж байна</span></li>
                      <li>• бич-（書く）➜ <span class="font-bold text-emerald-700">бичиж байна</span></li>
                    </ul>
                  </div>
                </div>
              </div>

              <!-- 5大例外動詞カード -->
              <div class="bg-gradient-to-br from-rose-50 to-amber-50 rounded-xl p-4 border-2 border-rose-300 shadow-2xs space-y-2">
                <div class="font-black text-rose-900 text-sm flex items-center justify-between border-b border-rose-200 pb-1">
                  <span>🚨 超重要！5大例外動詞</span>
                  <span class="text-[10px] bg-rose-600 text-white px-2 py-0.5 rounded-full font-bold">必須暗記</span>
                </div>
                <p class="text-slate-600">
                  語幹末尾が р, г, в で終わるにもかかわらず、<strong>「-ч」ではなく「-ж」を取る</strong>超頻出例外です！
                </p>
                <div class="space-y-1.5 pt-1">
                  <div class="bg-white/90 p-2 rounded-lg border border-rose-200 flex items-center justify-between cyrillic-text">
                    <div>
                      <span class="font-black text-slate-800">1. ирэх</span>（語幹: ир- / 来る）
                    </div>
                    <div>
                      <span class="text-rose-500 line-through text-xs mr-1">ирч</span>
                      <span class="font-black text-emerald-700 text-sm">➜ ирж байна</span>
                    </div>
                  </div>
                  <div class="bg-white/90 p-2 rounded-lg border border-rose-200 flex items-center justify-between cyrillic-text">
                    <div>
                      <span class="font-black text-slate-800">2. орох</span>（語幹: ор- / 入る・降る）
                    </div>
                    <div>
                      <span class="text-rose-500 line-through text-xs mr-1">орч</span>
                      <span class="font-black text-emerald-700 text-sm">➜ орж байна</span>
                    </div>
                  </div>
                  <div class="bg-white/90 p-2 rounded-lg border border-rose-200 flex items-center justify-between cyrillic-text">
                    <div>
                      <span class="font-black text-slate-800">3. явах</span>（語幹: яв- / 行く）
                    </div>
                    <div>
                      <span class="text-rose-500 line-through text-xs mr-1">явч</span>
                      <span class="font-black text-emerald-700 text-sm">➜ явж байна</span>
                    </div>
                  </div>
                  <div class="bg-white/90 p-2 rounded-lg border border-rose-200 flex items-center justify-between cyrillic-text">
                    <div>
                      <span class="font-black text-slate-800">4. зурах</span>（語幹: зур- / 描く）
                    </div>
                    <div>
                      <span class="text-rose-500 line-through text-xs mr-1">зурч</span>
                      <span class="font-black text-emerald-700 text-sm">➜ зурж байна</span>
                    </div>
                  </div>
                  <div class="bg-white/90 p-2 rounded-lg border border-rose-200 flex items-center justify-between cyrillic-text">
                    <div>
                      <span class="font-black text-slate-800">5. харах</span>（語幹: хар- / 見る）
                    </div>
                    <div>
                      <span class="text-rose-500 line-through text-xs mr-1">харч</span>
                      <span class="font-black text-emerald-700 text-sm">➜ харж байна</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- タブ11: 補助動詞7大構文 -->
          <div id="ref-tab-auxiliary-verbs" class="ref-subtab-pane hidden space-y-4">
            <div class="bg-indigo-100/60 p-3.5 rounded-xl border border-indigo-200 text-xs text-indigo-950 space-y-2">
              <div class="font-black text-sm flex items-center gap-1.5 text-indigo-900">
                <span>🤝</span> 補助動詞7大構文（V + ж/ч + 補助動詞）
              </div>
              <p class="leading-relaxed">
                本動詞の接続形（-ж / -ч）に補助動詞を添えることで、開始、終了、能力獲得、試み、経験、授受などの豊かなアスペクト・ニュアンスを表します。
              </p>
            </div>

            <div class="overflow-x-auto rounded-xl border border-indigo-200 bg-white shadow-xs">
              <table class="w-full text-left text-xs border-collapse">
                <thead>
                  <tr class="bg-indigo-50 text-indigo-950 border-b border-indigo-200">
                    <th class="p-2.5 font-bold">構文</th>
                    <th class="p-2.5 font-bold">意味</th>
                    <th class="p-2.5 font-bold">例文</th>
                    <th class="p-2.5 font-bold">日本語訳</th>
                    <th class="p-2.5 text-center font-bold">音声</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-indigo-100 text-slate-700">
                  <tr class="hover:bg-indigo-50/40">
                    <td class="p-2.5 font-bold text-indigo-700 cyrillic-text">V + ж/ч сурах</td>
                    <td class="p-2.5">〜できるようになる、〜の仕方を覚える</td>
                    <td class="p-2.5 cyrillic-text font-medium text-slate-900">Би монгол хоол хийж сурсан.</td>
                    <td class="p-2.5">私はモンゴル料理を作れるようになった。</td>
                    <td class="p-2.5 text-center"><button type="button" class="btn-ref-speak text-xs bg-indigo-50 hover:bg-indigo-100 p-1.5 rounded-md" data-word="Би монгол хоол хийж сурсан.">🔊</button></td>
                  </tr>
                  <tr class="hover:bg-indigo-50/40">
                    <td class="p-2.5 font-bold text-indigo-700 cyrillic-text">V + ж/ч эхлэх</td>
                    <td class="p-2.5">〜し始める（動作・状態の開始）</td>
                    <td class="p-2.5 cyrillic-text font-medium text-slate-900">Цас орж эхэллээ.</td>
                    <td class="p-2.5">雪が降り始めた。</td>
                    <td class="p-2.5 text-center"><button type="button" class="btn-ref-speak text-xs bg-indigo-50 hover:bg-indigo-100 p-1.5 rounded-md" data-word="Цас орж эхэллээ.">🔊</button></td>
                  </tr>
                  <tr class="hover:bg-indigo-50/40">
                    <td class="p-2.5 font-bold text-indigo-700 cyrillic-text">V + ж/ч дуусах</td>
                    <td class="p-2.5">〜し終わる（動作の完了）</td>
                    <td class="p-2.5 cyrillic-text font-medium text-slate-900">Би даалгавраа хийж дууссан.</td>
                    <td class="p-2.5">私は宿題をし終えた。</td>
                    <td class="p-2.5 text-center"><button type="button" class="btn-ref-speak text-xs bg-indigo-50 hover:bg-indigo-100 p-1.5 rounded-md" data-word="Би даалгавраа хийж дууссан.">🔊</button></td>
                  </tr>
                  <tr class="hover:bg-indigo-50/40">
                    <td class="p-2.5 font-bold text-indigo-700 cyrillic-text">V + ж/ч үзэх</td>
                    <td class="p-2.5">〜してみる（試み）</td>
                    <td class="p-2.5 cyrillic-text font-medium text-slate-900">Энэ дээлийг өмсөж үзье.</td>
                    <td class="p-2.5">このデールを着てみよう。</td>
                    <td class="p-2.5 text-center"><button type="button" class="btn-ref-speak text-xs bg-indigo-50 hover:bg-indigo-100 p-1.5 rounded-md" data-word="Энэ дээлийг өмсөж үзье.">🔊</button></td>
                  </tr>
                  <tr class="hover:bg-indigo-50/40">
                    <td class="p-2.5 font-bold text-indigo-700 cyrillic-text">V + ж/ч үзсэн / байсан</td>
                    <td class="p-2.5">〜したことがある（過去の経験）</td>
                    <td class="p-2.5 cyrillic-text font-medium text-slate-900">Би хөдөө морь унаж үзсэн.</td>
                    <td class="p-2.5">私は田舎で馬に乗ったことがある。</td>
                    <td class="p-2.5 text-center"><button type="button" class="btn-ref-speak text-xs bg-indigo-50 hover:bg-indigo-100 p-1.5 rounded-md" data-word="Би хөдөө морь унаж үзсэн.">🔊</button></td>
                  </tr>
                  <tr class="hover:bg-indigo-50/40">
                    <td class="p-2.5 font-bold text-indigo-700 cyrillic-text">V + ж/ч авах</td>
                    <td class="p-2.5">自分のために〜しておく / 自分のものにする</td>
                    <td class="p-2.5 cyrillic-text font-medium text-slate-900">Түүний хаягийг тэмдэглэж авсан.</td>
                    <td class="p-2.5">彼の住所をメモしておいた。</td>
                    <td class="p-2.5 text-center"><button type="button" class="btn-ref-speak text-xs bg-indigo-50 hover:bg-indigo-100 p-1.5 rounded-md" data-word="Түүний хаягийг тэмдэглэж авсан.">🔊</button></td>
                  </tr>
                  <tr class="hover:bg-indigo-50/40">
                    <td class="p-2.5 font-bold text-indigo-700 cyrillic-text">V + ж/ч өгөх</td>
                    <td class="p-2.5">相手のために〜してあげる（恩恵の授与）</td>
                    <td class="p-2.5 cyrillic-text font-medium text-slate-900">Би найздаа тусалж өгсөн.</td>
                    <td class="p-2.5">私は友達を手伝ってあげた。</td>
                    <td class="p-2.5 text-center"><button type="button" class="btn-ref-speak text-xs bg-indigo-50 hover:bg-indigo-100 p-1.5 rounded-md" data-word="Би найздаа тусалж өгсөн.">🔊</button></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- タブ12: 複数形語尾の5大分類 -->
          <div id="ref-tab-plural" class="ref-subtab-pane hidden space-y-4">
            <div class="bg-indigo-100/60 p-3.5 rounded-xl border border-indigo-200 text-xs text-indigo-950 space-y-2">
              <div class="font-black text-sm flex items-center gap-1.5 text-indigo-900">
                <span>👥</span> 複数形語尾（-ууд², -нар, -д, -с, -чууд²）の完全分類
              </div>
              <p class="leading-relaxed">
                モンゴル語の名詞複数形は単一ではなく、対象（物・敬称・職業・集団など）や語末音によって語尾が変化します。
              </p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div class="bg-white rounded-xl p-3.5 border border-indigo-200 space-y-2">
                <div class="font-bold text-indigo-900 text-sm">1. -ууд / -үүд（一般複数形）</div>
                <p class="text-slate-600">最も汎用的な複数語尾。子音終わり名詞や一般事物に広く使われます。</p>
                <ul class="space-y-1 cyrillic-text text-slate-800">
                  <li>• ном ➜ <span class="font-bold text-indigo-700">номууд</span>（本たち）</li>
                  <li>• гэр ➜ <span class="font-bold text-indigo-700">гэрүүд</span>（ゲルたち/家たち）</li>
                  <li>• байшин ➜ <span class="font-bold text-indigo-700">байшингууд</span>（建物たち）</li>
                </ul>
              </div>

              <div class="bg-white rounded-xl p-3.5 border border-indigo-200 space-y-2">
                <div class="font-bold text-indigo-900 text-sm">2. -нар / -нэр（人物・敬称・親族）</div>
                <p class="text-slate-600">先生、僧侶、家族、目上の人など敬意を伴う人物名詞に接続します。</p>
                <ul class="space-y-1 cyrillic-text text-slate-800">
                  <li>• багш ➜ <span class="font-bold text-indigo-700">багш нар</span>（先生たち）</li>
                  <li>• лам ➜ <span class="font-bold text-indigo-700">лам нар</span>（僧侶たち）</li>
                  <li>• эгч ➜ <span class="font-bold text-indigo-700">эгч нар</span>（姉たち）</li>
                  <li>• эмч ➜ <span class="font-bold text-indigo-700">эмч нар</span>（医者たち）</li>
                </ul>
              </div>

              <div class="bg-white rounded-xl p-3.5 border border-indigo-200 space-y-2">
                <div class="font-bold text-indigo-900 text-sm">3. -д（語末が -гч, -ч, -н, -л の名詞）</div>
                <p class="text-slate-600">職業や行為者を表す「-гч」「-ч」等で終わる名詞に付きます。</p>
                <ul class="space-y-1 cyrillic-text text-slate-800">
                  <li>• уншигч ➜ <span class="font-bold text-indigo-700">уншигчид</span>（読者たち）</li>
                  <li>• сурагч ➜ <span class="font-bold text-indigo-700">сурагчид</span>（生徒たち）</li>
                  <li>• оюутан ➜ <span class="font-bold text-indigo-700">оюутнууд / оюутнууд</span>（学生たち）</li>
                </ul>
              </div>

              <div class="bg-white rounded-xl p-3.5 border border-indigo-200 space-y-2">
                <div class="font-bold text-indigo-900 text-sm">4. -чууд / -чүүд（世代・民族・集団）</div>
                <p class="text-slate-600">同じ属性や世代、出身地を共有する人間集団を表します。</p>
                <ul class="space-y-1 cyrillic-text text-slate-800">
                  <li>• залуу ➜ <span class="font-bold text-indigo-700">залуучууд</span>（若者たち）</li>
                  <li>• монгол ➜ <span class="font-bold text-indigo-700">монголчууд</span>（モンゴル人たち）</li>
                  <li>• хүүхэд ➜ <span class="font-bold text-indigo-700">хүүхдүүд</span>（子どもたち）</li>
                </ul>
              </div>
            </div>
          </div>

          <!-- タブ13: 再帰所有＆人称関係助詞 -->
          <div id="ref-tab-reflexive" class="ref-subtab-pane hidden space-y-4">
            <div class="bg-indigo-100/60 p-3.5 rounded-xl border border-indigo-200 text-xs text-indigo-950 space-y-2">
              <div class="font-black text-sm flex items-center gap-1.5 text-indigo-900">
                <span>🔄</span> 再帰所有語尾（-аа⁴, -хаа⁴, -гаа⁴）＆ 人称関係助詞（минь, маань...）
              </div>
              <p class="leading-relaxed">
                主語自身が所有するものを表す再帰所有語尾と、会話で親愛や関係性を添える人称関係助詞の完全まとめです。
              </p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <!-- 再帰所有語尾 -->
              <div class="bg-white rounded-xl p-4 border border-indigo-200 shadow-2xs space-y-2.5">
                <div class="font-bold text-indigo-900 text-sm border-b border-indigo-100 pb-1">
                  1. 再帰所有語尾（自分の〜）
                </div>
                <div class="space-y-1.5 text-slate-700">
                  <div class="p-2 bg-indigo-50/50 rounded-lg">
                    <strong>基本形（単独接続）:</strong> -аа / -ээ / -оо / -өө<br>
                    • ном + -оо ➜ <span class="font-bold cyrillic-text text-indigo-700">номоо</span>（自分の本を）<br>
                    • ажил + -аа ➜ <span class="font-bold cyrillic-text text-indigo-700">ажлаа</span>（自分の仕事を）
                  </div>
                  <div class="p-2 bg-indigo-50/50 rounded-lg">
                    <strong>与位格（-д + -аа⁴）:</strong> -даа / -дээ / -доо / -дөө<br>
                    • гэр ➜ <span class="font-bold cyrillic-text text-indigo-700">гэртээ</span>（自分の家に）<br>
                    • найз ➜ <span class="font-bold cyrillic-text text-indigo-700">найздаа</span>（自分の友達に）
                  </div>
                  <div class="p-2 bg-indigo-50/50 rounded-lg">
                    <strong>奪格（-аас + -аа⁴）:</strong> -аасаа / -ээсээ / -оосоо / -өөсөө<br>
                    • гэр ➜ <span class="font-bold cyrillic-text text-indigo-700">гэрээсээ</span>（自分の家から）
                  </div>
                  <div class="p-2 bg-indigo-50/50 rounded-lg">
                    <strong>造格（-аар + -аа⁴）:</strong> -аараа / -ээрээ / -оороо / -өөрөө<br>
                    • машин ➜ <span class="font-bold cyrillic-text text-indigo-700">машинаараа</span>（自分の車で）
                  </div>
                </div>
              </div>

              <!-- 人称関係助詞 -->
              <div class="bg-white rounded-xl p-4 border border-indigo-200 shadow-2xs space-y-2.5">
                <div class="font-bold text-indigo-900 text-sm border-b border-indigo-100 pb-1">
                  2. 人称関係助詞（会話の親愛表現）
                </div>
                <div class="space-y-1.5 text-slate-700">
                  <div class="p-2 bg-slate-50 rounded-lg">
                    <strong class="text-indigo-800 cyrillic-text">минь</strong>（私の〜: 親愛感・慈しみ）<br>
                    • Ээж минь сайн байна уу?（私のお母さんは元気かい？）
                  </div>
                  <div class="p-2 bg-slate-50 rounded-lg">
                    <strong class="text-indigo-800 cyrillic-text">маань</strong>（私たちの〜: 誇り・家族・仲間）<br>
                    • Манай хүү маань их сайн сурч байна.（うちの息子ちゃんはとてもよく勉強しています。）
                  </div>
                  <div class="p-2 bg-slate-50 rounded-lg">
                    <strong class="text-indigo-800 cyrillic-text">чинь</strong>（あなたの〜: 親称の確認・親しさ）<br>
                    • Нэр чинь хэн бэ?（君の名前は何だっけ？）
                  </div>
                  <div class="p-2 bg-slate-50 rounded-lg">
                    <strong class="text-indigo-800 cyrillic-text">тань</strong>（あなたの〜: 敬称）<br>
                    • Гэр бүл тань сайн сууж байна уу?（ご家族はお元気でいらっしゃいますか？）
                  </div>
                  <div class="p-2 bg-slate-50 rounded-lg">
                    <strong class="text-indigo-800 cyrillic-text">нь</strong>（その〜: 話題の提示・限定）<br>
                    • Энэ цамцны өнгө нь их гоё байна.（このシャツの色はとても綺麗です。）
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- タブ14: 疑問詞全格変化マトリクス -->
          <div id="ref-tab-interrogative" class="ref-subtab-pane hidden space-y-4">
            <div class="bg-indigo-100/60 p-3.5 rounded-xl border border-indigo-200 text-xs text-indigo-950 space-y-2">
              <div class="font-black text-sm flex items-center gap-1.5 text-indigo-900">
                <span>❓</span> 疑問詞全格変化マトリクス（хэн, юу, хаана, хэзээ, хэд）
              </div>
              <p class="leading-relaxed">
                モンゴル語の疑問詞は名詞と同様に格変化します。疑問詞がある文は文末に「вэ / бэ」が付きます（Yes/No疑問文の「уу / үү」と区別）。
              </p>
            </div>

            <div class="overflow-x-auto rounded-xl border border-indigo-200 bg-white shadow-xs">
              <table class="w-full text-left text-xs border-collapse">
                <thead>
                  <tr class="bg-indigo-50 text-indigo-950 border-b border-indigo-200">
                    <th class="p-2.5 font-bold">格</th>
                    <th class="p-2.5 font-bold">хэн（誰）</th>
                    <th class="p-2.5 font-bold">юу（何）</th>
                    <th class="p-2.5 font-bold">хаана（どこ）</th>
                    <th class="p-2.5 font-bold">хэзээ（いつ）</th>
                    <th class="p-2.5 font-bold">хэд（いくつ）</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-indigo-100 text-slate-700 cyrillic-text">
                  <tr class="hover:bg-indigo-50/40">
                    <td class="p-2.5 font-bold text-slate-900 font-sans">主格（〜は）</td>
                    <td class="p-2.5 font-black text-indigo-700">хэн</td>
                    <td class="p-2.5 font-black text-indigo-700">юу</td>
                    <td class="p-2.5 font-black text-indigo-700">хаана</td>
                    <td class="p-2.5 font-black text-indigo-700">хэзээ</td>
                    <td class="p-2.5 font-black text-indigo-700">хэд</td>
                  </tr>
                  <tr class="hover:bg-indigo-50/40">
                    <td class="p-2.5 font-bold text-slate-900 font-sans">属格（〜の）</td>
                    <td class="p-2.5">хэний</td>
                    <td class="p-2.5">юуны</td>
                    <td class="p-2.5">хаанахын</td>
                    <td class="p-2.5">хэзээний</td>
                    <td class="p-2.5">хэдний</td>
                  </tr>
                  <tr class="hover:bg-indigo-50/40">
                    <td class="p-2.5 font-bold text-slate-900 font-sans">与位格（〜に/で）</td>
                    <td class="p-2.5">хэнд</td>
                    <td class="p-2.5">юунд</td>
                    <td class="p-2.5">хаашаа (方向)</td>
                    <td class="p-2.5">хэзээд</td>
                    <td class="p-2.5">хэдэд</td>
                  </tr>
                  <tr class="hover:bg-indigo-50/40">
                    <td class="p-2.5 font-bold text-slate-900 font-sans">対格（〜を）</td>
                    <td class="p-2.5">хэнийг</td>
                    <td class="p-2.5">юуг / юу</td>
                    <td class="p-2.5">-</td>
                    <td class="p-2.5">-</td>
                    <td class="p-2.5">хэдийг</td>
                  </tr>
                  <tr class="hover:bg-indigo-50/40">
                    <td class="p-2.5 font-bold text-slate-900 font-sans">奪格（〜から/より）</td>
                    <td class="p-2.5">хэнээс</td>
                    <td class="p-2.5">юунаас</td>
                    <td class="p-2.5">хаанаас</td>
                    <td class="p-2.5">хэзээнээс</td>
                    <td class="p-2.5">хэдээс</td>
                  </tr>
                  <tr class="hover:bg-indigo-50/40">
                    <td class="p-2.5 font-bold text-slate-900 font-sans">造格（〜で/を使って）</td>
                    <td class="p-2.5">хэнээр</td>
                    <td class="p-2.5">юугаар</td>
                    <td class="p-2.5">хаагуур</td>
                    <td class="p-2.5">-</td>
                    <td class="p-2.5">хэдээр</td>
                  </tr>
                  <tr class="hover:bg-indigo-50/40">
                    <td class="p-2.5 font-bold text-slate-900 font-sans">共格（〜と）</td>
                    <td class="p-2.5">хэнтэй</td>
                    <td class="p-2.5">юутай</td>
                    <td class="p-2.5">-</td>
                    <td class="p-2.5">-</td>
                    <td class="p-2.5">хэдтэй</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- 疑問文末尾助詞ルール -->
            <div class="bg-amber-50 rounded-xl p-3.5 border border-amber-200 text-xs space-y-1.5">
              <div class="font-bold text-amber-900">💡 疑問文の文末助詞ルール（вэ/бэ vs уу/үү）</div>
              <ul class="space-y-1 text-slate-700">
                <li>• <strong>疑問詞がある疑問文:</strong> 文末は <strong>вэ / бэ</strong>（語末が н, м, л, в の後は「бэ」、それ以外は「вэ」）<br>
                  例: Энэ юу вэ?（これは何ですか？）/ Тэр хэн бэ?（あの人は誰ですか？）
                </li>
                <li>• <strong>Yes/No 疑問文:</strong> 文末は <strong>уу / үү / юу / юү</strong><br>
                  例: Та оюутан уу?（あなたは学生ですか？）/ Энэ таны ном уу?（これはあなたの本ですか？）
                </li>
              </ul>
            </div>
          </div>

          <!-- タブ15: 与位格（-д / -т）接続＆隠れ-н語完全一覧 -->
          <div id="ref-tab-dative-locative" class="ref-subtab-pane hidden space-y-4">
            <div class="bg-indigo-100/60 p-3.5 rounded-xl border border-indigo-200 text-xs text-indigo-950 space-y-2">
              <div class="font-black text-sm flex items-center gap-1.5 text-indigo-900">
                <span>🏛️</span> 与位格助詞（-д / -т）の厳密な接続条件と隠れ-н語完全一覧
              </div>
              <p class="leading-relaxed">
                場所・時・対象「〜に、〜で」を表す与位格助詞「-д / -т」の接続規則です。語末の子音や潜在文字（隠れ-н）によって厳密に形が決まります。
              </p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <!-- -т 接続 -->
              <div class="bg-white rounded-xl p-3.5 border border-rose-200 shadow-2xs space-y-2">
                <div class="font-black text-rose-800 text-sm border-b border-rose-100 pb-1 flex items-center justify-between">
                  <span>1. 「-т」接続</span>
                  <span class="text-[10px] bg-rose-100 text-rose-800 px-2 py-0.5 rounded-md font-bold">г, р, с, в等</span>
                </div>
                <p class="text-slate-600">語末が г, р, с, в または非共鳴子音で終わる名詞に直接「-т」が接続します。</p>
                <div class="space-y-1 cyrillic-text font-medium text-slate-800 bg-rose-50/50 p-2 rounded-lg">
                  <div>• дэлгүүр ➜ <span class="font-bold text-rose-700">дэлгүүрт</span>（店に）</div>
                  <div>• Солонгос ➜ <span class="font-bold text-rose-700">Солонгост</span>（韓国に）</div>
                  <div>• самбар ➜ <span class="font-bold text-rose-700">самбарт</span>（黒板に）</div>
                  <div>• үйлдвэр ➜ <span class="font-bold text-rose-700">үйлдвэрт</span>（工場に）</div>
                  <div>• гэр ➜ <span class="font-bold text-rose-700">гэрт</span>（家に）</div>
                  <div>• дэвтэр ➜ <span class="font-bold text-rose-700">дэвтэрт</span>（ノートに）</div>
                  <div>• компьютер ➜ <span class="font-bold text-rose-700">компьютерт</span></div>
                  <div>• Улаанбаатар ➜ <span class="font-bold text-rose-700">Улаанбаатарт</span></div>
                </div>
              </div>

              <!-- 母音挿入 -д 接続 -->
              <div class="bg-white rounded-xl p-3.5 border border-amber-200 shadow-2xs space-y-2">
                <div class="font-black text-amber-800 text-sm border-b border-amber-100 pb-1 flex items-center justify-between">
                  <span>2. 母音挿入＋「-д」</span>
                  <span class="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded-md font-bold">ж, ч, ш, з等</span>
                </div>
                <p class="text-slate-600">子音衝突を防ぐため、間に短母音（а/и/о/ө）を挟んで「-д」を接続します。</p>
                <div class="space-y-1 cyrillic-text font-medium text-slate-800 bg-amber-50/50 p-2 rounded-lg">
                  <div>• багш ➜ <span class="font-bold text-amber-700">багшид</span>（先生に）</div>
                  <div>• найз ➜ <span class="font-bold text-amber-700">найзад</span>（友人に）</div>
                  <div>• эмч ➜ <span class="font-bold text-amber-700">эмчид</span>（医者に）</div>
                  <div>• зурагт ➜ <span class="font-bold text-amber-700">зурагтад</span>（テレビに）</div>
                  <div>• Франц ➜ <span class="font-bold text-amber-700">Францад</span>（フランスに）</div>
                  <div>• Тайланд ➜ <span class="font-bold text-amber-700">Тайландад</span>（タイに）</div>
                </div>
              </div>

              <!-- 隠れ-н ＋ -д 接続 -->
              <div class="bg-white rounded-xl p-3.5 border border-emerald-200 shadow-2xs space-y-2">
                <div class="font-black text-emerald-800 text-sm border-b border-emerald-100 pb-1 flex items-center justify-between">
                  <span>3. 隠れ-н ＋「-д」</span>
                  <span class="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md font-bold">-нд / -өнд等</span>
                </div>
                <p class="text-slate-600">潜在する「н」が復活し、「-нд」などの形で接続する最重要単語群です。</p>
                <div class="space-y-1 cyrillic-text font-medium text-slate-800 bg-emerald-50/50 p-2 rounded-lg">
                  <div>• цүнх ➜ <span class="font-bold text-emerald-700">цүнхэнд</span>（かばんに）</div>
                  <div>• хоол ➜ <span class="font-bold text-emerald-700">хоолонд</span>（料理に）</div>
                  <div>• банк ➜ <span class="font-bold text-emerald-700">банканд</span>（銀行に）</div>
                  <div>• мөнгө ➜ <span class="font-bold text-emerald-700">мөнгөнд</span>（お金に）</div>
                  <div>• өрөө ➜ <span class="font-bold text-emerald-700">өрөөнд</span>（部屋に）</div>
                  <div>• ширээ ➜ <span class="font-bold text-emerald-700">ширээнд</span>（机に）</div>
                  <div>• сүү ➜ <span class="font-bold text-emerald-700">сүүнд</span>（牛乳に）</div>
                  <div>• харандаа ➜ <span class="font-bold text-emerald-700">харандаанд</span></div>
                </div>
              </div>
            </div>
          </div>

</div>
        </div>

        <!-- 2. 格支配の重要ルール -->
        <div class="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
          <div class="flex items-center gap-2">
            <span class="text-lg">🔴</span>
            <h3 class="text-sm font-bold text-slate-800">格支配のまとめ（要注意ポイント）</h3>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
            <div class="p-3 rounded-xl border border-rose-200 bg-rose-50/40 space-y-1">
              <div class="font-bold text-rose-900">「〜が好き」の対象は【与位格】</div>
              <div class="text-slate-600">Би хөгжим<span class="text-rose-600 font-bold">д</span> дуртай.（私は音楽が好きです）</div>
            </div>
            <div class="p-3 rounded-xl border border-rose-200 bg-rose-50/40 space-y-1">
              <div class="font-bold text-rose-900">後置詞（上・下・前など）の前は【属格】</div>
              <div class="text-slate-600">өрөө<span class="text-rose-600 font-bold">ний</span> гадаа / ширээ<span class="text-rose-600 font-bold">н</span> дээр</div>
            </div>
            <div class="p-3 rounded-xl border border-rose-200 bg-rose-50/40 space-y-1">
              <div class="font-bold text-rose-900">「〜から来た」は【奪格】</div>
              <div class="text-slate-600">Монгол<span class="text-rose-600 font-bold">оос</span> ирсэн / Япон<span class="text-rose-600 font-bold">оос</span> ирсэн</div>
            </div>
            <div class="p-3 rounded-xl border border-rose-200 bg-rose-50/40 space-y-1">
              <div class="font-bold text-rose-900">гэдэг（〜という）の前の名前は【対格】</div>
              <div class="text-slate-600"><span class="text-rose-600 font-bold">Намайг</span> Болд гэдэг.（私はボルドと申します）</div>
            </div>
            <div class="p-3 rounded-xl border border-rose-200 bg-rose-50/40 space-y-1">
              <div class="font-bold text-rose-900">乗り物・道具・手段は【造格】</div>
              <div class="text-slate-600">онгоц<span class="text-rose-600 font-bold">оор</span> явна（飛行機で行く）/ харандаа<span class="text-rose-600 font-bold">гаар</span></div>
            </div>
            <div class="p-3 rounded-xl border border-rose-200 bg-rose-50/40 space-y-1">
              <div class="font-bold text-rose-900">数詞の後ろの名詞は【必ず単数形】</div>
              <div class="text-slate-600">гурван сандал（◯） / гурван сандал нар（✕）</div>
            </div>
          </div>
        </div>

          <!-- タブ16: 文における月・日の使い方（与位格 -д/-т の要否） -->
          <div id="ref-tab-time-dative" class="ref-subtab-pane hidden space-y-4">
            <div class="bg-gradient-to-r from-blue-600 to-indigo-700 p-4 rounded-2xl text-white shadow-sm space-y-1">
              <div class="font-black text-base flex items-center gap-2">
                <span>📅</span> 文における月・日の使い方（与位格 -д/-т の要否 5大対比）
              </div>
              <p class="text-xs text-blue-100 leading-relaxed">
                モンゴル語の時間・日時表現では、<strong>「与位格（-д/-т）をつける表現」</strong>と<strong>「助詞をつけてはいけない（辞書形のまま置く）表現」</strong>が厳密に決まっています！
              </p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- ⭕ 与位格が【要る】グループ -->
              <div class="bg-white rounded-2xl p-4 border-2 border-emerald-300 shadow-2xs space-y-3">
                <div class="flex items-center justify-between border-b border-emerald-100 pb-2">
                  <div class="font-black text-sm text-emerald-950 flex items-center gap-1.5">
                    <span>⭕</span> 与位格（-д/-т）が【要る】
                  </div>
                  <span class="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 font-bold text-[10px]">助詞必須</span>
                </div>
                <div class="space-y-2.5 text-xs">
                  <div class="p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-200">
                    <div class="font-bold text-emerald-900 mb-0.5">① 〜 сар（月）</div>
                    <div class="text-slate-700">ирэх сар<strong>д</strong>（来月に）、энэ сар<strong>д</strong>（今月に）</div>
                  </div>
                  <div class="p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-200">
                    <div class="font-bold text-emerald-900 mb-0.5">② 〜 долоо хоног（週）</div>
                    <div class="text-slate-700">энэ долоо хоног<strong>т</strong>（今週に）、дараагийн долоо хоног<strong>т</strong>（来週に）</div>
                  </div>
                  <div class="p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-200">
                    <div class="font-bold text-emerald-900 mb-0.5">③ 年月日（数字＋単位）</div>
                    <div class="text-slate-700">2-р сар<strong>д</strong>（2月に）、9-р сарын нэгэн<strong>д</strong>（9月1日に）、2014 он<strong>д</strong>（2014年に）</div>
                  </div>
                  <div class="p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-200">
                    <div class="font-bold text-emerald-900 mb-0.5">④ 〜 гараг（曜日）</div>
                    <div class="text-slate-700">даваа гараг<strong>т</strong>（月曜日に）、баасан гараг<strong>т</strong>（金曜日に）</div>
                  </div>
                  <div class="p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-200">
                    <div class="font-bold text-emerald-900 mb-0.5">⑤ 頻度・割合（〜につき / 〜に1回）</div>
                    <div class="text-slate-700">өдөр<strong>т</strong> 3 удаа（1日に3回）、2 жил<strong>д</strong> нэг удаа（2年に1回）、1 сар<strong>д</strong> 4 удаа（1ヶ月に4回）</div>
                  </div>
                </div>
              </div>

              <!-- ❌ 与位格が【要らない】グループ -->
              <div class="bg-white rounded-2xl p-4 border-2 border-rose-300 shadow-2xs space-y-3">
                <div class="flex items-center justify-between border-b border-rose-100 pb-2">
                  <div class="font-black text-sm text-rose-950 flex items-center gap-1.5">
                    <span>❌</span> 与位格（-д/-т）が【要らない】
                  </div>
                  <span class="px-2 py-0.5 rounded-full bg-rose-100 text-rose-900 font-bold text-[10px]">助詞不要・そのまま置く</span>
                </div>
                <div class="space-y-2.5 text-xs">
                  <div class="p-2.5 rounded-xl bg-rose-50/70 border border-rose-200">
                    <div class="font-bold text-rose-900 mb-0.5">① 〜 жил（年）</div>
                    <div class="text-slate-700 font-mono">ирэх жил（来年）、энэ жил（今年）、тэр жил（あの年）<br><span class="text-rose-600 font-sans text-3xs font-bold">※ ирэх жилд とは言わない！</span></div>
                  </div>
                  <div class="p-2.5 rounded-xl bg-rose-50/70 border border-rose-200">
                    <div class="font-bold text-rose-900 mb-0.5">② 〜 хэддэх өдөр（口語曜日）</div>
                    <div class="text-slate-700 font-mono">нэгдэх өдөр（月曜）、хагас сайн өдөр（土曜）、бүтэн сайн өдөр（日曜）<br><span class="text-rose-600 font-sans text-3xs font-bold">※ -д/-т を付けずにそのまま文中に置く！</span></div>
                  </div>
                  <div class="p-2.5 rounded-xl bg-rose-50/70 border border-rose-200">
                    <div class="font-bold text-rose-900 mb-0.5">③ 日常の時称副詞</div>
                    <div class="text-slate-700">өчигдөр（昨日）、өнөөдөр（今日）、маргааш（明日）、өглөө（朝）、орой（晩）、үдээс өмнө（午前）、үдээс хойш（午後）</div>
                  </div>
                  <div class="p-2.5 rounded-xl bg-rose-50/70 border border-rose-200">
                    <div class="font-bold text-rose-900 mb-0.5">④ 〜 дараа / 〜 өмнө（〜後 / 〜前）</div>
                    <div class="text-slate-700 font-mono">2 жилийн дараа（2年後）、1 сарын өмнө（1ヶ月前）<br><span class="text-rose-600 font-sans text-3xs font-bold">※ дараад / өмнөд とは言わない！</span></div>
                  </div>
                  <div class="p-2.5 rounded-xl bg-rose-50/70 border border-rose-200">
                    <div class="font-bold text-rose-900 mb-0.5">⑤ 期間（どれだけのあいだ）</div>
                    <div class="text-slate-700">2 жил（2年間）、2 сар（2ヶ月間）、2 хоног（2日間）、3 өдөр（3日間）</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- タブ17: 道具名詞(-уур) ＆ 使役(-уул/-лга) vs 受動(-гд) -->
          <div id="ref-tab-derivative-suffixes" class="ref-subtab-pane hidden space-y-4">
            <div class="bg-gradient-to-r from-purple-600 to-indigo-700 p-4 rounded-2xl text-white shadow-sm space-y-1">
              <div class="font-black text-base flex items-center gap-2">
                <span>🛠️</span> 道具名詞(-уур/-үүр) ＆ 使役（-уул/-лга）vs 受動（-гд）の識別ルール
              </div>
              <p class="text-xs text-purple-100 leading-relaxed">
                接尾辞の意味・機能と、学習者がもっとも混同しやすい「使役」と「受動」の決定的な見分け方を完全整理！
              </p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- -уур / -үүр 道具・場所名詞化 -->
              <div class="bg-white rounded-2xl p-4 border border-purple-200 shadow-2xs space-y-3">
                <div class="flex items-center gap-2 border-b border-purple-100 pb-2">
                  <span class="text-xl">🔑</span>
                  <div>
                    <h4 class="font-black text-sm text-purple-950">接尾辞「-уур / -үүр」の本質</h4>
                    <span class="text-[10px] text-purple-600 font-bold">動詞 ➔ 道具・場所の名詞（※受け身ではない！）</span>
                  </div>
                </div>
                <p class="text-xs text-slate-700 leading-relaxed">
                  動詞の語幹の後ろにつき、その動作を行う<strong>「道具」</strong>や<strong>「場所」</strong>を表す名詞を作ります。英語で言う動詞＋<strong>-er</strong>（cook ➔ cooker [調理器具]）と同じ感覚です！
                </p>
                <div class="space-y-2 text-xs">
                  <div class="p-2 rounded-xl bg-purple-50 border border-purple-200">
                    <div class="font-bold text-purple-900">・дэлгэх（広げる）＋ -үүр ＝ дэлгүүр（店・広げる場所）</div>
                  </div>
                  <div class="p-2 rounded-xl bg-purple-50 border border-purple-200">
                    <div class="font-bold text-purple-900">・түлхэх（押す）＋ -үүр ＝ түлхүүр（鍵・押して開ける道具）</div>
                  </div>
                  <div class="p-2 rounded-xl bg-purple-50 border border-purple-200">
                    <div class="font-bold text-purple-900">・хутгах（かき混ぜる）＋ -уур ＝ хутгуур（マドラー・へら）</div>
                  </div>
                </div>
              </div>

              <!-- 使役 vs 受動 の識別神公式 -->
              <div class="bg-white rounded-2xl p-4 border border-indigo-200 shadow-2xs space-y-3">
                <div class="flex items-center gap-2 border-b border-indigo-100 pb-2">
                  <span class="text-xl">⚡</span>
                  <div>
                    <h4 class="font-black text-sm text-indigo-950">使役 vs 受動 1秒判定の神公式</h4>
                    <span class="text-[10px] text-indigo-600 font-bold">文字に含まれる子音に注目！</span>
                  </div>
                </div>
                <div class="space-y-2.5 text-xs">
                  <div class="p-3 rounded-xl bg-blue-50 border border-blue-200 space-y-1">
                    <div class="font-black text-blue-950 flex items-center justify-between">
                      <span>👑 使役（〜させる・〜してもらう）</span>
                      <span class="px-2 py-0.5 rounded-full bg-blue-200 text-blue-900 font-mono font-bold text-[10px]">必ず「л」が入る！</span>
                    </div>
                    <div class="text-slate-700">語尾: <strong>-уул / -үүл</strong> または <strong>-лга / -лгэ</strong></div>
                    <div class="text-slate-600 font-mono text-[11px]">
                      ・явах → яв<strong>уул</strong>ах（行かせる）<br>
                      ・унших → унш<strong>уул</strong>ах（読ませる）<br>
                      ・шийдэх → шийд<strong>үүл</strong>эх（解決させる）
                    </div>
                  </div>

                  <div class="p-3 rounded-xl bg-rose-50 border border-rose-200 space-y-1">
                    <div class="font-black text-rose-950 flex items-center justify-between">
                      <span>🛡️ 受け身（〜される・〜られる）</span>
                      <span class="px-2 py-0.5 rounded-full bg-rose-200 text-rose-900 font-mono font-bold text-[10px]">「г」＋「д」の合体！</span>
                    </div>
                    <div class="text-slate-700">語尾: <strong>-гд</strong>（-гдах / -гдэх / -гдох / -гдөх）</div>
                    <div class="text-slate-600 font-mono text-[11px]">
                      ・шийдэх → шийд<strong>эгд</strong>эх（解決される）<br>
                      ・үзэх → үз<strong>эгд</strong>эх（見られる・姿が見える）<br>
                      ・барих → бари<strong>гд</strong>ах（捕まる・建てられる）
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>


        <!-- 3. 母音調和 -->
        <div class="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
          <div class="flex items-center gap-2">
            <span class="text-lg">⚖️</span>
            <h3 class="text-sm font-bold text-slate-800">母音調和（土台のルール）</h3>
          </div>

          <div class="grid grid-cols-3 gap-2 text-center text-xs">
            <div class="p-3 bg-amber-50 rounded-xl border border-amber-200">
              <div class="font-bold text-amber-900 mb-1">男性母音</div>
              <div class="text-lg font-extrabold text-amber-800 cyrillic-text">а, о, у</div>
              <div class="text-[10px] text-amber-700 mt-1">深い音・口を大きく</div>
            </div>
            <div class="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
              <div class="font-bold text-emerald-900 mb-1">女性母音</div>
              <div class="text-lg font-extrabold text-emerald-800 cyrillic-text">э, ө, ү</div>
              <div class="text-[10px] text-emerald-700 mt-1">浅い音・口をすぼめる</div>
            </div>
            <div class="p-3 bg-slate-100 rounded-xl border border-slate-300">
              <div class="font-bold text-slate-800 mb-1">中性母音</div>
              <div class="text-lg font-extrabold text-slate-800 cyrillic-text">и</div>
              <div class="text-[10px] text-slate-600 mt-1">どちらにも共存可能</div>
            </div>
          </div>

          <p class="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
            語幹に含まれる母音が男性母音であれば、付く語尾も男性母音（-аас, -сан, -на, -аар など）になります。女性母音であれば女性母音の語尾（-ээс, -сэн, -нэ, -ээр など）が接続します。
          </p>
        </div>

        <!-- 🌟 全48文法 完全対比マトリクス大図鑑（添付表完全対応） -->
        <div id="grammar-matrix-section" class="bg-white rounded-2xl p-5 border border-indigo-200 shadow-sm space-y-4">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-indigo-100 pb-3">
            <div class="flex items-center gap-3">
              <span class="text-3xl p-2 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white shadow-xs">📊</span>
              <div>
                <div class="flex items-center gap-2 flex-wrap">
                  <h3 class="text-base sm:text-lg font-black text-slate-900 tracking-wide">
                    全48文法 構造対比マトリクス大図鑑
                  </h3>
                  <span class="text-[11px] bg-indigo-600 text-white px-2.5 py-0.5 rounded-full font-bold shadow-2xs">
                    横断対比・完全版
                  </span>
                </div>
                <p class="text-xs text-slate-500 font-medium mt-0.5">
                  全48文法 × 21項目（音韻・子音変化・接続条件・例外・例文等）を一覧対比。セルをタップして詳細確認できます。
                </p>
              </div>
            </div>

            <!-- 表モード特訓ボタン -->
            <button type="button" id="btn-ref-start-matrix-test" class="px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl text-xs sm:text-sm font-black shadow-xs hover:shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 shrink-0 cursor-pointer">
              <span>📊</span> 表モードでテストする（全152問） →
            </button>
          </div>

          <!-- フィルターバー（属性カテゴリ ＆ 文法番号範囲） -->
          <div class="flex flex-wrap items-center justify-between gap-2.5 pt-1">
            <!-- 属性カテゴリタブ -->
            <div class="flex flex-wrap gap-1.5 text-xs">
              <button type="button" class="btn-matrix-cat-filter px-3 py-1.5 rounded-lg font-black bg-indigo-600 text-white shadow-2xs cursor-pointer transition-all" data-cat="all">
                すべて表示
              </button>
              <button type="button" class="btn-matrix-cat-filter px-3 py-1.5 rounded-lg font-bold bg-slate-100 text-slate-700 hover:bg-indigo-50 cursor-pointer transition-all" data-cat="phonetics">
                ⚡ 音韻・子音規則
              </button>
              <button type="button" class="btn-matrix-cat-filter px-3 py-1.5 rounded-lg font-bold bg-slate-100 text-slate-700 hover:bg-indigo-50 cursor-pointer transition-all" data-cat="syntax">
                👑 接続条件・格支配
              </button>
              <button type="button" class="btn-matrix-cat-filter px-3 py-1.5 rounded-lg font-bold bg-slate-100 text-slate-700 hover:bg-indigo-50 cursor-pointer transition-all" data-cat="exceptions">
                ⚠️ 例外・隠れ文字
              </button>
              <button type="button" class="btn-matrix-cat-filter px-3 py-1.5 rounded-lg font-bold bg-slate-100 text-slate-700 hover:bg-indigo-50 cursor-pointer transition-all" data-cat="basic">
                💡 意味・子供向け・例文
              </button>
            </div>

            <!-- 文法範囲選択 -->
            <div class="flex items-center gap-1.5 text-xs">
              <span class="text-slate-500 font-bold text-[11px]">文法範囲:</span>
              <select id="select-matrix-range" class="text-xs font-bold px-2.5 py-1.5 border border-slate-200 rounded-lg bg-slate-50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <option value="all">全48文法（No.1〜48）</option>
                <option value="range1">基礎・格助詞（No.1〜15）</option>
                <option value="range2">動詞の時制・活用（No.16〜30）</option>
                <option value="range3">応用構文・複文（No.31〜48）</option>
              </select>
            </div>
          </div>

          <!-- マトリクス大表コンテナ（横スクロール対応・Stickyヘッダー＆列） -->
          <div class="border border-slate-200 rounded-xl overflow-hidden shadow-inner bg-slate-50/50">
            <div class="overflow-x-auto max-h-[620px] scrollbar-thin scrollbar-thumb-indigo-200">
              <table id="table-grammar-matrix" class="w-full text-xs text-left border-collapse min-w-[3200px]">
                <thead class="bg-indigo-900 text-white sticky top-0 z-20 shadow-xs">
                  <tr>
                    <th class="p-3 sticky left-0 z-30 bg-indigo-950 min-w-[200px] border-r border-indigo-800 font-black text-center shadow-xs">
                      項目 ＼ 文法
                    </th>
                    ${(GRAMMAR_MATRIX_COLS || []).map(col => `
                      <th class="matrix-col-header p-3 border-r border-indigo-800 text-center font-bold min-w-[160px]" data-num="${col.num}">
                        <div class="text-[11px] text-amber-300 font-mono">No.${col.num}</div>
                        <div class="font-extrabold text-xs truncate" title="${col.title}">${col.title}</div>
                        <div class="text-[10px] text-indigo-200 truncate cyrillic-text font-normal">${col.mnTitle || ''}</div>
                      </th>
                    `).join('')}
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-200 bg-white">
                  ${(GRAMMAR_MATRIX_ROWS || []).map(row => `
                    <tr class="matrix-row hover:bg-indigo-50/30 transition-colors" data-cat="${row.category}">
                      <td class="p-2.5 sticky left-0 z-10 bg-slate-50/95 border-r border-slate-200 font-bold text-slate-800 shadow-2xs flex items-center gap-1.5 min-w-[200px]">
                        <span>${row.icon || '📌'}</span>
                        <span class="truncate" title="${row.label}">${row.label}</span>
                      </td>
                      ${(GRAMMAR_MATRIX_DATA || []).map(g => {
                        const cellVal = (g.attributes && g.attributes[row.key]) ? g.attributes[row.key] : '×';
                        const isCross = cellVal === '×';
                        return `
                          <td class="matrix-cell p-2.5 border-r border-slate-100 text-slate-700 min-w-[160px] align-top transition-colors cursor-pointer hover:bg-indigo-100/50 ${isCross ? 'text-slate-300 text-center bg-slate-50/40' : ''}" data-num="${g.num}" data-title="${g.title}" data-row="${row.label}" data-val="${cellVal.replace(/"/g, '&quot;')}">
                            <div class="line-clamp-3 text-[11px] leading-relaxed cyrillic-text" title="${cellVal.replace(/"/g, '&quot;')}">
                              ${cellVal}
                            </div>
                          </td>
                        `;
                      }).join('')}
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>

          <div class="text-[11px] text-slate-400 flex items-center justify-between">
            <span>💡 セルをクリックすると、その項目の完全な解説と例文がポップアップ表示されます。</span>
            <span>左右にスクロールして全48文法を閲覧できます ➔</span>
          </div>
        </div>

        <!-- マトリクスセル詳細モーダル用コンテナ -->
        <div id="matrix-cell-modal" class="hidden fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div class="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 relative">
            <button type="button" id="btn-close-matrix-modal" class="absolute top-4 right-4 text-slate-400 hover:text-slate-700 text-lg font-bold cursor-pointer">✕</button>
            <div class="flex items-center gap-2">
              <span class="text-2xl" id="modal-matrix-icon">📌</span>
              <div>
                <span class="text-xs font-bold text-indigo-600 block" id="modal-matrix-gnum">No.1 文法名</span>
                <h4 class="text-base font-black text-slate-900" id="modal-matrix-rowname">項目名</h4>
              </div>
            </div>
            <div class="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 leading-relaxed font-medium whitespace-pre-wrap cyrillic-text" id="modal-matrix-content">
              内容
            </div>
            <div class="flex items-center justify-between pt-2">
              <button type="button" id="btn-modal-speak" class="px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold transition-all flex items-center gap-1 cursor-pointer">
                <span>🔊</span> 発音を聴く
              </button>
              <button type="button" id="btn-modal-close-action" class="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 cursor-pointer">
                閉じる
              </button>
            </div>
          </div>
        </div>

        <!-- 4. 全48文法項目 完全構造解説カード（検索＆アコーディオン付き） -->
        <div class="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div class="flex items-center gap-2">
              <span class="text-lg">📚</span>
              <div>
                <h3 class="text-sm font-bold text-slate-800">全48文法項目 完全構造解説ハンドブック</h3>
                <p class="text-xs text-slate-500">19の解説属性を網羅。タップして開閉できます。</p>
              </div>
            </div>

            <!-- 検索フィルターバー -->
            <div class="relative w-full sm:w-64">
              <input type="text" id="ref-search-input" placeholder="文法名・キーワード検索..." class="w-full text-xs px-3 py-2 pl-8 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50">
              <span class="absolute left-2.5 top-2 text-slate-400 text-xs">🔍</span>
            </div>
          </div>

          <!-- 文法カード一覧コンテナ -->
          <div id="grammar-cards-container" class="space-y-3">
            ${grammarList.map((g, idx) => `
              <div class="grammar-card border border-slate-200 rounded-xl overflow-hidden transition-all bg-white" data-title="${g.title}" data-num="${g.num}">
                <button type="button" class="grammar-card-header w-full p-3.5 text-left flex items-center justify-between bg-slate-50/80 hover:bg-slate-100 transition-colors">
                  <div class="flex items-center gap-2.5">
                    <span class="w-6 h-6 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                      ${g.num}
                    </span>
                    <span class="font-bold text-xs sm:text-sm text-slate-800 cyrillic-text">
                      ${g.title}
                    </span>
                  </div>
                  <span class="grammar-card-arrow text-slate-400 text-xs transition-transform transform">▼</span>
                </button>

                <div class="grammar-card-body hidden p-4 space-y-3 text-xs border-t border-slate-100 bg-white">
                  <!-- 意味とイメージ -->
                  <div class="p-3 bg-emerald-50/60 rounded-xl border border-emerald-100 space-y-1">
                    <div class="font-bold text-emerald-900">💡 意味とイメージ</div>
                    <div class="text-slate-700">${g.meaning || '（解説準備中）'}</div>
                    ${g.meaningImage ? `<div class="text-emerald-700 font-semibold text-[11px]">イメージ: ${g.meaningImage}</div>` : ''}
                  </div>

                  <!-- 接続条件テーブル -->
                  ${g.rules ? `
                    <div class="border border-slate-200 rounded-lg overflow-x-auto">
                      <table class="w-full text-[11px] text-left">
                        <tbody class="divide-y divide-slate-100">
                          <tr>
                            <td class="p-2 font-bold bg-slate-50 w-28 text-slate-600">動詞語幹接続</td>
                            <td class="p-2 text-slate-700">${g.rules.verbStem || '関係なし'}</td>
                          </tr>
                          <tr>
                            <td class="p-2 font-bold bg-slate-50 text-slate-600">動詞辞書形接続</td>
                            <td class="p-2 text-slate-700">${g.rules.verbDict || '関係なし'}</td>
                          </tr>
                          <tr>
                            <td class="p-2 font-bold bg-slate-50 text-slate-600">名詞語幹接続</td>
                            <td class="p-2 text-slate-700">${g.rules.nounStem || '関係なし'}</td>
                          </tr>
                          <tr>
                            <td class="p-2 font-bold bg-slate-50 text-slate-600">格支配</td>
                            <td class="p-2 text-slate-700 font-semibold text-rose-700">${g.rules.caseRule || 'なし'}</td>
                          </tr>
                          <tr>
                            <td class="p-2 font-bold bg-slate-50 text-slate-600">語尾・助詞</td>
                            <td class="p-2 text-slate-800 font-bold cyrillic-text">${g.rules.endingTypes || '-'}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  ` : ''}

                  <!-- 5歳児向け説明 -->
                  ${g.forKids ? `
                    <div class="p-2.5 rounded-xl bg-sky-50 border border-sky-100 text-sky-950">
                      <span class="font-bold text-sky-800">👶 5歳でもわかる説明: </span>
                      <span>${g.forKids}</span>
                    </div>
                  ` : ''}

                  <!-- 注意点 -->
                  ${g.notes ? `
                    <div class="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900">
                      <span class="font-bold text-amber-800">📌 要注意ポイント: </span>
                      <span>${g.notes}</span>
                    </div>
                  ` : ''}

                  <!-- 例文（肯定・否定・疑問） -->
                  ${g.examples ? `
                    <div class="space-y-1.5 pt-1">
                      <div class="font-bold text-slate-700">💬 例文集:</div>
                      ${g.examples.affirmative && g.examples.affirmative.mn ? `
                        <div class="p-2 rounded-lg bg-slate-50 border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                          <span class="font-bold text-emerald-800 cyrillic-text">[肯定] ${g.examples.affirmative.mn}</span>
                          <span class="text-slate-500 text-[11px]">${g.examples.affirmative.ja}</span>
                        </div>
                      ` : ''}
                      ${g.examples.negative && g.examples.negative.mn ? `
                        <div class="p-2 rounded-lg bg-slate-50 border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                          <span class="font-bold text-rose-800 cyrillic-text">[否定] ${g.examples.negative.mn}</span>
                          <span class="text-slate-500 text-[11px]">${g.examples.negative.ja}</span>
                        </div>
                      ` : ''}
                      ${g.examples.interrogative && g.examples.interrogative.mn ? `
                        <div class="p-2 rounded-lg bg-slate-50 border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                          <span class="font-bold text-sky-800 cyrillic-text">[疑問] ${g.examples.interrogative.mn}</span>
                          <span class="text-slate-500 text-[11px]">${g.examples.interrogative.ja}</span>
                        </div>
                      ` : ''}
                    </div>
                  ` : ''}
                
                  <!-- この項目の穴埋めテストへ直接挑戦するボタン -->
                  <div class="pt-2 border-t border-slate-100 flex items-center justify-end">
                    <button type="button" class="btn-start-single-cloze px-3.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 font-black text-xs flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer shadow-2xs" data-num="${g.num}" data-title="${g.title}">
                      <span>🎯</span> No.${g.num} の穴埋め問題を解く（選択式） →
                    </button>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

      </div>
    `;

    // 既存イベントリスナーの登録
// イベントリスナー設定
    const homeBtn = container.querySelector('#btn-back-home');
    if (homeBtn) {
      homeBtn.addEventListener('click', () => {
        if (onNavigate) onNavigate('home');
      });
    }

    // アコーディオン開閉
    const headers = container.querySelectorAll('.grammar-card-header');
    headers.forEach(h => {
      h.addEventListener('click', () => {
        const body = h.nextElementSibling;
        const arrow = h.querySelector('.grammar-card-arrow');
        if (body.classList.contains('hidden')) {
          body.classList.remove('hidden');
          arrow.style.transform = 'rotate(180deg)';
        } else {
          body.classList.add('hidden');
          arrow.style.transform = 'rotate(0deg)';
        }
      });
    });

    // 特化テスト開始ボタン
    const startHiddenTestBtn = container.querySelector('#btn-ref-start-hidden-test');
    if (startHiddenTestBtn) {
      startHiddenTestBtn.addEventListener('click', () => {
        if (typeof DeclensionTestComponent !== 'undefined' && DeclensionTestComponent.startWithCategory) {
          DeclensionTestComponent.startWithCategory('hidden_n_g');
        }
        if (onNavigate) onNavigate('declension_test');
      });
    }

    // 指示詞・場所・時間マスター特訓開始ボタン
    const startSpatialMasterBtn = container.querySelector('#btn-ref-start-spatial-master');
    if (startSpatialMasterBtn) {
      startSpatialMasterBtn.addEventListener('click', () => {
        if (onNavigate) onNavigate('spatial_postposition_master');
      });
    }

    // 例外リファレンスサブタブ切り替え
    const subtabs = container.querySelectorAll('.btn-ref-subtab');
    const panes = container.querySelectorAll('.ref-subtab-pane');
    subtabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const targetId = tab.dataset.tab;
        subtabs.forEach(t => {
          t.className = 'btn-ref-subtab px-3.5 py-1.5 rounded-lg font-bold transition-all bg-white border border-slate-200 text-slate-700 hover:bg-indigo-50';
        });
        tab.className = 'btn-ref-subtab px-3.5 py-1.5 rounded-lg font-black transition-all bg-indigo-600 text-white shadow-2xs';

        panes.forEach(p => {
          if (p.id === targetId) {
            p.classList.remove('hidden');
          } else {
            p.classList.add('hidden');
          }
        });
      });
    });

    // 発音再生ボタン
    container.querySelectorAll('.btn-ref-speak').forEach(btn => {
      btn.addEventListener('click', () => {
        const word = btn.dataset.word;
        if (word) SpeechService.speak(word);
      });
    });

    // リアルタイム検索
    const searchInput = container.querySelector('#ref-search-input');
    const cards = container.querySelectorAll('.grammar-card');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        cards.forEach(card => {
          const title = (card.dataset.title || '').toLowerCase();
          const num = card.dataset.num || '';
          if (!query || title.includes(query) || num.includes(query)) {
            card.style.display = '';
          } else {
            card.style.display = 'none';
          }
        });
      });
    }

    // 📊 マトリクス表モードテスト開始ボタン（表形式インタラクティブ回答モード）
    const startMatrixTestBtn = container.querySelector('#btn-ref-start-matrix-test');
    if (startMatrixTestBtn) {
      startMatrixTestBtn.addEventListener('click', () => {
        this.startTableMode('choice', 'major', 'range1');
      });
    }

    // 属性カテゴリフィルター
    const catFilters = container.querySelectorAll('.btn-matrix-cat-filter');
    const matrixRows = container.querySelectorAll('.matrix-row');
    catFilters.forEach(btn => {
      btn.addEventListener('click', () => {
        const cat = btn.dataset.cat;
        catFilters.forEach(b => {
          b.className = 'btn-matrix-cat-filter px-3 py-1.5 rounded-lg font-bold bg-slate-100 text-slate-700 hover:bg-indigo-50 cursor-pointer transition-all';
        });
        btn.className = 'btn-matrix-cat-filter px-3 py-1.5 rounded-lg font-black bg-indigo-600 text-white shadow-2xs cursor-pointer transition-all';

        matrixRows.forEach(row => {
          const rowCat = row.dataset.cat;
          if (cat === 'all' || rowCat === cat) {
            row.style.display = '';
          } else {
            row.style.display = 'none';
          }
        });
      });
    });

    // 文法範囲セレクト
    const rangeSelect = container.querySelector('#select-matrix-range');
    const colHeaders = container.querySelectorAll('.matrix-col-header');
    const allCells = container.querySelectorAll('.matrix-cell');
    if (rangeSelect) {
      rangeSelect.addEventListener('change', (e) => {
        const val = e.target.value;
        let minNum = 1, maxNum = 48;
        if (val === 'range1') { minNum = 1; maxNum = 15; }
        else if (val === 'range2') { minNum = 16; maxNum = 30; }
        else if (val === 'range3') { minNum = 31; maxNum = 48; }

        colHeaders.forEach(th => {
          const num = parseInt(th.dataset.num, 10);
          th.style.display = (num >= minNum && num <= maxNum) ? '' : 'none';
        });

        allCells.forEach(td => {
          const num = parseInt(td.dataset.num, 10);
          td.style.display = (num >= minNum && num <= maxNum) ? '' : 'none';
        });
      });
    }

    // セルタップによる詳細モーダル表示
    const modal = container.querySelector('#matrix-cell-modal');
    const modalGnum = container.querySelector('#modal-matrix-gnum');
    const modalRow = container.querySelector('#modal-matrix-rowname');
    const modalContent = container.querySelector('#modal-matrix-content');
    const modalSpeak = container.querySelector('#btn-modal-speak');
    let currentCellText = '';

    allCells.forEach(cell => {
      cell.addEventListener('click', () => {
        const val = cell.dataset.val;
        if (!val || val === '×') return;
        const gnum = cell.dataset.num;
        const gtitle = cell.dataset.title;
        const rowname = cell.dataset.row;
        currentCellText = val;

        if (modalGnum) modalGnum.textContent = `No.${gnum} ${gtitle}`;
        if (modalRow) modalRow.textContent = rowname;
        if (modalContent) modalContent.textContent = val;
        if (modal) modal.classList.remove('hidden');
      });
    });

    const closeModal = () => {
      if (modal) modal.classList.add('hidden');
    };
    const closeBtn = container.querySelector('#btn-close-matrix-modal');
    const closeActionBtn = container.querySelector('#btn-modal-close-action');
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (closeActionBtn) closeActionBtn.addEventListener('click', closeModal);
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
      });
    }

    if (modalSpeak) {
      modalSpeak.addEventListener('click', () => {
        if (currentCellText) {
          const cyrillicMatch = currentCellText.match(/[А-Яа-яЁёӨөҮү]+/);
          if (cyrillicMatch) {
            SpeechService.speak(cyrillicMatch[0]);
          } else {
            SpeechService.speak(currentCellText);
          }
        }
      });
    }

    // 穴埋め特訓モードの起動イベント
    const startAllBtn = container.querySelector('#btn-start-cloze-all');
    if (startAllBtn) {
      startAllBtn.addEventListener('click', () => {
        this.startClozeTest('all');
      });
    }

    const startTableHeroBtn = container.querySelector('#btn-start-table-hero');
    if (startTableHeroBtn) {
      startTableHeroBtn.addEventListener('click', () => {
        this.startTableMode('choice', 'major', 'range1');
      });
    }

    container.querySelectorAll('.btn-cloze-quick-cat').forEach(btn => {
      btn.addEventListener('click', () => {
        const cat = btn.dataset.cat;
        this.startClozeTest(cat);
      });
    });

    container.querySelectorAll('.btn-start-single-cloze').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const num = parseInt(btn.dataset.num, 10);
        const title = btn.dataset.title;
        this.startClozeTest(num, title);
      });
    });
  }

  // ==========================================
  // 2. 穴埋めモード 設定画面
  // ==========================================
  static renderClozeSettings() {
    this.cleanupKeyHandler();
    const allQuizzes = (typeof grammarClozeQuizzes !== 'undefined' && Array.isArray(grammarClozeQuizzes))
      ? grammarClozeQuizzes
      : (window.grammarClozeQuizzes || []);

    const isSpecific = this.state.selectedCategory === 'specific' && this.state.targetGrammarNum;
    const catLabel = isSpecific
      ? `No.${this.state.targetGrammarNum} ${this.state.targetGrammarTitle || ''}`
      : (GRAMMAR_CLOZE_CATEGORIES.find(c => c.id === this.state.selectedCategory)?.label || '全48文法項目（ランダム総合演習）');

    // 該当する問題数を計算
    let matchedCount = 0;
    if (isSpecific) {
      matchedCount = allQuizzes.filter(q => q.grammarNum === this.state.targetGrammarNum).length;
    } else if (this.state.selectedCategory === 'all') {
      matchedCount = allQuizzes.length;
    } else {
      matchedCount = allQuizzes.filter(q => q.category === this.state.selectedCategory).length;
    }

    this.container.innerHTML = `
      <div class="animate-fade-in max-w-2xl mx-auto px-4 py-5 space-y-6">
        <!-- 上部ナビゲーション -->
        <div class="flex items-center justify-between border-b border-slate-200 pb-3">
          <div class="flex items-center gap-2">
            <span class="text-2xl">🎯</span>
            <div>
              <h2 class="text-lg font-black text-slate-800">文法穴埋めテスト（選択式）</h2>
              <p class="text-xs text-slate-500">文法ハンドブック完全連動・選択式クイズ</p>
            </div>
          </div>
          <button type="button" id="btn-cloze-back-guide" class="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1">
            <span>📖</span> 文法ハンドブックに戻る
          </button>
        </div>

        <!-- カテゴリ選択カード -->
        <div class="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
          <div class="flex items-center justify-between">
            <h3 class="text-sm font-black text-slate-800 flex items-center gap-2">
              <span>📚</span> 出題カテゴリ・範囲
            </h3>
            <span class="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              ${matchedCount} 問利用可能
            </span>
          </div>

          ${isSpecific ? `
            <div class="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-between">
              <div>
                <span class="text-xs font-black text-emerald-900 block">📌 単一文法特化モード</span>
                <span class="text-sm font-bold text-emerald-800">${catLabel}</span>
              </div>
              <button type="button" id="btn-switch-to-all-cats" class="text-xs text-emerald-700 underline font-bold hover:text-emerald-900">
                全カテゴリ選択へ戻す
              </button>
            </div>
          ` : `
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              ${GRAMMAR_CLOZE_CATEGORIES.map(cat => `
                <button type="button" class="btn-select-cloze-cat p-3 rounded-xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between ${this.state.selectedCategory === cat.id ? 'border-emerald-600 bg-emerald-50/80 shadow-xs ring-2 ring-emerald-500/20' : 'border-slate-200 hover:border-slate-300 bg-white'}" data-id="${cat.id}">
                  <div class="font-bold text-xs sm:text-sm text-slate-800">${cat.label}</div>
                  <div class="text-[11px] text-slate-500 mt-1">${cat.desc || ''}</div>
                </button>
              `).join('')}
            </div>
          `}
        </div>

        <!-- 出題数選択 -->
        <div class="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
          <h3 class="text-sm font-black text-slate-800 flex items-center gap-2">
            <span>🔢</span> 出題数を選択
          </h3>
          <div class="flex flex-wrap items-center gap-2">
            ${[5, 10, 20, 50, 'all'].map(cnt => `
              <button type="button" class="btn-cloze-count px-4 py-2 rounded-xl text-xs font-black border transition-all cursor-pointer ${this.state.questionCount === cnt ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs' : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'}" data-count="${cnt}">
                ${cnt === 'all' ? '全問' : cnt + '問'}
              </button>
            `).join('')}
            
            <!-- 手入力ボックス -->
            <div class="flex items-center gap-1.5 ml-auto">
              <span class="text-xs font-bold text-slate-500">指定:</span>
              <input type="number" id="input-cloze-custom-count" min="1" max="${matchedCount || 100}" value="${typeof this.state.questionCount === 'number' ? this.state.questionCount : 10}" class="w-16 px-2 py-1.5 text-xs text-center font-bold border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white">
              <span class="text-xs text-slate-500">問</span>
            </div>
          </div>
        </div>

        <!-- テスト開始ボタン -->
        <div class="pt-2">
          <button type="button" id="btn-start-cloze-quiz-now" class="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 active:scale-98 text-white rounded-xl text-sm font-black shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer">
            <span>🎯</span> 穴埋めテストを開始する（選択式） →
          </button>
        </div>
      </div>
    `;

    // イベントリスナー
    const backBtn = container.querySelector('#btn-cloze-back-guide');
    if (backBtn) {
      backBtn.addEventListener('click', () => {
        this.state.view = 'guide';
        this.renderGuide();
      });
    }

    const switchAllBtn = container.querySelector('#btn-switch-to-all-cats');
    if (switchAllBtn) {
      switchAllBtn.addEventListener('click', () => {
        this.state.selectedCategory = 'all';
        this.state.targetGrammarNum = null;
        this.renderClozeSettings();
      });
    }

    container.querySelectorAll('.btn-select-cloze-cat').forEach(btn => {
      btn.addEventListener('click', () => {
        this.state.selectedCategory = btn.dataset.id;
        this.renderClozeSettings();
      });
    });

    container.querySelectorAll('.btn-cloze-count').forEach(btn => {
      btn.addEventListener('click', () => {
        const c = btn.dataset.count;
        this.state.questionCount = c === 'all' ? 'all' : parseInt(c, 10);
        this.renderClozeSettings();
      });
    });

    const customInput = container.querySelector('#input-cloze-custom-count');
    if (customInput) {
      customInput.addEventListener('change', (e) => {
        const val = parseInt(e.target.value, 10);
        if (val > 0) {
          this.state.questionCount = val;
          container.querySelectorAll('.btn-cloze-count').forEach(b => {
            b.className = 'btn-cloze-count px-4 py-2 rounded-xl text-xs font-black border transition-all cursor-pointer bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100';
          });
        }
      });
    }

    const startBtn = container.querySelector('#btn-start-cloze-quiz-now');
    if (startBtn) {
      startBtn.addEventListener('click', () => {
        this.prepareClozeTesting();
      });
    }
  }

  // ==========================================
  // テスト開始前準備
  // ==========================================
  static prepareClozeTesting() {
    const allQuizzes = (typeof grammarClozeQuizzes !== 'undefined' && Array.isArray(grammarClozeQuizzes))
      ? grammarClozeQuizzes
      : (window.grammarClozeQuizzes || []);

    let pool = [];
    if (this.state.selectedCategory === 'specific' && this.state.targetGrammarNum) {
      pool = allQuizzes.filter(q => q.grammarNum === this.state.targetGrammarNum);
    } else if (this.state.selectedCategory === 'all') {
      pool = [...allQuizzes];
    } else {
      pool = allQuizzes.filter(q => q.category === this.state.selectedCategory);
    }

    if (!pool.length) pool = [...allQuizzes];

    pool = shuffleArray(pool);
    const count = this.state.questionCount === 'all' ? pool.length : Math.min(pool.length, this.state.questionCount || 10);
    this.state.quizzes = pool.slice(0, count);
    this.state.currentIndex = 0;
    this.state.results = [];
    this.state.combo = 0;
    this.state.view = 'cloze_testing';

    this.renderClozeTesting();
  }

  // ==========================================
  // 3. 穴埋めモード テスト実行画面
  // ==========================================
  static renderClozeTesting() {
    this.cleanupKeyHandler();
    const q = this.state.quizzes[this.state.currentIndex];
    this.state.currentQuiz = q;
    this.state.hasAnswered = false;
    this.state.selectedOption = null;

    const total = this.state.quizzes.length;
    const current = this.state.currentIndex + 1;
    const progressPct = Math.round((current / total) * 100);

    // 穴埋め部分（_____）を目立たせるHTML
    const questionHighlightedHTML = q.question.replace(/_(2,)/g, '<span class="inline-block px-3 py-0.5 mx-1 bg-amber-100 text-amber-900 border-b-4 border-amber-500 font-extrabold rounded-md shadow-2xs">______</span>');

    this.container.innerHTML = `
      <div class="animate-fade-in max-w-2xl mx-auto px-4 py-4 space-y-4">
        <!-- 上部バー（進捗・文法項目バッジ・コンボ・中断ボタン） -->
        <div class="flex items-center justify-between text-xs">
          <div class="flex items-center gap-2">
            <span class="px-2.5 py-0.5 rounded-full bg-emerald-600 text-white font-black text-[11px] shadow-2xs">
              問 ${current} / ${total}
            </span>
            <span class="text-xs font-bold text-slate-600 hidden sm:inline-block">
              📖 ${q.grammarRef || q.grammarTitle}
            </span>
          </div>

          <div class="flex items-center gap-2">
            ${this.state.combo >= 2 ? `
              <span class="px-2.5 py-0.5 rounded-full bg-amber-500 text-white font-black text-[11px] animate-pulse shadow-xs">
                🔥 ${this.state.combo}連続正解!
              </span>
            ` : ''}
            <button type="button" id="btn-cloze-abort" class="text-slate-400 hover:text-rose-600 text-xs font-bold transition-colors cursor-pointer">
              ✕ 中断
            </button>
          </div>
        </div>

        <!-- プログレスバー -->
        <div class="w-full bg-slate-100 rounded-full h-2 overflow-hidden shadow-inner">
          <div class="bg-gradient-to-r from-emerald-500 to-teal-500 h-full rounded-full transition-all duration-300" style="width: ${progressPct}%"></div>
        </div>

        <!-- 問題カード -->
        <div class="bg-white rounded-2xl p-6 border border-slate-200 shadow-md space-y-4 text-center">
          <div class="inline-block px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
            空欄に当てはまる最も適切な選択肢を選んでください
          </div>

          <!-- モンゴル語問題文 -->
          <div class="text-xl sm:text-2xl font-black text-slate-900 cyrillic-text leading-relaxed tracking-wide pt-2">
            ${questionHighlightedHTML}
          </div>

          <!-- 日本語訳ヒント（押すまで隠す） -->
          <div class="pt-1">
            <button type="button" id="btn-toggle-cloze-hint" class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-600 transition-all cursor-pointer shadow-2xs active:scale-95">
              <span>💡</span>
              <span id="cloze-hint-toggle-text">${(this.state.isClozeHintRevealed || this.state.hasAnswered) ? 'ヒント（日本語訳）を閉じる ▲' : 'ヒントを見る ▼'}</span>
            </button>
            <div id="cloze-hint-container" class="${this.state.isClozeHintRevealed ? '' : 'hidden'} mt-2 text-sm font-bold text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100 animate-fade-in">
              ${q.questionJa}
            </div>
          </div>

          <!-- 単語タップ辞書ヒント -->
          <div class="text-[11px] text-slate-400 flex items-center justify-center gap-1">
            <span>💡</span> 単語をタップすると和訳を確認できます
          </div>
        </div>

        <!-- 4択選択肢ボタン -->
        <div id="cloze-options-container" class="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          ${q.options.map((opt, idx) => `
            <button type="button" class="btn-cloze-option w-full p-4 rounded-xl border-2 border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/50 bg-white text-slate-900 font-black text-base sm:text-lg cyrillic-text transition-all active:scale-98 shadow-xs flex items-center justify-between cursor-pointer group" data-option="${opt}">
              <span class="flex items-center gap-2">
                <span class="w-6 h-6 rounded-full bg-slate-100 group-hover:bg-emerald-600 group-hover:text-white text-slate-600 font-bold text-xs flex items-center justify-center transition-colors">
                  ${idx + 1}
                </span>
                <span class="opt-text">${opt}</span>
              </span>
              <span class="text-xs text-slate-400 group-hover:text-emerald-600 transition-colors">➔</span>
            </button>
          `).join('')}
        </div>

        <!-- 回答後解説コンテナ（回答後に即座に展開） -->
        <div id="cloze-explanation-container" class="hidden animate-fade-in space-y-4"></div>
      </div>
    `;

    // 単語タップ辞書イベント
    container.querySelectorAll('.cyrillic-text').forEach(el => {
      const words = el.innerText.split(/\s+/);
      // 単語タップ可能にするため内部処理
      el.addEventListener('click', (e) => {
        const clickedWord = window.getSelection().toString().trim();
        if (clickedWord) {
          const info = findWordInDictionary(clickedWord);
          if (info) {
            showUniversalWordModal({ wordInfo: info, onNavigate: this.onNavigate });
          }
        }
      });
    });

    // 中断ボタン
    const abortBtn = container.querySelector('#btn-cloze-abort');
    if (abortBtn) {
      abortBtn.addEventListener('click', () => {
        if (confirm('穴埋めテストを中断して文法まとめに戻りますか？')) {
          this.state.view = 'guide';
          this.renderGuide();
        }
      });
    }

    // 選択肢ボタンイベント
    container.querySelectorAll('.btn-cloze-option').forEach(btn => {
      btn.addEventListener('click', () => {
        if (this.state.hasAnswered) return;
        const opt = btn.dataset.option;
        this.handleClozeAnswer(opt);
      });
    });

    // キーボードショートカット (1-4)
    this.activeKeyHandler = (e) => {
      if (this.state.hasAnswered) {
        if (e.key === 'Enter') {
          const nextBtn = document.getElementById('btn-cloze-next');
          if (nextBtn) nextBtn.click();
        }
        return;
      }
      if (['1', '2', '3', '4'].includes(e.key)) {
        const idx = parseInt(e.key, 10) - 1;
        const btns = container.querySelectorAll('.btn-cloze-option');
        if (btns[idx]) btns[idx].click();
      }
    };
    window.addEventListener('keydown', this.activeKeyHandler);
  }

  // ==========================================
  // 回答処理 ＆ 詳しい解説の即時表示
  // ==========================================
  static handleClozeAnswer(chosenOption) {
    this.state.hasAnswered = true;
    this.state.selectedOption = chosenOption;
    const q = this.state.currentQuiz;
    const isCorrect = (chosenOption === q.answer);
    this.state.isCorrect = isCorrect;

    if (isCorrect) {
      this.state.combo += 1;
      GamificationService.addXP(10);
      try { SoundEffects.play('correct'); } catch (e) {}
    } else {
      this.state.combo = 0;
      try { SoundEffects.play('incorrect'); } catch (e) {}
      // 要復習・忘却曲線へ自動記録
      StorageService.recordMistake({
        type: 'grammar_cloze',
        question: q.question,
        questionJa: q.questionJa,
        userAnswer: chosenOption,
        correctAnswer: q.answer,
        grammarNum: q.grammarNum,
        grammarTitle: q.grammarTitle,
        explanation: q.explanation
      });
    }

    this.state.results.push({
      quiz: q,
      chosenOption,
      isCorrect
    });

    // 選択肢ボタンのスタイル更新
    const optionBtns = container.querySelectorAll('.btn-cloze-option');
    optionBtns.forEach(btn => {
      const opt = btn.dataset.option;
      btn.classList.remove('hover:border-emerald-500', 'hover:bg-emerald-50/50', 'active:scale-98');
      if (opt === q.answer) {
        btn.className = 'btn-cloze-option w-full p-4 rounded-xl border-2 border-emerald-500 bg-emerald-50 text-emerald-950 font-black text-base sm:text-lg cyrillic-text shadow-sm flex items-center justify-between';
      } else if (opt === chosenOption && !isCorrect) {
        btn.className = 'btn-cloze-option w-full p-4 rounded-xl border-2 border-rose-400 bg-rose-50 text-rose-950 font-black text-base sm:text-lg cyrillic-text shadow-xs flex items-center justify-between';
      } else {
        btn.className = 'btn-cloze-option w-full p-4 rounded-xl border-2 border-slate-100 bg-slate-50/60 text-slate-400 font-bold text-base sm:text-lg cyrillic-text flex items-center justify-between opacity-60';
      }
    });

    // 詳しい解説カードの展開
    const expContainer = container.querySelector('#cloze-explanation-container');
    if (expContainer) {
      expContainer.classList.remove('hidden');
      const isLast = (this.state.currentIndex + 1 >= this.state.quizzes.length);

      expContainer.innerHTML = `
        <div class="rounded-2xl p-5 border-2 ${isCorrect ? 'border-emerald-400 bg-emerald-50/70' : 'border-amber-400 bg-amber-50/70'} shadow-md space-y-4">
          <!-- 正誤判定バッジ ＆ 発音ボタン -->
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="text-2xl">${isCorrect ? '🎉' : '⚠️'}</span>
              <div>
                <span class="text-sm font-black ${isCorrect ? 'text-emerald-900' : 'text-amber-900'}">
                  ${isCorrect ? '正解！ та зөв хариуллаа' : 'おしい！ зөв хариулт биш байна'}
                </span>
                <span class="text-xs text-slate-600 block">
                  正解: <strong class="text-slate-900 text-sm cyrillic-text font-black">${q.answer}</strong> ${q.pronunciation ? `[${q.pronunciation}]` : ''}
                </span>
              </div>
            </div>

            <button type="button" id="btn-cloze-speak-answer" class="px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-800 text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer">
              <span>🔊</span> 発音を聴く
            </button>
          </div>

          <!-- 📌 【文法公式・接続ルール】 -->
          <div class="bg-white/90 rounded-xl p-3.5 border border-slate-200/80 space-y-1.5 text-xs">
            <div class="font-black text-slate-800 flex items-center gap-1.5 text-xs sm:text-sm">
              <span>📌</span> 公式・ルールポイント
            </div>
            <div class="text-slate-700 font-bold leading-relaxed">
              ${q.rulePoint}
            </div>
          </div>

          <!-- 💡 【詳しい文法解説】 -->
          <div class="bg-white/90 rounded-xl p-3.5 border border-slate-200/80 space-y-1.5 text-xs">
            <div class="font-black text-slate-800 flex items-center gap-1.5 text-xs sm:text-sm">
              <span>💡</span> 詳しい文法解説
            </div>
            <div class="text-slate-700 leading-relaxed">
              ${q.explanation}
            </div>
          </div>

          <!-- 📖 文法まとめへのリファレンス -->
          <div class="text-[11px] text-slate-500 flex items-center justify-between pt-1">
            <span>📖 文法ハンドブック: <strong>${q.grammarRef}</strong></span>
            <span class="text-slate-400">Enterキーでも次へ進めます</span>
          </div>

          <!-- 次の問題へボタン -->
          <button type="button" id="btn-cloze-next" class="w-full py-3.5 bg-slate-900 hover:bg-slate-800 active:scale-98 text-white rounded-xl text-sm font-black shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer">
            <span>${isLast ? '結果を見る' : '次の問題へ'}</span> ➔
          </button>
        </div>
      `;

      // 発音再生イベント
      const speakBtn = expContainer.querySelector('#btn-cloze-speak-answer');
      if (speakBtn) {
        speakBtn.addEventListener('click', () => {
          SpeechService.speak(q.answer.replace(/^-/, ''));
        });
      }

      // 次へ進むボタン
      const nextBtn = expContainer.querySelector('#btn-cloze-next');
      if (nextBtn) {
        nextBtn.addEventListener('click', () => {
          if (isLast) {
            this.state.view = 'cloze_result';
            this.renderClozeResult();
          } else {
            this.state.currentIndex += 1;
            this.renderClozeTesting();
            scrollToQuizTop();
          }
        });
      }

      // 解説カードまでスクロール
      expContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }

  // ==========================================
  // 4. 穴埋めモード 結果画面
  // ==========================================
  static renderClozeResult() {
    this.cleanupKeyHandler();
    const total = this.state.results.length;
    const correctCount = this.state.results.filter(r => r.isCorrect).length;
    const accuracy = total > 0 ? Math.round((correctCount / total) * 100) : 0;
    const earnedXp = correctCount * 10;

    const mistakes = this.state.results.filter(r => !r.isCorrect);

    this.container.innerHTML = `
      <div class="animate-fade-in max-w-2xl mx-auto px-4 py-6 space-y-6">
        <!-- スコアカード -->
        <div class="bg-gradient-to-br from-emerald-600 to-teal-700 text-white rounded-3xl p-6 sm:p-8 text-center shadow-lg space-y-4">
          <div class="text-4xl sm:text-5xl animate-bounce">
            ${accuracy >= 80 ? '🎉' : (accuracy >= 50 ? '👍' : '💪')}
          </div>
          <div>
            <h2 class="text-xl sm:text-2xl font-black">文法穴埋めテスト 完了！</h2>
            <p class="text-xs sm:text-sm text-emerald-100 mt-1">
              ${accuracy >= 80 ? '素晴らしい！文法公式がしっかり定着しています！' : 'お疲れ様でした！間違えた問題は要復習ノートに自動保存されました。'}
            </p>
          </div>

          <div class="grid grid-cols-3 gap-2 max-w-md mx-auto pt-2">
            <div class="bg-white/10 backdrop-blur-xs rounded-xl p-3 border border-white/20">
              <div class="text-[11px] text-emerald-100 font-bold">正解数</div>
              <div class="text-lg sm:text-xl font-black">${correctCount} / ${total}</div>
            </div>
            <div class="bg-white/10 backdrop-blur-xs rounded-xl p-3 border border-white/20">
              <div class="text-[11px] text-emerald-100 font-bold">正解率</div>
              <div class="text-lg sm:text-xl font-black">${accuracy}%</div>
            </div>
            <div class="bg-white/10 backdrop-blur-xs rounded-xl p-3 border border-white/20">
              <div class="text-[11px] text-emerald-100 font-bold">獲得XP</div>
              <div class="text-lg sm:text-xl font-black">+${earnedXp}</div>
            </div>
          </div>
        </div>

        <!-- 不正解問題の復習リスト -->
        ${mistakes.length > 0 ? `
          <div class="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
            <h3 class="text-sm font-black text-rose-800 flex items-center gap-2">
              <span>⚠️</span> 要復習問題（${mistakes.length}問）
            </h3>
            <div class="space-y-3">
              ${mistakes.map(m => `
                <div class="p-3.5 bg-rose-50/50 rounded-xl border border-rose-200/80 space-y-2 text-xs">
                  <div class="flex items-center justify-between text-[11px] text-slate-500">
                    <span class="font-bold text-rose-700">📖 ${m.quiz.grammarRef}</span>
                    <span>あなたの回答: <strong class="text-rose-600">${m.chosenOption}</strong></span>
                  </div>
                  <div class="font-black text-sm text-slate-800 cyrillic-text">
                    ${m.quiz.question}
                  </div>
                  <div class="text-slate-600 font-bold">
                    ${m.quiz.questionJa}
                  </div>
                  <div class="p-2.5 bg-white rounded-lg border border-rose-100 space-y-1">
                    <div class="text-emerald-800 font-black">
                      正解: ${m.quiz.answer} ${m.quiz.pronunciation ? `[${m.quiz.pronunciation}]` : ''}
                    </div>
                    <div class="text-slate-700 text-[11px]">
                      ${m.quiz.explanation}
                    </div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        ` : `
          <div class="bg-emerald-50 rounded-2xl p-5 border border-emerald-200 text-center space-y-1">
            <div class="text-xl">🏆 全問正解達成！</div>
            <p class="text-xs text-emerald-800 font-bold">パーフェクトです！文法理解は完璧です！</p>
          </div>
        `}

        <!-- アクションボタン -->
        <div class="flex flex-col sm:flex-row gap-3 pt-2">
          <button type="button" id="btn-cloze-retry" class="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white rounded-xl text-xs sm:text-sm font-black shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer">
            <span>🔄</span> もう一度挑戦する
          </button>
          <button type="button" id="btn-cloze-return-guide" class="flex-1 py-3 bg-slate-100 hover:bg-slate-200 active:scale-98 text-slate-800 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center justify-center gap-2 cursor-pointer border border-slate-200">
            <span>📖</span> 文法ハンドブック一覧へ戻る
          </button>
        </div>
      </div>
    `;

    // イベントリスナー
    const retryBtn = container.querySelector('#btn-cloze-retry');
    if (retryBtn) {
      retryBtn.addEventListener('click', () => {
        this.prepareClozeTesting();
      });
    }

    const returnBtn = container.querySelector('#btn-cloze-return-guide');
    if (returnBtn) {
      returnBtn.addEventListener('click', () => {
        this.state.view = 'guide';
        this.renderGuide();
      });
    }
  }

  // ==========================================
  // 5. 表形式インタラクティブ回答モード (Table Grid Quiz)
  // ==========================================

  // --- 5.1 設定・モード選択画面 ---
  static renderTableSettings() {
    this.cleanupKeyHandler();
    const container = this.container || document.getElementById('main-content') || document.body;
    this.container = container;

    const tState = this.state.tableQuiz;

    container.innerHTML = `
      <div class="animate-fade-in max-w-2xl mx-auto px-4 py-5 space-y-6">
        
        <!-- 上部ヘッダー -->
        <div class="flex items-center justify-between border-b border-slate-200 pb-3">
          <div class="flex items-center gap-2">
            <button type="button" id="btn-table-back-guide" class="px-2.5 py-1 text-xs font-bold text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg transition-all">
              ← ハンドブックへ戻る
            </button>
            <span class="text-xs text-slate-400">|</span>
            <span class="text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full">
              新機能：表形式インタラクティブ回答モード
            </span>
          </div>
        </div>

        <!-- ヒーロータイトルカード -->
        <div class="bg-gradient-to-br from-indigo-700 via-purple-700 to-slate-900 text-white rounded-3xl p-6 shadow-md space-y-3">
          <div class="flex items-center gap-3">
            <span class="text-4xl p-2.5 bg-white/10 rounded-2xl backdrop-blur-xs">📊</span>
            <div>
              <h2 class="text-xl sm:text-2xl font-black tracking-tight">文法マトリクス 表完成テスト</h2>
              <p class="text-xs sm:text-sm text-indigo-200 font-medium mt-0.5">
                表の空欄セルをクリックして埋めていき、文法表全体を完成させる実践特訓モード
              </p>
            </div>
          </div>
          <p class="text-xs text-indigo-100/90 leading-relaxed bg-white/10 p-3 rounded-xl border border-white/10">
            💡 単なる選択クイズではなく、実際の文法表を見渡しながら各セルを埋めていきます。すべてのセルを回答した後に「答え合わせ」で全体の正答率や間違えたセルの詳細解説を確認できます。
          </p>
        </div>

        <!-- 設定カード -->
        <div class="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-6">
          
          <!-- ① 回答モード選択（重要要件：モードA選択式 vs モードB入力式） -->
          <div class="space-y-3">
            <label class="block text-sm font-black text-slate-800 flex items-center justify-between">
              <span>🎯 1. 回答モードを選択</span>
              <span class="text-2xs text-slate-500 font-normal">表の全セルに適用されます</span>
            </label>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <!-- モードA: 選択式 -->
              <div class="btn-select-answering-mode cursor-pointer p-4 rounded-xl border-2 transition-all flex flex-col justify-between ${
                tState.answeringMode === 'choice'
                  ? 'border-indigo-600 bg-indigo-50/50 shadow-xs ring-2 ring-indigo-500/20'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }" data-mode="choice">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <span class="text-2xl">🔘</span>
                    <span class="font-black text-sm text-slate-800">モードA：選択式</span>
                  </div>
                  <span class="text-xs font-black px-2 py-0.5 rounded-full ${
                    tState.answeringMode === 'choice' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500'
                  }">
                    ${tState.answeringMode === 'choice' ? '選択中' : '選ぶ'}
                  </span>
                </div>
                <p class="text-xs text-slate-600 mt-2 leading-relaxed">
                  セルをクリックすると<strong>4つの選択肢</strong>が表示されます。正しい答えを選ぶと自動的にセルに反映されます。
                </p>
              </div>

              <!-- モードB: 入力式 -->
              <div class="btn-select-answering-mode cursor-pointer p-4 rounded-xl border-2 transition-all flex flex-col justify-between ${
                tState.answeringMode === 'input'
                  ? 'border-indigo-600 bg-indigo-50/50 shadow-xs ring-2 ring-indigo-500/20'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }" data-mode="input">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <span class="text-2xl">⌨️</span>
                    <span class="font-black text-sm text-slate-800">モードB：入力式</span>
                  </div>
                  <span class="text-xs font-black px-2 py-0.5 rounded-full ${
                    tState.answeringMode === 'input' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500'
                  }">
                    ${tState.answeringMode === 'input' ? '選択中' : '選ぶ'}
                  </span>
                </div>
                <p class="text-xs text-slate-600 mt-2 leading-relaxed">
                  セルをクリックすると<strong>入力欄とキリル文字パレット</strong>が表示されます。キーボードまたは画面のボタンで回答を入力・決定します。
                </p>
              </div>
            </div>
          </div>

          <!-- ② 文法範囲の選択 -->
          <div class="space-y-3">
            <label class="block text-sm font-black text-slate-800">
              <span>📚 2. 表の文法範囲を選択</span>
            </label>
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <button type="button" class="btn-select-grammar-range p-2.5 rounded-xl border-2 font-bold transition-all ${
                tState.grammarRange === 'range1'
                  ? 'border-indigo-600 bg-indigo-50 text-indigo-900 font-black'
                  : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
              }" data-range="range1">
                基礎・格助詞<br><span class="text-2xs text-slate-500 font-normal">No.1〜15 (15項目)</span>
              </button>

              <button type="button" class="btn-select-grammar-range p-2.5 rounded-xl border-2 font-bold transition-all ${
                tState.grammarRange === 'range2'
                  ? 'border-indigo-600 bg-indigo-50 text-indigo-900 font-black'
                  : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
              }" data-range="range2">
                動詞時制・活用<br><span class="text-2xs text-slate-500 font-normal">No.16〜30 (15項目)</span>
              </button>

              <button type="button" class="btn-select-grammar-range p-2.5 rounded-xl border-2 font-bold transition-all ${
                tState.grammarRange === 'range3'
                  ? 'border-indigo-600 bg-indigo-50 text-indigo-900 font-black'
                  : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
              }" data-range="range3">
                応用構文・複文<br><span class="text-2xs text-slate-500 font-normal">No.31〜48 (18項目)</span>
              </button>

              <button type="button" class="btn-select-grammar-range p-2.5 rounded-xl border-2 font-bold transition-all ${
                tState.grammarRange === 'all'
                  ? 'border-indigo-600 bg-indigo-50 text-indigo-900 font-black'
                  : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
              }" data-range="all">
                全48文法<br><span class="text-2xs text-slate-500 font-normal">No.1〜48 完全制覇</span>
              </button>
            </div>
          </div>

          <!-- ③ 属性行の選択 -->
          <div class="space-y-3">
            <label class="block text-sm font-black text-slate-800">
              <span>📑 3. 出題する属性行を選択</span>
            </label>
            <div class="flex flex-wrap gap-2 text-xs">
              <button type="button" class="btn-select-cat-filter px-3 py-1.5 rounded-lg border font-bold transition-all ${
                tState.categoryFilter === 'major'
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-2xs font-black'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-indigo-50'
              }" data-cat="major">
                ⭐ 主要属性（意味・男女語幹・例外・代名詞・語尾）
              </button>
              <button type="button" class="btn-select-cat-filter px-3 py-1.5 rounded-lg border font-bold transition-all ${
                tState.categoryFilter === 'phonetics'
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-2xs font-black'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-indigo-50'
              }" data-cat="phonetics">
                ⚡ 音韻・子音規則 (6行)
              </button>
              <button type="button" class="btn-select-cat-filter px-3 py-1.5 rounded-lg border font-bold transition-all ${
                tState.categoryFilter === 'exceptions'
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-2xs font-black'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-indigo-50'
              }" data-cat="exceptions">
                ⚠️ 例外・隠れ文字 (4行)
              </button>
              <button type="button" class="btn-select-cat-filter px-3 py-1.5 rounded-lg border font-bold transition-all ${
                tState.categoryFilter === 'syntax'
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-2xs font-black'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-indigo-50'
              }" data-cat="syntax">
                🌱 構文・格支配・代名詞 (5行)
              </button>
              <button type="button" class="btn-select-cat-filter px-3 py-1.5 rounded-lg border font-bold transition-all ${
                tState.categoryFilter === 'all'
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-2xs font-black'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-indigo-50'
              }" data-cat="all">
                全属性 (22行)
              </button>
            </div>
          </div>

          <!-- テスト開始ボタン -->
          <div class="pt-3 border-t border-slate-100">
            <button type="button" id="btn-start-table-testing-now" class="w-full py-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 hover:from-indigo-700 hover:to-purple-800 text-white font-black text-base rounded-2xl shadow-md hover:shadow-lg transition-all active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer">
              <span>🚀</span> 表完成テストを開始する（表を開く） →
            </button>
          </div>

        </div>

      </div>
    `;

    // イベント登録
    container.querySelector('#btn-table-back-guide')?.addEventListener('click', () => {
      this.state.view = 'guide';
      this.renderGuide();
    });

    container.querySelectorAll('.btn-select-answering-mode').forEach(btn => {
      btn.addEventListener('click', () => {
        tState.answeringMode = btn.dataset.mode;
        this.renderTableSettings();
      });
    });

    container.querySelectorAll('.btn-select-grammar-range').forEach(btn => {
      btn.addEventListener('click', () => {
        tState.grammarRange = btn.dataset.range;
        this.renderTableSettings();
      });
    });

    container.querySelectorAll('.btn-select-cat-filter').forEach(btn => {
      btn.addEventListener('click', () => {
        tState.categoryFilter = btn.dataset.cat;
        this.renderTableSettings();
      });
    });

    container.querySelector('#btn-start-table-testing-now')?.addEventListener('click', () => {
      this.prepareTableTesting();
    });
  }

  // --- 5.2 表テストの初期化準備 ---
  static prepareTableTesting() {
    const tState = this.state.tableQuiz;
    const allData = (typeof GRAMMAR_MATRIX_DATA !== 'undefined' ? GRAMMAR_MATRIX_DATA : []);
    const allRows = (typeof GRAMMAR_MATRIX_ROWS !== 'undefined' ? GRAMMAR_MATRIX_ROWS : []);

    // 文法範囲の抽出
    let minNum = 1, maxNum = 48;
    if (tState.grammarRange === 'range1') { minNum = 1; maxNum = 15; }
    else if (tState.grammarRange === 'range2') { minNum = 16; maxNum = 30; }
    else if (tState.grammarRange === 'range3') { minNum = 31; maxNum = 48; }

    const targetGrammars = allData.filter(g => g.num >= minNum && g.num <= maxNum);

    // 属性行の抽出
    let targetRows = [];
    if (tState.categoryFilter === 'major') {
      const majorKeys = ['meaning', 'male_vowel', 'female_vowel', 'exceptions', 'pronoun_form', 'suffix_types'];
      targetRows = allRows.filter(r => majorKeys.includes(r.key));
    } else if (tState.categoryFilter === 'all') {
      targetRows = [...allRows];
    } else {
      targetRows = allRows.filter(r => r.category === tState.categoryFilter);
    }

    if (targetRows.length === 0) targetRows = allRows.slice(0, 6);

    // 各セルの初期化
    tState.cells = {};
    let totalCount = 0;

    targetGrammars.forEach(g => {
      targetRows.forEach(r => {
        const key = `${g.num}_${r.key}`;
        const correctVal = (g.attributes && g.attributes[r.key]) ? g.attributes[r.key] : '×';
        const isNotApplicable = (!correctVal || correctVal === '×');

        tState.cells[key] = {
          grammarNum: g.num,
          grammarTitle: g.title,
          rowKey: r.key,
          rowLabel: r.label,
          rowIcon: r.icon || '📌',
          correctVal: correctVal,
          isNotApplicable: isNotApplicable,
          userAns: '',
          isCorrect: null
        };

        if (!isNotApplicable) {
          totalCount++;
        }
      });
    });

    tState.targetGrammars = targetGrammars;
    tState.targetRows = targetRows;
    tState.totalAnswerable = totalCount;
    tState.hasChecked = false;
    tState.activeCell = null;

    this.state.view = 'table_testing';
    this.renderTableTesting();
  }

  // --- 5.3 表形式インタラクティブ回答画面 (Table Grid Quiz View) ---
  static renderTableTesting() {
    this.cleanupKeyHandler();
    const container = this.container || document.getElementById('main-content') || document.body;
    this.container = container;

    const tState = this.state.tableQuiz;
    const targetGrammars = tState.targetGrammars || [];
    const targetRows = tState.targetRows || [];

    // 現在の回答進捗を計算
    let answeredCount = 0;
    Object.values(tState.cells || {}).forEach(c => {
      if (!c.isNotApplicable && c.userAns && c.userAns.trim() !== '') {
        answeredCount++;
      }
    });

    const percent = tState.totalAnswerable > 0 ? Math.round((answeredCount / tState.totalAnswerable) * 100) : 0;

    container.innerHTML = `
      <div class="animate-fade-in max-w-7xl mx-auto px-2 sm:px-4 py-4 space-y-4">
        
        <!-- 上部コントロールバー -->
        <div class="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs space-y-3">
          <div class="flex flex-wrap items-center justify-between gap-3">
            
            <div class="flex items-center gap-2">
              <button type="button" id="btn-abort-table-test" class="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-all">
                ✕ 中断して戻る
              </button>
              <span class="text-xs font-black px-2.5 py-1 rounded-full ${
                tState.answeringMode === 'choice' ? 'bg-indigo-100 text-indigo-800' : 'bg-purple-100 text-purple-800'
              }">
                ${tState.answeringMode === 'choice' ? '🔘 モードA：選択式' : '⌨️ モードB：入力式'}
              </span>
            </div>

            <!-- 進捗状況 ＆ 答え合わせボタン -->
            <div class="flex items-center gap-3">
              <div class="text-xs text-right">
                <span class="font-bold text-slate-500">回答進捗:</span>
                <span class="font-black text-indigo-600 text-sm ml-1">${answeredCount} / ${tState.totalAnswerable} セル (${percent}%)</span>
              </div>
              <button type="button" id="btn-submit-table-check" class="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-xs sm:text-sm rounded-xl shadow-xs hover:shadow-md transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer">
                <span>✨</span> 答え合わせをする
              </button>
            </div>

          </div>

          <!-- 進行バー -->
          <div class="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
            <div class="bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-500 h-2 rounded-full transition-all duration-300" style="width: ${percent}%"></div>
          </div>

          <!-- ヘルプヒント -->
          <div class="text-2xs text-slate-500 flex flex-wrap items-center justify-between gap-2">
            <span>💡 セルをクリックして回答を入力・選択してください。回答済みのセルも再度クリックでいつでも変更できます。</span>
            <span class="text-indigo-600 font-bold">横スクロールで表全体を見渡せます ↔️</span>
          </div>
        </div>

        <!-- メイン：表（スプレッドシート・グリッド形式） -->
        <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div class="overflow-x-auto max-h-[72vh] relative">
            <table class="w-full text-left border-collapse min-w-[700px]">
              
              <!-- 表ヘッダー：文法項目名 -->
              <thead class="sticky top-0 z-20 bg-slate-800 text-white text-xs">
                <tr>
                  <th class="p-3 sticky left-0 z-30 bg-slate-900 border-r border-slate-700 font-black min-w-[180px] sm:min-w-[200px] shadow-sm">
                    属性 \ 文法
                  </th>
                  ${targetGrammars.map(g => `
                    <th class="p-3 border-r border-slate-700 font-bold text-center min-w-[150px] sm:min-w-[180px]">
                      <div class="text-[11px] text-indigo-300 font-mono">No.${g.num}</div>
                      <div class="font-black text-white text-xs truncate" title="${g.title}">${g.title}</div>
                      ${g.mnTitle ? `<div class="text-[10px] text-slate-300 cyrillic-text font-normal truncate">${g.mnTitle}</div>` : ''}
                    </th>
                  `).join('')}
                </tr>
              </thead>

              <!-- 表ボディ：各属性行 ＆ セル回答欄 -->
              <tbody class="divide-y divide-slate-200 bg-white text-xs">
                ${targetRows.map(row => `
                  <tr class="hover:bg-slate-50/50 transition-colors">
                    
                    <!-- 左列固定：属性名 -->
                    <td class="p-3 sticky left-0 z-10 bg-slate-50/95 border-r border-slate-200 font-bold text-slate-800 shadow-2xs min-w-[180px] sm:min-w-[200px] align-middle">
                      <div class="flex items-center gap-1.5">
                        <span class="text-base">${row.icon || '📌'}</span>
                        <span class="font-black text-xs text-slate-900">${row.label}</span>
                      </div>
                    </td>

                    <!-- 各セルの回答欄 -->
                    ${targetGrammars.map(g => {
                      const key = `${g.num}_${row.key}`;
                      const cell = tState.cells[key] || {};
                      
                      if (cell.isNotApplicable) {
                        return `
                          <td class="p-2 border-r border-slate-100 bg-slate-100/40 text-slate-300 text-center select-none min-w-[150px] sm:min-w-[180px] align-middle">
                            <span class="text-xs font-mono">-</span>
                          </td>
                        `;
                      }

                      const hasAns = Boolean(cell.userAns && cell.userAns.trim() !== '');
                      const isCellActive = (tState.activeCell && tState.activeCell.key === key);

                      let cellClasses = 'cursor-pointer transition-all min-w-[150px] sm:min-w-[180px] p-2.5 border-r border-slate-200 align-top ';
                      if (isCellActive) {
                        cellClasses += 'ring-2 ring-indigo-600 bg-indigo-50/90 shadow-xs z-10 ';
                      } else if (hasAns) {
                        cellClasses += 'bg-indigo-50/60 hover:bg-indigo-100/70 text-indigo-950 font-bold ';
                      } else {
                        cellClasses += 'bg-amber-50/30 hover:bg-amber-100/50 hover:border-amber-300 text-slate-400 ';
                      }

                      return `
                        <td class="interactive-quiz-cell ${cellClasses}" data-key="${key}" data-num="${g.num}" data-row="${row.key}">
                          <div class="flex flex-col justify-between h-full min-h-[64px] space-y-1">
                            ${
                              hasAns
                                ? `
                                  <div class="text-[11px] font-black text-indigo-900 cyrillic-text line-clamp-3 leading-tight">
                                    ${cell.userAns}
                                  </div>
                                  <div class="flex items-center justify-between text-3xs text-indigo-500 pt-1 border-t border-indigo-200/50">
                                    <span>✔ 入力済</span>
                                    <span class="text-slate-400 font-normal">変更 ✎</span>
                                  </div>
                                `
                                : `
                                  <div class="flex flex-col items-center justify-center h-full py-2 text-slate-400 border border-dashed border-amber-300/80 rounded-lg bg-white/60 hover:bg-amber-50/80 transition-colors">
                                    <span class="text-base text-amber-500">✍️</span>
                                    <span class="text-3xs font-black text-amber-700 mt-0.5">タップして回答</span>
                                  </div>
                                `
                            }
                          </div>
                        </td>
                      `;
                    }).join('')}

                  </tr>
                `).join('')}
              </tbody>

            </table>
          </div>
        </div>

        <!-- 下部アクションバー -->
        <div class="flex items-center justify-between p-2">
          <button type="button" id="btn-table-scroll-left" class="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-50 shadow-2xs">
            ← 左へスクロール
          </button>
          <button type="button" id="btn-submit-table-check-bottom" class="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-black text-sm rounded-xl shadow-md hover:shadow-lg transition-all active:scale-95">
            ✨ すべての回答を採点する
          </button>
          <button type="button" id="btn-table-scroll-right" class="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-50 shadow-2xs">
            右へスクロール →
          </button>
        </div>

        <!-- 回答入力用モーダル / ポップオーバー コンテナ -->
        <div id="table-cell-modal-container"></div>

      </div>
    `;

    // イベント登録
    container.querySelector('#btn-abort-table-test')?.addEventListener('click', () => {
      if (confirm('表テストを中断して文法まとめに戻りますか？（入力途中の回答は破棄されます）')) {
        this.state.view = 'guide';
        this.renderGuide();
      }
    });

    const submitCheck = () => {
      this.checkTableAnswers();
    };

    container.querySelector('#btn-submit-table-check')?.addEventListener('click', submitCheck);
    container.querySelector('#btn-submit-table-check-bottom')?.addEventListener('click', submitCheck);

    // スクロールボタン
    const tableScrollBox = container.querySelector('.overflow-x-auto');
    container.querySelector('#btn-table-scroll-left')?.addEventListener('click', () => {
      tableScrollBox.scrollBy({ left: -300, behavior: 'smooth' });
    });
    container.querySelector('#btn-table-scroll-right')?.addEventListener('click', () => {
      tableScrollBox.scrollBy({ left: 300, behavior: 'smooth' });
    });

    // セルクリックで回答モーダルを開く
    container.querySelectorAll('.interactive-quiz-cell').forEach(cellEl => {
      cellEl.addEventListener('click', () => {
        const key = cellEl.dataset.key;
        const gnum = parseInt(cellEl.dataset.num, 10);
        const rkey = cellEl.dataset.row;
        this.openCellAnswerModal(gnum, rkey, key);
      });
    });
  }

  // --- 5.4 セル回答用モーダル表示 (選択式・入力式両対応) ---
  static openCellAnswerModal(grammarNum, rowKey, cellKey) {
    const tState = this.state.tableQuiz;
    const cell = tState.cells[cellKey];
    if (!cell || cell.isNotApplicable) return;

    tState.activeCell = { grammarNum, rowKey, key: cellKey };

    const modalBox = this.container.querySelector('#table-cell-modal-container');
    if (!modalBox) return;

    const isChoice = tState.answeringMode === 'choice';

    // 選択式の場合：正解＋同属性の他文法からダミー選択肢3つを生成
    let options = [];
    if (isChoice) {
      options = this.generateChoiceOptions(grammarNum, rowKey, cell.correctVal);
    }

    // キリル文字パレット
    const cyrLetters = ['ө', 'ү', 'н', 'г', 'р', 'с', 'д', 'т', 'а', 'э', 'о', 'у', 'и', 'й', 'ь', 'ъ', '-'];

    modalBox.innerHTML = `
      <div id="active-cell-modal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-2xs animate-fade-in">
        <div class="bg-white rounded-3xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border border-slate-100 space-y-4 max-h-[90vh] overflow-y-auto">
          
          <!-- モーダルヘッダー -->
          <div class="flex items-start justify-between border-b border-slate-100 pb-3">
            <div class="flex items-center gap-2.5">
              <span class="text-3xl">${cell.rowIcon}</span>
              <div>
                <div class="flex items-center gap-1.5">
                  <span class="px-2 py-0.5 rounded-full text-2xs font-black bg-indigo-100 text-indigo-800">No.${cell.grammarNum} ${cell.grammarTitle}</span>
                  <span class="text-2xs font-bold text-slate-500">${isChoice ? '🔘 選択式' : '⌨️ 入力式'}</span>
                </div>
                <h3 class="text-base font-black text-slate-900 mt-0.5">${cell.rowLabel}</h3>
              </div>
            </div>
            <button type="button" id="btn-close-cell-modal" class="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 font-bold flex items-center justify-center cursor-pointer transition-colors">
              ✕
            </button>
          </div>

          <!-- 現在の回答状況 -->
          ${
            cell.userAns
              ? `
                <div class="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                  <div>
                    <span class="text-slate-500 text-2xs block">現在の回答:</span>
                    <span class="font-bold text-indigo-900 cyrillic-text">${cell.userAns}</span>
                  </div>
                  <button type="button" id="btn-clear-cell-ans" class="text-2xs text-rose-600 hover:text-rose-800 font-bold underline cursor-pointer">
                    回答を消去
                  </button>
                </div>
              `
              : ''
          }

          <!-- 回答UIエリア -->
          ${
            isChoice
              ? `
                <!-- モードA：選択肢 (4択) -->
                <div class="space-y-2">
                  <label class="block text-xs font-bold text-slate-700">正しい答えをタップして選んでください：</label>
                  <div class="grid grid-cols-1 gap-2.5">
                    ${options.map((opt, idx) => `
                      <button type="button" class="btn-cell-choice-option p-3.5 rounded-xl border-2 text-left font-bold text-xs sm:text-sm transition-all flex items-start gap-2.5 cursor-pointer ${
                        cell.userAns === opt
                          ? 'border-indigo-600 bg-indigo-50/80 text-indigo-950 font-black ring-2 ring-indigo-500/20'
                          : 'border-slate-200 bg-white hover:border-indigo-400 hover:bg-indigo-50/30 text-slate-800'
                      }" data-val="${opt.replace(/"/g, '&quot;')}">
                        <span class="w-5 h-5 rounded-md bg-slate-100 text-slate-600 font-black text-2xs flex items-center justify-center shrink-0 mt-0.5">${idx + 1}</span>
                        <span class="cyrillic-text leading-snug break-words">${opt}</span>
                      </button>
                    `).join('')}
                  </div>
                </div>
              `
              : `
                <!-- モードB：キーボード入力 ＆ キリル文字パレット -->
                <div class="space-y-3">
                  <div>
                    <label class="block text-xs font-bold text-slate-700 mb-1">答えを入力してください（Enterで確定）：</label>
                    <input type="text" id="input-cell-answer" class="w-full p-3.5 rounded-xl border-2 border-indigo-300 focus:border-indigo-600 focus:outline-hidden text-sm sm:text-base font-black text-slate-900 cyrillic-text bg-white shadow-2xs" placeholder="例: -тай, -на, надад..." value="${cell.userAns.replace(/"/g, '&quot;')}" autofocus autocomplete="off">
                  </div>

                  <!-- キリル文字入力アシスタントパレット -->
                  <div class="p-2.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                    <span class="text-3xs font-bold text-slate-500 uppercase tracking-wider block">キリル文字パレット（タップで入力）</span>
                    <div class="flex flex-wrap gap-1.5">
                      ${cyrLetters.map(ch => `
                        <button type="button" class="btn-cyr-cell-letter w-7 h-7 rounded-lg bg-white hover:bg-indigo-100 border border-slate-200 font-black text-xs text-slate-800 flex items-center justify-center transition-colors cursor-pointer active:scale-95" data-char="${ch}">
                          ${ch}
                        </button>
                      `).join('')}
                    </div>
                  </div>

                  <button type="button" id="btn-submit-input-answer" class="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-sm rounded-xl shadow-xs transition-all active:scale-95 cursor-pointer">
                    入力した答えをセルに反映する（Enter）
                  </button>
                </div>
              `
          }

        </div>
      </div>
    `;

    // モーダルを閉じる処理
    const closeModal = () => {
      modalBox.innerHTML = '';
      tState.activeCell = null;
    };

    modalBox.querySelector('#btn-close-cell-modal')?.addEventListener('click', closeModal);
    modalBox.querySelector('#active-cell-modal')?.addEventListener('click', (e) => {
      if (e.target.id === 'active-cell-modal') closeModal();
    });

    // 回答消去ボタン
    modalBox.querySelector('#btn-clear-cell-ans')?.addEventListener('click', () => {
      this.submitCellAnswer(grammarNum, rowKey, '');
      closeModal();
    });

    // 選択肢クリック処理
    if (isChoice) {
      modalBox.querySelectorAll('.btn-cell-choice-option').forEach(btn => {
        btn.addEventListener('click', () => {
          const val = btn.dataset.val;
          this.submitCellAnswer(grammarNum, rowKey, val);
          closeModal();
        });
      });
    } else {
      // 入力式処理
      const inputEl = modalBox.querySelector('#input-cell-answer');
      const submitBtn = modalBox.querySelector('#btn-submit-input-answer');

      const doSubmit = () => {
        if (!inputEl) return;
        const val = inputEl.value.trim();
        this.submitCellAnswer(grammarNum, rowKey, val);
        closeModal();
      };

      submitBtn?.addEventListener('click', doSubmit);
      inputEl?.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          doSubmit();
        }
      });

      // パレット文字クリック
      modalBox.querySelectorAll('.btn-cyr-cell-letter').forEach(btn => {
        btn.addEventListener('click', () => {
          if (!inputEl) return;
          const char = btn.dataset.char;
          inputEl.value += char;
          inputEl.focus();
        });
      });
    }
  }

  // --- 5.5 セル回答の反映 ---
  static submitCellAnswer(grammarNum, rowKey, answer) {
    const tState = this.state.tableQuiz;
    const key = `${grammarNum}_${rowKey}`;
    if (!tState.cells[key]) return;

    tState.cells[key].userAns = answer;
    this.renderTableTesting();
  }

  // --- 選択肢生成ヘルパー ---
  static generateChoiceOptions(grammarNum, rowKey, correctVal) {
    const allData = (typeof GRAMMAR_MATRIX_DATA !== 'undefined' ? GRAMMAR_MATRIX_DATA : []);
    
    // 他の文法から同じ属性の値を取得
    let candidates = allData
      .filter(g => g.num !== grammarNum && g.attributes && g.attributes[rowKey] && g.attributes[rowKey] !== '×')
      .map(g => g.attributes[rowKey]);

    // 重複を排除し、正解と異なるものを抽出
    candidates = Array.from(new Set(candidates)).filter(val => val !== correctVal);

    // シャッフルして3つ取得
    candidates = shuffleArray(candidates).slice(0, 3);

    // 4択にまとめる
    const options = [correctVal, ...candidates];
    return shuffleArray(options);
  }

  // --- 5.6 答え合わせ・採点処理 ---
  static checkTableAnswers() {
    const tState = this.state.tableQuiz;
    let correctCount = 0;
    let totalCount = 0;

    Object.values(tState.cells || {}).forEach(cell => {
      if (cell.isNotApplicable) return;
      totalCount++;

      const isCorr = this.isCellAnswerCorrect(cell.userAns, cell.correctVal);
      cell.isCorrect = isCorr;
      if (isCorr) correctCount++;
    });

    tState.hasChecked = true;
    tState.totalAnswerable = totalCount;
    tState.correctCount = correctCount;
    tState.score = totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 0;

    // Gamification 経験値加算
    if (typeof GamificationService !== 'undefined' && GamificationService.addXP) {
      GamificationService.addXP(correctCount * 5);
    }

    this.state.view = 'table_result';
    this.renderTableResult();
  }

  // --- 正誤判定ロジック (柔軟かつ厳密) ---
  static isCellAnswerCorrect(userAns, correctVal) {
    if (!userAns || !correctVal) return false;
    const u = userAns.trim().toLowerCase().replace(/\s+/g, ' ');
    const c = correctVal.trim().toLowerCase().replace(/\s+/g, ' ');

    if (u === c) return true;

    // スラッシュや読点で区切られた複数語尾のチェック
    const parts = c.split(/[\/,\n、・]/).map(p => p.trim()).filter(Boolean);
    if (parts.includes(u)) return true;

    // ユーザー入力が主要な語尾や語幹変化を含んでいるか
    for (const part of parts) {
      if (part.length >= 2 && u.includes(part)) return true;
    }

    return false;
  }

  // --- 5.7 答え合わせ・採点結果画面 (Table Result View) ---
  static renderTableResult() {
    this.cleanupKeyHandler();
    const container = this.container || document.getElementById('main-content') || document.body;
    this.container = container;

    const tState = this.state.tableQuiz;
    const targetGrammars = tState.targetGrammars || [];
    const targetRows = tState.targetRows || [];

    const isPerfect = tState.score === 100;
    const hasMistakes = tState.correctCount < tState.totalAnswerable;

    container.innerHTML = `
      <div class="animate-fade-in max-w-7xl mx-auto px-2 sm:px-4 py-4 space-y-4">
        
        <!-- 上部スコアカード -->
        <div class="bg-gradient-to-br ${
          isPerfect ? 'from-emerald-600 via-teal-700 to-emerald-900' : 'from-indigo-700 via-purple-700 to-slate-900'
        } text-white rounded-3xl p-6 shadow-md space-y-4">
          
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div class="flex items-center gap-3">
              <span class="text-4xl p-2.5 bg-white/10 rounded-2xl backdrop-blur-xs">${isPerfect ? '👑' : '📊'}</span>
              <div>
                <span class="px-2.5 py-0.5 rounded-full text-2xs font-black bg-white/20 uppercase tracking-wider">
                  採点完了・結果発表
                </span>
                <h2 class="text-xl sm:text-2xl font-black tracking-tight mt-0.5">
                  ${isPerfect ? '全問正解！完璧な文法マスターです！' : '表完成テスト 結果発表'}
                </h2>
              </div>
            </div>

            <!-- スコア表示 -->
            <div class="flex items-center gap-4 bg-white/10 p-3 rounded-2xl border border-white/10">
              <div class="text-center px-2">
                <span class="text-2xs font-bold text-indigo-200 block">正答率</span>
                <span class="text-2xl sm:text-3xl font-black text-amber-300">${tState.score}%</span>
              </div>
              <div class="h-8 w-px bg-white/20"></div>
              <div class="text-center px-2">
                <span class="text-2xs font-bold text-indigo-200 block">正解数</span>
                <span class="text-xl sm:text-2xl font-black text-white">${tState.correctCount} / ${tState.totalAnswerable}</span>
              </div>
            </div>
          </div>

          <!-- アクションボタン群 -->
          <div class="flex flex-wrap items-center justify-between gap-2.5 pt-2 border-t border-white/10">
            <div class="flex flex-wrap gap-2">
              ${
                hasMistakes
                  ? `
                    <button type="button" id="btn-retry-table-mistakes" class="px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-amber-950 font-black text-xs sm:text-sm rounded-xl shadow-md transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer">
                      <span>🔁</span> 間違えたセルだけを再挑戦する
                    </button>
                  `
                  : ''
              }
              <button type="button" id="btn-retry-table-all" class="px-4 py-2.5 bg-white/15 hover:bg-white/25 text-white font-bold text-xs sm:text-sm rounded-xl transition-all cursor-pointer">
                🔄 もう一度最初から挑戦
              </button>
            </div>

            <button type="button" id="btn-return-guide-from-table" class="px-4 py-2.5 bg-white text-slate-800 hover:bg-slate-100 font-black text-xs sm:text-sm rounded-xl shadow-xs transition-all cursor-pointer">
              📖 文法まとめハンドブックへ戻る
            </button>
          </div>

        </div>

        <!-- 採点後の表（色分け：緑正解、赤不正解） -->
        <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          
          <div class="p-3 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between text-xs gap-2">
            <div class="flex items-center gap-4">
              <span class="flex items-center gap-1.5 font-bold text-emerald-800">
                <span class="w-3.5 h-3.5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-3xs font-black">✔</span>
                正解セル（緑）
              </span>
              <span class="flex items-center gap-1.5 font-bold text-rose-800">
                <span class="w-3.5 h-3.5 rounded-full bg-rose-500 text-white flex items-center justify-center text-3xs font-black">✖</span>
                不正解セル（赤）
              </span>
            </div>
            <span class="text-2xs text-slate-500">💡 セルをクリックすると【正解と詳しい解説】を確認できます</span>
          </div>

          <div class="overflow-x-auto max-h-[72vh] relative">
            <table class="w-full text-left border-collapse min-w-[700px]">
              
              <!-- 表ヘッダー -->
              <thead class="sticky top-0 z-20 bg-slate-800 text-white text-xs">
                <tr>
                  <th class="p-3 sticky left-0 z-30 bg-slate-900 border-r border-slate-700 font-black min-w-[180px] sm:min-w-[200px] shadow-sm">
                    属性 \ 文法
                  </th>
                  ${targetGrammars.map(g => `
                    <th class="p-3 border-r border-slate-700 font-bold text-center min-w-[150px] sm:min-w-[180px]">
                      <div class="text-[11px] text-indigo-300 font-mono">No.${g.num}</div>
                      <div class="font-black text-white text-xs truncate">${g.title}</div>
                    </th>
                  `).join('')}
                </tr>
              </thead>

              <!-- 表ボディ -->
              <tbody class="divide-y divide-slate-200 bg-white text-xs">
                ${targetRows.map(row => `
                  <tr>
                    <!-- 左列固定：属性名 -->
                    <td class="p-3 sticky left-0 z-10 bg-slate-50/95 border-r border-slate-200 font-bold text-slate-800 shadow-2xs min-w-[180px] sm:min-w-[200px] align-middle">
                      <div class="flex items-center gap-1.5">
                        <span class="text-base">${row.icon || '📌'}</span>
                        <span class="font-black text-xs text-slate-900">${row.label}</span>
                      </div>
                    </td>

                    <!-- セル採点結果 -->
                    ${targetGrammars.map(g => {
                      const key = `${g.num}_${row.key}`;
                      const cell = tState.cells[key] || {};

                      if (cell.isNotApplicable) {
                        return `
                          <td class="p-2 border-r border-slate-100 bg-slate-100/40 text-slate-300 text-center select-none min-w-[150px] sm:min-w-[180px] align-middle">
                            <span class="text-xs font-mono">-</span>
                          </td>
                        `;
                      }

                      const isCorr = cell.isCorrect;
                      const cellClasses = isCorr
                        ? 'bg-emerald-50/80 border-r border-emerald-200 text-emerald-950 hover:bg-emerald-100/90 '
                        : 'bg-rose-50/80 border-r border-rose-200 text-rose-950 hover:bg-rose-100/90 ';

                      return `
                        <td class="result-detail-cell cursor-pointer transition-colors p-2.5 min-w-[150px] sm:min-w-[180px] align-top ${cellClasses}" data-key="${key}">
                          <div class="flex flex-col justify-between h-full min-h-[68px] space-y-1">
                            <div class="flex items-center justify-between">
                              <span class="text-2xs font-black px-1.5 py-0.2 rounded-md ${
                                isCorr ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
                              }">
                                ${isCorr ? '✔ 正解' : '✖ 不正解'}
                              </span>
                              <span class="text-3xs text-slate-400 font-bold">解説 ℹ️</span>
                            </div>

                            <div class="text-[11px] font-bold cyrillic-text line-clamp-2 ${
                              isCorr ? 'text-emerald-900' : 'text-rose-900 line-through'
                            }">
                              ${cell.userAns || '（未回答）'}
                            </div>

                            ${
                              !isCorr
                                ? `
                                  <div class="text-3xs font-black text-emerald-700 bg-white/70 px-1.5 py-0.5 rounded-md cyrillic-text line-clamp-1 border border-emerald-200">
                                    正解: ${cell.correctVal}
                                  </div>
                                `
                                : ''
                            }
                          </div>
                        </td>
                      `;
                    }).join('')}

                  </tr>
                `).join('')}
              </tbody>

            </table>
          </div>
        </div>

        <!-- 採点結果セル詳細モーダル コンテナ -->
        <div id="result-cell-modal-container"></div>

      </div>
    `;

    // イベント登録
    container.querySelector('#btn-retry-table-mistakes')?.addEventListener('click', () => {
      this.retryTableMistakes();
    });

    container.querySelector('#btn-retry-table-all')?.addEventListener('click', () => {
      this.prepareTableTesting();
    });

    container.querySelector('#btn-return-guide-from-table')?.addEventListener('click', () => {
      this.state.view = 'guide';
      this.renderGuide();
    });

    // 結果セルクリックで解説モーダル表示
    container.querySelectorAll('.result-detail-cell').forEach(cellEl => {
      cellEl.addEventListener('click', () => {
        const key = cellEl.dataset.key;
        this.openResultCellModal(key);
      });
    });
  }

  // --- 5.8 採点結果セル詳細モーダル ---
  static openResultCellModal(cellKey) {
    const tState = this.state.tableQuiz;
    const cell = tState.cells[cellKey];
    if (!cell) return;

    const modalBox = this.container.querySelector('#result-cell-modal-container');
    if (!modalBox) return;

    modalBox.innerHTML = `
      <div id="result-modal-backdrop" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-2xs animate-fade-in">
        <div class="bg-white rounded-3xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border border-slate-100 space-y-4 max-h-[90vh] overflow-y-auto">
          
          <div class="flex items-start justify-between border-b border-slate-100 pb-3">
            <div class="flex items-center gap-2.5">
              <span class="text-3xl">${cell.rowIcon}</span>
              <div>
                <span class="px-2 py-0.5 rounded-full text-2xs font-black bg-indigo-100 text-indigo-800">
                  No.${cell.grammarNum} ${cell.grammarTitle}
                </span>
                <h3 class="text-base font-black text-slate-900 mt-0.5">${cell.rowLabel}</h3>
              </div>
            </div>
            <button type="button" id="btn-close-result-modal" class="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 font-bold flex items-center justify-center cursor-pointer transition-colors">
              ✕
            </button>
          </div>

          <!-- 正誤バッジ -->
          <div class="p-3 rounded-2xl flex items-center justify-between ${
            cell.isCorrect ? 'bg-emerald-50 border border-emerald-200' : 'bg-rose-50 border border-rose-200'
          }">
            <div class="flex items-center gap-2">
              <span class="text-2xl">${cell.isCorrect ? '🎉' : '⚠️'}</span>
              <div>
                <span class="font-black text-sm ${cell.isCorrect ? 'text-emerald-900' : 'text-rose-900'}">
                  ${cell.isCorrect ? '正解しました！' : '不正解'}
                </span>
                <span class="text-2xs text-slate-600 block">あなたの回答: ${cell.userAns || '（空欄・未回答）'}</span>
              </div>
            </div>
          </div>

          <!-- 正しい答え -->
          <div class="space-y-1">
            <span class="text-2xs font-bold text-slate-500 uppercase tracking-wider">正解・公式ルール</span>
            <div class="p-3.5 bg-slate-50 rounded-xl border border-slate-200 font-bold text-sm text-slate-900 cyrillic-text leading-relaxed">
              ${cell.correctVal}
            </div>
          </div>

          <!-- 発音再生ボタン ＆ 閉じる -->
          <div class="flex items-center justify-between pt-2">
            <button type="button" id="btn-speak-result-cell" class="px-3.5 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all cursor-pointer">
              <span>🔊</span> 発音を聴く
            </button>
            <button type="button" id="btn-action-close-result-modal" class="px-5 py-2 bg-slate-900 text-white font-bold text-xs rounded-xl hover:bg-slate-800 transition-all cursor-pointer">
              閉じる
            </button>
          </div>

        </div>
      </div>
    `;

    const close = () => {
      modalBox.innerHTML = '';
    };

    modalBox.querySelector('#btn-close-result-modal')?.addEventListener('click', close);
    modalBox.querySelector('#btn-action-close-result-modal')?.addEventListener('click', close);
    modalBox.querySelector('#result-modal-backdrop')?.addEventListener('click', (e) => {
      if (e.target.id === 'result-modal-backdrop') close();
    });

    modalBox.querySelector('#btn-speak-result-cell')?.addEventListener('click', () => {
      const match = cell.correctVal.match(/[А-Яа-яЁёӨөҮү]+/);
      if (match) {
        SpeechService.speak(match[0]);
      } else {
        SpeechService.speak(cell.correctVal);
      }
    });
  }

  // --- 5.9 間違えたセルだけを再挑戦する ---
  static retryTableMistakes() {
    const tState = this.state.tableQuiz;
    Object.values(tState.cells || {}).forEach(cell => {
      if (!cell.isNotApplicable && cell.isCorrect === false) {
        cell.userAns = '';
        cell.isCorrect = null;
      }
    });

    tState.hasChecked = false;
    tState.activeCell = null;
    this.state.view = 'table_testing';
    this.renderTableTesting();
  }

}
