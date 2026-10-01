import { useState } from 'react'
import { AlertTriangle, Eye, Lock, ShieldAlert, ShieldCheck } from 'lucide-react'
import { useApp } from '@/store'
import CityMap, { ME_POS, type Sel } from '@/features/map'
import { RISKS, REASONS, USERS } from '@/constants'
import type { Risk } from '@/types'
import { Badge, Btn, Card, Field, Note, PageHead, Stepper, SuccessScreen, Textarea, UploadBox } from '@ui'
import { cx } from '@/lib'
import { SectionTitle } from './Shared'

const TIPS = [
  'Gặp người lạ ở nơi công cộng, đông người và nên có bạn đi cùng.',
  'Không chuyển tiền trước khi xác minh danh tính và nhìn thấy bé.',
  'Không chia sẻ vị trí chính xác của bé đang bị thương trên mạng xã hội.',
  'Cảnh giác với thức ăn lạ bỏ sẵn ở công viên, bãi đất trống.',
  'Thấy điều gì bất thường, hãy báo ngay để đội ngũ Happy Paws xem xét.',
]
const ORDER = ['Khu vực nghi có trộm chó mèo', 'Khu vực có bẫy/bả', 'Người dùng bị report nhiều', 'Điểm đến đáng ngờ']
const sevTone = (s: Risk['severity']) => (s === 'Cao' ? 'coral' : s === 'Trung bình' ? 'orange' : 'butter')

export function Safety() {
  const { go } = useApp()
  const [sel, setSel] = useState<Sel | null>(null)
  const picked = RISKS.find((r) => r.id === sel?.id)
  const types = [...ORDER, ...RISKS.map((r) => r.type).filter((t) => !ORDER.includes(t))].filter((t, i, a) => a.indexOf(t) === i)
  return (
    <div className="space-y-6">
      <PageHead title="Cảnh báo an toàn" sub="Các khu vực và hành vi được cộng đồng đánh dấu để mọi người cùng cẩn thận." />
      <Btn variant="danger" size="lg" full onClick={() => go('/safety/report')}
        className="h-auto py-4 text-lg rounded-[24px]">
        <span aria-hidden>🚨</span> Báo cáo người dùng
      </Btn>
      <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-4">
          <div className="overflow-hidden rounded-[24px] border-2 border-brown shadow-soft">
            <CityMap className="h-[380px] w-full md:h-[460px]" risks={RISKS} me={ME_POS} selected={sel} onSelect={setSel}
              center={picked ? { x: picked.x, y: picked.y, k: 1.3 } : undefined} focusKey={picked?.id} />
          </div>
          {picked ? (
            <Card className="animate-[rise_.25s_both] space-y-2 border-coral/60 bg-coral-soft/50">
              <p className="flex items-start gap-2 font-extrabold text-coral-dark"><AlertTriangle className="mt-0.5 size-5 shrink-0" />Cẩn thận! Đây là khu vực được cộng đồng đánh dấu có rủi ro.</p>
              <div className="flex flex-wrap items-center gap-2"><h3 className="font-display text-xl font-extrabold">{picked.title}</h3><Badge tone={sevTone(picked.severity)}>Mức độ: {picked.severity}</Badge></div>
              <p>{picked.note}</p>
              <p className="text-sm text-brown-soft">{picked.reports} báo cáo · Hiệu lực đến {picked.expires}</p>
            </Card>
          ) : <p className="text-sm font-semibold text-brown-soft">Chọn một khu vực trên bản đồ hoặc trong danh sách để xem chi tiết.</p>}
        </div>

        <div className="space-y-5">
          {types.map((t) => {
            const items = RISKS.filter((r) => r.type === t)
            if (!items.length) return null
            return (
              <section key={t}>
                <h3 className="mb-2 flex items-center gap-2 font-display text-lg font-extrabold"><ShieldAlert className="size-5 text-coral" />{t}</h3>
                <ul className="space-y-2">
                  {items.map((r) => (
                    <li key={r.id}>
                      <Btn variant="ghost" onClick={() => setSel({ kind: 'risk', id: r.id })} aria-pressed={sel?.id === r.id}
                        className={cx('flex h-auto w-full items-center gap-3 rounded-2xl border-2 bg-paper p-3 text-left transition hover:border-brown', sel?.id === r.id ? 'border-brown ring-4 ring-butter' : 'border-line')}>
                        <span className="min-w-0 flex-1"><span className="block font-extrabold">{r.title}</span><span className="block text-sm text-brown-soft">{r.reports} báo cáo · đến {r.expires}</span></span>
                        <Badge tone={sevTone(r.severity)} icon={<AlertTriangle className="size-3.5" />}>{r.severity}</Badge>
                      </Btn>
                    </li>
                  ))}
                </ul>
              </section>
            )
          })}
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <Card><SectionTitle>Mẹo an toàn</SectionTitle>
          <ul className="space-y-2">{TIPS.map((t) => <li key={t} className="flex gap-2 text-sm font-semibold"><ShieldCheck className="mt-0.5 size-4 shrink-0 text-sage-2" />{t}</li>)}</ul>
        </Card>
        <Card className="bg-sky-soft/70">
          <SectionTitle>Quyền riêng tư</SectionTitle>
          <p className="flex gap-3 font-bold"><Lock className="mt-0.5 size-5 shrink-0" />Vị trí chính xác được bảo vệ để đảm bảo an toàn cho bé.</p>
          <p className="mt-2 flex gap-3 text-sm text-brown-2"><Eye className="mt-0.5 size-5 shrink-0" />Với các ca nguy cấp, bản đồ chỉ hiển thị khu vực xấp xỉ. Vị trí cụ thể chỉ được chia sẻ cho người đã được xác minh khi nhận cứu hộ.</p>
        </Card>
      </div>
    </div>
  )
}

/* ---------------- Report flow ---------------- */
export function SafetyReport({ caseId, userId }: { caseId?: string; userId?: string }) {
  const { go, toast } = useApp()
  const [step, setStep] = useState(0)
  const [reason, setReason] = useState('')
  const [desc, setDesc] = useState('')
  const [files, setFiles] = useState<string[]>([])
  const [ok, setOk] = useState(false)
  const target = USERS.find((u) => u.id === userId)

  if (ok) {
    return (
      <SuccessScreen calm title="Báo cáo đã được gửi tới đội ngũ Happy Paws.">
        <p className="text-brown-2">Chúng tôi sẽ xem xét và xử lý trong thời gian sớm nhất. Danh tính của bạn được giữ kín với người bị báo cáo.</p>
        <div className="mt-2 flex flex-wrap justify-center gap-3">
          <Btn onClick={() => go('/home')}>Về trang chủ</Btn><Btn variant="secondary" onClick={() => go('/safety')}>Xem cảnh báo an toàn</Btn>
        </div>
      </SuccessScreen>
    )
  }
  const next = () => (step < 3 ? setStep(step + 1) : (setOk(true), toast('Đã gửi báo cáo')))
  const ctx = [target && `Người dùng: ${target.name}`, caseId && `Case: ${caseId}`].filter(Boolean)

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <PageHead title="Báo cáo người dùng" sub="Cung cấp thông tin chính xác để đội ngũ có thể xem xét." back={() => (step > 0 ? setStep(step - 1) : history.back())} />
      {ctx.length > 0 && <Note tone="ink" icon={<ShieldAlert className="size-5 shrink-0" />}>{ctx.join(' · ')}</Note>}
      <Stepper steps={['Lý do', 'Mô tả', 'Bằng chứng', 'Xác nhận']} current={step} />
      <Card className="space-y-4">
        {step === 0 && (
          <>
            <h2 className="text-xl font-extrabold">Chọn lý do báo cáo</h2>
            <div className="grid gap-2 sm:grid-cols-2" role="radiogroup" aria-label="Lý do báo cáo">
              {REASONS.map((r) => (
                <Btn key={r} variant="ghost" role="radio" aria-checked={reason === r} onClick={() => setReason(r)}
                  className={cx('h-auto rounded-2xl border-2 px-4 py-3 text-left font-bold transition', reason === r ? 'border-brown bg-butter' : 'border-line bg-white hover:border-brown/60')}>{r}</Btn>
              ))}
            </div>
          </>
        )}
        {step === 1 && (
          <>
            <h2 className="text-xl font-extrabold">Mô tả thêm (không bắt buộc)</h2>
            <Field label="Chuyện gì đã xảy ra?" helper="Nêu rõ thời gian, địa điểm, nội dung tin nhắn nếu có."><Textarea value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Mô tả ngắn gọn sự việc…" /></Field>
          </>
        )}
        {step === 2 && (
          <>
            <h2 className="text-xl font-extrabold">Tải lên bằng chứng (không bắt buộc)</h2>
            <UploadBox label="Ảnh chụp màn hình, tin nhắn, hình ảnh liên quan" files={files} onChange={setFiles} />
          </>
        )}
        {step === 3 && (
          <>
            <h2 className="text-xl font-extrabold">Kiểm tra lại trước khi gửi</h2>
            <dl className="space-y-2 rounded-2xl bg-cream-2/70 p-4 text-sm">
              <div><dt className="font-extrabold text-brown-soft">Lý do</dt><dd className="font-bold">{reason}</dd></div>
              <div><dt className="font-extrabold text-brown-soft">Mô tả</dt><dd>{desc || 'Không có'}</dd></div>
              <div><dt className="font-extrabold text-brown-soft">Bằng chứng</dt><dd>{files.length} tệp đính kèm</dd></div>
            </dl>
            <p className="text-sm text-brown-soft">Báo cáo sai sự thật có thể ảnh hưởng đến tài khoản của bạn.</p>
          </>
        )}
        <div className="flex justify-between gap-3 pt-2">
          <Btn variant="ghost" onClick={() => (step > 0 ? setStep(step - 1) : go('/safety'))}>{step > 0 ? 'Quay lại' : 'Hủy'}</Btn>
          <Btn variant="dark" disabled={step === 0 && !reason} onClick={next}>{step === 3 ? 'Gửi báo cáo' : 'Tiếp tục'}</Btn>
        </div>
      </Card>
    </div>
  )
}
