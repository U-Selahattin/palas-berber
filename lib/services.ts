export type Service = {
  key: string;
  titleTR: string;
  descTR: string;
  durationMin: number; // gardé pour le planning (non affiché)
  priceFromTRY: number;
  priceToTRY?: number; // optionnel (ex: kératine)
};

export const SERVICES: Service[] = [
  {
    key: "sac-kesimi",
    titleTR: "Saç Kesimi",
    descTR:
      "Yüz hatlarına ve stiline uygun modern kesim. Temiz geçişler, net çizgiler ve profesyonel bitiş.",
    durationMin: 30,
    priceFromTRY: 600,
  },
  {
    key: "sakal-kesimi",
    titleTR: "Sakal Kesimi",
    descTR:
      "Sakal şekillendirme, çizgi düzenleme ve detaylı temizlik ile bakımlı ve net görünüm.",
    durationMin: 15,
    priceFromTRY: 300,
  },
  {
    key: "sac-sakal",
    titleTR: "Saç + Sakal Kesimi",
    descTR:
      "Komple bakım paketi. Saç kesimi ve sakal düzenleme ile uyumlu ve dengeli stil.",
    durationMin: 30,
    priceFromTRY: 800,
  },
  {
    key: "fon-yikama",
    titleTR: "Yıkama + Fön",
    descTR:
      "Saç yıkama sonrası profesyonel fön ve şekillendirme. Temiz ve düzenli görünüm.",
    durationMin: 15,
    priceFromTRY: 100,
  },
  {
    key: "agda",
    titleTR: "Ağda",
    descTR:
      "Bölgesel ağda uygulaması. Kaş üstü, ense veya yüz bölgesi için temiz görünüm.",
    durationMin: 15,
    priceFromTRY: 200,
  },
  {
    key: "cilt-bakimi",
    titleTR: "Cilt Bakımı",
    descTR:
      "Derinlemesine temizlik ve ferahlatıcı bakım ile canlı ve bakımlı cilt görünümü.",
    durationMin: 30,
    priceFromTRY: 500,
  },
  {
    key: "sac-bakimi",
    titleTR: "Saç Bakımı",
    descTR:
      "Saça özel bakım uygulaması ile güçlendirme, parlaklık ve sağlıklı görünüm.",
    durationMin: 30,
    priceFromTRY: 400,
  },
  {
    key: "keratin",
    titleTR: "Keratin Bakımı",
    descTR:
      "Saç yapısına göre uygulanan profesyonel keratin bakımı. Fiyat saç uzunluğuna ve yoğunluğuna göre değişir.",
    durationMin: 60,
    priceFromTRY: 2000,
    priceToTRY: 3500,
  },
];

export function getService(key: string) {
  return SERVICES.find((s) => s.key === key);
}

export function fmtTRY(amount: number) {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function fmtServicePrice(s: Service) {
  return s.priceToTRY
    ? `${fmtTRY(s.priceFromTRY)} – ${fmtTRY(s.priceToTRY)}`
    : fmtTRY(s.priceFromTRY);
}
