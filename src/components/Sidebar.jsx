import { Link, useLocation } from 'react-router-dom'
import { HomeIcon } from '@heroicons/react/24/outline'
import { TruckIcon } from '@heroicons/react/24/outline'
import { 
  CalendarIcon, 
  StarIcon, 
  UserIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline'

function Sidebar() {
  const location = useLocation()
  
  const menuItems = [
    { title: 'Dashboard', path: '/', icon: HomeIcon },
    { title: 'Véhicules', path: '/vehicles', icon: TruckIcon },
    { title: 'Réservations', path: '/reservations', icon: CalendarIcon },
    { title: 'Avis Clients', path: '/reviews', icon: StarIcon },
    { title: 'Profil', path: '/profile', icon: UserIcon },
  ]

  return (
    <div className="w-64 bg-white shadow-lg h-full">
      <div className="p-4">
        <h1 className="text-2xl font-bold text-indigo-600">AutoRent</h1>
      </div>
      <nav className="mt-8">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center px-6 py-3 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 ${
              location.pathname === item.path ? 'bg-indigo-50 text-indigo-600' : ''
            }`}
          >
            <item.icon className="w-5 h-5 mr-3" />
            <span>{item.title}</span>
          </Link>
        ))}
        <button 
          className="flex items-center px-6 py-3 text-gray-700 hover:bg-red-50 hover:text-red-600 w-full"
          onClick={() => {/* Implement logout */}}
        >
          <ArrowRightOnRectangleIcon className="w-5 h-5 mr-3" />
          <span>Déconnexion</span>
        </button>
      </nav>
    </div>
  )
}

export default Sidebar 