// styling:
import { css, jsx, Theme, useTheme } from "@emotion/react";
import styled from "@emotion/styled";
import { ReactElement } from "react";
import { MdPlace } from "react-icons/md";

const Container = styled.div`
  position: relative;

  /* border: 2px solid blue; */
  min-width: 64px;
  min-height: 64px;

  #marker {
    z-index: 1;

    position: absolute;
    top: 0;
    left: 0;

    width: 100%;
    height: 100%;

    fill: ${({ theme }) => theme.colors.onSurface.main};
    fill: ${({ theme }) => theme.colors.caution.darker};
  }
`;

const CircleBackground = styled.div`
  z-index: 2;
  position: absolute;
  top: 12px;
  left: 50%;

  transform: translateX(-50%);

  border-radius: 50%;

  width: 24px;
  height: 24px;

  background-color: #fff;

  display: flex;
  justify-content: center;
  align-items: center;
`;

type MarkerProps = { children: ReactElement };

const Marker = ({ children }: MarkerProps) => {
  return (
    <Container>
      <MdPlace id="marker" />
      <CircleBackground>{children}</CircleBackground>
    </Container>
  );
};
export default Marker;
