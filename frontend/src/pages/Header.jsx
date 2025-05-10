import { Link, useLocation } from 'react-router-dom'

export default function Header() {
  const location = useLocation()

  const isActive = (path) => location.pathname === path

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        {/* Brand */}
        <Link to="/" className="text-3xl font-extrabold text-blue-700 tracking-tight">
          Vidspectra
        </Link>

        {/* Nav Links */}
        <nav className="space-x-4">
          <Link
            to="/"
            className={`px-4 py-2 rounded-md font-medium ${
              isActive('/')
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-700 hover:text-blue-600 transition'
            }`}
          >
            Home
          </Link>

          <Link
            to="/upload"
            className={`px-4 py-2 rounded-md font-medium ${
              isActive('/upload')
                ? 'bg-blue-600 text-white'
                : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition'
            }`}
          >
            Upload
          </Link>
        </nav>
      </div>
    </header>
  )
}