"use client";

import { useState, useRef } from "react";
import StepExplanation from "./StepExplanation";
import InputPanel, { type InputDoc } from "./InputPanel";
import { processParsing } from "../lib/nlpEngine";
import ExportResultPdfButton from "./ExportResultPdfButton";

type Row = { id: string; rawText: string; parsed: string };

export default function Step2Parsing() {
  const [rows, setRows] = useState<Row[]>([]);
  const resultRef = useRef<HTMLDivElement>(null);

  function handleProcess(docs: InputDoc[]) {
    setRows(docs.map((d) => ({ id: d.id, rawText: d.rawText, parsed: processParsing(d.rawText) })));
  }

  return (
    <div className="space-y-6">
      <StepExplanation
        stepNumber="2"
        title="Parsing"
        summary="Pembersihan struktural dokumen. Menghapus tag HTML, merapikan baris baru, dan menstandarkan spasi."
        theory="Parsing adalah proses pembersihan struktur teks agar bebas dari format tampilan web atau dokumen digital. Dokumen sering kali mengandung kode tag HTML (seperti <p>, <b>), baris baru (enter), serta spasi berlebih yang bukan merupakan bagian inti dari isi bacaan. Melalui tahapan ini, seluruh kode pemformatan dibuang sehingga menyisakan teks bersih yang siap diproses ke tahap berikutnya."
        concepts={[
          { term: "Pembersihan Tag (HTML Stripping)", definition: "Menghapus kode format web seperti <p> atau <div> agar tersisa teks bacaan murni." },
          { term: "Perataan Spasi (Whitespace Normalization)", definition: "Mengubah spasi ganda, tab, atau baris baru (enter) menjadi satu spasi biasa." },
          { term: "Pemotongan Ujung (Trimming)", definition: "Menghapus spasi kosong yang tidak sengaja berada di awal atau akhir kalimat." },
          { term: "Teks Bersih (Clean Text)", definition: "Hasil akhir teks yang rapi dan siap dipotong menjadi kata-kata." },
        ]}
        formula="Teks Bersih = Bersihkan( Teks Mentah dari Tag HTML, Enter, dan Spasi Ganda )"
        example={{
          input: '<p>Teknologi\r\nsensor <b>bola</b>   voli</p>',
          output: 'Teknologi sensor bola voli',
          explanation: "Tag <p> dan <b> dihapus, tombol enter dan spasi berlebih dirapikan menjadi satu spasi."
        }}
        details={[
          "<strong>Pembersihan Tag HTML (Markup Stripping):</strong> Membuang tag format tampilan web seperti &lt;p&gt;, &lt;b&gt;, atau &lt;div&gt; agar sistem hanya memproses teks bacaan murni.",
          "<strong>Penyeragaman Baris Baru:</strong> Mengubah karakter pemutus baris (enter / newline seperti \\r\\n) menjadi spasi tunggal sehingga teks tersusun menjadi satu paragraf kontinu.",
          "<strong>Normalisasi Spasi:</strong> Menghapus spasi ganda yang berlebih dan membersihkan spasi kosong di awal serta akhir kalimat (trimming) untuk mencegah kekeliruan pembacaan kata."
        ]}
      />
      <InputPanel onProcessData={handleProcess} />
      {rows.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">Hasil Parsing ({rows.length} Dokumen):</span>
            <ExportResultPdfButton
              resultRef={resultRef}
              title="Hasil Parsing Teks"
              stepNumber="2"
            />
          </div>
          <div ref={resultRef} className="overflow-x-auto rounded-2xl border border-slate-200 shadow-sm bg-white p-4">
            <table className="w-full text-sm border-collapse table-auto">
            <thead>
              <tr className="bg-slate-800 text-white">
                <th className="px-4 py-3 text-left font-semibold whitespace-nowrap w-20">Dok</th>
                <th className="px-4 py-3 text-left font-semibold">Raw Text</th>
                <th className="px-4 py-3 text-left font-semibold">Parsed Text</th>
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
                    <p className="line-clamp-4 whitespace-pre-wrap">{r.rawText}</p>
                  </td>
                  <td className="px-4 py-3 text-slate-700 max-w-[300px]">
                    <p className="line-clamp-4">{r.parsed}</p>
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
