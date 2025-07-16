'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import AuthGuard from '@/components/AuthGuard';
import Navigation from '@/components/Navigation';
import { api, Activity, User } from '@/lib/api';

export default function ActivityReservePage() {
  const [activity, setActivity] = useState<Activity | null>(null);
  const [user, setUser] = useState<User | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedSlot, setSelectedSlot] = useState('');
  const [submitting, setSubmitting] = useState(false);
  
  const router = useRouter();
  const params = useParams();
  const activityId = parseInt(params.id as string);

  useEffect(() => {
    fetchData();
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

      const userData = (userResponse.data as any)?.user || userResponse.data;
      setActivity(activityResponse.data || null);
      setUser(userData || undefined);
    } catch (error) {
      setError('Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSubmitting(true);

    if (!selectedSlot) {
      setError('Veuillez sélectionner un créneau');
      setSubmitting(false);
      return;
    }

    try {
      const response = await api.createReservation(activityId, selectedSlot);
      
      if (response.error) {
        setError(response.error);
        return;
      }

      setSuccess('Réservation créée avec succès !');
      setTimeout(() => {
        router.push('/reservations');
      }, 2000);
    } catch (error) {
      setError('Erreur lors de la création de la réservation');
    } finally {
      setSubmitting(false);
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

  if (loading) {
    return (
      <AuthGuard>
        <div className="min-h-screen bg-gray-50">
          <Navigation user={user} />
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Chargement...</p>
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
            <div className="px-4 py-6 sm:px-0">
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                Activité non trouvée
              </div>
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
        
        <main className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Réserver : {activity.name}
                </h1>
                <p className="text-gray-600">
                  {activity.description}
                </p>
              </div>

              {error && (
                <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md border border-red-200">
                  {error}
                </div>
              )}

              {success && (
                <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-md border border-green-200">
                  {success}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Informations de l'activité */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    Informations de l'activité
                  </h2>
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm font-medium text-gray-600">Type:</span>
                      <p className="text-gray-900">{getActivityTypeLabel(activity.activityType)}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600">Lieu:</span>
                      <p className="text-gray-900">{activity.location}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600">Prix:</span>
                      <p className="text-gray-900">{activity.price} €</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600">Places disponibles:</span>
                      <p className="text-gray-900">{activity.remainingSpots}</p>
                    </div>
                  </div>
                </div>

                {/* Formulaire de réservation */}
                <div className="bg-blue-50 rounded-lg p-6">
                  <h2 className="text-xl font-semibold text-blue-900 mb-4">
                    Créneau de réservation
                  </h2>
                  
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Sélectionner un créneau
                      </label>
                      <select
                        value={selectedSlot}
                        onChange={(e) => setSelectedSlot(e.target.value)}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Choisir un créneau</option>
                        {activity.availableSlots.map((slot, index) => (
                          <option key={index} value={slot}>
                            {new Date(slot).toLocaleString('fr-FR', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </option>
                        ))}
                      </select>
                    </div>

                    <button
                      type="submit"
                      disabled={submitting || !selectedSlot}
                      className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                    >
                      {submitting ? 'Création en cours...' : 'Confirmer la réservation'}
                    </button>
                  </form>
                </div>
              </div>

              <div className="mt-6 flex justify-between">
                <button
                  onClick={() => router.back()}
                  className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
                >
                  Retour
                </button>
                
                <button
                  onClick={() => router.push('/reservations')}
                  className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
                >
                  Mes réservations
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </AuthGuard>
  );
} 