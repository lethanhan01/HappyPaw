import type { Notif } from '@/types/user'

export const NOTIFS: Notif[] = [
  { id: 'n1', kind: 'rescue', title: 'Có một bé chó cần được để mắt gần bạn', body: 'Milo mất tích cách bạn 800m tại Trần Thái Tông.', ago: '5 phút trước', caseId: 'HP-1042', unread: true },
  { id: 'n2', kind: 'match', title: 'Có một kết quả AI Match 87% với Milo', body: 'Một bé chó vàng trắng vừa được báo thấy tại Cầu Giấy.', ago: '12 phút trước', caseId: 'HP-1042', unread: true },
  { id: 'n3', kind: 'rescue', title: 'Case Milo vừa được cập nhật vị trí tại Trần Thái Tông', body: 'Lần cuối thấy bé cách đây 15 phút.', ago: '20 phút trước', caseId: 'HP-1042', unread: true },
  { id: 'n4', kind: 'safety', title: 'Cảnh báo khu vực mới ở Cầu Giấy', body: 'Cộng đồng đánh dấu khu vực nghi trộm chó mèo gần bạn.', ago: '1 giờ trước', unread: false },
  { id: 'n5', kind: 'rescue', title: 'Ca cứu hộ Bông đã được xác nhận thành công', body: 'Cảm ơn Nguyễn Minh và Mái ấm Cún Con.', ago: 'Hôm qua', caseId: 'HP-1039', unread: false },
  { id: 'n6', kind: 'community', title: 'Bạn nhận được huy hiệu "Người giúp đỡ"', body: 'Cảm ơn bạn đã chia sẻ 10 case trong tuần.', ago: '2 ngày trước', unread: false },
]
