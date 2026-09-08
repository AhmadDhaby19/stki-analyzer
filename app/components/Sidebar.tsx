"use client";

const menuItems = [
  { step: 1, icon: "01", label: "Dokumen" },
  { step: 2, icon: "02", label: "Parsing" },
  { step: 3, icon: "03", label: "Analisis Leksikal" },
  { step: 4, icon: "04", label: "Penghapusan Stopword" },
  { step: 5, icon: "05", label: "Deteksi Frasa" },
  { step: 6, icon: "06", label: "Stemming & Lemmatisasi" },
  { step: 7, icon: "07", label: "Pembobotan" },
  { step: 8, icon: "08", label: "Pengindeksan" },
  { step: 9, icon: "09", label: "Uji Pencarian" },
  { step: 10, icon: "10", label: "Studi Kasus" },
  { step: 11, icon: "11", label: "Pre-processing Lab" },
] as const;

type SidebarProps = {
  activeStep: number;
  onStepChange: (step: number) => void;
  open: boolean;
  onClose: () => void;
};

export default function Sidebar({ activeStep, onStepChange, open, onClose }: SidebarProps) {
  return (
    <>
      {/* Mobile overlay backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-72 flex flex-col bg-brand text-white
          transform transition-transform duration-300 ease-in-out
          ${open ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0 md:static md:z-auto
        `}
      >
        {/* Brand */}
        <div className="px-6 pt-7 pb-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold tracking-tight">STKI Analyzer</h1>
            <p className="mt-0.5 text-xs text-white/60 leading-snug">
              Sistem Temu-Kembali Informasi
            </p>
          </div>
          {/* Close button mobile */}
          <button
            onClick={onClose}
            className="md:hidden w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10 cursor-pointer"
            aria-label="Tutup menu"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="mx-4 border-t border-white/15" />

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-3">
          <ul className="space-y-0.5">
            {menuItems.map(({ step, icon, label }) => {
              const isActive = activeStep === step;
              return (
                <li key={step}>
                  <button
                    onClick={() => {
                      onStepChange(step);
                      onClose();
                    }}
                    className={`
                      w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
                      transition-all duration-200 cursor-pointer
                      ${isActive
                        ? "bg-white text-brand shadow-sm font-semibold"
                        : "text-white/85 hover:bg-white/10 hover:text-white"
                      }
                    `}
                  >
                    <span
                      className={`
                        w-7 h-7 rounded-lg text-[11px] font-bold flex items-center justify-center shrink-0
                        ${isActive
                          ? "bg-brand text-white"
                          : "bg-white/15 text-white/70"
                        }
                      `}
                    >
                      {icon}
                    </span>
                    {label}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

      </aside>
    </>
  );
}
