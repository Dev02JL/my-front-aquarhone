'use client';

import { useState, useEffect } from 'react';
import AuthGuard from '@/components/AuthGuard';
import Navigation from '@/components/Navigation';
import { api, Activity, User } from '@/lib/api';

export default function AdminActivitiesPage() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [user, setUser] = useState<User | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    activityType: 'kayak',
    location: '',
    price: '',
    remainingSpots: '',
    availableSlots: [] as string[]
  });

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

      // Vérifier si l'utilisateur est admin
      if (!userResponse.data?.roles.includes('ROLE_ADMIN')) {
        setError('Accès non autorisé');
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      activityType: 'kayak',
      location: '',
      price: '',
      remainingSpots: '',
      availableSlots: []
    });
    setEditingActivity(null);
    setShowCreateForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const activityData = {
        ...formData,
        price: formData.price,
        remainingSpots: parseInt(formData.remainingSpots),
        activityType: formData.activityType as 'kayak' | 'paddle' | 'canoe' | 'croisiere'
      };

      let response;
      if (editingActivity) {
        response = await api.updateActivity(editingActivity.id, activityData);
      } else {
        response = await api.createActivity(activityData);
      }

      if (response.error) {
        setError(response.error);
        return;
      }

      // Recharger les activités
      await fetchData();
      resetForm();
    } catch (error) {
      setError('Erreur lors de la sauvegarde');
    }
  };

  const handleEdit = (activity: Activity) => {
    setEditingActivity(activity);
    setFormData({
      name: activity.name,
      description: activity.description,
      activityType: activity.activityType,
      location: activity.location,
      price: activity.price,
      remainingSpots: activity.remainingSpots.toString(),
      availableSlots: activity.availableSlots
    });
    setShowCreateForm(true);
  };

  const handleDelete = async (activityId: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette activité ?')) {
      return;
    }

    setDeletingId(activityId);
    setError('');

    try {
      const response = await api.deleteActivity(activityId);
      
      if (response.error) {
        setError(response.error);
        return;
      }

      // Recharger les activités
      await fetchData();
    } catch (error) {
      setError('Erreur lors de la suppression');
    } finally {
      setDeletingId(null);
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

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50">
        <Navigation user={user} />
        
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold text-gray-900">
                Gestion des Activités
              </h1>
              
              <button
                onClick={() => setShowCreateForm(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Ajouter une activité
              </button>
            </div>

            {error && (
              <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md border border-red-200">
                {error}
              </div>
            )}

            {/* Formulaire de création/édition */}
            {showCreateForm && (
              <div className="mb-6 bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  {editingActivity ? 'Modifier l\'activité' : 'Nouvelle activité'}
                </h2>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nom
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Type d'activité
                      </label>
                      <select
                        name="activityType"
                        value={formData.activityType}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="kayak">Kayak</option>
                        <option value="paddle">Paddle</option>
                        <option value="canoe">Canoë</option>
                        <option value="croisiere">Croisière</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      required
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Lieu
                      </label>
                      <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Prix (€)
                      </label>
                      <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        required
                        min="0"
                        step="0.01"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Places disponibles
                      </label>
                      <input
                        type="number"
                        name="remainingSpots"
                        value={formData.remainingSpots}
                        onChange={handleInputChange}
                        required
                        min="0"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="flex space-x-3">
                    <button
                      type="submit"
                      className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
                    >
                      {editingActivity ? 'Modifier' : 'Créer'}
                    </button>
                    <button
                      type="button"
                      onClick={resetForm}
                      className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
                    >
                      Annuler
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Liste des activités */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Activité
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Lieu
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Prix
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Places
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {activities.map((activity) => (
                      <tr key={activity.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {activity.name}
                            </div>
                            <div className="text-sm text-gray-500 truncate max-w-xs">
                              {activity.description}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {getActivityTypeLabel(activity.activityType)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {activity.location}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {activity.price}€
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {activity.remainingSpots}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEdit(activity)}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              Modifier
                            </button>
                            <button
                              onClick={() => handleDelete(activity.id)}
                              disabled={deletingId === activity.id}
                              className="text-red-600 hover:text-red-900 disabled:opacity-50"
                            >
                              {deletingId === activity.id ? 'Suppression...' : 'Supprimer'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>
    </AuthGuard>
  );
} 