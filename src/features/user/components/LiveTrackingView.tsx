import { useEffect, useState, useMemo } from "react"
import {
  ArrowLeft,
  Phone,
  Radio,
  Star,
  CheckCircle2,
  MapPin,
  Bike,
  Truck,
  PawPrint,
} from "lucide-react"
import { useApp } from "@/store"
import { Btn, IconBtn, BottomSheet, cx } from "@/components/ui"
import CityMap from "@/features/map/engine/MapEngine"
import { xyToLngLat, lngLatToXY } from "@/utils/geoConverter"
import { fetchRoute, type RouteData } from "@/services/routingService"
import { useLiveTracking } from "@/hooks/useLiveTracking"
import { rescuerById, MOCK_RESCUERS } from "@/constants/mock/users"
import { ME_POS } from "@/features/map/engine/MapEngine"
import { useMedia } from "@/hooks/useMedia"

export interface LiveTrackingViewProps {
  id: string
}

export default function LiveTrackingView({ id }: LiveTrackingViewProps) {
  const { go, getCase } = useApp()
  const desktop = useMedia("(min-width: 1024px)")
  const [drawerSnap, setDrawerSnap] = useState<0 | 1 | 2>(1)
  const c = getCase(id)

  const rescuer = useMemo(() => {
    if (c?.rescuerId) return rescuerById(c.rescuerId) || MOCK_RESCUERS[0]
    return MOCK_RESCUERS[0]
  }, [c?.rescuerId])

  const [routeData, setRouteData] = useState<RouteData | null>(null)

  // Live Tracking in Viewer Mode
  const {
    isLive,
    rescuerPos,
    heading,
    remainingDistanceKm,
    remainingEtaMinutes,
    progressPercent,
    hasArrived,
  } = useLiveTracking({ caseId: id, isViewer: true, rescuerId: rescuer?.id })

  // Compute Pet target coordinates
  const petLngLat = useMemo<[number, number]>(() => {
    if (!c) return [105.8542, 21.0285]
    return xyToLngLat(c.x, c.y)
  }, [c])

  // Initial Rescuer Start point (default from ME_POS if not yet moving)
  const defaultStartLngLat = useMemo<[number, number]>(() => {
    return xyToLngLat(ME_POS.x, ME_POS.y)
  }, [])

  // Fetch initial route
  useEffect(() => {
    let active = true

    fetchRoute(defaultStartLngLat, petLngLat, "driving")
      .then((res) => {
        if (active) {
          setRouteData(res)
        }
      })
      .catch((err) => {
        console.error("Failed to fetch initial route for viewer:", err)
      })

    return () => {
      active = false
    }
  }, [defaultStartLngLat, petLngLat])

  if (!c) {
    return (
      <div className="flex h-[100dvh] flex-col items-center justify-center p-6 text-center">
        <h2 className="font-display text-2xl font-black text-brown">
          Không tìm thấy ca cứu hộ
        </h2>
        <p className="mt-2 text-sm text-brown-soft">
          Ca cứu hộ này có thể đã kết thúc hoặc không tồn tại.
        </p>
        <Btn
          variant="primary"
          onClick={() => go("/home")}
          className="mt-4 font-extrabold"
        >
          Về bản đồ chính
        </Btn>
      </div>
    )
  }

  // Active current rescuer position
  const currentRescuerCoords = rescuerPos || defaultStartLngLat

  // Center between rescuer and pet
  const mapCenterXY = lngLatToXY(
    (currentRescuerCoords[0] + petLngLat[0]) / 2,
    (currentRescuerCoords[1] + petLngLat[1]) / 2,
  )

  const VehicleIcon = rescuer.vehicleType === "Xe máy" ? Bike : Truck

  // Shared Rescuer & Pet details JSX
  const trackingDetailsContent = (
    <div className="space-y-3.5 pb-6">
      {/* Status Alert Banner */}
      {hasArrived ? (
        <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-emerald-100 border-2 border-emerald-300 text-emerald-900">
          <CheckCircle2 className="size-6 text-emerald-600 shrink-0" />
          <div>
            <p className="text-xs font-black uppercase tracking-wide">
              ĐÃ TIẾP CẬN HIỆN TRƯỜNG!
            </p>
            <p className="text-[11px] font-bold text-emerald-700">
              Cứu hộ viên đã có mặt tại điểm báo tin để hỗ trợ bé.
            </p>
          </div>
        </div>
      ) : (
        <div className="flex items-baseline justify-between px-1">
          <div>
            <p className="text-[11px] font-black uppercase tracking-wider text-brown-soft flex items-center gap-1.5">
              <Radio className="size-3 text-emerald-600 animate-pulse" />
              Đang di chuyển tới hiện trường
            </p>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="font-display font-black text-2xl md:text-3xl text-emerald-700">
                {remainingEtaMinutes > 0
                  ? `~ ${remainingEtaMinutes} phút`
                  : "Dưới 1 phút"}
              </span>
              <span className="text-xs font-black text-brown-soft">
                (Còn {remainingDistanceKm > 0 ? remainingDistanceKm : "0.2"} km)
              </span>
            </div>
          </div>

          <span className="px-2.5 py-1 rounded-full bg-emerald-600 text-white text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shadow-sm">
            <span className="size-1.5 rounded-full bg-white animate-pulse" />
            LIVE
          </span>
        </div>
      )}

      {/* Progress Bar */}
      <div className="space-y-1 px-1">
        <div className="flex justify-between text-[10px] font-extrabold text-brown-soft">
          <span>Xuất phát</span>
          <span>{progressPercent}% hành trình</span>
          <span>Hiện trường</span>
        </div>
        <div className="h-2 w-full bg-brown/10 rounded-full overflow-hidden">
          <div
            className={cx(
              "h-full transition-all duration-300",
              hasArrived ? "bg-emerald-500" : "bg-emerald-600",
            )}
            style={{ width: `${Math.min(100, Math.max(8, progressPercent))}%` }}
          />
        </div>
      </div>

      {/* Rescuer Driver Profile Card */}
      <div className="flex items-center justify-between p-3 rounded-2xl bg-cream/70 border border-brown/15 shadow-xs">
        <div className="flex items-center gap-3 min-w-0">
          <div className="relative size-11 rounded-2xl bg-amber-200 border-2 border-brown flex items-center justify-center font-display font-black text-base text-brown shrink-0 shadow-sm">
            {rescuer.name.slice(0, 2).toUpperCase()}
            <div className="absolute -bottom-1 -right-1 size-4 rounded-full bg-emerald-500 border border-white" />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <h3 className="font-display font-black text-sm text-brown truncate">
                {rescuer.name}
              </h3>
              <span className="flex items-center text-[10px] font-black text-amber-600">
                <Star className="size-3 fill-amber-500 text-amber-500" />
                {rescuer.rating}
              </span>
            </div>
            <p className="text-xs font-bold text-brown-soft truncate">
              {rescuer.role}
            </p>
            <p className="text-[11px] font-black text-brown-soft flex items-center gap-1 mt-0.5">
              <VehicleIcon className="size-3" />
              {rescuer.vehicleType} · {rescuer.vehiclePlate}
            </p>
          </div>
        </div>

        {/* Direct Phone Call Button */}
        <a
          href={`tel:${rescuer.phone}`}
          className="size-10 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center shrink-0 shadow-[0_3px_0_var(--color-brown)] active:translate-y-0.5 active:shadow-none transition"
          title="Gọi điện cho cứu hộ viên"
        >
          <Phone className="size-5" />
        </a>
      </div>

      {/* DETAILED PET INFORMATION SECTION */}
      <div className="rounded-2xl border-2 border-brown/15 bg-paper p-3.5 space-y-3 shadow-xs">
        <div className="flex items-center justify-between border-b border-brown/10 pb-2">
          <h4 className="font-display text-sm font-black text-brown flex items-center gap-1.5">
            <PawPrint className="size-4 text-coral" />
            Bé thú cưng đang theo dõi
          </h4>
          <span
            className={cx(
              "px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wide",
              c.critical
                ? "bg-red-100 text-red-700 border border-red-200"
                : "bg-amber-100 text-amber-800 border border-amber-200",
            )}
          >
            {c.critical
              ? "Cấp cứu khẩn"
              : c.type === "rescue"
                ? "Cần cứu hộ"
                : "Pet thất lạc"}
          </span>
        </div>

        <div className="flex gap-3">
          {c.photo ? (
            <img
              src={c.photo}
              alt={c.name}
              className="size-20 rounded-2xl object-cover border-2 border-brown/20 shrink-0 shadow-xs"
            />
          ) : (
            <div className="size-20 rounded-2xl bg-amber-100 border-2 border-brown/20 flex items-center justify-center shrink-0">
              <PawPrint className="size-8 text-amber-600" />
            </div>
          )}

          <div className="min-w-0 flex-1 space-y-1">
            <h3 className="font-display font-black text-base text-brown leading-tight">
              {c.name}
            </h3>
            <p className="text-xs font-bold text-brown-soft">
              Loài: <strong>{c.species}</strong> · {c.breed}
            </p>
            <div className="flex flex-wrap gap-1 text-[11px] font-bold text-brown-soft pt-0.5">
              {c.gender && (
                <span className="px-1.5 py-0.5 rounded-md bg-cream border border-brown/15">
                  {c.gender}
                </span>
              )}
              {c.color && (
                <span className="px-1.5 py-0.5 rounded-md bg-cream border border-brown/15">
                  {c.color}
                </span>
              )}
              {c.weight && (
                <span className="px-1.5 py-0.5 rounded-md bg-cream border border-brown/15">
                  {c.weight}
                </span>
              )}
              {c.age && (
                <span className="px-1.5 py-0.5 rounded-md bg-cream border border-brown/15">
                  {c.age}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Condition & Description */}
        {c.condition && (
          <div className="p-2.5 rounded-xl bg-amber-50/70 border border-amber-200 text-xs">
            <p className="font-black text-amber-900 mb-0.5">Tình trạng ghi nhận:</p>
            <p className="font-bold text-amber-800 leading-relaxed">
              {c.condition}
            </p>
          </div>
        )}

        {c.desc && (
          <div className="text-xs font-bold text-brown-soft leading-relaxed">
            <p className="font-black text-brown mb-0.5">Mô tả hiện trường:</p>
            <p>{c.desc}</p>
          </div>
        )}

        {/* Location & Reporter */}
        <div className="space-y-1.5 pt-1 border-t border-brown/10 text-xs">
          <div className="flex items-center gap-1.5 text-brown font-bold">
            <MapPin className="size-3.5 text-coral shrink-0" />
            <span>
              {c.street}, Q. {c.district}, Hà Nội
            </span>
          </div>
          {c.reporter && (
            <div className="flex items-center justify-between text-[11px] text-brown-soft font-bold">
              <span>
                Người báo tin: <strong>{c.reporter}</strong>
              </span>
              <span>
                Hotline: <strong>1900 1234</strong>
              </span>
            </div>
          )}
        </div>

        {/* Action Button */}
        <Btn
          full
          variant="secondary"
          size="sm"
          onClick={() => go(`/case/${c.id}`)}
          className="font-extrabold text-xs mt-1"
        >
          Xem toàn bộ hồ sơ case
        </Btn>
      </div>
    </div>
  )

  return (
    <div className="relative h-[100dvh] w-full overflow-hidden bg-map-sand">
      {/* Top Floating App Bar */}
      <header className="absolute top-3 left-3 right-3 md:top-4 md:left-4 md:right-auto md:w-[420px] z-30 flex items-center justify-between rounded-2xl border-2 border-brown bg-paper/95 p-2.5 backdrop-blur-md shadow-soft">
        <div className="flex items-center gap-2 min-w-0">
          <IconBtn
            label="Quay lại"
            variant="ghost"
            size="sm"
            onClick={() => go(`/case/${c.id}`)}
            className="!size-8 shrink-0 hover:!bg-brown/10"
          >
            <ArrowLeft className="size-4" />
          </IconBtn>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span
                className={cx(
                  "size-2 rounded-full animate-pulse",
                  isLive ? "bg-emerald-500" : "bg-amber-500",
                )}
              />
              <p className="text-[10px] font-black uppercase tracking-wider text-emerald-800">
                {isLive ? "THEO DÕI GPS" : "THEO DÕI CỨU HỘ"}
              </p>
            </div>
            <h1 className="font-display text-sm font-black text-brown truncate leading-tight">
              {c.name} · {c.species} ({c.breed})
            </h1>
          </div>
        </div>

        <Btn
          size="sm"
          variant="secondary"
          onClick={() => go(`/case/${c.id}`)}
          className="text-xs font-black shrink-0 !h-8 !px-2.5"
        >
          Xem case
        </Btn>
      </header>

      {/* Full-bleed MapLibre Vector Map */}
      <div className="size-full">
        <CityMap
          className="size-full"
          cases={[c]}
          revealIds={[c.id]}
          dest={{ x: c.x, y: c.y, label: c.name }}
          center={{
            x: mapCenterXY.x,
            y: mapCenterXY.y,
            k: 1.4,
          }}
          routeCoords={routeData?.coordinates}
          routeColor="#2563eb"
          liveRescuer={{
            lng: currentRescuerCoords[0],
            lat: currentRescuerCoords[1],
            heading,
            name: rescuer.name,
            vehicleType: rescuer.vehicleType,
            isLive: true,
          }}
          controls
          controlsClass="top-20 right-3 md:bottom-6 md:right-6"
        />
      </div>

      {/* DESKTOP: Left Docked Contextual Sidebar */}
      {desktop ? (
        <aside className="absolute top-20 left-4 bottom-4 w-[420px] z-20 overflow-y-auto rounded-[28px] border-2 border-brown bg-paper/95 p-4 shadow-2xl backdrop-blur-md">
          {trackingDetailsContent}
        </aside>
      ) : (
        /* MOBILE: Draggable BottomSheet Drawer with 3 snap points (peek, half, full) */
        <BottomSheet
          snap={drawerSnap}
          onSnap={setDrawerSnap}
          peek={100}
          header={
            <div className="flex items-center justify-between px-4 pb-2">
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-black uppercase tracking-wider text-brown-soft flex items-center gap-1.5">
                  <Radio className="size-3 text-emerald-600 animate-pulse" />
                  {hasArrived ? "ĐÃ ĐẾN HIỆN TRƯỜNG" : "ĐANG TỚI HIỆN TRƯỜNG"}
                </p>
                <div className="flex items-baseline gap-2">
                  <span className="font-display font-black text-lg text-emerald-700">
                    {hasArrived
                      ? "Đã có mặt"
                      : remainingEtaMinutes > 0
                        ? `~ ${remainingEtaMinutes} phút`
                        : "Dưới 1 phút"}
                  </span>
                  {!hasArrived && (
                    <span className="text-xs font-black text-brown-soft">
                      (Còn {remainingDistanceKm > 0 ? remainingDistanceKm : "0.2"} km)
                    </span>
                  )}
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-emerald-600 text-white text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shadow-sm shrink-0">
                <span className="size-1.5 rounded-full bg-white animate-pulse" />
                LIVE GPS
              </span>
            </div>
          }
        >
          <div className="px-4 pt-1">
            {trackingDetailsContent}
          </div>
        </BottomSheet>
      )}
    </div>
  )
}

