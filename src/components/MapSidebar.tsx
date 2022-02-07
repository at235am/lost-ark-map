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
import Curve from "./Curve";

const Container = styled(motion.div)`
  /* border: 2px dashed red; */
  position: relative;

  /* MapSidebar needs to be higher than the Viewbox of the Map componeent so that we can cast shadows */
  z-index: 2;

  /* tells the parent flex container to NOT shrink this at all no matter what */
  flex-shrink: 0;

  /* overflow: hidden; */

  /* overflow: hidden; */
  box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.75);

  background-color: ${({ theme }) => theme.colors.background.main};

  overflow-x: hidden;
  overflow-y: visible;

  display: flex;
  flex-direction: column;

  @media (max-width: ${({ theme }) => theme.breakpoints.s}px) {
    overflow-x: visible;
    background-color: ${({ theme }) => theme.colors.surface.main};

    box-shadow: rgba(100, 100, 111, 1) 0px 5px 29px 0px;
  }
`;

const Lip = styled(motion.div)`
  z-index: 1;

  position: absolute;
  top: -1rem;

  border-top-left-radius: 1rem;
  border-top-right-radius: 1rem;

  height: 1rem;
  width: 100%;

  background-color: ${({ theme }) => theme.colors.surface.main};
  /* box-shadow: rgba(100, 100, 111, 1) 0px 7px 29px 0px;
  box-shadow: red 0px 7px 29px 0px; */

  display: flex;
  justify-content: center;
  align-items: center;

  &::before {
    content: "";
    width: 2rem;
    height: 4px;
    border-radius: 2rem;

    background-color: ${({ theme }) => theme.colors.onSurface.main};
  }
`;

const ImageContainer = styled.div`
  /* border: 1px dashed yellow; */

  z-index: 2;
  position: relative;

  /* background-color: ${({ theme }) => theme.colors.surface.main}; */

  height: 30%;

  flex-shrink: 0;

  overflow: visible;

  @media (max-width: ${({ theme }) => theme.breakpoints.s}px) {
    overflow: hidden;

    background-color: red;
  }
`;

const ContentContainer = styled.div`
  /* border: 2px dashed purple; */

  /* border-top-right-radius: 3rem; */
  z-index: 3;

  position: relative;

  background-color: ${({ theme }) => theme.colors.surface.main};

  height: 100%;

  /* padding: 1rem; */
  padding-top: 0;
`;

const Img = styled(motion.img)`
  height: 100%;
  width: auto;

  object-fit: cover;
  user-select: none;
  pointer-events: none;
  touch-action: none;

  @media (max-width: ${({ theme }) => theme.breakpoints.s}px) {
    height: auto;
    width: 100%;
    border-top-right-radius: 1.5rem;
    border-top-left-radius: 1.5rem;
  }
`;

const Header = styled.h1`
  position: relative;
  /* top: -2rem; */

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
        height: "100%",
        opacity: 0,
        y: 0,
      },
      enter: {
        width: sidebarWidth,
        height: "100%",
        opacity: 1,
        y: 0,

        // transition: { type: "tween", duration: 0.5, delayChildren: 2 },
      },
    },
    initial: "initial",
    animate: "enter",
    exit: "initial",
    transition: {
      type: "tween",
      duration: 0.5,
    },
  };

  const mobileSidebarAnimProps = {
    variants: {
      initial: {
        width: "100%",
        height: 0,
        opacity: 0,
      },
      enter: {
        width: "100%",
        height: sidebarHeight,
        opacity: 1,
      },
    },
    initial: "initial",
    animate: "enter",
    exit: "initial",
    transition: { type: "tween", duration: 0.5 },
  };

  const sidebarAnimProps = isMobile
    ? mobileSidebarAnimProps
    : desktopSidebarAnimProps;

  useEffect(() => {
    if (imgDims.width) {
      const maxOffset = sidebarWidth - imgDims.width;
      // animate(imgX, [0, maxOffset], {
      //   repeat: Infinity,
      //   repeatType: "reverse",
      //   duration: 10,
      // });
    }
  }, [imgDims.width]);

  const curvePropsDesktop = {
    topBorderRadius: 3 * 14,
    bottomBorderRadius: 3 * 14,
  };
  const curvePropsMobile = {
    topBorderRadius: 2 * 14,
    bottomBorderRadius: 2 * 14,
  };

  const curveProps = isMobile ? curvePropsMobile : curvePropsDesktop;

  return (
    <Container
      ref={sidebarRef}
      {...sidebarAnimProps}
      drag={isMobile ? "y" : false}
    >
      <Lip className="lip"></Lip>
      <ImageContainer>
        <Img ref={imgRef} style={{ x: imgX }} src={LOScreenshot} />

        <Curve bottom {...curveProps} />
      </ImageContainer>
      <ContentContainer>
        <Header>Header</Header>
        {/* <Curve
          top
          topBorderRadius={3 * 14}
          bottomBorderRadius={2 * 14}
          // bgColor="red"
        /> */}
      </ContentContainer>
    </Container>
  );
};

export default MapSidebar;
