"use client";

import { useState, useRef } from "react";
import { STOPWORDS, processStemming } from "../lib/nlpEngine";
import ExportResultPdfButton from "./ExportResultPdfButton";

const SAMPLE_DATASETS = [
  {
    id: 1,
    title: "Teks 1: Biomekanika & Sensor Inersial Kinematik (Kompleks)",
    text: "Penerapan metodologi telemetri sensor inersial elektro-mekanikal pada atlet bola voli profesional telah membuktikan signifikansi optimalisasi akselerasi kinematik. Sistem pelacakan kuantitatif mampu merekam pergerakan dinamika artikular, sudut elevasi humerus saat mengeksekusi jump smash, serta redistribusi beban gravitasi dengan tingkat presisi mikroskopis mencapai 99,8% toleransi deviasi.",
  },
  {
    id: 2,
    title: "Teks 2: Evaluasi Pedagogis & Algoritma Pembelajaran Motorik (Kompleks)",
    text: "Para instruktur pendidikan jasmani dan ilmu keolahragaan modern mengimplementasikan kerangka kerja komputasional terdistribusi guna mengevaluasi efektivitas latihan repetitif. Algoritma analitika biomekanis secara komparatif menyinkronkan data spatial-temporal untuk mengidentifikasi deviasi postur tubuh dan kesalahan biomekanika fundamental para atlet junior secara otomatis.",
  },
  {
    id: 3,
    title: "Teks 3: Morfometrik, Kapasitas Fisiologis & Pemodelan Prediktif (Kompleks)",
    text: "Analisis komprehensif terhadap parameter antropometrik, ambang laktat anaerobik, dan elastisitas neuromuskular memberikan kontribusi transformatif bagi perancangan periodisasi latihan fisik berkala. Mahasiswa pascasarjana fakultas kedokteran olahraga mengkaji keterkaitan kausal antara kelelahan perifer ekstremitas bawah dengan penurunan vertikalitas loncatan pemblokir (middle blocker).",
  },
  {
    id: 4,
    title: "Teks 4: Information Retrieval Multimodal & Knowledge Graph Keolahragaan (Kompleks)",
    text: "Arsitektur temu kembali informasi saintifik berbasis graf pengetahuan (knowledge graph) mempermudah kurasi ribuan manuskrip terakreditasi internasional mengenai biomekanika voli. Algoritma penelusuran semantik mempercepat ekstraksi korelasi multivariat antara frekuensi cedera ligamen krusiat anterior (ACL) dan teknik pendaratan paska penyerangan di bibir net.",
  },
  {
    id: 5,
    title: "Teks 5: Komputasi Tepi (Edge AI) & Diagnostik Spatiotemporal (Kompleks)",
    text: "Pengembangan perangkat kecerdasan buatan berbasis edge computing yang diintegrasikan langsung pada bola dan jaring lapangan voli menghadirkan kapabilitas inferensi seketika (ultra-low latency). Data vektor rotasi bola, kecepatan translasi serve, dan lintasan aerodinamis diproses secara matematis untuk memberikan umpan balik taktis kepada tim pelatih nasional.",
  },
];

type StepLog = {
  stepName: string;
  inputData: string;
  processDesc: string;
  outputData: string;
};

type ProcessResult = {
  label: string;
  raw: string;
  caseFolded: string;
  cleaned: string;
  tokens: string[];
  tokensWithStopwordFlag: { word: string; isStopword: boolean }[];
  filteredTokens: string[];
  stemmedPairs: { original: string; stemmed: string; changed: boolean }[];
  stemmedTokens: string[];
  logs: StepLog[];
  stats: {
    uppercaseCount: number;
    removedCharsCount: number;
    tokenCount: number;
    stopwordRemovedCount: number;
    stopwordPercentage: number;
    stemChangedCount: number;
    stemPercentage: number;
  };
};

function processText(raw: string, label: string): ProcessResult {
  const caseFolded = raw.toLowerCase();
  const uppercaseCount = (raw.match(/[A-Z]/g) || []).length;

  const cleaned = caseFolded.replace(/[^a-z\s]/g, " ").replace(/\s+/g, " ").trim();
  const removedCharsCount = raw.length - cleaned.length;

  const tokens = cleaned ? cleaned.split(" ").filter(Boolean) : [];

  const tokensWithStopwordFlag = tokens.map((w) => ({
    word: w,
    isStopword: STOPWORDS.has(w),
  }));
  const filteredTokens = tokensWithStopwordFlag
    .filter((item) => !item.isStopword)
    .map((item) => item.word);

  const stopwordRemovedCount = tokens.length - filteredTokens.length;

  const stemmedResult = processStemming(filteredTokens);
  const stemmedPairs = filteredTokens.map((original, i) => {
    const stemmed = stemmedResult[i];
    return { original, stemmed, changed: original !== stemmed };
  });
  const stemmedTokens = stemmedResult;
  const stemChangedCount = stemmedPairs.filter((p) => p.changed).length;

  const pct = (a: number, b: number) => (b ? Math.round((a / b) * 100) : 0);

  const logs: StepLog[] = [
    { stepName: "1. Case Folding", inputData: raw, processDesc: `Mengubah semua huruf kapital menjadi huruf kecil (lowercase). ${uppercaseCount} huruf kapital diubah.`, outputData: caseFolded },
    { stepName: "2. Cleaning", inputData: caseFolded, processDesc: `Menghapus tanda baca, angka, dan simbol khusus (hanya huruf & spasi disisakan). ${removedCharsCount} karakter non-alfabet dihapus.`, outputData: cleaned },
    { stepName: "3. Tokenization", inputData: cleaned, processDesc: `Memotong teks berdasarkan pemisah spasi menjadi deretan token kata. Dihasilkan ${tokens.length} token.`, outputData: `[${tokens.join(", ")}]` },
    { stepName: "4. Stopword Removal", inputData: `[${tokens.join(", ")}]`, processDesc: `Menyaring dan membuang kata umum berdasarkan kamus ${STOPWORDS.size} stopword. ${stopwordRemovedCount} dari ${tokens.length} kata dihapus (${pct(stopwordRemovedCount, tokens.length)}%).`, outputData: `[${filteredTokens.join(", ")}]` },
    { stepName: "5. Stemming", inputData: `[${filteredTokens.join(", ")}]`, processDesc: `Menghapus imbuhan prefiks (me-, pe-, ber-, ter-, dll) dan sufiks (-kan, -an, -i) ke bentuk dasar. ${stemChangedCount} dari ${filteredTokens.length} kata berubah (${pct(stemChangedCount, filteredTokens.length)}%).`, outputData: `[${stemmedTokens.join(", ")}]` },
  ];

  return {
    label, raw, caseFolded, cleaned, tokens, tokensWithStopwordFlag,
    filteredTokens, stemmedPairs, stemmedTokens, logs,
    stats: {
      uppercaseCount, removedCharsCount, tokenCount: tokens.length,
      stopwordRemovedCount, stopwordPercentage: pct(stopwordRemovedCount, tokens.length),
      stemChangedCount, stemPercentage: pct(stemChangedCount, filteredTokens.length),
    },
  };
}

export default function PreProcessingLab() {
  const [inputText, setInputText] = useState(SAMPLE_DATASETS[0].text);
  const [selectedDatasetId, setSelectedDatasetId] = useState<number>(1);
  const [result, setResult] = useState<ProcessResult | null>(null);
  const [allResults, setAllResults] = useState<ProcessResult[] | null>(null);
  const [processing, setProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const singleResultRef = useRef<HTMLDivElement>(null);
  const allResultsRef = useRef<HTMLDivElement>(null);

  function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const content = (ev.target?.result as string) || "";
      setInputText(content.trim());
    };
    reader.readAsText(file);
    e.target.value = "";
  }

  function handleDatasetSelect(e: React.ChangeEvent<HTMLSelectElement>) {
    const id = Number(e.target.value);
    setSelectedDatasetId(id);
    const item = SAMPLE_DATASETS.find((d) => d.id === id);
    if (item) setInputText(item.text);
  }

  function handleProcess() {
    const raw = inputText.trim();
    if (!raw) { setResult(null); return; }
    setProcessing(true);
    setAllResults(null);
    // ponytail: simulate processing delay; swap to real async when backend exists
    setTimeout(() => {
      setResult(processText(raw, "Teks Input"));
      setProcessing(false);
    }, 300);
  }

  function handleProcessAll() {
    setProcessing(true);
    setResult(null);
    setTimeout(() => {
      setAllResults(SAMPLE_DATASETS.map((ds) => processText(ds.text, ds.title)));
      setProcessing(false);
    }, 300);
  }

  function handleReset() {
    setInputText(SAMPLE_DATASETS[0].text);
    setSelectedDatasetId(1);
    setResult(null);
    setAllResults(null);
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-brand to-brand-dark text-white p-6 md:p-8 rounded-2xl shadow-sm">
        <h1 className="text-xl md:text-2xl font-bold tracking-tight">
          Text Mining Pre-processing Lab
        </h1>
        <p className="text-sm text-white/70 mt-2 max-w-3xl leading-relaxed">
          Eksplorasi interaktif 5 tahapan pra-pemrosesan teks Bahasa Indonesia: Case Folding, Cleaning, Tokenization, Stopword Removal, dan Stemming. Menggunakan kamus {STOPWORDS.size} stopword.
        </p>
      </div>

      {/* Input & Dataset */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 md:p-6 shadow-sm hover:shadow-md transition-shadow duration-300 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-base font-bold text-slate-800">1. Masukkan Teks Uji Coba</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Pilih kalimat dari daftar dataset studi kasus kompleks di bawah ini.
            </p>
          </div>
          <div className="w-full md:w-80">
            <label className="block text-xs font-semibold text-slate-600 mb-1">Contoh Pilihan Dataset:</label>
            <select
              value={selectedDatasetId}
              onChange={handleDatasetSelect}
              className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-colors"
            >
              {SAMPLE_DATASETS.map((item) => (
                <option key={item.id} value={item.id}>{item.title}</option>
              ))}
            </select>
          </div>
        </div>

        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Teks dataset terpilih atau isi file yang diunggah akan tampil di sini..."
          rows={4}
          className="w-full border border-slate-300 rounded-xl p-3.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-colors"
        />

        <input
          ref={fileInputRef}
          type="file"
          accept=".txt"
          onChange={handleFileUpload}
          className="hidden"
        />

        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm rounded-xl border border-slate-300 active:scale-95 transition-all cursor-pointer flex items-center gap-1.5"
          >
            <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            Unggah Dokumen Manual (.txt)
          </button>
          <button
            onClick={handleProcess}
            disabled={!inputText.trim() || processing}
            className="px-6 py-2.5 bg-brand hover:bg-brand-dark disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-sm rounded-xl active:scale-95 transition-all shadow-sm cursor-pointer"
          >
            {processing ? "Memproses\u2026" : "Mulai Pre-processing"}
          </button>
          <button
            onClick={handleProcessAll}
            disabled={processing}
            className="px-6 py-2.5 bg-slate-800 hover:bg-slate-900 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-sm rounded-xl active:scale-95 transition-all shadow-sm cursor-pointer"
          >
            {processing ? "Memproses\u2026" : "Proses Semua 5 Dataset"}
          </button>
          <button
            onClick={handleReset}
            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium rounded-xl active:scale-95 transition-all cursor-pointer"
          >
            Reset
          </button>
          <span className="text-xs text-slate-400 ml-auto tabular-nums">
            {inputText.length} karakter | {inputText.trim().split(/\s+/).filter(Boolean).length} kata
          </span>
        </div>
      </div>

      {/* Single Result */}
      {result && (
        <div className="space-y-3">
          <div className="flex items-center justify-end">
            <ExportResultPdfButton
              resultRef={singleResultRef}
              title="Hasil Pre-processing Teks"
              stepNumber="11"
            />
          </div>
          <div ref={singleResultRef}>
            <SingleResultView result={result} />
          </div>
        </div>
      )}

      {/* All 5 Results - Comparative */}
      {allResults && (
        <div className="space-y-3">
          <div className="flex items-center justify-end">
            <ExportResultPdfButton
              resultRef={allResultsRef}
              title="Hasil Komparatif 5 Dataset Pre-processing"
              stepNumber="11"
            />
          </div>
          <div ref={allResultsRef} className="space-y-6">
            <h2 className="text-lg font-bold text-slate-800 border-l-4 border-brand pl-3">
              Hasil Komparatif: Semua 5 Dataset
            </h2>

          {/* Summary stats table */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 md:p-6 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900">Ringkasan Statistik</h3>
            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-xs border-collapse table-auto">
                <thead>
                  <tr className="bg-slate-800 text-white font-bold text-left">
                    <th className="px-3 py-3">Dataset</th>
                    <th className="px-3 py-3 text-center">Huruf Kapital Diubah</th>
                    <th className="px-3 py-3 text-center">Karakter Dihapus</th>
                    <th className="px-3 py-3 text-center">Total Token</th>
                    <th className="px-3 py-3 text-center">Stopword Dihapus</th>
                    <th className="px-3 py-3 text-center">Kata Di-stem</th>
                    <th className="px-3 py-3 text-center">Token Akhir</th>
                  </tr>
                </thead>
                <tbody>
                  {allResults.map((r, i) => (
                    <tr key={i} className={`border-t border-slate-200 ${i % 2 === 1 ? "bg-slate-50" : "bg-white"}`}>
                      <td className="px-3 py-2.5 font-semibold text-slate-800">{r.label}</td>
                      <td className="px-3 py-2.5 text-center">{r.stats.uppercaseCount}</td>
                      <td className="px-3 py-2.5 text-center">{r.stats.removedCharsCount}</td>
                      <td className="px-3 py-2.5 text-center">{r.stats.tokenCount}</td>
                      <td className="px-3 py-2.5 text-center">
                        <span className="text-red-600 font-semibold">{r.stats.stopwordRemovedCount}</span>
                        <span className="text-slate-400"> ({r.stats.stopwordPercentage}%)</span>
                      </td>
                      <td className="px-3 py-2.5 text-center">
                        <span className="text-amber-600 font-semibold">{r.stats.stemChangedCount}</span>
                        <span className="text-slate-400"> ({r.stats.stemPercentage}%)</span>
                      </td>
                      <td className="px-3 py-2.5 text-center font-bold text-brand">{r.stemmedTokens.length}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Comparative pipeline table */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 md:p-6 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900">Perbandingan Hasil Setiap Tahapan</h3>
            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-xs border-collapse table-auto">
                <thead>
                  <tr className="bg-slate-800 text-white font-bold text-left">
                    <th className="px-3 py-3 min-w-[100px]">Dataset</th>
                    <th className="px-3 py-3 min-w-[160px]">Teks Asli</th>
                    <th className="px-3 py-3 min-w-[160px]">Case Folded</th>
                    <th className="px-3 py-3 min-w-[160px]">Cleaned</th>
                    <th className="px-3 py-3 min-w-[140px]">Tokens</th>
                    <th className="px-3 py-3 min-w-[140px]">Filtered</th>
                    <th className="px-3 py-3 min-w-[140px]">Stemmed</th>
                  </tr>
                </thead>
                <tbody>
                  {allResults.map((r, i) => (
                    <tr key={i} className={`border-t border-slate-200 align-top ${i % 2 === 1 ? "bg-slate-50" : "bg-white"}`}>
                      <td className="px-3 py-2.5 font-semibold text-slate-800">{r.label}</td>
                      <td className="px-3 py-2.5 text-slate-600 font-mono text-[11px] break-words">{r.raw}</td>
                      <td className="px-3 py-2.5 text-slate-600 font-mono text-[11px] break-words">{r.caseFolded}</td>
                      <td className="px-3 py-2.5 text-slate-600 font-mono text-[11px] break-words">{r.cleaned}</td>
                      <td className="px-3 py-2.5">
                        <div className="flex flex-wrap gap-0.5">
                          {r.tokens.map((t, j) => (
                            <span key={j} className="bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded text-[10px]">{t}</span>
                          ))}
                        </div>
                      </td>
                      <td className="px-3 py-2.5">
                        <div className="flex flex-wrap gap-0.5">
                          {r.filteredTokens.map((t, j) => (
                            <span key={j} className="bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded text-[10px]">{t}</span>
                          ))}
                        </div>
                      </td>
                      <td className="px-3 py-2.5">
                        <div className="flex flex-wrap gap-0.5">
                          {r.stemmedTokens.map((t, j) => (
                            <span key={j} className="bg-teal-50 text-teal-700 px-1.5 py-0.5 rounded text-[10px]">{t}</span>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Individual detail per dataset */}
          {allResults.map((r, i) => (
            <details key={i} className="bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300">
              <summary className="p-5 cursor-pointer font-bold text-slate-800 text-sm hover:text-brand transition-colors">
                {r.label} &mdash; Detail Lengkap & Processing Log
              </summary>
              <div className="px-5 pb-5">
                <SingleResultView result={r} />
              </div>
            </details>
          ))}
        </div>
        </div>
      )}
    </div>
  );
}

/* ── Single text result view ── */
function SingleResultView({ result }: { result: ProcessResult }) {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-slate-800 border-l-4 border-brand pl-3">
        2. Tahapan Eksekusi NLP & Visualisasi Perubahan Data
      </h2>

      {/* Step 1: Case Folding */}
      <StepCard num={1} title="Case Folding" badge={`${result.stats.uppercaseCount} huruf kapital diubah`}
        desc={`Mengubah semua huruf kapital menjadi huruf kecil agar kata seperti "Sensor" dan "sensor" dianggap identik.`}
      >
        <div className="p-3 bg-slate-50 rounded-xl text-xs font-mono text-slate-700 border border-slate-100">
          {result.caseFolded}
        </div>
      </StepCard>

      {/* Step 2: Cleaning */}
      <StepCard num={2} title="Cleaning (Punctuation & Number Removal)" badge={`${result.stats.removedCharsCount} karakter dihapus`}
        desc="Menghilangkan tanda baca, angka, serta karakter non-alfabetik."
      >
        <div className="p-3 bg-slate-50 rounded-xl text-xs font-mono text-slate-700 border border-slate-100">
          {result.cleaned}
        </div>
      </StepCard>

      {/* Step 3: Tokenization */}
      <StepCard num={3} title="Tokenization"
        badge={<span className="text-xs bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full font-semibold">Total: {result.tokens.length} token</span>}
        desc="Memecah kalimat teks menjadi unit-unit kata tersendiri (array of token)."
      >
        <div className="flex flex-wrap gap-1.5 p-3 bg-slate-50 rounded-xl border border-slate-100">
          {result.tokens.map((token, i) => (
            <span key={i} className="px-2 py-1 bg-white border border-slate-200 text-slate-700 text-xs rounded-full shadow-xs font-medium">
              {token}
            </span>
          ))}
        </div>
      </StepCard>

      {/* Step 4: Stopword Removal */}
      <StepCard num={4} title="Stopword Removal (Highlight Perubahan)"
        badge={
          <div className="flex gap-2 flex-wrap">
            <span className="text-xs bg-red-50 text-red-700 border border-red-200 px-2 py-0.5 rounded-full">
              {result.stats.stopwordRemovedCount} dihapus ({result.stats.stopwordPercentage}%)
            </span>
            <span className="text-xs bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-full font-semibold">Sisa: {result.filteredTokens.length} kata</span>
          </div>
        }
        desc={`Kata yang cocok dengan kamus ${STOPWORDS.size} stopword ditandai coret merah dan dibuang.`}
      >
        <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 space-y-3">
          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
              Visualisasi Coretan Kata:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {result.tokensWithStopwordFlag.map((item, i) =>
                item.isStopword ? (
                  <span key={i} className="px-2 py-0.5 bg-red-100 text-red-700 line-through text-xs rounded-full border border-red-200 font-medium" title="Stopword dihapus">
                    {item.word}
                  </span>
                ) : (
                  <span key={i} className="px-2 py-0.5 bg-white text-slate-800 text-xs rounded-full border border-slate-200">
                    {item.word}
                  </span>
                )
              )}
            </div>
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Hasil Filtering:</span>
            <div className="flex flex-wrap gap-1">
              {result.filteredTokens.map((t, i) => (
                <span key={i} className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full text-xs font-medium">
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </StepCard>

      {/* Step 5: Stemming */}
      <StepCard num={5} title={"Stemming (Highlight Perubahan Kata Imbuhan \u2192 Dasar)"}
        badge={<span className="text-xs bg-amber-50 text-amber-800 border border-amber-200 px-2.5 py-1 rounded-full font-semibold">{result.stats.stemChangedCount} dari {result.stemmedPairs.length} kata berubah ({result.stats.stemPercentage}%)</span>}
        desc="Menghilangkan imbuhan awalan dan akhiran untuk mengembalikan kata ke bentuk dasar."
      >
        <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 space-y-3">
          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">Daftar Perubahan Imbuhan:</span>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {result.stemmedPairs.map((pair, i) => (
                <div key={i} className={`p-2 rounded-xl border text-xs flex flex-col justify-center ${
                  pair.changed ? "bg-amber-50/80 border-amber-300 text-amber-950" : "bg-white border-slate-200 text-slate-600"
                }`}>
                  <span className={pair.changed ? "line-through text-slate-400" : ""}>{pair.original}</span>
                  {pair.changed ? (
                    <span className="font-bold text-brand mt-0.5">{"\u2192"} {pair.stemmed}</span>
                  ) : (
                    <span className="text-[10px] text-slate-400 italic">tetap</span>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Hasil Akhir Stemmed Tokens:</span>
            <div className="flex flex-wrap gap-1">
              {result.stemmedTokens.map((t, i) => (
                <span key={i} className="bg-teal-100 text-teal-800 px-2 py-0.5 rounded-full text-xs font-medium">
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </StepCard>

      {/* Processing Log */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 md:p-6 shadow-sm hover:shadow-md transition-shadow duration-300 space-y-4">
        <div>
          <h3 className="text-base font-bold text-slate-900">3. Processing Log Otomatis</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Audit trail dan rekam jejak sistem yang mencatat perubahan input-output di tiap titik pemrosesan.
          </p>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-xs border-collapse table-auto">
            <thead>
              <tr className="bg-slate-800 text-white font-bold text-left">
                <th className="px-4 py-3 whitespace-nowrap w-36">Tahapan</th>
                <th className="px-4 py-3 w-1/3 min-w-[200px]">Data Input</th>
                <th className="px-4 py-3 min-w-[180px]">Proses yang Dilakukan</th>
                <th className="px-4 py-3 w-1/3 min-w-[200px]">Hasil Output</th>
              </tr>
            </thead>
            <tbody>
              {result.logs.map((log, index) => (
                <tr
                  key={index}
                  className={`border-t border-slate-200 align-top transition-colors hover:bg-slate-100 ${
                    index % 2 === 1 ? "bg-slate-50" : "bg-white"
                  }`}
                >
                  <td className="px-4 py-3 font-bold text-brand whitespace-nowrap">{log.stepName}</td>
                  <td className="px-4 py-3 text-slate-600 font-mono text-[11px] leading-relaxed break-words">{log.inputData}</td>
                  <td className="px-4 py-3 text-slate-700 leading-relaxed">{log.processDesc}</td>
                  <td className="px-4 py-3 text-slate-900 font-mono text-[11px] leading-relaxed break-words font-medium">{log.outputData}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ── Reusable step card ── */
function StepCard({ num, title, badge, desc, children }: {
  num: number;
  title: string;
  badge: React.ReactNode;
  desc: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow duration-300 space-y-3">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <span className="w-7 h-7 rounded-lg bg-brand-light text-brand text-xs font-bold flex items-center justify-center">
            {num}
          </span>
          <h3 className="text-sm font-bold text-slate-900">{title}</h3>
        </div>
        {typeof badge === "string" ? (
          <span className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full">{badge}</span>
        ) : badge}
      </div>
      <p className="text-xs text-slate-500">{desc}</p>
      {children}
    </div>
  );
}
