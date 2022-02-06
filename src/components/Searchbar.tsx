// styling:
import { css, jsx, Theme, useTheme } from "@emotion/react";
import styled from "@emotion/styled";

// libraries:
import { AnimatePresence, motion } from "framer-motion";
import Fuse from "fuse.js";
import { useEffect, useRef, useState } from "react";
import DynamicPortal from "./DynamicPortal";
import { Controls } from "./Map2";
import { Poi } from "./PointOfInterest";

const Container = styled.div`
  position: fixed;

  top: 0;
  left: 0;

  border: 1px solid red;

  z-index: 100;

  /* position: absolute; */
  /* top: 0; */
  /* left: 0; */

  margin: 1rem;
`;

const Results = styled.div``;

const Item = styled.div`
  cursor: pointer;

  &:hover {
    color: ${({ theme }) => theme.colors.primary.main};
  }
`;

const Input = styled.input`
  color: black;

  width: 100%;
`;

type SearchbarProps = {
  pois: Poi[];
  controls: Controls;
};

const Searchbar = ({ pois, controls }: SearchbarProps) => {
  const {
    toggleSidebar,
    openSidebar,
    closeSidebar,
    panToCenter,
    panToElement,
    zoom,
    zoomIn,
    zoomOut,
    resetZoom,
  } = controls;

  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<Poi[]>([]);

  const fuse = new Fuse(pois, {
    keys: ["id"],
    includeScore: true,
    shouldSort: true,
    threshold: 0.3,
  });

  useEffect(() => {
    if (searchTerm === "") setSearchResults([]);
    else {
      const sr = fuse.search(searchTerm);
      const newResults = sr.map(({ item }) => item);

      setSearchResults(newResults);
    }
  }, [searchTerm, pois]);

  return (
    <Container>
      <Input
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        // onFocus={() => setIsFocused(true)}
        // onBlur={() => setIsFocused(false)}
      />

      <button onClick={toggleSidebar}>test</button>

      <Results>
        {searchResults.length !== 0 && (
          <>
            dsf
            {searchResults.map((poi) => (
              <Item
                key={poi.id}
                onClick={() => {
                  openSidebar();

                  // wait a bit here
                  panToElement(poi.id, { duration: 0.5 });
                }}
              >
                {poi.id}
              </Item>
            ))}
          </>
        )}
      </Results>
    </Container>
  );
};

export default Searchbar;
