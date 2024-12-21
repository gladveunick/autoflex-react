import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { UserPlusIcon, PhotoIcon } from '@heroicons/react/24/solid'
import axios from 'axios'

function Register() {
  const navigate = useNavigate()
  const { register } = useAuth()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'proprietaire',
    company_name: '',
    location: '',
    logo: null,
    description: ''
  })
  const [passwordConfirmation, setPasswordConfirmation] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    // Validation côté client
    if (!formData.name || !formData.email || !formData.password) {
        setError('Veuillez remplir tous les champs obligatoires')
        return
    }

    if (formData.password.length < 6) {
        setError('Le mot de passe doit contenir au moins 6 caractères')
        return
    }

    // Validation des champs obligatoires pour propriétaire
    if (!formData.company_name || !formData.location || !formData.description) {
        setError('Tous les champs sont obligatoires')
        return
    }

    // Validation du logo si présent
    if (formData.logo && !['image/jpeg', 'image/png', 'image/jpg'].includes(formData.logo.type)) {
        setError('Le logo doit être au format JPEG, PNG ou JPG')
        return
    }

    setLoading(true)

    try {
        const formDataToSend = new FormData()
        Object.keys(formData).forEach(key => {
            if (key === 'logo' && formData[key]) {
                formDataToSend.append('logo', formData[key])
            } else {
                formDataToSend.append(key, formData[key])
            }
        })

        const response = await axios.post('http://localhost:8000/api/register', formDataToSend, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Accept': 'application/json'
            }
        })

        // Si la requête réussit, on redirige
        navigate('/login')

    } catch (error) {
        if (error.response?.status === 422) {
            // On vérifie d'abord s'il y a des erreurs spécifiques pour l'email
            if (error.response.data.errors?.email) {
                setError(error.response.data.errors.email[0])
            } else {
                // Sinon on utilise le message général
                setError(error.response.data.message || "Erreur de validation")
            }
        } else {
            setError("Une erreur est survenue lors de l'inscription.")
        }
    } finally {
        setLoading(false)
    }
  }

  const handleLogoChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setFormData({ ...formData, logo: file })
    }
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-indigo-100 to-purple-100">
      <div className="w-full min-h-screen flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-16 p-4">
        {/* Section de gauche - Introduction */}
        <div className="w-full lg:w-2/5 max-w-lg space-y-8 text-center lg:text-left">
          <div className="space-y-4">
            <h1 className="text-4xl lg:text-5xl font-extrabold">
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Gérez votre flotte
              </span>
              <br />
              en toute simplicité
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              Simplifiez la gestion de vos véhicules et offrez une expérience exceptionnelle à vos clients.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-indigo-100 flex items-center justify-center">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Gestion simplifiée</h3>
                <p className="text-gray-600">Centralisez tous vos véhicules en un seul endroit</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Gain de temps</h3>
                <p className="text-gray-600">Automatisez vos tâches administratives</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-indigo-100 flex items-center justify-center">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Communication fluide</h3>
                <p className="text-gray-600">Échangez facilement avec vos locataires</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Suivi en temps réel</h3>
                <p className="text-gray-600">Visualisez vos performances en un coup d'œil</p>
              </div>
            </div>
          </div>
        </div>

        {/* Section de droite - Formulaire */}
        <div className="w-full lg:w-2/5 max-w-lg">
          <div className="w-full space-y-4 bg-white/70 backdrop-blur-xl p-6 rounded-2xl shadow-xl">
            <div>
              <h2 className="text-center text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Créer un compte
              </h2>
              <p className="mt-2 text-center text-sm text-gray-600">
                Ou{' '}
                <Link to="/login" className="font-medium text-indigo-600 hover:text-purple-600 transition-colors duration-200">
                  connectez-vous à votre compte existant
                </Link>
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border-l-4 border-red-400 text-red-700 p-3 rounded-r-lg text-sm">
                {error}
              </div>
            )}

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Nom complet
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 ease-in-out"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 ease-in-out"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>

                <div>
                  <label htmlFor="company_name" className="block text-sm font-medium text-gray-700 mb-1">
                    Nom de l'entreprise
                  </label>
                  <input
                    id="company_name"
                    name="company_name"
                    type="text"
                    required
                    className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 ease-in-out"
                    value={formData.company_name}
                    onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                  />
                </div>

                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                    Localisation
                  </label>
                  <input
                    id="location"
                    name="location"
                    type="text"
                    required
                    className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 ease-in-out"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  />
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows="2"
                    className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 ease-in-out"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Logo</label>
                  <div className="flex items-center space-x-4">
                    <span className="inline-block h-12 w-12 rounded-full overflow-hidden bg-gray-100 ring-2 ring-gray-200">
                      {formData.logo ? (
                        <img
                          src={URL.createObjectURL(formData.logo)}
                          alt="Preview"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <PhotoIcon className="h-full w-full text-gray-300 p-2" />
                      )}
                    </span>
                    <label
                      htmlFor="logo-upload"
                      className="px-3 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer transition-all duration-200"
                    >
                      <span>Changer le logo</span>
                      <input
                        id="logo-upload"
                        name="logo"
                        type="file"
                        className="sr-only"
                        accept="image/*"
                        onChange={handleLogoChange}
                      />
                    </label>
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    Mot de passe
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 ease-in-out"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                </div>

                <div>
                  <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700 mb-1">
                    Confirmer le mot de passe
                  </label>
                  <input
                    id="password_confirmation"
                    name="password_confirmation"
                    type="password"
                    required
                    className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 ease-in-out"
                    value={passwordConfirmation}
                    onChange={(e) => setPasswordConfirmation(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 ease-in-out transform hover:scale-[1.02]"
                >
                  <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                    <UserPlusIcon className="h-5 w-5 text-indigo-300 group-hover:text-indigo-200" />
                  </span>
                  {loading ? 'Inscription...' : 'S\'inscrire'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register 