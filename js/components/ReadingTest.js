// モンゴル語読解テストコンポーネント（長文読解・単語タップ辞書解説・「調べた単語」保存連携）
import { StorageService } from '../services/storage.js';
import { SpeechService } from '../services/speech.js';
import { GamificationService } from '../services/gamification.js';
import { SoundEffects, findWordInDictionary } from '../utils/helpers.js';

export class ReadingTestComponent {
  static container = null;
  static onNavigate = null;

  static state = {
    view: 'list', // 'list' | 'passage' | 'looked_up_words'
    selectedPassage: null,
    showTranslation: false,
    isPlayingFullAudio: false,
    userAnswers: {}, // { [qIndex]: selectedOptionIndex }
    submitted: false,
    score: 0,
    searchLookupKeyword: '',
    currentModalWord: null
  };

  static render(container, onNavigate) {
    this.container = container;
    this.onNavigate = onNavigate;

    if (this.state.view === 'passage' && this.state.selectedPassage) {
      this.renderPassage();
    } else if (this.state.view === 'looked_up_words') {
      this.renderLookedUpWords();
    } else {
      this.state.view = 'list';
      this.renderList();
    }
  }

  // ==========================================
  // 1. パッセージ一覧画面
  // ==========================================
  static renderList() {
    const passages = StorageService.getReadingQuizzes() || [];
    const lookedUpList = StorageService.getLookedUpWords() || [];

    this.container.innerHTML = `
      <div class="animate-fade-in max-w-2xl mx-auto px-4 py-4 space-y-4">
        
        <!-- ヘッダー -->
        <div class="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-700 rounded-2xl p-5 text-white shadow-md relative overflow-hidden">
          <div class="relative z-10">
            <div class="flex items-center justify-between mb-2">
              <span class="text-xs font-bold px-2 py-0.5 rounded-full bg-white/20 text-white border border-white/30">
                📖 モンゴル語長文読解
              </span>
              <!-- 調べた単語帳クイックアクセスボタン -->
              <button type="button" id="btn-goto-looked-up" class="px-3 py-1 bg-amber-400 hover:bg-amber-300 text-slate-900 rounded-full font-black text-xs shadow-xs flex items-center gap-1.5 transition-all cursor-pointer">
                <span>📌 調べた単語帳</span>
                <span class="bg-slate-900 text-white px-1.5 py-0.2 rounded-full text-[10px]">${lookedUpList.length}</span>
              </button>
            </div>
            <h2 class="text-xl sm:text-2xl font-black tracking-tight flex items-center gap-2">
              <span>📖</span> 読解テスト ＆ 単語タップ辞書
            </h2>
            <p class="text-xs text-emerald-100 mt-1 leading-relaxed">
              本文中のあらゆる単語をタップするだけで、その場で意味や語幹・文法構造がわかり「調べた単語」として保存されます。
            </p>
          </div>
          <div class="absolute -right-4 -bottom-6 text-7xl opacity-15 select-none pointer-events-none">
            📚
          </div>
        </div>

        <!-- 使い方アドバイスバナー -->
        <div class="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-900 flex items-center gap-2">
          <span class="text-lg shrink-0">💡</span>
          <div>
            <strong>読解のコツ:</strong> わからない単語に出会ったら迷わずタップ！意味と語尾の変化（格変化・活用）が即座に確認できます。
          </div>
        </div>

        <!-- 記事一覧 -->
        <div class="space-y-3">
          <h3 class="text-xs font-bold text-slate-400 uppercase tracking-wider">
            読解テキストを選ぶ（全${passages.length}編）
          </h3>

          <div class="grid grid-cols-1 gap-3">
            ${passages.map(p => {
              const preview = p.textMn.replace(/\n+/g, ' ').slice(0, 75) + '...';
              return `
                <div class="btn-select-passage bg-white hover:bg-emerald-50/40 p-4 rounded-xl border border-slate-200 hover:border-emerald-400 shadow-2xs hover:shadow-xs transition-all cursor-pointer group flex flex-col justify-between" data-id="${p.id}">
                  <div>
                    <div class="flex items-center justify-between mb-1.5">
                      <div class="flex items-center gap-2">
                        <span class="text-[11px] font-extrabold px-2 py-0.5 rounded-full ${p.level === '初級' ? 'bg-emerald-100 text-emerald-800' : 'bg-sky-100 text-sky-800'}">
                          ${p.level}
                        </span>
                        <span class="text-xs text-slate-400 font-medium">${p.categoryLabel}</span>
                      </div>
                      <span class="text-xs text-slate-400 font-bold">${p.questions.length}問の設問</span>
                    </div>

                    <h4 class="text-base font-black text-slate-800 group-hover:text-emerald-700 transition-colors cyrillic-text">
                      ${p.titleMn}
                    </h4>
                    <div class="text-xs text-slate-500 font-medium mb-2">
                      ${p.titleJa}
                    </div>

                    <p class="text-xs text-slate-600 line-clamp-2 leading-relaxed cyrillic-text bg-slate-50 p-2 rounded-lg border border-slate-100">
                      ${preview}
                    </p>
                  </div>

                  <div class="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-emerald-700">
                    <span>この文章を読む ＆ 問題を解く</span>
                    <span class="group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>

      </div>
    `;

    this.bindListEvents();
  }

  static bindListEvents() {
    this.container.querySelectorAll('.btn-select-passage').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const passages = StorageService.getReadingQuizzes() || [];
        const p = passages.find(item => item.id === id);
        if (p) {
          this.state.selectedPassage = p;
          this.state.view = 'passage';
          this.state.showTranslation = false;
          this.state.userAnswers = {};
          this.state.submitted = false;
          this.state.score = 0;
          this.renderPassage();
        }
      });
    });

    const lookedUpBtn = this.container.querySelector('#btn-goto-looked-up');
    if (lookedUpBtn) {
      lookedUpBtn.addEventListener('click', () => {
        this.state.view = 'looked_up_words';
        this.renderLookedUpWords();
      });
    }
  }

  // ==========================================
  // 2. 本文読解 ＆ 問題演習画面
  // ==========================================
  static renderPassage() {
    const p = this.state.selectedPassage;
    if (!p) return;

    // 本文の各単語をタップ可能なトークンに変換
    const renderInteractiveText = (text) => {
      const paragraphs = text.split(/\n+/);
      return paragraphs.map(para => {
        // キリル文字単語を検出してインタラクティブなspanに包む
        const tokens = para.split(/([А-Яа-яЁёӨөҮү]+(?:-[А-Яа-яЁёӨөҮү]+)?)/g);
        const wrapped = tokens.map(token => {
          if (/^[А-Яа-яЁёӨөҮү]+(?:-[А-Яа-яЁёӨөҮү]+)?$/.test(token)) {
            const isLookedUp = StorageService.isWordLookedUp(token);
            return `<span class="clickable-word cursor-pointer px-0.5 rounded transition-colors inline-block ${
              isLookedUp 
                ? 'bg-amber-100/70 border-b-2 border-amber-400 font-bold text-amber-950' 
                : 'hover:bg-emerald-100 hover:text-emerald-900 border-b border-dotted border-slate-300'
            }" data-word="${token}" title="タップして辞書解説を表示">${token}</span>`;
          }
          return token;
        }).join('');
        return `<p class="mb-3 leading-relaxed cyrillic-text text-base sm:text-lg text-slate-800 tracking-wide">${wrapped}</p>`;
      }).join('');
    };

    const answeredCount = Object.keys(this.state.userAnswers).length;
    const totalQ = p.questions.length;

    this.container.innerHTML = `
      <div class="animate-fade-in max-w-2xl mx-auto px-4 py-3 space-y-4">
        
        <!-- 上部ナビゲーションバー -->
        <div class="flex items-center justify-between text-xs font-bold text-slate-500">
          <button type="button" id="btn-back-to-list" class="flex items-center gap-1 text-slate-600 hover:text-slate-900 p-1 cursor-pointer">
            <span>←</span> 読解一覧に戻る
          </button>
          
          <div class="flex items-center gap-2">
            <!-- 調べた単語帳ボタン -->
            <button type="button" id="btn-open-looked-up-from-passage" class="px-2.5 py-1 rounded-full bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 flex items-center gap-1 cursor-pointer">
              <span>📌 調べた単語</span>
              <span id="badge-lookup-count" class="font-extrabold">${StorageService.getLookedUpWords().length}</span>
            </button>
          </div>
        </div>

        <!-- 本文カード -->
        <div class="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-4 relative">
          
          <!-- タイトル ＆ 音声再生コントロール -->
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div>
              <div class="flex items-center gap-2 mb-1">
                <span class="text-[10px] font-extrabold px-2 py-0.5 rounded-full ${p.level === '初級' ? 'bg-emerald-100 text-emerald-800' : 'bg-sky-100 text-sky-800'}">
                  ${p.level}
                </span>
                <span class="text-xs text-slate-400 font-medium">${p.categoryLabel}</span>
              </div>
              <h2 class="text-xl sm:text-2xl font-black text-slate-900 cyrillic-text">
                ${p.titleMn}
              </h2>
              <div class="text-xs text-slate-500 font-medium">
                ${p.titleJa}
              </div>
            </div>

            <!-- 全文読み上げボタン -->
            <button type="button" id="btn-play-full-audio" class="self-start sm:self-center px-3 py-1.5 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 font-bold text-xs flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer">
              <span>🔊</span>
              <span>全文を聞く</span>
            </button>
          </div>

          <!-- 単語タップガイド -->
          <div class="bg-emerald-50/70 border border-emerald-200 rounded-xl px-3 py-1.5 text-[11px] text-emerald-900 flex items-center justify-between">
            <div class="flex items-center gap-1.5">
              <span>👆</span>
              <span><strong>単語をタップ:</strong> 日本語訳と語幹・文法構造がポップアップします</span>
            </div>
            <span class="text-slate-400 text-[10px]">自動保存対応</span>
          </div>

          <!-- 本文（インタラクティブ表示） -->
          <div class="passage-content py-2 selection:bg-teal-100">
            ${renderInteractiveText(p.textMn)}
          </div>

          <!-- 日本語訳トグルボタン ＆ 翻訳カード -->
          <div class="pt-2 border-t border-slate-100 space-y-2">
            <button type="button" id="btn-toggle-translation" class="text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1.5 cursor-pointer">
              <span>${this.state.showTranslation ? '▼' : '▶'}</span>
              <span>${this.state.showTranslation ? '日本語訳を隠す' : '🇯🇵 日本語全訳を表示する'}</span>
            </button>

            ${this.state.showTranslation ? `
              <div class="animate-fade-in bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                ${p.textJa}
              </div>
            ` : ''}
          </div>

        </div>

        <!-- 読解問題セクション -->
        <div class="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
          <div class="flex items-center justify-between border-b border-slate-100 pb-2">
            <h3 class="text-base font-extrabold text-slate-800 flex items-center gap-1.5">
              <span>📝</span> 内容理解テスト（全${totalQ}問）
            </h3>
            <span class="text-xs text-slate-500 font-medium">
              解答済み: ${answeredCount} / ${totalQ}
            </span>
          </div>

          <!-- 設問一覧 -->
          <div class="space-y-5">
            ${p.questions.map((q, idx) => {
              const selectedOpt = this.state.userAnswers[idx];
              const isAnswered = selectedOpt !== undefined;
              const isCorrect = isAnswered && selectedOpt === q.answer;

              return `
                <div class="p-4 rounded-xl border ${this.state.submitted ? (isCorrect ? 'border-emerald-300 bg-emerald-50/40' : 'border-rose-300 bg-rose-50/40') : 'border-slate-200 bg-slate-50/50'} space-y-3">
                  
                  <div>
                    <div class="text-xs font-extrabold text-slate-500 mb-0.5">問 ${idx + 1}.</div>
                    <div class="text-sm sm:text-base font-black text-slate-900 cyrillic-text">
                      ${q.question}
                    </div>
                    <div class="text-xs text-slate-500 font-medium mt-0.5">
                      🇯🇵 ${q.questionJa}
                    </div>
                  </div>

                  <!-- 4択選択肢 -->
                  <div class="grid grid-cols-1 gap-2">
                    ${q.options.map((opt, optIdx) => {
                      let btnStyle = 'border-slate-200 hover:border-slate-400 bg-white text-slate-800';
                      if (this.state.submitted) {
                        if (optIdx === q.answer) {
                          btnStyle = 'border-emerald-500 bg-emerald-100/90 text-emerald-950 font-extrabold ring-1 ring-emerald-400';
                        } else if (selectedOpt === optIdx) {
                          btnStyle = 'border-rose-400 bg-rose-100/90 text-rose-950 font-bold line-through';
                        }
                      } else if (selectedOpt === optIdx) {
                        btnStyle = 'border-teal-500 bg-teal-50 text-teal-900 font-bold ring-1 ring-teal-400';
                      }

                      return `
                        <button type="button" class="btn-select-option text-left p-3 rounded-xl border text-xs sm:text-sm transition-all flex items-center justify-between cursor-pointer ${btnStyle}" data-qindex="${idx}" data-optindex="${optIdx}" ${this.state.submitted ? 'disabled' : ''}>
                          <span><span class="font-normal text-slate-400 mr-1.5">${optIdx + 1}.</span> ${opt}</span>
                          ${this.state.submitted && optIdx === q.answer ? '<span class="text-emerald-700 font-bold">正解 ✓</span>' : ''}
                        </button>
                      `;
                    }).join('')}
                  </div>

                  <!-- 解説表示（提出後） -->
                  ${this.state.submitted ? `
                    <div class="p-3 bg-white rounded-xl border border-slate-200 text-xs text-slate-700 space-y-1">
                      <div class="font-bold flex items-center gap-1 ${isCorrect ? 'text-emerald-800' : 'text-rose-800'}">
                        <span>${isCorrect ? '⭕ 正解！' : '❌ 不正解'}</span>
                        <span class="text-slate-500 font-normal">解説:</span>
                      </div>
                      <div class="leading-relaxed">${q.explanation}</div>
                    </div>
                  ` : ''}

                </div>
              `;
            }).join('')}
          </div>

          <!-- 採点・次へアクション -->
          <div class="pt-2">
            ${!this.state.submitted ? `
              <button type="button" id="btn-submit-reading" class="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl shadow-md transition-all active:scale-98 text-sm flex items-center justify-center gap-2 cursor-pointer ${answeredCount === totalQ ? '' : 'opacity-80'}">
                <span>✓</span>
                <span>回答を提出して採点する（${answeredCount} / ${totalQ}）</span>
              </button>
            ` : `
              <div class="space-y-3">
                <div class="p-4 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-300 flex items-center justify-between">
                  <div>
                    <div class="text-xs text-slate-500">採点結果</div>
                    <div class="text-lg font-black text-emerald-900">
                      ${this.state.score} / ${totalQ} 問正解！
                    </div>
                  </div>
                  <div class="text-right">
                    <span class="text-xs font-black px-2.5 py-1 rounded-full bg-emerald-600 text-white">
                      +${this.state.score * 30} PTS 獲得
                    </span>
                  </div>
                </div>

                <button type="button" id="btn-finish-reading" class="w-full py-3.5 bg-slate-800 hover:bg-slate-900 text-white font-extrabold rounded-xl shadow-md transition-all active:scale-98 text-sm cursor-pointer">
                  読解一覧に戻る →
                </button>
              </div>
            `}
          </div>

        </div>

        <!-- 単語タップ詳細ポップアップモーダルコンテナ -->
        <div id="word-detail-modal-container"></div>

      </div>
    `;

    this.bindPassageEvents();
  }

  static bindPassageEvents() {
    const p = this.state.selectedPassage;
    if (!p) return;

    // 戻る
    const backBtn = this.container.querySelector('#btn-back-to-list');
    if (backBtn) {
      backBtn.addEventListener('click', () => {
        SpeechService.stop();
        this.state.view = 'list';
        this.renderList();
      });
    }

    // 調べた単語帳ボタン
    const lookupBtn = this.container.querySelector('#btn-open-looked-up-from-passage');
    if (lookupBtn) {
      lookupBtn.addEventListener('click', () => {
        SpeechService.stop();
        this.state.view = 'looked_up_words';
        this.renderLookedUpWords();
      });
    }

    // 全文読み上げボタン
    const playBtn = this.container.querySelector('#btn-play-full-audio');
    if (playBtn) {
      playBtn.addEventListener('click', () => {
        const text = p.audioText || p.textMn;
        SpeechService.speak(text);
      });
    }

    // 日本語訳トグル
    const transBtn = this.container.querySelector('#btn-toggle-translation');
    if (transBtn) {
      transBtn.addEventListener('click', () => {
        this.state.showTranslation = !this.state.showTranslation;
        this.renderPassage();
      });
    }

    // 単語タップイベント
    this.container.querySelectorAll('.clickable-word').forEach(span => {
      span.addEventListener('click', () => {
        const rawWord = span.getAttribute('data-word');
        this.handleWordTap(rawWord, p);
      });
    });

    // 設問の選択肢クリック
    if (!this.state.submitted) {
      this.container.querySelectorAll('.btn-select-option').forEach(btn => {
        btn.addEventListener('click', () => {
          const qIndex = parseInt(btn.getAttribute('data-qindex'), 10);
          const optIndex = parseInt(btn.getAttribute('data-optindex'), 10);
          this.state.userAnswers[qIndex] = optIndex;
          this.renderPassage();
        });
      });

      // 提出ボタン
      const submitBtn = this.container.querySelector('#btn-submit-reading');
      if (submitBtn) {
        submitBtn.addEventListener('click', () => {
          this.submitReadingAnswers();
        });
      }
    } else {
      const finishBtn = this.container.querySelector('#btn-finish-reading');
      if (finishBtn) {
        finishBtn.addEventListener('click', () => {
          this.state.view = 'list';
          this.renderList();
        });
      }
    }
  }

  // ==========================================
  // 3. 単語タップ時の辞書検索 ＆ 保存処理
  // ==========================================
  static handleWordTap(rawWord, passage) {
    if (!rawWord) return;

    // 1. 形態素・格変化・辞書検索
    const wordInfo = findWordInDictionary(rawWord, passage.glossary);
    if (!wordInfo) return;

    // 2. 「調べた単語」としてローカルストレージに自動保存
    const saved = StorageService.saveLookedUpWord({
      rawWord: wordInfo.rawWord,
      dictForm: wordInfo.dictForm,
      meaning: wordInfo.meaning,
      pos: wordInfo.pos,
      pron: wordInfo.pron,
      passageTitle: passage.titleMn
    });

    // 3. 発音音声再生
    SpeechService.speak(wordInfo.dictForm || wordInfo.rawWord);

    // 4. バッジ更新
    const badge = this.container.querySelector('#badge-lookup-count');
    if (badge) {
      badge.textContent = StorageService.getLookedUpWords().length;
    }

    // 5. ポップアップモーダルを表示
    this.showWordModal(wordInfo, passage.titleMn);
  }

  static showWordModal(wordInfo, passageTitle) {
    const modalContainer = this.container.querySelector('#word-detail-modal-container');
    if (!modalContainer) return;

    modalContainer.innerHTML = `
      <div class="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-end sm:items-center justify-center p-3 animate-fade-in">
        <div class="bg-white rounded-2xl w-full max-w-sm p-5 border border-slate-200 shadow-xl space-y-3.5 relative">
          
          <!-- ヘッダー -->
          <div class="flex items-start justify-between">
            <div>
              <span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                ${wordInfo.pos || '単語解説'}
              </span>
              <div class="text-xl sm:text-2xl font-black text-slate-900 cyrillic-text mt-1 flex items-center gap-2">
                <span>${wordInfo.rawWord}</span>
                <button type="button" id="btn-modal-speak" class="p-1.5 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-700 text-sm cursor-pointer" title="音声を再生">
                  🔊
                </button>
              </div>
              ${wordInfo.pron ? `<div class="text-xs text-slate-400 font-medium">${wordInfo.pron}</div>` : ''}
            </div>

            <button type="button" id="btn-close-modal" class="text-slate-400 hover:text-slate-600 text-lg p-1 cursor-pointer">
              ✕
            </button>
          </div>

          <!-- 辞書形 ＆ 意味 -->
          <div class="space-y-2 bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs">
            <div class="flex items-center justify-between">
              <span class="text-slate-500 font-medium">📖 辞書形（基本形）:</span>
              <span class="font-extrabold text-slate-900 cyrillic-text text-sm">${wordInfo.dictForm || wordInfo.rawWord}</span>
            </div>

            <div class="pt-1.5 border-t border-slate-200/60">
              <span class="text-slate-500 font-medium">🇯🇵 日本語の意味:</span>
              <div class="text-sm font-black text-emerald-900 mt-0.5">${wordInfo.meaning}</div>
            </div>

            ${wordInfo.derivation ? `
              <div class="pt-1.5 border-t border-slate-200/60 text-slate-600">
                <span class="text-slate-500 font-medium">🌱 文法・語幹構造:</span>
                <div class="mt-0.5 text-[11px] leading-relaxed">${wordInfo.derivation}</div>
              </div>
            ` : ''}
          </div>

          <!-- 保存通知バッジ -->
          <div class="bg-amber-50 border border-amber-300 rounded-xl p-2.5 flex items-center justify-between text-xs text-amber-900">
            <div class="flex items-center gap-1.5 font-bold">
              <span>📌</span>
              <span>「調べた単語帳」に保存しました！</span>
            </div>
            <button type="button" id="btn-goto-words-from-modal" class="text-[11px] font-extrabold text-amber-800 underline cursor-pointer">
              単語帳を見る
            </button>
          </div>

          <button type="button" id="btn-modal-close-action" class="w-full py-2.5 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-xl text-xs cursor-pointer">
            閉じる
          </button>

        </div>
      </div>
    `;

    // モーダルイベント
    const close = () => {
      modalContainer.innerHTML = '';
      // 本文中の単語にハイライトを再適用
      this.renderPassage();
    };

    const closeBtn = modalContainer.querySelector('#btn-close-modal');
    if (closeBtn) closeBtn.addEventListener('click', close);

    const closeActionBtn = modalContainer.querySelector('#btn-modal-close-action');
    if (closeActionBtn) closeActionBtn.addEventListener('click', close);

    const speakBtn = modalContainer.querySelector('#btn-modal-speak');
    if (speakBtn) {
      speakBtn.addEventListener('click', () => {
        SpeechService.speak(wordInfo.dictForm || wordInfo.rawWord);
      });
    }

    const gotoWords = modalContainer.querySelector('#btn-goto-words-from-modal');
    if (gotoWords) {
      gotoWords.addEventListener('click', () => {
        this.state.view = 'looked_up_words';
        this.renderLookedUpWords();
      });
    }
  }

  // ==========================================
  // 4. 読解問題の採点
  // ==========================================
  static submitReadingAnswers() {
    const p = this.state.selectedPassage;
    if (!p) return;

    let correctCount = 0;
    p.questions.forEach((q, idx) => {
      if (this.state.userAnswers[idx] === q.answer) {
        correctCount++;
      }
    });

    this.state.score = correctCount;
    this.state.submitted = true;

    if (correctCount > 0) {
      SoundEffects.playCorrect();
    } else {
      SoundEffects.playWrong();
    }

    // ゲーミフィケーションスコア＆XP加算
    const xpGain = correctCount * 30;
    const scoreGain = correctCount * 100;
    GamificationService.recordAnswer({ isCorrect: correctCount === p.questions.length, testType: 'reading' });

    this.renderPassage();
  }

  // ==========================================
  // 5. 調べた単語帳 画面
  // ==========================================
  static renderLookedUpWords() {
    const list = StorageService.getLookedUpWords() || [];
    const keyword = (this.state.searchLookupKeyword || '').trim().toLowerCase();

    const filtered = list.filter(item => {
      if (!keyword) return true;
      return (
        (item.rawWord && item.rawWord.toLowerCase().includes(keyword)) ||
        (item.dictForm && item.dictForm.toLowerCase().includes(keyword)) ||
        (item.meaning && item.meaning.toLowerCase().includes(keyword))
      );
    });

    this.container.innerHTML = `
      <div class="animate-fade-in max-w-2xl mx-auto px-4 py-4 space-y-4">
        
        <!-- ヘッダー -->
        <div class="flex items-center justify-between">
          <button type="button" id="btn-back-from-lookup" class="text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer">
            <span>←</span> 読解に戻る
          </button>
          
          ${list.length > 0 ? `
            <button type="button" id="btn-clear-all-lookup" class="text-xs font-medium text-rose-500 hover:text-rose-700 cursor-pointer">
              すべて削除
            </button>
          ` : ''}
        </div>

        <div class="bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl p-5 text-white shadow-md relative overflow-hidden">
          <div class="flex items-center justify-between">
            <div>
              <div class="text-xs font-bold text-amber-100 mb-1">
                📌 保存された単語一覧
              </div>
              <h2 class="text-xl sm:text-2xl font-black">
                調べた単語帳 (${list.length}語)
              </h2>
              <p class="text-xs text-amber-100 mt-1">
                読解テストの本文でタップした単語がここに自動でストックされます。
              </p>
            </div>
            <div class="text-5xl opacity-20 select-none">
              📖
            </div>
          </div>
        </div>

        <!-- 検索バー -->
        ${list.length > 0 ? `
          <div class="relative">
            <input type="text" id="input-lookup-search" value="${this.state.searchLookupKeyword}" placeholder="単語または日本語の意味で検索..." class="w-full text-xs sm:text-sm p-3 pl-9 rounded-xl border border-slate-200 bg-white focus:border-amber-500 focus:outline-hidden">
            <span class="absolute left-3 top-3 text-slate-400">🔍</span>
          </div>
        ` : ''}

        <!-- リスト一覧 -->
        <div class="space-y-2.5">
          ${filtered.length === 0 ? `
            <div class="bg-white rounded-2xl p-8 border border-slate-200 text-center space-y-2">
              <div class="text-3xl">📭</div>
              <div class="text-sm font-bold text-slate-700">調べた単語はまだありません</div>
              <div class="text-xs text-slate-400">読解テストで気になる単語をタップすると、ここに自動保存されます。</div>
            </div>
          ` : filtered.map(item => `
            <div class="bg-white rounded-xl p-3.5 border border-slate-200 hover:border-amber-300 shadow-2xs space-y-1.5 transition-all">
              <div class="flex items-start justify-between gap-2">
                <div>
                  <div class="flex items-center gap-2">
                    <span class="text-base sm:text-lg font-black text-slate-900 cyrillic-text">${item.dictForm || item.rawWord}</span>
                    ${item.rawWord && item.rawWord !== item.dictForm ? `<span class="text-xs text-slate-400 font-medium">（本文: ${item.rawWord}）</span>` : ''}
                    <button type="button" class="btn-speak-lookup p-1 text-slate-400 hover:text-amber-600 cursor-pointer" data-word="${item.dictForm || item.rawWord}" title="発音を聞く">
                      🔊
                    </button>
                  </div>
                  ${item.pron ? `<div class="text-[11px] text-slate-400">${item.pron}</div>` : ''}
                </div>

                <button type="button" class="btn-delete-lookup text-slate-300 hover:text-rose-500 text-sm p-1 cursor-pointer" data-id="${item.id}" title="単語帳から削除">
                  ✕
                </button>
              </div>

              <div class="text-xs font-bold text-emerald-900 bg-emerald-50/60 p-2 rounded-lg border border-emerald-100">
                ${item.meaning}
              </div>

              <div class="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-100">
                <span>出典: ${item.passageTitle || '読解テキスト'}</span>
                <span>検索回数: ${item.lookupCount || 1}回</span>
              </div>
            </div>
          `).join('')}
        </div>

      </div>
    `;

    this.bindLookedUpEvents();
  }

  static bindLookedUpEvents() {
    const backBtn = this.container.querySelector('#btn-back-from-lookup');
    if (backBtn) {
      backBtn.addEventListener('click', () => {
        if (this.state.selectedPassage) {
          this.state.view = 'passage';
          this.renderPassage();
        } else {
          this.state.view = 'list';
          this.renderList();
        }
      });
    }

    const searchInput = this.container.querySelector('#input-lookup-search');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.state.searchLookupKeyword = e.target.value;
        this.renderLookedUpWords();
      });
    }

    this.container.querySelectorAll('.btn-speak-lookup').forEach(btn => {
      btn.addEventListener('click', () => {
        const word = btn.getAttribute('data-word');
        SpeechService.speak(word);
      });
    });

    this.container.querySelectorAll('.btn-delete-lookup').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        StorageService.deleteLookedUpWord(id);
        this.renderLookedUpWords();
      });
    });

    const clearBtn = this.container.querySelector('#btn-clear-all-lookup');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        if (confirm('保存された「調べた単語」をすべてクリアしますか？')) {
          StorageService.clearLookedUpWords();
          this.renderLookedUpWords();
        }
      });
    }
  }
}
