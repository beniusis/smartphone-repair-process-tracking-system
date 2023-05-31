import Navbar from "@/components/Navbar";

export default function Index() {
  return (
    <>
      <main className="min-h-screen flex flex-row">
        <Navbar />
        <div className="w-full flex justify-center items-center">
          <h1 className="text-6xl font-bold text-slate-900 drop-shadow-2xl">
            Išmaniųjų telefonų remonto proceso sekimo sistema
          </h1>
        </div>
      </main>
    </>
  );
}
