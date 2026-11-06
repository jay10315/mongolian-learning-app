// モンゴル語文法リファレンス・付録まとめコンポーネント（全48項目完全対応）
import { StorageService } from '../services/storage.js';

export class ReferenceGuideComponent {
  static render(container, onNavigate) {
    const grammarList = StorageService.getGrammar();

    container.innerHTML = `
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
            語幹に含まれる母音が男性母音であれば、付く語尾も男性母音（-аас, -сан, -на, -аар など）になります。女性母音であれば女性母音の語尾（-ээス, -сэн, -нэ, -ээр など）が接続します。
          </p>
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
                </div>
              </div>
            `).join('')}
          </div>
        </div>

      </div>
    `;

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
  }
}
