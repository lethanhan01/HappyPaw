import { Siren, AlertTriangle, ShieldCheck, Phone } from 'lucide-react'
import { Modal, Btn, Badge } from '@/components/ui'
import { CLINICS } from '@/constants/mock/places'

interface EmergencySosProps {
  open: boolean
  onClose: () => void
  onReportClick: () => void
}

export function EmergencySosModal({ open, onClose, onReportClick }: EmergencySosProps) {
  const emergencyClinics = CLINICS.filter((c) => c.emergency).slice(0, 3)

  return (
    <Modal open={open} onClose={onClose} title="Đường Dây Nóng Cứu Hộ & Cấp Cứu 24/7" wide>
      <div className="space-y-6">
        {/* Banner Alert */}
        <div className="flex items-start gap-3 rounded-2xl border-2 border-coral bg-coral-soft p-4">
          <AlertTriangle className="size-6 text-coral shrink-0 mt-0.5" />
          <div>
            <h4 className="font-display text-base font-extrabold text-coral-dark">
              Nếu gặp động vật bị tai nạn nguy kịch ngoài đường:
            </h4>
            <p className="mt-1 text-sm font-semibold text-coral-dark leading-snug">
              Hãy giữ an toàn cho bản thân trước, sau đó liên hệ ngay phòng khám cấp cứu gần nhất hoặc bấm nút báo ca để đội cứu hộ tiếp cận.
            </p>
          </div>
        </div>

        {/* 24/7 Emergency Clinics Directory */}
        <div>
          <h4 className="font-display text-lg font-extrabold text-brown flex items-center justify-between">
            <span>Phòng khám Thú y trực đêm 24/7 tại Hà Nội</span>
            <Badge tone="coral">HOTLINE 24/7</Badge>
          </h4>

          <div className="mt-3 space-y-2.5">
            {emergencyClinics.map((c) => (
              <div
                key={c.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border-2 border-line bg-cream/50 p-4 transition hover:border-brown"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-display text-base font-extrabold text-brown">{c.name}</span>
                    <span className="rounded bg-sky-soft px-2 py-0.5 text-[11px] font-black text-sky-2">
                      {c.district}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-brown-soft mt-0.5">{c.address}</p>
                </div>

                <a
                  href={`tel:${c.phone.replace(/\s+/g, '')}`}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-brown bg-coral px-4 py-2.5 text-sm font-extrabold text-white shadow-[0_3px_0_var(--color-brown)] transition hover:bg-coral/90 active:translate-y-0.5 active:shadow-none"
                >
                  <Phone className="size-4" />
                  Gọi ngay: {c.phone}
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* 4 Crucial First Aid Rules */}
        <div className="rounded-2xl border-2 border-line bg-paper p-4">
          <h4 className="font-display text-base font-extrabold text-brown flex items-center gap-2">
            <ShieldCheck className="size-5 text-sage-2" />
            4 Nguyên tắc sơ cứu an toàn cho người qua đường
          </h4>

          <ul className="mt-3 space-y-2 text-sm font-semibold text-brown leading-relaxed">
            <li className="flex items-start gap-2">
              <span className="grid size-5 shrink-0 place-items-center rounded-full bg-butter text-xs font-black text-brown border border-brown">
                1
              </span>
              <span><strong>Tiếp cận nhẹ nhàng:</strong> Tránh la hét, chạy nhanh hoặc dồn ép khiến con vật hoảng loạn lao ra lòng đường.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="grid size-5 shrink-0 place-items-center rounded-full bg-butter text-xs font-black text-brown border border-brown">
                2
              </span>
              <span><strong>Che mắt bằng áo/chăn:</strong> Động vật khi bị thương rất dễ cắn do phản xạ tự vệ. Dùng áo khoác phủ nhẹ lên mắt giúp bé bình tĩnh hơn.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="grid size-5 shrink-0 place-items-center rounded-full bg-butter text-xs font-black text-brown border border-brown">
                3
              </span>
              <span><strong>Không tự ý cho ăn uống:</strong> Tuyệt đối không cho uống nước hoặc sữa nếu nghi ngờ bé bị va đập nội tạng hoặc gãy xương.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="grid size-5 shrink-0 place-items-center rounded-full bg-butter text-xs font-black text-brown border border-brown">
                4
              </span>
              <span><strong>Báo ca lên Happy Paws:</strong> Tải ảnh và vị trí lên để tình nguyện viên có chuyên môn mang nẹp và lồng vận chuyển tới hỗ trợ.</span>
            </li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Btn
            variant="danger"
            size="lg"
            full
            icon={<Siren className="size-5" />}
            onClick={() => { onClose(); onReportClick() }}
          >
            Báo ca khẩn cấp lên hệ thống
          </Btn>
          <Btn variant="secondary" size="lg" full onClick={onClose}>
            Đóng cửa sổ
          </Btn>
        </div>
      </div>
    </Modal>
  )
}

export function FloatingSosButton({ onClick }: { onClick: () => void }) {
  return (
    <div className="fixed bottom-3.5 right-3.5 sm:bottom-6 sm:right-6 z-40">
      {/* Soft pulse glow ring (contained within button radius to prevent viewport overflow) */}
      <span className="absolute inset-0 size-full rounded-full bg-coral/30 animate-pulse pointer-events-none" />

      <Btn
        variant="danger"
        pill
        onClick={onClick}
        aria-label="Cứu hộ khẩn cấp 24/7"
        className="relative !size-12 sm:!size-auto sm:!h-auto sm:!py-3.5 sm:!px-5 sm:!gap-2.5 !p-0 shadow-[0_4px_0_var(--color-brown)] hover:shadow-[0_6px_0_var(--color-brown)] active:translate-y-0.5 active:shadow-none"
      >
        <Siren className="size-6 shrink-0 animate-bounce-soft" />
        <span className="hidden sm:inline font-display text-base tracking-wide font-extrabold whitespace-nowrap">
          SOS CỨU HỘ 24/7
        </span>
      </Btn>
    </div>
  )
}
