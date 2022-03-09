// styling:
import { css, jsx, Theme, useTheme } from "@emotion/react";
import styled from "@emotion/styled";
import { ReactElement } from "react";
import { ReactComponent as MarkerIcon } from "../assets/icons/marker.svg";

const Container = styled.span`
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

    #bg {
      fill: ${({ theme }) => theme.colors.caution.main};
      fill: yellow;
    }
  }
`;

const Placement = styled.div`
  z-index: 2;
  position: absolute;
  top: 12px;
  left: 50%;

  transform: translateX(-50%);

  display: flex;
  justify-content: center;
  align-items: center;
`;

type MarkerProps = { children: ReactElement };

const Marker = ({ children }: MarkerProps) => {
  return (
    <Container>
      <MarkerIcon id="marker" />
      <Placement>{children}</Placement>
    </Container>
  );
};
export default Marker;
