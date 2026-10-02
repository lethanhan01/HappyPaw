import { useMemo, useState, useEffect } from "react"
import {
  Compass,
  Grid,
  Lock,
  Megaphone,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  UserCheck,
} from "lucide-react"
import { useApp } from "@/store"
import CityMap, { ME_POS, type Sel } from "@/features/map"
import { DISTRICTS, DISTRICT_XY, REASONS, USERS } from "@/constants"
import type { Risk } from "@/types"
import type { AlertCategory, AlertSeverity, SafetyAlertStory, SafetyViewMode } from "@/types/safety"
import {
  Btn,
  Card,
  Check2,
  Field,
  FilterBar,
  Input,
  Note,
  PageHead,
  Select,
  Segmented,
  Stepper,
  SuccessScreen,
  Textarea,
  UploadBox,
} from "@ui"
import { cx } from "@/lib"
import { SearchInput } from "@/components/common"
import { SectionTitle } from "./Shared"
import { SafetyAlertCard } from "./SafetyAlertCard"
import { SafetyAlertModal } from "./SafetyAlertModal"

const CATEGORIES: (AlertCategory | "Tất cả")[] = [
  "Tất cả",
  "Bả độc / Đồ ăn lạ",
  "Nghi trộm thú cưng",
  "Lừa đảo tiền cọc / chuộc",
  "Điểm đen tai nạn",
  "Tài khoản khả nghi",
  "Khu vực nguy hiểm",
]

const SEVERITIES: (AlertSeverity | "Tất cả")[] = [
  "Tất cả",
  "Khẩn cấp",
  "Cảnh giác",
  "Đã khắc phục",
]


const TIPS = [
  "Luôn dùng dây dắt (leash) và rọ mõm mềm khi cho thú cưng đi dạo tại các công viên công cộng.",
  "Tuyệt đối KHÔNG chuyển tiền cọc hoặc tiền chuộc khi chưa xác minh video call trực tiếp nhìn thấy bé.",
  "Không chia sẻ vị trí tọa độ cụ thể của thú cưng đang bị thương nặng lên các hội nhóm mở để tránh bị bắt trộm.",
  "Cảnh giác với thức ăn lạ, thịt viên hay xúc xích bỏ sẵn ở các bãi đất trống, thảm cỏ đô thị.",
  "Thấy bất kỳ dấu hiệu khả nghi nào, hãy đăng ngay bài cảnh báo lên Happy Paws để cộng đồng cùng đề phòng.",
]

export function Safety() {
  const {
    go,
    alerts,
    filteredAlerts,
    selectedAlertId,
    setSelectedAlertId,
    modalAlertId,
    setModalAlertId,
    filter,
    setFilter,
    resetFilter,
    viewMode,
    setViewMode,
  } = useApp()

  // Handle URL query for direct alert opening
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const alertParam = params.get("alert")
    if (alertParam) {
      const found = alerts.find((a) => a.id === alertParam)
      if (found) {
        setSelectedAlertId(found.id)
        setModalAlertId(found.id)
      }
    }
  }, [alerts, setSelectedAlertId, setModalAlertId])

  // Map selection state
  const [mapSel, setMapSel] = useState<Sel | null>(null)

  const activeFilterCount = useMemo(() => {
    let count = 0
    if (filter.category !== "Tất cả") count++
    if (filter.district !== "Tất cả") count++
    if (filter.severity !== "Tất cả") count++
    return count
  }, [filter])

  // Synchronize alerts to Map risks
  const alertRisks: Risk[] = useMemo(() => {
    return alerts.map((a) => ({
      id: a.id,
      title: a.title,
      type: a.category,
      x: a.coordinates.x,
      y: a.coordinates.y,
      r: a.coordinates.r || 45,
      severity:
        a.severity === "Khẩn cấp"
          ? "Cao"
          : a.severity === "Cảnh giác"
            ? "Trung bình"
            : "Thấp",
      note: a.excerpt,
      expires: a.expiresAt || "30 ngày tới",
      reports: a.confirmsCount,
    }))
  }, [alerts])

  const pickedAlert = useMemo(
    () => alerts.find((a) => a.id === selectedAlertId || a.id === mapSel?.id),
    [alerts, selectedAlertId, mapSel],
  )

  const activeModalAlert = useMemo(
    () => alerts.find((a) => a.id === modalAlertId),
    [alerts, modalAlertId],
  )


  // When map pin is clicked
  const handleMapSelect = (s: Sel | null) => {
    setMapSel(s)
    if (s?.id) {
      setSelectedAlertId(s.id)
      // Scroll to matching card if in Feed mode
      const el = document.getElementById(`alert-card-${s.id}`)
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" })
      }
    } else {
      setSelectedAlertId(null)
    }
  }

  // When card map focus button is clicked
  const handleFocusMap = (a: SafetyAlertStory) => {
    setSelectedAlertId(a.id)
    setMapSel({ kind: "risk", id: a.id })
    // If in feed mode, switch to map mode to show pin
    if (viewMode === "feed") {
      setViewMode("map")
    }
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Page Header */}
      <div className="rounded-[28px] border-2 border-brown bg-butter/60 p-6 shadow-soft md:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-brown bg-coral-soft px-3 py-1 text-xs font-black text-coral-dark mb-3">
              <ShieldAlert className="size-3.5" />
              <span>BẢN TIN AN TOÀN & CẢNH GIÁC THỦ ĐÔ</span>
            </div>
            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight text-brown">
              Bảo vệ cộng đồng thú cưng
            </h1>
            <p className="mt-2 text-base sm:text-lg font-medium text-brown-2">
              Chia sẻ các điểm nóng bẫy bả, nghi vấn trộm cắp và chiêu trò lừa đảo để cùng nhau bảo vệ các bé luôn bình an.
            </p>
          </div>

          {/* Quick Stats Pill */}
          <div className="flex items-center gap-3 rounded-2xl border-2 border-brown bg-paper p-3 shadow-xs">
            <div className="text-center px-2">
              <span className="block font-display text-2xl font-black text-coral">
                {alerts.filter((a) => a.severity === "Khẩn cấp").length}
              </span>
              <span className="text-[11px] font-bold text-brown-soft">Khẩn cấp</span>
            </div>
            <div className="h-8 w-0.5 bg-line" />
            <div className="text-center px-2">
              <span className="block font-display text-2xl font-black text-brown">
                {alerts.length}
              </span>
              <span className="text-[11px] font-bold text-brown-soft">Cảnh báo</span>
            </div>
          </div>
        </div>

        {/* Dual Call To Actions */}
        <div className="mt-6 flex flex-col sm:flex-row gap-3 pt-4 border-t-2 border-brown/15">
          <Btn
            variant="danger"
            size="lg"
            onClick={() => go("/safety/report?type=alert")}
            icon={<Megaphone className="size-5" />}
            className="flex-1 py-3.5 text-base sm:text-lg font-extrabold rounded-2xl shadow-[0_4px_0_var(--color-brown)] active:translate-y-0.5 active:shadow-none"
          >
            Đăng bài cảnh báo cộng đồng
          </Btn>
          <Btn
            variant="secondary"
            size="lg"
            onClick={() => go("/safety/report?type=report")}
            icon={<Lock className="size-5" />}
            className="sm:w-auto py-3.5 text-base font-extrabold rounded-2xl bg-paper"
          >
            Báo cáo kín tới BQT
          </Btn>
        </div>
      </div>

      {/* Control Bar: View Switcher, Search & Filter Popup */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          {/* View Mode Switcher */}
          <Segmented<SafetyViewMode>
            value={viewMode}
            onChange={setViewMode}
            options={[
              {
                v: "feed",
                label: (
                  <span className="inline-flex items-center gap-1.5 font-extrabold">
                    <Grid className="size-4 shrink-0 text-brown" />
                    <span>Bản tin</span>
                    <span className="rounded-full bg-brown/10 px-1.5 py-0.2 text-[10px] font-black text-brown">
                      {filteredAlerts.length}
                    </span>
                  </span>
                ),
              },
              {
                v: "map",
                label: (
                  <span className="inline-flex items-center gap-1.5 font-extrabold">
                    <Compass className="size-4 shrink-0 text-coral" />
                    <span>Bản đồ</span>
                  </span>
                ),
              },
            ]}
          />

          {/* Search Bar */}
          <div className="flex items-center gap-2 flex-1 sm:max-w-md w-full">
            <SearchInput
              mode="simple"
              value={filter.search}
              onChange={(val) => setFilter({ search: val })}
              placeholder="Tìm theo khu vực, bả độc, lừa đảo…"
              className="flex-1"
            />
          </div>

        </div>

        {/* Unified FilterBar */}
        <FilterBar
          activeCount={activeFilterCount}
          onClear={resetFilter}
          title="Bộ lọc cảnh báo an toàn"
          className="w-full"
        >
          <Select
            value={filter.category}
            onChange={(e) => setFilter({ category: e.target.value as AlertCategory | "Tất cả" })}
            aria-label="Danh mục cảnh báo"
          >
            <option value="Tất cả">Danh mục: Tất cả</option>
            {CATEGORIES.filter((c) => c !== "Tất cả").map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </Select>
          <Select
            value={filter.district}
            onChange={(e) => setFilter({ district: e.target.value })}
            aria-label="Quận / Huyện"
          >
            <option value="Tất cả">Quận: Tất cả</option>
            {DISTRICTS.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </Select>
          <Select
            value={filter.severity}
            onChange={(e) => setFilter({ severity: e.target.value as AlertSeverity | "Tất cả" })}
            aria-label="Mức độ nghiêm trọng"
          >
            <option value="Tất cả">Mức độ: Tất cả</option>
            {SEVERITIES.filter((s) => s !== "Tất cả").map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </Select>
        </FilterBar>
      </div>

      {/* Main Content Area based on View Mode */}
      {viewMode === "feed" && (
        <section>
          {filteredAlerts.length === 0 ? (
            <Card className="text-center py-12 space-y-3">
              <ShieldAlert className="size-12 mx-auto text-brown/30" />
              <h3 className="font-display text-xl font-extrabold text-brown">
                Không tìm thấy cảnh báo phù hợp
              </h3>
              <p className="text-sm font-semibold text-brown-soft max-w-md mx-auto">
                Không có bài viết cảnh báo nào khớp với các tiêu chí tìm kiếm hiện tại của bạn.
              </p>
              <Btn variant="secondary" onClick={resetFilter} className="mt-2">
                Xóa bộ lọc tìm kiếm
              </Btn>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
              {filteredAlerts.map((a) => (
                <div key={a.id} id={`alert-card-${a.id}`}>
                  <SafetyAlertCard
                    alert={a}
                    selected={selectedAlertId === a.id}
                    onFocusMap={() => handleFocusMap(a)}
                    onOpenDetail={() => setModalAlertId(a.id)}
                  />
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {viewMode === "map" && (
        <section className="space-y-4">
          <div className="overflow-hidden rounded-[28px] border-2 border-brown shadow-soft">
            <CityMap
              className="h-[460px] w-full md:h-[580px]"
              risks={alertRisks}
              me={ME_POS}
              selected={mapSel}
              onSelect={handleMapSelect}
              center={
                pickedAlert
                  ? {
                      x: pickedAlert.coordinates.x,
                      y: pickedAlert.coordinates.y,
                      k: 1.35,
                    }
                  : undefined
              }
              focusKey={pickedAlert?.id}
            />
          </div>

          {/* Selected Pin Quick Preview Box */}
          {pickedAlert ? (
            <div className="animate-[rise_.25s_both]">
              <SafetyAlertCard
                alert={pickedAlert}
                selected
                onOpenDetail={() => setModalAlertId(pickedAlert.id)}
              />
            </div>
          ) : (
            <p className="flex items-center justify-center gap-2 text-center text-sm font-extrabold text-brown-soft py-2">
              <Compass className="size-4 text-coral" />
              <span>Nhấp vào bất kỳ vòng tròn cảnh báo nào trên bản đồ để xem chi tiết bài đăng sự việc.</span>
            </p>
          )}
        </section>
      )}


      {/* Safety Tips & Community Privacy Section */}
      <div className="grid gap-5 md:grid-cols-2 pt-4">
        <Card className="space-y-3">
          <SectionTitle sub="Kinh nghiệm từ các trạm cứu hộ & bác sĩ thú y">
            Mẹo phòng ngừa nguy hiểm
          </SectionTitle>
          <ul className="space-y-2.5">
            {TIPS.map((t, i) => (
              <li
                key={i}
                className="flex items-start gap-2.5 text-xs sm:text-sm font-semibold text-brown"
              >
                <ShieldCheck className="mt-0.5 size-4 shrink-0 text-sage-2" />
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </Card>

        <Card className="bg-sky-soft/60 space-y-3">
          <SectionTitle sub="Nguyên tắc bảo vệ nguồn tin & vị trí thú cưng">
            Quyền riêng tư & An toàn
          </SectionTitle>
          <div className="space-y-2 text-xs sm:text-sm font-medium text-brown-2">
            <p className="flex items-start gap-2.5 font-bold text-brown">
              <Lock className="mt-0.5 size-4 shrink-0 text-brown" />
              <span>Bảo vệ vị trí chính xác của thú cưng đang gặp nạn.</span>
            </p>
            <p className="pl-6.5 leading-relaxed">
              Với các ca cứu hộ nguy cấp, bản đồ chỉ hiển thị vùng bán kính xấp xỉ 200m để đề phòng kẻ xấu bắt cóc hoặc gây hại.
            </p>
            <p className="flex items-start gap-2.5 font-bold text-brown pt-1">
              <UserCheck className="mt-0.5 size-4 shrink-0 text-brown" />
              <span>Chế độ đăng ẩn danh cho người báo tin.</span>
            </p>
            <p className="pl-6.5 leading-relaxed">
              Khi tố giác các điểm đen trộm cắp hoặc lò mổ, danh tính của bạn hoàn toàn được giữ kín với người bị báo cáo.
            </p>
          </div>
        </Card>
      </div>

      {/* Safety Alert Detail Modal */}
      <SafetyAlertModal
        alert={activeModalAlert || null}
        open={!!modalAlertId}
        onClose={() => setModalAlertId(null)}
        onFocusMap={
          activeModalAlert
            ? () => {
                handleFocusMap(activeModalAlert)
                setModalAlertId(null)
              }
            : undefined
        }
      />
    </div>
  )
}

/* ---------------- Upgraded Report & Alert Creation Wizard ---------------- */
export function SafetyReport({
  caseId,
  userId,
}: {
  caseId?: string
  userId?: string
}) {
  const { go, toast, addAlert } = useApp()

  // Query parameter to pre-select branch: 'alert' (public post) or 'report' (private moderation report)
  const [reportType, setReportType] = useState<"alert" | "report">(() => {
    const params = new URLSearchParams(window.location.search)
    return params.get("type") === "report" ? "report" : "alert"
  })

  /* --- Public Alert Story State --- */
  const [alertStep, setAlertStep] = useState(0)
  const [title, setTitle] = useState("")
  const [category, setCategory] = useState<AlertCategory>("Bả độc / Đồ ăn lạ")
  const [severity, setSeverity] = useState<AlertSeverity>("Khẩn cấp")
  const [district, setDistrict] = useState<string>("Cầu Giấy")
  const [address, setAddress] = useState("")
  const [fullStory, setFullStory] = useState("")
  const [firstAid, setFirstAid] = useState("")
  const [photos, setPhotos] = useState<string[]>([])
  const [isAnonymous, setIsAnonymous] = useState(false)
  const [createdStoryId, setCreatedStoryId] = useState<string | null>(null)

  /* --- Private Moderation Report State --- */
  const [modStep, setModStep] = useState(0)
  const [reason, setReason] = useState("")
  const [desc, setDesc] = useState("")
  const [files, setFiles] = useState<string[]>([])
  const [okMod, setOkMod] = useState(false)

  const target = USERS.find((u) => u.id === userId)
  const ctx = [
    target && `Người dùng bị báo cáo: ${target.name}`,
    caseId && `Mã case liên quan: ${caseId}`,
  ].filter(Boolean)

  /* --- Submit Public Alert Story --- */
  const handlePublishAlert = () => {
    if (!title.trim() || !address.trim() || !fullStory.trim()) {
      toast("Vui lòng điền đầy đủ tiêu đề, địa chỉ và nội dung cảnh báo.")
      return
    }

    const excerpt =
      fullStory.length > 120 ? `${fullStory.slice(0, 117)}…` : fullStory

    const newStory = addAlert({
      title: title.trim(),
      category,
      severity,
      district,
      address: address.trim(),
      coordinates: {
        x: DISTRICT_XY[district]?.[0] || 450,
        y: DISTRICT_XY[district]?.[1] || 340,
      },
      excerpt,
      fullStory: fullStory.trim(),
      photos,
      author: {
        id: isAnonymous ? "anon" : "me",
        name: isAnonymous ? "Thành viên ẩn danh" : "Bạn",
        isAnonymous,
        isVerified: true,
        role: "Thành viên cộng đồng",
      },
      firstAidAdvice: firstAid.trim()
        ? firstAid.split("\n").filter((t) => t.trim().length > 0)
        : undefined,
    })

    setCreatedStoryId(newStory.id)
    toast("Đã đăng tải bài viết cảnh báo thành công!")
  }

  // Celebratory Screen for Public Alert Post
  if (createdStoryId) {
    return (
      <SuccessScreen
        calm
        title="Bài viết cảnh báo đã được xuất bản lên Cộng đồng!"
      >
        <p className="text-brown-2 max-w-md mx-auto">
          Cảm ơn bạn đã kịp thời chia sẻ thông tin. Bài viết của bạn đã xuất hiện trên Bản tin Cảnh giác và được ghim vị trí lên Bản đồ để bà con nuôi pet cùng phòng tránh.
        </p>
        <div className="mt-4 flex flex-wrap justify-center gap-3">
          <Btn onClick={() => go(`/safety?alert=${createdStoryId}`)}>
            Xem bài viết vừa đăng
          </Btn>
          <Btn variant="secondary" onClick={() => go("/safety")}>
            Về Bản tin Cảnh báo
          </Btn>
        </div>
      </SuccessScreen>
    )
  }

  // Celebratory Screen for Private Moderation Report
  if (okMod) {
    return (
      <SuccessScreen calm title="Báo cáo đã được gửi tới đội ngũ Happy Paws.">
        <p className="text-brown-2 max-w-md mx-auto">
          Chúng tôi sẽ xem xét và xử lý tài khoản vi phạm trong thời gian sớm nhất. Danh tính của bạn được giữ bí mật tuyệt đối.
        </p>
        <div className="mt-4 flex flex-wrap justify-center gap-3">
          <Btn onClick={() => go("/home")}>Về trang chủ</Btn>
          <Btn variant="secondary" onClick={() => go("/safety")}>
            Xem cảnh báo an toàn
          </Btn>
        </div>
      </SuccessScreen>
    )
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <PageHead
        title="Tạo Cảnh báo / Báo cáo"
        sub="Cung cấp thông tin chuẩn xác để bảo vệ an toàn cho thú cưng và cộng đồng."
        back={() => history.back()}
      />

      {/* Target User context if reporting specific account */}
      {ctx.length > 0 && (
        <Note tone="ink" icon={<ShieldAlert className="size-5 shrink-0" />}>
          {ctx.join(" · ")}
        </Note>
      )}

      {/* Branch Selector Tabs */}
      <div className="grid grid-cols-2 gap-2 rounded-2xl border-2 border-brown bg-paper p-1 shadow-xs">
        <Btn
          variant={reportType === "alert" ? "primary" : "ghost"}
          onClick={() => setReportType("alert")}
          className={cx(
            "flex flex-col items-center justify-center gap-1 h-auto py-3 px-2 text-center rounded-xl",
            reportType === "alert" && "border-2 border-brown bg-butter shadow-xs",
          )}
        >
          <span className="flex items-center gap-1.5 font-display text-sm sm:text-base font-extrabold text-brown">
            <Megaphone className="size-4 text-coral" />
            Đăng cảnh báo cộng đồng
          </span>
          <span className="text-[11px] font-semibold text-brown-soft hidden sm:inline">
            Chia sẻ công khai câu chuyện & bằng chứng
          </span>
        </Btn>

        <Btn
          variant={reportType === "report" ? "primary" : "ghost"}
          onClick={() => setReportType("report")}
          className={cx(
            "flex flex-col items-center justify-center gap-1 h-auto py-3 px-2 text-center rounded-xl",
            reportType === "report" && "border-2 border-brown bg-butter shadow-xs",
          )}
        >
          <span className="flex items-center gap-1.5 font-display text-sm sm:text-base font-extrabold text-brown">
            <Lock className="size-4 text-brown" />
            Báo cáo kín tới BQT
          </span>
          <span className="text-[11px] font-semibold text-brown-soft hidden sm:inline">
            Tố cáo tài khoản lừa đảo, giả mạo
          </span>
        </Btn>
      </div>

      {/* ================= PATH 1: PUBLIC COMMUNITY ALERT STORY ================= */}
      {reportType === "alert" && (
        <div className="space-y-5">
          <Stepper
            steps={["Danh mục", "Địa điểm & Tiêu đề", "Nội dung", "Ảnh & Xuất bản"]}
            current={alertStep}
          />

          <Card className="space-y-5 p-5 sm:p-7">
            {/* Step 0: Category & Severity */}
            {alertStep === 0 && (
              <div className="space-y-4">
                <h2 className="font-display text-xl font-extrabold text-brown">
                  Chọn danh mục rủi ro & mức độ khẩn cấp
                </h2>

                <Field label="Danh mục nguy cơ" helper="Chọn loại rủi ro sát nhất với thực tế">
                  <div className="grid gap-2 sm:grid-cols-2">
                    {CATEGORIES.filter((c) => c !== "Tất cả").map((c) => (
                      <Btn
                        key={c}
                        variant={category === c ? "primary" : "ghost"}
                        onClick={() => setCategory(c as AlertCategory)}
                        className={cx(
                          "rounded-2xl border-2 px-4 py-3 h-auto text-left font-extrabold text-sm justify-start",
                          category === c
                            ? "border-brown bg-butter text-brown shadow-xs"
                            : "border-line bg-paper text-brown hover:border-brown/60",
                        )}
                      >
                        {c}
                      </Btn>
                    ))}
                  </div>
                </Field>

                <Field label="Mức độ khẩn cấp">
                  <div className="flex gap-2">
                    {(["Khẩn cấp", "Cảnh giác"] as AlertSeverity[]).map((s) => (
                      <Btn
                        key={s}
                        variant="ghost"
                        onClick={() => setSeverity(s)}
                        className={cx(
                          "flex-1 rounded-xl border-2 py-2.5 h-auto text-center font-extrabold text-sm",
                          severity === s
                            ? s === "Khẩn cấp"
                              ? "border-coral bg-coral-soft text-coral-dark"
                              : "border-brown bg-butter text-brown"
                            : "border-line bg-paper text-brown-soft hover:border-brown/50",
                        )}
                      >
                        {s}
                      </Btn>
                    ))}
                  </div>
                </Field>
              </div>
            )}

            {/* Step 1: Title & Location */}
            {alertStep === 1 && (
              <div className="space-y-4">
                <h2 className="font-display text-xl font-extrabold text-brown">
                  Tiêu đề và Vị trí xảy ra sự việc
                </h2>

                <Field
                  label="Tiêu đề bài viết cảnh báo"
                  helper="Nêu vắn tắt sự việc và địa điểm (Ví dụ: Phát hiện bả độc gần cổng trường học...)"
                >
                  <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Nhập tiêu đề ngắn gọn, cảnh giác…"
                    className="h-11 sm:h-12 rounded-2xl border-2 border-line bg-paper px-4 font-bold text-sm text-brown shadow-xs focus:border-brown focus:ring-4 focus:ring-butter/70"
                  />
                </Field>

                <div className="grid gap-3 sm:grid-cols-2">
                  <Field label="Quận / Huyện">
                    <Select
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      className="w-full h-11 sm:h-12 rounded-2xl border-2 border-line bg-paper px-4 font-bold text-sm text-brown shadow-xs focus:border-brown focus:ring-4 focus:ring-butter/70"
                    >
                      {DISTRICTS.map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </Select>
                  </Field>

                  <Field label="Địa chỉ cụ thể" helper="Tên đường, số ngõ, công viên hoặc tòa nhà">
                    <Input
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Ví dụ: Vườn hoa Nghĩa Đô, phố Nguyễn Văn Huyên"
                      className="h-11 sm:h-12 rounded-2xl border-2 border-line bg-paper px-4 font-bold text-sm text-brown shadow-xs focus:border-brown focus:ring-4 focus:ring-butter/70"
                    />
                  </Field>
                </div>
              </div>
            )}

            {/* Step 2: Story Description & Advice */}
            {alertStep === 2 && (
              <div className="space-y-4">
                <h2 className="font-display text-xl font-extrabold text-brown">
                  Diễn biến sự việc & Lời khuyên
                </h2>

                <Field
                  label="Diễn biến chi tiết vụ việc"
                  helper="Thời gian diễn ra, dấu hiệu đối tượng, đặc điểm thức ăn lạ hoặc kịch bản lừa đảo..."
                >
                  <Textarea
                    rows={5}
                    value={fullStory}
                    onChange={(e) => setFullStory(e.target.value)}
                    placeholder="Kể rõ những gì bạn đã thấy hoặc trải qua để mọi người cùng cảnh giác…"
                  />
                </Field>

                <Field
                  label="Lời khuyên hoặc Hướng dẫn sơ cứu (Không bắt buộc)"
                  helper="Mỗi dòng là một lời khuyên cho cộng đồng"
                >
                  <Textarea
                    rows={3}
                    value={firstAid}
                    onChange={(e) => setFirstAid(e.target.value)}
                    placeholder="Ví dụ: Mang theo nước muối kích nôn; Tuyệt đối không chuyển tiền cọc…"
                  />
                </Field>
              </div>
            )}

            {/* Step 3: Photos & Anonymous Setting */}
            {alertStep === 3 && (
              <div className="space-y-4">
                <h2 className="font-display text-xl font-extrabold text-brown">
                  Hình ảnh bằng chứng & Tùy chọn ẩn danh
                </h2>

                <UploadBox
                  label="Tải lên ảnh hiện trường, bả độc, tin nhắn lừa đảo"
                  files={photos}
                  onChange={setPhotos}
                />

                <div className="rounded-2xl border-2 border-line bg-cream/40 p-4">
                  <Check2 on={isAnonymous} onChange={setIsAnonymous}>
                    <div>
                      <span className="block font-extrabold text-sm text-brown">
                        Đăng dưới dạng Cư dân ẩn danh
                      </span>
                      <span className="block text-xs font-semibold text-brown-soft">
                        Tên tài khoản và avatar của bạn sẽ được ẩn đi để đảm bảo an toàn tuyệt đối.
                      </span>
                    </div>
                  </Check2>
                </div>

                <div className="rounded-2xl bg-butter/40 p-4 text-xs font-bold text-brown space-y-1">
                  <p className="flex items-center gap-1.5 text-brown font-extrabold">
                    <Sparkles className="size-4 text-coral" />
                    Bản tin cảnh báo sẽ được xuất bản công khai ngay lập tức
                  </p>
                  <p className="text-brown-soft leading-relaxed">
                    Bài viết của bạn sẽ cắm ghim vị trí lên Bản đồ và hiển thị tại Bản tin để mọi người cùng chung tay xác nhận.
                  </p>
                </div>
              </div>
            )}

            {/* Wizard Navigation */}
            <div className="flex items-center justify-between gap-3 pt-3 border-t-2 border-line">
              <Btn
                variant="ghost"
                onClick={() =>
                  alertStep > 0 ? setAlertStep(alertStep - 1) : go("/safety")
                }
              >
                {alertStep > 0 ? "Quay lại" : "Hủy bỏ"}
              </Btn>

              {alertStep < 3 ? (
                <Btn
                  variant="dark"
                  onClick={() => setAlertStep(alertStep + 1)}
                  disabled={
                    (alertStep === 1 && (!title.trim() || !address.trim())) ||
                    (alertStep === 2 && !fullStory.trim())
                  }
                >
                  Tiếp tục
                </Btn>
              ) : (
                <Btn
                  variant="danger"
                  onClick={handlePublishAlert}
                  className="font-extrabold shadow-[0_4px_0_var(--color-brown)] active:translate-y-0.5 active:shadow-none"
                >
                  Xuất bản bài viết cảnh báo
                </Btn>
              )}
            </div>
          </Card>
        </div>
      )}

      {/* ================= PATH 2: PRIVATE MODERATION REPORT ================= */}
      {reportType === "report" && (
        <div className="space-y-5">
          <Stepper
            steps={["Lý do", "Mô tả", "Bằng chứng", "Xác nhận"]}
            current={modStep}
          />
          <Card className="space-y-4 p-5 sm:p-7">
            {modStep === 0 && (
              <>
                <h2 className="font-display text-xl font-extrabold text-brown">
                  Chọn lý do báo cáo vi phạm
                </h2>
                <div
                  className="grid gap-2 sm:grid-cols-2"
                  role="radiogroup"
                  aria-label="Lý do báo cáo"
                >
                  {REASONS.map((r) => (
                    <Btn
                      key={r}
                      variant="ghost"
                      role="radio"
                      aria-checked={reason === r}
                      onClick={() => setReason(r)}
                      className={cx(
                        "rounded-2xl border-2 px-4 py-3 h-auto text-left font-bold text-sm justify-start",
                        reason === r
                          ? "border-brown bg-butter text-brown shadow-xs"
                          : "border-line bg-white text-brown hover:border-brown/60",
                      )}
                    >
                      {r}
                    </Btn>
                  ))}
                </div>
              </>
            )}

            {modStep === 1 && (
              <>
                <h2 className="font-display text-xl font-extrabold text-brown">
                  Mô tả hành vi sai phạm
                </h2>
                <Field
                  label="Chuyện gì đã xảy ra?"
                  helper="Nêu rõ thời gian, nội dung tin nhắn đe dọa, lừa tiền hoặc hành vi ngược đãi."
                >
                  <Textarea
                    rows={4}
                    value={desc}
                    onChange={(e) => setDesc(e.target.value)}
                    placeholder="Mô tả cụ thể sự việc…"
                  />
                </Field>
              </>
            )}

            {modStep === 2 && (
              <>
                <h2 className="font-display text-xl font-extrabold text-brown">
                  Tải lên bằng chứng xác thực
                </h2>
                <UploadBox
                  label="Ảnh chụp màn hình tin nhắn, biên lai chuyển tiền, bằng chứng liên quan"
                  files={files}
                  onChange={setFiles}
                />
              </>
            )}

            {modStep === 3 && (
              <>
                <h2 className="font-display text-xl font-extrabold text-brown">
                  Kiểm tra lại thông tin tố cáo
                </h2>
                <dl className="space-y-2 rounded-2xl bg-cream-2/70 p-4 text-sm">
                  <div>
                    <dt className="font-extrabold text-brown-soft">Lý do báo cáo</dt>
                    <dd className="font-bold text-brown">{reason}</dd>
                  </div>
                  <div>
                    <dt className="font-extrabold text-brown-soft">Nội dung mô tả</dt>
                    <dd className="text-brown">{desc || "Không có"}</dd>
                  </div>
                  <div>
                    <dt className="font-extrabold text-brown-soft">Tệp bằng chứng đính kèm</dt>
                    <dd className="font-bold text-brown">{files.length} tệp</dd>
                  </div>
                </dl>
                <p className="text-xs font-semibold text-brown-soft">
                  * Báo cáo sai sự thật có thể dẫn đến việc tài khoản của bạn bị cảnh cáo hoặc khóa vĩnh viễn.
                </p>
              </>
            )}

            <div className="flex justify-between gap-3 pt-3 border-t-2 border-line">
              <Btn
                variant="ghost"
                onClick={() =>
                  modStep > 0 ? setModStep(modStep - 1) : go("/safety")
                }
              >
                {modStep > 0 ? "Quay lại" : "Hủy"}
              </Btn>
              <Btn
                variant="dark"
                disabled={modStep === 0 && !reason}
                onClick={() => {
                  if (modStep < 3) {
                    setModStep(modStep + 1)
                  } else {
                    setOkMod(true)
                    toast("Báo cáo vi phạm đã được gửi tới Ban Quản Trị.")
                  }
                }}
              >
                {modStep === 3 ? "Gửi báo cáo kín" : "Tiếp tục"}
              </Btn>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
