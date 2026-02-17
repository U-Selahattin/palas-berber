export default function Footer() {
  const ADDRESS =
    "Atatürk, Çavuşbaşı Cd. no:81/C, 34760 Ümraniye / İstanbul";
  const PHONE_DISPLAY = "+90 507 174 93 76";
  const PHONE_TEL = "+905071749376";
  const MAPS_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    ADDRESS
  )}`;

  return (
    <footer className="relative overflow-hidden">
      {/* 🎨 transition douce page → footer */}
      <div className="absolute inset-0 bg-gradient-to-b from-neutral-950 via-[#243f35] to-[#1f3f33]" />

      {/* glow très léger pour profondeur */}
      <div className="pointer-events-none absolute -top-32 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-[#2B5947]/20 blur-3xl" />

      <div className="relative mx-auto max-w-6xl px-6 py-14">
        <div className="grid gap-10 md:grid-cols-3 md:items-start">
          {/* BRAND */}
          <div>
            <p className="text-sm font-semibold tracking-wide text-white">
              PALAS BERBER
            </p>

            <p className="mt-2 max-w-sm text-sm leading-relaxed text-neutral-200">
              Modern erkek kuaförü.  
              Saç, sakal ve stil odaklı premium hizmet — online randevu sistemi ile.
            </p>

            <p className="mt-4 text-xs text-neutral-300">
              Ümraniye • İstanbul
            </p>
          </div>

          {/* ADRES */}
          <div>
            <p className="text-sm font-semibold text-white">Adres</p>

            <p className="mt-2 text-sm leading-relaxed text-neutral-200">
              {ADDRESS}
            </p>

            <a
              href={MAPS_URL}
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-block text-sm font-medium text-[#89BFE2] underline underline-offset-4 hover:text-white transition"
            >
              Google Maps’te görüntüle
            </a>
          </div>

          {/* INFOS */}
          <div className="md:text-right">
            <p className="text-sm font-semibold text-white">
              İletişim & Saatler
            </p>

            <p className="mt-2 text-sm text-neutral-200">
              Pazartesi – Cumartesi
            </p>
            <p className="text-sm text-neutral-200">10:00 – 21:00</p>

            <a
              href={`tel:${PHONE_TEL}`}
              className="mt-3 inline-block text-sm font-medium text-neutral-200 hover:text-white transition"
            >
              Tel: {PHONE_DISPLAY}
            </a>

            <p className="mt-6 text-xs text-neutral-300">
              © {new Date().getFullYear()} Palas Berber.  
              Tüm hakları saklıdır.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
