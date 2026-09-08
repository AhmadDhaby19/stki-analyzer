"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { runFullPipeline } from "../lib/nlpEngine";

export type Document = {
  id: string;
  filename: string;
  rawText: string;
  parsedText: string;
  tokens: string[];
  filteredTokens: string[];
  phrases: string[];
  stemmedTokens: string[];
};

type DocumentContextType = {
  documents: Document[];
  addDocuments: (files: { filename: string; rawText: string }[]) => void;
  clearDocuments: () => void;
  removeDocument: (id: string) => void;
  updateDocumentProcessing: (id: string, data: Partial<Document>) => void;
  loadSampleDocuments: () => void;
  runPreprocessing: () => void;
};

const DocumentContext = createContext<DocumentContextType | null>(null);

let counter = 0;
function uid() {
  return `doc_${++counter}_${Date.now()}`;
}

const sampleDocuments: { filename: string; rawText: string }[] = [
  {
    filename: "tugas_akhir.txt",
    rawText:
      "Mahasiswa Program Studi Teknik Informatika diwajibkan menyelesaikan tugas akhir sebagai syarat kelulusan. Tugas akhir dapat berupa penelitian ilmiah atau pengembangan perangkat lunak yang relevan dengan bidang studi.",
  },
  {
    filename: "jadwal_kuliah.txt",
    rawText:
      "Perkuliahan semester genap tahun akademik 2025/2026 dimulai pada bulan Februari. Setiap mahasiswa wajib melakukan pengisian Kartu Rencana Studi melalui sistem informasi akademik sebelum perkuliahan dimulai.",
  },
];

function buildDoc(filename: string, rawText: string): Document {
  const pipeline = runFullPipeline(rawText);
  return { id: uid(), filename, rawText, ...pipeline };
}

export function DocumentProvider({ children }: { children: ReactNode }) {
  const [documents, setDocuments] = useState<Document[]>([]);

  const addDocuments = useCallback((files: { filename: string; rawText: string }[]) => {
    const newDocs = files.map((f) => buildDoc(f.filename, f.rawText));
    setDocuments((prev) => [...prev, ...newDocs]);
  }, []);

  const clearDocuments = useCallback(() => {
    setDocuments([]);
  }, []);

  const removeDocument = useCallback((id: string) => {
    setDocuments((prev) => prev.filter((d) => d.id !== id));
  }, []);

  const updateDocumentProcessing = useCallback((id: string, data: Partial<Document>) => {
    setDocuments((prev) =>
      prev.map((d) => (d.id === id ? { ...d, ...data } : d))
    );
  }, []);

  const loadSampleDocuments = useCallback(() => {
    const docs = sampleDocuments.map((s) => buildDoc(s.filename, s.rawText));
    setDocuments(docs);
  }, []);

  const runPreprocessing = useCallback(() => {
    setDocuments((prev) =>
      prev.map((doc) => {
        const pipeline = runFullPipeline(doc.rawText);
        return { ...doc, ...pipeline };
      })
    );
  }, []);

  return (
    <DocumentContext
      value={{
        documents,
        addDocuments,
        clearDocuments,
        removeDocument,
        updateDocumentProcessing,
        loadSampleDocuments,
        runPreprocessing,
      }}
    >
      {children}
    </DocumentContext>
  );
}

export function useDocuments() {
  const ctx = useContext(DocumentContext);
  if (!ctx) throw new Error("useDocuments must be used within DocumentProvider");
  return ctx;
}
