import { useState } from "react"
import {
  Navigation,
  Compass,
  MapPin,
  Play,
  Square,
  Share2,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  X,
  Bike,
  Footprints,
  CornerUpLeft,
  CornerUpRight,
  ArrowUp,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Radio,
} from "lucide-react"
import { Btn, IconBtn, cx } from "@/components/ui"
import type { RouteData, RouteStep, RoutingProfile } from "@/services/routingService"
import { formatDistance, formatDuration } from "@/services/routingService"

export interface NavigationContentProps {
  destinationName?: string
  destinationAddress?: string
  routeData: RouteData | null
  loading?: boolean
  profile: RoutingProfile
  onProfileChange: (p: RoutingProfile) => void
  isSimulating: boolean
  speedMultiplier: number
  onToggleSimulation: () => void
  onSpeedChange: (speed: number) => void
  isLive: boolean
  onStartLiveGps: () => void
  onShareLiveLink: () => void
  onOpenGoogleMaps: () => void
  progressPercent?: number
  hasArrived?: boolean
  defaultShowSteps?: boolean
  onClose?: () => void
}

function getStepIcon(step: RouteStep) {
  const instruction = step.instruction.toLowerCase()
  if (instruction.includes("rẽ trái") || instruction.includes("chếch sang trái")) {
    return <CornerUpLeft className="size-4 text-sky-600" />
  }
  if (instruction.includes("rẽ phải") || instruction.includes("chếch sang phải")) {
    return <CornerUpRight className="size-4 text-amber-600" />
  }
  if (instruction.includes("quay đầu")) {
    return <RotateCcw className="size-4 text-purple-600" />
  }
  if (instruction.includes("đã đến")) {
    return <CheckCircle2 className="size-4 text-emerald-600" />
  }
  return <ArrowUp className="size-4 text-brown-soft" />
}

/**
 * Reusable core navigation view (mode-independent)
 */
export function NavigationContent({
  routeData,
  loading = false,
  profile,
  onProfileChange,
  isSimulating,
  speedMultiplier,
  onToggleSimulation,
  onSpeedChange,
  isLive,
  onStartLiveGps,
  onShareLiveLink,
  onOpenGoogleMaps,
  progressPercent = 0,
  hasArrived = false,
  defaultShowSteps = false,
}: NavigationContentProps) {
  const [showSteps, setShowSteps] = useState(defaultShowSteps)

  return (
    <div className="space-y-3">
      {/* Profile Tabs */}
      <div className="flex rounded-xl bg-brown/10 p-1 gap-1">
        <Btn
          type="button"
          size="sm"
          variant={profile === "driving" ? "secondary" : "ghost"}
          onClick={() => onProfileChange("driving")}
          className={cx(
            "!h-8 flex-1 !border-none !shadow-none text-xs font-extrabold",
            profile === "driving"
              ? "!bg-paper !text-brown"
              : "!text-brown-soft hover:!text-brown",
          )}
          icon={<Bike className="size-4" />}
        >
          Xe máy / Ô tô
        </Btn>
        <Btn
          type="button"
          size="sm"
          variant={profile === "walking" ? "secondary" : "ghost"}
          onClick={() => onProfileChange("walking")}
          className={cx(
            "!h-8 flex-1 !border-none !shadow-none text-xs font-extrabold",
            profile === "walking"
              ? "!bg-paper !text-brown"
              : "!text-brown-soft hover:!text-brown",
          )}
          icon={<Footprints className="size-4" />}
        >
          Đi bộ
        </Btn>
      </div>

      {/* ETA & Distance Summary */}
      {loading ? (
        <div className="py-4 flex flex-col items-center justify-center gap-2 text-brown-soft">
          <div className="size-5 border-2 border-brown border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-bold">Đang tính toán tuyến đường tối ưu...</p>
        </div>
      ) : routeData ? (
        <>
          <div className="flex items-baseline justify-between bg-cream/70 rounded-2xl p-3 border border-brown/15 shadow-xs">
            <div>
              <div className="flex items-baseline gap-2">
                <span className="font-display font-black text-2xl md:text-3xl text-emerald-700 tracking-tight">
                  {formatDuration(routeData.durationSeconds)}
                </span>
                <span className="text-xs md:text-sm font-black text-brown-soft">
                  ({formatDistance(routeData.distanceMeters)})
                </span>
              </div>
              <p className="text-xs font-bold text-brown truncate mt-0.5">
                {routeData.summary}
              </p>
            </div>

            {routeData.isFallback && (
              <span
                title="Đang dùng tuyến đường nội suy dự phòng"
                className="px-2 py-0.5 rounded-full bg-amber-100 border border-amber-300 text-amber-800 text-[10px] font-extrabold flex items-center gap-1"
              >
                <AlertTriangle className="size-3 text-amber-600" />
                Ngoại tuyến
              </span>
            )}
          </div>

          {/* Progress Bar (during simulation or tracking) */}
          {(isSimulating || isLive) && (
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] font-extrabold text-brown">
                <span className="flex items-center gap-1 text-emerald-700">
                  <Radio className="size-3 animate-pulse" />
                  {hasArrived ? "Đã tới hiện trường!" : "Đang di chuyển"}
                </span>
                <span>{progressPercent}%</span>
              </div>
              <div className="h-2 w-full bg-brown/10 rounded-full overflow-hidden">
                <div
                  className={cx(
                    "h-full transition-all duration-300",
                    hasArrived ? "bg-emerald-500" : "bg-blue-600",
                  )}
                  style={{ width: `${Math.min(100, Math.max(5, progressPercent))}%` }}
                />
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2 pt-0.5">
            <Btn
              size="sm"
              variant={isSimulating ? "danger" : "primary"}
              onClick={onToggleSimulation}
              icon={isSimulating ? <Square className="size-4" /> : <Play className="size-4" />}
              className="font-extrabold text-xs shadow-[0_3px_0_var(--color-brown)] active:translate-y-0.5 active:shadow-none"
            >
              {isSimulating ? "Dừng mô phỏng" : "Mô phỏng chạy"}
            </Btn>

            <Btn
              size="sm"
              variant="secondary"
              onClick={onShareLiveLink}
              icon={<Share2 className="size-4" />}
              className="font-extrabold text-xs"
            >
              Chia sẻ vị trí
            </Btn>
          </div>

          {/* Simulation Speed Controls when active */}
          {isSimulating && (
            <div className="flex items-center justify-between px-2.5 py-1.5 rounded-xl bg-butter/50 border border-brown/15 text-xs font-bold">
              <span className="text-brown text-[11px]">Tốc độ mô phỏng:</span>
              <div className="flex gap-1">
                {[1, 2, 5, 10].map((s) => (
                  <Btn
                    key={s}
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={() => onSpeedChange(s)}
                    className={cx(
                      "!h-6 !px-2 !py-0 !border-none !shadow-none !rounded-md text-[11px] font-black transition",
                      speedMultiplier === s
                        ? "!bg-brown !text-white"
                        : "!bg-paper !text-brown hover:!bg-brown/10",
                    )}
                  >
                    {s}x
                  </Btn>
                ))}
              </div>
            </div>
          )}

          {/* Google Maps link & Real GPS toggle */}
          <div className="flex items-center justify-between pt-1 border-t border-brown/10 text-xs">
            <Btn
              type="button"
              variant="ghost"
              size="sm"
              onClick={onStartLiveGps}
              className={cx(
                "!h-7 !px-1.5 !border-none !shadow-none font-extrabold text-xs",
                isLive ? "!text-emerald-700" : "!text-brown-soft hover:!text-brown",
              )}
              icon={<Compass className="size-3.5" />}
            >
              {isLive ? "Đang bật GPS thật" : "Bật GPS thiết bị"}
            </Btn>

            <Btn
              type="button"
              variant="ghost"
              size="sm"
              onClick={onOpenGoogleMaps}
              className="!h-7 !px-1.5 !border-none !shadow-none !text-sky-700 hover:!text-sky-800 font-extrabold text-xs flex items-center gap-1"
            >
              Mở Google Maps
              <ExternalLink className="size-3" />
            </Btn>
          </div>

          {/* Turn-by-Turn Collapsible List */}
          {routeData.steps && routeData.steps.length > 0 && (
            <div className="border-t border-brown/15 pt-2">
              <Btn
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setShowSteps(!showSteps)}
                className="w-full !justify-between !h-8 !px-1 !border-none !shadow-none text-xs font-extrabold text-brown hover:!bg-brown/5 rounded-lg"
              >
                <span>Chỉ dẫn từng ngã rẽ ({routeData.steps.length} bước)</span>
                {showSteps ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
              </Btn>

              {showSteps && (
                <div className="mt-2 space-y-2 max-h-56 overflow-y-auto pr-1">
                  {routeData.steps.map((st, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-2.5 p-2 rounded-xl bg-cream/50 border border-brown/10 text-xs shadow-2xs"
                    >
                      <div className="mt-0.5 size-6 rounded-lg bg-paper border border-brown/20 flex items-center justify-center shrink-0">
                        {getStepIcon(st)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-extrabold text-brown leading-tight">
                          {st.instruction}
                        </p>
                        {st.distance > 0 && (
                          <p className="text-[11px] font-bold text-brown-soft mt-0.5">
                            {formatDistance(st.distance)} · {formatDuration(st.duration)}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </>
      ) : (
        <p className="py-3 text-center text-xs font-bold text-brown-soft">
          Chưa thể tải dữ liệu đường đi. Vui lòng thử lại.
        </p>
      )}
    </div>
  )
}

export interface NavigationSheetProps extends NavigationContentProps {
  destinationName: string
  destinationAddress?: string
  onClose: () => void
  className?: string
  mode?: "panel" | "floating"
}

export function NavigationSheet({
  destinationName,
  destinationAddress,
  routeData,
  loading = false,
  profile,
  onProfileChange,
  isSimulating,
  speedMultiplier,
  onToggleSimulation,
  onSpeedChange,
  isLive,
  onStartLiveGps,
  onShareLiveLink,
  onOpenGoogleMaps,
  onClose,
  progressPercent = 0,
  hasArrived = false,
  className,
  mode = "floating",
}: NavigationSheetProps) {
  // If panel mode (docked in right sidebar on Desktop)
  if (mode === "panel") {
    return (
      <div className={cx("flex h-full flex-col min-h-0 bg-paper", className)}>
        {/* Pinned Desktop Header */}
        <div className="flex items-center justify-between border-b-2 border-line bg-cream/40 px-4 py-3 shrink-0">
          <div className="flex items-center gap-2.5 min-w-0 pr-2">
            <div className="size-8 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-sm">
              <Navigation className="size-4" />
            </div>
            <div className="min-w-0">
              <h4 className="font-display font-black text-sm text-brown truncate leading-tight">
                {destinationName}
              </h4>
              {destinationAddress && (
                <p className="text-[11px] font-bold text-brown-soft truncate flex items-center gap-1">
                  <MapPin className="size-3 shrink-0" />
                  {destinationAddress}
                </p>
              )}
            </div>
          </div>

          <IconBtn
            label="Đóng chỉ đường"
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="!size-8 !rounded-full hover:!bg-brown/10 shrink-0"
          >
            <X className="size-4" />
          </IconBtn>
        </div>

        {/* Scrollable Body */}
        <div className="min-h-0 flex-1 overflow-y-auto p-4">
          <NavigationContent
            routeData={routeData}
            loading={loading}
            profile={profile}
            onProfileChange={onProfileChange}
            isSimulating={isSimulating}
            speedMultiplier={speedMultiplier}
            onToggleSimulation={onToggleSimulation}
            onSpeedChange={onSpeedChange}
            isLive={isLive}
            onStartLiveGps={onStartLiveGps}
            onShareLiveLink={onShareLiveLink}
            onOpenGoogleMaps={onOpenGoogleMaps}
            progressPercent={progressPercent}
            hasArrived={hasArrived}
            defaultShowSteps={true}
          />
        </div>
      </div>
    )
  }

  // Floating mode with pinned header (z-[120] to stay above all map markers)
  return (
    <div
      className={cx(
        "absolute bottom-6 left-6 w-[410px] z-[120] flex flex-col max-h-[80vh]",
        "bg-paper/95 backdrop-blur-md border-2 border-brown rounded-[24px] shadow-2xl overflow-hidden",
        "transition-all duration-300 animate-[rise_.25s_both]",
        className,
      )}
    >
      {/* Pinned Header (shrink-0 so never gets pushed off-screen) */}
      <div className="flex items-start justify-between p-3.5 border-b-2 border-brown/15 bg-butter/40 shrink-0">
        <div className="flex items-center gap-2.5 min-w-0 pr-2">
          <div className="size-9 rounded-2xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-sm">
            <Navigation className="size-5" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-black uppercase tracking-wider text-brown-soft">
              Chỉ đường tới
            </p>
            <h4 className="font-display font-black text-sm md:text-base text-brown truncate leading-tight">
              {destinationName}
            </h4>
            {destinationAddress && (
              <p className="text-xs font-bold text-brown-soft truncate mt-0.5 flex items-center gap-1">
                <MapPin className="size-3 shrink-0" />
                {destinationAddress}
              </p>
            )}
          </div>
        </div>

        <IconBtn
          label="Đóng chỉ đường"
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="!size-8 !rounded-full hover:!bg-brown/10 shrink-0"
        >
          <X className="size-4" />
        </IconBtn>
      </div>

      {/* Scrollable Body */}
      <div className="p-3.5 space-y-3 min-h-0 flex-1 overflow-y-auto">
        <NavigationContent
          routeData={routeData}
          loading={loading}
          profile={profile}
          onProfileChange={onProfileChange}
          isSimulating={isSimulating}
          speedMultiplier={speedMultiplier}
          onToggleSimulation={onToggleSimulation}
          onSpeedChange={onSpeedChange}
          isLive={isLive}
          onStartLiveGps={onStartLiveGps}
          onShareLiveLink={onShareLiveLink}
          onOpenGoogleMaps={onOpenGoogleMaps}
          progressPercent={progressPercent}
          hasArrived={hasArrived}
        />
      </div>
    </div>
  )
}
