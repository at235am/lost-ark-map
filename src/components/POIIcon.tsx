import React from "react";

// libraries:
import styled from "@emotion/styled";
import { motion } from "framer-motion";

// types:
import { Poi, PoiTypes } from "./POItypes";

// svgs:
import { ReactComponent as IslandSVG } from "../assets/icons/IslandIcon.svg";
import { ReactComponent as HarborSVG } from "../assets/icons/HarborIcon.svg";
import { ReactComponent as LandingSVG } from "../assets/icons/LandingIcon.svg";
import { ReactComponent as FishingVillageSVG } from "../assets/icons/FishingVillageIcon.svg";
import { ReactComponent as GateSVG } from "../assets/icons/GateIcon.svg";
import { ReactComponent as MuddyWatersSVG } from "../assets/icons/MuddyWatersIcon.svg";
import { ReactComponent as StormWatersSVG } from "../assets/icons/StormWatersIcon.svg";
import { ReactComponent as SirenRegionSVG } from "../assets/icons/SirenRegionIcon.svg";
import { ReactComponent as StraitOfDeadSVG } from "../assets/icons/StraitOfDeadIcon.svg";

type POISvgProps = {
  colored: boolean;
};

const getPOISvg = (svg = IslandSVG) => styled(svg)<POISvgProps>`
  height: 100%;
  width: 100%;

  ${(props: POISvgProps) =>
    props.colored ? `` : `fill: white; stroke: black;`}
`;

export const POI_SVG = {
  //   replace with default later
  zone: IslandSVG,
  island: IslandSVG,
  muddyWaters: MuddyWatersSVG,
  stormWaters: StormWatersSVG,
  sirenRegion: SirenRegionSVG,
  straitOfDead: StraitOfDeadSVG,
  harbor: HarborSVG,
  landing: LandingSVG,
  fishingVillage: FishingVillageSVG,
  gate: GateSVG,
};

type PoiIconProps = {
  type: PoiTypes;
  colored?: boolean;
};

const PoiIcon = ({ type, colored = true }: PoiIconProps) => {
  const Svg = getPOISvg(POI_SVG[type]);

  return <Svg colored={colored} />;
};

export default PoiIcon;
