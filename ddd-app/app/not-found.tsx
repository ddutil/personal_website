export default function NotFound() {
  return (
    <main className="flex flex-col items-center min-h-screen text-slate-200">
      <h1 className="text-8xl font-extrabold text-violet-400 mb-4">404</h1>
      <h2 className="text-2xl font-semibold mb-6">Page Not Found</h2>
      <p className="mb-6">Sorry, the page you’re looking for doesn’t exist.</p>
      <a href="/" className="px-6 py-3 bg-violet-500 hover:bg-violet-600 rounded-full text-slate-200 font-bold shadow-lg">
        Go Home
      </a>
    </main>
  );
}