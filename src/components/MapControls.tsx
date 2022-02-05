// styling:
import { css, jsx, Theme, useTheme } from "@emotion/react";
import styled from "@emotion/styled";

// libraries:
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const Container = styled.div`
  z-index: 200;

  position: absolute;
  bottom: 0;
  right: 0;

  margin: 1rem;
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

const ZoomButton = styled.button`
  width: 4rem;
  height: 4rem;
  background-color: ${({ theme }) => theme.colors.surface.main};
  color: ${({ theme }) => theme.colors.onSurface.main};
`;

type MapControlsProps = {
  zoomIn?: () => void;
  zoomOut?: () => void;
  centerMap?: () => void;
};

const MapControls = ({ zoomIn, zoomOut, centerMap }: MapControlsProps) => {
  return (
    <Container>
      <ZoomContainer>
        <ZoomButton type="button" onClick={zoomIn}>
          +
        </ZoomButton>
        <ZoomButton type="button" onClick={zoomOut}>
          -
        </ZoomButton>
        <ZoomButton type="button" onClick={centerMap}>
          OOPS
        </ZoomButton>
      </ZoomContainer>
    </Container>
  );
};

export default MapControls;
