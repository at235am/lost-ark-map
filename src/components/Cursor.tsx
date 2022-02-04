// styling:
import { css, jsx, Theme, useTheme } from "@emotion/react";
import styled from "@emotion/styled";

// libraries:
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const Container = styled(motion.div)`
  z-index: 1000;

  position: fixed;
  top: 0;
  left: 0;

  pointer-events: none;
`;

type CursorProps = {
  children?: React.ReactNode;
  showPosition?: boolean;
};

const Cursor = ({ children, showPosition = false }: CursorProps) => {
  const [pos, setPos] = useState({ x: 0, y: 0 });

  const { x, y } = pos;
  useEffect(() => {
    const fn = (e: any) => {
      // console.log("test");

      // console.log(e.clientX);
      setPos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", fn);

    return () => {
      window.removeEventListener("mousemove", fn);
    };
  }, []);
  return (
    <Container animate={{ x, y }} transition={{ duration: 0 }}>
      {children}
      {showPosition && JSON.stringify(pos)}
    </Container>
  );
};
export default Cursor;
