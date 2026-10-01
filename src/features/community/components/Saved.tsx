import { useState } from 'react'
import { Compass } from 'lucide-react'
import { useApp } from '@/store'
import { CaseCard } from '@/components/common'
import { Btn, Chip, Empty, PageHead, Segmented } from '@ui'

export default function Saved() {
  const { cases, saved, following, go } = useApp()
  const [tab, setTab] = useState<'active' | 'progress' | 'resolved'>('active')
  const [src, setSrc] = useState<'all' | 'saved' | 'following'>('all')

  const ids = src === 'saved' ? saved : src === 'following' ? following : [...new Set([...saved, ...following])]
  const mine = ids.map((id) => cases.find((c) => c.id === id)).filter((c): c is NonNullable<typeof c> => !!c)
  const bucket = (s: string) => (s === 'active' ? 'active' : s === 'resolved' ? 'resolved' : 'progress')
  const list = mine.filter((c) => bucket(c.status) === tab)
  const count = (t: string) => mine.filter((c) => bucket(c.status) === t).length

  const emptyTitle = src === 'following' ? 'Bạn chưa theo dõi case nào.' : src === 'saved' ? 'Chưa có thú cưng nào được lưu.' : mine.length === 0 ? 'Chưa có thú cưng nào được lưu.' : 'Chưa có case nào trong mục này.'

  return (
    <div>
      <PageHead title="Bài đã lưu & theo dõi" sub="Những bé bạn quan tâm, gom về một chỗ." />
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <Segmented value={tab} onChange={setTab} options={[
          { v: 'active', label: `Đang active (${count('active')})` },
          { v: 'progress', label: `Đang xử lý (${count('progress')})` },
          { v: 'resolved', label: `Lịch sử resolved (${count('resolved')})` },
        ]} className="max-w-full overflow-x-auto no-scrollbar" />
      </div>
      <div className="mb-5 flex flex-wrap gap-2">
        <Chip active={src === 'all'} onClick={() => setSrc('all')}>Tất cả</Chip>
        <Chip active={src === 'saved'} onClick={() => setSrc('saved')}>Đã lưu ({saved.length})</Chip>
        <Chip active={src === 'following'} onClick={() => setSrc('following')}>Đang theo dõi ({following.length})</Chip>
      </div>
      {tab === 'resolved' && list.length > 0 && <p className="mb-3 text-sm font-semibold text-brown-soft">Các case đã giải quyết chỉ hiển thị ở mục lịch sử này.</p>}
      {list.length === 0 ? (
        <Empty title={emptyTitle} body="Khám phá bản đồ để tìm những bé cần bạn giúp đỡ." cta="Khám phá bản đồ" onCta={() => go('/home')} />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((c) => <CaseCard key={c.id} c={c} />)}
        </div>
      )}
      {list.length > 0 && <div className="mt-6 text-center"><Btn variant="soft" icon={<Compass className="size-4" />} onClick={() => go('/home')}>Mở bản đồ</Btn></div>}
    </div>
  )
}
