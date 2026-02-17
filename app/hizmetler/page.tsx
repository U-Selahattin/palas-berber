import Link from "next/link";
import { SERVICES, fmtServicePrice } from "@/lib/services";

export default function HizmetlerPage() {
  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100">
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-neutral-950 via-neutral-950 to-neutral-950" />

          <div className="absolute -left-48 -top-48 h-[560px] w-[560px] rounded-full bg-[#2B5947]/20 blur-3xl" />
          <div className="absolute left-24 top-10 h-[320px] w-[320px] rounded-full bg-[#2B5947]/10 blur-3xl" />

          <div className="absolute -right-56 top-10 h-[640px] w-[640px] rounded-full bg-[#89BFE2]/10 blur-3xl" />
          <div className="absolute right-10 top-56 h-[260px] w-[260px] rounded-full bg-[#89BFE2]/8 blur-3xl" />

          <div className="absolute inset-0 opacity-[0.06] [background-image:radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] [background-size:28px_28px]" />
        </div>

        <div className="relative mx-auto max-w-6xl px-6 pt-14 pb-16">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium text-neutral-200 shadow-[0_0_0_1px_rgba(137,191,226,.12)]">
                <span className="h-2 w-2 rounded-full bg-[#89BFE2]" />
                Hizmetler • Fiyatlar
              </div>

              <h1 className="mt-8 text-4xl font-bold leading-[1.15] md:text-5xl">
                Hizmetler
                <span className="block text-white">&amp; Fiyatlar</span>
              </h1>

              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-neutral-300">
                İstediğin hizmeti seç, uygun saati randevu sayfasında kolayca ayarla.
              </p>
            </div>

            <Link
              href="/randevu"
              className="mt-6 inline-flex w-fit rounded-xl bg-[#2B5947] px-6 py-3 text-sm font-semibold text-white shadow-[0_0_0_1px_rgba(43,89,71,.35)] hover:bg-[#356a55] transition md:mt-0"
            >
              Randevu Al
            </Link>
          </div>
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-neutral-950" />
      </section>

      {/* SERVICES LIST */}
      <section className="border-t border-white/5">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <div className="grid gap-4 md:grid-cols-2">
            {SERVICES.map((s) => (
              <div
                key={s.key}
                className="group rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:bg-white/10 hover:border-[#2B5947]/35"
              >
                <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
                  {/* LEFT CONTENT */}
                  <div>
                    <p className="text-lg font-semibold text-white">
                      {s.titleTR}
                    </p>

                    <p className="mt-2 text-sm leading-relaxed text-neutral-300">
                      {s.descTR}
                    </p>

                    <div className="mt-5 flex flex-wrap gap-2 text-sm">
                      <span className="rounded-xl border border-white/10 bg-white/5 px-3 py-1 text-neutral-200">
                        {fmtServicePrice(s)}
                      </span>

                      {s.priceToTRY && (
                        <span className="rounded-xl border border-white/10 bg-white/5 px-3 py-1 text-neutral-300">
                          *Saça bağlı
                        </span>
                      )}
                    </div>
                  </div>

                  {/* ✅ BOUTON VERSION MOBILE IDENTIQUE HOME */}
                  <Link
                    href={`/randevu?service=${s.key}`}
                    className="
                      inline-flex w-full items-center justify-between gap-3
                      rounded-xl bg-[#2B5947] px-4 py-3
                      text-sm font-semibold text-white
                      shadow-[0_0_0_1px_rgba(43,89,71,.45),0_12px_30px_rgba(0,0,0,.28)]
                      transition
                      hover:bg-[#356a55]
                      focus:outline-none focus:ring-2 focus:ring-[#89BFE2]/40
                      md:w-fit md:justify-center md:gap-2 md:px-4 md:py-2
                    "
                  >
                    <span>Seç</span>

                    {/* flèche visible seulement mobile */}
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
              </div>
            ))}
          </div>

          {/* INFO */}
          <div className="mt-12 rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur">
            <h2 className="text-xl font-bold text-white">Bilgi</h2>

            <ul className="mt-4 list-disc space-y-2 pl-5 text-neutral-300">
              <li>Randevu saatinden 5–10 dakika önce gelmeni öneririz.</li>
              <li>Geç kalma durumunda randevu süresi kısalabilir.</li>
              <li>İptal veya değişiklik için bizimle iletişime geçebilirsin.</li>
            </ul>

            <Link
              href="/randevu"
              className="mt-6 inline-flex rounded-xl bg-[#2B5947] px-6 py-3 text-sm font-semibold text-white hover:bg-[#356a55] transition"
            >
              Randevu Oluştur
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
