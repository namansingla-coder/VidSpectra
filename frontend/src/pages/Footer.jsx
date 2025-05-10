export default function Footer() {
    return (
      <footer className="bg-gray-50 border-t text-sm text-gray-600">
        <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
          <p>
            &copy; {new Date().getFullYear()} <span className="font-semibold text-blue-700">Vidspectra</span>. All rights reserved.
          </p>
          <div className="flex space-x-4">
            <a
              href="#"
              className="hover:text-blue-600 transition"
              target="_blank"
              rel="noopener noreferrer"
            >
              Privacy Policy
            </a>
            <a
              href="https://github.com/namansingla-coder/VidSpectra.git"
              className="hover:text-blue-600 transition"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
          </div>
        </div>
      </footer>
    )
  }