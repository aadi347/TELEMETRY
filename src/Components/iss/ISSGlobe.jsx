import React, { useEffect, useRef, useState } from "react";
import * as Cesium from "cesium";
import "cesium/Build/Cesium/Widgets/widgets.css";
import { RiFocus3Line } from "react-icons/ri";
import lottie from "lottie-web";
import OpticsOverlay from "./OpticsOverlay";
import { generatePredictedPath } from "../../utils/orbitPredictor";
import { sfx } from "../../utils/audio";

const ISSGlobe = ({ currentData, history }) => {
  const cesiumContainerRef = useRef(null);
  const viewerRef = useRef(null);
  const issEntityRef = useRef(null);
  const hasFlownInRef = useRef(false);

  const [povMode, setPovMode] = useState(false);

  const historyPrimitiveRef = useRef(null);
  const predictionPrimitiveRef = useRef(null);

  // Lottie references
  const lottieContainerRef = useRef(null);
  const lottieCanvasRef = useRef(null);

  // Initialize Lottie Animation
  useEffect(() => {
    if (!lottieContainerRef.current) return;

    const animation = lottie.loadAnimation({
      container: lottieContainerRef.current,
      renderer: "canvas", // Force canvas so we can pass it to Cesium WebGL
      loop: true,
      autoplay: true,
      path: "/Satellite.json",
    });

    animation.addEventListener("DOMLoaded", () => {
      // Find the canvas element that lottie-web generated
      lottieCanvasRef.current =
        lottieContainerRef.current.querySelector("canvas");
    });

    return () => {
      animation.destroy();
    };
  }, []);

  // Initialize Cesium Viewer
  useEffect(() => {
    if (!cesiumContainerRef.current) return;

    const viewer = new Cesium.Viewer(cesiumContainerRef.current, {
      animation: false,
      baseLayerPicker: false,
      fullscreenButton: false,
      geocoder: false,
      homeButton: false,
      infoBox: false,
      sceneModePicker: false,
      selectionIndicator: false,
      timeline: false,
      navigationHelpButton: false,
      navigationInstructionsInitiallyVisible: false,
      scene3DOnly: true,
      skyAtmosphere: new Cesium.SkyAtmosphere(),
      skyBox: new Cesium.SkyBox({
        sources: {
          positiveX: "cesium/Assets/Textures/SkyBox/tycho2t3_80_px.jpg",
          negativeX: "cesium/Assets/Textures/SkyBox/tycho2t3_80_mx.jpg",
          positiveY: "cesium/Assets/Textures/SkyBox/tycho2t3_80_py.jpg",
          negativeY: "cesium/Assets/Textures/SkyBox/tycho2t3_80_my.jpg",
          positiveZ: "cesium/Assets/Textures/SkyBox/tycho2t3_80_pz.jpg",
          negativeZ: "cesium/Assets/Textures/SkyBox/tycho2t3_80_mz.jpg",
        },
      }),
    });

    if (viewer.cesiumWidget.creditContainer) {
      viewer.cesiumWidget.creditContainer.style.display = "none";
    }

    viewer.scene.globe.enableLighting = true;

    // ISS Entity (Animated Lottie Billboard + Label)
    const issEntity = viewer.entities.add({
      id: "iss-station",
      name: "International Space Station",
      position: Cesium.Cartesian3.fromDegrees(0, 0, 400000),
      billboard: {
        // Read the Lottie canvas frame-by-frame
        image: new Cesium.CallbackProperty(() => {
          if (lottieCanvasRef.current) {
            return lottieCanvasRef.current;
          }
          return "/iss.png"; // Fallback while loading
        }, false),
        width: 128, // Increase size slightly for the animated satellite
        height: 128,
        scaleByDistance: new Cesium.NearFarScalar(1.5e2, 1.5, 8.0e6, 0.5),
      },
      label: {
        text: "ISS",
        font: "500 11px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas",
        fillColor: Cesium.Color.fromCssColorString("#ededed"),
        outlineColor: Cesium.Color.BLACK,
        outlineWidth: 2,
        style: Cesium.LabelStyle.FILL_AND_OUTLINE,
        pixelOffset: new Cesium.Cartesian2(0, -50), // Shifted further up
      },
      ellipse: {
        semiMajorAxis: 2000000.0,
        semiMinorAxis: 2000000.0,
        material: new Cesium.ColorMaterialProperty(
          Cesium.Color.fromCssColorString("#0ea5e9").withAlpha(0.1)
        ),
        outline: true,
        outlineColor: Cesium.Color.fromCssColorString("#0ea5e9").withAlpha(0.6),
        height: 0,
      }
    });

    viewerRef.current = viewer;
    issEntityRef.current = issEntity;

    // Initial wide view
    viewer.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(0, 0, 35000000),
      duration: 0,
    });

    return () => {
      if (viewerRef.current) {
        viewerRef.current.destroy();
        viewerRef.current = null;
      }
    };
  }, []);

  // Update ISS position, historical path, and predicted trajectory
  useEffect(() => {
    if (!viewerRef.current || !issEntityRef.current || !currentData) return;

    const viewer = viewerRef.current;
    const altitudeMeters = currentData.altitude * 1000;

    const currentPosition = Cesium.Cartesian3.fromDegrees(
      currentData.longitude,
      currentData.latitude,
      altitudeMeters,
    );

    issEntityRef.current.position = currentPosition;

    // Update Footprint Ring (Radius converted to meters)
    if (currentData.footprint) {
      const footprintMeters = currentData.footprint * 1000;
      issEntityRef.current.ellipse.semiMajorAxis = new Cesium.ConstantProperty(footprintMeters);
      issEntityRef.current.ellipse.semiMinorAxis = new Cesium.ConstantProperty(footprintMeters);
    }

    // ---- Draw Historical Path using Primitive API ----
    if (history && history.length > 1) {
      // Remove previous historical path primitive
      if (historyPrimitiveRef.current) {
        viewer.scene.primitives.remove(historyPrimitiveRef.current);
        historyPrimitiveRef.current = null;
      }

      const histPositions = history.map((p) =>
        Cesium.Cartesian3.fromDegrees(
          p.longitude,
          p.latitude,
          (p.altitude || currentData.altitude) * 1000,
        ),
      );

      const histInstance = new Cesium.GeometryInstance({
        geometry: new Cesium.PolylineGeometry({
          positions: histPositions,
          width: 2.0,
          vertexFormat: Cesium.PolylineColorAppearance.VERTEX_FORMAT,
        }),
        attributes: {
          color: Cesium.ColorGeometryInstanceAttribute.fromColor(
            new Cesium.Color(1, 1, 1, 0.6),
          ),
        },
      });

      const histPrimitive = new Cesium.Primitive({
        geometryInstances: histInstance,
        appearance: new Cesium.PolylineColorAppearance(),
        asynchronous: false,
      });

      viewer.scene.primitives.add(histPrimitive);
      historyPrimitiveRef.current = histPrimitive;
    }

    // ---- Draw Predicted Path using Primitive API ----
    if (history && history.length >= 2) {
      // Remove previous prediction primitive
      if (predictionPrimitiveRef.current) {
        if (Array.isArray(predictionPrimitiveRef.current)) {
          predictionPrimitiveRef.current.forEach(prim => viewer.scene.primitives.remove(prim));
        } else {
          viewer.scene.primitives.remove(predictionPrimitiveRef.current);
        }
        predictionPrimitiveRef.current = null;
      }

      const predictedPoints = generatePredictedPath(currentData, history);

      if (predictedPoints.length > 0) {
        const predPositions = [currentPosition];
        const colors = [Cesium.Color.fromCssColorString("#e11d48").withAlpha(0.9)];

        for (let i = 0; i < predictedPoints.length; i++) {
          const point = predictedPoints[i];
          if (isFinite(point.latitude) && isFinite(point.longitude)) {
            predPositions.push(
              Cesium.Cartesian3.fromDegrees(
                point.longitude,
                point.latitude,
                point.altitude * 1000,
              ),
            );

            // Calculate fade out based on how far into the future it is
            const progress = i / (predictedPoints.length - 1);
            // Exponential fade looks better for glowing trails
            const alpha = Math.max(0.0, 0.9 * Math.pow(1.0 - progress, 2));
            colors.push(Cesium.Color.fromCssColorString("#e11d48").withAlpha(alpha));
          }
        }

        if (predPositions.length > 1) {
          // 1. The Core Laser Line (Fades out via per-vertex colors)
          const lineInstance = new Cesium.GeometryInstance({
            geometry: new Cesium.PolylineGeometry({
              positions: predPositions,
              width: 5.0,
              colors: colors,
              colorsPerVertex: true,
              arcType: Cesium.ArcType.NONE,
              vertexFormat: Cesium.PolylineColorAppearance.VERTEX_FORMAT,
            }),
          });

          // 2. The Volumetric Ribbon (A 40km wide translucent corridor that acts as the 'glow')
          const ribbonInstance = new Cesium.GeometryInstance({
            geometry: new Cesium.CorridorGeometry({
              positions: predPositions,
              width: 40000.0, // 40km wide
              height: currentData.altitude * 1000 - 500, // Hovering just below the core line
              cornerType: Cesium.CornerType.MITERED,
              vertexFormat: Cesium.PerInstanceColorAppearance.VERTEX_FORMAT,
            }),
            attributes: {
              color: Cesium.ColorGeometryInstanceAttribute.fromColor(
                Cesium.Color.fromCssColorString("#e11d48").withAlpha(0.15)
              ),
            },
          });

          const predPrimitive = new Cesium.Primitive({
            geometryInstances: lineInstance, // ONLY pass the line instance here!
            appearance: new Cesium.PolylineColorAppearance(),
            asynchronous: false,
          });

          // We need a separate primitive for the corridor because it requires a different appearance type
          const ribbonPrimitive = new Cesium.Primitive({
            geometryInstances: ribbonInstance,
            appearance: new Cesium.PerInstanceColorAppearance({
              flat: true,
              translucent: true,
            }),
            asynchronous: false,
          });

          // Group them together by adding both to the scene
          viewer.scene.primitives.add(predPrimitive);
          viewer.scene.primitives.add(ribbonPrimitive);
          
          // Store an array so we can remove both later
          predictionPrimitiveRef.current = [predPrimitive, ribbonPrimitive];
        }
      }
    }

    // Cinematic Intro Animation
    if (!hasFlownInRef.current) {
      hasFlownInRef.current = true;

      setTimeout(() => {
        if (!viewerRef.current) return;

        sfx.playFlyInSweep();

        viewerRef.current.camera.flyTo({
          destination: Cesium.Cartesian3.fromDegrees(
            currentData.longitude,
            currentData.latitude,
            5000000,
          ),
          duration: 4,
          complete: () => {
            // Fly-in complete! We intentionally leave trackedEntity undefined
            // so the user has full freedom to pan, zoom, and rotate the globe.
            // They can use the POV toggle if they want to snap back to the ISS.
          },
        });
      }, 800);
    }
  }, [currentData, history, povMode]);

  // Handle POV Mode Camera Loop
  useEffect(() => {
    if (!viewerRef.current || !issEntityRef.current) return;
    const viewer = viewerRef.current;

    const onTick = (clock) => {
      if (!povMode) return;
      const issPos = issEntityRef.current.position.getValue(clock.currentTime);
      if (issPos) {
        viewer.camera.position = issPos;

        // Direction: point straight down at Earth's center (Nadir)
        const center = Cesium.Cartesian3.ZERO;
        const down = Cesium.Cartesian3.normalize(
          Cesium.Cartesian3.subtract(center, issPos, new Cesium.Cartesian3()),
          new Cesium.Cartesian3(),
        );

        // Up: Lock the 'up' vector to local North to prevent rolling
        const transform = Cesium.Transforms.eastNorthUpToFixedFrame(issPos);
        const north = new Cesium.Cartesian3(
          transform[4],
          transform[5],
          transform[6],
        );

        viewer.camera.direction = down;
        viewer.camera.up = north;
        viewer.camera.right = Cesium.Cartesian3.cross(
          down,
          north,
          new Cesium.Cartesian3(),
        );
      }
    };

    if (povMode) {
      viewer.trackedEntity = undefined; // Detach default tracking

      // Lock camera controls
      viewer.scene.screenSpaceCameraController.enableRotate = false;
      viewer.scene.screenSpaceCameraController.enableTranslate = false;
      viewer.scene.screenSpaceCameraController.enableZoom = false;
      viewer.scene.screenSpaceCameraController.enableTilt = false;
      viewer.scene.screenSpaceCameraController.enableLook = false;

      viewer.clock.onTick.addEventListener(onTick);
    } else {
      // Unlock camera controls so user can freely pan, zoom, and rotate the globe
      viewer.scene.screenSpaceCameraController.enableRotate = true;
      viewer.scene.screenSpaceCameraController.enableTranslate = true;
      viewer.scene.screenSpaceCameraController.enableZoom = true;
      viewer.scene.screenSpaceCameraController.enableTilt = true;
      viewer.scene.screenSpaceCameraController.enableLook = true;

      // If we are exiting POV mode, smoothly fly out to a wide 5,000km overview
      if (hasFlownInRef.current) {
        sfx.playFlyInSweep();
        const issPos = issEntityRef.current.position.getValue(
          viewer.clock.currentTime,
        );
        if (issPos) {
          const carto = Cesium.Cartographic.fromCartesian(issPos);
          viewer.camera.flyTo({
            destination: Cesium.Cartesian3.fromRadians(
              carto.longitude,
              carto.latitude,
              5000000,
            ),
            duration: 2.0,
          });
        }
      }
    }

    return () => {
      if (viewer && !viewer.isDestroyed()) {
        viewer.clock.onTick.removeEventListener(onTick);
      }
    };
  }, [povMode]);

  return (
    <div className="w-full h-full min-h-[500px] lg:min-h-full rounded-xl overflow-hidden border border-[#333] relative bg-[#0a0a0a]">
      <OpticsOverlay data={currentData} />

      {/* POV Toggle Button */}
      {currentData && (
        <div className="absolute top-24 right-4 z-20 pointer-events-auto">
          <button
            onClick={() => {
              sfx.playCameraClick();
              setPovMode(!povMode);
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all duration-300 ${
              povMode
                ? "bg-rose-600 text-[#fff] border-rose-500 shadow-[0_0_20px_rgba(225,29,72,0.5)]"
                : "bg-black/50 text-[#a1a1aa] border-white/10 hover:text-rose-400 hover:border-rose-500/30 backdrop-blur-md"
            }`}
          >
            <RiFocus3Line className={povMode ? "animate-pulse" : ""} />
            <span className="text-[10px] font-medium tracking-wide uppercase">
              POV: {povMode ? "ON" : "OFF"}
            </span>
          </button>
        </div>
      )}

      {!currentData && (
        <div className="absolute inset-0 flex items-center justify-center z-20 bg-[#000]">
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 border border-[#333] border-t-[#ededed] rounded-full animate-spin" />
            <span className="text-[11px] font-medium text-[#a1a1aa] uppercase tracking-widest">
              Initializing Optics...
            </span>
          </div>
        </div>
      )}

      {/* Hidden DOM element for Lottie to render its canvas into */}
      <div
        ref={lottieContainerRef}
        style={{
          position: "absolute",
          visibility: "hidden",
          pointerEvents: "none",
          width: "128px",
          height: "128px",
        }}
      />

      <div
        ref={cesiumContainerRef}
        className="w-full h-full relative z-10"
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
};

export default ISSGlobe;
