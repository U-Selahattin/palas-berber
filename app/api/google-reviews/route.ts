import { NextResponse } from "next/server";

export const revalidate = 3600; // cache 1h (évite spam + quota)

type GoogleReview = {
  author_name: string;
  rating: number;
  relative_time_description: string;
  text: string;
  time: number;
  profile_photo_url?: string;
};

export async function GET() {
  const key = process.env.GOOGLE_MAPS_API_KEY;
  const placeId = process.env.GOOGLE_PLACE_ID;

  if (!key || !placeId) {
    return NextResponse.json(
      { error: "Missing GOOGLE_MAPS_API_KEY or GOOGLE_PLACE_ID" },
      { status: 500 }
    );
  }

  // Fields autorisés (le minimum utile)
  const fields = [
    "name",
    "rating",
    "user_ratings_total",
    "reviews",
    "url",
  ].join(",");

  const url =
    "https://maps.googleapis.com/maps/api/place/details/json" +
    `?place_id=${encodeURIComponent(placeId)}` +
    `&fields=${encodeURIComponent(fields)}` +
    `&reviews_sort=newest` +
    `&language=tr` +
    `&key=${encodeURIComponent(key)}`;

  const res = await fetch(url, {
    // revalidate géré par Next (export const revalidate)
    headers: { "Accept": "application/json" },
  });

  const data = await res.json();

  if (!res.ok || data.status !== "OK") {
    return NextResponse.json(
      { error: data?.error_message || data?.status || "Google API error" },
      { status: 500 }
    );
  }

  const result = data.result || {};
  const reviews: GoogleReview[] = Array.isArray(result.reviews)
    ? result.reviews
    : [];

  // petite sécurité: on garde juste les champs nécessaires
  const safeReviews = reviews.map((r) => ({
    author_name: r.author_name,
    rating: r.rating,
    relative_time_description: r.relative_time_description,
    text: r.text,
    time: r.time,
    profile_photo_url: r.profile_photo_url,
  }));

  return NextResponse.json({
    name: result.name,
    rating: result.rating,
    user_ratings_total: result.user_ratings_total,
    url: result.url, // lien officiel Google Maps
    reviews: safeReviews,
  });
}
