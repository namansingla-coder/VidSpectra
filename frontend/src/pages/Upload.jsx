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
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Upload PDF for YouTube Comment Insights</h1>
      <form onSubmit={handleUpload} className="space-y-4">
        <input
          type="file"
          accept="application/pdf"
          onChange={(e) => setFile(e.target.files[0])}
          className="block w-full border p-2"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
          disabled={loading}
        >
          {loading ? 'Analyzing...' : 'Upload and Analyze'}
        </button>
      </form>

      {result && (
        <div className="mt-8 space-y-4">
          <h2 className="text-xl font-semibold text-green-700">
            Overall Sentiment:{" "}
            {Array.isArray(result.summary.sentiment)
              ? result.summary.sentiment[0].label
              : result.summary.sentiment}
          </h2>

          <div className="bg-gray-100 p-4 rounded">
            <h3 className="text-lg font-semibold text-blue-700 mb-2">Likes ❤️</h3>
            <ul className="list-disc list-inside space-y-1">
              {result.summary.feedback?.likes?.length > 0
                ? result.summary.feedback.likes.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))
                : <li>No likes found</li>}
            </ul>
          </div>

          <div className="bg-gray-100 p-4 rounded">
            <h3 className="text-lg font-semibold text-red-700 mb-2">Dislikes 💔</h3>
            <ul className="list-disc list-inside space-y-1">
              {result.summary.feedback?.dislikes?.length > 0
                ? result.summary.feedback.dislikes.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))
                : <li>No dislikes found</li>}
            </ul>
          </div>

          <div className="bg-gray-100 p-4 rounded">
            <h3 className="text-lg font-semibold text-yellow-700 mb-2">Demands 📝</h3>
            <ul className="list-disc list-inside space-y-1">
              {result.summary.feedback?.demands?.length > 0
                ? result.summary.feedback.demands.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))
                : <li>No demands found</li>}
            </ul>
          </div>

          <div className="bg-white border p-4 rounded">
            <h3 className="text-lg font-semibold">Text Summary 📄</h3>
            <p className="mt-2 text-gray-700">{result.summary.text_summary || 'No summary available'}</p>
          </div>
        </div>
      )}
    </div>
    </Layout>
  )
}