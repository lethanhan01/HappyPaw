import type { ReactNode } from 'react'
import { parsePath } from '@/lib'
import Auth from './components/Auth'
import Explorer from './components/Explorer'
import { FindHub, AiMatch, StatesDemo } from './components/Find'
import { ReportChooser, LostWizard, FoundWizard, RescueForm } from './components/Report'
import { caseRoute } from './components/Caseflow'

export function userRoute(path: string): ReactNode | null {
  const { seg } = parsePath(path)
  const [a, b] = seg
  switch (a) {
    case 'login': return <Auth mode="login" />
    case 'register': return <Auth mode="register" />
    case 'home':
    case 'map': return <Explorer variant="home" />
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

export * from './components/Auth'
export * from './components/Explorer'
export * from './components/Find'
export * from './components/Report'
export * from './components/Caseflow'
