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

const POIContainer = styled(motion.div)`
  position: absolute;

  height: 100%;
  width: 100%;

  display: flex;
  justify-content: center;
  align-items: center;
`;

const POI = styled(motion.div)`
  height: 15rem;
  width: 20rem;

  border: 1px solid ${({ theme }) => theme.colors.background.main};
  border-radius: 1px;
  background: ${({ theme }) => theme.colors.background.darker};
`;

export type PoiTypes = "island" | "zone" | "harbor" | "landing" | "gate"; // will be revised

export type Poi = {
  id: string;
  type: PoiTypes;
  position: { x: number; y: number };
  // name?: string;
  // islandHearts?: number;
  // mokokoSeeds?: number;
  // recommendedGearScore?: number;
  // availability?: string;
  // bifrost?: string;
  // localEvent?: string;
  // bossAppearance?: string;
  // craftingResources?: string;
  // craftMaterialRank?: string;
  // pvp?: string;
  // rewards?: string;
  // givana?: boolean;
  // territorialStatus?: string;
};

type PoiProps = { data: Poi; test: Poi };

const PointOfInterest = ({ data, test }: PoiProps) => {
  const { x, y } = data.position;
  const [showPOI, setShowPOI] = useState(false);

  const toggleShowPOI = () => setShowPOI(!showPOI);

  return (
    <Container
      // position={{ x, y }}
      id={data.id}
      animate={{ x, y }}
      transition={{ type: "tween", duration: 0.2 }}
      onClick={toggleShowPOI}
    >
      {/* {JSON.stringify(data)} */}
      {showPOI && (
        <DynamicPortal portalId="page-container" backdrop close={toggleShowPOI}>
          <POIContainer>
            <POI>
              <div>{data.id}</div>
              <div>
                ({Math.round(data.position.x)}, {Math.round(data.position.y)})
              </div>
              <div>
                ({Math.round(test.position.x)}, {Math.round(test.position.y)})
              </div>
            </POI>
          </POIContainer>
        </DynamicPortal>
      )}
    </Container>
  );
};

export default PointOfInterest;
