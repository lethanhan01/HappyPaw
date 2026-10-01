import { useMemo, useState } from "react"
import {
  ArrowRight,
  Filter,
  MapPin,
  Sparkles,
  Siren,
  Search,
  PawPrint,
  CheckCircle2,
} from "lucide-react"
import { useApp } from "@/store"
import { DISTRICTS } from "@/constants/districts"
import type { Case } from "@/types/case"
import { CaseCard } from "@/components/common"
import { Btn, Chip, Segmented } from "@/components/ui"

type CategoryFilter = "all" | "rescue" | "lost" | "found" | "resolved"

export default function RecentCasesFeed() {
  const { cases, auth, go, toast } = useApp()
  const [category, setCategory] = useState<CategoryFilter>("all")
  const [district, setDistrict] = useState<string>("")

  const handleViewMap = () => {
    if (auth === "guest") {
      toast("Vui lòng đăng nhập để xem Bản đồ cứu trợ.", "warn")
      go("/login?redirect=%2Fhome")
    } else {
      go("/home")
    }
  }

  const handleCaseSelect = (caseId: string) => {
    if (auth === "guest") {
      toast("Vui lòng đăng nhập để xem chi tiết ca cứu trợ này.", "warn")
      go(`/login?redirect=${encodeURIComponent(`/case/${caseId}`)}`)
    } else {
      go(`/case/${caseId}`)
    }
  }

  // Filter cases based on selected category and district
  const filteredCases = useMemo(() => {
    return cases.filter((c: Case) => {
      // Category filter
      if (category === "rescue" && !(c.critical || c.type === "rescue"))
        return false
      if (category === "lost" && c.type !== "lost") return false
      if (category === "found" && c.type !== "found") return false
      if (category === "resolved" && c.status !== "resolved") return false
      if (
        category !== "resolved" &&
        c.status === "resolved" &&
        category !== "all"
      )
        return false

      // District filter
      if (district && c.district !== district) return false

      return true
    })
  }, [cases, category, district])

  const displayedCases = filteredCases.slice(0, 6)

  return (
    <section
      id="recent-cases"
      className="py-12 sm:py-20 md:py-24 bg-cream w-full max-w-full overflow-hidden"
    >
      <div className="mx-auto max-w-[1440px] px-3.5 sm:px-6 lg:px-8 w-full">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 sm:pb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full border-2 border-brown bg-butter px-3 sm:px-3.5 py-1 text-xs font-extrabold text-brown shadow-[0_2px_0_var(--color-brown)]">
              <Sparkles className="size-3.5" />
              CẬP NHẬT THỜI GIAN THỰC
            </div>
            <h2 className="bubble mt-3 text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight break-words">
              Các ca cứu trợ & <br className="hidden sm:inline" />
              <span className="bubble-yellow">Thú cưng cần giúp đỡ</span>
            </h2>
            <p className="mt-2 text-sm sm:text-base md:text-lg font-bold text-brown-soft max-w-xl">
              Danh sách trực tiếp được cộng đồng và các mái ấm cập nhật liên tục
              trên toàn địa bàn Hà Nội.
            </p>
          </div>

          <Btn
            variant="secondary"
            size="md"
            icon={<MapPin className="size-4 text-coral" />}
            onClick={handleViewMap}
            className="self-start md:self-auto hover:bg-white w-full sm:w-auto"
          >
            Mở Bản đồ cứu trợ toàn cảnh
          </Btn>
        </div>

        {/* Filter Controls: Category Tabs */}
        <div className="space-y-4 rounded-3xl border-2 border-line bg-paper/80 p-4 sm:p-5 shadow-soft">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Segmented<CategoryFilter>
              value={category}
              onChange={setCategory}
              options={[
                { v: "all", label: "Tất cả" },
                {
                  v: "rescue",
                  label: (
                    <span className="inline-flex items-center gap-1.5">
                      <Siren className="size-4 text-coral shrink-0" />
                      Cứu hộ khẩn
                    </span>
                  ),
                },
                {
                  v: "lost",
                  label: (
                    <span className="inline-flex items-center gap-1.5">
                      <Search className="size-4 text-orange shrink-0" />
                      Đang thất lạc
                    </span>
                  ),
                },
                {
                  v: "found",
                  label: (
                    <span className="inline-flex items-center gap-1.5">
                      <PawPrint className="size-4 text-brown-soft shrink-0" />
                      Được báo thấy
                    </span>
                  ),
                },
                {
                  v: "resolved",
                  label: (
                    <span className="inline-flex items-center gap-1.5">
                      <CheckCircle2 className="size-4 text-sage-2 shrink-0" />
                      Đã đoàn tụ
                    </span>
                  ),
                },
              ]}
              className="w-full sm:w-auto"
            />

            <span className="text-sm font-extrabold text-brown-soft">
              Tìm thấy{" "}
              <strong className="text-brown">{filteredCases.length}</strong> ca
              phù hợp
            </span>
          </div>

          {/* District Chips (Horizontal scrollable) */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar pt-1 w-full max-w-full min-w-0">
            <span className="flex items-center gap-1 text-xs font-black text-brown-soft uppercase whitespace-nowrap pl-1 pr-2 shrink-0">
              <Filter className="size-3.5" /> Khu vực:
            </span>
            <Chip active={district === ""} onClick={() => setDistrict("")}>
              Tất cả quận
            </Chip>
            {DISTRICTS.map((d) => (
              <Chip
                key={d}
                active={district === d}
                onClick={() => setDistrict(district === d ? "" : d)}
              >
                {d}
              </Chip>
            ))}
          </div>
        </div>

        {/* Cards Grid */}
        <div className="mt-8">
          {displayedCases.length === 0 ? (
            <div className="rounded-[28px] border-2 border-dashed border-brown/30 bg-paper/50 py-12 sm:py-16 text-center px-4">
              <p className="font-display text-xl sm:text-2xl font-extrabold text-brown">
                Chưa có ca nào trong danh mục này
              </p>
              <p className="mt-1 text-xs sm:text-sm font-semibold text-brown-soft">
                Hãy thử đổi quận huyện hoặc chọn danh mục khác nhé.
              </p>
              <div className="mt-4">
                <Btn
                  variant="soft"
                  size="sm"
                  onClick={() => {
                    setCategory("all")
                    setDistrict("")
                  }}
                >
                  Xem tất cả các ca
                </Btn>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {displayedCases.map((c: Case) => (
                <CaseCard
                  key={c.id}
                  c={c}
                  onSelect={() => handleCaseSelect(c.id)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Bottom CTA to View More on Map */}
        <div className="mt-10 sm:mt-12 text-center">
          <Btn
            size="lg"
            variant="primary"
            onClick={handleViewMap}
            className="w-full sm:w-auto shadow-[0_4px_0_var(--color-brown)] hover:shadow-[0_6px_0_var(--color-brown)]"
          >
            Xem tất cả
          </Btn>
        </div>
      </div>
    </section>
  )
}
