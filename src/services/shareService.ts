import { Recipe } from '../types';

export interface ShareDataPayload {
  title: string;
  text: string;
  url: string;
}

export class ShareService {
  /**
   * Generate direct app URL with recipe hash ID
   */
  public static getRecipeShareUrl(recipeId: string): string {
    const origin = window.location.origin;
    const pathname = window.location.pathname;
    return `${origin}${pathname}#recipe=${encodeURIComponent(recipeId)}`;
  }

  /**
   * Generate a standalone portable recipe URL containing compact encoded recipe data
   * Useful when sharing to users whose devices haven't synced with the cloud yet.
   */
  public static getPortableRecipeShareUrl(recipe: Recipe): string {
    try {
      const compactRecipe = {
        t: recipe.title,
        d: recipe.description,
        c: recipe.category,
        g: recipe.tags,
        s: recipe.servings,
        p: recipe.prepTime,
        k: recipe.cookTime,
        l: recipe.difficulty,
        i: recipe.coverImage,
        ing: recipe.ingredients.map(item => ({
          n: item.name,
          a: item.amount,
          u: item.unit,
          g: item.group,
          nt: item.notes,
        })),
        stp: recipe.steps.map(step => ({
          n: step.stepNumber,
          t: step.title,
          i: step.instruction,
          tm: step.timerMinutes,
          ts: step.timerSeconds,
          tp: step.tip,
        })),
        n: recipe.notes,
        r: recipe.rating,
        src: recipe.source,
      };

      const jsonStr = JSON.stringify(compactRecipe);
      const encoded = btoa(encodeURIComponent(jsonStr));
      const origin = window.location.origin;
      const pathname = window.location.pathname;
      return `${origin}${pathname}#share=${encoded}`;
    } catch (e) {
      console.error('Failed to create portable share url:', e);
      return this.getRecipeShareUrl(recipe.id);
    }
  }

  /**
   * Parse portable recipe from encoded URL hash
   */
  public static parsePortableRecipe(encodedString: string): Recipe | null {
    try {
      const jsonStr = decodeURIComponent(atob(encodedString));
      const obj = JSON.parse(jsonStr);
      if (!obj || !obj.t) return null;

      const recipe: Recipe = {
        id: `shared-${Date.now()}`,
        title: obj.t || '分享的食譜',
        description: obj.d || '',
        category: obj.c || '家常料理',
        tags: Array.isArray(obj.g) ? obj.g : [],
        servings: Number(obj.s) || 2,
        prepTime: Number(obj.p) || 10,
        cookTime: Number(obj.k) || 20,
        difficulty: obj.l || '簡單',
        coverImage: obj.i || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1200&q=80',
        ingredients: Array.isArray(obj.ing)
          ? obj.ing.map((item: any, idx: number) => ({
              id: `ing-${idx}`,
              name: item.n || '',
              amount: item.a !== undefined ? item.a : '',
              unit: item.u || '',
              group: item.g || '主要食材',
              notes: item.nt || '',
            }))
          : [],
        steps: Array.isArray(obj.stp)
          ? obj.stp.map((st: any, idx: number) => ({
              id: `step-${idx}`,
              stepNumber: st.n || idx + 1,
              title: st.t || '',
              instruction: st.i || '',
              timerMinutes: st.tm ? Number(st.tm) : undefined,
              timerSeconds: st.ts ? Number(st.ts) : undefined,
              tip: st.tp || '',
            }))
          : [],
        notes: obj.n || '',
        rating: obj.r || undefined,
        source: obj.src ? `${obj.src} (好友分享)` : '好友分享',
        isFavorite: false,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      return recipe;
    } catch (e) {
      console.error('Failed to parse portable recipe:', e);
      return null;
    }
  }

  /**
   * Check if Native Web Share API is available
   */
  public static canNativeShare(): boolean {
    return typeof navigator !== 'undefined' && Boolean(navigator.share);
  }

  /**
   * Trigger native mobile share dialog (iOS / Android / macOS)
   */
  public static async triggerNativeShare(payload: ShareDataPayload): Promise<boolean> {
    if (this.canNativeShare()) {
      try {
        await navigator.share(payload);
        return true;
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          console.warn('Native share failed:', err);
        }
        return false;
      }
    }
    return false;
  }

  /**
   * Generate QR Code SVG matrix URL using a clean lightweight encoder
   */
  public static generateQrCodeSvg(url: string, size = 200): string {
    // We can use Google Charts API or a quick SVG QR generator for crisp high-res rendering
    const encodedUrl = encodeURIComponent(url);
    return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodedUrl}&format=svg`;
  }
}
