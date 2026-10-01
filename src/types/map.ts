export interface Risk {
  id: string
  title: string
  type: string
  x: number
  y: number
  r: number
  severity: "Thấp" | "Trung bình" | "Cao"
  note: string
  expires: string
  reports: number
}
