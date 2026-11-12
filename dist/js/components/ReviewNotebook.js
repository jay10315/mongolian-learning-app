import { spatialQuizzes } from '../data/spatialPostpositionData.js';
// 間違いノート・復習コンポーネント
import { StorageService } from '../services/storage.js';
import { SrsService } from '../services/srs.js';
import { SpeechService } from '../services/speech.js';
import { CyrillicKeyboard } from './CyrillicKeyboard.js';
import { isFuzzyMatch, isVerb, getWordGrammarDetails, isWordAnswerMatch, renderGrammarExplanationHTML, formatStructuredExplanationHTML, getWordSynonymExplanation, SoundEffects, shuffleArray, SPECIAL_CYRILLIC_BAR, renderCyrillicInputAssistantHTML, bindCyrillicInputAssistant, scrollToQuizTop } from '../utils/helpers.js';

export class ReviewNotebookComponent {
  static activeKeyHandler = null;

  static cleanupKeyHandler() {
    if (this.activeKeyHandler) {
      window.removeEventListener('keydown', this.activeKeyHandler);
      this.activeKeyHandler = null;
    }
  }

  static state = {
    filterType: 'all', // 'all' | 'word' | 'grammar' | 'declension' | 'flashcard'
    showResolved: false,
    testingMode: false,
    testView: 'question', // 'question' | 'result'
    testList: [],
    testIndex: 0,
    currentTestItem: null,
    userAnswer: '',
    hasAnswered: false,
    isCorrect: false,
    testResults: [],
    resultFilter: 'all',
    hasRecordedHistory: false
  };

  static render(container, onNavigate) {
    this.container = container;
    this.onNavigate = onNavigate;

    if (this.state.testingMode) {
      if (this.state.testView === 'result') {
        this.renderReviewResult();
      } else {
        this.renderReviewTesting();
      }
    } else {
      this.renderNotebook();
    }
  }

  // --- 0. 統合復習データ取得（間違えた問題・調べた単語・要復習SRS単語） ---
  static getUnifiedReviewItems() {
    // 1. 間違いノートの問題
    const mistakes = StorageService.getMistakes().map(m => ({
      ...m,
      sourceType: 'mistake',
      sourceLabel: '間違い問題'
    }));

    // 2. 読解やタイピングで調べた単語
    const lookedUp = StorageService.getLookedUpWords().map(w => ({
      id: `lookup_${w.id || w.dictForm || w.rawWord}`,
      sourceType: 'looked_up',
      type: 'looked_up',
      category: '調べた単語',
      sourceLabel: '調べた単語',
      question: `【調べた単語】${w.meaning}`,
      correctAnswer: w.dictForm || w.rawWord,
      userAnswer: '',
      explanation: `文中: ${w.rawWord || ''} / 辞書形: ${w.dictForm || ''} / 意味: ${w.meaning} (${w.pos || ''}) ${w.pron ? '発音: ' + w.pron : ''}`,
      wrongCount: w.lookupCount || 1,
      lastWrongDate: w.lookedUpAt || w.lastLookedUpAt || new Date().toISOString(),
      resolved: !!(w.resolved || w.isMastered),
      rawLookup: w
    }));

    // 3. 忘却曲線で振り返るべき単語 (SRS復習期日 & 高忘却リスク単語)
    const dueSet = new Set();
    const rawDueWords = StorageService.getDueReviewWords();
    const rawHighRiskWords = StorageService.getHighRiskWords();
    const combinedSrsWords = [];

    rawDueWords.forEach(w => {
      if (!StorageService.isWordClearedForToday(w.id, [w.mongolian, w.dictForm])) {
        dueSet.add(w.id);
        combinedSrsWords.push({
          ...w,
          _label: '要復習(SRS期日)'
        });
      }
    });

    rawHighRiskWords.forEach(w => {
      if (!dueSet.has(w.id) && !StorageService.isWordClearedForToday(w.id, [w.mongolian, w.dictForm])) {
        dueSet.add(w.id);
        combinedSrsWords.push({
          ...w,
          _label: '忘却リスク高'
        });
      }
    });

    const dueWords = combinedSrsWords.map(w => ({
      id: `due_${w.id}`,
      srsWordId: w.id,
      wordId: w.id,
      sourceType: 'due_review',
      type: 'word',
      category: '要復習(SRS)',
      sourceLabel: w._label || '要復習(SRS)',
      question: `【${w._label || '要復習'}】${w.japanese}`,
      correctAnswer: w.dictForm || w.mongolian,
      userAnswer: '',
      explanation: `${w.mongolian} = ${w.japanese}（SRSレベル: ${w.srsLevel || 0} / 忘却リスク: ${w.forgettingRisk || 0}%）`,
      wrongCount: w.wrongCount || 1,
      lastWrongDate: w.lastReviewed || new Date().toISOString(),
      resolved: false,
      retention: w.retention
    }));

    return { mistakes, lookedUp, dueWords, all: [...mistakes, ...lookedUp, ...dueWords] };
  }

  // --- 1. ノート一覧表示 ---
  static renderNotebook() {
    const unified = this.getUnifiedReviewItems();
    let filtered = unified.all;

    if (this.state.filterType === 'mistake') {
      filtered = unified.mistakes;
    } else if (this.state.filterType === 'looked_up') {
      filtered = unified.lookedUp;
    } else if (this.state.filterType === 'due_review') {
      filtered = unified.dueWords;
    } else if (this.state.filterType !== 'all') {
      filtered = unified.mistakes.filter(m => m.type === this.state.filterType);
    }

    if (!this.state.showResolved) {
      filtered = filtered.filter(m => !m.resolved);
    }

    const activeMistakes = unified.mistakes.filter(m => !m.resolved).length;
    const activeLookedUp = unified.lookedUp.filter(m => !m.resolved).length;
    const activeDue = unified.dueWords.filter(m => !m.resolved).length;
    const totalActive = activeMistakes + activeLookedUp + activeDue;
    const totalResolved = unified.all.filter(m => m.resolved).length;

    const countActiveByType = (t) => unified.mistakes.filter(m => !m.resolved && m.type === t).length;
    const activeGrammar = countActiveByType('grammar');
    const activeDeclension = countActiveByType('declension');
    const activeWord = countActiveByType('word');
    const activeReading = countActiveByType('reading');
    const activeListening = countActiveByType('listening');
    const activeWordFamily = countActiveByType('word_family');
    const activeCulture = countActiveByType('culture');
    const activeTyping = countActiveByType('typing');

    const currentFilterActive = filtered.filter(m => !m.resolved).length;

    this.container.innerHTML = `
      <div class="animate-fade-in max-w-2xl mx-auto px-4 py-4 space-y-5">
        
        <!-- ヘッダー -->
        <div class="flex items-center justify-between border-b border-slate-200 pb-3">
          <div class="flex items-center gap-2">
            <span class="text-2xl">🔥</span>
            <div>
              <h2 class="text-lg font-bold text-slate-800">復習ノート（間違い・調べた単語・要復習統合）</h2>
              <p class="text-xs text-slate-500">未克服・復習待ち項目: <span class="font-bold text-rose-600">${totalActive}</span> 件</p>
            </div>
          </div>
          <button type="button" id="btn-back-home" class="text-xs text-slate-500 hover:text-slate-800">
            ✕ ホームへ
          </button>
        </div>

        <!-- 4大カテゴリーサマリーカード（得意同期状況） -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
          <div class="bg-rose-50 border border-rose-200 p-2.5 rounded-xl">
            <div class="text-[10px] text-rose-700 font-bold">🔥 間違い問題</div>
            <div class="text-base font-black text-rose-900 mt-0.5">${activeMistakes} 問</div>
          </div>
          <div class="bg-amber-50 border border-amber-200 p-2.5 rounded-xl">
            <div class="text-[10px] text-amber-700 font-bold">📌 調べた単語</div>
            <div class="text-base font-black text-amber-900 mt-0.5">${activeLookedUp} 語</div>
          </div>
          <div class="bg-sky-50 border border-sky-200 p-2.5 rounded-xl">
            <div class="text-[10px] text-sky-700 font-bold">⏰ 振り返るべき単語</div>
            <div class="text-base font-black text-sky-900 mt-0.5">${activeDue} 語</div>
          </div>
          <div class="bg-emerald-50 border border-emerald-200 p-2.5 rounded-xl">
            <div class="text-[10px] text-emerald-700 font-bold">✓ 克服済み（得意）</div>
            <div class="text-base font-black text-emerald-900 mt-0.5">${totalResolved} 件</div>
          </div>
        </div>

        <!-- 復習開始アクションボタン群 -->
        ${currentFilterActive > 0 ? `
          <div class="bg-gradient-to-r from-rose-500 via-amber-500 to-teal-500 rounded-2xl p-4 text-white shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div class="text-sm font-black flex items-center gap-1.5">
                <span>⚡</span> まとめて復習特訓（正解で得意へ同期！）
              </div>
              <div class="text-xs text-amber-100">
                選択中カテゴリーに <strong class="text-white text-sm">${currentFilterActive}</strong> 件の項目があります。
              </div>
            </div>
            <div class="flex flex-wrap items-center gap-2">
              <div class="flex items-center gap-1.5 bg-white/20 backdrop-blur-xs px-2.5 py-1 rounded-xl text-xs font-bold text-white">
                <span>出題数:</span>
                <input type="number" id="input-custom-review-count" min="1" max="${currentFilterActive}"
                  class="w-16 px-1.5 py-0.5 text-center font-bold text-xs bg-white text-slate-800 rounded-lg focus:outline-hidden shadow-2xs"
                  placeholder="全問"
                  value="">
                <span>問</span>
              </div>
              <button type="button" id="btn-start-all-review" class="px-4 py-2 bg-white text-slate-900 hover:bg-amber-50 text-xs font-black rounded-xl shadow-xs transition-all active:scale-95 cursor-pointer">
                復習特訓スタート (${currentFilterActive}問)
              </button>
            </div>
          </div>
        ` : `
          <div class="bg-emerald-50 rounded-2xl p-5 border border-emerald-200 text-center space-y-1">
            <div class="text-3xl">🎉</div>
            <div class="text-sm font-bold text-emerald-900">このカテゴリーに未克服の項目はありません！</div>
            <div class="text-xs text-emerald-700">素晴らしい習熟度です。新しいテストや読解・タイピングに挑戦しましょう！</div>
          </div>
        `}

        <!-- フィルターバー -->
        <div class="flex flex-wrap items-center justify-between gap-2 bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
          <div class="flex items-center gap-1 overflow-x-auto scrollbar-none text-xs">
            ${[
              { id: 'all', label: `すべて (${totalActive})` },
              { id: 'mistake', label: `🔥 間違い (${activeMistakes})` },
              { id: 'looked_up', label: `📌 調べた単語 (${activeLookedUp})` },
              { id: 'due_review', label: `⏰ 要復習 (${activeDue})` },
              { id: 'grammar', label: `文法 (${activeGrammar})` },
              { id: 'declension', label: `格変化・活用 (${activeDeclension})` },
              { id: 'word', label: `単語 (${activeWord})` },
              { id: 'reading', label: `読解 (${activeReading})` },
              { id: 'listening', label: 'リスニング' },
              { id: 'word_family', label: `類義語・語根 (${activeWordFamily})` },
              { id: 'culture', label: `文化 (${activeCulture})` },
              { id: 'typing', label: `タイピング (${activeTyping})` }
            ].map(f => `
              <button type="button" class="btn-filter-type px-2.5 py-1.5 rounded-lg font-bold transition-all whitespace-nowrap cursor-pointer ${
                this.state.filterType === f.id ? 'bg-slate-800 text-white' : 'text-slate-600 hover:bg-slate-100'
              }" data-type="${f.id}">
                ${f.label}
              </button>
            `).join('')}
          </div>

          <div class="flex items-center gap-2 shrink-0 flex-wrap">
            <label class="flex items-center gap-1.5 text-xs text-slate-600 cursor-pointer select-none">
              <input type="checkbox" id="check-show-resolved" ${this.state.showResolved ? 'checked' : ''} class="rounded text-emerald-600 focus:ring-0">
              <span>克服済みも表示</span>
            </label>
            <button type="button" id="btn-dedupe-mistakes" class="text-[11px] px-2.5 py-1 rounded-lg border border-slate-300 hover:bg-slate-100 text-slate-600 font-semibold cursor-pointer transition-all flex items-center gap-1" title="同じ単語の複数記録を1つに統合">
              <span>🧹</span> 重複を整理
            </button>
            ${totalResolved > 0 ? `
              <button type="button" id="btn-clear-resolved" class="text-[11px] px-2.5 py-1 rounded-lg border border-slate-300 hover:bg-slate-100 text-slate-600 font-semibold cursor-pointer transition-all flex items-center gap-1">
                <span>🗑️</span> 覚えた項目を一括整理
              </button>
            ` : ''}
          </div>
        </div>

        <!-- 復習ノート一覧カード -->
        <div class="space-y-3">
          ${(() => {
            if (filtered.length === 0) {
              return `
                <div class="text-center py-10 text-slate-400 text-xs bg-white rounded-xl border border-slate-200">
                  該当する項目はありません。
                </div>
              `;
            }
            // 単語検索・パーサーの高速化インデックス（1回のみ事前構築）
            const allWords = StorageService.getVocabulary();
            const wordById = new Map();
            const wordByAns = new Map();
            const cleanKey = (str) => (str || '').toLowerCase().replace(/[\(\)\（\）\s.,!?-]/g, '');
            allWords.forEach(w => {
              if (w.id) wordById.set(w.id, w);
              const mn = cleanKey(w.mongolian);
              const df = cleanKey(w.dictForm);
              const rt = cleanKey(w.root);
              if (mn && !wordByAns.has(mn)) wordByAns.set(mn, w);
              if (df && !wordByAns.has(df)) wordByAns.set(df, w);
              if (rt && !wordByAns.has(rt)) wordByAns.set(rt, w);
            });
            const sortedWords = [...allWords].sort((a, b) => 
              ((b.dictForm || b.mongolian || '').length) - ((a.dictForm || a.mongolian || '').length)
            );
            const vocabContext = { allWords, wordById, wordByAns, sortedWords };

            return filtered.map(m => {
            const dateStr = new Date(m.lastWrongDate).toLocaleDateString('ja-JP', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
            const parsed = ReviewNotebookComponent.parseReviewItem(m, vocabContext);
            const sourceBadge = m.sourceType === 'looked_up' 
              ? 'bg-amber-100 text-amber-900 border-amber-300' 
              : (m.sourceType === 'due_review' 
                ? 'bg-sky-100 text-sky-900 border-sky-300' 
                : 'bg-rose-100 text-rose-800 border-rose-300');
            const statusBadge = m.resolved 
              ? 'bg-emerald-100 text-emerald-800' 
              : (m.sourceType === 'looked_up' 
                ? 'bg-amber-100 text-amber-900' 
                : (m.sourceType === 'due_review' 
                  ? 'bg-sky-100 text-sky-900' 
                  : `bg-rose-100 text-rose-800`));
            const statusLabel = m.resolved 
              ? '✓ 克服済み（得意）' 
              : (m.sourceType === 'looked_up' 
                ? '📌 調べた単語' 
                : (m.sourceType === 'due_review' 
                  ? '⏰ 復習期日(SRS)' 
                  : `🔥 誤答 ${m.wrongCount || 1}回`));

            return `
              <div class="bg-white rounded-xl p-4 border ${m.resolved ? 'border-emerald-200 bg-emerald-50/20' : (m.sourceType === 'looked_up' ? 'border-amber-200' : (m.sourceType === 'due_review' ? 'border-sky-200' : 'border-rose-200'))} shadow-2xs space-y-2">
                <div class="flex justify-between items-start gap-2">
                  <div class="flex items-center gap-2 flex-wrap">
                    <span class="text-xs font-bold px-2 py-0.5 rounded-full ${statusBadge}">
                      ${statusLabel}
                    </span>
                    ${!m.resolved ? `
                      <span class="text-[11px] font-bold px-2 py-0.5 rounded-full ${
                        (m.consecutiveCorrect || 0) >= 2 ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' :
                        (m.consecutiveCorrect || 0) === 1 ? 'bg-sky-100 text-sky-900 border border-sky-300' :
                        'bg-slate-100 text-slate-600'
                      }">
                        🎯 2回正解で克服: ${m.consecutiveCorrect || 0}/2回 ${m.consecutiveCorrect ? '✨' : ''}
                      </span>
                    ` : `
                      <span class="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                        🎉 2回正解達成（克服済み）
                      </span>
                    `}
                    <span class="text-[11px] text-slate-400">${m.sourceLabel || m.category || m.type}</span>
                  </div>
                  <div class="flex items-center gap-1.5">
                    <button type="button" class="btn-toggle-resolve text-[11px] px-2 py-0.5 rounded border ${
                      m.resolved ? 'bg-slate-100 text-slate-600 border-slate-300' : 'bg-emerald-50 text-emerald-700 border-emerald-300 font-bold'
                    }" data-id="${m.id || ''}" data-source="${m.sourceType || 'mistake'}" data-srs-id="${m.srsWordId || ''}" data-question="${encodeURIComponent(m.question || '')}" data-answer="${encodeURIComponent(m.correctAnswer || '')}" data-word-id="${m.wordId || ''}" data-resolved="${m.resolved}">
                      ${m.resolved ? '未克服に戻す' : '✓ 覚えた（間違えた単語から消す）'}
                    </button>
                    <button type="button" class="btn-delete-mistake text-slate-300 hover:text-rose-500 text-xs px-1 cursor-pointer" data-id="${m.id || ''}" data-source="${m.sourceType || 'mistake'}" data-question="${encodeURIComponent(m.question || '')}" data-answer="${encodeURIComponent(m.correctAnswer || '')}" data-word-id="${m.wordId || ''}" title="削除">
                      ✕
                    </button>
                  </div>
                </div>

                <!-- 問題文（イラスト付き・答えの漏洩を防止） -->
                <div class="flex items-center gap-2.5">
                  ${(!parsed.isExplicitNonWord && typeof getWordIllustrationHTML === 'function') ? getWordIllustrationHTML({ mongolian: m.correctAnswer, japanese: m.japanese || parsed.promptText }, { size: 'sm' }) : ''}
                  <div class="text-sm font-bold text-slate-800 dark:text-white cyrillic-text flex items-center gap-1.5 flex-wrap">
                    <span class="text-xs px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold">${parsed.displayPrefix}</span>
                    <span>${parsed.promptText}</span>
                  </div>
                </div>

                <!-- 回答対比または単語意味 -->
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
                  ${m.userAnswer ? `
                    <div class="p-2 bg-rose-50/80 rounded-lg text-rose-900">
                      <span class="text-slate-400 text-[10px] block">あなたの直前の回答:</span>
                      <span class="font-semibold line-through">${m.userAnswer}</span>
                    </div>
                  ` : `
                    <div class="p-2 bg-slate-50 rounded-lg text-slate-600">
                      <span class="text-slate-400 text-[10px] block">学習タイプ:</span>
                      <span class="font-semibold">${m.sourceLabel || '弱点復習'}</span>
                    </div>
                  `}
                  ${(() => {
                    const displayAns = m.correctAnswer || m.answer || m.mongolian || (parsed && (parsed.correctAns || (parsed.matchedWord ? (parsed.matchedWord.dictForm || parsed.matchedWord.mongolian) : ''))) || '';
                    return `
                      <div class="p-2 bg-emerald-50/80 rounded-lg text-emerald-950">
                        <span class="text-slate-400 text-[10px] block">${parsed.isExplicitNonWord ? '正解:' : '正しい解答（見出し語）:'}</span>
                        <span class="font-bold cyrillic-text text-emerald-800 correct-answer-text">${displayAns || '（正解確認中）'}</span>
                      </div>
                    `;
                  })()}
                </div>

                <!-- 解説（必ず表示・確認可能に） -->
                ${(() => {
                  const displayExpl = m.explanation || (parsed && parsed.matchedWord ? `${parsed.matchedWord.mongolian} = ${parsed.matchedWord.japanese}` : '');
                  if (!displayExpl) return '';
                  return `
                    <div class="text-[11px] text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100 leading-relaxed whitespace-pre-line">
                      💡 ${displayExpl}
                    </div>
                  `;
                })()}

                <div class="text-[10px] text-slate-400 text-right">
                  記録日時: ${dateStr}
                </div>
              </div>
            `;
          }).join('');
          })()}
        </div>

      </div>
    `;

    this.bindNotebookEvents();
  }

  static bindNotebookEvents() {
    const homeBtn = this.container.querySelector('#btn-back-home');
    if (homeBtn) {
      homeBtn.addEventListener('click', () => {
        if (this.onNavigate) this.onNavigate('home');
      });
    }

    // フィルターボタン
    this.container.querySelectorAll('.btn-filter-type').forEach(btn => {
      btn.addEventListener('click', () => {
        this.state.filterType = btn.getAttribute('data-type');
        this.renderNotebook();
      });
    });

    // 克服済み表示トグル
    const checkResolved = this.container.querySelector('#check-show-resolved');
    if (checkResolved) {
      checkResolved.addEventListener('change', (e) => {
        this.state.showResolved = e.target.checked;
        this.renderNotebook();
      });
    }

    const clearResolvedBtn = this.container.querySelector('#btn-clear-resolved');
    if (clearResolvedBtn) {
      clearResolvedBtn.addEventListener('click', () => {
        if (confirm('覚えた（克服済み）項目を一覧から完全に整理・消去しますか？\n（未克服の間違えた問題はそのまま残ります）')) {
          StorageService.clearResolvedMistakes();
          this.renderNotebook();
        }
      });
    }

    const dedupeBtn = this.container.querySelector('#btn-dedupe-mistakes');
    if (dedupeBtn) {
      dedupeBtn.addEventListener('click', () => {
        const before = StorageService.getMistakes().length;
        StorageService.deduplicateMistakesAndSave();
        const after = StorageService.getMistakes().length;
        if (before > after) {
          alert(`重複していた ${before - after} 件の単語を1つに整理・統合しました！`);
        } else {
          alert('重複している単語はありません。すべて綺麗に整理されています。');
        }
        this.renderNotebook();
      });
    }

    // 克服トグル
    this.container.querySelectorAll('.btn-toggle-resolve').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.getAttribute('data-id');
        const sourceType = btn.getAttribute('data-source');
        const srsId = btn.getAttribute('data-srs-id');
        const currentResolved = btn.getAttribute('data-resolved') === 'true';
        const qRaw = decodeURIComponent(btn.getAttribute('data-question') || '');
        const aRaw = decodeURIComponent(btn.getAttribute('data-answer') || '');
        const wId = btn.getAttribute('data-word-id') || '';

        if (sourceType === 'looked_up') {
          StorageService.markLookedUpWordResolved((id || '').replace(/^lookup_/, '') || aRaw, !currentResolved);
        } else if (sourceType === 'due_review') {
          if (srsId) StorageService.recordWordAnswer(srsId, !currentResolved, 'good');
        } else {
          StorageService.markMistakeResolved(id, !currentResolved, {
            question: qRaw,
            correctAnswer: aRaw,
            wordId: wId
          });
        }
        this.renderNotebook();
      });
    });

    // 削除
    this.container.querySelectorAll('.btn-delete-mistake').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.getAttribute('data-id');
        const sourceType = btn.getAttribute('data-source');
        const qRaw = decodeURIComponent(btn.getAttribute('data-question') || '');
        const aRaw = decodeURIComponent(btn.getAttribute('data-answer') || '');
        const wId = btn.getAttribute('data-word-id') || '';

        if (confirm('この記録を削除しますか？')) {
          if (sourceType === 'looked_up') {
            StorageService.deleteLookedUpWord((id || '').replace(/^lookup_/, '') || aRaw);
          } else if (sourceType === 'due_review') {
            // SRS復習は完了扱いにして先送り
            const srsId = btn.getAttribute('data-srs-id');
            if (srsId) StorageService.recordWordAnswer(srsId, true, 'easy');
          } else {
            StorageService.removeMistake(id, {
              question: qRaw,
              correctAnswer: aRaw,
              wordId: wId
            });
          }
          this.renderNotebook();
        }
      });
    });

    // 特訓テスト開始
    const startAllBtn = this.container.querySelector('#btn-start-all-review');
    if (startAllBtn) {
      startAllBtn.addEventListener('click', () => {
        const unified = this.getUnifiedReviewItems();
        let targetList = unified.all;
        if (this.state.filterType === 'mistake') {
          targetList = unified.mistakes;
        } else if (this.state.filterType === 'looked_up') {
          targetList = unified.lookedUp;
        } else if (this.state.filterType === 'due_review') {
          targetList = unified.dueWords;
        } else if (this.state.filterType !== 'all') {
          targetList = unified.mistakes.filter(m => m.type === this.state.filterType);
        }
        const active = targetList.filter(m => !m.resolved);
        if (active.length === 0) return;
        this.state.testList = shuffleArray(active);
        this.state.testIndex = 0;
        this.state.testResults = [];
        this.state.resultFilter = 'all';
        this.state.hasRecordedHistory = false;
        this.state.testingMode = true;
        this.state.testView = 'question';
        this.loadReviewQuestion(0);
      });
    }
  }

  // --- 2. 復習テスト実行画面 ---
  /**
   * 復習問題の出題内容を解析し、問題文から答えの漏洩を除去してクリーンに抽出する
   */
  static parseReviewItem(item, context = null) {
    if (!item) return { promptText: '', displayPrefix: '', categoryLabel: '', isCyrillicAnswer: false, placeholder: '正解を入力...', subHint: '', matchedWord: null, details: null, isVerb: false };

    let rawQ = (item.question || item.prompt || '').trim();
    let correctAns = (item.correctAnswer || item.answer || item.mongolian || '').trim();

    // 未設定の場合は空間・指示詞や各種クイズデータから検索して補完
    const normPrompt = (str) => (str || '').replace(/^【[^】]+】\s*/g, '').replace(/_+/g, '_').replace(/[【】\[\]()（）\s.,!?:;«»"'\-]/g, '').trim().toLowerCase();
    const qNorm = normPrompt(rawQ);

    // 過去の古い不十分な設問名（例: 【疑問形】単体）を完全な設問文に自動補正
    if (!qNorm || qNorm === '疑問形' || qNorm === '疑問文' || qNorm === '文法') {
      const gqFix = (typeof initialGrammarQuizzes !== 'undefined' && initialGrammarQuizzes)
        ? initialGrammarQuizzes.find(x => x.id === item.id || (correctAns && x.answer === correctAns))
        : null;
      if (gqFix && gqFix.question) {
        rawQ = gqFix.question;
        correctAns = gqFix.answer;
        item.question = gqFix.question;
        item.correctAnswer = gqFix.answer;
        if (!item.explanation) item.explanation = gqFix.explanation;
      }
    }

    if (!correctAns) {
      const sq = (typeof spatialQuizzes !== 'undefined' && spatialQuizzes) ? spatialQuizzes.find(x => x.id === item.id || (qNorm && normPrompt(x.prompt) === qNorm)) : null;
      if (sq) {
        correctAns = sq.answer;
        item.correctAnswer = sq.answer;
        if (!item.explanation) item.explanation = sq.explanation;
        if (!item.options || item.options.length === 0) item.options = sq.options;
        if (!item.japanese) item.japanese = sq.promptJa;
      }
      const gq = (typeof initialGrammarQuizzes !== 'undefined' && initialGrammarQuizzes) ? initialGrammarQuizzes.find(x => x.id === item.id || (qNorm && normPrompt(x.question) === qNorm)) : null;
      if (gq) {
        correctAns = gq.answer;
        item.correctAnswer = gq.answer;
        if (!item.explanation) item.explanation = gq.explanation;
        if (!item.options || item.options.length === 0) item.options = gq.options || [];
      }
      const dq = (typeof initialDeclensionQuizzes !== 'undefined' && initialDeclensionQuizzes) ? initialDeclensionQuizzes.find(x => x.id === item.id || (qNorm && normPrompt(x.question) === qNorm)) : null;
      if (dq) {
        correctAns = dq.answer;
        item.correctAnswer = dq.answer;
        if (!item.explanation) item.explanation = dq.explanation;
        if (!item.options || item.options.length === 0) item.options = dq.options || [];
      }
    }
    // 辞書形・語幹などの不要な括弧指示を除去
    rawQ = rawQ.replace(/[（\(]\s*(辞書形|語幹)\s*[）\)]/g, '').trim();
    correctAns = correctAns.replace(/[（\(]\s*(辞書形|語幹)\s*[）\)]/g, '').trim();

    // ノイズ文字列やプレフィックス（【動詞辞書形】や【動詞語幹】など）を除去
    const cleanRawQ = rawQ.replace(/【第\d+課\s*/g, '【')
      .replace(/[（\(]モンゴル語教科書語彙[）\)]/g, '')
      .replace(/[（\(]JICA訓練所[）\)]/g, '')
      .replace(/【(動詞辞書形|動詞語幹|語幹|辞書形|イラスト動詞辞書形|イラスト動詞語幹)】/g, '')
      .replace(/[（\(]\s*(辞書形|語幹)\s*[）\)]/g, '')
      .trim();
    const cleanAns = correctAns.replace(/[（\(]モンゴル語教科書語彙[）\)]/g, '').replace(/[（\(]JICA訓練所[）\)]/g, '').trim();

    const cleanKey = (str) => (str || '').toLowerCase().replace(/[\(\)（）\s.,!?-]/g, '');
    const qClean = cleanKey(cleanRawQ);
    const aClean = cleanKey(cleanAns);

    const allWords = context?.allWords || StorageService.getVocabulary();

    // 1. wordId / srsWordId による完全一致
    const targetWordId = item?.wordId || item?.srsWordId || (typeof item?.id === 'string' && item.id.startsWith('due_') ? item.id.replace(/^due_/, '') : null);
    let matchedWord = null;
    if (context?.wordById && targetWordId) {
      matchedWord = context.wordById.get(targetWordId) || null;
    } else if (targetWordId) {
      matchedWord = allWords.find(w => w.id === targetWordId) || null;
    }

    // 2. 正解キーの完全一致（インデックスマップ利用でO(1)）
    if (!matchedWord && aClean) {
      if (context?.wordByAns) {
        matchedWord = context.wordByAns.get(aClean) || null;
      } else {
        matchedWord = allWords.find(w => {
          const mnClean = cleanKey(w.mongolian);
          const dfClean = cleanKey(w.dictForm);
          const rtClean = cleanKey(w.root);
          return aClean === mnClean || aClean === dfClean || aClean === rtClean;
        }) || null;
      }
    }

    // 3. 問題文内の日本語一致（単語マスターの日本語が問題文に含まれているか）
    if (!matchedWord && qClean) {
      matchedWord = allWords.find(w => {
        const jaClean = cleanKey(w.japanese);
        return jaClean && jaClean.length >= 2 && qClean.includes(jaClean);
      }) || null;
    }

    // 4. 問題文内のモンゴル語部分一致（長い単語・連語から順に優先マッチ）
    if (!matchedWord && qClean) {
      const sortedWords = context?.sortedWords || [...allWords].sort((a, b) => 
        ((b.dictForm || b.mongolian || '').length) - ((a.dictForm || a.mongolian || '').length)
      );
      matchedWord = sortedWords.find(w => {
        const mnClean = cleanKey(w.mongolian);
        const dfClean = cleanKey(w.dictForm);
        return (mnClean && mnClean.length >= 3 && qClean.includes(mnClean)) ||
               (dfClean && dfClean.length >= 3 && qClean.includes(dfClean));
      }) || null;
    }

    const details = matchedWord ? getWordGrammarDetails(matchedWord) : null;
    const isV = details ? details.isVerb : false;
    const isCyrillicAns = /[\u0400-\u04FF]/.test(cleanAns || (matchedWord ? (details.root || details.dictForm) : ''));

    if (item && item.sourceType === 'looked_up') {
      let rawMeaning = item.rawLookup?.meaning || item.meaning || cleanRawQ.replace(/^【調べた単語】\s*/, '');
      const rawWord = item.rawLookup?.rawWord || '';
      const dictForm = item.rawLookup?.dictForm || item.correctAnswer || '';
      
      // 不自然な機械的表記「〜を持つ（共格）」を自然な日本語に補正
      rawMeaning = rawMeaning.replace(/（共格）|\(共格\)/g, '（共同格・有属）');

      return {
        promptText: rawMeaning,
        displayPrefix: '【調べた単語】',
        categoryLabel: rawWord && rawWord !== dictForm 
          ? `読解・タイピングで調べた単語（辞書形「${dictForm}」または文中形「${rawWord}」）`
          : '読解・タイピングで調べた単語',
        isCyrillicAnswer: true,
        placeholder: '辞書形（または文中形）をキリル文字で入力...',
        subHint: rawWord && rawWord !== dictForm ? `【文中形: ${rawWord}】 辞書形・文中形のどちらでも正解になります` : '',
        matchedWord: matchedWord,
        details: details,
        isVerb: isV
      };
    }

    if (item && item.sourceType === 'due_review') {
      const rawJa = (matchedWord ? matchedWord.japanese : cleanRawQ.replace(/^【(要復習|要復習\(SRS期日\)|忘却リスク高|動詞辞書形|動詞語幹|語幹|辞書形|イラスト動詞辞書形|イラスト動詞語幹|単語)】\s*/, '')).replace(/[（\(]\s*(辞書形|語幹)\s*[）\)]/g, '').trim();
      const isVerbQ = isV;
      const verbForm = item._verbTargetForm || 'dict';
      let promptPrefix = '【要復習(SRS)】';
      let promptHolder = 'キリル文字で入力...';
      let hintText = '';
      const cleanPromptJa = rawJa.replace(/[（\(]\s*(辞書形|語幹)\s*[）\)]/g, '').trim();
      if (isVerbQ) {
        if (verbForm === 'root') {
          promptPrefix = '【動詞】';
          promptHolder = '動詞の語幹をキリル文字で入力...';
          hintText = `【品詞: 動詞】活用の土台となる語幹を回答（辞書形: ${details?.dictForm || matchedWord?.dictForm || ''}）`;
        } else {
          promptPrefix = '【動詞】';
          promptHolder = '動詞の辞書形（〜х）をキリル文字で入力...';
          hintText = '【品詞: 動詞】見出し語となる辞書形（語尾-хを含める）を回答';
        }
      }
      return {
        promptText: cleanPromptJa,
        displayPrefix: promptPrefix,
        categoryLabel: `日本語に合うモンゴル語（キリル文字）を入力してください`,
        isCyrillicAnswer: true,
        placeholder: promptHolder,
        subHint: hintText,
        matchedWord: matchedWord,
        details: details,
        isVerb: isV
      };
    }

    let displayPrefix = '';
    let promptText = '';

    const is4ChoiceItem = item && item.options && Array.isArray(item.options) && item.options.length >= 2;
    const isExplicitNonWord = is4ChoiceItem || (item && item.type && item.type !== 'word' && item.type !== 'looked_up' && item.type !== 'due_review');

    if (is4ChoiceItem) {
      return {
        promptText: item.question || cleanRawQ,
        questionJa: item.questionJa || '',
        displayPrefix: '【4択模試】',
        categoryLabel: item.category ? `【${item.category}】正しい選択肢を選んでください` : 'モンゴル語の設問に合う正しい選択肢を選んでください',
        isCyrillicAnswer: false,
        placeholder: '選択肢を選んでください',
        subHint: item.questionJa ? `🇯🇵 和訳: ${item.questionJa}` : (item.explanation ? '💡 設問と4つの選択肢をよく読んで選んでください' : ''),
        matchedWord: null,
        details: null,
        isVerb: false,
        isExplicitNonWord: true,
        is4Choice: true,
        correctAns: item.correctAnswer || item.answer || cleanAns || ''
      };
    }

    // 単語マスターとマッチした場合、常にクリーンな見出し情報から出題を構成（ただし明示的に文法・格変化・読解などの非単語問題の場合は問題文を優先）
    if (matchedWord && !isExplicitNonWord) {
      if (isCyrillicAns) {
        displayPrefix = isV ? '【動詞】' : '【単語】';
        promptText = (matchedWord.japanese || '').replace(/[（\(]\s*(辞書形|語幹)\s*[）\)]/g, '').trim();
      } else {
        displayPrefix = '【日本語訳】';
        promptText = details.dictForm || matchedWord.mongolian;
      }
    } else {
      // 単語マスター以外の問題（文法・格変化・読解・リスニング等）の場合
      if (/⇄|⇆|↔|<->|->/.test(cleanRawQ)) {
        const parts = cleanRawQ.split(/⇄|⇆|↔|<->|->/);
        let sideA = parts[0].trim();
        let sideB = parts[1] ? parts[1].trim() : '';

        const prefixMatch = sideA.match(/^(【[^】]+】)\s*(.*)/);
        if (prefixMatch) {
          displayPrefix = prefixMatch[1];
          sideA = prefixMatch[2].trim();
        } else {
          displayPrefix = '【単語】';
        }

        const hasCyrA = /[\u0400-\u04FF]/.test(sideA);
        const hasCyrB = /[\u0400-\u04FF]/.test(sideB);

        if (hasCyrA && hasCyrB) {
          const w = allWords.find(x => cleanKey(x.mongolian) === cleanKey(sideA) || cleanKey(x.dictForm) === cleanKey(sideA) || cleanKey(x.root) === cleanKey(sideA));
          if (w && !isExplicitNonWord) {
            matchedWord = w;
            promptText = w.japanese;
            displayPrefix = '【単語】';
          } else {
            promptText = sideA;
          }
        } else if (isCyrillicAns) {
          promptText = !hasCyrA ? sideA : (!hasCyrB ? sideB : sideA);
        } else {
          promptText = hasCyrA ? sideA : (hasCyrB ? sideB : sideB);
        }
      } else {
        let currentRaw = cleanRawQ;
        const leadingTags = [];
        let tagMatch;
        while ((tagMatch = currentRaw.match(/^【([^】]+)】\s*/))) {
          leadingTags.push(tagMatch[1]);
          currentRaw = currentRaw.slice(tagMatch[0].length);
        }
        currentRaw = currentRaw.replace(/^\n+|\n+$/g, '').trim();

        if (leadingTags.length > 0) {
          if (leadingTags.some(t => t.includes('疑問'))) {
            displayPrefix = '【疑問文】';
          } else if (leadingTags.some(t => t.includes('文法'))) {
            displayPrefix = '【文法】';
          } else if (leadingTags.some(t => t.includes('格変化') || t.includes('活用'))) {
            displayPrefix = '【格変化・活用】';
          } else {
            displayPrefix = `【${leadingTags[0]}】`;
          }
          promptText = currentRaw;
        } else {
          const typePrefixMap = {
            grammar: '【文法】',
            declension: '【格変化・活用】',
            reading: '【読解】',
            listening: '【リスニング】',
            word_family: '【類義語・語根】',
            culture: '【文化】',
            typing: '【タイピング】',
            word: '【単語】'
          };
          displayPrefix = typePrefixMap[item.type] || '【問題】';
          promptText = cleanRawQ;
        }
      }
    }

    // 万一 promptText 内に ⇄ やノイズが残存していた場合の完全防御サニタイズ
    if (/⇄|⇆|↔|<->|->/.test(promptText)) {
      const parts = promptText.split(/⇄|⇆|↔|<->|->/);
      promptText = parts[0].trim().replace(/^【[^】]+】\s*/, '');
    }
    promptText = promptText.replace(/【第\d+課\s*/g, '【').replace(/[（\(]モンゴル語教科書語彙[）\)]/g, '').replace(/[（\(]JICA訓練所[）\)]/g, '').trim();

    // 答えの漏洩防止サニタイズ（万一 promptText に正解文字列が含まれていた場合は除去）
    if (correctAns && promptText.includes(correctAns)) {
      promptText = promptText.replace(new RegExp(correctAns.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), '___');
    }

    // байх / байхгүй の誤用自動補正
    if ((cleanAns === 'байх' || cleanAns === 'байхгүй') && (cleanRawQ.includes('ない') || cleanRawQ.includes('いない') || cleanRawQ.includes('バイフグイ'))) {
      correctAns = 'байхгүй';
    }

    // ラベルとサブヒント
    let categoryLabel = "";
    let subHint = "";
    let placeholder = "";

    if (isExplicitNonWord) {
      if (item.type === 'grammar' || item.type === 'declension') {
        const hasBlank = /\[____\]|___|＿＿|（\s*）|\(\s*\)/.test(promptText);
        if (hasBlank) {
          categoryLabel = "空欄に入る適切な文法・語尾をキリル文字で入力してください";
        } else if (displayPrefix.includes('疑問') || promptText.includes('疑問') || (correctAns && correctAns.includes('?'))) {
          categoryLabel = "日本語の意味に合うモンゴル語（疑問文）をキリル文字で入力してください";
        } else if (/問いかける|文にしなさい|表しなさい|作りなさい|訳しなさい/.test(promptText)) {
          categoryLabel = "日本語の意味に合うモンゴル語の文をキリル文字で入力してください";
        } else {
          categoryLabel = "指示に従い、指定の単語に適切な語尾・格変化を付けた形をキリル文字で入力してください";
        }
        subHint = item.category ? `【文法項目: ${item.category}】` : '';
        placeholder = (displayPrefix.includes('疑問') || /問いかける|文にしなさい|表しなさい/.test(promptText)) ? "モンゴル語の文をキリル文字で入力..." : "キリル文字で入力...";
      } else if (item.type === 'declension_alt') {
        subHint = item.category ? `【対象: ${item.category}】` : '';
        placeholder = "キリル文字で入力...";
      } else if (item.type === 'reading') {
        categoryLabel = "読解問題の正しい解答を入力してください";
        subHint = item.category ? `【本文: ${item.category}】` : '';
        placeholder = isCyrillicAns ? "キリル文字で入力..." : "日本語で解答を入力...";
      } else if (item.type === 'listening') {
        categoryLabel = "聞き取った正しい語句または内容を入力してください";
        subHint = item.category ? `【リスニング: ${item.category}】` : '';
        placeholder = isCyrillicAns ? "キリル文字で入力..." : "解答を入力...";
      } else if (item.type === 'word_family') {
        categoryLabel = "適切な類義語または接尾辞・派生語を入力してください";
        subHint = item.category ? `【区分: ${item.category}】` : '';
        placeholder = "キリル文字で入力...";
      } else if (item.type === 'culture') {
        categoryLabel = "ことわざ・なぞなぞ・文化知識の正解を入力してください";
        subHint = item.category ? `【文化: ${item.category}】` : '';
        placeholder = isCyrillicAns ? "キリル文字で入力..." : "日本語で入力...";
      } else if (item.type === 'sentence_translation' || item.type === 'typing') {
        categoryLabel = isCyrillicAns ? "日本語に合うモンゴル語文章をキリル文字で入力してください" : "モンゴル語文章の日本語訳を入力してください";
        subHint = item.category ? `【文章入力: ${item.category}】` : '';
        placeholder = isCyrillicAns ? "キリル文字で文章を入力..." : "日本語訳を入力...";
      } else {
        categoryLabel = "問題の正解を入力してください";
        placeholder = isCyrillicAns ? "キリル文字で入力..." : "日本語で入力...";
      }
    } else if (isCyrillicAns) {
      if (isV) {
        if (!item._verbTargetForm) {
          item._verbTargetForm = Math.random() < 0.5 ? 'dict' : 'root';
        }
        if (item._verbTargetForm === 'dict') {
          categoryLabel = "日本語に合うモンゴル語（キリル文字）を入力してください";
          subHint = `【動詞】見出し語となる【辞書形（〜х）】を入力（例: ${details.dictForm}）`;
          placeholder = "動詞の辞書形（〜х）をキリル文字で入力...";
        } else {
          categoryLabel = "日本語に合うモンゴル語（キリル文字）を入力してください";
          subHint = `【動詞】活用の土台となる【語幹】を入力（例: ${details.dictForm} の語幹「${details.root}」、語尾-ахや括弧は不要）`;
          placeholder = "動詞の語幹をキリル文字で入力...";
        }
      } else {
        categoryLabel = "日本語に合うモンゴル語（キリル文字）を入力してください";
        subHint = (matchedWord && matchedWord.pos) ? `【品詞: ${matchedWord.pos}】` : '';
        placeholder = "キリル文字で入力...";
      }
    } else {
      categoryLabel = "モンゴル語の意味（日本語）を入力してください";
      subHint = (matchedWord && typeof isPronunciationCautionWord === 'function' && isPronunciationCautionWord(matchedWord) && matchedWord.pronunciation) ? `⚠️ 読み注意: ${matchedWord.pronunciation}` : '';
      placeholder = "日本語で意味を入力...";
    }
    return {
      displayPrefix,
      promptText,
      categoryLabel,
      subHint,
      isCyrillicAnswer: isCyrillicAns,
      placeholder,
      matchedWord,
      details,
      isVerb: isV,
      isExplicitNonWord,
      correctAns: cleanAns || correctAns || ''
    };
  }

  static loadReviewQuestion(index) {
    this.cleanupKeyHandler();
    this.state.testIndex = index;
    const item = this.state.testList[index];
    if (item) {
      const parsed = this.parseReviewItem(item);
      if (parsed && parsed.isVerb && !item._verbTargetForm) {
        item._verbTargetForm = Math.random() < 0.5 ? 'dict' : 'root';
      }
    }
    this.state.currentTestItem = item;
    this.state.userAnswer = '';
    this.state.hasAnswered = false;
    this.state.isCorrect = false;
    this.renderReviewTesting();
    scrollToQuizTop(this.container);
  }

  static renderReviewTesting() {
    const item = this.state.currentTestItem;
    const idx = this.state.testIndex;
    const total = this.state.testList.length;
    const progressPercent = Math.round((idx / total) * 100);
    const parsed = this.parseReviewItem(item);

    this.container.innerHTML = `
      <div class="animate-fade-in max-w-xl mx-auto px-4 py-3 space-y-4">
        
        <div class="space-y-1.5">
          <div class="flex justify-between items-center text-xs font-bold text-slate-500">
            <span>🔥 弱点克服テスト ${idx + 1} / ${total}</span>
            <button type="button" id="btn-quit-review-test" class="text-slate-400 hover:text-slate-700">終了</button>
          </div>
          <div class="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
            <div class="bg-rose-500 h-full transition-all duration-300" style="width: ${progressPercent}%"></div>
          </div>
        </div>

        <!-- 問題カード（答えの漏洩を完全に排除） -->
        <div class="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm text-center">
          <div class="text-xs font-bold text-rose-600 mb-2">${parsed.categoryLabel}</div>
          <div class="text-xl sm:text-2xl font-black text-slate-800 cyrillic-text leading-relaxed whitespace-pre-line">
            <span class="text-sm font-bold text-slate-400 mr-1">${parsed.displayPrefix}</span>
            <span>${parsed.promptText}</span>
          </div>
          ${parsed.subHint ? `
            <div class="mt-2 text-center">
              <button type="button" id="btn-toggle-review-hint" class="text-xs text-slate-400 hover:text-slate-600 bg-slate-50 hover:bg-slate-100 px-3 py-1 rounded-full font-bold border border-slate-200 transition-all inline-flex items-center gap-1.5 cursor-pointer select-none active:scale-95 shadow-2xs">
                <span>💡</span>
                <span id="review-hint-toggle-text">ヒントを見る ▼</span>
              </button>
              <div id="review-hint-content" class="hidden mt-2 animate-fade-in text-xs text-rose-700 bg-rose-50 inline-block px-3 py-1.5 rounded-xl font-medium border border-rose-200">
                ${parsed.subHint}
              </div>
            </div>
          ` : ''}
        </div>

        <!-- 回答エリア（4択問題または通常入力） -->
        ${!this.state.hasAnswered ? `
          ${(item.options && Array.isArray(item.options) && item.options.length >= 2) ? `
            <div class="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3">
              <div class="text-xs font-bold text-slate-500 text-center mb-1">
                正しいと思う選択肢を選んでください（1〜4キー対応）
              </div>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                ${item.options.map((opt, oIdx) => {
                  const letter = ['A', 'B', 'C', 'D'][oIdx] || (oIdx + 1);
                  return `
                    <button type="button" class="btn-review-choice w-full p-3.5 rounded-xl border-2 border-slate-200 hover:border-rose-400 bg-white hover:bg-rose-50/50 text-left transition-all flex items-center gap-3 select-none cursor-pointer active:scale-98 group shadow-2xs" data-choice="${opt}">
                      <span class="w-7 h-7 rounded-lg bg-slate-100 group-hover:bg-rose-600 group-hover:text-white font-black text-xs text-slate-600 flex items-center justify-center shrink-0 transition-colors">
                        ${letter}
                      </span>
                      <span class="text-sm font-bold text-slate-800 leading-snug cyrillic-text">
                        ${opt}
                      </span>
                    </button>
                  `;
                }).join('')}
              </div>
            </div>
          ` : `
            <div class="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3">
              <input type="text" id="input-review-answer" 
                class="w-full text-base sm:text-lg p-3 rounded-xl border-2 border-slate-300 focus:border-rose-500 focus:outline-hidden text-center font-bold text-slate-800 cyrillic-text cyrillic-input" 
                placeholder="${parsed.placeholder}" 
                data-cyrillic="${parsed.isCyrillicAnswer ? 'true' : 'false'}"
                autofocus autocomplete="off">

              <!-- PC標準モンゴル語キーボード＆特有文字パレット（キリル文字回答時） -->
              ${parsed.isCyrillicAnswer ? renderCyrillicInputAssistantHTML('input-review-answer', true) : ''}

              <button type="button" id="btn-submit-review" class="w-full py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl shadow-md transition-all active:scale-98 text-sm cursor-pointer">
                回答する（Enter）
              </button>
            </div>
          `}
        ` : `
          <div class="animate-fade-in space-y-4">
            <div class="p-5 rounded-2xl border ${this.state.isCorrect ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-950 dark:text-emerald-100' : 'bg-rose-50 dark:bg-rose-950/50 border-rose-300 dark:border-rose-900/60 text-rose-950 dark:text-rose-100'} shadow-sm">
              <div class="text-2xl font-black mb-2 flex items-center gap-2">
                <span>${this.state.isCorrect ? '🎉' : '❌'}</span>
                <span>${this.state.isCorrect ? ((item.consecutiveCorrect || 0) >= 3 ? '見事克服！マスター達成！' : '正解です！') : 'まだ克服できていません'}</span>
              </div>

              <!-- 2回正解本日完了プログレスの明示（全復習モード共通・24時間更新） -->
              ${(() => {
                const currentCount = Math.max(item.dailyCorrectCount || 0, item.consecutiveCorrect || 0);
                const isCleared = currentCount >= 2 || item.isClearedToday || item.resolved;
                return `
                <div class="my-3 p-3 rounded-xl border ${
                  this.state.isCorrect 
                    ? (isCleared 
                        ? 'bg-emerald-100 dark:bg-emerald-900/60 border-emerald-400 text-emerald-950 dark:text-emerald-100' 
                        : 'bg-amber-50 dark:bg-amber-950/50 border-amber-300 dark:border-amber-700 text-amber-950 dark:text-amber-100')
                    : 'bg-rose-100/60 dark:bg-rose-900/40 border-rose-300 text-rose-900 dark:text-rose-200'
                } flex items-center justify-between flex-wrap gap-2 shadow-2xs">
                  <div class="flex items-center gap-2">
                    <span class="text-xl">${this.state.isCorrect ? (isCleared ? '🎉' : '🎯') : '⚠️'}</span>
                    <span class="text-xs sm:text-sm font-black">
                      ${this.state.isCorrect 
                        ? (isCleared 
                            ? '🎉 2回正解達成！今日の復習リストから完了しました（24時間後に更新）' 
                            : `正解カウント加算！【1/2回】正解（あと1回正解で本日分完了！）`)
                        : '不正解のため、2回正解カウントはリセット（0/2回）されました'}
                    </span>
                  </div>
                  <div class="text-xs font-bold px-3 py-1 rounded-full ${
                    isCleared ? 'bg-emerald-600 text-white' : 'bg-white/80 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200'
                  }">
                    進捗: ${currentCount}/2回 ${isCleared ? '✓ 完了' : ''}
                  </div>
                </div>
              `;
              })()}

              <!-- 詳しい解説カード（全問必ず展開） -->
              ${(() => {
                const currentParsed = (typeof parsed !== 'undefined' && parsed) ? parsed : this.parseReviewItem(item);
                const isExplicitNonWord = item && item.type && item.type !== 'word' && item.type !== 'looked_up' && item.type !== 'due_review';
                const matchedWord = (!isExplicitNonWord && currentParsed) ? currentParsed.matchedWord : null;

                if (matchedWord) {
                  const detailsObj = currentParsed?.details || getWordGrammarDetails(matchedWord);
                  const expectedAns = currentParsed?.isVerb 
                    ? (item._verbTargetForm === 'root' ? (detailsObj?.root || matchedWord.root || item.correctAnswer) : (detailsObj?.dictForm || matchedWord.dictForm || item.correctAnswer)) 
                    : item.correctAnswer;
                  return renderGrammarExplanationHTML({
                    correctAnswer: expectedAns,
                    userAnswer: this.state.userAnswer,
                    isCorrect: this.state.isCorrect,
                    item: matchedWord,
                    grammarExplanation: item.explanation,
                    isVerbQuestion: currentParsed ? currentParsed.isVerb : false,
                    verbTargetForm: item._verbTargetForm
                  });
                }

                // マッチ単語がない場合のフォールバック（イラスト・成り立ち解析・語呂合わせ）
                const meaning = item.japanese || (item.explanation ? item.explanation.split('=')[0].trim() : '');
                const etymologyHTML = (typeof getWordEtymologyHTML === 'function')
                  ? getWordEtymologyHTML({ mongolian: item.correctAnswer, japanese: meaning }, item.correctAnswer)
                  : '';
                const mnemonicHTML = (typeof getWordMnemonicHTML === 'function')
                  ? getWordMnemonicHTML({ mongolian: item.correctAnswer, japanese: meaning }, item.correctAnswer)
                  : '';
                const illustrationHTML = (typeof getWordIllustrationHTML === 'function')
                  ? getWordIllustrationHTML({ mongolian: item.correctAnswer, japanese: meaning }, { size: 'md' })
                  : '';
                const altSynNote = (typeof getWordSynonymNote === 'function') ? getWordSynonymNote(item.correctAnswer) : '';

                return `
                  <div class="space-y-3 text-xs sm:text-sm">
                    <div class="flex items-center gap-3">
                      ${illustrationHTML}
                      <div>
                        <div class="flex items-center gap-1.5 flex-wrap">
                          <span class="text-slate-500 dark:text-slate-400 font-bold">正解: </span>
                          <span class="font-black text-lg cyrillic-text text-emerald-700 dark:text-emerald-400 correct-answer-text">${item.correctAnswer}${altSynNote ? ` <span class="text-xs text-slate-500 dark:text-slate-400 font-normal">(${altSynNote})</span>` : ''}</span>
                        </div>
                        ${meaning ? `<div class="text-xs text-slate-600 dark:text-slate-300 font-semibold mt-0.5">${meaning}</div>` : ''}
                      </div>
                    </div>

                    ${!this.state.isCorrect && this.state.userAnswer ? `
                      <div class="p-2.5 rounded-xl bg-rose-100/80 dark:bg-rose-900/40 border border-rose-200 dark:border-rose-800 text-rose-900 dark:text-rose-200">
                        <span>あなたの回答: </span>
                        <span class="font-bold line-through cyrillic-text">${this.state.userAnswer}</span>
                      </div>
                    ` : ''}

                    ${(() => {
                      const synExpl = (typeof getWordSynonymExplanation === 'function') ? getWordSynonymExplanation(item) : null;
                      if (!synExpl) return '';
                      return `
                        <div class="p-3 rounded-xl bg-blue-50/95 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-blue-950 dark:text-blue-100 text-xs shadow-2xs space-y-1.5 my-2">
                          <div class="font-bold flex items-center gap-1.5 text-blue-700 dark:text-blue-300">
                            <span class="text-base">✨</span>
                            <span>別の言い方・同義語（どちらで答えても正解です）:</span>
                          </div>
                          <div class="leading-relaxed">
                            ${synExpl.note}
                          </div>
                          <div class="flex items-center gap-1.5 flex-wrap pt-1">
                            <span class="text-[11px] text-blue-600 dark:text-blue-400 font-semibold">正解となる表現:</span>
                            ${synExpl.synonyms.map(s => `<span class="bg-white dark:bg-slate-900 border border-blue-200 dark:border-blue-700 px-2 py-0.5 rounded-md font-bold cyrillic-text text-blue-800 dark:text-blue-200">${s}</span>`).join('')}
                          </div>
                        </div>
                      `;
                    })()}

                    ${item.explanation ? `
                      ${(typeof formatStructuredExplanationHTML === 'function')
                        ? formatStructuredExplanationHTML(item.explanation, {
                            isCorrect: this.state.isCorrect,
                            userAnswer: this.state.userAnswer,
                            correctAnswer: item.correctAnswer
                          })
                        : `
                          <div class="p-3 bg-white/95 dark:bg-slate-950/90 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 text-xs leading-relaxed shadow-2xs">
                            <div class="font-bold text-slate-900 dark:text-slate-100 mb-1">💡 解説:</div>
                            <div class="whitespace-pre-line">${item.explanation}</div>
                          </div>
                        `
                      }
                    ` : ''}

                    ${etymologyHTML}
                    ${mnemonicHTML}
                    ${(typeof getSimilarWordDistinctionHTML === 'function') ? getSimilarWordDistinctionHTML({ mongolian: item.correctAnswer, japanese: meaning }, item.correctAnswer, { userAnswer: this.state.userAnswer || item.userAnswer }) : ''}
                  </div>
                `;
              })()}
            </div>

            <button type="button" id="btn-next-review-item" class="w-full py-3.5 bg-rose-600 hover:bg-rose-700 text-white font-black rounded-xl shadow-md transition-all active:scale-98 text-sm cursor-pointer">
              ${idx + 1 < total ? '次の復習問題へ → (Enter)' : '復習テスト完了！結果を見る'}
            </button>
          </div>
        `}

      </div>
    `;

    this.bindReviewTestingEvents();
  }

  static bindReviewTestingEvents() {
    this.cleanupKeyHandler();

    const quitBtn = this.container.querySelector('#btn-quit-review-test');
    if (quitBtn) {
      quitBtn.addEventListener('click', () => {
        this.cleanupKeyHandler();
        this.state.testingMode = false;
        this.renderNotebook();
      });
    }

    // ヒントトグル
    const toggleHintBtn = this.container.querySelector('#btn-toggle-review-hint');
    const hintContent = this.container.querySelector('#review-hint-content');
    const hintToggleText = this.container.querySelector('#review-hint-toggle-text');
    if (toggleHintBtn && hintContent) {
      toggleHintBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const isHidden = hintContent.classList.toggle('hidden');
        if (hintToggleText) {
          hintToggleText.textContent = isHidden ? 'ヒントを見る ▼' : 'ヒントを閉じる ▲';
        }
      });
    }

    if (!this.state.hasAnswered) {
      const choiceBtns = this.container.querySelectorAll('.btn-review-choice');
      if (choiceBtns.length > 0) {
        choiceBtns.forEach(btn => {
          btn.addEventListener('click', () => {
            const choice = btn.getAttribute('data-choice');
            this.checkReviewAnswer(choice);
          });
        });

        this.activeKeyHandler = (e) => {
          const key = e.key.toUpperCase();
          const map = { '1': 0, '2': 1, '3': 2, '4': 3, 'A': 0, 'B': 1, 'C': 2, 'D': 3 };
          if (map[key] !== undefined && choiceBtns[map[key]]) {
            e.preventDefault();
            choiceBtns[map[key]].click();
          }
        };
        window.addEventListener('keydown', this.activeKeyHandler);
      }

      const input = this.container.querySelector('#input-review-answer');
      const submitBtn = this.container.querySelector('#btn-submit-review');

      if (input) {
        input.focus();
        CyrillicKeyboard.setActiveInput(input);
        bindCyrillicInputAssistant(this.container, '#input-review-answer');
        input.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            e.stopPropagation();
            this.checkReviewAnswer(input.value);
          }
        });
      }

      if (submitBtn) {
        submitBtn.addEventListener('click', (e) => {
          e.preventDefault();
          if (input) this.checkReviewAnswer(input.value);
        });
      }

      // クイック文字タップ
      this.container.querySelectorAll('.btn-quick-char').forEach(btn => {
        btn.addEventListener('click', () => {
          const char = btn.getAttribute('data-char');
          CyrillicKeyboard.insertChar(char);
        });
      });
    } else {
      const nextBtn = this.container.querySelector('#btn-next-review-item');
      if (nextBtn) {
        let allowEnterNext = false;
        setTimeout(() => {
          allowEnterNext = true;
        }, 500);

        nextBtn.addEventListener('click', (e) => {
          e.preventDefault();
          this.cleanupKeyHandler();
          scrollToQuizTop(this.container);
          if (this.state.testIndex + 1 < this.state.testList.length) {
            this.loadReviewQuestion(this.state.testIndex + 1);
          } else {
            this.state.testView = 'result';
            this.renderReviewResult();
          }
        });

        this.activeKeyHandler = (e) => {
          if (e.key === 'Enter') {
            if (!allowEnterNext) return;
            this.cleanupKeyHandler();
            nextBtn.click();
          }
        };
        window.addEventListener('keydown', this.activeKeyHandler);
      }
    }
  }

  static checkReviewAnswer(val) {
    const item = this.state.currentTestItem;
    const parsed = this.parseReviewItem(item);
    const isExplicitNonWord = item && item.type && item.type !== 'word' && item.type !== 'looked_up' && item.type !== 'due_review';
    const matchedWord = (!isExplicitNonWord) ? parsed.matchedWord : null;

    let isCorrect = false;

    if (isExplicitNonWord) {
      // 文法・格変化・読解・リスニング・文化等の判定
      if (item.acceptableAnswers && Array.isArray(item.acceptableAnswers)) {
        isCorrect = item.acceptableAnswers.some(ans => isFuzzyMatch(val, ans));
      }
      if (!isCorrect) {
        isCorrect = isFuzzyMatch(val, item.correctAnswer);
      }
      // 選択肢番号 (例: 1, 2) または選択肢テキスト部分一致対応
      if (!isCorrect && item.correctAnswer) {
        const numMatch = item.correctAnswer.match(/^\s*(\d+)[\.\)]\s*(.*)/);
        if (numMatch) {
          if (val.trim() === numMatch[1] || isFuzzyMatch(val, numMatch[2])) {
            isCorrect = true;
          }
        }
      }
    } else if (matchedWord) {
      // 単語判定（動詞は辞書形か語幹かを verbTargetForm に基づいて厳密判定）
      isCorrect = isWordAnswerMatch(val, matchedWord, parsed.isCyrillicAnswer ? 'ja_to_mn' : 'mn_to_ja', { verbTargetForm: item._verbTargetForm });
      if (!isCorrect && !parsed.isVerb) {
        isCorrect = isFuzzyMatch(val, item.correctAnswer);
      }
      if (!isCorrect) {
        const synExpl = (typeof getWordSynonymExplanation === 'function') ? getWordSynonymExplanation(matchedWord || item) : null;
        if (synExpl && synExpl.synonyms) {
          const uClean = val.trim().toLowerCase().replace(/[.,!?。、！？\s«»"'\-]/g, '');
          for (const s of synExpl.synonyms) {
            if (uClean === s.toLowerCase().replace(/[.,!?。、！？\s«»"'\-]/g, '')) {
              isCorrect = true;
              break;
            }
          }
        }
      }
      if (!isCorrect && item.correctAnswer) {
        const syns = (typeof getWordSynonyms === 'function') ? getWordSynonyms(item.correctAnswer) : [];
        const uClean = val.trim().toLowerCase().replace(/[.,!?。、！？\s«»"']/g, '');
        for (const s of syns) {
          if (uClean === s.toLowerCase().replace(/[.,!?。、！？\s«»"']/g, '')) {
            isCorrect = true;
            break;
          }
        }
      }
    } else {
      isCorrect = isFuzzyMatch(val, item.correctAnswer);
      if (!isCorrect) {
        const synExpl = (typeof getWordSynonymExplanation === 'function') ? getWordSynonymExplanation(item) : null;
        if (synExpl && synExpl.synonyms) {
          const uClean = val.trim().toLowerCase().replace(/[.,!?。、！？\s«»"'\-]/g, '');
          for (const s of synExpl.synonyms) {
            if (uClean === s.toLowerCase().replace(/[.,!?。、！？\s«»"'\-]/g, '')) {
              isCorrect = true;
              break;
            }
          }
        }
      }
      if (!isCorrect && item.correctAnswer) {
        const syns = (typeof getWordSynonyms === 'function') ? getWordSynonyms(item.correctAnswer) : [];
        const uClean = val.trim().toLowerCase().replace(/[.,!?。、！？\s«»"']/g, '');
        for (const s of syns) {
          if (uClean === s.toLowerCase().replace(/[.,!?。、！？\s«»"']/g, '')) {
            isCorrect = true;
            break;
          }
        }
      }
    }

    this.state.hasAnswered = true;
    this.state.userAnswer = val;
    this.state.isCorrect = isCorrect;

    this.state.testResults.push({
      item,
      isCorrect,
      userAnswer: val,
      correctAnswer: item.correctAnswer,
      parsed
    });

    const targetWordId = item.wordId || item.srsWordId || (matchedWord ? matchedWord.id : null);

    // 24時間日次復習カウントの記録（忘却曲線・要復習ともに2回正解で本日分クリア）
    const aliasList = [item.correctAnswer, matchedWord?.mongolian, matchedWord?.dictForm].filter(Boolean);
    const dailyRes = StorageService.recordDailyReviewAnswer(targetWordId, isCorrect, aliasList);
    item.dailyCorrectCount = dailyRes.count;
    if (dailyRes.isCleared) {
      item.resolved = true;
      item.isClearedToday = true;
    }

    if (isCorrect) {
      SoundEffects.playCorrect();
      
      let updatedMistake = null;
      if (item.sourceType === 'looked_up') {
        const lookupKey = item.rawLookup?.id || item.rawLookup?.dictForm || item.correctAnswer;
        StorageService.markLookedUpWordResolved(lookupKey, true);
      } else if (item.sourceType === 'due_review') {
        if (targetWordId) {
          try {
            StorageService.recordWordAnswer(targetWordId, true, 'good');
          } catch (_) {}
        }
      } else {
        // 間違い問題（🔥 間違いタブなど）：2回正解ルールを適用して正解数カウントアップ
        updatedMistake = StorageService.recordMistakeAnswer(item, true);
        if (updatedMistake) {
          item.consecutiveCorrect = updatedMistake.consecutiveCorrect;
          item.resolved = updatedMistake.resolved;
        }
      }

      // 単語マスターのSRS進捗も向上（マスター・得意化）
      if (targetWordId && item.sourceType !== 'due_review') {
        try {
          StorageService.recordWordAnswer(targetWordId, true, 'good');
        } catch (_) {}
      }

      if (dailyRes.isCleared) {
        item.resolved = true;
      }
      if (updatedMistake) {
        item.consecutiveCorrect = updatedMistake.consecutiveCorrect;
        item.resolved = updatedMistake.resolved;
      }
    } else {
      SoundEffects.playWrong();
      if (item.sourceType === 'mistake' || !item.sourceType) {
        const updated = StorageService.recordMistakeAnswer(item, false);
        if (updated) {
          item.consecutiveCorrect = 0;
          item.resolved = false;
        }
      }
      
      // SRS進捗の降格・リセット更新
      if (targetWordId) {
        try {
          StorageService.recordWordAnswer(targetWordId, false, 'again');
        } catch (_) {}
      }

      // 間違いノートへ確実に登録（id の衝突を避け、常に正規の m_ ID で記録）
      const qText = item.question || (parsed ? `【単語】${parsed.promptText}` : '');
      const ansText = item.correctAnswer || (matchedWord ? matchedWord.dictForm : '');
      const explText = item.explanation || (matchedWord ? `${matchedWord.japanese} = ${matchedWord.dictForm || matchedWord.mongolian}` : '');
      
      StorageService.recordMistake({
        wordId: targetWordId || null,
        question: qText,
        correctAnswer: ansText,
        userAnswer: val,
        type: (item.type && item.type !== 'due_review' && item.type !== 'looked_up') ? item.type : 'word',
        category: item.category || (matchedWord ? matchedWord.category : '単語'),
        explanation: explText
      });
      item.consecutiveCorrect = 0;
      item.dailyCorrectCount = 0;
      item.resolved = false;
      item.isClearedToday = false;
    }

    this.renderReviewTesting();
  }

  // --- 3. 復習テスト結果画面 ---
  static renderReviewResult() {
    const total = this.state.testResults.length;
    const correct = this.state.testResults.filter(r => r.isCorrect).length;
    const wrong = total - correct;
    const percent = total > 0 ? Math.round((correct / total) * 100) : 0;
    const currentFilter = this.state.resultFilter || 'all';

    // 学習履歴・累計正解数に記録（ホーム画面の「累計正解率 (X/Y)」や日別統計に確実に反映）
    if (!this.state.hasRecordedHistory && total > 0) {
      this.state.hasRecordedHistory = true;
      StorageService.recordHistory({
        type: 'review_notebook',
        category: '復習特訓（間違いノート）',
        total: total,
        correct: correct,
        score: percent
      });
    }

    const filteredResults = this.state.testResults.filter(r => {
      if (currentFilter === 'correct') return r.isCorrect;
      if (currentFilter === 'wrong') return !r.isCorrect;
      return true;
    });

    this.container.innerHTML = `
      <div class="animate-fade-in max-w-xl mx-auto px-4 py-4 space-y-4">
        
        <div class="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-2xl p-6 text-white text-center shadow-lg space-y-2">
          <div class="text-3xl">🎉</div>
          <h2 class="text-lg font-black tracking-wide">弱点克服テスト 完了！</h2>
          <div class="text-xs text-white/90">
            克服・正解: <span class="font-black text-amber-300 text-base">${correct} / ${total} 問</span> (${percent}%)
          </div>
        </div>

        <div class="bg-white rounded-2xl p-5 border border-slate-200 shadow-md text-center space-y-3">
          <div class="flex gap-2">
            <button type="button" id="btn-retry-review-test" class="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs sm:text-sm transition-all active:scale-98 shadow-xs cursor-pointer">
              もう一度復習する
            </button>
            <button type="button" id="btn-back-to-notebook" class="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs sm:text-sm transition-all cursor-pointer">
              間違いノートへ戻る
            </button>
          </div>
        </div>

        <!-- 出題問題の一覧・復習（正解・不正解フィルター切り替え） -->
        <div class="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
            <h3 class="text-sm font-extrabold text-slate-800 flex items-center gap-1.5">
              <span>📋</span> 解答した問題の一覧 (${total}問)
            </h3>
            <div class="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-bold self-start sm:self-auto">
              <button type="button" class="filter-review-result-btn px-2.5 py-1 rounded-lg transition-all cursor-pointer ${currentFilter === 'all' ? 'bg-white text-slate-900 shadow-2xs font-black' : 'text-slate-500 hover:text-slate-800'}" data-filter="all">
                すべて (${total})
              </button>
              <button type="button" class="filter-review-result-btn px-2.5 py-1 rounded-lg transition-all cursor-pointer ${currentFilter === 'correct' ? 'bg-emerald-600 text-white shadow-2xs font-black' : 'text-slate-500 hover:text-emerald-700'}" data-filter="correct">
                ⭕ 克服 (${correct})
              </button>
              <button type="button" class="filter-review-result-btn px-2.5 py-1 rounded-lg transition-all cursor-pointer ${currentFilter === 'wrong' ? 'bg-rose-600 text-white shadow-2xs font-black' : 'text-slate-500 hover:text-rose-700'}" data-filter="wrong">
                ❌ 要復習 (${wrong})
              </button>
            </div>
          </div>

          ${filteredResults.length === 0 ? `
            <div class="text-center py-6 text-xs text-slate-400">
              該当する問題はありません。
            </div>
          ` : `
            <div class="divide-y divide-slate-100 max-h-96 overflow-y-auto pr-1">
              ${filteredResults.map(r => {
                const cyrText = /[\u0400-\u04FF]/.test(r.correctAnswer) ? r.correctAnswer : (r.parsed && r.parsed.matchedWord ? r.parsed.matchedWord.mongolian : '');
                return `
                  <div class="py-3 flex items-start justify-between gap-3 text-xs">
                    <div class="space-y-1 flex-1">
                      <div class="flex items-center gap-2">
                        <span class="px-2 py-0.5 rounded-full text-[10px] font-bold ${r.isCorrect ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}">
                          ${r.isCorrect ? '⭕ 克服済' : '❌ 要復習'}
                        </span>
                        <span class="font-bold text-slate-900 text-xs sm:text-sm">${r.parsed ? r.parsed.promptText : (r.item.question || '')}</span>
                      </div>
                      <div class="text-slate-700 font-medium">
                        正解: <span class="font-bold text-emerald-800 cyrillic-text correct-answer-text">${r.correctAnswer}</span>
                      </div>
                      ${!r.isCorrect ? `
                        <div class="text-slate-500">
                          あなたの回答: <span class="line-through text-rose-600 font-medium">${r.userAnswer || '(無回答)'}</span>
                        </div>
                      ` : `
                        ${r.userAnswer ? `<div class="text-slate-500">あなたの回答: <span class="text-emerald-700 font-bold">${r.userAnswer}</span> ✅</div>` : ''}
                      `}
                    </div>
                    ${cyrText ? `
                      <button type="button" class="btn-speak-review-result text-slate-400 hover:text-emerald-700 p-2 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer" data-word="${cyrText}" title="発音を聞く">
                        🔊
                      </button>
                    ` : ''}
                  </div>
                `;
              }).join('')}
            </div>
          `}
        </div>
      </div>
    `;

    // フィルターボタンイベント
    this.container.querySelectorAll('.filter-review-result-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.state.resultFilter = btn.getAttribute('data-filter');
        this.renderReviewResult();
      });
    });

    // 音声再生
    this.container.querySelectorAll('.btn-speak-review-result').forEach(btn => {
      btn.addEventListener('click', () => {
        const word = btn.getAttribute('data-word');
        if (word) SpeechService.speakMongolian(word);
      });
    });

    this.container.querySelector('#btn-retry-review-test').addEventListener('click', () => {
      const active = StorageService.getMistakes().filter(m => !m.resolved);
      if (active.length > 0) {
        this.state.testList = shuffleArray(active);
        this.state.testIndex = 0;
        this.state.testResults = [];
        this.state.resultFilter = 'all';
        this.state.hasRecordedHistory = false;
        this.state.testingMode = true;
        this.state.testView = 'question';
        this.loadReviewQuestion(0);
      } else {
        alert('未克服の問題はありません！全問マスター達成です！');
        this.state.testingMode = false;
        this.renderNotebook();
      }
    });

    this.container.querySelector('#btn-back-to-notebook').addEventListener('click', () => {
      this.state.testingMode = false;
      this.state.testView = 'question';
      this.renderNotebook();
    });
  }
}
