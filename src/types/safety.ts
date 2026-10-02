export type AlertCategory =
  | "Bả độc / Đồ ăn lạ"
  | "Nghi trộm thú cưng"
  | "Lừa đảo tiền cọc / chuộc"
  | "Điểm đen tai nạn"
  | "Tài khoản khả nghi"
  | "Khu vực nguy hiểm"

export type AlertSeverity = "Khẩn cấp" | "Cảnh giác" | "Đã khắc phục"

export interface AlertTimelineItem {
  id: string
  time: string
  content: string
  author: string
}

export type SafetyViewMode = "feed" | "map"

export interface SafetyAlertStory {
  id: string
  title: string
  category: AlertCategory
  severity: AlertSeverity
  district: string
  address: string
  excerpt: string
  fullStory: string
  photos: string[]
  author: {
    id: string
    name: string
    avatar?: string
    isAnonymous?: boolean
    isVerified?: boolean
    role?: string
  }
  createdAt: string
  expiresAt?: string
  confirmsCount: number
  hasConfirmed?: boolean
  coordinates: { x: number; y: number; r?: number }
  updates: AlertTimelineItem[]
  firstAidAdvice?: string[]
  statusNote?: string
}

export interface SafetyFilterState {
  search: string
  category: AlertCategory | "Tất cả"
  district: string | "Tất cả"
  severity: AlertSeverity | "Tất cả"
}
