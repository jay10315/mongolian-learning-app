import os, sys

component_code = '''// 単語ファミリー完全習得・活用形マスター画面コンポーネント
// 教科書・学習ノートに登場した単語を起点に全活用形・派生形を整理し、7つのテストパターンで完全習得を達成するUI
import { StorageService } from '../services/storage.js';
import { SpeechService } from '../services/speech.js';
import { GamificationService } from '../services/gamification.js';
import { WORD_FAMILIES_DATA } from '../data/wordFamiliesData.js';

export class WordFamilyComponent {
  constructor() {
    this.container = null;
    this.searchQuery = '';
    this.filterPos = 'all'; // 'all' | '動詞' | '名詞'
    this.filterStatus = 'all'; // 'all' | 'mastered' | 'studying' | 'unlearned'
    this.filterAdded = 'all'; // 'all' | 'added' | 'unadded'
    this.expandedFamilies = new Set(['fam_surah']); // 初期展開
    this.activeQuiz = null; // null | QuizState
  }

  mount(container) {
    this.container = container;
    this.render();
  }

  render() {
    if (!this.container) return;

    // テストモード中ならテスト画面を描画
    if (this.activeQuiz) {
      this.renderQuiz();
      return;
    }

    const families = StorageService.getAllWordFamilies();
    const summary = StorageService.getWordFamilySummary();

    // フィルタリング処理
    const filtered = families.filter(fam => {
      // 検索フィルター
      if (this.searchQuery) {
        const q = this.searchQuery.toLowerCase().trim();
        const matchLemma = fam.lemma.toLowerCase().includes(q);
        const matchMeaning = fam.meaning.toLowerCase().includes(q);
        const matchStem = fam.stem.toLowerCase().includes(q);
        const matchForms = fam.forms.some(f => 
          f.mongolian.toLowerCase().includes(q) || 
          f.japanese.toLowerCase().includes(q) ||
          f.role.toLowerCase().includes(q)
        );
        if (!matchLemma && !matchMeaning && !matchStem && !matchForms) return false;
      }

      // 品詞フィルター
      if (this.filterPos !== 'all' && fam.pos !== this.filterPos) return false;

      // 完全習得フィルター
      if (this.filterStatus === 'mastered' && !fam.mastered) return false;
      if (this.filterStatus === 'studying' && (fam.mastered || fam.masteryPercent === 0)) return false;
      if (this.filterStatus === 'unlearned' && fam.masteryPercent > 0) return false;

      // 追加状態フィルター
      if (this.filterAdded === 'added' && !fam.isAdded) return false;
      if (this.filterAdded === 'unadded' && fam.isAdded) return false;

      return true;
    });

    this.container.innerHTML = `
      <div class="max-w-4xl mx-auto px-3 sm:px-4 py-4 space-y-6">

        <!-- ヘッダーバナー -->
        <div class="bg-gradient-to-r from-teal-600 via-emerald-600 to-green-600 rounded-3xl p-5 sm:p-6 text-white shadow-lg space-y-4">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-xs font-bold backdrop-blur-xs">
                <span>🌳</span> 教科書・練習ノート掲載単語の完全習得
              </span>
              <h1 class="text-xl sm:text-2xl font-black mt-2 tracking-tight">
                単語ファミリー ＆ 活用形マスター
              </h1>
              <p class="text-xs sm:text-sm text-emerald-100 mt-1">
                辞書形だけでなく、過去形・習慣形・受動・使役・格変化まで全語形を完全制覇！
              </p>
            </div>
            <button type="button" id="btn-start-all-quiz" class="px-5 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 active:scale-95 text-amber-950 font-black text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0">
              <span>🎯</span>
              <span>完全習得テストを開始</span>
            </button>
          </div>

          <!-- サマリー統計グリッド -->
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-emerald-400/30 text-center">
            <div class="bg-white/10 rounded-xl p-2.5 backdrop-blur-xs">
              <div class="text-[10px] sm:text-xs text-emerald-100 font-bold">完全習得ファミリー</div>
              <div class="text-lg sm:text-xl font-black text-amber-300">
                ${summary.masteredFamilies} <span class="text-xs font-semibold text-white">/ ${summary.totalFamilies}</span>
              </div>
            </div>
            <div class="bg-white/10 rounded-xl p-2.5 backdrop-blur-xs">
              <div class="text-[10px] sm:text-xs text-emerald-100 font-bold">習得済み全語形</div>
              <div class="text-lg sm:text-xl font-black text-white">
                ${summary.masteredForms} <span class="text-xs font-semibold text-emerald-200">/ ${summary.totalForms}</span>
              </div>
            </div>
            <div class="bg-white/10 rounded-xl p-2.5 backdrop-blur-xs">
              <div class="text-[10px] sm:text-xs text-emerald-100 font-bold">全体習得率</div>
              <div class="text-lg sm:text-xl font-black text-white">
                ${summary.overallMasteryPercent}%
              </div>
            </div>
            <div class="bg-white/10 rounded-xl p-2.5 backdrop-blur-xs">
              <div class="text-[10px] sm:text-xs text-emerald-100 font-bold">学習中語形</div>
              <div class="text-lg sm:text-xl font-black text-teal-200">
                ${summary.studiedForms} 語形
              </div>
            </div>
          </div>

          <!-- 全体プログレスバー -->
          <div class="space-y-1">
            <div class="flex justify-between text-[11px] text-emerald-100 font-semibold">
              <span>ファミリー完全制覇プログレス</span>
              <span>${summary.masteredFamilies} / ${summary.totalFamilies} ファミリー達成</span>
            </div>
            <div class="w-full h-2.5 bg-black/20 rounded-full overflow-hidden p-0.5">
              <div class="h-full bg-amber-300 rounded-full transition-all duration-500" style="width: ${summary.totalFamilies > 0 ? (summary.masteredFamilies / summary.totalFamilies) * 100 : 0}%"></div>
            </div>
          </div>
        </div>

        <!-- 検索・フィルターツールバー -->
        <div class="bg-white rounded-2xl p-3.5 border border-slate-200 shadow-xs space-y-3">
          <div class="relative">
            <input type="text" id="family-search-input" value="${this.searchQuery}" placeholder="単語、活用形、意味（学ぶ、書くなど）、文法役割で検索..." class="w-full text-xs sm:text-sm pl-9 pr-8 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden">
            <span class="absolute left-3 top-3 text-slate-400 text-xs">🔍</span>
            ${this.searchQuery ? `<button type="button" id="btn-clear-search" class="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 text-xs">✕</button>` : ''}
          </div>

          <div class="flex flex-wrap items-center gap-2 text-xs">
            <!-- 品詞 -->
            <select id="filter-pos" class="px-2.5 py-1.5 border border-slate-200 rounded-lg bg-slate-50 text-slate-700 font-semibold focus:outline-hidden">
              <option value="all" ${this.filterPos === 'all' ? 'selected' : ''}>全品詞</option>
              <option value="動詞" ${this.filterPos === '動詞' ? 'selected' : ''}>動詞 (活用形)</option>
              <option value="名詞" ${this.filterPos === '名詞' ? 'selected' : ''}>名詞 (格変化)</option>
            </select>

            <!-- 習熟度 -->
            <select id="filter-status" class="px-2.5 py-1.5 border border-slate-200 rounded-lg bg-slate-50 text-slate-700 font-semibold focus:outline-hidden">
              <option value="all" ${this.filterStatus === 'all' ? 'selected' : ''}>全習熟度</option>
              <option value="mastered" ${this.filterStatus === 'mastered' ? 'selected' : ''}>👑 完全習得のみ</option>
              <option value="studying" ${this.filterStatus === 'studying' ? 'selected' : ''}>⏳ 学習中のみ</option>
              <option value="unlearned" ${this.filterStatus === 'unlearned' ? 'selected' : ''}>⚪ 未学習のみ</option>
            </select>

            <!-- 追加状態 -->
            <select id="filter-added" class="px-2.5 py-1.5 border border-slate-200 rounded-lg bg-slate-50 text-slate-700 font-semibold focus:outline-hidden">
              <option value="all" ${this.filterAdded === 'all' ? 'selected' : ''}>全表示</option>
              <option value="added" ${this.filterAdded === 'added' ? 'selected' : ''}>✓ ゲーム追加済み</option>
              <option value="unadded" ${this.filterAdded === 'unadded' ? 'selected' : ''}>＋ 未追加</option>
            </select>

            <span class="ml-auto text-slate-400 text-xs font-semibold">
              該当: <strong>${filtered.length}</strong> ファミリー
            </span>
          </div>
        </div>

        <!-- ファミリー一覧リスト -->
        <div class="space-y-4">
          ${filtered.length === 0 ? `
            <div class="bg-white rounded-2xl p-12 text-center text-slate-400 border border-slate-200 space-y-2">
              <span class="text-4xl">🍃</span>
              <p class="font-bold text-sm">条件に一致する単語ファミリーが見つかりませんでした。</p>
            </div>
          ` : filtered.map(fam => {
            const isExpanded = this.expandedFamilies.has(fam.familyId);
            return `
              <div class="bg-white rounded-2xl border ${fam.mastered ? 'border-amber-300 ring-2 ring-amber-200/50 shadow-md' : 'border-slate-200 shadow-xs'} overflow-hidden transition-all">
                
                <!-- ファミリーヘッダー（タップで展開） -->
                <div class="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer select-none bg-gradient-to-r ${fam.mastered ? 'from-amber-50/80 via-white to-amber-50/50' : 'from-slate-50/80 via-white to-slate-50/40'} hover:bg-slate-50/80 transition-colors" data-toggle-family="${fam.familyId}">
                  
                  <div class="flex items-start gap-3">
                    <button type="button" class="mt-1 w-8 h-8 rounded-full flex items-center justify-center ${fam.mastered ? 'bg-amber-400 text-amber-950 font-black' : 'bg-slate-200 text-slate-600'} text-xs font-bold shrink-0">
                      ${fam.mastered ? '👑' : (isExpanded ? '▲' : '▼')}
                    </button>
                    <div>
                      <div class="flex items-center gap-2 flex-wrap">
                        <span class="text-lg sm:text-xl font-black text-slate-900 cyrillic-text">
                          ${fam.lemma}
                        </span>
                        <span class="text-xs px-2 py-0.5 rounded-full ${fam.pos === '動詞' ? 'bg-indigo-100 text-indigo-700 font-bold' : 'bg-emerald-100 text-emerald-700 font-bold'}">
                          ${fam.pos}
                        </span>
                        <span class="text-xs text-slate-400 font-mono">
                          語幹: <strong>${fam.stem}</strong>
                        </span>
                        <span class="text-[11px] text-slate-500 font-medium">
                          登場: ${fam.textbookAppearance}
                        </span>
                      </div>
                      <div class="text-xs sm:text-sm font-bold text-slate-700 mt-1">
                        ${fam.meaning}
                      </div>
                    </div>
                  </div>

                  <!-- 右側: 習熟度ステータス ＆ 操作ボタン -->
                  <div class="flex items-center gap-2 self-end sm:self-auto shrink-0" onclick="event.stopPropagation()">
                    
                    <!-- 習熟度バッジ -->
                    ${fam.mastered ? `
                      <span class="px-2.5 py-1 rounded-xl bg-amber-100 text-amber-800 border border-amber-300 font-black text-xs flex items-center gap-1 shadow-2xs">
                        <span>👑</span> 完全習得
                      </span>
                    ` : `
                      <div class="text-right">
                        <div class="text-[10px] text-slate-400 font-bold">コア習熟度</div>
                        <div class="text-xs font-extrabold text-emerald-700">
                          ${fam.masteredCoreCount} / ${fam.totalCoreCount} 語形 (${fam.masteryPercent}%)
                        </div>
                      </div>
                    `}

                    <!-- テスト実行ボタン -->
                    <button type="button" class="btn-quiz-family px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-bold text-xs shadow-xs transition-all flex items-center gap-1 cursor-pointer" data-family-id="${fam.familyId}">
                      <span>🎯</span>
                      <span>テスト</span>
                    </button>

                    <!-- 一括追加トグル -->
                    <button type="button" class="btn-toggle-family-added px-3 py-1.5 rounded-xl ${fam.isAdded ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'} font-bold text-xs transition-all flex items-center gap-1 cursor-pointer" data-family-id="${fam.familyId}">
                      <span>${fam.isAdded ? '✓ 追加済' : '＋ 一括追加'}</span>
                    </button>
                  </div>
                </div>

                <!-- 展開時の語形リストテーブル -->
                ${isExpanded ? `
                  <div class="border-t border-slate-200 divide-y divide-slate-100 bg-white">
                    <div class="p-3 bg-slate-50/70 text-[11px] font-bold text-slate-500 flex items-center justify-between">
                      <span>ファミリー収録語形一覧（全 ${fam.forms.length} 語形）</span>
                      <span class="text-[10px] text-slate-400">※ 辞書形だけでなく全語形の正解で「完全習得」になります</span>
                    </div>

                    ${fam.forms.map(form => {
                      const isMastered = form.progress && form.progress.mastered;
                      return `
                        <div class="p-3 sm:p-4 hover:bg-slate-50/80 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div class="space-y-1.5 flex-1">
                            <div class="flex items-center gap-2 flex-wrap">
                              <span class="text-base sm:text-lg font-black text-slate-900 cyrillic-text">
                                ${form.mongolian}
                              </span>
                              <button type="button" class="btn-speak-form text-slate-400 hover:text-emerald-600 text-xs cursor-pointer" data-text="${form.mongolian}">
                                🔊
                              </button>
                              <span class="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-bold">
                                ${form.role}
                              </span>
                              ${form.isCore ? `
                                <span class="text-[10px] px-1.5 py-0.5 rounded-sm bg-rose-50 text-rose-600 font-bold border border-rose-200">
                                  重要
                                </span>
                              ` : ''}
                            </div>
                            <div class="text-xs font-bold text-emerald-900">
                              意味: ${form.japanese}
                            </div>
                            <div class="text-[11px] text-slate-500">
                              文法規則: ${form.ruleDesc}
                            </div>
                            <div class="text-[11px] text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100">
                              <div class="font-medium cyrillic-text text-slate-800">📌 ${form.exampleMn}</div>
                              <div class="text-slate-500 mt-0.5">（${form.exampleJa}）</div>
                            </div>
                          </div>

                          <!-- 右側: 個別習熟度 ＆ 個別追加ボタン -->
                          <div class="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                            <div>
                              ${isMastered ? `
                                <span class="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-black">
                                  <span>✓</span> 習得済
                                </span>
                              ` : form.progress && form.progress.studyCount > 0 ? `
                                <span class="text-[11px] text-amber-700 font-bold">
                                  学習中 (${form.progress.correctCount}/${form.progress.studyCount}正解)
                                </span>
                              ` : `
                                <span class="text-[11px] text-slate-400 font-medium">
                                  未テスト
                                </span>
                              `}
                            </div>

                            <button type="button" class="btn-toggle-form-added px-2.5 py-1 rounded-lg ${form.isAdded ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'} font-bold text-[11px] transition-all flex items-center gap-1 cursor-pointer" data-form-id="${form.formId}">
                              <span>${form.isAdded ? '✓ 追加済' : '＋ 単語帳に追加'}</span>
                            </button>
                          </div>
                        </div>
                      `;
                    }).join('')}
                  </div>
                ` : ''}

              </div>
            `;
          }).join('')}
        </div>

      </div>
    `;

    this.bindEvents();
  }

  bindEvents() {
    // 検索入力
    const searchInput = this.container.querySelector('#family-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchQuery = e.target.value;
        this.render();
      });
    }

    const clearSearch = this.container.querySelector('#btn-clear-search');
    if (clearSearch) {
      clearSearch.addEventListener('click', () => {
        this.searchQuery = '';
        this.render();
      });
    }

    // フィルター
    const posSelect = this.container.querySelector('#filter-pos');
    if (posSelect) {
      posSelect.addEventListener('change', (e) => {
        this.filterPos = e.target.value;
        this.render();
      });
    }

    const statusSelect = this.container.querySelector('#filter-status');
    if (statusSelect) {
      statusSelect.addEventListener('change', (e) => {
        this.filterStatus = e.target.value;
        this.render();
      });
    }

    const addedSelect = this.container.querySelector('#filter-added');
    if (addedSelect) {
      addedSelect.addEventListener('change', (e) => {
        this.filterAdded = e.target.value;
        this.render();
      });
    }

    // アコーディオン展開
    this.container.querySelectorAll('[data-toggle-family]').forEach(el => {
      el.addEventListener('click', () => {
        const famId = el.getAttribute('data-toggle-family');
        if (this.expandedFamilies.has(famId)) {
          this.expandedFamilies.delete(famId);
        } else {
          this.expandedFamilies.add(famId);
        }
        this.render();
      });
    });

    // 発音
    this.container.querySelectorAll('.btn-speak-form').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const text = btn.getAttribute('data-text');
        if (typeof SpeechService !== 'undefined' && SpeechService.speak) {
          SpeechService.speak(text);
        }
      });
    });

    // 一括追加
    this.container.querySelectorAll('.btn-toggle-family-added').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const famId = btn.getAttribute('data-family-id');
        const isAdded = StorageService.isFamilyAdded(famId);
        if (isAdded) {
          StorageService.removeFamilyFromLearning(famId);
        } else {
          StorageService.addFamilyToLearning(famId);
        }
        this.render();
      });
    });

    // 個別追加
    this.container.querySelectorAll('.btn-toggle-form-added').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const formId = btn.getAttribute('data-form-id');
        const isAdded = StorageService.isFormAdded(formId);
        if (isAdded) {
          StorageService.removeFormFromLearning(formId);
        } else {
          StorageService.addFormToLearning(formId);
        }
        this.render();
      });
    });

    // テスト開始（全ファミリー）
    const startAllBtn = this.container.querySelector('#btn-start-all-quiz');
    if (startAllBtn) {
      startAllBtn.addEventListener('click', () => {
        this.startQuiz();
      });
    }

    // テスト開始（特定ファミリー）
    this.container.querySelectorAll('.btn-quiz-family').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const famId = btn.getAttribute('data-family-id');
        this.startQuiz(famId);
      });
    });
  }

  // =========================================================================
  // 7つの出題パターンによる完全習得テストエンジン
  // =========================================================================

  startQuiz(targetFamilyId = null) {
    const rawFamilies = StorageService.getAllWordFamilies();
    const candidateFamilies = targetFamilyId 
      ? rawFamilies.filter(f => f.familyId === targetFamilyId)
      : rawFamilies;

    if (candidateFamilies.length === 0) {
      alert('出題対象の単語ファミリーがありません。');
      return;
    }

    // 10問の問題プールを7パターンから均等生成
    const questions = [];
    const questionTypes = [
      'ja_to_mn',          // 1. 日本語からモンゴル語（活用形）
      'mn_to_ja',          // 2. モンゴル語から日本語
      'form_to_dict',      // 3. 活用形から辞書形を答える
      'dict_to_form',      // 4. 辞書形から指定された活用形を答える
      'grammar_transform', // 5. 文法形式を指定して変形する
      'context_fill',      // 6. 文中で適切な形を選択する
      'identify_form'      // 7. 受け身・使役などの形式を答える
    ];

    for (let i = 0; i < 10; i++) {
      const fam = candidateFamilies[Math.floor(Math.random() * candidateFamilies.length)];
      const qType = questionTypes[i % questionTypes.length];
      const q = this.generateQuestion(qType, fam, rawFamilies);
      if (q) questions.push(q);
    }

    if (questions.length === 0) {
      alert('問題の生成に失敗しました。');
      return;
    }

    this.activeQuiz = {
      targetFamilyId,
      questions,
      currentIndex: 0,
      score: 0,
      streak: 0,
      answers: [],
      userAnswer: null,
      isAnswered: false
    };

    this.render();
  }

  generateQuestion(type, family, allFamilies) {
    const forms = family.forms;
    const coreForms = forms.filter(f => f.isCore !== false);
    const targetForm = coreForms.length > 0 ? coreForms[Math.floor(Math.random() * coreForms.length)] : forms[0];

    // ダミー選択肢プール
    const allFormsPool = [];
    allFamilies.forEach(f => {
      f.forms.forEach(fm => allFormsPool.push(fm));
    });

    switch (type) {
      case 'ja_to_mn': {
        // 1. 日本語からモンゴル語（活用形）
        const correct = targetForm.mongolian;
        const choices = [correct];
        // 同じファミリーの他の語形を優先してダミーに採用（紛らわしさの克服）
        const otherFormsInFam = forms.filter(f => f.mongolian !== correct);
        otherFormsInFam.sort(() => 0.5 - Math.random());
        otherFormsInFam.slice(0, 2).forEach(f => choices.push(f.mongolian));
        
        while (choices.length < 4) {
          const rand = allFormsPool[Math.floor(Math.random() * allFormsPool.length)].mongolian;
          if (!choices.includes(rand)) choices.push(rand);
        }
        choices.sort(() => 0.5 - Math.random());

        return {
          type,
          familyId: family.familyId,
          formId: targetForm.formId,
          title: '日本語 ➔ モンゴル語（活用形）',
          question: `「${targetForm.japanese}」にあたる適切な語形は？`,
          subText: `【品詞: ${family.pos} / 原形: ${family.lemma}】`,
          choices,
          correctAnswer: correct,
          explanation: `正解は「${correct}」（${targetForm.role}）です。${targetForm.ruleDesc}`
        };
      }

      case 'mn_to_ja': {
        // 2. モンゴル語から日本語
        const correct = targetForm.japanese;
        const choices = [correct];
        const otherForms = forms.filter(f => f.japanese !== correct);
        otherForms.sort(() => 0.5 - Math.random());
        otherForms.slice(0, 2).forEach(f => choices.push(f.japanese));

        while (choices.length < 4) {
          const rand = allFormsPool[Math.floor(Math.random() * allFormsPool.length)].japanese;
          if (!choices.includes(rand)) choices.push(rand);
        }
        choices.sort(() => 0.5 - Math.random());

        return {
          type,
          familyId: family.familyId,
          formId: targetForm.formId,
          title: 'モンゴル語 ➔ 日本語訳',
          question: `「${targetForm.mongolian}」の適切な意味はどれ？`,
          subText: `【文法役割: ${targetForm.role}】`,
          choices,
          correctAnswer: correct,
          explanation: `「${targetForm.mongolian}」は「${correct}」を意味します。例: ${targetForm.exampleMn}（${targetForm.exampleJa}）`
        };
      }

      case 'form_to_dict': {
        // 3. 活用形から辞書形を答える
        const correct = family.lemma;
        const choices = [correct];
        while (choices.length < 4) {
          const rand = allFamilies[Math.floor(Math.random() * allFamilies.length)].lemma;
          if (!choices.includes(rand)) choices.push(rand);
        }
        choices.sort(() => 0.5 - Math.random());

        return {
          type,
          familyId: family.familyId,
          formId: targetForm.formId,
          title: '活用形 ➔ 辞書形（原形）判定',
          question: `活用形「${targetForm.mongolian}」の辞書形（原形）はどれ？`,
          subText: `（${targetForm.role}: ${targetForm.japanese}）`,
          choices,
          correctAnswer: correct,
          explanation: `「${targetForm.mongolian}」の語根・辞書形は「${correct}」（意味: ${family.meaning}）です。`
        };
      }

      case 'dict_to_form': {
        // 4. 辞書形から指定された活用形を答える
        const correct = targetForm.mongolian;
        const choices = [correct];
        const otherForms = forms.filter(f => f.mongolian !== correct);
        otherForms.sort(() => 0.5 - Math.random());
        otherForms.slice(0, 3).forEach(f => choices.push(f.mongolian));
        while (choices.length < 4) {
          const rand = allFormsPool[Math.floor(Math.random() * allFormsPool.length)].mongolian;
          if (!choices.includes(rand)) choices.push(rand);
        }
        choices.sort(() => 0.5 - Math.random());

        return {
          type,
          familyId: family.familyId,
          formId: targetForm.formId,
          title: '指定された活用形への変形',
          question: `「${family.lemma}（${family.meaning}）」の【${targetForm.role}】はどれ？`,
          subText: `求める意味: ${targetForm.japanese}`,
          choices,
          correctAnswer: correct,
          explanation: `正解: ${correct}。規則: ${targetForm.ruleDesc}`
        };
      }

      case 'grammar_transform': {
        // 5. 文法形式を指定して変形する（使役・受動・過去など）
        const specForms = forms.filter(f => ['causative', 'passive', 'past', 'habitual', 'negative'].includes(f.category));
        const pick = specForms.length > 0 ? specForms[Math.floor(Math.random() * specForms.length)] : targetForm;
        const correct = pick.mongolian;
        const choices = [correct];
        forms.filter(f => f.mongolian !== correct).slice(0, 3).forEach(f => choices.push(f.mongolian));
        while (choices.length < 4) {
          const rand = allFormsPool[Math.floor(Math.random() * allFormsPool.length)].mongolian;
          if (!choices.includes(rand)) choices.push(rand);
        }
        choices.sort(() => 0.5 - Math.random());

        return {
          type,
          familyId: family.familyId,
          formId: pick.formId,
          title: '文法形式の変形チャレンジ',
          question: `「${family.lemma}」を【${pick.role}】に変形すると？`,
          subText: `ヒント: ${pick.ruleDesc}`,
          choices,
          correctAnswer: correct,
          explanation: `正解: 「${correct}」（${pick.japanese}）。${pick.ruleDesc}`
        };
      }

      case 'context_fill': {
        // 6. 文中で適切な形を選択する
        const sentence = targetForm.exampleMn;
        const blanked = sentence.replace(new RegExp(targetForm.mongolian, 'i'), '【　？　】');
        const correct = targetForm.mongolian;
        const choices = [correct];
        forms.filter(f => f.mongolian !== correct).slice(0, 3).forEach(f => choices.push(f.mongolian));
        while (choices.length < 4) {
          const rand = allFormsPool[Math.floor(Math.random() * allFormsPool.length)].mongolian;
          if (!choices.includes(rand)) choices.push(rand);
        }
        choices.sort(() => 0.5 - Math.random());

        return {
          type,
          familyId: family.familyId,
          formId: targetForm.formId,
          title: '文脈穴埋めテスト',
          question: `文中の【 ？ 】に入る最も適切な形を選んでください:\n「${blanked}」`,
          subText: `和訳: ${targetForm.exampleJa}`,
          choices,
          correctAnswer: correct,
          explanation: `正解: 「${correct}」。文脈全体: ${sentence}（${targetForm.exampleJa}）`
        };
      }

      case 'identify_form':
      default: {
        // 7. 受け身・使役などの形式を答える
        const correct = targetForm.role;
        const choices = [correct];
        forms.filter(f => f.role !== correct).slice(0, 2).forEach(f => {
          if (!choices.includes(f.role)) choices.push(f.role);
        });
        const dummyRoles = ['直接命令形', '過去形 (-сан/-сэн)', '使役形 (-уулах/-үүлэх)', '受動形 (-гдах/-гдэх)', '習慣形 (-даг/-дэг)', '目的格 (-ыг/-ийг)'];
        dummyRoles.forEach(r => {
          if (choices.length < 4 && !choices.includes(r)) choices.push(r);
        });
        choices.sort(() => 0.5 - Math.random());

        return {
          type,
          familyId: family.familyId,
          formId: targetForm.formId,
          title: '文法機能・形式の識別',
          question: `語形「${targetForm.mongolian}」は、原形「${family.lemma}」のどのような文法形式ですか？`,
          subText: `意味: ${targetForm.japanese}`,
          choices,
          correctAnswer: correct,
          explanation: `「${targetForm.mongolian}」の形式は【${correct}】です。${targetForm.ruleDesc}`
        };
      }
    }
  }

  renderQuiz() {
    const qState = this.activeQuiz;
    const currentQ = qState.questions[qState.currentIndex];
    const total = qState.questions.length;
    const isLast = qState.currentIndex === total - 1;

    this.container.innerHTML = `
      <div class="max-w-2xl mx-auto px-4 py-6 space-y-5">
        
        <!-- プログレスバー ＆ 中断ボタン -->
        <div class="flex items-center justify-between gap-4">
          <button type="button" id="btn-quit-quiz" class="text-xs font-bold text-slate-400 hover:text-slate-600 flex items-center gap-1 cursor-pointer">
            <span>✕</span> 中断する
          </button>
          <div class="flex-1 space-y-1">
            <div class="flex justify-between text-[11px] font-bold text-slate-500">
              <span>第 ${qState.currentIndex + 1} 問 / 全 ${total} 問</span>
              <span>スコア: ${qState.score}点</span>
            </div>
            <div class="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <div class="h-full bg-emerald-500 transition-all duration-300" style="width: ${((qState.currentIndex + 1) / total) * 100}%"></div>
            </div>
          </div>
        </div>

        <!-- 問題カード -->
        <div class="bg-white rounded-3xl p-6 border border-slate-200 shadow-lg space-y-5">
          <div class="flex items-center justify-between">
            <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-black border border-indigo-100">
              <span>🎯</span> ${currentQ.title}
            </span>
            ${qState.streak >= 2 ? `
              <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-orange-100 text-orange-700 font-black text-xs animate-bounce">
                🔥 ${qState.streak} 連続正解!
              </span>
            ` : ''}
          </div>

          <div class="space-y-1">
            <h2 class="text-lg sm:text-xl font-black text-slate-900 leading-snug whitespace-pre-line">
              ${currentQ.question}
            </h2>
            ${currentQ.subText ? `
              <p class="text-xs sm:text-sm font-bold text-emerald-700">
                ${currentQ.subText}
              </p>
            ` : ''}
          </div>

          <!-- 4択選択肢 -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            ${currentQ.choices.map((choice, idx) => {
              let btnClass = "p-4 rounded-2xl border-2 text-left font-bold text-sm transition-all flex items-center justify-between cursor-pointer ";
              if (!qState.isAnswered) {
                btnClass += "border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/50 bg-white active:scale-98 text-slate-800";
              } else {
                if (choice === currentQ.correctAnswer) {
                  btnClass += "border-emerald-500 bg-emerald-50 text-emerald-900 font-black ring-2 ring-emerald-300";
                } else if (choice === qState.userAnswer) {
                  btnClass += "border-rose-500 bg-rose-50 text-rose-900 line-through";
                } else {
                  btnClass += "border-slate-100 bg-slate-50 text-slate-400 opacity-60";
                }
              }

              return `
                <button type="button" class="btn-quiz-choice ${btnClass}" data-choice="${choice}" ${qState.isAnswered ? 'disabled' : ''}>
                  <span class="flex items-center gap-2">
                    <span class="w-6 h-6 rounded-full bg-slate-100 text-slate-600 text-xs flex items-center justify-center font-bold">
                      ${idx + 1}
                    </span>
                    <span class="cyrillic-text font-black text-base">${choice}</span>
                  </span>
                  ${qState.isAnswered && choice === currentQ.correctAnswer ? '<span class="text-emerald-600 text-lg">⭕</span>' : ''}
                  ${qState.isAnswered && choice === qState.userAnswer && choice !== currentQ.correctAnswer ? '<span class="text-rose-600 text-lg">❌</span>' : ''}
                </button>
              `;
            }).join('')}
          </div>

          <!-- 回答後の解説エリア -->
          ${qState.isAnswered ? `
            <div class="p-4 rounded-2xl ${qState.userAnswer === currentQ.correctAnswer ? 'bg-emerald-50 border border-emerald-200 text-emerald-950' : 'bg-rose-50 border border-rose-200 text-rose-950'} space-y-2 animate-fadeIn">
              <div class="flex items-center justify-between font-black text-sm">
                <span>${qState.userAnswer === currentQ.correctAnswer ? '🎉 正解です！ (+15 XP)' : '❌ 不正解...'}</span>
                <span class="text-xs text-slate-500">正解: <strong>${currentQ.correctAnswer}</strong></span>
              </div>
              <p class="text-xs leading-relaxed font-medium">
                ${currentQ.explanation}
              </p>
            </div>

            <button type="button" id="btn-next-question" class="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-black text-sm shadow-md transition-all cursor-pointer">
              ${isLast ? '結果を見る ➔' : '次の問題へ ➔'}
            </button>
          ` : ''}

        </div>

      </div>
    `;

    // 選択肢クリック
    this.container.querySelectorAll('.btn-quiz-choice').forEach(btn => {
      btn.addEventListener('click', () => {
        if (qState.isAnswered) return;
        const choice = btn.getAttribute('data-choice');
        this.handleAnswer(choice);
      });
    });

    // 次へ
    const nextBtn = this.container.querySelector('#btn-next-question');
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        if (isLast) {
          this.finishQuiz();
        } else {
          qState.currentIndex += 1;
          qState.isAnswered = false;
          qState.userAnswer = null;
          this.render();
        }
      });
    }

    // 中断
    const quitBtn = this.container.querySelector('#btn-quit-quiz');
    if (quitBtn) {
      quitBtn.addEventListener('click', () => {
        if (confirm('テストを中断してファミリー一覧に戻りますか？')) {
          this.activeQuiz = null;
          this.render();
        }
      });
    }
  }

  handleAnswer(choice) {
    const qState = this.activeQuiz;
    const currentQ = qState.questions[qState.currentIndex];
    const isCorrect = choice === currentQ.correctAnswer;

    qState.userAnswer = choice;
    qState.isAnswered = true;

    if (isCorrect) {
      qState.score += 10;
      qState.streak += 1;
      if (typeof GamificationService !== 'undefined' && GamificationService.addXp) {
        GamificationService.addXp(15, '単語ファミリーテスト正解');
      }
    } else {
      qState.streak = 0;
      // 不正解の場合は間違いノートに記録
      try {
        if (typeof StorageService !== 'undefined' && StorageService.recordMistake) {
          StorageService.recordMistake({
            question: currentQ.question,
            correctAnswer: currentQ.correctAnswer,
            userAnswer: choice,
            type: 'word_family',
            category: '単語ファミリー',
            explanation: currentQ.explanation
          });
        }
      } catch (_) {}
    }

    // 習熟度記録
    StorageService.recordFamilyQuizResult(currentQ.familyId, currentQ.formId, isCorrect);

    // ファミリーが今まさに「完全習得」に達したか確認
    const masteryStatus = StorageService.getFamilyMasteryStatus(currentQ.familyId);
    if (masteryStatus.mastered && !currentQ.alreadyCelebrated) {
      currentQ.alreadyCelebrated = true;
      if (typeof GamificationService !== 'undefined' && GamificationService.addXp) {
        GamificationService.addXp(100, '👑 単語ファミリー完全習得ボーナス');
      }
    }

    this.render();
  }

  finishQuiz() {
    const qState = this.activeQuiz;
    const total = qState.questions.length;
    const correctCount = qState.score / 10;
    const percent = Math.round((correctCount / total) * 100);

    this.container.innerHTML = `
      <div class="max-w-md mx-auto px-4 py-12 text-center space-y-6">
        <div class="w-20 h-20 rounded-full mx-auto flex items-center justify-center text-4xl ${percent >= 80 ? 'bg-amber-100 text-amber-600 border-2 border-amber-300 ring-4 ring-amber-100' : 'bg-emerald-100 text-emerald-600'}">
          ${percent >= 80 ? '👑' : '🎉'}
        </div>

        <div class="space-y-2">
          <h2 class="text-2xl font-black text-slate-900">
            テスト完了！
          </h2>
          <p class="text-sm font-bold text-slate-500">
            全 ${total} 問中 <strong>${correctCount}</strong> 問正解（正解率 ${percent}%）
          </p>
        </div>

        <div class="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm text-left text-xs space-y-2">
          <div class="font-bold text-slate-700">習熟度への反映:</div>
          <p class="text-slate-500 leading-relaxed">
            各語形の正解・不正解が個別に記録されました。重要な全活用形を正解できるようになるとファミリーが「👑 完全習得」になります！
          </p>
        </div>

        <div class="flex flex-col gap-2.5">
          <button type="button" id="btn-retry-quiz" class="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-black text-sm shadow-md transition-all cursor-pointer">
            もう一度テストする
          </button>
          <button type="button" id="btn-back-to-families" class="w-full py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm transition-all cursor-pointer">
            ファミリー一覧へ戻る
          </button>
        </div>
      </div>
    `;

    const retryBtn = this.container.querySelector('#btn-retry-quiz');
    if (retryBtn) {
      retryBtn.addEventListener('click', () => {
        this.startQuiz(qState.targetFamilyId);
      });
    }

    const backBtn = this.container.querySelector('#btn-back-to-families');
    if (backBtn) {
      backBtn.addEventListener('click', () => {
        this.activeQuiz = null;
        this.render();
      });
    }
  }
}
'''

# Write to js/components/WordFamilyComponent.js and dist/js/components/WordFamilyComponent.js
with open('js/components/WordFamilyComponent.js', 'w', encoding='utf-8') as f:
    f.write(component_code)
os.makedirs('dist/js/components', exist_ok=True)
with open('dist/js/components/WordFamilyComponent.js', 'w', encoding='utf-8') as f:
    f.write(component_code)
print("Successfully generated WordFamilyComponent.js in js/ and dist/!")
