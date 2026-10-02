import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react"
import { SAFETY_ALERT_STORIES } from "@/constants/mock/safetyAlerts"
import { DISTRICT_XY } from "@/constants/districts"
import { safeStorage } from "@/lib/safeStorage"
import type {
  AlertCategory,
  AlertSeverity,
  SafetyAlertStory,
  SafetyFilterState,
} from "@/types/safety"

const STORAGE_KEY = "happypaw_safety_alerts_v1"

export type SafetyViewMode = "feed" | "map" | "split"

interface SafetyCtx {
  alerts: SafetyAlertStory[]
  filteredAlerts: SafetyAlertStory[]
  selectedAlertId: string | null
  setSelectedAlertId: (id: string | null) => void
  modalAlertId: string | null
  setModalAlertId: (id: string | null) => void
  filter: SafetyFilterState
  setFilter: (f: Partial<SafetyFilterState> | ((prev: SafetyFilterState) => SafetyFilterState)) => void
  resetFilter: () => void
  viewMode: SafetyViewMode
  setViewMode: (v: SafetyViewMode) => void
  toggleConfirm: (id: string) => void
  addAlert: (
    data: Omit<SafetyAlertStory, "id" | "createdAt" | "confirmsCount" | "hasConfirmed" | "updates"> &
      Partial<SafetyAlertStory>,
  ) => SafetyAlertStory
  publishReportAsAlert: (params: {
    title: string
    category: AlertCategory
    severity: AlertSeverity
    district: string
    address: string
    excerpt: string
    fullStory: string
    photos?: string[]
    reporterName?: string
  }) => SafetyAlertStory
}

const DEFAULT_FILTER: SafetyFilterState = {
  search: "",
  category: "Tất cả",
  district: "Tất cả",
  severity: "Tất cả",
}

const SafetyCtx = createContext<SafetyCtx>(null as unknown as SafetyCtx)
export const useSafetyStore = () => useContext(SafetyCtx)

export function SafetyProvider({ children }: { children: ReactNode }) {
  const [alerts, setAlerts] = useState<SafetyAlertStory[]>(() => {
    const saved = safeStorage.get<SafetyAlertStory[]>(STORAGE_KEY, [])
    if (!saved || saved.length === 0) return SAFETY_ALERT_STORIES
    const savedIds = new Set(saved.map((s) => s.id))
    return [...saved, ...SAFETY_ALERT_STORIES.filter((a) => !savedIds.has(a.id))]
  })

  const [selectedAlertId, setSelectedAlertId] = useState<string | null>(null)
  const [modalAlertId, setModalAlertId] = useState<string | null>(null)
  const [filter, setFilterState] = useState<SafetyFilterState>(DEFAULT_FILTER)
  const [viewMode, setViewMode] = useState<SafetyViewMode>("feed")

  const setFilter = (
    f: Partial<SafetyFilterState> | ((prev: SafetyFilterState) => SafetyFilterState),
  ) => {
    setFilterState((prev) => {
      const next = typeof f === "function" ? f(prev) : { ...prev, ...f }
      return next
    })
  }

  const resetFilter = () => setFilterState(DEFAULT_FILTER)

  const toggleConfirm = (id: string) => {
    setAlerts((prev) => {
      const next = prev.map((a) => {
        if (a.id !== id) return a
        const has = !!a.hasConfirmed
        return {
          ...a,
          hasConfirmed: !has,
          confirmsCount: has ? Math.max(0, a.confirmsCount - 1) : a.confirmsCount + 1,
        }
      })
      safeStorage.set(STORAGE_KEY, next)
      return next
    })
  }

  const addAlert = (
    data: Omit<SafetyAlertStory, "id" | "createdAt" | "confirmsCount" | "hasConfirmed" | "updates"> &
      Partial<SafetyAlertStory>,
  ): SafetyAlertStory => {
    const id = `alt-${Date.now()}`
    const baseCoords = DISTRICT_XY[data.district] || [500, 360]
    // Slight random offset in map coordinate space
    const offset = (Math.random() - 0.5) * 30
    const coords = data.coordinates || {
      x: Math.round(baseCoords[0] + offset),
      y: Math.round(baseCoords[1] + offset),
      r: 45,
    }

    const newStory: SafetyAlertStory = {
      id,
      title: data.title,
      category: data.category,
      severity: data.severity,
      district: data.district,
      address: data.address,
      excerpt: data.excerpt,
      fullStory: data.fullStory,
      photos: data.photos && data.photos.length > 0 ? data.photos : [],
      author: data.author || {
        id: "me",
        name: "Bạn",
        isAnonymous: false,
        isVerified: true,
        role: "Thành viên cộng đồng",
      },
      createdAt: "Vừa xong",
      expiresAt: data.expiresAt || "30 ngày tới",
      confirmsCount: 1,
      hasConfirmed: true,
      coordinates: coords,
      updates: [
        {
          id: `up-${Date.now()}`,
          time: "Vừa xong",
          content: "Cảnh báo vừa được đăng tải lên Bản tin Cộng đồng.",
          author: data.author?.name || "Bạn",
        },
      ],
      firstAidAdvice: data.firstAidAdvice || [
        "Hãy nâng cao cảnh giác và thông báo ngay cho người thân hoặc bảo vệ khu vực nếu phát hiện dấu hiệu bất thường.",
        "Tránh dắt thú cưng đi dạo một mình qua các khu vực vắng người vào ban đêm.",
      ],
      statusNote: data.statusNote || "Đang được cộng đồng theo dõi và xác minh.",
    }

    setAlerts((prev) => {
      const next = [newStory, ...prev]
      safeStorage.set(STORAGE_KEY, next)
      return next
    })

    return newStory
  }

  const publishReportAsAlert = ({
    title,
    category,
    severity,
    district,
    address,
    excerpt,
    fullStory,
    photos,
    reporterName,
  }: {
    title: string
    category: AlertCategory
    severity: AlertSeverity
    district: string
    address: string
    excerpt: string
    fullStory: string
    photos?: string[]
    reporterName?: string
  }): SafetyAlertStory => {
    return addAlert({
      title,
      category,
      severity,
      district,
      address,
      excerpt,
      fullStory,
      photos: photos || [],
      author: {
        id: "admin-mod",
        name: reporterName ? `TNV ${reporterName}` : "Đội ngũ Kiểm duyệt Happy Paws",
        avatar: "plum",
        isVerified: true,
        role: "BQT Xác minh & Phê duyệt",
      },
      statusNote: "Đã được Ban Quản Trị xác minh và xuất bản chính thức.",
    })
  }

  const filteredAlerts = useMemo(() => {
    return alerts.filter((a) => {
      if (filter.category !== "Tất cả" && a.category !== filter.category) return false
      if (filter.district !== "Tất cả" && a.district !== filter.district) return false
      if (filter.severity !== "Tất cả" && a.severity !== filter.severity) return false
      if (filter.search.trim()) {
        const q = filter.search.trim().toLowerCase()
        const text = `${a.title} ${a.excerpt} ${a.district} ${a.address} ${a.fullStory}`.toLowerCase()
        if (!text.includes(q)) return false
      }
      return true
    })
  }, [alerts, filter])

  const value = useMemo<SafetyCtx>(
    () => ({
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
      toggleConfirm,
      addAlert,
      publishReportAsAlert,
    }),
    [alerts, filteredAlerts, selectedAlertId, modalAlertId, filter, viewMode],
  )

  return <SafetyCtx.Provider value={value}>{children}</SafetyCtx.Provider>
}
