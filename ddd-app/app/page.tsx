import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-slate-800 text-teal-200">
      <h1 className="text-7xl font-bold">Dan Dutil</h1>
      <p className="mt-4 text-lg">Building, Testing, and Automating.</p>
      <button className="mt-8 px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-lg transition-all">
        Download My Resume
      </button>
    </main>
  );
}
