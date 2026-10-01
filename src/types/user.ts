export interface User {
  id: string
  name: string
  area: string
  joined: string
  cases: number
  rescues: number
  reports: number
  status: "Hoạt động" | "Cảnh báo" | "Bị khóa"
  verified: boolean
  phone: string
  bio: string
  avatar: string
}

export interface Notif {
  id: string
  kind: "rescue" | "match" | "community" | "safety"
  title: string
  body: string
  ago: string
  caseId?: string
  unread: boolean
}

export interface LeaderRow {
  name: string
  area: string
  rescues: number
  joined: string
  verified: boolean
  avatar: string
}

export interface Story {
  id: string
  title: string
  excerpt: string
  photo: string
  author: string
  place: string
}
