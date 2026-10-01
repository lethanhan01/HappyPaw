export const img = (id: string, w = 600, h = 600) =>
  `https://images.unsplash.com/photo-${id}?w=${w}&h=${h}&fit=crop&auto=format&q=75`

export const PHOTO = {
  golden1: '1558788353-f76d92427f16',
  golden2: '1693615775129-f2004d6e3e0b',
  golden3: '1602241628512-459cdd3234fe',
  golden4: '1633722714057-aaa9bf7f2383',
  cat1: '1710578471007-ae4ddffde8c6',
  cat2: '1631307495039-3f9e947c2070',
  cat3: '1550414485-9f22b971dbf0',
  cat4: '1560740837-89363a2b7192',
  catBW: '1693868380707-ff4f70d28f67',
  catBW2: '1615000363971-041349a4717b',
  white1: '1554956615-1ba6dc39921b',
  white2: '1606149257644-a1f04b76c111',
  white3: '1621878135994-8b56a55d4af5',
  white4: '1587402092301-725e37c70fd8',
  white5: '1570888234661-a2428afad010',
  shelter1: '1450778869180-41d0601e046e',
  shelter2: '1509205477838-a534e43a849f',
  shelter3: '1601758177266-bc599de87707',
  shelter4: '1642625932641-3a52ad27e268',
  shelter5: '1542715234-bd0adb4249b7',
  pup: '1553688738-a278b9f063e0',
}
export const photo = (k: keyof typeof PHOTO, w = 600, h = 600) => img(PHOTO[k], w, h)

export type Status = 'active' | 'progress' | 'pending' | 'resolved'
export type CaseType = 'lost' | 'found' | 'rescue'

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

export interface Case {
  id: string
  name: string
  type: CaseType
  species: 'Chó' | 'Mèo' | 'Khác'
  breed: string
  color: string
  gender: 'Đực' | 'Cái'
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
  trail?: { x: number; y: number; t: string; note: string }[]
}

const c = (o: Case): Case => o

export const INITIAL_CASES: Case[] = [
  c({ id: 'HP-1042', name: 'Milo', type: 'lost', species: 'Chó', breed: 'Golden Retriever', color: 'Vàng trắng', gender: 'Đực', status: 'active', district: 'Cầu Giấy', street: 'Trần Thái Tông', x: 350, y: 262, minutesAgo: 15, updatedAgo: 5, desc: 'Chó vàng trắng, đeo vòng cổ đỏ, rất hiền và quen người.', traits: 'Vòng cổ đỏ có chuông, đốm trắng trên ngực, tai trái cụp.', photo: photo('golden1'), match: 87, reward: true, weight: '28 kg', age: '3 tuổi', reporter: 'u2', trail: [{ x: 320, y: 285, t: '19:30', note: 'Mất tích tại Cầu Giấy' }, { x: 338, y: 270, t: '20:05', note: 'Phát hiện tại đường Trần Thái Tông' }, { x: 350, y: 262, t: '20:20', note: 'Người dùng cập nhật vị trí' }] }),
  c({ id: 'HP-1041', name: 'Mít', type: 'rescue', species: 'Mèo', breed: 'Mèo Anh lông ngắn', color: 'Xám trắng', gender: 'Cái', status: 'progress', district: 'Đống Đa', street: 'Ngõ 120 Nguyên Hồng', x: 465, y: 375, minutesAgo: 48, updatedAgo: 9, desc: 'Mèo xám trắng bị thương ở chân sau, nấp dưới gầm xe.', traits: 'Chân sau phải bị thương, không đeo vòng.', photo: photo('cat1'), critical: true, condition: 'Bị thương', assignee: 'u3', reporter: 'u4', weight: '4 kg', age: '2 tuổi' }),
  c({ id: 'HP-1039', name: 'Bông', type: 'found', species: 'Chó', breed: 'Chó Spitz', color: 'Trắng', gender: 'Cái', status: 'resolved', district: 'Ba Đình', street: 'Phố Núi Trúc', x: 505, y: 262, minutesAgo: 1900, updatedAgo: 700, desc: 'Chó trắng lông xù, đã được đoàn tụ cùng chủ.', traits: 'Lông trắng muốt, mũi hồng.', photo: photo('white5'), reporter: 'u5', assignee: 'u3' }),
  c({ id: 'HP-1043', name: 'Chưa rõ tên', type: 'rescue', species: 'Chó', breed: 'Chó lai', color: 'Nâu', gender: 'Đực', status: 'active', district: 'Cầu Giấy', street: 'Khu vực Dịch Vọng Hậu', x: 300, y: 245, minutesAgo: 12, updatedAgo: 12, desc: 'Chó nâu bị xe va chạm, nằm bên lề đường, yếu và run.', traits: 'Chảy máu nhẹ ở chân trước, không có vòng cổ.', photo: photo('pup'), critical: true, condition: 'Bị thương nặng', reporter: 'u6' }),
  c({ id: 'HP-1044', name: 'Mochi', type: 'lost', species: 'Mèo', breed: 'Mèo Ba Tư', color: 'Kem', gender: 'Cái', status: 'active', district: 'Thanh Xuân', street: 'Nguyễn Tuân', x: 385, y: 492, minutesAgo: 95, updatedAgo: 40, desc: 'Mèo Ba Tư màu kem, mắt xanh, đeo nơ hồng.', traits: 'Mắt xanh, nơ hồng, rất nhát người lạ.', photo: photo('cat4'), reward: true, weight: '3.8 kg', age: '4 tuổi', reporter: 'u7' }),
  c({ id: 'HP-1045', name: 'Đậu', type: 'lost', species: 'Chó', breed: 'Poodle', color: 'Trắng', gender: 'Đực', status: 'active', district: 'Ba Đình', street: 'Kim Mã', x: 480, y: 285, minutesAgo: 32, updatedAgo: 12, desc: 'Poodle trắng nhỏ, cắt tỉa gọn, đeo vòng cổ xanh.', traits: 'Vòng cổ xanh, đuôi cụt.', photo: photo('white3'), match: 81, weight: '6 kg', age: '5 tuổi', reporter: 'u8' }),
  c({ id: 'HP-1046', name: 'Luna', type: 'found', species: 'Mèo', breed: 'Mèo mướp', color: 'Xám vằn', gender: 'Cái', status: 'active', district: 'Hoàn Kiếm', street: 'Phố Hàng Bài', x: 645, y: 335, minutesAgo: 22, updatedAgo: 22, desc: 'Mèo xám vằn rất hiền, đi lạc vào cửa hàng.', traits: 'Có chip? Chưa kiểm tra. Đang được giữ tạm.', photo: photo('cat2'), condition: 'Bình thường', reporter: 'u9' }),
  c({ id: 'HP-1047', name: 'Tofu', type: 'lost', species: 'Chó', breed: 'Corgi', color: 'Vàng trắng', gender: 'Đực', status: 'active', district: 'Đống Đa', street: 'Phố Tây Sơn', x: 495, y: 400, minutesAgo: 60, updatedAgo: 25, desc: 'Corgi chân ngắn, vàng trắng, hay chạy theo người lạ.', traits: 'Đuôi cộc tự nhiên, vết nâu quanh mắt.', photo: photo('golden3'), match: 74, weight: '11 kg', age: '2 tuổi', reporter: 'u10' }),
  c({ id: 'HP-1048', name: 'Bánh Bao', type: 'rescue', species: 'Mèo', breed: 'Mèo ta', color: 'Đen trắng', gender: 'Đực', status: 'active', district: 'Thanh Xuân', street: 'Khu tập thể Thanh Xuân Bắc', x: 360, y: 520, minutesAgo: 8, updatedAgo: 8, desc: 'Mèo đen trắng bị thương, mắt sưng, khó di chuyển.', traits: 'Mắt trái sưng, lông bẩn, gầy.', photo: photo('catBW'), critical: true, condition: 'Bị thương', reporter: 'u11' }),
  c({ id: 'HP-1049', name: 'Cốm', type: 'found', species: 'Chó', breed: 'Chó lai Phốc', color: 'Trắng kem', gender: 'Cái', status: 'progress', district: 'Hai Bà Trưng', street: 'Bạch Mai', x: 640, y: 470, minutesAgo: 130, updatedAgo: 30, desc: 'Chó nhỏ trắng kem, đang được giữ tại phòng khám.', traits: 'Vòng cổ nâu, đã tiêm phòng.', photo: photo('white4'), condition: 'Đã gửi phòng khám', assignee: 'u12', reporter: 'u2' }),
  c({ id: 'HP-1050', name: 'Sushi', type: 'lost', species: 'Mèo', breed: 'Mèo Anh lông ngắn', color: 'Xám xanh', gender: 'Đực', status: 'active', district: 'Tây Hồ', street: 'Xuân Diệu', x: 600, y: 160, minutesAgo: 180, updatedAgo: 70, desc: 'Mèo xám xanh, mắt vàng, thoát ra từ ban công tầng 2.', traits: 'Mắt vàng, có chip, đeo vòng bạc.', photo: photo('cat3'), reward: true, weight: '5 kg', age: '1 tuổi', reporter: 'u13' }),
  c({ id: 'HP-1051', name: 'Bắp', type: 'lost', species: 'Chó', breed: 'Golden Retriever', color: 'Vàng', gender: 'Đực', status: 'active', district: 'Nam Từ Liêm', street: 'Mễ Trì', x: 205, y: 335, minutesAgo: 240, updatedAgo: 90, desc: 'Golden to con, đeo vòng cổ đen.', traits: 'Vòng cổ đen, sẹo nhỏ ở tai phải.', photo: photo('golden3'), match: 69, weight: '30 kg', age: '4 tuổi', reporter: 'u14' }),
  c({ id: 'HP-1052', name: 'Nhím', type: 'rescue', species: 'Chó', breed: 'Chó lai', color: 'Trắng đốm đen', gender: 'Đực', status: 'pending', district: 'Hoàng Mai', street: 'Giải Phóng', x: 622, y: 585, minutesAgo: 300, updatedAgo: 20, desc: 'Đã được đưa tới Mái ấm Cún Con, chờ xác minh.', traits: 'Đốm đen quanh mắt trái.', photo: photo('white2'), condition: 'Đã đưa tới mái ấm', assignee: 'u3', reporter: 'u5', shelterId: 's1' }),
  c({ id: 'HP-1053', name: 'Kem', type: 'found', species: 'Mèo', breed: 'Mèo ta', color: 'Trắng', gender: 'Cái', status: 'active', district: 'Long Biên', street: 'Ngọc Lâm', x: 860, y: 320, minutesAgo: 55, updatedAgo: 55, desc: 'Mèo trắng tai cụp, đang trú dưới mái hiên.', traits: 'Lông trắng, tai cụp, sợ tiếng động.', photo: photo('cat4'), condition: 'Rất hoảng sợ', reporter: 'u6' }),
  c({ id: 'HP-1054', name: 'Gấu', type: 'lost', species: 'Chó', breed: 'Alaska', color: 'Xám trắng', gender: 'Đực', status: 'active', district: 'Hà Đông', street: 'Quang Trung', x: 215, y: 565, minutesAgo: 320, updatedAgo: 120, desc: 'Alaska xám trắng, to khỏe nhưng hiền.', traits: 'Lông dày, mắt xanh nhạt.', photo: photo('white1'), weight: '32 kg', age: '3 tuổi', reporter: 'u7' }),
  c({ id: 'HP-1055', name: 'Mun', type: 'found', species: 'Mèo', breed: 'Mèo ta', color: 'Đen trắng', gender: 'Đực', status: 'active', district: 'Bắc Từ Liêm', street: 'Phạm Văn Đồng', x: 275, y: 130, minutesAgo: 75, updatedAgo: 75, desc: 'Mèo đen trắng gầy, có vẻ đã lang thang vài ngày.', traits: 'Tai trái cắt nhỏ (dấu triệt sản).', photo: photo('catBW2'), condition: 'Bình thường', reporter: 'u10' }),
]

export interface Place {
  id: string; name: string; district: string; address: string; x: number; y: number
  rating: number; reviews: number; verified: boolean; photo: string; distance: number
  phone: string; website: string
}
export interface Shelter extends Place {
  about: string; pets: number; needs: string[]; urgent: boolean; bank: string; since: number
}
export interface Clinic extends Place {
  services: string[]; hours: string; open: boolean; emergency: boolean
}

export const SHELTERS: Shelter[] = [
  { id: 's1', name: 'Mái ấm Cún Con', district: 'Hoàng Mai', address: 'Ngõ 45 Giải Phóng, Hoàng Mai', x: 600, y: 600, rating: 4.9, reviews: 212, verified: true, photo: photo('shelter1', 900, 500), distance: 6.2, phone: '0912 345 678', website: 'cuncon.org.vn', about: 'Mái ấm tình nguyện nhận cứu hộ chó mèo bị bỏ rơi, bị thương. Đang chăm sóc 86 bé.', pets: 86, needs: ['10kg thức ăn cho chó trưởng thành', 'Thuốc tẩy giun', 'Chăn cũ'], urgent: true, bank: 'Vietcombank 0011004567890', since: 2018 },
  { id: 's2', name: 'Trạm Cứu Hộ Mèo Hà Nội', district: 'Đống Đa', address: 'Ngõ 22 Chùa Bộc, Đống Đa', x: 470, y: 420, rating: 4.8, reviews: 164, verified: true, photo: photo('shelter4', 900, 500), distance: 2.1, phone: '0987 222 118', website: 'meocuuho.vn', about: 'Chuyên tiếp nhận mèo hoang, mèo bị thương và tìm gia đình mới.', pets: 54, needs: ['Cát vệ sinh', 'Pate cho mèo con', 'Lồng vận chuyển'], urgent: true, bank: 'Techcombank 19036677880012', since: 2019 },
  { id: 's3', name: 'Ngôi Nhà Bốn Chân', district: 'Long Biên', address: 'Ngõ 8 Ngọc Lâm, Long Biên', x: 840, y: 360, rating: 4.7, reviews: 98, verified: true, photo: photo('shelter2', 900, 500), distance: 8.4, phone: '0933 410 722', website: 'nhabonchan.org', about: 'Không gian rộng ven sông Hồng cho hơn 60 bé chó đang chờ nhà mới.', pets: 62, needs: ['Hạt cho chó', 'Thuốc bổ'], urgent: false, bank: 'MB Bank 0369988776655', since: 2017 },
  { id: 's4', name: 'Mái Ấm Hạnh Phúc', district: 'Hà Đông', address: 'Km9 Quang Trung, Hà Đông', x: 190, y: 540, rating: 4.6, reviews: 77, verified: true, photo: photo('shelter5', 900, 500), distance: 9.7, phone: '0905 118 220', website: 'maiamhanhphuc.vn', about: 'Cứu hộ và phục hồi sức khỏe cho chó bị bỏ rơi.', pets: 41, needs: ['Chăn, đệm cũ', 'Thức ăn hạt'], urgent: true, bank: 'ACB 224455667', since: 2020 },
  { id: 's5', name: 'Trạm Yêu Thương Tây Hồ', district: 'Tây Hồ', address: 'Ngõ 12 Xuân Diệu, Tây Hồ', x: 570, y: 150, rating: 4.8, reviews: 130, verified: true, photo: photo('shelter3', 900, 500), distance: 5.3, phone: '0978 330 441', website: 'yeuthuong.pet', about: 'Mái ấm nhỏ nhưng ấm, nhận chó mèo từ cứu hộ khu vực Tây Hồ.', pets: 28, needs: ['Sữa bột cho mèo con'], urgent: false, bank: 'VPBank 1234500099', since: 2021 },
  { id: 's6', name: 'Bếp Ăn Chó Mèo Cầu Giấy', district: 'Cầu Giấy', address: 'Ngõ 165 Cầu Giấy', x: 320, y: 300, rating: 4.5, reviews: 52, verified: false, photo: photo('shelter1', 900, 500), distance: 1.2, phone: '0966 770 880', website: 'bepanchomeo.vn', about: 'Nhóm tình nguyện nấu ăn và chăm sóc mèo hoang trong khu vực.', pets: 19, needs: ['Pate', 'Thuốc nhỏ mắt'], urgent: false, bank: 'BIDV 5110000233', since: 2022 },
  { id: 's7', name: 'Nhà Của Mít', district: 'Thanh Xuân', address: 'Ngõ 100 Nguyễn Trãi', x: 400, y: 520, rating: 4.7, reviews: 88, verified: true, photo: photo('shelter4', 900, 500), distance: 3.8, phone: '0944 561 990', website: 'nhacuamit.vn', about: 'Mái ấm chuyên mèo, có khu cách ly và khu phục hồi.', pets: 47, needs: ['Cát vệ sinh', 'Thức ăn hạt mèo'], urgent: true, bank: 'Sacombank 060123456', since: 2019 },
  { id: 's8', name: 'Paws & Hearts Hanoi', district: 'Nam Từ Liêm', address: 'Ngõ 70 Mễ Trì Thượng', x: 195, y: 360, rating: 4.4, reviews: 41, verified: true, photo: photo('shelter3', 900, 500), distance: 7.0, phone: '0902 880 331', website: 'pawsandhearts.vn', about: 'Cứu hộ và tìm nhà cho chó mèo, hỗ trợ triệt sản miễn phí.', pets: 33, needs: ['Vaccine', 'Thức ăn'], urgent: false, bank: 'TPBank 0000999911', since: 2020 },
]

export const CLINICS: Clinic[] = [
  { id: 'c1', name: 'Phòng khám Thú y Pet Care', district: 'Cầu Giấy', address: '88 Trần Thái Tông, Cầu Giấy', x: 360, y: 255, rating: 4.8, reviews: 320, verified: true, photo: photo('shelter3', 900, 500), distance: 0.8, phone: '024 3999 1122', website: 'petcare.vn', services: ['Khám tổng quát', 'Tiêm phòng', 'Phẫu thuật', 'Cấp cứu 24/7'], hours: '08:00 – 22:00', open: true, emergency: true },
  { id: 'c2', name: 'Thú y Hà Nội Pet Hospital', district: 'Đống Đa', address: '12 Thái Hà, Đống Đa', x: 455, y: 340, rating: 4.7, reviews: 280, verified: true, photo: photo('shelter2', 900, 500), distance: 2.4, phone: '024 3888 2233', website: 'hanoipet.vn', services: ['Khám', 'Siêu âm', 'X-quang', 'Cấp cứu 24/7'], hours: '24/7', open: true, emergency: true },
  { id: 'c3', name: 'Happy Vet Thanh Xuân', district: 'Thanh Xuân', address: '45 Nguyễn Trãi, Thanh Xuân', x: 395, y: 475, rating: 4.6, reviews: 150, verified: true, photo: photo('shelter5', 900, 500), distance: 3.9, phone: '024 3777 4455', website: 'happyvet.vn', services: ['Khám', 'Tiêm phòng', 'Spa thú cưng'], hours: '08:00 – 20:00', open: true, emergency: false },
  { id: 'c4', name: 'Phòng khám Thú y Hai Bà Trưng', district: 'Hai Bà Trưng', address: '120 Bạch Mai, Hai Bà Trưng', x: 625, y: 455, rating: 4.5, reviews: 96, verified: true, photo: photo('shelter4', 900, 500), distance: 4.7, phone: '024 3666 5566', website: 'thuyhbt.vn', services: ['Khám', 'Xét nghiệm', 'Triệt sản'], hours: '08:00 – 19:00', open: false, emergency: false },
  { id: 'c5', name: 'Pet Hospital Tây Hồ', district: 'Tây Hồ', address: '20 Lạc Long Quân, Tây Hồ', x: 545, y: 165, rating: 4.9, reviews: 410, verified: true, photo: photo('shelter1', 900, 500), distance: 5.8, phone: '024 3555 6677', website: 'pethospital.vn', services: ['Phẫu thuật', 'Cấp cứu 24/7', 'Nội trú'], hours: '24/7', open: true, emergency: true },
  { id: 'c6', name: 'Thú y Long Biên', district: 'Long Biên', address: '66 Nguyễn Văn Cừ, Long Biên', x: 800, y: 300, rating: 4.3, reviews: 64, verified: false, photo: photo('shelter5', 900, 500), distance: 7.5, phone: '024 3444 7788', website: 'thuylongbien.vn', services: ['Khám', 'Tiêm phòng'], hours: '08:00 – 18:30', open: true, emergency: false },
  { id: 'c7', name: 'Phòng khám Thú y Hà Đông', district: 'Hà Đông', address: '15 Nguyễn Trãi, Hà Đông', x: 235, y: 585, rating: 4.4, reviews: 72, verified: true, photo: photo('shelter2', 900, 500), distance: 10.2, phone: '024 3333 8899', website: 'thuyhadong.vn', services: ['Khám', 'Tiêm phòng', 'Xét nghiệm'], hours: '08:00 – 20:00', open: true, emergency: false },
  { id: 'c8', name: 'Pet Care Hoàn Kiếm', district: 'Hoàn Kiếm', address: '32 Hàng Bài, Hoàn Kiếm', x: 660, y: 355, rating: 4.7, reviews: 190, verified: true, photo: photo('shelter3', 900, 500), distance: 4.2, phone: '024 3222 9900', website: 'petcarehk.vn', services: ['Khám', 'Spa', 'Phẫu thuật nhỏ'], hours: '09:00 – 21:00', open: true, emergency: false },
]

export interface Risk { id: string; title: string; type: string; x: number; y: number; r: number; severity: 'Thấp' | 'Trung bình' | 'Cao'; note: string; expires: string; reports: number }
export const RISKS: Risk[] = [
  { id: 'r1', title: 'Nghi trộm chó mèo', type: 'Khu vực nghi có trộm chó mèo', x: 270, y: 215, r: 55, severity: 'Cao', note: 'Có 5 báo cáo về người lạ dụ chó tại khu vực chung cư.', expires: '15/10/2026', reports: 5 },
  { id: 'r2', title: 'Có bẫy/bả', type: 'Khu vực có bẫy/bả', x: 520, y: 520, r: 45, severity: 'Cao', note: 'Phát hiện thức ăn nghi có bả gần công viên.', expires: '10/10/2026', reports: 3 },
  { id: 'r3', title: 'Điểm đến đáng ngờ', type: 'Điểm đến đáng ngờ', x: 740, y: 470, r: 40, severity: 'Trung bình', note: 'Địa điểm nhận "cứu hộ" nhưng thu tiền bất thường.', expires: '30/10/2026', reports: 4 },
  { id: 'r4', title: 'Khu vực nguy hiểm', type: 'Khu vực nguy hiểm', x: 160, y: 470, r: 50, severity: 'Trung bình', note: 'Công trình đang thi công, nhiều chó hoang bị thương.', expires: '20/10/2026', reports: 2 },
  { id: 'r5', title: 'Người dùng bị report nhiều', type: 'Người dùng bị report nhiều', x: 700, y: 230, r: 35, severity: 'Thấp', note: 'Khu vực có tài khoản bị report liên tục.', expires: '05/11/2026', reports: 6 },
]

export interface User {
  id: string; name: string; area: string; joined: string; cases: number; rescues: number
  reports: number; status: 'Hoạt động' | 'Cảnh báo' | 'Bị khóa'; verified: boolean; phone: string; bio: string; avatar: string
}
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

export interface Report {
  id: string; reporter: string; reported: string; reason: string; caseId: string
  created: string; severity: 'Low' | 'Medium' | 'High' | 'Critical'; status: 'Mới' | 'Đang xem xét' | 'Đã xử lý'; note: string
}
export const REPORTS: Report[] = [
  { id: 'RP-301', reporter: 'u2', reported: 'u14', reason: 'Đòi tiền', caseId: 'HP-1042', created: '2 giờ trước', severity: 'High', status: 'Mới', note: 'Người này nhắn tin đòi chuyển 2 triệu trước khi "trả" bé.' },
  { id: 'RP-302', reporter: 'u7', reported: 'u14', reason: 'Giả mạo người tìm thấy', caseId: 'HP-1044', created: '3 giờ trước', severity: 'Critical', status: 'Mới', note: 'Ảnh bé trong tin đăng lấy từ bài khác.' },
  { id: 'RP-303', reporter: 'u9', reported: 'u10', reason: 'Spam', caseId: 'HP-1047', created: '5 giờ trước', severity: 'Low', status: 'Đang xem xét', note: 'Đăng lặp lại nhiều tin giống nhau.' },
  { id: 'RP-304', reporter: 'u5', reported: 'u10', reason: 'Khả nghi bắt trộm', caseId: 'HP-1045', created: '6 giờ trước', severity: 'Critical', status: 'Mới', note: 'Hỏi vị trí chi tiết của nhiều bé nhỏ trong cùng một khu.' },
  { id: 'RP-305', reporter: 'u3', reported: 'u14', reason: 'Lừa đảo', caseId: 'HP-1051', created: 'Hôm qua', severity: 'High', status: 'Đang xem xét', note: 'Số điện thoại trùng với 3 tài khoản khác.' },
  { id: 'RP-306', reporter: 'u1', reported: 'u10', reason: 'Địa điểm đáng ngờ', caseId: 'HP-1043', created: 'Hôm qua', severity: 'Medium', status: 'Mới', note: 'Yêu cầu mang bé tới một địa chỉ lạ.' },
  { id: 'RP-307', reporter: 'u12', reported: 'u5', reason: 'Nội dung nguy hiểm', caseId: 'HP-1039', created: '2 ngày trước', severity: 'Low', status: 'Đã xử lý', note: 'Chia sẻ vị trí chính xác của bé bị thương.' },
  { id: 'RP-308', reporter: 'u13', reported: 'u14', reason: 'Giả mạo chủ nuôi', caseId: 'HP-1050', created: '2 ngày trước', severity: 'High', status: 'Mới', note: 'Nhận là chủ bé nhưng không có ảnh gốc.' },
  { id: 'RP-309', reporter: 'u6', reported: 'u10', reason: 'Spam', caseId: 'HP-1053', created: '3 ngày trước', severity: 'Low', status: 'Đã xử lý', note: 'Quảng cáo dịch vụ trong phần bình luận.' },
]

export interface Notif { id: string; kind: 'rescue' | 'match' | 'community' | 'safety'; title: string; body: string; ago: string; caseId?: string; unread: boolean }
export const NOTIFS: Notif[] = [
  { id: 'n1', kind: 'rescue', title: 'Có một bé chó cần được để mắt gần bạn', body: 'Milo mất tích cách bạn 800m tại Trần Thái Tông.', ago: '5 phút trước', caseId: 'HP-1042', unread: true },
  { id: 'n2', kind: 'match', title: 'Có một kết quả AI Match 87% với Milo', body: 'Một bé chó vàng trắng vừa được báo thấy tại Cầu Giấy.', ago: '12 phút trước', caseId: 'HP-1042', unread: true },
  { id: 'n3', kind: 'rescue', title: 'Case Milo vừa được cập nhật vị trí tại Trần Thái Tông', body: 'Lần cuối thấy bé cách đây 15 phút.', ago: '20 phút trước', caseId: 'HP-1042', unread: true },
  { id: 'n4', kind: 'safety', title: 'Cảnh báo khu vực mới ở Cầu Giấy', body: 'Cộng đồng đánh dấu khu vực nghi trộm chó mèo gần bạn.', ago: '1 giờ trước', unread: false },
  { id: 'n5', kind: 'rescue', title: 'Ca cứu hộ Bông đã được xác nhận thành công', body: 'Cảm ơn Nguyễn Minh và Mái ấm Cún Con.', ago: 'Hôm qua', caseId: 'HP-1039', unread: false },
  { id: 'n6', kind: 'community', title: 'Bạn nhận được huy hiệu "Người giúp đỡ"', body: 'Cảm ơn bạn đã chia sẻ 10 case trong tuần.', ago: '2 ngày trước', unread: false },
]

export interface LeaderRow { name: string; area: string; rescues: number; joined: string; verified: boolean; avatar: string }
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

export interface Story { id: string; title: string; excerpt: string; photo: string; author: string; place: string }
export const STORIES: Story[] = [
  { id: 'st1', title: 'Bông trở về nhà sau 2 ngày lạc', excerpt: 'Nhờ một bức ảnh được chia sẻ trong nhóm, cô bé Spitz đã đoàn tụ cùng gia đình ở Ba Đình.', photo: photo('white5', 700, 460), author: 'Nguyễn Minh', place: 'Ba Đình' },
  { id: 'st2', title: 'Chú mèo dưới gầm xe đã có mái ấm', excerpt: 'Một ca cứu hộ lúc nửa đêm, ba tình nguyện viên và một phòng khám mở cửa muộn.', photo: photo('cat1', 700, 460), author: 'Ngô Phương Thảo', place: 'Hoàn Kiếm' },
  { id: 'st3', title: '41 lần cứu hộ của một người bình thường', excerpt: 'Anh Minh kể về lý do mỗi tối đều mang theo lồng vận chuyển trên xe.', photo: photo('shelter3', 700, 460), author: 'Happy Paw', place: 'Đống Đa' },
]

export const REASONS = [
  'Khả nghi bắt trộm', 'Đòi tiền', 'Giả mạo chủ nuôi', 'Giả mạo người tìm thấy',
  'Spam', 'Lừa đảo', 'Nội dung nguy hiểm', 'Địa điểm đáng ngờ',
]

export const timeAgo = (m: number) =>
  m < 1 ? 'Vừa xong' : m < 60 ? `${m} phút trước` : m < 1440 ? `${Math.round(m / 60)} giờ trước` : `${Math.round(m / 1440)} ngày trước`
