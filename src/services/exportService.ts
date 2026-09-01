import { Recipe } from '../types';

export class ExportService {
  /**
   * Format a single recipe into clean, rich Markdown
   */
  public static recipeToMarkdown(recipe: Recipe, currentServings?: number): string {
    const targetServings = currentServings || recipe.servings;
    const multiplier = targetServings / (recipe.servings || 1);

    const lines: string[] = [];
    lines.push(`# ${recipe.title}`);
    lines.push('');
    if (recipe.description) {
      lines.push(`> ${recipe.description}`);
      lines.push('');
    }

    lines.push('### 📋 食譜資訊');
    lines.push(`- **分類**: ${recipe.category}`);
    if (recipe.tags && recipe.tags.length > 0) {
      lines.push(`- **標籤**: ${recipe.tags.map(t => `#${t}`).join(' ')}`);
    }
    lines.push(`- **份量**: ${targetServings} 人份${multiplier !== 1 ? ` (原設定: ${recipe.servings} 人份)` : ''}`);
    lines.push(`- **難易度**: ${recipe.difficulty}`);
    lines.push(`- **準備時間**: ${recipe.prepTime} 分鐘`);
    lines.push(`- **烹飪時間**: ${recipe.cookTime} 分鐘 (總計約 ${recipe.prepTime + recipe.cookTime} 分鐘)`);
    if (recipe.source) {
      lines.push(`- **食譜來源**: ${recipe.source}`);
    }
    lines.push('');

    lines.push('### 🥬 食材清單');
    // Group ingredients
    const groups: { [key: string]: typeof recipe.ingredients } = {};
    recipe.ingredients.forEach(item => {
      const g = item.group || '主要食材';
      if (!groups[g]) groups[g] = [];
      groups[g].push(item);
    });

    Object.entries(groups).forEach(([groupName, items]) => {
      if (Object.keys(groups).length > 1) {
        lines.push(`#### 【${groupName}】`);
      }
      items.forEach(ing => {
        let amtStr = '';
        if (typeof ing.amount === 'number') {
          const scaled = ing.amount * multiplier;
          // Format nice float
          const formatted = Number.isInteger(scaled) ? scaled.toString() : (Math.round(scaled * 10) / 10).toString();
          amtStr = `${formatted} ${ing.unit}`;
        } else if (ing.amount) {
          amtStr = `${ing.amount} ${ing.unit}`;
        } else {
          amtStr = ing.unit;
        }
        lines.push(`- [ ] **${ing.name}**: ${amtStr}${ing.notes ? ` (${ing.notes})` : ''}`);
      });
      lines.push('');
    });

    lines.push('### 🍳 烹飪步驟');
    recipe.steps.forEach((step, idx) => {
      const timeStr = [];
      if (step.timerMinutes) timeStr.push(`${step.timerMinutes} 分鐘`);
      if (step.timerSeconds) timeStr.push(`${step.timerSeconds} 秒`);
      const timerLabel = timeStr.length > 0 ? ` ⏱️ (${timeStr.join(' ')})` : '';

      lines.push(`**步驟 ${idx + 1}${step.title ? `：${step.title}` : ''}**${timerLabel}`);
      lines.push(step.instruction);
      if (step.tip) {
        lines.push(`*💡 小撇步: ${step.tip}*`);
      }
      lines.push('');
    });

    if (recipe.notes) {
      lines.push('### 📝 主廚筆記與心得');
      lines.push(recipe.notes);
      lines.push('');
    }

    lines.push('---');
    lines.push(`*匯出自【食譜筆記 Web App】• ${new Date().toLocaleDateString('zh-TW')}*`);

    return lines.join('\n');
  }

  /**
   * Format recipe into clean plain text for messaging apps (Line, etc.)
   */
  public static recipeToPlainText(recipe: Recipe, currentServings?: number): string {
    const targetServings = currentServings || recipe.servings;
    const multiplier = targetServings / (recipe.servings || 1);

    const lines: string[] = [];
    lines.push(`【${recipe.title}】 (${targetServings}人份)`);
    if (recipe.description) lines.push(recipe.description);
    lines.push(`⏱️ 準備 ${recipe.prepTime} 分鐘 / 烹飪 ${recipe.cookTime} 分鐘 | 難度：${recipe.difficulty}`);
    lines.push('');
    lines.push('【食材清單】');

    recipe.ingredients.forEach(ing => {
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

    lines.push('');
    lines.push('【料理步驟】');
    recipe.steps.forEach((step, idx) => {
      const timeStr = step.timerMinutes ? ` [⏱️ ${step.timerMinutes}分鐘]` : '';
      lines.push(`${idx + 1}. ${step.title ? `${step.title} - ` : ''}${step.instruction}${timeStr}`);
    });

    if (recipe.notes) {
      lines.push('');
      lines.push(`【備註】${recipe.notes}`);
    }

    return lines.join('\n');
  }

  /**
   * Export all recipes to a single comprehensive Markdown cookbook
   */
  public static allRecipesToMarkdown(recipes: Recipe[]): string {
    const lines: string[] = [];
    lines.push('# 📖 我的食譜筆記手札');
    lines.push(`*共收錄 ${recipes.length} 道美味食譜 • 匯出時間：${new Date().toLocaleString('zh-TW')}*`);
    lines.push('');
    lines.push('## 📑 食譜目錄');
    recipes.forEach((r, idx) => {
      lines.push(`${idx + 1}. **${r.title}**（${r.category} / 難度：${r.difficulty}）`);
    });
    lines.push('');
    lines.push('---');
    lines.push('');

    recipes.forEach((recipe) => {
      lines.push(this.recipeToMarkdown(recipe));
      lines.push('\n\n---\n\n');
    });

    return lines.join('\n');
  }

  /**
   * Download a text or JSON file
   */
  public static downloadFile(content: string, filename: string, contentType = 'text/plain;charset=utf-8') {
    const blob = new Blob([content], { type: contentType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  /**
   * Export recipes as JSON file
   */
  public static exportRecipesAsJson(recipes: Recipe[], filename = 'recipes_backup.json') {
    const data = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      app: 'RecipeNotes_TW',
      totalCount: recipes.length,
      recipes,
    };
    const jsonStr = JSON.stringify(data, null, 2);
    this.downloadFile(jsonStr, filename, 'application/json;charset=utf-8');
  }

  /**
   * Parse and validate imported JSON
   */
  public static parseImportedJson(jsonText: string): { success: boolean; recipes?: Recipe[]; error?: string } {
    try {
      const data = JSON.parse(jsonText);
      let list: unknown = [];
      if (Array.isArray(data)) {
        list = data;
      } else if (data && Array.isArray(data.recipes)) {
        list = data.recipes;
      } else {
        return { success: false, error: 'JSON 格式不符：找不到食譜陣列。' };
      }

      if (!Array.isArray(list) || list.length === 0) {
        return { success: false, error: '匯入的檔案中沒有有效的食譜資料。' };
      }

      // Basic sanitize
      const validRecipes: Recipe[] = (list as Partial<Recipe>[]).map((item, idx) => ({
        id: item.id || `imported-${Date.now()}-${idx}`,
        title: item.title || '未命名食譜',
        description: item.description || '',
        category: item.category || '家常料理',
        tags: Array.isArray(item.tags) ? item.tags : [],
        servings: Number(item.servings) || 2,
        prepTime: Number(item.prepTime) || 10,
        cookTime: Number(item.cookTime) || 20,
        difficulty: (['簡單', '中等', '進階'].includes(item.difficulty as string) ? item.difficulty : '簡單') as Recipe['difficulty'],
        coverImage: item.coverImage || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1200&q=80',
        ingredients: Array.isArray(item.ingredients)
          ? item.ingredients.map((ing, iIdx) => ({
              id: ing.id || `ing-${iIdx}`,
              name: ing.name || '',
              amount: ing.amount !== undefined ? ing.amount : '',
              unit: ing.unit || '',
              group: ing.group || '主要食材',
              notes: ing.notes || '',
            }))
          : [],
        steps: Array.isArray(item.steps)
          ? item.steps.map((st, sIdx) => ({
              id: st.id || `step-${sIdx}`,
              stepNumber: st.stepNumber || sIdx + 1,
              title: st.title || '',
              instruction: st.instruction || '',
              timerMinutes: st.timerMinutes ? Number(st.timerMinutes) : undefined,
              timerSeconds: st.timerSeconds ? Number(st.timerSeconds) : undefined,
              tip: st.tip || '',
            }))
          : [],
        notes: item.notes || '',
        source: item.source || '',
        isFavorite: Boolean(item.isFavorite),
        createdAt: item.createdAt || Date.now(),
        updatedAt: item.updatedAt || Date.now(),
      }));

      return { success: true, recipes: validRecipes };
    } catch (err) {
      return { success: false, error: `解析 JSON 失敗：${err instanceof Error ? err.message : '檔案格式無效'}` };
    }
  }
}
