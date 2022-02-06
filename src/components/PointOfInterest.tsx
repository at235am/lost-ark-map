// styling:
import { css, jsx, Theme, useTheme } from "@emotion/react";
import styled from "@emotion/styled";

// libraries:
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

type Position = { x: number; y: number };

const Container = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;

  background-color: black;

  cursor: pointer;

  &:hover {
    color: ${({ theme }) => theme.colors.primary.main};
  }
`;

export type PoiTypes = "island" | "zone" | "harbor" | "landing"; // will be revised

export type Poi = {
  id: string;
  type: PoiTypes;
  position: { x: number; y: number };
};

type PoiProps = {
  id: string;
  data: Poi;
  test: Poi;
  scale?: number;
  onClick?: () => void;
};

const PointOfInterest = ({ id, data, test, onClick, scale = 1 }: PoiProps) => {
  const { x, y } = data.position;
  return (
    <Container
      // position={{ x, y }}
      id={id}
      animate={{ x: data.position.x, y: data.position.y, scale: 1 }}
      transition={{ type: "tween", duration: 0 }}
      onClick={onClick}
    >
      {/* {JSON.stringify(data)} */}
      <div>{data.id}</div>
      <div>
        ({Math.round(data.position.x)}, {Math.round(data.position.y)})
      </div>
      <div>
        ({Math.round(test.position.x)}, {Math.round(test.position.y)})
      </div>
    </Container>
  );
};

export default PointOfInterest;
