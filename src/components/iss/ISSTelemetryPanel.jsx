import { 
  RiMapPinLine, 
  RiDashboard3Line, 
  RiFlightTakeoffLine, 
  RiSunLine, 
  RiMoonClearLine 
} from "react-icons/ri";

/**
 * Renders a single data point in the telemetry panel, Vercel-style.
 */
const TelemetryItem = ({ icon: Icon, label, value, unit }) => (
  <div className="flex flex-col py-3 border-b border-[#333] last:border-0">
    <div className="flex items-center gap-2 mb-1">
      <Icon className="w-3.5 h-3.5 text-[#a1a1aa]" />
      <span className="text-[11px] font-medium text-[#a1a1aa] uppercase tracking-wider">{label}</span>
    </div>
    <div className="flex items-baseline gap-1">
      <span className="text-xl font-medium text-[#ededed] font-mono tracking-tight">{value}</span>
      {unit && <span className="text-xs text-[#a1a1aa]">{unit}</span>}
    </div>
  </div>
);

/**
 * The Telemetry Panel displays real-time ISS data (Vercel Dark Theme).
 */
const ISSTelemetryPanel = ({ data }) => {
  if (!data) return null;

  const isDaylight = data.visibility === "daylight";

  return (
    <div className="rounded-xl border border-[#333] bg-[#0a0a0a] overflow-hidden flex flex-col">
      <div className="p-4 border-b border-[#333] bg-[#111] flex justify-between items-center">
        <h2 className="text-sm font-medium text-[#ededed]">Telemetry</h2>
        <span className="flex items-center gap-1.5 text-[11px] font-medium text-[#ededed] bg-[#222] px-2 py-0.5 rounded-full border border-[#333]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#ededed]" />
          NOMINAL
        </span>
      </div>

      <div className="p-5 flex flex-col">
        <TelemetryItem 
          icon={RiMapPinLine} 
          label="Latitude" 
          value={data.latitude.toFixed(4)} 
          unit="°"
        />
        <TelemetryItem 
          icon={RiMapPinLine} 
          label="Longitude" 
          value={data.longitude.toFixed(4)} 
          unit="°"
        />
        <TelemetryItem 
          icon={RiFlightTakeoffLine} 
          label="Altitude" 
          value={data.altitude.toFixed(2)} 
          unit="km"
        />
        <TelemetryItem 
          icon={RiDashboard3Line} 
          label="Velocity" 
          value={data.velocity.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")} 
          unit="km/h"
        />
        
        {/* Solar Visibility */}
        <div className="flex items-center justify-between py-4 mt-2">
          <div className="flex items-center gap-2">
            {isDaylight ? <RiSunLine className="w-4 h-4 text-[#a1a1aa]" /> : <RiMoonClearLine className="w-4 h-4 text-[#a1a1aa]" />}
            <span className="text-[11px] font-medium text-[#a1a1aa] uppercase tracking-wider">Illumination</span>
          </div>
          <span className="text-sm font-medium text-[#ededed] capitalize">{data.visibility}</span>
        </div>
      </div>
    </div>
  );
};

export default ISSTelemetryPanel;
