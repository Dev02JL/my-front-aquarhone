'use client';

import { useState, useEffect } from 'react';
import AuthGuard from '@/components/AuthGuard';
import Navigation from '@/components/Navigation';
import { api, User } from '@/lib/api';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    roles: ['ROLE_USER']
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [usersResponse, userResponse] = await Promise.all([
        api.getUsers(),
        api.getCurrentUser()
      ]);

      if (usersResponse.error) {
        setError(usersResponse.error);
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

      setUsers(usersResponse.data || []);
      setCurrentUser(userResponse.data || undefined);
    } catch (error) {
      setError('Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedRole = e.target.value;
    setFormData({
      ...formData,
      roles: selectedRole === 'ROLE_ADMIN' ? ['ROLE_ADMIN', 'ROLE_USER'] : ['ROLE_USER']
    });
  };

  const resetForm = () => {
    setFormData({
      email: '',
      password: '',
      roles: ['ROLE_USER']
    });
    setEditingUser(null);
    setShowCreateForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      let response;
      if (editingUser) {
        response = await api.updateUser(editingUser.id, {
          email: formData.email,
          roles: formData.roles
        });
      } else {
        response = await api.createUser({
          email: formData.email,
          password: formData.password,
          roles: formData.roles
        });
      }

      if (response.error) {
        setError(response.error);
        return;
      }

      // Recharger les utilisateurs
      await fetchData();
      resetForm();
    } catch (error) {
      setError('Erreur lors de la sauvegarde');
    }
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setFormData({
      email: user.email,
      password: '',
      roles: user.roles
    });
    setShowCreateForm(true);
  };

  const handleDelete = async (userId: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      return;
    }

    setDeletingId(userId);
    setError('');

    try {
      const response = await api.deleteUser(userId);
      
      if (response.error) {
        setError(response.error);
        return;
      }

      // Recharger les utilisateurs
      await fetchData();
    } catch (error) {
      setError('Erreur lors de la suppression');
    } finally {
      setDeletingId(null);
    }
  };

  const getRoleLabel = (roles: string[]) => {
    if (roles.includes('ROLE_ADMIN')) {
      return 'Administrateur';
    }
    return 'Utilisateur';
  };

  const getRoleColor = (roles: string[]) => {
    if (roles.includes('ROLE_ADMIN')) {
      return 'bg-purple-100 text-purple-800';
    }
    return 'bg-blue-100 text-blue-800';
  };

  if (loading) {
    return (
      <AuthGuard>
        <div className="min-h-screen bg-gray-50">
          <Navigation user={currentUser} />
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
        <Navigation user={currentUser} />
        
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold text-gray-900">
                Gestion des Utilisateurs
              </h1>
              
              <button
                onClick={() => setShowCreateForm(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Ajouter un utilisateur
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
                  {editingUser ? 'Modifier l\'utilisateur' : 'Nouvel utilisateur'}
                </h2>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    {!editingUser && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Mot de passe
                        </label>
                        <input
                          type="password"
                          name="password"
                          value={formData.password}
                          onChange={handleInputChange}
                          required={!editingUser}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Rôle
                    </label>
                    <select
                      name="role"
                      value={formData.roles.includes('ROLE_ADMIN') ? 'ROLE_ADMIN' : 'ROLE_USER'}
                      onChange={handleRoleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="ROLE_USER">Utilisateur</option>
                      <option value="ROLE_ADMIN">Administrateur</option>
                    </select>
                  </div>

                  <div className="flex space-x-3">
                    <button
                      type="submit"
                      className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
                    >
                      {editingUser ? 'Modifier' : 'Créer'}
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

            {/* Liste des utilisateurs */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Rôle
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.map((user) => (
                      <tr key={user.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {user.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {user.email}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(user.roles)}`}>
                            {getRoleLabel(user.roles)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEdit(user)}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              Modifier
                            </button>
                            {user.id !== currentUser?.id && (
                              <button
                                onClick={() => handleDelete(user.id)}
                                disabled={deletingId === user.id}
                                className="text-red-600 hover:text-red-900 disabled:opacity-50"
                              >
                                {deletingId === user.id ? 'Suppression...' : 'Supprimer'}
                              </button>
                            )}
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