import React, { useEffect, useRef } from "react";
import lottie from "lottie-web";
import { RiSpaceShipLine } from "react-icons/ri";

const SatelliteInfo = ({ data }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    const animation = lottie.loadAnimation({
      container: containerRef.current,
      renderer: "svg",
      loop: true,
      autoplay: true,
      path: "/Satellite.json",
    });

    return () => animation.destroy();
  }, []);

  return (
    <div className="rounded-2xl border border-white/10 bg-black/40 backdrop-blur-xl flex flex-col shadow-[0_0_20px_rgba(0,0,0,0.5)] overflow-hidden w-full">
      <div className="p-3 px-4 border-b border-white/10 flex items-center gap-2 shrink-0">
        <RiSpaceShipLine className="text-sky-400" size={14} />
        <h2 className="text-[11px] font-medium text-[#ededed] uppercase tracking-wider">Target Profile</h2>
      </div>
      
      <div className="p-4 flex flex-col items-center">
        {/* Lottie Animation container */}
        <div 
          ref={containerRef} 
          className="w-32 h-32 mb-4 opacity-90 drop-shadow-[0_0_15px_rgba(14,165,233,0.3)]" 
        />
        
        {/* Tech Specs */}
        <div className="w-full flex flex-col gap-3">
          <div className="flex justify-between items-center border-b border-white/5 pb-2">
            <span className="text-[10px] text-[#a1a1aa] uppercase tracking-wider">Designation</span>
            <span className="text-[11px] font-medium text-[#ededed]">ISS</span>
          </div>
          <div className="flex justify-between items-center border-b border-white/5 pb-2">
            <span className="text-[10px] text-[#a1a1aa] uppercase tracking-wider">Status</span>
            <span className="text-[11px] font-medium text-rose-500 uppercase tracking-widest animate-pulse">
              {data?.visibility === "eclipsed" ? "Eclipsed" : "Active / Lit"}
            </span>
          </div>
          <div className="flex justify-between items-center border-b border-white/5 pb-2">
            <span className="text-[10px] text-[#a1a1aa] uppercase tracking-wider">Footprint</span>
            <span className="text-[11px] font-mono text-sky-400">
              {data?.footprint ? `${Math.round(data.footprint).toLocaleString()} km` : "--"}
            </span>
          </div>
          <div className="flex justify-between items-center border-b border-white/5 pb-2">
            <span className="text-[10px] text-[#a1a1aa] uppercase tracking-wider">Mass</span>
            <span className="text-[11px] font-mono text-sky-400">419,725 kg</span>
          </div>
          <div className="flex justify-between items-center pb-1">
            <span className="text-[10px] text-[#a1a1aa] uppercase tracking-wider">Orbital Period</span>
            <span className="text-[11px] font-mono text-sky-400">92.9 mins</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SatelliteInfo;
