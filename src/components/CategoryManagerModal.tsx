import React, { useState } from 'react';
import {
  X,
  Plus,
  Edit2,
  Trash2,
  Check,
  RotateCcw,
  Tag,
  ArrowUp,
  ArrowDown,
  Layers,
  BookOpen,
  AlertCircle,
} from 'lucide-react';
import { Recipe } from '../types';
import { PRESET_CATEGORIES } from '../data/initialRecipes';

interface CategoryManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: string[];
  onUpdateCategories: (newCategories: string[]) => void;
  recipes: Recipe[];
  onRenameCategoryInRecipes: (oldName: string, newName: string) => void;
  onDeleteCategoryInRecipes: (deletedCat: string, fallbackCat: string) => void;
}

export const CategoryManagerModal: React.FC<CategoryManagerModalProps> = ({
  isOpen,
  onClose,
  categories,
  onUpdateCategories,
  recipes,
  onRenameCategoryInRecipes,
  onDeleteCategoryInRecipes,
}) => {
  const [editingCat, setEditingCat] = useState<string | null>(null);
  const [editInput, setEditInput] = useState('');
  const [newCatInput, setNewCatInput] = useState('');
  const [deletingCat, setDeletingCat] = useState<string | null>(null);
  const [fallbackCat, setFallbackCat] = useState<string>('家常料理');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  // Filter out '全部' from manageable categories
  const editableCategories = categories.filter((c) => c !== '全部');

  // Count recipes per category (trimmed comparison)
  const getRecipeCount = (cat: string) => {
    const cleanCat = cat.trim();
    return recipes.filter((r) => r.category?.trim() === cleanCat).length;
  };

  // Start editing
  const handleStartEdit = (cat: string) => {
    setDeletingCat(null);
    setEditingCat(cat);
    setEditInput(cat);
    setErrorMessage(null);
  };

  // Save rename
  const handleSaveRename = (oldName: string) => {
    const trimmed = editInput.trim();
    if (!trimmed) {
      setErrorMessage('分類名稱不能為空');
      return;
    }
    if (trimmed === oldName) {
      setEditingCat(null);
      return;
    }
    if (trimmed === '全部') {
      setErrorMessage('「全部」為系統保留關鍵字，無法命名為此名稱');
      return;
    }
    if (editableCategories.map((c) => c.trim()).includes(trimmed)) {
      setErrorMessage(`已有相同名稱的分類「${trimmed}」`);
      return;
    }

    // Update category list
    const updated = categories.map((c) => (c === oldName ? trimmed : c));
    onUpdateCategories(updated);

    // Update all recipes with this category
    onRenameCategoryInRecipes(oldName, trimmed);

    setEditingCat(null);
    setErrorMessage(null);
  };

  // Add new category
  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newCatInput.trim();
    if (!trimmed) return;

    if (trimmed === '全部') {
      setErrorMessage('「全部」為系統保留關鍵字，無法命名為此名稱');
      return;
    }
    if (editableCategories.map((c) => c.trim()).includes(trimmed)) {
      setErrorMessage(`已有相同名稱的分類「${trimmed}」`);
      return;
    }

    const updated = [...categories, trimmed];
    onUpdateCategories(updated);
    setNewCatInput('');
    setErrorMessage(null);
  };

  // Move up/down
  const handleMove = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= editableCategories.length) return;

    const list = [...editableCategories];
    const temp = list[index];
    list[index] = list[targetIndex];
    list[targetIndex] = temp;

    onUpdateCategories(['全部', ...list]);
  };

  // Trigger Delete confirmation for a category
  const handleStartDelete = (cat: string) => {
    setEditingCat(null);
    setDeletingCat(cat);
    // Pick a fallback that isn't the deleted category
    const available = editableCategories.filter((c) => c.trim() !== cat.trim());
    setFallbackCat(available[0] || '家常料理');
    setErrorMessage(null);
  };

  // Confirm delete and execute
  const handleExecuteDelete = (catToDelete: string, targetFallback: string) => {
    const cleanCat = catToDelete.trim();
    const fallback = targetFallback.trim() || '未分類';
    
    // Always call both to safely update recipes and category list
    onDeleteCategoryInRecipes(cleanCat, fallback);
    const updated = categories.filter((c) => c.trim() !== cleanCat);
    onUpdateCategories(updated);

    setDeletingCat(null);
    setErrorMessage(null);
  };

  // Reset to initial preset categories
  const handleResetPresets = () => {
    if (window.confirm('確定要還原為系統預設的食譜分類嗎？（現有食譜的分類標記將會保留）')) {
      onUpdateCategories([...PRESET_CATEGORIES]);
      setErrorMessage(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-stone-200 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500 text-stone-950 flex items-center justify-center font-bold">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-stone-900">自訂與編輯分類名稱</h2>
              <p className="text-xs text-stone-500">
                可自由重新命名、新增、調整順序或刪除分類
              </p>
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
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Add Category Input Form */}
          <form onSubmit={handleAddCategory} className="space-y-1.5">
            <label className="block text-xs font-bold text-stone-700">新增自訂分類：</label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none" />
                <input
                  type="text"
                  value={newCatInput}
                  onChange={(e) => setNewCatInput(e.target.value)}
                  placeholder="例如：氣炸鍋料理、減醣便當、義式料理..."
                  className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-stone-300 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                />
              </div>
              <button
                type="submit"
                disabled={!newCatInput.trim()}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed text-stone-950 text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span>新增</span>
              </button>
            </div>
          </form>

          {/* Categories List */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-stone-500">
              <span className="font-bold text-stone-700">現有分類清單（共 {editableCategories.length} 個）：</span>
              <span className="text-[11px]">點擊 ✎ 重新命名，點擊 🗑 刪除</span>
            </div>

            <div className="divide-y divide-stone-100 border border-stone-200 rounded-2xl overflow-hidden bg-stone-50/50">
              {editableCategories.map((cat, idx) => {
                const count = getRecipeCount(cat);
                const isEditingThis = editingCat === cat;
                const isDeletingThis = deletingCat === cat;

                return (
                  <div
                    key={cat}
                    className={`p-2.5 sm:px-3.5 sm:py-2.5 flex items-center justify-between gap-2 transition-colors ${
                      isDeletingThis
                        ? 'bg-amber-50/90 border-l-4 border-amber-500'
                        : isEditingThis
                        ? 'bg-amber-50/30'
                        : 'bg-white hover:bg-stone-50/80'
                    }`}
                  >
                    {isDeletingThis ? (
                      /* Inline Delete Confirmation Card */
                      <div className="w-full space-y-2.5 py-1 animate-in fade-in duration-150">
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-1.5 font-bold text-stone-900">
                            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                            <span>確定要刪除分類「{cat}」？</span>
                          </div>
                          <span className={`text-[11px] px-2 py-0.5 rounded-full font-bold shrink-0 ${
                            count > 0 ? 'bg-amber-200 text-amber-900' : 'bg-stone-200 text-stone-700'
                          }`}>
                            {count > 0 ? `${count} 道食譜使用中` : '0 道食譜'}
                          </span>
                        </div>

                        {count > 0 ? (
                          <div className="text-xs space-y-2 bg-white/80 p-2.5 rounded-xl border border-amber-200">
                            <p className="text-[11px] text-stone-600">
                              刪除此分類後，請選擇將現有 <strong>{count}</strong> 道食譜轉移至哪一個分類：
                            </p>
                            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                              <select
                                value={fallbackCat}
                                onChange={(e) => setFallbackCat(e.target.value)}
                                className="flex-1 px-3 py-1.5 rounded-lg border border-stone-300 bg-white text-xs font-semibold text-stone-800 focus:outline-none focus:ring-1 focus:ring-amber-500"
                              >
                                {editableCategories
                                  .filter((c) => c.trim() !== cat.trim())
                                  .map((c) => (
                                    <option key={c} value={c}>
                                      轉移至：{c}
                                    </option>
                                  ))}
                                <option value="家常料理">轉移至：家常料理</option>
                                <option value="未分類">轉移至：未分類</option>
                              </select>
                              <div className="flex items-center gap-2 justify-end shrink-0">
                                <button
                                  type="button"
                                  onClick={() => setDeletingCat(null)}
                                  className="px-3 py-1.5 text-xs text-stone-600 hover:bg-stone-200/70 rounded-lg transition-colors cursor-pointer"
                                >
                                  取消
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleExecuteDelete(cat, fallbackCat)}
                                  className="px-3.5 py-1.5 text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white rounded-lg shadow-xs transition-colors cursor-pointer"
                                >
                                  確認刪除並轉移
                                </button>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between gap-2 pt-0.5">
                            <p className="text-[11px] text-stone-600">
                              此分類目前無任何食譜，點擊右側按鈕即可立即刪除。
                            </p>
                            <div className="flex items-center gap-2 shrink-0">
                              <button
                                type="button"
                                onClick={() => setDeletingCat(null)}
                                className="px-3 py-1.5 text-xs text-stone-600 hover:bg-stone-200/70 rounded-lg transition-colors cursor-pointer"
                              >
                                取消
                              </button>
                              <button
                                type="button"
                                onClick={() => handleExecuteDelete(cat, '未分類')}
                                className="px-3.5 py-1.5 text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white rounded-lg shadow-xs transition-colors cursor-pointer"
                              >
                                確定刪除
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : isEditingThis ? (
                      /* Editing Input */
                      <div className="flex-1 flex items-center gap-2">
                        <input
                          type="text"
                          value={editInput}
                          onChange={(e) => setEditInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleSaveRename(cat);
                            if (e.key === 'Escape') setEditingCat(null);
                          }}
                          autoFocus
                          className="flex-1 px-3 py-1 text-xs sm:text-sm rounded-lg border border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 font-semibold text-stone-900 bg-amber-50/30"
                        />
                        <button
                          type="button"
                          onClick={() => handleSaveRename(cat)}
                          className="p-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white shadow-xs"
                          title="確認修改"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingCat(null)}
                          className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100"
                          title="取消"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      /* Display Row */
                      <>
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="w-6 text-[11px] font-mono text-stone-400 text-center">
                            {idx + 1}
                          </span>
                          <span className="font-bold text-xs sm:text-sm text-stone-800 truncate">
                            {cat}
                          </span>
                          <span className="text-[11px] px-2 py-0.5 rounded-full bg-stone-100 text-stone-500 border border-stone-200/60 shrink-0">
                            {count} 道食譜
                          </span>
                        </div>

                        <div className="flex items-center gap-1">
                          {/* Reorder Buttons */}
                          <button
                            type="button"
                            disabled={idx === 0}
                            onClick={() => handleMove(idx, 'up')}
                            className="p-1 rounded-lg text-stone-400 hover:text-stone-700 disabled:opacity-20"
                            title="上移"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            disabled={idx === editableCategories.length - 1}
                            onClick={() => handleMove(idx, 'down')}
                            className="p-1 rounded-lg text-stone-400 hover:text-stone-700 disabled:opacity-20"
                            title="下移"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>

                          {/* Edit Name Button */}
                          <button
                            type="button"
                            onClick={() => handleStartEdit(cat)}
                            className="p-1.5 rounded-lg text-stone-500 hover:text-amber-700 hover:bg-amber-50 transition-colors ml-1"
                            title="修改分類名稱"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>

                          {/* Delete Button */}
                          <button
                            type="button"
                            onClick={() => handleStartDelete(cat)}
                            className="p-1.5 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                            title="刪除分類"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 border-t border-stone-200 flex items-center justify-between bg-stone-50/80">
          <button
            type="button"
            onClick={handleResetPresets}
            className="text-xs text-stone-500 hover:text-stone-800 flex items-center gap-1.5 font-medium"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>還原系統預設分類</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold shadow-sm transition-all"
          >
            完成
          </button>
        </div>
      </div>
    </div>
  );
};
