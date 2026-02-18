import Link from "next/link";
import { SERVICES } from "@/lib/services";

const slots = ["10:30", "11:00", "12:15", "14:00", "16:30", "18:45"];

// ✅ Google Maps (avis)
const GOOGLE_MAPS_URL =
  "https://www.google.com/maps/place/PALAS+BERBER/@41.0287457,29.0923813,734m/data=!3m1!1e3!4m18!1m9!3m8!1s0x14cac99983e8581f:0xf2a6801325f97951!2sPALAS+BERBER!8m2!3d41.0287457!4d29.0949562!9m1!1b1!16s%2Fg%2F11y2f60vn9!3m7!1s0x14cac99983e8581f:0xf2a6801325f97951!8m2!3d41.0287457!4d29.0949562!9m1!1b1!16s%2Fg%2F11y2f60vn9?entry=ttu&g_ep=EgoyMDI2MDIwNC4wIKXMDSoASAFQAw%3D%3D";

function Stars({ count = 5 }: { count?: number }) {
  return (
    <span className="inline-flex items-center gap-0.5" aria-hidden="true">
      {Array.from({ length: count }).map((_, i) => (
        <svg
          key={i}
          viewBox="0 0 20 20"
          className="h-4 w-4 text-[#F7D26A]"
          fill="currentColor"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.538 1.118l-2.8-2.034a1 1 0 00-1.176 0l-2.8 2.034c-.783.57-1.838-.197-1.538-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81H7.03a1 1 0 00.95-.69l1.07-3.292z" />
        </svg>
      ))}
    </span>
  );
}

export default function Home() {
  const top3 = SERVICES.slice(0, 3);

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100">
      {/* HERO */}
      <section className="relative overflow-hidden">
        {/* fond premium */}
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

        <div className="relative mx-auto max-w-6xl px-6 pt-14 pb-16">
          <div className="grid gap-16 md:grid-cols-2 md:items-center">
            {/* LEFT */}
            <div>
              {/* badge + google rating */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium text-neutral-200 shadow-[0_0_0_1px_rgba(137,191,226,.12)]">
                  <span className="h-2 w-2 rounded-full bg-[#89BFE2]" />
                  Ümraniye • İstanbul
                </div>

                {/* Google rating cliquable */}
                <a
                  href={GOOGLE_MAPS_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium text-neutral-100 shadow-[0_0_0_1px_rgba(43,89,71,.18)] hover:bg-white/10 transition"
                  aria-label="Google yorumlarını görüntüle"
                  title="Google yorumlarını görüntüle"
                >
                  <Stars />
                  <span className="text-neutral-200">5.0 • +135 Google yorumu</span>
                </a>
              </div>

              <h1 className="mt-8 text-4xl font-bold leading-[1.15] md:text-5xl">
                Erkek bakımında
                <span className="block text-white">premium deneyim.</span>
              </h1>

              <p className="mt-6 max-w-xl text-lg leading-relaxed text-neutral-300">
                Saç, sakal ve stil… Modern dokunuş, temiz işçilik ve dakik randevu
                sistemi.
              </p>

              <div className="mt-10 flex flex-wrap gap-4">
                <Link
                  href="/randevu"
                  className="rounded-xl bg-[#2B5947] px-6 py-3 text-sm font-semibold text-white shadow-[0_0_0_1px_rgba(43,89,71,.35)] hover:bg-[#356a55] hover:shadow-[0_0_0_1px_rgba(137,191,226,.25)] transition"
                >
                  Randevu Al
                </Link>

                <Link
                  href="/hizmetler"
                  className="rounded-xl border border-white/15 bg-white/5 px-6 py-3 text-sm font-medium text-white hover:bg-white/10 transition"
                >
                  Hizmetler &amp; Fiyatlar
                </Link>
              </div>

              <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-3">
                {[
                  { t: "Hijyen", d: "Temiz ve steril ekipman." },
                  { t: "Dakiklik", d: "Randevu saatine sadık hizmet." },
                  { t: "Stil", d: "Yüz tipine uygun modern kesimler." },
                ].map((x) => (
                  <div
                    key={x.t}
                    className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur hover:bg-white/10 transition"
                  >
                    <p className="text-sm font-semibold text-white">{x.t}</p>
                    <p className="mt-2 text-sm leading-relaxed text-neutral-300">
                      {x.d}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT — Premium booking card */}
            <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur shadow-[0_0_0_1px_rgba(137,191,226,.10)] md:mt-8">
              <div className="rounded-2xl border border-white/10 bg-neutral-950/40 p-7">
                <p className="text-sm font-semibold text-white">Bugün müsait saatler</p>
                <p className="mt-2 text-sm leading-relaxed text-neutral-300">
                  Online randevu ile uygun saatini hemen seç.
                </p>

                <div className="mt-6 grid grid-cols-3 gap-3">
                  {slots.map((t) => (
                    <div
                      key={t}
                      className="rounded-xl border border-white/10 bg-white/5 py-2 text-center text-sm text-neutral-200 hover:bg-white/10 hover:border-[#89BFE2]/30 transition"
                    >
                      {t}
                    </div>
                  ))}
                </div>

                <Link
                  href="/randevu"
                  className="mt-6 block rounded-xl bg-[#2B5947] px-5 py-3 text-center text-sm font-semibold text-white hover:bg-[#356a55] transition"
                >
                  Saat Seç
                </Link>

                <p className="mt-4 text-xs text-neutral-400">
                  *Saatler örnektir. Gerçek müsaitlik randevu sayfasında görünür.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-neutral-950" />
      </section>

      {/* SERVICES (synchro avec /hizmetler) */}
      <section className="border-t border-white/5">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <div className="flex flex-col gap-2">
            <h2 className="text-2xl font-bold text-white">Hizmetler</h2>
            <p className="text-neutral-300">
              Hızlı seçim yap: en çok tercih edilen 3 hizmet + tümünü keşfet.
            </p>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-4">
            {top3.map((s) => (
              <div
                key={s.key}
                className="group rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:bg-white/10 hover:border-[#2B5947]/35"
              >
                <p className="font-semibold text-white">{s.titleTR}</p>
                <p className="mt-2 text-sm text-neutral-300">{s.descTR}</p>

                <Link
                  href={`/randevu?service=${encodeURIComponent(s.key)}`}
                  className="
                    mt-5 inline-flex w-full items-center justify-between gap-3
                    rounded-xl bg-[#2B5947] px-4 py-3
                    text-sm font-semibold text-white
                    shadow-[0_0_0_1px_rgba(43,89,71,.45),0_12px_30px_rgba(0,0,0,.28)]
                    transition
                    hover:bg-[#356a55]
                    hover:shadow-[0_0_0_1px_rgba(137,191,226,.25),0_12px_30px_rgba(0,0,0,.28)]
                    focus:outline-none focus:ring-2 focus:ring-[#89BFE2]/40
                    md:w-fit md:justify-center md:gap-2 md:py-2
                  "
                >
                  <span>Seç</span>

                  <svg
                    className="h-5 w-5 text-white/90 md:hidden"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.21 14.77a.75.75 0 01.02-1.06L10.94 10 7.23 6.29a.75.75 0 111.06-1.06l4.24 4.24a.75.75 0 010 1.06l-4.24 4.24a.75.75 0 01-1.08.02z"
                      clipRule="evenodd"
                    />
                  </svg>
                </Link>
              </div>
            ))}

            {/* 4ème carte : découvrir tous les services */}
            <Link
              href="/hizmetler"
              className="group rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:bg-white/10 hover:border-[#89BFE2]/25"
            >
              <div className="flex h-full flex-col justify-between">
                <div>
                  <p className="font-semibold text-white">Tüm Hizmetleri Keşfet</p>
                  <p className="mt-2 text-sm text-neutral-300">
                    Fiyatları ve tüm seçenekleri görüntüle.
                  </p>
                </div>

                <div className="mt-5 inline-flex w-full items-center justify-between rounded-xl border border-white/10 bg-neutral-950/30 px-4 py-3 text-sm font-semibold text-white transition group-hover:bg-white/10 md:w-fit md:justify-center md:gap-2 md:py-2">
                  <span>Hizmetler</span>
                  <svg
                    className="h-5 w-5 text-white/90 md:hidden"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.21 14.77a.75.75 0 01.02-1.06L10.94 10 7.23 6.29a.75.75 0 111.06-1.06l4.24 4.24a.75.75 0 010 1.06l-4.24 4.24a.75.75 0 01-1.08.02z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* WHY US + PHOTOS */}
      <section className="border-t border-white/5">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <h2 className="text-2xl font-bold text-white">Neden Palas Berber?</h2>
          <p className="mt-2 text-neutral-300">
            Detaylara önem veren, modern erkek kuaförü deneyimi.
          </p>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {[
              { t: "Profesyonel Ekip", d: "Deneyimli berberler, güçlü teknik." },
              { t: "Premium Atmosfer", d: "Şık ve rahat salon ortamı." },
              { t: "Online Randevu", d: "Boş saatleri gör, hızlıca rezervasyon yap." },
            ].map((x) => (
              <div
                key={x.t}
                className="rounded-2xl border border-white/10 bg-white/5 p-6 hover:bg-white/10 hover:border-[#89BFE2]/25 transition"
              >
                <p className="font-semibold text-white">{x.t}</p>
                <p className="mt-2 text-sm leading-relaxed text-neutral-300">
                  {x.d}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-12 mx-auto max-w-4xl">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {["/images/salon-1.jpg", "/images/salon-2.jpg", "/images/salon-3.jpg"].map(
                (src, i) => (
                  <div
                    key={i}
                    className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-[0_0_0_1px_rgba(43,89,71,.25)]"
                  >
                    <img
                      src={src}
                      alt={`Palas Berber ${i + 1}`}
                      className="h-[140px] w-full object-cover sm:h-[150px]"
                    />
                    <div className="absolute inset-0 bg-black/25" />
                    <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-[#89BFE2]/10" />
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-white/5">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-10 backdrop-blur md:flex md:items-center md:justify-between">
            <div className="max-w-xl">
              <h2 className="text-2xl font-bold text-white">
                Hazır mısın? Randevunu hemen oluştur.
              </h2>
              <p className="mt-3 text-neutral-300">
                Uygun saati seç, bilgilerini gir, randevun onaylansın.
              </p>
            </div>

            <Link
              href="/randevu"
              className="mt-6 inline-block rounded-xl bg-[#2B5947] px-6 py-3 font-semibold text-white hover:bg-[#356a55] transition md:mt-0"
            >
              Randevu Al
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
