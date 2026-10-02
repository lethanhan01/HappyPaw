import { Heart, MapPin, Phone, Mail } from "lucide-react"
import { useApp } from "@/store"
import { Logo, Btn } from "@/components/ui"

export default function LandingFooter() {
  const { auth, go, toast } = useApp()

  const navigateWithAuth = (targetPath: string) => {
    if (auth === "guest") {
      toast("Vui lòng đăng nhập để truy cập tính năng này.", "warn")
      go(`/login?redirect=${encodeURIComponent(targetPath)}`)
    } else {
      go(targetPath)
    }
  }

  return (
    <footer className="w-full max-w-full overflow-hidden border-t-2 border-brown/20 bg-paper py-10 sm:py-14 text-brown">
      <div className="mx-auto max-w-[1440px] px-3.5 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand & Mission Col (Span 2) */}
          <div className="space-y-4 lg:col-span-2">
            <Logo onClick={() => go("/")} />
            <p className="max-w-sm text-sm font-semibold leading-relaxed text-brown-soft">
              Nền tảng công nghệ số kết nối cộng đồng người yêu động vật, trạm
              cứu trợ và phòng khám thú y tại Hà Nội. Giúp tìm lại thú cưng thất
              lạc và hỗ trợ y tế khẩn cấp kịp thời cho các bé chó mèo gặp nạn.
            </p>

            <div className="space-y-2 pt-2 text-xs font-bold text-brown">
              <p className="flex items-center gap-2">
                <MapPin className="size-4 text-coral shrink-0" />
                <span>Hoạt động trên toàn địa bàn 12 quận, TP. Hà Nội</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="size-4 text-coral shrink-0" />
                <span>
                  Đường dây nóng cấp cứu 24/7: <strong>0912 345 678</strong>
                </span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="size-4 text-coral shrink-0" />
                <span>Email hỗ trợ: hotro@happypaws.vn</span>
              </p>
            </div>
          </div>

          {/* Col 1: Cứu hộ & Tìm kiếm */}
          <div>
            <h4 className="font-display text-base font-extrabold text-brown">
              Cứu hộ & Tìm kiếm
            </h4>
            <ul className="mt-3.5 space-y-2 text-sm font-bold text-brown-soft">
              <li>
                <Btn
                  variant="ghost"
                  size="sm"
                  onClick={() => navigateWithAuth("/home")}
                  className="h-auto p-0 font-bold text-brown-soft hover:text-brown justify-start"
                >
                  Bản đồ radar cứu trợ
                </Btn>
              </li>
              <li>
                <Btn
                  variant="ghost"
                  size="sm"
                  onClick={() => navigateWithAuth("/find")}
                  className="h-auto p-0 font-bold text-brown-soft hover:text-brown justify-start"
                >
                  Tìm kiếm thú cưng lạc
                </Btn>
              </li>
              <li>
                <Btn
                  variant="ghost"
                  size="sm"
                  onClick={() => navigateWithAuth("/ai-match")}
                  className="h-auto p-0 font-bold text-brown-soft hover:text-brown justify-start"
                >
                  Công nghệ AI Match
                </Btn>
              </li>
              <li>
                <Btn
                  variant="ghost"
                  size="sm"
                  onClick={() => navigateWithAuth("/report")}
                  className="h-auto p-0 font-bold text-brown-soft hover:text-brown justify-start"
                >
                  Báo ca khẩn cấp
                </Btn>
              </li>
            </ul>
          </div>

          {/* Col 2: Cộng đồng & Mái ấm */}
          <div>
            <h4 className="font-display text-base font-extrabold text-brown">
              Cộng đồng & Trạm
            </h4>
            <ul className="mt-3.5 space-y-2 text-sm font-bold text-brown-soft">
              <li>
                <Btn
                  variant="ghost"
                  size="sm"
                  onClick={() => navigateWithAuth("/shelters")}
                  className="h-auto p-0 font-bold text-brown-soft hover:text-brown justify-start"
                >
                  Mạng lưới mái ấm
                </Btn>
              </li>
              <li>
                <Btn
                  variant="ghost"
                  size="sm"
                  onClick={() => navigateWithAuth("/clinics")}
                  className="h-auto p-0 font-bold text-brown-soft hover:text-brown justify-start"
                >
                  Phòng khám thú y 24/7
                </Btn>
              </li>
              <li>
                <Btn
                  variant="ghost"
                  size="sm"
                  onClick={() => navigateWithAuth("/donate")}
                  className="h-auto p-0 font-bold text-brown-soft hover:text-brown justify-start"
                >
                  Ủng hộ thức ăn & thuốc
                </Btn>
              </li>
              <li>
                <Btn
                  variant="ghost"
                  size="sm"
                  onClick={() => navigateWithAuth("/leaderboard")}
                  className="h-auto p-0 font-bold text-brown-soft hover:text-brown justify-start"
                >
                  Bảng vinh danh tình nguyện
                </Btn>
              </li>
            </ul>
          </div>

          {/* Col 3: An toàn & Hướng dẫn */}
          <div>
            <h4 className="font-display text-base font-extrabold text-brown">
              An toàn & Điều khoản
            </h4>
            <ul className="mt-3.5 space-y-2 text-sm font-bold text-brown-soft">
              <li>
                <Btn
                  variant="ghost"
                  size="sm"
                  onClick={() => navigateWithAuth("/safety")}
                  className="h-auto p-0 font-bold text-brown-soft hover:text-brown justify-start"
                >
                  Cảnh báo điểm đen & lừa đảo
                </Btn>
              </li>
              <li>
                <span className="cursor-default">
                  Bảo mật thông tin người báo
                </span>
              </li>
              <li>
                <span className="cursor-default">
                  Chính sách cộng đồng Happy Paws
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t-2 border-line pt-6 text-center text-xs font-bold text-brown-soft sm:flex-row">
          <p>
            © 2026 Happy Paws Hanoi. Dự án cộng đồng phi lợi nhuận vì phúc lợi
            động vật.
          </p>
          <p className="flex items-center gap-1">
            Được xây dựng với tất cả tình yêu dành cho các bé bốn chân
            <Heart className="size-3.5 fill-coral text-coral inline" />
          </p>
        </div>
      </div>
    </footer>
  )
}
