import Link from 'next/link';
import Image from 'next/image';

export default function Navbar() {
  const navLinks = [
    { name: "Experience", href: "/experience" },
    { name: "Test Results", href: "/test-results" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <nav className="flex items-center justify-between px-8 py-2 bg-slate-800 border-b border-white/5 text-violet-300">
      {/* Logo/Name */}
      <div className="text-xl font-bold text-inherit hover:text-violet-400 transition-colors">
        <Link href="/">
          <Image src="/favicon.ico" alt="Home" width={32} height={32} />
        </Link>
      </div>

      {/* Links */}
      <div className="flex px-15 columns-2 text-inherit font-bold divide-x divide-white/5">
        {navLinks.map((tab, idx) => (
          <Link key={idx} href={tab.href} className="px-4 py-1.5 hover:text-violet-400 transition-colors">{tab.name}</Link>
        ))}
      </div>
    </nav>
  );
}