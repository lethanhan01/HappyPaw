export const DISTRICTS = [
  'Cầu Giấy', 'Ba Đình', 'Đống Đa', 'Thanh Xuân', 'Hai Bà Trưng', 'Hoàn Kiếm',
  'Hoàng Mai', 'Tây Hồ', 'Hà Đông', 'Nam Từ Liêm', 'Bắc Từ Liêm', 'Long Biên',
] as const

// Map space is 1000 x 720
export const DISTRICT_XY: Record<string, [number, number]> = {
  'Bắc Từ Liêm': [270, 120], 'Tây Hồ': [590, 120], 'Cầu Giấy': [340, 270], 'Ba Đình': [500, 270],
  'Hoàn Kiếm': [640, 340], 'Đống Đa': [470, 380], 'Hai Bà Trưng': [640, 460], 'Thanh Xuân': [380, 500],
  'Nam Từ Liêm': [190, 340], 'Hà Đông': [200, 580], 'Hoàng Mai': [620, 590], 'Long Biên': [880, 330],
}
