import { photo } from "../photos"
import type { SafetyAlertStory } from "@/types/safety"

export const SAFETY_ALERT_STORIES: SafetyAlertStory[] = [
  {
    id: "alt-1",
    title: "Phát hiện xúc xích nghi tẩm thuốc diệt chuột tại vườn hoa Nghĩa Đô",
    category: "Bả độc / Đồ ăn lạ",
    severity: "Khẩn cấp",
    district: "Cầu Giấy",
    address: "Công viên Nghĩa Đô, đường Nguyễn Văn Huyên",
    excerpt:
      "Nhiều mẩu xúc xích rải bột xanh lạ bị giấu quanh các gốc cây bãi cỏ nơi người dân hay dắt chó đi dạo buổi sáng.",
    fullStory:
      "Sáng nay lúc 6h30 khi dắt bé Corgi đi dạo quanh thảm cỏ phía sau tượng đài công viên Nghĩa Đô, tôi phát hiện bé cúi gặm một mẩu xúc xích lạ. Khi giật lại kiểm tra thì thấy bên trong bị nhét bột xanh hạt li ti mùi hắc nồng, rất giống bả chuột tẩm thạch tín. Tôi đã thu gom được 4 miếng quanh 2 gốc xà cừ gần ghế đá và báo ngay cho ban quản lý công viên. Hiện tại đã có 2 bé cún khác có dấu hiệu nôn mửa được đưa cấp cứu tại thú y đường Hoàng Quốc Việt. Đề nghị mọi người nuôi thú cưng tạm thời đeo rọ mõm và tránh thả rông ở khu vực này!",
    photos: [
      photo("corgi1", 800, 500),
      photo("clinic1", 800, 500),
      photo("shelter1", 800, 500),
    ],
    author: {
      id: "u-phuong",
      name: "Trần Mai Phương",
      avatar: "plum",
      isVerified: true,
      role: "Tình nguyện viên Cầu Giấy",
    },
    createdAt: "2 giờ trước (07:30)",
    expiresAt: "10/10/2026",
    confirmsCount: 42,
    hasConfirmed: false,
    coordinates: { x: 340, y: 265, r: 45 },
    updates: [
      {
        id: "up-1-1",
        time: "08:15",
        content: "BQL công viên đã cử nhân viên vệ sinh rà soát toàn bộ các thảm cỏ quanh khu vui chơi trẻ em.",
        author: "BQL Công viên Nghĩa Đô",
      },
      {
        id: "up-1-2",
        time: "09:30",
        content: "Phòng khám thú y Pet Care xác nhận mẫu vật chứa chất phosphide kẽm, khuyến cáo chủ nuôi cực kỳ thận trọng.",
        author: "BS. Hoàng Long (Pet Care)",
      },
      {
        id: "up-1-3",
        time: "11:00",
        content: "Công an phường Dịch Vọng đã trích xuất camera lối vào công viên để truy vết đối tượng thả bả lúc nửa đêm.",
        author: "TNV Mai Phương",
      },
    ],
    firstAidAdvice: [
      "Nếu nghi ngờ bé ăn phải bả dưới 30 phút: Cho uống nước oxy già 3% (1-2ml/kg) hoặc nước muối ấm pha đặc để kích nôn khẩn cấp.",
      "Cho uống than hoạt tính (Active Charcoal) ngay sau khi nôn để hấp thụ độc tố còn sót trong ruột.",
      "Mang ngay bé và mẫu thức ăn nghi ngờ tới phòng khám thú y gần nhất, tuyệt đối không chần chừ quá 1 giờ.",
    ],
    statusNote: "Đang được BQL & Công an phường kiểm tra thắt chặt.",
  },
  {
    id: "alt-2",
    title: "Cảnh báo 2 đối tượng đi xe máy tiếp cận dụ chó Poodle ở khu đô thị Định Công",
    category: "Nghi trộm thú cưng",
    severity: "Khẩn cấp",
    district: "Hoàng Mai",
    address: "Khu biệt thự liền kề ĐTM Định Công",
    excerpt:
      "Camera ghi nhận hai thanh niên đi xe Wave đen không biển số thường lượn lờ giờ tan tầm, mang theo vợt lưới và thức ăn mồi.",
    fullStory:
      "Vào lúc 17h45 ngày hôm qua, khi một bé Poodle trắng đang chạy trước cổng nhà ở dãy Liền kề 3 ĐTM Định Công thì có hai đối tượng đi xe máy áp sát. Người ngồi sau giả vờ vẫy đồ ăn cho bé lại gần, sau đó rút thòng lọng dây dù chuẩn bị thắt cổ bé. Rất may chủ nhà kịp thời hô hoán nên hai kẻ này đã tăng ga bỏ chạy theo hướng đường Kim Giang. Đoạn camera an ninh đã được giao cho tổ bảo vệ khu đô thị để cảnh giác toàn bộ cư dân.",
    photos: [
      photo("poodle1", 800, 500),
      photo("white1", 800, 500),
    ],
    author: {
      id: "u-anonym-1",
      name: "Cư dân Định Công",
      isAnonymous: true,
      role: "Thành viên cộng đồng",
    },
    createdAt: "Hôm qua lúc 19:15",
    expiresAt: "25/10/2026",
    confirmsCount: 29,
    hasConfirmed: true,
    coordinates: { x: 620, y: 585, r: 50 },
    updates: [
      {
        id: "up-2-1",
        time: "Hôm qua 20:00",
        content: "Bảo vệ các cổng ra vào khu đô thị Định Công đã tăng cường kiểm tra các xe khả nghi không biển số.",
        author: "BQL ĐTM Định Công",
      },
      {
        id: "up-2-2",
        time: "Hôm nay 08:00",
        content: "Nhiều hộ gia đình trong ngõ đã thống nhất không thả chó chạy tự do trước ngõ khi không có dây dắt.",
        author: "Cư dân",
      },
    ],
    firstAidAdvice: [
      "Luôn luôn sử dụng dây dắt (leash) khi dắt cún cưng đi dạo ngoài đường ngõ, kể cả trong khu đô thị khép kín.",
      "Gắn thẻ tên (tag) có số điện thoại của bạn vào vòng cổ của bé đề phòng lạc hoặc bị bắt cóc.",
      "Lưu ngay số hotline bảo vệ tòa nhà hoặc công an phường vào danh bạ điện thoại.",
    ],
    statusNote: "Bảo vệ khu vực đang tăng cường tuần tra vào các khung giờ cao điểm.",
  },
  {
    id: "alt-3",
    title: "Chiêu trò giả vờ tìm thấy mèo đi lạc để tống tiền chuộc 1.500.000đ ở Ba Đình",
    category: "Lừa đảo tiền cọc / chuộc",
    severity: "Cảnh giác",
    district: "Ba Đình",
    address: "Khu vực Liễu Giai - Đội Cấn",
    excerpt:
      "Đối tượng lấy ảnh từ bài tìm pet thất lạc, gọi điện thoại dọa giết bé nếu không chuyển khoản trước tiền chuộc qua mã QR.",
    fullStory:
      "Sau khi bạn Hương đăng bài tìm bé mèo Anh lông ngắn bị lạc ở ngõ 285 Đội Cấn, một số điện thoại 0983.xxx.712 đã liên hệ xưng là người làm ở bãi trông xe gần đó nhặt được. Đối tượng yêu cầu chuyển ngay 1.500.000đ tiền chuộc thì mới giao mèo tại đầu ngõ, từ chối bật video call với lý do 'điện thoại vỡ màn hình' và gửi ảnh cũ của chính bài đăng để làm bằng chứng. Khi bị yêu cầu chụp ảnh góc mới kèm tờ giấy ghi ngày thì đối tượng quay sang chửi bới, dọa bán cho quán thịt mèo. Đây là chiêu trò lừa đảo tâm lý nhắm vào người đang hoảng loạn tìm thú cưng!",
    photos: [
      photo("cat1", 800, 500),
      photo("cat2", 800, 500),
    ],
    author: {
      id: "u-huong",
      name: "Nguyễn Thu Hương",
      avatar: "butter",
      isVerified: true,
      role: "Chủ nuôi tìm pet",
    },
    createdAt: "3 giờ trước (09:40)",
    expiresAt: "15/10/2026",
    confirmsCount: 38,
    hasConfirmed: false,
    coordinates: { x: 500, y: 275, r: 40 },
    updates: [
      {
        id: "up-3-1",
        time: "10:15",
        content: "Đã có 3 thành viên khác xác nhận cùng nhận được cuộc gọi từ số điện thoại này với kịch bản tương tự.",
        author: "Admin Happy Paws",
      },
      {
        id: "up-3-2",
        time: "11:20",
        content: "Hệ thống Happy Paws đã đưa số tài khoản ngân hàng và số điện thoại này vào danh sách đen Blacklist.",
        author: "Admin",
      },
    ],
    firstAidAdvice: [
      "NGUYÊN TẮC VÀNG: Tuyệt đối KHÔNG chuyển tiền cọc hoặc tiền chuộc khi chưa tận mắt nhìn thấy thú cưng.",
      "Yêu cầu người gọi gọi video call trực tiếp hoặc chụp ảnh bé giơ kèm một tờ giấy ghi rõ giờ phút hiện tại.",
      "Nếu người giữ thú cưng đòi gặp mặt giao dịch, hãy hẹn ở địa điểm công cộng đông người (quán cà phê, sảnh chung cư, đồn công an) và đi cùng 1-2 người bạn.",
    ],
    statusNote: "Tài khoản và số điện thoại đã bị đưa vào Blacklist bảo vệ cộng đồng.",
  },
  {
    id: "alt-4",
    title: "Điểm đen tai nạn giao thông xe container nguy hiểm tại ngã tư Nguyễn Trãi - Khuất Duy Tiến",
    category: "Điểm đen tai nạn",
    severity: "Cảnh giác",
    district: "Thanh Xuân",
    address: "Nút giao 4 tầng Nguyễn Trãi - Khuất Duy Tiến",
    excerpt:
      "Góc cua khuất tầm nhìn, xe tải hạng nặng thường xuyên chuyển làn gấp, đã có 3 ca cứu hộ chó mèo bị chấn thương nặng trong tuần qua.",
    fullStory:
      "Khu vực ngã tư hầm chui Nguyễn Trãi - Khuất Duy Tiến có lưu lượng xe tải và xe buýt BRT di chuyển rất nhanh vào ban đêm và sáng sớm. Các bé chó mèo lang thang hoặc tuột xích rất dễ bị cuốn vào gầm bánh xe ở các góc cua rẽ vào đường gom vành đai 3. Đội cứu hộ tình nguyện Happy Paws đã phải tiếp nhận cấp cứu 3 ca gãy xương chậu và tổn thương nội tạng tại điểm này trong 7 ngày qua. Khuyến cáo người dân không dắt chó đi vệ sinh gần mép vỉa hè trục đường này.",
    photos: [
      photo("shelter3", 800, 500),
      photo("clinic2", 800, 500),
    ],
    author: {
      id: "u-minh",
      name: "Lê Tuấn Minh",
      avatar: "sage",
      isVerified: true,
      role: "Đội phản ứng nhanh cứu hộ",
    },
    createdAt: "1 ngày trước",
    expiresAt: "30/10/2026",
    confirmsCount: 19,
    hasConfirmed: false,
    coordinates: { x: 380, y: 505, r: 50 },
    updates: [
      {
        id: "up-4-1",
        time: "Hôm qua",
        content: "Cả 3 bé bị tai nạn đã được phẫu thuật cố định xương tại Phòng khám Pet Care và đang hồi phục tốt.",
        author: "TNV Tuấn Minh",
      },
    ],
    firstAidAdvice: [
      "Khi tiếp cận thú cưng bị tai nạn giao thông: Dùng chăn hoặc áo khoác quấn nhẹ nhàng để tránh bị cắn do bé đang đau đớn và hoảng loạn.",
      "Đặt bé nằm nghiêng trên một tấm ván cứng hoặc bìa carton phẳng để không làm tổn thương thêm cột sống.",
      "Gọi ngay cho xe cấp cứu thú y hoặc hotline cứu hộ Happy Paws để nhận hướng dẫn sơ cứu cầm máu.",
    ],
    statusNote: "Đang duy trì cảnh báo cảnh giác giao thông.",
  },
  {
    id: "alt-5",
    title: "Tài khoản 'Cứu trợ pet Hà Nội 24h' giả mạo nhận nuôi để gom bán cho lò mổ",
    category: "Tài khoản khả nghi",
    severity: "Khẩn cấp",
    district: "Đống Đa",
    address: "Khu vực Đê La Thành - Hào Nam",
    excerpt:
      "Tài khoản Zalo/Facebook liên tục xin nhận nuôi các bé chó mèo ta và chó lai nhưng không cung cấp được nơi ở thực tế.",
    fullStory:
      "Cảnh báo tới tất cả các trạm cứu hộ và chủ nuôi đang cần tìm chủ mới cho các bé: Có một nhóm đối tượng lập trang fanpage 'Cứu trợ pet Hà Nội 24h' chuyên săn đón các bài đăng 'Tặng pet / Cho nhận nuôi miễn phí'. Sau khi hẹn đón bé về, họ chặn số liên lạc và mang bán lại cho các lò mổ ở vùng ven. Một trạm cứu hộ ở Đống Đa đã đến tận địa chỉ người này khai thì phát hiện đó là địa chỉ ma không có thật. Mọi người khi cho nhận nuôi bắt buộc phải thẩm định gia đình kỹ lưỡng!",
    photos: [
      photo("pup", 800, 500),
      photo("catTabby1", 800, 500),
    ],
    author: {
      id: "u-diep",
      name: "Hoàng Bích Diệp",
      avatar: "terracotta",
      isVerified: true,
      role: "Trưởng Mái ấm Mầm Xanh",
    },
    createdAt: "2 ngày trước",
    expiresAt: "20/10/2026",
    confirmsCount: 65,
    hasConfirmed: false,
    coordinates: { x: 470, y: 385, r: 40 },
    updates: [
      {
        id: "up-5-1",
        time: "Hôm qua",
        content: "Cộng đồng đã liên kết phát hiện thêm 2 nick clone cùng số tài khoản ngân hàng của nhóm đối tượng này.",
        author: "Bích Diệp",
      },
    ],
    firstAidAdvice: [
      "Quy trình nhận nuôi an toàn: Bắt buộc phỏng vấn trực tiếp, kiểm tra giấy tờ tùy thân hoặc căn cước công dân.",
      "Yêu cầu cam kết triệt sản và đồng ý cho tình nguyện viên ghé thăm nhà hoặc gọi video định kỳ 3 tháng đầu.",
      "Lập biên bản bàn giao nhận nuôi có chữ ký 2 bên và giữ lại số điện thoại người thân trong gia đình.",
    ],
    statusNote: "Đối tượng đang trong diện theo dõi đặc biệt của mạng lưới các mái ấm.",
  },
  {
    id: "alt-6",
    title: "Hố ga mất nắp nguy hiểm trên vỉa hè phố Trần Đại Nghĩa - Đã được rào chắn an toàn",
    category: "Khu vực nguy hiểm",
    severity: "Đã khắc phục",
    district: "Hai Bà Trưng",
    address: "Đối diện số 118 Trần Đại Nghĩa",
    excerpt:
      "Hố ga sâu hơn 2 mét bị mất nắp sau trận mưa lớn đã từng khiến 1 bé Poodle lọt xuống cống, nay đã được đặt nắp đậy bê tông mới.",
    fullStory:
      "Vào tối ngày 28/09, sau cơn mưa lớn ngập đường, một hố ga gom nước trước số 118 Trần Đại Nghĩa bị bật nắp trôi mất. Một bé Poodle đi cùng chủ đã bị thụt chân rơi xuống may mắn được người dân dùng thang vớt lên kịp thời. Ngay sau khi cộng đồng Happy Paws đăng cảnh báo điểm đen, Công ty Thoát nước Hà Nội đã tiếp nhận thông tin và lắp đặt nắp bê tông đúc mới cùng biển cảnh báo phản quang.",
    photos: [
      photo("poodle2", 800, 500),
      photo("white2", 800, 500),
    ],
    author: {
      id: "u-bachkhoa",
      name: "Đặng Tuấn Anh",
      avatar: "sky",
      isVerified: true,
      role: "CLB Pet Bách Khoa",
    },
    createdAt: "3 ngày trước",
    expiresAt: "10/10/2026",
    confirmsCount: 51,
    hasConfirmed: true,
    coordinates: { x: 640, y: 460, r: 35 },
    updates: [
      {
        id: "up-6-1",
        time: "29/09 Lúc 09:00",
        content: "Đội công nhân thoát nước đã hoàn thành việc đậy nắp cống kiên cố và nghiệm thu an toàn.",
        author: "Đặng Tuấn Anh",
      },
    ],
    firstAidAdvice: [
      "Sau khi thú cưng bị rơi xuống cống nước thải: Lập tức tắm lại bằng sữa tắm sát trùng và sấy khô giữ ấm để tránh viêm phổi hạ thân nhiệt.",
      "Nhỏ mắt và tai bằng nước muối sinh lý 0.9% để làm sạch bùn bẩn độc hại.",
    ],
    statusNote: "Khu vực đã được xử lý hoàn tất, an toàn cho cư dân và thú cưng dạo chơi.",
  },
]
