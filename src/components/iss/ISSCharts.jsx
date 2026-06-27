import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

/**
 * Custom styled tooltip for the Recharts graphs (Vercel-style).
 */
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#000] border border-[#333] p-3 rounded-lg shadow-2xl">
        <p className="text-[10px] text-[#a1a1aa] mb-1.5 uppercase tracking-wider">{label}</p>
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center gap-2">
            <span className="text-xs font-mono font-medium text-[#ededed]">
              {entry.value.toFixed(2)} {entry.name === "altitude" ? "km" : "km/h"}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

/**
 * Renders real-time charts for Altitude and Velocity using historical data.
 */
const ISSCharts = ({ history }) => {
  if (!history || history.length === 0) {
    return (
      <div className="rounded-xl border border-[#333] bg-[#0a0a0a] h-[300px] flex items-center justify-center">
        <span className="text-[11px] font-medium text-[#a1a1aa] uppercase tracking-wider">Collecting data...</span>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-black/40 backdrop-blur-xl flex flex-col h-full shadow-[0_0_20px_rgba(0,0,0,0.5)]">
      <div className="p-3 px-4 border-b border-white/10 shrink-0 flex justify-between items-center">
        <h2 className="text-[11px] font-medium text-[#ededed] uppercase tracking-wider">Analytics</h2>
        <span className="text-[8px] sm:text-[9px] text-[#a1a1aa] uppercase tracking-widest font-medium flex items-center gap-1">
          Built with <span className="text-rose-500 text-[10px]">♥</span> in Bihar, India
        </span>
      </div>
      
      <div className="p-4 flex flex-col sm:flex-row gap-5 flex-grow">
        {/* Altitude Chart */}
        <div className="w-full flex flex-col h-[110px] sm:h-full">
          <div className="flex justify-between items-center mb-2 shrink-0">
            <span className="text-[10px] font-medium text-sky-400 uppercase tracking-widest">Altitude</span>
          </div>
          <div className="flex-1 min-h-0 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={history} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorAlt" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                <XAxis dataKey="time" hide />
                <YAxis domain={['dataMin - 1', 'dataMax + 1']} hide />
                <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#ffffff30', strokeWidth: 1 }} />
                <Area 
                  type="monotone" 
                  dataKey="altitude" 
                  stroke="#0ea5e9" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorAlt)" 
                  isAnimationActive={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Velocity Chart */}
        <div className="w-full flex flex-col h-[110px] sm:h-full sm:pl-4 sm:border-l sm:border-t-0 border-t border-white/10">
          <div className="flex justify-between items-center mb-2 shrink-0">
            <span className="text-[10px] font-medium text-rose-500 uppercase tracking-widest">Velocity</span>
          </div>
          <div className="flex-1 min-h-0 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={history} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorVel" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#e11d48" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#e11d48" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                <XAxis dataKey="time" hide />
                <YAxis domain={['dataMin - 10', 'dataMax + 10']} hide />
                <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#ffffff30', strokeWidth: 1 }} />
                <Area 
                  type="monotone" 
                  dataKey="velocity" 
                  stroke="#e11d48" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorVel)" 
                  isAnimationActive={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ISSCharts;
