"use client";

import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { urbanist } from '@/lib/fonts';

const ACTIVE_ROUTE = "py-2 px-4 text-green-500 bg-green-100 rounded-md font-semibold";
const INACTIVE_ROUTE = "py-2 px-4 text-gray-600 hover:text-green-500 hover:bg-green-50 rounded-md transition duration-200";

function AuthButton() {
  const { data: session } = useSession();

  if (session) {
    return (
      <div className="flex items-center space-x-4">
        <span className="text-gray-700">{session?.user?.name}</span>
        <button 
          onClick={() => signOut()} 
          className="py-2 px-4 bg-rose-500 text-white rounded-md hover:bg-rose-600 transition duration-200"
        >
          Sign out
        </button>
      </div>
    );
  }
  return (
    <button 
      onClick={() => signIn()} 
      className="py-2 px-4 bg-green-500 text-white rounded-md hover:bg-green-600 transition duration-200"
    >
      Sign in
    </button>
  );
}

export default function NavMenu() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen((prev) => !prev);

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/">
              <span className={`${urbanist.className} text-2xl text-green-600`}>Nodrac's</span>
            </Link>
          </div>
          <div className="flex items-center sm:hidden">
            <button onClick={toggleMenu} className="text-gray-600 focus:outline-none">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            </button>
          </div>
          <div className={`hidden sm:flex sm:items-center sm:space-x-4 ml-auto`}>
            <Link href="/">
              <span className={pathname === "/" ? ACTIVE_ROUTE : INACTIVE_ROUTE}>
                Home
              </span>
            </Link>
            <Link href="/recipe-index">
              <span className={pathname === "/recipe-index" ? ACTIVE_ROUTE : INACTIVE_ROUTE}>
                All recipes
              </span>
            </Link>
            <Link href="/create">
              <span className={pathname === "/create" ? ACTIVE_ROUTE : INACTIVE_ROUTE}>
                Add a recipe
              </span>
            </Link>
            <AuthButton />
          </div>
        </div>
      </div>
      {/* Menu for small screens */}
      {isOpen && (
        <div className="sm:hidden bg-white shadow-md">
          <div className="flex flex-col space-y-2 px-4 py-2">
            <Link href="/" className={pathname === "/" ? ACTIVE_ROUTE : INACTIVE_ROUTE}>
              Home
            </Link>
            <Link href="/recipe-index">
              <span className={pathname === "/recipe-index" ? ACTIVE_ROUTE : INACTIVE_ROUTE}>
                All recipes
              </span>
            </Link>
            <Link href="/create" className={pathname === "/create" ? ACTIVE_ROUTE : INACTIVE_ROUTE}>
              Add a recipe
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}