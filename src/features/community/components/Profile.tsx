import { BadgeCheck, Bookmark, CalendarDays, Flag, HeartHandshake, LogOut, MapPin, PawPrint, Sparkles, Users } from 'lucide-react'
import { useApp } from '@/store'
import { USERS } from '@/constants'
import { Avatar, Badge, Btn, Card, Empty, Verified } from '@ui'
import { cx } from '@/lib'

export default function Profile({ uid }: { uid?: string }) {
  const { me, cases, following, go, logout } = useApp()
  const id = uid || me
  const u = USERS.find((x) => x.id === id)
  if (!u) return <Empty title="Không tìm thấy người dùng" cta="Về Cộng đồng" onCta={() => go('/community')} />
  const own = u.id === me
  const rescued = cases.filter((c) => c.assignee === u.id && c.status === 'resolved')
  const helped = cases.filter((c) => c.assignee === u.id)
  const posted = cases.filter((c) => c.reporter === u.id)
  const followed = own ? cases.filter((c) => following.includes(c.id)) : []

  const badges = [
    { on: u.rescues >= 1, icon: PawPrint, label: 'Rescue', sub: `${u.rescues} ca đã hỗ trợ`, tone: 'bg-coral-soft' },
    { on: u.cases >= 1 || u.verified, icon: Users, label: 'Community', sub: 'Thành viên tích cực', tone: 'bg-sky-soft' },
    { on: u.rescues >= 5 || u.cases >= 4, icon: HeartHandshake, label: 'Helpful', sub: 'Luôn sẵn lòng giúp', tone: 'bg-sage-soft' },
  ].filter((b) => b.on)

  const mini = (list: typeof cases, empty: string) => list.length === 0
    ? <p className="text-sm text-brown-soft">{empty}</p>
    : <ul className="space-y-2">{list.slice(0, 3).map((c) => (
      <li key={c.id}><Btn variant="ghost" size="sm" onClick={() => go(`/case/${c.id}`)} className="flex h-auto w-full items-center gap-2 rounded-2xl bg-cream-2/70 p-1.5 pr-3 text-left hover:bg-butter/60">
        <img src={c.photo} alt={c.name} className="size-9 rounded-xl object-cover" /><span className="truncate text-sm font-extrabold">{c.name}</span><span className="ml-auto text-xs text-brown-soft">{c.district}</span>
      </Btn></li>))}</ul>

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <Card className="flex flex-col items-center gap-4 p-6 text-center sm:flex-row sm:text-left">
        <Avatar name={u.name} tone={u.avatar} size={96} />
        <div className="min-w-0 flex-1 space-y-1.5">
          <h1 className="flex flex-wrap items-center justify-center gap-2 font-display text-3xl font-extrabold leading-tight sm:justify-start">{u.name}{own && <Badge tone="butter">Hồ sơ của bạn</Badge>}</h1>
          <p className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-sm font-bold text-brown-soft sm:justify-start">
            <span className="inline-flex items-center gap-1"><MapPin className="size-4" />{u.area}, Hà Nội</span>
            <span className="inline-flex items-center gap-1"><CalendarDays className="size-4" />Tham gia {u.joined}</span>
          </p>
          <p className="text-brown-2">{u.bio || 'Thành viên chưa viết giới thiệu.'}</p>
          <div className="flex flex-wrap items-center justify-center gap-2 pt-1 sm:justify-start">
            {u.verified ? <Verified label="Đã xác minh danh tính" /> : <Badge tone="brown" icon={<BadgeCheck className="size-3.5" />}>Chưa xác minh</Badge>}
            <Badge tone="sage" icon={<PawPrint className="size-3.5" />}>Đã hỗ trợ {u.rescues} case</Badge>
          </div>
        </div>
        <div className="flex w-full flex-col gap-2 sm:w-auto">
          {own ? (
            <>
              <Btn variant="secondary" icon={<Bookmark className="size-4" />} onClick={() => go('/saved')}>Bài đã lưu</Btn>
              <Btn variant="soft" icon={<LogOut className="size-4" />} onClick={logout}>Đăng xuất</Btn>
            </>
          ) : (
            <Btn variant="danger" size="lg" icon={<Flag className="size-5" />} onClick={() => go(`/safety/report?user=${u.id}`)}>Báo cáo người dùng</Btn>
          )}
        </div>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        <Card><p className="text-sm font-extrabold text-brown-soft">Ca đã cứu</p><p className="mb-2 font-display text-4xl font-extrabold">{u.rescues}</p>{mini(rescued.length ? rescued : helped, 'Chưa có ca nào hiển thị.')}</Card>
        <Card><p className="text-sm font-extrabold text-brown-soft">Đang theo dõi</p><p className="mb-2 font-display text-4xl font-extrabold">{own ? followed.length : '–'}</p>{own ? mini(followed, 'Bạn chưa theo dõi case nào.') : <p className="text-sm text-brown-soft">Danh sách theo dõi là riêng tư.</p>}</Card>
        <Card><p className="text-sm font-extrabold text-brown-soft">Đã đăng</p><p className="mb-2 font-display text-4xl font-extrabold">{posted.length || u.cases}</p>{mini(posted, 'Chưa có bài đăng nào.')}</Card>
      </div>

      <section>
        <h2 className="mb-3 flex items-center gap-2 font-display text-2xl font-extrabold"><Sparkles className="size-5" />Huy hiệu</h2>
        {badges.length === 0 ? <p className="text-brown-soft">Chưa có huy hiệu nào. Mỗi lần giúp đỡ đều được ghi nhận nhé.</p> : (
          <div className="grid gap-3 sm:grid-cols-3">
            {badges.map((b) => (
              <div key={b.label} className={cx('flex items-center gap-3 rounded-2xl border-2 border-line p-3', b.tone)}>
                <span className="grid size-10 place-items-center rounded-full border-2 border-brown bg-paper"><b.icon className="size-5" /></span>
                <div><p className="font-extrabold leading-tight">{b.label}</p><p className="text-xs text-brown-soft">{b.sub}</p></div>
              </div>
            ))}
          </div>
        )}
      </section>

      {!own && (
        <p className="text-center text-sm text-brown-soft">Thấy hành vi đáng ngờ? <Btn variant="ghost" size="sm" className="inline h-auto p-0 font-extrabold underline" onClick={() => go(`/safety/report?user=${u.id}`)}>Báo cáo người dùng này</Btn></p>
      )}
    </div>
  )
}
