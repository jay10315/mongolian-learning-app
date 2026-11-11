import json, re

with open('js/data/interviewTopics.js', 'r', encoding='utf-8') as f:
    text = f.read()

start = text.find('export const interviewTopics = [')
end = text.find('\nexport const interviewVocabulary = [')
topics_raw = text[start + len('export const interviewTopics = '):end].strip()
last_bracket = topics_raw.rfind(']')
topics = json.loads(topics_raw[:last_bracket+1])

pos = text.find('export const interviewVocabulary = [')
vocab_raw = text[pos + len('export const interviewVocabulary = '):].strip()
if vocab_raw.endswith(';'):
    vocab_raw = vocab_raw[:-1].strip()
vocab = json.loads(vocab_raw)

print(f"Total topics: {len(topics)}")
print(f"Total vocabulary words: {len(vocab)}")

# Verify all vocab exampleMn are authentic sentences in topics
all_topic_sentences = set()
for t in topics:
    for s in t['sentences']:
        all_topic_sentences.add(s['mn'].strip())

bad_examples = []
for v in vocab:
    ex = v.get('exampleMn', '').strip()
    if ex not in all_topic_sentences:
        bad_examples.append((v['id'], v['mongolian'], ex))

print(f"Vocab items with invalid/unmatched example sentences: {len(bad_examples)}")
if bad_examples:
    for be in bad_examples[:10]:
        print(" ", be)
else:
    print("PERFECT: Every single vocabulary item matches a canonical topic sentence 100%!")

# Check topic 7 sentences and subquestions
t7 = topics[6]
print(f"Topic 7 title: {t7['titleMn']}")
print(f"Topic 7 sentences count: {len(t7['sentences'])}")
print(f"Topic 7 subquestions count: {len(t7.get('subQuestions', []))}")
for idx, s in enumerate(t7['sentences'], 1):
    print(f"  {idx}: {s['mn'][:60]}")
