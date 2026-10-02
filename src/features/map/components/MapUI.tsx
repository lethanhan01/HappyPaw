import type { ReactNode } from "react"
import { SearchInput, PinDetailCard } from "@/components/common"
import type { Case } from "@/types/case"
import {
  PIN_META,
  caseType,
  kmFrom,
  type PinType,
  type Sel,
} from "../engine/MapEngine"

/* ---------- Filters ---------- */
export type StatusKey = "active" | "progress" | "resolved"
export interface Filters {
  types: PinType[]
  species: string
  district: string
  ward: string
  street: string
  breed: string
  color: string
  radius: number
  time: number
  status: StatusKey[]
}

export const F0: Filters = {
  types: [],
  species: "",
  district: "",
  ward: "",
  street: "",
  breed: "",
  color: "",
  radius: 10,
  time: 0,
  status: [],
}

export const TIME_OPTS: [number, string][] = [
  [0, "Mọi lúc"],
  [15, "15 phút"],
  [60, "1 giờ"],
  [360, "6 giờ"],
  [1440, "24 giờ"],
  [10080, "7 ngày"],
]

export function countFilters(f: Filters) {
  return (
    f.types.length +
    f.status.length +
    (f.time ? 1 : 0) +
    (f.radius !== F0.radius ? 1 : 0) +
    [f.species, f.district, f.ward, f.street, f.breed, f.color].filter(Boolean)
      .length
  )
}

const stKey = (c: Case): StatusKey =>
  c.status === "pending" ? "progress" : c.status
export const placeAllowed = (f: Filters, t: PinType) =>
  f.types.length === 0 || f.types.includes(t)

export function matchCase(c: Case, f: Filters, q = "") {
  const st = f.status.length ? f.status : ["active", "progress"] as StatusKey[]
  if (!st.includes(stKey(c))) return false
  const t = q.trim().toLowerCase()
  if (
    t &&
    ![c.name, c.district, c.street, c.breed, c.color, c.species, c.desc]
      .join(" ")
      .toLowerCase()
      .includes(t)
  )
    return false
  if (kmFrom(c.x, c.y) > f.radius) return false
  if (!placeAllowed(f, caseType(c))) return false
  if (f.species && c.species !== f.species) return false
  if (f.breed && !c.breed.toLowerCase().includes(f.breed.toLowerCase()))
    return false
  if (f.color && !c.color.toLowerCase().includes(f.color.toLowerCase()))
    return false
  if (f.district && c.district !== f.district) return false
  if (
    f.ward &&
    !`${c.street} ${c.desc}`.toLowerCase().includes(f.ward.toLowerCase())
  )
    return false
  if (f.street && !c.street.toLowerCase().includes(f.street.toLowerCase()))
    return false
  if (f.time && c.minutesAgo > f.time) return false
  return true
}

export function approxLoc(c: Case) {
  return c.critical && c.status === "active"
    ? `Khu vực ${c.district} (xấp xỉ ~500m)`
    : `${c.street}, ${c.district}`
}

/* ---------- Search ---------- */
export interface SearchHit {
  key: string
  label: string
  sub: string
  type: PinType
  onPick: () => void
}

const SUGGESTED = [
  "Cần cứu hộ gần tôi",
  "Mèo bị thương",
  "Chó vàng thất lạc",
  "Mái ấm Đống Đa",
  "Phòng khám 24h",
]

export function SearchBar({
  value,
  onChange,
  hits,
  recent,
  onCommit,
  onClearRecent,
  className,
  size = "md",
  rightAction,
}: {
  value: string
  onChange: (v: string) => void
  hits: SearchHit[]
  recent: string[]
  onCommit: (v: string) => void
  onClearRecent: () => void
  className?: string
  size?: "md" | "lg"
  rightAction?: ReactNode
}) {
  return (
    <SearchInput
      value={value}
      onChange={onChange}
      onCommit={onCommit}
      placeholder="Tìm pet, đường, quận, mái ấm, phòng khám…"
      ariaLabel="Tìm kiếm trên bản đồ"
      mode="rich"
      size={size}
      hits={hits.map((h) => ({
        key: h.key,
        label: h.label,
        sub: h.sub,
        dotColor: PIN_META[h.type].color,
        onPick: h.onPick,
      }))}
      recent={recent}
      suggestions={SUGGESTED}
      onClearRecent={onClearRecent}
      rightAction={rightAction}
      className={className}
    />
  )
}

/* ---------- Preview card (click on a pin) ---------- */
export function MapPreview({
  sel,
  onClose,
  className,
}: {
  sel: Sel
  onClose: () => void
  className?: string
}) {
  return (
    <PinDetailCard
      sel={sel}
      onClose={onClose}
      display="popup"
      className={className}
    />
  )
}

