"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useId, useRef, useState } from "react";

const navLinks = [
  { href: "/hizmetler", label: "Hizmetler" },
  { href: "/galeri", label: "Galeri" },
  { href: "/iletisim", label: "İletişim" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const panelId = useId();

  const lastY = useRef(0);
  const rafId = useRef<number | null>(null);

  // Réglages
  const HIDE_AFTER_Y = 120; // on ne cache pas tant qu'on n'a pas scroll un peu
  const HIDE_DELTA = 8;     // descente franche pour cacher (anti-flicker)

  // Ferme le menu quand on repasse en desktop
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768) setOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Empêche le scroll quand menu mobile ouvert
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Ferme avec Escape
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  // ✅ Scroll logic ROBUSTE : si on remonte (même 1px) => on montre
  useEffect(() => {
    lastY.current = window.scrollY;

    const update = () => {
      const y = window.scrollY;
      const prev = lastY.current;

      // Toujours visible si menu ouvert ou tout en haut
      if (open || y < 10) {
        setHidden(false);
      } else {
        // ✅ Si on remonte (y diminue) => on montre immédiatement (fix ton bug)
        if (y < prev) setHidden(false);

        // Si on descend franchement + assez bas => on cache
        if (y > prev + HIDE_DELTA && y > HIDE_AFTER_Y) setHidden(true);
      }

      lastY.current = y;
      rafId.current = null;
    };

    const onScroll = () => {
      if (rafId.current != null) return;
      rafId.current = window.requestAnimationFrame(update);
    };

    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafId.current != null) cancelAnimationFrame(rafId.current);
    };
  }, [open]);

  // ✅ petit bonus : quand on ferme le menu, on resynchronise lastY
  useEffect(() => {
    if (!open) lastY.current = window.scrollY;
  }, [open]);

  return (
    <>
      <header
        className={[
          "sticky top-0 z-50",
          "border-b border-white/10 bg-neutral-950/80 backdrop-blur",
          "shadow-[0_0_0_1px_rgba(137,191,226,.10)]",
          "transition-transform duration-200 will-change-transform",
          hidden ? "-translate-y-full" : "translate-y-0",
        ].join(" ")}
      >
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-3 rounded-2xl px-2 py-1 hover:bg-white/5 transition"
            onClick={() => setOpen(false)}
          >
            <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-white/5 shadow-[0_0_0_1px_rgba(43,89,71,.25)]">
              <Image
                src="/brand/logo.png"
                alt="Palas Berber Logo"
                width={40}
                height={40}
                className="h-full w-full object-cover"
                priority
              />
            </div>

            <div className="leading-tight">
              <p className="text-sm font-semibold tracking-wide text-white">
                PALAS BERBER
              </p>
              <p className="text-xs text-neutral-400">Erkek Kuaförü</p>
            </div>
          </Link>

          {/* Menu desktop */}
          <nav className="hidden items-center gap-6 md:flex">
            {navLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-sm font-medium text-neutral-300 hover:text-white transition"
              >
                {l.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {/* CTA desktop */}
            <Link
              href="/randevu"
              className="hidden rounded-xl bg-[#2B5947] px-4 py-2 text-sm font-semibold text-white shadow-[0_0_0_1px_rgba(43,89,71,.35)] hover:bg-[#356a55] hover:shadow-[0_0_0_1px_rgba(137,191,226,.25)] transition md:inline-flex"
            >
              Randevu Al
            </Link>

            {/* Burger mobile */}
            <button
              type="button"
              aria-label="Menüyü Aç/Kapat"
              aria-expanded={open}
              aria-controls={panelId}
              onClick={() => setOpen((v) => !v)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-[#89BFE2]/25 transition md:hidden"
            >
              <div className="grid gap-1">
                <span
                  className={`block h-0.5 w-5 bg-white transition ${
                    open ? "translate-y-1.5 rotate-45" : ""
                  }`}
                />
                <span
                  className={`block h-0.5 w-5 bg-white transition ${
                    open ? "opacity-0" : ""
                  }`}
                />
                <span
                  className={`block h-0.5 w-5 bg-white transition ${
                    open ? "-translate-y-1.5 -rotate-45" : ""
                  }`}
                />
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* Drawer mobile FIXED */}
      {open && (
        <div className="md:hidden">
          <button
            aria-label="Fermer le menu"
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-[60] cursor-default bg-black/55"
          />

          <div
            id={panelId}
            role="dialog"
            aria-modal="true"
            className="fixed left-0 right-0 top-0 z-[70] border-b border-white/10 bg-neutral-950/95 backdrop-blur shadow-[0_0_0_1px_rgba(137,191,226,.12)]"
          >
            <div className="mx-auto max-w-6xl px-6 py-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-white">Menü</p>
                <button
                  onClick={() => setOpen(false)}
                  className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-neutral-200 hover:bg-white/10 hover:border-[#89BFE2]/25 transition"
                >
                  Kapat
                </button>
              </div>

              <div className="mt-4 grid gap-2">
                {navLinks.map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-neutral-200 hover:bg-white/10 hover:border-[#2B5947]/35 transition"
                  >
                    {l.label}
                  </Link>
                ))}

                <Link
                  href="/randevu"
                  onClick={() => setOpen(false)}
                  className="mt-2 rounded-xl bg-[#2B5947] px-4 py-3 text-center text-sm font-semibold text-white hover:bg-[#356a55] transition"
                >
                  Randevu Al
                </Link>
              </div>

              <p className="mt-4 text-xs text-neutral-500">Ümraniye • İstanbul</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
