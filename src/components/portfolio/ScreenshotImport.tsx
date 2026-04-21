"use client";

import { useState, useCallback, useRef } from "react";
import { Camera, Upload, X, Check, AlertCircle, Loader2, Trash2, Edit3 } from "lucide-react";
import type { Holding } from "@/types";
import type { ParsedHolding } from "@/lib/parsers/brokerage-parser";

interface ScreenshotImportProps {
  onImport: (holdings: Holding[]) => void;
  onClose: () => void;
}

type ImportStep = "upload" | "processing" | "review" | "error";

export default function ScreenshotImport({ onImport, onClose }: ScreenshotImportProps) {
  const [step, setStep] = useState<ImportStep>("upload");
  const [preview, setPreview] = useState<string | null>(null);
  const [parsedHoldings, setParsedHoldings] = useState<ParsedHolding[]>([]);
  const [selectedIndices, setSelectedIndices] = useState<Set<number>>(new Set());
  const [errorMsg, setErrorMsg] = useState("");
  const [progress, setProgress] = useState(0);
  const [editingIdx, setEditingIdx] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropRef = useRef<HTMLDivElement>(null);

  const processImage = useCallback(async (file: File) => {
    // 이미지 미리보기
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(file);

    setStep("processing");
    setProgress(10);

    try {
      // Tesseract.js 동적 임포트 (큰 라이브러리이므로)
      setProgress(20);
      const Tesseract = await import("tesseract.js");

      setProgress(30);
      const worker = await Tesseract.createWorker("kor+eng", undefined, {
        logger: (m: { progress: number }) => {
          if (m.progress) {
            setProgress(30 + Math.round(m.progress * 60));
          }
        },
      });

      setProgress(40);
      const { data } = await worker.recognize(file);
      setProgress(95);

      await worker.terminate();

      // 파서로 텍스트 분석
      const { parseBrokerageText, cleanParsedHoldings } = await import("@/lib/parsers/brokerage-parser");
      const raw = parseBrokerageText(data.text);
      const cleaned = cleanParsedHoldings(raw);

      setProgress(100);

      if (cleaned.length === 0) {
        setErrorMsg(
          "종목 정보를 인식하지 못했습니다. 스크린샷에 종목 리스트가 보이는지 확인해주세요.\n\n" +
          "인식된 텍스트:\n" + data.text.slice(0, 500)
        );
        setStep("error");
        return;
      }

      setParsedHoldings(cleaned);
      setSelectedIndices(new Set(cleaned.map((_, i) => i)));
      setStep("review");
    } catch (err) {
      console.error("OCR Error:", err);
      setErrorMsg("이미지 처리 중 오류가 발생했습니다. 다시 시도해주세요.");
      setStep("error");
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      processImage(file);
    }
  };

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith("image/")) {
        processImage(file);
      }
    },
    [processImage]
  );

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const toggleSelect = (idx: number) => {
    setSelectedIndices((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  };

  const toggleAll = () => {
    if (selectedIndices.size === parsedHoldings.length) {
      setSelectedIndices(new Set());
    } else {
      setSelectedIndices(new Set(parsedHoldings.map((_, i) => i)));
    }
  };

  const updateHolding = (idx: number, field: keyof ParsedHolding, value: string | number) => {
    setParsedHoldings((prev) => {
      const next = [...prev];
      next[idx] = { ...next[idx], [field]: value };
      // 수량 재계산
      if (field === "avgPrice" || field === "costAmount") {
        const h = next[idx];
        if (h.avgPrice > 0) {
          next[idx].shares = Math.round(h.costAmount / h.avgPrice);
        }
      }
      return next;
    });
  };

  const handleConfirmImport = () => {
    const selected = parsedHoldings.filter((_, i) => selectedIndices.has(i));
    const newHoldings: Holding[] = selected.map((h, i) => ({
      id: `import-${Date.now()}-${i}`,
      portfolioId: "demo",
      ticker: h.ticker,
      name: h.name,
      market: h.market,
      shares: h.shares,
      avgPrice: h.avgPrice,
      sector: h.sector,
      currentPrice: h.currentPrice,
      currentValue: h.currentValue,
      weight: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));
    onImport(newHoldings);
  };

  const formatKRW = (n: number) =>
    new Intl.NumberFormat("ko-KR").format(Math.round(n));

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <Camera className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                스크린샷으로 종목 추가
              </h2>
              <p className="text-sm text-slate-500">
                증권사 앱 캡처 화면에서 보유 종목을 자동으로 인식합니다
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Upload Step */}
          {step === "upload" && (
            <div
              ref={dropRef}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              className="border-2 border-dashed border-slate-300 rounded-xl p-12 text-center hover:border-blue-400 hover:bg-blue-50/50 transition-all cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Upload className="w-8 h-8 text-blue-600" />
              </div>
              <p className="text-lg font-medium text-slate-700 mb-2">
                증권사 앱 스크린샷을 업로드하세요
              </p>
              <p className="text-sm text-slate-500 mb-6">
                드래그 앤 드롭 또는 클릭하여 파일 선택
              </p>
              <div className="flex flex-wrap justify-center gap-2 text-xs text-slate-400">
                <span className="px-3 py-1 bg-slate-100 rounded-full">키움증권</span>
                <span className="px-3 py-1 bg-slate-100 rounded-full">미래에셋</span>
                <span className="px-3 py-1 bg-slate-100 rounded-full">한국투자증권</span>
                <span className="px-3 py-1 bg-slate-100 rounded-full">삼성증권</span>
                <span className="px-3 py-1 bg-slate-100 rounded-full">NH투자증권</span>
              </div>
              <p className="text-xs text-slate-400 mt-4">
                PNG, JPG, JPEG 지원 (최대 10MB)
              </p>
            </div>
          )}

          {/* Processing Step */}
          {step === "processing" && (
            <div className="text-center py-12">
              {preview && (
                <div className="mb-6 inline-block rounded-xl overflow-hidden border border-slate-200 shadow-sm">
                  <img
                    src={preview}
                    alt="업로드된 스크린샷"
                    className="max-h-48 object-contain"
                  />
                </div>
              )}
              <div className="flex items-center justify-center gap-3 mb-4">
                <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
                <p className="text-lg font-medium text-slate-700">
                  종목 정보를 인식하는 중...
                </p>
              </div>
              <div className="w-64 h-2 bg-slate-100 rounded-full mx-auto overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-sm text-slate-500 mt-3">
                {progress < 30
                  ? "OCR 엔진을 로딩하고 있습니다..."
                  : progress < 90
                  ? "한글/숫자 텍스트를 인식하고 있습니다..."
                  : "종목 데이터를 파싱하고 있습니다..."}
              </p>
            </div>
          )}

          {/* Review Step */}
          {step === "review" && (
            <div>
              <div className="flex items-center gap-4 mb-4">
                {preview && (
                  <div className="w-20 h-20 rounded-lg overflow-hidden border border-slate-200 flex-shrink-0">
                    <img
                      src={preview}
                      alt="스크린샷"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Check className="w-5 h-5 text-emerald-500" />
                    <p className="text-lg font-semibold text-slate-900">
                      {parsedHoldings.length}개 종목 인식 완료
                    </p>
                  </div>
                  <p className="text-sm text-slate-500">
                    인식된 종목을 확인하고 필요시 수정한 뒤 추가하세요. 잘못 인식된 항목은 체크 해제할 수 있습니다.
                  </p>
                </div>
              </div>

              {/* Holdings table */}
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-50 text-slate-500">
                      <th className="px-3 py-2.5">
                        <input
                          type="checkbox"
                          checked={selectedIndices.size === parsedHoldings.length}
                          onChange={toggleAll}
                          className="rounded border-slate-300"
                        />
                      </th>
                      <th className="px-3 py-2.5 text-left font-medium">종목명</th>
                      <th className="px-3 py-2.5 text-right font-medium">매입가</th>
                      <th className="px-3 py-2.5 text-right font-medium">현재가</th>
                      <th className="px-3 py-2.5 text-right font-medium">수량</th>
                      <th className="px-3 py-2.5 text-right font-medium">평가금액</th>
                      <th className="px-3 py-2.5 text-right font-medium">수익률</th>
                      <th className="px-3 py-2.5 text-center font-medium">섹터</th>
                      <th className="px-3 py-2.5 w-8"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {parsedHoldings.map((h, idx) => (
                      <tr
                        key={idx}
                        className={`transition-colors ${
                          selectedIndices.has(idx)
                            ? "bg-white hover:bg-slate-50"
                            : "bg-slate-50/50 opacity-50"
                        }`}
                      >
                        <td className="px-3 py-2.5 text-center">
                          <input
                            type="checkbox"
                            checked={selectedIndices.has(idx)}
                            onChange={() => toggleSelect(idx)}
                            className="rounded border-slate-300"
                          />
                        </td>
                        <td className="px-3 py-2.5">
                          {editingIdx === idx ? (
                            <input
                              type="text"
                              value={h.name}
                              onChange={(e) => updateHolding(idx, "name", e.target.value)}
                              className="w-full px-2 py-1 border border-blue-300 rounded text-sm focus:ring-1 focus:ring-blue-500 outline-none"
                              autoFocus
                            />
                          ) : (
                            <div>
                              <p className="font-medium text-slate-900 text-xs leading-tight">
                                {h.name}
                              </p>
                              <p className="text-[10px] text-slate-400">{h.ticker} · {h.market}</p>
                            </div>
                          )}
                        </td>
                        <td className="px-3 py-2.5 text-right text-slate-700 tabular-nums">
                          {editingIdx === idx ? (
                            <input
                              type="number"
                              value={h.avgPrice}
                              onChange={(e) => updateHolding(idx, "avgPrice", Number(e.target.value))}
                              className="w-24 px-2 py-1 border border-blue-300 rounded text-sm text-right focus:ring-1 focus:ring-blue-500 outline-none"
                            />
                          ) : (
                            formatKRW(h.avgPrice)
                          )}
                        </td>
                        <td className="px-3 py-2.5 text-right text-slate-700 tabular-nums">
                          {editingIdx === idx ? (
                            <input
                              type="number"
                              value={h.currentPrice}
                              onChange={(e) => updateHolding(idx, "currentPrice", Number(e.target.value))}
                              className="w-24 px-2 py-1 border border-blue-300 rounded text-sm text-right focus:ring-1 focus:ring-blue-500 outline-none"
                            />
                          ) : (
                            formatKRW(h.currentPrice)
                          )}
                        </td>
                        <td className="px-3 py-2.5 text-right text-slate-700 tabular-nums">
                          {editingIdx === idx ? (
                            <input
                              type="number"
                              value={h.shares}
                              onChange={(e) => updateHolding(idx, "shares", Number(e.target.value))}
                              className="w-20 px-2 py-1 border border-blue-300 rounded text-sm text-right focus:ring-1 focus:ring-blue-500 outline-none"
                            />
                          ) : (
                            formatKRW(h.shares)
                          )}
                        </td>
                        <td className="px-3 py-2.5 text-right font-medium text-slate-900 tabular-nums">
                          {formatKRW(h.currentValue)}
                        </td>
                        <td className="px-3 py-2.5 text-right tabular-nums">
                          <span
                            className={
                              h.returnRate >= 0 ? "text-red-500" : "text-blue-500"
                            }
                          >
                            {h.returnRate >= 0 ? "+" : ""}
                            {h.returnRate.toFixed(2)}%
                          </span>
                        </td>
                        <td className="px-3 py-2.5 text-center">
                          <span className="inline-block px-2 py-0.5 text-[10px] bg-slate-100 text-slate-600 rounded-full">
                            {h.sector}
                          </span>
                        </td>
                        <td className="px-3 py-2.5">
                          <button
                            onClick={() => setEditingIdx(editingIdx === idx ? null : idx)}
                            className={`p-1 rounded transition-colors ${
                              editingIdx === idx
                                ? "bg-blue-100 text-blue-600"
                                : "hover:bg-slate-100 text-slate-400"
                            }`}
                            title="수정"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-3 flex items-start gap-2 p-3 bg-amber-50 rounded-lg">
                <AlertCircle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-amber-700">
                  OCR 인식 결과는 완벽하지 않을 수 있습니다. 종목명, 매입가, 수량을 확인해주세요.
                  편집 아이콘(연필)을 클릭하면 값을 수정할 수 있습니다.
                </p>
              </div>
            </div>
          )}

          {/* Error Step */}
          {step === "error" && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-red-500" />
              </div>
              <p className="text-lg font-medium text-slate-700 mb-2">
                인식 실패
              </p>
              <p className="text-sm text-slate-500 whitespace-pre-wrap max-w-lg mx-auto mb-6">
                {errorMsg}
              </p>
              <button
                onClick={() => {
                  setStep("upload");
                  setPreview(null);
                  setErrorMsg("");
                }}
                className="bg-blue-600 hover:bg-blue-500 text-white font-medium px-5 py-2.5 rounded-lg transition-colors text-sm"
              >
                다시 시도
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        {step === "review" && (
          <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
            <p className="text-sm text-slate-500">
              <span className="font-medium text-slate-700">{selectedIndices.size}</span>개 종목 선택됨
              {selectedIndices.size > 0 && (
                <span className="ml-2">
                  (총 평가금액:{" "}
                  <span className="font-medium text-slate-700">
                    {formatKRW(
                      parsedHoldings
                        .filter((_, i) => selectedIndices.has(i))
                        .reduce((sum, h) => sum + h.currentValue, 0)
                    )}
                    원
                  </span>
                  )
                </span>
              )}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setStep("upload");
                  setPreview(null);
                  setParsedHoldings([]);
                }}
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
              >
                다시 업로드
              </button>
              <button
                onClick={handleConfirmImport}
                disabled={selectedIndices.size === 0}
                className="bg-blue-600 hover:bg-blue-500 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-medium px-6 py-2 rounded-lg transition-colors text-sm inline-flex items-center gap-2"
              >
                <Check className="w-4 h-4" />
                {selectedIndices.size}개 종목 추가
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
