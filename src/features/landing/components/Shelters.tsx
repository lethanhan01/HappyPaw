import { useState } from "react"
import {
  Phone,
  Building2,
  Stethoscope,
} from "lucide-react"
import { useApp } from "@/store"
import { SHELTERS, CLINICS } from "@/constants/mock/places"
import { Btn, Badge, Segmented } from "@/components/ui"
import { PlaceCard } from "@/components/common"

export default function SheltersPartners() {
  const { auth, go, toast } = useApp()
  const [tab, setTab] = useState<"shelter" | "clinic">("shelter")

  const handleNavigate = (targetPath: string) => {
    if (auth === "guest") {
      toast("Vui lòng đăng nhập để xem danh bạ chi tiết.", "warn")
      go(`/login?redirect=${encodeURIComponent(targetPath)}`)
    } else {
      go(targetPath)
    }
  }

  const displayedShelters = SHELTERS.slice(0, 4)
  const displayedClinics = CLINICS.filter((c) => c.emergency).slice(0, 4)

  return (
    <section
      id="shelters"
      className="w-full max-w-full overflow-hidden py-12 sm:py-20 md:py-24 bg-paper/70 border-t-2 border-line"
    >
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
              Hệ thống liên kết chính thức với hơn 42 tổ chức tình nguyện và cơ
              sở thú y đạt chuẩn an toàn y tế.
            </p>
          </div>

          <div className="self-start md:self-auto w-full sm:w-auto overflow-x-auto no-scrollbar">
            <Segmented<"shelter" | "clinic">
              value={tab}
              onChange={setTab}
              options={[
                {
                  v: "shelter",
                  label: (
                    <span className="inline-flex items-center gap-1.5">
                      <Building2 className="size-4" />
                      Mái ấm tình nguyện
                    </span>
                  ),
                },
                {
                  v: "clinic",
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
          {(tab === "shelter" ? displayedShelters : displayedClinics).map((place) => (
            <PlaceCard
              key={place.id}
              p={place}
              layout="vertical"
              onOpen={() => handleNavigate(`/${tab === "shelter" ? "shelters" : "clinics"}/${place.id}`)}
              actions={
                <div className="flex items-center justify-between gap-2 pt-1">
                  {"phone" in place && place.phone ? (
                    <a
                      href={`tel:${place.phone.replace(/\s+/g, "")}`}
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-1.5 rounded-xl border-2 border-brown bg-butter px-3 py-1.5 text-xs font-extrabold text-brown transition hover:bg-butter-2"
                    >
                      <Phone className="size-3.5" />
                      {place.phone}
                    </a>
                  ) : <div />}
                  <Btn
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleNavigate(`/${tab === "shelter" ? "shelters" : "clinics"}/${place.id}`)
                    }}
                    className="!p-0 !h-auto !border-0 text-xs font-extrabold text-brown-soft hover:text-brown"
                  >
                    Chi tiết →
                  </Btn>
                </div>
              }
            />
          ))}
        </div>

        {/* View all button */}
        <div className="mt-8 sm:mt-10 text-center">
          <Btn
            variant="secondary"
            onClick={() =>
              handleNavigate(tab === "shelter" ? "/shelters" : "/clinics")
            }
            className="w-full sm:w-auto"
          >
            Xem danh bạ đầy đủ tất cả{" "}
            {tab === "shelter" ? "mái ấm" : "phòng khám"}
          </Btn>
        </div>
      </div>
    </section>
  )
}
