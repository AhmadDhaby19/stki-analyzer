"use client";

import { useDocuments } from "./DocumentContext";

type Props = {
  activeStep: number;
};

export default function StepResultTable({ activeStep }: Props) {
  const { documents, runPreprocessing } = useDocuments();

  if (documents.length === 0) {
    return (
      <div className="border-2 border-dashed border-slate-300 rounded-2xl py-12 text-center text-sm text-slate-400">
        Belum ada dokumen. Tambahkan dokumen di langkah 1 terlebih dahulu.
      </div>
    );
  }

  const needsProcessing = documents.some((d) => !d.parsedText);
  const showParsed = activeStep >= 2;
  const showTokens = activeStep >= 3;
  const showFiltering = activeStep >= 4;
  const showPhrases = activeStep >= 5;
  const showStemming = activeStep >= 6;

  return (
    <div className="space-y-4">
      {needsProcessing && (
        <button
          onClick={runPreprocessing}
          className="px-5 py-2.5 text-sm font-semibold bg-brand text-white rounded-xl hover:bg-brand-dark active:scale-95 transition-all cursor-pointer shadow-sm"
        >
          Jalankan Preprocessing
        </button>
      )}

      <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-sm">
        <table className="w-full text-sm border-collapse table-auto">
          <thead>
            <tr className="bg-slate-800 text-white">
              <th className="px-4 py-3 text-left font-semibold whitespace-nowrap">Dokumen Ke-i</th>
              {showParsed && <th className="px-4 py-3 text-left font-semibold">Isi Dokumen</th>}
              {showTokens && <th className="px-4 py-3 text-left font-semibold">Tokenisasi</th>}
              {showFiltering && <th className="px-4 py-3 text-left font-semibold">Filtering</th>}
              {showPhrases && <th className="px-4 py-3 text-left font-semibold">Frasa</th>}
              {showStemming && <th className="px-4 py-3 text-left font-semibold">Stemming</th>}
            </tr>
          </thead>
          <tbody>
            {documents.map((doc, i) => (
              <tr
                key={doc.id}
                className={`border-t border-slate-200 align-top transition-colors hover:bg-slate-100 ${
                  i % 2 === 1 ? "bg-slate-50" : "bg-white"
                }`}
              >
                <td className="px-4 py-3 font-semibold text-brand whitespace-nowrap">
                  D{i + 1}
                </td>
                {showParsed && (
                  <td className="px-4 py-3 text-slate-700 max-w-[220px]">
                    <p className="line-clamp-4">{doc.parsedText || doc.rawText}</p>
                  </td>
                )}
                {showTokens && (
                  <td className="px-4 py-3 max-w-[180px]">
                    <div className="flex flex-wrap gap-1">
                      {doc.tokens?.slice(0, 20).map((t, idx) => (
                        <span key={idx} className="bg-teal-100 text-teal-800 px-2 py-0.5 rounded-full text-xs font-medium">
                          {t}
                        </span>
                      )) || <span className="text-slate-400">&mdash;</span>}
                      {(doc.tokens?.length ?? 0) > 20 && (
                        <span className="text-xs text-slate-400">+{(doc.tokens?.length ?? 0) - 20}</span>
                      )}
                    </div>
                  </td>
                )}
                {showFiltering && (
                  <td className="px-4 py-3 max-w-[180px]">
                    <div className="flex flex-wrap gap-1">
                      {doc.filteredTokens?.slice(0, 15).map((t, idx) => (
                        <span key={idx} className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full text-xs font-medium">
                          {t}
                        </span>
                      )) || <span className="text-slate-400">&mdash;</span>}
                      {(doc.filteredTokens?.length ?? 0) > 15 && (
                        <span className="text-xs text-slate-400">+{(doc.filteredTokens?.length ?? 0) - 15}</span>
                      )}
                    </div>
                  </td>
                )}
                {showPhrases && (
                  <td className="px-4 py-3 max-w-[180px]">
                    {doc.phrases && doc.phrases.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {doc.phrases.map((p, idx) => (
                          <span key={idx} className="bg-violet-100 text-violet-800 px-2 py-0.5 rounded-full text-xs font-medium">
                            {p}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-slate-400 italic text-xs">&mdash;</span>
                    )}
                  </td>
                )}
                {showStemming && (
                  <td className="px-4 py-3 max-w-[180px]">
                    <div className="flex flex-wrap gap-1">
                      {doc.stemmedTokens?.slice(0, 15).map((t, idx) => (
                        <span key={idx} className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full text-xs font-medium">
                          {t}
                        </span>
                      )) || <span className="text-slate-400">&mdash;</span>}
                      {(doc.stemmedTokens?.length ?? 0) > 15 && (
                        <span className="text-xs text-slate-400">+{(doc.stemmedTokens?.length ?? 0) - 15}</span>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
