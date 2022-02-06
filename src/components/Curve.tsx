// styling:
import { css, jsx, Theme, useTheme } from "@emotion/react";
import styled from "@emotion/styled";

type Dims = {
  reverse: boolean;
  borderRadius: number;
  lowerHeight: number;
  upperWidth: number;
  upperHeight: number;
  totalHeight: number;
};

/* top: -${totalHeight}rem; */
const Container = styled.div<Dims>`
  /* border: 1px solid red; */

  position: absolute;
  bottom: 0;

  height: ${({ totalHeight }) => totalHeight}rem;
  width: 100%;

  transform: ${({ reverse }) => (reverse ? "scaleX(-1)" : "scaleX(1)")};

  pointer-events: none;
  overflow: hidden;

  display: flex;
  flex-direction: column;

  &::before {
    z-index: 2;

    /* border: 1px solid yellow; */

    box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;

    content: "";

    height: ${({ upperHeight }) => upperHeight}rem;
    width: ${({ upperWidth }) => upperWidth}rem;

    border-bottom-left-radius: ${({ borderRadius }) => borderRadius}rem;

    background-color: transparent;
    box-shadow: 0 ${({ borderRadius }) => borderRadius}rem 0 0
      ${({ theme }) => theme.colors.surface.main};
    /* box-shadow: 0 5rem 0 0 red; */
  }

  &::after {
    z-index: 1;
    box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;

    /* border: 1px solid green; */
    content: "";

    width: 100%;
    height: ${({ lowerHeight }) => lowerHeight}rem;
    border-top-right-radius: ${({ borderRadius }) => borderRadius}rem;

    background-color: ${({ theme }) => theme.colors.surface.main};
  }
`;
type CurveProps = {
  borderRadius?: number;
  reverse?: boolean;
};

const Curve = ({ borderRadius = 2, reverse = false }: CurveProps) => {
  // const borderRadius = 3;
  const lowerHeight = borderRadius;
  const upperWidth = borderRadius * 2;
  const upperHeight = borderRadius * 4;
  const totalHeight = lowerHeight + upperHeight;

  return (
    <Container
      reverse={reverse}
      borderRadius={borderRadius}
      lowerHeight={lowerHeight}
      upperWidth={upperWidth}
      upperHeight={upperHeight}
      totalHeight={totalHeight}
    ></Container>
  );
};

export default Curve;
