import { useState } from 'react'
import axios from 'axios'
import Layout from './Layout'

export default function Upload() {
  const [file, setFile] = useState(null)
  const [videoUrl, setVideoUrl] = useState('')
  const [result, setResult] = useState(null)
  const [loadingPDF, setLoadingPDF] = useState(false)
  const [loadingVideo, setLoadingVideo] = useState(false)

  const extractVideoId = (url) => {
    const match = url.match(/(?:v=|\/)([0-9A-Za-z_-]{11})/)
    return match ? match[1] : null
  }

  const handlePdfUpload = async (e) => {
    e.preventDefault()
    if (!file) return alert('Please select a PDF file')

    const formData = new FormData()
    formData.append('file', file)

    setLoadingPDF(true)
    setResult(null)

    try {
      const res = await axios.post('http://127.0.0.1:3333/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      setResult(res.data.result)
    } catch (err) {
      console.error('PDF Analyze Error:', err)
      alert('Failed to analyze PDF.')
    } finally {
      setLoadingPDF(false)
    }
  }

  const handleYoutubeAnalyze = async (e) => {
    e.preventDefault()
    const videoId = extractVideoId(videoUrl)
    if (!videoId) return alert('Invalid YouTube URL')

    setLoadingVideo(true)
    setResult(null)

    try {
      const res = await axios.post('http://127.0.0.1:3333/analyze-youtube', {
        video_id: videoId,
      })

      setResult(res.data.result)
    } catch (err) {
      console.error('YouTube Analyze Error:', err)
      alert('Failed to analyze YouTube video.')
    } finally {
      setLoadingVideo(false)
    }
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-10">
        <h1 className="text-4xl font-bold text-center mb-10 text-blue-900">
          🎯 YouTube & PDF Sentiment Analyzer
        </h1>

        <div className="grid md:grid-cols-2 gap-8">
          <form onSubmit={handlePdfUpload} className="bg-white p-6 rounded-xl shadow-md space-y-4 border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-700">📄 Upload a PDF</h2>
            <input
              type="file"
              accept="application/pdf"
              onChange={(e) => setFile(e.target.files[0])}
              className="block w-full border border-gray-300 p-2 rounded-md"
            />
            <button
              type="submit"
              disabled={loadingPDF}
              className="w-full bg-blue-700 hover:bg-blue-800 text-white font-semibold py-2 rounded-md"
            >
              {loadingPDF ? 'Analyzing PDF...' : 'Analyze PDF'}
            </button>
          </form>

          <form onSubmit={handleYoutubeAnalyze} className="bg-white p-6 rounded-xl shadow-md space-y-4 border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-700">🎥 Analyze YouTube Comments</h2>
            <input
              type="text"
              placeholder="Paste YouTube video URL"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              className="block w-full border border-gray-300 p-2 rounded-md"
            />
            <button
              type="submit"
              disabled={loadingVideo}
              className="w-full bg-green-700 hover:bg-green-800 text-white font-semibold py-2 rounded-md"
            >
              {loadingVideo ? 'Analyzing Video...' : 'Analyze Comments'}
            </button>
          </form>
        </div>

        {result && (
          <div className="mt-10 space-y-6">
            {/* Sentiment */}
            {result.summary?.sentiment && (
              <div className="bg-emerald-100 p-4 rounded-lg border-l-4 border-emerald-500 hover:shadow-md transition-shadow">
                <h2 className="text-xl font-bold text-emerald-800">📊 Overall Sentiment</h2>
                <p className="mt-1 text-lg text-gray-800">
                  {Array.isArray(result.summary.sentiment)
                    ? result.summary.sentiment[0].label.replace('LABEL_', '')
                    : result.summary.sentiment}
                </p>
              </div>
            )}

            {/* Main Topic */}
            {Array.isArray(result.summary?.topics) &&
              result.summary.topics.length > 0 &&
              result.summary.topics.some((t) => t && t !== '{}' && t.trim() !== '') && (
                <div className="bg-sky-100 p-4 rounded-lg border-l-4 border-sky-400 hover:shadow-md transition-shadow">
                  <h2 className="text-xl font-bold text-sky-800">🧩 Main Topic</h2>
                  <p className="mt-1 text-lg text-gray-800">{result.summary.topics.join(', ')}</p>
                </div>
              )}

            {/* Feedback Sections */}
            <FeedbackSection
              title="👍 What People Loved"
              color="indigo"
              icon="👍"
              items={result.summary?.feedback?.likes || []}
              fallback="No positive feedback identified."
            />

            <FeedbackSection
              title="👎 Common Criticisms"
              color="rose"
              icon="👎"
              items={result.summary?.feedback?.dislikes || []}
              fallback="No negative feedback identified."
            />

            <FeedbackSection
              title="📢 What People Demanded"
              color="amber"
              icon="📢"
              items={result.summary?.feedback?.demands || []}
              fallback="No demands or suggestions found."
            />

            {/* Summary */}
            {result.summary?.text_summary && (
              <div className="bg-yellow-100 p-4 rounded-lg border-l-4 border-yellow-500 hover:shadow-md transition-shadow">
                <h2 className="text-xl font-bold text-yellow-800">📝 Summary</h2>
                <p className="mt-1 text-lg text-gray-800">{result.summary.text_summary}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  )
}

function FeedbackSection({ title, color, icon, items, fallback }) {
  return (
    <div className={`bg-${color}-100 p-4 rounded-lg border-l-4 border-${color}-500 hover:shadow-md transition-shadow`}>
      <h3 className={`text-lg font-bold text-${color}-800`}>
        {icon} {title}
      </h3>
      <ul className="mt-2">
        {items.length > 0 ? (
          items.map((item, index) => (
            <li key={index} className="text-gray-800">{item}</li>
          ))
        ) : (
          <li className="text-gray-600">{fallback}</li>
        )}
      </ul>
    </div>
  )
}