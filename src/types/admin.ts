import type { Shelter, Clinic } from "./place"
import type { User } from "./user"
import type { Risk } from "./map"
import type { Report } from "./report"

export type Verify = "verified" | "pending" | "rejected"
export type PlaceStatus = "Hoạt động" | "Ẩn"

export interface AShelter extends Shelter {
  verify: Verify
  status: PlaceStatus
  logo?: string
  cover?: string
  qr?: string
}

export interface AClinic extends Clinic {
  verify: Verify
  status: PlaceStatus
  logo?: string
  cover?: string
}

export interface ARisk extends Risk {
  poly?: [number, number][]
  isNew?: boolean
}

export interface BlackRec {
  id: string
  phone: string
  user: string
  reason: string
  evidence: string
  reports: number
  added: string
  status: "Đang hiệu lực" | "Hết hiệu lực"
}

export interface Rating {
  id: string
  placeId: string
  place: string
  kind: "shelter" | "clinic"
  user: string
  stars: number
  comment: string
  created: string
  status: "Chờ duyệt" | "Đã giữ" | "Đã ẩn"
}

export type FraudStatus = "Đang điều tra" | "Theo dõi" | "Hạn chế" | "Đã bỏ qua" | "Đã khóa"

export interface AdminState {
  users: User[]
  reports: (Report & { adminNote?: string })[]
  blacklist: BlackRec[]
  risks: ARisk[]
  shelters: AShelter[]
  clinics: AClinic[]
  ratings: Rating[]
  fraud: Record<string, FraudStatus>
  userVerifyRejected: string[]
  removedCases: string[]
  hiddenPins: string[]
  verifiedPins: string[]
  flaggedCases: string[]
  evidenceCases: string[]
  mismatchCases: string[]
}
