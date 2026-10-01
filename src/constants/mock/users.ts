import type { User, LeaderRow } from '@/types/user'

export const USERS: User[] = [
  { id: 'u1', name: 'Phạm Khánh Linh', area: 'Cầu Giấy', joined: '03/2025', cases: 4, rescues: 6, reports: 0, status: 'Hoạt động', verified: true, phone: '0912 *** 345', bio: 'Mê mèo, thích đi dạo cùng Mít mỗi chiều.', avatar: 'pink' },
  { id: 'u2', name: 'Trần Quốc Bảo', area: 'Cầu Giấy', joined: '01/2025', cases: 3, rescues: 2, reports: 0, status: 'Hoạt động', verified: true, phone: '0987 *** 122', bio: 'Chủ của Milo.', avatar: 'butter' },
  { id: 'u3', name: 'Nguyễn Minh', area: 'Đống Đa', joined: '06/2024', cases: 9, rescues: 41, reports: 0, status: 'Hoạt động', verified: true, phone: '0903 *** 811', bio: 'Tình nguyện viên cứu hộ khu vực nội thành.', avatar: 'sage' },
  { id: 'u4', name: 'Lê Thu Hà', area: 'Đống Đa', joined: '08/2025', cases: 2, rescues: 1, reports: 0, status: 'Hoạt động', verified: false, phone: '0977 *** 090', bio: '', avatar: 'peach' },
  { id: 'u5', name: 'Hoàng Gia Huy', area: 'Ba Đình', joined: '02/2024', cases: 6, rescues: 28, reports: 1, status: 'Hoạt động', verified: true, phone: '0933 *** 456', bio: 'Cứu hộ cuối tuần.', avatar: 'sky' },
  { id: 'u6', name: 'Vũ Ngọc Anh', area: 'Long Biên', joined: '11/2025', cases: 3, rescues: 4, reports: 0, status: 'Hoạt động', verified: false, phone: '0966 *** 770', bio: '', avatar: 'pink' },
  { id: 'u7', name: 'Đặng Thảo My', area: 'Thanh Xuân', joined: '05/2025', cases: 2, rescues: 0, reports: 0, status: 'Hoạt động', verified: false, phone: '0944 *** 561', bio: '', avatar: 'butter' },
  { id: 'u8', name: 'Bùi Tuấn Kiệt', area: 'Ba Đình', joined: '09/2025', cases: 1, rescues: 0, reports: 0, status: 'Hoạt động', verified: false, phone: '0905 *** 118', bio: '', avatar: 'sage' },
  { id: 'u9', name: 'Ngô Phương Thảo', area: 'Hoàn Kiếm', joined: '12/2024', cases: 5, rescues: 17, reports: 0, status: 'Hoạt động', verified: true, phone: '0902 *** 880', bio: 'Yêu mèo hoang phố cổ.', avatar: 'peach' },
  { id: 'u10', name: 'Trịnh Đức Long', area: 'Đống Đa', joined: '03/2026', cases: 2, rescues: 0, reports: 3, status: 'Cảnh báo', verified: false, phone: '0888 *** 214', bio: '', avatar: 'sky' },
  { id: 'u11', name: 'Phan Mỹ Duyên', area: 'Thanh Xuân', joined: '07/2025', cases: 1, rescues: 3, reports: 0, status: 'Hoạt động', verified: false, phone: '0931 *** 702', bio: '', avatar: 'pink' },
  { id: 'u12', name: 'Lý Hoàng Nam', area: 'Hai Bà Trưng', joined: '10/2025', cases: 1, rescues: 5, reports: 0, status: 'Hoạt động', verified: true, phone: '0913 *** 665', bio: '', avatar: 'butter' },
  { id: 'u13', name: 'Kiều Minh Châu', area: 'Tây Hồ', joined: '04/2025', cases: 2, rescues: 0, reports: 0, status: 'Hoạt động', verified: false, phone: '0914 *** 330', bio: '', avatar: 'sage' },
  { id: 'u14', name: 'Dương Văn Tài', area: 'Nam Từ Liêm', joined: '02/2026', cases: 2, rescues: 0, reports: 5, status: 'Bị khóa', verified: false, phone: '0868 *** 990', bio: '', avatar: 'peach' },
]

export const userById = (id?: string) => USERS.find((u) => u.id === id)

export const LEADERS: LeaderRow[] = [
  { name: 'Nguyễn Minh', area: 'Đống Đa', rescues: 41, joined: '06/2024', verified: true, avatar: 'sage' },
  { name: 'Hoàng Gia Huy', area: 'Ba Đình', rescues: 28, joined: '02/2024', verified: true, avatar: 'sky' },
  { name: 'Ngô Phương Thảo', area: 'Hoàn Kiếm', rescues: 17, joined: '12/2024', verified: true, avatar: 'peach' },
  { name: 'Lê Hải Yến', area: 'Tây Hồ', rescues: 14, joined: '09/2024', verified: true, avatar: 'pink' },
  { name: 'Đỗ Quang Vinh', area: 'Thanh Xuân', rescues: 11, joined: '01/2025', verified: true, avatar: 'butter' },
  { name: 'Phạm Khánh Linh', area: 'Cầu Giấy', rescues: 6, joined: '03/2025', verified: true, avatar: 'pink' },
  { name: 'Lý Hoàng Nam', area: 'Hai Bà Trưng', rescues: 5, joined: '10/2025', verified: true, avatar: 'butter' },
  { name: 'Vũ Ngọc Anh', area: 'Long Biên', rescues: 4, joined: '11/2025', verified: false, avatar: 'pink' },
]
