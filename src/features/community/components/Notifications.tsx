import { useState } from 'react'
import { Bell, CheckCheck, Heart, ShieldAlert, Sparkles, PawPrint } from 'lucide-react'
import { useApp } from '@/store'
import { Btn, Card, Chip, Empty, PageHead } from '@ui'
import { cx } from '@/lib'
import type { Notif } from '@/types'

const TABS = [
  { v: 'all', label: 'Tất cả' },
  { v: 'rescue', label: 'Rescue' },
  { v: 'match', label: 'Match' },
  { v: 'community', label: 'Community' },
  { v: 'safety', label: 'Safety' },
] as const

const KIND: Record<Notif['kind'], { icon: typeof Bell; bg: string; label: string }> = {
  rescue: { icon: PawPrint, bg: 'bg-coral-soft', label: 'Cứu hộ' },
  match: { icon: Sparkles, bg: 'bg-plum-soft', label: 'AI Match' },
  community: { icon: Heart, bg: 'bg-pink', label: 'Cộng đồng' },
  safety: { icon: ShieldAlert, bg: 'bg-orange-soft', label: 'An toàn' },
}

export default function Notifications() {
  const { notifs, markAllRead, go, toast } = useApp()
  const [tab, setTab] = useState<(typeof TABS)[number]['v']>('all')
  const [read, setRead] = useState<string[]>([])
  const list = notifs.filter((n) => tab === 'all' || n.kind === tab)
  const isUnread = (n: Notif) => n.unread && !read.includes(n.id)
  const unread = notifs.filter(isUnread).length

  const open = (n: Notif) => {
    setRead((r) => [...r, n.id])
    if (n.caseId) go(`/case/${n.caseId}`)
    else if (n.kind === 'safety') go('/safety')
  }

  return (
    <div className="mx-auto max-w-3xl">
      <PageHead
        title="Thông báo"
        sub={unread > 0 ? `Bạn có ${unread} thông báo chưa đọc` : 'Bạn đã đọc hết thông báo'}
        right={<Btn variant="secondary" size="sm" icon={<CheckCheck className="size-4" />} disabled={unread === 0}
          onClick={() => { markAllRead(); setRead(notifs.map((n) => n.id)); toast('Đã đánh dấu tất cả là đã đọc') }}>Đánh dấu đã đọc</Btn>}
      />
      <div className="no-scrollbar -mx-4 mb-4 flex gap-2 overflow-x-auto px-4" role="tablist">
        {TABS.map((t) => <Chip key={t.v} active={tab === t.v} onClick={() => setTab(t.v)}>{t.label}</Chip>)}
      </div>
      {list.length === 0 ? (
        <Empty title="Chưa có thông báo mới." body="Khi có cập nhật về các case bạn quan tâm, chúng sẽ hiện ở đây." />
      ) : (
        <ul className="space-y-3">
          {list.map((n) => {
            const K = KIND[n.kind]
            const u = isUnread(n)
            return (
              <li key={n.id}>
                <Card hover onClick={() => open(n)} className={cx('flex items-start gap-3 p-4', u && 'border-brown/50 bg-white')}>
                  <span className={cx('grid size-11 shrink-0 place-items-center rounded-2xl border-2 border-brown', K.bg)}><K.icon className="size-5" /></span>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-extrabold text-brown-soft">{K.label} · {n.ago}</p>
                    <p className={cx('leading-snug', u ? 'font-extrabold' : 'font-bold')}>{n.title}</p>
                    <p className="mt-0.5 text-sm text-brown-soft">{n.body}</p>
                    {n.caseId && <p className="mt-1 text-xs font-extrabold text-sky-2">Xem case {n.caseId} →</p>}
                  </div>
                  {u && <span className="mt-1.5 size-3 shrink-0 rounded-full border-2 border-brown bg-coral" aria-label="Chưa đọc" />}
                </Card>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
