// styling:
import { css, jsx, Theme, useTheme } from "@emotion/react";
import styled from "@emotion/styled";

// libraries:
import {
  motion,
  Transition,
  useAnimation,
  useDragControls,
  useMotionValue,
} from "framer-motion";
import { nanoid } from "nanoid";
import { useEffect, useMemo, useRef, useState } from "react";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";

// assets:
import LostArkMap from "../assets/lost-ark-map.png";
import PointOfInterest, { Poi } from "./PointOfInterest";
import { useCallback } from "react";
import { DragControlOptions } from "framer-motion/types/gestures/drag/VisualElementDragControls";
import Debug from "./Debug";
import Cursor from "./Cursor";
import throttle from "lodash.throttle";
import useMousePosition from "../hooks/useMousePosition";

// const arg: DragControlOptions;

const Viewbox = styled(motion.div)`
  position: relative;

  border: 1px dashed red;
  height: 100vh;
  width: 100vw;

  /* width: 100%;
  max-width: 100vw;
  max-height: 100vh;
  height: 100%;
  min-height: 100%; */

  /* flex: 1; */

  overflow: hidden;
`;

// const DraggableMap = styled.div`
const DraggableMap = styled(motion.div)`
  position: relative;

  /* cursor: grab; */

  /* outline: 1px dashed green; */
  width: fit-content;
  height: fit-content;
  /* width: 100vw; */
  /* height: 100vh; */

  &:active {
    cursor: move;
    cursor: grabbing;
  }
`;

const Img = styled(motion.img)`
  z-index: -10;
  position: relative;
  user-select: none;
  pointer-events: none;
  /* outline: 1px dashed white; */
  /* width: 100vw; */
  /* height: 100vh; */
`;

const Overlay = styled.div`
  z-index: 200;

  position: absolute;
  margin: 1rem;
`;

const ZoomContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const ZoomButton = styled.button`
  width: 4rem;
  height: 4rem;
  background-color: ${({ theme }) => theme.colors.surface.main};
  color: ${({ theme }) => theme.colors.onSurface.main};
`;

const List = styled.div`
  max-height: 20rem;
  overflow: auto;
`;

const getRandomIntInclusive = (min: number, max: number) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
};

const generatePois = (numberOfPois: number): Poi[] => {
  const t = [...Array(numberOfPois).keys()].map(() => ({
    id: nanoid(4),
    position: {
      x: getRandomIntInclusive(0, 2100),
      y: getRandomIntInclusive(0, 1600),
    },
  }));

  return t;
};

const loadImage = (
  setImageDimensions: React.Dispatch<
    React.SetStateAction<{
      width: number;
      height: number;
    }>
  >,
  imageUrl: string
) => {
  const img = new Image();
  img.src = imageUrl;

  img.onload = () => {
    setImageDimensions({
      width: img.width,
      height: img.height,
    });
  };
  img.onerror = (err) => {
    console.log("img error");
    console.error(err);
  };
};

type Position = {
  x: number;
  y: number;
};

type MapProps = {
  minZoomLevel?: number;
  maxZoomLevel?: number;
  step?: number;
  defaultZoomLevel?: number;
  debounceZoomDelay?: number; // in milli-seconds (ms)
};

const ORIGIN: Position = { x: 0, y: 0 };

const Map = ({
  defaultZoomLevel = 0,
  minZoomLevel = -20,
  maxZoomLevel = 20,
  step = 100,
  debounceZoomDelay = 80,
}: MapProps) => {
  const viewboxRef = useRef<HTMLDivElement>(null);

  const [pois, setPois] = useState<Poi[]>([]);
  const [offset, setOffset] = useState(ORIGIN);

  const dragger = useAnimation();

  const currentCursorPosition = useMousePosition();
  const zoomCursorPosition = useRef(ORIGIN); // represents the prev position???

  const [mapSize, setMapSize] = useState({ height: 1, width: 1 });
  const [zl, setZl] = useState(defaultZoomLevel);
  const [zoomLevel, setZoomLevel] = useState(defaultZoomLevel);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const aspectRatio = mapSize.width / mapSize.height;
  const delta = { x: zoomLevel * step, y: (zoomLevel * step) / aspectRatio };

  const zoomScale = (zoomLevel * step + mapSize.width) / mapSize.width;
  const prevZoomScale = useRef(zoomScale);

  const width = mapSize.width * zoomScale;
  const height = mapSize.height * zoomScale;

  const transformedPois = useMemo(
    () =>
      pois.map((poi) => ({
        ...poi,
        position: {
          x: poi.position.x * zoomScale,
          y: poi.position.y * zoomScale,
        },
      })),
    [pois, zoomScale]
  );

  const incrementZoom = () => setZl((v) => Math.min(v + 1, maxZoomLevel));
  const decrementZoom = () => setZl((v) => Math.max(v - 1, minZoomLevel));

  const zoom = (e: React.WheelEvent<HTMLDivElement>) => {
    setCursorPosition(e);
    const scrolledUp = e.deltaY > 0;
    if (scrolledUp) decrementZoom();
    else incrementZoom();
  };

  const viewboxPositionToMapPosition = (pos: Position) => {
    const x = (pos.x - offset.x) / zoomScale;
    const y = (pos.y - offset.y) / zoomScale;

    return { x, y };
  };

  const mapPositionToViewboxPosition = (pos: Position) => {};

  const moveMapRelativeToViewbox = (
    x: number,
    y: number,
    transition = { duration: 0.2 }
  ) => {
    dragger.start({ x, y, transition });
    setOffset({ x, y });
  };

  /**
   * @param from represents a position relative to the map
   * @param to represents a position relative to viewbox
   */
  const move = (
    from: Position,
    to: Position,
    transition = { duration: 0.2 }
  ) => {
    const x = to.x - from.x;
    const y = to.y - from.y;
    moveMapRelativeToViewbox(x, y, transition);
  };

  const panToElement = (id: string, transition = { duration: 0.2 }) => {
    const element = transformedPois.find((poi) => poi.id === id);
    if (element) {
      // const center = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

      const s = viewboxRef.current?.getBoundingClientRect();

      const center = { x: (s?.width || 0) / 2, y: (s?.height || 0) / 2 };

      move(element.position, center, transition);
    }
  };

  const panToCenter = () => {
    const s = viewboxRef.current?.getBoundingClientRect();
    const mapCenter = { x: width / 2, y: height / 2 };
    const viewboxCenter = {
      x: (s?.width || 0) / 2,
      y: (s?.height || 0) / 2,
    };
    move(mapCenter, viewboxCenter);
  };

  const setCursorPosition = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    if (e.type === "contextmenu") e.preventDefault();

    const t = {
      x: (e.clientX - offset.x) / zoomScale,
      y: (e.clientY - offset.y) / zoomScale,
    };

    zoomCursorPosition.current = t;
  };

  const test = () => {
    const t = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  };

  useEffect(() => {
    loadImage(setMapSize, LostArkMap);

    const fetchPois = () => {
      setPois(generatePois(100));
    };

    fetchPois();
  }, []);

  useEffect(() => {
    return () => {
      prevZoomScale.current = zoomScale;
    };
  }, [zoomScale]);

  useEffect(() => {
    // this side effect handles the debouncing of changing the zoom level
    // zl is just the accumulation of all the changes
    // zl is changed rapidly but it increments so we must keep track of all the increments
    // everytime zl changes there is a timer that goes off
    // and if that time frame (debounceZoomDelay) passes
    // then we'll actually change the zoomLevel
    const changeZoomLevel = () => {
      setZoomLevel(zl);
    };
    const timer = setTimeout(changeZoomLevel, debounceZoomDelay);
    return () => {
      clearTimeout(timer);
    };
  }, [zl, debounceZoomDelay]);

  useEffect(() => {
    const from = {
      x: zoomCursorPosition.current.x * zoomScale,
      y: zoomCursorPosition.current.y * zoomScale,
    };

    move(from, currentCursorPosition);
  }, [zoomLevel]);

  const debugData = {
    currentCursorPosition,
    zl,
    zoomLevel,
    zoomScale,
    offset,
    aspectRatio,
    defaultImageSize: mapSize,
    imageSize: { width, height },
    delta,
  };

  return (
    <Viewbox className="viewbow" ref={viewboxRef} onClick={test}>
      <Cursor showPosition>
        <div>{}</div>
      </Cursor>
      <Overlay>
        <ZoomContainer>
          <ZoomButton type="button" onClick={incrementZoom}>
            +
          </ZoomButton>
          <ZoomButton type="button" onClick={decrementZoom}>
            -
          </ZoomButton>
          <ZoomButton
            type="button"
            onClick={(e) => {
              panToCenter();

              setOffset({ x: x.get(), y: y.get() });
            }}
          >
            OOPS
          </ZoomButton>

          {/* <Debug drag data={debugData}></Debug> */}
        </ZoomContainer>
        <List>
          {transformedPois.map((poi) => (
            <div
              key={poi.id}
              onClick={() => panToElement(poi.id, { duration: 0.5 })}
            >
              {poi.id}
            </div>
          ))}
        </List>
      </Overlay>
      <DraggableMap
        onClick={(e) => {}}
        onContextMenu={setCursorPosition}
        onWheel={zoom}
        drag
        animate={dragger}
        onDragEnd={(e, i) => {
          setOffset({ x: x.get(), y: y.get() });
        }}
        style={{ x, y }}
        dragMomentum={false}
        // dragConstraints={{
        //   top: -height + window.innerHeight - 100,
        //   bottom: 0 + 100,
        //   left: -width + window.innerWidth - 100,
        //   right: 0 + 100,
        // }}
        // transition={{ duration: 2 }}
        // dragTransition={{
        // max: 0,
        // min: -2102 * deltaX + window.innerWidth,
        // bounceDamping: 20,
        // }}
        // dragElastic={1}
      >
        <Img
          src={LostArkMap}
          animate={{
            width,
            height,
          }}
          transition={{ type: "tween", duration: 0.2 }}
        />

        {transformedPois.map((data, i) => (
          <PointOfInterest
            key={data.id}
            id={data.id}
            data={data}
            test={pois[i]}
          />
        ))}
      </DraggableMap>
    </Viewbox>
  );
};

export default Map;
