import React from 'react';
import {
  Clock,
  Users,
  ChefHat,
  Heart,
  Tag,
  ArrowRight,
  MoreVertical,
  Edit2,
  Trash2,
  Copy,
  Download,
  Share2,
  Lock,
  Star,
} from 'lucide-react';
import { Recipe, ViewMode } from '../types';
import { StarRating } from './StarRating';

interface RecipeCardProps {
  recipe: Recipe;
  viewMode: ViewMode;
  onSelect: (recipe: Recipe) => void;
  onToggleFavorite: (recipeId: string, e: React.MouseEvent) => void;
  onEdit: (recipe: Recipe, e: React.MouseEvent) => void;
  onDelete: (recipeId: string, e: React.MouseEvent) => void;
  onDuplicate: (recipe: Recipe, e: React.MouseEvent) => void;
  onExport: (recipe: Recipe, e: React.MouseEvent) => void;
  onShare?: (recipe: Recipe, e: React.MouseEvent) => void;
}

export const RecipeCard: React.FC<RecipeCardProps> = ({
  recipe,
  viewMode,
  onSelect,
  onToggleFavorite,
  onEdit,
  onDelete,
  onDuplicate,
  onExport,
  onShare,
}) => {
  const [showMenu, setShowMenu] = React.useState(false);
  const totalTime = (recipe.prepTime || 0) + (recipe.cookTime || 0);

  const difficultyColors = {
    簡單: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    中等: 'bg-amber-50 text-amber-700 border-amber-200',
    進階: 'bg-rose-50 text-rose-700 border-rose-200',
  };

  if (viewMode === 'compact') {
    return (
      <div
        id={`recipe-card-compact-${recipe.id}`}
        onClick={() => onSelect(recipe)}
        className="group relative bg-white border border-stone-200 rounded-xl p-3.5 hover:border-amber-400 hover:shadow-md transition-all cursor-pointer flex items-center justify-between gap-4"
      >
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0 bg-stone-100 border border-stone-200">
            <img
              src={recipe.coverImage || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80'}
              alt={recipe.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 border border-stone-200">
                {recipe.category}
              </span>
              <span
                className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${
                  difficultyColors[recipe.difficulty] || difficultyColors['簡單']
                }`}
              >
                {recipe.difficulty}
              </span>
              {recipe.rating && recipe.rating > 0 ? (
                <span className="flex items-center gap-0.5 text-[11px] font-bold px-1.5 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  {recipe.rating}.0
                </span>
              ) : null}
              {recipe.privateNotes && (
                <span className="flex items-center gap-0.5 text-[10px] font-semibold px-1.5 py-0.5 rounded bg-stone-100 text-stone-600 border border-stone-200" title="包含私房私密筆記">
                  <Lock className="w-2.5 h-2.5 text-stone-500" />
                  私房筆記
                </span>
              )}
            </div>
            <h3 className="font-bold text-stone-900 text-base group-hover:text-amber-600 transition-colors truncate">
              {recipe.title}
            </h3>
            <div className="flex items-center gap-3 text-xs text-stone-500 mt-1">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-stone-400" />
                約 {totalTime} 分鐘
              </span>
              <span className="flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-stone-400" />
                {recipe.servings} 人份
              </span>
              <span className="hidden sm:inline text-stone-400">• {recipe.ingredients.length} 種食材</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {onShare && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onShare(recipe, e);
              }}
              title="分享食譜"
              className="p-2 rounded-full text-stone-400 hover:text-amber-600 hover:bg-amber-50 transition-colors"
            >
              <Share2 className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={(e) => onToggleFavorite(recipe.id, e)}
            className={`p-2 rounded-full hover:bg-stone-100 transition-colors ${
              recipe.isFavorite ? 'text-rose-500' : 'text-stone-300 hover:text-stone-500'
            }`}
          >
            <Heart className={`w-4 h-4 ${recipe.isFavorite ? 'fill-rose-500' : ''}`} />
          </button>
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu(!showMenu);
              }}
              className="p-2 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100"
            >
              <MoreVertical className="w-4 h-4" />
            </button>
            {showMenu && (
              <div
                className="absolute right-0 top-full mt-1 w-36 bg-white rounded-lg shadow-xl border border-stone-200 py-1 z-20"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={(e) => {
                    setShowMenu(false);
                    onEdit(recipe, e);
                  }}
                  className="w-full px-3 py-1.5 text-xs text-left text-stone-700 hover:bg-stone-50 flex items-center gap-2"
                >
                  <Edit2 className="w-3.5 h-3.5" /> 編輯食譜
                </button>
                {onShare && (
                  <button
                    onClick={(e) => {
                      setShowMenu(false);
                      onShare(recipe, e);
                    }}
                    className="w-full px-3 py-1.5 text-xs text-left text-stone-700 hover:bg-stone-50 flex items-center gap-2"
                  >
                    <Share2 className="w-3.5 h-3.5" /> 分享食譜
                  </button>
                )}
                <button
                  onClick={(e) => {
                    setShowMenu(false);
                    onDuplicate(recipe, e);
                  }}
                  className="w-full px-3 py-1.5 text-xs text-left text-stone-700 hover:bg-stone-50 flex items-center gap-2"
                >
                  <Copy className="w-3.5 h-3.5" /> 複製副本
                </button>
                <button
                  onClick={(e) => {
                    setShowMenu(false);
                    onExport(recipe, e);
                  }}
                  className="w-full px-3 py-1.5 text-xs text-left text-stone-700 hover:bg-stone-50 flex items-center gap-2"
                >
                  <Download className="w-3.5 h-3.5" /> 匯出食譜
                </button>
                <div className="border-t border-stone-100 my-1"></div>
                <button
                  onClick={(e) => {
                    setShowMenu(false);
                    onDelete(recipe.id, e);
                  }}
                  className="w-full px-3 py-1.5 text-xs text-left text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                >
                  <Trash2 className="w-3.5 h-3.5" /> 刪除食譜
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Standard Grid View Card
  return (
    <div
      id={`recipe-card-${recipe.id}`}
      onClick={() => onSelect(recipe)}
      className="group relative bg-white border border-stone-200/80 rounded-2xl overflow-hidden hover:border-amber-400 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 cursor-pointer flex flex-col justify-between"
    >
      {/* Top Image Thumbnail */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-stone-100">
        <img
          src={recipe.coverImage || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80'}
          alt={recipe.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            (e.target as HTMLElement).style.display = 'none';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-stone-950/20 to-transparent opacity-85 group-hover:opacity-95 transition-opacity" />

        {/* Category & Difficulty Badges */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 z-10 flex-wrap">
          <span className="text-xs font-semibold px-2.5 py-0.8 rounded-full bg-stone-900/80 text-white backdrop-blur-md border border-stone-700/50">
            {recipe.category}
          </span>
          <span
            className={`text-xs font-semibold px-2.5 py-0.8 rounded-full backdrop-blur-md border ${
              recipe.difficulty === '簡單'
                ? 'bg-emerald-950/80 text-emerald-300 border-emerald-600/50'
                : recipe.difficulty === '中等'
                ? 'bg-amber-950/80 text-amber-300 border-amber-600/50'
                : 'bg-rose-950/80 text-rose-300 border-rose-600/50'
            }`}
          >
            {recipe.difficulty}
          </span>
        </div>

        {/* Favorite & Quick Share Actions */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
          {onShare && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onShare(recipe, e);
              }}
              className="w-8 h-8 rounded-full bg-stone-900/70 hover:bg-amber-500 hover:text-stone-950 text-white backdrop-blur-md flex items-center justify-center transition-all active:scale-90"
              title="分享這道食譜"
            >
              <Share2 className="w-3.5 h-3.5" />
            </button>
          )}
          <button
            onClick={(e) => onToggleFavorite(recipe.id, e)}
            className="w-8 h-8 rounded-full bg-stone-900/70 hover:bg-stone-900 text-white backdrop-blur-md flex items-center justify-center transition-transform active:scale-90"
            title={recipe.isFavorite ? '取消收藏' : '加入我的最愛'}
          >
            <Heart
              className={`w-4 h-4 ${
                recipe.isFavorite ? 'fill-rose-500 text-rose-500' : 'text-stone-200 hover:text-rose-400'
              }`}
            />
          </button>
        </div>

        {/* Bottom Rating, Time & Servings Overlay */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white/95 font-medium z-10">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 bg-stone-900/70 backdrop-blur-sm px-2 py-0.5 rounded-md border border-stone-700/40">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              {totalTime} 分鐘
            </span>
            <span className="flex items-center gap-1 bg-stone-900/70 backdrop-blur-sm px-2 py-0.5 rounded-md border border-stone-700/40">
              <Users className="w-3.5 h-3.5 text-amber-400" />
              {recipe.servings} 人份
            </span>
          </div>

          {recipe.rating && recipe.rating > 0 ? (
            <span className="flex items-center gap-1 bg-amber-500/90 text-stone-950 font-bold px-2 py-0.5 rounded-md shadow-sm">
              <Star className="w-3.5 h-3.5 fill-stone-950" />
              {recipe.rating}.0
            </span>
          ) : null}
        </div>
      </div>

      {/* Card Body Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="font-bold text-stone-900 text-lg group-hover:text-amber-600 transition-colors line-clamp-1">
              {recipe.title}
            </h3>
            {recipe.privateNotes && (
              <span
                className="shrink-0 flex items-center gap-0.5 text-[10px] font-semibold px-1.5 py-0.5 rounded bg-stone-100 text-stone-600 border border-stone-200"
                title="已紀錄私房筆記"
              >
                <Lock className="w-2.5 h-2.5 text-stone-500" />
                私房筆記
              </span>
            )}
          </div>

          <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed mb-3">
            {recipe.description || '這道料理暫無簡介，點擊查看詳細食材與烹飪步驟。'}
          </p>

          {/* Ingredient Highlights */}
          <div className="flex flex-wrap gap-1.5 mb-3">
            {recipe.ingredients.slice(0, 3).map((ing) => (
              <span
                key={ing.id}
                className="text-[11px] px-2 py-0.5 rounded-md bg-stone-100 text-stone-600 font-medium border border-stone-200/60"
              >
                {ing.name}
              </span>
            ))}
            {recipe.ingredients.length > 3 && (
              <span className="text-[11px] px-1.5 py-0.5 rounded-md bg-stone-50 text-stone-400 font-medium">
                +{recipe.ingredients.length - 3}
              </span>
            )}
          </div>
        </div>

        {/* Card Footer Actions */}
        <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[11px] text-stone-400 font-medium">
            <ChefHat className="w-3.5 h-3.5 text-amber-500" />
            <span>{recipe.steps.length} 個步驟</span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu(!showMenu);
              }}
              className="p-1.5 rounded-md text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
              title="更多選項"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {showMenu && (
              <div
                className="absolute right-3 bottom-12 w-36 bg-white rounded-xl shadow-xl border border-stone-200 py-1.5 z-30"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={(e) => {
                    setShowMenu(false);
                    onEdit(recipe, e);
                  }}
                  className="w-full px-3 py-1.5 text-xs text-left text-stone-700 hover:bg-stone-50 flex items-center gap-2"
                >
                  <Edit2 className="w-3.5 h-3.5 text-stone-400" /> 編輯食譜
                </button>
                {onShare && (
                  <button
                    onClick={(e) => {
                      setShowMenu(false);
                      onShare(recipe, e);
                    }}
                    className="w-full px-3 py-1.5 text-xs text-left text-stone-700 hover:bg-stone-50 flex items-center gap-2"
                  >
                    <Share2 className="w-3.5 h-3.5 text-stone-400" /> 分享食譜
                  </button>
                )}
                <button
                  onClick={(e) => {
                    setShowMenu(false);
                    onDuplicate(recipe, e);
                  }}
                  className="w-full px-3 py-1.5 text-xs text-left text-stone-700 hover:bg-stone-50 flex items-center gap-2"
                >
                  <Copy className="w-3.5 h-3.5 text-stone-400" /> 複製食譜
                </button>
                <button
                  onClick={(e) => {
                    setShowMenu(false);
                    onExport(recipe, e);
                  }}
                  className="w-full px-3 py-1.5 text-xs text-left text-stone-700 hover:bg-stone-50 flex items-center gap-2"
                >
                  <Download className="w-3.5 h-3.5 text-stone-400" /> 匯出分享
                </button>
                <div className="border-t border-stone-100 my-1"></div>
                <button
                  onClick={(e) => {
                    setShowMenu(false);
                    onDelete(recipe.id, e);
                  }}
                  className="w-full px-3 py-1.5 text-xs text-left text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                >
                  <Trash2 className="w-3.5 h-3.5 text-rose-500" /> 刪除食譜
                </button>
              </div>
            )}

            <button
              onClick={() => onSelect(recipe)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-50 text-amber-700 hover:bg-amber-100 transition-colors"
            >
              <span>查看</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

