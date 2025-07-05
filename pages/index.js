import MetrajUploader from "@/components/MetrajUploader";

export default function Home() {
  return (
    <main className="p-10">
      <h1 className="text-xl font-bold mb-4">PDF Metraj Yükleyici</h1>
      <MetrajUploader />
    </main>
  );
}
