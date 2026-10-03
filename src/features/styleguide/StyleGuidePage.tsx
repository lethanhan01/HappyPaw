import { useState, useMemo } from "react"
import {
  Palette,
  Type,
  Sparkles,
  Layers,
  Search,
  Copy,
  Check,
  ArrowLeft,
  ShieldAlert,
  Heart,
  Info,
  Sliders,
  Play,
  CheckCircle2,
  AlertCircle,
  Eye,
  Star,
  MapPin,
  Phone,
  Send,
  Clock,
  Code2,
} from "lucide-react"
import { useApp } from "@/store"
import {
  Btn,
  IconBtn,
  Card,
  Badge,
  StatusBadge,
  Input,
  Select,
  Textarea,
  Segmented,
  Chip,
  Toggle,
  Check2,
  Field,
  Empty,
  Skeleton,
  PageLoader,
  Stars,
  Avatar,
  Paw,
  Logo,
} from "@ui"

interface ColorToken {
  name: string
  token: string
  hex: string
  tailwindClass: string
  textClass: string
  category: "canvas" | "typography" | "brand" | "semantic"
  usage: string
  contrastOnWhite: string
  isDarkTextRecommended: boolean
}

const COLOR_TOKENS: ColorToken[] = [
  // Canvas & Base
  {
    name: "Cream",
    token: "--color-cream",
    hex: "#fdf3dc",
    tailwindClass: "bg-cream",
    textClass: "text-brown",
    category: "canvas",
    usage: "Nền chính toàn bộ app (body canvas), ấm áp và thân thiện",
    contrastOnWhite: "1.1:1",
    isDarkTextRecommended: true,
  },
  {
    name: "Cream 2",
    token: "--color-cream-2",
    hex: "#f8ebc8",
    tailwindClass: "bg-cream-2",
    textClass: "text-brown",
    category: "canvas",
    usage: "Nền thứ cấp, nền tabbar, ô nền hover nhẹ",
    contrastOnWhite: "1.2:1",
    isDarkTextRecommended: true,
  },
  {
    name: "Paper",
    token: "--color-paper",
    hex: "#fffaf0",
    tailwindClass: "bg-paper",
    textClass: "text-brown",
    category: "canvas",
    usage: "Màu giấy ngà cho bề mặt Card, Modal, Input, tạo chiều sâu êm dịu",
    contrastOnWhite: "1.05:1",
    isDarkTextRecommended: true,
  },
  {
    name: "Map Sand",
    token: "--color-map-sand",
    hex: "#efe5c4",
    tailwindClass: "bg-map-sand",
    textClass: "text-brown",
    category: "canvas",
    usage: "Nền sa bàn bản đồ OpenMapVN và container định vị",
    contrastOnWhite: "1.3:1",
    isDarkTextRecommended: true,
  },
  {
    name: "Line",
    token: "--color-line",
    hex: "#e6d3ad",
    tailwindClass: "bg-line",
    textClass: "text-brown",
    category: "canvas",
    usage: "Đường kẻ phân cách (divider), viền nhạt các ô nhập liệu",
    contrastOnWhite: "1.5:1",
    isDarkTextRecommended: true,
  },

  // Typography & Outlines
  {
    name: "Ink",
    token: "--color-ink",
    hex: "#2d2622",
    tailwindClass: "bg-ink",
    textClass: "text-ink",
    category: "typography",
    usage: "Chữ tiêu đề quan trọng, nút dark, độ tương phản cao nhất",
    contrastOnWhite: "13.8:1",
    isDarkTextRecommended: false,
  },
  {
    name: "Brown",
    token: "--color-brown",
    hex: "#6b4128",
    tailwindClass: "bg-brown",
    textClass: "text-brown",
    category: "typography",
    usage: "Màu chủ đạo thương hiệu, viền nút (2px), bóng đổ cơ học (pop shadow)",
    contrastOnWhite: "8.2:1",
    isDarkTextRecommended: false,
  },
  {
    name: "Brown 2",
    token: "--color-brown-2",
    hex: "#8a5a3c",
    tailwindClass: "bg-brown-2",
    textClass: "text-brown-2",
    category: "typography",
    usage: "Nâu ấm thứ cấp cho đoạn văn bản hoặc tiêu đề nhỏ",
    contrastOnWhite: "5.5:1",
    isDarkTextRecommended: false,
  },
  {
    name: "Brown Soft",
    token: "--color-brown-soft",
    hex: "#8f6a55",
    tailwindClass: "bg-brown-soft",
    textClass: "text-brown-soft",
    category: "typography",
    usage: "Chữ phụ chú thích (caption), placeholder, nhãn phụ",
    contrastOnWhite: "4.7:1",
    isDarkTextRecommended: false,
  },

  // Primary Brand Pop
  {
    name: "Butter",
    token: "--color-butter",
    hex: "#fff27a",
    tailwindClass: "bg-butter",
    textClass: "text-brown",
    category: "brand",
    usage: "Màu nút hành động chính (CTA Primary), điểm nhấn năng động",
    contrastOnWhite: "1.2:1",
    isDarkTextRecommended: true,
  },
  {
    name: "Butter 2",
    token: "--color-butter-2",
    hex: "#f6e04d",
    tailwindClass: "bg-butter-2",
    textClass: "text-brown",
    category: "brand",
    usage: "Hover & focus outline ring cho nút và các input",
    contrastOnWhite: "1.4:1",
    isDarkTextRecommended: true,
  },
  {
    name: "Peach",
    token: "--color-peach",
    hex: "#f6d4a6",
    tailwindClass: "bg-peach",
    textClass: "text-brown",
    category: "brand",
    usage: "Màu đào ấm, trạng thái hover của nút soft, badge phụ",
    contrastOnWhite: "1.4:1",
    isDarkTextRecommended: true,
  },
  {
    name: "Peach 2",
    token: "--color-peach-2",
    hex: "#f0b987",
    tailwindClass: "bg-peach-2",
    textClass: "text-brown",
    category: "brand",
    usage: "Cam đào chuyển tiếp, nhãn thời gian và sự kiện",
    contrastOnWhite: "1.7:1",
    isDarkTextRecommended: true,
  },

  // Semantic: Coral (Emergency / Danger)
  {
    name: "Coral",
    token: "--color-coral",
    hex: "#d8503f",
    tailwindClass: "bg-coral",
    textClass: "text-coral",
    category: "semantic",
    usage: "Cứu hộ khẩn cấp SOS, cảnh báo nguy hiểm, nút hành động nguy hiểm",
    contrastOnWhite: "4.6:1",
    isDarkTextRecommended: false,
  },
  {
    name: "Coral Dark",
    token: "--color-coral-dark",
    hex: "#8f2a1c",
    tailwindClass: "bg-coral-dark",
    textClass: "text-coral-dark",
    category: "semantic",
    usage: "Chữ và viền của badge khẩn cấp trên nền coral-soft",
    contrastOnWhite: "8.9:1",
    isDarkTextRecommended: false,
  },
  {
    name: "Coral Soft",
    token: "--color-coral-soft",
    hex: "#fbdcd6",
    tailwindClass: "bg-coral-soft",
    textClass: "text-coral-dark",
    category: "semantic",
    usage: "Nền thẻ badge khẩn cấp, cảnh báo thất lạc",
    contrastOnWhite: "1.3:1",
    isDarkTextRecommended: true,
  },

  // Semantic: Sage (Health / Success)
  {
    name: "Sage",
    token: "--color-sage",
    hex: "#a9cc94",
    tailwindClass: "bg-sage",
    textClass: "text-sage-dark",
    category: "semantic",
    usage: "Xanh xô thơm tự nhiên, dấu tích thành công, đã tìm thấy",
    contrastOnWhite: "1.8:1",
    isDarkTextRecommended: true,
  },
  {
    name: "Sage 2",
    token: "--color-sage-2",
    hex: "#4f7f3e",
    tailwindClass: "bg-sage-2",
    textClass: "text-sage-2",
    category: "semantic",
    usage: "Nút thành công, trạng thái an toàn, đã nhận nuôi",
    contrastOnWhite: "4.8:1",
    isDarkTextRecommended: false,
  },
  {
    name: "Sage Dark",
    token: "--color-sage-dark",
    hex: "#2f5a22",
    tailwindClass: "bg-sage-dark",
    textClass: "text-sage-dark",
    category: "semantic",
    usage: "Chữ và viền của badge sức khỏe tốt, hồ sơ đã xác thực",
    contrastOnWhite: "7.8:1",
    isDarkTextRecommended: false,
  },
  {
    name: "Sage Soft",
    token: "--color-sage-soft",
    hex: "#e3efd8",
    tailwindClass: "bg-sage-soft",
    textClass: "text-sage-dark",
    category: "semantic",
    usage: "Nền badge đã tiêm phòng, đã đoàn tụ thành công",
    contrastOnWhite: "1.2:1",
    isDarkTextRecommended: true,
  },

  // Semantic: Orange (Warning / Active)
  {
    name: "Orange",
    token: "--color-orange",
    hex: "#e8892c",
    tailwindClass: "bg-orange",
    textClass: "text-orange-dark",
    category: "semantic",
    usage: "Cảnh báo điểm đen, ca đang được đội cứu hộ xử lý",
    contrastOnWhite: "2.4:1",
    isDarkTextRecommended: true,
  },
  {
    name: "Orange Dark",
    token: "--color-orange-dark",
    hex: "#8a4a0c",
    tailwindClass: "bg-orange-dark",
    textClass: "text-orange-dark",
    category: "semantic",
    usage: "Chữ và viền trạng thái cảnh báo trên nền orange-soft",
    contrastOnWhite: "7.1:1",
    isDarkTextRecommended: false,
  },
  {
    name: "Orange Soft",
    token: "--color-orange-soft",
    hex: "#fde6c9",
    tailwindClass: "bg-orange-soft",
    textClass: "text-orange-dark",
    category: "semantic",
    usage: "Nền badge đang xử lý hoặc cần thêm người hỗ trợ",
    contrastOnWhite: "1.2:1",
    isDarkTextRecommended: true,
  },

  // Semantic: Sky (Info / Medical / Map)
  {
    name: "Sky",
    token: "--color-sky",
    hex: "#b9dcec",
    tailwindClass: "bg-sky",
    textClass: "text-sky-dark",
    category: "semantic",
    usage: "Màu thông tin chỉ đường, bán kính quét GPS",
    contrastOnWhite: "1.6:1",
    isDarkTextRecommended: true,
  },
  {
    name: "Sky 2",
    token: "--color-sky-2",
    hex: "#3f82a5",
    tailwindClass: "bg-sky-2",
    textClass: "text-sky-2",
    category: "semantic",
    usage: "Icon phòng khám thú y 24/7, trạm xá, bác sĩ",
    contrastOnWhite: "4.7:1",
    isDarkTextRecommended: false,
  },
  {
    name: "Sky Dark",
    token: "--color-sky-dark",
    hex: "#1f5873",
    tailwindClass: "bg-sky-dark",
    textClass: "text-sky-dark",
    category: "semantic",
    usage: "Chữ và viền thông tin điều hướng y tế",
    contrastOnWhite: "8.1:1",
    isDarkTextRecommended: false,
  },
  {
    name: "Sky Soft",
    token: "--color-sky-soft",
    hex: "#e0f0f7",
    tailwindClass: "bg-sky-soft",
    textClass: "text-sky-dark",
    category: "semantic",
    usage: "Nền badge trạm xá và khoảng cách GPS",
    contrastOnWhite: "1.2:1",
    isDarkTextRecommended: true,
  },

  // Semantic: Plum & Pink (Community & Care)
  {
    name: "Plum",
    token: "--color-plum",
    hex: "#8a63ab",
    tailwindClass: "bg-plum",
    textClass: "text-plum-dark",
    category: "semantic",
    usage: "Chuyên mục cộng đồng yêu thú cưng, câu chuyện nhận nuôi",
    contrastOnWhite: "4.8:1",
    isDarkTextRecommended: false,
  },
  {
    name: "Plum Soft",
    token: "--color-plum-soft",
    hex: "#eadff2",
    tailwindClass: "bg-plum-soft",
    textClass: "text-plum-dark",
    category: "semantic",
    usage: "Nền badge danh hiệu tình nguyện viên",
    contrastOnWhite: "1.3:1",
    isDarkTextRecommended: true,
  },
  {
    name: "Pink",
    token: "--color-pink",
    hex: "#f5cfd6",
    tailwindClass: "bg-pink",
    textClass: "text-pink-dark",
    category: "semantic",
    usage: "Nhận nuôi yêu thương, tình cảm gắn kết",
    contrastOnWhite: "1.4:1",
    isDarkTextRecommended: true,
  },
  {
    name: "Pink 2",
    token: "--color-pink-2",
    hex: "#d9788c",
    tailwindClass: "bg-pink-2",
    textClass: "text-pink-2",
    category: "semantic",
    usage: "Nút thả tim, bài viết đã lưu, điểm vinh danh",
    contrastOnWhite: "3.5:1",
    isDarkTextRecommended: false,
  },
]

export default function StyleGuidePage() {
  const { go, toast } = useApp()
  const [activeTab, setActiveTab] = useState<
    "colors" | "typography" | "motion" | "components" | "showcase"
  >("colors")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [copiedItem, setCopiedItem] = useState<string | null>(null)

  // Typography interactive demo state
  const [customBubbleText, setCustomBubbleText] = useState("Happy Paws")
  const [isYellowBubble, setIsYellowBubble] = useState(false)

  // Motion demo triggers
  const [motionKey, setMotionKey] = useState(0)

  // Component demo state
  const [btnPill, setBtnPill] = useState(false)
  const [btnSize, setBtnSize] = useState<"sm" | "md" | "lg">("md")
  const [demoSwitch, setDemoSwitch] = useState(true)
  const [demoCheckbox, setDemoCheckbox] = useState(true)
  const [demoSegment, setDemoSegment] = useState("all")
  const [demoRating, setDemoRating] = useState(4.5)

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    setCopiedItem(text)
    toast(`Đã chép: ${label} (${text})`, "ok")
    setTimeout(() => setCopiedItem(null), 1800)
  }

  const filteredTokens = useMemo(() => {
    return COLOR_TOKENS.filter((t) => {
      const matchCat =
        selectedCategory === "all" || t.category === selectedCategory
      const query = searchQuery.trim().toLowerCase()
      const matchQuery =
        !query ||
        t.name.toLowerCase().includes(query) ||
        t.token.toLowerCase().includes(query) ||
        t.hex.toLowerCase().includes(query) ||
        t.usage.toLowerCase().includes(query)
      return matchCat && matchQuery
    })
  }, [selectedCategory, searchQuery])

  const copyAllCssVariables = () => {
    const cssBlock = COLOR_TOKENS.map((t) => `  ${t.token}: ${t.hex};`).join(
      "\n",
    )
    const result = `:root {\n${cssBlock}\n}`
    navigator.clipboard.writeText(result)
    toast("Đã sao chép toàn bộ biến CSS Design Tokens!", "ok")
  }

  return (
    <div className="min-h-screen bg-cream text-brown pb-24 selection:bg-butter selection:text-brown">
      {/* Top Banner Navigation */}
      <header className="sticky top-0 z-40 border-b-2 border-brown/20 bg-paper/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <Btn
              variant="outline"
              size="sm"
              icon={<ArrowLeft className="size-4" />}
              onClick={() => go("/")}
            >
              Về Trang chủ
            </Btn>
            <div className="h-5 w-px bg-line hidden sm:block" />
            <div className="flex items-center gap-2">
              <Logo onClick={() => go("/")} />
              <Badge tone="butter" className="hidden sm:inline-flex">
                Design System v1.1
              </Badge>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Btn
              variant="secondary"
              size="sm"
              icon={<Code2 className="size-4 text-brown" />}
              onClick={copyAllCssVariables}
            >
              Copy CSS Tokens
            </Btn>
          </div>
        </div>

        {/* Category Navigation Bar */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex gap-2 overflow-x-auto no-scrollbar py-2">
            {[
              { id: "colors", label: "Màu sắc & Tokens", icon: Palette },
              { id: "typography", label: "Kiểu chữ & Bubble", icon: Type },
              { id: "motion", label: "Bóng & Chuyển động", icon: Sparkles },
              { id: "components", label: "Linh kiện UI", icon: Layers },
              { id: "showcase", label: "Giao diện Mẫu", icon: Eye },
            ].map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              return (
                <Btn
                  key={tab.id}
                  variant={isActive ? "primary" : "ghost"}
                  size="sm"
                  pill
                  icon={<Icon className="size-4" />}
                  onClick={() =>
                    setActiveTab(tab.id as typeof activeTab)
                  }
                  className={
                    isActive
                      ? "shadow-sm font-extrabold"
                      : "text-brown-soft hover:text-brown"
                  }
                >
                  {tab.label}
                </Btn>
              )
            })}
          </div>
        </div>
      </header>

      {/* Hero Intro */}
      <section className="mx-auto max-w-7xl px-4 pt-8 pb-6 sm:px-6">
        <div className="rounded-3xl border-2 border-brown bg-paper p-6 sm:p-8 shadow-soft">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="flex items-center gap-2">
                <span className="grid size-9 place-items-center rounded-2xl border-2 border-brown bg-butter text-brown shadow-[0_3px_0_var(--color-brown)]">
                  <Paw className="size-5" />
                </span>
                <span className="text-xs font-black uppercase tracking-wider text-brown-soft">
                  HappyPaw UI Guidelines
                </span>
              </div>
              <h1 className="bubble text-3xl sm:text-5xl text-white">
                BẢNG MÀU & PHONG CÁCH UI
              </h1>
              <p className="text-base font-semibold leading-relaxed text-brown-soft">
                Đặc trưng bởi phong cách <strong>Retro-Warm / Tactile Neo-Brutalist</strong>:
                Bền bỉ, ấm áp như giấy bìa cổ điển, viền nét dứt khoát 2px cùng
                các khối bóng cứng mô phỏng phím bấm cơ học.
              </p>
            </div>

            {/* Quick Metrics Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 shrink-0">
              <div className="rounded-2xl border-2 border-line bg-cream p-3 text-center">
                <p className="font-display text-2xl font-black text-brown">24</p>
                <p className="text-xs font-bold text-brown-soft">Color Tokens</p>
              </div>
              <div className="rounded-2xl border-2 border-line bg-cream p-3 text-center">
                <p className="font-display text-2xl font-black text-coral">8</p>
                <p className="text-xs font-bold text-brown-soft">Button Variants</p>
              </div>
              <div className="rounded-2xl border-2 border-line bg-cream p-3 text-center col-span-2 sm:col-span-1">
                <p className="font-display text-2xl font-black text-sage-2">AA</p>
                <p className="text-xs font-bold text-brown-soft">WCAG Contrast</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 space-y-12">
        {/* ================= TAB 1: COLORS & TOKENS ================= */}
        {activeTab === "colors" && (
          <section className="space-y-6">
            {/* Filter and Search Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 rounded-2xl border-2 border-line bg-paper p-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-brown-soft" />
                <Input
                  size="sm"
                  className="pl-9"
                  placeholder="Tìm màu theo tên, mã hex, hoặc công dụng..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="flex flex-wrap items-center gap-1.5">
                {[
                  { id: "all", label: "Tất cả (24)" },
                  { id: "canvas", label: "Nền & Khung" },
                  { id: "typography", label: "Chữ & Viền" },
                  { id: "brand", label: "Thương hiệu" },
                  { id: "semantic", label: "Ngữ nghĩa cứu hộ" },
                ].map((cat) => (
                  <Chip
                    key={cat.id}
                    active={selectedCategory === cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                  >
                    {cat.label}
                  </Chip>
                ))}
              </div>
            </div>

            {/* Color Swatch Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredTokens.map((c) => {
                const isCopied = copiedItem === c.hex || copiedItem === c.token
                return (
                  <div
                    key={c.token}
                    className="flex flex-col justify-between rounded-2xl border-2 border-brown bg-paper p-4 shadow-soft transition hover:-translate-y-1 hover:shadow-pop"
                  >
                    <div className="space-y-3">
                      {/* Swatch Display */}
                      <div
                        className="relative h-28 w-full rounded-xl border-2 border-brown flex items-end justify-between p-3 overflow-hidden shadow-inner"
                        style={{ backgroundColor: c.hex }}
                      >
                        <span
                          className={`text-xs font-black uppercase tracking-wider px-2 py-0.5 rounded-md ${
                            c.isDarkTextRecommended
                              ? "bg-brown text-cream"
                              : "bg-paper text-brown"
                          }`}
                        >
                          {c.hex}
                        </span>

                        <span
                          className={`text-[11px] font-extrabold px-1.5 py-0.5 rounded ${
                            c.isDarkTextRecommended
                              ? "bg-brown/10 text-brown"
                              : "bg-white/20 text-white"
                          }`}
                        >
                          Tương phản: {c.contrastOnWhite}
                        </span>
                      </div>

                      {/* Token Details */}
                      <div>
                        <div className="flex items-center justify-between">
                          <h3 className="font-display text-lg font-black text-brown">
                            {c.name}
                          </h3>
                          <Badge tone="brown" className="text-[10px]">
                            {c.category}
                          </Badge>
                        </div>
                        <code className="text-xs font-bold text-brown-soft block mt-0.5">
                          {c.token}
                        </code>
                        <p className="mt-2 text-xs font-semibold leading-relaxed text-brown-2">
                          {c.usage}
                        </p>
                      </div>
                    </div>

                    {/* Copy Buttons */}
                    <div className="mt-4 pt-3 border-t border-line flex gap-2">
                      <Btn
                        variant="secondary"
                        size="sm"
                        className="flex-1 text-xs"
                        icon={
                          isCopied ? (
                            <Check className="size-3.5 text-sage-2" />
                          ) : (
                            <Copy className="size-3.5" />
                          )
                        }
                        onClick={() => copyToClipboard(c.hex, `HEX ${c.name}`)}
                      >
                        HEX
                      </Btn>
                      <Btn
                        variant="outline"
                        size="sm"
                        className="flex-1 text-xs"
                        onClick={() =>
                          copyToClipboard(
                            `var(${c.token})`,
                            `CSS Var ${c.name}`,
                          )
                        }
                      >
                        var()
                      </Btn>
                    </div>
                  </div>
                )
              })}
            </div>

            {filteredTokens.length === 0 && (
              <Empty
                title="Không tìm thấy token nào"
                body="Hãy thử từ khóa khác như 'coral', 'butter', 'cream'..."
                cta="Hiện tất cả"
                onCta={() => {
                  setSearchQuery("")
                  setSelectedCategory("all")
                }}
              />
            )}
          </section>
        )}

        {/* ================= TAB 2: TYPOGRAPHY ================= */}
        {activeTab === "typography" && (
          <section className="space-y-8">
            {/* Fonts Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="space-y-3">
                <div className="flex items-center justify-between">
                  <Badge tone="butter">Headline Display</Badge>
                  <code className="text-xs font-bold text-brown-soft">
                    var(--font-display)
                  </code>
                </div>
                <h3 className="font-display text-3xl font-extrabold text-brown">
                  Baloo 2
                </h3>
                <p className="text-sm font-semibold text-brown-soft leading-relaxed">
                  Phông chữ hiển thị tiêu đề chính, đậm tính hoạt họa, nét bo tròn
                  thân thiện, chuyên dùng cho các thông điệp lớn và số liệu nổi bật.
                </p>
                <div className="rounded-xl border border-line bg-cream p-3 text-brown">
                  <p className="font-display font-extrabold text-xl">
                    Cứu hộ thú cưng 24/7 tại Thủ đô Hà Nội
                  </p>
                </div>
              </Card>

              <Card className="space-y-3">
                <div className="flex items-center justify-between">
                  <Badge tone="sage">Body Sans</Badge>
                  <code className="text-xs font-bold text-brown-soft">
                    var(--font-sans)
                  </code>
                </div>
                <h3 className="text-3xl font-extrabold text-brown">Nunito</h3>
                <p className="text-sm font-semibold text-brown-soft leading-relaxed">
                  Phông chữ nội dung chính, có bo góc nhẹ tạo cảm giác ấm áp, tối
                  ưu độ tương phản và khả năng đọc nhanh trên giao diện di động.
                </p>
                <div className="rounded-xl border border-line bg-cream p-3 text-brown">
                  <p className="font-semibold text-sm leading-relaxed">
                    Nền tảng kết nối trực tiếp cộng đồng với các trạm cứu hộ phi lợi
                    nhuận và phòng khám thú y gần nhất.
                  </p>
                </div>
              </Card>
            </div>

            {/* Bubble Text Live Generator */}
            <Card className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="font-display text-xl font-black text-brown">
                    Trình thử nghiệm hiệu ứng .bubble
                  </h3>
                  <p className="text-xs font-semibold text-brown-soft">
                    Hiệu ứng viền chữ socola đậm bằng kỹ thuật webkit-text-stroke
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <Toggle
                    label="Màu vàng bơ"
                    on={isYellowBubble}
                    onChange={setIsYellowBubble}
                  />
                </div>
              </div>

              <Field label="Nhập nội dung tiêu đề thử nghiệm">
                <Input
                  value={customBubbleText}
                  onChange={(e) => setCustomBubbleText(e.target.value)}
                  placeholder="Gõ tiêu đề bất kỳ..."
                />
              </Field>

              <div className="rounded-2xl border-2 border-brown bg-brown/90 p-8 text-center flex items-center justify-center min-h-[140px] overflow-hidden">
                <span
                  className={`bubble text-3xl sm:text-5xl md:text-6xl ${
                    isYellowBubble ? "bubble-yellow" : ""
                  }`}
                >
                  {customBubbleText || "Happy Paws"}
                </span>
              </div>
            </Card>

            {/* Hierarchy Scale */}
            <Card className="space-y-4">
              <h3 className="font-display text-xl font-black text-brown">
                Hệ thống Cấp bậc Tiêu đề (Hierarchy Scale)
              </h3>
              <div className="space-y-4 divide-y divide-line">
                <div className="pt-3 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                  <span className="bubble text-4xl text-white">
                    H1: TIÊU ĐỀ CHÍNH
                  </span>
                  <span className="text-xs font-bold text-brown-soft shrink-0">
                    Baloo 2 36-40px / font-black
                  </span>
                </div>
                <div className="pt-3 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                  <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-brown">
                    H2: Tiêu đề Mục lớn
                  </h2>
                  <span className="text-xs font-bold text-brown-soft shrink-0">
                    Baloo 2 28-32px / font-extrabold
                  </span>
                </div>
                <div className="pt-3 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                  <h3 className="font-display text-xl font-bold text-brown">
                    H3: Tiêu đề Thẻ nội dung
                  </h3>
                  <span className="text-xs font-bold text-brown-soft shrink-0">
                    Baloo 2 20-22px / font-bold
                  </span>
                </div>
                <div className="pt-3 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                  <p className="text-base font-bold text-brown">
                    Body Regular: Đoạn văn bản thuyết minh và ghi chú hướng dẫn
                  </p>
                  <span className="text-xs font-bold text-brown-soft shrink-0">
                    Nunito 16px / font-bold
                  </span>
                </div>
                <div className="pt-3 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                  <p className="text-xs font-semibold text-brown-soft">
                    Caption: Nhãn phụ, thời gian đăng, khoảng cách địa lý km
                  </p>
                  <span className="text-xs font-bold text-brown-soft shrink-0">
                    Nunito 12px / font-semibold
                  </span>
                </div>
              </div>
            </Card>
          </section>
        )}

        {/* ================= TAB 3: MOTION & EFFECTS ================= */}
        {activeTab === "motion" && (
          <section className="space-y-8">
            {/* Tactile Pop Shadow Showcase */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-lg font-black text-brown">
                    Tactile Pop Shadow
                  </h3>
                  <Badge tone="butter">--shadow-pop</Badge>
                </div>
                <p className="text-sm font-semibold text-brown-soft leading-relaxed">
                  Bóng cứng dứt khoát không nhòe, tạo hiệu ứng nổi khối 3D xúc giác
                  giống phím bấm đồ chơi cơ học.
                </p>
                <div className="flex items-center justify-center p-6 bg-cream rounded-2xl border-2 border-line">
                  <div className="rounded-2xl border-2 border-brown bg-butter px-6 py-3 font-extrabold text-brown shadow-[0_4px_0_var(--color-brown)]">
                    shadow-[0_4px_0_var(--color-brown)]
                  </div>
                </div>
              </Card>

              <Card className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-lg font-black text-brown">
                    Soft Elevation Shadow
                  </h3>
                  <Badge tone="sage">--shadow-soft</Badge>
                </div>
                <p className="text-sm font-semibold text-brown-soft leading-relaxed">
                  Bóng mềm pha nâu ấm dành cho các Card lớn, Modal và bảng danh mục
                  cần cảm giác nhẹ nhàng, bồng bềnh.
                </p>
                <div className="flex items-center justify-center p-6 bg-cream rounded-2xl border-2 border-line">
                  <div className="rounded-2xl border-2 border-line bg-paper px-6 py-3 font-extrabold text-brown shadow-soft">
                    Bóng mềm tự nhiên (shadow-soft)
                  </div>
                </div>
              </Card>
            </div>

            {/* Corner Radii Matrix */}
            <Card className="space-y-4">
              <h3 className="font-display text-xl font-black text-brown">
                Hệ thống Bo góc (Corner Radii)
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="rounded-xl border-2 border-brown bg-cream p-4 text-center">
                  <p className="font-bold text-sm">rounded-xl</p>
                  <p className="text-xs text-brown-soft">12px (Inputs, Chips)</p>
                </div>
                <div className="rounded-2xl border-2 border-brown bg-cream p-4 text-center">
                  <p className="font-bold text-sm">rounded-2xl</p>
                  <p className="text-xs text-brown-soft">16px (Buttons, Cards)</p>
                </div>
                <div className="rounded-3xl border-2 border-brown bg-cream p-4 text-center">
                  <p className="font-bold text-sm">rounded-3xl</p>
                  <p className="text-xs text-brown-soft">24px (Modals, Hero)</p>
                </div>
                <div className="rounded-full border-2 border-brown bg-cream p-4 text-center">
                  <p className="font-bold text-sm">rounded-full</p>
                  <p className="text-xs text-brown-soft">9999px (Pills, Badges)</p>
                </div>
              </div>
            </Card>

            {/* Keyframe Animations Interactive */}
            <Card className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-display text-xl font-black text-brown">
                    Hoạt ảnh Chuyển động (Keyframe Animations)
                  </h3>
                  <p className="text-xs font-semibold text-brown-soft">
                    Nhấn nút Kích hoạt lại để xem chuyển động trực tiếp
                  </p>
                </div>
                <Btn
                  variant="outline"
                  size="sm"
                  icon={<Play className="size-3.5" />}
                  onClick={() => setMotionKey((k) => k + 1)}
                >
                  Kích hoạt lại
                </Btn>
              </div>

              <div
                key={motionKey}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
              >
                {/* Bounce Soft */}
                <div className="flex flex-col items-center justify-center p-6 rounded-2xl border-2 border-line bg-cream gap-3 text-center">
                  <div className="size-14 rounded-2xl border-2 border-brown bg-butter grid place-items-center animate-bounce-soft shadow-pop">
                    <Paw className="size-7 text-brown" />
                  </div>
                  <div>
                    <p className="font-extrabold text-sm text-brown">
                      bounce-soft
                    </p>
                    <p className="text-[11px] text-brown-soft">
                      Nhún nhảy chậm rãi 1.6s
                    </p>
                  </div>
                </div>

                {/* Pop */}
                <div className="flex flex-col items-center justify-center p-6 rounded-2xl border-2 border-line bg-cream gap-3 text-center">
                  <div className="size-14 rounded-2xl border-2 border-brown bg-coral grid place-items-center animate-[pop_.4s_cubic-bezier(0.3,1.5,0.5,1)_both] shadow-pop text-white">
                    <Heart className="size-7 fill-white" />
                  </div>
                  <div>
                    <p className="font-extrabold text-sm text-brown">pop</p>
                    <p className="text-[11px] text-brown-soft">
                      Nảy bung đàn hồi 0.28s
                    </p>
                  </div>
                </div>

                {/* Rise */}
                <div className="flex flex-col items-center justify-center p-6 rounded-2xl border-2 border-line bg-cream gap-3 text-center">
                  <div className="size-14 rounded-2xl border-2 border-brown bg-sage-2 grid place-items-center animate-[rise_.35s_ease-out_both] shadow-pop text-white">
                    <CheckCircle2 className="size-7" />
                  </div>
                  <div>
                    <p className="font-extrabold text-sm text-brown">rise</p>
                    <p className="text-[11px] text-brown-soft">
                      Trượt lên nhẹ nhàng 0.3s
                    </p>
                  </div>
                </div>

                {/* Pulse Ring */}
                <div className="flex flex-col items-center justify-center p-6 rounded-2xl border-2 border-line bg-cream gap-3 text-center">
                  <div className="relative size-14 grid place-items-center">
                    <div className="absolute inset-0 rounded-full bg-coral animate-ping opacity-60" />
                    <div className="size-10 rounded-full border-2 border-brown bg-coral grid place-items-center text-white relative z-10">
                      <MapPin className="size-5" />
                    </div>
                  </div>
                  <div>
                    <p className="font-extrabold text-sm text-brown">
                      pulse-ring
                    </p>
                    <p className="text-[11px] text-brown-soft">
                      Định vị GPS khẩn cấp
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </section>
        )}

        {/* ================= TAB 4: UI COMPONENTS ================= */}
        {activeTab === "components" && (
          <section className="space-y-10">
            {/* Buttons Showcase */}
            <Card className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-line pb-4">
                <div>
                  <h3 className="font-display text-xl font-black text-brown">
                    Nút bấm: &lt;Btn&gt; & &lt;IconBtn&gt;
                  </h3>
                  <p className="text-xs font-semibold text-brown-soft">
                    Tích hợp đổ bóng 3D, hiệu ứng ấn lún vật lý (active:translate-y-1)
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <Toggle
                    label="Bo tròn (Pill)"
                    on={btnPill}
                    onChange={setBtnPill}
                  />
                  <div className="flex items-center gap-1">
                    {(["sm", "md", "lg"] as const).map((s) => (
                      <Chip
                        key={s}
                        active={btnSize === s}
                        onClick={() => setBtnSize(s)}
                      >
                        {s.toUpperCase()}
                      </Chip>
                    ))}
                  </div>
                </div>
              </div>

              {/* Button Variants Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <span className="text-xs font-bold text-brown-soft">
                    primary (CTA chính)
                  </span>
                  <Btn variant="primary" size={btnSize} pill={btnPill} full>
                    Lưu báo cáo
                  </Btn>
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-bold text-brown-soft">
                    secondary (Thứ cấp)
                  </span>
                  <Btn variant="secondary" size={btnSize} pill={btnPill} full>
                    Xem chi tiết
                  </Btn>
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-bold text-brown-soft">
                    danger (Khẩn cấp / SOS)
                  </span>
                  <Btn variant="danger" size={btnSize} pill={btnPill} full>
                    Báo nguy cấp
                  </Btn>
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-bold text-brown-soft">
                    success (Thành công)
                  </span>
                  <Btn variant="success" size={btnSize} pill={btnPill} full>
                    Đã đoàn tụ
                  </Btn>
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-bold text-brown-soft">
                    dark (Tương phản cao)
                  </span>
                  <Btn variant="dark" size={btnSize} pill={btnPill} full>
                    Trang quản trị
                  </Btn>
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-bold text-brown-soft">
                    outline (Viền nhạt)
                  </span>
                  <Btn variant="outline" size={btnSize} pill={btnPill} full>
                    Hủy bỏ
                  </Btn>
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-bold text-brown-soft">
                    soft (Nền kem nhạt)
                  </span>
                  <Btn variant="soft" size={btnSize} pill={btnPill} full>
                    Tùy chọn phụ
                  </Btn>
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-bold text-brown-soft">
                    ghost (Trong suốt)
                  </span>
                  <Btn variant="ghost" size={btnSize} pill={btnPill} full>
                    Bỏ qua
                  </Btn>
                </div>
              </div>

              {/* Icon Buttons Matrix */}
              <div className="pt-4 border-t border-line space-y-3">
                <span className="text-xs font-bold text-brown-soft">
                  Icon Buttons &lt;IconBtn&gt; (Bắt buộc thuộc tính label cho trợ năng WCAG)
                </span>
                <div className="flex flex-wrap items-center gap-3">
                  <IconBtn label="Thả tim" variant="default" size="md">
                    <Heart className="size-5 text-coral" />
                  </IconBtn>
                  <IconBtn label="Gọi điện" variant="primary" size="md">
                    <Phone className="size-5" />
                  </IconBtn>
                  <IconBtn label="Cảnh báo nguy hiểm" variant="danger" size="md">
                    <ShieldAlert className="size-5 text-white" />
                  </IconBtn>
                  <IconBtn label="Bộ lọc" variant="soft" size="md">
                    <Sliders className="size-5" />
                  </IconBtn>
                  <IconBtn label="Đóng" variant="ghost" size="md">
                    <Clock className="size-5" />
                  </IconBtn>
                </div>
              </div>
            </Card>

            {/* Badges Matrix */}
            <Card className="space-y-4">
              <h3 className="font-display text-xl font-black text-brown">
                Huy hiệu & Trạng thái: &lt;Badge&gt; & &lt;StatusBadge&gt;
              </h3>
              <div className="space-y-3">
                <p className="text-xs font-bold text-brown-soft">
                  Các tông màu nhãn danh mục (tones)
                </p>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge tone="coral">Khẩn cấp (coral)</Badge>
                  <Badge tone="orange">Đang xử lý (orange)</Badge>
                  <Badge tone="butter">Mới đăng (butter)</Badge>
                  <Badge tone="sage">Đã cứu hộ (sage)</Badge>
                  <Badge tone="sky">Trạm xá (sky)</Badge>
                  <Badge tone="pink">Nhận nuôi (pink)</Badge>
                  <Badge tone="plum">Vinh danh (plum)</Badge>
                  <Badge tone="ink">Quản trị (ink)</Badge>
                  <Badge tone="brown">Tiêu chuẩn (brown)</Badge>
                </div>
              </div>

              <div className="space-y-3 pt-3 border-t border-line">
                <p className="text-xs font-bold text-brown-soft">
                  Trạng thái ca thực tế (&lt;StatusBadge&gt;)
                </p>
                <div className="flex flex-wrap items-center gap-2">
                  <StatusBadge status="active" critical={true} type="lost" />
                  <StatusBadge status="active" critical={false} type="lost" />
                  <StatusBadge status="progress" type="rescue" />
                  <StatusBadge status="resolved" type="found" />
                </div>
              </div>
            </Card>

            {/* Form Controls */}
            <Card className="space-y-6">
              <h3 className="font-display text-xl font-black text-brown">
                Biểu mẫu & Nhập liệu (Form Controls)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <Field
                    label="Tên thú cưng hoặc ca cứu hộ"
                    required
                    helper="Ví dụ: Bé Miu vàng bị lạc tại Cầu Giấy"
                  >
                    <Input placeholder="Nhập tiêu đề hoặc tên bé..." />
                  </Field>

                  <Field label="Quận / Huyện tiếp nhận">
                    <Select defaultValue="cau-giay">
                      <option value="cau-giay">Quận Cầu Giấy</option>
                      <option value="dong-da">Quận Đống Đa</option>
                      <option value="ba-dinh">Quận Ba Đình</option>
                      <option value="hai-ba-trung">Quận Hai Bà Trưng</option>
                    </Select>
                  </Field>

                  <Field label="Mô tả đặc điểm nhận dạng">
                    <Textarea
                      placeholder="Màu lông, giới tính, vòng cổ..."
                      rows={3}
                    />
                  </Field>
                </div>

                <div className="space-y-6">
                  {/* Segmented Control */}
                  <div className="space-y-2">
                    <span className="text-sm font-extrabold text-brown">
                      Bộ chuyển tab &lt;Segmented&gt;
                    </span>
                    <Segmented
                      value={demoSegment}
                      onChange={setDemoSegment}
                      options={[
                        { v: "all", label: "Tất cả" },
                        { v: "lost", label: "Tìm thú lạc" },
                        { v: "emergency", label: "Cấp cứu y tế" },
                      ]}
                    />
                  </div>

                  {/* Toggle & Checkbox */}
                  <div className="space-y-3 pt-2">
                    <span className="text-sm font-extrabold text-brown">
                      Công tắc & Hộp kiểm Retro
                    </span>
                    <div className="space-y-3">
                      <Toggle
                        label="Nhận thông báo khi có ca cứu hộ trong phạm vi 3km"
                        on={demoSwitch}
                        onChange={setDemoSwitch}
                      />
                      <Check2
                        on={demoCheckbox}
                        onChange={setDemoCheckbox}
                      >
                        Tôi xác nhận thông tin báo cáo là chính xác
                      </Check2>
                    </div>
                  </div>

                  {/* Rating Stars */}
                  <div className="space-y-2 pt-2">
                    <span className="text-sm font-extrabold text-brown">
                      Đánh giá sao phòng khám &lt;Stars&gt;
                    </span>
                    <div className="flex items-center gap-3">
                      <Stars value={demoRating} onChange={setDemoRating} />
                      <span className="text-sm font-bold text-brown">
                        {demoRating} / 5.0
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Toast Triggers */}
            <Card className="space-y-4">
              <h3 className="font-display text-xl font-black text-brown">
                Hệ thống Thông báo Toast (Toast Host)
              </h3>
              <p className="text-xs font-semibold text-brown-soft">
                Thử nghiệm 4 mức cảnh báo thông điệp người dùng
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <Btn
                  variant="success"
                  size="sm"
                  onClick={() =>
                    toast("Đã lưu thông tin ca cứu hộ thành công!", "ok")
                  }
                >
                  Toast Thành công (ok)
                </Btn>
                <Btn
                  variant="primary"
                  size="sm"
                  onClick={() =>
                    toast("Vui lòng tải ít nhất 1 ảnh hiện trường!", "warn")
                  }
                >
                  Toast Cảnh báo (warn)
                </Btn>
                <Btn
                  variant="danger"
                  size="sm"
                  onClick={() =>
                    toast("Lỗi kết nối máy chủ! Hãy thử lại sau.", "err")
                  }
                >
                  Toast Báo lỗi (err)
                </Btn>
                <Btn
                  variant="secondary"
                  size="sm"
                  onClick={() =>
                    toast("Dữ liệu ca cứu hộ mẫu hiện có tại Hà Nội.", "info")
                  }
                >
                  Toast Thông tin (info)
                </Btn>
              </div>
            </Card>

            {/* Loading & Alert Preview */}
            <Card className="space-y-4">
              <h3 className="font-display text-xl font-black text-brown">
                Trạng thái Tải & Cảnh báo (Loading & Alerts)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3 rounded-2xl border border-line bg-cream p-4">
                  <div className="flex items-center gap-2 text-xs font-bold text-brown-soft">
                    <Info className="size-4 text-sky-2" />
                    <span>Hiệu ứng Skeleton Loading</span>
                  </div>
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>

                <div className="flex flex-col justify-center rounded-2xl border border-line bg-cream p-4">
                  <div className="flex items-center gap-2 text-xs font-bold text-brown-soft mb-2">
                    <AlertCircle className="size-4 text-coral" />
                    <span>Bộ tải trang PageLoader</span>
                  </div>
                  <div className="h-28 overflow-hidden rounded-xl border border-line bg-paper flex items-center justify-center scale-75 origin-center">
                    <PageLoader />
                  </div>
                </div>
              </div>
            </Card>
          </section>
        )}

        {/* ================= TAB 5: SHOWCASE ================= */}
        {activeTab === "showcase" && (
          <section className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Pet Card Preview */}
              <div className="rounded-3xl border-2 border-brown bg-paper p-5 shadow-soft transition hover:-translate-y-1 hover:shadow-pop flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="relative aspect-video w-full rounded-2xl border-2 border-brown bg-cream-2 overflow-hidden flex items-center justify-center">
                    <Paw className="size-16 text-brown/30" />
                    <div className="absolute top-2.5 left-2.5">
                      <Badge tone="coral">SOS KHẨN CẤP</Badge>
                    </div>
                    <div className="absolute bottom-2.5 right-2.5 rounded-lg bg-brown/85 px-2 py-0.5 text-[11px] font-black text-white">
                      Cách 1.2 km
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between">
                      <h4 className="font-display text-lg font-black text-brown">
                        Cún Poodle Nâu Đỏ
                      </h4>
                      <Badge tone="butter">Tìm chủ</Badge>
                    </div>
                    <p className="text-xs font-semibold text-brown-soft mt-1 flex items-center gap-1">
                      <MapPin className="size-3 text-coral" />
                      Công viên Nghĩa Đô, Cầu Giấy
                    </p>
                    <p className="text-xs font-semibold text-brown mt-2 line-clamp-2">
                      Bé bị lạc lúc 17h chiều nay, có đeo vòng cổ da màu cam. Bé
                      hơi nhát nhưng rất hiền.
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-line flex items-center gap-2">
                  <Btn variant="primary" size="sm" className="flex-1">
                    Hỗ trợ tiếp cận
                  </Btn>
                  <IconBtn label="Chia sẻ" variant="default" size="sm">
                    <Send className="size-4" />
                  </IconBtn>
                </div>
              </div>

              {/* Clinic Card Preview */}
              <div className="rounded-3xl border-2 border-brown bg-paper p-5 shadow-soft transition hover:-translate-y-1 hover:shadow-pop flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="grid size-12 place-items-center rounded-2xl border-2 border-brown bg-sky-soft text-sky-dark shrink-0">
                      <ShieldAlert className="size-6" />
                    </div>
                    <div>
                      <h4 className="font-display text-base font-black text-brown">
                        Bệnh Viện Thú Y 24/7 Hà Nội
                      </h4>
                      <div className="flex items-center gap-1 text-xs font-bold text-brown-soft mt-0.5">
                        <Star className="size-3.5 fill-butter text-brown" />
                        <span>4.9 (128 đánh giá)</span>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-xl border border-line bg-cream p-3 text-xs space-y-1 text-brown-soft font-semibold">
                    <p className="flex items-center gap-1.5">
                      <MapPin className="size-3.5 text-coral shrink-0" />
                      <span>Số 45 Chùa Láng, Đống Đa, Hà Nội</span>
                    </p>
                    <p className="flex items-center gap-1.5">
                      <Phone className="size-3.5 text-sage-2 shrink-0" />
                      <span>Cấp cứu: 024 3838 9999</span>
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    <Badge tone="sage">Cấp cứu đêm</Badge>
                    <Badge tone="sky">Phẫu thuật</Badge>
                    <Badge tone="butter">Xe đón tận nơi</Badge>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-line flex items-center gap-2">
                  <Btn variant="secondary" size="sm" className="flex-1">
                    Gọi cấp cứu
                  </Btn>
                  <Btn variant="outline" size="sm">
                    Chỉ đường
                  </Btn>
                </div>
              </div>

              {/* Volunteer Honor Card Preview */}
              <div className="rounded-3xl border-2 border-brown bg-paper p-5 shadow-soft transition hover:-translate-y-1 hover:shadow-pop flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Avatar name="Trần Minh Hằng" tone="pink" size={46} />
                    <div>
                      <h4 className="font-display text-base font-black text-brown">
                        Trần Minh Hằng
                      </h4>
                      <Badge tone="plum" className="mt-0.5">
                        Tình nguyện viên Bạch Kim
                      </Badge>
                    </div>
                  </div>

                  <p className="text-xs font-semibold leading-relaxed text-brown-soft">
                    Đã trực tiếp hỗ trợ 42 ca cứu hộ, tài trợ tạm thời thức ăn
                    và thuốc thú y cho 15 bé mèo sơ sinh.
                  </p>

                  <div className="grid grid-cols-2 gap-2 pt-2">
                    <div className="rounded-xl border border-line bg-cream p-2.5 text-center">
                      <p className="font-display text-lg font-black text-coral">
                        42
                      </p>
                      <p className="text-[11px] font-bold text-brown-soft">
                        Ca giải cứu
                      </p>
                    </div>
                    <div className="rounded-xl border border-line bg-cream p-2.5 text-center">
                      <p className="font-display text-lg font-black text-sage-2">
                        100%
                      </p>
                      <p className="text-[11px] font-bold text-brown-soft">
                        Đánh giá tốt
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-line">
                  <Btn variant="soft" size="sm" full>
                    Xem hồ sơ vinh danh
                  </Btn>
                </div>
              </div>
            </div>

            {/* Design Tokens Handover Cheat Sheet */}
            <Card className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-display text-xl font-black text-brown">
                    Tài liệu Bàn giao Figma / Tailwind v4
                  </h3>
                  <p className="text-xs font-semibold text-brown-soft">
                    Quy tắc thiết kế và cách tra cứu tokens khi lập trình
                  </p>
                </div>
                <Btn
                  variant="outline"
                  size="sm"
                  icon={<Copy className="size-3.5" />}
                  onClick={() => {
                    navigator.clipboard.writeText(
                      `/* HappyPaw Tailwind v4 Design Tokens */\n--color-cream: #fdf3dc;\n--color-paper: #fffaf0;\n--color-brown: #6b4128;\n--color-butter: #fff27a;\n--color-coral: #d8503f;\n--color-sage-2: #4f7f3e;\n--shadow-pop: 0 4px 0 var(--color-brown);`,
                    )
                    toast("Đã sao chép cấu hình cơ sở!", "ok")
                  }}
                >
                  Sao chép tóm tắt
                </Btn>
              </div>

              <div className="rounded-2xl border-2 border-line bg-cream p-4 font-mono text-xs space-y-2 text-brown overflow-x-auto">
                <p className="text-brown-soft">// Quy tắc 1: Luôn dùng biến token thay vì mã hex cứng</p>
                <p>className="bg-paper text-brown border-2 border-brown shadow-pop rounded-2xl"</p>
                <p className="text-brown-soft">// Quy tắc 2: Nút chính CTA luôn dùng bg-butter text-brown</p>
                <p>&lt;Btn variant="primary"&gt;Lưu thay đổi&lt;/Btn&gt;</p>
                <p className="text-brown-soft">// Quy tắc 3: Cảnh báo khẩn cấp luôn dùng coral và coral-soft</p>
                <p>&lt;Badge tone="coral"&gt;Khẩn cấp SOS&lt;/Badge&gt;</p>
              </div>
            </Card>
          </section>
        )}
      </main>
    </div>
  )
}
