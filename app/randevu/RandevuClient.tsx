"use client";



import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { SERVICES, fmtServicePrice, type Service } from "@/lib/services";

const PHONE_DISPLAY = "+90 507 174 93 76";
const PHONE_TEL = "+905071749376";
const ADDRESS_DISPLAY =
  "Atatürk, Çavuşbaşı Cd. no:81/C, 34760 Ümraniye/İstanbul";

const GMAPS_QUERY = encodeURIComponent(ADDRESS_DISPLAY);
const GMAPS_DIRECTIONS_URL = `https://www.google.com/maps/dir/?api=1&destination=${GMAPS_QUERY}`;

function sumMinPrice(keys: string[]) {
  return keys.reduce((sum, k) => {
    const s = SERVICES.find((x) => x.key === k);
    return sum + (s?.priceFromTRY ?? 0);
  }, 0);
}

function hasRangePrice(keys: string[]) {
  return keys.some((k) => {
    const s = SERVICES.find((x) => x.key === k);
    return Boolean(s?.priceToTRY);
  });
}

/**
 * ✅ TR mobile validation (simple + solide)
 * On accepte uniquement les mobiles TR qui commencent par 5 (après nettoyage).
 *
 * Accepté :
 * - 05XXXXXXXXX (11 digits)
 * - 5XXXXXXXXX  (10 digits)
 * - +905XXXXXXXXX / 905XXXXXXXXX
 * - avec espaces / tirets / parenthèses
 *
 * Output normalisé : +90 + 10 digits
 */
function toE164TRMobile(input: string): string | null {
  const digits = input.replace(/\D/g, "");

  // 05XXXXXXXXX
  if (digits.length === 11 && digits.startsWith("0")) {
    const d10 = digits.slice(1);
    if (/^5\d{9}$/.test(d10)) return `+90${d10}`;
    return null;
  }

  // 5XXXXXXXXX
  if (digits.length === 10) {
    if (/^5\d{9}$/.test(digits)) return `+90${digits}`;
    return null;
  }

  // 905XXXXXXXXX
  if (digits.length === 12 && digits.startsWith("90")) {
    const d10 = digits.slice(2);
    if (/^5\d{9}$/.test(d10)) return `+90${d10}`;
    return null;
  }

  return null;
}

export default function RandevuPage() {
  const searchParams = useSearchParams();
  const preselectedService = (searchParams.get("service") ?? "").trim();

  const [services, setServices] = useState<string[]>(
    preselectedService ? [preselectedService] : []
  );
  const [pendingService, setPendingService] = useState<string>("");

  const [date, setDate] = useState("");
  const [slot, setSlot] = useState("");

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [phoneTouched, setPhoneTouched] = useState(false);

  const [slots, setSlots] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [slotsError, setSlotsError] = useState<string | null>(null);

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const selectedServices = useMemo<Service[]>(
    () =>
      services
        .map((k) => SERVICES.find((s) => s.key === k))
        .filter((s): s is Service => Boolean(s)),
    [services]
  );

  const minTotal = useMemo(() => sumMinPrice(services), [services]);
  const showPlus = useMemo(() => hasRangePrice(services), [services]);

  // ✅ phone validation
  const phoneE164 = useMemo(() => toE164TRMobile(phone), [phone]);
  const phoneIsValid = Boolean(phoneE164);

  const phoneError =
    phoneTouched && !phoneIsValid
      ? "Geçerli bir Türkiye cep telefonu girin. Örn: 05XXXXXXXXX veya +90 5XX XXX XX XX"
      : null;

  // Load slots
  useEffect(() => {
    async function load() {
      if (services.length === 0 || !date) {
        setSlots([]);
        setSlot("");
        setSlotsError(null);
        return;
      }

      setLoadingSlots(true);
      setSlotsError(null);
      setSlot("");

      try {
        const res = await fetch("/api/availability", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ serviceKeys: services, dateISO: date }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data?.error || "Bir hata oluştu.");

        setSlots(Array.isArray(data?.slots) ? data.slots : []);
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : "Bir hata oluştu.";
        setSlots([]);
        setSlotsError(msg);
      } finally {
        setLoadingSlots(false);
      }
    }

    load();
  }, [services, date]);

  function addService() {
    const k = pendingService.trim();
    if (!k) return;
    if (services.includes(k)) return;

    setServices((prev) => [...prev, k]);
    setPendingService("");
  }

  function removeService(key: string) {
    setServices((prev) => prev.filter((k) => k !== key));

    // reset slots si plus aucun service
    if (services.length === 1 && services[0] === key) {
      setSlots([]);
      setSlot("");
      setSlotsError(null);
    }
  }

  async function handleSubmit() {
    if (services.length === 0 || !date || !slot || name.trim().length < 2 || !phoneE164) return;

    setSubmitting(true);
    setSubmitError(null);
    setSuccessMsg(null);

    try {
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceKeys: services,
          dateISO: date,
          timeHHMM: slot,
          name: name.trim(),
          phone: phoneE164, // ✅ toujours normalisé
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Randevu oluşturulamadı.");

      setSuccessMsg("Randevun başarıyla oluşturuldu ✅");
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Bir hata oluştu.";
      setSubmitError(msg);
    } finally {
      setSubmitting(false);
    }
  }

  const canSubmit =
    selectedServices.length > 0 &&
    Boolean(date) &&
    Boolean(slot) &&
    name.trim().length >= 2 &&
    phoneIsValid &&
    !submitting;

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100">
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
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium text-neutral-200 shadow-[0_0_0_1px_rgba(137,191,226,.12)]">
            <span className="h-2 w-2 rounded-full bg-[#89BFE2]" />
            Randevu
          </div>

          <h1 className="mt-8 text-4xl font-bold leading-[1.15] md:text-5xl">
            Randevu <span className="block text-white">Oluştur</span>
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-neutral-300">
            Hizmetlerini seç, tarihi belirle, uygun saati seç ve randevunu oluştur.
          </p>

          <div className="mt-12 grid gap-8 md:grid-cols-2">
            {/* LEFT */}
            <div className="space-y-6">
              <div>
                <label className="text-sm font-medium text-neutral-200">
                  Hizmetler
                </label>

                {selectedServices.length > 0 ? (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {selectedServices.map((s) => (
                      <span
                        key={s.key}
                        className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-neutral-200"
                      >
                        <span className="font-medium text-white">{s.titleTR}</span>
                        <span className="text-neutral-400">({fmtServicePrice(s)})</span>

                        <button
                          type="button"
                          onClick={() => removeService(s.key)}
                          className="ml-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-black/20 ring-1 ring-white/10 hover:bg-white/10 transition"
                          aria-label={`${s.titleTR} hizmetini kaldır`}
                          title="Hizmeti kaldır"
                        >
                          <span className="text-xs leading-none">✕</span>
                        </button>
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="mt-3 text-sm text-neutral-400">Henüz hizmet seçilmedi.</p>
                )}

                <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
                  <div className="relative w-full">
                    <label htmlFor="serviceSelect" className="sr-only">
                      Hizmet seçiniz
                    </label>

                    <select
                      id="serviceSelect"
                      name="serviceSelect"
                      value={pendingService}
                      onChange={(e) => setPendingService(e.target.value)}
                      className="w-full appearance-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 pr-10 text-white outline-none transition
                                 focus:border-[rgba(43,89,71,.65)] focus:bg-white/10"
                    >
                      <option value="" className="bg-neutral-950 text-neutral-200">
                        Hizmet seçiniz
                      </option>

                      {SERVICES.map((s) => (
                        <option
                          key={s.key}
                          value={s.key}
                          className="bg-neutral-950 text-neutral-100"
                          disabled={services.includes(s.key)}
                        >
                          {s.titleTR}
                        </option>
                      ))}
                    </select>

                    <svg
                      className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-300"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>

                  <button
                    type="button"
                    onClick={addService}
                    disabled={!pendingService}
                    className="w-full sm:w-fit rounded-xl bg-[#2B5947] px-5 py-3 text-sm font-semibold text-white disabled:opacity-40 transition hover:bg-[#356a55]"
                  >
                    Hizmet ekle
                  </button>
                </div>
              </div>

              {/* Date */}
              <div>
                <label htmlFor="dateInput" className="text-sm font-medium text-neutral-200">
                  Tarih
                </label>

                <input
                  id="dateInput"
                  name="dateInput"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="date-dark mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition
                             focus:border-[rgba(43,89,71,.65)] focus:bg-white/10"
                />
              </div>

              {/* Slots */}
              {services.length > 0 && date && (
                <div>
                  <label className="text-sm font-medium text-neutral-200">
                    Uygun Saatler
                  </label>

                  {loadingSlots && (
                    <p className="mt-3 text-sm text-neutral-400">Saatler yükleniyor…</p>
                  )}

                  {slotsError && (
                    <p className="mt-3 text-sm text-red-400">{slotsError}</p>
                  )}

                  {!loadingSlots && !slotsError && slots.length === 0 && (
                    <p className="mt-3 text-sm text-neutral-400">
                      Seçilen tarih için uygun saat bulunamadı.
                    </p>
                  )}

                  <div role="radiogroup" aria-label="Uygun saat seçimi" className="mt-3 grid grid-cols-3 gap-2">
                    {slots.map((t) => {
                      const active = slot === t;
                      return (
                        <button
                          key={t}
                          type="button"
                          role="radio"
                          aria-checked={active}
                          onClick={() => setSlot(t)}
                          className={`rounded-xl border px-3 py-2 text-sm transition ${
                            active
                              ? "bg-[#2B5947] border-[rgba(43,89,71,.65)] text-white shadow-[0_0_18px_rgba(43,89,71,.25)]"
                              : "border-white/10 bg-white/5 text-neutral-200 hover:bg-white/10"
                          }`}
                          aria-label={`Saat seç: ${t}`}
                          title={`Saat seç: ${t}`}
                        >
                          {t}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* RIGHT */}
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur shadow-[0_0_0_1px_rgba(137,191,226,.10)]">
              <h2 className="text-lg font-semibold text-white">Randevu Özeti</h2>

              {selectedServices.length > 0 ? (
                <div className="mt-4 space-y-3 text-sm">
                  <div className="space-y-2">
                    {selectedServices.map((s) => (
                      <div key={s.key} className="flex items-start justify-between gap-4 text-neutral-200">
                        <span className="font-medium text-white">{s.titleTR}</span>
                        <span className="shrink-0 text-neutral-300">{fmtServicePrice(s)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-3 border-t border-white/10 pt-3 flex items-center justify-between">
                    <span className="text-neutral-300">Toplam</span>
                    <span className="font-semibold text-white">
                      {minTotal.toLocaleString("tr-TR")} ₺{showPlus ? "+" : ""}
                    </span>
                  </div>

                  {showPlus && (
                    <p className="text-xs text-neutral-400">
                      *Keratin gibi hizmetlerde fiyat saç yapısına göre değişebilir.
                    </p>
                  )}
                </div>
              ) : (
                <p className="mt-4 text-sm text-neutral-400">Hizmet seçince özet burada görünecek.</p>
              )}

              {date && slot && (
                <p className="mt-4 text-sm text-neutral-200">
                  Tarih &amp; Saat: <strong>{date} – {slot}</strong>
                </p>
              )}

              <div className="mt-6 space-y-4">
                <label htmlFor="fullName" className="sr-only">Ad Soyad</label>
                <input
                  id="fullName"
                  name="fullName"
                  autoComplete="name"
                  placeholder="Ad Soyad"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition
                             focus:border-[rgba(43,89,71,.65)] focus:bg-white/10"
                />

                <label htmlFor="phoneInput" className="sr-only">Telefon</label>
                <input
                  id="phoneInput"
                  name="phoneInput"
                  inputMode="tel"
                  autoComplete="tel"
                  placeholder="Telefon"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}   // ✅ pas de format auto
                  onBlur={() => setPhoneTouched(true)}
                  className={`w-full rounded-xl border bg-white/5 px-4 py-3 text-white outline-none transition focus:bg-white/10 ${
                    phoneError
                      ? "border-red-400/60 focus:border-red-400/80"
                      : "border-white/10 focus:border-[rgba(43,89,71,.65)]"
                  }`}
                />
                {phoneError && <p className="text-xs text-red-400">{phoneError}</p>}
              </div>

              {submitError && <p className="mt-4 text-sm text-red-400">{submitError}</p>}
              {successMsg && <p className="mt-4 text-sm text-green-400">{successMsg}</p>}

              <button
                onClick={handleSubmit}
                disabled={!canSubmit}
                className="mt-6 w-full rounded-xl px-5 py-3 font-semibold text-white disabled:opacity-40 transition
                           bg-[#2B5947] shadow-[0_0_22px_rgba(43,89,71,.25)] hover:bg-[#356a55]"
              >
                {submitting ? "Oluşturuluyor…" : "Randevu Oluştur"}
              </button>

              <p className="mt-4 text-xs text-neutral-500">
                *Seçimlerin randevu sistemine göre doğrulanır.
              </p>

              <div className="mt-6 rounded-2xl border border-white/10 bg-neutral-950/30 p-5">
                <p className="text-sm font-semibold text-white">Konum &amp; Bilgi</p>

                <p className="mt-2 text-sm leading-relaxed text-neutral-300">
                  <span className="text-neutral-200">Adres:</span> {ADDRESS_DISPLAY}
                </p>

                <p className="mt-3 text-sm leading-relaxed text-neutral-300">
                  Lütfen randevundan{" "}
                  <span className="text-white">5–10 dakika önce</span> gel.
                  Geç kalma durumunda hizmet süresi kısalabilir.
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  <a
                    href={GMAPS_DIRECTIONS_URL}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex w-fit items-center justify-center rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10 hover:border-[#2B5947]/35 transition"
                  >
                    Yol tarifi al
                  </a>

                  <a
                    href={`tel:${PHONE_TEL}`}
                    className="inline-flex w-fit items-center justify-center rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10 hover:border-[#89BFE2]/25 transition"
                  >
                    Ara: {PHONE_DISPLAY}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-neutral-950" />
      </section>
    </main>
  );
}
