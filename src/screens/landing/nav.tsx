import { useState } from 'react'
import { Menu, X, PhoneCall, ArrowRight, LayoutDashboard, Home, MapPin } from 'lucide-react'
import { useApp } from '../../store'
import { Logo, Btn, Avatar } from '../../ui'
import { USERS } from '../../data'

interface LandingNavProps {
  onOpenSos: () => void
}

export default function LandingNav({ onOpenSos }: LandingNavProps) {
  const { auth, go } = useApp()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const me = USERS[0]

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false)
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <header className="sticky top-0 z-50 border-b-2 border-brown/15 bg-cream/95 backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-[1500px] items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Logo onClick={() => go('/')} />

        {/* Desktop Navigation Links */}
        <nav className="hidden items-center gap-1 xl:gap-2 lg:flex" aria-label="Điều hướng chính">
          <button
            onClick={() => go('/map')}
            className="flex items-center gap-1.5 rounded-2xl px-3.5 py-2 text-[15px] font-extrabold text-brown/85 transition hover:bg-butter hover:text-brown"
          >
            <MapPin className="size-4 text-coral" />
            Bản đồ cứu hộ
          </button>
          <button
            onClick={() => scrollToSection('recent-cases')}
            className="rounded-2xl px-3.5 py-2 text-[15px] font-extrabold text-brown/85 transition hover:bg-butter hover:text-brown"
          >
            Ca cứu trợ
          </button>
          <button
            onClick={() => scrollToSection('features')}
            className="rounded-2xl px-3.5 py-2 text-[15px] font-extrabold text-brown/85 transition hover:bg-butter hover:text-brown"
          >
            Tính năng
          </button>
          <button
            onClick={() => scrollToSection('workflow')}
            className="rounded-2xl px-3.5 py-2 text-[15px] font-extrabold text-brown/85 transition hover:bg-butter hover:text-brown"
          >
            Quy trình
          </button>
          <button
            onClick={() => scrollToSection('shelters')}
            className="rounded-2xl px-3.5 py-2 text-[15px] font-extrabold text-brown/85 transition hover:bg-butter hover:text-brown"
          >
            Mạng lưới trạm
          </button>
          <button
            onClick={() => scrollToSection('stories')}
            className="rounded-2xl px-3.5 py-2 text-[15px] font-extrabold text-brown/85 transition hover:bg-butter hover:text-brown"
          >
            Câu chuyện
          </button>
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5">
          {/* Quick Hotline Trigger */}
          <button
            onClick={onOpenSos}
            className="hidden sm:inline-flex items-center gap-2 rounded-2xl border-2 border-coral/30 bg-coral-soft px-3 py-2 text-sm font-extrabold text-[#8f2a1c] transition hover:border-coral hover:bg-coral hover:text-white"
          >
            <PhoneCall className="size-4 animate-bounce-soft" />
            <span>Hotline 24/7</span>
          </button>

          {auth === 'guest' ? (
            <div className="flex items-center gap-2">
              <Btn variant="ghost" size="sm" onClick={() => go('/login')}>
                Đăng nhập
              </Btn>
              <Btn pill variant="primary" size="sm" onClick={() => go('/register')}>
                Tham gia ngay
              </Btn>
            </div>
          ) : (
            <div className="flex items-center gap-2.5">
              <Avatar name={me.name} tone={me.avatar} size={38} />
              <Btn
                pill
                variant="primary"
                size="sm"
                icon={auth === 'admin' ? <LayoutDashboard className="size-4" /> : <Home className="size-4" />}
                onClick={() => go(auth === 'admin' ? '/admin/dashboard' : '/home')}
              >
                {auth === 'admin' ? 'Bảng điều khiển' : 'Vào ứng dụng'}
              </Btn>
            </div>
          )}

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="grid size-11 place-items-center rounded-2xl border-2 border-brown/20 bg-paper text-brown lg:hidden hover:border-brown hover:bg-white"
            aria-label="Mở menu"
          >
            {mobileMenuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="border-b-2 border-brown/15 bg-paper p-4 lg:hidden animate-[rise_.2s_ease-out]">
          <nav className="flex flex-col gap-1.5" aria-label="Menu di động">
            <button
              onClick={() => { setMobileMenuOpen(false); go('/map') }}
              className="flex w-full items-center justify-between rounded-xl px-4 py-3 text-left text-base font-extrabold text-brown hover:bg-butter/50"
            >
              <span className="flex items-center gap-2">
                <MapPin className="size-5 text-coral" />
                Bản đồ cứu trợ trực tiếp (Hà Nội)
              </span>
              <ArrowRight className="size-4 text-brown-soft" />
            </button>
            <button
              onClick={() => scrollToSection('recent-cases')}
              className="flex w-full items-center justify-between rounded-xl px-4 py-3 text-left text-base font-extrabold text-brown hover:bg-butter/50"
            >
              <span>Ca cứu trợ & Thú cưng đi lạc</span>
              <ArrowRight className="size-4 text-brown-soft" />
            </button>
            <button
              onClick={() => scrollToSection('features')}
              className="flex w-full items-center justify-between rounded-xl px-4 py-3 text-left text-base font-extrabold text-brown hover:bg-butter/50"
            >
              <span>Tính năng cốt lõi (Bản đồ & AI Match)</span>
              <ArrowRight className="size-4 text-brown-soft" />
            </button>
            <button
              onClick={() => scrollToSection('workflow')}
              className="flex w-full items-center justify-between rounded-xl px-4 py-3 text-left text-base font-extrabold text-brown hover:bg-butter/50"
            >
              <span>Quy trình 3 bước cứu hộ</span>
              <ArrowRight className="size-4 text-brown-soft" />
            </button>
            <button
              onClick={() => scrollToSection('shelters')}
              className="flex w-full items-center justify-between rounded-xl px-4 py-3 text-left text-base font-extrabold text-brown hover:bg-butter/50"
            >
              <span>Mạng lưới trạm & phòng khám</span>
              <ArrowRight className="size-4 text-brown-soft" />
            </button>
            <button
              onClick={() => scrollToSection('stories')}
              className="flex w-full items-center justify-between rounded-xl px-4 py-3 text-left text-base font-extrabold text-brown hover:bg-butter/50"
            >
              <span>Câu chuyện đoàn tụ</span>
              <ArrowRight className="size-4 text-brown-soft" />
            </button>

            <div className="mt-3 border-t-2 border-line pt-3 flex flex-col gap-2">
              <button
                onClick={() => { setMobileMenuOpen(false); onOpenSos() }}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl border-2 border-coral bg-coral font-extrabold text-white shadow-[0_3px_0_var(--color-brown)]"
              >
                <PhoneCall className="size-5" />
                Hotline Cấp Cứu 24/7
              </button>
              {auth === 'guest' ? (
                <div className="grid grid-cols-2 gap-2 mt-1">
                  <Btn variant="secondary" onClick={() => { setMobileMenuOpen(false); go('/login') }}>
                    Đăng nhập
                  </Btn>
                  <Btn pill variant="primary" onClick={() => { setMobileMenuOpen(false); go('/register') }}>
                    Đăng ký ngay
                  </Btn>
                </div>
              ) : (
                <Btn
                  variant="primary"
                  full
                  onClick={() => { setMobileMenuOpen(false); go(auth === 'admin' ? '/admin/dashboard' : '/home') }}
                >
                  {auth === 'admin' ? 'Bảng điều khiển Admin' : 'Vào ứng dụng Happy Paw'}
                </Btn>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
