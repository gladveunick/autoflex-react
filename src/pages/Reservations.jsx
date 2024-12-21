import { useState, useEffect } from 'react'
import axios from 'axios'
import { 
  CheckCircleIcon, 
  XCircleIcon, 
  ExclamationCircleIcon,
  CalendarIcon,
  CurrencyEuroIcon,
  UserIcon
} from '@heroicons/react/24/outline'

function Reservations() {
  const [reservations, setReservations] = useState([])
  const [filter, setFilter] = useState('all') // all, en attente, validée, rejetée, annulée
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchReservations()
  }, [])

  const fetchReservations = async () => {
    try {
      setLoading(true)
      const response = await axios.get('http://localhost:8000/api/reservations')
      setReservations(response.data)
      setError('')
    } catch (error) {
      setError('Erreur lors de la récupération des réservations')
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (id, newStatus) => {
    try {
      await axios.put(`http://localhost:8000/api/reservation/${id}/${newStatus}`)
      fetchReservations()
    } catch (error) {
      setError('Erreur lors de la modification du statut')
    }
  }

  const getStatusBadgeColor = (status) => {
    const colors = {
      'en attente': 'bg-yellow-100 text-yellow-800',
      'validée': 'bg-green-100 text-green-800',
      'rejetée': 'bg-red-100 text-red-800',
      'annulée': 'bg-gray-100 text-gray-800'
    }
    return colors[status] || colors['en attente']
  }

  const filteredReservations = filter === 'all' 
    ? reservations 
    : reservations.filter(res => res.statut === filter)

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Gestion des Réservations</h1>

        {error && (
          <div className="mb-4 bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* Filtres */}
        <div className="mb-6 flex space-x-4">
          {['all', 'en attente', 'validée', 'rejetée', 'annulée'].map((filterOption) => (
            <button
              key={filterOption}
              onClick={() => setFilter(filterOption)}
              className={`px-4 py-2 rounded-lg ${
                filter === filterOption
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              {filterOption === 'all' ? 'Toutes' : filterOption.charAt(0).toUpperCase() + filterOption.slice(1)}
            </button>
          ))}
        </div>

        {/* Liste des réservations */}
        <div className="grid gap-6">
          {filteredReservations.map((reservation) => (
            <div key={reservation.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start">
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-indigo-100 rounded-lg">
                    <CalendarIcon className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">
                      Réservation #{reservation.id}
                    </h3>
                    <div className="mt-1 text-sm text-gray-600">
                      <div className="flex items-center space-x-2">
                        <UserIcon className="w-4 h-4" />
                        <span>{reservation.locataire?.name}</span>
                      </div>
                      <div className="flex items-center space-x-2 mt-1">
                        <CurrencyEuroIcon className="w-4 h-4" />
                        <span>{reservation.montant_total} €</span>
                      </div>
                    </div>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm ${getStatusBadgeColor(reservation.statut)}`}>
                  {reservation.statut}
                </span>
              </div>

              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Détails de la location</h4>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p>Du: {new Date(reservation.date_debut).toLocaleDateString()}</p>
                    <p>Au: {new Date(reservation.date_fin).toLocaleDateString()}</p>
                    <p>Durée: {reservation.nombre_jour} jours</p>
                    <p>Prix par jour: {reservation.montant_unitaire} €</p>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Véhicule</h4>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p>Marque: {reservation.voiture?.marque?.nom}</p>
                    <p>Modèle: {reservation.voiture?.modele?.nom}</p>
                    <p>Immatriculation: {reservation.voiture?.immatriculation}</p>
                  </div>
                </div>
              </div>

              {reservation.statut === 'en attente' && (
                <div className="mt-6 flex justify-end space-x-4">
                  <button
                    onClick={() => handleStatusChange(reservation.id, 'validate')}
                    className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    <CheckCircleIcon className="w-5 h-5 mr-2" />
                    Valider
                  </button>
                  <button
                    onClick={() => handleStatusChange(reservation.id, 'reject')}
                    className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    <XCircleIcon className="w-5 h-5 mr-2" />
                    Rejeter
                  </button>
                </div>
              )}

              {reservation.statut === 'validée' && (
                <div className="mt-6 flex justify-end">
                  <button
                    onClick={() => handleStatusChange(reservation.id, 'cancel')}
                    className="flex items-center px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
                  >
                    <ExclamationCircleIcon className="w-5 h-5 mr-2" />
                    Annuler
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {filteredReservations.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">Aucune réservation trouvée</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Reservations 