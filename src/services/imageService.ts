/**
 * Image processing service for client-side compression and validation
 */

export interface ProcessImageOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  mimeType?: 'image/jpeg' | 'image/webp' | 'image/png';
}

export class ImageService {
  /**
   * Compress and resize an image file using browser Canvas
   */
  public static async compressImageFile(
    file: File,
    options: ProcessImageOptions = {}
  ): Promise<string> {
    const {
      maxWidth = 1280,
      maxHeight = 1280,
      quality = 0.82,
      mimeType = 'image/jpeg',
    } = options;

    return new Promise((resolve, reject) => {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        reject(new Error('請選擇有效的圖片檔案 (JPG, PNG, WebP)'));
        return;
      }

      const reader = new FileReader();
      reader.onerror = () => reject(new Error('讀取圖片檔案失敗'));
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        if (!dataUrl) {
          reject(new Error('無法解析圖片資料'));
          return;
        }

        const img = new Image();
        img.onerror = () => reject(new Error('圖片載入失敗，可能檔案已損毀'));
        img.onload = () => {
          try {
            let { width, height } = img;

            // Calculate scaled dimensions while preserving aspect ratio
            if (width > maxWidth || height > maxHeight) {
              if (width / height > maxWidth / maxHeight) {
                height = Math.round((height * maxWidth) / width);
                width = maxWidth;
              } else {
                width = Math.round((width * maxHeight) / height);
                height = maxHeight;
              }
            }

            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;

            const ctx = canvas.getContext('2d');
            if (!ctx) {
              // Fallback to original data URL if 2D context is not available
              resolve(dataUrl);
              return;
            }

            // Draw with smooth scaling
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';
            ctx.drawImage(img, 0, 0, width, height);

            const compressedDataUrl = canvas.toDataURL(mimeType, quality);
            resolve(compressedDataUrl);
          } catch (err) {
            // Fallback to original if canvas fails
            console.warn('Canvas compression failed, falling back to original', err);
            resolve(dataUrl);
          }
        };
        img.src = dataUrl;
      };
      reader.readAsDataURL(file);
    });
  }

  /**
   * Validate image URL or Data URL
   */
  public static isValidImageUrl(url: string): boolean {
    if (!url || typeof url !== 'string') return false;
    const trimmed = url.trim();
    return (
      trimmed.startsWith('data:image/') ||
      trimmed.startsWith('http://') ||
      trimmed.startsWith('https://') ||
      trimmed.startsWith('/')
    );
  }
}
