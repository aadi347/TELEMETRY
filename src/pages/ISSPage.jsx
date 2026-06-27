import { motion, AnimatePresence } from "framer-motion";
import {
  RiEarthLine,
  RiPulseLine,
  RiVolumeMuteLine,
  RiVolumeUpLine,
  RiCameraLensFill,
  RiGithubFill,
  RiLinkedinFill,
} from "react-icons/ri";
import { Toaster, toast } from "sonner";
import { useEffect, useState } from "react";
import PageTransition from "../components/layout/PageTransition";
import { sfx } from "../utils/audio";

import ISSGlobe from "../components/iss/ISSGlobe";
import ISSCrewManifest from "../components/iss/ISSCrewManifest";
import ISSCharts from "../components/iss/ISSCharts";
import SatelliteInfo from "../components/iss/SatelliteInfo";
import CompassWidget from "../components/iss/CompassWidget";
import { useISSData } from "../hooks/useISSData";
import { useCrewData } from "../hooks/useCrewData";

const ISSPage = () => {
  const { data, history, error, isLoading } = useISSData();
  const { crew, isLoading: isCrewLoading, error: crewError } = useCrewData();
  const [soundEnabled, setSoundEnabled] = useState(sfx.enabled);
  const [showLiveFeed, setShowLiveFeed] = useState(false);

  // Play telemetry ping every second if sound is enabled
  useEffect(() => {
    if (soundEnabled && data) {
      const interval = setInterval(() => {
        sfx.playTelemetryPing();
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [soundEnabled, data]);

  const handleToggleSound = () => {
    setSoundEnabled(sfx.toggle());
  };

  // Show toast notification on error
  useEffect(() => {
    if (error) {
      toast.error(`Telemetry Error: ${error}`, {
        style: { background: "#000", border: "1px solid #333", color: "#fff" },
      });
    }
  }, [error]);

  return (
    <PageTransition>
      <Toaster position="top-right" theme="dark" />

      {/* Full Screen HUD Container */}
      <div className="relative h-screen w-full bg-[#000] text-[#ededed] overflow-hidden">
        {/* BACKGROUND CANVAS: Cesium Globe */}
        <div className="absolute inset-0 z-0">
          <ISSGlobe currentData={data} history={history} />
        </div>

        {/* HUD OVERLAY: UI Elements */}
        <div className="absolute inset-0 z-10 pointer-events-none p-0 flex flex-col overflow-hidden">
          {/* TOP: Header & Telemetry */}
          <div className="pointer-events-auto flex flex-col xl:flex-row justify-between items-center bg-black/40 backdrop-blur-xl border-b border-white/10 px-4 py-2 shadow-[0_0_30px_rgba(0,0,0,0.5)] shrink-0 w-full">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="flex items-center gap-3 sm:gap-4 w-full xl:w-auto mb-3 xl:mb-0"
            >
              <img 
                src="/logo_1.png" 
                alt="Telemetry Logo" 
                className="w-12 h-12 sm:w-14 sm:h-14 shrink-0 object-contain drop-shadow-[0_0_10px_rgba(225,29,72,0.3)]" 
              />
              <div className="flex flex-col">
                <h1 className="text-lg sm:text-xl font-bold tracking-tight text-[#ededed] uppercase leading-none">
                  TELE<span className="text-rose-600">METRY</span>
                </h1>
                <span className="text-[9px] text-[#a1a1aa] uppercase tracking-widest mt-0.5 font-medium">
                  Powered by CesiumJS
                </span>
              </div>
            </motion.div>

            {/* Right Side: Telemetry Pills & Connection Status */}
            <div className="flex flex-wrap items-center gap-2 justify-end w-full xl:w-auto">
              {data && (
                <>
                  <div className="flex items-center gap-2 px-2 py-1 rounded border border-sky-500/20 bg-black/50 backdrop-blur-md">
                    <span className="text-[9px] text-sky-400 uppercase tracking-wider">
                      LAT
                    </span>
                    <span className="text-[10px] font-mono text-[#ededed]">
                      {data.latitude.toFixed(4)}°
                    </span>
                  </div>
                  <div className="flex items-center gap-2 px-2 py-1 rounded border border-sky-500/20 bg-black/50 backdrop-blur-md">
                    <span className="text-[9px] text-sky-400 uppercase tracking-wider">
                      LON
                    </span>
                    <span className="text-[10px] font-mono text-[#ededed]">
                      {data.longitude.toFixed(4)}°
                    </span>
                  </div>
                  <div className="flex items-center gap-2 px-2 py-1 rounded border border-sky-500/20 bg-black/50 backdrop-blur-md">
                    <span className="text-[9px] text-sky-400 uppercase tracking-wider">
                      ALT
                    </span>
                    <span className="text-[10px] font-mono text-[#ededed]">
                      {data.altitude.toFixed(2)} km
                    </span>
                  </div>
                  <div className="flex items-center gap-2 px-2 py-1 rounded border border-sky-500/20 bg-black/50 backdrop-blur-md">
                    <span className="text-[9px] text-sky-400 uppercase tracking-wider">
                      VEL
                    </span>
                    <span className="text-[10px] font-mono text-[#ededed]">
                      {(data.velocity / 3600).toFixed(2)} km/s
                    </span>
                  </div>
                </>
              )}

              {/* Connection Status */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="flex items-center gap-1.5 px-2 py-1 rounded border border-rose-500/20 bg-black/50 backdrop-blur-md"
              >
                <RiPulseLine
                  className={isLoading ? "text-[#555]" : "text-rose-500"}
                />
                <span className="text-[9px] font-medium tracking-wide text-[#a1a1aa] uppercase">
                  {isLoading ? "Connecting" : "Uplink Active"}
                </span>
              </motion.div>

              {/* Sound Toggle */}
              <motion.button
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.15 }}
                onClick={handleToggleSound}
                className={`flex items-center gap-1.5 px-2 py-1 rounded border transition-all duration-300 ${
                  soundEnabled
                    ? "bg-sky-500/20 text-sky-400 border-sky-500/50 shadow-[0_0_10px_rgba(14,165,233,0.2)]"
                    : "bg-black/50 text-[#a1a1aa] border-[#333] hover:text-sky-400 hover:border-sky-500/30"
                }`}
              >
                {soundEnabled ? (
                  <RiVolumeUpLine size={12} />
                ) : (
                  <RiVolumeMuteLine size={12} />
                )}
                <span className="text-[9px] font-medium tracking-wide uppercase">
                  {soundEnabled ? "SFX: ON" : "SFX: OFF"}
                </span>
              </motion.button>

              {/* Social Links */}
              <div className="flex items-center gap-2 px-2 border-l border-white/10 ml-1">
                <a href="https://github.com/aadi347" target="_blank" rel="noreferrer" className="text-[#a1a1aa] hover:text-[#ededed] transition-colors" title="GitHub">
                  <RiGithubFill size={14} />
                </a>
                <a href="https://www.linkedin.com/in/aditya-kumar-780709320/?skipRedirect=true" target="_blank" rel="noreferrer" className="text-[#a1a1aa] hover:text-[#ededed] transition-colors" title="LinkedIn">
                  <RiLinkedinFill size={14} />
                </a>
              </div>

              {/* Live NASA Feed Hover Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => setShowLiveFeed(true)}
                onMouseLeave={() => setShowLiveFeed(false)}
              >
                <motion.button
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded border border-rose-600/50 bg-rose-600/10 text-rose-500 hover:text-rose-400 hover:border-rose-500 transition-all duration-300 shadow-[0_0_15px_rgba(225,29,72,0.2)]"
                >
                  <RiCameraLensFill className="animate-pulse" size={12} />
                  <span className="text-[9px] font-medium tracking-wide uppercase">
                    Live Optics
                  </span>
                </motion.button>

                <AnimatePresence>
                  {showLiveFeed && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full right-0 mt-2 z-50 w-[350px] h-[200px] bg-black/80 backdrop-blur-2xl border border-rose-500/30 rounded-xl shadow-[0_0_30px_rgba(225,29,72,0.15)] overflow-hidden p-1 flex items-center justify-center"
                    >
                      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-rose-950/20 to-black z-0" />
                      <div className="relative z-10 w-full h-full rounded-lg overflow-hidden bg-black flex items-center justify-center border border-white/5">
                        <span className="absolute text-[10px] text-rose-600 uppercase tracking-widest animate-pulse">
                          Establishing Link...
                        </span>
                        <iframe
                          className="w-full h-full relative z-20 pointer-events-none"
                          src="https://video.ibm.com/embed/17074538?autoplay=1&mute=1&controls=0"
                          frameBorder="0"
                          allowFullScreen
                          title="NASA Live ISS Feed"
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* MIDDLE AREA: Flexible Space */}
          <div className="flex-1 w-full pointer-events-none min-h-0 flex items-end justify-between px-2 pb-2">
            {/* Left: Target Profile */}
            <motion.div
              className="pointer-events-auto shadow-[0_0_30px_rgba(0,0,0,0.5)] rounded-2xl w-[260px] shrink-0 max-h-full overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.25 }}
            >
              <SatelliteInfo data={data} />
            </motion.div>

            {/* Right: Floating Compass Panel (Placeholder) */}
            <motion.div
              className="pointer-events-auto shadow-[0_0_30px_rgba(0,0,0,0.5)] rounded-2xl w-[260px] shrink-0"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            ></motion.div>
          </div>

          {/* BOTTOM: Floating Panels */}
          <div className="flex flex-col lg:flex-row gap-2 w-full h-[220px] relative z-20 shrink-0 px-2 pb-2">
            {/* Left: Crew Manifest */}
            <motion.div
              className="pointer-events-auto h-full w-full lg:w-[280px] xl:w-[320px] shrink-0"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <ISSCrewManifest
                crew={crew}
                isLoading={isCrewLoading}
                error={crewError}
              />
            </motion.div>

            {/* Right: Telemetry Charts */}
            <motion.div
              className="pointer-events-auto h-full flex-1 min-w-0"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <ISSCharts history={history} />
            </motion.div>
          </div>

        </div>
      </div>
    </PageTransition>
  );
};

export default ISSPage;
