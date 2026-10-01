export type Status = "active" | "progress" | "pending" | "resolved"
export type CaseType = "lost" | "found" | "rescue"

export interface Case {
  id: string
  name: string
  type: CaseType
  species: "Chó" | "Mèo" | "Khác"
  breed: string
  color: string
  gender: "Đực" | "Cái"
  status: Status
  district: string
  street: string
  x: number
  y: number
  minutesAgo: number
  updatedAgo: number
  desc: string
  traits: string
  photo: string
  critical?: boolean
  condition?: string
  assignee?: string
  reporter: string
  match?: number
  reward?: boolean
  weight?: string
  age?: string
  shelterId?: string
  trail?: { x: number y: number t: string note: string }[]
}
