"use client";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import { usePathname } from "next/navigation";

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
          className="py-2 px-4 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-200"
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
  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/">
              <span className="text-2xl font-bold text-green-600">Nodrac's</span>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/">
              <span className={pathname === "/" ? ACTIVE_ROUTE : INACTIVE_ROUTE}>
                Home
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
    </nav>
  );
}