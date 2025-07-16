'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';

interface AuthGuardProps {
  children: React.ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      setIsAuthenticated(false);
      router.push('/auth');
      return;
    }

    // Vérifier la validité du token
    api.getCurrentUser()
      .then(response => {
        if (response.error) {
          localStorage.removeItem('token');
          setIsAuthenticated(false);
          router.push('/auth');
        } else {
          setIsAuthenticated(true);
        }
      })
      .catch(() => {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        router.push('/auth');
      });
  }, [router]);

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Vérification de l'authentification...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
} 