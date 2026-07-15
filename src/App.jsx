import { HashRouter, Routes, Route } from 'react-router-dom'
import Nav from './components/Nav'
import Home from './screens/Home'
import Redeem from './screens/Redeem'
import History from './screens/History'
import Stats from './screens/Stats'
import ManageTasks from './screens/ManageTasks'

export default function App() {
  return (
    <HashRouter>
      <div className="min-h-screen bg-[var(--brand-lilac-50)]">
        <Routes>
          <Route path="/"        element={<Home />} />
          <Route path="/redeem"  element={<Redeem />} />
          <Route path="/history" element={<History />} />
          <Route path="/stats"   element={<Stats />} />
          <Route path="/manage"  element={<ManageTasks />} />
        </Routes>
        <Nav />
      </div>
    </HashRouter>
  )
}
