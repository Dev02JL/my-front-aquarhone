'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { api, User } from '@/lib/api';

interface NavigationProps {
  user?: User;
}

export default function Navigation({ user }: NavigationProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/auth');
  };

  const isActive = (path: string) => {
    return pathname === path;
  };

  const isAdmin = user?.roles.includes('ROLE_ADMIN');

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/dashboard" className="text-xl font-semibold text-gray-900">
              Aquarhone
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/activities"
              className={`text-sm font-medium transition-colors ${
                isActive('/activities') 
                  ? 'text-blue-600' 
                  : 'text-gray-700 hover:text-blue-600'
              }`}
            >
              Activités
            </Link>
            
            <Link
              href="/reservations"
              className={`text-sm font-medium transition-colors ${
                isActive('/reservations') 
                  ? 'text-blue-600' 
                  : 'text-gray-700 hover:text-blue-600'
              }`}
            >
              Mes Réservations
            </Link>

            {isAdmin && (
              <>
                <Link
                  href="/admin/activities"
                  className={`text-sm font-medium transition-colors ${
                    isActive('/admin/activities') 
                      ? 'text-blue-600' 
                      : 'text-gray-700 hover:text-blue-600'
                  }`}
                >
                  Gestion Activités
                </Link>
                
                <Link
                  href="/admin/users"
                  className={`text-sm font-medium transition-colors ${
                    isActive('/admin/users') 
                      ? 'text-blue-600' 
                      : 'text-gray-700 hover:text-blue-600'
                  }`}
                >
                  Gestion Utilisateurs
                </Link>
              </>
            )}
          </div>

          <div className="flex items-center space-x-4">
            {user && (
              <span className="text-sm text-gray-700 hidden md:block">
                {user.email}
              </span>
            )}
            
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700 transition-colors"
            >
              Se déconnecter
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t">
              <Link
                href="/activities"
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  isActive('/activities') 
                    ? 'text-blue-600 bg-blue-50' 
                    : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Activités
              </Link>
              
              <Link
                href="/reservations"
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  isActive('/reservations') 
                    ? 'text-blue-600 bg-blue-50' 
                    : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Mes Réservations
              </Link>

              {isAdmin && (
                <>
                  <Link
                    href="/admin/activities"
                    className={`block px-3 py-2 rounded-md text-base font-medium ${
                      isActive('/admin/activities') 
                        ? 'text-blue-600 bg-blue-50' 
                        : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Gestion Activités
                  </Link>
                  
                  <Link
                    href="/admin/users"
                    className={`block px-3 py-2 rounded-md text-base font-medium ${
                      isActive('/admin/users') 
                        ? 'text-blue-600 bg-blue-50' 
                        : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Gestion Utilisateurs
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
} 