"use client";

import { useState, useRef } from "react";
import StepExplanation from "./StepExplanation";
import {
  processParsing,
  processTokenization,
  processFiltering,
  processStemming,
} from "../lib/nlpEngine";
import ExportResultPdfButton from "./ExportResultPdfButton";

interface StaticCaseDoc {
  id: string;
  dok: string;
  filename: string;
  isiDokumen: string;
  tokenisasi: string[];
  filtering: string[];
  stemming: string[];
}

const STATIC_STAGING_DATA: Omit<StaticCaseDoc, "id" | "dok">[] = [
  {
    filename: "pelacakan_gerak_voli.txt",
    isiDokumen:
      "Penerapan teknologi pelacakan gerak berbasis sensor inersial pada atlet bola voli di tingkat universitas telah menunjukkan peningkatan signifikan dalam analisis performa. Sistem pelacakan real-time mampu merekam kinematika gerakan smash, servis, dan blocking dengan akurasi tinggi menggunakan accelerometer dan gyroscope yang tertanam pada perangkat wearable. Evaluasi pendidikan jasmani di sekolah menengah dan perguruan tinggi kini memanfaatkan data pelacakan tersebut untuk merancang program latihan yang berbasis bukti ilmiah dan terukur secara objektif.",
    tokenisasi: [
      "penerapan", "teknologi", "pelacakan", "gerak", "berbasis", "sensor", "inersial",
      "pada", "atlet", "bola", "voli", "di", "tingkat", "universitas", "telah",
      "menunjukkan", "peningkatan", "signifikan", "dalam", "analisis", "performa",
      "sistem", "pelacakan", "realtime", "mampu", "merekam", "kinematika", "gerakan",
      "smash", "servis", "dan", "blocking", "dengan", "akurasi", "tinggi",
      "menggunakan", "accelerometer", "dan", "gyroscope", "yang", "tertanam", "pada",
      "perangkat", "wearable", "evaluasi", "pendidikan", "jasmani", "di", "sekolah",
      "menengah", "dan", "perguruan", "tinggi", "kini", "memanfaatkan", "data",
      "pelacakan", "tersebut", "untuk", "merancang", "program", "latihan", "yang",
      "berbasis", "bukti", "ilmiah", "dan", "terukur", "secara", "objektif"
    ],
    filtering: [
      "penerapan", "teknologi", "pelacakan", "gerak", "berbasis", "sensor", "inersial",
      "atlet", "bola", "voli", "tingkat", "universitas", "menunjukkan", "peningkatan",
      "signifikan", "analisis", "performa", "sistem", "pelacakan", "realtime", "mampu",
      "merekam", "kinematika", "gerakan", "smash", "servis", "blocking", "akurasi",
      "tinggi", "menggunakan", "accelerometer", "gyroscope", "tertanam", "perangkat",
      "wearable", "evaluasi", "pendidikan", "jasmani", "sekolah", "menengah",
      "perguruan", "tinggi", "kini", "memanfaatkan", "data", "pelacakan", "merancang",
      "program", "latihan", "berbasis", "bukti", "ilmiah", "terukur", "objektif"
    ],
    stemming: [
      "terap", "teknologi", "lacak", "gerak", "basis", "sensor", "inersial",
      "atlet", "bola", "voli", "tingkat", "universitas", "tunjuk", "tingkat",
      "signifikan", "analisis", "performa", "sistem", "lacak", "realtime", "mampu",
      "rekam", "kinematika", "gerak", "smash", "servis", "blocking", "akurasi",
      "tinggi", "guna", "accelerometer", "gyroscope", "tanam", "angkat",
      "wearable", "evaluasi", "didik", "jasmani", "sekolah", "tengah",
      "guru", "tinggi", "kini", "manfaat", "data", "lacak", "rancang",
      "program", "latih", "basis", "bukti", "ilmiah", "ukur", "objektif"
    ],
  },
  {
    filename: "evaluasi_penjas_voli.txt",
    isiDokumen:
      "Evaluasi pendidikan jasmani dalam pembelajaran olahraga bola voli di sekolah memerlukan instrumen asesmen yang valid dan reliabel untuk mengukur kompetensi siswa secara menyeluruh. Rubrik penilaian digital yang mengintegrasikan video analisis gerakan teknik dasar passing, setting, dan spike memungkinkan guru memberikan umpan balik yang lebih akurat dan personal kepada setiap peserta didik. Penggunaan teknologi sensor pelacakan gerak dalam proses evaluasi memberikan data kuantitatif tentang kecepatan reaksi, ketepatan pukulan, dan koordinasi tubuh siswa selama praktik permainan bola voli.",
    tokenisasi: [
      "evaluasi", "pendidikan", "jasmani", "dalam", "pembelajaran", "olahraga",
      "bola", "voli", "di", "sekolah", "memerlukan", "instrumen", "asesmen", "yang",
      "valid", "dan", "reliabel", "untuk", "mengukur", "kompetensi", "siswa",
      "secara", "menyeluruh", "rubrik", "penilaian", "digital", "yang",
      "mengintegrasikan", "video", "analisis", "gerakan", "teknik", "dasar",
      "passing", "setting", "dan", "spike", "memungkinkan", "guru", "memberikan",
      "umpan", "balik", "yang", "lebih", "akurat", "dan", "personal", "kepada",
      "setiap", "peserta", "didik", "penggunaan", "teknologi", "sensor",
      "pelacakan", "gerak", "dalam", "proses", "evaluasi", "memberikan", "data",
      "kuantitatif", "tentang", "kecepatan", "reaksi", "ketepatan", "pukulan",
      "dan", "koordinasi", "tubuh", "siswa", "selama", "praktik", "permainan",
      "bola", "voli"
    ],
    filtering: [
      "evaluasi", "pendidikan", "jasmani", "pembelajaran", "olahraga", "bola",
      "voli", "sekolah", "memerlukan", "instrumen", "asesmen", "valid", "reliabel",
      "mengukur", "kompetensi", "siswa", "menyeluruh", "rubrik", "penilaian",
      "digital", "mengintegrasikan", "video", "analisis", "gerakan", "teknik",
      "dasar", "passing", "setting", "spike", "memungkinkan", "guru", "memberikan",
      "umpan", "balik", "akurat", "personal", "peserta", "didik", "penggunaan",
      "teknologi", "sensor", "pelacakan", "gerak", "proses", "evaluasi",
      "memberikan", "data", "kuantitatif", "kecepatan", "reaksi", "ketepatan",
      "pukulan", "koordinasi", "tubuh", "siswa", "selama", "praktik", "permainan",
      "bola", "voli"
    ],
    stemming: [
      "evaluasi", "didik", "jasmani", "ajar", "olahraga", "bola", "voli",
      "sekolah", "perlu", "instrumen", "asesmen", "valid", "reliabel",
      "ukur", "kompetensi", "siswa", "seluruh", "rubrik", "nilai",
      "digital", "integrasi", "video", "analisis", "gerak", "teknik",
      "dasar", "passing", "setting", "spike", "mungkin", "guru", "beri",
      "umpan", "balik", "akurat", "personal", "serta", "didik", "guna",
      "teknologi", "sensor", "lacak", "gerak", "proses", "evaluasi",
      "beri", "data", "kuantitatif", "cepat", "reaksi", "tepat",
      "pukul", "koordinasi", "tubuh", "siswa", "lama", "praktik", "main",
      "bola", "voli"
    ],
  },
  {
    filename: "integrasi_teknologi_penjas.txt",
    isiDokumen:
      "Integrasi teknologi pelacakan gerak dengan kurikulum pendidikan jasmani di sekolah dan universitas membuka peluang baru dalam pengajaran olahraga bola voli yang lebih efektif dan terukur. Platform analitik berbasis cloud mengolah data dari sensor pelacakan yang dipakai atlet mahasiswa untuk menghasilkan laporan performa individual dan rekomendasi peningkatan teknik bermain secara otomatis. Model evaluasi pendidikan jasmani modern yang menggabungkan penilaian tradisional dengan data objektif dari teknologi sensor pelacakan gerak terbukti meningkatkan motivasi belajar dan pencapaian keterampilan motorik siswa dalam permainan bola voli.",
    tokenisasi: [
      "integrasi", "teknologi", "pelacakan", "gerak", "dengan", "kurikulum",
      "pendidikan", "jasmani", "di", "sekolah", "dan", "universitas", "membuka",
      "peluang", "baru", "dalam", "pengajaran", "olahraga", "bola", "voli",
      "yang", "lebih", "efektif", "dan", "terukur", "platform", "analitik",
      "berbasis", "cloud", "mengolah", "data", "dari", "sensor", "pelacakan",
      "yang", "dipakai", "atlet", "mahasiswa", "untuk", "menghasilkan", "laporan",
      "performa", "individual", "dan", "rekomendasi", "peningkatan", "teknik",
      "bermain", "secara", "otomatis", "model", "evaluasi", "pendidikan",
      "jasmani", "modern", "yang", "menggabungkan", "penilaian", "tradisional",
      "dengan", "data", "objektif", "dari", "teknologi", "sensor", "pelacakan",
      "gerak", "terbukti", "meningkatkan", "motivasi", "belajar", "dan",
      "pencapaian", "keterampilan", "motorik", "siswa", "dalam", "permainan",
      "bola", "voli"
    ],
    filtering: [
      "integrasi", "teknologi", "pelacakan", "gerak", "kurikulum", "pendidikan",
      "jasmani", "sekolah", "universitas", "membuka", "peluang", "baru",
      "pengajaran", "olahraga", "bola", "voli", "efektif", "terukur",
      "platform", "analitik", "berbasis", "cloud", "mengolah", "data",
      "sensor", "pelacakan", "dipakai", "atlet", "mahasiswa", "menghasilkan",
      "laporan", "performa", "individual", "rekomendasi", "peningkatan",
      "teknik", "bermain", "otomatis", "model", "evaluasi", "pendidikan",
      "jasmani", "modern", "menggabungkan", "penilaian", "tradisional",
      "data", "objektif", "teknologi", "sensor", "pelacakan", "gerak",
      "terbukti", "meningkatkan", "motivasi", "belajar", "pencapaian",
      "keterampilan", "motorik", "siswa", "permainan", "bola", "voli"
    ],
    stemming: [
      "integrasi", "teknologi", "lacak", "gerak", "kurikulum", "didik",
      "jasmani", "sekolah", "universitas", "buka", "peluang", "baru",
      "ajar", "olahraga", "bola", "voli", "efektif", "ukur",
      "platform", "analitik", "basis", "cloud", "olah", "data",
      "sensor", "lacak", "pakai", "atlet", "mahasiswa", "hasil",
      "lapor", "performa", "individual", "rekomendasi", "tingkat",
      "teknik", "main", "otomatis", "model", "evaluasi", "didik",
      "jasmani", "modern", "gabung", "nilai", "tradisional",
      "data", "objektif", "teknologi", "sensor", "lacak", "gerak",
      "bukti", "tingkat", "motivasi", "ajar", "capai",
      "terampil", "motorik", "siswa", "main", "bola", "voli"
    ],
  },
];

export default function Step10StudiKasus() {
  const [loadedDocs, setLoadedDocs] = useState<StaticCaseDoc[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const fileList = Array.from(files);
    const readPromises = fileList.map(
      (file) =>
        new Promise<{ name: string; text: string }>((resolve) => {
          const reader = new FileReader();
          reader.onload = (ev) =>
            resolve({ name: file.name, text: (ev.target?.result as string) || "" });
          reader.readAsText(file);
        })
    );

    Promise.all(readPromises).then((uploaded) => {
      const isSampleLoaded = loadedDocs.some((d) => d.id.startsWith("sample_dok_"));

      const newDocs: StaticCaseDoc[] = uploaded.map((f, idx) => {
        const text = f.text.trim();
        const parsed = processParsing(text);
        const tokens = processTokenization(parsed);
        const filtered = processFiltering(tokens);
        const stemmed = processStemming(filtered);

        return {
          id: `dok_${Date.now()}_${idx}`,
          dok: "",
          filename: f.name,
          isiDokumen: text,
          tokenisasi: tokens,
          filtering: filtered,
          stemming: stemmed,
        };
      });

      setLoadedDocs((prev) => {
        // Jika sebelumnya yang aktif adalah contoh dokumen bawaan, ganti langsung seluruhnya
        const baseDocs = isSampleLoaded ? [] : prev;
        const combined = [...baseDocs, ...newDocs];
        return combined.map((d, index) => ({
          ...d,
          dok: `D${index + 1}`,
        }));
      });
    });

    e.target.value = "";
  }

  function handleLoadSampleFiles() {
    const docs: StaticCaseDoc[] = STATIC_STAGING_DATA.map((s, idx) => ({
      id: `sample_dok_${idx + 1}`,
      dok: `D${idx + 1}`,
      filename: s.filename,
      isiDokumen: s.isiDokumen,
      tokenisasi: s.tokenisasi,
      filtering: s.filtering,
      stemming: s.stemming,
    }));
    setLoadedDocs(docs);
  }

  function handleReset() {
    setLoadedDocs([]);
  }

  return (
    <div className="space-y-6">
      <StepExplanation
        stepNumber="10"
        title="Studi Kasus"
        summary="Muat file dokumen terlebih dahulu untuk menampilkan hasil komparasi data tahapan pra-pemrosesan teks."
        theory="Studi kasus menampilkan alur pra-pemrosesan teks dari awal hingga akhir secara berdampingan pada dokumen nyata. Dengan membandingkan teks asli, hasil tokenisasi (pemotongan kata), filtering (penyaringan kata umum), dan stemming (pengubahan ke kata dasar) dalam satu tabel terpadu, pengguna dapat melihat secara langsung bagaimana dokumen teks mentah disaring dan disederhanakan langkah demi langkah hingga siap diindeks oleh mesin pencari."
        concepts={[
          { term: "Alur Terpadu (End-to-End)", definition: "Proses lengkap dari teks mentah hingga token kata dasar yang siap dihitung bobotnya." },
          { term: "Tabel Komparasi", definition: "Tampilan berdampingan untuk melihat perubahan kata di setiap tahapan secara langsung." },
          { term: "Pengurangan Jumlah Kata", definition: "Pengurangan kata-kata yang tidak penting sehingga ukuran data menjadi lebih ringkas." },
          { term: "Uji Dokumen Nyata", definition: "Pengujian pada dokumen artikel asli untuk memastikan sistem bekerja dengan baik." },
        ]}
        formula="Persentase Pengurangan Kata = ( (Jumlah Kata Awal - Jumlah Kata Akhir) / Jumlah Kata Awal ) x 100%"
        example={{
          input: '"Penerapan teknologi pelacakan gerak berbasis sensor inersial pada atlet bola voli..." (Total: 68 kata)',
          output: 'Tokenisasi: 68 kata -> Filtering: 54 kata (14 kata umum dibuang) -> Stemming: 54 kata dasar',
          explanation: "Sebanyak 20.6% kata disaring sebagai kata henti, dan kata berimbuhan diubah menjadi kata dasar yang seragam."
        }}
        details={[
          "<strong>Komparasi Lengkap Berdampingan:</strong> Menampilkan hasil transformasi teks secara simultan melalui kolom Teks Asli, Tokenisasi, Filtering, dan Stemming pada dokumen nyata.",
          "<strong>Studi Kasus Korpus Nyata:</strong> Menggunakan artikel bertema olahraga dan biomekanika untuk menguji konsistensi pemrosesan istilah teknis maupun kata umum.",
          "<strong>Observasi Reduksi Kata:</strong> Memungkinkan pengguna mengamati secara langsung bagaimana teks mentah disederhanakan menjadi representasi kata-kata dasar yang bersih dan siap diolah oleh mesin pencari."
        ]}
      />

      <input
        ref={fileInputRef}
        type="file"
        accept=".txt"
        multiple
        onChange={handleFileUpload}
        className="hidden"
      />

      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={() => fileInputRef.current?.click()}
          className="px-6 py-2.5 bg-brand hover:bg-brand-dark text-white font-semibold rounded-xl shadow-sm active:scale-95 transition-all cursor-pointer text-sm"
        >
          Unggah File Dokumen (.txt)
        </button>
        <button
          onClick={handleLoadSampleFiles}
          className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl border border-slate-300 active:scale-95 transition-all cursor-pointer text-sm"
        >
          Muat Contoh File
        </button>
        {loadedDocs.length > 0 && (
          <button
            onClick={handleReset}
            className="px-4 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 font-medium rounded-xl active:scale-95 transition-all cursor-pointer text-sm ml-auto"
          >
            Reset
          </button>
        )}
      </div>

      <div className="flex items-center justify-between text-xs text-slate-500 px-1 flex-wrap gap-2">
        <span>* Anda dapat memilih beberapa file sekaligus (tahan Ctrl atau Shift saat memilih file .txt). File baru akan otomatis ditambahkan ke daftar.</span>
        {loadedDocs.length > 0 && (
          <div className="flex items-center gap-3">
            <span>Total: <strong>{loadedDocs.length}</strong> dokumen aktif</span>
            <ExportResultPdfButton
              resultRef={resultRef}
              title="Komparasi Pre-processing Studi Kasus"
              stepNumber="10"
            />
          </div>
        )}
      </div>

      {loadedDocs.length === 0 ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-slate-300 hover:border-brand rounded-2xl py-14 text-center cursor-pointer bg-white transition-colors"
        >
          <p className="text-sm font-medium text-slate-600">
            Belum ada dokumen yang dimuat dari file.
          </p>
          <p className="text-xs text-slate-400 mt-1">
            Klik di sini untuk memilih file .txt atau klik &ldquo;Muat Contoh File&rdquo; di atas.
          </p>
        </div>
      ) : (
        <div ref={resultRef} className="overflow-x-auto rounded-2xl border border-slate-200 shadow-sm bg-white p-4">
          <table className="w-full text-sm border-collapse table-auto">
            <thead>
              <tr className="bg-slate-800 text-white text-center">
                <th className="px-4 py-3.5 whitespace-nowrap w-24">
                  Dokumen Ke-i
                </th>
                <th className="px-4 py-3.5 min-w-[280px] text-left">
                  Isi Dokumen
                </th>
                <th className="px-4 py-3.5 min-w-[240px] text-left">
                  Tokenisasi
                </th>
                <th className="px-4 py-3.5 min-w-[240px] text-left">
                  Filtering
                </th>
                <th className="px-4 py-3.5 min-w-[240px] text-left">
                  Stemming
                </th>
              </tr>
            </thead>
            <tbody>
              {loadedDocs.map((row, index) => (
                <tr
                  key={row.id}
                  className={`border-t border-slate-200 align-top transition-colors hover:bg-slate-100 ${
                    index % 2 === 1 ? "bg-slate-50" : "bg-white"
                  }`}
                >
                  <td className="px-4 py-3.5 text-center font-bold text-brand whitespace-nowrap">
                    {row.dok}
                  </td>
                  <td className="px-4 py-3.5 text-left text-slate-700 leading-relaxed text-xs">
                    {row.isiDokumen}
                  </td>
                  <td className="px-4 py-3.5 text-left">
                    <div className="flex flex-wrap gap-1">
                      {row.tokenisasi.map((t, i) => (
                        <span key={i} className="bg-teal-100 text-teal-800 px-1.5 py-0.5 rounded-full text-[10px] font-medium">
                          {t}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-left">
                    <div className="flex flex-wrap gap-1">
                      {row.filtering.map((t, i) => (
                        <span key={i} className="bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded-full text-[10px] font-medium">
                          {t}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-left">
                    <div className="flex flex-wrap gap-1">
                      {row.stemming.map((t, i) => (
                        <span key={i} className="bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded-full text-[10px] font-medium">
                          {t}
                        </span>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
