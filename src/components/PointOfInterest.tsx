// styling:
import { css, jsx, Theme, useTheme } from "@emotion/react";
import styled from "@emotion/styled";

// libraries:
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

// components:
import PoiIcon from "./POIIcon";

// types:
import { Poi, PoiTypes } from "../types/POItypes";

type Position = { x: number; y: number };

const Container = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;

  // background-color: ${({ theme }) => theme.colors.surface.main};

  width: 10px;
  height: 10px;

  // cursor: pointer;

  // &:hover {
  //   color: ${({ theme }) => theme.colors.primary.main};
  // }

  display: flex;
  justify-content: center;
  align-items: center;

  &:hover {
    background-color: ${({ theme }) => theme.colors.primary.main};
  }
`;

type PoiProps = {
  data: Poi;
  // test: Poi;
  scale?: number;
  onClick?: () => void;
};

const PointOfInterest = ({ data, onClick, scale = 1 }: PoiProps) => {
  const { x, y } = data.position;

  return (
    <Container
      // position={{ x, y }}
      id={data.id}
      animate={{ x: data.position.x, y: data.position.y, scale: 1 }}
      transition={{ type: "tween", duration: 0 }}
      onClick={(e) => {
        // e.preventDefault();
        // e.stopPropagation();

        if (onClick) onClick();
      }}
    >
      <PoiIcon type={data.type} />
    </Container>
  );
};

export default PointOfInterest;
