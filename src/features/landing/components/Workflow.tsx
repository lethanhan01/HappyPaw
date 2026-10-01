import {
  Camera,
  Radio,
  HeartHandshake,
  ArrowRight,
  ShieldCheck,
} from "lucide-react"
import { Btn, Badge } from "@/components/ui"

interface RescueWorkflowProps {
  onReportClick: () => void
}

const STEPS = [
  {
    step: "01",
    title: "Chụp ảnh & Định vị",
    desc: "Khi bạn bắt gặp một bé đi lạc hoặc bị thương, chỉ cần bật vị trí và tải ảnh lên. Hệ thống tự động ghi nhận tọa độ phố và quận trong vòng 30 giây.",
    icon: Camera,
    tone: "bg-butter text-brown",
    tag: "30 GIÂY THAO TÁC",
  },
  {
    step: "02",
    title: "AI & Cộng đồng Kết nối",
    desc: "Công nghệ AI phân tích đặc điểm nhận diện, đồng thời gửi thông báo khẩn tới các tình nguyện viên và mái ấm gần nhất trong bán kính 3km.",
    icon: Radio,
    tone: "bg-coral-soft text-coral-dark",
    tag: "PHẢN HỒI TỰ ĐỘNG",
  },
  {
    step: "03",
    title: "Tiếp nhận Y tế & Đoàn tụ",
    desc: "Đội cứu trợ tiếp cận hiện trường, sơ cứu và đưa bé tới phòng khám đối tác 24/7 để chữa trị hoặc đối soát thông tin đưa bé về với chủ nhân.",
    icon: HeartHandshake,
    tone: "bg-sage-soft text-sage-dark",
    tag: "AN TOÀN TUYỆT ĐỐI",
  },
]

export default function RescueWorkflow({ onReportClick }: RescueWorkflowProps) {
  return (
    <section
      id="workflow"
      className="w-full max-w-full overflow-hidden py-12 sm:py-20 md:py-24 bg-cream"
    >
      <div className="mx-auto max-w-[1440px] px-3.5 sm:px-6 lg:px-8 w-full">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto">
          <Badge tone="coral">QUY TRÌNH HÀNH ĐỘNG NHANH</Badge>
          <h2 className="bubble mt-4 text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight break-words">
            3 Bước đơn giản để <br />
            <span className="bubble-yellow">cứu sống một sinh mệnh</span>
          </h2>
          <p className="mt-2.5 sm:mt-3 text-sm sm:text-base md:text-lg font-bold text-brown-soft leading-relaxed">
            Bất kỳ ai cũng có thể trở thành người hùng cứu trợ chỉ với một chiếc
            điện thoại thông minh.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="mt-10 sm:mt-14 grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-3 relative">
          {STEPS.map((s) => (
            <div
              key={s.step}
              className="relative flex flex-col justify-between rounded-[24px] sm:rounded-[32px] border-2 border-brown bg-paper p-6 sm:p-7 shadow-[0_4px_0_var(--color-brown)] sm:shadow-[0_5px_0_var(--color-brown)] transition hover:-translate-y-1.5 hover:shadow-[0_8px_0_var(--color-brown)]"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-display text-3xl sm:text-4xl font-extrabold text-brown/25">
                    {s.step}
                  </span>
                  <span
                    className={`inline-grid size-11 sm:size-12 place-items-center rounded-2xl border-2 border-brown ${s.tone} shadow-soft`}
                  >
                    <s.icon className="size-5 sm:size-6" />
                  </span>
                </div>

                <div className="mt-4 sm:mt-5">
                  <span className="inline-block rounded-full bg-cream-2 px-3 py-1 text-xs font-black text-brown-soft border border-line">
                    {s.tag}
                  </span>
                  <h3 className="mt-2.5 sm:mt-3 font-display text-xl sm:text-2xl font-extrabold text-brown">
                    {s.title}
                  </h3>
                  <p className="mt-2 text-sm sm:text-base font-semibold leading-relaxed text-brown-soft">
                    {s.desc}
                  </p>
                </div>
              </div>

              <div className="mt-5 sm:mt-6 flex items-center gap-2 text-xs font-extrabold text-brown">
                <ShieldCheck className="size-4 text-sage-2 shrink-0" />
                <span>Quy trình bảo mật thông tin người báo</span>
              </div>
            </div>
          ))}
        </div>

        {/* Action Callout Box */}
        <div className="mt-10 sm:mt-12 rounded-[24px] sm:rounded-[32px] border-2 border-brown bg-butter p-6 sm:p-10 shadow-[0_5px_0_var(--color-brown)] sm:shadow-[0_6px_0_var(--color-brown)] text-center max-w-3xl mx-auto w-full">
          <h3 className="font-display text-xl sm:text-2xl md:text-3xl font-extrabold text-brown">
            Bạn vừa nhìn thấy một bé chó mèo cần trợ giúp?
          </h3>
          <p className="mt-2 text-sm sm:text-base font-bold text-brown-soft max-w-lg mx-auto leading-relaxed">
            Đừng chần chừ! Mỗi phút giây đều vô cùng quý giá đối với các bé bị
            thương nặng.
          </p>
          <div className="mt-5 sm:mt-6 flex justify-center">
            <Btn
              size="lg"
              variant="danger"
              icon={<ArrowRight className="size-5" />}
              onClick={onReportClick}
              className="w-full sm:w-auto shadow-[0_4px_0_var(--color-brown)] hover:shadow-[0_6px_0_var(--color-brown)]"
            >
              Báo ca khẩn cấp ngay bây giờ
            </Btn>
          </div>
        </div>
      </div>
    </section>
  )
}
