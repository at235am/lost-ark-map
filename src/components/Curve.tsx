// styling:
import { css, jsx, Theme, useTheme } from "@emotion/react";
import styled from "@emotion/styled";

type RestrictedPosition = "relative" | "absolute";
type CurvePosition = {
  position: RestrictedPosition;
  bottom: number | null;
  top: number | null;
};

type Dims = {
  position: CurvePosition;
  bgColor: string | undefined;
  reverse: boolean;
  topBorderRadius: number;
  bottomBorderRadius: number;
  lowerHeight: number;
  upperWidth: number;
  upperHeight: number;
  totalHeight: number;
};
// position: ${({ position }) => position};

/* top: -${totalHeight}px; */
const Container = styled.div<Dims>`
  /* border: 1px solid blue; */

  ${({ position }) => css`
    position: ${position.position};
    top: ${position.top}px;
    bottom: ${position.bottom}px;
  `}

  height: ${({ totalHeight }) => totalHeight}px;
  width: 100%;

  transform: ${({ reverse }) => (reverse ? "scaleX(-1)" : "scaleX(1)")};
  background-color: tranparent;

  pointer-events: none;
  overflow: hidden;

  display: flex;
  flex-direction: column;

  &::before {
    /* border: 1px solid yellow; */

    z-index: 2;
    content: "";
    /* box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px; */

    height: ${({ upperHeight }) => upperHeight}px;
    width: ${({ upperWidth }) => upperWidth}px;

    border-bottom-left-radius: ${({ topBorderRadius }) => topBorderRadius}px;
    background-color: transparent;

    box-shadow: 0 ${({ topBorderRadius }) => topBorderRadius}px 0 0
      ${({ theme, bgColor }) => bgColor ?? theme.colors.surface.main};
    /* box-shadow: 0 5px 0 0 red; */
  }

  &::after {
    /* border: 1px solid green; */

    z-index: 1;
    content: "";
    box-shadow: rgba(100, 100, 111, 0.6) 0px 7px 29px 0px;

    height: ${({ lowerHeight }) => lowerHeight}px;
    width: 100%;

    border-top-right-radius: ${({ bottomBorderRadius }) =>
      bottomBorderRadius}px;
    background-color: ${({ theme, bgColor }) =>
      bgColor ?? theme.colors.surface.main};
  }
`;
type CurveProps = {
  topBorderRadius?: number;
  bottomBorderRadius?: number;
  reverse?: boolean;
  bgColor?: string;
  top?: boolean;
  bottom?: boolean;
};

const Curve = ({
  // position = "relative",
  topBorderRadius = 14,
  bottomBorderRadius = 0,
  reverse = false,
  bgColor,
  top = false,
  bottom = false,
}: CurveProps) => {
  // const borderRadius = 3;
  const lowerHeight = bottomBorderRadius;
  const lowerWidth = bottomBorderRadius;

  const upperWidth = topBorderRadius * 2;
  const upperHeight = topBorderRadius * 4;

  const totalHeight = lowerHeight + upperHeight;

  const position = {
    position: top || bottom ? "absolute" : ("relative" as RestrictedPosition),
    top: top && !bottom ? -totalHeight : null,
    bottom: bottom ? 0 : null,
  };

  return (
    <Container
      className="curve"
      bgColor={bgColor}
      reverse={reverse}
      position={position}
      topBorderRadius={topBorderRadius}
      bottomBorderRadius={bottomBorderRadius}
      lowerHeight={lowerHeight}
      upperWidth={upperWidth}
      upperHeight={upperHeight}
      totalHeight={totalHeight}
    ></Container>
  );
};

export default Curve;
