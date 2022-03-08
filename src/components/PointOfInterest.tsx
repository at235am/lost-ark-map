// styling:
import { css, jsx, Theme, useTheme } from "@emotion/react";
import styled from "@emotion/styled";

// libraries:
import { motion, MotionValue } from "framer-motion";
import { memo, useEffect, useRef, useState } from "react";

// components:
import PointOfInterestIcon from "./PointOfInterestIcon";

// types:
import { Poi, PoiTypes } from "../types/PointOfInterestTypes";

// icons:
import { MdPlace } from "react-icons/md";
import isEqual from "lodash.isequal";
import Marker from "./Marker";

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

const SizeLimiter = styled.span<{ w: number; h: number }>`
  z-index: 3;
  position: relative;

  width: ${({ w }) => w}px;
  height: ${({ h }) => h}px;
`;

const Header = styled(motion.span)`
  z-index: 1;

  position: absolute;
  left: 50%;

  height: 24px;

  overflow: hidden;

  white-space: nowrap;
  font-weight: 700;
  user-select: none;

  border-top-right-radius: 5rem;
  border-bottom-right-radius: 5rem;

  background-color: ${({ theme }) => theme.colors.surface.main};

  display: flex;
  /* justify-content: center; */
  align-items: center;
`;

const IconBackground = styled(motion.span)`
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
  scale?: MotionValue<number>;
  clickAction?: (poiId: string) => void;
  selected?: boolean;
};

const PointOfInterest = ({
  data,
  clickAction,
  scale,
  selected = false,
}: PoiProps) => {
  const { x, y } = data.position;

  const [selfScale, setSelfScale] = useState(1);
  const [onHover, setOnHover] = useState(false);

  const showIslandName = onHover && !selected;

  const iconBgAnimProps = {
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
    animate: showIslandName ? "show" : "hide",
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
    animate: showIslandName ? "show" : "hide",
    transition: { type: "tween", duration: 0.15 },
  };

  const toggleHoverState = () => setOnHover((v) => !v);
  const turnOnHover = () => setOnHover(true);
  const turnOffHover = () => setOnHover(false);

  const click = () => clickAction && clickAction(data.id);

  const resetScale = () => setSelfScale(1);

  const rescale = () => {
    if (scale) {
      const currentScale = scale.get();
      if (currentScale < 1) {
        setSelfScale(1 / currentScale);
      }
    }
  };

  useEffect(() => {
    if (onHover) rescale();
    else resetScale();
  }, [onHover]);

  return (
    <Container
      id={data.id}
      style={{ x: data.position.x, y: data.position.y }}
      animate={{ scale: selfScale }}
      transition={{ type: "tween", duration: 0.15 }}
      onClick={click}
      onMouseEnter={turnOnHover}
      onMouseLeave={turnOffHover}
      onBlur={turnOffHover}
    >
      {!selected && (
        <>
          <Header {...headerAnimProps}>{data.id}</Header>
          <IconBackground {...iconBgAnimProps} />
          <SizeLimiter className="size-limit-1" w={20} h={20}>
            <PointOfInterestIcon type={data.type} />
          </SizeLimiter>
        </>
      )}

      {selected && (
        <Marker>
          <SizeLimiter className="size-limit" w={18} h={18}>
            <PointOfInterestIcon type={data.type} />
          </SizeLimiter>
        </Marker>
      )}
    </Container>
  );
};

const compare = (
  prevProps: Readonly<PoiProps>,
  nextProps: Readonly<PoiProps>
) => {
  return (
    // prevProps.clickAction === nextProps.clickAction && // DO NOT CHECK FOR CLICK ACTION
    // prevProps.scale === nextProps.scale && // DO NOT CHECK FOR SCALE (because a motionvalue is a ref)
    prevProps.selected === nextProps.selected &&
    isEqual(prevProps.data, nextProps.data)
  );
};

export default memo(PointOfInterest, compare);
