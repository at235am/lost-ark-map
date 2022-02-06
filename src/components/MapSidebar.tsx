// styling:
import { css, jsx, Theme, useTheme } from "@emotion/react";
import styled from "@emotion/styled";

// libraries:
import { AnimatePresence, motion } from "framer-motion";
import Fuse from "fuse.js";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useUIState } from "../contexts/UIContext";

import { Controls } from "./Map2";

const Container = styled(motion.div)`
  /* border: 1px solid red; */

  /* MapSidebar needs to be higher than the Viewbox of the Map componeent so that we can cast shadows */
  z-index: 1;

  /* tells the parent flex container to NOT shrink this at all no matter what */
  flex-shrink: 0;

  box-shadow: rgba(0, 0, 0, 0.8) 0px 3px 8px;

  background-color: ${({ theme }) => theme.colors.background.main};
`;

const Item = styled.div`
  cursor: pointer;

  &:hover {
    color: ${({ theme }) => theme.colors.primary.main};
  }
`;

const Marker = styled(motion.div)`
  /* cursor: pointer; */
  /* z-index: 1000; */

  position: absolute;

  width: 3rem;
  height: 3rem;

  border: 5px solid yellow;
  border-radius: 50%;

  background-color: transparent;

  &:hover {
    color: ${({ theme }) => theme.colors.primary.main};
  }
`;

type MapSidebarProps = {
  controls: Controls;
};

const MapSidebar = ({ controls }: MapSidebarProps) => {
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

  const { isMobile } = useUIState();

  const [showMarker, setShowMarker] = useState(true);
  const [isFocused, setIsFocused] = useState(false);

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
      },
      exit: {
        width: 0,
        opacity: 0,
      },
    },
    initial: "initial",
    animate: "enter",
    exit: "exit",
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
  };

  const sidebarAnimProps = isMobile
    ? mobileSidebarAnimProps
    : desktopSidebarAnimProps;

  const toggleFocus = () => setIsFocused((v) => !v);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    const fn = () => {
      setShowMarker(false);
    };
    if (showMarker) {
      timer = setTimeout(fn, 5000);
    }

    return () => {
      clearTimeout(timer);
    };
  }, [showMarker]);

  return (
    <Container
      ref={sidebarRef}
      // onFocus={toggleFocus}
      // onBlur={toggleFocus}

      // onFocus={() => {
      //   console.log("focus");
      //   setIsFocused(true);
      // }}
      // onBlur={() => {
      //   console.log("blur");

      //   setIsFocused(false);
      // }}
      {...sidebarAnimProps}
    >
      {/* <Searchbar
        value={searchTerm}
        handleChange={setSearchTerm}
       
      /> */}
    </Container>
  );
};

export default MapSidebar;
