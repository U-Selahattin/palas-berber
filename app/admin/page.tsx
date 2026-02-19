import Link from "next/link";
import { isConnectedToGoogle } from "@/lib/google";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminPage({
  searchParams,
}: {
  searchParams: { connected?: string; error?: string };
}) {
  const connected = await isConnectedToGoogle();

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100">
      <div className="mx-auto max-w-4xl px-6 py-12">
        <h1 className="text-3xl font-bold">Admin</h1>

        {searchParams.connected === "1" && (
          <div className="mt-6 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-emerald-200">
            Google Takvim başarıyla bağlandı ✅
          </div>
        )}

        {searchParams.error && (
          <div className="mt-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-200">
            Hata: {searchParams.error}
          </div>
        )}

        <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6">
          <p className="text-sm text-neutral-300">
            Durum:{" "}
            <span className={connected ? "text-emerald-300" : "text-amber-300"}>
              {connected ? "Bağlı ✅" : "Bağlı değil"}
            </span>
          </p>

          <Link
            href="/api/auth/google"
            className="mt-6 inline-flex rounded-xl bg-[#2B5947] px-5 py-3 font-semibold text-white hover:bg-[#356a55] transition"
          >
            {connected ? "Tekrar Bağlan" : "Google ile Bağlan"}
          </Link>
        </div>
      </div>
    </main>
  );
}
