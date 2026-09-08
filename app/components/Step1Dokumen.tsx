"use client";

import { useState, useRef } from "react";
import StepExplanation from "./StepExplanation";
import InputPanel, { type InputDoc } from "./InputPanel";
import ExportResultPdfButton from "./ExportResultPdfButton";

type Row = { id: string; rawText: string };
type Step1Props = { onNavigate?: (step: number) => void };

export default function Step1Dokumen({ onNavigate }: Step1Props) {
  const [rows, setRows] = useState<Row[]>([]);
  const resultRef = useRef<HTMLDivElement>(null);

  function handleProcess(docs: InputDoc[]) {
    setRows(docs.map((d) => ({ id: d.id, rawText: d.rawText })));
  }

  return (
    <div className="space-y-6">
      <StepExplanation
        stepNumber="1"
        title="Dokumen"
        summary="Titik awal (Document). Unggah satu atau beberapa dokumen teks, atau tempel langsung. Butuh minimal 2 dokumen agar pembobotan TF-IDF dan indeks bermakna."
        theory="Dalam Sistem Temu Kembali Informasi (STKI / Search Engine), dokumen adalah file atau unit teks individual yang menjadi target pencarian. Kumpulan dari seluruh dokumen yang ada disebut korpus (corpus). Teks yang baru dimasukkan masih berupa 'teks mentah' yang memuat berbagai macam variasi penulisan seperti huruf besar-kecil, spasi berlebih, tanda baca, maupun karakter khusus. Sebelum komputer dapat memahami dan mencari isi dokumen secara otomatis, teks mentah ini harus dikumpulkan terlebih dahulu sebagai titik awal pemrosesan."
        concepts={[
          { term: "Dokumen", definition: "Satu berkas atau unit teks mandiri (misalnya satu artikel, berita, atau paragraf)." },
          { term: "Korpus (Corpus)", definition: "Kumpulan seluruh dokumen yang tersimpan dalam sistem pencarian." },
          { term: "Teks Mentah (Raw Text)", definition: "Teks asli apa adanya dari dokumen sebelum dibersihkan atau diproses." },
          { term: "Tahapan Pra-Pemrosesan (Pipeline)", definition: "Urutan langkah pembersihan teks: Dokumen -> Parsing -> Analisis Leksikal -> Stopword -> Stemming." },
        ]}
        formula="Koleksi = { Dokumen 1, Dokumen 2, ..., Dokumen N }"
        example={{
          input: 'File teks: "artikel_voli.txt"',
          output: '"Penerapan teknologi sensor pada olahraga bola voli dapat meningkatkan efektivitas pembelajaran di sekolah."',
          explanation: "Teks dibaca langsung dari sumbernya tanpa diubah sama sekali (panjang kalimat: 104 karakter)."
        }}
        details={[
          "<strong>Definisi Dokumen:</strong> Satu dokumen merupakan satu kesatuan teks utuh (seperti artikel berita, dokumen laporan, atau paragraf materi). Seluruh koleksi dokumen yang dimasukkan disebut korpus (corpus).",
          "<strong>Pengumpulan Teks Mentah (Raw Text):</strong> Tahap ini menampung data teks asli tanpa modifikasi. Format huruf kapital, simbol, angka, dan tanda baca dipertahankan sesuai file sumber.",
          "<strong>Urgensi Koleksi Multi-Dokumen:</strong> Sistem temu kembali informasi memerlukan perbandingan antar-dokumen. Pembobotan statistik TF-IDF membutuhkan minimal 2 dokumen untuk mengukur seberapa spesifik atau unik suatu kata terhadap dokumen tertentu."
        ]}
      />
      <InputPanel onProcessData={handleProcess} />
      {rows.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">Hasil Dokumen Mentah ({rows.length} Dokumen):</span>
            <ExportResultPdfButton
              resultRef={resultRef}
              title="Dokumen Mentah (Raw Text)"
              stepNumber="1"
            />
          </div>
          <div ref={resultRef} className="overflow-x-auto rounded-2xl border border-slate-200 shadow-sm bg-white p-4">
            <table className="w-full text-sm border-collapse table-auto">
            <thead>
              <tr className="bg-slate-800 text-white">
                <th className="px-4 py-3 text-left font-semibold w-24">Dok</th>
                <th className="px-4 py-3 text-left font-semibold">Raw Text</th>
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
                  <td className="px-4 py-3 text-slate-700 max-w-[600px]">
                    <p className="line-clamp-4 whitespace-pre-wrap">{r.rawText}</p>
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
