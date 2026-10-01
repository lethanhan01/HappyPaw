export const timeAgo = (m: number) =>
  m < 1
    ? "Vừa xong"
    : m < 60
      ? `${m} phút trước`
      : m < 1440
        ? `${Math.round(m / 60)} giờ trước`
        : `${Math.round(m / 1440)} ngày trước`
