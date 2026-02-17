import Link from "next/link";
import { isConnectedToGoogle } from "@/lib/google";

export const dynamic = "force-dynamic"; // ✅ important

export default function AdminPage({
  searchParams,
}: {
  searchParams: { connected?: string };
}) {
  const connected = isConnectedToGoogle();

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-neutral-950 via-neutral-950 to-neutral-950" />
          <div className="absolute -left-48 -top-48 h-[560px] w-[560px] rounded-full bg-[#2B5947]/20 blur-3xl" />
          <div className="absolute -right-56 top-10 h-[640px] w-[640px] rounded-full bg-[#89BFE2]/10 blur-3xl" />
          <div className="absolute inset-0 opacity-[0.06] [background-image:radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] [background-size:28px_28px]" />
        </div>

        <div className="relative mx-auto max-w-6xl px-6 pt-14 pb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium text-neutral-200">
            <span className="h-2 w-2 rounded-full bg-[#89BFE2]" />
            Yönetim Paneli
          </div>

          <h1 className="mt-8 text-4xl font-bold leading-[1.15] md:text-5xl">
            Admin <span className="block text-white">Paneli</span>
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-neutral-300">
            Google Takvim bağlantısını yönet.
          </p>

          {searchParams.connected && (
            <div className="mt-8 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-emerald-200">
              Google Takvim başarıyla bağlandı ✅
            </div>
          )}

          <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur">
            <h2 className="text-lg font-semibold text-white">Google Takvim</h2>
            <p className="mt-2 text-sm text-neutral-300">
              Bu bağlantı sadece berber içindir. Müşterilerin Google hesabı gerekmez.
            </p>

            <div className="mt-6 rounded-2xl border border-white/10 bg-neutral-950/40 p-4">
              <p className="text-sm text-neutral-300">
                Durum:{" "}
                <span className={connected ? "text-emerald-300" : "text-amber-300"}>
                  {connected ? "Bağlı ✅" : "Bağlı değil"}
                </span>
              </p>
            </div>

            <Link
              href="/api/auth/google"
              className="mt-6 inline-flex rounded-xl bg-[#2B5947] px-5 py-3 font-semibold text-white hover:bg-[#356a55] transition"
            >
              {connected ? "Tekrar Bağlan" : "Google ile Bağlan"}
            </Link>
          </div>
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-neutral-950" />
      </section>
    </main>
  );
}
