import { BrowserRouter, Routes, Route } from 'react-router-dom'
import TopNav from './components/TopNav'
import LandingPage from './pages/LandingPage'
import DashboardPage from './pages/DashboardPage'
import SavedPage from './pages/SavedPage'
import DigestPage from './pages/DigestPage'
import SettingsPage from './pages/SettingsPage'
import ProofPage from './pages/ProofPage'
import TestChecklistPage from './pages/TestChecklistPage'
import ShipPage from './pages/ShipPage'

export default function App() {
  return (
    <BrowserRouter>
      <div className="kn-app kn-app--tracker">
        <TopNav />
        <main className="kn-app__main">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/saved" element={<SavedPage />} />
            <Route path="/digest" element={<DigestPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/proof" element={<ProofPage />} />
            <Route path="/jt/proof" element={<ProofPage />} />
            <Route path="/jt/07-test" element={<TestChecklistPage />} />
            <Route path="/jt/08-ship" element={<ShipPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}
