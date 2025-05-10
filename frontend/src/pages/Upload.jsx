import { useState } from 'react'
import axios from 'axios'
import Layout from './Layout'

export default function Upload() {
  const [file, setFile] = useState(null)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleUpload = async (e) => {
    e.preventDefault()
    if (!file) return alert('Please select a PDF file')

    const formData = new FormData()
    formData.append('file', file)

    setLoading(true)
    try {
      const res = await axios.post('http://localhost:3333/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      if (res.data && res.data.result) {
        setResult(res.data.result)
      } else {
        alert('Unexpected response from server')
      }
    } catch (err) {
      console.error('Upload error:', err.response?.data || err.message)
      alert('Upload or analysis failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-blue-700 mb-6 text-center">
          Upload YouTube Comments PDF
        </h1>

        <form onSubmit={handleUpload} className="bg-white shadow p-6 rounded-lg space-y-4">
          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => setFile(e.target.files[0])}
            className="w-full border border-gray-300 rounded p-2"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded transition"
          >
            {loading ? 'Analyzing...' : 'Upload and Analyze'}
          </button>
        </form>

        {result && (
          <div className="mt-10 space-y-6">
            {/* Sentiment */}
            <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded shadow-sm">
              <h2 className="text-lg font-semibold text-green-700">📊 Overall Sentiment</h2>
              <p className="mt-1 text-gray-700">
                {Array.isArray(result.summary.sentiment)
                  ? result.summary.sentiment[0].label
                  : result.summary.sentiment}
              </p>
            </div>

            {/* Likes */}
            <FeedbackSection
              title="👍 Likes"
              color="blue"
              items={result.summary.feedback?.likes}
              fallback="No likes found"
            />

            {/* Dislikes */}
            <FeedbackSection
              title="👎 Dislikes"
              color="red"
              items={result.summary.feedback?.dislikes}
              fallback="No dislikes found"
            />

            {/* Demands */}
            <FeedbackSection
              title="📝 Demands"
              color="yellow"
              items={result.summary.feedback?.demands}
              fallback="No demands found"
            />

            {/* Summary */}
            <div className="bg-gray-50 border border-gray-200 p-4 rounded shadow-sm">
              <h3 className="text-lg font-semibold mb-2 text-gray-800">📄 Text Summary</h3>
              <p className="text-gray-700 whitespace-pre-line">{result.summary.text_summary || 'No summary available'}</p>
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}

// Reusable feedback list component
function FeedbackSection({ title, color, items = [], fallback }) {
  const borderColor = {
    blue: 'border-blue-400 text-blue-700',
    red: 'border-red-400 text-red-700',
    yellow: 'border-yellow-400 text-yellow-700',
  }[color]

  return (
    <div className={`bg-${color}-50 border-l-4 p-4 rounded shadow-sm ${borderColor}`}>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      {items.length > 0 ? (
        <ul className="list-disc list-inside space-y-1 text-gray-800">
          {items.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-600">{fallback}</p>
      )}
    </div>
  )
}