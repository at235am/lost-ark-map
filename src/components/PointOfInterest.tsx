// styling:
import { css, jsx, Theme, useTheme } from "@emotion/react";
import styled from "@emotion/styled";

// libraries:
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

// components:
import DynamicPortal from "./DynamicPortal";

type Position = { x: number; y: number };

const Container = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;

  background-color: black;

  width: 10px;
  height: 10px;

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

type PoiProps = { id: string; data: Poi; test: Poi };

const PointOfInterest = ({ id, data, test }: PoiProps) => {
  const { x, y } = data.position;
  const [showPOI, setShowPOI] = useState(false);

  const toggleShowPOI = () => setShowPOI(!showPOI);

  return (
    <Container
      // position={{ x, y }}
      id={id}
      animate={{ x, y }}
      transition={{ type: "tween", duration: 0.2 }}
      onClick={toggleShowPOI}
    >
      {/* {JSON.stringify(data)} */}
      {showPOI && (
        <DynamicPortal portalId="page-container" backdrop close={toggleShowPOI}>
          <div>
            <div>{data.id}</div>
            <div>
              ({Math.round(data.position.x)}, {Math.round(data.position.y)})
            </div>
            <div>
              ({Math.round(test.position.x)}, {Math.round(test.position.y)})
            </div>
          </div>
        </DynamicPortal>
      )}
    </Container>
  );
};

export default PointOfInterest;
