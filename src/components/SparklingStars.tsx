// styling:
import { css, jsx, Theme, useTheme } from "@emotion/react";
import styled from "@emotion/styled";

// libraries:
import { AnimatePresence, motion } from "framer-motion";
import { nanoid } from "nanoid";
import { useMemo } from "react";
import { getRandomIntInclusive } from "../utils/utils";

const Container = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;

  &:hover {
    /* background-color: red; */
  }
`;

const Star = styled(motion.span)`
  position: absolute;

  background-color: white;
  top: 0;
  left: 0;

  width: 1rem;
  height: 1rem;

  &:hover {
    cursor: pointer;
    background-color: ${({ theme }) => theme.colors.caution.main};
  }
`;

const getRandomPosition = (
  minX: number,
  maxX: number,
  minY: number,
  maxY: number
) => ({
  x: getRandomIntInclusive(minX, maxX),
  y: getRandomIntInclusive(minY, maxY),
});

const getRandomDimensions = (min: number, max: number) => {
  const d = getRandomIntInclusive(min, max);
  return { width: d, height: d };
};

type SparklingStarsProps = {
  numberOfStars?: number;
  disable?: boolean;
  disableAnimation?: boolean;
};

const SparklingStars = ({
  numberOfStars,
  disable = false,
  disableAnimation = false, // note disabling the animations currently does NOT work
}: SparklingStarsProps) => {
  const stars = numberOfStars ?? Math.round(window.innerWidth / 10);

  const starz = useMemo(
    () =>
      [...Array(stars).keys()].map((star) => ({
        id: nanoid(6),
        position: getRandomPosition(
          0,
          window.innerWidth,
          0,
          window.innerHeight
        ),
        dimensions: getRandomDimensions(0, 3),
        rotate: getRandomIntInclusive(0, 45),
      })),
    []
  );

  const animation = !disableAnimation
    ? {
        animate: {
          opacity: [1, 0],
          scale: [1, 1],
        },
      }
    : {};

  if (disable) return null;

  return (
    <Container className="stars">
      {starz.map((star) => (
        <Star
          key={star.id}
          style={{
            width: star.dimensions.width,
            height: star.dimensions.height,
            x: star.position.x,
            y: star.position.y,
            rotate: star.rotate,
          }}
          transition={{
            repeat: Infinity,
            repeatType: "reverse",
            duration: getRandomIntInclusive(1, 10),
          }}
          {...animation}
          whileHover={{ scale: 5, transition: { duration: 0.2 }, opacity: 1 }}
        />
      ))}
    </Container>
  );
};

export default SparklingStars;
