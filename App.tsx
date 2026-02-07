import React, { useState, useCallback } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { GardenCanvas } from './components/GardenCanvas';
import { AuroraBackground } from './components/AuroraBackground';
import { LandingPage } from './components/LandingPage';
import { GardenUI } from './components/GardenUI';

export default function App() {
  const [started, setStarted] = useState(false);
  const [resetTrigger, setResetTrigger] = useState(0);

  const handleStart = useCallback(() => {
    setStarted(true);
  }, []);

  const handleReset = useCallback(() => {
    // Incrementing a counter to trigger the effect in the canvas component
    setResetTrigger(prev => prev + 1);
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#0f0505] text-white">
      {/* 
        The Canvas is always rendered but might be hidden or paused 
        if we wanted optimization, but here we keep it active 
        so the 'magic' is ready immediately.
      */}
      {/* Aurora Background - behind everything */}
      <div className="absolute inset-0 z-0">
        <AuroraBackground />
      </div>

      {/* Garden Canvas - where flowers are drawn */}
      <div className="absolute inset-0 z-10">
        <GardenCanvas resetTrigger={resetTrigger} />
      </div>

      {/* Landing Page Overlay */}
      <LandingPage started={started} onStart={handleStart} />

      {/* Main UI Overlay (Top bar, socials, etc.) */}
      <GardenUI started={started} onReset={handleReset} />

      {/* Vercel Web Analytics */}
      <Analytics />
    </div>
  );
}