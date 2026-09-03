import React, { useState, useEffect } from 'react';
import {
  X,
  Cloud,
  CloudOff,
  RefreshCw,
  Download,
  Upload,
  CheckCircle,
  AlertTriangle,
  FolderSync,
  Smartphone,
  Laptop,
  ArrowRight,
  ShieldCheck,
  HardDrive,
  FileJson,
  Copy,
  Check,
  ExternalLink,
} from 'lucide-react';
import { GoogleDriveStatus, Recipe } from '../types';
import { ExportService } from '../services/exportService';
import { googleDriveService } from '../services/googleDriveService';

interface GoogleDriveModalProps {
  isOpen: boolean;
  onClose: () => void;
  driveStatus: GoogleDriveStatus;
  onConnectDrive: (clientId?: string) => Promise<{ success: boolean; error?: string }>;
  onDisconnectDrive: () => void;
  onSyncNow: () => Promise<{ success: boolean; error?: string }>;
  onRestoreNow: () => Promise<{ success: boolean; error?: string }>;
  onToggleAutoSync: (enabled: boolean) => void;
  recipes: Recipe[];
  onImportRecipes: (recipes: Recipe[]) => void;
}

export const GoogleDriveModal: React.FC<GoogleDriveModalProps> = ({
  isOpen,
  onClose,
  driveStatus,
  onConnectDrive,
  onDisconnectDrive,
  onSyncNow,
  onRestoreNow,
  onToggleAutoSync,
  recipes,
  onImportRecipes,
}) => {
  const [customClientId, setCustomClientId] = useState(() => googleDriveService.getSavedClientId());
  const [showAdvanced, setShowAdvanced] = useState(true);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [copiedOrigin, setCopiedOrigin] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setCustomClientId(googleDriveService.getSavedClientId());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const currentOrigin = typeof window !== 'undefined' ? window.location.origin : '';

  const handleCopyOrigin = () => {
    if (currentOrigin && navigator.clipboard) {
      navigator.clipboard.writeText(currentOrigin);
      setCopiedOrigin(true);
      setTimeout(() => setCopiedOrigin(false), 2000);
    }
  };

  const handleConnect = async () => {
    setMessage(null);
    const idToUse = customClientId.trim();
    if (idToUse && !idToUse.includes('.apps.googleusercontent.com')) {
      setMessage({
        type: 'error',
        text: '輸入的字串格式不正確！Google 用戶端 ID (Client ID) 必定以「.apps.googleusercontent.com」結尾。您剛才貼上的看起來是「用戶端密碼 (Client Secret)」或 API 金鑰，請至 Google Cloud 複製標示為「用戶端 ID」的那一欄。',
      });
      return;
    }

    setIsProcessing(true);
    if (idToUse) {
      googleDriveService.setSavedClientId(idToUse);
    }
    const res = await onConnectDrive(idToUse || undefined);
    setIsProcessing(false);
    if (res.success) {
      setMessage({ type: 'success', text: '成功連接 Google Drive！已自動建立同步資料夾。' });
    } else if (res.error) {
      setMessage({ type: 'error', text: res.error });
    }
  };

  const handleManualSync = async () => {
    setMessage(null);
    setIsProcessing(true);
    const res = await onSyncNow();
    setIsProcessing(false);
    if (res.success) {
      setMessage({ type: 'success', text: '食譜已成功同步備份至 Google Drive 雲端硬碟！' });
    } else if (res.error) {
      setMessage({ type: 'error', text: res.error });
    }
  };

  const handleManualRestore = async () => {
    if (!window.confirm('還原將會比對並更新目前的食譜資料，確定要從 Google Drive 下載備份嗎？')) {
      return;
    }
    setMessage(null);
    setIsProcessing(true);
    const res = await onRestoreNow();
    setIsProcessing(false);
    if (res.success) {
      setMessage({ type: 'success', text: '成功從 Google Drive 還原雲端食譜資料！' });
    } else if (res.error) {
      setMessage({ type: 'error', text: res.error });
    }
  };

  const handleLocalJsonUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        const result = ExportService.parseImportedJson(text);
        if (result.success && result.recipes) {
          onImportRecipes(result.recipes);
          setMessage({ type: 'success', text: `成功從本機檔案匯入 ${result.recipes.length} 道食譜！` });
        } else {
          setMessage({ type: 'error', text: result.error || '匯入失敗' });
        }
      };
      reader.readAsText(file);
    }
  };

  const formatTimestamp = (ts: number | null) => {
    if (!ts) return '尚未同步過';
    return new Date(ts).toLocaleString('zh-TW', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-3xl border border-stone-200 shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-stone-200 bg-stone-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-600 border border-amber-500/20 flex items-center justify-center">
              <FolderSync className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-stone-900">Google Drive 雲端同步與備份</h2>
              <p className="text-xs text-stone-500">跨裝置同步食譜筆記，隨時離線編輯、連線自動備份</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Notification Messages */}
          {message && (
            <div
              className={`p-4 rounded-2xl border text-xs font-semibold flex items-start gap-2.5 ${
                message.type === 'success'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                  : 'bg-rose-50 border-rose-200 text-rose-800'
              }`}
            >
              {message.type === 'success' ? (
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              )}
              <span className="leading-relaxed">{message.text}</span>
            </div>
          )}

          {/* Drive Connection Status Card */}
          <div
            className={`p-5 rounded-2xl border transition-all ${
              driveStatus.isConnected
                ? 'bg-emerald-50/50 border-emerald-200'
                : 'bg-stone-50 border-stone-200'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                {driveStatus.isConnected && driveStatus.userAvatar ? (
                  <img
                    src={driveStatus.userAvatar}
                    alt="User"
                    className="w-12 h-12 rounded-full border-2 border-emerald-400"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-2xl bg-stone-200 text-stone-600 flex items-center justify-center">
                    <Cloud className="w-6 h-6" />
                  </div>
                )}
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-stone-900 text-sm">
                      {driveStatus.isConnected
                        ? driveStatus.userName || '已授權 Google 帳號'
                        : '尚未連接 Google Drive'}
                    </h3>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        driveStatus.isConnected
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-stone-200 text-stone-600'
                      }`}
                    >
                      {driveStatus.isConnected ? '已連線' : '未連線'}
                    </span>
                  </div>
                  <p className="text-xs text-stone-500 mt-0.5">
                    {driveStatus.isConnected
                      ? driveStatus.userEmail || '雲端硬碟已連接'
                      : '登入後可將食譜自動同步至您的 Google Drive 資料夾'}
                  </p>
                </div>
              </div>

              <div>
                {driveStatus.isConnected ? (
                  <button
                    onClick={onDisconnectDrive}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-600 hover:text-rose-600 hover:bg-rose-50 border border-stone-200 transition-colors"
                  >
                    解除綁定
                  </button>
                ) : (
                  <button
                    onClick={handleConnect}
                    disabled={isProcessing}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs shadow-md shadow-amber-500/20 transition-all active:scale-95 disabled:opacity-50"
                  >
                    {isProcessing ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <Cloud className="w-4 h-4" />
                    )}
                    <span>連接 Google Drive</span>
                  </button>
                )}
              </div>
            </div>

            {/* OAuth Client ID Setup & Guidance */}
            {!driveStatus.isConnected && (
              <div className="mt-3 pt-3 border-t border-stone-200/60">
                <div className="flex items-center justify-between mb-2">
                  <button
                    type="button"
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    className="text-xs text-amber-800 hover:text-amber-900 font-semibold underline flex items-center gap-1"
                  >
                    <span>{showAdvanced ? '收起 Google Client ID 設定' : '⚙️ 設定我的 Google OAuth Client ID（在 GitHub Pages 或自訂網域時必填）'}</span>
                  </button>
                </div>

                {showAdvanced && (
                  <div className="p-3.5 bg-amber-50/90 rounded-2xl border border-amber-200 text-xs text-stone-700 space-y-3">
                    <div className="font-bold text-amber-950 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0" />
                      <span>解決「401: invalid_client / OAuth client not found」步驟：</span>
                    </div>
                    <ol className="list-decimal pl-4 space-y-2 text-stone-700 leading-relaxed text-[11px] sm:text-xs">
                      <li>
                        前往{' '}
                        <a
                          href="https://console.cloud.google.com/apis/credentials"
                          target="_blank"
                          rel="noreferrer"
                          className="text-amber-800 underline font-semibold inline-flex items-center gap-0.5"
                        >
                          Google Cloud Console 憑證頁面 <ExternalLink className="w-3 h-3" />
                        </a>
                      </li>
                      <li>
                        點擊 <strong>「建立憑證」 &gt; 「OAuth 用戶端 ID」</strong>，應用程式類型選擇 <strong>「網頁應用程式 (Web application)」</strong>
                      </li>
                      <li>
                        在 <strong>「已授權的 JavaScript 來源 (Authorized JavaScript origins)」</strong> 點擊新增，填入您目前的網址：
                        <div className="mt-1 flex items-center gap-1.5">
                          <code className="px-2 py-1 bg-white rounded-lg border border-amber-300 font-mono text-[11px] text-amber-900 font-bold selection:bg-amber-200 break-all">
                            {currentOrigin}
                          </code>
                          <button
                            type="button"
                            onClick={handleCopyOrigin}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-200/80 hover:bg-amber-300 text-amber-950 font-bold text-[11px] transition-colors shrink-0"
                          >
                            {copiedOrigin ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-700" />
                                <span>已複製</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" />
                                <span>複製網址</span>
                              </>
                            )}
                          </button>
                        </div>
                      </li>
                      <li>
                        點擊建立後，將產生的 <strong>Client ID</strong> 複製貼在下方輸入框，點擊「儲存並連接」即可！
                      </li>
                    </ol>

                    <div className="pt-2 border-t border-amber-200/60">
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-xs font-bold text-stone-900">
                          您的 Google OAuth Client ID：
                        </label>
                        {customClientId.trim() && (
                          <button
                            type="button"
                            onClick={() => {
                              setCustomClientId('');
                              googleDriveService.setSavedClientId('');
                              setMessage(null);
                            }}
                            className="text-[10px] text-stone-500 hover:text-stone-800 underline cursor-pointer"
                          >
                            清空輸入
                          </button>
                        )}
                      </div>
                      <div className="flex flex-col sm:flex-row gap-2">
                        <input
                          type="text"
                          value={customClientId}
                          onChange={(e) => {
                            const val = e.target.value;
                            setCustomClientId(val);
                            if (val.trim()) {
                              googleDriveService.setSavedClientId(val.trim());
                            }
                          }}
                          placeholder="例如：494250935386-xxxxxx.apps.googleusercontent.com"
                          className={`flex-1 px-3.5 py-2 rounded-xl border text-xs bg-white text-stone-900 focus:outline-none focus:ring-2 font-mono ${
                            customClientId.trim().length > 0 && !customClientId.trim().includes('.apps.googleusercontent.com')
                              ? 'border-rose-400 focus:ring-rose-400/20 bg-rose-50/20'
                              : 'border-stone-300 focus:ring-amber-500/20'
                          }`}
                        />
                        <button
                          type="button"
                          onClick={handleConnect}
                          disabled={isProcessing}
                          className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs shadow-sm transition-all whitespace-nowrap disabled:opacity-50 flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          {isProcessing ? (
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Cloud className="w-3.5 h-3.5" />
                          )}
                          <span>儲存並連接</span>
                        </button>
                      </div>

                      {/* Real-time Validation Hint */}
                      {customClientId.trim().length > 0 && !customClientId.trim().includes('.apps.googleusercontent.com') && (
                        <div className="mt-2 p-2.5 bg-rose-50 rounded-xl border border-rose-200/90 text-xs text-rose-900 space-y-1">
                          <div className="flex items-center gap-1.5 font-bold text-rose-700">
                            <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
                            <span>格式錯誤：您貼上的不是「用戶端 ID (Client ID)」！</span>
                          </div>
                          <p className="text-[11px] text-rose-800 leading-relaxed pl-5">
                            您剛貼上的字串看起來是<strong>「用戶端密碼 (Client Secret)」</strong>或「API 金鑰」。
                            <br />
                            Google 網頁的 <strong>Client ID</strong> 格式一定長成：
                            <br />
                            <code className="bg-rose-100/80 px-1.5 py-0.5 rounded font-mono text-[10px] text-rose-950 font-bold break-all inline-block my-0.5">
                              [數字編號]-[英數字元].apps.googleusercontent.com
                            </code>
                            <br />
                            請回到 Google Cloud Console，複製標題為 <strong>「用戶端 ID (Client ID)」</strong> 那一欄（結尾必須是 <code>.apps.googleusercontent.com</code>）。
                          </p>
                        </div>
                      )}

                      {customClientId.trim().length > 0 && customClientId.trim().includes('.apps.googleusercontent.com') && (
                        <p className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1 mt-1.5">
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span>格式正確（有效的 Google OAuth Client ID 格式）</span>
                        </p>
                      )}

                      <p className="text-[10px] text-stone-500 mt-1">
                        * 輸入後會自動儲存在此瀏覽器，日後打開隨時可直接同步，無須重複設定。
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Sync Metadata Details */}
            {driveStatus.isConnected && (
              <div className="mt-4 pt-4 border-t border-emerald-200/60 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="flex items-center gap-2 text-stone-600">
                  <span className="text-stone-400">雲端資料夾：</span>
                  <span className="font-semibold text-stone-800">
                    {driveStatus.folderName}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-stone-600">
                  <span className="text-stone-400">上次同步時間：</span>
                  <span className="font-semibold text-stone-800">
                    {formatTimestamp(driveStatus.lastSyncTimestamp)}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Sync Operations (When Connected) */}
          {driveStatus.isConnected && (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-2xl bg-stone-50 border border-stone-200">
                <div>
                  <h4 className="font-bold text-sm text-stone-900">自動雲端同步 (Auto-Sync)</h4>
                  <p className="text-xs text-stone-500">當您新增、修改或刪除食譜時，自動在背景同步至 Google Drive</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={driveStatus.isAutoSync}
                    onChange={(e) => onToggleAutoSync(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-stone-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={handleManualSync}
                  disabled={isProcessing}
                  className="p-4 rounded-2xl border border-stone-200 hover:border-amber-400 hover:bg-amber-50/40 text-left transition-all group flex items-start gap-3"
                >
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
                    {isProcessing ? (
                      <RefreshCw className="w-5 h-5 animate-spin" />
                    ) : (
                      <Upload className="w-5 h-5" />
                    )}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-stone-900 group-hover:text-amber-600 transition-colors">
                      立即備份到 Google Drive
                    </h4>
                    <p className="text-xs text-stone-500 mt-0.5">
                      將目前的 {recipes.length} 道食譜完整上傳至雲端資料夾
                    </p>
                  </div>
                </button>

                <button
                  onClick={handleManualRestore}
                  disabled={isProcessing}
                  className="p-4 rounded-2xl border border-stone-200 hover:border-emerald-400 hover:bg-emerald-50/40 text-left transition-all group flex items-start gap-3"
                >
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
                    <Download className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-stone-900 group-hover:text-emerald-600 transition-colors">
                      從 Google Drive 還原
                    </h4>
                    <p className="text-xs text-stone-500 mt-0.5">
                      從雲端備份檔讀取並同步最新食譜清單
                    </p>
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* Cross-Device & Offline Explanation */}
          <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/70 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-amber-600" />
              <span>多裝置同步與離線備份說明</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-stone-700">
              <div className="flex items-start gap-2 bg-white/80 p-3 rounded-xl border border-amber-100">
                <Laptop className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-stone-900">手機與電腦即時切換：</span>
                  <p className="text-stone-600 mt-0.5">
                    在電腦上登入同一個 Google 帳號，食譜即時同步，下廚時用手機或平板看步驟最方便。
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2 bg-white/80 p-3 rounded-xl border border-amber-100">
                <HardDrive className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-stone-900">離線優先保護：</span>
                  <p className="text-stone-600 mt-0.5">
                    廚房網路不穩時依然可正常瀏覽與編輯，重新連上網路後將自動排程補傳。
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Local File Backup & Restore (Universal Fallback) */}
          <div className="space-y-3 pt-2 border-t border-stone-200">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400 flex items-center gap-2">
              <span>本機檔案匯出 / 匯入備份</span>
            </h4>
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => ExportService.exportRecipesAsJson(recipes)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold border border-stone-300 transition-colors"
              >
                <FileJson className="w-3.5 h-3.5 text-stone-600" />
                <span>下載 JSON 備份檔</span>
              </button>

              <label className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold border border-stone-300 cursor-pointer transition-colors">
                <Upload className="w-3.5 h-3.5 text-stone-600" />
                <span>從 JSON 檔案還原</span>
                <input
                  type="file"
                  accept=".json,application/json"
                  onChange={handleLocalJsonUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-stone-200 bg-stone-50 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-semibold text-xs shadow-sm transition-colors"
          >
            完成
          </button>
        </div>
      </div>
    </div>
  );
};
