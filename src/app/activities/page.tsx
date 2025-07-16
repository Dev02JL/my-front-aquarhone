'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import AuthGuard from '@/components/AuthGuard';
import Navigation from '@/components/Navigation';
import { api, Activity, User } from '@/lib/api';

export default function ActivitiesPage() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [user, setUser] = useState<User | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterType, setFilterType] = useState<string>('all');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [activitiesResponse, userResponse] = await Promise.all([
        api.getActivities(),
        api.getCurrentUser()
      ]);

      if (activitiesResponse.error) {
        setError(activitiesResponse.error);
        return;
      }

      if (userResponse.error) {
        setError(userResponse.error);
        return;
      }

      setActivities(activitiesResponse.data || []);
      setUser(userResponse.data || undefined);
    } catch (error) {
      setError('Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  const getActivityTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      kayak: 'Kayak',
      paddle: 'Paddle',
      canoe: 'Canoë',
      croisiere: 'Croisière'
    };
    return labels[type] || type;
  };

  const getActivityTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      kayak: 'bg-blue-100 text-blue-800',
      paddle: 'bg-green-100 text-green-800',
      canoe: 'bg-yellow-100 text-yellow-800',
      croisiere: 'bg-purple-100 text-purple-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  const filteredActivities = activities.filter(activity => {
    if (filterType === 'all') return true;
    return activity.activityType === filterType;
  });

  if (loading) {
    return (
      <AuthGuard>
        <div className="min-h-screen bg-gray-50">
          <Navigation user={user} />
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Chargement des activités...</p>
            </div>
          </div>
        </div>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50">
        <Navigation user={user} />
        
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold text-gray-900">
                Activités Aquatiques
              </h1>
              
              <div className="flex items-center space-x-4">
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">Tous les types</option>
                  <option value="kayak">Kayak</option>
                  <option value="paddle">Paddle</option>
                  <option value="canoe">Canoë</option>
                  <option value="croisiere">Croisière</option>
                </select>
              </div>
            </div>

            {error && (
              <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md border border-red-200">
                {error}
              </div>
            )}

            {filteredActivities.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">
                  Aucune activité disponible pour le moment.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredActivities.map((activity) => (
                  <div
                    key={activity.id}
                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-semibold text-gray-900">
                          {activity.name}
                        </h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getActivityTypeColor(activity.activityType)}`}>
                          {getActivityTypeLabel(activity.activityType)}
                        </span>
                      </div>

                      <p className="text-gray-600 mb-4 line-clamp-3">
                        {activity.description}
                      </p>

                      <div className="space-y-2 mb-4">
                        <div className="flex items-center text-sm text-gray-500">
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          {activity.location}
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center text-sm text-gray-500">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                            </svg>
                            {activity.price}€
                          </div>

                          <div className="flex items-center text-sm text-gray-500">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            {activity.remainingSpots} places restantes
                          </div>
                        </div>
                      </div>

                      <div className="flex space-x-3">
                        <Link
                          href={`/activities/${activity.id}`}
                          className="flex-1 bg-blue-600 text-white text-center py-2 px-4 rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
                        >
                          Voir détails
                        </Link>
                        
                        {activity.remainingSpots > 0 ? (
                          <Link
                            href={`/activities/${activity.id}/reserve`}
                            className="flex-1 bg-green-600 text-white text-center py-2 px-4 rounded-md hover:bg-green-700 transition-colors text-sm font-medium"
                          >
                            Réserver
                          </Link>
                        ) : (
                          <span className="flex-1 bg-gray-300 text-gray-500 text-center py-2 px-4 rounded-md text-sm font-medium cursor-not-allowed">
                            Complet
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </AuthGuard>
  );
} 