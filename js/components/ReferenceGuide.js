import { SpeechService } from '../services/speech.js';
import { DeclensionTestComponent } from './DeclensionTest.js';
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
              🟢 ① 隠れн (нууц н) の法則
            </button>
            <button type="button" class="btn-ref-subtab px-3.5 py-1.5 rounded-lg font-bold transition-all bg-white border border-slate-200 text-slate-700 hover:bg-indigo-50" data-tab="ref-tab-hidden-g">
              🔵 ② 隠れг (нууц г) の法則
            </button>
            <button type="button" class="btn-ref-subtab px-3.5 py-1.5 rounded-lg font-bold transition-all bg-white border border-slate-200 text-slate-700 hover:bg-indigo-50" data-tab="ref-tab-dropping-vowel">
              🟣 ③ 落ちる母音 (гээгдэх эгшиг)
            </button>
            <button type="button" class="btn-ref-subtab px-3.5 py-1.5 rounded-lg font-bold transition-all bg-white border border-slate-200 text-slate-700 hover:bg-indigo-50" data-tab="ref-tab-compare">
              ⚠️ ④ ひっかけ対比表
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
