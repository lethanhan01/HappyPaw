import { Siren, MapPin, Sparkles, HeartHandshake, ShieldCheck, ArrowRight, PawPrint } from 'lucide-react'
import { useApp } from '@/store'
import { Btn, IconBtn, Paw } from '@ui'
import pawsImg from '@/assets/paws.png'
import dogHero from '@/assets/dog.jpg'
import puddleApricot from '@/assets/puddle_vang_mo.jpg'

interface HeroSectionProps {
  onReportClick: () => void
}

export default function HeroSection({ onReportClick }: HeroSectionProps) {
  const { auth, go, toast } = useApp()

  const handleMapClick = () => {
    if (auth === 'guest') {
      toast('Vui lòng đăng nhập để xem Bản đồ rada cứu trợ.', 'warn')
      go('/login?redirect=%2Fhome')
    } else {
      go('/home')
    }
  }

  return (
    <section className="relative w-full max-w-full overflow-hidden bg-gradient-to-b from-cream via-cream to-cream-2/50 py-8 sm:py-14 md:py-20 lg:py-24">
      {/* Decorative Paws Background Pattern (desktop/tablet only to prevent horizontal overflow on mobile) */}
      <img
        src={pawsImg}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 -top-16 w-[480px] rotate-12 opacity-20 lg:opacity-25 hidden sm:block"
      />
      <img
        src={pawsImg}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-24 -left-28 w-[400px] -rotate-45 opacity-15 hidden sm:block"
      />

      <div className="relative mx-auto max-w-[1440px] px-3.5 sm:px-6 lg:px-8 w-full">
        <div className="grid items-center gap-8 sm:gap-12 lg:grid-cols-[1.15fr_0.85fr]">
          {/* Left Column: Heading, Value Proposition & CTAs */}
          <div className="flex flex-col items-start space-y-4 sm:space-y-6 text-left">
            {/* Top pill badge */}
            <div className="inline-flex items-center gap-2 rounded-full border-2 border-brown bg-butter px-3 sm:px-4 py-1 sm:py-1.5 shadow-[0_2px_0_var(--color-brown)]">
              <Paw className="size-3.5 sm:size-4 text-brown" />
              <span className="text-[11px] sm:text-sm font-extrabold uppercase tracking-wide text-brown">
                Mạng lưới cứu trợ thú cưng số 1 Hà Nội
              </span>
            </div>

            {/* Main Bubble Typography */}
            <h1 className="bubble text-[28px] sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold leading-[1.1] sm:leading-[1.08] tracking-tight break-words">
              Cùng tìm lại <br className="hidden sm:inline" />
              <span className="bubble-yellow">những chiếc đuôi nhỏ</span> <br />
              & trao yêu thương.
            </h1>

            {/* Subtitle description */}
            <p className="max-w-2xl text-base sm:text-xl font-bold leading-relaxed text-brown/85">
              Hệ thống kết nối cộng đồng thông minh đầu tiên tại Hà Nội giúp định vị thú cưng đi lạc,
              báo cáo ca nguy kịch thời gian thực và liên kết với hơn 42 trạm cứu hộ & phòng khám thú y 24/7.
            </p>

            {/* Main Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2 sm:pt-4 w-full sm:w-auto">
              <Btn
                size="lg"
                variant="danger"
                icon={<Siren className="size-5 sm:size-6 animate-pulse" />}
                onClick={onReportClick}
                className="w-full sm:w-auto shadow-[0_4px_0_var(--color-brown)] hover:shadow-[0_7px_0_var(--color-brown)]"
              >
                Báo ca khẩn cấp ngay
              </Btn>
              <Btn
                size="lg"
                variant="secondary"
                icon={<MapPin className="size-5 text-coral" />}
                onClick={handleMapClick}
                className="w-full sm:w-auto hover:bg-white"
              >
                Khám phá bản đồ cứu trợ
              </Btn>
            </div>

            {/* Quick trust metrics under buttons */}
            <div className="pt-2 sm:pt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs sm:text-sm font-extrabold text-brown-soft">
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
          <div className="relative mx-auto flex w-full max-w-full flex-col items-center justify-center">
            {/* Visual Graphic & Real Pet Showcase Frame */}
            <div className="relative size-60 sm:size-80 lg:size-96 max-w-full flex items-center justify-center">
              {/* Main Pet Portrait (dog.jpg) Edge-to-Edge */}
              <div className="relative size-full overflow-hidden rounded-[32px] sm:rounded-[44px] border-[3px] sm:border-[3.5px] border-brown shadow-[0_8px_0_var(--color-brown)] group bg-paper">
                <img
                  src={dogHero}
                  alt="Chú cún vui vẻ trên nền vàng"
                  className="size-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-brown/70 via-transparent to-transparent p-3 pt-8 text-white">
                  <p className="font-display text-xs sm:text-sm font-extrabold flex items-center gap-1.5 drop-shadow">
                    <PawPrint className="size-3.5" /> Milo · Cocker Spaniel
                  </p>
                </div>
              </div>

              {/* Floating Top-Left Badge: 1.240+ ca đoàn tụ */}
              <div className="absolute -top-2 -left-2 sm:-top-5 sm:-left-5 z-20 rounded-2xl sm:rounded-3xl border-2 border-brown bg-paper px-2.5 sm:px-4 py-1.5 sm:py-2.5 shadow-soft">
                <p className="font-display text-[11px] sm:text-sm font-extrabold text-brown flex items-center gap-1.5">
                  <PawPrint className="size-3 sm:size-3.5 text-coral" /> 1.240+ ca đoàn tụ
                </p>
              </div>

              {/* Floating Mini Pet Card: Bé Bơ (Poodle vàng mơ) */}
              <div className="absolute -bottom-3 -left-2 sm:-bottom-6 sm:-left-6 z-20 flex items-center gap-2 rounded-xl sm:rounded-2xl border-2 border-brown bg-paper p-1.5 sm:p-2 shadow-soft hover:-translate-y-1 transition duration-200">
                <img
                  src={puddleApricot}
                  alt="Bé Bơ Poodle"
                  className="size-9 sm:size-12 rounded-lg sm:rounded-xl object-cover border border-brown"
                />
                <div className="pr-1 sm:pr-2">
                  <p className="font-display text-[11px] sm:text-xs font-extrabold text-brown">Bé Bơ (Poodle)</p>
                  <p className="text-[10px] sm:text-[11px] font-bold text-sage-2">Đoàn tụ sau 4h</p>
                </div>
              </div>

              {/* Floating Bottom-Right Badge: Live Radar */}
              <div className="absolute -bottom-2 -right-2 sm:-bottom-4 sm:-right-4 z-20 rounded-2xl sm:rounded-3xl border-2 border-brown bg-paper px-2.5 sm:px-4 py-1.5 sm:py-2.5 shadow-soft">
                <p className="flex items-center gap-1.5 font-display text-[11px] sm:text-sm font-extrabold text-brown">
                  <span className="size-1.5 sm:size-2 rounded-full bg-sage-2 animate-ping" />
                  Live Radar: Hà Nội
                </p>
              </div>
            </div>

            {/* Floating Live Alert Card */}
            <div className="mt-6 sm:mt-8 flex w-full max-w-md items-center justify-between rounded-2xl sm:rounded-3xl border-2 border-brown bg-paper p-3 sm:p-4 shadow-soft">
              <div className="flex items-center gap-3">
                <span className="grid size-10 sm:size-11 place-items-center rounded-2xl border-2 border-brown bg-coral text-white font-extrabold text-lg shrink-0">
                  <Siren className="size-5 sm:size-6 text-white" />
                </span>
                <div>
                  <p className="font-display text-sm sm:text-base font-extrabold text-brown">Ca mới cần hỗ trợ tại Cầu Giấy</p>
                  <p className="text-[11px] sm:text-xs font-bold text-brown-soft">Phát hiện 8 phút trước · Mèo bị thương</p>
                </div>
              </div>
              <IconBtn
                label="Xem ca trên bản đồ"
                variant="primary"
                size="sm"
                onClick={handleMapClick}
                className="!rounded-full hover:scale-105 shrink-0"
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

