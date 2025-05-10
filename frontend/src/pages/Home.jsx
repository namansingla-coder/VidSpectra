import Layout from './Layout'
import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <Layout>
      <h2 className="text-4xl font-bold mb-4 text-gray-800 text-center">
        Welcome to Vidspectra
      </h2>
      <p className="text-gray-600 text-lg max-w-2xl mx-auto text-center">
        Vidspectra helps you analyze YouTube comment data from exported PDFs to understand what people like, dislike, and demand in a video. Upload your comments file and get instant insights using AI-powered analysis.
      </p>

      <div className="mt-10 text-center">
        <h3 className="text-2xl font-semibold mb-3">Key Features:</h3>
        <ul className="text-left max-w-xl mx-auto space-y-2 text-gray-700">
          <li>✔️ PDF-based YouTube comment analysis</li>
          <li>✔️ Detect likes, dislikes, and viewer demands</li>
          <li>✔️ Summary and sentiment overview</li>
          <li>✔️ Clean and easy-to-use interface</li>
        </ul>
      </div>

      <div className="mt-10 text-center">
        <Link
          to="/upload"
          className="bg-blue-600 text-white px-6 py-3 rounded-md font-medium hover:bg-blue-700 transition"
        >
          Try It Now
        </Link>
      </div>
    </Layout>
  )
}