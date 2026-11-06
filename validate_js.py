import sys, os

def check_js_syntax(code, filename=""):
    i = 0
    n = len(code)
    line = 1
    col = 1
    
    stack = [] # (char, line, col)
    # states: 'NORMAL', 'SINGLE_STRING', 'DOUBLE_STRING', 'TEMPLATE_STRING', 'LINE_COMMENT', 'BLOCK_COMMENT'
    # For template literals, we also need a template stack to know when we are inside ${ ... }
    # template_stack: list of int (brace depth inside ${...})
    template_brace_stack = []
    
    state = 'NORMAL'
    
    while i < n:
        c = code[i]
        
        # update line / col
        if c == '\n':
            line += 1
            col = 1
        else:
            col += 1
            
        if state == 'LINE_COMMENT':
            if c == '\n':
                state = 'NORMAL'
            i += 1
            continue
            
        if state == 'BLOCK_COMMENT':
            if c == '*' and i + 1 < n and code[i+1] == '/':
                state = 'NORMAL'
                i += 2
                col += 1
                continue
            i += 1
            continue
            
        if state == 'SINGLE_STRING':
            if c == '\\':
                i += 2
                col += 1
                continue
            if c == '\'':
                state = 'NORMAL'
            i += 1
            continue
            
        if state == 'DOUBLE_STRING':
            if c == '\\':
                i += 2
                col += 1
                continue
            if c == '"':
                state = 'NORMAL'
            i += 1
            continue
            
        if state == 'TEMPLATE_STRING':
            if c == '\\':
                i += 2
                col += 1
                continue
            if c == '`':
                state = 'NORMAL'
                i += 1
                continue
            if c == '$' and i + 1 < n and code[i+1] == '{':
                # entering expression inside template string
                stack.append(('${', line, col))
                template_brace_stack.append(1)
                state = 'NORMAL'
                i += 2
                col += 1
                continue
            i += 1
            continue
            
        if state == 'NORMAL':
            # Check comment
            if c == '/' and i + 1 < n and code[i+1] == '/':
                state = 'LINE_COMMENT'
                i += 2
                col += 1
                continue
            if c == '/' and i + 1 < n and code[i+1] == '*':
                state = 'BLOCK_COMMENT'
                i += 2
                col += 1
                continue
            # Check strings
            if c == '\'':
                state = 'SINGLE_STRING'
                i += 1
                continue
            if c == '"':
                state = 'DOUBLE_STRING'
                i += 1
                continue
            if c == '`':
                state = 'TEMPLATE_STRING'
                i += 1
                continue
            # Check brackets
            if c in '([{':
                stack.append((c, line, col))
                if template_brace_stack and c == '{':
                    template_brace_stack[-1] += 1
                i += 1
                continue
            if c in ')]}':
                if not stack:
                    print(f"[{filename}] ERROR at line {line}, col {col}: Unexpected closing '{c}' with empty stack!")
                    return False
                top, tline, tcol = stack[-1]
                expected = {')': '(', ']': '[', '}': '{'}
                if top == '${' and c == '}':
                    stack.pop()
                    template_brace_stack.pop()
                    state = 'TEMPLATE_STRING'
                    i += 1
                    continue
                if top != expected[c]:
                    print(f"[{filename}] ERROR at line {line}, col {col}: Mismatched '{c}', expected matching for '{top}' from line {tline}, col {tcol}")
                    return False
                stack.pop()
                if template_brace_stack and c == '}':
                    template_brace_stack[-1] -= 1
                i += 1
                continue
            i += 1
            
    if state != 'NORMAL':
        print(f"[{filename}] ERROR: File ended in state {state}")
        return False
        
    if stack:
        top, tline, tcol = stack[-1]
        print(f"[{filename}] ERROR: Unclosed '{top}' from line {tline}, col {tcol} (stack size: {len(stack)})")
        return False
        
    print(f"[{filename}] SUCCESS: All brackets and string templates matched cleanly!")
    return True

base_dir = r"C:\Users\kkaho\.gemini\antigravity\scratch\mongol-learning-app"
files = [
    'js/utils/helpers.js',
    'js/data/initialVocabulary.js',
    'js/data/initialGrammar.js',
    'js/data/grammarQuizzes.js',
    'js/data/declensionQuizzes.js',
    'js/services/storage.js',
    'js/services/speech.js',
    'js/services/parser.js',
    'js/components/CyrillicKeyboard.js',
    'js/components/Navbar.js',
    'js/components/Home.js',
    'js/components/WordTest.js',
    'js/components/GrammarTest.js',
    'js/components/DeclensionTest.js',
    'js/components/Flashcards.js',
    'js/components/ReviewNotebook.js',
    'js/components/MaterialManager.js',
    'js/components/ReferenceGuide.js',
    'js/app.js'
]

all_ok = True
for f in files:
    p = os.path.join(base_dir, f.replace('/', os.sep))
    with open(p, 'r', encoding='utf-8') as fh:
        code = fh.read()
    if not check_js_syntax(code, f):
        all_ok = False

# Also check index.html's script
with open(os.path.join(base_dir, 'index.html'), 'r', encoding='utf-8') as fh:
    content = fh.read()
import re
scripts = re.findall(r'<script.*?>([\s\S]*?)</script>', content)
if len(scripts) >= 3:
    print("\n--- Checking index.html embedded script ---")
    if not check_js_syntax(scripts[2], "index.html (script 2)"):
        all_ok = False

if all_ok:
    print("\n>>> ALL JS FILES PASSED SYNTAX CHECK! <<<")
