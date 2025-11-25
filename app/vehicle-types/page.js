import { Suspense } from 'react';
import VehicleTypesContent from './VehicleTypesContent';
import { buildPageMetadata } from '@/utils/seo';

export const metadata = buildPageMetadata({
  title: "Vehicle Categories | Chauffeur & Self-Drive Cars in Lahore",
  description:
    "Browse economy, business, luxury, SUV, and van categories from Convoy Travels to match your trip, wedding, corporate visit, or airport transfer.",
  path: "/vehicle-types",
  keywords: [
    "vehicle categories Lahore",
    "luxury car rental",
    "SUV hire lahore",
    "business car rental pakistan",
  ],
});

export default function VehicleTypesPage() {
  return (
    <main className="min-h-auto bg-white" style={{ fontFamily: 'Roboto, sans-serif' }}>
      <div className="max-w-[1400px] mx-auto py-12 sm:py-16 md:py-20 px-4 sm:px-6 md:px-12 lg:px-20">
        <Suspense fallback={<div className="text-center py-16">Loading...</div>}>
          <VehicleTypesContent />
        </Suspense>
      </div>
    </main>
  );
}
