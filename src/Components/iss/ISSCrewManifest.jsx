import React from "react";
import { RiTeamLine } from "react-icons/ri";

/**
 * A sleek, Vercel-style list displaying astronauts currently in space.
 */
const ISSCrewManifest = ({ crew, isLoading, error }) => {
  if (error) {
    return (
      <div className="rounded-xl border border-white/10 bg-black/40 backdrop-blur-md p-5 text-center">
        <span className="text-[11px] font-medium text-[#a1a1aa] uppercase tracking-wider">Crew Data Unavailable</span>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-rose-500/20 bg-black/40 backdrop-blur-xl h-full flex flex-col shadow-[0_0_20px_rgba(225,29,72,0.1)] overflow-hidden max-h-[350px]">
      {/* Header */}
      <div className="p-3 px-4 border-b border-white/10 flex justify-between items-center shrink-0">
        <div className="flex items-center gap-2">
          <RiTeamLine className="text-rose-500" size={14} />
          <h2 className="text-[11px] font-medium text-[#ededed] uppercase tracking-wider">Active Crew</h2>
        </div>
        <span className="text-[9px] bg-rose-500/20 text-rose-400 px-2 py-0.5 rounded-full border border-rose-500/30 uppercase tracking-widest">
          {isLoading ? "--" : crew.length} Aboard
        </span>
      </div>

      {/* Roster List */}
      <div className="overflow-y-auto flex-1 p-2 custom-scrollbar">
        {isLoading ? (
          <div className="flex items-center justify-center h-full min-h-[100px]">
             <span className="text-[11px] font-medium text-[#a1a1aa] uppercase tracking-wider animate-pulse">Syncing Roster...</span>
          </div>
        ) : (
          <ul className="flex flex-col gap-2">
            {crew.map((astronaut) => {
              // Parse duration (e.g. "P182DT9H33M21S" -> roughly extract days)
              const match = astronaut.time_in_space?.match(/P(\d+)D/);
              const daysInSpace = match ? match[1] : "?";

              return (
                <li key={astronaut.id} className="flex items-center justify-between p-2 px-3 rounded-lg border border-white/5 bg-white/5 hover:bg-white/10 transition-colors cursor-default group">
                  
                  {/* Details */}
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-full border border-white/10 overflow-hidden shrink-0 bg-black">
                      {astronaut.profile_image_thumbnail ? (
                        <img 
                          src={astronaut.profile_image_thumbnail} 
                          alt={astronaut.name} 
                          className="w-full h-full object-cover grayscale opacity-80 group-hover:opacity-100 transition-opacity"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-white/5 text-[#555] text-[10px] font-mono">
                          N/A
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs font-medium text-[#ededed] truncate">{astronaut.name}</span>
                      <div className="flex items-center">
                        <span className="text-[10px] text-sky-400 uppercase tracking-wider truncate">{astronaut.agency?.abbrev || "N/A"}</span>
                        <span className="text-[10px] text-[#555] mx-1">•</span>
                        <span className="text-[10px] text-[#a1a1aa] uppercase tracking-wider truncate">{astronaut.nationality}</span>
                      </div>
                    </div>
                  </div>

                  {/* Mission Duration */}
                  <div className="text-right shrink-0 ml-3">
                    <div className="text-sm font-mono text-[#ededed]">{daysInSpace}</div>
                    <div className="text-[10px] text-rose-500 uppercase tracking-widest">Days</div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ISSCrewManifest;
