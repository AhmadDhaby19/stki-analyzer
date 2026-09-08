"use client";

import { useState, useRef } from "react";
import StepExplanation from "./StepExplanation";
import InputPanel, { type InputDoc } from "./InputPanel";
import { calculateTFIDF, buildInvertedIndex, type InvertedIndex } from "../lib/nlpEngine";
import ExportResultPdfButton from "./ExportResultPdfButton";

export default function Step8Pengindeksan() {
  const [index, setIndex] = useState<InvertedIndex>({});
  const [docMap, setDocMap] = useState<Record<string, string>>({});
  const resultRef = useRef<HTMLDivElement>(null);

  function handleProcess(docs: InputDoc[]) {
    const mapping: Record<string, string> = {};
    docs.forEach((d, i) => {
      mapping[d.id] = `D${i + 1}`;
    });
    setDocMap(mapping);

    const tfidfData = calculateTFIDF(docs);
    setIndex(buildInvertedIndex(tfidfData));
  }

  const terms = Object.keys(index);

  return (
    <div className="space-y-6">
      <StepExplanation
        stepNumber="8"
        title="Pengindeksan"
        summary="Membangun Inverted Index yang memetakan setiap term kata ke posting list (daftar kemunculan dokumen beserta bobot TF-IDF)."
        theory="Inverted Index adalah struktur data indeks terbalik yang menjadi fondasi mesin pencari modern. Pada metode konvensional (Forward Index: Dokumen &rarr; Kata), pencarian kata kunci harus membaca ulang seluruh dokumen dari awal sampai akhir, yang memakan waktu lama seiring bertambahnya jumlah koleksi dokumen. Inverted Index membalik arah hubungan menjadi 'Kata &rarr; Daftar Dokumen' (Posting List). Setiap kata langsung menyimpan daftar dokumen mana saja yang memuatnya beserta nilai bobot relevansinya. Akibatnya, mesin pencari tidak perlu membaca jutaan dokumen mentah, melainkan cukup membuka daftar posting list dari kata kunci yang dicari saja."
        concepts={[
          { term: "Indeks Terbalik (Inverted Index)", definition: "Struktur data yang memetakan setiap kata ke daftar dokumen yang memuatnya (kebalikan dari daftar dokumen ke kata)." },
          { term: "Daftar Dokumen (Posting List)", definition: "Daftar pasangan ID dokumen dan nilai bobot relevansi untuk satu kata tertentu, diurutkan dari bobot tertinggi." },
          { term: "Nilai Bobot Dokumen", definition: "Nilai skor TF-IDF yang langsung disimpan di dalam indeks agar mesin tidak perlu menghitung ulang saat pencarian." },
          { term: "Efisiensi Pencarian", definition: "Pencarian berlangsung cepat karena mesin langsung mengambil daftar dokumen terkait tanpa membaca isi seluruh file." },
        ]}
        formula="Indeks Kata = Daftar Dokumen yang Memuat Kata Tersebut + Nilai Bobotnya"
        example={{
          input: 'Kata: "sensor" pada 3 dokumen',
          output: 'sensor -> [{ Dokumen: "D1", Bobot: 0.277 }, { Dokumen: "D3", Bobot: 0.185 }]',
          explanation: 'Dokumen D2 tidak dicatat karena tidak memuat kata "sensor". Urutan disusun dari bobot terbesar.'
        }}
        details={[
          "<strong>Konsep Inverted Index (Indeks Terbalik):</strong> Membalik struktur pencarian dari 'Dokumen &rarr; Kata' menjadi 'Kata &rarr; Dokumen', serupa dengan indeks daftar istilah di halaman belakang buku cetak.",
          "<strong>Daftar Kemunculan (Posting List):</strong> Untuk setiap kata, sistem mencatat daftar dokumen yang memuat kata tersebut beserta nilai bobot relevansi TF-IDF masing-masing dokumen.",
          "<strong>Pencarian Cepat Seketika:</strong> Ketika pengguna mencari suatu kata kunci, sistem langsung membuka daftar dokumen terkait tanpa perlu membaca ulang seluruh teks dokumen satu per satu."
        ]}
      />
      <InputPanel onProcessData={handleProcess} />
      {terms.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">Hasil Inverted Index ({terms.length} Kata Terindeks):</span>
            <ExportResultPdfButton
              resultRef={resultRef}
              title="Pengindeksan (Inverted Index)"
              stepNumber="8"
            />
          </div>
          <div ref={resultRef} className="overflow-x-auto rounded-2xl border border-slate-200 shadow-sm bg-white p-4">
            <table className="w-full text-sm border-collapse table-auto">
            <thead>
              <tr className="bg-slate-800 text-white">
                <th className="px-4 py-3 text-left font-semibold w-1/4">Term</th>
                <th className="px-4 py-3 text-left font-semibold w-1/2">
                  List Dokumen (Posting List)
                </th>
                <th className="px-4 py-3 text-left font-semibold w-1/4">Bobot</th>
              </tr>
            </thead>
            <tbody>
              {terms.map((term, i) => {
                const entries = index[term] ?? [];
                return (
                  <tr
                    key={term}
                    className={`border-t border-slate-200 transition-colors hover:bg-slate-100 ${
                      i % 2 === 1 ? "bg-slate-50" : "bg-white"
                    }`}
                  >
                    <td className="px-4 py-2.5 font-medium text-brand">{term}</td>
                    <td className="px-4 py-2.5">
                      <div className="flex flex-wrap gap-1.5">
                        {entries.map((e) => (
                          <span key={e.docId} className="bg-teal-100 text-teal-800 px-2 py-0.5 rounded-full text-xs font-medium">
                            {docMap[e.docId] || e.docId} ({e.weight.toFixed(3)})
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-2.5 text-slate-700 font-mono text-xs tabular-nums">
                      {entries.map((e) => e.weight.toFixed(3)).join(", ")}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          </div>
        </div>
      )}
    </div>
  );
}
