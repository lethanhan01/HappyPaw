import { Map, Cpu, ShieldCheck, HeartHandshake, CheckCircle2, ArrowRight } from 'lucide-react'
import { useApp } from '@/store'
import { Btn, Badge } from '@/components/ui'

const FEATURES = [
  {
    id: 'radar',
    title: 'Bản đồ Radar Cứu trợ Thời gian thực',
    desc: 'Hệ thống bản đồ định vị các ca nguy kịch và thú cưng lạc tại 12 quận Hà Nội. Tích hợp cảnh báo khu vực có bẫy bả và điểm đen trộm cắp.',
    badge: 'BẢN ĐỒ SỐ HÀ NỘI',
    tone: 'sky',
    icon: Map,
    highlights: [
      'Lọc bán kính từ 1km đến 10km quanh vị trí bạn',
      'Định vị điểm đen nguy hiểm (bẫy bả, trộm chó mèo)',
      'Xem thông tin phòng khám 24/7 gần nhất',
    ],
    action: 'Xem bản đồ radar',
    route: '/map',
  },
  {
    id: 'ai-match',
    title: 'Công nghệ AI Image Matching 🐾',
    desc: 'Thuật toán thị giác máy tính đối soát ảnh chụp bé đi lạc và tin báo thấy, nhận diện hoa văn lông, dáng tai, đốm mắt với độ chuẩn xác cao.',
    badge: 'AI CỨU HỘ ĐỘC QUYỀN',
    tone: 'plum',
    icon: Cpu,
    highlights: [
      'Tự động so khớp tin báo mất và tin tìm thấy',
      'Độ tin cậy hiển thị trực quan (AI Match %)',
      'Phát hiện vết bớt, đốm ngực, dáng tai đặc biệt',
    ],
    action: 'Tìm hiểu AI Match',
    route: '/ai-match',
  },
  {
    id: 'shelters',
    title: 'Mạng lưới Mái ấm & Thú y 24/7',
    desc: 'Liên kết hơn 42 trạm cứu trợ tình nguyện và phòng khám thú y được xác minh uy tín. Sẵn sàng tiếp nhận điều trị nội trú và cứu chữa khẩn.',
    badge: 'ĐỐI TÁC XÁC MINH',
    tone: 'butter',
    icon: ShieldCheck,
    highlights: [
      'Phòng khám có bác sĩ trực cấp cứu xuyên đêm',
      'Minh bạch nhu cầu quyên góp (thức ăn, thuốc, chăn)',
      'Xe cứu thương thú y hỗ trợ các ca tai nạn nặng',
    ],
    action: 'Khám phá mạng lưới',
    route: '/shelters',
  },
  {
    id: 'adoption',
    title: 'Nhận nuôi Văn minh & Chống Gian lận',
    desc: 'Xây dựng quy trình nhận nuôi an toàn, yêu cầu phỏng vấn cam kết và lưu trữ nhật ký sức khỏe, ngăn chặn tình trạng trục lợi thương mại.',
    badge: 'VÌ PHÚC LỢI ĐỘNG VẬT',
    tone: 'sage',
    icon: HeartHandshake,
    highlights: [
      'Xác minh danh tính người nhận nuôi nghiêm ngặt',
      'Theo dõi phục hồi sức khỏe sau khi về nhà mới',
      'Hệ thống báo cáo tài khoản có dấu hiệu gian lận',
    ],
    action: 'Tìm hiểu nhận nuôi',
    route: '/community',
  },
]

export default function CoreFeatures() {
  const { go } = useApp()

  return (
    <section id="features" className="py-16 md:py-24 bg-paper/60 border-y-2 border-line">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto">
          <Badge tone="butter">CÔNG NGHỆ & CỘNG ĐỒNG</Badge>
          <h2 className="bubble mt-4 text-3xl sm:text-5xl font-extrabold tracking-tight">
            4 Trụ cột Công nghệ <br />
            <span className="bubble-yellow">bảo vệ những chiếc đuôi nhỏ</span>
          </h2>
          <p className="mt-3 text-base sm:text-lg font-bold text-brown-soft">
            Happy Paws ứng dụng công nghệ định vị và trí tuệ nhân tạo để số hóa quy trình cứu nạn động vật,
            rút ngắn thời gian tìm kiếm từ vài tuần xuống chỉ còn vài giờ.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {FEATURES.map((f) => (
            <div
              key={f.id}
              className="flex flex-col justify-between rounded-[32px] border-2 border-brown bg-paper p-6 sm:p-8 shadow-[0_5px_0_var(--color-brown)] transition hover:-translate-y-1 hover:shadow-[0_8px_0_var(--color-brown)]"
            >
              <div>
                <div className="flex items-center justify-between gap-3">
                  <span
                    className={`inline-grid size-14 place-items-center rounded-2xl border-2 border-brown shadow-soft ${
                      f.tone === 'sky'
                        ? 'bg-sky-soft text-sky-2'
                        : f.tone === 'plum'
                        ? 'bg-plum-soft text-plum'
                        : f.tone === 'butter'
                        ? 'bg-butter text-brown'
                        : 'bg-sage-soft text-sage-2'
                    }`}
                  >
                    <f.icon className="size-7" />
                  </span>
                  <Badge tone={f.tone}>{f.badge}</Badge>
                </div>

                <h3 className="mt-5 font-display text-2xl font-extrabold text-brown">
                  {f.title}
                </h3>
                <p className="mt-2 text-base font-semibold leading-relaxed text-brown-soft">
                  {f.desc}
                </p>

                {/* Highlight Checkpoints */}
                <div className="mt-5 space-y-2.5 rounded-2xl border-2 border-line bg-cream/40 p-4">
                  {f.highlights.map((h, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-sm font-bold text-brown">
                      <CheckCircle2 className="size-4 shrink-0 text-sage-2 mt-0.5" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-2">
                <Btn
                  variant="secondary"
                  size="md"
                  full
                  icon={<ArrowRight className="size-4" />}
                  onClick={() => go(f.route)}
                  className="hover:bg-butter/50"
                >
                  {f.action}
                </Btn>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
