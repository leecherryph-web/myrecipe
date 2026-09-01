export type Difficulty = '簡單' | '中等' | '進階';

export type DefaultCategory =
  | '全部'
  | '家常料理'
  | '主食麵飯'
  | '湯品燉肉'
  | '烘焙甜點'
  | '早午餐'
  | '健康減脂'
  | '異國料理'
  | '飲品醬料';

export interface IngredientItem {
  id: string;
  name: string;
  amount: number | string;
  unit: string;
  group?: string; // e.g. "主要食材", "醬汁調味", "醃料", "香料配料"
  notes?: string;
  checked?: boolean;
}

export interface RecipeStep {
  id: string;
  stepNumber: number;
  title?: string;
  instruction: string;
  timerMinutes?: number;
  timerSeconds?: number;
  tip?: string;
  image?: string;
}

export interface Recipe {
  id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  servings: number; // 預設基準份量 (例: 2人份)
  prepTime: number; // 準備時間 (分鐘)
  cookTime: number; // 烹飪時間 (分鐘)
  difficulty: Difficulty;
  coverImage: string;
  ingredients: IngredientItem[];
  steps: RecipeStep[];
  notes?: string; // 公開/大眾心得備註
  privateNotes?: string; // 私人筆記/試煮評語/調味調整
  rating?: number; // 1-5 顆星評分 (0 或 undefined 為未評分)
  source?: string;
  isFavorite: boolean;
  createdAt: number;
  updatedAt: number;
}

export type SortOption = 'latest' | 'rating-desc' | 'time-asc' | 'title-asc';
export type RatingFilter = 'all' | '5' | '4plus' | '3plus' | 'unrated';

export interface ActiveTimer {
  id: string;
  name: string;
  totalSeconds: number;
  remainingSeconds: number;
  isRunning: boolean;
  isCompleted: boolean;
  recipeId?: string;
  recipeTitle?: string;
  stepNumber?: number;
  createdAt: number;
}

export interface GoogleDriveStatus {
  isConnected: boolean;
  userEmail: string | null;
  userName: string | null;
  userAvatar: string | null;
  folderId: string | null;
  folderName: string | null;
  backupFileId: string | null;
  lastSyncTimestamp: number | null;
  isSyncing: boolean;
  syncError: string | null;
  isAutoSync: boolean;
}

export interface PresetTimer {
  name: string;
  minutes: number;
  seconds: number;
  description: string;
  category: string;
}

export type ViewMode = 'grid' | 'compact';
