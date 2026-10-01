export interface Account {
  id: string
  role: 'user' | 'admin'
  name: string
  email: string
  avatar: string
  phone: string
  area: string
  bio: string
  badge: string
  joined: string
  verified: boolean
  rescues?: number
  cases?: number
  reports?: number
  permissions?: string[]
}

export const MOCK_USER_ACCOUNT: Account = {
  id: 'u1',
  role: 'user',
  name: 'Phạm Khánh Linh',
  email: 'linh.pham@happypaws.vn',
  avatar: 'pink',
  phone: '0912 345 345',
  area: 'Cầu Giấy, Hà Nội',
  bio: 'Tình nguyện viên cứu hộ động vật khu vực Cầu Giấy. Yêu mèo và sẵn sàng hỗ trợ các ca khẩn cấp.',
  badge: 'Hiệp sĩ Cứu trợ',
  joined: '03/2025',
  verified: true,
  rescues: 6,
  cases: 4,
  reports: 0,
}

export const MOCK_ADMIN_ACCOUNT: Account = {
  id: 'admin-1',
  role: 'admin',
  name: 'Ban Quản Trị HappyPaw',
  email: 'admin@happypaws.vn',
  avatar: 'ink',
  phone: '0900 888 999',
  area: 'Trụ sở Điều hành Hà Nội',
  bio: 'Tài khoản Quản trị viên cấp cao của Mạng lưới Cứu hộ Động vật HappyPaw Realtime.',
  badge: 'System Admin',
  joined: '01/2024',
  verified: true,
  permissions: [
    'manage_cases',
    'manage_users',
    'manage_map',
    'manage_reports',
    'fraud_detection',
    'system_settings',
  ],
}

export const DEMO_ACCOUNTS: Account[] = [
  MOCK_USER_ACCOUNT,
  MOCK_ADMIN_ACCOUNT,
]

export const getAccountById = (id?: string): Account | undefined => {
  if (!id) return undefined
  if (id === MOCK_ADMIN_ACCOUNT.id) return MOCK_ADMIN_ACCOUNT
  if (id === MOCK_USER_ACCOUNT.id) return MOCK_USER_ACCOUNT
  return undefined
}

export const getAccountByRole = (role: 'user' | 'admin'): Account => {
  return role === 'admin' ? MOCK_ADMIN_ACCOUNT : MOCK_USER_ACCOUNT
}
