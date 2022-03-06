// styling:
import { css, jsx, Theme, useTheme } from "@emotion/react";
import styled from "@emotion/styled";

// libraries:
import {
  animate,
  AnimatePresence,
  AnimationOptions,
  motion,
  MotionValue,
  Transition,
  useMotionValue,
} from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { useGesture } from "@use-gesture/react";

// custom components / types:
import PointOfInterest from "./PointOfInterest";
import { Poi, PoiTypes } from "../types/POItypes";
import Debug from "./Debug";
import Cursor from "./Cursor";
import MapControls from "./MapControls";
import MapSidebar from "./MapSidebar";
import Searchbar from "./Searchbar";
import CenterGuidelines from "./CenterGuidelines";

// utils:
import { clamp, generatePois } from "../utils/utils";

// hooks:
import { useUIState } from "../contexts/UIContext";

// assets:
// import LostArkMap from "../assets/lost-ark-map.png";
import LostArkMap from "../assets/map/map.png";
// import LostArkMap from "../assets/map/map-with-icons.png";
import Mokoko from "../assets/mokoko.gif";
import LOScreenshot from "../assets/ingame-screenshot.jpg";
import SparklingStars from "./SparklingStars";

const Container = styled.div`
  /* border: 1px dashed blue; */

  background-color: ${({ theme }) => theme.colors.surface.main};

  position: relative;
  overflow: hidden;

  display: flex;
  flex-direction: row;

  @media (max-width: ${({ theme }) => theme.breakpoints.s}px) {
    flex-direction: column-reverse;
  }
`;

const Viewbox = styled.div`
  /* border: 1px dashed red; */
  z-index: 1;

  background-color: #222;

  position: relative;
  overflow: hidden;
`;

const DraggableMap = styled(motion.div)`
  /* outline: 1px dashed green; */

  background-image: ${`url(${LostArkMap})`};
  image-rendering: pixelated;

  position: relative;
  touch-action: none;

  cursor: grab;
  cursor: default;

  width: fit-content;
  height: fit-content;

  /* box-shadow: inset 0px 0px 100px 115px rgba(34, 34, 34, 1); */

  &:active {
    cursor: move;
    cursor: grabbing;
  }
`;

const Img = styled(motion.img)`
  position: relative;
  user-select: none;
  pointer-events: none;
  touch-action: none;

  display: block;

  opacity: 0;

  /* image-rendering: crisp-edges; */
`;

const BackgroundContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;

  user-select: none;
  pointer-events: none;
  touch-action: none;

  display: flex;
  justify-content: center;
  align-items: center;
`;

const HidingImage = styled(motion.img)`
  width: 100px;

  user-select: none;
  pointer-events: none;
  touch-action: none;

  display: block;
`;

// const EmptyPoi: Poi = {
//   type: "island",
//   id: "null",
//   position: { x: 0, y: 0 },
//   imgUrls: [LOScreenshot],
// };

const baseTransition: Transition = {
  type: "tween",
  duration: 1,
  ease: "anticipate",
};

export type Controls = {
  toggleSidebar: () => void;
  openSidebar: () => void;
  closeSidebar: () => void;
  panToCenter: (transition?: AnimationOptions<number>) => void;
  panToElement: (id: string, transition?: AnimationOptions<number>) => void;

  resetZoom: () => void;
  resetMap: () => void;
  setPoiIdSelected: React.Dispatch<React.SetStateAction<string | null>>;
  zoomInOnCenter: () => void;
  zoomOutOnCenter: () => void;
};

export type Position = {
  x: number;
  y: number;
};

type MapProps = {
  // mapImage: string;
  // pois: Poi[];
  showCenterGridlines?: boolean;

  minZoomScale?: number;
  maxZoomScale?: number;
  step?: number;
  defaultZoomLevel?: number;
  debounceZoomDelay?: number; // in milli-seconds (ms)
};

const Map2 = ({
  // mapImage = "",
  // pois = [],
  showCenterGridlines = false,
  step = 0.05,

  defaultZoomLevel = 0,
  minZoomScale = 0.5,
  maxZoomScale = 2.5,
  debounceZoomDelay = 80,
}: MapProps) => {
  const { isMobile } = useUIState();
  const [debug, setDebug] = useState<any>(null);
  const [poiIdSelected, setPoiIdSelected] = useState<string | null>(null);
  const [showSidebar, setShowSidebar] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const viewboxRef = useRef<HTMLDivElement>(null);
  const draggableRef = useRef<HTMLDivElement>(null);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const scale = useMotionValue(1);

  const [pois, setPois] = useState<Poi[]>([]);
  const [mapImageUrl, setMapImageUrl] = useState("");

  const setCrop = (crop: { x: number; y: number; scale: number }) => {
    mx.set(crop.x);
    my.set(crop.y);
    scale.set(crop.scale);
  };

  const poiSelected = useMemo(
    () => pois.find((poi) => poi.id === poiIdSelected),
    [poiIdSelected]
  );

  const clampScale = (scale: number) =>
    clamp(scale, minZoomScale, maxZoomScale);

  const findPositionOnMap = (mousePosition: Position) => {
    // the cursor relative to the viewPORT:
    const px = mousePosition.x;
    const py = mousePosition.y;

    // the offset relative to the viewBOX:
    const offset = adjustForViewboxOffset({ x: mx.get(), y: my.get() });
    const s = scale.get();

    // the cursor relative to the MAP at scale=1:
    const dx = px - offset.x;
    const dy = py - offset.y;

    // the cursor relative to the MAP at the current scale:
    const fx = dx / s;
    const fy = dy / s;

    const positionOnMap = { x: Math.round(fx), y: Math.round(fy) };

    // console.log({ scale });
    // console.log({ px, dx, fx });
    // console.log({ py, dy, fy });
    // console.log("----------------------");

    return positionOnMap;
  };

  const adjustImage = () => {
    if (draggableRef.current && viewboxRef.current) {
      const crop = { x: mx.get(), y: my.get(), scale: scale.get() };
      const newCrop = { ...crop };
      const imageBounds = draggableRef.current.getBoundingClientRect();
      const containerBounds = viewboxRef.current.getBoundingClientRect();

      // const originalWidth = draggableRef.current.clientWidth;
      // const widthOverhang = (imageBounds.width - originalWidth) / 2;
      const widthOverhang = 0;

      // const originalHeight = draggableRef.current.clientHeight;
      // const heightOverhang = (imageBounds.height - originalHeight) / 2;
      const heightOverhang = 0;

      if (imageBounds.left > containerBounds.left) {
        newCrop.x = widthOverhang;
      } else if (imageBounds.right < containerBounds.right) {
        newCrop.x = widthOverhang - (imageBounds.width - containerBounds.width);
      }

      if (imageBounds.top > containerBounds.top) {
        newCrop.y = heightOverhang;
      } else if (imageBounds.bottom < containerBounds.bottom) {
        newCrop.y =
          heightOverhang - (imageBounds.height - containerBounds.height);
      }

      // bounding logic is different in the case that the image is smaller than the container:
      if (imageBounds.width < containerBounds.width) {
        // console.log("diff");
        if (imageBounds.left < containerBounds.left) {
          newCrop.x = crop.x - (imageBounds.left - containerBounds.left);
        } else if (imageBounds.right > containerBounds.right) {
          newCrop.x = crop.x - (imageBounds.right - containerBounds.right);
        } else {
          newCrop.x = crop.x;
        }
      }

      if (imageBounds.height < containerBounds.height) {
        if (imageBounds.top < containerBounds.top) {
          newCrop.y = crop.y - (imageBounds.top - containerBounds.top);
        } else if (imageBounds.bottom > containerBounds.bottom) {
          newCrop.y = crop.y - (imageBounds.bottom - containerBounds.bottom);
        } else {
          newCrop.y = crop.y;
        }
      }

      // if (newCrop.x !== crop.x || newCrop.y !== crop.y) setCrop(newCrop);
      if (newCrop.x !== crop.x || newCrop.y !== crop.y) {
        animate(mx, newCrop.x);
        animate(my, newCrop.y);
      }

      // console.log({ oldCrop: crop, newCrop });
    }
  };

  const adjustForSomething = (pos: Position) => {
    const aw = draggableRef.current?.clientWidth || 32;
    const ah = draggableRef.current?.clientHeight || 32;

    const crop = { scale: scale.get() };

    const m1 = (aw * (crop.scale - 1)) / 2;
    const m2 = (ah * (crop.scale - 1)) / 2;

    return {
      x: pos.x + m1,
      y: pos.y + m2,
    };
  };

  const adjustForViewboxOffset = (pos: Position) => {
    if (viewboxRef.current) {
      const viewbox = viewboxRef.current.getBoundingClientRect();

      return {
        x: viewbox.x + pos.x,
        y: viewbox.y + pos.y,
      };
    } else return pos;
  };

  const zoomOnPoint = (point: Position, zoom: "zoom-in" | "zoom-out") => {
    if (viewboxRef.current) {
      const transition: AnimationOptions<number> = {
        type: "tween",
        duration: 0.1,
      };
      const viewboxBounds = viewboxRef.current.getBoundingClientRect();

      // the step each wheel action casuses:
      const dir = zoom === "zoom-out" ? -1 : 1;
      const ds = step * dir;

      // the scaling factors:
      const prevScale = scale.get();
      const newScale = clampScale(prevScale + ds);
      const ratio = 1 - newScale / prevScale;

      // the point at which the user scrolls to zoom in/out
      // NOTE: this point must be given relative to the VIEWPORT:
      const px = point.x;
      const py = point.y;

      // applies the viewbox offset (for ex: when the sidebar is open, the viewbox is shifted more to the right)
      // applies the map offset (for ex: if the map has been dragged somewhere before the zoom)
      const pox = px - mx.get() - viewboxBounds.x;
      const poy = py - my.get() - viewboxBounds.y;

      // apply the ratio to find the delta we must translate the map by:
      const dx = pox * ratio;
      const dy = poy * ratio;

      // add the delta to the current map offset:
      const fx = mx.get() + dx;
      const fy = my.get() + dy;

      // animate the new values:
      animate(mx, Math.round(fx), transition);
      animate(my, Math.round(fy), transition);
      animate(scale, newScale, transition);
    }
  };

  const zoomOnCenter = (zoomType: "zoom-in" | "zoom-out") => {
    if (viewboxRef.current) {
      const viewboxBounds = viewboxRef.current.getBoundingClientRect();

      // find the center of the viewBOX RELATIVE to the viewPORT:
      const px = viewboxBounds.x + viewboxBounds.width / 2;
      const py = viewboxBounds.y + viewboxBounds.height / 2;

      zoomOnPoint({ x: px, y: py }, zoomType);
    }
  };

  const zoomInOnCenter = () => zoomOnCenter("zoom-in");
  const zoomOutOnCenter = () => zoomOnCenter("zoom-out");

  const subtractPositions = (a: Position, b: Position) => ({
    x: a.x - b.x,
    y: a.y - b.y,
  });

  const panToElement = (id: string, transition?: AnimationOptions<number>) => {
    transition = transition ?? baseTransition;
    const element = pois.find((poi) => poi.id === id);

    if (element) {
      // console.log("-----------\npantoelement");
      if (viewboxRef.current && draggableRef.current) {
        const viewbox = viewboxRef.current.getBoundingClientRect();
        const image = draggableRef.current.getBoundingClientRect();
        const scale2 = image.width / draggableRef.current.clientWidth;

        const positionOfElement = adjustForViewboxOffset({
          x: element.position.x * scale2,
          y: element.position.y * scale2,
        });

        const viewboxCenter = adjustForViewboxOffset({
          x: viewbox.width / 2,
          y: viewbox.height / 2,
        });

        const diff = subtractPositions(viewboxCenter, positionOfElement);
        const final = adjustForSomething(diff);

        // setCrop((v) => ({ ...v, ...final }));
        // setCrop({ scale: scale.get(), ...final });

        // if (x.isAnimating()) x.stop();
        // if (y.isAnimating()) y.stop();

        animate(mx, final.x, transition);
        animate(my, final.y, transition);

        // console.log(`${image.width} ${image.height}`);
        // console.log({ imgCenter: positionOfElement });
        // console.log({ viewboxCenter });
        // console.log({ diff });
        // console.log({ final });
        // console.log({ scale });
      }
    }
  };

  const panToCenter = (transition?: AnimationOptions<number>) => {
    transition = transition ?? baseTransition;

    if (viewboxRef.current && draggableRef.current) {
      const viewbox = viewboxRef.current.getBoundingClientRect();
      const image = draggableRef.current.getBoundingClientRect();

      const imgCenter = adjustForViewboxOffset({
        x: image.width / 2,
        y: image.height / 2,
      });

      const viewboxCenter = adjustForViewboxOffset({
        x: viewbox.width / 2,
        y: viewbox.height / 2,
      });

      // const n = adjustForViewboxOffset(imgCenter);
      // const diff = subtractPositions(viewportCenter, n);
      const diff = subtractPositions(viewboxCenter, imgCenter);
      const final = adjustForSomething(diff);

      // setCrop((v) => ({ ...v, ...final }));
      // setCrop({ scale: scale.get(), ...final });

      animate(mx, final.x, transition);
      animate(my, final.y, transition);

      // console.log(`${image.width} ${image.height}`);
      // console.log({ imgCenter });
      // console.log({ viewportCenter: viewboxCenter });
      // console.log({ diff });
    }
  };

  const resetZoom = (transition = baseTransition) => {
    animate(scale, 1, transition);
  };

  const resetMap = () => {
    const transition = { ...baseTransition, duration: 0.6 };
    resetZoom(transition);
    panToCenter(transition);
  };

  const toggleSidebar = () => setShowSidebar((v) => !v);
  const openSidebar = () => setShowSidebar(true);
  const closeSidebar = () => setShowSidebar(false);

  useGesture(
    {
      onDrag: ({
        movement: [dx, dy],
        lastOffset: [ldx, ldy],
        pinching,
        cancel,
        first,
        active,
      }) => {
        if (pinching) {
          setDebug((v: any) => ({ ...v, onDrag: "pinching" }));
          return cancel();
        }

        if (!pinching) {
          setCrop({ scale: scale.get(), x: ldx + dx, y: ldy + dy });

          const debugString = `${dy}, ${dy * step}`;
          // console.log(debugString, state);
          // setDebug((v: any) => ({ ...v, onDrag: debugString }));
        }

        if (!first) {
          // setIsDragging(true);
        }
      },
      onDragEnd: () => {
        adjustImage();
        setIsDragging(false);
      },
      onWheel: ({ direction: [_, dirY], active, event }) => {
        if (active) {
          const pointOfZoom = { x: event.clientX, y: event.clientY };
          if (dirY < 0) zoomOnPoint(pointOfZoom, "zoom-in");
          else zoomOnPoint(pointOfZoom, "zoom-out");
        }
      },
      onWheelEnd: adjustImage,
      onPinch: (state) => {},
      onPinchStart: (state) => {},
      onPinchEnd: (state) => {
        // adjustImage();
      },
    },
    {
      target: draggableRef,
      eventOptions: { passive: false },
      // drag: { from: () => [crop.x, crop.y] },
      drag: { from: () => [mx.get(), my.get()] },
      // pinch: {
      //   distanceBounds: { min: 0 },
      // },
    }
  );

  const controls: Controls = {
    toggleSidebar,
    openSidebar,
    closeSidebar,
    panToCenter,
    panToElement,
    zoomInOnCenter,
    zoomOutOnCenter,
    resetZoom,
    resetMap,
    setPoiIdSelected,
  };

  useEffect(() => {
    const fetchPois = () => {
      setPois(generatePois(200));
    };

    const fetchMapImage = () => {
      setMapImageUrl(LostArkMap);
    };

    fetchPois();
    fetchMapImage();
  }, []);

  useEffect(() => {
    panToCenter();
  }, [mapImageUrl]);

  return (
    <Container>
      {/* <Debug drag data={{ showSidebar }} /> */}
      <Searchbar
        pois={pois}
        controls={controls}
        showSidebar={showSidebar}
        isDragging={isDragging}
        poiIdSelected={poiIdSelected}
      />
      <AnimatePresence>
        {showSidebar && <MapSidebar poi={poiSelected} controls={controls} />}
      </AnimatePresence>
      <Viewbox className="viewbow" ref={viewboxRef}>
        {showCenterGridlines && <CenterGuidelines />}

        {/* {!isMobile && (
          <Cursor
            showPosition
            offset={{ x: mx, y: my, scale }}
            findPositionOnMap={findPositionOnMap}
          />
        )} */}

        <MapControls controls={controls} isDragging={isDragging} />

        <BackgroundContainer>
          <HidingImage src={Mokoko} />
        </BackgroundContainer>

        <SparklingStars />

        <DraggableMap
          ref={draggableRef}
          style={{
            x: mx,
            y: my,
            scale,

            // makes the transform origin at 0, 0 !VERY IMPORTANT!
            originX: 0,
            originY: 0,
          }}
        >
          <Img src={LostArkMap} />
          <PointOfInterest
            key={"lsdfjdf"}
            // Removed Prop as exists in "data" value
            // id={"lskjdfk"}
            data={{
              id: "lskjdfk",
              position: { x: 500, y: 500 },
              type: "island",
            }}
            // test={pois[i]}
            onClick={() => {
              if (!isDragging) {
                setPoiIdSelected("lskjdfk");
                // openSidebar();
              }
            }}
          />

          {pois.map((data, i) => (
            <PointOfInterest
              key={data.id}
              // Commented out in branch POI bc already included in data
              // id={data.id}
              data={data}
              scale={scale}
              onClick={() => {
                if (!isDragging) {
                  setPoiIdSelected(data.id);
                  openSidebar();
                }
              }}
            />
          ))}
        </DraggableMap>
      </Viewbox>
    </Container>
  );
};

export default Map2;
