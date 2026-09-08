"use client";

import { useState, useRef } from "react";
import StepExplanation from "./StepExplanation";
import InputPanel, { type InputDoc } from "./InputPanel";
import {
  processParsing,
  processTokenization,
  processFiltering,
  processStemming,
} from "../lib/nlpEngine";
import ExportResultPdfButton from "./ExportResultPdfButton";

type Row = { id: string; filtered: string[]; stemmed: string[] };

export default function Step6Stemming() {
  const [rows, setRows] = useState<Row[]>([]);
  const resultRef = useRef<HTMLDivElement>(null);

  function handleProcess(docs: InputDoc[]) {
    setRows(
      docs.map((d) => {
        const parsed = processParsing(d.rawText);
        const tokens = processTokenization(parsed);
        const filtered = processFiltering(tokens);
        const stemmed = processStemming(filtered);
        return { id: d.id, filtered, stemmed };
      })
    );
  }

  return (
    <div className="space-y-6">
      <StepExplanation
        stepNumber="6"
        title="Stemming"
        summary="Mengubah kata berimbuhan menjadi bentuk dasar menggunakan aturan pola afiks (prefiks dan sufiks)."
        theory="Stemming adalah proses mengubah kata berimbuhan menjadi kata dasar dengan cara memotong awalan (seperti me-, ber-, pe-, di-) dan akhiran (seperti -kan, -an, -i). Dalam bahasa Indonesia, satu kata dasar bisa memiliki banyak variasi (misalnya: belajar, pembelajaran, diajarkan). Dengan mengembalikan semuanya ke kata dasar 'ajar', mesin pencari dapat menemukan dokumen yang tepat meskipun kata yang diketik pengguna memiliki imbuhan yang berbeda dari teks di dokumen."
        concepts={[
          { term: "Stemming", definition: "Proses pemotongan imbuhan untuk mendapatkan bentuk kata dasar." },
          { term: "Kata Dasar", definition: "Bentuk asli kata sebelum mendapat awalan, sisipan, atau akhiran." },
          { term: "Imbuhan (Afiks)", definition: "Tambahan pada kata berupa awalan (prefiks) atau akhiran (sufiks)." },
          { term: "Penyatuan Bentuk Kata", definition: "Menyamakan berbagai variasi kata berimbuhan ke satu kata dasar yang sama agar pencarian lebih akurat." },
        ]}
        formula="Kata Dasar = Hapus Imbuhan Awalan dan Akhiran dari Kata"
        example={{
          input: '["penerapan", "teknologi", "pembelajaran", "meningkatkan", "efektivitas"]',
          output: '["terap", "teknologi", "ajar", "tingkat", "efektivitas"]',
          explanation: 'Kata "penerapan" diubah ke kata dasar "terap", "pembelajaran" ke "ajar", dan "meningkatkan" ke "tingkat".'
        }}
        details={[
          "<strong>Pengurangan Imbuhan (Stemming):</strong> Menghapus awalan (seperti me-, ber-, pe-, di-), akhiran (seperti -kan, -an, -i), dan partikel sambung (seperti -lah, -kah, -nya) untuk menemukan kata dasar.",
          "<strong>Penyatuan Variasi Kata:</strong> Menyeragamkan bentuk kata yang berakar sama (contohnya kata 'pembelajaran', 'belajar', dan 'diajarkan' semuanya dikembalikan ke kata dasar 'ajar').",
          "<strong>Manfaat Pencarian:</strong> Meningkatkan kemampuan mesin pencari dalam menemukan dokumen relevan meskipun kata kunci yang diketik pengguna memiliki imbuhan yang berbeda dari teks dokumen."
        ]}
      />
      <InputPanel onProcessData={handleProcess} />
      {rows.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">Hasil Stemming / Kata Dasar ({rows.length} Dokumen):</span>
            <ExportResultPdfButton
              resultRef={resultRef}
              title="Stemming (Kata Dasar)"
              stepNumber="6"
            />
          </div>
          <div ref={resultRef} className="overflow-x-auto rounded-2xl border border-slate-200 shadow-sm bg-white p-4">
            <table className="w-full text-sm border-collapse table-auto">
            <thead>
              <tr className="bg-slate-800 text-white">
                <th className="px-4 py-3 text-left font-semibold whitespace-nowrap w-20">Dok</th>
                <th className="px-4 py-3 text-left font-semibold">Hasil Filtering</th>
                <th className="px-4 py-3 text-left font-semibold">Hasil Stemming</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr
                  key={r.id}
                  className={`border-t border-slate-200 align-top transition-colors hover:bg-slate-100 ${
                    i % 2 === 1 ? "bg-slate-50" : "bg-white"
                  }`}
                >
                  <td className="px-4 py-3 font-semibold text-brand whitespace-nowrap">
                    D{i + 1}
                  </td>
                  <td className="px-4 py-3 max-w-[300px]">
                    <div className="flex flex-wrap gap-1">
                      {r.filtered.map((t, idx) => (
                        <span key={idx} className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full text-xs font-medium">
                          {t}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3 max-w-[300px]">
                    <div className="flex flex-wrap gap-1">
                      {r.stemmed.map((t, idx) => (
                        <span key={idx} className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full text-xs font-medium">
                          {t}
                        </span>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </div>
      )}
    </div>
  );
}
