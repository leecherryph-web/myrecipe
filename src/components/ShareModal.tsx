import React, { useState } from 'react';
import {
  X,
  Share2,
  Copy,
  Check,
  QrCode,
  Smartphone,
  FileText,
  Printer,
  Sparkles,
  ExternalLink,
  MessageSquare,
} from 'lucide-react';
import { Recipe } from '../types';
import { ShareService } from '../services/shareService';
import { ExportService } from '../services/exportService';

interface ShareModalProps {
  recipe: Recipe;
  servings?: number;
  onClose: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  recipe,
  servings,
  onClose,
}) => {
  const [shareMode, setShareMode] = useState<'link' | 'text' | 'qr'>('link');
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedText, setCopiedText] = useState(false);
  const [usePortableLink, setUsePortableLink] = useState(true);

  const directUrl = ShareService.getRecipeShareUrl(recipe.id);
  const portableUrl = ShareService.getPortableRecipeShareUrl(recipe);
  const currentShareUrl = usePortableLink ? portableUrl : directUrl;

  const plainTextContent = ExportService.recipeToPlainText(recipe, servings);
  const qrCodeUrl = ShareService.generateQrCodeSvg(currentShareUrl, 260);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(currentShareUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    } catch (e) {
      console.error('Failed to copy link:', e);
    }
  };

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(plainTextContent);
      setCopiedText(true);
      setTimeout(() => setCopiedText(false), 2500);
    } catch (e) {
      console.error('Failed to copy text:', e);
    }
  };

  const handleNativeShare = async () => {
    const success = await ShareService.triggerNativeShare({
      title: `【食譜筆記】${recipe.title}`,
      text: `${recipe.title} - ${recipe.description || '這是一份美味的料理食譜！'}`,
      url: currentShareUrl,
    });
    if (!success) {
      handleCopyLink();
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-3xl border border-stone-200 shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100 bg-stone-50/80">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-stone-900">分享食譜</h2>
              <p className="text-xs text-stone-500 truncate max-w-[240px]">
                {recipe.title}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="px-6 pt-4 pb-2 border-b border-stone-100">
          <div className="flex items-center p-1 bg-stone-100 rounded-xl gap-1">
            <button
              onClick={() => setShareMode('link')}
              className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                shareMode === 'link'
                  ? 'bg-white text-stone-900 shadow-sm'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>專屬連結</span>
            </button>
            <button
              onClick={() => setShareMode('text')}
              className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                shareMode === 'text'
                  ? 'bg-white text-stone-900 shadow-sm'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>文字排版 (LINE)</span>
            </button>
            <button
              onClick={() => setShareMode('qr')}
              className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                shareMode === 'qr'
                  ? 'bg-white text-stone-900 shadow-sm'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>掃描 QR Code</span>
            </button>
          </div>
        </div>

        {/* Body Content */}
        <div className="p-6 space-y-5">
          {/* Link Tab */}
          {shareMode === 'link' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-stone-700 block">
                  食譜分享專屬連結
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={currentShareUrl}
                    className="flex-1 px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-600 font-mono select-all focus:outline-none focus:border-amber-400"
                  />
                  <button
                    onClick={handleCopyLink}
                    className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-bold text-xs transition-all ${
                      copiedLink
                        ? 'bg-emerald-600 text-white'
                        : 'bg-amber-500 hover:bg-amber-400 text-stone-950 shadow-sm'
                    }`}
                  >
                    {copiedLink ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>已複製！</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>複製連結</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Portable mode toggle */}
              <div className="p-3 bg-amber-50/60 border border-amber-200/70 rounded-2xl flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div className="text-xs space-y-1">
                  <label className="font-semibold text-amber-900 flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={usePortableLink}
                      onChange={(e) => setUsePortableLink(e.target.checked)}
                      className="rounded text-amber-600 focus:ring-amber-500"
                    />
                    <span>內嵌完整食譜資料（對方無須登入即可一鍵開盒檢視）</span>
                  </label>
                  <p className="text-amber-800/80 text-[11px]">
                    開啟此選項後，連結中將包含食材、步驟與計時器設定，對方打開即可自動載入此食譜。
                  </p>
                </div>
              </div>

              {/* Native Share button */}
              {ShareService.canNativeShare() && (
                <button
                  onClick={handleNativeShare}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-semibold text-xs shadow-sm transition-all"
                >
                  <Smartphone className="w-4 h-4" />
                  <span>透過手機系統分享 (LINE / 訊息 / AirDrop)</span>
                </button>
              )}
            </div>
          )}

          {/* Text Tab */}
          {shareMode === 'text' && (
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-stone-700">
                    LINE / 聊天軟體專用格式 (已依 {servings || recipe.servings} 人份調整)
                  </label>
                  <button
                    onClick={handleCopyText}
                    className={`text-xs font-bold flex items-center gap-1 px-3 py-1 rounded-lg transition-colors ${
                      copiedText
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                    }`}
                  >
                    {copiedText ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedText ? '已複製全文' : '複製全部內容'}</span>
                  </button>
                </div>
                <textarea
                  readOnly
                  rows={8}
                  value={plainTextContent}
                  className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-700 font-mono leading-relaxed select-all"
                />
              </div>
            </div>
          )}

          {/* QR Code Tab */}
          {shareMode === 'qr' && (
            <div className="flex flex-col items-center justify-center text-center space-y-4 py-2">
              <div className="p-4 bg-white border border-stone-200 rounded-2xl shadow-md inline-block">
                <img
                  src={qrCodeUrl}
                  alt={`QR code for ${recipe.title}`}
                  className="w-48 h-48 mx-auto"
                />
              </div>
              <div>
                <h4 className="text-sm font-bold text-stone-900">手機相機掃描即可開啟</h4>
                <p className="text-xs text-stone-500 mt-0.5">
                  方便在廚房使用平板或另一台手機快速同步檢視食譜
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-stone-100 bg-stone-50 flex items-center justify-between text-xs text-stone-500">
          <button
            onClick={handlePrint}
            className="flex items-center gap-1 text-stone-600 hover:text-stone-900 font-medium"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>友善列印 / 存為 PDF</span>
          </button>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-stone-200 hover:bg-stone-300 text-stone-800 font-semibold transition-colors"
          >
            關閉
          </button>
        </div>
      </div>
    </div>
  );
};
