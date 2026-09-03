import { GoogleDriveStatus, Recipe } from '../types';

declare global {
  interface Window {
    google?: {
      accounts: {
        oauth2: {
          initTokenClient: (config: {
            client_id: string;
            scope: string;
            callback: (response: { access_token?: string; error?: string; error_description?: string }) => void;
            error_callback?: (err: unknown) => void;
          }) => {
            requestAccessToken: (overrideConfig?: { prompt?: string }) => void;
          };
          hasGrantedAllScopes?: (token: unknown, ...scopes: string[]) => boolean;
        };
      };
    };
  }
}

const STORAGE_KEYS = {
  DRIVE_STATUS: 'recipe_app_drive_status',
  DRIVE_TOKEN: 'recipe_app_drive_token',
  DRIVE_TOKEN_EXPIRY: 'recipe_app_drive_token_expiry',
  PENDING_SYNC: 'recipe_app_pending_sync',
  LOCAL_RECIPES: 'recipe_app_recipes_data',
};

const DRIVE_FOLDER_NAME = '🍳 食譜筆記 (Recipe Notes)';
const DRIVE_BACKUP_FILENAME = 'recipes_backup.json';

export class GoogleDriveService {
  private accessToken: string | null = null;
  private tokenExpiresAt: number = 0;
  private tokenClient: unknown = null;
  private statusListeners: Array<(status: GoogleDriveStatus) => void> = [];
  
  // Default Client ID from project configuration
  private defaultClientId: string = '494250935386-u0lnkvfrqkf8grldg143sliumdo1kh5v.apps.googleusercontent.com';
  private clientId: string = '494250935386-u0lnkvfrqkf8grldg143sliumdo1kh5v.apps.googleusercontent.com';

  private status: GoogleDriveStatus = {
    isConnected: false,
    userEmail: null,
    userName: null,
    userAvatar: null,
    folderId: null,
    folderName: DRIVE_FOLDER_NAME,
    backupFileId: null,
    lastSyncTimestamp: null,
    isSyncing: false,
    syncError: null,
    isAutoSync: true,
  };

  constructor() {
    this.loadPersistedState();
    this.setupNetworkListeners();
  }

  private loadPersistedState() {
    try {
      const savedClientId = localStorage.getItem('recipe_app_drive_client_id');
      if (savedClientId && savedClientId.trim()) {
        this.clientId = savedClientId.trim();
      }

      const savedStatus = localStorage.getItem(STORAGE_KEYS.DRIVE_STATUS);
      if (savedStatus) {
        this.status = { ...this.status, ...JSON.parse(savedStatus), isSyncing: false };
      }
      const savedToken = sessionStorage.getItem(STORAGE_KEYS.DRIVE_TOKEN);
      const savedExpiry = sessionStorage.getItem(STORAGE_KEYS.DRIVE_TOKEN_EXPIRY);
      if (savedToken && savedExpiry && Number(savedExpiry) > Date.now()) {
        this.accessToken = savedToken;
        this.tokenExpiresAt = Number(savedExpiry);
      }
    } catch {
      // Ignore
    }
  }

  public getSavedClientId(): string {
    return localStorage.getItem('recipe_app_drive_client_id') || '';
  }

  public setSavedClientId(id: string) {
    if (id && id.trim()) {
      this.clientId = id.trim();
      localStorage.setItem('recipe_app_drive_client_id', this.clientId);
    } else {
      this.clientId = this.defaultClientId;
      localStorage.removeItem('recipe_app_drive_client_id');
    }
  }

  private saveState() {
    try {
      localStorage.setItem(STORAGE_KEYS.DRIVE_STATUS, JSON.stringify(this.status));
    } catch {
      // Ignore
    }
  }

  private notify() {
    this.saveState();
    this.statusListeners.forEach(listener => listener({ ...this.status }));
  }

  public subscribe(listener: (status: GoogleDriveStatus) => void): () => void {
    this.statusListeners.push(listener);
    listener({ ...this.status });
    return () => {
      this.statusListeners = this.statusListeners.filter(l => l !== listener);
    };
  }

  public getStatus(): GoogleDriveStatus {
    return { ...this.status };
  }

  public setAutoSync(enabled: boolean) {
    this.status.isAutoSync = enabled;
    this.notify();
  }

  private setupNetworkListeners() {
    if (typeof window === 'undefined') return;
    window.addEventListener('online', () => {
      this.status.syncError = null;
      this.notify();
      if (this.status.isConnected && this.status.isAutoSync) {
        this.syncPendingData();
      }
    });
    window.addEventListener('offline', () => {
      this.notify();
    });
  }

  public isOnline(): boolean {
    return typeof navigator !== 'undefined' ? navigator.onLine : true;
  }

  /**
   * Initialize and request OAuth Token from Google Identity Services
   */
  public async connect(customClientId?: string): Promise<{ success: boolean; error?: string }> {
    if (customClientId && customClientId.trim()) {
      this.setSavedClientId(customClientId.trim());
    }

    if (typeof window === 'undefined' || !window.google?.accounts?.oauth2) {
      return {
        success: false,
        error: 'Google 身份驗證程式庫載入中，請稍候再試。若持續失敗請確認網路連線。',
      };
    }

    return new Promise((resolve) => {
      try {
        this.status.isSyncing = true;
        this.status.syncError = null;
        this.notify();

        const tokenClient = window.google.accounts.oauth2.initTokenClient({
          client_id: this.clientId,
          scope: 'https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email',
          callback: async (resp) => {
            if (resp.error) {
              this.status.isSyncing = false;
              let friendlyError = resp.error_description || resp.error;
              if (resp.error === 'invalid_client' || friendlyError.includes('client')) {
                friendlyError = 'OAuth Client ID 無效或未找到 (401 invalid_client)。請檢查下方 Google Client ID 是否輸入正確。';
              }
              this.status.syncError = `授權未完成：${friendlyError}`;
              this.notify();
              resolve({ success: false, error: this.status.syncError });
              return;
            }

            if (resp.access_token) {
              this.accessToken = resp.access_token;
              this.tokenExpiresAt = Date.now() + 3500 * 1000;
              sessionStorage.setItem(STORAGE_KEYS.DRIVE_TOKEN, this.accessToken);
              sessionStorage.setItem(STORAGE_KEYS.DRIVE_TOKEN_EXPIRY, this.tokenExpiresAt.toString());

              // Fetch User profile
              await this.fetchUserProfile();
              // Initialize Drive Folder & locate backup file
              await this.ensureDriveFolderAndFile();

              this.status.isConnected = true;
              this.status.isSyncing = false;
              this.status.syncError = null;
              this.notify();

              resolve({ success: true });
            } else {
              this.status.isSyncing = false;
              this.status.syncError = '未取得有效 Access Token。';
              this.notify();
              resolve({ success: false, error: this.status.syncError });
            }
          },
          error_callback: (err) => {
            this.status.isSyncing = false;
            const errStr = String(err || '');
            let msg = 'Google 登入連線發生錯誤或視窗已關閉。';
            if (errStr.includes('popup_closed') || errStr.includes('Popup window closed') || errStr.includes('closed')) {
              msg = 'Google 授權視窗已被關閉。若彈窗顯示「存取權遭封鎖 / 401: invalid_client」，請確認下方已填入正確的 Google Client ID。';
            }
            this.status.syncError = msg;
            this.notify();
            resolve({ success: false, error: msg });
          },
        });

        this.tokenClient = tokenClient;
        tokenClient.requestAccessToken({ prompt: 'consent' });
      } catch (err) {
        this.status.isSyncing = false;
        this.status.syncError = err instanceof Error ? err.message : '連線初始化失敗';
        this.notify();
        resolve({ success: false, error: this.status.syncError });
      }
    });
  }

  /**
   * Disconnect and clear token
   */
  public disconnect() {
    this.accessToken = null;
    this.tokenExpiresAt = 0;
    sessionStorage.removeItem(STORAGE_KEYS.DRIVE_TOKEN);
    sessionStorage.removeItem(STORAGE_KEYS.DRIVE_TOKEN_EXPIRY);
    this.status = {
      isConnected: false,
      userEmail: null,
      userName: null,
      userAvatar: null,
      folderId: null,
      folderName: DRIVE_FOLDER_NAME,
      backupFileId: null,
      lastSyncTimestamp: this.status.lastSyncTimestamp,
      isSyncing: false,
      syncError: null,
      isAutoSync: this.status.isAutoSync,
    };
    this.notify();
  }

  private async fetchUserProfile() {
    if (!this.accessToken) return;
    try {
      const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${this.accessToken}` },
      });
      if (res.ok) {
        const profile = await res.json();
        this.status.userEmail = profile.email || null;
        this.status.userName = profile.name || profile.given_name || 'Google 使用者';
        this.status.userAvatar = profile.picture || null;
      }
    } catch {
      // Ignore user info failure
    }
  }

  /**
   * Find or create the dedicated app folder in Google Drive
   */
  private async ensureDriveFolderAndFile(): Promise<boolean> {
    if (!this.accessToken) return false;

    try {
      // 1. Search for existing folder
      const query = `name = '${DRIVE_FOLDER_NAME}' and mimeType = 'application/vnd.google-apps.folder' and trashed = false`;
      const searchRes = await fetch(
        `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(query)}&fields=files(id,name)`,
        { headers: { Authorization: `Bearer ${this.accessToken}` } }
      );

      let folderId: string | null = null;
      if (searchRes.ok) {
        const searchData = await searchRes.json();
        if (searchData.files && searchData.files.length > 0) {
          folderId = searchData.files[0].id;
        }
      }

      // 2. Create folder if not found
      if (!folderId) {
        const createRes = await fetch('https://www.googleapis.com/drive/v3/files', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: DRIVE_FOLDER_NAME,
            mimeType: 'application/vnd.google-apps.folder',
            description: '食譜筆記 Web App 專屬雲端同步與備份資料夾',
          }),
        });

        if (createRes.ok) {
          const createData = await createRes.json();
          folderId = createData.id;
        }
      }

      this.status.folderId = folderId;

      // 3. Search for existing backup file in folder
      if (folderId) {
        const fileQuery = `name = '${DRIVE_BACKUP_FILENAME}' and '${folderId}' in parents and trashed = false`;
        const fileRes = await fetch(
          `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(fileQuery)}&fields=files(id,name,modifiedTime)`,
          { headers: { Authorization: `Bearer ${this.accessToken}` } }
        );
        if (fileRes.ok) {
          const fileData = await fileRes.json();
          if (fileData.files && fileData.files.length > 0) {
            this.status.backupFileId = fileData.files[0].id;
            if (fileData.files[0].modifiedTime) {
              this.status.lastSyncTimestamp = new Date(fileData.files[0].modifiedTime).getTime();
            }
          }
        }
      }

      return true;
    } catch (err) {
      console.error('Failed to ensure Drive folder:', err);
      return false;
    }
  }

  /**
   * Sync recipes to Google Drive
   */
  public async syncToDrive(recipes: Recipe[]): Promise<{ success: boolean; error?: string }> {
    if (!this.status.isConnected || !this.accessToken) {
      // Mark as pending for offline/unauthenticated
      try {
        localStorage.setItem(STORAGE_KEYS.PENDING_SYNC, JSON.stringify(recipes));
      } catch {
        // Ignore
      }
      return { success: false, error: '尚未連接 Google Drive 帳號' };
    }

    if (!this.isOnline()) {
      try {
        localStorage.setItem(STORAGE_KEYS.PENDING_SYNC, JSON.stringify(recipes));
      } catch {
        // Ignore
      }
      return { success: false, error: '目前為離線狀態，食譜已保存在本機，連線後將自動同步至雲端。' };
    }

    try {
      this.status.isSyncing = true;
      this.status.syncError = null;
      this.notify();

      await this.ensureDriveFolderAndFile();
      const folderId = this.status.folderId;

      const payload = {
        app: 'RecipeNotes_TW',
        version: '1.0',
        lastUpdated: new Date().toISOString(),
        device: navigator.userAgent,
        totalCount: recipes.length,
        recipes: recipes,
      };
      const jsonContent = JSON.stringify(payload, null, 2);

      let response: Response;

      if (this.status.backupFileId) {
        // Update existing file using upload endpoint (PATCH)
        response = await fetch(
          `https://www.googleapis.com/upload/drive/v3/files/${this.status.backupFileId}?uploadType=media`,
          {
            method: 'PATCH',
            headers: {
              Authorization: `Bearer ${this.accessToken}`,
              'Content-Type': 'application/json; charset=UTF-8',
            },
            body: jsonContent,
          }
        );
      } else {
        // Create new multipart file
        const metadata = {
          name: DRIVE_BACKUP_FILENAME,
          mimeType: 'application/json',
          parents: folderId ? [folderId] : [],
          description: '食譜筆記全部資料雲端備份檔',
        };

        const boundary = 'foo_bar_baz_recipe_boundary';
        const delimiter = `\r\n--${boundary}\r\n`;
        const closeDelimiter = `\r\n--${boundary}--`;

        const multipartRequestBody =
          delimiter +
          'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
          JSON.stringify(metadata) +
          delimiter +
          'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
          jsonContent +
          closeDelimiter;

        response = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
            'Content-Type': `multipart/related; boundary=${boundary}`,
          },
          body: multipartRequestBody,
        });
      }

      if (response.ok) {
        const fileData = await response.json();
        this.status.backupFileId = fileData.id || this.status.backupFileId;
        this.status.lastSyncTimestamp = Date.now();
        this.status.isSyncing = false;
        this.status.syncError = null;
        localStorage.removeItem(STORAGE_KEYS.PENDING_SYNC);
        this.notify();
        return { success: true };
      } else {
        const errText = await response.text();
        this.status.isSyncing = false;
        this.status.syncError = `雲端同步失敗 (${response.status})：${errText}`;
        this.notify();
        return { success: false, error: this.status.syncError };
      }
    } catch (err) {
      this.status.isSyncing = false;
      this.status.syncError = `連線異常：${err instanceof Error ? err.message : '未知錯誤'}`;
      this.notify();
      return { success: false, error: this.status.syncError };
    }
  }

  /**
   * Restore/Fetch recipes from Google Drive
   */
  public async restoreFromDrive(): Promise<{ success: boolean; recipes?: Recipe[]; error?: string }> {
    if (!this.status.isConnected || !this.accessToken) {
      return { success: false, error: '尚未連接 Google Drive 帳號' };
    }

    try {
      this.status.isSyncing = true;
      this.status.syncError = null;
      this.notify();

      await this.ensureDriveFolderAndFile();

      if (!this.status.backupFileId) {
        this.status.isSyncing = false;
        this.status.syncError = '在 Google Drive 雲端資料夾中找不到備份檔案 (recipes_backup.json)。';
        this.notify();
        return { success: false, error: this.status.syncError };
      }

      const res = await fetch(`https://www.googleapis.com/drive/v3/files/${this.status.backupFileId}?alt=media`, {
        headers: { Authorization: `Bearer ${this.accessToken}` },
      });

      if (!res.ok) {
        const errText = await res.text();
        this.status.isSyncing = false;
        this.status.syncError = `下載備份失敗 (${res.status}): ${errText}`;
        this.notify();
        return { success: false, error: this.status.syncError };
      }

      const data = await res.json();
      const recipes = Array.isArray(data.recipes) ? data.recipes : Array.isArray(data) ? data : null;

      if (!recipes) {
        this.status.isSyncing = false;
        this.status.syncError = '雲端檔案資料格式無法解析。';
        this.notify();
        return { success: false, error: this.status.syncError };
      }

      this.status.lastSyncTimestamp = Date.now();
      this.status.isSyncing = false;
      this.status.syncError = null;
      this.notify();

      return { success: true, recipes };
    } catch (err) {
      this.status.isSyncing = false;
      this.status.syncError = `雲端還原錯誤：${err instanceof Error ? err.message : '未知錯誤'}`;
      this.notify();
      return { success: false, error: this.status.syncError };
    }
  }

  /**
   * Sync any pending local changes if back online
   */
  private async syncPendingData() {
    try {
      const pendingRaw = localStorage.getItem(STORAGE_KEYS.PENDING_SYNC);
      if (pendingRaw) {
        const recipes = JSON.parse(pendingRaw);
        if (Array.isArray(recipes)) {
          await this.syncToDrive(recipes);
        }
      }
    } catch {
      // Ignore
    }
  }
}

export const googleDriveService = new GoogleDriveService();
