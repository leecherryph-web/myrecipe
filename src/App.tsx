import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Plus,
  BookOpen,
  Sparkles,
  Heart,
  ChefHat,
  Search,
  Filter,
  Download,
  Upload,
  RefreshCw,
  Clock,
  Flame,
  UtensilsCrossed,
  Layers,
  Star,
  Lock,
  ArrowUpDown,
  Share2,
  X,
  Cloud,
} from 'lucide-react';
import { Recipe, ActiveTimer, GoogleDriveStatus, ViewMode, SortOption, RatingFilter } from './types';
import { INITIAL_RECIPES, PRESET_CATEGORIES } from './data/initialRecipes';
import { Navbar } from './components/Navbar';
import { RecipeCard } from './components/RecipeCard';
import { RecipeDetail } from './components/RecipeDetail';
import { RecipeEditorModal } from './components/RecipeEditorModal';
import { TimerDrawer } from './components/TimerDrawer';
import { FloatingTimerWidget } from './components/FloatingTimerWidget';
import { CookingModeModal } from './components/CookingModeModal';
import { GoogleDriveModal } from './components/GoogleDriveModal';
import { ExportModal } from './components/ExportModal';
import { ShareModal } from './components/ShareModal';
import { CategoryManagerModal } from './components/CategoryManagerModal';
import { ImportModal } from './components/ImportModal';
import { googleDriveService } from './services/googleDriveService';
import { audioService } from './services/audioService';
import { ShareService } from './services/shareService';

const LOCAL_STORAGE_KEY = 'recipe_app_recipes_data';
const TIMERS_STORAGE_KEY = 'recipe_app_active_timers';
const CATEGORIES_STORAGE_KEY = 'recipe_app_categories_list';
const DATA_VERSION_KEY = 'recipe_app_data_version';
const CURRENT_DATA_VERSION = 'v4_cherry_markdown_cheesecakes';

export default function App() {
  // 1. Recipes state: Safely preserve existing user edits, append newly added built-ins
  const [recipes, setRecipes] = useState<Recipe[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const userSavedList: Recipe[] = JSON.parse(saved);
        if (Array.isArray(userSavedList) && userSavedList.length > 0) {
          // Merge: Keep all user-edited recipes, only append initial recipes if not present
          const userRecipeIds = new Set(userSavedList.map((r) => r.id));
          const userRecipeTitles = new Set(userSavedList.map((r) => r.title.trim().toLowerCase()));

          const missingInitial = INITIAL_RECIPES.filter(
            (initR) => !userRecipeIds.has(initR.id) && !userRecipeTitles.has(initR.title.trim().toLowerCase())
          );

          const merged = [...userSavedList, ...missingInitial];
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(merged));
          return merged;
        }
      }
    } catch {
      // Fallback
    }
    return INITIAL_RECIPES;
  });

  // 1b. Custom Categories list state: Faithfully persist user customizations without forced preset merging
  const [categoriesList, setCategoriesList] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(CATEGORIES_STORAGE_KEY);
      if (saved !== null) {
        const userCats: string[] = JSON.parse(saved);
        if (Array.isArray(userCats) && userCats.length > 0) {
          // Respect user's saved categories list directly!
          return userCats;
        }
      }
    } catch {
      // Fallback
    }
    return PRESET_CATEGORIES;
  });

  // Persist categories list to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(categoriesList));
    } catch {
      // Ignore
    }
  }, [categoriesList]);

  // 2. Navigation & filter states
  const [selectedRecipeId, setSelectedRecipeId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('全部');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState<boolean>(false);
  const [ratingFilter, setRatingFilter] = useState<RatingFilter>('all');
  const [hasPrivateNotesOnly, setHasPrivateNotesOnly] = useState<boolean>(false);
  const [sortOption, setSortOption] = useState<SortOption>('updated');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  // 3. Timers state
  const [timers, setTimers] = useState<ActiveTimer[]>(() => {
    try {
      const saved = localStorage.getItem(TIMERS_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // Fallback
    }
    return [];
  });

  // 4. Google Drive state
  const [driveStatus, setDriveStatus] = useState<GoogleDriveStatus>(
    googleDriveService.getStatus()
  );

  // 5. Modals state
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);
  const [isCategoryManagerOpen, setIsCategoryManagerOpen] = useState(false);
  const [isTimerDrawerOpen, setIsTimerDrawerOpen] = useState(false);
  const [isCookingModeOpen, setIsCookingModeOpen] = useState(false);
  const [cookingRecipe, setCookingRecipe] = useState<Recipe | null>(null);
  const [cookingServings, setCookingServings] = useState<number>(2);
  const [isDriveModalOpen, setIsDriveModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [exportRecipe, setExportRecipe] = useState<Recipe | null>(null);
  const [exportServings, setExportServings] = useState<number>(2);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [shareRecipe, setShareRecipe] = useState<Recipe | null>(null);

  // Shared Recipe Import Prompt State
  const [sharedIncomingRecipe, setSharedIncomingRecipe] = useState<Recipe | null>(null);

  // Toast message state
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const autoSyncDebounceRef = useRef<NodeJS.Timeout | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Check URL Hash for shared recipes on mount
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#share=')) {
        const encoded = hash.replace('#share=', '');
        const parsed = ShareService.parsePortableRecipe(encoded);
        if (parsed) {
          setSharedIncomingRecipe(parsed);
        }
      } else if (hash.startsWith('#recipe=')) {
        const id = decodeURIComponent(hash.replace('#recipe=', ''));
        setSelectedRecipeId(id);
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Subscribe to Google Drive service state
  useEffect(() => {
    const unsubscribe = googleDriveService.subscribe((status) => {
      setDriveStatus(status);
    });
    return unsubscribe;
  }, []);

  // Persist recipes to localStorage and trigger auto-sync
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(recipes));
    } catch {
      // Ignore
    }

    // Debounced Auto-sync to Google Drive if connected
    if (driveStatus.isConnected && driveStatus.isAutoSync) {
      if (autoSyncDebounceRef.current) {
        clearTimeout(autoSyncDebounceRef.current);
      }
      autoSyncDebounceRef.current = setTimeout(() => {
        googleDriveService.syncToDrive(recipes);
      }, 4000);
    }
  }, [recipes, driveStatus.isConnected, driveStatus.isAutoSync]);

  // Persist active timers
  useEffect(() => {
    try {
      localStorage.setItem(TIMERS_STORAGE_KEY, JSON.stringify(timers));
    } catch {
      // Ignore
    }
  }, [timers]);

  // Global Timer countdown ticker
  useEffect(() => {
    const interval = setInterval(() => {
      setTimers((prevTimers) => {
        let hasChanges = false;
        const updated = prevTimers.map((t) => {
          if (t.isRunning && t.remainingSeconds > 0) {
            hasChanges = true;
            const nextSec = t.remainingSeconds - 1;
            if (nextSec === 0) {
              audioService.playTimerDoneChime();
              return { ...t, remainingSeconds: 0, isRunning: false, isCompleted: true };
            }
            return { ...t, remainingSeconds: nextSec };
          }
          return t;
        });
        return hasChanges ? updated : prevTimers;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Compute all available categories (from custom list)
  const allCategories = useMemo(() => {
    const list = ['全部', ...categoriesList.filter((c) => c && c.trim() !== '全部')];
    return Array.from(new Set(list.map((c) => c.trim()).filter(Boolean)));
  }, [categoriesList]);

  // Category Management Handlers
  const handleUpdateCategoriesList = (newCategories: string[]) => {
    const sanitized = Array.from(new Set(newCategories.map((c) => c.trim()).filter(Boolean)));
    setCategoriesList(sanitized);
    try {
      localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(sanitized));
    } catch {
      // Ignore
    }
  };

  const handleRenameCategoryInRecipes = (oldName: string, newName: string) => {
    const cleanOld = oldName.trim();
    const cleanNew = newName.trim();

    setRecipes((prev) => {
      const updated = prev.map((r) =>
        r.category?.trim() === cleanOld
          ? { ...r, category: cleanNew, updatedAt: Date.now() }
          : r
      );
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // Ignore
      }
      return updated;
    });

    setCategoriesList((prev) => {
      const updated = prev.map((c) => (c.trim() === cleanOld ? cleanNew : c));
      try {
        localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // Ignore
      }
      return updated;
    });

    if (selectedCategory.trim() === cleanOld) {
      setSelectedCategory(cleanNew);
    }
    showToast(`已將分類「${cleanOld}」重新命名為「${cleanNew}」並更新相關食譜`);
  };

  const handleDeleteCategoryInRecipes = (deletedCat: string, fallbackCat: string) => {
    const cleanDeleted = deletedCat.trim();
    const cleanFallback = fallbackCat.trim() || '未分類';
    const finalFallback = cleanFallback === '全部' ? '未分類' : cleanFallback;

    // 1. Update all recipes having this category to the fallback category
    setRecipes((prev) => {
      const updated = prev.map((r) =>
        r.category?.trim() === cleanDeleted
          ? { ...r, category: finalFallback, updatedAt: Date.now() }
          : r
      );
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // Ignore
      }
      return updated;
    });

    // 2. Remove the deleted category from categoriesList immediately
    setCategoriesList((prev) => {
      const updated = prev.filter((c) => c.trim() !== cleanDeleted);
      try {
        localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // Ignore
      }
      return updated;
    });

    // 3. Reset selectedCategory if it matches the deleted category
    if (selectedCategory.trim() === cleanDeleted) {
      setSelectedCategory(finalFallback !== '未分類' ? finalFallback : '全部');
    }

    showToast(`已成功刪除「${cleanDeleted}」分類`);
  };

  // Filtered & Sorted recipes
  const filteredRecipes = useMemo(() => {
    const result = recipes.filter((r) => {
      // Category filter
      if (selectedCategory !== '全部' && r.category !== selectedCategory) {
        return false;
      }
      // Favorites filter
      if (showFavoritesOnly && !r.isFavorite) {
        return false;
      }
      // Rating filter
      if (ratingFilter !== 'all') {
        const minRating = Number(ratingFilter);
        if (!r.rating || r.rating < minRating) {
          return false;
        }
      }
      // Private Notes filter
      if (hasPrivateNotesOnly && (!r.privateNotes || r.privateNotes.trim() === '')) {
        return false;
      }
      // Search filter (searches title, description, ingredients, tags, privateNotes, notes, and steps)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const titleMatch = r.title.toLowerCase().includes(q);
        const descMatch = (r.description || '').toLowerCase().includes(q);
        const tagMatch = (r.tags || []).some((t) => t.toLowerCase().includes(q));
        const privateNotesMatch = (r.privateNotes || '').toLowerCase().includes(q);
        const notesMatch = (r.notes || '').toLowerCase().includes(q);
        const ingMatch = r.ingredients.some(
          (i) => i.name.toLowerCase().includes(q) || (i.notes || '').toLowerCase().includes(q)
        );
        const stepMatch = r.steps.some(
          (s) => (s.title || '').toLowerCase().includes(q) || s.instruction.toLowerCase().includes(q)
        );
        return (
          titleMatch ||
          descMatch ||
          tagMatch ||
          privateNotesMatch ||
          notesMatch ||
          ingMatch ||
          stepMatch
        );
      }
      return true;
    });

    // Sorting logic
    return result.sort((a, b) => {
      if (sortOption === 'rating') {
        const rA = a.rating || 0;
        const rB = b.rating || 0;
        if (rB !== rA) return rB - rA;
        return (b.updatedAt || 0) - (a.updatedAt || 0);
      }
      if (sortOption === 'time') {
        const tA = (a.prepTime || 0) + (a.cookTime || 0);
        const tB = (b.prepTime || 0) + (b.cookTime || 0);
        return tA - tB;
      }
      if (sortOption === 'title') {
        return a.title.localeCompare(b.title, 'zh-Hant');
      }
      if (sortOption === 'created') {
        return (b.createdAt || 0) - (a.createdAt || 0);
      }
      // default 'updated'
      return (b.updatedAt || 0) - (a.updatedAt || 0);
    });
  }, [
    recipes,
    selectedCategory,
    showFavoritesOnly,
    ratingFilter,
    hasPrivateNotesOnly,
    searchQuery,
    sortOption,
  ]);

  const selectedRecipe = useMemo(() => {
    return recipes.find((r) => r.id === selectedRecipeId) || null;
  }, [recipes, selectedRecipeId]);

  // Recipe Handlers
  const handleSaveRecipe = (recipeData: Recipe) => {
    setRecipes((prev) => {
      const existsIndex = prev.findIndex((r) => r.id === recipeData.id);
      if (existsIndex >= 0) {
        const updated = [...prev];
        updated[existsIndex] = recipeData;
        return updated;
      } else {
        return [recipeData, ...prev];
      }
    });
    setIsEditorOpen(false);
    setEditingRecipe(null);
    setSelectedRecipeId(recipeData.id);
    showToast('食譜儲存成功！');
  };

  const handleUpdateRecipeDirect = (updatedRecipe: Recipe) => {
    setRecipes((prev) =>
      prev.map((r) => (r.id === updatedRecipe.id ? updatedRecipe : r))
    );
    showToast('已即時更新食譜');
  };

  const handleDeleteRecipe = (id: string) => {
    setRecipes((prev) => prev.filter((r) => r.id !== id));
    if (selectedRecipeId === id) {
      setSelectedRecipeId(null);
    }
    showToast('食譜已刪除');
  };

  const handleToggleFavorite = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setRecipes((prev) =>
      prev.map((r) => (r.id === id ? { ...r, isFavorite: !r.isFavorite } : r))
    );
  };

  const handleDuplicateRecipe = (recipe: Recipe, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const duplicated: Recipe = {
      ...recipe,
      id: `recipe-${Date.now()}`,
      title: `${recipe.title} (副本)`,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      isFavorite: false,
    };
    setRecipes((prev) => [duplicated, ...prev]);
    showToast('已複製食譜副本');
  };

  const handleEditRecipe = (recipe: Recipe, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setEditingRecipe(recipe);
    setIsEditorOpen(true);
  };

  const handleOpenExport = (recipe: Recipe, servings?: number, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setExportRecipe(recipe);
    setExportServings(servings || recipe.servings || 2);
    setIsExportModalOpen(true);
  };

  const handleOpenShare = (recipe: Recipe, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setShareRecipe(recipe);
    setIsShareModalOpen(true);
  };

  // Timer Handlers
  const handleCreateTimer = (
    name: string,
    totalSeconds: number,
    recipeId?: string,
    stepNumber?: number
  ) => {
    const newTimer: ActiveTimer = {
      id: `timer-${Date.now()}`,
      name,
      totalSeconds,
      remainingSeconds: totalSeconds,
      isRunning: true,
      isCompleted: false,
      recipeId,
      stepNumber,
      createdAt: Date.now(),
    };
    setTimers((prev) => [newTimer, ...prev]);
    setIsTimerDrawerOpen(true);
    showToast(`計時器「${name}」已啟動！`);
  };

  const handleToggleTimer = (id: string) => {
    setTimers((prev) =>
      prev.map((t) => (t.id === id ? { ...t, isRunning: !t.isRunning } : t))
    );
  };

  const handleResetTimer = (id: string) => {
    setTimers((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              remainingSeconds: t.totalSeconds,
              isRunning: false,
              isCompleted: false,
            }
          : t
      )
    );
  };

  const handleDeleteTimer = (id: string) => {
    setTimers((prev) => prev.filter((t) => t.id !== id));
  };

  const handleAddTimerSeconds = (id: string, seconds: number) => {
    setTimers((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              remainingSeconds: t.remainingSeconds + seconds,
              totalSeconds: t.totalSeconds + seconds,
            }
          : t
      )
    );
  };

  const handleDismissFinishedTimers = () => {
    setTimers((prev) => prev.filter((t) => t.remainingSeconds > 0));
  };

  // Cooking Mode Handlers
  const handleOpenCookingMode = (recipe: Recipe, currentServings: number) => {
    setCookingRecipe(recipe);
    setCookingServings(currentServings);
    setIsCookingModeOpen(true);
  };

  // Google Drive Handlers
  const handleConnectDrive = async (clientId?: string) => {
    return await googleDriveService.connect(clientId);
  };

  const handleDisconnectDrive = () => {
    googleDriveService.disconnect();
    showToast('已中斷 Google Drive 連線');
  };

  const handleSyncToDriveNow = async () => {
    return await googleDriveService.syncToDrive(recipes);
  };

  const handleRestoreFromDriveNow = async () => {
    const res = await googleDriveService.restoreFromDrive();
    if (res.success && res.recipes) {
      setRecipes(res.recipes);
      showToast(`成功從 Google Drive 還原 ${res.recipes.length} 道食譜！`);
    }
    return res;
  };

  const handleImportRecipes = (imported: Recipe[]) => {
    setRecipes((prev) => {
      const map = new Map<string, Recipe>();
      prev.forEach((r) => map.set(r.id, r));
      imported.forEach((r) => map.set(r.id, r));
      return Array.from(map.values());
    });

    // Automatically add new categories to categories list
    const newCats = imported.map((r) => r.category).filter((c): c is string => Boolean(c && c !== '全部'));
    if (newCats.length > 0) {
      setCategoriesList((prev) => Array.from(new Set([...prev, ...newCats])));
    }

    showToast(`成功匯入 ${imported.length} 道食譜！`);
  };

  const handleAcceptSharedRecipe = () => {
    if (sharedIncomingRecipe) {
      handleImportRecipes([sharedIncomingRecipe]);
      setSelectedRecipeId(sharedIncomingRecipe.id);
      setSharedIncomingRecipe(null);
      // Clean url hash
      window.history.replaceState(null, '', window.location.pathname);
      showToast(`已成功將「${sharedIncomingRecipe.title}」加入您的食譜手札！`);
    }
  };

  return (
    <div className="min-h-screen bg-stone-100/60 text-stone-800 flex flex-col selection:bg-amber-100 selection:text-amber-900">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-stone-900 text-stone-100 px-4 py-2.5 rounded-2xl shadow-xl border border-stone-700 text-xs font-semibold flex items-center gap-2 animate-in fade-in slide-in-from-top-4 duration-200">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Incoming Shared Recipe Dialog */}
      {sharedIncomingRecipe && (
        <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-amber-200 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500 text-stone-950 flex items-center justify-center font-bold">
                <Share2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-stone-900">收到分享的食譜！</h3>
                <p className="text-xs text-stone-500">好友與您分享了一道美味私房料理</p>
              </div>
            </div>

            <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200 flex gap-3 items-center">
              <img
                src={sharedIncomingRecipe.coverImage || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80'}
                alt={sharedIncomingRecipe.title}
                className="w-16 h-16 rounded-xl object-cover shrink-0"
              />
              <div className="min-w-0 flex-1">
                <h4 className="font-bold text-sm text-stone-900 truncate">
                  {sharedIncomingRecipe.title}
                </h4>
                <div className="flex items-center gap-2 text-xs text-stone-500 mt-1">
                  <span>{sharedIncomingRecipe.category}</span>
                  <span>•</span>
                  <span>{sharedIncomingRecipe.ingredients.length} 種食材</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => {
                  setSharedIncomingRecipe(null);
                  window.history.replaceState(null, '', window.location.pathname);
                }}
                className="flex-1 py-2.5 rounded-xl border border-stone-300 text-stone-700 text-xs font-semibold hover:bg-stone-100"
              >
                略過
              </button>
              <button
                onClick={handleAcceptSharedRecipe}
                className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold shadow-md shadow-amber-500/20"
              >
                加入我的食譜手札
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Top Navbar */}
      <Navbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCategory={selectedCategory}
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          setSelectedRecipeId(null);
        }}
        categories={allCategories}
        driveStatus={driveStatus}
        onOpenDriveModal={() => setIsDriveModalOpen(true)}
        onOpenNewRecipe={() => {
          setEditingRecipe(null);
          setIsEditorOpen(true);
        }}
        onOpenCategoryManager={() => setIsCategoryManagerOpen(true)}
        onOpenTimerDrawer={() => setIsTimerDrawerOpen(true)}
        activeTimersCount={timers.filter((t) => t.isRunning).length}
        viewMode={viewMode}
        onToggleViewMode={() => setViewMode((v) => (v === 'grid' ? 'compact' : 'grid'))}
        showFavoritesOnly={showFavoritesOnly}
        onToggleFavorites={() => setShowFavoritesOnly(!showFavoritesOnly)}
        onOpenImportModal={() => setIsImportModalOpen(true)}
        totalRecipesCount={recipes.length}
      />

      {/* Main Content Stage */}
      <main className="flex-1">
        {selectedRecipe ? (
          /* Recipe Detail Screen */
          <RecipeDetail
            recipe={selectedRecipe}
            onBack={() => setSelectedRecipeId(null)}
            onEdit={(r) => handleEditRecipe(r)}
            onDelete={handleDeleteRecipe}
            onToggleFavorite={handleToggleFavorite}
            onOpenCookingMode={handleOpenCookingMode}
            onStartTimer={handleCreateTimer}
            onOpenExport={handleOpenExport}
            onShare={(r) => handleOpenShare(r)}
            onUpdateRecipe={handleUpdateRecipeDirect}
          />
        ) : (
          /* Recipe Catalog Screen */
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header Hero Banner */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight flex items-center gap-3">
                  <span>{selectedCategory === '全部' ? '我的食譜筆記手札' : selectedCategory}</span>
                  {showFavoritesOnly && (
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-rose-100 text-rose-700 border border-rose-200 flex items-center gap-1">
                      <Heart className="w-3 h-3 fill-rose-600" />
                      <span>我的最愛</span>
                    </span>
                  )}
                </h1>
                <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-stone-500 mt-1.5">
                  <span>共找到 {filteredRecipes.length} 道美味食譜</span>
                  <span>•</span>
                  <span>隨時離線編輯</span>
                  <span>•</span>
                  <button
                    type="button"
                    id="hero-drive-sync-btn"
                    onClick={() => setIsDriveModalOpen(true)}
                    className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-100/80 hover:bg-amber-200 text-amber-900 border border-amber-300 font-semibold transition-colors cursor-pointer"
                    title="點擊開啟 Google Drive 雲端同步與備份"
                  >
                    <Cloud className={`w-3.5 h-3.5 ${driveStatus.isConnected ? 'text-emerald-600' : 'text-amber-700'}`} />
                    <span>Google Drive 雲端同步與備份</span>
                    {driveStatus.isConnected ? (
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    ) : (
                      <span className="text-[10px] px-1 py-0.2 bg-amber-200 text-amber-900 rounded font-bold">點此設定</span>
                    )}
                  </button>
                </div>
              </div>

              {/* Quick Actions Bar */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  id="catalog-drive-sync-btn"
                  onClick={() => setIsDriveModalOpen(true)}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl border text-xs font-bold shadow-xs transition-all ${
                    driveStatus.isConnected
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-900 hover:bg-emerald-100'
                      : 'bg-amber-50 border-amber-300 text-amber-950 hover:bg-amber-100'
                  }`}
                  title="開啟 Google Drive 雲端同步與備份視窗"
                >
                  <Cloud className={`w-3.5 h-3.5 ${driveStatus.isConnected ? 'text-emerald-600' : 'text-amber-600'}`} />
                  <span>Google Drive 雲端備份</span>
                  {driveStatus.isConnected && (
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  )}
                </button>

                <button
                  onClick={() => setIsImportModalOpen(true)}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-stone-200 text-stone-700 hover:bg-stone-50 text-xs font-semibold shadow-xs transition-colors"
                  title="匯入 RecipeNotes 備份檔、JSON 或文字"
                >
                  <Upload className="w-3.5 h-3.5 text-stone-500" />
                  <span>匯入食譜</span>
                </button>

                <button
                  onClick={() => {
                    setExportRecipe(null);
                    setIsExportModalOpen(true);
                  }}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-stone-200 text-stone-700 hover:bg-stone-50 text-xs font-semibold shadow-xs transition-colors"
                >
                  <Download className="w-3.5 h-3.5 text-stone-500" />
                  <span>匯出全本手札</span>
                </button>

                <button
                  id="catalog-create-recipe-btn"
                  onClick={() => {
                    setEditingRecipe(null);
                    setIsEditorOpen(true);
                  }}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs shadow-md shadow-amber-500/20 transition-transform active:scale-95"
                >
                  <Plus className="w-4 h-4 stroke-[2.5]" />
                  <span>新增食譜</span>
                </button>
              </div>
            </div>

            {/* Filter & Sort Bar */}
            <div className="bg-white rounded-2xl border border-stone-200/80 p-3.5 sm:p-4 mb-6 shadow-xs flex flex-wrap items-center justify-between gap-3">
              {/* Rating & Private Notes Filters */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-stone-500 flex items-center gap-1">
                  <Filter className="w-3.5 h-3.5 text-amber-500" />
                  <span>篩選：</span>
                </span>

                {/* Rating Filter Pills */}
                <div className="flex items-center bg-stone-100 p-0.5 rounded-xl border border-stone-200/60 text-xs">
                  <button
                    onClick={() => setRatingFilter('all')}
                    className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                      ratingFilter === 'all'
                        ? 'bg-white text-stone-900 font-bold shadow-xs'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    全部評分
                  </button>
                  <button
                    onClick={() => setRatingFilter('5')}
                    className={`px-2.5 py-1 rounded-lg font-medium transition-all flex items-center gap-1 ${
                      ratingFilter === '5'
                        ? 'bg-white text-amber-700 font-bold shadow-xs'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    <span>5 星神作</span>
                  </button>
                  <button
                    onClick={() => setRatingFilter('4')}
                    className={`px-2.5 py-1 rounded-lg font-medium transition-all flex items-center gap-1 ${
                      ratingFilter === '4'
                        ? 'bg-white text-amber-700 font-bold shadow-xs'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    <span>4 星以上</span>
                  </button>
                  <button
                    onClick={() => setRatingFilter('3')}
                    className={`px-2.5 py-1 rounded-lg font-medium transition-all flex items-center gap-1 ${
                      ratingFilter === '3'
                        ? 'bg-white text-amber-700 font-bold shadow-xs'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    <span>3 星以上</span>
                  </button>
                </div>

                {/* Has Private Notes Toggle */}
                <button
                  onClick={() => setHasPrivateNotesOnly(!hasPrivateNotesOnly)}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold border transition-all ${
                    hasPrivateNotesOnly
                      ? 'bg-amber-100 border-amber-300 text-amber-900'
                      : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'
                  }`}
                  title="僅顯示已記錄個人私密心得的食譜"
                >
                  <Lock className="w-3 h-3 text-amber-700" />
                  <span>有私房筆記</span>
                </button>
              </div>

              {/* Sort Selector */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-stone-500 flex items-center gap-1">
                  <ArrowUpDown className="w-3.5 h-3.5 text-stone-400" />
                  <span>排序：</span>
                </span>
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value as SortOption)}
                  className="px-3 py-1 rounded-xl border border-stone-200 bg-stone-50 text-xs font-semibold text-stone-800 focus:outline-none focus:border-amber-400 cursor-pointer"
                >
                  <option value="updated">🕒 最近更新</option>
                  <option value="rating">⭐ 最高美味評分</option>
                  <option value="time">⏳ 料理時間最短</option>
                  <option value="title">🔤 食譜名稱 A-Z</option>
                  <option value="created">📅 建立時間</option>
                </select>
              </div>
            </div>

            {/* Recipes Grid / List */}
            {filteredRecipes.length === 0 ? (
              /* Empty State */
              <div className="text-center py-16 px-4 bg-white rounded-3xl border border-stone-200 max-w-lg mx-auto shadow-xs">
                <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4 border border-amber-200/60">
                  <UtensilsCrossed className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-stone-900 mb-1">找不到相關食譜</h3>
                <p className="text-xs text-stone-500 mb-6 leading-relaxed">
                  {searchQuery || ratingFilter !== 'all' || hasPrivateNotesOnly
                    ? '查無符合條件的食譜，請嘗試放寬星等篩選或清除關鍵字。'
                    : '目前此分類尚無食譜，立即新增您的第一道私房料理吧！'}
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3">
                  {(searchQuery || ratingFilter !== 'all' || hasPrivateNotesOnly) && (
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setRatingFilter('all');
                        setHasPrivateNotesOnly(false);
                      }}
                      className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold text-xs transition-colors"
                    >
                      重置所有篩選
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setEditingRecipe(null);
                      setIsEditorOpen(true);
                    }}
                    className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs shadow-md shadow-amber-500/20 transition-transform active:scale-95"
                  >
                    + 新增食譜
                  </button>
                </div>
              </div>
            ) : (
              <div
                className={
                  viewMode === 'grid'
                    ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                    : 'space-y-3 max-w-4xl mx-auto'
                }
              >
                {filteredRecipes.map((recipe) => (
                  <RecipeCard
                    key={recipe.id}
                    recipe={recipe}
                    viewMode={viewMode}
                    onSelect={(r) => setSelectedRecipeId(r.id)}
                    onToggleFavorite={handleToggleFavorite}
                    onEdit={handleEditRecipe}
                    onDelete={handleDeleteRecipe}
                    onDuplicate={handleDuplicateRecipe}
                    onExport={handleOpenExport}
                    onShare={(r) => handleOpenShare(r)}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Floating Active Timer Widget (Persistent on all screens) */}
      <FloatingTimerWidget
        timers={timers}
        onOpenDrawer={() => setIsTimerDrawerOpen(true)}
        onDismissFinished={handleDismissFinishedTimers}
      />

      {/* Modals & Drawers */}
      {/* 1. Recipe Editor Modal */}
      {isEditorOpen && (
        <RecipeEditorModal
          initialRecipe={editingRecipe}
          categories={allCategories}
          onSave={handleSaveRecipe}
          onClose={() => {
            setIsEditorOpen(false);
            setEditingRecipe(null);
          }}
        />
      )}

      {/* 1b. Category Manager Modal */}
      <CategoryManagerModal
        isOpen={isCategoryManagerOpen}
        onClose={() => setIsCategoryManagerOpen(false)}
        categories={allCategories}
        onUpdateCategories={handleUpdateCategoriesList}
        recipes={recipes}
        onRenameCategoryInRecipes={handleRenameCategoryInRecipes}
        onDeleteCategoryInRecipes={handleDeleteCategoryInRecipes}
      />

      {/* 2. Timer Drawer */}
      <TimerDrawer
        isOpen={isTimerDrawerOpen}
        onClose={() => setIsTimerDrawerOpen(false)}
        timers={timers}
        onToggleTimer={handleToggleTimer}
        onResetTimer={handleResetTimer}
        onDeleteTimer={handleDeleteTimer}
        onAddSeconds={handleAddTimerSeconds}
        onCreateTimer={handleCreateTimer}
      />

      {/* 3. Kitchen Fullscreen Cooking Mode */}
      {isCookingModeOpen && cookingRecipe && (
        <CookingModeModal
          recipe={cookingRecipe}
          servings={cookingServings}
          onClose={() => {
            setIsCookingModeOpen(false);
            setCookingRecipe(null);
          }}
        />
      )}

      {/* 4. Google Drive Cloud Sync Modal */}
      <GoogleDriveModal
        isOpen={isDriveModalOpen}
        onClose={() => setIsDriveModalOpen(false)}
        driveStatus={driveStatus}
        onConnectDrive={handleConnectDrive}
        onDisconnectDrive={handleDisconnectDrive}
        onSyncNow={handleSyncToDriveNow}
        onRestoreNow={handleRestoreFromDriveNow}
        onToggleAutoSync={(enabled) => googleDriveService.setAutoSync(enabled)}
        recipes={recipes}
        onImportRecipes={handleImportRecipes}
      />

      {/* 5. Export Modal */}
      <ExportModal
        isOpen={isExportModalOpen}
        recipe={exportRecipe}
        allRecipes={recipes}
        currentServings={exportServings}
        onOpenDriveModal={() => {
          setIsExportModalOpen(false);
          setExportRecipe(null);
          setIsDriveModalOpen(true);
        }}
        onClose={() => {
          setIsExportModalOpen(false);
          setExportRecipe(null);
        }}
      />

      {/* 5b. Import Modal (RecipeNotes / JSON / Text) */}
      <ImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImportRecipes={handleImportRecipes}
        existingRecipes={recipes}
      />

      {/* 6. Recipe Share Modal */}
      {isShareModalOpen && shareRecipe && (
        <ShareModal
          isOpen={isShareModalOpen}
          recipe={shareRecipe}
          onClose={() => {
            setIsShareModalOpen(false);
            setShareRecipe(null);
          }}
        />
      )}
    </div>
  );
}
