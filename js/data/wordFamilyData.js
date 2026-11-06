// 類義語・対義語・語根ファミリー（派生語）学習データ
export const wordFamilyData = {
  // --- 対義語ペア (Эсрэг утга) ---
  antonyms: [
    {
      id: "ant_1",
      wordA: "том",
      meaningA: "大きい",
      wordB: "жижиг",
      meaningB: "小さい",
      exampleA: "том байшин (大きな家)",
      exampleB: "жижиг шувуу (小さな鳥)"
    },
    {
      id: "ant_2",
      wordA: "хурдан",
      meaningA: "速い",
      wordB: "удаан",
      meaningB: "遅い",
      exampleA: "хурдан морь (速い馬)",
      exampleB: "удаан явах (ゆっくり歩く)"
    },
    {
      id: "ant_3",
      wordA: "халуун",
      meaningA: "熱い・暑い",
      wordB: "хүйтэн",
      meaningB: "冷たい・寒い",
      exampleA: "халуун цай (熱いお茶)",
      exampleB: "хүйтэн салхи (冷たい風)"
    },
    {
      id: "ant_4",
      wordA: "өндөр",
      meaningA: "高い",
      wordB: "намхан",
      meaningB: "低い",
      exampleA: "өндөр уул (高い山)",
      exampleB: "намхан сандал (低い椅子)"
    },
    {
      id: "ant_5",
      wordA: "үнэтэй",
      meaningA: "高価な・高い",
      wordB: "хямд",
      meaningB: "安い",
      exampleA: "үнэтэй машин (高い車)",
      exampleB: "хямд бараа (安い品物)"
    },
    {
      id: "ant_6",
      wordA: "хүнд",
      meaningA: "重い",
      wordB: "хөнгөн",
      meaningB: "軽い",
      exampleA: "хүнд ачаа (重い荷物)",
      exampleB: "хөнгөн хувцас (薄着・軽い服)"
    },
    {
      id: "ant_7",
      wordA: "шинэ",
      meaningA: "新しい",
      wordB: "хуучин",
      meaningB: "古い",
      exampleA: "шинэ жил (新年)",
      exampleB: "хуучин ном (古本)"
    },
    {
      id: "ant_8",
      wordA: "баярлах",
      meaningA: "喜ぶ",
      wordB: "гуних",
      meaningB: "悲しむ",
      exampleA: "их баярлаж байна (とても喜んでいる)",
      exampleB: "бүү гунь (悲しまないで)"
    }
  ],

  // --- 類義語ペア (Ойролцоо утга) ---
  synonyms: [
    {
      id: "syn_1",
      wordA: "сайхан",
      meaningA: "良い、美しい",
      wordB: "гоё",
      meaningB: "綺麗な、素敵な（口語で多用）",
      nuance: "сайхан は心や風景、味など広範な「良さ・素晴らしさ」、гоё は見た目の美しさやオシャレさを指します。"
    },
    {
      id: "syn_2",
      wordA: "ажил",
      meaningA: "仕事・用事",
      wordB: "хөдөлмөр",
      meaningB: "労働・勤労",
      nuance: "ажил は日常のタスクや職業、хөдөлмөр は肉体的・精神的な努力を伴う「労働・働き」を表します。"
    },
    {
      id: "syn_3",
      wordA: "үнэн",
      meaningA: "真実・本当",
      wordB: "бодит",
      meaningB: "現実・実際",
      nuance: "үнэн は「嘘偽りがないこと」、бодит は客観的な「実在・現実」を強調します。"
    }
  ],

  // --- 語根ファミリー（同一語根からの派生語ツリー） ---
  families: [
    {
      root: "ном",
      rootMeaning: "本・経典",
      derivations: [
        { word: "номын сан", meaning: "図書館 (本＋蔵)" },
        { word: "номхон", meaning: "おとなしい、従順な (本のように静かな)" },
        { word: "номтой", meaning: "学問のある、博識な" }
      ]
    },
    {
      root: "үзэх",
      rootMeaning: "見る・経験する",
      derivations: [
        { word: "үзэсгэлэн", meaning: "展覧会・美しいもの" },
        { word: "үзэгч", meaning: "観客・視聴者 (-гч = 〜する人)" },
        { word: "үзэл", meaning: "見解・思想・主義" },
        { word: "үзүүлэх", meaning: "見せる・示す (使役)" }
      ]
    },
    {
      root: "гэр",
      rootMeaning: "家・ゲル",
      derivations: [
        { word: "гэр бүл", meaning: "家族・家庭" },
        { word: "гэрлэх", meaning: "結婚する (所帯を持つ)" },
        { word: "гэрийн даалгавар", meaning: "宿題 (家庭の課題)" }
      ]
    },
    {
      root: "хэл",
      rootMeaning: "舌・言葉・言語",
      derivations: [
        { word: "хэлэх", meaning: "言う・話す" },
        { word: "хэлэлцүүлэг", meaning: "ディスカッション・協議" },
        { word: "хэлний дүрэм", meaning: "文法 (言語の規則)" }
      ]
    }
  ]
};
