import { useMemo, useState } from "react"
import {
  Circle,
  FileWarning,
  Hexagon,
  OctagonAlert,
  Sparkles,
  TriangleAlert,
  MapPin,
  Trash2,
  Undo2,
} from "lucide-react"
import { useApp } from "@/store"
import CityMap, { MapLegend, type Sel } from "@/features/map"
import { Badge, Note, Segmented, Btn, IconBtn, Input } from "@ui"
import {
  addRisk,
  centroid,
  removeRisk,
  useAdmin,
  type ARisk,
} from "../store/adminStore"
import {
  ABtn,
  AInput,
  ASelect,
  Confirm,
  FormRow,
  KpiCard,
  KpiRow,
  Panel,
  Title,
} from "./AdminCommon"

export const RISK_REASONS = [
  "Cảnh báo nghi trộm chó",
  "Có bẫy/bả",
  "Khu vực nguy hiểm",
]
const sevColor = (s: ARisk["severity"]) => (s === "Cao" ? "#d8503f" : "#8a63ab")

export function PolyZones({
  risks,
  selectedId,
}: {
  risks: ARisk[]
  selectedId?: string
}) {
  return (
    <g>
      {risks
        .filter((r) => r.poly)
        .map((r) => (
          <g key={r.id} pointerEvents="none">
            <polygon
              points={r.poly!.map((p) => p.join(",")).join(" ")}
              fill={sevColor(r.severity)}
              opacity={selectedId === r.id ? 0.32 : 0.18}
              stroke={sevColor(r.severity)}
              strokeWidth={2.5}
              strokeDasharray="7 6"
            />
            <polygon
              points={r.poly!.map((p) => p.join(",")).join(" ")}
              fill="none"
              stroke={sevColor(r.severity)}
              strokeWidth={2.5}
              strokeDasharray="7 6"
            />
          </g>
        ))}
    </g>
  )
}

export default function RiskPage() {
  const { toast } = useApp()
  const { risks } = useAdmin()
  const [mode, setMode] = useState<"circle" | "polygon">("circle")
  const [center, setCenter] = useState<{ x: number; y: number } | null>(null)
  const [radius, setRadius] = useState(55)
  const [pts, setPts] = useState<[number, number][]>([])
  const [reason, setReason] = useState(RISK_REASONS[0])
  const [severity, setSeverity] = useState<ARisk["severity"]>("Cao")
  const [expiry, setExpiry] = useState("2026-11-15")
  const [sel, setSel] = useState<Sel | null>(null)
  const [del, setDel] = useState<ARisk | null>(null)
  const [focus, setFocus] = useState("init")

  const circles = useMemo(() => risks.filter((r) => !r.poly), [risks])
  const ready = mode === "circle" ? !!center : pts.length >= 3

  const onMapClick = (x: number, y: number) => {
    x = Math.round(x)
    y = Math.round(y)
    if (mode === "circle") setCenter({ x, y })
    else setPts((p) => [...p, [x, y]])
  }
  const reset = () => {
    setCenter(null)
    setPts([])
  }
  const save = () => {
    if (!ready) return
    const [dy, dm, dd] = [
      expiry.slice(8, 10),
      expiry.slice(5, 7),
      expiry.slice(0, 4),
    ]
    const base = {
      id: "r" + Date.now(),
      title: reason,
      type: reason,
      severity,
      note: "Khu vực do admin tạo thủ công.",
      expires: expiry ? `${dy}/${dm}/${dd}` : "—",
      reports: 0,
      isNew: true,
    }
    if (mode === "circle" && center)
      addRisk({ ...base, x: center.x, y: center.y, r: radius })
    else {
      const [cx, cy] = centroid(pts)
      addRisk({
        ...base,
        x: Math.round(cx),
        y: Math.round(cy),
        r: 0,
        poly: pts,
      })
    }
    toast("Đã thêm khu vực cảnh báo lên bản đồ")
    reset()
  }
  const selRisk = risks.find((r) => r.id === sel?.id)

  const extras = (
    <g>
      <PolyZones risks={risks} selectedId={sel?.id} />
      {mode === "circle" && center && (
        <circle
          cx={center.x}
          cy={center.y}
          r={radius}
          fill="#fff27a"
          opacity={0.35}
          stroke="#6b4128"
          strokeWidth={2}
          strokeDasharray="8 6"
          pointerEvents="none"
        />
      )}
      {mode === "polygon" && pts.length > 0 && (
        <g pointerEvents="none">
          {pts.length >= 3 && (
            <polygon
              points={pts.map((p) => p.join(",")).join(" ")}
              fill="#fff27a"
              opacity={0.4}
            />
          )}
          <polyline
            points={[...pts, ...(pts.length >= 3 ? [pts[0]] : [])]
              .map((p) => p.join(","))
              .join(" ")}
            fill="none"
            stroke="#6b4128"
            strokeWidth={2.5}
            strokeDasharray="6 5"
          />
          {pts.map((p, i) => (
            <circle
              key={i}
              cx={p[0]}
              cy={p[1]}
              r={6}
              fill="#fff27a"
              stroke="#6b4128"
              strokeWidth={2.5}
            />
          ))}
        </g>
      )}
    </g>
  )

  return (
    <div>
      <Title
        title="Risk areas"
        sub="Click lên bản đồ để đặt khu vực cảnh báo hoặc vẽ vùng đa giác"
      />
      <KpiRow>
        <KpiCard
          icon={<TriangleAlert />}
          label="Risk areas"
          value={risks.length}
          tone="bg-plum-soft text-plum"
        />
        <KpiCard
          icon={<OctagonAlert />}
          label="Mức Cao"
          value={risks.filter((r) => r.severity === "Cao").length}
          tone="bg-coral-soft text-coral"
        />
        <KpiCard
          icon={<Sparkles />}
          label="Mới tạo"
          value={risks.filter((r) => r.isNew).length}
          tone="bg-orange-soft text-orange"
        />
        <KpiCard
          icon={<FileWarning />}
          label="Report liên quan"
          value={risks.reduce((a, r) => a + r.reports, 0)}
        />
      </KpiRow>
      <div className="grid gap-4 xl:grid-cols-[1fr_380px]">
        <div className="min-w-0">
          <div className="relative overflow-hidden rounded-2xl border-2 border-line">
            <CityMap
              className="h-[340px] sm:h-[420px] lg:h-[560px]"
              risks={circles}
              selected={sel}
              onSelect={(s) => {
                setSel(s)
                if (s) setFocus(s.id)
              }}
              onMapClick={onMapClick}
              dropPin={mode === "circle" ? center : null}
              extras={extras}
              showLabels
              center={{ x: 450, y: 340, k: 1 }}
              focusKey={focus}
            />
          </div>
          <MapLegend className="mt-2" />
        </div>

        <div className="space-y-4">
          <Panel title="Tạo khu vực mới">
            <div className="space-y-3">
              <Segmented
                value={mode}
                onChange={(m) => {
                  setMode(m)
                  reset()
                }}
                options={[
                  {
                    v: "circle",
                    label: (
                      <span className="flex items-center gap-1 text-xs">
                        <Circle className="size-3.5" />
                        Bán kính
                      </span>
                    ),
                  },
                  {
                    v: "polygon",
                    label: (
                      <span className="flex items-center gap-1 text-xs">
                        <Hexagon className="size-3.5" />
                        Đa giác
                      </span>
                    ),
                  },
                ]}
              />
              {mode === "circle" ? (
                <FormRow
                  label={`Bán kính: ${radius} đv (~${(radius / 62).toFixed(1)} km)`}
                >
                  <Input
                    type="range"
                    min={20}
                    max={120}
                    value={radius}
                    onChange={(e) => setRadius(+e.target.value)}
                    className="w-full accent-brown"
                    aria-label="Bán kính"
                  />
                </FormRow>
              ) : (
                <div className="flex items-center justify-between rounded-xl bg-cream-2/70 px-3 py-2 text-sm font-bold">
                  <span>
                    {pts.length} điểm {pts.length < 3 && "(cần ít nhất 3)"}
                  </span>
                  <ABtn
                    s="xs"
                    icon={<Undo2 />}
                    disabled={!pts.length}
                    onClick={() => setPts((p) => p.slice(0, -1))}
                  >
                    Hoàn tác
                  </ABtn>
                </div>
              )}
              {!ready && (
                <Note
                  tone="butter"
                  icon={<MapPin className="size-4 shrink-0" />}
                >
                  {mode === "circle"
                    ? "Click vào bản đồ để chọn tâm khu vực."
                    : "Click nhiều điểm trên bản đồ để vẽ đa giác."}
                </Note>
              )}
              <FormRow label="Lý do">
                <ASelect
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                >
                  {RISK_REASONS.map((r) => (
                    <option key={r}>{r}</option>
                  ))}
                </ASelect>
              </FormRow>
              <div className="grid grid-cols-2 gap-2">
                <FormRow label="Mức độ">
                  <ASelect
                    value={severity}
                    onChange={(e) =>
                      setSeverity(e.target.value as ARisk["severity"])
                    }
                  >
                    <option>Cao</option>
                    <option>Trung bình</option>
                    <option>Thấp</option>
                  </ASelect>
                </FormRow>
                <FormRow label="Hết hạn">
                  <AInput
                    type="date"
                    value={expiry}
                    onChange={(e) => setExpiry(e.target.value)}
                  />
                </FormRow>
              </div>
              <div className="flex gap-2">
                <ABtn
                  v="dark"
                  disabled={!ready}
                  onClick={save}
                  className="flex-1"
                >
                  Thêm khu vực
                </ABtn>
                <ABtn onClick={reset}>Xóa nháp</ABtn>
              </div>
            </div>
          </Panel>

          <Panel title={`Khu vực hiện có (${risks.length})`}>
            <ul className="max-h-[360px] space-y-2 overflow-y-auto">
              {risks.map((r) => (
                <li
                  key={r.id}
                  className={`rounded-xl border-2 p-2.5 text-sm transition ${
                    sel?.id === r.id
                      ? "border-brown bg-butter/30"
                      : "border-line"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <Btn
                      variant="ghost"
                      size="sm"
                      className="min-w-0 h-auto p-0 flex flex-col items-start text-left"
                      onClick={() => {
                        setSel({ kind: "risk", id: r.id })
                        setFocus(r.id + Date.now())
                      }}
                    >
                      <b className="block truncate">{r.title}</b>
                      <span className="text-xs text-brown-soft">
                        {r.poly
                          ? "Đa giác"
                          : `Bán kính ~${(r.r / 62).toFixed(1)} km`}{" "}
                        · hết hạn {r.expires}
                      </span>
                    </Btn>
                    <div className="flex shrink-0 items-center gap-1.5">
                      <Badge
                        tone={
                          r.severity === "Cao"
                            ? "coral"
                            : r.severity === "Trung bình"
                              ? "plum"
                              : "sky"
                        }
                      >
                        {r.severity}
                      </Badge>
                      <IconBtn
                        variant="ghost"
                        size="sm"
                        onClick={() => setDel(r)}
                        label={`Xóa ${r.title}`}
                        className="size-8 text-coral hover:bg-coral-soft"
                      >
                        <Trash2 className="size-4" />
                      </IconBtn>
                    </div>
                  </div>
                </li>
              ))}
              {risks.length === 0 && (
                <li className="py-6 text-center text-sm text-brown-soft">
                  Chưa có khu vực nào.
                </li>
              )}
            </ul>
            {selRisk && (
              <p className="mt-2 text-xs text-brown-soft">{selRisk.note}</p>
            )}
          </Panel>
        </div>
      </div>
      <Confirm
        open={!!del}
        onClose={() => setDel(null)}
        title="Xóa khu vực cảnh báo?"
        body={
          <>
            Khu vực <b>{del?.title}</b> sẽ biến mất khỏi bản đồ.
          </>
        }
        onOk={() => {
          if (del) {
            removeRisk(del.id)
            if (sel?.id === del.id) setSel(null)
            toast("Đã xóa khu vực")
          }
        }}
      />
    </div>
  )
}
