import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between px-8 py-4 bg-slate-800 border-b border-white/10 text-teal-200">
      {/* Logo/Name */}
      <div className="text-xl font-bold text-inherit hover:text-orange-200 transition-colors">
        <Link href="/">Home</Link>
      </div>

      {/* Links */}
      <div className="flex px-15 columns-2 text-inherit font-bold divide-x divide-white/10">
        <Link href="/about" className="px-4 hover:text-orange-200 transition-colors">About Me</Link>
        <Link href="/test-results" className="px-4 hover:text-orange-200 transition-colors">Test Results</Link>
        <Link href="/contact" className="px-4 hover:text-orange-200 transition-colors">Contact</Link>
      </div>
    </nav>
  );
}