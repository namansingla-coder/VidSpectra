import { Link } from 'react-router-dom'

export default function Header() {
  return (
    <header className="bg-blue-700 text-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold tracking-wide">
          Vidspectra
        </Link>
        <Link
          to="/upload"
          className="bg-white text-blue-700 px-4 py-2 rounded font-medium hover:bg-gray-200 transition"
        >
          Go to Upload
        </Link>
      </div>
    </header>
  )
}