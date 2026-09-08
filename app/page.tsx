"use client";

import { useState } from "react";
import Sidebar from "./components/Sidebar";
import { DocumentProvider } from "./components/DocumentContext";
import Step1Dokumen from "./components/Step1Dokumen";
import Step2Parsing from "./components/Step2Parsing";
import Step3Leksikal from "./components/Step3Leksikal";
import Step4Stopword from "./components/Step4Stopword";
import Step5Frasa from "./components/Step5Frasa";
import Step6Stemming from "./components/Step6Stemming";
import Step7Pembobotan from "./components/Step7Pembobotan";
import Step8Pengindeksan from "./components/Step8Pengindeksan";
import Step9UjiPencarian from "./components/Step9UjiPencarian";
import Step10StudiKasus from "./components/Step10StudiKasus";
import PreProcessingLab from "./components/PreProcessingLab";

const stepTitles: Record<number, string> = {
  1: "Dokumen",
  2: "Parsing",
  3: "Analisis Leksikal",
  4: "Penghapusan Stopword",
  5: "Deteksi Frasa",
  6: "Stemming & Lemmatisasi",
  7: "Pembobotan",
  8: "Pengindeksan",
  9: "Uji Pencarian",
  10: "Studi Kasus",
  11: "Pre-processing Lab",
};

export default function Home() {
  const [activeStep, setActiveStep] = useState(1);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <DocumentProvider>
      <div className="flex min-h-screen bg-background">
        <Sidebar
          activeStep={activeStep}
          onStepChange={setActiveStep}
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        <div className="flex-1 flex flex-col min-w-0">
          {/* Top header */}
          <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200 px-4 md:px-8 py-3 flex items-center justify-between gap-4">
            {/* Hamburger - mobile only */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden w-9 h-9 flex items-center justify-center rounded-xl hover:bg-slate-100 cursor-pointer"
              aria-label="Buka menu"
            >
              <svg className="w-5 h-5 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            <div className="flex-1 min-w-0">
              <h2 className="text-base md:text-lg font-semibold text-slate-800 truncate">
                {stepTitles[activeStep]}
              </h2>
            </div>

            <span className="hidden sm:inline-flex items-center text-xs text-slate-400 bg-slate-100 px-3 py-1.5 rounded-full font-medium shrink-0">
              Langkah {activeStep} / {Object.keys(stepTitles).length}
            </span>
          </header>

          {/* Main content */}
          <main className="flex-1 p-4 md:p-8 flex flex-col justify-between">
            <div>
              {activeStep === 1 && <Step1Dokumen onNavigate={setActiveStep} />}
              {activeStep === 2 && <Step2Parsing />}
              {activeStep === 3 && <Step3Leksikal />}
              {activeStep === 4 && <Step4Stopword />}
              {activeStep === 5 && <Step5Frasa />}
              {activeStep === 6 && <Step6Stemming />}
              {activeStep === 7 && <Step7Pembobotan />}
              {activeStep === 8 && <Step8Pengindeksan />}
              {activeStep === 9 && <Step9UjiPencarian />}
              {activeStep === 10 && <Step10StudiKasus />}
              {activeStep === 11 && <PreProcessingLab />}
            </div>

            {/* Bottom Navigation */}
            <div className="mt-10 pt-6 border-t border-slate-200 flex items-center justify-between gap-3 no-print">
              {activeStep > 1 ? (
                <button
                  type="button"
                  onClick={() => {
                    setActiveStep((prev) => Math.max(1, prev - 1));
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <span>&larr;</span>
                  <span>Kembali ({stepTitles[activeStep - 1]})</span>
                </button>
              ) : (
                <div />
              )}

              {activeStep < 11 && (
                <button
                  type="button"
                  onClick={() => {
                    setActiveStep((prev) => Math.min(11, prev + 1));
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="px-5 py-2 text-sm font-semibold text-white bg-brand hover:bg-brand-dark rounded-xl shadow-sm hover:shadow transition-all flex items-center gap-2 cursor-pointer active:scale-95"
                >
                  <span>Lanjut ke {stepTitles[activeStep + 1]}</span>
                  <span>&rarr;</span>
                </button>
              )}
            </div>
          </main>
        </div>
      </div>
    </DocumentProvider>
  );
}
