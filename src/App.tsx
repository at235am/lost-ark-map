// styling:
import { css, jsx, Theme, useTheme } from "@emotion/react";
import styled from "@emotion/styled";

// libraries:
import { Route, Link, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useEffect, useState } from "react";

// custom components:
// import NavigationBar from "./components/NavigationBar";
import Debug from "./components/Debug";
import Map from "./components/Map";
import Map2 from "./components/Map2";
import { generatePois } from "./utils/utils";

// pages:

const AppContainer = styled.div`
  /* border: 2px dashed red; */

  position: relative;
  width: 100%;
  height: 100%;

  /* min-height: 100vh; */

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
  /* border: 2px dashed blue; */

  z-index: 1;
  position: relative;
  /* scroll-behavior: smooth; */

  /* padding-bottom: 2rem; */
  /* padding-top: 2rem; */

  height: 100%;

  /* flex: 1; */

  /* height: 100%; */

  display: flex;
  flex-direction: column;
  align-items: stretch;

  /* align-items: center; */
`;

const A = styled.div`
  border: 2px solid yellow;
  min-height: 200px;
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

      <PageContainer id="page-container">
        {/* <A></A>
        <A></A>
        <A></A>
        <A></A>
        <A></A> */}
        {/* <Map minZoomLevel={-3} maxZoomLevel={12} step={250} /> */}

        <Map2
          showCenterGridlines={false}
          step={0.2}
          minZoomScale={0.5}
          maxZoomScale={2}
        />

        {/* <Switch>
      
        </Switch> */}
      </PageContainer>
      {/* <Footer /> */}
    </AppContainer>
  );
};

export default App;
