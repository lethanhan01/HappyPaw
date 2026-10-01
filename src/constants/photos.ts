export const img = (id: string, w = 600, h = 600) =>
  `https://images.unsplash.com/photo-${id}?w=${w}&h=${h}&fit=crop&auto=format&q=75`

export const PHOTO = {
  golden1: '1558788353-f76d92427f16',
  golden2: '1693615775129-f2004d6e3e0b',
  golden3: '1602241628512-459cdd3234fe',
  golden4: '1633722714057-aaa9bf7f2383',
  cat1: '1710578471007-ae4ddffde8c6',
  cat2: '1631307495039-3f9e947c2070',
  cat3: '1550414485-9f22b971dbf0',
  cat4: '1560740837-89363a2b7192',
  catBW: '1693868380707-ff4f70d28f67',
  catBW2: '1615000363971-041349a4717b',
  white1: '1554956615-1ba6dc39921b',
  white2: '1606149257644-a1f04b76c111',
  white3: '1621878135994-8b56a55d4af5',
  white4: '1587402092301-725e37c70fd8',
  white5: '1570888234661-a2428afad010',
  shelter1: '1450778869180-41d0601e046e',
  shelter2: '1509205477838-a534e43a849f',
  shelter3: '1601758177266-bc599de87707',
  shelter4: '1642625932641-3a52ad27e268',
  shelter5: '1542715234-bd0adb4249b7',
  pup: '1553688738-a278b9f063e0',
}

export const photo = (k: keyof typeof PHOTO, w = 600, h = 600) => img(PHOTO[k], w, h)
