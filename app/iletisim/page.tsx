import Link from "next/link";

const PHONE_DISPLAY = "+90 507 174 93 76";
const PHONE_TEL = "+905071749376";

const ADDRESS_DISPLAY =
  "Atatürk, Çavuşbaşı Cd. no:81/C, 34760 Ümraniye/İstanbul";

const GMAPS_QUERY = encodeURIComponent(ADDRESS_DISPLAY);
const GMAPS_DIRECTIONS_URL = `https://www.google.com/maps/dir/?api=1&destination=${GMAPS_QUERY}`;

// ✅ Iframe embed (simple + fiable)
const GMAPS_EMBED_URL = `https://www.google.com/maps?q=${GMAPS_QUERY}&output=embed`;

export default function IletisimPage() {
  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100">
      {/* HERO / INTRO (IDENTIQUE À HOME) */}
      <section className="relative overflow-hidden">
        {/* fond premium (logo: vert + glow cyan) */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-neutral-950 via-neutral-950 to-neutral-950" />

          {/* glow vert */}
          <div className="absolute -left-48 -top-48 h-[560px] w-[560px] rounded-full bg-[#2B5947]/20 blur-3xl" />
          <div className="absolute left-24 top-10 h-[320px] w-[320px] rounded-full bg-[#2B5947]/10 blur-3xl" />

          {/* glow cyan */}
          <div className="absolute -right-56 top-10 h-[640px] w-[640px] rounded-full bg-[#89BFE2]/10 blur-3xl" />
          <div className="absolute right-10 top-56 h-[260px] w-[260px] rounded-full bg-[#89BFE2]/8 blur-3xl" />

          {/* pattern */}
          <div className="absolute inset-0 opacity-[0.06] [background-image:radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] [background-size:28px_28px]" />
        </div>

        {/* mêmes marges que Home */}
        <div className="relative mx-auto max-w-6xl px-6 pt-14 pb-16">
          {/* badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium text-neutral-200 shadow-[0_0_0_1px_rgba(137,191,226,.12)]">
            <span className="h-2 w-2 rounded-full bg-[#89BFE2]" />
            İletişim
          </div>

          <h1 className="mt-8 text-4xl font-bold leading-[1.15] md:text-5xl">
            Bizimle
            <span className="block text-white">İletişime Geçin</span>
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-neutral-300">
            Palas Berber ile iletişime geçmek, adres ve çalışma saatleri hakkında
            bilgi almak için aşağıdaki bilgileri kullanabilirsiniz.
          </p>

          {/* Infos cards */}
          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {/* Adresse */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur hover:bg-white/10 transition">
              <p className="text-sm font-semibold text-white">Adres</p>
              <p className="mt-2 text-sm leading-relaxed text-neutral-300">
                {ADDRESS_DISPLAY}
              </p>

              <a
                href={GMAPS_DIRECTIONS_URL}
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-flex w-fit rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10 hover:border-[#2B5947]/35 transition"
              >
                Yol tarifi al
              </a>
            </div>

            {/* Téléphone */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur hover:bg-white/10 transition">
              <p className="text-sm font-semibold text-white">Telefon</p>

              <a
                href={`tel:${PHONE_TEL}`}
                className="mt-2 inline-flex text-sm text-neutral-300 hover:text-white transition"
              >
                {PHONE_DISPLAY}
              </a>

              <p className="mt-3 text-xs text-neutral-400">
                *Aramak için numaraya dokunabilirsiniz.
              </p>
            </div>

            {/* Horaires */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur hover:bg-white/10 transition">
              <p className="text-sm font-semibold text-white">Çalışma Saatleri</p>
              <p className="mt-2 text-sm leading-relaxed text-neutral-300">
                Pazartesi – Cumartesi
                <br />
                10:00 – 21:00
              </p>
            </div>
          </div>

          {/* MAP */}
          <div className="mt-10 overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur shadow-[0_0_0_1px_rgba(137,191,226,.10)]">
            <div className="flex items-center justify-between gap-4 border-b border-white/10 bg-neutral-950/30 px-6 py-4">
              <p className="text-sm font-semibold text-white">Konum</p>

              <a
                href={`https://www.google.com/maps/search/?api=1&query=${GMAPS_QUERY}`}
                target="_blank"
                rel="noreferrer"
                className="rounded-xl bg-[#2B5947] px-4 py-2 text-sm font-semibold text-white hover:bg-[#356a55] transition"
              >
                Google Maps’te aç
              </a>
            </div>

            <div className="relative h-[340px] w-full">
              <iframe
                title="Palas Berber - Google Maps"
                src={GMAPS_EMBED_URL}
                className="absolute inset-0 h-full w-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
          </div>
        </div>

        {/* fondu discret bas de hero (IDENTIQUE À HOME) */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-neutral-950" />
      </section>

      {/* CTA */}
      <section className="border-t border-white/5">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-10 backdrop-blur md:flex md:items-center md:justify-between">
            <div className="max-w-xl">
              <h2 className="text-2xl font-bold text-white">
                Randevu almak ister misiniz?
              </h2>
              <p className="mt-3 text-neutral-300">
                Online randevu sistemi ile uygun saatinizi kolayca seçin.
              </p>
            </div>

            <Link
              href="/randevu"
              className="mt-6 inline-block rounded-xl bg-[#2B5947] px-6 py-3 text-sm font-semibold text-white hover:bg-[#356a55] transition md:mt-0"
            >
              Randevu Al
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
