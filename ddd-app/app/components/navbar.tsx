import Link from 'next/link';

export default function Navbar() {
  const navLinks = [
    { name: "Experience", href: "/experience" },
    { name: "Test Results", href: "/test-results" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <nav className="flex items-center justify-between px-8 py-4 bg-slate-800 border-b border-white/10 text-teal-200">
      {/* Logo/Name */}
      <div className="text-xl font-bold text-inherit hover:text-orange-200 transition-colors">
        <Link href="/">Home</Link>
      </div>

      {/* Links */}
      <div className="flex px-15 columns-2 text-inherit font-bold divide-x divide-white/10">
        {navLinks.map((tab, idx) => (
          <Link key={idx} href={tab.href} className="px-4 hover:text-orange-200 transition-colors">{tab.name}</Link>
        ))}
      </div>
    </nav>
  );
}