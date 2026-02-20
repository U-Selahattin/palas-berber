import { NextResponse } from "next/server";
import { getService } from "@/lib/services";
import { getAuthorizedCalendar } from "@/lib/google";

const TIMEZONE = "Europe/Istanbul";

function pad(n: number) {
  return String(n).padStart(2, "0");
}
function toMinutes(hhmm: string) {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}
function minutesToHHMM(mins: number) {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${pad(h)}:${pad(m)}`;
}
function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

// ✅ AJOUT: date "aujourd'hui" en YYYY-MM-DD (timezone Istanbul)
function todayISOInTZ() {
  return new Date().toLocaleDateString("en-CA", { timeZone: TIMEZONE });
}

// ✅ AJOUT: minutes depuis minuit (timezone Istanbul)
function nowMinutesInTZ() {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: TIMEZONE,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(new Date());

  const hh = Number(parts.find((p) => p.type === "hour")?.value ?? "0");
  const mm = Number(parts.find((p) => p.type === "minute")?.value ?? "0");
  return hh * 60 + mm;
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      serviceKey?: string;
      serviceKeys?: string[];
      dateISO?: string;
    };

    const dateISO = body?.dateISO;
    if (!dateISO) {
      return NextResponse.json({ error: "Tarih gerekli." }, { status: 400 });
    }

    // ✅ AJOUT: bloquer les dates passées
    const todayISO = todayISOInTZ();
    if (dateISO < todayISO) {
      return NextResponse.json({ slots: [] }, { status: 200 });
    }

    // ✅ Bloquer dimanche (0 = Sunday)
    const selectedDate = new Date(`${dateISO}T00:00:00+03:00`);
    if (selectedDate.getDay() === 0) {
      return NextResponse.json({ slots: [] }, { status: 200 });
    }

    const keys =
      Array.isArray(body?.serviceKeys) && body.serviceKeys.length > 0
        ? body.serviceKeys
        : body?.serviceKey
        ? [body.serviceKey]
        : [];

    if (keys.length === 0) {
      return NextResponse.json({ error: "Hizmet gerekli." }, { status: 400 });
    }

    const services = keys.map((k) => getService(k)).filter(Boolean);
    if (services.length !== keys.length) {
      return NextResponse.json({ error: "Hizmet bulunamadı." }, { status: 400 });
    }

    const totalDurationMin = services.reduce((sum, s) => sum + s!.durationMin, 0);
    if (!totalDurationMin || totalDurationMin < 1) {
      return NextResponse.json({ error: "Hizmet süresi geçersiz." }, { status: 400 });
    }

    // ✅ IMPORTANT : await
    const calendar = await getAuthorizedCalendar();
    if (!calendar) {
      return NextResponse.json(
        { error: "Google Takvim bağlı değil. /admin üzerinden bağlayın." },
        { status: 400 }
      );
    }

    const OPEN = "10:00";
    const CLOSE = "21:00";
    const STEP_MIN = 15;

    const dayStart = new Date(`${dateISO}T00:00:00.000+03:00`);
    const dayEnd = new Date(`${dateISO}T23:59:59.999+03:00`);

    const fb = await calendar.freebusy.query({
      requestBody: {
        timeMin: dayStart.toISOString(),
        timeMax: dayEnd.toISOString(),
        timeZone: TIMEZONE,
        items: [{ id: "primary" }],
      },
    });

    const busy = fb.data.calendars?.primary?.busy ?? [];

    const busyRanges = busy
      .map((b) => {
        const s = new Date(b.start!);
        const e = new Date(b.end!);

        const startMin = Math.round((s.getTime() - dayStart.getTime()) / 60000);
        const endMin = Math.round((e.getTime() - dayStart.getTime()) / 60000);

        return {
          startMin: clamp(startMin, 0, 24 * 60),
          endMin: clamp(endMin, 0, 24 * 60),
        };
      })
      .filter((r) => r.endMin > r.startMin);

    let openMin = toMinutes(OPEN);
    const closeMin = toMinutes(CLOSE);

    // ✅ AJOUT: si c'est aujourd'hui, on enlève les créneaux passés
    if (dateISO === todayISO) {
      const nowMin = nowMinutesInTZ();

      // on arrondit au prochain STEP_MIN (ex: 15:07 -> 15:15)
      const rounded = Math.ceil(nowMin / STEP_MIN) * STEP_MIN;

      // on doit aussi laisser le temps pour la durée du service
      openMin = Math.max(openMin, rounded);

      // si déjà trop tard dans la journée -> aucun slot
      if (openMin + totalDurationMin > closeMin) {
        return NextResponse.json({ slots: [] }, { status: 200 });
      }
    }

    const slots: string[] = [];

    for (let t = openMin; t + totalDurationMin <= closeMin; t += STEP_MIN) {
      const sMin = t;
      const eMin = t + totalDurationMin;

      const overlap = busyRanges.some((b) => sMin < b.endMin && eMin > b.startMin);
      if (!overlap) slots.push(minutesToHHMM(sMin));
    }

    return NextResponse.json({ slots }, { status: 200 });
  } catch (err: any) {
    console.error("availability error:", err);
    return NextResponse.json({ error: err?.message || "Sunucu hatası." }, { status: 500 });
  }
}