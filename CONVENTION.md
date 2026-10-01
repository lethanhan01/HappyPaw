# HappyPaw — Quy Chuẩn Kỹ Thuật Giao Diện & Design System (CONVENTION.md)

> **Tài liệu Bắt buộc Tuân thủ (Normative Standard)**  
> Áp dụng cho: Toàn bộ lập trình viên frontend, pull requests và các thành phần giao diện trong hệ thống HappyPaw.  
> Phiên bản: 1.1.0 — Cập nhật lần cuối: 2026-10-01.

---

## Mục Lục
1. [Triết Lý Thiết Kế Retro-Warm & Quy Tắc Cốt Lõi](#1-triết-lý-thiết-kế-retro-warm--quy-tắc-cốt-lõi)
2. [Bảng Cấm & Ánh Xạ Chuyển Đổi (Ban & Migration Matrix)](#2-bảng-cấm--ánh-xạ-chuyển-đổi-ban--migration-matrix)
3. [Từ Điển Toàn Diện UI Primitives (`@ui`)](#3-từ-điển-toàn-diện-ui-primitives-ui)
4. [Hệ Thống Design Tokens, Typography & Utility Classes](#4-hệ-thống-design-tokens-typography--utility-classes)
5. [Quy Chuẩn Cấu Trúc Dự Án & Import Aliases](#5-quy-chuẩn-cấu-trúc-dự-án--import-aliases)
6. [Hướng Dẫn Trợ Năng (WCAG 2.1 AA) & Responsive Mobile-First](#6-hướng-dẫn-trợ-năng-wcag-21-aa--responsive-mobile-first)
7. [Các Mẫu Code Thực Chiến (Do vs Don't Examples)](#7-các-mẫu-code-thực-chiến-do-vs-dont-examples)
8. [Quy Trình Đóng Góp & Mở Rộng UI Primitives](#8-quy-trình-đóng-góp--mở-rộng-ui-primitives)
9. [Script Linter Tự Động & Pipeline Tích Hợp](#9-script-linter-tự-động--pipeline-tích-hợp)
10. [Checklist Đánh Giá Code Dành Cho Reviewer (PR Checklist)](#10-checklist-đánh-giá-code-dành-cho-reviewer-pr-checklist)

---

## 1. Triết Lý Thiết Kế Retro-Warm & Quy Tắc Cốt Lõi

Hệ thống HappyPaw được định vị theo phong cách **Retro-Warm**: Ấm áp, vui tươi, giàu tính nhân văn nhưng đồng thời chặt chẽ, giàu tính xúc giác (tactile feedback) và hiện đại. Điểm nhấn thị giác là các đường viền nâu đậm nét (`border-brown`), đổ bóng nổi khối 3D giả lập phím bấm cơ học (`shadow-[0_4px_0_var(--color-brown)]`), hiệu ứng bấm lún vật lý, và các gam màu kem, bơ, san hô, lá cây dịu mắt.

### ⛔ Quy Tắc Bất Biến 1: ZERO RAW UI ELEMENTS
1. **Tuyệt đối CẤM sử dụng raw HTML elements** cho tương tác hoặc hiển thị tại toàn bộ các màn hình tính năng (`src/features/`), layouts (`src/layouts/`), components dùng chung (`src/components/common/`) và root `App.tsx`:
   - ❌ `<button>` ➔ Bắt buộc dùng `<Btn>` hoặc `<IconBtn>`.
   - ❌ `<input>` ➔ Bắt buộc dùng `<Input>` hoặc `<Check2>`.
   - ❌ `<select>` ➔ Bắt buộc dùng `<Select>`.
   - ❌ `<textarea>` ➔ Bắt buộc dùng `<Textarea>`.
   - ❌ `<input type="checkbox">` ➔ Bắt buộc dùng `<Check2>`.
   - ❌ Custom toggle `<div>` ➔ Bắt buộc dùng `<Toggle>`.
   - ❌ Custom badge/pill `<span>` ➔ Bắt buộc dùng `<Badge>`, `<StatusBadge>`, `<Verified>`, `<MatchBadge>`, `<WarnBadge>`.
   - ❌ Custom modal overlay ➔ Bắt buộc dùng `<Modal>` hoặc `<BottomSheet>`.
   - ❌ Custom card container ➔ Bắt buộc dùng `<Card>`.
2. **Phân Định Ranh Giới Rõ Ràng Cho Tầng `@ui` (`src/components/ui/`)**:
   - Thư viện `@ui` là **tầng gốc (primitives layer)** duy nhất trong dự án được phép chứa các thẻ native elements (`<button>`, `<input>`, `<select>`, `<textarea>`) nhằm mục đích cấu tạo nên component primitive cơ sở (như `Button.tsx`, `Form.tsx`) hoặc các tương tác chuyên biệt micro-interaction (như bộ chọn sao `<Stars>`, vùng tải tệp `<UploadBox>`).
   - Các composite components bên trong `@ui` (như `<Modal>`, `<PageHead>`) vẫn bắt buộc phải tái sử dụng các primitives `<IconBtn>`, `<Btn>` có sẵn, không được tự ý viết lại raw button ad-hoc.

### ⛔ Quy Tắc Bất Biến 2: CẤM THƯ VIỆN UI BÊN NGOÀI
- ❌ Tuyệt đối CẤM cài đặt hoặc import từ `@mui/material`, `antd`, `@chakra-ui/react`, `@radix-ui/*`, `@headlessui/react`, `shadcn`.
- ✔ Chỉ sử dụng các components được đóng gói trong `@ui` (`src/components/ui/`), các components dùng chung trong `src/components/common/` và icon từ `lucide-react`.

### ⛔ Quy Tắc Bất Biến 3: CẤM MÃ MÀU HEX TÙY TIỆN TRONG CLASSNAME
- ❌ Tuyệt đối CẤM viết mã màu hex tùy tiện trong JSX className (ví dụ: `text-[#8f2a1c]`, `bg-[#efe5c4]`, `border-[#123456]`, `hover:bg-[#bd3f2f]`).
- ✔ Mọi màu sắc hiển thị, chữ, viền, nền, đổ bóng bắt buộc phải sử dụng các Design Tokens đã được định nghĩa tập trung trong `@theme` tại file [src/index.css](file:///c:/Users/An/Documents/GitHub/HappyPaw/src/index.css) (ví dụ: `text-coral-dark`, `text-sage-dark`, `bg-map-sand`, `hover:bg-coral-hover`).

### ⛔ Quy Tắc Bất Biến 4: ZERO RAW EMOJIS & THỐNG NHẤT ICON HỆ THỐNG
- ❌ Tuyệt đối CẤM chèn emoji hệ thống trực tiếp (`🚨`, `🔍`, `🐾`, `✨`, `💰`, `📦`, `🔴`, `🟢`, `🟡`, `⚠️`, `🐶`, `🐱`...) vào mã nguồn JSX, chuỗi hiển thị, tiêu đề, nút bấm hay thông báo toast.
  - *Lý do*: Emoji hệ điều hành (Apple, Windows, Android) hiển thị màu sắc và đường nét lệch lạc, không đồng nhất với phong cách Retro-Warm của HappyPaw, gây cảm giác lộn xộn, thiếu chuyên nghiệp và giảm thẩm mỹ chung.
- ✔ Bắt buộc 100% biểu tượng phải sử dụng từ thư viện vector chuẩn:
  - Thư viện icon chính thức: **`lucide-react`** (stroke đồng nhất 2px, kích thước chuẩn Tailwind `size-*`).
  - Biểu tượng thương hiệu: Component vector nội bộ `<Paw />`, `<Logo />` từ `@ui`.
  - Trạng thái màu sắc (xanh/đỏ/vàng): Dùng CSS dot indicator (`<span className="size-2 rounded-full bg-coral inline-block" />`) thay vì emoji hình tròn (`🔴`, `🟢`, `🟡`).

---

## 2. Bảng Cấm & Ánh Xạ Chuyển Đổi (Ban & Migration Matrix)

Bảng tra cứu nhanh giúp lập trình viên chuyển đổi code vi phạm sang chuẩn HappyPaw:

| Thẻ Raw Bị Cấm | Tác Vụ Thường Gặp | Component `@ui` Chuẩn | Cách Sử Dụng Chuẩn |
|---|---|---|---|
| `<button>Text</button>` | Nút bấm hành động (Lưu, Gửi, Hủy, SOS) | `<Btn>` | `<Btn variant="primary" size="md">Lưu</Btn>` |
| `<button><Icon /></button>` | Nút bấm chỉ chứa icon (Đóng, Back, Menu, Kebab) | `<IconBtn>` | `<IconBtn label="Đóng cửa sổ" size="sm"><X /></IconBtn>` |
| `<input type="text">` | Ô nhập văn bản, tìm kiếm, số điện thoại | `<Input>` | `<Input size="md" placeholder="Nhập tên..." />` |
| `<select>` | Dropdown chọn quận, trạng thái, phân loại | `<Select>` | `<Select size="sm"><option>Quận 1</option></Select>` |
| `<textarea>` | Nhập mô tả, ghi chú chi tiết | `<Textarea>` | `<Textarea size="md" placeholder="Mô tả..." />` |
| `<input type="checkbox">` | Checkbox đồng ý điều khoản, chọn mục | `<Check2>` | `<Check2 on={val} onChange={setVal}>Nhãn</Check2>` |
| Custom switch `<div>` | Bật/tắt thông báo, chế độ định vị | `<Toggle>` | `<Toggle on={on} onChange={setOn} label="Bật GPS" />` |
| Custom pill `<span>` | Nhãn trạng thái, phân loại | `<Badge>` | `<Badge tone="coral">Khẩn cấp</Badge>` |
| Custom status tag | Trạng thái ca cứu hộ | `<StatusBadge>` | `<StatusBadge status={c.status} critical={c.critical} />` |
| Custom card `<div>` | Hộp thẻ nội dung có viền/bóng | `<Card>` | `<Card hover onClick={handleClick}>...</Card>` |
| Custom avatar `<img>` | Vòng tròn đại diện người dùng | `<Avatar>` / `<UserAvatar>` | `<UserAvatar id={user.id} size={36} />` |
| Custom modal `<div>` | Hộp thoại xác nhận, form popup | `<Modal>` | `<Modal open={isOpen} onClose={handleClose}>...</Modal>` |
| Custom sheet `<div>` | Bảng điều khiển vuốt dưới mobile | `<BottomSheet>` | `<BottomSheet snap={snap} onSnap={setSnap} header={...}>...</BottomSheet>` |
| Tab filter buttons | Bộ chuyển đổi tab (Mới / Đang xử lý) | `<Segmented>` | `<Segmented value={tab} onChange={setTab} options={[...]} />` |
| Tag filter buttons | Nút tag lọc danh mục (Chó, Mèo...) | `<Chip>` | `<Chip active={isDog} onClick={toggle}>Chó</Chip>` |
| File upload `<div>` | Vùng kéo thả ảnh / video hiện trường | `<UploadBox>` | `<UploadBox label="Tải ảnh" files={f} onChange={setF} />` |
| Star ratings `<span>` | Đánh giá sao trạm / phòng khám | `<Stars>` | `<Stars value={rating} onChange={setRating} />` |
| Empty container `<div>` | Trạng thái không có dữ liệu | `<Empty>` | `<Empty title="Không có ca nào" cta="Tạo mới" onCta={...} />` |
| Skeleton placeholder | Hiệu ứng tải trang (shimmer loading) | `<Skeleton>` | `<Skeleton className="h-24 w-full" />` |
| Error container `<div>` | Màn hình báo lỗi kết nối có nút thử lại | `<ErrorState>` | `<ErrorState onRetry={fetchData} />` |
| Success banner `<div>` | Màn hình hoàn thành có hiệu ứng pháo hoa | `<SuccessScreen>` | `<SuccessScreen title="Đã gửi báo cáo thành công!" />` |
| Page header `<div>` | Tiêu đề đầu trang + nút quay lại | `<PageHead>` | `<PageHead title="Chi tiết ca" back={goBack} />` |
| Multi-step flow | Thanh tiến trình các bước biểu mẫu | `<Stepper>` | `<Stepper steps={['Thông tin', 'Vị trí', 'Xác nhận']} current={step} />` |
| Callout note `<div>` | Hộp cảnh báo / chú thích nghiệp vụ | `<Note>` | `<Note tone="butter">Lưu ý khi tiếp cận bé...</Note>` |
| App Logo / Identity | Biểu tượng móng vuốt và thương hiệu | `<Logo>` / `<Paw>` | `<Logo onClick={() => go('/home')} />` |
| Raw Emojis (`🚨`, `🔍`, `🐾`, `✨`...) | Biểu tượng trang trí, nút bấm, thông báo | SVG Icon từ `lucide-react` / CSS dot | `<Btn icon={<Siren className="size-4" />}>SOS</Btn>` |

---

## 3. Từ Điển Toàn Diện UI Primitives (`@ui`)

Tất cả các thành phần giao diện nền tảng được import trực tiếp qua alias:
```tsx
import { Btn, IconBtn, Card, Badge, Field, Input, Select, Modal, Stepper, Skeleton, ErrorState, SuccessScreen } from '@ui'
```

### 3.1. Nút Bấm: `Btn` & `IconBtn` (`src/components/ui/Button.tsx`)

#### `<Btn>`
Component nút hành động chính, tích hợp hiệu ứng đổ bóng 3D cơ học `shadow-[0_4px_0_var(--color-brown)]` và hiệu ứng bấm lún vật lý `active:translate-y-1 active:shadow-none`.
- **Props**:
  - `variant`:
    - `'primary'`: Vàng bơ năng động, viền nâu, bóng nâu (Hành động chính, CTA). Mặc định.
    - `'secondary'`: Trắng ngà, viền nâu, bóng nâu (Hành động phụ).
    - `'soft'`: Nền kem pastel nhẹ, hover đổi màu kem đào.
    - `'danger'`: Đỏ san hô, viền nâu, bóng nâu (SOS, khẩn cấp, hành động nguy hiểm).
    - `'dark'`: Nâu đen mực đậm, chữ trắng (Admin, thanh điều hướng).
    - `'outline'`: Trắng ngà, viền nâu nhạt `border-line` (Bộ lọc bảng, thao tác phụ).
    - `'ghost'`: Trong suốt không viền (Nút icon trong văn bản, tab di động).
  - `size`: `'sm'` (`h-9 text-sm`) | `'md'` (`h-11 text-[15px]`, mặc định) | `'lg'` (`h-14 text-lg`).
  - `pill?: boolean`: Bo tròn hoàn toàn dạng viên thuốc (`rounded-full`), mặc định là bo mềm `rounded-2xl`.
  - `full?: boolean`: Chiếm 100% chiều rộng container (`w-full`).
  - `icon?: ReactNode`: Icon đặt ở bên trái nhãn nút.
- **Ví dụ**:
  ```tsx
  <Btn variant="primary" size="md" icon={<Send className="size-4" />} onClick={handleSubmit}>
    Gửi báo cáo
  </Btn>
  <Btn variant="danger" size="sm" pill onClick={handleEmergency}>
    Cứu hộ khẩn cấp
  </Btn>
  ```

#### `<IconBtn>`
Component dành riêng cho các nút bấm CHỈ chứa icon. **Bắt buộc phải có thuộc tính `label`** nhằm đáp ứng chuẩn trợ năng WCAG 2.1 AA.
- **Props**:
  - `label: string`: Mô tả chức năng nút cho thiết bị đọc màn hình và tooltip (`title`, `aria-label`).
  - `size`: `'sm'` (`size-8 sm:size-9 rounded-xl`) | `'md'` (`size-11 rounded-2xl`, mặc định) | `'lg'` (`size-14 rounded-2xl`).
  - `variant`: `'default'` (Viền nâu, nền giấy ngà) | `'ghost'` (Trong suốt) | `'soft'` (Nền kem pastel) | `'primary'` (Nền vàng bơ) | `'danger'` (Nền đỏ san hô).
- **Ví dụ**:
  ```tsx
  <IconBtn label="Đóng cửa sổ" size="sm" variant="ghost" onClick={onClose}>
    <X className="size-4" />
  </IconBtn>
  <IconBtn label="Tìm vị trí quanh tôi" size="md" variant="default" onClick={locateMe}>
    <MapPin className="size-5" />
  </IconBtn>
  ```

---

### 3.2. Form & Nhập Liệu (`src/components/ui/Form.tsx`)

#### `<Field>`
Wrapper quản lý nhãn (label), dấu hoa thị bắt buộc (`required`), hướng dẫn (`helper`), thông báo lỗi (`error`) và thành công (`success`).
```tsx
<Field label="Số điện thoại cứu hộ" required error={errors.phone} helper="Số điện thoại sẽ được bảo mật">
  <Input
    value={phone}
    onChange={(e) => setPhone(e.target.value)}
    invalid={!!errors.phone}
    placeholder="0912 345 678"
  />
</Field>
```

#### `<Input>`, `<Select>`, `<Textarea>`
- Tự động bo góc `rounded-2xl` hoặc `rounded-xl`, viền `border-2 border-line`, focus ring vàng bơ `focus:ring-4 focus:ring-butter/70`.
- Hỗ trợ `size?: 'sm' | 'md' | 'lg'` (mặc định `'md'`).
- `<Input>` hỗ trợ prop `invalid?: boolean` để đổi viền sang màu đỏ san hô khi có lỗi.
- `<Select>` tích hợp sẵn mũi tên SVG màu nâu sắc nét, chống lỗi vỡ giao diện trên các trình duyệt khác nhau.
```tsx
<Input size="sm" placeholder="Tìm kiếm nhanh..." value={query} onChange={(e) => setQuery(e.target.value)} />
<Select size="sm" value={district} onChange={(e) => setDistrict(e.target.value)}>
  <option value="">Tất cả quận / huyện</option>
  <option value="Quận 1">Quận 1</option>
  <option value="Bình Thạnh">Bình Thạnh</option>
</Select>
<Textarea size="md" placeholder="Nhập tình trạng sức khỏe hiện tại của bé..." rows={3} />
```

#### `<Segmented>`, `<Chip>`, `<Toggle>`, `<Check2>`
- `<Segmented>`: Bộ chuyển đổi tab (role `tablist`).
- `<Chip>`: Thẻ lọc danh mục, tự động bật tick `Check` khi `active={true}`.
- `<Toggle>`: Công tắc bật/tắt (role `switch`), bắt buộc truyền prop `label` cho trợ năng.
- `<Check2>`: Hộp kiểm tra Retro có tick đậm (role `checkbox`).
```tsx
<Segmented
  value={status}
  onChange={setStatus}
  options={[
    { v: 'all', label: 'Tất cả' },
    { v: 'pending', label: 'Chờ duyệt' },
    { v: 'resolved', label: 'Đã hoàn thành' },
  ]}
/>
<Chip active={selectedSpecies === 'Chó'} onClick={() => setSelectedSpecies('Chó')}>
  Chó 🐕
</Chip>
<Toggle on={pushEnabled} onChange={setPushEnabled} label="Nhận thông báo cứu hộ quanh tôi" />
<Check2 on={agreed} onChange={setAgreed}>
  Tôi cam kết thông tin cung cấp là chính xác và trung thực.
</Check2>
```

#### `<UploadBox>`
Hộp kéo thả tải ảnh và video mô phỏng, tích hợp xem trước danh sách tệp và nút xóa từng ảnh. Hỗ trợ prop `video?: boolean` để mở rộng định dạng nhận diện.
```tsx
<UploadBox
  label="Hình ảnh hiện trường"
  hint="Tải tối đa 5 ảnh rõ nét mặt bé"
  max={5}
  files={photoUrls}
  onChange={setPhotoUrls}
  video={false}
/>
```

---

### 3.3. Thẻ Card & Huy Hiệu Badge (`src/components/ui/Card.tsx`, `Badge.tsx`, `Avatar.tsx`)

#### `<Card>`
Thẻ chứa nội dung tiêu chuẩn với `rounded-[24px] border-2 border-line bg-paper p-5 shadow-soft`.
- **Props**: `hover?: boolean`, `onClick?: () => void`, `className?: string`.
```tsx
<Card hover onClick={() => navigateToCase(c.id)}>
  <h4 className="font-display font-extrabold text-lg">{c.name}</h4>
  <p className="text-sm text-brown-soft">{c.district}</p>
</Card>
```

#### `<Badge>` & Huy Hiệu Miền Nghiệp Vụ
Mọi tone màu của Badge đều sử dụng cặp nền pastel `-soft` kết hợp với màu chữ đậm `-dark` để bảo đảm tỷ lệ tương phản tối thiểu 4.5:1 (WCAG AA):
- **Tone**: `coral` (Khẩn cấp/Đỏ), `orange` (Cảnh báo/Cam), `butter` (Đang xử lý/Vàng), `sage` (Thành công/Xanh lá), `sky` (Xác minh/Xanh biển), `pink` (Mèo/Hồng), `plum` (AI Match/Tím), `ink` (Đen), `brown` (Trung tính).
- **Domain Badges**:
  - `<StatusBadge status={caseItem.status} critical={caseItem.critical} />`
  - `<Verified label="Trạm kiểm định" />`
  - `<MatchBadge v={98} />` ➔ Hiển thị `AI MATCH 98%` kèm biểu tượng chân mèo Paw
  - `<WarnBadge>Khu vực nguy hiểm</WarnBadge>`
- **Avatar**:
  - `<Avatar name="Miu Miu" tone="pink" size={36} />`
  - `<UserAvatar id={user.id} size={36} />` (Tự động tra cứu tên và tone từ kho dữ liệu)

---

### 3.4. Modal & BottomSheet (`src/components/ui/Modal.tsx`, `BottomSheet.tsx`)

#### `<Modal>`
Tự động bo góc đầy đủ trên Desktop và biến thành Bottom Sheet trượt từ đáy trên Mobile. Tích hợp sẵn đóng khi click nền overlay, phím Escape và nút đóng chuẩn `<IconBtn>`.
```tsx
<Modal open={isModalOpen} onClose={() => setIsModalOpen(false)} title="Xác nhận tiếp nhận ca">
  <p className="text-sm text-brown mb-4">Bạn có chắc chắn muốn tiếp nhận hỗ trợ ca cứu hộ này không?</p>
  <div className="flex justify-end gap-2">
    <Btn variant="secondary" onClick={() => setIsModalOpen(false)}>Hủy</Btn>
    <Btn variant="primary" onClick={handleConfirm}>Xác nhận</Btn>
  </div>
</Modal>
```

#### `<BottomSheet>`
Khung kéo thả vuốt từ dưới lên dành riêng cho Bản đồ cứu hộ với 3 điểm neo (`0`: thu gọn peek, `1`: nửa màn hình, `2`: toàn màn hình).
```tsx
<BottomSheet snap={snapIndex} onSnap={setSnapIndex} header={<MapFilterBar />}>
  <CaseListView cases={filteredCases} />
</BottomSheet>
```

---

### 3.5. Bố Cục & Điều Hướng (`src/components/ui/Layout.tsx`)
- `<PageHead title="Chi tiết ca cứu hộ" sub="Mã ca #HP-8291" back={handleBack} />` (Tích hợp nút quay lại chuẩn `Btn`).
- `<Stepper steps={['Thông tin cơ bản', 'Định vị GPS', 'Hình ảnh bằng chứng', 'Xác nhận']} current={currentStep} />`
- `<Note tone="butter" icon={<Info className="size-4" />}>Vui lòng giữ khoảng cách an toàn với động vật đang hoảng sợ.</Note>`

---

### 3.6. Trợ Lực Trực Quan, Phản Hồi & Media (`src/components/ui/Feedback.tsx`, `Media.tsx`, `Stars.tsx`, `Toast.tsx`)
- `<Empty title="Chưa có dữ liệu" body="Hãy thử thay đổi bộ lọc tìm kiếm nhé!" cta="Tạo ca mới" onCta={createNew} species="Chó" />`
- `<Skeleton className="h-28 w-full" />` (Placeholder hiệu ứng shimmer tải dữ liệu).
- `<ErrorState onRetry={fetchData} title="Không tải được dữ liệu" />`
- `<SuccessScreen title="Báo cáo đã gửi thành công!" species="Mèo">...</SuccessScreen>` (Tích hợp hiệu ứng `<Confetti />`).
- `<Stars value={place.rating} onChange={readOnly ? undefined : setRating} size={18} />`
- `<ToastHost />` (Bắt buộc mount tại root `App.tsx`, kích hoạt bất cứ đâu qua `useApp().toast('Thông báo!', 'ok' | 'warn')`).
- `<PetPhoto src={item.photo} species={item.species} alt={item.name} className="size-24 rounded-2xl" />` (Tự động fallback về vector illustration đáng yêu khi ảnh lỗi).
- `<DogIllo />`, `<CatIllo />`, `<PetIllo species="Mèo" />` (Minh họa vector retro đặc trưng).
- `<Logo onClick={goHome} compact={false} />`, `<Paw className="size-5" />`, `<BrandImage className="w-64" />`.

---

## 4. Hệ Thống Design Tokens, Typography & Utility Classes

Toàn bộ hệ thống tokens được định nghĩa tập trung trong `@theme` tại file [src/index.css](file:///c:/Users/An/Documents/GitHub/HappyPaw/src/index.css). Tuyệt đối **không tự viết màu hex tùy tiện** trong JSX className (`text-[#123456]`).

### 4.1. Bảng Màu Thương Hiệu Đầy Đủ (Color Palette)

| Tên Token Tailwind v4 | Giá Trị Hex | Ý Nghĩa Nghiệp Vụ & Hướng Dẫn Sử Dụng |
|---|---|---|
| `bg-cream` | `#fdf3dc` | Nền cốt lõi toàn ứng dụng, tạo cảm giác retro ấm áp. |
| `bg-cream-2` | `#f8ebc8` | Nền phụ, hover nhẹ, nền vùng upload box, nền bảng. |
| `bg-paper` | `#fffaf0` | Nền thẻ Card, hộp Modal, ô popup, nền bảng chính. |
| `text-brown` / `border-brown` | `#6b4128` | Màu nâu hạt dẻ cốt lõi của HappyPaw. Viền chính 2px (`border-2 border-brown`). |
| `text-brown-2` | `#8a5a3c` | Sắc thái nâu đậm vừa. |
| `text-brown-soft` | `#8f6a55` | Chữ phụ, mô tả nhỏ, helper text, nhãn phụ. |
| `border-line` | `#e6d3ad` | Đường kẻ mờ, viền card thứ cấp, viền ô nhập liệu chưa focus. |
| `text-ink` / `bg-ink` | `#2d2622` | Nâu đen sẫm cho navigation bar, avatar admin, huy hiệu Critical. |
| `bg-butter` | `#fff27a` | Vàng bơ năng động (Primary action, badge nổi bật, checkbox khi chọn). |
| `bg-butter-2` | `#f6e04d` | Vàng bơ đậm (Focus ring viền ngoài, sao đánh giá). |
| `bg-peach` / `bg-peach-2` | `#f6d4a6` / `#f0b987` | Cam đào dịu nhẹ (Tương tác thú cưng, avatar). |
| `bg-sage` / `bg-sage-2` | `#a9cc94` / `#4f7f3e` | Xanh xô thơm (Thành công, an toàn, đã hoàn thành). |
| `bg-sage-soft` | `#e3efd8` | Nền xanh xô thơm nhạt cho Badge thành công. |
| `text-sage-dark` | `#2f5a22` | Chữ xanh đậm có độ tương phản cao trên nền `bg-sage-soft`. |
| `bg-sage-hover` | `#3f6a31` | Trạng thái hover cho nút thao tác thành công. |
| `bg-coral` | `#d8503f` | Đỏ san hô cứu trợ (SOS, khẩn cấp, nút xóa, nguy kịch). |
| `bg-coral-soft` | `#fbdcd6` | Nền đỏ san hô nhạt cho Badge khẩn cấp, callout nguy hiểm. |
| `text-coral-dark` | `#8f2a1c` | Chữ đỏ san hô đậm có độ tương phản cao trên nền `bg-coral-soft`. |
| `bg-coral-hover` | `#bd3f2f` | Trạng thái hover cho nút thao tác khẩn cấp / xóa. |
| `bg-orange` / `bg-orange-soft` | `#e8892c` / `#fde6c9` | Cam cảnh báo (Cần theo dõi, ca thất lạc). |
| `text-orange-dark` | `#8a4a0c` | Chữ cam đậm có độ tương phản cao trên nền `bg-orange-soft`. |
| `bg-sky` / `bg-sky-2` / `bg-sky-soft` | `#b9dcec` / `#3f82a5` / `#e0f0f7` | Xanh da trời mát lành (Phòng khám thú y, xác minh). |
| `text-sky-dark` | `#1f5873` | Chữ xanh biển đậm có độ tương phản cao trên nền `bg-sky-soft`. |
| `bg-pink` / `bg-pink-2` | `#f5cfd6` / `#d9788c` | Hồng phấn (Mèo, tương tác yêu thương). |
| `text-pink-dark` | `#7d2c3f` | Chữ hồng sẫm có độ tương phản cao trên nền `bg-pink`. |
| `bg-plum` / `bg-plum-soft` | `#8a63ab` / `#eadff2` | Tím mận (AI Match, rủi ro trung bình). |
| `text-plum-dark` | `#573578` | Chữ tím đậm có độ tương phản cao trên nền `bg-plum-soft`. |
| `bg-map-sand` | `#efe5c4` | Màu nền vàng cát cổ điển của bản đồ cứu hộ. |

### 4.2. Typography
- **Tiêu đề & Headline**: `font-display` (Google Fonts *Baloo 2* việt hóa tròn trịa kết hợp *Nunito*).
  - Áp dụng cho: `<h1>` - `<h4>`, tiêu đề modal, tên thú cưng, số liệu thống kê lớn.
- **Nội dung & Form**: `font-sans` (Google Fonts *Nunito* dễ đọc).
  - Áp dụng cho: Văn bản mô tả, form input, bảng dữ liệu, nhãn nút.

### 4.3. Các Utility Classes Đặc Thù (`src/index.css`)
- `.bubble`: Chữ viền bóng 3D vui nhộn với stroke nâu 7px (`-webkit-text-stroke: 7px var(--color-brown)`), dùng cho tiêu đề lớn Hero và Banner.
- `.bubble-yellow`: Chữ bubble màu vàng bơ (`color: var(--color-butter)`).
- `.no-scrollbar`: Ẩn thanh cuộn trình duyệt nhưng vẫn giữ khả năng vuốt/cuộn mượt mà.
- `.map-grab`: Đổi con trỏ chuột sang hình bàn tay cầm nắm (`cursor: grab`, `active: cursor: grabbing`) khi tương tác bản đồ.

### 4.4. Bo Góc, Đổ Bóng & Hiệu Ứng Chuyển Động
- **Bo góc**:
  - Ô input, nút bấm, avatar: `rounded-2xl` (16px) hoặc `rounded-xl` (12px cho size nhỏ).
  - Thẻ card, modal, container: `rounded-[24px]` hoặc `rounded-[28px]`.
  - Huy hiệu badge, viên thuốc pill: `rounded-full`.
- **Đổ bóng cơ học 3D**:
  - Nút bấm: `shadow-[0_4px_0_var(--color-brown)]`.
  - Khi hover nút: `hover:-translate-y-0.5 hover:shadow-[0_6px_0_var(--color-brown)]`.
  - Khi bấm nút (active): `active:translate-y-1 active:shadow-none`.
  - Thẻ card mềm: `shadow-soft`.
- **Keyframe Animations**:
  - `animate-bounce-soft`: Nhún nhảy nhẹ nhàng cho biểu tượng động vật.
  - `animate-pop`: Nảy phóng to nhẹ nhàng khi xuất hiện (Modal, Toast, Dropdown).
  - `animate-rise`: Trượt từ dưới lên (Bottom sheet, Drawer).
  - `animate-pulse-ring`: Vòng tròn sóng lan tỏa định vị trên bản đồ.

### 4.5. Quy Chuẩn Iconography & Tiêu Chuẩn Thẩm Mỹ Biểu Tượng

Nhằm giữ giao diện gọn gàng, tinh tế và sang trọng, việc sử dụng icon phải tuân theo nguyên tắc **có chủ đích (intentional)**, tránh lạm dụng bừa bãi:

#### 1. Khi Nào NÊN Dùng Icon:
- **Nút hành động & CTA quan trọng**: Tăng cường nhận diện hành động chính (`<Btn icon={<Siren className="size-4" />} variant="danger">SOS Khẩn cấp</Btn>`, `<IconBtn label="Tìm kiếm"><Search className="size-4" /></IconBtn>`).
- **Thanh điều hướng & Tabs phân loại**: Kết hợp icon + chữ ngắn gọn trong `<Segmented>` hoặc topbar/bottom navigation giúp người dùng quét thị giác nhanh.
- **Huy hiệu & Cảnh báo**: Chỉ dẫn trực quan mức độ nguy hiểm hoặc tính xác thực (`<Note icon={<AlertTriangle className="size-4" />}>`, `<Verified />`).
- **Input adornment**: Biểu tượng bổ trợ trong ô nhập liệu (icon kính lúp `<Search className="size-4" />` ở ô tìm kiếm, icon địa chỉ `<MapPin className="size-4" />`).
- **Trạng thái kết nối / xử lý**: Đốm tròn màu sắc CSS (`size-2 rounded-full bg-coral animate-pulse`) cho biết tình trạng trực tiếp.

#### 2. Khi Nào KHÔNG ĐƯỢC Dùng Icon (Tránh Bừa Bãi):
- ❌ **Không chèn icon trang trí vào câu văn thường / đoạn văn bản**: Tuyệt đối không gắn icon hoặc emoji vào cuối câu hay giữa đoạn (VD: "Cảm ơn bạn đã báo tin! 🐾" ➔ Viết chuẩn: "Cảm ơn bạn đã báo tin!").
- ❌ **Không gắn icon vào mọi đầu mục danh sách**: Nếu danh sách dài hoặc bảng biểu đã có phân cấp rõ ràng, việc gắn icon vào từng dòng gây nhiễu thị giác và làm rối mắt.
- ❌ **Không dùng icon thay thế hoàn toàn chữ trong các chức năng phức tạp**: Người dùng cần hiểu chính xác hành động; icon chỉ nên đóng vai trò bổ trợ trừ các thao tác hiển nhiên (như Đóng `X`, Quay lại `ArrowLeft`).

#### 3. Bảng Thang Kích Thước Icon Chuẩn (Sizing Scale):
| Cấp Độ | Tailwind Class | Kích Thước | Ngữ Cảnh Sử Dụng |
|---|---|---|---|
| **Micro** | `size-3.5` | 14px | Bên trong `<Badge>`, inline tag, micro metadata. |
| **Small** | `size-4` | 16px | Inline văn bản, nút nhỏ (`Btn size="sm"`), tiền tố input. |
| **Medium** | `size-5` | 20px | Nút tiêu chuẩn (`Btn size="md"` / `lg`), tiêu đề thẻ card, bottom bar. |
| **Large** | `size-6` - `size-7` | 24 - 28px | Feature cards nổi bật (như mục Quyên góp, Hero features). |

---

## 5. Quy Chuẩn Cấu Trúc Dự Án & Import Aliases

Mọi import trong dự án phải tuân theo cấu trúc phân tầng rõ ràng, sử dụng path aliases đã cấu hình trong `tsconfig.json` và `vite.config.ts`. **Tuyệt đối cấm import tương đối lùi nhiều tầng (`../../`)**.

### Danh Mục Aliases Chuẩn:
- `@ui` ➔ Trỏ đến `src/components/ui` (Tất cả primitive UI elements).
- `@store` ➔ Trỏ đến `src/store` (State slices, AppProvider, useApp).
- `@lib` ➔ Trỏ đến `src/lib` (Pure utilities: `cx`, `parsePath`).
- `@features/*` ➔ Trỏ đến các module tính năng: `@features/landing`, `@features/user`, `@features/community`, `@features/admin`, `@features/map`.
- `@/*` ➔ Trỏ đến các thư mục chia sẻ trong `src`:
  - `@/types` ➔ TypeScript types tập trung.
  - `@/constants` ➔ Mock data, hằng số vị trí, trạng thái.
  - `@/layouts` ➔ UserShell, App Shells.
  - `@/services` ➔ API service layer.
  - `@/hooks` ➔ Custom hooks chung (`useLocalStorage`, `useDebounce`).

```tsx
// ❌ SAI — Import lùi nhiều tầng phá vỡ kiến trúc module:
import { Btn } from '../../components/ui/Button'
import { useApp } from '../../../store'

// ✔ ĐÚNG — Sử dụng đúng hệ thống aliases phân tầng:
import { Btn, Card, Badge } from '@ui'
import { useApp } from '@store'
import { parsePath, cx } from '@lib'
import type { Case } from '@/types'
```

---

## 6. Hướng Dẫn Trợ Năng (WCAG 2.1 AA) & Responsive Mobile-First

1. **Chuẩn Trợ Năng (Accessibility - WCAG 2.1 AA)**:
   - **Tương phản màu sắc**: Tất cả văn bản hiển thị trên các thẻ Badge hoặc Banner pastel bắt buộc dùng các token `-dark` (ví dụ `text-coral-dark` trên `bg-coral-soft`) để đạt tỷ lệ tương phản tối thiểu 4.5:1.
   - **Nút bấm icon**: Mọi `<IconBtn>` bắt buộc phải có prop `label` hoặc `aria-label` có nghĩa (ví dụ `label="Đóng cửa sổ"`, không để trống hoặc chỉ ghi `icon`).
   - **Tiêu điểm bàn phím**: Các thành phần tương tác giữ nguyên hiệu ứng outline vàng bơ chuẩn xác `:focus-visible { outline: 3px solid var(--color-butter-2); outline-offset: 2px; }`.
2. **Thiết Kế Mobile-First & Touch Target**:
   - Mọi nút bấm và vùng chạm trên thiết bị di động phải đạt kích thước tối thiểu **44x44px** (tương đương `size="md"` hoặc class `min-h-11`).
   - Hộp thoại `<Modal>` tự động chuyển thành Bottom Sheet trượt từ đáy màn hình trên kích thước mobile (`< 640px`) để dễ dàng thao tác bằng một tay.
   - Thanh điều hướng di động (`UserShell`) neo cố định ở đáy màn hình kèm khoảng đệm an toàn `pb-[env(safe-area-inset-bottom)]`.

---

## 7. Các Mẫu Code Thực Chiến (Do vs Don't Examples)

### Mẫu 1: Xây Dựng Form Nhập Liệu
```tsx
// ❌ SAI — Dùng raw input, select, button tự style
export function PetFormWrong() {
  return (
    <div>
      <label>Tên bé</label>
      <input type="text" className="border p-2 rounded" placeholder="Miu Miu" />
      <select className="border p-2">
        <option>Mèo</option>
      </select>
      <button className="bg-yellow-400 p-2 rounded">Lưu thông tin</button>
    </div>
  )
}

// ✔ ĐÚNG — Tuân thủ chuẩn mực HappyPaw Design System
import { Field, Input, Select, Btn } from '@ui'

export function PetFormCorrect() {
  return (
    <div className="space-y-4">
      <Field label="Tên thú cưng" required helper="Tên thường gọi ở nhà">
        <Input size="md" placeholder="Ví dụ: Miu Miu, Corgi Vàng" />
      </Field>

      <Field label="Loài động vật" required>
        <Select size="md">
          <option value="cat">Mèo</option>
          <option value="dog">Chó</option>
          <option value="other">Loài khác</option>
        </Select>
      </Field>

      <Btn variant="primary" size="lg" full onClick={handleSave}>
        Lưu thông tin thú cưng
      </Btn>
    </div>
  )
}
```

### Mẫu 2: Nút Đóng & Thao Tác Bảng (Icon Actions)
```tsx
// ❌ SAI — Dùng raw button kèm icon, thiếu nhãn trợ năng
<button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100">
  <X className="size-4" />
</button>

// ✔ ĐÚNG — Dùng IconBtn có label mô tả đầy đủ
import { IconBtn } from '@ui'

<IconBtn label="Đóng cửa sổ" size="sm" variant="ghost" onClick={onClose}>
  <X className="size-4" />
</IconBtn>
```

### Mẫu 3: Sử Dụng Màu Sắc Tương Phản Trên Nền Pastel
```tsx
// ❌ SAI — Viết mã hex tùy tiện trong className
<div className="bg-coral-soft text-[#8f2a1c] p-3 rounded-2xl">
  Cảnh báo khẩn cấp!
</div>

// ✔ ĐÚNG — Dùng Design Token -dark chuẩn hóa
<div className="bg-coral-soft text-coral-dark p-3 rounded-2xl">
  Cảnh báo khẩn cấp!
</div>
```

---

## 8. Quy Trình Đóng Góp & Mở Rộng UI Primitives

Khi triển khai màn hình mới và nhận thấy thư viện `@ui` chưa có thành phần hoặc biến thể phù hợp, hãy tuân theo quy trình 4 bước chuẩn hóa sau:

1. **Khảo sát Nhu cầu**: Xác định rõ đây là một primitive dùng chung (toàn hệ thống) hay một domain component đặc thù (chỉ dành cho 1 tính năng).
2. **Hiện thực trong `@ui`**:
   - Nếu là biến thể của component đã có (ví dụ: cần thêm `variant="outline"` hoặc `size="xs"`): Mở file tương ứng trong `src/components/ui/` và bổ sung vào TypeScript interface cùng styling map.
   - Nếu là component hoàn toàn mới: Tạo file mới trong `src/components/ui/`, tuân thủ styling tokens viền nâu, màu nền và đổ bóng 3D của HappyPaw.
3. **Re-export**: Đưa component mới vào `src/components/ui/index.ts`.
4. **Sử dụng tại Feature**: Import qua `@ui` vào file màn hình tính năng và chạy lệnh `npm run check:conventions` để nghiệm thu.

---

## 9. Script Linter Tự Động & Pipeline Tích Hợp

### Lệnh Kiểm Tra Quy Chuẩn (Automated Quality Gate)
Hệ thống cung cấp sẵn công cụ quét tự động. Trước khi commit hoặc tạo Pull Request, lập trình viên bắt buộc phải chạy:

```bash
# 1. Quét toàn bộ mã nguồn kiểm tra raw elements, banned imports, hex classes tùy tiện và multi-level imports
npm run check:conventions

# 2. Kiểm tra an toàn kiểu dữ liệu TypeScript
npx tsc --noEmit

# 3. Kiểm tra toàn bộ quá trình build production (tự động chạy check:conventions trước)
npm run build
```

> [!IMPORTANT]
> Lệnh `npm run build` đã được cấu hình tích hợp sẵn cổng kiểm soát chất lượng (Pre-build Gate). Nếu có bất kỳ vi phạm quy chuẩn nào, quá trình build production sẽ bị chặn ngay lập tức.

---

## 10. Checklist Đánh Giá Code Dành Cho Reviewer (PR Checklist)

Mọi Pull Request trước khi được phê duyệt bắt buộc phải vượt qua checklist 8 điểm:

- [ ] **1. Không Raw Elements**: Tuyệt đối không có thẻ `<button>`, `<input>`, `<select>`, `<textarea>` nào nằm ngoài thư mục `src/components/ui/`.
- [ ] **2. Chuẩn Nút Bấm**: Tất cả nút bấm đều dùng `<Btn>` hoặc `<IconBtn>`. Các icon button đều có thuộc tính `label` rõ ràng.
- [ ] **3. Chuẩn Nhập Liệu**: Tất cả form nhập liệu đều dùng `<Field>`, `<Input>`, `<Select>`, `<Textarea>`, `<UploadBox>`.
- [ ] **4. Không Hex Class Tùy Tiện**: Tuyệt đối không có class dạng `(text|bg|border|fill|stroke|accent)-[#...]`. Toàn bộ màu sắc đều dùng token (`text-brown`, `bg-butter`, `text-coral-dark`, `text-sage-dark`, `bg-map-sand`).
- [ ] **5. Chuẩn Typography**: Tiêu đề chính sử dụng `font-display`, nội dung thường sử dụng `font-sans`.
- [ ] **6. Chuẩn Aliases**: Tất cả import đều thông qua path aliases (`@ui`, `@store`, `@lib`, `@features/*`, `@/*`). Không có import lùi nhiều tầng (`../../`).
- [ ] **7. Chuẩn Trợ Năng & Chạm**: Kích thước nút bấm trên mobile đạt tối thiểu 44px, độ tương phản chữ đạt chuẩn WCAG.
- [ ] **8. Chuẩn Zero Raw Emojis & Icon**: 100% sử dụng icon SVG từ `lucide-react` hoặc `@ui`. Không có emoji hệ thống (`🚨`, `🐾`, `🔍`, `✨`...) xuất hiện trong giao diện.
- [ ] **9. Clean Linter & Build**: Lệnh `npm run check:conventions`, `npx tsc --noEmit` và `npm run build` trả về mã thoát `0` (Exit code 0).
