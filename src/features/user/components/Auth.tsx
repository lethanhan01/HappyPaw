import { useState } from 'react'
import { Eye, EyeOff, Loader2, ArrowLeft, User, Shield, Sparkles } from 'lucide-react'
import pawsImg from '@/assets/paws.png'
import puddleApricot from '@/assets/puddle_vang_mo.jpg'
import { useApp } from '@/store'
import { parsePath } from '@/lib'
import { BrandImage, Btn, IconBtn, Check2, Field, Input, Select, Badge } from '@ui'
import { MOCK_USER_ACCOUNT, MOCK_ADMIN_ACCOUNT } from '@/constants/mock/accounts'
import { DISTRICTS } from '@/constants/districts'

const Google = () => (
  <svg viewBox="0 0 24 24" className="size-5" aria-hidden="true">
    <path fill="#4285F4" d="M22.5 12.3c0-.8-.1-1.5-.2-2.2H12v4.2h5.9a5 5 0 0 1-2.2 3.3v2.7h3.6c2.1-1.9 3.2-4.8 3.2-8z" />
    <path fill="#34A853" d="M12 23c3 0 5.5-1 7.3-2.7l-3.6-2.8c-1 .7-2.2 1.1-3.7 1.1-2.9 0-5.3-1.9-6.2-4.5H2.1v2.8A11 11 0 0 0 12 23z" />
    <path fill="#FBBC05" d="M5.8 14.1a6.6 6.6 0 0 1 0-4.2V7.1H2.1a11 11 0 0 0 0 9.8l3.7-2.8z" />
    <path fill="#EA4335" d="M12 5.4c1.6 0 3.1.6 4.2 1.7l3.2-3.2A11 11 0 0 0 2.1 7.1l3.7 2.8C6.7 7.300 9.100 5.400 12 5.400z" />
  </svg>
)

export default function Auth({ mode }: { mode: 'login' | 'register' }) {
  const { path, login, go, toast } = useApp()
  const { query } = parsePath(path)
  const redirectTarget = query.redirect ? decodeURIComponent(query.redirect) : undefined

  const [show, setShow] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [busy, setBusy] = useState(false)
  const [email, setEmail] = useState('')
  const [pw, setPw] = useState('')
  const [confirmPw, setConfirmPw] = useState('')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [district, setDistrict] = useState('')
  const [agree, setAgree] = useState(false)
  const [err, setErr] = useState<Record<string, string>>({})
  const reg = mode === 'register'

  const handleQuickLogin = (role: 'user' | 'admin', accountId: string, label: string) => {
    setBusy(true)
    setTimeout(() => {
      setBusy(false)
      toast(`Đã đăng nhập thành công với vai trò ${label}`)
      login(role, accountId)
    }, 400)
  }

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const er: Record<string, string> = {}
    if (reg) {
      if (!name.trim()) er.name = 'Vui lòng nhập tên hiển thị.'
      if (!phone.trim()) {
        er.phone = 'Vui lòng nhập số điện thoại liên hệ.'
      } else if (!/^0\d{9,10}$/.test(phone.replace(/[\s.-]/g, ''))) {
        er.phone = 'Số điện thoại không hợp lệ (gồm 10 số).'
      }
      if (!district) er.district = 'Vui lòng chọn quận/huyện sinh sống.'
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) er.email = 'Email chưa đúng định dạng.'
    if (pw.length < 6) er.pw = 'Mật khẩu cần ít nhất 6 ký tự.'

    if (reg) {
      if (!confirmPw) {
        er.confirmPw = 'Vui lòng nhập lại mật khẩu xác nhận.'
      } else if (confirmPw !== pw) {
        er.confirmPw = 'Mật khẩu xác nhận không khớp.'
      }
      if (!agree) er.agree = 'Bạn cần đồng ý với quy tắc cộng đồng.'
    }

    setErr(er)
    if (Object.keys(er).length) return
    setBusy(true)
    setTimeout(() => {
      setBusy(false)
      const isAdminEmail = email.toLowerCase().includes('admin')
      const role = isAdminEmail ? 'admin' : 'user'
      const accountId = isAdminEmail ? MOCK_ADMIN_ACCOUNT.id : MOCK_USER_ACCOUNT.id
      toast(reg ? 'Đăng ký thành công! Chào mừng bạn đến với Happy Paws.' : `Đăng nhập thành công với vai trò ${isAdminEmail ? 'Quản trị viên' : 'Thành viên'}`)
      login(role, accountId)
    }, 500)
  }

  const oauth = () => {
    setBusy(true)
    setTimeout(() => {
      setBusy(false)
      login('user', MOCK_USER_ACCOUNT.id)
    }, 600)
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-[1.05fr_1fr]">
      <aside className="relative hidden overflow-hidden bg-butter lg:block">
        <img src={pawsImg} alt="" aria-hidden="true" className="absolute -right-24 -top-10 w-[420px] rotate-12 opacity-30" />
        <div className="relative flex h-full flex-col justify-between p-12">
          <BrandImage className="w-48 xl:w-52" onClick={() => go('/')} />
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
          <div className="mb-5 text-center lg:hidden">
            <BrandImage className="mx-auto w-36 sm:w-44" onClick={() => go('/')} />
          </div>
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
          <p className="mb-4 mt-1 text-brown-soft">{reg ? 'Chỉ mất một phút để tham gia cộng đồng Happy Paws.' : 'Đăng nhập để tiếp tục giúp các bé.'}</p>

          {redirectTarget && (
            <div className="mb-5 rounded-2xl border-2 border-orange/40 bg-orange-soft p-3 text-xs font-extrabold text-orange-dark">
              Vui lòng đăng nhập để tiếp tục truy cập trang bạn vừa chọn.
            </div>
          )}

          {/* 1. FORM ĐĂNG NHẬP / ĐĂNG KÝ BẰNG EMAIL Ở ĐẦU */}
          <form onSubmit={submit} className="space-y-4" noValidate>
            {reg ? (
              <>
                <Field label="Tên hiển thị" error={err.name} required>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Phạm Khánh Linh"
                    invalid={!!err.name}
                  />
                </Field>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <Field label="Email" error={err.email} required>
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="linh@email.com"
                      invalid={!!err.email}
                    />
                  </Field>
                  <Field label="Số điện thoại" error={err.phone} required>
                    <Input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="0912 345 678"
                      invalid={!!err.phone}
                    />
                  </Field>
                </div>

                <Field label="Khu vực sinh sống (Hà Nội)" error={err.district} required>
                  <Select
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className={err.district ? '!border-coral' : undefined}
                  >
                    <option value=""> Chọn quận/huyện bạn sinh sống </option>
                    {DISTRICTS.map((d) => (
                      <option key={d} value={d}>
                        Quận {d}
                      </option>
                    ))}
                  </Select>
                </Field>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <Field label="Mật khẩu" error={err.pw} helper="Ít nhất 6 ký tự." required>
                    <div className="relative flex items-center">
                      <Input
                        type={show ? 'text' : 'password'}
                        value={pw}
                        onChange={(e) => setPw(e.target.value)}
                        placeholder="••••••••"
                        invalid={!!err.pw}
                        className="pr-12"
                      />
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

                  <Field label="Xác nhận mật khẩu" error={err.confirmPw} required>
                    <div className="relative flex items-center">
                      <Input
                        type={showConfirm ? 'text' : 'password'}
                        value={confirmPw}
                        onChange={(e) => setConfirmPw(e.target.value)}
                        placeholder="••••••••"
                        invalid={!!err.confirmPw}
                        className="pr-12"
                      />
                      <IconBtn
                        type="button"
                        label={showConfirm ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowConfirm(!showConfirm)}
                        className="!absolute right-2.5 top-1/2 -translate-y-1/2 text-brown-soft hover:text-brown"
                      >
                        {showConfirm ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                      </IconBtn>
                    </div>
                  </Field>
                </div>

                <div>
                  <Check2 on={agree} onChange={setAgree}>
                    Tôi đồng ý với quy tắc cộng đồng và chính sách bảo mật của Happy Paws.
                  </Check2>
                  {err.agree && <p className="mt-1 text-sm font-bold text-coral">{err.agree}</p>}
                </div>
              </>
            ) : (
              <>
                <Field label="Email" error={err.email} required>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="linh@email.com"
                    invalid={!!err.email}
                  />
                </Field>
                <Field label="Mật khẩu" error={err.pw} required>
                  <div className="relative flex items-center">
                    <Input
                      type={show ? 'text' : 'password'}
                      value={pw}
                      onChange={(e) => setPw(e.target.value)}
                      placeholder="••••••••"
                      invalid={!!err.pw}
                      className="pr-12"
                    />
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
              </>
            )}

            <Btn
              type="submit"
              size="lg"
              full
              pill
              disabled={busy}
              icon={busy ? <Loader2 className="size-5 animate-spin" /> : undefined}
            >
              {busy ? 'Đang xử lý…' : reg ? 'Đăng ký tài khoản' : 'Đăng nhập'}
            </Btn>
          </form>

          {/* 2. PHÂN CÁCH HOẶC */}
          <div className="my-5 flex items-center gap-3 text-xs font-bold text-brown-soft">
            <span className="h-px flex-1 bg-line" />
            {reg ? 'hoặc đăng ký bằng' : 'hoặc tiếp tục với'}
            <span className="h-px flex-1 bg-line" />
          </div>

          {/* 3. NÚT ĐĂNG NHẬP / ĐĂNG KÝ BẰNG GOOGLE */}
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

          {/* 4. ĐĂNG NHẬP NHANH DEMO Ở CUỐI */}
          <div className="mt-5 rounded-2xl border-2 border-line bg-paper/90 p-3.5 shadow-soft">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-black uppercase tracking-wider text-brown-soft flex items-center gap-1.5">
                <Sparkles className="size-3.5 text-orange" />
                {reg ? 'Trải nghiệm nhanh bằng tài khoản Demo' : 'Đăng nhập nhanh Demo'}
              </span>
              <Badge tone="butter">Kiểm thử</Badge>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Btn
                variant="secondary"
                size="sm"
                disabled={busy}
                onClick={() => handleQuickLogin('user', MOCK_USER_ACCOUNT.id, 'Tình nguyện viên')}
                icon={<User className="size-4 text-coral shrink-0" />}
                className="!h-auto !py-2 !px-2.5 !justify-start text-left flex-col !items-start hover:!bg-white"
              >
                <span className="text-xs font-extrabold text-brown leading-none">Tình nguyện viên</span>
                <span className="text-[11px] font-semibold text-brown-soft leading-tight mt-1 truncate max-w-full">{MOCK_USER_ACCOUNT.name}</span>
              </Btn>
              <Btn
                variant="secondary"
                size="sm"
                disabled={busy}
                onClick={() => handleQuickLogin('admin', MOCK_ADMIN_ACCOUNT.id, 'Quản trị viên')}
                icon={<Shield className="size-4 text-plum shrink-0" />}
                className="!h-auto !py-2 !px-2.5 !justify-start text-left flex-col !items-start hover:!bg-white"
              >
                <span className="text-xs font-extrabold text-brown leading-none">Quản trị viên</span>
                <span className="text-[11px] font-semibold text-brown-soft leading-tight mt-1 truncate max-w-full">Admin Dashboard</span>
              </Btn>
            </div>
          </div>

          {/* 5. FOOTER LINK */}
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
        </div>
      </main>
    </div>
  )
}


