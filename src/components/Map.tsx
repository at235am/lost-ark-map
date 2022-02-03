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
import { useEffect, useRef, useState } from "react";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";

// assets:
import LostArkMap from "../assets/lost-ark-map.png";
import PointOfInterest, { Poi } from "./PointOfInterest";
import { useCallback } from "react";
import { DragControlOptions } from "framer-motion/types/gestures/drag/VisualElementDragControls";

// const arg: DragControlOptions;

const Container = styled(motion.div)`
  position: relative;

  /* border: 1px dashed red; */
  /* width: 100%; */
  height: 100vh;

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
  outline: 1px dashed white;
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

const Dot = styled(motion.div)`
  z-index: 11000;

  position: absolute;
  top: 0;
  left: 0;
  width: 0.5rem;
  height: 0.5rem;

  background-color: orange;
`;

function getRandomIntInclusive(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
}

const generatePois = (numberOfPois: number): Poi[] => {
  const t = [...Array(numberOfPois).keys()].map(() => ({
    id: nanoid(4),
    position: {
      // x: getRandomIntInclusive(0, 500),
      // y: getRandomIntInclusive(0, 500),
      x: getRandomIntInclusive(0, 2100),
      y: getRandomIntInclusive(0, 1600),
    },
  }));

  // console.log(t);

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

const Map = ({
  defaultZoomLevel = 0,
  minZoomLevel = -20,
  maxZoomLevel = 20,
  step = 100,
  debounceZoomDelay = 80,
}: MapProps) => {
  // const { attributes, listeners, setNodeRef, transform } = useDraggable({
  //   id: "unique-id",
  // });
  // const style = {
  //   transform: CSS.Translate.toString(transform),
  // };

  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const dragControls = useDragControls();
  const dragger = useAnimation();

  const [lastScrollDelta, setLastScrollDelta] = useState(defaultZoomLevel);

  const [zl, setZl] = useState(defaultZoomLevel);
  const [zoomLevel, setZoomLevel] = useState(defaultZoomLevel);
  const [mapSize, setMapSize] = useState({ height: 500, width: 500 });

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const [pois, setPois] = useState<Poi[]>([]);

  const aspectRatio = mapSize.width / mapSize.height;
  const deltaX = zoomLevel * step;
  const deltaY = (zoomLevel * step) / aspectRatio;
  const width = mapSize.width + deltaX;
  const height = mapSize.height + deltaY;

  const scalePositionX = width / mapSize.width;
  const scalePositionY = height / mapSize.height;

  const getTransformedPois = useCallback(
    () =>
      pois.map((poi) => ({
        ...poi,
        position: {
          x: poi.position.x * scalePositionX,
          y: poi.position.y * scalePositionY,
        },
      })),
    [pois, scalePositionX, scalePositionY]
  );

  const transformedPois = getTransformedPois();

  const [cursorPosition, setCursorPosition] = useState({ x: 200, y: 200 });

  const incrementZoom = () => setZl((v) => Math.min(v + 1, maxZoomLevel));
  const decrementZoom = () => setZl((v) => Math.max(v - 1, minZoomLevel));

  const zoom = (e: React.WheelEvent<HTMLDivElement>) => {
    // console.log("scrolled", e.clientX, e.clientY);
    fn(e);
    const scrolledUp = e.deltaY > 0;
    setLastScrollDelta(e.deltaY);
    if (scrolledUp) {
      decrementZoom();
    } else {
      incrementZoom();
    }
  };

  const viewboxPositionToMapPosition = (pos: Position) => {
    const x = (pos.x - offset.x) / scalePositionX;
    const y = (pos.y - offset.y) / scalePositionY;

    return { x, y };
  };

  const mapPositionToViewboxPosition = (pos: Position) => {};

  const moveMapRelativeToViewbox = (x: number, y: number) => {
    // const { x, y } = position;
    dragger.start({ x, y, transition: { duration: 0.5 } });
    setOffset({ x, y });
  };

  const move = (from: Position, to: Position) => {
    // const center = { x: 200, y: 200 };
    const x = to.x - from.x;
    const y = to.y - from.y;
    // const x = to.x / scalePositionX - from.x + offset.x;
    // const y = to.y / scalePositionX - from.y + offset.x;
    moveMapRelativeToViewbox(x, y);
  };

  const fn = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.preventDefault();
    const t = {
      x: (e.clientX - offset.x) / scalePositionX,
      y: (e.clientY - offset.y) / scalePositionY,
    };
    // console.log(e.clientX, e.clientY);
    // console.log(t);

    setCursorPosition(t);
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
    // this side effect handels the debouncing of changing the zoom level
    const changeZoomLevel = () => {
      setZoomLevel(zl);
    };
    const timer = setTimeout(changeZoomLevel, debounceZoomDelay);
    return () => {
      clearTimeout(timer);
    };
  }, [zl, debounceZoomDelay]);

  useEffect(() => {
    const scrolledUp = lastScrollDelta > 0 ? 1 : -1;
    const x = offset.x + scrolledUp * offset.x * scalePositionX;
    const y = offset.x + scrolledUp * offset.y * scalePositionY;
    // const x = position.x + deltaX;
    // const y = position.y + deltaY;
    // moveMap(x / 2, y / 2);
    // moveMap(x, y);
  }, [zoomLevel]);

  const debugData = JSON.stringify(
    {
      zl,
      zoomLevel,
      position: offset,
      deltaX,
      deltaY,
      aspectRatio,
      scalePosition: { scalePositionX, scalePositionY },
      defaultImageSize: mapSize,
      imageSize: { width, height },
    },
    null,
    2
  );

  // const arg: Transition;

  return (
    <Container onClick={test}>
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
              moveMapRelativeToViewbox(100, 100);

              setOffset({ x: x.get(), y: y.get() });
            }}
          >
            OOPS
          </ZoomButton>

          <pre>{debugData}</pre>
        </ZoomContainer>
      </Overlay>
      <DraggableMap
        onClick={(e) => {}}
        onContextMenu={fn}
        onWheel={zoom}
        onWheelCapture={(e) => {
          // console.log("captured");
        }}
        drag
        animate={dragger}
        onDragEnd={(e, i) => {
          setOffset({ x: x.get(), y: y.get() });
        }}
        style={{ x, y }}
        dragMomentum={false}
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
        <Dot
          animate={{
            // x: 200,
            // y: 200,
            x: cursorPosition.x * scalePositionX,
            y: cursorPosition.y * scalePositionY,
          }}
          transition={{ type: "tween", duration: 0.2 }}
          className="test"
        >
          <span
            style={{
              color: "yellow",
              position: "absolute",
              top: "1rem",
              left: "1rem",
              width: "5rem",
            }}
          >
            ({cursorPosition.x * scalePositionX},{" "}
            {cursorPosition.y * scalePositionY})
          </span>
        </Dot>
        {transformedPois.map((data, i) => (
          <PointOfInterest
            key={data.id}
            data={data}
            test={pois[i]}
            doThis={() => {
              console.log("");

              // const center = { x: 200, y: 200 };
              // const x = center.x * scalePositionX - data.position.x;
              // const y = center.y * scalePositionX - data.position.y;
              // moveMap(x, y);

              const to = { x: 200, y: 200 }; // represent a position on the map
              const from = {
                x: data.position.x,
                y: data.position.y,
              };
              move(from, to);
            }}
          />
        ))}
      </DraggableMap>
    </Container>
  );
};

export default Map;
