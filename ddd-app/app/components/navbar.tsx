import Link from 'next/link';
import Image from 'next/image';

export default function Navbar() {
  const navLinks = [
    { name: "Experience", href: "/experience" },
    { name: "Tests", href: "/test-results" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between px-8 py-2 bg-slate-800 border-b border-white/5 text-violet-300">
      {/* Logo */}
      <div className="text-xl font-bold text-inherit hover:text-violet-400 transition-colors">
        <Link href="/" data-testid="nav-home-link">
          <Image src="/favicon.ico" alt="Home" width={32} height={32} />
        </Link>
      </div>

      {/* Links */}
      <div className="flex text-inherit font-bold divide-x divide-white/5">
        {navLinks.map((tab, idx) => (
          <Link key={idx} href={tab.href} data-testid={`nav-link-${tab.name.toLowerCase()}`} className="px-4 py-1.5 hover:text-violet-400 transition-colors">{tab.name}</Link>
        ))}
      </div>
    </nav>
  );
}