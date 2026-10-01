import { Heart, MapPin, Phone, Mail } from 'lucide-react'
import { useApp } from '@/store'
import { Logo, Btn } from '@/components/ui'

export default function LandingFooter() {
  const { go } = useApp()

  return (
    <footer className="border-t-2 border-brown/20 bg-paper py-14 text-brown">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand & Mission Col (Span 2) */}
          <div className="space-y-4 lg:col-span-2">
            <Logo onClick={() => go('/')} />
            <p className="max-w-sm text-sm font-semibold leading-relaxed text-brown-soft">
              Nền tảng công nghệ số kết nối cộng đồng người yêu động vật, trạm cứu trợ và phòng khám thú y
              tại Hà Nội. Giúp tìm lại thú cưng thất lạc và hỗ trợ y tế khẩn cấp kịp thời cho các bé chó mèo gặp nạn.
            </p>

            <div className="space-y-2 pt-2 text-xs font-bold text-brown">
              <p className="flex items-center gap-2">
                <MapPin className="size-4 text-coral shrink-0" />
                <span>Hoạt động trên toàn địa bàn 12 quận, TP. Hà Nội</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="size-4 text-coral shrink-0" />
                <span>Đường dây nóng cấp cứu 24/7: <strong>0912 345 678</strong></span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="size-4 text-coral shrink-0" />
                <span>Email hỗ trợ: hotro@happypaw.vn</span>
              </p>
            </div>
          </div>

          {/* Col 1: Cứu hộ & Tìm kiếm */}
          <div>
            <h4 className="font-display text-base font-extrabold text-brown">Cứu hộ & Tìm kiếm</h4>
            <ul className="mt-3.5 space-y-2 text-sm font-bold text-brown-soft">
              <li>
                <Btn variant="ghost" size="sm" onClick={() => go('/map')} className="h-auto p-0 font-bold text-brown-soft hover:text-brown justify-start">
                  Bản đồ radar cứu trợ
                </Btn>
              </li>
              <li>
                <Btn variant="ghost" size="sm" onClick={() => go('/find')} className="h-auto p-0 font-bold text-brown-soft hover:text-brown justify-start">
                  Tìm kiếm thú cưng lạc
                </Btn>
              </li>
              <li>
                <Btn variant="ghost" size="sm" onClick={() => go('/ai-match')} className="h-auto p-0 font-bold text-brown-soft hover:text-brown justify-start">
                  Công nghệ AI Match
                </Btn>
              </li>
              <li>
                <Btn variant="ghost" size="sm" onClick={() => go('/report')} className="h-auto p-0 font-bold text-brown-soft hover:text-brown justify-start">
                  Báo ca khẩn cấp
                </Btn>
              </li>
            </ul>
          </div>

          {/* Col 2: Cộng đồng & Mái ấm */}
          <div>
            <h4 className="font-display text-base font-extrabold text-brown">Cộng đồng & Trạm</h4>
            <ul className="mt-3.5 space-y-2 text-sm font-bold text-brown-soft">
              <li>
                <Btn variant="ghost" size="sm" onClick={() => go('/shelters')} className="h-auto p-0 font-bold text-brown-soft hover:text-brown justify-start">
                  Mạng lưới mái ấm
                </Btn>
              </li>
              <li>
                <Btn variant="ghost" size="sm" onClick={() => go('/clinics')} className="h-auto p-0 font-bold text-brown-soft hover:text-brown justify-start">
                  Phòng khám thú y 24/7
                </Btn>
              </li>
              <li>
                <Btn variant="ghost" size="sm" onClick={() => go('/donate')} className="h-auto p-0 font-bold text-brown-soft hover:text-brown justify-start">
                  Ủng hộ thức ăn & thuốc
                </Btn>
              </li>
              <li>
                <Btn variant="ghost" size="sm" onClick={() => go('/leaderboard')} className="h-auto p-0 font-bold text-brown-soft hover:text-brown justify-start">
                  Bảng vinh danh tình nguyện
                </Btn>
              </li>
            </ul>
          </div>

          {/* Col 3: An toàn & Hướng dẫn */}
          <div>
            <h4 className="font-display text-base font-extrabold text-brown">An toàn & Điều khoản</h4>
            <ul className="mt-3.5 space-y-2 text-sm font-bold text-brown-soft">
              <li>
                <Btn variant="ghost" size="sm" onClick={() => go('/safety')} className="h-auto p-0 font-bold text-brown-soft hover:text-brown justify-start">
                  Cảnh báo điểm đen & lừa đảo
                </Btn>
              </li>
              <li>
                <span className="cursor-default">Quy tắc nhận nuôi văn minh</span>
              </li>
              <li>
                <span className="cursor-default">Bảo mật thông tin người báo</span>
              </li>
              <li>
                <span className="cursor-default">Chính sách cộng đồng Happy Paw</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t-2 border-line pt-6 text-center text-xs font-bold text-brown-soft sm:flex-row">
          <p>© 2026 Happy Paw Hanoi. Dự án cộng đồng phi lợi nhuận vì phúc lợi động vật.</p>
          <p className="flex items-center gap-1">
            Được xây dựng với tất cả tình yêu dành cho các bé bốn chân
            <Heart className="size-3.5 fill-coral text-coral inline" />
          </p>
        </div>
      </div>
    </footer>
  )
}
