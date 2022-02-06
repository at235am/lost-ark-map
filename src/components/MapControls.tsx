// styling:
import { css, jsx, Theme, useTheme } from "@emotion/react";
import styled from "@emotion/styled";

// libraries:
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Controls } from "./Map2";

/// icons:
import { MdAdd, MdRemove } from "react-icons/md";
import { GrPowerReset } from "react-icons/gr";

const Container = styled(motion.div)`
  z-index: 200;

  background-color: ${({ theme }) => theme.colors.surface.main};
  position: absolute;
  bottom: 0;
  right: 0;

  width: 3rem;

  padding: 0.75rem 1rem;

  border-radius: 5rem;
  overflow: hidden;

  margin: 1rem;

  box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;

  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Overlay = styled.div`
  z-index: 200;

  position: absolute;
  bottom: 0;
  right: 0;
  margin: 1rem;
`;

const ZoomContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const ZoomButton = styled(motion.button)`
  background-color: transparent;
  /* background-color: red; */

  border-radius: 50%;

  min-width: 2rem;
  min-height: 2rem;

  display: flex;
  justify-content: center;
  align-items: center;

  svg {
    width: 18px;
    height: 18px;

    fill: ${({ theme }) => theme.colors.onSurface.main};
  }

  &:hover {
    background-color: ${({ theme }) => theme.colors.surface.darker};
  }
`;

type MapControlsProps = {
  controls: Controls;
  isDragging: boolean;
};

const MapControls = ({ controls, isDragging }: MapControlsProps) => {
  const { zoomIn, zoomOut, resetMap } = controls;
  return (
    <Container animate={{ opacity: isDragging ? 0.6 : 1 }}>
      <ZoomContainer>
        <ZoomButton type="button" onClick={zoomIn}>
          <MdAdd />
        </ZoomButton>
        <ZoomButton type="button" onClick={zoomOut}>
          <MdRemove />
        </ZoomButton>
        <ZoomButton type="button" onClick={resetMap}>
          <GrPowerReset />
        </ZoomButton>
      </ZoomContainer>
    </Container>
  );
};

export default MapControls;
