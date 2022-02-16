import { nanoid } from "nanoid";
import { Position } from "../components/Map2";
// edited in POI branch
// import { Poi, PoiTypes } from "../components/PointOfInterest";
import { Poi, PoiTypes } from "../components/POItypes";

export const getRandomIntInclusive = (min: number, max: number) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
};

export const generatePois = (numberOfPois: number) => {
  const t: Poi[] = [...Array(numberOfPois).keys()].map(() => ({
    id: nanoid(4),
    type: "island",
    position: {
      x: getRandomIntInclusive(0, 2100),
      y: getRandomIntInclusive(0, 1600),
    },
  }));

  return t;
};

export const loadImage = (
  setImageDimensions: React.Dispatch<
    React.SetStateAction<{
      width: number;
      height: number;
    }>
  >,
  imageUrl: string
) => {
  const img = new Image();
  img.src = imageUrl;

  img.onload = () => {
    setImageDimensions({
      width: img.width,
      height: img.height,
    });
  };
  img.onerror = (err) => {
    console.log("img error");
    console.error(err);
  };
};

export const ORIGIN: Position = { x: 0, y: 0 };

export const clamp = (num: number, min: number, max: number) =>
  Math.max(min, Math.min(num, max));
