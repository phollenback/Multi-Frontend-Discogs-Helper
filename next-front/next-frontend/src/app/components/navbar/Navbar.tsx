'use client'

import Link from 'next/link';
import {logout} from '../../login/actions'
const Navbar = () => {
  const handleLogout = () => {
    logout();
  }
  return (
    <nav className="bg-gray-800 p-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/home" className="text-white text-2xl font-bold">
          Discogs-Helper
        </Link>

        {/* Mobile Menu Toggle */}
        <div className="lg:hidden">
          <button className="text-white focus:outline-none" aria-label="Toggle menu">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>
        </div>

        {/* Desktop Menu */}
        <div className="hidden lg:flex space-x-8">
          <Link href="/search" className="text-white hover:text-gray-400">Search</Link>
          <Link href="/collection" className="text-white hover:text-gray-400">Collection</Link>
          <Link href="/wantlist" className="text-white hover:text-gray-400">Wantlist</Link>
          <Link href="#" onClick={handleLogout} className="block text-white hover:text-gray-400">Logout</Link>
        </div>
      </div>

      {/* Mobile Menu (hidden by default, shown on small screens) */}
      <div className="lg:hidden mt-4 space-y-4">
        <Link href="/search" className="block text-white hover:text-gray-400">Search</Link>
        <Link href="/collection" className="block text-white hover:text-gray-400">Collection</Link>
        <Link href="/wantlist" className="block text-white hover:text-gray-400">Wantlist</Link>
        <Link href="#" onClick={handleLogout} className="block text-white hover:text-gray-400">Logout</Link>

      </div>
    </nav>
  );
};

export default Navbar;