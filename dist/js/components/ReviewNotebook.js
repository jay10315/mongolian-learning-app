// 間違いノート・復習コンポーネント
import { StorageService } from '../services/storage.js';
import { SpeechService } from '../services/speech.js';
import { CyrillicKeyboard } from './CyrillicKeyboard.js';
import { isFuzzyMatch, isVerb, getWordGrammarDetails, isWordAnswerMatch, renderGrammarExplanationHTML, SoundEffects, shuffleArray, SPECIAL_CYRILLIC_BAR, scrollToQuizTop } from '../utils/helpers.js';

export class ReviewNotebookComponent {
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
    resultFilter: 'all'
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
      dueSet.add(w.id);
      combinedSrsWords.push({
        ...w,
        _label: '要復習(SRS期日)'
      });
    });

    rawHighRiskWords.forEach(w => {
      if (!dueSet.has(w.id)) {
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
      sourceType: 'due_review',
      type: 'due_review',
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
            <div class="flex flex-wrap gap-2">
              <button type="button" id="btn-start-all-review" class="px-4 py-2 bg-white text-slate-900 hover:bg-amber-50 text-xs font-black rounded-xl shadow-xs transition-all active:scale-95 cursor-pointer">
                全問特訓スタート (${currentFilterActive}問)
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

          <div class="flex items-center gap-2 shrink-0">
            <label class="flex items-center gap-1.5 text-xs text-slate-600 cursor-pointer select-none">
              <input type="checkbox" id="check-show-resolved" ${this.state.showResolved ? 'checked' : ''} class="rounded text-emerald-600 focus:ring-0">
              <span>克服済みも表示</span>
            </label>
            ${totalResolved > 0 ? `
              <button type="button" id="btn-clear-resolved" class="text-[11px] px-2.5 py-1 rounded-lg border border-slate-300 hover:bg-slate-100 text-slate-600 font-semibold cursor-pointer transition-all flex items-center gap-1">
                <span>🗑️</span> 覚えた項目を一括整理
              </button>
            ` : ''}
          </div>
        </div>

        <!-- 復習ノート一覧カード -->
        <div class="space-y-3">
          ${filtered.length === 0 ? `
            <div class="text-center py-10 text-slate-400 text-xs bg-white rounded-xl border border-slate-200">
              該当する項目はありません。
            </div>
          ` : filtered.map(m => {
            const dateStr = new Date(m.lastWrongDate).toLocaleDateString('ja-JP', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
            const parsed = ReviewNotebookComponent.parseReviewItem(m);
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
                  <div class="flex items-center gap-2">
                    <span class="text-xs font-bold px-2 py-0.5 rounded-full ${statusBadge}">
                      ${statusLabel}
                    </span>
                    <span class="text-[11px] text-slate-400">${m.sourceLabel || m.category || m.type}</span>
                  </div>
                  <div class="flex items-center gap-1.5">
                    <button type="button" class="btn-toggle-resolve text-[11px] px-2 py-0.5 rounded border ${
                      m.resolved ? 'bg-slate-100 text-slate-600 border-slate-300' : 'bg-emerald-50 text-emerald-700 border-emerald-300 font-bold'
                    }" data-id="${m.id}" data-source="${m.sourceType || 'mistake'}" data-srs-id="${m.srsWordId || ''}" data-resolved="${m.resolved}">
                      ${m.resolved ? '未克服に戻す' : '✓ 覚えた（間違えた単語から消す）'}
                    </button>
                    <button type="button" class="btn-delete-mistake text-slate-300 hover:text-rose-500 text-xs px-1 cursor-pointer" data-id="${m.id}" data-source="${m.sourceType || 'mistake'}" title="削除">
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
                  <div class="p-2 bg-emerald-50/80 rounded-lg text-emerald-950">
                    <span class="text-slate-400 text-[10px] block">${parsed.isExplicitNonWord ? '正解:' : '正しい解答（見出し語）:'}</span>
                    <span class="font-bold cyrillic-text text-emerald-800">${m.correctAnswer}</span>
                  </div>
                </div>

                <!-- 解説 -->
                ${m.explanation ? `
                  <div class="text-[11px] text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100 leading-relaxed whitespace-pre-line">
                    💡 ${m.explanation}
                  </div>
                ` : ''}

                <div class="text-[10px] text-slate-400 text-right">
                  記録日時: ${dateStr}
                </div>
              </div>
            `;
          }).join('')}
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

    // 克服トグル
    this.container.querySelectorAll('.btn-toggle-resolve').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const sourceType = btn.getAttribute('data-source');
        const srsId = btn.getAttribute('data-srs-id');
        const currentResolved = btn.getAttribute('data-resolved') === 'true';
        if (sourceType === 'looked_up') {
          StorageService.markLookedUpWordResolved(id.replace(/^lookup_/, ''), !currentResolved);
        } else if (sourceType === 'due_review') {
          if (srsId) StorageService.recordWordAnswer(srsId, !currentResolved, 'good');
        } else {
          StorageService.markMistakeResolved(id, !currentResolved);
        }
        this.renderNotebook();
      });
    });

    // 削除
    this.container.querySelectorAll('.btn-delete-mistake').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const sourceType = btn.getAttribute('data-source');
        if (confirm('この記録を削除しますか？')) {
          if (sourceType === 'looked_up') {
            StorageService.deleteLookedUpWord(id.replace(/^lookup_/, ''));
          } else if (sourceType === 'due_review') {
            // SRS復習は完了扱いにして先送り
            const srsId = btn.getAttribute('data-srs-id');
            if (srsId) StorageService.recordWordAnswer(srsId, true, 'easy');
          } else {
            StorageService.removeMistake(id);
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
  static parseReviewItem(item) {
    if (!item) return { promptText: '', displayPrefix: '', categoryLabel: '', isCyrillicAnswer: false, placeholder: '正解を入力...', subHint: '', matchedWord: null, details: null, isVerb: false };

    let rawQ = (item.question || '').trim();
    let correctAns = (item.correctAnswer || '').trim();

    // ノイズ文字列「（モンゴル語教科書語彙）」「（JICA訓練所）」「【第X課」を除去
    const cleanRawQ = rawQ.replace(/【第\d+課\s*/g, '【').replace(/[（\(]モンゴル語教科書語彙[）\)]/g, '').replace(/[（\(]JICA訓練所[）\)]/g, '').trim();
    const cleanAns = correctAns.replace(/[（\(]モンゴル語教科書語彙[）\)]/g, '').replace(/[（\(]JICA訓練所[）\)]/g, '').trim();

    const cleanKey = (str) => (str || '').toLowerCase().replace(/[\(\)（）\s.,!?-]/g, '');
    const qClean = cleanKey(cleanRawQ);
    const aClean = cleanKey(cleanAns);

    const allWords = StorageService.getVocabulary();

    // 3段階で確実に該当単語を特定（完全一致 -> 日本語一致 -> 最長モンゴル語部分一致）
    let matchedWord = null;

    // 1. 正解キーの完全一致
    if (aClean) {
      matchedWord = allWords.find(w => {
        const mnClean = cleanKey(w.mongolian);
        const dfClean = cleanKey(w.dictForm);
        const rtClean = cleanKey(w.root);
        return aClean === mnClean || aClean === dfClean || aClean === rtClean;
      });
    }

    // 2. 問題文内の日本語一致（単語マスターの日本語が問題文に含まれているか）
    if (!matchedWord && qClean) {
      matchedWord = allWords.find(w => {
        const jaClean = cleanKey(w.japanese);
        return jaClean && jaClean.length >= 2 && qClean.includes(jaClean);
      });
    }

    // 3. 問題文内のモンゴル語部分一致（長い単語・連語から順に優先マッチ）
    if (!matchedWord && qClean) {
      const sortedWords = [...allWords].sort((a, b) => 
        ((b.dictForm || b.mongolian || '').length) - ((a.dictForm || a.mongolian || '').length)
      );
      matchedWord = sortedWords.find(w => {
        const mnClean = cleanKey(w.mongolian);
        const dfClean = cleanKey(w.dictForm);
        return (mnClean && mnClean.length >= 3 && qClean.includes(mnClean)) ||
               (dfClean && dfClean.length >= 3 && qClean.includes(dfClean));
      });
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
      const rawJa = cleanRawQ.replace(/^【要復習】\s*/, '');
      return {
        promptText: rawJa,
        displayPrefix: '【要復習(SRS)】',
        categoryLabel: '復習期日到来（忘却曲線）',
        isCyrillicAnswer: true,
        placeholder: 'キリル文字で入力...',
        subHint: '',
        matchedWord: matchedWord,
        details: details,
        isVerb: isV
      };
    }

    let displayPrefix = '';
    let promptText = '';

    const isExplicitNonWord = item && item.type && item.type !== 'word' && item.type !== 'looked_up' && item.type !== 'due_review';

    // 単語マスターとマッチした場合、常にクリーンな見出し情報から出題を構成（ただし明示的に文法・格変化・読解などの非単語問題の場合は問題文を優先）
    if (matchedWord && !isExplicitNonWord) {
      if (isCyrillicAns) {
        displayPrefix = '【単語】';
        promptText = matchedWord.japanese;
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
        const prefixMatch = cleanRawQ.match(/^(【[^】]+】)\s*(.*)/);
        if (prefixMatch) {
          displayPrefix = prefixMatch[1];
          promptText = prefixMatch[2].trim();
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
        } else {
          categoryLabel = "指示に従い、指定の単語に適切な語尾・格変化を付けた形をキリル文字で入力してください";
        }
        subHint = item.category ? `【文法項目: ${item.category}】` : '';
        placeholder = "キリル文字で入力...";
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
        categoryLabel = "日本語に合う動詞の【語幹】をキリル文字で入力してください";
        subHint = `【動詞】活用の土台となる【語幹】を入力（例: ${details.dictForm} の語幹「${details.root}」、語尾-ахや括弧は不要）`;
        placeholder = "語幹（または辞書形）をキリル文字で入力...";
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
      isExplicitNonWord
    };
  }

  static loadReviewQuestion(index) {
    this.state.testIndex = index;
    this.state.currentTestItem = this.state.testList[index];
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
          <div class="text-xl sm:text-2xl font-black text-slate-800 cyrillic-text leading-relaxed">
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

        <!-- 回答エリア -->
        ${!this.state.hasAnswered ? `
          <div class="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3">
            <input type="text" id="input-review-answer" 
              class="w-full text-base sm:text-lg p-3 rounded-xl border-2 border-slate-300 focus:border-rose-500 focus:outline-hidden text-center font-bold text-slate-800 cyrillic-text cyrillic-input" 
              placeholder="${parsed.placeholder}" 
              data-cyrillic="${parsed.isCyrillicAnswer ? 'true' : 'false'}"
              autofocus autocomplete="off">

            <!-- PC標準モンゴル語キーボード＆特有文字パレット（キリル文字回答時） -->
            ${parsed.isCyrillicAnswer ? renderCyrillicInputAssistantHTML('input-review-answer', true) : ''}

            <button type="button" id="btn-submit-review" class="w-full py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl shadow-md transition-all active:scale-98 text-sm">
              回答する（Enter）
            </button>
          </div>
        ` : `
          <div class="animate-fade-in space-y-4">
            <div class="p-5 rounded-2xl border ${this.state.isCorrect ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-950 dark:text-emerald-100' : 'bg-rose-50 dark:bg-rose-950/50 border-rose-300 dark:border-rose-900/60 text-rose-950 dark:text-rose-100'} shadow-sm">
              <div class="text-2xl font-black mb-3">
                ${this.state.isCorrect ? '🎉 見事克服！正解です！' : '❌ まだ克服できていません'}
              </div>

              ${(() => {
                const currentParsed = (typeof parsed !== 'undefined' && parsed) ? parsed : this.parseReviewItem(item);
                const isExplicitNonWord = item && item.type && item.type !== 'word' && item.type !== 'looked_up' && item.type !== 'due_review';
                const matchedWord = (!isExplicitNonWord && currentParsed) ? currentParsed.matchedWord : null;

                // 単語情報がある場合：動詞・名詞・複合語問わず詳細解説＆成り立ちHTMLを完全展開
                if (matchedWord) {
                  return renderGrammarExplanationHTML({
                    correctAnswer: item.correctAnswer,
                    userAnswer: this.state.userAnswer,
                    isCorrect: this.state.isCorrect,
                    item: matchedWord,
                    grammarExplanation: item.explanation,
                    isVerbQuestion: currentParsed ? currentParsed.isVerb : false
                  });
                }

                // マッチ単語がない場合のフォールバック（イラスト・成り立ち解析・語呂合わせ・ダークモード高コントラスト対応）
                const etymologyHTML = (typeof getWordEtymologyHTML === 'function')
                  ? getWordEtymologyHTML({ mongolian: item.correctAnswer, japanese: item.japanese }, item.correctAnswer)
                  : '';
                const mnemonicHTML = (typeof getWordMnemonicHTML === 'function')
                  ? getWordMnemonicHTML({ mongolian: item.correctAnswer, japanese: item.japanese }, item.correctAnswer)
                  : '';
                const illustrationHTML = (typeof getWordIllustrationHTML === 'function')
                  ? getWordIllustrationHTML({ mongolian: item.correctAnswer, japanese: item.japanese }, { size: 'md' })
                  : '';

                return `
                  <div class="space-y-3 text-xs sm:text-sm">
                    <div class="flex items-center gap-3">
                      ${illustrationHTML}
                      <div>
                        <div class="flex items-center gap-1.5 flex-wrap">
                          <span class="text-slate-500 dark:text-slate-400 font-bold">正解: </span>
                          <span class="font-black text-lg cyrillic-text text-emerald-700 dark:text-emerald-400 correct-answer-text">${item.correctAnswer}${((typeof getWordSynonymNote === 'function' && getWordSynonymNote(item.correctAnswer)) ? ` <span class="text-xs text-slate-500 dark:text-slate-400 font-normal">(${getWordSynonymNote(item.correctAnswer)})</span>` : '')}</span>
                        </div>
                        ${item.japanese ? `<div class="text-xs text-slate-600 dark:text-slate-300 font-semibold mt-0.5">${item.japanese}</div>` : ''}
                      </div>
                    </div>

                    ${!this.state.isCorrect && this.state.userAnswer ? `
                      <div class="p-2.5 rounded-xl bg-rose-100/80 dark:bg-rose-900/40 border border-rose-200 dark:border-rose-800 text-rose-900 dark:text-rose-200">
                        <span>あなたの回答: </span>
                        <span class="font-bold line-through cyrillic-text">${this.state.userAnswer}</span>
                      </div>
                    ` : ''}

                    ${etymologyHTML}
                    ${mnemonicHTML}

                    ${(() => {
                      const syn = (typeof getWordSynonymNote === 'function') ? getWordSynonymNote(item.correctAnswer) : '';
                      const exp = item.explanation || (item.japanese ? `${item.japanese} (辞書形: ${item.correctAnswer})` : '');
                      if (!exp) return '';
                      const displayExp = (syn && !exp.includes(syn)) ? `${exp} (別表現: ${syn})` : exp;
                      return `
                        <div class="p-3 bg-white/95 dark:bg-slate-950/90 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 text-xs leading-relaxed shadow-2xs">
                          💡 ${displayExp}
                        </div>
                      `;
                    })()}

                    ${(typeof getSimilarWordDistinctionHTML === 'function') ? getSimilarWordDistinctionHTML({ mongolian: item.correctAnswer, japanese: item.japanese }, item.correctAnswer, { userAnswer: this.state.userAnswer || item.userAnswer }) : ''}
                  </div>
                `;
              })()}
            </div>

            <button type="button" id="btn-next-review-item" class="w-full py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl shadow-md transition-all active:scale-98 text-sm">
              ${idx + 1 < total ? '次の復習問題へ →' : '復習テスト完了！'}
            </button>
          </div>
        `}

      </div>
    `;

    this.bindReviewTestingEvents();
  }

  static bindReviewTestingEvents() {
    const quitBtn = this.container.querySelector('#btn-quit-review-test');
    if (quitBtn) {
      quitBtn.addEventListener('click', () => {
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
      const input = this.container.querySelector('#input-review-answer');
      const submitBtn = this.container.querySelector('#btn-submit-review');

      if (input) {
        input.focus();
        CyrillicKeyboard.setActiveInput(input);
        input.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            this.checkReviewAnswer(input.value);
          }
        });
      }

      if (submitBtn) {
        submitBtn.addEventListener('click', () => {
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
          try { nextBtn.focus(); } catch (_) {}
        }, 350);

        nextBtn.addEventListener('click', (e) => {
          if (!allowEnterNext) {
            e.preventDefault();
            return;
          }
          scrollToQuizTop(this.container);
          if (this.state.testIndex + 1 < this.state.testList.length) {
            this.loadReviewQuestion(this.state.testIndex + 1);
          } else {
            this.state.testView = 'result';
            this.renderReviewResult();
          }
        });

        const keyHandler = (e) => {
          if (e.key === 'Enter') {
            if (!allowEnterNext) return;
            window.removeEventListener('keydown', keyHandler);
            nextBtn.click();
          }
        };
        window.addEventListener('keydown', keyHandler);
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
      // 単語判定（語幹、辞書形、マルチワード動詞、隠れ-н、揺らぎ吸収）
      isCorrect = isWordAnswerMatch(val, matchedWord, parsed.isVerb ? 'root_input' : (parsed.isCyrillicAnswer ? 'ja_to_mn' : 'mn_to_ja'));
      if (!isCorrect && parsed.isVerb) {
        // 復習時の特別配慮: 動詞で辞書形 (例: орчуулах) を入力した場合も正解とする
        const uClean = val.trim().toLowerCase().replace(/[.,!?。、！？\s]/g, '');
        const dClean = (parsed.details.dictForm || '').toLowerCase().replace(/[.,!?。、！？\s]/g, '');
        if (uClean === dClean) isCorrect = true;
      }
      if (!isCorrect) {
        isCorrect = isFuzzyMatch(val, item.correctAnswer);
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

    if (isCorrect) {
      SoundEffects.playCorrect();
      // 正解したら克服済みにマーク（履歴は保持され、未克服リストから外れる）
      if (item.sourceType === 'looked_up') {
        const lookupKey = item.rawLookup?.id || item.rawLookup?.dictForm || item.correctAnswer;
        StorageService.markLookedUpWordResolved(lookupKey, true);
      } else if (item.sourceType === 'due_review') {
        if (item.srsWordId) StorageService.recordWordAnswer(item.srsWordId, true, 'good');
      } else {
        StorageService.markMistakeResolved(item.id, true);
      }

      // 対応する単語のSRS進捗も向上（マスター・得意化）
      if (matchedWord) {
        StorageService.recordWordAnswer(matchedWord.id, true);
        StorageService.resolveMistakesForWord(matchedWord.id, matchedWord);
      } else if (item.wordId) {
        StorageService.resolveMistakesForWord(item.wordId);
      }
      StorageService.resolveMistakeByQuestion(item.question, item.correctAnswer);
    } else {
      SoundEffects.playWrong();
      StorageService.recordMistake({
        ...item,
        userAnswer: val
      });
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
