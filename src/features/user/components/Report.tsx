import { useState } from "react"
import {
  ArrowLeft,
  ArrowRight,
  Siren,
  Search,
  PawPrint,
  MapPin,
  Users,
  Radio,
  Share2,
  Bell,
  Map as MapIcon,
  FileImage,
  Check,
  Footprints,
  Home,
  Stethoscope,
} from "lucide-react"
import UserShell from "@/layouts/UserShell"
import { useApp } from "@/store"
import CityMap, { ME_POS } from "@/features/map"
import { DISTRICTS, DISTRICT_XY, USERS } from "@/constants"
import type { Case } from "@/types"
import {
  Btn,
  IconBtn,
  Card,
  Check2,
  Chip,
  Field,
  Input,
  Note,
  Segmented,
  Select,
  Stepper,
  SuccessScreen,
  Textarea,
  UploadBox,
} from "@ui"
import { cx } from "@/lib"
import dogHero from "@/assets/dog.jpg"
import puddleApricot from "@/assets/puddle_vang_mo.jpg"
import { photo } from "@/constants/photos"

/* ---------- Chooser ---------- */
export function ReportChooser() {
  const { go, back } = useApp()
  const opts = [
    {
      to: "/report/lost",
      icon: Search,
      title: "Tìm thú cưng của tôi bị lạc",
      sub: "Đăng tin, thông báo người quanh khu vực và tạo tờ rơi.",
      tone: "bg-orange-soft",
      img: puddleApricot,
      badge: "Tìm kiếm",
    },
    {
      to: "/report/found",
      icon: PawPrint,
      title: "Tôi vừa thấy một thú cưng bị lạc",
      sub: "Giúp chủ nhân tìm lại bé nhanh hơn.",
      tone: "bg-butter/70",
      img: photo("cat2"),
      badge: "Đã tìm thấy",
    },
    {
      to: "/report/rescue",
      icon: Siren,
      title: "Thú cưng đang cần cứu hộ",
      sub: "Bị thương, mắc kẹt hoặc gặp nguy hiểm. Gửi yêu cầu ngay.",
      tone: "bg-coral-soft",
      img: dogHero,
      urgent: true,
      badge: "Cứu hộ khẩn",
    },
  ]
  return (
    <UserShell>
      <div className="mx-auto max-w-5xl">
        <Btn
          variant="ghost"
          size="sm"
          onClick={back}
          icon={<ArrowLeft className="size-4" />}
          className="mb-3 !h-auto !p-0 !border-0 inline-flex items-center gap-1.5 text-sm font-extrabold text-brown-soft hover:text-brown"
        >
          Quay lại
        </Btn>
        <h1 className="bubble text-center font-display text-4xl font-extrabold md:text-5xl">
          Bạn muốn báo điều gì?
        </h1>
        <p className="mb-8 mt-2 text-center text-brown-soft">
          Chọn một lựa chọn, chúng mình sẽ hướng dẫn từng bước.
        </p>
        <div className="grid gap-5 md:grid-cols-3">
          {opts.map((o) => (
            <Card
              key={o.to}
              hover
              onClick={() => go(o.to)}
              className={cx(
                "group flex flex-col items-center !rounded-[32px] border-2 border-brown p-6 text-center shadow-soft transition hover:-translate-y-1.5 hover:shadow-pop cursor-pointer",
                o.tone,
              )}
            >
              <div className="relative mb-3 size-32 overflow-hidden rounded-2xl border-2 border-brown shadow-sm group-hover:scale-105 transition">
                <img
                  src={o.img}
                  alt={o.title}
                  className="size-full object-cover"
                />
                <span className="absolute bottom-1 right-1 rounded-full bg-paper/95 px-2 py-0.5 text-[10px] font-extrabold text-brown border border-brown">
                  {o.badge}
                </span>
              </div>
              <span className="mt-1 grid size-9 place-items-center rounded-full bg-paper border-2 border-brown">
                <o.icon
                  className={cx(
                    "size-5",
                    o.urgent ? "text-coral" : "text-brown",
                  )}
                />
              </span>
              <h2 className="mt-2 font-display text-2xl font-extrabold leading-tight">
                {o.title}
              </h2>
              <p className="mt-2 text-sm font-semibold text-brown-soft">
                {o.sub}
              </p>
              <span
                className={cx(
                  "mt-5 inline-flex items-center gap-2 rounded-full border-2 border-brown px-5 py-2 font-extrabold",
                  o.urgent ? "bg-coral text-white" : "bg-paper",
                )}
              >
                Bắt đầu <ArrowRight className="size-4" />
              </span>
            </Card>
          ))}
        </div>
      </div>
    </UserShell>
  )
}

/* ---------- Shared pieces ---------- */
function LocationStep({
  district,
  setDistrict,
  ward,
  setWard,
  street,
  setStreet,
  landmark,
  setLandmark,
  pin,
  setPin,
  prompt,
}: any) {
  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <div className="space-y-4">
        <Field label="Quận / huyện" required>
          <Select
            value={district}
            onChange={(e) => {
              setDistrict(e.target.value)
              const xy = DISTRICT_XY[e.target.value]
              if (xy) setPin({ x: xy[0], y: xy[1] })
            }}
          >
            <option value="">Chọn quận / huyện</option>
            {DISTRICTS.map((d) => (
              <option key={d}>{d}</option>
            ))}
          </Select>
        </Field>
        <Field label="Phường">
          <Input
            value={ward}
            onChange={(e) => setWard(e.target.value)}
            placeholder="VD: Dịch Vọng Hậu"
          />
        </Field>
        <Field label="Địa chỉ chi tiết" required>
          <Input
            value={street}
            onChange={(e) => setStreet(e.target.value)}
            placeholder="VD: Đường Trần Thái Tông"
          />
        </Field>
        <Field
          label="Landmark gần đó"
          helper="Giúp mọi người dễ nhận ra vị trí."
        >
          <Input
            value={landmark}
            onChange={(e) => setLandmark(e.target.value)}
            placeholder="VD: Gần công viên Cầu Giấy"
          />
        </Field>
      </div>
      <div>
        <p className="mb-2 flex items-center gap-2 text-sm font-extrabold">
          <MapPin className="size-4 text-coral" />
          {prompt}
        </p>
        <div className="h-80 overflow-hidden rounded-3xl border-2 border-brown lg:h-[390px]">
          <CityMap
            className="size-full"
            me={ME_POS}
            dropPin={pin}
            onMapClick={(x, y) =>
              setPin({ x: Math.round(x), y: Math.round(y) })
            }
            center={pin ? { ...pin, k: 1.4 } : { x: 400, y: 330, k: 1 }}
          />
        </div>
        <p className="mt-2 text-xs font-bold text-brown-soft">
          {pin
            ? "Đã ghim vị trí. Chạm vào bản đồ để chỉnh lại."
            : "Chạm vào bản đồ để ghim vị trí."}
        </p>
      </div>
    </div>
  )
}

function Wizard({
  steps,
  step,
  setStep,
  title,
  children,
  canNext,
  onSubmit,
  submitLabel,
  danger,
  review,
}: any) {
  const { back } = useApp()
  const last = step === steps.length - 1
  return (
    <UserShell>
      <div className="mx-auto max-w-4xl">
        <Btn
          variant="ghost"
          size="sm"
          onClick={back}
          icon={<ArrowLeft className="size-4" />}
          className="!p-0 !h-auto !border-0 mb-2 inline-flex items-center gap-1 text-sm font-extrabold text-brown-soft hover:text-brown"
        >
          Quay lại
        </Btn>
        <h1
          className={cx(
            "mb-4 font-display text-3xl font-extrabold md:text-4xl",
            !danger && "bubble",
          )}
        >
          {title}
        </h1>
        <div
          className="md:hidden"
          aria-label={`Bước ${step + 1}/${steps.length}`}
        >
          <div className="mb-1.5 flex items-center justify-between text-sm font-extrabold">
            <span>
              Bước {step + 1}/{steps.length}
            </span>
            <span className="text-brown-soft">{steps[step]}</span>
          </div>
          <div className="h-2.5 overflow-hidden rounded-full border-2 border-brown bg-cream-2">
            <div
              className="h-full rounded-full bg-butter-2 transition-all"
              style={{ width: `${((step + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>
        <div className="hidden md:block">
          <Stepper steps={steps} current={step} />
        </div>
        <Card className="mt-5 p-5 md:p-8">
          <h2 className="mb-5 font-display text-2xl font-extrabold">
            {steps[step]}
          </h2>
          {children}
          {review}
        </Card>
        <div className="sticky bottom-[76px] z-10 mt-5 flex gap-3 rounded-3xl bg-cream/90 py-2 backdrop-blur-sm lg:bottom-4 [&_button]:min-h-12">
          {step > 0 && (
            <Btn
              variant="secondary"
              size="lg"
              onClick={() => setStep(step - 1)}
              icon={<ArrowLeft className="size-5" />}
            >
              Trước
            </Btn>
          )}
          {last ? (
            <Btn
              variant={danger ? "danger" : "primary"}
              size="lg"
              pill
              className="flex-1"
              onClick={onSubmit}
            >
              {submitLabel}
            </Btn>
          ) : (
            <Btn
              size="lg"
              className="flex-1"
              disabled={!canNext}
              onClick={() => setStep(step + 1)}
            >
              Tiếp tục <ArrowRight className="ml-1 size-5" />
            </Btn>
          )}
        </div>
      </div>
    </UserShell>
  )
}

const newId = (n: number) => `HP-${1060 + n}`
const STOCK = {
  Chó: dogHero,
  Mèo: photo("cat1"),
  Khác: photo("pup"),
} as const

function Species({ v, set }: { v: string; set: (s: any) => void }) {
  const avatars = {
    Chó: puddleApricot,
    Mèo: photo("cat1"),
    Khác: null,
  }
  return (
    <div className="grid grid-cols-3 gap-3">
      {(["Chó", "Mèo", "Khác"] as const).map((s) => (
        <Btn
          key={s}
          type="button"
          variant="ghost"
          size="md"
          full
          onClick={() => set(s)}
          aria-pressed={v === s}
          className={cx(
            "!flex !h-auto !flex-col !items-center !gap-2 !rounded-3xl !border-2 !p-3 font-extrabold transition",
            v === s
              ? "!border-brown !bg-butter shadow-[0_4px_0_var(--color-brown)]"
              : "!border-line !bg-white hover:!border-brown",
          )}
        >
          {avatars[s] ? (
            <img
              src={avatars[s]}
              alt={s}
              className="size-14 rounded-2xl object-cover border border-brown shadow-sm"
            />
          ) : (
            <div className="size-14 rounded-2xl border border-brown bg-peach/40 flex items-center justify-center">
              <PawPrint className="size-7 text-brown" />
            </div>
          )}
          <span>{s}</span>
        </Btn>
      ))}
    </div>
  )
}

function Done({ c, kind }: { c: Case; kind: "lost" | "found" | "rescue" }) {
  const { go, toggleFollow, following, toast } = useApp()
  const notified = kind === "rescue" ? 64 : kind === "lost" ? 128 : 47
  return (
    <UserShell>
      <SuccessScreen
        title={
          kind === "lost"
            ? "Tin tìm bé đã được đăng"
            : kind === "found"
              ? "Cảm ơn bạn đã báo thấy bé"
              : "Yêu cầu cứu hộ đã được gửi"
        }
        species={c.species}
        calm={kind === "rescue"}
      >
        <div className="w-full rounded-3xl border-2 border-brown bg-paper p-5 text-left shadow-soft">
          <div className="grid grid-cols-3 gap-3 text-center">
            <div>
              <p className="text-xs font-bold text-brown-soft">Case ID</p>
              <p className="font-display text-xl font-extrabold">{c.id}</p>
            </div>
            <div>
              <p className="flex items-center justify-center gap-1 text-xs font-bold text-brown-soft">
                <Users className="size-3.5" />
                Đã thông báo
              </p>
              <p className="font-display text-xl font-extrabold">
                {notified} người
              </p>
            </div>
            <div>
              <p className="flex items-center justify-center gap-1 text-xs font-bold text-brown-soft">
                <Radio className="size-3.5" />
                Bán kính
              </p>
              <p className="font-display text-xl font-extrabold">
                {kind === "rescue" ? "3 km" : "5 km"}
              </p>
            </div>
          </div>
        </div>
        {kind === "rescue" && (
          <Note tone="sky">
            Vị trí chính xác được bảo vệ để đảm bảo an toàn cho bé. Chỉ người
            nhận ca mới thấy vị trí chi tiết.
          </Note>
        )}
        <div className="flex w-full flex-col gap-2 sm:flex-row">
          <Btn
            className="flex-1"
            onClick={() => go("/home")}
            icon={<MapIcon className="size-5" />}
          >
            Xem trên bản đồ
          </Btn>
          {kind === "lost" && (
            <Btn
              className="flex-1"
              variant="secondary"
              onClick={() => go(`/case/${c.id}/flyer`)}
              icon={<FileImage className="size-5" />}
            >
              Tạo tờ rơi
            </Btn>
          )}
          <Btn
            className="flex-1"
            variant="secondary"
            onClick={() => {
              toggleFollow(c.id)
              toast(
                following.includes(c.id)
                  ? "Đã bỏ theo dõi"
                  : "Đang theo dõi case này",
              )
            }}
            icon={<Bell className="size-5" />}
          >
            {following.includes(c.id) ? "Đang theo dõi" : "Theo dõi case"}
          </Btn>
        </div>
        <Btn
          variant="ghost"
          size="sm"
          className="!p-0 !h-auto !border-0 text-sm font-extrabold underline underline-offset-4"
          onClick={() => go(`/case/${c.id}`)}
        >
          Xem trang case
        </Btn>
        {kind === "lost" && (
          <div className="w-full rounded-3xl border-2 border-plum bg-plum-soft p-4 text-left">
            <p className="font-display text-lg font-extrabold">
              Smart Match đang quét…
            </p>
            <p className="text-sm font-semibold">
              Chúng mình tìm thấy 3 báo cáo có thể trùng với bé.
            </p>
            <Btn size="sm" className="mt-3" onClick={() => go("/ai-match")}>
              Xem kết quả khớp
            </Btn>
          </div>
        )}
      </SuccessScreen>
    </UserShell>
  )
}

/* ---------- LOST ---------- */
export function LostWizard() {
  const { cases, addCase, me } = useApp()
  const [step, setStep] = useState(0)
  const [done, setDone] = useState<Case | null>(null)
  const [d, set] = useState({
    species: "Chó",
    photos: [] as string[],
    videos: [] as string[],
    avatar: 0,
    date: "2026-10-01",
    time: "19:30",
    district: "",
    ward: "",
    street: "",
    landmark: "",
    name: "",
    breed: "",
    gender: "Đực",
    color: "",
    traits: "",
    weight: "",
    reward: false,
    note: "",
    cname: "Phạm Khánh Linh",
    phone: "",
    useAcc: true,
  })
  const [pin, setPin] = useState<{ x: number; y: number } | null>(null)
  const u = USERS[0]
  const p =
    <K extends keyof typeof d>(k: K) =>
    (v: typeof d[K]) =>
      set({ ...d, [k]: v })
  const steps = [
    "Thông tin chung",
    "Vị trí",
    "Thông tin bé",
    "Liên hệ",
    "Xem lại",
  ]
  const ok = [
    d.photos.length > 0 || true,
    !!d.district && !!d.street,
    !!d.name.trim(),
    d.useAcc || d.phone.length >= 9,
    true,
  ][step]
  if (done) return <Done c={done} kind="lost" />
  const submit = () => {
    const c: Case = {
      id: newId(cases.length - 16),
      name: d.name || "Chưa đặt tên",
      type: "lost",
      species: d.species as any,
      breed: d.breed || "Chưa rõ",
      color: d.color || "Chưa rõ",
      gender: d.gender as any,
      status: "active",
      district: d.district,
      street: d.street,
      x: pin?.x ?? 350,
      y: pin?.y ?? 280,
      minutesAgo: 1,
      updatedAgo: 0,
      desc: d.note || `${d.name} bị lạc gần ${d.landmark || d.street}.`,
      traits: d.traits || "Chưa có mô tả",
      photo: d.photos[d.avatar] || d.photos[0] || STOCK[(d.species as "Chó")],
      photos: d.photos.length > 0 ? d.photos : [d.photos[d.avatar] || STOCK[(d.species as "Chó")]],
      reward: d.reward,
      weight: d.weight,
      reporter: me,
      trail: [
        {
          x: pin?.x ?? 350,
          y: pin?.y ?? 280,
          t: d.time,
          note: `Mất tích tại ${d.district}`,
        },
      ],
    }
    addCase(c)
    setDone(c)
  }
  return (
    <Wizard
      steps={steps}
      step={step}
      setStep={setStep}
      title="Tìm thú cưng bị lạc"
      canNext={ok}
      onSubmit={submit}
      submitLabel="Đăng tin tìm bé"
      review={
        step === 4 && (
          <dl className="grid gap-x-8 gap-y-3 text-sm sm:grid-cols-2">
            {[
              ["Loài", d.species],
              ["Tên bé", d.name],
              ["Giống", d.breed || "—"],
              ["Giới tính", d.gender],
              ["Màu lông", d.color || "—"],
              [
                "Mất tích lúc",
                `${d.time}, ${d.date.split("-").reverse().join("/")}`,
              ],
              ["Khu vực", `${d.district}${d.ward ? ", " + d.ward : ""}`],
              ["Địa chỉ", d.street],
              ["Hậu tạ", d.reward ? "Có" : "Không"],
              [
                "Liên hệ",
                `${d.useAcc ? u.name : d.cname} · ${
                  d.useAcc ? u.phone : d.phone
                }`,
              ],
            ].map(([k, v]) => (
              <div
                key={k}
                className="flex justify-between gap-3 border-b border-line pb-2"
              >
                <dt className="font-bold text-brown-soft">{k}</dt>
                <dd className="text-right font-extrabold">{v}</dd>
              </div>
            ))}
            <div className="sm:col-span-2">
              <dt className="font-bold text-brown-soft">Đặc điểm nhận dạng</dt>
              <dd className="font-semibold">{d.traits || "—"}</dd>
            </div>
          </dl>
        )
      }
    >
      {step === 0 && (
        <div className="space-y-5">
          <Field label="Loại thú cưng">
            <Species v={d.species} set={p("species")} />
          </Field>
          <Field
            label="Ảnh của bé"
            helper="Tải lên 1–5 ảnh. Bấm vào ngôi sao để chọn làm ảnh đại diện tờ rơi."
          >
            <UploadBox
              label="Kéo thả ảnh vào đây"
              max={5}
              files={d.photos}
              onChange={p("photos")}
              primaryIndex={d.avatar}
              onPrimaryChange={p("avatar")}
            />
          </Field>
          <Field label="Video ngắn (tuỳ chọn)">
            <UploadBox
              label="Tải video"
              max={1}
              video
              files={d.videos}
              onChange={p("videos")}
            />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Ngày mất tích">
              <Input
                type="date"
                value={d.date}
                onChange={(e) => p("date")(e.target.value)}
              />
            </Field>
            <Field label="Giờ mất tích">
              <Input
                type="time"
                value={d.time}
                onChange={(e) => p("time")(e.target.value)}
              />
            </Field>
          </div>
        </div>
      )}
      {step === 1 && (
        <LocationStep
          district={d.district}
          setDistrict={p("district")}
          ward={d.ward}
          setWard={p("ward")}
          street={d.street}
          setStreet={p("street")}
          landmark={d.landmark}
          setLandmark={p("landmark")}
          pin={pin}
          setPin={setPin}
          prompt="Vui lòng ghim vị trí nơi bé được nhìn thấy lần cuối."
        />
      )}
      {step === 2 && (
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Tên bé" required>
            <Input
              value={d.name}
              onChange={(e) => p("name")(e.target.value)}
              placeholder="VD: Milo"
            />
          </Field>
          <Field label="Giống">
            <Input
              value={d.breed}
              onChange={(e) => p("breed")(e.target.value)}
              placeholder="VD: Golden Retriever"
            />
          </Field>
          <Field label="Giới tính">
            <Segmented
              value={d.gender}
              onChange={p("gender")}
              options={[
                { v: "Đực", label: "Đực" },
                { v: "Cái", label: "Cái" },
              ]}
            />
          </Field>
          <Field label="Màu lông">
            <Input
              value={d.color}
              onChange={(e) => p("color")(e.target.value)}
              placeholder="VD: Vàng trắng"
            />
          </Field>
          <div className="sm:col-span-2">
            <Field
              label="Đặc điểm nhận dạng"
              helper="Vòng cổ, vết sẹo, tật, dáng đi…"
            >
              <Textarea
                rows={3}
                value={d.traits}
                onChange={(e) => p("traits")(e.target.value)}
              />
            </Field>
          </div>
          <Field label="Cân nặng">
            <Input
              value={d.weight}
              onChange={(e) => p("weight")(e.target.value)}
              placeholder="VD: 28 kg"
            />
          </Field>
          <div className="flex items-end">
            <Check2 on={d.reward} onChange={p("reward")}>
              Có hậu tạ cho người tìm thấy
            </Check2>
          </div>
          <div className="sm:col-span-2">
            <Field label="Lời nhắn thêm">
              <Textarea
                rows={2}
                value={d.note}
                onChange={(e) => p("note")(e.target.value)}
              />
            </Field>
          </div>
        </div>
      )}
      {step === 3 && (
        <div className="max-w-md space-y-4">
          <Check2 on={d.useAcc} onChange={p("useAcc")}>
            Dùng số điện thoại tài khoản ({u.phone})
          </Check2>
          {!d.useAcc && (
            <>
              <Field label="Tên liên hệ">
                <Input
                  value={d.cname}
                  onChange={(e) => p("cname")(e.target.value)}
                />
              </Field>
              <Field label="Số điện thoại" required>
                <Input
                  inputMode="tel"
                  value={d.phone}
                  onChange={(e) => p("phone")(e.target.value)}
                  placeholder="09xx xxx xxx"
                />
              </Field>
            </>
          )}
          <Note tone="sky">
            Số điện thoại chỉ hiển thị cho người đã được bạn đồng ý liên hệ.
          </Note>
        </div>
      )}
    </Wizard>
  )
}

/* ---------- FOUND ---------- */
export function FoundWizard() {
  const { cases, addCase, me } = useApp()
  const [step, setStep] = useState(0)
  const [done, setDone] = useState<Case | null>(null)
  const [d, set] = useState({
    species: "Chó",
    photos: [] as string[],
    district: "",
    ward: "",
    street: "",
    landmark: "",
    cond: "ok",
    where: "stay",
    color: "",
    collar: "",
    breed: "",
    traits: "",
  })
  const [pin, setPin] = useState<{ x: number; y: number } | null>(null)
  const p =
    <K extends keyof typeof d>(k: K) =>
    (v: typeof d[K]) =>
      set({ ...d, [k]: v })
  const steps = ["Loài & hình ảnh", "Vị trí hiện tại", "Tình trạng", "Đặc điểm"]
  const ok = [true, !!d.district && !!d.street, true, true][step]
  if (done) return <Done c={done} kind="found" />
  const conds = [
    {
      v: "ok",
      dotColor: "bg-emerald-500",
      t: "Bình thường / Đang lang thang",
      s: "Bé trông khoẻ và vẫn đi lại bình thường.",
    },
    {
      v: "scared",
      dotColor: "bg-amber-500",
      t: "Rất hoảng sợ / Khó tiếp cận",
      s: "Đừng cố bắt bé. Giữ khoảng cách an toàn.",
    },
    {
      v: "hurt",
      dotColor: "bg-coral",
      t: "Bị thương / Yếu / Cần cứu hộ y tế gấp",
      s: "Chúng mình sẽ chuyển thành ca cứu hộ ưu tiên.",
    },
  ]
  const wheres = [
    { v: "stay", icon: MapPin, t: "Vẫn ở nguyên vị trí" },
    { v: "move", icon: Footprints, t: "Đang di chuyển" },
    { v: "kept", icon: Home, t: "Đã giữ bé lại" },
    { v: "clinic", icon: Stethoscope, t: "Đã gửi ở phòng khám" },
  ]
  const submit = () => {
    const hurt = d.cond === "hurt"
    const c: Case = {
      id: newId(cases.length - 16),
      name: "Chưa rõ tên",
      type: hurt ? "rescue" : "found",
      species: d.species as any,
      breed: d.breed || "Chưa rõ",
      color: d.color || "Chưa rõ",
      gender: "Đực",
      status: "active",
      district: d.district,
      street: d.street,
      x: pin?.x ?? 400,
      y: pin?.y ?? 300,
      minutesAgo: 1,
      updatedAgo: 0,
      desc: `Bé ${d.species.toLowerCase()} ${d.color.toLowerCase()} được báo thấy gần ${d.landmark || d.street}.`,
      traits: d.traits || d.collar || "Chưa có mô tả",
      photo: d.photos[0] || STOCK[(d.species as "Chó")],
      photos: d.photos.length > 0 ? d.photos : [d.photos[0] || STOCK[(d.species as "Chó")]],
      critical: hurt,
      condition: hurt
        ? "Bị thương"
        : d.cond === "scared"
          ? "Hoảng sợ"
          : "Bình thường",
      reporter: me,
    }
    addCase(c)
    setDone(c)
  }
  return (
    <Wizard
      steps={steps}
      step={step}
      setStep={setStep}
      title="Báo thấy một thú cưng"
      canNext={ok}
      onSubmit={submit}
      submitLabel="Gửi báo cáo"
    >
      {step === 0 && (
        <div className="space-y-5">
          <Field label="Loại thú cưng">
            <Species v={d.species} set={p("species")} />
          </Field>
          <Field label="Ảnh / video">
            <UploadBox
              label="Kéo thả ảnh hoặc video"
              max={5}
              files={d.photos}
              onChange={p("photos")}
            />
          </Field>
        </div>
      )}
      {step === 1 && (
        <LocationStep
          district={d.district}
          setDistrict={p("district")}
          ward={d.ward}
          setWard={p("ward")}
          street={d.street}
          setStreet={p("street")}
          landmark={d.landmark}
          setLandmark={p("landmark")}
          pin={pin}
          setPin={setPin}
          prompt="Ghim vị trí hiện tại của bé."
        />
      )}
      {step === 2 && (
        <div className="space-y-6">
          <div className="space-y-3">
            {conds.map(({ v, dotColor, t, s }) => (
              <Btn
                key={v}
                variant="ghost"
                size="md"
                full
                onClick={() => p("cond")(v)}
                aria-pressed={d.cond === v}
                className={cx(
                  "!flex !h-auto w-full !items-start !gap-3.5 !rounded-3xl !border-2 !p-4 text-left transition",
                  d.cond === v
                    ? "!border-brown !bg-butter/70 shadow-[0_4px_0_var(--color-brown)]"
                    : "!border-line !bg-white hover:!border-brown",
                )}
              >
                <span
                  className={cx(
                    "mt-1.5 size-3 shrink-0 rounded-full",
                    dotColor,
                  )}
                />
                <span>
                  <span className="block font-display text-lg font-extrabold">
                    {t}
                  </span>
                  <span className="text-sm font-semibold text-brown-soft">
                    {s}
                  </span>
                </span>
              </Btn>
            ))}
          </div>
          {d.cond === "hurt" && (
            <Note tone="coral" icon={<Siren className="size-5 shrink-0" />}>
              Báo cáo này sẽ được đưa lên bản đồ như một ca cứu hộ khẩn cấp.
            </Note>
          )}
          <Field label="Bé đang ở đâu?">
            <div className="grid grid-cols-2 gap-2">
              {wheres.map(({ v, icon: Icon, t }) => (
                <Chip
                  key={v}
                  active={d.where === v}
                  onClick={() => p("where")(v)}
                >
                  <Icon className="mr-1.5 inline size-4 shrink-0" />
                  {t}
                </Chip>
              ))}
            </div>
          </Field>
        </div>
      )}
      {step === 3 && (
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Màu lông">
            <Input
              value={d.color}
              onChange={(e) => p("color")(e.target.value)}
              placeholder="VD: Trắng, đốm nâu"
            />
          </Field>
          <Field label="Giống (nếu biết)">
            <Input
              value={d.breed}
              onChange={(e) => p("breed")(e.target.value)}
            />
          </Field>
          <Field label="Vòng cổ">
            <Input
              value={d.collar}
              onChange={(e) => p("collar")(e.target.value)}
              placeholder="VD: Vòng đỏ có chuông"
            />
          </Field>
          <div className="sm:col-span-2">
            <Field label="Đặc điểm nhận diện">
              <Textarea
                rows={3}
                value={d.traits}
                onChange={(e) => p("traits")(e.target.value)}
              />
            </Field>
          </div>
        </div>
      )}
    </Wizard>
  )
}

/* ---------- RESCUE ---------- */
export function RescueForm() {
  const { cases, addCase, me } = useApp()
  const [done, setDone] = useState<Case | null>(null)
  const [urgent, setUrgent] = useState<"critical" | "high" | "normal">(
    "critical",
  )
  const [d, set] = useState({
    species: "Chó",
    photos: [] as string[],
    cond: "",
    district: "",
    street: "",
    still: "yes",
    desc: "",
    phone: "0912 *** 345",
  })
  const [pin, setPin] = useState<{ x: number; y: number } | null>(null)
  const [tried, setTried] = useState(false)
  if (done) return <Done c={done} kind="rescue" />
  const bad = !d.district || !d.street || !d.cond
  const submit = () => {
    setTried(true)
    if (bad) return
    const c: Case = {
      id: newId(cases.length - 16),
      name: "Chưa rõ tên",
      type: "rescue",
      species: d.species as any,
      breed: "Chưa rõ",
      color: "Chưa rõ",
      gender: "Đực",
      status: "active",
      district: d.district,
      street: d.street,
      x: pin?.x ?? 400,
      y: pin?.y ?? 300,
      minutesAgo: 1,
      updatedAgo: 0,
      desc: d.desc || d.cond,
      traits: d.cond,
      photo: d.photos[0] || STOCK[(d.species as "Chó")],
      photos: d.photos.length > 0 ? d.photos : [d.photos[0] || STOCK[(d.species as "Chó")]],
      critical: urgent === "critical",
      condition: d.cond,
      reporter: me,
    }
    addCase(c)
    setDone(c)
  }
  const U = [
    ["critical", "Rất khẩn cấp", "Nguy hiểm tính mạng"],
    ["high", "Khẩn cấp", "Cần giúp trong vài giờ"],
    ["normal", "Cần hỗ trợ", "Không nguy cấp ngay"],
  ] as const
  return (
    <UserShell>
      <div className="mx-auto max-w-3xl space-y-5">
        <div className="rounded-[28px] border-2 border-coral bg-coral-soft p-5 md:p-6">
          <div className="flex items-start gap-3">
            <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-coral text-white">
              <Siren className="size-7" />
            </span>
            <div>
              <h1 className="font-display text-3xl font-extrabold leading-tight text-ink">
                Đây là trường hợp khẩn cấp?
              </h1>
              <p className="font-semibold">
                Chọn mức độ để chúng mình ưu tiên thông báo đúng người.
              </p>
            </div>
          </div>
          <div className="mt-4 grid gap-2 sm:grid-cols-3">
            {U.map(([v, t, s]) => (
              <Btn
                key={v}
                variant="ghost"
                size="md"
                full
                onClick={() => setUrgent(v)}
                aria-pressed={urgent === v}
                className={cx(
                  "!flex !h-auto !flex-col !items-start !rounded-2xl !border-2 !p-3 text-left transition",
                  urgent === v
                    ? "!border-ink !bg-ink !text-white"
                    : "!border-coral/40 !bg-white hover:!border-ink",
                )}
              >
                <span className="block font-extrabold">{t}</span>
                <span className="text-xs font-semibold opacity-80">{s}</span>
              </Btn>
            ))}
          </div>
          {urgent === "critical" && (
            <p className="mt-3 text-sm font-bold">
              Nếu bé đang gặp nguy hiểm ngay lúc này, hãy gọi phòng khám gần
              nhất trong khi gửi yêu cầu.
            </p>
          )}
        </div>
        <Card className="space-y-5 p-5 md:p-7">
          <Field label="Loại thú cưng">
            <Species v={d.species} set={(s) => set({ ...d, species: s })} />
          </Field>
          <Field label="Ảnh / video hiện trường">
            <UploadBox
              label="Kéo thả ảnh hoặc video"
              max={4}
              files={d.photos}
              onChange={(f) => set({ ...d, photos: f })}
            />
          </Field>
          <Field
            label="Tình trạng"
            required
            error={tried && !d.cond ? "Vui lòng chọn tình trạng." : undefined}
          >
            <div className="flex flex-wrap gap-2">
              {[
                "Bị xe đâm",
                "Bị thương chảy máu",
                "Kiệt sức / mất nước",
                "Mắc kẹt",
                "Bị bỏ rơi",
                "Bị bạo hành",
              ].map((s) => (
                <Chip
                  key={s}
                  active={d.cond === s}
                  onClick={() => set({ ...d, cond: s })}
                >
                  {s}
                </Chip>
              ))}
            </div>
          </Field>
          <LocationStep
            district={d.district}
            setDistrict={(v: string) => set({ ...d, district: v })}
            ward=""
            setWard={() => {}}
            street={d.street}
            setStreet={(v: string) => set({ ...d, street: v })}
            landmark=""
            setLandmark={() => {}}
            pin={pin}
            setPin={setPin}
            prompt="Ghim vị trí của bé."
          />
          {tried && (!d.district || !d.street) && (
            <p className="text-sm font-bold text-coral">
              Vui lòng chọn quận và nhập địa chỉ.
            </p>
          )}
          <Field label="Bé còn ở đó không?">
            <Segmented
              value={d.still}
              onChange={(v) => set({ ...d, still: v })}
              options={[
                { v: "yes", label: "Còn ở đó" },
                { v: "moving", label: "Đang di chuyển" },
                { v: "unknown", label: "Không chắc" },
              ]}
            />
          </Field>
          <Field label="Mô tả">
            <Textarea
              rows={3}
              value={d.desc}
              onChange={(e) => set({ ...d, desc: e.target.value })}
            />
          </Field>
          <Field label="Liên hệ">
            <Input
              value={d.phone}
              onChange={(e) => set({ ...d, phone: e.target.value })}
            />
          </Field>
          <Note tone="sky">
            Vị trí chính xác của ca nghiêm trọng chỉ hiển thị xấp xỉ cho người
            chưa nhận ca.
          </Note>
          <Btn
            variant="danger"
            size="lg"
            full
            pill
            onClick={submit}
            icon={<Siren className="size-5" />}
          >
            Gửi yêu cầu cứu hộ
          </Btn>
        </Card>
      </div>
      <span className="hidden">
        <Search />
        <Share2 />
      </span>
    </UserShell>
  )
}
