import { Suspense } from "react";
import FlightsClient from "./components";
export default function Page() {
  return (
    <Suspense fallback={<div className="p-6">Loading flights...</div>}>
      <FlightsClient />
    </Suspense>
  );
}