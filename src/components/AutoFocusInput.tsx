// styling:
import { css, jsx, Theme, useTheme } from "@emotion/react";
import styled from "@emotion/styled";

// libraries:
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef } from "react";

// hooks:
import { useUIState } from "../contexts/UIContext";

// icons:
import { BiSearch } from "react-icons/bi";

const FilterContainer = styled.div`
  z-index: 10;

  position: sticky;
  top: 0;

  width: calc(100% - 2rem);
  max-width: 40rem;

  &:hover {
    svg {
      path {
        fill: ${({ theme }) => theme.colors.primary.main};
      }
    }
  }
`;

const FilterInput = styled.input`
  padding: 1.5rem 2rem;
  /* margin-bottom: 2rem; */

  border-radius: 5rem;

  background-color: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(3px);
  width: 100%;

  color: black;

  font-size: 1.25rem;
  font-weight: 600;

  &::placeholder {
    font-size: inherit;
  }
`;

const SearchIcon = styled(BiSearch)`
  position: absolute;
  right: 0;
  top: 11px;
  margin-right: 1rem;

  width: 3rem;
  height: 3rem;

  path {
    fill: ${({ theme }) => theme.colors.primary.main};
    fill: gray;
  }
`;

type InputProps = {
  filter: string;
  setFilter: React.Dispatch<React.SetStateAction<string>>;
};

const AutoFocusInput = ({ filter, setFilter }: InputProps) => {
  const filterSearchRef = useRef<HTMLInputElement>(null);
  const { isMobile } = useUIState();

  useEffect(() => {
    if (!isMobile) filterSearchRef.current?.focus();
  }, []);

  return (
    <FilterContainer>
      <FilterInput
        ref={filterSearchRef}
        placeholder="Filter monsters by name..."
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        onFocus={(e) => {
          e.stopPropagation();
        }}
        onClick={(e) => {
          e.stopPropagation();
        }}
      />
      <SearchIcon />
    </FilterContainer>
  );
};

export default AutoFocusInput;
