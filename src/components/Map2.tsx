// styling:
import { css, jsx, Theme, useTheme } from "@emotion/react";
import styled from "@emotion/styled";
import { useGesture } from "@use-gesture/react";

// libraries:
import {
  animate,
  motion,
  transform,
  Transition,
  useAnimation,
  useDragControls,
  useMotionValue,
} from "framer-motion";
import { nanoid } from "nanoid";
import { useEffect, useMemo, useRef, useState } from "react";

// assets:
import LostArkMap from "../assets/lost-ark-map.png";
import Mokoko from "../assets/mokoko.gif";
import PointOfInterest, { Poi, PoiTypes } from "./PointOfInterest";
import { useCallback } from "react";
import { DragControlOptions } from "framer-motion/types/gestures/drag/VisualElementDragControls";
import Debug from "./Debug";
import Cursor from "./Cursor";
import throttle from "lodash.throttle";
import useMousePosition from "../hooks/useMousePosition";
import MapControls from "./MapControls";
import Searchbar from "./Searchbar";
import { generatePois } from "../utils/utils";
import DynamicPortal from "./DynamicPortal";

import { useUIState } from "../contexts/UIContext";

const Viewbox = styled.div`
  position: relative;

  border: 1px dashed white;

  overflow: hidden;
`;

const DraggableMap = styled(motion.div)`
  outline: 1px dashed green;

  position: relative;
  touch-action: none;

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

const DraggableMap2 = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;

  touch-action: none;

  /* cursor: grab; */

  outline: 1px dashed green;

  /* outline: 1px dashed green; */
  /* width: fit-content; */
  /* height: fit-content; */
  /* width: 100vw; */
  /* height: 100vh; */

  &:active {
    cursor: move;
    cursor: grabbing;
  }
`;

const Img = styled(motion.img)`
  /* z-index: -10; */

  position: relative;
  user-select: none;
  pointer-events: none;
  touch-action: none;

  display: block;

  image-rendering: crisp-edges;
  /* outline: 1px dashed white; */
  /* width: 100vw; */
  /* height: 100vh; */
`;

const BackgroundContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;

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

  image-rendering: crisp-edges;
`;

const List = styled.div`
  max-height: 20rem;
  overflow: auto;
`;

const Wrapper = styled.div`
  border: 3px solid blue;
`;

export type Position = {
  x: number;
  y: number;
};

type MapProps = {
  // mapImage: string;
  // pois: Poi[];
  centerLines?: boolean;

  minZoomLevel?: number;
  maxZoomLevel?: number;
  step?: number;
  defaultZoomLevel?: number;
  debounceZoomDelay?: number; // in milli-seconds (ms)
};

const A = styled.div`
  z-index: 9999;
  position: absolute;
  left: calc(100% / 2);
  /* left: 500px; */
  width: 1px;
  height: 100%;
  background-color: red;
`;

const B = styled.div`
  position: absolute;
  z-index: 9999;

  top: calc(100% / 2);
  /* top: 400px; */
  width: 100%;
  height: 1px;
  background-color: red;
`;

const RectA = styled.div`
  position: fixed;
  top: 0;
  left: 0;

  width: 15px;
  height: 10px;
  background-color: red;
`;
const RectB = styled.div`
  position: fixed;
  top: 0;
  left: 0;

  /* width: 200px;
  height: 300px; */

  width: 15px;
  height: 10px;

  transform: scale(3);
  opacity: 0.5;
  background-color: blue;
`;

const Map2 = ({
  // mapImage = "",
  // pois = [],
  centerLines = false,

  defaultZoomLevel = 0,
  minZoomLevel = -20,
  maxZoomLevel = 20,
  step = 0.05,
  debounceZoomDelay = 80,
}: MapProps) => {
  const { isMobile } = useUIState();

  const viewboxRef = useRef<HTMLDivElement>(null);
  const draggableRef = useRef<HTMLDivElement>(null);
  const [pois, setPois] = useState<Poi[]>([]);
  const [mapImageUrl, setMapImageUrl] = useState("");

  const [debug, setDebug] = useState<any>(null);

  // const [crop, setCrop] = useState({ x: 0, y: 0, scale: 1 });

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const scale = useMotionValue(1);

  const setCrop = (crop: { x: number; y: number; scale: number }) => {
    x.set(crop.x);
    y.set(crop.y);
    scale.set(crop.scale);
  };

  const pinching = useRef(false);

  const baseTransition: Transition = {
    type: "tween",
    duration: 1,
    ease: "anticipate",
  };

  // const aw = draggableRef.current?.clientWidth || 32;
  // const ah = draggableRef.current?.clientHeight || 32;

  // const m1 = (aw * (crop.scale - 1)) / 2;
  // const m2 = (ah * (crop.scale - 1)) / 2;

  const adjustImage = () => {
    if (draggableRef.current && viewboxRef.current) {
      const crop = { x: x.get(), y: y.get(), scale: scale.get() };
      let newCrop = { ...crop };
      let imageBounds = draggableRef.current.getBoundingClientRect();
      let containerBounds = viewboxRef.current.getBoundingClientRect();

      let originalWidth = draggableRef.current.clientWidth;
      let widthOverhang = (imageBounds.width - originalWidth) / 2;

      let originalHeight = draggableRef.current.clientHeight;
      let heightOverhang = (imageBounds.height - originalHeight) / 2;

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
        animate(x, newCrop.x);
        animate(y, newCrop.y);
      }
    }
  };

  useGesture(
    {
      onDrag: ({
        movement: [dx, dy],
        lastOffset: [ldx, ldy],
        pinching,
        cancel,
      }) => {
        if (pinching) {
          setDebug((v: any) => ({ ...v, onDrag: "pinching" }));
          return cancel();
        }

        if (!pinching) {
          // setCrop((v) => ({ ...v, x: ldx + dx, y: ldy + dy }));
          setCrop({ scale: scale.get(), x: ldx + dx, y: ldy + dy });

          const debugString = `${dy}, ${dy * step}`;
          // console.log(debugString, state);
          // setDebug((v: any) => ({ ...v, onDrag: debugString }));
        }
      },
      onWheel: ({ direction: [_, dy], active }) => {
        if (active) {
          // const wheelDelta = 100;

          // const stepCount = dy / 100;
          // console.log(state);

          // setCrop((v) => ({ ...v, scale: 1 - (dy * step) / wheelDelta }));
          // setCrop({
          //   x: x.get(),
          //   y: y.get(),
          //   scale: 1 - (dy * step) / wheelDelta,
          // });
          animate(scale, scale.get() + step * -dy);

          // const debugString = `${dy}, ${(dy * step) / wheelDelta}`;
          // setDebug((v: any) => ({ ...v, onWheel: debugString }));
        }
      },
      onPinch: ({
        memo,
        offset: [d, d2],
        movement,
        distance,
        delta,
        first,
        origin: [pinchOriginX, pinchOriginY],
      }) => {
        // const {
        //   memo,
        //   offset: [d, d2],
        //   movement,
        //   origin: [pinchOriginX, pinchOriginY],
        // } = state;

        if (draggableRef.current) {
          if (first) {
            // const { width, height, x, y } =
            //   draggableRef.current.getBoundingClientRect();
            // const tx = ox - (x + width / 2);
            // const ty = oy - (y + height / 2);
            memo = {
              bounds: draggableRef.current.getBoundingClientRect(),
              // crop: { ...crop },
            };
          }

          // let imageBounds = draggableRef.current.getBoundingClientRect();
          // let transformOriginX = imageBounds.x + imageBounds.width / 2;
          // let transformOriginY = imageBounds.y + imageBounds.height / 2;
          // let transformOriginXm = memo.bounds.x + memo.bounds.width / 2;
          // let transformOriginYm = memo.bounds.y + memo.bounds.height / 2;

          let transformOriginX = memo.bounds.x + memo.bounds.width / 2;
          let transformOriginY = memo.bounds.y + memo.bounds.height / 2;

          let displacementX = transformOriginX - pinchOriginX;
          let displacementY = transformOriginY - pinchOriginY;

          // setCrop((v) => ({
          //   ...v,
          //   scale: d,
          //   x: memo.crop.x - displacementX / d,
          //   y: memo.crop.y - displacementY / d,
          // }));

          // const debugString1 = `${memo.crop.x} ${memo.crop.y}`;

          // const debugString1 = `${JSON.stringify(distance)} ${
          //   displacementX * d
          // } ${displacementY * d} `;
          // const debugString2 = `${displacementX / d} ${displacementY / d}`;
          // const debugString2 = `${transformOriginXm} ${transformOriginYm}`;

          // console.log(debugString);
          // setDebug((v: any) => ({
          //   ...v,
          //   onPinch: { debugString1, debugString2 },
          // }));
          return memo;
        }
      },
      onPinchStart: (state) => {},
      onPinchEnd: (state) => {
        // adjustImage();
      },
      onDragEnd: adjustImage,
    },
    {
      target: draggableRef,
      eventOptions: { passive: false },
      // drag: { from: () => [crop.x, crop.y] },
      drag: { from: () => [x.get(), y.get()] },
      // pinch: {
      //   distanceBounds: { min: 0 },
      // },
    }
  );

  const subtractPositions = (a: Position, b: Position) => ({
    x: a.x - b.x,
    y: a.y - b.y,
  });

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

  // const tryScale = (num: number) => (num * (crop.scale + 1)) / 2;

  const scale2 = () => {
    if (draggableRef.current) {
      const crop = { scale: scale.get() };

      const aw = draggableRef.current.clientWidth;
      const ah = draggableRef.current.clientHeight;
      return (aw * (crop.scale + 1)) / 2;
    }
  };

  const adjustForViewboxOffset = (pos: Position) => {
    if (viewboxRef.current && draggableRef.current) {
      const viewbox = viewboxRef.current.getBoundingClientRect();

      return {
        x: viewbox.x + pos.x,
        y: viewbox.y + pos.y,
      };
    } else return pos;
  };

  const panToElement = (id: string, transition?: Transition | undefined) => {
    console.log(id);

    const element = pois.find((poi) => poi.id === id);
    if (element) {
      console.log("-----------\npantoelement");
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

        const transition: Transition = {
          type: "tween",
          duration: 1,
          ease: "anticipate",
        };

        // if (x.isAnimating()) x.stop();
        // if (y.isAnimating()) y.stop();

        animate(x, final.x, transition);
        animate(y, final.y, transition);

        console.log(`${image.width} ${image.height}`);
        // console.log(`${aw} ${ah}`);
        // console.log({ s: crop.scale });
        console.log({ imgCenter: positionOfElement });
        console.log({ viewboxCenter });
        console.log({ diff });
        console.log({ final });
        console.log({ scale });
      }
    }
  };

  const panToCenter = (transition = baseTransition) => {
    console.log("-----------\ncenter");
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

      animate(x, final.x, transition);
      animate(y, final.y, transition);

      console.log(`${image.width} ${image.height}`);
      // console.log({ s: crop.scale });
      console.log({ imgCenter });
      console.log({ viewportCenter: viewboxCenter });
      console.log({ diff });
    }
  };

  const zoom = (step: number) =>
    // setCrop((v) => ({ ...v, scale: v.scale + step }));
    // setCrop({ x: x.get(), y: y.get(), scale: scale.get() + step });
    {
      animate(scale, scale.get() + step, { duration: 0.2 });
    };

  const zoomIn = () => {
    zoom(step);
    // adjustImage();
  };
  const zoomOut = () => {
    zoom(-step);

    // adjustImage();
  };

  const resetZoom = (transition = baseTransition) => {
    animate(scale, 1, transition);
  };

  const resetMap = () => {
    const transition = { ...baseTransition, duration: 0.6 };
    resetZoom(transition);
    panToCenter(transition);
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

  return (
    <Viewbox className="viewbow" ref={viewboxRef}>
      {/* <Debug drag data={{ crop, debug }}></Debug> */}
      {/* <Debug drag data={{ debug }}></Debug> */}

      {/* <DynamicPortal portalId="page-container"> */}
      {centerLines && (
        <>
          <B></B>
          <A></A>
        </>
      )}

      {/* <DynamicPortal portalId="page-container">
        <RectA></RectA>
        <RectB></RectB>
      </DynamicPortal> */}

      {/* <Debug drag data={debugData} /> */}
      {!isMobile && (
        <Cursor showPosition>
          <div>{}</div>
        </Cursor>
      )}

      <MapControls
        zoomIn={zoomIn}
        zoomOut={zoomOut}
        // centerMap={panToCenter}
        // centerMap={resetZoom}
        centerMap={resetMap}
      />

      <Searchbar pois={pois} panToElement={panToElement} />
      <BackgroundContainer>
        <HidingImage src={Mokoko} />
      </BackgroundContainer>

      <DraggableMap
        ref={draggableRef}
        // animate={{
        style={{
          x,
          y,
          scale,

          // x: crop.x,
          // y: crop.y,
          // scale: crop.scale,

          // transformOrigin: "top left",
        }}
        // style={{
        //   left: crop.x,
        //   top: crop.y,
        //   transform: `scale(${crop.scale})`,
        // }}
        // transition={{ duration: 0 }}
      >
        <Img src={LostArkMap} />

        {pois.map((data, i) => (
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

export default Map2;
