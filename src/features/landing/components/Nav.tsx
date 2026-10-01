import { useState } from 'react'
import { Menu, X, PhoneCall, ArrowRight, LayoutDashboard, Home, MapPin } from 'lucide-react'
import { useApp } from '@/store'
import { Logo, Btn, IconBtn, Avatar } from '@/components/ui'
import { USERS } from '@/constants/mock/users'

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
          <Btn
            variant="ghost"
            size="sm"
            onClick={() => go('/map')}
            icon={<MapPin className="size-4 text-coral" />}
            className="!rounded-2xl !px-3.5 !py-2 text-[15px] font-extrabold text-brown/85 hover:!bg-butter hover:!text-brown"
          >
            Bản đồ cứu hộ
          </Btn>
          <Btn
            variant="ghost"
            size="sm"
            onClick={() => scrollToSection('recent-cases')}
            className="!rounded-2xl !px-3.5 !py-2 text-[15px] font-extrabold text-brown/85 hover:!bg-butter hover:!text-brown"
          >
            Ca cứu trợ
          </Btn>
          <Btn
            variant="ghost"
            size="sm"
            onClick={() => scrollToSection('features')}
            className="!rounded-2xl !px-3.5 !py-2 text-[15px] font-extrabold text-brown/85 hover:!bg-butter hover:!text-brown"
          >
            Tính năng
          </Btn>
          <Btn
            variant="ghost"
            size="sm"
            onClick={() => scrollToSection('workflow')}
            className="!rounded-2xl !px-3.5 !py-2 text-[15px] font-extrabold text-brown/85 hover:!bg-butter hover:!text-brown"
          >
            Quy trình
          </Btn>
          <Btn
            variant="ghost"
            size="sm"
            onClick={() => scrollToSection('shelters')}
            className="!rounded-2xl !px-3.5 !py-2 text-[15px] font-extrabold text-brown/85 hover:!bg-butter hover:!text-brown"
          >
            Mạng lưới trạm
          </Btn>
          <Btn
            variant="ghost"
            size="sm"
            onClick={() => scrollToSection('stories')}
            className="!rounded-2xl !px-3.5 !py-2 text-[15px] font-extrabold text-brown/85 hover:!bg-butter hover:!text-brown"
          >
            Câu chuyện
          </Btn>
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5">
          {/* Quick Hotline Trigger */}
          <Btn
            variant="danger"
            size="sm"
            icon={<PhoneCall className="size-4 animate-bounce-soft" />}
            onClick={onOpenSos}
            className="hidden sm:inline-flex !bg-coral-soft !border-coral/30 !text-coral-dark hover:!bg-coral hover:!text-white hover:!border-coral shadow-none"
          >
            <span>Hotline 24/7</span>
          </Btn>

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
          <IconBtn
            label={mobileMenuOpen ? 'Đóng menu' : 'Mở menu'}
            size="md"
            variant="default"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden"
          >
            {mobileMenuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
          </IconBtn>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="border-b-2 border-brown/15 bg-paper p-4 lg:hidden animate-[rise_.2s_ease-out]">
          <nav className="flex flex-col gap-1.5" aria-label="Menu di động">
            <Btn
              variant="ghost"
              size="md"
              full
              onClick={() => { setMobileMenuOpen(false); go('/map') }}
              className="!justify-between !rounded-xl !px-4 !py-3 text-left text-base font-extrabold text-brown hover:!bg-butter/50"
            >
              <span className="flex items-center gap-2">
                <MapPin className="size-5 text-coral" />
                Bản đồ cứu trợ trực tiếp (Hà Nội)
              </span>
              <ArrowRight className="size-4 text-brown-soft" />
            </Btn>
            <Btn
              variant="ghost"
              size="md"
              full
              onClick={() => scrollToSection('recent-cases')}
              className="!justify-between !rounded-xl !px-4 !py-3 text-left text-base font-extrabold text-brown hover:!bg-butter/50"
            >
              <span>Ca cứu trợ & Thú cưng đi lạc</span>
              <ArrowRight className="size-4 text-brown-soft" />
            </Btn>
            <Btn
              variant="ghost"
              size="md"
              full
              onClick={() => scrollToSection('features')}
              className="!justify-between !rounded-xl !px-4 !py-3 text-left text-base font-extrabold text-brown hover:!bg-butter/50"
            >
              <span>Tính năng cốt lõi (Bản đồ & AI Match)</span>
              <ArrowRight className="size-4 text-brown-soft" />
            </Btn>
            <Btn
              variant="ghost"
              size="md"
              full
              onClick={() => scrollToSection('workflow')}
              className="!justify-between !rounded-xl !px-4 !py-3 text-left text-base font-extrabold text-brown hover:!bg-butter/50"
            >
              <span>Quy trình 3 bước cứu hộ</span>
              <ArrowRight className="size-4 text-brown-soft" />
            </Btn>
            <Btn
              variant="ghost"
              size="md"
              full
              onClick={() => scrollToSection('shelters')}
              className="!justify-between !rounded-xl !px-4 !py-3 text-left text-base font-extrabold text-brown hover:!bg-butter/50"
            >
              <span>Mạng lưới trạm & phòng khám</span>
              <ArrowRight className="size-4 text-brown-soft" />
            </Btn>
            <Btn
              variant="ghost"
              size="md"
              full
              onClick={() => scrollToSection('stories')}
              className="!justify-between !rounded-xl !px-4 !py-3 text-left text-base font-extrabold text-brown hover:!bg-butter/50"
            >
              <span>Câu chuyện đoàn tụ</span>
              <ArrowRight className="size-4 text-brown-soft" />
            </Btn>

            <div className="mt-3 border-t-2 border-line pt-3 flex flex-col gap-2">
              <Btn
                variant="danger"
                size="md"
                full
                icon={<PhoneCall className="size-5" />}
                onClick={() => { setMobileMenuOpen(false); onOpenSos() }}
                className="!h-12 shadow-[0_3px_0_var(--color-brown)] font-extrabold"
              >
                Hotline Cấp Cứu 24/7
              </Btn>
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
