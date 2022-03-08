// styling:
import { css, jsx, Theme, useTheme } from "@emotion/react";
import styled from "@emotion/styled";

// libraries:
import { motion, MotionValue } from "framer-motion";
import { useEffect, useRef, useState } from "react";

// components:
import PointOfInterestIcon from "./PointOfInterestIcon";

// types:
import { Poi, PoiTypes } from "../types/PointOfInterestTypes";

const Container = styled(motion.span)`
  position: absolute;
  top: 0;
  left: 0;

  width: 32px;
  height: 32px;

  border-radius: 50%;

  cursor: pointer;

  display: flex;
  justify-content: center;
  align-items: center;

  &:hover {
    z-index: 9999;
  }
`;

const SizeLimiter = styled.span`
  z-index: 3;
  position: relative;

  width: 20px;
  height: 20px;
`;

const Header = styled(motion.span)`
  z-index: 1;

  position: absolute;
  left: 50%;

  height: 24px;

  overflow: hidden;

  white-space: nowrap;
  font-weight: 700;

  border-top-right-radius: 5rem;
  border-bottom-right-radius: 5rem;

  background-color: ${({ theme }) => theme.colors.surface.main};

  display: flex;
  /* justify-content: center; */
  align-items: center;
`;

const Background = styled(motion.span)`
  z-index: 2;
  position: absolute;
  top: 0;
  left: 0;

  width: 100%;
  height: 100%;
  border-radius: 50%;

  opacity: 1;
  background-color: ${({ theme }) => theme.colors.surface.main};

  box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px,
    rgba(60, 64, 67, 0.15) 0px 2px 6px 2px;
`;

type PoiProps = {
  data: Poi;
  // test: Poi;
  scale?: MotionValue<number>;
  onClick?: () => void;
};

const PointOfInterest = ({ data, onClick, scale }: PoiProps) => {
  const { x, y } = data.position;

  const [selfScale, setSelfScale] = useState(1);
  const [onHover, setOnHover] = useState(false);

  const bgAnimProps = {
    variants: {
      hide: {
        opacity: 0,
        transition: { type: "tween", duration: 0.15, delay: 0.15 },
      },
      show: {
        opacity: 1,
      },
    },
    initial: "hide",
    animate: onHover ? "show" : "hide",
    transition: { type: "tween", duration: 0.15 },
  };

  const headerAnimProps = {
    variants: {
      hide: {
        width: 0,
        paddingLeft: 0,
        opacity: 0,
      },
      show: {
        width: 18 * data.id.length, // change this to id.name later
        paddingLeft: "75%",
        opacity: 1,
        transition: { type: "tween", duration: 0.15, delay: 0.15 },
      },
    },
    initial: "hide",
    animate: onHover ? "show" : "hide",
    // exit: "initial",
    transition: { type: "tween", duration: 0.15 },
  };

  return (
    <Container
      // position={{ x, y }}
      id={data.id}
      style={{ x: data.position.x, y: data.position.y }}
      animate={{ scale: selfScale }}
      transition={{ type: "tween", duration: 0.15 }}
      onClick={(e) => {
        // e.preventDefault();
        // e.stopPropagation();

        if (onClick) onClick();
      }}
      onMouseEnter={() => {
        setOnHover(true);
        if (scale) {
          const currentScale = scale.get();
          if (currentScale < 1) {
            setSelfScale(1 / currentScale);
          }
        }
      }}
      onMouseLeave={() => {
        setOnHover(false);
        setSelfScale(1);
      }}
    >
      <Background {...bgAnimProps} />
      <SizeLimiter>
        <PointOfInterestIcon type={data.type} />
      </SizeLimiter>

      <Header {...headerAnimProps}>{data.id}</Header>
    </Container>
  );
};

export default PointOfInterest;
