import { useRef, useState, type ReactNode } from "react"
import { Search, X, History, Sparkles } from "lucide-react"
import { cx } from "@/lib/cn"
import { Btn, IconBtn, Input } from "@/components/ui"

export interface SearchHitItem {
  key: string
  label: string
  sub?: string
  dotColor?: string
  icon?: ReactNode
  onPick: () => void
}

export const DEFAULT_SEARCH_SUGGESTIONS = [
  "Cần cứu hộ gần tôi",
  "Mèo bị thương",
  "Chó vàng thất lạc",
  "Mái ấm Đống Đa",
  "Phòng khám 24h",
]

export interface SearchInputProps {
  value: string
  onChange: (v: string) => void
  onCommit?: (v: string) => void
  placeholder?: string
  mode?: "simple" | "rich"
  size?: "sm" | "md" | "lg"
  hits?: SearchHitItem[]
  recent?: string[]
  suggestions?: string[]
  onClearRecent?: () => void
  rightAction?: ReactNode
  className?: string
  ariaLabel?: string
}

export function SearchInput({
  value,
  onChange,
  onCommit,
  placeholder = "Tìm kiếm…",
  mode = "simple",
  size = mode === "simple" ? "sm" : "md",
  hits = [],
  recent = [],
  suggestions = DEFAULT_SEARCH_SUGGESTIONS,
  onClearRecent,
  rightAction,
  className,
  ariaLabel,
}: SearchInputProps) {
  const [open, setOpen] = useState(false)
  const box = useRef<HTMLDivElement>(null)
  const typed = value.trim().length > 0

  const handleCommit = (val: string) => {
    if (onCommit) onCommit(val)
  }

  const pick = (val: string) => {
    onChange(val)
    handleCommit(val)
    setOpen(false)
  }

  return (
    <div
      ref={box}
      className={cx(
        "relative",
        mode === "simple" && "min-w-[180px] flex-1 sm:max-w-xs",
        className,
      )}
      onBlur={(e) => {
        if (!box.current?.contains(e.relatedTarget as Node)) setOpen(false)
      }}
    >
      <Search
        className={cx(
          "pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-brown-soft",
          size === "sm" ? "size-3.5" : "size-4",
        )}
      />
      <Input
        size={size === "sm" ? "sm" : "md"}
        value={value}
        onFocus={() => {
          if (mode === "rich") setOpen(true)
        }}
        onChange={(e) => {
          onChange(e.target.value)
          if (mode === "rich") setOpen(true)
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleCommit(value)
            setOpen(false)
            ;(e.target as HTMLInputElement).blur()
          }
          if (e.key === "Escape") setOpen(false)
        }}
        placeholder={placeholder}
        aria-label={ariaLabel || placeholder}
        className={cx(
          "bg-paper font-semibold text-brown transition-all",
          mode === "rich" ? "rounded-full pl-10" : "pl-9",
          size === "lg" && "h-12 border-brown shadow-soft",
          typed ? (rightAction ? "pr-16" : "pr-9") : rightAction ? "pr-10" : "pr-3",
        )}
      />

      {typed && (
        <IconBtn
          label="Xóa tìm kiếm"
          variant="ghost"
          size="sm"
          onClick={() => {
            onChange("")
            if (mode === "rich") setOpen(true)
          }}
          className={cx(
            "!absolute top-1/2 -translate-y-1/2 !rounded-full !size-6 text-brown-soft hover:text-brown",
            rightAction ? "right-9" : "right-1.5",
          )}
        >
          <X className="size-3.5" />
        </IconBtn>
      )}

      {rightAction && (
        <div className="absolute right-1 top-1/2 -translate-y-1/2 z-10 flex items-center">
          {rightAction}
        </div>
      )}

      {/* Rich Dropdown Panel (for mode="rich" on Map & Home) */}
      {mode === "rich" && open && (
        <div className="absolute inset-x-0 top-full z-40 mt-2 max-h-[55vh] animate-[rise_.18s_both] overflow-y-auto rounded-3xl border-2 border-brown bg-paper p-2 shadow-soft">
          {typed ? (
            hits.length ? (
              <ul>
                {hits.map((h) => (
                  <li key={h.key}>
                    <Btn
                      variant="ghost"
                      size="md"
                      full
                      onClick={() => {
                        h.onPick()
                        handleCommit(value)
                        setOpen(false)
                      }}
                      className="!justify-start !rounded-2xl !px-2.5 !py-1.5 text-left hover:!bg-butter/60"
                    >
                      {h.dotColor ? (
                        <span
                          className="size-3.5 shrink-0 rounded-full border-2 border-brown"
                          style={{ background: h.dotColor }}
                        />
                      ) : (
                        h.icon || <Search className="size-3.5 text-brown/50" />
                      )}
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-extrabold">
                          {h.label}
                        </span>
                        {h.sub && (
                          <span className="block truncate text-xs font-semibold text-brown-soft">
                            {h.sub}
                          </span>
                        )}
                      </span>
                    </Btn>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="px-3 py-4 text-center text-sm font-bold text-brown-soft">
                Không tìm thấy kết quả cho “{value}”. Thử từ khóa khác nhé.
              </p>
            )
          ) : (
            <>
              {recent.length > 0 && (
                <div className="pb-1">
                  <div className="flex items-center justify-between px-2.5 pb-1 pt-1 text-xs font-extrabold uppercase tracking-wide text-brown-soft">
                    <span>Tìm gần đây</span>
                    {onClearRecent && (
                      <Btn
                        variant="ghost"
                        size="sm"
                        onClick={onClearRecent}
                        className="!p-0 !h-auto !border-0 normal-case underline text-xs font-extrabold text-brown-soft hover:text-brown"
                      >
                        Xóa
                      </Btn>
                    )}
                  </div>
                  {recent.map((r) => (
                    <Btn
                      key={r}
                      variant="ghost"
                      size="md"
                      full
                      onClick={() => pick(r)}
                      className="!justify-start !rounded-2xl !px-2.5 text-left text-sm font-bold hover:!bg-butter/60"
                    >
                      <History className="size-4 text-brown/50" />
                      {r}
                    </Btn>
                  ))}
                </div>
              )}
              {suggestions.length > 0 && (
                <div>
                  <div className="px-2.5 pb-1 pt-1 text-xs font-extrabold uppercase tracking-wide text-brown-soft">
                    Gợi ý
                  </div>
                  {suggestions.map((r) => (
                    <Btn
                      key={r}
                      variant="ghost"
                      size="md"
                      full
                      onClick={() => pick(r)}
                      className="!justify-start !rounded-2xl !px-2.5 text-left text-sm font-bold hover:!bg-butter/60"
                    >
                      <Sparkles className="size-4 text-brown/50" />
                      {r}
                    </Btn>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  )
}

// Alias for simple mode
export function SearchBox({
  value,
  onChange,
  placeholder = "Tìm kiếm…",
  className,
}: {
  value: string
  onChange: (v: string) => void
  placeholder?: string
  className?: string
}) {
  return (
    <SearchInput
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      mode="simple"
      className={className}
    />
  )
}
