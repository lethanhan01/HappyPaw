import type { Risk } from '@/types/map'

export const RISKS: Risk[] = [
  { id: 'r1', title: 'Nghi trộm chó mèo', type: 'Khu vực nghi có trộm chó mèo', x: 270, y: 215, r: 55, severity: 'Cao', note: 'Có 5 báo cáo về người lạ dụ chó tại khu vực chung cư.', expires: '15/10/2026', reports: 5 },
  { id: 'r2', title: 'Có bẫy/bả', type: 'Khu vực có bẫy/bả', x: 520, y: 520, r: 45, severity: 'Cao', note: 'Phát hiện thức ăn nghi có bả gần công viên.', expires: '10/10/2026', reports: 3 },
  { id: 'r3', title: 'Điểm đến đáng ngờ', type: 'Điểm đến đáng ngờ', x: 740, y: 470, r: 40, severity: 'Trung bình', note: 'Địa điểm nhận "cứu hộ" nhưng thu tiền bất thường.', expires: '30/10/2026', reports: 4 },
  { id: 'r4', title: 'Khu vực nguy hiểm', type: 'Khu vực nguy hiểm', x: 160, y: 470, r: 50, severity: 'Trung bình', note: 'Công trình đang thi công, nhiều chó hoang bị thương.', expires: '20/10/2026', reports: 2 },
  { id: 'r5', title: 'Người dùng bị report nhiều', type: 'Người dùng bị report nhiều', x: 700, y: 230, r: 35, severity: 'Thấp', note: 'Khu vực có tài khoản bị report liên tục.', expires: '05/11/2026', reports: 6 },
]
