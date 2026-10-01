import { useState } from 'react'
import { Eye, EyeOff, ShieldCheck, Loader2, ArrowLeft } from 'lucide-react'
import pawsImg from '@/assets/paws.png'
import puddleApricot from '@/assets/puddle_vang_mo.jpg'
import { useApp } from '@/store'
import { BrandImage, Btn, IconBtn, Check2, Field, Input, Note } from '@ui'

const Google = () => (
  <svg viewBox="0 0 24 24" className="size-5" aria-hidden="true">
    <path fill="#4285F4" d="M22.5 12.3c0-.8-.1-1.5-.2-2.2H12v4.2h5.9a5 5 0 0 1-2.2 3.3v2.7h3.6c2.1-1.9 3.2-4.8 3.2-8z" />
    <path fill="#34A853" d="M12 23c3 0 5.5-1 7.3-2.7l-3.6-2.8c-1 .7-2.2 1.1-3.7 1.1-2.9 0-5.3-1.9-6.2-4.5H2.1v2.8A11 11 0 0 0 12 23z" />
    <path fill="#FBBC05" d="M5.8 14.1a6.6 6.6 0 0 1 0-4.2V7.1H2.1a11 11 0 0 0 0 9.8l3.7-2.8z" />
    <path fill="#EA4335" d="M12 5.4c1.6 0 3.1.6 4.2 1.7l3.2-3.2A11 11 0 0 0 2.1 7.1l3.7 2.8C6.7 7.300 9.100 5.400 12 5.400z" />
  </svg>
)

export default function Auth({ mode }: { mode: 'login' | 'register' }) {
  const { login, go, toast } = useApp()
  const [show, setShow] = useState(false)
  const [busy, setBusy] = useState(false)
  const [email, setEmail] = useState('')
  const [pw, setPw] = useState('')
  const [name, setName] = useState('')
  const [agree, setAgree] = useState(false)
  const [err, setErr] = useState<Record<string, string>>({})
  const reg = mode === 'register'

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const er: Record<string, string> = {}
    if (reg && !name.trim()) er.name = 'Vui lòng nhập tên hiển thị.'
    if (!/^\S+@\S+\.\S+$/.test(email)) er.email = 'Email chưa đúng định dạng.'
    if (pw.length < 6) er.pw = 'Mật khẩu cần ít nhất 6 ký tự.'
    if (reg && !agree) er.agree = 'Bạn cần đồng ý với quy tắc cộng đồng.'
    setErr(er)
    if (Object.keys(er).length) return
    setBusy(true)
    setTimeout(() => {
      setBusy(false)
      toast(reg ? 'Chào mừng bạn đến với Happy Paws 🐾' : 'Đăng nhập thành công')
      login('user')
    }, 700)
  }
  const oauth = () => {
    setBusy(true)
    setTimeout(() => {
      setBusy(false)
      login('user')
    }, 800)
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-[1.05fr_1fr]">
      <aside className="relative hidden overflow-hidden bg-butter lg:block">
        <img src={pawsImg} alt="" aria-hidden="true" className="absolute -right-24 -top-10 w-[420px] rotate-12 opacity-30" />
        <div className="relative flex h-full flex-col justify-between p-12">
          <BrandImage className="w-56 rounded-2xl" />
          <div>
            <h2 className="bubble font-display text-6xl font-extrabold leading-[1.05]">Cùng tìm lại<br />những chiếc đuôi nhỏ.</h2>
            <p className="mt-4 max-w-md text-lg font-semibold">Cộng đồng Hà Nội kết nối để tìm thú cưng thất lạc và cứu hộ chó mèo, nhanh và an toàn hơn.</p>
            <div className="mt-6 flex gap-3">
              {[['1.240+', 'Bé đã đoàn tụ'], ['3.800', 'Thành viên'], ['42', 'Mái ấm & phòng khám']].map(([n, l]) => (
                <div key={l} className="rounded-3xl border-2 border-brown bg-paper px-4 py-3"><p className="font-display text-2xl font-extrabold">{n}</p><p className="text-xs font-bold text-brown-soft">{l}</p></div>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-4 rounded-3xl border-2 border-brown bg-paper/90 p-4 shadow-soft">
            <img
              src={puddleApricot}
              alt="Bé Bơ Poodle"
              className="size-20 rounded-2xl border-2 border-brown object-cover shadow-sm shrink-0"
            />
            <div>
              <p className="text-xs font-black uppercase tracking-wider text-coral">Cứu hộ & Đoàn tụ</p>
              <p className="font-display text-base font-extrabold text-brown leading-snug">
                “Mỗi chiếc đuôi nhỏ đều xứng đáng được an toàn và trở về nhà.”
              </p>
            </div>
          </div>
        </div>
      </aside>

      <main className="flex items-center justify-center px-5 py-10">
        <div className="w-full max-w-md">
          <div className="mb-6 text-center lg:hidden"><BrandImage className="mx-auto w-56" /></div>
          <Btn
            variant="ghost"
            size="sm"
            onClick={() => go('/')}
            icon={<ArrowLeft className="size-4" />}
            className="mb-4 !h-auto !p-0 !border-0 inline-flex items-center gap-1.5 text-sm font-extrabold text-brown-soft hover:text-brown transition"
          >
            Quay lại trang chủ
          </Btn>
          <h1 className="font-display text-4xl font-extrabold">{reg ? 'Tạo tài khoản' : 'Chào mừng trở lại'}</h1>
          <p className="mb-6 mt-1 text-brown-soft">{reg ? 'Chỉ mất một phút để tham gia cộng đồng.' : 'Đăng nhập để tiếp tục giúp các bé.'}</p>

          <Btn
            variant="secondary"
            size="md"
            full
            onClick={oauth}
            disabled={busy}
            icon={<Google />}
            className="!bg-white font-extrabold hover:!bg-butter/50"
          >
            {reg ? 'Đăng ký với Google' : 'Tiếp tục với Google'}
          </Btn>
          <div className="my-5 flex items-center gap-3 text-xs font-bold text-brown-soft"><span className="h-px flex-1 bg-line" />hoặc dùng email<span className="h-px flex-1 bg-line" /></div>

          <form onSubmit={submit} className="space-y-4" noValidate>
            {reg && <Field label="Tên hiển thị" error={err.name} required><Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Phạm Khánh Linh" invalid={!!err.name} /></Field>}
            <Field label="Email" error={err.email} required><Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="linh@email.com" invalid={!!err.email} /></Field>
            <Field label="Mật khẩu" error={err.pw} helper={reg ? 'Ít nhất 6 ký tự.' : undefined} required>
              <div className="relative flex items-center">
                <Input type={show ? 'text' : 'password'} value={pw} onChange={(e) => setPw(e.target.value)} placeholder="••••••••" invalid={!!err.pw} className="pr-12" />
                <IconBtn
                  type="button"
                  label={show ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                  variant="ghost"
                  size="sm"
                  onClick={() => setShow(!show)}
                  className="!absolute right-2.5 top-1/2 -translate-y-1/2 text-brown-soft hover:text-brown"
                >
                  {show ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                </IconBtn>
              </div>
            </Field>
            {reg && <div><Check2 on={agree} onChange={setAgree}>Tôi đồng ý với quy tắc cộng đồng và chính sách bảo mật.</Check2>{err.agree && <p className="mt-1 text-sm font-bold text-coral">{err.agree}</p>}</div>}
            <Btn type="submit" size="lg" full pill disabled={busy} icon={busy ? <Loader2 className="size-5 animate-spin" /> : undefined}>{busy ? 'Đang xử lý…' : reg ? 'Đăng ký' : 'Đăng nhập'}</Btn>
          </form>

          <p className="mt-5 text-center text-sm font-bold">
            {reg ? 'Đã có tài khoản? ' : 'Chưa có tài khoản? '}
            <Btn
              variant="ghost"
              size="sm"
              className="!p-0 !h-auto !border-0 inline underline underline-offset-4 font-bold"
              onClick={() => go(reg ? '/login' : '/register')}
            >
              {reg ? 'Đăng nhập' : 'Đăng ký ngay'}
            </Btn>
          </p>

          <div className="mt-6 space-y-2">
            <Note tone="sky" icon={<ShieldCheck className="size-5 shrink-0" />}>Happy Paws không yêu cầu xác thực khuôn mặt. Chúng tôi chỉ dùng email hoặc tài khoản Google.</Note>
            <div className="rounded-2xl border-2 border-dashed border-brown/40 p-3 text-center">
              <p className="mb-2 text-xs font-extrabold uppercase tracking-wide text-brown-soft">Demo prototype</p>
              <div className="flex gap-2"><Btn size="sm" variant="secondary" className="flex-1" onClick={() => login('user')}>Vào với User</Btn><Btn size="sm" variant="dark" className="flex-1" onClick={() => login('admin')}>Vào với Admin</Btn></div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
