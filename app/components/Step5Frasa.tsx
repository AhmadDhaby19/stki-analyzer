"use client";

import { useState, useRef } from "react";
import StepExplanation from "./StepExplanation";
import InputPanel, { type InputDoc } from "./InputPanel";
import { processPhraseDetection } from "../lib/nlpEngine";
import ExportResultPdfButton from "./ExportResultPdfButton";

type Row = { id: string; rawText: string; phrases: string[] };

export default function Step5Frasa() {
  const [rows, setRows] = useState<Row[]>([]);
  const resultRef = useRef<HTMLDivElement>(null);

  function handleProcess(docs: InputDoc[]) {
    setRows(
      docs.map((d) => ({
        id: d.id,
        rawText: d.rawText,
        phrases: processPhraseDetection(d.rawText),
      }))
    );
  }

  return (
    <div className="space-y-6">
      <StepExplanation
        stepNumber="5"
        title="Deteksi Frasa"
        summary="Mendeteksi frasa atau multi-word expression berdasarkan kamus statis istilah domain."
        theory="Beberapa istilah tidak dapat dipisahkan menjadi satu kata tunggal karena artinya akan berubah. Frasa (gabungan kata) adalah gabungan dua kata atau lebih yang membentuk satu kesatuan arti khusus, seperti 'bola voli', 'pendidikan jasmani', atau 'teknik dasar'. Jika dipisah, kata 'bola' dan 'voli' memiliki arti masing-masing yang berbeda. Deteksi frasa bertujuan memastikan istilah khusus ini tetap dikenali sebagai satu konsep yang utuh saat dicari."
        concepts={[
          { term: "Frasa (Gabungan Kata)", definition: "Dua kata atau lebih yang bersama-sama membentuk satu makna istilah khusus (contoh: 'bola voli')." },
          { term: "Kamus Istilah", definition: "Daftar rujukan istilah baku khusus domain yang sudah didaftarkan ke dalam sistem." },
          { term: "Pencocokan Batas Kata", definition: "Metode pencarian kata yang teliti agar tidak keliru mengambil potongan kata lain." },
          { term: "Keutuhan Makna", definition: "Prinsip menjaga agar arti suatu istilah tidak terpotong menjadi bagian-bagian yang salah kaprah." },
        ]}
        formula="Frasa Ditemukan = Cari kecocokan gabungan kata pada Kamus Istilah Khusus"
        example={{
          input: '"Guru pendidikan jasmani mengevaluasi teknik dasar bola voli siswa."',
          output: '["pendidikan jasmani", "teknik dasar", "bola voli"]',
          explanation: "Sistem mengenali 3 istilah khusus dari teks berdasarkan kamus istilah."
        }}
        details={[
          "<strong>Pengenalan Gabungan Kata (Multi-Word Expression):</strong> Mengidentifikasi gabungan dua atau lebih kata yang membentuk satu makna istilah khusus (misalnya: 'bola voli', 'pendidikan jasmani', 'teknik dasar').",
          "<strong>Pencocokan Berbasis Kamus Istilah:</strong> Memindai teks dokumen menggunakan daftar istilah baku domain dan aturan batas kata (word boundary) agar tidak memotong kata lain secara keliru.",
          "<strong>Menjaga Keutuhan Makna:</strong> Mencegah pemisahan kata yang dapat merusak konteks topik, sehingga sistem memperlakukan frasa sebagai satu entitas konsep yang utuh saat pencarian."
        ]}
      />
      <InputPanel onProcessData={handleProcess} />
      {rows.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">Hasil Deteksi Frasa ({rows.length} Dokumen):</span>
            <ExportResultPdfButton
              resultRef={resultRef}
              title="Deteksi Frasa"
              stepNumber="5"
            />
          </div>
          <div ref={resultRef} className="overflow-x-auto rounded-2xl border border-slate-200 shadow-sm bg-white p-4">
            <table className="w-full text-sm border-collapse table-auto">
            <thead>
              <tr className="bg-slate-800 text-white">
                <th className="px-4 py-3 text-left font-semibold whitespace-nowrap w-20">Dok</th>
                <th className="px-4 py-3 text-left font-semibold">Raw Text</th>
                <th className="px-4 py-3 text-left font-semibold">Hasil Deteksi Frasa</th>
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
                  <td className="px-4 py-3 text-slate-700 max-w-[320px]">
                    <p className="line-clamp-4 whitespace-pre-wrap">{r.rawText}</p>
                  </td>
                  <td className="px-4 py-3 max-w-[300px]">
                    {r.phrases.length > 0 ? (
                      <div className="flex flex-wrap gap-1.5">
                        {r.phrases.map((phrase, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-violet-100 text-violet-800 border border-violet-200"
                          >
                            {phrase}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-slate-400 italic text-xs">Tidak ada frasa terdeteksi</span>
                    )}
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
