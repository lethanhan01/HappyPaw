import { Check, Eye, Flag, ShieldCheck } from 'lucide-react'
import { useApp } from '@/store'
import { timeAgo, userById } from '@/constants'
import type { Case } from '@/types'
import { PetPhoto, StatusBadge } from '@ui'
import { toggleIn, useAdmin } from '../store/adminStore'
import { ActionMenu, DataTable, RiskChip, UserCell, typeLabel, useRisk, type Col } from './AdminCommon'

export function useCaseActions() {
  const { go, updateCase, toast } = useApp()
  const { flaggedCases } = useAdmin()
  return (c: Case) => [
    { label: 'View', icon: <Eye />, onClick: () => go('/admin/cases/' + c.id) },
    { label: 'Verify', icon: <ShieldCheck />, disabled: c.status !== 'pending', onClick: () => { updateCase(c.id, { status: 'resolved' }); toast(`Đã xác minh case ${c.id}`) } },
    { label: flaggedCases.includes(c.id) ? 'Bỏ cờ' : 'Flag', icon: <Flag />, onClick: () => { const on = !flaggedCases.includes(c.id); toggleIn('flaggedCases', c.id, on); toast(on ? `Đã gắn cờ ${c.id} - risk Cao` : `Đã bỏ cờ ${c.id}`, on ? 'warn' : 'ok') } },
    { label: 'Resolve', icon: <Check />, disabled: c.status === 'resolved', onClick: () => { updateCase(c.id, { status: 'resolved' }); toast(`Case ${c.id} đã đánh dấu giải quyết`) } },
  ]
}

export default function CaseTable({ rows, empty, dense }: { rows: Case[]; empty?: string; dense?: boolean }) {
  const { go } = useApp()
  const risk = useRisk()
  const actions = useCaseActions()
  const assigned = (c: Case) => (c.assignee ? <UserCell id={c.assignee} /> : <span className="whitespace-nowrap font-semibold text-coral">Chưa nhận</span>)
  const cols: Col<Case>[] = [
    { key: 'id', label: 'Case ID', sort: (c) => c.id, render: (c) => <b>{c.id}</b> },
    { key: 'pet', label: 'Pet', sort: (c) => c.name, render: (c) => <span className="flex items-center gap-2"><PetPhoto src={c.photo} species={c.species} alt={c.name} className="size-8 shrink-0 rounded-lg" /><span><b className="block leading-tight">{c.name}</b><span className="block max-w-[70px] truncate text-xs text-brown-soft">{c.species} · {c.breed}</span></span></span> },
    { key: 'type', label: 'Type', sort: (c) => c.type, render: (c) => <span className="whitespace-nowrap">{typeLabel[c.type]}</span> },
    { key: 'district', label: 'District', sort: (c) => c.district, render: (c) => <span className="whitespace-nowrap">{c.district}</span> },
    { key: 'status', label: 'Status', sort: (c) => c.status, render: (c) => <StatusBadge status={c.status} critical={c.critical} type={c.type} /> },
    { key: 'created', label: 'Created', sort: (c) => -c.minutesAgo, render: (c) => <span className="whitespace-nowrap">{timeAgo(c.minutesAgo)}</span> },
    { key: 'upd', label: 'Last update', sort: (c) => -c.updatedAgo, render: (c) => <span className="whitespace-nowrap">{timeAgo(c.updatedAgo)}</span> },
    { key: 'assigned', label: 'Assigned', sort: (c) => userById(c.assignee)?.name || '', render: assigned },
    { key: 'risk', label: 'Risk', sort: (c) => risk(c), render: (c) => <RiskChip l={risk(c)} /> },
    { key: 'act', label: 'Action', render: (c) => <ActionMenu items={actions(c)} label={`Hành động ${c.id}`} /> },
  ]
  return (
    <DataTable cols={cols} rows={rows} rowKey={(c) => c.id} dense={dense} onRow={(c) => go('/admin/cases/' + c.id)} empty={empty || 'Không có case nào khớp bộ lọc.'}
      card={(c) => (
        <div>
          <div className="flex items-start gap-2.5">
            <PetPhoto src={c.photo} species={c.species} alt={c.name} className="size-11 shrink-0 rounded-xl" />
            <div className="min-w-0 flex-1">
              <p className="truncate font-bold leading-tight">{c.id} · {c.name}</p>
              <p className="truncate text-xs text-brown-soft">{typeLabel[c.type]} · {c.district}</p>
              <div className="mt-1 flex flex-wrap items-center gap-1.5"><StatusBadge status={c.status} critical={c.critical} type={c.type} /><RiskChip l={risk(c)} /></div>
            </div>
            <div onClick={(e) => e.stopPropagation()} className="shrink-0"><ActionMenu items={actions(c)} label={`Hành động ${c.id}`} /></div>
          </div>
          <dl className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1 border-t border-line/70 pt-2 text-xs">
            <div><dt className="font-bold uppercase text-brown-soft">Created</dt><dd className="font-semibold">{timeAgo(c.minutesAgo)}</dd></div>
            <div><dt className="font-bold uppercase text-brown-soft">Last update</dt><dd className="font-semibold">{timeAgo(c.updatedAgo)}</dd></div>
            <div className="col-span-2"><dt className="font-bold uppercase text-brown-soft">Assigned</dt><dd className="font-semibold">{assigned(c)}</dd></div>
          </dl>
        </div>
      )} />
  )
}
