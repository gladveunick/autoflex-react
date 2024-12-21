import Sidebar from './Sidebar'

function Layout({ children }) {
  return (
    <div className="flex w-full">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        {children}
      </div>
    </div>
  )
}

export default Layout 