import { useState } from 'react'
import { ArrowRight, Sparkles, UserPlus } from 'lucide-react'
import { useApp } from '@/store'
import { Btn, Badge } from '@/components/ui'
import LandingNav from './components/Nav'
import HeroSection from './components/Hero'
import ImpactStats from './components/Stats'
import RecentCasesFeed from './components/CaseFeed'
import CoreFeatures from './components/Features'
import RescueWorkflow from './components/Workflow'
import SheltersPartners from './components/Shelters'
import SuccessStories from './components/Stories'
import { EmergencySosModal, FloatingSosButton } from './components/Sos'
import LandingFooter from './components/Footer'

export default function LandingPage() {
  const { auth, go, toast } = useApp()
  const [sosOpen, setSosOpen] = useState(false)

  const handleReportAction = () => {
    if (auth === 'guest') {
      toast('Vui lòng đăng nhập để gửi báo cáo cứu hộ hoặc cập nhật thông tin bé.', 'warn')
      go('/login')
    } else {
      go('/report/rescue')
    }
  }

  return (
    <div className="min-h-screen bg-cream text-brown font-sans flex flex-col scroll-smooth selection:bg-butter selection:text-brown">
      {/* 1. Header Navigation Bar */}
      <LandingNav onOpenSos={() => setSosOpen(true)} />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* 2. Hero Section */}
        <HeroSection onReportClick={handleReportAction} />

        {/* 3. Real-time Impact Statistics */}
        <ImpactStats />

        {/* 4. Live Cases & Lost Pets Feed */}
        <RecentCasesFeed />

        {/* 5. 4 Core Technology Pillars */}
        <CoreFeatures />

        {/* 6. 3-Step Action Workflow */}
        <RescueWorkflow onReportClick={handleReportAction} />

        {/* 7. Shelters & 24/7 Clinics Network */}
        <SheltersPartners />

        {/* 8. Success & Reunion Stories */}
        <SuccessStories />

        {/* 9. Final Call-to-Action Community Banner */}
        <section className="py-16 md:py-20 bg-cream">
          <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
            <div className="relative overflow-hidden rounded-[36px] border-[3px] border-brown bg-butter p-8 sm:p-14 shadow-[0_8px_0_var(--color-brown)] text-center">
              <Badge tone="coral" icon={<Sparkles className="size-3.5" />}>
                MỖI HÀNH ĐỘNG ĐỀU CÓ Ý NGHĨA
              </Badge>

              <h2 className="bubble mt-4 text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight">
                Sẵn sàng đồng hành cùng <br />
                <span className="text-white drop-shadow">3.800+ Tình nguyện viên</span>?
              </h2>

              <p className="mt-4 text-base sm:text-xl font-bold text-brown max-w-2xl mx-auto leading-relaxed">
                Tạo tài khoản chỉ trong 1 phút để cùng nhận thông báo cứu trợ quanh khu vực của bạn,
                bảo vệ thú cưng và lan tỏa yêu thương tới những chiếc đuôi nhỏ.
              </p>

              <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                {auth === 'guest' ? (
                  <>
                    <Btn
                      size="lg"
                      variant="danger"
                      icon={<UserPlus className="size-5" />}
                      onClick={() => go('/register')}
                      className="shadow-[0_4px_0_var(--color-brown)] hover:shadow-[0_6px_0_var(--color-brown)]"
                    >
                      Đăng ký tham gia ngay
                    </Btn>
                    <Btn
                      size="lg"
                      variant="secondary"
                      onClick={() => go('/map')}
                      className="hover:bg-white"
                    >
                      Xem bản đồ cứu hộ 🗺️
                    </Btn>
                  </>
                ) : (
                  <Btn
                    size="lg"
                    variant="danger"
                    icon={<ArrowRight className="size-5" />}
                    onClick={() => go(auth === 'admin' ? '/admin/dashboard' : '/home')}
                  >
                    Vào trang chủ ứng dụng ngay
                  </Btn>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* 10. Sticky Floating SOS Button */}
      <FloatingSosButton onClick={() => setSosOpen(true)} />

      {/* 11. Emergency SOS 24/7 Modal */}
      <EmergencySosModal
        open={sosOpen}
        onClose={() => setSosOpen(false)}
        onReportClick={handleReportAction}
      />

      {/* 12. Full Organization Footer */}
      <LandingFooter />
    </div>
  )
}
