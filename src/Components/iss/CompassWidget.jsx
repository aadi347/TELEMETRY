import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { RiCompassDiscoverLine } from "react-icons/ri";

const CompassWidget = () => {
  const [heading, setHeading] = useState(0);

  // Simulate a slow rotating heading to mimic active orbital tracking
  useEffect(() => {
    const interval = setInterval(() => {
      setHeading((prev) => (prev + 0.1) % 360);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="rounded-2xl border border-white/10 bg-black/40 backdrop-blur-xl flex flex-col shadow-[0_0_20px_rgba(0,0,0,0.5)] overflow-hidden w-full">
      <div className="p-3 px-4 border-b border-white/10 flex items-center gap-2 shrink-0">
        <RiCompassDiscoverLine className="text-rose-500" size={14} />
        <h2 className="text-[11px] font-medium text-[#ededed] uppercase tracking-wider">Gyroscopic Nav</h2>
      </div>
      
      <div className="p-6 pb-4 flex flex-col items-center relative">
        {/* The Compass Dial */}
        <div className="relative w-32 h-32 rounded-full border-2 border-white/10 flex items-center justify-center mt-2">
          {/* Inner ring */}
          <div className="absolute inset-2 rounded-full border border-sky-500/10 bg-sky-950/10" />
          
          {/* Crosshairs */}
          <div className="absolute w-full h-[1px] bg-white/5" />
          <div className="absolute h-full w-[1px] bg-white/5" />

          {/* Center Dot */}
          <div className="absolute w-1.5 h-1.5 rounded-full bg-sky-400 shadow-[0_0_10px_rgba(14,165,233,0.8)]" />

          {/* Rotating Element */}
          <motion.div 
            className="absolute inset-0 rounded-full border-t-2 border-rose-500 transition-transform duration-75"
            style={{ rotate: heading }}
          >
            {/* Compass Marks */}
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-rose-500 bg-black/50 px-1 rounded">N</div>
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-[#777] bg-black/50 px-1 rounded">S</div>
            <div className="absolute -right-6 top-1/2 -translate-y-1/2 text-[10px] font-bold text-[#777] bg-black/50 px-1 rounded">E</div>
            <div className="absolute -left-6 top-1/2 -translate-y-1/2 text-[10px] font-bold text-[#777] bg-black/50 px-1 rounded">W</div>
          </motion.div>

          {/* Tick Marks Ring */}
          <div className="absolute inset-0 rounded-full border border-dashed border-white/20 opacity-50" style={{ transform: 'scale(1.15)' }} />
        </div>

        {/* HUD Data */}
        <div className="mt-8 w-full flex justify-between items-center bg-white/5 rounded-lg p-2 border border-white/5">
          <div className="flex flex-col">
            <span className="text-[9px] text-[#a1a1aa] uppercase tracking-wider">HDG</span>
            <span className="text-[11px] font-mono text-sky-400">{heading.toFixed(1)}°</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-[9px] text-[#a1a1aa] uppercase tracking-wider">YAW</span>
            <span className="text-[11px] font-mono text-[#ededed]">-0.5°</span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-[9px] text-[#a1a1aa] uppercase tracking-wider">PITCH</span>
            <span className="text-[11px] font-mono text-rose-400">+2.4°</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompassWidget;
