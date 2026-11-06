import React, { useState } from 'react';
import { VocabularyItem, GrammarItem } from './types';

export const App: React.FC = () => {
  const [tab, setTab] = useState<'home' | 'word_test' | 'grammar_test' | 'declension' | 'flashcards' | 'review' | 'materials'>('home');

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-white font-bold text-xl shadow-md">
              М
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-800">Монгол хэл</h1>
              <p className="text-xs text-slate-500">モンゴル語学習ノート（React + TypeScript 版）</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm text-center space-y-4">
          <h2 className="text-2xl font-bold text-emerald-700">Монгол хэл｜モンゴル語学習ノート</h2>
          <p className="text-sm text-slate-600 leading-relaxed max-w-xl mx-auto">
            JICA海外協力隊モンゴル語教科書（第1課〜第18課）準拠の本格的なWebアプリです。<br />
            単独実行版（PWA・オフライン対応）は <code>index.html</code> または <code>start_app.bat</code> で即座に起動できます。
          </p>
          <div className="pt-2">
            <a href="./index.html" className="inline-block px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md transition-all">
              🚀 Webアプリを開く
            </a>
          </div>
        </div>
      </main>
    </div>
  );
};
