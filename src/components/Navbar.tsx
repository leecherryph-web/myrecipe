import React from 'react';
import {
  UtensilsCrossed,
  Search,
  Plus,
  Cloud,
  CloudOff,
  RefreshCw,
  Timer,
  BookOpen,
  SlidersHorizontal,
  X,
  Upload,
  Heart,
  Settings2,
  Tag,
} from 'lucide-react';
import { GoogleDriveStatus, ViewMode } from '../types';

interface NavbarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  categories: string[];
  driveStatus: GoogleDriveStatus;
  onOpenDriveModal: () => void;
  onOpenNewRecipe: () => void;
  onOpenTimerDrawer: () => void;
  activeTimersCount: number;
  viewMode: ViewMode;
  onToggleViewMode: () => void;
  showFavoritesOnly: boolean;
  onToggleFavorites: () => void;
  onOpenImportModal: () => void;
  totalRecipesCount: number;
  onOpenCategoryManager: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onSelectCategory,
  categories,
  driveStatus,
  onOpenDriveModal,
  onOpenNewRecipe,
  onOpenTimerDrawer,
  activeTimersCount,
  viewMode,
  onToggleViewMode,
  showFavoritesOnly,
  onToggleFavorites,
  onOpenImportModal,
  totalRecipesCount,
  onOpenCategoryManager,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-stone-900 text-stone-100 shadow-md border-b border-stone-800 backdrop-blur-md bg-opacity-95">
      {/* Top Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 cursor-pointer select-none" onClick={() => onSelectCategory('全部')}>
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-stone-950 flex items-center justify-center shadow-lg shadow-amber-500/20">
              <UtensilsCrossed className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight text-white">食譜筆記</span>
                <span className="text-[10px] uppercase font-semibold tracking-wider px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  雲端同步版
                </span>
              </div>
              <p className="text-xs text-stone-400 hidden sm:block">專屬料理筆記 • 烹飪計時 • Drive 同步</p>
            </div>
          </div>

          {/* Search Bar (Medium & Large screens) */}
          <div className="hidden md:flex flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none" />
              <input
                id="search-input-desktop"
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="搜尋食譜名稱、食材、步驟、標籤..."
                className="w-full pl-10 pr-9 py-2 bg-stone-800/90 border border-stone-700 rounded-full text-sm text-stone-100 placeholder-stone-400 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-200"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            {/* Google Drive Status Button */}
            <button
              id="google-drive-sync-btn"
              onClick={onOpenDriveModal}
              title={
                driveStatus.isConnected
                  ? `Google Drive 已連線 (${driveStatus.userEmail || '已授權'})`
                  : 'Google Drive 雲端同步與備份 - 點擊登入'
              }
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all shadow-xs ${
                driveStatus.isConnected
                  ? 'bg-emerald-950/80 text-emerald-200 border border-emerald-500/60 hover:bg-emerald-900'
                  : 'bg-amber-500/20 text-amber-300 border border-amber-500/50 hover:bg-amber-500/30'
              }`}
            >
              {driveStatus.isSyncing ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-400" />
              ) : driveStatus.isConnected ? (
                <Cloud className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Cloud className="w-3.5 h-3.5 text-amber-400" />
              )}
              <span className="inline font-bold">
                {driveStatus.isSyncing
                  ? '同步中...'
                  : driveStatus.isConnected
                  ? 'Drive 已連線'
                  : 'Drive 雲端同步'}
              </span>
              {driveStatus.isConnected && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              )}
            </button>

            {/* Timer Drawer Button */}
            <button
              id="open-timers-btn"
              onClick={onOpenTimerDrawer}
              className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                activeTimersCount > 0
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 hover:bg-amber-500/30'
                  : 'bg-stone-800 text-stone-300 border-stone-700 hover:bg-stone-700'
              }`}
              title="開啟烹飪計時器"
            >
              <Timer className={`w-3.5 h-3.5 ${activeTimersCount > 0 ? 'text-amber-400 animate-pulse' : 'text-stone-400'}`} />
              <span className="hidden sm:inline">計時器</span>
              {activeTimersCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-amber-500 text-stone-950">
                  {activeTimersCount}
                </span>
              )}
            </button>

            {/* Favorites Toggle */}
            <button
              id="toggle-favorites-btn"
              onClick={onToggleFavorites}
              title={showFavoritesOnly ? '顯示全部食譜' : '僅顯示收藏食譜'}
              className={`p-2 rounded-full text-xs font-medium border transition-all ${
                showFavoritesOnly
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/50'
                  : 'bg-stone-800 text-stone-400 border-stone-700 hover:text-stone-200'
              }`}
            >
              <Heart className={`w-4 h-4 ${showFavoritesOnly ? 'fill-rose-400 text-rose-400' : ''}`} />
            </button>

            {/* View Mode Toggle (Desktop) */}
            <button
              id="toggle-view-mode-btn"
              onClick={onToggleViewMode}
              title={viewMode === 'grid' ? '切換為精簡清單檢視' : '切換為精美卡片檢視'}
              className="hidden lg:flex p-2 rounded-full bg-stone-800 text-stone-300 border border-stone-700 hover:bg-stone-700"
            >
              <SlidersHorizontal className="w-4 h-4 text-stone-400" />
            </button>

            {/* New Recipe Button */}
            <button
              id="create-recipe-btn"
              onClick={onOpenNewRecipe}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-amber-500 hover:bg-amber-400 text-stone-950 shadow-sm transition-all active:scale-95"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>新增食譜</span>
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden pb-3">
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none" />
            <input
              id="search-input-mobile"
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="搜尋食譜名稱、食材、標籤..."
              className="w-full pl-10 pr-9 py-2 bg-stone-800 border border-stone-700 rounded-full text-sm text-stone-100 placeholder-stone-400 focus:outline-none focus:border-amber-400"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-200"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Category Pills Bar */}
      <div className="border-t border-stone-800/80 bg-stone-950/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 flex-1 min-w-0">
              {categories.map((cat) => {
                const isActive = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => onSelectCategory(cat)}
                    className={`whitespace-nowrap px-3.5 py-1 rounded-full text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-amber-500 text-stone-950 font-semibold shadow-sm'
                        : 'bg-stone-800/80 text-stone-300 hover:bg-stone-700 hover:text-white border border-stone-700/50'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}

              {/* Edit / Manage Categories Button */}
              <button
                type="button"
                onClick={onOpenCategoryManager}
                title="自訂與編輯分類名稱"
                className="whitespace-nowrap px-2.5 py-1 rounded-full text-xs font-medium text-amber-400/90 hover:text-amber-300 hover:bg-amber-500/10 border border-dashed border-amber-500/40 flex items-center gap-1 transition-all shrink-0"
              >
                <Settings2 className="w-3.5 h-3.5" />
                <span>編輯分類</span>
              </button>
            </div>

            <div className="hidden sm:flex items-center text-xs text-stone-400 whitespace-nowrap pl-2 border-l border-stone-800">
              <span className="flex items-center gap-1">
                <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                共 {totalRecipesCount} 道食譜
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
