import type { ReactNode } from "react"
import { useApp } from "@/store"
import { parsePath } from "@/lib"
import { Empty } from "@ui"
import UserShell from "@/layouts/UserShell"
import Notifications from "./components/Notifications"
import Saved from "./components/Saved"
import { Directory, PlaceDetail } from "./components/Directory"
import {
  CommunityHub,
  DonateGoods,
  DonateHome,
  DonateMoney,
  Leaderboard,
} from "./components/Hub"
import Profile from "./components/Profile"
import { Safety, SafetyReport } from "./components/Safety"

export default function CommunityApp(): ReactNode {
  const { path, auth, go } = useApp()
  const { seg, query } = parsePath(path)
  const [a, b] = seg

  let page: ReactNode = null

  switch (a) {
    case "notifications":
      if (seg.length === 1) page = <Notifications />
      break
    case "saved":
      if (seg.length === 1) page = <Saved />
      break
    case "community":
      if (seg.length === 1) page = <CommunityHub />
      break
    case "shelters":
      if (seg.length === 1) page = <Directory kind="shelter" key="sh" />
      else if (seg.length === 2)
        page = <PlaceDetail kind="shelter" id={b} key={b} />
      break
    case "clinics":
      if (seg.length === 1) page = <Directory kind="clinic" key="cl" />
      else if (seg.length === 2)
        page = <PlaceDetail kind="clinic" id={b} key={b} />
      break
    case "donate":
      if (seg.length === 1) page = <DonateHome />
      else if (b === "money")
        page = <DonateMoney shelterId={query.shelter} key={query.shelter} />
      else if (b === "goods") page = <DonateGoods />
      break
    case "leaderboard":
      if (seg.length === 1) page = <Leaderboard />
      break
    case "profile":
      if (seg.length <= 2) page = <Profile uid={b} key={b || "me"} />
      break
    case "safety":
      if (seg.length === 1) page = <Safety />
      else if (b === "report")
        page = (
          <SafetyReport caseId={query.case} userId={query.user} key={path} />
        )
      break
  }

  if (page) return <UserShell>{page}</UserShell>

  return (
    <UserShell>
      <Empty
        title="Không tìm thấy trang này"
        body="Đường dẫn có thể đã thay đổi."
        cta="Về trang chủ"
        onCta={() => go(auth === "guest" ? "/" : "/home")}
      />
    </UserShell>
  )
}
