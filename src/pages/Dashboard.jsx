import { useState, useEffect } from 'react'
import axios from 'axios'
import {
  ChartBarIcon,
  CurrencyEuroIcon,
  UserGroupIcon,
  StarIcon,
} from '@heroicons/react/24/outline'

function Dashboard() {
  const [stats, setStats] = useState({
    totalVehicles: 0,
    activeReservations: 0,
    monthlyRevenue: 0,
    averageRating: 0,
  })
  const [recentReservations, setRecentReservations] = useState([])

  useEffect(() => {
    // Ici vous ferez les appels API pour récupérer les données
    // Pour l'instant, on utilise des données statiques
  }, [])

  const StatCard = ({ title, value, icon: Icon, color }) => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center">
        <div className={`p-3 rounded-full ${color} bg-opacity-10`}>
          <Icon className={`w-6 h-6 ${color}`} />
        </div>
        <div className="ml-4">
          <h3 className="text-gray-500 text-sm">{title}</h3>
          <p className="text-2xl font-semibold">{value}</p>
        </div>
      </div>
    </div>
  )

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Tableau de bord</h1>
        <p className="text-gray-600">Bienvenue sur votre espace propriétaire</p>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Véhicules Total"
          value={stats.totalVehicles}
          icon={ChartBarIcon}
          color="text-blue-600"
        />
        <StatCard
          title="Réservations Actives"
          value={stats.activeReservations}
          icon={UserGroupIcon}
          color="text-green-600"
        />
        <StatCard
          title="Revenu Mensuel"
          value={`${stats.monthlyRevenue}€`}
          icon={CurrencyEuroIcon}
          color="text-yellow-600"
        />
        <StatCard
          title="Note Moyenne"
          value={`${stats.averageRating}/5`}
          icon={StarIcon}
          color="text-purple-600"
        />
      </div>

      {/* Réservations Récentes */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold mb-4">Réservations Récentes</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Client
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Véhicule
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentReservations.map((reservation) => (
                <tr key={reservation.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {reservation.clientName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {reservation.vehicleName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {reservation.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        reservation.status === 'confirmed'
                          ? 'bg-green-100 text-green-800'
                          : reservation.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {reservation.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Dashboard 