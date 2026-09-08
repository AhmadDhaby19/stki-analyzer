"use client";

import { useState, useRef } from "react";
import StepExplanation from "./StepExplanation";
import InputPanel, { type InputDoc } from "./InputPanel";
import { processParsing, processTokenization, processFiltering } from "../lib/nlpEngine";
import ExportResultPdfButton from "./ExportResultPdfButton";

type Row = { id: string; tokens: string[]; filtered: string[] };

export default function Step4Stopword() {
  const [rows, setRows] = useState<Row[]>([]);
  const resultRef = useRef<HTMLDivElement>(null);

  function handleProcess(docs: InputDoc[]) {
    setRows(
      docs.map((d) => {
        const tokens = processTokenization(processParsing(d.rawText));
        const filtered = processFiltering(tokens);
        return { id: d.id, tokens, filtered };
      })
    );
  }

  return (
    <div className="space-y-6">
      <StepExplanation
        stepNumber="4"
        title="Penghapusan Stopword"
        summary="Menghilangkan kata hubung dan partikel umum yang tidak bermakna spesifik dari daftar token."
        theory="Stopword adalah kata-kata umum yang sangat sering muncul di hampir setiap kalimat tetapi tidak memiliki arti khusus atau informasi topik penting (contohnya kata penghubung dan kata depan seperti 'dan', 'di', 'ke', 'dari', 'yang', 'pada'). Jika kata-kata umum ini tidak dibuang, sistem pencarian akan terbebani oleh kata yang tidak berguna. Menghapus stopword dapat meringankan ukuran penyimpanan data hingga 30-50% dan membuat hasil pencarian jauh lebih tepat pada inti topik yang dicari."
        concepts={[
          { term: "Kata Henti (Stopword)", definition: "Kata umum pelengkap kalimat yang tidak membawa arti topik utama (contoh: 'yang', 'di', 'pada')." },
          { term: "Daftar Kata Henti (Stopword List)", definition: "Daftar kata-kata tugas bahasa Indonesia yang ditentukan untuk disaring dan dihapus." },
          { term: "Penyaringan (Filtering)", definition: "Proses membuang kata yang ada di dalam daftar kata henti dan mempertahankan kata-kata bermakna." },
          { term: "Efisiensi Data", definition: "Pengurangan jumlah kata yang disimpan sehingga sistem pencarian bekerja lebih cepat dan hemat memori." },
        ]}
        formula="Kata Hasil Filter = Simpan kata yang BUKAN merupakan Stopword"
        example={{
          input: '["penerapan", "teknologi", "sensor", "pada", "olahraga", "bola", "voli", "dapat", "di", "sekolah"]',
          output: '["penerapan", "teknologi", "sensor", "olahraga", "bola", "voli", "sekolah"]',
          explanation: 'Kata "pada", "dapat", dan "di" dihapus karena merupakan kata umum. Total kata berkurang dari 10 menjadi 7 kata penting.'
        }}
        details={[
          "<strong>Penyaringan Kata Tugas (Stopword Filtering):</strong> Memeriksa setiap token kata terhadap daftar kata umum Bahasa Indonesia (seperti 'yang', 'di', 'dan', 'pada', 'dengan', 'adalah').",
          "<strong>Mengapa Dihapus:</strong> Kata-kata tugas memiliki frekuensi kemunculan sangat tinggi di hampir seluruh tulisan, namun tidak memiliki informasi topik khusus untuk membedakan satu dokumen dari dokumen lain.",
          "<strong>Dampak Pembersihan:</strong> Mengurangi volume data teks hingga 30-50%, meringankan beban penyimpanan indeks, dan meningkatkan ketepatan pencarian informasi."
        ]}
      />
      <InputPanel onProcessData={handleProcess} />
      {rows.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">Hasil Filtering Stopword ({rows.length} Dokumen):</span>
            <ExportResultPdfButton
              resultRef={resultRef}
              title="Penghapusan Stopword (Filtering)"
              stepNumber="4"
            />
          </div>
          <div ref={resultRef} className="overflow-x-auto rounded-2xl border border-slate-200 shadow-sm bg-white p-4">
            <table className="w-full text-sm border-collapse table-auto">
            <thead>
              <tr className="bg-slate-800 text-white">
                <th className="px-4 py-3 text-left font-semibold whitespace-nowrap w-20">Dok</th>
                <th className="px-4 py-3 text-left font-semibold">Tokenisasi</th>
                <th className="px-4 py-3 text-left font-semibold">Hasil Filtering</th>
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
                      {r.tokens.map((t, idx) => (
                        <span key={idx} className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full text-xs font-medium">
                          {t}
                        </span>
                      ))}
                    </div>
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
