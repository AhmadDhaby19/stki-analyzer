"use client";

import { useState } from "react";
import { exportElementToPdf } from "../lib/exportPdf";

interface ExportResultPdfButtonProps {
  resultRef: React.RefObject<HTMLElement | null>;
  title: string;
  stepNumber: number | string;
  disabled?: boolean;
}

export default function ExportResultPdfButton({
  resultRef,
  title,
  stepNumber,
  disabled = false,
}: ExportResultPdfButtonProps) {
  const [loading, setLoading] = useState(false);

  async function handleDownload() {
    if (!resultRef.current || loading) return;
    setLoading(true);
    try {
      await exportElementToPdf(resultRef.current, { title, stepNumber });
    } catch (error: any) {
      console.error("Gagal mengekspor PDF:", error);
      alert(error?.message || "Terjadi kesalahan saat memproses ekspor PDF.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleDownload}
      disabled={disabled || loading}
      className="no-print inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-rose-700 to-rose-800 hover:from-rose-800 hover:to-rose-900 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-semibold rounded-xl shadow-sm hover:shadow-md transition-all active:scale-95 cursor-pointer"
      title="Cetak atau Simpan PDF Laporan Hasil Langkah Ini"
    >
      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
      </svg>
      <span>Download PDF Hasil</span>
    </button>
  );
}
