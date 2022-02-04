// styling:
import { css, jsx, Theme, useTheme } from "@emotion/react";
import styled from "@emotion/styled";

// libraries:
import { Route, Link, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useEffect, useState } from "react";
import { DndContext } from "@dnd-kit/core";

// custom components:
// import NavigationBar from "./components/NavigationBar";
import Debug from "./components/Debug";
import Map from "./components/Map";

// pages:

const AppContainer = styled.div`
  /* border: 2px dashed lightblue; */

  position: relative;
  width: 100%;
  min-height: 100vh;

  display: flex;
  flex-direction: column;

  @media (max-width: ${({ theme }) => theme.breakpoints.s}px) {
    flex-direction: column;
  }
`;

const NotificationContainer = styled.div`
  z-index: 2;

  position: sticky;
  top: ${({ theme }) => theme.dimensions.mainNav.maxHeight}px;

  width: 100%;
  /* background-color: ${({ theme }) => theme.colors.primary.main}; */
`;

const PageContainer = styled.main`
  /* border: 2px dashed pink; */

  z-index: 1;
  position: relative;
  /* scroll-behavior: smooth; */

  /* padding-bottom: 2rem; */
  /* padding-top: 2rem; */

  flex: 1;

  display: flex;
  flex-direction: column;
`;

const App = () => {
  const theme = useTheme();
  const { pathname } = useLocation();

  useEffect(() => {
    // When we change routes (clicking a link to go on another page),
    // the scroll position does NOT get reset because the scroll bar
    // is on the html element (which is outside of this component).
    // Therefore we need to reset the scroll position manually every time
    // the pathname changes (this excludes #links which is ideal).
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <AppContainer id="app">
      <Helmet>
        <meta name="theme-color" content={theme.colors.background.main} />
      </Helmet>
      {/* <NavigationBar /> */}
      <NotificationContainer id="main-notification" />
      <PageContainer className="page-container" id="page-container">
        {/* <div style={{ height: "20rem" }}>you</div> */}
        <Map minZoomLevel={-3} maxZoomLevel={12} step={250} />
        {/* <Map minZoomLevel={-20} maxZoomLevel={15} step={250} /> */}

        {/* <Switch>
      
        </Switch> */}
      </PageContainer>
      {/* <Footer /> */}
    </AppContainer>
  );
};

export default App;
