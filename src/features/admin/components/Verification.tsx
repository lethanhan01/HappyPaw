import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  EyeOff,
  FilePlus2,
  Flag,
  ShieldCheck,
} from "lucide-react"
import { useApp } from "@/store"
import { SHELTERS, timeAgo, userById } from "@/constants"
import type { Case } from "@/types"
import { Badge, Note, PetPhoto, Empty } from "@ui"
import { addReport, toggleIn, useAdmin } from "../store/adminStore"
import {
  ABtn,
  Panel,
  Title,
  UserCell,
  caseTimeline,
  useCases,
} from "./AdminCommon"

type St = "match" | "mismatch" | "wait"
function CmpRow({
  label,
  left,
  right,
  st,
}: {
  label: string
  left: string
  right: string
  st: St
}) {
  const m = {
    match: {
      i: <CheckCircle2 className="size-4 text-sage-2" />,
      t: "Khớp",
      c: "text-sage-2",
    },
    mismatch: {
      i: <AlertTriangle className="size-4 text-coral" />,
      t: "Không khớp",
      c: "text-coral",
    },
    wait: {
      i: <Clock className="size-4 text-orange" />,
      t: "Chờ phản hồi",
      c: "text-orange",
    },
  }[st]
  return (
    <tr className="border-b border-line/70 last:border-0 align-top">
      <td className="py-2 pr-2 text-xs font-extrabold uppercase text-brown-soft">
        {label}
      </td>
      <td className="py-2 pr-2 font-bold">{left}</td>
      <td className="py-2 pr-2 font-bold">{right}</td>
      <td className={`py-2 text-xs font-extrabold ${m.c}`}>
        <span className="flex items-center gap-1 whitespace-nowrap">
          {m.i}
          {m.t}
        </span>
      </td>
    </tr>
  )
}

function ProofCard({ c }: { c: Case }) {
  const { updateCase, proof, setProof, toast } = useApp()
  const { mismatchCases } = useAdmin()
  const shelter = SHELTERS.find((s) => s.id === c.shelterId) || SHELTERS[0]
  const pf = proof[c.id] || {}
  const conf = !!pf.shelterConfirmed
  const mis = !!pf.mismatch || mismatchCases.includes(c.id)
  const rowSt = (ok = true): St =>
    mis ? "mismatch" : conf && ok ? "match" : "wait"
  const when = new Date(Date.now() - c.updatedAgo * 60000).toLocaleString(
    "vi-VN",
    {
      hour: "2-digit",
      minute: "2-digit",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    },
  )
  const rescuer = userById(c.assignee)

  const cmpItems = [
    {
      label: "Nơi bàn giao",
      left: shelter.name,
      right: conf
        ? shelter.name
        : mis
          ? "Không ghi nhận bé này"
          : "Chưa xác nhận",
      st: rowSt(),
    },
    {
      label: "Pet",
      left: `${c.species} · ${c.color}`,
      right: conf
        ? `${c.species} · ${c.color}`
        : mis
          ? `${c.species} · khác đặc điểm`
          : "—",
      st: rowSt(),
    },
    {
      label: "Thời điểm",
      left: when,
      right: conf ? when : "—",
      st: rowSt(),
    },
    {
      label: "Tình trạng",
      left: c.condition || "Ổn định",
      right: conf ? "Đã tiếp nhận, sức khỏe ổn" : "—",
      st: rowSt(),
    },
  ]

  return (
    <Panel>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-3">
          <PetPhoto
            src={c.photo}
            species={c.species}
            alt={c.name}
            className="size-12 shrink-0 rounded-xl border border-line"
          />
          <div>
            <h3 className="font-display text-lg font-extrabold leading-tight">
              {c.id} · {c.name}
            </h3>
            <p className="text-xs text-brown-soft">
              {c.species} · {c.breed} · {c.district}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-1.5">
          <Badge tone="butter" icon={<ShieldCheck className="size-3.5" />}>
            Chờ xác minh
          </Badge>
          {pf.needMore && (
            <Badge tone="sky" icon={<FilePlus2 className="size-3.5" />}>
              Đã yêu cầu bổ sung
            </Badge>
          )}
          {mis && (
            <Badge tone="coral" icon={<Flag className="size-3.5" />}>
              Không đồng nhất
            </Badge>
          )}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2 [&>*]:min-w-0">
        <div>
          <p className="mb-1.5 text-xs font-extrabold uppercase tracking-wide text-brown-soft">
            Ảnh bằng chứng cứu hộ
          </p>
          <div className="grid grid-cols-3 gap-2">
            {[
              { src: c.photo, l: "Ảnh hiện trường" },
              { src: c.photo, l: "Ảnh khi bàn giao", pos: "left top" },
              { src: shelter.photo, l: "Ảnh tại mái ấm" },
            ].map((p, i) => (
              <figure key={i}>
                <img
                  src={p.src}
                  alt={p.l}
                  className="aspect-square w-full rounded-xl border border-line object-cover"
                  style={{ objectPosition: p.pos }}
                />
                <figcaption className="mt-0.5 text-[11px] font-bold text-brown-soft">
                  {p.l}
                </figcaption>
              </figure>
            ))}
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <figure>
              <img
                src={c.photo}
                alt="Trước"
                className="h-28 w-full rounded-xl border border-line object-cover grayscale-[40%]"
              />
              <figcaption className="text-[11px] font-bold text-brown-soft">
                Trước · {c.condition || "Tại hiện trường"}
              </figcaption>
            </figure>
            <figure>
              <img
                src={shelter.photo}
                alt="Sau"
                className="h-28 w-full rounded-xl border border-line object-cover"
              />
              <figcaption className="text-[11px] font-bold text-brown-soft">
                Sau · Đã bàn giao tại mái ấm
              </figcaption>
            </figure>
          </div>
          <dl className="mt-3 space-y-1 text-sm">
            <div className="flex gap-2">
              <dt className="w-28 text-brown-soft">Thời điểm gửi</dt>
              <dd className="font-bold">{when}</dd>
            </div>
            <div className="flex gap-2">
              <dt className="w-28 text-brown-soft">Người cứu hộ</dt>
              <dd>{rescuer ? <UserCell id={rescuer.id} /> : "—"}</dd>
            </div>
            <div className="flex gap-2">
              <dt className="w-28 text-brown-soft">Mái ấm</dt>
              <dd className="font-bold">{shelter.name}</dd>
            </div>
          </dl>
        </div>

        <div>
          {/* Mobile Comparison Cards (zero horizontal scroll) */}
          <div className="space-y-2.5 md:hidden">
            <p className="text-xs font-extrabold uppercase tracking-wide text-brown-soft">
              Đối chiếu dữ liệu
            </p>
            {cmpItems.map((item, idx) => {
              const statusMeta = {
                match: {
                  icon: <CheckCircle2 className="size-3.5 text-sage-2" />,
                  text: "Khớp",
                  color: "text-sage-2 bg-sage-soft",
                },
                mismatch: {
                  icon: <AlertTriangle className="size-3.5 text-coral" />,
                  text: "Không khớp",
                  color: "text-coral bg-coral-soft",
                },
                wait: {
                  icon: <Clock className="size-3.5 text-orange" />,
                  text: "Chờ phản hồi",
                  color: "text-orange bg-orange-soft",
                },
              }[item.st]

              return (
                <div
                  key={idx}
                  className="rounded-xl border border-line bg-paper p-3 text-xs"
                >
                  <div className="mb-2 flex items-center justify-between border-b border-line/60 pb-1.5">
                    <span className="font-extrabold uppercase text-brown-soft">
                      {item.label}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-bold ${statusMeta.color}`}
                    >
                      {statusMeta.icon}
                      {statusMeta.text}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[12.5px]">
                    <div>
                      <span className="block font-semibold text-brown-soft">
                        Người cứu hộ gửi:
                      </span>
                      <span className="font-bold text-brown">{item.left}</span>
                    </div>
                    <div>
                      <span className="block font-semibold text-brown-soft">
                        Mái ấm phản hồi:
                      </span>
                      <span className="font-bold text-brown">{item.right}</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Desktop Comparison Table */}
          <div className="hidden overflow-x-auto rounded-xl border border-line md:block">
            <table className="w-full min-w-[420px] text-left text-[13px]">
              <thead>
                <tr className="bg-cream-2/70 text-[11px] uppercase text-brown-soft font-extrabold">
                  <th className="p-2" />
                  <th className="p-2">Dữ liệu người cứu hộ gửi</th>
                  <th className="p-2">Xác nhận từ mái ấm</th>
                  <th className="p-2" />
                </tr>
              </thead>
              <tbody className="px-2 [&_td:first-child]:pl-2 [&_td:last-child]:pr-2">
                {cmpItems.map((item, idx) => (
                  <CmpRow
                    key={idx}
                    label={item.label}
                    left={item.left}
                    right={item.right}
                    st={item.st}
                  />
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-1.5 text-xs text-brown-soft">
            {conf
              ? "Mái ấm đã phản hồi và xác nhận dữ liệu."
              : mis
                ? "Mái ấm báo dữ liệu không khớp - cần đối chiếu."
                : "Mái ấm chưa phản hồi. Có thể xác nhận thủ công nếu đủ bằng chứng."}
          </p>
          <div className="mt-3 rounded-xl border border-line p-3">
            <p className="mb-1.5 text-xs font-extrabold uppercase tracking-wide text-brown-soft">
              Lịch sử case
            </p>
            <ol className="space-y-1 border-l-2 border-line pl-3">
              {caseTimeline(c).map((t, i) => (
                <li key={i} className="text-[13px]">
                  <b className="mr-1.5 text-xs text-brown-soft">{t.at}</b>
                  {t.text}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-2 border-t border-line pt-3 sm:flex sm:flex-wrap">
        <ABtn
          v="success"
          icon={<CheckCircle2 />}
          onClick={() => {
            updateCase(c.id, { status: "resolved" })
            toast(
              `Đã xác nhận cứu hộ ${c.id}. Case được gỡ khỏi bản đồ realtime.`,
            )
          }}
        >
          Xác nhận cứu hộ
        </ABtn>
        <ABtn
          v="outline"
          icon={<FilePlus2 />}
          onClick={() => {
            setProof(c.id, { needMore: true })
            toast("Đã gửi yêu cầu bổ sung bằng chứng cho người cứu hộ")
          }}
        >
          Yêu cầu bổ sung
        </ABtn>
        <ABtn
          v="danger"
          icon={<Flag />}
          onClick={() => {
            setProof(c.id, { mismatch: true })
            toggleIn("mismatchCases", c.id, true)
            addReport({
              id: "RP-" + (400 + Math.floor(Math.random() * 500)),
              reporter: "admin",
              reported: c.assignee || c.reporter,
              reason: "Dữ liệu cứu hộ không đồng nhất",
              caseId: c.id,
              created: "Vừa xong",
              severity: "High",
              status: "Mới",
              note: "Admin gắn cờ trong bước xác minh rescue.",
            })
            toast("Đã gắn cờ không đồng nhất và tạo report", "warn")
          }}
        >
          Không đồng nhất - report
        </ABtn>
      </div>
    </Panel>
  )
}

export default function Verification() {
  const cases = useCases()
  const { go } = useApp()
  const queue = cases.filter((c) => c.status === "pending")
  return (
    <div>
      <Title
        title="Chờ xác minh rescue"
        sub={`${queue.length} case đang chờ admin đối chiếu bằng chứng`}
      />
      <div className="mb-4">
        <Note tone="sky" icon={<EyeOff className="size-4 shrink-0" />}>
          Sau khi xác nhận cứu hộ, case sẽ biến mất khỏi bản đồ realtime và
          chuyển sang trạng thái “Đã giải quyết”.
        </Note>
      </div>
      {queue.length === 0 ? (
        <Panel>
          <div className="py-8">
            <Empty
              title="Không còn case nào chờ xác minh"
              body="Tất cả ca cứu hộ đã được đối chiếu bằng chứng hoàn tất. Các case mới sẽ xuất hiện khi người cứu hộ gửi bằng chứng."
              cta="Xem case đã giải quyết"
              onCta={() => go("/admin/cases?status=resolved")}
            />
          </div>
        </Panel>
      ) : (
        <div className="space-y-4">
          {queue.map((c) => (
            <ProofCard key={c.id} c={c} />
          ))}
        </div>
      )}
      <p className="sr-only">{timeAgo(0)}</p>
    </div>
  )
}
