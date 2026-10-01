import { useState } from "react"
import { ArrowRight, Sparkles, UserPlus } from "lucide-react"
import { useApp } from "@/store"
import { Btn, Badge } from "@ui"
import LandingNav from "./components/Nav"
import HeroSection from "./components/Hero"
import ImpactStats from "./components/Stats"
import RecentCasesFeed from "./components/CaseFeed"
import CoreFeatures from "./components/Features"
import RescueWorkflow from "./components/Workflow"
import SheltersPartners from "./components/Shelters"
import SuccessStories from "./components/Stories"
import { EmergencySosModal, FloatingSosButton } from "./components/Sos"
import LandingFooter from "./components/Footer"

export default function LandingPage() {
  const { auth, go, toast } = useApp()
  const [sosOpen, setSosOpen] = useState(false)

  const navigateWithAuth = (targetPath: string) => {
    if (auth === "guest") {
      toast("Vui lòng đăng nhập để sử dụng tính năng này.", "warn")
      go(`/login?redirect=${encodeURIComponent(targetPath)}`)
    } else {
      go(targetPath)
    }
  }

  const handleReportAction = () => {
    if (auth === "guest") {
      toast(
        "Vui lòng đăng nhập để gửi báo cáo cứu hộ hoặc cập nhật thông tin bé.",
        "warn",
      )
      go("/login?redirect=%2Freport%2Frescue")
    } else {
      go("/report/rescue")
    }
  }

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-cream text-brown font-sans flex flex-col scroll-smooth selection:bg-butter selection:text-brown">
      {/* 1. Header Navigation Bar */}
      <LandingNav onOpenSos={() => setSosOpen(true)} />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-full overflow-x-hidden">
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
        <section className="py-12 sm:py-16 md:py-20 bg-cream w-full max-w-full overflow-hidden">
          <div className="mx-auto max-w-[1200px] px-3.5 sm:px-6 lg:px-8 w-full">
            <div className="relative overflow-hidden rounded-[28px] sm:rounded-[36px] border-[2.5px] sm:border-[3px] border-brown bg-butter p-6 sm:p-12 md:p-14 shadow-[0_6px_0_var(--color-brown)] sm:shadow-[0_8px_0_var(--color-brown)] text-center">
              <Badge tone="coral" icon={<Sparkles className="size-3.5" />}>
                MỖI HÀNH ĐỘNG ĐỀU CÓ Ý NGHĨA
              </Badge>

              <h2 className="bubble mt-4 text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight break-words">
                Sẵn sàng đồng hành cùng <br />
                <span className="text-white drop-shadow">
                  3.800+ Tình nguyện viên
                </span>
                ?
              </h2>

              <p className="mt-3 sm:mt-4 text-sm sm:text-lg md:text-xl font-bold text-brown max-w-2xl mx-auto leading-relaxed">
                Tạo tài khoản chỉ trong 1 phút để cùng nhận thông báo cứu trợ
                quanh khu vực của bạn, bảo vệ thú cưng và lan tỏa yêu thương tới
                những chiếc đuôi nhỏ.
              </p>

              <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full sm:w-auto">
                {auth === "guest" ? (
                  <>
                    <Btn
                      size="lg"
                      variant="danger"
                      icon={<UserPlus className="size-5" />}
                      onClick={() => go("/register")}
                      className="w-full sm:w-auto shadow-[0_4px_0_var(--color-brown)] hover:shadow-[0_6px_0_var(--color-brown)]"
                    >
                      Đăng ký tham gia ngay
                    </Btn>
                    <Btn
                      size="lg"
                      variant="secondary"
                      onClick={() => navigateWithAuth("/map")}
                      className="w-full sm:w-auto hover:bg-white"
                    >
                      Xem bản đồ cứu hộ
                    </Btn>
                  </>
                ) : (
                  <Btn
                    size="lg"
                    variant="danger"
                    icon={<ArrowRight className="size-5" />}
                    onClick={() =>
                      go(auth === "admin" ? "/admin/dashboard" : "/home")
                    }
                    className="w-full sm:w-auto"
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
