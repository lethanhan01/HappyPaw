import { useMemo, useState } from "react"
import {
  PawPrint,
  Users,
  Ban,
  BadgeCheck,
  CheckCircle2,
  Eye,
  ShieldAlert,
  ShieldCheck,
  TriangleAlert,
  Undo2,
  X,
  XCircle,
} from "lucide-react"
import { parsePath } from "@/lib"
import { useApp } from "@/store"
import type { User } from "@/types"
import { Avatar, Badge, StatusBadge, Verified, Btn, Empty } from "@ui"
import {
  setAdmin,
  setUserStatus,
  setUserVerified,
  useAdmin,
} from "../store/adminStore"
import {
  ABtn,
  ASelect,
  Col,
  DataTable,
  KpiCard,
  KpiRow,
  Panel,
  SearchBox,
  SevChip,
  Title,
  typeLabel,
  useCases,
} from "./AdminCommon"

export const UserStatus = ({ s }: { s: User["status"] }) =>
  s === "Hoạt động" ? (
    <Badge tone="sage" icon={<CheckCircle2 className="size-3.5" />}>
      Hoạt động
    </Badge>
  ) : s === "Cảnh báo" ? (
    <Badge tone="orange" icon={<TriangleAlert className="size-3.5" />}>
      Cảnh báo
    </Badge>
  ) : (
    <Badge tone="ink" icon={<Ban className="size-3.5" />}>
      Bị khóa
    </Badge>
  )

function useUserActions() {
  const { toast } = useApp()
  return {
    warn: (u: User) => {
      setUserStatus(u.id, "Cảnh báo")
      toast(`Đã cảnh báo ${u.name}`, "warn")
    },
    ban: (u: User) => {
      setUserStatus(u.id, "Bị khóa")
      toast(`Đã khóa tài khoản ${u.name}`, "warn")
    },
    unban: (u: User) => {
      setUserStatus(u.id, "Hoạt động")
      toast(`Đã mở khóa ${u.name}`)
    },
  }
}
function UserActions({ u, view = true }: { u: User; view?: boolean }) {
  const { go } = useApp()
  const a = useUserActions()
  return (
    <div className="flex flex-wrap gap-1" onClick={(e) => e.stopPropagation()}>
      {view && (
        <ABtn s="xs" icon={<Eye />} onClick={() => go("/admin/users/" + u.id)}>
          View
        </ABtn>
      )}
      {u.status !== "Bị khóa" && (
        <ABtn
          s="xs"
          icon={<TriangleAlert />}
          disabled={u.status === "Cảnh báo"}
          onClick={() => a.warn(u)}
        >
          Warn
        </ABtn>
      )}
      {u.status !== "Bị khóa" ? (
        <ABtn s="xs" v="danger" icon={<Ban />} onClick={() => a.ban(u)}>
          Ban
        </ABtn>
      ) : (
        <ABtn s="xs" v="ok" icon={<Undo2 />} onClick={() => a.unban(u)}>
          Unban
        </ABtn>
      )}
    </div>
  )
}

export function UserList({ path }: { path: string }) {
  const { go } = useApp()
  const { users } = useAdmin()
  const { query } = parsePath(path)
  const banMode = query.filter === "ban"
  const [q, setQ] = useState("")
  const [st, setSt] = useState("")
  const [area, setArea] = useState("")
  const rows = useMemo(
    () =>
      users.filter((u) => {
        if (banMode && u.status === "Hoạt động") return false
        if (st && u.status !== st) return false
        if (area && u.area !== area) return false
        const t = q.trim().toLowerCase()
        return (
          !t || (u.name + u.area + u.id + u.phone).toLowerCase().includes(t)
        )
      }),
    [users, banMode, st, area, q],
  )
  const cols: Col<User>[] = [
    {
      key: "user",
      label: "User",
      sort: (u) => u.name,
      render: (u) => (
        <span className="flex items-center gap-2">
          <Avatar name={u.name} tone={u.avatar} size={28} />
          <span>
            <b className="block leading-tight">{u.name}</b>
            <span className="flex items-center gap-1 text-xs text-brown-soft">
              {u.id}{" "}
              {u.verified && <BadgeCheck className="size-3.5 text-sky-2" />}
            </span>
          </span>
        </span>
      ),
    },
    { key: "area", label: "Area", sort: (u) => u.area, render: (u) => u.area },
    {
      key: "joined",
      label: "Joined",
      sort: (u) => u.joined.split("/").reverse().join(""),
      render: (u) => u.joined,
    },
    {
      key: "cases",
      label: "Cases",
      sort: (u) => u.cases,
      render: (u) => u.cases,
    },
    {
      key: "resc",
      label: "Successful rescues",
      sort: (u) => u.rescues,
      render: (u) => u.rescues,
    },
    {
      key: "rep",
      label: "Reports",
      sort: (u) => u.reports,
      render: (u) => (
        <span className={u.reports >= 3 ? "font-extrabold text-coral" : ""}>
          {u.reports}
        </span>
      ),
    },
    {
      key: "st",
      label: "Status",
      sort: (u) => u.status,
      render: (u) => <UserStatus s={u.status} />,
    },
    { key: "act", label: "Action", render: (u) => <UserActions u={u} /> },
  ]
  return (
    <div>
      <Title
        title={banMode ? "Ban / Unban" : "Quản lý Users"}
        sub={
          banMode
            ? "Tài khoản đang bị cảnh báo hoặc khóa"
            : `${rows.length}/${users.length} người dùng`
        }
        right={
          banMode ? (
            <ABtn onClick={() => go("/admin/users")}>Xem tất cả users</ABtn>
          ) : undefined
        }
      />
      <KpiRow>
        <KpiCard icon={<Users />} label="Tổng users" value={users.length} />
        <KpiCard
          icon={<BadgeCheck />}
          label="Đã xác minh"
          value={users.filter((x) => x.verified).length}
          tone="bg-sky-soft text-sky-2"
        />
        <KpiCard
          icon={<TriangleAlert />}
          label="Đang cảnh báo"
          value={users.filter((x) => x.status === "Cảnh báo").length}
          tone="bg-orange-soft text-orange"
        />
        <KpiCard
          icon={<Ban />}
          label="Bị khóa"
          value={users.filter((x) => x.status === "Bị khóa").length}
          tone="bg-coral-soft text-coral"
        />
      </KpiRow>
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <SearchBox
          value={q}
          onChange={setQ}
          placeholder="Tìm tên, khu vực, SĐT…"
        />
        <ASelect
          aria-label="Trạng thái"
          value={st}
          onChange={(e) => setSt(e.target.value)}
          className="!w-auto"
        >
          <option value="">Mọi trạng thái</option>
          <option>Hoạt động</option>
          <option>Cảnh báo</option>
          <option>Bị khóa</option>
        </ASelect>
        <ASelect
          aria-label="Khu vực"
          value={area}
          onChange={(e) => setArea(e.target.value)}
          className="!w-auto"
        >
          <option value="">Mọi khu vực</option>
          {Array.from(new Set(users.map((u) => u.area)))
            .sort()
            .map((a) => (
              <option key={a}>{a}</option>
            ))}
        </ASelect>
      </div>
      <DataTable
        cols={cols}
        rows={rows}
        rowKey={(u) => u.id}
        onRow={(u) => go("/admin/users/" + u.id)}
      />
    </div>
  )
}

export function UserDetail({ id }: { id: string }) {
  const { go } = useApp()
  const { users, reports } = useAdmin()
  const cases = useCases()
  const u = users.find((x) => x.id === id)
  if (!u)
    return (
      <Panel>
        <p className="py-8 text-center font-bold">
          Không tìm thấy user.{" "}
          <Btn
            variant="ghost"
            size="sm"
            className="inline h-auto p-0 underline font-bold"
            onClick={() => go("/admin/users")}
          >
            Quay lại
          </Btn>
        </p>
      </Panel>
    )
  const mine = cases.filter((c) => c.reporter === u.id)
  const rescues = cases.filter((c) => c.assignee === u.id)
  const against = reports.filter((r) => r.reported === u.id)
  const filed = reports.filter((r) => r.reporter === u.id)
  return (
    <div>
      <Title
        back={() => go("/admin/users")}
        title={u.name}
        sub={`${u.id} · ${u.area} · tham gia ${u.joined}`}
        right={<UserActions u={u} view={false} />}
      />
      <div className="grid gap-4 lg:grid-cols-3">
        <Panel title="Hồ sơ">
          <div className="mb-3 flex items-center gap-3">
            <Avatar name={u.name} tone={u.avatar} size={52} />
            <div>
              <UserStatus s={u.status} />
              {u.verified ? (
                <div className="mt-1">
                  <Verified />
                </div>
              ) : (
                <div className="mt-1 text-xs text-brown-soft">
                  Chưa xác minh
                </div>
              )}
            </div>
          </div>
          <dl className="space-y-1.5 text-sm">
            <div className="flex gap-2">
              <dt className="w-24 text-brown-soft">SĐT</dt>
              <dd className="font-bold">{u.phone}</dd>
            </div>
            <div className="flex gap-2">
              <dt className="w-24 text-brown-soft">Khu vực</dt>
              <dd className="font-bold">{u.area}</dd>
            </div>
            <div className="flex gap-2">
              <dt className="w-24 text-brown-soft">Giới thiệu</dt>
              <dd className="font-bold">{u.bio || "—"}</dd>
            </div>
          </dl>
        </Panel>
        <Panel title="Hoạt động" className="lg:col-span-2">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              ["Case đã đăng", u.cases],
              ["Cứu hộ thành công", u.rescues],
              ["Report nhận", u.reports],
              ["Report đã gửi", filed.length],
            ].map(([l, v]) => (
              <KpiCard
                key={l as string}
                icon={<PawPrint />}
                label={l as string}
                value={v}
              />
            ))}
          </div>
        </Panel>
        <Panel title={`Report liên quan (${against.length})`}>
          {against.length === 0 ? (
            <p className="text-sm text-brown-soft">Chưa bị report.</p>
          ) : (
            <ul className="space-y-2">
              {against.map((r) => (
                <li
                  key={r.id}
                  className="rounded-xl border border-line p-2 text-sm"
                >
                  <span className="flex items-center justify-between gap-2">
                    <b>
                      {r.id} · {r.reason}
                    </b>
                    <SevChip s={r.severity} />
                  </span>
                  <span className="text-xs text-brown-soft">{r.note}</span>
                </li>
              ))}
            </ul>
          )}
          {against.length > 0 && (
            <ABtn
              className="mt-2"
              s="sm"
              icon={<ShieldAlert />}
              onClick={() => go("/admin/fraud/" + u.id)}
            >
              Mở điều tra
            </ABtn>
          )}
        </Panel>
        <Panel title={`Case đã đăng (${mine.length})`}>
          {mine.length === 0 ? (
            <p className="text-sm text-brown-soft">Chưa có case.</p>
          ) : (
            <ul className="space-y-2">
              {mine.map((c) => (
                <li key={c.id}>
                  <Btn
                    variant="ghost"
                    size="sm"
                    onClick={() => go("/admin/cases/" + c.id)}
                    className="flex h-auto w-full items-center justify-between gap-2 rounded-xl border border-line p-2 text-left text-sm hover:border-brown"
                  >
                    <span>
                      <b>{c.id}</b> · {c.name}{" "}
                      <span className="text-xs text-brown-soft">
                        {typeLabel[c.type]}
                      </span>
                    </span>
                    <StatusBadge
                      status={c.status}
                      critical={c.critical}
                      type={c.type}
                    />
                  </Btn>
                </li>
              ))}
            </ul>
          )}
        </Panel>
        <Panel title={`Lịch sử cứu hộ (${rescues.length})`}>
          {rescues.length === 0 ? (
            <p className="text-sm text-brown-soft">
              Chưa nhận cứu hộ case nào trong hệ thống.
            </p>
          ) : (
            <ul className="space-y-2">
              {rescues.map((c) => (
                <li key={c.id}>
                  <Btn
                    variant="ghost"
                    size="sm"
                    onClick={() => go("/admin/cases/" + c.id)}
                    className="flex h-auto w-full items-center justify-between gap-2 rounded-xl border border-line p-2 text-left text-sm hover:border-brown"
                  >
                    <span>
                      <b>{c.id}</b> · {c.name}
                    </span>
                    <StatusBadge
                      status={c.status}
                      critical={c.critical}
                      type={c.type}
                    />
                  </Btn>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>
    </div>
  )
}

export function UserVerification() {
  const { users, userVerifyRejected } = useAdmin()
  const { toast, go } = useApp()
  const queue = users.filter(
    (u) => !u.verified && !userVerifyRejected.includes(u.id),
  )
  const reject = (u: User) => {
    setAdmin((s) => ({ userVerifyRejected: [...s.userVerifyRejected, u.id] }))
    toast(`Đã từ chối xác minh ${u.name}`, "warn")
  }
  return (
    <div>
      <Title
        title="Xác minh người dùng"
        sub={`${queue.length} tài khoản chờ xác minh`}
      />
      {queue.length === 0 ? (
        <Panel>
          <div className="py-8">
            <Empty
              title="Không còn tài khoản chờ xác minh"
              body="Tất cả tài khoản gửi yêu cầu xác minh CCCD đã được xử lý."
            />
          </div>
        </Panel>
      ) : (
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {queue.map((u) => (
            <Panel key={u.id}>
              <div className="flex items-center gap-3">
                <Avatar name={u.name} tone={u.avatar} size={40} />
                <div className="min-w-0">
                  <Btn
                    variant="ghost"
                    size="sm"
                    onClick={() => go("/admin/users/" + u.id)}
                    className="inline h-auto p-0 block truncate font-extrabold hover:underline"
                  >
                    {u.name}
                  </Btn>
                  <p className="text-xs text-brown-soft">
                    {u.area} · tham gia {u.joined}
                  </p>
                </div>
              </div>
              <dl className="mt-2 space-y-0.5 text-sm">
                <div className="flex gap-2">
                  <dt className="w-20 text-brown-soft">SĐT</dt>
                  <dd className="font-bold">{u.phone}</dd>
                </div>
                <div className="flex gap-2">
                  <dt className="w-20 text-brown-soft">Giấy tờ</dt>
                  <dd className="font-bold">CCCD (đã tải lên)</dd>
                </div>
                <div className="flex gap-2">
                  <dt className="w-20 text-brown-soft">Trạng thái</dt>
                  <dd>
                    <UserStatus s={u.status} />
                  </dd>
                </div>
              </dl>
              <div className="mt-3 flex gap-2">
                <ABtn
                  v="ok"
                  icon={<ShieldCheck />}
                  disabled={u.status === "Bị khóa"}
                  onClick={() => {
                    setUserVerified(u.id, true)
                    toast(`Đã xác minh ${u.name}`)
                  }}
                >
                  Xác minh
                </ABtn>
                <ABtn icon={<X />} onClick={() => reject(u)}>
                  Từ chối
                </ABtn>
              </div>
            </Panel>
          ))}
        </div>
      )}
      {userVerifyRejected.length > 0 && (
        <p className="mt-3 flex items-center gap-1.5 text-sm text-brown-soft">
          <XCircle className="size-4" />
          {userVerifyRejected.length} yêu cầu đã bị từ chối.
        </p>
      )}
    </div>
  )
}
