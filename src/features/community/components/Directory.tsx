import { useMemo, useState } from "react"
import {
  Clock,
  Globe,
  HandHeart,
  List,
  MapPin,
  Navigation,
  Phone,
  Star,
  Map as MapIcon,
  Siren,
} from "lucide-react"
import { useApp } from "@/store"
import CityMap, { ME_POS, type Sel } from "@/features/map"
import { CLINICS, DISTRICTS, SHELTERS } from "@/constants"
import type { Clinic, Place, Shelter } from "@/types"
import {
  Avatar,
  Badge,
  Btn,
  Card,
  Chip,
  Empty,
  PageHead,
  Segmented,
  Select,
  Stars,
  Verified,
  Note,
} from "@ui"
import { cx } from "@/lib"
import { RatingModal, SectionTitle, routeTo } from "./Shared"

type Kind = "shelter" | "clinic"
const isShelter = (p: Place): p is Shelter => "needs" in p

const REVIEWS = [
  {
    name: "Nguyễn Thu Trang",
    stars: 5,
    ago: "2 ngày trước",
    text: "Các bạn tình nguyện viên rất nhiệt tình, tận tâm với từng bé. Mình đến thăm thấy chỗ ở sạch sẽ, các bé được chăm sóc tốt.",
  },
  {
    name: "Lê Anh Tuấn",
    stars: 5,
    ago: "1 tuần trước",
    text: "Mình mang bé mèo bị thương đến lúc tối muộn vẫn được tiếp nhận ngay. Cảm ơn mọi người rất nhiều.",
  },
  {
    name: "Phạm Hồng Nhung",
    stars: 4,
    ago: "2 tuần trước",
    text: "Địa chỉ hơi khó tìm trong ngõ nhưng mọi người hướng dẫn qua điện thoại rất kỹ. Sẽ ghé lại ủng hộ.",
  },
  {
    name: "Đỗ Minh Khôi",
    stars: 4,
    ago: "1 tháng trước",
    text: "Thông tin minh bạch, có cập nhật hình ảnh thường xuyên. Mong nơi này có thêm chỗ đỗ xe.",
  },
]
const reviewsFor = (id: string) => {
  const s = id.charCodeAt(id.length - 1) % REVIEWS.length
  return [...REVIEWS.slice(s), ...REVIEWS.slice(0, s)]
}

const Rating = ({ p }: { p: Place }) => (
  <span className="inline-flex items-center gap-1 text-sm font-extrabold">
    <Star className="size-4 fill-butter-2" />
    {p.rating}
    <span className="font-semibold text-brown-soft">({p.reviews})</span>
  </span>
)

function PlaceCard({
  p,
  onOpen,
  selected,
}: {
  p: Place
  kind?: Kind
  onOpen: () => void
  selected?: boolean
}) {
  return (
    <Card
      hover
      onClick={onOpen}
      className={cx(
        "flex gap-3 p-4",
        selected && "border-brown ring-4 ring-butter",
      )}
    >
      <div className="size-20 shrink-0 overflow-hidden rounded-2xl border-2 border-brown bg-cream-2">
        <img
          src={p.photo}
          alt={p.name}
          loading="lazy"
          className="size-full object-cover"
        />
      </div>
      <div className="min-w-0 flex-1 space-y-1">
        <div className="flex flex-wrap items-center gap-1.5">
          <h3 className="font-display text-lg font-extrabold leading-tight">
            {p.name}
          </h3>
          {p.verified && <Verified />}
        </div>
        <p className="flex flex-wrap items-center gap-x-3 text-sm font-bold text-brown-soft">
          <span className="inline-flex items-center gap-1">
            <MapPin className="size-3.5" />
            {p.district}
          </span>
          <span>{p.distance} km</span>
          <Rating p={p} />
        </p>
        {isShelter(p) ? (
          <div className="flex flex-wrap gap-1.5 pt-0.5">
            {p.urgent && (
              <Badge tone="coral" icon={<Siren className="size-3.5" />}>
                Đang cần hỗ trợ
              </Badge>
            )}
            <Badge tone="sage">{p.pets} bé</Badge>
            <span className="line-clamp-1 w-full text-sm text-brown-soft">
              Cần: {p.needs.join(", ")}
            </span>
          </div>
        ) : (
          <div className="flex flex-wrap gap-1.5 pt-0.5">
            <OpenBadge open={(p as Clinic).open} />
            {(p as Clinic).emergency && (
              <Badge tone="coral" icon={<Siren className="size-3.5" />}>
                Cấp cứu 24/7
              </Badge>
            )}
          </div>
        )}
      </div>
    </Card>
  )
}

const OpenBadge = ({ open }: { open: boolean }) =>
  open ? (
    <Badge tone="sage" icon={<Clock className="size-3.5" />}>
      Đang mở
    </Badge>
  ) : (
    <Badge tone="brown" icon={<Clock className="size-3.5" />}>
      Đã đóng
    </Badge>
  )

/* ---------------- Directory ---------------- */
export function Directory({ kind }: { kind: Kind }) {
  const { go } = useApp()
  const base = kind === "shelter" ? "/shelters" : "/clinics"
  const [district, setDistrict] = useState("")
  const [dist, setDist] = useState("")
  const [rating, setRating] = useState("")
  const [need, setNeed] = useState(false)
  const [view, setView] = useState<"list" | "map">("list")
  const [sel, setSel] = useState<Sel | null>(null)

  const all: Place[] = kind === "shelter" ? SHELTERS : CLINICS
  const list = useMemo(
    () =>
      all
        .filter(
          (p) =>
            (!district || p.district === district) &&
            (!dist || p.distance <= Number(dist)) &&
            (!rating || p.rating >= Number(rating)) &&
            (!need ||
              (kind === "shelter"
                ? (p as Shelter).urgent
                : (p as Clinic).open)),
        )
        .sort((a, b) => a.distance - b.distance),
    [all, district, dist, rating, need, kind],
  )
  const picked = list.find((p) => p.id === sel?.id)
  const reset = () => {
    setDistrict("")
    setDist("")
    setRating("")
    setNeed(false)
  }

  return (
    <div>
      <PageHead
        title={kind === "shelter" ? "Mái ấm cứu hộ" : "Phòng khám thú y"}
        sub={
          kind === "shelter"
            ? "Những nơi đang dang tay đón các bé không nhà."
            : "Phòng khám đáng tin cậy gần bạn, kèm giờ mở cửa."
        }
        right={
          <Segmented
            value={view}
            onChange={setView}
            options={[
              {
                v: "list",
                label: (
                  <span className="inline-flex items-center gap-1.5">
                    <List className="size-4" />
                    Danh sách
                  </span>
                ),
              },
              {
                v: "map",
                label: (
                  <span className="inline-flex items-center gap-1.5">
                    <MapIcon className="size-4" />
                    Bản đồ
                  </span>
                ),
              },
            ]}
          />
        }
      />
      <div className="mb-5 grid gap-3 rounded-[24px] border-2 border-line bg-paper p-4 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_auto_auto]">
        <Select
          value={district}
          onChange={(e) => setDistrict(e.target.value)}
          aria-label="Quận"
        >
          <option value="">Quận: Tất cả</option>
          {DISTRICTS.map((d) => (
            <option key={d}>{d}</option>
          ))}
        </Select>
        <Select
          value={dist}
          onChange={(e) => setDist(e.target.value)}
          aria-label="Khoảng cách"
        >
          <option value="">Khoảng cách: Bất kỳ</option>
          <option value="2">Dưới 2 km</option>
          <option value="5">Dưới 5 km</option>
          <option value="8">Dưới 8 km</option>
        </Select>
        <Select
          value={rating}
          onChange={(e) => setRating(e.target.value)}
          aria-label="Rating"
        >
          <option value="">Rating: Tất cả</option>
          <option value="4.5">Từ 4.5 sao</option>
          <option value="4.7">Từ 4.7 sao</option>
          <option value="4.8">Từ 4.8 sao</option>
        </Select>
        <div className="flex items-center">
          <Chip active={need} onClick={() => setNeed(!need)}>
            {kind === "shelter" ? "Đang cần hỗ trợ" : "Đang mở cửa"}
          </Chip>
        </div>
        <Btn variant="ghost" size="sm" onClick={reset} className="self-center">
          Xóa lọc
        </Btn>
      </div>
      <p className="mb-3 text-sm font-bold text-brown-soft">
        {list.length} kết quả
      </p>

      {list.length === 0 ? (
        <Empty
          title="Không có kết quả phù hợp"
          body="Thử nới lỏng bộ lọc nhé."
          cta="Xóa lọc"
          onCta={reset}
        />
      ) : view === "list" ? (
        <div className="grid gap-4 md:grid-cols-2">
          {list.map((p) => (
            <PlaceCard
              key={p.id}
              p={p}
              kind={kind}
              onOpen={() => go(`${base}/${p.id}`)}
            />
          ))}
        </div>
      ) : (
        <div className="relative overflow-hidden rounded-[28px] border-2 border-brown shadow-soft">
          <CityMap
            className="h-[480px] w-full"
            me={ME_POS}
            shelters={kind === "shelter" ? list as Shelter[] : undefined}
            clinics={kind === "clinic" ? list as Clinic[] : undefined}
            selected={picked ? sel : null}
            onSelect={setSel}
            center={
              picked
                ? { x: picked.x, y: picked.y, k: 1.4 }
                : { x: 450, y: 340, k: 1 }
            }
            focusKey={picked?.id}
          />
          {picked && (
            <div className="absolute inset-x-3 bottom-3 z-10 animate-[rise_.25s_both] sm:right-auto sm:max-w-md">
              <PlaceCard
                p={picked}
                kind={kind}
                onOpen={() => go(`${base}/${picked.id}`)}
                selected
              />
            </div>
          )}
          {!picked && (
            <p className="pointer-events-none absolute left-3 top-3 rounded-full border-2 border-line bg-paper/95 px-3 py-1 text-xs font-extrabold">
              Chạm vào ghim để xem nhanh
            </p>
          )}
        </div>
      )}
    </div>
  )
}

/* ---------------- Detail ---------------- */
export function PlaceDetail({ kind, id }: { kind: Kind; id: string }) {
  const { go, toast, back } = useApp()
  const [rate, setRate] = useState(false)
  const [route, setRoute] = useState(false)
  const p: Place | undefined = (kind === "shelter" ? SHELTERS : CLINICS).find(
    (x) => x.id === id,
  )
  if (!p)
    return (
      <Empty
        title="Không tìm thấy địa điểm"
        cta="Quay lại danh sách"
        onCta={() => go(kind === "shelter" ? "/shelters" : "/clinics")}
      />
    )
  const s = isShelter(p) ? p : null
  const c = !s ? p as Clinic : null

  return (
    <div className="space-y-6">
      <Btn
        variant="ghost"
        size="sm"
        onClick={back}
        className="h-auto p-0 font-extrabold text-brown-soft hover:text-brown"
      >
        ← Quay lại
      </Btn>
      <div className="overflow-hidden rounded-[28px] border-2 border-brown bg-paper shadow-soft">
        <div className="h-48 bg-cream-2 sm:h-64">
          <img
            src={p.photo}
            alt={`Ảnh ${p.name}`}
            className="size-full object-cover"
          />
        </div>
        <div className="space-y-3 p-5 md:p-6">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="font-display text-3xl font-extrabold leading-tight md:text-4xl">
              {p.name}
            </h1>
            {p.verified ? (
              <Verified />
            ) : (
              <Badge tone="orange">Chưa xác minh</Badge>
            )}
            {c && <OpenBadge open={c.open} />}
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Stars value={p.rating} size={20} />
            <span className="font-extrabold">{p.rating}</span>
            <span className="text-sm text-brown-soft">
              {p.reviews} đánh giá
            </span>
          </div>
          <p className="flex items-start gap-2 font-bold">
            <MapPin className="mt-0.5 size-5 shrink-0" />
            {p.address} · cách bạn {p.distance} km
          </p>
          <div className="flex flex-wrap gap-2 pt-1">
            {s ? (
              <>
                <Btn
                  icon={<HandHeart className="size-5" />}
                  onClick={() => go(`/donate/money?shelter=${p.id}`)}
                >
                  Donate
                </Btn>
                <Btn
                  variant="secondary"
                  icon={<Star className="size-5" />}
                  onClick={() => setRate(true)}
                >
                  Đánh giá
                </Btn>
              </>
            ) : (
              <>
                <Btn
                  icon={<Navigation className="size-5" />}
                  onClick={() => {
                    setRoute(true)
                    toast("Đã hiện đường đi trên bản đồ")
                  }}
                >
                  Chỉ đường
                </Btn>
                <Btn
                  variant="secondary"
                  icon={<Star className="size-5" />}
                  onClick={() => setRate(true)}
                >
                  Đánh giá
                </Btn>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
        <div className="space-y-6">
          {s && (
            <>
              <Card>
                <SectionTitle>Giới thiệu</SectionTitle>
                <p>{s.about}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Badge tone="sage">Đang chăm sóc {s.pets} bé</Badge>
                  <Badge tone="brown">Hoạt động từ {s.since}</Badge>
                </div>
              </Card>
              <Card>
                <SectionTitle sub="Bạn có thể giúp bằng tiền hoặc hiện vật">
                  Đang cần
                </SectionTitle>
                <ul className="space-y-2">
                  {s.needs.map((n) => (
                    <li
                      key={n}
                      className="flex items-center gap-2 rounded-2xl bg-cream-2 px-3 py-2 font-bold"
                    >
                      <span className="size-2 rounded-full bg-orange" />
                      {n}
                    </li>
                  ))}
                </ul>
                {s.urgent && (
                  <div className="mt-3">
                    <Badge tone="coral" icon={<Siren className="size-3.5" />}>
                      Đang cần hỗ trợ gấp
                    </Badge>
                  </div>
                )}
              </Card>
            </>
          )}
          {c && (
            <>
              <Card>
                <SectionTitle>Dịch vụ</SectionTitle>
                <div className="flex flex-wrap gap-2">
                  {c.services.map((x) => (
                    <Badge
                      key={x}
                      tone={x.includes("Cấp cứu") ? "coral" : "sky"}
                    >
                      {x}
                    </Badge>
                  ))}
                </div>
                <p className="mt-3 flex items-center gap-2 font-bold">
                  <Clock className="size-5" />
                  Giờ mở cửa: {c.hours}
                </p>
              </Card>
            </>
          )}
          <Card>
            <SectionTitle>Đánh giá gần đây</SectionTitle>
            <ul className="divide-y-2 divide-line">
              {reviewsFor(p.id).map((r) => (
                <li
                  key={r.name}
                  className="flex gap-3 py-3 first:pt-0 last:pb-0"
                >
                  <Avatar
                    name={r.name}
                    tone={["pink", "butter", "sage", "sky"][r.name.length % 4]}
                    size={40}
                  />
                  <div className="min-w-0">
                    <p className="font-extrabold">
                      {r.name}{" "}
                      <span className="text-xs font-semibold text-brown-soft">
                        · {r.ago}
                      </span>
                    </p>
                    <Stars value={r.stars} size={14} />
                    <p className="mt-1 text-sm">{r.text}</p>
                  </div>
                </li>
              ))}
            </ul>
          </Card>
        </div>

        <div className="space-y-6">
          <div className="overflow-hidden rounded-[24px] border-2 border-brown shadow-soft">
            <CityMap
              className="h-64 w-full"
              me={ME_POS}
              shelters={s ? [s] : undefined}
              clinics={c ? [c] : undefined}
              route={route ? routeTo(p.x, p.y) : undefined}
              center={{
                x: (p.x + (route ? ME_POS.x : p.x)) / 2,
                y: (p.y + (route ? ME_POS.y : p.y)) / 2,
                k: route ? 0.9 : 1.5,
              }}
              focusKey={`${p.id}${route}`}
            />
          </div>
          <Card>
            <SectionTitle>Liên hệ</SectionTitle>
            <ul className="space-y-2 font-bold">
              <li className="flex items-center gap-2">
                <Phone className="size-5" />
                <a
                  href={`tel:${p.phone.replace(/\s/g, "")}`}
                  className="underline decoration-line decoration-2 underline-offset-4"
                >
                  {p.phone}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Globe className="size-5" />
                {p.website}
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 size-5 shrink-0" />
                {p.address}
              </li>
            </ul>
          </Card>
          {c?.emergency && (
            <Note tone="coral" icon={<Siren className="size-5 shrink-0" />}>
              Phòng khám có cấp cứu 24/7. Gọi trước khi đưa bé tới để được chuẩn
              bị.
            </Note>
          )}
        </div>
      </div>
      <RatingModal open={rate} onClose={() => setRate(false)} name={p.name} />
    </div>
  )
}
