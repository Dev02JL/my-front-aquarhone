'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AuthGuard from '@/components/AuthGuard';
import Navigation from '@/components/Navigation';
import { api, User } from '@/lib/api';

export default function DashboardPage() {
  const [user, setUser] = useState<User | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await api.getCurrentUser();
      
      console.log('API Response:', response); // Debug log
      
      if (response.error) {
        console.log('API Error:', response.error); // Debug log
        router.push('/auth');
        return;
      }

      console.log('User data:', response.data); // Debug log
      // L'API retourne { user: { ... } } au lieu de { data: { ... } }
      const userData = (response.data as any)?.user || response.data;
      setUser(userData || undefined);
    } catch (error) {
      console.error('Erreur lors de la récupération des données utilisateur:', error);
      router.push('/auth');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50">
        <Navigation user={user} />

        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Bienvenue sur votre tableau de bord
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-blue-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-blue-900 mb-4">
                    Informations du compte
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm font-medium text-gray-600">Email:</span>
                      <p className="text-gray-900">{user.email}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600">ID:</span>
                      <p className="text-gray-900">{user.id}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600">Rôles:</span>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {user.roles && user.roles.length > 0 ? (
                          user.roles.map((role, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                            >
                              {role === 'ROLE_ADMIN' ? 'Administrateur' : 'Utilisateur'}
                            </span>
                          ))
                        ) : (
                          <span className="text-gray-500 text-sm">Aucun rôle défini</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-green-900 mb-4">
                    Actions rapides
                  </h3>
                  <div className="space-y-3">
                    <a
                      href="/activities"
                      className="block w-full bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-700 transition-colors text-center"
                    >
                      Voir les activités
                    </a>
                    <a
                      href="/reservations"
                      className="block w-full bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-700 transition-colors text-center"
                    >
                      Mes réservations
                    </a>
                    {user.roles && user.roles.includes('ROLE_ADMIN') && (
                      <>
                        <a
                          href="/admin/activities"
                          className="block w-full bg-purple-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-purple-700 transition-colors text-center"
                        >
                          Gestion des activités
                        </a>
                        <a
                          href="/admin/users"
                          className="block w-full bg-purple-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-purple-700 transition-colors text-center"
                        >
                          Gestion des utilisateurs
                        </a>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </AuthGuard>
  );
} 