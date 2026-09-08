"use client";

import { useState, useRef } from "react";
import StepExplanation from "./StepExplanation";
import InputPanel, { type InputDoc } from "./InputPanel";
import {
  processParsing,
  processTokenization,
  processFiltering,
  processStemming,
  calculateTFIDF,
  buildInvertedIndex,
  type InvertedIndex,
} from "../lib/nlpEngine";
import ExportResultPdfButton from "./ExportResultPdfButton";

type SearchResult = {
  docId: string;
  docLabel: string;
  filename: string;
  score: number;
  matchedTerms: string[];
  rawText: string;
};

export default function Step9UjiPencarian() {
  const [docs, setDocs] = useState<{ id: string; label: string; filename: string; rawText: string }[]>([]);
  const [index, setIndex] = useState<InvertedIndex>({});
  const [query, setQuery] = useState("");
  const [stemmedQuery, setStemmedQuery] = useState<string[]>([]);
  const [results, setResults] = useState<SearchResult[] | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  function handleProcess(inputDocs: InputDoc[]) {
    const list = inputDocs.map((d, i) => ({
      id: d.id,
      label: `D${i + 1}`,
      filename: d.filename,
      rawText: d.rawText,
    }));
    setDocs(list);

    const tfidfData = calculateTFIDF(inputDocs);
    setIndex(buildInvertedIndex(tfidfData));
    setResults(null);
    setStemmedQuery([]);
  }

  function handleSearch() {
    if (!query.trim() || Object.keys(index).length === 0) return;

    const qParsed = processParsing(query);
    const qTokens = processTokenization(qParsed);
    const qFiltered = processFiltering(qTokens);
    const qStemmed = processStemming(qFiltered);
    const rawTokens = qTokens.length > 0 ? qTokens : [query.toLowerCase().trim()];
    const searchKeys = Array.from(new Set([...qStemmed, ...rawTokens])).filter(Boolean);
    setStemmedQuery(searchKeys);

    const scores: Record<string, { score: number; terms: string[] }> = {};
    const indexedTerms = Object.keys(index);

    for (const key of searchKeys) {
      // 1. Cocokkan term persis atau term yang mengandung substring key (prefix/partial match)
      const matchingTerms = indexedTerms.filter(
        (term) => term === key || term.startsWith(key) || (key.length >= 3 && term.includes(key))
      );

      for (const term of matchingTerms) {
        const postings = index[term];
        if (!postings) continue;
        for (const p of postings) {
          if (!scores[p.docId]) {
            scores[p.docId] = { score: 0, terms: [] };
          }
          // Beri bobot penuh jika exact match, atau sedikit scaled jika partial
          const factor = term === key ? 1.0 : (key.length / term.length);
          scores[p.docId].score += p.weight * factor;
          scores[p.docId].terms.push(term);
        }
      }
    }

    const ranked: SearchResult[] = Object.entries(scores)
      .map(([docId, { score, terms }]) => {
        const doc = docs.find((d) => d.id === docId);
        return {
          docId,
          docLabel: doc?.label || docId,
          filename: doc?.filename || "",
          score: +score.toFixed(3),
          matchedTerms: Array.from(new Set(terms)),
          rawText: doc?.rawText || "",
        };
      })
      .sort((a, b) => b.score - a.score);

    setResults(ranked);
  }

  return (
    <div className="space-y-6">
      <StepExplanation
        stepNumber="9"
        title="Uji Pencarian"
        summary="Membangun korpus indeks lalu mencari relevansi dokumen berdasarkan query pencarian yang di-stemming dan dicocokkan ke Inverted Index."
        theory="Pencarian dan pemeringkatan adalah tahap menguji relevansi dokumen terhadap kata kunci yang dimasukkan pengguna. Kalimat pencarian (query) akan dibersihkan terlebih dahulu menggunakan proses yang sama dengan dokumen (diubah ke huruf kecil, dihapus tanda baca, disaring kata henti, dan diubah ke kata dasar). Selanjutnya, sistem langsung memeriksa Inverted Index untuk menemukan dokumen mana saja yang memuat kata-kata tersebut, lalu menjumlahkan bobot relevansinya agar dokumen dengan skor tertinggi tampil di urutan paling atas."
        concepts={[
          { term: "Pembersihan Kueri", definition: "Memproses kata kunci pencarian dengan aturan yang sama persis seperti pemrosesan dokumen." },
          { term: "Pencocokan Cepat", definition: "Mengambil daftar dokumen langsung dari indeks tanpa perlu membaca ulang seluruh teks dokumen." },
          { term: "Skor Relevansi", definition: "Total penjumlahan nilai bobot kata kunci yang cocok pada suatu dokumen." },
          { term: "Pemeringkatan (Ranking)", definition: "Menyusun urutan dokumen dari skor tertinggi ke terendah sebagai dokumen yang paling cocok." },
        ]}
        formula="Skor Relevansi Dokumen = Jumlahkan Bobot TF-IDF dari Semua Kata Kunci yang Cocok"
        example={{
          input: 'Kata Kunci: "teknologi pelacakan gerak"',
          output: 'Kata Dasar: ["teknologi", "lacak", "gerak"] -> D1: Skor 0.450, D3: Skor 0.380, D2: Skor 0.120',
          explanation: "Nilai bobot ketiga kata tersebut dihitung untuk tiap dokumen, lalu diurutkan dari nilai terbesar: D1 peringkat 1, D3 peringkat 2, D2 peringkat 3."
        }}
        details={[
          "<strong>Pra-pemrosesan Kueri Pengguna:</strong> Kalimat pencarian yang diketik pengguna diproses melalui tahapan yang sama persis dengan dokumen (huruf kecil, hapus tanda baca, hapus stopword, dan ubah ke kata dasar).",
          "<strong>Pencocokan Cepat pada Indeks:</strong> Mesin mengambil daftar dokumen dari Inverted Index berdasarkan kata dasar kueri yang cocok tanpa perlu memindai ulang dokumen mentah.",
          "<strong>Perhitungan Skor Relevansi & Pemeringkatan:</strong> Bobot TF-IDF dari seluruh kata kueri yang cocok dijumlahkan untuk tiap dokumen, lalu dokumen diurutkan dari skor tertinggi ke terendah sebagai dokumen yang paling relevan."
        ]}
      />

      <InputPanel onProcessData={handleProcess} />

      {docs.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-300 p-5 md:p-6 space-y-4">
          <div className="text-xs text-slate-500">
            Indeks aktif: <strong>{docs.length}</strong> dokumen,{" "}
            <strong>{Object.keys(index).length}</strong> kata unik terdaftar.
          </div>

          {/* Search Bar */}
          <div className="flex gap-2">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Ketik kata kunci pencarian di sini..."
              className="flex-1 border-2 border-slate-300 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-colors"
            />
            <button
              onClick={handleSearch}
              disabled={!query.trim()}
              className="px-6 py-3 bg-brand text-white font-semibold rounded-xl hover:bg-brand-dark active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-sm"
            >
              Cari
            </button>
          </div>

          {stemmedQuery.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-600">
              <span>Kata kunci (stemmed):</span>
              {stemmedQuery.map((q, i) => (
                <span key={i} className="bg-teal-100 text-teal-800 px-2 py-0.5 rounded-full font-medium">
                  {q}
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Results */}
      {results !== null && (
        <div className="space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h3 className="text-sm font-semibold text-slate-700">
              Hasil Ranking Pencarian ({results.length} Dokumen Relevan):
            </h3>
            {results.length > 0 && (
              <ExportResultPdfButton
                resultRef={resultRef}
                title={`Hasil Pencarian Kueri "${query}"`}
                stepNumber="9"
              />
            )}
          </div>
          <div ref={resultRef} className="space-y-3 bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
            {/* Header ringkasan kueri untuk PDF */}
            <div className="pb-3 border-b border-slate-100 flex items-center justify-between text-xs text-slate-600">
              <div>Kata Kunci Dicari: <strong className="text-brand">&ldquo;{query}&rdquo;</strong></div>
              <div>Ditemukan: <strong>{results.length}</strong> Dokumen Cocok</div>
            </div>
            {results.length === 0 ? (
              <div className="border-2 border-dashed border-slate-300 rounded-2xl py-8 text-center text-sm text-slate-400">
                Tidak ada dokumen yang cocok dengan kata kunci pencarian.
              </div>
            ) : (
              results.map((r, rank) => (
                <div
                  key={r.docId}
                  className="bg-slate-50/70 border border-slate-200 rounded-xl p-3.5 md:p-4 flex items-start gap-3"
                >
                  <div className="w-8 h-8 rounded-lg bg-brand text-white flex items-center justify-center font-bold text-xs shrink-0">
                    {rank + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-slate-900 text-sm">{r.docLabel}</span>
                      <span className="text-xs text-slate-400">{r.filename}</span>
                      <span className="ml-auto text-xs bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded-full">
                        Skor Relevansi: {r.score.toFixed(3)}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1.5 line-clamp-3">{r.rawText}</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      <span className="text-[11px] text-slate-400 font-medium">Kata kunci cocok:</span>
                      {r.matchedTerms.map((t, i) => (
                        <span key={i} className="bg-teal-100 text-teal-800 px-2 py-0.5 rounded-full text-[11px] font-medium">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
