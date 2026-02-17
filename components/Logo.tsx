import Image from "next/image";
import Link from "next/link";

export default function Logo() {
  return (
    <Link href="/" className="flex items-center gap-3">
      <div className="relative h-10 w-10 overflow-hidden rounded-xl border bg-white">
        <Image
          src="/brand/logo.png"
          alt="Palas Berber Logo"
          fill
          className="object-contain p-1"
          priority
        />
      </div>

      <div className="leading-tight">
        <p className="text-sm font-semibold tracking-wide">PALAS BERBER</p>
        <p className="text-xs text-neutral-500">Erkek Kuaförü</p>
      </div>
    </Link>
  );
}
