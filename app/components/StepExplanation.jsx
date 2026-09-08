import React, { useState } from "react";

export default function StepExplanation({ stepNumber, title, summary, details = [] }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="space-y-3">
      {/* Header: Nomor & Judul */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-red-700 text-white font-bold flex items-center justify-center text-sm shrink-0">
          {stepNumber}
        </div>
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

        {isOpen && details.length > 0 && (
          <ul className="list-disc pl-5 md:pl-6 mt-3 space-y-1.5">
            {details.map((item, idx) => (
              <li
                key={idx}
                className="text-sm text-gray-600 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: typeof item === "string" ? item : "" }}
              >
                {typeof item !== "string" ? item : null}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
