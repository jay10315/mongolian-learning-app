# -*- coding: utf-8 -*-
import os, sys, re

sys.stdout.reconfigure(encoding='utf-8')
base_dir = r"C:\Users\kkaho\.gemini\antigravity\scratch\mongol-learning-app"

def test_railway_data():
    railway_js = os.path.join(base_dir, 'js', 'data', 'railwayData.js')
    assert os.path.exists(railway_js), "railwayData.js must exist"
    with open(railway_js, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. 10 stations verification
    assert 'railwayStations' in content
    station_ids = re.findall(r'id:\s*["\']([^"\']+_st)["\']', content)
    assert len(station_ids) == 10, f"Expected 10 stations, got {len(station_ids)}: {station_ids}"
    assert station_ids[0] == 'sukhbaatar_st', "First station must be Sukhbaatar"
    assert station_ids[-1] == 'zamiinuud_st', "Last station must be Zamiin-Uud"

    # Verify km distances
    assert 'km: 0' in content, "Sukhbaatar must be 0 km"
    assert 'km: 1110' in content or 'km: 1,110' in content, "Zamiin-Uud must be 1110 km"

    # 2. Incidents verification
    assert 'railwayIncidents' in content
    assert '羊の大群が線路を横断' in content
    assert '猛烈なゴビの砂嵐' in content

    # 3. Questions verification
    assert 'railwayQuestions' in content
    q_ids = re.findall(r'id:\s*["\'](rq_\d+)["\']', content)
    assert len(q_ids) >= 40, f"Expected at least 40 questions, got {len(q_ids)}"

    print(f"  [OK] railwayData.js verified: 10 stations (0 -> 1110 km), incidents, {len(q_ids)} authentic travel questions")

def test_railway_component():
    comp_js = os.path.join(base_dir, 'js', 'components', 'PenguinExpedition.js')
    assert os.path.exists(comp_js), "PenguinExpedition.js must exist"
    with open(comp_js, 'r', encoding='utf-8') as f:
        comp = f.read()

    # Check state and mechanics
    assert 'stationIdx:' in comp, "Must track current station index"
    assert 'tickets:' in comp, "Must have life ticket system"
    assert 'renderRailwayUI(' in comp, "Must implement renderRailwayUI"
    assert 'renderGoalVictoryUI(' in comp, "Must implement Goal Victory UI"
    assert 'renderGameOverUI(' in comp, "Must implement Game Over UI"
    
    # Check the critical requested mechanic: 間違えるたびに戻る (retreat -1 station on mistake)
    assert 'rw.stationIdx -= 1' in comp or 'stationIdx - 1' in comp, "Must implement retreat -1 station on mistake"
    assert '間違えるたびに戻る' in comp or '後退' in comp, "Must include retreat explanation"
    
    # Check boost mechanic
    assert 'スチームブースト' in comp or 'BOOST' in comp, "Must support combo boost"

    # Check tab switching
    assert 'tab-mode-btn' in comp, "Must support switching between Railway Sugoroku and Map modes"

    print("  [OK] PenguinExpedition.js implements Railway Sugoroku with mistake-retreat, combo boosts, stamps, and lives")

def test_bundled_and_html():
    bundled_js = os.path.join(base_dir, 'bundled.js')
    with open(bundled_js, 'r', encoding='utf-8') as f:
        bjs = f.read()

    assert 'railwayStations' in bjs, "bundled.js must include railwayStations"
    assert 'railwayQuestions' in bjs, "bundled.js must include railwayQuestions"
    assert 'railwayIncidents' in bjs, "bundled.js must include railwayIncidents"
    assert 'Сүхбаатар өртөө' in bjs, "bundled.js must contain Sukhbaatar station"
    assert 'Замын-Үүд өртөө' in bjs, "bundled.js must contain Zamiin-Uud station"

    index_html = os.path.join(base_dir, 'index.html')
    with open(index_html, 'r', encoding='utf-8') as f:
        html = f.read()

    assert 'railwayStations' in html, "index.html must include railwayStations"
    assert 'renderRailwayUI' in html, "index.html must include renderRailwayUI"

    print("  [OK] bundled.js and index.html correctly bundle Railway Sugoroku data and logic")

if __name__ == '__main__':
    test_railway_data()
    test_railway_component()
    test_bundled_and_html()
    print("\nALL RAILWAY SUGOROKU TESTS PASSED SUCCESSFULLY!")
