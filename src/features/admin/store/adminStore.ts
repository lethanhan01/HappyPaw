import { useSyncExternalStore } from 'react'
import { CLINICS, DISTRICT_XY, REPORTS, RISKS, SHELTERS, USERS } from '@/constants'
import type {
  Clinic,
  Report,
  Risk,
  Shelter,
  User,
  Verify,
  PlaceStatus,
  AShelter,
  AClinic,
  ARisk,
  BlackRec,
  Rating,
  FraudStatus,
  AdminState,
} from '@/types'

export type {
  Verify,
  PlaceStatus,
  AShelter,
  AClinic,
  ARisk,
  BlackRec,
  Rating,
  FraudStatus,
  AdminState,
}

const seedShelters: AShelter[] = [
  ...SHELTERS.map((s) => ({ ...s, verify: (s.verified ? 'verified' : 'pending') as Verify, status: 'Hoạt động' as PlaceStatus })),
  { id: 's9', name: 'Mái ấm Bông Gòn', district: 'Hoàng Mai', address: 'Ngõ 301 Tam Trinh, Hoàng Mai', x: 660, y: 625, rating: 0, reviews: 0, verified: false, photo: SHELTERS[2].photo, distance: 7.1, phone: '0911 223 344', website: 'bonggon.org', about: 'Nhóm tình nguyện mới đăng ký, chờ xác minh giấy tờ.', pets: 12, needs: ['Thức ăn hạt'], urgent: false, bank: 'MB Bank 0123400012', since: 2026, verify: 'pending', status: 'Hoạt động' },
]
const seedClinics: AClinic[] = [
  ...CLINICS.map((s) => ({ ...s, verify: (s.verified ? 'verified' : 'pending') as Verify, status: 'Hoạt động' as PlaceStatus })),
  { id: 'c9', name: 'Thú y Sao Vàng', district: 'Hà Đông', address: '9 Lê Trọng Tấn, Hà Đông', x: 180, y: 610, rating: 0, reviews: 0, verified: false, photo: CLINICS[1].photo, distance: 11, phone: '024 3111 2222', website: 'saovangvet.vn', services: ['Khám', 'Tiêm phòng'], hours: '08:00 – 18:00', open: true, emergency: false, verify: 'pending', status: 'Hoạt động' },
]

const seedRatings: Rating[] = [
  { id: 'rt1', placeId: 's1', place: 'Mái ấm Cún Con', kind: 'shelter', user: 'u3', stars: 5, comment: 'Các bạn tình nguyện rất tận tâm, bé nhà mình được chăm sóc rất tốt.', created: 'Hôm nay', status: 'Chờ duyệt' },
  { id: 'rt2', placeId: 'c1', place: 'Phòng khám Thú y Pet Care', kind: 'clinic', user: 'u7', stars: 1, comment: 'Dịch vụ tệ, bác sĩ thô lỗ!!! Đừng đến. Liên hệ 0868 *** 990 để được giảm giá.', created: 'Hôm nay', status: 'Chờ duyệt' },
  { id: 'rt3', placeId: 's2', place: 'Trạm Cứu Hộ Mèo Hà Nội', kind: 'shelter', user: 'u4', stars: 4, comment: 'Sạch sẽ, nhận bé mèo vào lúc nửa đêm. Rất cảm ơn.', created: 'Hôm qua', status: 'Chờ duyệt' },
  { id: 'rt4', placeId: 'c2', place: 'Thú y Hà Nội Pet Hospital', kind: 'clinic', user: 'u9', stars: 5, comment: 'Cấp cứu nhanh, giá hợp lý.', created: 'Hôm qua', status: 'Đã giữ' },
  { id: 'rt5', placeId: 's6', place: 'Bếp Ăn Chó Mèo Cầu Giấy', kind: 'shelter', user: 'u10', stars: 1, comment: 'Nhóm này lừa đảo, kêu gọi ủng hộ rồi biến mất.', created: '2 ngày trước', status: 'Chờ duyệt' },
  { id: 'rt6', placeId: 'c5', place: 'Pet Hospital Tây Hồ', kind: 'clinic', user: 'u13', stars: 5, comment: 'Bác sĩ giải thích rất kỹ về tình trạng của bé.', created: '3 ngày trước', status: 'Đã giữ' },
]

const seedBlacklist: BlackRec[] = [
  { id: 'bl1', phone: '0868 *** 990', user: 'Dương Văn Tài', reason: 'Lừa đảo nhận cứu hộ / đòi tiền chuyển khoản trước', evidence: 'Ảnh chụp tin nhắn, 5 report liên quan', reports: 5, added: '24/09/2026', status: 'Đang hiệu lực' },
  { id: 'bl2', phone: '0862 *** 117', user: 'Tài khoản phụ (tai.duong2)', reason: 'Trùng số điện thoại với tài khoản đã bị khóa', evidence: 'Đối chiếu số điện thoại', reports: 2, added: '25/09/2026', status: 'Đang hiệu lực' },
  { id: 'bl3', phone: '0977 *** 404', user: 'Nguyễn Văn K.', reason: 'Spam quảng cáo trong bình luận', evidence: 'Ảnh chụp màn hình', reports: 3, added: '02/09/2026', status: 'Hết hiệu lực' },
]

const init: AdminState = {
  users: USERS.map((u) => ({ ...u })),
  reports: REPORTS.map((r) => ({ ...r })),
  blacklist: seedBlacklist,
  risks: RISKS.map((r, i) => ({ ...r, isNew: i === 1 || i === 4 })),
  shelters: seedShelters,
  clinics: seedClinics,
  ratings: seedRatings,
  fraud: { u10: 'Đang điều tra', u14: 'Đang điều tra' },
  userVerifyRejected: [],
  removedCases: [],
  hiddenPins: [],
  verifiedPins: [],
  flaggedCases: [],
  evidenceCases: [],
  mismatchCases: [],
}

let state = init
const subs = new Set<() => void>()
const subscribe = (f: () => void) => { subs.add(f); return () => { subs.delete(f) } }
export const getAdmin = () => state
export const setAdmin = (f: (s: AdminState) => Partial<AdminState>) => { state = { ...state, ...f(state) }; subs.forEach((l) => l()) }
export const useAdmin = () => useSyncExternalStore(subscribe, getAdmin)

/* ---------- actions ---------- */
export const setUserStatus = (id: string, status: User['status']) => setAdmin((s) => ({ users: s.users.map((u) => (u.id === id ? { ...u, status } : u)) }))
export const setUserVerified = (id: string, verified: boolean) => setAdmin((s) => ({ users: s.users.map((u) => (u.id === id ? { ...u, verified } : u)) }))
export const patchReport = (id: string, p: Partial<Report & { adminNote?: string }>) => setAdmin((s) => ({ reports: s.reports.map((r) => (r.id === id ? { ...r, ...p } : r)) }))
export const addReport = (r: Report) => setAdmin((s) => ({ reports: [r, ...s.reports] }))
export const setFraud = (uid: string, st: FraudStatus) => setAdmin((s) => ({ fraud: { ...s.fraud, [uid]: st } }))
export const addBlacklist = (r: Omit<BlackRec, 'id'>) => setAdmin((s) => ({ blacklist: [{ ...r, id: 'bl' + Date.now() }, ...s.blacklist] }))
export const patchBlacklist = (id: string, p: Partial<BlackRec>) => setAdmin((s) => ({ blacklist: s.blacklist.map((b) => (b.id === id ? { ...b, ...p } : b)) }))
export const removeBlacklist = (id: string) => setAdmin((s) => ({ blacklist: s.blacklist.filter((b) => b.id !== id) }))
export const addRisk = (r: ARisk) => setAdmin((s) => ({ risks: [r, ...s.risks] }))
export const patchRisk = (id: string, p: Partial<ARisk>) => setAdmin((s) => ({ risks: s.risks.map((r) => (r.id === id ? { ...r, ...p } : r)) }))
export const removeRisk = (id: string) => setAdmin((s) => ({ risks: s.risks.filter((r) => r.id !== id) }))
export const upsertShelter = (p: AShelter) => setAdmin((s) => ({ shelters: s.shelters.some((x) => x.id === p.id) ? s.shelters.map((x) => (x.id === p.id ? p : x)) : [p, ...s.shelters] }))
export const upsertClinic = (p: AClinic) => setAdmin((s) => ({ clinics: s.clinics.some((x) => x.id === p.id) ? s.clinics.map((x) => (x.id === p.id ? p : x)) : [p, ...s.clinics] }))
export const removeShelter = (id: string) => setAdmin((s) => ({ shelters: s.shelters.filter((x) => x.id !== id) }))
export const removeClinic = (id: string) => setAdmin((s) => ({ clinics: s.clinics.filter((x) => x.id !== id) }))
export const setVerify = (kind: 'shelter' | 'clinic', id: string, v: Verify) =>
  kind === 'shelter'
    ? setAdmin((s) => ({ shelters: s.shelters.map((x) => (x.id === id ? { ...x, verify: v, verified: v === 'verified' } : x)) }))
    : setAdmin((s) => ({ clinics: s.clinics.map((x) => (x.id === id ? { ...x, verify: v, verified: v === 'verified' } : x)) }))
export const patchRating = (id: string, st: Rating['status']) => setAdmin((s) => ({ ratings: s.ratings.map((r) => (r.id === id ? { ...r, status: st } : r)) }))
export const toggleIn = (key: 'hiddenPins' | 'verifiedPins' | 'flaggedCases' | 'evidenceCases' | 'mismatchCases', v: string, on?: boolean) =>
  setAdmin((s) => {
    const has = s[key].includes(v)
    const want = on ?? !has
    return { [key]: want ? (has ? s[key] : [...s[key], v]) : s[key].filter((x) => x !== v) } as Partial<AdminState>
  })
export const removeCase = (id: string) => setAdmin((s) => ({ removedCases: [...s.removedCases, id] }))

export const centroid = (pts: [number, number][]): [number, number] => [pts.reduce((a, p) => a + p[0], 0) / pts.length, pts.reduce((a, p) => a + p[1], 0) / pts.length]
export const jitterXY = (district: string): [number, number] => {
  const [x, y] = DISTRICT_XY[district] || [450, 340]
  return [x + Math.round((Math.random() - 0.5) * 40), y + Math.round((Math.random() - 0.5) * 40)]
}
export const DUP_PHONES: Record<string, { name: string; note: string }[]> = {
  u14: [{ name: 'tai.duong2', note: 'Tạo 02/2026 - bị khóa' }, { name: 'Dương Tài Official', note: 'Tạo 03/2026 - 1 report' }, { name: 'hanoi.cuuho88', note: 'Tạo 03/2026 - chưa xác minh' }],
  u10: [{ name: 'long.trinh.pet', note: 'Tạo 04/2026 - chưa xác minh' }],
}
