// テキスト自動解析・CSVインポートサービス
import { isCyrillic, isJapanese } from '../utils/helpers.js';

export class TextParserService {
  /**
   * 貼り付けられたテキストを解析して単語オブジェクトの配列を返す
   * @param {string} rawText 
   * @returns {Array<Object>}
   */
  static parseText(rawText) {
    if (!rawText || !rawText.trim()) return [];

    const text = rawText.trim();

    // 1. JSON形式の可能性をチェック
    if (text.startsWith('[') || text.startsWith('{')) {
      try {
        const parsed = JSON.parse(text);
        if (Array.isArray(parsed)) return parsed.map(this.normalizeItem);
        if (parsed.vocabulary && Array.isArray(parsed.vocabulary)) return parsed.vocabulary.map(this.normalizeItem);
        return [this.normalizeItem(parsed)];
      } catch (e) {
        // 通常のテキスト解析へフォールバック
      }
    }

    // 2. キーバリュー形式（「日本語：〜 \n モンゴル語：〜」）のブロック判定
    if (text.includes('日本語') || text.includes('モンゴル語') || text.includes('語幹')) {
      const kvItems = this.parseKeyValueBlocks(text);
      if (kvItems.length > 0) return kvItems;
    }

    // 3. 表形式（タブ区切り、CSV、または「 - 」「 / 」「 | 」区切り）を行ごとに解析
    const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
    const results = [];

    // ヘッダー行があればスキップ判定
    let startIndex = 0;
    if (lines.length > 1) {
      const firstLine = lines[0].toLowerCase();
      if (firstLine.includes('日本語') || firstLine.includes('mongol') || firstLine.includes('モンゴル') || firstLine.includes('単語')) {
        startIndex = 1;
      }
    }

    for (let i = startIndex; i < lines.length; i++) {
      const line = lines[i];
      if (!line) continue;

      const item = this.parseLine(line);
      if (item && (item.mongolian || item.japanese)) {
        results.push(this.normalizeItem(item));
      }
    }

    return results;
  }

  /**
   * キーバリュー形式のブロック解析
   * 例:
   * 日本語：食べる
   * モンゴル語：идэх
   * 語幹：ид
   * 
   * 日本語：学校
   * モンゴル語：сургууль
   */
  static parseKeyValueBlocks(text) {
    // 空行または「---」などでブロックに分割
    const blocks = text.split(/\n\s*\n|---+/).map(b => b.trim()).filter(Boolean);
    const items = [];

    for (const block of blocks) {
      const lines = block.split(/\r?\n/);
      const current = {};

      for (const line of lines) {
        // 全角・半角コロンで分割
        const match = line.match(/^([^:：]+)[:：]\s*(.+)$/);
        if (match) {
          const key = match[1].trim();
          const val = match[2].trim();

          if (/日本語|意味|訳|ja/i.test(key)) current.japanese = val;
          else if (/モンゴル語|モンゴル|キリル|mn/i.test(key)) current.mongolian = val;
          else if (/語幹|ルート|root/i.test(key)) current.root = val;
          else if (/品詞|pos/i.test(key)) current.pos = val;
          else if (/発音|読み|pronunciation/i.test(key)) current.pronunciation = val;
          else if (/例文\(?mn\)?|例文|モンゴル語例文/i.test(key)) current.exampleMn = val;
          else if (/例文\(?ja\)?|例文訳|日本語例文/i.test(key)) current.exampleJa = val;
          else if (/メモ|注意|解説|note/i.test(key)) current.note = val;
          else if (/カテゴリー|課|category/i.test(key)) current.category = val;
          else if (/重要度|priority/i.test(key)) current.priority = val;
        }
      }

      if (current.mongolian || current.japanese) {
        items.push(this.normalizeItem(current));
      }
    }

    return items;
  }

  /**
   * 1行ごとの解析（タブ、CSV、パイプ、ハイフン、スラッシュ区切り）
   */
  static parseLine(line) {
    let parts = [];

    // Markdownテーブルやパイプ区切り: | 日本語 | モンゴル語 |
    if (line.includes('|')) {
      parts = line.split('|').map(p => p.trim()).filter(p => p && !p.match(/^[-:]+$/));
    }
    // タブ区切り (TSV / Excelコピー)
    else if (line.includes('\t')) {
      parts = line.split('\t').map(p => p.trim());
    }
    // カンマ区切り (CSV)
    else if (line.includes(',')) {
      parts = this.parseCSVLine(line);
    }
    // スラッシュ区切り
    else if (line.includes(' / ') || line.includes('／')) {
      parts = line.split(/ \/ |／/).map(p => p.trim());
    }
    // ハイフン・矢印区切り: 日本語 - モンゴル語
    else if (line.includes(' - ') || line.includes(' — ') || line.includes(' → ')) {
      parts = line.split(/ - | — | → /).map(p => p.trim());
    }
    // スペース区切りフォールバック
    else {
      parts = line.split(/\s{2,}/).map(p => p.trim());
    }

    if (parts.length === 0) return null;

    const item = {
      mongolian: "",
      japanese: "",
      root: "",
      pos: "",
      note: ""
    };

    if (parts.length === 1) {
      // 1要素だけの場合は文字種から判定
      if (isCyrillic(parts[0])) item.mongolian = parts[0];
      else item.japanese = parts[0];
      return item;
    }

    // parts の中からキリル文字（モンゴル語）と日本語を賢く仕分ける
    const part0IsCyr = isCyrillic(parts[0]);
    const part1IsCyr = isCyrillic(parts[1]);

    if (part0IsCyr && !part1IsCyr) {
      item.mongolian = parts[0];
      item.japanese = parts[1];
      if (parts[2]) item.pos = parts[2];
      if (parts[3]) item.note = parts.slice(3).join(' ');
    } else if (!part0IsCyr && part1IsCyr) {
      item.japanese = parts[0];
      item.mongolian = parts[1];
      if (parts[2]) item.pos = parts[2];
      if (parts[3]) item.note = parts.slice(3).join(' ');
    } else {
      // 判別不能時は順序通り
      item.japanese = parts[0];
      item.mongolian = parts[1];
      if (parts[2]) item.pos = parts[2];
      if (parts[3]) item.note = parts.slice(3).join(' ');
    }

    return item;
  }

  /**
   * カンマ区切り行のパース（クォート対応）
   */
  static parseCSVLine(line) {
    const regex = /(?:^|,)(?:"([^"]*(?:""[^"]*)*)"|([^",]*))/g;
    const parts = [];
    let match;
    while ((match = regex.exec(line)) !== null) {
      if (match.index === regex.lastIndex) regex.lastIndex++;
      const val = match[1] !== undefined ? match[1].replace(/""/g, '"') : match[2];
      parts.push(val.trim());
    }
    return parts;
  }

  /**
   * 単語オブジェクトの正規化
   * 元の教材にない情報を勝手に追加しないが、動詞語幹の推定ヒントは支援
   */
  static normalizeItem(raw) {
    const mn = (raw.mongolian || '').trim();
    const ja = (raw.japanese || '').trim();

    // 語幹が未指定で、動詞（-х で終わる語）の場合は自動推定ヒントを生成
    let root = (raw.root || '').trim();
    if (!root && mn.endsWith('х') && mn.length > 2) {
      root = mn.slice(0, -1) + '-';
    }

    return {
      mongolian: mn,
      japanese: ja,
      pronunciation: (raw.pronunciation || '').trim(),
      root: root,
      pos: (raw.pos || (mn.endsWith('х') ? '動詞' : '名詞')).trim(),
      category: (raw.category || '登録単語').trim(),
      priority: (raw.priority || '★★★').trim(),
      exampleMn: (raw.exampleMn || '').trim(),
      exampleJa: (raw.exampleJa || '').trim(),
      note: (raw.note || '').trim()
    };
  }
}
