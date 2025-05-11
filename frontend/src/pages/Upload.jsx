import { useState } from 'react'
import axios from 'axios'
import Layout from './Layout'

export default function Upload() {
  const [file, setFile] = useState(null)
  const [videoUrl, setVideoUrl] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const extractVideoId = (url) => {
    const match = url.match(/(?:v=|\/)([0-9A-Za-z_-]{11})/)
    return match ? match[1] : null
  }

  const handlePdfUpload = async (e) => {
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
      setResult(res.data.result)
    } catch (err) {
      console.error('Upload error:', err.response?.data || err.message)
      alert('Upload or analysis failed')
    } finally {
      setLoading(false)
    }
  }

  const handleYoutubeAnalyze = async (e) => {
    e.preventDefault()
    const videoId = extractVideoId(videoUrl)
    if (!videoId) return alert('Invalid YouTube URL')

    setLoading(true)
    try {
      const res = await axios.post('http://localhost:3333/analyze-youtube', {
        video_id: videoId,
      })
      setResult(res.data.result)
    } catch (err) {
      console.error('YouTube analyze error:', err.response?.data || err.message)
      alert('YouTube analysis failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout>
      <div className="max-w-5xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-extrabold text-blue-800 mb-10 text-center tracking-tight">
          YouTube Comment Analyzer
        </h1>

        {/* PDF Upload */}
        <form
          onSubmit={handlePdfUpload}
          className="bg-white shadow-md p-8 rounded-xl space-y-6 mb-12 border border-gray-200"
        >
          <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
            📄 Upload PDF
          </h2>
          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => setFile(e.target.files[0])}
            className="w-full border border-gray-300 rounded-md p-3 focus:ring focus:ring-blue-300"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-700 hover:bg-blue-800 text-white font-semibold py-3 rounded-lg transition"
          >
            {loading ? 'Analyzing PDF...' : 'Upload and Analyze PDF'}
          </button>
        </form>

        {/* YouTube URL Input */}
        <form
          onSubmit={handleYoutubeAnalyze}
          className="bg-white shadow-md p-8 rounded-xl space-y-6 border border-gray-200"
        >
          <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
            🔗 Analyze by YouTube Link
          </h2>
          <input
            type="text"
            placeholder="Paste YouTube video URL"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-3 focus:ring focus:ring-green-300"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-700 hover:bg-green-800 text-white font-semibold py-3 rounded-lg transition"
          >
            {loading ? 'Analyzing Video...' : 'Analyze YouTube Comments'}
          </button>
        </form>

        {/* Result Section */}
        {result && (
          <div className="mt-12 space-y-8">
            {/* Sentiment */}
            <div className="bg-green-100 border-l-4 border-green-600 p-5 rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold text-green-700">📊 Overall Sentiment</h2>
              <p className="mt-2 text-gray-800 text-lg">
                {Array.isArray(result.summary.sentiment)
                  ? result.summary.sentiment[0].label
                  : result.summary.sentiment}
              </p>
            </div>

            {/* Likes */}
            <FeedbackSection
              title="👍 What People Loved (Likes)"
              color="blue"
              icon="👍"
              items={result.summary.feedback?.likes}
              fallback="Viewers did not express clear likes."
            />

            {/* Dislikes */}
            <FeedbackSection
              title="👎 Common Criticisms (Dislikes)"
              color="red"
              icon="👎"
              items={result.summary.feedback?.dislikes}
              fallback="No strong dislikes were identified."
            />

            {/* Demands */}
            <FeedbackSection
              title="📝 User Suggestions & Feature Demands"
              color="yellow"
              icon="📝"
              items={result.summary.feedback?.demands}
              fallback="No specific suggestions or requests."
            />

            {/* Summary */}
            <div className="bg-gray-100 border border-gray-300 p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-3 text-gray-800">📄 Text Summary</h3>
              <p className="text-gray-700 whitespace-pre-line text-base leading-relaxed">
                {result.summary.text_summary || 'No summary available'}
              </p>
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}

function FeedbackSection({ title, color, icon, items = [], fallback }) {
  const styles = {
    blue: {
      bg: 'bg-blue-50',
      border: 'border-l-4 border-blue-500',
      text: 'text-blue-800',
    },
    red: {
      bg: 'bg-red-50',
      border: 'border-l-4 border-red-500',
      text: 'text-red-800',
    },
    yellow: {
      bg: 'bg-yellow-50',
      border: 'border-l-4 border-yellow-500',
      text: 'text-yellow-800',
    },
  }[color]

  return (
    <div className={`${styles.bg} ${styles.border} p-5 rounded-lg shadow-sm`}>
      <h3 className={`text-lg font-bold mb-3 flex items-center gap-2 ${styles.text}`}>
        {icon} {title}
      </h3>
      {items.length > 0 ? (
        <ul className="list-disc list-inside space-y-1 text-gray-800 pl-4">
          {items.map((item, index) => (
            <li key={index} className="text-base leading-snug">
              {item}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-600 italic">{fallback}</p>
      )}
    </div>
  )
}
