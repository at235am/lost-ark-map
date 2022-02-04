import { useEffect, useRef, useState } from "react";
import { cursorTo } from "readline";

type Td = {
  render?: boolean;
  debounce?: number;
};

const useMousePosition = (arg?: Td) => {
  const render = arg && arg.render !== undefined ? arg.render : true;
  const debounce = arg && arg.debounce !== undefined ? arg.debounce : 0;

  const [renderedCursorPosition, setRenderedCursorPosition] = useState({
    x: 0,
    y: 0,
  });

  const cursorPositionRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const fn = (e: any) => {
      // console.log(render);
      const newPosition = { x: e.clientX, y: e.clientY };
      // setRenderedCursorPosition(newPosition);
      // if (render) setRenderedCursorPosition(newPosition);
      // else {
      cursorPositionRef.current = newPosition;
      // }
    };

    window.addEventListener("mousemove", fn);

    return () => {
      window.removeEventListener("mousemove", fn);
    };
  }, []);

  // return render ? renderedCursorPosition : cursorPositionRef.current;
  // return renderedCursorPosition;
  return cursorPositionRef.current;
};

export default useMousePosition;
