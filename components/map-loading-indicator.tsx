'use client';

export const MapLoadingIndicator = () => {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/95 z-[1000]">
      <div className="w-12 h-12 border-4 border-white/10 border-t-white rounded-full animate-spin" />
      <p className="mt-5 text-white text-base font-medium">
        Loading map...
      </p>
    </div>
  );
};
