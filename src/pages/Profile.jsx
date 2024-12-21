import { useState, useEffect } from 'react'
import axios from 'axios'
import { UserCircleIcon, PhotoIcon } from '@heroicons/react/24/outline'
import { useAuth } from '../contexts/AuthContext'

function Profile() {
  const { user: authUser } = useAuth()
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    company_name: '',
    location: '',
    description: '',
    logo: null,
    status: ''
  })
  const [isEditing, setIsEditing] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(true)
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    password: '',
    password_confirmation: ''
  })

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/profile')
      setProfile(response.data)
      setLoading(false)
    } catch (error) {
      setError('Erreur lors du chargement du profil')
      setLoading(false)
    }
  }

  const handleProfileUpdate = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      const formData = new FormData()
      Object.keys(profile).forEach(key => {
        if (key === 'logo' && profile.logo instanceof File) {
          formData.append('logo', profile.logo)
        } else if (key !== 'logo') {
          formData.append(key, profile[key])
        }
      })

      const response = await axios.put('http://localhost:8000/api/profile/update', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      setSuccess('Profil mis à jour avec succès')
      setIsEditing(false)
      fetchProfile()
    } catch (error) {
      console.error('Erreur lors de la mise à jour du profil:', error)
      setError(
        error.response?.data?.message || 
        'Une erreur est survenue lors de la mise à jour du profil'
      )
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordChange = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    try {
      await axios.put('http://localhost:8000/api/profile/password', passwordData)
      setSuccess('Mot de passe mis à jour avec succès')
      setPasswordData({
        current_password: '',
        password: '',
        password_confirmation: ''
      })
    } catch (error) {
      setError(error.response?.data?.message || 'Erreur lors du changement de mot de passe')
    }
  }

  const handleLogoChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setProfile({ ...profile, logo: file })
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Mon Profil Propriétaire</h1>

        {error && (
          <div className="mb-4 bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 bg-green-50 border border-green-400 text-green-700 px-4 py-3 rounded">
            {success}
          </div>
        )}

        {/* Informations du profil */}
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <div className="flex items-center mb-6">
            <div className="relative">
              {profile.logo ? (
                <img
                  src={profile.logo instanceof File ? URL.createObjectURL(profile.logo) : `http://localhost:8000/storage/${profile.logo}`}
                  alt="Logo"
                  className="w-20 h-20 rounded-full object-cover"
                />
              ) : (
                <UserCircleIcon className="w-20 h-20 text-gray-400" />
              )}
              {isEditing && (
                <label className="absolute bottom-0 right-0 bg-indigo-600 rounded-full p-2 cursor-pointer">
                  <PhotoIcon className="w-4 h-4 text-white" />
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleLogoChange}
                  />
                </label>
              )}
            </div>
            <div className="ml-4">
              <h2 className="text-xl font-semibold">{profile.name}</h2>
              <p className="text-gray-600">{profile.email}</p>
              <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                profile.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {profile.status}
              </span>
            </div>
          </div>

          <form onSubmit={handleProfileUpdate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Nom complet</label>
              <input
                type="text"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                value={profile.name}
                disabled={!isEditing}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Nom de l'entreprise</label>
              <input
                type="text"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                value={profile.company_name || ''}
                disabled={!isEditing}
                onChange={(e) => setProfile({ ...profile, company_name: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Localisation</label>
              <input
                type="text"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                value={profile.location || ''}
                disabled={!isEditing}
                onChange={(e) => setProfile({ ...profile, location: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                rows="4"
                value={profile.description || ''}
                disabled={!isEditing}
                onChange={(e) => setProfile({ ...profile, description: e.target.value })}
              />
            </div>

            <div className="flex justify-end space-x-3">
              {isEditing ? (
                <>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700"
                  >
                    Sauvegarder
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700"
                >
                  Modifier
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Changement de mot de passe */}
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Changer le mot de passe</h3>
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Mot de passe actuel
              </label>
              <input
                type="password"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                value={passwordData.current_password}
                onChange={(e) => setPasswordData({ ...passwordData, current_password: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Nouveau mot de passe
              </label>
              <input
                type="password"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                value={passwordData.password}
                onChange={(e) => setPasswordData({ ...passwordData, password: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Confirmer le nouveau mot de passe
              </label>
              <input
                type="password"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                value={passwordData.password_confirmation}
                onChange={(e) => setPasswordData({ ...passwordData, password_confirmation: e.target.value })}
              />
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700"
              >
                Changer le mot de passe
              </button>
            </div>
          </form>
        </div>

        {/* Zone de désactivation */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-red-600 mb-4">Zone dangereuse</h3>
          <p className="text-gray-600 mb-4">
            La désactivation de votre compte masquera temporairement votre profil et vos annonces.
            Vous pourrez le réactiver à tout moment en vous connectant.
          </p>
          <button
            onClick={() => {
              if (window.confirm('Êtes-vous sûr de vouloir désactiver votre compte ?')) {
                axios.post('http://localhost:8000/api/deactivate')
                  .then(() => {
                    // Rediriger vers la page de connexion ou afficher un message
                  })
                  .catch((error) => {
                    setError('Erreur lors de la désactivation du compte')
                  })
              }
            }}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700"
          >
            Désactiver mon compte
          </button>
        </div>
      </div>
    </div>
  )
}

export default Profile 