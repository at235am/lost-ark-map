// styling:
import { css, jsx, Theme, useTheme } from "@emotion/react";
import styled from "@emotion/styled";

// libraries:
import {
  animate,
  AnimatePresence,
  motion,
  useMotionValue,
} from "framer-motion";
import Fuse from "fuse.js";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useUIState } from "../contexts/UIContext";

import { Controls } from "./Map2";

// assets:
import LOScreenshot from "../assets/ingame-screenshot.jpg";
import useResizeObserver from "use-resize-observer";
import { Poi } from "./PointOfInterest";
import { loadImage } from "../utils/utils";

const Container = styled(motion.div)`
  /* border: 1px solid red; */

  /* MapSidebar needs to be higher than the Viewbox of the Map componeent so that we can cast shadows */
  z-index: 1;

  /* tells the parent flex container to NOT shrink this at all no matter what */
  flex-shrink: 0;

  /* overflow: hidden; */

  /* overflow: hidden; */
  box-shadow: rgba(0, 0, 0, 0.8) 0px 3px 8px;

  background-color: ${({ theme }) => theme.colors.background.main};

  display: flex;
  flex-direction: column;
`;

const ImageContainer = styled.div`
  z-index: 1;

  position: relative;
  height: 30%;

  flex-shrink: 0;

  overflow: hidden;
`;

const ContentContainer = styled.div`
  z-index: 2;

  position: relative;

  background-color: ${({ theme }) => theme.colors.surface.main};

  height: 100%;

  padding: 1rem;
  padding-top: 0;
`;

const borderRadius = 3;
const lowerHeight = borderRadius;
const upperWidth = borderRadius * 2;
const upperHeight = borderRadius * 4;
const totalHeight = lowerHeight + upperHeight;

const Curve = styled.div`
  /* border: 1px solid red; */

  position: absolute;
  /* top: -${totalHeight}rem; */
  bottom: 0;

  height: ${totalHeight}rem;
  width: 100%;

  pointer-events: none;
  overflow: hidden;

  display: flex;
  flex-direction: column;

  &::before {
    z-index: 2;

    /* border: 1px solid yellow; */

    box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;

    content: "";

    height: ${upperHeight}rem;
    width: ${upperWidth}rem;

    border-bottom-left-radius: ${borderRadius}rem;

    background-color: transparent;
    box-shadow: 0 ${borderRadius}rem 0 0
      ${({ theme }) => theme.colors.surface.main};
    /* box-shadow: 0 5rem 0 0 red; */
  }

  &::after {
    z-index: 1;
    box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;

    /* border: 1px solid green; */
    content: "";

    width: 100%;
    height: ${lowerHeight}rem;
    border-top-right-radius: ${borderRadius}rem;

    background-color: ${({ theme }) => theme.colors.surface.main};
  }
`;

const Img = styled(motion.img)`
  height: 100%;

  object-fit: cover;
  user-select: none;
  pointer-events: none;
  touch-action: none;
  /* display: block; */
`;

const Header = styled.h1`
  position: relative;
  top: -2rem;

  padding: 0 1rem;
  font-weight: 700;
  font-size: 2.5rem;
`;

type MapSidebarProps = {
  controls: Controls;
  poi: Poi;
};

const MapSidebar = ({ controls, poi }: MapSidebarProps) => {
  const {
    toggleSidebar,
    openSidebar,
    closeSidebar,
    panToCenter,
    panToElement,
    zoom,
    zoomIn,
    zoomOut,
    resetZoom,
  } = controls;
  const sidebarRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  const imgDims = useResizeObserver({ ref: imgRef });
  const imgX = useMotionValue(0);

  const { isMobile } = useUIState();

  const [showMarker, setShowMarker] = useState(true);

  const center = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

  const animProps = {
    // variants: pageVariants,
    variants: {
      enter: {
        x: -100,
        y: center.y,
        opacity: 1,
      },
      center: {
        x: center.x,
        y: center.y,

        opacity: 1,
      },
      exit: {
        // zIndex: 0,
        x: 2000,
        y: center.y,
        opacity: 0,
      },
    },
    initial: "enter",
    animate: "center",
    exit: "exit",
    transition: {
      // x: { type: "spring", stiffness: 300, damping: 30 },
      // opacity: { duration: 0.2 },
      duration: 0.5,
      // delay: 0.5,
    },
  };

  // CANT DEPEND ON WINDOW DIMENSION, CHANGE IT TO DEPEND ON THE CONTAINER
  const sidebarWidth = isMobile ? window.innerWidth : 14 * 30;
  const sidebarHeight = window.innerHeight * 0.4;

  const desktopSidebarAnimProps = {
    variants: {
      initial: {
        width: 0,
        opacity: 0,
      },
      enter: {
        width: sidebarWidth,
        opacity: 1,
        // transition: { type: "tween", duration: 0.5, delayChildren: 2 },
      },
      exit: {
        width: 0,
        opacity: 0,
      },
    },
    initial: "initial",
    animate: "enter",
    exit: "exit",

    transition: {
      type: "tween",
      duration: 0.5,
    },
  };

  const mobileSidebarAnimProps = {
    variants: {
      initial: {
        width: sidebarWidth,
        height: 0,
        // y: sidebarHeight,

        opacity: 0,
      },
      enter: {
        width: sidebarWidth,
        height: sidebarHeight,
        // y: 0,

        opacity: 1,
      },
      exit: {
        width: sidebarWidth,
        height: 0,
        // y: sidebarHeight,
        // x: -sidebarWidth,
        opacity: 0,
      },
    },
    initial: "initial",
    animate: "enter",
    exit: "exit",

    transition: { type: "tween", duration: 0.5 },
  };

  const sidebarAnimProps = isMobile
    ? mobileSidebarAnimProps
    : desktopSidebarAnimProps;

  useEffect(() => {
    if (imgDims.width) {
      const maxOffset = sidebarWidth - imgDims.width;
      animate(imgX, [0, maxOffset], {
        repeat: Infinity,
        repeatType: "reverse",
        duration: 10,
      });
    }
  }, [imgDims.width]);

  return (
    <Container ref={sidebarRef} {...sidebarAnimProps}>
      <ImageContainer>
        <Img ref={imgRef} style={{ x: imgX }} src={LOScreenshot} />
        <Curve></Curve>
      </ImageContainer>
      <ContentContainer>
        <Header>Header</Header>
      </ContentContainer>
    </Container>
  );
};

export default MapSidebar;
