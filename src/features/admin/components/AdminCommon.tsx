import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type InputHTMLAttributes,
  type ReactNode,
  type SelectHTMLAttributes,
} from "react"
import {
  AlertCircle,
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  ChevronsUpDown,
  Info,
  MoreVertical,
  OctagonAlert,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react"
import { useApp } from "@/store"
import type { Case, Report } from "@/types"
import { userById } from "@/constants"
import {
  Avatar,
  Badge,
  Modal,
  Btn,
  IconBtn,
  Input,
  Select,
  Textarea,
} from "@ui"
import { cx } from "@/lib"
import { useAdmin } from "../store/adminStore"

/* ---------- layout primitives ---------- */
export function Panel({
  className,
  children,
  title,
  right,
  pad = true,
}: {
  className?: string
  children: ReactNode
  title?: ReactNode
  right?: ReactNode
  pad?: boolean
}) {
  return (
    <section
      className={cx(
        "min-w-0 rounded-2xl border border-line bg-paper",
        className,
      )}
    >
      {(title || right) && (
        <header className="flex flex-wrap items-center justify-between gap-2 px-4 pt-3.5">
          <h2 className="font-display text-[15px] font-bold leading-tight">
            {title}
          </h2>
          {right}
        </header>
      )}
      <div className={cx(pad ? "p-4" : "", title && pad ? "pt-3" : "")}>
        {children}
      </div>
    </section>
  )
}

export function Title({
  title,
  sub,
  right,
  back,
}: {
  title: string
  sub?: string
  right?: ReactNode
  back?: () => void
}) {
  return (
    <div className="mb-3 flex flex-wrap items-end md:mb-4 justify-between gap-3">
      <div className="min-w-0">
        {back && (
          <Btn
            variant="ghost"
            size="sm"
            onClick={back}
            className="mb-0.5 inline h-auto p-0 text-xs font-extrabold text-brown-soft hover:text-brown"
          >
            ← Quay lại
          </Btn>
        )}
        <h1 className="font-display text-xl font-bold leading-tight md:text-2xl">
          {title}
        </h1>
        {sub && <p className="text-sm text-brown-soft">{sub}</p>}
      </div>
      {right && (
        <div className="flex flex-wrap items-center gap-2">{right}</div>
      )}
    </div>
  )
}

type V = "dark" | "primary" | "outline" | "danger" | "ghost" | "soft" | "ok"
const bv: Record<V, string> = {
  dark: "bg-ink text-white border-ink hover:bg-brown",
  primary: "bg-butter text-brown border-brown hover:bg-butter-2",
  outline: "bg-paper text-brown border-line hover:border-brown",
  danger: "bg-coral text-white border-coral hover:bg-coral-hover",
  ghost: "bg-transparent text-brown border-transparent hover:bg-brown/10",
  soft: "bg-cream-2 text-brown border-transparent hover:bg-peach",
  ok: "bg-sage-2 text-white border-sage-2 hover:bg-sage-hover",
}
export function ABtn({
  v = "outline",
  s = "md",
  icon,
  className,
  children,
  ...p
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  v?: V
  s?: "xs" | "sm" | "md"
  icon?: ReactNode
}) {
  const bSize = s === "md" ? "md" : "sm"
  const bVar =
    v === "ok"
      ? "ghost"
      : v === "primary"
        ? "primary"
        : v === "dark"
          ? "dark"
          : v === "danger"
            ? "danger"
            : v === "soft"
              ? "soft"
              : v === "ghost"
                ? "ghost"
                : "outline"
  return (
    <Btn
      variant={bVar}
      size={bSize}
      icon={icon}
      {...p}
      className={cx(
        "shrink-0 border-[1.5px]",
        s === "xs" && "h-11 px-2.5 text-xs md:h-7 md:px-2 [&_svg]:size-3.5",
        s === "sm" && "h-11 px-3 text-[13px] md:h-8",
        s === "md" && "h-11 px-3.5 text-sm md:h-9",
        bv[v],
        className,
      )}
    >
      {children}
    </Btn>
  )
}

const inp =
  "h-11 w-full md:h-9 rounded-xl border-[1.5px] border-line bg-white px-3 text-sm font-semibold text-brown placeholder:font-medium placeholder:text-brown/45 focus:border-brown focus:outline-none focus:ring-2 focus:ring-butter"
export const AInput = ({
  className,
  ...p
}: Omit<InputHTMLAttributes<HTMLInputElement>, "size">) => (
  <Input size="sm" {...p} className={cx(inp, className)} />
)
export const ASelect = ({
  className,
  children,
  ...p
}: Omit<SelectHTMLAttributes<HTMLSelectElement>, "size">) => (
  <Select
    size="sm"
    {...p}
    className={cx(inp, "cursor-pointer pr-2", className)}
  >
    {children}
  </Select>
)
export const ATextarea = ({
  className,
  ...p
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => (
  <Textarea
    size="sm"
    {...p}
    className={cx(inp, "h-auto min-h-20 py-2", className)}
  />
)
export function FormRow({
  label,
  children,
  hint,
}: {
  label: string
  children: ReactNode
  hint?: string
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-extrabold uppercase tracking-wide text-brown-soft">
        {label}
      </span>
      {children}
      {hint && (
        <span className="mt-0.5 block text-xs text-brown-soft">{hint}</span>
      )}
    </label>
  )
}
export function SearchBox({
  value,
  onChange,
  placeholder,
  className,
}: {
  value: string
  onChange: (v: string) => void
  placeholder?: string
  className?: string
}) {
  return (
    <div className={cx("relative min-w-[180px] flex-1 sm:max-w-xs", className)}>
      <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-brown-soft" />
      <AInput
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="pl-8"
        aria-label={placeholder}
      />
    </div>
  )
}

/* ---------- table ---------- */
export interface Col<T> {
  key: string
  label: string
  render: (r: T) => ReactNode
  sort?: (r: T) => string | number
  className?: string
}
export function DataTable<T>({
  cols,
  rows,
  rowKey,
  onRow,
  empty = "Không có dữ liệu phù hợp bộ lọc.",
  dense,
  card,
}: {
  cols: Col<T>[]
  rows: T[]
  rowKey: (r: T) => string
  onRow?: (r: T) => void
  empty?: string
  dense?: boolean
  card?: (r: T) => ReactNode
}) {
  const [sort, setSort] = useState<{ key: string; dir: 1 | -1 } | null>(null)
  const sorted = useMemo(() => {
    const c = cols.find((x) => x.key === sort?.key)
    if (!sort || !c?.sort) return rows
    const f = c.sort
    return [...rows].sort((a, b) => {
      const x = f(a),
        y = f(b)
      return (x < y ? -1 : x > y ? 1 : 0) * sort.dir
    })
  }, [rows, sort, cols])
  const act = cols.find((c) => c.key === "act")
  const main = cols.filter((c) => c.key !== "act")
  const empt = (
    <p className="px-3 py-10 text-center text-sm font-semibold text-brown-soft">
      {empty}
    </p>
  )
  return (
    <>
      <div className="space-y-2 md:hidden">
        {sorted.map((r) => (
          <div
            key={rowKey(r)}
            onClick={onRow && (() => onRow(r))}
            className="rounded-2xl border border-line bg-paper p-3"
          >
            {card ? (
              card(r)
            ) : (
              <>
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 font-bold">{main[0].render(r)}</div>
                  {act && (
                    <div
                      onClick={(e) => e.stopPropagation()}
                      className="shrink-0"
                    >
                      {act.render(r)}
                    </div>
                  )}
                </div>
                <dl className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1.5 text-[13px]">
                  {main.slice(1).map((c) => (
                    <div key={c.key} className="min-w-0">
                      <dt className="text-[11px] font-bold uppercase text-brown-soft">
                        {c.label}
                      </dt>
                      <dd className="min-w-0 break-words font-semibold">
                        {c.render(r)}
                      </dd>
                    </div>
                  ))}
                </dl>
              </>
            )}
          </div>
        ))}
        {sorted.length === 0 && (
          <div className="rounded-2xl border border-line bg-paper">{empt}</div>
        )}
      </div>
      <div className="hidden overflow-x-auto rounded-2xl border border-line bg-paper md:block">
        <table className="w-full border-collapse text-left text-[13px]">
          <thead>
            <tr className="border-b border-line bg-cream-2/50 text-[11px] uppercase tracking-wide text-brown-soft">
              {cols.map((c) => (
                <th
                  key={c.key}
                  className={cx(
                    "whitespace-nowrap px-1.5 py-2 font-bold",
                    c.className,
                  )}
                  aria-sort={
                    sort?.key === c.key
                      ? sort.dir === 1
                        ? "ascending"
                        : "descending"
                      : undefined
                  }
                >
                  {c.sort ? (
                    <Btn
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        setSort((s) =>
                          s?.key === c.key
                            ? s.dir === 1
                              ? { key: c.key, dir: -1 }
                              : null
                            : { key: c.key, dir: 1 },
                        )
                      }
                      className="inline-flex h-auto p-0 items-center gap-1 uppercase hover:text-brown font-bold text-[11px]"
                    >
                      {c.label}
                      {sort?.key === c.key ? (
                        sort.dir === 1 ? (
                          <ArrowUp className="size-3" />
                        ) : (
                          <ArrowDown className="size-3" />
                        )
                      ) : (
                        <ChevronsUpDown className="size-3 opacity-40" />
                      )}
                    </Btn>
                  ) : (
                    c.label
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.map((r) => (
              <tr
                key={rowKey(r)}
                onClick={onRow && (() => onRow(r))}
                className={cx(
                  "border-b border-line/60 last:border-0",
                  onRow && "cursor-pointer hover:bg-butter/20",
                )}
              >
                {cols.map((c) => (
                  <td
                    key={c.key}
                    className={cx(
                      "px-1.5 align-middle",
                      dense ? "py-1.5" : "py-2",
                      c.className,
                    )}
                  >
                    {c.render(r)}
                  </td>
                ))}
              </tr>
            ))}
            {sorted.length === 0 && (
              <tr>
                <td colSpan={cols.length}>{empt}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  )
}

/* ---------- KPI card (single style for all admin pages) ---------- */
export function KpiCard({
  icon,
  label,
  value,
  delta,
  goodWhenUp = true,
  hint,
  onClick,
  tone = "bg-cream-2 text-brown",
  className,
}: {
  icon: ReactNode
  label: string
  value: ReactNode
  delta?: number
  goodWhenUp?: boolean
  hint?: string
  onClick?: () => void
  tone?: string
  className?: string
}) {
  const good =
    delta === undefined || delta === 0 ? null : delta > 0 === goodWhenUp
  const Tag = onClick ? "button" : "div"
  return (
    <Tag
      onClick={onClick}
      className={cx(
        "min-w-0 rounded-2xl border border-line bg-paper p-3 text-left",
        onClick && "hover:border-brown/50",
        className,
      )}
    >
      <div className="flex items-center gap-2">
        <span
          className={cx(
            "grid size-7 shrink-0 place-items-center rounded-lg [&_svg]:size-4",
            tone,
          )}
        >
          {icon}
        </span>
        <span className="truncate text-xs font-bold text-brown-soft">
          {label}
        </span>
      </div>
      <div className="mt-2 flex items-baseline gap-2">
        <span className="font-display text-[26px] font-bold leading-none">
          {value}
        </span>
        {delta !== undefined && (
          <span
            className={cx(
              "inline-flex items-center gap-0.5 text-[11px] font-bold",
              good === null
                ? "text-brown-soft"
                : good
                  ? "text-sage-2"
                  : "text-coral",
            )}
          >
            {delta >= 0 ? "▲" : "▼"} {Math.abs(delta)}%
          </span>
        )}
      </div>
      {hint && (
        <p className="mt-1 line-clamp-1 text-[11.5px] text-brown-soft">
          {hint}
        </p>
      )}
    </Tag>
  )
}
export const KpiRow = ({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) => (
  <div
    className={cx("mb-4 grid grid-cols-2 gap-2.5 md:grid-cols-4", className)}
  >
    {children}
  </div>
)

/* ---------- kebab action menu ---------- */
export interface MenuItem {
  label: string
  icon?: ReactNode
  onClick: () => void
  disabled?: boolean
  danger?: boolean
}
export function ActionMenu({
  items,
  label = "Hành động",
}: {
  items: MenuItem[]
  label?: string
}) {
  const [pos, setPos] = useState<{ x: number; y: number; up: boolean } | null>(
    null,
  )
  const btn = useRef<HTMLButtonElement>(null)
  useEffect(() => {
    if (!pos) return
    const close = () => setPos(null)
    window.addEventListener("scroll", close, true)
    window.addEventListener("resize", close)
    return () => {
      window.removeEventListener("scroll", close, true)
      window.removeEventListener("resize", close)
    }
  }, [pos])
  const openMenu = (e: React.MouseEvent) => {
    e.stopPropagation()
    const r = btn.current!.getBoundingClientRect()
    const up = r.bottom + items.length * 46 + 12 > window.innerHeight
    setPos({
      x: Math.max(8, Math.min(window.innerWidth - 184, r.right - 176)),
      y: up ? r.top - 4 : r.bottom + 4,
      up,
    })
  }
  return (
    <>
      <IconBtn
        variant="ghost"
        ref={btn}
        onClick={openMenu}
        aria-label={label}
        aria-haspopup="menu"
        className="grid size-11 place-items-center rounded-xl border border-line bg-paper hover:border-brown md:size-8"
      >
        <MoreVertical className="size-4" />
      </IconBtn>
      {pos && (
        <div
          className="fixed inset-0 z-[90]"
          onClick={(e) => {
            e.stopPropagation()
            setPos(null)
          }}
        >
          <div
            role="menu"
            style={{
              left: pos.x,
              top: pos.y,
              transform: pos.up ? "translateY(-100%)" : undefined,
            }}
            className="absolute w-44 rounded-xl border border-brown/40 bg-paper p-1 shadow-lg"
          >
            {items.map((it) => (
              <Btn
                key={it.label}
                variant="ghost"
                size="sm"
                role="menuitem"
                disabled={it.disabled}
                onClick={(e) => {
                  e.stopPropagation()
                  setPos(null)
                  it.onClick()
                }}
                className={cx(
                  "flex min-h-11 w-full items-center justify-start gap-2 rounded-lg px-2.5 text-left text-sm font-bold hover:bg-butter/40 disabled:opacity-40 disabled:hover:bg-transparent md:min-h-9 [&_svg]:size-4",
                  it.danger && "text-coral",
                )}
              >
                {it.icon}
                {it.label}
              </Btn>
            ))}
          </div>
        </div>
      )}
    </>
  )
}

/* ---------- collapsible filters: inline on desktop, bottom sheet on mobile ---------- */
export function FilterBar({
  children,
  active,
  onClear,
}: {
  children: ReactNode
  active: number
  onClear?: () => void
}) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <div className="mb-3 hidden flex-wrap items-center gap-2 md:flex">
        {children}
        {active > 0 && onClear && (
          <ABtn v="ghost" s="sm" onClick={onClear}>
            Xóa lọc
          </ABtn>
        )}
      </div>
      <div className="mb-3 md:hidden">
        <ABtn
          className="w-full"
          icon={<SlidersHorizontal />}
          onClick={() => setOpen(true)}
        >
          Bộ lọc{active > 0 ? ` (${active})` : ""}
        </ABtn>
      </div>
      <Modal open={open} onClose={() => setOpen(false)} title="Bộ lọc">
        <div className="flex flex-col gap-3 [&>*]:!w-full [&>*]:!max-w-none">
          {children}
        </div>
        <div className="mt-4 flex gap-2">
          {onClear && (
            <ABtn className="flex-1" onClick={onClear}>
              Xóa lọc
            </ABtn>
          )}
          <ABtn v="dark" className="flex-1" onClick={() => setOpen(false)}>
            Áp dụng
          </ABtn>
        </div>
      </Modal>
    </>
  )
}

/* ---------- drawer / confirm ---------- */
export function Drawer({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
}) {
  if (!open) return null
  return (
    <div
      className="fixed inset-0 z-[80] flex justify-end bg-brown/40"
      onClick={onClose}
      role="dialog"
      aria-modal
      aria-label={title}
    >
      <aside
        onClick={(e) => e.stopPropagation()}
        className="flex h-full w-full max-w-md animate-[rise_.2s_ease-out] flex-col overflow-y-auto border-l-2 border-brown bg-paper p-5"
      >
        <div className="mb-3 flex items-start justify-between gap-3">
          <h3 className="font-display text-xl font-extrabold">{title}</h3>
          <IconBtn
            variant="ghost"
            onClick={onClose}
            aria-label="Đóng"
            className="grid size-8 place-items-center rounded-lg hover:bg-brown/10"
          >
            <X className="size-5" />
          </IconBtn>
        </div>
        {children}
      </aside>
    </div>
  )
}
export function Confirm({
  open,
  onClose,
  onOk,
  title,
  body,
  okLabel = "Xóa",
}: {
  open: boolean
  onClose: () => void
  onOk: () => void
  title: string
  body: ReactNode
  okLabel?: string
}) {
  return (
    <Modal open={open} onClose={onClose} title={title} sheet={false}>
      <p className="mb-4 text-sm">{body}</p>
      <div className="flex justify-end gap-2">
        <ABtn onClick={onClose}>Hủy</ABtn>
        <ABtn
          v="danger"
          onClick={() => {
            onOk()
            onClose()
          }}
        >
          {okLabel}
        </ABtn>
      </div>
    </Modal>
  )
}

/* ---------- chips ---------- */
export type Sev = Report["severity"]
const sevMeta: Record<Sev, {
  tone: string
  icon: ReactNode
  label: string
  rank: number
}> = {
  Low: {
    tone: "sky",
    icon: <Info className="size-3.5" />,
    label: "Low",
    rank: 1,
  },
  Medium: {
    tone: "orange",
    icon: <AlertCircle className="size-3.5" />,
    label: "Medium",
    rank: 2,
  },
  High: {
    tone: "coral",
    icon: <AlertTriangle className="size-3.5" />,
    label: "High",
    rank: 3,
  },
  Critical: {
    tone: "ink",
    icon: <OctagonAlert className="size-3.5" />,
    label: "Critical",
    rank: 4,
  },
}
export const sevRank = (s: Sev) => sevMeta[s].rank
export const SevChip = ({ s }: { s: Sev }) => (
  <Badge tone={sevMeta[s].tone} icon={sevMeta[s].icon}>
    {sevMeta[s].label}
  </Badge>
)

export const typeLabel: Record<Case["type"], string> = {
  lost: "Thất lạc",
  found: "Nhặt được",
  rescue: "Cứu hộ",
}

export function UserCell({ id, sub }: { id?: string; sub?: string }) {
  const { go } = useApp()
  const u = userById(id)
  if (!u) return <span className="text-brown-soft">Hệ thống</span>
  return (
    <Btn
      variant="ghost"
      size="sm"
      onClick={(e) => {
        e.stopPropagation()
        go("/admin/users/" + u.id)
      }}
      className="flex h-auto p-0 items-center gap-2 text-left hover:underline"
    >
      <Avatar name={u.name} tone={u.avatar} size={26} />
      <span className="min-w-0">
        <span className="block truncate font-bold leading-tight">{u.name}</span>
        {sub && <span className="block text-xs text-brown-soft">{sub}</span>}
      </span>
    </Btn>
  )
}

/* ---------- case helpers ---------- */
export function useCases() {
  const { cases } = useApp()
  const { removedCases } = useAdmin()
  return useMemo(
    () => cases.filter((c) => !removedCases.includes(c.id)),
    [cases, removedCases],
  )
}
export type RiskLevel = "Cao" | "Trung bình" | "Thấp"
export function caseRisk(c: Case, reports: Report[]): RiskLevel {
  const rel = reports.filter(
    (r) => r.caseId === c.id && r.status !== "Đã xử lý",
  )
  if (
    c.critical ||
    rel.some((r) => r.severity === "Critical" || r.severity === "High")
  )
    return "Cao"
  if (c.type === "rescue" || rel.length) return "Trung bình"
  return "Thấp"
}
export function useRisk() {
  const { reports, flaggedCases } = useAdmin()
  return (c: Case): RiskLevel =>
    flaggedCases.includes(c.id) ? "Cao" : caseRisk(c, reports)
}
export const RiskChip = ({ l }: { l: RiskLevel }) => (
  <Badge
    tone={l === "Cao" ? "coral" : l === "Trung bình" ? "orange" : "sky"}
    icon={
      l === "Cao" ? (
        <AlertTriangle className="size-3.5" />
      ) : l === "Trung bình" ? (
        <AlertCircle className="size-3.5" />
      ) : (
        <Info className="size-3.5" />
      )
    }
  >
    {l}
  </Badge>
)

export function caseTimeline(c: Case) {
  const fmt = (m: number) => {
    const d = new Date(Date.now() - m * 60000)
    return d.toLocaleString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
      day: "2-digit",
      month: "2-digit",
    })
  }
  const t: { at: string; text: string }[] = [
    {
      at: fmt(c.minutesAgo),
      text: `Case được tạo bởi ${userById(c.reporter)?.name || "người dùng"}`,
    },
  ]
  if (c.assignee)
    t.push({
      at: fmt(Math.max(c.updatedAgo + 5, Math.round(c.minutesAgo / 2))),
      text: `${userById(c.assignee)?.name || "Người cứu hộ"} nhận cứu hộ`,
    })
  if (c.shelterId || c.status === "pending" || c.status === "resolved")
    t.push({
      at: fmt(Math.max(c.updatedAgo + 1, 2)),
      text:
        c.status === "resolved"
          ? "Bé đã được bàn giao / đoàn tụ"
          : "Người cứu hộ gửi bằng chứng bàn giao",
    })
  if (c.status === "resolved")
    t.push({ at: fmt(c.updatedAgo), text: "Admin xác nhận đã giải quyết" })
  else if (c.updatedAgo !== c.minutesAgo)
    t.push({ at: fmt(c.updatedAgo), text: "Cập nhật gần nhất" })
  return t
}
