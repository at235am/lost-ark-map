import React from "react";

// styling libraries:
import styled from "@emotion/styled";
import { motion } from "framer-motion";

// types:
import {
  Poi,
  PoiTypes,
  Island,
  MuddyWaters,
  SirenRegion,
  StraitOfDead,
  Harbor,
  Landing,
  FishingVillage,
  Gate,
} from "../types/PointOfInterestTypes";

type PoiDetailsProps = {
  poi: Poi;
};

type IslandDetailsProps = {
  poi: Island;
};

type MuddyWatersDetailsProps = {
  poi: MuddyWaters;
};

type SirenRegionDetailsProps = {
  poi: SirenRegion;
};

type StraitOfDeadDetailsProps = {
  poi: StraitOfDead;
};

type HarborDetailsProps = {
  poi: Harbor;
};

type LandingDetailsProps = {
  poi: Landing;
};

type FishingVillageDetailsProps = {
  poi: FishingVillage;
};

type GateDetailsProps = {
  poi: Gate;
};

const IslandDetails = ({ poi }: IslandDetailsProps) => {
  return <div>Hey I'm Island Info! {poi.islandHearts} </div>;
};

const MuddyWaterDetails = ({ poi }: MuddyWatersDetailsProps) => {
  return <div>Hey I'm Muddy Water Info! {poi.level} </div>;
};

const PointOfInterestDetails = ({ poi }: PoiDetailsProps) => {
  //   console.log(poi);
  //   console.log(poi.type);
  return (
    <div>
      Point Of Interest Data
      <header>
        {poi.id}
        {poi.name}
      </header>
      {/* {"?"} */}
      {/* {poi} */}
      {poi.type == "island" ? poi.islandHearts : "not"}
      {poi.type == "island" ? <IslandDetails poi={poi} /> : "not"}
    </div>
  );
};

export default PointOfInterestDetails;
