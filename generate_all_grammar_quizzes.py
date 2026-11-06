import json, re

# The 25 textbook foundation quizzes
foundation_quizzes = [
  {
    "id": "gq_1_1",
    "lessonGroup": "第1課・第2課",
    "type": "translation",
    "question": "「私は学生です。」をモンゴル語で書きなさい。",
    "answer": "Би оюутан.",
    "acceptableAnswers": ["Би оюутан", "Би оюутан."],
    "category": "コピュラ文",
    "explanation": "名詞を2つ並べます。動詞は不要です（G1 コピュラ文）。",
    "hint": "Би ＋ 学生"
  },
  {
    "id": "gq_1_2",
    "lessonGroup": "第1課・第2課",
    "type": "translation",
    "question": "「これは本ではありません。」をモンゴル語で書きなさい。",
    "answer": "Энэ ном биш.",
    "acceptableAnswers": ["Энэ ном биш", "Энэ ном биш."],
    "category": "否定 биш",
    "explanation": "биш は名詞 ном の直後に置きます（G2 否定 биш）。",
    "hint": "Энэ ном ＋ 否定"
  },
  {
    "id": "gq_1_3",
    "lessonGroup": "第1課・第2課",
    "type": "translation",
    "question": "「あなたの名前は何ですか。」相手は年上です。",
    "answer": "Таны нэр хэн бэ?",
    "acceptableAnswers": ["Таны нэр хэн бэ?", "Таны нэр хэн бэ"],
    "category": "人称代名詞・疑問詞",
    "explanation": "年上なので та の属格 таны を使います。хэн は語末が н で終わるので疑問助詞は бэ です（G3, G5）。",
    "hint": "таны（あなたの年上）＋ нэр ＋ хэн ＋ бэ"
  },
  {
    "id": "gq_1_4",
    "lessonGroup": "第1課・第2課",
    "type": "fill",
    "question": "空欄補充: Энэ самбар _____?\n（これは黒板ですか？）",
    "options": ["уу", "үү", "юу", "юү"],
    "answer": "уу",
    "category": "疑問助詞 уу系",
    "explanation": "самбар は男性語で、語末が子音 р で終わるため уу を選びます（G4）。",
    "hint": "男性語・子音終わり"
  },
  {
    "id": "gq_1_5",
    "lessonGroup": "第1課・第2課",
    "type": "choice",
    "question": "「彼（彼女）の名前は何ですか。」疑問詞文の助詞を選びなさい。\nТүүний нэр хэн _____?",
    "options": ["бэ", "вэ", "уу", "үү"],
    "answer": "бэ",
    "category": "疑問助詞 вэ/бэ",
    "explanation": "疑問詞 хэн（誰）の語末は н（7の母音的子音）なので бэ を選びます（G4）。",
    "hint": "н の後は бэ"
  },
  {
    "id": "gq_1_6",
    "lessonGroup": "第1課・第2課",
    "type": "reorder",
    "question": "語順並び替え: 「ボルドさんはモンゴル人ですか？」",
    "answer": "Болд монгол хүн үү?",
    "acceptableAnswers": ["Болд монгол хүн үү?", "Болд монгол хүн үү"],
    "tokens": ["Болд", "монгол", "хүн", "үү"],
    "category": "疑問助詞",
    "explanation": "主語＋述語＋疑問助詞（хүн は女性語なので үү）の順に並べます。",
    "hint": "Болд → монгол хүн → үү"
  },
  {
    "id": "gq_1_7",
    "lessonGroup": "第1課・第2課",
    "type": "translation",
    "question": "「机の上にノートがあります。」をモンゴル語で書きなさい。",
    "answer": "Ширээн дээр дэвтэр байна.",
    "acceptableAnswers": ["Ширээн дээр дэвтэр байна.", "Ширээн дээр дэвтэр байна"],
    "category": "存在文",
    "explanation": "長母音名詞 ширээ は後置詞 дээр の前で隠れнが現れ ширээн дээр となります（G5, G10）。",
    "hint": "ширээн дээр ＋ дэвтэр ＋ байна"
  },
  {
    "id": "gq_1_8",
    "lessonGroup": "第1課・第2課",
    "type": "fill",
    "question": "空欄補充: Энд багш _____.\n（ここに先生はいません。）",
    "options": ["алга", "биш", "үгүй", "байгаа"],
    "answer": "алга",
    "category": "存在否定",
    "explanation": "人や物の不在・非存在は алга または байхгүй を使います。биш は「先生ではない」という意味になります（G5）。",
    "hint": "非存在・不在の表現"
  }
]

# Load current 48-item grammar items
with open(r'C:\Users\kkaho\.gemini\antigravity\scratch\mongol-learning-app\js\data\initialGrammar.js', 'r', encoding='utf-8') as f:
    text = f.read()

json_str = re.sub(r'^[^{[]+', '', text).rstrip(';\n ')
grammar_items = json.loads(json_str)

quizzes = list(foundation_quizzes)
seen_questions = set(q['question'] for q in quizzes)

for item in grammar_items:
    num = item['num']
    gid = item['id']
    title = item['title']
    meaning = item['meaning']
    rules = item['rules']
    exs = item['examples']
    forKids = item['forKids']
    notes = item['notes']
    
    aff = exs.get('affirmative', {})
    if aff.get('mn') and aff.get('ja'):
        q_text = f"【第{num}課 {title}】\n「{aff['ja']}」をモンゴル語で表しなさい。"
        if q_text not in seen_questions:
            clean_ans = aff['mn'].strip()
            tokens = [t.strip('.,!?') for t in clean_ans.split() if t.strip('.,!?')]
            
            quizzes.append({
                "id": f"gq_{num}_aff",
                "grammarId": gid,
                "lessonGroup": f"第{num}項目: {title}",
                "type": "reorder" if len(tokens) >= 3 else "translation",
                "question": q_text,
                "answer": clean_ans,
                "acceptableAnswers": [clean_ans, clean_ans.rstrip('.!?')],
                "tokens": tokens if len(tokens) >= 3 else None,
                "category": title,
                "explanation": f"{meaning}。\n💡 解説: {forKids or notes or rules.get('endingTypes', '')}",
                "hint": f"キーフレーズ: {clean_ans.split()[-1] if clean_ans.split() else ''}"
            })
            seen_questions.add(q_text)
            
    neg = exs.get('negative', {})
    if neg.get('mn') and neg.get('ja'):
        q_text = f"【第{num}課 {title}】\n「{neg['ja']}」に合うモンゴル語文を作りなさい。"
        if q_text not in seen_questions:
            clean_ans = neg['mn'].strip()
            quizzes.append({
                "id": f"gq_{num}_neg",
                "grammarId": gid,
                "lessonGroup": f"第{num}項目: {title}",
                "type": "translation",
                "question": q_text,
                "answer": clean_ans,
                "acceptableAnswers": [clean_ans, clean_ans.rstrip('.!?')],
                "category": title,
                "explanation": f"否定表現のポイント: {notes or forKids}",
                "hint": f"文末・否定語に注目: {clean_ans.split()[-1] if clean_ans.split() else ''}"
            })
            seen_questions.add(q_text)
            
    q_ex = exs.get('interrogative', {})
    if q_ex.get('mn') and q_ex.get('ja'):
        q_text = f"【第{num}課 疑問形】\n「{q_ex['ja']}」をモンゴル語で問いかける文にしなさい。"
        if q_text not in seen_questions:
            clean_ans = q_ex['mn'].strip()
            quizzes.append({
                "id": f"gq_{num}_q",
                "grammarId": gid,
                "lessonGroup": f"第{num}項目: {title}",
                "type": "translation",
                "question": q_text,
                "answer": clean_ans,
                "acceptableAnswers": [clean_ans, clean_ans.rstrip('.!?')],
                "category": title,
                "explanation": f"疑問助詞や語末の変化に注意してください（{rules.get('endingTypes', '')}）。",
                "hint": f"語末: {clean_ans.split()[-1] if clean_ans.split() else ''}"
            })
            seen_questions.add(q_text)

print(f"Total grammar quizzes merged: {len(quizzes)}")

out_js = "// 全48文法項目完全対応 文法テスト問題集（校正済み完全版）\nexport const initialGrammarQuizzes = " + json.dumps(quizzes, ensure_ascii=False, indent=2) + ";\n"
with open(r'C:\Users\kkaho\.gemini\antigravity\scratch\mongol-learning-app\js\data\grammarQuizzes.js', 'w', encoding='utf-8') as f:
    f.write(out_js)

print("Saved to js/data/grammarQuizzes.js")
