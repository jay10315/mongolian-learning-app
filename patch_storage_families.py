import sys, os
sys.stdout.reconfigure(encoding='utf-8')

storage_path = 'js/services/storage.js'
with open(storage_path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add import at top
import_stmt = "import { WORD_FAMILIES_DATA } from '../data/wordFamiliesData.js';\n"
if "import { WORD_FAMILIES_DATA }" not in content:
    content = import_stmt + content

# 2. Add family methods inside StorageService class
family_methods = """
  // =========================================================================
  // 単語ファミリー完全習得・活用形マスター機能 (Word Family Mastery System)
  // =========================================================================

  /**
   * 単語ファミリーの進捗データ（各語形の学習回数・正解数・完全習得状態）を取得
   */
  static getWordFamilyProgress() {
    try {
      const data = localStorage.getItem('mongol_app_word_family_progress_v1');
      return data ? JSON.parse(data) : {};
    } catch (_) {
      return {};
    }
  }

  static saveWordFamilyProgress(progress) {
    this.setItem('mongol_app_word_family_progress_v1', progress || {});
  }

  /**
   * 単語ファミリー全体を一括追加したID一覧を取得
   */
  static getAddedFamilyIds() {
    try {
      const data = localStorage.getItem('mongol_app_added_family_ids_v1');
      return data ? JSON.parse(data) : [];
    } catch (_) {
      return [];
    }
  }

  /**
   * 個別に学習対象へ追加した語形ID一覧を取得
   */
  static getAddedFamilyFormIds() {
    try {
      const data = localStorage.getItem('mongol_app_added_family_form_ids_v1');
      return data ? JSON.parse(data) : [];
    } catch (_) {
      return [];
    }
  }

  static addFamilyToLearning(familyId) {
    if (!familyId) return false;
    const list = this.getAddedFamilyIds();
    if (!list.includes(familyId)) {
      list.push(familyId);
      this.setItem('mongol_app_added_family_ids_v1', list);
      return true;
    }
    return false;
  }

  static removeFamilyFromLearning(familyId) {
    if (!familyId) return false;
    let list = this.getAddedFamilyIds();
    if (list.includes(familyId)) {
      list = list.filter(id => id !== familyId);
      this.setItem('mongol_app_added_family_ids_v1', list);
      return true;
    }
    return false;
  }

  static isFamilyAdded(familyId) {
    const list = this.getAddedFamilyIds();
    return list.includes(familyId);
  }

  static addFormToLearning(formId) {
    if (!formId) return false;
    const list = this.getAddedFamilyFormIds();
    if (!list.includes(formId)) {
      list.push(formId);
      this.setItem('mongol_app_added_family_form_ids_v1', list);
      return true;
    }
    return false;
  }

  static removeFormFromLearning(formId) {
    if (!formId) return false;
    let list = this.getAddedFamilyFormIds();
    if (list.includes(formId)) {
      list = list.filter(id => id !== formId);
      this.setItem('mongol_app_added_family_form_ids_v1', list);
      return true;
    }
    return false;
  }

  static isFormAdded(formId) {
    const list = this.getAddedFamilyFormIds();
    return list.includes(formId);
  }

  /**
   * 単語ファミリーテストの回答結果を記録し、習熟度を更新
   */
  static recordFamilyQuizResult(familyId, formId, isCorrect) {
    if (!formId) return;
    const progress = this.getWordFamilyProgress();
    const cur = progress[formId] || {
      studyCount: 0,
      correctCount: 0,
      wrongCount: 0,
      accuracy: 0,
      mastered: false,
      lastLearnedAt: null
    };

    cur.studyCount = (cur.studyCount || 0) + 1;
    if (isCorrect) {
      cur.correctCount = (cur.correctCount || 0) + 1;
    } else {
      cur.wrongCount = (cur.wrongCount || 0) + 1;
    }
    cur.accuracy = Math.round((cur.correctCount / cur.studyCount) * 100);
    cur.lastLearnedAt = new Date().toISOString();

    // 習得基準: 2回以上正解 かつ 正解率80%以上
    cur.mastered = (cur.correctCount >= 2 && cur.accuracy >= 80);

    progress[formId] = cur;
    this.saveWordFamilyProgress(progress);
    return cur;
  }

  /**
   * 特定ファミリーの完全習得ステータスと各語形進捗を計算
   */
  static getFamilyMasteryStatus(familyId) {
    const family = (typeof WORD_FAMILIES_DATA !== 'undefined' ? WORD_FAMILIES_DATA : []).find(f => f.familyId === familyId);
    if (!family) return { mastered: false, progressPercent: 0, masteredCount: 0, totalCount: 0 };

    const progress = this.getWordFamilyProgress();
    const coreForms = family.forms.filter(f => f.isCore !== false);
    const totalCore = coreForms.length;
    let masteredCore = 0;

    family.forms.forEach(form => {
      const p = progress[form.formId];
      if (p && p.mastered && form.isCore !== false) {
        masteredCore += 1;
      }
    });

    const isMastered = totalCore > 0 && masteredCore === totalCore;
    const progressPercent = totalCore > 0 ? Math.round((masteredCore / totalCore) * 100) : 0;

    return {
      mastered: isMastered,
      progressPercent,
      masteredCount: masteredCore,
      totalCount: totalCore
    };
  }

  /**
   * 全単語ファミリー（習熟度と追加状態をマージした完全オブジェクト）を取得
   */
  static getAllWordFamilies() {
    const rawFamilies = (typeof WORD_FAMILIES_DATA !== 'undefined' ? WORD_FAMILIES_DATA : []);
    const progress = this.getWordFamilyProgress();
    const addedFamilyIds = this.getAddedFamilyIds();
    const addedFormIds = this.getAddedFamilyFormIds();

    return rawFamilies.map(fam => {
      const mastery = this.getFamilyMasteryStatus(fam.familyId);
      const isFamilyAdded = addedFamilyIds.includes(fam.familyId);

      const enrichedForms = fam.forms.map(form => {
        const formProg = progress[form.formId] || {
          studyCount: 0,
          correctCount: 0,
          wrongCount: 0,
          accuracy: 0,
          mastered: false,
          lastLearnedAt: null
        };
        const isFormAdded = addedFormIds.includes(form.formId) || isFamilyAdded;

        return {
          ...form,
          progress: formProg,
          isAdded: isFormAdded
        };
      });

      return {
        ...fam,
        mastered: mastery.mastered,
        masteryPercent: mastery.progressPercent,
        masteredCoreCount: mastery.masteredCount,
        totalCoreCount: mastery.totalCount,
        isAdded: isFamilyAdded,
        forms: enrichedForms
      };
    });
  }

  /**
   * 単語ファミリー全体の集計サマリー（ダッシュボード用）を取得
   */
  static getWordFamilySummary() {
    const families = this.getAllWordFamilies();
    const totalFamilies = families.length;
    const masteredFamilies = families.filter(f => f.mastered).length;

    let totalForms = 0;
    let masteredForms = 0;
    let studiedForms = 0;

    families.forEach(f => {
      f.forms.forEach(form => {
        totalForms += 1;
        if (form.progress && form.progress.mastered) masteredForms += 1;
        if (form.progress && form.progress.studyCount > 0) studiedForms += 1;
      });
    });

    return {
      totalFamilies,
      masteredFamilies,
      totalForms,
      masteredForms,
      studiedForms,
      overallMasteryPercent: totalForms > 0 ? Math.round((masteredForms / totalForms) * 100) : 0
    };
  }
"""

# Insert before closing class brace
insert_marker = "  // --- 汎用 Key-Value ストレージアクセサ"
if insert_marker in content and "getWordFamilyProgress" not in content:
    idx = content.find(insert_marker)
    content = content[:idx] + family_methods + "\n" + content[idx:]
    with open(storage_path, 'w', encoding='utf-8') as f:
        f.write(content)
    # Also write to dist/
    with open('dist/' + storage_path, 'w', encoding='utf-8') as f:
        f.write(content)
    print("Successfully patched storage.js with Word Family Mastery System!")
else:
    print("Marker not found or already patched!")
