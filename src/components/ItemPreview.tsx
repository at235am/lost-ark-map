// styling:
import { css, jsx, Theme, useTheme } from "@emotion/react";
import styled from "@emotion/styled";
// edited in POI branch
// import PointOfInterest, { Poi, PoiTypes } from "./PointOfInterest";
// import { Poi } from "./PointOfInterest";
import { Poi } from "../types/PointOfInterestTypes";

// icons:
import { MdAdd, MdMap, MdSubdirectoryArrowRight } from "react-icons/md";
import { RiMapPinAddFill, RiMapPinAddLine } from "react-icons/ri";
import { motion } from "framer-motion";
import { Controls } from "./Map2";

const Container = styled.li`
  /* border-top: 1px solid ${({ theme }) => theme.colors.surface.darker}; */
  /* border: 1px solid grey; */

  cursor: pointer;

  height: 4rem;
  padding: 0 0.75rem;

  display: flex;
  align-items: center;

  &:hover {
    /* border-top: 1px solid ${({ theme }) => theme.colors.surface.darker};
    border-bottom: 1px solid ${({ theme }) => theme.colors.surface.darker}; */

    background-color: ${({ theme }) => theme.colors.surface.dark};
  }
`;

const Name = styled.h2`
  /* border: 1px solid red; */
  flex: 1;
  height: 100%;
  padding: 0 1rem;

  font-weight: 700;

  color: ${({ theme }) => theme.colors.onSurface.main};

  display: flex;
  align-items: center;
`;

const buttonStyles = (props: any) => css`
  background-color: transparent;

  border-radius: 50%;

  min-width: 3rem;
  min-height: 3rem;

  display: flex;
  justify-content: center;
  align-items: center;

  svg {
    width: 24px;
    height: 24px;

    fill: ${props.theme.colors.onSurface.main};
  }

  &:hover {
    background-color: ${props.theme.colors.surface.darker};
    background-color: ${props.theme.colors.surface.main};
    background-color: ${props.theme.colors.primary.main};
    background-color: currentColor;

    svg {
      fill: ${props.theme.colors.surface.main};
    }
    box-shadow: rgba(255, 255, 255, 0.1) 0px 1px 1px 0px inset,
      rgba(50, 50, 93, 0.25) 0px 50px 100px -20px,
      rgba(0, 0, 0, 0.3) 0px 30px 60px -30px;
    /* border: 1px solid ${props.theme.colors.surface.darker}; */
  }
`;

const AddTrackerButton = styled(motion.button)`
  ${buttonStyles}
  color: ${({ theme }) => theme.colors.danger.main};

  svg {
    fill: ${({ theme }) => theme.colors.danger.main};
  }
`;

const MapButton = styled(motion.button)`
  ${buttonStyles}
  color: ${({ theme }) => theme.colors.info.main};

  svg {
    fill: ${({ theme }) => theme.colors.info.main};
  }
`;

const GoToButton = styled(motion.button)`
  ${buttonStyles}
  color: ${({ theme }) => theme.colors.success.main};

  svg {
    fill: ${({ theme }) => theme.colors.success.main};
  }
`;

type ItemPreviewProps = {
  onClick?: () => void;
  poi: Poi;

  controls: Controls;
};

const ItemPreview = ({ poi, controls, onClick }: ItemPreviewProps) => {
  const { panToElement } = controls;
  return (
    <Container>
      <Name onClick={onClick}>{poi.id}</Name>
      <AddTrackerButton type="button">
        <RiMapPinAddLine />
      </AddTrackerButton>

      <MapButton type="button">
        <MdMap />
      </MapButton>

      <GoToButton
        type="button"
        onClick={() => panToElement(poi.id, { duration: 0.5 })}
      >
        <MdSubdirectoryArrowRight />
      </GoToButton>
    </Container>
  );
};
export default ItemPreview;
