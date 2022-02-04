// styling:
import { css, jsx, Theme, useTheme } from "@emotion/react";
import styled from "@emotion/styled";

// libraries:
import { AnimatePresence, motion } from "framer-motion";
import Fuse from "fuse.js";
import { useEffect, useRef, useState } from "react";
import { Poi } from "./PointOfInterest";

const Container = styled.div`
  z-index: 200;

  position: absolute;
  top: 0;
  left: 0;

  margin: 1rem;
`;

const Input = styled.input`
  color: black;
`;

const Item = styled.div`
  cursor: pointer;

  &:hover {
    color: ${({ theme }) => theme.colors.primary.main};
  }
`;

const Marker = styled(motion.div)`
  /* cursor: pointer; */
  z-index: 1000;

  position: absolute;

  width: 3rem;
  height: 3rem;

  border: 5px solid yellow;
  border-radius: 50%;

  background-color: transparent;

  &:hover {
    color: ${({ theme }) => theme.colors.primary.main};
  }
`;

type SearchbarProps = {
  pois: Poi[];
  panToElement: (id: string, transition: any) => void;
};

const Searchbar = ({ pois, panToElement }: SearchbarProps) => {
  const [searchResults, setSearchResults] = useState<Poi[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showMarker, setShowMarker] = useState(true);

  const center = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

  const fuse = new Fuse(pois, {
    keys: ["id"],
    includeScore: true,
    shouldSort: true,
    threshold: 0.3,
  });

  const animProps = {
    // variants: pageVariants,
    variants: {
      enter: {
        x: -100,
        y: center.y,
        opacity: 1,
      },
      center: {
        x: center.x,
        y: center.y,

        opacity: 1,
      },
      exit: {
        // zIndex: 0,
        x: 2000,
        y: center.y,
        opacity: 0,
      },
    },
    initial: "enter",
    animate: "center",
    exit: "exit",
    transition: {
      // x: { type: "spring", stiffness: 300, damping: 30 },
      // opacity: { duration: 0.2 },
      duration: 0.5,
      // delay: 0.5,
    },
  };

  useEffect(() => {
    if (searchTerm === "") setSearchResults([]);
    else {
      const sr = fuse.search(searchTerm);
      const newResults = sr.map(({ item }) => item);

      setSearchResults(newResults);
    }
  }, [searchTerm, pois]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    const fn = () => {
      setShowMarker(false);
    };
    if (showMarker) {
      timer = setTimeout(fn, 5000);
    }

    return () => {
      clearTimeout(timer);
    };
  }, [showMarker]);

  return (
    <>
      <AnimatePresence>
        {showMarker && (
          <Marker
            // animate={{ x: center.x, y: center.y }}

            {...animProps}
          />
        )}
      </AnimatePresence>

      <Container>
        <Input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {searchResults.map((poi) => (
          <Item
            key={poi.id}
            onClick={() => {
              setShowMarker(true);
              panToElement(poi.id, { duration: 0.5 });
            }}
          >
            {poi.id}
          </Item>
        ))}
      </Container>
    </>
  );
};

export default Searchbar;
