import { NextResponse } from "next/server";
import { getService } from "@/lib/services";
import { getAuthorizedCalendar } from "@/lib/google";

const TIMEZONE = "Europe/Istanbul";
const OPEN_MIN = 10 * 60; // 10:00
const CLOSE_MIN = 21 * 60; // 21:00

/* ---------------- PHONE ---------------- */

function normalizeTRPhone10(input: string) {
  const digits = (input || "").replace(/\D/g, "");
  const d0 = digits.startsWith("00") ? digits.slice(2) : digits;

  if (d0.length === 11 && d0.startsWith("0")) return d0.slice(1);
  if (d0.length === 12 && d0.startsWith("90")) return d0.slice(2);
  if (d0.length === 10) return d0;

  return d0;
}

function isValidTRMobile10(d10: string) {
  return /^\d{10}$/.test(d10) && d10.startsWith("5");
}

function toE164TR(input: string) {
  const d10 = normalizeTRPhone10(input);
  if (!isValidTRMobile10(d10)) return null;
  return `+90${d10}`;
}

/* ---------------- DATE / TIME ---------------- */

function isValidDateISO(dateISO: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(dateISO);
}

function isValidTimeHHMM(timeHHMM: string) {
  if (!/^\d{2}:\d{2}$/.test(timeHHMM)) return false;
  const [h, m] = timeHHMM.split(":").map(Number);
  return h >= 0 && h <= 23 && m >= 0 && m <= 59;
}

function toMinutes(hhmm: string) {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      serviceKey?: string;
      serviceKeys?: string[];
      dateISO: string;
      timeHHMM: string;
      name: string;
      phone: string;
    };

    const rawName = (body?.name ?? "").trim();
    const rawPhone = (body?.phone ?? "").trim();
    const dateISO = (body?.dateISO ?? "").trim();
    const timeHHMM = (body?.timeHHMM ?? "").trim();

    /* ---------------- BASIC VALIDATION ---------------- */

    const keys =
      Array.isArray(body?.serviceKeys) && body.serviceKeys.length > 0
        ? body.serviceKeys
        : body?.serviceKey
        ? [body.serviceKey]
        : [];

    if (keys.length === 0)
      return NextResponse.json({ error: "Hizmet gerekli." }, { status: 400 });

    if (!rawName || rawName.length < 2)
      return NextResponse.json({ error: "Ad Soyad gerekli." }, { status: 400 });

    if (!isValidDateISO(dateISO))
      return NextResponse.json({ error: "Tarih geçersiz." }, { status: 400 });

    if (!isValidTimeHHMM(timeHHMM))
      return NextResponse.json({ error: "Saat geçersiz." }, { status: 400 });

    /* ---------------- SUNDAY BLOCK ---------------- */

    const selectedDate = new Date(`${dateISO}T00:00:00+03:00`);
    if (selectedDate.getDay() === 0) {
      return NextResponse.json(
        { error: "Pazar günü kapalıyız." },
        { status: 400 }
      );
    }

    /* ---------------- PHONE VALIDATION ---------------- */

    const phoneE164 = toE164TR(rawPhone);
    if (!phoneE164) {
      return NextResponse.json(
        {
          error:
            "Telefon geçersiz. Lütfen Türkiye cep telefonu girin (Örn: +90 5XX XXX XX XX).",
        },
        { status: 400 }
      );
    }

    /* ---------------- SERVICES ---------------- */

    const services = keys.map((k) => getService(k)).filter(Boolean);
    if (services.length !== keys.length)
      return NextResponse.json(
        { error: "Hizmet bulunamadı." },
        { status: 400 }
      );

    const totalDurationMin = services.reduce(
      (sum, s) => sum + s!.durationMin,
      0
    );

    if (!totalDurationMin || totalDurationMin < 1)
      return NextResponse.json(
        { error: "Hizmet süresi geçersiz." },
        { status: 400 }
      );

    /* ---------------- WORKING HOURS CHECK ---------------- */

    const startMin = toMinutes(timeHHMM);
    const endMin = startMin + totalDurationMin;

    if (startMin < OPEN_MIN || endMin > CLOSE_MIN) {
      return NextResponse.json(
        { error: "Çalışma saatleri dışında randevu alınamaz." },
        { status: 400 }
      );
    }

    /* ---------------- PAST DATE CHECK ---------------- */

    const now = new Date();
    const start = new Date(`${dateISO}T${timeHHMM}:00+03:00`);

    if (start.getTime() < now.getTime()) {
      return NextResponse.json(
        { error: "Geçmiş bir tarihe randevu alınamaz." },
        { status: 400 }
      );
    }

    const end = new Date(start.getTime() + totalDurationMin * 60000);

    /* ---------------- GOOGLE CHECK ---------------- */

    const calendar = await getAuthorizedCalendar();
    if (!calendar)
      return NextResponse.json(
        { error: "Google Takvim bağlı değil." },
        { status: 400 }
      );

    const fb = await calendar.freebusy.query({
      requestBody: {
        timeMin: start.toISOString(),
        timeMax: end.toISOString(),
        timeZone: TIMEZONE,
        items: [{ id: "primary" }],
      },
    });

    const busy = fb.data.calendars?.primary?.busy ?? [];
    if (busy.length > 0) {
      return NextResponse.json(
        { error: "Seçilen saat dolu." },
        { status: 409 }
      );
    }

    /* ---------------- CREATE EVENT ---------------- */

    const serviceTitles = services.map((s) => s!.titleTR);
    const summary =
      serviceTitles.length === 1
        ? `Randevu – ${serviceTitles[0]}`
        : `Randevu – ${serviceTitles.join(" + ")}`;

    const description =
      `Müşteri: ${rawName}\n` +
      `Telefon: ${phoneE164}\n` +
      `Hizmet(ler): ${serviceTitles.join(", ")}\n`;

    const event = await calendar.events.insert({
      calendarId: "primary",
      requestBody: {
        summary,
        description,
        start: { dateTime: start.toISOString(), timeZone: TIMEZONE },
        end: { dateTime: end.toISOString(), timeZone: TIMEZONE },
      },
    });

    return NextResponse.json({
      ok: true,
      eventId: event.data.id,
    });
  } catch (err: any) {
    console.error("appointment error:", err);
    return NextResponse.json(
      { error: "Sunucu hatası." },
      { status: 500 }
    );
  }
}
