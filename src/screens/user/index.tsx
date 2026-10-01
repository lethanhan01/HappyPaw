import type { ReactNode } from 'react'
import { parsePath } from '../../store'
import Auth from './auth'
import Explorer from './explorer'
import { FindHub, AiMatch, StatesDemo } from './find'
import { ReportChooser, LostWizard, FoundWizard, RescueForm } from './report'
import { caseRoute } from './caseflow'

export function userRoute(path: string): ReactNode | null {
  const { seg } = parsePath(path)
  const [a, b] = seg
  switch (a) {
    case 'login': return <Auth mode="login" />
    case 'register': return <Auth mode="register" />
    case 'home': return <Explorer variant="home" />
    case 'map': return <Explorer variant="map" />
    case 'find': return <FindHub />
    case 'ai-match': return <AiMatch />
    case 'states': return <StatesDemo />
    case 'report':
      if (b === 'lost') return <LostWizard />
      if (b === 'found') return <FoundWizard />
      if (b === 'rescue') return <RescueForm />
      return <ReportChooser />
    case 'case': return caseRoute(path)
  }
  return null
}
