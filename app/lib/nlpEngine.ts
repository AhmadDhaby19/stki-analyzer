// NLP utility – client-side Indonesian text processing simulation

export const STOPWORDS = new Set([
  // Kata hubung & preposisi (>= 30 kata hubung/preposisi)
  "dan", "atau", "tetapi", "namun", "serta", "maupun", "melainkan",
  "sedangkan", "padahal", "sebaliknya", "lalu", "kemudian", "selanjutnya",
  "setelah", "sesudah", "sebelum", "sejak", "ketika", "saat", "waktu",
  "hingga", "sampai", "agar", "supaya", "untuk", "bagi", "guna",
  "sebab", "karena", "sehingga", "maka", "jika", "kalau", "bila",
  "asal", "meskipun", "walaupun", "kendati", "biarpun", "seperti",
  "bagai", "laksana", "sebagai", "bahwa", "dengan", "secara", "tanpa",
  "di", "ke", "dari", "pada", "dalam", "oleh", "antara", "tentang", "terhadap",
  // Kata ganti
  "saya", "aku", "kamu", "anda", "ia", "dia", "kami", "kita", "mereka",
  // Kata tunjuk & partikel
  "ini", "itu", "yang", "akan", "telah", "sudah", "belum",
  "sedang", "masih", "sangat", "lebih", "paling", "hanya", "juga",
  "tidak", "bukan", "jangan", "bisa", "dapat", "harus", "mau",
  "ada", "adalah", "ialah", "yaitu", "pun", "pula", "lagi"
]);

export const PHRASE_DICTIONARY = [
  "pendidikan jasmani",
  "sekolah menengah",
  "bola voli",
  "teknik dasar",
  "pelacakan gerak",
  "sensor inersial",
  "analisis performa",
  "perangkat wearable",
  "kinematika gerakan",
  "perguruan tinggi",
  "peserta didik",
];

/** Parsing: strip HTML, newline→spasi, hapus spasi berlebih */
export function processParsing(text: string | undefined | null): string {
  if (!text) return "";
  return text
    .replace(/<[^>]*>/g, " ")
    .replace(/[\r\n]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Tokenisasi: lowercase, hapus non-huruf, split ke array kata */
export function processTokenization(text: string | undefined | null): string[] {
  if (!text) return [];
  return text
    .toLowerCase()
    .replace(/[^a-z\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .split(" ")
    .filter((w) => w.length > 0);
}

/** Hapus stopword */
export function processFiltering(tokens: string[] | undefined | null): string[] {
  if (!tokens) return [];
  return tokens.filter((t) => t.length > 0 && !STOPWORDS.has(t));
}

/** Deteksi frasa berbasis kamus (dictionary-based) */
export function processPhraseDetection(textOrTokens: string | string[] | undefined | null): string[] {
  if (!textOrTokens) return [];
  const text = Array.isArray(textOrTokens) ? textOrTokens.join(" ") : textOrTokens;
  const lowerText = text.toLowerCase();

  const foundPhrases: string[] = [];
  for (const phrase of PHRASE_DICTIONARY) {
    const regex = new RegExp(`\\b${phrase}\\b`, "gi");
    if (regex.test(lowerText)) {
      foundPhrases.push(phrase);
    }
  }
  return foundPhrases;
}

const ROOT_WORDS = new Set([
  "kompetisi", "proliga", "jadi", "ajang", "unjuk", "gigi", "para", "atlet",
  "nasional", "tingkat", "atas", "acara", "kompetitif", "manfaat", "bagai",
  "institusi", "didik", "tinggi", "teliti", "langsung", "dampak", "teknologi",
  "lacak", "gerak", "motion", "tracking", "tingkat", "performa", "fisik",
  "main", "bola", "voli", "profesional", "ajar", "terap", "ukur", "hasil",
  "sekolah", "guru", "siswa", "metode", "dasar", "kembang", "evaluasi",
  "akurasi", "data", "sensor", "analisis", "efektif", "efektivitas", "jasmani",
  "olahraga", "unggul", "latih", "uji", "capai", "bantu", "sistem", "informasi",
  "teliti", "tumbuh", "kaji", "standar", "mutu", "prestasi", "nyata", "kualitas"
]);

/** Kamus lematisasi kata serapan & bentuk khusus */
const LEMMA_MAP: Record<string, string> = {
  kompetisi: "kompetisi",
  kompetitif: "kompetitif",
  institusi: "institusi",
  teknologi: "teknologi",
  efektivitas: "efektif",
  aktivitas: "aktif",
  gigi: "gigi",
  tinggi: "tinggi",
  berbagai: "bagai",
  berbaga: "bagai",
  dimanfaatkan: "manfaat",
  meneliti: "teliti",
  pendidikan: "didik",
  pembelajaran: "ajar",
  peningkatan: "tingkat",
  pelacakan: "lacak",
  pemain: "main",
  menjadi: "jadi",
};

/** Stemming / Lemmatisasi Bahasa Indonesia */
export function stemSingleWord(word: string): string {
  if (word.includes(" ")) return word;
  const lower = word.toLowerCase().trim();
  if (LEMMA_MAP[lower]) return LEMMA_MAP[lower];
  if (ROOT_WORDS.has(lower)) return lower;

  // Jangan potong jika kata pendek
  if (lower.length <= 4) return lower;

  let w = lower;

  // Partikel & Klitik (-lah, -kah, -pun, -ku, -mu, -nya)
  w = w.replace(/(lah|kah|tah|pun)$/, "");
  w = w.replace(/(ku|mu|nya)$/, "");
  if (ROOT_WORDS.has(w)) return w;

  // Sufiks (-kan, -an, -i)
  if (w.endsWith("kan")) {
    const base = w.slice(0, -3);
    if (ROOT_WORDS.has(base) || base.length >= 4) w = base;
  } else if (w.endsWith("an") && !w.endsWith("kan")) {
    const base = w.slice(0, -2);
    if (ROOT_WORDS.has(base) || base.length >= 4) w = base;
  } else if (w.endsWith("i") && !w.endsWith("si") && !w.endsWith("ti")) {
    const base = w.slice(0, -1);
    if (ROOT_WORDS.has(base)) w = base;
  }
  if (ROOT_WORDS.has(w)) return w;

  // Prefiks (Awalan) dengan aturan nasal morphophonemic
  if (w.startsWith("meng") || w.startsWith("peng")) {
    const rest = w.slice(4);
    if (ROOT_WORDS.has(rest)) return rest;
    if (ROOT_WORDS.has("k" + rest)) return "k" + rest;
    if (rest.length >= 3) return rest;
  } else if (w.startsWith("meny") || w.startsWith("peny")) {
    const rest = w.slice(4);
    if (ROOT_WORDS.has("s" + rest)) return "s" + rest;
    if (rest.length >= 3) return rest;
  } else if (w.startsWith("mem") || w.startsWith("pem")) {
    const rest = w.slice(3);
    if (ROOT_WORDS.has(rest)) return rest;
    if (ROOT_WORDS.has("p" + rest)) return "p" + rest;
    if (rest.length >= 3) return rest;
  } else if (w.startsWith("men") || w.startsWith("pen")) {
    const rest = w.slice(3);
    if (ROOT_WORDS.has(rest)) return rest;
    if (ROOT_WORDS.has("t" + rest)) return "t" + rest;
    if (rest.length >= 3) return rest;
  } else if (w.startsWith("ber") || w.startsWith("per") || w.startsWith("ter")) {
    const rest = w.slice(3);
    if (ROOT_WORDS.has(rest)) return rest;
    if (rest.length >= 3) return rest;
  } else if (w.startsWith("di") || w.startsWith("ke") || w.startsWith("se")) {
    const rest = w.slice(2);
    if (ROOT_WORDS.has(rest)) return rest;
    if (rest.length >= 3) return rest;
  } else if (w.startsWith("me") || w.startsWith("pe")) {
    const rest = w.slice(2);
    if (ROOT_WORDS.has(rest)) return rest;
    if (rest.length >= 3) return rest;
  }

  return w.length >= 3 ? w : lower;
}

/** Stemming Bahasa Indonesia rule-based & lematisasi */
export function processStemming(tokens: string[] | undefined | null): string[] {
  if (!tokens) return [];
  return tokens.map((word) => stemSingleWord(word));
}

/** Pipeline lengkap: parsing → tokenisasi → filtering → frasa → stemming */
export function runFullPipeline(text: string | undefined | null) {
  const parsedText = processParsing(text);
  const tokens = processTokenization(parsedText);
  const filteredTokens = processFiltering(tokens);
  const phrases = processPhraseDetection(text);
  const stemmedTokens = processStemming(filteredTokens);
  return { parsedText, tokens, filteredTokens, phrases, stemmedTokens };
}

// --- TF-IDF & Inverted Index ---

export type TFIDFDocument = { id: string; filename?: string; rawText?: string; stemmedTokens?: string[] };
export type TFIDFMatrix = {
  terms: string[];
  docIds: string[];
  matrix: Record<string, Record<string, number>>; // term -> { docId: tfidf }
};

export type InvertedIndexEntry = { docId: string; weight: number };
export type InvertedIndex = Record<string, InvertedIndexEntry[]>;

/** Hitung TF-IDF. Terms = baris unik setelah stemming. */
export function calculateTFIDF(documents: (TFIDFDocument | { id: string; filename?: string; rawText: string })[]): TFIDFMatrix {
  const N = documents.length;
  if (N === 0) return { terms: [], docIds: [], matrix: {} };

  const preparedDocs = documents.map((doc) => {
    const stemmed = "stemmedTokens" in doc && doc.stemmedTokens
      ? doc.stemmedTokens
      : processStemming(processFiltering(processTokenization(processParsing(doc.rawText || ""))));
    return { id: doc.id, tokens: stemmed };
  });

  const termSet = new Set<string>();
  preparedDocs.forEach((d) => d.tokens.forEach((t) => termSet.add(t)));
  const terms = Array.from(termSet).sort();
  const docIds = preparedDocs.map((d) => d.id);

  // Document Frequency
  const df: Record<string, number> = {};
  for (const term of terms) {
    df[term] = preparedDocs.filter((d) => d.tokens.includes(term)).length;
  }

  // Matrix: term -> docId -> weight
  const matrix: Record<string, Record<string, number>> = {};
  for (const term of terms) {
    matrix[term] = {};
    const idf = Math.log(1 + N / (df[term] || 1));
    for (const doc of preparedDocs) {
      const tfCount = doc.tokens.filter((t) => t === term).length;
      const tf = doc.tokens.length ? tfCount / doc.tokens.length : 0;
      matrix[term][doc.id] = +(tf * idf).toFixed(3);
    }
  }

  return { terms, docIds, matrix };
}

/** Inverted Index dari TFIDF matrix atau doc array */
export function buildInvertedIndex(
  tfidfDataOrDocs: TFIDFMatrix | { id: string; filename?: string; rawText?: string; stemmedTokens?: string[] }[]
): InvertedIndex {
  const tfidf = Array.isArray(tfidfDataOrDocs)
    ? calculateTFIDF(tfidfDataOrDocs)
    : tfidfDataOrDocs;

  const index: InvertedIndex = {};
  for (const term of tfidf.terms) {
    const postings: InvertedIndexEntry[] = [];
    for (const docId of tfidf.docIds) {
      const weight = tfidf.matrix[term]?.[docId] ?? 0;
      if (weight > 0) {
        postings.push({ docId, weight });
      }
    }
    if (postings.length > 0) {
      index[term] = postings.sort((a, b) => b.weight - a.weight);
    }
  }
  return index;
}
