"use client";

import React, { useState } from "react";

type Props = {
  stepNumber?: number | string;
  title: string;
  summary: string;
  details?: (string | React.ReactNode)[];
  theory?: string;
  concepts?: { term: string; definition: string }[];
  formula?: string;
  example?: { input: string; output: string; explanation?: string };
};

export default function StepExplanation({
  stepNumber,
  title,
  summary,
  details = [],
  theory,
  concepts,
  formula,
  example,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="space-y-3">
      {/* Header: Nomor & Judul */}
      <div className="flex items-center gap-3">
        {stepNumber && (
          <div className="w-8 h-8 rounded-full bg-red-700 text-white font-bold flex items-center justify-center text-sm shrink-0">
            {stepNumber}
          </div>
        )}
        <h2 className="text-xl md:text-2xl font-bold text-slate-800">
          {title}
        </h2>
      </div>

      {/* Ringkasan (Summary) */}
      {summary && (
        <p className="text-slate-500 text-sm leading-relaxed">
          {summary}
        </p>
      )}

      {/* Accordion Penjelasan */}
      <div className="bg-gray-100 border border-gray-300 rounded-md p-3">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full text-left text-sm font-medium text-gray-700 cursor-pointer flex items-center gap-1.5 focus:outline-none"
        >
          <span>{isOpen ? "▼" : "▶"}</span>
          <span>Penjelasan detail proses tahap ini</span>
        </button>

        {isOpen && (
          <div className="mt-4 pt-3 border-t border-gray-200 space-y-4">
            {/* Theory */}
            {theory && (
              <div>
                <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-1">
                  Landasan Teori
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">{theory}</p>
              </div>
            )}

            {/* Concepts */}
            {concepts && concepts.length > 0 && (
              <div>
                <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-1.5">
                  Konsep Kunci
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {concepts.map((c, i) => (
                    <div key={i} className="bg-white border border-gray-200 rounded-md p-2.5">
                      <span className="font-semibold text-brand text-xs">{c.term}</span>
                      <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{c.definition}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Formula */}
            {formula && (
              <div>
                <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-1">
                  Rumus / Formula
                </h4>
                <div className="bg-slate-900 text-emerald-300 rounded-md px-3 py-2 font-mono text-xs overflow-x-auto">
                  {formula}
                </div>
              </div>
            )}

            {/* Example */}
            {example && (
              <div>
                <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-1">
                  Contoh
                </h4>
                <div className="bg-white border border-gray-200 rounded-md p-2.5 space-y-1.5 text-xs">
                  <div>
                    <span className="font-bold text-slate-500 uppercase">Input: </span>
                    <span className="font-mono text-slate-700">{example.input}</span>
                  </div>
                  <div>
                    <span className="font-bold text-slate-500 uppercase">Output: </span>
                    <span className="font-mono text-slate-700">{example.output}</span>
                  </div>
                  {example.explanation && (
                    <p className="text-slate-500 italic mt-1">{example.explanation}</p>
                  )}
                </div>
              </div>
            )}

            {/* Details */}
            {details.length > 0 && (
              <div>
                <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-1">
                  Detail Proses
                </h4>
                <ul className="list-disc pl-5 space-y-1.5">
                  {details.map((item, idx) => (
                    <li
                      key={idx}
                      className="text-xs text-gray-600 leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: typeof item === "string" ? item : "" }}
                    >
                      {typeof item !== "string" ? item : null}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
