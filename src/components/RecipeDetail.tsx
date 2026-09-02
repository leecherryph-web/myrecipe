import React, { useState } from 'react';
import {
  ArrowLeft,
  Clock,
  Users,
  ChefHat,
  Heart,
  Edit,
  Trash2,
  Share2,
  Play,
  Timer,
  CheckCircle2,
  Circle,
  Copy,
  Printer,
  Sparkles,
  Flame,
  Lightbulb,
  Check,
  Plus,
  Minus,
  Star,
  Lock,
  Camera,
  Maximize2,
  X,
  Upload,
  Save,
} from 'lucide-react';
import { Recipe } from '../types';
import { StarRating } from './StarRating';
import { ImageService } from '../services/imageService';

interface RecipeDetailProps {
  recipe: Recipe;
  onBack: () => void;
  onEdit: (recipe: Recipe) => void;
  onDelete: (recipeId: string) => void;
  onToggleFavorite: (recipeId: string) => void;
  onOpenCookingMode: (recipe: Recipe, currentServings: number) => void;
  onStartTimer: (name: string, totalSeconds: number, recipeId?: string, stepNumber?: number) => void;
  onOpenExport: (recipe: Recipe, servings: number) => void;
  onShare: (recipe: Recipe) => void;
  onUpdateRecipe?: (updated: Recipe) => void;
}

export const RecipeDetail: React.FC<RecipeDetailProps> = ({
  recipe,
  onBack,
  onEdit,
  onDelete,
  onToggleFavorite,
  onOpenCookingMode,
  onStartTimer,
  onOpenExport,
  onShare,
  onUpdateRecipe,
}) => {
  const [currentServings, setCurrentServings] = useState<number>(recipe.servings || 2);
  const [checkedIngredients, setCheckedIngredients] = useState<{ [id: string]: boolean }>({});
  const [completedSteps, setCompletedSteps] = useState<{ [id: string]: boolean }>({});
  const [copiedNotification, setCopiedNotification] = useState(false);
  const [lightboxImage, setLightboxImage] = useState<{ url: string; title: string } | null>(null);
  const [isEditingPrivateNotes, setIsEditingPrivateNotes] = useState(false);
  const [privateNotesText, setPrivateNotesText] = useState(recipe.privateNotes || '');
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [uploadingStepIndex, setUploadingStepIndex] = useState<number | null>(null);

  const baseServings = recipe.servings || 1;
  const multiplier = currentServings / baseServings;

  const toggleIngredient = (id: string) => {
    setCheckedIngredients((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleStep = (id: string) => {
    setCompletedSteps((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleRatingChange = (newRating: number) => {
    if (onUpdateRecipe) {
      onUpdateRecipe({
        ...recipe,
        rating: newRating,
        updatedAt: Date.now(),
      });
    }
  };

  const handleSavePrivateNotes = () => {
    if (onUpdateRecipe) {
      onUpdateRecipe({
        ...recipe,
        privateNotes: privateNotesText.trim() || undefined,
        updatedAt: Date.now(),
      });
    }
    setIsEditingPrivateNotes(false);
  };

  const handleQuickImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploadingImage(true);
      const compressedDataUrl = await ImageService.compressImageFile(file, {
        maxWidth: 1400,
        maxHeight: 1400,
        quality: 0.85,
      });

      if (onUpdateRecipe) {
        onUpdateRecipe({
          ...recipe,
          coverImage: compressedDataUrl,
          updatedAt: Date.now(),
        });
      }
    } catch (err) {
      alert(`圖片上傳失敗：${err instanceof Error ? err.message : '請檢查圖片格式'}`);
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleCopyIngredients = () => {
    const lines = [`【${recipe.title}】備料清單（${currentServings}人份）：`];
    recipe.ingredients.forEach((ing) => {
      let amtStr = '';
      if (typeof ing.amount === 'number') {
        const scaled = ing.amount * multiplier;
        const formatted = Number.isInteger(scaled) ? scaled.toString() : (Math.round(scaled * 10) / 10).toString();
        amtStr = `${formatted} ${ing.unit}`;
      } else {
        amtStr = `${ing.amount || ''} ${ing.unit}`;
      }
      lines.push(`• ${ing.name}：${amtStr.trim()}${ing.notes ? ` (${ing.notes})` : ''}`);
    });
    navigator.clipboard.writeText(lines.join('\n'));
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 2000);
  };

  // Group ingredients by section
  const ingredientGroups: { [group: string]: typeof recipe.ingredients } = {};
  recipe.ingredients.forEach((ing) => {
    const groupName = ing.group || '主要食材';
    if (!ingredientGroups[groupName]) {
      ingredientGroups[groupName] = [];
    }
    ingredientGroups[groupName].push(ing);
  });

  const totalMinutes = (recipe.prepTime || 0) + (recipe.cookTime || 0);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 pb-24">
      {/* Top Breadcrumb & Action Bar */}
      <div className="flex items-center justify-between gap-4 mb-6 no-print">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-stone-600 hover:text-stone-900 hover:bg-stone-200/70 font-medium text-sm transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>返回食譜列表</span>
        </button>

        <div className="flex items-center gap-2">
          {/* Share Button */}
          <button
            onClick={() => onShare(recipe)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold shadow-sm transition-all active:scale-95"
            title="生成專屬分享連結、LINE 文字或 QR Code"
          >
            <Share2 className="w-4 h-4 stroke-[2.5]" />
            <span>分享食譜</span>
          </button>

          {/* Favorite */}
          <button
            onClick={() => onToggleFavorite(recipe.id)}
            className={`p-2.5 rounded-xl border transition-all ${
              recipe.isFavorite
                ? 'bg-rose-50 border-rose-200 text-rose-600'
                : 'bg-white border-stone-200 text-stone-500 hover:text-stone-800'
            }`}
            title={recipe.isFavorite ? '已加入收藏' : '加入收藏'}
          >
            <Heart className={`w-4 h-4 ${recipe.isFavorite ? 'fill-rose-600' : ''}`} />
          </button>

          {/* Export options */}
          <button
            onClick={() => onOpenExport(recipe, currentServings)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-stone-200 text-stone-700 hover:bg-stone-50 text-xs font-semibold shadow-sm transition-colors"
            title="匯出 Markdown / PDF / JSON"
          >
            <span className="hidden sm:inline">更多匯出</span>
          </button>

          {/* Edit */}
          <button
            onClick={() => onEdit(recipe)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-stone-200 text-stone-700 hover:bg-stone-50 text-xs font-semibold shadow-sm transition-colors"
          >
            <Edit className="w-3.5 h-3.5 text-stone-500" />
            <span className="hidden sm:inline">編輯</span>
          </button>

          {/* Delete */}
          <button
            onClick={() => {
              if (window.confirm(`確定要刪除食譜「${recipe.title}」嗎？`)) {
                onDelete(recipe.id);
              }
            }}
            className="p-2.5 rounded-xl bg-white border border-stone-200 text-stone-400 hover:text-rose-600 hover:border-rose-200 hover:bg-rose-50 transition-colors"
            title="刪除食譜"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Hero Visual Card */}
      <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-sm mb-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-0">
          {/* Cover Image with Prominent Display & Upload trigger */}
          <div className="md:col-span-5 relative aspect-[4/3] md:aspect-auto overflow-hidden bg-stone-100 min-h-[300px] group">
            <img
              src={recipe.coverImage || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1200&q=80'}
              alt={recipe.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500 cursor-pointer"
              onClick={() =>
                setLightboxImage({
                  url:
                    recipe.coverImage ||
                    'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1200&q=80',
                  title: recipe.title,
                })
              }
            />

            {/* Badges on top */}
            <div className="absolute top-4 left-4 flex gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-stone-900/80 text-white backdrop-blur-md">
                {recipe.category}
              </span>
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-md ${
                  recipe.difficulty === '簡單'
                    ? 'bg-emerald-950/80 text-emerald-300'
                    : recipe.difficulty === '中等'
                    ? 'bg-amber-950/80 text-amber-300'
                    : 'bg-rose-950/80 text-rose-300'
                }`}
              >
                {recipe.difficulty}
              </span>
            </div>

            {/* Zoom / Lightbox button */}
            <button
              onClick={() =>
                setLightboxImage({
                  url:
                    recipe.coverImage ||
                    'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1200&q=80',
                  title: recipe.title,
                })
              }
              className="absolute top-4 right-4 p-2 rounded-full bg-stone-900/60 hover:bg-stone-900 text-white backdrop-blur-md transition-transform active:scale-95"
              title="點擊全螢幕放大查看照片"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>

            {/* Change/Upload Cover Image Overlay */}
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between z-10">
              <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-stone-900/80 hover:bg-stone-900 text-white text-xs font-medium backdrop-blur-md cursor-pointer border border-stone-700/50 shadow-md transition-all">
                <Camera className="w-3.5 h-3.5 text-amber-400" />
                <span>{isUploadingImage ? '壓縮上傳中...' : '更換料理照片'}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleQuickImageUpload}
                  disabled={isUploadingImage}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Details & Fast Actions */}
          <div className="md:col-span-7 p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <div className="flex flex-wrap items-center gap-1.5">
                  {recipe.tags &&
                    recipe.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 font-medium border border-amber-200/60"
                      >
                        #{tag}
                      </span>
                    ))}
                </div>

                {recipe.source && (
                  <span className="text-xs text-stone-400 font-medium">
                    來源：{recipe.source}
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight mb-3">
                {recipe.title}
              </h1>

              {/* Star Rating Section */}
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-amber-50/50 border border-amber-200/60 mb-4">
                <span className="text-xs font-bold text-amber-900 flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                  美味評分：
                </span>
                <StarRating
                  rating={recipe.rating || 0}
                  onChange={handleRatingChange}
                  size="md"
                  showLabel
                  showScore
                />
              </div>

              {recipe.description && (
                <p className="text-sm text-stone-600 leading-relaxed mb-6">
                  {recipe.description}
                </p>
              )}

              {/* Cooking Metrics Bar */}
              <div className="grid grid-cols-3 gap-3 p-3.5 rounded-2xl bg-stone-50 border border-stone-100 mb-6 text-center">
                <div>
                  <div className="text-stone-400 text-xs flex items-center justify-center gap-1 mb-1">
                    <Clock className="w-3.5 h-3.5" /> 準備時間
                  </div>
                  <div className="font-bold text-stone-800 text-base">{recipe.prepTime || 0} <span className="text-xs font-normal">分鐘</span></div>
                </div>
                <div className="border-x border-stone-200">
                  <div className="text-stone-400 text-xs flex items-center justify-center gap-1 mb-1">
                    <Flame className="w-3.5 h-3.5 text-amber-500" /> 烹飪時間
                  </div>
                  <div className="font-bold text-stone-800 text-base">{recipe.cookTime || 0} <span className="text-xs font-normal">分鐘</span></div>
                </div>
                <div>
                  <div className="text-stone-400 text-xs flex items-center justify-center gap-1 mb-1">
                    <ChefHat className="w-3.5 h-3.5 text-stone-500" /> 總計用時
                  </div>
                  <div className="font-bold text-stone-800 text-base">{totalMinutes} <span className="text-xs font-normal">分鐘</span></div>
                </div>
              </div>
            </div>

            {/* Launch Fullscreen Kitchen Cooking Mode */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <button
                id="start-cooking-mode-btn"
                onClick={() => onOpenCookingMode(recipe, currentServings)}
                className="w-full sm:flex-1 py-3 px-5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-sm shadow-md shadow-amber-500/20 flex items-center justify-center gap-2 transition-all active:scale-98"
              >
                <Play className="w-4 h-4 fill-stone-950" />
                <span>進入廚房烹飪專注模式</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Recipe Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Ingredients Checklist (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-sm sticky top-24">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
                  <span>食材備料清單</span>
                  <span className="text-xs font-normal text-stone-400">
                    ({recipe.ingredients.length} 項)
                  </span>
                </h2>
                <p className="text-xs text-stone-500 mt-0.5">點擊食材可即時劃掉確認備料</p>
              </div>

              <button
                onClick={handleCopyIngredients}
                className="flex items-center gap-1 text-xs text-stone-500 hover:text-amber-600 bg-stone-50 hover:bg-amber-50 px-2.5 py-1.5 rounded-lg border border-stone-200 transition-colors"
                title="複製食材清單至剪貼簿（方便採買）"
              >
                {copiedNotification ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-600 font-semibold">已複製！</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>複製清單</span>
                  </>
                )}
              </button>
            </div>

            {/* Serving Size Multiplier Selector */}
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/80 mb-5">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-amber-700" />
                <span className="text-xs font-semibold text-amber-900">料理份量調整</span>
              </div>

              <div className="flex items-center gap-2 bg-white px-2 py-1 rounded-xl border border-amber-200 shadow-xs">
                <button
                  onClick={() => setCurrentServings((s) => Math.max(1, s - 1))}
                  className="w-7 h-7 rounded-lg bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-700 font-bold transition-colors"
                  disabled={currentServings <= 1}
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="font-bold text-sm text-stone-900 w-14 text-center">
                  {currentServings} 人份
                </span>
                <button
                  onClick={() => setCurrentServings((s) => s + 1)}
                  className="w-7 h-7 rounded-lg bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-700 font-bold transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {multiplier !== 1 && (
              <div className="text-[11px] text-amber-700 bg-amber-50/40 px-3 py-1.5 rounded-lg border border-amber-100 mb-4 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span>食材用量已自動依 {multiplier.toFixed(2)} 倍比例重新計算</span>
              </div>
            )}

            {/* Grouped Ingredients */}
            <div className="space-y-5">
              {Object.entries(ingredientGroups).map(([groupName, items]) => (
                <div key={groupName} className="space-y-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400 flex items-center gap-2">
                    <span>{groupName}</span>
                    <div className="flex-1 h-px bg-stone-100"></div>
                  </h3>
                  <div className="divide-y divide-stone-100">
                    {items.map((ing) => {
                      const isChecked = checkedIngredients[ing.id];
                      let calculatedAmount = '';
                      if (typeof ing.amount === 'number') {
                        const scaled = ing.amount * multiplier;
                        calculatedAmount = Number.isInteger(scaled)
                          ? scaled.toString()
                          : (Math.round(scaled * 10) / 10).toString();
                      } else if (ing.amount) {
                        calculatedAmount = ing.amount.toString();
                      }

                      return (
                        <div
                          key={ing.id}
                          onClick={() => toggleIngredient(ing.id)}
                          className={`py-2.5 px-2 rounded-xl flex items-start justify-between gap-3 cursor-pointer select-none transition-colors ${
                            isChecked ? 'bg-stone-50/80 text-stone-400' : 'hover:bg-amber-50/40 text-stone-800'
                          }`}
                        >
                          <div className="flex items-start gap-2.5">
                            <div className="mt-0.5 text-amber-600">
                              {isChecked ? (
                                <CheckCircle2 className="w-4 h-4 fill-emerald-500 text-white" />
                              ) : (
                                <Circle className="w-4 h-4 text-stone-300" />
                              )}
                            </div>
                            <div>
                              <span className={`text-sm font-medium ${isChecked ? 'line-through' : ''}`}>
                                {ing.name}
                              </span>
                              {ing.notes && (
                                <span className="block text-xs text-stone-400 mt-0.5">
                                  {ing.notes}
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="text-right shrink-0">
                            <span
                              className={`text-sm font-bold ${
                                isChecked ? 'line-through text-stone-400' : 'text-stone-900'
                              }`}
                            >
                              {calculatedAmount} {ing.unit}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Cooking Steps, Private Notes, & Public Notes (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Private Notes Section (私房備忘筆記) */}
          <div className="bg-gradient-to-br from-amber-50/70 to-stone-50 rounded-3xl border border-amber-200/80 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-800 flex items-center justify-center">
                  <Lock className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-stone-900">
                    我的私房私密筆記
                  </h3>
                  <p className="text-[11px] text-stone-500">
                    記錄個人的試煮調味微調、食材替代或私房心得 (支援雲端安全備份)
                  </p>
                </div>
              </div>

              {!isEditingPrivateNotes ? (
                <button
                  onClick={() => setIsEditingPrivateNotes(true)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white border border-stone-200 hover:bg-amber-50 text-stone-700 shadow-xs"
                >
                  <Edit className="w-3.5 h-3.5 text-stone-500" />
                  <span>{recipe.privateNotes ? '編輯筆記' : '+ 填寫私房心得'}</span>
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setPrivateNotesText(recipe.privateNotes || '');
                      setIsEditingPrivateNotes(false);
                    }}
                    className="px-2.5 py-1 text-xs text-stone-500 hover:text-stone-700"
                  >
                    取消
                  </button>
                  <button
                    onClick={handleSavePrivateNotes}
                    className="flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-bold bg-amber-500 hover:bg-amber-400 text-stone-950 shadow-xs"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>儲存</span>
                  </button>
                </div>
              )}
            </div>

            {isEditingPrivateNotes ? (
              <div className="space-y-2 mt-3">
                <textarea
                  rows={3}
                  value={privateNotesText}
                  onChange={(e) => setPrivateNotesText(e.target.value)}
                  placeholder="例如：下次起鍋前可以多灑點黑胡椒；家裡人口味偏淡，醬油少半匙剛剛好..."
                  className="w-full p-3 bg-white border border-amber-300 rounded-xl text-xs sm:text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20 leading-relaxed"
                  autoFocus
                />
              </div>
            ) : (
              <div className="text-xs sm:text-sm text-stone-700 leading-relaxed bg-white/80 p-3.5 rounded-2xl border border-amber-100">
                {recipe.privateNotes ? (
                  <p className="whitespace-pre-line">{recipe.privateNotes}</p>
                ) : (
                  <p className="text-stone-400 italic">
                    尚未留下私房筆記。點擊右上角「+ 填寫私房心得」隨時記錄您的料理改良靈感！
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Steps Card */}
          <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-stone-900">料理步驟</h2>
                <p className="text-xs text-stone-500 mt-0.5">照著步驟依序烹調，可直接點擊啟動該步驟計時器</p>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-stone-100 text-stone-600 border border-stone-200">
                共 {recipe.steps.length} 個步驟
              </span>
            </div>

            <div className="space-y-6">
              {recipe.steps.map((step, idx) => {
                const isStepDone = completedSteps[step.id];
                const timerTotalSecs = (step.timerMinutes || 0) * 60 + (step.timerSeconds || 0);

                return (
                  <div
                    key={step.id || idx}
                    className={`relative p-5 rounded-2xl border transition-all ${
                      isStepDone
                        ? 'bg-stone-50/60 border-stone-200/80 opacity-75'
                        : 'bg-white border-stone-200 hover:border-amber-300 hover:shadow-xs'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      {/* Step Number & Checkbox */}
                      <button
                        onClick={() => toggleStep(step.id)}
                        className={`w-8 h-8 rounded-xl shrink-0 flex items-center justify-center font-bold text-sm transition-all ${
                          isStepDone
                            ? 'bg-emerald-500 text-white'
                            : 'bg-stone-900 text-white hover:bg-amber-500 hover:text-stone-950'
                        }`}
                        title={isStepDone ? '標記為未完成' : '標記此步驟已完成'}
                      >
                        {isStepDone ? <Check className="w-4 h-4" /> : idx + 1}
                      </button>

                      {/* Step Instruction */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1.5">
                          {step.title ? (
                            <h3
                              className={`text-base font-bold ${
                                isStepDone ? 'line-through text-stone-400' : 'text-stone-900'
                              }`}
                            >
                              {step.title}
                            </h3>
                          ) : (
                            <div></div>
                          )}

                          {/* Quick Step Photo Upload Trigger */}
                          {onUpdateRecipe && (
                            <div className="shrink-0 flex items-center gap-1">
                              <label
                                className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                                  step.image
                                    ? 'text-stone-400 hover:text-stone-700 hover:bg-stone-100'
                                    : 'text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200/80'
                                }`}
                                title={step.image ? '更換此步驟照片' : '上傳此步驟照片'}
                              >
                                <Camera className="w-3.5 h-3.5 text-amber-600" />
                                <span className="hidden sm:inline">
                                  {uploadingStepIndex === idx
                                    ? '處理中...'
                                    : step.image
                                    ? '更換照片'
                                    : '加入照片'}
                                </span>
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  disabled={uploadingStepIndex === idx}
                                  onChange={async (e) => {
                                    const file = e.target.files?.[0];
                                    if (!file) return;
                                    try {
                                      setUploadingStepIndex(idx);
                                      const compressed = await ImageService.compressImageFile(file, {
                                        maxWidth: 1280,
                                        maxHeight: 1280,
                                        quality: 0.82,
                                      });
                                      const updatedSteps = [...recipe.steps];
                                      updatedSteps[idx] = { ...updatedSteps[idx], image: compressed };
                                      onUpdateRecipe({
                                        ...recipe,
                                        steps: updatedSteps,
                                        updatedAt: Date.now(),
                                      });
                                    } catch (err) {
                                      alert(`步驟照片處理失敗：${err instanceof Error ? err.message : '請重試'}`);
                                    } finally {
                                      setUploadingStepIndex(null);
                                    }
                                  }}
                                />
                              </label>
                            </div>
                          )}
                        </div>

                        <p
                          className={`text-sm leading-relaxed ${
                            isStepDone ? 'text-stone-400 line-through' : 'text-stone-700'
                          }`}
                        >
                          {step.instruction}
                        </p>

                        {/* Step Photo Display */}
                        {step.image && (
                          <div className="mt-3.5">
                            <div
                              onClick={() =>
                                setLightboxImage({
                                  url: step.image!,
                                  title: `${recipe.title} - 步驟 ${idx + 1}${
                                    step.title ? `：${step.title}` : ''
                                  }`,
                                })
                              }
                              className="relative inline-block rounded-2xl overflow-hidden border border-stone-200 bg-stone-100 shadow-xs cursor-pointer group max-w-sm sm:max-w-md"
                            >
                              <img
                                src={step.image}
                                alt={step.title || `步驟 ${idx + 1} 照片`}
                                referrerPolicy="no-referrer"
                                className="w-full max-h-64 sm:max-h-72 object-cover group-hover:scale-102 transition-transform duration-300"
                              />
                              <div className="absolute inset-0 bg-stone-950/0 group-hover:bg-stone-950/25 transition-colors flex items-center justify-center">
                                <span className="opacity-0 group-hover:opacity-100 transition-opacity px-3 py-1.5 rounded-xl bg-stone-900/80 text-white text-xs font-semibold backdrop-blur-xs flex items-center gap-1.5 shadow-md">
                                  <Maximize2 className="w-3.5 h-3.5" />
                                  <span>點擊放大照片</span>
                                </span>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Chef Tip */}
                        {step.tip && (
                          <div className="mt-3 flex items-start gap-2 text-xs text-amber-800 bg-amber-50/80 p-3 rounded-xl border border-amber-200/60">
                            <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                            <span className="leading-relaxed">
                              <strong>主廚小撇步：</strong>{step.tip}
                            </span>
                          </div>
                        )}

                        {/* Step Timer Quick Action */}
                        {timerTotalSecs > 0 && (
                          <div className="mt-3 pt-3 border-t border-stone-100 flex items-center justify-between">
                            <div className="flex items-center gap-1.5 text-xs text-stone-500">
                              <Timer className="w-3.5 h-3.5 text-amber-500" />
                              <span>預估時間：</span>
                              <span className="font-semibold text-stone-800">
                                {step.timerMinutes ? `${step.timerMinutes} 分鐘 ` : ''}
                                {step.timerSeconds ? `${step.timerSeconds} 秒` : ''}
                              </span>
                            </div>

                            <button
                              onClick={() =>
                                onStartTimer(
                                  `${recipe.title} - 步驟 ${idx + 1}`,
                                  timerTotalSecs,
                                  recipe.id,
                                  idx + 1
                                )
                              }
                              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-500 hover:bg-amber-400 text-stone-950 shadow-xs transition-transform active:scale-95"
                            >
                              <Play className="w-3 h-3 fill-stone-950" />
                              <span>啟動計時</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Chef Notes Card */}
          {recipe.notes && (
            <div className="bg-stone-50 rounded-3xl border border-stone-200 p-6">
              <h3 className="text-sm font-bold text-stone-900 mb-2 flex items-center gap-2">
                <ChefHat className="w-4 h-4 text-amber-600" />
                <span>主廚公開備註與搭配建議</span>
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed whitespace-pre-line">
                {recipe.notes}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Image Lightbox Modal */}
      {lightboxImage && (
        <div
          className="fixed inset-0 z-50 bg-stone-950/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setLightboxImage(null)}
        >
          <div
            className="relative max-w-4xl w-full max-h-[90vh] flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setLightboxImage(null)}
              className="absolute top-2 right-2 p-2 rounded-full bg-stone-800/80 text-white hover:bg-stone-700 transition-colors z-10"
              title="關閉"
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={lightboxImage.url}
              alt={lightboxImage.title}
              className="max-h-[80vh] w-auto max-w-full rounded-2xl object-contain shadow-2xl border border-stone-800"
            />
            <p className="text-stone-300 text-sm font-semibold mt-3 text-center">
              {lightboxImage.title}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
