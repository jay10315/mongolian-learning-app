import sys

def parse_js(code):
    n = len(code)
    i = 0
    line = 1
    col = 1
    
    stack = []
    can_be_regex = True
    
    while i < n:
        c = code[i]
        
        # Newlines
        if c == '\n':
            line += 1
            col = 1
            i += 1
            continue
            
        # Whitespace
        if c in ' \t\r':
            col += 1
            i += 1
            continue
            
        # Comments
        if c == '/' and i + 1 < n and code[i+1] == '/':
            i += 2
            col += 2
            while i < n and code[i] != '\n':
                i += 1
                col += 1
            continue
            
        if c == '/' and i + 1 < n and code[i+1] == '*':
            start_l, start_c = line, col
            i += 2
            col += 2
            closed = False
            while i + 1 < n:
                if code[i] == '\n':
                    line += 1
                    col = 1
                else:
                    col += 1
                if code[i] == '*' and code[i+1] == '/':
                    i += 2
                    col += 1
                    closed = True
                    break
                i += 1
            if not closed:
                print(f"ERROR: Unclosed block comment starting at line {start_l}, col {start_c}")
                return False
            continue
            
        # Strings: single quote
        if c == "'":
            start_l, start_c = line, col
            i += 1
            col += 1
            closed = False
            while i < n:
                ch = code[i]
                if ch == '\n':
                    print(f"ERROR: Unescaped newline in single-quote string at line {line}, col {col} (started at line {start_l})")
                    return False
                if ch == '\\':
                    i += 2
                    col += 2
                    continue
                if ch == "'":
                    i += 1
                    col += 1
                    closed = True
                    break
                i += 1
                col += 1
            if not closed:
                print(f"ERROR: Unclosed single-quote string at line {start_l}, col {start_c}")
                return False
            can_be_regex = False
            continue
            
        # Strings: double quote
        if c == '"':
            start_l, start_c = line, col
            i += 1
            col += 1
            closed = False
            while i < n:
                ch = code[i]
                if ch == '\n':
                    print(f"ERROR: Unescaped newline in double-quote string at line {line}, col {col} (started at line {start_l})")
                    return False
                if ch == '\\':
                    i += 2
                    col += 2
                    continue
                if ch == '"':
                    i += 1
                    col += 1
                    closed = True
                    break
                i += 1
                col += 1
            if not closed:
                print(f"ERROR: Unclosed double-quote string at line {start_l}, col {start_c}")
                return False
            can_be_regex = False
            continue
            
        # Template literal: `...`
        if c == '`':
            start_l, start_c = line, col
            i += 1
            col += 1
            while i < n:
                ch = code[i]
                if ch == '\n':
                    line += 1
                    col = 1
                    i += 1
                    continue
                if ch == '\\':
                    i += 2
                    col += 2
                    continue
                if ch == '`':
                    i += 1
                    col += 1
                    can_be_regex = False
                    break
                if ch == '$' and i + 1 < n and code[i+1] == '{':
                    stack.append(('${', line, col))
                    i += 2
                    col += 2
                    can_be_regex = True
                    break
                i += 1
                col += 1
            else:
                print(f"ERROR: Unclosed template literal starting at line {start_l}, col {start_c}")
                return False
            continue
            
        # Regex literal
        if c == '/' and can_be_regex:
            start_l, start_c = line, col
            i += 1
            col += 1
            in_char_class = False
            closed = False
            while i < n:
                ch = code[i]
                if ch == '\n':
                    print(f"ERROR: Unescaped newline in regex literal starting at line {start_l}, col {start_c}")
                    return False
                if ch == '\\':
                    i += 2
                    col += 2
                    continue
                if ch == '[':
                    in_char_class = True
                elif ch == ']':
                    in_char_class = False
                elif ch == '/' and not in_char_class:
                    i += 1
                    col += 1
                    while i < n and code[i].isalpha():
                        i += 1
                        col += 1
                    closed = True
                    break
                i += 1
                col += 1
            if not closed:
                print(f"ERROR: Unclosed regex literal starting at line {start_l}, col {start_c}")
                return False
            can_be_regex = False
            continue
            
        # Delimiters
        if c in '([{':
            stack.append((c, line, col))
            can_be_regex = True
            i += 1
            col += 1
            continue
            
        if c in ')]}':
            if not stack:
                print(f"ERROR: Unexpected closing '{c}' at line {line}, col {col} with empty stack!")
                return False
            top, tl, tc = stack[-1]
            if top == '${' and c == '}':
                stack.pop()
                start_l, start_c = line, col
                i += 1
                col += 1
                while i < n:
                    ch = code[i]
                    if ch == '\n':
                        line += 1
                        col = 1
                        i += 1
                        continue
                    if ch == '\\':
                        i += 2
                        col += 2
                        continue
                    if ch == '`':
                        i += 1
                        col += 1
                        can_be_regex = False
                        break
                    if ch == '$' and i + 1 < n and code[i+1] == '{':
                        stack.append(('${', line, col))
                        i += 2
                        col += 2
                        can_be_regex = True
                        break
                    i += 1
                    col += 1
                else:
                    print(f"ERROR: Unclosed template literal continuation at line {start_l}, col {start_c}")
                    return False
                continue
                
            expected = {')': '(', ']': '[', '}': '{'}
            if top != expected[c]:
                print(f"ERROR at line {line}, col {col}: Mismatched '{c}', expected matching for '{top}' from line {tl}, col {tc}")
                return False
            stack.pop()
            can_be_regex = False
            i += 1
            col += 1
            continue
            
        if c in ';,':
            can_be_regex = True
            i += 1
            col += 1
            continue
            
        if c in '+-*%=&|^!~?:<>':
            can_be_regex = True
            i += 1
            col += 1
            continue
            
        # Word
        if code[i].isalnum() or code[i] in '$_':
            start_i = i
            while i < n and (code[i].isalnum() or code[i] in '$_'):
                i += 1
                col += 1
            word = code[start_i:i]
            if word in ('return', 'case', 'delete', 'throw', 'void', 'typeof', 'instanceof', 'new', 'in', 'of', 'yield', 'await'):
                can_be_regex = True
            else:
                can_be_regex = False
            continue
            
        # Any other character (e.g. '.', '@', Unicode)
        i += 1
        col += 1
        can_be_regex = False
            
    if stack:
        top, tl, tc = stack[-1]
        print(f"ERROR: Unclosed delimiter '{top}' from line {tl}, col {tc} (total unclosed: {len(stack)})")
        return False
        
    print(f"SUCCESS: {line} lines parsed cleanly with NO delimiter or string errors!")
    return True

with open(r'C:\Users\kkaho\.gemini\antigravity\scratch\mongol-learning-app\bundled.js', 'r', encoding='utf-8') as f:
    code = f.read()

parse_js(code)
