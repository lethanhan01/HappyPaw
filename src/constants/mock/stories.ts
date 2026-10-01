import { photo } from "../photos"
import type { Story } from "@/types/user"

export const STORIES: Story[] = [
  {
    id: "st1",
    title: "Bông trở về nhà sau 2 ngày lạc",
    excerpt:
      "Nhờ một bức ảnh được chia sẻ trong nhóm, cô bé Spitz đã đoàn tụ cùng gia đình ở Ba Đình.",
    photo: photo("white5", 700, 460),
    author: "Nguyễn Minh",
    place: "Ba Đình",
  },
  {
    id: "st2",
    title: "Chú mèo dưới gầm xe đã có mái ấm",
    excerpt:
      "Một ca cứu hộ lúc nửa đêm, ba tình nguyện viên và một phòng khám mở cửa muộn.",
    photo: photo("cat1", 700, 460),
    author: "Ngô Phương Thảo",
    place: "Hoàn Kiếm",
  },
  {
    id: "st3",
    title: "41 lần cứu hộ của một người bình thường",
    excerpt:
      "Anh Minh kể về lý do mỗi tối đều mang theo lồng vận chuyển trên xe.",
    photo: photo("shelter3", 700, 460),
    author: "Happy Paws",
    place: "Đống Đa",
  },
]
