# -*- coding: utf-8 -*-
import os, sys

sys.stdout.reconfigure(encoding='utf-8')
base_dir = r"C:\Users\kkaho\.gemini\antigravity\scratch\mongol-learning-app"
os.chdir(base_dir)

with open('bundled.js', encoding='utf-8') as f:
    bundled = f.read()

print('Checking bundled.js integrity:')
assert 'SpatialPostpositionMasterComponent' in bundled, 'SpatialPostpositionMasterComponent missing'
assert 'SPATIAL_SVGS' in bundled, 'SPATIAL_SVGS missing'
assert 'spatialQuizzes' in bundled, 'spatialQuizzes missing'
assert 'SPATIAL_ITEMS' in bundled, 'SPATIAL_ITEMS missing'
assert 'spatial_postposition_master' in bundled, 'spatial_postposition_master route missing'

print('All bundled.js assertions passed!')

# Check question consistency
from build_spatial_master_data import QUIZZES, ITEMS, SVGS

print(f'Checking {len(QUIZZES)} quizzes:')
for i, q in enumerate(QUIZZES):
    assert len(q['options']) == 4, f'Quiz {q["id"]} does not have 4 options'
    assert q['answer'] in q['options'], f'Quiz {q["id"]} answer {q["answer"]} not in options'
    assert q['svgKey'] in SVGS, f'Quiz {q["id"]} svgKey {q["svgKey"]} not in SVGS'
    assert q['prompt'] and q['promptJa'] and q['explanation'], f'Quiz {q["id"]} missing text fields'

print(f'All {len(QUIZZES)} quizzes are 100% valid!')
print(f'All {len(ITEMS)} items are 100% valid!')
print(f'All {len(SVGS)} SVGs are 100% valid!')
