def test_reorder_flicker_fix():
    with open('js/components/GrammarTest.js', 'r', encoding='utf-8') as f:
        gt_js = f.read()

    with open('index.html', 'r', encoding='utf-8') as f:
        index_html = f.read()

    # 1. GrammarTest.js
    assert 'static updateReorderUI()' in gt_js, "GrammarTest must define updateReorderUI"
    assert 'static bindReorderTokenEvents()' in gt_js, "GrammarTest must define bindReorderTokenEvents"
    assert 'id="reorder-available-tokens"' in gt_js, "GrammarTest must have reorder-available-tokens ID"
    assert 'this.updateReorderUI()' in gt_js, "GrammarTest must call updateReorderUI on token tap"
    
    # Ensure add/remove token click handlers do NOT call this.renderTesting()
    # Find bindReorderTokenEvents block
    idx_start = gt_js.find('static bindReorderTokenEvents()')
    idx_end = gt_js.find('static bindTestingEvents()')
    reorder_events_block = gt_js[idx_start:idx_end]
    assert 'this.renderTesting()' not in reorder_events_block, "Reorder token events must NOT re-render the whole page"

    # 2. index.html
    assert 'static updateReorderUI()' in index_html, "index.html must bundle updateReorderUI"
    assert 'id="reorder-available-tokens"' in index_html, "index.html must bundle reorder-available-tokens"

    print("test_reorder_flicker_fix: ALL CHECKS PASSED!")

if __name__ == '__main__':
    test_reorder_flicker_fix()
