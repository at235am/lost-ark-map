// styling:
import { css, jsx, Theme, useTheme } from "@emotion/react";
import styled from "@emotion/styled";
import { ReactElement } from "react";
import { MdPlace } from "react-icons/md";
import { PoiTypes } from "../types/PointOfInterestTypes";
import PointOfInterestIcon from "./PointOfInterestIcon";

const Container = styled.span<{ size: number; bgColor: string }>`
  position: relative;

  min-width: ${({ size }) => size}px;
  min-height: ${({ size }) => size}px;
  width: ${({ size }) => size}px;
  height: ${({ size }) => size}px;

  &::after {
    content: "";

    z-index: -1;
    position: absolute;

    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);

    width: ${({ size }) => size + 10}px;
    height: ${({ size }) => size + 10}px;
    border-radius: 50%;

    background-color: ${({ theme, bgColor }) => bgColor};
  }
`;

type IconWrapperProps = {
  type: PoiTypes;
  stroke?: boolean;
  size?: number;
  bgColor?: string;
};

const IconWrapper = ({
  type,
  stroke,
  size = 64,
  bgColor = "transparent",
}: IconWrapperProps) => {
  return (
    <Container size={size} bgColor={bgColor}>
      <PointOfInterestIcon type={type} />
    </Container>
  );
};

export default IconWrapper;
