import { useState } from 'react'
import { Phone, MapPin, Star, ArrowRight, PawPrint, Siren, Building2, Stethoscope } from 'lucide-react'
import { useApp } from '@/store'
import { SHELTERS, CLINICS } from '@/constants/mock/places'
import type { Shelter, Clinic } from '@/types/place'
import { Btn, Badge, Verified, Segmented } from '@/components/ui'

export default function SheltersPartners() {
  const { auth, go, toast } = useApp()
  const [tab, setTab] = useState<'shelter' | 'clinic'>('shelter')

  const handleNavigate = (targetPath: string) => {
    if (auth === 'guest') {
      toast('Vui lòng đăng nhập để xem danh bạ chi tiết.', 'warn')
      go(`/login?redirect=${encodeURIComponent(targetPath)}`)
    } else {
      go(targetPath)
    }
  }

  const displayedShelters = SHELTERS.slice(0, 4)
  const displayedClinics = CLINICS.filter((c) => c.emergency).slice(0, 4)

  return (
    <section id="shelters" className="w-full max-w-full overflow-hidden py-12 sm:py-20 md:py-24 bg-paper/70 border-t-2 border-line">
      <div className="mx-auto max-w-[1440px] px-3.5 sm:px-6 lg:px-8 w-full">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 sm:gap-6 pb-6 sm:pb-8">
          <div>
            <Badge tone="sky">MẠNG LƯỚI ĐỐI TÁC HÀ NỘI</Badge>
            <h2 className="bubble mt-3 text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight break-words">
              Mái ấm & Phòng khám <br className="hidden sm:inline" />
              <span className="bubble-yellow">Thú y Cấp cứu 24/7</span>
            </h2>
            <p className="mt-2 text-sm sm:text-base md:text-lg font-bold text-brown-soft max-w-xl leading-relaxed">
              Hệ thống liên kết chính thức với hơn 42 tổ chức tình nguyện và cơ sở thú y đạt chuẩn an toàn y tế.
            </p>
          </div>

          <div className="self-start md:self-auto w-full sm:w-auto overflow-x-auto no-scrollbar">
            <Segmented<'shelter' | 'clinic'>
              value={tab}
              onChange={setTab}
              options={[
                {
                  v: 'shelter',
                  label: (
                    <span className="inline-flex items-center gap-1.5">
                      <Building2 className="size-4" />
                      Mái ấm tình nguyện
                    </span>
                  ),
                },
                {
                  v: 'clinic',
                  label: (
                    <span className="inline-flex items-center gap-1.5">
                      <Stethoscope className="size-4" />
                      Phòng khám 24/7
                    </span>
                  ),
                },
              ]}
              className="w-full sm:w-auto"
            />
          </div>
        </div>

        {/* Content Grid */}
        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {tab === 'shelter'
            ? displayedShelters.map((s: Shelter) => (
              <div
                key={s.id}
                className="flex flex-col justify-between overflow-hidden rounded-[28px] border-2 border-brown bg-paper shadow-[0_4px_0_var(--color-brown)] transition hover:-translate-y-1 hover:shadow-[0_8px_0_var(--color-brown)]"
              >
                <div className="relative h-44 overflow-hidden bg-cream-2">
                  <img src={s.photo} alt={s.name} className="size-full object-cover" />
                  <div className="absolute left-2.5 top-2.5">
                    <Verified label="Đã thẩm định" />
                  </div>
                  {s.urgent && (
                    <span className="absolute right-2.5 top-2.5 rounded-full border-2 border-brown bg-coral px-2.5 py-0.5 text-xs font-black text-white">
                      Cần tiếp tế gấp
                    </span>
                  )}
                </div>

                <div className="flex-1 p-5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-1 text-xs font-bold text-brown-soft">
                      <span className="flex items-center gap-1">
                        <MapPin className="size-3.5 text-coral" />
                        {s.district}
                      </span>
                      <span className="flex items-center gap-0.5 text-amber-600">
                        <Star className="size-3.5 fill-amber-500 text-amber-500" />
                        {s.rating} ({s.reviews})
                      </span>
                    </div>

                    <h3 className="mt-2 font-display text-xl font-extrabold text-brown">
                      {s.name}
                    </h3>
                    <p className="mt-1 line-clamp-2 text-xs font-semibold text-brown-soft">
                      {s.about}
                    </p>

                    <div className="mt-3 rounded-xl bg-cream-2/60 p-2.5 text-xs font-bold text-brown flex items-center gap-1.5">
                      <PawPrint className="size-3.5 text-brown-soft" /> Đang chăm sóc: <strong>{s.pets} bé</strong>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t-2 border-line flex items-center justify-between">
                    <a
                      href={`tel:${s.phone.replace(/\s+/g, '')}`}
                      className="inline-flex items-center gap-1.5 rounded-xl border-2 border-brown bg-butter px-3 py-1.5 text-xs font-extrabold text-brown transition hover:bg-butter-2"
                    >
                      <Phone className="size-3.5" />
                      {s.phone}
                    </a>
                    <Btn
                      variant="ghost"
                      size="sm"
                      onClick={() => handleNavigate('/shelters')}
                      className="!p-0 !h-auto !border-0 text-xs font-extrabold text-brown-soft hover:text-brown"
                    >
                      Chi tiết →
                    </Btn>
                  </div>
                </div>
              </div>
            ))
            : displayedClinics.map((c: Clinic) => (
              <div
                key={c.id}
                className="flex flex-col justify-between overflow-hidden rounded-[28px] border-2 border-brown bg-paper shadow-[0_4px_0_var(--color-brown)] transition hover:-translate-y-1 hover:shadow-[0_8px_0_var(--color-brown)]"
              >
                <div className="relative h-44 overflow-hidden bg-cream-2">
                  <img src={c.photo} alt={c.name} className="size-full object-cover" />
                  <div className="absolute left-2.5 top-2.5">
                    <Badge tone="coral" icon={<Siren className="size-3.5" />}>CẤP CỨU 24/7</Badge>
                  </div>
                  {c.verified && (
                    <div className="absolute right-2.5 top-2.5">
                      <Verified />
                    </div>
                  )}
                </div>

                <div className="flex-1 p-5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-1 text-xs font-bold text-brown-soft">
                      <span className="flex items-center gap-1">
                        <MapPin className="size-3.5 text-coral" />
                        {c.district}
                      </span>
                      <span className="flex items-center gap-0.5 text-amber-600">
                        <Star className="size-3.5 fill-amber-500 text-amber-500" />
                        {c.rating} ({c.reviews})
                      </span>
                    </div>

                    <h3 className="mt-2 font-display text-xl font-extrabold text-brown">
                      {c.name}
                    </h3>
                    <p className="mt-1 line-clamp-1 text-xs font-semibold text-brown-soft">
                      {c.address}
                    </p>

                    <div className="mt-3 flex flex-wrap gap-1">
                      {c.services.slice(0, 3).map((srv, i) => (
                        <span key={i} className="rounded-md bg-sky-soft px-2 py-0.5 text-[11px] font-extrabold text-sky-dark">
                          {srv}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t-2 border-line flex items-center justify-between">
                    <a
                      href={`tel:${c.phone.replace(/\s+/g, '')}`}
                      className="inline-flex items-center gap-1.5 rounded-xl border-2 border-brown bg-coral px-3 py-1.5 text-xs font-extrabold text-white transition hover:bg-coral/90 shadow-[0_2px_0_var(--color-brown)]"
                    >
                      <Phone className="size-3.5" />
                      Gọi cấp cứu
                    </a>
                    <span className="text-xs font-black text-sage-2">
                      {c.hours}
                    </span>
                  </div>
                </div>
              </div>
            ))}
        </div>

        {/* View all button */}
        <div className="mt-8 sm:mt-10 text-center">
          <Btn
            variant="secondary"
            onClick={() => handleNavigate(tab === 'shelter' ? '/shelters' : '/clinics')}
            className="w-full sm:w-auto"
          >
            Xem danh bạ đầy đủ tất cả {tab === 'shelter' ? 'mái ấm' : 'phòng khám'}
          </Btn>
        </div>
      </div>
    </section>
  )
}
