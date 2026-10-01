import type { ReactNode } from "react"
import { useApp } from "@/store"
import { parsePath } from "@/lib"
import { Empty } from "@ui"
import UserShell from "@/layouts/UserShell"
import Auth from "./components/Auth"
import Explorer from "./components/Explorer"
import { FindHub, AiMatch, StatesDemo } from "./components/Find"
import {
  ReportChooser,
  LostWizard,
  FoundWizard,
  RescueForm,
} from "./components/Report"
import { caseRoute } from "./components/Caseflow"

export default function UserApp(): ReactNode {
  const { path, auth, go } = useApp()
  const { seg } = parsePath(path)
  const [a, b] = seg

  let page: ReactNode = null

  switch (a) {
    case "login":
      page = <Auth mode="login" />
      break
    case "register":
      page = <Auth mode="register" />
      break
    case "home":
    case "map":
      page = <Explorer variant="home" />
      break
    case "find":
      page = <FindHub />
      break
    case "ai-match":
      page = <AiMatch />
      break
    case "states":
      page = <StatesDemo />
      break
    case "report":
      if (b === "lost") page = <LostWizard />
      else if (b === "found") page = <FoundWizard />
      else if (b === "rescue") page = <RescueForm />
      else page = <ReportChooser />
      break
    case "case":
      page = caseRoute(path)
      break
  }

  if (page) return <>{page}</>

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
