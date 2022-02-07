// styling:
import { css, jsx, Theme, useTheme } from "@emotion/react";
import styled from "@emotion/styled";

const Container = styled.div``;

const Header = styled.h1`
  position: relative;
  top: -2rem;

  padding: 0 1rem;
  width: 100%;

  font-weight: 700;
  font-size: 2.5rem;
  white-space: nowrap;
`;

type DefaultSidebarContentProps = {};

const DefaultSidebarContent = ({}: DefaultSidebarContentProps) => {
  return (
    <Container>
      <Header>Welcome to Akresia</Header>
    </Container>
  );
};

export default DefaultSidebarContent;
