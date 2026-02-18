import { Suspense } from "react";
import RandevuClient from "./RandevuClient";

export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-neutral-950" />}>
      <RandevuClient />
    </Suspense>
  );
}
