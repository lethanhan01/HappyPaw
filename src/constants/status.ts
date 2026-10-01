import type { Status } from '@/types/case'

export const STATUS_META: Record<Status, { label: string; short: string; tone: string }> = {
  active: { label: 'Đang cần hỗ trợ', short: 'Đang cần hỗ trợ', tone: 'coral' },
  progress: { label: 'Đang xử lý', short: 'Đang xử lý', tone: 'butter' },
  pending: { label: 'Chờ xác minh', short: 'Chờ xác minh', tone: 'butter' },
  resolved: { label: 'Đã giải quyết', short: 'Đã giải quyết', tone: 'sage' },
}
