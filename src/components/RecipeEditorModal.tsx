import React, { useState } from 'react';
import {
  X,
  Plus,
  Trash2,
  Image as ImageIcon,
  Clock,
  Users,
  ChefHat,
  Tag,
  Upload,
  ArrowUp,
  ArrowDown,
  Sparkles,
  Save,
  Check,
  Star,
  Lock,
  Camera,
  Link,
  RefreshCw,
} from 'lucide-react';
import { Difficulty, IngredientItem, Recipe, RecipeStep } from '../types';
import { PRESET_CATEGORIES, PRESET_IMAGES } from '../data/initialRecipes';
import { StarRating } from './StarRating';
import { ImageService } from '../services/imageService';

interface RecipeEditorModalProps {
  initialRecipe?: Recipe | null;
  categories?: string[];
  onSave: (recipe: Recipe) => void;
  onClose: () => void;
}

export const RecipeEditorModal: React.FC<RecipeEditorModalProps> = ({
  initialRecipe,
  categories = PRESET_CATEGORIES,
  onSave,
  onClose,
}) => {
  const isEditing = Boolean(initialRecipe);

  const [title, setTitle] = useState(initialRecipe?.title || '');
  const [description, setDescription] = useState(initialRecipe?.description || '');
  const [category, setCategory] = useState(initialRecipe?.category || '家常料理');
  const [customCategory, setCustomCategory] = useState('');
  const [tagsInput, setTagsInput] = useState(initialRecipe?.tags?.join(', ') || '');
  const [servings, setServings] = useState<number>(initialRecipe?.servings || 2);
  const [prepTime, setPrepTime] = useState<number>(initialRecipe?.prepTime || 15);
  const [cookTime, setCookTime] = useState<number>(initialRecipe?.cookTime || 20);
  const [difficulty, setDifficulty] = useState<Difficulty>(initialRecipe?.difficulty || '簡單');
  const [rating, setRating] = useState<number>(initialRecipe?.rating || 5);
  const [coverImage, setCoverImage] = useState(
    initialRecipe?.coverImage || PRESET_IMAGES[0].url
  );
  const [notes, setNotes] = useState(initialRecipe?.notes || '');
  const [privateNotes, setPrivateNotes] = useState(initialRecipe?.privateNotes || '');
  const [source, setSource] = useState(initialRecipe?.source || '');

  // Image Upload state
  const [isCompressingImage, setIsCompressingImage] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [showImagePicker, setShowImagePicker] = useState(false);
  const [imageInputMode, setImageInputMode] = useState<'upload' | 'preset' | 'url'>('upload');

  // Ingredients state
  const [ingredients, setIngredients] = useState<IngredientItem[]>(
    initialRecipe?.ingredients?.length
      ? initialRecipe.ingredients
      : [
          { id: 'ing-1', name: '', amount: '', unit: '', group: '主要食材' },
          { id: 'ing-2', name: '', amount: '', unit: '', group: '主要食材' },
          { id: 'ing-3', name: '', amount: '', unit: '', group: '調味料' },
        ]
  );

  // Steps state
  const [steps, setSteps] = useState<RecipeStep[]>(
    initialRecipe?.steps?.length
      ? initialRecipe.steps
      : [
          { id: 'step-1', stepNumber: 1, title: '準備食材', instruction: '', timerMinutes: 0 },
          { id: 'step-2', stepNumber: 2, title: '開始烹調', instruction: '', timerMinutes: 5 },
        ]
  );

  const [validationError, setValidationError] = useState('');

  // Process uploaded image file with ImageService
  const processImageFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('請選擇圖片檔案 (JPG, PNG, WebP 等)');
      return;
    }
    try {
      setIsCompressingImage(true);
      const compressedDataUrl = await ImageService.compressImageFile(file, {
        maxWidth: 1400,
        maxHeight: 1400,
        quality: 0.85,
      });
      setCoverImage(compressedDataUrl);
    } catch (err) {
      alert(`圖片處理失敗：${err instanceof Error ? err.message : '請重試'}`);
    } finally {
      setIsCompressingImage(false);
    }
  };

  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  // Ingredient Helpers
  const addIngredientRow = () => {
    setIngredients([
      ...ingredients,
      { id: `ing-${Date.now()}`, name: '', amount: '', unit: '', group: '主要食材' },
    ]);
  };

  const updateIngredient = (index: number, field: keyof IngredientItem, value: unknown) => {
    const updated = [...ingredients];
    updated[index] = { ...updated[index], [field]: value };
    setIngredients(updated);
  };

  const removeIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  // Step Helpers
  const addStepRow = () => {
    setSteps([
      ...steps,
      {
        id: `step-${Date.now()}`,
        stepNumber: steps.length + 1,
        title: '',
        instruction: '',
        timerMinutes: 0,
      },
    ]);
  };

  const updateStep = (index: number, field: keyof RecipeStep, value: unknown) => {
    const updated = [...steps];
    updated[index] = { ...updated[index], [field]: value };
    setSteps(updated);
  };

  const removeStep = (index: number) => {
    if (steps.length <= 1) {
      alert('食譜至少需要保留一個步驟');
      return;
    }
    const updated = steps.filter((_, i) => i !== index);
    // re-index
    setSteps(updated.map((s, idx) => ({ ...s, stepNumber: idx + 1 })));
  };

  const moveStep = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === steps.length - 1)
    ) {
      return;
    }
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const updated = [...steps];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    setSteps(updated.map((s, idx) => ({ ...s, stepNumber: idx + 1 })));
  };

  // Form Submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      setValidationError('請填寫食譜名稱');
      return;
    }

    const validIngredients = ingredients.filter((i) => i.name.trim().length > 0);
    if (validIngredients.length === 0) {
      setValidationError('請至少新增一項食材');
      return;
    }

    const validSteps = steps.filter((s) => s.instruction.trim().length > 0);
    if (validSteps.length === 0) {
      setValidationError('請至少填寫一個料理步驟說明');
      return;
    }

    const finalCategory =
      category === '自訂分類' ? customCategory.trim() || '自訂私房' : category;

    const tagsArray = tagsInput
      .split(/[,，]/)
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const newRecipe: Recipe = {
      id: initialRecipe?.id || `recipe-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      title: title.trim(),
      description: description.trim(),
      category: finalCategory,
      tags: tagsArray,
      servings: Math.max(1, servings),
      prepTime: Math.max(0, prepTime),
      cookTime: Math.max(0, cookTime),
      difficulty,
      coverImage: coverImage.trim(),
      ingredients: validIngredients,
      steps: validSteps,
      notes: notes.trim() || undefined,
      privateNotes: privateNotes.trim() || undefined,
      rating: rating,
      source: source.trim() || undefined,
      isFavorite: initialRecipe?.isFavorite || false,
      createdAt: initialRecipe?.createdAt || Date.now(),
      updatedAt: Date.now(),
    };

    onSave(newRecipe);
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-stone-200 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500 text-stone-950 flex items-center justify-center font-bold">
              <ChefHat className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-stone-900">
                {isEditing ? '編輯食譜筆記' : '新增食譜筆記'}
              </h2>
              <p className="text-xs text-stone-500">
                支援圖片上傳、美味評分、自訂食材、計時步驟與私房筆記
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

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {validationError && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs font-semibold">
              ⚠️ {validationError}
            </div>
          )}

          {/* Basic Info */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-stone-400 flex items-center gap-2">
              <span>基本資料與美味評分</span>
              <div className="flex-1 h-px bg-stone-100"></div>
            </h3>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                食譜名稱 <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="例如：日式照燒雞腿肉、經典台式三杯雞"
                className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 font-bold text-stone-900"
                required
              />
            </div>

            {/* Star Rating Input */}
            <div className="p-3.5 rounded-2xl bg-amber-50/50 border border-amber-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <label className="block text-xs font-bold text-amber-900 mb-0.5 flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                  美味喜好度評分 (1-5 星)
                </label>
                <p className="text-[11px] text-amber-700">
                  可隨時依據試煮體驗調整星等，並支援在清單依評分篩選
                </p>
              </div>
              <StarRating
                rating={rating}
                onChange={setRating}
                size="lg"
                showLabel
                showScore
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                料理簡介 / 風味特色
              </label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="簡短描述這道菜的風味特色、烹調重點或由來..."
                className="w-full px-4 py-2 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500/20 text-xs sm:text-sm text-stone-800"
              />
            </div>

            {/* Category & Difficulty Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-xs font-bold text-stone-600 mb-1">
                  分類
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs font-semibold bg-white"
                >
                  {categories
                    .filter((cat) => cat !== '全部')
                    .map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  {!categories.includes(category) && category !== '自訂分類' && (
                    <option value={category}>{category}</option>
                  )}
                  <option value="自訂分類">+ 自訂分類</option>
                </select>
              </div>

              {category === '自訂分類' && (
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-xs font-bold text-stone-600 mb-1">
                    輸入自訂分類
                  </label>
                  <input
                    type="text"
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value)}
                    placeholder="如：露營料理"
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs font-semibold"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-stone-600 mb-1">
                  基準份量 (人份)
                </label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={servings}
                  onChange={(e) => setServings(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-600 mb-1">
                  備料時間 (分鐘)
                </label>
                <input
                  type="number"
                  min="0"
                  value={prepTime}
                  onChange={(e) => setPrepTime(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-600 mb-1">
                  烹飪時間 (分鐘)
                </label>
                <input
                  type="number"
                  min="0"
                  value={cookTime}
                  onChange={(e) => setCookTime(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-600 mb-1">
                  難易度
                </label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value as Difficulty)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs font-semibold bg-white"
                >
                  <option value="簡單">簡單</option>
                  <option value="中等">中等</option>
                  <option value="進階">進階</option>
                </select>
              </div>
            </div>

            {/* Enhanced Image Upload / Picker Section */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-stone-700 flex items-center gap-1.5">
                  <Camera className="w-3.5 h-3.5 text-amber-600" />
                  <span>封面圖片 (支援手機/電腦拍照上傳、精選圖庫、圖片網址)</span>
                </label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setImageInputMode('upload')}
                    className={`text-xs font-semibold px-2.5 py-1 rounded-lg transition-colors ${
                      imageInputMode === 'upload'
                        ? 'bg-amber-100 text-amber-800'
                        : 'text-stone-500 hover:text-stone-800'
                    }`}
                  >
                    上傳照片
                  </button>
                  <button
                    type="button"
                    onClick={() => setImageInputMode('preset')}
                    className={`text-xs font-semibold px-2.5 py-1 rounded-lg transition-colors ${
                      imageInputMode === 'preset'
                        ? 'bg-amber-100 text-amber-800'
                        : 'text-stone-500 hover:text-stone-800'
                    }`}
                  >
                    精選圖庫
                  </button>
                  <button
                    type="button"
                    onClick={() => setImageInputMode('url')}
                    className={`text-xs font-semibold px-2.5 py-1 rounded-lg transition-colors ${
                      imageInputMode === 'url'
                        ? 'bg-amber-100 text-amber-800'
                        : 'text-stone-500 hover:text-stone-800'
                    }`}
                  >
                    輸入網址
                  </button>
                </div>
              </div>

              {/* Upload Drop Zone Mode */}
              {imageInputMode === 'upload' && (
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-2xl p-4 sm:p-6 text-center transition-all ${
                    isDragOver
                      ? 'border-amber-500 bg-amber-50/50 scale-99'
                      : 'border-stone-200 bg-stone-50/50 hover:bg-stone-50 hover:border-stone-300'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    {coverImage && (
                      <div className="relative w-24 h-24 rounded-xl overflow-hidden shrink-0 border border-stone-200 shadow-xs">
                        <img
                          src={coverImage}
                          alt="預覽"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="space-y-1.5 text-center sm:text-left">
                      <p className="text-xs font-bold text-stone-800">
                        {isCompressingImage ? '正在自動優化與壓縮圖片...' : '點擊選擇或直接拖曳圖片至此'}
                      </p>
                      <p className="text-[11px] text-stone-400">
                        支援 JPG、PNG、WebP，系統會自動等比壓縮提升載入速度與離線同步效率
                      </p>
                      <label className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold cursor-pointer shadow-xs transition-transform active:scale-95">
                        <Upload className="w-3.5 h-3.5" />
                        <span>{coverImage ? '更換新照片' : '選擇照片上傳'}</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageFileUpload}
                          disabled={isCompressingImage}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* Preset Gallery Mode */}
              {imageInputMode === 'preset' && (
                <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 p-3 bg-stone-100 rounded-2xl border border-stone-200">
                  {PRESET_IMAGES.map((img, idx) => (
                    <button
                      type="button"
                      key={idx}
                      onClick={() => setCoverImage(img.url)}
                      className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                        coverImage === img.url
                          ? 'border-amber-500 scale-95 shadow-md'
                          : 'border-transparent hover:opacity-80'
                      }`}
                    >
                      <img src={img.url} alt={img.label} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}

              {/* URL Mode */}
              {imageInputMode === 'url' && (
                <div className="flex items-center gap-2">
                  <input
                    type="url"
                    value={coverImage}
                    onChange={(e) => setCoverImage(e.target.value)}
                    placeholder="輸入圖片網址 (https://...)"
                    className="flex-1 px-3.5 py-2 rounded-xl border border-stone-300 text-xs text-stone-700"
                  />
                  {coverImage && (
                    <div className="w-9 h-9 rounded-lg overflow-hidden shrink-0 border border-stone-200">
                      <img src={coverImage} alt="預覽" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Tags */}
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1.5">
                標籤 (用逗號隔開)
              </label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="例如：台菜, 下飯菜, 快速晚餐, 便當菜..."
                className="w-full px-4 py-2 rounded-xl border border-stone-300 text-xs sm:text-sm text-stone-800"
              />
            </div>
          </div>

          {/* Ingredients Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold uppercase tracking-wider text-stone-400 flex items-center gap-2">
                <span>食材清單</span>
              </h3>
              <button
                type="button"
                onClick={addIngredientRow}
                className="flex items-center gap-1 text-xs font-bold text-amber-600 hover:text-amber-700 bg-amber-50 hover:bg-amber-100 px-3 py-1.5 rounded-xl border border-amber-200"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>新增食材</span>
              </button>
            </div>

            <div className="space-y-2.5">
              {ingredients.map((ing, idx) => (
                <div
                  key={ing.id || idx}
                  className="flex items-center gap-2 bg-stone-50 p-2 rounded-xl border border-stone-200"
                >
                  <input
                    type="text"
                    value={ing.group || ''}
                    onChange={(e) => updateIngredient(idx, 'group', e.target.value)}
                    placeholder="分組 (如主料/調味)"
                    className="w-24 px-2 py-1.5 text-xs bg-white rounded-lg border border-stone-200 text-stone-600"
                  />
                  <input
                    type="text"
                    value={ing.name}
                    onChange={(e) => updateIngredient(idx, 'name', e.target.value)}
                    placeholder="食材名稱 *"
                    className="flex-1 px-3 py-1.5 text-xs bg-white rounded-lg border border-stone-200 font-semibold text-stone-800"
                    required
                  />
                  <input
                    type="text"
                    value={ing.amount}
                    onChange={(e) => updateIngredient(idx, 'amount', e.target.value)}
                    placeholder="份量 (如 2 或 1/2)"
                    className="w-24 px-2 py-1.5 text-xs bg-white rounded-lg border border-stone-200 text-center"
                  />
                  <input
                    type="text"
                    value={ing.unit}
                    onChange={(e) => updateIngredient(idx, 'unit', e.target.value)}
                    placeholder="單位 (支/匙/g)"
                    className="w-20 px-2 py-1.5 text-xs bg-white rounded-lg border border-stone-200 text-center"
                  />
                  <input
                    type="text"
                    value={ing.notes || ''}
                    onChange={(e) => updateIngredient(idx, 'notes', e.target.value)}
                    placeholder="備註 (切丁/去皮)"
                    className="w-28 hidden sm:block px-2 py-1.5 text-xs bg-white rounded-lg border border-stone-200 text-stone-500"
                  />
                  <button
                    type="button"
                    onClick={() => removeIngredient(idx)}
                    className="p-1.5 text-stone-400 hover:text-rose-500 rounded-lg hover:bg-stone-200/50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Steps Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold uppercase tracking-wider text-stone-400 flex items-center gap-2">
                <span>料理步驟與烹飪計時</span>
              </h3>
              <button
                type="button"
                onClick={addStepRow}
                className="flex items-center gap-1 text-xs font-bold text-amber-600 hover:text-amber-700 bg-amber-50 hover:bg-amber-100 px-3 py-1.5 rounded-xl border border-amber-200"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>新增步驟</span>
              </button>
            </div>

            <div className="space-y-4">
              {steps.map((step, idx) => (
                <div
                  key={step.id || idx}
                  className="p-4 rounded-2xl border border-stone-200 bg-stone-50 space-y-3 relative group"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-stone-900 text-white flex items-center justify-center text-xs font-bold">
                        {idx + 1}
                      </span>
                      <input
                        type="text"
                        value={step.title || ''}
                        onChange={(e) => updateStep(idx, 'title', e.target.value)}
                        placeholder="步驟小標題 (選填，如：煎至金黃)"
                        className="px-3 py-1 text-xs bg-white rounded-lg border border-stone-200 font-bold text-stone-800"
                      />
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => moveStep(idx, 'up')}
                        disabled={idx === 0}
                        className="p-1 text-stone-400 hover:text-stone-700 disabled:opacity-20"
                      >
                        <ArrowUp className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => moveStep(idx, 'down')}
                        disabled={idx === steps.length - 1}
                        className="p-1 text-stone-400 hover:text-stone-700 disabled:opacity-20"
                      >
                        <ArrowDown className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => removeStep(idx)}
                        className="p-1 text-stone-400 hover:text-rose-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <textarea
                    rows={2}
                    value={step.instruction}
                    onChange={(e) => updateStep(idx, 'instruction', e.target.value)}
                    placeholder="詳細描述這個步驟的料理動作與火候技巧..."
                    className="w-full px-3 py-2 text-xs bg-white rounded-xl border border-stone-200 focus:outline-none focus:border-amber-500 leading-relaxed"
                    required
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                    <div className="sm:col-span-6 flex items-center gap-2 text-xs">
                      <Clock className="w-3.5 h-3.5 text-amber-600" />
                      <span className="font-semibold text-stone-600">步驟計時：</span>
                      <input
                        type="number"
                        min="0"
                        value={step.timerMinutes || 0}
                        onChange={(e) => updateStep(idx, 'timerMinutes', Number(e.target.value))}
                        className="w-14 px-2 py-1 text-center bg-white rounded-lg border border-stone-200"
                      />
                      <span>分</span>
                      <input
                        type="number"
                        min="0"
                        max="59"
                        value={step.timerSeconds || 0}
                        onChange={(e) => updateStep(idx, 'timerSeconds', Number(e.target.value))}
                        className="w-14 px-2 py-1 text-center bg-white rounded-lg border border-stone-200"
                      />
                      <span>秒</span>
                    </div>

                    <div className="sm:col-span-6">
                      <input
                        type="text"
                        value={step.tip || ''}
                        onChange={(e) => updateStep(idx, 'tip', e.target.value)}
                        placeholder="💡 小撇步叮嚀 (選填)"
                        className="w-full px-3 py-1 text-xs bg-amber-50/50 border border-amber-200 rounded-lg text-amber-900"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Private Notes & Public Notes */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-stone-400 flex items-center gap-2">
              <span>私房私密筆記與主廚備註</span>
              <div className="flex-1 h-px bg-stone-100"></div>
            </h3>

            {/* Private Notes Field */}
            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200">
              <label className="block text-xs font-bold text-amber-900 mb-1 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-amber-700" />
                <span>我的私房私密筆記 (個人專屬，支援雲端同步備份)</span>
              </label>
              <p className="text-[11px] text-amber-700/80 mb-2">
                記錄您自己的調味改良、加減鹽糖、烘烤火候微調或家人口味偏好。
              </p>
              <textarea
                rows={2}
                value={privateNotes}
                onChange={(e) => setPrivateNotes(e.target.value)}
                placeholder="例如：下次可多煮2分鐘讓醬汁更濃稠；雞腿肉先用米酒抓醃10分鐘更入味..."
                className="w-full px-3 py-2 rounded-xl bg-white border border-amber-300 text-xs text-stone-800 leading-relaxed focus:outline-none focus:ring-2 focus:ring-amber-500/20"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1.5">
                主廚備註 / 搭配建議 / 儲存方式 (公開)
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="記錄試吃心得、改良靈感或保存加熱注意事項..."
                className="w-full px-4 py-2 rounded-xl border border-stone-300 text-xs text-stone-800 leading-relaxed"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1.5">
                食譜來源 (如 媽媽私房傳承、烹飪書、自創...)
              </label>
              <input
                type="text"
                value={source}
                onChange={(e) => setSource(e.target.value)}
                placeholder="例如：日本料理教室手札"
                className="w-full px-4 py-2 rounded-xl border border-stone-300 text-xs text-stone-800"
              />
            </div>
          </div>
        </form>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-stone-200 bg-stone-50 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-stone-300 text-stone-700 font-semibold text-sm hover:bg-stone-100 transition-colors"
          >
            取消
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-sm shadow-md shadow-amber-500/20 transition-transform active:scale-95"
          >
            <Save className="w-4 h-4" />
            <span>{isEditing ? '儲存更新' : '建立食譜'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
