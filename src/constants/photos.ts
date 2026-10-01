import dogHero from '@/assets/dog.jpg'
import puddleApricot from '@/assets/puddle_vang_mo.jpg'
import pomSleeping from '@/assets/dogngu.jpg'
import pomSitting from '@/assets/dogkhon.jpg'
import pawsBanner from '@/assets/paws.png'
import logoSvg from '@/assets/logo.svg'

/* ---------- User Local Assets ---------- */
export const LOCAL_ASSETS = {
  dogHero,
  puddleApricot,
  pomSleeping,
  pomSitting,
  pawsBanner,
  logoSvg,
} as const

export const img = (id: string, w = 600, h = 600) =>
  `https://images.unsplash.com/photo-${id}?w=${w}&h=${h}&fit=crop&auto=format&q=75`

/* ---------- Expanded Unsplash Curated Library ---------- */
export const PHOTO = {
  // Golden & Labrador Retriever
  golden1: '1558788353-f76d92427f16',
  golden2: '1693615775129-f2004d6e3e0b',
  golden3: '1602241628512-459cdd3234fe',
  golden4: '1633722714057-aaa9bf7f2383',

  // Corgi & Chó chân ngắn
  corgi1: '1612536057832-2ff7ead58194',
  corgi2: '1548199973-03cce0bbc87b',

  // Poodle & Lông xù trắng
  poodle1: '1516734212186-a967f81ad0d7',
  poodle2: '1583337130417-3346a1be7dee',
  white1: '1554956615-1ba6dc39921b',
  white2: '1606149257644-a1f04b76c111',
  white3: '1621878135994-8b56a55d4af5',
  white4: '1587402092301-725e37c70fd8',
  white5: '1570888234661-a2428afad010',

  // Shiba Inu, Samoyed & Alaska / Husky
  shiba1: '1583511655857-d19b40a7a54e',
  shiba2: '1576201836106-db1758fd1c97',
  husky1: '1605568427561-40dd23c2acea',
  husky2: '1517849845537-4d257902454a',
  samoyed1: '1568572933-472097725916',
  pup: '1553688738-a278b9f063e0',
  pup2: '1598133894008-61f7fdb8cc3a',

  // Mèo các giống
  cat1: '1710578471007-ae4ddffde8c6', // Mèo Anh lông ngắn xám
  cat2: '1631307495039-3f9e947c2070', // Mèo mướp xám
  cat3: '1550414485-9f22b971dbf0', // Mèo xám xanh mắt vàng
  cat4: '1560740837-89363a2b7192', // Mèo Ba Tư kem
  catTabby1: '1514888286974-6c03e2ca1dba', // Mèo mướp vàng vằn
  catTabby2: '1573865526739-10659fec78a5', // Mèo vàng mắt to
  catCalico1: '1513360309081-38f0762daed1', // Mèo tam thể
  catCalico2: '1592194996308-7b43878e84a6', // Mèo tam thể tròn
  catBW: '1693868380707-ff4f70d28f67', // Mèo nhị thể đen trắng
  catBW2: '1615000363971-041349a4717b',
  catBlack: '1548767797-d8c844163e4c', // Mèo mun đen
  catSiamese: '1513245543132-31f507417b26', // Mèo Xiêm
  catKitten: '1548802673-380ab8ebc7b7', // Mèo con cứu hộ

  // Mái ấm & Phòng khám thú y 24/7
  shelter1: '1450778869180-41d0601e046e',
  shelter2: '1509205477838-a534e43a849f',
  shelter3: '1601758177266-bc599de87707',
  shelter4: '1642625932641-3a52ad27e268',
  shelter5: '1542715234-bd0adb4249b7',
  shelter6: '1574158622682-e40e69881006',
  clinic1: '1584824486509-112e4181ff6b',
  clinic2: '1628009368841-3683e3229533',
} as const

export const photo = (k: keyof typeof PHOTO, w = 600, h = 600) => img(PHOTO[k], w, h)
