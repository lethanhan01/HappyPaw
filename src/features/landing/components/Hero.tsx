import { Siren, MapPin, Sparkles, HeartHandshake, ShieldCheck, ArrowRight } from 'lucide-react'
import { useApp } from '@/store'
import { Btn, DogIllo, CatIllo, Paw } from '@/components/ui'
import pawsImg from '@/assets/paws.png'

interface HeroSectionProps {
  onReportClick: () => void
}

export default function HeroSection({ onReportClick }: HeroSectionProps) {
  const { go } = useApp()

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-cream via-cream to-cream-2/50 py-12 md:py-20 lg:py-24">
      {/* Decorative Paws Background Pattern */}
      <img
        src={pawsImg}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 -top-16 w-[480px] rotate-12 opacity-20 lg:opacity-25"
      />
      <img
        src={pawsImg}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-24 -left-28 w-[400px] -rotate-45 opacity-15"
      />

      <div className="relative mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-[1.15fr_0.85fr]">
          {/* Left Column: Heading, Value Proposition & CTAs */}
          <div className="flex flex-col items-start space-y-6 text-left">
            {/* Top pill badge */}
            <div className="inline-flex items-center gap-2 rounded-full border-2 border-brown bg-butter px-4 py-1.5 shadow-[0_2px_0_var(--color-brown)]">
              <Paw className="size-4 text-brown" />
              <span className="text-xs sm:text-sm font-extrabold uppercase tracking-wide text-brown">
                Mạng lưới cứu trợ thú cưng số 1 tại Hà Nội
              </span>
            </div>

            {/* Main Bubble Typography */}
            <h1 className="bubble text-[40px] sm:text-6xl xl:text-7xl font-extrabold leading-[1.08] tracking-tight">
              Cùng tìm lại <br className="hidden sm:inline" />
              <span className="bubble-yellow">những chiếc đuôi nhỏ</span> <br />
              & trao yêu thương.
            </h1>

            {/* Subtitle description */}
            <p className="max-w-2xl text-lg sm:text-xl font-bold leading-relaxed text-brown/85">
              Hệ thống kết nối cộng đồng thông minh đầu tiên tại Hà Nội giúp định vị thú cưng đi lạc,
              báo cáo ca nguy kịch thời gian thực và liên kết với hơn 42 trạm cứu hộ & phòng khám thú y 24/7.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3.5 pt-2 sm:pt-4 w-full sm:w-auto">
              <Btn
                size="lg"
                variant="danger"
                icon={<Siren className="size-6 animate-pulse" />}
                onClick={onReportClick}
                className="w-full sm:w-auto shadow-[0_5px_0_var(--color-brown)] hover:shadow-[0_7px_0_var(--color-brown)]"
              >
                Báo ca khẩn cấp ngay 🚨
              </Btn>
              <Btn
                size="lg"
                variant="secondary"
                icon={<MapPin className="size-6 text-coral" />}
                onClick={() => go('/map')}
                className="w-full sm:w-auto hover:bg-white"
              >
                Khám phá bản đồ cứu trợ 🗺️
              </Btn>
            </div>

            {/* Quick trust metrics under buttons */}
            <div className="pt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm font-extrabold text-brown-soft">
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck className="size-4 text-sage-2" />
                100% trạm & phòng khám được thẩm định
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Sparkles className="size-4 text-orange" />
                Tốc độ ứng cứu trung bình &lt; 15 phút
              </span>
              <span className="inline-flex items-center gap-1.5">
                <HeartHandshake className="size-4 text-coral" />
                Phi lợi nhuận vì cộng đồng
              </span>
            </div>
          </div>

          {/* Right Column: Visual Graphic & Interactive Mascot Showcase */}
          <div className="relative mx-auto flex w-full max-w-lg flex-col items-center justify-center lg:max-w-none">
            {/* Background circular frame */}
            <div className="relative grid size-72 sm:size-96 place-items-center rounded-[48px] border-[3px] border-brown bg-butter/60 p-6 shadow-[0_8px_0_var(--color-brown)]">
              <div className="absolute -top-5 -left-4 rounded-3xl border-2 border-brown bg-paper px-4 py-2.5 shadow-soft animate-bounce-soft">
                <p className="font-display text-sm font-extrabold text-brown">🐾 1.240+ ca đoàn tụ</p>
              </div>

              <div className="absolute -bottom-4 -right-4 rounded-3xl border-2 border-brown bg-paper px-4 py-2.5 shadow-soft">
                <p className="flex items-center gap-1.5 font-display text-sm font-extrabold text-brown">
                  <span className="size-2 rounded-full bg-sage-2 animate-ping" />
                  Live Radar: 12 Quận Hà Nội
                </p>
              </div>

              {/* Mascots */}
              <div className="flex items-end justify-center gap-4">
                <DogIllo className="size-40 sm:size-52 drop-shadow-md" />
                <CatIllo className="size-36 sm:size-48 drop-shadow-md" />
              </div>
            </div>

            {/* Floating Live Alert Card */}
            <div className="mt-6 flex w-full max-w-md items-center justify-between rounded-3xl border-2 border-brown bg-paper p-4 shadow-soft">
              <div className="flex items-center gap-3">
                <span className="grid size-11 place-items-center rounded-2xl border-2 border-brown bg-coral text-white font-extrabold text-lg">
                  🚨
                </span>
                <div>
                  <p className="font-display text-base font-extrabold text-brown">Ca mới cần hỗ trợ tại Cầu Giấy</p>
                  <p className="text-xs font-bold text-brown-soft">Phát hiện 8 phút trước · Mèo bị thương ở chân</p>
                </div>
              </div>
              <button
                onClick={() => go('/map')}
                className="grid size-9 place-items-center rounded-full border-2 border-brown bg-butter text-brown hover:scale-105 transition"
                aria-label="Xem ca trên bản đồ"
              >
                <ArrowRight className="size-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
