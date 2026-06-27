import React, { useEffect, useState } from "react";

/**
 * Renders a futuristic targeting reticle and optics overlay over the 3D globe.
 * It takes the current ISS data to display real-time coordinates on the HUD.
 */
const OpticsOverlay = ({ data }) => {
  const [time, setTime] = useState(new Date().toISOString());

  // Rapidly update a simulated sub-millisecond timer for the "Optics" feel
  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date().toISOString());
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none z-30 flex flex-col justify-between p-6">
      
      {/* Corner Brackets Removed */}

      {/* Top HUD */}
      <div className="flex justify-between items-start text-[#ededed] opacity-80">
        <div className="flex flex-col">
          <span className="text-[10px] uppercase tracking-widest text-[#a1a1aa] mb-1">Optics Mode</span>
          <span className="text-xs font-mono bg-[#111] border border-[#333] px-2 py-1 rounded">
            L-BAND GEO-TRACK
          </span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[10px] uppercase tracking-widest text-[#a1a1aa] mb-1">System Time (UTC)</span>
          <span className="text-xs font-mono">{time}</span>
        </div>
      </div>

      {/* Center Reticle */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 flex items-center justify-center opacity-40">
        <svg viewBox="0 0 100 100" className="w-full h-full animate-[spin_60s_linear_infinite]">
          <circle cx="50" cy="50" r="48" fill="none" stroke="#fff" strokeWidth="0.5" strokeDasharray="4 8" />
          <circle cx="50" cy="50" r="40" fill="none" stroke="#fff" strokeWidth="0.5" />
          <path d="M 50 2 L 50 8 M 50 92 L 50 98 M 2 50 L 8 50 M 92 50 L 98 50" stroke="#fff" strokeWidth="1" />
        </svg>
        <div className="absolute w-2 h-2 bg-[#fff] rounded-full animate-ping opacity-50" />
      </div>

      {/* Bottom HUD */}
      <div className="flex justify-end items-end text-[#ededed] opacity-80">
        
        <div className="flex flex-col items-end gap-1">
          <span className="text-[10px] uppercase tracking-widest text-[#a1a1aa] mb-1">Lock Status</span>
          {data ? (
            <div className="flex items-center gap-2 text-[#fff]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#fff] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#fff]"></span>
              </span>
              <span className="text-xs font-mono tracking-widest">TRACKING</span>
            </div>
          ) : (
            <span className="text-xs font-mono tracking-widest text-[#555] animate-pulse">SEARCHING</span>
          )}
        </div>
      </div>

    </div>
  );
};

export default OpticsOverlay;
