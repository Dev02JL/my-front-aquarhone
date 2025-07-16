'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import AuthGuard from '@/components/AuthGuard';
import Navigation from '@/components/Navigation';
import { api, Activity, User } from '@/lib/api';

export default function ActivityDetailPage() {
  const params = useParams();
  const router = useRouter();
  const activityId = parseInt(params.id as string);

  const [activity, setActivity] = useState<Activity | null>(null);
  const [user, setUser] = useState<User | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedSlot, setSelectedSlot] = useState<string>('');
  const [reserving, setReserving] = useState(false);

  useEffect(() => {
    if (activityId) {
      fetchData();
    }
  }, [activityId]);

  const fetchData = async () => {
    try {
      const [activityResponse, userResponse] = await Promise.all([
        api.getActivity(activityId),
        api.getCurrentUser()
      ]);

      if (activityResponse.error) {
        setError(activityResponse.error);
        return;
      }

      if (userResponse.error) {
        setError(userResponse.error);
        return;
      }

      setActivity(activityResponse.data || null);
      setUser(userResponse.data || undefined);
    } catch (error) {
      setError('Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  const handleReservation = async () => {
    if (!selectedSlot) {
      setError('Veuillez sélectionner un créneau');
      return;
    }

    setReserving(true);
    setError('');

    try {
      const response = await api.createReservation(activityId, selectedSlot);
      
      if (response.error) {
        setError(response.error);
        return;
      }

      router.push('/reservations');
    } catch (error) {
      setError('Erreur lors de la réservation');
    } finally {
      setReserving(false);
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

  const formatDateTime = (dateTimeString: string) => {
    const date = new Date(dateTimeString);
    return date.toLocaleString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <AuthGuard>
        <div className="min-h-screen bg-gray-50">
          <Navigation user={user} />
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Chargement de l'activité...</p>
            </div>
          </div>
        </div>
      </AuthGuard>
    );
  }

  if (!activity) {
    return (
      <AuthGuard>
        <div className="min-h-screen bg-gray-50">
          <Navigation user={user} />
          <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                Activité non trouvée
              </h1>
              <Link
                href="/activities"
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Retour aux activités
              </Link>
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
            <div className="mb-6">
              <Link
                href="/activities"
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                ← Retour aux activités
              </Link>
            </div>

            {error && (
              <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md border border-red-200">
                {error}
              </div>
            )}

            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <h1 className="text-3xl font-bold text-gray-900">
                    {activity.name}
                  </h1>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getActivityTypeColor(activity.activityType)}`}>
                    {getActivityTypeLabel(activity.activityType)}
                  </span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">
                      Description
                    </h2>
                    <p className="text-gray-600 mb-6 leading-relaxed">
                      {activity.description}
                    </p>

                    <div className="space-y-4">
                      <div className="flex items-center">
                        <svg className="w-5 h-5 text-gray-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="text-gray-700">{activity.location}</span>
                      </div>

                      <div className="flex items-center">
                        <svg className="w-5 h-5 text-gray-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                        </svg>
                        <span className="text-gray-700 font-semibold">{activity.price}€</span>
                      </div>

                      <div className="flex items-center">
                        <svg className="w-5 h-5 text-gray-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <span className="text-gray-700">
                          {activity.remainingSpots} place{activity.remainingSpots > 1 ? 's' : ''} restante{activity.remainingSpots > 1 ? 's' : ''}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">
                      Créneaux disponibles
                    </h2>
                    
                    {activity.remainingSpots > 0 ? (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 gap-3 max-h-64 overflow-y-auto">
                          {activity.availableSlots.map((slot, index) => (
                            <button
                              key={index}
                              onClick={() => setSelectedSlot(slot)}
                              className={`p-3 text-left rounded-md border transition-colors ${
                                selectedSlot === slot
                                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                                  : 'border-gray-300 hover:border-blue-300 hover:bg-gray-50'
                              }`}
                            >
                              <div className="font-medium">
                                {formatDateTime(slot)}
                              </div>
                            </button>
                          ))}
                        </div>

                        {selectedSlot && (
                          <div className="mt-6">
                            <button
                              onClick={handleReservation}
                              disabled={reserving}
                              className="w-full bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                            >
                              {reserving ? (
                                <span className="flex items-center justify-center">
                                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                  </svg>
                                  Réservation en cours...
                                </span>
                              ) : (
                                `Réserver pour ${activity.price}€`
                              )}
                            </button>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <div className="text-gray-500 text-lg mb-4">
                          Aucune place disponible
                        </div>
                        <Link
                          href="/activities"
                          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                        >
                          Voir d'autres activités
                        </Link>
                      </div>
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