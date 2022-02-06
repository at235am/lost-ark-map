// styling:
import { css, jsx, Theme, useTheme } from "@emotion/react";
import styled from "@emotion/styled";

// libraries:
import { AnimatePresence, motion } from "framer-motion";
import Fuse from "fuse.js";
import { useEffect, useRef, useState } from "react";
import { Controls } from "./Map2";
import { Poi } from "./PointOfInterest";

// import rgba from "emotion-rgba";

// icons:
import {
  MdArrowBackIosNew,
  MdArrowBackIos,
  MdArrowBack,
  MdMenuBook,
  MdSearch,
  MdClose,
  MdMenu,
  MdBackHand,
} from "react-icons/md";

const Container = styled.div`
  /* border: 1px solid red; */

  z-index: 100;

  position: absolute;
  top: 0;
  left: 0;

  width: 30rem;
  padding: 1rem;

  display: flex;
  flex-direction: column;
  gap: 1rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.s}px) {
    width: 100%;
    min-width: 100%;
  }
`;

const SearchbarContainer = styled(motion.div)`
  /* border: 1px solid orange; */

  position: relative;
  background-color: ${({ theme }) => theme.colors.surface.main};

  padding: 0 0.75rem;

  height: 4rem;
  border-radius: 5rem;

  box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;

  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Input = styled.input`
  background-color: transparent;
  color: ${({ theme }) => theme.colors.onSurface.main};

  width: 100%;

  &::placeholder {
    /* color: transparent; */
  }
`;

const Button = styled(motion.button)`
  background-color: transparent;
  /* background-color: red; */

  border-radius: 50%;

  min-width: 3rem;
  min-height: 3rem;

  display: flex;
  justify-content: center;
  align-items: center;

  svg {
    width: 24px;
    height: 24px;

    fill: ${({ theme }) => theme.colors.onSurface.main};
  }

  &:hover {
    background-color: ${({ theme }) => theme.colors.surface.dark};
  }
`;

const Results = styled.div`
  /* border: 1px solid blue; */

  overflow: auto;

  height: calc(100vh / 3);
  max-height: calc(100vh / 3);

  /* @media (max-width: ${({ theme }) => theme.breakpoints.s}px) {
    height: calc(vh/3);
    max-height: calc(vh/3);
  } */
`;

const Item = styled.div`
  cursor: pointer;

  &:hover {
    color: ${({ theme }) => theme.colors.primary.main};
  }
`;

const Placeholder = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Key = styled.span`
  padding: 0.5rem;
  border-radius: 5px;
  /* background-color: ${({ theme }) => theme.colors.surface.darker}; */
  background-color: transparent;
  color: ${({ theme }) => theme.colors.surface.darker};
  /* color: #e6e6e7; */
  border: 1px solid currentColor;
`;

const buttonAnimation = {
  whileTap: { scale: 0.9 },
};

type SearchbarProps = {
  pois: Poi[];
  controls: Controls;
  showSidebar: boolean;
  isDragging: boolean;
};

const Searchbar = ({
  pois,
  controls,
  showSidebar,
  isDragging,
}: SearchbarProps) => {
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

  const inputRef = useRef<HTMLInputElement>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [searchResults, setSearchResults] = useState<Poi[]>([]);

  const fuse = new Fuse(pois, {
    keys: ["id"],
    includeScore: true,
    shouldSort: true,
    threshold: 0.3,
  });

  useEffect(() => {
    const fn = (e: any) => {
      if (inputRef.current) {
        if (e.shiftKey && e.key.toLowerCase() === "f") {
          inputRef.current.focus();
        }
      }
    };

    const d = window.addEventListener("keyup", fn);

    return () => window.removeEventListener("keyup", fn);
  }, []);

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
      <SearchbarContainer animate={{ opacity: isDragging ? 0.6 : 1 }}>
        <Button type="button" onClick={toggleSidebar} {...buttonAnimation}>
          {showSidebar ? <MdArrowBack /> : <MdMenu />}
        </Button>
        <Input
          ref={inputRef}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search..."
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        {!searchTerm && !isFocused && (
          <Placeholder>
            <Key>SHIFT</Key>
            <Key>F</Key>
          </Placeholder>
        )}
        <Button
          type="button"
          onClick={() => {
            // toggleSidebar();
            if (searchTerm) setSearchTerm("");
            if (inputRef.current) inputRef.current.focus();
          }}
          {...buttonAnimation}
        >
          {searchTerm ? <MdClose /> : <MdSearch />}
        </Button>
      </SearchbarContainer>

      {searchResults.length !== 0 && (
        <Results>
          <>
            {/* <div style={{ height: "20rem" }}>dlskfjs</div> */}
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
        </Results>
      )}
    </Container>
  );
};

export default Searchbar;
