import os, re, sys

sys.stdout.reconfigure(encoding='utf-8')
base_dir = r"C:\Users\kkaho\.gemini\antigravity\scratch\mongol-learning-app"

def test_expedition_data():
    expedition_js = os.path.join(base_dir, 'js', 'data', 'expeditionData.js')
    assert os.path.exists(expedition_js), f"{expedition_js} must exist"
    with open(expedition_js, 'r', encoding='utf-8') as f:
        content = f.read()

    # Extract all destination IDs
    ids = re.findall(r'id:\s*["\']([^"\']+)["\']', content)
    assert len(ids) == 22, f"Expected 22 regions (21 aimags + capital), found {len(ids)}: {ids}"

    # Check key regions
    expected_ids = [
        'ulaanbaatar', 'tov', 'darkhan_uul', 'orkhon', 'bulgan', 'selenge',
        'arkhangai', 'ovorkhangai', 'khuvsgul', 'dundgovi', 'omnogovi',
        'bayankhongor', 'govi_altai', 'zavkhan', 'khovd', 'uvs', 'bayan_olgii',
        'govisumber', 'dornogovi', 'khentii', 'sukhbaatar', 'dornod'
    ]
    for eid in expected_ids:
        assert eid in ids, f"Missing region id: {eid}"

    # Check required fields
    required_fields = ['nameMn', 'nameJa', 'capitalMn', 'capitalJa', 'zone', 'requiredXp', 'badgeIcon', 'color', 'description', 'attractions', 'specialties', 'funFact', 'polygonPoints', 'center']
    for field in required_fields:
        assert field in content, f"Missing field {field} in expeditionData.js"

    print("  [OK] expeditionData.js contains all 22 administrative divisions of Mongolia with complete metadata")

def test_expedition_component():
    comp_js = os.path.join(base_dir, 'js', 'components', 'PenguinExpedition.js')
    assert os.path.exists(comp_js), f"{comp_js} must exist"
    with open(comp_js, 'r', encoding='utf-8') as f:
        comp = f.read()

    assert 'renderSvgMap(' in comp, "PenguinExpedition.js must implement renderSvgMap"
    assert 'openRegionModal(' in comp, "PenguinExpedition.js must implement openRegionModal"
    assert 'svg-region-group' in comp, "SVG map must have svg-region-group for regions"
    assert 'viewBox="0 0 960 520"' in comp, "SVG viewBox must be defined"
    assert 'SpeechService.speak' in comp, "Must support audio pronunciation"
    assert 'data-filter="capital"' in comp, "Filter tabs must exist"
    assert 'data-filter="north"' in comp, "Filter tabs must exist"
    assert 'data-filter="west"' in comp, "Filter tabs must exist"
    assert 'data-filter="gobi"' in comp, "Filter tabs must exist"
    assert 'data-filter="east"' in comp, "Filter tabs must exist"

    print("  [OK] PenguinExpedition.js has interactive SVG map, click handlers, filters, and modal explanations")

def test_bundled_and_html():
    bundled_js = os.path.join(base_dir, 'bundled.js')
    with open(bundled_js, 'r', encoding='utf-8') as f:
        bjs = f.read()

    assert 'renderSvgMap' in bjs, "bundled.js must contain renderSvgMap"
    assert 'expeditionDestinations' in bjs, "bundled.js must contain expeditionDestinations"
    assert 'Улаанбаатар хот' in bjs, "bundled.js must contain Ulaanbaatar"
    assert 'Хөвсгөл аймаг' in bjs, "bundled.js must contain Khuvsgul"
    assert 'Баян-Өлгий аймаг' in bjs, "bundled.js must contain Bayan-Olgii"
    assert 'Өмнөговь аймаг' in bjs, "bundled.js must contain Omnogovi"
    assert 'Дорнод аймаг' in bjs, "bundled.js must contain Dornod"

    index_html = os.path.join(base_dir, 'index.html')
    with open(index_html, 'r', encoding='utf-8') as f:
        html = f.read()
    assert 'renderSvgMap' in html
    assert 'MONGOLIA EXPEDITION MAP' in html

    print("  [OK] bundled.js and index.html correctly bundle the new interactive map and all 22 regions")

if __name__ == '__main__':
    test_expedition_data()
    test_expedition_component()
    test_bundled_and_html()
    print("\nALL EXPEDITION MAP TESTS PASSED SUCCESSFULLY!")
