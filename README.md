# Happy Paws

Hệ thống kết nối và hỗ trợ cứu trợ thú cưng thời gian thực (React 19 + Vite 8 + Tailwind CSS v4).

## Cấu trúc thư mục

```
src/
├── types/          # TypeScript types tập trung (case, place, user, map, admin, report)
├── constants/      # Hằng số, mock data & định nghĩa vị trí quận huyện
├── lib/            # Pure utilities (cx, parsePath)
├── config/         # App configuration & biến môi trường
├── services/       # Service layer trừu tượng hóa API (hỗ trợ switch Mock/Backend)
├── store/          # Global state theo slice (Auth, Nav, Cases, UI) & composer AppProvider
├── hooks/          # Custom hooks tái sử dụng (useMedia, useDebounce, useLocalStorage)
├── components/
│   ├── ui/         # Primitive UI components (Brand, Button, Card, Badge, Modal, Toast...)
│   └── common/     # Domain components dùng chung (CaseCard...)
├── features/       # Modular features theo domain nghiệp vụ
│   ├── landing/    # Landing page & giới thiệu nền tảng
│   ├── user/       # Luồng người dùng (Auth, Explorer, Find, Báo cáo cứu hộ, Caseflow)
│   ├── community/  # Cộng đồng (Hub, Trạm cứu hộ, Phòng khám, Đóng góp, An toàn)
│   ├── admin/      # Trung tâm quản trị (Dashboard, Quản lý case, Users, Bản đồ, Báo cáo vi phạm)
│   └── map/        # Bản đồ cứu trợ thời gian thực (MapEngine & MapUI)
└── layouts/        # Shell layouts (UserShell)
```

## Thiết lập Môi trường

Sao chép file `.env.example` thành `.env` nếu cần điều chỉnh cấu hình kết nối API:

```bash
# URL của Backend API (khi không dùng mock data)
VITE_API_BASE_URL=http://localhost:3000/api

# Bật/tắt chế độ Mock data (mặc định: true)
VITE_USE_MOCK=true
```

## Lệnh phát triển & Build

```bash
# Chạy development server
npm run dev

# Kiểm tra kiểu TypeScript
npx tsc --noEmit

# Build production bundle
npm run build
```

## Tài khoản thử nghiệm

| Vai trò | Email | Mật khẩu mẫu |
| :--- | :--- | :--- |
| **Người dùng / Tình nguyện viên** | `linh.pham@happypaws.vn` | `123456` |
| **Quản trị viên (Admin)** | `admin@happypaws.vn` | `123456` |

> **Lưu ý**: Trong chế độ Mock (`VITE_USE_MOCK=true`), hệ thống chấp nhận bất kỳ mật khẩu nào từ 6 ký tự trở lên.
