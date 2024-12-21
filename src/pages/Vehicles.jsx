import { useState, useEffect } from 'react'
import api from '../services/api'
import { PlusIcon } from '@heroicons/react/24/outline'

function Vehicles() {
  const [vehicles, setVehicles] = useState([])
  const [categories, setCategories] = useState([])
  const [marques, setMarques] = useState([])
  const [showAddModal, setShowAddModal] = useState(false)
  const [newVehicle, setNewVehicle] = useState({
    immatriculation: '',
    image: null,
    annee: new Date().getFullYear(),
    nbre_siege: '',
    type_carburant: '',
    couleur: '',
    categorie_id: '',
    marque_id: '',
    active: false
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [vehiclesRes, categoriesRes, marquesRes] = await Promise.all([
        api.get('/voitures'),
        api.get('/categories'),
        api.get('/marques')
      ])

      setVehicles(vehiclesRes.data)
      setCategories(categoriesRes.data)
      setMarques(marquesRes.data)
    } catch (error) {
      console.error('Erreur lors de la récupération des données:', error)
    }
  }

  const handleAddVehicle = async (e) => {
    e.preventDefault()
    try {
      const formData = new FormData()
      Object.keys(newVehicle).forEach(key => {
        if (key === 'image') {
          if (newVehicle.image) {
            formData.append('image', newVehicle.image)
          }
        } else {
          formData.append(key, newVehicle[key])
        }
      })

      await api.post('/voitures', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      setShowAddModal(false)
      fetchData()
    } catch (error) {
      console.error('Erreur lors de l\'ajout du véhicule:', error)
    }
  }

  const handleImageChange = (e) => {
    setNewVehicle({ ...newVehicle, image: e.target.files[0] })
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Mes Véhicules</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-indigo-700"
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          Ajouter un véhicule
        </button>
      </div>

      {/* Liste des véhicules */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {vehicles.map((vehicle) => (
          <div key={vehicle.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <img
              src={`http://localhost:8000/storage/${vehicle.image}`}
              alt={vehicle.immatriculation}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold">
                    {vehicle.marque?.nom} {vehicle.modele?.nom}
                  </h3>
                  <p className="text-gray-600">Immat: {vehicle.immatriculation}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  vehicle.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {vehicle.active ? 'Actif' : 'Inactif'}
                </span>
              </div>
              
              <div className="mt-2 space-y-1">
                <p className="text-sm text-gray-600">Année: {vehicle.annee}</p>
                <p className="text-sm text-gray-600">Places: {vehicle.nbre_siege}</p>
                <p className="text-sm text-gray-600">Carburant: {vehicle.type_carburant}</p>
                <p className="text-sm text-gray-600">Couleur: {vehicle.couleur}</p>
              </div>

              <div className="mt-4 flex justify-between">
                <button
                  onClick={() => handleEditVehicle(vehicle.id)}
                  className="text-indigo-600 hover:text-indigo-800"
                >
                  Modifier
                </button>
                <button
                  onClick={() => handleToggleStatus(vehicle.id)}
                  className={`${
                    vehicle.active
                      ? 'text-red-600 hover:text-red-800'
                      : 'text-green-600 hover:text-green-800'
                  }`}
                >
                  {vehicle.active ? 'Désactiver' : 'Activer'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal d'ajout de véhicule */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Ajouter un véhicule</h2>
            <form onSubmit={handleAddVehicle} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Immatriculation
                </label>
                <input
                  type="text"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  value={newVehicle.immatriculation}
                  onChange={(e) => setNewVehicle({ ...newVehicle, immatriculation: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Image du véhicule
                </label>
                <input
                  type="file"
                  required
                  accept="image/*"
                  onChange={handleImageChange}
                  className="mt-1 block w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Marque
                </label>
                <select
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  value={newVehicle.marque_id}
                  onChange={(e) => setNewVehicle({ ...newVehicle, marque_id: e.target.value })}
                >
                  <option value="">Sélectionner une marque</option>
                  {marques.map(marque => (
                    <option key={marque.id} value={marque.id}>{marque.nom}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Catégorie
                </label>
                <select
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  value={newVehicle.categorie_id}
                  onChange={(e) => setNewVehicle({ ...newVehicle, categorie_id: e.target.value })}
                >
                  <option value="">Sélectionner une catégorie</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>{category.nom}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Année
                  </label>
                  <input
                    type="number"
                    required
                    min="1900"
                    max={new Date().getFullYear()}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    value={newVehicle.annee}
                    onChange={(e) => setNewVehicle({ ...newVehicle, annee: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Nombre de sièges
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    value={newVehicle.nbre_siege}
                    onChange={(e) => setNewVehicle({ ...newVehicle, nbre_siege: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Type de carburant
                </label>
                <select
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  value={newVehicle.type_carburant}
                  onChange={(e) => setNewVehicle({ ...newVehicle, type_carburant: e.target.value })}
                >
                  <option value="">Sélectionner le type de carburant</option>
                  <option value="Essence">Essence</option>
                  <option value="Diesel">Diesel</option>
                  <option value="Électrique">Électrique</option>
                  <option value="Hybride">Hybride</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Couleur
                </label>
                <input
                  type="text"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  value={newVehicle.couleur}
                  onChange={(e) => setNewVehicle({ ...newVehicle, couleur: e.target.value })}
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  Ajouter
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Vehicles 