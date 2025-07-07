const downloadCSV = (rows) => {
  const headers = ["boru_cap", "uzunluk_m", "akar_kotu_1", "akar_kotu_2"];
  const csvContent = [
    headers.join(","),
    ...rows.map(row =>
      [row.boru_cap, row.uzunluk_m, row.akar_kotu_1, row.akar_kotu_2].join(",")
    )
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", "metraj.csv");
  link.click();
};
import { useState } from "react";

export default function MetrajUploader() {
  const [file, setFile] = useState(null);
  const [data, setData] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return alert("PDF dosyası seçmedin!");

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("https://otomasyon2.onrender.com/extract-metraj", {
      method: "POST",
      body: formData,
    });

    const json = await res.json();
    setData(json.data || []);
  };

  return (
    <div className="p-4">
      <form onSubmit={handleSubmit}>
        <input
          type="file"
          accept=".pdf"
          onChange={(e) => setFile(e.target.files[0])}
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-1 rounded ml-2">
          Gönder
        </button>
      </form>

      {data.length > 0 && (
        <table className="mt-6 border w-full text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th>Boru Çapı</th>
              <th>Uzunluk (m)</th>
              <th>Akar Kot 1</th>
              <th>Akar Kot 2</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, i) => (
              <tr key={i} className="text-center border-t">
                <td>{row.boru_cap}</td>
                <td>{row.uzunluk_m}</td>
                <td>{row.akar_kotu_1}</td>
                <td>{row.akar_kotu_2}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <button
          onClick={() => downloadCSV(data)}
            className="mt-4 px-4 py-2 bg-green-600 text-white rounded"
          >
      Metraj Verisini İndir (CSV)
    </button>
   </>
)}
      )}
    </div>
  );
}
