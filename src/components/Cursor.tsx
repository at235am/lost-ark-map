// styling:
import { css, jsx, Theme, useTheme } from "@emotion/react";
import styled from "@emotion/styled";

// libraries:
import { motion, MotionValue } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Position } from "./Map2";

const Container = styled(motion.div)`
  z-index: 1000;

  position: fixed;
  top: 0;
  left: 0;

  cursor: none;

  pointer-events: none;
`;

const Coordinate = styled.div<{ i: number }>`
  position: absolute;
  top: -${({ i }) => i * 2}rem;
  padding: 5px;

  white-space: nowrap;

  background-color: black;
  color: white;
`;

const Box = styled.div`
  border: 2px solid yellow;
  width: 20px;
  height: 20px;
`;

type CursorProps = {
  children?: React.ReactNode;
  showPosition?: boolean;
  offset?: {
    x: MotionValue<number>;
    y: MotionValue<number>;
    scale: MotionValue<number>;
  };
  exclusive?: boolean;
  findPositionOnMap: (position: Position) => Position;
};

const Cursor = ({
  children,
  showPosition = false,
  offset,
  exclusive = false,
  findPositionOnMap,
}: CursorProps) => {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [snapshot, setSnapshot] = useState({ x: 0, y: 0 });

  const { x, y } = pos;
  const { x: sx, y: sy } = snapshot;

  useEffect(() => {
    const fn = (e: any) => {
      setPos({ x: e.clientX, y: e.clientY });
    };
    const fn2 = (e: any) => {
      // the cursor relative to the viewPORT:
      const px = e.clientX;
      const py = e.clientY;

      const ss = findPositionOnMap({ x: px, y: py });

      setSnapshot(ss);
    };

    window.addEventListener("mousemove", fn);
    window.addEventListener("click", fn2);

    return () => {
      window.removeEventListener("mousemove", fn);
      window.removeEventListener("click", fn2);
    };
  }, []);

  useEffect(() => {
    // document.body.style.cursor = "none";
    // if (exclusive) {
    //   document.body.style.cursor = "none";
    // } else {
    // }
  }, [exclusive]);

  return (
    <Container animate={{ x, y }} transition={{ duration: 0 }}>
      <Box />
      <Coordinate i={1}>
        {sx}, {sy}
      </Coordinate>
      {showPosition && (
        <Coordinate i={2}>
          {x}, {y}
        </Coordinate>
      )}
    </Container>
  );
};
export default Cursor;
