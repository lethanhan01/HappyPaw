import { USERS } from "@/constants/mock/users"
import { cx } from "@/lib/cn"

const avBg: Record<string, string> = {
  pink: "bg-pink",
  butter: "bg-butter",
  sage: "bg-sage",
  peach: "bg-peach",
  sky: "bg-sky",
}

export function Avatar({
  name,
  tone = "pink",
  size = 36,
}: {
  name: string
  tone?: string
  size?: number
}) {
  const initials = name
    .split(" ")
    .slice(-2)
    .map((w) => w[0])
    .join("")
  return (
    <span
      style={{ width: size, height: size, fontSize: size * 0.38 }}
      className={cx(
        "inline-grid shrink-0 place-items-center rounded-full border-2 border-brown font-display font-extrabold text-brown",
        avBg[tone] || "bg-pink",
      )}
    >
      {initials}
    </span>
  )
}

export const UserAvatar = ({ id, size }: { id?: string; size?: number }) => {
  const u = USERS.find((x) => x.id === id)
  return <Avatar name={u?.name || "?"} tone={u?.avatar} size={size} />
}
