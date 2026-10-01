import { Siren, MapPin, Sparkles, HeartHandshake, ShieldCheck, ArrowRight } from 'lucide-react'
import { useApp } from '@/store'
import { Btn, IconBtn, Paw } from '@ui'
import pawsImg from '@/assets/paws.png'
import dogHero from '@/assets/dog.jpg'
import puddleApricot from '@/assets/puddle_vang_mo.jpg'

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
                icon={<MapPin className="size-5 text-coral" />}
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

          {/* Right Column: Visual Graphic & Real Pet Showcase */}
          <div className="relative mx-auto flex w-full max-w-lg flex-col items-center justify-center lg:max-w-none">
            {/* Visual Graphic & Real Pet Showcase Frame */}
            <div className="relative size-72 sm:size-96 flex items-center justify-center">
              {/* Main Pet Portrait (dog.jpg) Edge-to-Edge */}
              <div className="relative size-full overflow-hidden rounded-[38px] sm:rounded-[44px] border-[3.5px] border-brown shadow-[0_10px_0_var(--color-brown)] group bg-paper">
                <img
                  src={dogHero}
                  alt="Chú cún vui vẻ trên nền vàng"
                  className="size-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-brown/70 via-transparent to-transparent p-3 pt-8 text-white">
                  <p className="font-display text-xs sm:text-sm font-extrabold flex items-center gap-1.5 drop-shadow">
                    🐾 Milo · Cocker Spaniel
                  </p>
                </div>
              </div>

              {/* Floating Top-Left Badge: 1.240+ ca đoàn tụ */}
              <div className="absolute -top-5 -left-5 z-20 rounded-3xl border-2 border-brown bg-paper px-4 py-2.5 shadow-soft animate-bounce-soft">
                <p className="font-display text-xs sm:text-sm font-extrabold text-brown">🐾 1.240+ ca đoàn tụ</p>
              </div>

              {/* Floating Mini Pet Card: Bé Bơ (Poodle vàng mơ) */}
              <div className="absolute -bottom-6 -left-6 z-20 flex items-center gap-2.5 rounded-2xl border-2 border-brown bg-paper p-2 shadow-soft hover:-translate-y-1 transition duration-200">
                <img
                  src={puddleApricot}
                  alt="Bé Bơ Poodle"
                  className="size-11 sm:size-12 rounded-xl object-cover border border-brown"
                />
                <div className="pr-2">
                  <p className="font-display text-xs font-extrabold text-brown">Bé Bơ (Poodle)</p>
                  <p className="text-[11px] font-bold text-sage-2">Đoàn tụ sau 4h 💚</p>
                </div>
              </div>

              {/* Floating Bottom-Right Badge: Live Radar */}
              <div className="absolute -bottom-4 -right-4 z-20 rounded-3xl border-2 border-brown bg-paper px-4 py-2.5 shadow-soft">
                <p className="flex items-center gap-1.5 font-display text-xs sm:text-sm font-extrabold text-brown">
                  <span className="size-2 rounded-full bg-sage-2 animate-ping" />
                  Live Radar: 12 Quận Hà Nội
                </p>
              </div>
            </div>

            {/* Floating Live Alert Card */}
            <div className="mt-8 flex w-full max-w-md items-center justify-between rounded-3xl border-2 border-brown bg-paper p-4 shadow-soft">
              <div className="flex items-center gap-3">
                <span className="grid size-11 place-items-center rounded-2xl border-2 border-brown bg-coral text-white font-extrabold text-lg">
                  🚨
                </span>
                <div>
                  <p className="font-display text-base font-extrabold text-brown">Ca mới cần hỗ trợ tại Cầu Giấy</p>
                  <p className="text-xs font-bold text-brown-soft">Phát hiện 8 phút trước · Mèo bị thương ở chân</p>
                </div>
              </div>
              <IconBtn
                label="Xem ca trên bản đồ"
                variant="primary"
                size="sm"
                onClick={() => go('/map')}
                className="!rounded-full hover:scale-105"
              >
                <ArrowRight className="size-4" />
              </IconBtn>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

