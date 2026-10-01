import type { ReactNode } from 'react'
import { parsePath } from '../../store'
import UserShell from '../../shell'
import Notifications from './notifications'
import Saved from './saved'
import { Directory, PlaceDetail } from './directory'
import { CommunityHub, DonateGoods, DonateHome, DonateMoney, Leaderboard } from './hub'
import Profile from './profile'
import { Safety, SafetyReport } from './safety'

export { RatingModal } from './shared'

export function communityRoute(path: string): ReactNode | null {
  const { seg, query } = parsePath(path)
  const [a, b] = seg
  let page: ReactNode = null
  switch (a) {
    case 'notifications': if (seg.length === 1) page = <Notifications /> ; break
    case 'saved': if (seg.length === 1) page = <Saved />; break
    case 'community': if (seg.length === 1) page = <CommunityHub />; break
    case 'shelters': if (seg.length === 1) page = <Directory kind="shelter" key="sh" />; else if (seg.length === 2) page = <PlaceDetail kind="shelter" id={b} key={b} />; break
    case 'clinics': if (seg.length === 1) page = <Directory kind="clinic" key="cl" />; else if (seg.length === 2) page = <PlaceDetail kind="clinic" id={b} key={b} />; break
    case 'donate':
      if (seg.length === 1) page = <DonateHome />
      else if (b === 'money') page = <DonateMoney shelterId={query.shelter} key={query.shelter} />
      else if (b === 'goods') page = <DonateGoods />
      break
    case 'leaderboard': if (seg.length === 1) page = <Leaderboard />; break
    case 'profile': if (seg.length <= 2) page = <Profile uid={b} key={b || 'me'} />; break
    case 'safety':
      if (seg.length === 1) page = <Safety />
      else if (b === 'report') page = <SafetyReport caseId={query.case} userId={query.user} key={path} />
      break
  }
  return page ? <UserShell>{page}</UserShell> : null
}
