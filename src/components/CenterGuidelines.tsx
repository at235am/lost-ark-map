// styling:
import styled from "@emotion/styled";

const VerticalLine = styled.div`
  z-index: 9999;
  position: absolute;
  left: calc(100% / 2);
  /* left: 500px; */
  width: 1px;
  height: 100%;
  background-color: yellow;
`;

const HorizontalLine = styled.div`
  position: absolute;
  z-index: 9999;

  top: calc(100% / 2);
  /* top: 400px; */
  width: 100%;
  height: 1px;
  background-color: yellow;
`;

const CenterGuidelines = () => {
  return (
    <>
      <VerticalLine />
      <HorizontalLine />
    </>
  );
};

export default CenterGuidelines;
