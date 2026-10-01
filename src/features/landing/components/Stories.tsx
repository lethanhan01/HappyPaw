import { Heart, Quote, CheckCircle2 } from 'lucide-react'
import { Badge, PetPhoto } from '@/components/ui'
import { photo } from '@/constants/photos'

const STORIES = [
  {
    petName: 'BÉ BÔNG',
    species: 'Chó Spitz',
    district: 'Ba Đình, Hà Nội',
    daysLost: '4 ngày thất lạc',
    story: 'Tôi tưởng như đã mất Bông mãi mãi khi bé chạy lạc lúc trời mưa to. Nhờ bạn tình nguyện viên chụp ảnh gửi lên Happy Paws, hệ thống AI Match nhận diện đốm mũi hồng chỉ sau 20 phút. Cảm ơn cộng đồng rất nhiều!',
    owner: 'Gia đình chị Mai & bé Bông',
    photo: photo('white5'),
    aiScore: 89,
  },
  {
    petName: 'BÉ MILO',
    species: 'Golden Retriever',
    district: 'Cầu Giấy, Hà Nội',
    daysLost: 'Tìm thấy sau 3 giờ',
    story: 'Milo tuột xích lúc đi dạo ở công viên Cầu Giấy. Mình lập tức đăng tin báo mất lên Happy Paws. Chỉ trong 1 tiếng đã có 3 bác ở đường Trần Thái Tông cập nhật vị trí theo thời gian thực. Đội tình nguyện viên hỗ trợ giữ bé an toàn.',
    owner: 'Anh Trần Quốc Bảo',
    photo: photo('golden1'),
    aiScore: 94,
  },
  {
    petName: 'BÉ MÍT',
    species: 'Mèo Anh lông ngắn',
    district: 'Đống Đa, Hà Nội',
    daysLost: 'Cứu hộ tai nạn',
    story: 'Mít bị kẹt gầm ô tô và gãy chân sau. Người đi đường đã bấm nút Cứu hộ khẩn cấp của Happy Paws. Sau 12 phút, xe cấp cứu thú y đến đưa bé về phòng khám Pet Care. Hiện Mít đã khỏe mạnh và có mái ấm mới.',
    owner: 'Mái ấm Cún Con & TNV Minh',
    photo: photo('cat1'),
    aiScore: null,
  },
]

export default function SuccessStories() {
  return (
    <section id="stories" className="w-full max-w-full overflow-hidden py-12 sm:py-20 md:py-24 bg-cream">
      <div className="mx-auto max-w-[1440px] px-3.5 sm:px-6 lg:px-8 w-full">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto">
          <Badge tone="sage">CÂU CHUYỆN ẤM LÒNG</Badge>
          <h2 className="bubble mt-4 text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight break-words">
            Những chiếc đuôi nhỏ <br />
            <span className="bubble-yellow">đã tìm lại mái ấm</span>
          </h2>
          <p className="mt-2.5 sm:mt-3 text-sm sm:text-base md:text-lg font-bold text-brown-soft leading-relaxed">
            Hơn 1.240 điều kỳ diệu đã diễn ra nhờ sự chung tay của cộng đồng người yêu động vật thủ đô.
          </p>
        </div>

        {/* Stories Grid */}
        <div className="mt-8 sm:mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {STORIES.map((s, idx) => (
            <div
              key={idx}
              className="flex flex-col justify-between overflow-hidden rounded-[24px] sm:rounded-[32px] border-2 border-brown bg-paper p-5 sm:p-7 shadow-[0_4px_0_var(--color-brown)] sm:shadow-[0_5px_0_var(--color-brown)] transition hover:-translate-y-1 hover:shadow-[0_8px_0_var(--color-brown)]"
            >
              <div>
                {/* Photo & Badges */}
                <div className="relative aspect-[16/10] overflow-hidden rounded-2xl border-2 border-brown bg-cream-2">
                  <PetPhoto src={s.photo} species={s.species} alt={s.petName} className="size-full" />
                  <div className="absolute left-2.5 top-2.5">
                    <Badge tone="sage" icon={<CheckCircle2 className="size-3.5" />}>
                      ĐÃ ĐOÀN TỤ
                    </Badge>
                  </div>
                  {s.aiScore && (
                    <span className="absolute right-2.5 top-2.5 rounded-full border border-plum/40 bg-plum-soft px-2.5 py-0.5 text-xs font-black text-plum">
                      AI MATCH {s.aiScore}%
                    </span>
                  )}
                </div>

                <div className="mt-5 flex items-center justify-between">
                  <h3 className="font-display text-2xl font-extrabold text-brown">
                    {s.petName}
                  </h3>
                  <span className="text-xs font-black text-coral bg-coral-soft px-2 py-0.5 rounded-full border border-coral/30">
                    {s.daysLost}
                  </span>
                </div>

                <p className="text-xs font-bold text-brown-soft">
                  {s.species} · {s.district}
                </p>

                {/* Quote */}
                <div className="relative mt-4 rounded-2xl bg-cream/40 p-4 border border-line">
                  <Quote className="size-5 text-brown/25 mb-1" />
                  <p className="text-sm font-semibold italic text-brown leading-relaxed">
                    "{s.story}"
                  </p>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t-2 border-line flex items-center justify-between">
                <span className="text-xs font-extrabold text-brown">
                  {s.owner}
                </span>
                <Heart className="size-4 fill-coral text-coral" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
