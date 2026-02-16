import { Routes, Route, Navigate } from 'react-router-dom'
import { ArtifactProvider } from '@/context/ArtifactContext'
import { ResumeProvider } from '@/context/ResumeContext'
import { TemplateProvider } from '@/context/TemplateContext'
import { RbStepLayout } from '@/routes/rb/RbStepLayout'
import { RbStepPage } from '@/routes/rb/RbStepPage'
import { RbProofPage } from '@/routes/rb/RbProofPage'
import { HomePage } from '@/pages/HomePage'
import { BuilderPage } from '@/pages/BuilderPage'
import { PreviewPage } from '@/pages/PreviewPage'
import { ProofPage } from '@/pages/ProofPage'

export default function App() {
  return (
    <ResumeProvider>
      <TemplateProvider>
      <ArtifactProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/builder" element={<BuilderPage />} />
          <Route path="/preview" element={<PreviewPage />} />
          <Route path="/proof" element={<ProofPage />} />
          <Route path="/rb" element={<Navigate to="/rb/01-problem" replace />} />
          <Route path="/rb/proof" element={<RbProofPage />} />
          <Route path="/rb/:stepSlug" element={<RbStepLayout />}>
            <Route index element={<RbStepPage />} />
          </Route>
        </Routes>
      </ArtifactProvider>
      </TemplateProvider>
    </ResumeProvider>
  )
}
