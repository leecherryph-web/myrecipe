import React, { useState } from 'react';
import {
  X,
  Upload,
  FileCode,
  FileText,
  Check,
  AlertCircle,
  Plus,
  BookOpen,
  HelpCircle,
  Copy,
} from 'lucide-react';
import { Recipe, IngredientItem, RecipeStep } from '../types';

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportRecipes: (importedRecipes: Recipe[]) => void;
  existingRecipes: Recipe[];
}

export const ImportModal: React.FC<ImportModalProps> = ({
  isOpen,
  onClose,
  onImportRecipes,
  existingRecipes,
}) => {
  const [importMode, setImportMode] = useState<'paste' | 'file'>('paste');
  const [rawText, setRawText] = useState('');
  const [parsedPreview, setParsedPreview] = useState<Recipe[] | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  // Helper to parse steps
  const parseStepsText = (stepsInput: any): RecipeStep[] => {
    if (Array.isArray(stepsInput)) {
      return stepsInput.map((s, idx) => {
        if (typeof s === 'string') {
          const minMatch = s.match(/(\d+)(?:[–~-](\d+))?\s*(?:分鐘|mins?|min)/i);
          return {
            id: `step-${idx + 1}-${Math.random().toString(36).substr(2, 5)}`,
            stepNumber: idx + 1,
            instruction: s.trim(),
            timerMinutes: minMatch ? parseInt(minMatch[2] || minMatch[1], 10) : undefined,
          };
        }
        return {
          id: s.id || `step-${idx + 1}-${Math.random().toString(36).substr(2, 5)}`,
          stepNumber: s.stepNumber || idx + 1,
          instruction: s.instruction || s.content || s.text || '',
          timerMinutes: s.timerMinutes || s.timer || undefined,
        };
      });
    }

    if (typeof stepsInput === 'string') {
      const regex = /(?:^|\n+)(?:Step\s*\d+[:：\s]*|\bStep\s*\d+\b|\d+[\.、]\s*)/gi;
      const parts = stepsInput.split(regex).map((p) => p.trim()).filter(Boolean);
      const list = parts.length > 1 ? parts : stepsInput.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);

      return (list.length > 0 ? list : [stepsInput.trim()]).map((part, idx) => {
        const minMatch = part.match(/(\d+)(?:[–~-](\d+))?\s*(?:分鐘|mins?|min)/i);
        return {
          id: `step-${idx + 1}-${Math.random().toString(36).substr(2, 5)}`,
          stepNumber: idx + 1,
          instruction: part,
          timerMinutes: minMatch ? parseInt(minMatch[2] || minMatch[1], 10) : undefined,
        };
      });
    }

    return [];
  };

  // Helper to parse ingredients
  const parseIngredients = (ingInput: any): IngredientItem[] => {
    if (Array.isArray(ingInput)) {
      return ingInput.map((i, idx) => {
        if (typeof i === 'string') {
          // Clean bullet points
          const cleaned = i.replace(/^[-*•+]\s*/, '').trim();
          const match = cleaned.match(/^([^\d+]+)([\d./–~-]+)?\s*([a-zA-Z\u4e00-\u9fa5]+)?$/);
          if (match) {
            return {
              id: `ing-${idx}-${Math.random().toString(36).substr(2, 5)}`,
              name: match[1]?.trim() || cleaned,
              amount: match[2]?.trim() || '',
              unit: match[3]?.trim() || '',
            };
          }
          return {
            id: `ing-${idx}-${Math.random().toString(36).substr(2, 5)}`,
            name: cleaned,
            amount: '',
            unit: '',
          };
        }
        return {
          id: i.id || `ing-${idx}-${Math.random().toString(36).substr(2, 5)}`,
          name: i.name || i.title || '',
          amount: String(i.amount ?? i.quantity ?? ''),
          unit: i.unit || '',
        };
      });
    }

    if (typeof ingInput === 'string') {
      return ingInput
        .split(/[\n,，]+/)
        .map((l) => l.replace(/^[-*•+]\s*/, '').trim())
        .filter(Boolean)
        .map((line, idx) => ({
          id: `ing-${idx}-${Math.random().toString(36).substr(2, 5)}`,
          name: line,
          amount: '',
          unit: '',
        }));
    }

    return [];
  };

  // Dedicated Markdown Parser (Supports multiple `# Recipe Title` blocks in one .md file)
  const parseMarkdownRecipes = (mdText: string): Recipe[] => {
    // Split by top-level headers (# Recipe Title)
    const blocks = mdText.split(/\n(?=# )|^# /m).filter((b) => b.trim().length > 0);
    const recipes: Recipe[] = [];

    for (let i = 0; i < blocks.length; i++) {
      let block = blocks[i].trim();
      if (!block.startsWith('#')) {
        block = '# ' + block;
      }

      const lines = block.split('\n');
      const titleLine = lines[0] || '';
      const title = titleLine.replace(/^#+\s*/, '').trim();
      if (!title) continue;

      let servings = 1;
      let notes = '';
      let ingredientsRaw: string[] = [];
      let directionsRaw: string[] = [];

      let currentSection: 'meta' | 'ingredients' | 'directions' = 'meta';

      for (let j = 1; j < lines.length; j++) {
        const line = lines[j].trim();
        if (!line) continue;

        if (line.match(/^##+\s*(Ingredients|材料|食材|配料)/i)) {
          currentSection = 'ingredients';
          continue;
        } else if (line.match(/^##+\s*(Directions|Instructions|Steps|做法|步驟|制作步骤|製作步驟)/i)) {
          currentSection = 'directions';
          continue;
        } else if (line.match(/^##+\s*(Notes|Tips|筆記|私房筆記|小貼士)/i)) {
          currentSection = 'meta';
          continue;
        }

        const servingsMatch = line.match(/\*\*Servings:\*\*\s*(\d+)/i) || line.match(/Servings[:\s]*(\d+)/i) || line.match(/份量[:\s]*(\d+)/i);
        if (servingsMatch) {
          servings = parseInt(servingsMatch[1], 10) || 1;
          continue;
        }

        if (currentSection === 'meta') {
          notes += (notes ? '\n' : '') + line;
        } else if (currentSection === 'ingredients') {
          ingredientsRaw.push(line);
        } else if (currentSection === 'directions') {
          directionsRaw.push(line);
        }
      }

      const ingredients = parseIngredients(ingredientsRaw);
      const steps = parseStepsText(directionsRaw);

      recipes.push({
        id: `imported-md-${Date.now()}-${i}-${Math.random().toString(36).substr(2, 4)}`,
        title,
        description: notes || `${title}手作烘焙食譜`,
        category: '蛋糕',
        tags: ['Markdown 匯入', title.includes('戚風') ? '戚風' : title.includes('芝士') || title.includes('起司') ? '芝士蛋糕' : '手作烘焙'],
        servings,
        prepTime: 25,
        cookTime: 45,
        difficulty: '中等',
        coverImage: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=800',
        ingredients,
        steps,
        notes: notes || undefined,
        privateNotes: notes || undefined,
        rating: 5,
        source: 'Recipe Notes Markdown',
        isFavorite: true,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
    }

    return recipes;
  };

  // Universal parser for JSON / Markdown / Raw text
  const handleParseContent = (text: string) => {
    setErrorMessage(null);
    setSuccessMessage(null);
    const trimmed = text.trim();
    if (!trimmed) {
      setErrorMessage('請先貼上內容或選擇檔案');
      return;
    }

    try {
      // 1. Try parsing JSON
      let data: any = null;
      try {
        data = JSON.parse(trimmed);
      } catch {
        // Not direct JSON
      }

      if (data) {
        const recipeList: any[] = Array.isArray(data)
          ? data
          : data.recipes
          ? data.recipes
          : [data];

        const converted: Recipe[] = recipeList.map((r, idx) => {
          const title = r.title || r.name || `匯入食譜 #${idx + 1}`;
          const category = r.category || '未分類';
          const steps = parseStepsText(r.steps || r.instructions || r.steps_list);
          const ingredients = parseIngredients(
            r.ingredients || r.ingredients_list || r.ingredientList
          );

          return {
            id: `imported-${Date.now()}-${idx}-${Math.random().toString(36).substr(2, 4)}`,
            title,
            description: r.description || r.summary || r.notes?.slice(0, 100) || `${category}手作食譜`,
            category,
            tags: Array.isArray(r.tags) ? r.tags : r.tags ? [r.tags] : ['已匯入'],
            servings: Number(r.servings || r.yield || 4),
            prepTime: Number(r.prepTime || r.prep_time || r.prepTimeMinutes || 20),
            cookTime: Number(r.cookTime || r.cook_time || r.cookTimeMinutes || 30),
            difficulty: r.difficulty || '簡單',
            coverImage:
              r.coverImage ||
              r.image_url ||
              r.imageUrl ||
              r.image ||
              'https://images.unsplash.com/photo-1495521821757-a1efb6729352?auto=format&fit=crop&q=80&w=800',
            ingredients,
            steps,
            notes: r.notes || r.privateNotes || r.tips || undefined,
            privateNotes: r.privateNotes || r.notes || undefined,
            rating: Number(r.rating || 5),
            source: r.source || 'Recipe Notes',
            isFavorite: Boolean(r.isFavorite || r.favorite),
            createdAt: r.createdAt || r.created_at ? new Date(r.createdAt || r.created_at).getTime() : Date.now(),
            updatedAt: Date.now(),
          };
        });

        if (converted.length > 0) {
          setParsedPreview(converted);
          setSuccessMessage(`成功解析出 ${converted.length} 道食譜！請於下方確認並點擊匯入。`);
          return;
        }
      }

      // 2. Try parsing Markdown format (Contains `# ` or `## Ingredients`)
      if (trimmed.includes('# ') || trimmed.includes('## Ingredients') || trimmed.includes('## Directions')) {
        const mdParsed = parseMarkdownRecipes(trimmed);
        if (mdParsed.length > 0) {
          setParsedPreview(mdParsed);
          setSuccessMessage(`成功從 Markdown 檔案解析出 ${mdParsed.length} 道食譜！請於下方預覽確認。`);
          return;
        }
      }

      // 3. Fallback: Parse plain text recipe format
      const lines = trimmed.split('\n');
      const title = lines[0]?.replace(/^[#\s*]+/, '').trim() || '未命名食譜';
      const steps = parseStepsText(trimmed);
      const ingredients = parseIngredients(trimmed);

      const singleRecipe: Recipe = {
        id: `imported-txt-${Date.now()}`,
        title,
        description: '從文字手動匯入的食譜',
        category: '家常料理',
        tags: ['手動匯入'],
        servings: 4,
        prepTime: 20,
        cookTime: 30,
        difficulty: '簡單',
        coverImage: 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?auto=format&fit=crop&q=80&w=800',
        ingredients,
        steps,
        notes: trimmed,
        rating: 5,
        source: '自訂匯入',
        isFavorite: false,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      setParsedPreview([singleRecipe]);
      setSuccessMessage('已將文字解析為 1 道食譜，請確認下方預覽。');
    } catch (err: any) {
      setErrorMessage(`解析失敗：${err?.message || '格式不符'}`);
    }
  };

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setRawText(content);
      handleParseContent(content);
    };
    reader.readAsText(file);
  };

  // Confirm import
  const handleConfirmImport = () => {
    if (!parsedPreview || parsedPreview.length === 0) return;
    onImportRecipes(parsedPreview);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-stone-200 overflow-hidden my-auto flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500 text-stone-950 flex items-center justify-center font-bold">
              <Upload className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-stone-900">匯入食譜 (Markdown .md / JSON / 文字)</h2>
              <p className="text-xs text-stone-500">支援 .md 筆記、RecipeNotes 備份、JSON 或直接貼上</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {/* Guide tip for RecipeNotes and Markdown */}
          <div className="p-3.5 bg-amber-50/80 border border-amber-200 rounded-2xl text-amber-900 text-xs flex items-start gap-2.5">
            <HelpCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold">支援 Markdown (.md) 批次匯入！</span>
              <p className="text-[11px] text-stone-600 leading-relaxed">
                支援以 <code># 食譜名稱</code> 開頭的 Markdown 筆記。無論是 1 道還是多道食譜，系統都會自動拆解食材（Ingredients）、做法步驟（Directions）並配對計時器！
              </p>
            </div>
          </div>

          {/* Mode Switcher */}
          <div className="flex gap-2 border-b border-stone-100 pb-3">
            <button
              type="button"
              onClick={() => setImportMode('paste')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                importMode === 'paste'
                  ? 'bg-stone-900 text-white'
                  : 'text-stone-600 hover:bg-stone-100'
              }`}
            >
              <FileCode className="w-3.5 h-3.5" />
              <span>貼上 Markdown / JSON / 文字</span>
            </button>
            <button
              type="button"
              onClick={() => setImportMode('file')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                importMode === 'file'
                  ? 'bg-stone-900 text-white'
                  : 'text-stone-600 hover:bg-stone-100'
              }`}
            >
              <Upload className="w-3.5 h-3.5" />
              <span>上傳檔案 (.md / .json / .txt)</span>
            </button>
          </div>

          {/* Error / Success feedback */}
          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}
          {successMessage && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 text-xs font-semibold flex items-center gap-2">
              <Check className="w-4 h-4 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Paste or Upload Area */}
          {importMode === 'paste' ? (
            <div className="space-y-2">
              <textarea
                value={rawText}
                onChange={(e) => setRawText(e.target.value)}
                placeholder="請在此處貼上 .md Markdown 內容（如 # 食譜名稱、## Ingredients 等），或 JSON..."
                rows={6}
                className="w-full p-3 rounded-xl border border-stone-300 text-xs font-mono focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
              />
              <button
                type="button"
                onClick={() => handleParseContent(rawText)}
                className="w-full py-2 bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold rounded-xl shadow-xs transition-colors"
              >
                開始解析 Markdown / 內容
              </button>
            </div>
          ) : (
            <div className="border-2 border-dashed border-stone-300 rounded-2xl p-6 text-center hover:border-amber-500 transition-colors">
              <input
                type="file"
                accept=".md,.json,.txt"
                onChange={handleFileUpload}
                id="file-import-input"
                className="hidden"
              />
              <label htmlFor="file-import-input" className="cursor-pointer space-y-2 block">
                <Upload className="w-8 h-8 text-stone-400 mx-auto" />
                <p className="text-xs font-bold text-stone-700">點擊此處選擇 .md、.json 或 .txt 檔案</p>
                <p className="text-[11px] text-stone-400">支援單個或多個食譜合併的 Markdown 檔案</p>
              </label>
            </div>
          )}

          {/* Parsed Preview Section */}
          {parsedPreview && parsedPreview.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-stone-200">
              <div className="flex items-center justify-between text-xs text-stone-600">
                <span className="font-bold">即將匯入的食譜清單（共 {parsedPreview.length} 道）：</span>
              </div>
              <div className="max-h-48 overflow-y-auto divide-y divide-stone-100 border border-stone-200 rounded-xl bg-stone-50">
                {parsedPreview.map((item, idx) => (
                  <div key={idx} className="p-2.5 flex items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="font-mono text-[10px] text-stone-400">{idx + 1}</span>
                      <span className="font-bold text-stone-800 truncate">{item.title}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-stone-200 text-stone-600 shrink-0">
                        {item.category}
                      </span>
                    </div>
                    <div className="text-[11px] text-stone-500 shrink-0">
                      {item.ingredients.length} 項食材 · {item.steps.length} 步驟
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 border-t border-stone-200 flex items-center justify-between bg-stone-50">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-stone-600 hover:text-stone-900"
          >
            取消
          </button>
          <button
            type="button"
            disabled={!parsedPreview || parsedPreview.length === 0}
            onClick={handleConfirmImport}
            className="px-5 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-bold shadow-sm transition-all flex items-center gap-1.5"
          >
            <Check className="w-4 h-4" />
            <span>確認匯入至我的食譜 ({parsedPreview?.length || 0})</span>
          </button>
        </div>
      </div>
    </div>
  );
};
