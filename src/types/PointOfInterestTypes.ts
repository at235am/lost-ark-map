export type PoiTypes =
  // zone = land region (i.e. papunika, etc.)
  | "zone"
  | "island"
  // | "hazardousWaters"
  | "harbor"
  | "landing"
  | "fishingVillage"
  | "gate"
  | "muddyWaters"
  | "stormWaters"
  | "sirenRegion"
  | "straitOfDead"; // will be revised

// export type Waters =
//   | "muddyWaters"
//   | "stormWaters"
//   | "sirenRegion"
//   | "straitOfDead";

export type PoiData = {
  id: string;
  type: PoiTypes;
  position: { x: number; y: number };
  // Screenshots & User Submitted Photos, etc.
  name?: string;
  imgUrls?: string[];
  // fix in later files
};

// export type Zone = Poi & {
//   type: "zone";
// };

export type Island = PoiData & {
  type: "island";
  islandHearts?: number;
  //
  mokokoSeeds?: number;
  //
  recommendedGearScore?: number;
  availability?: string;
  bifrost?: string;
  bossAppearance?: string;
  localEvent?: string;
  //
  pvp?: string;
  description?: string;
  //   may be added or redudant later on
  //   specialNote?: string;
  rewards?: string;
  //
  craftingResources?: string;
  craftMaterialRank?: string;
  //
  givana?: boolean;
  territorialStatus?: string;
};

// export type HazardousWaters = Poi & {
//   // type: "hazardousWaters";
//   water: Waters;
//   level: number;
//   shipStability: number;
// };

export type MuddyWaters = PoiData & {
  type: "muddyWaters";
  level?: number;
  shipStability?: number;
};

export type StormWaters = PoiData & {
  type: "stormWaters";
  level?: number;
  shipStability?: number;
};

export type SirenRegion = PoiData & {
  type: "sirenRegion";
  level?: number;
  shipStability?: number;
};

export type StraitOfDead = PoiData & {
  type: "straitOfDead";
  level?: number;
  shipStability?: number;
};

export type Harbor = PoiData & {
  type: "harbor";
};

export type Landing = PoiData & {
  type: "landing";
};

export type FishingVillage = PoiData & {
  type: "fishingVillage";
  description?: string;
  pirateCoins?: number;
};

export type Gate = PoiData & {
  type: "gate";
  recommendedGearScore?: number;
  acquisitionCapable?: boolean;
  availability?: string;
  description?: string;
  requirements?: string;
};

export type Poi =
  | Island
  | MuddyWaters
  | StormWaters
  | SirenRegion
  | StraitOfDead
  | Harbor
  | Landing
  | FishingVillage
  | Gate;
