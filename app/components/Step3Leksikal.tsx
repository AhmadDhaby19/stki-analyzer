"use client";

import { useState, useRef } from "react";
import StepExplanation from "./StepExplanation";
import InputPanel, { type InputDoc } from "./InputPanel";
import { processParsing, processTokenization } from "../lib/nlpEngine";
import ExportResultPdfButton from "./ExportResultPdfButton";

type Row = { id: string; parsed: string; tokens: string[] };

export default function Step3Leksikal() {
  const [rows, setRows] = useState<Row[]>([]);
  const resultRef = useRef<HTMLDivElement>(null);

  function handleProcess(docs: InputDoc[]) {
    setRows(
      docs.map((d) => {
        const parsed = processParsing(d.rawText);
        const tokens = processTokenization(parsed);
        return { id: d.id, parsed, tokens };
      })
    );
  }

  return (
    <div className="space-y-6">
      <StepExplanation
        stepNumber="3"
        title="Analisis Leksikal"
        summary="Memotong teks hasil parsing menjadi unit-unit kata (token) dengan huruf kecil dan tanpa tanda baca."
        theory="Analisis leksikal adalah langkah untuk memotong kalimat panjang menjadi potongan kata-kata tunggal yang disebut token. Pada proses ini dilakukan dua hal utama: pertama, mengubah semua huruf besar menjadi huruf kecil (agar kata 'Sensor' dan 'sensor' dianggap sama), dan kedua, menghapus angka serta tanda baca (titik, koma, seru) agar kata tidak tercampur dengan simbol bacaan."
        concepts={[
          { term: "Huruf Kecil (Case Folding)", definition: "Menyeragamkan semua huruf menjadi huruf kecil agar mesin pencari tidak terpengaruh huruf kapital." },
          { term: "Pemotongan Kata (Tokenisasi)", definition: "Memecah teks kalimat menjadi daftar kata-kata individual yang terpisah." },
          { term: "Token", definition: "Satu unit kata mandiri hasil dari pemotongan kalimat." },
          { term: "Pembersihan Tanda Baca", definition: "Membuang simbol tanda baca dan angka agar kata yang tersisa bersih dan baku." },
        ]}
        formula="Daftar Kata = Potong per Spasi ( Huruf Kecil ( Hapus Tanda Baca ( Teks ) ) )"
        example={{
          input: '"Penerapan teknologi sensor pada olahraga bola voli!"',
          output: '["penerapan", "teknologi", "sensor", "pada", "olahraga", "bola", "voli"]',
          explanation: "Huruf 'P' berubah menjadi 'p', tanda seru '!' dibuang, lalu dipotong per kata menjadi 7 token."
        }}
        details={[
          "<strong>Penyeragaman Huruf (Case Folding):</strong> Mengubah seluruh huruf kapital menjadi huruf kecil. Langkah ini memastikan mesin mengenali bahwa kata 'Bola', 'BOLA', dan 'bola' adalah kata yang sama.",
          "<strong>Penghapusan Tanda Baca dan Angka:</strong> Menghilangkan titik, koma, tanda seru, angka, dan karakter non-huruf agar kata-kata tidak menempel pada tanda baca (misalnya agar 'voli!' terbaca sebagai 'voli').",
          "<strong>Pemotongan Menjadi Kata (Tokenisasi):</strong> Memecah kalimat panjang menjadi unit-unit kata individual (token) berdasarkan spasi sebagai batas pemisah."
        ]}
      />
      <InputPanel onProcessData={handleProcess} />
      {rows.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">Hasil Analisis Leksikal / Tokenisasi ({rows.length} Dokumen):</span>
            <ExportResultPdfButton
              resultRef={resultRef}
              title="Analisis Leksikal (Tokenisasi)"
              stepNumber="3"
            />
          </div>
          <div ref={resultRef} className="overflow-x-auto rounded-2xl border border-slate-200 shadow-sm bg-white p-4">
            <table className="w-full text-sm border-collapse table-auto">
            <thead>
              <tr className="bg-slate-800 text-white">
                <th className="px-4 py-3 text-left font-semibold whitespace-nowrap w-20">Dok</th>
                <th className="px-4 py-3 text-left font-semibold">Parsed Text</th>
                <th className="px-4 py-3 text-left font-semibold">Tokenisasi</th>
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
                  <td className="px-4 py-3 text-slate-600 max-w-[300px]">
                    <p className="line-clamp-4">{r.parsed}</p>
                  </td>
                  <td className="px-4 py-3 max-w-[320px]">
                    <div className="flex flex-wrap gap-1">
                      {r.tokens.map((t, idx) => (
                        <span key={idx} className="bg-teal-100 text-teal-800 px-2 py-0.5 rounded-full text-xs font-medium">
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
