import os
import re

base_dir = os.path.dirname(os.path.abspath(__file__))

def check_dir(sub_dir):
    full_dir = os.path.join(base_dir, sub_dir)
    if not os.path.exists(full_dir):
        return
    for fname in os.listdir(full_dir):
        if fname.endswith('.js'):
            fpath = os.path.join(full_dir, fname)
            content = open(fpath, encoding='utf-8').read()
            imports = re.findall(r'import\s+\{([^}]+)\}\s+from\s+[\'"]([^\'"]+)[\'"]', content)
            for imps, src in imports:
                for item in [x.strip() for x in imps.split(',')]:
                    if item:
                        # normalize target path
                        target = os.path.normpath(os.path.join(full_dir, src))
                        if not os.path.exists(target):
                            print(f"[MISSING FILE] {fname}: cannot find {src}")
                            continue
                        target_code = open(target, encoding='utf-8').read()
                        # check export
                        pattern = r'\b(export\s+(const|let|var|class|function)\s+' + re.escape(item) + r'\b|export\s*\{[^}]*\b' + re.escape(item) + r'\b)'
                        if not re.search(pattern, target_code):
                            print(f"[MISSING EXPORT] in {sub_dir}/{fname}: '{item}' from {src}")

check_dir('js/components')
check_dir('js/services')
check_dir('js/utils')
check_dir('js/data')
print("Import check finished.")
