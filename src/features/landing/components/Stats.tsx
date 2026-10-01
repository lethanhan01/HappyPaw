import { HeartHandshake, Building2, Users, Zap } from 'lucide-react'

const STATS = [
  {
    value: '1.240+',
    label: 'Bé đã đoàn tụ an toàn',
    desc: 'Được gia đình đón về hoặc tìm được chủ nhân mới yêu thương',
    tone: 'bg-sage-soft text-[#2f5a22] border-sage',
    icon: HeartHandshake,
  },
  {
    value: '42+',
    label: 'Mái ấm & Phòng khám',
    desc: 'Hệ thống đối tác uy tín có phòng khám thú y 24/7 trực đêm',
    tone: 'bg-sky-soft text-[#1f5873] border-sky',
    icon: Building2,
  },
  {
    value: '3.800+',
    label: 'Tình nguyện viên',
    desc: 'Cộng đồng người yêu chó mèo phủ sóng khắp các quận Hà Nội',
    tone: 'bg-butter text-brown border-butter-2',
    icon: Users,
  },
  {
    value: '< 15 phút',
    label: 'Tốc độ phản hồi trung bình',
    desc: 'Các ca nguy kịch được tình nguyện viên gần nhất tiếp cận ngay',
    tone: 'bg-coral-soft text-[#8f2a1c] border-coral/40',
    icon: Zap,
  },
]

export default function ImpactStats() {
  return (
    <section className="relative z-10 -mt-6 sm:-mt-10 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1440px]">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STATS.map((s) => (
            <div
              key={s.label}
              className="group relative flex flex-col justify-between overflow-hidden rounded-[28px] border-2 border-brown bg-paper p-6 shadow-[0_4px_0_var(--color-brown)] transition hover:-translate-y-1 hover:shadow-[0_8px_0_var(--color-brown)]"
            >
              <div className="flex items-center justify-between">
                <span className={`inline-grid size-12 place-items-center rounded-2xl border-2 ${s.tone}`}>
                  <s.icon className="size-6" />
                </span>
                <span className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-brown">
                  {s.value}
                </span>
              </div>

              <div className="mt-5">
                <h3 className="font-display text-lg font-extrabold text-brown">
                  {s.label}
                </h3>
                <p className="mt-1 text-sm font-semibold text-brown-soft leading-snug">
                  {s.desc}
                </p>
              </div>

              <div className="mt-4 h-1.5 w-12 rounded-full bg-line group-hover:w-full transition-all duration-300" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
