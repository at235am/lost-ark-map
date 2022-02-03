// styling:
import styled from "@emotion/styled";
import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

const FullContainer = styled.div`
  z-index: 2;
  position: absolute;
  min-width: 100%;
  min-height: 100%;
`;

const Background = styled.div`
  z-index: -1;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  backdrop-filter: blur(2px);
  background-color: rgba(0, 0, 0, 0.85);
`;

type PortalProps = {
  children: React.ReactNode;
  portalId: string;
  disableScroll?: boolean;
  backdrop?: boolean;
  close?: () => void;
};

const Portal = ({
  children,
  portalId,
  disableScroll = false,
  backdrop = false,
  close,
}: PortalProps) => {
  const [mounted, setMounted] = useState<Boolean>(false);
  const safeElement = document.getElementById("root") as Element;
  const pageElement = useRef<Element>(safeElement);

  const renderElement = backdrop ? (
    <FullContainer>
      <Background onClick={close} />
      {children}
    </FullContainer>
  ) : (
    children
  );

  useEffect(() => {
    setMounted(true);
    pageElement.current = document.getElementById(portalId) as Element;

    if (disableScroll) document.documentElement.style.overflow = "hidden";

    return () => {
      document.documentElement.style.overflow = "auto";
    };
  }, []);

  return mounted
    ? createPortal(
        renderElement,
        pageElement.current ? pageElement.current : safeElement
      )
    : null;
};

export default Portal;
