import { useState } from "react"
import { BadgeCheck, EyeOff, Eye, Pencil, Trash2 } from "lucide-react"
import { parsePath } from "@/lib"
import { useApp } from "@/store"
import CityMap, { MapLegend, type Sel } from "@/features/map"
import { Chip, Modal } from "@ui"
import { PinDetailCard } from "@/components/common"
import {
  patchRisk,
  removeClinic,
  removeRisk,
  removeShelter,
  removeCase,
  setVerify,
  toggleIn,
  useAdmin,
} from "../store/adminStore"
import {
  ABtn,
  AInput,
  ASelect,
  ATextarea,
  Confirm,
  FormRow,
  Panel,
  Title,
  useCases,
} from "./AdminCommon"
import { PlaceForm } from "./Places"
import { PolyZones, RISK_REASONS } from "./Risk"

type Layer = "rescue" | "lost" | "shelter" | "clinic" | "risk"
const LAYERS: [Layer, string][] = [
  ["rescue", "Rescue"],
  ["lost", "Lost"],
  ["shelter", "Shelter"],
  ["clinic", "Clinic"],
  ["risk", "Risk"],
]

export default function MapManagement({ path }: { path: string }) {
  const { query } = parsePath(path)
  const { updateCase, toast } = useApp()
  const cases = useCases()
  const { shelters, clinics, risks, hiddenPins, verifiedPins } = useAdmin()
  const q = query.layer as Layer || "rescue"
  const [seen, setSeen] = useState(q)
  const [on, setOn] = useState<Layer[]>([q])
  if (seen !== q) {
    setSeen(q)
    setOn([q])
  }
  const [sel, setSel] = useState<Sel | null>(null)
  const [modal, setModal] = useState<"edit" | "remove" | null>(null)
  const [cf, setCf] = useState({ name: "", street: "", desc: "" })
  const [rf, setRf] = useState({
    title: RISK_REASONS[0],
    severity: "Cao",
    expires: "",
  })

  const key = (k: string, id: string) => k + ":" + id
  const vis = (k: string, id: string) => !hiddenPins.includes(key(k, id))
  const open = cases.filter((c) => c.status !== "resolved")
  const mapCases = open.filter(
    (c) =>
      vis("case", c.id) &&
      ((on.includes("rescue") && c.type === "rescue") ||
        (on.includes("lost") && c.type !== "rescue")),
  )
  const mapShelters = on.includes("shelter")
    ? shelters.filter((s) => vis("shelter", s.id) && s.status === "Hoạt động")
    : []
  const mapClinics = on.includes("clinic")
    ? clinics.filter((c) => vis("clinic", c.id) && c.status === "Hoạt động")
    : []
  const mapRisks = on.includes("risk")
    ? risks.filter((r) => vis("risk", r.id))
    : []
  const toggle = (l: Layer) =>
    setOn((o) => (o.includes(l) ? o.filter((x) => x !== l) : [...o, l]))
  const count: Record<Layer, number> = {
    rescue: open.filter((c) => c.type === "rescue").length,
    lost: open.filter((c) => c.type !== "rescue").length,
    shelter: shelters.length,
    clinic: clinics.length,
    risk: risks.length,
  }

  const item =
    sel &&
    (sel.kind === "case"
      ? { kind: "case", data: cases.find((c) => c.id === sel.id) }
      : sel.kind === "shelter"
        ? { kind: "shelter", data: shelters.find((c) => c.id === sel.id) }
        : sel.kind === "clinic"
          ? { kind: "clinic", data: clinics.find((c) => c.id === sel.id) }
          : { kind: "risk", data: risks.find((c) => c.id === sel.id) })
  const d = item?.data as any // eslint-disable-line @typescript-eslint/no-explicit-any
  const verified = sel
    ? sel.kind === "shelter" || sel.kind === "clinic"
      ? d?.verify === "verified"
      : verifiedPins.includes(key(sel.kind, sel.id))
    : false

  const startEdit = () => {
    if (!sel || !d) return
    if (sel.kind === "case")
      setCf({ name: d.name, street: d.street, desc: d.desc })
    if (sel.kind === "risk")
      setRf({ title: d.title, severity: d.severity, expires: d.expires })
    setModal("edit")
  }
  const hide = () => {
    if (!sel) return
    toggleIn("hiddenPins", key(sel.kind, sel.id), true)
    toast("Đã ẩn khỏi bản đồ")
    setSel(null)
  }
  const verify = () => {
    if (!sel || !d) return
    if (sel.kind === "shelter" || sel.kind === "clinic")
      setVerify(sel.kind, sel.id, "verified")
    else toggleIn("verifiedPins", key(sel.kind, sel.id), true)
    toast("Đã xác minh")
  }
  const remove = () => {
    if (!sel) return
    if (sel.kind === "case") removeCase(sel.id)
    else if (sel.kind === "shelter") removeShelter(sel.id)
    else if (sel.kind === "clinic") removeClinic(sel.id)
    else removeRisk(sel.id)
    toast("Đã xóa khỏi hệ thống", "warn")
    setSel(null)
  }

  const hiddenList = hiddenPins.map((k) => k.split(":") as [string, string])
  const nameOf = (k: string, id: string) =>
    (k === "case"
      ? cases.find((c) => c.id === id)?.name
      : k === "shelter"
        ? shelters.find((c) => c.id === id)?.name
        : k === "clinic"
          ? clinics.find((c) => c.id === id)?.name
          : risks.find((c) => c.id === id)?.title) || id

  return (
    <div>
      <Title
        title="Map Management"
        sub="Bật/tắt lớp dữ liệu và quản lý từng điểm trên bản đồ"
      />
      <div className="mb-3 flex flex-wrap gap-2">
        {LAYERS.map(([l, label]) => (
          <Chip key={l} active={on.includes(l)} onClick={() => toggle(l)}>
            {label} <span className="text-xs opacity-70">({count[l]})</span>
          </Chip>
        ))}
      </div>
      <div className="grid gap-4 xl:grid-cols-[1fr_340px]">
        <div className="min-w-0">
          <div className="overflow-hidden rounded-2xl border-2 border-line">
            <CityMap
              className="h-[340px] sm:h-[460px] lg:h-[600px]"
              cases={mapCases}
              shelters={mapShelters}
              clinics={mapClinics}
              risks={mapRisks.filter((r) => !r.poly)}
              selected={sel}
              onSelect={setSel}
              revealIds={open.map((c) => c.id)}
              extras={<PolyZones risks={mapRisks} selectedId={sel?.id} />}
            />
          </div>
          <MapLegend className="mt-2" />
        </div>
        <div className="space-y-4">
          <Panel title="Chi tiết điểm đã chọn">
            <PinDetailCard
              sel={sel}
              data={d}
              display="panel"
              onClose={() => setSel(null)}
              verified={verified}
              actions={
                <div className="grid grid-cols-2 gap-2">
                  <ABtn icon={<Pencil />} onClick={startEdit}>
                    Edit
                  </ABtn>
                  <ABtn icon={<EyeOff />} onClick={hide}>
                    Hide
                  </ABtn>
                  <ABtn
                    v="ok"
                    icon={<BadgeCheck />}
                    disabled={verified}
                    onClick={verify}
                  >
                    Verify
                  </ABtn>
                  <ABtn
                    v="danger"
                    icon={<Trash2 />}
                    onClick={() => setModal("remove")}
                  >
                    Remove
                  </ABtn>
                </div>
              }
            />
          </Panel>
          {hiddenList.length > 0 && (
            <Panel title={`Đang ẩn (${hiddenList.length})`}>
              <ul className="space-y-1.5">
                {hiddenList.map(([k, id]) => (
                  <li
                    key={k + id}
                    className="flex items-center justify-between gap-2 text-sm"
                  >
                    <span className="truncate font-bold">{nameOf(k, id)}</span>
                    <ABtn
                      s="xs"
                      icon={<Eye />}
                      onClick={() => toggleIn("hiddenPins", key(k, id), false)}
                    >
                      Hiện
                    </ABtn>
                  </li>
                ))}
              </ul>
            </Panel>
          )}
        </div>
      </div>

      <Modal
        open={modal === "edit" && !!sel}
        onClose={() => setModal(null)}
        title={
          sel?.kind === "shelter" || sel?.kind === "clinic"
            ? "Chỉnh sửa địa điểm"
            : sel?.kind === "risk"
              ? "Chỉnh sửa khu vực"
              : "Chỉnh sửa case"
        }
        wide={sel?.kind === "shelter" || sel?.kind === "clinic"}
      >
        {sel?.kind === "case" && (
          <div className="space-y-3">
            <FormRow label="Tên pet">
              <AInput
                value={cf.name}
                onChange={(e) => setCf({ ...cf, name: e.target.value })}
              />
            </FormRow>
            <FormRow label="Địa chỉ">
              <AInput
                value={cf.street}
                onChange={(e) => setCf({ ...cf, street: e.target.value })}
              />
            </FormRow>
            <FormRow label="Mô tả">
              <ATextarea
                value={cf.desc}
                onChange={(e) => setCf({ ...cf, desc: e.target.value })}
              />
            </FormRow>
            <div className="flex justify-end gap-2">
              <ABtn onClick={() => setModal(null)}>Hủy</ABtn>
              <ABtn
                v="dark"
                onClick={() => {
                  updateCase(sel.id, cf)
                  toast("Đã cập nhật case")
                  setModal(null)
                }}
              >
                Lưu
              </ABtn>
            </div>
          </div>
        )}
        {sel?.kind === "risk" && (
          <div className="space-y-3">
            <FormRow label="Lý do">
              <ASelect
                value={rf.title}
                onChange={(e) => setRf({ ...rf, title: e.target.value })}
              >
                {Array.from(new Set([rf.title, ...RISK_REASONS])).map((r) => (
                  <option key={r}>{r}</option>
                ))}
              </ASelect>
            </FormRow>
            <FormRow label="Mức độ">
              <ASelect
                value={rf.severity}
                onChange={(e) => setRf({ ...rf, severity: e.target.value })}
              >
                <option>Cao</option>
                <option>Trung bình</option>
                <option>Thấp</option>
              </ASelect>
            </FormRow>
            <FormRow label="Hết hạn (dd/mm/yyyy)">
              <AInput
                value={rf.expires}
                onChange={(e) => setRf({ ...rf, expires: e.target.value })}
              />
            </FormRow>
            <div className="flex justify-end gap-2">
              <ABtn onClick={() => setModal(null)}>Hủy</ABtn>
              <ABtn
                v="dark"
                onClick={() => {
                  patchRisk(sel.id, {
                    title: rf.title,
                    type: rf.title,
                    severity: rf.severity as "Cao",
                    expires: rf.expires,
                  })
                  toast("Đã cập nhật khu vực")
                  setModal(null)
                }}
              >
                Lưu
              </ABtn>
            </div>
          </div>
        )}
        {(sel?.kind === "shelter" || sel?.kind === "clinic") && d && (
          <PlaceForm
            kind={sel.kind}
            initial={d}
            onClose={() => setModal(null)}
          />
        )}
      </Modal>
      <Confirm
        open={modal === "remove"}
        onClose={() => setModal(null)}
        title="Xóa điểm này?"
        body="Điểm sẽ bị xóa khỏi hệ thống và bản đồ. Có thể dùng Hide nếu chỉ muốn ẩn tạm thời."
        okLabel="Remove"
        onOk={remove}
      />
    </div>
  )
}
