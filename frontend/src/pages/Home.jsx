import Layout from './Layout'
import { Link } from 'react-router-dom'
import { FaCheckCircle } from 'react-icons/fa'

export default function Home() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-50 to-white py-16 px-4 text-center">
        <h1 className="text-5xl font-bold text-blue-700 mb-4">Welcome to Vidspectra</h1>
        <p className="text-gray-700 text-lg max-w-3xl mx-auto">
          Analyze YouTube video comments from PDF files and get instant insights into what viewers like, dislike, or demand — all powered by smart AI models.
        </p>

        <div className="mt-8">
          <Link
            to="/upload"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-md text-lg font-semibold transition"
          >
            Start Analyzing
          </Link>
        </div>
      </section>

      {/* Feature Section */}
      <section className="py-12 px-4 bg-white text-center">
        <h2 className="text-3xl font-bold mb-6 text-gray-800">Why Use Vidspectra?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 max-w-4xl mx-auto text-left">
          <FeatureItem text="✔️ Upload PDF of YouTube comments with ease" />
          <FeatureItem text="✔️ Get a clear summary of viewer sentiments" />
          <FeatureItem text="✔️ Detect likes, dislikes, and viewer demands" />
          <FeatureItem text="✔️ Beautiful and simple interface, mobile friendly" />
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-blue-50 text-center">
        <h3 className="text-2xl font-semibold mb-4 text-gray-800">
          Ready to explore what your audience really thinks?
        </h3>
        <Link
          to="/upload"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium transition"
        >
          Try Vidspectra Now
        </Link>
      </section>
    </Layout>
  )
}

function FeatureItem({ text }) {
  return (
    <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-md shadow-sm hover:shadow-md transition">
      <FaCheckCircle className="text-blue-500 mt-1" size={20} />
      <p className="text-gray-700 text-base">{text}</p>
    </div>
  )
}