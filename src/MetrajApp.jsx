import React, { useState } from "react";
import * as XLSX from "xlsx";

function parseSequence(seq) {
  if (!seq) return [];
  return seq
    .replace(/→|->|--|—|–|>/g, " ") // tüm ok işaretlerini boşlukla değiştir
    .replace(/[,;]/g, " ")          // virgül ve noktalı virgül de boşluk olsun
    .split(/\s+/)                   // boşluklara göre ayır
    .filter((v) => v.length);       // boş değerleri at
}

const COLUMNS = [
  { key: "start", label: "Başlangıç Baca" },
  { key: "end", label: "Bitiş Baca" },
  { key: "mesafe", label: "Mesafe (m)" },
  { key: "boru", label: "Boru Çapı" },
  { key: "bz", label: "Başlangıç Zemin" },
  { key: "bg", label: "Başlangıç Giriş" },
  { key: "bc", label: "Başlangıç Çıkış" },
  { key: "ez", label: "Bitiş Zemin" },
  { key: "eg", label: "Bitiş Giriş" },
  { key: "ec", label: "Bitiş Çıkış" },
  { key: "hat", label: "Hat" },
];

export default function MetrajApp() {
  const [pdfFile, setPdfFile] = useState(null);
  const [mainHat, setMainHat] = useState("");
  const [kilciks, setKilciks] = useState([""]);
  const [rows, setRows] = useState([]);

  const handleKilcikChange = (idx, val) => {
    const clone = [...kilciks];
    clone[idx] = val;
    setKilciks(clone);
  };

  const addKilcik = () => setKilciks([...kilciks, ""]);
  const removeKilcik = (idx) => setKilciks(kilciks.filter((_, i) => i !== idx));

  const handleGenerate = () => {
    const newRows = [];
    const seq = parseSequence(mainHat);
    for (let i = 0; i < seq.length - 1; i++) {
      newRows.push({
        start: seq[i],
        end: seq[i + 1],
        mesafe: "",
        boru: "",
        bz: "",
        bg: "",
        bc: "",
        ez: "",
        eg: "",
        ec: "",
        hat: "ANA HAT",
      });
    }
    kilciks.forEach((k, index) => {
      const parts = parseSequence(k);
      for (let i = 0; i < parts.length - 1; i++) {
        newRows.push({
          start: parts[i],
          end: parts[i + 1],
          mesafe: "",
          boru: "",
          bz: "",
          bg: "",
          bc: "",
          ez: "",
          eg: "",
          ec: "",
          hat: `KILÇIK ${index + 1}`,
        });
      }
    });
    setRows(newRows);
  };

  const handleCellChange = (idx, key, value) => {
    const clone = [...rows];
    clone[idx][key] = value;
    setRows(clone);
  };

  const exportExcel = () => {
    if (!rows.length) return;
    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Metraj");
    XLSX.writeFile(workbook, "metraj_cetveli.xlsx");
  };

  return (
    <div className="p-4 space-y-6 max-w-7xl mx-auto">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Altyapı Metraj Sıralama Sistemi</h1>
        <p className="text-sm text-gray-500">
          PDF → Veri Çıkarma (yakında) · Manuel Sıralama → Otomatik Metraj Cetveli
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="border rounded p-4 space-y-4">
          <h2 className="font-semibold">ADIM 1: PDF / DWG Yükle</h2>
          <input
            type="file"
            accept=".pdf,.dwg,.dxf"
            onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
            className="border p-1 w-full"
          />
          {pdfFile && <p className="text-xs">Seçilen dosya: {pdfFile.name}</p>}
        </div>

        <div className="border rounded p-4 space-y-4">
          <h2 className="font-semibold">ADIM 2: Hat Sıralaması</h2>
          <div>
            <label className="text-sm font-medium">ANA HAT (akar yönüne göre)</label>
            <textarea
              placeholder="1425 → 1424 → 1423 → 1422"
              value={mainHat}
              onChange={(e) => setMainHat(e.target.value)}
              className="border p-1 w-full mt-1"
            />
          </div>
          {kilciks.map((k, idx) => (
            <div key={idx} className="relative">
              <label className="text-sm font-medium">KILÇIK {idx + 1}</label>
              <textarea
                placeholder="1417 → 1416"
                value={k}
                onChange={(e) => handleKilcikChange(idx, e.target.value)}
                className="border p-1 w-full mt-1"
              />
              <button
                className="absolute top-0 right-0 text-red-500"
                onClick={() => removeKilcik(idx)}
              >
                ✕
              </button>
            </div>
          ))}
          <button
            onClick={addKilcik}
            className="bg-gray-200 px-3 py-1 rounded"
          >
            + Yeni Kılçık Ekle
          </button>
        </div>

        <div className="border rounded p-4 space-y-4 col-span-1">
          <h2 className="font-semibold">ADIM 3: Metraj Cetveli</h2>
          <div className="flex gap-2">
            <button onClick={handleGenerate} className="bg-blue-500 text-white px-3 py-1 rounded">
              Metraj Cetvelini Oluştur
            </button>
            <button onClick={exportExcel} className="border px-3 py-1 rounded">
              Excel İndir
            </button>
          </div>
          <div className="overflow-auto max-h-[50vh]">
            <table className="w-full text-xs border">
              <thead className="bg-gray-100">
                <tr>
                  {COLUMNS.map((c) => (
                    <th key={c.key} className="border px-2 py-1">
                      {c.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, rIdx) => (
                  <tr key={rIdx}>
                    {COLUMNS.map((c) => (
                      <td key={c.key} className="border p-1">
                        {c.key === "hat" || c.key === "start" || c.key === "end" ? (
                          row[c.key]
                        ) : (
                          <input
                            value={row[c.key]}
                            onChange={(e) => handleCellChange(rIdx, c.key, e.target.value)}
                            className="border px-1 py-0.5 w-full"
                          />
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
                {!rows.length && (
                  <tr>
                    <td colSpan={COLUMNS.length} className="text-center p-4">
                      Henüz tablo oluşturulmadı.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
