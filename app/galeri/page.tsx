import Link from "next/link";

const PHOTOS = [
  "/images/galeri/cut-3.jpg",
  "/images/galeri/cut-6.jpg",
  "/images/galeri/cut-4.jpg",
  "/images/galeri/cut-5.jpg",
  "/images/galeri/cut-2.jpg",
  "/images/galeri/cut-7.jpg",
  "/images/galeri/cut-8.jpg",
  "/images/galeri/cut-9.jpg",
  "/images/galeri/cut-10.jpg",
];

export default function GaleriPage() {
  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100">
      {/* HERO / INTRO */}
      <section className="relative overflow-hidden">
        {/* fond premium IDENTIQUE à Home */}
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
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium text-neutral-200 shadow-[0_0_0_1px_rgba(137,191,226,.12)]">
              <span className="h-2 w-2 rounded-full bg-[#89BFE2]" />
              Galeri
            </div>

            <h1 className="mt-8 text-4xl font-bold leading-[1.15] md:text-5xl">
              Galeri
              <span className="block text-white">Atmosfer & İşçilik</span>
            </h1>

            <p className="mt-6 text-lg leading-relaxed text-neutral-300">
              Salonumuzun atmosferini, detaylara verdiğimiz önemi ve ustalığımızı
              yansıtan kareler. Her fotoğraf, Palas Berber imzasını taşır.
            </p>
          </div>
        </div>

        {/* dégradé bas identique */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-neutral-950" />
      </section>

      {/* GALERIE PHOTOS */}
      <section className="border-t border-white/5">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {PHOTOS.map((src, i) => (
              <div
                key={src}
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 transition hover:bg-white/10 hover:border-[#2B5947]/35"
              >
                {/* ✅ ratio 4:5 */}
                <div className="relative w-full aspect-[4/5]">
                  <img
                    src={src}
                    alt="Palas Berber galeri"
                    loading={i < 3 ? "eager" : "lazy"}
                    className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                  />
                  {/* overlay */}
                  <div className="absolute inset-0 bg-black/10 opacity-0 transition group-hover:opacity-100" />
                  <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-[#89BFE2]/10" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STORY */}
      <section className="border-t border-white/5">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <div className="max-w-3xl rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur shadow-[0_0_0_1px_rgba(137,191,226,.10)]">
            <h2 className="text-2xl font-bold text-white">Bir stil, bir karakter</h2>

            <p className="mt-4 leading-relaxed text-neutral-300">
              Palas Berber’de her kesim, yüz hatlarına ve kişisel stile özel olarak
              tasarlanır. Amacımız sadece saç kesmek değil; modern, temiz ve özgüvenli
              bir görünüm sunmaktır.
            </p>

            <p className="mt-4 leading-relaxed text-neutral-300">
              Bu galeri, salonumuzun ruhunu ve yaptığımız işin kalitesini yansıtmak
              için hazırlandı. En güncel çalışmalarımızı burada bulabilirsiniz.
            </p>
          </div>
        </div>
      </section>

      {/* CTA RENDEZVOUS */}
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
              className="mt-6 inline-block rounded-xl bg-[#2B5947] px-6 py-3 font-semibold text-white shadow-[0_0_0_1px_rgba(43,89,71,.35)] hover:bg-[#356a55] hover:shadow-[0_0_0_1px_rgba(137,191,226,.25)] transition md:mt-0"
            >
              Randevu Al
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
