import React, { useState } from 'react';
import {
  X,
  Copy,
  Download,
  Printer,
  FileText,
  FileCode,
  Check,
  Share2,
  Cloud,
} from 'lucide-react';
import { Recipe } from '../types';
import { ExportService } from '../services/exportService';

interface ExportModalProps {
  recipe: Recipe | null;
  allRecipes: Recipe[];
  currentServings?: number;
  isOpen: boolean;
  onClose: () => void;
  onOpenDriveModal?: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  recipe,
  allRecipes,
  currentServings,
  isOpen,
  onClose,
  onOpenDriveModal,
}) => {
  const [activeTab, setActiveTab] = useState<'markdown' | 'text' | 'json' | 'allMarkdown'>('markdown');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const targetRecipe = recipe || allRecipes[0];
  if (!targetRecipe && activeTab !== 'allMarkdown') return null;

  let contentText = '';
  let filename = 'recipe.txt';
  let mimeType = 'text/plain;charset=utf-8';

  if (activeTab === 'markdown') {
    contentText = ExportService.recipeToMarkdown(targetRecipe, currentServings);
    filename = `${targetRecipe.title}_食譜筆記.md`;
    mimeType = 'text/markdown;charset=utf-8';
  } else if (activeTab === 'text') {
    contentText = ExportService.recipeToPlainText(targetRecipe, currentServings);
    filename = `${targetRecipe.title}_分享文字.txt`;
  } else if (activeTab === 'json') {
    contentText = JSON.stringify(targetRecipe, null, 2);
    filename = `${targetRecipe.title}.json`;
    mimeType = 'application/json;charset=utf-8';
  } else if (activeTab === 'allMarkdown') {
    contentText = ExportService.allRecipesToMarkdown(allRecipes);
    filename = '我的全部食譜筆記手札.md';
    mimeType = 'text/markdown;charset=utf-8';
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(contentText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    ExportService.downloadFile(contentText, filename, mimeType);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto no-print">
      <div className="bg-white rounded-3xl border border-stone-200 shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-stone-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-stone-900">
                匯出與分享食譜
              </h2>
              <p className="text-xs text-stone-500">
                支援 Markdown、通訊軟體純文字、JSON 格式與列印 PDF
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-2 px-6 pt-4 pb-2 border-b border-stone-100 overflow-x-auto">
          <button
            onClick={() => setActiveTab('markdown')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'markdown'
                ? 'bg-stone-900 text-white shadow-xs'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Markdown 格式</span>
          </button>

          <button
            onClick={() => setActiveTab('text')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'text'
                ? 'bg-stone-900 text-white shadow-xs'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>通訊軟體簡訊格式</span>
          </button>

          <button
            onClick={() => setActiveTab('json')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'json'
                ? 'bg-stone-900 text-white shadow-xs'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>JSON 檔案</span>
          </button>

          <button
            onClick={() => setActiveTab('allMarkdown')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'allMarkdown'
                ? 'bg-stone-900 text-white shadow-xs'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>全部食譜大合輯 ({allRecipes.length} 道)</span>
          </button>
        </div>

        {/* Google Drive Cloud Backup Direct Link */}
        {onOpenDriveModal && (
          <div className="mx-6 mt-3 p-3 bg-amber-50 rounded-2xl border border-amber-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            <div className="flex items-center gap-2 text-xs text-amber-950 font-medium">
              <Cloud className="w-4 h-4 text-amber-600 shrink-0" />
              <span>除了下載檔案，您也可以直接同步備份至 Google Drive 雲端資料夾：</span>
            </div>
            <button
              type="button"
              onClick={onOpenDriveModal}
              className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs shadow-xs transition-colors shrink-0"
            >
              <Cloud className="w-3.5 h-3.5" />
              <span>開啟 Google Drive 雲端同步與備份</span>
            </button>
          </div>
        )}

        {/* Preview Area */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="relative">
            <textarea
              readOnly
              value={contentText}
              rows={14}
              className="w-full p-4 rounded-2xl bg-stone-900 text-stone-100 font-mono text-xs leading-relaxed border border-stone-800 focus:outline-none resize-none select-all"
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-stone-200 bg-stone-50 flex items-center justify-between gap-3">
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-stone-300 bg-white hover:bg-stone-100 text-stone-700 text-xs font-semibold shadow-xs transition-colors"
          >
            <Printer className="w-4 h-4 text-stone-500" />
            <span>列印 / 另存為 PDF</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-stone-300 bg-white hover:bg-stone-100 text-stone-700 text-xs font-semibold shadow-xs transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-600 font-bold">已複製！</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>複製到剪貼簿</span>
                </>
              )}
            </button>

            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs shadow-md shadow-amber-500/20 transition-transform active:scale-95"
            >
              <Download className="w-4 h-4" />
              <span>下載檔案</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
