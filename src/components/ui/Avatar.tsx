import { USERS } from "@/constants/mock/users"
import { cx } from "@/lib/cn"

const avTone: Record<string, string> = {
  pink: "bg-pink text-brown",
  butter: "bg-butter text-brown",
  sage: "bg-sage text-brown",
  peach: "bg-peach text-brown",
  sky: "bg-sky text-brown",
  ink: "bg-ink text-butter",
}

export function Avatar({
  name,
  tone = "pink",
  size = 36,
  initials: customInitials,
}: {
  name: string
  tone?: string
  size?: number
  initials?: string
}) {
  const initials =
    customInitials ||
    name
      .split(" ")
      .slice(-2)
      .map((w) => w[0])
      .join("")
  return (
    <span
      style={{ width: size, height: size, fontSize: size * 0.38 }}
      className={cx(
        "inline-grid shrink-0 place-items-center rounded-full border-2 border-brown font-display font-extrabold",
        avTone[tone] || "bg-pink text-brown",
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
