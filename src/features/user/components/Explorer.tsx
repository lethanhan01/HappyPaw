import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react"
import {
  SlidersHorizontal,
  Map as MapIcon,
  List,
  Plus,
  Minus,
  LocateFixed,
  Loader2,
  ChevronRight,
  ArrowLeft,
  X,
} from "lucide-react"
import CityMap, {
  LegendSwatch,
  MapLegend,
  PIN_META,
  ME_POS,
  kmFrom,
  KM,
  type MapApi,
  type PinType,
  type Sel,
  F0,
  SearchBar,
  TIME_OPTS,
  countFilters,
  matchCase,
  placeAllowed,
  type Filters,
  type SearchHit,
  type StatusKey,
  approxLoc,
} from "@/features/map"
import UserShell from "@/layouts/UserShell"
import { useApp } from "@/store"
import { CLINICS, SHELTERS } from "@/constants/mock/places"
import { RISKS } from "@/constants/mock/risks"
import { DISTRICTS } from "@/constants/districts"
import {
  BottomSheet,
  Btn,
  IconBtn,
  Chip,
  Empty,
  Field,
  Input,
  Modal,
  Segmented,
  Select,
  Badge,
  StatusBadge,
  cx,
} from "@ui"
import { useMedia } from "@/hooks/useMedia"
import { CaseCard, CaseCardSkeleton, PinDetailCard } from "@/components/common"
import { NavigationSheet, NavigationContent } from "@/components/common/NavigationSheet"
import { LiveTrackingModal } from "@/components/common/LiveTrackingModal"
import {
  fetchRoute,
  getGoogleMapsDirectionsUrl,
  type RouteData,
  type RoutingProfile,
} from "@/services/routingService"
import { useLiveTracking } from "@/hooks/useLiveTracking"
import {
  xyToLngLat,
  HANOI_CENTER,
  haversineDistance,
} from "@/utils/geoConverter"

export { approxLoc } from "@/features/map"

const TYPES: PinType[] = ["rescue", "lost", "shelter", "clinic", "warning"]
const STATUSES: [StatusKey, string][] = [
  ["active", "Đang cần hỗ trợ"],
  ["progress", "Đang xử lý"],
  ["resolved", "Đã giải quyết"],
]
const toggle = <T,>(a: T[], v: T) =>
  a.includes(v) ? a.filter((x) => x !== v) : [...a, v]

function FilterSection({
  title,
  children,
}: {
  title: string
  children: ReactNode
}) {
  return (
    <div>
      <p className="mb-2 text-sm font-extrabold">{title}</p>
      {children}
    </div>
  )
}

export default function Explorer({
  variant = "home",
}: {
  variant?: "home" | "map"
}) {
  const { cases, go, toast } = useApp()
  const desktop = useMedia("(min-width: 1024px)")
  const [loading, setLoading] = useState(true)
  const [sel, setSel] = useState<Sel | null>(null)
  const [hoverId, setHoverId] = useState<string | null>(null)
  const [q, setQ] = useState("")
  const [recent, setRecent] = useState([
    "Cầu Giấy",
    "Golden Retriever",
    "Trần Thái Tông",
  ])
  const [f, setF] = useState<Filters>(F0)
  const [draft, setDraft] = useState<Filters>(F0)
  const [open, setOpen] = useState(false)
  const [view, setView] = useState<"map" | "list">("map")
  const [snap, setSnap] = useState<0 | 1 | 2>(0)
  const [hiddenKinds, setHiddenKinds] = useState<PinType[]>([])
  const api = useRef<MapApi | null>(null)

  // Real GPS User Location State
  const [userCoords, setUserCoords] = useState<[number, number] | null>(null)
  const [isLocating, setIsLocating] = useState(false)
  const [isOutsideHanoi, setIsOutsideHanoi] = useState(false)

  const handleLocate = useCallback(
    (showFeedback = true) => {
      if (!("geolocation" in navigator)) {
        if (showFeedback) {
          toast("Trình duyệt của bạn không hỗ trợ định vị GPS.", "warn")
        }
        return
      }

      setIsLocating(true)
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const coords: [number, number] = [
            pos.coords.longitude,
            pos.coords.latitude,
          ]
          setUserCoords(coords)
          setIsLocating(false)

          const distFromHanoi = haversineDistance(coords, HANOI_CENTER)
          if (distFromHanoi > 50) {
            setIsOutsideHanoi(true)
            if (showFeedback) {
              toast(
                "Vị trí của bạn nằm ngoài Hà Nội. Dữ liệu ca cứu hộ mẫu hiện tập trung tại Hà Nội.",
                "info",
              )
            }
          } else {
            setIsOutsideHanoi(false)
            if (showFeedback) {
              toast("Đã xác định vị trí của bạn!", "ok")
            }
          }

          api.current?.focusLngLat(coords[0], coords[1], 15)
        },
        (err) => {
          setIsLocating(false)
          if (showFeedback) {
            if (err.code === 1) {
              toast(
                "Bạn đã từ chối quyền truy cập vị trí. Hãy bật lại trong cài đặt trình duyệt.",
                "warn",
              )
            } else if (err.code === 3) {
              toast("Quá thời gian xác định vị trí. Vui lòng thử lại.", "warn")
            } else {
              toast("Không thể xác định vị trí hiện tại của bạn.", "warn")
            }
          }
        },
        { enableHighAccuracy: true, timeout: 10000 },
      )
    },
    [toast],
  )

  // Auto-locate silently on mount if permission has already been granted
  useEffect(() => {
    if ("permissions" in navigator) {
      navigator.permissions
        .query({ name: "geolocation" })
        .then((result) => {
          if (result.state === "granted") {
            handleLocate(false)
          }
        })
        .catch(() => {})
    }
  }, [handleLocate])

  // Realtime Routing & Live Tracking State
  const [navTarget, setNavTarget] = useState<{
    x: number
    y: number
    name: string
    address?: string
    caseId?: string
  } | null>(null)
  const [navRouteData, setNavRouteData] = useState<RouteData | null>(null)
  const [navLoading, setNavLoading] = useState(false)
  const [navProfile, setNavProfile] = useState<RoutingProfile>("driving")
  const [showShareModal, setShowShareModal] = useState(false)

  const {
    isLive,
    isSimulating,
    rescuerPos,
    heading,
    speedMultiplier,
    progressPercent,
    hasArrived,
    setSpeedMultiplier,
    startSimulation,
    stopLiveTracking,
    startLiveGps,
  } = useLiveTracking({ caseId: navTarget?.caseId || "HP-1041" })

  useEffect(() => {
    if (!navTarget) {
      setNavRouteData(null)
      stopLiveTracking()
      return
    }

    let active = true
    setNavLoading(true)

    const start = userCoords
      ? userCoords
      : xyToLngLat(ME_POS.x, ME_POS.y)
    const end = xyToLngLat(navTarget.x, navTarget.y)

    fetchRoute(start, end, navProfile)
      .then((data) => {
        if (active) {
          setNavRouteData(data)
          setNavLoading(false)
        }
      })
      .catch(() => {
        if (active) setNavLoading(false)
      })

    return () => {
      active = false
    }
  }, [navTarget, navProfile, userCoords])

  const handleDirections = (target: {
    x: number
    y: number
    name: string
    address?: string
    caseId?: string
  }) => {
    setNavTarget(target)
    setView("map")
    setSnap(1)
  }

  const handleToggleSimulation = () => {
    if (isSimulating) {
      stopLiveTracking()
    } else if (navRouteData && navTarget) {
      startSimulation(
        navTarget.caseId || "HP-1041",
        navRouteData.coordinates,
        navRouteData.distanceKm,
        navRouteData.durationMinutes,
      )
    }
  }

  const handleOpenGoogleMaps = () => {
    if (!navTarget) return
    const start = userCoords ? userCoords : xyToLngLat(ME_POS.x, ME_POS.y)
    const end = xyToLngLat(navTarget.x, navTarget.y)
    const url = getGoogleMapsDirectionsUrl(start, end, navProfile)
    window.open(url, "_blank", "noopener,noreferrer")
  }

  const handleCloseNavigation = () => {
    setNavTarget(null)
    setNavRouteData(null)
    stopLiveTracking()
  }

  useEffect(() => {
    if (variant === "map") {
      go("/home", { replace: true })
    }
  }, [variant, go])

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 600)
    return () => clearTimeout(t)
  }, [])

  const list = useMemo(
    () => cases.filter((c) => matchCase(c, f, q)),
    [cases, f, q],
  )
  const mapCases = useMemo(
    () =>
      (hiddenKinds.includes("rescue") || hiddenKinds.includes("lost")
        ? list.filter(
            (c) =>
              !hiddenKinds.includes(c.type === "rescue" ? "rescue" : "lost"),
          )
        : list
      ).filter((c) => c.status !== "resolved"),
    [list, hiddenKinds],
  )
  const n = countFilters(f)
  const shown = (t: PinType) => placeAllowed(f, t) && !hiddenKinds.includes(t)
  const selCase =
    sel?.kind === "case" ? cases.find((c) => c.id === sel.id) : undefined
  const examples = list.filter((c) => c.status !== "resolved").slice(0, 3)
  const draftCount = cases.filter((c) => matchCase(c, draft, q)).length

  const select = (s: Sel | null) => {
    setSel(s)
    if (s) {
      setNavTarget(null)
      setNavRouteData(null)
      setSnap(1)
      setView("map")
    }
  }
  const commit = (v: string) => {
    const t = v.trim()
    if (t) setRecent((r) => [t, ...r.filter((x) => x !== t)].slice(0, 4))
  }
  const clearAll = () => {
    setF(F0)
    setDraft(F0)
    setQ("")
    setHiddenKinds([])
  }

  const hits = useMemo<SearchHit[]>(() => {
    const t = q.trim().toLowerCase()
    if (!t) return []
    const out: SearchHit[] = []
    cases
      .filter(
        (c) =>
          c.status !== "resolved" &&
          [c.name, c.district, c.street, c.breed, c.color, c.species]
            .join(" ")
            .toLowerCase()
            .includes(t),
      )
      .slice(0, 4)
      .forEach((c) =>
        out.push({
          key: c.id,
          label: `${c.name} · ${c.species} ${c.color.toLowerCase()}`,
          sub: `${c.street}, ${c.district} · ${
            c.type === "rescue" ? "Cần cứu hộ" : "Thất lạc"
          }`,
          type: c.type === "rescue" ? "rescue" : "lost",
          onPick: () => {
            setQ("")
            select({ kind: "case", id: c.id })
          },
        }),
      )
    ;[
      ...SHELTERS.map((p) => ({ p, kind: "shelter" as const })),
      ...CLINICS.map((p) => ({ p, kind: "clinic" as const })),
    ]
      .filter(({ p }) => `${p.name} ${p.district}`.toLowerCase().includes(t))
      .slice(0, 3)
      .forEach(({ p, kind }) =>
        out.push({
          key: p.id,
          label: p.name,
          sub: `${
            kind === "shelter" ? "Mái ấm" : "Phòng khám"
          } · ${p.district}`,
          type: kind,
          onPick: () => {
            setQ("")
            setHiddenKinds((h) => h.filter((x) => x !== kind))
            select({ kind, id: p.id })
            api.current?.focus(p.x, p.y, 1.6)
          },
        }),
      )
    DISTRICTS.filter((d) => d.toLowerCase().includes(t))
      .slice(0, 1)
      .forEach((d) =>
        out.push({
          key: `d-${d}`,
          label: `Quận ${d}`,
          sub: "Lọc theo khu vực",
          type: "warning",
          onPick: () => {
            setQ("")
            setF((o) => ({ ...o, district: d }))
          },
        }),
      )
    return out
  }, [q, cases])

  const center = selCase
    ? { x: selCase.x, y: selCase.y + (desktop ? 0 : 40), k: 1.5 }
    : { x: 445, y: 350, k: desktop ? 1 : 0.95 }
  const selLost =
    selCase && selCase.type === "lost" && selCase.status !== "resolved"

  const openFilter = () => {
    setDraft(f)
    setOpen(true)
  }
  const filterActionBtn = (
    <IconBtn
      label={`Bộ lọc${n ? ` · ${n}` : ""}`}
      size="sm"
      variant="ghost"
      onClick={(e) => {
        e.stopPropagation()
        openFilter()
      }}
      className={cx(
        "relative !size-8 !rounded-full !border transition active:scale-90",
        n > 0
          ? "!bg-butter !border-brown !text-brown shadow-xs"
          : "!bg-cream-2/70 !border-brown/20 !text-brown hover:!bg-white",
      )}
    >
      <SlidersHorizontal className="size-3.5" />
      {n > 0 && (
        <span className="absolute -right-1 -top-1 grid size-4 place-items-center rounded-full bg-coral text-[9px] font-extrabold text-white">
          {n}
        </span>
      )}
    </IconBtn>
  )

  const mobileSearch = (
    <SearchBar
      value={q}
      onChange={setQ}
      hits={hits}
      recent={recent}
      onCommit={commit}
      onClearRecent={() => setRecent([])}
      size="md"
      rightAction={filterActionBtn}
    />
  )

  const search = (
    <SearchBar
      value={q}
      onChange={setQ}
      hits={hits}
      recent={recent}
      onCommit={commit}
      onClearRecent={() => setRecent([])}
      size="md"
      rightAction={filterActionBtn}
    />
  )

  const handleSelectCase = (c: typeof cases[number]) => {
    select({ kind: "case", id: c.id })
    api.current?.focus(c.x, c.y, 1.5)
  }

  const resultList = loading ? (
    <div className="space-y-3">
      <CaseCardSkeleton compact />
      <CaseCardSkeleton compact />
      <CaseCardSkeleton compact />
    </div>
  ) : list.length === 0 ? (
    <Empty
      title="Chưa có case nào trong khu vực này"
      body="Thử mở rộng bán kính hoặc bỏ bớt bộ lọc nhé."
      cta="Xóa bộ lọc"
      onCta={clearAll}
    />
  ) : (
    <div className="space-y-3">
      {list
        .filter((c) => desktop || sel?.id !== c.id)
        .map((c) => (
          <div
            key={c.id}
            onMouseEnter={() => setHoverId(c.id)}
            onMouseLeave={() => setHoverId(null)}
          >
            <CaseCard
              c={c}
              compact
              selected={sel?.id === c.id}
              onSelect={() => handleSelectCase(c)}
            />
          </div>
        ))}
    </div>
  )

  const mapEl = (
    <CityMap
      className="size-full"
      cases={mapCases}
      shelters={shown("shelter") ? SHELTERS : []}
      clinics={shown("clinic") ? CLINICS : []}
      risks={shown("warning") ? RISKS : []}
      selected={sel}
      onSelect={select}
      radius={{ ...ME_POS, km: f.radius }}
      me={ME_POS}
      userLocation={userCoords}
      onLocate={(coords) => setUserCoords(coords)}
      center={center}
      loading={loading}
      controls={desktop}
      apiRef={api}
      hoverId={hoverId}
      predicted={selLost ? { x: selCase.x, y: selCase.y, r: 0.5 * KM } : null}
      trail={
        selLost
          ? selCase.trail?.map((t) => ({ x: t.x, y: t.y, t: t.t }))
          : undefined
      }
      routeCoords={navRouteData?.coordinates}
      routeColor="#2563eb"
      liveRescuer={
        rescuerPos
          ? {
              lng: rescuerPos[0],
              lat: rescuerPos[1],
              heading,
              name: "Cứu hộ viên",
              vehicleType: navProfile === "walking" ? "Đi bộ" : "Xe máy",
              isLive: isLive,
            }
          : null
      }
      extras={null}
      controlsClass="bottom-6"
      focusKey={sel ? sel.id : undefined}
    />
  )

  return (
    <UserShell fullBleed hideFab mobileHeaderContent={mobileSearch}>
      <div className="relative h-[calc(100dvh-64px-68px)] overflow-hidden lg:h-[calc(100dvh-64px)] lg:flex lg:flex-row">
        {/* AREA 1: Desktop Left Control & Case List Sidebar */}
        {desktop && (
          <aside className="flex w-[380px] xl:w-[410px] shrink-0 min-h-0 flex-col border-r-2 border-brown/15 bg-cream">
            {/* Header SearchBar with integrated Filter button */}
            <div className="p-3.5 border-b-2 border-brown/10 bg-cream shrink-0">
              {search}
            </div>

            {/* Section Header: Danh sách lân cận */}
            <div className="flex items-center justify-between px-4 py-3 border-b-2 border-line bg-cream/40 shrink-0">
              <div>
                <h3 className="font-display text-base font-extrabold text-brown">
                  Danh sách lân cận
                </h3>
                <p className="text-xs font-bold text-brown-soft">
                  {list.length} ca trong khu vực
                </p>
              </div>
              {n > 0 && (
                <Badge
                  tone="butter"
                  className="cursor-pointer transition hover:bg-butter"
                  onClick={openFilter}
                  title="Nhấn để chỉnh sửa bộ lọc"
                >
                  Đang lọc · {n}
                </Badge>
              )}
            </div>

            {/* Scrollable list of CaseCards */}
            <div className="min-h-0 flex-1 space-y-3 overflow-y-auto p-3.5">
              {resultList}
            </div>
          </aside>
        )}

        {/* AREA 2: Center Interactive Map */}
        <section className="relative flex-1 min-w-0 h-full overflow-hidden bg-map-sand">
          {desktop && view === "list" ? (
            <div className="size-full overflow-y-auto bg-cream p-6">
              {list.length ? (
                <div className="grid grid-cols-2 gap-4 xl:grid-cols-3">
                  {list.map((c) => (
                    <CaseCard key={c.id} c={c} />
                  ))}
                </div>
              ) : (
                <Empty
                  title="Chưa có case nào trong khu vực này"
                  cta="Xóa bộ lọc"
                  onCta={clearAll}
                />
              )}
            </div>
          ) : (
            mapEl
          )}

          {/* floating map chrome */}
          {desktop && (
            <div className="absolute right-4 top-4 z-10 rounded-full bg-paper shadow-soft">
              <Segmented
                value={view}
                onChange={setView}
                options={[
                  {
                    v: "map",
                    label: (
                      <span className="flex items-center gap-1.5 px-1">
                        <MapIcon className="size-4" />
                        Bản đồ
                      </span>
                    ),
                  },
                  {
                    v: "list",
                    label: (
                      <span className="flex items-center gap-1.5 px-1">
                        <List className="size-4" />
                        Danh sách
                      </span>
                    ),
                  },
                ]}
              />
            </div>
          )}
          {desktop && view === "map" && (
            <div className="absolute left-4 top-4 z-10">
              <MapLegend
                defaultOpen
                hidden={hiddenKinds}
                onToggle={(t) => setHiddenKinds((h) => toggle(h, t))}
              />
            </div>
          )}

          {/* Outside Hanoi informative banner */}
          {isOutsideHanoi && (
            <div className="absolute top-3 left-3 right-16 sm:left-4 sm:right-auto sm:max-w-md z-10 flex items-center justify-between gap-2 px-3.5 py-2 rounded-2xl bg-amber-100/95 border-2 border-amber-300 text-amber-950 backdrop-blur-md shadow-md animate-[rise_.2s_both]">
              <span className="text-xs font-bold truncate">
                Vị trí của bạn ngoài HN · Dữ liệu mẫu tại Hà Nội
              </span>
              <Btn
                size="sm"
                variant="primary"
                onClick={() => {
                  api.current?.focusLngLat(HANOI_CENTER[0], HANOI_CENTER[1], 13.5)
                }}
                className="text-[11px] font-black shrink-0 !h-7 !px-2.5"
              >
                Về Hà Nội
              </Btn>
            </div>
          )}

          {!desktop && (
            <>
              {/* Nút điều khiển bản đồ bên phải */}
              <div className="absolute right-3 top-3 z-10 flex flex-col gap-2">
                <IconBtn
                  variant="ghost"
                  onClick={() => handleLocate(true)}
                  disabled={isLocating}
                  aria-label="Vị trí hiện tại"
                  className={cx(
                    "size-11 rounded-full border-2 border-brown bg-paper shadow-soft relative transition-colors",
                    userCoords && "border-sky-600 bg-sky-50 text-sky-700",
                  )}
                >
                  {isLocating ? (
                    <Loader2 className="size-5 animate-spin text-coral" />
                  ) : (
                    <LocateFixed
                      className={cx("size-5", userCoords && "text-sky-600")}
                    />
                  )}
                </IconBtn>
                <IconBtn
                  variant="ghost"
                  onClick={() => api.current?.zoom(1.3)}
                  aria-label="Phóng to"
                  className="size-11 rounded-full border-2 border-brown bg-paper shadow-soft"
                >
                  <Plus className="size-5" />
                </IconBtn>
                <IconBtn
                  variant="ghost"
                  onClick={() => api.current?.zoom(0.77)}
                  aria-label="Thu nhỏ"
                  className="size-11 rounded-full border-2 border-brown bg-paper shadow-soft"
                >
                  <Minus className="size-5" />
                </IconBtn>
              </div>
              <BottomSheet
                snap={snap}
                onSnap={setSnap}
                peek={navTarget ? 96 : sel ? 128 : 88}
                header={
                  navTarget ? (
                    <div className="flex items-center gap-2.5 px-4 pb-2.5">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <span className="truncate font-display text-[15px] font-extrabold text-brown">
                            {navTarget.name}
                          </span>
                          <Badge
                            tone="butter"
                            className="shrink-0 text-[10px] uppercase font-black tracking-wide"
                          >
                            {navProfile === "walking" ? "Đi bộ" : "Xe máy"}
                          </Badge>
                        </div>
                        <p className="truncate text-xs font-bold text-brown-soft">
                          {navLoading ? (
                            "Đang tính lộ trình..."
                          ) : navRouteData ? (
                            `~ ${navRouteData.durationMinutes} phút · ${navRouteData.distanceKm} km`
                          ) : (
                            navTarget.address || "Chỉ đường"
                          )}
                        </p>
                      </div>
                      <IconBtn
                        label="Đóng chỉ đường"
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleCloseNavigation()
                        }}
                        className="!size-8 !rounded-full hover:!bg-brown/10 text-brown shrink-0"
                      >
                        <X className="size-4" />
                      </IconBtn>
                    </div>
                  ) : sel && selCase ? (
                    <div className="flex items-center gap-2.5 px-4 pb-2.5">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <span className="truncate font-display text-[15px] font-extrabold">
                            {selCase.name.toUpperCase()}
                          </span>
                          <StatusBadge
                            status={selCase.status}
                            critical={selCase.critical}
                            type={selCase.type}
                          />
                        </div>
                        <p className="truncate text-xs font-bold text-brown-soft">
                          {approxLoc(selCase)} · cách bạn{" "}
                          {kmFrom(selCase.x, selCase.y)} km
                        </p>
                      </div>
                      <Btn
                        size="sm"
                        variant={
                          selCase.critical || selCase.type === "rescue"
                            ? "danger"
                            : "primary"
                        }
                        pill
                        className="h-10 shrink-0 px-3 text-xs font-extrabold shadow-[0_3px_0_var(--color-brown)] active:translate-y-0.5 active:shadow-none"
                        onClick={(e) => {
                          e.stopPropagation()
                          go(`/case/${sel.id}?help=1`)
                        }}
                      >
                        {selCase.critical || selCase.type === "rescue"
                          ? "CỨU NGAY"
                          : "Giúp bé"}
                      </Btn>
                      <IconBtn
                        label="Bỏ chọn ghim"
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          setSel(null)
                          setSnap(0)
                        }}
                        className="!size-8 !rounded-full hover:!bg-brown/10"
                      >
                        <X className="size-4" />
                      </IconBtn>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 px-4 pb-3">
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-display text-[15px] font-extrabold leading-tight">
                          {list.filter((c) => c.status !== "resolved").length}{" "}
                          case đang hoạt động
                        </p>
                        <p className="truncate text-xs font-bold text-brown-soft">
                          {examples.map((c) => c.district).join(" · ") ||
                            "Kéo lên để xem danh sách"}
                        </p>
                      </div>
                      <IconBtn
                        label="Báo case"
                        size="sm"
                        variant="danger"
                        className="!size-10 !rounded-full shadow-[0_3px_0_var(--color-brown)] active:translate-y-0.5 active:shadow-none shrink-0"
                        onClick={(e) => {
                          e.stopPropagation()
                          go("/report")
                        }}
                        onPointerDown={(e) => e.stopPropagation()}
                      >
                        <Plus className="size-5" strokeWidth={3} />
                      </IconBtn>
                    </div>
                  )
                }
              >
                <div className="space-y-3 px-4 pb-6">
                  {navTarget ? (
                    <NavigationContent
                      destinationName={navTarget.name}
                      destinationAddress={navTarget.address}
                      routeData={navRouteData}
                      loading={navLoading}
                      profile={navProfile}
                      onProfileChange={setNavProfile}
                      isSimulating={isSimulating}
                      speedMultiplier={speedMultiplier}
                      onToggleSimulation={handleToggleSimulation}
                      onSpeedChange={setSpeedMultiplier}
                      isLive={isLive}
                      onStartLiveGps={() =>
                        startLiveGps(navTarget.caseId || "HP-1041")
                      }
                      onShareLiveLink={() => setShowShareModal(true)}
                      onOpenGoogleMaps={handleOpenGoogleMaps}
                      onClose={handleCloseNavigation}
                      progressPercent={progressPercent}
                      hasArrived={hasArrived}
                    />
                  ) : (
                    <>
                      {sel && (
                        <PinDetailCard
                          sel={sel}
                          onDirections={handleDirections}
                          onClose={() => {
                            setSel(null)
                            setSnap(0)
                          }}
                        />
                      )}
                      {sel && (
                        <p className="flex items-center gap-1 pt-1 text-xs font-extrabold uppercase tracking-wide text-brown-soft">
                          Các case lân cận khác{" "}
                          <ChevronRight className="size-3" />
                        </p>
                      )}
                      {resultList}
                    </>
                  )}
                </div>
              </BottomSheet>
            </>
          )}
        </section>

        {/* AREA 3: Desktop Right Contextual Case Panel or Navigation Panel (Docked Sidebar) */}
        {desktop && view === "map" && (sel || navTarget) && (
          <aside className="w-[380px] xl:w-[410px] shrink-0 min-h-0 flex flex-col border-l-2 border-brown/15 bg-paper z-20 shadow-soft animate-[rise_.2s_both]">
            {navTarget ? (
              <NavigationSheet
                destinationName={navTarget.name}
                destinationAddress={navTarget.address}
                routeData={navRouteData}
                loading={navLoading}
                profile={navProfile}
                onProfileChange={setNavProfile}
                isSimulating={isSimulating}
                speedMultiplier={speedMultiplier}
                onToggleSimulation={handleToggleSimulation}
                onSpeedChange={setSpeedMultiplier}
                isLive={isLive}
                onStartLiveGps={() =>
                  startLiveGps(navTarget.caseId || "HP-1041")
                }
                onShareLiveLink={() => setShowShareModal(true)}
                onOpenGoogleMaps={handleOpenGoogleMaps}
                onClose={handleCloseNavigation}
                progressPercent={progressPercent}
                hasArrived={hasArrived}
                mode="panel"
              />
            ) : sel ? (
              <div className="flex h-full flex-col min-h-0">
                <div className="flex items-center justify-between border-b-2 border-line bg-cream/40 px-4 py-3 shrink-0">
                  <Btn
                    variant="ghost"
                    size="sm"
                    onClick={() => setSel(null)}
                    icon={<ArrowLeft className="size-4" />}
                    className="!h-auto !px-2.5 !py-1.5 text-xs font-extrabold text-brown hover:bg-brown/10"
                  >
                    Đóng chi tiết
                  </Btn>
                  <IconBtn
                    label="Đóng chi tiết ca"
                    variant="ghost"
                    size="sm"
                    onClick={() => setSel(null)}
                    className="!size-8 !rounded-full hover:!bg-brown/10"
                  >
                    <X className="size-4" />
                  </IconBtn>
                </div>
                <div className="min-h-0 flex-1 overflow-y-auto p-4">
                  <PinDetailCard
                    sel={sel}
                    display="panel"
                    onDirections={handleDirections}
                    onClose={() => setSel(null)}
                  />
                </div>
              </div>
            ) : null}
          </aside>
        )}
      </div>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={`Bộ lọc${
          countFilters(draft) ? ` · ${countFilters(draft)}` : ""
        }`}
        wide
      >
        <div className="space-y-5">
          <FilterSection title="Loại">
            <div className="flex flex-wrap gap-2">
              {TYPES.map((t) => (
                <Chip
                  key={t}
                  active={draft.types.includes(t)}
                  icon={<LegendSwatch type={t} />}
                  onClick={() =>
                    setDraft({ ...draft, types: toggle(draft.types, t) })
                  }
                >
                  {PIN_META[t].label}
                </Chip>
              ))}
            </div>
          </FilterSection>
          <FilterSection title="Loài">
            <div className="flex flex-wrap gap-2">
              {["Chó", "Mèo", "Khác"].map((s) => (
                <Chip
                  key={s}
                  active={draft.species === s}
                  onClick={() =>
                    setDraft({
                      ...draft,
                      species: draft.species === s ? "" : s,
                    })
                  }
                >
                  {s}
                </Chip>
              ))}
            </div>
          </FilterSection>
          <FilterSection title="Khu vực">
            <div className="grid gap-3 sm:grid-cols-3">
              <Select
                aria-label="Quận / huyện"
                value={draft.district}
                onChange={(e) =>
                  setDraft({ ...draft, district: e.target.value })
                }
              >
                <option value="">Quận / huyện</option>
                {DISTRICTS.map((d) => (
                  <option key={d}>{d}</option>
                ))}
              </Select>
              <Input
                aria-label="Phường"
                value={draft.ward}
                onChange={(e) => setDraft({ ...draft, ward: e.target.value })}
                placeholder="Phường"
              />
              <Input
                aria-label="Đường"
                value={draft.street}
                onChange={(e) => setDraft({ ...draft, street: e.target.value })}
                placeholder="Đường / phố"
              />
            </div>
          </FilterSection>
          <FilterSection title="Bán kính">
            <div className="flex flex-wrap gap-2">
              {[1, 3, 5, 10].map((r) => (
                <Chip
                  key={r}
                  active={draft.radius === r}
                  onClick={() => setDraft({ ...draft, radius: r })}
                >
                  {r} km
                </Chip>
              ))}
            </div>
          </FilterSection>
          <FilterSection title="Thời điểm">
            <div className="flex flex-wrap gap-2">
              {TIME_OPTS.map(([v, l]) => (
                <Chip
                  key={v}
                  active={draft.time === v}
                  onClick={() => setDraft({ ...draft, time: v })}
                >
                  {l}
                </Chip>
              ))}
            </div>
          </FilterSection>
          <FilterSection title="Trạng thái">
            <div className="flex flex-wrap gap-2">
              {STATUSES.map(([v, l]) => (
                <Chip
                  key={v}
                  active={draft.status.includes(v)}
                  onClick={() =>
                    setDraft({ ...draft, status: toggle(draft.status, v) })
                  }
                >
                  <span
                    className={cx(
                      "mr-1.5 inline-block size-2 rounded-full",
                      v === "active"
                        ? "bg-coral"
                        : v === "progress"
                          ? "bg-amber-500"
                          : "bg-emerald-500",
                    )}
                  />
                  {l}
                </Chip>
              ))}
            </div>
            {draft.status.includes("resolved") && (
              <p className="mt-1.5 text-xs font-semibold text-brown-soft">
                Case đã giải quyết chỉ hiện trong danh sách (lịch sử), không
                hiện trên bản đồ trực tiếp.
              </p>
            )}
          </FilterSection>
          <details className="rounded-2xl border-2 border-line px-3 py-2">
            <summary className="cursor-pointer text-sm font-extrabold">
              Nâng cao: giống & màu lông
            </summary>
            <div className="mt-2 grid gap-3 sm:grid-cols-2">
              <Field label="Giống">
                <Input
                  value={draft.breed}
                  onChange={(e) =>
                    setDraft({ ...draft, breed: e.target.value })
                  }
                  placeholder="VD: Golden, Poodle…"
                />
              </Field>
              <Field label="Màu lông">
                <Select
                  value={draft.color}
                  onChange={(e) =>
                    setDraft({ ...draft, color: e.target.value })
                  }
                >
                  <option value="">Tất cả</option>
                  {["Vàng", "Trắng", "Xám", "Đen", "Nâu", "Kem"].map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </Select>
              </Field>
            </div>
          </details>
          <div className="sticky -bottom-6 -mx-6 -mb-6 flex gap-2 border-t-2 border-line bg-paper px-6 py-4">
            <Btn variant="soft" className="flex-1" onClick={() => setDraft(F0)}>
              Xóa bộ lọc
            </Btn>
            <Btn
              className="flex-[1.4]"
              onClick={() => {
                setF(draft)
                setOpen(false)
              }}
            >
              Áp dụng · {draftCount} kết quả
            </Btn>
          </div>
        </div>
      </Modal>

      <LiveTrackingModal
        open={showShareModal}
        onClose={() => setShowShareModal(false)}
        caseId={navTarget?.caseId || "HP-1041"}
        caseName={navTarget?.name}
        isLive={isLive || isSimulating}
      />
    </UserShell>
  )
}
void kmFrom
