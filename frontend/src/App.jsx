import Upload from './pages/Upload'
import Home from './pages/Home';
import {Routes, Route} from "react-router-dom";
function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/upload" element={<Upload />} />
    </Routes>
  )
}
export default App
