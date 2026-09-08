"use client";

import { useState, useRef } from "react";

export type InputDoc = { id: string; filename: string; rawText: string };

type Props = {
  onProcessData: (docs: InputDoc[]) => void;
};

let panelCounter = 0;

export default function InputPanel({ onProcessData }: Props) {
  const [manualText, setManualText] = useState("");
  const [pendingDocs, setPendingDocs] = useState<InputDoc[]>([]);
  const [processing, setProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const pendingDocsRef = useRef(pendingDocs);
  pendingDocsRef.current = pendingDocs;

  function uid() {
    return `inp_${++panelCounter}_${Date.now()}`;
  }

  function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const promises = Array.from(files).map(
      (file) =>
        new Promise<InputDoc>((resolve) => {
          const reader = new FileReader();
          reader.onload = (ev) => {
            resolve({ id: uid(), filename: file.name, rawText: (ev.target?.result as string) || "" });
          };
          reader.readAsText(file);
        })
    );

    Promise.all(promises).then((results) => {
      setPendingDocs((prev) => [...prev, ...results]);
    });

    e.target.value = "";
  }

  function handleAddManual() {
    if (!manualText.trim()) return;
    const name = `dokumen_${pendingDocs.length + 1}.txt`;
    setPendingDocs((prev) => [...prev, { id: uid(), filename: name, rawText: manualText.trim() }]);
    setManualText("");
  }

  function handleRemove(id: string) {
    setPendingDocs((prev) => prev.filter((d) => d.id !== id));
  }

  function handleProcess() {
    if (pendingDocs.length === 0) return;
    setProcessing(true);
    // ponytail: simulate async feel; swap to real async when backend exists
    setTimeout(() => {
      onProcessData(pendingDocsRef.current);
      setProcessing(false);
    }, 400);
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-300 p-5 md:p-6 space-y-5">
      <h3 className="text-sm font-semibold text-slate-700">Input Dokumen</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* File upload */}
        <div>
          <input ref={fileInputRef} type="file" accept=".txt" multiple onChange={handleFileUpload} className="hidden" />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full border-2 border-dashed border-slate-300 rounded-xl py-8 text-center text-sm text-slate-400 hover:border-brand hover:text-brand hover:bg-brand-light/30 transition-all cursor-pointer active:scale-[0.98]"
          >
            <svg className="w-8 h-8 mx-auto mb-2 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 16V4m0 0l-4 4m4-4l4 4M4 20h16" />
            </svg>
            Pilih File .txt
          </button>
        </div>

        {/* Manual input */}
        <div className="space-y-2">
          <textarea
            placeholder="isi teks manual disini"
            value={manualText}
            onChange={(e) => setManualText(e.target.value)}
            rows={4}
            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm resize-none bg-white focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-colors"
          />
          <button
            onClick={handleAddManual}
            disabled={!manualText.trim()}
            className="px-4 py-1.5 text-xs font-medium bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 active:scale-95 transition-all disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
          >
            + Tambah ke antrian
          </button>
        </div>
      </div>

      {/* Pending list */}
      {pendingDocs.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs text-slate-500">{pendingDocs.length} dokumen siap diproses:</p>
          {pendingDocs.map((d) => (
            <div key={d.id} className="flex items-center gap-3 text-xs border border-slate-200 rounded-xl px-3 py-2.5 bg-slate-50/50">
              <span className="flex-1 truncate font-medium text-slate-700">{d.filename}</span>
              <span className="text-slate-400 tabular-nums">{d.rawText.length} kar</span>
              <button onClick={() => handleRemove(d.id)} className="text-red-400 hover:text-red-600 cursor-pointer font-medium">
                Hapus
              </button>
            </div>
          ))}
        </div>
      )}

      <button
        onClick={handleProcess}
        disabled={pendingDocs.length === 0 || processing}
        className="px-6 py-2.5 text-sm font-semibold bg-brand text-white rounded-xl hover:bg-brand-dark active:scale-95 transition-all disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed shadow-sm"
      >
        {processing ? "Memproses..." : "Proses Teks"}
      </button>
    </div>
  );
}
