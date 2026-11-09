import sys, re
sys.stdout.reconfigure(encoding='utf-8')

with open('js/data/textbookClassificationData.js', 'r', encoding='utf-8') as f:
    text = f.read()

textbook_matches = re.findall(r'"status":\s*"textbook"', text)
later_matches = re.findall(r'"status":\s*"later"', text)
print("textbook count in file:", len(textbook_matches))
print("later count in file:", len(later_matches))
