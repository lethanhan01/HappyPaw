import { useMemo, useState } from "react"
import {
  Ban,
  Eye,
  Gavel,
  Lock,
  Pencil,
  Plus,
  ShieldAlert,
  ShieldX,
  Siren,
  Trash2,
  X,
  CheckCircle2,
  Binoculars,
  Clock,
  FileWarning,
  OctagonAlert,
  Megaphone,
} from "lucide-react"
import { useApp } from "@/store"
import { userById } from "@/constants"
import type { Report } from "@/types"
import { Badge, Modal, StatusBadge, Btn } from "@ui"
import {
  DUP_PHONES,
  addBlacklist,
  patchBlacklist,
  patchReport,
  removeBlacklist,
  setFraud,
  setUserStatus,
  useAdmin,
  type BlackRec,
  type FraudStatus,
} from "../store/adminStore"
import {
  ABtn,
  AInput,
  ASelect,
  ATextarea,
  Col,
  Confirm,
  DataTable,
  Drawer,
  FormRow,
  KpiCard,
  KpiRow,
  Panel,
  SearchBox,
  SevChip,
  Title,
  UserCell,
  sevRank,
  useCases,
} from "./AdminCommon"
import { UserStatus } from "./Users"

const RStatus = ({ s }: { s: Report["status"] }) =>
  s === "Mới" ? (
    <Badge tone="coral" icon={<Siren className="size-3.5" />}>
      Mới
    </Badge>
  ) : s === "Đang xem xét" ? (
    <Badge tone="butter" icon={<Clock className="size-3.5" />}>
      Đang xem xét
    </Badge>
  ) : (
    <Badge tone="sage" icon={<CheckCircle2 className="size-3.5" />}>
      Đã xử lý
    </Badge>
  )

/* ---------------- Report queue ---------------- */
export function ReportQueue() {
  const { go, toast, publishReportAsAlert } = useApp()
  const { reports } = useAdmin()
  const [q, setQ] = useState("")
  const [sev, setSev] = useState("")
  const [st, setSt] = useState("")
  const [openId, setOpenId] = useState<string | null>(null)
  const [note, setNote] = useState("")
  const rows = useMemo(
    () =>
      reports.filter((r) => {
        if (sev && r.severity !== sev) return false
        if (st && r.status !== st) return false
        const t = q.trim().toLowerCase()
        return (
          !t ||
          (
            r.id +
            r.reason +
            r.caseId +
            (userById(r.reporter)?.name || "") +
            (userById(r.reported)?.name || "")
          )
            .toLowerCase()
            .includes(t)
        )
      }),
    [reports, q, sev, st],
  )
  const cur = reports.find((r) => r.id === openId)
  const cols: Col<Report>[] = [
    { key: "id", label: "ID", sort: (r) => r.id, render: (r) => <b>{r.id}</b> },
    {
      key: "rp",
      label: "Reporter",
      render: (r) => <UserCell id={r.reporter} />,
    },
    {
      key: "rd",
      label: "Reported user",
      render: (r) => <UserCell id={r.reported} />,
    },
    {
      key: "reason",
      label: "Reason",
      sort: (r) => r.reason,
      render: (r) => r.reason,
    },
    {
      key: "case",
      label: "Related case",
      sort: (r) => r.caseId,
      render: (r) => (
        <Btn
          variant="ghost"
          size="sm"
          className="inline h-auto p-0 font-bold underline"
          onClick={(e) => {
            e.stopPropagation()
            go("/admin/cases/" + r.caseId)
          }}
        >
          {r.caseId}
        </Btn>
      ),
    },
    { key: "cr", label: "Created", render: (r) => r.created },
    {
      key: "sev",
      label: "Severity",
      sort: (r) => sevRank(r.severity),
      render: (r) => <SevChip s={r.severity} />,
    },
    {
      key: "st",
      label: "Status",
      sort: (r) => r.status,
      render: (r) => <RStatus s={r.status} />,
    },
  ]
  const act = (r: Report, kind: "dismiss" | "monitor" | "escalate") => {
    if (kind === "dismiss") {
      patchReport(r.id, { status: "Đã xử lý", adminNote: note })
      toast(`Đã bỏ qua report ${r.id}`)
    }
    if (kind === "monitor") {
      patchReport(r.id, { status: "Đang xem xét", adminNote: note })
      toast(`Đang theo dõi ${r.id}`)
    }
    if (kind === "escalate") {
      patchReport(r.id, { status: "Đang xem xét", adminNote: note })
      setFraud(r.reported, "Đang điều tra")
      toast("Đã chuyển sang Fraud Investigation", "warn")
      setOpenId(null)
      go("/admin/fraud/" + r.reported)
      return
    }
    setOpenId(null)
  }
  return (
    <div>
      <Title
        title="Report Queue"
        sub={`${reports.filter((r) => r.status !== "Đã xử lý").length} report cần xử lý`}
      />
      <KpiRow>
        <KpiCard
          icon={<FileWarning />}
          label="Tổng report"
          value={reports.length}
        />
        <KpiCard
          icon={<Clock />}
          label="Mới"
          value={reports.filter((r) => r.status === "Mới").length}
          tone="bg-orange-soft text-orange"
        />
        <KpiCard
          icon={<OctagonAlert />}
          label="Mức cao / Critical"
          value={
            reports.filter(
              (r) =>
                r.status !== "Đã xử lý" &&
                (r.severity === "High" || r.severity === "Critical"),
            ).length
          }
          tone="bg-coral-soft text-coral"
        />
        <KpiCard
          icon={<CheckCircle2 />}
          label="Đã xử lý"
          value={reports.filter((r) => r.status === "Đã xử lý").length}
          tone="bg-sage-soft text-sage-2"
        />
      </KpiRow>
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <SearchBox
          value={q}
          onChange={setQ}
          placeholder="Tìm mã, lý do, user, case…"
        />
        <ASelect
          aria-label="Mức độ"
          value={sev}
          onChange={(e) => setSev(e.target.value)}
          className="!w-auto"
        >
          <option value="">Mọi mức độ</option>
          {["Low", "Medium", "High", "Critical"].map((s) => (
            <option key={s}>{s}</option>
          ))}
        </ASelect>
        <ASelect
          aria-label="Trạng thái"
          value={st}
          onChange={(e) => setSt(e.target.value)}
          className="!w-auto"
        >
          <option value="">Mọi trạng thái</option>
          <option>Mới</option>
          <option>Đang xem xét</option>
          <option>Đã xử lý</option>
        </ASelect>
      </div>
      <DataTable
        cols={cols}
        rows={rows}
        rowKey={(r) => r.id}
        onRow={(r) => {
          setOpenId(r.id)
          setNote(r.adminNote || "")
        }}
      />
      <Drawer
        open={!!cur}
        onClose={() => setOpenId(null)}
        title={cur ? `Report ${cur.id}` : ""}
      >
        {cur && (
          <div className="space-y-3 text-sm">
            <div className="flex flex-wrap gap-1.5">
              <SevChip s={cur.severity} />
              <RStatus s={cur.status} />
            </div>
            <dl className="space-y-1.5">
              <div className="flex gap-2">
                <dt className="w-28 text-brown-soft">Reporter</dt>
                <dd>
                  <UserCell id={cur.reporter} />
                </dd>
              </div>
              <div className="flex gap-2">
                <dt className="w-28 text-brown-soft">Reported user</dt>
                <dd>
                  <UserCell id={cur.reported} />
                </dd>
              </div>
              <div className="flex gap-2">
                <dt className="w-28 text-brown-soft">Lý do</dt>
                <dd className="font-bold">{cur.reason}</dd>
              </div>
              <div className="flex gap-2">
                <dt className="w-28 text-brown-soft">Case</dt>
                <dd>
                  <Btn
                    variant="ghost"
                    size="sm"
                    className="inline h-auto p-0 font-bold underline"
                    onClick={() => go("/admin/cases/" + cur.caseId)}
                  >
                    {cur.caseId}
                  </Btn>
                </dd>
              </div>
              <div className="flex gap-2">
                <dt className="w-28 text-brown-soft">Thời gian</dt>
                <dd className="font-bold">{cur.created}</dd>
              </div>
            </dl>
            <div className="rounded-xl border-2 border-line bg-cream-2/50 p-3">
              <p className="mb-1 text-xs font-extrabold uppercase text-brown-soft">
                Nội dung report
              </p>
              {cur.note}
            </div>
            <FormRow label="Ghi chú của admin">
              <ATextarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Ghi chú nội bộ…"
              />
            </FormRow>
            <div className="flex flex-col gap-2 pt-2 sm:flex-row sm:flex-wrap">
              <ABtn icon={<X />} onClick={() => act(cur, "dismiss")}>
                Dismiss
              </ABtn>
              <ABtn icon={<Binoculars />} onClick={() => act(cur, "monitor")}>
                Monitor
              </ABtn>
              <ABtn
                icon={<Megaphone />}
                onClick={() => {
                  const reporter = userById(cur.reporter)
                  const reported = userById(cur.reported)
                  const newStory = publishReportAsAlert({
                    title: `Cảnh báo đối tượng ${reported?.name || "khả nghi"}: ${cur.reason}`,
                    category:
                      cur.reason.includes("tiền") || cur.reason.includes("cọc")
                        ? "Lừa đảo tiền cọc / chuộc"
                        : cur.reason.includes("ngược đãi")
                          ? "Khu vực nguy hiểm"
                          : "Tài khoản khả nghi",
                    severity:
                      cur.severity === "Critical" || cur.severity === "High"
                        ? "Khẩn cấp"
                        : "Cảnh giác",
                    district: reported?.area || "Đống Đa",
                    address: `Liên quan tài khoản ${reported?.name || "khả nghi"}`,
                    excerpt:
                      cur.note || `Báo cáo về hành vi ${cur.reason} từ người dùng.`,
                    fullStory: `Vào lúc ${cur.created}, hệ thống ghi nhận tố cáo đối với tài khoản ${reported?.name || "này"} vì lý do: ${cur.reason}.\n\nNội dung chi tiết: ${cur.note || "Không có thêm ghi chú."}\n\nĐội ngũ Ban Quản Trị Happy Paws đã tiến hành xác minh và công bố cảnh báo này để cộng đồng cùng nâng cao tinh thần cảnh giác.`,
                    reporterName: reporter?.name,
                  })
                  patchReport(cur.id, {
                    status: "Đã xử lý",
                    adminNote:
                      (note ? note + "\n" : "") +
                      `[Đã xuất bản bài viết cảnh báo: ${newStory.id}]`,
                  })
                  toast("Đã xuất bản thành bài viết cảnh báo cộng đồng!")
                  setOpenId(null)
                  go(`/safety?alert=${newStory.id}`)
                }}
              >
                Xuất bản thành cảnh báo
              </ABtn>
              <ABtn
                v="danger"
                icon={<ShieldAlert />}
                onClick={() => act(cur, "escalate")}
              >
                Escalate to fraud investigation
              </ABtn>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  )
}

/* ---------------- Fraud ---------------- */
const FStatus = ({ s }: { s?: FraudStatus }) => {
  if (!s) return <Badge tone="brown">Chưa mở hồ sơ</Badge>
  const m: Record<FraudStatus, [string, React.ReactNode]> = {
    "Đang điều tra": ["coral", <ShieldAlert className="size-3.5" />],
    "Theo dõi": ["butter", <Eye className="size-3.5" />],
    "Hạn chế": ["orange", <Lock className="size-3.5" />],
    "Đã bỏ qua": ["sage", <CheckCircle2 className="size-3.5" />],
    "Đã khóa": ["ink", <Ban className="size-3.5" />],
  }
  return (
    <Badge tone={m[s][0]} icon={m[s][1]}>
      {s}
    </Badge>
  )
}

export function Fraud({ uid }: { uid?: string }) {
  const { go } = useApp()
  const { users, fraud, reports } = useAdmin()
  if (uid) return <FraudDetail uid={uid} />
  const list = users.filter(
    (u) => fraud[u.id] || u.reports >= 3 || u.status !== "Hoạt động",
  )
  const cols: Col<typeof users[number]>[] = [
    {
      key: "u",
      label: "User",
      render: (u) => <UserCell id={u.id} sub={u.id} />,
    },
    { key: "area", label: "Khu vực", render: (u) => u.area },
    {
      key: "rep",
      label: "Reports",
      sort: (u) => reports.filter((r) => r.reported === u.id).length,
      render: (u) => (
        <b className="text-coral">
          {reports.filter((r) => r.reported === u.id).length}
        </b>
      ),
    },
    {
      key: "dup",
      label: "Trùng SĐT",
      render: (u) =>
        DUP_PHONES[u.id]?.length ? (
          <Badge tone="plum">{DUP_PHONES[u.id].length} tài khoản</Badge>
        ) : (
          "—"
        ),
    },
    {
      key: "ac",
      label: "Tài khoản",
      render: (u) => <UserStatus s={u.status} />,
    },
    { key: "fs", label: "Hồ sơ", render: (u) => <FStatus s={fraud[u.id]} /> },
    {
      key: "a",
      label: "Action",
      render: (u) => (
        <ABtn
          s="xs"
          v="dark"
          icon={<Gavel />}
          onClick={(e) => {
            e.stopPropagation()
            go("/admin/fraud/" + u.id)
          }}
        >
          Điều tra
        </ABtn>
      ),
    },
  ]
  return (
    <div>
      <Title
        title="Fraud Investigation"
        sub={`${list.length} tài khoản đáng ngờ`}
      />
      <DataTable
        cols={cols}
        rows={list}
        rowKey={(u) => u.id}
        onRow={(u) => go("/admin/fraud/" + u.id)}
      />
    </div>
  )
}

function FraudDetail({ uid }: { uid: string }) {
  const { go, toast } = useApp()
  const { users, reports, fraud, blacklist } = useAdmin()
  const cases = useCases()
  const [bl, setBl] = useState(false)
  const [reason, setReason] = useState("")
  const u = users.find((x) => x.id === uid)
  if (!u)
    return (
      <Panel>
        <p className="py-8 text-center font-bold">Không tìm thấy user.</p>
      </Panel>
    )
  const rep = reports.filter((r) => r.reported === u.id)
  const rc = cases.filter(
    (c) => c.reporter === u.id || rep.some((r) => r.caseId === c.id),
  )
  const dups = DUP_PHONES[u.id] || []
  const reasons = Object.entries(
    rep.reduce<Record<string, number>>(
      (m, r) => ({ ...m, [r.reason]: (m[r.reason] || 0) + 1 }),
      {},
    ),
  )
  const patterns = [
    ...reasons
      .filter(([, n]) => n >= 2)
      .map(([r, n]) => `Bị report "${r}" ${n} lần`),
    ...(dups.length
      ? [`Số điện thoại dùng chung với ${dups.length} tài khoản khác`]
      : []),
    ...(u.rescues === 0 && u.cases > 0
      ? ["Đăng case nhưng chưa có cứu hộ thành công nào"]
      : []),
    ...(u.joined.endsWith("2026")
      ? ["Tài khoản mới tạo trong năm 2026 nhưng bị nhiều report"]
      : []),
  ]
  const inBl = blacklist.some((b) => b.user === u.name)
  const setSt = (s: FraudStatus, msg: string, tone: "ok" | "warn" = "ok") => {
    setFraud(u.id, s)
    toast(msg, tone)
  }
  return (
    <div>
      <Title
        back={() => go("/admin/fraud")}
        title={`Điều tra: ${u.name}`}
        sub={`${u.id} · ${u.area}`}
        right={
          <>
            <FStatus s={fraud[u.id]} />
            <UserStatus s={u.status} />
          </>
        }
      />
      <div className="mb-4 grid grid-cols-2 gap-2 rounded-[24px] border-2 border-line bg-paper p-3 shadow-soft sm:flex sm:flex-wrap">
        <ABtn
          icon={<X />}
          onClick={() => setSt("Đã bỏ qua", "Đã bỏ qua hồ sơ điều tra")}
        >
          Dismiss
        </ABtn>
        <ABtn
          icon={<Eye />}
          onClick={() => setSt("Theo dõi", "Đã chuyển sang theo dõi")}
        >
          Monitor
        </ABtn>
        <ABtn
          v="soft"
          icon={<Lock />}
          onClick={() => {
            setUserStatus(u.id, "Cảnh báo")
            setSt(
              "Hạn chế",
              "Đã hạn chế tài khoản (không đăng case mới)",
              "warn",
            )
          }}
        >
          Restrict
        </ABtn>
        <ABtn
          v="danger"
          icon={<Ban />}
          onClick={() => {
            setUserStatus(u.id, "Bị khóa")
            setSt("Đã khóa", "Đã khóa tài khoản", "warn")
          }}
        >
          Ban
        </ABtn>
        <ABtn
          v="dark"
          icon={<ShieldX />}
          disabled={inBl}
          onClick={() => {
            setReason(rep[0]?.reason || "")
            setBl(true)
          }}
        >
          {inBl ? "Đã trong blacklist" : "Add to blacklist"}
        </ABtn>
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        <Panel title="Lịch sử user">
          <dl className="space-y-1.5 text-sm">
            {[
              ["Tham gia", u.joined],
              ["Case đã đăng", u.cases],
              ["Cứu hộ thành công", u.rescues],
              ["Report nhận", rep.length],
              ["Xác minh", u.verified ? "Đã xác minh" : "Chưa"],
            ].map(([k, v]) => (
              <div key={k as string} className="flex gap-2">
                <dt className="w-36 text-brown-soft">{k}</dt>
                <dd className="font-bold">{v}</dd>
              </div>
            ))}
          </dl>
        </Panel>
        <Panel title="Thông tin liên hệ">
          <dl className="space-y-1.5 text-sm">
            <div className="flex gap-2">
              <dt className="w-24 text-brown-soft">SĐT</dt>
              <dd className="font-bold">{u.phone}</dd>
            </div>
            <div className="flex gap-2">
              <dt className="w-24 text-brown-soft">Email</dt>
              <dd className="font-bold">
                {u.id}.{u.name.split(" ").pop()?.toLowerCase()}@mail.vn
              </dd>
            </div>
            <div className="flex gap-2">
              <dt className="w-24 text-brown-soft">Khu vực</dt>
              <dd className="font-bold">{u.area}</dd>
            </div>
          </dl>
        </Panel>
        <Panel title="Thông tin trùng lặp">
          {dups.length === 0 ? (
            <p className="text-sm text-brown-soft">
              Không phát hiện trùng thông tin.
            </p>
          ) : (
            <>
              <p className="mb-2 text-sm font-bold text-coral">
                Cùng số điện thoại với {dups.length} tài khoản:
              </p>
              <ul className="space-y-1.5">
                {dups.map((d) => (
                  <li
                    key={d.name}
                    className="rounded-lg bg-plum-soft px-2.5 py-1.5 text-sm"
                  >
                    <b>{d.name}</b>{" "}
                    <span className="text-xs text-brown-soft">· {d.note}</span>
                  </li>
                ))}
              </ul>
            </>
          )}
        </Panel>
        <Panel title="Dấu hiệu đáng ngờ" className="lg:col-span-1">
          {patterns.length === 0 ? (
            <p className="text-sm text-brown-soft">
              Chưa phát hiện mẫu bất thường.
            </p>
          ) : (
            <ul className="space-y-1.5 text-sm">
              {patterns.map((p) => (
                <li key={p} className="flex gap-2">
                  <ShieldAlert className="mt-0.5 size-4 shrink-0 text-coral" />
                  {p}
                </li>
              ))}
            </ul>
          )}
        </Panel>
        <Panel
          title={`Lịch sử report (${rep.length})`}
          className="lg:col-span-2"
        >
          {rep.length === 0 ? (
            <p className="text-sm text-brown-soft">Không có.</p>
          ) : (
            <ul className="space-y-2">
              {rep.map((r) => (
                <li
                  key={r.id}
                  className="rounded-xl border border-line p-2.5 text-sm"
                >
                  <span className="flex flex-wrap items-center justify-between gap-2">
                    <b>
                      {r.id} · {r.reason}
                    </b>
                    <span className="flex gap-1.5">
                      <SevChip s={r.severity} />
                      <RStatus s={r.status} />
                    </span>
                  </span>
                  <span className="block text-xs text-brown-soft">
                    {r.created} · bởi {userById(r.reporter)?.name || "Hệ thống"}{" "}
                    · case {r.caseId}
                  </span>
                  <span className="mt-0.5 block">{r.note}</span>
                </li>
              ))}
            </ul>
          )}
        </Panel>
        <Panel
          title={`Case liên quan (${rc.length})`}
          className="lg:col-span-3"
        >
          {rc.length === 0 ? (
            <p className="text-sm text-brown-soft">Không có.</p>
          ) : (
            <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
              {rc.map((c) => (
                <Btn
                  variant="ghost"
                  size="sm"
                  key={c.id}
                  onClick={() => go("/admin/cases/" + c.id)}
                  className="flex h-auto w-full items-center justify-start gap-2 rounded-xl border border-line p-2 text-left text-sm hover:border-brown"
                >
                  <img
                    src={c.photo}
                    alt=""
                    className="size-10 rounded-lg object-cover"
                  />
                  <span className="min-w-0 flex-1">
                    <b>{c.id}</b> · {c.name}
                    <span className="block text-xs text-brown-soft">
                      {c.district}
                    </span>
                  </span>
                  <StatusBadge
                    status={c.status}
                    critical={c.critical}
                    type={c.type}
                  />
                </Btn>
              ))}
            </div>
          )}
        </Panel>
      </div>
      <Modal
        open={bl}
        onClose={() => setBl(false)}
        title="Thêm vào blacklist"
        sheet={false}
      >
        <div className="space-y-3">
          <p className="text-sm">
            Chặn <b>{u.name}</b> ({u.phone}) khỏi hệ thống.
          </p>
          <FormRow label="Lý do">
            <ATextarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </FormRow>
          <div className="flex justify-end gap-2">
            <ABtn onClick={() => setBl(false)}>Hủy</ABtn>
            <ABtn
              v="danger"
              disabled={!reason.trim()}
              onClick={() => {
                addBlacklist({
                  phone: u.phone,
                  user: u.name,
                  reason,
                  evidence: `${rep.length} report liên quan`,
                  reports: rep.length,
                  added: new Date().toLocaleDateString("vi-VN"),
                  status: "Đang hiệu lực",
                })
                setUserStatus(u.id, "Bị khóa")
                setFraud(u.id, "Đã khóa")
                setBl(false)
                toast("Đã thêm vào blacklist", "warn")
              }}
            >
              Thêm
            </ABtn>
          </div>
        </div>
      </Modal>
    </div>
  )
}

/* ---------------- Blacklist ---------------- */
export function Blacklist() {
  const { toast } = useApp()
  const { blacklist } = useAdmin()
  const [edit, setEdit] = useState<Partial<BlackRec> | null>(null)
  const [view, setView] = useState<BlackRec | null>(null)
  const [del, setDel] = useState<BlackRec | null>(null)
  const [q, setQ] = useState("")
  const rows = blacklist.filter(
    (b) =>
      !q.trim() ||
      (b.phone + b.user + b.reason)
        .toLowerCase()
        .includes(q.trim().toLowerCase()),
  )
  const cols: Col<BlackRec>[] = [
    {
      key: "phone",
      label: "Phone",
      sort: (b) => b.phone,
      render: (b) => <b>{b.phone}</b>,
    },
    { key: "user", label: "User", sort: (b) => b.user, render: (b) => b.user },
    {
      key: "reason",
      label: "Reason",
      render: (b) => (
        <span className="block max-w-[260px] truncate" title={b.reason}>
          {b.reason}
        </span>
      ),
    },
    {
      key: "ev",
      label: "Evidence",
      render: (b) => (
        <span className="block max-w-[200px] truncate" title={b.evidence}>
          {b.evidence}
        </span>
      ),
    },
    {
      key: "rep",
      label: "Reports",
      sort: (b) => b.reports,
      render: (b) => b.reports,
    },
    {
      key: "added",
      label: "Date added",
      sort: (b) => b.added.split("/").reverse().join(""),
      render: (b) => b.added,
    },
    {
      key: "st",
      label: "Status",
      render: (b) =>
        b.status === "Đang hiệu lực" ? (
          <Badge tone="coral" icon={<Ban className="size-3.5" />}>
            Đang hiệu lực
          </Badge>
        ) : (
          <Badge tone="brown" icon={<Clock className="size-3.5" />}>
            Hết hiệu lực
          </Badge>
        ),
    },
    {
      key: "a",
      label: "Action",
      render: (b) => (
        <div className="flex gap-1">
          <ABtn s="xs" icon={<Eye />} onClick={() => setView(b)}>
            View
          </ABtn>
          <ABtn s="xs" icon={<Pencil />} onClick={() => setEdit(b)}>
            Update
          </ABtn>
          <ABtn s="xs" v="danger" icon={<Trash2 />} onClick={() => setDel(b)}>
            Remove
          </ABtn>
        </div>
      ),
    },
  ]
  const save = () => {
    if (!edit?.phone?.trim() || !edit.reason?.trim()) {
      toast("Cần nhập số điện thoại và lý do", "warn")
      return
    }
    if (edit.id) {
      patchBlacklist(edit.id, edit)
      toast("Đã cập nhật bản ghi")
    } else {
      addBlacklist({
        phone: edit.phone,
        user: edit.user || "Chưa rõ",
        reason: edit.reason,
        evidence: edit.evidence || "—",
        reports: 0,
        added: new Date().toLocaleDateString("vi-VN"),
        status: "Đang hiệu lực",
      })
      toast("Đã thêm vào blacklist", "warn")
    }
    setEdit(null)
  }
  return (
    <div>
      <Title
        title="Blacklist"
        sub={`${blacklist.filter((b) => b.status === "Đang hiệu lực").length} bản ghi đang hiệu lực`}
        right={
          <ABtn v="dark" icon={<Plus />} onClick={() => setEdit({})}>
            Thêm
          </ABtn>
        }
      />
      <div className="mb-3">
        <SearchBox
          value={q}
          onChange={setQ}
          placeholder="Tìm SĐT, user, lý do…"
        />
      </div>
      <DataTable cols={cols} rows={rows} rowKey={(b) => b.id} />
      <Modal
        open={!!edit}
        onClose={() => setEdit(null)}
        title={edit?.id ? "Cập nhật blacklist" : "Thêm vào blacklist"}
        sheet={false}
      >
        {edit && (
          <div className="space-y-3">
            <FormRow label="Số điện thoại">
              <AInput
                value={edit.phone || ""}
                onChange={(e) => setEdit({ ...edit, phone: e.target.value })}
                placeholder="09xx xxx xxx"
              />
            </FormRow>
            <FormRow label="User">
              <AInput
                value={edit.user || ""}
                onChange={(e) => setEdit({ ...edit, user: e.target.value })}
              />
            </FormRow>
            <FormRow label="Lý do">
              <ATextarea
                value={edit.reason || ""}
                onChange={(e) => setEdit({ ...edit, reason: e.target.value })}
              />
            </FormRow>
            <FormRow label="Bằng chứng">
              <AInput
                value={edit.evidence || ""}
                onChange={(e) => setEdit({ ...edit, evidence: e.target.value })}
              />
            </FormRow>
            {edit.id && (
              <FormRow label="Trạng thái">
                <ASelect
                  value={edit.status}
                  onChange={(e) =>
                    setEdit({
                      ...edit,
                      status: e.target.value as BlackRec["status"],
                    })
                  }
                >
                  <option>Đang hiệu lực</option>
                  <option>Hết hiệu lực</option>
                </ASelect>
              </FormRow>
            )}
            <div className="flex justify-end gap-2">
              <ABtn onClick={() => setEdit(null)}>Hủy</ABtn>
              <ABtn v="dark" onClick={save}>
                Lưu
              </ABtn>
            </div>
          </div>
        )}
      </Modal>
      <Modal
        open={!!view}
        onClose={() => setView(null)}
        title="Chi tiết blacklist"
        sheet={false}
      >
        {view && (
          <dl className="space-y-2 text-sm">
            {[
              ["Số điện thoại", view.phone],
              ["User", view.user],
              ["Lý do", view.reason],
              ["Bằng chứng", view.evidence],
              ["Số report", view.reports],
              ["Ngày thêm", view.added],
              ["Trạng thái", view.status],
            ].map(([k, v]) => (
              <div key={k as string} className="flex gap-3">
                <dt className="w-28 shrink-0 text-brown-soft">{k}</dt>
                <dd className="font-bold">{v}</dd>
              </div>
            ))}
          </dl>
        )}
      </Modal>
      <Confirm
        open={!!del}
        onClose={() => setDel(null)}
        title="Gỡ khỏi blacklist?"
        body={
          <>
            Bản ghi <b>{del?.phone}</b> sẽ bị xóa khỏi blacklist.
          </>
        }
        okLabel="Gỡ"
        onOk={() => {
          if (del) {
            removeBlacklist(del.id)
            toast("Đã gỡ khỏi blacklist")
          }
        }}
      />
    </div>
  )
}
