"use client";

import { useState, useRef } from "react";
import StepExplanation from "./StepExplanation";
import InputPanel, { type InputDoc } from "./InputPanel";
import { calculateTFIDF, type TFIDFMatrix } from "../lib/nlpEngine";
import ExportResultPdfButton from "./ExportResultPdfButton";

type DocInfo = { id: string; label: string };

export default function Step7Pembobotan() {
  const [docList, setDocList] = useState<DocInfo[]>([]);
  const [tfidfData, setTfidfData] = useState<TFIDFMatrix>({
    terms: [],
    docIds: [],
    matrix: {},
  });
  const resultRef = useRef<HTMLDivElement>(null);

  function handleProcess(docs: InputDoc[]) {
    const list = docs.map((d, i) => ({ id: d.id, label: `D${i + 1}` }));
    setDocList(list);
    const result = calculateTFIDF(docs);
    setTfidfData(result);
  }

  return (
    <div className="space-y-6">
      <StepExplanation
        stepNumber="7"
        title="Pembobotan (TF-IDF)"
        summary="Menghitung nilai bobot TF-IDF dari setiap kata unik (Terms) yang tersisa setelah stemming di seluruh dokumen."
        theory="TF-IDF adalah metode pemberian nilai (bobot) untuk mengukur seberapa penting sebuah kata di dalam suatu dokumen. Nilainya dihitung dari dua faktor: seberapa sering kata itu muncul di dokumen tersebut (TF), dan seberapa langka kata itu di dokumen-dokumen lainnya (IDF). Kata yang sering muncul di satu dokumen tetapi jarang ditemukan di dokumen lain akan mendapat nilai bobot paling tinggi, karena kata tersebut merupakan kata kunci utama yang membedakan isi dokumen tersebut."
        concepts={[
          { term: "TF (Frekuensi Kata)", definition: "Jumlah kemunculan suatu kata di dalam satu dokumen. Semakin sering muncul, semakin besar nilainya." },
          { term: "IDF (Kelangkaan Kata)", definition: "Tingkat keunikan kata di seluruh koleksi dokumen. Kata yang jarang ada di dokumen lain bernilai lebih tinggi." },
          { term: "Bobot TF-IDF", definition: "Nilai perkalian TF x IDF yang menunjukkan tingkat kepentingan kata bagi dokumen tersebut." },
          { term: "Tabel Pembobotan", definition: "Tabel perbandingan berisi baris kata-kata unik dan kolom dokumen beserta nilai bobotnya masing-masing." },
        ]}
        formula="Bobot TF-IDF = (Frekuensi Kata di Dokumen) x log( Total Dokumen / Dokumen yang Memuat Kata )"
        example={{
          input: 'Kata "sensor" muncul 2x di D1 (dari 10 kata), dan hanya ada di 1 dari total 3 dokumen',
          output: 'TF = 2/10 = 0.2, IDF = 1.386, Bobot TF-IDF = 0.2 x 1.386 = 0.277',
          explanation: 'Kata "sensor" bernilai tinggi (0.277) karena sering dibahas di D1 dan tidak ada di dokumen lain.'
        }}
        details={[
          "<strong>Komponen TF (Term Frequency):</strong> Menghitung seberapa sering suatu kata muncul di dalam dokumen tertentu. Semakin sering kata disebut, semakin kuat keterkaitan kata tersebut dengan isi dokumen.",
          "<strong>Komponen IDF (Inverse Document Frequency):</strong> Menilai tingkat kelangkaan kata di seluruh koleksi dokumen. Kata yang jarang ditemukan di dokumen lain diberi bobot pengali lebih tinggi karena menjadi pembeda topik yang kuat.",
          "<strong>Hasil Bobot TF-IDF:</strong> Nilai akhir berupa perkalian TF &times; IDF. Kata yang memiliki bobot tinggi mencerminkan kata kunci utama yang paling mewakili topik dokumen tersebut."
        ]}
      />
      <InputPanel onProcessData={handleProcess} />
      {tfidfData.terms.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <span className="text-xs text-slate-500 font-medium">
              Total <strong>{tfidfData.terms.length}</strong> term kata unik terbobot pada <strong>{docList.length}</strong> dokumen:
            </span>
            <ExportResultPdfButton
              resultRef={resultRef}
              title="Matriks Pembobotan TF-IDF"
              stepNumber="7"
            />
          </div>
          <div ref={resultRef} className="overflow-x-auto rounded-2xl border border-slate-200 shadow-sm bg-white p-4">
            <table className="min-w-full text-sm border-collapse table-auto">
            <thead>
              <tr className="bg-slate-800 text-white">
                <th className="px-4 py-3 text-left font-semibold sticky left-0 bg-slate-800 z-10 w-44">
                  Terms (Kata)
                </th>
                {docList.map((d) => (
                  <th key={d.id} className="px-4 py-3 text-center font-semibold whitespace-nowrap">
                    {d.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tfidfData.terms.map((term, i) => (
                <tr
                  key={term}
                  className={`border-t border-slate-200 transition-colors hover:bg-slate-100 ${
                    i % 2 === 1 ? "bg-slate-50" : "bg-white"
                  }`}
                >
                  <td className="px-4 py-2.5 font-medium text-brand whitespace-nowrap sticky left-0 z-10 bg-inherit border-r border-slate-200">
                    {term}
                  </td>
                  {docList.map((doc) => {
                    const weight = tfidfData.matrix[term]?.[doc.id] ?? 0;
                    return (
                      <td
                        key={doc.id}
                        className={`px-4 py-2.5 text-center tabular-nums text-xs ${
                          weight > 0 ? "font-semibold text-slate-800" : "text-slate-300"
                        }`}
                      >
                        {weight.toFixed(3)}
                      </td>
                    );
                  })}
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
