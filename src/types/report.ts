export interface Report {
  id: string
  reporter: string
  reported: string
  reason: string
  caseId: string
  created: string
  severity: "Low" | "Medium" | "High" | "Critical"
  status: "Mới" | "Đang xem xét" | "Đã xử lý"
  note: string
}
