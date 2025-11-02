import { Suspense } from 'react';
import VehicleTypesContent from './VehicleTypesContent';

export const metadata = {
  title: "Vehicle Types - Convoy Travels",
  description: "Explore our diverse fleet of vehicles available for rent in Lahore",
};

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
