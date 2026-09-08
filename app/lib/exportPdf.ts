import jsPDF from "jspdf";
import autoTable, { RowInput } from "jspdf-autotable";

export interface ExportPdfOptions {
  title: string;
  stepNumber: number | string;
}

interface BadgeItem {
  text: string;
  bg: [number, number, number];
  textCol: [number, number, number];
  strike?: boolean;
}

function getBadgeColors(className: string): { bg: [number, number, number]; textCol: [number, number, number]; strike?: boolean } {
  const strike = className.includes("line-through");
  if (className.includes("emerald")) {
    return { bg: [209, 250, 229], textCol: [6, 95, 70], strike };
  }
  if (className.includes("amber")) {
    return { bg: [254, 243, 199], textCol: [146, 64, 14], strike };
  }
  if (className.includes("teal")) {
    return { bg: [204, 251, 241], textCol: [17, 94, 89], strike };
  }
  if (className.includes("violet")) {
    return { bg: [237, 233, 254], textCol: [91, 33, 182], strike };
  }
  if (className.includes("red") || className.includes("rose")) {
    return { bg: [255, 228, 230], textCol: [159, 18, 57], strike };
  }
  if (className.includes("blue")) {
    return { bg: [239, 246, 255], textCol: [29, 78, 216], strike };
  }
  return { bg: [241, 245, 249], textCol: [51, 65, 85], strike };
}

export async function exportElementToPdf(
  targetElement: HTMLElement,
  options: ExportPdfOptions
): Promise<void> {
  const isWideMode = Number(options.stepNumber) === 10 || Number(options.stepNumber) === 11;
  const orientation = isWideMode ? "l" : "p";

  const doc = new jsPDF(orientation, "mm", "a4");
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // 1. Header Banner Elegan
  doc.setFillColor(27, 107, 99); // #1b6b63
  doc.roundedRect(10, 8, pageWidth - 20, 24, 3, 3, "F");

  // Tag Badge STKI ANALYZER
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(14, 11, 32, 5.5, 1.5, 1.5, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(27, 107, 99);
  doc.text("STKI ANALYZER", 16, 15);

  // Badge Langkah
  doc.setFillColor(34, 135, 125);
  doc.roundedRect(48, 11, 24, 5.5, 1.5, 1.5, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(255, 255, 255);
  doc.text(`Langkah ${options.stepNumber}`, 50.5, 15);

  // Tanggal & Waktu di pojok kanan
  const now = new Date();
  const dateStr = now.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  const timeStr = now.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  }) + " WIB";

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(226, 232, 240);
  doc.text(`Tanggal: ${dateStr}`, pageWidth - 14, 14, { align: "right" });
  doc.text(`Waktu: ${timeStr}`, pageWidth - 14, 18.5, { align: "right" });

  // Judul Halaman
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.setTextColor(255, 255, 255);
  doc.text(options.title, 14, 23.5);

  // Subtitle
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(203, 213, 225);
  doc.text("Laporan Resmi Hasil Pemrosesan Sistem Temu Kembali Informasi", 14, 28);

  let startY = 36;

  // -------------------------------------------------------------
  // KASUS KHUSUS STEP 9: UJI PENCARIAN (CARD RANKING & BADGES)
  // -------------------------------------------------------------
  const searchResultCards = targetElement.querySelectorAll(".bg-slate-50\\/70, [class*='bg-slate-50']");

  if (Number(options.stepNumber) === 9 && searchResultCards.length > 0) {
    const tableBody: any[] = [];
    const cellBadgesMap: Record<string, BadgeItem[]> = {};

    searchResultCards.forEach((card, idx) => {
      const rankText = `${idx + 1}`;
      const docLabel = (card.querySelector(".font-bold")?.textContent || "").trim();
      const filename = (card.querySelector(".text-slate-400")?.textContent || "").trim();
      const score = (card.querySelector(".bg-emerald-100")?.textContent || "").replace(/\s+/g, " ").trim();
      const rawSnippet = (card.querySelector("p")?.textContent || "").trim();

      const matchedBadges = card.querySelectorAll(".rounded-full");
      const badges: BadgeItem[] = [];
      matchedBadges.forEach((b) => {
        const text = (b.textContent || "").trim();
        if (text && !text.includes("Skor")) {
          const colors = getBadgeColors(b.className);
          badges.push({ text, bg: colors.bg, textCol: colors.textCol });
        }
      });

      cellBadgesMap[`${idx}_3`] = badges;

      tableBody.push([
        rankText,
        `${docLabel}\n(${filename})`,
        score,
        "\n".repeat(Math.max(2, Math.ceil(badges.length / 3))),
        rawSnippet,
      ]);
    });

    autoTable(doc, {
      head: [["Peringkat", "Dokumen", "Skor Relevansi", "Kata Kunci Cocok (Gelembung)", "Cuplikan Dokumen"]],
      body: tableBody,
      startY,
      theme: "grid",
      rowPageBreak: "auto",
      showHead: "everyPage",
      headStyles: {
        fillColor: [30, 41, 59],
        textColor: [255, 255, 255],
        fontStyle: "bold",
        fontSize: 8,
        halign: "center",
        valign: "middle",
      },
      columnStyles: {
        0: { cellWidth: 16, halign: "center", fontStyle: "bold" },
        1: { cellWidth: 32, fontStyle: "bold" },
        2: { cellWidth: 26, halign: "center" },
        3: { cellWidth: 46 },
        4: { cellWidth: "auto" },
      },
      bodyStyles: {
        fontSize: 7.5,
        cellPadding: 2.5,
        overflow: "linebreak",
        valign: "top",
      },
      didDrawCell: (data) => {
        if (data.section === "body" && data.column.index === 3) {
          const badges = cellBadgesMap[`${data.row.index}_3`];
          if (badges && badges.length > 0) {
            renderBadgesInCell(doc, data, badges);
          }
        }
      },
      didDrawPage: (dataHook) => renderPageFooter(doc, dataHook, pageWidth, pageHeight),
    });

    savePdfFile(doc, options);
    return;
  }

  // -------------------------------------------------------------
  // EKSTRAKSI TABEL LANGSUNG DARI DOM (Step 1-8, 10, dan 11 Lengkap)
  // -------------------------------------------------------------
  const tables = targetElement.querySelectorAll("table");

  if (tables.length > 0) {
    tables.forEach((table) => {
      const head: string[][] = [];
      const rawRowsHtml: HTMLTableRowElement[] = [];

      const theadRows = table.querySelectorAll("thead tr");
      if (theadRows.length > 0) {
        theadRows.forEach((tr) => {
          const rowData: string[] = [];
          tr.querySelectorAll("th, td").forEach((cell) => {
            rowData.push((cell.textContent || "").trim().replace(/\s+/g, " "));
          });
          if (rowData.length > 0) head.push(rowData);
        });
      }

      const tbodyRows = table.querySelectorAll("tbody tr");
      if (tbodyRows.length > 0) {
        tbodyRows.forEach((tr) => rawRowsHtml.push(tr as HTMLTableRowElement));
      } else {
        const allTr = table.querySelectorAll("tr");
        allTr.forEach((tr, idx) => {
          if (idx === 0 && head.length === 0) {
            const rowData: string[] = [];
            tr.querySelectorAll("th, td").forEach((cell) => {
              rowData.push((cell.textContent || "").trim().replace(/\s+/g, " "));
            });
            if (rowData.length > 0) head.push(rowData);
          } else {
            rawRowsHtml.push(tr as HTMLTableRowElement);
          }
        });
      }

      const colCount = (head[0] || []).length;
      const columnStyles: Record<number, any> = {};

      if (Number(options.stepNumber) === 10) {
        columnStyles[0] = { cellWidth: 16, fontStyle: "bold", halign: "center" };
        columnStyles[1] = { cellWidth: 78 };
        columnStyles[2] = { cellWidth: 60 };
        columnStyles[3] = { cellWidth: 60 };
        columnStyles[4] = { cellWidth: 60 };
      } else if (Number(options.stepNumber) === 11) {
        if (colCount >= 7) {
          columnStyles[0] = { cellWidth: 32, fontStyle: "bold" };
          columnStyles[1] = { cellWidth: 42 };
          columnStyles[2] = { cellWidth: 42 };
          columnStyles[3] = { cellWidth: 42 };
          columnStyles[4] = { cellWidth: 38 };
          columnStyles[5] = { cellWidth: 38 };
          columnStyles[6] = { cellWidth: 38 };
        } else if (colCount === 4) {
          columnStyles[0] = { cellWidth: 30, fontStyle: "bold" };
          columnStyles[1] = { cellWidth: 80 };
          columnStyles[2] = { cellWidth: 70 };
          columnStyles[3] = { cellWidth: "auto" };
        }
      } else {
        if (colCount === 2) {
          columnStyles[0] = { cellWidth: 16, fontStyle: "bold", halign: "center" };
          columnStyles[1] = { cellWidth: "auto" };
        } else if (colCount === 3) {
          columnStyles[0] = { cellWidth: 16, fontStyle: "bold", halign: "center" };
          columnStyles[1] = { cellWidth: 85 };
          columnStyles[2] = { cellWidth: "auto" };
        }
      }

      // Rendering baris dengan gelembung kata dan tinggi dinamis
      const finalBodyData: any[][] = [];
      const cellBadgesMap: Record<string, BadgeItem[]> = {};

      rawRowsHtml.forEach((tr, rIdx) => {
        const rowCells = tr.querySelectorAll("td, th");
        const rowData: any[] = [];

        rowCells.forEach((cell, cIdx) => {
          const badges = cell.querySelectorAll(".rounded-full, .rounded");
          if (badges.length > 0) {
            const items: BadgeItem[] = [];
            badges.forEach((b) => {
              const text = (b.textContent || "").trim();
              if (text) {
                const colors = getBadgeColors(b.className);
                items.push({ text, bg: colors.bg, textCol: colors.textCol, strike: colors.strike });
              }
            });

            cellBadgesMap[`${rIdx}_${cIdx}`] = items;

            let colWidthMm = 55;
            if (columnStyles[cIdx]?.cellWidth) {
              colWidthMm = columnStyles[cIdx].cellWidth;
            }

            const padding = 2;
            const availableW = colWidthMm - padding * 2;
            const badgeH = 4.0;
            const gapX = 1.1;
            const gapY = 1.3;

            doc.setFont("helvetica", "normal");
            doc.setFontSize(6.5);

            let curX = 0;
            let curY = 0;
            items.forEach((item) => {
              const textW = doc.getTextWidth(item.text);
              const badgeW = textW + 3.0;

              if (curX + badgeW > availableW && curX > 0) {
                curX = 0;
                curY += badgeH + gapY;
              }
              curX += badgeW + gapX;
            });

            const calculatedH = Math.max(10, curY + badgeH + padding * 2 + 1.5);
            rowData.push({
              content: "",
              styles: { minCellHeight: calculatedH },
            });
          } else {
            rowData.push((cell.textContent || "").trim().replace(/\s+/g, " "));
          }
        });

        finalBodyData.push(rowData);
      });

      if (startY + 25 > pageHeight) {
        doc.addPage();
        startY = 14;
      }

      autoTable(doc, {
        head: head.length > 0 ? head : undefined,
        body: finalBodyData as RowInput[],
        startY,
        theme: "grid",
        rowPageBreak: "auto",
        showHead: "everyPage",
        headStyles: {
          fillColor: [30, 41, 59],
          textColor: [255, 255, 255],
          fontStyle: "bold",
          fontSize: colCount >= 7 ? 6.5 : 7.5,
          cellPadding: 2,
          halign: "center",
          valign: "middle",
        },
        bodyStyles: {
          textColor: [30, 41, 59],
          fontSize: colCount >= 7 ? 6 : 7,
          cellPadding: 2.2,
          overflow: "linebreak",
          valign: "top",
        },
        alternateRowStyles: {
          fillColor: [248, 250, 252],
        },
        columnStyles,
        margin: { left: 10, right: 10, bottom: 12 },
        styles: {
          font: "helvetica",
          lineColor: [226, 232, 240],
          lineWidth: 0.2,
        },
        didDrawCell: (data) => {
          if (data.section === "body") {
            const key = `${data.row.index}_${data.column.index}`;
            const badges = cellBadgesMap[key];

            if (badges && badges.length > 0) {
              renderBadgesInCell(doc, data, badges);
            }
          }
        },
        didDrawPage: (dataHook) => renderPageFooter(doc, dataHook, pageWidth, pageHeight),
      });

      const lastAutoTable = (doc as any).lastAutoTable;
      startY = lastAutoTable ? lastAutoTable.finalY + 8 : startY + 40;
    });
  } else {
    // -------------------------------------------------------------
    // EKSTRAKSI SINGLE VIEW CARD VIEW STEP 11
    // -------------------------------------------------------------
    const stepCards = targetElement.querySelectorAll(".bg-white.border.border-slate-200.rounded-2xl");
    if (stepCards.length > 0) {
      const singleRows: any[] = [];
      const cellBadgesMap: Record<string, BadgeItem[]> = {};

      stepCards.forEach((card, idx) => {
        const titleEl = card.querySelector("h3");
        if (!titleEl) return;
        const title = titleEl.textContent?.trim() || `Tahap ${idx + 1}`;
        const desc = (card.querySelector("p")?.textContent || "").trim();

        if (card.querySelector("table")) return;

        const badges = card.querySelectorAll(".rounded-full, .rounded");
        const badgeList: BadgeItem[] = [];
        badges.forEach((b) => {
          const text = (b.textContent || "").trim();
          if (text && !text.includes("Total:") && !text.includes("Sisa:") && !text.includes("dihapus") && !text.includes("kata berubah")) {
            const colors = getBadgeColors(b.className);
            badgeList.push({ text, bg: colors.bg, textCol: colors.textCol, strike: colors.strike });
          }
        });

        const rowIdx = singleRows.length;
        if (badgeList.length > 0) {
          cellBadgesMap[`${rowIdx}_2`] = badgeList;

          const colWidthMm = 145;
          const padding = 2;
          const availableW = colWidthMm - padding * 2;
          const badgeH = 4.2;
          const gapX = 1.2;
          const gapY = 1.4;

          doc.setFont("helvetica", "normal");
          doc.setFontSize(6.5);

          let curX = 0;
          let curY = 0;
          badgeList.forEach((item) => {
            const textW = doc.getTextWidth(item.text);
            const badgeW = textW + 3.2;
            if (curX + badgeW > availableW && curX > 0) {
              curX = 0;
              curY += badgeH + gapY;
            }
            curX += badgeW + gapX;
          });

          const calculatedHeight = Math.max(14, curY + badgeH + padding * 2 + 2);

          singleRows.push([
            title,
            desc,
            {
              content: "",
              styles: { minCellHeight: calculatedHeight },
            },
          ]);
        } else {
          const mono = card.querySelector(".font-mono");
          const contentStr = (mono?.textContent || card.textContent || "").trim().replace(/\s+/g, " ");
          singleRows.push([title, desc, contentStr]);
        }
      });

      autoTable(doc, {
        head: [["Tahapan Pre-processing", "Deskripsi Proses", "Visualisasi Output / Gelembung Kata"]],
        body: singleRows,
        startY,
        theme: "grid",
        rowPageBreak: "auto",
        showHead: "everyPage",
        headStyles: {
          fillColor: [30, 41, 59],
          textColor: [255, 255, 255],
          fontStyle: "bold",
          fontSize: 8,
          halign: "center",
          valign: "middle",
        },
        columnStyles: {
          0: { cellWidth: 55, fontStyle: "bold" },
          1: { cellWidth: 70 },
          2: { cellWidth: 145 },
        },
        bodyStyles: {
          fontSize: 7.5,
          cellPadding: 3,
          overflow: "linebreak",
          valign: "top",
        },
        didDrawCell: (data) => {
          if (data.section === "body" && data.column.index === 2) {
            const badges = cellBadgesMap[`${data.row.index}_2`];
            if (badges && badges.length > 0) {
              renderBadgesInCell(doc, data, badges);
            }
          }
        },
        didDrawPage: (dataHook) => renderPageFooter(doc, dataHook, pageWidth, pageHeight),
      });
    } else {
      const text = (targetElement.textContent || "").trim();
      const splitText = doc.splitTextToSize(text, pageWidth - 20);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(30, 41, 59);
      doc.text(splitText, 10, startY);
    }
  }

  savePdfFile(doc, options);
}

// -------------------------------------------------------------
// HELPER DRAWING BADGES / GELEMBUNG
// -------------------------------------------------------------
function renderBadgesInCell(doc: jsPDF, data: any, badges: BadgeItem[]) {
  const padding = 1.8;
  const cellX = data.cell.x + padding;
  const cellY = data.cell.y + padding;
  const cellW = data.cell.width - padding * 2;

  let curX = cellX;
  let curY = cellY;
  const badgeHeight = 4.0;
  const gapX = 1.1;
  const gapY = 1.2;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.5);

  badges.forEach((b) => {
    const textWidth = doc.getTextWidth(b.text);
    const badgeWidth = textWidth + 3.0;

    if (curX + badgeWidth > cellX + cellW && curX > cellX) {
      curX = cellX;
      curY += badgeHeight + gapY;
    }

    doc.setFillColor(b.bg[0], b.bg[1], b.bg[2]);
    doc.roundedRect(curX, curY, badgeWidth, badgeHeight, 1.6, 1.6, "F");

    doc.setTextColor(b.textCol[0], b.textCol[1], b.textCol[2]);
    doc.text(b.text, curX + 1.5, curY + 2.8);

    if (b.strike) {
      doc.setDrawColor(b.textCol[0], b.textCol[1], b.textCol[2]);
      doc.setLineWidth(0.3);
      doc.line(curX + 1.2, curY + 2.0, curX + badgeWidth - 1.2, curY + 2.0);
    }

    curX += badgeWidth + gapX;
  });
}

function renderPageFooter(doc: jsPDF, dataHook: any, pageWidth: number, pageHeight: number) {
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(148, 163, 184);
  doc.text(
    "Dokumen resmi diekspor otomatis oleh STKI Analyzer • Information Retrieval System",
    10,
    pageHeight - 4.5
  );
  doc.text(
    `Hal. ${dataHook.pageNumber}`,
    pageWidth - 10,
    pageHeight - 4.5,
    { align: "right" }
  );
}

function savePdfFile(doc: jsPDF, options: ExportPdfOptions) {
  const safeTitle = options.title.toLowerCase().replace(/[^a-z0-9]/g, "_");
  const filename = `stki_step_${options.stepNumber}_${safeTitle}.pdf`;
  doc.save(filename);
}
